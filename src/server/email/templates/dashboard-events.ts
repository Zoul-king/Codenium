import { buildCtaButton, escapeHtml, formatKeyValueHtml, formatKeyValueText, wrapEmailHtml } from "@/server/email/templates/shared";
import type { QuoteStatus } from "@/lib/types/domain";

interface TemplateResult {
  subject: string;
  text: string;
  html: string;
}

function p(text: string) {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#374151;">${text}</p>`;
}

function strong(text: string) {
  return `<strong style="color:#0f172a;">${escapeHtml(text)}</strong>`;
}

function infoBox(fields: Record<string, string>) {
  return `
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin:20px 0;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        ${formatKeyValueHtml(fields)}
      </table>
    </div>
  `;
}

// ─── MENSAJE DE PROYECTO ────────────────────────────────────────────────────

export function buildDashboardMessageEmail(input: {
  recipientName: string;
  projectName: string;
  senderName: string;
  senderRole: string;
  message: string;
}): TemplateResult {
  const roleLabel = input.senderRole === "client" ? "tu cliente" : "tu PM";

  const subject = `Nuevo mensaje en ${input.projectName}`;

  const text = `Hola ${input.recipientName},\n\n${input.senderName} (${input.senderRole}) te envió un mensaje sobre "${input.projectName}":\n\n"${input.message}"\n\nIngresa al dashboard para responder.`;

  const html = wrapEmailHtml(
    `Nuevo mensaje de ${roleLabel}`,
    `
      ${p(`Hola ${strong(input.recipientName)},`)}
      ${p(`${strong(input.senderName)} te escribió sobre el proyecto ${strong(input.projectName)}:`)}
      <blockquote style="margin:16px 0;padding:14px 20px;background:#f8fafc;border-left:3px solid #4f2f96;border-radius:0 8px 8px 0;font-size:14px;color:#374151;font-style:italic;">
        "${escapeHtml(input.message)}"
      </blockquote>
      ${buildCtaButton("Responder en el dashboard", "#")}
    `
  );

  return { subject, text, html };
}

// ─── SOLICITUD DE CAMBIO ────────────────────────────────────────────────────

export function buildChangeRequestEmail(input: {
  recipientName: string;
  requestedBy: string;
  projectName: string;
  title: string;
  detail: string;
  priority: string;
}): TemplateResult {
  const priorityLabel = input.priority === "high" ? "Alta" : input.priority === "medium" ? "Media" : "Baja";
  const priorityColor = input.priority === "high" ? "#dc2626" : input.priority === "medium" ? "#d97706" : "#16a34a";

  const subject = `Solicitud de cambio en ${input.projectName}: ${input.title}`;

  const text = `Hola ${input.recipientName},\n\n${input.requestedBy} registró una solicitud de cambio.\n\nProyecto: ${input.projectName}\nTítulo: ${input.title}\nPrioridad: ${priorityLabel}\nDetalle: ${input.detail}`;

  const html = wrapEmailHtml(
    "Nueva solicitud de cambio",
    `
      ${p(`Hola ${strong(input.recipientName)},`)}
      ${p(`${strong(input.requestedBy)} registró una solicitud de cambio en el proyecto ${strong(input.projectName)}.`)}
      ${infoBox({ Proyecto: input.projectName, Solicitud: input.title, Solicitado_por: input.requestedBy })}
      <div style="margin:16px 0 24px;">
        <span style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;background:${priorityColor}20;color:${priorityColor};">
          Prioridad ${priorityLabel}
        </span>
      </div>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:20px;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8;">Detalle</p>
        <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">${escapeHtml(input.detail)}</p>
      </div>
      ${buildCtaButton("Ver en el dashboard", "#")}
    `
  );

  return { subject, text, html };
}

// ─── ASIGNACIÓN DE PROYECTO ─────────────────────────────────────────────────

