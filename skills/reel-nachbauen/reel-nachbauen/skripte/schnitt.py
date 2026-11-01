"""Schnitt für reel-nachbauen.

1. Schnittstellen eines Clips finden:
     py schnitt.py --schnitte "<clip.mp4>"
2. Reel aus einer Schnittliste bauen:
     py schnitt.py "<schnittliste.json>" "<reel.mp4>"

Schnittliste (JSON), Pfade relativ zur Schnittliste oder absolut:
  {"segmente": [{"datei": "../clips/kapitel-1.mp4", "von": 0.0, "bis": 1.04},
                {"datei": "../clips/kapitel-1.mp4", "von": 1.09, "bis": 2.29}],
   "standbild_am_ende": 0.8}

Ergebnis: 1080 x 1920, 30 Bilder pro Sekunde, H.264, yuv420p, an jedem Schnitt 40 ms Tonblende,
Lautheit etwa -14 bis -16 LUFS (Ziel -14, bei kurzen Clips mit Pausen landet die Messung oft etwas darunter).
Ohne Musik: die kommt in der Instagram-App dazu.
"""
import json
import subprocess
import sys
from pathlib import Path


def schnitte(clip: Path) -> int:
    r = subprocess.run(["ffmpeg", "-i", str(clip), "-vf", "scdet=threshold=10,metadata=print:key=lavfi.scd.time",
                        "-an", "-f", "null", "-"], capture_output=True, text=True)
    zeiten = [float(z.split("=")[1]) for z in r.stderr.split() if z.startswith("lavfi.scd.time=")]
    print(f"{clip.name}: Schnitte bei " + ", ".join(f"{t:.2f}" for t in zeiten) + " s")
    print("Tipp: Segmente je 0,05 s nach einem Schnitt beginnen und 0,05 s vor dem nächsten enden lassen.")
    return 0


def bauen(liste: Path, ziel: Path) -> int:
    daten = json.loads(liste.read_text(encoding="utf-8"))
    segmente = daten["segmente"]
    stand = float(daten.get("standbild_am_ende", 0.0))
    args, fil, kette = ["ffmpeg", "-v", "error", "-y"], [], ""
    for i, s in enumerate(segmente):
        datei = Path(s["datei"])
        if not datei.is_absolute():
            datei = (liste.parent / datei).resolve()
        d = float(s["bis"]) - float(s["von"])
        args += ["-ss", f"{s['von']}", "-t", f"{d:.3f}", "-i", str(datei)]
        v = (f"[{i}:v:0]setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=decrease,"
             f"pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30")
        if i == len(segmente) - 1 and stand > 0:
            v += f",tpad=stop_mode=clone:stop_duration={stand}"
        ad = d + (stand if i == len(segmente) - 1 else 0)
        fil.append(f"{v}[v{i}];[{i}:a:0]asetpts=PTS-STARTPTS,aresample=48000,apad=whole_dur={ad:.3f},"
                   f"afade=t=in:d=0.04,afade=t=out:st={max(0, ad - 0.04):.3f}:d=0.04[a{i}]")
        kette += f"[v{i}][a{i}]"
    fil.append(f"{kette}concat=n={len(segmente)}:v=1:a=1[v][c]")
    fil.append("[c]loudnorm=I=-14:TP=-1.5:LRA=11[a]")
    ziel.parent.mkdir(parents=True, exist_ok=True)
    args += ["-filter_complex", ";".join(fil), "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "18",
             "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
             "-movflags", "+faststart", str(ziel)]
    subprocess.run(args, check=True)
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(ziel)],
                       capture_output=True, text=True, check=True)
    print(f"Reel: {ziel} ({float(r.stdout):.1f} s, 1080 x 1920)")
    return 0


def main() -> int:
    for strom in (sys.stdout, sys.stderr):
        try:
            strom.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass
    if len(sys.argv) == 3 and sys.argv[1] == "--schnitte":
        return schnitte(Path(sys.argv[2]))
    if len(sys.argv) == 3:
        return bauen(Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve())
    print(__doc__)
    return 1


if __name__ == "__main__":
    sys.exit(main())
