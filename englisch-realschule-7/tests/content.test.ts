import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import contract from "./fixtures/public-contract.json";
import legacy6 from "./fixtures/de-by-realschule-6-englisch-grammatik-grundlagen-kvt.json";
import legacy7 from "./fixtures/de-by-realschule-7-englisch-grammatik-tenses-kvt.json";
import neighbourMapping from "../../englisch-realschule-6/replaces-de-by.json";
import {
	CORE_LESSONS,
	findLesson,
	LESSONS,
	SOURCES,
	STAGES,
} from "../src/curriculum";
import {
	canAccept,
	canReview,
	checkPractice,
	normalise,
	practiceFeedback,
	quizFeedback,
	quizOptions,
} from "../src/practice";
import {
	freshProgress,
	isComplete,
	parseProgress,
	updateDraft,
	writingKey,
	STORAGE_KEY,
} from "../src/storage/progress";
import {
	lessonLink,
	parseTrainingDeepLink,
	trainingBaseUrl,
	ZAM_CELL_ID,
} from "../src/zam/zam-link";
import {
	AT_BRITAIN,
	AT_IRELAND,
	AT_NORTH_AMERICA,
	AT_PORTS,
	DUBLIN_BLOCKS,
	DUBLIN_PLACES,
	IE_CITIES,
	IE_NORTHERN_IRELAND,
	IE_REPUBLIC,
	RB_BRITANNIA,
	RB_CALEDONIA,
	RB_TOWNS,
	RB_WALL,
	renderDublinMap,
	renderEmigrationMap,
	renderIrelandMap,
	renderRomanBritainMap,
	type MapPoint,
} from "../src/places-map";
import {
	clockLabel,
	conditionalPattern,
	fmtDe,
	HISTORY_EVENTS,
	historyEvent,
	pastPerfectScene,
	renderWorkshop,
	salesTax,
	sinceFor,
	usd,
	workshopGoals,
	yearLabel,
} from "../src/workshop";

const items = cell.atoms.flatMap((atom) => atom.practice_items);
const legacyItems = [
	...legacy7.atoms.flatMap((atom) => atom.practice_items),
	...legacy6.atoms.flatMap((atom) => atom.practice_items),
];

function inside(point: MapPoint, polygon: readonly MapPoint[]): boolean {
	let contained = false;
	for (
		let index = 0, previous = polygon.length - 1;
		index < polygon.length;
		previous = index++
	) {
		const current = polygon[index];
		const before = polygon[previous];
		if (
			current[1] > point[1] !== before[1] > point[1] &&
			point[0] <
				((before[0] - current[0]) * (point[1] - current[1])) /
					(before[1] - current[1]) +
					current[0]
		)
			contained = !contained;
	}
	return contained;
}

