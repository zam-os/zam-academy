import { CORE_LESSONS, CURRICULUM_URL, findLesson, LESSONS, SOURCES, STAGES } from "./curriculum";
import type { Lesson, Level } from "./model/types";
import {
  completion,
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
import { parseTrainingDeepLink, ZAM_CELL_TITLE, zamEnrolRequest } from "./zam/zam-link";

let progress = loadProgress();
let view: "path" | "lesson" | "reference" = "path";
const main = document.querySelector<HTMLElement>("#main")!;
const orders = new Map<string, number[]>();
const assignments = new Map<string, number[]>();
const workshopFeedback = new Set<string>();
const quizSelections = new Map<string, number>();
const comparisons = new Set<string>();
const rubricChecks = new Map<string, boolean[]>();
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

function persist(): void {
  if (!saveProgress(progress)) {
    document.getElementById("storage-note")!.textContent =
      "Speichern ist in diesem Browser gerade nicht möglich. Dein Fortschritt bleibt nur bis zum Schließen der Seite erhalten.";
    if (!storageWarningShown)
      showToast("Fortschritt kann gerade nur für diese Sitzung behalten werden.", "warning");
    storageWarningShown = true;
  }
  const stats = completion(progress);
  document.getElementById("progress-label")!.textContent =
    `${stats.completed} / ${stats.total} Kernlektionen`;
  (document.getElementById("progress") as HTMLProgressElement).value = stats.percent;
}

function openLesson(id: string): void {
  const lesson = findLesson(id);
  if (!lesson) return;
  progress.activeLessonId = id;
  if (lesson.optional) progress.includeEnglish = true;
  view = "lesson";
  history.pushState(null, "", `#lesson=${encodeURIComponent(id)}`);
  persist();
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
  return `<section class="hero"><div><span class="eyebrow">KLASSE 9 · ALLE ZWEIGE</span><h1>Vergangenheit verstehen.<br>Urteile begründen.</h1><p>Von Imperialismus und Weltkriegen bis zu Jugendkultur und Menschenrechten: Untersuche Belege, ordne Ereignisse und entwickle deinen eigenen Standpunkt.</p><button type="button" class="button accent" data-open="${esc(progress.activeLessonId)}">${stats.completed ? "Weiterlernen" : "Loslegen"}</button></div><aside class="hero-note"><span class="eyebrow">DEIN WEG DURCH GESCHICHTE</span><strong>Lesen → Untersuchen → Begründen</strong><p>35 Kernlektionen · sieben Lernbereiche<br>Vier optionale Vertiefungen auf Englisch</p><p class="small">Ein Abschluss verbindet Schnellcheck, Werkstatt und eine eigene Antwort mit Selbsteinschätzung. Level 2 vertieft den Transfer.</p></aside></section>
  <div class="path-heading"><div><h2>Dein Lernpfad</h2><p>Jede Lektion ist frei zugänglich. Du kannst jederzeit zurückspringen.</p></div><label class="toggle"><input type="checkbox" id="include-english" ${progress.includeEnglish ? "checked" : ""}>Englische Vertiefungen anzeigen</label></div>
  <div class="stages">${STAGES.filter((stage) => !stage.optional || progress.includeEnglish)
    .map((stage) => {
      const lessons = LESSONS.filter((lesson) => lesson.lb === stage.lb);
      const complete = lessons.filter((lesson) => isComplete(progress, lesson.id)).length;
      return `<section class="stage"><div class="stage-header"><span class="stage-icon" aria-hidden="true">${stage.icon}</span><div><span class="eyebrow">LERNBEREICH ${stage.lb}${stage.optional ? " · OPTIONAL" : ""}</span><h3>${esc(stage.shortTitle)}</h3></div><span class="stage-count">${complete} / ${lessons.length}</span></div><ol>${lessons.map((lesson) => `<li><button type="button" class="lesson-link ${isComplete(progress, lesson.id) ? "complete" : ""}" data-open="${lesson.id}"><span class="lesson-dot" aria-hidden="true">${isComplete(progress, lesson.id) ? "✓" : "·"}</span><span><strong>${esc(lesson.title)}</strong><small>${esc(lesson.period)}</small></span><span class="lesson-status">${status(lesson)}</span></button></li>`).join("")}</ol></section>`;
    })
    .join(
      "",
    )}</div><aside class="notice"><strong>Geschichte auch außerhalb der App untersuchen</strong><p>Die lokale Recherche und ein begleiteter Gedenkstättenbesuch gehören zur Arbeit am Lehrplan. Du findest hier Vorbereitung und Auswertung. Die Durchführung selbst bleibt eine Aufgabe vor Ort.</p><a href="${CURRICULUM_URL}" target="_blank" rel="noopener">Zum offiziellen Lehrplan</a></aside><button type="button" id="reset" class="text-button">Lokalen Fortschritt zurücksetzen</button>`;
}

function renderWorkshop(lesson: Lesson): string {
  const work = lesson.workshop;
  let order = orders.get(lesson.id);
  if (!order) {
    order = initialOrder(work, lesson.id);
    orders.set(lesson.id, order);
  }
  const answer =
    work.kind === "timeline" ? order : (assignments.get(lesson.id) ?? work.entries.map(() => -1));
  const feedback = workshopFeedback.has(lesson.id);
  const results = checkWorkshop(work, answer);
  return `<section class="panel workshop" aria-labelledby="workshop-heading"><div class="panel-heading"><span class="eyebrow">02 · WERKSTATT</span><span class="done-mark">${progress.workshopDone.includes(lesson.id) ? "✓ Einmal gelöst" : ""}</span></div><h2 id="workshop-heading">${esc(work.title)}</h2><p>${esc(work.instruction)}</p>
  ${work.material ? `<div class="document"><span class="small">${esc(work.materialLabel ?? "Darstellungstext für diese Übung")}</span><p>${esc(work.material)}</p></div>` : ""}
  ${work.sourceExcerpt ? `<figure class="document"><figcaption><strong>${esc(work.sourceExcerpt.title)}</strong><dl class="source-metadata"><dt>Urheber</dt><dd>${esc(work.sourceExcerpt.author)}</dd><dt>Datum</dt><dd>${esc(work.sourceExcerpt.date)}</dd><dt>Adressaten</dt><dd>${esc(work.sourceExcerpt.audience)}</dd></dl></figcaption><blockquote>${esc(work.sourceExcerpt.text)}</blockquote><p class="small">${esc(work.sourceExcerpt.context)}</p><a class="small" href="${esc(SOURCES.find((source) => source.id === work.sourceExcerpt!.sourceId)!.url)}" target="_blank" rel="noopener">Wortlaut und Kontext prüfen ↗</a></figure>` : ""}
  ${work.dataTable ? `<figure class="data-figure"><figcaption><strong>${esc(work.dataTable.title)}</strong><p class="small">${esc(work.dataTable.unit)}</p></figcaption><table><thead><tr><th scope="col">Wahl</th><th scope="col">Stimmenanteil</th></tr></thead><tbody>${work.dataTable.rows.map((row) => `<tr><th scope="row">${esc(row.label)}</th><td><span class="data-bar" aria-hidden="true" style="width:${row.value}%"></span><span>${row.value.toLocaleString("de-DE")} %</span></td></tr>`).join("")}</tbody></table><p class="small">Skala der Balken: 0 bis 100 Prozent. ${esc(work.dataTable.note)}</p><a class="small" href="${esc(SOURCES.find((source) => source.id === work.dataTable!.sourceId)!.url)}" target="_blank" rel="noopener">Herkunft und Kontext der Daten ↗</a></figure>` : ""}
  ${work.kind === "timeline" ? `<ol class="timeline">${order.map((entryIndex, position) => `<li><span class="position">${position + 1}</span><span class="event-text">${esc(work.entries[entryIndex].text)}</span><div class="move-buttons"><button type="button" data-move="${position}" data-delta="-1" aria-label="${esc(work.entries[entryIndex].text)} nach oben" ${position === 0 ? "disabled" : ""}>↑</button><button type="button" data-move="${position}" data-delta="1" aria-label="${esc(work.entries[entryIndex].text)} nach unten" ${position === order.length - 1 ? "disabled" : ""}>↓</button></div></li>`).join("")}</ol>` : `<div class="classification">${work.entries.map((entry, index) => `<label><span>${esc(entry.text)}</span><select data-assign="${index}"><option value="-1">Bitte zuordnen</option>${work.categories.map((category, value) => `<option value="${value}" ${answer[index] === value ? "selected" : ""}>${esc(category)}</option>`).join("")}</select></label>`).join("")}</div>`}
  <button type="button" id="check-workshop" class="button secondary">Zuordnung prüfen</button>
  ${feedback ? `<div class="feedback ${results.every(Boolean) ? "success" : "hint"}" role="status"><strong>${results.every(Boolean) ? "Die Zuordnung stimmt." : `${results.filter(Boolean).length} von ${results.length} stimmen. Prüfe die übrigen noch einmal.`}</strong><ul>${(work.kind === "timeline" ? order : work.entries.map((_, i) => i)).map((entryIndex, position) => `<li>${results[position] ? "✓" : "→"} ${esc(work.entries[entryIndex].feedback)}</li>`).join("")}</ul><p>${esc(work.conclusion)}</p></div>` : ""}</section>`;
}

function renderWriting(lesson: Lesson): string {
  const key = writingKey(lesson.id, progress.level);
  const task = lesson.tasks[progress.level];
  const draft = progress.drafts[key] ?? "";
  const comparing = comparisons.has(key);
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
  const visible = progress.includeEnglish ? LESSONS : CORE_LESSONS;
  const index = visible.indexOf(lesson);
  return `<article lang="${lesson.language ?? "de"}"><div class="lesson-top"><button type="button" class="text-button" data-view="path">← Zum Lernpfad</button><label class="level-select">Arbeitsweise <select id="level"><option value="1" ${progress.level === 1 ? "selected" : ""}>Level 1 · mit Leitfragen</option><option value="2" ${progress.level === 2 ? "selected" : ""}>Level 2 · Transfer</option></select></label></div>
  <header class="lesson-heading"><span class="eyebrow">${esc(stage.shortTitle)}${lesson.optional ? " · OPTIONAL · ENGLISH" : ""}</span><h1>${esc(lesson.title)}</h1><p class="period">${esc(lesson.period)}</p><p class="intro">${esc(lesson.intro)}</p></header>
  <div class="lesson-columns"><div class="lesson-content"><section class="panel reading"><span class="eyebrow">01 · VERSTEHEN</span>${lesson.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}<p class="takeaway"><strong>Merke</strong>${esc(lesson.takeaway)}</p></section>
  <section class="panel quiz"><div class="panel-heading"><h2>Schnellcheck</h2><span class="done-mark">${progress.quizDone.includes(lesson.id) ? "✓ Einmal richtig" : ""}</span></div><p>${esc(lesson.quiz.question)}</p><div class="quiz-options">${options.map((i) => `<button type="button" data-choice="${i}" class="quiz-choice ${selected === i ? "selected" : ""}" aria-pressed="${selected === i}">${esc(labels[i])}</button>`).join("")}</div>${selected !== undefined ? `<p class="feedback ${selected === 0 ? "success" : "hint"}" role="status"><strong>${selected === 0 ? "Richtig. " : "Prüfe noch einmal. "}</strong>${esc(lesson.quiz.explanation)}</p>` : ""}</section>
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
  return `<section class="reference"><span class="eyebrow">NACHSCHLAGEN</span><h1>Orientierung behalten</h1><p>Die Merksätze helfen beim Wiederholen. Für Zusammenhänge, Quellenkritik und Urteile öffnest du die jeweilige Lektion.</p>${STAGES.map(
    (stage) =>
      `<section class="panel"><h2>${esc(stage.shortTitle)}${stage.optional ? " · optional" : ""}</h2><dl>${LESSONS.filter(
        (lesson) => lesson.lb === stage.lb,
      )
        .map(
          (lesson) =>
            `<dt><button type="button" data-open="${lesson.id}" class="text-button">${esc(lesson.title)}</button></dt><dd>${esc(lesson.takeaway)}</dd>`,
        )
        .join("")}</dl></section>`,
  ).join(
    "",
  )}<section class="panel"><h2>Quellenbasis</h2><p>Lehrplanabgleich und Quellenprüfung: 20. Oktober 2026. Verlinkte Angebote öffnen erst, wenn du darauf klickst. Die App selbst benötigt keine externe Verbindung.</p><ul class="source-list">${SOURCES.map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)}</a></li>`).join("")}</ul></section></section>`;
}

