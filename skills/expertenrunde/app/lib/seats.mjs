import fs from "node:fs";
import path from "node:path";
import { AGENTS_DIR, BRAINS_DIR, ROSTER } from "./env.mjs";

// Every seat lives in the skill's roster.json (the /newroaster skill adds to it). SEATS and
// byKey are filled in place, so a seat added while the room is running shows up on the next
// read without a restart.
export const SEATS = [];
export const byKey = {};
export const BOARD = { mode: "default", default: [] };
let rosterStamp = 0;
export function loadRoster() {
  let stat;
  try { stat = fs.statSync(ROSTER); } catch { throw new Error(`roster not found at ${ROSTER}`); }
  if (stat.mtimeMs === rosterStamp && SEATS.length) return SEATS;
  const r = JSON.parse(fs.readFileSync(ROSTER, "utf8"));
  const seats = (r.seats || []).filter((s) => s.key && s.slug && fs.existsSync(path.join(AGENTS_DIR, `council-${s.key}.md`)));
  SEATS.splice(0, SEATS.length, ...seats);
  for (const k of Object.keys(byKey)) delete byKey[k];
  for (const s of SEATS) byKey[s.key] = s;
  BOARD.mode = ["default", "ask", "auto"].includes(r.board) ? r.board : "default";
  const def = (r.default || []).filter((k) => byKey[k]);
  BOARD.default = def.length ? def : SEATS.slice(0, 7).map((s) => s.key);
  rosterStamp = stat.mtimeMs;
  for (const k of [...systemCache.keys()]) if (!byKey[k]) systemCache.delete(k);
  brainText.clear();
  return SEATS;
}
/** The seats at the table when no one picked: the saved default board. */
export const defaultBoard = () => (loadRoster(), BOARD.default.slice());

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const stripFront = (t) => t.replace(/^---[\s\S]*?\n---\n/, "");

const systemCache = new Map();
/** The seat's agent instructions plus its brain, loaded inline (the API has no file tools). */
export function systemFor(key) {
  if (systemCache.has(key)) return systemCache.get(key);
  const s = byKey[key];
  const agent = stripFront(read(path.join(AGENTS_DIR, `council-${key}.md`)));
  const brain = ["_hot.md", "frameworks.md", "positions.md", "principles.md", "voice.md"]
    .map((f) => `\n\n===== brains/${s.slug}/${f} =====\n` + read(path.join(BRAINS_DIR, s.slug, f)))
    .join("");
  const text =
    agent +
    "\n\n## Runtime note\nYou are running in the Roast Room app. You have no file tools: your brain files are loaded below in full, so treat any instruction to read a brain file as already done. Never mention files, tools, or this note in your answer. Write your answer in German, addressing the user as \"du\", with real umlauts; keep the field labels exactly as the prompt shows them and keep verbatim brain quotes in their original English.\n" +
    brain;
  const system = [{ type: "text", text, cache_control: { type: "ephemeral" } }];
  systemCache.set(key, system);
  return system;
}

