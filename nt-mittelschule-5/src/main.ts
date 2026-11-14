import {
  CURRICULUM_URL,
  findLesson,
  LESSONS,
  SOURCES,
  STAGES,
} from "./curriculum";
import { renderQuizFeedback, renderWorkshopFeedback } from "./feedback";
import { renderFigure } from "./figures";
import { freshLab, type LabState, mountLab, renderLab } from "./labs";
import type { Lesson, Level } from "./model/types";
import {
  completion,
  confirmWriting,
  invalidateWriting,
  recordQuizAnswer,
  recordWorkshopAnswer,
  updateDraft,
  freshProgress,
  isComplete,
  loadProgress,
  saveProgress,
  writingKey,
} from "./storage/progress";
import { showToast } from "./ui/toast";
import {
  canAcceptSelfAssessment,
  canReviewDraft,
  checkWorkshop,
  esc,
  initialOrder,
  moveEntry,
  shuffle,
} from "./workshop";
import { parseTrainingDeepLink, zamEnrolRequest } from "./zam/zam-link";

let progress = loadProgress();
let view: "path" | "lesson" | "reference" = "path";
const main = document.querySelector<HTMLElement>("#main")!;
const orders = new Map<string, number[]>();
const assignments = new Map<string, number[]>();
const workshopFeedback = new Set<string>();
const quizSelections = new Map<string, number>();
const comparisons = new Map<string, string>();
const rubricChecks = new Map<string, boolean[]>();
const labStates = new Map<string, LabState>();
const labStateFor = (id: string): LabState => {
  let state = labStates.get(id);
  if (!state) {
    state = freshLab();
    labStates.set(id, state);
  }
  return state;
};
let storageWarningShown = false;

function pageUrl(fragment = ""): string {
  const params = new URLSearchParams(location.search);
  params.delete("lesson");
  params.delete("level");
  const search = params.toString();
  return `${location.pathname}${search ? `?${search}` : ""}${fragment}`;
}

function switchView(next: typeof view): void {
  view = next;
  const fragment =
    next === "lesson"
      ? `#lesson=${progress.activeLessonId}&level=${progress.level}`
      : next === "reference"
        ? "#view=reference"
        : "";
  history.pushState(null, "", pageUrl(fragment));
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
  main.focus({ preventScroll: true });
}

async function persist(): Promise<void> {
  const active = progress;
  const saved = await saveProgress(active);
  if (active !== progress) return;
  if (!saved) {
    document.getElementById("storage-note")!.textContent =
      "Speichern ist in diesem Browser gerade nicht möglich. Dein Fortschritt bleibt nur bis zum Schließen der Seite erhalten.";
    if (!storageWarningShown)
      showToast(
        "Fortschritt kann gerade nur für diese Sitzung behalten werden.",
        "warning",
      );
    storageWarningShown = true;
  }
  // The asynchronous merge may have adopted another tab's newer draft.
  if (view === "path") render();
  const draft = main.querySelector<HTMLTextAreaElement>("#draft");
  if (view === "lesson" && draft) {
    const key = writingKey(progress.activeLessonId, progress.level);
    const current = progress.drafts[key] ?? "";
    if (draft.value !== current) {
      draft.value = current;
      comparisons.delete(key);
      rubricChecks.delete(key);
      main.querySelector(".model-answer")?.remove();
      (main.querySelector("#compare") as HTMLButtonElement).disabled =
        !canReviewDraft(current);
      main.querySelector("#draft-note")!.textContent =
        "Der Entwurf wurde in einem anderen Tab geändert. Bitte erneut vergleichen.";
    }
    main.querySelector("#writing-done")!.textContent =
      progress.writingDone.includes(key) ? "✓ Selbst eingeschätzt" : "";
    main.querySelector("#aside-writing")!.textContent =
      progress.writingDone.includes(writingKey(progress.activeLessonId, 1))
        ? "✓ Level 1 selbst eingeschätzt"
        : "○ Level 1 selbst eingeschätzt";
  }
  const stats = completion(progress);
  document.getElementById("progress-label")!.textContent =
    `${stats.completed} / ${stats.total} Lektionen`;
  (document.getElementById("progress") as HTMLProgressElement).value =
    stats.percent;
}

