# Seedance Multishot: Videoprompts mit Zeitstempeln für Seedance 2.5

## Was es kann

Du beschreibst eine Szene (optional mit Referenzbildern), Claude baut daraus einen Multishot-Videoprompt mit Zeitstempeln für Seedance 2.5: 6 bis 15 Einstellungen für 30 Sekunden oder 3 bis 8 für einen 15-Sekunden-Block, je Einstellung Bildgröße, Brennweite, Kamerawinkel und Kamerabewegung, am Ende Location, Style, Audio und Negatives. Der Prompt bleibt unter 7.500 Zeichen. Dazu Konsistenz-Sperren (Figur, Position, Requisiten, Bewegung), Umgang mit `@`-Referenzen, Aufteilung langer Geschichten in Blöcke und Erfahrungswerte zum deutschen Dialog (Dialog auf Englisch erzeugen, danach in ElevenLabs eindeutschen). Wahlweise fotorealistisch oder im Pixar-Look. Bildprompts für Referenzblätter gibt es nur auf ausdrücklichen Wunsch.

Der Skill gilt nur für Seedance 2.5, nicht für Seedance 2.0.

## Für wen

Für alle, die mit Seedance 2.5 (zum Beispiel über Higgsfield) Videos erzeugen und mehr Kontrolle über Schnitt und Figurenkonsistenz wollen.

## Einrichtung Schritt für Schritt

Du brauchst [Claude Code](https://claude.com/claude-code), in der Desktop-App oder im Terminal.

1. Lade dieses Repo herunter: oben auf GitHub der grüne Knopf **Code**, dann **Download ZIP**. ZIP entpacken.
2. Öffne deinen persönlichen Skill-Ordner:
   - Windows: `C:\Users\DEINNAME\.claude\skills\`
   - Mac: `~/.claude/skills/`
3. Kopiere den Ordner `seedance-multishot` aus `skills/seedance-multishot/` dort hinein. Danach liegt da `skills\seedance-multishot\SKILL.md`.
4. Claude Code neu starten.
5. Schreiben: „Mach mir einen Seedance-Prompt: …“ und die Szene beschreiben. Claude fragt dann nach Blockgröße (15 oder 30 Sekunden) und Bildstil.

## Herkunft und Lizenz

Eigenes Regelwissen von Natalie Hitschler.
