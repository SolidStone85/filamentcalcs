import type { Metadata } from "next";

import { SITE } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `Privacy policy for ${SITE.name}.com.`,
  alternates: { canonical: `${SITE.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-xs text-muted-foreground">
        Last updated: April 23, 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-muted-foreground">
        <section className="space-y-2">
          <h2 className="text-lg font-medium text-foreground">Overview</h2>
          <p>
            {SITE.name}.com is an independent 3D printing calculator site. This
            policy explains what data is collected when you visit, and how
            it&apos;s used.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium text-foreground">
            Data you enter into calculators
          </h2>
          <p>
            All calculations run in your browser. Inputs you type into the
            calculators are never sent to our servers. Inputs are reflected
            in the URL (as query parameters) so you can bookmark or share
            results. That URL lives only in your browser until you choose
            to share it.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium text-foreground">Analytics</h2>
          <p>
            We use Google Analytics 4 to understand which pages are popular
            and how people find the site. Google Analytics uses cookies and
            collects data including your approximate location, device type,
            browser, referrer URL, and pages visited. IP addresses are
            anonymized where required by regional law.
          </p>
          <p>
            You can opt out of Google Analytics by installing the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              Google Analytics Opt-Out Browser Add-on
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium text-foreground">Advertising</h2>
          <p>
            Third-party vendors, including Google, use cookies to serve ads
            based on your prior visits to this site and other sites. Google&apos;s
            use of advertising cookies enables it and its partners to serve
            ads to you based on your visit to our site and/or other sites on
            the internet.
          </p>
          <p>
            You may opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              Google Ads Settings
            </a>
            . You can also opt out of third-party vendors&apos; use of cookies
            for personalized advertising at{" "}
            <a
              href="https://www.aboutads.info"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              aboutads.info
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium text-foreground">Contact</h2>
          <p>
            Questions about this privacy policy can be sent through the{" "}
            <a href="/contact" className="underline underline-offset-4">
              contact page
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