function openLesson(id: string): void {
  const lesson = findLesson(id);
  if (!lesson) return;
  progress.activeLessonId = id;
  view = "lesson";
  history.pushState(null, "", `#lesson=${encodeURIComponent(id)}`);
  void persist();
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
  main.focus({ preventScroll: true });
}

function status(lesson: Lesson): string {
  if (isComplete(progress, lesson.id)) return "Abgeschlossen";
  if (
    progress.quizDone.includes(lesson.id) ||
    progress.workshopDone.includes(lesson.id) ||
    progress.drafts[writingKey(lesson.id, 1)]
  )
    return "Begonnen";
  return "Starten";
}

function renderPath(): string {
  const stats = completion(progress);
  return `<section class="hero"><div><span class="eyebrow">MITTELSCHULE · JAHRGANGSSTUFE 5</span><h1>Beobachten.<br>Zusammenhänge prüfen.<br>Natur verstehen.</h1><p>Vom sicheren Forschen über Sonne, Wärme, Haut, Licht und Auge bis zu deinen Organsystemen, deiner Ernährung, deinem Skelett und der Trennung von Stoffen: Entdecke Modelle, ordne Abläufe und begründe deine Antwort.</p><button type="button" class="button accent" data-open="${esc(progress.activeLessonId)}">${stats.completed ? "Weiterlernen" : "Loslegen"}</button><div class="hero-strip" aria-hidden="true">${STAGES.map((stage) => `<span data-lb="${stage.lb}">${stage.icon} ${esc(stage.shortTitle)}</span>`).join("")}</div></div><aside class="hero-note"><span class="eyebrow">SO LERNST DU HIER</span><strong>Verstehen → Prüfen → Begründen</strong><p>${LESSONS.length} Lektionen · vier Lernbereiche<br>Interaktive Modelle und Zeichnungen in der App</p><p class="small">Eine Lektion ist geschafft, wenn du den Schnellcheck richtig hast, die Werkstatt löst und deine eigene Antwort auf Level 1 mit der Musterantwort vergleichst. Level 2 ist eine Transferaufgabe zum Weiterdenken.</p></aside></section>
  <div class="path-heading"><div><h2>Dein Lernpfad</h2><p>Jede Lektion ist frei zugänglich. Du kannst jederzeit zurückspringen.</p></div></div>
  <div class="stages">${STAGES.map((stage) => {
      const lessons = LESSONS.filter((lesson) => lesson.lb === stage.lb);
      const complete = lessons.filter((lesson) =>
        isComplete(progress, lesson.id),
      ).length;
      return `<section class="stage" data-lb="${stage.lb}"><div class="stage-header"><span class="stage-icon" aria-hidden="true">${stage.icon}</span><div><span class="eyebrow">LERNBEREICH ${stage.lb}</span><h3>${esc(stage.shortTitle)}</h3></div><span class="stage-count">${complete} / ${lessons.length}</span></div><ol>${lessons.map((lesson) => `<li><button type="button" class="lesson-link ${isComplete(progress, lesson.id) ? "complete" : ""}" data-open="${lesson.id}"><span class="lesson-dot" aria-hidden="true">${isComplete(progress, lesson.id) ? "✓" : "·"}</span><span><strong>${esc(lesson.title)}</strong><small>${esc(lesson.period)}</small></span><span class="lesson-status">${status(lesson)}</span></button></li>`).join("")}</ol></section>`;
    })
    .join(
      "",
    )}</div><aside class="notice"><strong>Manches geht nur im Fachraum und im Alltag</strong><p>Die App bereitet vor und erklärt Zusammenhänge. Eigene Schülerversuche mit echten Laborgeräten, Sicherheitsunterweisungen am Experimentiertisch, die Einschätzung deines Alltags und das richtige Heben gehören in den Unterricht und in dein echtes Leben. Jede Lektion zeigt dir, was dazugehört.</p><a href="${CURRICULUM_URL}" target="_blank" rel="noopener">Zum offiziellen Lehrplan</a></aside><button type="button" id="reset" class="text-button">Lokalen Fortschritt zurücksetzen</button>`;
}

