---
name: newroaster
description: Nutzen, wenn jemand einen neuen Berater in die Expertenrunde (Roast Room) holen will, "/newroaster" sagt, "neuer Berater", "Berater hinzufügen", "füge [Name] zur Runde hinzu", "bau mir einen Berater für [Name]", "ich will [Name] in meiner Runde" oder einen eigenen Berater aus öffentlicher Arbeit bauen will (sich selbst, eine Mentorin oder eine öffentliche Person). Baut den Berater genauso wie die ersten sieben. Findet und lädt die öffentlichen Quellen, zieht Frameworks, Regeln, Positionen, Geschichten und Sprechweise mit parallelen Sub-Agenten heraus, schreibt den Wissensspeicher, prüft, dass jedes Zitat wörtlich stimmt, schreibt den Agenten der Runde, zeichnet das Trickfilm-Porträt über Codex (GPT Image über das ChatGPT-Abo, einheitlicher Stil, vier Sprechbilder) und trägt den Berater in den Roster ein (auf Wunsch in die Standardrunde). Macht auch ein Porträt neu ("/newroaster portrait <name>"). Nicht dafür, eine Runde laufen zu lassen (das ist /roast-room).
argument-hint: "[voller Name] [--quick | --deep] [--pillar \"...\"] [--default] | portrait <name>"
---

## Was der Skill macht

