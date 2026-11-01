# Spezifikation des Wissensspeichers: ein Berater der Expertenrunde

Jeder Berater hat denselben Aufbau, damit sich die Agenten der Runde nur im Inhalt unterscheiden. Die ersten sieben folgen dieser Spezifikation, neue Berater müssen es auch.

Ordner: `.claude/skills/roast-room/brains/<slug>/`

**Sprache:** Überschriften, Umschreibungen und eigene Zusammenfassungen in den Dateien sind deutsch (Du-Form, echte Umlaute, keine Gedankenstriche). **Wörtliche Zitate bleiben immer in der Originalsprache der Quelle**, Zeichen für Zeichen, denn `check_quotes.mjs` vergleicht sie wörtlich mit dem Quelltext. Übersetze nie ein Zitat. Eine kurze deutsche Umschreibung darf dahinter stehen, ohne Anführungszeichen.

## Dateien

| Datei | Umfang (Standard; `--quick` darf etwa halb so groß sein) | Inhalt |
|---|---|---|
| `_hot.md` | 600 bis 800 Wörter | Wird bei jedem Aufruf der Runde gelesen. Wer der Berater ist, die Säule und die Frage, die er besitzt, der Corpus in einer Zeile, das Weltbild in drei Sätzen, die 8 Regeln, nach denen die Person entscheidet (jede mit einem kurzen wörtlichen Zitat und Quellen-ID), die 5 Frameworks, zu denen sie zuerst greift, ihre Entscheidungsschleife (5 oder 6 Schritte), typische Fragen, die sie Gründerinnen stellt, ein Spickzettel zur Sprechweise (5 Zeilen) und **wo diese Linse danebenliegt**. |
| `frameworks.md` | 12 bis 25 Einträge | Name (so, wie die Person ihn nennt, oder ein kurzer Name mit dem Zusatz *(unbenannt)*), was es ist, Teile oder Schritte, wann man es nutzt, wie man damit eine Entscheidung bewertet (Bewertungshilfe aus ihren eigenen Schwellen, als Hilfe gekennzeichnet), ein wörtliches Zitat mit Quellen-ID und wie viele Quellen es nutzen (mit IDs). Auch die Frameworks aus ihren Büchern. Das meistgenutzte zuerst. |
| `principles.md` | 15 bis 30 Einträge | Entscheidungsregeln in einem schlichten Satz, ein oder zwei wörtliche Zitate mit Quellen-IDs, Zahl der belegenden Quellen, Sicherheit (hoch = 3+ Quellen, mittel = 2, niedrig = 1). |
| `positions.md` | 20 bis 40 Themen | Ihre Haltung zu üblichen Gründerfragen: Preise, Rabatte, Geld einsammeln, Schulden, erste Einstellung, Kündigen, Partner, Anteile, Fokus gegen Streuung, Nebenprojekte, Nische, Content, bezahlte Werbung, Marke, KI, Remote-Arbeit, Arbeitszeit, Burnout, Firmenverkauf, Kultur, Kennzahlen, Wettbewerb, Timing. Wörtliches Zitat, Quellen-ID und Datum. Hat die Person ihre Meinung geändert, stehen beide Ansichten mit Datum nebeneinander. Themen ohne Beleg heißen "keine belegte Position", nie raten. |
| `voice.md` | 400 bis 700 Wörter | Wie die Person spricht: Satzlänge, Rhythmus, Erkennungsphrasen (wörtlich, mit Zahl der Quellen, die sie nutzen), bevorzugte Vergleiche, wie sie ein Argument eröffnet und beendet, wie sie widerspricht, Wörter und Züge, die sie nie nutzt. Dann 8 bis 12 kurze wörtliche Stimm-Anker (unter 45 Wörtern, mit Quellen-IDs). |
| `stories.md` | 10 bis 20 Einträge | Die Geschichten und Fallbeispiele, die sie wiederverwendet, ein oder zwei Zeilen je Eintrag mit der Lehre und den Quellen-IDs. |
| `books.md` | ein Eintrag pro Buch | Titel, Jahr, Kernthese, wichtigste Frameworks in eigenen Worten, welche Quellen es vermitteln. Nie Buchtext wiedergeben. Hat die Person keine Bücher, steht das in einer Zeile da, danach ihre wichtigsten Essays oder Reihen. |
| `sources.md` | alle | Von `fetch.mjs --sources-md` geschrieben: eine Kopfzeile mit Zahlen und Gesamtwörtern, dann pro Quelle `id | Titel | URL | Datum | Wörter`. |

Jede Datei beginnt mit einer Überschrift `# <Datei>: <Voller Name>` und einer Zeile dazu, woraus sie gebaut wurde.

## Regeln

- Jedes Zitat ist wörtlich aus dem Corpus und trägt eine Quellen-ID aus `sources.md`, etwa "..." (S014), in der Originalsprache der Quelle. Zitate bleiben unter 45 Wörtern. `check_quotes.mjs` muss für den ganzen Ordner durchlaufen.
- Anführungszeichen bedeuten wörtlich. Typische Fragen, Umschreibungen und eigene Zusammenfassungen stehen ohne sie, damit kein Agent sie später als Worte der Person ausgibt.
- Nie eine Ansicht ohne Quellen-ID zuschreiben. Eine Zeile, die deine Lesart mehrerer Quellen ist, sagt "abgeleitet aus S0xx, S0yy".
- Deutsch (Du-Form, echte Umlaute), keine Gedankenstriche, keine Füllsätze. Ausnahme sind nur die wörtlichen Zitate.
- Der Wissensspeicher beschreibt, wie die Person denkt, damit ein Agent wie sie schlussfolgern kann. Er ist keine Biografie und keine Fanseite: Nimm auf, wo sie danebenliegt, sich widerspricht oder außerhalb ihres Fachs steht.
- **Wo diese Linse danebenliegt** ist in `_hot.md` Pflicht: die Situationen, in denen der Rat dieser Person bekanntermaßen schlecht passt (Rat für teure Dienstleistungen, auf SaaS übertragen; Regeln für börsennotierte Firmen, auf ein Startup in der Frühphase übertragen; das Rezept einer Einzel-Creatorin, auf eine Firma mit 50 Leuten übertragen). Nimm zuerst, was die Person über ihre eigenen Grenzen sagt, dann die Form ihrer Erfahrung.
- Neuere Quellen vorziehen, wenn sich Ansichten geändert haben, und das mit Daten sagen.
