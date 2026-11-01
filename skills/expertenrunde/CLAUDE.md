# Expertenrunde

Dieses Projekt ist die Expertenrunde, die deutsche Fassung des Roast Room (MIT, Original: github.com/nateherkai/roast-room): eine Runde simulierter Berater, die über die Geschäftsentscheidung einer Person streitet. Zwölf sind dabei: eine Standardbesetzung von sieben (Bezos, Paul Graham, Hormozi, Gary Vaynerchuk, Dan Martell, Gino Wickman, Buffett) und fünf auf Abruf (Naval Ravikant, Codie Sanchez, Leila Hormozi, Sara Blakely, Elon Musk). Vor jeder Runde schlägt der Vorsitz eine Besetzung vor und die Person bestätigt. Weitere Berater lassen sich ergänzen.

- Alles, was die Person liest, ist Deutsch, in Du-Form, mit echten Umlauten und ohne Gedankenstriche. Wörtliche Zitate aus den Wissensspeichern bleiben englisch.
- Bringt die Person eine Entscheidung („soll ich ...“, Preise, Einstellung, Geld aufnehmen, neues Produkt, Kurswechsel), starte `/roast-room`. Für eine kurze Frage an einen Berater `/roast-room ask <platz> ...`.
- Alle Berater und die Standardbesetzung stehen in `.claude/skills/roast-room/roster.json`. Will die Person einen Berater ergänzen („nimm Naval dazu“, „ich will X am Tisch“), starte `/newroaster`. Will sie die Standardbesetzung ändern oder jedes Mal gefragt werden, starte `/roast-room board`.
- Will die Person den Tisch starten, führe `npm start` im Hintergrund aus und nenne http://localhost:3100. Braucht Node 20 oder neuer, sonst nichts. Der Server hört nur auf 127.0.0.1.
- Runden werden in `sessions/<datum>-<entscheidung>/` gespeichert. Der Tisch spielt sie live ab, sobald die Dateien entstehen. Halte dich genau an `.claude/skills/roast-room/references/live-room.md`, damit der Tisch sie lesen kann.
- Die Plätze sind Simulationen aus öffentlichen Werken. Stell die Worte eines Platzes nie als Aussage der echten Person dar, außer es ist ein wörtliches Zitat mit Quellen-ID aus dem Wissensspeicher dieses Platzes.
- Der Vorsitz schreibt klares Deutsch: kurze Sätze, keine Übertreibung, keine Füllsätze. Das Urteil im Chat bleibt so kurz, dass man auf einen Blick entscheiden kann; der ganze Bericht kommt in `verdict.md`, und „PDF herunterladen“ am Tisch macht daraus ein PDF.
