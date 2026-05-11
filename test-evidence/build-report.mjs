import fs from "node:fs";

const data = JSON.parse(fs.readFileSync(new URL("./results.json", import.meta.url), "utf8"));

const rows = [];
for (const file of data.testResults) {
  const fileName = file.name.replace(/.*[\\/]/, "");
  for (const t of file.assertionResults) {
    rows.push({
      file: fileName,
      suite: (t.ancestorTitles || []).join(" › "),
      title: t.title,
      status: t.status,
      duration: t.duration ?? 0
    });
  }
}

const total = data.numTotalTests;
const passed = data.numPassedTests;
const failed = data.numFailedTests;
const startISO = new Date(data.startTime).toISOString();
const elapsedMs = (data.testResults || []).reduce((s, f) => s + ((f.endTime ?? 0) - (f.startTime ?? 0)), 0);

const tableRows = rows.map((r) => `
  <tr>
    <td><code>${r.file}</code></td>
    <td>${r.suite}</td>
    <td>${r.title}</td>
    <td class="status ${r.status}">${r.status === "passed" ? "✓ PASS" : "✗ FAIL"}</td>
    <td class="num">${r.duration} ms</td>
  </tr>`).join("");

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"/>
<title>Evidencia de pruebas unitarias — Codenium</title>
<style>
  :root{color-scheme:dark}
  body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#0b0d10;color:#e6e7ea;margin:0;padding:32px}
  h1{margin:0 0 4px;font-size:22px}
  .sub{color:#9aa0a6;margin-bottom:24px;font-size:13px}
  .cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:24px}
  .card{background:#13171c;border:1px solid #232932;border-radius:10px;padding:14px}
  .card .k{font-size:12px;color:#9aa0a6;text-transform:uppercase;letter-spacing:.05em}
  .card .v{font-size:24px;font-weight:600;margin-top:4px}
  .ok{color:#3ddc84}.bad{color:#ff6b6b}
  table{width:100%;border-collapse:collapse;background:#13171c;border:1px solid #232932;border-radius:10px;overflow:hidden;font-size:13px}
  th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #1c2128;vertical-align:top}
  th{background:#171c22;color:#9aa0a6;font-weight:500;font-size:11px;text-transform:uppercase;letter-spacing:.05em}
  tr:last-child td{border-bottom:none}
  td.num{text-align:right;color:#9aa0a6;font-variant-numeric:tabular-nums}
  td.status.passed{color:#3ddc84;font-weight:600}
  td.status.failed{color:#ff6b6b;font-weight:600}
  code{background:#1c2128;padding:2px 6px;border-radius:4px;font-size:12px}
  footer{margin-top:24px;color:#6c7280;font-size:11px}
</style></head><body>
<h1>Evidencia de pruebas unitarias — Codenium</h1>
<div class="sub">Framework: Vitest v4.1.5 · Reporter: JSON + JUnit + verbose · Generado ${new Date().toISOString()}</div>

<div class="cards">
  <div class="card"><div class="k">Archivos de prueba</div><div class="v">${data.testResults.length}</div></div>
  <div class="card"><div class="k">Total de pruebas</div><div class="v">${total}</div></div>
  <div class="card"><div class="k">Pasaron</div><div class="v ok">${passed}</div></div>
  <div class="card"><div class="k">Fallaron</div><div class="v ${failed?'bad':'ok'}">${failed}</div></div>
</div>

<table>
  <thead><tr><th>Archivo</th><th>Suite</th><th>Caso de prueba</th><th>Resultado</th><th>Tiempo</th></tr></thead>
  <tbody>${tableRows}</tbody>
</table>

<footer>
  Inicio: ${startISO} · Duración acumulada de archivos: ${elapsedMs} ms ·
  Comando: <code>npx vitest run --reporter=verbose --reporter=json --reporter=junit</code> ·
  Estado global: <strong class="${data.success?'ok':'bad'}">${data.success?'SUCCESS':'FAILURE'}</strong>
</footer>
</body></html>`;

fs.writeFileSync(new URL("./report.html", import.meta.url), html);
console.log("report.html escrito (", rows.length, "filas )");
