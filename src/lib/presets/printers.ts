// Printer class presets. Throughput and wattage vary significantly with
// print settings, model geometry, and calibration. These values are
// illustrative planning assumptions, not audited performance measurements
// or manufacturer specifications. Use comparable print logs or measured
// whole-job power for a more useful estimate. Preserve IDs for shared URLs.

export type PrinterPreset = {
  id: string;
  label: string;
  throughputGramsPerHour: number; // assumed whole-print average, not peak flow
  wattsAverage: number; // assumed average draw, not a measured model spec
  className: "fast-corexy" | "bedslinger" | "legacy" | "custom";
};

export const PRINTER_PRESETS: PrinterPreset[] = [
  {
    id: "bambu-x1c",
    label: "Bambu X1C / P1S (fast CoreXY)",
    throughputGramsPerHour: 30,
    wattsAverage: 115,
    className: "fast-corexy",
  },
  {
    id: "bambu-a1",
    label: "Bambu A1 / Prusa MK4 (modern bedslinger)",
    throughputGramsPerHour: 22,
    wattsAverage: 95,
    className: "bedslinger",
  },
  {
    id: "ender3-stock",
    label: "Ender 3 / older budget printers",
    throughputGramsPerHour: 10,
    wattsAverage: 125,
    className: "legacy",
  },
  {
    id: "klipper-fast",
    label: "Klipper tuned / custom fast builds",
    throughputGramsPerHour: 40,
    wattsAverage: 140,
    className: "fast-corexy",
  },
  {
    id: "custom",
    label: "Custom",
    throughputGramsPerHour: 20,
    wattsAverage: 100,
    className: "custom",
  },
];

export function getPrinterPreset(id: string): PrinterPreset | undefined {
  return PRINTER_PRESETS.find((p) => p.id === id);
}
