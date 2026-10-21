import {
  CURRICULUM_URL,
  findLesson,
  lessonsFor,
  SOURCES,
  STAGES,
} from "./curriculum";
import { checkAnswer, wrongAnswerHint } from "./exercises/checker";
import { makeExercise } from "./exercises/generators";
import { createRng, seedFrom } from "./exercises/rng";
import type { ExerciseTask, Lesson, Level, Track } from "./model/types";
import {
  MODEL_SCENARIOS,
  modelReady,
  recordExploration,
  setModelValue,
} from "./models";
import {
  completion,
  experimentSummary,
  freshProgress,
  isComplete,
  loadProgress,
  saveProgress,
  writingKey,
} from "./storage/progress";
import {
  applyScenario,
  initialModelState,
  type ModelState,
  renderModel,
} from "./ui/models";
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
import {
  parseTrainingDeepLink,
  ZAM_CELL_TITLE,
  zamEnrolRequest,
} from "./zam/zam-link";

let progress = loadProgress();
let view: "path" | "lesson" | "reference" | "experiments" = "path";
const main = document.querySelector<HTMLElement>("#main")!;
const orders = new Map<string, number[]>();
const assignments = new Map<string, number[]>();
const workshopFeedback = new Set<string>();
const quizSelections = new Map<string, number>();
const comparisons = new Set<string>();
const rubricChecks = new Map<string, boolean[]>();
let storageWarningShown = false;
const modelStates = new Map<string, ModelState>();
interface ExerciseView {
  task: ExerciseTask;
  finished: boolean;
  assisted: boolean;
  solution: boolean;
  advanced: boolean;
  message: string;
}
const activeExercises = new Map<string, ExerciseView>();
function exerciseFor(lesson: Lesson): ExerciseView {
  const key = writingKey(lesson.id, progress.level);
  let entry = activeExercises.get(key);
  if (!entry) {
    entry = {
      task: makeExercise(
        lesson.calculation!,
        createRng(seedFrom(`${key}:${progress.exerciseSerial[key] ?? 0}`)),
        progress.level,
      ),
      finished: false,
      assisted: false,
      solution: false,
      advanced: false,
      message: "",
    };
    activeExercises.set(key, entry);
  }
  return entry;
}
function renderCalculation(lesson: Lesson): string {
  if (!lesson.calculation) return "";
  const key = writingKey(lesson.id, progress.level),
    entry = exerciseFor(lesson),
    task = entry.task;
  return `<section class="panel calculation"><div class="panel-heading"><span class="eyebrow">SELBST RECHNEN · LEVEL ${progress.level}</span><span>${progress.calculationDone[key] ?? 0} / 3 eigenständig gelöst</span></div><h2>Mit Einheiten rechnen</h2><p>${esc(task.prompt)}</p>${progress.level === 1 ? `<details><summary>Formelhilfe</summary><p>${esc(task.formulaHint ?? "")}</p></details>` : ""}<form id="calculation-form"><label for="calculation-answer">Dein Ergebnis in ${esc(task.unit)}</label><div class="calculation-input"><input id="calculation-answer" type="text" inputmode="decimal" autocomplete="off" ${entry.finished ? "disabled" : ""}><span>${esc(task.unit)}</span><button type="submit" class="button accent" ${entry.finished ? "disabled" : ""}>Prüfen</button></div></form><p class="small">Dezimalkomma oder Dezimalpunkt sind möglich. Runde auf drei Nachkommastellen; ein passendes genaueres Ergebnis wird ebenfalls akzeptiert.</p>${entry.message ? `<p role="status" class="feedback ${entry.finished && !entry.assisted ? "success" : "hint"}">${esc(entry.message)}</p>` : ""}<div class="self-actions"><button type="button" id="show-calculation" class="text-button" ${entry.solution ? "disabled" : ""}>Lösung ansehen</button><button type="button" id="next-calculation" class="button secondary">Neue Aufgabe</button></div>${entry.solution ? `<div class="model-answer"><h3>Rechenweg</h3><p>${task.solutionHtml}</p><p class="small">Eine vor dem Lösen geöffnete Musterlösung zählt nicht als eigenständig gelöste Aufgabe.</p></div>` : ""}</section>`;
}
function bindCalculation(lesson: Lesson): void {
  if (!lesson.calculation) return;
  const key = writingKey(lesson.id, progress.level),
    entry = exerciseFor(lesson);
  main
    .querySelector("#calculation-form")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (entry.finished) return;
      const input = main.querySelector<HTMLInputElement>(
          "#calculation-answer",
        )!,
        result = checkAnswer(entry.task, input.value);
      if (result.status === "correct") {
        entry.finished = true;
        entry.solution = true;
        entry.message =
          "Richtig gerechnet. Diese Aufgabe zählt zu deinem Übungsfortschritt.";
        progress.calculationDone[key] = Math.min(
          3,
          (progress.calculationDone[key] ?? 0) + 1,
        );
        progress.exerciseSerial[key] = (progress.exerciseSerial[key] ?? 0) + 1;
        entry.advanced = true;
        persist();
        render();
      } else {
        entry.message =
          result.status === "invalid"
            ? "Bitte eine Zahl eingeben."
            : wrongAnswerHint(result, entry.task);
        const note = main.querySelector(".calculation .feedback");
        if (note) note.textContent = entry.message;
        else {
          const p = document.createElement("p");
          p.className = "feedback hint";
          p.setAttribute("role", "status");
          p.textContent = entry.message;
          input.closest("form")!.after(p);
        }
        input.focus();
      }
    });
  main.querySelector("#show-calculation")?.addEventListener("click", () => {
    entry.assisted = true;
    entry.finished = true;
    entry.solution = true;
    entry.message =
      "Lösung geöffnet. Starte eine neue Aufgabe, um selbst weiterzuüben.";
    render();
  });
  main.querySelector("#next-calculation")?.addEventListener("click", () => {
    if (!entry.advanced)
      progress.exerciseSerial[key] = (progress.exerciseSerial[key] ?? 0) + 1;
    activeExercises.delete(key);
    persist();
    render();
    main
      .querySelector<HTMLInputElement>("#calculation-answer")
      ?.focus({ preventScroll: true });
  });
}
const experimentLabels = {
  question: "Fragestellung und erwarteter Zusammenhang",
  setup: "Aufbau, veränderte Größe und konstant gehaltene Bedingungen",
  data: "Eigene Messwerte mit Einheiten, Wiederholungen und Messunsicherheit",
  conclusion: "Auswertung, Abweichungen und Grenzen des Versuchs",
};
function experimentStatus(): string {
  const r = experimentSummary(progress.experiments);
  return `${r.count} / 3 als selbst durchgeführt dokumentiert. ${r.coversBoth ? "Mechanik und Elektrizitätslehre sind enthalten." : "Mindestens ein Versuch in Mechanik und einer in Elektrizitätslehre sind erforderlich."} Die App prüft nur ausgefüllte Felder; Durchführung und fachliche Qualität werden im Unterricht besprochen.`;
}
function renderExperiments(): string {
  return `<section class="reference"><span class="eyebrow">VOM MODELL ZUR MESSUNG</span><h1>Dein Versuchsnotizbuch</h1><p>Plane mindestens drei echte Schülerexperimente, darunter mindestens eines zu Mechanik und eines zu Elektrizitätslehre. Geeignete Fragen sind Bewegung eines Wagens, Teilspannungen in Reihe und Einfluss einer Magnetbewegung auf Induktion. Verwende schulische Geräte nach Anleitung.</p><p class="feedback hint" id="experiment-status" role="status">${esc(experimentStatus())}</p><p class="small">Simulationen gehören zum Modellvergleich und zählen hier nicht als selbst durchgeführte Experimente. Die Auswahl „selbst durchgeführt“ ist deine eigene Angabe und keine geprüfte Bestätigung. Alle Notizen bleiben in diesem Browser.</p>${progress.experiments
    .map(
      (e, i) =>
        `<section class="panel"><h2>Versuch ${i + 1}</h2><div class="model-controls"><label>Lernbereich<select data-experiment="${i}" data-field="lb"><option value="1" ${e.lb === 1 ? "selected" : ""}>Mechanik</option><option value="2" ${e.lb === 2 ? "selected" : ""}>Elektrizitätslehre</option></select></label><label>Stand<select data-experiment="${i}" data-field="status"><option value="planned" ${e.status === "planned" ? "selected" : ""}>Geplant</option><option value="done" ${e.status === "done" ? "selected" : ""}>Selbst durchgeführt · eigene Angabe</option></select></label></div>${Object.entries(
          experimentLabels,
        )
          .map(
            ([key, label]) =>
              `<label class="project-field">${esc(label)}<textarea data-experiment="${i}" data-field="${key}" rows="3" maxlength="4000">${esc(e[key as keyof typeof experimentLabels])}</textarea></label>`,
          )
          .join("")}</section>`,
    )
    .join("")}</section>`;
}
function bindExperiments(): void {
  main
    .querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("[data-experiment]")
    .forEach((input) => {
      input.addEventListener(
        input.tagName === "SELECT" ? "change" : "input",
        () => {
          const index = Number(input.dataset.experiment),
            field = input.dataset.field!,
            e = progress.experiments[index];
          if (!e) return;
          if (field === "lb") e.lb = input.value === "2" ? 2 : 1;
          else if (field === "status")
            e.status = input.value === "done" ? "done" : "planned";
          else if (Object.hasOwn(experimentLabels, field))
            e[field as keyof typeof experimentLabels] = input.value.slice(
              0,
              4000,
            );
          persist();
          const status = main.querySelector("#experiment-status");
          if (status) status.textContent = experimentStatus();
        },
      );
    });
}
function visibleLessons(): Lesson[] {
  return lessonsFor(progress.track, progress.includeExtra);
}
function enableOptional(lesson: Lesson): void {
  if (!lesson.tracks.includes(progress.track))
    progress.track = lesson.tracks[0];
  if (lesson.optional) progress.includeExtra = true;
}
function lessonModel(lesson: Lesson): string {
  if (!lesson.model) return "";
  if (!modelStates.has(lesson.id))
    modelStates.set(lesson.id, initialModelState());
  return renderModel(
    lesson,
    progress.explored[lesson.id] ?? [],
    modelStates.get(lesson.id)!,
  );
}
function refreshLessonStatus(lesson: Lesson): void {
  const model = main.querySelector("#aside-model");
  if (model && lesson.model)
    model.textContent = `${modelReady(lesson.model, progress.explored[lesson.id] ?? []) ? "✓" : "○"} Vergleichssituationen geöffnet`;
  const calculation = main.querySelector("#aside-calculation");
  if (calculation && lesson.calculation)
    calculation.textContent = `${progress.calculationDone[writingKey(lesson.id, 1)] ?? 0} / 3 Rechenaufgaben in Level 1`;
  const notice = main.querySelector("#lesson-status");
  if (notice)
    notice.textContent = isComplete(progress, lesson.id)
      ? "✓ Diese Lektion ist abgeschlossen."
      : "Bearbeite die offenen Lernschritte. Deine Texte schätzt du selbst ein.";
}

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
        : next === "experiments"
          ? "#view=experiments"
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
      showToast(
        "Fortschritt kann gerade nur für diese Sitzung behalten werden.",
        "warning",
      );
    storageWarningShown = true;
  }
  const stats = completion(progress);
  document.getElementById("progress-label")!.textContent =
    `${stats.completed} / ${stats.total} Kernlektionen · Zweig ${progress.track === "I" ? "I" : "II/III"}`;
  (document.getElementById("progress") as HTMLProgressElement).value =
    stats.percent;
}

