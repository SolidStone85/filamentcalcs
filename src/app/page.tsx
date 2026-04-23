import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE, TOOLS } from "@/lib/tools";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ----- Hero ----- */}
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">
          Free calculators for{" "}
          <span className="text-3d">3D</span>{" "}
          printing hobbyists
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Material cost, electricity, print time, and more. Fast, mobile-first,
          no sign-up. Built for FDM printer owners: Bambu, Prusa, Ender, and
          Creality.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/tools/filament-cost-calculator"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Try the filament cost calculator
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/guides"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            Read the guides
          </Link>
        </div>
      </section>

      {/* ----- Tools grid ----- */}
      <section className="mt-16">
        <h2 className="mb-6 text-xl font-semibold tracking-tight">
          All calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const content = (
              <Card
                className={`glass-card h-full transition ${
                  tool.available
                    ? "hover:border-primary/60 hover:shadow-md"
                    : "opacity-60"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2 text-base">
                    {tool.shortTitle}
                    {!tool.available && (
                      <span className="rounded bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                        soon
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </CardContent>
              </Card>
            );

            return tool.available ? (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                {content}
              </Link>
            ) : (
              <div key={tool.slug}>{content}</div>
            );
          })}
        </div>
      </section>

      {/* ----- About ----- */}
      <section className="mx-auto mt-16 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Why this site</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          The 3D printing community has decent calculators scattered across
          slicer forums, spreadsheets, and app stores, but nothing focused,
          fast, and mobile-friendly. {SITE.name}.com is a single place for the
          calculations you actually do, usually while standing next to your
          printer with your phone out.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Every calculator runs in your browser. Nothing is saved to a server.
          URLs encode your inputs, so you can bookmark a result or paste it in
          a Reddit reply.
        </p>
      </section>
    </div>
  );
}
