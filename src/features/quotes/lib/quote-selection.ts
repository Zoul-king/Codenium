import type { ReadonlyURLSearchParams } from "next/navigation";

import type { PlanProfile } from "@/lib/types/domain";

const STORAGE_KEY = "codenium.intake-selection";

export type QuoteSelectionSource = "plan" | "service";

export interface QuoteSelection {
  source: QuoteSelectionSource;
  label: string;
  profile?: PlanProfile;
}

export function buildQuoteSelectionHref(selection: QuoteSelection, hash = "quote-form") {
  const params = new URLSearchParams({
    source: selection.source,
    label: selection.label
  });

  if (selection.profile) {
    params.set("profile", selection.profile);
  }

  return `/quote?${params.toString()}#${hash}`;
}

export function buildContactSelectionHref(selection: QuoteSelection, hash = "contact") {
  const params = new URLSearchParams({
    source: selection.source,
    label: selection.label
  });

  return `/contact?${params.toString()}#${hash}`;
}

export function readQuoteSelection(): QuoteSelection | null {
  if (typeof window === "undefined") {
    return null;
  }

  return parseStoredSelection(window.localStorage.getItem(STORAGE_KEY));
}

export function writeQuoteSelection(selection: QuoteSelection) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
}

export function clearQuoteSelection() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function parseQuoteSelectionParams(searchParams: URLSearchParams | ReadonlyURLSearchParams): QuoteSelection | null {
  const source = searchParams.get("source");
  const label = searchParams.get("label");
  const profile = searchParams.get("profile");

  if ((source !== "plan" && source !== "service") || !label) {
    return null;
  }

  return {
    source,
    label,
    profile: profile === "business" ? "business" : profile === "personal" ? "personal" : undefined
  };
}

function parseStoredSelection(raw: string | null): QuoteSelection | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<QuoteSelection>;

    if ((parsed.source === "plan" || parsed.source === "service") && typeof parsed.label === "string" && parsed.label.trim()) {
      return {
        source: parsed.source,
        label: parsed.label,
        profile: parsed.profile === "business" ? "business" : parsed.profile === "personal" ? "personal" : undefined
      };
    }
  } catch {
    return null;
  }

  return null;
}
