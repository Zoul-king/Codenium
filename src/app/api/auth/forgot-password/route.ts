import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/server/email";
import { getAppUrl } from "@/server/email/config";

const TOKEN_TTL_MS = 1000 * 60 * 60; // 1 hora

// Rate limit en memoria: máx 3 solicitudes por correo cada 30 minutos.
const tracker = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 3;
const WINDOW_MS = 30 * 60 * 1000;

function checkRateLimit(key: string) {
  const now = Date.now();
  const entry = tracker.get(key);
  if (!entry || entry.resetAt < now) {
    tracker.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Cuerpo inválido." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, message: "Ingresa un correo válido." }, { status: 400 });
  }

  if (!checkRateLimit(email)) {
    return NextResponse.json(
      { ok: false, message: "Demasiados intentos. Intenta de nuevo en unos minutos." },
      { status: 429 }
    );
  }

  // Respuesta genérica para no exponer si el correo existe o no.
  const genericResponse = NextResponse.json({
    ok: true,
    message:
      "Si la cuenta existe, te enviamos un enlace para restablecer tu contraseña. Revisa tu correo."
  });

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user || user.status !== "ACTIVE") {
      return genericResponse;
    }

    // Invalida tokens previos sin usar — sólo el más reciente debería servir.
    await db.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true }
    });

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    await db.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt }
    });

    const appUrl = getAppUrl().replace(/\/$/, "");
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail({
        recipientEmail: user.email,
        recipientName: `${user.firstName} ${user.lastName}`.trim(),
        resetUrl,
        expiresInMinutes: 60
      });
    } catch (error) {
      console.error("[forgot-password] no se pudo enviar el correo", {
        email,
        message: error instanceof Error ? error.message : String(error)
      });
      // No reventamos: respondemos genérico para no filtrar info.
    }
  } catch (error) {
    console.error("[forgot-password]", {
      message: error instanceof Error ? error.message.split("\n")[0] : String(error)
    });
  }

  return genericResponse;
}
