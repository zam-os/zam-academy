import { describe, expect, it, vi } from "vitest";
import tileData from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import { LESSONS, SOURCES, STAGES } from "../src/curriculum";
import rawLessons from "../src/curriculum/lessons.json";
import {
	canAccept,
	canReview,
	checkCases,
	esc,
	quizOptions,
} from "../src/practice";
import {
	completion,
	freshProgress,
	isComplete,
	loadProgress,
	parseProgress,
	saveProgress,
	updateDraft,
	writingKey,
} from "../src/storage/progress";
import { parseTrainingDeepLink, trainingBaseUrl } from "../src/zam/zam-link";
import legacyNarrative from "./fixtures/de-by-realschule-5-deutsch-erzaehlen-wortarten-faelle-kvt.json";
import legacySpelling from "./fixtures/de-by-realschule-5-deutsch-rechtschreibung-laute-woertliche-rede-kvt.json";
import official from "./fixtures/official-curriculum.json";
import contract from "./fixtures/public-contract.json";

const tile = tileData;
const legacyTiles = [legacyNarrative, legacySpelling];
const oldItems = legacyTiles.flatMap((legacy) =>
	legacy.atoms.flatMap((atom) => atom.practice_items),
);

describe("Lernpfad und veröffentlichbarer Vertrag", () => {
	it("pins 37 unique lesson anchors and all 114 ULIDs independently", () => {
		expect(LESSONS.map((l) => l.id)).toEqual(contract.lessons);
		expect(LESSONS).toHaveLength(37);
		expect(new Set(LESSONS.map((l) => l.id)).size).toBe(37);
		const ids = tile.atoms.flatMap((a) => [
			a.id,
			...a.practice_items.map((i) => i.id),
		]);
		expect(
			Object.fromEntries(
				tile.atoms.flatMap((atom) => [
					[atom.slug, atom.id],
					...atom.practice_items.map((item) => [item.slug, item.id]),
				]),
			),
		).toEqual(contract.ids);
		expect(new Set(ids).size).toBe(114);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
	});
	it("declares the eight approved A transfers and five retirements without collides on old ids", () => {
		const oldIds = new Set(oldItems.map((item) => item.id));
		expect(oldIds.size).toBe(16);
		const declaredTransfers = new Map<string, string[]>();
		for (const atom of tile.atoms)
			for (const item of atom.practice_items) {
				expect(oldIds.has(item.id)).toBe(false);
				if ("replaces" in item && Array.isArray(item.replaces)) {
					declaredTransfers.set(item.slug, item.replaces);
				}
			}
		expect(declaredTransfers.size).toBe(8);
		expect(tile.retired_items).toHaveLength(5);
	});
	it("traces 55 expectations to real lessons and matching sections, with limits", () => {
		expect(coverage.rows).toHaveLength(55);
		expect(
			new Set(coverage.rows.map((e) => `${e.section}.${e.position}`)).size,
		).toBe(55);
		expect([...new Set(coverage.rows.map((e) => e.section))]).toHaveLength(14);
		expect(coverage.optional_lessons).toEqual([]);
		expect(coverage.curriculum).toBe(official.source);
		expect(official.source).toBe(SOURCES[0].url);
		expect(official.areas.map(({ lb, hours }) => [lb, hours])).toEqual([
			[1, null],
			[2, null],
			[3, null],
			[4, null],
		]);
		expect(
			coverage.rows.map(({ section, position }) => [section, position]),
		).toEqual(
			official.expectations.map(({ section, position }) => [section, position]),
		);
		expect(
			[...new Set(coverage.rows.flatMap((r) => r.lessons))].sort(),
		).toEqual(LESSONS.map((l) => l.id).sort());
		for (const row of coverage.rows) {
			expect(row.lessons.length).toBeGreaterThan(0);
			expect(row.lb).toBe(Number(row.section[0]));
			expect(row.competence.length).toBeGreaterThan(5);
			expect(row.evidence.length).toBeGreaterThan(30);
			if ("additional" in row && row.additional) {
				expect(row.support).toBe("preparation");
				expect(row.additional.length).toBeGreaterThan(15);
			} else expect(row.support).toBe("guided");
			expect(["guided", "preparation"]).toContain(row.support);
			for (const id of row.lessons)
				expect(LESSONS.find((l) => l.id === id)?.bindings).toContain(
					row.section,
				);
		}
		expect(
			STAGES.map((stage) => LESSONS.filter((l) => l.stage === stage.id).length),
		).toEqual([6, 9, 6, 16]);
		const counts = Object.fromEntries(
			[...new Set(coverage.rows.map((e) => e.section))].map((section) => [
				section,
				coverage.rows.filter((e) => e.section === section).length,
			]),
		);
		expect(counts).toEqual({
			"1.1": 3,
			"1.2": 5,
			"1.3": 3,
			"1.4": 2,
			"2.1": 4,
			"2.2": 7,
			"2.3": 4,
			"2.4": 4,
			"3.1": 2,
			"3.2": 5,
			"3.3": 2,
			"4.1": 3,
			"4.2": 7,
			"4.3": 4,
		});
	});
	it("pins the captured curriculum wording and the original page checksum", async () => {
		const snapshot = new TextEncoder().encode(
			JSON.stringify({
				areas: official.areas,
				expectations: official.expectations,
			}),
		);
		const digest = await crypto.subtle.digest("SHA-256", snapshot);
		expect(
			Array.from(new Uint8Array(digest), (byte) =>
				byte.toString(16).padStart(2, "0"),
			).join(""),
		).toBe("a8736d21eecc9f90bf5c582b3790c31f4bc4446e95cbbfbe2940fecc36084a72");
		expect(official.html_sha256).toBe(
			"132ab1ce3603681abce16ba355ad857167a7d9a32aa63f35e9e7a702909b6a51",
		);
	});
	it.each(LESSONS.map((l) => [l.id, l] as const))(
		"%s has reachable checks, distinct tasks and a consistent cell",
		(_, lesson) => {
			expect(SOURCES.map((s) => s.id)).toEqual(
				expect.arrayContaining(lesson.sourceIds),
			);
			expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(2);
			expect(lesson.takeaway.length).toBeGreaterThan(30);
			expect(lesson.lehrplan).toContain("D5 ·");
			expect(quizOptions(lesson).sort()).toEqual(
				[lesson.quiz.answer, ...lesson.quiz.wrong].sort(),
			);
			expect(new Set(quizOptions(lesson)).size).toBe(3);
			expect(lesson.quiz.explanation.length).toBeGreaterThan(40);
			expect(lesson.cases).toHaveLength(2);
			for (const c of lesson.cases) {
				expect(c.options).toContain(c.answer);
				expect(new Set(c.options).size).toBe(c.options.length);
				expect(c.feedback.length).toBeGreaterThan(25);
			}
			expect(
				checkCases(
					lesson.cases,
					lesson.cases.map((c) => c.answer),
				),
			).toEqual([true, true]);
			expect(checkCases(lesson.cases, [])).toEqual([false, false]);
			expect(
				checkCases(
					lesson.cases,
					lesson.cases.map((c) => c.options.find((o) => o !== c.answer) ?? ""),
				),
			).toEqual([false, false]);
			expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
			expect(lesson.tasks[1].model).not.toBe(lesson.tasks[2].model);
			expect(lesson.tasks[1].criteria).not.toEqual(lesson.tasks[2].criteria);
			for (const level of [1, 2] as const) {
				expect(lesson.tasks[level].criteria).toHaveLength(3);
				expect(canReview(lesson.tasks[level].model)).toBe(true);
			}
			const atom = tile.atoms.find((a) => a.slug === lesson.id);
			if (!atom) throw new Error("Missing atom");
			const [fast, ...recallItems] = atom.practice_items;
			const fastCheck = fast.fast_check;
			if (!fastCheck) throw new Error("Missing fast check");
			expect(fast.question).toBe(lesson.quiz.question);
			expect(fast.concept).toBe(lesson.quiz.answer);
			expect(fastCheck.options[fastCheck.correct_index]).toBe(fast.concept);
			expect(fastCheck.correct_index).toBe(0);
			expect(recallItems.length).toBeGreaterThan(0);
			for (const recall of recallItems) {
				expect(recall.tier).toBe("tier2_synthesis");
				expect(recall.question.length).toBeGreaterThan(20);
				expect(recall.sample_solution?.length).toBeGreaterThan(20);
			}
			for (const item of atom.practice_items)
				expect(item.source_link).toBe(
					`https://academy.zam-os.org/deutsch-realschule-5/#lesson=${lesson.id}`,
				);
			const expectedAreas = [
				...new Set(lesson.bindings.map((b) => `lb${b[0]}`)),
			];
			const bindings = atom.curricula.filter(
				(c) => c.provider === "lehrplanplus-bayern",
			);
			expect(
				atom.curricula.filter((c) => c.provider === "zam-academy"),
			).toEqual([
				{
					provider: "zam-academy",
					subject: "deutsch-realschule-5",
					topic_code: lesson.stage,
					topic_title: STAGES.find((stage) => stage.id === lesson.stage)?.title,
				},
			]);
			expect(bindings.map((c) => c.topic_code)).toEqual(expectedAreas);
			for (const binding of bindings)
				expect(binding).toMatchObject({
					grade: 5,
					subject: "deutsch",
					school_type: "realschule",
				});
		},
	);

	it("keeps card texts in the cell and documents every approved old-item decision", () => {
		expect(rawLessons.every((l) => !("quiz" in l) && !("recall" in l))).toBe(
			true,
		);
		expect(mapping.status).toBe("approved");
		expect(mapping.approved).toBe("2026-11-13");
		expect(
			mapping.sources.map((source) => [source.tile_id, source.version]),
		).toEqual(legacyTiles.map((legacy) => [legacy.tile_id, legacy.version]));
		expect(mapping.rows.map((row) => row.de_by_id).sort()).toEqual(
			oldItems.map((item) => item.id).sort(),
		);
		const newItems = new Map(
			tile.atoms.flatMap((atom) =>
				atom.practice_items.map((item) => [item.slug, item] as const),
			),
		);
		const replaced = new Set<string>();
		const retirements: string[] = [];
		for (const row of mapping.rows) {
			const legacy = legacyTiles.find(
				(cell) => cell.tile_id === row.de_by_cell,
			);
			expect(
				legacy?.atoms.some((atom) =>
					atom.practice_items.some((item) => item.id === row.de_by_id),
				),
			).toBe(true);
			expect(row.reason.length).toBeGreaterThan(30);
			if (row.category === "A" && row.academy_slug) {
				expect(row.action).toBe("replace");
				const item = newItems.get(row.academy_slug) as
					| { tier: string; replaces?: string[] }
					| undefined;
				expect(item?.tier).toBe("tier1_fast");
				expect(item?.replaces).toEqual([row.de_by_id]);
				replaced.add(row.academy_slug);
			} else {
				expect(row.category).toBe("C");
				expect(row.academy_slug).toBeNull();
				if (row.action === "retire") retirements.push(row.de_by_id);
				else expect(row.action).toBe("keep-active");
			}
		}
		expect(replaced.size).toBe(8);
		expect(retirements).toEqual([
			"01K4D5E0000000000000000J02",
			"01K4D5R0000000000000000J02",
			"01K4D5R0000000000000000J04",
			"01K4D5R0000000000000000J06",
			"01K4D5R0000000000000000J08",
		]);
		expect(tile.retired_items?.map((entry) => entry.id)).toEqual(retirements);
	});

	it("keeps prerequisites within the path and puts them before dependent atoms", () => {
		const seen = new Set<string>();
		for (const atom of tile.atoms) {
			for (const prerequisite of atom.prerequisites) {
				expect(prerequisite.type).toBe("soft");
				expect(seen.has(prerequisite.atom_id)).toBe(true);
			}
			seen.add(atom.id);
		}
	});
	it("varies answer positions across both checks and cases", () => {
		expect(
			new Set(LESSONS.map((l) => quizOptions(l).indexOf(l.quiz.answer))).size,
		).toBe(3);
		expect(
			new Set(
				LESSONS.flatMap((l) => l.cases.map((c) => c.options.indexOf(c.answer))),
			).size,
		).toBe(2);
	});
});

