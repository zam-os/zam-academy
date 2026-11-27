import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import mainSource from "../src/main.ts?raw";
import contract from "./fixtures/public-contract.json";
import {
	CORE_LESSONS,
	findLesson,
	LESSONS,
	SOURCES,
	STAGES,
} from "../src/curriculum";
import { FIGURES, renderFigure } from "../src/figures";
import { ROME_HILLS, ROME_PLACES, renderRomeMap } from "../src/maps";
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
	STORAGE_KEY,
	updateDraft,
	writingKey,
} from "../src/storage/progress";
import {
	aciPreview,
	CALENDAR_MONTHS,
	calendarDates,
	DECLENSIONS,
	declensionForm,
	drawAciSvg,
	drawCalendarSvg,
	drawDeclensionSvg,
	drawGenericSvg,
	drawNumeralSvg,
	drawPantheonSvg,
	drawProsodySvg,
	drawTimelineSvg,
	INSPECTORS,
	numeralEntry,
	NUMERALS,
	PANTHEON_DATA,
	PROSODY_WORDS,
	renderWorkshop,
	ROME_TIMELINE_STATIONS,
	workshopGoals,
} from "../src/workshop";
import {
	lessonLink,
	parseTrainingDeepLink,
	trainingBaseUrl,
	ZAM_CELL_ID,
} from "../src/zam/zam-link";

const items = cell.atoms.flatMap((atom) => atom.practice_items);

describe("Grade 5 Gymnasium Latin teaching contract", () => {
	it("has eight stages, 44 lessons, 132 workshop goals and 132 ZAM cards", () => {
		expect(LESSONS).toHaveLength(44);
		expect(CORE_LESSONS).toHaveLength(44);
		expect(STAGES).toHaveLength(8);
		for (const stage of STAGES)
			expect(
				LESSONS.filter((lesson) => lesson.stage === stage.id).length,
			).toBeGreaterThanOrEqual(5);
		expect(new Set(STAGES.map((stage) => stage.hue)).size).toBe(8);
		expect(LESSONS.flatMap((lesson) => lesson.workshop.goals)).toHaveLength(132);
		expect(cell.atoms).toHaveLength(44);
		expect(items).toHaveLength(132);
		expect(
			LESSONS.filter((lesson) => lesson.recitation).map((lesson) => lesson.id),
		).toEqual([
			"l5-aussprache-betonung",
			"l5-romulus-koenige-quellen",
			"l5-vortrag-stellungnahme",
		]);
	});

	it.each(LESSONS)(
		"has substantial teaching, valid quiz and distinct tasks: $id",
		(lesson) => {
			expect(lesson.id).toMatch(/^l5-[a-z0-9-]+$/);
			expect(lesson.paragraphs).toHaveLength(2);
			expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(400);
			expect(lesson.material.length).toBeGreaterThan(80);
			expect(["la", "de"]).toContain(lesson.materialLanguage);
			expect(lesson.bindings.length).toBeGreaterThan(0);
			expect(new Set(lesson.bindings).size).toBe(lesson.bindings.length);
			expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
			expect(quizOptions(lesson)).toContain(lesson.quiz.answer);
			expect(lesson.quiz.explanation.length).toBeGreaterThan(15);
			for (const wrong of lesson.quiz.wrong) {
				expect(quizFeedback(lesson, wrong)).not.toContain(
					lesson.quiz.explanation,
				);
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
			}
			expect(
				checkPractice(
					lesson.practice,
					lesson.practice.map((entry) => entry.answers[0]),
				),
			).toEqual([true, true]);
			expect(checkPractice(lesson.practice, ["falsch", "falsch"])).toEqual([
				false,
				false,
			]);
			expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
			for (const task of Object.values(lesson.tasks)) {
				expect(task.criteria).toHaveLength(3);
				expect(task.model.length).toBeGreaterThan(35);
				expect(task.prompt.length).toBeGreaterThan(35);
			}
			for (const id of lesson.sourceIds)
				expect(SOURCES.some((source) => source.id === id)).toBe(true);
			expect(JSON.stringify(lesson)).not.toMatch(
				/<script|<p>|<div>|\\\\\(|teacherVideo/,
			);
			const visible = JSON.stringify({
				title: lesson.title,
				skill: lesson.skill,
				paragraphs: lesson.paragraphs,
				material: lesson.material,
				materialLabel: lesson.materialLabel,
				quiz: lesson.quiz,
				takeaway: lesson.takeaway,
				practice: lesson.practice,
				tasks: lesson.tasks,
				workshop: lesson.workshop,
			});
			expect(visible).not.toMatch(/\d\.\d/);
			expect(visible).not.toMatch(/\d\s-\s\d/);
			for (const goal of lesson.workshop.goals)
				expect(goal.before).not.toContain("→");
		},
	);

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
				expect(
					workshopGoals(lesson.workshop, answers).filter(Boolean),
				).toHaveLength(1);
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
		expect(coverage.rows).toHaveLength(53);
		expect(coverage.rows.map((row) => row.id)).toEqual(
			Array.from({ length: 53 }, (_, i) => `L5-${String(i + 1).padStart(2, "0")}`),
		);
		const mapped = new Set(coverage.rows.flatMap((row) => row.lessons));
		for (const lesson of LESSONS) expect(mapped.has(lesson.id)).toBe(true);
		for (const row of coverage.rows) {
			expect(["supported", "implemented"]).toContain(row.status);
			expect(row.evidence.length).toBeGreaterThan(40);
			for (const id of row.lessons) expect(findLesson(id)).toBeDefined();
		}
		for (const lesson of LESSONS) {
			const lbs = new Set(
				coverage.rows
					.filter((row) => row.lessons.includes(lesson.id))
					.map((row) => `L5 ${row.lb}`),
			);
			expect(new Set(lesson.bindings)).toEqual(lbs);
		}
		expect(coverage.neighbours.grade6.boundary).toContain("Passiv");
		expect(coverage.optional_lessons).toEqual([]);
	});

	it("keeps Grade 6+ grammar and topics out of Grade 5 lessons", () => {
		const text = JSON.stringify(LESSONS);
		expect(text).not.toMatch(
			/\b(Passiv|Konjunktiv|Partizip(?:ien)?|PPP|PPA|Participium Coniunctum|Pompeji|Vesuv|Hannibal|Ovid|Plinius)\b/,
		);
	});

	it("gives the free-text field the small shared-account note and resets texts too", () => {
		expect(mainSource).toContain("Hast du dein eigenes Benutzerkonto");
		expect(mainSource).toContain("Wo bleibt mein Text?");
		expect(mainSource).toContain("eigenen Texte und Häkchen");
		expect(mainSource).toContain("Hinweis für Eltern und Lehrkräfte");
	});
});

