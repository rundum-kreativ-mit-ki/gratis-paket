---
name: seedance-multishot
description: >
  For Seedance 2.5 only. Seedance 2.0 behaves differently (camera block, angles, prohibitions), so mixing the two produces wrong advice. Before designing the sequence, always ask whether the user wants 15 or 30 seconds (see "Sequence length"). Also trigger on German phrasings: "Seedance-Prompt", "Videoprompt für Seedance", "Multishot-Prompt", "Shot-Abfolge", "Einstellungen mit Zeitstempel", "30-Sekunden-Sequenz", "15-Sekunden-Sequenz", "mach mir einen Seedance-Prompt", "Szene in Einstellungen zerlegen". From a scene description (and any reference images supplied as materials), produce a timecoded multi-shot video prompt tuned for Seedance 2.5's 30-second runtime and 7,500-character window. By default the deliverable is the video prompt only. Cinematic-photorealistic image prompts for the scene's key characters, locations, and props are produced ONLY when the user explicitly asks for them (e.g. "also give me the image prompts", "build the assets too", "I need the reference stills"). Use this skill whenever the user wants a Seedance 2.5 multi-shot prompt, a shot sequence, or a full asset+video package for Seedance 2.5. Trigger on phrases like "Seedance 2.5 prompt", "multi-shot prompt for Seedance 2.5", "30 second shot sequence", "build me the video prompt", "build me the assets and the video prompt", "Seedance 2.5 shot sequence", or when the user gives a scene description (with or without reference images) and expects a video prompt back for Seedance 2.5. If the user names Seedance 2.5 alongside a multi-shot, shot-breakdown, or scene-build request, use this skill.
---

# Multi-Shot Cinematic Prompt Builder — Seedance 2.5

> **Abgrenzung.** Dieser Skill gilt für **Seedance 2.5**, nicht für Seedance 2.0.
> Die beiden Modellstände unterscheiden sich bei Kamerablock, Bildwinkel und Verboten.

This is the Seedance 2.5 variant of the multi-shot prompt builder. It takes a scene description — plus any reference images the user supplies as materials — and produces:

1. **A timecoded multi-shot video prompt** in the established format, which uses the scene's assets (generated or supplied) as its visual anchors. **This is the default deliverable.**
2. **Image prompts** for the scene's key assets (characters, locations, props), written for cinematic photorealism, ready to generate as reference stills. **These are produced ONLY when the user explicitly asks for them** — see "Default output" below.

It is identical to the standard framework's video logic except for two core changes that reflect Seedance 2.5's expanded capabilities, plus an optional asset-image-prompt front end:

1. **Total sequence length is now 30 seconds** (up from 15).
2. **The character ceiling on the video prompt is now 7,500 characters** (up from 1,500).

Seedance 2.5 also supports rich per-shot **tagged references** (`@tag`), **in-world dialogue**, and **diegetic music**. The framework covers all three: see "Consistency & continuity locks" and "Working with tagged references" for the field-tested handling, and the Audio-line variations for dialogue and diegetic music. Sequences too long for 30 seconds are split into Parts (see Handling variations).

### Default output

**Default to the video prompt only.** Do not produce image prompts unless the user asks for them. Explicit requests look like "also give me the image prompts", "build the assets too", "I need the reference stills", "do the character/location/prop sheets", or similar. If the request is ambiguous, deliver the video prompt and offer the image prompts as a follow-up ("want the asset image prompts too?") rather than generating them unprompted.

When image prompts are **not** requested, skip Step 4 entirely and run the abbreviated workflow: parse the scene (Step 1), inventory and analyse supplied references for their DNA (Steps 2–3, still needed to lock the look into the video prompt), then go straight to the video prompt (Steps 5–8). When they **are** requested, run the full workflow including Step 4.

**Hard rule: the final video prompt must be 7,500 characters or fewer.** This is non-negotiable, but with Seedance 2.5's much larger window it is rarely binding — treat it as a ceiling, not a target. (Image prompts have their own length target, below.)

## Bildstil: fotorealistisch oder Pixar-Look (ask before Step 6)

Ask together with the sequence length, in the same question, and never assume:

1. **Fotorealistisch (default).** The grounded large-format cinematic look. Use the photoreal Style and Negatives lines in Step 7, and the cinematic-photoreal wording for any image prompts in Step 4.
2. **Moderner Pixar-Stil.** The premium 3D animated comedy look, suited to animated pet reels. Use the Pixar Style and Negatives lines in Step 7. For image prompts in Step 4, swap the photoreal wording for the same animated look: expressive characters, oversized round eyes, plush fur, glossy stylized surfaces. Keep the four-view reference-sheet framework and the neutral grey background exactly as they are, only the rendering style changes. Drop the skin-micro-pore callout, it belongs to the photoreal path and works against this look.

Erprobt an einer Dänischen Dogge im Luxus-Spa: 30 Sekunden, 9 Einstellungen, 9:16, Pixar-Stil statt der fotorealistischen Standard-Zeile.

## Blockgröße: 15 oder 30 Sekunden (immer fragen, Gesamtlänge ist frei)

**Festlegung:** Die **Gesamtlänge** ergibt sich aus der Geschichte und ist nach oben offen, auch eine Stunde ist möglich. Sie ist kein Gesprächsthema.

