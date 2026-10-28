import { afterEach, describe, expect, it, vi } from "vitest";
import { LESSONS } from "../src/curriculum";
import {
	freshProgress,
	STORAGE_KEY,
	writingKey,
} from "../src/storage/progress";

// A small event/DOM fixture exercises the real main.ts handlers without adding
// a DOM dependency. Browser verification additionally checks real rendering.
async function openApp(route = "", initial = freshProgress()) {
	vi.resetModules();
	const stored = new Map<string, string>([
		[STORAGE_KEY, JSON.stringify(initial)],
	]);
	const widgets = new Map<string, ElementFixture>();
	let quiz: ElementFixture[] = [];
	let groups: ElementFixture[] = [];
	let criteria: ElementFixture[] = [];
	let lessonButtons: ElementFixture[] = [];
	const decode = (s: string) =>
		s
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&amp;/g, "&");
	class ElementFixture extends EventTarget {
		dataset: Record<string, string | undefined> = {};
		attrs = new Map<string, string>();
		value = "";
		textContent = "";
		checked = false;
		disabled = false;
		hidden = true;
		inputs: ElementFixture[] = [];
		private html = "";
		classList = { toggle: vi.fn() };
		focus = vi.fn();
		scrollIntoView = vi.fn();
		showModal = vi.fn();
		close = vi.fn();
		constructor(readonly id = "") {
			super();
		}
		set innerHTML(html: string) {
			this.html = html;
			mount(this, html);
		}
		get innerHTML() {
			return this.html;
		}
		setAttribute(name: string, value: string) {
			this.attrs.set(name, value);
		}
		removeAttribute(name: string) {
			this.attrs.delete(name);
		}
		remove() {
			widgets.delete(`#${this.id}`);
		}
		querySelector(selector: string) {
			if (selector === "input:checked")
				return this.inputs.find((i) => i.checked) ?? null;
			return widgets.get(selector) ?? null;
		}
		querySelectorAll(selector: string) {
			if (selector === ".quiz-choice") return quiz;
			if (selector === "[data-case]") return groups;
			if (selector === "[data-case] input")
				return groups.flatMap((g) => g.inputs);
			if (selector === ".criterion") return criteria;
			if (selector === "[data-lesson]") return lessonButtons;
			return [];
		}
		async click() {
			if (!this.disabled)
				this.dispatchEvent(new Event("click", { cancelable: true }));
			await Promise.resolve();
		}
	}
	function mount(owner: ElementFixture, html: string) {
		if (owner.id === "main") {
			widgets.clear();
			quiz = [];
			groups = [];
			criteria = [];
			lessonButtons = [];
		}
		if (owner.id === "comparison") {
			widgets.delete("#accept");
			criteria = [];
		}
		for (const match of html.matchAll(/\bid="([^"]+)"/g)) {
			const id = match[1];
			const node = new ElementFixture(id);
			const tag = html.slice(
				html.lastIndexOf("<", match.index),
				html.indexOf(">", match.index) + 1,
			);
			node.disabled = /\bdisabled\b/.test(tag);
			if (id === "level")
				node.value = /<option value="2" selected/.test(html) ? "2" : "1";
			if (id === "draft")
				node.value = decode(
					html.match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/)?.[1] ?? "",
				);
			widgets.set(`#${id}`, node);
		}
		for (const match of html.matchAll(
			/<button class="quiz-choice">([\s\S]*?)<\/button>/g,
		)) {
			const node = new ElementFixture();
			node.textContent = decode(match[1]);
			quiz.push(node);
		}
		for (const match of html.matchAll(
			/<fieldset class="case" data-case="\d+">([\s\S]*?)<\/fieldset>/g,
		)) {
			const group = new ElementFixture();
			for (const input of match[1].matchAll(/<input\b[^>]*>/g)) {
				const node = new ElementFixture();
				node.value = decode(input[0].match(/value="([^"]*)"/)?.[1] ?? "");
				node.checked = /\bchecked\b/.test(input[0]);
				group.inputs.push(node);
			}
			groups.push(group);
		}
		for (const _ of html.matchAll(/class="criterion"/g))
			criteria.push(new ElementFixture());
		for (const match of html.matchAll(
			/<button[^>]*data-lesson="([^"]+)"[^>]*>/g,
		)) {
			const node = new ElementFixture();
			node.dataset.lesson = match[1];
			lessonButtons.push(node);
		}
	}
	const main = new ElementFixture("main");
	const staticNodes = new Map(
		[
			"main",
			"dialog",
			"home",
			"theme",
			"zam",
			"reset",
			"progress-strip",
			"storage-warning",
		].map((id) => [`#${id}`, id === "main" ? main : new ElementFixture(id)]),
	);
	staticNodes.set(".skip-link", new ElementFixture());
	const nav = ["path", "reference"].map((view) => {
		const node = new ElementFixture();
		node.dataset.view = view;
		return node;
	});
	const url = new URL(`http://localhost/deutsch-realschule-8/${route}`);
	const windowFixture = Object.assign(new EventTarget(), { scrollTo: vi.fn() });
	vi.stubGlobal("document", {
		documentElement: { dataset: {} },
		querySelector: (q: string) => staticNodes.get(q) ?? widgets.get(q) ?? null,
		querySelectorAll: (q: string) => (q === "[data-view]" ? nav : []),
	});
	vi.stubGlobal("window", windowFixture);
	vi.stubGlobal("location", url);
	vi.stubGlobal("history", {
		replaceState: (_data: unknown, _title: string, next: string) => {
			url.href = new URL(next, url).href;
		},
	});
	vi.stubGlobal("localStorage", {
		getItem: (key: string) => stored.get(key) ?? null,
		setItem: (key: string, value: string) => {
			stored.set(key, value);
		},
	});
	vi.stubGlobal("navigator", {});
	vi.stubGlobal("matchMedia", () => ({ matches: false }));
	await import("../src/main");
	return {
		url,
		stored,
		node: (id: string) => {
			const node = widgets.get(`#${id}`) ?? staticNodes.get(`#${id}`);
			if (!node) throw new Error(`Missing fixture element: ${id}`);
			return node;
		},
		quiz: () => quiz,
		criteria: () => criteria,
		groups: () => groups,
		chooseCase: (index: number, value: string) => {
			for (const input of groups[index].inputs)
				input.checked = input.value === value;
			groups[index].inputs
				.find((input) => input.checked)
				?.dispatchEvent(new Event("change"));
		},
		read: () => JSON.parse(stored.get(STORAGE_KEY) ?? "null"),
	};
}
afterEach(() => vi.unstubAllGlobals());

