import { describe, it, expect } from "vitest";

import { validateForgotPassword, getDashboardRoute } from "@/features/auth/lib/auth-service";

describe("validateForgotPassword", () => {
  it("rechaza correo vacío", () => {
    expect(validateForgotPassword({ email: "" })).toMatch(/correo/i);
  });

  it("rechaza correo sin arroba", () => {
    expect(validateForgotPassword({ email: "no-tiene-arroba" })).toMatch(/válido/i);
  });

  it("acepta correo válido y devuelve mensaje con el correo", () => {
    const out = validateForgotPassword({ email: "test@codenium.com" });
    expect(typeof out).toBe("string");
    expect(out).toContain("test@codenium.com");
  });
});

describe("getDashboardRoute", () => {
  it("mapea cada rol a la ruta correcta", () => {
    expect(getDashboardRoute("client")).toBe("/dashboard/client");
    expect(getDashboardRoute("pm")).toBe("/dashboard/pm");
    expect(getDashboardRoute("admin")).toBe("/dashboard/admin");
  });
});