Gefragt wird allein die **Blockgröße**, denn Seedance erzeugt höchstens 30 Sekunden am Stück. Alles Längere entsteht aus mehreren Blöcken, die hintereinander geschnitten werden.

| Gesamtlänge | Vorgehen |
|---|---|
| bis 15 Sekunden | ein Block, nicht fragen |
| über 15 Sekunden | fragen: ein Block mit 30 Sekunden, oder zwei Blöcke mit je 15? |
| über 30 Sekunden | fragen: in 15er- oder in 30er-Blöcken? Danach die Anzahl ausrechnen und nennen |

Ein 15-Sekunden-Block hat 3 bis 8 Einstellungen und läuft von `00:00` bis `00:15`, ein 30-Sekunden-Block hat 6 bis 15 Einstellungen und läuft von `00:00` bis `00:30`. Jeder Block ist eigenständig timecodiert.

Der Grund für die Frage: Kleinere Blöcke lassen sich einzeln beurteilen und einzeln neu erzeugen, eine misslungene Einstellung kostet dann 15 statt 30 Sekunden Rechenzeit. Größere Blöcke geben mehr Raum für einen Spannungsbogen und brauchen weniger Schnitte. Beides ist richtig, die Nutzerin entscheidet.

Geschnitten wird an harten Beats. Beschriftung `VIDEO PROMPT: TEIL 1 VON N`, `TEIL 2 VON N` und so weiter.

**Rules for the split.** The model sees each prompt in isolation and knows nothing about the other parts, so:

- Repeat the full metadata block in both parts, verbatim: Location, Style, Audio, Negatives.
- Repeat every consistency lock in both parts: character lock, blocking lock, persistent-prop lock, continuous-action lock, state-change props. Never write "same as Part 1" or "see above", the model cannot see it.
- Repeat the same tagged references and the same asset descriptions in both parts.
- Cut at a hard beat: an impact, a door, a blackout, a turn of the head. Part 2 opens on the exact state Part 1 ended in, described explicitly from scratch, and does not replay the transition.
- Label the deliverables `VIDEO PROMPT: PART 1 OF 2` and `VIDEO PROMPT: PART 2 OF 2`.
- Each part carries its own 7,500-character budget. The ceiling is per prompt, not per reel.

## The core idea

The user is building a shot. The primary output is the video prompt that ties the scene's assets together. When the user also wants clean reference stills for the things that recur across shots — the hero character, the creature, the location, a signature prop — this skill inventories the scene, works out which of those assets the user still needs, and writes a cinematic-photoreal image prompt for each of those. That image-prompt front end is optional and only runs on request; by default the skill jumps straight to the video prompt. Either way, assets the user has already supplied as references are **not** re-prompted — that would be pointless — but they *are* analysed so their look flows into the video prompt.

## Deutscher Dialog: Erfahrungswerte

**Deutschen Dialog nicht direkt erzeugen lassen.** Seedance 2.5 spricht zwar Deutsch,
wenn man es verlangt, aber die Aussprache ist unzuverlässig. Im eigenen Test wurde aus
"föhnen" dreimal "Föhlen", bei unterschiedlich gebauten Prompts. Ein anderes deutsches
Wort mit derselben Lautfolge kam dagegen sauber. Woran es liegt, ist offen.

Der Weg, der funktioniert: Den Dialog **auf Englisch** schreiben und das fertige Video
danach **in ElevenLabs auf Deutsch umwandeln.** Englisch spricht das Modell sauber, und
beim Eindeutschen funkt kein Videomodell mehr dazwischen.

Was ausdrücklich nicht funktioniert: die deutsche Stimme als Tonreferenz in die
Erzeugung geben. Seedance 2.5 verwirft die Tonspur und vertont neu, auch wenn
LOCKED SOURCE AUDIO mit allen Verboten im Prompt steht. Getestet.

Soll Deutsch direkt aus der Erzeugung kommen, sind nach eigener Erfahrung Veo 3, Grok
und OmniFlash die besseren Modelle. Nicht gegengeprüft.

Zusätzlich gilt: Jede gesprochene Zeile bekommt eine ausdrückliche Sprachangabe, sonst
kann das Modell in einer anderen Sprache sprechen.

## Workflow

### Step 1 — Parse the scene description

Read the user's scene description and extract:

- **The core action** — what happens in the shot? (this drives the edit — required)
- **The location(s)** — where is it set, and how many distinct environments?
- **Time of day / atmosphere** — golden hour, blue hour, overcast, night, etc.
- **The cast of visual assets** (see Step 2)

If the action is genuinely absent, ask for it — the edit needs something to cut around. Otherwise make strong choices and note them.

### Step 2 — Inventory the assets

Break the scene into the **important** visual assets that recur or carry the shot. Three categories:

- **Characters** — people, creatures, robots, companions. Any figure the camera lingers on or that appears across multiple shots.
- **Locations** — each distinct environment the sequence moves through (an alley, an interior, a rooftop). **Always split a location into its exterior and its interior as separate assets whenever both are seen or implied by the action.** If the character approaches a structure and then goes inside it, that is two plates — the exterior approach and the interior — not one. Only collapse to a single plate when the scene genuinely never crosses the threshold.
- **Props** — signature objects that matter visually or to the story (a specific weapon, a vehicle, a held artifact). 