describe("Grade 7 Realschule English teaching contract", () => {
	it("has 9 stages, 45 lessons, 135 goals and 135 cards", () => {
		expect(LESSONS).toHaveLength(45);
		expect(CORE_LESSONS).toHaveLength(45);
		expect(STAGES).toHaveLength(9);
		expect(new Set(STAGES.map((stage) => stage.hue)).size).toBe(9);
		for (const stage of STAGES)
			expect(LESSONS.some((lesson) => lesson.stage === stage.id)).toBe(true);
		expect(cell.atoms).toHaveLength(45);
		expect(items).toHaveLength(135);
		expect(
			LESSONS.filter((lesson) => lesson.listening).map((lesson) => lesson.id),
		).toEqual([
			"e7-dublin-directions",
			"e7-youth-interview",
			"e7-lit-sherlock",
			"e7-pronunciation",
		]);
	});

	it.each(LESSONS)("has substantial teaching and distinct tasks: $id", (lesson) => {
		expect(lesson.id).toMatch(/^e7-[a-z0-9-]+$/);
		expect(STAGES.some((stage) => stage.id === lesson.stage)).toBe(true);
		expect(lesson.paragraphs).toHaveLength(2);
		expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(400);
		expect(lesson.material.length).toBeGreaterThan(100);
		expect(lesson.materialLanguage).toBe("en");
		expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
		expect(quizOptions(lesson)).toContain(lesson.quiz.answer);
		expect(lesson.quiz.explanation.length).toBeGreaterThan(15);
		for (const wrong of lesson.quiz.wrong) {
			expect(quizFeedback(lesson, wrong)).not.toContain(lesson.quiz.explanation);
			expect(quizFeedback(lesson, wrong)).toContain("Prüfe");
		}
		expect(quizFeedback(lesson, lesson.quiz.answer)).toContain(
			lesson.quiz.explanation,
		);
		expect(lesson.practice).toHaveLength(2);
		for (const entry of lesson.practice) {
			expect(entry.answers.length).toBeGreaterThan(0);
			expect(entry.feedback.length).toBeGreaterThan(10);
			expect(practiceFeedback(entry, false)).not.toContain(entry.feedback);
			expect(entry.prompt, lesson.id).toMatch(/\([^)]+\)$/);
		}
		expect(
			checkPractice(
				lesson.practice,
				lesson.practice.map((entry) => entry.answers[0]),
			),
		).toEqual([true, true]);
		expect(checkPractice(lesson.practice, ["wrong", "wrong"])).toEqual([
			false,
			false,
		]);
		expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
		expect(lesson.tasks[1].model).not.toBe(lesson.tasks[2].model);
		for (const task of Object.values(lesson.tasks)) {
			expect(task.criteria).toHaveLength(3);
			expect(task.model.length).toBeGreaterThan(35);
			expect(task.prompt.length).toBeGreaterThan(35);
		}
		for (const binding of lesson.bindings)
			expect(["1.1", "1.2", "2", "3", "4", "5"]).toContain(binding);
		for (const id of lesson.sourceIds)
			expect(SOURCES.some((source) => source.id === id)).toBe(true);
		expect(lesson.sourceIds).toContain("lp");
		expect(JSON.stringify(lesson)).not.toMatch(
			/<script|<p>|<div>|\\\\\(|teacherVideo/,
		);
		const visible = JSON.stringify({
			paragraphs: lesson.paragraphs,
			material: lesson.material,
			quiz: lesson.quiz,
			tasks: lesson.tasks,
			practice: lesson.practice,
			takeaway: lesson.takeaway,
		});
		expect(visible).not.toMatch(/\d\.\d/);
		expect(visible).not.toMatch(/\s-\d/);
		for (const goal of lesson.workshop.goals)
			expect(goal.before).not.toContain("→");
	});

	it.each(LESSONS)(
		"proves every workshop goal reachable and none true initially: $id",
		(lesson) => {
			expect(lesson.workshop.goals).toHaveLength(3);
			expect(workshopGoals(lesson.workshop, [])).toEqual([false, false, false]);
			expect(
				workshopGoals(
					lesson.workshop,
					lesson.workshop.goals.map((goal) => goal.answer),
				),
			).toEqual([true, true, true]);
			lesson.workshop.goals.forEach((goal, index) => {
				expect(new Set(goal.options).size).toBe(3);
				expect(goal.options).toContain(goal.answer);
				const answers = Array(3).fill("");
				answers[index] = goal.answer;
				expect(workshopGoals(lesson.workshop, answers).filter(Boolean)).toHaveLength(
					1,
				);
				for (const wrong of goal.options.filter(
					(value) => value !== goal.answer,
				)) {
					answers[index] = wrong;
					expect(
						workshopGoals(lesson.workshop, answers).filter(Boolean),
					).toHaveLength(0);
				}
			});
		},
	);

	it("maps every competence and every lesson, with honest limits", () => {
		expect(coverage.rows).toHaveLength(63);
		expect(new Set(coverage.rows.map((row) => row.id)).size).toBe(63);
		const mapped = new Set(coverage.rows.flatMap((row) => row.lessons));
		for (const lesson of LESSONS) expect(mapped.has(lesson.id)).toBe(true);
		for (const row of coverage.rows) {
			expect(["supported", "implemented"]).toContain(row.status);
			expect(row.evidence.length).toBeGreaterThan(35);
			expect(row.lessons.length).toBeGreaterThan(0);
			for (const id of row.lessons) expect(findLesson(id)).toBeDefined();
		}
		// Real listening, live speaking, a complete class reader and research stay in class.
		for (const id of ["E7-01", "E7-02", "E7-04", "E7-06", "E7-07", "E7-14", "E7-63"])
			expect(coverage.rows.find((row) => row.id === id)?.status).toBe(
				"supported",
			);
		for (const structure of [
			"propword one",
			"contact clauses",
			"question tags",
			"past perfect simple",
			"if-clauses: type 2",
		])
			expect(
				coverage.rows.find((row) => row.competence === structure)?.status,
			).toBe("implemented");
		expect(coverage.neighbour.boundary).toContain("passive");
		expect(coverage.neighbour.boundary).toContain("type 3");
	});

	it("keeps the Grade 7 grammar boundary clear of Grade 8 topics", () => {
		expect(JSON.stringify(LESSONS)).not.toMatch(
			/passive|type 3|reported speech|reflexive|each other|participle construction/i,
		);
		// The passive is Grade 8 grammar. Learners never have to produce or choose
		// one; reading texts may show it receptively (e.g. "was crowned").
		const passive =
			/\b(?:is|are|was|were|be|been|being|isn't|aren't|wasn't|weren't)\s+(?:\w+ly\s+)?(\w+ed|built|made|written|given|sold|spoken|held|known|born|found|done|seen|taken|sung|shown|told|bought|brought|thrown|chosen|drawn|grown|hidden|stolen|worn|torn|kept|left|lost|lit|put|read|set|shut|cut|hit|run|won|taught|caught|paid|sent|spent)\b/gi;
		const adjectives = new Set(["skilled", "red", "amazed", "scared", "tired"]);
		const productive = [
			...LESSONS.map((lesson) =>
				JSON.stringify([
					lesson.quiz,
					lesson.practice,
					lesson.tasks,
					lesson.workshop,
					lesson.takeaway,
				]),
			),
			...items.map((item) => `${item.question} ${item.concept}`),
		].join(" ");
		const found = [...productive.matchAll(passive)].filter(
			(match) => !adjectives.has(match[1].toLowerCase()),
		);
		expect(found.map((match) => match[0])).toEqual([]);
		expect(productive).not.toMatch(/played with|was built|is used in/);
		expect(findLesson("e7-past-vs-perfect")!.paragraphs.join(" ")).toContain(
			"Simple Past",
		);
		expect(findLesson("e7-must-have-to")!.takeaway).toContain(
			"mustn't = nicht dürfen",
		);
	});
});

