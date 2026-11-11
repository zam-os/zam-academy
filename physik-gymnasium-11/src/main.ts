import {
  curriculumUrl,
  findLesson,
  LESSONS,
  lessonsFor,
  SOURCES,
  STAGES,
  trackLabel,
} from "./curriculum";
import {
  createAttempt,
  type ExerciseAttempt,
  revealSolution,
  skipAttempt,
  submitAnswer,
} from "./exercises/attempt";
import { wrongAnswerHint } from "./exercises/checker";
import type { Lesson, Level, Track } from "./model/types";
import {
  MODEL_SCENARIOS,
  modelReady,
  modelValues,
  recordExploration,
  setModelValue,
} from "./models";
import { pathLesson, visitLesson } from "./navigation";
import {
  completion,
  EXPERIMENT_SLOTS,
  experimentSummary,
  freshProgress,
  isComplete,
  loadProgress,
  saveProgress,
  writingKey,
} from "./storage/progress";
import { HERO_ART, ICONS, stageIcon } from "./ui/art";
import { renderIllustration } from "./ui/figures";
import {
  applyScenario,
  controlValue,
  initialModelState,
  type ModelState,
  renderModel,
  renderModelOutput,
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
/** Lessons whose figure the learner has set in motion; motion never starts on its own. */
const playing = new Set<string>();
/** The label of a lesson step: an icon in the accent of the Lernbereich and its name. */
const step = (icon: string, label: string): string =>
  `<span class="eyebrow"><span class="step-icon" aria-hidden="true">${icon}</span>${label}</span>`;
const activeExercises = new Map<string, ExerciseAttempt>();
function exerciseFor(lesson: Lesson): ExerciseAttempt {
  const key = writingKey(lesson.id, progress.level);
  let entry = activeExercises.get(key);
  if (!entry) {
    entry = createAttempt(progress, lesson, progress.level);
    activeExercises.set(key, entry);
  }
  return entry;
}
function renderCalculation(lesson: Lesson): string {
  if (!lesson.calculation) return "";
  const key = writingKey(lesson.id, progress.level),
    entry = exerciseFor(lesson),
    task = entry.task;
  return `<section class="panel calculation"><div class="panel-heading">${step(ICONS.calculator, `SELBST RECHNEN · LEVEL ${progress.level}`)}<span class="done-mark">${progress.calculationDone[key] ?? 0} / 3 eigenständig gelöst</span></div><h2>Mit Einheiten rechnen</h2><p>${esc(task.prompt)}</p>${progress.level === 1 ? `<details><summary>Formelhilfe</summary><p>${esc(task.formulaHint ?? "")}</p></details>` : ""}<form id="calculation-form"><label for="calculation-answer">Dein Ergebnis in ${esc(task.unit)}</label><div class="calculation-input"><input id="calculation-answer" type="text" inputmode="decimal" autocomplete="off" ${entry.finished ? "disabled" : ""}><span>${esc(task.unit)}</span><button type="submit" class="button accent" ${entry.finished ? "disabled" : ""}>Prüfen</button></div></form><p class="small">Dezimalkomma oder Dezimalpunkt sind möglich. Runde auf drei Nachkommastellen; ein passendes genaueres Ergebnis wird ebenfalls akzeptiert.</p>${entry.message ? `<p role="status" class="feedback ${entry.finished && !entry.assisted ? "success" : "hint"}">${esc(entry.message)}</p>` : ""}<div class="self-actions"><button type="button" id="show-calculation" class="text-button" ${entry.solution ? "disabled" : ""}>Lösung ansehen</button><button type="button" id="next-calculation" class="button secondary">Neue Aufgabe</button></div>${entry.solution ? `<div class="model-answer"><h3>Rechenweg</h3><p>${task.solutionHtml}</p><p class="small">Eine vor dem Lösen geöffnete Musterlösung zählt nicht als eigenständig gelöste Aufgabe.</p></div>` : ""}</section>`;
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
        result = submitAnswer(progress, entry, input.value);
      if (!result) return;
      if (result.status === "correct") {
        entry.message =
          "Richtig gerechnet. Diese Aufgabe zählt zu deinem Übungsfortschritt.";
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
    revealSolution(progress, entry);
    entry.message =
      "Lösung geöffnet. Starte eine neue Aufgabe, um selbst weiterzuüben.";
    persist();
    render();
  });
  main.querySelector("#next-calculation")?.addEventListener("click", () => {
    skipAttempt(progress, entry);
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
  const r = experimentSummary(progress.experiments, progress.track);
  return `${r.count} / ${r.total} Schülerexperimente als selbst durchgeführt dokumentiert. Die App prüft nur ausgefüllte Felder; Durchführung und fachliche Qualität werden im Unterricht besprochen.`;
}
function renderExperiments(): string {
  return `<section class="reference">${step(ICONS.flask, "VOM MODELL ZUR MESSUNG")}<h1>Dein Versuchsnotizbuch</h1><p>Der Fachlehrplan nennt für alle Ausbildungsrichtungen zwei Schülerexperimente: die Abhängigkeit der Zentripetalkraft von verschiedenen Größen und die Schwingungsdauer eines Fadenpendels. Am NTG kommt die Kennlinie einer Solarzelle hinzu. Verwende schulische Geräte nach Anleitung.</p><p class="feedback hint" id="experiment-status" role="status">${esc(experimentStatus())}</p><p class="small">Simulationen gehören zum Modellvergleich und zählen hier nicht als selbst durchgeführte Experimente. Die Auswahl „selbst durchgeführt“ ist deine eigene Angabe und keine geprüfte Bestätigung. Alle Notizen bleiben in diesem Browser.</p>${progress.experiments
    .map((e, i) =>
      e.lb === 4 && progress.track !== "NTG"
        ? ""
        : `<section class="panel" data-lb="${e.lb}"><h2><span class="stage-icon" aria-hidden="true">${stageIcon(e.lb)}</span>${esc(EXPERIMENT_SLOTS[i].title)}</h2><div class="model-controls"><label>Stand<select data-experiment="${i}" data-field="status"><option value="planned" ${e.status === "planned" ? "selected" : ""}>Geplant</option><option value="done" ${e.status === "done" ? "selected" : ""}>Selbst durchgeführt · eigene Angabe</option></select></label></div>${Object.entries(
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
          if (field === "status")
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
function lessonModel(lesson: Lesson): string {
  if (!lesson.model) return "";
  if (!modelStates.has(lesson.id))
    modelStates.set(lesson.id, initialModelState());
  return renderModel(
    lesson,
    progress.explored[lesson.id] ?? [],
    modelStates.get(lesson.id)!,
    playing.has(lesson.id),
  );
}
function refreshLessonStatus(lesson: Lesson): void {
  const model = main.querySelector("#aside-model");
  if (model && lesson.model) {
    const ready = modelReady(lesson.model, progress.explored[lesson.id] ?? []);
    model.textContent = `${ready ? "✓" : "○"} Vergleichssituationen geöffnet`;
    model.classList.toggle("done", ready);
  }
  const calculation = main.querySelector("#aside-calculation");
  if (calculation && lesson.calculation) {
    const solved = progress.calculationDone[writingKey(lesson.id, 1)] ?? 0;
    calculation.textContent = `${solved} / 3 Rechenaufgaben in Level 1`;
    calculation.classList.toggle("done", solved >= 3);
  }
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
  if (next === "path") progress.activeLessonId = pathLesson(progress).id;
  const fragment =
    next === "lesson"
      ? `#lesson=${progress.activeLessonId}&level=${progress.level}`
      : next === "reference"
        ? "#view=reference"
        : next === "experiments"
          ? "#view=experiments"
          : "";
  history.pushState(null, "", pageUrl(fragment));
  persist();
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
    `${stats.completed} / ${stats.total} Lektionen · ${trackLabel(progress.track)}`;
  (document.getElementById("progress") as HTMLProgressElement).value =
    stats.percent;
  const curriculum = document.getElementById(
    "curriculum-link",
  ) as HTMLAnchorElement;
  curriculum.href = curriculumUrl(progress.track);
  curriculum.textContent = "LehrplanPLUS Bayern · Physik 11 Gymnasium";
}

function openLesson(id: string): void {
  const lesson = visitLesson(progress, id);
  if (!lesson) return;
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
  const resume = pathLesson(progress);
  return `<section class="hero"><div class="hero-copy"><span class="eyebrow">PHYSIK 11 · GYMNASIUM BAYERN</span><h1><span data-lb="1">Kreisen,</span> <span data-lb="2">schwingen,</span><br> <span data-lb="3">Weltbilder prüfen.</span></h1><p>Entdecke, welche Kraft einen Satelliten auf seiner Bahn hält, warum Licht Streifen wirft und wie Einstein Raum und Zeit neu ordnete. Vergleiche Modelle, rechne selbst und begründe deine Urteile.</p><div class="hero-actions"><button type="button" class="button accent large" data-open="${esc(resume.id)}">${ICONS.play}${stats.completed ? "Weiterlernen" : "Loslegen"}</button><span class="hero-resume">${stats.completed ? "Weiter mit" : "Start mit"}: ${esc(resume.title)}</span></div></div><aside class="hero-card">${HERO_ART}<span class="eyebrow">DAS PHYSIKALISCHE WELTBILD IM WANDEL</span><strong class="hero-steps"><span>Vorhersagen</span><span>Prüfen</span><span>Begründen</span></strong><ul class="hero-facts"><li><b>${lessonsFor("ANDERE").length}</b> Lektionen für alle, ${lessonsFor("NTG").length} am NTG</li><li><b>${LESSONS.filter((l) => l.model).length}</b> Modelle mit Zeichnung zum Verändern</li><li><b>2</b> Stufen: geführt und Transfer</li></ul><p class="small">Drei Lernbereiche für alle, dazu der Profilbereich am NTG. Ein Abschluss verbindet Schnellcheck, Werkstatt und eine selbst eingeschätzte Begründung. Modelllektionen verlangen die Vergleiche, Rechenlektionen drei eigenständig gelöste Aufgaben in Level 1.</p></aside></section>
  <div class="path-heading"><div><h2>Dein Lernpfad</h2><p>Alle Lektionen sind frei zugänglich. Wähle deine Ausbildungsrichtung; dein Fortschritt bleibt beim Wechsel erhalten.</p></div><div class="path-filters"><label>Ausbildungsrichtung <select id="track"><option value="ANDERE" ${progress.track === "ANDERE" ? "selected" : ""}>SG, WSG, HG, MuG · Lernbereiche 1 bis 3</option><option value="NTG" ${progress.track === "NTG" ? "selected" : ""}>NTG · mit Profilbereich</option></select></label></div></div>
  <div class="stages">${STAGES.map((stage) => {
    const lessons = visibleLessons().filter((l) => l.lb === stage.lb);
    if (lessons.length === 0) return "";
    const core = lessons.filter((l) => !l.optional),
      complete = core.filter((l) => isComplete(progress, l.id)).length;
    return `<section class="stage" data-lb="${stage.lb}"><div class="stage-header"><span class="stage-icon" aria-hidden="true">${stageIcon(stage.lb)}</span><div class="stage-title"><span class="eyebrow">LERNBEREICH ${stage.lb}</span><h3>${esc(stage.shortTitle)}</h3><p class="small">${esc(stage.title)}</p></div><div class="stage-meter"><span class="stage-count">${complete} / ${core.length}</span><span class="meter" aria-hidden="true"><span style="width:${core.length ? Math.round((100 * complete) / core.length) : 0}%"></span></span></div></div><ol>${lessons
      .map((lesson, i) => {
        const done = isComplete(progress, lesson.id);
        return `<li><button type="button" class="lesson-link ${done ? "complete" : ""}" data-open="${lesson.id}"><span class="lesson-dot" aria-hidden="true">${done ? "✓" : i + 1}</span><span class="lesson-text"><strong>${esc(lesson.title)}</strong><small>${lesson.optional ? "Zusatz · optional" : esc(lesson.intro)}</small></span><span class="lesson-tags">${lesson.model ? `<span class="tag">${ICONS.lab}Modell</span>` : ""}${lesson.calculation ? `<span class="tag">${ICONS.calculator}Rechnen</span>` : ""}<span class="lesson-status">${status(lesson)}</span></span></button></li>`;
      })
      .join("")}</ol></section>`;
  }).join("")}</div>
  <aside class="scope-note"><h2>${ICONS.flask}Vom Modell zum echten Versuch</h2><p>Der Lehrplan nennt zwei Schülerexperimente für alle (Zentripetalkraft, Fadenpendel) und im Profilbereich des NTG ein drittes (Solarzelle). Die Modelle hier ersetzen sie nicht. Im Versuchsnotizbuch hältst du Planung und eigene Messungen fest; besprich sie im Unterricht.</p><button type="button" class="button secondary" data-view="experiments">Versuchsnotizbuch öffnen</button><p>Lernbereich 3 erarbeitest du im Unterricht in längeren eigenverantwortlichen Phasen, meist in Gruppen, mit Recherche und Präsentation. Die Lektionen hier liefern dafür das Fachwissen und Übungen im Prüfen von Quellen und Argumenten.</p><a href="${curriculumUrl(progress.track)}" target="_blank" rel="noopener">Zum offiziellen Fachlehrplan</a></aside><button type="button" id="reset" class="text-button">Lokalen Fortschritt zurücksetzen</button>`;
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
  return `<section class="panel workshop" aria-labelledby="workshop-heading"><div class="panel-heading">${step(ICONS.workshop, "02 · WERKSTATT")}<span class="done-mark">${progress.workshopDone.includes(lesson.id) ? "✓ Einmal gelöst" : ""}</span></div><h2 id="workshop-heading">${esc(work.title)}</h2><p>${esc(work.instruction)}</p>
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
  return `<section class="panel writing" aria-labelledby="writing-heading"><div class="panel-heading">${step(ICONS.pencil, "03 · SELBST BEGRÜNDEN")}<span class="done-mark" id="writing-done">${progress.writingDone.includes(key) ? "✓ Selbst eingeschätzt" : ""}</span></div><h2 id="writing-heading">${progress.level === 1 ? "Mit Leitfragen arbeiten" : "Auf einen neuen Fall übertragen"}</h2><p class="task-prompt" lang="${"de"}">${esc(task.prompt)}</p>
  ${progress.level === 1 ? `<details><summary>Leitfragen anzeigen</summary><ul>${task.hints.map((hint) => `<li>${esc(hint)}</li>`).join("")}</ul></details>` : `<p class="small">Formuliere erst deinen eigenen Gedankengang. Die Vergleichsantwort folgt danach.</p>`}
  <label class="answer-label" for="draft">Deine Antwort</label><textarea id="draft" rows="5" maxlength="8000" placeholder="Schreibe zwei bis vier begründete Sätze …">${esc(draft)}</textarea><p class="small">Dein Text bleibt in diesem Browser. Er wird nicht automatisch bewertet.</p><button type="button" id="compare" class="button secondary" ${canReviewDraft(draft) ? "" : "disabled"}>Mit einer möglichen Antwort vergleichen</button><span class="small" id="draft-note">${canReviewDraft(draft) ? "" : "Schreibe zunächst mindestens 20 Zeichen."}</span>
  ${comparing ? `<div class="model-answer"><h3>Eine mögliche Antwort</h3><p lang="${"de"}">${esc(task.model)}</p><p>Andere Formulierungen und begründete Urteile sind möglich. Vergleiche deinen Text anhand dieser Kriterien:</p><div class="rubric">${task.criteria.map((criterion, i) => `<label><input type="checkbox" data-rubric="${i}" ${checks[i] ? "checked" : ""}>${esc(criterion)}</label>`).join("")}</div><div class="self-actions"><button type="button" class="button accent" id="accept-writing" ${canAcceptSelfAssessment(draft, checks) ? "" : "disabled"}>Meine Antwort erfüllt die Kriterien</button><button type="button" class="text-button" id="revise-writing">Ich überarbeite noch</button></div><p class="small">Diese Einschätzung gibst du selbst ab. Sie ist keine automatische Prüfung und verändert keine ZAM-Karten.</p></div>` : ""}</section>`;
}

/** A paragraph that opens with "Beispiel:" is set apart as the worked example. */
function paragraph(text: string): string {
  return text.startsWith("Beispiel: ")
    ? `<p class="example"><strong>Beispiel</strong>${esc(text.slice(10))}</p>`
    : `<p>${esc(text)}</p>`;
}

function renderLesson(): string {
  const lesson = findLesson(progress.activeLessonId)!;
  const stage = STAGES.find((entry) => entry.lb === lesson.lb)!;
  const options = shuffle([0, 1, 2], `${lesson.id}:quiz`);
  const labels = [lesson.quiz.answer, ...lesson.quiz.wrong];
  const selected = quizSelections.get(lesson.id);
  const visible = visibleLessons();
  const index = visible.indexOf(lesson);
  const inStage = visible.filter((entry) => entry.lb === lesson.lb);
  const scopeNotice =
    index < 0
      ? lesson.optional
        ? "Du siehst eine Zusatzlektion. Deine Auswahl im Lernpfad bleibt unverändert."
        : "Diese Lektion gehört zum Profilbereich des NTG. Dein Lernpfad bleibt bei deiner Ausbildungsrichtung; du kannst hier zusätzlich üben."
      : "";
  const check = (done: boolean, id = "") =>
    `<li${id ? ` id="${id}"` : ""}${done ? ' class="done"' : ""}>`;
  const modelDone = lesson.model
      ? modelReady(lesson.model, progress.explored[lesson.id] ?? [])
      : false,
    solved = progress.calculationDone[writingKey(lesson.id, 1)] ?? 0,
    quizDone = progress.quizDone.includes(lesson.id),
    workshopDone = progress.workshopDone.includes(lesson.id),
    writingDone = progress.writingDone.includes(writingKey(lesson.id, 1));
  return `<article lang="de" data-lb="${lesson.lb}"><div class="lesson-top"><button type="button" class="text-button" data-view="path">← Zum Lernpfad</button><label class="level-select">Arbeitsweise <select id="level"><option value="1" ${progress.level === 1 ? "selected" : ""}>Level 1 · mit Leitfragen</option><option value="2" ${progress.level === 2 ? "selected" : ""}>Level 2 · Transfer</option></select></label></div>
  <header class="lesson-heading"><div class="lesson-kicker"><span class="stage-icon" aria-hidden="true">${stageIcon(lesson.lb)}</span><span class="eyebrow">Lernbereich ${lesson.lb} · ${esc(stage.shortTitle)}${lesson.optional ? " · ZUSATZ" : ""}</span>${index >= 0 ? `<span class="lesson-count">Lektion ${inStage.indexOf(lesson) + 1} von ${inStage.length}</span>` : ""}</div><h1 lang="${"de"}">${esc(lesson.title)}</h1><p class="period">${esc(lesson.period)}</p><p class="intro">${esc(lesson.intro)}</p>${scopeNotice ? `<p class="feedback hint">${esc(scopeNotice)}</p>` : ""}</header>
  <div class="lesson-columns"><div class="lesson-content"><section class="panel reading" lang="${"de"}">${step(ICONS.book, "01 · VERSTEHEN")}${lesson.paragraphs.map(paragraph).join("")}${renderIllustration(lesson.id)}<p class="takeaway"><span class="step-icon" aria-hidden="true">${ICONS.bulb}</span><strong>Merke</strong><span>${esc(lesson.takeaway)}</span></p>${lesson.formulas?.length ? `<div class="formula-strip"><span class="eyebrow">Formeln und Begriffe</span><ul>${lesson.formulas.map((formula) => `<li>${esc(formula)}</li>`).join("")}</ul></div>` : ""}</section>
  <section class="panel quiz" lang="${"de"}"><div class="panel-heading"><h2 class="icon-heading"><span class="step-icon" aria-hidden="true">${ICONS.quiz}</span>Schnellcheck</h2><span class="done-mark">${quizDone ? "✓ Einmal richtig" : ""}</span></div><p>${esc(lesson.quiz.question)}</p><div class="quiz-options">${options.map((i, position) => `<button type="button" data-choice="${i}" class="quiz-choice ${selected === i ? `selected ${i === 0 ? "correct" : "wrong"}` : ""}" aria-pressed="${selected === i}"><span class="choice-key" aria-hidden="true">${selected === i ? (i === 0 ? "✓" : "✗") : "ABC"[position]}</span><span>${esc(labels[i])}</span></button>`).join("")}</div>${selected !== undefined ? `<p class="feedback ${selected === 0 ? "success" : "hint"}" role="status"><strong>${selected === 0 ? "Richtig. " : "Prüfe noch einmal. "}</strong>${esc(lesson.quiz.explanation)}</p>` : ""}</section>
  ${lessonModel(lesson)}${renderWorkshop(lesson)}${renderCalculation(lesson)}${renderWriting(lesson)}</div><aside class="lesson-aside"><section class="aside-card"><h2>Dein Lernschritt</h2><ul class="checklist">${lesson.model ? `${check(modelDone, "aside-model")}${modelDone ? "✓" : "○"} Vergleichssituationen geöffnet</li>` : ""}${lesson.calculation ? `${check(solved >= 3, "aside-calculation")}${solved} / 3 Rechenaufgaben in Level 1</li>` : ""}${check(quizDone)}${quizDone ? "✓" : "○"} Schnellcheck</li>${check(workshopDone)}${workshopDone ? "✓" : "○"} Werkstatt gelöst</li>${check(writingDone, "aside-writing")}${writingDone ? "✓" : "○"} Level 1 selbst eingeschätzt</li></ul><p class="small" id="lesson-status">${isComplete(progress, lesson.id) ? "✓ Diese Lektion ist abgeschlossen." : "Bearbeite die offenen Lernschritte. Deine Texte schätzt du selbst ein."}</p><p class="small">Level 2 ist eine zusätzliche Vertiefung. Die Kernfortschritte zählen Level 1.</p></section><section class="aside-card"><h2>Belege & weiterlernen</h2><ul class="source-list">${lesson.sourceIds
    .map((id) => SOURCES.find((source) => source.id === id)!)
    .map(
      (source) =>
        `<li><a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)} ↗</a></li>`,
    )
    .join(
      "",
    )}</ul><p class="small">Die Texte und Übungsdaten sind eigens verfasst. Die verlinkten Fachquellen ermöglichen eine weitere Prüfung.</p></section><section class="aside-card zam"><h2>Damit es bleibt</h2><p class="small">ZAM hält das Wissen mit kurzen Wiederholungen fest. Jede Karte führt hierher zurück.</p><button type="button" class="button secondary" data-zam>${ICONS.cards}In ZAM festigen</button></section></aside></div>
  <nav class="lesson-navigation" aria-label="Lektionen">${index > 0 ? `<button type="button" data-open="${visible[index - 1].id}" class="button secondary">← Vorherige Lektion</button>` : "<span></span>"}${index >= 0 && index < visible.length - 1 ? `<button type="button" data-open="${visible[index + 1].id}" class="button accent">Nächste Lektion →</button>` : `<button type="button" data-view="path" class="button accent">Zum Lernpfad</button>`}</nav></article>`;
}

function renderReference(): string {
  return `<section class="reference">${step(ICONS.book, "NACHSCHLAGEN")}<h1>Formelsammlung und Merksätze</h1><p>Merksätze, Formeln und Fachbegriffe der Lektionen deiner Ausbildungsrichtung. Für Herleitungen, Beispiele und Urteile öffnest du die jeweilige Lektion.</p>${STAGES.map(
    (stage) =>
      `<section class="panel" data-lb="${stage.lb}"><h2><span class="stage-icon" aria-hidden="true">${stageIcon(stage.lb)}</span>${esc(stage.shortTitle)}</h2><dl>${visibleLessons()
        .filter((lesson) => lesson.lb === stage.lb)
        .map(
          (lesson) =>
            `<dt><button type="button" data-open="${lesson.id}" class="text-button">${esc(lesson.title)}</button></dt><dd>${esc(lesson.takeaway)}${lesson.formulas?.length ? `<ul class="formula-list">${lesson.formulas.map((formula) => `<li>${esc(formula)}</li>`).join("")}</ul>` : ""}</dd>`,
        )
        .join("")}</dl></section>`,
  ).join(
    "",
  )}<section class="panel"><h2>Quellenbasis</h2><p>Lehrplanabgleich und Quellenprüfung: 10. November 2026. Verlinkte Angebote öffnen erst, wenn du darauf klickst. Die App selbst benötigt keine externe Verbindung.</p><ul class="source-list">${SOURCES.map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)}</a></li>`).join("")}</ul></section></section>`;
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
    main.querySelector(".writing .model-answer")?.remove();
    (main.querySelector("#compare") as HTMLButtonElement).disabled =
      !canReviewDraft(text);
    main.querySelector("#draft-note")!.textContent = canReviewDraft(text)
      ? ""
      : "Schreibe zunächst mindestens 20 Zeichen.";
    main.querySelector("#writing-done")!.textContent = "";
    if (progress.level === 1) {
      const aside = main.querySelector("#aside-writing")!;
      aside.textContent = "○ Level 1 selbst eingeschätzt";
      aside.classList.remove("done");
    }
    persist();
    refreshLessonStatus(lesson);
  });
  main.querySelector("#compare")?.addEventListener("click", () => {
    if (!canReviewDraft(progress.drafts[key] ?? "")) return;
    comparisons.add(key);
    render();
    main.querySelector(".writing .model-answer")?.scrollIntoView({
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
  // Figure and readouts follow a slider while it moves; the slider itself stays in place.
  const refreshOutput = () => {
    const output = main.querySelector(".exploration .model-output");
    if (output)
      output.outerHTML = renderModelOutput(
        kind,
        modelValues(kind, modelStates.get(lesson.id)!),
        playing.has(lesson.id),
      );
    bindMotion();
  };
  const bindMotion = () => {
    main.querySelector("[data-motion]")?.addEventListener("click", () => {
      if (!playing.delete(lesson.id)) playing.add(lesson.id);
      refreshOutput();
      main
        .querySelector<HTMLElement>("[data-motion]")
        ?.focus({ preventScroll: true });
    });
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
      const key = input.dataset.modelRange!;
      input.addEventListener("input", () => {
        const value = Number(input.value);
        modelStates.set(
          lesson.id,
          setModelValue(kind, modelStates.get(lesson.id)!, key, value),
        );
        const shown = main.querySelector(`[data-value-for="${key}"]`);
        if (shown) shown.textContent = controlValue(kind, key, value);
        refreshOutput();
      });
      // On release the whole lab is rendered again, so the comparison buttons follow.
      input.addEventListener("change", () => {
        update(
          setModelValue(
            kind,
            modelStates.get(lesson.id)!,
            key,
            Number(input.value),
          ),
          `[data-model-range="${key}"]`,
        );
      });
    });
  main
    .querySelectorAll<HTMLButtonElement>("[data-model-choice]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.modelChoice!,
          value = button.dataset.value!;
        update(
          setModelValue(kind, modelStates.get(lesson.id)!, key, Number(value)),
          `[data-model-choice="${key}"][data-value="${value}"]`,
        );
      });
    });
  bindMotion();
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
    `<p>Hier erarbeitest du Zusammenhänge. ZAM erinnert dich später mit kurzen Fragen daran. Jede Karte führt zur passenden Lektion zurück. Die Zelle enthält 102 Karten zu allen 34 Lektionen; 24 davon gehören zum Profilbereich des NTG. Die Auswahl im Lernpfad filtert nur diese App, nicht die Kartenaufnahme in ZAM. Das Angebot erscheint in ZAM nach der Veröffentlichung und Übernahme der Academy-Zelle.</p><ol><li>Öffne ZAM Studio → Lern-Karten → Importieren → „Aus der ZAM Academy“.</li><li>Wähle „${esc(ZAM_CELL_TITLE)}“ und „Aufnehmen“.</li></ol><p>Oder sage deinem Agenten in ZAM:</p><div class="request"><code>${esc(request)}</code><button type="button" class="button secondary" id="copy">Kopieren</button></div><p class="small" id="copy-status" role="status">Dein App-Fortschritt und deine Texte werden dabei nicht übertragen.</p><button type="button" class="button accent" data-close>Weiterlernen</button>`,
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
    playing.clear();
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
    const lesson = visitLesson(progress, link.lessonId);
    if (lesson) {
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
    localStorage.setItem("physik_gym11_theme", theme);
  } catch {
    /* The current page still changes theme. */
  }
});
window.addEventListener("hashchange", applyDeepLink);
applyDeepLink();
