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

  const response = await resend.emails.send({
    from: config.from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
    replyTo: input.replyTo
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}
