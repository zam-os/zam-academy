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
const output = process.env.BROWSER_QA_DIR ?? join(tmpdir(), "zam-f8-2fs-browser");
mkdirSync(output, { recursive: true });
const lessons = JSON.parse(readFileSync(`${root}/src/curriculum/lessons.json`));
// Each run needs fresh evidence: a saved partner checkbox must not flip to false.
const profile = mkdtempSync(join(tmpdir(), "zam-french8-browser-"));
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
let browserLog = "";
chrome.stderr.setEncoding("utf8");
chrome.stderr.on("data", (chunk) => { browserLog = (browserLog + chunk).slice(-2500); });
chrome.stdio[4].setEncoding("utf8");
chrome.on("error", (error) => {
	for (const job of pending.values()) job.reject(error);
});
let errors = [];
let requests = [];
const academyOrigin = "https://academy.zam-os.org";
const hostedUrl = `${academyOrigin}/franzoesisch-2fs-gymnasium-8/`;
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
			if (msg.method === "Fetch.requestPaused") {
				const url = new URL(msg.params.request.url);
				url.search = "";
				url.hash = "";
				const html = hostedPages.get(url.href);
				void page("Fetch.fulfillRequest", {
					requestId: msg.params.requestId,
					responseCode: html ? 200 : 404,
					responseHeaders: [{ name: "Content-Type", value: "text/html; charset=UTF-8" }],
					body: html?.toString("base64") ?? "",
				}).catch((error) => errors.push(error.message));
			}
		}
	}
});
function send(method, params = {}, sessionId) {
	return new Promise((resolve, reject) => {
		const id = ++seq;
		const timer = setTimeout(() => {
			pending.delete(id);
			reject(Error(`Chrome timed out: ${method} (${params.expression?.slice(0, 170) ?? ""})\n${browserLog}`));
		}, 15000);
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
const appUrl = pathToFileURL(join(root, "dist/index.html")).href;
const hostedPages = new Map([
	[hostedUrl, readFileSync(join(root, "dist/index.html"))],
]);
const waitForPage = async (expression, message) => {
	for (let attempt = 0; attempt < 100; attempt++) {
		if (await evaluate(expression)) return;
		await new Promise((resolve) => setTimeout(resolve, 20));
	}
	throw Error(message);
};
const route = async (hash) => {
	const params = new URLSearchParams(hash.slice(1));
	const lesson = lessons.find((entry) => entry.id === params.get("lesson"));
	const ready = lesson
		? `document.querySelector('main h1')?.textContent === ${JSON.stringify(lesson.title)} &&
			document.querySelector('#level')?.value === ${JSON.stringify(params.get("level"))}`
		: params.get("view") === "reference"
			? "!!document.querySelector('.reference-links')"
			: "!!document.querySelector('.hero')";
	const expected = `location.hash === ${JSON.stringify(hash)} && (${ready})`;
	await page("Page.navigate", { url: appUrl + hash });
	await waitForPage(expected, `The built page did not render route ${hash || "home"}.`);
};
const themeOfPage = () => evaluate("getComputedStyle(document.documentElement).colorScheme");
const selectTheme = async (theme) => {
	if (await themeOfPage() !== theme) await evaluate("document.querySelector('#theme').click()");
	assert.equal(await themeOfPage(), theme);
};
try {
	const { targetId } = await send("Target.createTarget", {
		url: "about:blank",
	});
	session = (await send("Target.attachToTarget", { targetId, flatten: true }))
		.sessionId;
	await page("Page.enable");
	await page("Runtime.enable");
	await page("Network.enable");
	await page("Emulation.setDeviceMetricsOverride", {
		width: 1280,
		height: 1100,
		deviceScaleFactor: 1,
		mobile: false,
	});
	await page("Page.navigate", {
		url: appUrl,
	});
	for (let i = 0; i < 100; i++) {
		if (await evaluate('!!document.querySelector(".hero")')) break;
		await new Promise((r) => setTimeout(r, 25));
	}
	assert.equal(
		await evaluate('document.querySelectorAll(".lesson-link").length'),
		lessons.length,
	);
	let states = 0;
	for (const theme of ["light", "dark"]) {
		await selectTheme(theme);
		await route("");
		assert.equal(await evaluate('document.querySelectorAll(".lesson-link").length'), lessons.length);
		assert.equal(await evaluate('document.querySelector("[data-track]") === null'), true);
		await screenshot(`path-${theme}`);
		await route("#view=reference");
		assert.ok(await evaluate(`[...document.querySelectorAll('[data-lesson]')].every(link => link.dataset.lesson.startsWith("f8-2-"))`));
		assert.ok(await evaluate("document.querySelectorAll('.reference-links li').length > 4"));
		await screenshot(`reference-${theme}`);
		for (const lesson of lessons)
			for (const level of [1, 2]) {
				await route(`#lesson=${lesson.id}&level=${level}`);
				const result = await evaluate(
					`({title:document.querySelector('main h1')?.textContent,prompt:document.querySelector('.task-prompt')?.textContent,body:document.querySelector('main')?.innerText,quiz:document.querySelectorAll('.quiz-choice').length,practice:document.querySelectorAll('.practice-input').length,goals:document.querySelectorAll('[data-workshop]').length,over:document.documentElement.scrollWidth>innerWidth,initial:document.querySelector('#workshop-status')?.textContent})`,
				);
				assert.equal(await themeOfPage(), theme, lesson.id);
				assert.equal(result.title, lesson.title);
				assert.equal(result.prompt, lesson.tasks[level].prompt);
				assert.equal(result.quiz, 3);
				assert.equal(result.practice, 2);
				assert.equal(result.goals, 3);
				assert.ok(result.initial.startsWith("0 von 3"));
				assert.equal(result.over, false, lesson.id);
				assert.ok(!/NaN|undefined/.test(result.body));
				if (["f8-2-annonce", "f8-2-inversion", "f8-2-statistiques", "f8-2-avant-apres", "f8-2-quebec", "f8-2-chateau", "f8-2-bd"].includes(lesson.id))
					await screenshot(`${lesson.id}-level${level}-${theme}`);
				states++;
			}
		await route("#view=reference");
		assert.ok(
			(await evaluate('document.querySelector("main").innerText')).includes(
				"Sprachwerkstatt",
			),
		);

	}
	// Every workshop is reached through its real change handlers.
	for (const lesson of lessons) {
		await route(`#lesson=${lesson.id}&level=1`);
		await evaluate(
			`var answers=${JSON.stringify(lesson.workshop.goals.map((g) => g.answer))};document.querySelectorAll('[data-workshop]').forEach((el,i)=>{el.value=answers[i];el.dispatchEvent(new Event('change',{bubbles:true}));});`,
		);
		assert.ok(
			(
				await evaluate('document.querySelector("#workshop-status").textContent')
			).startsWith("3 von 3"),
		);
		const explorers = await evaluate(`Array.from(document.querySelectorAll('[data-explorer]')).every(explorer => {
			const options = [...explorer.querySelectorAll('[data-step]')];
			const panels = [...explorer.querySelectorAll('[data-step-panel]')];
			return options.length > 1 && options.every(button => {
				button.click();
				return options.filter(option => option.getAttribute('aria-pressed') === 'true').length === 1 &&
					panels.filter(panel => !panel.hidden).map(panel => panel.dataset.stepPanel).join(',') === button.dataset.step;
			});
		})`);
		assert.equal(explorers, true, lesson.id);
	}
	// The first lesson without a listening requirement completes on these four steps alone.
	const first = lessons.find((lesson) => !lesson.listening);
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
		`var draft=document.querySelector('#draft');draft.value=${JSON.stringify(first.tasks[1].model)};draft.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#compare').click()`,
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
		).includes(`1 von ${lessons.length}`),
	);
	await page("Page.reload");
	for (let i = 0; i < 100; i++) {
		if (await evaluate('!!document.querySelector("#draft")')) break;
		await new Promise((r) => setTimeout(r, 20));
	}
	assert.equal(await evaluate('document.querySelector("#draft").value'), first.tasks[1].model);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes(`1 von ${lessons.length}`),
	);
	await evaluate(
		`var draft=document.querySelector('#draft');draft.value='Bonjour, Monsieur. Une pomme, s’il vous plaît.';draft.dispatchEvent(new Event('input',{bubbles:true}));`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes(`0 von ${lessons.length}`),
	);
	await evaluate(`var draft=document.querySelector('#draft');draft.setSelectionRange(draft.value.length,draft.value.length);document.querySelector('#draft-accents [data-char="œ"]').click()`);
	assert.ok((await evaluate("document.querySelector('#draft').value")).endsWith("œ"));
	await evaluate(`var input=document.querySelector('#practice-1');input.focus();input.value='e';input.setSelectionRange(0,1);document.querySelector('#practice-accents [data-char="é"]').click()`);
	assert.equal(await evaluate("document.querySelector('#practice-1').value"), "é");

	await route(`#lesson=${lessons[0].id}&level=2`);
	assert.equal(await evaluate("document.querySelector('#previous').disabled"), true);
	await route(`#lesson=${lessons.at(-1).id}&level=1`);
	assert.equal(await evaluate("document.querySelector('#next').disabled"), true);
	await route("#lesson=f8-2-avant-apres&level=1");
	await evaluate(`document.querySelector('.timeline-explorer [data-step="1"]').click()`);
	assert.ok((await evaluate('document.querySelector(".timeline-explorer [data-step-panel]:not([hidden])").textContent')).includes("suis arrivé"));
	assert.equal(await evaluate(`getComputedStyle(document.querySelector('.timeline-figure [data-mark="1"] circle')).r`), "17px");
	await screenshot("timeline-interaction");
	await route("#lesson=f8-2-quebec&level=1");
	assert.equal(await evaluate('document.querySelectorAll(".quebec-map [data-mark]").length'), 3);
	for (const step of [0, 1, 2]) {
		await evaluate(`document.querySelector('.map-explorer [data-step="${step}"]').click()`);
		const lit = await evaluate(`[...document.querySelectorAll('.quebec-map [data-mark] > .region-halo')].map((halo) => getComputedStyle(halo).opacity)`);
		assert.deepEqual(lit, step === 2 ? ["0", "0"] : step === 0 ? ["1", "0"] : ["0", "1"]);
	}
	await screenshot("map-interaction");
	await route("#lesson=f8-2-sons&level=1");
	assert.equal(await evaluate("document.querySelector('.lesson-content > section:first-child h2').textContent"), "Zuerst hören");
	// No installed voice is required: partner evidence is a complete accessible fallback.
	await evaluate('document.querySelector("#partner-listened").click()');
	assert.ok(
		(
			await evaluate('document.querySelector("#listened-status").textContent')
		).includes("Partner"),
	);
	for (const width of [375, 720]) {
		await page("Emulation.setDeviceMetricsOverride", {
			width,
			height: 844,
			deviceScaleFactor: 1,
			mobile: width === 375,
		});
		for (const theme of ["light", "dark"]) {
			await selectTheme(theme);
			for (const id of ["", ...lessons.map((l) => l.id), "reference"]) {
				await route(
					id === "reference"
						? "#view=reference"
						: id
							? `#lesson=${id}&level=2`
							: "",
				);
				assert.equal(await themeOfPage(), theme, id || "path");
				assert.equal(
					await evaluate("document.documentElement.scrollWidth>innerWidth"),
					false,
					`overflow ${width} ${id}`,
				);
				if (
					[
						"",
						"f8-2-statistiques",
						"f8-2-chateau",
						"f8-2-quebec",
						"f8-2-mise-en-relief",
						"reference",
					].includes(id)
				)
					await screenshot(`mobile-${width}-${id || "path"}-${theme}`);
			}
		}
	}
	// Reset in a second tab: the first tab must drop typed answers, marks and drafts.
	await route(`#lesson=${first.id}&level=1`);
	await evaluate(`var input=document.querySelector('#practice-0');input.value='réponse en cours';input.dispatchEvent(new Event('input',{bubbles:true}));`);
	assert.ok(await evaluate("document.querySelector('#draft').value.length > 0"));
	const { targetId: secondTarget } = await send("Target.createTarget", { url: "about:blank" });
	const second = (await send("Target.attachToTarget", { targetId: secondTarget, flatten: true })).sessionId;
	const evaluateSecond = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }, second)).result.value;
	await send("Page.enable", {}, second);
	await send("Page.navigate", { url: appUrl }, second);
	for (let i = 0; i < 100 && !(await evaluateSecond('!!document.querySelector("#reset")')); i++)
		await new Promise((resolve) => setTimeout(resolve, 20));
	await evaluateSecond("document.querySelector('#reset').click(); document.querySelector('#confirm-reset').click()");
	await waitForPage(
		"document.querySelector('#practice-0')?.value === '' && document.querySelector('#draft')?.value === '' && !document.querySelector('.done-mark:not(#writing-status)')",
		"A reset in another tab left typed answers, drafts or marks visible.",
	);
	await send("Target.closeTarget", { targetId: secondTarget });
	await route(`#lesson=${first.id}&level=1`);
	await evaluate(`var draft=document.querySelector('#draft');draft.value=${JSON.stringify(first.tasks[1].model)};draft.dispatchEvent(new Event('input',{bubbles:true}));`);
	assert.ok(await evaluate("document.querySelector('#draft').value.length > 0"));
	await evaluate("document.querySelector('.draft-storage summary').click()");
	assert.match(
		await evaluate("document.querySelector('.draft-storage[open] p').textContent"),
		/Lokalen Fortschritt zurücksetzen/,
	);
	await evaluate("document.querySelector('#reset').click(); document.querySelector('#confirm-reset').click()");
	await route(`#lesson=${first.id}&level=1`);
	assert.equal(await evaluate("document.querySelector('#draft').value"), "");

	// The built offline app must not issue any HTTP request.
	assert.deepEqual(errors, []);
	assert.deepEqual(
		requests.filter((url) => /^https?:/.test(url)),
		[],
	);
	// Serve the build through Chrome's request interception at its production
	// address: the hosted base path must render a deep link without a live deploy.
	await page("Fetch.enable", { patterns: [{ urlPattern: `${academyOrigin}/*` }] });
	const hostedHash = `#lesson=${lessons.at(-1).id}&level=2`;
	await page("Page.navigate", { url: hostedUrl + hostedHash });
	await waitForPage(
		`location.href === ${JSON.stringify(hostedUrl)} + ${JSON.stringify(hostedHash)} && document.querySelector('main h1')?.textContent === ${JSON.stringify(lessons.at(-1).title)}`,
		"The hosted address did not open the deep-linked lesson.",
	);
	assert.deepEqual(errors, []);
	writeFileSync(
		`${output}/report.json`,
		JSON.stringify(
			{
				states,
				lessons: lessons.length,
				workshopGoals: lessons.length * 3,
				themes: ["light", "dark"],
				levels: [1, 2],
				responsiveWidths: [375, 720, 1280],
				runtimeErrors: 0,
				externalRequests: 0,
				checks: [
					"all workshop handlers",
					"single course path and progress",
					"all visual selectors",
					"accent insertion",
					"quiz feedback",
					"short answers",
					"rubric gate",
					"reload persistence",
					"edited-draft invalidation",
										"shared-profile help and draft reset",
					"interactive timeline",
					"Québec map highlights",
					"partner listening",
					"hosted deep link",
					"reset from a second tab clears the open lesson",
				],
			},
			null,
			2,
		),
	);
	console.log(
		`ok: ${states} lesson/level/theme views; ${lessons.length * 3} goals; responsive checks at 375/720 px; interaction and persistence checks; hosted deep link; no offline network requests.`,
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
