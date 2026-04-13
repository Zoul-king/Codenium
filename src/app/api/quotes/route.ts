import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    if (!title || !projectType || !planCategory || !planTier || !billingModel || !clientId) {
      return NextResponse.json(
        { error: "Faltan datos para crear la cotización." },
        { status: 400 }
      );
    }

    const quote = await prisma.quote.create({
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