import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import mapping from "../replaces-de-by.json";
import { LESSONS } from "../src/curriculum";
import {
	exploredGoals,
	modelBlocks,
	renderLanguageModel,
	renderModelGoals,
} from "../src/language-model";

const lesson = (id: string) => {
	const found = LESSONS.find((l) => l.id === `d5-${id}`);
	if (!found) throw new Error(`Missing lesson ${id}`);
	return found;
};
const card = (slug: string) => {
	const found = cell.atoms
		.flatMap((a) => a.practice_items)
		.find((i) => i.slug === `d5-${slug}`);
	if (!found) throw new Error(`Missing card ${slug}`);
	return found;
};

describe("Review corrections", () => {
	it("uses correct grammar and feedback independent of option positions", () => {
		expect(lesson("wortbildung").paragraphs[0]).toContain("hinter den Stamm");
		expect(lesson("wortbildung").paragraphs[0]).not.toContain("nach den Stamm");
		expect(lesson("satzbau").cases[0].feedback).toContain(
			"Nimmst du den Schirm mit?",
		);
		expect(lesson("satzbau").cases[0].feedback).not.toContain("zweite Satz");
		expect(lesson("pronomen").cases[0].feedback).toContain(
			"dritten Person Singular",
		);
	});
	it("keeps Grade 6 clause-series and relative-clause exercises out of Grade 5", () => {
		for (const id of ["satzbau", "kommas"]) {
			const text = JSON.stringify(lesson(id));
			expect(text).not.toMatch(/Satzreihe|Satzgefüge|Relativsatz/);
		}
		for (const slug of ["satzbau-recall", "kommas-recall"])
			expect(JSON.stringify(card(slug))).not.toMatch(/Satzreihe|Relativsatz/);
	});
	it("asks reusable knowledge without depending on an absent original passage", () => {
		expect(card("fabelhoeren-check").question).not.toContain(
			"Die Maus und das Blatt",
		);
		expect(card("fabelhoeren-check").concept).toContain("zentrales Ereignis");
		expect(card("ereignis-check").concept).not.toContain("Notizen");
		expect(card("ereignis-check").concept).toContain("30 Bücher");
		for (const slug of ["zuhoeren-recall", "lesetagebuch-recall"])
			expect(card(slug).sample_solution).not.toMatch(
				/^(Erkläre|Stelle|Beschreibe|Nenne) /,
			);
	});
	it("preserves the limiting detail of the listening passage and the Grimm example", () => {
		expect(lesson("zuhoeren").cases[0].answer).toContain("in der großen Pause");
		expect(lesson("zuhoeren").tasks[2].model).toContain("in der großen Pause");
		expect(JSON.stringify(lesson("maerchen"))).toContain(
			"dreizehn weisen Frauen",
		);
		expect(JSON.stringify(lesson("maerchen"))).not.toMatch(
			/zwölf Feen|Feen in Dornröschen/,
		);
		expect(lesson("vorgang").extension).not.toContain("Tierbild");
	});
	it("keeps related material distinct from an approved successor", () => {
		expect(mapping.approved).toBe("2026-11-19");
		for (const row of mapping.rows) {
			if (row.category === "C") expect(row).not.toHaveProperty("academy_slug");
			else expect(row).toHaveProperty("academy_slug", "d5-maerchen-check");
		}
	});
});

describe("Working language models", () => {
	const models = LESSONS.filter((l) => l.visual.initial);
	it("provides visible content and three reachable exploration goals for all 22 language lessons", () => {
		expect(models).toHaveLength(22);
		expect(models.map((l) => l.id)).toEqual(
			LESSONS.filter((l) => l.stage === "sprache").map((l) => l.id),
		);
		for (const l of models) {
			expect(modelBlocks(l, -1).length).toBeGreaterThan(0);
			expect(renderLanguageModel(l)).toContain("data-language-model");
			expect(renderModelGoals(l)).not.toContain('data-model-reached="true"');
			expect(exploredGoals(new Set())).toEqual([false, false, false]);
			expect(exploredGoals(new Set([0, 1, 2]))).toEqual([true, true, true]);
			for (const index of [0, 1, 2]) {
				expect(modelBlocks(l, index)).not.toEqual(modelBlocks(l, -1));
				const html = renderLanguageModel(l, index);
				expect(html).not.toMatch(/NaN|undefined/);
				expect(
					modelBlocks(l, index).every((b) => b.text.length && b.label.length),
				).toBe(true);
			}
		}
	});
	it("moves whole sentence parts while preserving the finite verb in second position", () => {
		const l = lesson("satzglieder");
		for (const [index, first] of [
			[0, "Nele"],
			[1, "Dem Hund"],
			[2, "Einen Napf"],
		] as const) {
			const parts = modelBlocks(l, index);
			expect(parts[0].text).toBe(first);
			expect(parts[1].text).toBe("gibt");
			expect(parts.filter((b) => b.tone === "predicate")).toHaveLength(1);
		}
	});
	it("shows real inflection, verb brackets and line-end groups", () => {
		const words = (id: string, index: number) =>
			modelBlocks(lesson(id), index).map((b) => b.text);
		expect(words("faelle", 0).join(" ")).toBe("des flinken Hundes");
		expect(words("faelle", 1).join(" ")).toBe("dem flinken Hund");
		expect(words("faelle", 2).join(" ")).toBe("den flinken Hund");
		expect(words("zeitformen", 2).join(" ")).toBe(
			"Ich werde es beschriftet haben.",
		);
		expect(words("silbentrennung", 0).join("-")).toBe("ba-cken");
		expect(words("silbentrennung", 1).join("-")).toBe("wa-schen");
		expect(words("woertliche-rede", 1).join(" ")).toBe(
			"„Ich komme morgen“ , sagt Mia.",
		);
		expect(words("satzklammer", 1).join(" ")).toBe(
			"Das Mädchen hat das Heft aufgeschlagen.",
		);
		expect(words("nominalisierung", 0).join(" ")).toBe("beim Lesen");
		expect(words("aehnliche-woerter", 0).join(" ")).toBe("Ihr seid bereit.");
	});
	it("addresses PR 147 grammar and factual review corrections", () => {
		const nom = lesson("nominalisierung");
		expect(nom.paragraphs[1]).toContain("viel gutes Essen");
		expect(nom.quiz.explanation).toContain("viel gutes Essen");
		expect(nom.visual.steps[2].detail).toContain("viel gutes Essen");
		const sk = lesson("satzklammer");
		expect(sk.tasks[2].model).toContain("geräumt");
		expect(sk.tasks[2].model).toContain("räumen");
		expect(sk.tasks[2].model).not.toMatch(/aufgeräumt|aufräumen/);
		const hom = lesson("aehnliche-woerter");
		expect(hom.material).toContain("zweiten [Saite/Seite] einer Geige");
		expect(hom.tasks[1].model).toContain("zweiten Saite einer Geige");
		expect(JSON.stringify(hom)).not.toContain("zehnten");
	});
});
