import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { BeginnerGuide } from "@/components/shared/BeginnerGuide";
import {
  beginnerGuideMetadata,
  getBeginnerGuide,
} from "@/lib/beginnerGuides";

const SLUG = "useful-3d-prints-save-money";
const guide = getBeginnerGuide(SLUG)!;

export const metadata: Metadata = beginnerGuideMetadata(SLUG);

export default function GuidePage() {
  return (
    <BeginnerGuide
      guide={guide}
      hero={
        <figure>
          <Image
            src="/images/guides/useful-projects.webp"
            alt="Illustration of a 3D printed tray, cable guide and small organizers"
            width={1672}
            height={941}
            priority
            className="h-auto w-full rounded-lg object-cover"
          />
          <figcaption className="mt-2 text-xs text-muted-foreground">
            AI-generated illustration; not a photograph of tested prints or
            products.
          </figcaption>
        </figure>
      }
    >
      <p>
        A 3D printer is particularly useful when a part needs to fit an awkward
        space, match something you already own or replace a simple piece that
        is difficult to buy separately. It is less compelling when an
        inexpensive, durable version is already available down the road.
      </p>
      <p>
        The most useful question is specific: “Can I make this particular
        object well enough, for less than the alternative I would actually
        buy?” That keeps the comparison grounded. Printing an object you would
        never have purchased can be enjoyable, but it has not reduced a planned
        expense.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Start with small frustrations you already have
      </h2>
      <p>
        Look around one drawer, desk or hobby area. Which objects are hard to
        find, fall over or do not fit their storage? Those observations are a
        better project list than a collection of impressive prints with no
        place to go.
      </p>

      <h3 className="pt-2 text-base font-semibold tracking-tight">
        Drawer dividers and fitted trays
      </h3>
      <p>
        A tray shaped around your actual drawer can use space that a standard
        organizer wastes. Start with one compartment and check the dimensions
        before committing to a full set. Measure obstructions such as drawer
        runners, rounded corners and the space needed to lift the tray out.
      </p>
      <p>
        For a small drawer, several shallow modules may be easier to revise than
        one large insert. The value is the fit. If an inexpensive off-the-shelf
        tray already does the job, compare it fairly.
      </p>

      <h3 className="pt-2 text-base font-semibold tracking-tight">
        Cable guides and desk organizers
      </h3>
      <p>
        A guide can keep a charging cable within reach or route a low-voltage
        lead neatly across a desk. Design around the cable&apos;s bend radius and
        connector size, and do not force or sharply pinch it. A printed guide is
        not an electrical repair or a replacement for a cable&apos;s strain
        relief.
      </p>
      <p>
        For a stand or holder, test stability before placing an expensive device
        on it. A heavy base or appropriate non-slip material may matter more
        than how little plastic the model uses.
      </p>

      <h3 className="pt-2 text-base font-semibold tracking-tight">
        Hobby storage made to your tools
      </h3>
      <p>
        A tabletop holder for paint bottles, model-making tools, sewing
        accessories or game components can be sized around a specific
        collection. Print one test opening before filling a bed with a whole
        rack.
      </p>
      <p>
        Check lids, handles and labels as well as the object&apos;s nominal size.
        The part needs to be usable when your hands are full, not just fit in a
        CAD drawing. Do not assume a holder for one brand fits another with a
        similar-looking container.
      </p>

      <h3 className="pt-2 text-base font-semibold tracking-tight">
        Benign replacement caps and knobs
      </h3>
      <p>
        A missing end cap or lightly loaded, non-safety-critical knob may be a
        good project if it keeps a useful object in service. Measure the
        attachment and leave room for a fit test.
      </p>
      <p>
        A replacement knob for a craft-storage drawer is a different
        proposition from one that controls a cooker or safety mechanism. Avoid
        repairs where a printed part could expose electricity, release pressure,
        affect braking or fail under a person&apos;s weight.
      </p>

      <h3 className="pt-2 text-base font-semibold tracking-tight">
        Spacers and layout aids
      </h3>
      <p>
        Simple spacers can help position labels, arrange items or repeat a
        measurement in a craft project. A layout template can be useful even
        when it is not strong enough to act as a structural part.
      </p>
      <p>
        Keep the distinction clear. A positioning guide on a workbench is not a
        machine guard, and a printed spacer should not quietly become a
        load-bearing component. If the task involves machinery, heat or force,
        the requirements need proper assessment.
      </p>

      <h3 className="pt-2 text-base font-semibold tracking-tight">
        Templates and prototypes before buying materials
      </h3>
      <p>
        A small mock-up can answer whether a handle is comfortable or whether a
        box will fit on a shelf. You may need only a corner, outline or test
        joint rather than a complete object. This can prevent a larger mistake,
        but count a saving only when it replaces a real purchase or avoids a
        documented loss. “This might have saved a lot” is not a reliable budget
        entry.
      </p>
      <p>
        If you are learning the workflow, see the guide to{" "}
        <Link
          href="/guides/how-to-start-3d-printing"
          className="underline underline-offset-4"
        >
          choosing and finishing a first useful print
        </Link>
        .
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Match the material to the conditions
      </h2>
      <p>
        An indoor tray and a part left in a hot car are different jobs. Ordinary
        PLA has temperature and mechanical limits; choosing a familiar material
        does not make those limits disappear. Check the exact product&apos;s data
        and expected conditions. Prusa&apos;s{" "}
        <a
          href="https://help.prusa3d.com/article/pla_2062"
          className="underline underline-offset-4"
        >
          PLA guide
        </a>{" "}
        explains its main limitations.
      </p>
      <p>
        Layer orientation and geometry also affect a finished part. A
        thicker-looking object is not automatically strong in every direction.
        For fitted pieces, use a small test to check clearance instead of
        relying on a universal tolerance number. See Prusa&apos;s guide to{" "}
        <a
          href="https://help.prusa3d.com/article/modeling-with-3d-printing-in-mind_164135"
          className="underline underline-offset-4"
        >
          modeling with 3D printing in mind
        </a>
        .
      </p>
      <p>
        Food-contact products need more care than choosing a spool advertised as
        “food safe.” The finished object&apos;s ingredients, process, surface and
        cleaning conditions all matter. A beginner project list should not
        present printed cups, cutting boards or reusable food containers as
        automatically safe. Prusa&apos;s discussion of{" "}
        <a
          href="https://help.prusa3d.com/article/food-safe-fdm-printing_112313"
          className="underline underline-offset-4"
        >
          food-safe FDM printing
        </a>{" "}
        outlines these concerns.
      </p>
      <p>
        Also avoid treating a printed costume helmet as protective equipment or
        a household print as a certified child-safety product. Use a suitably
        rated commercial part when the consequence of failure could be serious.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Compare the complete print with a real alternative
      </h2>
      <p>
        Start with the material consumed by the entire job, including supports
        and purge if present. Add electricity, any hardware or finishing
        materials, failed attempts and a reasonable equipment allowance. Decide
        separately how to value your hands-on time.
      </p>
      <p>
        For the alternative, use the price of an item that actually meets the
        need. Include unavoidable delivery and tax consistently on both sides.
        Comparing a tiny printed component with an expensive premium product
        that does something different will exaggerate the saving.
      </p>
      <p>
        The arithmetic below is illustrative. All amounts are USD, not current
        shop prices or measured print tests. Assume filament at $20/kg, average
        printer draw of 100 W, electricity at $0.20/kWh and an equipment
        allocation of $0.10 per printing hour. The equipment figure could
        represent a hypothetical $300 printer spread over an assumed 3,000
        useful hours; it is not a lifespan claim. The combined column shows
        material + electricity + equipment. It excludes labor and other extras.
      </p>

      <div className="not-prose overflow-x-auto rounded-md border">
        <table className="w-full min-w-[48rem] border-collapse text-left text-xs">
          <caption className="sr-only">
            Hypothetical print-versus-buy comparison in USD
          </caption>
          <thead className="bg-muted/50">
            <tr>
              <th scope="col" className="p-3 font-semibold">Project</th>
              <th scope="col" className="p-3 font-semibold">Filament</th>
              <th scope="col" className="p-3 font-semibold">Time</th>
              <th scope="col" className="p-3 font-semibold">
                Material + electricity + equipment
              </th>
              <th scope="col" className="p-3 font-semibold">Buy price</th>
              <th scope="col" className="p-3 font-semibold">
                Difference before time and extras
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <th scope="row" className="p-3 font-medium">Small cable guide</th>
              <td className="p-3">15 g</td>
              <td className="p-3">1 hour</td>
              <td className="p-3">$0.30 + $0.02 + $0.10 = $0.42</td>
              <td className="p-3">$4.00</td>
              <td className="p-3">$3.58 less to print</td>
            </tr>
            <tr>
              <th scope="row" className="p-3 font-medium">Fitted shallow tray</th>
              <td className="p-3">100 g</td>
              <td className="p-3">4 hours</td>
              <td className="p-3">$2.00 + $0.08 + $0.40 = $2.48</td>
              <td className="p-3">$8.00</td>
              <td className="p-3">$5.52 less to print</td>
            </tr>
            <tr>
              <th scope="row" className="p-3 font-medium">Large storage box</th>
              <td className="p-3">500 g</td>
              <td className="p-3">20 hours</td>
              <td className="p-3">$10.00 + $0.40 + $2.00 = $12.40</td>
              <td className="p-3">$10.00</td>
              <td className="p-3">$2.40 more to print</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        These are deliberately different outcomes. The large box consumes
        enough material and machine time to lose against the assumed shop
        alternative. The tray looks promising, but a failed prototype,
        purchased feet or an hour of design work could change the decision.
        Enter your own material and electricity costs in the{" "}
        <Link
          href="/tools/filament-cost-calculator"
          className="underline underline-offset-4"
        >
          Filament Cost Calculator
        </Link>{" "}
        and{" "}
        <Link
          href="/tools/electricity-cost-calculator"
          className="underline underline-offset-4"
        >
          Electricity Cost Calculator
        </Link>
        . The site&apos;s guide to the{" "}
        <Link
          href="/guides/3d-printing-cost-breakdown"
          className="underline underline-offset-4"
        >
          cost of a 3D print
        </Link>{" "}
        explains additional cost categories.
      </p>

      <AffiliatePicks
        pagePath={`/guides/${SLUG}`}
        className="my-8 not-prose"
      />

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Count the attempts that did not become useful objects
      </h2>
      <p>
        If the first tray does not fit, its material and time still belong to
        the project. Record what that attempt actually consumed. An early
        failure may use much less than a completed print, while a finished but
        unsuitable prototype may use the full amount.
      </p>
      <p>
        For repeated work, divide the total costs of the batch, including
        rejects, by the number of acceptable pieces. That gives a more useful
        cost per working object than treating every attempt as a success.
      </p>
      <p>
        Design time is a separate choice for a hobbyist. You may enjoy it and
        choose not to put a cash value on it; keep that choice visible. If the
        claim is that printing saves both money and time, the comparison needs
        to include both.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Will a printer pay for itself?
      </h2>
      <p>
        It can, but the answer depends on the projects you would otherwise have
        paid for. There is no useful universal payback date. Suppose a complete
        setup costs $350 and your actual avoided purchases average $5 more than
        each project&apos;s additional cash costs. It would take 70 such projects
        to recover that initial outlay. Both figures are assumptions. A long
        list of objects you might print is not evidence that you would otherwise
        buy all 70.
      </p>
      <p>
        For this cash-payback calculation, subtract consumables, energy,
        replacement parts and wasted attempts as applicable. Do not subtract the
        full startup price and also include a per-print allocation of that same
        purchase price; that would count the purchase twice. Allocated equipment
        cost is useful for comparing ongoing unit economics, while startup
        payback is a separate calculation.
      </p>
      <p>
        If you already own a printer, the purchase price is a past expense for
        the immediate print-versus-buy decision. You may still want an equipment
        allowance for future replacement when tracking the broader cost of the
        hobby.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Pick one project and check the result
      </h2>
      <p>
        Choose something small, useful and low risk. Measure it, slice it and
        compare it with the item you would buy. Record your attempts. A tray
        that fits your drawer can be worthwhile even when the saving is modest.
        You do not need to claim that every project pays for the printer.
      </p>
    </BeginnerGuide>
  );
}
