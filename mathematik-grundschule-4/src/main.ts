import "./styles.css";
import { island, MOODS, type Mood } from "./companion/render";
import { teacherPanel, loadTeacherPlayer } from "./media/player";
import {
	describe,
	digits,
	exchange,
	format,
	parseInteger,
	validCounts,
	WEIGHTS,
	type Column,
	type Counts,
} from "./math/place-value";
import {
	grant,
	newPractice,
	attemptExample,
	independent,
	laterEligible,
	nextStep,
	recordAttempt,
	type Progress,
} from "./practice/evidence";
import {
	LESSON_ID,
	STEPS,
	orderedOptions,
	practiceTask,
	correctTask,
	mistakeHint,
	recallSeed,
	taskFor,
	type Task,
} from "./practice/tasks";
import { ProgressStore } from "./storage/progress";
import { board } from "./ui/board";
import { validLessonHash } from "./zam/zam-link";
import { ulid } from "./id";

const app = (() => {
	const element = document.querySelector<HTMLDivElement>("#app");
	if (!element) throw new Error("Die Lernansicht fehlt.");
	return element;
})();
const store = new ProgressStore();
let view: "child" | "parent" | "settings" = "child";
let feedback = "";
let encouraging = false;
let celebrating = false;
let hello = false;
let eating = false;
let busy = false;
let showReset = false;
let answerDraft = "";
let answerKey = "";
let audio: AudioContext | null = null;
let sound = false;
let quiet = false;
let theme = "auto";
try {
	quiet = localStorage.getItem("mathe4-quiet") === "true";
	theme = localStorage.getItem("mathe4-theme") ?? "auto";
} catch {}
const escapeHtml = (s: string) =>
	s.replace(
		/[&<>"']/g,
		(c) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				c
			] ?? c,
	);
