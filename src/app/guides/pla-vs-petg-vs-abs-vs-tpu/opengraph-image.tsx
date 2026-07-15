import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";
import { getGuide } from "@/lib/guides";

const guide = getGuide("pla-vs-petg-vs-abs-vs-tpu")!;

export const alt = `${guide.title} on filamentcalcs.com`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgCard({
    eyebrow: `Guide · ${guide.readMinutes} min read`,
    title: guide.title,
    subtitle: guide.description,
  });
}
