import { PrismaClient } from "@prisma/client";

import { env } from "@/lib/env";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient({
    datasources: {
      db: {
        url: env.DATABASE_URL
      }
    }
  });
}

export const db = globalThis.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
