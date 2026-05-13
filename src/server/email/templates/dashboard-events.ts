import { buildCtaButton, escapeHtml, formatKeyValueHtml, formatKeyValueText, lucideIcon, wrapEmailHtml } from "@/server/email/templates/shared";
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

  const text = [
    `Hola ${input.recipientName},`,
    ``,
    `${input.senderName} (${input.senderRole}) escribió en "${input.projectName}":`,
    ``,
    `"${input.message}"`,
    ``,
    `Ingresa al dashboard para responder.`,
    ``,
    `Equipo Codenium`
  ].join("\n");

  const html = wrapEmailHtml(
    `Nuevo mensaje de ${roleLabel}`,
    `
      ${p(`Hola ${strong(input.recipientName)},`)}
      ${p(`${strong(input.senderName)} te escribió sobre el proyecto ${strong(input.projectName)}:`)}
      <blockquote style="margin:16px 0;padding:14px 20px;background:#f8fafc;border-left:3px solid #224a78;border-radius:0 8px 8px 0;font-size:14px;color:#374151;font-style:italic;">
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

  const text = [
    `Hola ${input.recipientName},`,
    ``,
    `${input.requestedBy} registró una solicitud de cambio.`,
    ``,
    `Proyecto: ${input.projectName}`,
    `Título: ${input.title}`,
    `Prioridad: ${priorityLabel}`,
    ``,
    `Detalle:`,
    input.detail,
    ``,
    `Equipo Codenium`
  ].join("\n");

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

  const text = [
    `Hola ${input.recipientName},`,
    ``,
    `Tu cotización fue aceptada y el proyecto "${input.projectName}" ya tiene equipo asignado.`,
    ``,
    `Cotización: ${input.quoteCode}`,
    `Proyecto: ${input.projectName}`,
    `${input.counterpartLabel}: ${input.counterpartName}`,
    ``,
    `En breve recibirás el plan de inicio y el primer hito.`,
    ``,
    `Equipo Codenium`
  ].join("\n");

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

export function buildPmAccountCreatedEmail(input: {
  pmName: string;
  pmEmail: string;
  tempPassword: string;
  loginUrl: string;
}): TemplateResult {
  const subject = "Bienvenido al equipo de Codenium";

  const text = [
    `Hola ${input.pmName},`,
    ``,
    `Bienvenido al equipo. Tu cuenta como Project Manager ya está activa.`,
    ``,
    `Credenciales de acceso:`,
    `  Correo: ${input.pmEmail}`,
    `  Contraseña temporal: ${input.tempPassword}`,
    ``,
    `Inicia sesión en ${input.loginUrl} y cambia la contraseña desde tu perfil al primer acceso.`,
    ``,
    `Equipo Codenium`
  ].join("\n");

  const html = wrapEmailHtml(
    "Bienvenido al equipo de Codenium",
    `
      ${p(`Hola ${strong(input.pmName)},`)}
      ${p("Tu cuenta como <strong>Project Manager</strong> ya está activa. Desde el dashboard podrás gestionar proyectos, comunicarte con clientes y dar seguimiento a hitos.")}
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;margin:20px 0;">
        <p style="margin:0 0 10px;font-size:14px;color:#166534;font-weight:600;">Credenciales de acceso</p>
        <p style="margin:4px 0;font-size:14px;color:#374151;">Correo: ${strong(input.pmEmail)}</p>
        <p style="margin:4px 0;font-size:14px;color:#374151;">Contraseña temporal: ${strong(input.tempPassword)}</p>
        <p style="margin:10px 0 0;font-size:12px;color:#6b7280;">Cámbiala desde tu perfil al primer acceso.</p>
      </div>
      ${buildCtaButton("Entrar al dashboard", input.loginUrl)}
    `
  );

  return { subject, text, html };
}

// ─── CUENTA CLIENTE CREADA POR EL ADMIN ─────────────────────────────────────

export function buildClientAccountCreatedByAdminEmail(input: {
  clientName: string;
  clientEmail: string;
  tempPassword: string;
  loginUrl: string;
}): TemplateResult {
  const subject = "Tu cuenta de Codenium está lista";

  const text = [
    `Hola ${input.clientName},`,
    ``,
    `El equipo de Codenium creó una cuenta para ti. Desde ahí podrás seguir tus cotizaciones, proyectos y hablar con tu Project Manager.`,
    ``,
    `Credenciales de acceso:`,
    `  Correo: ${input.clientEmail}`,
    `  Contraseña temporal: ${input.tempPassword}`,
    ``,
    `Inicia sesión en ${input.loginUrl} y, de preferencia, cambia la contraseña desde tu perfil al primer acceso.`,
    ``,
    `Equipo Codenium`
  ].join("\n");

  const html = wrapEmailHtml(
    "Tu cuenta de Codenium está lista",
    `
      ${p(`Hola ${strong(input.clientName)},`)}
      ${p("Creamos una cuenta para ti dentro de la plataforma de Codenium. Desde el dashboard podrás dar seguimiento a cotizaciones, proyectos, hitos y comunicación con tu Project Manager.")}
      <div style="background:#eff6fb;border:1px solid #bedcee;border-radius:10px;padding:20px;margin:20px 0;">
        <p style="margin:0 0 10px;font-size:14px;color:#1d4674;font-weight:600;">Credenciales de acceso</p>
        <p style="margin:4px 0;font-size:14px;color:#374151;">Correo: ${strong(input.clientEmail)}</p>
        <p style="margin:4px 0;font-size:14px;color:#374151;">Contraseña temporal: ${strong(input.tempPassword)}</p>
        <p style="margin:10px 0 0;font-size:12px;color:#6b7280;">De preferencia, cámbiala desde tu perfil al primer acceso.</p>
      </div>
      ${buildCtaButton("Entrar a mi dashboard", input.loginUrl)}
    `
  );

  return { subject, text, html };
}

// ─── CUENTA CLIENTE CREADA ──────────────────────────────────────────────────

export function buildClientWelcomeEmail(input: {
  clientName: string;
  dashboardUrl: string;
  quoteUrl: string;
}): TemplateResult {
  const subject = "Bienvenido a Codenium · Inicia la creación de tu proyecto";

  const text = [
    `Hola ${input.clientName},`,
    ``,
    `Bienvenido a Codenium. Tu cuenta ya está lista para arrancar la creación de tu proyecto.`,
    ``,
    `¿Qué sigue?`,
    `  1. Cuéntanos lo que necesitas usando el cotizador.`,
    `  2. Revisamos tu solicitud y preparamos una propuesta.`,
    `  3. Aceptas la cotización y asignamos un Project Manager.`,
    ``,
    `Cotizador: ${input.quoteUrl}`,
    `Tu dashboard: ${input.dashboardUrl}`,
    ``,
    `Equipo Codenium`
  ].join("\n");

  const html = wrapEmailHtml(
    "Bienvenido a Codenium",
    `
      ${p(`Hola ${strong(input.clientName)},`)}
      ${p("Tu cuenta ya está lista. Desde el dashboard podrás iniciar la creación de tu proyecto, dar seguimiento a las cotizaciones y comunicarte con tu Project Manager.")}
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;margin:20px 0;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#166534;">¿Qué sigue?</p>
        <ol style="margin:0;padding-left:20px;font-size:13px;color:#374151;line-height:2;">
          <li>Cuéntanos lo que necesitas usando el cotizador.</li>
          <li>Revisamos tu solicitud y preparamos una propuesta.</li>
          <li>Aceptas la cotización y asignamos un Project Manager.</li>
        </ol>
      </div>
      ${buildCtaButton("Empezar mi cotización", input.quoteUrl)}
      <p style="margin:0;font-size:13px;color:#6b7280;">¿Prefieres explorar primero? Entra a tu <a href="${escapeHtml(input.dashboardUrl)}" style="color:#224a78;font-weight:600;">dashboard</a>.</p>
    `
  );

  return { subject, text, html };
}

// ─── RESTABLECER CONTRASEÑA ─────────────────────────────────────────────────

export function buildPasswordResetEmail(input: {
  recipientName: string;
  resetUrl: string;
  expiresInMinutes: number;
}): TemplateResult {
  const subject = "Restablece tu contraseña de Codenium";

  const text = [
    `Hola ${input.recipientName},`,
    ``,
    `Recibimos una solicitud para restablecer tu contraseña de Codenium.`,
    ``,
    `Abre este enlace para definir una nueva contraseña:`,
    input.resetUrl,
    ``,
    `El enlace expira en ${input.expiresInMinutes} minutos.`,
    ``,
    `Si tú no hiciste esta solicitud, ignora este correo — tu contraseña actual sigue activa.`,
    ``,
    `Equipo Codenium`
  ].join("\n");

  const html = wrapEmailHtml(
    "Restablece tu contraseña",
    `
      ${p(`Hola ${strong(input.recipientName)},`)}
      ${p("Recibimos una solicitud para restablecer tu contraseña de Codenium. Usa el siguiente enlace para definir una nueva.")}
      ${buildCtaButton("Restablecer contraseña", input.resetUrl)}
      ${p(`El enlace expira en <strong>${input.expiresInMinutes} minutos</strong>. Si tú no hiciste esta solicitud, ignora este correo — tu contraseña actual sigue activa.`)}
      <p style="margin:0;font-size:12px;color:#94a3b8;word-break:break-all;">${escapeHtml(input.resetUrl)}</p>
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

  const detailLines = [
    `Entregable: ${input.title}`,
    `Tipo: ${input.kind}`,
    ...(input.fileName ? [`Archivo: ${input.fileName}`] : []),
    `Registrado por: ${input.registeredBy}`
  ];

  const text = [
    `Hola ${input.recipientName},`,
    ``,
    `Hay un nuevo entregable disponible en "${input.projectName}".`,
    ``,
    ...detailLines,
    ``,
    `Ingresa al dashboard para revisarlo.`,
    ``,
    `Equipo Codenium`
  ].join("\n");

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

      <div style="background:#eff6fb;border:1px solid #bedcee;border-radius:12px;padding:20px 24px;margin:20px 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="width:44px;vertical-align:top;padding-right:14px;padding-top:2px;">
              <div style="width:44px;height:44px;border-radius:10px;background:#224a78;text-align:center;line-height:44px;">
                ${lucideIcon("calendar", 22, "#ffffff")}
              </div>
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
