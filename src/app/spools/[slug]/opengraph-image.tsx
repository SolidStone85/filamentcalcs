import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";
import { SPOOL_BRAND_PAGES, getSpoolBrandPage } from "@/lib/spoolBrands";

export function generateStaticParams() {
  return SPOOL_BRAND_PAGES.map((p) => ({ slug: p.slug }));
}

export const alt = "Empty spool weight on filamentcalcs.com";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getSpoolBrandPage(slug);
  return renderOgCard({
    eyebrow: "Empty spool weight",
    title: page ? `${page.brand} empty spool weight` : "Empty spool weights",
    subtitle: page
      ? "Community-measured tare weights plus a calculator for grams remaining."
      : undefined,
  });
}
