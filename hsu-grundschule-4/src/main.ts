import "./styles.css";
import "./fieldbook.css";
import "./lesson.css";
import { firstMissingLabStep, lessonSteps, renderLottaPanel, type LessonStep, type LottaReaction } from "./lesson-steps";
import { renderFieldMap, walkToWorld } from "./companion/field-map";
import { CouncilMeeting, renderCouncil, updateCouncil, SITES } from "./labs/council";
import { type LottaMood, renderStampSvg } from "./companion/lotta";
import {
	LESSON_BY_ID,
	LESSONS,
	LEXIKON_GROUPS,
	REFERENCE_TABLES,
	STAGE_BY_ID,
	STAGES,
} from "./curriculum";
import {
	buildQuickCheckOptions,
	checkChoiceTask,
	checkNumberTask,
	checkQuickCheckAnswer,
	isNumberTask,
	type PresentedQuickCheckOption,
} from "./exercises/checker";
import { generateExerciseTask } from "./exercises/generators";
import {
	applyLabOption,
	defaultLabState,
	evaluateLab,
	renderLabSceneSvg,
} from "./labs";
import { escapeHtml, fmt } from "./model/format";
import type { ExerciseTask, LabControl, LabState, Lesson, Stage, StageId } from "./model/types";
import {
	clearProgress,
	freshProgress,
	getLessonProgress,
	isLessonComplete,
	loadProgress,
	REQUIRED_CORRECT_PER_LEVEL,
	REQUIRED_LAB_GOALS,
	recordExerciseSuccess,
	recordLabGoals,
	recordQuizSolved,
	saveProgress,
} from "./storage/progress";
import { parseLessonHash } from "./zam/zam-link";

type ViewMode = "map" | "lesson" | "stempel" | "lexikon" | "eltern";
type ThemePreference = "system" | "light" | "dark";

const THEME_KEY = "hsu4-color-scheme";

function getStoredTheme(): ThemePreference {
	try {
		const raw = localStorage.getItem(THEME_KEY);
		if (raw === "light" || raw === "dark") return raw;
	} catch {}
	return "system";
}

function applyThemePreference(pref: ThemePreference): void {
	const meta = document.querySelector<HTMLMetaElement>(
		'meta[name="color-scheme"]',
	);
	if (meta) {
		meta.content = pref === "system" ? "light dark" : pref;
	}
	try {
		if (pref === "system") {
			localStorage.removeItem(THEME_KEY);
		} else {
			localStorage.setItem(THEME_KEY, pref);
		}
	} catch {}
}

function playGentleChime(enabled: boolean): void {
	if (!enabled || typeof window === "undefined") return;
	try {
		const Ctx =
			window.AudioContext ||
			(window as unknown as { webkitAudioContext?: typeof AudioContext })
				.webkitAudioContext;
		if (!Ctx) return;
		const ctx = new Ctx();
		const now = ctx.currentTime;
		for (const [idx, freq] of [523.25, 659.25].entries()) {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = "sine";
			osc.frequency.value = freq;
			gain.gain.setValueAtTime(0.05, now + idx * 0.09);
			gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.22);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start(now + idx * 0.09);
			osc.stop(now + idx * 0.09 + 0.24);
		}
	} catch {}
}

