import { dashboardHomeByRole, mockAuthAccounts, mockUsers, rolePermissions } from "@/lib/mocks";
import type { ForgotPasswordInput, LoginInput, MockSession, RegisterInput, Role, UserRecord } from "@/lib/types/domain";

function buildSession(user: UserRecord, role: Role): MockSession {
  return {
    userId: user.id,
    role,
    name: user.name,
    email: user.email,
    permissions: rolePermissions[role]
  };
}

export function validateLogin(input: LoginInput) {
  if (!input.email.trim() || !input.password.trim()) {
    return "Completa correo y contraseña.";
  }

  const account = mockAuthAccounts.find((item) => item.email.toLowerCase() === input.email.trim().toLowerCase());

  if (!account || account.password !== input.password) {
    return "Las credenciales mock no coinciden.";
  }

  const user = mockUsers.find((item) => item.id === account.userId);

  if (!user) {
    return "No encontramos un usuario mock asociado a esa cuenta.";
  }

  return buildSession(user, account.role);
}

export function validateRegister(input: RegisterInput) {
  if (
    !input.firstName.trim() ||
    !input.lastName.trim() ||
    !input.email.trim() ||
    !input.phone.trim() ||
    !input.password.trim() ||
    !input.confirmPassword.trim()
  ) {
    return "Completa todos los campos obligatorios.";
  }

  if (!input.email.includes("@")) {
    return "Ingresa un correo válido.";
  }

  if (input.password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }

  if (input.password !== input.confirmPassword) {
    return "Las contraseñas no coinciden.";
  }

  const mockUser: UserRecord = {
    id: "user-client-new",
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    name: `${input.firstName.trim()} ${input.lastName.trim()}`,
    email: input.email.trim(),
    phone: input.phone.trim(),
    company: input.company?.trim() || undefined,
    role: "client",
    title: "Cuenta cliente",
    activeProjects: 0
  };

  return buildSession(mockUser, "client");
}

export function validateForgotPassword(input: ForgotPasswordInput) {
  if (!input.email.trim()) {
    return "Ingresa el correo asociado a tu cuenta.";
  }

  if (!input.email.includes("@")) {
    return "Ingresa un correo válido.";
  }

  return `En una integración real enviaríamos instrucciones de recuperación a ${input.email.trim()}.`;
}

export function getDashboardRoute(role: Role) {
  return dashboardHomeByRole[role];
}
