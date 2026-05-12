import { NextResponse } from "next/server";
import { ChangeImpact, ChangeRequestStatus } from "@prisma/client";

import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

import { decodeDescription, encodeDescription, normalizeChangeType } from "./encoding";

function impactToPriority(impact: ChangeImpact): "low" | "medium" | "high" {
  if (impact === "HIGH") return "high";
  if (impact === "LOW") return "low";
  return "medium";
}

function priorityToImpact(priority: unknown): ChangeImpact {
  if (priority === "high") return "HIGH";
  if (priority === "low") return "LOW";
  return "MEDIUM";
}

function dbStatusToDomain(status: ChangeRequestStatus): "new" | "in_review" | "planned" | "done" | "rejected" {
  switch (status) {
    case "REVIEWING":
      return "in_review";
    case "APPROVED":
      return "planned";
    case "IMPLEMENTED":
      return "done";
    case "REJECTED":
      return "rejected";
    default:
      return "new";
  }
}

interface DbChangeRequest {
  id: string;
  projectId: string;
  title: string;
  description: string;
  impact: ChangeImpact;
  status: ChangeRequestStatus;
  createdAt: Date;
  project: { clientId: string };
}

function toDomain(record: DbChangeRequest) {
  const { milestoneId, changeType, description } = decodeDescription(record.description);
  return {
    id: record.id,
    projectId: record.projectId,
    clientId: record.project.clientId,
    milestoneId: milestoneId ?? undefined,
    title: record.title,
    detail: description,
    priority: impactToPriority(record.impact),
    changeType: changeType ?? undefined,
    status: dbStatusToDomain(record.status),
    requestedAt: record.createdAt.toISOString().split("T")[0]
  };
}

// El cambio del cliente siempre se asocia visualmente al hito que esté en
// progreso en ese momento. Si no hay ninguno, dejamos sin hito.
async function resolveCurrentMilestoneId(projectId: string): Promise<string | null> {
  const current = await db.milestone.findFirst({
    where: { projectId, status: "IN_PROGRESS" },
    select: { id: true },
    orderBy: { dueDate: "asc" }
  });
  return current?.id ?? null;
}

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const where =
      session.user.role === "admin"
        ? {}
        : session.user.role === "client"
          ? { project: { clientId: session.user.id } }
          : { project: { pmId: session.user.id } };

    const items = await db.changeRequest.findMany({
      where,
      include: { project: { select: { clientId: true } } },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(items.map(toDomain));
  } catch (error) {
    console.error("[change-requests GET]", {
      error: error instanceof Error ? error.message.split("\n")[0] : String(error)
    });
    return NextResponse.json({ error: "No se pudieron obtener las solicitudes." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: {
    projectId?: string;
    title?: string;
    detail?: string;
    priority?: string;
    changeType?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const projectId = typeof body.projectId === "string" ? body.projectId.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const detail = typeof body.detail === "string" ? body.detail.trim() : "";
  const changeType = normalizeChangeType(body.changeType);

  if (!projectId || !title || !detail) {
    return NextResponse.json({ error: "Faltan datos para registrar el cambio." }, { status: 400 });
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { id: true, clientId: true, pmId: true }
  });
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
  }

  const isAdmin = session.user.role === "admin";
  const isClient = session.user.role === "client" && project.clientId === session.user.id;
  const isPm = session.user.role === "pm" && project.pmId === session.user.id;

  if (!isAdmin && !isClient && !isPm) {
    return NextResponse.json({ error: "Acceso restringido al proyecto." }, { status: 403 });
  }

  // El cambio se ancla automáticamente al hito en progreso. El cliente no
  // elige hito y el PM tampoco — el sistema lo decide a partir del estado
  // actual del proyecto.
  const milestoneId = await resolveCurrentMilestoneId(projectId);

  try {
    const created = await db.changeRequest.create({
      data: {
        projectId,
        requestedById: session.user.id,
        title,
        description: encodeDescription(milestoneId, changeType, detail),
        impact: priorityToImpact(body.priority)
      },
      include: { project: { select: { clientId: true } } }
    });

    return NextResponse.json(toDomain(created), { status: 201 });
  } catch (error) {
    console.error("[change-requests POST]", {
      error: error instanceof Error ? error.message.split("\n")[0] : String(error)
    });
    return NextResponse.json({ error: "No se pudo registrar el cambio." }, { status: 500 });
  }
}
