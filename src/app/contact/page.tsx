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
          {SITE.name}.com is a small, independent project run by one person.
          For bug reports, wrong formulas, new calculator ideas, or anything
          else worth saying, the best place to send feedback is the
          project&apos;s public issue tracker on GitHub.
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
          When reporting a formula issue, please include your printer model,
          slicer (Bambu Studio, PrusaSlicer, OrcaSlicer, etc.), and the
          specific numbers you entered. That makes diagnosis much faster.
        </p>

        <p>
          If you don&apos;t have a GitHub account, signing up is free and
          takes under a minute. Issues are public by default, which is a
          feature, not a bug: other users with the same question can find
          the answer and we avoid the same bug getting reported ten times.
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
