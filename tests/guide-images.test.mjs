import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { GUIDE_IMAGE_CREDITS } from "../src/lib/guideImageCredits.ts";

test("all existing guide images retain a local asset and traceable creator/source/license metadata", () => {
  assert.equal(Object.keys(GUIDE_IMAGE_CREDITS).length, 9);
  for (const [filename, credit] of Object.entries(GUIDE_IMAGE_CREDITS)) {
    assert.ok(existsSync(fileURLToPath(new URL(`../public/images/guides/${filename}`, import.meta.url))), filename);
    assert.ok(credit.title.trim() && credit.creator.trim(), filename);
    assert.equal(new URL(credit.source).hostname, "commons.wikimedia.org", filename);
    assert.equal(new URL(credit.licenseUrl).hostname, "creativecommons.org", filename);
    assert.match(credit.license, /^(?:CC BY(?:-SA)? [2-4]\.0|CC0 1\.0)$/);
  }
});
