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
const output = process.env.BROWSER_QA_DIR ?? join(tmpdir(), "zam-e6s-browser");
mkdirSync(output, { recursive: true });
const lessons = JSON.parse(readFileSync(`${root}/src/curriculum/lessons.json`));
const profile = mkdtempSync(join(tmpdir(), "zam-english6-2fs-browser-"));
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
		43,
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
				if (["e6s-hello", "e6s-numbers", "e6s-time", "e6s-family", "e6s-home", "e6s-this-that", "e6s-some-any", "e6s-simple-present", "e6s-modals", "e6s-word-order", "e6s-shopping", "e6s-clothes", "e6s-festivals", "e6s-british-isles", "e6s-london", "e6s-north-america", "e6s-washington-new-york", "e6s-city-country", "e6s-listening", "e6s-sounds", "e6s-rhyme"].includes(lesson.id)) {
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
		`var draft=document.querySelector('#draft');draft.value='Hello Amy. My name is Mia and I come from Augsburg in Germany.';draft.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#compare').click()`,
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
		).includes("1 von 43"),
	);
	await page("Page.reload");
	for (let i = 0; i < 100; i++) {
		if (await evaluate('!!document.querySelector("#draft")')) break;
		await new Promise((r) => setTimeout(r, 20));
	}
	assert.ok(
		(await evaluate('document.querySelector("#draft").value')).includes(
			"come from Augsburg",
		),
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("1 von 43"),
	);
	await evaluate(
		`var draft=document.querySelector('#draft');draft.value='Hello, my name is Mia. Nice to meet you, Amy!';draft.dispatchEvent(new Event('input',{bubbles:true}));`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("0 von 43"),
	);

	// Cross-tab reset: resetting in a second tab clears open lesson inputs and feedback
	await evaluate(
		`Array.from(document.querySelectorAll('.quiz-choice')).find(el=>el.textContent===${JSON.stringify(first.quiz.answer)}).click()`,
	);
	await evaluate(
		`var answers=${JSON.stringify(first.practice.map((p) => p.answers[0]))};document.querySelectorAll('.practice-input').forEach((el,i)=>{el.value=answers[i];el.dispatchEvent(new Event('input',{bubbles:true}));});document.querySelector('#practice-form').requestSubmit()`,
	);
	await evaluate(
		`var draft=document.querySelector('#draft');draft.value='Hello Amy. My name is Mia and I come from Augsburg in Germany.';draft.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#compare').click();document.querySelectorAll('.criterion').forEach(el=>{el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));});document.querySelector('#accept').click()`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("1 von 43"),
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
		if (stripped.includes("0 von 43")) break;
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
	assert.ok(afterCrossReset.strip.includes("0 von 43"));
	assert.deepEqual(afterCrossReset.practiceValues, ["", ""]);
	assert.equal(afterCrossReset.practiceFeedback, "");
	assert.equal(afterCrossReset.quizFeedback, "");
	assert.ok(afterCrossReset.workshopStatus.startsWith("0 von 3"));
	assert.equal(afterCrossReset.draft, "");

	// Interactive Grade 6 (second foreign language) explorers.
	const text = (selector) =>
		evaluate(`document.querySelector(${JSON.stringify(selector)})?.textContent ?? ""`);
	const readout = (root) => text(`[data-focus-root=${root}] [data-focus-readout]`);
	const press = (root, key) =>
		evaluate(`document.querySelector('[data-focus-root=${root}] [data-focus-key="${key}"]').click()`);

	await route("#lesson=e6s-time&level=1");
	await evaluate(`var h=document.querySelector('#clock-hour');h.value='19';h.dispatchEvent(new Event('input'));var m=document.querySelector('#clock-minute');m.value='45';m.dispatchEvent(new Event('input'));`);
	assert.equal(await text("#clock-readout"), "19:45 · It's quarter to eight. · 7:45 p.m.");
	assert.equal(await evaluate('document.querySelector("#minute-hand").getAttribute("transform")'), "rotate(270 110 110)");

	await route("#lesson=e6s-numbers&level=1");
	await evaluate(`var d=document.querySelector('#date-day');d.value='3';d.dispatchEvent(new Event('input'));var mo=document.querySelector('#date-month');mo.value='4';mo.dispatchEvent(new Event('change'));`);
	assert.equal(await text("[data-date-written]"), "My birthday is on 3rd May.");
	assert.equal(await text("[data-date-spoken]"), "Say: on the third of May");

	await route("#lesson=e6s-shopping&level=1");
	assert.ok((await text("[data-shop-total]")).includes("fourteen pounds"));
	await evaluate(`var n=document.querySelector('[data-shop-note]');n.value='1000';n.dispatchEvent(new Event('change'));`);
	assert.ok((await text("[data-shop-change]")).includes("isn't enough"));

	await route("#lesson=e6s-family&level=1");
	await press("family", "lucy");
	assert.ok((await readout("family")).includes("her mum is Kate"));
	assert.equal(await evaluate(`document.querySelector('.node-lucy .node-owner').hasAttribute('hidden')`), false);
	assert.equal(await evaluate(`document.querySelector('.node-me .node-owner').hasAttribute('hidden')`), true);

	await route("#lesson=e6s-home&level=1");
	await press("room", "between");
	assert.equal(await readout("room"), "The ball is between the bed and the desk.");

	await route("#lesson=e6s-word-order&level=1");
	await press("blocks", "1");
	assert.ok((await readout("blocks")).includes("Place before time"));
	assert.equal(await evaluate(`document.querySelector('[data-focus-root=blocks] [data-focus-item="0"]').hasAttribute('hidden')`), true);

	await route("#lesson=e6s-simple-present&level=1");
	await press("frequency", "never");
	assert.ok((await readout("frequency")).includes("never"));

	await route("#lesson=e6s-modals&level=1");
	await press("signs", "neednt");
	assert.ok((await readout("signs")).includes("keine Pflicht"));

	await route("#lesson=e6s-festivals&level=1");
	await evaluate(`document.querySelector('[data-calendar-shift="1"]').click()`);
	const year = Number(await text("[data-calendar-year]"));
	assert.ok((await readout("calendar")).includes(String(year)));
	assert.ok((await readout("calendar")).includes("5th November"));

	await route("#lesson=e6s-british-isles&level=1");
	await press("isles", "ireland");
	assert.ok((await readout("isles")).includes("Republic of Ireland"));
	assert.equal(await evaluate(`document.querySelector('.land-scotland').getAttribute('data-dim')`), "true");

	await route("#lesson=e6s-london&level=1");
	await press("london", "eye");
	assert.ok((await readout("london")).includes("opposite"));

	await route("#lesson=e6s-north-america&level=1");
	await press("na", "hawaii");
	assert.ok((await readout("na")).includes("Pacific"));

	await route("#lesson=e6s-washington-new-york&level=1");
	await press("cities", "liberty");
	assert.ok((await readout("cities")).includes("France"));

	await route("#lesson=e6s-food&level=1");
	await press("chat", "ask");
	assert.ok((await readout("chat")).includes("pass me the salt"));

	await route("#lesson=e6s-sounds&level=1");
	await press("sound", "up");
	assert.ok((await readout("sound")).includes("goes up"));

	await route("#lesson=e6s-to-be&level=1");
	await evaluate(`var s=document.querySelector('[data-transform]');s.value='6';s.dispatchEvent(new Event('change'));`);
	assert.equal(await text(".transform-out"), "they are – they're – they aren't");

	await route("#lesson=e6s-listening&level=1");
	await evaluate('document.querySelector("#partner-listened").click()');
	assert.ok((await text("#listened-status")).includes("Partner"));

	await route("#lesson=e6s-writing&level=1");
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
						"e6s-family",
						"e6s-london",
						"e6s-north-america",
						"e6s-shopping",
						"e6s-word-order",
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
				lessons: 43,
				workshopGoals: 129,
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
		`ok: ${states} lesson/level/theme views; 129 goals; responsive checks at 390/720/1280 px; all explorers and persistence checks; no runtime errors or network requests. Output: ${output}`,
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
