import type { Metadata } from "next";

import { SITE } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Terms of service",
  description: `Terms of service for ${SITE.name}.com.`,
  alternates: { canonical: `${SITE.url}/terms` },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-xs text-muted-foreground">
        Last updated: April 23, 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-muted-foreground">
        <section className="space-y-2">
          <h2 className="text-lg font-medium text-foreground">Use of the site</h2>
          <p>
            {SITE.name}.com is provided free of charge for personal and
            commercial use. You may link to it, embed results in forum
            posts, and use calculator output in your own pricing or
            estimates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium text-foreground">No warranty</h2>
          <p>
            Calculators on this site produce estimates based on typical
            values and user-provided inputs. They are not a substitute for
            your slicer&apos;s output, your actual electric bill, or
            professional engineering advice. Print time in particular varies
            significantly with model geometry, layer height, and printer
            calibration. The print time calculator is a rough guide only.
          </p>
          <p>
            All tools are provided &quot;as is&quot; without warranty of any
            kind. {SITE.name}.com is not liable for failed prints, wasted
            filament, unexpected electric bills, or other losses arising from
            reliance on the calculators.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium text-foreground">Not affiliated</h2>
          <p>
            {SITE.name}.com is independently run. It is not affiliated with,
            endorsed by, or sponsored by Bambu Lab, Prusa Research, Creality,
            or any other printer or filament manufacturer mentioned on the
            site. Brand names and product names are trademarks of their
            respective owners and are used only for descriptive purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium text-foreground">Changes</h2>
          <p>
            These terms may be updated from time to time. The &quot;Last
            updated&quot; date at the top reflects the most recent revision.
          </p>
        </section>
      </div>
    </div>
  );
}