describe("Fortschritt mit getrennter Selbsteinschätzung", () => {
	const lesson = LESSONS[0];
	function completed() {
		const p = freshProgress();
		p.quizDone.push(lesson.id);
		p.cases[lesson.id] = lesson.cases.map((c) => c.answer);
		updateDraft(
			p,
			lesson.id,
			1,
			"Meine eigene ausführliche Antwort mit einer Begründung.",
		);
		p.writingDone.push(writingKey(lesson.id, 1));
		return p;
	}
	it("requires every evidence component and uses the selected level", () => {
		const p = completed();
		expect(isComplete(p, lesson.id)).toBe(true);
		expect(completion(p)).toEqual({ completed: 1, total: 37 });
		p.level = 2;
		expect(isComplete(p, lesson.id)).toBe(false);
		p.level = 1;
		p.cases[lesson.id][0] = "wrong";
		expect(isComplete(p, lesson.id)).toBe(false);
		p.cases[lesson.id] = lesson.cases.map((c) => c.answer);
		p.quizDone = [];
		expect(isComplete(p, lesson.id)).toBe(false);
	});
	it("invalidates only the edited draft and preserves level separation on reload", () => {
		const p = completed();
		updateDraft(
			p,
			lesson.id,
			2,
			"Ein anderer Transfertext auf dem zweiten Niveau.",
		);
		p.writingDone.push(writingKey(lesson.id, 2));
		updateDraft(
			p,
			lesson.id,
			1,
			"Mein geänderter Entwurf braucht einen neuen Vergleich.",
		);
		expect(isComplete(p, lesson.id, 1)).toBe(false);
		expect(isComplete(p, lesson.id, 2)).toBe(true);
		const restored = parseProgress(JSON.stringify(p));
		expect(restored).toEqual(p);
		expect(isComplete(restored, lesson.id, 2)).toBe(true);
	});
	it("does not invalidate an unchanged draft, and cannot accept empty criteria", () => {
		const p = completed();
		updateDraft(p, lesson.id, 1, p.drafts[writingKey(lesson.id, 1)]);
		expect(isComplete(p, lesson.id)).toBe(true);
		expect(
			canAccept("Eine genügend lange eigene Antwort.", [true, true, false]),
		).toBe(false);
		expect(canAccept("Eine genügend lange eigene Antwort.", [])).toBe(false);
		expect(canAccept("kurz", [true, true, true])).toBe(false);
		expect(
			canAccept("Eine genügend lange eigene Antwort.", [true, true, true]),
		).toBe(true);
	});
	it.each(["{", "null", "[]", "7", '"text"'])(
		"recovers from invalid stored data: %s",
		(raw) => {
			expect(parseProgress(raw)).toEqual(freshProgress());
		},
	);
	it("drops unknown keys, invalid selections, duplicate evidence and empty drafts", () => {
		const key = writingKey(lesson.id, 1);
		const p = parseProgress(
			JSON.stringify({
				level: 7,
				quizDone: [lesson.id, lesson.id, "unknown"],
				cases: { [lesson.id]: ["<script>", 123], unknown: ["yes"] },
				drafts: { [key]: "", unknown: "x" },
				writingDone: [key, "unknown"],
			}),
		);
		expect(p.level).toBe(1);
		expect(p.quizDone).toEqual([lesson.id]);
		expect(p.cases).toEqual({ [lesson.id]: ["", ""] });
		expect(p.writingDone).toEqual([]);
		expect(isComplete(p, lesson.id)).toBe(false);
	});
});