describe("concept figures and explorer models", () => {
	it("provides an interactive 3-part SVG concept figure for every lesson", () => {
		expect(Object.keys(FIGURES).sort()).toEqual(
			LESSONS.map((lesson) => lesson.id).sort(),
		);
		for (const lesson of LESSONS) {
			const fig = FIGURES[lesson.id];
			expect(fig.parts).toHaveLength(3);
			for (const focus of [0, 1, 2]) {
				const html = renderFigure(lesson.id, focus);
				expect(html).toContain("<svg");
				expect(html).toContain('data-part="1"');
				expect(html).toContain('data-part="2"');
				expect(html).toContain('data-part="3"');
				expect(html).not.toMatch(/NaN|undefined/);
			}
		}
	});

	it("validates prosody, declension, numerals, AcI, calendar, pantheon, timeline and generic labs", () => {
		expect(PROSODY_WORDS).toHaveLength(8);
		for (const entry of PROSODY_WORDS) {
			expect(entry.stressIndex).toBeGreaterThanOrEqual(0);
			expect(entry.stressIndex).toBeLessThan(entry.syllables.length);
			expect(drawProsodySvg(entry)).not.toMatch(/NaN|undefined/);
		}

		expect(DECLENSIONS.length).toBeGreaterThanOrEqual(7);
		for (const cls of DECLENSIONS) {
			for (const num of ["sg", "pl"] as const) {
				for (let k = 0; k < 5; k++) {
					const out = declensionForm(cls.id, num, k);
					expect(out.form.length).toBeGreaterThan(0);
					const svg = drawDeclensionSvg(cls.id, num, k);
					expect(svg).not.toMatch(/NaN|undefined/);
					if (out.ending.startsWith("-")) expect(svg).toContain(out.ending);
				}
			}
		}

		expect(NUMERALS).toHaveLength(12);
		for (let n = 1; n <= 12; n++) {
			const info = numeralEntry(n);
			expect(info.n).toBe(n);
			expect(drawNumeralSvg(info)).not.toMatch(/NaN|undefined/);
		}

		expect(aciPreview("pres", "pres").german).toContain("kommt");
		expect(aciPreview("pres", "perf").german).toContain("gekommen ist");
		expect(aciPreview("perf", "pres").german).toContain("kam");
		expect(aciPreview("perf", "perf").german).toContain("gekommen war");
		for (const m of ["pres", "perf"] as const)
			for (const i of ["pres", "perf"] as const)
				expect(drawAciSvg(m, i)).not.toMatch(/NaN|undefined/);

		expect(CALENDAR_MONTHS).toHaveLength(6);
		for (const m of CALENDAR_MONTHS) {
			const month = calendarDates(m.id);
			if (["mar", "mai", "iul", "oct"].includes(month.id)) {
				expect(month.nonen).toBe(7);
				expect(month.iden).toBe(15);
			} else {
				expect(month.nonen).toBe(5);
				expect(month.iden).toBe(13);
			}
			expect(drawCalendarSvg(month)).not.toMatch(/NaN|undefined/);
		}

		expect(PANTHEON_DATA).toHaveLength(12);
		PANTHEON_DATA.forEach((_, idx) =>
			expect(drawPantheonSvg(idx)).not.toMatch(/NaN|undefined/),
		);
		expect(ROME_TIMELINE_STATIONS).toHaveLength(6);
		ROME_TIMELINE_STATIONS.forEach((_, idx) =>
			expect(drawTimelineSvg(idx)).not.toMatch(/NaN|undefined/),
		);

		const specialKinds = new Set([
			"prosody",
			"declension",
			"numerals",
			"aci",
			"rome-map",
			"calendar",
			"pantheon",
			"timeline-rome",
		]);
		for (const lesson of LESSONS) {
			const kind = lesson.workshop.kind;
			if (!specialKinds.has(kind)) {
				expect(INSPECTORS[kind], lesson.id).toBeDefined();
				expect(INSPECTORS[kind].items.length).toBeGreaterThanOrEqual(3);
				expect(JSON.stringify(INSPECTORS[kind]), lesson.id).not.toMatch(
					/\d\.\d|\d\s-\s\d/,
				);
				INSPECTORS[kind].items.forEach((_, i) =>
					expect(drawGenericSvg(kind, i)).not.toMatch(/NaN|undefined/),
				);
			}
			const html = renderWorkshop(lesson);
			expect(html, lesson.id).toContain("<svg");
			expect(html, lesson.id).not.toMatch(/NaN|undefined/);
		}
	});

	it("renders the Rome topography map consistently across layers and landmarks", () => {
		expect(ROME_HILLS).toHaveLength(7);
		expect(ROME_PLACES.length).toBeGreaterThanOrEqual(9);
		for (const hill of ROME_HILLS) {
			expect(hill.cx).toBeGreaterThan(150);
			expect(hill.cx).toBeLessThan(600);
			expect(hill.cy).toBeGreaterThan(20);
			expect(hill.cy).toBeLessThan(310);
		}
		const kapitol = ROME_PLACES.find((p) => p.id === "kapitol")!;
		const palatin = ROME_PLACES.find((p) => p.id === "palatin")!;
		const ostia = ROME_PLACES.find((p) => p.id === "ostia")!;
		expect(kapitol.y).toBeLessThan(palatin.y);
		expect(ostia.x).toBeLessThan(140);
		expect(ostia.y).toBeGreaterThan(220);

		for (const layer of ["all", "hills", "politics", "games", "supply"] as const) {
			const map = renderRomeMap(layer, ostia.id);
			expect(map).toContain("Tiberinsel");
			expect(map).toContain("Forum Romanum");
			expect(map).toContain("Ostia");
			expect(map).not.toMatch(/NaN|undefined/);
		}
	});
});

