import "server-only";

import { env, requireServerEnv } from "@/config/env";
import type { PublicLeadSource } from "@/server/email/types";

export interface EmailConfig {
  provider: "resend";
  from: string;
  fallbackFrom: string;
  companyInboxes: Record<PublicLeadSource, string>;
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

  const quoteInbox = extractEmailAddress(required.EMAIL_TO_QUOTES);
  const contactInbox = extractEmailAddress(env.EMAIL_TO_CONTACT || required.EMAIL_TO_QUOTES);
  const visibleContactEmail = extractEmailAddress(env.CONTACT_EMAIL || env.EMAIL_TO_CONTACT || required.EMAIL_TO_QUOTES || required.EMAIL_FROM);

  return {
    provider: "resend",
    from: required.EMAIL_FROM,
    fallbackFrom: env.RESEND_FALLBACK_FROM,
    companyInboxes: {
      contact: contactInbox,
      quote: quoteInbox
    },
    resendApiKey: required.RESEND_API_KEY,
    appUrl: required.APP_URL,
    visibleContactEmail
  };
}

export function getPublicContactEmail() {
  return extractEmailAddress(env.CONTACT_EMAIL || env.EMAIL_TO_CONTACT || env.EMAIL_TO_QUOTES || env.EMAIL_FROM || "");
}

export function getCompanyInbox(source: PublicLeadSource) {
  return getEmailConfig().companyInboxes[source];
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
