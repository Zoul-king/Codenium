import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import {
  BillingModel,
  LeadSource,
  LeadStatus,
  PlanCategory,
  PlanTier,
  ProjectType,
  QuoteStatus,
  UserRole,
  UserStatus
} from "@prisma/client";

import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { isTransientDbError } from "@/lib/db/retry";
import { getCurrentSession } from "@/lib/auth/session";
import type { ApiActionResult, PublicLeadPayload } from "@/server/email/types";
import {
  sendContactConfirmationToLead,
  sendContactNotificationToCompany,
  sendQuoteConfirmationToLead,
  sendQuoteNotificationToCompany
} from "@/server/email";

class PublicValidationError extends Error {}

// Rate limit en memoria. La clave es (ip + email normalizado) para que:
//   - Un mismo usuario pueda enviar varias solicitudes (hasta LIMIT en la ventana).
//   - Distintas personas que comparten IP (oficina, café, NAT móvil) no se
//     bloqueen entre sí: cada combinación ip+email tiene su propio cupo.
//   - Sigue habiendo un techo por IP (IP_HARD_LIMIT) para frenar abuso masivo
//     desde una sola IP, independiente del correo usado.
const submissionTracker = new Map<string, { count: number; resetAt: number }>();
const ipHardTracker = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 3;
const IP_HARD_LIMIT = 20;
const WINDOW_MS = 20 * 60 * 1000;

function bumpBucket(
  store: Map<string, { count: number; resetAt: number }>,
  key: string,
  limit: number
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}

function checkRateLimit(ip: string, email: string): boolean {
  const emailKey = email.trim().toLowerCase();
  // El cupo por (ip, email) es el "principal". Si ya se agotó, rechazamos
  // sin tocar el contador global por IP para no penalizar a otros usuarios.
  if (!bumpBucket(submissionTracker, `${ip}|${emailKey}`, LIMIT)) return false;
  // Techo por IP: si una sola IP intenta inundar con muchos correos distintos,
  // termina chocando aquí.
  if (!bumpBucket(ipHardTracker, ip, IP_HARD_LIMIT)) return false;
  return true;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Parseamos primero para poder rate-limit por (ip, email): así una misma IP
  // (oficina, NAT, café) puede albergar varios usuarios sin bloquearse entre
  // sí, y un mismo usuario sigue limitado a LIMIT por ventana.
  let lead: PublicLeadPayload;
  try {
    const payload = (await request.json()) as Partial<PublicLeadPayload>;
    lead = validatePublicLead(payload);
  } catch (error) {
    return NextResponse.json<ApiActionResult>(
      {
        ok: false,
        message:
          error instanceof PublicValidationError
            ? error.message
            : "No pudimos leer los datos del formulario."
      },
      { status: 400 }
    );
  }

  if (!checkRateLimit(ip, lead.email)) {
    return NextResponse.json<ApiActionResult>(
      { ok: false, message: "Demasiados intentos. Intenta en unos minutos." },
      { status: 429 }
    );
  }

  // Si el formulario lo envía un usuario con sesión iniciada, asociamos la
  // cotización a su cuenta directamente — así el cliente ve su proyecto en
  // su dashboard cuando el admin lo apruebe (independiente del email tipeado).
  const session = await getCurrentSession().catch(() => null);
  const sessionUserId = session?.user.role === "client" ? session.user.id : null;

  // 1) Persistir la solicitud en la base de datos para que el Admin la vea
  //    en su dashboard. Si la base de datos no responde, no bloqueamos el envío
  //    del correo: registramos el error y seguimos.
  let persisted = true;
  try {
    await persistPublicLead(lead, sessionUserId);
  } catch (error) {
    persisted = false;
    console.error("[forms] persistPublicLead failed", {
      source: lead.source,
      email: lead.email,
      transient: isTransientDbError(error),
      message: error instanceof Error ? error.message.split("\n")[0] : String(error)
    });
  }

  // 2) Notificar por correo. El correo tampoco debe tumbar la respuesta al
  //    usuario; si falla, lo registramos y devolvemos un mensaje claro.
  let emailed = true;
  try {
    if (lead.source === "quote") {
      await Promise.all([sendQuoteNotificationToCompany(lead), sendQuoteConfirmationToLead(lead)]);
    } else {
      await Promise.all([sendContactNotificationToCompany(lead), sendContactConfirmationToLead(lead)]);
    }
  } catch (error) {
    emailed = false;
    console.error("[forms] email send failed", {
      source: lead.source,
      email: lead.email,
      message: error instanceof Error ? error.message.split("\n")[0] : String(error)
    });
  }

  if (!persisted && !emailed) {
    return NextResponse.json<ApiActionResult>(
      {
        ok: false,
        message:
          "No pudimos procesar tu solicitud en este momento. Por favor intenta de nuevo en unos segundos."
      },
      { status: 503 }
    );
  }

  if (!emailed) {
    return NextResponse.json<ApiActionResult>({
      ok: true,
      message:
        "Recibimos tu solicitud y la registramos, pero no pudimos enviar la confirmacion por correo. Te contactaremos pronto."
    });
  }

  return NextResponse.json<ApiActionResult>({
    ok: true,
    message: persisted
      ? "Tu solicitud fue enviada correctamente."
      : "Recibimos tu solicitud. La estamos registrando, te contactaremos pronto."
  });
}

