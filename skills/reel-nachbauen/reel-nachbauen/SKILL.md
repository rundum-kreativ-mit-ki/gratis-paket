---
name: reel-nachbauen
description: Baut aus einem Instagram-Reel, das gut läuft, ein eigenes animiertes Reel im Pixar-Look, mit eigenen Figuren (aus eigenen Fotos oder frei beschrieben) und Seedance 2.0 über Higgsfield. Führt Schritt für Schritt von der Einrichtung (Python, ffmpeg, yt-dlp, Higgsfield-Konnektor) über Analyse, Übertragung, Figurenblatt, Storyboard, Seedance-Prompts und Prüfung bis zum fertigen 9:16-Video. Nutzen bei „bau dieses Reel nach“, „Reel nachbauen“, „mach daraus mein eigenes Reel“, „Pixar-Reel aus diesem Link“, „/reel-nachbauen“, oder wenn jemand einen Instagram-Link schickt und ein eigenes Reel daraus will.
---

# Reel nachbauen

Du führst den Menschen vor dir von einem Instagram-Link bis zum fertigen eigenen Reel. Er hat meist keinen
Technik-Hintergrund. Sprich Deutsch, kurz und freundlich, erkläre jedes Werkzeug in einem Satz, bevor du es
benutzt, und mach immer nur einen Schritt auf einmal. Nach jedem Schritt: sagen, was fertig ist und was als
Nächstes kommt.

## Befehle in dieser Anleitung

- `<PY>` heißt auf Windows `py`, auf dem Mac `python3`. Auf Windows nie `python` schreiben: Das öffnet dort
  nur den Microsoft Store.
- `<SKILL>` ist der Ordner, in dem diese SKILL.md liegt, meist `C:/Users/<name>/.claude/skills/reel-nachbauen`
  (Windows) oder `~/.claude/skills/reel-nachbauen` (Mac). Ermittle ihn einmal am Anfang und setze ihn in jeden
  Skriptaufruf als vollen Pfad ein. Der Arbeitsordner des Nutzers ist ein anderer.
- `<REEL>` ist der Ordner des aktuellen Reels (siehe Grundregel 5).

Erprobt auf Windows 11. Der Mac-Weg steht in den Anleitungen, ist aber nicht gegengetestet; sag das, wenn
jemand auf dem Mac arbeitet.

## Grundregeln, immer

1. **Nachbauen heißt: Aufbau und Idee übernehmen, nicht kopieren.** Eigene Figuren, eigene Geschichte, eigener
   Ort. Nie fremde Figuren, Gesichter, Logos, Marken oder Bildausschnitte aus dem Vorbild verwenden, nie das
   fremde Video selbst weiterverwenden. Das Vorbild wird nur angesehen. Bei Zweifeln, ob etwas zu nah am
   Vorbild ist: sagen und eine eigene Variante vorschlagen. Rechtliche Fragen nicht beantworten, sondern auf
   eine Fachperson verweisen.
2. **Kosten nur mit Ja.** Vor jeder Erzeugung bei Higgsfield den Preis mit `get_cost: true` abfragen, nennen
   und auf ein ausdrückliches Ja warten. Nie ungefragt teurere Einstellungen wählen. Am Anfang einmal den
   Kontostand mit `balance` zeigen und am Ende die Summe nennen.
3. **Nichts ungefragt installieren.** Vor jeder Installation sagen, was das Programm tut, und auf Ja warten.
4. **Konten, Passwörter, Zahlungen macht der Mensch selbst.** Du sagst genau, wo er klickt, und prüfst danach
   mit einem echten Aufruf, ob es geklappt hat. Erst probieren, dann melden: nie behaupten, etwas fehle,
   bevor ein kleiner Testaufruf fehlgeschlagen ist.
5. **Ein Ordner pro Reel.** Alles landet in `Reels/<datum>_<kurzname>/` im Dokumente-Ordner des Nutzers
   (oder wo er es will): `vorbild/`, `figuren/`, `storyboard/`, `seedance/`, `clips/`, `pruefung/`, `fertig/`.
   Nenne immer den vollen Pfad.
