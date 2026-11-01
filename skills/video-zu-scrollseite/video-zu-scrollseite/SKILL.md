---
name: video-zu-scrollseite
description: Baut aus einem Video eine Website, durch die man scrollt wie durch einen Film. Das Video wird in Einzelbilder zerlegt und ans Scrollen gekoppelt, dazu kommen Textabschnitte, hochzählende Zahlen und ein Abschluss mit Handlungsaufruf. Nutze diesen Skill immer wenn der Nutzer sagt "mach eine Scrollseite aus dem Video", "Scroll-Story", "Apple-Effekt", "Seite zum Durchscrollen", "aus dem Reel eine Landingpage", "Video-Landingpage" oder wenn er ein Video schickt und eine Website daraus will. Auch triggern bei "scroll-driven website", "video to website" und beim Wunsch nach einer Vorher-Nachher-Seite, bei der sich beim Scrollen etwas verwandelt. NICHT für normale Landingpages ohne Video (dafür landingpage-blaupause) und nicht für Reels oder Videoschnitt.
---

# Video zu Scrollseite

Aus einem Video wird eine Seite, bei der das Video nicht abläuft, sondern am
Scrollrad hängt. Wer scrollt, spult das Video vor und zurück. Drumherum blenden
Textabschnitte ein.

Diese Fassung ist aus einem Testlauf mit dem fremden Skill `video-to-website`
entstanden. Das Original hatte einen Programmierfehler, einen Pfad von einem fremden
Rechner, drei Widersprüche und eine Ladestrategie, die im Mobilnetz 91 Sekunden
gebraucht hat. Alles unten korrigiert.

## Zuerst: taugt das Video überhaupt?

Der Effekt lohnt sich nur, wenn das Scrollen selbst etwas zur Geschichte
beiträgt. Vor dem Bauen ehrlich prüfen:

- **Gut:** eine Verwandlung, die der Besucher selbst steuert (zottelig zu
  geschnitten, leer zu fertig, zu zu offen). Eine ruhige Kamerafahrt um ein
  Produkt. Eine Geschichte mit wenigen, klaren Stationen.
- **Schlecht:** ein schnell geschnittenes Reel mit einem Schnitt pro Sekunde.
  Beim Scrollen springt es dann im Stakkato. Geht, wirkt aber unruhig.
- **Sinnlos:** ein Talking-Head oder alles, wo der Ton die Hauptsache ist. Der
  Ton fällt komplett weg, es bleiben nur Bilder.

Wenn das Video nicht taugt, das sagen, bevor Arbeit hineinfließt.