Er holt einen Berater an den Tisch der Expertenrunde (die Oberfläche läuft auf http://localhost:3100). Ein Berater besteht aus vier Dingen, und dieser Skill baut alle vier:

1. **Ein Wissensspeicher (brain):** `.claude/skills/roast-room/brains/<slug>/`, acht Dateien aus der öffentlichen Arbeit der Person, jedes Zitat wörtlich und mit Quellen-ID.
2. **Ein Agent:** `.claude/agents/council-<key>.md`, der Sub-Agent, der aus diesem Wissensspeicher heraus wie die Person denkt und spricht.
3. **Ein Porträt:** vier Trickfilm-Bilder am Tisch (`<key>-base`, `-open`, `-mid`, `-blink`), im einheitlichen Stil der anderen Berater.
4. **Ein Roster-Eintrag:** eine Zeile in `.claude/skills/roast-room/roster.json`, damit `/roast-room` und der Tisch den Berater kennen.

Die Rohquellen bleiben in einem lokalen Build-Ordner, den git ignoriert. Nur der Wissensspeicher wird ausgeliefert.

Build-Ordner: `build/<slug>/` im Projektstamm.

**Sprache:** Alles, was die Nutzerin liest oder gefragt wird, schreibst du auf Deutsch (Du-Form, echte Umlaute, keine Gedankenstriche). Das gilt für Rückfragen, Zwischenstände und den Abschlussbericht. **Wörtliche Zitate im Wissensspeicher bleiben immer in der Originalsprache der Quelle.** Die Zitatprüfung vergleicht Zeichen für Zeichen mit dem Quelltext, eine Übersetzung würde durchfallen. Übersetze also nie ein Zitat. Eine kurze deutsche Umschreibung darf direkt dahinter stehen, ohne Anführungszeichen.

Lies vor dem ersten Lauf: `references/brain-spec.md` (Aufbau und Regeln des Wissensspeichers), `references/extract-prompt.md` (was jeder Extraktions-Agent bekommt), `references/writer-prompt.md` (was jeder Schreib-Agent bekommt), `references/agent-template.md` (der Berater-Agent).

## Wer ein Berater werden kann

- **Öffentliche Personen mit echtem öffentlichem Werk:** Essays, Briefe, Bücher, wie sie sie in Vorträgen vermitteln, lange Interviews mit der Person als Hauptsprecherin, Keynotes, eigener Kanal oder eigener Podcast. Lebend oder historisch.
- **Die Nutzerin selbst oder jemand, der zugestimmt hat:** gebaut aus Material, das die Nutzerin liefert (Beiträge, Transkripte, Notizen). Dafür `--add` in Schritt 3.
- **Nicht:** erfundene Figuren, Privatpersonen ohne Zustimmung oder Menschen mit zu dünnem öffentlichem Werk. Unter etwa 15 brauchbaren Quellen oder 60.000 Wörtern sagst du das offen und bietest `--quick` mit Warnung an, oder eine andere Person.

Der Berater ist eine Simulation, nicht die Person. Der Agent sagt das, wenn man ihn fragt, und zitiert nur, was in seinem Wissensspeicher steht.

## Tiefe

| Flag | Quellen | Wörter | Extraktions-Agenten | Wofür |
|---|---|---|---|---|
| `--quick` | 12 bis 20 | 80k+ | 2 bis 3 | Jemanden ausprobieren |
| Standard | 30 bis 50 | 250k+ | 4 bis 6 | Ein Berater, den du wirklich nutzt |
| `--deep` | 80+ | 500k+ | 8 bis 12, in Wellen | So gründlich wie die zwölf mitgelieferten Berater |

Qualität schlägt Menge: Eine 90-Minuten-Keynote ist mehr wert als zehn Clips à 6 Minuten.

## Schritt 1: Wer und welcher Platz

Hol aus der Nachricht der Nutzerin den vollen Namen der Person. Fehlt unten etwas, frag in einem einzigen AskUserQuestion-Block (höchstens vier Fragen), mit deinem besten Vorschlag als erster Option. Fragen und Optionen schreibst du auf Deutsch.

1. **Säule und Frage, die der Berater besitzt.** Schlag eine vor, passend zu dem, wofür die Person bekannt ist, und formuliert wie die bestehenden Berater in `roster.json`. Beides schreibst du auf Deutsch. Beispiel: Säule "Angebote, Preise und Verkauf", Frage "Zahlen die Leute, wie viel, und wie schließen wir ab?". Die Säule hat ein paar Wörter, die Frage ist eine schlichte Frage, die sich einer Gründerin stellt. Besitzt schon ein Berater diese Säule, schlag einen schärferen Blickwinkel vor, damit die beiden streiten, statt sich zu wiederholen.
2. **Standardrunde?** Soll die Person bei jeder Runde am Tisch sitzen, oder auf Abruf bleiben (`--seats` und `ask`)? Hat die Standardrunde schon neun Plätze, frag, wen sie ersetzt.
3. **Tiefe:** quick, Standard oder deep (Standard, wenn nichts gesagt wird).

Dann legst du die Namen fest: `key` (kurz, Kleinbuchstaben, nur Buchstaben, im Roster einmalig, meist der Nachname: `naval`, `drucker`; der Vorname, wenn ein anderer Berater den Nachnamen schon hat: `leila`), `slug` (`vorname-nachname`), `short` (wie die Runde die Person nennt: "Naval", "Leila") und die Bewertungs-`dimension` (ein paar Wörter dafür, was dieser Berater bewertet, auf Deutsch, zum Beispiel "Angebotsstärke und Stückwirtschaft").

Prüf zuerst den Roster: Hat die Person schon einen Platz, hör auf und biete an, ihn aufzufrischen (ab Schritt 3 mit demselben Slug, `fetch` überspringt Quellen, die schon in `sources.json` stehen).

## Schritt 2: Quellen finden

Bau mit WebSearch eine Quellenliste, die beste zuerst. Such nach:

- Eigener Website, Blog, Essays, Newsletter-Archiv oder Briefen (der reichhaltigste Text, mit Datum).
- Langen Vorträgen und Keynotes, in denen die Person spricht.
- Langen Interviews und Podcasts, in denen sie die Hauptgästin ist (ihr eigener Podcast zählt).
- Ihren Büchern, wie sie sie öffentlich vermittelt: Autorenvorträge, Interviews zum Buch, kostenlos veröffentlichte Kapitel. Nie raubkopierten oder hinter einer Bezahlschranke liegenden Buchtext laden.
- Neuem Material (letzte zwei Jahre), damit `positions.md` die aktuellen Ansichten zeigt, und einer Streuung über die Jahre, damit Meinungswechsel sichtbar werden.

Überspring Clips unter etwa 10 Minuten, Fan-Zusammenschnitte, Reaktionsvideos und Beiträge, in denen jemand anderes das meiste redet. Schreib die URLs nach `<build>/urls.txt`, eine pro Zeile, mit einer `# Überschrift`-Zeile pro Gruppe. Plane die Quellenzahl der gewählten Tiefe plus etwa 20 Prozent ein, weil einige scheitern.

## Schritt 3: Laden

```bash
node .claude/skills/newroaster/scripts/fetch.mjs <build> --list <build>/urls.txt
```

Jede Quelle wird zu `<build>/corpus/S001-<titel>.md` und in `<build>/sources.json` eingetragen. Pro URL steht `ok`, `skip`, `thin` (Bezahlschranke oder JavaScript-Seite) oder `fail` da, danach ein Überblick. YouTube läuft über yt-dlp, wenn es installiert ist, sonst über die Untertitel von YouTube. Für lokales Material, das die Nutzerin dir gibt:

```bash
node .claude/skills/newroaster/scripts/fetch.mjs <build> --add pfad/zur/datei.md --title "..." --date 2024-05-01
```

Kam eine Quelle dünn oder gar nicht zurück, such eine andere Fassung (eine Transkript-Seite, eine Kopie bei archive.org) oder ersetz sie. Ein PDF ohne `pdftotext` wird als `pending-*.pdf` gespeichert: Lies es mit dem Read-Werkzeug, speichere den Text als `.md` und nimm ihn mit `--add` auf. Lauf so lange erneut, bis der Überblick das Ziel der Tiefe erreicht, öffne dann zwei oder drei Corpus-Dateien und prüf, dass es sauberer Text der richtigen Person ist. Notiere die Zeilenzahlen aus dem Überblick für den Abschlussbericht.

## Schritt 4: Herausziehen (map)

Teil die Quellen in Pakete von etwa 50.000 Wörtern (ein 90-Minuten-Vortrag hat etwa 13.000, ein langer Essay 5.000). Starte pro Paket einen Extraktions-Agenten, alle in **einer Nachricht**, parallel, im Vordergrund: `subagent_type: general-purpose`, `model: sonnet`, mit dem Prompt aus `references/extract-prompt.md` (Name, Säule und Frage des Beraters, Quellen-IDs und Dateipfade des Pakets und die Notizdatei eintragen). Höchstens sechs gleichzeitig, bei `--deep` in Wellen.

Jeder Agent schreibt `<build>/notes/batch-NN.md`. Warte, bis alle gemeldet haben. Dann prüf jedes Zitat in den Notizen:

```bash
node .claude/skills/newroaster/scripts/check_quotes.mjs <build> <build>/notes
```

Beheb, was gemeldet wird: eine falsche Quellen-ID korrigieren, ein nicht auffindbares Zitat löschen. Notizen ohne prüfbares Zitat dürfen als Umschreibung bleiben, markiert mit "abgeleitet aus S0xx". Die Notizen und der Wissensspeicher sind Arbeitsmaterial: Die Zitate darin bleiben in der Originalsprache der Quelle, die Umschreibungen und Überschriften dürfen deutsch sein.

## Schritt 5: Wissensspeicher schreiben (reduce)

Leg `.claude/skills/roast-room/brains/<slug>/` an. Schreib `sources.md` mit dem Skript:

```bash
node .claude/skills/newroaster/scripts/fetch.mjs <build> --sources-md .claude/skills/roast-room/brains/<slug>/sources.md --name "Voller Name"
```

Dann starte drei Schreib-Agenten in einer Nachricht, parallel (`general-purpose`, Standardmodell), mit dem Prompt aus `references/writer-prompt.md`. Jeder liest alle Notizdateien plus `references/brain-spec.md` und schreibt seine Dateien in den Ordner des Wissensspeichers, nach Umfang und Regeln der Spezifikation:

- Schreiber A: `frameworks.md`, `principles.md` und `books.md`.
- Schreiber B: `positions.md` und `stories.md`.
- Schreiber C: `voice.md`.

Sag jedem Schreiber Säule und Frage des Beraters, den Build-Ordner (damit er den Kontext eines Zitats in einer Corpus-Datei nachsehen kann) und dass jedes Zitat genau aus den Notizen übernommen wird, mit Quellen-ID, in der Originalsprache. Die Schreiber schreiben nur ihre eigenen Dateien.

Sind sie zurück, schreibst du `_hot.md` selbst aus den sechs fertigen Dateien (die Spezifikation nennt, was hineingehört, auch "wo diese Linse danebenliegt"). Prüf dann den ganzen Wissensspeicher:

```bash
node .claude/skills/newroaster/scripts/check_quotes.mjs <build> .claude/skills/roast-room/brains/<slug>
```

Beheb Fehler, bis es durchläuft: jedes Zitat wörtlich, jede ID richtig. Lies `_hot.md` noch einmal so, wie der Agent es liest: Es soll dir in unter 800 Wörtern sagen, wie diese Person entscheidet, mit ihren eigenen Worten.

## Schritt 6: Agent schreiben

Schreib `.claude/agents/council-<key>.md` nach `references/agent-template.md`. Füll jede Klammer aus dem Wissensspeicher: die Linse (fünf oder sechs Fragen, die diese Person an jede Entscheidung stellt), wie sie spricht (aus `voice.md`), wie sie streitet (nenn ihre natürlichen Gegner unter den Beratern in `roster.json` und was sie zugesteht, aus "wo diese Linse danebenliegt") und die Nie-Liste. Die Beschreibung nennt die Säule, die Zahl der Quellen, woraus der Wissensspeicher gebaut ist, und die Auslöser ("was würde [Name] sagen"). Der Agent antwortet auf Deutsch, dafür sorgt der Abschnitt "Language" im Template: Lass ihn drin.

## Schritt 7: Berater eintragen

```bash
node .claude/skills/newroaster/scripts/add_seat.mjs --key <key> --name "<Voller Name>" --short "<Kurzname>" --slug <slug> --pillar "<Säule>" --question "<Frage>" --dimension "<Dimension>" [--default] [--swap <key>]
```

Säule, Frage und Dimension sind deutsch. Beispiel aus dem Roster: Säule "Angebote, Preise und Verkauf", Frage "Zahlen die Leute, wie viel, und wie schließen wir ab?", Dimension "Angebotsstärke und Stückwirtschaft". Die Farbe (`--color`) kommt nur aus dieser Palette: #8A2434, #BB3146, #F0A442, #EC8D13, #D57F11, #C9A227, #B5652B, #7A4A2A, #A34A28, #5E1A26, #D9C3B0, #9C6B3E. Nie Pflaume, Beere, Rosa oder Lila. Ohne `--color` wählt das Skript die nächste freie Farbe der Palette.

Das Skript bricht ab, wenn die Agent-Datei oder eine Datei des Wissensspeichers fehlt. `--default` setzt den Berater in die Standardrunde, `--swap <key>` nimmt im selben Zug einen anderen heraus. Danach:

- Trag eine oder zwei Zeilen "natürliche Spannung" für den neuen Berater in `.claude/skills/roast-room/references/seats.md` ein (mit wem er aneinandergerät und worüber).

## Schritt 8: Porträt

Jeder Berater bekommt ein echtes Porträt. Lass keinen neuen Berater auf der gezeichneten Platzhalter-Büste stehen. Das Porträt läuft über Codex (die Codex-CLI, GPT Image über das ChatGPT-Abo, keine Credits) und zeichnet im einheitlichen, Pixar-artigen Trickfilmstil auf grünem Grund. Danach baut `build_portraits.py` die vier Sprechbilder. Porträt-Ordner: `build/portraits/<key>/` (git ignoriert). Bilder-Ordner: `app/public/portraits/`.

1. **Foto (optional, aber ähnlicher).** Ein aktuelles, klares Frontalfoto der Person allein aus einer offiziellen Quelle: ihr eigener YouTube-Kanal (`yt-dlp -J --flat-playlist --playlist-items 0 https://www.youtube.com/@handle` listet `avatar_uncropped`, ersetz dessen `=s0` durch `=s900`), ihre eigene Website oder ihr Foto bei Wikipedia oder Wikimedia Commons. Keine Logos, Gruppenfotos oder Seitenprofile. Für die Nutzerin oder eine Mentorin, die aus eigenem Material gebaut wird, nimm ein Foto, das sie dir gibt. Speichere es als Datei und sieh es dir mit Read an: Stimmt die Person, ist das Gesicht klar? Ohne Foto genügt der Name, die Ähnlichkeit ist dann geringer.
2. **Aufruf:**

```bash
python .claude/skills/newroaster/scripts/portrait_codex.py <key> "<Voller Name>" --look "<Kleidung, keine Logos>" [--photo <foto.jpg>]
```

   Beschreib bei `--look` die Kleidung und das Markenzeichen der Person (Brille, Kette, Hemd), aber keine Logos. Das Skript lässt Codex zuerst `base.png` zeichnen, danach `open.png` (Mund offen), `mid.png` (Mund "o") und `blink.png` (Augen zu), und ruft am Ende `build_portraits.py build` auf. Das legt die vier Bilder `<key>-*.webp` nach `app/public/portraits/`.
3. **Prüfen:** Öffne `build/portraits/<key>/review.jpg` (bei eigenem `--dir` dort): vier Bilder, dasselbe Gesicht, kein grüner Rand, nur Mund und Augen ändern sich. Sitzt der Kopf im Vergleich zu den anderen zu klein oder zu groß, bau mit `python .claude/skills/newroaster/scripts/portrait_codex.py <key> "<Name>" --only build` neu, oder direkt mit `build_portraits.py build <ordner> <key> --out app/public/portraits --zoom 0.9` bzw. `--zoom 1.1`.
4. **Ähnlichkeit zu schwach?** Lösch `base.png` im Porträt-Ordner und lauf noch einmal, am besten mit einem Foto oder einer genaueren `--look`-Beschreibung (Haarfarbe, Brille, Bart). Vorhandene Dateien überspringt das Skript.

Gebraucht werden die Codex-CLI (angemeldet mit dem ChatGPT-Abo) sowie Python mit `opencv-python` und `numpy` (`pip install opencv-python numpy`, falls der Bau-Schritt sie vermisst). **Ohne Codex-CLI** schließt du den Berater trotzdem ab: Der Tisch zeigt dann einen gezeichneten Platzhalter. Sag der Nutzerin in einer Zeile, dass sie das Porträt später mit `/newroaster portrait <name>` nachholen kann, sobald Codex läuft.

**Nur Porträt** (`/newroaster portrait <name>` oder ein Berater, der den Platzhalter zeigt): Führ nur diesen Schritt für einen Berater aus, der schon in `roster.json` steht, mit dessen `key`, und sag der Nutzerin dann, sie soll den Tisch neu laden.

## Schritt 9: Berater testen

Neue Agent-Dateien werden beim Start von Claude Code geladen. Teste deshalb mit dem Ausweichweg, den die Runde selbst nutzt: Starte `general-purpose` mit `Read .claude/agents/council-<key>.md and follow it as your instructions for this whole task. Only read files; do not write anything.`, gefolgt vom Prompt für die Einzelberatung aus `.claude/skills/roast-room/references/round-prompts.md`, an einer kurzen Beispielentscheidung in der Säule des Beraters. Prüf dann die Antwort:

- Sie klingt nach der Person (vergleich mit `voice.md`), steht in der Ich-Form und behauptet nie, die Person zu sein.
- Sie ist auf Deutsch (Du-Form), nur wörtliche Zitate stehen in der Originalsprache.
- Sie nennt Frameworks mit Quellen-IDs, und jedes Zitat besteht `check_quotes.mjs` (speichere die Antwort unter `<build>/test-consult.md` und lass den Prüfer darüberlaufen).
- Sie besitzt ihre Säule, statt allgemeinen Rat zu geben.

Fällt sie durch, korrigier den Agenten oder `_hot.md` und teste einmal neu.

## Schritt 10: Bericht

Sag der Nutzerin in unter 150 Wörtern, auf Deutsch:

- Wer hinzugekommen ist, mit Säule und Frage, und ob der Berater in der Standardrunde sitzt.
- Den Wissensspeicher: Quellen, Wörter, abgedeckte Jahre und die geschriebenen Dateien.
- Wie sie ihn jetzt nutzt: `/roast-room ask <key> ...` für eine einzelne Antwort, `/roast-room --seats <key>,buffett,... ...`, um ihn an den Tisch zu setzen, und `/roast-room board`, um die Standardrunde zu ändern.
- Eine Zeile: Claude Code neu starten (oder eine neue Sitzung öffnen), damit der Berater als eigener Agent-Typ geladen wird. Bis dahin nutzt die Runde automatisch den Ausweichweg.
- Eine Zeile: Das Porträt ist am Tisch (Seite neu laden), oder, wenn keine Codex-CLI verfügbar war, dass dort ein Platzhalter steht, bis `/newroaster portrait <name>` läuft.

## Ohne Sub-Agenten (Codex oder eine Umgebung, die keine Agenten starten kann)

Führ Schritt 4 und 5 selbst aus, ein Paket nach dem anderen: Zieh ein Paket in seine Notizdatei heraus, dann das nächste. Schreib die Dateien des Wissensspeichers nacheinander aus den Notizen. Alles andere bleibt gleich.

## Regeln

- Nur öffentliche und rechtmäßige Quellen. Der Corpus bleibt im Build-Ordner und wird nie eingecheckt oder weitergegeben. Der Wissensspeicher enthält kurze Zitate (unter 45 Wörtern) und Umschreibungen, nie Buchtext.
- Jedes Zitat im Wissensspeicher ist wörtlich, in der Originalsprache der Quelle, und besteht `check_quotes.mjs`. Eine Zeile ohne Quelle ist Schlussfolgerung und sagt das.
- Fass die Wissensspeicher und Agenten der anderen Berater nicht an. Im Roster ändern sich nur `"seats"` und `"default"`, und zwar über `add_seat.mjs`.
- Alles, was du selbst für die Nutzerin schreibst, ist Deutsch: kurze Sätze, Du-Form, echte Umlaute, keine Gedankenstriche, keine Füllsätze.
- Zu jedem Berater gehört ein Porträt im einheitlichen Trickfilmstil über `portrait_codex.py`. Ohne Codex-CLI gibt es den Platzhalter und den späteren Befehl `/newroaster portrait <name>`.
- Kosten: Ein Standard-Berater braucht etwa 8 bis 10 Sub-Agenten-Läufe und vier bis fünf Codex-Bildaufträge über das ChatGPT-Abo, ohne Credits. Sag, welche Tiefe du genommen hast.
