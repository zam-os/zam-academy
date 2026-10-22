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
  type Attempt,
  createAttempt,
  revealAttempt,
  skipAttempt,
  submitAttempt,
} from "./exercises/attempt";
import { esc, fmt, rich, shuffle } from "./format";
import { bindLab, goalsOf, labHtml } from "./labs";
import type { Lesson } from "./model/types";
import {
  completion,
  goalKey,
  isComplete,
  keyOf,
  loadProgress,
  noteDocumented,
  saveProgress,
} from "./storage/progress";
import {
  canAcceptSelfAssessment,
  checkCase,
  checkWorkshop,
  initialOrder,
  moveEntry,
  shownOptions,
} from "./workshop";
import { parseTrainingDeepLink, zamEnrolRequest } from "./zam/zam-link";

const loaded = loadProgress();
const p = loaded.progress;
let persistent = loaded.persistent;
const attempts = new Map<string, Attempt>();
const orders = new Map<string, number[]>();
let view: "lesson" | "map" = "lesson";
/** On a narrow screen the lesson list sits behind a button and closes after a choice. */
let menuOpen = false;

const $ = <T extends Element = HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Bedienelement fehlt: ${selector}`);
  return element;
};
const app = $("#app");

function persist() {
  persistent = saveProgress(p);
  const warning = document.querySelector<HTMLElement>("#storage-warning");
  if (warning) warning.hidden = persistent;
}
function addOnce(list: string[], id: string) {
  if (!list.includes(id)) list.push(id);
}
const isFresh = () =>
  !p.quiz.length && !p.workshop.length && !p.casework.length && !p.goals.length && !p.assessed.length;

function deepLink() {
  const link = parseTrainingDeepLink(location.hash, location.search);
  if (link.lessonId && findLesson(link.lessonId)) {
    p.active = link.lessonId;
    view = "lesson";
  }
  if (link.level) p.level = link.level;
}
deepLink();
if (!location.hash && isFresh()) view = "map";

function navigate(id: string) {
  if (!findLesson(id)) return;
  p.active = id;
  view = "lesson";
  menuOpen = false;
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
const visibleLessons = (lesson: Lesson) =>
  LESSONS.filter((l) => !l.optional || p.extra || l.id === lesson.id);

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
  const visible = visibleLessons(lesson);
  const optionalStage = STAGES.find((s) => s.lb === 5);
  app.innerHTML = `<a class="skip-link" href="#lesson">Zum Lerninhalt</a>
    <header class="topbar"><a class="brand" href="../">ZAM <span>ACADEMY</span></a><span class="course-label">Bayern · Realschule · WPFG I und III</span><button id="menu-button" class="quiet menu-only" aria-controls="sidebar" aria-expanded="${menuOpen}">☰ Lernpfad ${c.done}/${c.total}</button><button id="map-button" class="quiet">🗺️ Lernlandkarte</button><button id="sources-button" class="quiet">Quellen & Praxis</button></header>
    <div class="shell"><aside id="sidebar" class="sidebar ${menuOpen ? "open" : ""}" aria-label="Lernpfad"><div class="sidebar-heading"><span class="eyebrow">Dein Lernpfad</span><h1>Wirtschaft <span>&amp;</span> Recht 9</h1><p>Verstehen. Abwägen. Fälle lösen.</p></div>
      <div class="progress-box"><div><strong id="progress-count">${c.done} / ${c.total}</strong><span>Kernlektionen</span></div><progress id="progress" max="${c.total}" value="${c.done}" aria-label="Abgeschlossene Kernlektionen"></progress></div>
      <label class="extra-switch"><input id="extra" type="checkbox" ${p.extra ? "checked" : ""}> ${optionalStage ? esc(optionalStage.title) : "Optional"} anzeigen</label>
      <nav>${STAGES.map((s) => {
        const entries = visible.filter((l) => l.lb === s.lb);
        if (!entries.length) return "";
        const d = stageDone(s.lb);
        return `<details class="stage" data-lb="${s.lb}" ${s.lb === lesson.lb ? "open" : ""}><summary><span class="stage-glyph" aria-hidden="true">${s.glyph}</span><span class="stage-name">${esc(s.title)}</span>${s.lb === 5 ? "" : `<span class="stage-count">${d.done}/${d.total}</span>`}</summary>${entries
          .map(
            (l) =>
              `<button class="lesson-link ${l.id === lesson.id && view === "lesson" ? "active" : ""}" data-lesson="${l.id}" ${l.id === lesson.id && view === "lesson" ? 'aria-current="step"' : ""}><span class="lesson-dot" aria-hidden="true">${isComplete(p, l.id) ? "✓" : "·"}</span>${esc(l.title)}</button>`,
          )
          .join("")}</details>`;
      }).join("")}</nav>
      <p class="small">${CORE_LESSONS.length} Kernlektionen${LESSONS.length > CORE_LESSONS.length ? ` · ${LESSONS.length - CORE_LESSONS.length} optional` : ""}<br>Ohne Anmeldung. Lokal gespeichert.</p></aside>
    <main id="lesson" tabindex="-1" data-lb="${view === "map" ? 0 : lesson.lb}"><div id="storage-warning" class="notice" ${persistent ? "hidden" : ""}>Dieser Browser erlaubt das Speichern gerade nicht. Du kannst weiterlernen; dein Fortschritt bleibt nur bis zum Schließen erhalten.</div>
    ${view === "map" ? mapHtml() : lessonHtml(lesson)}${footerHtml()}</main></div><div id="celebrate" class="celebrate" role="status" aria-live="polite"></div>`;
  document.querySelectorAll<HTMLButtonElement>("[data-lesson]").forEach((b) => {
    b.addEventListener("click", () => navigate(b.dataset.lesson ?? ""));
  });
  $("#extra").addEventListener("change", (e) => {
    p.extra = (e.target as HTMLInputElement).checked;
    persist();
    render();
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
    const d = $<HTMLDetailsElement>("#practice-note");
    d.open = true;
    d.scrollIntoView({ behavior: "smooth" });
  });
  bindNote();
  if (view === "map") return;
  $("#level").addEventListener("change", (e) => {
    p.level = (e.target as HTMLSelectElement).value === "2" ? 2 : 1;
    persist();
    render();
  });
  $("#next").addEventListener("click", () => {
    const index = visible.findIndex((l) => l.id === lesson.id);
    navigate(visible[(index + 1) % visible.length].id);
  });
  bindQuiz(lesson);
  bindWorkshop(lesson);
  bindCase(lesson);
  bindWriting(lesson);
  if (lesson.practice) bindPractice(lesson);
  if (lesson.lab) bindLab(lesson, p, () => afterProgress(lesson));
  updateEvidence();
}

/** Saves and, when a lesson or a whole Lernbereich just became complete, says so. */
function afterProgress(lesson: Lesson, wasComplete = false) {
  persist();
  const nowComplete = isComplete(p, lesson.id);
  updateEvidence();
  if (nowComplete && !wasComplete && !lesson.optional) {
    const d = stageDone(lesson.lb);
    celebrate(
      d.done === d.total
        ? `${stageOf(lesson.lb).glyph} Lernbereich „${stageOf(lesson.lb).title}“ geschafft!`
        : `✓ Lektion geschafft: ${lesson.title}`,
    );
  }
}

function mapHtml(): string {
  const c = completion(p);
  const cards = STAGES.filter((s) => s.lb !== 5 || p.extra)
    .map((s) => {
      const entries = LESSONS.filter((l) => l.lb === s.lb);
      const d = stageDone(s.lb);
      const percent = d.total ? Math.round((d.done / d.total) * 100) : 0;
      return `<section class="map-card" data-lb="${s.lb}"><div class="map-head"><span class="map-glyph" aria-hidden="true">${s.glyph}</span><div><h2>${esc(s.title)}</h2><p>${esc(s.subtitle)}</p></div>${s.lb === 5 ? "" : `<span class="ring" style="--pct:${percent}" role="img" aria-label="${percent} Prozent geschafft"><b>${d.done}/${d.total}</b></span>`}</div>
        <ul class="map-lessons">${entries.map((l) => `<li><button data-lesson="${l.id}" class="map-lesson ${isComplete(p, l.id) ? "done" : ""}"><span aria-hidden="true">${isComplete(p, l.id) ? "✓" : l.unit}</span>${esc(l.title)}</button></li>`).join("")}</ul></section>`;
    })
    .join("");
  const next = CORE_LESSONS.find((l) => !isComplete(p, l.id));
  return `<div class="hero"><span class="eyebrow">Lernlandkarte</span><h2>Dein Weg durch Wirtschaft und Recht</h2><p>Vier Lernbereiche, ${c.total} Kernlektionen. Jede Lektion verbindet eine Erklärung mit einem Schnellcheck, einem Sortierspiel, einem Fall und einer eigenen Begründung. ${c.done ? `Bisher geschafft: ${c.done}.` : "Starte, wo du willst."}</p>${next ? `<button class="primary" data-lesson="${next.id}">${c.done ? "Weiterlernen" : "Los geht’s"}: ${esc(next.title)} →</button>` : '<p class="notice">Alle Kernlektionen sind geschafft. Wiederhole mit ZAM, was du behalten willst.</p>'}</div><div class="map-grid">${cards}</div>`;
}

function lessonHtml(lesson: Lesson): string {
  const stage = stageOf(lesson.lb);
  let n = 0;
  const number = () => String(++n).padStart(2, "0");
  return `<div class="lesson-band"><span class="band-glyph" aria-hidden="true">${stage.glyph}</span><div><span class="eyebrow">${lesson.optional ? "Optional" : `Lernbereich ${lesson.lb}`} · ${esc(stage.title)}${lesson.unit ? ` · ${esc(lesson.unit)}` : ""}</span><h2 class="lesson-title">${esc(lesson.title)}</h2></div><label class="level-switch">Übungsniveau <select id="level"><option value="1" ${p.level === 1 ? "selected" : ""}>1 · Mit Leitfragen</option><option value="2" ${p.level === 2 ? "selected" : ""}>2 · Übertragen</option></select></label></div>
    <p class="lehrplan-tag">${(lesson.tracks ?? []).map((t) => `<span class="chip">Zweig ${t}</span>`).join("")}<span>${esc(lesson.lehrplan ?? "")}</span></p>
    <p class="intro">${esc(lesson.intro)}</p>${lesson.optional ? '<p class="notice">Diese optionale Lektion zählt nicht zu den Kernlektionen. Ein ZAM-Kartenlink öffnet sie auch bei ausgeblendetem Bereich.</p>' : ""}
    <div class="reading">${lesson.paragraphs.map((x) => `<p>${rich(x)}</p>`).join("")}</div>
    ${lesson.terms.length ? `<dl class="terms">${lesson.terms.map((t) => `<div><dt>${esc(t.term)}</dt><dd>${rich(t.text)}</dd></div>`).join("")}</dl>` : ""}
    ${(lesson.law ?? []).map((l) => `<aside class="law"><span class="law-tag">Im Gesetz</span><strong>${esc(l.ref)}</strong><p>${rich(l.text)}</p>${l.url ? `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">Gesetzestext öffnen ↗</a>` : ""}</aside>`).join("")}
    <div class="takeaway"><span>Zum Mitnehmen</span><p>${rich(lesson.takeaway)}</p></div>
    <div class="evidence" id="evidence"></div>
    ${quizHtml(lesson, number())}${lesson.lab ? labHtml(lesson, p, number()) : ""}${workshopHtml(lesson, number())}${caseHtml(lesson, number())}${lesson.practice ? practiceHtml(lesson, number()) : ""}${writingHtml(lesson, number())}
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
      )}</ul><p class="small">Lehrplan- und Quellenabgleich: ${EDITORIAL_DATE}. Alle Fälle, Namen und Zahlen sind eigens verfasste Lernbeispiele. Gesetzestexte werden sinngemäß wiedergegeben; maßgeblich ist der Gesetzestext selbst.</p></details>`;
}

function updateEvidence() {
  const l = findLesson(p.active) ?? LESSONS[0],
    key = keyOf(l.id, 1),
    c = completion(p);
  const goals = goalsOf(l);
  const reachedGoals = goals.filter((g) => p.goals.includes(goalKey(l.id, g.id))).length;
  const flags: Array<[string, boolean]> = [
    ["Schnellcheck", p.quiz.includes(l.id)],
    ...(l.lab ? ([[`Laboraufträge ${reachedGoals}/${goals.length}`, reachedGoals === goals.length]] as Array<[string, boolean]>) : []),
    ["Sortieren", p.workshop.includes(l.id)],
    ["Fall gelöst", p.casework.includes(l.id)],
    ...(l.practice
      ? ([[`Selbst gerechnet · Niveau 1: ${p.solved[key] ?? 0}/3`, (p.solved[key] ?? 0) >= 3]] as Array<[string, boolean]>)
      : []),
    ["Eigene Begründung", p.assessed.includes(key)],
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
    ? "Diese Lektion ist abgeschlossen. Zusätzliche Transferaufgaben auf Niveau 2 bleiben freiwillig."
    : `Für den Abschluss: ${["Schnellcheck", l.lab ? "alle Laboraufträge" : "", "Sortieren", "den Fall", l.practice ? "drei selbst gerechnete Aufgaben" : "", "eigene Begründung auf Niveau 1"].filter(Boolean).join(", ")}.`;
  document.querySelectorAll<HTMLButtonElement>("[data-lesson]").forEach((b) => {
    const dot = b.querySelector(".lesson-dot");
    if (dot) dot.textContent = isComplete(p, b.dataset.lesson ?? "") ? "✓" : "·";
  });
}

function quizHtml(l: Lesson, number: string) {
  const options = shuffle([l.quiz.answer, ...l.quiz.wrong], l.id);
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
    const right =
      shuffle([l.quiz.answer, ...l.quiz.wrong], l.id)[Number(checked.value)] === l.quiz.answer;
    if (right) {
      const was = isComplete(p, l.id);
      addOnce(p.quiz, l.id);
      afterProgress(l, was);
    }
    $("#quiz-feedback").textContent =
      `${right ? "Richtig." : "Prüfe noch einmal."} ${l.quiz.explanation}`;
  });
}

function workshopHtml(l: Lesson, number: string) {
  const w = l.workshop;
  const head = `<section class="panel"><div class="eyebrow">${number} · ${w.kind === "timeline" ? "Ordnen" : "Zuordnen"}</div><h2>${esc(w.title)}</h2><p>${esc(w.instruction)}</p>`;
  if (w.kind === "timeline") {
    const order = orders.get(l.id) ?? initialOrder(w, l.id);
    orders.set(l.id, order);
    return `${head}<ol class="order-list" id="workshop">${order
      .map(
        (entry, position) =>
          `<li class="order-item"><div class="order-row"><span>${esc(w.entries[entry].text)}</span><span class="order-buttons"><button type="button" class="quiet" data-move="${position}:-1" aria-label="Eintrag nach oben" ${position === 0 ? "disabled" : ""}>↑</button><button type="button" class="quiet" data-move="${position}:1" aria-label="Eintrag nach unten" ${position === order.length - 1 ? "disabled" : ""}>↓</button></span></div><p class="small" id="case-feedback-${position}"></p></li>`,
      )
      .join("")}</ol><button type="button" id="check-order">Reihenfolge prüfen</button><p id="workshop-feedback" role="status"></p></section>`;
  }
  return `${head}<form id="workshop">${shuffle(
    w.entries.map((entry, i) => ({ entry, i })),
    `${l.id}:cases`,
  )
    .map(
      ({ entry, i }) =>
        `<label class="work-entry"><span>${esc(entry.text)}</span><select name="case-${i}" aria-label="Zuordnung für Eintrag ${i + 1}"><option value="">Zuordnung wählen</option>${w.categories.map((cat, j) => `<option value="${j}">${esc(cat)}</option>`).join("")}</select></label><p class="small" id="case-feedback-${i}"></p>`,
    )
    .join("")}<button type="submit">Zuordnung prüfen</button></form><p id="workshop-feedback" role="status"></p></section>`;
}
function bindWorkshop(l: Lesson) {
  const w = l.workshop;
  const finish = (results: boolean[], feedbackFor: (i: number) => string) => {
    results.forEach((correct, i) => {
      const el = document.querySelector(`#case-feedback-${i}`);
      if (el) el.textContent = `${correct ? "Richtig." : "Noch einmal prüfen."} ${feedbackFor(i)}`;
    });
    if (results.every(Boolean)) {
      const was = isComplete(p, l.id);
      addOnce(p.workshop, l.id);
      afterProgress(l, was);
      $("#workshop-feedback").textContent = `Alles richtig. ${w.conclusion}`;
    } else
      $("#workshop-feedback").textContent =
        "Mindestens ein Eintrag fehlt oder passt noch nicht.";
  };
  if (w.kind === "timeline") {
    document.querySelectorAll<HTMLButtonElement>("[data-move]").forEach((b) => {
      b.addEventListener("click", () => {
        const [position, delta] = (b.dataset.move ?? "0:0").split(":").map(Number);
        orders.set(l.id, moveEntry(orders.get(l.id) ?? [], position, delta === 1 ? 1 : -1));
        const section = $("#workshop").closest("section");
        if (!section) return;
        section.outerHTML = workshopHtml(l, section.querySelector(".eyebrow")?.textContent?.slice(0, 2) ?? "02");
        bindWorkshop(l);
      });
    });
    $("#check-order").addEventListener("click", () => {
      const order = orders.get(l.id) ?? [];
      finish(checkWorkshop(w, order), (position) => w.entries[order[position]].feedback);
    });
    return;
  }
  $("#workshop").addEventListener("submit", (e) => {
    e.preventDefault();
    const choices = w.entries.map((_, i) => {
      const value = $<HTMLSelectElement>(`[name="case-${i}"]`).value;
      return value === "" ? -1 : Number(value);
    });
    finish(checkWorkshop(w, choices), (i) => w.entries[i].feedback);
  });
}

