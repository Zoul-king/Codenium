import type { UserRecord } from "@/lib/types/domain";

// Replace these mocks with a Prisma-backed user repository in the next backend phase.
export const mockUsers: UserRecord[] = [
  {
    id: "user-client-1",
    name: "Paola Hernandez",
    email: "paola@valhui.mx",
    role: "client",
    title: "Directora comercial",
    activeProjects: 2
  },
  {
    id: "user-pm-1",
    name: "Javier Cruz",
    email: "javier@axolotlcode.tech",
    role: "pm",
    title: "Project Manager",
    activeProjects: 3
  },
  {
    id: "user-pm-2",
    name: "Andrea Ruiz",
    email: "andrea@axolotlcode.tech",
    role: "pm",
    title: "Project Manager",
    activeProjects: 2
  },
  {
    id: "user-admin-1",
    name: "Equipo Direccion",
    email: "admin@axolotlcode.tech",
    role: "admin",
    title: "Administracion general",
    activeProjects: 7
  }
];