6. **Kennzeichnung:** Wirkt das Ergebnis wie echt (fotorealistisch), auf die KI-Kennzeichnung bei Instagram
   hinweisen (EU AI Act). Pixar-Look ist klar erkennbar animiert; im Zweifel trotzdem kennzeichnen.
7. **Bei Unsicherheit** darf der Mensch jederzeit fragen, auch mit einem Screenshot. Sag ihm das am Anfang.

## Station 0: Einrichtung

Lies `anleitungen/einrichtung.md` und führe sie aus. Kurz:
- `<PY> "<SKILL>/skripte/einrichtung_pruefen.py"` prüft Python, ffmpeg, ffprobe, yt-dlp und curl und sagt,
  was fehlt.
- Fehlendes nach Ja installieren (Windows: winget, Mac: Homebrew), danach erneut prüfen.
- Higgsfield verbinden nach `anleitungen/higgsfield-verbinden.md`, dann mit dem Werkzeug `balance` testen.
  Kommt ein Kontostand zurück, ist alles bereit.

Erst wenn alles grün ist, weiter.

## Station 1: Vorbild holen und verstehen

1. Link entgegennehmen. `<PY> "<SKILL>/skripte/reel_laden.py" "<link>" "<REEL>/vorbild"` lädt das Video und die
   Beschreibung (`vorbild.info.json`, Feld `description` ist die Caption des Vorbilds).
   Scheitert es (Instagram sperrt oft): den Nutzer bitten, das Reel selbst zu speichern oder per
   Bildschirmaufnahme aufzunehmen und die Datei in den Ordner `vorbild/` zu legen.
2. `<PY> "<SKILL>/skripte/kontaktbogen.py" "<video>" "<REEL>/pruefung/vorbild-kontakt.jpg"` und das Bild ansehen.
3. **Ton:** Du kannst die Tonspur nicht hören. Frag den Nutzer in einem Satz, ob im Vorbild gesprochen wird,
   ob Musik läuft und ob Geräusche die Pointe tragen. Seine Antwort fließt in die Analyse.
4. Analyse in 5 bis 8 Zeilen zeigen: Länge, Anzahl Einstellungen, Tempo (Schnitte pro Sekunde), Aufbau
   (Einstieg, Steigerung, Pointe), Ton, und **warum es funktioniert** in einem Satz.

## Station 2: Übertragen

Frag, eine Frage nach der anderen:
1. Für welchen Kanal und welche Branche ist das Reel?
2. Wer spielt mit? Der Nutzer selbst, sein Haustier (dann Fotos davon) oder eine frei erfundene Figur (dann
   nur eine Beschreibung). Spielt ein Gegenstand eine Rolle (Saugroboter, Föhn, Kaffeemaschine), ihn hier
   schon festhalten.
3. Ort und Requisiten aus seinem Alltag.
4. **Wie nah am Vorbild?** Immer fragen, mit Empfehlung „nah“:
   - **Nah (Standard):** Figurenkonstellation, Schlüsselmomente, Schauplatz-Art und Pointe bleiben so, dass
     jemand, der das Vorbild kennt, es sofort wiedererkennt. Getauscht werden die Figuren (eigene statt
     fremde), ihr Aussehen und Details. Beispiel: Im Vorbild plustert sich ein winziger Hund im Hundesalon vor
     einem riesigen, gelassenen Hund auf und springt am Ende der Groomerin in die Arme. Nah heißt: der eigene
     kleine Hund, ein eigener großer, gelassener Hund, ein Salon oder Wartezimmer, am Ende in die Arme des
     Nutzers.
   - **Frei:** Nur die Formel wandert in eine andere Welt (kleiner Hund gegen Saugroboter im Homeoffice).
     Nur auf ausdrücklichen Wunsch.

Dann eine **Übertragung** vorschlagen, als Tabelle: Vorbild | Neu, Szene für Szene. Darunter zwei Zeilen:
- **Spannung:** Was ist die Spannung, die bis zum Schluss trägt (klein gegen groß, Erwartung gegen
  Wirklichkeit, ein Hindernis, ein Geheimnis)? Lautet die ehrliche Antwort „es ist halt süß“, neu bauen.
