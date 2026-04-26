import type { PublicLeadPayload } from "@/server/email/types";
import { formatKeyValueHtml, formatKeyValueText, wrapEmailHtml } from "@/server/email/templates/shared";

interface PublicLeadTemplateInput {
  lead: PublicLeadPayload;
  receivedAt: string;
}

export function buildCompanyLeadEmail({ lead, receivedAt }: PublicLeadTemplateInput) {
  const detailFields: Record<string, string> = {
    Origen: lead.source,
    Ruta: lead.originPath,
    Nombre: `${lead.firstName} ${lead.lastName}`,
    Correo: lead.email,
    Telefono: lead.phone,
    Fecha: receivedAt,
    Mensaje: lead.message
  };

  if (lead.hiddenFields) {
    Object.entries(lead.hiddenFields).forEach(([key, value]) => {
      detailFields[normalizeHiddenFieldLabel(key)] = value;
    });
  }

  const text = `Nuevo lead recibido desde ${lead.originPath}\n\n${formatKeyValueText(detailFields)}`;
  const html = wrapEmailHtml(
    `Nuevo lead desde ${lead.originPath}`,
    `<p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:#475569;">Se recibio un nuevo lead publico y ya se envio confirmacion al contacto.</p>
     <table style="width:100%;border-collapse:collapse;">${formatKeyValueHtml(detailFields)}</table>`
  );

  return {
    subject: lead.source === "quote" ? `Nueva cotizacion solicitada por ${lead.firstName} ${lead.lastName}` : `Nuevo mensaje de contacto de ${lead.firstName} ${lead.lastName}`,
    text,
    html
  };
}

export function buildLeadConfirmationEmail({ lead, receivedAt }: PublicLeadTemplateInput) {
  const text = `Hola ${lead.firstName},\n\nRecibimos tu solicitud desde ${lead.originPath} el ${receivedAt}.\n\nEn breve revisaremos tu informacion y te responderemos con el siguiente paso.\n\nMensaje enviado:\n${lead.message}\n\nEquipo Codenium`;
  const html = wrapEmailHtml(
    `Recibimos tu solicitud, ${lead.firstName}`,
    `<p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:#475569;">Tu solicitud ya quedo registrada. Vamos a revisar el contexto y te responderemos con el siguiente paso.</p>
     <table style="width:100%;border-collapse:collapse;">${formatKeyValueHtml({
       Origen: lead.source,
       Ruta: lead.originPath,
       Fecha: receivedAt,
       Mensaje: lead.message
     })}</table>`
  );

  return {
    subject: lead.source === "quote" ? "Recibimos tu solicitud de cotizacion" : "Recibimos tu mensaje",
    text,
    html
  };
}

function normalizeHiddenFieldLabel(key: string) {
  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
