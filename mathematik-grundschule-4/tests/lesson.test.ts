import { describe, expect, it } from "vitest";
import { ProgressStore } from "../src/storage/progress";
import {
	digits,
	exchange,
	format,
	parseInteger,
	total,
	validCounts,
} from "../src/math/place-value";
import {
	fresh,
	grant,
	independent,
	laterEligible,
	nextStep,
	recordAttempt,
	validProgress,
} from "../src/practice/evidence";
import {
	CONTENT_VERSION,
	LESSON_ID,
	STEPS,
	orderedOptions,
	recallSeed,
	taskFor,
} from "../src/practice/tasks";
import { validLessonHash } from "../src/zam/zam-link";
import cell from "../cell.json";
import coverage from "../coverage.json";
import media from "../media-register.json";
import { ulid } from "../src/id";

const required = <T>(value: T | null | undefined): T => {
	if (value == null) throw new Error("Expected a generated value");
	return value;
};

describe("place-value invariants", () => {
	it("keeps playing when reading the storage API itself is denied", async () => {
		const descriptor = Object.getOwnPropertyDescriptor(globalThis, "indexedDB");
		Object.defineProperty(globalThis, "indexedDB", {
			configurable: true,
			get() {
				throw new Error("Storage access denied");
			},
		});
		try {
			const store = new ProgressStore("isolated-getter-test");
			await store.open();
			await store.update((p) => {
				p.step = "learn-a";
			});
			expect(store.mode).toBe("memory");
			expect(store.state.step).toBe("learn-a");
			store.close();
		} finally {
			if (descriptor)
				Object.defineProperty(globalThis, "indexedDB", descriptor);
			else Reflect.deleteProperty(globalThis, "indexedDB");
		}
	});
	it("reconstructs every supported whole number using independent decimal positions", () => {
		for (let n = 0; n <= 9999; n++) {
			const d = digits(n);
			expect(d[0] + 10 * d[1] + 100 * d[2] + 1000 * d[3]).toBe(n);
			expect(total(d)).toBe(n);
		}
		expect(digits(2047)).toEqual([7, 4, 0, 2]);
		expect(digits(0)).toEqual([0, 0, 0, 0]);
		expect(() => digits(10000)).toThrow();
		expect(() => digits(1.5)).toThrow();
	});
	it("preserves value and reverses legal exchanges, including noncanonical columns", () => {
		for (let n = 1; n <= 9999; n += 7) {
			for (const col of [1, 2, 3] as const) {
				const before = digits(n);
				const after = exchange(before, col, "unbundle");
				if (before[col]) {
					expect(after).not.toBeNull();
					expect(total(required(after))).toBe(n);
					expect(required(after)[col - 1] - before[col - 1]).toBe(10);
					expect(
						exchange(required(after), (col - 1) as 0 | 1 | 2, "bundle"),
					).toEqual(before);
				} else expect(after).toBeNull();
			}
		}
		expect(exchange([2, 4, 1, 0], 2, "unbundle")).toEqual([2, 14, 0, 0]);
		expect(exchange([9, 0, 0, 0], 0, "bundle")).toBeNull();
		expect(exchange([0, 0, 0, 1], 3, "bundle")).toBeNull();
		expect(exchange([0, 0, 0, 0], 0, "unbundle")).toBeNull();
		expect(validCounts([0, -1, 0, 0])).toBe(false);
		expect(validCounts([0, 0, 0, 10])).toBe(false);
	});
	it.each([
		"",
		"1,5",
		"1.000",
		"1e3",
		"306abc",
		"-1",
		"10000",
		"3 06",
		"NaN",
		"Infinity",
		"1 000 0",
	])("refuses ambiguous or noninteger input %s", (input) => {
		expect(parseInteger(input)).toBeNull();
	});
	it("accepts only the documented spacing and grouping", () => {
		expect(parseInteger(" 306 ")).toBe(306);
		expect(parseInteger("2 047")).toBe(2047);
		expect(parseInteger("2\u202f047")).toBe(2047);
		expect(parseInteger("0")).toBe(0);
		expect(format(2047)).toBe("2\u202f047");
	});
});

