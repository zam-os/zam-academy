import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
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
	const source = new URL("src/", root);
	for (const path of readdirSync(source, { recursive: true }).filter((path) =>
		/\.(?:ts|css|json)$/.test(path),
	)) {
		const content = readFileSync(new URL(path, source), "utf8");
		expect(content, path).not.toMatch(
			/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|getUserMedia|MediaRecorder|@import\s+(?:url\()?['"]https?:/,
		);
	}
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
