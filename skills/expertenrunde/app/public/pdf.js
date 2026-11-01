// Das Urteil als PDF mit ein bis zwei Seiten, im Browser gebaut mit dem mitgelieferten
// jsPDF, damit nichts installiert werden muss. Weißes A4-Blatt, Montserrat, Schrift in
// dunklem Weinrot, Gold und Weinrot als Akzent (Look von Rundum Kreativ mit KI).

const C = {
  ink: [42, 10, 18], soft: [86, 52, 58], mute: [140, 112, 104], rule: [236, 224, 214],
  tint: [250, 244, 236], track: [240, 228, 216], accent: [138, 36, 52], gold: [240, 164, 66], white: [255, 255, 255],
};
const LABEL = { go: [108, 192, 139], amber: [240, 164, 66], red: [224, 71, 90] };
const labelColor = (l) => (/DON'T|LASS ES/i.test(l) ? LABEL.red : /RESHAPE|WAIT|UMBAUEN|ABWARTEN/i.test(l) ? LABEL.amber : LABEL.go);
const LABEL_DE = { "GO": "MACHEN", "GO WITH CONDITIONS": "MACHEN MIT BEDINGUNGEN", "RESHAPE": "UMBAUEN", "WAIT": "ABWARTEN", "DON'T DO IT": "LASS ES" };
const VOTE_DE = { endorse: "Zustimmung", amend: "Änderung", dissent: "Widerspruch" };

let libReady = null;
function loadLib() {
  if (window.jspdf) return Promise.resolve();
  libReady ??= new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "/vendor/jspdf.umd.min.js";
    s.onload = res;
    s.onerror = () => rej(new Error("die PDF-Bibliothek ließ sich nicht laden"));
    document.head.appendChild(s);
  });
  return libReady;
}

