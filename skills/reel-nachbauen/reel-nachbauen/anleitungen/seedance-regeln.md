# Seedance 2.0: Regeln aus echten Läufen

Gesammelt aus mehreren Testläufen im Oktober 2026 (Seedance 2.0 Fast über Higgsfield, 480p, 9:16).

## Was Seedance bekommt

- **Je Figur ein Einzelbild** (eine Figur, freigestellt, Vorderansicht) und **je Kapitel ein Startbild**.
- **Keine Storyboards und keine ganzen Figurenblätter.** Storyboard plus Figurenblatt ergibt oft doppelte
  Figuren.
- Higgsfield setzt das Startbild intern an die erste Stelle. Die @Image-Nummern im Prompt zählen trotzdem in
  der Reihenfolge, in der du die Figurenbilder übergibst: erstes Figurenbild = @Image1.
- Zwölf Zeitblöcke je 15-Sekunden-Kapitel trifft Seedance sehr treu, mit echten harten Schnitten.

## Was im Prompt stehen muss

- Am Anfang: Länge, Format, „wordless comedy clip“ (oder passend), „12 quick shots with hard cuts“.
- `[Characters]`: jede Figur mit @ImageN, kurzer Beschreibung (Fellfarbe, Ohren, Kleidung), „100% matches the
  reference“, „Exactly ONE …“. Zwei Tiere: „two separate dogs, do not interchange them“.
- Stil, Kamera („hard cuts between shots, one camera move per shot“).
- `[Scenes]` mit Zeitblöcken `[00:00 - 00:01] …`, jeder Block eine Einstellung: Bildausschnitt, Ort, Handlung.
- `Character lock` und `[Maintain Consistency]`.
- `Audio:` nur Geräusche, „No music, no spoken words“. Musik kommt später in der Instagram-App dazu.
- `Negatives:` doppelte Gliedmaßen, zweites Tier, Verwandlung, Halsband (falls keins), Schrift, Wasserzeichen.

## Typische Fehler und wie man sie vermeidet

- **Tür geht von allein auf:** Ein Kapitel endet, bevor sich eine Tür öffnet. Das nächste Kapitel beginnt
  damit, dass jemand die Tür sichtbar öffnet. Im Prompt: „The front door stays completely closed“.
- **Kurzer Türspalt am Kapitelende:** auch zwei Zehntelsekunden fallen auf. Im Schnitt die letzte Einstellung
  erst nach dem Spalt beginnen lassen (Kontaktbogen mit 5 Bildern pro Sekunde prüfen).
- **Ein Tier verwandelt sich in das andere:** Szenen mit zwei Tieren in Zehntelsekunden prüfen.
- **Falsche Blickrichtung:** Wer reagiert, schaut zum Geschehen. Im Prompt ausdrücklich: „looking out at the
  flower bed“.
- **„Fell wird braun vor Erde“** setzt Seedance oft nur als Sprenkel um. Meist reicht das.
- **Schielen** ist im Pixar-Look kein Fehler. Fehler ist nur eine zweite Pupille in einem Auge.
- **`ip_detected`:** Ein Bild wirkt wie eine geschützte Figur. Credits kommen zurück. Dieses Bild weglassen,
  die Figur nur beschreiben.
- **Preset-Vorschlag „IN THE DARK“** oder ähnlich: mit `declined_preset_id` ablehnen und erneut senden.

## Einstellungen

`model: seedance_2_0`, `mode: fast`, `resolution: 480p`, `aspect_ratio: 9:16`, `duration: 15`. 720p kostet
mehr als das Doppelte; 480p reicht für Instagram, der Schnitt rechnet auf 1080 × 1920 hoch.
