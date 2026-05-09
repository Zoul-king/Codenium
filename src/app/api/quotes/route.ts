import { NextResponse } from "next/server";
import { type QuoteStatus as PrismaQuoteStatus, type ProjectStatus as PrismaProjectStatus } from "@prisma/client";

import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

// Obtener cotizaciones — admin ve todas, client solo las suyas
export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const where = session.user.role === "client" ? { clientId: session.user.id } : {};

    const quotes = await db.quote.findMany({
      where,
      include: {
        client: {
          select: { id: true, firstName: true, lastName: true, email: true, company: true }
        },
        project: {
          include: {
            pm: { select: { id: true, firstName: true, lastName: true } },
            client: { select: { id: true, firstName: true, lastName: true } },
            milestones: { orderBy: { order: "asc" } },
            payments: { orderBy: { createdAt: "asc" } },
            documents: { orderBy: { createdAt: "desc" } }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(quotes);
  } catch {
    return NextResponse.json(
      { error: "No se pudieron obtener las cotizaciones." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  if (session.user.role !== "admin" && session.user.role !== "pm") {
    return NextResponse.json({ error: "Acceso restringido." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const quoteId = typeof body?.quoteId === "string" ? body.quoteId : "";
    const status = mapQuoteStatus(body?.status);
    const pmId = typeof body?.pmId === "string" && body.pmId.trim() ? body.pmId.trim() : null;

    if (!quoteId || !status) {
      return NextResponse.json({ error: "Faltan datos para actualizar la cotización." }, { status: 400 });
    }

    const quote = await db.quote.update({
      where: { id: quoteId },
      data: { status },
      include: {
        client: true,
        project: true
      }
    });

    if (status === "APPROVED") {
      // Verificar que el PM existe en la DB antes de usarlo como FK.
      // Evita constraint violation cuando el frontend pasa IDs de usuarios mock.
      let resolvedPmId: string | null = null;
      if (pmId) {
        const pmExists = await db.user.findUnique({ where: { id: pmId }, select: { id: true } });
        resolvedPmId = pmExists ? pmId : null;
      }

      await db.project.upsert({
        where: { quoteId },
        update: {
          pmId: resolvedPmId,
          name: quote.title,
          description: quote.description ?? undefined,
          status: "PENDING" as PrismaProjectStatus
        },
        create: {
          quoteId,
          clientId: quote.clientId,
          pmId: resolvedPmId,
          name: quote.title,
          description: quote.description ?? undefined,
          status: "PENDING" as PrismaProjectStatus
        }
      });
    }

    const refreshed = await db.quote.findUnique({
      where: { id: quoteId },
      include: {
        client: true,
        project: {
          include: {
            pm: true,
            client: true
          }
        }
      }
    });

    return NextResponse.json(refreshed);
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar la cotización." }, { status: 500 });
  }
}

// Crear una nueva cotización
export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();

    const {
      title,
      description,
      projectType,
      planCategory,
      planTier,
      billingModel,
      estimatedPrice,
      estimatedTimeline
    } = body;

    if (!title || !projectType || !planCategory || !planTier || !billingModel) {
      return NextResponse.json(
        { error: "Faltan datos para crear la cotización." },
        { status: 400 }
      );
    }

    // clientId siempre viene de la sesión autenticada, nunca del body
    const clientId = session.user.id;

    const quote = await db.quote.create({
      data: {
        folio: `Q-${Date.now()}`,
        title,
        description,
        projectType,
        planCategory,
        planTier,
        billingModel,
        estimatedPrice,
        estimatedTimeline,
        clientId
      }
    });

    return NextResponse.json(quote);
  } catch {
    return NextResponse.json(
      { error: "No se pudo crear la cotización." },
      { status: 500 }
    );
  }
}

function mapQuoteStatus(value: unknown): PrismaQuoteStatus | null {
  if (value === "accepted") return "APPROVED";
  if (value === "reviewed") return "REVIEWING";
  if (value === "rejected") return "REJECTED";
  if (value === "pending") return "SUBMITTED";
  return null;
}
