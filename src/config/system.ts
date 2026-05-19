export const system = {
  systemName: "Techina",
  version: "1.0.0",
  authors: [
    "Gabriel A. Ortiz",
    "Miguel Ángel Montes Pérez",
    "Juan Manuel González Camacho"
  ],
  copyright: "© 2026 Techina. Todos los derechos reservados.",
  projectId: "f3a9c2d1-7b4e-4e8a-9c5d-1a2b3c4d5e6f",
  buildDate: "2026-05-19"
} as const;

export type SystemMetadata = typeof system;
