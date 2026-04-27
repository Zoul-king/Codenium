import { NextResponse } from "next/server";
import { type QuoteStatus as PrismaQuoteStatus, type ProjectStatus as PrismaProjectStatus } from "@prisma/client";

import { db } from "@/lib/db";

// Obtener todas las cotizaciones
export async function GET() {
  try {
    const quotes = await db.quote.findMany({
      include: {
        client: true,
        project: {
          include: {
            pm: true,
            client: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudieron obtener las cotizaciones." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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
      await db.project.upsert({
        where: { quoteId },
        update: {
          pmId,
          name: quote.title,
          description: quote.description ?? undefined,
          status: "PENDING" as PrismaProjectStatus
        },
        create: {
          quoteId,
          clientId: quote.clientId,
          pmId,
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
      estimatedTimeline,
      clientId
    } = body;

    // Validación de campos obligatorios
    if (!title || !projectType || !planCategory || !planTier || !billingModel || !clientId) {
      return NextResponse.json(
        { error: "Faltan datos para crear la cotización." },
        { status: 400 }
      );
    }

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
  } catch (error) {
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
