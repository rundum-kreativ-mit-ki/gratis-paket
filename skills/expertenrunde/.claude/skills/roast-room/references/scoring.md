# Wertung

Alle Zahlen kommen aus den Karten der Plätze. Der Vorsitz rechnet, er erfindet nichts. Grundlage ist die letzte gelaufene Runde (Runde 3, wenn sie lief, sonst Runde 2).

## Optionswerte (die Hauptzahl)

Jede Karte bewertet jede Option von 0 bis 10. Für jede Option:

`Optionswert = Summe(Gewicht x Wert des Platzes für diese Option) / Summe(Gewichte)`, eine Nachkommastelle.

Die **empfohlene Option** ist die mit dem höchsten Optionswert, außer eine Sonderregel unten nimmt sie heraus. Zeig die Rechnung jeder Option in einer Zeile, zum Beispiel: `B (3x6 + 2x7 + 2x8 + 2x6) / 9 = 6,7`.

## Urteilsstufen (nach dem Wert der empfohlenen Option)

| Optionswert | Urteil |
|---|---|
| 7,5 bis 10 | MACHEN |
| 6,0 bis 7,4 | MACHEN MIT BEDINGUNGEN |
| 4,5 bis 5,9 | UMBAUEN |
| unter 4,5 | LASS ES |

Zwei Wörter ersetzen die Stufe, wenn sie besser passen, und der Bericht sagt, warum:

- **ABWARTEN**: Die empfohlene Option ist gut, hängt aber an einer Voraussetzung, die noch fehlt (ein Testergebnis, Geld, eine Einstellung). ABWARTEN nennt immer den Auslöser und das Datum, die daraus MACHEN werden lassen, und was passiert, wenn der Auslöser ausbleibt.
- **LASS ES** gilt auch, wenn „lass es“ selbst die Option mit dem höchsten Wert ist.

## Zustimmung zum Beschluss

Der ENDWERT aus Runde 3 ist die Unterstützung jedes Platzes für den Beschlussentwurf, so wie er dasteht. Sein gewichteter Durchschnitt heißt „Zustimmung zum Beschluss“. Er misst, wie gut der Plan des Vorsitzes die Runde getroffen hat, nicht, ob die Idee gut ist.

## Sonderregeln (nach der Stufe angewandt und im Bericht genannt)

1. **Ruin-Deckel.** Steht ein Platz am Ende bei der empfohlenen Option auf `RUINRISIKO: wahrscheinlich`, ist das Urteil höchstens UMBAUEN, bis der Beschluss eine Absicherung nennt, der dieser Platz zugestimmt hat. Ein Platz mit Ruinrisiko wiegt schwerer als sechs begeisterte.
2. **Einbahn-Deckel.** Ist die empfohlene Option eine Einbahntür (laut Bezos oder der Mehrheit der Plätze) und die Spannweite dort 4 oder mehr, ist das Urteil höchstens MACHEN MIT BEDINGUNGEN, und der günstigste Test wird zur Voraussetzung.
3. **Einigkeitsprüfung.** Liegt bei allen Plätzen dieselbe Option vorn und liegen ihre Werte dafür in Runde 1 innerhalb eines Punkts, nennt der Vorsitz die stärkste nicht vertretene Alternative als Streitpunkt für Runde 2 und bittet die Plätze, deren Säule am meisten auf dem Spiel steht, sie in voller Stärke zu vertreten.

## Spannweite und Sicherheit

- `Spannweite` = höchster minus niedrigster Platzwert für die empfohlene Option.
- `Sicherheit der Runde` = durchschnittliche SICHERHEIT der Plätze x 2, gerundet, minus 1 bei einer Spannweite von 5 oder mehr. Skala 1 bis 10.
- Beides nennen. Eine 7,0 mit Spannweite 1 ist eine andere Antwort als eine 7,0 mit Spannweite 6.

## Säulen-Wertungstabelle

Eine Spalte pro Platz: sein letzter SÄULENWERT, also seine Einschätzung der empfohlenen Option allein aus seiner Säule. Jede Säule bei 4 oder darunter bekommt in „Was jetzt zu tun ist“ eine benannte Lösung, auch bei MACHEN.

Die Spaltenbeschriftung ist das Feld `dimension` in `roster.json`. Die sieben der Standardbesetzung:

| Säule | Bewertungsfeld |
|---|---|
| Strategie und Entscheidungen (Bezos) | Strategische Passung und Umkehrbarkeit |
| Produkt und Gründung (Graham) | Echte Nachfrage und Wachstum |
| Angebote, Preise und Verkauf (Hormozi) | Angebotsstärke und Stückwirtschaft |
| Marketing und Aufmerksamkeit (Gary V) | Aufmerksamkeit und Reichweite |
| Menschen, Einstellungen und deine Zeit (Martell) | Teamkapazität und deine Zeit |
| Abläufe und Wachstum (Wickman) | Betriebliche Reife |
| Geld und Kapital (Buffett) | Absicherung und Kapitaleffizienz |
