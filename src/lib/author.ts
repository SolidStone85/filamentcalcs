// Single source of truth for the site's author identity.
// Used by guide bylines, About page, and JSON-LD across the site so
// Google sees a consistent Person entity (E-E-A-T signal).
//
// IMPORTANT: keep this honest. No fabricated "I print daily" claims.
// FilamentCalcs is a research-backed reference site. The authority is
// in the cross-referencing of sources, not in personal print farm
// experience.

import { SITE } from "./tools";

export const AUTHOR = {
  name: "Matthew Carvalho",
  role: "Founder and researcher",
  // Short blurb used inline in bylines.
  shortBio:
    "Independent researcher behind the FilamentCalcs reference. Cross-references slicer docs, manufacturer specs, EIA data, and published community testing.",
  // Full block used at the bottom of guides and on the About page.
  fullBio:
    "Matthew Carvalho built FilamentCalcs as an independent reference for the math behind hobbyist 3D printing. Every calculator and guide is built from cross-referenced sources: slicer documentation (Bambu Studio, PrusaSlicer, OrcaSlicer), manufacturer specifications, US EIA residential electricity rate data, and published community testing series including CNC Kitchen's tensile and impact comparisons. The site accepts no affiliate revenue, sponsorships, or paid product reviews. Corrections are read and incorporated into the quarterly review cycle.",
  url: `${SITE.url}/about`,
  // Profile URLs for sameAs JSON-LD. Add real ones as they exist.
  sameAs: [] as string[],
} as const;

// Reusable Person schema for JSON-LD blocks.
export const AUTHOR_JSONLD = {
  "@type": "Person" as const,
  name: AUTHOR.name,
  url: AUTHOR.url,
  jobTitle: AUTHOR.role,
  description: AUTHOR.shortBio,
  ...(AUTHOR.sameAs.length > 0 ? { sameAs: AUTHOR.sameAs } : {}),
};

// Reusable Organization schema with founder pointing to the author.
export const ORGANIZATION_JSONLD = {
  "@type": "Organization" as const,
  name: `${SITE.name}.com`,
  url: SITE.url,
  founder: AUTHOR_JSONLD,
  description: SITE.description,
};