describe("tasks and evidence", () => {
	it("varies fresh tasks and agrees with an independent arithmetic oracle", () => {
		const reads = new Set<number>();
		for (let seed = 0; seed < 600; seed++) {
			for (const step of [
				...STEPS,
				"later-read",
				"later-zero",
				"later-exchange",
			] as const) {
				const task = taskFor(step, seed);
				if (!task) continue;
				expect(validCounts(task.model)).toBe(true);
				if (task.family === "read" || task.family === "zero") {
					const [e, z, h, t] = task.model;
					expect(task.answer).toBe(e + z * 10 + h * 100 + t * 1000);
				}
				if (task.family === "digit")
					expect(task.answer).toBe(task.model[2] * 100);
				if (task.options) {
					expect(
						task.options.filter((o) => o.value === task.answer),
					).toHaveLength(1);
					expect(new Set(task.options.map((o) => o.value)).size).toBe(
						task.options.length,
					);
					expect(
						orderedOptions(task, seed)
							.map((o) => o.value)
							.sort(),
					).toEqual(task.options.map((o) => o.value).sort());
				}
			}
			reads.add(required(taskFor("exit-read", seed)).answer);
		}
		expect(reads.size).toBeGreaterThan(2);
	});
	it("never promotes a helped retry to independent success", () => {
		const p = fresh(1000);
		const task = required(taskFor("exit-read", p.seed));
		recordAttempt(p, task, "exit/read", false, 2000, "exit");
		recordAttempt(p, task, "exit/read", true, 3000, "exit");
		expect(p.attempts.map(independent)).toEqual([false, false]);
		p.helped.push("exit/zero");
		recordAttempt(
			p,
			required(taskFor("exit-zero", p.seed)),
			"exit/zero",
			true,
			4000,
			"exit",
		);
		expect(independent(p.attempts[2])).toBe(false);
		recordAttempt(p, task, "new/read", true, 5000, "exit");
		expect(independent(p.attempts[3])).toBe(true);
		recordAttempt(p, task, "guided/read", true, 6000, "guided");
		expect(independent(p.attempts[4])).toBe(false);
	});
	it("uses different numbers for all three later checks", () => {
		for (let previous = 0; previous < 50; previous++) {
			let candidate = previous;
			const next = recallSeed(previous, () => candidate++);
			for (const [later, exit] of [
				["later-read", "exit-read"],
				["later-zero", "exit-zero"],
				["later-exchange", "exit-exchange"],
			] as const)
				expect(required(taskFor(later, next)).answer).not.toBe(
					required(taskFor(exit, previous)).answer,
				);
		}
	});
	it("grants each mission only once and keeps rewards through ordinary content updates", () => {
		const p = fresh(1000);
		for (let i = 0; i < 10; i++) grant(p, "mission-a", 2000 + i);
		grant(p, "mission-b", 3000);
		expect(p.rewards).toEqual(["mission-a", "mission-b"]);
		expect(p.completed["mission-a"]).toBe(2000);
		expect(validProgress(structuredClone(p))).toBe(true);
	});
	it("does not invent delayed recall when a clock goes backwards or the day is not over", () => {
		const p = fresh(1000);
		grant(p, "mission-b", 5000);
		expect(laterEligible(p, 4999)).toBe(false);
		expect(laterEligible(p, 5000 + 86_399_999)).toBe(false);
		expect(laterEligible(p, 5000 + 86_400_000)).toBe(true);
	});
	it("starts each interactive step with its specified representation", () => {
		const p = fresh();
		p.step = "learn-b";
		nextStep(p);
		expect(p.step).toBe("bundle");
		expect(p.workspace).toEqual([10, 0, 0, 0]);
		nextStep(p);
		expect(p.step).toBe("exchange");
		expect(p.workspace).toEqual([2, 4, 1, 0]);
	});
	it("rejects corrupt and incompatible saved state instead of manufacturing mastery", () => {
		expect(validProgress(null)).toBe(false);
		expect(validProgress({ ...fresh(), schema: 99 })).toBe(false);
		expect(validProgress({ ...fresh(), version: CONTENT_VERSION + 1 })).toBe(
			false,
		);
		expect(validProgress({ ...fresh(), workspace: [0, 0, 0, 10] })).toBe(false);
		expect(validProgress({ ...fresh(), attempts: [{ id: "not-an-id" }] })).toBe(
			false,
		);
		expect(validProgress({ ...fresh(), consumed: ["mission-b"] })).toBe(false);
		expect(validProgress({ ...fresh(), completed: { unrelated: 1000 } })).toBe(
			false,
		);
		expect(
			validProgress({
				...fresh(),
				rewards: ["mission-a", "mission-a"],
				completed: { "mission-a": 1000 },
			}),
		).toBe(false);
	});
	it("uses cryptographic ULIDs for persistent event identities", () => {
		const ids = Array.from({ length: 100 }, () => ulid(1793400000000));
		expect(new Set(ids).size).toBe(100);
		expect(ids.every((id) => /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(id))).toBe(
			true,
		);
	});
});

describe("content contracts", () => {
	it("has four atoms, eight German items, stable lesson links and no broad official grade binding", () => {
		expect(cell.atoms).toHaveLength(4);
		const items = cell.atoms.flatMap((a) => a.practice_items);
		expect(items).toHaveLength(8);
		for (const atom of cell.atoms) {
			expect(atom.curricula.every((c) => c.provider === "zam-academy")).toBe(
				true,
			);
			expect(atom.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
		}
		for (const item of items) {
			expect(item.language).toBe("de");
			expect(item.source_link.endsWith(`#lesson=${LESSON_ID}`)).toBe(true);
			expect(validLessonHash(new URL(item.source_link).hash)).toBe(true);
		}
		expect(validLessonHash("#lesson=unbekannt")).toBe(false);
		expect(new Set(items.map((i) => i.id)).size).toBe(8);
	});
	it("enumerates every official competence and truthfully identifies partial coverage", () => {
		expect(coverage.competences).toHaveLength(54);
		expect(new Set(coverage.competences.map((c) => c.section)).size).toBe(13);
		expect(new Set(coverage.competences.map((c) => c.id)).size).toBe(54);
		expect(coverage.full_coverage).toBe(false);
		for (const c of coverage.competences) {
			expect(c.reviewer).toBeNull();
			for (const lesson of c.lessons) expect(lesson).toBe(LESSON_ID);
			expect(c.remaining.length).toBeGreaterThan(0);
		}
	});
	it("does not advertise an absent video as an approved teacher recording", () => {
		expect(media.status).toBe("awaiting-recording");
		expect(media.video).toBeNull();
		expect(media.teacher).toBeNull();
		expect(media.timings_are_draft).toBe(true);
	});
});
