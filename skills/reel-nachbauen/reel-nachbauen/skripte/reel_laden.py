"""Lädt ein Reel über seinen Link in einen Ordner, nur zum Ansehen und Analysieren.

Aufruf: py reel_laden.py "<link>" "<zielordner>"
Rückgabewert 0 = geladen (Pfad wird ausgegeben), 1 = nicht geladen (dann den Weg von Hand nehmen).
"""
import subprocess
import sys
from pathlib import Path


def main() -> int:
    for strom in (sys.stdout, sys.stderr):
        try:
            strom.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass
    if len(sys.argv) != 3:
        print('Aufruf: reel_laden.py "<link>" "<zielordner>"')
        return 1
    link, ziel = sys.argv[1], Path(sys.argv[2])
    ziel.mkdir(parents=True, exist_ok=True)
    vorlage = str(ziel / "vorbild.%(ext)s")
    befehl = ["yt-dlp", "-f", "mp4/best", "--no-playlist", "--write-info-json", "-o", vorlage, link]
    try:
        r = subprocess.run(befehl, capture_output=True, text=True, timeout=300)
    except (OSError, subprocess.SubprocessError) as e:
        print(f"yt-dlp lief nicht: {e}")
        return 1
    videos = sorted(ziel.glob("vorbild.*"), key=lambda p: p.stat().st_mtime)
    videos = [v for v in videos if v.suffix.lower() in (".mp4", ".mov", ".webm", ".mkv")]
    if r.returncode != 0 or not videos:
        print("Nicht geladen. Meldung von yt-dlp:")
        print((r.stderr or r.stdout).strip()[-800:])
        print("\nWeg von Hand: Reel in der Instagram-App speichern oder per Bildschirmaufnahme aufnehmen, "
              f"die Datei nach {ziel} legen und Bescheid sagen.")
        return 1
    print(f"Geladen: {videos[-1]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