function renderWorkshop(lesson: Lesson): string {
  const work = lesson.workshop;
  let order = orders.get(lesson.id);
  if (!order) {
    order = initialOrder(work, lesson.id);
    orders.set(lesson.id, order);
  }
  const answer =
    work.kind === "timeline"
      ? order
      : (assignments.get(lesson.id) ?? work.entries.map(() => -1));
  const feedback = workshopFeedback.has(lesson.id);
  return `<section class="panel workshop" aria-labelledby="workshop-heading"><div class="panel-heading"><span class="eyebrow">02 · WERKSTATT</span><span class="done-mark">${progress.workshopDone.includes(lesson.id) ? "✓ Einmal gelöst" : ""}</span></div><h2 id="workshop-heading">${esc(work.title)}</h2><p>${esc(work.instruction)}</p>
  ${work.material ? `<div class="document"><span class="small">${esc(work.materialLabel ?? "Darstellungstext für diese Übung")}</span><p>${esc(work.material)}</p></div>` : ""}
  ${work.kind === "timeline" ? `<ol class="timeline">${order.map((entryIndex, position) => `<li><span class="position">${position + 1}</span><span class="event-text">${esc(work.entries[entryIndex].text)}</span><div class="move-buttons"><button type="button" data-move="${position}" data-delta="-1" aria-label="${esc(work.entries[entryIndex].text)} nach oben" ${position === 0 ? "disabled" : ""}>↑</button><button type="button" data-move="${position}" data-delta="1" aria-label="${esc(work.entries[entryIndex].text)} nach unten" ${position === order.length - 1 ? "disabled" : ""}>↓</button></div></li>`).join("")}</ol>` : work.categories.length <= 4 ? `<div class="classification">${work.entries.map((entry, index) => `<div class="entry" role="group" aria-label="${esc(entry.text)}"><span>${esc(entry.text)}</span><div class="chip-row">${work.categories.map((category, value) => `<button type="button" class="chip cat-${value}" data-assign="${index}" data-value="${value}" aria-pressed="${answer[index] === value}">${esc(category)}</button>`).join("")}</div></div>`).join("")}</div>` : `<div class="classification">${work.entries.map((entry, index) => `<label><span>${esc(entry.text)}</span><select data-assign="${index}"><option value="-1">Bitte zuordnen</option>${work.categories.map((category, value) => `<option value="${value}" ${answer[index] === value ? "selected" : ""}>${esc(category)}</option>`).join("")}</select></label>`).join("")}</div>`}
  <button type="button" id="check-workshop" class="button secondary">Zuordnung prüfen</button>
  ${feedback ? renderWorkshopFeedback(work, answer) : ""}</section>`;
}

function renderWriting(lesson: Lesson): string {
  const key = writingKey(lesson.id, progress.level);
  const task = lesson.tasks[progress.level];
  const draft = progress.drafts[key] ?? "";
  const comparing = comparisons.get(key) === draft;
  const checks = rubricChecks.get(key) ?? [false, false, false];
  return `<section class="panel writing" aria-labelledby="writing-heading"><div class="panel-heading"><span class="eyebrow">03 · SELBST BEGRÜNDEN</span><span class="done-mark" id="writing-done">${progress.writingDone.includes(key) ? "✓ Selbst eingeschätzt" : ""}</span></div><h2 id="writing-heading">${progress.level === 1 ? "Mit Leitfragen arbeiten" : "Auf einen neuen Fall übertragen"}</h2><p class="task-prompt">${esc(task.prompt)}</p>
  ${progress.level === 1 ? `<details><summary>Leitfragen anzeigen</summary><ul>${task.hints.map((hint) => `<li>${esc(hint)}</li>`).join("")}</ul></details>` : `<p class="small">Formuliere erst deinen eigenen Gedankengang. Die Vergleichsantwort folgt danach.</p>`}
  <label class="answer-label" for="draft">Deine Antwort</label><textarea id="draft" rows="5" maxlength="8000" placeholder="Schreibe zwei bis vier begründete Sätze …">${esc(draft)}</textarea><p class="small">Dein Text bleibt in diesem Browser. Er wird nicht automatisch bewertet.</p><button type="button" id="compare" class="button secondary" ${canReviewDraft(draft) ? "" : "disabled"}>Mit einer möglichen Antwort vergleichen</button><span class="small" id="draft-note">${canReviewDraft(draft) ? "" : "Schreibe zunächst mindestens 20 Zeichen."}</span>
  ${comparing ? `<div class="model-answer"><h3>Eine mögliche Antwort</h3><p>${esc(task.model)}</p><p>Andere Formulierungen und begründete Urteile sind möglich. Vergleiche deinen Text anhand dieser Kriterien:</p><div class="rubric">${task.criteria.map((criterion, i) => `<label><input type="checkbox" data-rubric="${i}" ${checks[i] ? "checked" : ""}>${esc(criterion)}</label>`).join("")}</div><div class="self-actions"><button type="button" class="button accent" id="accept-writing" ${canAcceptSelfAssessment(draft, checks) ? "" : "disabled"}>Meine Antwort erfüllt die Kriterien</button><button type="button" class="text-button" id="revise-writing">Ich überarbeite noch</button></div><p class="small">Diese Einschätzung gibst du selbst ab. Sie ist keine automatische Prüfung und verändert keine ZAM-Karten.</p></div>` : ""}</section>`;
}

