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
      ([label, value]) =>
        `<tr>
          <td style="padding:10px 16px 10px 0;color:#64748b;font-size:13px;vertical-align:top;white-space:nowrap;font-weight:500;">${escapeHtml(label)}</td>
          <td style="padding:10px 0;color:#0f172a;font-size:14px;font-weight:600;border-bottom:1px solid #f1f5f9;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");
}

export function buildCtaButton(label: string, href: string) {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
      <tr>
        <td style="border-radius:8px;background:#4f2f96;">
          <a href="${escapeHtml(href)}"
             style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:.02em;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>
  `;
}

export function wrapEmailHtml(title: string, body: string, accentColor = "#4f2f96") {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" style="max-width:600px;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

          <!-- HEADER -->
          <tr>
            <td style="background:${accentColor};padding:28px 36px 24px;">
              <p style="margin:0;font-size:11px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.65);">Codenium</p>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;line-height:1.3;color:#ffffff;">${escapeHtml(title)}</h1>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background:#ffffff;padding:32px 36px;">
              ${body}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f8fafc;padding:20px 36px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                Este correo fue enviado por <strong style="color:#64748b;">Codenium</strong> · Si tienes dudas responde directamente a este mensaje.
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
