// Tinto's panel beside a lesson: his little underwater writing room, what he
// says and how he looks. Everything here is plain data and HTML; main.ts
// decides when Tinto reacts. Tinto never judges the child: a wrong answer
// makes him scratch his head and encourage, never frown.
import { esc } from "./format";
import { type Mood, tinto } from "./tinto";

/** A short movement Tinto makes once; the calm setting suppresses it. */
export type Motion = "" | "jump" | "wave" | "scratch" | "spin" | "write";

export type TintoEvent =
	| "learn"
	| "example"
	| "merke"
	| "terms"
	| "learn-done"
	| "step-quiz"
	| "step-workshop"
	| "step-practice"
	| "step-desk"
	| "quiz-right"
	| "quiz-star"
	| "quiz-wrong"
	| "goal"
	| "workshop-star"
	| "task-right"
	| "task-wrong"
	| "task-reveal"
	| "level1-star"
	| "level2-star"
	| "sticker"
	| "wave"
	| "rest"
	| "wake"
	| "game-start"
	| "game-right"
	| "game-done";

export interface Reaction {
	mood: Mood;
	line: string;
	motion: Motion;
	/** Worth a toast when the panel is out of sight (stars, goals, mistakes). */
	important: boolean;
}

const REACTIONS: Record<TintoEvent, { mood: Mood; motion: Motion; important?: boolean; lines: string[] }> = {
	learn: {
		mood: "happy",
		motion: "",
		lines: ["Lies in Ruhe. Mit „Weiter lesen“ zeige ich dir das nächste Stück."],
	},
	example: { mood: "think", motion: "", lines: ["Schau, so prüfe ich das!", "Hier ist ein Beispiel. Lies es Zeile für Zeile."] },
	merke: { mood: "happy", motion: "write", lines: ["Das schreibe ich dir auf. Das ist das Wichtigste!"] },
	terms: { mood: "think", motion: "", lines: ["Kannst du die Begriffe erklären? Erst überlegen, dann umdrehen!"] },
	"learn-done": { mood: "happy", motion: "", lines: ["Alles gelesen! Weiter geht es mit dem Schnellcheck."] },
	"step-quiz": { mood: "think", motion: "", lines: ["Kurzer Check: Weißt du es schon?"] },
	"step-workshop": { mood: "think", motion: "", lines: ["Jetzt wird ausprobiert! Drei Ziele warten auf dich."] },
	"step-practice": { mood: "happy", motion: "", lines: ["Jetzt üben wir. Drei richtige Aufgaben pro Stufe bringen einen Stern."] },
	"step-desk": { mood: "happy", motion: "write", lines: ["Hier schreibst du ganz frei. Ich lese nicht mit."] },
	"quiz-right": { mood: "cheer", motion: "jump", lines: ["Richtig! Das sitzt.", "Stimmt genau!"] },
	"quiz-star": {
		mood: "cheer",
		motion: "jump",
		important: true,
		lines: ["Richtig! Der Stern für den Schnellcheck gehört dir. ⭐"],
	},
	"quiz-wrong": {
		mood: "encourage",
		motion: "scratch",
		important: true,
		lines: [
			"Kein Problem! Ich kratze mich auch oft am Kopf. Versuch es noch einmal.",
			"Fast! Denk an den Merksatz aus „Verstehen“.",
		],
	},
	goal: {
		mood: "cheer",
		motion: "jump",
		important: true,
		lines: ["Ziel erreicht! 🎯 Alle meine Arme klatschen.", "Ja! Wieder ein Ziel geschafft. 🎯", "Super, das nächste Ziel ist erledigt! 🎯"],
	},
	"workshop-star": {
		mood: "cheer",
		motion: "wave",
		important: true,
		lines: ["Alle drei Ziele geschafft! Der Werkstatt-Stern gehört dir. ⭐"],
	},
	"task-right": {
		mood: "cheer",
		motion: "jump",
		lines: ["Richtig!", "Genau! Ich werde ganz rosa vor Freude.", "Stimmt! Weiter so.", "Klasse gemacht!"],
	},
	"task-wrong": {
		mood: "encourage",
		motion: "scratch",
		lines: [
			"Noch nicht. Schau dir den Tipp an, ich warte.",
			"Fast! Lies die Aufgabe noch einmal genau.",
			"Kein Problem, Fehler helfen beim Lernen. Probier es noch einmal.",
		],
	},
	"task-reveal": { mood: "encourage", motion: "", lines: ["Schau dir die Lösung in Ruhe an. Die nächste schaffst du!"] },
	"level1-star": { mood: "cheer", motion: "wave", important: true, lines: ["Stufe 1 geschafft! Ein Stern für dich. ⭐"] },
	"level2-star": { mood: "cheer", motion: "wave", important: true, lines: ["Probe-Training geschafft! Ein Stern für dich. ⭐"] },
	sticker: { mood: "cheer", motion: "spin", lines: ["Alle vier Sterne! Ich klebe dir einen Sticker ins Heft."] },
	wave: {
		mood: "cheer",
		motion: "wave",
		lines: ["Hallo! Ich winke dir mit allen acht Armen zu.", "Noch mal? Acht Arme, achtmal Winken!", "Hihi, das kitzelt!", "Schön, dass du da bist!"],
	},
	rest: { mood: "sleep", motion: "", lines: ["Ich mache ein Nickerchen im Tintenfass. Tipp auf mich, dann wache ich auf."] },
	wake: { mood: "happy", motion: "jump", lines: ["Ausgeschlafen! Weiter geht's."] },
	"game-start": { mood: "happy", motion: "wave", lines: ["Ich halte acht Wörter, in jedem Arm eines. Hilfst du mir beim Sortieren?"] },
	"game-right": {
		mood: "cheer",
		motion: "jump",
		lines: ["Plumps, richtig im Korb!", "Genau! Wieder ein Arm frei.", "Richtig! Weiter so.", "Stimmt! Das ging schnell."],
	},
	"game-done": { mood: "cheer", motion: "spin", lines: ["Alle acht Arme sind frei! Danke fürs Sortieren."] },
};

