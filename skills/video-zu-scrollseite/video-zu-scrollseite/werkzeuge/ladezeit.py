"""Misst, wie lange die Seite bis zum Start braucht, bei gedrosselter Verbindung."""
import os, sys, json, time
from playwright.sync_api import sync_playwright

# Optional: Pfad zu einem eigenen Chromium-Browser per Umgebungsvariable.
# Ohne Angabe nimmt Playwright sein eigenes Chromium
# (einmalig installieren: python -m playwright install chromium).
EXE = os.environ.get("SCROLLSEITE_CHROME") or None
URL = os.environ.get("SCROLLSEITE_URL", "http://127.0.0.1:3070/")

# Name, Durchsatz in Mbit/s, Latenz in ms
NETZE = [
    ("Glasfaser / WLAN daheim", 100, 10),
    ("gutes Mobilnetz (4G)",      9, 60),
    ("schwaches Mobilnetz",     1.6, 300),
]

ergebnis = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=EXE) if EXE else p.chromium.launch()
    for name, mbit, latenz in NETZE:
        pg = b.new_page(viewport={"width": 390, "height": 844})
        cdp = pg.context.new_cdp_session(pg)
        cdp.send("Network.enable")
        cdp.send("Network.emulateNetworkConditions", {
            "offline": False,
            "downloadThroughput": int(mbit * 1024 * 1024 / 8),
            "uploadThroughput": int(mbit * 1024 * 1024 / 8),
            "latency": latenz,
        })
        bytes_gesamt = {"n": 0}
        pg.on("response", lambda r: None)
        start = time.time()
        pg.goto(URL, wait_until="commit")
        # erstes Bild sichtbar
        pg.wait_for_function("() => window.__erstesBild === true", timeout=300000)
        erstes = time.time() - start
        pg.wait_for_selector("#loader.done", timeout=600000)
        fertig = time.time() - start
        transfer = pg.evaluate("""() => performance.getEntriesByType('resource')
            .reduce((s, r) => s + (r.transferSize || 0), 0)""")
        ergebnis.append({
            "netz": name,
            "erstes_bild_sichtbar_s": round(erstes, 1),
            "loader_weg_s": round(fertig, 1),
            "geladen_mb": round(transfer / 1024 / 1024, 1),
        })
        pg.close()
    b.close()

print(json.dumps(ergebnis, indent=2, ensure_ascii=False))
