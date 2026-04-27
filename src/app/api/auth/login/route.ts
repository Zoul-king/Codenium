import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { hashPassword, isHashed, verifyPassword } from "@/lib/auth/password";
import { createSession, toPublicUser } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "").trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Completa tu correo y contraseña." },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json(
        { error: "No pudimos validar esos datos. Revisa tu correo y contraseña." },
        { status: 401 }
      );
    }

    if (!isHashed(user.passwordHash)) {
      const upgraded = await hashPassword(password);
      await db.user.update({
        where: { id: user.id },
        data: { passwordHash: upgraded }
      });
    }

    await createSession(user.id);

    const publicUser = toPublicUser(user);

    return NextResponse.json({
      userId: publicUser.id,
      role: publicUser.role,
      name: publicUser.name,
      email: publicUser.email
    });
  } catch {
    return NextResponse.json(
      { error: "Ocurrió un error al iniciar sesión." },
      { status: 500 }
    );
  }
}
