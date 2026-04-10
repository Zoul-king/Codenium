import type { UserRecord } from "@/lib/types/domain";

// Replace these mocks with a Prisma-backed user repository in the next backend phase.
export const mockUsers: UserRecord[] = [
  {
    id: "user-client-1",
    createdAt: "2026-03-12",
    firstName: "Valeria",
    lastName: "Ríos",
    name: "Valeria Ríos",
    email: "client@codenium.com",
    phone: "+52 55 2100 4500",
    company: "Valeria Capital",
    role: "client",
    title: "Dirección de producto",
    activeProjects: 1,
    state: "active"
  },
  {
    id: "user-client-2",
    createdAt: "2026-03-20",
    firstName: "Daniel",
    lastName: "Ortega",
    name: "Daniel Ortega",
    email: "daniel@nutrilab.mx",
    phone: "+52 55 3301 2008",
    company: "Nutrition Lab",
    role: "client",
    title: "Coordinación comercial",
    activeProjects: 1,
    state: "active"
  },
  {
    id: "user-client-3",
    createdAt: "2026-04-10",
    firstName: "Laura",
    lastName: "Medina",
    name: "Laura Medina",
    email: "laura@aurumtage.com",
    phone: "+52 55 1887 4120",
    company: "Aurumtage",
    role: "client",
    title: "Dirección operativa",
    activeProjects: 0,
    state: "inactive"
  },
  {
    id: "user-pm-1",
    createdAt: "2026-02-16",
    firstName: "Miguel",
    lastName: "Santos",
    name: "Miguel Santos",
    email: "pm@codenium.com",
    phone: "+52 55 3344 1188",
    role: "pm",
    title: "Project Manager",
    activeProjects: 2,
    state: "active"
  },
  {
    id: "user-pm-2",
    createdAt: "2026-04-10",
    firstName: "Andrea",
    lastName: "Ruiz",
    name: "Andrea Ruiz",
    email: "andrea.pm@codenium.com",
    phone: "+52 55 1199 7744",
    role: "pm",
    title: "Project Manager",
    activeProjects: 1,
    state: "inactive"
  },
  {
    id: "user-admin-1",
    createdAt: "2026-01-04",
    firstName: "Equipo",
    lastName: "Dirección",
    name: "Equipo Dirección",
    email: "admin@codenium.com",
    phone: "+52 55 1111 0000",
    role: "admin",
    title: "Administración general",
    activeProjects: 3,
    state: "active"
  }
];
