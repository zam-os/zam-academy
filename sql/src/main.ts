import type { Database, SqlJsStatic } from "sql.js";
import {
  findLessonById,
  findStageById,
  lessonsForFilter,
  nextLesson,
  previousLesson,
  STAGES,
} from "./curriculum";
import { describeTables, q, setupSql } from "./db/dataset";
import { createDatabase, runSql, tableNames } from "./db/engine";
import { loadSqlJs } from "./db/sqljs-loader";
import { checkTask } from "./exercises/checker";
import { esc } from "./exercises/format";
import { quizOrder } from "./exercises/quiz-order";
import { createRng, seedFrom } from "./exercises/rng";
import { UI_STRINGS, type UiStrings } from "./i18n/translations";
import {
  type AppLocale,
  type Cardinality,
  type DifficultyLevel,
  type ErLabDefinition,
  type ExerciseTask,
  FILTER_LABELS,
  type Lesson,
  MODULE_LABELS,
  type ModuleFilter,
  type SqlCell,
  type SqlLabContext,
  type SqlLabDefinition,
  type SqlOutcome,
  type Stage,
} from "./model/types";
import {
  DEFAULT_LESSON_ID,
  goalsReached,
  isLessonComplete,
  isQuizDone,
  isStageComplete,
  isTransferDone,
  type LearnerProgress,
  loadLearnerProgress,
  overallStats,
  relevantLessons,
  resetLearnerProgress,
  saveLearnerProgress,
  solvedCount,
  stageStats,
} from "./storage/progress";
import { confirmReset, showStageCelebration, showZamDialog } from "./ui/dialogs";
import { showToast, type ToastTone } from "./ui/toast";
import { lessonLink, parseTrainingDeepLink } from "./zam/zam-link";

type ActiveView = "path" | "lesson" | "cheatsheet";

const THEME_KEY = "zam_academy_sql_theme";
const MAX_ROWS_SHOWN = 60;

interface SandboxState {
  lessonId: string;
  locale: AppLocale;
  db: Database;
  last: { sql: string; outcome: SqlOutcome } | null;
  editor: string;
}

class SqlAcademyApp {
  private progress: LearnerProgress;
  private view: ActiveView = "path";
  private SQL: SqlJsStatic | null = null;
  private sqlLoadError: string | null = null;
  private sandbox: SandboxState | null = null;
  private readonly erChoices = new Map<string, Record<string, Cardinality | undefined>>();
  private task: ExerciseTask | null = null;
  private taskLessonId = "";
  private taskLevel: DifficultyLevel = 1;
  private taskLocale: AppLocale = "de";
  private taskWrongAttempts = 0;
  private taskRevealed = false;
  private taskSolved = false;
  private taskDraft = "";

  constructor() {
    this.progress = loadLearnerProgress();
    if (!findLessonById(this.progress.activeLessonId)) {
      this.progress.activeLessonId = DEFAULT_LESSON_ID;
    }
    this.applyTheme(readStoredTheme());
    this.applyDeepLink(true);
    this.setupHeader();
    this.syncHeader();
    this.render();
    window.addEventListener("hashchange", () => {
      if (this.applyDeepLink(false)) {
        this.syncHeader();
        this.render();
        window.scrollTo({ top: 0 });
      }
    });
    loadSqlJs()
      .then((SQL) => {
        this.SQL = SQL;
        if (this.view === "lesson") this.render();
      })
      .catch((error: unknown) => {
        this.sqlLoadError = error instanceof Error ? error.message : String(error);
        if (this.view === "lesson") this.render();
      });
  }

  private get locale(): AppLocale {
    return this.progress.locale;
  }

  private get t(): UiStrings {
    return UI_STRINGS[this.locale];
  }

  private toast(message: string, tone: ToastTone = "info", durationMs = 3600): void {
    showToast(message, tone, durationMs, this.t.closeToast);
  }

  // ─── URL and header ─────────────────────────────────────────────────────

