#!/usr/bin/env node
// Register a finished seat in the Roast Room roster (.claude/skills/roast-room/roster.json).
//
//   node .claude/skills/newroaster/scripts/add_seat.mjs --key naval --name "Naval Ravikant" --short Naval \
//     --slug naval-ravikant --pillar "Hebel und Vermögen" --question "Baut das einen Hebel auf, der dir gehört?" \
//     --dimension "Hebelwirkung und langfristiger Vermögensaufbau" [--color "#8A2434"] [--default] [--swap <key>]
//
// Checks the agent file and the brain exist first, so a half-built seat never reaches the table.
// --default puts the seat on the default board; --swap <key> takes that seat off the board in
// the same move (the board holds at most nine). Running it again for the same key updates it.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const SKILL = path.join(ROOT, ".claude", "skills", "roast-room");
const ROSTER = path.join(SKILL, "roster.json");
const MAX_BOARD = 9;
const BRAIN_FILES = ["_hot.md", "frameworks.md", "principles.md", "positions.md", "voice.md", "stories.md", "sources.md"];
const PALETTE = ["#8A2434", "#BB3146", "#F0A442", "#EC8D13", "#D57F11", "#C9A227", "#B5652B", "#7A4A2A", "#A34A28", "#5E1A26", "#D9C3B0", "#9C6B3E"].map((c) => c.toLowerCase());

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const fail = (m) => { console.error("add_seat: " + m); process.exit(1); };

const seat = {
  key: (opt("key") || "").toLowerCase(),
  name: opt("name"), short: opt("short"), initials: opt("initials"), slug: opt("slug"),
  pillar: opt("pillar"), question: opt("question"), dimension: opt("dimension"), color: opt("color"),
};
for (const f of ["key", "name", "short", "slug", "pillar", "question", "dimension"]) if (!seat[f]) fail(`--${f} fehlt`);
if (!/^[a-z][a-z0-9]{1,15}$/.test(seat.key)) fail("--key muss aus 2 bis 16 Kleinbuchstaben oder Ziffern bestehen und mit einem Buchstaben beginnen");
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(seat.slug)) fail("--slug muss wie vorname-nachname aussehen");
seat.initials ||= seat.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 3).toUpperCase();

const agent = path.join(ROOT, ".claude", "agents", `council-${seat.key}.md`);
if (!fs.existsSync(agent)) fail(`Agent-Datei fehlt: ${path.relative(ROOT, agent)}`);
const brain = path.join(SKILL, "brains", seat.slug);
const missing = BRAIN_FILES.filter((f) => !fs.existsSync(path.join(brain, f)));
if (missing.length) fail(`im Wissensspeicher ${path.relative(ROOT, brain)} fehlen: ${missing.join(", ")}`);

const r = JSON.parse(fs.readFileSync(ROSTER, "utf8"));
const others = r.seats.filter((s) => s.key !== seat.key);
if (others.some((s) => s.slug === seat.slug)) fail(`Der Slug ${seat.slug} gehört schon einem anderen Berater`);
if (others.some((s) => s.short.toLowerCase() === seat.short.toLowerCase())) fail(`Der Kurzname ${seat.short} ist vergeben, nimm einen anderen`);
if (!/^#[0-9a-f]{6}$/i.test(seat.color || "")) {
  const used = new Set(r.seats.map((s) => s.color.toLowerCase()));
  seat.color = PALETTE.find((c) => !used.has(c)) || PALETTE[r.seats.length % PALETTE.length];
}
const at = r.seats.findIndex((s) => s.key === seat.key);
if (at >= 0) r.seats[at] = seat; else r.seats.push(seat);

const swap = opt("swap");
if (swap) r.default = r.default.filter((k) => k !== swap);
if (args.includes("--default") && !r.default.includes(seat.key)) {
  if (r.default.length >= MAX_BOARD) fail(`Die Standardrunde hat schon ${MAX_BOARD} Plätze, nimm mit --swap <key> einen heraus`);
  r.default.push(seat.key);
}

// one seat per line keeps the file easy to read and edit by hand
const line = (o) => "{ " + Object.entries(o).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(", ") + " }";
const out = [
  "{",
  `  "board": ${JSON.stringify(r.board || "default")},`,
  `  "default": [${r.default.map((k) => JSON.stringify(k)).join(", ")}],`,
  `  "seats": [`,
  r.seats.map((s) => "    " + line(s)).join(",\n"),
  "  ]",
  "}",
].join("\n") + "\n";
JSON.parse(out); // never write a file the room cannot read
fs.writeFileSync(ROSTER, out);

console.log(`${seat.name} (${seat.key}) wurde im Roster ${at >= 0 ? "aktualisiert" : "eingetragen"}.`);
console.log(`Standardrunde (${r.default.length}): ${r.default.map((k) => r.seats.find((s) => s.key === k)?.short || k).join(", ")}`);
console.log(`Einstellung der Runde: ${r.board || "default"}`);
