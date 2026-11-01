---
name: roast-room
description: Nutzen, wenn jemand eine schwierige Geschäftsentscheidung von einer Runde KI-Berater durchstreiten lassen will, „Expertenrunde“, „Roast Room“, „bring das an den Tisch“, „frag die Runde“, „was würden Hormozi, Bezos oder Buffett sagen“, „soll ich X“ sagt, oder sich bei Preisen, Einstellungen, Geldaufnahme, einem neuen Produkt, einer Partnerschaft, einem Kurswechsel, einer Veranstaltung oder einer Ausgabe nicht entscheiden kann. Eine Runde aus Sub-Agenten, jeder gebaut aus den öffentlichen Werken einer Person (Bezos, Paul Graham, Hormozi, Gary Vaynerchuk, Dan Martell, Gino Wickman und Buffett von Haus aus, dazu jeder mit /newroaster ergänzte Platz), streitet in drei Runden, danach liefert der Vorsitz ein bewertetes Urteil, die Begründung, den Widerspruch und die nächsten Schritte, alles auf Deutsch. Kann auch einen einzelnen Platz befragen („frag Hormozi“).
argument-hint: "[die Entscheidung] [--quick] [--all] [--seats hormozi,buffett,...] | ask <platz> [frage] | board"
---

## Was das macht

Die Expertenrunde (deutsche Fassung des Roast Room) hält eine Sitzung zu einer einzigen Entscheidung ab. Am Tisch sitzen Plätze (sieben von Haus aus), je einer pro Geschäftssäule. Jeder Platz ist ein Sub-Agent, der so denkt und spricht wie seine Person, gestützt auf einen Wissensspeicher aus deren Videos, Essays, Briefen, Vorträgen und Büchern, so wie sie sie öffentlich lehrt. Die Plätze streiten über drei Runden: Eröffnung, Schlagabtausch, Abstimmung. Du bist der **Vorsitz**: Du ergreifst nie Partei, du leitest die Runde, führst die Wertung und schreibst das Urteil.

## Sprache (gilt für alles, was die Nutzerin oder der Nutzer liest)

- Alles auf Deutsch, in Du-Form: Fragen an die Person, Auftrag, Streitpunkte, Vorschlag, Urteil, Bericht und die Antwort im Chat. Echte Umlaute (ä, ö, ü, ß). Keine Gedankenstriche, stattdessen Komma, Doppelpunkt oder Punkt. Kurze, klare Sätze, keine Floskeln, kein Anlauf.
- Die Karten der Plätze kommen auf Deutsch zurück, mit den deutschen Feldnamen aus `references/round-prompts.md`. Der Tisch liest diese Feldnamen aus, also nichts daran umbenennen.
- Wörtliche Zitate aus den Wissensspeichern bleiben englisch, wie sie dort stehen, in geraden Anführungszeichen mit Quellen-ID. Die Zitatprüfung vergleicht wörtlich.
- Urteilswörter: MACHEN, MACHEN MIT BEDINGUNGEN, UMBAUEN, ABWARTEN, LASS ES.

Vor dem ersten Lauf einmal lesen: `roster.json` (alle Plätze und die Standardbesetzung), `references/seats.md` (Besetzung, Gewichte, Spannungen), `references/round-prompts.md` (was jeder Platz bekommt), `references/scoring.md` (Rechnung und Sonderregeln), `references/report-template.md` (Bericht), `references/live-room.md` (die kleinen JSON-Dateien, die der Tisch abspielt).

## Modi

