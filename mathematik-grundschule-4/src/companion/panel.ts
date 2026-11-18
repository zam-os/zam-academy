import { format } from "../math/place-value";
import { jumpPrompt, type Crossing } from "./crossing";
import { type Mood, island } from "./render";
import type { World } from "../course/worlds";

export interface CompanionState {
	mood: Mood;
	world: World;
	rewards: string[];
	consumed: string[];
	game: Crossing | null;
	retry: boolean;
	waves: number;
	sixInTens: boolean;
	welcome: boolean;
}

const greetings = [
	"Da bist du ja! Ich winke mit meiner größten Pfote.",
	"Ein Winken zurück! Meine Ohren wippen schon mit.",
	"Schlag ein! Meine Pfote ist bereit.",
];
const replies: Record<Exclude<Mood, "welcoming" | "exploring">, string> = {
	curious: "Ich bin Milo. Wink mir zu oder komm mit auf einen Zahlensprung!",
	encouraging:
		"Wir haben Zeit. Lass uns den nächsten Schritt zusammen anschauen.",
	correct: "Da passt alles zusammen. Pfote drauf!",
	celebrating:
		"Wir haben eine Mission geschafft! Schau, wie sich unsere Insel verändert hat.",
	resting:
		"Ich döse ein bisschen. Wir machen genau hier weiter, wenn du magst.",
	"high-five": "Klatsch! Das war unser letzter Sprung. Danke für die Pfote!",
	snack: "Knack! Am liebsten mag ich Äpfel, die wir teilen.",
};
export function miloMessage(state: CompanionState): string {
	if (state.game) return jumpPrompt(state.game, state.retry);
	if (state.mood === "exploring")
		return state.sixInTens
			? "Jetzt steht hier 360! Die 6 zählt sechs Zehner. Das sind 60."
			: "Wieder 306! Die 6 zählt jetzt sechs Einer. Das sind 6.";
	if (state.mood === "curious" && !state.welcome)
		return "Ich schau dir beim Rechnen zu. Wenn du magst, machen wir zwischendurch einen Zahlensprung.";
	return state.mood === "welcoming"
		? greetings[(Math.max(1, state.waves) - 1) % greetings.length]
		: replies[state.mood];
}
export function companionPanel(state: CompanionState): string {
	const { mood, world, rewards, consumed, game } = state;
	const finished = game?.step === 3;
	const scene = island(
		mood,
		world,
		rewards.includes("mission-a"),
		rewards.includes("mission-b"),
		game,
	);
	return `${!game && mood !== "resting" ? `<button class="milo-scene" data-action="hello" aria-label="Milo zuwinken">${scene}<span aria-hidden="true">✋ Zuwinken</span></button>` : scene}
	<div class="milo-panel-copy"><div class="milo-dialogue"><strong>${game ? "Milos Sprungspiel" : "Milo"}</strong><p id="milo-message">${miloMessage(state)}</p></div>
	<div class="milo-actions">${
		game
			? `${
					finished
						? '<button data-action="hello">✋ Einschlagen</button><button data-action="play">Noch eine Runde</button>'
						: game.choices[game.step]
								.map(
									(choice) =>
										`<button class="stone-choice" data-action="jump" data-value="${choice}" aria-label="Zur ${format(choice)} springen">${format(choice)}</button>`,
								)
								.join("")
				}<button class="milo-link" data-action="leave-game">Spiel schließen</button>`
			: `${mood !== "resting" ? '<button data-action="play"><span aria-hidden="true">↗</span> Sprungspiel</button>' : ""}${rewards.includes("mission-b") && !consumed.includes("mission-b") ? '<button data-action="snack">Apfel teilen</button>' : ""}<button class="milo-link" data-action="rest">${mood === "resting" ? "Milo wecken" : "Pause machen"}</button>`
	}</div></div>`;
}
