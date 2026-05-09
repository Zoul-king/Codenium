import { dashboardHomeByRole } from "@/lib/config/catalogs";
import type { ForgotPasswordInput, Role } from "@/lib/types/domain";

export function validateForgotPassword(input: ForgotPasswordInput) {
  if (!input.email.trim()) {
    return "Ingresa el correo asociado a tu cuenta.";
  }

  if (!input.email.includes("@")) {
    return "Ingresa un correo válido.";
  }

  return `Listo. Prepararemos instrucciones para ${input.email.trim()}.`;
}

export function getDashboardRoute(role: Role) {
  return dashboardHomeByRole[role];
}
