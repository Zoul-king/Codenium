import { formatKeyValueHtml, formatKeyValueText, wrapEmailHtml } from "@/server/email/templates/shared";

interface TemplateResult {
  subject: string;
  text: string;
  html: string;
}

export function buildDashboardMessageEmail(input: {
  recipientName: string;
  projectName: string;
  senderName: string;
  senderRole: string;
  message: string;
}): TemplateResult {
  const fields = {
    Proyecto: input.projectName,
    Remitente: input.senderName,
    Rol: input.senderRole,
    Mensaje: input.message
  };

  return {
    subject: `Nuevo mensaje sobre ${input.projectName}`,
    text: `Hola ${input.recipientName},\n\nTienes un nuevo mensaje.\n\n${formatKeyValueText(fields)}`,
    html: wrapEmailHtml(`Nuevo mensaje sobre ${input.projectName}`, `<table style="width:100%;border-collapse:collapse;">${formatKeyValueHtml(fields)}</table>`)
  };
}

export function buildChangeRequestEmail(input: {
  recipientName: string;
  requestedBy: string;
  projectName: string;
  title: string;
  detail: string;
  priority: string;
}): TemplateResult {
  const fields = {
    Proyecto: input.projectName,
    "Solicitado por": input.requestedBy,
    Prioridad: input.priority,
    Titulo: input.title,
    Descripcion: input.detail
  };

  return {
    subject: `Nueva solicitud de cambio en ${input.projectName}`,
    text: `Hola ${input.recipientName},\n\nSe registro una nueva solicitud de cambio.\n\n${formatKeyValueText(fields)}`,
    html: wrapEmailHtml(`Nueva solicitud de cambio en ${input.projectName}`, `<table style="width:100%;border-collapse:collapse;">${formatKeyValueHtml(fields)}</table>`)
  };
}

export function buildProjectAssignmentEmail(input: {
  recipientName: string;
  quoteCode: string;
  quoteTitle: string;
  projectName: string;
  counterpartLabel: string;
  counterpartName: string;
}): TemplateResult {
  const fields = {
    Cotizacion: input.quoteCode,
    Alcance: input.quoteTitle,
    Proyecto: input.projectName,
    [input.counterpartLabel]: input.counterpartName
  };

  return {
    subject: `Asignacion confirmada para ${input.projectName}`,
    text: `Hola ${input.recipientName},\n\nLa cotizacion ya fue aceptada y asignada.\n\n${formatKeyValueText(fields)}`,
    html: wrapEmailHtml(`Asignacion confirmada para ${input.projectName}`, `<table style="width:100%;border-collapse:collapse;">${formatKeyValueHtml(fields)}</table>`)
  };
}

export function buildPmAccountCreatedEmail(input: { pmName: string }): TemplateResult {
  const text = `Hola ${input.pmName},\n\nTu cuenta fue registrada o pre-registrada en el sistema de Codenium.\n\nEn el siguiente paso te compartiremos el acceso definitivo o la activacion correspondiente.`;
  const html = wrapEmailHtml(
    "Tu cuenta fue registrada en Codenium",
    `<p style="margin:0;font-size:14px;line-height:1.7;color:#475569;">Hola ${input.pmName}, tu cuenta fue registrada o pre-registrada en el sistema. El siguiente paso es compartirte el acceso definitivo o la activacion correspondiente.</p>`
  );

  return {
    subject: "Tu cuenta fue registrada en Codenium",
    text,
    html
  };
}

export function buildDeliverableNotificationEmail(input: {
  recipientName: string;
  projectName: string;
  title: string;
  kind: string;
  fileName?: string;
  registeredBy: string;
}): TemplateResult {
  const fields = {
    Proyecto: input.projectName,
    Entregable: input.title,
    Tipo: input.kind,
    Archivo: input.fileName ?? "Registrado internamente",
    "Registrado por": input.registeredBy
  };

  return {
    subject: `Nuevo entregable en ${input.projectName}`,
    text: `Hola ${input.recipientName},\n\nSe registro un nuevo entregable en tu proyecto.\n\n${formatKeyValueText(fields)}`,
    html: wrapEmailHtml(`Nuevo entregable en ${input.projectName}`, `<table style="width:100%;border-collapse:collapse;">${formatKeyValueHtml(fields)}</table>`)
  };
}
