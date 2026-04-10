import "server-only";

import { env, requireServerEnv } from "@/lib/env";

export interface EmailConfig {
  provider: "resend";
  from: string;
  companyInbox: string;
  resendApiKey: string;
  appUrl: string;
  visibleContactEmail: string;
}

export function getEmailConfig(): EmailConfig {
  const required = requireServerEnv("EMAIL_PROVIDER", "EMAIL_FROM", "EMAIL_TO_QUOTES", "RESEND_API_KEY", "APP_URL");
  const provider = required.EMAIL_PROVIDER.trim().toLowerCase();

  if (provider !== "resend") {
    throw new Error(`Unsupported EMAIL_PROVIDER "${required.EMAIL_PROVIDER}". Only "resend" is implemented right now.`);
  }

  return {
    provider: "resend",
    from: required.EMAIL_FROM,
    companyInbox: required.EMAIL_TO_QUOTES,
    resendApiKey: required.RESEND_API_KEY,
    appUrl: required.APP_URL,
    visibleContactEmail: extractEmailAddress(required.EMAIL_FROM)
  };
}

export function getPublicContactEmail() {
  return extractEmailAddress(env.EMAIL_FROM || env.EMAIL_TO_QUOTES || "");
}

export function getAppUrl() {
  return env.APP_URL;
}

function extractEmailAddress(value: string) {
  const match = value.match(/<([^>]+)>/);

  if (match?.[1]) {
    return match[1].trim();
  }

  return value.trim();
}
