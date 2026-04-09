const defaultDatabaseUrl = "postgresql://postgres:postgres@localhost:5432/codenium?schema=public";

export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? defaultDatabaseUrl,
  NODE_ENV: process.env.NODE_ENV ?? "development"
} as const;
