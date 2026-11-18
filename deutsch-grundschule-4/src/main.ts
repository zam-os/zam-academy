import "./styles.css";
import cell from "../cell.json";
import { companionHtml, type CompanionState, type Motion, reaction, type TintoEvent } from "./companion";
import { findLesson, LESSONS, quizOptions, SOURCES, STAGES } from "./curriculum";
import { checkAnswer, makeTask, markup } from "./exercises/tasks";
import { deskHtml } from "./desk";
import { isStep, learnHtml, learnNextHtml, learnPieces, type Step, stepperHtml } from "./flow";
import { esc } from "./format";
import { drop, finished, gameHtml, hint, newRound, type Round, type WordClass } from "./game";
import { calm, deviceCalm, flyFrom, glide, MOTION_KEY, positions, replay, scrollIntoViewGently, typewrite } from "./motion";
import {
	adoptStored,
	completion,
	isComplete,
	loadProgress,
	nextAttempt,
	type Progress,
	recordGoals,
	recordQuiz,
	recordSolved,
	resetProgress,
	STORAGE_KEY,
	saveProgress,
	starCount,
	stars,
} from "./storage/progress";
import { clearTexts, loadText, saveText, TEXTS_KEY } from "./storage/texts";
import { type Mood, morphTinto, tinto } from "./tinto";
import { PLACES, type TownState, tintoSpot, townHtml } from "./town";
import type {
	Level,
	MachineState,
	MachineWorkshop,
	ReadyLesson,
	SlotState,
	Stage,
	SlotWorkshop,
	Task,
	TrainState,
	TrainWorkshop,
} from "./types";
import {
	type AnyState,
	choosePen,
	initialState,
	isQuestion,
	isStatement,
	moveWagon,
	moveWagonTo,
	puzzleSolved,
	reachedGoals,
	setControl,
	setEnd,
	tapSlot,
	wagonToFront,
} from "./workshop/engine";
import { workshopHtml } from "./workshop/view";
import { parseDeepLink } from "./zam/zam-link";

type View = "path" | "lesson" | "stickers" | "heft" | "eltern" | "spiel";

function element<T extends Element = HTMLElement>(selector: string): T {
	const found = document.querySelector<T>(selector);
	if (!found) throw new Error(`Missing page element: ${selector}`);
	return found;
}
const main = element<HTMLElement>("#main");
const dialog = element<HTMLDialogElement>("#dialog");
const toast = element<HTMLElement>("#toast");

let progress: Progress = loadProgress();
let view: View = "path";
let lessonId = LESSONS[0].id;
let routeNotice = "";

/* Per-visit lesson state: the step, the shown pieces, the Werkstatt and the current task. */
let step: Step = 1;
let learnShown = 1;
let workshop: AnyState | null = null;
let openHelp: string[] = [];
/** The machine sentence before the last turn of a wheel; its changed words light up once. */
let previousDisplay: string | undefined;
interface TaskState {
	task: Task;
	level: Level;
	tries: number;
	revealed: boolean;
	solved: boolean;
	message: string;
	tone: "" | "success" | "hint";
}
let current: TaskState | null = null;
let taskLevel: Level = progress.level;

/* Tinto: what he looks like and says now. Nothing of it is stored. */
let companion: CompanionState = { mood: "happy", line: "", resting: false };
/** The place in town Tinto last greeted the child in. */
let lastStage = "";
const eventCounts: Partial<Record<TintoEvent, number>> = {};
let moodTimer = 0;
let companionVisible = true;
let observer: IntersectionObserver | null = null;

/* The Stadtplan: the place the child looks at. */
let district: Stage["id"] | null = null;

/* Tinto's game: the round, the word he holds up, and the lesson to go back to. */
let round: Round | null = null;
let picked: number | null = null;
let gameReturn: string | null = null;

const lesson = (): ReadyLesson => findLesson(lessonId) ?? LESSONS[0];
const stageOf = (l: ReadyLesson) => STAGES.find((s) => s.id === l.stage) ?? STAGES[0];

function persist(): void {
	const result = saveProgress(progress);
	progress = result.progress;
	element<HTMLElement>("#storage-warning").hidden = result.saved;
	stats();
}

function stats(): void {
	const c = completion(progress);
	element("#star-total").textContent = `⭐ ${c.stars} / ${c.total * 4}`;
}

let toastTimer = 0;
function say(message: string): void {
	toast.textContent = message;
	toast.hidden = false;
	window.clearTimeout(toastTimer);
	toastTimer = window.setTimeout(() => {
		toast.hidden = true;
	}, 3200);
}

function starRow(id: string): string {
	const s = stars(progress, id);
	const one = (on: boolean, label: string) =>
		`<span class="star${on ? " on" : ""}" title="${label}" aria-hidden="true">★</span>`;
	return `<span class="stars" aria-label="${starCount(s)} von 4 Sternen">${one(s.quiz, "Schnellcheck")}${one(s.workshop, "Werkstatt")}${one(s.level1, "Stufe 1")}${one(s.level2, "Stufe 2")}</span>`;
}

function bubble(text: string, mood: Mood = "happy"): string {
	return `<div class="tinto-says">${tinto(mood)}<p class="bubble">${esc(text)}</p></div>`;
}

/* ---------- Tinto ---------- */

/** Tinto reacts to something the child did; lines take turns. */
function react(event: TintoEvent): void {
	const n = eventCounts[event] ?? 0;
	eventCounts[event] = n + 1;
	const r = reaction(event, n);
	showTinto(r.mood, r.line, r.motion, r.important);
}

function showTinto(mood: Mood, line: string, motion: Motion = "", important = false): void {
	window.clearTimeout(moodTimer);
	const resting = mood === "sleep";
	companion = { mood, line, resting };
	const button = main.querySelector<HTMLElement>(".tinto-button");
	const svg = button?.querySelector<SVGSVGElement>("svg.tinto");
	if (button && svg) {
		morphTinto(svg, mood);
		button.dataset.action = resting ? "wake" : "wave";
		button.setAttribute("aria-label", resting ? "Tinto wecken" : "Tinto zuwinken");
		if (motion) replay(svg, `do-${motion}`);
	}
	main.querySelector(".scene")?.classList.toggle("resting", resting);
	const rest = main.querySelector<HTMLElement>("#tinto-rest");
	if (rest) {
		rest.dataset.action = resting ? "wake" : "rest";
		rest.textContent = resting ? "☀️ Tinto wecken" : "💤 Pause";
	}
	const message = main.querySelector<HTMLElement>("#tinto-message");
	if (message) {
		message.textContent = line;
		replay(message, "fresh");
	}
	// On a small screen the panel may be scrolled away; important news still reaches the child.
	if (!message || (important && !companionVisible)) say(line);
	// Joy and encouragement fade back into Tinto's calm face.
	if (mood === "cheer" || mood === "encourage")
		moodTimer = window.setTimeout(() => {
			companion = { ...companion, mood: "happy" };
			const now = main.querySelector<SVGSVGElement>(".tinto-button svg.tinto");
			if (now) morphTinto(now, "happy");
		}, 4500);
}

function observeCompanion(): void {
	observer?.disconnect();
	companionVisible = true;
	const panel = main.querySelector("#companion");
	if (!panel || typeof IntersectionObserver === "undefined") return;
	observer = new IntersectionObserver(
		([entry]) => {
			companionVisible = entry.intersectionRatio > 0.4;
		},
		{ threshold: [0, 0.4, 1] },
	);
	observer.observe(panel);
}

