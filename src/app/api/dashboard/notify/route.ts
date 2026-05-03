import { NextResponse } from "next/server";

import type { ApiActionResult, DashboardNotificationPayload } from "@/server/email/types";
import {
  sendChangeRequestEmail,
  sendDashboardMessageEmail,
  sendDeliverableNotificationEmail,
  sendMeetingScheduledEmail,
  sendPmAccountCreatedEmail,
  sendProjectAssignmentEmail,
  sendQuoteStatusEmail
} from "@/server/email";
import { getCurrentSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json<ApiActionResult>({ ok: false, message: "No autorizado." }, { status: 401 });
  }

  // client puede enviar notificaciones desde su propio dashboard (mensajes, documentos, hitos)
  if (!["admin", "pm", "client"].includes(session.user.role)) {
    return NextResponse.json<ApiActionResult>({ ok: false, message: "Acceso restringido." }, { status: 403 });
  }

  try {
    const payload = validateDashboardNotificationPayload((await request.json()) as Partial<DashboardNotificationPayload>);

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
      case "quote_status_update":
        await sendQuoteStatusEmail(payload);
        break;
      case "meeting_scheduled":
        await sendMeetingScheduledEmail({
          recipientEmail: payload.recipientEmail,
          recipientName: payload.recipientName,
          projectName: payload.projectName,
          date: payload.date,
          time: payload.time,
          duration: payload.duration,
          meetingLink: payload.meetingLink,
          agenda: payload.agenda,
          hostName: payload.hostName
        });
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

function validateDashboardNotificationPayload(payload: Partial<DashboardNotificationPayload>): DashboardNotificationPayload {
  switch (payload.type) {
    case "project_message":
      return {
        type: "project_message",
        recipientEmail: requireEmail(payload.recipientEmail, "recipientEmail"),
        recipientName: requireText(payload.recipientName, "recipientName"),
        projectName: requireText(payload.projectName, "projectName"),
        senderName: requireText(payload.senderName, "senderName"),
        senderRole: payload.senderRole === "client" || payload.senderRole === "pm" ? payload.senderRole : invalidField("senderRole"),
        message: requireText(payload.message, "message")
      };
    case "change_request":
      return {
        type: "change_request",
        recipientEmail: requireEmail(payload.recipientEmail, "recipientEmail"),
        recipientName: requireText(payload.recipientName, "recipientName"),
        requestedBy: requireText(payload.requestedBy, "requestedBy"),
        projectName: requireText(payload.projectName, "projectName"),
        title: requireText(payload.title, "title"),
        detail: requireText(payload.detail, "detail"),
        priority: requireText(payload.priority, "priority")
      };
    case "deliverable_notification":
      return {
        type: "deliverable_notification",
        recipientEmail: requireEmail(payload.recipientEmail, "recipientEmail"),
        recipientName: requireText(payload.recipientName, "recipientName"),
        projectName: requireText(payload.projectName, "projectName"),
        title: requireText(payload.title, "title"),
        kind: requireText(payload.kind, "kind"),
        fileName: optionalText(payload.fileName),
        registeredBy: requireText(payload.registeredBy, "registeredBy")
      };
    case "quote_assignment":
      return {
        type: "quote_assignment",
        quoteCode: requireText(payload.quoteCode, "quoteCode"),
        quoteTitle: requireText(payload.quoteTitle, "quoteTitle"),
        clientEmail: requireEmail(payload.clientEmail, "clientEmail"),
        clientName: requireText(payload.clientName, "clientName"),
        pmEmail: requireEmail(payload.pmEmail, "pmEmail"),
        pmName: requireText(payload.pmName, "pmName"),
        projectName: requireText(payload.projectName, "projectName")
      };
    case "pm_account_created":
      return {
        type: "pm_account_created",
        pmEmail: requireEmail(payload.pmEmail, "pmEmail"),
        pmName: requireText(payload.pmName, "pmName")
      };
    case "quote_status_update":
      return {
        type: "quote_status_update",
        recipientEmail: requireEmail(payload.recipientEmail, "recipientEmail"),
        recipientName: requireText(payload.recipientName, "recipientName"),
        quoteCode: requireText(payload.quoteCode, "quoteCode"),
        quoteTitle: requireText(payload.quoteTitle, "quoteTitle"),
        status:
          payload.status === "pending" || payload.status === "reviewed" || payload.status === "accepted" || payload.status === "rejected"
            ? payload.status
            : invalidField("status")
      };
    case "meeting_scheduled":
      return {
        type: "meeting_scheduled",
        recipientEmail: requireEmail(payload.recipientEmail, "recipientEmail"),
        recipientName: requireText(payload.recipientName, "recipientName"),
        projectName: requireText(payload.projectName, "projectName"),
        date: requireText(payload.date, "date"),
        time: requireText(payload.time, "time"),
        duration: requireText(payload.duration, "duration"),
        meetingLink: optionalText(payload.meetingLink),
        agenda: optionalText(payload.agenda),
        hostName: requireText(payload.hostName, "hostName")
      };
    default:
      throw new Error("Tipo de notificacion no soportado.");
  }
}

function requireText(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Falta el campo ${field}.`);
  }

  return value.trim();
}

function optionalText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function requireEmail(value: unknown, field: string) {
  const normalized = requireText(value, field);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error(`El campo ${field} debe ser un correo valido.`);
  }

  return normalized;
}

function invalidField(field: string): never {
  throw new Error(`El campo ${field} no es valido.`);
}
