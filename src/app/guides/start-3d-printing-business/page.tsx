import type { Metadata } from "next";
import Link from "next/link";

import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { BeginnerGuide } from "@/components/shared/BeginnerGuide";
import {
  beginnerGuideMetadata,
  getBeginnerGuide,
} from "@/lib/beginnerGuides";

const SLUG = "start-3d-printing-business";
const guide = getBeginnerGuide(SLUG)!;

export const metadata: Metadata = beginnerGuideMetadata(SLUG);

export default function GuidePage() {
  return (
    <BeginnerGuide guide={guide}>
      <p>
        A small 3D printing business starts with a customer who needs something
        specific. That might be a shop owner looking for a display that fits a
        narrow counter, a hobbyist with an awkward storage problem or a designer
        who needs a physical prototype.
      </p>
      <p>
        The printer is part of delivering that result. Buying more machines
        does not establish that anyone wants the product or that the price will
        cover the work involved. Start with one customer type and a limited
        offer you can make consistently. Test it with a sample and a small paid
        order before expanding. These ideas are candidates to investigate, not
        proven profitable niches or promises of income.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Six business ideas with a clear customer
      </h2>
      <h3 className="pt-2 text-base font-semibold tracking-tight">
        Custom organizers for a particular hobby
      </h3>
      <p>
        A paint-bottle rack for one bottle range, a sewing-supply tray fitted to
        a particular drawer or an insert for game components has a defined user
        and a measurable fit requirement. Knowing the hobby helps you notice
        what generic products miss. Start with one compatible size and describe
        it accurately. Charge for substantial custom design work rather than
        treating every customer&apos;s changes as free.
      </p>

      <h3 className="pt-2 text-base font-semibold tracking-tight">
        Display pieces for local businesses
      </h3>
      <p>
        Small shops, market stalls and studios may need tabletop signs,
        price-card holders, product risers or business-card stands. A sample
        lets the customer check visibility, stability and dimensions before a
        batch is made.
      </p>
      <p>
        Offer a clear range of sizes and finishes. Get permission before
        reproducing a customer&apos;s logo, and check the conditions where the
        item will be used. A countertop display near heat or direct sunlight
        needs different consideration from one in a cool indoor space.
      </p>

      <h3 className="pt-2 text-base font-semibold tracking-tight">
        Original personalized desk and event items
      </h3>
      <p>
        Nameplates, table numbers and place-name holders can use a repeatable
        base design with controlled customization. Confirm spelling and the
        final design before production, and allow time for a failed print or
        correction.
      </p>
      <p>
        Watch the time spent on messages and previews. A low-priced personalized
        item can require more work than its material cost suggests. A
        single-color design may be perfectly adequate; use multicolor only when
        the result justifies the added production complexity.
      </p>

      <h3 className="pt-2 text-base font-semibold tracking-tight">
        Noncritical replacement pieces
      </h3>
      <p>
        A discontinued drawer knob, decorative cover or storage-bin divider can
        solve a real problem when the original part is unavailable. The
        difficulty is establishing the dimensions and intended use, especially
        when the customer sends only a photograph. Offer a fit-check stage for
        unfamiliar parts.
      </p>
      <p>
        Keep safety-critical repairs outside a beginner service. Parts
        associated with electricity, pressure, medical use, personal protection
        or structural loads require expertise and verification that a general
        printing service may not have.
      </p>

      <h3 className="pt-2 text-base font-semibold tracking-tight">
        Prototype printing for local designers
      </h3>
      <p>
        A designer may need an appearance model or a sample to check fit before
        committing to the next version. Define whether you are simply printing
        a supplied file or also providing CAD work, file repair and design
        advice. Agree on the intended purpose and what counts as an acceptable
        result. A prototype made for a visual review should not be represented
        as a tested production component. Obtain confirmation that the customer
        is entitled to have the design reproduced.
      </p>

      <h3 className="pt-2 text-base font-semibold tracking-tight">
        Original accessories for a community you understand
      </h3>
      <p>
        Display stands, craft fixtures and organizing accessories can serve an
        audience you already know. That knowledge can help you write accurate
        descriptions, anticipate fit questions and find a sensible first
        customer.
      </p>
      <p>
        Avoid building the offer around unlicensed characters, logos or copied
        designs. A familiar franchise can attract attention while also creating
        intellectual-property problems. Your own design and a clearly described
        use are a stronger starting point.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Test the offer before buying more printers
      </h2>
      <p>
        Choose one idea and write a short specification: who it is for, the
        problem it solves, dimensions, material, finish and expected delivery
        arrangement. Make a sample that represents what you can actually
        supply. Show it to relevant prospective customers and ask concrete
        questions. What do they use now? What does not fit? Which dimension
        matters? Would the proposed price and delivery date work? Compliments
        are useful feedback, but they are weaker evidence than a paid order
        followed by a satisfied customer.
      </p>
      <p>
        Keep the first batch small enough to inspect every item. Record the time
        spent preparing files, communicating, printing, finishing and packing.
        Note mistakes and returns as well as successful sales.
      </p>
      <p>
        If you do not yet own suitable equipment, obtaining a prototype or
        small batch from a printing service can be a way to test the offer.
        Include that cost in the experiment and make clear who is producing the
        item where the selling platform requires it. If you are still choosing
        a machine, read the guide to{" "}
        <Link
          href="/guides/3d-printing-beginner-equipment"
          className="underline underline-offset-4"
        >
          beginner 3D printing equipment
        </Link>
        .
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        A real founder example of testing demand first
      </h2>
      <p>
        In a July 2025 interview published by Prusa, Zac Hartley said another
        printer owner manufactured his first product. He said the first 10–15
        units sold, and that he continued buying from that person to sell
        online. When production could not keep up with demand, he bought his
        first-ever Prusa. In the same interview he describes an earlier first
        experience with 3D printing on a very cheap printer, so his first Prusa
        should not be described as his first owned printer. The business in the
        interview makes jigs and tool accessories. Read the{" "}
        <a
          href="https://blog.prusa3d.com/interview-with-zac-hartley_118000/"
          className="underline underline-offset-4"
        >
          Prusa interview with Zac Hartley
        </a>
        .
      </p>
      <p>
        The useful lesson is the sequence: a product idea, outside production,
        initial sales and then more capacity. This is one founder&apos;s account
        in an interview published by a printer manufacturer, not audited
        financial evidence or a prediction of what a beginner will earn.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Make sure you can sell the design
      </h2>
      <p>
        Paying for an STL file does not automatically buy commercial printing
        rights. Read the license for the specific model and keep its source URL,
        license terms and any written permission or purchase record.
      </p>
      <p>
        <a
          href="https://creativecommons.org/licenses/by/4.0/deed.en"
          className="underline underline-offset-4"
        >
          CC BY 4.0
        </a>{" "}
        allows commercial use subject to its terms. Give appropriate credit to
        the creator and any listed attribution parties, link to the material and
        the license, and say if you changed the design. Do not imply that the
        creator endorses your product. Keep any credit or modification notices
        the license requires.
      </p>
      <p>
        <a
          href="https://creativecommons.org/licenses/by-nc/4.0/deed.en"
          className="underline underline-offset-4"
        >
          CC BY-NC 4.0
        </a>{" "}
        does not permit commercial use under that license. Giving credit does
        not remove its NonCommercial restriction. A separate commercial license
        may have limits on quantities, sales channels or whether a membership
        must remain active. It also cannot grant rights the licensor does not
        hold. Be especially careful with third-party brands and characters. See
        the Creative Commons{" "}
        <a
          href="https://creativecommons.org/faq/"
          className="underline underline-offset-4"
        >
          license FAQ
        </a>{" "}
        for more about permission and the limits of a license.
      </p>
      <p>
        Check marketplace rules separately. Etsy&apos;s current{" "}
        <a
          href="https://www.etsy.com/legal/creativity/"
          className="underline underline-offset-4"
        >
          Creativity Standards
        </a>{" "}
        say that physical items made with computerized tools such as 3D printers
        fall under “made by a seller” only when produced from the seller&apos;s
        original design. A commercial license to someone else&apos;s STL does not
        make that design your own. Etsy separately allows a seller&apos;s original
        design made by a disclosed production partner under its “designed by a
        seller” category. Licensing and marketplace-category eligibility are
        separate checks; review the current requirements for the platform and
        listing type you intend to use.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Price the work beyond the filament
      </h2>
      <p>
        Track material, electricity, equipment use, maintenance, failed attempts
        and hands-on labor. Add packaging, delivery, selling fees, applicable
        license costs and the overhead that belongs to the business.
      </p>
      <p>
        Include file checks, design revisions, finishing, customer messages and
        packing in labor. A four-hour print does not necessarily require four
        hours of hands-on work, but the time spent getting it sold and delivered
        still has a cost. Prusa&apos;s article on{" "}
        <a
          href="https://blog.prusa3d.com/how-to-calculate-printing-costs_38650/"
          className="underline underline-offset-4"
        >
          calculating 3D printing costs
        </a>{" "}
        explains why preparation, postprocessing and machine costs belong in an
        estimate.
      </p>
      <p>
        The single-item example below is hypothetical and uses USD throughout.
        These are chosen inputs, not actual product costs, a platform quote or
        an earnings forecast. Assume local collection with no postage. The
        “selling and payment fees” line uses an illustrative 10% plus $0.30;
        that is an assumption, not Etsy&apos;s fee schedule or a universal
        platform rate.
      </p>

      <div className="not-prose overflow-x-auto rounded-md border">
        <table className="w-full min-w-[38rem] border-collapse text-left text-xs">
          <caption className="sr-only">
            Hypothetical single-item 3D printing business cost example in USD
          </caption>
          <thead className="bg-muted/50">
            <tr>
              <th scope="col" className="p-3 font-semibold">Cost or revenue</th>
              <th scope="col" className="p-3 font-semibold">Assumption</th>
              <th scope="col" className="p-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <th scope="row" className="p-3 font-medium">Selling price</th>
              <td className="p-3">One finished item</td>
              <td className="p-3 text-right">$18.00</td>
            </tr>
            <tr>
              <th scope="row" className="p-3 font-medium">Filament</th>
              <td className="p-3">80 g total at $20/kg</td>
              <td className="p-3 text-right">$1.60</td>
            </tr>
            <tr>
              <th scope="row" className="p-3 font-medium">Electricity</th>
              <td className="p-3">4 hours at 100 W and $0.20/kWh</td>
              <td className="p-3 text-right">$0.08</td>
            </tr>
            <tr>
              <th scope="row" className="p-3 font-medium">Equipment allocation</th>
              <td className="p-3">4 hours at an assumed $0.10/hour</td>
              <td className="p-3 text-right">$0.40</td>
            </tr>
            <tr>
              <th scope="row" className="p-3 font-medium">Failed work allocation</th>
              <td className="p-3">Assumed cost per sale from tracked rejects</td>
              <td className="p-3 text-right">$0.42</td>
            </tr>
            <tr>
              <th scope="row" className="p-3 font-medium">Hands-on labor</th>
              <td className="p-3">15 minutes valued at $20/hour</td>
              <td className="p-3 text-right">$5.00</td>
            </tr>
            <tr>
              <th scope="row" className="p-3 font-medium">Packaging</th>
              <td className="p-3">Assumed materials used</td>
              <td className="p-3 text-right">$0.75</td>
            </tr>
            <tr>
              <th scope="row" className="p-3 font-medium">Selling and payment fees</th>
              <td className="p-3">Illustrative 10% plus $0.30</td>
              <td className="p-3 text-right">$2.10</td>
            </tr>
            <tr className="bg-muted/30">
              <th scope="row" className="p-3 font-semibold">Amount left</th>
              <td className="p-3">Revenue less the listed costs</td>
              <td className="p-3 text-right font-semibold">$7.65</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        That $7.65 is not net profit. It still needs to cover any unallocated
        design work, licenses, advertising, refunds, insurance, other overhead
        and relevant taxes. If you spent two hours developing the product,
        valued that work at $20 an hour and spread it across 20 sales, another
        $2 per item would leave $5.65 before the remaining costs. Selling fewer
        units would increase the development cost per item.
      </p>
      <p>
        As currently published, Etsy&apos;s fee policy includes a $0.20 USD
        listing fee and a 6.5% transaction fee. Payment-processing charges vary
        by country, and other fees can apply; charged shipping can also be part
        of the transaction-fee base. Read the current{" "}
        <a
          href="https://www.etsy.com/legal/fees/"
          className="underline underline-offset-4"
        >
          Etsy fees and payments policy
        </a>{" "}
        or the schedule for your chosen sales channel instead of copying an
        invented universal percentage.
      </p>
      <p>
        Start a production estimate with the Filament Cost Calculator, then use
        the{" "}
        <Link
          href="/tools/print-pricing-calculator"
          className="underline underline-offset-4"
        >
          Print Pricing Calculator
        </Link>{" "}
        for the costs it covers. Add packaging, channel fees and other excluded
        expenses separately. A markup on filament alone is not a complete
        quote.
      </p>

      <AffiliatePicks
        pagePath={`/guides/${SLUG}`}
        className="my-8 not-prose"
      />

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Check capacity before promising a deadline
      </h2>
      <p>
        At four printer hours per item, 20 items occupy 80 printer hours before
        allowing for failures and downtime. At 15 minutes of hands-on work per
        item, they also require five hours of labor, plus any work not included
        in that estimate.
      </p>
      <p>
        Those two constraints need separate space in the schedule. A machine
        can be busy while you work on another task, but you still need time to
        remove parts, prepare the next job and inspect the output. Do not promise
        a delivery date based on uninterrupted maximum utilization.
      </p>
      <p>
        Keep a repeatable record of the model version, material, profile and
        acceptance checks. If a customer orders the same item again, you should
        be able to reproduce it without guessing which settings worked last
        time.
      </p>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        Begin with a narrow offer you can repeat
      </h2>
      <p>
        Choose one product or service, confirm the rights, make a representative
        sample and cost a small order. Check local business, tax, product-safety
        and insurance requirements before trading; they depend on where you
        operate and what you sell.
      </p>
      <p>
        Expand when real orders show that the offer works and existing equipment
        is a genuine constraint. A reliable small operation with clear limits
        is a better foundation than a room full of printers waiting for a
        business idea.
      </p>
    </BeginnerGuide>
  );
}