/* ---------- navigation ---------- */

function setHash(): void {
	const hash =
		view === "lesson"
			? `#lesson=${lessonId}`
			: view === "path"
				? ""
				: `#view=${view}`;
	history.replaceState(null, "", `${location.pathname}${location.search}${hash}`);
}

/** Enter a lesson. A new lesson starts at "Verstehen"; a level link goes straight to the tasks. */
function openLesson(id: string, level?: Level): void {
	const l = findLesson(id);
	if (!l) return;
	if (id !== lessonId || view !== "lesson") {
		workshop = null;
		current = null;
		openHelp = [];
		previousDisplay = undefined;
		step = 1;
		// A lesson already begun shows its whole explanation at once.
		learnShown = starCount(stars(progress, id)) > 0 ? learnPieces(l).length : 1;
		companion = {
			mood: "happy",
			line: l.stage !== lastStage ? stageOf(l).greeting : reaction("learn").line,
			resting: false,
		};
		lastStage = l.stage;
	}
	lessonId = id;
	view = "lesson";
	if (level) {
		taskLevel = level;
		step = 4;
	}
}

function navigate(target?: string): void {
	routeNotice = "";
	if (target && findLesson(target)) openLesson(target);
	else {
		if (target === "spiel") {
			gameReturn = view === "lesson" ? lessonId : view === "spiel" ? gameReturn : null;
			if (view !== "spiel") {
				round = null;
				picked = null;
				companion = { ...companion, mood: "happy", line: reaction("game-start").line };
			}
		}
		if (target === "stickers" || target === "heft" || target === "eltern" || target === "spiel") view = target;
		else view = "path";
		lastStage = "";
	}
	setHash();
	render();
	main.focus();
	window.scrollTo({ top: 0, behavior: "instant" });
}

function render(): void {
	document.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((b) => {
		const active = b.dataset.view === view || (view === "lesson" && b.dataset.view === "path");
		if (active) b.setAttribute("aria-current", "page");
		else b.removeAttribute("aria-current");
	});
	const l = lesson();
	document.body.dataset.stage = view === "lesson" ? l.stage : "";
	main.dataset.view = view;
	observer?.disconnect();
	companionVisible = true;
	if (view === "lesson") renderLesson(l);
	else if (view === "stickers") renderStickers();
	else if (view === "heft") renderHeft();
	else if (view === "eltern") renderParents();
	else if (view === "spiel") renderGame();
	else renderPath();
	stats();
}

/* ---------- Stadtplan ---------- */

function townState(): TownState {
	return {
		districts: STAGES.map((stage) => {
			const lessons = LESSONS.filter((l) => l.stage === stage.id);
			return { id: stage.id, done: lessons.filter((l) => isComplete(progress, l.id)).length, total: lessons.length };
		}),
		lanterns: LESSONS.map((l) => isComplete(progress, l.id)),
	};
}

/** The stations of one place in town. */
function districtHtml(id: Stage["id"]): string {
	const stage = STAGES.find((s) => s.id === id) ?? STAGES[0];
	const lessons = LESSONS.filter((l) => l.stage === stage.id);
	const done = lessons.filter((l) => isComplete(progress, l.id)).length;
	return `<section class="district" data-stage="${stage.id}" aria-live="polite">
<header><span class="district-icon" aria-hidden="true">${stage.icon}</span><div><h2>${esc(stage.title)}</h2><p>${esc(stage.subtitle)}</p></div><span class="district-count">${done} / ${lessons.length} 🏅</span></header>
<ol class="road">${lessons
		.map(
			(l, i) =>
				`<li><button type="button" class="station${isComplete(progress, l.id) ? " complete" : ""}" data-action="open" data-lesson="${l.id}"><span class="station-badge" aria-hidden="true">${isComplete(progress, l.id) ? l.sticker.emoji : i + 1}</span><span class="station-name">${esc(l.title)}</span>${starRow(l.id)}</button></li>`,
		)
		.join("")}</ol></section>`;
}

