import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import { modelBlocks, renderLanguageModel } from "../src/language-model";
import { renderVisual } from "../src/visuals";

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
const attributes = (tag: string) =>
	Object.fromEntries(
		[...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((match) => [
			match[1],
			match[2],
		]),
	);

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
	it("shows different verb requirements and a separate number agreement pair", () => {
		for (const sentence of [
			"Das Kind schläft.",
			"Mina schenkt ihrem Bruder ein Buch.",
			"Jo legt das Heft auf den Tisch.",
		])
			expect(words("satzkern", 0)).toContain(sentence);
		expect(words("satzkern", 1)).toBe("Mina schenkt ihrem Bruder ein Buch.");
		expect(
			modelBlocks(lesson("satzkern"), 1).find(
				(block) => block.text === "ihrem Bruder",
			)?.label,
		).toContain("Dativobjekt");
		expect(
			modelBlocks(lesson("satzkern"), 1).find(
				(block) => block.text === "ein Buch.",
			)?.label,
		).toContain("Akkusativobjekt");
		expect(words("satzkern", 2)).toBe("Das Kind liest. Die Kinder lesen.");
	});
	it("uses aber for the announced contrast rather than a denn reason", () => {
		expect(words("satzverknuepfung", 0)).toBe(
			"Es regnet, aber wir gehen hinaus.",
		);
		expect(words("satzverknuepfung", 1)).toBe(
			"Wir bleiben drinnen, weil es regnet.",
		);
		expect(words("satzverknuepfung", 2)).toBe(
			"Obwohl es regnet, gehen wir hinaus.",
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

describe("Listening route geometry", () => {
	it("passes the library, turns right immediately behind it and labels the destination building", () => {
		const html = renderVisual(lesson("wege-hoeren"));
		const path = html.match(/<path d="([^"]+)"/)?.[1];
		if (!path) throw new Error("Missing walking route");
		const points: { x: number; y: number }[] = [];
		let point = { x: 0, y: 0 };
		for (const command of path.match(/[MLHV][^MLHV]*/g) ?? []) {
			const values = command
				.slice(1)
				.trim()
				.split(/[\s,]+/)
				.map(Number);
			if (command[0] === "M" || command[0] === "L")
				point = { x: values[0], y: values[1] };
			else if (command[0] === "H") point = { ...point, x: values[0] };
			else point = { ...point, y: values[0] };
			points.push(point);
		}
		expect(points).toHaveLength(4);
		const [start, fountain, turn, entrance] = points;
		expect(fountain.x).toBe(start.x);
		expect(fountain.y).toBeLessThan(start.y);
		expect(turn.y).toBe(fountain.y);
		expect(turn.x).toBeLessThan(fountain.x);
		expect(entrance.x).toBe(turn.x);
		expect(entrance.y).toBeLessThan(turn.y);
		const rect = (kind: string) =>
			attributes(
				html.match(new RegExp(`<rect[^>]*class="${kind}"[^>]*>`))?.[0] ?? "",
			);
		const library = rect("book");
		const centre = rect("castle");
		expect(Number(library.y) + Number(library.height)).toBeLessThan(turn.y);
		expect(turn.x).toBeLessThan(Number(library.x));
		expect(Number(library.x) - turn.x).toBeLessThanOrEqual(
			Number(library.width),
		);
		expect(entrance.x).toBeGreaterThan(Number(centre.x));
		expect(entrance.x).toBeLessThan(Number(centre.x) + Number(centre.width));
		expect(entrance.y).toBe(Number(centre.y) + Number(centre.height));
		const label = attributes(
			html.match(/<text[^>]*>Jugendzentrum<\/text>/)?.[0] ?? "",
		);
		expect(Number(label.x)).toBe(entrance.x);
		expect(Number(label.y)).toBeLessThan(Number(centre.y));
		expect(Number(centre.y) - Number(label.y)).toBeLessThan(40);
	});
});
