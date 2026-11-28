import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = process.env.BROWSER_QA_DIR ?? join(tmpdir(), "zam-e8s-browser");
mkdirSync(output, { recursive: true });
const lessons = JSON.parse(readFileSync(`${root}/src/curriculum/lessons.json`));
const profile = mkdtempSync(join(tmpdir(), "zam-english8-2fs-browser-"));
const chrome = spawn(
	process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
	[
		"--headless=new",
		"--remote-debugging-pipe",
		"--no-first-run",
		"--disable-background-networking",
		"--disable-component-update",
		"--disable-sync",
		"--disable-default-apps",
		"--no-default-browser-check",
		`--user-data-dir=${profile}`,
		"about:blank",
	],
	{ stdio: ["ignore", "ignore", "pipe", "pipe", "pipe"] },
);
let seq = 0;
let buffer = "";
const pending = new Map();
const closed = new Promise((resolve) => chrome.once("close", resolve));
chrome.on("error", (error) => {
	for (const job of pending.values()) job.reject(error);
});
const errors = [];
const requests = [];
chrome.stdio[4].on("data", (chunk) => {
	buffer += chunk.toString();
	let index;
	while ((index = buffer.indexOf("\0")) >= 0) {
		const line = buffer.slice(0, index);
		buffer = buffer.slice(index + 1);
		if (!line) continue;
		const msg = JSON.parse(line);
		if (msg.id) {
			const job = pending.get(msg.id);
			pending.delete(msg.id);
			if (!job) continue;
			if (msg.error) job.reject(Error(JSON.stringify(msg.error)));
			else job.resolve(msg.result);
		} else {
			if (msg.method === "Runtime.exceptionThrown") errors.push(msg.params.exceptionDetails);
			if (msg.method === "Network.requestWillBeSent") requests.push(msg.params.request.url);
		}
	}
});
function send(method, params = {}, sessionId, timeout = 15000) {
	return new Promise((resolve, reject) => {
		const id = ++seq;
		const timer = setTimeout(() => {
			pending.delete(id);
			const hint = params?.expression ? ` [${String(params.expression).slice(0, 120)}]` : "";
			reject(Error(`Chrome timed out: ${method}${hint}`));
		}, timeout);
		pending.set(id, {
			resolve: (value) => {
				clearTimeout(timer);
				resolve(value);
			},
			reject: (error) => {
				clearTimeout(timer);
				reject(error);
			},
		});
		chrome.stdio[3].write(
			`${JSON.stringify({
				id,
				method,
				params,
				...(sessionId ? { sessionId } : {}),
			})}\0`,
		);
	});
}
let session;
const page = (method, params) => send(method, params, session);
const evaluate = async (expression) => {
	const value = await page("Runtime.evaluate", {
		expression,
		returnByValue: true,
		awaitPromise: true,
	});
	if (value.exceptionDetails) throw Error(JSON.stringify(value.exceptionDetails));
	return value.result.value;
};
const screenshot = async (name) => {
	const result = await page("Page.captureScreenshot", {
		format: "png",
		captureBeyondViewport: true,
	});
	writeFileSync(`${output}/${name}.png`, Buffer.from(result.data, "base64"));
};
const frame = () => evaluate("new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))");
const route = async (hash) => {
	await evaluate(`new Promise(r => {
		const target = ${JSON.stringify(hash)};
		const norm = h => h.replace(/^#/, "");
		if (norm(location.hash) === norm(target)) { r(); return; }
		const onHash = () => { removeEventListener("hashchange", onHash); r(); };
		addEventListener("hashchange", onHash);
		location.hash = target;
	})`);
	await frame();
};

const targets = [];
async function openTab(width, height, mobile) {
	const { targetId } = await send("Target.createTarget", { url: "about:blank" }, undefined, 60000);
	targets.push(targetId);
	session = (await send("Target.attachToTarget", { targetId, flatten: true })).sessionId;
	await page("Page.enable");
	await page("Runtime.enable");
	await page("Network.enable");
	await page("Emulation.setDeviceMetricsOverride", {
		width,
		height,
		deviceScaleFactor: 1,
		mobile,
	});
	await page("Page.navigate", {
		url: pathToFileURL(join(root, "dist/index.html")).href,
	});
	for (let i = 0; i < 100; i++) {
		if (await evaluate('!!document.querySelector(".hero")')) break;
		await new Promise((r) => setTimeout(r, 25));
	}
	return { targetId, sessionId: session };
}