/** Choose a place on the map: Tinto walks there and greets, its stations appear below. */
function chooseDistrict(id: Stage["id"]): void {
	const stage = STAGES.find((s) => s.id === id);
	if (!stage) return;
	district = id;
	main.querySelectorAll<HTMLElement>("[data-action=district]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.stage === id)));
	const walker = main.querySelector<HTMLElement>("#town-tinto");
	if (walker) {
		walker.setAttribute("style", tintoSpot(PLACES[id]));
		replay(walker, "walking");
	}
	const box = element("#district");
	box.innerHTML = districtHtml(id);
	replay(box.firstElementChild, "enter");
	showTinto("happy", stage.greeting, "wave");
}

function renderPath(): void {
	const c = completion(progress);
	const next = LESSONS.find((l) => !isComplete(progress, l.id));
	const place = district ?? (next ?? LESSONS[0]).stage;
	district = place;
	const hello = c.stars
		? `Schön, dass du wieder da bist! Du hast schon ${c.stars} Sterne gesammelt.`
		: "Hallo, ich bin Tinto! Ich schreibe mit acht Armen. Komm mit durch meine Wörterstadt!";
	main.innerHTML = `${routeNotice ? `<p class="notice" role="status">${esc(routeNotice)}</p>` : ""}
<section class="hero">
	<div class="tinto-says hero-tinto"><button type="button" class="tinto-button" data-action="wave" aria-label="Tinto zuwinken">${tinto(c.stars ? "cheer" : "happy")}</button><p class="bubble" id="tinto-message" aria-live="polite">${esc(hello)}</p></div>
	<div class="hero-text">
		<p class="eyebrow">Deutsch · 4. Klasse · Bayern</p>
		<h1>Tintos Wörterstadt</h1>
		<p>Baue Wörter, rangiere Satzzüge und löse Rechtschreib-Fälle. Für jede Lektion gibt es vier Sterne und einen Sticker.</p>
		<button type="button" class="button big" data-action="open" data-lesson="${(next ?? LESSONS[0]).id}">${c.stars ? "Weiter geht's" : "Los geht's"} → ${esc((next ?? LESSONS[0]).title)}</button>
	</div>
</section>
<section class="town" aria-labelledby="town-title">
	<h2 id="town-title">Wohin möchtest du?</h2>
	${townHtml(townState(), STAGES, place, tinto("happy", "Tinto"))}
	<p class="small town-legend">Für jeden Sticker leuchtet eine Laterne. Hast du einen Ort geschafft, weht dort eine Fahne, und der Brunnen sprudelt.</p>
</section>
<div id="district">${districtHtml(place)}</div>
<aside class="notice">Tinto sammelt keine Daten. Deine Sterne und Texte bleiben nur in diesem Browser. Eltern finden Hinweise unter <button type="button" class="text-button" data-action="view" data-target="eltern">Für Eltern</button>.</aside>`;
	companion = { mood: c.stars ? "cheer" : "happy", line: hello, resting: false };
}

/* ---------- Lektion ---------- */

function renderLesson(l: ReadyLesson): void {
	const stage = stageOf(l);
	const index = LESSONS.indexOf(l);
	const s = stars(progress, l.id);
	const hide = (n: Step) => (n === step ? "" : " hidden");
	main.innerHTML = `<div class="lesson-top"><button type="button" class="text-button" data-action="view" data-target="path">← Zur Wörterstadt</button>${starRow(l.id)}</div>
<div class="lesson-layout">
${companionHtml(companion)}
<div class="lesson-main">
<header class="lesson-head">
	<p class="eyebrow">${stage.icon} ${esc(stage.title)} · Lektion ${index + 1} von ${LESSONS.length}</p>
	<h1>${esc(l.title)}</h1>
	<p class="skill"><span aria-hidden="true">🎯</span> ${esc(l.skill)}</p>
	<p class="small lehrplan">${esc(l.lehrplan)}</p>
</header>
<nav class="stepper" id="stepper" aria-label="Schritte dieser Lektion">${stepperHtml(l, step, s)}</nav>
<section class="card learn" data-panel="1"${hide(1)}>
	<h2 tabindex="-1"><span class="step">1</span> Verstehen</h2>
	${learnHtml(l, learnShown)}
	<div class="step-next" id="learn-next">${learnNextHtml(learnShown, learnPieces(l).length)}</div>
</section>
<section class="card" id="quiz-card" data-panel="2"${hide(2)}>
	<h2 tabindex="-1"><span class="step">2</span> Schnellcheck <span class="star${s.quiz ? " on" : ""}" id="quiz-star" aria-label="${s.quiz ? "Stern verdient" : "Stern offen"}">★</span></h2>
	<p class="question">${esc(l.quiz.question)}</p>
	<div class="choices">${quizOptions(l)
		.map((o) => `<button type="button" class="choice" data-action="quiz" data-value="${esc(o)}">${esc(o)}</button>`)
		.join("")}</div>
	<div id="quiz-feedback" role="status"></div>
	<div class="step-next"><button type="button" class="button${s.quiz ? "" : " secondary"}" id="next-2" data-action="step" data-step="3">Weiter: Werkstatt →</button></div>
</section>
<section class="card" id="workshop-card" data-panel="3"${hide(3)}>
	<h2 tabindex="-1"><span class="step">3</span> ${esc(l.workshop.title)} <span class="star${s.workshop ? " on" : ""}" id="workshop-star">★</span></h2>
	<p class="mission"><span aria-hidden="true">📜</span> ${esc(l.workshop.intro)}</p>
	<ul class="goals" id="goals"></ul>
	<div id="workshop-area" class="workshop"></div>
	<div class="step-next"><button type="button" class="text-button" data-action="workshop-reset">↺ Werkstatt neu starten</button><button type="button" class="button${s.workshop ? "" : " secondary"}" id="next-3" data-action="step" data-step="4">Weiter: Üben →</button></div>
</section>
<section class="card" id="practice-card" data-panel="4"${hide(4)}>
	<h2 tabindex="-1"><span class="step">4</span> Üben</h2>
	<div class="level-tabs" role="tablist" aria-label="Stufe">
		<button type="button" role="tab" data-action="level" data-level="1" aria-selected="${taskLevel === 1}">🌱 Stufe 1 · Mit Tipp ${s.level1 ? "★" : ""}</button>
		<button type="button" role="tab" data-action="level" data-level="2" aria-selected="${taskLevel === 2}">🏅 Stufe 2 · Probe-Training ${s.level2 ? "★" : ""}</button>
	</div>
	<div id="practice-area"></div>
	${l.desk ? '<div class="step-next"><button type="button" class="button secondary" data-action="step" data-step="5">Weiter: Schreibtisch →</button></div>' : ""}
</section>
${l.desk ? `<div data-panel="5"${hide(5)}>${deskHtml(l.id, l.desk, loadText(l.id))}</div>` : ""}
<nav class="lesson-nav" aria-label="Lektionen">
	<button type="button" class="button secondary" data-action="open" data-lesson="${LESSONS[index - 1]?.id ?? ""}" ${index === 0 ? "disabled" : ""}>← Vorige Lektion</button>
	<button type="button" class="button" data-action="open" data-lesson="${LESSONS[index + 1]?.id ?? ""}" ${index === LESSONS.length - 1 ? "disabled" : ""}>Nächste Lektion →</button>
</nav>
</div>
</div>`;
	if (!workshop) workshop = initialState(l.workshop);
	renderWorkshop();
	renderPractice();
	observeCompanion();
}

/** Show one step of the lesson; the others stay in the page, hidden. */
function goStep(n: number): void {
	const l = lesson();
	if (!isStep(l, n)) return;
	step = n;
	main.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
		panel.hidden = Number(panel.dataset.panel) !== n;
	});
	const stepper = element("#stepper");
	stepper.innerHTML = stepperHtml(l, n, stars(progress, l.id));
	const panel = main.querySelector<HTMLElement>(`[data-panel="${n}"]`);
	replay(panel, "enter");
	const heading = panel?.querySelector<HTMLElement>("h2");
	if (heading) {
		heading.tabIndex = -1;
		heading.focus({ preventScroll: true });
	}
	const top = stepper.getBoundingClientRect().top;
	if (top < 80 || top > window.innerHeight - 120)
		stepper.scrollIntoView({ behavior: calm() ? "auto" : "smooth", block: "start" });
	const events: Record<Step, TintoEvent> = { 1: "learn", 2: "step-quiz", 3: "step-workshop", 4: "step-practice", 5: "step-desk" };
	react(events[n]);
}

/** Show the explanation up to piece `count`. One new piece gets Tinto's comment. */
function showPieces(count: number): void {
	const l = lesson();
	const pieces = learnPieces(l);
	const before = learnShown;
	learnShown = Math.min(pieces.length, Math.max(learnShown, count));
	if (learnShown === before) return;
	const one = learnShown - before === 1;
	main.querySelectorAll<HTMLElement>(".piece").forEach((el) => {
		if (Number(el.dataset.piece) < learnShown && el.hidden) {
			el.hidden = false;
			if (one) replay(el, "fresh");
		}
	});
	const next = element("#learn-next");
	const hadFocus = next.contains(document.activeElement);
	if (learnShown < pieces.length) {
		// Keep the button (and its focus); only the counter changes.
		const counter = next.querySelector(".piece-count");
		if (counter) counter.textContent = `${learnShown} / ${pieces.length}`;
	} else {
		next.innerHTML = learnNextHtml(learnShown, pieces.length);
		if (hadFocus) next.querySelector<HTMLElement>("button")?.focus();
	}
	if (!one) {
		react("learn-done");
		return;
	}
	const piece = pieces[learnShown - 1];
	const shown = main.querySelector<HTMLElement>(`.piece[data-piece="${learnShown - 1}"]`);
	if (piece.kind === "merke") {
		const ink = shown?.querySelector<HTMLElement>(".ink");
		if (ink) typewrite(ink, l.takeaway);
		react("merke");
	} else if (piece.kind === "example") react("example");
	else if (piece.kind === "terms") react("terms");
	scrollIntoViewGently(next);
}

