import test from "node:test";
import assert from "node:assert/strict";
import * as commerce from "../src/lib/commerce.ts";

const beginnerSlugs = ["how-to-start-3d-printing", "3d-printing-beginner-equipment", "useful-3d-prints-save-money", "start-3d-printing-business"];

test("new beginner guides have task-relevant recommendations and related calculator links", () => {
  for (const slug of beginnerSlugs) {
    const route = `/guides/${slug}`;
    assert.ok(commerce.getAffiliatePicks(route).length > 0, route);
    assert.ok(commerce.getRelatedLinks(route).length > 0, route);
  }
});

test("dryer recommendation discloses its temperature ceiling beside the product", () => {
  const dryer = commerce.getAffiliatePicks("/guides/how-to-dry-filament").find(p => p.id === "sunlu-s4");
  assert.match(dryer.reason, /70\s*°C/);
  assert.match(dryer.reason, /80\s*°C/);
});

test("unverified ordinary PLA selection is a clearly described search, not an assumed ASIN", () => {
  const pla = commerce.getAffiliatePicks("/tools/filament-cost-calculator").find(p => p.id === "overture-pla");
  assert.ok(new URL(pla.url).searchParams.has("k"));
  assert.match(pla.reason, /unfilled/i);
});

test("Amazon search results and direct products get different destination labels", () => {
  assert.equal(typeof commerce.getAmazonLinkLabel, "function");
  assert.equal(commerce.getAmazonLinkLabel("https://www.amazon.com/s?k=filament"), "Search Amazon.com");
  assert.equal(commerce.getAmazonLinkLabel("https://www.amazon.com/dp/B0FFGXJXQ5"), "View on Amazon.com");
});
