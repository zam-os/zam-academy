import "./styles.css";
import {
  CORE_LESSONS,
  EDITORIAL_DATE,
  findLesson,
  LESSONS,
  SOURCES,
  STAGES,
} from "./curriculum";
import {
  createRound,
  REQUIRED_ROUNDS,
  type Round,
  revealRound,
  skipRound,
  submitRound,
} from "./exercises/practice";
import { esc, looksLikeDraft, rich, shuffle } from "./format";
import {
  bindGaps,
  chooseItemHtml,
  commaItemHtml,
  markHtml,
  readChoose,
  readCommas,
  setChoose,
  setCommas,
} from "./items";
import type { Lesson } from "./model/types";
import {
  completion,
  isComplete,
  keyOf,
  loadProgress,
  mergeProgress,
  parseProgress,
  STORAGE_KEY,
  saveProgress,
} from "./storage/progress";
import {
  canAcceptSelfAssessment,
  checkCase,
  checkChoose,
  checkCommas,
  checkMarks,
  checkSort,
  chooseSentence,
  commaSentence,
  initialOrder,
  type Marking,
  moveEntry,
  quizOptions,
  shownOptions,
  toggleMark,
} from "./workshop";
import { parseTrainingDeepLink, zamEnrolRequest } from "./zam/zam-link";

const loaded = loadProgress();
const p = loaded.progress;
let persistent = loaded.persistent;
const rounds = new Map<string, Round>();
const orders = new Map<string, number[]>();
const markings = new Map<string, Marking>();
const activeLabels = new Map<string, number>();
let view: "lesson" | "map" = "lesson";
/** On a narrow screen the lesson list sits behind a button and closes after a choice. */
let menuOpen = false;

const $ = <T extends Element = HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Bedienelement fehlt: ${selector}`);
  return element;
};
const app = $("#app");

/** The texts this tab has changed since it loaded; only these may replace what another tab saved. */
const dirtyDrafts = new Set<string>();

/** Shows in the text box what another tab saved, as long as this tab has not touched that text. */
function syncDraft() {
  const area = document.querySelector<HTMLTextAreaElement>("#draft");
  const lesson = findLesson(p.active);
  if (!area || !lesson || view !== "lesson") return;
  const key = keyOf(lesson.id, p.level);
  const saved = p.drafts[key] ?? "";
  if (dirtyDrafts.has(key) || area.value === saved) return;
  area.value = saved;
  const compare = document.querySelector<HTMLButtonElement>("#compare-writing");
  if (compare) compare.disabled = !looksLikeDraft(saved);
}

function persist() {
  // Another tab may have saved progress since this one loaded: join, then save.
  const stored = loadProgress();
  if (stored.persistent) {
    Object.assign(p, mergeProgress(stored.progress, p, dirtyDrafts));
    syncDraft();
  }
  persistent = saveProgress(p);
  const warning = document.querySelector<HTMLElement>("#storage-warning");
  if (warning) warning.hidden = persistent;
}
function addOnce(list: string[], id: string) {
  if (!list.includes(id)) list.push(id);
}
const isFresh = () => !p.quiz.length && !p.workshop.length && !p.casework.length && !p.assessed.length;

function deepLink() {
  const link = parseTrainingDeepLink(location.hash, location.search);
  if (link.lessonId && findLesson(link.lessonId)) {
    p.active = link.lessonId;
    view = "lesson";
  }
  if (link.level) p.level = link.level;
}
deepLink();
// A first visit without any link opens the map; a link to a lesson (hash or ?lesson=) opens that lesson.
if (!location.hash && !parseTrainingDeepLink(location.hash, location.search).lessonId && isFresh()) view = "map";

function navigate(id: string) {
  if (!findLesson(id)) return;
  p.active = id;
  view = "lesson";
  menuOpen = false;
  rounds.clear();
  openRoundState.clear();
  history.replaceState(null, "", `#lesson=${encodeURIComponent(id)}`);
  persist();
  render();
  $("#lesson").focus();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function stageOf(lb: number) {
  return STAGES.find((s) => s.lb === lb) ?? STAGES[0];
}
function stageDone(lb: number) {
  const entries = CORE_LESSONS.filter((l) => l.lb === lb);
  return { done: entries.filter((l) => isComplete(p, l.id)).length, total: entries.length };
}

/** A short, non-blocking message that confirms an achievement. */
function celebrate(message: string) {
  const host = $("#celebrate");
  host.textContent = message;
  host.classList.remove("show");
  void host.offsetWidth;
  host.classList.add("show");
}

