import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { SITE } from "@/lib/tools";
import { Calculator } from "./Calculator";

const TITLE = "3D Print Time Estimator: ballpark hours from filament weight";
const DESCRIPTION = "Estimate print hours from filament weight and an assumed average throughput. Editable starting values, explicit limits and a preference for your actual sliced file.";
export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: `${SITE.url}/tools/print-time-estimator` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE.url}/tools/print-time-estimator`, type: "website" },
};

const FAQ = [
  { q: "How accurate is this compared with a slicer?", a: "This is a rough weight-based estimate. Your slicer uses the model's planned paths and configured speeds, making its estimate preferable for a particular print. Neither a preset here nor a slicer estimate guarantees an exact completion time. Compare sliced and actual times on your own printer." },
  { q: "What does average throughput mean?", a: "It means grams of filament per elapsed print hour for the kind of job being estimated. The printer presets here are illustrative starting assumptions, not verified average performance or manufacturer specifications. Replace the value with a comparable print's consumed grams divided by its elapsed hours when possible." },
  { q: "Why can a print take longer than this estimate?", a: "Weight does not describe the full toolpath. Small features, travel moves, cooling waits, supports and material changes can change elapsed time without a proportional change in material. The average throughput from a different kind of print may be unsuitable." },
  { q: "Is average throughput the same as maximum volumetric flow?", a: "No. Maximum volumetric flow describes an extrusion limit in mm³/s. This calculator uses a whole-print average in g/hour. Converting a peak flow limit by material density alone does not account for non-extruding moves, pauses and speed changes." },
  { q: "How do multi-color changes affect time?", a: "Material changes can add loading, unloading, flushing and travel time. This tool does not simulate that sequence or assume a fixed number of seconds per change. Use the actual multi-color slice for timing, and the AMS purge waste calculator for material consumption and cost." },
];

export default function PrintTimeEstimatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SoftwareApplication", name: "3D Print Time Estimator", applicationCategory: "UtilityApplication", operatingSystem: "Any (web)", url: `${SITE.url}/tools/print-time-estimator`, description: DESCRIPTION, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      { "@type": "FAQPage", mainEntity: FAQ.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
    ],
  };
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mb-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl"><Highlight3D>3D Print Time Estimator</Highlight3D></h1>
        <p className="mt-2 text-muted-foreground">Get a rough duration from filament weight and an assumed average rate. Use the result for early planning, then check the sliced file for your actual model and settings.</p>
      </header>
      <AdSlot slot="top" className="mb-6" />
      <Suspense fallback={<div className="h-[400px]" />}><Calculator /></Suspense>
      <AffiliatePicks pagePath="/tools/print-time-estimator" className="mx-auto mt-8 max-w-3xl" />

      <section className="mx-auto mt-12 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">How this works</h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">hours = filament_grams / average_grams_per_hour</p>
        <p className="text-sm leading-6 text-muted-foreground">An illustrative 240 g print at an assumed average of 30 g/hour takes 8 hours by this formula. At 20 g/hour it takes 12 hours. Those are arithmetic scenarios, not promised times for a particular printer.</p>
        <p className="text-sm leading-6 text-muted-foreground">The calculator&apos;s printer presets are starting estimates. They are not supported by an audited set of comparable print logs, and they do not establish which printer will finish your file fastest. Edit the rate using your own comparable jobs.</p>
        <p className="text-sm leading-6 text-muted-foreground">Time is rounded to the nearest minute for display. That formatting precision does not imply the underlying estimate is accurate to a minute.</p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Choose a rate from a comparable print</h2>
        <ol className="list-decimal pl-5 space-y-2 text-sm leading-6 text-muted-foreground">
          <li>Find a completed job with similar material, detail, layer height, supports and color-change requirements.</li>
          <li>Divide its consumed grams by its elapsed hours. For example, 120 g over 6 hours gives 20 g/hour.</li>
          <li>Enter that average here. Use the same material categories in both weights, including supports and flushing if they were included in the reference.</li>
          <li>Slice the new job and compare its prediction. Keep actual completion records so you can see when a reference rate stops being useful.</li>
        </ol>
        <p className="text-sm leading-6 text-muted-foreground">If the reference time includes heating and calibration, its average also includes that overhead. A different-sized job may allocate that fixed time differently, so the same rate may not transfer well.</p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">How the assumed rate changes the answer</h2>
        <p className="text-sm leading-6 text-muted-foreground">These hypothetical rates all describe the same entered weight of 240 g. They are not printer performance benchmarks.</p>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm leading-6">
            <thead><tr className="border-b bg-muted/50"><th className="px-3 py-2 text-left font-medium">Assumed average</th><th className="px-3 py-2 text-left font-medium">Calculated duration</th></tr></thead>
            <tbody>
              <tr className="border-b"><td className="px-3 py-2">10 g/hour</td><td className="px-3 py-2">24 hours</td></tr>
              <tr className="border-b"><td className="px-3 py-2">20 g/hour</td><td className="px-3 py-2">12 hours</td></tr>
              <tr className="border-b"><td className="px-3 py-2">30 g/hour</td><td className="px-3 py-2">8 hours</td></tr>
              <tr><td className="px-3 py-2">40 g/hour</td><td className="px-3 py-2">6 hours</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">Changing the assumed rate changes time inversely in this formula. That does not mean doubling a printer&apos;s speed setting will halve a real job&apos;s duration.</p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">What a weight-only estimate misses</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm leading-6 text-muted-foreground">
          <li><span className="font-medium text-foreground">Paths and detail.</span> Two models of equal weight can require very different travel and extrusion paths.</li>
          <li><span className="font-medium text-foreground">Layer height, walls and infill.</span> These change the sliced paths and sometimes the weight itself. Compare slices rather than applying a universal time percentage.</li>
          <li><span className="font-medium text-foreground">Supports and small layers.</span> Support geometry and cooling waits affect timing; there is no fixed correction here for either.</li>
          <li><span className="font-medium text-foreground">Startup and interruptions.</span> Heating, calibration, user pauses and recovery procedures may be outside a simple average or a slicer&apos;s reported time.</li>
          <li><span className="font-medium text-foreground">Material changes.</span> Loading, flushing and travel depend on the printer, profile and actual transitions.</li>
        </ul>
        <p className="text-sm leading-6 text-muted-foreground">For multi-color jobs, use the <Link href="/tools/ams-purge-waste-calculator" className="text-primary underline underline-offset-4">AMS purge waste calculator</Link> to account for material. It does not replace the slicer&apos;s timing estimate.</p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Planning around a finish time</h2>
        <p className="text-sm leading-6 text-muted-foreground">Use this tool when you have a weight but no sliced file. Before committing to a deadline, slice with the intended printer, material and settings, then allow for startup, handling and the difference between previous predicted and actual times.</p>
        <p className="text-sm leading-6 text-muted-foreground">Choose a timing allowance from the variation in your own records and the consequence of finishing late. Past timing accuracy still cannot guarantee the next job&apos;s completion time.</p>
      </section>
      <AdSlot slot="inline" className="mx-auto my-10 max-w-3xl" />
      <section className="mx-auto max-w-3xl space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Frequently asked</h2>
        <dl className="space-y-4">{FAQ.map((item) => <div key={item.q} className="space-y-1"><dt className="font-medium text-foreground">{item.q}</dt><dd className="text-sm leading-6 text-muted-foreground">{item.a}</dd></div>)}</dl>
      </section>
      <RelatedContent pagePath="/tools/print-time-estimator" className="mx-auto mt-10 max-w-3xl" />
    </div>
  );
}