const sample = new Set([
	"e8s-podcast-can",
	"e8s-past-perfect",
	"e8s-conditional-two",
	"e8s-two-objects",
	"e8s-canada-geo",
	"e8s-na-holidays",
	"e8s-desert-southwest",
	"e8s-wales-uk-us-politics",
	"e8s-henry-viii",
	"e8s-mayflower-colonies",
	"e8s-film-media-literacy",
]);
let states = 0;
try {
	for (const [width, height, mobile, theme] of [
		[1280, 1150, false, "light"],
		[1280, 1150, false, "dark"],
		[720, 1024, false, "light"],
		[375, 812, true, "light"],
		[375, 812, true, "dark"],
	]) {
		const tab = await openTab(width, height, mobile);
		session = tab.sessionId;
		await evaluate(`document.documentElement.dataset.theme = ${JSON.stringify(theme)}`);
		assert.equal(
			await evaluate('document.querySelectorAll(".lesson-link").length'),
			lessons.length,
		);
		assert.equal(await evaluate("document.documentElement.scrollWidth > innerWidth"), false);
		if (width !== 720) await screenshot(`path-${width}-${theme}`);

		for (const lesson of lessons) {
			for (const level of [1, 2]) {
				await route(`#lesson=${lesson.id}&level=${level}`);
				const rendered = await evaluate(`(() => {
					const svg = document.querySelector(".workshop svg");
					const svgRect = svg ? svg.getBoundingClientRect() : null;
					const opts = document.querySelector(".explorer-options");
					const pieces = [...document.querySelectorAll(".workshop [data-piece]")];
					const minPieceRatio = opts && opts.getBoundingClientRect().width > 0
						? Math.min(...pieces.map(p => p.getBoundingClientRect().width / opts.getBoundingClientRect().width))
						: 0;
					return {
						title: document.querySelector("main h1")?.textContent,
						prompt: document.querySelector(".task-prompt")?.textContent,
						quiz: document.querySelectorAll(".quiz-choice").length,
						practice: document.querySelectorAll(".practice-input").length,
						pieces: pieces.length,
						svgOk: !!svgRect && svgRect.width > 120 && svgRect.height > 60,
						minPieceRatio,
						question: document.querySelector("#workshop-question")?.textContent,
						initial: document.querySelector("#workshop-status")?.textContent,
						over: document.documentElement.scrollWidth > innerWidth,
						body: document.querySelector("main")?.innerText
					};
				})()`);
				assert.equal(rendered.title, lesson.title);
				assert.equal(rendered.prompt, lesson.tasks[level].prompt);
				assert.equal(rendered.quiz, 3);
				assert.equal(rendered.practice, 2);
				assert.equal(rendered.pieces, 3);
				assert.equal(rendered.svgOk, true, `SVG missing or collapsed on ${lesson.id} ${width}`);
				if (width === 375) {
					assert.ok(
						rendered.minPieceRatio >= 0.75,
						`Squeezed workshop button on ${lesson.id} at 375px: ${rendered.minPieceRatio}`,
					);
				}
				assert.equal(rendered.question, lesson.workshop.goals[0].label);
				assert.match(rendered.initial, /^0 von 3/);
				assert.equal(rendered.over, false, `Horizontal overflow: ${lesson.id} ${width}`);
				assert.doesNotMatch(rendered.body, /\bNaN\b|\bundefined\b/);
				if (sample.has(lesson.id) && level === 1 && width !== 720) {
					await evaluate('window.scrollTo(0, document.querySelector(".workshop").offsetTop - 16)');
					await frame();
					await screenshot(`${lesson.id}-${width}-${theme}`);
				}
				states++;
			}
		}

		await route("#view=reference");
		assert.match(
			await evaluate('document.querySelector("main h1")?.textContent'),
			/Sprache im Zusammenhang/,
		);
		assert.equal(await evaluate('document.querySelectorAll(".grammar-overview dt").length'), 9);
		assert.equal(await evaluate("document.documentElement.scrollWidth > innerWidth"), false);
		if (width !== 720) await screenshot(`reference-${width}-${theme}`);
		await evaluate('document.querySelector(".grammar-overview [data-lesson=e8s-passive-tenses]").click()');
		assert.equal(await evaluate('location.hash.startsWith("#lesson=e8s-passive-tenses")'), true);
		await send("Target.closeTarget", { targetId: tab.targetId });
		targets.pop();
	}

	// Interactive workshop verification (including direct SVG hotspot clicks) across all 40 lessons
	const workTab = await openTab(1280, 1150, false);
	session = workTab.sessionId;
	for (const lesson of lessons) {
		await route(`#lesson=${lesson.id}&level=1`);
		const result = await evaluate(`(() => {
			const goals = ${JSON.stringify(lesson.workshop.goals)};
			const question = document.querySelector("#workshop-question");
			const status = document.querySelector("#workshop-status");
			const pieces = [...document.querySelectorAll(".workshop [data-piece]")];
			const hotspots = [...document.querySelectorAll(".workshop [data-map-marker]")];
			const wrong = pieces.find((piece) => piece.dataset.piece !== goals[0].answer);
			wrong.click();
			const stayed = status.textContent.startsWith("0 von 3") && question.textContent === goals[0].label;
			const passed = goals.every((goal, index) => {
				const target = (index === 0 && hotspots.length === 3)
					? hotspots.find((h) => h.dataset.mapMarker === goal.answer)
					: pieces.find((button) => button.dataset.piece === goal.answer);
				target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
				return status.textContent.startsWith((index + 1) + " von 3");
			});
			document.querySelector("#workshop-restart").click();
			const restarted = status.textContent.startsWith("0 von 3") && question.textContent === goals[0].label;
			return { stayed, passed, restarted, hotspotCount: hotspots.length };
		})()`);
		assert.ok(result.stayed && result.passed && result.restarted, `Workshop failed: ${lesson.id}`);
		assert.equal(result.hotspotCount, 3, `Expected 3 SVG hotspots on ${lesson.id}`);
	}

	// Full lesson completion + persistence check
	const lesson = lessons.find(({ id }) => id === "e8s-podcast-can");
	await route("#lesson=e8s-podcast-can&level=1");
	const complete = await evaluate(`(() => {
		const lesson = ${JSON.stringify(lesson)};
		const all = (selector) => [...document.querySelectorAll(selector)];
		document.querySelector("#partner-listened").click();
		for (const goal of lesson.workshop.goals)
			all(".workshop [data-piece]").find((piece) => piece.dataset.piece === goal.answer).click();
		all(".quiz-choice").find((button) => button.textContent === lesson.quiz.answer).click();
		all(".practice-input").forEach((input, i) => { input.value = lesson.practice[i].answers[0]; });
		document.querySelector("#practice-form").requestSubmit();
		const draft = document.querySelector("#draft");
		draft.value = lesson.tasks[1].model;
		draft.dispatchEvent(new Event("input"));
		document.querySelector("#compare").click();
		all(".criterion").forEach((input) => input.click());
		document.querySelector("#accept").click();
		return document.querySelector("#path-progress").value;
	})()`);
	assert.equal(complete, 1);
	await route("");
	await route("#lesson=e8s-podcast-can&level=1");
	assert.equal(await evaluate('document.querySelector("#draft").value'), lesson.tasks[1].model);

	// Cross-tab reset check: reset in tab 2 clears typed answers, quiz marks and drafts in tab 1
	await route("#lesson=e8s-roleplay&level=1");
	await evaluate(`(() => {
		document.querySelector(".quiz-choice").click();
		const input = document.querySelector(".practice-input");
		input.value = "see";
		input.dispatchEvent(new Event("input"));
		const draft = document.querySelector("#draft");
		draft.value = "Draft text longer than twenty chars for reset verification.";
		draft.dispatchEvent(new Event("input"));
	})()`);
	const resetTab = await openTab(1280, 1150, false);
	session = resetTab.sessionId;
	await evaluate(`(() => {
		document.querySelector("#reset").click();
		document.querySelector("#confirm-reset").click();
	})()`);
	await frame();
	await send("Target.closeTarget", { targetId: resetTab.targetId });
	targets.pop();
	await send("Target.activateTarget", { targetId: workTab.targetId });
	session = workTab.sessionId;
	await evaluate(`(() => {
		window.dispatchEvent(new StorageEvent("storage", { key: "englisch_2fs_gym8_progress_v1" }));
	})()`);
	await frame();
	const cleared = await evaluate(`({
		quizMarks: document.querySelectorAll(".done-mark").length,
		practiceVal: document.querySelector(".practice-input")?.value ?? "",
		draftVal: document.querySelector("#draft")?.value ?? "",
		progress: document.querySelector("#path-progress")?.value ?? -1
	})`);
	assert.equal(cleared.practiceVal, "");
	assert.equal(cleared.draftVal, "");
	assert.equal(cleared.progress, 0);

	assert.deepEqual(errors, []);
	assert.deepEqual(
		requests.filter((url) => /^https?:/.test(url)),
		[],
	);
	console.log(
		`ok: ${states} lesson states across 1280/720/375px light & dark, all 40 interactive workshops (120 goals + SVG hotspots), grammar reference, full practice, saved draft, and cross-tab reset; no page errors or HTTP requests.`,
	);
} finally {
	for (const targetId of targets) {
		await send("Target.closeTarget", { targetId }).catch(() => {});
	}
	chrome.kill();
	await closed;
	rmSync(profile, { recursive: true, force: true });
}