function openLesson(id: string): void {
  const lesson = findLesson(id);
  if (!lesson) return;
  progress.activeLessonId = id;
  enableOptional(lesson);
  view = "lesson";
  history.pushState(
    null,
    "",
    pageUrl(`#lesson=${encodeURIComponent(id)}&level=${progress.level}`),
  );
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
  return `<section class="hero"><div><span class="eyebrow">PHYSIK 10 · REALSCHULE BAYERN</span><h1>Bewegung erklären.<br> Energie verstehen.</h1><p>Entdecke, wie Kräfte Bewegung ändern, wie Induktion Stromversorgung ermöglicht und was Kernmodelle erklären. Vergleiche Modelle, rechne selbst und begründe deine Entscheidungen.</p><button type="button" class="button accent" data-open="${esc(progress.activeLessonId)}">${stats.completed ? "Weiterlernen" : "Loslegen"}</button></div><aside class="hero-note"><span class="eyebrow">DEIN WEG DURCH PHYSIK</span><strong>Vorhersagen → Prüfen → Begründen</strong><p>Vier Lernbereiche · zehn veränderbare Modelle<br>34 Kernlektionen in I · 25 in II/III<br>Zusatz: Effektivwert einer Sinusspannung</p><p class="small">Ein Abschluss verbindet Schnellcheck, Werkstatt und eine selbst eingeschätzte Begründung. Modelllektionen verlangen die Vergleiche, Rechenlektionen drei eigenständig gelöste Aufgaben in Level 1.</p></aside></section>
  <div class="path-heading"><div><h2>Dein Lernpfad</h2><p>Alle Lektionen sind frei zugänglich. Wähle deinen Zweig; dein Fortschritt bleibt beim Wechsel erhalten.</p></div><div class="path-filters"><label>Zweig <select id="track"><option value="II_III" ${progress.track === "II_III" ? "selected" : ""}>II/III</option><option value="I" ${progress.track === "I" ? "selected" : ""}>I · mathematisch-naturwissenschaftlich</option></select></label><label class="toggle"><input type="checkbox" id="include-extra" ${progress.includeExtra ? "checked" : ""}>Zusatz: Effektivwert</label></div></div>
  <div class="stages">${STAGES.map((stage) => {
    const lessons = visibleLessons().filter((l) => l.lb === stage.lb);
    const complete = lessons.filter(
      (l) => !l.optional && isComplete(progress, l.id),
    ).length;
    return `<section class="stage"><div class="stage-header"><span class="stage-icon" aria-hidden="true">${stage.icon}</span><div><span class="eyebrow">LERNBEREICH ${stage.lb}</span><h3>${esc(stage.shortTitle)}</h3><p class="small">${esc(stage.title)}</p></div><span class="stage-count">${complete} / ${lessons.filter((l) => !l.optional).length}</span></div><ol>${lessons.map((lesson) => `<li><button type="button" class="lesson-link ${isComplete(progress, lesson.id) ? "complete" : ""}" data-open="${lesson.id}"><span class="lesson-dot" aria-hidden="true">${isComplete(progress, lesson.id) ? "✓" : "·"}</span><span><strong>${esc(lesson.title)}</strong><small>${lesson.optional ? "Zusatz · optional" : esc(lesson.period)}</small></span><span class="lesson-status">${status(lesson)}</span></button></li>`).join("")}</ol></section>`;
  }).join("")}</div>
  <aside class="scope-note"><h2>Vom Modell zum echten Versuch</h2><p>Der Lehrplan fordert mindestens drei echte Schülerexperimente, mindestens eines in Mechanik und eines in Elektrizitätslehre. Die Modelle hier zählen dafür nicht. Im Versuchsnotizbuch kannst du Planung und eigene Messungen festhalten; besprich sie im Unterricht.</p><button type="button" class="button secondary" data-view="experiments">Versuchsnotizbuch öffnen</button><p>Mit schulischer Kleinspannungsquelle und nach Anleitung arbeiten. Keine Versuche am Stromnetz oder mit eigenen radioaktiven Quellen. Quellenrecherche und Präsentation gehören zusätzlich zum Unterricht.</p><a href="${progress.track === "I" ? CURRICULUM_URL : SOURCES.find((s) => s.id === "lp-ii")!.url}" target="_blank" rel="noopener">Zum offiziellen Lehrplan deines Zweigs</a></aside><button type="button" id="reset" class="text-button">Lokalen Fortschritt zurücksetzen</button>`;
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
  const results = checkWorkshop(work, answer);
  return `<section class="panel workshop" aria-labelledby="workshop-heading"><div class="panel-heading"><span class="eyebrow">02 · WERKSTATT</span><span class="done-mark">${progress.workshopDone.includes(lesson.id) ? "✓ Einmal gelöst" : ""}</span></div><h2 id="workshop-heading">${esc(work.title)}</h2><p>${esc(work.instruction)}</p>
  ${work.material ? `<div class="document"><span class="small">${esc(work.materialLabel ?? "Darstellungstext für diese Übung")}</span><p>${esc(work.material)}</p></div>` : ""}
  ${work.kind === "timeline" ? `<ol class="timeline">${order.map((entryIndex, position) => `<li><span class="position">${position + 1}</span><span class="event-text">${esc(work.entries[entryIndex].text)}</span><div class="move-buttons"><button type="button" data-move="${position}" data-delta="-1" aria-label="${esc(work.entries[entryIndex].text)} nach oben" ${position === 0 ? "disabled" : ""}>↑</button><button type="button" data-move="${position}" data-delta="1" aria-label="${esc(work.entries[entryIndex].text)} nach unten" ${position === order.length - 1 ? "disabled" : ""}>↓</button></div></li>`).join("")}</ol>` : `<div class="classification">${work.entries.map((entry, index) => `<label><span>${esc(entry.text)}</span><select data-assign="${index}" aria-label="${esc(entry.text)}"><option value="-1">Bitte zuordnen</option>${work.categories.map((category, value) => `<option value="${value}" ${answer[index] === value ? "selected" : ""}>${esc(category)}</option>`).join("")}</select></label>`).join("")}</div>`}
  <button type="button" id="check-workshop" class="button secondary">Zuordnung prüfen</button>
  ${feedback ? `<div class="feedback ${results.every(Boolean) ? "success" : "hint"}" role="status"><strong>${results.every(Boolean) ? "Die Zuordnung stimmt." : `${results.filter(Boolean).length} von ${results.length} stimmen. Prüfe die übrigen noch einmal.`}</strong><ul>${(work.kind === "timeline" ? order : work.entries.map((_, i) => i)).map((entryIndex, position) => `<li>${results[position] ? "✓" : "→"} ${esc(work.entries[entryIndex].feedback)}</li>`).join("")}</ul><p>${esc(work.conclusion)}</p></div>` : ""}</section>`;
}

