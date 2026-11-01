# Ich-Hooks: Einstiege, die zugeben statt angreifen

## Was es kann

Du nennst ein Thema, Claude schreibt dir 6 Hooks für Reel, Post oder Karussell. Jeder Hook hat genau zwei Zeilen, jede Zeile höchstens 40 Zeichen. Zeile 1 stellt etwas auf, Zeile 2 kippt es um. Und in jedem Hook steht ein „ich“: Du gibst selbst etwas zu, statt mit dem Finger auf andere zu zeigen. Das macht neugierig, ohne jemanden anzugreifen.

Die 6 Winkel: Zahl vorne weg, Gegen den Strich, Vorher-nachher, Fremde Autorität, Eingeständnis, Blick nach vorn.

Zahlen und Erlebnisse erfindet der Skill nicht. Kennt er deine echte Zahl nicht, setzt er einen Platzhalter wie `[deine Zahl]` und sagt dir am Ende, was du noch einsetzen musst.

## Für wen

Für alle, die Inhalte für Instagram, LinkedIn oder TikTok machen und beim ersten Satz hängen bleiben. Besonders, wenn du lieber ehrlich und nahbar klingst als laut.

## Einrichtung Schritt für Schritt

Du brauchst [Claude Code](https://claude.com/claude-code), in der Desktop-App oder im Terminal.

1. Lade dieses Repo herunter: oben auf GitHub der grüne Knopf **Code**, dann **Download ZIP**. ZIP entpacken.
2. Öffne deinen persönlichen Skill-Ordner:
   - Windows: `C:\Users\DEINNAME\.claude\skills\`
   - Mac: `~/.claude/skills/`
3. Kopiere den Ordner `ich-hooks` aus `skills/ich-hooks/` dort hinein. Danach liegt da `skills\ich-hooks\SKILL.md`.
4. Claude Code neu starten.
5. Schreiben: „Schreib mir Ich-Hooks zum Thema …“

Tipp: Leg in deinem Projektordner eine Datei `ueber-mich.md` an, mit ein paar echten Zahlen und Erlebnissen aus deinem Alltag. Der Skill liest sie und baut daraus Hooks, die wirklich nach dir klingen.

## Herkunft und Lizenz

Dieser Skill ist eine deutsche Übertragung und Anpassung des Skills `hook-generator` von Charlie Hills aus dem Repo [charlie947/social-media-skills](https://github.com/charlie947/social-media-skills) (Ordner `skills/hook-generator`, Stand Commit `10ca79c`, abgerufen am 01.11.2026). Übertragen und angepasst von Natalie Hitschler: deutsche Sprache, deutsche Winkelnamen, „ich“ als feste Regel, Platzhalter statt erfundener Zahlen, eigene Prüfliste.

Lizenz: MIT, Copyright (c) 2026 Charlie Hills. Der vollständige Lizenztext liegt in [`LICENSE`](LICENSE) in diesem Ordner und zusätzlich in jedem Skill-Ordner, damit er beim Kopieren mitwandert. Er gehört zu jeder Kopie dazu.

Charlie Hills betreibt oder empfiehlt dieses Paket nicht.