- **Key moments** — any dramatically pivotal *composite* the scene hinges on: a specific arrangement or state of assets that must read exactly right, such as a prop encased in ice, a creature revealed in its lair, or an artifact on an altar. These are the reveals and hero beats where composing the frame from isolated references alone is too risky and the user wants direct control over the money shot. Flag each one as its own asset — it will get a dedicated in-context still in Step 4.

Only inventory what's **important**. Incidental background dressing (a random crate, a passing crowd) does not get its own image prompt — it lives inside the location. Be selective: a strong package is a handful of clean hero assets, not a catalogue of everything in frame.

### Step 3 — Reconcile against supplied references

For each supplied reference image, work out which inventoried asset it covers, then split the inventory into two lists:

- **Supplied** — assets the user has already given as a reference. **Do not write an image prompt for these.** Instead, analyse the reference and extract a compact visual description (facial structure, hair, skin tone, distinguishing marks, build, clothing, materials, accessories, signature details). This "asset DNA" is woven into the video prompt and into any *other* image prompt in which the asset appears.
- **To generate** — important assets with no supplied reference. Each of these gets a cinematic-photoreal image prompt in Step 4 **only if the user asked for image prompts**. If they didn't, this list is not turned into prompts — it just tells you which assets the video prompt will have to describe from scratch rather than lean on a reference.

If the user asked for image prompts, state the split briefly before the prompts so they can see what's being generated and what's being reused. If they didn't, there's no need to surface the split.

### Step 4 — Write the image prompts (cinematic photorealism) — ONLY IF REQUESTED

**Skip this entire step unless the user explicitly asked for image prompts** (see "Default output"). When it does run: for every asset on the **to-generate** list, write one image prompt using the Nano Banana Pro methodology , **locked to the photoreal path**. Each prompt:

- Is a **single flowing natural-language paragraph** for the description portion — a creative-director brief, not tag soup. No labels, no bullets. (Characters and props are prefaced by their fixed reference-sheet framework block, below, and the description follows it.)
- Uses **real photography language**: focal length, sensor/film-stock look, depth of field, light quality, colour temperature.
- Carries **hyper-specific texture callouts** (skin pores, fabric weave, metal finish, damp stone, wear and grime) — at least two per prompt. Texture is what makes the still read as photographed, not generated. Wherever skin is visible, explicitly call for retained true micro-pores and fine skin texture — the documented lever against the plastic "AI sheen".
- Ends with constraints: `No text, no watermarks, no extra limbs, no deformed hands, no AI artifacts, no uncanny valley.`
- Length target: **~250–600 characters** for a single clean asset, up to **~900** for a busier one.

The asset type determines the framing. There are three cases.

**Characters — always a four-view reference sheet on a neutral grey background.** Every to-generate character prompt is prefaced with this exact framework block, and the specific character description follows it. This is the block for an *invented* character; when the character is a real person supplied as a photo, use the photo variant below instead.

```
Character reference sheet — four views on a neutral grey background:
[VIEW 1 — FULL BODY, FRONT] Full-body front-facing three-quarter view of this character, full body visible head to feet.
[VIEW 2 — FULL BODY, REAR] Full-body rear view of the same character, directly from behind. Full body visible head to feet.
[VIEW 3 — FRONT CLOSE-UP] Head and shoulders close-up, straight-on front view. Sharp detail on skin texture, accessories, and costume surface detail. Chest and shoulder armour/clothing visible at the bottom of frame.
[VIEW 4 — PROFILE CLOSE-UP] Head and shoulders close-up, 90-degree left profile view. Neck and upper shoulder visible.
Lighting & presentation: Clean studio lighting — soft key light upper left, gentle fill from the right. Consistent character identity, proportions, and costume details across all four views. No text, no watermarks, no extra figures, no background environment.
```

After that block, write the photoreal character description (identifying features, build, clothing, materials, accessories, signature details). For any visible skin, include an explicit real-texture callout — retain true micro-pores, fine skin texture, and natural imperfections — which is the documented lever for killing the plastic "AI sheen" and forcing a photographed look. Keep the presentation clean-studio-on-grey — do **not** apply a dramatic cinematic grade to a character sheet; it's a neutral reference capture.

**Optional fifth panel — feature lock.** When one feature keeps drifting across generations — most commonly eye colour — add a dedicated macro panel to the bottom of the sheet that isolates it and states it *positively* (see "State the trait you want" under the consistency locks). Change the opening line to "five views" and add, as a bottom panel, an extreme macro cropped across the eyes, razor-sharp on the irises, describing the exact colour you want ("unmistakably warm brown — rich medium-brown irises with fine iris texture and a soft catchlight"). This panel is the strongest downstream lock: every generation that references the sheet inherits it. Then keep tight eye close-ups *out* of the video prompt, where the model has the most freedom to reinvent the colour — lock it in the sheet and shoot wider.