describe("Actual page event handlers", () => {
	it.each(["?level=1&from=zam", "#level=1"])(
		"clears stale level routes after a select change: %s",
		async (route) => {
			const app = await openApp(route);
			const level = app.node("level");
			level.value = "2";
			level.dispatchEvent(new Event("change"));
			expect(app.url.hash).toBe("");
			expect(app.url.searchParams.has("level")).toBe(false);
			expect(app.read().level).toBe(2);
			expect(app.node("level").value).toBe("2");
			if (route.includes("from=zam"))
				expect(app.url.searchParams.get("from")).toBe("zam");
		},
	);
	it.each(["d8-kommas", "d8-konjunktiv1", "d8-belege"])(
		"does not disclose %s's explanation on a wrong click",
		async (id) => {
			const lesson = LESSONS.find((l) => l.id === id);
			if (!lesson) throw new Error("Missing lesson");
			const app = await openApp(`#lesson=${id}`);
			await app
				.quiz()
				.find((button) => button.textContent === lesson.quiz.wrong[0])
				?.click();
			expect(app.node("quiz-feedback").innerHTML).toContain(
				"Lies die drei Antworten noch einmal",
			);
			expect(app.node("quiz-feedback").innerHTML).not.toContain(
				lesson.quiz.explanation,
			);
			expect(app.read().quizDone).not.toContain(id);
			await app
				.quiz()
				.find((button) => button.textContent === lesson.quiz.answer)
				?.click();
			expect(app.node("quiz-feedback").innerHTML).toContain(
				lesson.quiz.explanation
					.replace(/&/g, "&amp;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
					.replace(/"/g, "&quot;")
					.replace(/'/g, "&#39;"),
			);
			expect(app.read().quizDone).toContain(id);
		},
	);
	it("preserves checked cases until a new form submission, including across a level change", async () => {
		const lesson = LESSONS[0];
		const initial = freshProgress();
		initial.cases[lesson.id] = lesson.cases.map((c) => c.answer);
		const app = await openApp(`#lesson=${lesson.id}`, initial);
		const wrong =
			lesson.cases[0].options.find((o) => o !== lesson.cases[0].answer) ?? "";
		app.chooseCase(0, wrong);
		expect(app.read().cases[lesson.id]).toEqual(initial.cases[lesson.id]);
		const level = app.node("level");
		level.value = "2";
		level.dispatchEvent(new Event("change"));
		expect(
			app
				.groups()
				.map((group) => group.inputs.find((input) => input.checked)?.value),
		).toEqual(initial.cases[lesson.id]);
		app.chooseCase(0, wrong);
		app
			.node("cases-form")
			.dispatchEvent(new Event("submit", { cancelable: true }));
		expect(app.read().cases[lesson.id]).toEqual([
			wrong,
			lesson.cases[1].answer,
		]);
	});
	it("shows a remotely changed draft without retaining an obsolete model comparison", async () => {
		const lesson = LESSONS[0];
		const initial = freshProgress();
		const key = writingKey(lesson.id, 1);
		initial.drafts[key] = "Ein ursprünglicher ausreichend langer Entwurf.";
		const app = await openApp(`#lesson=${lesson.id}`, initial);
		await app.node("compare").click();
		expect(app.node("comparison").innerHTML).toContain(
			"Meine Selbsteinschätzung",
		);
		const remote = app.read();
		remote.drafts[key] = "Ein neuer Text aus einem zweiten geöffneten Tab.";
		app.stored.set(STORAGE_KEY, JSON.stringify(remote));
		await app
			.quiz()
			.find((button) => button.textContent === lesson.quiz.answer)
			?.click();
		expect(app.node("draft").value).toBe(remote.drafts[key]);
		expect(app.node("comparison").innerHTML).toBe("");
		expect(app.node("writing-status").textContent).toContain("anderen Tab");
	});
	it("keeps an explicit wrong click wrong when another tab has completed the quiz", async () => {
		const lesson = LESSONS[0];
		const app = await openApp(`#lesson=${lesson.id}`);
		const remote = app.read();
		remote.quizDone.push(lesson.id);
		app.stored.set(STORAGE_KEY, JSON.stringify(remote));
		await app
			.quiz()
			.find((button) => button.textContent === lesson.quiz.wrong[0])
			?.click();
		expect(app.read().quizDone).not.toContain(lesson.id);
	});
	it("stores an explicit correct resubmission even when it equals the tab's original cases", async () => {
		const lesson = LESSONS[0];
		const initial = freshProgress();
		initial.cases[lesson.id] = lesson.cases.map((c) => c.answer);
		const app = await openApp(`#lesson=${lesson.id}`, initial);
		const remote = app.read();
		remote.cases[lesson.id] = lesson.cases.map((c) =>
			c.options.find((o) => o !== c.answer),
		);
		app.stored.set(STORAGE_KEY, JSON.stringify(remote));
		app
			.node("cases-form")
			.dispatchEvent(new Event("submit", { cancelable: true }));
		expect(app.read().cases[lesson.id]).toEqual(initial.cases[lesson.id]);
	});

	it("saves a fresh explicit comparison even if that tab had already confirmed the same text", async () => {
		const lesson = LESSONS[0];
		const initial = freshProgress();
		const key = writingKey(lesson.id, 1);
		initial.drafts[key] = "Ein unveränderter ausreichend langer Entwurf.";
		initial.writingDone.push(key);
		const app = await openApp(`#lesson=${lesson.id}`, initial);
		const remote = app.read();
		remote.writingDone = [];
		app.stored.set(STORAGE_KEY, JSON.stringify(remote));
		await app.node("compare").click();
		for (const criterion of app.criteria()) {
			criterion.checked = true;
			criterion.dispatchEvent(new Event("change"));
		}
		await app.node("accept").click();
		expect(app.read().writingDone).toContain(key);
	});
	it("does not attach an explicit stale comparison to a different remote text", async () => {
		const lesson = LESSONS[0];
		const initial = freshProgress();
		const key = writingKey(lesson.id, 1);
		initial.drafts[key] = "Der ursprüngliche Text für diesen Vergleich.";
		const app = await openApp(`#lesson=${lesson.id}`, initial);
		await app.node("compare").click();
		for (const criterion of app.criteria()) {
			criterion.checked = true;
			criterion.dispatchEvent(new Event("change"));
		}
		const remote = app.read();
		remote.drafts[key] = "Der geänderte Text aus einem anderen Tab.";
		app.stored.set(STORAGE_KEY, JSON.stringify(remote));
		await app.node("accept").click();
		expect(app.read().writingDone).not.toContain(key);
		expect(app.node("draft").value).toBe(remote.drafts[key]);
		expect(app.node("writing-status").textContent).toContain(
			"erneut vergleichen",
		);
	});
});
