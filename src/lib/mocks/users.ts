import type { UserRecord } from "@/lib/types/domain";

// Replace these mocks with a Prisma-backed user repository in the next backend phase.
export const mockUsers: UserRecord[] = [
  {
    id: "user-client-1",
    firstName: "Valeria",
    lastName: "Ríos",
    name: "Valeria Ríos",
    email: "client@codenium.com",
    phone: "+52 55 2100 4500",
    company: "Codenium Client",
    role: "client",
    title: "Dirección de producto",
    activeProjects: 3
  },
  {
    id: "user-pm-1",
    firstName: "Miguel",
    lastName: "Santos",
    name: "Miguel Santos",
    email: "pm@codenium.com",
    phone: "+52 55 3344 1188",
    role: "pm",
    title: "Project Manager",
    activeProjects: 2
  },
  {
    id: "user-pm-2",
    firstName: "Andrea",
    lastName: "Ruiz",
    name: "Andrea Ruiz",
    email: "andrea.pm@codenium.com",
    phone: "+52 55 1199 7744",
    role: "pm",
    title: "Project Manager",
    activeProjects: 1
  },
  {
    id: "user-admin-1",
    firstName: "Equipo",
    lastName: "Dirección",
    name: "Equipo Dirección",
    email: "admin@codenium.com",
    phone: "+52 55 1111 0000",
    role: "admin",
    title: "Administración general",
    activeProjects: 3
  }
];