**Variation and ageing sheets.** To put an existing character in a new costume, age, or condition with no reference for that specific look, generate a *variation* sheet: reuse the framework block, and open the description by anchoring hard to the supplied character ("the same man as the attached reference — same face, same [locked features]"), then state *only* what changes (wardrobe swapped, thirty years of weathering, a longer grey beard, taped glasses). Same-actor-different-age is the single hardest continuity ask in the whole framework — always lock it with its own sheet rather than describing it inline in the video prompt. To build a masked or layered version on top, reference the *variation's own output* as the base and change only the addition (the mask, the helmet), so the body, costume and the face underneath carry through and any later unmasking reveal still matches.

**A real person from a photo — ONLY ON REQUEST.** When the character is not invented but a real person the user attaches as a photo (the user themselves, a client, a friend), use this variant instead of the invented-character block. It is field-proven wording of unknown origin that was already circulating freely, so treat it as common property. It differs from the invented-character block in three ways: it points the model at the attached photo instead of a written description, it spells out the identity lock item by item, and it calls for true skin texture so the face does not come back with the plastic AI sheen. Use it verbatim:

```
Character reference sheet, four views of the person from the attached
photo, on a neutral grey background:
[VIEW 1, FULL BODY FRONT] Full body three-quarter front view, whole
body visible from head to feet.
[VIEW 2, FULL BODY REAR] Full body rear view, directly from behind.
[VIEW 3, FRONT CLOSE-UP] Head and shoulders, straight-on front view.
Sharp detail on facial features, hair and clothing.
[VIEW 4, PROFILE CLOSE-UP] Head and shoulders, 90 degree left profile.
Keep the exact same person in all four views: same face, same hair
colour and length, same eye colour, same clothing.
Retain true skin texture with visible pores and natural detail.
Lighting: clean even studio light, soft key from upper left, gentle
fill from the right. No dramatic lighting, no coloured light.
No text, no watermarks, no second person, no background environment.
```

Only two things are adjustable: the **outfit** (if the target scene needs a different one, lock it in here, not in the video prompt) and the **profile side** (left or right). Everything else stays word for word. The grey background and the four views are not a style choice, they are the reason the sheet works as a reference downstream. For the Pixar look, this variant does not apply — a real person from a photo is the photoreal path by definition.

**Never produce this unprompted.** Rule: the sheet prompt appears only when the user asks for it. An attached photo is *not* a request. If a real person turns up in the scene and no reference sheet exists yet, offer it in a single line ("soll ich dir das Vier-Ansichten-Referenzblatt für die Person auf dem Foto bauen?") and wait for the answer. This sits on top of the Step 4 rule that image prompts as a whole are request-only.

**Props — always a four-view reference sheet on a neutral grey background.** Every to-generate prop prompt is prefaced with this exact framework block, and the prop description follows it:

```
Prop reference sheet — four views on a neutral grey background:
[VIEW 1 — FRONT] Full front view of this prop, entire object visible and centred.
[VIEW 2 — REAR] Full rear view of the same prop, directly from behind. Entire object visible.
[VIEW 3 — 3/4 DETAIL] Three-quarter angle close-up. Sharp detail on surface material, texture, construction, and any markings.
[VIEW 4 — PROFILE] 90-degree side profile of the same prop.
Lighting & presentation: Clean studio lighting — soft key light upper left, gentle fill from the right. Consistent scale, proportions, materials, and detailing across all four views. No text, no watermarks, no extra objects, no background environment.
```

After that block, write the photoreal prop description (form, material, finish, markings, wear, any glow or working elements). Same clean-studio-on-grey presentation — no dramatic grade.

**Prop-maker prompts (turn an existing image into a prop).** Sometimes the "prop" is an existing image restyled as a physical object — e.g. a clean photo turned into a battered, creased, faded print on grey to use as set-dressing or a hero pickup. Write these as a single instruction: name the source reference, say to preserve its content exactly, then describe the physical treatment (creases, dog-eared corners, tears, fading, a curling edge, thumb-smudges) and the plain grey background as a flat top-down prop capture. Flag the legibility trade-off — heavy damage buries the image content, so for any prop a character reads or reacts to on screen, keep it "gently worn" and readable rather than wrecked.

**Locations — a cinematic establishing plate, environment as subject.** Locations are *not* on grey and do not use a reference sheet — they are the environment. Write a single flowing paragraph: wide, deep focus, no characters in frame, lit for its intended time of day, graded for a grounded large-format cinematic look (cool shadows, natural tones, high contrast, practical light) to match the video's Style line. For a deliberate tonal contrast (e.g. a warm scene against a cold one), grade it accordingly and say so. **Give a location both an exterior plate and an interior plate whenever the action crosses the threshold** — the approach/exterior and the space inside are separate assets.

**Key moments — an in-context cinematic still (the deliberate exception to isolation).** For a flagged key moment, do the opposite of the isolate rule: compose the relevant assets *together*, in the exact state the scene describes, framed as the hero shot of that beat. This is a scene frame, not a neutral reference, so give it the full cinematic grade matching the video's Style line and the host location's lighting — not the grey studio treatment. Weave in the design DNA of any supplied or generated assets it contains (describe the prop consistent with its own reference sheet, the character consistent with theirs) so the composite stays locked to the isolated references. The point is to hand the user direct control over the frame the scene hinges on rather than leaving the video model to assemble it from parts.

