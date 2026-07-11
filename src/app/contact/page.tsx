import type { Metadata } from "next";

import { SITE } from "@/lib/tools";

// Contact goes through GitHub Issues. No email inbox to manage, feedback
// is public and threaded, and the site owner already gets GitHub
// notifications so nothing extra to check.
const GITHUB_ISSUES_URL =
  "https://github.com/SolidStone85/filamentcalcs/issues/new";
const GITHUB_REPO_URL = "https://github.com/SolidStone85/filamentcalcs";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE.name}.com.`,
  alternates: { canonical: `${SITE.url}/contact` },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
        <p>
          {SITE.name}.com is an independent utility site. For bug reports,
          wrong formulas, new calculator ideas, or anything else worth
          saying, you have two options.
        </p>

        <h2 className="pt-2 text-base font-semibold">
          Option 1: Email
        </h2>
        <p>
          Send to{" "}
          <a
            href="mailto:contact@filamentcalcs.com"
            className="font-medium text-foreground underline underline-offset-4"
          >
            contact@filamentcalcs.com
          </a>
          . This inbox is checked periodically (not daily) for formula
          corrections, bug reports, and calculator suggestions.
        </p>
        <p className="text-xs">
          When reporting a formula issue, please include your printer model,
          slicer (Bambu Studio, PrusaSlicer, OrcaSlicer, etc.), and the
          specific numbers you entered. That makes diagnosis much faster.
        </p>

        <h2 className="pt-4 text-base font-semibold">
          Option 2: Public GitHub issue
        </h2>
        <p>
          For bug reports you want others to be able to see and reference,
          open a public issue:
        </p>
        <p>
          <a
            href={GITHUB_ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Open a GitHub issue
          </a>
        </p>
        <p>
          Issues are public by default. Other users with the same question
          can find the answer, and the same bug doesn&apos;t get reported
          ten times.
        </p>

        <p className="pt-4 text-xs">
          Source code lives at{" "}
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            github.com/SolidStone85/filamentcalcs
          </a>
          . Pull requests welcome if you want to fix something yourself.
        </p>
      </div>
    </div>
  );
}
