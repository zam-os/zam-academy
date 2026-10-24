import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { expect, it } from "vitest";

const root = new URL("../", import.meta.url);
it("pins the original legacy source snapshot byte-for-byte", () => {
	const mapping = JSON.parse(
		readFileSync(new URL("replaces-de-by.json", root), "utf8"),
	);
	for (const source of mapping.sources) {
		const bytes = readFileSync(new URL(source.file, root));
		expect(createHash("sha256").update(bytes).digest("hex")).toBe(
			source.sha256,
		);
	}
});
it("ships no automatic network, microphone or remote voice paths", () => {
	const main = readFileSync(new URL("src/main.ts", root), "utf8");
	expect(main).not.toMatch(
		/\bfetch\s*\(|XMLHttpRequest|getUserMedia|MediaRecorder/,
	);
	const html = readFileSync(new URL("index.html", root), "utf8");
	expect(html).not.toMatch(/<iframe|<video|<audio|src=["']https?:/i);
});

it("keeps authored card questions and answers only in cell.json", () => {
	const lessons = JSON.parse(
		readFileSync(new URL("src/curriculum/lessons.json", root), "utf8"),
	);
	for (const lesson of lessons) {
		expect(lesson.recall).toBeUndefined();
		expect(lesson.quiz.question).toBeUndefined();
		expect(lesson.quiz.answer).toBeUndefined();
	}
	expect(existsSync(new URL("scripts/generate-cell.mjs", root))).toBe(false);
});