function render(): void {
  main.innerHTML =
    view === "path" ? renderPath() : view === "lesson" ? renderLesson() : renderReference();
  document.querySelectorAll<HTMLButtonElement>("header nav [data-view]").forEach((button) => {
    button.setAttribute("aria-current", button.dataset.view === view ? "page" : "false");
  });
  main.querySelectorAll<HTMLButtonElement>("[data-open]").forEach((button) => {
    button.addEventListener("click", () => openLesson(button.dataset.open!));
  });
  main.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      switchView(button.dataset.view as typeof view);
    });
  });
  main.querySelector("#include-english")?.addEventListener("change", (event) => {
    progress.includeEnglish = (event.target as HTMLInputElement).checked;
    if (!progress.includeEnglish && findLesson(progress.activeLessonId)?.optional) {
      progress.activeLessonId =
        CORE_LESSONS.find((lesson) => !isComplete(progress, lesson.id))?.id ?? CORE_LESSONS[0].id;
    }
    persist();
    render();
  });
  main.querySelector("#reset")?.addEventListener("click", showReset);
  if (view === "lesson") bindLesson(findLesson(progress.activeLessonId)!);
}

function bindLesson(lesson: Lesson): void {
  const key = writingKey(lesson.id, progress.level);
  const work = lesson.workshop;
  main.querySelector("#level")?.addEventListener("change", (event) => {
    progress.level = Number((event.target as HTMLSelectElement).value) as Level;
    history.replaceState(null, "", pageUrl(`#lesson=${lesson.id}&level=${progress.level}`));
    persist();
    render();
    main.querySelector<HTMLSelectElement>("#level")?.focus({ preventScroll: true });
  });
  main.querySelectorAll<HTMLButtonElement>("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const choice = Number(button.dataset.choice);
      quizSelections.set(lesson.id, choice);
      if (choice === 0 && !progress.quizDone.includes(lesson.id)) progress.quizDone.push(lesson.id);
      persist();
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
        .querySelector<HTMLButtonElement>(`[data-move="${index + delta}"][data-delta="${-delta}"]`)
        ?.focus({ preventScroll: true });
    });
  });
  main.querySelectorAll<HTMLSelectElement>("[data-assign]").forEach((select) => {
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
      work.kind === "timeline" ? orders.get(lesson.id)! : (assignments.get(lesson.id) ?? []);
    if (checkWorkshop(work, answer).every(Boolean) && !progress.workshopDone.includes(lesson.id))
      progress.workshopDone.push(lesson.id);
    workshopFeedback.add(lesson.id);
    persist();
    render();
  });
  main.querySelector("#draft")?.addEventListener("input", (event) => {
    const text = (event.target as HTMLTextAreaElement).value;
    progress.drafts[key] = text;
    progress.writingDone = progress.writingDone.filter((entry) => entry !== key);
    rubricChecks.delete(key);
    comparisons.delete(key);
    main.querySelector(".model-answer")?.remove();
    (main.querySelector("#compare") as HTMLButtonElement).disabled = !canReviewDraft(text);
    main.querySelector("#draft-note")!.textContent = canReviewDraft(text)
      ? ""
      : "Schreibe zunächst mindestens 20 Zeichen.";
    main.querySelector("#writing-done")!.textContent = "";
    if (progress.level === 1)
      main.querySelector("#aside-writing")!.textContent = "○ Level 1 selbst eingeschätzt";
    persist();
  });
  main.querySelector("#compare")?.addEventListener("click", () => {
    if (!canReviewDraft(progress.drafts[key] ?? "")) return;
    comparisons.add(key);
    render();
    main.querySelector(".model-answer")?.scrollIntoView({
      block: "nearest",
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  });
  main.querySelectorAll<HTMLInputElement>("[data-rubric]").forEach((checkbox) => {
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
      !canAcceptSelfAssessment(progress.drafts[key] ?? "", rubricChecks.get(key) ?? [])
    )
      return;
    if (!progress.writingDone.includes(key)) progress.writingDone.push(key);
    persist();
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
    progress.writingDone = progress.writingDone.filter((entry) => entry !== key);
    persist();
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
    "Geschichte mit ZAM behalten",
    `<p>Hier erarbeitest du Zusammenhänge. ZAM erinnert dich später mit kurzen Fragen daran. Jede Karte führt zur passenden Lektion zurück. Die Zelle enthält 70 Kernkarten und acht Karten zu den englischen Vertiefungen.</p><ol><li>Öffne ZAM Studio → Lern-Karten → Importieren → „Aus der ZAM Academy“.</li><li>Wähle „${esc(ZAM_CELL_TITLE)}“ und „Aufnehmen“.</li></ol><p>Oder sage deinem Agenten in ZAM:</p><div class="request"><code>${esc(request)}</code><button type="button" class="button secondary" id="copy">Kopieren</button></div><p class="small" id="copy-status" role="status">Dein App-Fortschritt und deine Texte werden dabei nicht übertragen.</p><button type="button" class="button accent" data-close>Weiterlernen</button>`,
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
    history.replaceState(null, "", pageUrl());
    persist();
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
      if (lesson.optional) progress.includeEnglish = true;
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
  persist();
  render();
}

document.querySelectorAll<HTMLButtonElement>(".header [data-view]").forEach((button) => {
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
    localStorage.setItem("geschichte_rs9_theme", theme);
  } catch {
    /* The current page still changes theme. */
  }
});
window.addEventListener("hashchange", applyDeepLink);
applyDeepLink();
