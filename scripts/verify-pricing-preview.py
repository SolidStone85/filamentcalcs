"""Browser checks for the Print Pricing redesign and the saved-currency fix.

Usage:
  python scripts/verify-pricing-preview.py --base-url http://127.0.0.1:3216 --output <dir>
  python scripts/verify-pricing-preview.py --base-url https://filamentcalcs.com --reproduce-old --output <dir>
  python scripts/verify-pricing-preview.py --base-url <url> --screenshots-only --label before --output <dir>

Every check runs in a fresh browser context, so saved settings never leak
between checks. Uses an installed Chrome or Edge; downloads nothing.
"""
import argparse
import json
import re
from pathlib import Path

from playwright.sync_api import sync_playwright

V2 = "filamentcalcs-settings-v2"
V1 = "filamentcalcs-settings-v1"
PRICING = "/tools/print-pricing-calculator"
FILAMENT = "/tools/filament-cost-calculator"
JOB1 = "m=4.5864&e=0.2&h=7.75&pp=350&pl=5000&f=8&lh=0.25&lr=15&mk=3&c=USD"
THEMES = ["light", "dark", "workshop"]
VIEWPORTS = [(320, 844), (390, 844), (1280, 900)]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:3216")
    parser.add_argument("--channel", default="chrome")
    parser.add_argument("--output", default="../filamentcalcs-preview-evidence")
    parser.add_argument("--label", default="after")
    parser.add_argument("--reproduce-old", action="store_true", help="Assert the OLD saved-currency behaviour is present (run against the live site).")
    parser.add_argument("--screenshots-only", action="store_true")
    parser.add_argument("--no-screenshots", action="store_true")
    args = parser.parse_args()
    base = args.base_url.rstrip("/")
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    checks, page_errors = [], []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel=args.channel)

        def new_page(width=390, height=844, theme=None, storage=None):
            context = browser.new_context(viewport={"width": width, "height": height})
            script = ""
            if theme:
                script += f"localStorage.setItem('theme', {json.dumps(theme)});"
            for key, value in (storage or {}).items():
                script += f"if (!sessionStorage.getItem('seeded')) localStorage.setItem({json.dumps(key)}, {json.dumps(json.dumps(value))});"
            if storage:
                script += "sessionStorage.setItem('seeded', '1');"
            if script:
                context.add_init_script(script)
            page = context.new_page()
            page.set_default_timeout(15000)
            page.on("pageerror", lambda e: page_errors.append(str(e)[:300]))
            return context, page

        def go(page, path, ready_key):
            page.goto(base + path, wait_until="domcontentloaded")
            # The calculator rewrites its own address once it is ready.
            page.wait_for_function("key => new URLSearchParams(location.search).has(key)", arg=ready_key)
            page.wait_for_timeout(250)

        class Text(str):
            """Page text compared without regard to case (headings are upper-cased by CSS)."""
            def __contains__(self, needle):
                return str(needle).lower() in self.lower()

        def results(page):
            return Text(re.sub(r"\s+", " ", page.locator("#calculator-results").inner_text()))

        def stored(page, key=V2):
            raw = page.evaluate("key => localStorage.getItem(key)", key)
            return json.loads(raw) if raw else None

        def open_setup(page):
            summary = page.locator("summary", has_text=re.compile("Printer, power and failures|Production assumptions"))
            if not page.locator("#printer-price").is_visible():
                summary.click()

        def choose_currency(page, code, trigger="#currency"):
            page.locator(trigger).click()
            page.get_by_role("option", name=re.compile(code)).click()
            page.wait_for_timeout(250)

        def remember(page):
            page.get_by_label("Remember my settings on this device").check()
            page.wait_for_timeout(250)

        def check(name, action, **kwargs):
            context, page = new_page(**kwargs)
            try:
                action(page)
                checks.append({"name": name, "passed": True})
            except Exception as error:  # noqa: BLE001 - every failure is recorded
                checks.append({"name": name, "passed": False, "error": str(error)[:600]})
            finally:
                context.close()

        def require(condition, message):
            if not condition:
                raise AssertionError(message)

        # ---------------------------------------------------------------
        def save_us_printer(page):
            go(page, f"{PRICING}?m=2.5&pp=1000&c=USD", "pl")
            remember(page)

        if args.reproduce_old:
            def old_typed_link(page):
                save_us_printer(page)
                require(stored(page, V1)["currency"] == "USD", "setup: currency should start as USD")
                go(page, f"{PRICING}?m=4.5864&c=CAD", "pl")
                open_setup(page)
                require(page.locator("#printer-price").input_value() == "1000", "expected the old page to reuse 1000")
                require("CA$1,000.00" in page.locator("summary").first.inner_text(), "expected CA$1,000.00 in the summary")
                require(stored(page, V1)["currency"] == "CAD", "expected the saved currency to flip to CAD on load")
            check("OLD BEHAVIOUR present: typed CAD link reuses US$1,000 and rewrites the saved currency", old_typed_link)

            def old_click_through(page):
                save_us_printer(page)
                go(page, f"{FILAMENT}?g=182", "sw")
                require(stored(page, V1).get("spoolPrice") == "20", "expected the example spool price to be saved on load")
                choose_currency(page, "CAD")
                page.get_by_role("link", name="Use this in print pricing").click()
                page.wait_for_url(re.compile("print-pricing-calculator"))
                page.wait_for_function("() => new URLSearchParams(location.search).has('pl')")
                open_setup(page)
                require(page.locator("#printer-price").input_value() == "1000", "expected the old page to reuse 1000")
            check("OLD BEHAVIOUR present: click-through from Filament Cost in CAD reuses US$1,000", old_click_through)

        elif not args.screenshots_only:
            # ---------------- Print Pricing: real quotes ----------------
            def handoff_and_precision(page):
                go(page, f"{FILAMENT}?g=182&pm=spool&sp=24&sw=1000&c=USD", "w")
                page.get_by_role("link", name="Use this in print pricing").click()
                page.wait_for_url(re.compile("print-pricing-calculator"))
                page.wait_for_function("() => new URLSearchParams(location.search).has('pl')")
                require(page.locator("#material").input_value() == "4.59", "field should show cents")
                require("m=4.5864" in page.url, "address should keep the unrounded cost")
                require("unrounded amount" in page.locator("#material-hint").inner_text(), "missing the full-precision note")
                require(page.locator("#print-time-hours").input_value() == "" and page.locator("#hands-on").input_value() == "", "times should start empty")
                text = results(page)
                require("No quote yet" in text and "$" not in text, f"no price expected yet: {text[:120]}")
                page.locator("#print-time-hours").fill("7")
                page.locator("#print-time-minutes").fill("45")
                require("No quote yet" in results(page), "still needs hands-on time")
                page.locator("#hands-on").fill("15")
                text = results(page)
                require("$21.13" in text and "Break-even $9.54" in text, f"expected $21.13 / $9.54: {text[:160]}")
                require("Before marketplace fees, shipping and packaging." in text, "missing the fees line")
                require("m=4.5864" in page.url and "h=7.75" in page.url and "lh=0.25" in page.url, f"address keys: {page.url}")
                # Focusing the field reveals the unrounded amount; then the visitor types over it.
                page.locator("#material").click()
                page.wait_for_timeout(200)
                require(page.locator("#material").input_value() == "4.5864", "focus should reveal the unrounded amount")
                page.locator("#material").fill("4.59")
                require("$21.14" in results(page), "a typed 4.59 is a different input and should give $21.14")
            check("Filament Cost handoff: empty times, full precision, $21.13 then $21.14 when 4.59 is typed", handoff_and_precision)

            def ams_handoff(page):
                go(page, "/tools/ams-purge-waste-calculator?mode=slicer&g=25&flush=3&pp=20&c=EUR", "c")
                link = page.get_by_role("link", name=re.compile("Use this material cost in print pricing"))
                href = link.get_attribute("href")
                link.click()
                page.wait_for_url(re.compile("print-pricing-calculator"))
                page.wait_for_function("() => new URLSearchParams(location.search).has('pl')")
                carried = re.search(r"[?&]m=([^&]+)", href).group(1)
                require(f"m={carried}" in page.url and "c=EUR" in page.url, f"AMS handoff changed: {page.url}")
                require(page.locator("#material").input_value() != "", "material cost should be carried")
                require("No quote yet" in results(page), "times should start empty after the AMS handoff")
            check("AMS Purge handoff: cost and currency carried, times empty", ams_handoff)

            def zero_versus_empty(page):
                go(page, f"{PRICING}?m=4.5864&h=7.75&c=USD", "pl")
                require("No quote yet" in results(page), "empty hands-on time must not price")
                page.locator("#hands-on").fill("0")
                text = results(page)
                require("$17.38" in text and "Your time (0 min at" in text, f"0 minutes should price at $17.38: {text[:200]}")
                require("lh=0" in page.url, "0 should be written to the address")
                page.locator("#hands-on").fill("")
                require("No quote yet" in results(page), "clearing the box should remove the price")
            check("Zero hands-on time prices at $17.38; an empty box does not price", zero_versus_empty)

            def example(page):
                go(page, PRICING, "pl")
                page.get_by_role("button", name="Try an example").first.click()
                text = results(page)
                require("Example job in US dollars. Sample numbers, not your quote." in text, "missing the example strip")
                require("Example price" in text and "$17.67" in text and "Suggested price" not in text, f"example labelling: {text[:160]}")
                require("ex=m.h.lh" in page.url, "example mark should travel in the link")
                page.get_by_role("button", name="Clear example").click()
                require("No quote yet" in results(page) and page.locator("#material").input_value() == "", "Clear example should empty the fields")
                # After a handoff the carried cost is never overwritten.
                go(page, f"{PRICING}?m=4.5864&c=USD", "pl")
                page.get_by_role("button", name="Try an example").first.click()
                require("m=4.5864" in page.url and page.locator("#material").input_value() == "4.59", "carried cost must be kept")
                text = results(page)
                require("Still using an example: print time 6 h, hands-on time 30 min." in text and "$24.48" in text, f"partial example: {text[:200]}")
                page.locator("#print-time-hours").fill("7")
                page.locator("#print-time-minutes").fill("45")
                require("Still using an example: hands-on time 30 min." in results(page), "one example field should remain marked")
                page.locator("#hands-on").fill("15")
                text = results(page)
                require("Suggested price" in text and "Example" not in text and "$21.13" in text, f"own numbers: {text[:160]}")
            check("Try an example: labelled, never overwrites a carried cost, clears field by field", example)

            def example_outside_usd(page):
                go(page, PRICING, "pl")
                require("c=EUR" in page.url, "the saved currency choice should apply")
                require(page.locator("#printer-price").input_value() == "", "saved US$1,000 must not be reused in EUR")
                page.get_by_role("button", name="Try an example").first.click()
                page.wait_for_timeout(250)
                require(page.locator("#material").input_value() == "", "a US-dollar sample must not be filled in EUR")
                require(page.locator("#print-time-hours").input_value() == "6" and page.locator("#hands-on").input_value() == "30", "the two times should be filled")
                require(re.search(r"[?&]m=(&|$)", page.url) and "ex=h.lh" in page.url, f"address: {page.url}")
                text = results(page)
                require("No quote yet" in text and "2.50" not in text and "17.67" not in text, f"no sample amount or price expected: {text[:200]}")
                require("In EUR the example fills the two times only" in text, "missing the explanation")
                require(page.get_by_role("button", name="Try an example").count() == 0, "nothing left for the example to fill")
                before = stored(page)
                require(before["money"] == {"USD": {"printerPrice": "1000"}}, f"record after the example: {before}")
                # The complete worked example stays available, labelled as US dollars.
                page.get_by_role("link", name="See the full example in US dollars").click()
                page.wait_for_function("() => new URLSearchParams(location.search).get('c') === 'USD'")
                page.wait_for_timeout(300)
                text = results(page)
                require("Example job in US dollars." in text and "Example price" in text and "$17.67" in text, f"full USD example: {text[:200]}")
                open_setup(page)
                require(page.locator("#printer-price").input_value() == "350", "the published example must not pick up a saved printer price")
                require(stored(page) == before, f"opening the example must not change the saved record: {stored(page)}")
            check("Outside USD: Try an example fills times only; full example opens in USD at $17.67 and saves nothing", example_outside_usd,
                  storage={V2: {"prefs": {"currency": "EUR"}, "money": {"USD": {"printerPrice": "1000"}}}})

            def example_then_switch(page):
                go(page, PRICING, "pl")
                page.get_by_role("button", name="Try an example").first.click()
                require("$17.67" in results(page), "USD example should price")
                choose_currency(page, "CAD")
                require(page.locator("#material").input_value() == "", "the US-dollar sample must come off the screen in CAD")
                text = results(page)
                require("CA$2.50" not in text and "No quote yet" in text, f"sample shown as CAD: {text[:200]}")
                require("Still using an example: print time 6 h, hands-on time 30 min." in text, "times should stay marked as examples")
                page.locator("#material").fill("3.1")
                choose_currency(page, "EUR")
                require(page.locator("#material").input_value() in ("3.1", "3.10"), "the visitor's own amount stays through a switch")
            check("USD example then currency switch: the sample amount is dropped, a typed amount stays", example_then_switch)

            def vela_scenario(page):
                # One disposable profile for all five steps; the saved record is read after each.
                usd_only = {"USD": {"printerPrice": "1000"}}
                # 1. Save a US$1,000 printer price.
                go(page, f"{PRICING}?c=USD", "pl")
                remember(page)
                open_setup(page)
                page.locator("#printer-price").fill("1000")
                page.wait_for_timeout(300)
                require(stored(page) == {"prefs": {"currency": "USD", "printerLifetimeHours": "5000"}, "money": usd_only}, f"step 1 record: {stored(page)}")
                # 2. A real CAD handoff carrying a precise material cost.
                go(page, f"{FILAMENT}?g=182&pm=spool&sp=24&sw=1000", "w")
                choose_currency(page, "CAD")
                page.get_by_role("link", name="Use this in print pricing").click()
                page.wait_for_url(re.compile("print-pricing-calculator"))
                page.wait_for_function("() => new URLSearchParams(location.search).has('pl')")
                page.wait_for_timeout(300)

                def cad_state(step):
                    require("c=CAD" in page.url and "m=4.5864" in page.url, f"{step}: address {page.url}")
                    require(page.locator("#material").input_value() == "4.59", f"{step}: material should display as 4.59")
                    require("CA$4.5864" in page.locator("#material-hint").inner_text(), f"{step}: full-precision note missing")
                    require(page.locator("#printer-price").is_visible() and page.locator("#printer-price").input_value() == "", f"{step}: printer price must be empty in CAD")
                    require(not page.locator("#printer-price").get_attribute("placeholder"), f"{step}: an empty CAD field must not show a US-dollar sample as a placeholder")
                    body = page.locator("body").inner_text()
                    require("Example amounts are US-dollar figures" not in body, f"{step}: no US-dollar example amount should be on a CAD quote")
                    require(page.locator("#labor-rate").input_value() == "" and page.locator("#electricity").input_value() == "", f"{step}: hourly rate and power must be empty in CAD")
                    require("Your saved printer price is $1,000.00 in USD, so it is not used here in CAD. Nothing is converted." in body, f"{step}: notice missing")
                    require("1,000" not in results(page) and "CA$1,000" not in page.locator("summary").first.inner_text(), f"{step}: CA$1,000 appeared")
                    saved = stored(page)
                    require(saved["money"] == usd_only, f"{step}: saved amounts changed: {saved}")
                    require(saved["prefs"]["currency"] == "CAD", f"{step}: the visitor chose CAD, so that preference is CAD: {saved}")

                cad_state("step 2")
                require(page.locator("#print-time-hours").input_value() == "" and page.locator("#hands-on").input_value() == "", "step 2: times should start empty")
                # 3. Try the example: times only, no US-dollar amount into any empty money field.
                page.get_by_role("button", name="Try an example").first.click()
                page.wait_for_timeout(300)
                cad_state("step 3")
                require(page.locator("#print-time-hours").input_value() == "6" and page.locator("#hands-on").input_value() == "30", "step 3: example times")
                text = results(page)
                require("Add your hourly rate to see a price." in text and "Suggested price" not in text and "Example price" not in text and "24.48" not in text, f"step 3: no price expected: {text[:240]}")
                # Explicit zero hands-on time.
                page.locator("#hands-on").fill("0")
                page.wait_for_timeout(300)
                require(re.search(r"[?&]lh=0(&|$)", page.url), f"step 3: zero should be written: {page.url}")
                # 4. Reload.
                page.reload(wait_until="domcontentloaded")
                page.wait_for_function("() => new URLSearchParams(location.search).has('pl')")
                page.wait_for_timeout(400)
                cad_state("step 4")
                require(page.locator("#hands-on").input_value() == "0", "step 4: zero must survive a reload as zero")
                require(page.locator("#print-time-hours").input_value() == "6", "step 4: print time kept")
                # 5. Switch back to USD.
                choose_currency(page, "USD")
                page.wait_for_timeout(300)
                require(page.locator("#printer-price").input_value() == "1000", "step 5: USD should still remember 1,000")
                require("m=4.5864" in page.url and "c=USD" in page.url, f"step 5: address {page.url}")
                text = results(page)
                require("$19.52" in text and "Your time (0 min at" in text, f"step 5: zero hands-on should price at $19.52 with the unrounded cost: {text[:240]}")
                saved = stored(page)
                require(saved["money"] == usd_only and saved["prefs"]["currency"] == "USD", f"step 5 record: {saved}")
                page.locator("#hands-on").fill("")
                page.wait_for_timeout(250)
                require("No quote yet" in results(page), "step 5: an empty hands-on box must not price")
                require(stored(page)["money"] == usd_only, "step 5: record after clearing")
            check("Vela's scenario: save US$1,000, CAD handoff, example, zero, reload, back to USD", vela_scenario)

            def fresh_cad_quote(page):
                # Material and real times, but no CAD rates: no price until the visitor enters their own.
                go(page, f"{PRICING}?m=4.5864&c=CAD", "pl")
                page.locator("#print-time-hours").fill("6")
                page.locator("#hands-on").fill("30")
                page.wait_for_timeout(250)
                text = results(page)
                require("No quote yet" in text and "Suggested price" not in text and "24.48" not in text, f"a CAD price was shown from US-dollar examples: {text[:240]}")
                require("Add your hourly rate to see a price." in text and "Enter these in CAD. The US-dollar examples are not used here." in text, f"missing guidance: {text[:300]}")
                bar = page.locator("div.sticky").first.inner_text()
                require("Add your hourly rate" in bar and "CA$" not in bar, f"top bar: {bar!r}")
                for selector in ["#labor-rate", "#printer-price", "#electricity"]:
                    field = page.locator(selector)
                    require(field.is_visible() and field.input_value() == "" and not field.get_attribute("placeholder"), f"{selector} should be visible, empty and without a sample hint")
                require(page.locator("#printer-lifetime").input_value() == "5000", "non-money examples stay")
                require("Example amounts are US-dollar figures" not in page.locator("body").inner_text(), "no US-dollar example should remain")
                # The visitor's own CAD amounts.
                page.locator("#labor-rate").fill("20")
                require("Add printer price to see a price." in results(page), "printer price still needed")
                page.locator("#printer-price").fill("500")
                require("Add power cost to see a price." in results(page), "power cost still needed")
                page.locator("#electricity").fill("0")
                page.wait_for_timeout(250)
                text = results(page)
                require("Suggested price" in text and "CA$26.91" in text, f"own CAD amounts with zero power should give CA$26.91: {text[:200]}")
                page.locator("#labor-rate").fill("0")
                require("CA$16.91" in results(page), "a zero hourly rate is an answer")
                # Reload keeps the answers, zero included.
                page.reload(wait_until="domcontentloaded")
                page.wait_for_function("() => new URLSearchParams(location.search).has('pl')")
                page.wait_for_timeout(400)
                require("CA$16.91" in results(page) and page.locator("#electricity").input_value() == "0", "the quote should survive a reload")
                open_setup(page)
                page.locator("#electricity").fill("")
                page.wait_for_timeout(250)
                require("No quote yet" in results(page) and "Add power cost" in results(page), "an empty power cost must not price")
            check("Fresh CAD quote: no price from US-dollar examples; own CAD rates give CA$26.91; zero counts", fresh_cad_quote)

            def explicit_cad_defaults(page):
                go(page, f"{PRICING}?m=4.5864&h=6&lh=0.5&c=CAD", "pl")
                page.locator("#labor-rate").fill("15")
                page.locator("#printer-price").fill("350")
                page.locator("#electricity").fill("0.2")
                page.wait_for_timeout(250)
                require("Suggested price" in results(page) and "CA$24.48" in results(page), "explicit CAD amounts equal to USD examples should price")
                require(stored(page)["money"] == {"USD": {"printerPrice": "1000"}, "CAD": {"printerPrice": "350"}}, f"explicit CAD 350 was not saved: {stored(page)}")
                page.reload(wait_until="domcontentloaded")
                page.wait_for_timeout(350)
                require(page.locator("#printer-price").input_value() == "350", "explicit CAD 350 must survive reload")
                require(stored(page)["money"]["USD"]["printerPrice"] == "1000", "the USD amount must remain")
            check("Explicit CAD rates equal to USD examples price and the CAD printer amount survives reload", explicit_cad_defaults,
                  storage={V2: {"prefs": {"currency": "USD"}, "money": {"USD": {"printerPrice": "1000"}}}})
            def remember_after_cad_entry(page):
                go(page, f"{PRICING}?m=4.5864&h=6&lh=0.5&c=CAD", "pl")
                page.locator("#labor-rate").fill("15")
                page.locator("#printer-price").fill("350")
                page.locator("#electricity").fill("0.2")
                remember(page)
                require(stored(page)["money"]["CAD"]["printerPrice"] == "350", "Remember must save the explicitly typed CAD 350")
                page.reload(wait_until="domcontentloaded")
                page.wait_for_timeout(350)
                require(page.locator("#printer-price").input_value() == "350", "the explicitly typed CAD price must survive reload")
            check("Remember enabled after typing CAD 350 keeps the genuine amount", remember_after_cad_entry)
            def switch_untouched_examples(page):
                go(page, f"{PRICING}?m=4.5864&h=6&lh=0.5&c=USD", "pl")
                require(page.locator("#labor-rate").input_value() == "15" and page.locator("#electricity").input_value() == "0.2", "USD keeps its editable examples")
                require(page.locator("#printer-price").input_value() == "", "a CAD printer price is not used in USD")
                require("Your saved printer price is CA$1,300.00 in CAD, so it is not used here in USD." in page.locator("body").inner_text(), "missing the notice in USD")
                choose_currency(page, "CAD")
                require(page.locator("#printer-price").input_value() == "1300", "the saved CAD printer price should be offered")
                require(page.locator("#labor-rate").input_value() == "" and page.locator("#electricity").input_value() == "", "untouched US-dollar examples must be emptied in CAD")
                require("No quote yet" in results(page), "no CAD price from US-dollar examples")
                require(stored(page)["money"] == {"CAD": {"printerPrice": "1300"}}, f"the saved CAD amount must be kept: {stored(page)}")
                choose_currency(page, "USD")
                require(page.locator("#labor-rate").input_value() == "15" and page.locator("#electricity").input_value() == "0.2", "USD examples return")
                require(page.locator("#printer-price").input_value() == "", "a CAD printer price is not used in USD")
                require(stored(page)["money"] == {"CAD": {"printerPrice": "1300"}}, f"record after switching back: {stored(page)}")
            check("Menu switch from USD: untouched examples are emptied, a saved CAD price is offered and kept", switch_untouched_examples,
                  storage={V2: {"prefs": {"currency": "USD"}, "money": {"CAD": {"printerPrice": "1300"}}}})

            def electricity_switch(page):
                go(page, "/tools/electricity-cost-calculator", "c")
                choose_currency(page, "EUR")
                require(page.locator("#custom-rate").input_value() == "0.4321", "the saved EUR rate should be offered after switching to EUR")
                require(stored(page)["money"] == {"EUR": {"electricityRate": "0.4321"}}, f"the saved EUR rate must not be deleted: {stored(page)}")
            check("Electricity: switching currency offers the saved rate for that currency and keeps it", electricity_switch,
                  storage={V2: {"prefs": {"currency": "USD"}, "money": {"EUR": {"electricityRate": "0.4321"}}}})

            def old_links(page):
                go(page, f"{PRICING}?m=2.5&e=0.2&h=6&pp=350&pl=5000&f=8&lh=0.5&lr=15&mk=3&c=USD", "pl")
                require("$17.67" in results(page), "worked example link should give $17.67")
                require(page.locator("#print-time-hours").input_value() == "6" and page.locator("#print-time-minutes").input_value() == "0", "6 h 0 min")
                require(page.locator("#hands-on").input_value() == "30", "30 min")
                go(page, f"{PRICING}?m=4.5864&e=0.2&h=6&pp=350&pl=5000&f=8&lh=0.5&lr=15&mk=3&c=USD", "pl")
                require("$24.48" in results(page), "Vela's case should still give $24.48")
                go(page, f"{PRICING}?m=5.192&e=0.2&h=11.33&pp=350&pl=5000&f=8&lh=0.33&lr=15&mk=3&c=USD", "pl")
                require("$25.12" in results(page), "decimal-hour link should give $25.12")
                require(page.locator("#print-time-hours").input_value() == "11" and page.locator("#print-time-minutes").input_value() == "19.8", "11 h 19.8 min")
                require(page.locator("#hands-on").input_value() == "19.8", "19.8 min")
                require("h=11.33" in page.url and "lh=0.33" in page.url, "old values must not be rewritten")
            check("Existing full links open with the same prices and are not rewritten", old_links)

            def long_print(page):
                go(page, f"{PRICING}?m=10&c=USD", "pl")
                page.locator("#print-time-hours").fill("26")
                page.locator("#print-time-minutes").fill("30")
                page.locator("#hands-on").fill("20")
                require("h=26.5" in page.url and "Printer wear (26 h 30 min)" in results(page), "26 h 30 min should be accepted")
            check("Prints over a day are accepted (26 h 30 min)", long_print)

            # ---------------- Saved amounts and currency ----------------
            def x1(page):
                save_us_printer(page)
                require(stored(page) == {"prefs": {"currency": "USD", "printerLifetimeHours": "5000"}, "money": {"USD": {"printerPrice": "1000"}}}, f"saved record: {stored(page)}")
                before = stored(page)
                go(page, f"{PRICING}?m=4.5864&c=CAD", "pl")
                require(page.locator("#printer-price").is_visible(), "the group holding the empty amount should open itself")
                require(page.locator("#printer-price").input_value() == "", "saved US$1,000 must not be reused in CAD")
                page_text = page.locator("body").inner_text()
                require("Your saved printer price is $1,000.00 in USD, so it is not used here in CAD. Nothing is converted." in page_text, "missing the notice")
                require("1,000" not in results(page) and "CA$1,000" not in page.locator("summary").first.inner_text(), "CA$1,000 must not appear")
                require(stored(page) == before, f"loading must not change the saved record: {stored(page)}")
                page.locator("#print-time-hours").fill("6")
                page.locator("#hands-on").fill("30")
                text = results(page)
                require("Add your hourly rate to see a price." in text and "Printer price" in text, f"the missing amounts should be named: {text[:240]}")
                go(page, f"{PRICING}?m=4.5864&c=USD", "pl")
                open_setup(page)
                require(page.locator("#printer-price").input_value() == "1000", "X3: the USD amount should return in USD")
            check("X1/X3: typed CAD link does not reuse US$1,000; says why; saved record unchanged; returns in USD", x1)

            def x2(page):
                save_us_printer(page)
                go(page, f"{FILAMENT}?g=182", "sw")
                require(stored(page)["money"] == {"USD": {"printerPrice": "1000"}}, f"X7: loading saved something: {stored(page)}")
                choose_currency(page, "CAD")
                require("example price is a US-dollar figure" in page.locator("body").inner_text(), "missing the example caption")
                link = page.get_by_role("link", name="Use this in print pricing")
                href = link.get_attribute("href")
                link.click()
                page.wait_for_url(re.compile("print-pricing-calculator"))
                page.wait_for_function("() => new URLSearchParams(location.search).has('pl')")
                require(page.locator("#printer-price").input_value() == "", "saved US$1,000 must not be reused after the click-through")
                require("is $1,000.00 in USD, so it is not used here in CAD" in page.locator("body").inner_text(), "missing the notice")
                saved = stored(page)
                require(saved["money"] == {"USD": {"printerPrice": "1000"}}, f"the USD amount must stay in USD: {saved}")
                require(saved["prefs"]["currency"] == "CAD", "the visitor chose CAD, so that preference updates")
                carried = re.search(r"[?&]m=([^&]+)", href).group(1)
                require(f"m={carried}" in page.url and "c=CAD" in page.url, f"handoff link changed: {page.url}")
            check("X2/X7: click-through in CAD does not reuse US$1,000; loading saves nothing", x2)

            def x4_x5(page):
                save_us_printer(page)
                before = stored(page)
                go(page, f"{PRICING}?m=2.5&pp=800&c=CAD", "pl")
                open_setup(page)
                require(page.locator("#printer-price").input_value() == "800", "X4: an amount in the link wins")
                require(stored(page) == before, "X4: saved record unchanged")
                page.locator("#printer-price").fill("1300")
                page.wait_for_timeout(250)
                require(stored(page)["money"] == {"USD": {"printerPrice": "1000"}, "CAD": {"printerPrice": "1300"}}, f"X5: per-currency amounts: {stored(page)}")
                go(page, f"{PRICING}?m=2.5&c=USD", "pl")
                open_setup(page)
                require(page.locator("#printer-price").input_value() == "1000", "X5: USD shows 1,000")
                go(page, f"{PRICING}?m=2.5&c=CAD", "pl")
                open_setup(page)
                require(page.locator("#printer-price").input_value() == "1300", "X5: CAD shows 1,300")
            check("X4/X5: a linked amount wins; amounts are remembered per currency", x4_x5)

            def x6(page):
                go(page, PRICING, "pl")
                open_setup(page)
                require(page.locator("#printer-price").input_value() == "", "an old amount must not be applied, and no US-dollar example either")
                require(page.locator("#printer-lifetime").input_value() == "4000", "non-money preferences should survive")
                require("c=CAD" in page.url, "the saved currency choice should survive")
                require("Prices saved by an earlier version are no longer used" in page.locator("body").inner_text(), "missing the old-record notice")
                require(stored(page, V1) == {"currency": "CAD", "printerPrice": "1000", "printerLifetimeHours": "4000"}, "the old record must be left untouched")
                require(stored(page) is None, "nothing should be written on load")
            check("X6: an old saved record's amounts are not read; other preferences survive; record untouched", x6,
                  storage={V1: {"currency": "CAD", "printerPrice": "1000", "printerLifetimeHours": "4000"}})

            def x8(page):
                go(page, PRICING, "pl")
                remember(page)
                require(stored(page)["money"] == {}, f"examples must not be saved: {stored(page)}")
                open_setup(page)
                page.locator("#printer-price").fill("1000")
                page.wait_for_timeout(250)
                require(stored(page)["money"] == {"USD": {"printerPrice": "1000"}}, "typed amount saved under USD")
                choose_currency(page, "CAD")
                require(page.locator("#printer-price").input_value() == "1000", "an amount typed this visit stays on screen")
                require(stored(page)["money"] == {"CAD": {"printerPrice": "1000"}}, f"it should now be held under CAD only: {stored(page)}")
                go(page, PRICING, "pl")
                open_setup(page)
                require("c=CAD" in page.url and page.locator("#printer-price").input_value() == "1000", "reopened page should show CA$1,000")
                require("so it is not used here" not in page.locator("body").inner_text(), "no notice expected")
            check("X8: type first, choose currency after: the amount follows the chosen currency", x8)

            def menu_switch(page):
                save_us_printer(page)
                go(page, f"{PRICING}?m=2.5", "pl")
                open_setup(page)
                require(page.locator("#printer-price").input_value() == "1000", "saved amount should load in USD")
                choose_currency(page, "CAD")
                require(page.locator("#printer-price").input_value() == "", "a saved USD amount comes off the screen in CAD")
                require("is $1,000.00 in USD" in page.locator("body").inner_text(), "missing the notice")
                choose_currency(page, "USD")
                require(page.locator("#printer-price").input_value() == "1000", "switching back restores it")
                require(stored(page)["money"] == {"USD": {"printerPrice": "1000"}}, f"record: {stored(page)}")
            check("Currency menu: a saved amount is withheld in the new currency and restored on the way back", menu_switch)

            saved_price = {V2: {"prefs": {"currency": "USD"}, "money": {"USD": {"pricePerKg": "24", "electricityRate": "0.4321"}}}}
            for name, path, ready, selector, eur in [
                ("Failure Rate", "/tools/failure-rate-calculator", "p", "#price", "c=EUR"),
                ("AMS Purge", "/tools/ams-purge-waste-calculator", "pp", "#ams-price", "c=EUR"),
                ("Length Converter", "/tools/filament-length-converter", "dia", "#price", "cur=EUR"),
                ("Remaining Filament", "/tools/remaining-spool-calculator", "p", "#price", "cur=EUR"),
            ]:
                def other(page, path=path, ready=ready, selector=selector, eur=eur, name=name):
                    go(page, path, ready)
                    field = page.locator(selector)
                    require(field.count() == 1, f"{name}: price field {selector} not found")
                    require(field.input_value() == "24", f"{name}: saved USD price should load in USD, got {field.input_value()!r}")
                    go(page, f"{path}?{eur}", ready)
                    require(page.locator(selector).input_value() == "", f"{name}: saved USD price must not be reused in EUR")
                    require(not page.locator(selector).get_attribute("placeholder"), f"{name}: the withheld field must not show a sample hint")
                    require("is $24.00 in USD, so it is not used here in EUR" in page.locator("body").inner_text(), f"{name}: missing the notice")
                    require(stored(page) == saved_price[V2], f"{name}: loading changed the saved record")
                check(f"{name}: saved USD price loads in USD, is withheld in EUR with a notice", other, storage=saved_price)

            def electricity(page):
                go(page, "/tools/electricity-cost-calculator?r=custom&c=EUR", "rt")
                require("0.4321" not in page.locator("body").inner_text(), "saved USD rate must not appear in EUR")
                require(stored(page) == saved_price[V2], "loading changed the saved record")
            check("Electricity: a saved USD custom rate is not reused in EUR", electricity, storage=saved_price)

            # ---------------- Layout, themes, untouched calculators ----------------
            for width, height in VIEWPORTS:
                for theme in THEMES:
                    def layout(page, width=width, theme=theme):
                        for path, ready in [(f"{PRICING}?{JOB1}", "pl"), (f"{PRICING}?m=4.5864&c=USD", "pl"), (f"{FILAMENT}?g=182&pm=spool&sp=24&sw=1000&c=USD", "w")]:
                            go(page, path, ready)
                            overflow = page.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
                            require(overflow <= 0, f"sideways scroll of {overflow}px on {path}")
                            applied = page.evaluate("() => document.documentElement.className")
                            require(theme in applied, f"theme {theme} not applied: {applied!r}")
                        go(page, f"{PRICING}?{JOB1}", "pl")
                        require("$21.13" in results(page), "price missing")
                        if width < 1024:
                            bar = page.locator("div.sticky").first.inner_text()
                            require("$21.13" in bar and "Break-even $9.54" in bar, f"top bar: {bar!r}")
                    check(f"Layout {width}px, {theme}: no sideways scroll, theme applied, price shown", layout, width=width, height=height, theme=theme)

            cad_saved = {V2: {"prefs": {"currency": "USD"}, "money": {"USD": {"printerPrice": "1000"}}}}
            for theme in THEMES:
                def narrow_cad(page, theme=theme):
                    go(page, f"{PRICING}?m=4.5864&c=CAD", "pl")
                    page.get_by_role("button", name="Try an example").first.click()
                    page.wait_for_timeout(300)
                    require(theme in page.evaluate("() => document.documentElement.className"), f"theme {theme} not applied")
                    text = results(page)
                    require("In CAD the example fills the two times only" in text and "Add your hourly rate to see a price." in text, f"CAD example state: {text[:200]}")
                    require(page.get_by_role("link", name="See the full example in US dollars").is_visible(), "USD example link not visible")
                    require("is $1,000.00 in USD, so it is not used here in CAD" in page.locator("body").inner_text(), "notice missing")
                    overflow = page.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
                    require(overflow <= 0, f"sideways scroll of {overflow}px")
                    clipped = page.evaluate("""() => [...document.querySelectorAll('#calculator-results *, #printer-price, #material')]
                        .filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > window.innerWidth + 0.5 || r.left < -0.5); }).length""")
                    require(clipped == 0, f"{clipped} elements run off the screen")
                check(f"Layout 320px, {theme}: CAD handoff after the example fits with notice and USD link", narrow_cad,
                      width=320, height=844, theme=theme, storage=cad_saved)

            def pricing_slider_labels(page):
                go(page, f"{PRICING}?{JOB1}", "pl")
                markup = page.get_by_role("slider", name="Markup", exact=True)
                require(markup.count() == 1, "markup thumb needs its accessible name")
                markup.focus()
                markup.press("ArrowRight")
                page.wait_for_timeout(250)
                require(new_query_value(page, "mk") != "3", "keyboard markup adjustment must update the quote input")
                open_setup(page)
                failure = page.get_by_role("slider", name="Failure rate", exact=True)
                require(failure.count() == 1, "failure thumb needs its accessible name")
                failure.focus()
                failure.press("ArrowRight")
                page.wait_for_timeout(250)
                require(new_query_value(page, "f") == "9", "keyboard failure adjustment must update the quote input")
            def new_query_value(page, key):
                return page.evaluate("key => new URLSearchParams(location.search).get(key)", key)
            check("Pricing sliders retain accessible names and keyboard behavior without PR #1's API", pricing_slider_labels)
            def untouched(page):
                go(page, "/tools/print-time-estimator?g=120", "p")
                require(re.search(r"\d+h \d+m", page.locator("#calculator-results").inner_text()), "print time estimator should still estimate")
                go(page, "/tools/enough-filament-calculator", "w")
                require(page.locator("#calculator-results").count() == 1, "enough-filament calculator should render")
                go(page, f"{FILAMENT}?g=500&pm=kg&p=20&w=0.05&c=USD", "sw")
                text = results(page)
                require("$10.50" in text and "Cost per gram (with waste)" in text and "Filament price alone: $0.0200/g" in text, f"filament cost: {text[:200]}")
                bar = page.locator("div.sticky").first.inner_text()
                require("Includes 5% extra waste" in bar and page.get_by_role("link", name="Edit extra waste allowance").count() == 1, "approved mobile waste summary and Edit action must be present")
            check("Other calculators still work; mobile waste summary included; per-gram tile relabelled", untouched)

        # ---------------- Screenshots for side-by-side review ----------------
        if not args.no_screenshots and not args.reproduce_old:
            shots = output / args.label
            shots.mkdir(parents=True, exist_ok=True)
            pages = [
                ("pricing-from-handoff", f"{PRICING}?m=4.5864&c=USD", "pl"),
                ("pricing-filled", f"{PRICING}?{JOB1}", "pl"),
                ("filament-cost", f"{FILAMENT}?g=182&pm=spool&sp=24&sw=1000&c=USD", "w"),
            ]
            for width, height in [(390, 844), (1280, 900)]:
                for theme in THEMES:
                    context, page = new_page(width=width, height=height, theme=theme)
                    try:
                        for name, path, ready in pages:
                            go(page, path, ready)
                            page.wait_for_timeout(400)
                            page.locator("div.grid.gap-6").first.screenshot(path=str(shots / f"{name}-{width}-{theme}.png"))
                    except Exception as error:  # noqa: BLE001
                        checks.append({"name": f"screenshot {width} {theme}", "passed": False, "error": str(error)[:300]})
                    finally:
                        context.close()

        version = browser.version
        browser.close()

    failed = [c for c in checks if not c["passed"]]
    report = {"base_url": base, "browser": version, "passed": len(checks) - len(failed), "failed": len(failed), "page_errors": page_errors, "checks": checks}
    name = "reproduce-old.json" if args.reproduce_old else f"checks-{args.label}.json"
    (output / name).write_text(json.dumps(report, indent=2), encoding="utf-8")
    for c in checks:
        print(("PASS  " if c["passed"] else "FAIL  ") + c["name"] + ("" if c["passed"] else "\n      " + c.get("error", "")))
    print(f"\n{report['passed']} passed, {report['failed']} failed, {len(page_errors)} page errors, {version}")
    raise SystemExit(1 if failed or page_errors else 0)


if __name__ == "__main__":
    main()
