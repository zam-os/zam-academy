import { spawn } from "node:child_process";
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = process.env.BROWSER_QA_DIR ?? "/private/tmp/zam-e6r-browser";
mkdirSync(output, { recursive: true });

const stageFiles = [
	"lessons-usa.json",
	"lessons-london.json",
	"lessons-britain.json",
	"lessons-freetime.json",
	"lessons-media.json",
	"lessons-grammar1.json",
	"lessons-grammar2.json",
	"lessons-words.json",
];
const lessons = stageFiles.flatMap((file) =>
	JSON.parse(readFileSync(`${root}/src/curriculum/${file}`, "utf8")),
);

const profile = mkdtempSync(join(tmpdir(), "zam-english6-browser-"));
const chrome = spawn(
	process.env.CHROME_BIN ??
		"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
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

let seq = 0,
	buffer = "";
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
			if (msg.method === "Runtime.exceptionThrown")
				errors.push(msg.params.exceptionDetails);
			if (msg.method === "Network.requestWillBeSent")
				requests.push(msg.params.request.url);
		}
	}
});

// The first command waits for Chrome's cold start, which can take longer than
// 15 s on a busy CI runner; every later command keeps the short limit.
function send(method, params = {}, sessionId, timeout = 15000) {
	return new Promise((resolve, reject) => {
		const id = ++seq;
		const timer = setTimeout(() => {
			pending.delete(id);
			reject(Error(`Chrome timed out: ${method}`));
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
			JSON.stringify({
				id,
				method,
				params,
				...(sessionId ? { sessionId } : {}),
			}) + "\0",
		);
	});
}

const appUrl = pathToFileURL(join(root, "dist/index.html")).href;

let firstTarget = true;
async function openTab(width = 1280, height = 1100, mobile = false) {
	const timeout = firstTarget ? 60000 : 15000;
	firstTarget = false;
	const { targetId } = await send(
		"Target.createTarget",
		{ url: "about:blank" },
		undefined,
		timeout,
	);
	const session = (await send("Target.attachToTarget", { targetId, flatten: true }))
		.sessionId;
	const page = (method, params) => send(method, params, session);
	const evaluate = async (expression) => {
		const value = await page("Runtime.evaluate", {
			expression,
			returnByValue: true,
			awaitPromise: true,
		});
		if (value.exceptionDetails)
			throw Error(JSON.stringify(value.exceptionDetails));
		return value.result.value;
	};
	const frame = () =>
		evaluate(
			"new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))",
		);
	const route = async (hash) => {
		await evaluate(`location.hash=${JSON.stringify(hash)}`);
		await frame();
	};
	const screenshot = async (name) => {
		const result = await page("Page.captureScreenshot", {
			format: "png",
			captureBeyondViewport: true,
		});
		writeFileSync(`${output}/${name}.png`, Buffer.from(result.data, "base64"));
	};
	await page("Page.enable");
	await page("Runtime.enable");
	await page("Network.enable");
	await page("Emulation.setDeviceMetricsOverride", {
		width,
		height,
		deviceScaleFactor: 1,
		mobile,
	});
	await page("Page.navigate", { url: appUrl });
	for (let i = 0; i < 100; i++) {
		if (await evaluate('!!document.querySelector(".hero")')) break;
		await new Promise((r) => setTimeout(r, 25));
	}
	return {
		targetId,
		page,
		evaluate,
		route,
		screenshot,
		close: () => send("Target.closeTarget", { targetId }),
	};
}

try {
	let states = 0;
	// Phase 1: Render every lesson, level and theme cleanly + capture screenshots.
	const tab1 = await openTab(1280, 1100, false);
	assert.equal(
		await tab1.evaluate('document.querySelectorAll(".lesson-link").length'),
		42,
	);
	for (const theme of ["light", "dark"]) {
		await tab1.evaluate(
			`document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
		);
		await tab1.route("");
		await tab1.screenshot(`path-${theme}`);
		for (const lesson of lessons)
			for (const level of [1, 2]) {
				await tab1.route(`#lesson=${lesson.id}&level=${level}`);
				const result = await tab1.evaluate(
					`({title:document.querySelector('main h1')?.textContent,prompt:document.querySelector('.task-prompt')?.textContent,body:document.querySelector('main')?.innerText,quiz:document.querySelectorAll('.quiz-choice').length,practice:document.querySelectorAll('.practice-input').length,goals:document.querySelectorAll('[data-workshop]').length,over:document.documentElement.scrollWidth>innerWidth,initial:document.querySelector('#workshop-status')?.textContent})`,
				);
				assert.equal(result.title, lesson.title);
				assert.equal(result.prompt, lesson.tasks[level].prompt);
				assert.equal(result.quiz, 3);
				assert.equal(result.practice, 2);
				assert.equal(result.goals, 3);
				assert.ok(result.initial.startsWith("0 von 3"));
				assert.equal(result.over, false, lesson.id);
				assert.ok(!/NaN|undefined/.test(result.body));
				if (
					[
						"e6-usa-map",
						"e6-usa-weather",
						"e6-london-city",
						"e6-scotland",
						"e6-comparatives",
						"e6-past-progressive",
						"e6-writing-linking",
					].includes(lesson.id) &&
					level === 1
				) {
					await tab1.screenshot(`${lesson.id}-level${level}-${theme}`);
				}
				states++;
			}
		await tab1.route("#view=reference");
		assert.ok(
			(await tab1.evaluate('document.querySelector("main").innerText')).includes(
				"Sprachwerkstatt",
			),
		);
		await tab1.screenshot(`reference-${theme}`);
	}
	await tab1.close();

	// Phase 2: Reach all 42 workshops + quiz, practice, rubric, reload persistence, edit invalidation, explorers.
	const tab2 = await openTab(1280, 1100, false);
	for (const lesson of lessons) {
		await tab2.route(`#lesson=${lesson.id}&level=1`);
		await tab2.evaluate(
			`var answers=${JSON.stringify(lesson.workshop.goals.map((g) => g.answer))};document.querySelectorAll('[data-workshop]').forEach((el,i)=>{el.value=answers[i];el.dispatchEvent(new Event('change',{bubbles:true}));});`,
		);
		const ws = await tab2.evaluate(
			'document.querySelector("#workshop-status").textContent',
		);
		assert.ok(
			ws.startsWith("3 von 3"),
			`${lesson.id}: expected 3 von 3, got ${JSON.stringify(ws)}`,
		);
	}

	const first = lessons[0];
	await tab2.route(`#lesson=${first.id}&level=1`);
	await tab2.evaluate(
		`Array.from(document.querySelectorAll('.quiz-choice')).find(el=>el.textContent===${JSON.stringify(first.quiz.wrong[0])}).click()`,
	);
	assert.ok(
		!(
			await tab2.evaluate('document.querySelector("#quiz-feedback").innerText')
		).includes(first.quiz.explanation),
	);
	await tab2.evaluate(
		`Array.from(document.querySelectorAll('.quiz-choice')).find(el=>el.textContent===${JSON.stringify(first.quiz.answer)}).click()`,
	);
	await tab2.evaluate(
		`var answers=${JSON.stringify(first.practice.map((p) => p.answers[0]))};document.querySelectorAll('.practice-input').forEach((el,i)=>{el.value=answers[i];});document.querySelector('#practice-form').requestSubmit()`,
	);
	await tab2.evaluate(
		`var draft=document.querySelector('#draft');draft.value='Washington, D.C. is the capital of the USA, and Hawaii is in the Pacific.';draft.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#compare').click()`,
	);
	assert.equal(
		await tab2.evaluate('document.querySelector("#accept").disabled'),
		true,
	);
	await tab2.evaluate(
		`document.querySelectorAll('.criterion').forEach(el=>{el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));});document.querySelector('#accept').click()`,
	);
	assert.ok(
		(
			await tab2.evaluate('document.querySelector("#progress-strip").innerText')
		).includes("1 von 42"),
	);

	await tab2.page("Page.reload");
	for (let i = 0; i < 100; i++) {
		if (await tab2.evaluate('!!document.querySelector("#draft")')) break;
		await new Promise((r) => setTimeout(r, 20));
	}
	assert.ok(
		(await tab2.evaluate('document.querySelector("#draft").value')).includes(
			"Washington",
		),
	);
	assert.ok(
		(
			await tab2.evaluate('document.querySelector("#progress-strip").innerText')
		).includes("1 von 42"),
	);
	await tab2.evaluate(
		`var draft=document.querySelector('#draft');draft.value='Edited draft that invalidates the earlier model comparison.';draft.dispatchEvent(new Event('input',{bubbles:true}));`,
	);
	assert.ok(
		(
			await tab2.evaluate('document.querySelector("#progress-strip").innerText')
		).includes("0 von 42"),
	);

	await tab2.route("#lesson=e6-usa-weather&level=1");
	await tab2.evaluate(
		`var s=document.querySelector('#weather-slider');s.value='14';s.dispatchEvent(new Event('input'))`,
	);
	assert.ok(
		(
			await tab2.evaluate('document.querySelector("#weather-readout").textContent')
		).includes("\u221210,0 °C"),
	);

	await tab2.route("#lesson=e6-comparatives&level=1");
	await tab2.evaluate(
		`var a=document.querySelector('#compare-a');a.value='80';a.dispatchEvent(new Event('input'));var b=document.querySelector('#compare-b');b.value='80';b.dispatchEvent(new Event('input'))`,
	);
	assert.equal(
		await tab2.evaluate('document.querySelector("#compare-en").textContent'),
		"Tower A is as tall as Tower B.",
	);

	await tab2.route("#lesson=e6-past-progressive&level=1");
	await tab2.evaluate(
		`var t=document.querySelector('#timeline-slider');t.value='35';t.dispatchEvent(new Event('input'))`,
	);
	assert.ok(
		(
			await tab2.evaluate('document.querySelector("#timeline-readout").textContent')
		).includes("phone rang"),
	);

	await tab2.route("#lesson=e6-usa-map&level=1");
	assert.equal(
		await tab2.evaluate('document.querySelectorAll("[data-city]").length'),
		8,
	);
	await tab2.evaluate(
		'document.querySelector("[data-map-focus=cities]").click()',
	);
	assert.equal(
		await tab2.evaluate(
			'document.querySelector("[data-map-layer=regions]").style.opacity',
		),
		"0.18",
	);

	await tab2.route("#lesson=e6-listening-stories&level=1");
	await tab2.evaluate('document.querySelector("#partner-listened").click()');
	assert.ok(
		(
			await tab2.evaluate('document.querySelector("#listened-status").textContent')
		).includes("Partner"),
	);
	await tab2.close();

	// Phase 3: Mobile & tablet responsive layout checks (390 px, 720 px) across all views.
	for (const width of [390, 720]) {
		const rtab = await openTab(width, 844, width === 390);
		for (const theme of ["light", "dark"]) {
			await rtab.evaluate(
				`document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
			);
			for (const id of ["", ...lessons.map((l) => l.id), "reference"]) {
				await rtab.route(
					id === "reference"
						? "#view=reference"
						: id
							? `#lesson=${id}&level=2`
							: "",
				);
				assert.equal(
					await rtab.evaluate("document.documentElement.scrollWidth>innerWidth"),
					false,
					`overflow ${width} ${id}`,
				);
			}
		}
		await rtab.close();
	}

	assert.deepEqual(errors, []);
	assert.deepEqual(
		requests.filter((url) => /^https?:/.test(url)),
		[],
	);
	writeFileSync(
		`${output}/report.json`,
		JSON.stringify(
			{
				states,
				lessons: 42,
				workshopGoals: 126,
				themes: ["light", "dark"],
				levels: [1, 2],
				responsiveWidths: [390, 720, 1280],
				runtimeErrors: 0,
				externalRequests: 0,
			},
			null,
			2,
		),
	);
	console.log(
		`ok: ${states} lesson/level/theme views; 126 goals; responsive checks at 390/720 px; interaction and persistence checks; no runtime errors or network requests.`,
	);
} finally {
	chrome.kill();
	await closed;
	rmSync(profile, {
		recursive: true,
		force: true,
		maxRetries: 5,
		retryDelay: 100,
	});
}
