import { NextResponse } from "next/server";
import { DocumentType } from "@prisma/client";

import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

function mapKindToCategory(kind: unknown): DocumentType {
  if (typeof kind !== "string") return DocumentType.OTHER;
  const v = kind.toUpperCase();
  if (v === "PROPOSAL" || v === "PROPUESTA") return DocumentType.PROPOSAL;
  if (v === "CONTRACT" || v === "CONTRATO") return DocumentType.CONTRACT;
  if (v === "BRIEF") return DocumentType.BRIEF;
  if (v === "DELIVERABLE" || v === "ENTREGABLE") return DocumentType.DELIVERABLE;
  if (v === "INVOICE" || v === "FACTURA") return DocumentType.INVOICE;
  return DocumentType.OTHER;
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: {
    projectId?: string;
    title?: string;
    kind?: string;
    href?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const projectId = typeof body.projectId === "string" ? body.projectId.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const href = typeof body.href === "string" && body.href.trim() ? body.href.trim() : "#";

  if (!projectId || !title) {
    return NextResponse.json({ error: "Faltan datos para registrar el documento." }, { status: 400 });
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { clientId: true, pmId: true }
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

  try {
    const created = await db.document.create({
      data: {
        projectId,
        uploadedById: session.user.id,
        name: title,
        fileUrl: href,
        category: mapKindToCategory(body.kind)
      }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[documents POST]", {
      error: error instanceof Error ? error.message.split("\n")[0] : String(error)
    });
    return NextResponse.json({ error: "No se pudo registrar el documento." }, { status: 500 });
  }
}
