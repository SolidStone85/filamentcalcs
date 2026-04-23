import type { Metadata } from "next";

import { SITE } from "@/lib/tools";

// v1 uses a mailto: link. A contact form can come later if volume warrants it.
const CONTACT_EMAIL = "hello@filamentcalcs.com";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE.name}.com.`,
  alternates: { canonical: `${SITE.url}/contact` },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <div className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
        <p>
          Found a bug, spotted a wrong formula, or have an idea for a
          calculator? Send an email:
        </p>
        <p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-mono text-base text-foreground underline underline-offset-4"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p>
          Please include your printer model and slicer when reporting a
          formula issue. It makes diagnosis much faster.
        </p>
      </div>
    </div>
  );
}
