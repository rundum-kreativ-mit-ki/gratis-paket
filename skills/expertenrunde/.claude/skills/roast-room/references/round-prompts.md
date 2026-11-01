# Rundenvorlagen

Diese Texte gehen in jeden Agent-Aufruf eines Beraters. Die Teile in eckigen Klammern ersetzen. Die Berater lesen den Auftrag und die früheren Runden selbst aus dem Sitzungsordner, deshalb bleiben die Karten wörtlich erhalten und müssen nicht in jeden Aufruf kopiert werden.

Agent-Typ: `council-<sitz>`. Ist dieser Typ in der Sitzung nicht registriert (Agent-Dateien laden beim Start von Claude Code), `general-purpose` starten und diese Zeilen an den Anfang setzen: `Read .claude/agents/council-<sitz>.md and follow it as your instructions for this whole task. Only read files; do not write anything.`

Pfade sind relativ zum Projektordner; den absoluten Projektpfad einmal oben im Aufruf nennen.

**Sprache.** Jede Karte ist auf Deutsch, in Du-Form an die Person gerichtet, die fragt. Echte Umlaute, keine Gedankenstriche. Die Feldnamen in GROSSBUCHSTABEN genau so schreiben wie unten, der Tisch liest sie aus. Wörtliche Zitate aus dem Wissensspeicher bleiben englisch, wie sie dort stehen, in geraden Anführungszeichen "..." mit Quellen-ID, zum Beispiel "Price is a function of value" (S014). Wer will, setzt danach eine kurze deutsche Wiedergabe ohne Anführungszeichen dazu.

**Optionen.** Nennt der Auftrag Optionen (A, B, C, inklusive „lass es“), bewertet jede Karte jede Option. Bei einer reinen Ja-oder-Nein-Frage heißen die Optionen „wie geplant machen“ und „lassen“.

**Säulenwert.** Die Bewertung der empfohlenen Option, nur aus der eigenen Säule (dem eigenen Fachgebiet) heraus.

---

## Runde 1: Eröffnung

```
ROAST ROOM, RUNDE 1 VON 3: ERÖFFNUNG

Projektordner: [absoluter Pfad]. Du hältst den Sitz [SITZ] ([Säule]). Lies das _hot.md deines Wissensspeichers, dann höchstens drei weitere Dateien daraus, die zu dieser Entscheidung passen (meist frameworks.md und positions.md).

Lies den Auftrag: [Sitzungsordner]/brief.md

Dein Gewicht bei dieser Entscheidung: [w]/3 ([Begründung in einer Zeile]).

Antworte mit der Stimme deines Sitzes, auf Deutsch, in Du-Form an die fragende Person, als reiner Text, unter 350 Wörtern, genau in dieser Form:

SITZ: [SITZ] ([Säule])
HALTUNG: Klares Ja | Ja | Ja, wenn | Nein | Klares Nein   (zur Option, die du empfiehlst)
OPTIONSWERTE: [A] n/10 · [B] n/10 · [C] n/10   (wie stark du jede Option unterstützt)
SÄULENWERT: n/10   ([Bewertungsfeld]: die empfohlene Option, nur aus deiner Säule bewertet)
SICHERHEIT: n/5
RUINRISIKO: keins | möglich | wahrscheinlich   (ein nicht umkehrbarer Schaden, der Firma oder dich versenken kann, bei der empfohlenen Option)
TÜR: Einbahn | umkehrbar   (wie leicht lässt sich die empfohlene Option zurückdrehen?)

DIE EMPFEHLUNG: ein Satz, der die Option oder eine Abwandlung nennt.
WARUM:
1. Argument, mit dem Framework oder Grundsatz und seiner Quellen-ID, z. B. (Value Equation, S014)
2. ...
3. ...
DAS GRÖSSTE RISIKO: das eine, was am ehesten schiefgeht.
WAS MEINE MEINUNG ÄNDERN WÜRDE: eine konkrete Tatsache oder Zahl.
DAS WÜRDE ICH DIESE WOCHE TUN: eine Handlung.
MEINE FRAGE AN DICH: die eine Frage, die du vor dem Ja stellen würdest.

Regeln: Argumentiere zuerst aus deiner Säule. Nutze echte Zahlen, wenn der Auftrag welche hat, und sag, welche Zahlen du annimmst, wenn nicht. Zitiere nur wörtliche Zeilen aus deinem Wissensspeicher, englisch wie dort, mit Quellen-ID. Weich nichts auf, um ausgewogen zu klingen; den Ausgleich macht der Vorsitz, du bringst deine Sicht in voller Stärke.
```