function refreshStars(earned?: Step): void {
	const l = lesson();
	const s = stars(progress, l.id);
	main.querySelector(".lesson-top .stars")?.replaceWith(document.createRange().createContextualFragment(starRow(l.id)));
	const stepper = main.querySelector("#stepper");
	if (stepper) stepper.innerHTML = stepperHtml(l, step, s);
	const quizStar = main.querySelector("#quiz-star");
	quizStar?.classList.toggle("on", s.quiz);
	quizStar?.setAttribute("aria-label", s.quiz ? "Stern verdient" : "Stern offen");
	main.querySelector("#workshop-star")?.classList.toggle("on", s.workshop);
	main.querySelector("#next-2")?.classList.toggle("secondary", !s.quiz);
	main.querySelector("#next-3")?.classList.toggle("secondary", !s.workshop);
	if (earned) replay(main.querySelector(`#stepper [data-step="${earned}"]`), "pop");
}

const trainOk = (): boolean => {
	const ws = lesson().workshop;
	return ws.kind === "train" && !!workshop && (isStatement(ws, workshop as TrainState) || isQuestion(ws, workshop as TrainState));
};

/**
 * Draw the Werkstatt. `changed` names the element the child just changed (it
 * pops), `fresh` the goals just reached, `solved` a puzzle just finished.
 */
function renderWorkshop(changed?: string, fresh: string[] = [], solved?: string): void {
	const l = lesson();
	if (!workshop) return;
	const reached = new Set(progress.goals[l.id] ?? []);
	const live = new Set(reachedGoals(l.workshop, workshop));
	element("#goals").innerHTML = l.workshop.goals
		.map(
			(g) =>
				`<li class="${reached.has(g.id) ? "done" : ""}${live.has(g.id) ? " live" : ""}${fresh.includes(g.id) && !calm() ? " just-done" : ""}"><span aria-hidden="true">${reached.has(g.id) ? "✅" : "🎯"}</span> ${esc(g.label)}</li>`,
		)
		.join("");
	const area = element("#workshop-area");
	// Wagons glide from where they stood to their new places.
	const before = positions(area, "[data-wagon]", "wagon");
	area.innerHTML = workshopHtml(l.workshop, workshop, openHelp, previousDisplay);
	previousDisplay = undefined;
	glide(area, "[data-wagon]", "wagon", before);
	if (changed) replay(area.querySelector(changed), "pop");
	if (solved) replay(area.querySelector(`[data-puzzle-box="${CSS.escape(solved)}"]`), "just-solved");
	element("#workshop-star").classList.toggle("on", stars(progress, l.id).workshop);
}

function afterWorkshopChange(changed?: string, solved?: string): void {
	const l = lesson();
	if (!workshop) return;
	const before = stars(progress, l.id).workshop;
	const fresh = recordGoals(progress, l.id, reachedGoals(l.workshop, workshop));
	renderWorkshop(changed, fresh, solved);
	if (!fresh.length) {
		// A puzzle solved once more still makes Tinto happy, without a new goal.
		if (solved) react("task-right");
		return;
	}
	persist();
	const star = stars(progress, l.id).workshop && !before;
	react(star ? "workshop-star" : "goal");
	if (star) refreshStars(3);
	celebrateIfDone();
}

/** Move a wagon and let the locomotive toot when the train becomes a right sentence. */
function changeTrain(change: (ws: TrainWorkshop, state: TrainState) => TrainState): void {
	const ws = lesson().workshop;
	if (ws.kind !== "train" || !workshop) return;
	const wasOk = trainOk();
	workshop = change(ws, workshop as TrainState);
	afterWorkshopChange();
	if (!wasOk && trainOk()) replay(main.querySelector(".loco"), "toot");
}

function newTask(level: Level): void {
	const l = lesson();
	const attempt = nextAttempt(progress, l.id, level);
	persist();
	current = {
		task: makeTask(l.id, l.generators, level, attempt, current?.task.key),
		level,
		tries: 0,
		revealed: false,
		solved: false,
		message: "",
		tone: "",
	};
}

