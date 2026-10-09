import { firebaseConfig } from "./config.js";
import { MEMBERS, BASE_OPTIONS, QUESTIONS } from "./data.js";

const FB = "https://www.gstatic.com/firebasejs/10.12.2/";
const CHOICES = [["ja", "Ja"], ["misschien", "Misschien"], ["nee", "Nee"]];
const POINTS = { ja: 2, misschien: 1, nee: -2 };

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const slug = (n) => String(n).trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "anoniem";
const euro = (n) => "€" + Number(n).toLocaleString("nl-NL");

const S = { extra: [], votes: [], answers: [], claims: [], loaded: false, claimsLoaded: false, error: null, uid: null, authError: null };
const busy = new Set();
let fs = null; // Firestore-functies + db, gevuld zodra Firebase klaar is

const allOptions = () => [...BASE_OPTIONS, ...S.extra];

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), 2600);
}

/* ---------- naam: vast per apparaat, met pincode ----------
   claims/<slug>  {name, uid}  openbaar: wie welke naam heeft
   secrets/<slug> {pin}        onleesbaar, alleen de regels kijken erin
   logins/<uid>   {slug, pin}  inlogpoging op een nieuw apparaat
*/
let me = null;      // naam van dit apparaat, afgeleid uit claims
let mySlug = null;
let gateState = { mode: "pick", name: "", err: "" };

function deriveMe() {
  const mine = S.uid ? S.claims.filter((c) => c.uid === S.uid) : [];
  let pick = mine[0] || null;
  try { const pref = localStorage.getItem("kos-naam"); const hit = mine.find((c) => c.name === pref); if (hit) pick = hit; } catch (e) {}
  me = pick ? pick.name : null;
  mySlug = pick ? pick.id : null;
  if (me) { try { localStorage.setItem("kos-naam", me); } catch (e) {} }
}

function renderWho() {
  $("#who-text").innerHTML = me
    ? `Je stemt als <strong>${esc(me)}</strong> <span class="lock">· vastgezet op dit apparaat</span>`
    : S.claimsLoaded ? `Je hebt nog geen naam gekozen. <button class="linkbtn" type="button" id="who-pick">Naam kiezen</button>` : "Even laden…";
  $("#who-pick")?.addEventListener("click", () => openGate());
}

function openGate(mode = "pick", name = "", err = "") {
  gateState = { mode, name, err };
  renderGate();
  $("#gate").hidden = false;
  setTimeout(() => $("#gate-card input")?.focus(), 30);
}
function closeGate() { $("#gate").hidden = true; }

function renderGate() {
  const card = $("#gate-card");
  const { mode, name, err } = gateState;
  if (!fs || !S.claimsLoaded) {
    card.innerHTML = `<h2 id="gate-title">Wie ben jij?</h2><p class="muted">${S.authError ? "Inloggen bij de stemdatabase lukte niet. Ververs de pagina en probeer het opnieuw." : "Even laden…"}</p>
      <div class="gate-actions"><button class="btn ghost small" type="button" data-close>Eerst rondkijken</button></div>`;
    return;
  }
  if (mode === "pick") {
    const taken = new Set(S.claims.map((c) => c.id));
    const names = [...new Map([...MEMBERS, ...S.claims.map((c) => c.name)].map((n) => [slug(n), n])).values()];
    card.innerHTML = `<h2 id="gate-title">Wie ben jij?</h2>
      <p class="muted">Kies je naam en bedenk een pincode van 4 cijfers. Je naam blijft daarna vastgezet op dit apparaat, zodat niemand anders onder jouw naam kan stemmen.</p>
      <div class="name-chips">${names.map((n) => `<button type="button" data-name="${esc(n)}" class="${taken.has(slug(n)) ? "taken" : ""}">${esc(n)}</button>`).join("")}</div>
      <form data-other class="gate-actions"><input type="text" id="gate-input" maxlength="24" placeholder="Andere naam" aria-label="Andere naam" style="flex:1;min-width:0"><button class="btn" type="submit">Verder</button></form>
      <div class="gate-actions"><button class="linkbtn" type="button" data-close>Eerst rondkijken</button></div>`;
    return;
  }
  const isNew = mode === "new";
  card.innerHTML = `<h2 id="gate-title">${isNew ? `Hoi ${esc(name)}!` : `Ben jij ${esc(name)}?`}</h2>
    <p class="muted">${isNew
      ? "Kies een pincode van 4 cijfers en onthoud hem goed. Met deze code kun je later ook op een ander apparaat (of in een andere browser) als jezelf stemmen."
      : "Deze naam is al vastgezet. Vul je pincode in om ook op dit apparaat als " + esc(name) + " te stemmen."}</p>
    <form data-pin class="gate-actions">
      <input class="pin" type="text" id="gate-pin" inputmode="numeric" autocomplete="off" maxlength="4" pattern="[0-9]{4}" placeholder="••••" aria-label="Pincode van 4 cijfers">
      <button class="btn" type="submit" ${busy.has("gate") ? "disabled" : ""}>${isNew ? "Naam vastzetten" : "Inloggen"}</button>
    </form>
    <p class="gate-err" role="alert">${esc(err)}</p>
    <div class="gate-actions"><button class="linkbtn" type="button" data-back>Andere naam kiezen</button></div>`;
}