## Schritt 1: Video vermessen

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,r_frame_rate,nb_frames -of default=noprint_wrappers=1 "<VIDEO>"
```

FFmpeg und ffprobe müssen installiert und im PATH sein (Windows: `winget install ffmpeg`,
Mac: `brew install ffmpeg`). Danach einfach `ffmpeg` aufrufen, keine festen Pfade.

**Bildzahl festlegen, Zielbereich 150 bis 300.** Die Regel des Originals ("bei
langen Videos 5 bis 10 Bilder pro Sekunde") widerspricht sich selbst und ergibt
bei einem 16-Minuten-Video 4.700 Bilder. Es gilt allein der Zielbereich:

| Videolänge | Bilder pro Sekunde |
|---|---|
| unter 15 s | 15 bis 20 |
| 15 bis 40 s | 10 |
| 40 s bis 2 min | 3 bis 5 |
| länger | Video vorher kürzen, sonst wird es eine Diashow |

Bei mehr als 3 Sekunden Videozeit je Bild springt die Bewegung sichtbar. Dann
lieber einen Ausschnitt nehmen als das ganze Video.

## Schritt 2: Szenenwechsel finden

Damit die Textabschnitte genau an den Schnitten sitzen und die Sprünge gewollt
aussehen:

```bash
ffmpeg -i "<VIDEO>" -filter:v "select='gt(scene,0.25)',showinfo" -f null - 2>&1 | grep -oE "pts_time:[0-9.]+"
```

(`grep` gibt es auf dem Mac und in Git Bash. Unter Windows ohne Git Bash den Befehl ohne
den `grep`-Teil ausführen und die `pts_time`-Werte in der Ausgabe ablesen.)

Die Sekunden durch die Videolänge teilen, das ergibt die Scroll-Prozente. Bei
`FRAME_SPEED 1.0` liegt eine Szene bei Sekunde X genau bei X/Gesamtlänge Prozent
Scrollweg.

## Schritt 3: Bilder herausziehen

```bash
mkdir -p frames
ffmpeg -y -i "<VIDEO>" -vf "fps=<FPS>,scale=900:-1" -c:v libwebp -quality 68 "frames/frame_%04d.webp"
```

**Breite 900 und Qualität 68, nicht 1080 und 80.** Gemessen an einem 31-Sekunden-Clip:
1080/80 ergibt 19 MB, 900/68 ergibt 12 MB bei gleichem sichtbaren Ergebnis. Das
Bild wird auf dem Bildschirm ohnehin nur rund 450 Pixel breit dargestellt.

## Schritt 4: Hoch- oder Querformat entscheiden

Das ist die wichtigste Weiche, und das Original kennt sie nicht.

**Querformat (16:9):** formatfüllend, `Math.max`, `IMAGE_SCALE` 0.85. Das Bild
füllt den Bildschirm, der Text liegt in den äußeren Zonen darüber. Dann braucht
jeder Textblock eine Abdunkelung, sonst ist er auf hellem Bild unlesbar.

**Hochformat (9:16, alle Reels):** eingepasst, `Math.min`, `IMAGE_SCALE` 0.85,
weiche Kanten. Das Bild steht wie ein Poster in der Mitte und belegt rund
30 Prozent der Breite, links und rechts bleibt echter Platz für Text auf
ruhigem Hintergrund. Das sieht deutlich edler aus als alles Formatfüllende.

Textzonen dazu im CSS:

```css
/* Prozent, nicht vw. vw enthält die Scrollleiste und erzeugt 8 Pixel Überhang. */
.align-left  { padding-left: 5%;  padding-right: 67%; }
.align-right { padding-left: 67%; padding-right: 5%; }
.align-left .section-inner,
.align-right .section-inner { max-width: 100%; }
```

**Falle:** `max-width` in Prozent bezieht sich auf den bereits durch das Padding
verkleinerten Bereich. `max-width: 33%` macht daraus ein Neuntel der Seite und
jedes Wort steht in einer eigenen Zeile.

## Schritt 5: Aufbau

```
projekt/
  index.html
  css/style.css
  js/app.js
  frames/frame_0001.webp ...
  Ansehen.cmd          Windows: Doppelklick startet Server und Browser
  Ansehen.command      Mac: dasselbe (einmal `chmod +x Ansehen.command`)
