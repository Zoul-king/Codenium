import { Prisma } from "@prisma/client";

const TRANSIENT_PRISMA_CODES = new Set([
  "P1001", // Can't reach database server
  "P1002", // The database server timed out
  "P1008", // Operations timed out
  "P1017"  // Server has closed the connection
]);

const TRANSIENT_MESSAGE_PATTERNS = [
  /can't reach database server/i,
  /timed out/i,
  /connection.*(closed|reset|refused)/i,
  /econnreset/i,
  /etimedout/i,
  /enotfound/i,
  /server has closed/i
];

const DEFAULT_ATTEMPTS = 4;
const DEFAULT_BASE_DELAY_MS = 350;
const DEFAULT_MAX_DELAY_MS = 2500;

export interface RetryOptions {
  attempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  onRetry?: (error: unknown, attempt: number) => void;
}

export function isTransientDbError(error: unknown): boolean {
  if (!error) return false;

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  ) {
    return true;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (TRANSIENT_PRISMA_CODES.has(error.code)) return true;
  }

  const message = (error as { message?: string }).message ?? "";
  return TRANSIENT_MESSAGE_PATTERNS.some((pattern) => pattern.test(message));
}

export async function withDbRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const attempts = options.attempts ?? DEFAULT_ATTEMPTS;
  const baseDelay = options.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;
  const maxDelay = options.maxDelayMs ?? DEFAULT_MAX_DELAY_MS;

  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === attempts || !isTransientDbError(error)) {
        throw error;
      }

      options.onRetry?.(error, attempt);

      const delay = Math.min(maxDelay, baseDelay * 2 ** (attempt - 1));
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