describe("answer handling, progress and routes", () => {
	it("strips Latin macrons and breves while keeping German umlauts distinct", () => {
		expect(normalise("amīcus")).toBe("amicus");
		expect(normalise(" Rōma ")).toBe("roma");
		expect(normalise("mīlitēs")).toBe("milites");
		expect(normalise("m\u0103nus")).toBe("manus");
		expect(normalise("fröhlich")).not.toBe(normalise("frohlich"));
		expect(normalise("üben")).not.toBe(normalise("uben"));
		expect(normalise("wertschätzende")).not.toBe(normalise("wertschatzende"));
		expect(normalise("won’t")).toBe("won't");
	});

	it("requires workshop, checks, recitation when marked, and a real self-assessed draft", () => {
		const progress = freshProgress();
		const id = "l5-vortrag-stellungnahme";
		progress.quizDone.push(id);
		progress.practiceDone.push(id);
		progress.workshopDone.push(id);
		updateDraft(
			progress,
			id,
			1,
			"Der Frieden ist das Beste, was die Natur den Menschen gegeben hat.",
		);
		progress.writingDone.push(writingKey(id, 1));
		expect(isComplete(progress, id)).toBe(false);
		progress.recitation[id] = { synthetic: true, partner: false };
		expect(isComplete(progress, id)).toBe(true);
		updateDraft(progress, id, 1, "Neuer eigener Entwurf für die Stellungnahme.");
		expect(isComplete(progress, id)).toBe(false);

		const plainId = "l5-grundwortschatz-lernen";
		progress.quizDone.push(plainId);
		progress.practiceDone.push(plainId);
		progress.workshopDone.push(plainId);
		updateDraft(
			progress,
			plainId,
			1,
			"Ich merke mir zu jedem Substantiv den Nominativ, Genitiv und das Genus.",
		);
		progress.writingDone.push(writingKey(plainId, 1));
		expect(isComplete(progress, plainId)).toBe(true);

		expect(canReview(" ".repeat(100))).toBe(false);
		expect(
			canAccept("Eine eigene vollständige Antwort.", [true, true, false]),
		).toBe(false);
		expect(
			canAccept("Eine eigene vollständige Antwort.", [true, true, true]),
		).toBe(true);
	});

	it("recovers corrupted state and isolates its storage key", () => {
		for (const raw of [null, "null", "[]", "42", "bad json"])
			expect(parseProgress(raw)).toEqual(freshProgress());
		expect(STORAGE_KEY).toBe("zam-academy:latein-gymnasium-5:v1");
		const progress = parseProgress(
			JSON.stringify({
				workshopDone: ["bad", "l5-aussprache-betonung", "l5-aussprache-betonung", "l6-passiv"],
			}),
		);
		expect(progress.workshopDone).toEqual(["l5-aussprache-betonung"]);
	});

	it("keeps both task levels and all lesson deep links valid", () => {
		for (const lesson of LESSONS)
			for (const level of [1, 2] as const)
				expect(
					parseTrainingDeepLink(`#lesson=${lesson.id}&level=${level}`),
				).toEqual({
					lessonId: lesson.id,
					level,
				});
		expect(
			trainingBaseUrl("/latein-gymnasium-5/", "?lesson=l5-aci&level=1&keep=yes"),
		).toBe("/latein-gymnasium-5/?keep=yes");
	});
});