function renderLesson(): string {
  const lesson = findLesson(progress.activeLessonId)!;
  const stage = STAGES.find((entry) => entry.lb === lesson.lb)!;
  const options = shuffle([0, 1, 2], `${lesson.id}:quiz`);
  const labels = [lesson.quiz.answer, ...lesson.quiz.wrong];
  const selected = quizSelections.get(lesson.id);
  const visible = LESSONS;
  const index = visible.indexOf(lesson);
  return `<article lang="de" data-lb="${lesson.lb}"><div class="lesson-top"><button type="button" class="text-button" data-view="path">← Zum Lernpfad</button><label class="level-select">Arbeitsweise <select id="level"><option value="1" ${progress.level === 1 ? "selected" : ""}>Level 1 · mit Leitfragen</option><option value="2" ${progress.level === 2 ? "selected" : ""}>Level 2 · Transfer</option></select></label></div>
  <header class="lesson-heading"><span class="eyebrow">${stage.icon} LERNBEREICH ${stage.lb} · ${esc(stage.shortTitle)}</span><h1>${esc(lesson.title)}</h1><p class="period">${esc(lesson.period)}</p><p class="intro">${esc(lesson.intro)}</p>${lesson.review ? `<p class="review-note">↺ ${esc(lesson.review)}</p>` : ""}</header>
  <div class="lesson-columns"><div class="lesson-content"><section class="panel reading"><span class="eyebrow">01 · VERSTEHEN</span><p>${esc(lesson.paragraphs[0])}</p>${lesson.lab ? renderLab(lesson.lab, labStateFor(lesson.id)) : ""}${lesson.figures.map(renderFigure).join("")}${lesson.paragraphs
    .slice(1)
    .map((paragraph) => `<p>${esc(paragraph)}</p>`)
    .join("")}<p class="takeaway"><strong>Merke</strong>${esc(lesson.takeaway)}</p></section>
  <section class="panel quiz"><div class="panel-heading"><h2>Schnellcheck</h2><span class="done-mark">${progress.quizDone.includes(lesson.id) ? "✓ Einmal richtig" : ""}</span></div><p>${esc(lesson.quiz.question)}</p><div class="quiz-options">${options.map((i) => `<button type="button" data-choice="${i}" class="quiz-choice ${selected === i ? "selected" : ""}" aria-pressed="${selected === i}">${esc(labels[i])}</button>`).join("")}</div>${renderQuizFeedback(lesson.quiz, selected)}</section>
  ${renderWorkshop(lesson)}${renderWriting(lesson)}</div><aside class="lesson-aside"><section class="aside-card"><h2>Dein Lernschritt</h2><ul class="checklist"><li>${progress.quizDone.includes(lesson.id) ? "✓" : "○"} Schnellcheck</li><li>${progress.workshopDone.includes(lesson.id) ? "✓" : "○"} Werkstatt gelöst</li><li id="aside-writing">${progress.writingDone.includes(writingKey(lesson.id, 1)) ? "✓" : "○"} Level 1 selbst eingeschätzt</li></ul><p class="small">Level 2 ist eine zusätzliche Vertiefung. Die Kernfortschritte zählen Level 1.</p></section><section class="aside-card"><h2>Belege & weiterlernen</h2><ul class="source-list">${lesson.sourceIds
    .map((id) => SOURCES.find((source) => source.id === id)!)
    .map(
      (source) =>
        `<li><a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)} ↗</a></li>`,
    )
    .join(
      "",
    )}</ul><p class="small">Die Erklärungen und Übungssätze sind eigens verfasste Darstellungen. Originalquellen sind ausdrücklich gekennzeichnet.</p></section><section class="aside-card"><h2>Damit es bleibt</h2><p class="small">ZAM hält das Wissen mit kurzen Wiederholungen fest. Jede Karte führt hierher zurück.</p><button type="button" class="button secondary" data-zam>In ZAM festigen</button></section></aside></div>
  <nav class="lesson-navigation" aria-label="Lektionen">${index > 0 ? `<button type="button" data-open="${visible[index - 1].id}" class="button secondary">← Vorherige Lektion</button>` : "<span></span>"}${index >= 0 && index < visible.length - 1 ? `<button type="button" data-open="${visible[index + 1].id}" class="button accent">Nächste Lektion →</button>` : `<button type="button" data-view="path" class="button accent">Zum Lernpfad</button>`}</nav></article>`;
}

