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
    "FilamentCalcs is an independent, research-based reference for hobbyist 3D printing. We explain assumptions and link manufacturer or slicer sources where used. We do not claim hands-on testing of the printers in our guides. Some pages include relevant Amazon affiliate links. Please report an error with the page and the details needed to check it.",
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
