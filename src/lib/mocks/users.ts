import type { UserRecord } from "@/lib/types/domain";

export const mockUsers: UserRecord[] = [
  // ── CLIENTES ──────────────────────────────────────────────────────────────
  {
    id: "user-client-1",
    createdAt: "2026-01-14",
    firstName: "Valeria",
    lastName: "Ríos",
    name: "Valeria Ríos",
    email: "valeria@valeriacapital.mx",
    phone: "+52 55 2100 4500",
    company: "Valeria Capital",
    role: "client",
    title: "Directora de Operaciones",
    activeProjects: 2,
    state: "active"
  },
  {
    id: "user-client-2",
    createdAt: "2026-01-28",
    firstName: "Daniel",
    lastName: "Ortega",
    name: "Daniel Ortega",
    email: "daniel@nutritionlab.mx",
    phone: "+52 55 3301 2008",
    company: "Nutrition Lab",
    role: "client",
    title: "Director Comercial",
    activeProjects: 2,
    state: "active"
  },
  {
    id: "user-client-3",
    createdAt: "2026-02-05",
    firstName: "Laura",
    lastName: "Medina",
    name: "Laura Medina",
    email: "laura@aurumtage.com",
    phone: "+52 55 1887 4120",
    company: "Aurumtage",
    role: "client",
    title: "CEO & Fundadora",
    activeProjects: 1,
    state: "active"
  },
  {
    id: "user-client-4",
    createdAt: "2026-02-17",
    firstName: "Rodrigo",
    lastName: "Fuentes",
    name: "Rodrigo Fuentes",
    email: "rfuentes@fuentesarquitectos.com",
    phone: "+52 55 4422 8833",
    company: "Fuentes Arquitectos",
    role: "client",
    title: "Socio Director",
    activeProjects: 1,
    state: "active"
  },
  {
    id: "user-client-5",
    createdAt: "2026-02-25",
    firstName: "Sofía",
    lastName: "Castro",
    name: "Sofía Castro",
    email: "sofia@bloomstudio.mx",
    phone: "+52 55 7788 3344",
    company: "Bloom Studio",
    role: "client",
    title: "Directora Creativa",
    activeProjects: 2,
    state: "active"
  },
  {
    id: "user-client-6",
    createdAt: "2026-03-03",
    firstName: "Fernando",
    lastName: "Alcántara",
    name: "Fernando Alcántara",
    email: "f.alcantara@alcantaralogistica.com",
    phone: "+52 55 9900 1122",
    company: "Alcántara Logística",
    role: "client",
    title: "Gerente General",
    activeProjects: 1,
    state: "active"
  },
  {
    id: "user-client-7",
    createdAt: "2026-03-10",
    firstName: "Isabela",
    lastName: "Montoya",
    name: "Isabela Montoya",
    email: "imontoya@montoyaasociados.mx",
    phone: "+52 55 6655 4433",
    company: "Montoya & Asociados",
    role: "client",
    title: "Coordinadora de Proyectos",
    activeProjects: 1,
    state: "active"
  },
  {
    id: "user-client-8",
    createdAt: "2025-11-20",
    firstName: "Eduardo",
    lastName: "Pereira",
    name: "Eduardo Pereira",
    email: "epereira@techubmx.io",
    phone: "+52 55 3322 7766",
    company: "TecHub MX",
    role: "client",
    title: "CTO",
    activeProjects: 0,
    state: "inactive"
  },

  // ── PROJECT MANAGERS ──────────────────────────────────────────────────────
  {
    id: "user-pm-1",
    createdAt: "2026-01-06",
    firstName: "Miguel",
    lastName: "Santos",
    name: "Miguel Santos",
    email: "msantos@codenium.com",
    phone: "+52 55 3344 1188",
    role: "pm",
    title: "Project Manager Senior",
    activeProjects: 4,
    state: "active"
  },
  {
    id: "user-pm-2",
    createdAt: "2026-01-06",
    firstName: "Andrea",
    lastName: "Ruiz",
    name: "Andrea Ruiz",
    email: "aruiz@codenium.com",
    phone: "+52 55 1199 7744",
    role: "pm",
    title: "Project Manager",
    activeProjects: 3,
    state: "active"
  },
  {
    id: "user-pm-3",
    createdAt: "2026-02-10",
    firstName: "Carlos",
    lastName: "Méndez",
    name: "Carlos Méndez",
    email: "cmendez@codenium.com",
    phone: "+52 55 8877 5566",
    role: "pm",
    title: "Project Manager",
    activeProjects: 3,
    state: "active"
  },

  // ── ADMIN ─────────────────────────────────────────────────────────────────
  {
    id: "user-admin-1",
    createdAt: "2025-10-01",
    firstName: "Equipo",
    lastName: "Dirección",
    name: "Equipo Dirección",
    email: "admin@codenium.com",
    phone: "+52 55 1111 0000",
    role: "admin",
    title: "Administración general",
    activeProjects: 10,
    state: "active"
  }
];
