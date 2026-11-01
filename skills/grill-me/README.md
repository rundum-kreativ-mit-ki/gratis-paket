# Grill me: dein Plan im Kreuzverhör

## Was es kann

Du hast einen Plan, eine Idee oder eine Entscheidung im Kopf und willst wissen, wo sie wackelt. Mit `/grill-me` fragt dich Claude so lange aus, bis jede Abzweigung geklärt ist. Die Fragen kommen in Runden, nummeriert, und zu jeder Frage gibt Claude gleich eine eigene Empfehlung ab. Du antwortest, und die nächste Runde baut auf deinen Antworten auf. Was Claude selbst nachschauen kann (Dateien, Ordner), schaut es selbst nach, statt dich zu fragen.

Am Ende steht kein Text und kein Code, sondern ein gemeinsames Verständnis: Was ist entschieden, was hängt woran. Erst danach geht es ans Umsetzen.

Zwei Skills gehören zusammen:

- `grill-me` ist der Befehl, den du tippst.
- `grilling` ist die eigentliche Anleitung für das Kreuzverhör. `grill-me` ruft sie auf.

Die Skills sind englisch geschrieben. Claude antwortet trotzdem auf Deutsch, wenn du auf Deutsch schreibst.

## Für wen

Für alle, die vor dem Loslegen einmal ordentlich durchgerüttelt werden wollen: neues Angebot, Preisänderung, Webseite, Kursaufbau, Tool-Einrichtung. Technikwissen brauchst du keins.

## Einrichtung Schritt für Schritt

Du brauchst [Claude Code](https://claude.com/claude-code), in der Desktop-App oder im Terminal.

1. Lade dieses Repo herunter: oben auf GitHub der grüne Knopf **Code**, dann **Download ZIP**. ZIP entpacken.
2. Öffne deinen persönlichen Skill-Ordner:
   - Windows: `C:\Users\DEINNAME\.claude\skills\`
   - Mac: `~/.claude/skills/`
   Gibt es den Ordner `skills` noch nicht, leg ihn an.
3. Kopiere die beiden Ordner `grill-me` und `grilling` aus `skills/grill-me/` dort hinein. Danach liegen da `skills\grill-me\SKILL.md` und `skills\grilling\SKILL.md`.
4. Claude Code neu starten.
5. Tippen: `/grill-me` und dahinter deinen Plan in ein, zwei Sätzen.

Einfacher geht es auch: Claude Code öffnen und schreiben „Installiere die Skills grill-me und grilling aus dem Ordner `<Pfad zum entpackten Ordner>\skills\grill-me` in meinen persönlichen Skill-Ordner.“

Der Ordner `agents/` in beiden Skills gehört zum Original und ist für Codex gedacht. In Claude Code stört er nicht.

## Herkunft und Lizenz

Beide Skills stammen unverändert aus dem Repo [mattpocock/skills](https://github.com/mattpocock/skills) von Matt Pocock (Ordner `skills/productivity/grill-me` und `skills/productivity/grilling`, Stand Commit `4ae2317`, abgerufen am 01.11.2026).

Lizenz: MIT, Copyright (c) 2026 Matt Pocock. Der vollständige Lizenztext liegt in [`LICENSE`](LICENSE) in diesem Ordner und zusätzlich in jedem Skill-Ordner, damit er beim Kopieren mitwandert. Er gehört zu jeder Kopie dazu.

Diese README ist eine deutsche Beschreibung von Natalie Hitschler. Matt Pocock betreibt oder empfiehlt dieses Paket nicht.