export const EVENTS = Object.keys(REACTIONS) as TintoEvent[];

/** What Tinto does the `n`-th time (from 0) an event happens; lines take turns. */
export function reaction(event: TintoEvent, n = 0): Reaction {
	const r = REACTIONS[event];
	return {
		mood: r.mood,
		motion: r.motion,
		important: r.important ?? false,
		line: r.lines[((n % r.lines.length) + r.lines.length) % r.lines.length],
	};
}

/** Tinto's writing room under water: light, sand, seaweed, bubbles, a fish and his inkwell. */
export function sceneArt(): string {
	const bubbles = [
		[42, 150, 3.5, 0],
		[58, 170, 2.5, 1.6],
		[248, 160, 4, 0.8],
		[262, 175, 2.5, 2.6],
		[150, 180, 3, 3.4],
	]
		.map(([x, y, r, d]) => `<circle cx="${x}" cy="${y}" r="${r}" class="sc-bubble" style="animation-delay:${d}s"/>`)
		.join("");
	return `<svg class="scene-art" viewBox="0 0 300 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
<defs><linearGradient id="tinto-sea" x2="0" y2="1"><stop offset="0" class="sc-top"/><stop offset="1" class="sc-deep"/></linearGradient></defs>
<rect width="300" height="190" fill="url(#tinto-sea)"/>
<path d="M60 0h26L52 150H30Zm90 0h20l-24 150h-18Zm80 0h22l-6 150h-20Z" class="sc-ray"/>
<g class="sc-fish" transform="translate(70 52)"><path d="M0 0q10 -8 20 0q-10 8 -20 0zm20 0l8 -6v12z" class="sc-fish-body"/><circle cx="5" cy="-1" r="1.4" class="sc-fish-eye"/></g>
<path d="M0 162q40 -14 90 -6t110 -2t100 4v32H0Z" class="sc-sand"/>
<path d="M0 172q60 -8 130 -2t170 -4v24H0Z" class="sc-sand-front"/>
<g class="sc-weed sc-weed-left"><path d="M18 172q-10 -24 4 -44t-2 -44" /><path d="M30 174q8 -20 -2 -36t6 -30"/></g>
<g class="sc-weed sc-weed-right"><path d="M280 172q10 -24 -4 -42t4 -40"/></g>
<g class="sc-desk"><path d="M206 168q4 -16 34 -18t40 14Z" class="sc-rock"/><path d="M220 138h20l2 12h-24Z" class="sc-ink"/><rect x="223" y="132" width="14" height="7" rx="2" class="sc-ink-neck"/><path d="M248 146l22 -4 2 8 -22 4Z" class="sc-paper"/><path d="M252 148l14 -2.5M253 151l10 -2" class="sc-paper-lines"/></g>
${bubbles}
</svg>`;
}

export interface CompanionState {
	mood: Mood;
	line: string;
	resting: boolean;
}

/** The panel; the main click handler serves its buttons. */
export function companionHtml(state: CompanionState): string {
	return `<aside class="companion" id="companion" aria-label="Tinto, dein Begleiter">
	<div class="scene${state.resting ? " resting" : ""}">${sceneArt()}<button type="button" class="tinto-button" data-action="${state.resting ? "wake" : "wave"}" aria-label="${state.resting ? "Tinto wecken" : "Tinto zuwinken"}">${tinto(state.mood)}</button></div>
	<div class="companion-talk"><p class="companion-name">Tinto</p><p id="tinto-message" class="companion-line" aria-live="polite">${esc(state.line)}</p></div>
	<div class="companion-actions"><button type="button" class="pill" data-action="wave">👋 Zuwinken</button>${restButton(state.resting)}<button type="button" class="pill" data-action="view" data-target="spiel">🎲 Spiel</button></div>
</aside>`;
}

export function restButton(resting: boolean): string {
	return `<button type="button" class="pill" id="tinto-rest" data-action="${resting ? "wake" : "rest"}">${resting ? "☀️ Tinto wecken" : "💤 Pause"}</button>`;
}
