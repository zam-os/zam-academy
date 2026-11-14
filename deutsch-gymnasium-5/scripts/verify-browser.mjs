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
const output =
	process.env.BROWSER_QA_DIR ?? "/private/tmp/zam-deutsch-gym5-browser";
mkdirSync(output, { recursive: true });
const lessons = JSON.parse(readFileSync(`${root}/src/curriculum/lessons.json`));
// Each run needs fresh evidence: a saved partner checkbox must not flip to false.
const profile = mkdtempSync(join(tmpdir(), "zam-deutsch-gym5-browser-"));
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
	while (buffer.includes("\0")) {
		const index = buffer.indexOf("\0");
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
	const layout = await page("Page.getLayoutMetrics");
	const result = await page("Page.captureScreenshot", {
		format: "png",
		captureBeyondViewport: true,
		clip: {
			x: 0,
			y: 0,
			width: layout.cssContentSize.width,
			height: layout.cssContentSize.height,
			scale: 1,
		},
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
		46,
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
					`({title:document.querySelector('main h1')?.textContent,prompt:document.querySelector('.task-prompt')?.textContent,body:document.querySelector('main')?.innerText,quiz:document.querySelectorAll('.quiz-choice').length,cases:document.querySelectorAll('[data-case]').length,visual:document.querySelectorAll('[data-visual-step]').length,selected:document.querySelectorAll('[data-visual-step][aria-pressed=true]').length,over:document.documentElement.scrollWidth>innerWidth})`,
				);
				assert.equal(result.title, lesson.title);
				assert.equal(result.prompt, lesson.tasks[level].prompt);
				assert.equal(result.quiz, 3);
				assert.equal(result.cases, 2);
				assert.equal(result.visual, 3);
				assert.equal(result.selected, 0);
				assert.equal(result.over, false, lesson.id);
				assert.ok(!/NaN|undefined/.test(result.body));
				// Open each actual model view; screen-reader labels and rubric controls
				// are checked in the rendered page rather than in the source bundle.
				await evaluate(
					`var draft=document.querySelector('#draft');draft.value=${JSON.stringify(lesson.tasks[level].model)};draft.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#compare').click()`,
				);
				assert.equal(
					await evaluate('document.querySelectorAll(".criterion").length'),
					3,
				);
				assert.equal(
					await evaluate('document.querySelector("#accept").disabled'),
					true,
				);
				assert.ok(
					(
						await evaluate('document.querySelector("#comparison").innerText')
					).includes(lesson.tasks[level].model),
				);
				await screenshot(`${lesson.id}-level${level}-${theme}`);
				states++;
			}
		await route("#view=reference");
		assert.ok(
			(await evaluate('document.querySelector("main").innerText')).includes(
				"Merksätze",
			),
		);
		await screenshot(`reference-${theme}`);
	}
	const tile = JSON.parse(readFileSync(`${root}/cell.json`));
	// Prove every exploration control and every case goal is reachable from
	// its unselected state through the same events a learner uses.
	for (const lesson of lessons) {
		await route(`#lesson=${lesson.id}&level=1`);
		for (let i = 0; i < 3; i++) {
			await evaluate(
				`document.querySelector('[data-visual-step="${i}"]').click()`,
			);
			assert.equal(
				await evaluate('document.querySelector("#visual-detail").textContent'),
				`${lesson.visual.steps[i].label}: ${lesson.visual.steps[i].detail}`,
			);
			assert.equal(
				await evaluate(
					'document.querySelectorAll("[data-visual-step][aria-pressed=true]").length',
				),
				1,
			);
		}
		await evaluate(
			`var answers=${JSON.stringify(lesson.cases.map((c) => c.answer))};document.querySelectorAll('[data-case]').forEach((group,i)=>{Array.from(group.querySelectorAll('input')).find(el=>el.value===answers[i]).checked=true});document.querySelector('#cases-form').requestSubmit()`,
		);
		assert.ok(
			(
				await evaluate('document.querySelector("#case-feedback").innerText')
			).includes("2 von 2 richtig"),
		);
	}
	const first = lessons[0];
	for (const level of [1, 2]) {
		await route(`#lesson=${first.id}&level=${level}`);
		const item = tile.atoms.find((a) => a.slug === first.id).practice_items[0];
		await evaluate(
			`Array.from(document.querySelectorAll('.quiz-choice')).find(el=>el.textContent===${JSON.stringify(item.fast_check.options[1])}).click()`,
		);
		assert.ok(
			!(
				await evaluate('document.querySelector("#quiz-feedback").innerText')
			).includes(first.check.explanation),
		);
		await evaluate(
			`Array.from(document.querySelectorAll('.quiz-choice')).find(el=>el.textContent===${JSON.stringify(item.concept)}).click();document.querySelector('#compare').click()`,
		);
		assert.equal(
			await evaluate('document.querySelector("#accept").disabled'),
			true,
		);
		await evaluate(
			`document.querySelectorAll('.criterion').forEach(el=>{el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}))});document.querySelector('#accept').click()`,
		);
		await frame();
		assert.ok(
			(
				await evaluate('document.querySelector("#progress-strip").innerText')
			).includes("1 von 46"),
		);
	}
	await page("Page.reload");
	for (let i = 0; i < 100; i++) {
		if (await evaluate('!!document.querySelector("#draft")')) break;
		await new Promise((r) => setTimeout(r, 20));
	}
	assert.equal(
		await evaluate('document.querySelector("#draft").value'),
		first.tasks[2].model,
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("1 von 46"),
	);
	await evaluate(
		`var d=document.querySelector('#draft');d.value='Ein geänderter Entwurf mit neuen Angaben.';d.dispatchEvent(new Event('input',{bubbles:true}));`,
	);
	await frame();
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("0 von 46"),
	);
	for (const id of ["d5-zuhoeren", "d5-fabelhoeren"]) {
		await route(`#lesson=${id}`);
		const decoded = await evaluate(
			`(async()=>{const audio=document.querySelector('audio');const bytes=await (await fetch(audio.src)).arrayBuffer();const context=new AudioContext();try { const decoded=await context.decodeAudioData(bytes);return {duration:decoded.duration,channels:decoded.numberOfChannels}; }finally {await context.close();}})()`,
		);
		assert.ok(decoded.duration > 5);
		assert.ok(decoded.channels > 0);
	}
	await route("#lesson=d5-diagramme");
	await evaluate(
		'document.querySelector("[data-visual-step=\\"1\\"]").click()',
	);
	assert.deepEqual(
		await evaluate(
			'Array.from(document.querySelectorAll("[data-chart-bar]")).map(e=>e.style.opacity)',
		),
		["0.25", "1", "1", "0.25"],
	);
	await screenshot("chart-comparison");
	for (const width of [320, 390, 720]) {
		await page("Emulation.setDeviceMetricsOverride", {
			width,
			height: 900,
			deviceScaleFactor: 1,
			mobile: width < 500,
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
						"d5-maerchen",
						"d5-diagramme",
						"d5-faelle",
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
				lessons: 46,
				visualControls: 138,
				caseGoals: 92,
				checks: [
					"model and rubric on every level",
					"completion on both levels",
					"reload persistence",
					"edited draft invalidation",
					"audio decoding",
					"bar chart interaction",
				],
				themes: ["light", "dark"],
				responsiveWidths: [320, 390, 720, 1280],
				runtimeErrors: 0,
				externalRequests: 0,
			},
			null,
			2,
		),
	);
	console.log(
		`ok: ${states} lesson/level/theme views; 138 visual controls; 92 case goals; audio, completion, reload and mobile layout pass; no runtime errors or external requests.`,
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