If the scene clearly wants an asset shown *in context* rather than as a clean reference (or the user asks for it), frame it in-scene instead — but default to the reference-sheet / empty-plate approach above.

Output each image prompt in its **own fenced code block**, with a short label line above it naming the asset (e.g. `IMAGE PROMPT — Location: collapsed subway platform`).

### Step 5 — Confirm the video brief

You now have everything the video prompt needs. Confirm the four drivers, pulling from the scene description and asset work; only ask if something essential is genuinely missing:

1. **Character(s)** — from the inventory (supplied + generated).
2. **Action** — from Step 1 (required).
3. **Location** — from Step 1 (populates the Location metadata line).
4. **Time of day** — from Step 1 (default: infer from mood, or "natural daylight").

### Step 6 — Design the shot sequence

Build a sequence of shots that totals **exactly the length agreed in "Sequence length"** above: 30 seconds for a single sequence, or 15 seconds for a standalone short and for each part of a two-part split. For a 15-second sequence the shot count lands at **3 to 8 shots** instead of 6 to 15.

- Each shot is a **minimum of 2 seconds** and a **maximum of 5 seconds**.
- Choose the shot count freely — with a 30-second runtime and 2–5s shots, that lands anywhere from **6 shots** (longer, contemplative beats) up to **15 shots** (fast, punchy cutting).
- **Vary the shot count each time** the skill is used so results feel fresh — don't default to the same structure.
- Each shot opens with a **timecode stamp** in the format `[MM:SS - MM:SS]` (e.g. `[00:00 - 00:05]`). The final shot must end at `00:30` for a 30-second sequence, or at `00:15` for a 15-second sequence and for each part of a two-part split (both parts run from `00:00`).

The shot count serves the action — slow atmospheric scenes want fewer, longer shots; high-energy beats want more, shorter shots. The extra runtime gives room for a fuller arc: establish, develop, turn, resolve.

For **each shot**, specify all four technical parameters:

1. **Shot size** — wide, medium, close-up, or macro
2. **Lens** — e.g. 24mm, 35mm, 50mm, 85mm (wide for environment/scale, long for intimacy/compression)
3. **Camera angle** — low, high, eye-level, over-the-shoulder, Dutch
4. **Camera movement** — one clear verb: push in, pull out, track, orbit, pan, tilt, handheld, static

**Vary all four across the sequence.** Don't repeat the same shot size, lens, angle, or movement in consecutive shots. Each cut should shift the viewer's perspective meaningfully.

### Step 7 — Write the video prompt

Output the sequence as **separate paragraphs inside a single fenced code block** — one paragraph per shot, separated by a blank line, each beginning with its timecode stamp followed by the shot description. No lists, no markdown, no headers, no numbered shots.

Weave the asset descriptions (supplied + generated) naturally into the shots — features in close-ups, clothing and silhouette in wides — rather than front-loading a description block. Because the user will attach the generated/supplied stills as references, the video prompt can lean on them: name the asset and let the reference carry the fine detail.

**Always end the video prompt with three metadata sections** after a blank line following the final shot, sitting together with no blank lines between them:

1. **Location:** — from the scene brief, location + time of day (e.g. `Location: Narrow Tokyo alley, night`).
2. **Style:** — one of the two fixed lines, depending on the look chosen in "Bildstil" above.

   *Photoreal (default):*
   `Style: Cool shadows, natural skin tones with realistic skin texture and visible pores. IMAX-scale composition, deep focus, practical lighting. High contrast, grounded realism. Epic large-format anamorphic cinematography, subtle filmic grain.`

   *Pixar look:*
   `Style: Premium cinematic comedy 3D animated film look. Highly expressive characters, oversized round eyes, exaggerated facial expressions, fluffy plush-like fur, soft rounded shapes, stylized proportions, polished feature-film-quality rendering. Warm cinematic lighting, cozy atmosphere, glossy realistic materials, detailed fur texture, shallow depth of field, soft bokeh, strong emotional readability.`
3. **Audio:** — always the same fixed line:
   `Audio: Diegetic sound only — natural ambience, environmental foley, and subject-driven sound.`
4. **Negatives:** — appended after Audio with no blank line between. Same base line for both looks, with one addition for the Pixar look.

   *Photoreal (default):*
   `Negatives: No subtitles, no on-screen text, no captions, no watermarks, no music, no score, no BGM. No face-swapping or identity drift between shots, no distortion, no extra fingers or limbs.`

   *Pixar look — same line plus the style guards:*
   `Negatives: No subtitles, no on-screen text, no captions, no watermarks, no music, no score, no BGM. No face-swapping or identity drift between shots, no distortion, no extra fingers or limbs. No flat illustration, no cheap cartoon look, no low detail, no dull lighting, no photorealistic human skin.`

**Dialogue and diegetic music — variations on the Audio and Negatives lines.** The default Audio line assumes no speech and no music. Two common scenes need it relaxed, and both stay diegetic:

