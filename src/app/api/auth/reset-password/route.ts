import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";

export async function POST(request: Request) {
  let body: { token?: string; password?: string; confirmPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Cuerpo inválido." }, { status: 400 });
  }

  const token = String(body.token ?? "").trim();
  const password = String(body.password ?? "").trim();
  const confirmPassword = String(body.confirmPassword ?? "").trim();

  if (!token) {
    return NextResponse.json({ ok: false, message: "Falta el token." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { ok: false, message: "La nueva contraseña debe tener al menos 8 caracteres." },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { ok: false, message: "Las contraseñas no coinciden." },
      { status: 400 }
    );
  }

  try {
    const record = await db.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!record || record.used || record.expiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { ok: false, message: "El enlace expiró o ya fue usado. Pide uno nuevo." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    await db.$transaction([
      db.user.update({ where: { id: record.userId }, data: { passwordHash } }),
      db.passwordResetToken.update({ where: { id: record.id }, data: { used: true } }),
      // Cierra cualquier sesión abierta para forzar login con la nueva contraseña.
      db.session.deleteMany({ where: { userId: record.userId } })
    ]);

    return NextResponse.json({ ok: true, message: "Contraseña actualizada." });
  } catch (error) {
    console.error("[reset-password]", {
      message: error instanceof Error ? error.message.split("\n")[0] : String(error)
    });
    return NextResponse.json(
      { ok: false, message: "No pudimos actualizar la contraseña." },
      { status: 500 }
    );
  }
}
