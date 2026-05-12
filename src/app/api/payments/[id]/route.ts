import { NextResponse } from "next/server";
import { PaymentStatus as PrismaPaymentStatus } from "@prisma/client";

import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

interface Context {
  params: Promise<{ id: string }>;
}

function mapDomainStatus(status: unknown): PrismaPaymentStatus | null {
  if (status === "paid") return PrismaPaymentStatus.PAID;
  if (status === "pending") return PrismaPaymentStatus.PENDING;
  if (status === "scheduled") return PrismaPaymentStatus.PENDING;
  if (status === "overdue") return PrismaPaymentStatus.OVERDUE;
  if (status === "cancelled") return PrismaPaymentStatus.CANCELLED;
  return null;
}

export async function PATCH(request: Request, ctx: Context) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await ctx.params;

  const payment = await db.payment.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      project: { select: { id: true, pmId: true, clientId: true } }
    }
  });
  if (!payment) {
    return NextResponse.json({ error: "Pago no encontrado." }, { status: 404 });
  }

  const isAdmin = session.user.role === "admin";
  const isPm = session.user.role === "pm" && payment.project.pmId === session.user.id;
  const isClient = session.user.role === "client" && payment.project.clientId === session.user.id;
  // Admin/PM pueden cambiar el estado libremente. El cliente solo puede
  // confirmar manualmente su propio pago (acción del botón "Confirmar pago
  // manual"); cualquier otra transición queda restringida.
  if (!isAdmin && !isPm && !isClient) {
    return NextResponse.json({ error: "Acceso restringido al pago." }, { status: 403 });
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const next = mapDomainStatus(body.status);
  if (!next) {
    return NextResponse.json({ error: "Estado no válido." }, { status: 400 });
  }

  try {
    const updated = await db.payment.update({
      where: { id },
      data: {
        status: next,
        paidAt: next === PrismaPaymentStatus.PAID ? new Date() : null
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[payments/:id PATCH]", {
      error: error instanceof Error ? error.message.split("\n")[0] : String(error)
    });
    return NextResponse.json({ error: "No se pudo actualizar el pago." }, { status: 500 });
  }
}
