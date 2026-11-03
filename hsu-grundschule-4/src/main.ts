import "./styles.css";
import { type LottaMood, renderLottaSvg, renderStampSvg } from "./companion/lotta";
import {
	LESSON_BY_ID,
	LESSONS,
	LEXIKON_GROUPS,
	REFERENCE_TABLES,
	STAGE_BY_ID,
	STAGES,
} from "./curriculum";
import {
	checkChoiceTask,
	checkNumberTask,
	isNumberTask,
} from "./exercises/checker";
import { generateExerciseTask } from "./exercises/generators";
import {
	applyLabOption,
	defaultLabState,
	evaluateLab,
	renderLabSceneSvg,
} from "./labs";
import { escapeHtml, fmt } from "./model/format";
import type { ExerciseTask, LabState, Lesson, Stage } from "./model/types";
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
	let lexikonQuery = "";
	let lottaMood: LottaMood = "curious";
	let lottaMessage =
		"Servus! Ich bin Luchs Lotta. Such dir eine Entdeckerwelt aus – jede Station machst du einmal in Ruhe durch, danach trainierst du die Karten schlau in ZAM weiter!";

	const labStates = new Map<string, LabState>();
	const quizSelection = new Map<string, number>();
	const activeLevelByLesson = new Map<string, 1 | 2>();
	const taskSeedByKey = new Map<string, number>();
	const currentTaskByKey = new Map<string, ExerciseTask>();
	const taskFeedbackByKey = new Map<
		string,
		{ ok: boolean; text: string; selectedChoice?: number; rawInput?: string }
	>();
	const taskUsedHint = new Set<string>();
	const taskHadWrongAttempt = new Set<string>();
	const taskCountedSuccess = new Set<string>();

	const knownLessonIds = new Set(LESSONS.map((l) => l.id));

	function syncFromHash(): void {
		const hash = window.location.hash;
		const lessonId = parseLessonHash(hash, knownLessonIds);
		if (lessonId) {
			view = "lesson";
			activeLessonId = lessonId;
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
			activeLessonId = lessonId;
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
		window.scrollTo({ top: 0, behavior: progress.quietMode ? "auto" : "smooth" });
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
		const earned = countEarnedStamps();
		const totalGoals = LESSONS.reduce(
			(sum, l) => sum + getLessonProgress(progress, l.id).goalsReached.length,
			0,
		);
		const dark = isDarkActive();

		return `
			<section class="hero-card" aria-label="Begrüßung von Luchs Lotta">
				<div class="lotta-wrap">${renderLottaSvg(progress.quietMode ? "resting" : lottaMood)}</div>
				<div>
					<h1 class="hero-title">Auf Entdeckungstour durch alle 6 HSU-Welten!</h1>
					<p class="hero-speech">${escapeHtml(lottaMessage)}</p>
					<div class="hero-pills">
						<span class="stat-pill">🏅 ${fmt(earned)} von ${fmt(LESSONS.length)} Forscher-Stempeln</span>
						<span class="stat-pill">🔬 ${fmt(totalGoals)} von ${fmt(LESSONS.length * 3)} Labor-Entdeckungen</span>
						<span class="stat-pill">🎯 Einmal erforschen → in ZAM weiterüben</span>
					</div>
				</div>
			</section>

			${STAGES.map((stage) => {
				const stageLessons = LESSONS.filter((l) => l.stageId === stage.id);
				const stageDone = stageLessons.filter((l) =>
					isLessonComplete(getLessonProgress(progress, l.id)),
				).length;
				const worldColor = dark ? stage.accentDark : stage.accentLight;
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
			}).join("")}
		`;
	}

	function renderLessonView(lesson: Lesson): string {
		const stage = STAGE_BY_ID.get(lesson.stageId);
		applyStagePalette(stage);

		const lp = getLessonProgress(progress, lesson.id);
		const complete = isLessonComplete(lp);
		const labState = getLabState(lesson);
		const labEval = evaluateLab(lesson, labState);
		const selectedQuiz = quizSelection.get(lesson.id);
		const activeLevel = activeLevelByLesson.get(lesson.id) ?? 1;
		const task = getTask(lesson.id, activeLevel);
		const taskKey = `${lesson.id}:${activeLevel}`;
		const feedback = taskFeedbackByKey.get(taskKey);
		const hintShown = taskUsedHint.has(task.id);

		const prevLesson = LESSONS[lesson.number - 2];
		const nextLesson = LESSONS[lesson.number];

		return `
			<article>
				<div class="station-header-card">
					<div class="station-kicker">${stage ? `${stage.icon} ${escapeHtml(stage.worldName)} · ` : ""}${escapeHtml(lesson.sectionCode)} · Station ${fmt(lesson.number)} von ${fmt(LESSONS.length)}</div>
					<h1 class="station-main-title">${lesson.icon} ${escapeHtml(lesson.title)}</h1>
					<p class="station-hook">${escapeHtml(lesson.hook)}</p>
					<p class="foundation-note">🌱 ${escapeHtml(lesson.foundationNote)}</p>
					<div class="jump-pills no-print">
						<a class="jump-link" href="#wissen">1. Entdecken &amp; Merksatz</a>
						<a class="jump-link" href="#check">2. Schlaufuchs-Check ${lp.quizSolved ? "✓" : ""}</a>
						<a class="jump-link" href="#labor">3. Mitmach-Labor (${fmt(lp.goalsReached.length)}/${fmt(REQUIRED_LAB_GOALS)})</a>
						<a class="jump-link" href="#probe">4. Proben-Check (${lp.level1Correct >= 1 && lp.level2Correct >= 1 ? "✓" : `${(lp.level1Correct >= 1 ? 1 : 0) + (lp.level2Correct >= 1 ? 1 : 0)}/2`})</a>
					</div>
				</div>

				<section id="wissen" class="section-card">
					<h2>1. Entdecken &amp; Verstehen</h2>
					${lesson.storyParagraphs
						.map((p) => `<p class="story-p">${escapeHtml(p)}</p>`)
						.join("")}

					<div class="fact-grid">
						${lesson.factCards
							.map(
								(fc) => `
								<div class="fact-card">
									<h3>${fc.icon} ${escapeHtml(fc.title)}</h3>
									<p>${escapeHtml(fc.text)}</p>
								</div>
							`,
							)
							.join("")}
					</div>

					<div class="example-box">
						<h3>🔍 Alltags-Beispiel: ${escapeHtml(lesson.workedExample.title)}</h3>
						<p>${escapeHtml(lesson.workedExample.scenario)}</p>
						<ol class="example-steps">
							${lesson.workedExample.steps
								.map((step) => `<li>${escapeHtml(step)}</li>`)
								.join("")}
						</ol>
						<p><strong>Ergebnis:</strong> ${escapeHtml(lesson.workedExample.conclusion)}</p>
					</div>

					<div class="merke-box">
						<strong>📌 Merksatz für dein Forscherbuch</strong>
						<span>${escapeHtml(lesson.merksatz)}</span>
					</div>

					<div class="quest-box">
						<strong>🎒 Mini-Forscherauftrag für draußen &amp; zu Hause:</strong>
						${escapeHtml(lesson.realWorldQuest)}
					</div>
				</section>

				<section id="check" class="section-card">
					<h2>2. Schlaufuchs-Check ${lp.quizSolved ? "✅" : ""}</h2>
					<p><strong>${escapeHtml(lesson.quickCheck.question)}</strong></p>
					<div class="choice-stack">
						${lesson.quickCheck.options
							.map((opt, idx) => {
								const isPicked = selectedQuiz === idx;
								const isRight = idx === lesson.quickCheck.correctIndex;
								const cls =
									isPicked && isRight
										? "is-correct"
										: isPicked && !isRight
											? "is-wrong"
											: lp.quizSolved && isRight
												? "is-correct"
												: "";
								return `
									<button
										type="button"
										class="choice-btn ${cls}"
										data-action="quiz-pick"
										data-lesson-id="${lesson.id}"
										data-index="${idx}"
									>
										${escapeHtml(opt)}
									</button>
								`;
							})
							.join("")}
					</div>
					${
						selectedQuiz !== undefined || lp.quizSolved
							? `<div class="feedback-box ${selectedQuiz === lesson.quickCheck.correctIndex || lp.quizSolved ? "ok" : "warn"}">
								${
									selectedQuiz === lesson.quickCheck.correctIndex || lp.quizSolved
										? `Super! ${escapeHtml(lesson.quickCheck.explanation)}`
										: "Fast! Überlege noch einmal mit Blick auf den Merksatz und probiere eine andere Antwort."
								}
							</div>`
							: ""
					}
				</section>

				<section id="labor" class="section-card">
					<h2>3. Mitmach-Labor: ${escapeHtml(lesson.lab.title)}</h2>
					<p>${escapeHtml(lesson.lab.intro)}</p>

					<div class="lab-scene-wrap">
						${renderLabSceneSvg(lesson, labState)}
					</div>

					<div class="lab-controls no-print">
						${lesson.lab.controls
							.map(
								(ctrl) => `
								<div class="lab-control-group" role="group" aria-label="${escapeHtml(ctrl.label)}">
									<span class="lab-control-label">${escapeHtml(ctrl.label)}</span>
									<div class="option-pills">
										${ctrl.options
											.map(
												(opt) => `
												<button
													type="button"
													class="option-pill"
													aria-pressed="${labState[ctrl.key] === opt.value ? "true" : "false"}"
													data-action="lab-option"
													data-lesson-id="${lesson.id}"
													data-key="${escapeHtml(ctrl.key)}"
													data-value="${escapeHtml(opt.value)}"
												>
													${escapeHtml(opt.label)}
												</button>
											`,
											)
											.join("")}
									</div>
								</div>
							`,
							)
							.join("")}
					</div>

					<div class="readout-grid" aria-live="polite">
						${labEval.readouts
							.map(
								(ro) => `
								<div class="readout-card">
									<div class="readout-label">${escapeHtml(ro.label)}</div>
									<div class="readout-val">${escapeHtml(ro.value)}</div>
								</div>
							`,
							)
							.join("")}
					</div>

					<h3>Deine 3 Forscher-Ziele (${fmt(lp.goalsReached.length)}/${fmt(REQUIRED_LAB_GOALS)} entdeckt)</h3>
					<ul class="goal-list">
						${lesson.lab.goals
							.map((goal) => {
								const everReached = lp.goalsReached.includes(goal.id);
								return `
									<li class="goal-item ${everReached ? "is-reached" : ""}">
										<span aria-hidden="true">${everReached ? "✅" : "🔎"}</span>
										<span>${escapeHtml(goal.title)}</span>
									</li>
								`;
							})
							.join("")}
					</ul>
				</section>

				<section id="probe" class="section-card">
					<h2>4. Kurzer Proben-Check (einmal je Stufe)</h2>
					<p>Löse eine Aufgabe als <strong>Spürnase</strong> und eine als <strong>Proben-Profi</strong>. Danach sitzen die Grundlagen für das Weiterlernen in ZAM!</p>

					<div class="level-tabs no-print" role="tablist" aria-label="Schwierigkeitsstufe">
						<button
							type="button"
							role="tab"
							aria-selected="${activeLevel === 1 ? "true" : "false"}"
							class="btn ${activeLevel === 1 ? "btn-primary" : ""}"
							data-action="set-level"
							data-lesson-id="${lesson.id}"
							data-level="1"
						>
							🐾 Stufe 1: Spürnase ${lp.level1Correct >= REQUIRED_CORRECT_PER_LEVEL ? "✓" : ""}
						</button>
						<button
							type="button"
							role="tab"
							aria-selected="${activeLevel === 2 ? "true" : "false"}"
							class="btn ${activeLevel === 2 ? "btn-primary" : ""}"
							data-action="set-level"
							data-lesson-id="${lesson.id}"
							data-level="2"
						>
							🎓 Stufe 2: Proben-Profi ${lp.level2Correct >= REQUIRED_CORRECT_PER_LEVEL ? "✓" : ""}
						</button>
					</div>

					<p class="station-kicker">${escapeHtml(task.contextTag)}</p>
					<p><strong>${escapeHtml(task.prompt)}</strong></p>

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
										value="${escapeHtml(feedback?.rawInput ?? "")}"
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

					${hintShown ? `<div class="feedback-box">💡 <strong>Lottas Tipp:</strong> ${escapeHtml(task.hint)}</div>` : ""}
					${feedback ? `<div class="feedback-box ${feedback.ok ? "ok" : "warn"}">${escapeHtml(feedback.text)}</div>` : ""}

					${
						complete
							? `
								<div class="zam-handoff-box">
									<strong>🏅 Forscher-Stempel „${escapeHtml(lesson.stamp.title)}“ gesammelt!</strong>
									<p style="margin: 0.35rem 0 0;">Du hast diese Station komplett erkundet. Ab jetzt übernimmt <strong>ZAM</strong> mit den passenden Lernkarten die Wiederholung und sorgt für Abwechslung bis zur Probe!</p>
								</div>
							`
							: ""
					}
				</section>

				<section class="section-card">
					<h2>📌 Wichtige Fachbegriffe dieser Station</h2>
					<div class="fact-grid">
						${lesson.probenWissen
							.map(
								(pw) => `
								<div class="fact-card">
									<h3>${escapeHtml(pw.term)}</h3>
									<p>${escapeHtml(pw.definition)}</p>
								</div>
							`,
							)
							.join("")}
					</div>
				</section>

				<div class="station-footer-nav no-print">
					<button type="button" class="btn" data-action="nav" data-view="map">← Zur Entdeckerkarte</button>
					<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
						${prevLesson ? `<button type="button" class="btn" data-action="open-lesson" data-lesson-id="${prevLesson.id}">← Station ${fmt(prevLesson.number)}</button>` : ""}
						${nextLesson ? `<button type="button" class="btn btn-primary" data-action="open-lesson" data-lesson-id="${nextLesson.id}">Weiter zu Station ${fmt(nextLesson.number)} →</button>` : ""}
					</div>
				</div>
			</article>
		`;
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
				labStates.clear();
				quizSelection.clear();
				taskFeedbackByKey.clear();
				taskCountedSuccess.clear();
				lottaMood = "curious";
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

		root.innerHTML = `
			<div class="app-shell">
				${renderTopbar()}
				${renderNotices()}
				<main id="main-content">${bodyHtml}</main>
			</div>
		`;
		if (view === "eltern") {
			wireResetDialog();
		}
	}

	function handleStampCelebration(unlocked: boolean, lesson: Lesson): void {
		if (!unlocked) return;
		lottaMood = "celebrating";
		lottaMessage = `Juhu! Du hast den Stempel „${lesson.stamp.title}“ verdient!`;
		playGentleChime(progress.soundEnabled);
	}

	const onClick = (event: Event): void => {
		const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
			"[data-action]",
		);
		if (!target) return;
		const action = target.dataset.action;

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
			const idx = Number(target.dataset.index);
			const lesson = LESSON_BY_ID.get(id);
			if (!lesson || Number.isNaN(idx)) return;
			quizSelection.set(id, idx);
			if (idx === lesson.quickCheck.correctIndex) {
				const res = recordQuizSolved(progress, id);
				progress = res.progress;
				persistProgress();
				handleStampCelebration(res.stampUnlocked, lesson);
			}
			render();
			return;
		}
		if (action === "lab-option") {
			const id = target.dataset.lessonId ?? activeLessonId;
			const key = target.dataset.key;
			const val = target.dataset.value;
			const lesson = LESSON_BY_ID.get(id);
			if (!lesson || !key || val === undefined) return;
			const nextState = applyLabOption(lesson, getLabState(lesson), key, val);
			labStates.set(id, nextState);
			const evaluated = evaluateLab(lesson, nextState);
			if (evaluated.reachedGoalIds.length > 0) {
				const res = recordLabGoals(progress, id, evaluated.reachedGoalIds);
				progress = res.progress;
				persistProgress();
				handleStampCelebration(res.stampUnlocked, lesson);
			}
			render();
			return;
		}
		if (action === "set-level") {
			const id = target.dataset.lessonId ?? activeLessonId;
			const lvl = target.dataset.level === "2" ? 2 : 1;
			activeLevelByLesson.set(id, lvl);
			render();
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
				lottaMood = "encouraging";
			}
			render();
			return;
		}
		if (action === "show-hint") {
			const taskId = target.dataset.taskId;
			if (taskId) {
				taskUsedHint.add(taskId);
				render();
			}
			return;
		}
		if (action === "next-task") {
			const id = target.dataset.lessonId ?? activeLessonId;
			const lvl = target.dataset.level === "2" ? 2 : 1;
			nextTask(id, lvl);
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
			lottaMood = "encouraging";
		}
		render();
	};

	const onInput = (event: Event): void => {
		const input = event.target as HTMLInputElement | null;
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

	const onHashChange = (): void => {
		syncFromHash();
		render();
	};

	root.addEventListener("click", onClick);
	root.addEventListener("submit", onSubmit);
	root.addEventListener("input", onInput);
	window.addEventListener("hashchange", onHashChange);

	syncFromHash();
	render();

	return {
		destroy() {
			root.removeEventListener("click", onClick);
			root.removeEventListener("submit", onSubmit);
			root.removeEventListener("input", onInput);
			window.removeEventListener("hashchange", onHashChange);
		},
	};
}

const appRoot = document.getElementById("app");
if (appRoot) {
	mountApp(appRoot);
}
