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
const output = process.env.BROWSER_QA_DIR ?? join(tmpdir(), "zam-e7g-browser");
mkdirSync(output, { recursive: true });
const lessons = JSON.parse(readFileSync(`${root}/src/curriculum/lessons.json`));
const profile = mkdtempSync(join(tmpdir(), "zam-english7-browser-"));
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
		44,
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
				if (["e7-adverbs-compare", "e7-since-for", "e7-conditional-3", "e7-thanksgiving", "e7-check-sources", "e7-film-scene", "e7-wales", "e7-desert-southwest", "e7-1066", "e7-norman-words", "e7-pronunciation"].includes(lesson.id)) {
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
		`var draft=document.querySelector('#draft');draft.value='My little brother eats very slowly. My mum drives carefully, even on empty roads.';draft.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#compare').click()`,
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
		).includes("1 von 44"),
	);
	await page("Page.reload");
	for (let i = 0; i < 100; i++) {
		if (await evaluate('!!document.querySelector("#draft")')) break;
		await new Promise((r) => setTimeout(r, 20));
	}
	assert.ok(
		(await evaluate('document.querySelector("#draft").value')).includes(
			"eats very slowly",
		),
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("1 von 44"),
	);
	await evaluate(
		`var draft=document.querySelector('#draft');draft.value='My best friend speaks English really well and sings happily.';draft.dispatchEvent(new Event('input',{bubbles:true}));`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("0 von 44"),
	);

	// Cross-tab reset: resetting in a second tab clears open lesson inputs and feedback
	await evaluate(
		`Array.from(document.querySelectorAll('.quiz-choice')).find(el=>el.textContent===${JSON.stringify(first.quiz.answer)}).click()`,
	);
	await evaluate(
		`var answers=${JSON.stringify(first.practice.map((p) => p.answers[0]))};document.querySelectorAll('.practice-input').forEach((el,i)=>{el.value=answers[i];el.dispatchEvent(new Event('input',{bubbles:true}));});document.querySelector('#practice-form').requestSubmit()`,
	);
	await evaluate(
		`var draft=document.querySelector('#draft');draft.value='My little brother eats very slowly. My mum drives carefully, even on empty roads.';draft.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#compare').click();document.querySelectorAll('.criterion').forEach(el=>{el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));});document.querySelector('#accept').click()`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("1 von 44"),
	);
	const tab1Session = session;
	const { targetId: tab2Id } = await send(
		"Target.createTarget",
		{ url: "about:blank" },
		undefined,
		60000,
	);
	session = (await send("Target.attachToTarget", { targetId: tab2Id, flatten: true }))
		.sessionId;
	await page("Page.enable");
	await page("Runtime.enable");
	await page("Page.navigate", {
		url: pathToFileURL(join(root, "dist/index.html")).href,
	});
	for (let i = 0; i < 100; i++) {
		if (await evaluate('!!document.querySelector("#reset")')) break;
		await new Promise((r) => setTimeout(r, 25));
	}
	await evaluate(
		'document.querySelector("#reset").click();document.querySelector("#confirm-reset").click();',
	);
	await send("Target.closeTarget", { targetId: tab2Id });
	session = tab1Session;
	for (let i = 0; i < 40; i++) {
		const stripped = await evaluate(
			'document.querySelector("#progress-strip")?.innerText ?? ""',
		);
		if (stripped.includes("0 von 44")) break;
		await new Promise((r) => setTimeout(r, 25));
	}
	const afterCrossReset = await evaluate(`({
		strip: document.querySelector("#progress-strip").innerText,
		practiceValues: [...document.querySelectorAll(".practice-input")].map(el => el.value),
		practiceFeedback: document.querySelector("#practice-feedback").innerText,
		quizFeedback: document.querySelector("#quiz-feedback").innerText,
		workshopStatus: document.querySelector("#workshop-status").textContent,
		draft: document.querySelector("#draft").value
	})`);
	assert.ok(afterCrossReset.strip.includes("0 von 44"));
	assert.deepEqual(afterCrossReset.practiceValues, ["", ""]);
	assert.equal(afterCrossReset.practiceFeedback, "");
	assert.equal(afterCrossReset.quizFeedback, "");
	assert.ok(afterCrossReset.workshopStatus.startsWith("0 von 3"));
	assert.equal(afterCrossReset.draft, "");

	// Interactive Grade 7 explorers: adverb race, word machine, timelines, conditions, calendar,
	// layouts, history frieze, pairs, stress, maps, film scene and listening fallback.
	const text = (selector) =>
		evaluate(`document.querySelector(${JSON.stringify(selector)})?.textContent ?? ""`);
	const readout = (root) => text(`[data-focus-root=${root}] [data-focus-readout]`);

	await route("#lesson=e7-adverbs-compare&level=1");
	await evaluate(
		`var k=document.querySelector('#adv-kind');k.value='well';k.dispatchEvent(new Event('change'));var a=document.querySelector('#adv-lena');a.value='2';a.dispatchEvent(new Event('input'));var b=document.querySelector('#adv-tom');b.value='5';b.dispatchEvent(new Event('input'));`,
	);
	assert.equal(await text("#adv-readout"), "Tom sings better than Lena.");
	assert.equal(await evaluate('document.querySelector("#adv-tom-dot").getAttribute("cx")'), "390");

	await route("#lesson=e7-adverbs-manner&level=1");
	await evaluate(`var s=document.querySelector('[data-transform]');s.value='5';s.dispatchEvent(new Event('change'));`);
	assert.equal(await text(".transform-out"), "well");

	await route("#lesson=e7-since-for&level=1");
	await evaluate(`document.querySelector('[data-focus-root=timeline] [data-focus-key="2"]').click()`);
	assert.equal(await readout("timeline"), "I moved here five years ago.");
	assert.equal(
		await evaluate(`document.querySelector('[data-focus-root=timeline] [data-focus-item="0"]').hasAttribute('hidden')`),
		true,
	);

	await route("#lesson=e7-conditional-3&level=1");
	assert.ok((await readout("conditions")).includes("would have been late"));
	await evaluate(`document.querySelector('[data-focus-root=conditions] [data-focus-key=mixed]').click()`);
	assert.ok((await readout("conditions")).includes("at home now"));
	assert.equal(
		await evaluate(`document.querySelector('.condition-III').getAttribute('data-dim')`),
		"true",
	);

	await route("#lesson=e7-thanksgiving&level=1");
	await evaluate(`document.querySelector('[data-calendar-shift="1"]').click()`);
	const year = Number(await text("[data-calendar-year]"));
	assert.ok((await readout("calendar")).includes(String(year)));
	assert.ok((await readout("calendar")).includes("Thursday"));

	await route("#lesson=e7-check-sources&level=1");
	await evaluate(`document.querySelector('[data-focus-root=layout] [data-focus-key=ad]').click()`);
	assert.ok((await readout("layout")).includes("advert"));

	await route("#lesson=e7-elizabeth-i&level=1");
	assert.ok((await readout("history")).includes("1588"));
	await evaluate(`document.querySelector('[data-focus-root=history] [data-focus-key=norman]').click()`);
	assert.ok((await readout("history")).includes("Hastings"));

	await route("#lesson=e7-norman-words&level=1");
	await evaluate(`document.querySelector('[data-focus-root=pairs] [data-focus-key=pig]').click()`);
	assert.ok((await readout("pairs")).includes("pork"));

	await route("#lesson=e7-pronunciation&level=1");
	await evaluate(`document.querySelector('[data-focus-root=stress] [data-focus-key=record-v]').click()`);
	assert.ok((await readout("stress")).includes("verb"));

	await route("#lesson=e7-reflexive&level=1");
	await evaluate(`document.querySelector('[data-focus-root=mirror] [data-focus-key=each-other]').click()`);
	assert.ok((await readout("mirror")).includes("each other"));

	await route("#lesson=e7-film-scene&level=1");
	await evaluate(`document.querySelector('[data-scene-focus=background]').click()`);
	assert.equal(
		await evaluate('document.querySelector("[data-scene-zone=foreground]").style.opacity'),
		"0.25",
	);
	assert.ok((await text("#scene-readout")).includes("cinema"));

	await route("#lesson=e7-wales&level=1");
	assert.equal(await evaluate('document.querySelectorAll("[data-city]").length'), 6);
	await evaluate('document.querySelector("[data-map-focus=castles]").click()');
	assert.equal(
		await evaluate('document.querySelector("[data-map-layer=cities]").style.opacity'),
		"0.18",
	);
	assert.equal(
		await evaluate('document.querySelector("[data-map-layer=regions]").style.opacity'),
		"1",
	);

	await route("#lesson=e7-desert-southwest&level=1");
	assert.equal(await evaluate('document.querySelectorAll("[data-city]").length'), 10);

	await route("#lesson=e7-vlog-listening&level=1");
	await evaluate('document.querySelector("#partner-listened").click()');
	assert.ok((await text("#listened-status")).includes("Partner"));

	await route("#lesson=e7-media-use&level=1");
	assert.ok((await evaluate('document.querySelector(".account-note")?.innerText ?? ""')).includes("Wo bleibt mein Text"));

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
						"e7-wales",
						"e7-desert-southwest",
						"e7-1066",
						"e7-thanksgiving",
						"e7-conditional-2",
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
				lessons: 44,
				workshopGoals: 132,
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
		`ok: ${states} lesson/level/theme views; 132 goals; responsive checks at 390/720/1280 px; all explorers and persistence checks; no runtime errors or network requests. Output: ${output}`,
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
