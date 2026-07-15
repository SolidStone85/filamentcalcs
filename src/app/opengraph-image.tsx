import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";
import { SITE } from "@/lib/tools";

export const alt = `${SITE.name}.com: ${SITE.tagline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgCard({
    title: "Practical calculators and guides for 3D printing hobbyists",
    subtitle: SITE.description,
  });
}
