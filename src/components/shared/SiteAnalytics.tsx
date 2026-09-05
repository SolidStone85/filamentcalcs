"use client";

import { Analytics } from "@vercel/analytics/react";

export function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        // Shared calculation URLs contain inputs; page analytics do not need them.
        try {
          const url = new URL(event.url);
          url.search = "";
          url.hash = "";
          return { ...event, url: url.toString() };
        } catch {
          return null;
        }
      }}
    />
  );
}
