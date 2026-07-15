// Content for the per-brand empty-spool-weight landing pages (/spools/*).
// Each page embeds the Remaining Spool calculator preset to that brand and
// adds brand-specific tare data. Numbers are community-measured consensus
// (brand forums + crowdsourced spool databases, checked 2026-07); keep them
// in sync with lib/presets/spools.ts when either changes.

export type SpoolWeightRow = {
  variant: string;
  grams: string; // display string; ranges allowed ("192-207")
  note: string;
};

export type SpoolBrandPage = {
  slug: string;
  brand: string;
  title: string; // h1 + <title>
  metaDescription: string;
  presetId: string; // default preset for the embedded calculator
  intro: string[];
  weights: SpoolWeightRow[];
  faq: { q: string; a: string }[];
  sources: { label: string; url: string }[];
};

export const SPOOL_BRAND_PAGES: SpoolBrandPage[] = [
  {
    slug: "bambu-lab",
    brand: "Bambu Lab",
    title: "Bambu Lab empty spool weight: reusable spool, refill core, cardboard",
    metaDescription:
      "How much a Bambu Lab spool weighs empty: reusable spool ~208 g, with refill core ~233 g, cardboard spool ~205 g. Weigh your spool and get grams of filament left.",
    presetId: "bambu-refill",
    intro: [
      "Bambu Lab does not print the empty weight on the spool, so everyone ends up guessing. The right number depends on which spool you are actually weighing, because Bambu has shipped at least three different setups.",
      "If you run refills on the reusable spool, your scale is seeing the plastic spool plus the refill's cardboard core. That combination is about 233 g. If you bought filament that came on a full cardboard spool, the spool alone is about 205 g. The older gen-1 transparent spools are heavier than the current light-grey ones, so if your math looks off by 40 to 60 g, that is probably why.",
    ],
    weights: [
      {
        variant: "Reusable spool (light-grey, current)",
        grams: "~208",
        note: "Bare spool, no cardboard core. Four community-measured spools all landed at 208 to 208.5 g.",
      },
      {
        variant: "Reusable spool + refill core",
        grams: "~233",
        note: "What the scale sees with a refill mounted: spool plus the ~25 g cardboard core.",
      },
      {
        variant: "Reusable spool (gen-1 transparent)",
        grams: "250-264",
        note: "The older clear spool with clips. White version ~251 g, transparent ~264 g.",
      },
      {
        variant: "Cardboard spool (filament with spool)",
        grams: "~205",
        note: "The all-cardboard spool Bambu filament ships on when you don't buy refills.",
      },
    ],
    faq: [
      {
        q: "Why doesn't Bambu Lab print the spool weight on the spool?",
        a: "No idea, and the community keeps asking them to. Until they do, weigh one empty spool of each type you own and write the number on it with a Sharpie. These presets get you close, but your own measurement is exact.",
      },
      {
        q: "How much does the refill cardboard core weigh on its own?",
        a: "About 25 g. That is why the reusable spool reads ~208 g bare but ~233 g with a refill mounted. If you weigh a spool mid-print with a refill on it, use the 233 g figure.",
      },
      {
        q: "Can I weigh the spool while it's in the AMS?",
        a: "No, take it out. The AMS rollers support part of the spool's weight, so anything you read while it is docked is meaningless. Pull the spool, weigh it on a kitchen scale, put it back.",
      },
      {
        q: "Do the high-temp and low-temp reusable spools weigh the same?",
        a: "Close but not identical. The current light-grey low-temp spool measures ~208 g. The older transparent high-temp version runs 250 to 264 g depending on the clips. If you still have gen-1 spools in rotation, weigh one and label it.",
      },
    ],
    sources: [
      {
        label: "Bambu Lab community forum: filament spool weight thread",
        url: "https://forum.bambulab.com/t/filament-spool-weight/91401",
      },
      {
        label: "Empty Spool Weight Catalog (crowdsourced, Printables)",
        url: "https://www.printables.com/model/464663-empty-spool-weight-catalog",
      },
    ],
  },
  {
    slug: "polymaker",
    brand: "Polymaker",
    title: "Polymaker empty spool weight: cardboard spool vs older plastic",
    metaDescription:
      "Polymaker spool weights empty: the current cardboard spool is 140 g (Polymaker's own spec), older plastic spools are ~215 g. Weigh your spool for the filament you have left.",
    presetId: "polymaker",
    intro: [
      "Polymaker moved its standard lines to a recycled cardboard spool, and their own product pages list the 1 kg cardboard spool at 140 g give or take 7 g. If you still have older stock, some of it shipped on a heavier plastic spool nearer 215 g. Mixing the two up throws your remaining-filament math off by about 75 g, close to a whole Benchy of error.",
      "So the first question is which spool you are holding. PolyLite, PolyTerra, PolyMax and most current Polymaker filament come on the cardboard spool now. The cardboard also drifts a few grams with humidity, because it absorbs moisture along with your filament, so weigh one once if you want to be exact.",
    ],
    weights: [
      {
        variant: "Cardboard spool (current, 1 kg)",
        grams: "~140",
        note: "Polymaker's own spec is 140 +/- 7 g. Used across current PolyLite, PolyTerra, and most standard lines.",
      },
      {
        variant: "Cardboard spool (0.5 kg)",
        grams: "~190",
        note: "The half-size cardboard spool, per Polymaker's product specs.",
      },
      {
        variant: "Plastic spool (older stock)",
        grams: "~215",
        note: "The heavier black plastic spool Polymaker used before the cardboard switch. Community-measured.",
      },
    ],
    faq: [
      {
        q: "Is my Polymaker spool cardboard or plastic?",
        a: "Current Polymaker filament ships on a recycled cardboard spool, which their product pages spec at 140 g for the 1 kg size. If your spool is solid black plastic rather than cardboard, it is older stock and weighs closer to 215 g. When in doubt, weigh the empty spool and pick Custom.",
      },
      {
        q: "Why does my cardboard spool weigh more than 140 g empty?",
        a: "Cardboard absorbs moisture. A spool that lived in a humid room can read several grams heavier than one out of a dry box. Polymaker's own figure carries a plus-or-minus 7 g tolerance on top of that, so anything in the low-to-mid 140s is normal.",
      },
      {
        q: "Does Polymaker publish official spool weights?",
        a: "Yes, for the cardboard spools. Polymaker's product pages list the 1 kg cardboard spool at 140 g and the 0.5 kg at about 190 g. The older plastic spool weight comes from community measurements. Either way, your own scale is the final word.",
      },
    ],
    sources: [
      {
        label: "Polymaker PolyLite PLA product page (cardboard spool spec)",
        url: "https://shop.polymaker.com/products/polylite-pla",
      },
      {
        label: "Empty Spool Weight Catalog (crowdsourced, Printables)",
        url: "https://www.printables.com/model/464663-empty-spool-weight-catalog",
      },
    ],
  },
  {
    slug: "esun",
    brand: "eSun",
    title: "eSun empty spool weight: what your scale should read",
    metaDescription:
      "eSun empty spool weights: most current spools ~200 g, older black plastic spools up to ~224 g. Weigh your spool and calculate remaining filament in grams.",
    presetId: "esun",
    intro: [
      "eSun is the messiest brand to pin down, because they have used several spool designs across their lines and years. Community measurements range from about 195 g up to about 225 g for the plastic spools.",
      "The preset below uses 200 g, which fits most current eSun spools. If your remaining-filament number matters (say the print needs 180 g and the calculator says you have 190), weigh an empty eSun spool from the same line before you trust it. The 25 g spread between spool designs is exactly the margin that ruins a close call.",
    ],
    weights: [
      {
        variant: "Current plastic spool (typical)",
        grams: "~200",
        note: "The figure most current eSun spools cluster around, and the preset used here.",
      },
      {
        variant: "Older black plastic spool",
        grams: "~224",
        note: "Common figure for older eSun PLA+ spools still in circulation.",
      },
    ],
    faq: [
      {
        q: "Why do eSun spool weights vary so much?",
        a: "They have changed spool designs more than most brands, and different filament lines have shipped on different spools in the same year. Two eSun spools on your shelf can genuinely be 25 g apart empty. That is not your scale's fault.",
      },
      {
        q: "Which number should I use for eSun PLA+?",
        a: "If the spool is recent, start with 200 g. If it is a few years old, it is more likely near 224 g. For anything close, weigh an empty one. Once you know your number, write it on the spool and the question is settled for good.",
      },
      {
        q: "Does the calculator handle a spool weight I measured myself?",
        a: "Yes. Pick Custom in the spool type dropdown and type your measured weight. Your own measurement always beats a preset.",
      },
    ],
    sources: [
      {
        label: "Empty Spool Weight Catalog (crowdsourced, Printables)",
        url: "https://www.printables.com/model/464663-empty-spool-weight-catalog",
      },
      {
        label: "stlDenise3D: how much do empty spools weigh?",
        url: "https://stldenise3d.com/how-much-do-empty-spools-weigh/",
      },
    ],
  },
  {
    slug: "prusament",
    brand: "Prusament",
    title: "Prusament empty spool weight, measured instead of guessed",
    metaDescription:
      "Prusament spools weigh about 200 g empty (community measurements run 192 to 207 g). Weigh your spool and get grams of filament remaining in seconds.",
    presetId: "prusament",
    intro: [
      "Prusament spools land right around 200 g empty. Community measurements cluster between 192 and 207 g, with humidity accounting for a few grams of that spread because the core is cardboard.",
      "Prusa is also the one brand that actually helps you here: every Prusament spool has per-spool manufacturing data behind the QR code on the side, and Prusa runs a separate web tool that turns your measured spool-plus-filament weight into remaining length. For a quick answer while standing at the printer, weigh the spool and let the calculator below do the subtraction.",
    ],
    weights: [
      {
        variant: "Prusament 1 kg spool",
        grams: "192-207",
        note: "Cardboard-core spool; ~200 g is the safe working number. Humidity moves it a few grams either way.",
      },
    ],
    faq: [
      {
        q: "Why does my Prusament spool read 194 g when the preset says 200 g?",
        a: "Both are right. The cardboard core gains and loses a few grams with ambient humidity, and manufacturing tolerance adds a little spread on top. A dry-stored spool often reads in the low 190s. If you want tighter numbers, weigh yours and use Custom.",
      },
      {
        q: "Doesn't Prusa publish the exact data for my spool?",
        a: "Close. Scan the QR code on the spool sticker and you get that spool's manufacturing record, and Prusament runs a separate web tool that converts your measured spool-plus-filament weight into remaining length. This page is for the fast version: scale, subtract, done.",
      },
      {
        q: "Does the 200 g figure work for all Prusament materials?",
        a: "For the standard 1 kg spools, yes, the spool is the same regardless of whether PLA, PETG or ASA is wound on it. The 2 kg and refill formats are different animals; weigh those once before trusting any preset.",
      },
    ],
    sources: [
      {
        label: "Prusa forum: weight of Prusament spool threads",
        url: "https://forum.prusa3d.com/forum/english-forum-general-discussion-announcements-and-releases/empty-spool-weight/",
      },
      {
        label: "Prusament: check filament length on your spool",
        url: "https://prusament.com/check-filament-length-on-your-prusament-spool/",
      },
    ],
  },
];

export function getSpoolBrandPage(slug: string): SpoolBrandPage | undefined {
  return SPOOL_BRAND_PAGES.find((p) => p.slug === slug);
}
