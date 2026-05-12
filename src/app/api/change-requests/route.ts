import { NextResponse } from "next/server";
import { ChangeImpact, ChangeRequestStatus } from "@prisma/client";

import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

// El esquema de ChangeRequest no tiene columna milestoneId. Para no requerir
// migración, codificamos el hito asociado al inicio de la descripción con un
// marcador [m:<id>]; al leer lo extraemos para devolver milestoneId al cliente.
const MILESTONE_PREFIX = /^\[m:([^\]]+)\]\s*/;

function encodeDescription(milestoneId: string | null, description: string) {
  return milestoneId ? `[m:${milestoneId}] ${description}` : description;
}

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
  const { milestoneId, description } = decodeDescription(record.description);
  return {
    id: record.id,
    projectId: record.projectId,
    clientId: record.project.clientId,
    milestoneId: milestoneId ?? undefined,
    title: record.title,
    detail: description,
    priority: impactToPriority(record.impact),
    status: dbStatusToDomain(record.status),
    requestedAt: record.createdAt.toISOString().split("T")[0]
  };
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
    milestoneId?: string | null;
    title?: string;
    detail?: string;
    priority?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const projectId = typeof body.projectId === "string" ? body.projectId.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const detail = typeof body.detail === "string" ? body.detail.trim() : "";
  const milestoneId =
    typeof body.milestoneId === "string" && body.milestoneId.trim() ? body.milestoneId.trim() : null;

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

  if (milestoneId) {
    const milestone = await db.milestone.findUnique({
      where: { id: milestoneId },
      select: { id: true, projectId: true }
    });
    if (!milestone || milestone.projectId !== projectId) {
      return NextResponse.json({ error: "Hito inválido para este proyecto." }, { status: 400 });
    }
  }

  try {
    const created = await db.changeRequest.create({
      data: {
        projectId,
        requestedById: session.user.id,
        title,
        description: encodeDescription(milestoneId, detail),
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
