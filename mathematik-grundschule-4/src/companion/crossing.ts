export interface Crossing {
	step: number;
	stride: number;
	start: number;
}

const streams = [
	{ start: 0, stride: 2 },
	{ start: 90, stride: 5 },
	{ start: 980, stride: 10 },
];

export function newCrossing(round: number): Crossing {
	return { ...streams[round % streams.length], step: 0 };
}

export function stoneValue(game: Crossing, step = game.step): number {
	return game.start + step * game.stride;
}

export function jumpChoices(game: Crossing): number[] {
	const next = stoneValue(game, game.step + 1);
	const other = next + (game.step % 2 === 0 ? 1 : -1);
	return (game.step + game.stride) % 2 === 0 ? [other, next] : [next, other];
}

export function jumpPrompt(game: Crossing, retry: boolean): string {
	const here = stoneValue(game);
	if (game.step === 3)
		return `Drüben! Von ${game.start} ging’s über ${stoneValue(game, 1)} und ${stoneValue(game, 2)} zur ${here}. Schlag ein!`;
	if (retry)
		return `Ich stehe noch auf ${here}. Zähle von hier ${game.stride} weiter.`;
	return `${game.step === 0 ? `Komm mit über den Bach! Ich starte auf ${here}.` : `Hui, auf der ${here} gelandet!`} Ich springe immer ${game.stride} weiter. Welche Zahl kommt jetzt?`;
}
