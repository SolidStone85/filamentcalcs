import type { ReactNode } from "react";

import { AuthorBio } from "@/components/shared/AuthorBio";
import { AuthorByline } from "@/components/shared/AuthorByline";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { RelatedContent } from "@/components/shared/RelatedContent";
import type { BeginnerGuide as BeginnerGuideData } from "@/lib/beginnerGuides";
import { AUTHOR_JSONLD } from "@/lib/author";
import { SITE } from "@/lib/tools";

export type BeginnerGuideProps = {
  guide: BeginnerGuideData;
  children: ReactNode;
  /** Optional article art rendered between the title and the text. */
  hero?: ReactNode;
  /** Optional compact process animation or diagram rendered before the text. */
  process?: ReactNode;
};

export function BeginnerGuide({ guide, children, hero, process }: BeginnerGuideProps) {
  const pageUrl = `${SITE.url}/guides/${guide.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        datePublished: guide.publishedAt,
        dateModified: guide.updatedAt ?? guide.publishedAt,
        author: AUTHOR_JSONLD,
        publisher: { "@type": "Organization", name: SITE.name },
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
      },
      {
        "@type": "FAQPage",
        mainEntity: guide.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Guide <span aria-hidden="true">|</span> {guide.readMinutes} min read
        </p>
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
          <Highlight3D>{guide.title}</Highlight3D>
        </h1>
        <AuthorByline updatedLabel="Published November 6, 2026 (UTC)" />
      </header>

      {hero ? <div className="mt-8">{hero}</div> : null}
      {process ? <div className="mt-8">{process}</div> : null}

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-5 text-sm leading-7">
        {children}
      </div>

      <section
        aria-labelledby="beginner-guide-faq-heading"
        className="mt-10 rounded-lg border bg-muted/20 p-5"
      >
        <h2
          id="beginner-guide-faq-heading"
          className="text-lg font-semibold tracking-tight"
        >
          Frequently asked
        </h2>
        <dl className="mt-5 space-y-5">
          {guide.faq.map((item) => (
            <div key={item.q}>
              <dt className="font-medium">{item.q}</dt>
              <dd className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <RelatedContent pagePath={`/guides/${guide.slug}`} className="my-10" />
      <AuthorBio />
    </article>
  );
}