describe("explorers, geometry and schematic maps", () => {
	it("places every town, city, sight and port inside its region", () => {
		for (const town of Object.values(RB_TOWNS)) {
			expect(inside(town.pin, RB_BRITANNIA)).toBe(true);
			expect(inside(town.labelAt, RB_BRITANNIA)).toBe(true);
		}
		for (const point of RB_WALL) expect(inside(point, RB_BRITANNIA)).toBe(true);
		expect(inside([300, 80], RB_CALEDONIA)).toBe(true);
		const states = { ni: IE_NORTHERN_IRELAND, republic: IE_REPUBLIC } as const;
		for (const city of Object.values(IE_CITIES)) {
			expect(inside(city.pin, states[city.state])).toBe(true);
			expect(inside(city.labelAt, states[city.state])).toBe(true);
			const other = city.state === "ni" ? IE_REPUBLIC : IE_NORTHERN_IRELAND;
			expect(inside(city.pin, other)).toBe(false);
		}
		expect(IE_CITIES.belfast.pin[1]).toBeLessThan(IE_CITIES.dublin.pin[1]);
		expect(IE_CITIES.dublin.pin[1]).toBeLessThan(IE_CITIES.cork.pin[1]);
		expect(IE_CITIES.galway.pin[0]).toBeLessThan(IE_CITIES.dublin.pin[0]);
		for (const place of Object.values(DUBLIN_PLACES))
			expect(inside(place.pin, DUBLIN_BLOCKS[place.block])).toBe(true);
		// The Spire is north of the Liffey (y = 148), the other sights south of it.
		expect(DUBLIN_PLACES.spire.pin[1]).toBeLessThan(148);
		for (const id of ["templeBar", "trinity", "castle", "green"] as const)
			expect(DUBLIN_PLACES[id].pin[1]).toBeGreaterThan(148);
		// Walking south, Trinity College lies east (left) of the route at x = 300.
		expect(DUBLIN_BLOCKS.trinity[0][0]).toBeGreaterThan(300);
		expect(DUBLIN_BLOCKS.templeBar[1][0]).toBeLessThan(300);
		const lands = {
			america: AT_NORTH_AMERICA,
			ireland: AT_IRELAND,
			britain: AT_BRITAIN,
		} as const;
		for (const port of Object.values(AT_PORTS)) {
			expect(inside(port.pin, lands[port.land])).toBe(true);
		}
		for (const html of [
			renderRomanBritainMap(),
			renderIrelandMap(),
			renderDublinMap(),
			renderEmigrationMap(),
		]) {
			expect(html).not.toMatch(/NaN|undefined/);
			expect(html).toContain("data-map-focus");
		}
		expect(renderEmigrationMap()).toContain("1845–1852");
	});

	it("renders every workshop cleanly without NaN or undefined", () => {
		for (const lesson of LESSONS) {
			const html = renderWorkshop(lesson);
			expect(html, lesson.id).not.toMatch(/NaN|undefined/);
			expect(html).toContain("0 von 3 Zielen erreicht.");
		}
	});

	it("orders the history timeline and labels its eras", () => {
		const years = HISTORY_EVENTS.map((event) => event.year);
		expect([...years].sort((a, b) => a - b)).toEqual(years);
		expect(yearLabel(-55)).toBe("55 BC");
		expect(yearLabel(1066)).toBe("AD 1066");
		expect(historyEvent(0).era).toBe("celts");
		expect(HISTORY_EVENTS.find((event) => event.year === 43)?.era).toBe("romans");
		expect(HISTORY_EVENTS.find((event) => event.year === 122)?.en).toContain(
			"Hadrian's Wall",
		);
		expect(HISTORY_EVENTS.find((event) => event.year === 1066)?.era).toBe(
			"normans",
		);
		expect(historyEvent(99).year).toBe(1169);
		expect(historyEvent(-3).year).toBe(-500);
	});

	it("keeps since/for, past perfect, if-clause and tax readouts correct at every stop", () => {
		for (let start = 9; start <= 16; start++) {
			const info = sinceFor(start);
			expect(info.since).toBe(`since ${clockLabel(start)}`);
			expect(info.for).toBe(
				`for ${17 - start} ${17 - start === 1 ? "hour" : "hours"}`,
			);
			expect(info.en).not.toMatch(/NaN|undefined/);
		}
		expect(clockLabel(12)).toBe("12 noon");
		expect(clockLabel(13)).toBe("1 p.m.");
		expect(sinceFor(13).for).toBe("for 4 hours");
		expect(sinceFor(16).for).toBe("for 1 hour");
		for (let minute = 0; minute <= 30; minute += 5) {
			const scene = pastPerfectScene(minute);
			expect(scene.time).toMatch(/^10:[0-3]\d$/);
			if (minute > 15) expect(scene.en).toContain("had already left");
			else if (minute < 15) expect(scene.en).toContain("hadn't left yet");
			else expect(scene.en).toContain("was just leaving");
		}
		expect(conditionalPattern(0).en).toBe("If you heat ice, it melts.");
		expect(conditionalPattern(1).pattern).toContain("will");
		expect(conditionalPattern(2).pattern).toContain("simple past");
		expect(conditionalPattern(2).pattern).toContain("would");
		for (let price = 10; price <= 100; price += 5)
			for (let rate = 0; rate <= 10; rate++) {
				const { tax, total } = salesTax(price, rate);
				expect(Number.isFinite(total)).toBe(true);
				expect(Math.round(total * 100)).toBe(Math.round(price * 100 + tax * 100));
				expect(fmtDe(total, 2)).toMatch(/^\d+,\d{2}$/);
			}
		expect(salesTax(40, 7)).toEqual({ tax: 2.8, total: 42.8 });
		expect(usd(42.8)).toBe("$42.80");
		expect(fmtDe(-2.5, 1)).toBe("−2,5");
	});
});

