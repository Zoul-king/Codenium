import { NextResponse } from "next/server";
import { UserStatus } from "@prisma/client";

import { db } from "@/lib/db";
import { deleteUserDeep } from "@/lib/auth/delete-user";
import { destroyCurrentSession, getCurrentSession } from "@/lib/auth/session";

interface Context {
  params: Promise<{ id: string }>;
}

const STATUS_MAP: Record<string, UserStatus> = {
  active: UserStatus.ACTIVE,
  inactive: UserStatus.INACTIVE,
  suspended: UserStatus.BANNED,
  banned: UserStatus.BANNED
};

export async function PATCH(request: Request, ctx: Context) {
  const session = await getCurrentSession();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await ctx.params;

  if (id === session.user.id) {
    return NextResponse.json(
      { error: "No puedes cambiar tu propio estado desde este panel." },
      { status: 400 }
    );
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const requested = String(body.status ?? "").toLowerCase();
  const nextStatus = STATUS_MAP[requested];

  if (!nextStatus) {
    return NextResponse.json(
      { error: "Estado no válido. Usa active, inactive o suspended." },
      { status: 400 }
    );
  }

  try {
    const user = await db.user.update({
      where: { id },
      data: { status: nextStatus },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        company: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[users/:id PATCH]", {
      message: error instanceof Error ? error.message.split("\n")[0] : String(error)
    });
    return NextResponse.json({ error: "No se pudo actualizar el usuario." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, ctx: Context) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const isSelf = id === session.user.id;
  const requesterRole = session.user.role;

  // Reglas de autorización:
  //  - admin puede eliminar a cualquiera (excepto a sí mismo desde este panel).
  //  - cliente puede eliminar sólo su propia cuenta.
  //  - PM NO puede eliminar su cuenta (sólo el admin puede darlo de baja).
  if (requesterRole === "admin") {
    if (isSelf) {
      return NextResponse.json(
        { error: "Pide a otro admin que elimine tu cuenta." },
        { status: 400 }
      );
    }
  } else if (requesterRole === "client") {
    if (!isSelf) {
      return NextResponse.json({ error: "Acceso restringido." }, { status: 403 });
    }
  } else if (requesterRole === "pm") {
    return NextResponse.json(
      { error: "Los PMs no pueden eliminar su cuenta. Contacta al admin." },
      { status: 403 }
    );
  }

  try {
    const target = await db.user.findUnique({
      where: { id },
      select: { id: true, role: true }
    });

    if (!target) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }

    // Borrado profundo: limpia dependencias que no cascadean por esquema.
    await deleteUserDeep(target.id);

    if (isSelf) {
      await destroyCurrentSession();
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[users/:id DELETE]", {
      message: error instanceof Error ? error.message.split("\n")[0] : String(error)
    });
    return NextResponse.json({ error: "No se pudo eliminar la cuenta." }, { status: 500 });
  }
}