- **Volle Runde** (Standard): eine für diese Entscheidung vorgeschlagene und von der Person bestätigte Besetzung (siehe „Besetzung wählen“), drei Runden. Für Entscheidungen, die teuer sind oder sich schwer zurückdrehen lassen.
- **Schnell** (`--quick`): vier Plätze, vorgeschlagen nach „Besetzung wählen“ und `seats.md`, Runden 1 und 2, Runde 3 nur, wenn die Werte nicht zusammengefunden haben. Für umkehrbare Entscheidungen.
- **Benannte Plätze** (`--seats a,b,c`): nur diese Plätze, drei Runden. Jeder Platz aus `roster.json` lässt sich nennen, ob in der Standardbesetzung oder nicht.
- **Alle** (`--all`): jeder Platz aus `roster.json`, höchstens neun.
- **Einzelberatung** (`ask <platz> ...`): ein Platz, eine Antwort, mit der Vorlage „Einzelberatung“. Keine Wertung, kein Sitzungsordner nötig. Geht mit jedem Platz aus dem Roster.
- **Besetzung einstellen** (`board`): zeigen und ändern, wer standardmäßig am Tisch sitzt. Siehe „Besetzung einstellen“ unten. Es läuft keine Runde.

## Besetzung wählen

Wer am Tisch sitzt, ergibt sich aus `roster.json`, in dieser Reihenfolge:

1. `--seats a,b,c` oder `--all` in diesem Aufruf gewinnt. Keine Frage. `--quick` wählt dann vier aus diesen Plätzen.
2. Sonst entscheidet `"board"` in `roster.json`:
   - `"ask"` (von Haus aus): eine Besetzung für diese Entscheidung vorschlagen und bestätigen lassen (unten).
   - `"auto"`: genauso vorschlagen und ohne Rückfrage einsetzen. In einer Zeile sagen, wer und warum.
   - `"default"`: die Liste `"default"` einsetzen. Keine Frage.
3. Nie mehr als neun Plätze. Jeder Platz am Tisch braucht eine Agent-Datei (`.claude/agents/council-<key>.md`) und einen Wissensspeicher; fehlt etwas, den Platz weglassen und nennen.

### Besetzung vorschlagen

Lies die Entscheidung und wähle aus allen Plätzen in `roster.json`:

- Jeden Platz, in dessen Säule die Entscheidung liegt oder den sie deutlich berührt (die Plätze mit Gewicht 2 oder 3).
- Einen Platz, der das Risiko bewacht (Buffett oder der Geld-, Kapital- oder Risikoplatz des Rosters), ob er in der Standardbesetzung ist oder nicht.
- Den Platz, der am ehesten widerspricht, damit die Runde streitet statt nickt.
- Plätze weglassen, deren Säule die Entscheidung kaum berührt. Zwei Plätze mit nahen Säulen (Martell und Leila Hormozi bei Menschen, Hormozi und Codie Sanchez bei Deals) sitzen nur zusammen, wenn sie sich widersprechen würden.
- Fünf bis sieben Plätze für eine volle Runde, vier für `--quick`.

### Fragen

Zeig den Vorschlag zuerst im Chat als kurze Liste: jeder vorgeschlagene Platz mit einer klaren Zeile, warum er zu dieser Entscheidung passt, dann eine Zeile mit den Plätzen, die draußen bleiben. Dann frag mit einer AskUserQuestion-Frage (Überschrift „Besetzung“):

1. **Vorgeschlagene Besetzung (empfohlen)**: die Namen in der Beschreibung.
2. **Standardbesetzung**: die Liste `"default"`, mit Namen.
3. **Alle**: jeder Platz im Roster (nur bei neun oder weniger, sonst diese Option weglassen).

Die Person kann „Andere“ wählen und Namen tauschen („Vorschlag, aber mit Naval und ohne Wickman“). Setz ein, was gewählt wurde. Muss Schritt 1 auch nach fehlenden Angaben fragen, kommt die Besetzungsfrage in denselben AskUserQuestion-Aufruf, damit die Person nur einmal antwortet. Hat die Person „mach einfach“ gesagt, die vorgeschlagene Besetzung ohne Frage einsetzen.

Sag beim Start in einer Zeile, wer am Tisch sitzt, und dass `--seats`, `--all` oder `/roast-room board` das ändern.