- **Wiedererkennbar:** Erkennt jemand, der das Vorbild kennt, es wieder? Bei „nah“ muss die Antwort Ja sein.
Auf Freigabe warten.

Länge: in Kapiteln zu 15 Sekunden, meist zwei Kapitel, also rund 30 Sekunden. Ist das Vorbild länger, die
stärksten Beats auswählen und auf 30 Sekunden verdichten; das in der Tabelle sagen. Jedes Kapitel bekommt etwa
zwölf Einstellungen, also ungefähr ein Schnitt pro Sekunde. Möglichst ein Ort je Kapitel.

## Station 3: Figuren

Je Figur ein Figurenblatt über Higgsfield, Modell `gpt_image_2_5`, `quality: medium`, `resolution: 2k`,
`aspect_ratio: 3:2` (etwa 1 Credit, vorher `get_cost`). Vorlagen in `vorlagen/figurenblatt-prompt.txt`:
- **Mit Foto** (Haustier, der Nutzer selbst): Foto hochladen nach `anleitungen/hochladen.md`, als
  `image_references` mitgeben.
- **Ohne Foto** (erfundene Figur): Vorlage „OHNE FOTO“, nur Textbeschreibung, keine Referenz.

Prüfen: gleiche Figur in jeder Ansicht, Farben und Merkmale wie gewünscht, kein Halsband, wenn keins
gewünscht, bei Menschen vier Finger und ein Daumen je Hand. Dem Nutzer zeigen, er wählt.

Danach **je Figur ein Einzelbild** für Seedance ausschneiden (die Vorderansicht):
- Tier-Blatt: `<PY> "<SKILL>/skripte/ausschnitt.py" "<figurenblatt>" "<REEL>/figuren/<name>-einzel.jpg" --art tier`
- Menschen-Blatt: dasselbe mit `--art mensch`
Das Ergebnis immer ansehen: genau eine Figur, nicht angeschnitten. Passt der Ausschnitt nicht, mit
`--x --y --b --h` (Anteile der Bildbreite und -höhe) nachjustieren.

## Station 4: Storyboard (nur zur Planung) und Startbilder

1. Je Kapitel ein Storyboard-Blatt mit zwölf Feldern über Higgsfield (`gpt_image_2_5`, `3:2`, `medium`, `2k`),
   Vorlage `vorlagen/storyboard-prompt.txt`, Figurenblätter als Referenz. Das Storyboard dient nur dem Nutzer
   zum Freigeben. **Seedance bekommt es nicht**, sonst entstehen doppelte Figuren.
2. Beim Planen gelten diese Storyboard-Regeln:
   - **Handlung statt Pose:** Jedes Feld zeigt, dass etwas passiert (ein Verb) und eine Gefühlsregung.
   - **Einstieg:** Feld 1 ist eine Großaufnahme als Haken, in den ersten 2 Sekunden keine Totale.
   - **Spannung über die ganze Länge**, aufgelöst erst am Schluss. Kapitel vor dem letzten enden mitten in
     einer Bewegung (Cliffhanger), nur das letzte Kapitel landet die Pointe.
   - **Anschluss:** Feld 1 von Kapitel N beginnt genau dort, wo Kapitel N-1 aufgehört hat; diesen Zustand
     ausdrücklich beschreiben.
   - **Jedes Kapitel steht für sich:** Figurenbeschreibung (Cast lock), Stil und Ort stehen in jedem Kapitel
     wortgleich, nie „wie in Kapitel 1“. Das Werkzeug sieht jedes Kapitel einzeln.
   - **Tiere weinen nicht:** Gefühle nur über Haltung, Ohren, Maul und Blick.
   - Lehren aus `anleitungen/seedance-regeln.md`: Türen gehen nie von allein auf, wer reagiert, schaut zum
     Geschehen, Verwandlungen nur als klarer Moment.
3. **Erst nach der Freigabe der Storyboards** je Kapitel ein Startbild (erstes Bild des Films):
   `gpt_image_2_5`, `aspect_ratio: 9:16`, `quality: medium`, `resolution: 2k`, Figurenblätter als Referenz.
   **Ab Kapitel 2 zusätzlich das Startbild von Kapitel 1 als Referenz** und im Prompt „same room, same
   furniture, same lighting as the reference still“, damit Raum und Figuren gleich bleiben.
   Startbild zeigt nichts, was nicht im Film sein soll, und keine Schrift auf Geräten.

