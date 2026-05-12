// El esquema de ChangeRequest no tiene columna milestoneId ni changeType. Para
// no requerir migración, codificamos ambos como marcadores al inicio de la
// descripción: `[m:<milestoneId>][t:<changeType>] description`. Ambos son
// opcionales y se omiten si están vacíos.
const MILESTONE_PREFIX = /^\[m:([^\]]+)\]\s*/;
const TYPE_PREFIX = /^\[t:([^\]]+)\]\s*/;

export const VALID_CHANGE_TYPES = [
  "visual",
  "funcional",
  "contenido",
  "tecnico",
  "bugfix",
  "otro"
] as const;

export type ChangeType = (typeof VALID_CHANGE_TYPES)[number];

export function encodeDescription(
  milestoneId: string | null,
  changeType: ChangeType | null,
  description: string
) {
  let prefix = "";
  if (milestoneId) prefix += `[m:${milestoneId}]`;
  if (changeType) prefix += `[t:${changeType}]`;
  return prefix ? `${prefix} ${description}` : description;
}

export function decodeDescription(raw: string): {
  milestoneId: string | null;
  changeType: ChangeType | null;
  description: string;
} {
  let rest = raw;
  let milestoneId: string | null = null;
  let changeType: ChangeType | null = null;

  for (let i = 0; i < 4; i++) {
    const m = rest.match(MILESTONE_PREFIX);
    if (m) {
      milestoneId = m[1];
      rest = rest.replace(MILESTONE_PREFIX, "");
      continue;
    }
    const t = rest.match(TYPE_PREFIX);
    if (t && (VALID_CHANGE_TYPES as readonly string[]).includes(t[1])) {
      changeType = t[1] as ChangeType;
      rest = rest.replace(TYPE_PREFIX, "");
      continue;
    }
    break;
  }

  return { milestoneId, changeType, description: rest };
}

export function normalizeChangeType(value: unknown): ChangeType | null {
  if (typeof value !== "string") return null;
  const v = value.trim().toLowerCase();
  return (VALID_CHANGE_TYPES as readonly string[]).includes(v) ? (v as ChangeType) : null;
}
