import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const coverage = JSON.parse(readFileSync(join(root, "coverage.json")));
const grade = coverage.grade;
const out =
	process.env.BROWSER_QA_DIR ??
	mkdtempSync(join(tmpdir(), `zam-deutsch-ms${grade}-browser-`));
mkdirSync(out, { recursive: true });
const tabs = await (
	await fetch(
		`http://127.0.0.1:${process.env.CHROME_DEBUG_PORT ?? "9441"}/json/list`,
	)
).json();
const ws = new WebSocket(
	tabs.find((x) => x.type === "page").webSocketDebuggerUrl,
);
await new Promise((resolve, reject) => {
	ws.onopen = resolve;
	ws.onerror = reject;
});
let nextId = 0;
const pending = new Map();
const exceptions = [];
const external = [];
ws.onmessage = ({ data }) => {
	const m = JSON.parse(data);
	if (m.id) {
		const p = pending.get(m.id);
		pending.delete(m.id);
		if (m.error) p.reject(new Error(JSON.stringify(m.error)));
		else p.resolve(m.result);
	} else if (m.method === "Runtime.exceptionThrown")
		exceptions.push(m.params.exceptionDetails);
	else if (
		m.method === "Network.requestWillBeSent" &&
		/^https?:/.test(m.params.request.url)
	)
		external.push(m.params.request.url);
};
function send(method, params = {}) {
	return new Promise((resolve, reject) => {
		const id = ++nextId;
		pending.set(id, { resolve, reject });
		ws.send(JSON.stringify({ id, method, params }));
	});
}
async function evaluate(expression) {
	const r = await send("Runtime.evaluate", {
		expression,
		awaitPromise: true,
		returnByValue: true,
	});
	if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
	return r.result.value;
}
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await send("Emulation.setDeviceMetricsOverride", {
	width: 1280,
	height: 1000,
	deviceScaleFactor: 1,
	mobile: false,
});
async function go(url, title) {
	await send("Page.navigate", { url });
	for (let i = 0; i < 100; i++) {
		if (
			await evaluate(
				`document.querySelector('main h1')?.textContent.trim()===${JSON.stringify(title)}`,
			)
		) {
			await evaluate(
				"new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))",
			);
			return;
		}
		await pause(20);
	}
	throw new Error(`Page did not render: ${url}`);
}
async function shot(name) {
	const metrics = await send("Page.getLayoutMetrics");
	const height = Math.ceil(metrics.cssContentSize.height);
	const { data } = await send("Page.captureScreenshot", {
		format: "jpeg",
		quality: 60,
		captureBeyondViewport: true,
		clip: { x: 0, y: 0, width: await evaluate("innerWidth"), height, scale: 1 },
	});
	writeFileSync(`${out}/${name}.jpg`, Buffer.from(data, "base64"));
}
function contrast(foreground, background) {
	const rgb = (value) =>
		value.startsWith("#")
			? [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16))
			: value
					.match(/[\d.]+/g)
					.slice(0, 3)
					.map(Number);
	const luminance = (value) =>
		rgb(value)
			.map((n) => n / 255)
			.map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4))
			.reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i], 0);
	const a = luminance(foreground),
		b = luminance(background);
	return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
async function stageColours() {
	return evaluate(
		`Array.from(document.querySelectorAll('.stage')).map(stage => ({id:stage.dataset.stage,icon:getComputedStyle(stage.querySelector('.stage-icon')).color,border:getComputedStyle(stage).borderTopColor,surface:getComputedStyle(stage).getPropertyValue('--surface').trim()}))`,
	);
}

