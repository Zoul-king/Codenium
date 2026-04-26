import { NextResponse } from "next/server";
import { PrismaClient, type PlanCategory } from "@prisma/client";

import { mergeManagedPlanCatalog, type ManagedPlanCatalog } from "@/features/marketing/lib/plan-catalog";
import type { PlanProfile } from "@/lib/types/domain";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const configs = await prisma.planConfig.findMany({ orderBy: { key: "asc" } });

    return NextResponse.json(
      mergeManagedPlanCatalog(
        configs.map((config) => ({
          id: config.key,
          profile: mapPlanProfile(config.profile),
          setupFee: config.setupFee,
          monthlyFee: config.monthlyFee,
          discountPercentage: config.discountPercentage,
          active: config.active
        }))
      )
    );
  } catch {
    return NextResponse.json({ error: "No se pudieron obtener los planes." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as ManagedPlanCatalog;
    const records = [...body.personal, ...body.business];

    await prisma.$transaction(
      records.map((plan) =>
        prisma.planConfig.upsert({
          where: { key: plan.id },
          update: {
            profile: mapPlanCategory(plan.profile),
            setupFee: plan.setupFee,
            monthlyFee: plan.monthlyFee,
            discountPercentage: plan.discountPercentage,
            active: plan.active
          },
          create: {
            key: plan.id,
            profile: mapPlanCategory(plan.profile),
            setupFee: plan.setupFee,
            monthlyFee: plan.monthlyFee,
            discountPercentage: plan.discountPercentage,
            active: plan.active
          }
        })
      )
    );

    const configs = await prisma.planConfig.findMany({ orderBy: { key: "asc" } });

    return NextResponse.json(
      mergeManagedPlanCatalog(
        configs.map((config) => ({
          id: config.key,
          profile: mapPlanProfile(config.profile),
          setupFee: config.setupFee,
          monthlyFee: config.monthlyFee,
          discountPercentage: config.discountPercentage,
          active: config.active
        }))
      )
    );
  } catch {
    return NextResponse.json({ error: "No se pudieron guardar los planes." }, { status: 500 });
  }
}

function mapPlanCategory(profile: PlanProfile): PlanCategory {
  return profile === "business" ? "BUSINESS" : "PERSONAL";
}

function mapPlanProfile(category: PlanCategory): PlanProfile {
  return category === "BUSINESS" ? "business" : "personal";
}