function chooseName(raw) {
  const n = String(raw || "").trim().replace(/\s+/g, " ").slice(0, 24);
  if (!n) return;
  if (slug(n) === "anoniem") { openGate("pick", "", ""); return; }
  const claim = S.claims.find((c) => c.id === slug(n));
  if (claim) openGate("login", claim.name);
  else openGate("new", n);
}

async function submitPin(pin) {
  const { mode, name } = gateState;
  if (!/^[0-9]{4}$/.test(pin)) { gateState.err = "Vul precies 4 cijfers in."; renderGate(); return; }
  if (busy.has("gate")) return;
  busy.add("gate"); gateState.err = ""; renderGate();
  const s = slug(name);
  try {
    if (mode === "new") {
      const b = fs.writeBatch(fs.db);
      b.set(fs.doc(fs.db, "claims", s), { name, uid: S.uid, at: Date.now() });
      b.set(fs.doc(fs.db, "secrets", s), { pin });
      await b.commit();
      toast(`Welkom ${name}! Je naam staat vast.`);
    } else {
      await fs.setDoc(fs.doc(fs.db, "logins", S.uid), { slug: s, pin });
      await fs.setDoc(fs.doc(fs.db, "claims", s), { name, uid: S.uid, at: Date.now() });
      toast(`Ingelogd als ${name}`);
    }
    try { localStorage.setItem("kos-naam", name); } catch (e) {}
    S.claims = [...S.claims.filter((c) => c.id !== s), { id: s, name, uid: S.uid }];
    deriveMe(); closeGate(); renderAll();
  } catch (e) {
    console.error(e);
    gateState.err = mode === "new"
      ? "Die naam werd net door iemand anders gekozen. Kies een andere naam."
      : "Die pincode klopt niet. Probeer het opnieuw.";
    if (mode === "new") gateState.mode = "pick";
    renderGate();
  } finally { busy.delete("gate"); }
}