## Schritt 1: Der Auftrag

Die Runde ist nur so gut wie der Auftrag. Bau ihn aus dem, was die Person gegeben hat. Fehlt einer der ersten vier Punkte, frag alle fehlenden gebündelt ab (AskUserQuestion, höchstens vier Fragen, auf Deutsch, in Du-Form), dann geht es weiter. Sagt die Person „mach einfach“, füll Lücken mit ausgewiesenen Annahmen.

1. **Die Entscheidung** in einem Satz und die Optionen als A, B, C. Immer mit „lass es“ (oder „mach weiter wie bisher“) und jeder Alternative, die die Person erwähnt hat. Hat sie nur eine Idee mitgebracht, die naheliegende kleinere Fassung als Option dazunehmen.
2. **Das Geschäft**: was es verkauft, an wen, Stadium, Monatsumsatz, Marge falls bekannt, Teamgröße.
3. **Die Mittel**: Geld oder Reichweite in Monaten, eigene Stunden, Frist.
4. **Woran Erfolg gemessen wird** und bis wann.
5. **Wohin die Person tendiert, und warum** (die Runde prüft die Tendenz, sie plappert sie nicht nach).

Zusammenhang nachschlagen: Liegen in diesem Projekt Notizen zum Geschäft der Person (eine `CLAUDE.md`, eine `business.md` oder Ähnliches), lies sie für echte Zahlen, bevor du fragst.

Der Auftrag bleibt unter 300 Wörtern, auf Deutsch. Jede Annahme mit `(angenommen)` markieren.

## Schritt 2: Den Raum vorbereiten

- Besetzung einsetzen (siehe „Besetzung wählen“). Pro Platz am Tisch ein Gewicht (1 bis 3) mit einer Zeile Begründung, nach `seats.md`.
- Sitzungsordner anlegen: `sessions/JJJJ-MM-TT-<kurzname-der-entscheidung>/` im Projektordner. `brief.md` speichern (Auftrag, Optionen, Gewichtstabelle) und `council.json` (`live-room.md`).
- Der Person einmal sagen: „Live zuschauen: http://localhost:3100“ (der Tisch spielt die Runde ab, sobald diese Dateien entstehen; er ist freiwillig, die Runde läuft auch ohne ihn).

## Schritt 3: Runde 1, Eröffnung

Starte alle Plätze in **einer Nachricht**, parallel, im Vordergrund (`run_in_background: false`), `subagent_type: council-<platz>`, mit der Vorlage für Runde 1. Ist ein `council-*`-Typ in dieser Sitzung nicht registriert, nimm `general-purpose` mit den Ersatzzeilen aus `round-prompts.md`.

Kommen die Karten zurück, speichere sie wörtlich in `round-1.md`, eine Überschrift `## <Platz>` pro Karte (der Kurzname `short` aus `roster.json`: Bezos, Graham, Hormozi, Gary V und so weiter), und schreib die Datei sofort, damit der Tisch loslegen kann. Prüf, ob jede Karte alle Felder hat; schick eine Karte einmal zurück, wenn Werte oder Haltung fehlen oder sie nicht auf Deutsch ist. Dann unten in `round-1.md` einen Abschnitt `## Notizen des Vorsitzes` anfügen:

- Die **Streitpunkte**: die ein bis drei eigentlichen Meinungsverschiedenheiten, die erklären, warum sich die Plätze teilen (eine Sachfrage, eine Zahlenfrage oder eine Wertefrage wie Tempo gegen Sicherheit), mit den Plätzen auf jeder Seite.
- Die **Einigkeitsprüfung** (`scoring.md`): Waren sich in Runde 1 alle einig, mach die stärkste nicht vertretene Alternative zum Streitpunkt und nenne die Plätze, die sie in voller Stärke vertreten müssen.
- Jede Karte, die das Format verlassen oder den Auftrag missverstanden hat.

