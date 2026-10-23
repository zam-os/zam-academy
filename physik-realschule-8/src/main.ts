import {
  ALL_LESSONS,
  findLessonById,
  findStageById,
  lessonsForTrack,
  nextLesson,
  previousLesson,
  STAGES,
} from "./curriculum";
import { checkAnswer, wrongAnswerHint } from "./exercises/checker";
import { esc, escScript, fmt, fmtUnit } from "./exercises/format";
import { createRng, seedFrom } from "./exercises/rng";
import {
  clampParam,
  computeReadouts,
  defaultLabValues,
  reachedGoals,
} from "./lab/engine";
import { renderLabVisual } from "./lab/visuals";
import type {
  DifficultyLevel,
  ExerciseTask,
  LabValues,
  Lesson,
  Stage,
} from "./model/types";
import { TRACK_LABELS, TRACK_LONG_LABELS } from "./model/types";
import {
  DEFAULT_LESSON_ID,
  goalsReached,
  isLessonComplete,
  isQuizDone,
  isElectiveStage,
  isStageComplete,
  isTransferDone,
  type LearnerProgress,
  loadLearnerProgress,
  overallStats,
  relevantLessons,
  requiredLessons,
  resetLearnerProgress,
  saveLearnerProgress,
  solvedCount,
  stageStats,
  type TrackFilter,
} from "./storage/progress";
import { confirmReset, showStageCelebration, showZamDialog } from "./ui/dialogs";
import { showToast } from "./ui/toast";
import { lessonLink, parseTrainingDeepLink } from "./zam/zam-link";

type ActiveView = "path" | "lesson" | "formulas";

const THEME_KEY = "physik_rs8_theme";

class PhysikApp {
  private progress: LearnerProgress;
  private view: ActiveView = "path";
  private readonly labValues = new Map<string, LabValues>();
  private task: ExerciseTask | null = null;
  private taskLessonId = "";
  private taskLevel: DifficultyLevel = 1;
  private taskWrongAttempts = 0;
  private taskRevealed = false;
  private taskSolved = false;

  constructor() {
    this.progress = loadLearnerProgress();
    if (!findLessonById(this.progress.activeLessonId)) {
      this.progress.activeLessonId = DEFAULT_LESSON_ID;
    }
    this.applyTheme(readStoredTheme());
    this.applyDeepLink();
    this.setupHeader();
    this.syncHeader();
    this.render();
    window.addEventListener("hashchange", () => {
      if (this.applyDeepLink()) {
        this.syncHeader();
        this.render();
        window.scrollTo({ top: 0 });
      }
    });
  }

  // ─── URL and header ─────────────────────────────────────────────────────

  /** Opens the lesson a ZAM card cites (`#lesson=<id>`, optionally `&level=2`). */
  private applyDeepLink(): boolean {
    const parsed = parseTrainingDeepLink(window.location.hash, window.location.search);
    let changed = false;
    if (parsed.level && parsed.level !== this.progress.difficultyLevel) {
      this.progress.difficultyLevel = parsed.level;
      changed = true;
    }
    if (parsed.lessonId && findLessonById(parsed.lessonId)) {
      if (parsed.lessonId !== this.progress.activeLessonId || this.view !== "lesson") {
        this.progress.activeLessonId = parsed.lessonId;
        this.view = "lesson";
        this.resetTask();
        changed = true;
      }
    }
    if (changed) saveLearnerProgress(this.progress);
    return changed;
  }

