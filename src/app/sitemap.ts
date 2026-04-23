import type { MetadataRoute } from "next";

import { GUIDES } from "@/lib/guides";
import { SITE, TOOLS } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ["", "/about", "/guides", "/privacy", "/terms", "/contact"];

  return [
    ...staticRoutes.map((path) => ({
      url: `${SITE.url}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.5,
    })),
    ...TOOLS.filter((t) => t.available).map((tool) => ({
      url: `${SITE.url}/tools/${tool.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...GUIDES.map((guide) => ({
      url: `${SITE.url}/guides/${guide.slug}`,
      lastModified: new Date(guide.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