$("#gate-card").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-name]"); if (b) { chooseName(b.dataset.name); return; }
  if (e.target.closest("[data-close]")) { closeGate(); return; }
  if (e.target.closest("[data-back]")) { openGate("pick"); return; }
});
$("#gate-card").addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.matches("[data-other]")) chooseName($("#gate-input").value);
  if (e.target.matches("[data-pin]")) submitPin($("#gate-pin").value.trim());
});
$("#gate-card").addEventListener("input", (e) => { if (e.target.id === "gate-pin") e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4); });
$("#gate").addEventListener("click", (e) => { if (e.target.id === "gate") closeGate(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeGate(); });

/* ---------- data ---------- */
const myVote = (optId) => (mySlug ? S.votes.find((v) => v.option === optId && (v.slug || slug(v.name)) === mySlug) || null : null);
const myAnswer = (qid) => (mySlug ? S.answers.find((a) => a.question === qid && (a.slug || slug(a.name)) === mySlug) || null : null);
function tally(optId) {
  const vs = S.votes.filter((v) => v.option === optId);
  const c = { ja: 0, misschien: 0, nee: 0 }; vs.forEach((v) => { if (c[v.choice] != null) c[v.choice]++; });
  return { c, vs, score: c.ja * POINTS.ja + c.misschien * POINTS.misschien + c.nee * POINTS.nee };
}
function ranked() {
  return allOptions().map((o) => ({ o, ...tally(o.id) })).sort((a, b) => {
    const ao = a.o.status === "afgevallen", bo = b.o.status === "afgevallen";
    if (ao !== bo) return ao ? 1 : -1;
    return b.score - a.score || a.c.nee - b.c.nee || (a.o.order || 0) - (b.o.order || 0);
  });
}

/* ---------- schrijven ---------- */
async function guarded(key, fn) {
  if (!fs) { toast("De stemmen zijn nog niet verbonden. Probeer het zo opnieuw."); return; }
  if (busy.has(key)) return; busy.add(key); renderAll();
  try { await fn(); }
  catch (e) { console.error(e); toast("Opslaan lukte niet. Ververs de pagina en probeer het opnieuw."); }
  finally { busy.delete(key); renderAll(); }
}
function vote(optId, choice) {
  if (!me) { openGate(); return; }
  const cur = myVote(optId);
  guarded("v:" + optId, async () => {
    const ref = fs.doc(fs.db, "votes", optId + "__" + mySlug);
    if (cur && cur.choice === choice) await fs.deleteDoc(ref);
    else await fs.setDoc(ref, { option: optId, name: me, slug: mySlug, choice, note: cur?.note || "", at: Date.now() });
  });
}
function saveNote(optId, note) {
  const cur = myVote(optId); if (!cur) return;
  note = note.trim().slice(0, 280);
  guarded("v:" + optId, async () => {
    await fs.setDoc(fs.doc(fs.db, "votes", optId + "__" + mySlug), { option: optId, name: me, slug: mySlug, choice: cur.choice, note, at: Date.now() });
    toast("Opmerking opgeslagen");
  });
}
function answer(qid, value) {
  if (!me) { openGate(); return; }
  const cur = myAnswer(qid);
  const q = QUESTIONS.find((x) => x.id === qid);
  const off = (q.kind === "choice" && cur && cur.value === value) || !value;
  guarded("a:" + qid, async () => {
    const ref = fs.doc(fs.db, "answers", qid + "__" + mySlug);
    if (off) await fs.deleteDoc(ref);
    else await fs.setDoc(ref, { question: qid, name: me, slug: mySlug, value, at: Date.now() });
    if (q.kind === "text") toast("Antwoord opgeslagen");
  });
}

/* ---------- melding ---------- */
function renderNotice() {
  const n = $("#notice");
  if (!firebaseConfig) {
    n.hidden = false;
    n.innerHTML = `<p><strong>Stemmen staat nog niet aan.</strong> De opties kun je al bekijken. Zodra Firebase is gekoppeld, werken de stemknoppen.</p>`;
  } else if (S.error) {
    n.hidden = false;
    n.innerHTML = `<p><strong>De stemmen konden niet geladen worden.</strong> Check je internetverbinding en ververs de pagina.</p>`;
  } else n.hidden = true;
}

/* ---------- tussenstand ---------- */
function renderStand() {
  const rows = ranked();
  const topId = rows.find((r) => r.o.status !== "afgevallen" && r.score > 0)?.o.id;
  $("#stand-body").innerHTML = `<div class="table-box"><table><thead><tr><th></th><th>Optie</th><th>Prijs pp</th><th>Stemmen</th><th>Punten</th></tr></thead><tbody>${
    rows.map((r, i) => {
      const tot = r.c.ja + r.c.misschien + r.c.nee || 1;
      const out = r.o.status === "afgevallen";
      return `<tr class="${r.o.id === topId ? "lead-row" : ""} ${out ? "out" : ""}">
        <td class="rank">${out ? "–" : i + 1}</td>
        <td><a href="#opt-${esc(r.o.id)}" style="color:inherit;font-weight:700">${esc(r.o.title)}</a><div class="counts">${esc(r.o.dates)}${out ? " · valt af" : ""}</div></td>
        <td class="num">${r.o.pricePP ? euro(r.o.pricePP) : "?"}</td>
        <td><div class="bar" aria-hidden="true"><span class="b-ja" style="width:${(r.c.ja / tot) * 100}%"></span><span class="b-mb" style="width:${(r.c.misschien / tot) * 100}%"></span><span class="b-nee" style="width:${(r.c.nee / tot) * 100}%"></span></div>
            <div class="counts">${r.c.ja} ja · ${r.c.misschien} misschien · ${r.c.nee} nee</div></td>
        <td class="num" style="font-weight:700">${r.score > 0 ? "+" : ""}${r.score}</td></tr>`;
    }).join("")}</tbody></table></div>`;
  if (!S.loaded) { $("#pending").innerHTML = ""; return; }
  const openIds = allOptions().filter((o) => o.status !== "afgevallen").map((o) => o.id);
  const voted = new Set(S.votes.filter((v) => openIds.includes(v.option)).map((v) => slug(v.name)));
  const people = [...new Map([...MEMBERS, ...S.votes.map((v) => v.name), ...S.answers.map((a) => a.name)].map((n) => [slug(n), n])).values()];
  const missing = people.filter((n) => !voted.has(slug(n)));
  $("#pending").innerHTML = missing.length
    ? `<span class="muted">Nog niet gestemd:</span> ${missing.map((n) => `<span class="chip">${esc(n)}</span>`).join("")}`
    : `<span class="chip ja">Iedereen heeft gestemd</span>`;
}

/* ---------- opties ---------- */
function passHTML(o) {
  const out = o.status === "afgevallen";
  const code = (o.origin || "AMS").toUpperCase().slice(0, 3);
  const li = (a) => (a || []).map((x) => `<li>${esc(x)}</li>`).join("") || "<li class='muted'>Nog niets genoemd</li>";
  const link = o.link && /^https:\/\//.test(o.link) ? `<dt>Link</dt><dd><a href="${esc(o.link)}" target="_blank" rel="noopener">${esc(o.linkLabel || "Bekijken")}</a></dd>` : "";
  const canDelete = !o.seed && o.bySlug && mySlug && o.bySlug === mySlug;
  return `<article class="pass ${out ? "out" : ""}" id="opt-${esc(o.id)}" data-id="${esc(o.id)}">
    <div class="pass-main">
      <div class="pass-top">
        <div style="display:flex;flex-direction:column;gap:6px;min-width:0"><div class="tags" data-tags></div><h3>${esc(o.title)}</h3></div>
        <span class="eyebrow">Voorstel van ${esc(o.by || "?")}</span>
      </div>
      ${out && o.statusNote ? `<p style="color:var(--no);font-weight:600">${esc(o.statusNote)}</p>` : ""}
      <dl class="facts">${o.flight ? `<dt>Vlucht</dt><dd>${esc(o.flight)}</dd>` : ""}${o.house ? `<dt>Huis</dt><dd>${esc(o.house)}</dd>` : ""}${link}</dl>
      <div class="pc"><div class="pro"><h4>Voordelen</h4><ul>${li(o.pros)}</ul></div><div class="con"><h4>Nadelen</h4><ul>${li(o.cons)}</ul></div></div>
      <div class="vote">
        <div class="vote-btns">${CHOICES.map(([k, l]) => `<button type="button" class="vb ${k}" data-choice="${k}" aria-pressed="false">${l}</button>`).join("")}</div>
        <div class="voters" data-voters></div>
        <div class="note-row"><input type="text" id="note-${esc(o.id)}" data-note maxlength="280" aria-label="Opmerking bij je stem"><button type="button" class="btn ghost small" data-save>Opslaan</button></div>
        <div class="notes" data-notes></div>
        ${canDelete ? `<div><button type="button" class="linkbtn" data-del style="color:var(--no)">Deze optie verwijderen</button><span data-confirm hidden> Zeker weten? <button type="button" class="linkbtn" data-del-yes style="color:var(--no)">Ja, verwijder</button> · <button type="button" class="linkbtn" data-del-no>Annuleer</button></span></div>` : ""}
      </div>
    </div>
    <aside class="pass-stub">
      <div><div class="stub-label">Route</div><div class="stub-code"><span>${esc(code)}</span><i></i><span>KGS</span></div></div>
      <div><div class="stub-label">Data</div><div class="stub-dates">${esc(o.dates)}</div><div class="stub-note">${esc(o.length || "")}</div></div>
      <div><div class="stub-label">Per persoon</div><div class="price">${o.pricePP ? euro(o.pricePP) : "?"}</div>${o.priceNote ? `<div class="stub-note">${esc(o.priceNote)}</div>` : ""}</div>
    </aside>
  </article>`;
}
const sigs = {};
function renderPasses() {
  const box = $("#passes");
  box.querySelector(".empty")?.remove();
  const order = [...allOptions()].sort((a, b) => ((a.status === "afgevallen") - (b.status === "afgevallen")) || (a.order || 0) - (b.order || 0));
  const ids = new Set(order.map((o) => o.id));
  box.querySelectorAll(".pass").forEach((el) => { if (!ids.has(el.dataset.id)) { el.remove(); delete sigs[el.dataset.id]; } });
  const topId = ranked().find((x) => x.o.status !== "afgevallen" && x.score > 0)?.o.id;
  order.forEach((o) => {
    const sig = JSON.stringify(o) + "|" + (me || "");
    let el = box.querySelector(`.pass[data-id="${CSS.escape(o.id)}"]`);
    if (!el || sigs[o.id] !== sig) {
      const tmp = document.createElement("div"); tmp.innerHTML = passHTML(o); const nel = tmp.firstElementChild;
      if (el) { const draft = el.querySelector("[data-note]").value; el.replaceWith(nel); nel.querySelector("[data-note]").value = draft; }
      el = nel; sigs[o.id] = sig;
    }
    box.appendChild(el);
    const out = o.status === "afgevallen";
    el.querySelector("[data-tags]").innerHTML = (o.id === topId ? `<span class="tag lead">Ligt voor</span>` : "") + (out ? `<span class="tag out">Valt af</span>` : "") + (o.length ? `<span class="tag">${esc(o.length)}</span>` : "");
    const mine = myVote(o.id); const isBusy = busy.has("v:" + o.id);
    el.querySelectorAll(".vb").forEach((b) => { b.setAttribute("aria-pressed", String(mine?.choice === b.dataset.choice)); b.disabled = isBusy; });
    const t = tally(o.id);
    el.querySelector("[data-voters]").innerHTML = t.vs.length
      ? [...t.vs].sort((a, b) => "jmn".indexOf(a.choice[0]) - "jmn".indexOf(b.choice[0])).map((v) => `<span class="chip ${esc(v.choice)} ${mySlug && (v.slug || slug(v.name)) === mySlug ? "me" : ""}">${esc(v.name)} <span class="n">${esc(v.choice)}</span></span>`).join("")
      : `<span class="muted" style="font-size:14px">${S.loaded ? "Nog niemand gestemd." : "Stemmen laden…"}</span>`;
    const inp = el.querySelector("[data-note]");
    inp.disabled = !mine; el.querySelector("[data-save]").disabled = !mine || isBusy;
    inp.placeholder = mine ? "Opmerking bij je stem (optioneel)" : "Stem eerst, dan kun je een opmerking toevoegen";
    if (document.activeElement !== inp && !inp.dataset.dirty) inp.value = mine?.note || "";
    el.querySelector("[data-notes]").innerHTML = t.vs.filter((v) => v.note).map((v) => `<p><b>${esc(v.name)}:</b> ${esc(v.note)}</p>`).join("");
  });
}
$("#passes").addEventListener("click", (e) => {
  const card = e.target.closest(".pass"); if (!card) return; const id = card.dataset.id;
  const vb = e.target.closest(".vb"); if (vb) { vote(id, vb.dataset.choice); return; }
  if (e.target.closest("[data-save]")) { const inp = card.querySelector("[data-note]"); delete inp.dataset.dirty; saveNote(id, inp.value); return; }
  if (e.target.closest("[data-del]")) { card.querySelector("[data-confirm]").hidden = false; return; }
  if (e.target.closest("[data-del-no]")) { card.querySelector("[data-confirm]").hidden = true; return; }
  if (e.target.closest("[data-del-yes]")) guarded("d:" + id, async () => { await fs.deleteDoc(fs.doc(fs.db, "options", id)); toast("Optie verwijderd"); });
});
$("#passes").addEventListener("input", (e) => { if (e.target.matches("[data-note]")) e.target.dataset.dirty = "1"; });
$("#passes").addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.matches("[data-note]")) { e.preventDefault(); e.target.closest(".note-row").querySelector("[data-save]").click(); } });