## Station 5: Seedance-Prompts

Je Kapitel eine Datei `<REEL>/seedance/kapitel-N.txt` nach `vorlagen/seedance-prompt-vorlage.txt`:
- Figuren mit @Image-Nummern. **Feste Merkmale je Figur wörtlich in jedes Kapitel** (Haarfarbe, Kleidung,
  Zubehör wie Brille oder Headset), sonst wechseln sie zwischen den Kapiteln.
- Mitspielende Gegenstände im Block `[Objects]`, mit „plain surface, no logo, no lettering“.
- Stil, Kamera, zwölf Zeitblöcke `[00:00 - 00:01]`, Character lock, Ort-Lock („same room as in chapter 1“).
- Ton: ohne Musik, nur Geräusche. Musik kommt später in der Instagram-App dazu.
- Negatives.

Seedance spricht kein gutes Deutsch: Reels ohne Sprache sind am einfachsten. Dem Nutzer die Zeitblöcke auf
Deutsch zusammengefasst zeigen.

## Station 6: Erzeugen

1. Bilder hochladen (`anleitungen/hochladen.md`): je Kapitel das Startbild und je Figur das Einzelbild.
2. `generate_video` mit `model: seedance_2_0`, `mode: fast`, `resolution: 480p`, `aspect_ratio: 9:16`,
   `duration: 15`, `genre` passend zum Inhalt (zum Beispiel `comedy`; die erlaubten Werte zeigt
   `models_explore` mit `action: get` und `model_id: seedance_2_0`). Startbild mit Rolle `start_image`,
   Figuren mit Rolle `image_references` in der Reihenfolge der @Image-Nummern im Prompt.
3. Erst `get_cost: true`, Preis nennen (Stand Oktober 2026: 15 Credits je 15 Sekunden in 480p), auf Ja warten.
4. Kommt ein Preset-Vorschlag zurück (fast immer „IN THE DARK“): genau dieselben Parameter plus
   `declined_preset_id` mit der ID aus der Antwort erneut senden.
5. Kapitel dürfen gleichzeitig laufen. Dem Nutzer sagen: Das dauert meist 3 bis 6 Minuten. Mit `jobs_wait`
   abholen, Videos mit `curl -s -o "<REEL>/clips/kapitel-N.mp4" "<result_url>"` laden.
6. Endet ein Auftrag mit `ip_detected`: Die Credits kommen zurück. Das Figurenbild, das wie eine bekannte
   Figur wirkt, weglassen und die Figur nur im Text beschreiben, dann neu senden.

## Station 7: Prüfen

Für jeden Clip `<PY> "<SKILL>/skripte/kontaktbogen.py" "<clip>" "<REEL>/pruefung/kontakt-kN.jpg"` und ansehen,
mit `anleitungen/pruefliste.md`. Kritische Stellen genauer:
`<PY> "<SKILL>/skripte/kontaktbogen.py" "<clip>" "<bild>" --ab <sek> --dauer <sek> --fps 5`.
**Schrift auf Gegenständen** sieht man im Kontaktbogen kaum: Szenen mit Geräten, Schildern oder Bildschirmen
als Einzelbild in voller Größe ansehen (`--ab <sek> --dauer 0.1 --fps 1 --breite 1080`).
Fehler dem Nutzer mit Zeitangabe zeigen. Lösungen, günstigste zuerst: wegschneiden, Kapitel kürzen, nur ein
Kapitel neu erzeugen (Kosten nennen).

## Station 8: Schnitt

1. Schnittstellen finden: `<PY> "<SKILL>/skripte/schnitt.py" --schnitte "<clip>"` listet die Zeiten, an denen
   Seedance schneidet.
2. Eine Schnittliste `<REEL>/fertig/schnittliste.json` schreiben (Datei, von, bis je Einstellung). Reihenfolge
   der Geschichte nie umstellen. Gekürzt wird am Ende einzelner Einstellungen: Ziel 25 bis 30 Sekunden,
   ruhige Einstellungen (Gehen, Warten) eher kürzen, Pointe und Reaktionen ganz lassen.
