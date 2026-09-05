// Will the filament left on a spool cover the next print? Pure math.
//
// needed = print_grams × (1 + waste%) + purge_grams
// spare  = remaining - needed
//
// The verdict bands leave headroom on purpose. Slicer weight estimates
// drift a few percent, and the last meters on a spool are the most
// likely to be kinked, tangled, or damp.

export type EnoughFilamentInput = {
  remainingGrams: number;
  printGrams: number;
  wastePercent: number; // extra material not already in printGrams
  purgeGrams: number; // multi-color purge; 0 for single color
};

export type EnoughFilamentVerdict = "plenty" | "close" | "short";

export type EnoughFilamentResult = {
  neededGrams: number;
  spareGrams: number; // negative when short
  marginGrams: number; // headroom threshold used for the verdict
  verdict: EnoughFilamentVerdict;
  verdictLabel: string;
  recommendation: string;
};

export function calculateEnoughFilament({
  remainingGrams,
  printGrams,
  wastePercent,
  purgeGrams,
}: EnoughFilamentInput): EnoughFilamentResult {
  const neededGrams = printGrams * (1 + wastePercent / 100) + purgeGrams;
  const spareGrams = remainingGrams - neededGrams;

  // Headroom: 8% of the job or 10 g, whichever is bigger. Below that,
  // estimate differences can eat the whole margin. This is a planning rule.
  const marginGrams = Math.max(10, neededGrams * 0.08);

  let verdict: EnoughFilamentVerdict;
  let verdictLabel: string;
  let recommendation: string;

  if (spareGrams < 0) {
    verdict = "short";
    verdictLabel = "Not enough";
    recommendation =
      "Do not start this on the current spool alone. Split the job across two plates, drop the infill, scale the model down, or set up a runout swap to a second spool.";
  } else if (spareGrams < marginGrams) {
    verdict = "close";
    verdictLabel = "Cutting it close";
    recommendation =
      "The entered amounts fit, but the spare material is below this tool's planning margin. Check the tare and sliced total, or allow for a runout swap.";
  } else {
    verdict = "plenty";
    verdictLabel = "Yes, it fits";
    recommendation =
      "Your estimated spare material exceeds this tool's planning margin. Check the spool tare and sliced total before printing; this estimate cannot guarantee against runout.";
  }

  return {
    neededGrams,
    spareGrams,
    marginGrams,
    verdict,
    verdictLabel,
    recommendation,
  };
}

// Worked example used on the page:
//   320 g left, 260 g print, 5% waste, no purge
//   needed = 260 × 1.05 = 273 g → spare = 47 g, margin = 21.8 g → plenty
