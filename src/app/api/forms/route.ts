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
import type { ApiActionResult, PublicLeadPayload } from "@/server/email/types";
import {
  sendContactConfirmationToLead,
  sendContactNotificationToCompany,
  sendQuoteConfirmationToLead,
  sendQuoteNotificationToCompany
} from "@/server/email";

// Rate limit simple en memoria: máx 3 envíos por IP cada 10 minutos
const submissionTracker = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 3;
const WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = submissionTracker.get(ip);

  if (!entry || entry.resetAt < now) {
    submissionTracker.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= LIMIT) return false;

  entry.count++;
  return true;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json<ApiActionResult>(
      { ok: false, message: "Demasiados intentos. Intenta en unos minutos." },
      { status: 429 }
    );
  }

  try {
    const payload = (await request.json()) as Partial<PublicLeadPayload>;
    const lead = validatePublicLead(payload);

    // 1) Persistir la solicitud en la base de datos para que el Admin la vea
    //    en su dashboard. Para /quote creamos una Quote real (con un User
    //    sintético inactivo si el lead no tiene cuenta). Siempre dejamos un
    //    ContactLead como traza de origen.
    await persistPublicLead(lead);

    // 2) Notificar por correo (existing flow).
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

async function persistPublicLead(lead: PublicLeadPayload) {
  const fullName = `${lead.firstName} ${lead.lastName}`.trim();
  const hidden = lead.hiddenFields ?? {};
  const isQuote = lead.source === "quote";

  // Reusa la cuenta del lead si ya existe (por correo); de lo contrario crea
  // una cuenta inactiva con un hash aleatorio para que no se pueda usar para
  // login (login además rechaza usuarios no ACTIVOS).
  const emailKey = lead.email.toLowerCase();
  const existing = await db.user.findUnique({ where: { email: emailKey } });

  const placeholderPassword = randomBytes(32).toString("hex");
  const placeholderHash = await hashPassword(placeholderPassword);

  const user = existing
    ? existing
    : await db.user.create({
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