3. `<PY> "<SKILL>/skripte/schnitt.py" "<REEL>/fertig/schnittliste.json" "<REEL>/fertig/reel.mp4"` setzt alles
   zusammen, mit kurzen Tonblenden, hochgerechnet auf 1080 × 1920, Lautheit etwa −14 bis −16 LUFS.
4. Kontaktbogen vom fertigen Reel ansehen, besonders die Übergänge zwischen den Kapiteln.

## Station 9: Titel und Thumbnail

1. **Titel vorschlagen:** zwei Zeilen, oben groß ein bis zwei Wörter, darunter klein ein halber Satz, der
   neugierig macht (Muster: „BADEZOOMIES“ / „und das frische Blumenbeet …“). Zwei, drei Vorschläge zeigen,
   der Nutzer wählt. Keine Gedankenstriche, echte Umlaute.
2. **Titelgrafik** über Higgsfield, `gpt_image_2_5`, `aspect_ratio: 3:2`, `quality: medium`,
   `resolution: 2k`, `background: transparent`, Vorlage `vorlagen/titel-thumbnail-prompt.txt` (Teil
   TITELGRAFIK). Ansehen: Schreibweise Buchstabe für Buchstabe prüfen, Hintergrund wirklich durchsichtig.
3. **Titel ins Video:**
   `<PY> "<SKILL>/skripte/titel_einblenden.py" "<REEL>/fertig/reel.mp4" "<REEL>/fertig/titel.png" "<REEL>/fertig/reel-mit-titel.mp4"`
   blendet den Titel oben in den ersten 3 Sekunden ein (`--bis`, `--oben` zum Anpassen). Standbild bei
   1,5 Sekunden ansehen: Titel nicht abgeschnitten, Gesichter frei.
4. **Thumbnail** (Titelbild fürs Reel) über Higgsfield, `gpt_image_2_5`, `aspect_ratio: 9:16`,
   `quality: medium`, `resolution: 2k`, Figurenblätter als Referenz, Vorlage Teil THUMBNAIL: die
   Pointen-Szene mit dem Titel. Ansehen: Schreibweise, Figuren wie im Film, Titel mit Abstand zu den Rändern.
   In Instagram beim Posten unter „Titelbild bearbeiten“ hochladen.

## Station 10: Caption und Abschluss

- **Caption** vorschlagen und als Datei `<REEL>/fertig/caption.txt` ablegen: Einstieg mit einem typischen Satz
  der Zielgruppe in Anführungszeichen, eine Gegenfrage, ein echter Tipp zum Thema aus dem Wissen des Nutzers
  (frag ihn danach, statt etwas zu erfinden), eine Einladung (Folgen, Termin, Link in der Bio), Schlussfrage
  an die Leser mit Emoji. Keine Hashtags. Keine Zahlen ohne Quelle, keine Gedankenstriche.
- **Alt-Text** fürs Thumbnail, ein Satz.
- Dem Nutzer alle Pfade nennen (Reel mit Titel, Thumbnail, Caption) und die Kosten zusammenfassen.
- **In der Instagram-App:** Musik aus der Instagram-Bibliothek dazulegen (dort lizenziert, leise unter die
  Geräusche). Bei Pixar-Look ist eine KI-Kennzeichnung meist nicht vorgeschrieben, bei echt wirkenden Bildern
  schon; im Zweifel kennzeichnen.

## Wenn etwas hakt

- `python` öffnet den Microsoft Store: `py` benutzen.
- Skript nicht gefunden: vollen Pfad `<SKILL>/skripte/...` verwenden.
- Werkzeug fehlt nach der Installation: Terminal schließen und Claude Code neu starten (Pfad wird neu geladen).
- Higgsfield-Werkzeuge erscheinen nicht: `anleitungen/higgsfield-verbinden.md`, Abschnitt „Hilfe“.
- Upload mit Fehler 403: immer `curl -X PUT` nehmen, nicht Python.
- Video lädt nicht: Weg von Hand aus Station 1.
