import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import { modelBlocks, renderLanguageModel } from "../src/language-model";
import { renderStoryModel } from "../src/story-model";

const lesson = (slug: string) => {
	const found = LESSONS.find((entry) => entry.id === `d6-${slug}`);
	if (!found) throw new Error(`Missing lesson ${slug}`);
	return found;
};
const decode = (text: string) =>
	text
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&gt;/g, ">")
		.replace(/&lt;/g, "<")
		.replace(/&amp;/g, "&");
const words = (slug: string, step: number) =>
	[
		...renderLanguageModel(lesson(slug), step).matchAll(
			/<strong>(.*?)<\/strong>/gs,
		),
	]
		.map((match) => decode(match[1]))
		.join(" ");
describe("Displayed examples and their teaching purpose", () => {
	it("separates microphone meaning from both Latin origin glosses", () => {
		expect(words("fremdwoerter", 0)).toContain("Mikrofon");
		expect(words("fremdwoerter", 0)).toContain("Schall");
		expect(words("fremdwoerter", 0)).not.toContain("ich höre");
		for (const term of ["audio", "video", "ich höre", "ich sehe"])
			expect(words("fremdwoerter", 1).toLowerCase()).toContain(term);
	});
	it("attaches boxing to the handtuch idiom and qualifies the separate proverb", () => {
		expect(words("redensarten", 1)).toContain("das Handtuch werfen");
		expect(words("redensarten", 1)).toContain("Boxsport");
		expect(words("redensarten", 2)).toContain(
			"Viele Köche verderben den Brei.",
		);
		expect(words("redensarten", 2)).toContain("keine ausnahmslose Regel");
		expect(words("redensarten", 2)).not.toContain("Boxsport");
	});
	it("shows active agent and object before changing to passive focus", () => {
		expect(
			lesson("aktiv-passiv").visual.steps.map((step) => step.label),
		).toEqual(["Aktiv", "Passiv", "Handelnde ergänzen"]);
		expect(words("aktiv-passiv", 0)).toBe("Die Klasse sortiert die Bücher.");
		expect(
			modelBlocks(lesson("aktiv-passiv"), 0).find(
				(block) => block.text === "die Bücher.",
			)?.label,
		).toContain("Akkusativobjekt");
		expect(words("aktiv-passiv", 1)).toBe("Die Bücher werden sortiert.");
		expect(words("aktiv-passiv", 2)).toBe(
			"Die Bücher werden von der Klasse sortiert.",
		);
	});
	it("uses aber for the announced contrast rather than a denn reason", () => {
		expect(words("satzverknuepfung", 0)).toBe(
			"Es regnet, aber wir gehen hinaus.",
		);
		expect(words("satzverknuepfung", 1)).toBe(
			"Wir bleiben drinnen, weil es regnet.",
		);
		expect(words("satzverknuepfung", 2)).toBe(
			"Als es klingelte, gingen wir hinaus.",
		);
	});
	it("keeps the finite verb lowercase and makes the nominalisation visible", () => {
		expect(lesson("nominalisierung").visual.steps[0].label).toBe("Verb");
		expect(words("nominalisierung", 0)).toBe("Wir lesen leise.");
		expect(words("nominalisierung", 0)).not.toContain("Lesen");
		expect(words("nominalisierung", 1)).toContain("Das Lesen macht Freude.");
		expect(words("nominalisierung", 1)).toContain(
			"Beim Lesen mache ich Notizen.",
		);
		expect(words("nominalisierung", 2)).toBe("etwas Neues das neue Buch");
	});
	it("shows both clause commas and the named speaker in direct speech", () => {
		expect(
			lesson("zeichensetzung").visual.steps.map((step) => step.label),
		).toEqual(["Nebensatz", "Einschub", "Direkte Rede"]);
		expect(words("zeichensetzung", 0)).toBe(
			"Wir bleiben drinnen, weil es regnet.",
		);
		expect(words("zeichensetzung", 1)).toBe(
			"Das Buch, das ich lese, ist spannend.",
		);
		expect(words("zeichensetzung", 2)).toBe("„Kommst du?“, fragt Mina.");
	});
	it("contrasts attributive and adverbial uses of the same adjective", () => {
		expect(words("wortarten", 2)).toBe(
			"das schnelle Kind das Kind läuft schnell",
		);
		for (const block of modelBlocks(lesson("wortarten"), 2))
			expect(block.label).toContain("Adjektiv");
	});
	it("uses the announced complete dass example rather than an unrelated fragment", () => {
		expect(words("das-dass", 2)).toContain("Ich hoffe, dass du kommst.");
	});
});

describe("Story models", () => {
	it("changes the camera framing and accessible description together", () => {
		for (const [index, framing, description] of [
			[0, "wide", "Totale"],
			[1, "detail", "Detailaufnahme"],
			[2, "low", "Untersicht"],
		] as const)
			expect(renderStoryModel("camera", index)).toMatch(
				new RegExp(`data-camera="${framing}".*aria-label="${description}`),
			);
	});
	it("lays a continuous thread across open tiles and returns to the entrance", () => {
		const tiles = (selection: number) =>
			Array.from(renderStoryModel("maze", selection).matchAll(/<span class="([^"]+)"/g), ([, classes]) => classes);
		const outward = tiles(1);
		const path = outward.flatMap((classes, index) => classes.includes("maze-thread") ? [index] : []);
		expect(tiles(-1).every((tile) => !tile.includes("maze-thread"))).toBe(true);
		expect(path.length).toBeGreaterThan(5);
		for (const [index, cell] of path.entries()) {
			expect(outward[cell]).toContain("maze-floor");
			if (index > 0) {
				const previous = path[index - 1];
				const distance = Math.abs(previous % 9 - cell % 9) + Math.abs(Math.floor(previous / 9) - Math.floor(cell / 9));
				expect(distance).toBe(1);
			}
		}
		expect(outward[path.at(-1)!]).toContain("maze-current");
		expect(tiles(2)[path[0]]).toContain("maze-current");
	});
});
