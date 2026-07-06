import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const disclosure = "As an Amazon Associate I earn from qualifying purchases.";

function repoPath(...parts) {
  return path.join(root, ...parts);
}

function read(...parts) {
  return readFileSync(repoPath(...parts), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function slugsFromRegistry(source, registryName) {
  const slugs = [...source.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
  assert(slugs.length > 0, `${registryName} did not expose any slugs`);
  return slugs;
}

const toolSlugs = slugsFromRegistry(read("src", "lib", "tools.ts"), "TOOLS");
const guideSlugs = slugsFromRegistry(read("src", "lib", "guides.ts"), "GUIDES");

const contentPaths = [
  ...toolSlugs.map((slug) => `/tools/${slug}`),
  ...guideSlugs.map((slug) => `/guides/${slug}`),
];

assert(
  existsSync(repoPath("src", "lib", "commerce.ts")),
  "Expected shared commerce data at src/lib/commerce.ts",
);

assert(
  existsSync(repoPath("src", "components", "shared", "AffiliatePicks.tsx")),
  "Expected AffiliatePicks component",
);

assert(
  existsSync(repoPath("src", "components", "shared", "RelatedContent.tsx")),
  "Expected RelatedContent component",
);

const commerce = read("src", "lib", "commerce.ts");
const affiliateComponent = read("src", "components", "shared", "AffiliatePicks.tsx");
const relatedComponent = read("src", "components", "shared", "RelatedContent.tsx");
const footer = read("src", "components", "layout", "Footer.tsx");
const homepage = read("src", "app", "page.tsx");
const about = read("src", "app", "about", "page.tsx");
const guidesIndex = read("src", "app", "guides", "page.tsx");
const author = read("src", "lib", "author.ts");

assert(
  affiliateComponent.includes("NEXT_PUBLIC_AMZN_TAG"),
  "AffiliatePicks must read NEXT_PUBLIC_AMZN_TAG",
);
assert(
  affiliateComponent.includes('rel="sponsored nofollow"'),
  'Affiliate links must use rel="sponsored nofollow"',
);
assert(
  affiliateComponent.includes('target="_blank"'),
  'Affiliate links must open in a new tab with target="_blank"',
);
assert(
  commerce.includes(disclosure),
  "Shared commerce data must define the Amazon Associates disclosure",
);
assert(
  affiliateComponent.includes("AMAZON_DISCLOSURE"),
  "AffiliatePicks must render the Amazon Associates disclosure constant",
);
assert(
  footer.includes("AMAZON_DISCLOSURE"),
  "Footer must include the Amazon Associates disclosure",
);

for (const pagePath of contentPaths) {
  assert(
    commerce.includes(`"${pagePath}"`),
    `Missing affiliate product mapping for ${pagePath}`,
  );
  assert(
    commerce.includes(`path: "${pagePath}"`),
    `Missing related-content mapping for ${pagePath}`,
  );
}

for (const slug of guideSlugs) {
  const page = read("src", "app", "guides", slug, "page.tsx");
  assert(page.includes("AffiliatePicks"), `Guide ${slug} does not render AffiliatePicks`);
  assert(page.includes("RelatedContent"), `Guide ${slug} does not render RelatedContent`);
  assert(
    page.includes("pagePath={`/guides/${SLUG}`}"),
    `Guide ${slug} should use its SLUG when rendering commerce blocks`,
  );
}

for (const slug of toolSlugs) {
  const page = read("src", "app", "tools", slug, "page.tsx");
  const pagePath = `/tools/${slug}`;
  assert(page.includes("AffiliatePicks"), `Tool ${slug} does not render AffiliatePicks`);
  assert(page.includes("RelatedContent"), `Tool ${slug} does not render RelatedContent`);
  assert(
    page.includes(`pagePath="${pagePath}"`),
    `Tool ${slug} should render commerce blocks for ${pagePath}`,
  );
}

for (const topPath of [
  "/guides/best-3d-printer-under-300",
  "/guides/multi-color-printing-ams-worth-it",
  "/tools/ams-purge-waste-calculator",
]) {
  assert(homepage.includes(topPath), `Homepage must link to top page ${topPath}`);
}

for (const staleCopy of [
  "No affiliate links",
  "no affiliate links",
  "no affiliate revenue",
  "no sponsored placements",
  "no recommended retailers",
]) {
  assert(!homepage.includes(staleCopy), `Homepage still contains stale copy: ${staleCopy}`);
  assert(!about.includes(staleCopy), `About page still contains stale copy: ${staleCopy}`);
  assert(!guidesIndex.includes(staleCopy), `Guides index still contains stale copy: ${staleCopy}`);
  assert(!author.includes(staleCopy), `Author bio still contains stale copy: ${staleCopy}`);
}

assert(
  relatedComponent.includes("Related tools and guides"),
  "RelatedContent must use the expected block title",
);

console.log(
  `Affiliate content verification passed for ${toolSlugs.length} tools and ${guideSlugs.length} guides.`,
);
