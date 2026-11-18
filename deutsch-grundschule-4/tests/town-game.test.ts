// The town map (Stadtplan) and Tinto's game "Acht Arme, acht Wörter".
import { describe, expect, it } from "vitest";
import { LESSONS, STAGES } from "../src/curriculum";
import { ARMS, BASKETS, drop, finished, GAME_WORDS, gameHtml, hint, newRound, SLOTS, tentacle } from "../src/game";
import { tinto } from "../src/tinto";
import { alongRoad, fountainOn, PLACES, ROAD, type TownState, townArt, townHtml, VIEW } from "../src/town";
import official from "./fixtures/official-grundwortschatz.json";

/** A small seeded generator, so that every run sees the same rounds. */
function seeded(seed: number): () => number {
	let a = seed;
	return () => {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const town = (done: number[] = []): TownState => ({
	districts: STAGES.map((s) => {
		const lessons = LESSONS.filter((l) => l.stage === s.id);
		return { id: s.id, done: lessons.filter((l) => done.includes(LESSONS.indexOf(l))).length, total: lessons.length };
	}),
	lanterns: LESSONS.map((_, i) => done.includes(i)),
});

describe("Stadtplan", () => {
	const inside = ([x, y]: [number, number]) => x >= 0 && x <= VIEW.width && y >= 0 && y <= VIEW.height;

	it("puts every place, the road and all lanterns inside the map", () => {
		expect(Object.keys(PLACES).sort()).toEqual(STAGES.map((s) => s.id).sort());
		for (const p of Object.values(PLACES)) expect(inside([p.x, p.y])).toBe(true);
		for (const p of ROAD) expect(inside(p)).toBe(true);
		const lamps = alongRoad(LESSONS.length);
		expect(lamps).toHaveLength(45);
		for (const p of lamps) expect(inside(p), String(p)).toBe(true);
		expect(new Set(lamps.map((p) => p.join(","))).size).toBe(45);
	});

	it("lights one lantern per sticker and nothing else at the start", () => {
		const empty = townArt(town());
		expect(empty.match(/class="lantern"/g)).toHaveLength(45);
		expect(empty).not.toContain("lantern lit");
		expect(empty).not.toContain(" started");
		expect(empty).not.toContain('class="flag"');
		expect(empty).not.toContain('class="jets"');
		const two = townArt(town([0, 12]));
		expect(two.match(/class="lantern lit"/g)).toHaveLength(2);
		expect(two).toContain("place-werkstatt started");
		expect(two).toContain("place-bahnhof started");
	});

	it("hoists a flag on a finished place and starts the fountain", () => {
		const werkstatt = LESSONS.map((l, i) => (l.stage === "werkstatt" ? i : -1)).filter((i) => i >= 0);
		const state = town(werkstatt);
		expect(fountainOn(state)).toBe(true);
		expect(fountainOn(town(werkstatt.slice(1)))).toBe(false);
		const art = townArt(state);
		expect(art.match(/class="flag"/g)).toHaveLength(1);
		expect(art).toContain("place-werkstatt started complete");
		expect(art).toContain('class="jets"');
	});

	it("offers each place as a button with its progress, and Tinto where the child looks", () => {
		const page = townHtml(town([0]), STAGES, "detektiv", tinto("happy"));
		expect(page.match(/data-action="district"/g)).toHaveLength(STAGES.length);
		expect(page.match(/aria-pressed="true"/g)).toHaveLength(1);
		expect(page).toContain('data-stage="detektiv" aria-pressed="true"');
		expect(page).toContain('aria-label="Wörterwerkstatt, 1 von 9 Stickern"');
		expect(page).toContain('aria-label="Wörterschatz, 0 von 3 Stickern"');
		expect(page).toContain('data-target="spiel"');
		expect(page).not.toMatch(/NaN|undefined/);
	});
});

describe("Acht Arme, acht Wörter", () => {
	const isb = new Set(
		Object.values(official.groups as Record<string, string>)
			.flatMap((group) => group.split(", "))
			.flatMap((entry) => entry.split(" – ")),
	);

	it("uses only words of the ISB Grundwortschatz, each once, in their spelling", () => {
		for (const w of GAME_WORDS) expect(isb.has(w.word), w.word).toBe(true);
		expect(new Set(GAME_WORDS.map((w) => w.word)).size).toBe(GAME_WORDS.length);
		for (const w of GAME_WORDS) {
			const capital = w.word[0] === w.word[0].toLocaleUpperCase("de-DE");
			expect(capital, w.word).toBe(w.cls === "nomen");
			if (w.cls === "verb") expect(w.word, "infinitive").toMatch(/n$/);
		}
		// The README names these numbers.
		expect(BASKETS.map((b) => GAME_WORDS.filter((w) => w.cls === b.id).length)).toEqual([46, 38, 17]);
	});

	it("deals eight different words, at least two of each class", () => {
		for (let seed = 1; seed <= 300; seed += 1) {
			const round = newRound(seeded(seed));
			expect(round.cards).toHaveLength(ARMS);
			expect(new Set(round.cards.map((c) => c.word)).size).toBe(ARMS);
			for (const b of BASKETS) expect(round.cards.filter((c) => c.cls === b.id).length).toBeGreaterThanOrEqual(2);
			expect(round.cards.every((c) => !c.placed && c.misses === 0)).toBe(true);
		}
	});

	it("deals a new round without the words of the last one", () => {
		const first = newRound(seeded(7));
		const second = newRound(seeded(8), first.cards.map((c) => c.word));
		for (const c of second.cards) expect(first.cards.map((x) => x.word)).not.toContain(c.word);
	});

	it("takes a word only in its own basket and keeps it with Tinto otherwise", () => {
		const round = newRound(seeded(3));
		const card = round.cards[0];
		const wrong = BASKETS.find((b) => b.id !== card.cls)?.id ?? "nomen";
		const miss = drop(round, 0, wrong);
		expect(miss.right).toBe(false);
		expect(miss.round.cards[0]).toMatchObject({ placed: false, misses: 1 });
		const hit = drop(miss.round, 0, card.cls);
		expect(hit.right).toBe(true);
		expect(hit.round.cards[0].placed).toBe(true);
		expect(drop(hit.round, 0, card.cls)).toEqual({ round: hit.round, right: false });
		expect(drop(hit.round, 99, card.cls).round).toBe(hit.round);
		let all = hit.round;
		all.cards.forEach((c, i) => {
			all = drop(all, i, c.cls).round;
		});
		expect(finished(all)).toBe(true);
		expect(finished(hit.round)).toBe(false);
	});

	it("explains the test for the word class instead of judging", () => {
		for (const w of GAME_WORDS)
			for (const b of BASKETS.filter((x) => x.id !== w.cls)) {
				const text = hint({ ...w, placed: false, misses: 1 }, b.id);
				expect(text).toContain(`„${w.word}“ gehört nicht zu den ${b.label}.`);
				// The template around the word (which may itself be "schlecht") never judges.
				expect(text.replaceAll(w.word, "Wort")).not.toMatch(/falsch|schlecht/i);
			}
		expect(hint({ word: "lachen", cls: "verb", placed: false, misses: 1 }, "nomen")).toContain("„wir lachen“");
		expect(hint({ word: "alt", cls: "adjektiv", placed: false, misses: 1 }, "verb")).toContain("„sehr alt“");
		expect(hint({ word: "Fisch", cls: "nomen", placed: false, misses: 1 }, "verb")).toContain("der, die oder das");
	});

	it("draws eight arms to eight words and opens the baskets only with a word in hand", () => {
		for (let i = 0; i < ARMS; i += 1) expect(tentacle(i)).not.toMatch(/NaN|undefined/);
		expect(SLOTS).toHaveLength(ARMS);
		const round = newRound(seeded(5));
		const idle = gameHtml(round, null, tinto("happy"), "<Hallo>");
		expect(idle.match(/class="tentacle"/g)).toHaveLength(ARMS);
		expect(idle.match(/data-action="game-card"/g)).toHaveLength(ARMS);
		expect(idle.match(/data-action="game-basket" data-basket="\w+" disabled/g)).toHaveLength(3);
		expect(idle).toContain("&lt;Hallo&gt;");
		const holding = gameHtml(round, 2, tinto("think"), "");
		expect(holding).toContain('class="tentacle holding"');
		expect(holding).toContain(`aria-label="In den Korb Nomen legen: ${round.cards[2].word}"`);
		expect(holding).not.toMatch(/data-basket="\w+" disabled/);
		let all = round;
		all.cards.forEach((c, i) => {
			all = drop(all, i, c.cls).round;
		});
		const done = gameHtml(all, null, tinto("cheer"), "");
		expect(done).toContain('data-action="game-new"');
		expect(done).not.toContain('data-action="game-card"');
		expect(done.match(/class="basket-word"/g)).toHaveLength(ARMS);
	});
});
