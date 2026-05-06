import type { AuthAccountRecord } from "@/lib/types/domain";

// Las credenciales reales viven en la base de datos (tabla User con bcrypt).
// Este arreglo se conserva solo como referencia para las cuentas de prueba
// activas (Manuel) y por compatibilidad con utilidades legadas que aún lo
// importan; el endpoint /api/auth/login no lo consulta.
export const mockAuthAccounts: AuthAccountRecord[] = [
  {
    userId: "user-cliente-manuel",
    email: "gzcm.manuel+cliente@gmail.com",
    password: "12345678",
    role: "client"
  },
  {
    userId: "user-pm-manuel",
    email: "gzcm.manuel+pm@gmail.com",
    password: "12345678",
    role: "pm"
  },
  {
    userId: "user-admin-manuel",
    email: "gzcm.manuel+admin@gmail.com",
    password: "12345678",
    role: "admin"
  }
];
