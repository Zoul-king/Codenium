import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.passwordHash !== password) {
      return NextResponse.json(
        { error: "No pudimos validar esos datos. Revisa tu correo y contraseña." },
        { status: 401 }
      );
    }

    // Se normaliza el rol a minúsculas para consistencia en el cliente
    return NextResponse.json({
      userId: user.id,
      role: user.role.toLowerCase(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email
    });
  } catch {
    return NextResponse.json(
      { error: "Ocurrió un error al iniciar sesión." },
      { status: 500 }
    );
  }
}