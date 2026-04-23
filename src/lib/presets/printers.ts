// Printer class presets. Throughput and wattage vary significantly with
// print settings, model geometry, and calibration. These values are
// community-consensus typical numbers, good enough for "am I buying the
// right printer" and "how much does a print cost" questions. Do not
// treat as specs.

export type PrinterPreset = {
  id: string;
  label: string;
  throughputGramsPerHour: number; // typical flow rate for default settings
  wattsAverage: number; // steady-state draw during printing
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
