// Empty spool weight presets shared by the Remaining Spool calculator and
// the per-brand landing pages. Brand presets use the middle of the traced
// measurements (or the manufacturer's nominal figure); the evidence and
// sources for each live in lib/spoolBrands.ts, rechecked 2026-10-10.
// Spools vary batch to batch, so every surface that shows these numbers
// should say "weigh yours once."

export type SpoolPreset = {
  id: string;
  label: string;
  emptyWeightGrams: number;
};

export const SPOOL_PRESETS: SpoolPreset[] = [
  // Reusable plastic spool (208-216 g bare) + refill cardboard core
  // (~37 g): five with-core measurements ran 245-260 g. 233 g (shipped
  // before 2026-10) assumed a 25 g core and overstated remaining filament.
  { id: "bambu-refill", label: "Bambu reusable spool + refill core", emptyWeightGrams: 253 },
  // Measured on PPA-CF cardboard spools (195-196 g); was 205 g, untraced.
  { id: "bambu-cardboard", label: "Bambu cardboard spool (PPA-CF)", emptyWeightGrams: 196 },
  // Polymaker's own spool table: 1 kg cardboard spool 140 +/- 7 g.
  { id: "polymaker", label: "Polymaker cardboard spool", emptyWeightGrams: 140 },
  // Older plastic stock; one community database entry (was 215 g, untraced).
  { id: "polymaker-plastic", label: "Polymaker plastic spool (older)", emptyWeightGrams: 250 },
  // Community database figure for current eSun PLA lines on cardboard;
  // eSun plastic spools measure 210-265 g, too wide for one preset.
  { id: "esun", label: "eSun cardboard spool", emptyWeightGrams: 170 },
  // Original black spool with cardboard center: measurements 191-201 g.
  { id: "prusament", label: "Prusament spool (original design)", emptyWeightGrams: 194 },
  // Generic starting point, not a measurement of any particular spool.
  { id: "standard-plastic", label: "Generic plastic spool", emptyWeightGrams: 220 },
  { id: "custom", label: "Custom (enter weight)", emptyWeightGrams: 200 },
];

export function getSpoolPreset(id: string): SpoolPreset {
  return (
    SPOOL_PRESETS.find((p) => p.id === id) ??
    SPOOL_PRESETS.find((p) => p.id === "standard-plastic")!
  );
}
