# Schreib-Prompt (reduce-Schritt)

Drei Schreiber pro Berater, in einer Nachricht gestartet, parallel: `subagent_type: general-purpose` (Standardmodell). Ersetze die Klammern. Schreiber A bekommt `frameworks.md, principles.md, books.md`, Schreiber B `positions.md, stories.md`, Schreiber C `voice.md`. Der Prompt unten ist eine Anweisung an einen Sub-Agenten und bleibt englisch. Die Dateien, die er schreibt, sind deutsch, außer den wörtlichen Zitaten.

```
ROAST ROOM SEAT BUILD: WRITE THE BRAIN

Language: everything a human will read in the files you write (headings, paraphrases, summaries, scoring guidance) is written in German, addressing the founder as "du" where you address anyone, with real umlauts (ä, ö, ü, ß) and no em or en dashes. Verbatim quotes ALWAYS stay in the original language of the source, character for character: check_quotes.mjs compares them with the corpus, so a translated quote fails. After a quote you may add a short German paraphrase without quotation marks.

You are writing part of the brain for a new Roast Room seat: [Full Name], who holds the [pillar] seat and owns the question "[question]". The brain teaches a council agent to reason, decide, and talk like this person, so it must capture how they decide, not their biography.

Repo root: [absolute path]
Read first:
- .claude/skills/newroaster/references/brain-spec.md (layout, budgets, and rules). Depth: [quick | standard | deep].
- Every notes file in [build]/notes/ (their quotes are already verified verbatim).
- .claude/skills/roast-room/brains/[slug]/sources.md (the source id table, with dates).
- For format, skim the same files of one original seat: .claude/skills/roast-room/brains/paul-graham/.
You may open a corpus file in [build]/corpus/ only to check a quote's context or who is speaking.

Write exactly these files into .claude/skills/roast-room/brains/[slug]/ and nothing else: [files].

Rules:
- Copy every quote exactly from the notes, with its source id, like "..." (S014), in the original language. Quotes stay under 45 words. Quotation marks mean verbatim: paraphrase goes without them.
- Merge duplicates across batches and count sources across all of them. Most-used first.
- Weight what a founder would bring to this seat: business decisions in [pillar]. Keep off-topic material (philosophy, politics, health, family) thin unless it shapes how they decide.
- Where views changed over time, show both with dates and mark the newer one.
- Lines that are your reading of several sources say "abgeleitet aus S0xx, S0yy".
- No em dashes or en dashes anywhere outside verbatim quotes. Plain German, no filler.

When done, run: node .claude/skills/newroaster/scripts/check_quotes.mjs [build] .claude/skills/roast-room/brains/[slug]
Fix anything it reports in your files, and run it again until your files pass.

Reply with one line: files written and entry counts.
```
