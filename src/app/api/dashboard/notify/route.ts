import { NextResponse } from "next/server";

import type { ApiActionResult, DashboardNotificationPayload } from "@/lib/email-payloads";
import {
  sendChangeRequestEmail,
  sendDashboardMessageEmail,
  sendDeliverableNotificationEmail,
  sendPmAccountCreatedEmail,
  sendProjectAssignmentEmail
} from "@/server/email";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as DashboardNotificationPayload;

    switch (payload.type) {
      case "project_message":
        await sendDashboardMessageEmail(payload);
        break;
      case "change_request":
        await sendChangeRequestEmail(payload);
        break;
      case "deliverable_notification":
        await sendDeliverableNotificationEmail(payload);
        break;
      case "quote_assignment":
        await Promise.all([
          sendProjectAssignmentEmail({
            recipientEmail: payload.clientEmail,
            recipientName: payload.clientName,
            quoteCode: payload.quoteCode,
            quoteTitle: payload.quoteTitle,
            projectName: payload.projectName,
            counterpartLabel: "PM asignado",
            counterpartName: payload.pmName
          }),
          sendProjectAssignmentEmail({
            recipientEmail: payload.pmEmail,
            recipientName: payload.pmName,
            quoteCode: payload.quoteCode,
            quoteTitle: payload.quoteTitle,
            projectName: payload.projectName,
            counterpartLabel: "Cliente",
            counterpartName: payload.clientName
          })
        ]);
        break;
      case "pm_account_created":
        await sendPmAccountCreatedEmail({ pmEmail: payload.pmEmail, pmName: payload.pmName });
        break;
      default:
        throw new Error("Tipo de notificacion no soportado.");
    }

    return NextResponse.json<ApiActionResult>({
      ok: true,
      message: "Notificacion enviada correctamente."
    });
  } catch (error) {
    return NextResponse.json<ApiActionResult>(
      {
        ok: false,
        message: error instanceof Error ? error.message : "No pudimos enviar la notificacion."
      },
      { status: 400 }
    );
  }
}
