import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

interface Context {
  params: Promise<{ id: string }>;
}

async function loadAccessibleProject(projectId: string) {
  return db.project.findUnique({
    where: { id: projectId },
    select: { id: true, clientId: true, pmId: true, repositoryUrl: true }
  });
}

// Devuelve metadatos puntuales del proyecto que el cliente/PM necesita en
// pantallas como Entregables (URL del repositorio, IDs de partes implicadas).
export async function GET(_request: Request, ctx: Context) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const project = await loadAccessibleProject(id);
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
  }

  const isAdmin = session.user.role === "admin";
  const isClient = session.user.role === "client" && project.clientId === session.user.id;
  const isPm = session.user.role === "pm" && project.pmId === session.user.id;

  if (!isAdmin && !isClient && !isPm) {
    return NextResponse.json({ error: "Acceso restringido al proyecto." }, { status: 403 });
  }

  return NextResponse.json({
    id: project.id,
    repositoryUrl: project.repositoryUrl
  });
}

// Permite al PM asignado (o al admin) actualizar la URL del repositorio del
// proyecto. El cliente la verá en su sección de entregables.
export async function PATCH(request: Request, ctx: Context) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const project = await loadAccessibleProject(id);
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
  }

  const isAdmin = session.user.role === "admin";
  const isPm = session.user.role === "pm" && project.pmId === session.user.id;

  if (!isAdmin && !isPm) {
    return NextResponse.json({ error: "Solo el PM asignado o un admin pueden editar." }, { status: 403 });
  }

  let body: { repositoryUrl?: string | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  let nextValue: string | null = null;
  if (typeof body.repositoryUrl === "string") {
    const trimmed = body.repositoryUrl.trim();
    if (trimmed.length === 0) {
      nextValue = null;
    } else if (!/^https?:\/\//i.test(trimmed)) {
      return NextResponse.json({ error: "La URL debe empezar con http(s)://" }, { status: 400 });
    } else {
      nextValue = trimmed;
    }
  } else if (body.repositoryUrl !== null) {
    return NextResponse.json({ error: "Campo repositoryUrl inválido." }, { status: 400 });
  }

  try {
    const updated = await db.project.update({
      where: { id },
      data: { repositoryUrl: nextValue },
      select: { id: true, repositoryUrl: true }
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[projects/:id PATCH]", {
      error: error instanceof Error ? error.message.split("\n")[0] : String(error)
    });
    return NextResponse.json({ error: "No se pudo actualizar el proyecto." }, { status: 500 });
  }
}
