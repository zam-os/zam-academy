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
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output =
	process.env.BROWSER_QA_DIR ?? join(tmpdir(), "zam-l5g-browser");
mkdirSync(output, { recursive: true });
const lessons = JSON.parse(
	readFileSync(`${root}/src/curriculum/lessons.json`, "utf8"),
);
const profile = mkdtempSync(join(tmpdir(), "zam-latein5-browser-"));
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
			const hint = params?.expression
				? ` [${String(params.expression).slice(0, 120)}]`
				: "";
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
	session = (
		await send("Target.attachToTarget", { targetId, flatten: true })
	).sessionId;
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

const SCREENSHOT_LESSONS = new Set([
	"l5-aussprache-betonung",
	"l5-dritte-deklination",
	"l5-numeralia",
	"l5-aci",
	"l5-rom-topografie",
	"l5-kalender-zeit",
	"l5-olympier",
	"l5-romulus-koenige-quellen",
	"l5-satzglieder-abfrage",
	"l5-vortrag-stellungnahme",
]);

const MOBILE_SHOTS = new Set([
	"",
	"l5-rom-topografie",
	"l5-aci",
	"l5-dritte-deklination",
	"reference",
]);

const svgGeometryExpr = `(() => {
	const issues = [];
	document.querySelectorAll('.concept-svg, .lab-svg').forEach((svg) => {
		const vb = svg.viewBox?.baseVal;
		if (!vb) return;
		svg.querySelectorAll('g').forEach((g) => {
			const children = [...g.children];
			if (children.length === 2 && children[0].tagName === 'rect' && children[1].tagName === 'text') {
				const r = children[0].getBBox();
				const t = children[1].getBBox();
				if (t.width > r.width + 4) {
					issues.push('pill overflow: ' + (children[1].textContent || '').trim() + ' (' + Math.round(t.width) + ' > ' + Math.round(r.width) + ')');
				}
			}
		});
		svg.querySelectorAll('text').forEach((el) => {
			const b = el.getBBox();
			if (b.x < vb.x - 4 || b.x + b.width > vb.x + vb.width + 4 || b.y < vb.y - 4 || b.y + b.height > vb.y + vb.height + 4) {
				issues.push('svg viewBox overflow: ' + (el.textContent || '').trim() + ' [' + Math.round(b.x) + '..' + Math.round(b.x + b.width) + ']');
			}
		});
	});
	return issues;
})()`;

