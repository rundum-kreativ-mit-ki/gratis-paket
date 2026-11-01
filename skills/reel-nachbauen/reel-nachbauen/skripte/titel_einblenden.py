"""Blendet eine freigestellte Titelgrafik (PNG mit durchsichtigem Hintergrund) oben ins Reel ein.

Aufruf:
  py titel_einblenden.py "<reel.mp4>" "<titel.png>" "<reel-mit-titel.mp4>"
  py titel_einblenden.py "<reel.mp4>" "<titel.png>" "<ziel.mp4>" --bis 3.0 --oben 170 --breite 940

--bis    Sekunde, bis zu der der Titel steht (danach 0,4 s Ausblende), Standard 3,0
--oben   Abstand der Grafik vom oberen Rand in Pixeln, Standard 170 (frei von der Instagram-Kopfzeile)
--breite Breite der Grafik in Pixeln, Standard 940 (bei 1080 Bildbreite 70 Pixel Rand je Seite)
"""
import argparse
import subprocess
import sys
from pathlib import Path


def main() -> int:
    for strom in (sys.stdout, sys.stderr):
        try:
            strom.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass
    ap = argparse.ArgumentParser()
    ap.add_argument("reel", type=Path)
    ap.add_argument("titel", type=Path)
    ap.add_argument("ziel", type=Path)
    ap.add_argument("--bis", type=float, default=3.0)
    ap.add_argument("--oben", type=int, default=170)
    ap.add_argument("--breite", type=int, default=940)
    a = ap.parse_args()
    a.ziel.parent.mkdir(parents=True, exist_ok=True)
    ein, aus = 0.3, 0.4
    # Titel: freistellen erhalten (format=rgba), sanft ein- und ausblenden, mittig oben über das Video legen
    fil = (f"[1:v]format=rgba,scale={a.breite}:-1,fade=t=in:st=0:d={ein}:alpha=1,"
           f"fade=t=out:st={a.bis}:d={aus}:alpha=1[t];"
           f"[0:v][t]overlay=x=(W-w)/2:y={a.oben}:enable='lte(t,{a.bis + aus})':shortest=0,format=yuv420p[v]")
    befehl = ["ffmpeg", "-v", "error", "-y", "-i", str(a.reel), "-loop", "1", "-t", f"{a.bis + aus + 0.1}",
              "-i", str(a.titel), "-filter_complex", fil, "-map", "[v]", "-map", "0:a?", "-c:v", "libx264",
              "-crf", "18", "-preset", "medium", "-c:a", "copy", "-movflags", "+faststart", str(a.ziel)]
    subprocess.run(befehl, check=True)
    print(f"Reel mit Titel: {a.ziel} (Titel bis {a.bis:.1f} s, oben {a.oben} px, Breite {a.breite} px)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