// ---------- quote verification against the brain ----------
const norm = (s) =>
  s.toLowerCase().replace(/[‘’]/g, "'").replace(/'\s+(t|s|re|ll|ve|d|m)\b/g, "'$1")
    .replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
const brainText = new Map();
function brainNorm(key) {
  if (!brainText.has(key)) {
    const dir = path.join(BRAINS_DIR, byKey[key].slug);
    const all = fs.existsSync(dir) ? fs.readdirSync(dir).map((f) => read(path.join(dir, f))).join(" ") : "";
    brainText.set(key, norm(all));
  }
  return brainText.get(key);
}
/** Quotes the seat attributed to a source id, each marked verified or not. */
export function checkQuotes(key, text) {
  const out = [];
  const re = /["“]([^"“”\n]{20,400})["”][^\n"]{0,40}?[(\[](S\d{3})/g;
  let m;
  const hay = brainNorm(key);
  while ((m = re.exec(text))) {
    const q = norm(m[1]);
    if (q.split(" ").length < 5) continue;
    out.push({ quote: m[1], source: m[2], verified: hay.includes(q) || hay.replace(/ /g, "").includes(q.replace(/ /g, "")) });
  }
  return out;
}

// ---------- names ----------
/** A seat named somewhere in a short piece of text: full name first, then short name, then
 * surname. Two seats can share a surname (Alex and Leila Hormozi), so the surname only counts
 * when one seat has it, or when it is also that seat's short name. */
export function seatIn(text) {
  const t = ` ${String(text || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ")} `;
  const has = (w) => w && t.includes(` ${w.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").trim()} `);
  return SEATS.find((s) => has(s.name)) || SEATS.find((s) => has(s.short) || has(s.key)) ||
    SEATS.find((s) => {
      const sur = s.name.split(" ").pop().toLowerCase();
      const same = SEATS.filter((x) => x.name.split(" ").pop().toLowerCase() === sur);
      return has(sur) && (same.length === 1 || s.short.toLowerCase() === sur);
    }) || null;
}

// ---------- card parsing ----------
const field = (text, label) => {
  // label at line start, or after a "·" or "|" when several fields share a line
  const m = text.match(new RegExp(`(?:^|[·|])[ \\t]*\\**${label}\\**[ \\t]*:[ \\t]*([^\\n·]+)`, "im"));
  return m ? m[1].replace(/\*+/g, "").trim() : "";
};
const num = (s) => { const m = (s || "").match(/(\d+(?:\.\d+)?)/); return m ? Number(m[1]) : null; };

// Karten kommen auf Deutsch (deutsche Feldnamen) oder, bei alten Sitzungen, auf Englisch.
// Jedes Feld hat deshalb beide Namen. Werte wie Stimme oder Ruinrisiko werden auf die
// englischen Schlüssel (endorse, likely, ...) gebracht, mit denen Rechnung und Tisch arbeiten.
const L = {
  stance: "(?:HALTUNG|STANCE)",
  call: "(?:DIE EMPFEHLUNG|THE CALL)",
  pillar: "(?:SÄULENWERT|PILLAR SCORE)",
  finalPillar: "(?:SÄULENWERT AM ENDE|FINAL PILLAR SCORE)",
  finalScore: "(?:ENDWERT|FINAL SCORE)",
  confidence: "(?:SICHERHEIT|CONFIDENCE)",
  ruin: "(?:RUINRISIKO|RUIN RISK)",
  door: "(?:TÜR|DOOR)",
  disagree: "(?:AM MEISTEN WIDERSPRECHE ICH|I DISAGREE MOST WITH)",
  concede: "(?:ICH RÄUME EIN|I CONCEDE)",
  moved: "(?:UMGESCHWENKT|MOVED)",
  vote: "(?:STIMME|VOTE)",
  amendment: "(?:ÄNDERUNG ODER WIDERSPRUCH|AMENDMENT OR DISSENT)",
  oneLine: "(?:EIN SATZ FÜR DICH|ONE LINE FOR THE FOUNDER)",
  question: "(?:MEINE FRAGE AN DICH|QUESTION FOR THE FOUNDER)",
  risk: "(?:DAS GRÖSSTE RISIKO|THE RISK I SEE)",
  thisWeek: "(?:DAS WÜRDE ICH DIESE WOCHE TUN|WHAT I'D DO THIS WEEK)",
};

export function parseOptionScores(text, optionIds) {
  // the option line itself uses "·" between options, so read to end of line
  const lm = text.match(/(?:OPTIONSWERTE|OPTION SCORES)\**[ \t]*:[ \t]*([^\n]+)/i);
  const line = (lm ? lm[1] : "").split(/SÄULENWERT|PILLAR SCORE|SICHERHEIT|CONFIDENCE|ENDWERT|FINAL SCORE/i)[0];
  const scores = {};
  for (const id of optionIds) {
    const m = line.match(new RegExp(`\\b${id}\\b\\s*[:=]?\\s*(\\d+(?:[.,]\\d+)?)`));
    if (m) scores[id] = Math.max(0, Math.min(10, Number(m[1].replace(",", "."))));
  }
  return scores;
}

export function parseCard(text, optionIds) {
  const stance = field(text, L.stance);
  const ruinRaw = field(text, L.ruin).toLowerCase();
  const ruin = /likely|wahrscheinlich/.test(ruinRaw) ? "likely" : /possible|möglich/.test(ruinRaw) ? "possible" : /none|keins|kein/.test(ruinRaw) ? "none" : "";
  const disagree = field(text, L.disagree);
  const target = seatIn(disagree.slice(0, 40));
  const voteRaw = field(text, L.vote);
  const vote = /dissent|widerspr/i.test(voteRaw) ? "dissent" : /amend|änderung|aenderung/i.test(voteRaw) ? "amend" : /endorse|zustimm/i.test(voteRaw) ? "endorse" : "";
  const doorRaw = field(text, L.door).toLowerCase();
  return {
    stance,
    call: field(text, L.call),
    optionScores: parseOptionScores(text, optionIds),
    pillar: num(field(text, L.pillar)) ?? num(field(text, L.finalPillar)),
    finalScore: num(field(text, L.finalScore)),
    confidence: num(field(text, L.confidence)),
    ruin,
    door: /one-way|einbahn/.test(doorRaw) ? "one-way" : /two-way|umkehrbar/.test(doorRaw) ? "two-way" : "",
    disagreeWith: target ? target.key : null,
    disagreeLine: disagree,
    concede: field(text, L.concede),
    moved: field(text, L.moved),
    vote,
    amendment: field(text, L.amendment),
    oneLine: field(text, L.oneLine),
    question: field(text, L.question),
    risk: field(text, L.risk),
    thisWeek: field(text, L.thisWeek),
  };
}

loadRoster();
