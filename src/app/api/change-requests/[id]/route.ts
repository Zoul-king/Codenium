import { NextResponse } from "next/server";
import { ChangeImpact, ChangeRequestStatus } from "@prisma/client";

import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

interface Context {
  params: Promise<{ id: string }>;
}

const MILESTONE_PREFIX = /^\[m:([^\]]+)\]\s*/;

function decodeDescription(raw: string): { milestoneId: string | null; description: string } {
  const match = raw.match(MILESTONE_PREFIX);
  if (match) {
    return { milestoneId: match[1], description: raw.replace(MILESTONE_PREFIX, "") };
  }
  return { milestoneId: null, description: raw };
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

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const nextStatus = domainStatusToDb(String(body.status ?? ""));
  if (!nextStatus) {
    return NextResponse.json({ error: "Estado no válido." }, { status: 400 });
  }

  try {
    const updated = await db.changeRequest.update({
      where: { id },
      data: { status: nextStatus },
      include: { project: { select: { clientId: true } } }
    });

    const { milestoneId, description } = decodeDescription(updated.description);

    return NextResponse.json({
      id: updated.id,
      projectId: updated.projectId,
      clientId: updated.project.clientId,
      milestoneId: milestoneId ?? undefined,
      title: updated.title,
      detail: description,
      priority: impactToPriority(updated.impact),
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
