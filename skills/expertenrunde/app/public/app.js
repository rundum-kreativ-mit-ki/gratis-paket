import { downloadVerdictPdf } from "./pdf.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const SAMPLES = [
  ["Preise erhöhen?", "Ich verkaufe ein Gruppencoaching mit 15 Teilnehmerinnen zu je 400 € im Monat, also 6.000 € Umsatz. Ich will auf 650 € erhöhen. Optionen: für alle sofort erhöhen, nur für Neue erhöhen oder bei 400 € bleiben. Von meinen Erstgesprächen schließe ich etwa die Hälfte ab. Ich tendiere dazu, für alle zu erhöhen, weil ich zu wenig verdiene."],
  ["Erste Mitarbeiterin?", "Ich bin allein selbstständig mit 9.000 € Umsatz im Monat, Wachstum etwa 4 % pro Monat. Kundenservice und Terminplanung mache ich selbst, rund 15 Stunden pro Woche. Soll ich eine Assistenz in Teilzeit für 1.800 € im Monat einstellen, eine Freelancerin stundenweise buchen oder noch sechs Monate alles selbst machen? Auf dem Konto liegen 20.000 €."],
  ["Zweites Produkt?", "Mein Online-Kurs bringt 5.000 € im Monat. Mehrere Kundinnen fragen nach einer Community mit monatlichem Beitrag. Soll ich die Community als eigenes Abo bauen, sie nur bestehenden Kundinnen anbieten oder mich weiter auf den Kurs konzentrieren? Ich arbeite allein und habe rund 12.000 € Rücklagen."],
  ["Job kündigen?", "Ich verdiene 3.200 € netto im Angestelltenjob. Mein Nebenbusiness bringt 1.500 € im Monat und ist dieses Jahr um 6 % pro Monat gewachsen. Ich habe acht Monatsausgaben gespart. Soll ich jetzt kündigen, in sechs Monaten kündigen oder auf Teilzeit gehen?"],
];

const EXAMPLE = "Ich verkaufe einen Online-Kurs für 297 € und mache damit rund 6.000 € im Monat. Soll ich den Preis für alle auf 497 € erhöhen, nur für Neue erhöhen oder bei 297 € bleiben? Etwa 3 % der Besucherinnen kaufen, auf dem Konto liegen 15.000 €. Erfolg wären 10.000 € im Monat bis März. Ich tendiere zur Erhöhung für alle, weil der Kurs mehr wert ist.";

// Die Anleitung: im Seitenfeld, solange der Raum leer ist, und unter "So geht’s".
const GUIDE = `
  <div class="guide">
    <div class="guide-sec">
      <h4>So nutzt du die Expertenrunde</h4>
      <ol>
        <li><span>Öffne Claude Code in diesem Ordner.</span></li>
        <li><span>Tipp <code>/roast-room</code> und dahinter deine Entscheidung.</span></li>
        <li><span>Wähl deine Berater (der Vorsitz schlägt eine Besetzung vor) und beantworte seine Fragen. Dann schau hier zu, wie die Runde streitet.</span></li>
        <li><span>Steht das Urteil, lädst du es als PDF herunter.</span></li>
      </ol>
    </div>
    <div class="guide-sec">
      <h4>Was in deine Frage gehört</h4>
      <ul>
        <li><span><b>Die Entscheidung</b> in einem Satz.</span></li>
        <li><span><b>Deine Optionen.</b> Zwei oder drei. „So weitermachen wie bisher“ zählt auch.</span></li>
        <li><span><b>Deine Zahlen.</b> Umsatz, Geld auf dem Konto, Teamgröße.</span></li>
        <li><span><b>Deine Grenzen.</b> Frist, Stunden, Budget.</span></li>
        <li><span><b>Woran du Erfolg misst</b>, und bis wann.</span></li>
        <li><span><b>Wohin du tendierst</b>, und warum. Die Runde nimmt das auseinander.</span></li>
      </ul>
      <p class="note" style="margin-top:8px">Etwas vergessen? Der Vorsitz fragt nach, bevor die Runde startet.</p>
    </div>
    <div class="guide-sec">
      <h4>Beispiel</h4>
      <div class="example">
        <p><code>/roast-room</code> ${EXAMPLE.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p>
        <button class="ghost" type="button" data-copy-example>Beispiel kopieren</button>
      </div>
    </div>
    <div class="guide-sec">
      <h4>Gut zu wissen</h4>
      <ul>
        <li><span><b>Besetzung wählen:</b> Der Vorsitz schlägt die Berater vor, die zu deiner Frage passen, und fragt dich. Du kannst jeden dazunehmen oder rauslassen.</span></li>
        <li><span><b>Volle Runde:</b> 5 bis 7 Berater, 3 Runden. Für große Entscheidungen, die sich schwer zurückdrehen lassen.</span></li>
        <li><span><b>Schnell:</b> Mit <code>--quick</code> sitzen 4 Berater 2 Runden lang. Das verbraucht viel weniger von deinem Claude-Kontingent.</span></li>
        <li><span><b>Jede Runde wird gespeichert.</b> Unter „Frühere Runden“ spielst du sie ab oder lädst das PDF.</span></li>
        <li><span><b>Neuer Berater:</b> <code>/newroaster</code> und ein Name. Deine Standardbesetzung änderst du mit <code>/roast-room board</code>.</span></li>
      </ul>
    </div>
  </div>`;

const SHAPES = ["base", "open", "mid", "blink"];
// A seat's cartoon frames live in /portraits/<key>-<shape>.webp (or .png, .jpg). A seat added with /newroaster
// may have only a base frame, or none: missing frames fall back to the base frame, then to a
// drawn bust in the seat's color whose mouth and eyes still move.
const portrait = (key, shape = "base") => {
  const have = state.byKey[key]?.portraits || {};
  return have[shape] || have.base || drawnBust(key, shape);
};
const bustCache = new Map();
function drawnBust(key, shape) {
  const id = `${key}-${shape}`;
  if (bustCache.has(id)) return bustCache.get(id);
  const s = state.byKey[key] || {};
  const c = /^#[0-9a-f]{6}$/i.test(s.color || "") ? s.color : "#8A2434";
  const initials = esc((s.initials || s.short || key).slice(0, 3).toUpperCase());
  const eyes = shape === "blink"
    ? `<path d="M226 250h30M304 250h30" stroke="#1d2733" stroke-width="7" stroke-linecap="round"/>`
    : `<circle cx="241" cy="250" r="11" fill="#1d2733"/><circle cx="319" cy="250" r="11" fill="#1d2733"/><circle cx="245" cy="246" r="3.5" fill="#fff"/><circle cx="323" cy="246" r="3.5" fill="#fff"/>`;
  const mouth = shape === "open" ? `<ellipse cx="280" cy="318" rx="24" ry="17" fill="#5a2430"/>`
    : shape === "mid" ? `<ellipse cx="280" cy="316" rx="20" ry="8" fill="#5a2430"/>`
    : `<path d="M256 312q24 16 48 0" fill="none" stroke="#5a2430" stroke-width="7" stroke-linecap="round"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 560"><g transform="translate(-14 -64) scale(1.05)">
    <path d="M70 640c0-160 86-250 210-250s210 90 210 250z" fill="${c}"/>
    <path d="M232 384h96l-48 58z" fill="#e9eef3"/>
    <rect x="248" y="330" width="64" height="70" rx="22" fill="#d9b49a"/>
    <ellipse cx="280" cy="250" rx="112" ry="128" fill="#e8c4a8"/>
    <path d="M168 236c0-90 50-122 112-122s112 32 112 122c-20-46-60-64-112-64s-92 18-112 64z" fill="#3a4654"/>
    ${eyes}${mouth}
    <text x="280" y="540" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-weight="800" font-size="54" fill="rgba(255,255,255,.92)">${initials}</text>
  </g></svg>`;
  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  bustCache.set(id, url);
  return url;
}
const ROUND_NAME = ["", "Eröffnung", "Schlagabtausch", "Abstimmung"];

