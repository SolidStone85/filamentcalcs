// Default filament prices and waste factors for common materials.
// Prices are US/CAD street averages as of April 2026. Waste factor
// accounts for purges, skirts, failed first layers, and per-material
// failure rates.

export type MaterialPreset = {
  id: "custom" | "pla" | "petg" | "abs" | "tpu";
  label: string;
  pricePerKg: number; // USD
  wasteFactor: number; // decimal
};

export const MATERIAL_PRESETS: MaterialPreset[] = [
  { id: "pla", label: "PLA", pricePerKg: 20, wasteFactor: 0.05 },
  { id: "petg", label: "PETG", pricePerKg: 25, wasteFactor: 0.07 },
  { id: "abs", label: "ABS / ASA", pricePerKg: 22, wasteFactor: 0.1 },
  { id: "tpu", label: "TPU (flexible)", pricePerKg: 30, wasteFactor: 0.08 },
  { id: "custom", label: "Custom", pricePerKg: 20, wasteFactor: 0.05 },
];

export function getMaterialPreset(id: string): MaterialPreset | undefined {
  return MATERIAL_PRESETS.find((m) => m.id === id);
}