const fileCache = {};
async function fetchBase64(url) {
  if (fileCache[url]) return fileCache[url];
  const buf = new Uint8Array(await (await fetch(url)).arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return (fileCache[url] = btoa(bin));
}

async function addFonts(doc) {
  for (const [file, style] of [["Montserrat-Regular.ttf", "normal"], ["Montserrat-SemiBold.ttf", "semibold"], ["Montserrat-Bold.ttf", "bold"]]) {
    doc.addFileToVFS(file, await fetchBase64(`/brand/fonts/${file}`));
    doc.addFont(file, "Montserrat", style);
  }
}

const clean = (t) => String(t ?? "").replace(/\s*\((?:S\d+|source[^)]*)[^)]*\)/gi, "").replace(/\*\*/g, "").replace(/[—–]/g, ", ").replace(/\s+/g, " ").trim();
const dateLine = (id) => {
  const m = String(id || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date();
  return d.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
};

export async function downloadVerdictPdf({ setup, verdict: ev, byKey, id }) {
  await loadLib();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  await addFonts(doc);
  const logo = "data:image/png;base64," + (await fetchBase64("/brand/symbol.png"));

  const v = ev.verdict;
  const seats = ev.seats || [];
  const options = setup.options || [];
  const seatKey = (x) => {
    const t = String(x || "").toLowerCase().trim();
    return Object.values(byKey).find((s) => s.key === t.replace(/\s+/g, "") || s.short.toLowerCase() === t || s.name.toLowerCase() === t || t.includes(s.name.split(" ").pop().toLowerCase()))?.key;
  };
  const who = (x) => byKey[seatKey(x)]?.name || x || "";

  const W = 595.28, H = 841.89, M = 54, CW = W - M * 2;
  let y = M;

  const font = (size, style = "normal", color = C.ink) => { doc.setFont("Montserrat", style); doc.setFontSize(size); doc.setTextColor(...color); };
  const lines = (text, width, size, style = "normal") => { font(size, style); return doc.splitTextToSize(clean(text), width); };
  const lh = (size) => size * 1.42;
  const ensure = (h) => { if (y + h > H - 64) { doc.addPage(); y = M; } };
  const para = (text, { size = 10.5, style = "normal", color = C.soft, x = M, width = CW, gap = 6 } = {}) => {
    const ls = lines(text, width, size, style);
    ensure(ls.length * lh(size));
    font(size, style, color);
    doc.text(ls, x, y + size, { lineHeightFactor: 1.42 });
    y += ls.length * lh(size) + gap;
  };
  const kicker = (text) => { font(8, "semibold", C.mute); doc.setCharSpace(1.2); doc.text(text.toUpperCase(), M, y + 8); doc.setCharSpace(0); y += 16; };
  // `keep` is how much of what follows must sit on the same page as the heading
  const section = (title, keep = 70) => {
    ensure(48 + keep);
    y += 10;
    doc.setDrawColor(...C.rule); doc.setLineWidth(0.75); doc.line(M, y, W - M, y);
    y += 16;
    font(12.5, "bold", C.ink); doc.text(title, M, y + 10);
    y += 22;
  };
  const bullet = (label, text) => {
    const pre = label ? (/[?!.:]$/.test(label.trim()) ? `${label.trim()} ` : `${label}: `) : "";
    font(10.5, "semibold");
    // a long label (a whole question) gets its own bold line instead of squeezing the text
    if (pre && doc.getTextWidth(pre) > CW * 0.4) {
      const head = lines(label, CW - 14, 10.5, "semibold");
      const body = lines(text, CW - 14, 10.5);
      ensure((head.length + body.length) * lh(10.5) + 4);
      doc.setFillColor(...C.gold); doc.circle(M + 3, y + 6.6, 2.2, "F");
      font(10.5, "semibold", C.ink); doc.text(head, M + 14, y + 10.5, { lineHeightFactor: 1.42 });
      y += head.length * lh(10.5);
      font(10.5, "normal", C.soft); doc.text(body, M + 14, y + 10.5, { lineHeightFactor: 1.42 });
      y += body.length * lh(10.5) + 5;
      return;
    }
    const preW = pre ? doc.getTextWidth(pre) : 0;
    const body = lines(text, CW - 14 - preW, 10.5);
    // first line sits after the bold label; the rest wraps under the full width
    const rest = body.length > 1 ? lines(body.slice(1).join(" "), CW - 14, 10.5) : [];
    ensure((1 + rest.length) * lh(10.5) + 4);
    doc.setFillColor(...C.gold); doc.circle(M + 3, y + 6.6, 2.2, "F");
    if (pre) { font(10.5, "semibold", C.ink); doc.text(pre, M + 14, y + 10.5); }
    font(10.5, "normal", C.soft);
    doc.text(body[0] || "", M + 14 + preW, y + 10.5);
    if (rest.length) doc.text(rest, M + 14, y + 10.5 + lh(10.5), { lineHeightFactor: 1.42 });
    y += (1 + rest.length) * lh(10.5) + 5;
  };

  // ---------------------------------------------------------------- header
  doc.addImage(logo, "PNG", M, y - 2, 30, 30, "symbol", "SLOW");
  font(15, "bold", C.ink); doc.text("Expertenrunde", M + 40, y + 19);
  font(15, "bold", C.ink); doc.text("Urteil", W - M, y + 12, { align: "right" });
  font(8.5, "normal", C.mute); doc.text(dateLine(id), W - M, y + 25, { align: "right" });
  y += 40;
  doc.setDrawColor(...C.accent); doc.setLineWidth(1.2); doc.line(M, y, W - M, y);
  y += 26;

  // ---------------------------------------------------------------- the decision
  kicker("Die Entscheidung");
  const title = lines(setup.title || "Entscheidung ohne Titel", CW, 22, "bold");
  font(22, "bold", C.ink); doc.text(title, M, y + 20, { lineHeightFactor: 1.18 });
  y += title.length * 22 * 1.18 + 8;
  const n = seats.length || (setup.seats || []).length;
  const rounds = v.votes ? 3 : 2;
  para(`${setup.mode === "quick" ? "Schnelle Runde" : "Volle Runde"} · ${n} Berater · ${rounds} Runden`, { size: 9.5, color: C.mute, gap: 4 });
  if (setup.decision) para(setup.decision, { size: 10.5, color: C.soft, gap: 8 });

  // ---------------------------------------------------------------- the verdict box
  const label = (LABEL_DE[String(v.label || "").toUpperCase().trim()] || String(v.label || "")).toUpperCase();
  font(13, "bold");
  const badgeW = doc.getTextWidth(label) + 24;
  const callLines = lines(v.call, CW - 32, 12.5, "semibold");
  const meta = [`Sicherheit ${v.confidence ?? "-"}/10`, v.votes ? `${v.votes.endorse || 0}× Zustimmung, ${v.votes.amend || 0}× Änderung, ${v.votes.dissent || 0}× Widerspruch` : ""].filter(Boolean).join(" · ");
  const boxH = 16 + 28 + 12 + callLines.length * lh(12.5) + 8 + 14 + 14;
  ensure(boxH + 10);
  y += 6;
  doc.setFillColor(...C.tint); doc.roundedRect(M, y, CW, boxH, 10, 10, "F");
  doc.setFillColor(...labelColor(label)); doc.roundedRect(M + 16, y + 16, badgeW, 28, 7, 7, "F");
  font(13, "bold", /DON'T|LASS ES/i.test(label) ? C.white : C.ink); doc.text(label, M + 16 + 12, y + 16 + 19);
  font(8, "semibold", C.mute); doc.setCharSpace(1.2); doc.text("DIE EMPFEHLUNG DER RUNDE", M + 16 + badgeW + 12, y + 16 + 17.5); doc.setCharSpace(0);
  let by = y + 16 + 28 + 12;
  font(12.5, "semibold", C.ink); doc.text(callLines, M + 16, by + 12.5, { lineHeightFactor: 1.42 });
  by += callLines.length * lh(12.5) + 8;
  font(9.5, "normal", C.mute); doc.text(meta, M + 16, by + 9.5);
  y += boxH + 8;

  // ---------------------------------------------------------------- scores
  section("Bewertung");
  const best = v.recommended;
  for (const o of options) {
    const sc = v.scores?.[o.id]?.score;
    const isBest = o.id === best;
    const lab = lines(o.label, CW - 200, 10.5, isBest ? "semibold" : "normal");
    const rowH = Math.max(24, lab.length * lh(10.5) + 6);
    ensure(rowH + 6);
    doc.setFillColor(...(isBest ? C.ink : C.track)); doc.roundedRect(M, y, 20, 20, 5, 5, "F");
    font(10, "bold", isBest ? C.white : C.soft); doc.text(o.id, M + 10, y + 13.8, { align: "center" });
    font(10.5, isBest ? "semibold" : "normal", C.ink); doc.text(lab, M + 30, y + 13.5, { lineHeightFactor: 1.42 });
    const bx = W - M - 170, bw = 120;
    doc.setFillColor(...C.track); doc.roundedRect(bx, y + 8, bw, 5, 2.5, 2.5, "F");
    if (typeof sc === "number") { doc.setFillColor(...(isBest ? C.accent : [214, 170, 150])); doc.roundedRect(bx, y + 8, Math.max(5, bw * sc / 10), 5, 2.5, 2.5, "F"); }
    font(14, "bold", C.ink); doc.text(typeof sc === "number" ? String(sc).replace(".", ",") : "-", W - M, y + 15, { align: "right" });
    if (isBest) { font(7.5, "semibold", C.accent); doc.text("EMPFOHLEN", bx, y + 24); }
    y += rowH + 6;
  }
  para("Jeder Berater bewertet jede Option von 1 bis 10, gewichtet danach, wie sehr sein Fachgebiet bei dieser Entscheidung zählt.", { size: 8.5, color: C.mute, gap: 0 });

  // Kept short on purpose: the call, the scores, the reasons, the strongest objection, and
  // the plan. The full report (conditions, amendments, every card) stays in verdict.md.
  if (v.why?.length) { section("Warum die Runde so entschieden hat"); for (const w of v.why.slice(0, 3)) bullet(who(w.seat), w.point); }

  // ---------------------------------------------------------------- how each advisor scored it
  if (seats.length) {
    section("So hat jeder Berater bewertet", 18 + seats.length * 22); // the table stays on one page
    const showVote = Boolean(v.votes);
    const cols = [{ t: "Berater", w: 150 }, { t: "Gewicht", w: 56, c: true }, ...options.map((o) => ({ t: o.id, w: 40, c: true })), ...(showVote ? [{ t: "Stimme", w: 80 }] : [])];
    const head = () => {
      let x = M; font(8, "semibold", C.mute);
      for (const c of cols) { doc.text(c.t.toUpperCase(), c.c ? x + c.w / 2 : x, y + 8, c.c ? { align: "center" } : undefined); x += c.w; }
      y += 14; doc.setDrawColor(...C.rule); doc.setLineWidth(0.75); doc.line(M, y, W - M, y); y += 4;
    };
    ensure(40); head();
    for (const s of seats) {
      if (y + 22 > H - 64) { doc.addPage(); y = M; head(); }
      const info = byKey[s.key] || {};
      let x = M;
      font(10, "semibold", C.ink); doc.text(info.name || s.key, x, y + 13); x += cols[0].w;
      font(10, "normal", C.soft); doc.text(String(s.weight ?? "-"), x + cols[1].w / 2, y + 13, { align: "center" }); x += cols[1].w;
      for (const o of options) { font(10, "semibold", C.ink); doc.text(String(s.optionScores?.[o.id] ?? "-"), x + 20, y + 13, { align: "center" }); x += 40; }
      if (showVote) { font(9.5, "normal", C.soft); doc.text(VOTE_DE[String(s.stance || "endorse").toLowerCase()] || String(s.stance || ""), x, y + 13); }
      y += 20; doc.setDrawColor(...C.rule); doc.line(M, y, W - M, y); y += 2;
    }
  }

  // ---------------------------------------------------------------- watch out, what to do
  if (v.minority?.quote) {
    section("Pass auf");
    para(`${who(v.minority.seat)}: „${clean(v.minority.quote)}“`, { size: 10.5, style: "semibold", color: C.ink, gap: 4 });
    if (v.minority.would_have_to_be_true) para(`Damit dieser Einwand recht behält, müsste gelten: ${v.minority.would_have_to_be_true}`, { size: 9.5, color: C.mute });
  }
  if (v.next_steps?.length || v.cheapest_test || v.kill_criteria) {
    section("Was jetzt zu tun ist");
    for (const s of (v.next_steps || []).slice(0, 3)) bullet(s.when, s.action);
    if (v.cheapest_test) bullet("Günstigster Test", v.cheapest_test);
    if (v.kill_criteria) bullet("Abbrechen, wenn", v.kill_criteria);
  }
  if (v.fights?.length) { section("Wo sie gestritten haben"); for (const f of v.fights.slice(0, 3)) bullet(f.crux, f.story); }

  // ---------------------------------------------------------------- footer on every page
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...C.rule); doc.setLineWidth(0.75); doc.line(M, H - 46, W - M, H - 46);
    font(7.5, "semibold", C.mute);
    const tag = `Expertenrunde · Seite ${p} von ${pages}`;
    const tagW = doc.getTextWidth(tag);
    doc.text(tag, W - M, H - 34, { align: "right" });
    font(7.5, "normal", C.mute);
    doc.text(doc.splitTextToSize(v.disclaimer || "Simulierte Berater, gebaut aus den öffentlichen Werken der jeweiligen Person. Sie sind nicht diese Menschen und sprechen nicht für sie. KI-generierter Inhalt.", CW - tagW - 24), M, H - 34, { lineHeightFactor: 1.35 });
  }

  const name = `Expertenrunde - ${String(setup.title || id || "Urteil").replace(/[\\/:*?"<>|]+/g, "").slice(0, 80)}.pdf`;
  doc.save(name);
  return name;
}
