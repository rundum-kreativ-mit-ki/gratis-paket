# Dateien für den Tisch

Der Tisch (eine lokale Webseite auf http://localhost:3100) beobachtet den Ordner `sessions/` und spielt eine Runde ab, sobald ihre Dateien entstehen: Die Porträts sprechen nacheinander, Widerspruchspfeile fliegen, Stimmen landen, das Urteil erscheint. Er liest die Rundendateien, die du ohnehin schreibst, plus vier kleine JSON-Dateien. Schreib jede zum genannten Zeitpunkt, als reines JSON (keine Kommentare, keine Kommas am Ende). Platznamen dürfen Schlüssel (`garyvee`) oder Anzeigenamen (`Gary V`) sein.

Alle Texte in diesen Dateien sind deutsch (Titel, Optionen, Begründungen, Streitpunkte, Empfehlung, Schritte). Nur die JSON-Schlüssel bleiben, wie sie hier stehen.

Der Tisch ist freiwillig. Schreib die Dateien trotzdem; sie kosten ein paar Zeilen, und die Runde läuft ohne Tisch genauso.

## Reihenfolge

| Wann | Datei |
|---|---|
| Schritt 2, mit `brief.md` | `council.json` |
| Karten aus Runde 1 da | `round-1.md` (eine Überschrift `## <Platz>` pro Karte, Karten wörtlich, `## Notizen des Vorsitzes` zuletzt) |
| Nach den Notizen zu Runde 1 | `cruxes.json` |
| Karten aus Runde 2 da | `round-2.md` |
| Mit `draft-resolution.md` | `draft.json` (in der schnellen Runde weglassen, wenn Runde 3 entfällt) |
| Karten aus Runde 3 da | `round-3.md` |
| Zuletzt, nach `verdict.md` | `verdict.json` |

Wichtig: Abschnitte des Vorsitzes heißen immer mit dem Wort „Vorsitz“ (`## Notizen des Vorsitzes`, `## Vorsitz`) oder „Chair“. Daran erkennt der Tisch, dass dort keine Karte steht.

## council.json

```json
{
  "title": "Kurspreis auf 497 € erhöhen",
  "decision": "Den Preis von 297 € auf 497 € anheben, und für wen.",
  "mode": "full",
  "options": [
    { "id": "A", "label": "Sofort für alle auf 497 €" },
    { "id": "B", "label": "Nur für Neue erhöhen" },
    { "id": "C", "label": "Bei 297 € bleiben" }
  ],
  "weights": {
    "hormozi": { "weight": 3, "reason": "Preise sind seine Säule" },
    "buffett": { "weight": 2, "reason": "Liquiditätsrisiko, wenn Kundinnen abspringen" }
  },
  "seats": ["bezos", "graham", "hormozi", "garyvee", "martell", "wickman", "buffett"],
  "brief": "Zwei oder drei Sätze.",
  "assumptions": ["Die Kaufquote bleibt bei 3 % (angenommen)"]
}
```

`mode` ist `full` oder `quick`. `seats` nennt nur die Plätze am Tisch. Gib jedem Platz am Tisch ein Gewicht (1 bis 3). Optionstexte kurz halten: unter 50 Zeichen.

## cruxes.json

```json
{
  "cruxes": [
    {
      "question": "Reicht das Geld der Kundinnen, um die nächsten zwei Einstellungen zu bezahlen?",
      "sides": [
        { "position": "Ja, die Vorauszahlung deckt das", "seats": ["Hormozi", "Martell"] },
        { "position": "Nein, das ist vorgezogener Umsatz", "seats": ["Graham", "Bezos"] }
      ]
    }
  ],
  "unanimous": false,
  "note": "Ein klarer Satz, worum die Runde streitet."
}
```

Ein bis drei Streitpunkte. Fragen unter 90 Zeichen, Positionen unter 50.

## draft.json

```json
{
  "option": "B",
  "label": "MACHEN MIT BEDINGUNGEN",
  "recommendation": "Ein oder zwei Sätze.",
  "conditions": ["Prüfbare Bedingung"],
  "next_steps": ["Schritt mit Datum"],
  "cheapest_test": "Eine Zeile.",
  "kill_criteria": "Eine Zeile."
}
```

## verdict.json

```json
{
  "label": "MACHEN MIT BEDINGUNGEN",
  "call": "Ein oder zwei Sätze, nach denen du handeln kannst, mit der Option.",
  "recommended": "B",
  "why": [
    { "point": "Eine Zeile.", "seat": "Graham", "framework": "Startup = Growth" }
  ],
  "minority": { "seat": "Martell", "quote": "Die eigenen Worte des Platzes, aus einer Karte kopiert.", "would_have_to_be_true": "Eine Zeile." },
  "next_steps": [ { "when": "Diese Woche", "action": "Eine Zeile." } ],
  "kill_criteria": "Eine Zeile.",
  "conditions": ["Prüfbare Bedingung"],
  "fights": [ { "crux": "Die Frage", "story": "Wer auf welcher Seite stand, wer umgeschwenkt ist, wie es ausging." } ],
  "amendments": [ { "seat": "Buffett", "amendment": "Eine Zeile.", "adopted": true, "reason": "Eine Zeile." } ],
  "cheapest_test": "Eine Zeile.",
  "revisit": "Wann und mit welchen Zahlen.",
  "override_note": ""
}
```

`label` ist eins von MACHEN, MACHEN MIT BEDINGUNGEN, UMBAUEN, ABWARTEN, LASS ES. Die drei stärksten Argumente zuerst in `why` und höchstens drei `next_steps`; der Tisch zeigt diese vorne und klappt den Rest unter „Alle Einzelheiten“ ein. Optionswerte, Sicherheit und Stimmen rechnet der Tisch selbst aus den Karten, sie gehören nicht in diese Datei.
