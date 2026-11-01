# Hyperframes: Videos aus HTML, gebaut von Claude Code

Diese Anleitung erklärt, wie du Hyperframes in Claude Code einrichtest. Hyperframes selbst liegt hier nicht drin, du holst es dir direkt beim Hersteller. So bekommst du immer die aktuelle Fassung.

## Was es kann

Hyperframes ist ein Werkzeug von HeyGen, mit dem Claude Code Videos baut: Erklärvideos, Titel, Einblendungen, Untertitel, animierte Diagramme, kleine Werbeclips. Claude schreibt dafür eine Webseite (HTML), und Hyperframes macht daraus ein MP4. Du beschreibst in normalen Worten, was du willst, Claude plant, baut, zeigt dir eine Vorschau im Browser und rendert das fertige Video.

## Für wen

Für alle, die kurze Videos mit Text, Grafik und Animation brauchen, ohne Schnittprogramm. Gut für Reels mit Einblendungen, Erklärclips und Präsentationen.

## Was du brauchst

- [Claude Code](https://claude.com/claude-code)
- [Node.js](https://nodejs.org) ab Version 22
- [FFmpeg](https://ffmpeg.org), das Programm, das am Ende das Video zusammensetzt

Fehlt dir Node.js oder FFmpeg, sag es Claude Code einfach: „Prüf, ob Node.js ab Version 22 und FFmpeg installiert sind, und installier sie, wenn nicht.“

## Einrichtung Schritt für Schritt

1. Ordner für deine Videos anlegen, zum Beispiel `Dokumente\Videos-mit-Claude`, und Claude Code in diesem Ordner öffnen.
2. Die Hyperframes-Skills installieren. Am einfachsten im Terminal:
   ```
   npx hyperframes skills update
   ```
   Das holt den Grundstock an Skills direkt aus dem Repo von HeyGen.
   Alternativ als Plugin direkt in Claude Code:
   ```
   claude plugin marketplace add heygen-com/hyperframes
   claude plugin install hyperframes@hyperframes
   ```
3. Claude Code neu starten.
4. Schreiben, was du willst, zum Beispiel: „Mach mir mit Hyperframes ein 15-Sekunden-Video im Hochformat mit drei Tipps zu meinem Angebot, große Schrift, ruhige Farben.“
5. Vorschau im Browser anschauen, Änderungen ansagen, dann rendern lassen.

Die Befehle können sich ändern. Maßgeblich ist immer die Anleitung im Original: https://github.com/heygen-com/hyperframes

## Herkunft und Lizenz

Hyperframes gehört HeyGen, Inc. und liegt unter https://github.com/heygen-com/hyperframes. Lizenz: Apache License 2.0, Copyright 2026 HeyGen, Inc. In diesem Paket ist nichts davon kopiert, nur diese deutsche Anleitung mit Verweis. Name und Marke Hyperframes und HeyGen gehören HeyGen. HeyGen betreibt oder empfiehlt dieses Paket nicht.

Diese Anleitung hat Natalie Hitschler geschrieben. Lizenz für diese Anleitung: **wird noch festgelegt.**
