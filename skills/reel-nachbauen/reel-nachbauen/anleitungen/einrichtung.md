# Einrichtung

Ziel: Python, ffmpeg (mit ffprobe), yt-dlp und curl sind da, und Higgsfield ist verbunden.

## 1. Prüfen

Mit vollem Pfad zum Skill-Ordner (`<SKILL>`, siehe SKILL.md):

- Windows: `py "<SKILL>/skripte/einrichtung_pruefen.py"` (nie `python`, das öffnet auf Windows den Microsoft Store)
- Mac: `python3 "<SKILL>/skripte/einrichtung_pruefen.py"`

Fehlt Python selbst, kommt eine Fehlermeldung wie „py nicht gefunden“. Dann bei Schritt 2 mit Python anfangen.

## 2. Fehlendes installieren (nur nach Ja des Nutzers)

Vorher in einem Satz sagen, was das Programm tut:
- **Python:** führt die kleinen Hilfsskripte dieses Skills aus.
- **ffmpeg:** schneidet und wandelt Videos um, baut die Kontaktbögen.
- **yt-dlp:** lädt ein Video über seinen Link herunter.
- **curl:** lädt Dateien hoch und herunter (auf Windows 10/11 und Mac schon dabei).

### Windows (winget, ist in Windows 10/11 enthalten)

```
winget install -e --id Python.Python.3.12
winget install -e --id Gyan.FFmpeg
winget install -e --id yt-dlp.yt-dlp
```

Danach das Terminal schließen und Claude Code neu öffnen, damit die neuen Programme gefunden werden. Dann
erneut prüfen.

### Mac (Homebrew)

Ist Homebrew nicht da (`brew --version` schlägt fehl), zuerst die Anleitung auf brew.sh zeigen; die
Installation braucht das Mac-Passwort, das gibt der Nutzer selbst ein.

```
brew install python ffmpeg yt-dlp
```

## 3. Higgsfield

Weiter mit `higgsfield-verbinden.md`.

## 4. Fertig

`einrichtung_pruefen.py` meldet alles grün und `balance` liefert einen Kontostand. Dem Nutzer sagen:
„Alles eingerichtet, wir können loslegen.“
