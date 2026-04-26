"use client";

import type { PlanProfile } from "@/lib/types/domain";

const STORAGE_KEY = "codenium.plan-profile";

export function readPlanProfilePreference(): PlanProfile {
  if (typeof window === "undefined") {
    return "personal";
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  return raw === "business" ? "business" : "personal";
}

export function writePlanProfilePreference(profile: PlanProfile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, profile);
}