function renderPractice(): void {
	const l = lesson();
	if (!current || current.level !== taskLevel) newTask(taskLevel);
	const c = current as TaskState;
	const t = c.task;
	const solved = progress.solved[l.id]?.[taskLevel] ?? 0;
	const need = l.requiredCorrect;
	const dots = Array.from({ length: need }, (_, i) => `<span class="dot${i < solved ? " on" : ""}"></span>`).join("");
	const showHint = taskLevel === 1 || c.tries > 0;
	const finished = c.solved || c.revealed;
	const input =
		t.kind === "choice"
			? `<div class="choices">${(t.options ?? [])
					.map(
						(o) =>
							`<button type="button" class="choice${finished && t.accept.includes(o) ? " right" : ""}" data-action="answer" data-value="${esc(o)}" ${finished ? "disabled" : ""}>${esc(o)}</button>`,
					)
					.join("")}</div>`
			: `<form class="answer-form" data-action="text-answer"><label for="answer" class="small">Deine Antwort</label><div class="answer-row"><input id="answer" name="answer" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" ${finished ? "disabled" : ""}><button type="submit" class="button" ${finished ? "disabled" : ""}>Prüfen</button></div></form>`;
	element("#practice-area").innerHTML = `<p class="progress-dots" aria-label="${Math.min(solved, need)} von ${need} gelöst">${dots}<span>${Math.min(solved, need)} von ${need} gelöst${solved > need ? ` · +${solved - need} Extra` : ""}</span></p>
<div class="task">
	${t.passage ? `<article class="passage"><h3>${esc(t.passage.title)}</h3>${t.passage.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</article>` : ""}
	${t.table ? `<div class="reading-table"><table><caption>${esc(t.table.title)}</caption><thead><tr>${t.table.head.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${t.table.rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${esc(c)}</th>` : `<td${/^■+$/.test(c) ? ' aria-hidden="true"' : ""}>${esc(c)}</td>`)).join("")}</tr>`).join("")}</tbody></table></div>` : ""}
	<p class="question">${esc(t.prompt)}</p>
	${t.material ? `<p class="material">${markup(t.material, esc)}</p>` : ""}
	${showHint && !finished ? `<p class="hint">💡 ${esc(t.hint)}</p>` : ""}
	${input}
	<div role="status" class="feedback ${c.tone}">${c.message}</div>
	<div class="task-actions">
		${!finished && c.tries >= 2 ? '<button type="button" class="text-button" data-action="reveal">Lösung zeigen</button>' : ""}
		${finished ? '<button type="button" class="button" data-action="next-task">Nächste Aufgabe →</button>' : ""}
	</div>
</div>`;
}

function answer(value: string): void {
	const l = lesson();
	if (!current || current.solved || current.revealed) return;
	const result = checkAnswer(current.task, value);
	let filled = 0;
	if (result.correct) {
		current.solved = true;
		const n = recordSolved(progress, l.id, current.level);
		persist();
		filled = Math.min(n, l.requiredCorrect);
		current.tone = "success";
		current.message = `<strong>Richtig!</strong> ${esc(current.task.explanation.replace(/^Richtig: /, "So heißt es: "))}`;
		if (n === l.requiredCorrect) {
			react(current.level === 1 ? "level1-star" : "level2-star");
			refreshStars(4);
		} else react("task-right");
		celebrateIfDone();
		// The star in the tab label may have changed.
		const tabs = main.querySelectorAll<HTMLButtonElement>("[data-action=level]");
		const s = stars(progress, l.id);
		tabs[0].textContent = `🌱 Stufe 1 · Mit Tipp ${s.level1 ? "★" : ""}`;
		tabs[1].textContent = `🏅 Stufe 2 · Probe-Training ${s.level2 ? "★" : ""}`;
	} else {
		current.tries += 1;
		current.tone = "hint";
		current.message = result.hint
			? `Noch nicht. ${esc(result.hint)}`
			: current.tries === 1
				? "Noch nicht ganz. Lies den Tipp und probiere es noch einmal."
				: "Fast! Schau dir die Aufgabe noch einmal genau an.";
		react("task-wrong");
	}
	renderPractice();
	const area = element("#practice-area");
	if (result.correct) {
		replay(area.querySelector(`.dot:nth-child(${filled})`), "pop");
		replay(area.querySelector(".feedback"), "pop");
	} else
		replay(
			current.task.kind === "text" ? area.querySelector(".answer-row") : area.querySelector(`[data-action=answer][data-value="${CSS.escape(value)}"]`),
			"wobble",
		);
	if (current.task.kind === "text" && !current.solved)
		main.querySelector<HTMLInputElement>("#answer")?.focus();
	else main.querySelector<HTMLElement>("[data-action=next-task]")?.focus();
}

function celebrateIfDone(): void {
	const l = lesson();
	if (!isComplete(progress, l.id) || progress.celebrated.includes(l.id)) return;
	progress.celebrated.push(l.id);
	persist();
	react("sticker");
	const next = LESSONS[LESSONS.indexOf(l) + 1];
	const confetti = Array.from({ length: 14 }, (_, i) => `<i style="--i:${i}"></i>`).join("");
	showDialog(
		"Sticker verdient!",
		`<div class="celebrate"><div class="confetti" aria-hidden="true">${confetti}</div>${tinto("cheer")}<div class="sticker big" aria-hidden="true">${l.sticker.emoji}</div><p><strong>${esc(l.sticker.name)}</strong> klebt jetzt in deinem Stickerheft.</p><p>Alle vier Sterne in „${esc(l.title)}“. Super gemacht!</p></div>
<div class="dialog-actions"><button type="button" class="button secondary" data-dialog="stickers">Stickerheft ansehen</button>${next ? `<button type="button" class="button" data-dialog="next">Weiter: ${esc(next.title)}</button>` : ""}</div>`,
	);
	dialog.querySelector("[data-dialog=stickers]")?.addEventListener("click", () => {
		dialog.close();
		navigate("stickers");
	});
	dialog.querySelector("[data-dialog=next]")?.addEventListener("click", () => {
		dialog.close();
		navigate(next?.id);
	});
}

/* ---------- Tintos Spiel ---------- */

function renderGame(): void {
	if (!round) round = newRound(Math.random);
	const back = gameReturn ? findLesson(gameReturn) : undefined;
	main.innerHTML = `<div class="page-head">${
		back
			? `<button type="button" class="text-button" data-action="open" data-lesson="${back.id}">← Zurück zu „${esc(back.title)}“</button>`
			: '<button type="button" class="text-button" data-action="view" data-target="path">← Zur Wörterstadt</button>'
	}</div>${gameHtml(round, picked, tinto(companion.mood), companion.line || reaction("game-start").line)}`;
}

function pickCard(index: number): void {
	if (!round || round.cards[index]?.placed) return;
	picked = picked === index ? null : index;
	renderGame();
	main.querySelector<HTMLElement>(`[data-card="${index}"]`)?.focus();
	if (picked !== null) showTinto("think", `Wohin gehört „${round.cards[index].word}“? Tippe auf einen Korb.`);
}

function dropCard(basket: WordClass): void {
	if (!round || picked === null) return;
	const index = picked;
	const card = round.cards[index];
	const from = main.querySelector(`[data-card="${index}"]`)?.getBoundingClientRect();
	const result = drop(round, index, basket);
	round = result.round;
	if (result.right) {
		picked = null;
		renderGame();
		// The word flies from Tinto's arm into the basket.
		const chips = main.querySelectorAll(`[data-basket="${basket}"] .basket-word`);
		if (from) flyFrom(from, chips[chips.length - 1]);
		replay(main.querySelector(`[data-basket="${basket}"]`), "catch");
		if (finished(round)) {
			react("game-done");
			main.querySelector<HTMLElement>("[data-action=game-new]")?.focus();
		} else {
			react("game-right");
			main.querySelector<HTMLElement>("[data-action=game-card]")?.focus();
		}
	} else {
		renderGame();
		replay(main.querySelector(`[data-basket="${basket}"]`), "wobble");
		showTinto("encourage", hint(card, basket), "scratch");
		main.querySelector<HTMLElement>(`[data-card="${index}"]`)?.focus();
	}
}

/* ---------- Stickerheft, Merkheft, Eltern ---------- */

function renderStickers(): void {
	const c = completion(progress);
	main.innerHTML = `<div class="page-head"><button type="button" class="text-button" data-action="view" data-target="path">← Zur Wörterstadt</button><h1>Tintos Stickerheft</h1>${bubble(c.completed ? `Schon ${c.completed} Sticker! Jeder steht für eine Lektion mit allen vier Sternen.` : "Hier sammelst du Sticker. Du bekommst einen, wenn du in einer Lektion alle vier Sterne hast.", c.completed ? "cheer" : "happy")}</div>
<div class="album">${STAGES.map(
		(stage) => `<section class="album-page" data-stage="${stage.id}"><h2>${stage.icon} ${esc(stage.title)}</h2><ul class="sticker-grid">${LESSONS.filter((l) => l.stage === stage.id)
			.map((l) => {
				const done = isComplete(progress, l.id);
				return `<li><button type="button" class="sticker-slot${done ? " earned" : ""}" data-action="open" data-lesson="${l.id}"><span class="sticker" aria-hidden="true">${done ? l.sticker.emoji : "?"}</span><span class="sticker-name">${done ? esc(l.sticker.name) : esc(l.title)}</span>${starRow(l.id)}</button></li>`;
			})
			.join("")}</ul></section>`,
	).join("")}</div>`;
}

function renderHeft(): void {
	main.innerHTML = `<div class="page-head"><button type="button" class="text-button" data-action="view" data-target="path">← Zur Wörterstadt</button><h1>Tintos Merkheft</h1>${bubble("Alles Wichtige auf einen Blick. Gut zum Wiederholen vor einer Probe!", "happy")}</div>
<section class="card tables">
	<h2>Die vier Fälle</h2>
	<table><thead><tr><th>Fall</th><th>Frage</th><th>männlich</th><th>weiblich</th><th>sächlich</th></tr></thead><tbody>
	<tr><th>1. Fall (Nominativ)</th><td>Wer oder was?</td><td>der Hund</td><td>die Katze</td><td>das Pferd</td></tr>
	<tr><th>2. Fall (Genitiv)</th><td>Wessen?</td><td>des Hundes</td><td>der Katze</td><td>des Pferdes</td></tr>
	<tr><th>3. Fall (Dativ)</th><td>Wem?</td><td>dem Hund</td><td>der Katze</td><td>dem Pferd</td></tr>
	<tr><th>4. Fall (Akkusativ)</th><td>Wen oder was?</td><td>den Hund</td><td>die Katze</td><td>das Pferd</td></tr>
	</tbody></table>
	<h2>Zeitformen</h2>
	<table><thead><tr><th>Zeitform</th><th>Beispiel</th><th>So bildest du sie</th></tr></thead><tbody>
	<tr><th>Präsens (Gegenwart)</th><td>ich laufe</td><td>Personalform</td></tr>
	<tr><th>Präteritum (1. Vergangenheit)</th><td>ich lief</td><td>ein Wort, oft mit neuem Stamm oder -te</td></tr>
	<tr><th>Perfekt (2. Vergangenheit)</th><td>ich bin gelaufen</td><td>haben/sein + ge-Form</td></tr>
	<tr><th>Futur (Zukunft)</th><td>ich werde laufen</td><td>werden + Grundform</td></tr>
	</tbody></table>
	<h2>Satzglieder und ihre Fragen</h2>
	<table><tbody>
	<tr><th>Prädikat</th><td>Was tut …? Was geschieht?</td></tr>
	<tr><th>Subjekt</th><td>Wer oder was?</td></tr>
	<tr><th>Dativobjekt</th><td>Wem?</td></tr>
	<tr><th>Akkusativobjekt</th><td>Wen oder was?</td></tr>
	<tr><th>Ortsangabe</th><td>Wo? Wohin? Woher?</td></tr>
	<tr><th>Zeitangabe</th><td>Wann? Seit wann? Wie lange?</td></tr>
	</tbody></table>
	<h2>Tintos Detektiv-Tricks</h2>
	<table><tbody>
	<tr><th>Schwingen</th><td>Silben sprechen: Scho-ko-la-de</td></tr>
	<tr><th>Kurz oder lang?</th><td>kurz: Mutter, Zucker, Katze · lang: Biene, Straße</td></tr>
	<tr><th>Verlängern</th><td>Hund → Hunde · er lebt → leben</td></tr>
	<tr><th>Ableiten</th><td>Hände ← Hand · Bäume ← Baum</td></tr>
	<tr><th>Nomen-Proben</th><td>der/die/das · der rote Ball · -ung, -heit, -keit</td></tr>
	<tr><th>Merken</th><td>Zahn, Boot, Kino: Merkwörter, Wörterbuch hilft</td></tr>
	</tbody></table>
</section>
${STAGES.map(
		(stage) => `<section class="card" data-stage="${stage.id}"><h2>${stage.icon} ${esc(stage.title)}</h2>${LESSONS.filter((l) => l.stage === stage.id)
			.map(
				(l) =>
					`<div class="heft-entry"><h3><button type="button" class="text-button" data-action="open" data-lesson="${l.id}">${esc(l.title)}</button></h3><p>${esc(l.takeaway)}</p><dl class="terms">${l.terms.map((t) => `<div><dt>${esc(t.term)}</dt><dd>${esc(t.meaning)}</dd></div>`).join("")}</dl></div>`,
			)
			.join("")}</section>`,
	).join("")}`;
}

function renderParents(): void {
	const c = completion(progress);
	const cards = cell.atoms.reduce((n, a) => n + a.practice_items.length, 0);
	main.innerHTML = `<div class="page-head"><button type="button" class="text-button" data-action="view" data-target="path">← Zur Wörterstadt</button><h1>Für Eltern</h1></div>
<section class="card">
	<h2>Was Ihr Kind hier übt</h2>
	<p>Tintos Wörterstadt übt ${LESSONS.length} Themen aus dem LehrplanPLUS Deutsch der Jahrgangsstufen 3 und 4 in Bayern: Sprache untersuchen (Wortarten, die vier Fälle, Zeitformen, Wortbildung, Satzarten, wörtliche Rede, Satzglieder, Bindewörter) und Richtig schreiben (Silben, kurze und lange Selbstlaute, Verlängern, Ableiten, Großschreibung, Wörterbuch, verbindlicher Grundwortschatz) sowie Lesen (Textarten, Lesestrategien, Sachtexte und Tabellen, Geschichten, Figuren, Sprachbilder, Gedichte, Medien).</p>
	<p>Jede Lektion hat eine kurze Erklärung, einen Schnellcheck, eine Werkstatt zum Ausprobieren und Aufgaben auf zwei Stufen. Stufe 1 gibt einen Tipp. Stufe 2 übt ohne Tipp, ähnlich wie in einer Probe.</p>
	<p>Im Hafen der Wörterstadt wartet Tintos Spiel „Acht Arme, acht Wörter“: Ihr Kind sortiert Wörter aus dem Grundwortschatz nach Nomen, Verben und Adjektiven. Das Spiel ist freiwillig, zählt für keinen Stern und speichert nichts. Mit dem Schalter „Ruhig“ (Schildkröte) lassen sich alle Bewegungen abschalten.</p>
</section>
<section class="card">
	<h2>Stand in diesem Browser</h2>
	<ul class="parent-list">${LESSONS.map((l) => {
		const s = stars(progress, l.id);
		const solved = progress.solved[l.id] ?? { 1: 0, 2: 0 };
		return `<li><span>${esc(l.title)}</span><span class="small">${s.quiz ? "Schnellcheck ✓" : "Schnellcheck offen"} · Werkstatt ${(progress.goals[l.id] ?? []).length}/3 · Stufe 1: ${solved[1]} · Stufe 2: ${solved[2]}</span></li>`;
	}).join("")}</ul>
	<p class="small">Gelöste Aufgaben zählen auch, wenn Ihr Kind nach einem Tipp richtig geantwortet hat. Die Sterne zeigen geübte Schritte, keine Note und keine Eignung für eine Schulart. ${c.completed} von ${c.total} Lektionen haben alle vier Sterne.</p>
</section>
<section class="card">
	<h2>Übertritt und was die App nicht abdeckt</h2>
	<p>Für den Übertritt zählen in Bayern Deutsch, Mathematik und Heimat- und Sachunterricht zusammen. Diese App übt einen Teil von Deutsch. Die Schreibwerkstatt übt Teilschritte des Schreibens, und am Schreibtisch kann Ihr Kind frei schreiben. Die App liest und bewertet diese Texte nicht; dafür braucht es Sie oder die Lehrkraft. Sprechen und Zuhören sind nicht enthalten, und auch das Sprachlabor ersetzt keine echten Gespräche. Lautes Lesen, Lesetempo, Gespräche über Bücher und die Bibliothek brauchen echte Praxis; die Lesewerkstatt übt das Verstehen. Den Grundwortschatz übt Ihr Kind hier am Bildschirm; die Wörter auch mit der Hand zu schreiben, bleibt wichtig. Das gilt ebenso für echte Bücher, Vorlesen und Gespräche.</p>
	<p>Eine Grundschullehrkraft hat die Inhalte noch nicht fachlich freigegeben, deshalb beginnt die Versionsnummer mit 0. Lehrvideos fehlen noch.</p>
	<ul class="source-list">${SOURCES.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`).join("")}<li><a href="https://www.km.bayern.de/lernen/ubertritt-und-bildungswege/uebertritt" target="_blank" rel="noopener noreferrer">Bayerisches Kultusministerium · Übertritt</a></li></ul>
	<p class="small">Links öffnen erst auf Ihren Klick.</p>
