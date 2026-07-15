import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";
import { TOOLS } from "@/lib/tools";

const tool = TOOLS.find((t) => t.slug === "failure-rate-calculator")!;

export const alt = `${tool.title} on filamentcalcs.com`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgCard({
    eyebrow: "Calculator",
    title: tool.title,
    subtitle: tool.description,
  });
}