- *Dialogue.* Spoken lines are in-world sound, so they're allowed — the default line just doesn't invite them. Permit it explicitly: "Diegetic sound only — in-world spoken dialogue plus realistic foley and ambience." Put each spoken line in its own shot, in quotes, followed by its audio tag and a short delivery note (accent, tone), plus "ensure the voice matches @[tag]" to lock voice consistency. Tag every line **separately** — never merge two lines split by a beat of action (a line before a reveal and a line after it) under one tag, or the model fights the pause between them. Keep dialogue out of the negatives.

  **Always declare the language, and prefer curly braces over quotes.** This overrides
  the older quote convention above: a line without a stated language may come back in
  another language, and the model reads `{...}` as the exact text to voice. Write speaker,
  delivery and language first, then the line in braces: `Dialogue language: natural,
  conversational English. She says quietly: {That was close.}` Quotes still parse, but
  they carry no language and no delivery, so they leave the two things that actually
  drift up to the model. See "Deutscher Dialog: Erfahrungswerte".
  **Die Sprache ist Englisch, auch wenn das fertige Video deutsch werden soll**, siehe
  den Abschnitt zum deutschen Dialog weiter oben. Deutsch kommt danach über ElevenLabs.
- *Diegetic music.* Music with an on-screen source — a radio, a jukebox, a live band — is diegetic and fine, but the model must still refuse *non-diegetic* score. Name the source in the Audio line ("…and the song playing from the radio in the scene") and in Negatives forbid "non-diegetic music, score, soundtrack" rather than a blanket "no music". A written slow fade-up of a track is an audio-mix move the model may not honour precisely — treat mix timing as an edit-stage fix, not a reason to re-roll.

These lines total ~500 characters depending on location length, leaving roughly **7,000 characters** for the shot descriptions against the 7,500 ceiling — ample room, so write with texture rather than compressing.

### Step 7b — Consistency & continuity locks

Seedance holds identity and blocking reasonably well across a 30-second multi-shot, but it drifts on a predictable set of things. Add explicit lock lines to the metadata block (sitting with Location/Style/Audio/Negatives) for whichever of these the scene needs — they're cheap insurance and worth adding pre-emptively for any recurring hero character.

**State the trait you want, never the trait you don't.** This is the single most important lesson. Naming an unwanted attribute *anchors* it — the model reads the word and reaches for it. If a feature keeps coming out wrong (a blue eye that should be brown, a clean face that should be scarred), do **not** write "no blue eyes" anywhere, including the negatives — that reinforces blue. Assert the correct value positively and repeatedly instead: "deep warm chocolate-brown irises, matte", restated in the shots where the feature is prominent and once in a character-lock line. Keep the unwanted value out of the prompt entirely. (Generic negatives like "no extra fingers" are unaffected — this rule is specifically about attributes the model is actively getting wrong on your subject.)

**Character-lock line.** For a hero character who must stay identical across shots, add a dedicated line restating their non-negotiable identity — build, hair, signature costume, and any drifting feature stated positively: e.g. "Character lock — the explorer: slim build, full auburn-brown beard, gold wire glasses, backwards cap; eyes deep warm brown, matte, in every shot."

**Blocking lock.** If a spatial relationship between two subjects must not flip (a pursuer always *behind*, a character always screen-left), state it and say it never reverses: "the beast is ALWAYS behind the man, never ahead, positions never flip." Profile and side-on framings give the model the most room to swap positions — if a shot keeps flipping them, re-angle it onto the axis of the relationship (a behind-them tracking shot removes the ambiguity a side view invites).

**Persistent-prop lock.** If a character must hold or wear a specific object in *every* shot, say so once as a lock ("he holds the artefact in every shot he appears in and never lets go") and name the prop in each shot's action rather than trusting it to carry silently — it won't.

**Continuous-action lock.** For unbroken motion — a character sprinting throughout, a vehicle that never stops — state the continuity ("at a continuous full sprint, never stops or slows until he falls"), because the model otherwise inserts a natural-looking pause between cuts.

**State-change props (inert until triggered).** When a prop changes state partway through (a stone that stays dark then ignites; a screen that powers on), describe its *inert* state explicitly in every earlier shot ("grey and dead, not glowing") and place the first change on the exact beat it should happen. Left unstated, the model pre-activates the effect early, because the lit version is the visually salient one.

Also keep spatial logic sane inside a single shot: for a fall onto a hazard, put the hazard clearly *below* ("spikes far below at the bottom of the pit"), or the model may scatter it around or above the subject.

## Working with tagged references

Seedance 2.5 lets the user attach assets and cite them inline with an `@tag`. Guidance for prompts that lean on tags:

**Tag hygiene.** Put a space on both sides of an inline `@tag` so it doesn't fuse to the next word and fail to parse. An inline tag placed in a specific shot takes priority for that shot — use inline tags for the assets a shot genuinely depends on.

**Bulk-tag mode (reference manifest).** When the user has a large batch of references and doesn't want to hand-place each one shot-by-shot, append a REFERENCES manifest at the very end of the video prompt, after the metadata block. Inline tags still win for the shots that need a specific asset; the manifest hands the model the rest of the library to draw on. Format:

```
REFERENCES —
Characters: @[tag] name/role; @[tag] name/role
Environment: @[tag] what it is
Photographs / on-wall images: @[tag] desc; @[tag] desc   (as many as needed)
Props / memorabilia: @[tag] desc; @[tag] desc
Screen / TV clips (video refs): @[tag] what plays on screen
Audio — dialogue: @[tag] "line" — speaker, delivery; ensure the voice matches @[tag]
Audio — music/radio: @[tag] track desc, diegetic
```

