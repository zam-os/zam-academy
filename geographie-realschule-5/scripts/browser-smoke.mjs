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
	await page("Page.bringToFront");
	await page("Emulation.setFocusEmulationEnabled", { enabled: true });
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
	let figureInteractions = 0;
	let mobilePages = 0;
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
				const figure = await evaluate(`(() => {
          const f=document.querySelector('.concept-figure');
          const svg=f?.querySelector('svg');
          const frame=svg?.getBoundingClientRect();
          return {
            count:document.querySelectorAll('.concept-figure').length,
            lesson:f?.dataset.figure,
            role:svg?.getAttribute('role'),
            description:svg?.querySelector('desc')?.textContent,
            selected:f?.querySelectorAll('[aria-pressed="true"]').length,
            controls:f?.querySelectorAll('[data-figure-focus]').length,
            clipped:Array.from(svg?.querySelectorAll('text')??[]).filter(e=>{
              const b=e.getBoundingClientRect();
              return b.left<frame.left-0.5||b.right>frame.right+0.5||b.top<frame.top-0.5||b.bottom>frame.bottom+0.5;
            }).map(e=>e.textContent)
          };
        })()`);
				assert.equal(figure.count, 1, lesson.id);
				assert.equal(figure.lesson, lesson.id);
				assert.equal(figure.role, "img");
				assert.ok(figure.description.length > 80);
				assert.equal(figure.selected, 1);
				assert.ok(figure.controls >= 3);
				assert.deepEqual(
					figure.clipped,
					[],
					`${lesson.id}: labels stay within the figure`,
				);
				if (lesson.id === "geo-erdgeschichte") {
					const structure = await evaluate(`(() => {
                    const section=document.querySelector('.earth-layers');
                    return {layers:Array.from(section.querySelectorAll('circle'),e=>e.dataset.earthLayer),colours:Array.from(section.querySelectorAll('circle'),e=>getComputedStyle(e).fill),labels:document.querySelector('.earth-layer-labels').textContent};
                  })()`);
					assert.deepEqual(structure.layers, ["crust", "mantle", "core"]);
					assert.equal(
						new Set(structure.colours).size,
						3,
						"Earth layers have distinct rendered colours",
					);
					for (const label of ["Kruste", "Mantel", "Kern"])
						assert.ok(structure.labels.includes(label));
				}
				if (lesson.id === "geo-erdbewegungen") {
					const rotation = await evaluate(`(() => {
                    const path=document.querySelector('[data-rotation="front"]');
                    const bounds=path.getBBox();
                    return {height:bounds.height,width:bounds.width,arrow:!!path.parentElement.querySelector('.arrow-head')};
                  })()`);
					assert.ok(
						rotation.height > 20 && rotation.width > 100 && rotation.arrow,
						"rotation arrow wraps around the Earth",
					);
				}
				if (level === 1) {
					await evaluate(
						`window.figureDraft=document.querySelector('#draft');window.figureStorage=JSON.stringify({...localStorage});window.figureScroll=scrollY;`,
					);
					for (let part = 1; part < figure.controls; part++) {
						await evaluate(
							`document.querySelector('[data-figure-focus="${part}"]').click()`,
						);
						const state = await evaluate(
							`({focus:document.querySelector('.concept-figure').dataset.focus,selected:document.querySelectorAll('.concept-figure [aria-pressed="true"]').length,note:document.querySelector('.figure-note').textContent,heading:document.querySelector('.figure-note strong')?.textContent,stable:window.figureDraft===document.querySelector('#draft'),storage:window.figureStorage===JSON.stringify({...localStorage}),scroll:window.figureScroll===scrollY})`,
						);
						assert.equal(state.focus, String(part));
						assert.equal(state.selected, 1);
						assert.ok(state.note.length > 60);
						assert.ok(
							state.heading?.endsWith(":"),
							"selected figure label stays emphasized",
						);
						assert.equal(
							state.stable,
							true,
							"figure selection preserves the draft element",
						);
						assert.equal(
							state.storage,
							true,
							"figure selection records no mastery or progress",
						);
						assert.equal(
							state.scroll,
							true,
							"figure selection preserves scroll position",
						);
						figureInteractions++;
					}
					await evaluate(
						`document.querySelector('[data-figure-focus="0"]').focus()`,
					);
					await page("Input.dispatchKeyEvent", {
						type: "keyDown",
						key: "Enter",
						code: "Enter",
						text: "\r",
						unmodifiedText: "\r",
						windowsVirtualKeyCode: 13,
					});
					await page("Input.dispatchKeyEvent", {
						type: "keyUp",
						key: "Enter",
						code: "Enter",
						windowsVirtualKeyCode: 13,
					});
					assert.equal(
						await evaluate(
							`document.querySelector('.concept-figure').dataset.focus`,
						),
						"0",
					);
					assert.equal(
						await evaluate(`document.activeElement.dataset.figureFocus`),
						"0",
					);
					figureInteractions++;
				}

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
	assert.ok(
		(
			await evaluate('document.querySelector(".model-readout").innerText')
		).includes("1 : 25 000"),
	);
	await evaluate('document.querySelector("[data-scenario=overview]").click()');
	assert.ok(
		(
			await evaluate('document.querySelector(".model-readout").innerText')
		).includes("1 : 50 000"),
	);

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

	for (const theme of ["light", "dark"]) {
		await evaluate(
			`document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
		);
		for (const id of ["", ...lessons.map((l) => l.id)]) {
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
			if (id) {
				const pan = await evaluate(
					`(()=>{const s=document.querySelector('.figure-scroll');const last=s.scrollWidth-s.clientWidth;s.scrollLeft=last;return {last,position:s.scrollLeft,tab:s.tabIndex,labelSize:parseFloat(getComputedStyle(document.querySelector('.concept-svg .visual-label:not(.micro)')).fontSize)*document.querySelector('.concept-svg').getBoundingClientRect().width/600};})()`,
				);
				assert.ok(pan.last > 0);
				assert.ok(
					Math.abs(pan.position - pan.last) < 1,
					"mobile diagram can be panned to its end",
				);
				assert.equal(pan.tab, 0, "diagram viewport is keyboard accessible");
				assert.ok(pan.labelSize >= 15.5, "main diagram labels remain readable");
				await evaluate(`document.querySelector('.figure-scroll').scrollLeft=0`);
				const focused = await evaluate(`(()=>{
          document.querySelector('.figure-controls button:last-child').click();
          const f=document.querySelector('.concept-figure');
          const active=Array.from(f.querySelectorAll('[data-part="'+f.dataset.focus+'"]'),e=>e.getBoundingClientRect());
          const center=(Math.min(...active.map(b=>b.left))+Math.max(...active.map(b=>b.right)))/2;
          const viewport=f.querySelector('.figure-scroll').getBoundingClientRect();
          return center>=viewport.left-1&&center<=viewport.right+1;
        })()`);
				assert.equal(
					focused,
					true,
					`mobile ${id}: selected detail is brought into view`,
				);
				await evaluate(
					`document.querySelector('[data-figure-focus="0"]').click()`,
				);
			}
			await screenshot(`mobile-${id || "path"}-${theme}`);
			mobilePages++;
		}
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
				mobilePages,
				figureInteractions,
				runtimeErrors: errors,
				externalRequests: external,
				interactionChecks: [
					"31 accessible explanatory figures",
					"figure label bounds",
					"three distinct labelled Earth layers",
					"curved rotation arrow around the polar axis",
					"selected figure label emphasis",
					"consistent scale notation",
					"figure focus and keyboard reset",
					"figure exploration preserves drafts, storage and scroll",
					"mobile diagram panning, selected detail visibility and label size",
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
		`Artifacts: ${output}\n${pages} lesson/level/theme combinations; ${figureInteractions} figure interactions; ${mobilePages} mobile views; path and reference views; mobile checks; actual interaction checks; 0 runtime errors; 0 external requests.`,
	);
} finally {
	await send("Browser.close").catch(() => {});
	chrome.kill();
}
