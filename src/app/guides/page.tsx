import type { Metadata } from "next";

import { SITE } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Guides",
  description: `Practical guides for FDM 3D printing: material choice, cost, reliability, and more.`,
  alternates: { canonical: `${SITE.url}/guides` },
};

export default function GuidesIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Guides</h1>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        Practical write-ups on filament choice, printer cost, reliability, and
        the other questions hobbyists actually ask. New guides are added as
        they&apos;re written. The first batch lands shortly.
      </p>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        In the meantime, the{" "}
        <a
          href="/tools/filament-cost-calculator"
          className="underline underline-offset-4"
        >
          filament cost calculator
        </a>{" "}
        is live.
      </p>
    </div>
  );
}
