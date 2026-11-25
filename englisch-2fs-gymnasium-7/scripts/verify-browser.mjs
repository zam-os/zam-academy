import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = process.env.BROWSER_QA_DIR ?? join(tmpdir(), "zam-e7s-browser");
mkdirSync(output, { recursive: true });
const lessons = JSON.parse(readFileSync(`${root}/src/curriculum/lessons.json`));
const profile = mkdtempSync(join(tmpdir(), "zam-english7-2fs-browser-"));
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
let currentTargetId;
async function openTab(width, height, mobile) {
	if (currentTargetId) {
		await send("Target.closeTarget", { targetId: currentTargetId });
		currentTargetId = undefined;
	}
	const { targetId } = await send("Target.createTarget", { url: "about:blank" }, undefined, 60000);
	currentTargetId = targetId;
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
}

const sample = new Set([
	"e7s-station",
	"e7s-directions",
	"e7s-past-progressive",
	"e7s-cornwall",
	"e7s-florida",
	"e7s-clip",
	"e7s-picture",
	"e7s-romans",
	"e7s-normans",
]);
let states = 0;
try {
	for (const [width, height, mobile, theme] of [
		[1280, 1150, false, "light"],
		[1280, 1150, false, "dark"],
		[390, 844, true, "light"],
	]) {
		await openTab(width, height, mobile);
		await evaluate(`document.documentElement.dataset.theme = ${JSON.stringify(theme)}`);
		assert.equal(
			await evaluate('document.querySelectorAll(".lesson-link").length'),
			lessons.length,
		);
		assert.equal(await evaluate("document.documentElement.scrollWidth > innerWidth"), false);
		await screenshot(`path-${width}-${theme}`);
		for (const lesson of lessons) {
			for (const level of [1, 2]) {
				await route(`#lesson=${lesson.id}&level=${level}`);
				const rendered = await evaluate(`({
					title: document.querySelector("main h1")?.textContent,
					prompt: document.querySelector(".task-prompt")?.textContent,
					quiz: document.querySelectorAll(".quiz-choice").length,
					practice: document.querySelectorAll(".practice-input").length,
					goals: document.querySelectorAll("[data-workshop]").length,
					initial: document.querySelector("#workshop-status")?.textContent,
					over: document.documentElement.scrollWidth > innerWidth,
					body: document.querySelector("main")?.innerText
				})`);
				assert.equal(rendered.title, lesson.title);
				assert.equal(rendered.prompt, lesson.tasks[level].prompt);
				assert.equal(rendered.quiz, 3);
				assert.equal(rendered.practice, 2);
				assert.equal(rendered.goals, 3);
				assert.match(rendered.initial, /^0 von 3/);
				assert.equal(rendered.over, false, `${lesson.id} ${width}`);
				assert.doesNotMatch(rendered.body, /\bNaN\b|\bundefined\b/);
				if (sample.has(lesson.id) && level === 1) {
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
		await screenshot(`reference-${width}-${theme}`);
	}

	for (const [lesson, selector, note] of [
		["cornwall", ".pin", "südwestlichen"],
		["florida", ".pin", "Midwest"],
		["romans", ".pin", "Nordengland"],
		["directions", ".scene-piece", "Norden"],
		["picture", ".scene-piece", "curtain"],
		["clip", ".scene-piece", "backstage"],
	]) {
		await route(`#lesson=e7s-${lesson}&level=1`);
		const result = await evaluate(`(() => {
			const button = document.querySelector(${JSON.stringify(selector)});
			button.click();
			return [button.getAttribute("aria-pressed"), document.querySelector(".visual-note").textContent];
		})()`);
		assert.equal(result[0], "true");
		assert.ok(result[1].includes(note), lesson);
	}

	const lesson = lessons.find(({ id }) => id === "e7s-station");
	await route("#lesson=e7s-station&level=1");
	const complete = await evaluate(`(() => {
		const lesson = ${JSON.stringify(lesson)};
		const all = (selector) => [...document.querySelectorAll(selector)];
		document.querySelector("#partner-listened").click();
		all("[data-workshop]").forEach((input, i) => {
			input.value = lesson.workshop.goals[i].answer;
			input.dispatchEvent(new Event("change"));
		});
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
	await route("#lesson=e7s-station&level=1");
	assert.equal(await evaluate('document.querySelector("#draft").value'), lesson.tasks[1].model);
	assert.deepEqual(errors, []);
	assert.deepEqual(
		requests.filter((url) => /^https?:/.test(url)),
		[],
	);
	console.log(
		`ok: ${states} lesson states, six interactive visuals, full practice and saved draft; no page errors or HTTP requests.`,
	);
} finally {
	chrome.kill();
	await closed;
	rmSync(profile, { recursive: true, force: true });
}
