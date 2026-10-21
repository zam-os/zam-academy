import { describe, expect, it } from "vitest";
import tileData from "../cell.json";
import { escapeHtml } from "../src/html";
import {
	lessons,
	optionOrder,
	requiredLessons,
	validLessonId,
} from "../src/lessons";
import mainSource from "../src/main.ts?raw";
import {
	complete,
	freshProgress,
	loadProgress,
	STORAGE_KEY,
	saveProgress,
} from "../src/progress";
import { challenges } from "../src/simulator";
import simulationSource from "../src/simulator.ts?raw";

const tile = JSON.parse(JSON.stringify(tileData));
const pinned = [
	"net-netzwerk",
	"net-komponenten",
	"net-medien",
	"net-topologien",
	"net-datenrate",
	"net-mac-ip",
	"net-ipv4",
	"net-subnetze",
	"net-gateway",
	"net-dhcp",
	"net-dns",
	"net-schichten",
	"net-ethernet",
	"net-tcp-udp",
	"net-http",
	"net-smtp",
	"net-webreise",
	"net-fehlersuche",
	"net-https",
];
describe("curriculum and card contract", () => {
	it("pins lesson anchors and keeps the HTTPS extension outside core completion", () => {
		expect(lessons.map((lesson) => lesson.id)).toEqual(pinned);
		expect(requiredLessons).toHaveLength(18);
		expect(requiredLessons.some((lesson) => lesson.id === "net-https")).toBe(
			false,
		);
		expect(validLessonId("<script>")).toBe(pinned[0]);
	});
	it("gives each lesson a substantive explanation, practice and stable cell link", () => {
		const ids = new Set<string>();
		expect(tile.tile_id).toBe("zam-academy:datennetze");
		expect(tile.atoms).toHaveLength(lessons.length);
		for (const lesson of lessons) {
			expect(lesson.paragraphs).toHaveLength(3);
			expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(600);
			expect(lesson.quiz.options).toHaveLength(3);
			expect(new Set(lesson.quiz.options).size).toBe(3);
			expect(lesson.quiz.correct).toBeLessThan(lesson.quiz.options.length);
			if (lesson.activity.kind === "lab") {
				const activity = lesson.activity;
				expect(
					challenges().some((task) => task.id === activity.challenge),
				).toBe(true);
			}
			const atom = tile.atoms.find(
				(item: { slug: string }) => item.slug === lesson.id,
			);
			expect(atom).toBeDefined();
			expect(atom.source_link).toBe(
				`https://academy.zam-os.org/datennetze/#lesson=${lesson.id}`,
			);
			expect(atom.practice_items.length).toBeGreaterThanOrEqual(2);
			for (const item of [atom, ...atom.practice_items]) {
				expect(item.id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
				expect(ids.has(item.id)).toBe(false);
				ids.add(item.id);
				expect(item.source_link).toBe(atom.source_link);
			}
			const bindings = atom.curricula.filter(
				(binding: { provider: string }) =>
					binding.provider === "lehrplanplus-bayern",
			);
			expect(bindings.length).toBe(lesson.optional ? 0 : 1);
			for (const binding of bindings) {
				expect(binding.subject).toBe("it");
				expect(binding.topic_code).toBe("it-2.5.1");
				expect(binding.grade).toBeUndefined();
				expect(binding.track).toBeUndefined();
			}
		}
		expect(
			tile.atoms.flatMap(
				(atom: { practice_items: unknown[] }) => atom.practice_items,
			),
		).toHaveLength(38);
	});
	it("shuffles display order while retaining original indices for grading", () => {
		const positions = new Set<number>();
		for (const lesson of lessons) {
			const order = optionOrder(lesson.quiz.options.length, lesson.id);
			expect(optionOrder(lesson.quiz.options.length, lesson.id)).toEqual(order);
			expect([...order].sort()).toEqual([0, 1, 2]);
			const visibleCorrect = order.findIndex(
				(original) => original === lesson.quiz.correct,
			);
			positions.add(visibleCorrect);
			expect(lesson.quiz.options[order[visibleCorrect]]).toBe(
				lesson.quiz.options[lesson.quiz.correct],
			);
		}
		expect(positions.size).toBe(3);
	});
	it("keeps simulation local without network requests or dynamic code execution", () => {
		const main = mainSource;
		const simulation = simulationSource;
		expect(`${main}\n${simulation}`).not.toMatch(
			/\bfetch\s*\(|\beval\s*\(|new Function\s*\(|XMLHttpRequest|WebSocket\s*\(/,
		);
	});
	it("keeps learner markup literal in text and quoted attributes", () => {
		expect(escapeHtml('"><img src=x onerror="run()">')).toBe(
			"&quot;&gt;&lt;img src=x onerror=&quot;run()&quot;&gt;",
		);
		expect(escapeHtml("Tom & Lea's <3")).toBe("Tom &amp; Lea&#39;s &lt;3");
		expect(escapeHtml("&lt;script&gt;")).toBe("&amp;lt;script&amp;gt;");
	});
});
describe("progress storage", () => {
	function memory(initial: string | null = null) {
		let value = initial;
		return {
			getItem: () => value,
			setItem: (_key: string, input: string) => {
				value = input;
			},
		};
	}
	it("requires both understanding and application to complete a lesson", () => {
		const progress = freshProgress();
		progress.quiz.push(pinned[0]);
		expect(complete(progress, pinned[0])).toBe(false);
		progress.activities.push(pinned[0]);
		expect(complete(progress, pinned[0])).toBe(true);
	});
	it("round-trips lesson progress and network configuration", () => {
		const store = memory();
		const p = freshProgress();
		p.quiz.push(pinned[0]);
		p.network.gateway = "192.168.10.254";
		expect(saveProgress(store, p)).toBe(true);
		expect(loadProgress(store).progress).toEqual(p);
	});
	it("drops unknown lesson IDs, duplicate achievements and untrusted network types", () => {
		const { progress } = loadProgress(
			memory(
				JSON.stringify({
					version: 1,
					quiz: [pinned[0], pinned[0], "unknown", 42],
					activities: [],
					lab: ["dns", "dns", "unknown"],
					lastLesson: "bad",
					network: {
						clientIp: { injected: true },
						clientPrefix: "no",
						blockedPort: "root",
						gateway: "192.168.10.254",
					},
				}),
			),
		);
		expect(progress.quiz).toEqual([pinned[0]]);
		expect(progress.lab).toEqual(["dns"]);
		expect(progress.lastLesson).toBe(pinned[0]);
		expect(progress.network.clientIp).toBe("192.168.10.10");
		expect(progress.network.clientPrefix).toBe(24);
		expect(progress.network.blockedPort).toBe("none");
		expect(progress.network.gateway).toBe("192.168.10.254");
	});
	it("keeps the app usable when storage is blocked", () => {
		const blocked = {
			getItem: () => {
				throw new Error("blocked");
			},
			setItem: () => {
				throw new Error("blocked");
			},
		};
		expect(loadProgress(blocked)).toEqual({
			progress: freshProgress(),
			available: false,
		});
		expect(saveProgress(blocked, freshProgress())).toBe(false);
	});
	it("does not reuse an incompatible saved schema", () =>
		expect(
			loadProgress(memory('{"version":999,"quiz":["net-netzwerk"]}')).progress,
		).toEqual(freshProgress()));
	it("has a dedicated storage key", () =>
		expect(STORAGE_KEY).toBe("zam-academy-datennetze-v1"));
});
