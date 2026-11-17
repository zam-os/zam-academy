import { describe, expect, it } from "vitest";
import {
	jumpChoices,
	jumpPrompt,
	newCrossing,
	stoneValue,
} from "../src/companion/crossing";
import { companionPanel, type CompanionState } from "../src/companion/panel";
import { COURSE_LINKS } from "../src/course/catalog";
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
	it("offers the next landing once per jump and reveals the number on arrival", () => {
		for (let round = 0; round < 3; round++) {
			const game = newCrossing(round);
			for (let step = 0; step < 3; step++) {
				game.step = step;
				const correct = stoneValue(game, step + 1);
				expect(jumpChoices(game).filter((n) => n === correct)).toHaveLength(1);
				expect(jumpChoices(game)).toHaveLength(2);
				expect(jumpPrompt(game, true)).toContain(String(stoneValue(game)));
				expect(companionPanel({ ...start, game })).toContain(">?</text>");
			}
			game.step = 3;
			const finish = companionPanel({ ...start, game });
			expect(finish).toContain(">✋ Einschlagen</button>");
			expect(finish).not.toContain('data-action="jump"');
			expect(finish).toContain(`>${stoneValue(game)}</text>`);
		}
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