function renderWriting(lesson: Lesson): string {
  const key = writingKey(lesson.id, progress.level);
  const task = lesson.tasks[progress.level];
  const draft = progress.drafts[key] ?? "";
  const comparing = comparisons.has(key);
  const checks = rubricChecks.get(key) ?? [false, false, false];
  return `<section class="panel writing" aria-labelledby="writing-heading"><div class="panel-heading"><span class="eyebrow">03 · SELBST BEGRÜNDEN</span><span class="done-mark" id="writing-done">${progress.writingDone.includes(key) ? "✓ Selbst eingeschätzt" : ""}</span></div><h2 id="writing-heading">${progress.level === 1 ? "Mit Leitfragen arbeiten" : "Auf einen neuen Fall übertragen"}</h2><p class="task-prompt" lang="${"de"}">${esc(task.prompt)}</p>
  ${progress.level === 1 ? `<details><summary>Leitfragen anzeigen</summary><ul>${task.hints.map((hint) => `<li>${esc(hint)}</li>`).join("")}</ul></details>` : `<p class="small">Formuliere erst deinen eigenen Gedankengang. Die Vergleichsantwort folgt danach.</p>`}
  <label class="answer-label" for="draft">Deine Antwort</label><textarea id="draft" rows="5" maxlength="8000" placeholder="Schreibe zwei bis vier begründete Sätze …">${esc(draft)}</textarea><p class="small">Dein Text bleibt in diesem Browser. Er wird nicht automatisch bewertet.</p><button type="button" id="compare" class="button secondary" ${canReviewDraft(draft) ? "" : "disabled"}>Mit einer möglichen Antwort vergleichen</button><span class="small" id="draft-note">${canReviewDraft(draft) ? "" : "Schreibe zunächst mindestens 20 Zeichen."}</span>
  ${comparing ? `<div class="model-answer"><h3>Eine mögliche Antwort</h3><p lang="${"de"}">${esc(task.model)}</p><p>Andere Formulierungen und begründete Urteile sind möglich. Vergleiche deinen Text anhand dieser Kriterien:</p><div class="rubric">${task.criteria.map((criterion, i) => `<label><input type="checkbox" data-rubric="${i}" ${checks[i] ? "checked" : ""}>${esc(criterion)}</label>`).join("")}</div><div class="self-actions"><button type="button" class="button accent" id="accept-writing" ${canAcceptSelfAssessment(draft, checks) ? "" : "disabled"}>Meine Antwort erfüllt die Kriterien</button><button type="button" class="text-button" id="revise-writing">Ich überarbeite noch</button></div><p class="small">Diese Einschätzung gibst du selbst ab. Sie ist keine automatische Prüfung und verändert keine ZAM-Karten.</p></div>` : ""}</section>`;
}

