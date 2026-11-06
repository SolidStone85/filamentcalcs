"""Audit regressions against an isolated local FilamentCalcs server.

Usage: python scripts/verify-audit-browser.py --base-url http://127.0.0.1:3217
Requires the already-installed Python Playwright and browser runtimes.
"""
import argparse
import json
import re
from pathlib import Path

from playwright.sync_api import sync_playwright, expect


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:3217")
    parser.add_argument("--output", default="../evidence/browser")
    parser.add_argument("--baseline", action="store_true")
    parser.add_argument("--engine", choices=["chromium", "webkit"], default="chromium")
    parser.add_argument("--channel", default=None, help="Optional installed Chromium browser channel, e.g. chrome or msedge.")
    parser.add_argument("--local-production", action="store_true",
                        help="Record the unavailable local Vercel-hosted analytics script separately.")
    args = parser.parse_args()
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    checks = []
    local_integration_errors = []

    def check(name, action):
        try:
            action()
            checks.append({"name": name, "passed": True})
        except Exception as error:
            checks.append({"name": name, "passed": False, "error": str(error)[:600]})

    def require(condition, message):
        assert condition, message

    with sync_playwright() as p:
        launch_options = {"headless": True}
        if args.channel:
            launch_options["channel"] = args.channel
        browser = getattr(p, args.engine).launch(**launch_options)
        context = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=1)
        page = context.new_page()
        page.set_default_timeout(5000)
        page.set_default_navigation_timeout(90000)
        page_errors = []
        console_errors = []
        page.on("pageerror", lambda error: page_errors.append(str(error)))
        def record_console(message):
            if message.type != "error":
                return
            record = {"text": message.text, "url": message.location.get("url", "")}
            # A plain Next start server does not serve Vercel's injected analytics
            # endpoint. Diagnose and retain this exact local limitation; never
            # accept application JS errors or other missing assets as equivalent.
            if (args.local_production
                    and record["url"] == args.base_url.rstrip("/") + "/_vercel/insights/script.js"
                    and record["text"] == "Failed to load resource: the server responded with a status of 404 (Not Found)"):
                local_integration_errors.append(record)
            else:
                console_errors.append(record)
        page.on("console", record_console)
        page.goto(args.base_url + "/tools/failure-rate-calculator?s=9&f=1&g=5&p=20&c=USD", wait_until="networkidle", timeout=90000)
        check("failed-attempt consumption has an unambiguous input label", lambda: require(
            page.get_by_label("Average filament consumed per failed attempt", exact=True).count() == 1,
            "The average-weight input still describes an ordinary print."))
        check("early failure material is not charged as a full completed print", lambda: require(
            "10.0%" in page.locator("#calculator-results").inner_text()
            and "$0.10" in page.locator("#calculator-results").inner_text(),
            "9 successes, 1 failure using 5 g at $20/kg should show 10% and $0.10."))

        page.goto(args.base_url + "/guides/3d-print-time-expectations", wait_until="networkidle", timeout=90000)
        check("time calculations are clearly marked illustrative", lambda: require(
            page.get_by_role("heading", name="Illustrative time calculations", exact=True).count() == 1,
            "Guide still presents unverified named-printer performance as actual results."))
        check("time guide credits creator and license", lambda: require(
            "Subhashish Panigrahi" in page.locator("figcaption").inner_text()
            and page.locator('figcaption a[href="https://creativecommons.org/licenses/by-sa/3.0/"]').count() == 1,
            "Creator and linked image license are missing."))
        page.screenshot(path=str(output / "time-guide-phone.png"), full_page=True)

        page.goto(args.base_url + "/guides/why-3d-prints-fail", wait_until="networkidle", timeout=90000)
        body = page.locator("article").inner_text()
        check("failure guide agrees with calculator on unverified industry benchmarks", lambda: require(
            "no verified industry benchmark" in body.lower()
            and "print farms run at 2 to 4%" not in body.lower(),
            "Guide still asserts an unsupported industry failure range."))
        check("maintenance advice follows the printer-specific procedure", lambda: require(
            "1.5 Nm" not in body and "firm hand-tight" not in body,
            "Guide still supplies a universal hot nozzle tightening instruction."))

        if not args.baseline:
            for slug in ["3d-print-time-expectations", "why-3d-prints-fail"]:
                page.goto(args.base_url + "/guides/" + slug, wait_until="networkidle")
                graph = page.locator('article script[type="application/ld+json"]').evaluate(
                    "element => JSON.parse(element.textContent)['@graph']")
                article = next(item for item in graph if item["@type"] == "Article")
                faq = next(item for item in graph if item["@type"] == "FAQPage")
                visible = page.locator("article").inner_text()
                check(slug + ": schema and visible FAQs agree", lambda: require(
                    all(item["name"] in visible and item["acceptedAnswer"]["text"] in visible
                        for item in faq["mainEntity"]), "Visible FAQs differ from structured data."))
                check(slug + ": revision and canonical metadata agree", lambda: require(
                    article["dateModified"] == "2026-11-06"
                    and page.locator('meta[property="article:modified_time"]').get_attribute("content").startswith("2026-11-06")
                    and page.locator('link[rel="canonical"]').get_attribute("href") == "https://filamentcalcs.com/guides/" + slug,
                    "Revision or canonical metadata differs."))

            # Check existing URLs, including edge cases the original audit did
            # not establish as bugs. No claim that these cases needed repairs.
            cases = [
                ("9&f=1&g=5&p=20", "10.0%", "$0.10"),
                ("12&f=0&g=5&p=20", "0.0%", "$0.00"),
                ("0&f=12&g=5&p=20", "100.0%", "$1.20"),
                ("0&f=3&g=0&p=0", "100.0%", "$0.00"),
            ]
            for query, rate, cost in cases:
                page.goto(args.base_url + "/tools/failure-rate-calculator?s=" + query + "&c=USD", wait_until="networkidle")
                text = page.locator("#calculator-results").inner_text()
                check("failure URL " + query, lambda: require(rate in text and cost in text,
                    f"Expected {rate} and {cost}, got {text[:350]}"))

            for query in ["s=&f=1&g=5&p=20", "s=0&f=0&g=5&p=20", "s=-1&f=2&g=5&p=20",
                          "s=1.5&f=2&g=5&p=20", "s=9&f=1&g=&p=20", "s=9&f=1&g=5&p=",
                          "s=Infinity&f=1&g=5&p=20", "s=9&f=1&g=-5&p=20"]:
                page.goto(args.base_url + "/tools/failure-rate-calculator?" + query, wait_until="networkidle")
                text = page.locator("#calculator-results").inner_text()
                check("unavailable result for " + query, lambda: require(
                    not re.search(r"\d+(?:\.\d+)?%", text) and "NaN" not in text and "Infinity" not in text,
                    "Missing or invalid input produced a plausible rate or a nonfinite result."))

            page.goto(args.base_url + "/tools/failure-rate-calculator?s=9&f=1&g=5&p=20&c=USD", wait_until="networkidle")
            page.get_by_label("Average filament consumed per failed attempt", exact=True).fill("7")
            page.wait_for_function("new URL(location.href).searchParams.get('g') === '7'")
            expect(page.locator("#calculator-results")).to_contain_text("$0.14")
            page.reload(wait_until="networkidle")
            check("editing then reopening a shared failure URL preserves consumption and result", lambda: require(
                page.locator("#avg-grams").input_value() == "7" and "$0.14" in page.locator("#calculator-results").inner_text(),
                "Consumption or result changed after reopening the URL."))
            page.get_by_role("link", name="Details", exact=True).click()
            check("phone Details link reaches calculator results", lambda: require(
                page.evaluate("document.activeElement.id") == "calculator-results",
                "Details did not focus the result block."))
            page.screenshot(path=str(output / "failure-results-phone.png"))

            for query, expected in [("g=150&p=custom&t=20", "7h 30m"),
                                    ("g=119.8&p=custom&t=60", "2h 0m")]:
                page.goto(args.base_url + "/tools/print-time-estimator?" + query, wait_until="networkidle")
                check("time URL " + query, lambda: require(expected in page.locator("#calculator-results").inner_text(),
                    "Duration or rounded-minute carry differs."))
            for query in ["g=150&p=custom&t=0", "g=150&p=custom&t=", "g=-1&p=custom&t=20"]:
                page.goto(args.base_url + "/tools/print-time-estimator?" + query, wait_until="networkidle")
                text = page.locator("#calculator-results").inner_text()
                check("unavailable time for " + query, lambda: require(
                    not re.search(r"\d+h \d+m", text) and "NaN" not in text and "Infinity" not in text,
                    "Invalid throughput/weight produced a duration."))

            credits = {
                "3d-print-time-expectations": ("Subhashish Panigrahi", "CC BY-SA 3.0"),
                "why-3d-prints-fail": ("A7N8X", "CC0 1.0"),
                "3d-printer-electricity-usage": ("MukhtaromST", "CC0 1.0"),
                "3d-printing-cost-breakdown": ("Maurizio Pesce", "CC BY 2.0"),
                "best-3d-printer-under-300": ("Creative Tools", "CC BY 2.0"),
                "how-to-dry-filament": ("Kalle", "CC BY-SA 2.0"),
                "multi-color-printing-ams-worth-it": ("Benlisquare", "CC BY-SA 4.0"),
                "pla-vs-petg-vs-abs-vs-tpu": ("Haroldbarlow8911", "CC BY-SA 4.0"),
                "slicer-settings-that-waste-filament": ("Majkluss", "CC BY-SA 4.0"),
            }
            for width in [320, 390, 1280]:
                page.set_viewport_size({"width": width, "height": 844})
                for slug, (creator, license_name) in credits.items():
                    page.goto(args.base_url + "/guides/" + slug, wait_until="networkidle")
                    caption = page.locator("figcaption").inner_text()
                    check(f"{width}px {slug}: creator/source/license at image", lambda: require(
                        creator in caption and license_name in caption
                        and page.locator('figcaption a[rel~="license"]').count() == 1,
                        "Visible credit is missing creator, source or license."))
                    check(f"{width}px {slug}: no page-wide overflow", lambda: require(
                        page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"),
                        "Page overflows the viewport horizontally."))
                    if width == 390 and slug == "3d-print-time-expectations":
                        page.locator("table").screenshot(path=str(output / "illustrative-time-table-phone.png"))
                        page.locator("figure").screenshot(path=str(output / "time-image-credit-phone.png"))
                for path in ["/tools/failure-rate-calculator?s=9&f=1&g=5&p=20", "/tools/print-time-estimator?g=150&p=custom&t=20", "/glossary"]:
                    page.goto(args.base_url + path, wait_until="networkidle")
                    check(f"{width}px {path}: no page-wide overflow", lambda: require(
                        page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"),
                        "Calculator or glossary overflows the viewport."))

            page.set_viewport_size({"width": 390, "height": 844})
            page.goto(args.base_url + "/tools/failure-rate-calculator?s=9&f=1&g=5&p=20", wait_until="networkidle")
            for theme in ["dark", "light", "workshop"]:
                page.get_by_role("button", name="Choose color theme", exact=True).click()
                page.get_by_role("menuitemradio", name=theme.capitalize(), exact=True).click()
                page.wait_for_function("theme => document.documentElement.classList.contains(theme)", arg=theme)
                check(f"{theme} theme retains accessible failed-attempt input", lambda: require(
                    page.get_by_label("Average filament consumed per failed attempt", exact=True).count() == 1,
                    "Input label disappeared on theme change."))
                page.locator("#avg-grams").scroll_into_view_if_needed()
                page.screenshot(path=str(output / ("failure-input-" + theme + "-phone.png")))

            check("no unexpected browser runtime, console or hydration errors", lambda: require(
                not page_errors and not console_errors, repr(page_errors + console_errors)))

        browser.close()

    result = {"mode": "baseline" if args.baseline else "repair", "engine": args.engine, "channel": args.channel, "checks": checks,
              "passed": sum(c["passed"] for c in checks), "failed": sum(not c["passed"] for c in checks),
              "local_integration_errors": local_integration_errors}
    (output / "results.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))
    raise SystemExit(bool(result["failed"]))


if __name__ == "__main__":
    main()
