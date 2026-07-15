import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";

export const alt = "All 3D printing calculators on filamentcalcs.com";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgCard({
    title: "All 3D printing calculators",
    subtitle:
      "Filament cost, print time, electricity, materials, failure rate, AMS purge waste, and remaining spool.",
  });
}
