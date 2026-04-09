import type { UserRecord } from "@/lib/types/domain";

// Replace these mocks with a Prisma-backed user repository in the next backend phase.
export const mockUsers: UserRecord[] = [
  {
    id: "user-client-1",
    firstName: "Paola",
    lastName: "Hernandez",
    name: "Paola Hernandez",
    email: "paola@valhui.mx",
    phone: "+52 55 2100 4500",
    company: "ValHui",
    role: "client",
    title: "Directora comercial",
    activeProjects: 2
  },
  {
    id: "user-pm-1",
    firstName: "Javier",
    lastName: "Cruz",
    name: "Javier Cruz",
    email: "javier@axolotlcode.tech",
    phone: "+52 55 3344 1188",
    role: "pm",
    title: "Project Manager",
    activeProjects: 3
  },
  {
    id: "user-pm-2",
    firstName: "Andrea",
    lastName: "Ruiz",
    name: "Andrea Ruiz",
    email: "andrea@axolotlcode.tech",
    phone: "+52 55 1199 7744",
    role: "pm",
    title: "Project Manager",
    activeProjects: 2
  },
  {
    id: "user-admin-1",
    firstName: "Equipo",
    lastName: "Direccion",
    name: "Equipo Direccion",
    email: "admin@axolotlcode.tech",
    phone: "+52 55 1111 0000",
    role: "admin",
    title: "Administracion general",
    activeProjects: 7
  }
];
