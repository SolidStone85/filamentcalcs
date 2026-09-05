import type { Metadata } from "next";
import Link from "next/link";

import { SITE } from "@/lib/tools";

const TITLE = "Methodology: calculator formulas, assumptions and sources";
const DESCRIPTION = "The formulas behind filamentcalcs, what the inputs mean, which defaults are estimates, and how to check a result against your own print.";
export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: `${SITE.url}/methodology` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE.url}/methodology`, type: "article" },
};

export default function MethodologyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 lg:py-14">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Methodology</p>
        <h1 className="text-3xl font-semibold tracking-tight">How the calculators work</h1>
        <p className="text-sm text-muted-foreground">Arithmetic and AMS assumptions reviewed September 2026</p>
      </header>
      <div className="mt-8 max-w-none space-y-5 text-sm leading-7">
        <p>The calculations run from the numbers you enter. Correct arithmetic cannot make an uncertain weight, price, power draw or throughput exact. This page separates the formulas from the assumptions so you can replace them with your own measurements.</p>
        <p>Material prices, additional waste percentages, printer throughput, wattage and other editable presets are starting estimates. They are not live quotes, measured population averages or manufacturer guarantees unless a particular value has a source attached. There is no audited community dataset behind the preset collection.</p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight">1. Filament cost</h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">effective_grams = entered_grams × (1 + extra_waste_percent / 100)<br />cost = effective_grams / 1000 × price_per_kg</p>
        <p>The waste percentage adds material relative to the entered weight. For example, 500 g with 5% extra uses 525 g and costs $10.50 at $20/kg. If the entered slicer total already includes all the material you want to charge for, set extra waste to zero. Complete prints per kilogram round down from 1000 / effective_grams; a print using over 1 kg does not fit even once.</p>
        <p>Currency selection formats the amount. It does not convert an entered price or look up an exchange rate. Use one currency throughout. If calculating from a spool price, the spool weight means its net filament content, excluding the empty spool.</p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight">2. Print time</h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">hours = grams / average_throughput_g_per_hour</p>
        <p>This is a rough estimate using average material consumed per hour. It is not a conversion from the printer&apos;s advertised travel speed or maximum volumetric flow. Geometry, acceleration, cooling, layer height, supports and color changes affect actual time. Use your sliced file for a print-specific prediction. Displayed time rounds to the nearest whole minute, with 60 minutes carried into the next hour.</p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight">3. Electricity cost</h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">energy_kWh = average_watts / 1000 × hours<br />cost = energy_kWh × rate_per_kWh</p>
        <p>Use average draw over the period being costed, not the maximum rating on the power supply. A 100 W average for ten hours is 1 kWh; at $0.20/kWh it costs $0.20. A plug-in energy meter and your bill&apos;s applicable rate are better inputs than a regional preset. Fixed account charges are excluded. An annual projection, where used, assumes 52 weeks at the entered weekly hours.</p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight">4. Failure rate</h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">failure_percent = failed / (successful + failed) × 100<br />wasted_grams = failed × average_grams_consumed_per_failure</p>
        <p>Counts must be whole, non-negative numbers. With no recorded attempts there is no observed failure rate. A small sample can move sharply after one failure; the percentage alone does not diagnose the printer or establish reliability.</p>
        <p>The consumed-material estimate needs the amount actually used by an average failed attempt. Entering the full intended model weight assumes every failed attempt consumes a full print. The display ranges below 5%, 5–10%, 10–20% and 20% or more are descriptive buckets, not validated industry benchmarks.</p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight">5. AMS purge and multi-material consumption</h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">discarded = discarded_flush + support + tower + other<br />consumed = useful_model + discarded<br />cost = consumed_g / 1000 × price_per_kg</p>
        <p>The preferred mode adds separate slicer material totals in grams. Each gram belongs in one category: flushing retained in useful infill stays in model material; flushing into discarded supports stays in supports. If the slicer includes purge in its tower total, count it as tower material once. Extra startup or calibration material is included only when entered separately and not already counted.</p>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">custom_average_g = average_mm³ × density_g_per_cm³ / 1000<br />estimated_flush_g = swaps × average_g × baseline_multiplier</p>
        <p>Custom estimates require your own average per transition. At a stated density of 1.24 g/cm³, 400 mm³ is 0.496 g, not 400 g. Forty such transitions consume 19.84 g at multiplier 1. This is an illustrative conversion, not a Bambu or Prusa default. When an average already includes the slicer&apos;s multiplier, use 1 here. No multiplier is applied to final sliced grams.</p>
        <p>For a 100 g model and 35 g of discarded material, discarded share is 35 / 135 = 25.9%. Overhead relative to model weight is 35 / 100 = 35%. Multi-color cost comparisons need a separately sliced single-color version, since both may consume supports and startup material.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li><a href="https://github.com/bambulab/BambuStudio/blob/master/resources/web/flush/WipingDialog.html" className="underline underline-offset-4">Bambu Studio source</a>: transition-volume units and how the display multiplier is applied.</li>
          <li><a href="https://help.prusa3d.com/article/purging-volumes-mmu_125097" className="underline underline-offset-4">Prusa purging volumes guide</a>: ordered color pairs and examples in mm³.</li>
          <li><a href="https://github.com/OrcaSlicer/OrcaSlicer/wiki/multimaterial_settings_flush_options" className="underline underline-offset-4">OrcaSlicer flush options</a>: using infill and supports for purging.</li>
          <li><a href="https://store.bblcdn.com/s7/default/b189de92249a4b9ebed28b8ea1f080f0/Bambu_PLA_Basic_Technical_Data_Sheet.pdf" className="underline underline-offset-4">Bambu PLA Basic datasheet</a>: the example density of 1.24 g/cm³.</li>
        </ul>
        <p>September 2026 correction: unsourced grams-per-swap hardware presets were removed. Their previous multiplication was valid for the stated inputs, but the claimed manufacturer defaults were not established. Legacy links are labeled so you can review their assumptions.</p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight">6. Remaining spool</h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">remaining_g = max(0, loaded_spool_g − empty_spool_g)<br />remaining_percent = remaining_g / original_filament_g × 100</p>
        <p>Weigh the loaded spool and use a matching tare, including any refill core or parts still on the scale. Preset tares are estimates and can differ across spool revisions. A loaded weight below tare is flagged; more than the original filament amount is flagged rather than silently capped. Value remaining is remaining_g / 1000 × price_per_kg.</p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight">7. Enough filament</h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">needed_g = print_g × (1 + extra_waste_percent / 100) + separate_purge_g<br />spare_g = remaining_g − needed_g</p>
        <p>The caution margin is the greater of 10 g or 8% of required material. That is this tool&apos;s editable-input planning rule, not a measured guarantee against runout. If print_g is a complete sliced total, set additional waste and separate purge to zero unless they cover material excluded from that total.</p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight">8. Print pricing</h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">wear = printer_price / lifetime_hours × print_hours<br />production = material + electricity + wear<br />adjusted = production / (1 − failure_percent / 100)<br />price = adjusted × production_markup + labor_hours × labor_rate</p>
        <p>The failure adjustment is an expectation model that assumes independent attempts with a constant failure probability and the same production cost for failed and successful attempts. It is not a guaranteed cost or a universal upper bound. At 10% failure probability, expected attempts per success are 1 / 0.9, approximately 1.111. A 100% failure probability has no finite successful-print estimate.</p>
        <p>Machine lifetime is an allocation assumption, not a prediction of when a printer will break. Labor is added once after production markup. Break-even equals adjusted production plus labor. Profit is suggested price minus break-even; margin is profit divided by suggested price. Thus a 2× production multiplier is not a 100% profit margin. Shipping, taxes, platform fees and other expenses are excluded unless you account for them separately.</p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight">Material comparisons and verification</h2>
        <p>Generic material rows describe broad tendencies. Grades, moisture, print orientation and test methods can change strength and temperature performance substantially. Consult the exact product datasheet; a category comparison is not a test report for your finished part.</p>
        <p>The September 2026 arithmetic review includes regression checks of the eight formula modules, unit conversion, duration rounding and selected boundary cases. These checks verify the calculations against stated inputs. They do not physically validate a printer preset or predict every print.</p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight">Saved inputs and corrections</h2>
        <p>Calculations happen in the browser. Input values are included in the page URL so links can restore them; URLs can be shared or sent with page requests. Optional remembered preferences are stored on this device. See the <Link href="/privacy" className="underline underline-offset-4">privacy notice</Link> for hosting, analytics and browser storage details.</p>
        <p>Corrections should include the tool, the input values, the expected result and the supporting source or measurement. Use the <Link href="/contact" className="underline underline-offset-4">contact page</Link>. Major formula or assumption changes are noted on the affected tool. No fixed response time or review schedule is promised.</p>
      </div>
    </article>
  );
}
