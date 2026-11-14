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
const output = process.env.BROWSER_QA_DIR ?? "/private/tmp/zam-f5-browser";
mkdirSync(output, { recursive: true });
const lessons = JSON.parse(readFileSync(`${root}/src/curriculum/lessons.json`));
// Each run needs fresh evidence: a saved partner checkbox must not flip to false.
const profile = mkdtempSync(join(tmpdir(), "zam-french5-browser-"));
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
let errors = [];
let requests = [];
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
function send(method, params = {}, sessionId) {
	return new Promise((resolve, reject) => {
		const id = ++seq;
		const timer = setTimeout(() => {
			pending.delete(id);
			reject(Error(`Chrome timed out: ${method}`));
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
const frame = () =>
	evaluate(
		"new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))",
	);
const route = async (hash) => {
	await evaluate(`location.hash=${JSON.stringify(hash)}`);
	await frame();
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
		url: pathToFileURL(join(root, "dist/index.html")).href,
	});
	for (let i = 0; i < 100; i++) {
		if (await evaluate('!!document.querySelector(".hero")')) break;
		await new Promise((r) => setTimeout(r, 25));
	}
	assert.equal(
		await evaluate('document.querySelectorAll(".lesson-link").length'),
		40,
	);
	let states = 0;
	for (const theme of ["light", "dark"]) {
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
				assert.ok(!/NaN|undefined/.test(result.body));
				await screenshot(`${lesson.id}-level${level}-${theme}`);
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
		`var draft=document.querySelector('#draft');draft.value='Bonjour, Madame. Une baguette, s’il vous plaît. Merci. Au revoir !';draft.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#compare').click()`,
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
			"baguette",
		),
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("1 von 40"),
	);
	await evaluate(
		`var draft=document.querySelector('#draft');draft.value='Bonjour, Monsieur. Une pomme, s’il vous plaît.';draft.dispatchEvent(new Event('input',{bubbles:true}));`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("0 von 40"),
	);
	await route("#lesson=f5-heures&level=2");
	for (const [hour, name] of [
		[0, "minuit"],
		[12, "midi"],
	]) {
		for (const [minute, suffix] of [
			[0, ""],
			[15, " quinze"],
			[30, " trente"],
			[45, " quarante-cinq"],
		]) {
			await evaluate(
				`var h=document.querySelector('#clock-hour');h.value=${JSON.stringify(String(hour))};h.dispatchEvent(new Event('input'));var m=document.querySelector('#clock-minute');m.value=${JSON.stringify(String(minute))};m.dispatchEvent(new Event('change'));`,
			);
			assert.equal(
				await evaluate('document.querySelector("#clock-readout").textContent'),
				`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} · ${name}${suffix}`,
			);
		}
		await screenshot(`clock-${name}`);
	}
	await evaluate(
		`var hour=document.querySelector('#clock-hour');hour.value='21';hour.dispatchEvent(new Event('input'));var minute=document.querySelector('#clock-minute');minute.value='45';minute.dispatchEvent(new Event('change'));`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#clock-readout").innerText')
		).includes("vingt et une heures quarante-cinq"),
	);
	await route("#lesson=f5-nombres&level=1");
	await evaluate(
		`var n=document.querySelector('#number-slider');n.value='71';n.dispatchEvent(new Event('input'))`,
	);
	assert.equal(
		await evaluate('document.querySelectorAll(".number-part")[1].textContent'),
		"11",
	);
	await route("#lesson=f5-france&level=1");
	assert.equal(
		await evaluate('document.querySelectorAll("[data-city]").length'),
		6,
	);
	assert.equal(
		await evaluate('document.querySelectorAll("[data-river]").length'),
		4,
	);
	await evaluate('document.querySelector("[data-map-focus=rivers]").click()');
	assert.equal(
		await evaluate(
			'document.querySelector("[data-map-layer=cities]").style.opacity',
		),
		"0.18",
	);
	await screenshot("map-interaction");
	await route("#lesson=f5-famille&level=1");
	await evaluate(
		'Array.from(document.querySelectorAll(".quiz-choice")).find(el=>el.textContent==="ma mère").click()',
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#quiz-feedback").innerText')
		).includes("Lina spricht selbst"),
	);
	await route("#lesson=f5-sons&level=1");
	// No installed voice is required: partner evidence is a complete accessible fallback.
	await evaluate('document.querySelector("#partner-listened").click()');
	assert.ok(
		(
			await evaluate('document.querySelector("#listened-status").textContent')
		).includes("Partner"),
	);
	for (const width of [390, 720]) {
		await page("Emulation.setDeviceMetricsOverride", {
			width,
			height: 844,
			deviceScaleFactor: 1,
			mobile: width === 390,
		});
		for (const theme of ["light", "dark"]) {
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
						"f5-heures",
						"f5-france",
						"f5-bonjour",
						"f5-nombres",
						"reference",
					].includes(id)
				)
					await screenshot(`mobile-${width}-${id || "path"}-${theme}`);
			}
		}
	}
	// The built offline app must not issue any HTTP request.
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
				checks: [
					"all workshop handlers",
					"quiz feedback",
					"short answers",
					"rubric gate",
					"reload persistence",
					"edited-draft invalidation",
					"clock",
					"number slider",
					"map layers",
					"midnight/noon clock labels",
					"first-person possessive quiz",
					"partner listening",
				],
			},
			null,
			2,
		),
	);
	console.log(
		`ok: ${states} lesson/level/theme views; 120 goals; responsive checks at 390/720 px; interaction and persistence checks; no runtime errors or network requests.`,
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
