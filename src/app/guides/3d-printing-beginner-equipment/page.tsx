import type { Metadata } from "next";
import Link from "next/link";

import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { BeginnerGuide } from "@/components/shared/BeginnerGuide";
import {
  beginnerGuideMetadata,
  getBeginnerGuide,
} from "@/lib/beginnerGuides";

const SLUG = "3d-printing-beginner-equipment";
const guide = getBeginnerGuide(SLUG)!;

export const metadata: Metadata = beginnerGuideMetadata(SLUG);

export default function GuidePage() {
  return (
    <BeginnerGuide guide={guide}>
      <p>
        The best starting setup is one that can make the things you actually
        want, in the space you actually have. Before comparing printers, write
        down three possible projects and their approximate dimensions. A drawer
        insert, a small tabletop model and a full-size costume piece ask very
        different things of a machine.
      </p>
      <p>
        For ordinary indoor organizers and simple household projects, an FDM
        printer and an ordinary PLA spool are a practical starting combination.
        If fine-detail resin miniatures are your main goal, compare the full
        resin workflow separately, including handling, cleaning, curing and
        waste arrangements. Resin should not be chosen solely because the
        printer&apos;s headline price looks attractive. NIOSH&apos;s{" "}
        <a
          href="https://www.cdc.gov/niosh/docs/2024-103/"
          className="underline underline-offset-4"
        >
          guide to safe 3D printing
        </a>{" "}
        covers potential hazards from different printing technologies and
        materials.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Choose the print size before the feature list
      </h2>
      <p>
        Build volume is the space available for a print, but the entire
        advertised cube is not always usable for every job. Supports, brims,
        placement restrictions and the chosen orientation can reduce what fits.
        Download a representative model and put it into the candidate
        printer&apos;s slicer profile. Look at the longest dimension and the space
        around the part. If it must be split, decide whether you are willing to
        align, join and finish the pieces.
      </p>
      <p>
        A larger machine is useful when you regularly need that space. It also
        needs a suitable place to operate. Measure the full working area,
        including a moving bed, external spool holder and any accessory you
        plan to use.
      </p>
      <p>
        For a current, model-specific starting comparison, see the FilamentCalcs
        guide to{" "}
        <Link
          href="/guides/best-3d-printer-under-300"
          className="underline underline-offset-4"
        >
          printers on a $300 budget
        </Link>
        . Its prices are dated US listings, so check the current regional offer
        and full checkout total before deciding. This checklist is about
        choosing the right setup rather than repeating a ranked printer list.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Features worth checking before buying
      </h2>
      <ul className="list-disc space-y-2 pl-5 marker:text-primary">
        <li>
          <strong>A supported setup process.</strong> Read the startup manual
          before ordering. Clear assembly instructions, supplied profiles and
          an understandable calibration process can save a beginner more
          frustration than a faster headline speed.
        </li>
        <li>
          <strong>Bed leveling and first-layer setup.</strong> Automatic
          features can reduce manual work, but compare what the printer actually
          does. A label saying “auto leveling” does not explain every setup step
          or guarantee adhesion.
        </li>
        <li>
          <strong>Replacement parts and service.</strong> Find the correct
          nozzle or hotend, build plate and other routine spares. Check regional
          availability and the maker&apos;s repair documentation. A low purchase
          price becomes less appealing if a small failed part leaves the printer
          unusable for weeks.
        </li>
        <li>
          <strong>Material compatibility.</strong> Check the manufacturer&apos;s
          supported materials, build-surface requirements and operating
          conditions. A high nozzle-temperature limit alone does not mean the
          printer is suitable for every engineering filament.
        </li>
        <li>
          <strong>Software and connection requirements.</strong> Check
          supported computer operating systems, file-transfer options, account
          requirements and whether your preferred workflow works without an
          internet connection. Do this before buying rather than assuming every
          printer operates the same way.
        </li>
        <li>
          <strong>A usable warranty and return route.</strong> Read who provides
          support in your region and what the retailer&apos;s return terms cover.
          Keep the purchase record and packaging until setup has been checked.
        </li>
        <li>
          <strong>Advertised maximum speed in context.</strong> The time for an
          object also depends on its geometry, layer height, cooling,
          acceleration and material profile. Compare sliced estimates for the
          same model and appropriate settings; do not turn maximum movement
          speed into a promised completion time.
        </li>
      </ul>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        The equipment you need for the first print
      </h2>
      <p>
        Start by checking what is included in the box. Buying a large accessory
        kit can duplicate the basic tools the printer already supplies.
      </p>
      <ul className="list-disc space-y-2 pl-5 marker:text-primary">
        <li>
          <strong>A compatible printer and build surface.</strong> Use the
          intended plate, not an unrelated upgrade bought because its
          description says “universal.”
        </li>
        <li>
          <strong>One spool of ordinary PLA in the correct diameter.</strong>{" "}
          Check the net filament weight and whether it comes on a usable spool
          or is a refill for a particular spool system.
        </li>
        <li>
          <strong>Access to the supported slicer workflow.</strong> A computer
          is useful for inspecting models, dimensions and estimates even if the
          printer also has an app.
        </li>
        <li>
          <strong>The maker&apos;s specified cleaning materials.</strong> Follow
          the instructions for the plate and filament combination. More
          aggressive cleaning is not automatically better.
        </li>
        <li>
          <strong>Safe storage for an opened spool.</strong> A suitably sealed
          container or bag with desiccant can be enough to begin. It does not
          have to carry a 3D printing brand.
        </li>
        <li>
          <strong>The tools required by the startup manual.</strong> Check the
          included-tool list before buying extras.
        </li>
      </ul>
      <p>
        Keep some of your budget available for the workspace itself. A stable
        surface, operating clearance and suitable emissions controls are part of
        the setup, not optional improvements after the printer arrives. Use the
        NIOSH guidance above and the placement instructions for your exact
        machine.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Useful tools to add when the job calls for them
      </h2>
      <h3 className="pt-2 text-base font-semibold tracking-tight">
        Measuring tools
      </h3>
      <p>
        A ruler is enough for a rough tray. Calipers become useful when
        measuring a recess, hole or mating part. Measure the original object in
        more than one place and check the fit with a small test piece before
        printing a large replacement.
      </p>
      <h3 className="pt-2 text-base font-semibold tracking-tight">
        A scale for spools and print use
      </h3>
      <p>
        A scale helps estimate remaining filament and track consumption.
        Capacity matters as much as the number of decimal places on the display:
        a scale limited to 500 g cannot weigh a loaded 1 kg spool. Check that
        the entire loaded spool fits within its rated capacity and on the
        weighing platform. A displayed resolution is not, by itself, a
        guarantee of accuracy.
      </p>
      <h3 className="pt-2 text-base font-semibold tracking-tight">
        An energy meter, if you need a measurement
      </h3>
      <p>
        An energy meter can record a printer&apos;s whole-job electricity use.
        Choose one rated for your local voltage, plug type and load. It is
        useful for measuring costs, but you do not need to buy one before making
        your first print. Start with an explicitly labeled estimate in the{" "}
        <Link
          href="/tools/electricity-cost-calculator"
          className="underline underline-offset-4"
        >
          Electricity Cost Calculator
        </Link>{" "}
        and improve it when you have measurements.
      </p>
      <h3 className="pt-2 text-base font-semibold tracking-tight">
        Replacement parts for the exact printer
      </h3>
      <p>
        A compatible replacement nozzle or hotend can reduce downtime once you
        know the machine. Do not assume the cheapest mixed nozzle pack fits:
        mounting, length, heater design and replacement procedure vary.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Choose filament for the part rather than the label
      </h2>
      <p>
        Ordinary PLA is a reasonable first choice for many indoor, lightly
        stressed objects. PETG can be worth investigating for a later project
        that needs different toughness or temperature performance. TPU is a
        separate learning step when flexibility is part of the design.
      </p>
      <p>
        Those are material families, not performance guarantees. A particular
        grade, print direction and process can change the result. Check the
        exact filament data sheet and intended operating conditions instead of
        assuming every spool called PETG or “PLA+” behaves alike. The{" "}
        <Link
          href="/tools/material-comparison"
          className="underline underline-offset-4"
        >
          Material Comparison tool
        </Link>{" "}
        provides a starting overview with those limits in mind.
      </p>
      <p>
        Some filled materials require different nozzle hardware or sizes.
        Prusa&apos;s{" "}
        <a
          href="https://help.prusa3d.com/article/composite-materials-filled-with-carbon-kevlar-or-glass_167387"
          className="underline underline-offset-4"
        >
          guidance for carbon-, Kevlar- or glass-filled filaments
        </a>{" "}
        explains why particle-filled materials add compatibility
        considerations. There is little reason to introduce that complication
        when your first goal is learning to print a tray.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Do you need a filament dryer immediately?
      </h2>
      <p>
        Not necessarily. Make the decision from the filament&apos;s instructions,
        storage conditions and print results. Some materials and workflows need
        much more careful moisture control than others.
      </p>
      <p>
        Dry storage helps prevent additional moisture exposure. It is not the
        same process as drying a spool that has already absorbed moisture. If
        drying is needed, use settings for the exact product, equipment and
        spool rather than borrowing a generic temperature from a different
        material. Prusa&apos;s{" "}
        <a
          href="https://help.prusa3d.com/article/drying-filament_332086"
          className="underline underline-offset-4"
        >
          drying guidance
        </a>{" "}
        distinguishes product and spool considerations. FilamentCalcs also has
        a{" "}
        <Link
          href="/guides/how-to-dry-filament"
          className="underline underline-offset-4"
        >
          filament drying guide
        </Link>
        . Read the product-specific instructions before buying a large dryer
        for a one-spool setup.
      </p>

      <AffiliatePicks
        pagePath={`/guides/${SLUG}`}
        className="my-8 not-prose"
      />

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Upgrades that can usually wait
      </h2>
      <p>
        A multicolor system can make a project more convenient or visually
        interesting. It can also add material changes, discarded filament and
        more parts to maintain. Compare the sliced job before treating the
        accessory as essential.
      </p>
      <p>
        Extra build plates, specialty nozzles and a cupboard full of filament
        are easier to choose after you have made a few objects. Each purchase
        should answer a specific need: a different material, a worn component
        or a job the existing setup cannot do well.
      </p>
      <p>
        An enclosure is also a compatibility and workspace decision. Do not
        improvise a heated enclosure around a printer without checking its
        operating requirements. An enclosed printer still needs an appropriate
        emissions-control plan.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Write down the complete starting cost
      </h2>
      <p>
        Add the printer, tax, shipping, first spool, genuinely required tools
        and workspace provisions. Keep a separate line for optional
        accessories. If the bundle leaves no room for safe placement or
        consumables, it is not the complete budget.
      </p>
      <p>
        Before ordering, answer four questions: What will I print first? Will it
        fit? Does the machine support the material? Can I operate it
        appropriately here? Once those are settled, the decision becomes much
        easier without buying every upgrade on the page. The{" "}
        <Link
          href="/guides/how-to-start-3d-printing"
          className="underline underline-offset-4"
        >
          first-print walkthrough
        </Link>{" "}
        covers the steps from model selection through the first layer.
      </p>
    </BeginnerGuide>
  );
}