export function buildProjectAssignmentEmail(input: {
  recipientName: string;
  quoteCode: string;
  quoteTitle: string;
  projectName: string;
  counterpartLabel: string;
  counterpartName: string;
}): TemplateResult {
  const subject = `Tu proyecto ${input.projectName} ya fue asignado`;

  const text = `Hola ${input.recipientName},\n\nTu cotización fue aceptada y el proyecto "${input.projectName}" ya tiene equipo asignado.\n\nCotización: ${input.quoteCode}\nProyecto: ${input.projectName}\n${input.counterpartLabel}: ${input.counterpartName}\n\nEn breve recibirás el plan de inicio y el primer hito.`;

  const html = wrapEmailHtml(
    "Tu proyecto arrancó oficialmente",
    `
      ${p(`Hola ${strong(input.recipientName)},`)}
      ${p(`Tenemos noticias. La cotización ${strong(input.quoteCode)} fue aprobada y el proyecto ${strong(input.projectName)} ya tiene equipo asignado. En breve el PM contactará para coordinar el arranque.`)}
      ${infoBox({ Cotización: input.quoteCode, Proyecto: input.projectName, [input.counterpartLabel]: input.counterpartName })}
      ${p("¿Qué sigue? El PM preparará el plan de trabajo inicial y te lo compartirá en el dashboard. Ahí podrás ver hitos, avances y mensajes en tiempo real.")}
      ${buildCtaButton("Ir a mi dashboard", "#")}
    `
  );

  return { subject, text, html };
}

// ─── CUENTA PM CREADA ───────────────────────────────────────────────────────

export function buildPmAccountCreatedEmail(input: { pmName: string }): TemplateResult {
  const subject = "Tu acceso a Codenium está listo";

  const text = `Hola ${input.pmName},\n\nTu cuenta como Project Manager en Codenium fue creada. En breve recibirás tus credenciales de acceso.\n\nEspera el siguiente correo con el enlace de activación.`;

  const html = wrapEmailHtml(
    "Bienvenido al equipo de Codenium",
    `
      ${p(`Hola ${strong(input.pmName)},`)}
      ${p("Tu cuenta como <strong>Project Manager</strong> en Codenium fue configurada. Desde el dashboard podrás gestionar proyectos, comunicarte con clientes y hacer seguimiento de hitos.")}
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;margin:20px 0;">
        <p style="margin:0;font-size:14px;color:#166534;font-weight:600;">¿Qué sigue?</p>
        <ul style="margin:8px 0 0;padding-left:20px;font-size:14px;color:#374151;line-height:1.9;">
          <li>Recibirás un correo con tu enlace de activación</li>
          <li>Al ingresar verás los proyectos asignados</li>
          <li>Podrás comunicarte directamente con cada cliente</li>
        </ul>
      </div>
    `
  );

  return { subject, text, html };
}

// ─── ENTREGABLE ─────────────────────────────────────────────────────────────

export function buildDeliverableNotificationEmail(input: {
  recipientName: string;
  projectName: string;
  title: string;
  kind: string;
  fileName?: string;
  registeredBy: string;
}): TemplateResult {
  const subject = `Nuevo entregable disponible en ${input.projectName}`;

  const text = `Hola ${input.recipientName},\n\nHay un nuevo entregable disponible en tu proyecto "${input.projectName}".\n\nEntregable: ${input.title}\nTipo: ${input.kind}\n${input.fileName ? `Archivo: ${input.fileName}\n` : ""}Registrado por: ${input.registeredBy}\n\nIngresa al dashboard para revisarlo.`;

  const html = wrapEmailHtml(
    "Nuevo entregable disponible",
    `
      ${p(`Hola ${strong(input.recipientName)},`)}
      ${p(`Hay un nuevo entregable disponible en el proyecto ${strong(input.projectName)}. Ingresa al dashboard para revisarlo y dejar tu retroalimentación.`)}
      ${infoBox({ Entregable: input.title, Tipo: input.kind, ...(input.fileName ? { Archivo: input.fileName } : {}), "Preparado por": input.registeredBy })}
      ${buildCtaButton("Ver entregable", "#")}
    `
  );

  return { subject, text, html };
}

// ─── ESTADO DE COTIZACIÓN ───────────────────────────────────────────────────

