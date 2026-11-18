import { describe, expect, it } from "vitest";
import { jumpPrompt, newCrossing, stoneValue } from "../src/companion/crossing";
import { companionPanel, type CompanionState } from "../src/companion/panel";
import { COURSE_LINKS } from "../src/course/catalog";
import { format, MAX_NUMBER } from "../src/math/place-value";
import { random } from "../src/practice/tasks";
import { WORLDS } from "../src/course/worlds";
import { placeValuePreview } from "../src/ui/board";
import { islandMap } from "../src/ui/island-map";

const start: CompanionState = {
	mood: "curious",
	world: "forest",
	rewards: [],
	consumed: [],
	game: null,
	retry: false,
	waves: 0,
	sixInTens: false,
	welcome: true,
};

describe("Discovery Island entry", () => {
	it("reveals each published lesson once across the five map destinations", () => {
		const welcome = COURSE_LINKS[0].id;
		const links = WORLDS.flatMap(({ id }) =>
			[
				...islandMap(welcome, "forest", id, true, true).matchAll(
					/href="#lesson=([^"]+)"/g,
				),
			].map(([, lesson]) => lesson),
		);
		expect(links.sort()).toEqual(
			COURSE_LINKS.map((lesson) => lesson.id).sort(),
		);
		expect(islandMap(welcome, "forest", "forest", false, true)).not.toContain(
			'href="#lesson=',
		);
	});
	it("marks the current location separately from mission completion", () => {
		const id = COURSE_LINKS[0].id;
		const map = islandMap(id, "forest", "forest", true, true);
		expect(map).toContain(`href="#lesson=${id}" aria-current="page"`);
		expect(map.match(/Du bist hier/g)).toHaveLength(1);
		expect(map).not.toContain("✓");
		expect(islandMap(id, "forest", "measure", true, true)).not.toContain(
			"Du bist hier",
		);
	});
	it("shows the quantities when the six moves and leaves the empty column clear", () => {
		for (const tens of [true, false]) {
			const html = placeValuePreview(tens);
			expect(html).toContain(
				tens
					? "360: 3 Hunderter, 6 Zehner, 0 Einer"
					: "306: 3 Hunderter, 0 Zehner, 6 Einer",
			);
			expect(html.match(/class="ten-rod"/g)?.length ?? 0).toBe(tens ? 6 : 0);
		}
	});
	it("generates new crossings in both directions with plausible choices in range", () => {
		const starts = new Set<number>();
		const correctSlots = new Set<number>();
		const distractorSizes = new Set<string>();
		for (let round = 0; round < 150; round++) {
			const game = newCrossing(round, random(round));
			starts.add(game.start);
			const end = stoneValue(game, 3);
			expect(Math.floor(game.start / 10_000)).not.toBe(
				Math.floor(end / 10_000),
			);
			expect(Math.sign(game.stride)).toBe(round % 2 === 0 ? 1 : -1);
			expect(Math.abs(game.stride)).toBeGreaterThanOrEqual(100);
			expect(jumpPrompt(game, false)).toContain(
				game.stride < 0 ? "zurück" : "weiter",
			);
			for (let step = 0; step < 3; step++) {
				const here = stoneValue(game, step);
				const next = stoneValue(game, step + 1);
				const choices = game.choices[step];
				expect(choices).toHaveLength(2);
				expect(new Set(choices).size).toBe(2);
				expect(choices).toContain(next);
				correctSlots.add(choices.indexOf(next));
				const other = choices.find((n) => n !== next)!;
				distractorSizes.add(
					Math.abs(other - here) > Math.abs(game.stride) ? "larger" : "smaller",
				);
				for (const choice of choices) {
					expect(choice).toBeGreaterThanOrEqual(0);
					expect(choice).toBeLessThanOrEqual(MAX_NUMBER);
					expect(choice % 10).toBe(next % 10);
					expect(Math.sign(choice - here)).toBe(Math.sign(game.stride));
				}
			}
		}
		expect(starts.size).toBeGreaterThan(60);
		expect(correctSlots.size).toBe(2);
		expect(distractorSizes.size).toBe(2);
	});
	it("groups spoken and visible numbers, including one million, and keeps raw button values", () => {
		// Start one jump below 990,000 and finish at one million.
		const draws = [0.999, 0];
		const game = newCrossing(2, () => draws.shift() ?? 0.5);
		for (let step = 0; step < 3; step++) {
			game.step = step;
			const here = format(stoneValue(game));
			const html = companionPanel({ ...start, game });
			expect(jumpPrompt(game, false)).toContain(format(Math.abs(game.stride)));
			expect(jumpPrompt(game, true)).toContain(here);
			expect(html).toContain(`mit der Zahl ${here}.`);
			expect(html).toContain(`>${here}</text>`);
			expect(html).toContain(">?</text>");
			for (const choice of game.choices[step])
				expect(html).toContain(
					`data-value="${choice}" aria-label="Zur ${format(choice)} springen">${format(choice)}</button>`,
				);
		}
		game.step = 3;
		const finish = companionPanel({ ...start, game });
		expect(finish).toContain(`>${format(stoneValue(game))}</text>`);
		expect(finish).toContain(">✋ Einschlagen</button>");
		expect(finish).not.toContain('data-action="jump"');
		expect(stoneValue(game)).toBe(MAX_NUMBER);
		expect(finish).toContain(">1\u202f000\u202f000</text>");
		expect(jumpPrompt(game, false)).toContain("zur 1\u202f000\u202f000");
	});
	it("shows care actions only when the child can use them", () => {
		expect(companionPanel(start)).not.toContain('data-action="snack"');
		expect(companionPanel({ ...start, rewards: ["mission-b"] })).toContain(
			'data-action="snack"',
		);
		expect(
			companionPanel({
				...start,
				rewards: ["mission-b"],
				consumed: ["mission-b"],
			}),
		).not.toContain('data-action="snack"');
		expect(companionPanel({ ...start, mood: "resting" })).not.toMatch(
			/data-action="(?:hello|play)"/,
		);
	});
});
