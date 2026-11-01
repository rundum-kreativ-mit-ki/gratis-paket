"""Schneidet aus einem Figurenblatt die Vorderansicht als Einzelbild für Seedance aus.

Aufruf:
  py ausschnitt.py "<figurenblatt.png>" "<ziel.jpg>" --art tier      Tier-Blatt: linkes Viertel, obere 42 %
  py ausschnitt.py "<figurenblatt.png>" "<ziel.jpg>" --art mensch    Menschen-Blatt: linkes Sechstel, obere 88 %
  py ausschnitt.py "<figurenblatt.png>" "<ziel.jpg>" --x 0 --y 0 --b 0.25 --h 0.42   eigene Anteile

Danach das Ergebnis immer ansehen: genau eine Figur, nicht angeschnitten.
"""
import argparse
import subprocess
import sys
from pathlib import Path

# Standardausschnitte je Blattart (Anteile von Breite und Höhe), aus dem Testlauf vom 12.10.2026
ARTEN = {"tier": (0.0, 0.0, 0.25, 0.42), "mensch": (0.0, 0.0, 0.165, 0.88)}


def main() -> int:
    for strom in (sys.stdout, sys.stderr):
        try:
            strom.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass
    ap = argparse.ArgumentParser()
    ap.add_argument("blatt", type=Path)
    ap.add_argument("ziel", type=Path)
    ap.add_argument("--art", choices=sorted(ARTEN), default="tier")
    ap.add_argument("--x", type=float)
    ap.add_argument("--y", type=float)
    ap.add_argument("--b", type=float)
    ap.add_argument("--h", type=float)
    a = ap.parse_args()
    x, y, b, h = ARTEN[a.art]
    x = a.x if a.x is not None else x
    y = a.y if a.y is not None else y
    b = a.b if a.b is not None else b
    h = a.h if a.h is not None else h
    a.ziel.parent.mkdir(parents=True, exist_ok=True)
    vf = f"crop=iw*{b}:ih*{h}:iw*{x}:ih*{y}"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(a.blatt), "-vf", vf, "-q:v", "2", str(a.ziel)], check=True)
    print(f"Einzelbild: {a.ziel} (Art {a.art}, Ausschnitt x {x}, y {y}, Breite {b}, Höhe {h})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
