import { format, MAX_NUMBER } from "../math/place-value";

export interface Crossing {
	step: number;
	stride: number;
	start: number;
	choices: number[][];
}

const distances = [100, 250, 5_000, 1_000, 2_500];

export function newCrossing(round: number, random = Math.random): Crossing {
	const distance = distances[round % distances.length];
	const stride = round % 2 === 0 ? distance : -distance;
	// Leave room for two jumps on either side of a ten-thousand boundary.
	const boundary = (10 + Math.floor(random() * 90)) * 10_000;
	const start = boundary - (1 + Math.floor(random() * 2)) * stride;
	const choices = Array.from({ length: 3 }, (_, step) => {
		const here = start + step * stride;
		const next = here + stride;
		// For 250, dropping the hundreds gives 50. Both stones still end in zero.
		const shorter = here + (distance === 250 ? stride / 5 : stride / 10);
		const longer = here + stride * 10;
		const other =
			longer <= MAX_NUMBER && longer >= 0 && random() < 0.5 ? longer : shorter;
		return random() < 0.5 ? [next, other] : [other, next];
	});
	return { start, stride, step: 0, choices };
}

export function stoneValue(game: Crossing, step = game.step): number {
	return game.start + step * game.stride;
}

export function jumpPrompt(game: Crossing, retry: boolean): string {
	const here = format(stoneValue(game));
	if (game.step === 3)
		return `Drüben! Von ${format(game.start)} ging’s über ${format(stoneValue(game, 1))} und ${format(stoneValue(game, 2))} zur ${here}. Schlag ein!`;
	const step = `${format(Math.abs(game.stride))} ${game.stride < 0 ? "zurück" : "weiter"}`;
	if (retry) return `Ich stehe noch auf ${here}. Zähle von hier ${step}.`;
	return `${game.step === 0 ? `Komm mit über den Bach! Ich starte auf ${here}.` : `Hui, auf der ${here} gelandet!`} Ich springe immer ${step}. Welche Zahl kommt jetzt?`;
}
