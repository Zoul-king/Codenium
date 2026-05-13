import { NextResponse } from "next/server";
import { MilestoneStatus as PrismaMilestoneStatus } from "@prisma/client";

import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import {
  decodeMilestoneDescription,
  encodeMilestoneDescription,
  isValidPhase
} from "./encoding";
import type { MilestonePhase } from "@/lib/types/domain";

type ClientStatus = "next" | "current" | "done";

function toDbStatus(value: unknown): PrismaMilestoneStatus {
  if (value === "done") return PrismaMilestoneStatus.COMPLETED;
  if (value === "current") return PrismaMilestoneStatus.IN_PROGRESS;
  return PrismaMilestoneStatus.PENDING;
}

async function canManageProject(projectId: string, session: Awaited<ReturnType<typeof getCurrentSession>>) {
  if (!session) return false;
  if (session.user.role === "admin") return true;

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { pmId: true }
  });
  if (!project) return false;

  return session.user.role === "pm" && project.pmId === session.user.id;
}

// Crear un hito (solo PM asignado o admin).
export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: {
    projectId?: string;
    title?: string;
    summary?: string;
    date?: string;
    status?: ClientStatus;
    phase?: MilestonePhase;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const projectId = typeof body.projectId === "string" ? body.projectId.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const summary = typeof body.summary === "string" ? body.summary.trim() : "";
  const date = typeof body.date === "string" && body.date ? new Date(body.date) : null;
  const phase = isValidPhase(body.phase) ? body.phase : null;

  if (!projectId || !title || !summary || !date) {
    return NextResponse.json({ error: "Faltan datos para crear el hito." }, { status: 400 });
  }

  if (!(await canManageProject(projectId, session))) {
    return NextResponse.json({ error: "Acceso restringido al proyecto." }, { status: 403 });
  }

  try {
    const last = await db.milestone.findFirst({
      where: { projectId },
      orderBy: { order: "desc" },
      select: { order: true }
    });

    const milestone = await db.milestone.create({
      data: {
        projectId,
        title,
        description: encodeMilestoneDescription(phase, summary),
        dueDate: date,
        status: toDbStatus(body.status ?? "next"),
        order: (last?.order ?? 0) + 1,
        completedAt: body.status === "done" ? new Date() : null
      }
    });

    return NextResponse.json(milestone, { status: 201 });
  } catch (error) {
    console.error("[milestones POST]", {
      error: error instanceof Error ? error.message.split("\n")[0] : String(error)
    });
    return NextResponse.json({ error: "No se pudo crear el hito." }, { status: 500 });
  }
}

// Actualizar un hito (cambiar título, fecha o estado).
export async function PATCH(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: {
    id?: string;
    title?: string;
    summary?: string;
    date?: string;
    status?: ClientStatus;
    phase?: MilestonePhase;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!id) {
    return NextResponse.json({ error: "Falta el id del hito." }, { status: 400 });
  }

  const existing = await db.milestone.findUnique({
    where: { id },
    select: { projectId: true, description: true }
  });
  if (!existing) {
    return NextResponse.json({ error: "Hito no encontrado." }, { status: 404 });
  }

  if (!(await canManageProject(existing.projectId, session))) {
    return NextResponse.json({ error: "Acceso restringido al proyecto." }, { status: 403 });
  }

  const decoded = decodeMilestoneDescription(existing.description);
  // Si el body actualiza summary y/o phase, reconstruimos el description.
  // - summary nuevo o el actual decodificado.
  // - phase nueva (si vino válida) o la actual.
  const hasSummary = typeof body.summary === "string";
  const hasPhase = body.phase !== undefined;
  const nextPhase = hasPhase && isValidPhase(body.phase) ? body.phase : decoded.phase;
  const nextSummary = hasSummary ? body.summary!.trim() : decoded.description;

  const data: Record<string, unknown> = {};
  if (typeof body.title === "string" && body.title.trim()) data.title = body.title.trim();
  if (hasSummary || hasPhase) {
    data.description = encodeMilestoneDescription(nextPhase, nextSummary);
  }
  if (typeof body.date === "string" && body.date) data.dueDate = new Date(body.date);
  if (body.status) {
    data.status = toDbStatus(body.status);
    if (body.status === "done") {
      data.completedAt = new Date();
    } else {
      data.completedAt = null;
    }
  }

  try {
    const milestone = await db.milestone.update({ where: { id }, data });

    // Cuando cambia el estado, recalculamos y persistimos el progreso del
    // proyecto para que el porcentaje sea consistente entre sesiones (cliente,
    // PM y admin) sin depender del estado local del store.
    if (body.status) {
      const siblings = await db.milestone.findMany({
        where: { projectId: existing.projectId },
        select: { status: true }
      });
      const total = siblings.length;
      const done = siblings.filter((m) => m.status === PrismaMilestoneStatus.COMPLETED).length;
      const progress = total > 0 ? Math.round((done / total) * 100) : 0;
      await db.project.update({ where: { id: existing.projectId }, data: { progress } });
    }

    return NextResponse.json(milestone);
  } catch (error) {
    console.error("[milestones PATCH]", {
      error: error instanceof Error ? error.message.split("\n")[0] : String(error)
    });
    return NextResponse.json({ error: "No se pudo actualizar el hito." }, { status: 500 });
  }
}
