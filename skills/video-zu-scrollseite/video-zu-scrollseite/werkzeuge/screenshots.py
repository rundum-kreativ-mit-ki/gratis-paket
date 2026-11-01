"""Screenshots der Scroll-Seite an definierten Positionen, plus Fehlerprotokoll."""
import os, sys, json, pathlib
from playwright.sync_api import sync_playwright

URL = os.environ.get("SCROLLSEITE_URL", "http://127.0.0.1:3070/")
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "shots")
WIDTH, HEIGHT = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (1440, 900)
TAG = sys.argv[4] if len(sys.argv) > 4 else "desktop"

# Scroll-Fortschritt in Prozent und ein sprechender Name
STOPS = [
    (0.000, "00-anfang"),
    (0.040, "04"),
    (0.155, "16"),
    (0.315, "32"),
    (0.475, "48"),
    (0.615, "62"),
    (0.750, "75"),
    (0.870, "87"),
    (0.970, "97-ende"),
]

OUT.mkdir(parents=True, exist_ok=True)
console, failed = [], []

with sync_playwright() as p:
    # Optional: eigener Chromium-Browser per Umgebungsvariable SCROLLSEITE_CHROME.
    # Ohne Angabe nimmt Playwright sein eigenes Chromium
    # (einmalig installieren: python -m playwright install chromium).
    exe = os.environ.get("SCROLLSEITE_CHROME")
    browser = p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()
    page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT}, device_scale_factor=1)
    page.on("console", lambda m: console.append(f"{m.type}: {m.text}") if m.type in ("error", "warning") else None)
    page.on("requestfailed", lambda r: failed.append(f"{r.url} :: {r.failure}"))
    page.on("response", lambda r: failed.append(f"HTTP {r.status} {r.url}") if r.status >= 400 else None)

    page.goto(URL, wait_until="load")
    # warten bis der Loader durch ist
    page.wait_for_selector("#loader.done", timeout=120000)
    page.wait_for_timeout(1200)

    total = page.evaluate("document.getElementById('scroll-container').offsetHeight - window.innerHeight")
    for prog, name in STOPS:
        y = int(total * prog)
        page.evaluate(f"window.lenis.scrollTo({y}, {{immediate: true}})")
        page.wait_for_timeout(2400)
        page.screenshot(path=str(OUT / f"{TAG}-{name}.png"))

    # Overflow-Pruefung
    overflow = page.evaluate("""() => {
        const de = document.documentElement;
        return { scrollW: de.scrollWidth, clientW: de.clientWidth,
                 overflow: de.scrollWidth > de.clientWidth };
    }""")
    browser.close()

print(json.dumps({
    "viewport": f"{WIDTH}x{HEIGHT}",
    "scrollbereich_px": total,
    "overflow_horizontal": overflow,
    "console_fehler": console,
    "fehlgeschlagene_requests": failed,
    "bilder": sorted(f.name for f in OUT.glob(f"{TAG}-*.png")),
}, indent=2, ensure_ascii=False))
