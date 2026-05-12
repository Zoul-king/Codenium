// Encoding ligero para guardar la "fase" (columna del kanban) de cada hito
// dentro de Milestone.description usando un marcador `[p:<fase>]` al inicio.
// Evita una migración de Prisma y es compatible con descripciones existentes.

import type { ProjectStatus } from "@/lib/types/domain";

const PHASE_PREFIX = /^\[p:([^\]]+)\]\s*/;

export const VALID_PHASES: ProjectStatus[] = ["discovery", "design", "build", "qa", "done"];

export function isValidPhase(value: unknown): value is ProjectStatus {
  return typeof value === "string" && (VALID_PHASES as string[]).includes(value);
}

export function encodeMilestoneDescription(phase: ProjectStatus | null, description: string): string {
  if (!phase) return description;
  return `[p:${phase}] ${description}`;
}

export function decodeMilestoneDescription(raw: string | null | undefined): {
  phase: ProjectStatus | null;
  description: string;
} {
  if (!raw) return { phase: null, description: "" };
  const match = raw.match(PHASE_PREFIX);
  if (match && isValidPhase(match[1])) {
    return { phase: match[1] as ProjectStatus, description: raw.replace(PHASE_PREFIX, "") };
  }
  return { phase: null, description: raw };
}