/* ---------- vragen ---------- */
function renderQs() {
  const box = $("#qs");
  if (!box.children.length) {
    box.innerHTML = QUESTIONS.map((q) => `<div class="q" data-id="${esc(q.id)}"><h3>${esc(q.text)}</h3>${q.context ? `<p class="ctx">${esc(q.context)}</p>` : ""}
      ${q.kind === "text"
        ? `<div class="note-row"><input type="text" id="q-${esc(q.id)}" data-qtext maxlength="200" placeholder="Jouw antwoord" aria-label="Jouw antwoord"><button type="button" class="btn ghost small" data-qsave>Opslaan</button></div><div class="notes" data-qanswers></div>`
        : `<div class="opts">${q.choices.map((c) => `<button type="button" class="opt" data-val="${esc(c)}" aria-pressed="false"><span>${esc(c)}</span><span class="cnt">0</span><span class="who-list" hidden></span></button>`).join("")}</div>`}
    </div>`).join("");
  }
  QUESTIONS.forEach((q) => {
    const el = box.querySelector(`.q[data-id="${q.id}"]`);
    const mine = myAnswer(q.id);
    const ans = S.answers.filter((a) => a.question === q.id);
    if (q.kind === "text") {
      const inp = el.querySelector("[data-qtext]");
      if (document.activeElement !== inp && !inp.dataset.dirty) inp.value = mine?.value || "";
      el.querySelector("[data-qanswers]").innerHTML = ans.map((a) => `<p><b>${esc(a.name)}:</b> ${esc(a.value)}</p>`).join("") || `<p class="muted" style="border:0;padding:0">Nog geen antwoorden.</p>`;
    } else {
      el.querySelectorAll(".opt").forEach((b) => {
        const who = ans.filter((a) => a.value === b.dataset.val);
        b.setAttribute("aria-pressed", String(mine?.value === b.dataset.val));
        b.querySelector(".cnt").textContent = who.length;
        const wl = b.querySelector(".who-list"); wl.textContent = who.map((a) => a.name).join(", "); wl.hidden = !who.length;
        b.disabled = busy.has("a:" + q.id);
      });
    }
  });
}
$("#qs").addEventListener("click", (e) => {
  const card = e.target.closest(".q"); if (!card) return;
  const o = e.target.closest(".opt"); if (o) { answer(card.dataset.id, o.dataset.val); return; }
  if (e.target.closest("[data-qsave]")) { const inp = card.querySelector("[data-qtext]"); delete inp.dataset.dirty; answer(card.dataset.id, inp.value.trim().slice(0, 200)); }
});
$("#qs").addEventListener("input", (e) => { if (e.target.matches("[data-qtext]")) e.target.dataset.dirty = "1"; });
$("#qs").addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.matches("[data-qtext]")) { e.preventDefault(); e.target.closest(".note-row").querySelector("[data-qsave]").click(); } });

