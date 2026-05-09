import { describe, it, expect } from "vitest";

import {
  escapeHtml,
  formatKeyValueText,
  formatKeyValueHtml,
  buildCtaButton,
  wrapEmailHtml
} from "@/server/email/templates/shared";

describe("escapeHtml", () => {
  it("escapa &, <, >, comillas y apóstrofes", () => {
    expect(escapeHtml(`<a href="x">'y'&z</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&#39;y&#39;&amp;z&lt;/a&gt;"
    );
  });
});

describe("formatKeyValueText", () => {
  it("ignora valores vacíos", () => {
    const out = formatKeyValueText({ Nombre: "Daniel", Empresa: "  ", Correo: "d@x.com" });
    expect(out).toBe("Nombre: Daniel\nCorreo: d@x.com");
  });
});

describe("formatKeyValueHtml", () => {
  it("genera filas <tr> sólo para valores con contenido", () => {
    const out = formatKeyValueHtml({ Nombre: "Daniel", Empresa: "" });
    expect(out).toContain("Nombre");
    expect(out).toContain("Daniel");
    expect(out).not.toContain("Empresa");
  });
});

describe("buildCtaButton", () => {
  it("incluye href escapado y label", () => {
    const out = buildCtaButton("Ir al dashboard", "https://codenium.test/x?y=1&z=2");
    expect(out).toContain("Ir al dashboard");
    expect(out).toContain("https://codenium.test/x?y=1&amp;z=2");
  });
});

describe("wrapEmailHtml", () => {
  it("incluye el título escapado y el branding Codenium", () => {
    const out = wrapEmailHtml("Bienvenido al equipo", "<p>hola</p>");
    expect(out).toContain("Bienvenido al equipo");
    expect(out).toContain("Codenium");
    expect(out).toContain("<p>hola</p>");
  });

  it("acepta color de acento personalizado", () => {
    const out = wrapEmailHtml("Aviso", "x", "#ff0000");
    expect(out).toContain("background:#ff0000");
  });
});