function renderReference(): string {
  return `<section class="reference"><span class="eyebrow">NACHSCHLAGEN</span><h1>Orientierung behalten</h1><p>Die Merksätze helfen beim Wiederholen. Für Modelle, Übersichten und Aufgaben öffnest du die jeweilige Lektion.</p>${STAGES.map(
    (stage) =>
      `<section class="panel" data-lb="${stage.lb}"><h2>${stage.icon} ${esc(stage.shortTitle)}</h2><dl>${LESSONS.filter(
        (lesson) => lesson.lb === stage.lb,
      )
        .map(
          (lesson) =>
            `<dt><button type="button" data-open="${lesson.id}" class="text-button">${esc(lesson.title)}</button></dt><dd>${esc(lesson.takeaway)}</dd>`,
        )
        .join("")}</dl></section>`,
  ).join(
    "",
  )}<section class="panel"><h2>Quellenbasis</h2><p>Lehrplanabgleich und Quellenprüfung: 14. November 2026. Verlinkte Angebote öffnen erst, wenn du darauf klickst. Die App selbst benötigt keine externe Verbindung; alle Grafiken und Modelle sind in der App gespeichert.</p><ul class="source-list">${SOURCES.map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)}</a></li>`).join("")}</ul></section></section>`;
}

function render(): void {
  main.innerHTML =
    view === "path"
      ? renderPath()
      : view === "lesson"
        ? renderLesson()
        : renderReference();
  document
    .querySelectorAll<HTMLButtonElement>("header nav [data-view]")
    .forEach((button) => {
      button.setAttribute(
        "aria-current",
        button.dataset.view === view ? "page" : "false",
      );
    });
  main.querySelectorAll<HTMLButtonElement>("[data-open]").forEach((button) => {
    button.addEventListener("click", () => openLesson(button.dataset.open!));
  });
  main.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      switchView(button.dataset.view as typeof view);
    });
  });
  main.querySelector("#reset")?.addEventListener("click", showReset);
  if (view === "lesson") bindLesson(findLesson(progress.activeLessonId)!);
}

function bindLesson(lesson: Lesson): void {
  const labHost = main.querySelector<HTMLElement>("[data-lab]");
  if (lesson.lab && labHost) mountLab(labHost, lesson.lab, labStateFor(lesson.id));
  const level = progress.level;
  const key = writingKey(lesson.id, level);
  const work = lesson.workshop;
  main.querySelector("#level")?.addEventListener("change", (event) => {
    progress.level = Number((event.target as HTMLSelectElement).value) as Level;
    history.replaceState(
      null,
      "",
      pageUrl(`#lesson=${lesson.id}&level=${progress.level}`),
    );
    void persist();
    render();
    main
      .querySelector<HTMLSelectElement>("#level")
      ?.focus({ preventScroll: true });
  });
  main
    .querySelectorAll<HTMLButtonElement>("[data-choice]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const choice = Number(button.dataset.choice);
        quizSelections.set(lesson.id, choice);
        if (choice === 0) recordQuizAnswer(progress, lesson.id, true);
        void persist();
        render();
        main
          .querySelector<HTMLButtonElement>(`[data-choice="${choice}"]`)
          ?.focus({ preventScroll: true });
      });
    });
  main.querySelectorAll<HTMLButtonElement>("[data-move]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.move),
        delta = Number(button.dataset.delta) as -1 | 1;
      orders.set(lesson.id, moveEntry(orders.get(lesson.id)!, index, delta));
      workshopFeedback.delete(lesson.id);
      render();
      main
        .querySelector<HTMLButtonElement>(
          `[data-move="${index + delta}"][data-delta="${-delta}"]`,
        )
        ?.focus({ preventScroll: true });
    });
  });
  main
    .querySelectorAll<HTMLButtonElement>("button[data-assign]")
    .forEach((chip) => {
      chip.addEventListener("click", () => {
        const answer = assignments.get(lesson.id) ?? work.entries.map(() => -1);
        const entry = Number(chip.dataset.assign);
        answer[entry] = Number(chip.dataset.value);
        assignments.set(lesson.id, answer);
        workshopFeedback.delete(lesson.id);
        render();
        main
          .querySelector<HTMLButtonElement>(
            `button[data-assign="${entry}"][data-value="${chip.dataset.value}"]`,
          )
          ?.focus({ preventScroll: true });
      });
    });
  main
    .querySelectorAll<HTMLSelectElement>("select[data-assign]")
    .forEach((select) => {
      select.addEventListener("change", () => {
        const answer = assignments.get(lesson.id) ?? work.entries.map(() => -1);
        answer[Number(select.dataset.assign)] = Number(select.value);
        assignments.set(lesson.id, answer);
        workshopFeedback.delete(lesson.id);
        main.querySelector(".workshop .feedback")?.remove();
      });
    });
  main.querySelector("#check-workshop")?.addEventListener("click", () => {
    const answer =
      work.kind === "timeline"
        ? orders.get(lesson.id)!
        : (assignments.get(lesson.id) ?? []);
    if (checkWorkshop(work, answer).every(Boolean))
      recordWorkshopAnswer(progress, lesson.id, true);
    workshopFeedback.add(lesson.id);
    void persist();
    render();
  });
  main.querySelector("#draft")?.addEventListener("input", (event) => {
    const text = (event.target as HTMLTextAreaElement).value;
    updateDraft(progress, lesson.id, level, text);
    rubricChecks.delete(key);
    comparisons.delete(key);
    main.querySelector(".model-answer")?.remove();
    (main.querySelector("#compare") as HTMLButtonElement).disabled =
      !canReviewDraft(text);
    main.querySelector("#draft-note")!.textContent = canReviewDraft(text)
      ? ""
      : "Schreibe zunächst mindestens 20 Zeichen.";
    main.querySelector("#writing-done")!.textContent = "";
    if (progress.level === 1)
      main.querySelector("#aside-writing")!.textContent =
        "○ Level 1 selbst eingeschätzt";
    void persist();
  });
  main.querySelector("#compare")?.addEventListener("click", () => {
    if (!canReviewDraft(progress.drafts[key] ?? "")) return;
    comparisons.set(key, progress.drafts[key] ?? "");
    render();
    main.querySelector(".model-answer")?.scrollIntoView({
      block: "nearest",
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  });
  main
    .querySelectorAll<HTMLInputElement>("[data-rubric]")
    .forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const checks = rubricChecks.get(key) ?? [false, false, false];
        checks[Number(checkbox.dataset.rubric)] = checkbox.checked;
        rubricChecks.set(key, checks);
        (main.querySelector("#accept-writing") as HTMLButtonElement).disabled =
          !canAcceptSelfAssessment(progress.drafts[key] ?? "", checks);
      });
    });
  main.querySelector("#accept-writing")?.addEventListener("click", () => {
    if (
      !comparisons.has(key) ||
      !canAcceptSelfAssessment(
        progress.drafts[key] ?? "",
        rubricChecks.get(key) ?? [],
      )
    )
      return;
    if (
      !confirmWriting(progress, lesson.id, level, comparisons.get(key) ?? "")
    ) {
      comparisons.delete(key);
      rubricChecks.delete(key);
      render();
      showToast(
        "Der Entwurf wurde geändert. Bitte erneut vergleichen.",
        "info",
      );
      return;
    }
    void persist();
    render();
    showToast(
      isComplete(progress, lesson.id)
        ? "Lektion abgeschlossen. Du kannst weiterlernen oder Level 2 vertiefen."
        : "Deine Selbsteinschätzung wurde gespeichert.",
      "info",
    );
  });
  main.querySelector("#revise-writing")?.addEventListener("click", () => {
    comparisons.delete(key);
    rubricChecks.delete(key);
    invalidateWriting(progress, lesson.id, level);
    void persist();
    render();
    main.querySelector<HTMLTextAreaElement>("#draft")?.focus();
  });
  main.querySelectorAll("[data-zam]").forEach((button) => {
    button.addEventListener("click", showZam);
  });
}

