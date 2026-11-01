# Reel-Röntgen: Claude schaut sich ein Video wirklich an 🧡

## Was es kann

Du gibst Claude Code einen Link oder eine Videodatei, mehr nicht. Reel-Röntgen zerlegt das Video in Standbilder, liest sie der Reihe nach, hört die Tonspur ab und sagt dir danach, was wirklich zu sehen und zu hören ist:

1. **Laden:** Link (YouTube, TikTok, Instagram, Vimeo), direkter Dateilink oder eine Datei auf deinem Rechner.
2. **Zerlegen:** Bei kurzen Reels zwei Bilder pro Sekunde, den Anfang zusätzlich noch enger.
3. **Ansehen:** Jedes Bild, in der richtigen Reihenfolge. Nichts wird übersprungen, auch wenn es nach Wiederholung aussieht.
4. **Zuhören:** Die Tonspur wird immer transkribiert, bei fremder Sprache steht der Text auf Deutsch da.
5. **Auswerten:** Hook, Tempo, Schnitt, Farben, Einblendungen, Musik und Wirkung, jeweils mit Sekunden und Bildern belegt.
6. **Viral-Analyse:** Bei Konkurrenz- oder Viralvideos kommt dazu, warum Menschen hängen bleiben, mit einer fertigen Viralformel.

Er springt von allein an, wenn du schreibst: „schau dir das Video an“, „analysiere dieses Reel“, „wie ist der Hook“ oder „warum geht das viral“. Du kannst auch einfach `/reel-roentgen` schreiben.

## Für wen

Für alle, die wissen wollen, warum ein Reel läuft, bevor sie eigene bauen. Und für alle, die ein fertiges Video vor dem Posten noch einmal prüfen wollen. Programmieren musst du dafür nicht können.

## Was du brauchst

- [Claude Code](https://claude.com/claude-code) auf deinem Rechner (Desktop-App mit dem Bereich „Code“ oder im Terminal). Im normalen Claude-Chat im Browser läuft der Skill nicht.
- `ffmpeg` (zerlegt das Video) und `yt-dlp` (holt Links). Fehlt etwas, sag es Claude Code, er installiert es dir.
- Für die Tonspur: ein Spracherkennungs-Werkzeug. Der Skill nimmt ElevenLabs, wenn es bei dir verbunden ist, sonst vorhandene Untertitel oder Whisper über einen eigenen Schlüssel.

Die Befehle im Skill sind für PowerShell unter Windows geschrieben. Dort habe ich ihn gebaut und getestet.

## Was es kostet

Der Skill selbst nichts. Es zählt deine normale Claude-Nutzung. Die Transkription mit ElevenLabs verbraucht einen kleinen Teil deines dortigen Kontingents.

## Installation

1. Lade das Paket herunter: oben auf **Code**, dann **Download ZIP**, entpacken.
2. Kopiere den Ordner `reel-roentgen` aus `skills/reel-roentgen/` in deinen persönlichen Skill-Ordner:
   - Windows: `C:\Users\DEINNAME\.claude\skills\`
   - Mac: `~/.claude/skills/`
3. Claude Code neu starten.
4. Schreiben: „Schau dir dieses Reel an: <Link>“

Einfacher geht es auch: Claude Code öffnen und schreiben „Installiere den Skill aus dem Ordner `<Pfad zum entpackten Ordner>\skills\reel-roentgen\reel-roentgen` in meinen persönlichen Skill-Ordner und sag mir, wenn er bereit ist.“

## Hinweis zu fremden Videos

Nutze fremde Videos nur zum Lernen und zum Verstehen. Wenn du daraus etwas Eigenes baust, dann mit eigenen Worten und eigenem Material.

## Herkunft und Lizenz

Eigener Skill von Natalie Hitschler, komplett in eigenen Worten geschrieben. Er enthält keinen fremden Text und keine fremden Dateien. Er ruft nur Programme auf, die du selbst installierst:

- [yt-dlp](https://github.com/yt-dlp/yt-dlp): Unlicense (gemeinfrei), wird nicht mitgeliefert
- [FFmpeg](https://ffmpeg.org): LGPL/GPL, wird nicht mitgeliefert

Lizenz: **MIT**, Copyright (c) 2026 Natalie Hitschler (Text in der Datei `LICENSE`).
