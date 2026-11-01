---
name: reel-roentgen
description: >
  Schaut sich jedes Video wirklich an, Bild für Bild und mit Ton, statt nur über den Titel oder das
  Transkript zu urteilen. Funktioniert mit Links (YouTube, TikTok, Instagram, Vimeo), direkten
  Dateilinks (.mp4, .mov, .webm) und Dateien auf dem eigenen Rechner. Zerlegt das Video mit ffmpeg
  in Standbilder, liest sie der Reihe nach, transkribiert die Tonspur und bewertet Hook, Tempo,
  Schnitt, Farben, Einblendungen und Wirkung. Bei Viral- oder Konkurrenzvideos kommt eine
  Auslöser-Analyse mit fertiger Viralformel dazu. Einsetzen bei "schau dir das Video an", "guck mal
  rein", "analysiere das Reel", "was passiert da", "wie ist der Hook", "wie ist das geschnitten",
  "warum geht das viral", "anschauen", "watch", "analysiere dieses Video", sowie bei "watch this video", "look at this clip", "analyze this reel",
  "review this short", "break down this video", "compare these videos".
---

# Reel-Röntgen: ein Video ansehen, wie es ein Mensch tut

Dieser Skill macht aus einer Videodatei etwas, das sich Bild für Bild und Sekunde für Sekunde
beurteilen lässt. Du lädst das Video, schneidest Standbilder heraus, schaust sie dir mit dem
Read-Werkzeug an (es zeigt Bilder direkt), hörst die Tonspur ab und schreibst danach auf, was
tatsächlich zu sehen und zu hören ist. Die Programme `ffmpeg`, `ffprobe` und `yt-dlp` sind auf diesem
Rechner vorhanden. Alle Befehle sind für PowerShell unter Windows geschrieben.

## Die Grundhaltung: erst nachsehen, dann behaupten

Jeder Abschnitt unten wird ganz durchgespielt, auch dann, wenn das Ergebnis schon klar scheint.
Schlüsse aus dem ersten Eindruck sind hier verboten. Du darfst nicht aus den Bildern erraten, was
gesprochen wird, und nicht aus der Stimmung des Clips folgern, die Tonspur sei bloß Musik. Wer
abkürzt, verpasst genau die Stelle, an der die Aussage steckt: einen kurzen Zwischenschnitt, einen
zweiten Textmoment, einen Satz unter der Musik. Ist etwas unklar, schau nochmal hin oder hör nochmal
rein.

## Phase 1: Vorbereiten

**Quelle einordnen.** Es gibt drei Fälle. Endet der Link auf .mp4, .mov oder .webm, ist es ein
direkter Dateilink, und `Invoke-WebRequest -Uri "<URL>" -OutFile "<ordner>\video.mp4"` holt ihn. Ist es
ein Link zu einer Plattform, lädst du mit `yt-dlp -f "mp4/best" -o "<ordner>\video.mp4" "<URL>"`.
Liegt das Video schon auf dem Rechner, arbeitest du mit dieser Datei weiter, ohne sie zu kopieren.
Wenn du fremde Untertitel mitnehmen willst, hängst du an den yt-dlp-Aufruf
`--write-auto-subs --write-subs --sub-lang en,de --convert-subs srt` an.