const state = {
  seats: [], byKey: {}, board: [], table: [], session: null, options: [], weights: {}, active: [], round: 0,
  cards: { 1: {}, 2: {}, 3: {} }, replaying: false, verdict: null, links: [], geo: {}, setup: null, wait: null,
};

// ------------------------------------------------------------- boot
async function boot() {
  const r = await refreshSeats();
  state.runner = r.runner;
  if (r.runner === "api" && !r.hasKey) toast("Kein ANTHROPIC_API_KEY in der .env gefunden. Trag ihn ein und starte den Server neu.");
  renderSeats(state.board);
  renderSamples();
  bindUI();
  new ResizeObserver(() => { layoutStage(); drawLinks(); }).observe($("#stage"));
  startBlinking();
  reset();
  typeIn($("#composer h2"));
  typeIn($("#waiting h2"));
  const ss = await fetch("/api/sessions").then((x) => x.json());
  if (ss.running) attach(ss.running);
  else if (ss.live) attach(ss.live);
  refreshUsage();
  setInterval(watchForLive, 2500);
  setInterval(tickWait, 1000);
}

// The roster (every seat, plus the default board) comes from the skill's roster.json.
async function refreshSeats() {
  const r = await fetch("/api/seats").then((x) => x.json());
  state.seats = r.seats;
  state.byKey = Object.fromEntries(r.seats.map((s) => [s.key, s]));
  state.board = (r.board?.default || []).filter((k) => state.byKey[k]);
  if (!state.board.length) state.board = r.seats.slice(0, 7).map((s) => s.key);
  bustCache.clear();
  return r;
}

// a council started in Claude Code shows up here on its own
const seenLive = new Set();
async function watchForLive() {
  const ss = await fetch("/api/sessions").then((x) => x.json()).catch(() => null);
  const id = ss?.live || ss?.running;
  if (!id || seenLive.has(id) || id === state.session) return;
  seenLive.add(id);
  attach(id);
}

// Auftritt: eine Überschrift erscheint Zeichen für Zeichen, von unscharf zu scharf
function typeIn(el) {
  if (!el) return;
  const text = el.textContent;
  el.classList.add("typein");
  // characters sit inside a nowrap span per word, so lines only break between words
  let i = 0;
  el.innerHTML = text.split(" ").map((word) => `<span class="wd">${[...word].map((c) => `<span class="ch" style="animation-delay:${i++ * 22}ms">${esc(c)}</span>`).join("")}</span>`).join(" ");
  el.setAttribute("aria-label", text);
}

function renderSamples() {
  $("#samples").innerHTML = SAMPLES.map(([t], i) => `<button type="button" data-i="${i}">${esc(t)}</button>`).join("");
  $("#samples").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    $("#prompt").value = SAMPLES[b.dataset.i][1];
    $("#prompt").focus();
  });
}

const MAX_TABLE = 9; // the most busts the table can seat and still read

/** Seat these keys at the table (roster order). Does nothing when they are already seated. */
function renderSeats(keys) {
  const order = state.seats.map((s) => s.key);
  const want = order.filter((k) => keys.includes(k)).slice(0, MAX_TABLE);
  if (want.join() === state.table.join() && $("#seats").children.length) return;
  state.table = want;
  const seats = want.map((k) => state.byKey[k]);
  $("#seats").innerHTML = seats.map((s, i) => `
    <div class="seat" id="seat-${s.key}" data-seat="${s.key}" style="--d:-${(i * 1.7) % 6}s" tabindex="0" role="button" aria-label="${esc(s.name)}, ${esc(s.pillar)}. Karte öffnen.">
      <div class="think" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="bust" data-shape="base">${SHAPES.map((sh) => `<img class="${sh}" src="${portrait(s.key, sh)}" alt="" draggable="false">`).join("")}</div>
    </div>`).join("");
  $("#plates").innerHTML = seats.map((s) => `
    <div class="nameplate" id="plate-${s.key}" data-seat="${s.key}">
      <b>${esc(s.short === "Gary V" ? "Gary V" : s.name)}</b>
      <small>${esc(s.pillar)}</small>
      <div class="meta"><span class="pips" title="Gewicht bei dieser Entscheidung"></span><span class="chip" hidden></span><span class="score" hidden></span></div>
    </div>`).join("");
  layoutStage();
  startBlinking();
}

// The table is an ellipse seen from the front. Seats sit along its far edge: the
// middle seat is farthest (higher, smaller), the end seats nearest (lower, bigger).
function layoutStage() {
  const stage = $("#stage");
  const W = stage.clientWidth;
  const narrow = matchMedia("(max-width: 820px)").matches;
  const H = narrow ? Math.round(W * 0.62) : stage.clientHeight;
  const cx = W / 2, cy = H * (narrow ? 0.98 : 0.9), rx = W * 0.48, ry = H * (narrow ? 0.46 : 0.42);
  const t = $("#table");
  Object.assign(t.style, { left: `${cx - rx}px`, top: `${cy - ry}px`, width: `${rx * 2}px`, height: `${ry * 2}px` });
  const edge = (x) => cy - ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));
  // seats spread evenly along the far edge; past seven they shrink to fit
  const n = state.table.length;
  const xs = n === 1 ? [0.5] : state.table.map((_, i) => 0.085 + (0.83 * i) / (n - 1));
  const fit = Math.min(1, 6 / Math.max(1, n - 1));
  state.geo = {};
  state.table.forEach((k, i) => {
    const s = state.byKey[k];
    const x = W * xs[i];
    const d = ((x - cx) / rx) ** 2;
    const size = H * (narrow ? 0.5 + 0.08 * d : 0.37 + 0.07 * d) * fit;
    const bottom = edge(x) + size * 0.2;
    const el = $(`#seat-${s.key}`);
    Object.assign(el.style, { left: `${x - size / 2}px`, top: `${bottom - size}px`, width: `${size}px`, height: `${size}px`, zIndex: 10 + Math.round(d * 10) });
    const pl = $(`#plate-${s.key}`);
    pl.style.left = `${x}px`;
    pl.style.top = `${edge(x) + H * 0.01}px`; // straddles the table edge, over the chest
    state.geo[s.key] = { x, head: bottom - size * 0.72, top: bottom - size * 0.9, size };
  });
  const c = $("#center");
  if (narrow) {
    stage.style.paddingTop = `${H}px`; // the scene sits on top; captions flow below it
  } else {
    stage.style.paddingTop = "";
    // the captions start below the lowest nameplate they could collide with
    const inner = (n > 2 ? state.table.slice(1, -1) : state.table).map((k) => $(`#plate-${k}`));
    const top = Math.max(...inner.map((p) => p.offsetTop + p.offsetHeight / 2)) + H * 0.035;
    Object.assign(c.style, { left: `${W * 0.2}px`, width: `${W * 0.6}px`, top: `${top}px`, height: `${H - top - H * 0.09}px` });
  }
  const sp = state.speaking ? state.geo[state.speaking] : null;
  if (sp) moveSpot(state.speaking);
}