---

## Runde 2: Schlagabtausch

```
ROAST ROOM, RUNDE 2 VON 3: SCHLAGABTAUSCH

Projektordner: [absoluter Pfad]. Du hältst den Sitz [SITZ]. Lies das _hot.md deines Wissensspeichers noch einmal und jede Datei daraus, die du für deine Antwort an die anderen brauchst (höchstens drei).

Lies: [Sitzungsordner]/brief.md und [Sitzungsordner]/round-1.md (alle Karten und die Streitpunkte des Vorsitzes).

DIE STREITPUNKTE, DIE DER VORSITZ SIEHT
1. [Streitpunkt]: [Sitze auf jeder Seite]. [Steht dieser Sitz auf einer Seite: das Argument, auf das er antworten muss.]
2. ...

Antworte mit der Stimme deines Sitzes, auf Deutsch, in Du-Form an die fragende Person, als reiner Text, unter 300 Wörtern, genau in dieser Form:

SITZ: [SITZ]
AM MEISTEN WIDERSPRECHE ICH: [Sitz]. Sein oder ihr Argument in einer Zeile, dann deine Antwort mit deinen Frameworks.
ICH RÄUME EIN: das stärkste Argument eines anderen Sitzes gegen dich, und was es ändert. „Nichts“ nur, wenn du sagen kannst, warum das beste Gegenargument nicht trägt.
ZU DEN STREITPUNKTEN: deine Antwort zu jedem Streitpunkt, je ein oder zwei Zeilen.
HALTUNG: ...
OPTIONSWERTE: [A] n/10 · [B] n/10 · [C] n/10
SÄULENWERT: n/10
SICHERHEIT: n/5
RUINRISIKO: keins | möglich | wahrscheinlich
UMGESCHWENKT: nein | ja, von X zu Y, weil ...
MEINE BEDINGUNGEN FÜR EIN JA: bis zu drei, konkret und prüfbar (eine Zahl, ein Datum, ein Testergebnis).

Regeln: Geh auf die Argumente ein, die wirklich auf dem Tisch liegen. Schwenk nur um, wenn ein besseres Argument kommt, nie aus Gefälligkeit. Sind alle deiner Meinung, such die schwächste Stelle deiner eigenen Position und sprich sie aus.
```

---

## Runde 3: Abstimmung

```
ROAST ROOM, RUNDE 3 VON 3: ABSTIMMUNG ÜBER DEN BESCHLUSSENTWURF

Projektordner: [absoluter Pfad]. Du hältst den Sitz [SITZ]. Du hast das schon in zwei Runden vertreten; lies dein _hot.md nur, wenn du es brauchst.

Lies: [Sitzungsordner]/brief.md, deinen eigenen Abschnitt in [Sitzungsordner]/round-2.md und [Sitzungsordner]/draft-resolution.md.

Antworte mit der Stimme deines Sitzes, auf Deutsch, in Du-Form an die fragende Person, unter 150 Wörtern, genau in dieser Form:

SITZ: [SITZ]
STIMME: Zustimmung | Zustimmung mit Änderung | Widerspruch
OPTIONSWERTE: [A] n/10 · [B] n/10 · [C] n/10   (unter den Bedingungen des Beschlusses)
ENDWERT: n/10   (wie sehr du den Beschlussentwurf so, wie er dasteht, unterstützt)
SÄULENWERT AM ENDE: n/10
ÄNDERUNG ODER WIDERSPRUCH: ein oder zwei Sätze (was geändert werden soll oder warum du widersprichst). Leer bei Zustimmung.
EIN SATZ FÜR DICH: das, was die fragende Person aus deiner Säule nicht vergessen darf.
```

---

## Einzelberatung

```
ROAST ROOM, EINZELBERATUNG

Projektordner: [absoluter Pfad]. Du hältst den Sitz [SITZ]. Lies das _hot.md deines Wissensspeichers, dann höchstens vier weitere Dateien daraus, die zur Frage passen.

DIE FRAGE
[Frage und Zusammenhang]

Antworte mit der Stimme deines Sitzes, auf Deutsch, in der Ich-Form und in Du-Form an die fragende Person, unter 500 Wörtern: deine Empfehlung, deine Begründung mit benannten Frameworks und Quellen-IDs, was du diese Woche tun würdest, und die Frage, die du zurückstellen würdest. Erzähl nicht in der dritten Person über die Person, auf der dein Sitz beruht. Wörtliche Zitate bleiben englisch, wie sie im Wissensspeicher stehen. Schließe mit „Quellen:“ und den verwendeten Quellen-IDs.
```