function dialog(title: string, body: string): HTMLDialogElement {
  document.querySelector("dialog")?.remove();
  const element = document.createElement("dialog");
  element.innerHTML = `<div class="dialog-heading"><h2>${esc(title)}</h2><button type="button" class="icon-button" data-close aria-label="Schließen">×</button></div>${body}`;
  document.body.append(element);
  element.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => element.close());
  });
  element.addEventListener("close", () => element.remove(), { once: true });
  element.showModal();
  return element;
}

function showZam(): void {
  const request = zamEnrolRequest();
  const element = dialog(
    "Natur und Technik 5 mit ZAM behalten",
    `<p>Hier erarbeitest du Zusammenhänge. ZAM erinnert dich später mit kurzen Fragen daran. Jede Karte führt zur passenden Lektion zurück. Die Zelle enthält ${LESSONS.length * 2} Karten, zwei zu jeder Lektion.</p><p>Die Karten bekommst du über den Academy-Katalog in ZAM Desktop. Suche unter „Aus der ZAM Academy“ nach „Natur und Technik 5 Mittelschule (ZAM Academy)“. Ist das Paket noch nicht gelistet, kannst du bis zur Veröffentlichung hier weiterlernen.</p><p>Du kannst deinem Agenten auch sagen:</p><div class="request"><code>${esc(request)}</code><button type="button" class="button secondary" id="copy">Kopieren</button></div><p class="small" id="copy-status" role="status">Dein App-Fortschritt und deine Texte werden dabei nicht übertragen.</p><button type="button" class="button accent" data-close>Weiterlernen</button>`,
  );
  element.querySelector("#copy")!.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(request);
      element.querySelector("#copy-status")!.textContent = "Kopiert.";
    } catch {
      element.querySelector("#copy-status")!.textContent =
        "Bitte markiere und kopiere den Satz selbst.";
    }
  });
}

