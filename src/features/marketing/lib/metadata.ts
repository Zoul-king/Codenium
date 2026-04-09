import type { Metadata } from "next";

import type { MarketingPageData } from "@/features/marketing/types";

export function createMetadata(page: MarketingPageData): Metadata {
  return {
    title: page.meta.title,
    description: page.meta.description
  };
}