const date = (at: number) =>
	new Intl.DateTimeFormat("de-DE", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(at);
const GOALS: Record<string, string> = {
	G1: "Den Wert einer Ziffer erkennen",
	G2: "Zahlen und Stellenwerttafeln verbinden",
	G3: "Die Null als Platzhalter verstehen",
	G4: "Bündeln und entbündeln",
};

function currentTask(p = store.state): Task | null {
	if (p.practice)
		return practiceTask(p.practice.level, p.practice.seed, p.practice.index);
	if (p.later)
		return taskFor(
			(["later-read", "later-zero", "later-exchange"] as const)[p.later.index],
			p.later.seed,
		);
	return taskFor(p.step, p.seed);
}
function taskKey(p = store.state): string {
	return p.practice
		? `${p.practice.id}/${p.practice.index}`
		: p.later
			? `${p.later.id}/${p.later.index}`
			: `journey/v2/${p.step}`;
}
function mood(): Mood {
	return store.state.resting
		? "resting"
		: eating
			? "snack"
			: encouraging
				? "encouraging"
				: celebrating
					? "celebrating"
					: hello
						? "welcoming"
						: "curious";
}
function message(): string {
	return store.state.resting
		? "Ich mache es mir gemütlich. Deine Entdeckungen warten auf dich."
		: eating
			? "Mmmh, danke! Jetzt genießen wir unsere Entdeckung."
			: encouraging
				? "Wir probieren einen anderen Weg. Ich bin bei dir."
				: celebrating
					? "Das haben wir zusammen entdeckt! Unser Zuhause wächst."
					: hello
						? "Wie schön, dass du da bist!"
						: "Kleine Schritte, große Entdeckungen. Wollen wir loslegen?";
}

function chime(): void {
	if (!sound) return;
	try {
		if (typeof AudioContext === "undefined") {
			sound = false;
			return;
		}
		audio ??= new AudioContext();
		const context = audio;
		void context.resume().catch(() => {});
		[523.25, 659.25, 783.99].forEach((frequency, index) => {
			const osc = context.createOscillator();
			const gain = context.createGain();
			const start = context.currentTime + index * 0.1;
			osc.frequency.value = frequency;
			osc.connect(gain);
			gain.connect(context.destination);
			gain.gain.setValueAtTime(0.001, start);
			gain.gain.linearRampToValueAtTime(0.035, start + 0.02);
			gain.gain.exponentialRampToValueAtTime(0.001, start + 0.27);
			osc.start(start);
			osc.stop(start + 0.3);
		});
	} catch {
		sound = false;
	}
}

function notices(): string {
	const invalidLink = location.hash && !validLessonHash(location.hash);
	return `${store.mode === "memory" ? '<p class="notice" role="status">Du kannst spielen. Dein Browser kann den Lernstand gerade nicht speichern. Lass diese Seite zum Weitermachen geöffnet.</p>' : ""}${invalidLink ? '<p class="notice">Dieser Lektionslink ist hier nicht bekannt. Du bist in Milos Stellenwert-Werkstatt.</p>' : ""}`;
}

function companion(): string {
	const p = store.state;
	const snack =
		p.rewards.includes("mission-b") && !p.consumed.includes("mission-b");
	return `<aside class="companion" aria-label="Milo und eure Insel">${island(mood(), p.rewards.includes("mission-a"), p.rewards.includes("mission-b"))}
    <div class="companion-copy"><div class="companion-title"><h2>Milo</h2><span class="mood-label">${MOODS[mood()].replace(/^Milo /, "")}</span></div><p id="milo-message" aria-live="polite">${message()}</p>
    <div class="care-actions"><button data-action="hello">♡ Hallo, Milo!</button><button data-action="snack" ${snack ? "" : "disabled"}>${p.consumed.includes("mission-b") ? "Apfel geteilt" : "♧ Apfel teilen"}</button></div>
    <button class="text-button" data-action="rest">${p.resting ? "Aufwachen und weitermachen" : "Eine Pause machen"}</button>
    <p class="care-note">Milo geht es auch in deinen Lernpausen gut.</p></div></aside>`;
}

function taskView(task: Task): string {
	const p = store.state;
	const solved = p.attempts.some((a) => a.key === taskKey() && a.outcome);
	const interactive = task.family === "build" || !!task.target;
	const counts = interactive ? p.workspace : task.model;
	const helped = p.helped.includes(taskKey());
	const wrong = p.attempts.filter(
		(a) => a.key === taskKey() && !a.outcome,
	).length;
	const label = p.practice
		? `Übungsrunde · Stufe ${p.practice.level} · ${p.practice.level === 1 ? "Mit Stellen arbeiten" : "Wissen übertragen"}${p.practice.requiredCorrect ? ` · ${p.practice.correct} von ${p.practice.requiredCorrect} Aufgaben gelöst` : ""}`
		: p.later
			? "Später erinnern · neue Aufgabe"
			: p.step.startsWith("entry-")
				? "Kurzer Einstieg · du darfst überspringen"
				: "Deine Stellenwert-Aufgabe · ohne Zeitdruck";
	const numeral =
		task.numeral === undefined
			? ""
			: `<p class="digit-numeral" aria-label="${format(task.numeral)}, markierte Ziffer ${digits(task.numeral)[task.column ?? 0]}">${String(
					task.numeral,
				)
					.split("")
					.map((digit, i, all) =>
						all.length - i - 1 === task.column
							? `<mark>${digit}</mark>`
							: digit,
					)
					.join("")}</p>`;
	return `<div class="mission-label">${label}</div><h2 id="lesson-heading" tabindex="-1">${escapeHtml(task.prompt)}</h2>${numeral}
  ${board(counts, interactive && task.family === "build" && !solved, task.column, !!task.target && !solved, solved, Math.max(4, String(task.numeral ?? task.answer).length))}
  ${interactive && !solved ? `<div class="workspace-tools"><span>Prüfe die Bündel in jeder Spalte.</span><button data-action="undo" ${p.undo.length ? "" : "disabled"}>Rückgängig</button><button data-action="task-reset">Aufgabe zurücksetzen</button></div>` : ""}
  ${
		solved
			? `<div class="feedback success" role="status">${helped || wrong ? "Mit Hilfe geschafft. " : "Richtig! "}${escapeHtml(task.explanation)}</div><button class="primary" data-action="advance-task">${p.practice?.requiredCorrect === null ? "Noch eine Aufgabe" : "Weiter"}</button>`
			: task.options
				? `<div class="answer-options">${orderedOptions(
						task,
						p.practice?.seed ?? p.later?.seed ?? p.seed,
					)
						.map(
							(option) =>
								`<button data-action="choice" data-value="${option.value}">${escapeHtml(option.label)}</button>`,
						)
						.join("")}</div>`
				: interactive
					? '<button class="primary" data-action="check">Meine Darstellung prüfen</button>'
					: `<div class="numeric-answer"><label for="answer">Meine Antwort<input id="answer" inputmode="numeric" autocomplete="off" spellcheck="false" placeholder="Zahl eingeben" value="${escapeHtml(answerDraft)}"></label><button class="primary" data-action="check">Meine Idee prüfen</button></div>`
	}
  ${!solved ? `<div class="help-row"><button class="text-button" data-action="hint">${helped ? "Tipp noch einmal zeigen" : "Ein kleiner Tipp"}</button>${wrong >= 2 || helped ? '<button class="text-button" data-action="solution">Lösung gemeinsam ansehen</button>' : ""}${p.step.startsWith("entry-") ? '<button class="text-button" data-action="skip-entry">Direkt zur Erklärung</button>' : ""}</div>${feedback ? `<div class="feedback" role="status">${escapeHtml(feedback)}</div>` : ""}${helped && feedback === task.explanation ? '<button class="primary" data-action="worked-continue">Mit Hilfe weiter</button>' : ""}` : ""}
  ${p.practice?.requiredCorrect === null ? '<button class="text-button" data-action="practice-stop">Übungsrunde beenden</button>' : ""}`;
}

function lesson(): string {
	const p = store.state;
	if (p.resting)
		return `<div class="pause"><span class="large-symbol" aria-hidden="true">☾</span><p class="eyebrow">Eine gute Zeit für eine Pause</p><h2>Alles wartet auf dich.</h2><p>Milo ruht sich aus. Deine Werkstatt und deine Entdeckungen bleiben erhalten.</p><button class="primary" data-action="rest">Gemeinsam weitermachen</button></div>`;
	const task = currentTask();
	if (task) return taskView(task);
	if (p.step === "welcome")
		return `<span class="mission-label">Dein erstes Inselabenteuer</span><h2 id="lesson-heading" tabindex="-1">Milos Stellenwert-Werkstatt</h2><p class="lead">Hilf Milo, seine Werkstatt einzurichten. Baue Zahlen und entdecke, was jede Stelle bedeutet.</p><div class="welcome-example">${board([6, 0, 3, 0])}</div><p>Zwei kleine Missionen. Du kannst jederzeit eine Pause machen.</p><button class="primary" data-action="next">Mit Milo loslegen <span aria-hidden="true">→</span></button><p class="fine-print">Mit kleinen Zahlen starten · bis 999 999 weiterdenken</p>`;
	if (p.step === "learn-a")
		return `<span class="mission-label">Mission 1 · Zahlen bauen</span><h2 id="lesson-heading" tabindex="-1">Jede Stelle hat ihren Wert.</h2><p class="lead">Links stehen die großen Bündel, rechts die Einer. Auch eine leere Spalte hat ihren Platz.</p>${board([6, 0, 3, 0])}<p class="explanation-callout"><strong>306</strong> heißt: 3 Hunderter, kein Zehner, 6 Einer. Die Null bewahrt den Platz der Zehner.</p><p>Vergleiche 306 und 360: Die 6 steht zuerst bei den Einern, dann bei den Zehnern. Ihr Wert ändert sich von 6 auf 60.</p><p class="merke"><strong>Merke:</strong> Eine Stelle weiter links bedeutet den zehnfachen Wert. Bei 30 407 bleiben Tausender- und Zehnerstelle leer. Die Nullen bewahren beide Plätze.</p><button class="primary" data-action="next">Jetzt baue ich eine andere Zahl</button>`;
	if (p.step === "mission-a-end")
		return `<div class="milestone"><span class="large-symbol" aria-hidden="true">✿</span><span class="mission-label">Mission 1 geschafft</span><h2 id="lesson-heading" tabindex="-1">Eine Blume für eure Werkstatt!</h2><p>Du hast Zahlen gebaut und ihre Stellen entdeckt. Eure Blume bleibt auf der Insel.</p><button class="primary" data-action="next">Mission 2 entdecken</button><button data-action="rest">Für heute eine Pause</button></div>`;
	if (p.step === "learn-b")
		return `<span class="mission-label">Mission 2 · Geschickt tauschen</span><h2 id="lesson-heading" tabindex="-1">Anders gebündelt. Genauso viel.</h2><p class="lead">Milo braucht Platz auf seiner Werkbank. Hilfst du beim Bündeln?</p><div class="big-exchange"><span>10 Einer</span><span aria-hidden="true">⇄</span><span>1 Zehner</span></div><p>Beim Bündeln und Entbündeln bleibt der Wert gleich. Nur die Form der Bündel ändert sich.</p><p class="example">1 000 = 10 H = 100 Z. Ein Tausender kann in zehn Hunderter und jeder Hunderter in zehn Zehner getauscht werden.</p><p class="merke"><strong>Merke:</strong> Beim Bündeln ändern sich die Stücke, ihr Wert bleibt gleich. 10 HT sind 1 Million (1 000 000).</p><button class="primary" data-action="next">Den Tausch ausprobieren</button>`;
	if (p.step === "explain")
		return `<span class="mission-label">Dein Gedanke zählt</span><h2 id="lesson-heading" tabindex="-1">Erkläre es Milo auf deine Art.</h2><p class="lead">Warum ist ein Hunderter genauso viel wie zehn Zehner?</p><p>Zeige es mit deinen Händen, mit Dingen auf dem Tisch oder erzähle es laut. Du kannst es auch jemandem zu Hause erklären.</p><p class="fine-print">Wir nehmen nichts auf. Deine Erklärung wird hier nicht automatisch bewertet.</p><div class="button-row"><button class="primary" data-action="explained">Ich habe es erklärt</button><button data-action="next">Weiter zu meinen neuen Aufgaben</button></div>`;
	const completed = p.completed["mission-b"];
	return `<div class="milestone"><span class="large-symbol" aria-hidden="true">✧</span><span class="mission-label">Deine Werkstatt ist bereit</span><h2 id="lesson-heading" tabindex="-1">Eine neue Entdeckung für dich und Milo.</h2><p>Du hast Stellenwerte ausprobiert und Bündel getauscht. Schau dir deine Schritte in der Elternansicht gemeinsam an.</p><p class="explanation-callout">${p.consumed.includes("mission-b") ? "Milo hat sich über euren Apfel gefreut." : "Ein Apfel wartet auf Milo. Du kannst ihn links mit ihm teilen."} Jetzt ist ein guter Moment zum Aufhören.</p><button data-action="practice-start" data-level="1">Weiterüben: Stufe 1</button><button data-action="practice-start" data-level="2">Weiterüben: Stufe 2</button><button class="primary" data-action="rest">Für heute fertig</button>${completed !== undefined && laterEligible(p, Date.now()) ? '<button data-action="later">Mit drei neuen Aufgaben nachschauen</button>' : '<p class="fine-print">Ab morgen kannst du mit drei neuen Aufgaben nachschauen, woran du dich erinnerst.</p>'}${feedback ? `<p role="status">${escapeHtml(feedback)}</p>` : ""}</div>`;
}

function parent(): string {
	const p = store.state;
	const observations = Object.entries(GOALS)
		.map(([key, title]) => {
			const attempts = p.attempts.filter((a) => a.goal === key);
			const success = [...attempts].reverse().find(independent);
			const helped = [...attempts].reverse().find((a) => a.helped && a.outcome);
			const last = success ?? helped ?? attempts.at(-1);
			const example = last ? attemptExample(last) : undefined;
			const later =
				success?.mode === "later" &&
				p.completed["mission-b"] !== undefined &&
				success.at - p.completed["mission-b"] >= 86_400_000;
			const label = later
				? "An einem späteren Tag geprüft"
				: success
					? "Neue Aufgabe selbstständig gelöst"
					: helped
						? "Mit Hilfe geübt"
						: attempts.length
							? last?.version === 1
								? "Frühere Vorschau-Übung"
								: "Ausprobiert"
							: "Noch offen";
			return `<article class="observation"><span class="observation-mark" aria-hidden="true">${success ? "✓" : helped ? "◇" : "○"}</span><div><span class="eyebrow">${label}</span><h3>${title}</h3><p>${last ? `${date(last.at)} · ${last.mode === "later" ? "Späterer Aufgabenversuch" : last.mode === "exit" ? "Neue Aufgabe" : "Übung in der Werkstatt"}${last.helped ? " · mit Tipp oder weiterem Versuch" : ""}` : "Dazu gibt es noch keinen Aufgabenversuch."}</p>${example ? `<p class="evidence-example">Beispiel: ${escapeHtml(example.prompt)} <span>${escapeHtml(describe(example.model))}</span></p>` : ""}</div></article>`;
		})
		.join("");
	return `<section class="parent-view"><p class="eyebrow">Kleine Schritte werden sichtbar</p><h1>Das hat dein Kind ausprobiert.</h1><p class="lead">Diese Beobachtungen stammen aus den Aufgaben auf diesem Gerät. Eine geübte Lektion ist noch kein Nachweis, dass alles sicher beherrscht wird.</p><div class="parent-grid"><div>${observations}</div><aside class="parent-tip"><span aria-hidden="true">♡</span><h2>Eine Frage für zu Hause</h2><p>„Kannst du mir zeigen, warum ein Hunderter genauso viel ist wie zehn Zehner?“</p><p>Lass dein Kind seinen Weg zeigen. Bausteine oder eine kleine Zeichnung reichen aus.</p><hr><h3>Der nächste kleine Schritt</h3><p>${p.step === "finished" ? "Jetzt mit frischen Zahlen weiterüben oder später noch einmal nachschauen. Stellenwerte bis 999 999 und der Übergang zur Million kommen in dieser Werkstatt vor." : "Die aktuelle Mission fortsetzen. Hinweise und Pausen sind jederzeit erlaubt."}</p></aside></div><p class="fine-print">Quelle: lokale Academy-Übungen · keine Schulnote, Diagnose oder Schullaufbahnempfehlung. ZAM-Wiederholungen werden getrennt in ZAM geführt.</p></section>`;
}

function settings(): string {
	return `<section class="settings"><p class="eyebrow">So passt die Insel zu dir</p><h1>Deine Einstellungen</h1><label class="toggle"><input id="sound-setting" type="checkbox" ${sound ? "checked" : ""}>Kurze Klänge bei Entdeckungen</label><p>Klänge starten ausgeschaltet. Das Lehrervideo hat eigene Bedienelemente.</p><label class="toggle"><input id="quiet-setting" type="checkbox" ${quiet ? "checked" : ""}>Weniger Bewegung</label><p>Auch die Bewegungseinstellung deines Geräts wird berücksichtigt.</p><label class="toggle"><input id="theme-setting" type="checkbox" ${theme === "dark" ? "checked" : ""}>Dunkle Ansicht</label><p>Ohne eigene Auswahl gilt die Farbeinstellung deines Geräts.</p><hr><h2>Dein Lernstand auf diesem Gerät</h2><p>${store.mode === "persistent" ? "Dein Lernstand wird in diesem Browser gespeichert. Das ist keine Sicherung auf einem anderen Gerät." : "Dein Lernstand kann gerade nicht dauerhaft gespeichert werden."}</p><button data-action="reset-question">Neu anfangen</button>${showReset ? '<div class="notice"><p>Deinen bisherigen Lernstand und Milos Werkstatt wirklich zurücksetzen?</p><button data-action="reset-confirm">Ja, neu anfangen</button><button data-action="reset-cancel">Lernstand behalten</button></div>' : ""}</section>`;
}

function recovery(): string {
	return `<main class="recovery"><h1>Dein gespeicherter Lernstand braucht Hilfe.</h1><p>Wir überschreiben ihn nicht. Du kannst ihn zur Wiederherstellung herunterladen oder bewusst neu anfangen.</p><button data-action="recover-export">Gespeicherte Daten herunterladen</button><button data-action="reset-question">Neu anfangen</button>${showReset ? '<p>Beim Neuanfang wird der bisherige Lernstand ersetzt.</p><button data-action="reset-confirm">Ja, neu anfangen</button><button data-action="reset-cancel">Abbrechen</button>' : ""}${feedback ? `<p role="status">${escapeHtml(feedback)}</p>` : ""}</main>`;
}

function render(): void {
	const active = document.activeElement as HTMLElement | null;
	const focusAction = active?.dataset.action;
	const focusCol = active?.dataset.col;
	const focusView = active?.dataset.view;
	document.documentElement.classList.toggle("quiet", quiet);
	document.documentElement.dataset.theme = theme;
	const p = store.state;
	if (answerKey !== taskKey(p)) {
		answerDraft = "";
		answerKey = taskKey(p);
	}
	app.innerHTML = `<header class="site-header"><a class="brand" href="#lesson=${LESSON_ID}"><span class="brand-logo" aria-hidden="true">z</span><span>ZAM <strong>Entdeckerinsel</strong><small>Mathematik · 4. Klasse · Bayern</small></span></a><span class="preview-label">Werkstatt-Vorschau</span></header>
    <nav class="main-nav" aria-label="Hauptnavigation"><div>${(["child", "parent", "settings"] as const).map((v) => `<button data-action="view" data-view="${v}" aria-current="${view === v ? "page" : "false"}">${v === "child" ? "Mein Abenteuer" : v === "parent" ? "Für Eltern" : "Einstellungen"}</button>`).join("")}</div><button class="sound-toggle" data-action="sound" aria-pressed="${sound}" aria-label="Entdeckungsklänge ${sound ? "ausschalten" : "einschalten"}">${sound ? "♪ Klang an" : "♪ Klang aus"}</button></nav>
    ${notices()}${store.mode === "recovery" ? recovery() : view === "parent" ? `<main>${parent()}</main>` : view === "settings" ? `<main>${settings()}</main>` : `<main><div class="welcome-heading"><div><p class="eyebrow">Ein kleiner Schritt. Eine neue Entdeckung.</p><h1>Willkommen im Zahlenwald.</h1></div><span class="session-pill">Du bestimmst dein Tempo</span></div><div class="adventure-layout">${companion()}<div class="learning-column"><section class="lesson-card" aria-label="Milos Stellenwert-Lektion" ${busy ? 'aria-busy="true"' : ""}>${lesson()}</section>${teacherPanel()}<div class="island-route" aria-label="Deine Lernwelt"><span class="current">♧ Zahlenwald<small>Stellenwerte entdecken</small></span><span>◇ Formenbucht<small>folgt später</small></span><span>☀ Messmarkt<small>folgt später</small></span><span>✧ Zufallsgarten<small>folgt später</small></span></div></div></div><p class="progress-note">${p.rewards.length} von 2 Missionen geübt · Pausen sind immer willkommen.</p></main>`}
    <footer><span>Lernen. Entdecken. Gemeinsam wachsen.</span><span>Stellenwert-Starter · lokal auf deinem Gerät</span></footer>`;
	app.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
		button.addEventListener("click", () => {
			void act(button).catch((error) => {
				feedback =
					error instanceof Error
						? error.message
						: "Das hat gerade nicht geklappt. Versuche es bitte noch einmal.";
				busy = false;
				render();
			});
		});
	});
	app
		.querySelector<HTMLInputElement>("#answer")
		?.addEventListener("keydown", (event) => {
			if (event.key === "Enter")
				app.querySelector<HTMLButtonElement>('[data-action="check"]')?.click();
		});
	app
		.querySelector<HTMLInputElement>("#answer")
		?.addEventListener("input", (event) => {
			answerDraft = (event.target as HTMLInputElement).value;
		});
	app
		.querySelector<HTMLInputElement>("#sound-setting")
		?.addEventListener("change", (event) => {
			sound = (event.target as HTMLInputElement).checked;
			if (sound) chime();
			render();
		});
	app
		.querySelector<HTMLInputElement>("#theme-setting")
		?.addEventListener("change", (event) => {
			theme = (event.target as HTMLInputElement).checked ? "dark" : "light";
			try {
				localStorage.setItem("mathe4-theme", theme);
			} catch {}
			render();
		});
	app
		.querySelector<HTMLInputElement>("#quiet-setting")
		?.addEventListener("change", (event) => {
			quiet = (event.target as HTMLInputElement).checked;
			try {
				localStorage.setItem("mathe4-quiet", String(quiet));
			} catch {}
			render();
		});
	if (focusAction)
		app
			.querySelector<HTMLElement>(
				`[data-action="${focusAction}"]${focusCol ? `[data-col="${focusCol}"]` : ""}${focusView ? `[data-view="${focusView}"]` : ""}`,
			)
			?.focus({ preventScroll: true });
}

