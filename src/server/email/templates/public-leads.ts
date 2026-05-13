import type { PublicLeadPayload } from "@/server/email/types";
import { escapeHtml, formatKeyValueHtml, wrapEmailHtml } from "@/server/email/templates/shared";

interface PublicLeadTemplateInput {
  lead: PublicLeadPayload;
  receivedAt: string;
}

function p(text: string) {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#374151;">${text}</p>`;
}

function strong(text: string) {
  return `<strong style="color:#0f172a;">${escapeHtml(text)}</strong>`;
}

export function buildCompanyLeadEmail({ lead, receivedAt }: PublicLeadTemplateInput) {
  const isQuote = lead.source === "quote";
  const fullName = `${lead.firstName} ${lead.lastName}`;

  const coreFields: Record<string, string> = {
    Nombre: fullName,
    Correo: lead.email,
    Teléfono: lead.phone,
    Fecha: receivedAt,
    Mensaje: lead.message
  };

  if (lead.hiddenFields) {
    Object.entries(lead.hiddenFields).forEach(([key, value]) => {
      if (value?.trim()) {
        coreFields[normalizeHiddenFieldLabel(key)] = value;
      }
    });
  }

  const subject = isQuote
    ? `Nueva solicitud de cotización de ${fullName}`
    : `Nuevo mensaje de contacto de ${fullName}`;

  const headingText = isQuote ? "Nueva solicitud de cotización" : "Nuevo mensaje de contacto";

  const text = `${headingText}\n\nNombre: ${fullName}\nCorreo: ${lead.email}\nTeléfono: ${lead.phone}\nFecha: ${receivedAt}\nMensaje: ${lead.message}`;

  const html = wrapEmailHtml(
    headingText,
    `
      ${p(`Se recibió un nuevo ${isQuote ? "solicitud de cotización" : "mensaje de contacto"} desde ${strong(lead.originPath)}.`)}
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin:20px 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          ${formatKeyValueHtml(coreFields)}
        </table>
      </div>
      <p style="margin:0;font-size:12px;color:#94a3b8;">Ya se envió confirmación automática al contacto. Responde a <a href="mailto:${escapeHtml(lead.email)}" style="color:#224a78;">${escapeHtml(lead.email)}</a> para continuar.</p>
    `
  );

  return { subject, text, html };
}

export function buildLeadConfirmationEmail({ lead, receivedAt }: PublicLeadTemplateInput) {
  const isQuote = lead.source === "quote";
  const subject = isQuote ? "Recibimos tu solicitud de cotización" : "Recibimos tu mensaje";
  const headingText = isQuote ? "Tu solicitud llegó bien" : "Recibimos tu mensaje";

  const text = [
    `Hola ${lead.firstName},`,
    ``,
    isQuote
      ? "Recibimos tu solicitud de cotización. Nuestro equipo la revisará y te contactará en los próximos 1–2 días hábiles para preparar una propuesta más detallada."
      : "Recibimos tu mensaje. Lo revisaremos pronto y te responderemos lo antes posible.",
    ``,
    `Mensaje enviado:`,
    `"${lead.message}"`,
    ``,
    `Fecha de recepción: ${receivedAt}`,
    ``,
    `Equipo Codenium`,
  ].join("\n");

  const html = wrapEmailHtml(
    headingText,
    `
      ${p(`Hola ${strong(lead.firstName)},`)}
      ${isQuote
        ? p("Recibimos tu solicitud de cotización y ya está en manos del equipo. En los próximos <strong>1–2 días hábiles</strong> te contactaremos para revisar el alcance y preparar una propuesta más detallada.")
        : p("Gracias por escribirnos. Revisaremos tu mensaje y te responderemos pronto.")
      }

      <div style="background:#f8fafc;border-left:3px solid #224a78;border-radius:0 8px 8px 0;padding:16px 20px;margin:20px 0;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8;">Tu mensaje</p>
        <p style="margin:0;font-size:14px;color:#374151;font-style:italic;">"${escapeHtml(lead.message)}"</p>
      </div>

      ${isQuote ? `
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;margin:20px 0;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#166534;">¿Qué sigue?</p>
          <ol style="margin:0;padding-left:20px;font-size:13px;color:#374151;line-height:2;">
            <li>El equipo revisará tu solicitud</li>
            <li>Te contactaremos para agendar una sesión inicial</li>
            <li>Prepararemos una propuesta con alcance y costos reales</li>
          </ol>
        </div>
      ` : ""}

      <p style="margin:0;font-size:12px;color:#94a3b8;">Recibido el ${escapeHtml(receivedAt)}</p>
    `
  );

  return { subject, text, html };
}

function normalizeHiddenFieldLabel(key: string) {
  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

