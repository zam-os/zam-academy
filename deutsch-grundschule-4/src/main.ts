import "./styles.css";
import cell from "../cell.json";
import { findLesson, LESSONS, quizOptions, SOURCES, STAGES } from "./curriculum";
import { checkAnswer, makeTask, markup } from "./exercises/tasks";
import { esc } from "./format";
import {
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
import { tinto } from "./tinto";
import type { Level, ReadyLesson, SlotWorkshop, Task, TrainWorkshop, MachineWorkshop } from "./types";
import {
	type AnyState,
	choosePen,
	initialState,
	moveWagon,
	reachedGoals,
	setControl,
	setEnd,
	tapSlot,
	wagonToFront,
} from "./workshop/engine";
import { workshopHtml } from "./workshop/view";
import { parseDeepLink } from "./zam/zam-link";

type View = "path" | "lesson" | "stickers" | "heft" | "eltern";

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

/* Per-visit lesson state: the Werkstatt and the current task. */
let workshop: AnyState | null = null;
let openHelp: string[] = [];
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

function bubble(text: string, mood: "happy" | "think" | "cheer" = "happy"): string {
	return `<div class="tinto-says">${tinto(mood)}<p class="bubble">${esc(text)}</p></div>`;
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

function navigate(target?: string): void {
	routeNotice = "";
	if (target && findLesson(target)) {
		if (target !== lessonId || view !== "lesson") {
			workshop = null;
			current = null;
			openHelp = [];
		}
		lessonId = target;
		view = "lesson";
	} else if (target === "stickers" || target === "heft" || target === "eltern") view = target;
	else view = "path";
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
	if (view === "lesson") renderLesson(l);
	else if (view === "stickers") renderStickers();
	else if (view === "heft") renderHeft();
	else if (view === "eltern") renderParents();
	else renderPath();
	stats();
}

/* ---------- Stadtplan ---------- */

function renderPath(): void {
	const c = completion(progress);
	const next = LESSONS.find((l) => !isComplete(progress, l.id));
	const hello = c.stars
		? `Schön, dass du wieder da bist! Du hast schon ${c.stars} Sterne gesammelt.`
		: "Hallo, ich bin Tinto! Ich schreibe mit acht Armen. Komm mit durch meine Wörterstadt!";
	main.innerHTML = `${routeNotice ? `<p class="notice" role="status">${esc(routeNotice)}</p>` : ""}
<section class="hero">
	${bubble(hello, c.stars ? "cheer" : "happy")}
	<div class="hero-text">
		<p class="eyebrow">Deutsch · 4. Klasse · Bayern</p>
		<h1>Tintos Wörterstadt</h1>
		<p>Baue Wörter, rangiere Satzzüge und löse Rechtschreib-Fälle. Für jede Lektion gibt es vier Sterne und einen Sticker.</p>
		<button type="button" class="button big" data-action="open" data-lesson="${(next ?? LESSONS[0]).id}">${c.stars ? "Weiter geht's" : "Los geht's"} → ${esc((next ?? LESSONS[0]).title)}</button>
	</div>
</section>
<div class="districts">${STAGES.map((stage) => {
		const lessons = LESSONS.filter((l) => l.stage === stage.id);
		const done = lessons.filter((l) => isComplete(progress, l.id)).length;
		return `<section class="district" data-stage="${stage.id}">
<header><span class="district-icon" aria-hidden="true">${stage.icon}</span><div><h2>${esc(stage.title)}</h2><p>${esc(stage.subtitle)}</p></div><span class="district-count">${done} / ${lessons.length} 🏅</span></header>
<ol class="road">${lessons
			.map(
				(l, i) =>
					`<li><button type="button" class="station${isComplete(progress, l.id) ? " complete" : ""}" data-action="open" data-lesson="${l.id}"><span class="station-badge" aria-hidden="true">${isComplete(progress, l.id) ? l.sticker.emoji : i + 1}</span><span class="station-name">${esc(l.title)}</span>${starRow(l.id)}</button></li>`,
			)
			.join("")}</ol></section>`;
	}).join("")}</div>
<aside class="notice">Tinto sammelt keine Daten. Deine Sterne bleiben nur in diesem Browser. Eltern finden Hinweise unter <button type="button" class="text-button" data-action="view" data-target="eltern">Für Eltern</button>.</aside>`;
}

/* ---------- Lektion ---------- */

function renderLesson(l: ReadyLesson): void {
	const stage = stageOf(l);
	const index = LESSONS.indexOf(l);
	const s = stars(progress, l.id);
	main.innerHTML = `<div class="lesson-top"><button type="button" class="text-button" data-action="view" data-target="path">← Zur Wörterstadt</button>${starRow(l.id)}</div>
<header class="lesson-head">
	<p class="eyebrow">${stage.icon} ${esc(stage.title)} · Lektion ${index + 1} von ${LESSONS.length}</p>
	<h1>${esc(l.title)}</h1>
	${bubble(l.skill, "happy")}
	<p class="small lehrplan">${esc(l.lehrplan)}</p>
</header>
<section class="card learn">
	<h2><span class="step">1</span> Verstehen</h2>
	${l.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
	<div class="example"><h3>${esc(l.example.title)}</h3><ul>${l.example.lines.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
	<div class="merke"><strong>Merke</strong><p>${esc(l.takeaway)}</p></div>
	<dl class="terms">${l.terms.map((t) => `<div><dt>${esc(t.term)}</dt><dd>${esc(t.meaning)}</dd></div>`).join("")}</dl>
</section>
<section class="card" id="quiz-card">
	<h2><span class="step">2</span> Schnellcheck <span class="star${s.quiz ? " on" : ""}" aria-label="${s.quiz ? "Stern verdient" : "Stern offen"}">★</span></h2>
	<p class="question">${esc(l.quiz.question)}</p>
	<div class="choices">${quizOptions(l)
		.map((o) => `<button type="button" class="choice" data-action="quiz" data-value="${esc(o)}">${esc(o)}</button>`)
		.join("")}</div>
	<div id="quiz-feedback" role="status"></div>
</section>
<section class="card" id="workshop-card">
	<h2><span class="step">3</span> ${esc(l.workshop.title)} <span class="star${s.workshop ? " on" : ""}" id="workshop-star">★</span></h2>
	${bubble(l.workshop.intro, "think")}
	<ul class="goals" id="goals"></ul>
	<div id="workshop-area" class="workshop"></div>
	<button type="button" class="text-button" data-action="workshop-reset">↺ Werkstatt neu starten</button>
</section>
<section class="card" id="practice-card">
	<h2><span class="step">4</span> Üben</h2>
	<div class="level-tabs" role="tablist" aria-label="Stufe">
		<button type="button" role="tab" data-action="level" data-level="1" aria-selected="${taskLevel === 1}">🌱 Stufe 1 · Mit Tipp ${s.level1 ? "★" : ""}</button>
		<button type="button" role="tab" data-action="level" data-level="2" aria-selected="${taskLevel === 2}">🏅 Stufe 2 · Probe-Training ${s.level2 ? "★" : ""}</button>
	</div>
	<div id="practice-area"></div>
</section>
<nav class="lesson-nav" aria-label="Lektionen">
	<button type="button" class="button secondary" data-action="open" data-lesson="${LESSONS[index - 1]?.id ?? ""}" ${index === 0 ? "disabled" : ""}>← Vorige Lektion</button>
	<button type="button" class="button" data-action="open" data-lesson="${LESSONS[index + 1]?.id ?? ""}" ${index === LESSONS.length - 1 ? "disabled" : ""}>Nächste Lektion →</button>
</nav>`;
	if (!workshop) workshop = initialState(l.workshop);
	renderWorkshop();
	renderPractice();
}

function renderWorkshop(): void {
	const l = lesson();
	if (!workshop) return;
	const reached = new Set(progress.goals[l.id] ?? []);
	const live = new Set(reachedGoals(l.workshop, workshop));
	element("#goals").innerHTML = l.workshop.goals
		.map(
			(g) =>
				`<li class="${reached.has(g.id) ? "done" : ""}${live.has(g.id) ? " live" : ""}"><span aria-hidden="true">${reached.has(g.id) ? "✅" : "🎯"}</span> ${esc(g.label)}</li>`,
		)
		.join("");
	element("#workshop-area").innerHTML = workshopHtml(l.workshop, workshop, openHelp);
	element("#workshop-star").classList.toggle("on", stars(progress, l.id).workshop);
}

function afterWorkshopChange(): void {
	const l = lesson();
	if (!workshop) return;
	const before = stars(progress, l.id).workshop;
	const fresh = recordGoals(progress, l.id, reachedGoals(l.workshop, workshop));
	if (fresh.length) {
		persist();
		say(stars(progress, l.id).workshop && !before ? "Alle drei Ziele geschafft! Ein Stern für dich ⭐" : "Ziel erreicht! 🎯");
		celebrateIfDone();
	}
	renderWorkshop();
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
	if (result.correct) {
		current.solved = true;
		const n = recordSolved(progress, l.id, current.level);
		persist();
		current.tone = "success";
		current.message = `<strong>Richtig!</strong> ${esc(current.task.explanation.replace(/^Richtig: /, "So heißt es: "))}`;
		if (n === l.requiredCorrect)
			say(current.level === 1 ? "Stufe 1 geschafft! Ein Stern ⭐" : "Probe-Training geschafft! Ein Stern ⭐");
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
	}
	renderPractice();
	if (current.task.kind === "text" && !current.solved)
		main.querySelector<HTMLInputElement>("#answer")?.focus();
	else main.querySelector<HTMLElement>("[data-action=next-task]")?.focus();
}

function celebrateIfDone(): void {
	const l = lesson();
	if (!isComplete(progress, l.id) || progress.celebrated.includes(l.id)) return;
	progress.celebrated.push(l.id);
	persist();
	const next = LESSONS[LESSONS.indexOf(l) + 1];
	showDialog(
		"Sticker verdient!",
		`<div class="celebrate">${tinto("cheer")}<div class="sticker big" aria-hidden="true">${l.sticker.emoji}</div><p><strong>${esc(l.sticker.name)}</strong> klebt jetzt in deinem Stickerheft.</p><p>Alle vier Sterne in „${esc(l.title)}“. Super gemacht!</p></div>
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
	<p>Tintos Wörterstadt übt ${LESSONS.length} Themen aus dem LehrplanPLUS Deutsch der Jahrgangsstufen 3 und 4 in Bayern: Sprache untersuchen (Wortarten, die vier Fälle, Zeitformen, Wortbildung, Satzarten, wörtliche Rede, Satzglieder, Bindewörter) und Richtig schreiben (Silben, kurze und lange Selbstlaute, Verlängern, Ableiten, Großschreibung, Wörterbuch).</p>
	<p>Jede Lektion hat eine kurze Erklärung, einen Schnellcheck, eine Werkstatt zum Ausprobieren und Aufgaben auf zwei Stufen. Stufe 1 gibt einen Tipp. Stufe 2 übt ohne Tipp, ähnlich wie in einer Probe.</p>
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
	<p>Für den Übertritt zählen in Bayern Deutsch, Mathematik und Heimat- und Sachunterricht zusammen. Diese App übt einen Teil von Deutsch. Noch nicht enthalten sind Lesen und Textverständnis, eigene Texte (Erzählen, Berichten, Beschreiben), Sprechen und Zuhören sowie der verbindliche Grundwortschatz. Echte Bücher, Vorlesen, Schreiben mit der Hand und Gespräche bleiben wichtig.</p>
	<p>Die Inhalte sind eine Erprobungsfassung. Eine Grundschullehrkraft hat sie noch nicht fachlich freigegeben.</p>
	<ul class="source-list">${SOURCES.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`).join("")}<li><a href="https://www.km.bayern.de/lernen/ubertritt-und-bildungswege/uebertritt" target="_blank" rel="noopener noreferrer">Bayerisches Kultusministerium · Übertritt</a></li></ul>
	<p class="small">Links öffnen erst auf Ihren Klick.</p>
</section>
<section class="card">
	<h2>Mit ZAM wiederholen</h2>
	<p>Zu jeder Lektion gibt es Wiederholungskarten (${cards} insgesamt). Mit ZAM kann Ihr Kind sie später in wachsenden Abständen wiederholen. Jede Karte führt zur passenden Lektion zurück. Das Paket ist eine lokale Erprobungsfassung und noch nicht im ZAM-Katalog.</p>
</section>
<section class="card">
	<h2>Daten und Zurücksetzen</h2>
	<p>Es gibt kein Konto, keine Werbung und keine Verbindung zu fremden Servern. Der Fortschritt liegt nur im Speicher dieses Browsers.</p>
	<button type="button" class="button danger" data-action="reset">Fortschritt zurücksetzen</button>
</section>`;
}

function showDialog(title: string, html: string): void {
	dialog.innerHTML = `<div class="dialog-head"><h2 id="dialog-title">${esc(title)}</h2><button type="button" class="icon-button" id="close-dialog" aria-label="Schließen">×</button></div>${html}`;
	element("#close-dialog").addEventListener("click", () => dialog.close());
	if (!dialog.open) dialog.showModal();
}

/* ---------- events ---------- */

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
		case "quiz": {
			const correct = target.dataset.value === l.quiz.answer;
			main.querySelectorAll(".choice[data-action=quiz]").forEach((b) => b.classList.toggle("picked", b === target));
			element("#quiz-feedback").innerHTML = correct
				? `<p class="feedback success"><strong>Richtig!</strong> ${esc(l.quiz.explanation)}</p>`
				: '<p class="feedback hint">Hm, noch nicht. Lies die Erklärung oben noch einmal und probiere eine andere Antwort.</p>';
			if (correct && !progress.quizDone.includes(l.id)) {
				recordQuiz(progress, l.id);
				persist();
				say("Schnellcheck geschafft! Ein Stern ⭐");
				main.querySelector("#quiz-card .star")?.classList.add("on");
				main.querySelector(".lesson-top .stars")?.replaceWith(document.createRange().createContextualFragment(starRow(l.id)));
				celebrateIfDone();
			}
			return;
		}
		case "slot":
			if (ws.kind === "slots" && workshop) {
				workshop = tapSlot(ws as SlotWorkshop, workshop as never, target.dataset.puzzle ?? "", Number(target.dataset.slot), target.dataset.choice);
				afterWorkshopChange();
			}
			return;
		case "pen":
			if (ws.kind === "slots" && workshop) {
				workshop = choosePen(ws as SlotWorkshop, workshop as never, target.dataset.pen ?? "");
				renderWorkshop();
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
		case "wagon-front":
			if (ws.kind === "train" && workshop) {
				const pos = Number(target.dataset.pos);
				workshop =
					action === "wagon-front"
						? wagonToFront(ws as TrainWorkshop, workshop as never, pos)
						: moveWagon(ws as TrainWorkshop, workshop as never, pos, action === "wagon-left" ? -1 : 1);
				afterWorkshopChange();
			}
			return;
		case "end":
			if (ws.kind === "train" && workshop) {
				workshop = setEnd(ws as TrainWorkshop, workshop as never, target.dataset.end === "?" ? "?" : ".");
				afterWorkshopChange();
			}
			return;
		case "control":
			if (ws.kind === "machine" && workshop) {
				workshop = setControl(ws as MachineWorkshop, workshop as never, target.dataset.control ?? "", target.dataset.value ?? "");
				afterWorkshopChange();
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
			}
			return;
		case "next-task":
			newTask(taskLevel);
			renderPractice();
			main.querySelector<HTMLElement>("#answer, #practice-area .choice")?.focus();
			return;
		case "reset":
			showDialog(
				"Alles zurücksetzen?",
				'<p>Alle Sterne, Sticker und gelösten Aufgaben in diesem Browser werden gelöscht.</p><div class="dialog-actions"><button type="button" class="button danger" id="confirm-reset">Ja, löschen</button></div>',
			);
			element("#confirm-reset").addEventListener("click", () => {
				progress = resetProgress();
				persist();
				dialog.close();
				navigate();
			});
			return;
	}
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
window.addEventListener("storage", (event) => {
	if (event.key !== STORAGE_KEY) return;
	persist();
	if (view !== "lesson") render();
});

function applyRoute(): void {
	if (dialog.open) dialog.close();
	const link = parseDeepLink(location.hash, location.search);
	routeNotice = "";
	if (link.level) taskLevel = link.level;
	if (link.lessonId && findLesson(link.lessonId)) {
		if (link.lessonId !== lessonId || view !== "lesson") {
			workshop = null;
			current = null;
		}
		lessonId = link.lessonId;
		view = "lesson";
	} else if (link.view === "stickers" || link.view === "heft" || link.view === "eltern") view = link.view;
	else {
		view = "path";
		if (link.lessonId || location.hash.includes("lesson="))
			routeNotice = "Diese Lektion gibt es nicht. Wähle eine Station in der Wörterstadt.";
	}
	render();
}
window.addEventListener("hashchange", applyRoute);
applyRoute();
persist();
