import { PrismaClient } from "@prisma/client";

import { env } from "@/config/env";
import { withDbRetry } from "./retry";

declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

function createPrismaClient() {
  const base = new PrismaClient({
    datasources: {
      db: {
        url: env.DATABASE_URL
      }
    },
    log: env.NODE_ENV === "production" ? ["error"] : ["error", "warn"]
  });

  return base.$extends({
    query: {
      $allOperations: ({ args, query, model, operation }) => {
        return withDbRetry(() => query(args), {
          onRetry: (error, attempt) => {
            const message = error instanceof Error ? error.message.split("\n")[0] : String(error);
            console.warn(
              `[db] retry ${attempt}/3 for ${model ?? "raw"}.${operation} → ${message}`
            );
          }
        });
      }
    }
  });
}

export const db = globalThis.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
