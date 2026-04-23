import type { Metadata } from "next";

import { SITE } from "@/lib/tools";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.name}.com: who runs it, why it exists, and how the calculators work.`,
  alternates: { canonical: `${SITE.url}/about` },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">About {SITE.name}.com</h1>
      <div className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
        <p>
          {SITE.name}.com is a small, independent site focused on practical
          calculators for 3D printing hobbyists. It&apos;s run by a single
          person who prints on a Bambu Lab P1S, got tired of pulling up
          spreadsheets every time a spool ran low, and decided to build the
          calculator they wished existed.
        </p>
        <p>
          Every calculator here runs entirely in your browser. No account is
          required, and no data is sent to a server. URLs include your inputs
          so you can bookmark a result or share it in a Reddit thread or
          Discord channel.
        </p>
        <p>
          Formulas are based on community references (Prusa documentation,
          Bambu Lab wiki, common maker forum threads) plus real-world testing.
          Where estimates have wide error bars, the tool says so. Print time
          is the main example.
        </p>
        <p>
          This site carries Google AdSense to offset hosting costs and time.
          No affiliate links, no sponsored placements, no data collection
          beyond standard Google Analytics.
        </p>
        <p>
          Found a bug, disagree with a formula, or have an idea for a
          calculator? Use the{" "}
          <a href="/contact" className="underline underline-offset-4">
            contact page
          </a>
          .
        </p>
      </div>
    </div>
  );
}