function move(p: Progress): void {
	nextStep(p);
	if (p.step === "mission-a-end") grant(p, "mission-a", Date.now());
	if (p.step === "finished") grant(p, "mission-b", Date.now());
}

async function act(button: HTMLButtonElement): Promise<void> {
	const action = button.dataset.action;
	if (!action || busy) return;
	if (action === "view") {
		view = button.dataset.view as typeof view;
		feedback = "";
		render();
		return;
	}
	if (action === "sound") {
		sound = !sound;
		if (sound) chime();
		render();
		return;
	}
	if (action === "reset-question" || action === "reset-cancel") {
		showReset = action === "reset-question";
		render();
		return;
	}
	if (action === "recover-export") {
		const url = URL.createObjectURL(
			new Blob([JSON.stringify(store.raw, null, 2)], {
				type: "application/json",
			}),
		);
		const link = document.createElement("a");
		link.href = url;
		link.download = "milos-lernstand-wiederherstellung.json";
		link.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
		return;
	}
	if (action === "reset-confirm") {
		await store.freshStart();
		eating = false;
		celebrating = false;
		encouraging = false;
		hello = false;
		answerDraft = "";
		answerKey = "";
		showReset = false;
		feedback = "";
		view = "child";
		render();
		return;
	}
	if (action === "video") {
		const host = app.querySelector<HTMLElement>("#teacher-player");
		if (host) loadTeacherPlayer(host);
		return;
	}
	if (action === "hello") {
		hello = true;
		encouraging = false;
		eating = false;
		celebrating = false;
		if (store.state.resting)
			await store.update((p) => {
				p.resting = false;
			});
		render();
		return;
	}
	const snapshotStep = store.state.step;
	const snapshotKey = taskKey();
	const task = currentTask();
	const explanationShown = feedback === task?.explanation;
	const input = app.querySelector<HTMLInputElement>("#answer")?.value ?? "";
	answerDraft = input;
	busy = true;
	if (action !== "hint" && action !== "solution") feedback = "";
	try {
		await store.update((p) => {
			if (action === "rest") {
				p.resting = !p.resting;
				return;
			}
			if (action === "snack") {
				if (
					p.rewards.includes("mission-b") &&
					!p.consumed.includes("mission-b")
				) {
					p.consumed.push("mission-b");
					p.resting = false;
					eating = true;
				}
				return;
			}
			if (p.step !== snapshotStep || taskKey(p) !== snapshotKey || p.resting)
				return;
			if (action === "practice-start") {
				if (p.step !== "finished") return;
				p.practice = newPractice(
					button.dataset.level === "2" ? 2 : 1,
					crypto.getRandomValues(new Uint32Array(1))[0],
					null,
				);
				p.workspace = practiceTask(p.practice.level, p.practice.seed, 0).model;
				p.undo = [];
				return;
			}
			if (action === "practice-stop" && p.practice?.requiredCorrect === null) {
				p.practice = null;
				return;
			}
			if (action === "advance-task") {
				if (!p.attempts.some((a) => a.key === snapshotKey && a.outcome)) return;
				if (p.practice) {
					p.practice.correct += 1;
					p.practice.index += 1;
					if (
						p.practice.requiredCorrect !== null &&
						p.practice.correct >= p.practice.requiredCorrect
					) {
						p.practice = null;
						move(p);
					} else
						p.workspace = practiceTask(
							p.practice.level,
							p.practice.seed,
							p.practice.index,
						).model;
					p.undo = [];
				} else if (p.later) {
					if (p.later.index === 2) p.later = null;
					else p.later.index += 1;
				} else move(p);
				if (p.step === "mission-a-end" || p.step === "finished") {
					celebrating = true;
					chime();
				}
				return;
			}
			if (action === "later") {
				if (laterEligible(p, Date.now())) {
					p.later = {
						id: ulid(),
						seed: recallSeed(p.seed),
						index: 0,
						at: Date.now(),
					};
				}
				return;
			}
			if (action === "next" || action === "explained") {
				if (action === "explained") p.explained = true;
				move(p);
				return;
			}
			if (action === "skip-entry") {
				p.step = "learn-a";
				p.workspace = [0, 0, 0, 0];
				p.undo = [];
				return;
			}
			if (!task || p.attempts.some((a) => a.key === snapshotKey && a.outcome))
				return;
			if (action === "hint" || action === "solution") {
				if (!p.helped.includes(snapshotKey)) p.helped.push(snapshotKey);
				p.helped = p.helped.slice(-1000);
				encouraging = true;
				feedback = action === "hint" ? task.hint : task.explanation;
				return;
			}
			if (action === "task-reset") {
				p.workspace = [...task.model];
				p.undo = [];
				return;
			}
			if (action === "undo") {
				const previous = p.undo.pop();
				if (previous) p.workspace = previous;
				return;
			}
			if (["increase", "decrease", "bundle", "unbundle"].includes(action)) {
				const col = Number(button.dataset.col) as Column;
				if (!WEIGHTS.some((_, i) => i === col)) return;
				let changed: Counts | null;
				if (action === "bundle" || action === "unbundle")
					changed = exchange(p.workspace, col, action);
				else {
					changed = [...p.workspace];
					changed[col] += action === "increase" ? 1 : -1;
					if (task.family === "build" && changed[col] > 9) return;
					if (!validCounts(changed)) return;
				}
				if (changed) {
					p.undo.push([...p.workspace]);
					p.undo = p.undo.slice(-100);
					p.workspace = changed;
				}
				return;
			}
			if (["check", "choice", "worked-continue"].includes(action)) {
				const entered =
					action === "choice"
						? Number(button.dataset.value)
						: parseInteger(input);
				if (
					action === "worked-continue" &&
					(!p.helped.includes(snapshotKey) || !explanationShown)
				)
					return;
				const correct =
					action === "worked-continue" ||
					correctTask(task, entered, p.workspace);
				if (
					action === "worked-continue" &&
					(task.target || task.family === "build")
				)
					p.workspace = task.target ? [...task.target] : digits(task.answer);
				const mode = p.later
					? "later"
					: p.practice
						? p.practice.level === 1
							? "guided"
							: "exit"
						: p.step.startsWith("entry-")
							? "entry"
							: p.step.startsWith("exit-") || p.step === "digit"
								? "exit"
								: "guided";
				recordAttempt(p, task, snapshotKey, correct, Date.now(), mode);
				encouraging = !correct;
				feedback = correct
					? task.explanation
					: mistakeHint(task, entered, p.workspace);
			}
		});
	} finally {
		busy = false;
		render();
		if (store.state.step !== snapshotStep || taskKey() !== snapshotKey)
			app.querySelector<HTMLElement>("#lesson-heading")?.focus();
	}
}

store.onChange = render;
render();
await store.open();
hello = store.state.step !== "welcome";
render();
// Keep a direct lesson link useful without resetting a learner's progress.
window.addEventListener("hashchange", () => {
	view = "child";
	render();
});

// Referencing the stable sequence here catches accidental missing journey steps during authoring.
if (!STEPS.includes(store.state.step))
	throw new Error("Diese Lektionsseite ist nicht verfügbar.");