try {
	await openTab(1280, 1100, false);
	assert.equal(
		await evaluate('document.querySelectorAll(".lesson-link").length'),
		44,
	);
	let states = 0;
	const svgIssues = [];
	for (const theme of ["light", "dark"]) {
		await openTab(1280, 1100, false);
		await evaluate(
			`document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
		);
		await route("");
		await screenshot(`path-${theme}`);
		for (const lesson of lessons) {
			for (const level of [1, 2]) {
				await route(`#lesson=${lesson.id}&level=${level}`);
				const result = await evaluate(
					`({title:document.querySelector('main h1')?.textContent,prompt:document.querySelector('.task-prompt')?.textContent,body:document.querySelector('main')?.innerText,quiz:document.querySelectorAll('.quiz-choice').length,practice:document.querySelectorAll('.practice-input').length,goals:document.querySelectorAll('[data-workshop]').length,conceptSvg:!!document.querySelector('.concept-svg'),over:document.documentElement.scrollWidth>innerWidth,initial:document.querySelector('#workshop-status')?.textContent})`,
				);
				assert.equal(result.title, lesson.title);
				assert.equal(result.prompt, lesson.tasks[level].prompt);
				assert.equal(result.quiz, 3);
				assert.equal(result.practice, 2);
				assert.equal(result.goals, 3);
				assert.equal(result.conceptSvg, true, lesson.id);
				assert.ok(result.initial.startsWith("0 von 3"), lesson.id);
				assert.equal(result.over, false, lesson.id);
				assert.ok(!/NaN|undefined/.test(result.body), lesson.id);
				if (theme === "light" && level === 1) {
					const geo = await evaluate(svgGeometryExpr);
					if (geo.length) svgIssues.push(`${lesson.id}: ${geo.join("; ")}`);
				}
				if (level === 1 && SCREENSHOT_LESSONS.has(lesson.id)) {
					await screenshot(`${lesson.id}-level1-${theme}`);
				}
				states++;
			}
		}
		await route("#view=reference");
		assert.ok(
			(await evaluate('document.querySelector("main").innerText')).includes(
				"Latein 5 auf einen Blick",
			),
		);
		await screenshot(`reference-${theme}`);
	}

	// Solve all 132 workshop goals across all 44 lessons
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

	// End-to-end completion flow, persistence reload, draft-change reset, cross-tab reset
	const sampleLesson = lessons.find((l) => l.id === "l5-grundwortschatz-lernen");
	await route(`#lesson=${sampleLesson.id}&level=1`);
	await evaluate(
		`Array.from(document.querySelectorAll('.quiz-choice')).find(el=>el.textContent===${JSON.stringify(sampleLesson.quiz.wrong[0])}).click()`,
	);
	assert.ok(
		!(
			await evaluate('document.querySelector("#quiz-feedback").innerText')
		).includes(sampleLesson.quiz.explanation),
	);
	await evaluate(
		`Array.from(document.querySelectorAll('.quiz-choice')).find(el=>el.textContent===${JSON.stringify(sampleLesson.quiz.answer)}).click()`,
	);
	await evaluate(
		`var answers=${JSON.stringify(sampleLesson.practice.map((p) => p.answers[0]))};document.querySelectorAll('.practice-input').forEach((el,i)=>{el.value=answers[i];});document.querySelector('#practice-form').requestSubmit()`,
	);
	await evaluate(
		`var draft=document.querySelector('#draft');draft.value='Zu jedem Substantiv lerne ich Nominativ, Genitiv und Genus sowie die Kontextbedeutung.';draft.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#compare').click()`,
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
			"Nominativ, Genitiv und Genus",
		),
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("1 von 44"),
	);
	await evaluate(
		`var draft=document.querySelector('#draft');draft.value='Geänderter eigener Vokabelentwurf für die Schulaufgabe.';draft.dispatchEvent(new Event('input',{bubbles:true}));`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("0 von 44"),
	);

	// Re-complete and verify cross-tab reset clears inputs, feedback and drafts
	await evaluate(
		`Array.from(document.querySelectorAll('.quiz-choice')).find(el=>el.textContent===${JSON.stringify(sampleLesson.quiz.answer)}).click()`,
	);
	await evaluate(
		`var answers=${JSON.stringify(sampleLesson.practice.map((p) => p.answers[0]))};document.querySelectorAll('.practice-input').forEach((el,i)=>{el.value=answers[i];el.dispatchEvent(new Event('input',{bubbles:true}));});document.querySelector('#practice-form').requestSubmit()`,
	);
	await evaluate(
		`var draft=document.querySelector('#draft');draft.value='Zu jedem Substantiv lerne ich Nominativ, Genitiv und Genus sowie die Kontextbedeutung.';draft.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#compare').click();document.querySelectorAll('.criterion').forEach(el=>{el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));});document.querySelector('#accept').click()`,
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
	session = (
		await send("Target.attachToTarget", { targetId: tab2Id, flatten: true })
	).sessionId;
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

	// Exercise all interactive labs & widgets
	const text = (selector) =>
		evaluate(`document.querySelector(${JSON.stringify(selector)})?.textContent ?? ""`);

	await route("#lesson=l5-aussprache-betonung&level=1");
	await evaluate(`document.querySelector('[data-figure-focus="2"]').click()`);
	assert.equal(
		await evaluate('document.querySelector(".concept-figure")?.dataset.focus'),
		"2",
	);
	await evaluate(
		`var s=document.querySelector('#prosody-select');s.value='2';s.dispatchEvent(new Event('change'));`,
	);
	assert.ok((await text("#prosody-readout")).includes("senātor") || (await text("#prosody-readout")).includes("se-NĀ-tor"));

	await route("#lesson=l5-dritte-deklination&level=1");
	await evaluate(
		`document.querySelector('#decl-class').value='3i';document.querySelector('#decl-class').dispatchEvent(new Event('change'));document.querySelector('[data-decl-num="pl"]').click();document.querySelector('[data-decl-case="1"]').click();`,
	);
	assert.ok((await text("#decl-readout")).includes("marium"));
	assert.equal((await evaluate(svgGeometryExpr)).length, 0);

	await route("#lesson=l5-numeralia&level=1");
	await evaluate(
		`var sl=document.querySelector('#num-slider');sl.value='4';sl.dispatchEvent(new Event('input'));`,
	);
	assert.equal(await text("#num-val"), "4");
	assert.ok((await text("#num-readout")).includes("IV"));

	await route("#lesson=l5-aci&level=1");
	await evaluate(
		`document.querySelector('[data-aci-main="perf"]').click();document.querySelector('[data-aci-inf="perf"]').click();`,
	);
	assert.ok((await text("#aci-readout")).includes("gekommen war"));

	await route("#lesson=l5-rom-topografie&level=1");
	assert.equal(
		await evaluate('document.querySelectorAll("[data-place]").length'),
		9,
	);
	await evaluate(`document.querySelector('[data-map-focus="supply"]').click()`);
	await evaluate(`document.querySelector('[data-place-btn="ostia"]').click()`);
	assert.ok((await text("#rome-map-note")).includes("Ostia"));

	await route("#lesson=l5-kalender-zeit&level=1");
	await evaluate(
		`var cal=document.querySelector('#cal-month');cal.value='mar';cal.dispatchEvent(new Event('change'));`,
	);
	assert.ok((await text("#cal-readout")).includes("15"));

	await route("#lesson=l5-olympier&level=1");
	await evaluate(`document.querySelector('[data-god="2"]').click()`);
	assert.ok((await text("#god-readout")).includes("Minerva"));

	await route("#lesson=l5-romulus-koenige-quellen&level=1");
	await evaluate(`document.querySelector('[data-tl="2"]').click()`);
	assert.ok((await text("#tl-readout")).includes("753"));

	await route("#lesson=l5-satzglieder-abfrage&level=1");
	await evaluate(`document.querySelector('[data-gen="1"]').click()`);
	assert.ok((await text("#gen-svg")).includes("signum"));
	assert.ok((await text("#gen-readout")).includes("Direktes Objekt"));

	await route("#lesson=l5-vortrag-stellungnahme&level=1");
	await evaluate('document.querySelector("#partner-listened").click()');
	assert.ok((await text("#listened-status")).includes("Partner"));
	assert.ok(
		(
			await evaluate('document.querySelector(".draft-info")?.innerText ?? ""')
		).includes("Wo bleibt mein Text"),
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
				if (width === 390 && MOBILE_SHOTS.has(id)) {
					await screenshot(`mobile-${width}-${id || "path"}-${theme}`);
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
				lessons: 44,
				workshopGoals: 132,
				themes: ["light", "dark"],
				levels: [1, 2],
				responsiveWidths: [390, 720, 1280],
				svgGeometryIssues: svgIssues,
				runtimeErrors: 0,
				externalRequests: 0,
				outputDir: output,
			},
			null,
			2,
		),
	);
	console.log(
		`ok: ${states} lesson/level/theme views; 132 goals; responsive checks at 390/720/1280 px; all explorers and persistence checks; svgGeometryIssues=${svgIssues.length}; no runtime errors or network requests. Output: ${output}`,
	);
	if (svgIssues.length) console.log("SVG geometry notes:\n" + svgIssues.join("\n"));
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
