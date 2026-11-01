"""Baut aus einem Video einen Kontaktbogen (Raster aus Standbildern mit Zeitstempel), zum Prüfen.

Aufruf:
  py kontaktbogen.py "<video>" "<bild.jpg>"                       ganzes Video, 2 Bilder pro Sekunde
  py kontaktbogen.py "<video>" "<bild.jpg>" --ab 8.2 --dauer 2 --fps 5   Ausschnitt genauer
  py kontaktbogen.py "<video>" "<bild.jpg>" --ab 5.4 --dauer 0.1 --fps 1 --breite 1080   ein Bild in voller Größe
"""
import argparse
import math
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


def dauer(video: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(video)],
                       capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


def main() -> int:
    for strom in (sys.stdout, sys.stderr):
        try:
            strom.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass
    ap = argparse.ArgumentParser()
    ap.add_argument("video", type=Path)
    ap.add_argument("bild", type=Path)
    ap.add_argument("--ab", type=float, default=0.0)
    ap.add_argument("--dauer", type=float, default=None)
    ap.add_argument("--fps", type=float, default=2.0)
    ap.add_argument("--breite", type=int, default=180, help="Breite je Bild in Pixeln, 1080 für volle Größe")
    a = ap.parse_args()
    lang = a.dauer if a.dauer is not None else dauer(a.video) - a.ab
    anzahl = max(1, math.ceil(lang * a.fps))
    spalten = 10 if anzahl > 12 else anzahl
    zeilen = math.ceil(anzahl / spalten)
    a.bild.parent.mkdir(parents=True, exist_ok=True)
    # Schrift für den Zeitstempel: eine Schriftdatei neben das Arbeitsverzeichnis kopieren (vermeidet Pfadprobleme)
    kandidaten = [Path(r"C:\Windows\Fonts\arial.ttf"), Path("/System/Library/Fonts/Supplemental/Arial.ttf"),
                  Path("/Library/Fonts/Arial.ttf")]
    schrift = next((k for k in kandidaten if k.exists()), None)
    with tempfile.TemporaryDirectory() as tmp:
        stempel = ""
        if schrift:
            shutil.copy(schrift, Path(tmp) / "schrift.ttf")
            # Offset, damit der Stempel die echte Videozeit zeigt und nicht ab 0 zählt
            stempel = (f",drawtext=fontfile=schrift.ttf:text='%{{pts\\:hms\\:{a.ab}}}':x=4:y=4:fontsize=16:"
                       "fontcolor=yellow:box=1:boxcolor=black")
        # format=yuvj420p: der JPEG-Encoder braucht vollen Farbumfang, sonst scheitert er an fertig geschnittenen Videos
        vf = f"fps={a.fps},scale={a.breite}:-2{stempel},tile={spalten}x{zeilen},format=yuvj420p"
        befehl = ["ffmpeg", "-v", "error", "-y", "-ss", str(a.ab), "-t", f"{lang:.3f}", "-i", str(a.video.resolve()),
                  "-vf", vf, "-frames:v", "1", str(a.bild.resolve())]
        subprocess.run(befehl, check=True, cwd=tmp)
    print(f"Kontaktbogen: {a.bild} ({anzahl} Bilder, ab {a.ab:.1f} s, {a.fps:g} pro Sekunde)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
