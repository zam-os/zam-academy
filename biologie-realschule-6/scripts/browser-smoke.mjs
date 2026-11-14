// No browser dependency: drive an installed Chrome through its debugging pipe.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(process.argv[2] ?? join(tmpdir(), "zam-bio6-browser"));
mkdirSync(output, { recursive: true });
const profile = mkdtempSync(join(tmpdir(), "zam-bio6-chrome-"));
const lessons = [1, 2, 3, 4].flatMap((n) =>
	JSON.parse(readFileSync(join(root, `src/curriculum/lessons-lb${n}.json`))),
);
const binary =
	process.env.CHROME_BIN ??
	(process.platform === "darwin"
		? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
		: "google-chrome");
const chrome = spawn(
	binary,
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
	{ stdio: ["ignore", "ignore", "ignore", "pipe", "pipe"] },
);
const closed = new Promise((resolveClosed) =>
	chrome.once("close", resolveClosed),
);
let sequence = 0,
	buffer = "",
	session;
const pending = new Map(),
	errors = [],
	requests = [];
chrome.on("error", (error) => {
	for (const job of pending.values()) job.reject(error);
});
chrome.stdio[4].on("data", (chunk) => {
	buffer += chunk.toString();
	while (true) {
		const index = buffer.indexOf("\0");
		if (index < 0) break;
		const line = buffer.slice(0, index);
		buffer = buffer.slice(index + 1);
		if (!line) continue;
		const message = JSON.parse(line);
		if (message.id) {
			const job = pending.get(message.id);
			pending.delete(message.id);
			if (message.error) job.reject(Error(JSON.stringify(message.error)));
			else job.resolve(message.result);
		} else {
			if (message.method === "Runtime.exceptionThrown")
				errors.push(message.params.exceptionDetails);
			if (message.method === "Network.requestWillBeSent")
				requests.push(message.params.request.url);
		}
	}
});
function send(method, params = {}, sessionId) {
	return new Promise((resolveJob, reject) => {
		const id = ++sequence;
		const timer = setTimeout(() => {
			pending.delete(id);
			reject(Error(`Chrome timed out: ${method}`));
		}, 15000);
		pending.set(id, {
			resolve: (value) => {
				clearTimeout(timer);
				resolveJob(value);
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
const page = (method, params) => send(method, params, session);
const evaluate = async (expression) => {
	const result = await page("Runtime.evaluate", {
		expression,
		returnByValue: true,
		awaitPromise: true,
	});
	if (result.exceptionDetails)
		throw Error(JSON.stringify(result.exceptionDetails));
	return result.result.value;
};
const settle = () =>
	evaluate(
		"new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))",
	);
const go = async (hash) => {
	await evaluate(`location.hash=${JSON.stringify(hash)}`);
	await settle();
};
const screenshot = async (name) => {
	const metrics = await page("Page.getLayoutMetrics");
	const result = await page("Page.captureScreenshot", {
		format: "png",
		captureBeyondViewport: true,
		clip: {
			x: 0,
			y: 0,
			width: metrics.cssContentSize.width,
			height: metrics.cssContentSize.height,
			scale: 1,
		},
	});
	writeFileSync(
		join(output, `${name}.png`),
		Buffer.from(result.data, "base64"),
	);
};
const click = (selector) =>
	evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
const select = (selector, value) =>
	evaluate(
		`var control=document.querySelector(${JSON.stringify(selector)});control.value=${JSON.stringify(String(value))};control.dispatchEvent(new Event('change',{bubbles:true}));`,
	);
const toggle = (key, checked) =>
	evaluate(
		`var control=document.querySelector('[data-model-toggle="${key}"]');control.checked=${checked};control.dispatchEvent(new Event('change',{bubbles:true}));`,
	);
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
	await page("Page.navigate", { url: `file://${root}dist/index.html` });
	for (let n = 0; n < 200; n++) {
		if (await evaluate('!!document.querySelector(".hero")')) break;
		await new Promise((r) => setTimeout(r, 25));
	}
	await evaluate('localStorage.removeItem("biologie_rs6_academy_progress_v1")');
	assert.equal(
		await evaluate('document.querySelectorAll(".lesson-link").length'),
		30,
	);
	assert.equal(
		await evaluate('document.querySelector("footer a").href'),
		"https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/biologie",
	);
	let pages = 0;
	for (const theme of ["light", "dark"]) {
		await evaluate(
			`document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
		);
		await go("");
		await screenshot(`path-${theme}`);
		for (const lesson of lessons)
			for (const level of [1, 2]) {
				await go(`#lesson=${lesson.id}&level=${level}`);
				const data = await evaluate(
					`({title:document.querySelector('main h1')?.textContent,prompt:document.querySelector('.task-prompt')?.textContent,main:document.querySelector('main')?.innerText,quiz:document.querySelectorAll('[data-choice]').length,entries:document.querySelectorAll('[data-assign]').length,timeline:document.querySelectorAll('.timeline>li').length,models:document.querySelectorAll('.exploration').length,over:document.documentElement.scrollWidth>innerWidth})`,
				);
				assert.equal(data.title, lesson.title, lesson.id);
				assert.equal(data.prompt, lesson.tasks[level].prompt);
				assert.equal(data.quiz, 3);
				assert.equal(
					data.entries + data.timeline,
					lesson.workshop.entries.length,
				);
				assert.equal(data.models, lesson.model ? 1 : 0);
				assert.ok(!/NaN|undefined/.test(data.main));
				assert.equal(data.over, false);
				await screenshot(`${lesson.id}-level${level}-${theme}`);
				pages++;
			}
		await go("#view=reference");
		assert.equal(
			await evaluate('document.querySelectorAll(".reference dt").length'),
			30,
		);
		await screenshot(`reference-${theme}`);
	}
	// Exercise real controls: quiz, timeline, rubric gating, persistence and invalidation.
	await go("#lesson=b6-forschen&level=1");
	await click('[data-choice="1"]');
	assert.match(
		await evaluate('document.querySelector(".quiz .feedback").innerText'),
		/Prüfe/,
	);
	await click('[data-choice="0"]');
	// Bubble the correct timeline entry upward using the actual move buttons.
	const orderedTexts = lessons[0].workshop.entries.map((entry) => entry.text);
	for (let target = 0; target < orderedTexts.length; target++) {
		let at = await evaluate(
			`Array.from(document.querySelectorAll('.timeline .event-text')).findIndex(e=>e.textContent===${JSON.stringify(orderedTexts[target])})`,
		);
		while (at > target) {
			await click(`[data-move="${at}"][data-delta="-1"]`);
			at--;
		}
	}
	await click("#check-workshop");
	assert.match(
		await evaluate('document.querySelector(".workshop .feedback").innerText'),
		/Die Zuordnung stimmt/,
	);
	await evaluate(
		`var draft=document.querySelector('#draft');draft.value='Eine eigene begründete Antwort zum Vergleich von feuchten und trockenen Bohnensamen.';draft.dispatchEvent(new Event('input',{bubbles:true}));`,
	);
	await click("#compare");
	assert.equal(
		await evaluate('document.querySelector("#accept-writing").disabled'),
		true,
	);
	await evaluate(
		`document.querySelectorAll('[data-rubric]').forEach(e=>{e.checked=true;e.dispatchEvent(new Event('change',{bubbles:true}));});`,
	);
	await click("#accept-writing");
	assert.match(
		await evaluate('document.querySelector("#lesson-status").innerText'),
		/abgeschlossen/,
	);
	await page("Page.reload");
	for (let n = 0; n < 100; n++) {
		if (await evaluate('!!document.querySelector("#draft")')) break;
		await new Promise((r) => setTimeout(r, 20));
	}
	assert.match(
		await evaluate('document.querySelector("#draft").value'),
		/Bohnensamen/,
	);
	await evaluate(
		`var draft=document.querySelector('#draft');draft.value='Eine korrigierte eigene Antwort.';draft.dispatchEvent(new Event('input',{bubbles:true}));`,
	);
	assert.doesNotMatch(
		await evaluate('document.querySelector("#lesson-status").innerText'),
		/abgeschlossen/,
	);
	// Classification handler.
	await go("#lesson=b6-bewerten&level=1");
	for (const [index, entry] of lessons
		.find((l) => l.id === "b6-bewerten")
		.workshop.entries.entries())
		await select(`[data-assign="${index}"]`, entry.target);
	await click("#check-workshop");
	assert.match(
		await evaluate('document.querySelector(".workshop .feedback").innerText'),
		/Die Zuordnung stimmt/,
	);
	// Each model family's goals are reached through the real controls.
	for (const lesson of lessons.filter((l) => l.model)) {
		await go(`#lesson=${lesson.id}&level=1`);
		if (lesson.model === "flower")
			for (const phase of [1, 2, 3]) {
				await select('[data-model-select="phase"]', phase);
				await click("#record-model");
			}
		if (lesson.model === "germination") {
			await toggle("warm", true);
			await click("#record-model");
			await toggle("water", true);
			await toggle("light", false);
			await click("#record-model");
			await toggle("air", false);
			await click("#record-model");
		}
		if (lesson.model === "temperature") {
			await select('[data-model-range="temperature"]', 5);
			await click("#record-model");
			await select('[data-model-select="animal"]', "lizard");
			await click("#record-model");
			await select('[data-model-range="temperature"]', 30);
			await click("#record-model");
		}
		if (lesson.model === "foodweb") {
			await toggle("leaves", false);
			await click("#record-model");
			await toggle("alternative", true);
			await click("#record-model");
			await toggle("leaves", true);
			await click("#record-model");
		}
		assert.equal(
			await evaluate(
				'Array.from(document.querySelectorAll(".model-goals li")).filter(e=>e.textContent.startsWith("✓")).length',
			),
			3,
		);
		await screenshot(`${lesson.id}-goals`);
	}
	await go("#lesson=b6-lebensraum&level=1");
	await evaluate(
		`var field=document.querySelector('#project-place');field.value='Öffentliche Hecke am Schulgelände';field.dispatchEvent(new Event('input',{bubbles:true}));`,
	);
	assert.match(
		await evaluate('localStorage.getItem("biologie_rs6_academy_progress_v1")'),
		/Öffentliche Hecke/,
	);
	assert.ok(
		await evaluate(
			`document.querySelector('.zam-preview-notice')?.getBoundingClientRect().height > 0`,
		),
		"preview status is visible",
	);
	await click("#zam");
	assert.match(
		await evaluate('document.querySelector("dialog").innerText'),
		/Vorschau im Academy-Katalog/,
	);
	assert.doesNotMatch(
		await evaluate('document.querySelector("dialog").innerText'),
		/lokaler Entwurf|erst nach einer gesonderten Veröffentlichung/,
	);
	await click("dialog [data-close]");
	// Every lesson and reference at a narrow phone width, both themes.
	await page("Emulation.setDeviceMetricsOverride", {
		width: 390,
		height: 844,
		deviceScaleFactor: 1,
		mobile: true,
	});
	let mobilePages = 0;
	for (const theme of ["light", "dark"]) {
		await evaluate(
			`document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
		);
		for (const hash of [
			"",
			"#view=reference",
			...lessons.map((l) => `#lesson=${l.id}&level=2`),
		]) {
			await go(hash);
			assert.equal(
				await evaluate("document.documentElement.scrollWidth>innerWidth"),
				false,
				`mobile ${hash}`,
			);
			mobilePages++;
			if (
				!hash ||
				/b6-(bluete|keimung|temperatur|nahrungsnetz|lebensraum)/.test(hash)
			)
				await screenshot(
					`mobile-${hash.replace(/[^a-z0-9-]/gi, "_") || "path"}-${theme}`,
				);
		}
	}
	assert.deepEqual(errors, []);
	assert.deepEqual(
		requests.filter((url) => /^https?:/.test(url)),
		[],
	);
	const report = {
		lessons: 30,
		desktopLessonViews: pages,
		mobileViews: mobilePages,
		themes: ["light", "dark"],
		levels: [1, 2],
		runtimeErrors: 0,
		externalRequests: 0,
		interactions: [
			"wrong and right quiz",
			"timeline move buttons",
			"classification",
			"rubric gate",
			"draft invalidation",
			"reload persistence",
			"all model goals",
			"field notebook",
			"ZAM preview notice",
		],
	};
	writeFileSync(
		join(output, "report.json"),
		JSON.stringify(report, null, 2) + "\n",
	);
	console.log(JSON.stringify(report));
} finally {
	await send("Browser.close").catch(() => {});
	chrome.kill();
	await closed;
	rmSync(profile, {
		recursive: true,
		force: true,
		maxRetries: 5,
		retryDelay: 50,
	});
}
