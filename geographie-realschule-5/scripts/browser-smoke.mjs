import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { tmpdir } from "node:os";
import assert from "node:assert/strict";
const root = fileURLToPath(new URL("../", import.meta.url)).replace(/\/$/, "");
const output = mkdtempSync(join(tmpdir(), "zam-geo5-browser-"));
const chromeBinary =
	process.env.CHROME_BIN ??
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const lessons = Array.from({ length: 7 }, (_, i) =>
	JSON.parse(readFileSync(`${root}/src/curriculum/lessons-lb${i + 1}.json`)),
).flat();
const chrome = spawn(
	chromeBinary,
	[
		"--headless=new",
		"--remote-debugging-pipe",
		"--no-first-run",
		"--disable-background-networking",
		"--disable-component-update",
		"--disable-sync",
		"--disable-default-apps",
		"--no-default-browser-check",
		`--user-data-dir=${join(output, "profile")}`,
		"about:blank",
	],
	{ stdio: ["ignore", "ignore", "pipe", "pipe", "pipe"] },
);
chrome.on("error", (error) => {
	console.error(error.message);
	process.exit(1);
});
let seq = 0,
	buffer = "";
const pending = new Map();
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
		pending.set(id, { resolve, reject });
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
	await page("Page.navigate", { url: `file://${root}/dist/index.html` });
	for (let i = 0; i < 200; i++) {
		if (await evaluate('!!document.querySelector(".hero")')) break;
		await new Promise((r) => setTimeout(r, 25));
	}
	await evaluate("localStorage.clear()");
	assert.equal(
		await evaluate('document.querySelectorAll(".lesson-link").length'),
		31,
	);
	let pages = 0;
	for (const theme of ["light", "dark"]) {
		await evaluate(
			`document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
		);
		await evaluate('location.hash=""');
		await evaluate(
			"new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))",
		);
		await screenshot(`path-${theme}`);
		for (const lesson of lessons)
			for (const level of [1, 2]) {
				await evaluate(
					`location.hash=${JSON.stringify(`#lesson=${lesson.id}&level=${level}`)}`,
				);
				await evaluate(
					"new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))",
				);
				const data = await evaluate(
					`({title:document.querySelector('main h1')?.textContent,prompt:document.querySelector('#draft')?.closest('section')?.textContent,main:document.querySelector('main')?.innerText,quiz:document.querySelectorAll('[data-choice]').length,work:document.querySelectorAll('[data-assign]').length,svg:document.querySelectorAll('.exploration svg').length,over:document.documentElement.scrollWidth>innerWidth})`,
				);
				assert.equal(data.title, lesson.title, lesson.id);
				assert.ok(
					data.prompt.includes(lesson.tasks[level].prompt),
					`${lesson.id} level ${level}`,
				);
				assert.equal(data.quiz, 3);
				assert.equal(data.work, lesson.workshop.entries.length);
				assert.equal(data.svg, lesson.model ? 1 : 0);
				assert.ok(!/NaN|undefined/.test(data.main));
				assert.equal(data.over, false);

				if (lesson.model === "germany" || lesson.model === "thematic") {
					const geography = await evaluate(`(() => {
            const svg = document.querySelector('.regional-map');
            const width = 11 * Math.cos(51.5 * Math.PI / 180) / 9 * 380;
            const point = (lon,lat) => new DOMPoint((700-width)/2 + (lon-5)/11*width,25+(56-lat)/9*380);
            const samples = [['NLD',5.5,51.8],['FRA',6.2,48.7],['POL',15.5,52.5],['DNK',9.5,55.5]];
            return {
              land: samples.map(([code,lon,lat]) => {
                const path=svg.querySelector('[data-map-country="'+code+'"]');
                return path?.classList.contains('map-context') && path.isPointInFill(point(lon,lat));
              }),
              sea: Array.from(svg.querySelectorAll('[data-sea-label]')).map(label => {
                const p=new DOMPoint(Number(label.getAttribute('x')),Number(label.getAttribute('y')));
                const frame=svg.querySelector('rect.map-water').getBBox();
                return p.x>frame.x && p.x<frame.x+frame.width && p.y>frame.y && p.y<frame.y+frame.height
                  && !Array.from(svg.querySelectorAll('[data-map-country]')).some(path=>path.isPointInFill(p));
              })
            };
          })()`);
					assert.deepEqual(
						geography.land,
						[true, true, true, true],
						`${lesson.id}: neighbouring countries remain land`,
					);
					assert.deepEqual(
						geography.sea,
						lesson.model === "germany" ? [true, true] : [],
						`${lesson.id}: sea labels lie offshore inside the frame`,
					);
				}
				await screenshot(`${lesson.id}-level${level}-${theme}`);
				pages++;
			}
		await evaluate('location.hash="#view=reference"');
		await evaluate(
			"new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))",
		);
		assert.equal(
			await evaluate('document.querySelectorAll(".reference dt").length'),
			31,
		);
		await screenshot(`reference-${theme}`);
	}
	// Exercise actual handlers: wrong/right quiz, assignment feedback, draft invalidation and persistence.
	await evaluate('location.hash="#lesson=geo-geographie&level=1"');
	await evaluate(
		"new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))",
	);
	await evaluate(`document.querySelector('[data-choice="1"]').click()`);
	assert.ok(
		(
			await evaluate('document.querySelector(".quiz .feedback").innerText')
		).includes("Prüfe"),
	);
	await evaluate(`document.querySelector('[data-choice="0"]').click()`);
	await evaluate(
		`const answers=${JSON.stringify(lessons[0].workshop.entries.map((e) => e.target))};document.querySelectorAll('[data-assign]').forEach((el,i)=>{el.value=String(answers[i]);el.dispatchEvent(new Event('change',{bubbles:true}));});document.querySelector('#check-workshop').click()`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector(".workshop .feedback").innerText')
		).includes("Die Zuordnung stimmt"),
	);
	await evaluate(
		`var d=document.querySelector('#draft');d.value='Eine eigene begründete Antwort über Natur und Mensch im Schulhof.';d.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#compare').click();document.querySelectorAll('[data-rubric]').forEach(el=>{el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));});document.querySelector('#accept-writing').click()`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#lesson-status").innerText')
		).includes("abgeschlossen"),
	);
	await page("Page.reload");
	await evaluate("new Promise(r=>setTimeout(r,100))");
	assert.ok(
		(await evaluate('document.querySelector("#draft").value')).includes(
			"Natur und Mensch",
		),
	);
	await evaluate(
		`var d=document.querySelector('#draft');d.value='Neue eigene Antwort nach einer Korrektur.';d.dispatchEvent(new Event('input',{bubbles:true}));`,
	);
	assert.ok(
		!(
			await evaluate('document.querySelector("#lesson-status").innerText')
		).includes("abgeschlossen"),
	);
	// Recompute scale after changing the real slider and selecting the second comparison.
	await evaluate('location.hash="#lesson=geo-massstab&level=1"');
	await evaluate(
		"new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))",
	);
	await evaluate(
		`const input=document.querySelector('[data-model-range]');input.value='8';input.dispatchEvent(new Event('change',{bubbles:true}));`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector(".model-readout").innerText')
		).includes("2.000 m"),
	);
	await evaluate('document.querySelector("[data-scenario=overview]").click()');
	assert.ok(
		(
			await evaluate('document.querySelector(".model-readout").innerText')
		).includes("4.000 m"),
	);
	await screenshot("scale-interaction");
	// All six model families change through their real buttons without errors.
	for (const lesson of lessons.filter((l) => l.model)) {
		await evaluate(
			`location.hash=${JSON.stringify("#lesson=" + lesson.id + "&level=1")}`,
		);
		await evaluate(
			"new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))",
		);
		await evaluate(
			`Array.from(document.querySelectorAll('[data-scenario]')).map(e=>e.dataset.scenario).forEach(id=>document.querySelector('[data-scenario="'+id+'"]').click())`,
		);
		assert.ok(
			(
				await evaluate('document.querySelector(".exploration").innerText')
			).includes("Alle Vergleichssituationen geöffnet"),
		);
	}
	// Markers support keyboard activation as well as the comparison buttons.
	await evaluate('location.hash="#lesson=geo-gradnetz&level=1"');
	await evaluate(
		"new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))",
	);
	await evaluate(
		`document.querySelector('g[data-country="quito"]').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector(".model-readout").innerText')
		).includes("78,5° West"),
	);
	await evaluate('location.hash="#lesson=geo-deutschland&level=1"');
	await evaluate(
		"new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))",
	);
	await evaluate(
		`document.querySelector('g[data-country="ansbach"]').dispatchEvent(new KeyboardEvent('keydown',{key:' ',bubbles:true}))`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector(".model-readout").innerText')
		).includes("Mittelfranken"),
	);
	// Narrow screens: path, all models and the full research form retain their controls.
	await page("Emulation.setDeviceMetricsOverride", {
		width: 390,
		height: 844,
		deviceScaleFactor: 1,
		mobile: true,
	});
	for (const id of [
		"",
		...lessons.filter((l) => l.model || l.projectStep).map((l) => l.id),
	]) {
		await evaluate(
			`location.hash=${JSON.stringify(id ? "#lesson=" + id + "&level=2" : "")}`,
		);
		await evaluate(
			"new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))",
		);
		assert.equal(
			await evaluate("document.documentElement.scrollWidth>innerWidth"),
			false,
			`mobile ${id}`,
		);
		await screenshot(`mobile-${id || "path"}`);
	}
	assert.deepEqual(errors, []);
	const external = requests.filter((url) => /^https?:/.test(url));
	assert.deepEqual(external, []);
	writeFileSync(
		`${output}/report.json`,
		JSON.stringify(
			{
				pages,
				lessons: lessons.length,
				themes: ["light", "dark"],
				levels: [1, 2],
				mobileWidths: [390],
				runtimeErrors: errors,
				externalRequests: external,
				interactionChecks: [
					"quiz feedback",
					"workshop solution",
					"rubric gate",
					"draft invalidation",
					"reload persistence",
					"scale slider",
					"all model comparisons",
					"keyboard map markers",
					"regional land and offshore sea labels",
				],
			},
			null,
			2,
		),
	);
	console.log(
		`Artifacts: ${output}\n${pages} lesson/level/theme combinations; path and reference views; mobile checks; actual interaction checks; 0 runtime errors; 0 external requests.`,
	);
} finally {
	await send("Browser.close").catch(() => {});
	chrome.kill();
}