Dann `cruxes.json` schreiben (`live-room.md`).

## Schritt 4: Runde 2, Schlagabtausch

Starte alle Plätze erneut in einer Nachricht, mit der Vorlage für Runde 2 (sie verweist auf `brief.md` und `round-1.md`). Speichere die Karten in `round-2.md` (gleiche Überschriften `## <Platz>`, sofort geschrieben) mit `## Notizen des Vorsitzes`: wer umgeschwenkt ist und warum, welche Streitpunkte geklärt sind, welche Zahlen noch offen sind, und die vorläufigen Optionswerte.

## Schritt 5: Beschlussentwurf

Schreib `draft-resolution.md`: die Empfehlung (benannte Option und Urteilswort), die Bedingungen, die die Plätze gefordert haben (Doppelte zusammenlegen, prüfbar halten, bei abweichenden Zahlen eine wählen und sagen, von wem), die nächsten Schritte mit Datum, den günstigsten Test und die Abbruchkriterien. Argumente wiegen, nicht Köpfe zählen: Ein Platz mit einer entscheidenden Tatsache schlägt drei Plätze mit Bauchgefühl. Wende die Sonderregeln an. Schreib außerdem `draft.json` (`live-room.md`).

## Schritt 6: Runde 3, Abstimmung

Starte alle Plätze mit der Vorlage für Runde 3. Speichere in `round-3.md` (gleiche Überschriften, sofort geschrieben) und füge einen Abschnitt `## Vorsitz` an, der jeden Änderungsantrag nennt und ob er angenommen wurde, mit Grund. Nimm einen Änderungsantrag an, wenn kein Platz widerspricht oder das Argument dafür unbeantwortet blieb; widersprechen sich Plätze, gewinnt die besser begründete Seite, die andere kommt in die Minderheitsmeinung. Keine vierte Runde.

Die schnelle Runde lässt diese Runde aus, wenn die Spannweite in Runde 2 bei der besten Option 3 oder weniger ist und kein Platz auf `RUINRISIKO: wahrscheinlich` steht.

## Schritt 7: Prüfen, dann Urteil

