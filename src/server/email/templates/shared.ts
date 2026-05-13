// Plantilla compartida de correos. Usa la paleta de la página (Codenium):
// primario azul #224a78, acento púrpura #4f2f96, gris neutro slate.
// El layout es 100% responsivo en modo claro, basado en tablas y CSS inline
// para máxima compatibilidad con clientes de correo (Gmail, Outlook, Apple
// Mail). Se incluye un bloque <style> con media queries para móvil.

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function formatKeyValueText(fields: Record<string, string>) {
  return Object.entries(fields)
    .filter(([, value]) => value.trim())
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

export function formatKeyValueHtml(fields: Record<string, string>) {
  return Object.entries(fields)
    .filter(([, value]) => value.trim())
    .map(
      ([label, value], idx, arr) =>
        `<tr>
          <td style="padding:12px 16px 12px 0;color:#64748b;font-size:13px;line-height:1.5;vertical-align:top;white-space:nowrap;font-weight:500;${
            idx < arr.length - 1 ? "border-bottom:1px solid #f1f5f9;" : ""
          }">${escapeHtml(label)}</td>
          <td style="padding:12px 0;color:#0f172a;font-size:14px;font-weight:600;line-height:1.5;${
            idx < arr.length - 1 ? "border-bottom:1px solid #f1f5f9;" : ""
          }">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");
}

// Botón CTA principal. Usa el azul primario de la marca por defecto y se
// adapta a táctil (padding cómodo en móvil).
export function buildCtaButton(label: string, href: string, accent: string = "#224a78") {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
      <tr>
        <td style="border-radius:10px;background:${accent};">
          <a href="${escapeHtml(href)}"
             style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:.02em;font-family:'Helvetica Neue',Arial,sans-serif;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>
  `;
}

// Iconos lucide inlineados como SVG. Mantiene la coherencia visual con la
// página (lucide-react). Acepta tamaño y color (currentColor por default).
type LucideIconName =
  | "mail"
  | "calendar"
  | "message-square"
  | "check-circle"
  | "sparkles"
  | "key-round"
  | "package"
  | "file-text"
  | "alert-circle"
  | "send"
  | "user-plus";

const LUCIDE_PATHS: Record<LucideIconName, string> = {
  mail: '<path d="M22 7.99V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.01"/><path d="m22 8-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 8"/>',
  calendar:
    '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  "message-square":
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  "check-circle": '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  sparkles:
    '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
  "key-round":
    '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>',
  package:
    '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  "file-text":
    '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  "alert-circle":
    '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  "user-plus":
    '<path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><line x1="19" x2="19" y1="16" y2="22"/><line x1="22" x2="16" y1="19" y2="19"/>'
};

export function lucideIcon(name: LucideIconName, size: number = 20, color: string = "currentColor") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;display:inline-block;">${LUCIDE_PATHS[name]}</svg>`;
}

// Círculo con icono al estilo de las tarjetas del dashboard. Útil para
// destacar bloques (entregables, reuniones, etc.).
export function buildIconBadge(name: LucideIconName, accent: string = "#224a78") {
  return `
    <span style="display:inline-block;width:44px;height:44px;line-height:44px;text-align:center;border-radius:12px;background:${accent}1a;color:${accent};">
      ${lucideIcon(name, 22, accent)}
    </span>
  `;
}

export function wrapEmailHtml(title: string, body: string, accentColor = "#224a78") {
  const safeTitle = escapeHtml(title);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${safeTitle}</title>
<style>
  /* Reset y defaults seguros para clientes de correo */
  body { margin:0 !important; padding:0 !important; width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
  img { border:0; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  a { color:${accentColor}; }

  /* Responsive */
  @media only screen and (max-width:620px) {
    .email-container { width:100% !important; max-width:100% !important; border-radius:0 !important; }
    .px-pad { padding-left:20px !important; padding-right:20px !important; }
    .py-pad { padding-top:24px !important; padding-bottom:24px !important; }
    .header-pad { padding:28px 20px 20px !important; }
    .footer-pad { padding:20px !important; }
    .h1 { font-size:24px !important; line-height:1.3 !important; }
    .h2 { font-size:18px !important; }
    .cta-btn a { display:block !important; width:100% !important; box-sizing:border-box !important; text-align:center !important; }
    .stack { display:block !important; width:100% !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Helvetica Neue',Arial,sans-serif;color:#0f172a;">
  <!-- Preheader oculto para previsualización -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#f1f5f9;">${safeTitle}</div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f1f5f9;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="600" class="email-container" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,.06);">

          <!-- HEADER: barra superior con la marca -->
          <tr>
            <td class="header-pad" style="background:${accentColor};padding:32px 40px 24px;">
              <p style="margin:0;font-size:11px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.7);">Codenium</p>
              <h1 class="h1" style="margin:10px 0 0;font-size:26px;font-weight:700;line-height:1.3;color:#ffffff;">${safeTitle}</h1>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td class="px-pad py-pad" style="background:#ffffff;padding:32px 40px;">
              ${body}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td class="footer-pad" style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 6px;font-size:12px;color:#64748b;line-height:1.6;">
                © ${new Date().getFullYear()} <strong style="color:#0f172a;">Codenium</strong>. Todos los derechos reservados.
              </p>
              <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
                Si tienes dudas, responde directamente a este mensaje.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
