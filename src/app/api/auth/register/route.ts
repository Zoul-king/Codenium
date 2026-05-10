import { NextResponse } from "next/server";
import { UserRole, UserStatus } from "@prisma/client";

import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { createSession, toPublicUser } from "@/lib/auth/session";
import { sendClientWelcomeEmail } from "@/server/email";
import { getAppUrl } from "@/server/email/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const company = String(body.company ?? "").trim();
    const password = String(body.password ?? "").trim();
    const confirmPassword = String(body.confirmPassword ?? "").trim();

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Completa todos los campos obligatorios." },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Ingresa un correo válido." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Tu contraseña debe tener al menos 8 caracteres." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Las contraseñas no coinciden." },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email }
    });

    // Bloqueamos solo cuentas ya activas. Las INACTIVE son placeholders creados
    // por el cotizador / formulario de contacto cuando un invitado dejó sus
    // datos: en ese caso activamos la cuenta y la vinculamos a la cotización
    // que ya tenía asociada.
    if (existingUser && existingUser.status === UserStatus.ACTIVE) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese correo." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = existingUser
      ? await db.user.update({
          where: { id: existingUser.id },
          data: {
            firstName,
            lastName,
            phone: phone || existingUser.phone,
            company: company || existingUser.company,
            passwordHash,
            role: UserRole.CLIENT,
            status: UserStatus.ACTIVE
          }
        })
      : await db.user.create({
          data: {
            firstName,
            lastName,
            email,
            phone: phone || null,
            company: company || null,
            passwordHash,
            role: UserRole.CLIENT,
            status: UserStatus.ACTIVE
          }
        });

    await createSession(user.id);

    const publicUser = toPublicUser(user);

    // Correo de bienvenida para empezar la creación del proyecto.
    // No bloquea el alta si el envío falla.
    try {
      const appUrl = getAppUrl().replace(/\/$/, "");
      await sendClientWelcomeEmail({
        clientEmail: publicUser.email,
        clientName: publicUser.name,
        dashboardUrl: `${appUrl}/dashboard/${publicUser.role}`,
        quoteUrl: `${appUrl}/quote`
      });
    } catch (error) {
      console.error("[register] no se pudo enviar el correo de bienvenida", {
        clientEmail: publicUser.email,
        message: error instanceof Error ? error.message : String(error)
      });
    }

    return NextResponse.json({
      userId: publicUser.id,
      role: publicUser.role,
      name: publicUser.name,
      email: publicUser.email
    });
  } catch {
    return NextResponse.json(
      { error: "Ocurrió un error al registrar la cuenta." },
      { status: 500 }
    );
  }
}