1. `python .claude/skills/roast-room/scripts/check_quotes.py <sitzungsordner>` ausführen (`python3` versuchen, wenn `python` fehlt). Jedes Zitat mit Quellen-ID muss in einem Wissensspeicher stehen. Unbestätigte Zitate aus dem Urteil entfernen (und das in den Notizen des Vorsitzes sagen). Ist Python nicht installiert, nicht anhalten und die Person nicht um eine Installation bitten: Prüf jedes zugeordnete Zitat selbst, indem du den Wissensspeicher des Platzes nach dem genauen Wortlaut durchsuchst, und behandle alles, was du nicht findest, als unbestätigt.
2. Rechne die Zahlen aus den Karten der letzten Runde nach `scoring.md`, wende die Sonderregeln an und schreib `verdict.md` nach `report-template.md`, auf Deutsch. Schreib `verdict.json` zuletzt (`live-room.md`); daran erkennt der Tisch, dass die Runde vorbei ist.
3. Zeig der Person im Chat ein kurzes Urteil, nicht den ganzen Bericht: Urteilswort und Empfehlung, die Optionswerte in einer Zeile, die drei Argumente, die die Runde getragen haben (je eine Zeile, mit Platz), den stärksten Einwand (eine Zeile, mit Platz) und die nächsten Schritte (höchstens drei). Dann der Pfad zu `verdict.md` für alle Einzelheiten, eine Zeile, dass das PDF einen Klick entfernt ist („PDF herunterladen“ beim Urteil auf http://localhost:3100), und eine Zeile mit dem Angebot, bei einem Platz nachzufragen oder mit neuen Fakten neu zu starten. Unter 200 Wörtern: Die Person soll auf einen Blick entscheiden können.

## Regeln für den Vorsitz

- Du ergreifst nie Partei und bringst keine eigene Säule ein. Hat kein Platz einen wichtigen Punkt angesprochen, gib ihn in der nächsten Runde als Streitpunkt an den passendsten Platz, statt ihn selbst einzufügen.
- Zitiere Plätze getreu. Leg keinem Platz Worte in den Mund und schreib keine Karte um.
- Die Plätze sprechen mit der Stimme ihrer Person; dein Bericht ist klares Deutsch (keine Gedankenstriche, keine KI-Floskeln, kein Anlauf).
- Eine einstimmige Runde 1 ist eine Warnung, kein Erfolg.
- Verbrauch: Eine volle Runde sind drei Sub-Agent-Läufe pro Platz (21 bei sieben Plätzen), rund eine Million Token. Für kleine Entscheidungen `--quick` nutzen, und sagen, welcher Modus lief.
- Die Plätze sind Simulationen aus öffentlichen Werken. Stell eine Zeile nie als Aussage der echten Person dar, außer es ist ein wörtliches Zitat mit Quellen-ID aus dem Wissensspeicher.

## Besetzung einstellen

`/roast-room board` (oder „ändere meine Besetzung“, „wer sitzt in meiner Runde“, „nimm Naval in meine Standardbesetzung“) bearbeitet `roster.json`, es läuft keine Runde.

1. Zeig das Roster als kurze Tabelle: Platz, Säule, in der Standardbesetzung oder nicht. Dann die aktuelle Einstellung `"board"` in klaren Worten („der Vorsitz schlägt pro Entscheidung eine Besetzung vor und fragt dich“, „der Vorsitz wählt pro Entscheidung ohne Rückfrage“ oder „jede Runde setzt deine Standardbesetzung ein“).
2. Frag, was sich ändern soll, mit AskUserQuestion, wenn die Person es nicht schon gesagt hat: Plätze in die Standardbesetzung aufnehmen oder entfernen, oder die Einstellung zwischen `ask`, `auto` und `default` wechseln.
3. Bearbeite `roster.json` direkt: nur die Felder `"board"` und `"default"`. Die Standardbesetzung bleibt zwischen einem und neun Plätzen, mit Schlüsseln, die in `"seats"` stehen. Entferne hier nie einen Platz aus `"seats"`; wer aus der Standardbesetzung fällt, bleibt für `--seats` und `ask` verfügbar.
4. Bestätige die neue Besetzung in einer Zeile. Der Tisch übernimmt sie beim nächsten Laden der Seite.

Einen ganz neuen Berater baut `/newroaster`.

## Ohne Sub-Agenten (Codex oder eine Umgebung ohne Agenten)

Führe denselben Ablauf selbst nacheinander aus. Lies für jeden Platz `.claude/agents/council-<platz>.md` und seinen Wissensspeicher, schreib die Karte dieses Platzes, und mach vor dem nächsten Platz den Kopf frei: In Runde 1 darf keine Karte die nächste prägen. Runden 2 und 3 laufen genauso, mit den früheren Karten vor Augen.

## Dateien

- `brains/<slug>/`: ein Wissensspeicher pro Platz (`_hot.md`, `frameworks.md`, `principles.md`, `positions.md`, `voice.md`, `stories.md`, `books.md`, `sources.md`). Englisch, wie im Original; das muss nicht übersetzt werden.
- `scripts/check_quotes.py`: prüft jedes zugeordnete Zitat einer Sitzung gegen die Wissensspeicher.
- `roster.json`: jeder Platz (Schlüssel, Name, Säule, Leitfrage, Bewertungsfeld, Farbe) und die Standardbesetzung. `/newroaster` ergänzt Plätze, `/roast-room board` ändert die Besetzung.
- Agenten: `.claude/agents/council-<key>.md`, einer pro Platz im Roster.
- Der Tisch: `app/` (Einstieg über die `README.md` im Projektordner).
