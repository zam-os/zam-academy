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
const output = process.env.BROWSER_QA_DIR ?? "/private/tmp/zam-l6-browser";
mkdirSync(output, { recursive: true });
const lessons = JSON.parse(readFileSync(`${root}/src/curriculum/lessons.json`));
const profile = mkdtempSync(join(tmpdir(), "zam-latin6-browser-"));
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
let currentTargetId;
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
const openTab = async ({ width, height, mobile, theme }) => {
	if (currentTargetId) {
		await send("Target.closeTarget", { targetId: currentTargetId });
	}
	const { targetId } = await send("Target.createTarget", {
		url: "about:blank",
	});
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
	await evaluate(
		`document.documentElement.dataset.theme=${JSON.stringify(theme)};document.querySelector('meta[name="color-scheme"]').content=${JSON.stringify(theme)}`,
	);
};
const route = async (hash) => {
	await evaluate(`new Promise((resolve) => {
		const target = ${JSON.stringify(hash)};
		const nextUrl = location.pathname + location.search + (target || "");
		if (location.hash !== target) {
			history.replaceState(null, "", nextUrl);
		}
		window.dispatchEvent(new HashChangeEvent("hashchange"));
		setTimeout(resolve, 15);
	})`);
};

const CAPTURE_SET = new Set([
	"l6-aussprache",
	"l6-a-o-deklination",
	"l6-numeralia",
	"l6-perfekt",
	"l6-plusquamperfekt-futur",
	"l6-aci-zeitverhaeltnisse",
	"l6-rom-topografie",
	"l6-vesuv-pompeji",
	"l6-gruendung-koenigszeit",
	"l6-schule-kalender",
	"l6-olympier",
	"l6-herakles-aeneas",
]);