```

Kein Framework, kein Bundler. Aus dem Netz kommen nur Lenis, GSAP mit
ScrollTrigger und die Schriften.

`index.html` in dieser Reihenfolge: Ladebalken, Kopfzeile, Hero als eigener
Bildschirm, Canvas, dunkles Overlay, Lauftext, Scroll-Container mit den
Abschnitten. Jeder Abschnitt trägt `data-enter`, `data-leave` (Scroll-Prozente)
und `data-animation`. Der letzte bekommt `data-persist="true"`.

`Ansehen.cmd` (Windows), in jedem Projekt gleich:

```
@echo off
cd /d "%~dp0"
start "" http://localhost:3070
python -m http.server 3070 --bind 127.0.0.1
```

`Ansehen.command` (Mac):

```
#!/bin/bash
cd "$(dirname "$0")"
open http://localhost:3070
python3 -m http.server 3070 --bind 127.0.0.1
```

## Schritt 6: Die sieben Bewegungsarten

`fade-up`, `slide-left`, `slide-right`, `scale-up`, `rotate-in`, `stagger-up`,
`clip-reveal`. Nie zweimal dieselbe hintereinander. Alle mit Staffelung 0.1 bis
0.15 und `power3.out`, außer `scale-up` mit `power2.out` und `clip-reveal` mit
`power4.inOut`.

**Der Abschnitt selbst muss mitblenden**, nicht nur seine Kinder:

```js
tl.from(section, { opacity: 0, duration: .5, ease: 'power2.out' }, 0);
```

Ohne diese Zeile bleibt auf dem Handy der dunkle Textkasten stehen, während der
Text darin längst weg ist. Die Position `0` am Ende ist Pflicht, sonst laufen die
Bewegungen nacheinander statt zusammen.

## Schritt 7: Die vier Fallen des Originals

**1. Die Zahlen zählen nie hoch.** Im Original steht
`gsap.from(el, {textContent: 0})`, während im HTML schon eine Null steht. Das
animiert von null nach null. Richtig ist ein Zwischenobjekt:

```js
const obj = { v: 0 };
gsap.to(obj, {
  v: target, duration: 2, ease: 'power1.out',
  snap: { v: decimals === 0 ? 1 : 0.01 },
  onUpdate: () => { el.textContent = obj.v.toFixed(decimals); },
  scrollTrigger: { trigger: el.closest('.scroll-section'), start: 'top 70%',
                   toggleActions: 'play none none reverse' }
});
```

**2. `gsap.registerPlugin(ScrollTrigger)` fehlt** im Original. Erste Zeile.

**3. Der Hero muss `position: fixed` sein.** Der Ausblend-Code rechnet mit
`1 - p * 15`, das ergibt nur Sinn, wenn der Hero stehen bleibt und wegblendet.
Bei Hochformat besser `1 - p * 22`, sonst liegen Hero und Bild übereinander.

**4. Der Lauftext läuft quer durch das Bild.** Mit einer Maske aussparen:

```css
mask-image: linear-gradient(90deg, #000 0%, #000 30%, transparent 35%,
                            transparent 65%, #000 70%, #000 100%);
```

## Schritt 8: Ladestrategie, der wichtigste Punkt

Das Original lässt den Ladebalken auf **alle** Bilder warten. Gemessen mit
309 Bildern und 14 MB:

| Verbindung | Original | mit Startschwelle |
|---|---|---|
| WLAN daheim | 2,7 s | 0,5 s |
| gutes Mobilnetz | 17,1 s | 2,5 s |
| schwaches Mobilnetz | 91,0 s | 9,7 s |

Drei Phasen statt zwei:

1. Die ersten 8 Bilder, dann ist sofort etwas zu sehen
2. Bis Bild 45, dann verschwindet der Ladebalken und die Seite ist bedienbar
3. Der Rest lädt der Reihe nach im Hintergrund weiter

Dazu ein Rückfall in `drawFrame`: fehlt das gewünschte Bild noch, das letzte
vorhandene zeigen statt gar nichts.

```js
if (!img || !img.complete) {
  for (let i = index - 1; i >= 0 && index - i < 60; i--) {
    if (frames[i] && frames[i].complete) { img = frames[i]; break; }
  }
}
```

## Schritt 9: Abspieltempo

`FRAME_SPEED` steuert, wann das Video durchgelaufen ist.

- **1.0** bei einer Geschichte. Das Video läuft bis zum Seitenende, jeder
  Textabschnitt sitzt auf seinem Bild.
- **1.8 bis 2.2** bei einem Produktvideo. Das Produkt ist nach gut der Hälfte
  fertig gedreht, danach steht es still und die Verkaufsargumente kommen.

Das Original kennt nur den zweiten Fall und nennt alles darunter träge. Bei einer
Geschichte wäre die halbe Seite ein Standbild.

## Schritt 10: Prüfen

Zwei fertige Werkzeuge liegen daneben:

- `werkzeuge/screenshots.py <zielordner> <breite> <hoehe> <name>` fährt neun
  Scroll-Positionen an, macht Bilder und meldet Konsolenfehler, fehlgeschlagene
  Ladevorgänge und horizontalen Überhang
- `werkzeuge/ladezeit.py` misst die Ladezeit bei WLAN, gutem und schwachem
  Mobilnetz

Beide brauchen einen laufenden Server auf Port 3070 und Playwright für Python.
Einmalig einrichten:

```bash
pip install playwright
python -m playwright install chromium
```

Die Werkzeuge starten das von Playwright installierte Chromium. Wer lieber einen
anderen Chromium-basierten Browser nutzen will, setzt vorher die Umgebungsvariable
`SCROLLSEITE_CHROME` auf den Pfad der Programmdatei.

Zusätzlich prüfen: Tag-Balance, alle Pflichtbausteine vorhanden, sieben
verschiedene Bewegungsarten, keine überlappenden Scrollbereiche, Schaltflächen
auf dem Handy mindestens 44 Pixel hoch.


## Regeln für dieses Format

- **Texte erst zeigen und auf ein Okay warten.** Das ist Copy, kein Code. Ton: warm,
  umgangssprachlich, erzählend. Keine Magazin-Überschriften, keine
  Werbeagentur-Sprache.
- **Die Seite spricht in der Ich- oder Wir-Form des Absenders**, nie über ihn in der
  dritten Person.
- **Zahlen im Zahlenblock nie erfinden.** Solange die echten fehlen, sichtbar als
  Platzhalter markieren und nachfragen.
- **Fremdes Videomaterial bleibt lokal.** Nur eigene Videos gehen online.
- Bei KI-erzeugten Videos die Kennzeichnungspflicht prüfen (EU AI Act).

## Wann sich der Aufwand lohnt

Der Effekt kostet Ladezeit und Aufwand. Er lohnt sich, wenn das Scrollen selbst
Teil der Geschichte ist, also bei Verwandlungen und Vorher-Nachher. Bei "Video
soll halt auf der Seite laufen" ist ein normales eingebettetes Video die bessere
und schnellere Wahl.