Piling a large library into one generation sits at the edge of what the model can juggle: expect wall photos and screen clips to render as *flavour* drawn loosely from the refs rather than each one placed exactly. Tag the two or three hero assets the camera actually lands on inline, and let the manifest carry the rest as texture.

**Environment-reference-only.** A location plate attached as a reference is otherwise treated as a start frame and cloned. To borrow the *space* without inheriting the framing, append after the tag: "use as environment reference only: do not use as a starting frame, do not inherit the composition, the angle or the colour — take only the space and the texture."

**Tiling many images across a surface (photo walls, screen banks).** To fill a wall with hundreds of photos from a handful of refs, describe the surface as a dense overlapping collage and drop the tags inline in the establishing shots, spread across the shots where the camera is actually on that surface: "hundreds of photographs cover every wall, a chaotic overlapping collage @[p1] @[p2] @[p3] … repeated, overlapped and scattered at all angles and sizes." The prose carries the look even for refs that don't individually land. For screens, framing the footage as "distorted, heavy with static and video noise" both sets atmosphere and gives cover if clip playback comes through glitchy — on-screen video playback is the least reliable tagged-ref behaviour, so treat it as experimental and test one screen before committing to a bank of them.

### Step 8 — Count and deliver

**Count the video prompt.** With the 7,500 ceiling this rarely bites, but if it exceeds the limit apply the trim priority (safety net only):

1. **Compress adjectives and adverbs** — cut atmospheric padding first.
2. **Merge shot descriptions** — if two consecutive shots share a location element, state it once.
3. **Shorten subject references** — after the first shot establishes a character, use shorter identifiers.
4. **Simplify camera specs** — drop the lens mm only if the shot size already implies it. Last resort.
5. **Never cut**: the timecode stamps, the shot size/angle/movement specs, or the Location/Style/Audio/Negatives metadata.

**Deliver in this order:**

*Default (no image prompts requested):*

1. The **video prompt** in a single fenced code block, no commentary inside.
2. A brief companion note (3–4 sentences) covering the shot structure and why, and one or two tweaks to try if the first generation doesn't land. When a single shot stacks several fragile asks at once (a prop held *and* a specific hazard *and* a fall, say), advise re-rolling **that shot in isolation** rather than regenerating the whole sequence — one shot is cheap to iterate, thirty seconds is not. If useful, close by offering the asset image prompts as an optional follow-up.

*When image prompts were requested:*

1. A one-line summary of the asset split (generated vs supplied).
2. Each **image prompt** in its own labelled fenced code block.
3. The **video prompt** in a single fenced code block, no commentary inside.
4. A brief companion note (3–4 sentences) covering: the shot structure and why; how the image assets feed the video (generate the stills, then attach them as Seedance references); and one or two tweaks to try if the first generation doesn't land.

## Example

