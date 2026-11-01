# Reel nachbauen: aus einem Vorbild dein eigenes animiertes Reel

## Was es kann

Du siehst auf Instagram ein Reel, das richtig gut läuft, und denkst: So etwas will ich auch, aber mit meinen eigenen Figuren und meiner Geschichte. Genau dafür ist dieser Skill. Du gibst Claude den Link, und Claude führt dich Schritt für Schritt bis zum fertigen 9:16-Video im animierten Trickfilm-Look:

1. Einrichtung prüfen (Python, ffmpeg, yt-dlp, Verbindung zu Higgsfield)
2. Vorbild laden und zerlegen: Aufbau, Tempo, Pointe
3. Übertragung auf dein Thema, mit eigenen Figuren, eigener Geschichte, eigenem Ort
4. Figurenblatt aus deinen Fotos oder frei beschrieben
5. Storyboard und Video-Prompts für Seedance 2.0
6. Erzeugung über Higgsfield, erst nach deinem Ja zum Preis
7. Prüfung Bild für Bild, Schnitt, Titel, Thumbnail
8. Caption-Vorschlag und Alt-Text

Nachbauen heißt hier: Aufbau und Idee übernehmen, nicht kopieren. Fremde Figuren, Gesichter, Logos und das fremde Video selbst werden nie verwendet.

## Für wen

Für Selbständige, die Reels machen wollen, aber nicht vor die Kamera möchten oder keine Zeit für Dreh und Schnitt haben. Technikwissen brauchst du keins, der Skill erklärt jedes Werkzeug, bevor er es benutzt, und installiert nichts ohne dein Ja.

## Was du brauchst

- [Claude Code](https://claude.com/claude-code) auf deinem Rechner (Desktop-App mit dem Bereich „Code“ oder im Terminal). Im normalen Claude-Chat im Browser läuft der Skill nicht.
- Ein Konto bei [Higgsfield](https://higgsfield.ai) mit Guthaben. Ein Reel mit 30 Sekunden kostet etwa 30 bis 40 Credits (Stand Oktober 2026). Der Skill fragt vor jeder Erzeugung den Preis ab und wartet auf dein Ja.
- Python, ffmpeg und yt-dlp. Fehlt etwas, sagt dir der Skill, was es tut, und installiert es erst nach deinem Ja.

## Einrichtung Schritt für Schritt

1. Lade dieses Repo herunter: oben auf GitHub der grüne Knopf **Code**, dann **Download ZIP**. ZIP entpacken.
2. Öffne deinen persönlichen Skill-Ordner:
   - Windows: `C:\Users\DEINNAME\.claude\skills\`
   - Mac: `~/.claude/skills/`
3. Kopiere den Ordner `reel-nachbauen` aus `skills/reel-nachbauen/` dort hinein. Danach liegt da `skills\reel-nachbauen\SKILL.md`.
4. Claude Code neu starten.
5. Schreiben: „Bau dieses Reel nach: <Instagram-Link>“

Einfacher geht es auch: Claude Code öffnen und schreiben „Installiere den Skill aus dem Ordner `<Pfad zum entpackten Ordner>\skills\reel-nachbauen\reel-nachbauen` in meinen persönlichen Skill-Ordner und sag mir, wenn er bereit ist.“

Beim ersten Start prüft der Skill selbst, was auf deinem Rechner fehlt, und führt dich durch das Verbinden mit Higgsfield (`anleitungen/higgsfield-verbinden.md`).

Gebaut und getestet auf Windows 11. Auf dem Mac sollte es genauso gehen, dort ist es aber noch nicht gegengetestet.

## KI-Kennzeichnung

Der Skill erzeugt KI-Videos. Wirkt ein Ergebnis wie echt, gehört beim Posten die KI-Kennzeichnung dazu. Bei klar animiertem Look ist sie meist nicht vorgeschrieben, im Zweifel trotzdem kennzeichnen.

## Herkunft und Lizenz

Eigener Skill von Natalie Hitschler. Er enthält keinen fremden Code und keine fremden Dateien. Die Skripte nutzen nur die Python-Standardbibliothek und rufen Programme auf, die du selbst installierst:

- [yt-dlp](https://github.com/yt-dlp/yt-dlp): Unlicense (gemeinfrei), wird nicht mitgeliefert
- [FFmpeg](https://ffmpeg.org): LGPL/GPL, wird nicht mitgeliefert, nur über winget oder Homebrew installiert
- Higgsfield: Dienst mit deinem eigenen Konto, angebunden über https://mcp.higgsfield.ai/mcp

Lizenz für diesen Skill: **wird noch festgelegt.**
