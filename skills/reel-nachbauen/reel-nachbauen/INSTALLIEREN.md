# Skill „reel-nachbauen“ installieren

Du brauchst Claude Code (Desktop-App mit dem Bereich „Code“ oder Claude Code im Terminal). Im normalen
Claude-Chat im Browser läuft dieser Skill nicht, weil er Programme auf deinem Rechner benutzt.

## Der einfachste Weg

1. Die ZIP-Datei herunterladen und irgendwo speichern, zum Beispiel unter Downloads.
2. Claude Code öffnen und diesen Satz schicken (den Pfad zur ZIP anpassen):

   > Installiere den Skill aus der ZIP-Datei `C:\Users\DEINNAME\Downloads\reel-nachbauen.zip` in meinen
   > persönlichen Skill-Ordner und sag mir, wenn er bereit ist.

3. Claude Code neu starten. Danach reicht: „Bau dieses Reel nach: <Instagram-Link>“.

## Von Hand

Den Ordner `reel-nachbauen` aus der ZIP in deinen persönlichen Skill-Ordner kopieren:
- Windows: `C:\Users\DEINNAME\.claude\skills\reel-nachbauen`
- Mac: `~/.claude/skills/reel-nachbauen`

## Was du außerdem brauchst

- Ein Konto bei Higgsfield mit etwas Guthaben (ein Reel mit 30 Sekunden kostet etwa 30 bis 40 Credits,
  Stand Oktober 2026). Der Skill führt dich durch das Verbinden.
- Python, ffmpeg und yt-dlp. Fehlt etwas, sagt dir der Skill, was es tut, und installiert es erst nach
  deinem Ja.

Gebaut und getestet auf Windows 11. Auf dem Mac sollte es genauso gehen, dort ist es aber noch nicht
gegengetestet. Wenn du unsicher bist: frag Claude Code direkt, gern mit einem Screenshot.