try {
	let states = 0;
	for (const theme of ["light", "dark"]) {
		await openTab({ width: 1280, height: 1100, mobile: false, theme });
		assert.equal(
			await evaluate('document.querySelectorAll(".lesson-link").length'),
			40,
		);
		await screenshot(`path-${theme}`);
		for (const lesson of lessons)
			for (const level of [1, 2]) {
				await route(`#lesson=${lesson.id}&level=${level}`);
				const result = await evaluate(
					`({title:document.querySelector('main h1')?.textContent,prompt:document.querySelector('.task-prompt')?.textContent,body:document.querySelector('main')?.innerText,quiz:document.querySelectorAll('.quiz-choice').length,practice:document.querySelectorAll('.practice-input').length,goals:document.querySelectorAll('[data-workshop]').length,svgs:document.querySelectorAll('.workshop svg').length,over:document.documentElement.scrollWidth>innerWidth,initial:document.querySelector('#workshop-status')?.textContent,svgOverflow:Array.from(document.querySelectorAll('.workshop svg [data-diagram-focus]')).flatMap(g=>{const rect=g.querySelector('rect');if(!rect)return[];const rb=rect.getBBox();return Array.from(g.querySelectorAll('text')).filter(t=>{const tb=t.getBBox();return tb.x<rb.x+2||tb.x+tb.width>rb.x+rb.width-2;}).map(t=>t.textContent);})})`,
				);
				assert.equal(result.title, lesson.title);
				assert.equal(result.prompt, lesson.tasks[level].prompt);
				assert.equal(result.quiz, 3);
				assert.equal(result.practice, 2);
				assert.equal(result.goals, 3);
				assert.ok(result.svgs >= 2, `${lesson.id} missing workshop SVGs`);
				assert.ok(result.initial.startsWith("0 von 3"));
				assert.equal(result.over, false, lesson.id);
				assert.deepEqual(result.svgOverflow, [], `${lesson.id} SVG overflow`);
				assert.ok(!/NaN|undefined/.test(result.body), `${lesson.id} NaN/undefined`);
				if (level === 1 && CAPTURE_SET.has(lesson.id)) {
					await screenshot(`${lesson.id}-level${level}-${theme}`);
				}
				states++;
			}
		await route("#view=reference");
		assert.ok(
			(await evaluate('document.querySelector("main").innerText')).includes(
				"Formen- und Satzlehre",
			),
		);
		await screenshot(`reference-${theme}`);
	}
	await openTab({ width: 1280, height: 1100, mobile: false, theme: "light" });
	// Every workshop is reached through its real change handlers.
	for (const lesson of lessons) {
		await route(`#lesson=${lesson.id}&level=1`);
		assert.equal(
			await evaluate("document.querySelector('main h1')?.textContent"),
			lesson.title,
		);
		await evaluate(
			`var answers=${JSON.stringify(lesson.workshop.goals.map((g) => g.answer))};document.querySelectorAll('[data-workshop]').forEach((el,i)=>{el.value=answers[i];el.dispatchEvent(new Event('change',{bubbles:true}));});`,
		);
		assert.ok(
			(
				await evaluate('document.querySelector("#workshop-status").textContent')
			).startsWith("3 von 3"),
			lesson.id,
		);
	}
	// Check persistence, quiz, macron-insensitive short answers, rubric gate, and aloud checkbox.
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
		`document.querySelectorAll('.practice-input')[0].value='mi';document.querySelectorAll('.practice-input')[1].value='w';document.querySelector('#practice-form').requestSubmit()`,
	);
	assert.ok(
		(await evaluate('document.querySelector("#practice-feedback").innerText')).includes("2 von 2 richtig"),
	);
	await evaluate('document.querySelector("#aloud-done").click()');
	await evaluate(
		`var draft=document.querySelector('#draft');draft.value='amīce: vorletzte Silbe -mī- lang; dominus: drittletzte do-; rēgīna: vorletzte -gī- lang.';draft.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#compare').click()`,
	);
	assert.equal(await evaluate('document.querySelector("#accept").disabled'), true);
	await evaluate(
		`document.querySelectorAll('.criterion').forEach(el=>{el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));});document.querySelector('#accept').click()`,
	);
	assert.ok(
		(await evaluate('document.querySelector("#progress-strip").innerText')).includes("1 von 40"),
	);
	await page("Page.reload");
	for (let i = 0; i < 100; i++) {
		if (await evaluate('!!document.querySelector("#draft")')) break;
		await new Promise((r) => setTimeout(r, 20));
	}
	assert.ok(
		(await evaluate('document.querySelector("#draft").value')).includes("dominus"),
	);
	assert.ok(
		(await evaluate('document.querySelector("#progress-strip").innerText')).includes("1 von 40"),
	);
	await evaluate(
		`var draft=document.querySelector('#draft');draft.value='Geänderter Entwurf mit mehr als zwanzig Zeichen.';draft.dispatchEvent(new Event('input',{bubbles:true}));`,
	);
	assert.ok(
		(await evaluate('document.querySelector("#progress-strip").innerText')).includes("0 von 40"),
	);
	// Check interactive labs
	await route("#lesson=l6-numeralia&level=1");
	await evaluate(
		`var s=document.querySelector('#numeral-slider');s.value='9';s.dispatchEvent(new Event('input'));`,
	);
	assert.ok(
		(await evaluate('document.querySelector("#numeral-readout").textContent')).includes("9 = IX"),
	);
	await route("#lesson=l6-plusquamperfekt-futur&level=1");
	await evaluate(
		`var v=document.querySelector('#verb-id'),t=document.querySelector('#verb-tense');v.value='ducere';t.value='futur1';t.dispatchEvent(new Event('change'));`,
	);
	assert.ok(
		(await evaluate('document.querySelector("#verb-readout").textContent')).includes("dūcet"),
	);
	await route("#lesson=l6-aci-zeitverhaeltnisse&level=1");
	await evaluate(
		`var h=document.querySelector('#aci-head'),inf=document.querySelector('#aci-inf');h.value='perfekt';inf.value='perfekt';inf.dispatchEvent(new Event('change'));`,
	);
	assert.ok(
		(await evaluate('document.querySelector("#aci-readout").textContent')).includes("gekommen war"),
	);
	await route("#lesson=l6-rom-topografie&level=1");
	await evaluate('document.querySelector("[data-map-focus=bauten]").click()');
	assert.equal(
		await evaluate('document.querySelector("[data-map-layer=zentrum]").style.opacity'),
		"0.18",
	);
	await route("#lesson=l6-italien-magna-graecia&level=1");
	await evaluate('document.querySelector("[data-map-focus=vesuv]").click()');
	assert.equal(
		await evaluate('document.querySelector("[data-map-layer=staedte]").style.opacity'),
		"0.18",
	);
	await route("#lesson=l6-olympier&level=1");
	await evaluate('document.querySelector("[data-olympier-btn=\'2\']").click()');
	assert.ok(
		(await evaluate('document.querySelector("[data-olympier-readout]").textContent')).includes("Vulcānus"),
	);
	// Modal dialog open & close
	await evaluate('document.querySelector("#zam").click()');
	assert.equal(await evaluate('document.querySelector("#dialog").open'), true);
	await evaluate('document.querySelector("#close-dialog").click()');
	assert.equal(await evaluate('document.querySelector("#dialog").open'), false);
	// Responsive checks at 390 and 720 px
	for (const width of [390, 720]) {
		for (const theme of ["light", "dark"]) {
			await openTab({
				width,
				height: 844,
				mobile: width === 390,
				theme,
			});
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
				if (width === 390 && ["", "l6-rom-topografie", "l6-numeralia", "reference"].includes(id)) {
					await screenshot(`mobile-390-${id || "path"}-${theme}`);
				}
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