async function persistPublicLead(lead: PublicLeadPayload, sessionUserId: string | null) {
  const fullName = `${lead.firstName} ${lead.lastName}`.trim();
  const hidden = lead.hiddenFields ?? {};
  const isQuote = lead.source === "quote";

  // Si hay sesión activa de cliente, ese es el dueño de la solicitud.
  // Sino, reusa la cuenta por correo o crea una inactiva como respaldo.
  const emailKey = lead.email.toLowerCase();

  let user;
  if (sessionUserId) {
    user = await db.user.findUnique({ where: { id: sessionUserId } });
  }

  if (!user) {
    user = await db.user.findUnique({ where: { email: emailKey } });
  }

  if (!user) {
    const placeholderPassword = randomBytes(32).toString("hex");
    const placeholderHash = await hashPassword(placeholderPassword);

    user = await db.user.create({
      data: {
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: emailKey,
        phone: lead.phone,
        passwordHash: placeholderHash,
        role: UserRole.CLIENT,
        status: UserStatus.INACTIVE
      }
    });
  }

  // Registrar el lead independientemente del origen.
  await db.contactLead.create({
    data: {
      name: fullName || lead.email,
      email: lead.email,
      phone: lead.phone || null,
      message: lead.message || null,
      source: isQuote ? LeadSource.QUOTE_FORM : LeadSource.CONTACT_FORM,
      status: LeadStatus.NEW,
      userId: user.id
    }
  });

  // Generar también una Quote para que aparezca en el panel del Admin
  // (tanto las del cotizador /quote como las del contacto /contact se
  //  comportan como solicitudes que el admin debe revisar).
  const titleFromHidden = hidden.selected_plan?.trim();
  const title = titleFromHidden && titleFromHidden.length > 0
    ? titleFromHidden
    : isQuote
      ? "Solicitud desde el cotizador"
      : "Solicitud desde el formulario de contacto";

  const description = [
    lead.message && `Mensaje: ${lead.message}`,
    hidden.objective && `Objetivo: ${hidden.objective}`,
    hidden.project_category && `Tipo: ${hidden.project_category}`,
    hidden.infrastructure && `Infraestructura: ${hidden.infrastructure}`,
    hidden.timeline && `Tiempo: ${hidden.timeline}`,
    hidden.capabilities && `Capacidades: ${hidden.capabilities}`,
    hidden.estimate_range && `Estimado: ${hidden.estimate_range}`,
    `Origen: ${lead.originPath}`,
    `Contacto: ${fullName} · ${lead.email} · ${lead.phone}`
  ]
    .filter(Boolean)
    .join("\n");

  const planCategory = mapPlanCategory(hidden.plan_profile);
  const planTier = mapPlanTier(hidden.selected_plan);
  const projectType = mapProjectType(hidden.project_category);
  const estimatedPrice = parseEstimateMin(hidden.estimate_range);

  await db.quote.create({
    data: {
      folio: generateFolio(),
      clientId: user.id,
      title,
      description,
      projectType,
      planCategory,
      planTier,
      billingModel: BillingModel.ONE_TIME,
      estimatedPrice,
      estimatedTimeline: hidden.timeline || null,
      status: QuoteStatus.SUBMITTED
    }
  });
}

function generateFolio() {
  return `Q-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;
}

function mapPlanCategory(value?: string): PlanCategory {
  if (!value) return PlanCategory.PERSONAL;
  return /empresarial|business/i.test(value) ? PlanCategory.BUSINESS : PlanCategory.PERSONAL;
}

function mapPlanTier(value?: string): PlanTier {
  if (!value) return PlanTier.ONE_TIME;
  if (/premium|enterprise|empresarial/i.test(value)) return PlanTier.PREMIUM;
  if (/intermedi|pyme|growth/i.test(value)) return PlanTier.INTERMEDIATE;
  if (/basic|inicial|starter|b[áa]sico/i.test(value)) return PlanTier.BASIC;
  return PlanTier.ONE_TIME;
}

function mapProjectType(value?: string): ProjectType {
  if (!value) return ProjectType.OTHER;
  const v = value.toLowerCase();
  if (/m[óo]vil|mobile|app/.test(v)) return ProjectType.MOBILE;
  if (/escritorio|desktop/.test(v)) return ProjectType.DESKTOP;
  if (/automat|bot|integraci/.test(v)) return ProjectType.AUTOMATION;
  if (/web|sitio|portal|landing|tienda|e-?commerce|saas|crm|erp/.test(v)) return ProjectType.WEB;
  return ProjectType.OTHER;
}

function parseEstimateMin(value?: string): number | null {
  if (!value) return null;
  // Quita comas y miles separator; toma el primer número contiguo.
  const match = value.replace(/[, \s](?=\d)/g, "").match(/\d+/);
  if (!match) return null;
  const n = Number(match[0]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function validatePublicLead(payload: Partial<PublicLeadPayload>): PublicLeadPayload {
  const source = payload.source === "quote" ? "quote" : payload.source === "contact" ? "contact" : null;

  if (!source) {
    throw new PublicValidationError("No pudimos identificar el origen del formulario.");
  }

  const firstName = payload.firstName?.trim() ?? "";
  const lastName = payload.lastName?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const phone = payload.phone?.trim() ?? "";
  const message = payload.message?.trim() ?? "";
  const originPath = payload.originPath?.trim() ?? source;

  if (!firstName || !lastName || !email || !phone || !message) {
    throw new PublicValidationError("Completa nombre, apellidos, correo, telefono y mensaje.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new PublicValidationError("Escribe un correo valido.");
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
