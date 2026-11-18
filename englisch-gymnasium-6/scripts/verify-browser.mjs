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
const output = process.env.BROWSER_QA_DIR ?? join(tmpdir(), "zam-e6g-browser");
mkdirSync(output, { recursive: true });
const lessons = JSON.parse(readFileSync(`${root}/src/curriculum/lessons.json`));
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
			if (msg.method === "Runtime.exceptionThrown")
				errors.push(msg.params.exceptionDetails);
			if (msg.method === "Network.requestWillBeSent")
				requests.push(msg.params.request.url);
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
	if (value.exceptionDetails)
		throw Error(JSON.stringify(value.exceptionDetails));
	return value.result.value;
};
const screenshot = async (name) => {
	const result = await page("Page.captureScreenshot", {
		format: "png",
		captureBeyondViewport: true,
	});
	writeFileSync(`${output}/${name}.png`, Buffer.from(result.data, "base64"));
};
const frame = () =>
	evaluate(
		"new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))",
	);
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
	const { targetId } = await send(
		"Target.createTarget",
		{ url: "about:blank" },
		undefined,
		60000,
	);
	currentTargetId = targetId;
	session = (await send("Target.attachToTarget", { targetId, flatten: true }))
		.sessionId;
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

try {
	await openTab(1280, 1100, false);
	assert.equal(
		await evaluate('document.querySelectorAll(".lesson-link").length'),
		40,
	);
	let states = 0;
	for (const theme of ["light", "dark"]) {
		await openTab(1280, 1100, false);
		await evaluate(
			`document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
		);
		await route("");
		await screenshot(`path-${theme}`);
		for (const lesson of lessons)
			for (const level of [1, 2]) {
				await route(`#lesson=${lesson.id}&level=${level}`);
				const result = await evaluate(
					`({title:document.querySelector('main h1')?.textContent,prompt:document.querySelector('.task-prompt')?.textContent,body:document.querySelector('main')?.innerText,quiz:document.querySelectorAll('.quiz-choice').length,practice:document.querySelectorAll('.practice-input').length,goals:document.querySelectorAll('[data-workshop]').length,over:document.documentElement.scrollWidth>innerWidth,initial:document.querySelector('#workshop-status')?.textContent})`,
				);
				assert.equal(result.title, lesson.title);
				assert.equal(result.prompt, lesson.tasks[level].prompt);
				assert.equal(result.quiz, 3);
				assert.equal(result.practice, 2);
				assert.equal(result.goals, 3);
				assert.ok(result.initial.startsWith("0 von 3"));
				assert.equal(result.over, false, lesson.id);
				assert.ok(!/NaN|undefined/.test(result.body), lesson.id);
				if (["e6-past-progressive", "e6-adjectives", "e6-lake-district", "e6-us-regions", "e6-directions", "e6-picture-talk"].includes(lesson.id)) {
					await screenshot(`${lesson.id}-level${level}-${theme}`);
				}
				states++;
			}
		await route("#view=reference");
		assert.ok(
			(await evaluate('document.querySelector("main").innerText')).includes(
				"Sprachwerkstatt",
			),
		);
		await screenshot(`reference-${theme}`);
	}
	await openTab(1280, 1100, false);
	for (const lesson of lessons) {
		await route(`#lesson=${lesson.id}&level=1`);
		await evaluate(
			`var answers=${JSON.stringify(lesson.workshop.goals.map((g) => g.answer))};document.querySelectorAll('[data-workshop]').forEach((el,i)=>{el.value=answers[i];el.dispatchEvent(new Event('change',{bubbles:true}));});`,
		);
		const status = await evaluate(
			'document.querySelector("#workshop-status").textContent',
		);
		assert.ok(status.startsWith("3 von 3"), `${lesson.id}: got ${status}`);
	}
	const first = lessons[0];
	await route(`#lesson=${first.id}&level=1`);
	await evaluate(
		`Array.from(document.querySelectorAll('.quiz-choice')).find(el=>el.textContent===${JSON.stringify(first.quiz.wrong[0])}).click()`,
	);
	assert.ok(
		!(
			await evaluate('document.querySelector("#quiz-feedback").innerText')
		).includes(first.quiz.explanation),
	);
	await evaluate(
		`Array.from(document.querySelectorAll('.quiz-choice')).find(el=>el.textContent===${JSON.stringify(first.quiz.answer)}).click()`,
	);
	await evaluate(
		`var answers=${JSON.stringify(first.practice.map((p) => p.answers[0]))};document.querySelectorAll('.practice-input').forEach((el,i)=>{el.value=answers[i];});document.querySelector('#practice-form').requestSubmit()`,
	);
	await evaluate(
		`var draft=document.querySelector('#draft');draft.value='Could I have a return ticket to Bath, please? Which platform does it leave from?';draft.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#compare').click()`,
	);
	assert.equal(
		await evaluate('document.querySelector("#accept").disabled'),
		true,
	);
	await evaluate(
		`document.querySelectorAll('.criterion').forEach(el=>{el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));});document.querySelector('#accept').click()`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("1 von 40"),
	);
	await page("Page.reload");
	for (let i = 0; i < 100; i++) {
		if (await evaluate('!!document.querySelector("#draft")')) break;
		await new Promise((r) => setTimeout(r, 20));
	}
	assert.ok(
		(await evaluate('document.querySelector("#draft").value')).includes(
			"return ticket",
		),
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("1 von 40"),
	);
	await evaluate(
		`var draft=document.querySelector('#draft');draft.value='Could I have a single ticket to Bath, please? Thank you very much.';draft.dispatchEvent(new Event('input',{bubbles:true}));`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("0 von 40"),
	);

	// Interactive Grade 6 explorers: comparison, timeline, directions, picture, UK/US maps, listening fallback
	await route("#lesson=e6-adjectives&level=1");
	await evaluate(
		`var sel=document.querySelector('#comp-adj');sel.value='good';sel.dispatchEvent(new Event('change'));var b=document.querySelector('#comp-bike');b.value='5';b.dispatchEvent(new Event('input'));var t=document.querySelector('#comp-train');t.value='3';t.dispatchEvent(new Event('input'));`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#comp-readout").textContent')
		).includes("better than"),
	);

	await route("#lesson=e6-past-progressive&level=1");
	await evaluate(
		`document.querySelector('[data-timeline-mode=secondary]').click()`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#timeline-readout").textContent')
		).includes("While Tom was cooking"),
	);

	await route("#lesson=e6-directions&level=1");
	await evaluate(`document.querySelector('[data-route=cinema]').click()`);
	assert.ok(
		(
			await evaluate('document.querySelector("#route-readout").textContent')
		).includes("Park Lane"),
	);

	await route("#lesson=e6-picture-talk&level=1");
	await evaluate(
		`document.querySelector('[data-scene-focus=background]').click()`,
	);
	assert.equal(
		await evaluate(
			'document.querySelector("[data-scene-zone=foreground]").style.opacity',
		),
		"0.18",
	);

	await route("#lesson=e6-romans-wall&level=1");
	assert.equal(
		await evaluate('document.querySelectorAll("[data-city]").length'),
		8,
	);
	await evaluate('document.querySelector("[data-map-focus=romans]").click()');
	assert.equal(
		await evaluate(
			'document.querySelector("[data-map-layer=regions]").style.opacity',
		),
		"0.18",
	);

	await route("#lesson=e6-us-regions&level=1");
	assert.equal(
		await evaluate('document.querySelectorAll("[data-city]").length'),
		6,
	);

	await route("#lesson=e6-listening&level=1");
	await evaluate('document.querySelector("#partner-listened").click()');
	assert.ok(
		(
			await evaluate('document.querySelector("#listened-status").textContent')
		).includes("Partner"),
	);

	for (const width of [390, 720]) {
		for (const theme of ["light", "dark"]) {
			await openTab(width, 844, width === 390);
			await evaluate("localStorage.clear()");
			await page("Page.reload");
			for (let i = 0; i < 100; i++) {
				if (await evaluate('!!document.querySelector(".hero")')) break;
				await new Promise((r) => setTimeout(r, 25));
			}
			await evaluate(
				`document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
			);
			for (const id of ["", ...lessons.map((l) => l.id), "reference"]) {
				await route(
					id === "reference"
						? "#view=reference"
						: id
							? `#lesson=${id}&level=2`
							: "",
				);
				assert.equal(
					await evaluate("document.documentElement.scrollWidth>innerWidth"),
					false,
					`overflow ${width} ${id}`,
				);
				if (
					[
						"",
						"e6-directions",
						"e6-romans-wall",
						"e6-us-regions",
						"e6-adjectives",
						"reference",
					].includes(id)
				)
					await screenshot(`mobile-${width}-${id || "path"}-${theme}`);
			}
		}
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
				lessons: 40,
				workshopGoals: 120,
				themes: ["light", "dark"],
				levels: [1, 2],
				responsiveWidths: [390, 720, 1280],
				runtimeErrors: 0,
				externalRequests: 0,
				outputDir: output,
			},
			null,
			2,
		),
	);
	console.log(
		`ok: ${states} lesson/level/theme views; 120 goals; responsive checks at 390/720/1280 px; all explorers and persistence checks; no runtime errors or network requests. Output: ${output}`,
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