*(This example shows the full path, i.e. the user asked for the image prompts as well as the video prompt. If they hadn't, the output would be the video prompt and companion note only.)*

**User uploads a character reference of a lone scavenger in a patched dust cloak and cracked goggles, and says:** "Seedance 2.5 — the scavenger crosses a salt-flat wasteland at dusk, finds a half-buried transmitter in the ruins of a dead city, and powers it on. Give me the asset image prompts too."

**Asset inventory:** Character — the scavenger *(supplied — reference provided, no image prompt)*. Location — salt-flat wasteland / ruined city at dusk *(generate)*. Prop — the half-buried transmitter *(generate)*.

**Output (abridged):**

`IMAGE PROMPT — Location: salt-flat wasteland at the edge of a dead city, dusk`

```
Extreme wide establishing shot, 24mm lens, low eye-level, of a vast wind-scoured salt flat stretching to a bruised dusk horizon, the skeletal skyline of a ruined city rising in the far distance, half-buried steel ribs and collapsed structures jutting from the cracked white salt in the mid-ground. No figures. Last copper light rakes low across the flat from the right, throwing long cool shadows off every ridge, the sky graduating from burnt orange at the horizon to deep indigo overhead. Fine grit streams off the ridgelines in the wind. Texture: cracked salt crust flaking at the edges, corroded rust-streaked steel. Deep focus throughout. Cinematic photorealism, grounded large-format look — cool shadows, natural tones, high contrast, practical light, IMAX scale. No text, no watermarks, no extra limbs, no deformed hands, no AI artifacts, no uncanny valley.
```

`IMAGE PROMPT — Prop: the buried transmitter`

```
Prop reference sheet — four views on a neutral grey background:
[VIEW 1 — FRONT] Full front view of this prop, entire object visible and centred.
[VIEW 2 — REAR] Full rear view of the same prop, directly from behind. Entire object visible.
[VIEW 3 — 3/4 DETAIL] Three-quarter angle close-up. Sharp detail on surface material, texture, construction, and any markings.
[VIEW 4 — PROFILE] 90-degree side profile of the same prop.
Lighting & presentation: Clean studio lighting — soft key light upper left, gentle fill from the right. Consistent scale, proportions, materials, and detailing across all four views. No text, no watermarks, no extra objects, no background environment.
The prop is a battered military-grade field transmitter, a dented olive-drab casing scoured to bare metal at the corners, a cracked analogue dial and a single corroded toggle switch on its face, a bent whip antenna folded against the body, grit packed into every seam. Photorealistic detail. Texture: pitted corroded steel, salt crust in the seams, scratched glass over the dial. No extra limbs, no deformed hands, no AI artifacts, no uncanny valley.
```

`VIDEO PROMPT`

```
[00:00 - 00:05] Wide, 24mm, low angle, slow track — the scavenger in patched dust cloak and cracked goggles crosses the salt flat, silhouette small against a bruised dusk sky, grit streaming off the ridgelines behind them.

[00:05 - 00:09] Medium, 35mm, eye-level, handheld — they trudge closer, cloak snapping in the wind, rebreather at the jaw, the ruined skyline hardening on the horizon.

[00:09 - 00:13] Close-up, 85mm, high angle, static — cracked goggle lenses fill the frame, dust in every seam, a curved reflection of the dying sun across the glass.

[00:13 - 00:17] Medium wide, 35mm, Dutch angle, push in — they halt at collapsed steel ribs and drop to a crouch, one gloved hand sweeping salt from a buried shape.

[00:17 - 00:22] Macro, 100mm, eye-level, slow pull out — gloved fingers close on the dented transmitter, its cracked dial and corroded toggle revealed as grit falls away.

[00:22 - 00:26] Low wide, 24mm, low angle, orbit — the scavenger rises with the transmitter, cloak billowing, the dead city arcing behind them as the camera circles.

[00:26 - 00:30] Medium close-up, 50mm, eye-level, static — a thumb flicks the toggle, the dial's needle twitches alive, faint glow catching the goggles as the first cold stars appear.

Location: Salt-flat wasteland at the edge of a ruined city, dusk into nightfall.
Style: Cool shadows, natural skin tones with realistic skin texture and visible pores. IMAX-scale composition, deep focus, practical lighting. High contrast, grounded realism. Epic large-format anamorphic cinematography, subtle filmic grain.
Audio: Diegetic sound only — natural ambience, environmental foley, and subject-driven sound.
Negatives: No subtitles, no on-screen text, no captions, no watermarks, no music, no score, no BGM. No face-swapping or identity drift between shots, no distortion, no extra fingers or limbs.
```

Two assets generated (location plate, transmitter), the scavenger reused from your supplied reference. Generate the location and prop stills first, then run the video prompt in Seedance 2.5 with all three as attached references so the look stays locked. 7 shots, graduated pacing — two slow establishing beats, a tactile mid-section on the find, then the orbit reveal and the power-on button. If the orbit in shot 6 feels rushed, push it to 5 seconds and trim shot 2 to 3.

## Output language and writing rules

The prompts themselves are always written in English. Everything written around them for the user (questions, the companion note, explanations) is written in the user's language, German by default.

- Real umlauts always in German text: ä ö ü ß. Never ae, oe, ue or ss as a substitute.
- Never invent facts. When something is missing, ask instead of guessing.

## Handling variations

**No references supplied at all.** Every important asset goes on the to-generate list. If the user asked for image prompts, write one for each character, location, and hero prop, then the video prompt; if they didn't, skip straight to the video prompt and describe those assets in-line (optionally offering the image prompts afterwards).

**Everything supplied.** If the user has provided references for every important asset, skip Step 4 entirely — analyse the references for their DNA and go straight to the video prompt.

**Multiple characters.** Inventory each separately; supplied ones are analysed, missing ones get image prompts. In the video, distribute character introductions across shots and use over-the-shoulder angles to establish spatial relationships.

**No action specified.** Default to movement through the space — walking, exploring, arriving — so the edit has something to cut around. Ask if unsure, but don't block.

**Slow / contemplative scenes.** 6–8 longer shots (4–5s each), static or slow push-ins, wider lenses, more negative space.

**Fast / high-energy scenes.** 12–15 shorter shots (2–3s each), handheld/tracking/quick pans, tighter sizes, aggressive angles.

**Interior vs exterior.** Interiors favour tighter lenses (50mm, 85mm) and closer sizes; exteriors can open wide (24mm, 35mm) to sell the space before cutting in. Match the location image plates to the same logic.

**Abstract or surreal scenes.** The framework still applies — surreal content benefits from grounded camera language and photoreal grading. Dreamlike ≠ vague; keep the specs precise.

**Story longer than 30 seconds.** If what the user describes can't breathe inside 30 seconds, split it into Parts of 30 seconds each and say why. The same Part logic covers the deliberate two-part 15-second split described under "Sequence length": identical rules, shorter Parts, and every metadata block and lock repeated in full in each Part. Cut at a hard beat — an impact, a door, a blackout — where the next Part can open cleanly without replaying the transition (e.g. end Part 1 on the crash *through* the roof; open Part 2 pushing up off the floor inside). Each Part is a self-contained video prompt with its own metadata and locks. Don't overstuff: a reference-heavy or dialogue-heavy scene needs *fewer, longer* resting shots so the tagged assets and spoken lines get screen time — six or seven shots, not twelve.
