import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { BeginnerGuide } from "@/components/shared/BeginnerGuide";
import { PrinterProcess } from "@/components/shared/PrinterProcess";
import {
  beginnerGuideMetadata,
  getBeginnerGuide,
} from "@/lib/beginnerGuides";

const SLUG = "how-to-start-3d-printing";
const guide = getBeginnerGuide(SLUG)!;

export const metadata: Metadata = beginnerGuideMetadata(SLUG);

export default function GuidePage() {
  return (
    <BeginnerGuide
      guide={guide}
      hero={
        <figure>
          <Image
            src="/images/guides/beginner-printer.webp"
            alt="Illustration of a filament printer making a small desk tray"
            width={1672}
            height={941}
            priority
            className="h-auto w-full rounded-lg object-cover"
          />
          <figcaption className="mt-2 text-xs text-muted-foreground">
            AI-generated illustration; not a photograph of a tested print or
            product.
          </figcaption>
        </figure>
      }
      process={<PrinterProcess />}
    >
      <p>
        A small tray for the screws on your desk is a better first 3D print than a
        helmet you need tomorrow. It gives you something useful, keeps the
        material commitment modest and lets you learn the whole process without
        a complicated assembly waiting at the end.
      </p>
      <p>
        This guide starts with a filament printer, often called an FDM or FFF
        printer, using ordinary PLA. You will choose a model, prepare it for your
        machine, check the preview and watch the first layers. You do not need
        to design the object yourself.
      </p>
      <p>
        If you have not bought a printer, you can still try the first half of
        this process in a slicer. You can also ask a local makerspace or printing
        service to make a sample before committing to equipment. Availability
        and charges vary, but a trial can answer an important question: do you
        enjoy the process, or do you mainly want the finished object? For help
        choosing a setup, see{" "}
        <Link
          href="/guides/3d-printing-beginner-equipment"
          className="underline underline-offset-4"
        >
          what you need for 3D printing
        </Link>
        .
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Understand the three parts of a print
      </h2>
      <p>
        The model describes the object&apos;s shape. The slicer turns it into
        instructions for a particular printer. The printer follows those
        instructions, depositing softened filament in successive layers.
      </p>
      <p>
        An STL file normally supplies geometry. A 3MF file can include a more
        complete project, including settings. That convenience has a catch:
        opening someone else&apos;s project can replace your selected printer or
        material profile. Before sending any job, check that the machine, nozzle
        and material are yours. Prusa&apos;s{" "}
        <a
          href="https://help.prusa3d.com/article/first-print-with-prusaslicer-3-0-0_1079761"
          className="underline underline-offset-4"
        >
          first-print walkthrough
        </a>{" "}
        covers importing a model, choosing a printer and material, slicing and
        checking the preview.
      </p>
      <p>
        Download models from an identifiable creator and read the instructions
        attached to that design. Photos of completed prints, dimensions and
        clear assembly notes are more useful than a striking render alone.
        Check the license, too: permission to download a model does not
        automatically permit selling the finished prints.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Choose a first project with a small cost of failure
      </h2>
      <p>
        Look for a simple tray, desk label or organizer with a flat base and no
        assembly. Prefer a design that fits easily on the bed and does not
        require support material. Supports are temporary structures printed
        beneath parts of a model; removing them adds another job to your first
        attempt.
      </p>
      <p>
        One example is this small screw tray by peter0895 on{" "}
        <a
          href="https://www.printables.com/model/1864945-screw-tray"
          className="underline underline-offset-4"
        >
          Printables
        </a>
        . Its model page lists a footprint of 60 by 60 mm. A small screw tray
        is a low-consequence practice object, but check the model&apos;s current
        instructions, dimensions and slicer preview before printing; build
        volume and setup differ by printer.
      </p>
      <p>
        Avoid making your first project something that must hold a heavy object,
        withstand heat or fit a critical mechanism. A slight dimensional error
        in a pencil tray is inconvenient. The same error in a safety-related
        part can matter much more.
      </p>
      <p>
        Read the model&apos;s dimensions before printing. A download called
        “small organizer” could still be larger than your build plate. Do not
        shrink a fitted design casually: scaling changes hole sizes, clearances
        and wall thickness as well as the outside dimensions. One part is
        enough for the first run. If its fit is wrong, you want to discover that
        before printing six more.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Set up the printer and its workspace
      </h2>
      <p>
        Use the manufacturer&apos;s assembly and startup instructions for your
        exact model. Remove the specified transport restraints, fit the build
        plate correctly and run the required checks. Leave room for the bed,
        cables and spool to move through their full travel. The printer&apos;s
        advertised body dimensions may not include that operating space.
      </p>
      <p>
        Use a stable surface and keep hot and moving parts away from children,
        pets and loose objects. Know how to stop a print. Do not reach into a
        moving machine to rescue a loose part. Filament printing can also release
        ultrafine particles and gases, including when printing PLA. NIOSH
        recommends appropriate exposure controls such as suitable ventilation
        and source capture; a closed cabinet alone does not establish that
        emissions are controlled. Read the{" "}
        <a
          href="https://www.cdc.gov/niosh/docs/2024-103/"
          className="underline underline-offset-4"
        >
          NIOSH safe 3D printing guide
        </a>{" "}
        and consider the room&apos;s use before placing a printer beside a bed or
        a desk occupied all day.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Start with ordinary PLA
      </h2>
      <p>
        PLA is a sensible learning material for an indoor organizer or
        decorative object. Prusa describes it as easy to print with relatively
        low warping, while noting its limits for heat and demanding mechanical
        use. That makes it useful for learning, not suitable for every finished
        part. See Prusa&apos;s{" "}
        <a
          href="https://help.prusa3d.com/article/pla_2062"
          className="underline underline-offset-4"
        >
          PLA guidance
        </a>
        .
      </p>
      <p>
        Buy the filament diameter your printer requires. For a first spool,
        choose an ordinary, unfilled formulation with a published print profile
        or usable manufacturer settings. Save wood-filled, glow-in-the-dark and
        other specialty materials for a project that needs them and hardware
        that supports them. Use the printer&apos;s loading procedure and keep
        control of the loose filament end so it cannot slip beneath another
        winding. You need only one color to learn the basic workflow.
      </p>

      <AffiliatePicks
        pagePath={`/guides/${SLUG}`}
        className="my-8 not-prose"
      />

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Slice the model with a known starting profile
      </h2>
      <p>
        Install the slicer recommended or supported by your printer maker.
        Select the exact printer and installed nozzle, then the correct filament
        profile. Start with the standard or balanced print profile rather than
        changing every setting at once.
      </p>
      <p>
        Inspect the object on the virtual bed. Is the intended flat face
        underneath? Are the dimensions right? Does the preview show material
        trying to begin in midair? Use the model designer&apos;s orientation
        instructions where provided.
      </p>
      <p>
        After slicing, move through the layer preview. Look at the base, any
        overhangs and the top of the part. The preview can help you spot an
        obvious problem before committing filament. Record the estimated time
        and total material consumption. Neither number is a promise, but both
        are useful for deciding whether to proceed.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Check what the first attempt will cost
      </h2>
      <p>
        Use the whole-job material figure where available, including supports
        and other printed waste. If those grams are already included, do not
        add them again as a waste allowance.
      </p>
      <p>
        For an illustrative example, a job consuming 30 g from filament costing
        $20 per kilogram uses $0.60 of material: 30 divided by 1,000, multiplied
        by 20. This is hypothetical arithmetic, not a quote for a model or
        spool. Enter your own values in the{" "}
        <Link
          href="/tools/filament-cost-calculator"
          className="underline underline-offset-4"
        >
          Filament Cost Calculator
        </Link>
        . It estimates material cost, not the complete cost of owning and
        running the printer. Electricity, unsuccessful attempts and equipment
        are separate.
      </p>
      <p>
        If you are using a partly empty spool, weigh it and subtract the
        matching empty-spool weight with the{" "}
        <Link
          href="/tools/remaining-spool-calculator"
          className="underline underline-offset-4"
        >
          Remaining Spool Calculator
        </Link>
        . Allow for measurement uncertainty rather than planning a long job
        around a barely sufficient estimate.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Send the prepared job to the printer
      </h2>
      <p>
        Export or send the sliced job using the printer&apos;s supported method,
        such as removable storage or its approved network workflow. Confirm the
        destination printer and start the job from the printer or app as its
        instructions require. An STL is the model, not usually the printer-ready
        instruction file. Avoid running downloaded G-code unless you have
        verified that it was prepared for your exact machine and configuration.
        The safer beginner route is to slice the model yourself with the correct
        profile.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Watch the beginning and respond to what you see
      </h2>
      <p>
        Prepare the build surface using its manufacturer&apos;s instructions.
        Cleaning products and release agents are not interchangeable across
        plates and materials. Automatic bed leveling also does not clean the
        surface. Watch the first layers: the material should stay attached
        rather than being dragged around by the nozzle. If the object comes
        loose, stop the job and investigate. Let the machine become safe to
        handle before removing debris or adjusting anything.
      </p>
      <p>
        Stay with the printer during setup and the first layers, then follow
        your manufacturer&apos;s instructions about monitoring the rest of a job.
        Check the manual&apos;s fire and electrical guidance, use a properly
        rated outlet and cord, keep combustibles clear, and do not overload a
        circuit. The NIOSH guide discusses printer fire hazards; it is not a
        substitute for the instructions for your machine and workspace.
      </p>
      <p>
        For adhesion trouble, check the plate&apos;s condition and installation,
        the selected material profile and the machine&apos;s calibration
        procedure. Avoid an arbitrary nozzle-height change on a printer that
        handles that adjustment differently. Prusa&apos;s model-specific{" "}
        <a
          href="https://help.prusa3d.com/article/first-layer-calibration-mini-mini_229122"
          className="underline underline-offset-4"
        >
          first-layer guide
        </a>{" "}
        illustrates why surface preparation and calibration matter; use your
        own printer&apos;s procedure for the fix.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Finish the print and keep one useful note
      </h2>
      <p>
        Let the plate and part cool as instructed before removal. Check for sharp
        edges, loose pieces and visible defects. Test the object&apos;s fit gently
        before relying on it.
      </p>
      <p>
        Keep a short record: model version, filament, profile, estimated grams,
        result and any change you made. If a tray is slightly too wide, that
        note is more helpful than a vague memory that the print “almost worked.”
        For your next project, change one meaningful thing: try a different
        size, a fitted lid or a simple model you designed yourself. A few
        repeatable, useful prints teach more than a shelf full of upgrades
        bought before you know what needs improving.
      </p>
      <p>
        For more project ideas and a fair print-versus-buy comparison, read
        about{" "}
        <Link
          href="/guides/useful-3d-prints-save-money"
          className="underline underline-offset-4"
        >
          useful 3D prints that can save money
        </Link>
        .
      </p>
    </BeginnerGuide>
  );
}