describe("answer handling, progress and routes", () => {
	it("treats apostrophes equally while keeping whose distinct from who's", () => {
		expect(normalise(" I'm ")).toBe("i'm");
		expect(normalise("I’m")).toBe("i'm");
		expect(normalise("whose")).not.toBe(normalise("who's"));
		const lesson = findLesson("e7-question-tags")!;
		expect(checkPractice(lesson.practice, ["haven’t you", "doesn't she"])).toEqual([
			true,
			true,
		]);
		const modal = findLesson("e7-must-have-to")!;
		expect(checkPractice(modal.practice, ["needn't", "had"])).toEqual([
			false,
			true,
		]);
	});

	it("requires workshop, checks and a real self-assessed draft", () => {
		const progress = freshProgress();
		const id = progress.activeLessonId;
		expect(id).toBe("e7-celts");
		progress.quizDone.push(id);
		progress.practiceDone.push(id);
		updateDraft(progress, id, 1, "The Celts lived in roundhouses and hillforts.");
		progress.writingDone.push(writingKey(id, 1));
		expect(isComplete(progress, id)).toBe(false);
		progress.workshopDone.push(id);
		expect(isComplete(progress, id)).toBe(true);
		updateDraft(progress, id, 1, "Their priests were called Druids, too.");
		expect(isComplete(progress, id)).toBe(false);
		expect(canReview(" ".repeat(100))).toBe(false);
		expect(canAccept("A complete answer with enough text.", [true, true, false])).toBe(
			false,
		);
		expect(canAccept("A complete answer with enough text.", [true, true, true])).toBe(
			true,
		);
	});

	it("recovers corrupted state and isolates its storage key", () => {
		for (const raw of [null, "null", "[]", "42", "bad json"])
			expect(parseProgress(raw)).toEqual(freshProgress());
		expect(STORAGE_KEY).toBe("englisch_real7_academy_progress_v1");
		const progress = parseProgress(
			JSON.stringify({ workshopDone: ["bad", "e7-celts", "e7-celts"] }),
		);
		expect(progress.workshopDone).toEqual(["e7-celts"]);
	});

	it("keeps both task levels and all lesson deep links valid", () => {
		for (const lesson of LESSONS)
			for (const level of [1, 2] as const)
				expect(parseTrainingDeepLink(`#lesson=${lesson.id}&level=${level}`)).toEqual({
					lessonId: lesson.id,
					level,
				});
		expect(
			trainingBaseUrl("/englisch-realschule-7/", "?lesson=e7-celts&level=1&keep=yes"),
		).toBe("/englisch-realschule-7/?keep=yes");
	});
});