const report = [];
for (const grade of [coverage.grade]) {
	// A dedicated developer browser profile is required: reset only this app's
	// own test evidence so the verification is repeatable.
	const lessons = JSON.parse(
		readFileSync(`${root}/src/curriculum/lessons.json`),
	);
	const cell = JSON.parse(readFileSync(`${root}/cell.json`));
	const base = pathToFileURL(join(root, "dist/index.html")).href;
	await send("Page.navigate", { url: base });
	await pause(150);
	await evaluate(`localStorage.removeItem('deutsch_ms${grade}_progress_v1')`);
	await send("Page.reload");
	await pause(150);
	let states = 0;
	const themeColours = {};
	for (const theme of ["light", "dark"]) {
		await send("Page.navigate", { url: base });
		await pause(100);
		await evaluate(
			`document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
		);
		assert.equal(
			await evaluate(`document.querySelectorAll('.lesson-link').length`),
			lessons.length,
		);

		const colours = await stageColours();
		assert.equal(new Set(colours.map((c) => c.icon)).size, 4);
		for (const colour of colours) {
			assert.equal(colour.icon, colour.border);
			assert.ok(
				contrast(colour.icon, colour.surface) >= 4.5,
				`Stage ${colour.id} has insufficient contrast in ${theme}`,
			);
		}
		themeColours[theme] = colours.map((c) => c.icon);
		await shot(`g${grade}-${theme}-path`);
		for (const level of [1, 2]) {
			for (const lesson of lessons) {
				await go(`${base}#lesson=${lesson.id}&level=${level}`, lesson.title);
				const content = await evaluate(
					`({title:document.querySelector('main h1').textContent,task:document.querySelector('.task-prompt').textContent,cases:document.querySelectorAll('[data-case]').length,level:document.querySelector('#level').value,text:document.querySelector('main').innerText,overflow:document.documentElement.scrollWidth>innerWidth,theme:document.documentElement.dataset.theme})`,
				);
				assert.equal(content.title, lesson.title);
				assert.equal(content.task, lesson.tasks[level].prompt);
				assert.equal(content.cases, 2);
				assert.equal(content.level, String(level));
				assert.equal(content.theme, theme);
				assert.ok(!/NaN|undefined/.test(content.text));
				assert.equal(content.overflow, false);

				// Inspect the actual rendered model too: script text alone would also
				// be present in a broken single-file build.
				await evaluate(
					`{const draft=document.querySelector('#draft');draft.value=${JSON.stringify(lesson.tasks[level].model)};draft.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#compare').click();}`,
				);
				assert.equal(
					await evaluate(
						"document.querySelector('.model-answer .material')?.textContent",
					),
					lesson.tasks[level].model,
				);
				assert.equal(
					await evaluate("document.querySelectorAll('.criterion').length"),
					3,
				);
				assert.equal(
					await evaluate("document.documentElement.scrollWidth>innerWidth"),
					false,
				);
				await shot(`g${grade}-${theme}-l${level}-${lesson.id}`);
				states++;
			}
			console.log(
				`Grade ${grade}: ${theme}, Level ${level}, ${lessons.length} rendered lessons checked`,
			);
		}
		await go(`${base}#view=reference`, "Quellen & Praxis");
		assert.equal(
			await evaluate(`document.querySelectorAll('details').length`),
			4,
		);
		await evaluate(
			`document.querySelectorAll('details').forEach(x=>x.open=true)`,
		);
		await shot(`g${grade}-${theme}-reference`);
	}

	assert.notDeepEqual(themeColours.light, themeColours.dark);
	await send("Page.navigate", { url: base });
	await pause(100);
	await send("Emulation.setEmulatedMedia", {
		features: [{ name: "prefers-color-scheme", value: "dark" }],
	});
	await evaluate("delete document.documentElement.dataset.theme");
	assert.deepEqual(
		(await stageColours()).map((c) => c.icon),
		themeColours.dark,
	);
	await evaluate("document.documentElement.dataset.theme='light'");
	assert.deepEqual(
		(await stageColours()).map((c) => c.icon),
		themeColours.light,
	);
	await send("Emulation.setEmulatedMedia", { features: [] });
	// Exercise actual UI completion and reload persistence on both levels.
	const lesson = lessons[0],
		atom = cell.atoms.find((a) => a.slug === lesson.id);
	await go(`${base}#lesson=${lesson.id}&level=1`, lesson.title);

	await evaluate(
		`document.querySelectorAll('.quiz-choice').forEach(b=>{if(b.textContent===${JSON.stringify(atom.practice_items[0].fast_check.options[1])})b.click()})`,
	);
	assert.ok(
		await evaluate(
			`document.querySelector('#quiz-feedback').textContent.includes(${JSON.stringify(lesson.check.explanation)})`,
		),
	);
	assert.equal(
		await evaluate(
			`JSON.parse(localStorage.getItem('deutsch_ms${grade}_progress_v1')).quizDone.includes('${lesson.id}')`,
		),
		false,
	);
	await evaluate(
		`document.querySelectorAll('.quiz-choice').forEach(b=>{if(b.textContent===${JSON.stringify(atom.practice_items[0].concept)})b.click()})`,
	);
	await evaluate(
		`{const answers=${JSON.stringify(lesson.cases.map((c) => c.answer))};document.querySelectorAll('[data-case]').forEach((f,i)=>f.querySelectorAll('input').forEach(x=>x.checked=x.value===answers[i]));document.querySelector('#cases-form').requestSubmit();}`,
	);
	for (const level of [1, 2]) {
		await go(`${base}#lesson=${lesson.id}&level=${level}`, lesson.title);
		assert.equal(
			await evaluate(
				`JSON.parse(localStorage.getItem('deutsch_ms${grade}_progress_v1')).writingDone.includes('${lesson.id}:${level}')`,
			),
			false,
		);
		await evaluate(
			`{const d=document.querySelector('#draft');d.value=${JSON.stringify(lesson.tasks[level].model)};d.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#compare').click();document.querySelectorAll('.criterion').forEach(x=>{x.checked=true;x.dispatchEvent(new Event('change'))});document.querySelector('#accept').click();}`,
		);
		await pause(20);
		assert.equal(
			await evaluate(
				`JSON.parse(localStorage.getItem('deutsch_ms${grade}_progress_v1')).writingDone.includes('${lesson.id}:${level}')`,
			),
			true,
		);
	}
	await send("Page.reload");
	await pause(150);
	assert.equal(
		await evaluate(
			`JSON.parse(localStorage.getItem('deutsch_ms${grade}_progress_v1')).writingDone.length`,
		),
		2,
	);
	// Verify locally bundled audio is decodable in the offline file, not just
	// a nonempty file on disk. No navigation to external links occurs.
	const listening = grade === 5 ? "fabelhoeren" : "detektivgeschichte";
	await go(
		`${base}#lesson=d${grade}-${listening}&level=1`,
		lessons.find((l) => l.id === `d${grade}-${listening}`).title,
	);
	const audio = await evaluate(
		`new Promise((resolve,reject)=>{const a=document.querySelector('audio');const timer=setTimeout(()=>reject(Error('audio timeout')),5000);a.onloadedmetadata=()=>{clearTimeout(timer);resolve({duration:a.duration,local:a.src.startsWith('data:'),error:a.error?.code??null})};a.onerror=()=>{clearTimeout(timer);reject(Error('audio decode failure'))};a.load()})`,
	);
	assert.ok(audio.duration > 10);
	assert.equal(audio.local, true);
	assert.equal(audio.error, null);
	// Real mobile layout and core dialogs.
	await send("Emulation.setDeviceMetricsOverride", {
		width: 390,
		height: 844,
		deviceScaleFactor: 1,
		mobile: true,
	});
	await shot(`g${grade}-mobile-lesson`);
	assert.equal(
		await evaluate(`document.documentElement.scrollWidth>innerWidth`),
		false,
	);
	await evaluate(`document.querySelector('#zam').click()`);
	assert.equal(await evaluate(`document.querySelector('#dialog').open`), true);
	await shot(`g${grade}-mobile-dialog`);
	await evaluate(`document.querySelector('#dialog').close()`);
	await send("Emulation.setDeviceMetricsOverride", {
		width: 1280,
		height: 1000,
		deviceScaleFactor: 1,
		mobile: false,
	});
	report.push({
		grade,
		lessons: lessons.length,
		states,
		audio,
		levelCompletionAndReload: true,
		mobileOverflow: false,
		themeAccentsVerified: true,
		explanationAfterWrongAnswer: true,
		modelComparisonVerified: true,
	});
}
assert.deepEqual(exceptions, []);
assert.deepEqual(external, []);
writeFileSync(
	`${out}/report.json`,
	JSON.stringify({ report, exceptions, external }, null, 2),
);
console.log(JSON.stringify({ report, exceptions, external, artifacts: out }));
ws.close();
