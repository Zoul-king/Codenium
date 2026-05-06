import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import bcrypt from "bcryptjs";
import { PrismaClient, UserRole, UserStatus } from "@prisma/client";

loadEnv();

function loadEnv() {
  for (const file of [".env", ".env.local"]) {
    try {
      const content = readFileSync(resolve(process.cwd(), file), "utf8");
      for (const line of content.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
        if (!match) continue;
        const [, key, rawValue] = match;
        if (process.env[key]) continue;
        let value = rawValue.trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    } catch {}
  }
}

const prisma = new PrismaClient();

const OLD_TEST_IDS = ["user-admin", "user-pm", "user-client"];
const PASSWORD = "12345678";
const PHONE = "+52 5575595404";

const NEW_ACCOUNTS = [
  {
    id: "user-admin-manuel",
    firstName: "Admin",
    lastName: "Manuel",
    email: "gzcm.manuel+admin@gmail.com",
    role: UserRole.ADMIN
  },
  {
    id: "user-pm-manuel",
    firstName: "PM",
    lastName: "Manuel",
    email: "gzcm.manuel+pm@gmail.com",
    role: UserRole.PM
  },
  {
    id: "user-cliente-manuel",
    firstName: "Cliente",
    lastName: "Manuel",
    email: "gzcm.manuel+cliente@gmail.com",
    role: UserRole.CLIENT
  }
];

async function main() {
  console.log("Resetting test accounts...");

  await prisma.$transaction(async (tx) => {
    // 1. Delete projects where the test users are client OR pm.
    //    Cascades to milestones / messages / documents / payments / change-requests.
    const projectsToDrop = await tx.project.findMany({
      where: {
        OR: [
          { clientId: { in: OLD_TEST_IDS } },
          { pmId: { in: OLD_TEST_IDS } }
        ]
      },
      select: { id: true }
    });

    if (projectsToDrop.length > 0) {
      const projectIds = projectsToDrop.map((p) => p.id);
      console.log(`Deleting ${projectIds.length} dependent projects...`);
      await tx.project.deleteMany({ where: { id: { in: projectIds } } });
    }

    // 2. Delete any orphan messages/docs that the PM authored in projects we don't own.
    await tx.message.deleteMany({ where: { senderId: { in: OLD_TEST_IDS } } });
    await tx.document.deleteMany({ where: { uploadedById: { in: OLD_TEST_IDS } } });

    // 3. Delete quotes belonging to test clients (cascades quote items).
    const quotesDeleted = await tx.quote.deleteMany({
      where: { clientId: { in: OLD_TEST_IDS } }
    });
    if (quotesDeleted.count) console.log(`Deleted ${quotesDeleted.count} quotes.`);

    // 4. Delete contact leads that reference the test users.
    await tx.contactLead.deleteMany({ where: { userId: { in: OLD_TEST_IDS } } });

    // 5. Delete the users themselves (sessions / reset tokens cascade).
    const usersDeleted = await tx.user.deleteMany({ where: { id: { in: OLD_TEST_IDS } } });
    console.log(`Deleted ${usersDeleted.count} legacy users.`);

    // 6. Recreate the three Manuel accounts (clean upsert).
    const passwordHash = await bcrypt.hash(PASSWORD, 12);

    for (const account of NEW_ACCOUNTS) {
      await tx.user.upsert({
        where: { id: account.id },
        update: {
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          phone: PHONE,
          passwordHash,
          role: account.role,
          status: UserStatus.ACTIVE
        },
        create: {
          id: account.id,
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          phone: PHONE,
          passwordHash,
          role: account.role,
          status: UserStatus.ACTIVE
        }
      });
      console.log(`Upserted ${account.firstName} ${account.lastName} (${account.role}) - ${account.email}`);
    }
  });

  // Final verification
  const finalUsers = await prisma.user.findMany({
    where: { id: { in: NEW_ACCOUNTS.map((a) => a.id) } },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, status: true }
  });
  console.log("\nFinal Manuel accounts:\n", JSON.stringify(finalUsers, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
