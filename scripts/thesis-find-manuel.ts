import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { OR: [{ firstName: { contains: "Manuel", mode: "insensitive" } }, { lastName: { contains: "Manuel", mode: "insensitive" } }] },
    select: { id: true, firstName: true, lastName: true, email: true, role: true, status: true }
  });
  console.log(JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
