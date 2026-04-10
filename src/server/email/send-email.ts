import "server-only";

import { Resend } from "resend";

import { getEmailConfig } from "@/server/email/config";

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export async function sendEmail(input: SendEmailInput) {
  const config = getEmailConfig();

  if (config.provider !== "resend") {
    throw new Error(`Unsupported email provider "${config.provider}".`);
  }

  const resend = new Resend(config.resendApiKey);
  const primaryResponse = await sendWithSender(resend, config.from, input);

  if (!primaryResponse.error) {
    console.info("[email] resend success", {
      sender: config.from,
      to: input.to,
      subject: input.subject,
      messageId: primaryResponse.data?.id ?? null
    });

    return primaryResponse.data;
  }

  console.error("[email] resend error", {
    sender: config.from,
    to: input.to,
    subject: input.subject,
    error: primaryResponse.error
  });

  if (shouldFallbackToResendDev(config.from, config.fallbackFrom, primaryResponse.error)) {
    console.warn("[email] retrying with fallback sender", {
      originalSender: config.from,
      fallbackSender: config.fallbackFrom,
      reason: primaryResponse.error.message
    });

    const fallbackResponse = await sendWithSender(resend, config.fallbackFrom, input);

    if (!fallbackResponse.error) {
      console.info("[email] resend fallback success", {
        sender: config.fallbackFrom,
        to: input.to,
        subject: input.subject,
        messageId: fallbackResponse.data?.id ?? null
      });

      return fallbackResponse.data;
    }

    console.error("[email] resend fallback error", {
      sender: config.fallbackFrom,
      to: input.to,
      subject: input.subject,
      error: fallbackResponse.error
    });

    throw new Error(
      `Primary sender failed (${primaryResponse.error.message}). Fallback sender failed (${fallbackResponse.error.message}).`
    );
  }

  throw new Error(primaryResponse.error.message);
}

async function sendWithSender(resend: Resend, from: string, input: SendEmailInput) {
  return resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
    replyTo: input.replyTo
  });
}

function shouldFallbackToResendDev(
  primaryFrom: string,
  fallbackFrom: string,
  error: NonNullable<Awaited<ReturnType<Resend["emails"]["send"]>>["error"]>
) {
  if (!fallbackFrom.trim() || primaryFrom.trim() === fallbackFrom.trim()) {
    return false;
  }

  return (
    error.statusCode === 403 &&
    (error.name === "validation_error" ||
      error.message.toLowerCase().includes("domain is not verified") ||
      error.message.toLowerCase().includes("verify your domain"))
  );
}
