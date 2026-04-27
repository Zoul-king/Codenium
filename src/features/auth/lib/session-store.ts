import type { MockSession } from "@/lib/types/domain";

const SESSION_KEY = "codenium.mock-session";

// Caché client-side de la sesión para evitar parpadeos en la UI.
// La fuente de verdad es la cookie httpOnly del servidor + /api/auth/me.
export function readSession(): MockSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as MockSession;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function writeSession(session: MockSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearLocalSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}

// Cierra la sesión en el servidor (invalida la cookie + tabla Session) y limpia
// la caché local. Llamar siempre a esta función al cerrar sesión.
export async function logout() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    // Si falla la red igual limpiamos el cache local; el servidor caducará
    // la sesión por TTL.
  } finally {
    clearLocalSession();
  }
}
