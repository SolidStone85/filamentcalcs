// Existing guide images. Metadata checked against the linked Commons file
// pages on 2026-11-06. Image licenses apply to images, not article text.
export const GUIDE_IMAGE_CREDITS = {
  "printer-makers-party.jpg": {
    title: "Printing with a 3D printer at Makers Party Bangalore 2013 11",
    creator: "Subhashish Panigrahi",
    source: "https://commons.wikimedia.org/wiki/File:Printing_with_a_3D_printer_at_Makers_Party_Bangalore_2013_11.JPG",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  "spaghetti-fail.jpg": {
    title: "Spaghetti monster",
    creator: "A7N8X",
    source: "https://commons.wikimedia.org/wiki/File:Spaghetti_monster.jpg",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  "printer-in-action.jpg": {
    title: "3D Printing",
    creator: "MukhtaromST",
    source: "https://commons.wikimedia.org/wiki/File:3D_Printing.jpg",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  "printing-materials.jpg": {
    title: "3D Printing Materials",
    creator: "Maurizio Pesce",
    source: "https://commons.wikimedia.org/wiki/File:3D_Printing_Materials_(16863368275).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  "printer-with-spools.jpg": {
    title: "BEETHEFIRST 3D printer and 3D-printed filament spools",
    creator: "Creative Tools",
    source: "https://commons.wikimedia.org/wiki/File:BEETHEFIRST_3D_printer_and_3D-printed_filament_spools.jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  "filament-spools-helsinki.jpg": {
    title: "Helsinki, Oodi, 3D printer filament",
    creator: "Kalle",
    source: "https://commons.wikimedia.org/wiki/File:Helsinki,_Oodi,_3D_printer_filament.jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
  },
  "bambu-x1c-ams.jpg": {
    title: "Bambu Lab X1 Carbon with AMS module (cropped)",
    creator: "Benlisquare",
    source: "https://commons.wikimedia.org/wiki/File:Bambu_Lab_X1_Carbon_with_AMS_module_(cropped).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "filament-types-qidi.png": {
    title: "QiDi 3D Printer Filaments",
    creator: "Haroldbarlow8911",
    source: "https://commons.wikimedia.org/wiki/File:QiDi_3D_Printer_Filaments.png",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "prusaslicer.png": {
    title: "PrusaSlicer",
    creator: "Majkluss",
    source: "https://commons.wikimedia.org/wiki/File:PrusaSlicer.png",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
} as const;

export type GuideImageId = keyof typeof GUIDE_IMAGE_CREDITS;