function showReset(): void {
  const element = dialog(
    "Fortschritt zurücksetzen?",
    `<p>Die Schnellchecks, Werkstattabschlüsse, Selbsteinschätzungen und eigenen Texte dieser App werden gelöscht. Das lässt sich nicht rückgängig machen.</p><div class="self-actions"><button type="button" class="button secondary" data-close>Abbrechen</button><button type="button" class="button danger" id="confirm-reset">Zurücksetzen</button></div>`,
  );
  element.querySelector("#confirm-reset")!.addEventListener("click", () => {
    progress = freshProgress();
    orders.clear();
    assignments.clear();
    workshopFeedback.clear();
    quizSelections.clear();
    comparisons.clear();
    rubricChecks.clear();
    labStates.clear();
    history.replaceState(null, "", pageUrl());
    void persist();
    render();
    element.close();
  });
}

function applyDeepLink(): void {
  const link = parseTrainingDeepLink(location.hash, location.search);
  if (link.level) progress.level = link.level;
  if (link.lessonId) {
    const lesson = findLesson(link.lessonId);
    if (lesson) {
      progress.activeLessonId = lesson.id;
      view = "lesson";
    } else {
      view = "path";
      showToast(
        "Diese Lektion ist nicht vorhanden. Wähle eine Lektion aus dem Lernpfad.",
        "warning",
      );
    }
  } else
    view =
      new URLSearchParams(location.hash.slice(1)).get("view") === "reference"
        ? "reference"
        : "path";
  void persist();
  render();
}

document
  .querySelectorAll<HTMLButtonElement>(".header [data-view]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      switchView(button.dataset.view as typeof view);
    });
  });
document.getElementById("home")!.addEventListener("click", (event) => {
  event.preventDefault();
  switchView("path");
});
document.getElementById("zam")!.addEventListener("click", showZam);
document.getElementById("theme")!.addEventListener("click", () => {
  const current =
    document.documentElement.dataset.theme ??
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const theme = current === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("nt_ms5_theme", theme);
  } catch {
    /* The current page still changes theme. */
  }
});
window.addEventListener("hashchange", applyDeepLink);
applyDeepLink();