function caseHtml(l: Lesson, number: string) {
  const file = l.casework;
  return `<section class="panel case"><div class="eyebrow">${number} · Fall lösen</div><h2>${esc(file.title)}</h2><blockquote class="story">${rich(file.story)}</blockquote><form id="casework">${file.steps
    .map((step, i) => {
      const shown = shownOptions(file, i, l.id);
      return `<fieldset class="case-step"><legend><span class="step-no">${i + 1}</span> ${esc(step.question)}</legend>${shown.options.map((option, j) => `<label class="option"><input type="radio" name="step-${i}" value="${j}"> <span>${esc(option)}</span></label>`).join("")}<p class="small step-feedback" id="step-feedback-${i}"></p></fieldset>`;
    })
    .join("")}<button type="submit">Fall prüfen</button></form><p id="case-feedback" role="status"></p></section>`;
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
          : "Noch nicht. Lies Fall und Frage noch einmal.";
    });
    if (results.every(Boolean)) {
      const was = isComplete(p, l.id);
      addOnce(p.casework, l.id);
      afterProgress(l, was);
      $("#case-feedback").textContent = `Fall gelöst. ${file.verdict}`;
    } else $("#case-feedback").textContent = "Mindestens ein Schritt stimmt noch nicht.";
  });
}

function attemptFor(l: Lesson) {
  const key = keyOf(l.id, p.level);
  let a = attempts.get(key);
  if (!a) {
    a = createAttempt(p, l, p.level);
    attempts.set(key, a);
  }
  return a;
}
function practiceHtml(l: Lesson, number: string) {
  const a = attemptFor(l);
  const table = a.task.table
    ? `<div class="table-scroll"><table><thead><tr>${a.task.table.head.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${a.task.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${typeof cell === "number" ? fmt(cell) : esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
    : "";
  return `<section class="panel" id="practice"><div class="eyebrow">${number} · Rechnen · Niveau ${p.level}</div><h2>Deine Rechnung zählt</h2><p>${esc(a.task.prompt)}</p>${table}<form id="calculation"><div class="number-fields">${a.task.fields.map((f, i) => `<label>${esc(f.label)} (${esc(f.unit)})<input name="number-${i}" value="${esc(a.values[i] ?? "")}" inputmode="decimal" autocomplete="off" maxlength="60" required ${a.finished ? "disabled" : ""}></label>`).join("")}</div><div class="actions"><button type="submit" ${a.finished ? "disabled" : ""}>Rechnung prüfen</button><button type="button" id="solution-button" class="quiet" ${a.finished ? "disabled" : ""}>Lösung ansehen</button><button type="button" id="new-exercise" class="quiet">Neue Aufgabe</button></div></form><details><summary>Rechenhilfe</summary><p>${esc(a.task.hint)}</p></details><p id="calculation-feedback" role="status">${a.finished ? (a.credited ? (p.level === 1 ? "Selbst gelöst und gezählt." : "Transferaufgabe selbst gelöst und gespeichert. Für den Abschluss zählen drei Aufgaben auf Niveau 1.") : "Lösung angesehen; dieser Versuch zählt nicht als selbst gelöst.") : "Dezimalkomma und Dezimalpunkt sind möglich. Beträge werden auf Cent geprüft."}</p><p id="solution" class="solution" ${a.finished ? "" : "hidden"}>${esc(a.task.solution)}</p></section>`;
}
function bindPractice(l: Lesson) {
  const a = attemptFor(l);
  $("#calculation").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = $<HTMLFormElement>("#calculation");
    const values = a.task.fields.map(
      (_, i) => (form.elements.namedItem(`number-${i}`) as HTMLInputElement).value,
    );
    const was = isComplete(p, l.id);
    if (submitAttempt(p, a, values)) {
      refreshPractice(l);
      afterProgress(l, was);
    } else
      $("#calculation-feedback").textContent =
        "Noch nicht ganz richtig. Prüfe Rechenweg, Einheit und Rundung auf Cent.";
  });
  $("#solution-button").addEventListener("click", () => {
    revealAttempt(p, a);
    persist();
    refreshPractice(l);
  });
  $("#new-exercise").addEventListener("click", () => {
    skipAttempt(p, a);
    persist();
    attempts.delete(a.key);
    refreshPractice(l);
  });
}
function refreshPractice(l: Lesson) {
  const number = $("#practice .eyebrow").textContent?.slice(0, 2) ?? "05";
  $("#practice").outerHTML = practiceHtml(l, number);
  bindPractice(l);
}

function writingHtml(l: Lesson, number: string) {
  const task = l.tasks[p.level],
    key = keyOf(l.id, p.level),
    draft = p.drafts[key] ?? "";
  return `<section class="panel"><div class="eyebrow">${number} · Begründen · Niveau ${p.level}</div><h2>In deinen eigenen Worten</h2><p>${esc(task.prompt)}</p><details><summary>Leitfragen</summary><ul>${task.hints.map((h) => `<li>${esc(h)}</li>`).join("")}</ul></details><label for="draft">Deine Begründung</label><textarea id="draft" maxlength="8000" rows="5" placeholder="Erkläre den Zusammenhang und begründe dein Urteil …">${esc(draft)}</textarea><p class="small">Dein Text wird lokal gespeichert und nicht automatisch bewertet.</p><button id="compare-writing" ${draft.trim().length < 20 ? "disabled" : ""}>Mit dem Beispiel vergleichen</button><div id="self-review" ${p.assessed.includes(key) ? "" : "hidden"}><div class="solution"><strong>Ein mögliches Beispiel</strong><p>${rich(task.model)}</p></div><p>Prüfe deinen eigenen Text an diesen Kriterien:</p>${task.criteria.map((criterion, i) => `<label class="criterion"><input type="checkbox" name="criterion" value="${i}" ${p.assessed.includes(key) ? "checked" : ""}> ${esc(criterion)}</label>`).join("")}<button id="accept-writing">Eigene Einschätzung speichern</button><p id="writing-feedback" role="status"></p></div></section>`;
}
function bindWriting(l: Lesson) {
  const key = keyOf(l.id, p.level);
  $("#draft").addEventListener("input", (e) => {
    const value = (e.target as HTMLTextAreaElement).value;
    p.drafts[key] = value;
    p.assessed = p.assessed.filter((x) => x !== key);
    document.querySelectorAll<HTMLInputElement>('[name="criterion"]').forEach((x) => {
      x.checked = false;
    });
    $("#writing-feedback").textContent =
      "Text geändert. Prüfe deine Begründung erneut an den Kriterien.";
    $<HTMLButtonElement>("#compare-writing").disabled = value.trim().length < 20;
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
        "Schreibe zuerst mindestens einen erklärenden Satz und prüfe alle drei Kriterien an deinem Text.";
  });
}

function footerHtml() {
  const note = p.note;
  return `<details id="practice-note" class="panel"><summary>Quellen, Praxis und Behalten mit ZAM</summary><h2>Eine echte Praxismaßnahme</h2><p>Der Lehrplan sieht in dieser Jahrgangsstufe eine praxisorientierte Maßnahme vor, zum Beispiel ein Experteninterview oder einen Gerichtsbesuch. Vereinbare sie mit deiner Lehrkraft. Fälle und Modelle dieser App ersetzen die Durchführung nicht.</p><p>Notiere eine eigene Frage, die Quelle oder Ansprechperson, Beobachtungen und ein begründetes Ergebnis. Trage keine personenbezogenen oder vertraulichen Angaben ein. Die App prüft nur ausgefüllte Felder und deine eigene Angabe.</p>${(
    [
      ["question", "Meine Frage"],
      ["source", "Quelle, Datum oder Gesprächskontext"],
      ["observation", "Meine Beobachtungen"],
      ["conclusion", "Mein begründetes Ergebnis"],
    ] as const
  )
    .map(
      ([key, label]) =>
        `<label>${label}<textarea data-note="${key}" rows="2" maxlength="4000">${esc(note[key])}</textarea></label>`,
    )
    .join(
      "",
    )}<label class="criterion"><input id="performed" type="checkbox" ${note.performed ? "checked" : ""}> Ich habe die Maßnahme selbst durchgeführt.</label><p id="note-status" role="status"></p><h2>Mit ZAM behalten</h2><p>Die zugehörige Zelle hält das Gelernte mit Wiederholungskarten fest. Jede Karte führt direkt zur passenden Lektion.</p><p class="small">Die Anfrage an deinen ZAM-Agenten lautet: „${esc(zamEnrolRequest())}“</p><h2>Nachschlagen</h2><ul>${SOURCES.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`).join("")}</ul><p class="small">Wirtschaft und Recht 9 gilt für die Wahlpflichtfächergruppen I und III; Gruppe II lernt in Klasse 9 BwR. Keine externen Laufzeitanfragen, Konten oder Telemetrie. Stand: ${EDITORIAL_DATE}. Dies ist eine Lernhilfe und keine Rechtsberatung.</p></details>`;
}
function bindNote() {
  const update = () => {
    $("#note-status").textContent = noteDocumented(p.note)
      ? "Praxisnotiz vollständig dokumentiert und von dir als durchgeführt angegeben. Die Durchführung wurde nicht unabhängig geprüft."
      : "Praxisnotiz noch unvollständig oder Durchführung noch nicht angegeben. Dieser Status ist vom Lektionsfortschritt getrennt.";
  };
  document.querySelectorAll<HTMLTextAreaElement>("[data-note]").forEach((x) => {
    x.addEventListener("input", () => {
      const key = x.dataset.note as "question" | "source" | "observation" | "conclusion";
      p.note[key] = x.value;
      persist();
      update();
    });
  });
  $("#performed").addEventListener("change", (e) => {
    p.note.performed = (e.target as HTMLInputElement).checked;
    persist();
    update();
  });
  update();
}

window.addEventListener("hashchange", () => {
  deepLink();
  persist();
  render();
});
render();
persist();
