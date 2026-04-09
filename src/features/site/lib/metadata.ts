import type { Metadata } from "next";

import type { SitePageDefinition } from "@/features/site/types";

export function createPageMetadata(page: SitePageDefinition): Metadata {
  return {
    title: page.title,
    description: page.description
  };
}
