import { NextResponse } from "next/server";
import { PrismaClient, UserRole, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

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

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese correo." },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        company: company || null,
        passwordHash: password,
        role: UserRole.CLIENT,
        status: UserStatus.ACTIVE
      }
    });

    return NextResponse.json({
      userId: user.id,
      role: user.role.toLowerCase(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email
    });
  } catch {
    return NextResponse.json(
      { error: "Ocurrió un error al registrar la cuenta." },
      { status: 500 }
    );
  }
}