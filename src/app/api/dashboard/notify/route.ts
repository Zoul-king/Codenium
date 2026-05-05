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
import { getCurrentSession, type PublicUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

type NotificationType = DashboardNotificationPayload["type"];

const ALLOWED_ROLES_BY_TYPE: Record<NotificationType, PublicUser["role"][]> = {
  project_message: ["client", "pm", "admin"],
  change_request: ["client", "admin"],
  deliverable_notification: ["pm", "admin"],
  quote_assignment: ["admin"],
  pm_account_created: ["admin"],
  quote_status_update: ["admin"],
  meeting_scheduled: ["pm", "admin"]
};

interface ProjectContext {
  id: string;
  name: string;
  client: { id: string; name: string; email: string };
  pm: { id: string; name: string; email: string } | null;
}

async function loadProjectContextOrFail(projectId: string, session: { user: PublicUser }): Promise<ProjectContext> {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      client: { select: { id: true, firstName: true, lastName: true, email: true } },
      pm: { select: { id: true, firstName: true, lastName: true, email: true } }
    }
  });

  if (!project) {
    throw new HttpError(404, "Proyecto no encontrado.");
  }

  const isAdmin = session.user.role === "admin";
  const isProjectClient = session.user.role === "client" && project.clientId === session.user.id;
  const isProjectPm = session.user.role === "pm" && project.pmId === session.user.id;

  if (!isAdmin && !isProjectClient && !isProjectPm) {
    throw new HttpError(403, "Acceso restringido a este proyecto.");
  }

  return {
    id: project.id,
    name: project.name,
    client: {
      id: project.client.id,
      name: `${project.client.firstName} ${project.client.lastName}`.trim(),
      email: project.client.email
    },
    pm: project.pm
      ? {
          id: project.pm.id,
          name: `${project.pm.firstName} ${project.pm.lastName}`.trim(),
          email: project.pm.email
        }
      : null
  };
}

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json<ApiActionResult>({ ok: false, message: "No autorizado." }, { status: 401 });
  }

  try {
    const payload = validateDashboardNotificationPayload((await request.json()) as Partial<DashboardNotificationPayload>);

    const allowedRoles = ALLOWED_ROLES_BY_TYPE[payload.type];
    if (!allowedRoles?.includes(session.user.role)) {
      return NextResponse.json<ApiActionResult>(
        { ok: false, message: "Acceso restringido para este tipo de notificación." },
        { status: 403 }
      );
    }

    switch (payload.type) {
      case "project_message": {
        const project = await loadProjectContextOrFail(payload.projectId, session);
        const senderRole = session.user.role === "admin" ? "pm" : session.user.role;

        if (senderRole !== "client" && senderRole !== "pm") {
          throw new HttpError(403, "Solo cliente o PM pueden enviar mensajes de proyecto.");
        }

        const recipient = senderRole === "client" ? project.pm : project.client;
        if (!recipient) {
          throw new HttpError(400, "El proyecto no tiene contraparte asignada.");
        }

        await sendDashboardMessageEmail({
          recipientEmail: recipient.email,
          recipientName: recipient.name,
          projectName: project.name,
          senderName: session.user.name,
          senderRole,
          message: payload.message
        });
        break;
      }

      case "change_request": {
        const project = await loadProjectContextOrFail(payload.projectId, session);
        if (!project.pm) {
          throw new HttpError(400, "El proyecto aún no tiene PM asignado.");
        }

        await sendChangeRequestEmail({
          recipientEmail: project.pm.email,
          recipientName: project.pm.name,
          requestedBy: session.user.name,
          projectName: project.name,
          title: payload.title,
          detail: payload.detail,
          priority: payload.priority
        });
        break;
      }

      case "deliverable_notification": {
        const project = await loadProjectContextOrFail(payload.projectId, session);

        await sendDeliverableNotificationEmail({
          recipientEmail: project.client.email,
          recipientName: project.client.name,
          projectName: project.name,
          title: payload.title,
          kind: payload.kind,
          fileName: payload.fileName,
          registeredBy: session.user.name
        });
        break;
      }

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
    if (error instanceof HttpError) {
      return NextResponse.json<ApiActionResult>({ ok: false, message: error.message }, { status: error.status });
    }

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
        projectId: requireText(payload.projectId, "projectId"),
        message: requireText(payload.message, "message")
      };
    case "change_request":
      return {
        type: "change_request",
        projectId: requireText(payload.projectId, "projectId"),
        title: requireText(payload.title, "title"),
        detail: requireText(payload.detail, "detail"),
        priority: requireText(payload.priority, "priority")
      };
    case "deliverable_notification":
      return {
        type: "deliverable_notification",
        projectId: requireText(payload.projectId, "projectId"),
        title: requireText(payload.title, "title"),
        kind: requireText(payload.kind, "kind"),
        fileName: optionalText(payload.fileName)
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
