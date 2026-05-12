import { NextResponse } from "next/server";
import { ChangeImpact, ChangeRequestStatus } from "@prisma/client";

import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { decodeDescription, encodeDescription, normalizeChangeType } from "../encoding";

interface Context {
  params: Promise<{ id: string }>;
}

function impactToPriority(impact: ChangeImpact): "low" | "medium" | "high" {
  if (impact === "HIGH") return "high";
  if (impact === "LOW") return "low";
  return "medium";
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

function domainStatusToDb(status: string): ChangeRequestStatus | null {
  switch (status) {
    case "in_review":
      return ChangeRequestStatus.REVIEWING;
    case "planned":
      return ChangeRequestStatus.APPROVED;
    case "done":
      return ChangeRequestStatus.IMPLEMENTED;
    case "rejected":
      return ChangeRequestStatus.REJECTED;
    case "new":
      return ChangeRequestStatus.PENDING;
    default:
      return null;
  }
}

export async function PATCH(request: Request, ctx: Context) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await ctx.params;

  const existing = await db.changeRequest.findUnique({
    where: { id },
    include: { project: { select: { id: true, clientId: true, pmId: true } } }
  });
  if (!existing) {
    return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 });
  }

  const isAdmin = session.user.role === "admin";
  const isPm = session.user.role === "pm" && existing.project.pmId === session.user.id;

  if (!isAdmin && !isPm) {
    return NextResponse.json({ error: "Solo el PM asignado o un admin pueden actualizar." }, { status: 403 });
  }

  let body: { status?: string; changeType?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  // El PATCH soporta dos operaciones combinables: cambiar status y/o asignar
  // el tipo de cambio (sólo el PM/admin lo asigna). El status es opcional si
  // venimos a actualizar sólo el tipo.
  const nextStatus = body.status !== undefined ? domainStatusToDb(String(body.status)) : "noop";
  if (nextStatus === null) {
    return NextResponse.json({ error: "Estado no válido." }, { status: 400 });
  }

  const updatedType = body.changeType !== undefined ? normalizeChangeType(body.changeType) : "keep";

  try {
    // Decodificamos lo que ya hay para preservar/actualizar marcadores.
    const decoded = decodeDescription(existing.description);

    // Si el PM está aceptando o moviendo a "en progreso", re-anclamos al hito
    // que esté en curso ahora — visualmente el cambio se asocia al hito vigente
    // cuando el PM decide.
    let nextMilestoneId = decoded.milestoneId;
    const becomesAccepted =
      nextStatus !== "noop" &&
      (nextStatus === ChangeRequestStatus.APPROVED || nextStatus === ChangeRequestStatus.REVIEWING);

    if (becomesAccepted) {
      const current = await db.milestone.findFirst({
        where: { projectId: existing.projectId, status: "IN_PROGRESS" },
        select: { id: true },
        orderBy: { dueDate: "asc" }
      });
      nextMilestoneId = current?.id ?? decoded.milestoneId;
    }

    const finalType = updatedType === "keep" ? decoded.changeType : updatedType;
    const nextDescription = encodeDescription(nextMilestoneId, finalType, decoded.description);

    const updated = await db.changeRequest.update({
      where: { id },
      data: {
        ...(nextStatus !== "noop" ? { status: nextStatus } : {}),
        description: nextDescription
      },
      include: { project: { select: { clientId: true } } }
    });

    const decodedFinal = decodeDescription(updated.description);

    return NextResponse.json({
      id: updated.id,
      projectId: updated.projectId,
      clientId: updated.project.clientId,
      milestoneId: decodedFinal.milestoneId ?? undefined,
      title: updated.title,
      detail: decodedFinal.description,
      priority: impactToPriority(updated.impact),
      changeType: decodedFinal.changeType ?? undefined,
      status: dbStatusToDomain(updated.status),
      requestedAt: updated.createdAt.toISOString().split("T")[0]
    });
  } catch (error) {
    console.error("[change-requests/:id PATCH]", {
      error: error instanceof Error ? error.message.split("\n")[0] : String(error)
    });
    return NextResponse.json({ error: "No se pudo actualizar la solicitud." }, { status: 500 });
  }
}