describe("ZAM content and proposal-only legacy mapping", () => {
	it("pins identifiers and keeps the mapping a proposal", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(ZAM_CELL_ID).toBe("zam-academy:englisch-realschule-7");
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.approved).toBeNull();
		expect(cell).not.toHaveProperty("retired_items");
		for (const item of items) expect(item).not.toHaveProperty("replaces");
		expect(
			cell.atoms.map((atom) => ({
				id: atom.id,
				slug: atom.slug,
				lesson: atom.source_link,
				items: atom.practice_items.map((item) => ({ id: item.id, slug: item.slug })),
			})),
		).toEqual(contract);
		const ids = [...cell.atoms, ...items].map((entry) => entry.id);
		expect(new Set(ids).size).toBe(180);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
	});

	it("has exactly one row per old card and proposes only same-retrieval transfers", () => {
		expect(mapping.rows).toHaveLength(legacyItems.length);
		expect(new Set(mapping.rows.map((row) => row.de_by_id)).size).toBe(
			legacyItems.length,
		);
		for (const row of mapping.rows) {
			const old = legacyItems.find((item) => item.id === row.de_by_id);
			expect(old).toBeDefined();
			expect(row.de_by_question).toBe(old!.question);
			expect(["A", "C"]).toContain(row.category);
			if (row.action === "propose-replace-after-approval") {
				expect(row.category).toBe("A");
				const successor = items.filter((item) => item.slug === row.academy_slug);
				expect(successor).toHaveLength(1);
				expect(successor[0].tier).toBe(old!.tier);
				expect(successor[0].question).toBe(old!.question);
				// Englisch 6 lists the card too (keep-active): Thomas decides.
				expect((row as { open_question?: string }).open_question).toContain(
					"Thomas",
				);
			} else {
				// AGENTS.md §6 knows only these actions for a proposal.
				expect(row.action).toBe("keep-active");
				expect(row.category).toBe("C");
				expect(row.academy_slug).toBeNull();
			}
			const neighbour = neighbourMapping.rows.find(
				(entry) => entry.de_by_id === row.de_by_id,
			);
			const successor = (row as { neighbour_successor?: string })
				.neighbour_successor;
			if (neighbour?.action === "replace")
				expect(successor).toBe(
					`zam-academy:englisch-realschule-6/${neighbour.academy_slug}`,
				);
			else expect(successor).toBeUndefined();
		}
		expect(
			mapping.rows.filter((row) => row.action === "propose-replace-after-approval"),
		).toHaveLength(2);
		expect(mapping.rows.filter((row) => row.action === "keep-active")).toHaveLength(14);
		expect(
			mapping.rows.filter(
				(row) => (row as { neighbour_successor?: string }).neighbour_successor,
			),
		).toHaveLength(5);
	});

	it.each(cell.atoms)(
		"links only to real lessons and Grade 7 Realschule curriculum: $slug",
		(atom) => {
			const lesson = findLesson(atom.slug)!;
			expect(lesson).toBeDefined();
			expect(atom.title).toBe(lesson.title);
			expect(atom.source_link).toBe(lessonLink(lesson.id));
			expect(atom.practice_items).toHaveLength(3);
			expect(new Set(atom.practice_items.map((item) => item.question)).size).toBe(
				3,
			);
			const lbBindings = atom.curricula.filter(
				(entry) => entry.provider === "lehrplanplus-bayern",
			);
			expect(lbBindings.map((entry) => entry.topic_code)).toEqual(
				lesson.bindings.map((binding) => `lb${binding}`),
			);
			for (const binding of lbBindings) {
				expect(binding).toMatchObject({
					school_type: "realschule",
					grade: 7,
					subject: "englisch",
				});
				expect(binding).not.toHaveProperty("track");
			}
			for (const edge of atom.prerequisites)
				expect(cell.atoms.some((other) => other.id === edge.atom_id)).toBe(true);
			for (const item of atom.practice_items) {
				expect(item.source_link).toBe(lessonLink(lesson.id));
				expect(item.question.length).toBeGreaterThan(15);
				expect(item.concept.length).toBeGreaterThan(2);
				expect(item.question).not.toMatch(/\s\?$/);
				expect(item).not.toHaveProperty("choice_distractors");
				if (item.fast_check) {
					expect(item.fast_check.options).toHaveLength(2);
					expect(item.fast_check.correct_index).toBe(0);
					expect(item.fast_check.options[0]).toBe(item.concept);
					expect(item.fast_check.options[1]).not.toBe(item.concept);
				} else expect(item.sample_solution).toBe(item.concept);
			}
		},
	);
});