/* ---------- optie toevoegen ---------- */
$("#add-form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!me) { openGate(); return; }
  const v = (id) => $(id).value.trim();
  const lines = (s) => s.split("\n").map((x) => x.trim()).filter(Boolean).slice(0, 8).map((x) => x.slice(0, 200));
  let link = v("#f-link"); if (link && !/^https:\/\//.test(link)) link = "";
  const fl = v("#f-flight");
  const data = {
    title: v("#f-title").slice(0, 60), dates: v("#f-dates").slice(0, 40), length: v("#f-length").slice(0, 30),
    pricePP: Number(v("#f-price")) || 0, flight: fl.slice(0, 160), house: v("#f-house").slice(0, 160),
    link: link.slice(0, 400), linkLabel: "Bekijken", pros: lines($("#f-pros").value), cons: lines($("#f-cons").value),
    origin: /rotterdam|rtm/i.test(fl) ? "RTM" : /eindhoven|ein\b/i.test(fl) ? "EIN" : /weeze|nrn/i.test(fl) ? "NRN" : "AMS",
    status: "open", by: me, bySlug: mySlug, order: Date.now(), seed: false,
  };
  guarded("add", async () => {
    const ref = await fs.addDoc(fs.collection(fs.db, "options"), data);
    $("#add-form").reset(); $("#f-msg").textContent = "Toegevoegd. Iedereen kan er nu op stemmen.";
    setTimeout(() => document.getElementById("opt-" + ref.id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 400);
  });
});

function renderAll() { renderWho(); renderStand(); renderPasses(); renderQs(); $("#f-submit").disabled = busy.has("add"); }

/* ---------- start ---------- */
renderNotice();
renderAll();

(async () => {
  if (!firebaseConfig) return;
  try {
    const { initializeApp } = await import(FB + "firebase-app.js");
    const f = await import(FB + "firebase-firestore.js");
    const au = await import(FB + "firebase-auth.js");
    const app = initializeApp(firebaseConfig);
    const auth = au.getAuth(app);
    const user = await new Promise((resolve) => {
      const off = au.onAuthStateChanged(auth, (u) => { off(); resolve(u); });
    });
    try {
      S.uid = (user || (await au.signInAnonymously(auth)).user).uid;
    } catch (e) {
      console.error(e); S.authError = e;
    }
    fs = { db: f.getFirestore(app), doc: f.doc, setDoc: f.setDoc, deleteDoc: f.deleteDoc, addDoc: f.addDoc, collection: f.collection, writeBatch: f.writeBatch };
    const fail = (err) => { console.error(err); S.error = err; renderNotice(); };
    let pending = 4;
    const ready = () => { if (--pending === 0) S.loaded = true; };
    const sub = (name, key, after) => {
      let first = true;
      f.onSnapshot(f.collection(fs.db, name), (snap) => {
        S[key] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (S.error) { S.error = null; renderNotice(); }
        if (first) { first = false; ready(); }
        if (after) after();
        renderAll();
      }, fail);
    };
    sub("claims", "claims", () => {
      const firstLoad = !S.claimsLoaded;
      S.claimsLoaded = true;
      deriveMe();
      if (firstLoad && !me) openGate();
      else if (!$("#gate").hidden && gateState.mode === "pick") renderGate();
    });
    sub("votes", "votes"); sub("answers", "answers"); sub("options", "extra");
  } catch (err) { console.error(err); S.error = err; renderNotice(); }
})();