</section>
<section class="card">
	<h2>Mit ZAM wiederholen</h2>
	<p>Zu jeder Lektion gibt es Wiederholungskarten (${cards} insgesamt). Mit ZAM kann Ihr Kind sie später in wachsenden Abständen wiederholen. Jede Karte führt zur passenden Lektion zurück. Die Karten stehen im ZAM-Katalog. Solange eine Lehrkraft das Paket noch nicht geprüft hat (Version 0), können sie sich noch ändern.</p>
</section>
<section class="card">
	<h2>Daten und Zurücksetzen</h2>
	<p>Es gibt kein Konto, keine Werbung und keine Verbindung zu fremden Servern. Der Fortschritt und die Texte vom Schreibtisch liegen nur im Speicher dieses Browsers. Auf einem gemeinsam genutzten Gerät können andere diese Texte lesen.</p>
	<button type="button" class="button danger" data-action="reset">Fortschritt zurücksetzen</button>
</section>`;
}

function showDialog(title: string, html: string): void {
	dialog.innerHTML = `<div class="dialog-head"><h2 id="dialog-title">${esc(title)}</h2><button type="button" class="icon-button" id="close-dialog" aria-label="Schließen">×</button></div>${html}`;
	element("#close-dialog").addEventListener("click", () => dialog.close());
	if (!dialog.open) dialog.showModal();
}

/* ---------- events ---------- */

/** A selector for the slot the child just tapped, so that it can pop. */
const slotSelector = (puzzle: string, slot: number): string => {
	const at = `[data-puzzle="${CSS.escape(puzzle)}"][data-slot="${slot}"]`;
	return `${at}[aria-pressed="true"], .mark-box${at}[class*="pen-"]`;
};

main.addEventListener("click", (event) => {
	const target = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
	if (!target || target.tagName === "FORM") return;
	const action = target.dataset.action;
	const l = lesson();
	const ws = l.workshop;
	switch (action) {
		case "open":
			if (target.dataset.lesson) navigate(target.dataset.lesson);
			return;
		case "view":
			navigate(target.dataset.target);
			return;
		case "wave":
			react("wave");
			return;
		case "district":
			chooseDistrict((target.dataset.stage ?? "werkstatt") as Stage["id"]);
			return;
		case "game-card":
			pickCard(Number(target.dataset.card));
			return;
		case "game-basket":
			dropCard((target.dataset.basket ?? "nomen") as WordClass);
			return;
		case "game-new":
			round = newRound(Math.random, round?.cards.map((c) => c.word));
			picked = null;
			companion = { ...companion, line: reaction("game-start").line };
			renderGame();
			react("game-start");
			main.querySelector<HTMLElement>("[data-action=game-card]")?.focus();
			return;
		case "rest":
			react("rest");
			return;
		case "wake":
			react("wake");
			return;
		case "step":
			goStep(Number(target.dataset.step));
			return;
		case "learn-more":
			showPieces(learnShown + 1);
			return;
		case "learn-all":
			showPieces(learnPieces(l).length);
			return;
		case "flip": {
			const turned = !target.classList.contains("turned");
			target.classList.toggle("turned", turned);
			target.setAttribute("aria-pressed", String(turned));
			target.setAttribute(
				"aria-label",
				turned ? `${target.dataset.term}: ${target.dataset.meaning}` : `${target.dataset.term}. Karte umdrehen`,
			);
			return;
		}
		case "quiz": {
			const correct = target.dataset.value === l.quiz.answer;
			main.querySelectorAll(".choice[data-action=quiz]").forEach((b) => {
				b.classList.toggle("picked", b === target);
				b.classList.remove("is-right", "is-wrong");
			});
			target.classList.add(correct ? "is-right" : "is-wrong");
			replay(target, correct ? "pop" : "wobble");
			element("#quiz-feedback").innerHTML = correct
				? `<p class="feedback success"><strong>Richtig!</strong> ${esc(l.quiz.explanation)}</p>`
				: '<p class="feedback hint">Hm, noch nicht. Lies die Erklärung noch einmal und probiere eine andere Antwort.</p>';
			if (correct && !progress.quizDone.includes(l.id)) {
				recordQuiz(progress, l.id);
				persist();
				react("quiz-star");
				refreshStars(2);
				celebrateIfDone();
			} else react(correct ? "quiz-right" : "quiz-wrong");
			return;
		}
		case "slot":
			if (ws.kind === "slots" && workshop) {
				const puzzle = target.dataset.puzzle ?? "";
				const slot = Number(target.dataset.slot);
				const was = puzzleSolved(ws as SlotWorkshop, workshop as SlotState, puzzle);
				workshop = tapSlot(ws as SlotWorkshop, workshop as SlotState, puzzle, slot, target.dataset.choice);
				const now = puzzleSolved(ws as SlotWorkshop, workshop as SlotState, puzzle);
				afterWorkshopChange(slotSelector(puzzle, slot), !was && now ? puzzle : undefined);
			}
			return;
		case "pen":
			if (ws.kind === "slots" && workshop) {
				workshop = choosePen(ws as SlotWorkshop, workshop as SlotState, target.dataset.pen ?? "");
				renderWorkshop(`[data-action="pen"][data-pen="${CSS.escape(target.dataset.pen ?? "")}"]`);
			}
			return;
		case "help": {
			const id = target.dataset.puzzle ?? "";
			openHelp = openHelp.includes(id) ? openHelp.filter((x) => x !== id) : [...openHelp, id];
			renderWorkshop();
			return;
		}
		case "wagon-left":
		case "wagon-right":
		case "wagon-front": {
			const pos = Number(target.dataset.pos);
			changeTrain((train, state) =>
				action === "wagon-front"
					? wagonToFront(train, state, pos)
					: moveWagon(train, state, pos, action === "wagon-left" ? -1 : 1),
			);
			return;
		}
		case "end":
			changeTrain((train, state) => setEnd(train, state, target.dataset.end === "?" ? "?" : "."));
			return;
		case "control":
			if (ws.kind === "machine" && workshop) {
				const machine = ws as MachineWorkshop;
				previousDisplay = machine.view((workshop as MachineState).values).display;
				const control = target.dataset.control ?? "";
				const value = target.dataset.value ?? "";
				workshop = setControl(machine, workshop as MachineState, control, value);
				afterWorkshopChange(`[data-control="${CSS.escape(control)}"][data-value="${CSS.escape(value)}"]`);
			}
			return;
		case "workshop-reset":
			workshop = initialState(ws);
			openHelp = [];
			renderWorkshop();
			return;
		case "level":
			taskLevel = target.dataset.level === "2" ? 2 : 1;
			progress.level = taskLevel;
			persist();
			main.querySelectorAll("[data-action=level]").forEach((b) => b.setAttribute("aria-selected", String(b === target)));
			renderPractice();
			return;
		case "answer":
			answer(target.dataset.value ?? "");
			return;
		case "reveal":
			if (current) {
				current.revealed = true;
				current.tone = "hint";
				const extra = current.task.explanation.startsWith("Richtig: ") ? "" : ` ${esc(current.task.explanation)}`;
				current.message = `Die Lösung: <strong>${esc(current.task.accept[0])}</strong>${extra} Diese Aufgabe zählt nicht. Die nächste schaffst du!`;
				renderPractice();
				react("task-reveal");
			}
			return;
		case "next-task":
			newTask(taskLevel);
			renderPractice();
			replay(main.querySelector("#practice-area .task"), "enter");
			main.querySelector<HTMLElement>("#answer, #practice-area .choice")?.focus();
			return;
		case "desk-clear":
			showDialog(
				"Text löschen?",
				'<p>Dein Text in dieser Lektion wird gelöscht. Das lässt sich nicht rückgängig machen.</p><div class="dialog-actions"><button type="button" class="button danger" id="confirm-desk-clear">Ja, löschen</button></div>',
			);
			element("#confirm-desk-clear").addEventListener("click", () => {
				const saved = saveText(lessonId, "");
				dialog.close();
				render();
				const area = main.querySelector<HTMLTextAreaElement>("#desk-text");
				area?.focus();
				if (!saved) element("#desk-status").textContent = "Dein Browser speichert gerade nicht. Der Text konnte nicht gelöscht werden.";
			});
			return;
		case "reset":
			showDialog(
				"Alles zurücksetzen?",
				'<p>Alle Sterne, Sticker, gelösten Aufgaben und Texte vom Schreibtisch in diesem Browser werden gelöscht.</p><div class="dialog-actions"><button type="button" class="button danger" id="confirm-reset">Ja, löschen</button></div>',
			);
			element("#confirm-reset").addEventListener("click", () => {
				progress = resetProgress();
				clearTexts();
				persist();
				dialog.close();
				navigate();
			});
			return;
	}
});

/* Satzzug: drag a wagon by its text to a new place. The arrow buttons stay for keyboards. */
interface Drag {
	from: number;
	x: number;
	y: number;
	home: DOMRect;
	el: HTMLElement;
	pointer: number;
	moved: boolean;
	to: number;
}
let drag: Drag | null = null;

/** The place of the wagon nearest to the pointer; the wagon's own place counts too. */
function dropPlace(x: number, y: number, d: Drag): number {
	let best = d.from;
	let distance = Math.hypot(x - (d.home.left + d.home.width / 2), y - (d.home.top + d.home.height / 2));
	main.querySelectorAll<HTMLElement>(".wagon[data-pos]").forEach((w) => {
		if (w === d.el) return;
		const r = w.getBoundingClientRect();
		const here = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
		if (here < distance) {
			distance = here;
			best = Number(w.dataset.pos);
		}
	});
	return best;
}

main.addEventListener("pointerdown", (event) => {
	const handle = (event.target as HTMLElement).closest<HTMLElement>("[data-drag]");
	const el = handle?.closest<HTMLElement>(".wagon");
	if (!handle || !el || !workshop || lesson().workshop.kind !== "train" || event.button > 0) return;
	const from = Number(handle.dataset.drag);
	drag = { from, x: event.clientX, y: event.clientY, home: el.getBoundingClientRect(), el, pointer: event.pointerId, moved: false, to: from };
	el.setPointerCapture(event.pointerId);
});

main.addEventListener("pointermove", (event) => {
	if (!drag || event.pointerId !== drag.pointer) return;
	const dx = event.clientX - drag.x;
	const dy = event.clientY - drag.y;
	if (!drag.moved && Math.hypot(dx, dy) < 6) return;
	drag.moved = true;
	drag.el.classList.add("dragging");
	drag.el.style.transform = `translate(${dx}px, ${dy}px) rotate(-2deg)`;
	drag.to = dropPlace(event.clientX, event.clientY, drag);
	const to = drag.to;
	const from = drag.from;
	main.querySelectorAll<HTMLElement>(".wagon[data-pos]").forEach((w) =>
		w.classList.toggle("drop-target", to !== from && Number(w.dataset.pos) === to),
	);
});

function endDrag(event: PointerEvent, drop: boolean): void {
	if (!drag || event.pointerId !== drag.pointer) return;
	const { from, to, moved, el } = drag;
	drag = null;
	el.classList.remove("dragging");
	main.querySelectorAll(".drop-target").forEach((w) => w.classList.remove("drop-target"));
	if (drop && moved && to !== from) changeTrain((train, state) => moveWagonTo(train, state, from, to));
	else el.style.transform = "";
}
main.addEventListener("pointerup", (event) => endDrag(event, true));
main.addEventListener("pointercancel", (event) => endDrag(event, false));

main.addEventListener("input", (event) => {
	const area = event.target;
	if (!(area instanceof HTMLTextAreaElement) || area.id !== "desk-text") return;
	const saved = saveText(area.dataset.lesson ?? "", area.value);
	element("#desk-status").textContent = saved ? "" : "Dein Browser speichert gerade nicht. Schreibe deinen Text auch ins Heft.";
});

main.addEventListener("submit", (event) => {
	const form = event.target as HTMLFormElement;
	if (form.dataset.action !== "text-answer") return;
	event.preventDefault();
	answer(new FormData(form).get("answer")?.toString() ?? "");
});

document.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((b) =>
	b.addEventListener("click", () => navigate(b.dataset.view)),
);
element("#home").addEventListener("click", (event) => {
	event.preventDefault();
	navigate();
});
element("#theme").addEventListener("click", () => {
	const now =
		document.documentElement.dataset.theme ??
		(matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
	const theme = now === "dark" ? "light" : "dark";
	document.documentElement.dataset.theme = theme;
	try {
		localStorage.setItem("deutsch_gs4_theme", theme);
	} catch {
		/* The theme works for this visit. */
	}
});

/* The calm view: no movement at all. The device setting for reduced motion always wins. */
const motionButton = element<HTMLButtonElement>("#motion");
function showMotion(): void {
	const quiet = calm();
	motionButton.setAttribute("aria-pressed", String(quiet));
	motionButton.disabled = deviceCalm();
	motionButton.title = deviceCalm()
		? "Dein Gerät wünscht wenig Bewegung. Deshalb bleibt alles ruhig."
		: quiet
			? "Ruhige Ansicht ist an: nichts bewegt sich."
			: "Ruhige Ansicht: Tinto und die Werkstätten bewegen sich nicht.";
}
motionButton.addEventListener("click", () => {
	const quiet = document.documentElement.dataset.motion !== "calm";
	if (quiet) document.documentElement.dataset.motion = "calm";
	else delete document.documentElement.dataset.motion;
	try {
		localStorage.setItem(MOTION_KEY, quiet ? "calm" : "move");
	} catch {
		/* The setting works for this visit. */
	}
	showMotion();
});
showMotion();

window.addEventListener("storage", (event) => {
	// Another tab changed or reset the texts: show what is stored now, so that the
	// next keystroke here cannot bring a deleted text back.
	if (event.key === TEXTS_KEY || event.key === null) {
		const area = main.querySelector<HTMLTextAreaElement>("#desk-text");
		if (area) area.value = loadText(area.dataset.lesson ?? "");
	}
	if (event.key !== STORAGE_KEY) return;
	progress = adoptStored(progress);
	stats();
	if (view !== "lesson") render();
});

function applyRoute(): void {
	if (dialog.open) dialog.close();
	const link = parseDeepLink(location.hash, location.search);
	routeNotice = "";
	if (link.level) taskLevel = link.level;
	if (link.lessonId && findLesson(link.lessonId)) openLesson(link.lessonId, link.level);
	else {
		if (link.view === "spiel" && view !== "spiel") {
			round = null;
			gameReturn = null;
			companion = { ...companion, mood: "happy", line: reaction("game-start").line };
		}
		if (link.view === "stickers" || link.view === "heft" || link.view === "eltern" || link.view === "spiel") view = link.view;
		else {
			view = "path";
			if (link.lessonId || location.hash.includes("lesson="))
				routeNotice = "Diese Lektion gibt es nicht. Wähle eine Station in der Wörterstadt.";
		}
		lastStage = "";
	}
	render();
}
window.addEventListener("hashchange", applyRoute);
applyRoute();
persist();
