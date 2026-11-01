# Plätze

`roster.json` (einen Ordner höher) ist die Quelle: jeder Platz mit Schlüssel, Säule, Leitfrage und Bewertungsfeld, dazu die Standardbesetzung und wie sie gewählt wird. Die sieben Plätze der Standardbesetzung:

| Platz | Agent | Säule | Leitfrage | Wissensspeicher |
|---|---|---|---|---|
| Bezos | `council-bezos` | Strategie und Entscheidungen | Ist das die richtige Wette, und wie leicht lässt sie sich zurückdrehen? | `brains/jeff-bezos/` |
| Graham | `council-graham` | Produkt und Gründung | Wollen die Leute das wirklich, und wächst es? | `brains/paul-graham/` |
| Hormozi | `council-hormozi` | Angebote, Preise und Verkauf | Zahlen die Leute, wie viel, und wie schließen wir ab? | `brains/alex-hormozi/` |
| Gary V | `council-garyvee` | Marketing und Aufmerksamkeit | Woher kommt die Aufmerksamkeit, und ist sie gerade unterbewertet? | `brains/gary-vaynerchuk/` |
| Martell | `council-martell` | Menschen, Einstellungen und deine Zeit | Wer macht das, und was kostet es deinen Kalender? | `brains/dan-martell/` |
| Wickman | `council-wickman` | Abläufe und Wachstum | Läuft das im Betrieb, ohne dass du alles zusammenhalten musst? | `brains/gino-wickman/` |
| Buffett | `council-buffett` | Geld und Kapital | Was macht das mit Liquidität, Risiko und dem Wert auf lange Sicht? | `brains/warren-buffett/` |

Pfade relativ zu `.claude/skills/roast-room/`. Mit `/newroaster` ergänzte Plätze folgen demselben Muster: `council-<key>` und `brains/<slug>/`, eingetragen in `roster.json`.

## Gewichte

Der Vorsitz setzt vor Runde 1 für jede Entscheidung ein Gewicht pro Platz und begründet es in einer Zeile. Gewichte machen das Ergebnis ehrlich: Eine Preisfrage stützt sich auf Hormozi, eine Einstellungsfrage auf Martell.

| Gewicht | Bedeutung |
|---|---|
| 3 | Die Entscheidung liegt in der Säule dieses Platzes |
| 2 | Die Säule ist deutlich betroffen |
| 1 | Die Säule wird am Rand berührt |

Jeder Platz hat mindestens 1. Genau ein oder zwei Plätze bekommen eine 3.

## Schnelle Runde

`--quick` setzt vier Plätze (vorgeschlagen nach SKILL.md „Besetzung wählen“, dann bestätigt): die zwei mit dem höchsten Gewicht, den Platz, der das Risiko bewacht (von Haus aus Buffett oder Bezos, sonst der Geld-, Kapital- oder Risikoplatz), und den Platz, der am ehesten den anderen widerspricht (der Vorsitz nennt den Grund). Schnell für umkehrbare, kleine Entscheidungen. Die volle Runde für alles, was sich nicht leicht zurückdrehen lässt.

## Typische Spannungen

- Bezos und Buffett (lange Sicht, Risiko zuerst) gegen Hormozi und Gary V (schnell zu Geld, Menge, jetzt handeln).
- Graham (Dinge tun, die nicht skalieren, nah an den Kundinnen bleiben) gegen Wickman (Systeme, Abläufe, Verantwortung).
- Buffett (im eigenen Kompetenzkreis bleiben, keine Schulden) gegen Gary V (jetzt auf die unterbewertete Plattform setzen).
- Martell (Zeit zurückkaufen, früh einstellen) gegen Graham und Buffett (klein und sparsam bleiben, bis es funktioniert).

Mit `/newroaster` ergänzte Plätze tragen hier ihre eigenen Spannungen ein.

Plätze auf Abruf (in `roster.json`, nicht in der Standardbesetzung; der Vorsitz schlägt sie vor, wenn die Entscheidung in ihrem Bereich liegt):

| Platz | Agent | Säule | Leitfrage | Wissensspeicher |
|---|---|---|---|---|
| Naval | `council-naval` | Hebel und Vermögen | Baut das Hebel und Eigentum auf, das dir gehört, oder vermietest du nur deine Zeit? | `brains/naval-ravikant/` |
| Codie | `council-sanchez` | Kleine Firmen kaufen und besitzen | Solltest du das selbst bauen oder etwas kaufen, das schon läuft? | `brains/codie-sanchez/` |
| Sara | `council-blakely` | Produkt und Marke aus dem Nichts | Lieben die Kundinnen es so sehr, dass sie es für dich verkaufen, ohne fremdes Geld? | `brains/sara-blakely/` |
| Leila | `council-leila` | Führung und Teams aufbauen | Tragen dein Team und deine Führung das, und wer muss sich ändern? | `brains/leila-hormozi/` |
| Elon | `council-musk` | Grundprinzipien und Umsetzungstempo | Was ist hier die echte Grenze, und können wir Schritte streichen und schneller bauen? | `brains/elon-musk/` |

- Naval (Eigentum besitzen, winzige Teams, selbst finanzieren) gegen Hormozi und Gary V (mehr Menge, mehr Angebote, mehr Output, für den du weiter deine Stunden vermietest).
- Codie (bewährten Geldfluss kaufen) gegen Graham und Naval (etwas Neues bauen, das die Leute wollen).
- Sara (ein Produkt, das sich selbst verkauft, ohne Werbung, ohne fremdes Geld) gegen Gary V und Hormozi (Aufmerksamkeits- und Verkaufsmaschinen) und gegen jeden Platz, der Geld aufnehmen will.
- Leila (erst Kundenzufluss und eigene Führung in Ordnung bringen, dann einstellen) gegen Martell (früh einstellen, um Zeit zurückzukaufen). Leila und Wickman sind sich bei Verantwortung einig und trennen sich, wo Abläufe Führung ersetzen sollen.
- Elon (Anforderung hinterfragen, Schritt streichen, Engpass sofort angehen) gegen Wickman (jeder Ablauf braucht eine Zuständige und einen Takt) und Buffett (Geld halten, auf die beste Gelegenheit warten). Elon und Graham sind sich beim Tempo einig und trennen sich bei der Frage, ob ein Start zählt, bevor die Lieferung mitwächst.
- Elons sportliche Termine gelten fürs Team, nicht für Kundinnen oder Geldgeber; Martell und Leila halten fest, was sein Tempo die Menschen kostet.
- Leila Hormozi und Alex Hormozi sind verschiedene Plätze und verschiedene Menschen. Nenne sie „Leila“ und „Hormozi“.

Kommt Runde 1 einstimmig zurück, sollte der Vorsitz misstrauisch werden und in Runde 2 den Platz fordern, dessen Säule am meisten auf dem Spiel steht.