function renderLesson(): string {
  const lesson = findLesson(progress.activeLessonId)!;
  const stage = STAGES.find((entry) => entry.lb === lesson.lb)!;
  const options = shuffle([0, 1, 2], `${lesson.id}:quiz`);
  const labels = [lesson.quiz.answer, ...lesson.quiz.wrong];
  const selected = quizSelections.get(lesson.id);
  const visible = visibleLessons();
  const index = visible.indexOf(lesson);
  return `<article lang="de"><div class="lesson-top"><button type="button" class="text-button" data-view="path">← Zum Lernpfad</button><label class="level-select">Arbeitsweise <select id="level"><option value="1" ${progress.level === 1 ? "selected" : ""}>Level 1 · mit Leitfragen</option><option value="2" ${progress.level === 2 ? "selected" : ""}>Level 2 · Transfer</option></select></label></div>
  <header class="lesson-heading"><span class="eyebrow">${esc(stage.shortTitle)}${lesson.optional ? " · ZUSATZ" : ""}</span><h1 lang="${"de"}">${esc(lesson.title)}</h1><p class="period">${esc(lesson.period)}</p><p class="intro">${esc(lesson.intro)}</p></header>
  <div class="lesson-columns"><div class="lesson-content"><section class="panel reading" lang="${"de"}"><span class="eyebrow">01 · VERSTEHEN</span>${lesson.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}<p class="takeaway"><strong>Merke</strong>${esc(lesson.takeaway)}</p></section>
  <section class="panel quiz" lang="${"de"}"><div class="panel-heading"><h2>Schnellcheck</h2><span class="done-mark">${progress.quizDone.includes(lesson.id) ? "✓ Einmal richtig" : ""}</span></div><p>${esc(lesson.quiz.question)}</p><div class="quiz-options">${options.map((i) => `<button type="button" data-choice="${i}" class="quiz-choice ${selected === i ? "selected" : ""}" aria-pressed="${selected === i}">${esc(labels[i])}</button>`).join("")}</div>${selected !== undefined ? `<p class="feedback ${selected === 0 ? "success" : "hint"}" role="status"><strong>${selected === 0 ? "Richtig. " : "Prüfe noch einmal. "}</strong>${esc(lesson.quiz.explanation)}</p>` : ""}</section>
  ${lessonModel(lesson)}${renderWorkshop(lesson)}${renderCalculation(lesson)}${renderWriting(lesson)}</div><aside class="lesson-aside"><section class="aside-card"><h2>Dein Lernschritt</h2><ul class="checklist">${lesson.model ? `<li id="aside-model">${modelReady(lesson.model, progress.explored[lesson.id] ?? []) ? "✓" : "○"} Vergleichssituationen geöffnet</li>` : ""}${lesson.calculation ? `<li id="aside-calculation">${progress.calculationDone[writingKey(lesson.id, 1)] ?? 0} / 3 Rechenaufgaben in Level 1</li>` : ""}<li>${progress.quizDone.includes(lesson.id) ? "✓" : "○"} Schnellcheck</li><li>${progress.workshopDone.includes(lesson.id) ? "✓" : "○"} Werkstatt gelöst</li><li id="aside-writing">${progress.writingDone.includes(writingKey(lesson.id, 1)) ? "✓" : "○"} Level 1 selbst eingeschätzt</li></ul><p class="small" id="lesson-status">${isComplete(progress, lesson.id) ? "✓ Diese Lektion ist abgeschlossen." : "Bearbeite die offenen Lernschritte. Deine Texte schätzt du selbst ein."}</p><p class="small">Level 2 ist eine zusätzliche Vertiefung. Die Kernfortschritte zählen Level 1.</p></section><section class="aside-card"><h2>Belege & weiterlernen</h2><ul class="source-list">${lesson.sourceIds
    .map((id) => SOURCES.find((source) => source.id === id)!)
    .map(
      (source) =>
        `<li><a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)} ↗</a></li>`,
    )
    .join(
      "",
    )}</ul><p class="small">Die Texte und Übungsdaten sind eigens verfasst. Die verlinkten Fachquellen ermöglichen eine weitere Prüfung.</p></section><section class="aside-card"><h2>Damit es bleibt</h2><p class="small">ZAM hält das Wissen mit kurzen Wiederholungen fest. Jede Karte führt hierher zurück.</p><button type="button" class="button secondary" data-zam>In ZAM festigen</button></section></aside></div>
  <nav class="lesson-navigation" aria-label="Lektionen">${index > 0 ? `<button type="button" data-open="${visible[index - 1].id}" class="button secondary">← Vorherige Lektion</button>` : "<span></span>"}${index >= 0 && index < visible.length - 1 ? `<button type="button" data-open="${visible[index + 1].id}" class="button accent">Nächste Lektion →</button>` : `<button type="button" data-view="path" class="button accent">Zum Lernpfad</button>`}</nav></article>`;
}