describe("ZAM content and proposal-only neighbouring inventory", () => {
	it("pins ULIDs and keeps proposal-only status without replaces or retired_items", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.approved).toBeNull();
		expect(mapping.rows).toEqual([]);
		expect(mapping.neighbouring_grade_review.cell_id).toBe(
			"de-by:gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen",
		);
		expect(JSON.stringify(cell)).not.toMatch(/"replaces"|"retired_items"/);
		expect(
			cell.atoms.map((atom) => ({
				id: atom.id,
				slug: atom.slug,
				lesson: atom.source_link,
				items: atom.practice_items.map((item) => ({
					id: item.id,
					slug: item.slug,
				})),
			})),
		).toEqual(contract);
		const ids = [...cell.atoms, ...items].map((entry) => entry.id);
		expect(new Set(ids).size).toBe(176);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
	});

	it.each(cell.atoms)(
		"links only to real lessons and the Grade 5 curriculum: $slug",
		(atom) => {
			const lesson = findLesson(atom.slug)!;
			expect(lesson).toBeDefined();
			expect(atom.source_link).toBe(lessonLink(lesson.id));
			expect(atom.practice_items).toHaveLength(3);
			expect(new Set(atom.practice_items.map((item) => item.question)).size).toBe(3);
			const bindings = atom.curricula.filter(
				(entry) => entry.provider === "lehrplanplus-bayern",
			);
			expect(bindings.map((entry) => entry.topic_code)).toEqual(
				lesson.bindings.map((lb) => `lb${lb.replace("L5 ", "")}`),
			);
			for (const binding of bindings) {
				expect(binding).toMatchObject({
					school_type: "gymnasium",
					grade: 5,
					subject: "latein",
				});
				expect(binding).not.toHaveProperty("track");
			}
			for (const edge of atom.prerequisites) {
				expect(edge.atom_id).not.toBe(atom.id);
				expect(cell.atoms.some((other) => other.id === edge.atom_id)).toBe(true);
			}
			for (const item of atom.practice_items) {
				expect(item.source_link).toBe(lessonLink(lesson.id));
				expect(item.question.length).toBeGreaterThan(15);
				expect(item.concept.length).toBeGreaterThan(2);
				expect(item.question).not.toMatch(/\s\?$/);
				const cardText = JSON.stringify([
					atom.title,
					item.question,
					item.concept,
					"sample_solution" in item ? item.sample_solution : "",
					"fast_check" in item && item.fast_check ? item.fast_check.options : [],
				]);
				expect(cardText).not.toMatch(/\d\.\d/);
				expect(cardText).not.toMatch(/\d\s-\s\d/);
				if ("fast_check" in item && item.fast_check) {
					expect(item.fast_check.options).toHaveLength(2);
					expect(item.fast_check.correct_index).toBe(0);
					expect(item.fast_check.options[0]).toBe(item.concept);
					expect(item.fast_check.options[1]).not.toBe(item.concept);
				} else expect((item as { sample_solution?: string }).sample_solution).toBe(item.concept);
			}
		},
	);
});
