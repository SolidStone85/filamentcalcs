// Empty spool weight presets shared by the Remaining Spool calculator and
// the per-brand landing pages. Figures are community-measured consensus
// (cross-checked against brand forums and the crowdsourced spool-weight
// databases, 2026-07); spools vary a few grams batch to batch, so every
// surface that shows these numbers should say "weigh yours once."

export type SpoolPreset = {
  id: string;
  label: string;
  emptyWeightGrams: number;
};

export const SPOOL_PRESETS: SpoolPreset[] = [
  // Bambu reusable spool (~208 g bare, new light-grey) + refill cardboard
  // core (~25 g): 233 g is what the scale sees with a refill mounted.
  { id: "bambu-refill", label: "Bambu reusable spool + refill core", emptyWeightGrams: 233 },
  { id: "bambu-cardboard", label: "Bambu cardboard spool", emptyWeightGrams: 205 },
  // Polymaker moved its standard lines (PolyLite, PolyTerra, PolyMax) to a
  // cardboard spool; the official 1 kg cardboard spool is 140 +/- 7 g. The
  // heavier 215 g plastic spool is older/legacy stock, kept as its own entry.
  { id: "polymaker", label: "Polymaker cardboard spool", emptyWeightGrams: 140 },
  { id: "polymaker-plastic", label: "Polymaker plastic spool (older)", emptyWeightGrams: 215 },
  { id: "esun", label: "eSun spool (typical)", emptyWeightGrams: 200 },
  // Community measurements cluster 192-207 g; 230 g (shipped before
  // 2026-07) overstated the tare and understated remaining filament.
  { id: "prusament", label: "Prusament spool", emptyWeightGrams: 200 },
  { id: "standard-plastic", label: "Generic plastic spool", emptyWeightGrams: 220 },
  { id: "custom", label: "Custom (enter weight)", emptyWeightGrams: 200 },
];

export function getSpoolPreset(id: string): SpoolPreset {
  return (
    SPOOL_PRESETS.find((p) => p.id === id) ??
    SPOOL_PRESETS.find((p) => p.id === "standard-plastic")!
  );
}
