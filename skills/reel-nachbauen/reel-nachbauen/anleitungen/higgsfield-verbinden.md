# Higgsfield verbinden

Higgsfield ist die Plattform, über die dieser Skill Bilder (GPT Image) und Videos (Seedance 2.0) erzeugt.
Ein Konto, ein Guthaben, keine weiteren Abos.

## 1. Konto

Der Nutzer legt selbst ein Konto auf higgsfield.ai an und lädt Credits auf (das macht er selbst, du gibst
keine Zahlungsdaten ein). Für ein Reel mit zwei Kapiteln in 480p rechnen: etwa 30 Credits für die Videos plus
wenige Credits für Figurenblätter, Storyboards und Startbilder (Stand Oktober 2026, Preise vorher immer mit
`get_cost` prüfen).

## 2. Konnektor in Claude Code eintragen

Offizielle Adresse des Higgsfield-MCP-Servers (laut higgsfield.ai/mcp): `https://mcp.higgsfield.ai/mcp`.
Ein API-Schlüssel ist nicht nötig, angemeldet wird über den Browser.

Im Terminal (nicht in Claude Code selbst) eingeben, oder du führst es nach Ja aus:

```
claude mcp add --transport http --scope user higgsfield https://mcp.higgsfield.ai/mcp
```

`--scope user` heißt: in allen Projekten verfügbar.

Danach Claude Code neu starten, `/mcp` eingeben, „higgsfield“ auswählen und anmelden. Es öffnet sich der
Browser, dort mit dem Higgsfield-Konto einloggen und den Zugriff erlauben.

**Alternative:** Wer Claude in der Desktop-App nutzt und Higgsfield dort schon unter
„Einstellungen > Konnektoren“ verbunden hat, hat die Werkzeuge oft auch in Claude Code. Erst probieren
(Schritt 3), dann gegebenenfalls eintragen.

## 3. Testen

Rufe das Werkzeug `balance` auf. Kommt ein Kontostand zurück: verbunden. Den Stand dem Nutzer nennen.

## Hilfe

- Werkzeuge fehlen nach dem Eintragen: Claude Code komplett schließen und neu öffnen, dann `/mcp`.
- Anmeldung schlägt fehl: in `/mcp` bei higgsfield „Authenticate“ erneut wählen.
- `claude` wird im Terminal nicht gefunden: Den Befehl in einem neuen Terminalfenster versuchen; sonst über
  `/mcp` in Claude Code den Server hinzufügen, falls die Version das anbietet.
