import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { getCurrentSession } from "@/lib/auth/session";
import {
  sendClientAccountCreatedByAdminEmail,
  sendPmAccountCreatedEmail
} from "@/server/email";
import { getAppUrl } from "@/server/email/config";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  if (session.user.role === "client") {
    return NextResponse.json({ error: "Acceso restringido." }, { status: 403 });
  }

  try {
    const users = await db.user.findMany({
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

    return NextResponse.json(users);
  } catch {
    return NextResponse.json(
      { error: "No se pudieron obtener los usuarios." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const company = String(body.company ?? "").trim();
    const rawRole = String(body.role ?? "PM").trim().toUpperCase();
    const role: "PM" | "CLIENT" = rawRole === "CLIENT" ? "CLIENT" : "PM";

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "Nombre, apellido y correo son obligatorios." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Ingresa un correo válido." }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Ya existe una cuenta con ese correo." }, { status: 409 });
    }

    // Contraseña temporal — el usuario la cambia desde su perfil al primer acceso.
    const tempPassword = "Codenium" + randomBytes(4).toString("hex").toUpperCase();
    const passwordHash = await hashPassword(tempPassword);

    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        company: company || null,
        passwordHash,
        role,
        status: "ACTIVE"
      },
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

    // Enviamos las credenciales por correo. Si falla, dejamos la cuenta creada
    // y avisamos al admin para que reenvíe manualmente.
    let emailed = true;
    let emailError: string | null = null;
    try {
      const appUrl = getAppUrl().replace(/\/$/, "");
      const fullName = `${user.firstName} ${user.lastName}`.trim();
      if (role === "CLIENT") {
        await sendClientAccountCreatedByAdminEmail({
          clientEmail: user.email,
          clientName: fullName,
          tempPassword,
          loginUrl: `${appUrl}/login`
        });
      } else {
        await sendPmAccountCreatedEmail({
          pmEmail: user.email,
          pmName: fullName,
          tempPassword,
          loginUrl: `${appUrl}/login`
        });
      }
    } catch (error) {
      emailed = false;
      emailError = error instanceof Error ? error.message : "error desconocido";
      console.error("[users] no se pudo enviar el correo al usuario", {
        email: user.email,
        role,
        error: emailError
      });
    }

    return NextResponse.json({ ...user, emailed, emailError }, { status: 201 });
  } catch (error) {
    console.error("[users] no se pudo crear la cuenta", {
      error: error instanceof Error ? error.message.split("\n")[0] : String(error)
    });
    return NextResponse.json({ error: "No se pudo crear la cuenta." }, { status: 500 });
  }
}