  private setupHeader(): void {
    document.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((button) => {
      button.addEventListener("click", () => {
        const view = button.dataset.view as ActiveView;
        this.switchView(view);
      });
    });
    document.querySelectorAll<HTMLButtonElement>("[data-level]").forEach((button) => {
      button.addEventListener("click", () => {
        const level = Number(button.dataset.level) === 2 ? 2 : 1;
        if (level === this.progress.difficultyLevel) return;
        this.progress.difficultyLevel = level;
        saveLearnerProgress(this.progress);
        this.resetTask();
        this.syncHeader();
        if (this.view === "lesson") this.render();
        showToast(
          level === 2
            ? "Level 2: Textaufgaben ohne Formelhilfe."
            : "Level 1: Formel und Werte werden angezeigt.",
          "info",
          2600,
        );
      });
    });
    document.getElementById("zam-btn")?.addEventListener("click", () => showZamDialog());
    document.getElementById("theme-toggle-btn")?.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme ?? systemTheme();
      const next = current === "dark" ? "light" : "dark";
      this.applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // ignore
      }
    });
  }

  private applyTheme(theme: "light" | "dark" | null): void {
    if (theme) document.documentElement.dataset.theme = theme;
    else delete document.documentElement.dataset.theme;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
    if (meta) meta.content = theme ?? "light dark";
  }

  private syncHeader(): void {
    document.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === this.view);
    });
    document.querySelectorAll<HTMLButtonElement>("[data-level]").forEach((button) => {
      button.classList.toggle(
        "is-active",
        Number(button.dataset.level) === this.progress.difficultyLevel,
      );
    });
    const stats = overallStats(this.progress, STAGES, this.progress.trackFilter);
    const text = document.getElementById("header-progress-text");
    const bar = document.getElementById("header-progress-bar");
    if (text) text.textContent = `${stats.completed} / ${stats.total} Lektionen`;
    if (bar) bar.style.width = `${stats.percent}%`;
    const pill = document.getElementById("header-progress");
    if (pill) pill.title = `${stats.percent} % des Lernpfads, ${stats.completedStages} von ${stats.totalStages} Etappen abgeschlossen`;
  }

  private switchView(view: ActiveView): void {
    this.view = view;
    if (view === "lesson") {
      this.setLessonHash(this.progress.activeLessonId);
    } else if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    this.syncHeader();
    this.render();
  }

  private setLessonHash(lessonId: string): void {
    const target = `#lesson=${encodeURIComponent(lessonId)}`;
    if (window.location.hash !== target) {
      history.replaceState(null, "", target);
    }
  }

  private openLesson(lessonId: string): void {
    if (!findLessonById(lessonId)) return;
    this.progress.activeLessonId = lessonId;
    saveLearnerProgress(this.progress);
    this.resetTask();
    this.view = "lesson";
    this.setLessonHash(lessonId);
    this.syncHeader();
    this.render();
    window.scrollTo({ top: 0 });
  }

  private resetTask(): void {
    this.task = null;
    this.taskLessonId = "";
    this.taskWrongAttempts = 0;
    this.taskRevealed = false;
    this.taskSolved = false;
  }

  private render(): void {
    const host = document.getElementById("main-view-host");
    if (!host) return;
    if (this.view === "path") this.renderPath(host);
    else if (this.view === "lesson") this.renderLesson(host);
    else this.renderFormulas(host);
  }

  // ─── View 1: Lernpfad ───────────────────────────────────────────────────

  private renderPath(host: HTMLElement): void {
    const filter = this.progress.trackFilter;
    const stats = overallStats(this.progress, STAGES, filter);
    const relevant = new Set(lessonsForTrack(filter).map((lesson) => lesson.id));
    const active = findLessonById(this.progress.activeLessonId) ?? findLessonById(DEFAULT_LESSON_ID)!;

    host.innerHTML = `
      <div class="path">
        <section class="hero">
          <div class="hero-copy">
            <h2>Physik 8 für die Realschule</h2>
            <p>Sieben Etappen nach den Lernbereichen des bayerischen LehrplanPLUS: Zweig II/III beginnt mit Mechanik, Optik, Magnetismus und Elektrizität, Zweig I mit Mechanik und Energie, Wärmelehre und Elektrizität. In jeder Lektion: kurz lesen, im Labor ausprobieren, dann rechnen. Was du hier verstehst, hält ZAM mit Karten fest, die auf die Lektion zurückverlinken.</p>
            <div class="hero-row">
              <label class="track-select">
                <span>Mein Zweig</span>
                <select id="track-filter">
                  <option value="alle" ${filter === "alle" ? "selected" : ""}>alle Lektionen</option>
                  <option value="I" ${filter === "I" ? "selected" : ""}>${TRACK_LONG_LABELS.I}</option>
                  <option value="II_III" ${filter === "II_III" ? "selected" : ""}>${TRACK_LONG_LABELS.II_III}</option>
                </select>
              </label>
              <button type="button" class="btn btn-primary" id="continue-btn">▶ Weiter mit ${esc(active.lesson.title)}</button>
            </div>
          </div>
          <div class="hero-stats">
            <div class="ring" style="--percent:${stats.percent}">
              <span>${stats.percent}%</span>
            </div>
            <p>${stats.completed} von ${stats.total} Lektionen<br>${stats.completedStages} von ${stats.totalStages} Etappen</p>
            <div class="badge-rack" aria-label="Abzeichen">
              ${STAGES.map((stage) => {
                const stageDone = isStageComplete(this.progress, stage, filter);
                const off = relevantLessons(stage, filter).length === 0;
                const title = off ? `${stage.badgeTitle}: keine Lektion in deinem Zweig` : stage.badgeTitle;
                return `<span class="badge ${stageDone ? "is-earned" : ""} ${off ? "is-off" : ""}" title="${esc(title)}">${stage.icon}</span>`;
              }).join("")}
            </div>
            <button type="button" class="btn btn-ghost btn-sm" id="reset-progress-btn">Fortschritt zurücksetzen</button>
          </div>
        </section>

        ${STAGES.map((stage) => this.renderStageCard(stage, relevant, filter)).join("")}
      </div>
    `;

    host.querySelector<HTMLSelectElement>("#track-filter")?.addEventListener("change", (event) => {
      const value = (event.target as HTMLSelectElement).value as TrackFilter;
      this.progress.trackFilter = value;
      saveLearnerProgress(this.progress);
      this.syncHeader();
      this.render();
    });
    host.querySelector("#continue-btn")?.addEventListener("click", () => this.openLesson(active.lesson.id));
    host.querySelector("#reset-progress-btn")?.addEventListener("click", () => {
      confirmReset(() => {
        this.progress = resetLearnerProgress();
        this.labValues.clear();
        this.resetTask();
        this.syncHeader();
        this.render();
        showToast("Fortschritt zurückgesetzt.", "info");
      });
    });
    host.querySelectorAll<HTMLElement>("[data-open-lesson]").forEach((element) => {
      element.addEventListener("click", () => this.openLesson(element.dataset.openLesson ?? ""));
    });
  }

  private renderStageCard(stage: Stage, relevant: Set<string>, filter: TrackFilter): string {
    const stats = stageStats(this.progress, stage, filter);
    const elective = isElectiveStage(stage);
    const progressLabel =
      stats.total === 0 ? "nicht in deinem Zweig" : `${stats.completed} / ${stats.total}${elective ? " · Wahl" : ""}`;
    return `
      <section class="stage-card" style="--accent:${stage.accent}">
        <header class="stage-head">
          <span class="stage-icon" aria-hidden="true">${stage.icon}</span>
          <div>
            <h3>Etappe ${stage.stageNumber}: ${esc(stage.title)}</h3>
            <p>${esc(stage.subtitle)} · <span class="muted">${esc(stage.lehrplanLabel)}</span></p>
            ${elective ? `<p class="stage-note">Wahlbereich: Der Lehrplan lässt eine der beiden Möglichkeiten genügen. Du kannst auch beide lernen.</p>` : ""}
          </div>
          <div class="stage-progress">
            <strong>${progressLabel}</strong>
            <div class="bar"><div style="width:${stats.percent}%"></div></div>
          </div>
        </header>
        <ol class="lesson-list">
          ${stage.lessons
            .map((lesson) => {
              const complete = isLessonComplete(this.progress, lesson);
              const transfer = isTransferDone(this.progress, lesson);
              const isRelevant = relevant.has(lesson.id);
              const quiz = isQuizDone(this.progress, lesson.id);
              const goals = goalsReached(this.progress, lesson.id).length;
              const solved1 = solvedCount(this.progress, lesson.id, 1);
              return `
              <li class="lesson-row ${complete ? "is-complete" : ""} ${isRelevant ? "" : "is-optional"} ${lesson.id === this.progress.activeLessonId ? "is-active" : ""}">
                <button type="button" class="lesson-link" data-open-lesson="${lesson.id}">
                  <span class="lesson-state" aria-hidden="true">${complete ? "✅" : "○"}</span>
                  <span class="lesson-text">
                    <strong>${esc(lesson.title)}</strong>
                    <small>${esc(lesson.subtitle)}</small>
                  </span>
                  <span class="lesson-meta">
                    ${lesson.tracks.map((track) => `<span class="chip chip-track">${TRACK_LABELS[track]}</span>`).join("")}
                    ${!isRelevant && filter !== "alle" ? `<span class="chip chip-optional">Zusatz</span>` : ""}
                    ${lesson.optional && !elective ? `<span class="chip chip-optional" title="Der Lehrplan lässt hier die Wahl: Flaschenzug oder Hebel">Wahl</span>` : ""}
                    <span class="chip ${quiz ? "is-done" : ""}" title="Schnellcheck">❓</span>
                    <span class="chip ${goals === lesson.lab.goals.length ? "is-done" : ""}" title="Laboraufträge">🔬 ${goals}/${lesson.lab.goals.length}</span>
                    <span class="chip ${solved1 >= lesson.requiredCorrect ? "is-done" : ""}" title="Aufgaben Level 1">🧮 ${Math.min(solved1, lesson.requiredCorrect)}/${lesson.requiredCorrect}</span>
                    ${transfer ? `<span class="chip is-done" title="Transfer gemeistert">🦅</span>` : ""}
                  </span>
                </button>
              </li>`;
            })
            .join("")}
        </ol>
      </section>
    `;
  }

  // ─── View 2: Lektion ────────────────────────────────────────────────────

  private renderLesson(host: HTMLElement): void {
    const found = findLessonById(this.progress.activeLessonId) ?? findLessonById(DEFAULT_LESSON_ID)!;
    const { stage, lesson } = found;
    const level = this.progress.difficultyLevel;
    const prev = previousLesson(lesson.id);
    const next = nextLesson(lesson.id);
    const quizDone = isQuizDone(this.progress, lesson.id);

    host.innerHTML = `
      <div class="lesson-grid" style="--accent:${stage.accent}">
        <section class="guide">
          <div class="stage-pill">${stage.icon} Etappe ${stage.stageNumber} · Lektion ${lesson.stepNumber} von ${stage.lessons.length}</div>
          <h2 class="lesson-title">${esc(lesson.title)}</h2>
          <p class="lesson-subtitle">${esc(lesson.subtitle)}</p>
          <select id="lesson-select" class="lesson-select" aria-label="Lektion wählen">
            ${STAGES.map(
              (st) => `<optgroup label="Etappe ${st.stageNumber}: ${esc(st.title)}">${st.lessons
                .map((l) => `<option value="${l.id}" ${l.id === lesson.id ? "selected" : ""}>${isLessonComplete(this.progress, l) ? "✓ " : ""}${esc(l.title)}</option>`)
                .join("")}</optgroup>`,
            ).join("")}
          </select>
          <p class="lehrplan-tag">${lesson.tracks.map((track) => `<span class="chip chip-track">${TRACK_LABELS[track]}</span>`).join("")} <span class="muted">${esc(lesson.lehrplan)}</span></p>

          <div class="why-box"><strong>Warum das wichtig ist:</strong> ${esc(lesson.whyItMatters)}</div>
          ${
            lesson.teacherVideo
              ? `
          <div class="video-box card">
            <div class="video-box-header">
              <span class="video-box-title">🎬 Erklärvideo${lesson.teacherVideo.author ? ` von ${esc(lesson.teacherVideo.author)}` : ""}</span>
            </div>
            <p class="video-box-desc">Zur Vorbereitung oder wenn du bei einer Aufgabe feststeckst:</p>
            <a href="${esc(lesson.teacherVideo.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm video-link">
              ▶ ${esc(lesson.teacherVideo.title)} ansehen ↗
            </a>
          </div>`
              : ""
          }
          <div class="explanation">${lesson.explanationHtml}</div>

          <div class="formula-box">
            <h4>Formeln dieser Lektion</h4>
            <dl>
              ${lesson.formulas.map((f) => `<div><dt>${esc(f.name)}</dt><dd><span class="formula">${f.html}</span>${f.quantities ? `<small>${escScript(f.quantities)}</small>` : ""}</dd></div>`).join("")}
            </dl>
          </div>

          <div class="card quiz-card">
            <h4>❓ Schnellcheck ${quizDone ? "✅" : ""}</h4>
            <p class="quiz-question">${esc(lesson.quiz.question)}</p>
            <div class="quiz-options" id="quiz-options">
              ${lesson.quiz.options
                .map((option, index) => `<button type="button" class="quiz-option ${quizDone && index === lesson.quiz.correctIndex ? "is-correct" : ""}" data-quiz="${index}" ${quizDone ? "disabled" : ""}>${esc(option)}</button>`)
                .join("")}
            </div>
            <p class="quiz-feedback" id="quiz-feedback">${quizDone ? `✅ ${esc(lesson.quiz.explanation)}` : "Wähle eine Antwort. Erst denken, dann klicken."}</p>
          </div>

          <div class="card exercise-card" id="exercise-card"></div>

          <nav class="lesson-nav">
            <button type="button" class="btn btn-secondary btn-sm" id="prev-lesson-btn" ${prev ? "" : "disabled"}>← ${prev ? esc(prev.title) : "Anfang"}</button>
            <button type="button" class="btn btn-secondary btn-sm" id="next-lesson-btn" ${next ? "" : "disabled"}>${next ? esc(next.title) : "Ende"} →</button>
          </nav>
        </section>

        <section class="lab-column">
          <div class="card lab-card" id="lab-card"></div>
          <div class="card status-card" id="status-card"></div>
          <div class="card zam-card">
            <h4>🧠 In ZAM behalten</h4>
            <p>Die ZAM-Karten zu dieser Lektion verlinken genau hierher: <code>${esc(lessonLink(lesson.id))}</code></p>
            <button type="button" class="btn btn-secondary btn-sm" id="lesson-zam-btn">So nimmst du die Zelle in ZAM auf</button>
          </div>
        </section>
      </div>
    `;

    host.querySelector<HTMLSelectElement>("#lesson-select")?.addEventListener("change", (event) => {
      this.openLesson((event.target as HTMLSelectElement).value);
    });
    host.querySelector("#prev-lesson-btn")?.addEventListener("click", () => prev && this.openLesson(prev.id));
    host.querySelector("#next-lesson-btn")?.addEventListener("click", () => next && this.openLesson(next.id));
    host.querySelector("#lesson-zam-btn")?.addEventListener("click", () => showZamDialog());
    host.querySelectorAll<HTMLButtonElement>("[data-quiz]").forEach((button) => {
      button.addEventListener("click", () => this.answerQuiz(lesson, Number(button.dataset.quiz)));
    });

    this.renderLab(host.querySelector<HTMLElement>("#lab-card")!, lesson);
    this.renderStatus(host.querySelector<HTMLElement>("#status-card")!, lesson);
    if (this.taskLessonId !== lesson.id || this.taskLevel !== level || !this.task) {
      this.startTask(lesson, level);
    }
    this.renderExercise(host.querySelector<HTMLElement>("#exercise-card")!, lesson);
  }

  private answerQuiz(lesson: Lesson, index: number): void {
    const feedback = document.getElementById("quiz-feedback");
    const buttons = document.querySelectorAll<HTMLButtonElement>("[data-quiz]");
    if (index === lesson.quiz.correctIndex) {
      if (!isQuizDone(this.progress, lesson.id)) {
        this.progress.quizDone.push(lesson.id);
        this.afterProgressChange(lesson);
      }
      buttons.forEach((button) => {
        button.disabled = true;
        button.classList.toggle("is-correct", Number(button.dataset.quiz) === index);
      });
      if (feedback) feedback.textContent = `✅ ${lesson.quiz.explanation}`;
      showToast("Schnellcheck richtig!", "success", 2200);
    } else {
      buttons[index]?.classList.add("is-wrong");
      if (feedback) feedback.textContent = "Noch nicht. Lies die Erklärung oben noch einmal und versuche es erneut.";
    }
    this.refreshStatus(lesson);
  }

  // ─── Labor ──────────────────────────────────────────────────────────────

  private renderLab(container: HTMLElement, lesson: Lesson): void {
    const lab = lesson.lab;
    const values = this.labValues.get(lesson.id) ?? defaultLabValues(lab);
    this.labValues.set(lesson.id, values);

    container.innerHTML = `
      <h4>🔬 ${esc(lab.title)}</h4>
      <p class="lab-intro">${esc(lab.intro)}</p>
      <div class="lab-visual" id="lab-visual"></div>
      <div class="lab-controls">
        ${lab.params
          .map((param) => {
            if (param.type === "choice") {
              return `<label class="lab-control">
                <span class="lab-label">${esc(param.label)}</span>
                <select data-param="${param.key}">
                  ${param.options.map((option) => `<option value="${option.value}" ${option.value === values[param.key] ? "selected" : ""}>${esc(option.label)}</option>`).join("")}
                </select>
              </label>`;
            }
            return `<label class="lab-control">
              <span class="lab-label">${esc(param.label)} <output data-output="${param.key}">${fmtUnit(values[param.key], param.unit, param.digits ?? 0)}</output></span>
              <input type="range" data-param="${param.key}" min="${param.min}" max="${param.max}" step="${param.step}" value="${values[param.key]}" />
            </label>`;
          })
          .join("")}
      </div>
      <dl class="readouts" id="lab-readouts"></dl>
      <div class="goals">
        <h5>Laboraufträge</h5>
        <ul id="lab-goals">
          ${lab.goals.map((goal) => `<li data-goal="${goal.id}"><span class="goal-state">○</span> ${esc(goal.text)}</li>`).join("")}
        </ul>
      </div>
    `;

    const update = () => this.updateLab(container, lesson);
    container.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-param]").forEach((input) => {
      const param = lab.params.find((p) => p.key === input.dataset.param);
      if (!param) return;
      input.addEventListener("input", () => {
        values[param.key] = clampParam(param, Number(input.value));
        update();
      });
      input.addEventListener("change", () => {
        values[param.key] = clampParam(param, Number(input.value));
        update();
      });
    });
    update();
  }

  private updateLab(container: HTMLElement, lesson: Lesson): void {
    const lab = lesson.lab;
    const values = this.labValues.get(lesson.id) ?? defaultLabValues(lab);
    const readouts = computeReadouts(lab, values);

    for (const param of lab.params) {
      if (param.type !== "range") continue;
      const output = container.querySelector<HTMLOutputElement>(`[data-output="${param.key}"]`);
      if (output) output.textContent = fmtUnit(values[param.key], param.unit, param.digits ?? 0);
    }
    const visual = container.querySelector<HTMLElement>("#lab-visual");
    if (visual) visual.innerHTML = renderLabVisual(lab, values, readouts);
    const list = container.querySelector<HTMLElement>("#lab-readouts");
    if (list) {
      list.innerHTML = lab.readouts
        .map((readout) => {
          const value = readouts[readout.key];
          const text = typeof value === "number" ? fmtUnit(value, readout.unit ?? "", readout.digits ?? 2) : String(value);
          return `<div class="${readout.emphasis ? "is-emphasis" : ""}"><dt>${esc(readout.label)}</dt><dd>${esc(text)}</dd></div>`;
        })
        .join("");
    }

    const reached = reachedGoals(lab, values, readouts).map((goal) => goal.id);
    const stored = goalsReached(this.progress, lesson.id);
    const newlyReached = reached.filter((id) => !stored.includes(id));
    if (newlyReached.length > 0) {
      this.progress.labGoals[lesson.id] = [...stored, ...newlyReached];
      for (const id of newlyReached) {
        const goal = lab.goals.find((g) => g.id === id);
        if (goal) showToast(`Laborauftrag erfüllt: ${goal.text}`, "success", 3200);
      }
      this.afterProgressChange(lesson);
    }
    const all = goalsReached(this.progress, lesson.id);
    container.querySelectorAll<HTMLElement>("[data-goal]").forEach((item) => {
      const id = item.dataset.goal ?? "";
      const done = all.includes(id);
      const now = reached.includes(id);
      item.classList.toggle("is-done", done);
      item.classList.toggle("is-now", now);
      const state = item.querySelector(".goal-state");
      if (state) state.textContent = done ? "✅" : now ? "◉" : "○";
    });
    this.refreshStatus(lesson);
  }

  // ─── Aufgaben ───────────────────────────────────────────────────────────

  private startTask(lesson: Lesson, level: DifficultyLevel): void {
    const counter = (this.progress.attempts[lesson.id] ?? 0) + 1;
    this.progress.attempts[lesson.id] = counter;
    saveLearnerProgress(this.progress);
    const generator = lesson.exercises[(counter - 1) % lesson.exercises.length];
    const rng = createRng(seedFrom(`${lesson.id}:${level}:${counter}`));
    this.task = generator.make(rng, level);
    this.taskLessonId = lesson.id;
    this.taskLevel = level;
    this.taskWrongAttempts = 0;
    this.taskRevealed = false;
    this.taskSolved = false;
  }

  private renderExercise(container: HTMLElement, lesson: Lesson): void {
    const task = this.task;
    if (!task) return;
    const level = this.taskLevel;
    const solved = solvedCount(this.progress, lesson.id, level);
    const done = solved >= lesson.requiredCorrect;
    container.innerHTML = `
      <div class="exercise-head">
        <h4>🧮 Aufgaben · ${level === 1 ? "Level 1: geführt" : "Level 2: Transfer"} ${done ? "✅" : ""}</h4>
        <span class="exercise-count">${Math.min(solved, lesson.requiredCorrect)} / ${lesson.requiredCorrect} gelöst${solved > lesson.requiredCorrect ? ` (+${solved - lesson.requiredCorrect})` : ""}</span>
      </div>
      <p class="task-prompt">${task.prompt}</p>
      <ul class="task-given">${task.given.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
      ${level === 1 && task.formulaHint ? `<p class="task-hint">Formel: <span class="formula">${esc(task.formulaHint)}</span></p>` : ""}
      <form class="task-form" id="task-form">
        <label class="task-input">
          <span class="sr-only">Antwort</span>
          <input type="text" inputmode="decimal" autocomplete="off" id="task-answer" placeholder="z. B. 2,5" ${this.taskSolved || this.taskRevealed ? "disabled" : ""} />
          <span class="task-unit">${esc(task.unit)}</span>
        </label>
        <button type="submit" class="btn btn-primary" id="task-check-btn" ${this.taskSolved || this.taskRevealed ? "disabled" : ""}>Prüfen</button>
        <button type="button" class="btn btn-secondary" id="task-new-btn">Neue Aufgabe</button>
        <button type="button" class="btn btn-ghost btn-sm" id="task-reveal-btn" ${this.taskSolved || this.taskRevealed ? "hidden" : ""}>Lösungsweg zeigen</button>
      </form>
      <p class="task-feedback" id="task-feedback">${this.taskSolved ? "✅ Richtig!" : this.taskRevealed ? "Lösungsweg angezeigt. Diese Aufgabe zählt nicht, die nächste schon." : "Dezimalzahlen mit Komma, Einheit steht rechts."}</p>
      <div class="task-solution" id="task-solution" ${this.taskSolved || this.taskRevealed ? "" : "hidden"}>
        <strong>Lösungsweg</strong>
        <div>${task.solutionHtml}</div>
      </div>
    `;

    const form = container.querySelector<HTMLFormElement>("#task-form");
    const input = container.querySelector<HTMLInputElement>("#task-answer");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!input) return;
      this.checkTask(lesson, input.value);
    });
    container.querySelector("#task-new-btn")?.addEventListener("click", () => {
      this.startTask(lesson, this.progress.difficultyLevel);
      this.renderExercise(container, lesson);
      container.querySelector<HTMLInputElement>("#task-answer")?.focus();
    });
    container.querySelector("#task-reveal-btn")?.addEventListener("click", () => {
      this.taskRevealed = true;
      this.renderExercise(container, lesson);
    });
  }

  private checkTask(lesson: Lesson, raw: string): void {
    const task = this.task;
    const container = document.getElementById("exercise-card");
    const feedback = document.getElementById("task-feedback");
    if (!task || !container || !feedback) return;
    const result = checkAnswer(task, raw);
    if (result.status === "invalid") {
      feedback.textContent = "Bitte eine Zahl eingeben, zum Beispiel 2,5 oder 1500.";
      feedback.className = "task-feedback is-warning";
      return;
    }
    if (result.status === "correct") {
      this.taskSolved = true;
      const entry = this.progress.solved[lesson.id] ?? { 1: 0, 2: 0 };
      entry[this.taskLevel] += 1;
      this.progress.solved[lesson.id] = entry;
      this.afterProgressChange(lesson);
      this.renderExercise(container, lesson);
      const count = solvedCount(this.progress, lesson.id, this.taskLevel);
      showToast(
        count === lesson.requiredCorrect
          ? `Richtig! ${lesson.requiredCorrect} Aufgaben auf Level ${this.taskLevel} gelöst.`
          : `Richtig! ${fmt(task.answer, task.digits)} ${task.unit}`,
        "success",
        2600,
      );
      this.refreshStatus(lesson);
      return;
    }
    this.taskWrongAttempts += 1;
    feedback.textContent = `❌ ${wrongAnswerHint(result, task)}${this.taskWrongAttempts >= 2 ? " Du kannst dir den Lösungsweg zeigen lassen." : ""}`;
    feedback.className = "task-feedback is-warning";
    const reveal = container.querySelector<HTMLButtonElement>("#task-reveal-btn");
    if (reveal && this.taskWrongAttempts >= 2) reveal.classList.add("btn-secondary");
  }

  // ─── Status und Abschluss ───────────────────────────────────────────────

  private renderStatus(container: HTMLElement, lesson: Lesson): void {
    container.innerHTML = `<h4>Lektion abschließen</h4><ul class="status-list" id="status-list"></ul><p class="status-done" id="status-done" hidden>🎉 Lektion abgeschlossen. ${esc(lesson.celebrationMessage)}</p>`;
    this.refreshStatus(lesson);
  }

  private refreshStatus(lesson: Lesson): void {
    const list = document.getElementById("status-list");
    const done = document.getElementById("status-done");
    if (!list || !done) return;
    const quiz = isQuizDone(this.progress, lesson.id);
    const goals = goalsReached(this.progress, lesson.id).length;
    const total = lesson.lab.goals.length;
    const solved1 = solvedCount(this.progress, lesson.id, 1);
    const solved2 = solvedCount(this.progress, lesson.id, 2);
    const item = (ok: boolean, text: string) => `<li class="${ok ? "is-done" : ""}"><span>${ok ? "✅" : "○"}</span> ${text}</li>`;
    list.innerHTML =
      item(quiz, "Schnellcheck richtig beantwortet") +
      item(goals === total, `Laboraufträge erfüllt (${goals} von ${total})`) +
      item(solved1 >= lesson.requiredCorrect, `${lesson.requiredCorrect} Aufgaben auf Level 1 gelöst (${Math.min(solved1, lesson.requiredCorrect)} von ${lesson.requiredCorrect})`) +
      item(solved2 >= lesson.requiredCorrect, `Bonus 🦅: ${lesson.requiredCorrect} Transferaufgaben auf Level 2 (${Math.min(solved2, lesson.requiredCorrect)} von ${lesson.requiredCorrect})`);
    done.hidden = !isLessonComplete(this.progress, lesson);
  }

  private afterProgressChange(lesson: Lesson): void {
    saveLearnerProgress(this.progress);
    this.syncHeader();
    const stage = findStageById(lesson.stageId);
    if (!stage) return;
    const filter = this.progress.trackFilter;
    if (
      isStageComplete(this.progress, stage, filter) &&
      !this.progress.celebratedStageIds.includes(stage.id)
    ) {
      this.progress.celebratedStageIds.push(stage.id);
      saveLearnerProgress(this.progress);
      const count = requiredLessons(stage, filter).length;
      window.setTimeout(() => {
        showStageCelebration(stage, () => this.syncHeader(), count);
      }, 400);
    } else if (
      isLessonComplete(this.progress, lesson) &&
      !this.progress.celebratedLessonIds.includes(lesson.id)
    ) {
      // The lesson itself: say so once, when the last of the three parts lands.
      this.progress.celebratedLessonIds.push(lesson.id);
      saveLearnerProgress(this.progress);
      showToast(`Lektion abgeschlossen: ${lesson.title}`, "success", 4000);
    }
  }

  // ─── View 3: Formelsammlung ─────────────────────────────────────────────

  private renderFormulas(host: HTMLElement): void {
    host.innerHTML = `
      <div class="formulas">
        <section class="hero hero-compact">
          <div class="hero-copy">
            <h2>Formelsammlung Physik 8</h2>
            <p>Alle Formeln der ${ALL_LESSONS.length} Lektionen mit Größen und Einheiten. Jede Zeile führt zur Lektion mit Labor und Aufgaben. Konstanten: Ortsfaktor g = 9,81 N/kg, Lichtgeschwindigkeit c = 300 000 km/s, Schallgeschwindigkeit in Luft 343 m/s (20 °C), Elementarladung e = 1,6 · 10<sup>−19</sup> C, 0 K = −273,15 °C.</p>
          </div>
        </section>
        ${STAGES.map(
          (stage) => `
          <section class="stage-card" style="--accent:${stage.accent}">
            <header class="stage-head"><span class="stage-icon" aria-hidden="true">${stage.icon}</span><div><h3>Etappe ${stage.stageNumber}: ${esc(stage.title)}</h3><p class="muted">${esc(stage.lehrplanLabel)}</p></div></header>
            <table class="formula-table">
              <thead><tr><th>Formel</th><th>Größen und Einheiten</th><th>Lektion</th></tr></thead>
              <tbody>
                ${stage.lessons
                  .flatMap((lesson) =>
                    lesson.formulas.map(
                      (formula) => `<tr>
                        <td><strong>${esc(formula.name)}</strong><br><span class="formula">${formula.html}</span></td>
                        <td>${escScript(formula.quantities)}</td>
                        <td><button type="button" class="btn btn-ghost btn-sm" data-open-lesson="${lesson.id}">${esc(lesson.title)}</button></td>
                      </tr>`,
                    ),
                  )
                  .join("")}
              </tbody>
            </table>
          </section>`,
        ).join("")}
      </div>
    `;
    host.querySelectorAll<HTMLElement>("[data-open-lesson]").forEach((element) => {
      element.addEventListener("click", () => this.openLesson(element.dataset.openLesson ?? ""));
    });
  }
}

function systemTheme(): "light" | "dark" {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredTheme(): "light" | "dark" | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export const app = new PhysikApp();
