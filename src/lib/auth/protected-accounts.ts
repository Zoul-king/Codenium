// Cuentas semilla del entorno de pruebas. Se mantienen sincronizadas con
// scripts/reset-test-accounts.ts y NO deben poder eliminarse desde la UI ni
// desde la API: si se borran, los flujos del dashboard pierden su admin/PM/
// cliente de referencia y hay que volver a correr el script de reset.
//
// Para "desproteger" una cuenta, hay que sacarla de esta lista en el código.
export const PROTECTED_EMAILS: ReadonlySet<string> = new Set([
  "gzcm.manuel+admin@gmail.com",
  "gzcm.manuel+pm@gmail.com",
  "gzcm.manuel+cliente@gmail.com"
]);

export function isProtectedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return PROTECTED_EMAILS.has(email.toLowerCase());
}
