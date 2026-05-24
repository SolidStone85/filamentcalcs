// Single source of truth for the site's editorial identity.
// Used by guide bylines, About page, and JSON-LD across the site.
//
// Approach: corporate / organizational identity, not a personal byline.
// Matches what large calculator sites do (calculator.net, rapidtables.com,
// unitconverters.net) and keeps personal information out of the public
// AdSense submission. Authority comes from cited sources + transparent
// methodology, not from a real-name byline.

import { SITE } from "./tools";

export const AUTHOR = {
  // Display name used in bylines and bio blocks.
  name: `${SITE.name}.com editorial team`,
  // Block used at the bottom of guides and on the About page. Talks about
  // the site, not a person.
  fullBio:
    "FilamentCalcs is an independent reference for the math behind hobbyist 3D printing. Every calculator and guide is built from cross-referenced sources: slicer documentation (Bambu Studio, PrusaSlicer, OrcaSlicer), manufacturer specifications, US EIA residential electricity rate data, Eurostat European household rates, and published community testing series including CNC Kitchen's tensile and impact comparisons. The site accepts no affiliate revenue, sponsorships, or paid product reviews. Reader corrections are read and incorporated into the quarterly review cycle.",
} as const;

// Article author = Organization (no real Person). Same pattern used by
// most well-established calculator sites with AdSense approval.
export const AUTHOR_JSONLD = {
  "@type": "Organization" as const,
  name: `${SITE.name}.com`,
  url: SITE.url,
};

// Site-level Organization schema for homepage and About page.
export const ORGANIZATION_JSONLD = {
  "@type": "Organization" as const,
  name: `${SITE.name}.com`,
  url: SITE.url,
  description: SITE.description,
};