  /**
   * Opens the lesson a ZAM card cites (`#lesson=<id>`, optionally `&level=2&lang=en`).
   * The query string (`?lang=en`) counts only when the page opens; it stays in
   * the address bar, so reading it again on every hash change would undo the
   * language or level the learner picked since.
   */
  private applyDeepLink(withQuery: boolean): boolean {
    const parsed = parseTrainingDeepLink(window.location.hash, withQuery ? window.location.search : "");
    let changed = false;
    if (parsed.locale && parsed.locale !== this.progress.locale) {
      this.progress.locale = parsed.locale;
      this.dropSandbox();
      this.resetTask();
      changed = true;
    }
    if (parsed.level && parsed.level !== this.progress.difficultyLevel) {
      this.progress.difficultyLevel = parsed.level;
      this.resetTask();
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
      button.addEventListener("click", () => this.switchView(button.dataset.view as ActiveView));
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
        this.toast(this.t.levelToast(level), "info", 2600);
      });
    });
    document.querySelectorAll<HTMLButtonElement>("[data-locale]").forEach((button) => {
      button.addEventListener("click", () => {
        const locale = button.dataset.locale === "en" ? "en" : "de";
        if (locale !== this.progress.locale) this.setLocale(locale);
      });
    });
    document.getElementById("zam-btn")?.addEventListener("click", () => showZamDialog(this.locale));
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

  private setLocale(locale: AppLocale): void {
    this.progress.locale = locale;
    saveLearnerProgress(this.progress);
    this.dropSandbox();
    this.resetTask();
    this.syncHeader();
    this.render();
  }

  private applyTheme(theme: "light" | "dark" | null): void {
    if (theme) document.documentElement.dataset.theme = theme;
    else delete document.documentElement.dataset.theme;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
    if (meta) meta.content = theme ?? "light dark";
  }

  private setText(id: string, text: string): void {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  }

  private syncHeader(): void {
    const t = this.t;
    document.documentElement.lang = this.locale;
    document.title = t.htmlTitle;
    this.setText("brand-title", t.brandTitle);
    this.setText("brand-subtitle", t.brandSubtitle);
    this.setText("nav-path", t.navPath);
    this.setText("nav-lesson", t.navLesson);
    this.setText("nav-cheatsheet", t.navCheatSheet);
    this.setText("level-btn-1", t.level1);
    this.setText("level-btn-2", t.level2);
    document.getElementById("level-btn-1")?.setAttribute("title", t.level1Title);
    document.getElementById("level-btn-2")?.setAttribute("title", t.level2Title);
    this.setText("zam-btn", t.zamButton);
    document.getElementById("zam-btn")?.setAttribute("title", t.zamButtonTitle);
    document.getElementById("theme-toggle-btn")?.setAttribute("title", t.themeTitle);
    document.getElementById("theme-toggle-btn")?.setAttribute("aria-label", t.themeTitle);
    this.setText("footer-curriculum", t.footerCurriculum);
    this.setText("footer-curriculum-link", t.footerCurriculumLink);
    this.setText("footer-privacy", t.footerPrivacy);
    this.setText("footer-source", t.footerSource);

    document.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === this.view);
    });
    document.querySelectorAll<HTMLButtonElement>("[data-level]").forEach((button) => {
      button.classList.toggle("is-active", Number(button.dataset.level) === this.progress.difficultyLevel);
    });
    document.querySelectorAll<HTMLButtonElement>("[data-locale]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.locale === this.locale);
    });
    const stats = overallStats(this.progress, STAGES, this.progress.moduleFilter);
    this.setText("header-progress-text", t.progressText(stats.completed, stats.total));
    const bar = document.getElementById("header-progress-bar");
    if (bar) bar.style.width = `${stats.percent}%`;
    const pill = document.getElementById("header-progress");
    if (pill) pill.title = t.progressTitle(stats.percent, stats.completedStages, stats.totalStages);
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
    if (window.location.hash !== target) history.replaceState(null, "", target);
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
    this.taskDraft = "";
  }

  private render(): void {
    const host = document.getElementById("main-view-host");
    if (!host) return;
    if (this.view === "path") this.renderPath(host);
    else if (this.view === "lesson") this.renderLesson(host);
    else this.renderCheatSheet(host);
  }

  private moduleChip(lesson: Lesson): string {
    const short = lesson.module === "extra" ? (this.locale === "de" ? "Zusatz" : "Extra") : `IT ${lesson.module}`;
    return `<span class="chip chip-module" title="${esc(MODULE_LABELS[this.locale][lesson.module])}">${esc(short)}</span>`;
  }

  // ─── View 1: Lernpfad ───────────────────────────────────────────────────

  private renderPath(host: HTMLElement): void {
    const t = this.t;
    const filter = this.progress.moduleFilter;
    const stats = overallStats(this.progress, STAGES, filter);
    const relevant = new Set(lessonsForFilter(filter).map((lesson) => lesson.id));
    const active = findLessonById(this.progress.activeLessonId) ?? findLessonById(DEFAULT_LESSON_ID)!;
    const filters: ModuleFilter[] = ["2.3.1", "2.3.2", "alle"];

    host.innerHTML = `
      <div class="path">
        <section class="hero">
          <div class="hero-copy">
            <h2>${esc(t.heroTitle)}</h2>
            <p>${esc(t.heroText)}</p>
            <div class="hero-row">
              <label class="track-select">
                <span>${esc(t.filterLabel)}</span>
                <select id="module-filter">
                  ${filters.map((value) => `<option value="${value}" ${filter === value ? "selected" : ""}>${esc(FILTER_LABELS[this.locale][value])}</option>`).join("")}
                </select>
              </label>
              <button type="button" class="btn btn-primary" id="continue-btn">${esc(t.continueButton(active.lesson.text[this.locale].title))}</button>
            </div>
          </div>
          <div class="hero-stats">
            <div class="ring" style="--percent:${stats.percent}"><span>${stats.percent}%</span></div>
            <p>${esc(t.statsLessons(stats.completed, stats.total))}<br>${esc(t.statsStages(stats.completedStages, stats.totalStages))}</p>
            <div class="badge-rack" aria-label="${esc(t.badgesLabel)}">
              ${STAGES.map((stage) => {
                const stageDone = isStageComplete(this.progress, stage, filter);
                const off = relevantLessons(stage, filter).length === 0;
                const badge = stage.text[this.locale].badgeTitle;
                const title = off ? t.badgeOff(badge) : badge;
                return `<span class="badge ${stageDone ? "is-earned" : ""} ${off ? "is-off" : ""}" title="${esc(title)}">${stage.icon}</span>`;
              }).join("")}
            </div>
            <button type="button" class="btn btn-ghost btn-sm" id="reset-progress-btn">${esc(t.resetButton)}</button>
          </div>
        </section>
        ${STAGES.map((stage) => this.renderStageCard(stage, relevant, filter)).join("")}
      </div>
    `;

    host.querySelector<HTMLSelectElement>("#module-filter")?.addEventListener("change", (event) => {
      const value = (event.target as HTMLSelectElement).value as ModuleFilter;
      this.progress.moduleFilter = value;
      saveLearnerProgress(this.progress);
      this.syncHeader();
      this.render();
    });
    host.querySelector("#continue-btn")?.addEventListener("click", () => this.openLesson(active.lesson.id));
    host.querySelector("#reset-progress-btn")?.addEventListener("click", () => {
      confirmReset(this.locale, () => {
        this.progress = resetLearnerProgress(this.progress);
        this.dropSandbox();
        this.erChoices.clear();
        this.resetTask();
        this.syncHeader();
        this.render();
        this.toast(this.t.resetDone, "info");
      });
    });
    host.querySelectorAll<HTMLElement>("[data-open-lesson]").forEach((element) => {
      element.addEventListener("click", () => this.openLesson(element.dataset.openLesson ?? ""));
    });
  }

  private renderStageCard(stage: Stage, relevant: Set<string>, filter: ModuleFilter): string {
    const t = this.t;
    const text = stage.text[this.locale];
    const stats = stageStats(this.progress, stage, filter);
    const progressLabel = stats.total === 0 ? t.notInScope : `${stats.completed} / ${stats.total}`;
    return `
      <section class="stage-card" style="--accent:${stage.accent}">
        <header class="stage-head">
          <span class="stage-icon" aria-hidden="true">${stage.icon}</span>
          <div>
            <h3>${esc(t.stageWord)} ${stage.stageNumber}: ${esc(text.title)}</h3>
            <p>${esc(text.subtitle)} · <span class="muted">${esc(text.moduleLabel)}</span></p>
          </div>
          <div class="stage-progress">
            <strong>${esc(progressLabel)}</strong>
            <div class="bar"><div style="width:${stats.percent}%"></div></div>
          </div>
        </header>
        <ol class="lesson-list">
          ${stage.lessons
            .map((lesson) => {
              const lt = lesson.text[this.locale];
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
                    <strong>${esc(lt.title)}</strong>
                    <small>${esc(lt.subtitle)}</small>
                  </span>
                  <span class="lesson-meta">
                    ${this.moduleChip(lesson)}
                    ${!isRelevant && filter !== "alle" ? `<span class="chip chip-optional">${esc(t.chipExtra)}</span>` : ""}
                    <span class="chip ${quiz ? "is-done" : ""}" title="${esc(t.chipQuiz)}">❓</span>
                    <span class="chip ${goals === lesson.lab.goals.length ? "is-done" : ""}" title="${esc(t.chipLab)}">🧪 ${goals}/${lesson.lab.goals.length}</span>
                    <span class="chip ${solved1 >= lesson.requiredCorrect ? "is-done" : ""}" title="${esc(t.chipTasks)}">🧮 ${Math.min(solved1, lesson.requiredCorrect)}/${lesson.requiredCorrect}</span>
                    ${transfer ? `<span class="chip is-done" title="${esc(t.chipTransfer)}">🦅</span>` : ""}
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
    const t = this.t;
    const found = findLessonById(this.progress.activeLessonId) ?? findLessonById(DEFAULT_LESSON_ID)!;
    const { stage, lesson } = found;
    const text = lesson.text[this.locale];
    const level = this.progress.difficultyLevel;
    const prev = previousLesson(lesson.id);
    const next = nextLesson(lesson.id);
    const quizDone = isQuizDone(this.progress, lesson.id);
    const title = (l: Lesson) => l.text[this.locale].title;

    host.innerHTML = `
      <div class="lesson-grid" style="--accent:${stage.accent}">
        <section class="guide">
          <div class="stage-pill">${stage.icon} ${esc(t.stagePill(stage.stageNumber, lesson.stepNumber, stage.lessons.length))}</div>
          <h2 class="lesson-title">${esc(text.title)}</h2>
          <p class="lesson-subtitle">${esc(text.subtitle)}</p>
          <select id="lesson-select" class="lesson-select" aria-label="${esc(t.lessonSelectLabel)}">
            ${STAGES.map(
              (st) => `<optgroup label="${esc(t.stageWord)} ${st.stageNumber}: ${esc(st.text[this.locale].title)}">${st.lessons
                .map((l) => `<option value="${l.id}" ${l.id === lesson.id ? "selected" : ""}>${isLessonComplete(this.progress, l) ? "✓ " : ""}${esc(title(l))}</option>`)
                .join("")}</optgroup>`,
            ).join("")}
          </select>
          <p class="lehrplan-tag">${this.moduleChip(lesson)} <span class="muted">${esc(MODULE_LABELS[this.locale][lesson.module])} · ${esc(stage.text[this.locale].moduleLabel)}</span></p>

          <div class="why-box"><strong>${esc(t.whyTitle)}</strong> ${esc(text.whyItMatters)}</div>
          <div class="explanation">${text.explanationHtml}</div>

          <div class="formula-box">
            <h4>${esc(t.syntaxTitle)}</h4>
            <dl>
              ${text.syntax.map((entry) => `<div><dt>${esc(entry.name)}</dt><dd><code class="syntax">${esc(entry.sql)}</code>${entry.note ? `<small>${esc(entry.note)}</small>` : ""}</dd></div>`).join("")}
            </dl>
          </div>

          <div class="card quiz-card">
            <h4>${esc(t.quizTitle)} ${quizDone ? "✅" : ""}</h4>
            <p class="quiz-question">${esc(text.quiz.question)}</p>
            <div class="quiz-options" id="quiz-options">
              ${quizOrder(lesson)
                .map((optionIndex, shown) => `<button type="button" class="quiz-option ${quizDone && optionIndex === text.quiz.correctIndex ? "is-correct" : ""}" data-quiz="${shown}" ${quizDone ? "disabled" : ""}>${esc(text.quiz.options[optionIndex])}</button>`)
                .join("")}
            </div>
            <p class="quiz-feedback" id="quiz-feedback">${quizDone ? `✅ ${esc(text.quiz.explanation)}` : esc(t.quizIdle)}</p>
          </div>

          <div class="card exercise-card" id="exercise-card"></div>

          <nav class="lesson-nav">
            <button type="button" class="btn btn-secondary btn-sm" id="prev-lesson-btn" ${prev ? "" : "disabled"}>← ${prev ? esc(title(prev)) : esc(t.prevStart)}</button>
            <button type="button" class="btn btn-secondary btn-sm" id="next-lesson-btn" ${next ? "" : "disabled"}>${next ? esc(title(next)) : esc(t.nextEnd)} →</button>
          </nav>
        </section>

        <section class="lab-column">
          <div class="card lab-card" id="lab-card"></div>
          <div class="card status-card" id="status-card"></div>
          <div class="card zam-card">
            <h4>${esc(t.zamCardTitle)}</h4>
            <p>${esc(t.zamCardText)} <code>${esc(lessonLink(lesson.id))}</code></p>
            <button type="button" class="btn btn-secondary btn-sm" id="lesson-zam-btn">${esc(t.zamCardButton)}</button>
          </div>
        </section>
      </div>
    `;

    host.querySelector<HTMLSelectElement>("#lesson-select")?.addEventListener("change", (event) => {
      this.openLesson((event.target as HTMLSelectElement).value);
    });
    host.querySelector("#prev-lesson-btn")?.addEventListener("click", () => prev && this.openLesson(prev.id));
    host.querySelector("#next-lesson-btn")?.addEventListener("click", () => next && this.openLesson(next.id));
    host.querySelector("#lesson-zam-btn")?.addEventListener("click", () => showZamDialog(this.locale));
    host.querySelectorAll<HTMLButtonElement>("[data-quiz]").forEach((button) => {
      button.addEventListener("click", () => this.answerQuiz(lesson, Number(button.dataset.quiz)));
    });

    this.renderLab(host.querySelector<HTMLElement>("#lab-card")!, lesson);
    this.renderStatus(host.querySelector<HTMLElement>("#status-card")!, lesson);
    if (this.taskLessonId !== lesson.id || this.taskLevel !== level || this.taskLocale !== this.locale || !this.task) {
      this.startTask(lesson, level);
    }
    this.renderExercise(host.querySelector<HTMLElement>("#exercise-card")!, lesson);
  }

  private answerQuiz(lesson: Lesson, index: number): void {
    const t = this.t;
    const quiz = lesson.text[this.locale].quiz;
    const feedback = document.getElementById("quiz-feedback");
    const buttons = document.querySelectorAll<HTMLButtonElement>("[data-quiz]");
    if (quizOrder(lesson)[index] === quiz.correctIndex) {
      if (!isQuizDone(this.progress, lesson.id)) {
        this.progress.quizDone.push(lesson.id);
        this.afterProgressChange(lesson);
      }
      buttons.forEach((button) => {
        button.disabled = true;
        button.classList.toggle("is-correct", Number(button.dataset.quiz) === index);
      });
      if (feedback) feedback.textContent = `✅ ${quiz.explanation}`;
      this.toast(t.quizRight, "success", 2200);
    } else {
      buttons[index]?.classList.add("is-wrong");
      if (feedback) feedback.textContent = t.quizWrong;
    }
    this.refreshStatus(lesson);
  }

  // ─── Labor ──────────────────────────────────────────────────────────────

  private renderLab(container: HTMLElement, lesson: Lesson): void {
    if (lesson.lab.kind === "er") this.renderErLab(container, lesson, lesson.lab);
    else this.renderSqlLab(container, lesson, lesson.lab);
  }

  /** sql.js memory is not garbage-collected: a dropped sandbox closes its database. */
  private dropSandbox(): void {
    this.sandbox?.db.close();
    this.sandbox = null;
  }

  private ensureSandbox(lesson: Lesson, lab: SqlLabDefinition): SandboxState | null {
    if (!this.SQL) return null;
    if (this.sandbox && this.sandbox.lessonId === lesson.id && this.sandbox.locale === this.locale) {
      return this.sandbox;
    }
    this.dropSandbox();
    this.sandbox = {
      lessonId: lesson.id,
      locale: this.locale,
      db: createDatabase(this.SQL, setupSql(this.locale, lab.tables)),
      last: null,
      editor: q(this.locale, lab.starterSql),
    };
    return this.sandbox;
  }

  private renderSqlLab(container: HTMLElement, lesson: Lesson, lab: SqlLabDefinition): void {
    const t = this.t;
    const text = lesson.text[this.locale];
    const sandbox = this.ensureSandbox(lesson, lab);

    container.innerHTML = `
      <h4>🧪 ${esc(text.lab.title)}</h4>
      <p class="lab-intro">${esc(text.lab.intro)}</p>
      <div class="sandbox">
        <aside class="schema-browser" aria-label="${esc(t.labTables)}">
          <h5>${esc(t.labTables)}</h5>
          <div id="schema-tables"></div>
          <small class="muted">${esc(t.labTablesHint)}</small>
        </aside>
        <div class="sandbox-main">
          <textarea id="sql-editor" class="sql-editor" rows="6" spellcheck="false" aria-label="SQL" ${sandbox ? "" : "disabled"}>${esc(sandbox?.editor ?? q(this.locale, lab.starterSql))}</textarea>
          <div class="sandbox-actions">
            <button type="button" class="btn btn-primary" id="sql-run-btn" title="${esc(t.labRunTitle)}" ${sandbox ? "" : "disabled"}>${esc(t.labRun)}</button>
            <button type="button" class="btn btn-ghost btn-sm" id="sql-reset-btn" ${sandbox ? "" : "disabled"}>${esc(t.labReset)}</button>
          </div>
          <div id="sql-output" class="sql-output">${sandbox ? "" : `<p class="sql-notice">${esc(this.sqlLoadError ? t.check.sqlError(this.sqlLoadError) : t.check.loading)}</p>`}</div>
        </div>
      </div>
      <div class="goals">
        <h5>${esc(t.labGoals)}</h5>
        <ul id="lab-goals">
          ${lab.goals.map((goal) => `<li data-goal="${goal.id}"><span class="goal-state">○</span> ${esc(text.lab.goals[goal.id] ?? goal.id)}</li>`).join("")}
        </ul>
      </div>
    `;

    const editor = container.querySelector<HTMLTextAreaElement>("#sql-editor");
    editor?.addEventListener("input", () => {
      if (this.sandbox) this.sandbox.editor = editor.value;
    });
    editor?.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        this.runSandbox(container, lesson, lab);
      }
    });
    container.querySelector("#sql-run-btn")?.addEventListener("click", () => this.runSandbox(container, lesson, lab));
    container.querySelector("#sql-reset-btn")?.addEventListener("click", () => {
      if (!this.SQL || !this.sandbox) return;
      this.sandbox.db.close();
      this.sandbox.db = createDatabase(this.SQL, setupSql(this.locale, lab.tables));
      this.sandbox.last = null;
      const output = container.querySelector<HTMLElement>("#sql-output");
      if (output) output.innerHTML = "";
      this.toast(t.labResetDone, "info", 2400);
      this.renderSchemaBrowser(container, lab);
      this.refreshGoalMarks(container, lesson, []);
    });
    this.renderSchemaBrowser(container, lab);
    if (sandbox?.last) this.renderSqlOutput(container, sandbox.last.outcome);
    this.refreshGoalMarks(container, lesson, sandbox ? this.reachedGoals(sandbox, lab) : []);
  }

  /**
   * The tables as the sandbox holds them now: live row counts, and the tables
   * the learner created or dropped. Before SQLite has loaded, the lesson's own.
   */
  private renderSchemaBrowser(container: HTMLElement, lab: SqlLabDefinition): void {
    const t = this.t;
    const host = container.querySelector<HTMLElement>("#schema-tables");
    if (!host) return;
    const tables = this.sandbox ? sandboxTables(this.sandbox, lab) : describeTables(this.locale, lab.tables);
    host.innerHTML = tables
      .map(
        (table) => `
            <div class="schema-table">
              <button type="button" class="table-name" data-table="${esc(table.name)}">${esc(table.name)} <small>${table.rowCount}</small></button>
              <ul class="column-list">
                ${table.columns
                  .map(
                    (column) => `<li><code>${esc(column.name)}</code> <span class="col-type">${esc(column.type)}</span>${column.pk ? ` <span class="col-key" title="${esc(t.labPk)}">🔑</span>` : ""}${column.fk ? ` <span class="col-fk" title="${esc(t.labFk)} ${esc(column.fk)}">↗ ${esc(column.fk)}</span>` : ""}</li>`,
                  )
                  .join("")}
              </ul>
            </div>`,
      )
      .join("");
    const editor = container.querySelector<HTMLTextAreaElement>("#sql-editor");
    host.querySelectorAll<HTMLButtonElement>("[data-table]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!editor || !this.sandbox) return;
        editor.value = `SELECT * FROM ${quoteIdent(button.dataset.table ?? "")};`;
        this.sandbox.editor = editor.value;
        editor.focus();
      });
    });
  }

  private labContext(sandbox: SandboxState): SqlLabContext {
    return {
      locale: sandbox.locale,
      query: (sql) => runSql(sandbox.db, sql),
      last: sandbox.last,
    };
  }

  private reachedGoals(sandbox: SandboxState, lab: SqlLabDefinition): string[] {
    const ctx = this.labContext(sandbox);
    return lab.goals
      .filter((goal) => {
        try {
          return goal.check(ctx);
        } catch {
          return false;
        }
      })
      .map((goal) => goal.id);
  }

  private runSandbox(container: HTMLElement, lesson: Lesson, lab: SqlLabDefinition): void {
    const sandbox = this.sandbox;
    const editor = container.querySelector<HTMLTextAreaElement>("#sql-editor");
    if (!sandbox || !editor) return;
    const sql = editor.value;
    sandbox.editor = sql;
    const outcome = runSql(sandbox.db, sql);
    sandbox.last = { sql, outcome };
    this.renderSqlOutput(container, outcome);
    this.renderSchemaBrowser(container, lab);
    const reached = this.reachedGoals(sandbox, lab);
    this.recordGoals(lesson, reached, lab);
    this.refreshGoalMarks(container, lesson, reached);
  }

  private renderSqlOutput(container: HTMLElement, outcome: SqlOutcome): void {
    const t = this.t;
    const output = container.querySelector<HTMLElement>("#sql-output");
    if (!output) return;
    if (!outcome.ok) {
      output.innerHTML = `<div class="sql-error"><strong>${esc(t.labError)}:</strong> ${esc(outcome.error)}</div>`;
      return;
    }
    if (outcome.results.length === 0) {
      output.innerHTML = `<p class="sql-notice is-ok">✓ ${esc(t.labChanged(outcome.statements, outcome.changes))}</p>`;
      return;
    }
    output.innerHTML = outcome.results
      .map((result) => {
        const shown = result.values.slice(0, MAX_ROWS_SHOWN);
        const hidden = result.values.length - shown.length;
        return `
          <div class="result-caption">${esc(t.labRows(result.values.length))}</div>
          <div class="table-wrap">
            <table class="result-table">
              <thead><tr>${result.columns.map((column) => `<th>${esc(column)}</th>`).join("")}</tr></thead>
              <tbody>
                ${shown.map((row) => `<tr>${row.map((cell) => `<td class="${typeof cell === "number" ? "is-number" : ""}">${formatCell(cell)}</td>`).join("")}</tr>`).join("")}
              </tbody>
            </table>
          </div>
          ${hidden > 0 ? `<p class="sql-notice">${esc(t.labMoreRows(hidden))}</p>` : ""}
          ${result.values.length === 0 ? `<p class="sql-notice">${esc(t.labNoRows)}</p>` : ""}`;
      })
      .join("");
  }

  private recordGoals(lesson: Lesson, reached: string[], lab: SqlLabDefinition | ErLabDefinition): void {
    const stored = goalsReached(this.progress, lesson.id);
    const newlyReached = reached.filter((id) => !stored.includes(id));
    if (newlyReached.length === 0) return;
    this.progress.labGoals[lesson.id] = [...stored, ...newlyReached];
    const texts = lesson.text[this.locale].lab.goals;
    for (const id of newlyReached) {
      if (lab.goals.some((goal) => goal.id === id)) this.toast(this.t.goalToast(texts[id] ?? id), "success", 3200);
    }
    this.afterProgressChange(lesson);
  }

  private refreshGoalMarks(container: HTMLElement, lesson: Lesson, reachedNow: string[]): void {
    const all = goalsReached(this.progress, lesson.id);
    container.querySelectorAll<HTMLElement>("[data-goal]").forEach((item) => {
      const id = item.dataset.goal ?? "";
      const done = all.includes(id);
      const now = reachedNow.includes(id);
      item.classList.toggle("is-done", done);
      item.classList.toggle("is-now", now);
      const state = item.querySelector(".goal-state");
      if (state) state.textContent = done ? "✅" : now ? "◉" : "○";
    });
    this.refreshStatus(lesson);
  }

  private renderErLab(container: HTMLElement, lesson: Lesson, lab: ErLabDefinition): void {
    const t = this.t;
    const text = lesson.text[this.locale];
    const choices = this.erChoices.get(lesson.id) ?? {};
    this.erChoices.set(lesson.id, choices);
    const cardinalities: Cardinality[] = ["1:1", "1:n", "n:m"];

    container.innerHTML = `
      <h4>🧩 ${esc(text.lab.title)}</h4>
      <p class="lab-intro">${esc(text.lab.intro)}</p>
      <div class="er-lab">
        ${lab.pairs
          .map((pair) => {
            const choice = choices[pair.id];
            return `
            <div class="er-pair" data-pair="${pair.id}">
              <p class="er-scenario">${esc(pair.scenario[this.locale])}</p>
              <div class="er-diagram" data-er-diagram="${pair.id}">${erDiagram(pair.left[this.locale], pair.verb[this.locale], pair.right[this.locale], choice)}</div>
              <label class="er-select">
                <span>${esc(t.erPick)}</span>
                <select data-er="${pair.id}">
                  <option value="" ${choice ? "" : "selected"}>${esc(t.erUnset)}</option>
                  ${cardinalities.map((c) => `<option value="${c}" ${choice === c ? "selected" : ""}>${esc(t.erCardinality[c])}</option>`).join("")}
                </select>
              </label>
              <p class="er-feedback ${choice ? (choice === pair.answer ? "is-right" : "is-wrong") : ""}" data-er-feedback="${pair.id}">${choice ? (choice === pair.answer ? `${esc(t.erRight)} ${esc(pair.explanation[this.locale])}` : esc(t.erWrong)) : ""}</p>
            </div>`;
          })
          .join("")}
      </div>
      <div class="goals">
        <h5>${esc(t.labGoals)}</h5>
        <ul id="lab-goals">
          ${lab.goals.map((goal) => `<li data-goal="${goal.id}"><span class="goal-state">○</span> ${esc(text.lab.goals[goal.id] ?? goal.id)}</li>`).join("")}
        </ul>
      </div>
    `;

    container.querySelectorAll<HTMLSelectElement>("[data-er]").forEach((select) => {
      select.addEventListener("change", () => {
        const pair = lab.pairs.find((p) => p.id === select.dataset.er);
        if (!pair) return;
        const value = select.value as Cardinality | "";
        choices[pair.id] = value === "" ? undefined : value;
        const diagram = container.querySelector<HTMLElement>(`[data-er-diagram="${pair.id}"]`);
        if (diagram) diagram.innerHTML = erDiagram(pair.left[this.locale], pair.verb[this.locale], pair.right[this.locale], choices[pair.id]);
        const feedback = container.querySelector<HTMLElement>(`[data-er-feedback="${pair.id}"]`);
        if (feedback) {
          const right = choices[pair.id] === pair.answer;
          feedback.className = `er-feedback ${choices[pair.id] ? (right ? "is-right" : "is-wrong") : ""}`;
          feedback.textContent = choices[pair.id] ? (right ? `${t.erRight} ${pair.explanation[this.locale]}` : t.erWrong) : "";
        }
        const reached = lab.goals.filter((goal) => goal.check({ choices })).map((goal) => goal.id);
        this.recordGoals(lesson, reached, lab);
        this.refreshGoalMarks(container, lesson, reached);
      });
    });
    this.refreshGoalMarks(container, lesson, lab.goals.filter((goal) => goal.check({ choices })).map((goal) => goal.id));
  }

  // ─── Aufgaben ───────────────────────────────────────────────────────────

  private startTask(lesson: Lesson, level: DifficultyLevel): void {
    const counter = (this.progress.attempts[lesson.id] ?? 0) + 1;
    this.progress.attempts[lesson.id] = counter;
    saveLearnerProgress(this.progress);
    const generator = lesson.exercises[(counter - 1) % lesson.exercises.length];
    const rng = createRng(seedFrom(`${lesson.id}:${level}:${counter}`));
    this.task = generator.make(rng, level, this.locale);
    this.taskLessonId = lesson.id;
    this.taskLevel = level;
    this.taskLocale = this.locale;
    this.taskWrongAttempts = 0;
    this.taskRevealed = false;
    this.taskSolved = false;
    this.taskDraft = "";
  }

  private renderExercise(container: HTMLElement, lesson: Lesson): void {
    const t = this.t;
    const task = this.task;
    if (!task) return;
    const level = this.taskLevel;
    const solved = solvedCount(this.progress, lesson.id, level);
    const done = solved >= lesson.requiredCorrect;
    const locked = this.taskSolved || this.taskRevealed;
    const isSql = task.kind !== "choice";

    container.innerHTML = `
      <div class="exercise-head">
        <h4>${esc(t.exerciseTitle(level))} ${done ? "✅" : ""}</h4>
        <span class="exercise-count">${esc(t.exerciseCount(Math.min(solved, lesson.requiredCorrect), lesson.requiredCorrect, Math.max(0, solved - lesson.requiredCorrect)))}</span>
      </div>
      <p class="task-prompt">${task.prompt}</p>
      ${level === 1 && task.hint ? `<p class="task-hint">${esc(t.hintLabel)}: <code class="syntax">${esc(task.hint)}</code></p>` : ""}
      ${
        isSql
          ? `<form class="task-form" id="task-form">
              <textarea id="task-answer" class="sql-editor task-sql" rows="4" spellcheck="false" placeholder="${esc(task.kind === "query" ? t.sqlPlaceholder : t.sqlPlaceholderChange)}" aria-label="SQL" ${locked ? "disabled" : ""}>${esc(this.taskDraft)}</textarea>
              <div class="task-actions">
                <button type="submit" class="btn btn-primary" id="task-check-btn" ${locked ? "disabled" : ""}>${esc(t.checkButton)}</button>
                <button type="button" class="btn btn-secondary" id="task-new-btn">${esc(t.newTaskButton)}</button>
                <button type="button" class="btn btn-ghost btn-sm" id="task-reveal-btn" ${locked ? "hidden" : ""}>${esc(t.revealButton)}</button>
              </div>
            </form>`
          : `<div class="quiz-options" id="task-options">
              ${task.options
                .map((option, index) => `<button type="button" class="quiz-option ${this.taskSolved && index === task.correctIndex ? "is-correct" : ""}" data-choice="${index}" ${locked ? "disabled" : ""}>${option}</button>`)
                .join("")}
            </div>
            <div class="task-actions">
              <button type="button" class="btn btn-secondary" id="task-new-btn">${esc(t.newTaskButton)}</button>
              <button type="button" class="btn btn-ghost btn-sm" id="task-reveal-btn" ${locked ? "hidden" : ""}>${esc(t.revealButton)}</button>
            </div>`
      }
      <p class="task-feedback" id="task-feedback">${this.taskSolved ? esc(t.feedbackCorrect) : this.taskRevealed ? esc(t.feedbackRevealed) : esc(isSql ? t.feedbackIdleSql : t.feedbackIdleChoice)}</p>
      <div class="task-solution" id="task-solution" ${locked ? "" : "hidden"}>
        <strong>${esc(t.solutionTitle)}</strong>
        <div>${task.solutionHtml}</div>
      </div>
    `;

    const answer = container.querySelector<HTMLTextAreaElement>("#task-answer");
    answer?.addEventListener("input", () => {
      this.taskDraft = answer.value;
    });
    answer?.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        this.checkTask(lesson, answer.value);
      }
    });
    container.querySelector<HTMLFormElement>("#task-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (answer) this.checkTask(lesson, answer.value);
    });
    container.querySelectorAll<HTMLButtonElement>("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => this.checkTask(lesson, Number(button.dataset.choice)));
    });
    container.querySelector("#task-new-btn")?.addEventListener("click", () => {
      this.startTask(lesson, this.progress.difficultyLevel);
      this.renderExercise(container, lesson);
      container.querySelector<HTMLTextAreaElement>("#task-answer")?.focus();
    });
    container.querySelector("#task-reveal-btn")?.addEventListener("click", () => {
      this.taskRevealed = true;
      this.renderExercise(container, lesson);
    });
  }

  private checkTask(lesson: Lesson, raw: string | number): void {
    const t = this.t;
    const task = this.task;
    const container = document.getElementById("exercise-card");
    const feedback = document.getElementById("task-feedback");
    if (!task || !container || !feedback) return;
    if (task.kind !== "choice" && !this.SQL) {
      feedback.textContent = this.sqlLoadError ? t.check.sqlError(this.sqlLoadError) : t.check.loading;
      feedback.className = "task-feedback is-warning";
      return;
    }
    const result = checkTask(this.SQL!, lesson.tables, task, raw, this.locale);
    if (result.status === "empty") {
      feedback.textContent = result.message;
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
      this.toast(count === lesson.requiredCorrect ? t.tasksDoneToast(lesson.requiredCorrect, this.taskLevel) : t.check.correct, "success", 2600);
      this.refreshStatus(lesson);
      return;
    }
    this.taskWrongAttempts += 1;
    if (task.kind === "choice" && typeof raw === "number") {
      container.querySelector<HTMLButtonElement>(`[data-choice="${raw}"]`)?.classList.add("is-wrong");
    }
    feedback.textContent = `❌ ${result.message}${this.taskWrongAttempts >= 2 ? t.feedbackRevealHint : ""}`;
    feedback.className = "task-feedback is-warning";
    const reveal = container.querySelector<HTMLButtonElement>("#task-reveal-btn");
    if (reveal && this.taskWrongAttempts >= 2) reveal.classList.add("btn-secondary");
  }

  // ─── Status und Abschluss ───────────────────────────────────────────────

  private renderStatus(container: HTMLElement, lesson: Lesson): void {
    const t = this.t;
    container.innerHTML = `<h4>${esc(t.statusTitle)}</h4><ul class="status-list" id="status-list"></ul><p class="status-done" id="status-done" hidden>${esc(t.statusDone)} ${esc(lesson.text[this.locale].celebrationMessage)}</p>`;
    this.refreshStatus(lesson);
  }

  private refreshStatus(lesson: Lesson): void {
    const t = this.t;
    const list = document.getElementById("status-list");
    const done = document.getElementById("status-done");
    if (!list || !done) return;
    const quiz = isQuizDone(this.progress, lesson.id);
    const goals = goalsReached(this.progress, lesson.id).length;
    const total = lesson.lab.goals.length;
    const solved1 = solvedCount(this.progress, lesson.id, 1);
    const solved2 = solvedCount(this.progress, lesson.id, 2);
    const item = (ok: boolean, text: string) => `<li class="${ok ? "is-done" : ""}"><span>${ok ? "✅" : "○"}</span> ${esc(text)}</li>`;
    list.innerHTML =
      item(quiz, t.statusQuiz) +
      item(goals === total, t.statusLab(goals, total)) +
      item(solved1 >= lesson.requiredCorrect, t.statusTasks(lesson.requiredCorrect, Math.min(solved1, lesson.requiredCorrect))) +
      item(solved2 >= lesson.requiredCorrect, t.statusBonus(lesson.requiredCorrect, Math.min(solved2, lesson.requiredCorrect)));
    done.hidden = !isLessonComplete(this.progress, lesson);
  }

  private afterProgressChange(lesson: Lesson): void {
    saveLearnerProgress(this.progress);
    this.syncHeader();
    const stage = findStageById(lesson.stageId);
    if (!stage) return;
    const filter = this.progress.moduleFilter;
    if (isStageComplete(this.progress, stage, filter) && !this.progress.celebratedStageIds.includes(stage.id)) {
      this.progress.celebratedStageIds.push(stage.id);
      saveLearnerProgress(this.progress);
      const count = relevantLessons(stage, filter).length;
      window.setTimeout(() => {
        showStageCelebration(this.locale, stage, () => this.syncHeader(), count);
      }, 400);
    } else if (isLessonComplete(this.progress, lesson) && !this.progress.celebratedLessonIds.includes(lesson.id)) {
      this.progress.celebratedLessonIds.push(lesson.id);
      saveLearnerProgress(this.progress);
      this.toast(this.t.lessonDoneToast(lesson.text[this.locale].title), "success", 4000);
    }
  }

  // ─── View 3: Spickzettel ────────────────────────────────────────────────

  private renderCheatSheet(host: HTMLElement): void {
    const t = this.t;
    host.innerHTML = `
      <div class="formulas">
        <section class="hero hero-compact">
          <div class="hero-copy">
            <h2>${esc(t.cheatTitle)}</h2>
            <p>${esc(t.cheatText)}</p>
          </div>
        </section>
        ${STAGES.map(
          (stage) => `
          <section class="stage-card" style="--accent:${stage.accent}">
            <header class="stage-head"><span class="stage-icon" aria-hidden="true">${stage.icon}</span><div><h3>${esc(t.stageWord)} ${stage.stageNumber}: ${esc(stage.text[this.locale].title)}</h3><p class="muted">${esc(stage.text[this.locale].moduleLabel)}</p></div></header>
            <table class="formula-table">
              <thead><tr><th>${esc(t.cheatWhat)}</th><th>${esc(t.cheatSql)}</th><th>${esc(t.cheatNote)}</th><th>${esc(t.cheatLesson)}</th></tr></thead>
              <tbody>
                ${stage.lessons
                  .flatMap((lesson) =>
                    lesson.text[this.locale].syntax.map(
                      (entry) => `<tr>
                        <td><strong>${esc(entry.name)}</strong></td>
                        <td><code class="syntax">${esc(entry.sql)}</code></td>
                        <td>${esc(entry.note)}</td>
                        <td><button type="button" class="btn btn-ghost btn-sm" data-open-lesson="${lesson.id}">${esc(lesson.text[this.locale].title)}</button></td>
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

interface SchemaTableView {
  name: string;
  rowCount: number;
  columns: Array<{ name: string; type: string; pk: boolean; fk?: string }>;
}

/** The lesson's tables that still exist, with their row counts now, then the tables the learner created. */
function sandboxTables(sandbox: SandboxState, lab: SqlLabDefinition): SchemaTableView[] {
  const query = (sql: string) => runSql(sandbox.db, sql);
  const present = tableNames(query);
  const isPresent = (name: string) => present.some((p) => p.toLowerCase() === name.toLowerCase());
  const rowCount = (name: string) => {
    const outcome = query(`SELECT COUNT(*) FROM ${quoteIdent(name)};`);
    return outcome.ok ? Number(outcome.results[0]?.values[0]?.[0] ?? 0) : 0;
  };
  const known = describeTables(sandbox.locale, lab.tables).filter((table) => isPresent(table.name));
  const created = present.filter((name) => !known.some((table) => table.name.toLowerCase() === name.toLowerCase()));
  return [
    ...known.map((table) => ({ ...table, rowCount: rowCount(table.name) })),
    ...created.map((name) => {
      const info = query(`PRAGMA table_info(${quoteIdent(name)});`);
      const result = info.ok ? info.results[0] : undefined;
      const at = (column: string) => result?.columns.indexOf(column) ?? -1;
      return {
        name,
        rowCount: rowCount(name),
        columns: (result?.values ?? []).map((row) => ({
          name: String(row[at("name")]),
          type: String(row[at("type")] ?? ""),
          pk: Number(row[at("pk")]) > 0,
        })),
      };
    }),
  ];
}

/** A table name as an SQL identifier: plain when it is a plain word, else in double quotes. */
function quoteIdent(name: string): string {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) ? name : `"${name.replace(/"/g, '""')}"`;
}

function formatCell(cell: SqlCell): string {
  if (cell === null || cell === undefined) return `<i class="null">NULL</i>`;
  if (typeof cell === "number") return esc(String(cell));
  if (typeof cell === "string") return esc(cell);
  return "<i>BLOB</i>";
}

/** A small Chen-style ER diagram: [left] —a— <verb> —b— [right]. */
function erDiagram(left: string, verb: string, right: string, choice: Cardinality | undefined): string {
  const [a, b] = choice === "1:1" ? ["1", "1"] : choice === "1:n" ? ["1", "n"] : choice === "n:m" ? ["n", "m"] : ["?", "?"];
  return `
    <svg viewBox="0 0 440 90" class="er-svg" role="img" aria-label="${esc(`${left} ${a} ${verb} ${b} ${right}`)}">
      <rect x="6" y="25" width="128" height="40" rx="4" class="er-entity"></rect>
      <text x="70" y="50" text-anchor="middle" class="er-text">${esc(left)}</text>
      <line x1="134" y1="45" x2="164" y2="45" class="er-line"></line>
      <text x="149" y="38" text-anchor="middle" class="er-card ${choice ? "" : "is-unset"}">${esc(a)}</text>
      <polygon points="220,14 276,45 220,76 164,45" class="er-rel"></polygon>
      <text x="220" y="49" text-anchor="middle" class="er-verb">${esc(verb)}</text>
      <line x1="276" y1="45" x2="306" y2="45" class="er-line"></line>
      <text x="291" y="38" text-anchor="middle" class="er-card ${choice ? "" : "is-unset"}">${esc(b)}</text>
      <rect x="306" y="25" width="128" height="40" rx="4" class="er-entity"></rect>
      <text x="370" y="50" text-anchor="middle" class="er-text">${esc(right)}</text>
    </svg>`;
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

export const app = new SqlAcademyApp();