describe("Gesperrter Browserspeicher", () => {
	it("keeps the visit usable and reports save failure", async () => {
		vi.stubGlobal("localStorage", {
			getItem() {
				throw new Error("blocked");
			},
			setItem() {
				throw new Error("blocked");
			},
		});
		try {
			expect(loadProgress()).toEqual(freshProgress());
			expect(await saveProgress(freshProgress())).toBe(false);
		} finally {
			vi.unstubAllGlobals();
		}
	});
});

describe("Navigation und sichere Textdarstellung", () => {
	it("accepts fragment and query links with fragment precedence", () => {
		expect(
			parseTrainingDeepLink(
				"#lesson=d5-figuren&level=2",
				"?lesson=d5-lesespuren&level=1",
			),
		).toEqual({ lessonId: "d5-figuren", level: 2 });
		expect(parseTrainingDeepLink("", "?lesson=d5-lesespuren")).toEqual({
			lessonId: "d5-lesespuren",
		});
		expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=9")).toEqual({});
	});
	it("removes old query routes when going back to the path", () => {
		expect(
			trainingBaseUrl(
				"/deutsch-realschule-5/",
				"?lesson=d5-figuren&level=2&from=zam",
			),
		).toBe("/deutsch-realschule-5/?from=zam");
	});
	it("renders user drafts as text even if they contain markup", () => {
		expect(esc('<img src=x onerror="run()"> &')).toBe(
			"&lt;img src=x onerror=&quot;run()&quot;&gt; &amp;",
		);
	});
});
