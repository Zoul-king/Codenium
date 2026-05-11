import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import {
  BillingModel,
  PlanCategory,
  PlanTier,
  ProjectStatus,
  ProjectType,
  QuoteStatus
} from "@prisma/client";

import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { sendProjectAssignmentEmail } from "@/server/email";

// Crea un proyecto para un cliente sin cotización previa. Para satisfacer la
// restricción Project.quoteId @unique se genera una cotización "interna"
// marcada como APPROVED, equivalente a la que se crearía al aceptar una.
export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: {
    clientId?: string;
    pmId?: string;
    name?: string;
    description?: string;
    dueDate?: string;
    budget?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const clientId = typeof body.clientId === "string" ? body.clientId.trim() : "";
  const pmId = typeof body.pmId === "string" && body.pmId.trim() ? body.pmId.trim() : null;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const dueDate = typeof body.dueDate === "string" && body.dueDate ? new Date(body.dueDate) : null;
  const budget = typeof body.budget === "number" && Number.isFinite(body.budget) ? body.budget : null;

  if (!clientId || !name) {
    return NextResponse.json({ error: "Cliente y nombre del proyecto son obligatorios." }, { status: 400 });
  }

  const client = await db.user.findUnique({ where: { id: clientId } });
  if (!client) {
    return NextResponse.json({ error: "Cliente no encontrado." }, { status: 404 });
  }

  let resolvedPmId: string | null = null;
  if (pmId) {
    const pm = await db.user.findUnique({ where: { id: pmId }, select: { id: true, role: true } });
    if (pm && pm.role === "PM") {
      resolvedPmId = pm.id;
    }
  }

  try {
    const folio = `Q-DIRECT-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;

    const project = await db.$transaction(async (tx) => {
      const quote = await tx.quote.create({
        data: {
          folio,
          clientId,
          title: name,
          description: description || `Proyecto creado directamente por el admin (${session.user.name}).`,
          projectType: ProjectType.OTHER,
          planCategory: PlanCategory.PERSONAL,
          planTier: PlanTier.ONE_TIME,
          billingModel: BillingModel.ONE_TIME,
          estimatedPrice: budget,
          status: QuoteStatus.APPROVED
        }
      });

      return tx.project.create({
        data: {
          quoteId: quote.id,
          clientId,
          pmId: resolvedPmId,
          name,
          description: description || null,
          status: ProjectStatus.PENDING,
          dueDate,
          budget
        },
        include: {
          client: { select: { id: true, firstName: true, lastName: true, email: true } },
          pm: { select: { id: true, firstName: true, lastName: true, email: true } },
          quote: true
        }
      });
    });

    // Notificar a cliente y PM (mismo flujo que aceptar una cotización).
    if (project.pm && project.client) {
      const clientName = `${project.client.firstName} ${project.client.lastName}`.trim();
      const pmName = `${project.pm.firstName} ${project.pm.lastName}`.trim();

      try {
        await Promise.all([
          sendProjectAssignmentEmail({
            recipientEmail: project.client.email,
            recipientName: clientName,
            quoteCode: project.quote.folio,
            quoteTitle: project.quote.title,
            projectName: project.name,
            counterpartLabel: "PM asignado",
            counterpartName: pmName
          }),
          sendProjectAssignmentEmail({
            recipientEmail: project.pm.email,
            recipientName: pmName,
            quoteCode: project.quote.folio,
            quoteTitle: project.quote.title,
            projectName: project.name,
            counterpartLabel: "Cliente",
            counterpartName: clientName
          })
        ]);
      } catch (error) {
        console.error("[projects] no se pudo enviar la notificación", {
          error: error instanceof Error ? error.message.split("\n")[0] : String(error)
        });
      }
    }

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("[projects] no se pudo crear", {
      error: error instanceof Error ? error.message.split("\n")[0] : String(error)
    });
    return NextResponse.json({ error: "No se pudo crear el proyecto." }, { status: 500 });
  }
}
