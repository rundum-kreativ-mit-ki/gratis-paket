# brag: aus deiner Website oder deinem Projekt ein kurzes Werbevideo

## Was es kann

Du gibst Claude Code eine Website-Adresse oder einen Projektordner, mehr nicht. brag schaut sich alles an und baut daraus ein kurzes Video mit Bewegung, Musik und einem Text zum Teilen:

1. **Lesen:** brag liest den Code deines Projekts oder schaut sich die Website an, so wie ein Besucher sie sieht.
2. **Planen:** Es überlegt sich ein Konzept, das zu genau diesem Projekt passt, statt einer Standardvorlage.
3. **Skript und Storyboard:** Es schreibt den Ablauf Szene für Szene: was erscheint, wann, und was sich bewegt.
4. **Bauen:** Das Video entsteht mit Hyperframes, einem Werkzeug, das Videos aus Webseiten-Bausteinen rendert.
5. **Prüfen und fertig:** brag prüft das Ergebnis, rendert die Datei und schreibt einen Text zum Teilen dazu.

Der Befehl sieht zum Beispiel so aus: `let's /brag meine-website.de`

Dazu gehören zwei Fassungen: `brag` (der ganze Ablauf mit Hyperframes) und `brag-slim` (die schlanke Fassung). Mit dem neuesten Claude-Modell nimmt brag automatisch brag-slim. Dann baut Claude das ganze Video selbst, mit den Werkzeugen, die schon auf dem PC sind. Willst du trotzdem den ganzen Ablauf, schreib: "Nimm das volle brag."

## Für wen

Für alle, die zeigen wollen, was sie gebaut haben, und keine Lust auf Bildschirmaufnahmen, Schnittprogramm und Musiksuche haben: Selbständige mit Website, Community-Betreiberinnen, Leute mit einem eigenen Projekt. Programmieren musst du dafür nicht können.

## Was du brauchst

- [Claude Code](https://claude.com/claude-code) auf deinem Rechner (Desktop-App mit dem Bereich „Code“ oder im Terminal). Im normalen Claude-Chat im Browser läuft der Skill nicht.
- Eine Website-Adresse oder einen Projektordner, über den das Video gemacht werden soll.
- Für die volle Fassung `brag`: die Hyperframes-Skills. Wie du sie einrichtest, steht in [`anleitungen/hyperframes`](../../anleitungen/hyperframes/).

## Was es kostet

Kein Guthaben bei einem Videodienst. brag rendert auf deinem eigenen PC, es zählt nur deine normale Claude-Nutzung. Gefällt dir das Video nicht, sagst du Claude, was anders werden soll.

## Einrichtung Schritt für Schritt

1. Lade dieses Repo herunter: oben auf GitHub der grüne Knopf **Code**, dann **Download ZIP**. ZIP entpacken.
2. Öffne deinen persönlichen Skill-Ordner:
   - Windows: `C:\Users\DEINNAME\.claude\skills\`
   - Mac: `~/.claude/skills/`
3. Kopiere die beiden Ordner `brag` und `brag-slim` aus `skills/brag/` dort hinein. Danach liegen da `skills\brag\SKILL.md` und `skills\brag-slim\SKILL.md`.
4. Claude Code neu starten.
5. Schreiben: „let's /brag meine-website.de“

Einfacher geht es auch: Claude Code öffnen und schreiben „Installiere die Skills brag und brag-slim aus dem Ordner `<Pfad zum entpackten Ordner>\skills\brag` in meinen persönlichen Skill-Ordner und sag mir, wenn sie bereit sind.“

Gebaut und getestet auf Windows. Wenn etwas hakt: Claude Code direkt fragen, gern mit einem Screenshot.

## KI-Kennzeichnung

Die Videos baut Claude Code, die Bilder und Texte stammen aus deiner Website oder deinem Projekt. Wenn du ein Video mit Inhalten postest, die KI erzeugt hat oder die wie echt wirken, gehört beim Posten die KI-Kennzeichnung dazu. Im Zweifel kennzeichnen.

## Herkunft und Lizenz

brag stammt nicht von Natalie, sondern von Shunit Haviv Hakimi. Original: [github.com/latent-spaces/brag](https://github.com/latent-spaces/brag), Lizenz MIT, Copyright (c) 2026 Shunit Haviv Hakimi. Der vollständige Lizenztext liegt in der Datei `LICENSE` in diesem Ordner und in den Skill-Ordnern `brag` und `brag-slim`. Die Fassung hier ist die, die bei Natalie läuft. Sie kann vom aktuellen Stand im Original abweichen, das aktuelle Original findest du im Repo oben.

Zwei Teile im Skill haben eine eigene Herkunft:

- **Musik** (`brag/assets/music/`): fünf Titel aus der Reihe „Happy Beats / Business Moves“ von Sascha Ende, [ende.app](https://ende.app/en), Lizenz CC BY 4.0 (https://ende.app/en/standard-license). Namensnennung: „Musik: Sascha Ende (ende.app), CC BY 4.0“.
- **Soundeffekte** (`brag/assets/sfx/`): Pakete von [Kenney](https://kenney.nl/), von Kenney als Creative Commons CC0 (gemeinfrei) veröffentlicht.

Die Lizenz gilt nur für diesen Skill. Marken und Namen (Claude, Hyperframes, Skool und andere) gehören ihren Inhabern.
