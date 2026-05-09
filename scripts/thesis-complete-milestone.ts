import { PrismaClient, MilestoneStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const milestone = await prisma.milestone.findFirst({
    where: { title: "Diseño visual", status: MilestoneStatus.IN_PROGRESS }
  });
  if (!milestone) {
    throw new Error("Milestone 'Diseño visual' no encontrado en estado IN_PROGRESS");
  }
  await prisma.milestone.update({
    where: { id: milestone.id },
    data: { status: MilestoneStatus.COMPLETED, completedAt: new Date("2026-05-09") }
  });
  console.log(JSON.stringify({ ok: true, milestoneId: milestone.id }));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