function render() {
  const lesson = findLesson(p.active) ?? LESSONS[0];
  const c = completion(p);
  document.title = `${view === "map" ? "Lernlandkarte" : lesson.title} · Französisch 9 · ZAM Academy`;
  app.innerHTML = `<a class="skip-link" href="#lesson">Zum Lerninhalt</a>
    <header class="topbar"><a class="brand" href="../">ZAM <span>ACADEMY</span></a><span class="course-label">Bayern · Realschule · Jahrgangsstufe 9</span><button id="menu-button" class="quiet menu-only" aria-controls="sidebar" aria-expanded="${menuOpen}">☰ Lernpfad ${c.done}/${c.total}</button><button id="map-button" class="quiet">🗺️ Lernlandkarte</button><button id="sources-button" class="quiet">Quellen & ZAM</button></header>
    <div class="shell"><aside id="sidebar" class="sidebar ${menuOpen ? "open" : ""}" aria-label="Lernpfad"><div class="sidebar-heading"><span class="eyebrow">Dein Lernpfad</span><p class="side-title">Französisch <span>9</span></p><p>Grammatik. Wortschatz. Verstehen. Frankreich.</p></div>
      <div class="progress-box"><div><strong id="progress-count">${c.done} / ${c.total}</strong><span>Lektionen</span></div><progress id="progress" max="${c.total}" value="${c.done}" aria-label="Abgeschlossene Lektionen"></progress></div>
      <nav>${STAGES.map((s) => {
        const entries = LESSONS.filter((l) => l.lb === s.lb);
        if (!entries.length) return "";
        const d = stageDone(s.lb);
        return `<details class="stage" data-lb="${s.lb}" ${s.lb === lesson.lb ? "open" : ""}><summary><span class="stage-glyph" aria-hidden="true">${s.glyph}</span><span class="stage-name">${esc(s.title)}</span><span class="stage-count">${d.done}/${d.total}</span></summary>${entries
          .map(
            (l) =>
              `<button class="lesson-link ${l.id === lesson.id && view === "lesson" ? "active" : ""}" data-lesson="${l.id}" ${l.id === lesson.id && view === "lesson" ? 'aria-current="step"' : ""}><span class="lesson-dot" aria-hidden="true">${isComplete(p, l.id) ? "✓" : "·"}</span><span class="sr-only lesson-state">${isComplete(p, l.id) ? "geschafft: " : ""}</span>${esc(l.title)}</button>`,
          )
          .join("")}</details>`;
      }).join("")}</nav>
      <p class="small">${CORE_LESSONS.length} Lektionen in sieben Stufen<br>Ohne Anmeldung. Lokal gespeichert.</p></aside>
    <main id="lesson" tabindex="-1" data-lb="${view === "map" ? 0 : lesson.lb}"><div id="storage-warning" class="notice" ${persistent ? "hidden" : ""}>Dieser Browser erlaubt das Speichern gerade nicht. Du kannst weiterlernen; dein Fortschritt bleibt nur bis zum Schließen erhalten.</div>
    ${view === "map" ? mapHtml() : lessonHtml(lesson)}${footerHtml()}</main></div><div id="celebrate" class="celebrate" role="status" aria-live="polite"></div>`;
  document.querySelectorAll<HTMLButtonElement>("[data-lesson]").forEach((b) => {
    b.addEventListener("click", () => navigate(b.dataset.lesson ?? ""));
  });
  // A plain link to "#lesson" would change the hash and render the page anew, losing what is typed in.
  document.querySelector(".skip-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    $("#lesson").focus();
  });
  $("#menu-button").addEventListener("click", () => {
    menuOpen = !menuOpen;
    $("#sidebar").classList.toggle("open", menuOpen);
    $("#menu-button").setAttribute("aria-expanded", String(menuOpen));
  });
  $("#map-button").addEventListener("click", () => {
    view = "map";
    menuOpen = false;
    render();
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  $("#sources-button").addEventListener("click", () => {
    const d = $<HTMLDetailsElement>("#sources-note");
    d.open = true;
    d.scrollIntoView({ behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });
  if (view === "map") return;
  $("#level").addEventListener("change", (e) => {
    const open = rounds.get(keyOf(lesson.id, p.level));
    if (open) rememberRound(open);
    p.level = (e.target as HTMLSelectElement).value === "2" ? 2 : 1;
    persist();
    // Only the parts that depend on the level are drawn again; answers given above stay.
    if (lesson.practice) refreshPractice(lesson);
    refreshWriting(lesson);
    updateEvidence();
  });
  $("#next").addEventListener("click", () => {
    const index = LESSONS.findIndex((l) => l.id === lesson.id);
    navigate(LESSONS[(index + 1) % LESSONS.length].id);
  });
  bindQuiz(lesson);
  bindWorkshop(lesson);
  bindCase(lesson);
  if (lesson.practice) bindPractice(lesson);
  bindWriting(lesson);
  updateEvidence();
}

/** Saves and, when a lesson or a whole Lernbereich just became complete, says so. */
function afterProgress(lesson: Lesson, wasComplete = false) {
  persist();
  const nowComplete = isComplete(p, lesson.id);
  updateEvidence();
  if (nowComplete && !wasComplete) {
    const d = stageDone(lesson.lb);
    celebrate(
      d.done === d.total
        ? `${stageOf(lesson.lb).glyph} Stufe „${stageOf(lesson.lb).title}“ geschafft!`
        : `✓ Lektion geschafft: ${lesson.title}`,
    );
  }
}

function mapHtml(): string {
  const c = completion(p);
  const cards = STAGES.map((s) => {
    const entries = LESSONS.filter((l) => l.lb === s.lb);
    const d = stageDone(s.lb);
    const percent = d.total ? Math.round((d.done / d.total) * 100) : 0;
    return `<section class="map-card" data-lb="${s.lb}"><div class="map-head"><span class="map-glyph" aria-hidden="true">${s.glyph}</span><div><h2>${esc(s.title)}</h2><p>${esc(s.subtitle)}</p></div><span class="ring" style="--pct:${percent}" role="img" aria-label="${percent} Prozent geschafft"><b>${d.done}/${d.total}</b></span></div>
        <ul class="map-lessons">${entries.map((l) => `<li><button data-lesson="${l.id}" class="map-lesson ${isComplete(p, l.id) ? "done" : ""}"><span aria-hidden="true">${isComplete(p, l.id) ? "✓" : l.unit}</span>${isComplete(p, l.id) ? '<span class="sr-only">geschafft: </span>' : ""}${esc(l.title)}</button></li>`).join("")}</ul></section>`;
  }).join("");
  const next = CORE_LESSONS.find((l) => !isComplete(p, l.id));
  return `<div class="hero"><span class="eyebrow">Lernlandkarte</span><h1>Dein Weg durch Französisch 9</h1><p>Sieben Stufen, ${c.total} Lektionen. Jede Lektion verbindet eine Erklärung mit einem Schnellcheck, einer Werkstatt, einem Textfall und einer eigenen Schreibaufgabe. ${c.done ? `Bisher geschafft: ${c.done}.` : "Starte, wo du willst."}</p>${next ? `<button class="primary" data-lesson="${next.id}">${c.done ? "Weiterlernen" : "Los geht’s"}: ${esc(next.title)} →</button>` : '<p class="notice">Alle Lektionen sind geschafft. Wiederhole mit ZAM, was du behalten willst.</p>'}</div><div class="map-grid">${cards}</div>`;
}

const WORKSHOP_NAME = {
  classify: "Zuordnen",
  timeline: "Ordnen",
  mark: "Im Text markieren",
  commas: "Kommas setzen",
  choose: "Richtig wählen",
} as const;

function lessonHtml(lesson: Lesson): string {
  const stage = stageOf(lesson.lb);
  let n = 0;
  const number = () => String(++n).padStart(2, "0");
  return `<div class="lesson-band"><span class="band-glyph" aria-hidden="true">${stage.glyph}</span><div><span class="eyebrow">Stufe ${lesson.lb} · ${esc(stage.title)}</span><h1 class="lesson-title">${esc(lesson.title)}</h1></div><label class="level-switch">Übungsniveau <select id="level"><option value="1" ${p.level === 1 ? "selected" : ""}>1 · Mit Leitfragen</option><option value="2" ${p.level === 2 ? "selected" : ""}>2 · Übertragen</option></select></label></div>
    <p class="lehrplan-tag"><span>${esc(lesson.lehrplan ?? "")}</span></p>
    <p class="intro">${esc(lesson.intro)}</p>
    <div class="reading">${lesson.paragraphs.map((x) => `<p>${rich(x)}</p>`).join("")}</div>
    ${lesson.terms.length ? `<dl class="terms">${lesson.terms.map((t) => `<div><dt>${esc(t.term)}</dt><dd>${rich(t.text)}</dd></div>`).join("")}</dl>` : ""}
    ${(lesson.examples ?? []).map((x) => `<aside class="example"><span class="example-tag">Beispiel</span><strong>${esc(x.title)}</strong><blockquote>${rich(x.text)}</blockquote>${x.source ? `<p class="small example-source">${esc(x.source)}</p>` : ""}<p>${rich(x.analysis)}</p></aside>`).join("")}
    <div class="takeaway"><span>Zum Mitnehmen</span><p>${rich(lesson.takeaway)}</p></div>
    <div class="evidence" id="evidence"></div>
    ${quizHtml(lesson, number())}${workshopHtml(lesson, number())}${caseHtml(lesson, number())}${lesson.practice ? practiceHtml(lesson, number()) : ""}${writingHtml(lesson, number())}
    <div class="lesson-end"><p id="completion-note"></p><button id="next" class="primary">Nächste Lektion →</button></div>
    <details class="source-details"><summary>Quellen zu dieser Lektion</summary><ul>${lesson.sourceIds
      .map((id) => {
        const s = SOURCES.find((x) => x.id === id);
        return s
          ? `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`
          : "";
      })
      .join(
        "",
      )}</ul><p class="small">Lehrplanabgleich: ${EDITORIAL_DATE}. Beispieltexte sind, wo nicht anders genannt, eigens verfasste Lernbeispiele. Zitate aus Werken sind mit Quelle gekennzeichnet.</p></details>`;
}

function updateEvidence() {
  const l = findLesson(p.active) ?? LESSONS[0],
    key = keyOf(l.id, 1),
    c = completion(p);
  const flags: Array<[string, boolean]> = [
    ["Schnellcheck", p.quiz.includes(l.id)],
    [WORKSHOP_NAME[l.workshop.kind], p.workshop.includes(l.id)],
    ["Textfall gelöst", p.casework.includes(l.id)],
    ...(l.practice
      ? ([[`Übung · Niveau 1: ${Math.min(p.solved[key] ?? 0, REQUIRED_ROUNDS)}/${REQUIRED_ROUNDS} Runden`, (p.solved[key] ?? 0) >= REQUIRED_ROUNDS]] as Array<[string, boolean]>)
      : []),
    ["Eigener Text · Niveau 1", p.assessed.includes(key)],
  ];
  const evidence = document.querySelector("#evidence");
  if (!evidence) return;
  evidence.innerHTML = flags
    .map(
      ([label, done]) =>
        `<span class="${done ? "done" : ""}">${done ? "✓" : "○"} ${esc(label)}</span>`,
    )
    .join("");
  $("#progress-count").textContent = `${c.done} / ${c.total}`;
  $("#menu-button").textContent = `☰ Lernpfad ${c.done}/${c.total}`;
  $<HTMLProgressElement>("#progress").value = c.done;
  $("#completion-note").textContent = isComplete(p, l.id)
    ? "Diese Lektion ist abgeschlossen. Zusätzliche Aufgaben auf Niveau 2 bleiben freiwillig."
    : `Für den Abschluss: ${["Schnellcheck", WORKSHOP_NAME[l.workshop.kind], "den Textfall", l.practice ? `${REQUIRED_ROUNDS} Übungsrunden auf Niveau 1` : "", "eigenen Text auf Niveau 1"].filter(Boolean).join(", ")}.`;
  document.querySelectorAll<HTMLButtonElement>("[data-lesson]").forEach((b) => {
    const dot = b.querySelector(".lesson-dot");
    const done = isComplete(p, b.dataset.lesson ?? "");
    if (dot) dot.textContent = done ? "✓" : "·";
    const state = b.querySelector(".lesson-state");
    if (state) state.textContent = done ? "geschafft: " : "";
  });
}

function quizHtml(l: Lesson, number: string) {
  const { options } = quizOptions(l);
  return `<section class="panel"><div class="eyebrow">${number} · Abrufen</div><h2>Schnellcheck</h2><form id="quiz"><fieldset><legend>${esc(l.quiz.question)}</legend>${options.map((option, i) => `<label class="option"><input type="radio" name="quiz" value="${i}"> <span>${esc(option)}</span></label>`).join("")}</fieldset><button type="submit">Antwort prüfen</button></form><p id="quiz-feedback" class="feedback" role="status"></p></section>`;
}
function bindQuiz(l: Lesson) {
  $("#quiz").addEventListener("submit", (e) => {
    e.preventDefault();
    const checked = document.querySelector<HTMLInputElement>('input[name="quiz"]:checked');
    if (!checked) {
      $("#quiz-feedback").textContent = "Wähle zuerst eine Antwort.";
      return;
    }
    const right = Number(checked.value) === quizOptions(l).answer;
    if (right) {
      const was = isComplete(p, l.id);
      addOnce(p.quiz, l.id);
      afterProgress(l, was);
    }
    // The explanation names the right answer, so it comes only after a right one.
    $("#quiz-feedback").textContent = right
      ? `Richtig. ${l.quiz.explanation}`
      : "Noch nicht. Lies die Frage und alle Antworten noch einmal.";
  });
}

/** The start of an entry, enough to tell it from the others in a button's name. */
const shortText = (text: string) => (text.length > 48 ? `${text.slice(0, 48).trimEnd()} …` : text);

function workshopHtml(l: Lesson, number: string) {
  const w = l.workshop;
  const head = `<section class="panel" id="workshop-panel"><div class="eyebrow">${number} · ${WORKSHOP_NAME[w.kind]}</div><h2>${esc(w.title)}</h2><p>${esc(w.instruction)}</p>`;
  const tail = `<div id="workshop-feedback" role="status"></div></section>`;
  if (w.kind === "timeline") {
    const order = orders.get(l.id) ?? initialOrder(w, l.id);
    orders.set(l.id, order);
    return `${head}<ol class="order-list" id="workshop">${order
      .map(
        (entry, position) =>
          `<li class="order-item"><div class="order-row"><span>${esc(w.entries[entry].text)}</span><span class="order-buttons"><button type="button" class="quiet" data-move="${position}:-1" aria-label="${esc(shortText(w.entries[entry].text))} nach oben" ${position === 0 ? "disabled" : ""}>↑</button><button type="button" class="quiet" data-move="${position}:1" aria-label="${esc(shortText(w.entries[entry].text))} nach unten" ${position === order.length - 1 ? "disabled" : ""}>↓</button></span></div><p class="small" id="case-feedback-${position}"></p></li>`,
      )
      .join("")}</ol><button type="button" id="check-order">Reihenfolge prüfen</button>${tail}`;
  }
  if (w.kind === "classify")
    return `${head}<form id="workshop">${shuffle(
      w.entries.map((entry, i) => ({ entry, i })),
      `${l.id}:cases`,
    )
      .map(
        ({ entry, i }) =>
          `<label class="work-entry"><span id="case-text-${i}">${esc(entry.text)}</span><select name="case-${i}" aria-labelledby="case-text-${i}"><option value="">Zuordnung wählen</option>${w.categories.map((cat, j) => `<option value="${j}">${esc(cat)}</option>`).join("")}</select></label><p class="small" id="case-feedback-${i}"></p>`,
      )
      .join("")}<button type="submit">Zuordnung prüfen</button></form>${tail}`;
  if (w.kind === "mark") {
    const marking = markings.get(l.id) ?? [];
    markings.set(l.id, marking);
    return `${head}<div id="workshop">${markHtml(w, marking, activeLabels.get(l.id) ?? 0)}</div>${tail}`;
  }
  if (w.kind === "commas")
    return `${head}<div id="workshop">${w.items.map((item, i) => commaItemHtml(item, "w", i)).join("")}<button type="button" id="check-commas">Kommas prüfen</button></div>${tail}`;
  return `${head}<div id="workshop">${w.items.map((item, i) => chooseItemHtml(item, "w", i, l.id)).join("")}<button type="button" id="check-choose">Auswahl prüfen</button></div>${tail}`;
}

function bindWorkshop(l: Lesson) {
  const w = l.workshop;
  const done = (message: string) => {
    const was = isComplete(p, l.id);
    addOnce(p.workshop, l.id);
    afterProgress(l, was);
    $("#workshop-feedback").textContent = `Alles richtig. ${message}`;
  };
  const say = (prefix: string, i: number, correct: boolean, text: string) => {
    const el = document.querySelector(`#${prefix}-feedback-${i}`);
    if (el) el.textContent = `${correct ? "Richtig." : "Noch einmal prüfen."} ${text}`;
  };
  if (w.kind === "timeline") {
    document.querySelectorAll<HTMLButtonElement>("[data-move]").forEach((b) => {
      b.addEventListener("click", () => {
        const [position, delta] = (b.dataset.move ?? "0:0").split(":").map(Number);
        const step = delta === 1 ? 1 : -1;
        orders.set(l.id, moveEntry(orders.get(l.id) ?? [], position, step));
        const section = $("#workshop-panel");
        section.outerHTML = workshopHtml(l, section.querySelector(".eyebrow")?.textContent?.slice(0, 2) ?? "02");
        bindWorkshop(l);
        // The panel was drawn anew: put the focus back on the entry that moved and say where it stands now.
        const order = orders.get(l.id) ?? [];
        const target = Math.min(Math.max(position + step, 0), order.length - 1);
        (
          document.querySelector<HTMLButtonElement>(`[data-move="${target}:${step}"]:not([disabled])`) ??
          document.querySelector<HTMLButtonElement>(`[data-move="${target}:${-step}"]:not([disabled])`)
        )?.focus();
        $("#workshop-feedback").textContent = `${shortText(w.entries[order[target]].text)} steht jetzt an Stelle ${target + 1} von ${order.length}.`;
      });
    });
    $("#check-order").addEventListener("click", () => {
      const order = orders.get(l.id) ?? [];
      const results = checkSort(w, order);
      // Only an entry in the right place is explained; a wrong one never says where it belongs.
      results.forEach((ok, position) => {
        const el = document.querySelector(`#case-feedback-${position}`);
        if (el)
          el.textContent = ok
            ? `Richtig. ${w.entries[order[position]].feedback}`
            : "Noch einmal prüfen. Überlege, was zuerst geschehen muss und was erst danach kommt.";
      });
      if (results.every(Boolean)) done(w.conclusion);
      else $("#workshop-feedback").textContent = "Mindestens ein Eintrag steht noch nicht an der richtigen Stelle.";
    });
    return;
  }
  if (w.kind === "classify") {
    $("#workshop").addEventListener("submit", (e) => {
      e.preventDefault();
      const choices = w.entries.map((_, i) => {
        const value = $<HTMLSelectElement>(`[name="case-${i}"]`).value;
        return value === "" ? -1 : Number(value);
      });
      const results = checkSort(w, choices);
      // Only a right entry is explained; a wrong or empty one never names the category it belongs to.
      results.forEach((ok, i) => {
        const el = document.querySelector(`#case-feedback-${i}`);
        if (el)
          el.textContent = ok
            ? `Richtig. ${w.entries[i].feedback}`
            : choices[i] === -1
              ? "Wähle eine Zuordnung."
              : "Noch einmal prüfen. Vergleiche den Eintrag mit den Merkmalen der Kategorien.";
      });
      if (results.every(Boolean)) done(w.conclusion);
      else $("#workshop-feedback").textContent = "Mindestens ein Eintrag fehlt oder passt noch nicht.";
    });
    return;
  }
  if (w.kind === "mark") {
    const repaint = () => {
      $("#workshop").innerHTML = markHtml(w, markings.get(l.id) ?? [], activeLabels.get(l.id) ?? 0);
      // The last check no longer describes what stands on the page.
      $("#workshop-feedback").textContent = "";
      bindMark();
    };
    const bindMark = () => {
      document.querySelectorAll<HTMLInputElement>('input[name="mark-label"]').forEach((radio) => {
        radio.addEventListener("change", () => activeLabels.set(l.id, Number(radio.value)));
      });
      document.querySelectorAll<HTMLButtonElement>("[data-seg]").forEach((button) => {
        button.addEventListener("click", () => {
          markings.set(
            l.id,
            toggleMark(markings.get(l.id) ?? [], Number(button.dataset.seg), activeLabels.get(l.id) ?? 0),
          );
          repaint();
          document.querySelector<HTMLButtonElement>(`[data-seg="${button.dataset.seg}"]`)?.focus();
        });
      });
      $("#clear-marks").addEventListener("click", () => {
        markings.set(l.id, []);
        $("#workshop-feedback").textContent = "";
        repaint();
      });
      $("#check-marks").addEventListener("click", () => {
        const marking = markings.get(l.id) ?? [];
        const results = checkMarks(w, marking);
        if (results.every(Boolean)) {
          const lines = w.text.flatMap((segment) =>
            segment.label === undefined
              ? []
              : [`✓ „${segment.t.trim()}“ (${w.labels[segment.label]}): ${segment.feedback ?? ""}`],
          );
          const was = isComplete(p, l.id);
          addOnce(p.workshop, l.id);
          afterProgress(l, was);
          $("#workshop-feedback").innerHTML = `<p>Alles richtig. ${esc(w.conclusion)}</p><ul class="mark-feedback">${lines.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
          return;
        }
        // A miss marks the pieces that do not stand right, all with the same sentence: it never says whether
        // a piece is a target, which label it has instead, or how many are still missing.
        const wrong: string[] = [];
        w.text.forEach((segment, i) => {
          if (marking[i] !== undefined && marking[i] !== segment.label) wrong.push(`✗ „${segment.t.trim()}“: Diese Markierung stimmt noch nicht.`);
        });
        $("#workshop-feedback").innerHTML = `<p>Noch nicht alles stimmt.${wrong.length ? " Prüfe die Markierungen mit ✗." : " Es fehlen noch Markierungen."}</p>${wrong.length ? `<ul class="mark-feedback">${wrong.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}`;
      });
    };
    bindMark();
    return;
  }
  if (w.kind === "commas") {
    bindGaps($("#workshop"));
    $("#check-commas").addEventListener("click", () => {
      const results = w.items.map((item, i) => checkCommas(item, readCommas("w", i)));
      results.forEach((ok, i) => say("w", i, ok, ok ? w.items[i].feedback : "Prüfe die Lücken dieses Satzes: Wo endet ein Teilsatz, wo steht eine Aufzählung oder ein Einschub?"));
      if (results.every(Boolean)) done(w.conclusion);
      else $("#workshop-feedback").textContent = "Mindestens ein Satz hat noch nicht die richtigen Kommas.";
    });
    return;
  }
  $("#check-choose").addEventListener("click", () => {
    const results = w.items.map((item, i) => checkChoose(item, readChoose("w", i)));
    results.forEach((ok, i) => say("w", i, ok, ok ? w.items[i].feedback : "Lies den Satz mit jeder Möglichkeit und prüfe, welche Regel passt."));
    if (results.every(Boolean)) done(w.conclusion);
    else $("#workshop-feedback").textContent = "Mindestens eine Lücke fehlt oder passt noch nicht.";
  });
}

function caseHtml(l: Lesson, number: string) {
  const file = l.casework;
  return `<section class="panel case"><div class="eyebrow">${number} · Textfall</div><h2>${esc(file.title)}</h2><blockquote class="story">${rich(file.story)}</blockquote><form id="casework">${file.steps
    .map((step, i) => {
      const shown = shownOptions(file, i, l.id);
      return `<fieldset class="case-step"><legend><span class="step-no">${i + 1}</span> ${esc(step.question)}</legend>${shown.options.map((option, j) => `<label class="option"><input type="radio" name="step-${i}" value="${j}"> <span>${esc(option)}</span></label>`).join("")}<p class="small step-feedback" id="step-feedback-${i}"></p></fieldset>`;
    })
    .join("")}<button type="submit">Textfall prüfen</button></form><p id="case-feedback" role="status"></p></section>`;
}
function bindCase(l: Lesson) {
  const file = l.casework;
  $("#casework").addEventListener("submit", (e) => {
    e.preventDefault();
    const choices = file.steps.map((_, i) => {
      const checked = document.querySelector<HTMLInputElement>(`input[name="step-${i}"]:checked`);
      return checked ? Number(checked.value) : -1;
    });
    const results = checkCase(file, l.id, choices);
    results.forEach((correct, i) => {
      $(`#step-feedback-${i}`).textContent = correct
        ? `Richtig. ${file.steps[i].explanation}`
        : choices[i] === -1
          ? "Wähle eine Antwort."
          : "Noch nicht. Lies den Text und die Frage noch einmal.";
    });
    if (results.every(Boolean)) {
      const was = isComplete(p, l.id);
      addOnce(p.casework, l.id);
      afterProgress(l, was);
      $("#case-feedback").textContent = `Textfall gelöst. ${file.verdict}`;
    } else $("#case-feedback").textContent = "Mindestens ein Schritt stimmt noch nicht.";
  });
}

function roundFor(l: Lesson) {
  const key = keyOf(l.id, p.level);
  let r = rounds.get(key);
  if (!r) {
    r = createRound(p, l, p.level);
    rounds.set(key, r);
  }
  return r;
}
function practiceHtml(l: Lesson, number: string) {
  const practice = l.practice;
  if (!practice) return "";
  const r = roundFor(l);
  const key = keyOf(l.id, p.level);
  const items =
    r.kind === "commas"
      ? r.items.map((item, i) => commaItemHtml(item, "p", i, r.finished)).join("")
      : r.items.map((item, i) => chooseItemHtml(item, "p", i, `${key}:${p.serial[key] ?? 0}`, r.finished)).join("");
  const message = r.finished
    ? r.credited
      ? p.level === 1
        ? "Gezählt: Die Runde ist ohne Hilfe gelungen."
        : `Gelungen: Die Transferrunde stimmt. Sie ist freiwillig; für den Abschluss zählen ${REQUIRED_ROUNDS} Runden auf Niveau 1.`
      : "Lösung angesehen; diese Runde zählt nicht."
    : r.kind === "commas"
      ? "Setze in jedem Satz die Kommas. Eine Runde zählt, wenn alle drei Sätze stimmen."
      : "Wähle in jedem Satz die passende Möglichkeit. Eine Runde zählt, wenn alle drei Sätze stimmen.";
  return `<section class="panel" id="practice"><div class="eyebrow">${number} · Üben · Niveau ${p.level}</div><h2>${esc(practice.title)}</h2><p>${esc(practice.instruction)}</p><div id="practice-items">${items}</div><div class="actions"><button type="button" id="check-practice" ${r.finished ? "disabled" : ""}>Runde prüfen</button><button type="button" id="solution-button" class="quiet" ${r.finished ? "disabled" : ""}>Lösung ansehen</button><button type="button" id="new-round" class="quiet">Neue Runde</button></div><p id="practice-feedback" role="status">${esc(message)}</p></section>`;
}
/** What a learner has set in a round that is still open, so a redraw (a level switch) does not lose it. */
const openRoundState = new Map<string, { commas?: number[][]; choices?: number[] }>();
function rememberRound(r: Round) {
  if (r.finished) return;
  openRoundState.set(
    r.key,
    r.kind === "commas"
      ? { commas: r.items.map((_, i) => readCommas("p", i)) }
      : { choices: r.items.map((_, i) => readChoose("p", i)) },
  );
}
function restoreRound(r: Round) {
  const state = openRoundState.get(r.key);
  if (!state || r.finished) return;
  state.commas?.forEach((commas, i) => {
    setCommas("p", i, commas);
  });
  state.choices?.forEach((choice, i) => {
    if (choice >= 0) setChoose("p", i, choice);
  });
}

function bindPractice(l: Lesson) {
  const r = roundFor(l);
  bindGaps($("#practice-items"));
  restoreRound(r);
  if (r.finished) {
    // A finished round keeps showing its answers after a re-render.
    if (r.revealed || r.credited) showSolution(r);
  }
  $("#check-practice").addEventListener("click", () => {
    const correct =
      r.kind === "commas"
        ? r.items.map((item, i) => checkCommas(item, readCommas("p", i)))
        : r.items.map((item, i) => checkChoose(item, readChoose("p", i)));
    correct.forEach((ok, i) => {
      const el = document.querySelector(`#p-feedback-${i}`);
      if (!el) return;
      const item = r.items[i];
      el.textContent = ok ? `Richtig. ${item.feedback}` : "Noch nicht. Prüfe diesen Satz noch einmal.";
    });
    const was = isComplete(p, l.id);
    if (submitRound(p, r, correct)) {
      refreshPractice(l, "#new-round");
      afterProgress(l, was);
    } else $("#practice-feedback").textContent = "Noch nicht alle drei Sätze stimmen. Prüfe die Sätze mit „Noch nicht“ noch einmal.";
  });
  $("#solution-button").addEventListener("click", () => {
    revealRound(p, r);
    persist();
    refreshPractice(l, "#new-round");
  });
  $("#new-round").addEventListener("click", () => {
    skipRound(p, r);
    persist();
    rounds.delete(r.key);
    openRoundState.delete(r.key);
    refreshPractice(l, "#check-practice");
  });
}
/** Shows the right answers in a finished round. */
function showSolution(r: Round) {
  if (r.kind === "commas")
    r.items.forEach((item, i) => {
      setCommas("p", i, item.commas);
      const el = document.querySelector(`#p-feedback-${i}`);
      if (el) el.textContent = `${commaSentence(item)} ${item.feedback}`;
    });
  else
    r.items.forEach((item, i) => {
      setChoose("p", i, item.answer);
      const el = document.querySelector(`#p-feedback-${i}`);
      if (el) el.textContent = `${chooseSentence(item)} ${item.feedback}`;
    });
}
/** Draws the practice round again; `focus` names the button that gets the focus back, because the one pressed is gone. */
function refreshPractice(l: Lesson, focus?: string) {
  const number = $("#practice .eyebrow").textContent?.slice(0, 2) ?? "05";
  $("#practice").outerHTML = practiceHtml(l, number);
  bindPractice(l);
  if (focus) document.querySelector<HTMLButtonElement>(focus)?.focus();
}

function writingHtml(l: Lesson, number: string) {
  const task = l.tasks[p.level],
    key = keyOf(l.id, p.level),
    draft = p.drafts[key] ?? "";
  return `<section class="panel" id="writing"><div class="eyebrow">${number} · Schreiben · Niveau ${p.level}</div><h2>Schreibe es selbst</h2><p>${esc(task.prompt)}</p><details><summary>${p.level === 1 ? "Leitfragen" : "Hinweise"}</summary><ul>${task.hints.map((h) => `<li>${esc(h)}</li>`).join("")}</ul></details><label for="draft">Dein Text</label><textarea id="draft" maxlength="8000" rows="6" placeholder="Schreibe hier deinen Text …">${esc(draft)}</textarea><p class="small">Dein Text wird lokal gespeichert und nicht automatisch bewertet. Zum Vergleichen schreibst du mindestens einen Satz.</p><button id="compare-writing" ${looksLikeDraft(draft) ? "" : "disabled"}>Mit dem Beispiel vergleichen</button><div id="self-review" ${p.assessed.includes(key) ? "" : "hidden"}><div class="solution"><strong>Ein mögliches Beispiel</strong><p>${rich(task.model)}</p></div><p>Prüfe deinen eigenen Text an diesen Kriterien:</p>${task.criteria.map((criterion, i) => `<label class="criterion"><input type="checkbox" name="criterion" value="${i}" ${p.assessed.includes(key) ? "checked" : ""}> ${esc(criterion)}</label>`).join("")}<button id="accept-writing">Eigene Einschätzung speichern</button><p id="writing-feedback" role="status"></p></div></section>`;
}
/** Draws the writing task of the chosen level again, e.g. after the level changed. */
function refreshWriting(l: Lesson) {
  const section = $("#writing");
  section.outerHTML = writingHtml(l, section.querySelector(".eyebrow")?.textContent?.slice(0, 2) ?? "06");
  bindWriting(l);
}

function bindWriting(l: Lesson) {
  const key = keyOf(l.id, p.level);
  $("#draft").addEventListener("input", (e) => {
    const value = (e.target as HTMLTextAreaElement).value;
    dirtyDrafts.add(key);
    p.drafts[key] = value;
    p.assessed = p.assessed.filter((x) => x !== key);
    document.querySelectorAll<HTMLInputElement>('[name="criterion"]').forEach((x) => {
      x.checked = false;
    });
    $("#writing-feedback").textContent =
      "Text geändert. Prüfe deinen Text erneut an den Kriterien.";
    $<HTMLButtonElement>("#compare-writing").disabled = !looksLikeDraft(value);
    persist();
    updateEvidence();
  });
  $("#compare-writing").addEventListener("click", () => {
    $("#self-review").hidden = false;
  });
  $("#accept-writing").addEventListener("click", () => {
    const criteria = [...document.querySelectorAll<HTMLInputElement>('[name="criterion"]')].map(
      (x) => x.checked,
    );
    if (canAcceptSelfAssessment(p.drafts[key] ?? "", criteria)) {
      const was = isComplete(p, l.id);
      addOnce(p.assessed, key);
      afterProgress(l, was);
      $("#writing-feedback").textContent =
        "Deine eigene Einschätzung ist gespeichert. Das ist keine automatische fachliche Bewertung.";
    } else
      $("#writing-feedback").textContent =
        "Schreibe zuerst mindestens einen vollständigen Satz und prüfe alle drei Kriterien an deinem Text.";
  });
}

function footerHtml() {
  return `<details id="sources-note" class="panel"><summary>Quellen und Behalten mit ZAM</summary><h2>Wie du mit dieser App lernst</h2><p>Jede Lektion erklärt ein Thema, lässt dich an französischen Sätzen und Texten arbeiten und endet mit einer eigenen Schreibaufgabe. Die App prüft Markierungen, Zuordnungen und Auswahlen genau; deine Texte vergleichst du mit einem Beispiel und schätzt sie selbst ein. Hören und Sprechen kann sie nicht prüfen: Die Lektionen bereiten beides vor, und du übst es mit anderen oder mit Tonaufnahmen aus dem Unterricht.</p><h2>Mit ZAM behalten</h2><p>Die zugehörige Zelle hält das Gelernte mit Wiederholungskarten fest. Jede Karte führt direkt zur passenden Lektion.</p><p class="small">Die Anfrage an deinen ZAM-Agenten lautet: „${esc(zamEnrolRequest())}“</p><h2>Nachschlagen</h2><ul>${SOURCES.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`).join("")}</ul><p class="small">Französisch 9 gilt für die Realschule in der Wahlpflichtfächergruppe IIIa, in der Französisch zweite Fremdsprache ist. Keine externen Laufzeitanfragen, Konten oder Telemetrie. Stand: ${EDITORIAL_DATE}.</p></details>`;
}

// Another tab saved progress: take it over, without drawing this page anew.
window.addEventListener("storage", (event) => {
  if (event.key !== STORAGE_KEY) return;
  Object.assign(p, mergeProgress(parseProgress(event.newValue), p, dirtyDrafts));
  if (view === "map") render();
  else {
    syncDraft();
    updateEvidence();
  }
});

window.addEventListener("hashchange", () => {
  rounds.clear();
  openRoundState.clear();
  deepLink();
  persist();
  render();
});
render();
persist();
