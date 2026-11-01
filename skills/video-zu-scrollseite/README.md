# Video zu Scrollseite: Website, die sich beim Scrollen wie ein Film abspielt

## Was es kann

Claude baut aus einem Video eine Seite, bei der das Video nicht abläuft, sondern am Scrollrad hängt: Wer scrollt, spult vor und zurück. Das Video wird in Einzelbilder zerlegt, dazu kommen Textabschnitte mit sieben Bewegungsarten, hochzählende Zahlen und ein Abschluss mit Handlungsaufruf. Der Skill prüft vorher, ob das Video sich dafür eignet, entscheidet zwischen Hoch- und Querformat, nutzt eine Ladestrategie mit Startschwelle (im Test 9,7 statt 91 Sekunden im schwachen Mobilnetz) und bringt zwei Prüfwerkzeuge mit: `werkzeuge/screenshots.py` (Screenshots an neun Scroll-Positionen plus Fehlerprotokoll) und `werkzeuge/ladezeit.py` (Ladezeit bei WLAN, gutem und schwachem Mobilnetz).

## Für wen

Für alle mit einem Video, bei dem das Scrollen selbst Teil der Geschichte ist, etwa Verwandlungen, Vorher-nachher oder eine ruhige Kamerafahrt um ein Produkt. Nicht für Talking-Heads und nicht für schnell geschnittene Reels.

## Voraussetzungen

- FFmpeg im PATH (Windows: `winget install ffmpeg`, Mac: `brew install ffmpeg`)
- Python 3
- Für die Prüfwerkzeuge: `pip install playwright` und `python -m playwright install chromium`. Alternativ die Umgebungsvariable `SCROLLSEITE_CHROME` mit dem Pfad zu einem Chromium-Browser setzen.

## Einrichtung Schritt für Schritt

Du brauchst [Claude Code](https://claude.com/claude-code), in der Desktop-App oder im Terminal.

1. Lade dieses Repo herunter: oben auf GitHub der grüne Knopf **Code**, dann **Download ZIP**. ZIP entpacken.
2. Öffne deinen persönlichen Skill-Ordner:
   - Windows: `C:\Users\DEINNAME\.claude\skills\`
   - Mac: `~/.claude/skills/`
3. Kopiere den Ordner `video-zu-scrollseite` aus `skills/video-zu-scrollseite/` dort hinein. Danach liegt da `skills\video-zu-scrollseite\SKILL.md`.
4. Claude Code neu starten.
   Der Ordner enthält auch `werkzeuge/` mit den zwei Prüfskripten.
5. Schreiben: „Mach eine Scrollseite aus diesem Video: …“ und den Pfad zum Video nennen.

## Herkunft und Lizenz

Entstanden aus einem Testlauf mit dem fremden Skill `video-to-website`, dessen Fehler (Programmierfehler, fremder Pfad, Widersprüche, langsame Ladestrategie) hier korrigiert sind.

Angepasst und gepflegt von Natalie Hitschler.