**Ordner anlegen.** Für jede Analyse ein neuer Ordner, zum Beispiel `C:\Users\DEINNAME\reel-roentgen\<kurzname>\`, angelegt
mit `New-Item -ItemType Directory -Force`. Dort landen Video, Standbilder und Audiodatei. Alte Dateien
löschst du nicht mit Platzhaltern, das blockiert der Schutz der Sandbox. Du überschreibst sie
einfach, ffmpeg macht das mit dem Schalter `-y`.

**Beschreibungstext lesen.** Bei Plattformlinks holst du ihn immer, bevor du ein Bild öffnest:
`yt-dlp --skip-download --get-description "<URL>"`. Bei Reels und Shorts steht dort oft schon die
Handlung oder die Pointe. Wer sie kennt, ordnet die Bilder später richtig ein.

## Phase 2: In Standbilder zerlegen

**Länge messen.**
`ffprobe -v error -show_entries format=duration -of csv=p=0 "<ordner>\video.mp4"`

**Dichte wählen.** Grob gilt: Man will etwa so viele Bilder, wie die Länge geteilt durch acht ergibt,
aber nie unter 20 und nie über 100. Daraus folgt die Rate.

| Länge | Abtastung | ffmpeg-Filter |
|---|---|---|
| bis 40 Sekunden (Reel, Short) | zwei Bilder pro Sekunde | `fps=2` |
| 40 Sekunden bis 3 Minuten | ein Bild alle sieben Sekunden | `fps=1/7` |
| über 3 Minuten | ein Bild alle 15 bis 30 Sekunden | `fps=1/20` als Mitte |

Bei kurzen Clips sind zwei Bilder pro Sekunde Pflicht. Mit weniger Bildern geht ein Gag oder ein
Schnitt verloren.

**Hook zusätzlich eng abtasten.** Die ersten drei Sekunden kommen immer noch einmal extra, bei jedem
Video, egal wie lang.

**Für einen Nachbau noch dichter.** Soll aus dem Video ein Nachbau werden, brauchst du zusätzlich acht Bilder pro
Sekunde an jedem Bildwechsel und jeder Verwandlung. Schneide dafür um die Stelle einen kurzen Abschnitt heraus, zum Beispiel
`ffmpeg -hide_banner -loglevel error -ss <Start> -t 2 -i "<ordner>\video.mp4" -vf "fps=8,scale=512:-1" "<ordner>\dicht_%03d.jpg" -y`.
Warum das nötig ist: Bei zwei Bildern pro Sekunde blieb bei einem Test unbemerkt, wie eine Frau ihren Hund wieder über die
Schwelle einer Tür zurückzieht.

**Die Befehle** (Breite 512 Pixel spart Token):

Gesamtübersicht:
`ffmpeg -hide_banner -loglevel error -i "<ordner>\video.mp4" -vf "fps=<rate>,scale=512:-1" "<ordner>\f_%03d.jpg" -y`

Hook:
`ffmpeg -hide_banner -loglevel error -ss 0 -t 3 -i "<ordner>\video.mp4" -vf "fps=2,scale=512:-1" "<ordner>\hook_%02d.jpg" -y`

## Phase 3: Die Bilder lesen

Öffne die Bilder mit dem Read-Werkzeug, und zwar in der Reihenfolge, in der sie entstanden sind. Nur die
lückenlose Folge zeigt den Ablauf.

- **Kurze Videos (bis 40 Sekunden):** alle `hook_*.jpg` und danach alle `f_*.jpg`, ohne Auswahl. Fehlende
  Bilder führen zu erfundenen Übergängen und zu verschluckten Momenten wie einem Ruckeln, einem
  Perspektivwechsel oder einem Mini-Schnitt. Oft sind genau die der Witz. Auch Übersichtsbilder, die den ersten Hook-Bildern gleichen, werden geöffnet. Nichts überspringen, nur weil es nach Wiederholung aussieht.
- **Längere Videos:** alle Hook-Bilder und etwa 15 bis 25 gleichmäßig verteilte Übersichtsbilder. Bleibt
  eine Stelle unklar, lade gezielt die Bilder zwischen zwei bereits gelesenen nach. Rechne nicht
  dazwischen.

## Phase 4: Die Tonspur

Zuerst feststellen, ob es Ton gibt:
`ffprobe -v error -show_entries stream=index,codec_type,codec_name -of csv "<ordner>\video.mp4"`.
Fehlt ein Audio-Stream, ist das Video rein visuell, und du bist hier fertig.

Gibt es Ton, wird er **immer** transkribiert. Das ist keine Option. Ob jemand spricht, weißt du erst nach
dem Zuhören, nicht nach dem Anschauen. Auch bei Clips, die nach Gefühl und Musik aussehen, liegt die
eigentliche Pointe oft als Sprechstimme unter dem Soundtrack. Ein Beispiel: Zwei Hunde führen ein
Gespräch, während im Bild nur ein einziger Satz steht.

So gehst du vor, in dieser Reihenfolge:

1. Audio herausziehen:
   `ffmpeg -hide_banner -loglevel error -i "<ordner>\video.mp4" -vn -acodec libmp3lame -q:a 2 "<ordner>\audio.mp3" -y`
2. Das Werkzeug `mcp__ElevenLabs__speech_to_text` über ToolSearch laden und aufrufen, mit
   `diarize=true` und der passenden Sprache als ISO-639-3-Code (`deu`, `eng`, `spa` und so weiter). Du
   bekommst den Text samt Sprechertrennung. Das ist der bevorzugte Weg.
3. Steht ElevenLabs nicht zur Verfügung, nimm die mit yt-dlp geholten .srt-Untertitel. Gibt es auch die
   nicht, bleibt Whisper über einen vorhandenen Schlüssel (zuerst Groq mit `whisper-large-v3`, danach
   OpenAI mit `whisper-1`).

**Fremdsprache:** Sprich die Sprache genau einmal an und gib dann nur noch die deutsche Übersetzung aus.
Der fremde Originaltext steht weder im Bericht noch in Klammern daneben.

**Eigenes Video:** Liegt das Skript in einem Sheet oder Workflow, vergleichst du es zusätzlich mit dem
Gehörten. Das Transkribieren ersetzt es nicht.

## Phase 5: Auswerten und ehrlich berichten

Beantworte zuerst die konkrete Frage der Person. Danach gehst du diese Punkte durch, jeweils mit
Bezug zu bestimmten Bildern oder Sekunden und ohne Schönfärberei.

- **Hook, Sekunde 0 bis 3:** Hält das erste Bild den Daumen an? Wodurch: Bewegung, Schrift, Kontrast?
  Schau außerdem zurück, ob schon das allererste Bild einen Hinweis auf die spätere Wendung enthält,
  etwa eine Figur, die in einer gleichförmigen Reihe leicht abweicht. Beim ersten Ansehen übersieht man
  das leicht.
- **Tempo und Schnitt:** Wie häufig wechselt die Einstellung? Gibt es Durchhänger?
- **Farben und Look:** Wirkt alles aus einem Guss? Passt es zur Marke?
- **Untertitel und eingeblendeter Text:** Lesbar? Zum Ton synchron? Welcher Stil?
- **Gesprochener Text:** Der volle Wortlaut aus dem Transkript. Bei mehreren Stimmen steht dabei, wer
  spricht (zum Beispiel welcher Hund). Fremdsprachiges nur auf Deutsch. Dieser Block fehlt nie, sobald
  eine Tonspur existiert.
- **Zusammenspiel von Bild und Text:** Stimmt das Gezeigte mit dem Gesagten überein? Trägt die Schrift
  die Botschaft, der Ton, oder beide?
- **Rolle der Musik:** Erzeugt sie nur Stimmung, mit allgemeinen Zeilen ohne Bezug zum Bild? Oder erzählt
  der Gesang mit? Nenne weder Titel noch Interpret, wenn sie nicht aus dem Transkript hervorgehen.
  Musik zu erkennen ist Sache der Plattformdaten (zum Beispiel Apify `musicInfo`), nicht dieser Analyse.
- **Gezeigtes pro wichtigem Moment:** Was ist in diesem Augenblick tatsächlich im Bild?

Geht es um ein Konkurrenz- oder Viralvideo, beantworte zusätzlich, warum Menschen länger als drei
Sekunden hängen bleiben (erstes Bild, Schnitte, Einblendungen), und leite daraus konkrete Lehren ab.

## Phase 6: Viral-Analyse (bei jedem Viral- oder Konkurrenzvideo zusätzlich)

Gehe fünf Gruppen der Reihe nach durch. Jeder Auslöser, den du findest, bekommt einen Namen, einen
Zeitpunkt und einen Satz dazu, weshalb er funktioniert.

**1. Hook-Art in den ersten drei Sekunden.** Welcher Mechanismus stoppt das Wischen?
- Musterbruch: ein unerwartetes Bild reißt aus dem Scrollen.
- Neugierlücke: Eine Frage steht im Raum, die Antwort kommt später.
- Nutzenversprechen: Es wird gleich gesagt, was man bekommt ("In 20 Sekunden zeige ich dir ...").
- Kontrast oder Schock: starker Gegensatz, etwa Vorher und Nachher oder ein verblüffendes Bild.
- Wiedererkennen: Die Zuschauerin denkt sofort "Das bin ich".
- Reizthese: eine Behauptung, bei der man zustimmen oder widersprechen muss.

**2. Dranbleib-Mechanik.** Was bindet nach Sekunde drei?
- Spannungsbogen: Aufbau, Zuspitzung, Auflösung, wobei die Auflösung erst spät kommt.
- Wissensversprechen: Man wartet auf eine Auskunft.
- Lacher oder Überraschung im Takt, ungefähr alle drei bis fünf Sekunden.
- Gefühlsbogen: Mitgefühl, Ärger, Freude oder Stolz wächst an.
- Ich-auch-Momente: Man erkennt den eigenen Alltag wieder.

**3. Auslöser für Kommentar und Weiterleiten.**
- Streitpunkt: Das Video verlangt eine Haltung dafür oder dagegen.
- Weiterschick-Impuls: Es steckt etwas drin, das man gleich einer anderen Person zeigen will.
- Ansprache einer Gruppe: "Wenn du so jemand bist, dann ...".

**4. Bauform.**
- Enthüllung am Schluss: Der Knall kommt in den letzten Sekunden, deshalb schaut man bis zum Ende.
- Schleife: Das Ende führt in den Anfang zurück, und der Clip läuft ein zweites Mal.
- Drei Akte: Problem, Eskalation, Lösung oder Wendung.
- Einladung zur Antwort: Das Video fordert zum Stitchen, Duett oder Nachmachen auf.

**5. Signale für die Plattform.**
- Taugt das erste Bild als Vorschaubild?
- Versteht man den Inhalt auch stumm innerhalb von drei Sekunden?
- Nutzt der Clip das Hochformat bewusst, bei Bewegung und Platz für Schrift?

**Zum Schluss immer der Viralformel-Block.** Er ist so aufgebaut, dass das Storyboard Studio ihn
direkt übernehmen kann. Halte dich an die Beschriftungen, fülle jede Zeile aus:

```
VIRALFORMEL:
Hook-Typ: [Art] bei [Sekunde]: [ein Satz Begründung]
Retention: [Mechanik]: [ein Satz, wie sie aufgebaut ist]
Engagement: [Auslöser]: [ein Satz zur Wirkung]
Strukturmuster: [Muster]: [ein Satz zur Umsetzung]
Plattform: [auffällige Signale]
Kern-Bauplan in einem Satz: [die Formel des Videos, auf den Punkt gebracht]
```

## Praxisnotizen

- Gespart wird bei der Bildbreite (512 Pixel), niemals durch Weglassen von Bildern bei kurzen Reels. Dort
  geht Genauigkeit vor.
- Sollen mehrere Videos verglichen werden, analysiere eins nach dem anderen und stelle sie danach
  nebeneinander.
- Typische Einsätze: eigene fertige Renders prüfen, Bildschirmaufnahmen auf Fehler absuchen,
  Konkurrenz-Shorts zerlegen, lange Videos zusammenfassen.
