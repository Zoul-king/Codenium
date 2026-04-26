import { NextResponse } from "next/server";

import type { ApiActionResult, PublicLeadPayload } from "@/server/email/types";
import {
  sendContactConfirmationToLead,
  sendContactNotificationToCompany,
  sendQuoteConfirmationToLead,
  sendQuoteNotificationToCompany
} from "@/server/email";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<PublicLeadPayload>;
    const lead = validatePublicLead(payload);

    if (lead.source === "quote") {
      await Promise.all([sendQuoteNotificationToCompany(lead), sendQuoteConfirmationToLead(lead)]);
    } else {
      await Promise.all([sendContactNotificationToCompany(lead), sendContactConfirmationToLead(lead)]);
    }

    return NextResponse.json<ApiActionResult>({
      ok: true,
      message: "Tu solicitud fue enviada correctamente."
    });
  } catch (error) {
    return NextResponse.json<ApiActionResult>(
      {
        ok: false,
        message: error instanceof Error ? error.message : "No pudimos enviar tu solicitud."
      },
      { status: 400 }
    );
  }
}

function validatePublicLead(payload: Partial<PublicLeadPayload>): PublicLeadPayload {
  const source = payload.source === "quote" ? "quote" : payload.source === "contact" ? "contact" : null;

  if (!source) {
    throw new Error("No pudimos identificar el origen del formulario.");
  }

  const firstName = payload.firstName?.trim() ?? "";
  const lastName = payload.lastName?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const phone = payload.phone?.trim() ?? "";
  const message = payload.message?.trim() ?? "";
  const originPath = payload.originPath?.trim() ?? source;

  if (!firstName || !lastName || !email || !phone || !message) {
    throw new Error("Completa nombre, apellidos, correo, telefono y mensaje.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Escribe un correo valido.");
  }

  return {
    source,
    firstName,
    lastName,
    email,
    phone,
    message,
    originPath,
    hiddenFields: payload.hiddenFields ?? {}
  };
}
