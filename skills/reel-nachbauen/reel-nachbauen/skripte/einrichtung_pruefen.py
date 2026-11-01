"""Prüft, ob alle Programme für den Skill reel-nachbauen da sind.

Aufruf: py einrichtung_pruefen.py   (Mac: python3 einrichtung_pruefen.py)
Rückgabewert 0 = alles da, 1 = etwas fehlt.
"""
import platform
import shutil
import subprocess
import sys

PROGRAMME = [
    ("ffmpeg", ["-version"], "schneidet Videos, baut Kontaktbögen"),
    ("ffprobe", ["-version"], "misst Länge und Format von Videos (kommt mit ffmpeg)"),
    ("yt-dlp", ["--version"], "lädt Videos über ihren Link"),
    ("curl", ["--version"], "lädt Dateien hoch und herunter"),
]

INSTALL = {
    "Windows": {
        "ffmpeg": "winget install -e --id Gyan.FFmpeg",
        "ffprobe": "winget install -e --id Gyan.FFmpeg",
        "yt-dlp": "winget install -e --id yt-dlp.yt-dlp",
        "curl": "(in Windows 10/11 enthalten)",
    },
    "Darwin": {
        "ffmpeg": "brew install ffmpeg",
        "ffprobe": "brew install ffmpeg",
        "yt-dlp": "brew install yt-dlp",
        "curl": "(auf dem Mac enthalten)",
    },
}


def main() -> int:
    for strom in (sys.stdout, sys.stderr):
        try:
            strom.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass
    system = platform.system()
    print(f"System: {system} {platform.release()}, Python {platform.python_version()}")
    fehlt = []
    if sys.version_info < (3, 9):
        print("FEHLT   Python 3.9 oder neuer")
        fehlt.append("python")
    else:
        print("OK      Python")
    for name, arg, zweck in PROGRAMME:
        pfad = shutil.which(name)
        if not pfad:
            print(f"FEHLT   {name}: {zweck}")
            fehlt.append(name)
            continue
        try:
            subprocess.run([pfad, *arg], capture_output=True, timeout=20, check=True)
            print(f"OK      {name}")
        except (OSError, subprocess.SubprocessError):
            print(f"FEHLER  {name} gefunden, startet aber nicht: {pfad}")
            fehlt.append(name)
    if not fehlt:
        print("\nAlles da.")
        return 0
    befehle = INSTALL.get(system, {})
    print("\nSo installieren (erst nach Ja des Nutzers):")
    for name in dict.fromkeys(fehlt):
        print(f"  {name}: {befehle.get(name, 'siehe anleitungen/einrichtung.md')}")
    print("Danach Terminal schließen, Claude Code neu öffnen und erneut prüfen.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