function moveSpot(key) {
  const g = state.geo[key]; const spot = $("#spot");
  if (!g) { spot.classList.remove("on"); return; }
  spot.style.left = `${g.x}px`;
  spot.style.top = `${g.head}px`;
  spot.style.width = spot.style.height = `${g.size * 1.9}px`;
  spot.classList.add("on");
}

function bindUI() {
  $("#composer").addEventListener("submit", async (e) => {
    e.preventDefault();
    const prompt = $("#prompt").value.trim();
    if (prompt.length < 10) return toast("Gib der Runde eine echte Entscheidung, mindestens einen Satz.");
    const mode = $('input[name="mode"]:checked').value;
    $("#convene").disabled = true;
    const r = await fetch("/api/council", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt, mode }) });
    const j = await r.json();
    $("#convene").disabled = false;
    if (!r.ok) return toast(j.error || "Die Runde ließ sich nicht starten.");
    attach(j.id);
  });
  const openFrom = (e) => { const b = e.target.closest("[data-seat]"); if (b) openCard(b.dataset.seat); };
  $("#seats").addEventListener("click", openFrom);
  $("#plates").addEventListener("click", openFrom);
  $("#seats").addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openFrom(e); } });
  $("#feed").addEventListener("click", (e) => { const c = e.target.closest(".feed-card"); if (c) openCard(c.dataset.seat, Number(c.dataset.round)); });
  $("#waitHistory").addEventListener("click", openHistory);
  $("#waitGuide").addEventListener("click", openGuide);
  $("#guideBtn").addEventListener("click", openGuide);
  document.addEventListener("click", async (e) => {
    if (e.target.closest("[data-copy-example]")) {
      try { await navigator.clipboard.writeText("/roast-room " + EXAMPLE); toast("Kopiert. Füg es in Claude Code ein."); }
      catch { toast("Kopieren ging hier nicht. Markier den Text und kopier ihn selbst."); }
    }
    if (e.target.closest("[data-pdf]")) savePdf(e.target.closest("[data-pdf]"));
  });
  $("#historyBtn").addEventListener("click", openHistory);
  $("#newBtn").addEventListener("click", reset);
  $("#verdictSheet").addEventListener("click", (e) => { if (e.target.id === "verdictSheet" || e.target.closest("[data-close]")) $("#verdictSheet").hidden = true; });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") $("#verdictSheet").hidden = true; });
  // Clicking the dimmed backdrop around a card, the guide, or past sessions closes it (Escape already does).
  // Both press and release must land outside the box, so a text selection dragged out of it never closes it.
  $$("dialog.card-dialog").forEach((d) => {
    const outside = (e) => {
      const r = d.getBoundingClientRect();
      return e.target === d && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom);
    };
    let pressedOutside = false;
    d.addEventListener("pointerdown", (e) => { pressedOutside = outside(e); });
    d.addEventListener("click", (e) => { if (pressedOutside && outside(e)) d.close(); pressedOutside = false; });
  });
  $$(".speed button").forEach((b) => b.addEventListener("click", () => {
    player.speed = Number(b.dataset.speed);
    $$(".speed button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  }));
  $("#skipBtn").addEventListener("click", () => player.skip());
}

// ------------------------------------------------------------- the player
// Every event goes through one ordered queue. Seats speak one at a time, at a
// readable pace, even though the API answers them in parallel. Skip ahead drains
// whatever is queued instantly; new events after that animate again.
const player = {
  q: [], busy: false, epoch: 0, speed: 1, fast: false, timers: new Set(),
  push(ev) { this.q.push(ev); this.info(); this.pump(); },
  async pump() {
    if (this.busy) return;
    this.busy = true;
    const my = this.epoch;
    while (this.q.length && my === this.epoch) {
      const ev = this.q.shift();
      this.info();
      hideWait();
      try { await handle(ev); } catch (e) { console.error(e); }
    }
    if (my === this.epoch) { this.busy = false; this.fast = false; this.info(); }
  },
  sleep(ms) {
    if (this.fast || ms <= 0) return Promise.resolve();
    return new Promise((res) => { const t = setTimeout(() => { this.timers.delete(o); res(); }, ms / this.speed); const o = { t, res }; this.timers.add(o); });
  },
  flushTimers() { for (const o of this.timers) { clearTimeout(o.t); o.res(); } this.timers.clear(); },
  skip() { this.fast = true; this.flushTimers(); },
  reset() { this.epoch++; this.q.length = 0; this.fast = true; this.flushTimers(); this.busy = false; this.fast = false; this.info(); },
  info() {
    const waiting = this.q.filter((e) => e.type === "seat_done").length;
    $("#queueInfo").textContent = waiting ? `${waiting} ${waiting === 1 ? "Beitrag wartet" : "Beiträge warten"}` : "";
  },
};

// ------------------------------------------------------------- session wiring
function reset() {
  state.es?.close();
  player.reset();
  Object.assign(state, { session: null, options: [], weights: {}, active: [], round: 0, cards: { 1: {}, 2: {}, 3: {} }, replaying: false, verdict: null, links: [], speaking: null, setup: null, wait: null });
  hideWait();
  $("#stage").classList.remove("live");
  $("#topic").hidden = true;
  $("#composer").hidden = state.runner !== "api";
  $("#waiting").hidden = state.runner === "api";
  $("#caption").hidden = true;
  $("#cruxes").hidden = true;
  $("#plate").hidden = true;
  $("#playbar").hidden = true;
  $("#newBtn").hidden = true;
  $("#verdictSheet").hidden = true;
  $("#panelHead").textContent = "Los geht’s";
  $("#feed").innerHTML = GUIDE;
  $$(".vote").forEach((b) => b.remove());
  renderSeats(state.board);
  $$(".seat").forEach((el) => { el.classList.remove("absent", "speaking", "thinking", "addressed"); $(".bust", el).dataset.shape = "base"; });
  $$(".nameplate").forEach((el) => { el.classList.remove("absent", "speaking"); $(".chip", el).hidden = true; $(".score", el).hidden = true; $(".pips", el).innerHTML = ""; });
  $("#spot").classList.remove("on");
  $$(".stepper li").forEach((li) => li.classList.remove("active", "done"));
  drawLinks();
}

function begin(id) {
  reset();
  state.session = id;
  $("#composer").hidden = true;
  $("#waiting").hidden = true;
  $("#newBtn").hidden = false;
  $("#playbar").hidden = false;
  $("#panelHead").textContent = "Kernpunkte";
  $("#feed").innerHTML = '<div class="empty">Eine Zeile pro Platz, während die Runde spricht. Klick auf einen Platz, um die ganze Karte zu lesen.</div>';
  $("#stage").classList.add("live");
  chairSays("Die Runde nimmt Platz", { dots: true });
}

function attach(id) {
  begin(id);
  const es = new EventSource(`/api/stream/${id}`);
  state.es = es;
  es.onmessage = (m) => {
    const ev = JSON.parse(m.data);
    if (ev.type === "end") { es.close(); refreshUsage(); return; }
    if (ev.type === "delta") return; // seats speak from their finished cards
    if (ev.type === "usage") return refreshUsage();
    if (ev.type === "seat_error") return toast(`Fehler bei ${state.byKey[ev.seat].short}: ${ev.error}`);
    player.push(ev);
  };
  es.onerror = () => { /* the browser retries; the server replays from the start */ };
}

// ------------------------------------------------------------- event handling
const STEP_OF = { setup: "setup", round1: "round1", cruxes: "cruxes", round2: "round2", draft: "round3", round3: "round3", skip3: "round3", verdict: "verdict" };
const ORDER = ["setup", "round1", "cruxes", "round2", "round3", "verdict"];

function setStep(step) {
  const idx = ORDER.indexOf(step);
  $$(".stepper li").forEach((li) => {
    const i = ORDER.indexOf(li.dataset.step);
    li.classList.toggle("done", i < idx);
    li.classList.toggle("active", i === idx);
  });
}

async function handle(ev) {
  switch (ev.type) {
    case "phase": {
      state.wait = { phase: ev.phase, at: ev.at || Date.now() };
      setStep(STEP_OF[ev.phase] || "setup");
      feedPhase(ev.label);
      const thinking = ["setup", "cruxes", "draft", "verdict"].includes(ev.phase);
      if (thinking || ev.phase === "skip3") {
        chairSays(ev.label.replace(/^The Chair is /, "").replace(/^./, (c) => c.toUpperCase()), { dots: thinking });
        await player.sleep(1400);
      }
      break;
    }
    case "setup": state.setup = ev; await onSetup(ev); await player.sleep(1800); break;
    case "round_start": onRoundStart(ev.round); break;
    case "seat_start": $(`#seat-${ev.seat}`)?.classList.add("thinking"); break;
    case "seat_done": await onSeatDone(ev); break;
    case "round_done": state.wait = null; updateOptions(ev.scores); break;
    case "cruxes": await onCruxes(ev); break;
    case "draft": await onDraft(ev.draft); break;
    case "verdict": state.wait = null; onVerdict(ev); break;
    case "error": state.wait = null; toast(`Die Runde wurde abgebrochen: ${ev.error}`); chairSays(`Die Runde wurde abgebrochen: ${ev.error}`); break;
  }
}

async function onSetup(ev) {
  if (ev.seats.some((k) => !state.byKey[k])) await refreshSeats(); // a seat added since the page loaded
  // seat the default board plus anyone this council called in; past the table's limit, only this council
  const both = [...new Set([...state.board, ...ev.seats])];
  renderSeats(both.length <= MAX_TABLE ? both : ev.seats);
  state.options = ev.options;
  state.weights = ev.weights;
  state.active = ev.seats;
  $("#topic").hidden = false;
  $("#topicTitle").textContent = ev.title;
  typeIn($("#topicTitle"));
  $("#options").innerHTML = ev.options.map((o) => `
    <div class="opt" data-opt="${o.id}"><span class="id">${o.id}</span><span class="label">${esc(o.label)}</span><span class="val">-</span><span class="bar"><i></i></span></div>`).join("");
  for (const s of state.table.map((k) => state.byKey[k])) {
    const absent = !ev.seats.includes(s.key);
    $(`#seat-${s.key}`).classList.toggle("absent", absent);
    const pl = $(`#plate-${s.key}`);
    pl.classList.toggle("absent", absent);
    const w = ev.weights[s.key]?.weight || 1;
    pl.title = `Gewicht ${w} von 3: ${ev.weights[s.key]?.reason || ""}`;
  }
  chairSays(ev.title, { tag: ev.mode === "quick" ? "Schnelle Runde" : "Volle Runde" });
}

function updateOptions(scores) {
  const best = Object.entries(scores).sort((a, b) => (b[1].score ?? 0) - (a[1].score ?? 0))[0]?.[0];
  for (const [id, v] of Object.entries(scores)) {
    const el = $(`.opt[data-opt="${id}"]`); if (!el) continue;
    $(".val", el).textContent = de(v.score);
    $(".bar i", el).style.width = `${(v.score || 0) * 10}%`;
    el.classList.toggle("lead", id === best);
    el.title = String(v.math || "").replace(/(\d)\.(\d)/g, "$1,$2");
  }
}

function onRoundStart(round) {
  state.round = round;
  state.links = [];
  drawLinks();
  $("#cruxes").hidden = true;
  chairSays(`${["", "Runde 1: Eröffnung", "Runde 2: Schlagabtausch", "Runde 3: Abstimmung"][round]}`, { dots: true, tag: "Das Wort ist frei" });
}

// ------------------------------------------------------------- talking
const clean = (t) => String(t || "").replace(/\s*\((?:S\d+|source[^)]*)[^)]*\)/gi, "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim();

function firstSentences(t, max) {
  const parts = t.match(/[^.!?]+[.!?]+["”)]?\s*|[^.!?]+$/g) || [t];
  let out = "";
  for (const p of parts) { if (out && (out + p).length > max) break; out += p; }
  return shorten(out.trim(), max + 40);
}

/** The line a seat says out loud: the headline of its card, not the whole card. */
function lineFor(round, p, max = 170) {
  if (round === 1) return firstSentences(clean(p.call || p.stance), max);
  if (round === 2) {
    let t = clean(p.disagreeLine || p.stance);
    // "Graham. Sein Argument..." klingt wie direkt angesprochen: "Graham, sein Argument..."
    t = t.replace(/^([A-Za-z][\w.' ]{0,24})[.:,]\s+(\S+)/, (m, name, next) => !seatKey(name) ? m : `${state.byKey[seatKey(name)].short}, ${/^(I('|$)|Ich$|Du$|Sie$)/.test(next) ? next : next[0].toLowerCase() + next.slice(1)}`);
    return firstSentences(t, max);
  }
  return firstSentences(clean(p.oneLine || p.amendment), max);
}

function shapesFor(word) {
  const out = [];
  for (const ch of word.toLowerCase()) {
    const s = "aeiä".includes(ch) ? "open" : "ouwyöü".includes(ch) ? "mid" : "mbpf".includes(ch) ? "base" : null;
    if (s && s !== out[out.length - 1]) out.push(s);
  }
  return out.length ? out : ["mid"];
}

function setShape(key, shape) { const b = $(`#seat-${key} .bust`); if (b) b.dataset.shape = shape; }

function setSpeaker(key, target) {
  state.speaking = key;
  $$(".seat").forEach((el) => { el.classList.toggle("speaking", el.dataset.seat === key); el.classList.toggle("addressed", el.dataset.seat === target); });
  $$(".nameplate").forEach((el) => el.classList.toggle("speaking", el.dataset.seat === key));
  const el = key && $(`#seat-${key}`);
  if (el) {
    el.classList.remove("thinking");
    // lean toward whoever they're answering
    const g = state.geo[key], tg = target && state.geo[target];
    el.style.transform = tg ? `translateX(${Math.sign(tg.x - g.x) * g.size * 0.04}px) rotate(${Math.sign(tg.x - g.x) * 2.5}deg) scale(1.05)` : "scale(1.05)";
    moveSpot(key);
  } else $("#spot").classList.remove("on");
  $$(".seat").forEach((s) => { if (s.dataset.seat !== key) s.style.transform = ""; });
}

function captionFor(who) {
  $("#cruxes").hidden = true;
  $("#plate").hidden = true;
  const c = $("#caption");
  c.hidden = false;
  c.style.animation = "none"; void c.offsetWidth; c.style.animation = "";
  const s = state.byKey[who];
  $("#capAv").className = `cap-av${s ? "" : " chair"}`;
  $("#capAv").innerHTML = `<img src="${s ? portrait(who) : "/brand/symbol.png"}" alt="">`;
  $("#capWho").textContent = s ? s.name : "Der Vorsitz";
}

function chairSays(text, { dots = false, tag = "" } = {}) {
  setSpeaker(null);
  captionFor(null);
  $("#capTag").textContent = tag;
  const p = $("#capText");
  p.className = "cap-text chair";
  p.innerHTML = esc(text) + (dots ? '<span class="dots"><i></i><i></i><i></i></span>' : "");
  $("#capSub").textContent = "";
}

async function speak(key, text, { tag = "", target = null, sub = "" } = {}) {
  setSpeaker(key, target);
  captionFor(key);
  $("#capTag").textContent = tag;
  $("#capSub").textContent = "";
  const p = $("#capText");
  p.className = "cap-text";
  const words = text.split(" ").filter(Boolean);
  p.innerHTML = words.map((w) => `<span class="w">${esc(w)}</span> `).join("");
  const spans = $$(".w", p);
  for (let i = 0; i < words.length; i++) {
    if (player.fast) break;
    const w = words[i];
    spans[i].classList.add("on");
    const shapes = shapesFor(w.replace(/[^a-zäöüß]/gi, ""));
    const dur = Math.max(170, w.length * 52);
    const per = dur / (shapes.length + 1);
    for (const sh of shapes) { setShape(key, sh); await player.sleep(per); }
    setShape(key, "base");
    await player.sleep(per + (/[.!?]["”)]?$/.test(w) ? 340 : /[,;:]$/.test(w) ? 170 : 25));
  }
  spans.forEach((s) => s.classList.add("on"));
  setShape(key, "base");
  $("#capSub").innerHTML = sub;
  await player.sleep(1300);
}

// idle blinking for everyone, so the room feels alive between lines
const blinking = new Set();
function startBlinking() {
  const blink = (key) => {
    const b = $(`#seat-${key} .bust`);
    if (b && b.dataset.shape === "base") {
      b.dataset.shape = "blink";
      setTimeout(() => { if (b.dataset.shape === "blink") b.dataset.shape = "base"; }, 130);
    }
    setTimeout(() => blink(key), 2400 + Math.random() * 4200);
  };
  state.table.filter((k) => !blinking.has(k)).forEach((k, i) => { blinking.add(k); setTimeout(() => blink(k), 600 + i * 530); });
}

async function onSeatDone(ev) {
  const { round, seat, text, parsed, quotes } = ev;
  state.cards[round][seat] = { text, parsed, quotes };
  const s = state.byKey[seat];
  const top = topOption(parsed.optionScores);
  const line = lineFor(round, parsed);
  let tag = ROUND_NAME[round], sub = "", target = null;
  if (round === 1) {
    tag = `${stanceWord(parsed.stance)}${top ? ` · für ${top.id} (${top.v}/10)` : ""}`;
  } else if (round === 2) {
    const tgt = parsed.disagreeWith ? state.byKey[parsed.disagreeWith] : null;
    if (tgt) {
      target = tgt.key;
      tag = `Widerspricht ${tgt.short}`;
      state.links = state.links.filter((l) => l.from !== seat);
      state.links.push({ from: seat, to: tgt.key });
      drawLinks();
    }
    sub = /^(yes|ja)/i.test(parsed.moved) ? "Hat die Position geändert" : "";
  } else {
    const v = parsed.vote || "endorse";
    tag = `Stimmt: ${VOTE_WORD[v]}`;

  }
  feedCard(round, seat, parsed);
  await speak(seat, line || "Das steht in meiner Karte.", { tag, target, sub });

  const pl = $(`#plate-${seat}`);
  const chip = $(".chip", pl);
  chip.hidden = round === 3; // the vote stamp says it
  chip.className = "chip";
  if (round === 3) {
    const v = parsed.vote || "endorse";
    chip.textContent = VOTE_WORD[v];
    chip.classList.add(v);
    $(`#seat-${seat} .vote`)?.remove();
    const stamp = document.createElement("div");
    stamp.className = `vote ${v}`;
    stamp.textContent = VOTE_WORD[v].toUpperCase();
    $(`#seat-${seat}`).appendChild(stamp);
  } else chip.textContent = stanceWord(parsed.stance);
  if (top) { const sc = $(".score", pl); sc.hidden = false; sc.textContent = `${top.id} ${top.v}`; sc.title = `Höchster Wert: Option ${top.id}`; }
  setSpeaker(null);
  void s;
}

// Haltung auf Deutsch, egal ob die Karte deutsch oder (alte Sitzung) englisch ist
function stanceWord(t = "") {
  const m = t.match(/klares ja|ja, wenn|klares nein|strong yes|conditional yes|strong no|\bja\b|\bnein\b|\byes\b|\bno\b/i);
  if (!m) return "Hat gesprochen";
  const w = m[0].toLowerCase();
  return { "strong yes": "Klares Ja", "conditional yes": "Ja, wenn", "strong no": "Klares Nein", yes: "Ja", no: "Nein", "klares ja": "Klares Ja", "ja, wenn": "Ja, wenn", "klares nein": "Klares Nein", ja: "Ja", nein: "Nein" }[w];
}
const VOTE_WORD = { endorse: "Zustimmung", amend: "Änderung", dissent: "Widerspruch" };

function topOption(scores = {}) {
  const e = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return e ? { id: e[0], v: e[1] } : null;
}
const de = (n) => (typeof n === "number" ? String(n).replace(".", ",") : n ?? "-"); // Dezimalkomma
const shorten = (t, n) => (t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : t);
const face = (k) => `<img src="${portrait(k)}" alt="${esc(state.byKey[k]?.short || k)}" title="${esc(state.byKey[k]?.short || k)}">`;

async function onCruxes(ev) {
  setSpeaker(null);
  $("#caption").hidden = true;
  const c = $("#cruxes");
  c.hidden = false;
  c.innerHTML = `<div class="head">${ev.unanimous ? "Zu viel Einigkeit. Der Vorsitz hakt nach." : "Darum streiten sie"}</div>` +
    ev.cruxes.map((x, i) => `<div class="crux" style="animation-delay:${i * 0.18}s"><b>${esc(x.question)}</b><div class="sides">${x.sides.map((sd) => `<span class="side"><span class="faces">${sd.seats.filter((k) => state.byKey[k]).map(face).join("")}</span>${esc(shorten(sd.position, 48))}</span>`).join("")}</div></div>`).join("");
  const f = document.createElement("div");
  f.className = "feed-note";
  f.innerHTML = `<b>Der Streit:</b> ${ev.cruxes.map((x) => esc(x.question)).join(" ")}`;
  feedAppend(f);
  await player.sleep(3500 + 1800 * ev.cruxes.length);
}

async function onDraft(d) {
  chairSays(`Vorschlag: ${labelWord(d.label)} für Option ${d.option}. ${firstSentences(clean(d.recommendation), 140)}`, { tag: "Zur Abstimmung" });
  const f = document.createElement("div");
  f.className = "feed-note";
  f.innerHTML = `<b>Zur Abstimmung:</b> ${esc(labelWord(d.label))} für Option ${esc(d.option)}.`;
  feedAppend(f);
  await player.sleep(4200);
}

// ------------------------------------------------------------- rebuttal arcs
function drawLinks() {
  const svg = $("#links");
  const stage = $("#stage");
  const w = stage.clientWidth, h = stage.clientHeight;
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  const links = state.links || [];
  const col = "#F0A442";
  svg.innerHTML = `<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${col}"/></marker></defs>` +
    links.map(({ from, to }, i) => {
      const a = state.geo[from], b = state.geo[to];
      if (!a || !b) return "";
      const y1 = a.top - 6, y2 = b.top - 6;
      const mx = (a.x + b.x) / 2, my = Math.min(y1, y2) - Math.min(90, Math.abs(a.x - b.x) * 0.22) - 10;
      return `<path class="${i < links.length - 1 ? "old" : ""}" d="M${a.x},${y1} Q${mx},${my} ${b.x},${y2}" stroke="${col}" marker-end="url(#arrow)"/>`;
    }).join("");
}

// ------------------------------------------------------------- feed + cards
function feedAppend(node) {
  const feed = $("#feed");
  $(".empty", feed)?.remove();
  feed.appendChild(node);
  feed.scrollTop = feed.scrollHeight;
}
function feedPhase(label) {
  const d = document.createElement("div");
  d.className = "feed-phase";
  d.textContent = label;
  feedAppend(d);
}
function feedCard(round, seat, parsed) {
  const s = state.byKey[seat];
  const d = document.createElement("div");
  d.className = "feed-card";
  d.dataset.seat = seat;
  d.dataset.round = round;
  const top = topOption(parsed.optionScores);
  const tgt = parsed.disagreeWith ? state.byKey[parsed.disagreeWith]?.short : "";
  const what = round === 1 ? `${stanceWord(parsed.stance)}${top ? `, für ${top.id}` : ""}` : round === 2 ? (tgt ? `gegen ${tgt}` : "Schlagabtausch") : VOTE_WORD[parsed.vote || "endorse"];
  d.innerHTML = `<img class="av" src="${portrait(seat)}" alt=""><div><div class="h">${esc(s.short)}<span class="r">${esc(what)}</span></div><p>${esc(lineFor(round, parsed, 105))}</p></div>`;
  feedAppend(d);
}

function openCard(seat, round) {
  const s = state.byKey[seat];
  const rounds = [3, 2, 1].filter((r) => state.cards[r][seat]);
  const r = round || rounds[0];
  const c = state.cards[r]?.[seat];
  $("#cardBody").innerHTML = `
    <div class="card-head"><img src="${portrait(seat)}" alt=""><div><div class="label">${esc(s.pillar)}</div><h3>${esc(s.name)}</h3><p class="muted" style="margin:0">Leitfrage: ${esc(s.question)}</p></div></div>
    ${rounds.length > 1 ? `<p style="margin:0 0 6px">${rounds.slice().reverse().map((x) => `<button class="ghost" data-r="${x}" style="margin-right:6px">${ROUND_NAME[x]}</button>`).join("")}</p>` : ""}
    ${c ? `<pre>${esc(c.text)}</pre>${c.quotes.length ? `<ul class="qcheck">${c.quotes.map((q) => `<li class="${q.verified ? "" : "bad"}">"${esc(shorten(q.quote, 110))}" (${q.source}) ${q.verified ? "im Wissensspeicher bestätigt" : "nicht im Wissensspeicher gefunden"}</li>`).join("")}</ul>` : ""}` : `<p class="muted">Dieser Platz hat noch nicht gesprochen.</p>`}
    <p class="muted" style="font-size:12px">Simulierter Berater, gebaut aus den öffentlichen Werken von ${esc(s.name)}. Nicht die Person selbst.</p>`;
  $$("#cardBody [data-r]").forEach((b) => b.addEventListener("click", () => openCard(seat, Number(b.dataset.r))));
  const dlg = $("#cardDialog");
  if (!dlg.open) dlg.showModal();
}

// ------------------------------------------------------------- verdict
// the Chair should write display names; map any raw seat key just in case
const seatKey = (x) => { const k = String(x).toLowerCase().replace(/\s+/g, ""); return state.byKey[k] ? k : state.seats.find((s) => s.short.toLowerCase() === String(x).toLowerCase() || s.name.toLowerCase() === String(x).toLowerCase())?.key; };
const seatName = (x) => state.byKey[seatKey(x)]?.short || x;

// Urteil: deutsch (MACHEN, MACHEN MIT BEDINGUNGEN, UMBAUEN, ABWARTEN, LASS ES) oder englisch aus alten Sitzungen
function labelClass(l) { return /DON'T|LASS ES/i.test(l) ? "dont" : /RESHAPE|UMBAUEN/i.test(l) ? "reshape" : /WAIT|ABWARTEN/i.test(l) ? "wait" : "go"; }
function labelWord(l = "") {
  return { "GO": "MACHEN", "GO WITH CONDITIONS": "MACHEN MIT BEDINGUNGEN", "RESHAPE": "UMBAUEN", "WAIT": "ABWARTEN", "DON'T DO IT": "LASS ES" }[String(l).toUpperCase().trim()] || l;
}

function onVerdict(ev) {
  const v = ev.verdict;
  state.verdict = ev;
  setStep("verdict");
  setSpeaker(null);
  $("#caption").hidden = true;
  $("#cruxes").hidden = true;
  state.links = [];
  drawLinks();
  $("#stage").classList.remove("live");
  updateOptions(v.scores);
  const opt = (id) => state.options.find((o) => o.id === id)?.label || id;
  const seats = ev.seats;
  const mk = seatKey(v.minority.seat);
  const short = (t, n) => esc(shorten(clean(t || ""), n));
  const html = `
    <div class="v-top">
      <div><div class="label">Das Urteil der Runde</div><span class="v-label ${labelClass(v.label)}">${esc(labelWord(v.label))}</span></div>
      <div class="actions"><button class="pill" type="button" data-pdf>PDF herunterladen</button><button class="ghost" data-close>Zurück zum Tisch</button></div>
    </div>
    <p class="v-call">${esc(v.call)}</p>
    <div class="v-grid">
      <div class="v-sec"><h3>Bewertung</h3><div class="v-opts">${state.options.map((o) => `
        <div class="opt ${o.id === v.recommended ? "lead" : ""}"><span class="id">${o.id}</span><span class="label">${esc(o.label)}</span><span class="val">${de(v.scores[o.id]?.score)}</span><span class="bar"><i style="width:${(v.scores[o.id]?.score || 0) * 10}%"></i></span></div>`).join("")}</div>
        <p class="v-meta">Sicherheit ${v.confidence ?? "-"}/10${v.votes ? ` · ${v.votes.endorse || 0}× Zustimmung, ${v.votes.amend || 0}× Änderung, ${v.votes.dissent || 0}× Widerspruch` : ""}</p>
      </div>
      <div class="v-sec"><h3>Warum</h3><ul class="v-why">${v.why.slice(0, 3).map((w) => { const k = seatKey(w.seat); return `<li>${k ? `<img class="av" src="${portrait(k)}" alt="">` : ""}<span>${short(w.point, 150)}</span></li>`; }).join("")}</ul></div>
      <div class="v-sec"><h3>Pass auf</h3><div class="minority"><div class="who">${mk ? `<img class="av" src="${portrait(mk)}" alt="">` : ""}${esc(seatName(v.minority.seat))}</div><q>${short(v.minority.quote, 170)}</q></div></div>
      <div class="v-sec"><h3>Nächste Schritte</h3><ul class="v-steps">${v.next_steps.slice(0, 3).map((n) => `<li><b>${esc(n.when)}</b> ${short(n.action, 120)}</li>`).join("")}</ul>
        <p class="v-meta"><b>Abbrechen, wenn:</b> ${short(v.kill_criteria, 140)}</p></div>
    </div>
    <details class="v-more"><summary>Alle Einzelheiten</summary>
      <div class="v-grid">
        <div class="v-sec"><h3>Wo sie gestritten haben</h3><ul>${v.fights.map((f) => `<li><b>${esc(f.crux)}</b> ${esc(f.story)}</li>`).join("")}</ul></div>
        <div class="v-sec"><h3>Bedingungen</h3><ol>${v.conditions.map((c) => `<li>${esc(c)}</li>`).join("")}</ol></div>
        <div class="v-sec v-wide"><h3>Wertungstabelle</h3>
          <table class="scorecard"><thead><tr><th>Platz</th><th>Gewicht</th>${state.options.map((o) => `<th>${o.id}</th>`).join("")}<th>Kernsatz</th></tr></thead><tbody>
          ${seats.map((x) => { const s = state.byKey[x.key]; return `<tr><td><span class="who"><img class="av" src="${portrait(x.key)}" alt="">${esc(s.short)}</span></td><td class="n">${x.weight}</td>${state.options.map((o) => `<td class="n">${x.optionScores?.[o.id] ?? "-"}</td>`).join("")}<td class="line">${short(x.oneLine, 150)}</td></tr>`; }).join("")}
          </tbody></table>
          <p class="muted" style="font-size:11.5px;margin-top:8px">Gewichtet danach, wie sehr jede Säule hier zählt. ${state.options.map((o) => `${o.id}: ${esc(String(v.scores[o.id]?.math || "").replace(/(\d)\.(\d)/g, "$1,$2"))}`).join(" · ")}</p></div>
        <div class="v-sec"><h3>Günstigster Test</h3><p>${esc(v.cheapest_test)}</p><h3>Wieder vorlegen</h3><p>${esc(v.revisit)}</p></div>
        <div class="v-sec"><h3>Der stärkste Einwand im Wortlaut</h3><p>${esc(v.minority.quote)}</p><p class="muted">Damit dieser Einwand recht behält, müsste gelten: ${esc(v.minority.would_have_to_be_true)}</p></div>
        ${v.amendments?.length ? `<div class="v-sec v-wide"><h3>Änderungsanträge</h3><ul>${v.amendments.map((a) => `<li><b>${esc(seatName(a.seat))}:</b> ${esc(a.amendment)} <span class="tag">${a.adopted ? "Angenommen" : "Abgelehnt"}: ${esc(a.reason)}</span></li>`).join("")}</ul></div>` : ""}
      </div>
    </details>
    <div class="v-foot"><span class="muted">${esc(v.disclaimer)}</span><button class="ghost" data-close>Zurück zum Tisch</button></div>`;
  $("#verdictBody").innerHTML = html;
  const plate = $("#plate");
  plate.hidden = false;
  plate.innerHTML = `<div class="label">Das Urteil der Runde</div><span class="v-label ${labelClass(v.label)}">${esc(labelWord(v.label))}</span><p>${esc(firstSentences(clean(v.call), 150))}</p><div class="row"><button type="button" id="plateOpen">Urteil lesen</button><button type="button" data-pdf>PDF herunterladen</button><button type="button" class="alt" id="plateReplay">Runde nochmal abspielen</button></div>`;
  $("#plateOpen").addEventListener("click", () => ($("#verdictSheet").hidden = false));
  $("#plateReplay").addEventListener("click", () => replay(state.session));
  $("#playbar").hidden = true;
  const f = document.createElement("div");
  f.className = "feed-note";
  f.innerHTML = `<b>Urteil: ${esc(labelWord(v.label))}.</b> ${esc(firstSentences(clean(v.call), 160))}`;
  feedAppend(f);
  setTimeout(() => { if (state.verdict === ev) $("#verdictSheet").hidden = false; }, 1600);
}

// ------------------------------------------------------------- history + replay
async function openHistory() {
  const { sessions } = await fetch("/api/sessions").then((x) => x.json());
  $("#historyList").innerHTML = sessions.length
    ? sessions.map((s) => `<li><button data-id="${esc(s.id)}"><b>${esc(s.title)}</b><small>${esc(s.id.slice(0, 10).split("-").reverse().join("."))} · ${s.mode === "quick" ? "schnell" : "voll"} · ${({ done: "fertig", running: "läuft", stopped: "abgebrochen" })[s.status] || esc(s.status)}</small></button>${s.status === "done" ? `<button class="pdf" type="button" data-pdf="${esc(s.id)}" title="Urteil als PDF herunterladen">PDF</button>` : ""}</li>`).join("")
    : '<li class="muted">Noch keine Runden. Sobald du eine Runde einberufen hast, steht sie hier.</li>';
  $$("#historyList button[data-id]").forEach((b) => b.addEventListener("click", () => { $("#historyDialog").close(); replay(b.dataset.id); }));
  $("#historyDialog").showModal();
}

async function replay(id) {
  const j = await fetch(`/api/sessions/${encodeURIComponent(id)}`).then((x) => x.json());
  begin(id);
  state.replaying = true;
  for (const ev of j.events) {
    if (["delta", "usage", "seat_error", "end"].includes(ev.type)) continue;
    player.push(ev);
  }
}

// ------------------------------------------------------------- waiting on Claude Code
// A live council goes quiet for minutes while the seats write in parallel. Instead of a
// frozen table, say what is happening, how long it has been, and what each seat is weighing.
const SAME_TIME = "Die Berater schreiben in Claude Code alle gleichzeitig. Ihre Beiträge erscheinen hier, sobald die Runde fertig ist.";
function waitCopy(phase) {
  const n = state.setup?.mode === "quick" ? 2 : 3;
  return {
    setup: ["Der Tisch wird gedeckt", "Der Vorsitz setzt die Runde zusammen.", ""],
    round1: ["Runde 1 von " + n, "Die Berater schreiben ihre Eröffnung.", SAME_TIME],
    round2: ["Runde 2 von " + n, "Die Berater lesen die Eröffnungen der anderen und halten dagegen.", SAME_TIME],
    round3: ["Runde 3 von " + n, "Die Berater stimmen über den Vorschlag des Vorsitzes ab.", SAME_TIME],
    cruxes: ["Zwischen den Runden", "Der Vorsitz liest die Eröffnungen und sucht, wo sie sich uneinig sind.", "Als Nächstes erscheinen hier die Streitpunkte, dann beginnt der Schlagabtausch."],
    draft: ["Zwischen den Runden", "Der Vorsitz macht aus dem Schlagabtausch einen Vorschlag zur Abstimmung.", "Danach stimmt jeder Berater darüber ab."],
    skip3: ["Letzter Schritt", "Der Vorsitz wertet die Runde aus und schreibt das Urteil.", "Steht es, kannst du es als PDF herunterladen."],
    verdict: ["Letzter Schritt", "Der Vorsitz wertet die Runde aus und schreibt das Urteil.", "Steht es, kannst du es als PDF herunterladen."],
  }[phase] || ["Läuft", "Die Runde arbeitet.", ""];
}
const clock = (ms) => { const s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };

function hideWait() {
  const w = $("#waitcard");
  if (w.hidden) return;
  w.hidden = true;
  $$(".seat.musing").forEach((e) => e.classList.remove("musing"));
  if (state.capWasShown) $("#caption").hidden = false;
  if (state.playbarWasShown) $("#playbar").hidden = false;
}

function tickWait() {
  const w = state.wait;
  const idle = !player.busy && !player.q.length;
  if (!w || !idle || state.replaying || !state.session || state.verdict) return hideWait();
  const card = $("#waitcard");
  if (card.hidden) {
    state.capWasShown = !$("#caption").hidden;
    $("#caption").hidden = true;
    $("#cruxes").hidden = true;
    // speed controls do nothing while the room waits, and they would cover the card
    state.playbarWasShown = !$("#playbar").hidden;
    $("#playbar").hidden = true;
    card.hidden = false;
    state.museAt = 0;
  }
  const [step, head, sub] = waitCopy(w.phase);
  const elapsed = Date.now() - w.at;
  $("#wcStep").textContent = step;
  $("#wcTime").textContent = clock(elapsed);
  $("#wcHead").textContent = head;
  $("#wcSub").textContent = sub;
  $("#wcNudge").hidden = elapsed < 4 * 60 * 1000;
  const round = Number((w.phase.match(/^round(\d)$/) || [])[1]) || 0;
  const bar = $("#wcBar").parentElement;
  const muse = $("#wcMuse");
  if (round) {
    const seats = state.active.length ? state.active : state.table;
    const done = seats.filter((k) => state.cards[round][k]).length;
    bar.classList.toggle("indeterminate", done === 0);
    $("#wcBar").style.width = done ? Math.round((done / seats.length) * 100) + "%" : "";
    // every few seconds, show what one of the still-thinking seats is weighing
    const pending = seats.filter((k) => !state.cards[round][k]);
    if (pending.length && Date.now() - (state.museAt || 0) > 5200) {
      state.museAt = Date.now();
      state.museIdx = ((state.museIdx ?? -1) + 1) % pending.length;
      const s = state.byKey[pending[state.museIdx]];
      muse.classList.add("fade");
      setTimeout(() => {
        muse.innerHTML = "<b>" + esc(s.short) + "</b> wägt ab: " + esc(s.question) + (done ? " · " + done + " von " + seats.length + " fertig" : "");
        muse.classList.remove("fade");
        $$(".seat").forEach((el) => el.classList.toggle("musing", el.dataset.seat === s.key));
      }, 300);
    }
  } else {
    bar.classList.add("indeterminate");
    $("#wcBar").style.width = "";
    muse.textContent = "";
    $$(".seat.musing").forEach((e) => e.classList.remove("musing"));
  }
}

function openGuide() {
  $("#guideBody").innerHTML = GUIDE;
  const d = $("#guideDialog");
  if (!d.open) d.showModal();
}

// ------------------------------------------------------------- PDF
async function savePdf(btn) {
  const id = btn.dataset.pdf;
  btn.disabled = true;
  const old = btn.textContent;
  btn.textContent = "PDF wird erstellt …";
  try {
    let setup = state.setup, verdict = state.verdict;
    if (id) { // a past session from the history list
      const j = await fetch("/api/sessions/" + encodeURIComponent(id)).then((x) => x.json());
      setup = j.events.find((e) => e.type === "setup");
      verdict = [...j.events].reverse().find((e) => e.type === "verdict");
    }
    if (!setup || !verdict) throw new Error("Diese Runde hat noch kein Urteil.");
    await downloadVerdictPdf({ setup, verdict, byKey: state.byKey, id: id || state.session });
  } catch (e) {
    console.error(e);
    toast("Das PDF ließ sich nicht erstellen: " + (e.message || e));
  } finally {
    btn.disabled = false;
    btn.textContent = old;
  }
}

// ------------------------------------------------------------- misc
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 6000);
}
async function refreshUsage() {
  const u = await fetch("/api/usage").then((x) => x.json()).catch(() => null);
  if (!u || !u.calls) { $("#usage").textContent = ""; return; }
  const k = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : `${Math.round(n / 1000)}k`);
  $("#usage").textContent = `${u.calls} Aufrufe · ${k(u.input + u.cacheRead + u.cacheWrite)} rein · ${k(u.output)} raus`;
}

boot();
