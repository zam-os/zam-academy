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
import { board, markedNumeral } from "../src/ui/board";
import {
	practiceTask,
	correctTask,
	mistakeHint,
	REQUIRED_CORRECT,
} from "../src/practice/tasks";
import { parentObservation } from "../src/practice/evidence";

type RecallItem = (typeof cell.atoms)[number]["practice_items"][number];

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
		for (let n = 0; n <= 1_000_000; n += 37) {
			const d = digits(n);
			expect(d.reduce((sum, n, i) => sum + n * 10 ** i, 0)).toBe(n);
			expect(total(d)).toBe(n);
		}
		expect(digits(2047)).toEqual([7, 4, 0, 2, 0, 0, 0]);
		expect(digits(0)).toEqual([0, 0, 0, 0, 0, 0, 0]);
		expect(() => digits(1_000_001)).toThrow();
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
		expect(exchange([2, 4, 1, 0], 2, "unbundle")).toEqual([
			2, 14, 0, 0, 0, 0, 0,
		]);
		expect(exchange([9, 0, 0, 0], 0, "bundle")).toBeNull();
		expect(exchange([0, 0, 0, 0, 0, 0, 1], 6, "bundle")).toBeNull();
		expect(exchange([0, 0, 0, 0], 0, "unbundle")).toBeNull();
		expect(validCounts([0, -1, 0, 0])).toBe(false);
		expect(validCounts([0, 0, 0, 0, 0, 0, 2])).toBe(false);
	});
	it.each([
		"",
		"1,5",
		"1.000",
		"1e3",
		"306abc",
		"-1",
		"1000001",
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
					expect(task.answer).toBe(
						task.model.reduce((sum, n, i) => sum + n * 10 ** i, 0),
					);
				}
				if (task.family === "digit")
					expect(task.answer).toBe(
						task.model[task.column ?? 0] * 10 ** (task.column ?? 0),
					);
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
	it("grants each mission only once", () => {
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
		expect(p.workspace).toEqual(taskFor("bundle", p.seed)?.model);
		nextStep(p);
		expect(p.step).toBe("exchange");
		expect(p.workspace).toEqual(taskFor("exchange", p.seed)?.model);
	});
	it("rejects corrupt and incompatible saved state instead of manufacturing mastery", () => {
		expect(validProgress(null)).toBe(false);
		expect(validProgress({ ...fresh(), schema: 99 })).toBe(false);
		expect(
			validProgress({ ...fresh(), workspace: [0, 0, 0, 0, 0, 0, 2] }),
		).toBe(false);
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
	it("has eleven atoms, thirty-four German items, stable lesson links and no broad official grade binding", () => {
		expect(cell.atoms).toHaveLength(11);
		const items = cell.atoms.flatMap<RecallItem>((a) => a.practice_items);
		expect(items).toHaveLength(34);
		for (const atom of cell.atoms) {
			expect(atom.curricula.every((c) => c.provider === "zam-academy")).toBe(
				true,
			);
			expect(atom.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
		}
		for (const item of items) {
			expect(item.language).toBe("de");
			expect(new URL(item.source_link).hash.startsWith("#lesson=")).toBe(true);
			expect(validLessonHash(new URL(item.source_link).hash)).toBe(true);
		}
		expect(validLessonHash("#lesson=unbekannt")).toBe(false);
		expect(new Set(items.map((i) => i.id)).size).toBe(34);
	});
	it("enumerates every official competence and truthfully identifies partial coverage", () => {
		expect(coverage.rows).toHaveLength(54);
		expect(new Set(coverage.rows.map((c) => c.section)).size).toBe(13);
		expect(new Set(coverage.rows.map((c) => c.id)).size).toBe(54);
		expect(coverage.full_coverage).toBe(false);
		for (const c of coverage.rows) {
			expect(c.reviewer).toBeNull();
			for (const lesson of c.lessons)
				expect(validLessonHash(`#lesson=${lesson}`)).toBe(true);
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

describe("review regressions", () => {
	it("supports the million boundary and high-place exchange round trips", () => {
		expect(total(digits(1_000_000))).toBe(1_000_000);
		expect(parseInteger("1 000 000")).toBe(1_000_000);
		expect(parseInteger("204 070")).toBe(204070);
		for (let n = 1000; n <= 1_000_000; n += 7919)
			for (const col of [1, 2, 3, 4, 5, 6] as const) {
				const d = digits(n);
				const changed = exchange(d, col, "unbundle");
				if (d[col]) {
					expect(total(required(changed))).toBe(n);
					expect(
						exchange(
							required(changed),
							(col - 1) as 0 | 1 | 2 | 3 | 4 | 5,
							"bundle",
						),
					).toEqual(d);
				}
			}
	});
	it("does not expose a digit row or computed value before a representation answer", () => {
		const rendered = board(digits(204070), false, undefined, false, false);
		expect(rendered).not.toContain('class="count"');
		expect(rendered).not.toContain("204070");
		expect(rendered).not.toContain("204 070");
		expect(rendered).toContain('aria-label="4 Tausender"');
		expect(board(digits(402), true, undefined, false, false)).not.toContain(
			'class="count"',
		);
	});
	it("varies positions, zeros, sizes and exchanges over 600 seeds with independent witnesses", () => {
		const zeroPositions = new Set<number>(),
			columns = new Set<number>(),
			answers = new Set<number>(),
			operations = new Set<number>();
		for (let seed = 0; seed < 600; seed++) {
			const read = required(taskFor("exit-read", seed));
			answers.add(read.answer);
			for (const [i, n] of read.model.entries())
				if (n === 0 && i < String(read.answer).length - 1) zeroPositions.add(i);
			const digit = required(taskFor("digit", seed));
			columns.add(required(digit.column));
			expect(digit.answer).toBe(
				(Math.floor(required(digit.numeral) / 10 ** required(digit.column)) %
					10) *
					10 ** required(digit.column),
			);
			for (const step of ["bundle", "exchange"] as const) {
				const task = required(taskFor(step, seed));
				operations.add(required(task.column));
				expect(correctTask(task, null, task.model)).toBe(false);
				const changed = exchange(
					task.model,
					required(task.column) as 0 | 1 | 2 | 3,
					step === "bundle" ? "bundle" : "unbundle",
				);
				expect(changed).not.toBeNull();
				expect(correctTask(task, null, required(changed))).toBe(true);
				expect(total(required(changed))).toBe(task.answer);
			}
		}
		expect(zeroPositions.size).toBe(5);
		expect(columns.size).toBe(6);
		expect(answers.size).toBeGreaterThan(500);
		expect(operations.has(3)).toBe(true);
	});
	it("provides genuinely different practice levels and at least 80 fresh solvable tasks per level", () => {
		expect(REQUIRED_CORRECT).toBe(3);
		for (const level of [1, 2] as const) {
			const signatures = new Set<string>();
			for (let index = 0; index < 120; index++) {
				const t = practiceTask(level, 12345, index);
				signatures.add(JSON.stringify([t.family, t.answer, t.model]));
				expect(t.level).toBe(level);
				expect(validCounts(t.model)).toBe(true);
				expect(correctTask(t, t.answer, t.target ?? digits(t.answer))).toBe(
					true,
				);
				if (t.target) expect(correctTask(t, t.answer, t.model)).toBe(false);
				if (level === 2) expect(["exchange", "bundle"]).toContain(t.family);
			}
			expect(signatures.size).toBeGreaterThan(80);
		}
	});
	it("gives targeted feedback for omitted zeros, shifted builds, digit values and concatenated bundles", () => {
		const read = required(taskFor("exit-read", 4));
		read.answer = 402;
		read.model = digits(402);
		expect(mistakeHint(read, 42, read.model)).toContain("Null");
		const build = required(taskFor("build-large", 4));
		build.answer = 2047;
		expect(mistakeHint(build, null, digits(2470))).toContain("Stelle");
		expect(mistakeHint(required(taskFor("digit", 4)), 2, digits(0))).toContain(
			"Wert",
		);
		const exchangeRead = {
			...required(taskFor("exit-exchange", 4)),
			model: [2, 11, 2, 0, 0, 0, 0],
			answer: 312,
		};
		expect(mistakeHint(exchangeRead, 2112, digits(0))).toContain(
			"nebeneinander",
		);
	});
	it("has standard fast checks, synthesis solutions, explicit partial competence text and acyclic prerequisites", () => {
		const ids = new Set(cell.atoms.map((a) => a.id));
		for (const atom of cell.atoms)
			for (const id of atom.prerequisites)
				expect(ids.has(id.atom_id)).toBe(true);
		const visit = (id: string, path: string[] = []) => {
			expect(path).not.toContain(id);
			for (const next of required(cell.atoms.find((a) => a.id === id))
				.prerequisites)
				visit(next.atom_id, [...path, id]);
		};
		for (const atom of cell.atoms) {
			visit(atom.id);
			for (const item of atom.practice_items) {
				if (item.tier === "tier1_fast") {
					expect(item.fast_check?.options).toHaveLength(2);
					expect(item.fast_check?.correct_index).toBe(0);
				} else expect(item.sample_solution?.length).toBeGreaterThan(30);
			}
		}
		for (const c of coverage.rows) {
			expect(c.competence.length).toBeGreaterThan(30);
			expect(c.lb).toBeGreaterThan(0);
			expect(c.status).not.toBe("implemented");
		}
	});
});

describe("Grok review regressions", () => {
	it("keeps build examples mathematically correct independently of the mutable starting board", () => {
		for (const answer of [306, 2047, 204070, 999999]) {
			const p = fresh(1000);
			const task = {
				...required(taskFor("build-small", p.seed)),
				answer,
				model: digits(0),
			};
			recordAttempt(p, task, "build-example", false, 2000, "guided");
			const saved = p.attempts[0];
			expect(total(saved.example.model)).toBe(answer);
			task.model[0] = 9;
			expect(total(saved.example.model)).toBe(answer);
		}
	});
	it("rejects impossible example numbers", () => {
		const p = fresh(1000);
		recordAttempt(
			p,
			required(taskFor("exit-read", p.seed)),
			"read",
			true,
			2000,
			"exit",
		);
		p.attempts[0].example = {
			prompt: "Corrupt",
			model: digits(0),
			answer: 1_000_001,
		};
		expect(validProgress(p)).toBe(false);
	});
});

describe("re-review refinements", () => {
	it("varies both exchange directions across decimal positions with two meaningful choices", () => {
		const bundling = new Set<number>(),
			unbundling = new Set<number>(),
			reasons = new Set<string>();
		for (let seed = 0; seed < 600; seed++) {
			for (const step of ["bundle", "exchange"] as const) {
				const task = required(taskFor(step, seed));
				(step === "bundle" ? bundling : unbundling).add(required(task.column));
				expect(validCounts(task.model)).toBe(true);
				const eligible = task.model.filter((n, i) =>
					step === "bundle" ? i < 6 && n >= 10 : i > 0 && n > 0,
				);
				expect(eligible.length).toBeGreaterThanOrEqual(2);
				expect(total(required(task.target))).toBe(task.answer);
				expect(correctTask(task, null, task.model)).toBe(false);
				expect(correctTask(task, null, required(task.target))).toBe(true);
			}
			const reason = required(taskFor("reason", seed));
			reasons.add(reason.options?.[0].label ?? "");
			expect(reason.options).toHaveLength(3);
			expect(reason.options?.[1].label).toMatch(/100 [A-Z]+/);
			expect(total(reason.model)).toBeGreaterThan(0);
		}
		expect([...bundling].sort()).toEqual([0, 1, 2, 3, 4]);
		expect([...unbundling].sort()).toEqual([1, 2, 3, 4, 5]);
		expect(reasons.size).toBe(5);
	});
	it("mentions concatenation only for that error and uses the actual exchange count and units", () => {
		const task = {
			...required(taskFor("exit-exchange", 4)),
			model: [0, 0, 17, 2, 0, 0, 0],
			answer: 3700,
		};
		expect(mistakeHint(task, 21700, digits(0))).toContain(
			"17 H sind 1 T und 7 H",
		);
		expect(mistakeHint(task, 9999, digits(0))).not.toContain("nebeneinander");
		expect(mistakeHint(task, 9999, digits(0))).toContain("Hunderter");
		task.model = [2, 11, 2, 0, 0, 0, 0];
		task.answer = 312;
		expect(mistakeHint(task, 2112, digits(0))).toContain(
			"11 Z sind 1 H und 1 Z",
		);
	});
	it("keeps grouping and the highlighted position consistent and labels only visible board columns", () => {
		expect(markedNumeral(50144, 2)).toContain("50\u202f<mark>1</mark>44");
		expect(markedNumeral(378646, 4)).toContain("3<mark>7</mark>8\u202f646");
		for (const width of [4, 5, 6, 7]) {
			const html = board(digits(0), false, undefined, false, false, width);
			const legend = required(
				html.match(/<p class="board-legend">([^<]+)<\/p>/),
			)[1];
			expect(legend.includes("ZT Zehntausender")).toBe(width >= 5);
			expect(legend.includes("HT Hunderttausender")).toBe(width >= 6);
			expect(legend.includes("M Millionen")).toBe(width >= 7);
		}
	});
	it("keeps independent exit evidence distinct from helped or guided practice", () => {
		const p = fresh(1000);
		const task = required(taskFor("exit-read", p.seed));
		expect(parentObservation([]).label).toBe("Noch offen");
		recordAttempt(p, task, "guided", true, 2000, "guided");
		expect(parentObservation(p.attempts).label).toBe("Ausprobiert");
		p.helped.push("helped");
		recordAttempt(p, task, "helped", true, 3000, "exit");
		expect(parentObservation(p.attempts).label).toBe("Mit Hilfe geübt");
		recordAttempt(p, task, "independent", true, 4000, "exit");
		expect(parentObservation(p.attempts).label).toBe(
			"Neue Aufgabe selbstständig gelöst",
		);
	});
	it("groups numerals in recorded parent examples like the learner question", () => {
		const p = fresh(1000);
		const task = {
			...required(taskFor("digit", p.seed)),
			numeral: 50144,
			column: 2,
		};
		recordAttempt(p, task, "digit", true, 2000, "exit");
		expect(p.attempts[0].example.prompt).toContain(
			"Zahl: 50\u202f144; markierte Ziffer: 1.",
		);
	});
});
