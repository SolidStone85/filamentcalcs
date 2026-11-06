"""End-to-end checks for the November guides, theme and visual additions."""
import argparse
import json
import re
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

SLUGS = ["how-to-start-3d-printing", "3d-printing-beginner-equipment", "useful-3d-prints-save-money", "start-3d-printing-business"]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:3221")
    parser.add_argument("--channel", default=None)
    parser.add_argument("--output", default="../release-evidence/browser")
    parser.add_argument("--local-production", action="store_true")
    args = parser.parse_args()
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    checks, errors, local_errors = [], [], []

    def require(condition, message):
        assert condition, message

    def check(name, action):
        try:
            action()
            checks.append({"name": name, "passed": True})
        except Exception as error:
            checks.append({"name": name, "passed": False, "error": str(error)[:800]})

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, **({"channel": args.channel} if args.channel else {}))
        version = browser.version
        context = browser.new_context(viewport={"width": 390, "height": 844}, color_scheme="dark")
        page = context.new_page()
        page.set_default_timeout(7000)
        page.on("pageerror", lambda e: errors.append({"message": str(e), "stack": e.stack}))

        def console(message):
            if message.type != "error":
                return
            item = {"message": message.text, "url": message.location.get("url", "")}
            if (args.local_production and item["url"] == args.base_url.rstrip("/") + "/_vercel/insights/script.js"
                    and "404 (Not Found)" in item["message"]):
                local_errors.append(item)
            else:
                errors.append(item)
        page.on("console", console)

        def visit(path):
            response = page.goto(args.base_url.rstrip("/") + path, wait_until="networkidle", timeout=90000)
            require(response.status == 200, f"{path}: HTTP {response.status}")

        def choose_theme(theme):
            page.get_by_role("button", name="Choose color theme", exact=True).click()
            page.get_by_role("menuitemradio", name=theme.capitalize(), exact=True).click()
            page.wait_for_function("theme => document.documentElement.classList.contains(theme)", arg=theme)

        visit("/")
        # Reach Workshop using only keyboard navigation from the theme trigger.
        trigger = page.get_by_role("button", name="Choose color theme", exact=True)
        trigger.press("Enter")
        page.keyboard.press("Home")
        page.keyboard.press("ArrowDown")
        page.keyboard.press("Enter")
        page.wait_for_function("document.documentElement.classList.contains('workshop')")
        check("keyboard selects Workshop", lambda: require(page.evaluate("localStorage.getItem('theme')") == "workshop", "Theme was not persisted."))
        check("Workshop browser controls use light color scheme despite dark system", lambda: require(
            page.evaluate("getComputedStyle(document.documentElement).colorScheme") == "light", "Native color scheme differs."))
        page.reload(wait_until="networkidle")
        check("Workshop survives reload", lambda: require("workshop" in page.locator("html").get_attribute("class"), "Saved Workshop choice was lost."))
        page.emulate_media(color_scheme="light")
        check("explicit Workshop overrides an OS appearance change", lambda: require(
            "workshop" in page.locator("html").get_attribute("class"), "OS appearance replaced the explicit theme."))
        page.emulate_media(color_scheme="dark")
        page.get_by_role("button", name="Choose color theme", exact=True).click()
        page.get_by_role("menuitemradio", name="System", exact=True).click()
        page.wait_for_function("document.documentElement.classList.contains('dark')")
        check("System follows dark OS appearance and persists", lambda: require(
            page.evaluate("localStorage.getItem('theme')") == "system", "System choice was not persisted."))
        page.emulate_media(color_scheme="light")
        page.wait_for_function("document.documentElement.classList.contains('light')")
        check("System follows a change to light OS appearance", lambda: require(
            "light" in page.locator("html").get_attribute("class"), "System theme did not follow the OS change."))

        for theme in ["light", "workshop", "dark"]:
            choose_theme(theme)
            for width in [320, 390, 1280]:
                page.set_viewport_size({"width": width, "height": 844})
                for slug in SLUGS:
                    visit("/guides/" + slug)
                    article = page.locator("article").first
                    text = " ".join(article.inner_text().split())
                    check(f"{theme} {width}px {slug}: full article and no overflow", lambda: require(
                        len(text.split()) >= 700 and page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"),
                        "Article is unexpectedly short or overflows horizontally."))
                    graph = json.loads(article.locator('script[type="application/ld+json"]').inner_text())["@graph"]
                    faq = next(item for item in graph if item["@type"] == "FAQPage")
                    check(f"{theme} {width}px {slug}: FAQ schema matches visible content", lambda: require(
                        all(" ".join(q["name"].split()) in text and " ".join(q["acceptedAnswer"]["text"].split()) in text for q in faq["mainEntity"]),
                        "A schema FAQ is not visible."))
                    check(f"{theme} {width}px {slug}: canonical and heading", lambda: require(
                        article.locator("h1").count() == 1 and page.locator('link[rel="canonical"]').get_attribute("href") == "https://filamentcalcs.com/guides/" + slug,
                        "Heading or canonical is missing."))
                    blocks = article.locator('aside[aria-label="Related Amazon product picks"]')
                    check(f"{theme} {width}px {slug}: recommendation disclosure", lambda: require(
                        blocks.count() >= 1 and all("As an Amazon Associate I earn from qualifying purchases." in block.inner_text() and "Amazon.com" in block.inner_text() for block in blocks.all()),
                        "A recommendation block lacks adjacent disclosure."))
                    for anchor in blocks.locator("a[href]").all():
                        href = anchor.get_attribute("href")
                        expected = "Search Amazon.com" if "k=" in href else "View on Amazon.com"
                        require(expected in anchor.inner_text() and "tag=filamentcalcs-20" in href and "sponsored" in anchor.get_attribute("rel"), "Affiliate destination/label/tag mismatch.")
                    for image in article.locator("img").all():
                        check(f"{theme} {width}px {slug}: image loads", lambda: require(
                            image.evaluate("img => img.complete && img.naturalWidth > 0") and bool(image.get_attribute("alt")), "Image did not load or lacks alt text."))
                    if width == 390:
                        page.screenshot(path=str(output / f"{slug}-{theme}-phone.png"))
                    if theme == "workshop" and width == 1280 and slug == SLUGS[0]:
                        page.screenshot(path=str(output / "first-guide-workshop-desktop.png"))

        page.set_viewport_size({"width": 390, "height": 844})
        visit("/guides/" + SLUGS[0])
        process = page.locator(".printer-process")
        check("printer diagram starts static", lambda: require("is-playing" not in process.get_attribute("class"), "Animation autoplayed."))
        page.get_by_role("button", name="Play layer build", exact=True).click()
        expect(process).to_have_class(re.compile(r"is-playing"))
        page.wait_for_function("!document.querySelector('.printer-process').classList.contains('is-playing')", timeout=4500)
        check("printer playback ends automatically", lambda: require("is-playing" not in process.get_attribute("class"), "Animation did not stop."))
        page.emulate_media(reduced_motion="reduce")
        page.get_by_role("button", name="Play layer build", exact=True).click()
        check("reduced motion keeps static equivalent", lambda: require(
            "is-playing" not in process.get_attribute("class") and "reduced motion" in process.get_by_role("status").inner_text(), "Reduced motion was ignored."))
        visit("/guides/" + SLUGS[2])
        check("household table states included cost categories", lambda: require("Material + electricity + equipment" in page.locator("table").inner_text(), "Cost heading hides exclusions."))
        visit("/guides/" + SLUGS[3])
        text = page.locator("article").first.inner_text()
        check("founder example identifies first Prusa", lambda: require("first-ever Prusa" in text and "first owned printer" in text, "Founder correction is absent."))
        visit("/")
        for slug in SLUGS:
            check("homepage links " + slug, lambda: require(page.locator(f'a[href="/guides/{slug}"]').count() > 0, "New guide not discoverable."))
        check("no unexpected runtime/console errors", lambda: require(not errors, repr(errors)[:800]))
        browser.close()

    result = {"engine": "chromium", "channel": args.channel, "browser_version": version,
              "viewports": ["320x844", "390x844", "1280x844"], "themes": ["light", "workshop", "dark", "system"],
              "passed": sum(c["passed"] for c in checks), "failed": sum(not c["passed"] for c in checks),
              "checks": checks, "local_integration_errors": local_errors, "errors": errors}
    (output / "results.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps({k: v for k, v in result.items() if k not in ["checks", "local_integration_errors"]}, indent=2))
    raise SystemExit(bool(result["failed"]))


if __name__ == "__main__":
    main()