function renderReference(): string {
  return `<section class="reference"><span class="eyebrow">NACHSCHLAGEN</span><h1>Orientierung behalten</h1><p>Die Merksätze zeigen die Lektionen deines gewählten Zweigs. Für Zusammenhänge, Quellenkritik und Urteile öffnest du die jeweilige Lektion.</p>${STAGES.map(
    (stage) =>
      `<section class="panel"><h2>${esc(stage.shortTitle)}</h2><dl>${visibleLessons()
        .filter((lesson) => lesson.lb === stage.lb)
        .map(
          (lesson) =>
            `<dt><button type="button" data-open="${lesson.id}" class="text-button">${esc(lesson.title)}</button></dt><dd>${esc(lesson.takeaway)}</dd>`,
        )
        .join("")}</dl></section>`,
  ).join(
    "",
  )}<section class="panel"><h2>Quellenbasis</h2><p>Lehrplanabgleich und Quellenprüfung: 21. Oktober 2026. Verlinkte Angebote öffnen erst, wenn du darauf klickst. Die App selbst benötigt keine externe Verbindung.</p><ul class="source-list">${SOURCES.map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)}</a></li>`).join("")}</ul></section></section>`;
}

function render(): void {
  main.innerHTML =
    view === "path"
      ? renderPath()
      : view === "lesson"
        ? renderLesson()
        : view === "experiments"
          ? renderExperiments()
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
  main.querySelector("#track")?.addEventListener("change", (event) => {
    progress.track = (event.target as HTMLSelectElement).value as Track;
    if (!visibleLessons().some((l) => l.id === progress.activeLessonId))
      progress.activeLessonId = visibleLessons()[0].id;
    persist();
    render();
  });
  main.querySelector("#include-extra")?.addEventListener("change", (event) => {
    progress.includeExtra = (event.target as HTMLInputElement).checked;
    if (!visibleLessons().some((l) => l.id === progress.activeLessonId))
      progress.activeLessonId = visibleLessons()[0].id;
    persist();
    render();
  });
  bindExperiments();
  main.querySelector("#reset")?.addEventListener("click", showReset);
  if (view === "lesson") bindLesson(findLesson(progress.activeLessonId)!);
}

function bindLesson(lesson: Lesson): void {
  const key = writingKey(lesson.id, progress.level);
  const work = lesson.workshop;
  bindModel(lesson);
  bindCalculation(lesson);
  main.querySelector("#level")?.addEventListener("change", (event) => {
    progress.level = Number((event.target as HTMLSelectElement).value) as Level;
    history.replaceState(
      null,
      "",
      pageUrl(`#lesson=${lesson.id}&level=${progress.level}`),
    );
    persist();
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
        if (choice === 0 && !progress.quizDone.includes(lesson.id))
          progress.quizDone.push(lesson.id);
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
        .querySelector<HTMLButtonElement>(
          `[data-move="${index + delta}"][data-delta="${-delta}"]`,
        )
        ?.focus({ preventScroll: true });
    });
  });
  main
    .querySelectorAll<HTMLSelectElement>("[data-assign]")
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
    if (
      checkWorkshop(work, answer).every(Boolean) &&
      !progress.workshopDone.includes(lesson.id)
    )
      progress.workshopDone.push(lesson.id);
    workshopFeedback.add(lesson.id);
    persist();
    render();
  });
  main.querySelector("#draft")?.addEventListener("input", (event) => {
    const text = (event.target as HTMLTextAreaElement).value;
    progress.drafts[key] = text;
    progress.writingDone = progress.writingDone.filter(
      (entry) => entry !== key,
    );
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
    persist();
    refreshLessonStatus(lesson);
  });
  main.querySelector("#compare")?.addEventListener("click", () => {
    if (!canReviewDraft(progress.drafts[key] ?? "")) return;
    comparisons.add(key);
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
    progress.writingDone = progress.writingDone.filter(
      (entry) => entry !== key,
    );
    persist();
    render();
    main.querySelector<HTMLTextAreaElement>("#draft")?.focus();
  });
  main.querySelectorAll("[data-zam]").forEach((button) => {
    button.addEventListener("click", showZam);
  });
}

