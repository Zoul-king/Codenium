import type { UserRecord } from "@/lib/types/domain";

// Fallback mínimo. Los datos reales se cargan desde /api/users.
// Solo se exponen las 3 cuentas de prueba (Manuel) para que el shell del
// dashboard tenga algo que mostrar mientras se hidrata la sesión.
export const mockUsers: UserRecord[] = [
  {
    id: "user-cliente-manuel",
    createdAt: "2026-05-06",
    firstName: "Cliente",
    lastName: "Manuel",
    name: "Cliente Manuel",
    email: "gzcm.manuel+cliente@gmail.com",
    phone: "+52 5575595404",
    role: "client",
    title: "Cuenta cliente",
    activeProjects: 0,
    state: "active"
  },
  {
    id: "user-pm-manuel",
    createdAt: "2026-05-06",
    firstName: "PM",
    lastName: "Manuel",
    name: "PM Manuel",
    email: "gzcm.manuel+pm@gmail.com",
    phone: "+52 5575595404",
    role: "pm",
    title: "Project Manager",
    activeProjects: 0,
    state: "active"
  },
  {
    id: "user-admin-manuel",
    createdAt: "2026-05-06",
    firstName: "Admin",
    lastName: "Manuel",
    name: "Admin Manuel",
    email: "gzcm.manuel+admin@gmail.com",
    phone: "+52 5575595404",
    role: "admin",
    title: "Administración general",
    activeProjects: 0,
    state: "active"
  }
];
