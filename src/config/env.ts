const defaultDatabaseUrl = "postgresql://postgres:postgres@localhost:5432/codenium?schema=public";

type NodeEnv = "development" | "test" | "production";

function readNodeEnv(): NodeEnv {
  const value = process.env.NODE_ENV;

  if (value === "production" || value === "test") {
    return value;
  }

  return "development";
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? defaultDatabaseUrl,
  APP_URL: process.env.APP_URL ?? "http://localhost:3000",
  SESSION_SECRET: process.env.SESSION_SECRET ?? "",
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER ?? "",
  EMAIL_FROM: process.env.EMAIL_FROM ?? "",
  RESEND_FALLBACK_FROM: process.env.RESEND_FALLBACK_FROM ?? "Codenium <onboarding@resend.dev>",
  CONTACT_EMAIL: process.env.CONTACT_EMAIL ?? "",
  EMAIL_TO_CONTACT: process.env.EMAIL_TO_CONTACT ?? "",
  EMAIL_TO_QUOTES: process.env.EMAIL_TO_QUOTES ?? "",
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
  NODE_ENV: readNodeEnv()
} as const;

type EnvKey = keyof typeof env;

export function requireServerEnv<T extends EnvKey>(...keys: T[]): Pick<typeof env, T> {
  const missing = keys.filter((key) => !String(env[key] ?? "").trim());

  if (missing.length > 0) {
    throw new Error(`Missing required server environment variables: ${missing.join(", ")}`);
  }

  return Object.fromEntries(keys.map((key) => [key, env[key]])) as Pick<typeof env, T>;
}