function bindModel(lesson: Lesson): void {
  if (!lesson.model) return;
  const kind = lesson.model;
  const update = (state: ModelState, selector?: string) => {
    modelStates.set(lesson.id, state);
    const container = main.querySelector(".exploration");
    if (container) container.outerHTML = lessonModel(lesson);
    bindModel(lesson);
    persist();
    refreshLessonStatus(lesson);
    if (selector)
      main.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });
  };
  main
    .querySelectorAll<HTMLButtonElement>("[data-scenario]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.scenario!;
        if (!MODEL_SCENARIOS[kind].some((s) => s.id === id)) return;
        progress.explored[lesson.id] = recordExploration(
          kind,
          progress.explored[lesson.id] ?? [],
          id,
        );
        update(
          applyScenario(kind, modelStates.get(lesson.id)!, id),
          `[data-scenario="${id}"]`,
        );
      });
    });
  main
    .querySelectorAll<HTMLInputElement>("[data-model-range]")
    .forEach((input) => {
      input.addEventListener("change", () => {
        const key = input.dataset.modelRange!,
          value = Number(input.value);
        update(
          setModelValue(kind, modelStates.get(lesson.id)!, key, value),
          `[data-model-range="${key}"]`,
        );
      });
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
    "Physik mit ZAM behalten",
    `<p>Hier erarbeitest du Zusammenhänge. ZAM erinnert dich später mit kurzen Fragen daran. Jede Karte führt zur passenden Lektion zurück. Die Zelle enthält 70 Karten zu den Kernlektionen beider Zweige und zwei Zusatzkarten zum Effektivwert. Die Auswahl im Lernpfad filtert nur diese App, nicht die Kartenaufnahme in ZAM. Das Angebot erscheint in ZAM nach der Veröffentlichung und Übernahme der Academy-Zelle.</p><ol><li>Öffne ZAM Studio → Lern-Karten → Importieren → „Aus der ZAM Academy“.</li><li>Wähle „${esc(ZAM_CELL_TITLE)}“ und „Aufnehmen“.</li></ol><p>Oder sage deinem Agenten in ZAM:</p><div class="request"><code>${esc(request)}</code><button type="button" class="button secondary" id="copy">Kopieren</button></div><p class="small" id="copy-status" role="status">Dein App-Fortschritt und deine Texte werden dabei nicht übertragen.</p><button type="button" class="button accent" data-close>Weiterlernen</button>`,
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
    `<p>Die Schnellchecks, Modellvergleiche, Werkstattabschlüsse, Selbsteinschätzungen, eigenen Texte und die Versuchsnotizen dieser App werden gelöscht. Das lässt sich nicht rückgängig machen.</p><div class="self-actions"><button type="button" class="button secondary" data-close>Abbrechen</button><button type="button" class="button danger" id="confirm-reset">Zurücksetzen</button></div>`,
  );
  element.querySelector("#confirm-reset")!.addEventListener("click", () => {
    progress = freshProgress();
    view = "path";
    activeExercises.clear();
    modelStates.clear();
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
      enableOptional(lesson);
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
        : new URLSearchParams(location.hash.slice(1)).get("view") ===
            "experiments"
          ? "experiments"
          : "path";
  persist();
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
    localStorage.setItem("physik_rs10_theme", theme);
  } catch {
    /* The current page still changes theme. */
  }
});
window.addEventListener("hashchange", applyDeepLink);
applyDeepLink();
