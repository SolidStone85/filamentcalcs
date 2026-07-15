import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";

export const alt = "3D printing guides on filamentcalcs.com";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgCard({
    title: "Practical 3D printing guides",
    subtitle:
      "Cost breakdowns, filament choice, failure fixes, and what each setting actually does.",
  });
}