export function buildQuoteStatusEmail(input: {
  recipientName: string;
  quoteCode: string;
  quoteTitle: string;
  status: QuoteStatus;
}): TemplateResult {
  const isRejected = input.status === "rejected";
  const isReviewed = input.status === "reviewed";

  const subject = isRejected
    ? `Tu solicitud ${input.quoteCode} no pudo avanzar`
    : isReviewed
      ? `Estamos revisando tu cotización ${input.quoteCode}`
      : `Actualización en tu cotización ${input.quoteCode}`;

  const headingText = isRejected
    ? "Sobre tu solicitud de proyecto"
    : isReviewed
      ? "Tu cotización está en revisión"
      : "Actualización en tu cotización";

  const text = isRejected
    ? `Hola ${input.recipientName},\n\nAnalizamos tu solicitud "${input.quoteTitle}" (${input.quoteCode}) y en esta ocasión no podemos continuar.\n\nEsto no cierra la puerta. Si tienes preguntas o quieres explorar otras opciones, escríbenos.\n\nGracias por confiar en Codenium.`
    : isReviewed
      ? `Hola ${input.recipientName},\n\nTu cotización "${input.quoteTitle}" (${input.quoteCode}) está siendo revisada por nuestro equipo. Te avisaremos pronto.`
      : `Hola ${input.recipientName},\n\nTu cotización fue actualizada.\n\nCotización: ${input.quoteCode}\nAlcance: ${input.quoteTitle}`;

  const html = wrapEmailHtml(
    headingText,
    isRejected
      ? `
        ${p(`Hola ${strong(input.recipientName)},`)}
        ${p(`Revisamos tu solicitud ${strong(input.quoteCode)} — ${strong(input.quoteTitle)} — y en esta ocasión no podemos avanzar con el proyecto.`)}
        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:20px;margin:20px 0;">
          <p style="margin:0;font-size:14px;color:#9a3412;line-height:1.7;">
            Esto no cierra la puerta. Si quieres conocer las razones, explorar alternativas o ajustar el alcance, puedes responder este correo directamente.
          </p>
        </div>
        ${p("Gracias por tu confianza en <strong>Codenium</strong>.")}
      `
      : isReviewed
        ? `
          ${p(`Hola ${strong(input.recipientName)},`)}
          ${p(`Tu cotización ${strong(input.quoteCode)} está siendo analizada por el equipo. Esto normalmente toma 1–2 días hábiles.`)}
          ${infoBox({ Cotización: input.quoteCode, Alcance: input.quoteTitle, Estado: "En revisión" })}
          ${p("Te notificaremos en cuanto tengamos una respuesta. Mientras tanto, si tienes información adicional que quieras agregar, responde este correo.")}
        `
        : `
          ${p(`Hola ${strong(input.recipientName)},`)}
          ${infoBox({ Cotización: input.quoteCode, Alcance: input.quoteTitle })}
        `
  );

  return { subject, text, html };
}

// ─── AGENDAR REUNIÓN ────────────────────────────────────────────────────────

export function buildMeetingScheduledEmail(input: {
  recipientName: string;
  projectName: string;
  date: string;
  time: string;
  duration: string;
  meetingLink?: string;
  agenda?: string;
  hostName: string;
}): TemplateResult {
  const subject = `Reunión agendada: ${input.projectName} · ${input.date}`;

  const text = [
    `Hola ${input.recipientName},`,
    ``,
    `${input.hostName} agendó una reunión sobre el proyecto "${input.projectName}".`,
    ``,
    `Fecha: ${input.date}`,
    `Hora: ${input.time}`,
    `Duración estimada: ${input.duration}`,
    input.meetingLink ? `Enlace: ${input.meetingLink}` : "",
    input.agenda ? `\nAgenda:\n${input.agenda}` : "",
    ``,
    `Cualquier duda, responde este correo.`,
  ].filter((l) => l !== undefined).join("\n");

  const html = wrapEmailHtml(
    "Reunión agendada",
    `
      ${p(`Hola ${strong(input.recipientName)},`)}
      ${p(`${strong(input.hostName)} agendó una reunión relacionada al proyecto ${strong(input.projectName)}.`)}

      <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:12px;padding:24px;margin:20px 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="width:36px;vertical-align:top;padding-right:12px;padding-top:2px;">
              <div style="width:36px;height:36px;border-radius:8px;background:#4f2f96;display:flex;align-items:center;justify-content:center;text-align:center;line-height:36px;font-size:18px;">📅</div>
            </td>
            <td style="vertical-align:top;">
              <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#0f172a;">${escapeHtml(input.date)}</p>
              <p style="margin:0;font-size:14px;color:#6b7280;">${escapeHtml(input.time)} · ${escapeHtml(input.duration)}</p>
            </td>
          </tr>
        </table>
      </div>

      ${input.agenda ? `
        <div style="margin:20px 0;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8;">Agenda</p>
          <p style="margin:0;font-size:14px;color:#374151;white-space:pre-line;line-height:1.8;">${escapeHtml(input.agenda)}</p>
        </div>
      ` : ""}

      ${input.meetingLink ? buildCtaButton("Unirse a la reunión", input.meetingLink) : ""}

      ${p("Si no puedes asistir o necesitas cambiar el horario, responde este correo con anticipación.")}
    `
  );

  return { subject, text, html };
}