export function mountApp(root: HTMLElement): { destroy: () => void } {
	const loaded = loadProgress();
	let progress = loaded.progress;
	let storageAvailable = loaded.storageAvailable;
	let corruptedNotice = loaded.corrupted;

	let view: ViewMode = "map";
	let activeLessonId: string = LESSONS[0].id;
	let mapWorld: StageId = LESSON_BY_ID.get(progress.lastLessonId ?? "")?.stageId ?? "lb1";
	let council = new CouncilMeeting();
	let reading: SpeechSynthesisUtterance | null = null;
	let lexikonQuery = "";
	let lottaMood: LottaMood = "curious";
	let lottaMessage =
		"Tipp auf einen Ort. Ich laufe mit dir hin!";

	const labStates = new Map<string, LabState>();
	const quizSelection = new Map<string, number>();
	const quizOptionsByLesson = new Map<
		string,
		ReadonlyArray<PresentedQuickCheckOption>
	>();
	let quizSessionSalt =
		Math.floor(Math.random() * 0x7fffffff) || 1;
	const positions = new Map<string, number>();
	let reaction: LottaReaction | null = null;
	const screen = document.createElement("div");
	const announcement = document.createElement("div");
	announcement.className = "map-announcement";
	announcement.setAttribute("role", "status");
	root.replaceChildren(screen, announcement);
	const taskSeedByKey = new Map<string, number>();
	const currentTaskByKey = new Map<string, ExerciseTask>();
	const taskFeedbackByKey = new Map<
		string,
		{ ok: boolean; text: string; selectedChoice?: number; rawInput?: string }
	>();
	const taskUsedHint = new Set<string>();
	const numberDrafts = new Map<string, string>();
	const taskHadWrongAttempt = new Set<string>();
	const taskCountedSuccess = new Set<string>();

	const knownLessonIds = new Set(LESSONS.map((l) => l.id));

	function enterLesson(id: string): void {
		const lesson = LESSON_BY_ID.get(id);
		if (!lesson) return;
		activeLessonId = id;
		reaction = null;
		mapWorld = lesson.stageId;
		if (progress.lastLessonId !== id) {
			progress = { ...progress, lastLessonId: id };
			persistProgress();
		}
	}

	function reducedMotion(): boolean {
		return progress.quietMode || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}

	function stopReading(): void {
		if (reading) window.speechSynthesis.cancel();
		reading = null;
	}

	function localVoice(): SpeechSynthesisVoice | undefined {
		return window.speechSynthesis?.getVoices().find(voice => voice.localService && /^de(?:-|$)/i.test(voice.lang));
	}

	function syncCouncil(): void {
		const panel = root.querySelector<HTMLElement>("#gemeinderat");
		if (panel) updateCouncil(panel, council, Boolean(localVoice()));
	}

	function syncFromHash(): void {
		const hash = window.location.hash;
		const lessonId = parseLessonHash(hash, knownLessonIds);
		if (lessonId) {
			view = "lesson";
			enterLesson(lessonId);
			return;
		}
		if (hash === "#view=stempel") {
			view = "stempel";
		} else if (hash === "#view=lexikon") {
			view = "lexikon";
		} else if (hash === "#view=eltern") {
			view = "eltern";
		} else {
			view = "map";
		}
	}

	function navigateTo(nextView: ViewMode, lessonId?: string): void {
		view = nextView;
		if (nextView === "lesson" && lessonId && LESSON_BY_ID.has(lessonId)) {
			enterLesson(lessonId);
			window.history.replaceState(null, "", `#lesson=${lessonId}`);
		} else if (nextView === "map") {
			window.history.replaceState(
				null,
				"",
				window.location.pathname + window.location.search,
			);
		} else {
			window.history.replaceState(null, "", `#view=${nextView}`);
		}
		render();
		window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
	}

	function isDarkActive(): boolean {
		const pref = getStoredTheme();
		if (pref === "dark") return true;
		if (pref === "light") return false;
		return (
			typeof window.matchMedia === "function" &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
		);
	}

	function applyStagePalette(stage: Stage | undefined): void {
		const dark = isDarkActive();
		if (!stage) {
			root.style.removeProperty("--stage-accent");
			root.style.removeProperty("--stage-soft");
			return;
		}
		root.style.setProperty(
			"--stage-accent",
			dark ? stage.accentDark : stage.accentLight,
		);
		root.style.setProperty(
			"--stage-soft",
			dark ? stage.softDark : stage.softLight,
		);
	}

	function getLabState(lesson: Lesson): LabState {
		const existing = labStates.get(lesson.id);
		if (existing) return existing;
		const init = defaultLabState(lesson);
		labStates.set(lesson.id, init);
		return init;
	}

	function hashLessonSeed(id: string, salt: number): number {
		let h = (2166136261 ^ salt) >>> 0;
		for (let i = 0; i < id.length; i++) {
			h ^= id.charCodeAt(i);
			h = Math.imul(h, 16777619) >>> 0;
		}
		return h || 1;
	}

	function getQuickCheckOptions(
		lesson: Lesson,
	): ReadonlyArray<PresentedQuickCheckOption> {
		const existing = quizOptionsByLesson.get(lesson.id);
		if (existing) return existing;
		const built = buildQuickCheckOptions(
			lesson.quickCheck,
			hashLessonSeed(lesson.id, quizSessionSalt),
		);
		quizOptionsByLesson.set(lesson.id, built);
		return built;
	}

	function getTask(lessonId: string, level: 1 | 2): ExerciseTask {
		const key = `${lessonId}:${level}`;
		const existing = currentTaskByKey.get(key);
		if (existing) return existing;
		const seed = taskSeedByKey.get(key) ?? 1;
		taskSeedByKey.set(key, seed);
		const generated = generateExerciseTask(lessonId, level, seed);
		currentTaskByKey.set(key, generated);
		return generated;
	}

	function nextTask(lessonId: string, level: 1 | 2): void {
		const key = `${lessonId}:${level}`;
		const nextSeed = (taskSeedByKey.get(key) ?? 1) + 1;
		taskSeedByKey.set(key, nextSeed);
		const generated = generateExerciseTask(lessonId, level, nextSeed);
		currentTaskByKey.set(key, generated);
		taskFeedbackByKey.delete(key);
	}

	function persistProgress(): void {
		const ok = saveProgress(progress);
		if (!ok) storageAvailable = false;
	}

	function countEarnedStamps(): number {
		return LESSONS.filter((lesson) =>
			isLessonComplete(getLessonProgress(progress, lesson.id)),
		).length;
	}

	function renderTopbar(): string {
		const stamps = countEarnedStamps();
		return `
			<header class="topbar">
				<button type="button" class="brand-btn" data-action="nav" data-view="map">
					<span class="brand-badge" aria-hidden="true">🐾</span>
					<span>
						Lottas Bayern-Forscherbuch
						<span class="brand-sub">Heimat- und Sachunterricht · 4. Klasse Bayern</span>
					</span>
				</button>
				<nav class="main-nav" aria-label="Hauptnavigation">
					<button type="button" class="nav-btn" data-action="nav" data-view="map" ${view === "map" || view === "lesson" ? 'aria-current="page"' : ""}>🗺️ Entdeckerkarte</button>
					<button type="button" class="nav-btn" data-action="nav" data-view="stempel" ${view === "stempel" ? 'aria-current="page"' : ""}>🏅 Forscherbuch (${fmt(stamps)}/${fmt(LESSONS.length)})</button>
					<button type="button" class="nav-btn" data-action="nav" data-view="lexikon" ${view === "lexikon" ? 'aria-current="page"' : ""}>📖 Forscher-Lexikon</button>
					<button type="button" class="nav-btn" data-action="nav" data-view="eltern" ${view === "eltern" ? 'aria-current="page"' : ""}>🧭 Eltern-Kompass</button>
				</nav>
			</header>
		`;
	}

	function renderNotices(): string {
		const notices: string[] = [];
		if (!storageAvailable) {
			notices.push(
				`<div class="notice-banner" role="status">Dein Browser blockiert gerade das lokale Speichern. Du kannst alle Stationen normal nutzen, aber Stempel bleiben nur bis zum Schließen des Tabs erhalten.</div>`,
			);
		}
		if (corruptedNotice) {
			notices.push(
				`<div class="notice-banner" role="status">Ein beschädigter alter Speicherstand wurde sicher auf ein frisches Forscherbuch zurückgesetzt.</div>`,
			);
		}
		return notices.join("");
	}

	function renderMapView(): string {
		applyStagePalette(undefined);
		const last = LESSON_BY_ID.get(progress.lastLessonId ?? "");
		return `
			<section class="atlas" aria-labelledby="atlas-title">
				<header class="atlas-title"><div><h1 id="atlas-title">Lottas Entdeckerkarte</h1>
					<p>${escapeHtml(lottaMessage)}</p></div>
					${last ? `<button type="button" class="bookmark" data-action="open-lesson" data-lesson-id="${last.id}"><small>Hier warst du zuletzt</small><b>${escapeHtml(last.shortTitle)} →</b></button>` : ""}
				</header>
				${renderFieldMap(mapWorld, progress.quietMode ? "resting" : lottaMood)}
			</section>
			<div id="world-stations">${renderWorldStations()}</div>
		`;
	}

	function renderWorldStations(): string {
		const stage = STAGE_BY_ID.get(mapWorld)!;
		const stageLessons = LESSONS.filter((l) => l.stageId === stage.id);
		const stageDone = stageLessons.filter((l) =>
			isLessonComplete(getLessonProgress(progress, l.id)),
		).length;
		const worldColor = isDarkActive() ? stage.accentDark : stage.accentLight;
		return `
			<section class="world-section" style="--world-color: ${worldColor}">
				<div class="world-header">
					<h2 class="world-title">${stage.icon} ${escapeHtml(stage.worldName)}</h2>
					<span class="world-meta">${escapeHtml(stage.officialTitle)} · ${fmt(stageDone)}/${fmt(stageLessons.length)} Stempel</span>
				</div>
				<p class="world-sub">${escapeHtml(stage.subtitle)}</p>
				<div class="station-grid">
					${stageLessons
						.map((lesson) => {
							const lp = getLessonProgress(progress, lesson.id);
							const complete = isLessonComplete(lp);
							return `
								<button
									type="button"
									class="world-card-btn ${complete ? "is-complete" : ""}"
									data-action="open-lesson"
									data-lesson-id="${lesson.id}"
								>
									<span class="station-top">
										<span>Station ${fmt(lesson.number)} · ${escapeHtml(lesson.sectionCode.replace("HSU 3/4 · ", ""))}</span>
										<span>${complete ? "🏅 Stempel da!" : lesson.icon}</span>
									</span>
									<span class="station-card-title">${escapeHtml(lesson.title)}</span>
									<span class="station-progress-dots">
										Labor ${fmt(lp.goalsReached.length)}/${fmt(REQUIRED_LAB_GOALS)} · Check ${lp.quizSolved ? "✓" : "○"} · Probe ${lp.level1Correct >= 1 && lp.level2Correct >= 1 ? "✓" : `${lp.level1Correct >= 1 ? "1" : "0"}/2`}
									</span>
								</button>
							`;
						})
						.join("")}
				</div>
			</section>
		`;
	}

	function renderQuiz(lesson: Lesson, solved: boolean): string {
		const selectedQuiz = quizSelection.get(lesson.id);
		const presentedQuizOptions = getQuickCheckOptions(lesson);
		const result =
			selectedQuiz === undefined
				? null
				: checkQuickCheckAnswer(lesson.quickCheck, selectedQuiz);
		const explanation = result?.correct
			? lesson.quickCheck.explanation
			: result?.feedback;
		return `<p class="step-question">${escapeHtml(lesson.quickCheck.question)}</p>
			<div class="choice-stack">
				${presentedQuizOptions
					.map((opt) => {
						const isPicked = selectedQuiz === opt.optionId;
						const isRight = opt.isCorrect;
						const cls =
							isPicked && isRight
								? "is-correct"
								: isPicked && !isRight
									? "is-wrong"
									: selectedQuiz === undefined && solved && isRight
										? "is-correct"
										: "";
						return `
							<button
								type="button"
								class="choice-btn ${cls}"
								data-action="quiz-pick"
								data-lesson-id="${lesson.id}"
								data-option-id="${opt.optionId}"
							>
								${escapeHtml(opt.text)}
							</button>
						`;
					})
					.join("")}
			</div>
			${result && explanation && reaction?.message !== explanation ? `<p class="feedback-box ${result.correct ? "ok" : "warn"}">${escapeHtml(explanation)}</p>` : ""}
			${result && !result.correct ? `<details class="reading"><summary>Merksatz nachlesen</summary><p>${escapeHtml(lesson.merksatz)}</p></details>` : ""}`;
	}

	function renderPractice(lesson: Lesson, activeLevel: 1 | 2): string {
		const task = getTask(lesson.id, activeLevel);
		const feedback = taskFeedbackByKey.get(`${lesson.id}:${activeLevel}`);
		const hintShown = taskUsedHint.has(task.id);
		return `<p class="step-question">${escapeHtml(task.prompt)}</p>
			${
				isNumberTask(task)
					? `
						<form class="number-row no-print" data-action="submit-number" data-lesson-id="${lesson.id}" data-level="${activeLevel}">
							<label for="num-answer" class="brand-sub">Deine Antwort:</label>
							<input
								id="num-answer"
								name="answer"
								type="text"
								inputmode="decimal"
								autocomplete="off"
								class="number-input"
								placeholder="${escapeHtml(task.placeholder)}"
								value="${escapeHtml(numberDrafts.get(task.id) ?? feedback?.rawInput ?? "")}"
							/>
							<span><strong>${escapeHtml(task.unit)}</strong></span>
							<button type="submit" class="btn btn-primary">Prüfen</button>
						</form>
					`
					: `
						<div class="choice-stack">
							${task.options
								.map((opt, idx) => {
									const picked = feedback?.selectedChoice === idx;
									const cls =
										picked && feedback?.ok
											? "is-correct"
											: picked && !feedback?.ok
												? "is-wrong"
												: "";
									return `
										<button
											type="button"
											class="choice-btn ${cls}"
											data-action="task-choice"
											data-lesson-id="${lesson.id}"
											data-level="${activeLevel}"
											data-index="${idx}"
										>
											${escapeHtml(opt)}
										</button>
									`;
								})
								.join("")}
						</div>
					`
			}

			<div class="level-tabs no-print">
				<button type="button" class="btn" data-action="show-hint" data-task-id="${escapeHtml(task.id)}">💡 Lotta-Tipp zeigen</button>
				<button type="button" class="btn" data-action="next-task" data-lesson-id="${lesson.id}" data-level="${activeLevel}">🔄 Andere Aufgabe</button>
			</div>

			${hintShown && reaction?.message !== task.hint ? `<div class="feedback-box">💡 <strong>Lottas Tipp:</strong> ${escapeHtml(task.hint)}</div>` : ""}
			${feedback && reaction?.message !== feedback.text && (!hintShown || task.hint !== feedback.text) ? `<div class="feedback-box ${feedback.ok ? "ok" : "warn"}">${escapeHtml(feedback.text)}</div>` : ""}`;
	}

	function renderReading(lesson: Lesson): string {
		const example = lesson.workedExample;
		return `<details class="reading"><summary>Erklärung &amp; Beispiel nachlesen</summary>
			<p>${escapeHtml(lesson.foundationNote)}</p>
			${lesson.storyParagraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
			<h3>${escapeHtml(example.title)}</h3><p>${escapeHtml(example.scenario)}</p>
			<ol>${example.steps.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ol>
			<p>${escapeHtml(example.conclusion)}</p></details>`;
	}

	function renderLabSetting(control: LabControl, state: LabState, compact: boolean): string {
		const key = escapeHtml(control.key);
		const label = escapeHtml(control.label);
		const value = state[control.key];
		if (compact) {
			const selected = control.options.find((option) => option.value === value)!;
			return `<label class="goal-setting"><b>${label}</b>
				<span class="goal-select"><span aria-hidden="true">${escapeHtml(selected.label)}</span>
					<select data-lab-control="${key}">
						${control.options.map((opt) => `<option value="${escapeHtml(opt.value)}" ${value === opt.value ? "selected" : ""}>${escapeHtml(opt.label)}</option>`).join("")}
					</select></span></label>`;
		}
		return `<fieldset class="goal-setting"><legend>${label}</legend>
			<div class="option-pills">${control.options.map((opt) =>
				`<button type="button" class="option-pill" aria-pressed="${value === opt.value}"
					data-action="lab-option" data-key="${key}" data-value="${escapeHtml(opt.value)}">${escapeHtml(opt.label)}</button>`
			).join("")}</div></fieldset>`;
	}

	function renderLabProgress(lesson: Lesson, reached: readonly string[]): string {
		return `<div class="goal-progress"><strong>Forscherziele (${reached.length}/${REQUIRED_LAB_GOALS})</strong>
			<ul>${lesson.lab.goals.map((g) => `<li><span aria-hidden="true">${reached.includes(g.id) ? "✓" : "○"}</span>
				<span class="visually-hidden">${reached.includes(g.id) ? "Erreicht" : "Offen"}:</span> ${escapeHtml(g.label)}</li>`).join("")}</ul></div>`;
	}

	function renderStep(
		lesson: Lesson,
		step: LessonStep,
		steps: LessonStep[],
	): string {
		const lp = getLessonProgress(progress, lesson.id);
		switch (step.kind) {
			case "discover": {
				const card = lesson.factCards[step.index];
				return `<div class="discovery-fact"><span aria-hidden="true">${card.icon}</span>
					<p>${escapeHtml(card.text)}</p></div>${renderReading(lesson)}`;
			}
			case "quiz":
				return renderQuiz(lesson, lp.quizSolved);
			case "practice":
				return renderPractice(lesson, step.level);
			case "council":
				return renderCouncil(step.phase) + renderLabProgress(lesson, lp.goalsReached);
			case "lab": {
				const state = getLabState(lesson);
				const controls = lesson.lab.controls.filter((c) => step.goal.controls.includes(c.key));
				return `<p class="lab-task">${escapeHtml(step.goal.title)}</p>
					<div class="lab-scene-wrap">${renderLabSceneSvg(lesson, state)}</div>
					${controls.map((c) => renderLabSetting(c, state, controls.length > 1)).join("")}
					${renderLabProgress(lesson, lp.goalsReached)}
					<details class="reading" data-observations><summary>Beobachtungen im Modell</summary>
						<h3>${escapeHtml(lesson.lab.title)}</h3><p>${escapeHtml(lesson.lab.intro)}</p>
						<dl>${lesson.lab.readouts(state).map((ro) =>
							`<dt>${escapeHtml(ro.label)}</dt><dd>${escapeHtml(ro.value)}</dd>`
						).join("")}</dl></details>`;
			}
			case "book": {
				const complete = isLessonComplete(lp);
				const checklist = [
					{
						label: "Schlaufuchs-Check",
						done: lp.quizSolved,
						index: steps.findIndex((s) => s.kind === "quiz"),
					},
					{
						label: `Labor (${lp.goalsReached.length}/${REQUIRED_LAB_GOALS})`,
						done: lp.goalsReached.length >= REQUIRED_LAB_GOALS,
						index: firstMissingLabStep(steps, lp.goalsReached),
					},
					...([1, 2] as const).map((level) => ({
						label: level === 1 ? "Spürnase" : "Proben-Profi",
						done:
							(level === 1 ? lp.level1Correct : lp.level2Correct) >=
							REQUIRED_CORRECT_PER_LEVEL,
						index: steps.findIndex(
							(s) => s.kind === "practice" && s.level === level,
						),
					})),
				];
				return `${
					complete
						? `<div class="zam-handoff-box"><b>🏅 ${escapeHtml(lesson.stamp.title)}</b><p>Dein Stempel ist im Forscherbuch. In ZAM kannst du die passenden Lernkarten wiederholen.</p></div>`
						: `<p>Das fehlt dir noch für deinen Stempel:</p><div class="option-pills">${checklist
								.filter((c) => !c.done)
								.map(
									(c) =>
										`<button type="button" class="btn" data-action="lesson-step" data-step="${c.index}">${c.label} →</button>`,
								)
								.join("")}</div>`
				}
					<p class="merke-box"><strong>Merksatz</strong>${escapeHtml(lesson.merksatz)}</p>
					<details class="reading"><summary>Fachbegriffe &amp; Forscherauftrag</summary>
					<dl>${lesson.probenWissen.map((pw) => `<dt>${escapeHtml(pw.term)}</dt><dd>${escapeHtml(pw.definition)}</dd>`).join("")}</dl>
					<p>${escapeHtml(lesson.realWorldQuest)}</p></details>`;
			}
		}
	}

	function renderLessonView(lesson: Lesson): string {
		applyStagePalette(STAGE_BY_ID.get(lesson.stageId));
		const steps = lessonSteps(lesson);
		const index = positions.get(lesson.id) ?? 0;
		const step = steps[index];
		const last = index === steps.length - 1;
		const nextLesson = LESSONS[lesson.number];
		return `<article class="lesson-shell">
			<header class="lesson-heading"><button type="button" class="back-to-map" data-action="nav" data-view="map">← Karte</button>
				<h1 class="station-main-title" title="${escapeHtml(lesson.title)}">${escapeHtml(lesson.shortTitle)}</h1>
				<label class="step-picker"><span>Schritt ${index + 1} von ${steps.length}</span>
				<select aria-label="Lernschritt auswählen" data-step-picker>${steps.map((s, i) => `<option value="${i}" ${i === index ? "selected" : ""}>${i + 1}. ${escapeHtml(s.label)}</option>`).join("")}</select></label>
			</header>
			<div class="lesson-desk">
				${renderLottaPanel(reaction ?? { mood: "curious", message: step.prompt })}
				<section class="step-card" aria-labelledby="step-heading" data-kind="${step.kind}">
					<h2 id="step-heading" tabindex="-1">${escapeHtml(step.label)}</h2>
					${renderStep(lesson, step, steps)}
					<nav class="step-nav" aria-label="Durch die Station blättern">
						<button type="button" class="btn" data-action="lesson-step" data-step="${index - 1}" ${index === 0 ? "disabled" : ""}>← Zurück</button>
						${
							last
								? nextLesson
									? `<button type="button" class="btn btn-primary" data-action="open-lesson" data-lesson-id="${nextLesson.id}">Nächste Station →</button>`
									: '<button type="button" class="btn btn-primary" data-action="nav" data-view="map">Zur Karte →</button>'
								: `<button type="button" class="btn btn-primary" data-action="lesson-step" data-step="${index + 1}">Weiter →</button>`
						}
					</nav>
				</section>
			</div></article>`;
	}

	function goToStep(index: number): void {
		const steps = lessonSteps(LESSON_BY_ID.get(activeLessonId)!);
		if (!Number.isInteger(index) || !steps[index]) return;
		positions.set(activeLessonId, index);
		reaction = null;
		render();
		root
			.querySelector<HTMLElement>("#step-heading")
			?.focus({ preventScroll: true });
		window.scrollTo({ top: 0, behavior: "instant" });
	}

	function react(mood: LottaMood, message: string, fullMessage = message): void {
		reaction = { mood, message };
		announcement.textContent = "Lotta: " + fullMessage;
	}

	function reactToAnswer(mood: "celebrating" | "encouraging", message: string): void {
		const short =
			message.length <= 125
				? message
				: mood === "celebrating"
					? "Geschafft! Schau dir die Erklärung zu deiner Entdeckung an."
					: "Ich habe einen Tipp für dich. Lies ihn bei der Aufgabe.";
		react(mood, short, message);
	}

	function renderStempelView(): string {
		applyStagePalette(undefined);
		const earned = countEarnedStamps();
		const dark = isDarkActive();
		return `
			<section class="section-card">
				<h1>🏅 Mein Bayern-Forscherbuch (${fmt(earned)} von ${fmt(LESSONS.length)} Stempeln)</h1>
				<p>Jede abgeschlossene Station schenkt dir einen Stempel. Klicke auf ein Feld, um direkt zur Station zu springen!</p>
				<div class="stamp-grid">
					${LESSONS.map((lesson) => {
						const lp = getLessonProgress(progress, lesson.id);
						const unlocked = isLessonComplete(lp);
						const stage = STAGE_BY_ID.get(lesson.stageId);
						const accent = stage
							? dark
								? stage.accentDark
								: stage.accentLight
							: "#1f8a5b";
						return `
							<button
								type="button"
								class="stamp-tile"
								data-action="open-lesson"
								data-lesson-id="${lesson.id}"
							>
								${renderStampSvg(lesson.stamp.symbol, lesson.stamp.title, unlocked, accent)}
								<strong>Station ${fmt(lesson.number)}: ${escapeHtml(lesson.stamp.title)}</strong>
								<span class="brand-sub">${escapeHtml(unlocked ? lesson.stamp.subtitle : "Noch zu entdecken")}</span>
							</button>
						`;
					}).join("")}
				</div>
			</section>
		`;
	}

	function renderLexikonView(): string {
		applyStagePalette(undefined);
		const q = lexikonQuery.trim().toLowerCase();
		return `
			<section class="section-card">
				<div class="world-header">
					<h1 style="margin: 0;">📖 Forscher-Lexikon &amp; Proben-Tafeln</h1>
					<button type="button" class="btn no-print" data-action="print-lexikon">🖨️ Drucken</button>
				</div>
				<p>Alle wichtigen Merksätze, Übersichten und Fachbegriffe der 4. Klasse zum schnellen Nachschlagen vor einer HSU-Probe.</p>
				<input
					type="search"
					class="search-input no-print"
					aria-label="Fachbegriff suchen"
					placeholder="Begriff suchen (z. B. Pupille, Maßstab, 112, Donau …)"
					data-action="lexikon-search"
					value="${escapeHtml(lexikonQuery)}"
				/>

				${
					!q
						? `
						<h2>⚡ Schnell-Übersichten für die Probe</h2>
						<div class="ref-table-grid">
							${REFERENCE_TABLES.map(
								(tbl) => `
								<div class="fact-card">
									<h3>${tbl.icon} ${escapeHtml(tbl.title)}</h3>
									<p style="margin-bottom: 0.45rem;">${escapeHtml(tbl.subtitle)}</p>
									${tbl.rows
										.map(
											(r) => `
											<div class="ref-row">
												<strong>${escapeHtml(r.key)}:</strong> ${escapeHtml(r.value)}
											</div>
										`,
										)
										.join("")}
								</div>
							`,
							).join("")}
						</div>
					`
						: ""
				}

				${LEXIKON_GROUPS.map((group) => {
					const filtered = q
						? group.entries.filter(
								(e) =>
									e.term.toLowerCase().includes(q) ||
									e.definition.toLowerCase().includes(q) ||
									e.lessonShortTitle.toLowerCase().includes(q),
							)
						: group.entries;
					if (filtered.length === 0) return "";
					return `
						<div style="margin-top: 1.25rem;">
							<h2>${group.stage.icon} ${escapeHtml(group.stage.officialTitle)}</h2>
							<div class="fact-grid">
								${filtered
									.map(
										(entry) => `
										<div class="fact-card">
											<h3>${escapeHtml(entry.term)}</h3>
											<p>${escapeHtml(entry.definition)}</p>
											<button
												type="button"
												class="btn no-print"
												style="margin-top: 0.55rem; min-height: 36px; padding: 0.25rem 0.65rem; font-size: 0.82rem;"
												data-action="open-lesson"
												data-lesson-id="${entry.lessonId}"
											>
												Zur Station ${fmt(entry.lessonNumber)} →
											</button>
										</div>
									`,
									)
									.join("")}
							</div>
						</div>
					`;
				}).join("")}
			</section>
		`;
	}

	function renderElternView(): string {
		applyStagePalette(undefined);
		const themePref = getStoredTheme();
		return `
			<section class="section-card">
				<h1>🧭 Eltern-Kompass (HSU 4. Klasse Bayern)</h1>
				<p>
					Heimat- und Sachunterricht ist neben Deutsch und Mathematik eines der drei bayerischen Übertrittsfächer.
					Dieses Paket ist so aufgebaut, dass Ihr Kind <strong>jede Station einmal neugierig und kindgerecht erkundet</strong>
					(Geschichte, Alltagsbeispiel, interaktives Mitmach-Labor und kurzer Zwei-Stufen-Check) – das anschließende langfristige Wiederholen findet verteilt in <strong>ZAM</strong> statt.
				</p>
				<p class="foundation-note">
					Hinweis: Alle Angaben bleiben rein lokal im Browser Ihres Geräts (<code>localStorage</code>), ohne Konten, Tracking oder externe Serveranfragen. Das Paket zeigt sachliche Lernfortschritte, gibt aber bewusst keine Übertritts- oder Notenprognosen ab.
				</p>

				<h2>Fortschritt &amp; Gesprächsimpulse nach Lernbereichen</h2>
				<div class="fact-grid">
					${STAGES.map((stage) => {
						const stageLessons = LESSONS.filter((l) => l.stageId === stage.id);
						const done = stageLessons.filter((l) =>
							isLessonComplete(getLessonProgress(progress, l.id)),
						).length;
						return `
							<div class="fact-card">
								<h3>${stage.icon} ${escapeHtml(stage.officialTitle)} (${fmt(done)}/${fmt(stageLessons.length)})</h3>
								<p style="margin-bottom: 0.45rem;"><strong>Typisch in Proben:</strong> ${escapeHtml(stage.probenFocus)}</p>
								<p><strong>Alltags-Impuls:</strong> ${escapeHtml(stage.parentEverydayTip)}</p>
							</div>
						`;
					}).join("")}
				</div>
			</section>

			<section class="section-card">
				<h2>Zuletzt bearbeitete Proben-Aufgaben</h2>
				${
					progress.recentEvidence.length === 0
						? `<p class="foundation-note">Sobald Ihr Kind Proben-Checks in den Stationen löst, erscheinen hier die letzten Einträge mit Datum und Themenbereich.</p>`
						: `<div class="fact-grid">
							${progress.recentEvidence
								.slice(0, 8)
								.map(
									(ev) => `
									<div class="fact-card">
										<h3>Stufe ${fmt(ev.level)} · ${escapeHtml(ev.lessonTitle)}</h3>
										<p>${escapeHtml(ev.promptSummary)}</p>
										<p style="margin-top: 0.35rem; font-size: 0.82rem;">
											${ev.correctFirstTry ? "Beim 1. Versuch gelöst" : "Nach Korrektur gelöst"}${ev.helped ? " · mit Tipp" : ""}
										</p>
									</div>
								`,
								)
								.join("")}
						</div>`
				}
			</section>

			<section class="section-card no-print">
				<h2>Darstellung, Ruhe-Modus &amp; Speicher</h2>
				<div class="lab-controls">
					<div class="lab-control-group" role="group" aria-label="Farbschema wählen">
						<span class="lab-control-label">Farbschema</span>
						<div class="option-pills">
							<button type="button" class="option-pill" aria-pressed="${themePref === "system" ? "true" : "false"}" data-action="set-theme" data-theme="system">System-Einstellung</button>
							<button type="button" class="option-pill" aria-pressed="${themePref === "light" ? "true" : "false"}" data-action="set-theme" data-theme="light">☀️ Hell</button>
							<button type="button" class="option-pill" aria-pressed="${themePref === "dark" ? "true" : "false"}" data-action="set-theme" data-theme="dark">🌙 Dunkel</button>
						</div>
					</div>

					<div class="lab-control-group" role="group" aria-label="Ruhe und Ton">
						<span class="lab-control-label">Ruhe-Modus &amp; dezenter Erfolgs-Ton</span>
						<div class="option-pills">
							<button type="button" class="option-pill" aria-pressed="${progress.quietMode ? "true" : "false"}" data-action="toggle-quiet">
								${progress.quietMode ? "✅ Ruhe-Modus aktiv (weniger Bewegung)" : "🌿 Ruhe-Modus einschalten"}
							</button>
							<button type="button" class="option-pill" aria-pressed="${progress.soundEnabled ? "true" : "false"}" data-action="toggle-sound">
								${progress.soundEnabled ? "🔔 Sanfter Stempel-Ton an" : "🔕 Ton stummgeschaltet"}
							</button>
						</div>
					</div>
				</div>

				<button type="button" class="btn" data-action="open-reset-dialog">🗑️ Lokalen Fortschritt zurücksetzen …</button>

				<dialog id="reset-dialog" closedby="any" aria-labelledby="reset-dialog-title">
					<h3 id="reset-dialog-title" style="margin-top: 0;">Forscherbuch wirklich zurücksetzen?</h3>
					<p>Alle lokal gespeicherten Stempel, Labor-Entdeckungen und Aufgaben-Einträge auf diesem Gerät werden gelöscht.</p>
					<form method="dialog" class="dialog-actions">
						<button type="submit" value="cancel" class="btn">Abbrechen</button>
						<button type="submit" value="confirm" class="btn btn-primary">Ja, neu starten</button>
					</form>
				</dialog>
			</section>
		`;
	}

	function wireResetDialog(): void {
		const dialog = root.querySelector<HTMLDialogElement>("#reset-dialog");
		if (!dialog) return;
		dialog.addEventListener("close", () => {
			const decision = dialog.returnValue;
			dialog.returnValue = "";
			if (decision === "confirm") {
				clearProgress();
				progress = freshProgress();
				mapWorld = "lb1";
				taskSeedByKey.clear();
				currentTaskByKey.clear();
				taskUsedHint.clear();
				taskHadWrongAttempt.clear();
				positions.clear();
				numberDrafts.clear();
				reaction = null;
				council = new CouncilMeeting();
				lottaMood = "curious";
				labStates.clear();
				quizSelection.clear();
				quizOptionsByLesson.clear();
				quizSessionSalt = (quizSessionSalt + 0x9e3779b9) >>> 0 || 1;
				taskFeedbackByKey.clear();
				taskCountedSuccess.clear();
				lottaMessage =
					"Dein Forscherbuch ist frisch aufgeschlagen – bereit für eine neue Entdeckungstour!";
				render();
			}
		});
		if (!("closedBy" in HTMLDialogElement.prototype)) {
			dialog.addEventListener("click", (event) => {
				if (event.target !== dialog) return;
				const rect = dialog.getBoundingClientRect();
				const inside =
					rect.top <= event.clientY &&
					event.clientY <= rect.top + rect.height &&
					rect.left <= event.clientX &&
					event.clientX <= rect.left + rect.width;
				if (!inside) dialog.close();
			});
		}
	}

	function render(): void {
		const focused = view === "lesson" ? document.activeElement : null;
		const focusSelector =
			focused instanceof HTMLElement && focused.closest(".step-card")
				? focused.id
					? "#" + CSS.escape(focused.id)
					: Array.from(focused.attributes)
							.filter((a) => a.name.startsWith("data-"))
							.map((a) => `[${a.name}="${CSS.escape(a.value)}"]`)
							.join("")
				: "";
		stopReading();
		root.dataset.quiet = progress.quietMode ? "true" : "false";
		const lesson = LESSON_BY_ID.get(activeLessonId) ?? LESSONS[0];
		const bodyHtml =
			view === "lesson"
				? renderLessonView(lesson)
				: view === "stempel"
					? renderStempelView()
					: view === "lexikon"
						? renderLexikonView()
						: view === "eltern"
							? renderElternView()
							: renderMapView();

		screen.innerHTML = `
			<div class="app-shell">
				${view === "lesson" ? "" : renderTopbar()}
				${renderNotices()}
				<main id="main-content">${bodyHtml}</main>
			</div>
		`;
		if (view === "lesson" && activeLessonId === "unsere-gemeinde")
			syncCouncil();
		if (focusSelector)
			root
				.querySelector<HTMLElement>(focusSelector)
				?.focus({ preventScroll: true });
		if (view === "eltern") {
			wireResetDialog();
		}
	}

	function handleStampCelebration(unlocked: boolean, lesson: Lesson): void {
		if (!unlocked) return;
		lottaMood = "celebrating";
		lottaMessage = `Juhu! Du hast den Stempel „${lesson.stamp.title}“ verdient!`;
		react("celebrating", lottaMessage);
		playGentleChime(progress.soundEnabled);
	}

	function setLabOption(lesson: Lesson, key: string, val: string): void {
		const before = getLabState(lesson);
		const nextState = applyLabOption(lesson, before, key, val);
		labStates.set(lesson.id, nextState);
		const evaluated = evaluateLab(lesson, nextState);
		const prior = lesson.lab.readouts(before);
		const changed = evaluated.readouts.find(
			(r, i) => prior[i]?.value !== r.value,
		);
		const res = recordLabGoals(progress, lesson.id, evaluated.reachedGoalIds);
		const goal = lesson.lab.goals.find((g) => res.addedGoals.includes(g.id));
		if (goal) {
			react(
				"celebrating",
				key === "vorschlag"
					? "Dein Vorschlag ist im Rat angekommen!"
					: "Eine neue Entdeckung! " + (changed?.value ?? goal.title),
			);
			progress = res.progress;
			persistProgress();
			handleStampCelebration(res.stampUnlocked, lesson);
		} else {
			react(
				"curious",
				changed?.value ??
					(key === "vorschlag"
						? "Ich habe deinen neuen Vorschlag für den Rat notiert."
						: "Schau genau hin. Was passiert mit einer anderen Einstellung?"),
			);
		}
	}

	function changeLabSetting(key: string, value: string): void {
		const lesson = LESSON_BY_ID.get(activeLessonId)!;
		if (getLabState(lesson)[key] === value) return;
		const observationsOpen = root.querySelector<HTMLDetailsElement>("[data-observations]")?.open;
		setLabOption(lesson, key, value);
		render();
		if (observationsOpen) root.querySelector<HTMLDetailsElement>("[data-observations]")!.open = true;
	}

	const onClick = (event: Event): void => {
		const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
			"[data-action]",
		);
		if (!target) return;
		const action = target.dataset.action;

		if (action === "lesson-step") {
			goToStep(Number(target.dataset.step));
			return;
		}
		if (action === "choose-world") {
			const world = STAGES.find((stage) => stage.id === target.dataset.world);
			const map = root.querySelector<HTMLElement>(".field-map");
			if (!world || !map) return;
			walkToWorld(map, mapWorld, world.id, reducedMotion());
			mapWorld = world.id;
			for (const button of map.querySelectorAll<HTMLButtonElement>(
				".map-place",
			)) {
				button.setAttribute(
					"aria-pressed",
					String(button.dataset.world === mapWorld),
				);
			}
			root.querySelector("#world-stations")!.innerHTML = renderWorldStations();
			announcement.textContent =
				"Stationen für " + world.worldName + " unter der Karte.";
			return;
		}
		if (
			action?.startsWith("council-") &&
			activeLessonId === "unsere-gemeinde"
		) {
			stopReading();
			if (action === "council-site") {
				const site = target.dataset.site;
				if (site === "schulwiese" || site === "obstanger") {
					const step = lessonSteps(LESSON_BY_ID.get(activeLessonId)!)[positions.get(activeLessonId) ?? 0];
					if (step.kind !== "council") return;
					council.selectSite(site, step.phase);
					react(
						"curious",
						site === "schulwiese"
							? "Neben der Schulwiese stehen Wohnhäuser. Wer könnte hier besonders gut spielen?"
							: "Auf dem Obstanger wachsen alte Bäume. Wo hätten Spielgeräte Platz?",
					);
				}
			} else if (action === "council-listen") {
				council.listen(Number(target.dataset.index));
				react(
					"curious",
					council.consulted.size >= 2
						? "Du kennst jetzt mehrere Meinungen. Wie würdest du sie abwägen?"
						: "Du hast eine Stimme gehört. Was denkt jemand anderes darüber?",
				);
			} else if (action === "council-consult" || action === "council-compare") {
				const phase = action === "council-compare" ? "places" : "voices";
				goToStep(
					lessonSteps(LESSON_BY_ID.get(activeLessonId)!).findIndex(
						(s) => s.kind === "council" && s.phase === phase,
					),
				);
				return;
			} else if (action === "council-read") {
				const voice = localVoice();
				if (voice) {
					reading = new SpeechSynthesisUtterance(
						root.querySelector("[data-quote]")!.textContent ?? "",
					);
					reading.lang = voice.lang;
					reading.voice = voice;
					window.speechSynthesis.speak(reading);
				}
			} else if (action === "council-reason") {
				council.reason = Number(target.dataset.index);
				if (council.site)
					react(
						"encouraging",
						`Dein Plan für den Standort ${SITES[council.site]} hat eine Begründung. Möchtest du ihn einbringen?`,
					);
				council.submitted = false;
			} else if (action === "council-submit") {
				const site = council.submit();
				if (site) {
					setLabOption(LESSON_BY_ID.get(activeLessonId)!, "vorschlag", site);
					render();
					const result = root.querySelector<HTMLElement>("[data-result]")!;
					result.tabIndex = -1;
					result.focus({ preventScroll: true });
					return;
				}
			}
			syncCouncil();
			if (reaction && action !== "council-read") {
				const panel = root.querySelector(".lesson-lotta");
				if (panel) panel.outerHTML = renderLottaPanel(reaction);
			}
			return;
		}
		if (action === "nav") {
			const next = (target.dataset.view as ViewMode) ?? "map";
			navigateTo(next);
			return;
		}
		if (action === "open-lesson") {
			const id = target.dataset.lessonId;
			if (id) navigateTo("lesson", id);
			return;
		}
		if (action === "quiz-pick") {
			const id = target.dataset.lessonId ?? activeLessonId;
			const optionId = Number(target.dataset.optionId);
			const lesson = LESSON_BY_ID.get(id);
			if (!lesson || Number.isNaN(optionId)) return;
			quizSelection.set(id, optionId);
			const answer = checkQuickCheckAnswer(lesson.quickCheck, optionId);
			reactToAnswer(
				answer.correct ? "celebrating" : "encouraging",
				answer.correct ? lesson.quickCheck.explanation : answer.feedback,
			);
			if (answer.correct) {
				const res = recordQuizSolved(progress, id);
				progress = res.progress;
				persistProgress();
				handleStampCelebration(res.stampUnlocked, lesson);
			}
			render();
			return;
		}
		if (action === "lab-option") {
			if (target.dataset.key && target.dataset.value !== undefined)
				changeLabSetting(target.dataset.key, target.dataset.value);
			return;
		}
		if (action === "task-choice") {
			const id = target.dataset.lessonId ?? activeLessonId;
			const lvl = target.dataset.level === "2" ? 2 : 1;
			const idx = Number(target.dataset.index);
			const lesson = LESSON_BY_ID.get(id);
			if (!lesson || Number.isNaN(idx)) return;
			const task = getTask(id, lvl);
			if (task.kind !== "choice") return;
			const res = checkChoiceTask(task, idx);
			reactToAnswer(res.correct ? "celebrating" : "encouraging", res.feedback);
			const key = `${id}:${lvl}`;
			taskFeedbackByKey.set(key, {
				ok: res.correct,
				text: res.feedback,
				selectedChoice: idx,
			});
			if (res.correct) {
				if (!taskCountedSuccess.has(task.id)) {
					taskCountedSuccess.add(task.id);
					const updated = recordExerciseSuccess(progress, {
						lessonId: id,
						lessonTitle: lesson.shortTitle,
						stageId: lesson.stageId,
						level: lvl,
						promptSummary: task.prompt,
						helped: taskUsedHint.has(task.id),
						correctFirstTry: !taskHadWrongAttempt.has(task.id),
					});
					progress = updated.progress;
					persistProgress();
					handleStampCelebration(updated.stampUnlocked, lesson);
				}
			} else {
				taskHadWrongAttempt.add(task.id);
			}
			render();
			return;
		}
		if (action === "show-hint") {
			const taskId = target.dataset.taskId;
			const lesson = LESSON_BY_ID.get(activeLessonId)!;
			const step = lessonSteps(lesson)[positions.get(lesson.id) ?? 0];
			if (taskId && step.kind === "practice") {
				taskUsedHint.add(taskId);
				reactToAnswer("encouraging", getTask(lesson.id, step.level).hint);
				render();
			}
			return;
		}
		if (action === "next-task") {
			const id = target.dataset.lessonId ?? activeLessonId;
			const lvl = target.dataset.level === "2" ? 2 : 1;
			nextTask(id, lvl);
			react(
				"curious",
				"Ein neuer Fall! Lies die Angaben diesmal noch einmal genau.",
			);
			render();
			return;
		}
		if (action === "print-lexikon") {
			window.print();
			return;
		}
		if (action === "set-theme") {
			const pref = target.dataset.theme as ThemePreference;
			if (pref === "system" || pref === "light" || pref === "dark") {
				applyThemePreference(pref);
				render();
			}
			return;
		}
		if (action === "toggle-quiet") {
			progress = { ...progress, quietMode: !progress.quietMode };
			persistProgress();
			render();
			return;
		}
		if (action === "toggle-sound") {
			progress = { ...progress, soundEnabled: !progress.soundEnabled };
			persistProgress();
			if (progress.soundEnabled) playGentleChime(true);
			render();
			return;
		}
		if (action === "open-reset-dialog") {
			const dialog = root.querySelector<HTMLDialogElement>("#reset-dialog");
			dialog?.showModal();
		}
	};

	const onSubmit = (event: Event): void => {
		const form = (event.target as HTMLElement | null)?.closest<HTMLFormElement>(
			'form[data-action="submit-number"]',
		);
		if (!form) return;
		event.preventDefault();
		const id = form.dataset.lessonId ?? activeLessonId;
		const lvl = form.dataset.level === "2" ? 2 : 1;
		const lesson = LESSON_BY_ID.get(id);
		if (!lesson) return;
		const task = getTask(id, lvl);
		if (!isNumberTask(task)) return;
		const input = form.querySelector<HTMLInputElement>('input[name="answer"]');
		const raw = input?.value ?? "";
		const res = checkNumberTask(task, raw);
		reactToAnswer(res.correct ? "celebrating" : "encouraging", res.feedback);
		const key = `${id}:${lvl}`;
		taskFeedbackByKey.set(key, {
			ok: res.correct,
			text: res.feedback,
			rawInput: raw,
		});
		if (res.correct) {
			if (!taskCountedSuccess.has(task.id)) {
				taskCountedSuccess.add(task.id);
				const updated = recordExerciseSuccess(progress, {
					lessonId: id,
					lessonTitle: lesson.shortTitle,
					stageId: lesson.stageId,
					level: lvl,
					promptSummary: task.prompt,
					helped: taskUsedHint.has(task.id),
					correctFirstTry: !taskHadWrongAttempt.has(task.id),
				});
				progress = updated.progress;
				persistProgress();
				handleStampCelebration(updated.stampUnlocked, lesson);
			}
		} else if (res.validInput) {
			taskHadWrongAttempt.add(task.id);
		}
		render();
	};

	const onInput = (event: Event): void => {
		const input = event.target as HTMLInputElement | null;
		if (input?.id === "num-answer") {
			const form = input.form;
			if (form) numberDrafts.set(getTask(activeLessonId, form.dataset.level === "2" ? 2 : 1).id, input.value);
			return;
		}
		if (!input || input.dataset.action !== "lexikon-search") return;
		const pos = input.selectionStart ?? input.value.length;
		lexikonQuery = input.value;
		render();
		const restored = root.querySelector<HTMLInputElement>(
			'input[data-action="lexikon-search"]',
		);
		if (restored) {
			restored.focus();
			restored.setSelectionRange(pos, pos);
		}
	};

	const onChange = (event: Event): void => {
		const select = event.target;
		if (!(select instanceof HTMLSelectElement)) return;
		if (select.hasAttribute("data-step-picker")) goToStep(Number(select.value));
		else if (select.dataset.labControl) changeLabSetting(select.dataset.labControl, select.value);
	};

	const onHashChange = (): void => {
		syncFromHash();
		render();
	};

	const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
	const onSystemThemeChange = (): void => {
		if (getStoredTheme() !== "system") return;
		if (view === "lesson") applyStagePalette(STAGE_BY_ID.get(LESSON_BY_ID.get(activeLessonId)!.stageId));
		else if (view === "map" || view === "stempel") render();
	};
	systemTheme.addEventListener("change", onSystemThemeChange);
	root.addEventListener("click", onClick);
	root.addEventListener("submit", onSubmit);
	root.addEventListener("input", onInput);
	root.addEventListener("change", onChange);
	window.addEventListener("hashchange", onHashChange);
	window.speechSynthesis?.addEventListener("voiceschanged", syncCouncil);

	syncFromHash();
	render();

	return {
		destroy() {
			systemTheme.removeEventListener("change", onSystemThemeChange);
			root.removeEventListener("click", onClick);
			root.removeEventListener("submit", onSubmit);
			root.removeEventListener("input", onInput);
			root.removeEventListener("change", onChange);
			window.removeEventListener("hashchange", onHashChange);
			window.speechSynthesis?.removeEventListener("voiceschanged", syncCouncil);
			stopReading();
		},
	};
}

const appRoot = document.getElementById("app");
if (appRoot) {
	mountApp(appRoot);
}
