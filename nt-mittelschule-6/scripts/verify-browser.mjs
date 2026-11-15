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
const output = process.env.BROWSER_QA_DIR ?? "/private/tmp/zam-nt6-browser";
mkdirSync(output, { recursive: true });
const lessons = [
	"methods",
	"water",
	"aquatic",
	"soil",
	"health",
	"forces",
	"tools",
	"motion",
].flatMap((name) =>
	JSON.parse(readFileSync(`${root}/src/curriculum/lessons-${name}.json`)),
);
const extendedModels = JSON.parse(
	readFileSync(`${root}/src/curriculum/extended-models.json`),
);
const investigations = JSON.parse(
	readFileSync(`${root}/src/curriculum/investigations.json`),
);
const modelActions = JSON.parse(
	readFileSync(`${root}/src/curriculum/model-actions.json`),
);
// A fresh browser profile keeps the verification independent of previous runs.
const profile = mkdtempSync(join(tmpdir(), "zam-nt6-browser-"));
const chrome = spawn(
	process.env.CHROME_BIN ??
		(process.platform === "darwin"
			? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
			: "google-chrome"),
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
const closed = new Promise((resolve) => chrome.once("exit", resolve));
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
const screenshotElement = async (name, selector) => {
	const clip = await evaluate(
		`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1};})()`,
	);
	const result = await page("Page.captureScreenshot", {
		format: "png",
		captureBeyondViewport: true,
		clip,
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
// Compare with the requested device width, because mobile emulation may expand innerWidth.
const assertLayout = async (width, context) => {
	const bounds = await evaluate(
		`({documentWidth:document.documentElement.scrollWidth,innerWidth,heading:Array.from(document.querySelectorAll('main h1')).map(h=>({scroll:h.scrollWidth,client:h.clientWidth}))})`,
	);
	assert.ok(
		bounds.documentWidth <= width + 1,
		`document overflow ${context}: ${bounds.documentWidth} > ${width}`,
	);
	assert.ok(
		bounds.innerWidth <= width + 1,
		`viewport expansion ${context}: ${bounds.innerWidth} > ${width}`,
	);
	for (const heading of bounds.heading)
		assert.ok(
			heading.scroll <= heading.client + 1,
			`heading overflow ${context}: ${heading.scroll} > ${heading.client}`,
		);
};
const assertDiagramLabels = async (context) => {
	const clipped = await evaluate(
		`(()=>{return Array.from(document.querySelectorAll('[data-lab-stage] svg.extended-diagram,[data-model-action] svg.action-diagram')).flatMap(svg=>{const v=svg.viewBox.baseVal;return Array.from(svg.querySelectorAll('text')).filter(t=>t.closest('svg')===svg).flatMap(t=>{const b=t.getBBox();return b.x < v.x-1 || b.y < v.y-1 || b.x+b.width > v.x+v.width+1 || b.y+b.height > v.y+v.height+1 ? [t.textContent] : [];});});})()`,
	);
	assert.deepEqual(clipped, [], `clipped model labels: ${context}`);
};
const contrast = (a, b) => {
	const luminance = (colour) =>
		colour
			.match(/[\d.]+/g)
			.slice(0, 3)
			.map(Number)
			.map((v) => {
				const c = v / 255;
				return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
			})
			.reduce((n, c, i) => n + c * [0.2126, 0.7152, 0.0722][i], 0);
	const first = luminance(a),
		second = luminance(b);
	return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
};
const assertSelectedContrast = async () => {
	const colours = await evaluate(
		`Array.from(document.querySelectorAll('.lab-controls .chip[aria-pressed=true],.lab-investigation .chip[aria-pressed=true],.action-marker.filled,.action-node[aria-pressed=true]')).map(el=>{const css=getComputedStyle(el);return {text:el.textContent,foreground:css.color,background:css.backgroundColor};})`,
	);
	assert.ok(colours.length > 0);
	for (const c of colours)
		assert.ok(
			contrast(c.foreground, c.background) >= 4.5,
			`selected chip contrast ${c.text}: ${contrast(c.foreground, c.background)}`,
		);
};
const nativeClick = async (selector) => {
	const position = await evaluate(
		`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e||e.disabled)throw Error('Unavailable control: '+${JSON.stringify(selector)});e.scrollIntoView({block:'center',inline:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`,
	);
	await page("Input.dispatchMouseEvent", {
		type: "mousePressed",
		button: "left",
		clickCount: 1,
		...position,
	});
	await page("Input.dispatchMouseEvent", {
		type: "mouseReleased",
		button: "left",
		clickCount: 1,
		...position,
	});
};
const nativeKey = async (key) => {
	await page("Input.dispatchKeyEvent", { type: "keyDown", key, code: key });
	await page("Input.dispatchKeyEvent", { type: "keyUp", key, code: key });
};
const firstGoalMet = () =>
	evaluate(
		`document.querySelector('[data-lab-goals] li').classList.contains('met')`,
	);
const solveAction = async (kind) => {
	const def = modelActions[kind];
	await nativeClick("[data-action-check]");
	assert.equal(
		await firstGoalMet(),
		false,
		`${kind}: empty construction must fail`,
	);
	if (def.type === "order") {
		for (let target = 0; target < def.items.length; target++) {
			let index = (
				await evaluate(
					`Array.from(document.querySelectorAll('.action-order li>span')).map(e=>e.textContent)`,
				)
			).indexOf(def.items[target]);
			while (index > target) {
				await nativeClick(`[data-action-move="${index}"][data-delta="-1"]`);
				index--;
			}
		}
	} else if (def.type === "labels") {
		// A full set of labels can still be wrong; submission must check the mapping.
		const first = def.targets[0],
			wrong = def.labels.find((label) => label !== first.label);
		await nativeClick(`[data-action-label="${def.labels.indexOf(wrong)}"]`);
		await nativeClick(`[data-action-target="${first.id}"]`);
		await nativeClick("[data-action-check]");
		assert.equal(await firstGoalMet(), false);
		for (const target of def.targets) {
			await nativeClick(
				`[data-action-label="${def.labels.indexOf(target.label)}"]`,
			);
			await nativeClick(`[data-action-target="${target.id}"]`);
		}
		const labels = await evaluate(
			`Array.from(document.querySelectorAll('.action-label-list strong')).map(e=>e.textContent)`,
		);
		assert.deepEqual(
			labels,
			def.targets.map((t) => t.label),
		);
	} else if (def.type === "network") {
		const [from, to] = def.edges[0];
		await nativeClick(`[data-action-node="${to}"]`);
		await nativeClick(`[data-action-node="${from}"]`);
		await nativeClick("[data-action-check]");
		assert.equal(await firstGoalMet(), false);
		await nativeClick(`[data-action-node="${to}"]`);
		await nativeClick(`[data-action-node="${from}"]`);
		assert.equal(
			await evaluate(
				`document.querySelectorAll('.action-edge-list li').length`,
			),
			0,
		);
		for (const [a, b] of def.edges) {
			await nativeClick(`[data-action-node="${a}"]`);
			await nativeClick(`[data-action-node="${b}"]`);
		}
		assert.equal(
			await evaluate(
				`document.querySelectorAll('.action-edge-list li').length`,
			),
			def.edges.length,
		);
	} else if (def.type === "molecule") {
		for (const element of ["H", "H", "O"])
			await nativeClick(`[data-action-atom="${element}"][data-delta="1"]`);
		assert.deepEqual(
			await evaluate(
				`['H','O'].map(e=>document.querySelectorAll('[data-model-action] .atom-'+e).length)`,
			),
			[2, 1],
		);
	} else if (def.type === "scenario") {
		const before = await evaluate(
			`document.querySelector('.action-diagram').innerHTML`,
		);
		for (const f of def.features)
			if (f.initial !== f.desired)
				await nativeClick(`[data-action-feature="${f.id}"]`);
		assert.notEqual(
			await evaluate(`document.querySelector('.action-diagram').innerHTML`),
			before,
		);
	} else if (def.type === "experiment") {
		for (const t of def.trials)
			assert.equal(
				await evaluate(
					`document.querySelector('[data-action-run="${t.id}"]').disabled`,
				),
				true,
			);
		for (const t of def.trials) {
			const index = def.outcomes.indexOf(t.outcome);
			await evaluate(
				`(()=>{const e=document.querySelector('[data-action-predict="${t.id}"]');e.value='${index}';e.dispatchEvent(new Event('change',{bubbles:true}));})()`,
			);
			await nativeClick(`[data-action-run="${t.id}"]`);
			assert.ok(
				(
					await evaluate(
						`document.querySelector('[data-action-run="${t.id}"]').parentElement.innerText`,
					)
				).includes(`Modellbeobachtung: ${t.outcome}`),
			);
		}
	} else if (def.type === "point") {
		// Native pointer capture must survive the child diagram being redrawn during a drag.
		const geometry = await evaluate(
			`(()=>{const c=document.querySelector('[data-action-canvas]');c.scrollIntoView({block:'center',inline:'center'});const r=c.getBoundingClientRect(),h=document.querySelector('[data-action-point]').getBoundingClientRect();return {left:r.x,top:r.y,width:r.width,height:r.height,startX:h.x+h.width/2,startY:h.y+h.height/2};})()`,
		);
		const target = kind === "forces" ? { x: 300, y: 100 } : { x: 400, y: 80 };
		await page("Input.dispatchMouseEvent", {
			type: "mousePressed",
			button: "left",
			buttons: 1,
			clickCount: 1,
			x: geometry.startX,
			y: geometry.startY,
		});
		for (const point of [{ x: 100, y: 250 }, target])
			await page("Input.dispatchMouseEvent", {
				type: "mouseMoved",
				button: "left",
				buttons: 1,
				x: geometry.left + (point.x / 600) * geometry.width,
				y: geometry.top + (point.y / 360) * geometry.height,
			});
		await page("Input.dispatchMouseEvent", {
			type: "mouseReleased",
			button: "left",
			buttons: 0,
			clickCount: 1,
			x: geometry.left + (target.x / 600) * geometry.width,
			y: geometry.top + (target.y / 360) * geometry.height,
		});
		const x = await evaluate(
			`parseFloat(document.querySelector('[data-action-point]').style.left)*6`,
		);
		assert.ok(
			Math.abs(x - target.x) < 1,
			`${kind}: native drag follows the pointer`,
		);
		assert.equal(
			await evaluate(
				`document.activeElement.hasAttribute('data-action-point')`,
			),
			true,
		);
		await nativeKey("ArrowLeft");
		assert.ok(
			Math.abs(
				(await evaluate(
					`parseFloat(document.querySelector('[data-action-point]').style.left)*6`,
				)) -
					(target.x - 20),
			) < 1,
			`${kind}: native keyboard moves the handle`,
		);
		assert.equal(
			await evaluate(
				`document.activeElement.hasAttribute('data-action-point')`,
			),
			true,
		);
	}
	assert.equal(
		await firstGoalMet(),
		false,
		`${kind}: construction must be checked`,
	);
	await nativeClick("[data-action-check]");
	assert.equal(await firstGoalMet(), true, `${kind}: correct construction`);
};

const setQuantity = (key, value) =>
	evaluate(
		`var el=document.querySelector('[data-quantity="${key}"]');el.value=${value};el.dispatchEvent(new Event('input',{bubbles:true}))`,
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
	await page("Page.navigate", {
		url: pathToFileURL(join(root, "dist/index.html")).href,
	});
	for (let i = 0; i < 100; i++) {
		if (await evaluate('!!document.querySelector(".hero")')) break;
		await new Promise((resolve) => setTimeout(resolve, 25));
	}
	assert.equal(
		await evaluate('document.querySelectorAll(".lesson-link").length'),
		lessons.length,
	);
	assert.ok(
		(
			await evaluate('document.querySelector(".zam-preview-notice").innerText')
		).includes("Vorschau"),
	);
	let states = 0,
		controls = 0,
		goalChecks = 0,
		contrastChecks = 0,
		constructionChecks = 0,
		directGoalChecks = 0;
	for (const theme of ["light", "dark"]) {
		await evaluate(
			`document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
		);
		await route("");
		await screenshot(`path-${theme}`);
		for (const l of lessons)
			for (const level of [1, 2]) {
				await route(`#lesson=${l.id}&level=${level}`);
				const result = await evaluate(
					`({title:document.querySelector('main h1')?.textContent,prompt:document.querySelector('.task-prompt')?.textContent,text:document.querySelector('main')?.innerText,quiz:document.querySelectorAll('[data-choice]').length,model:document.querySelectorAll('[data-lab-choice]').length,svg:document.querySelectorAll('.chem-diagram').length,over:document.documentElement.scrollWidth>innerWidth})`,
				);
				assert.equal(result.title, l.title);
				assert.equal(result.prompt, l.tasks[level].prompt);
				assert.equal(result.quiz, 3);
				assert.equal(result.model, 3);
				assert.equal(result.svg, 1);
				assert.equal(result.over, false, `${l.id} desktop overflow`);
				assert.ok(!/NaN|undefined/.test(result.text));
				await evaluate(`document.querySelector('[data-choice="1"]').click()`);
				assert.ok(
					!(
						await evaluate(
							'document.querySelector(".quiz .feedback").textContent',
						)
					).includes(l.quiz.explanation),
				);
				await evaluate(
					`var d=document.querySelector('#draft');d.value=${JSON.stringify(l.tasks[level].model)};d.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#compare').click()`,
				);
				assert.equal(
					await evaluate('document.querySelectorAll("[data-rubric]").length'),
					3,
				);
				assert.equal(
					await evaluate('document.querySelector("#accept-writing").disabled'),
					true,
				);
				assert.ok(
					(
						await evaluate('document.querySelector(".model-answer").innerText')
					).includes(l.tasks[level].model),
				);
				await screenshot(`${l.id}-level${level}-${theme}`);
				states++;
			}
		await route("#view=reference");
		assert.equal(
			await evaluate('document.querySelectorAll(".reference dt").length'),
			lessons.length,
		);
		await screenshot(`reference-${theme}`);
	}
	for (const theme of ["light", "dark", "system-dark"]) {
		await page("Emulation.setEmulatedMedia", {
			features: [
				{
					name: "prefers-color-scheme",
					value: theme === "system-dark" ? "dark" : "light",
				},
			],
		});
		await evaluate(
			theme === "system-dark"
				? "delete document.documentElement.dataset.theme"
				: `document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
		);
		for (const l of lessons) {
			await route(`#lesson=${l.id}&level=1`);
			const choices = await evaluate(
				'Array.from(document.querySelectorAll("[data-lab-choice]")).map(b=>b.dataset.labChoice)',
			);
			for (const id of choices) {
				await evaluate(
					`document.querySelector('[data-lab-choice="${id}"]').click()`,
				);
				assert.equal(
					await evaluate(
						'document.querySelectorAll("[data-lab-choice][aria-pressed=true]").length',
					),
					1,
				);
				assert.ok(
					(
						await evaluate(
							'document.querySelector("[data-lab-count]").textContent',
						)
					).includes("0 / 3"),
				);
				assert.ok(
					(
						await evaluate(
							'document.querySelector("[data-lab-detail]").textContent',
						)
					).length > 60,
				);
				await assertSelectedContrast();
				await assertDiagramLabels(`${l.id}/${id}/${theme}`);
				if (theme === "light" && extendedModels[l.lab])
					await screenshotElement(`${l.id}-${id}-diagram`, "[data-lab-stage]");
				contrastChecks++;
				controls++;
			}
		}
	}
	for (const l of lessons) {
		await route(`#lesson=${l.id}&level=1`);
		await evaluate(`document.querySelector('.lab-investigation').open=true`);
		if (modelActions[l.lab]) {
			await solveAction(l.lab);
			constructionChecks++;
			await assertDiagramLabels(`${l.id}/constructed`);
		}
		if (extendedModels[l.lab]?.control) {
			const control = extendedModels[l.lab].control;
			await evaluate(
				`var el=document.querySelector("[data-model-parameter]");el.value=${control.initial};el.dispatchEvent(new Event("input",{bubbles:true}))`,
			);
			assert.equal(
				await evaluate(
					'document.querySelectorAll("[data-lab-goals] li")[0].classList.contains("met")',
				),
				false,
			);
			await evaluate(
				`var el=document.querySelector("[data-model-parameter]");el.value=${control.target};el.dispatchEvent(new Event("input",{bubbles:true}))`,
			);
			const expected = {
				microscope: "scharf",
				forceMeter: "6 cm",
				work: "60 J",
				lever: "2 N",
				machines: "20 N",
				speed: "18 km/h",
				motionGraph: "24 m",
				stopping: "40 m",
			};
			assert.ok(
				(
					await evaluate(
						'document.querySelector("[data-model-readout]").textContent',
					)
				).includes(expected[l.lab]),
				`${l.id}: independent numerical readout`,
			);
		}
		if (l.lab === "particles") {
			for (const value of [0, 100])
				await evaluate(
					`var el=document.querySelector('[data-temperature-range]');el.value=${value};el.dispatchEvent(new Event('input',{bubbles:true}))`,
				);
		}
		if (l.lab === "electrolysis") {
			await setQuantity("hydrogenCount", 2);
			assert.ok(
				!(await evaluate(
					'document.querySelectorAll("[data-lab-goals] li")[0].classList.contains("met")',
				)),
			);
			await setQuantity("oxygenCount", 1);
			await setQuantity("hydrogenVolume", 20);
			assert.ok(
				(
					await evaluate(
						'document.querySelector("[data-atom-count]").textContent',
					)
				).includes("rechts: 4 H und 2 O"),
			);
			await setQuantity("oxygenCount", 2);
			assert.ok(
				!(
					await evaluate(
						'document.querySelectorAll("[data-investigation-feedback]")[0].textContent',
					)
				).startsWith("✓"),
			);
			await setQuantity("oxygenCount", 1);
		}
		if (l.lab === "anomaly") {
			await setQuantity("densityTemperature", 3);
			assert.equal(
				await evaluate(
					'document.querySelectorAll("[data-lab-goals] li")[0].classList.contains("met")',
				),
				false,
			);
			await setQuantity("densityTemperature", 4);
		}
		if (l.lab === "hydro")
			for (const index of [0, 1, 0, 2])
				await evaluate(
					`document.querySelector('[data-energy-move="${index}"][data-delta="1"]').click()`,
				);
		for (const [index, q] of investigations[l.lab].entries()) {
			const custom =
				(index === 0 &&
					(!!extendedModels[l.lab]?.control || !!modelActions[l.lab])) ||
				((l.lab === "particles" || l.lab === "electrolysis") && index < 2) ||
				((l.lab === "anomaly" || l.lab === "hydro") && index === 0);
			if (custom) directGoalChecks++;
			if (!custom) {
				await evaluate(
					`document.querySelector('[data-investigation-answer="${index}"][data-answer="${(q.correct + 1) % 3}"]').click()`,
				);
				assert.equal(
					await evaluate(
						`document.querySelectorAll('[data-lab-goals] li')[${index}].classList.contains('met')`,
					),
					false,
				);
				await evaluate(
					`document.querySelector('[data-investigation-answer="${index}"][data-answer="${q.correct}"]').click()`,
				);
				await assertSelectedContrast();
				contrastChecks++;
			}
			assert.equal(
				await evaluate(
					`document.querySelectorAll('[data-lab-goals] li')[${index}].classList.contains('met')`,
				),
				true,
			);
			goalChecks++;
		}
		assert.ok(
			(
				await evaluate('document.querySelector("[data-lab-count]").textContent')
			).includes("3 / 3"),
		);

		if (modelActions[l.lab])
			for (const theme of ["light", "dark"]) {
				await evaluate(
					`document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
				);
				await assertSelectedContrast();
				contrastChecks++;
				await screenshotElement(
					`${l.id}-construction-${theme}`,
					"[data-model-action]",
				);
			}
		if (l.lab === "organs")
			for (const theme of ["light", "dark"]) {
				await evaluate(
					`document.documentElement.dataset.theme=${JSON.stringify(theme)};document.querySelector('[data-lab-choice="male"]').click()`,
				);
				await assertDiagramLabels(`male anatomy/${theme}`);
				await screenshotElement(`male-anatomy-${theme}`, "[data-lab-stage]");
			}
		await screenshot(`${l.id}-investigated`);
		await screenshotElement(`${l.id}-model-detail`, ".lab");
		for (const [index, e] of l.workshop.entries.entries())
			await evaluate(
				`document.querySelector('button[data-assign="${index}"][data-value="${e.target}"]').click()`,
			);
		await evaluate(
			`document.querySelector('#check-workshop').click();document.querySelector('[data-choice="0"]').click()`,
		);
		assert.ok(
			(
				await evaluate(
					'document.querySelector(".workshop .feedback").innerText',
				)
			).includes(l.workshop.conclusion),
		);
	}
	await route("#lesson=c6-teilchen-zustaende");
	for (const temperature of [-10, 0, 4, 99, 100, 110]) {
		await evaluate(
			`var r=document.querySelector('[data-temperature-range]');r.value=${temperature};r.dispatchEvent(new Event('input',{bubbles:true}))`,
		);
		assert.equal(
			await evaluate(
				'document.querySelector("[data-temperature-range]").value',
			),
			String(temperature),
		);
		assert.ok(
			!(
				await evaluate('document.querySelector("[data-lab-stage]").innerHTML')
			).includes("NaN"),
		);
		if (temperature === 0 || temperature === 100)
			assert.ok(
				(
					await evaluate(
						'document.querySelector("[data-lab-detail]").textContent',
					)
				).includes("zwei Zustände"),
			);
	}
	const first = lessons[0];
	for (const level of [1, 2]) {
		await route(`#lesson=${first.id}&level=${level}`);
		await evaluate(
			`document.querySelector('#compare').click();document.querySelectorAll('[data-rubric]').forEach(e=>{e.checked=true;e.dispatchEvent(new Event('change',{bubbles:true}))});document.querySelector('#accept-writing').click()`,
		);
		await frame();
		assert.ok(
			(
				await evaluate('document.querySelector("#progress-label").textContent')
			).startsWith(`${level === 1 ? 0 : 1} / ${lessons.length}`),
		);
	}
	await page("Page.reload");
	for (let i = 0; i < 100; i++) {
		if (await evaluate('!!document.querySelector("#draft")')) break;
		await new Promise((resolve) => setTimeout(resolve, 20));
	}
	assert.equal(
		await evaluate('document.querySelector("#draft").value'),
		first.tasks[2].model,
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-label").textContent')
		).startsWith(`1 / ${lessons.length}`),
	);
	await evaluate(
		`var d=document.querySelector('#draft');d.value='Ein geänderter eigener Entwurf zur neuen Begründung.';d.dispatchEvent(new Event('input',{bubbles:true}))`,
	);
	await frame();
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-label").textContent')
		).startsWith(`0 / ${lessons.length}`),
	);
	await evaluate(`document.querySelector('#zam').click()`);
	assert.ok(
		(await evaluate('document.querySelector("dialog").innerText')).includes(
			`${lessons.length * 3} Karten`,
		),
	);
	assert.ok(
		(await evaluate('document.querySelector("dialog").innerText')).includes(
			"als Vorschau veröffentlicht",
		),
	);
	await evaluate(`document.querySelector('dialog [data-close]').click()`);
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
					await evaluate("document.documentElement.scrollWidth > " + width),
					false,
					`overflow ${width} ${theme} ${id}`,
				);
				await assertLayout(width, `${theme} ${id}`);
				if (id && id !== "reference") {
					await evaluate(
						"document.querySelector('.lab-investigation').open=true",
					);
					await frame();
					await assertLayout(width, `${theme} ${id}, research task open`);
				}
				if (
					[
						"",
						"c6-molekuele",
						"c6-oberflaeche",
						"c6-wasserzerlegung",
						"c6-bodenschutz",
						"reference",
					].includes(id)
				)
					await screenshot(`mobile-${width}-${id || "path"}-${theme}`);
			}
		}
	}
	await page("Emulation.setDeviceMetricsOverride", {
		width: 320,
		height: 900,
		deviceScaleFactor: 1,
		mobile: true,
	});
	await route("#lesson=c6-oberflaeche");
	await evaluate(
		`var style=document.createElement('style');style.id='regression-probe';style.textContent='main h1{overflow-wrap:normal!important;hyphens:none!important;font-size:32px!important}';document.head.append(style)`,
	);
	await assert.rejects(
		() => assertLayout(320, "intentional regression"),
		/overflow|expansion/,
	);
	await evaluate(`document.querySelector('#regression-probe').remove()`);
	await frame();
	await assertLayout(320, "repaired surface-tension heading");
	await evaluate(
		`document.querySelector('[data-lab-choice="strider"]').click();var style=document.createElement('style');style.id='regression-probe';style.textContent='.lab-controls .chip[aria-pressed=true]{color:white!important;background:#95cafa!important}';document.head.append(style)`,
	);
	await assert.rejects(() => assertSelectedContrast(), /contrast/);
	await evaluate(`document.querySelector('#regression-probe').remove()`);
	await assertSelectedContrast();
	await route("#lesson=c6-molekuele");
	assert.ok(
		await evaluate(`document.querySelector('[data-lab-stage]').scrollLeft>0`),
	);
	// Navigation preserves the currently selected task level in the copied URL.
	await route("#lesson=c6-forschen&level=2");
	await evaluate(
		`document.querySelector('.lesson-navigation [data-open]').click()`,
	);
	await frame();
	assert.ok((await evaluate("location.hash")).includes("level=2"));
	await route("");
	await evaluate(
		`document.querySelector('#reset').click();document.querySelector('#confirm-reset').click()`,
	);
	await frame();
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-label").textContent')
		).startsWith(`0 / ${lessons.length}`),
	);
	assert.deepEqual(errors, []);
	assert.deepEqual(
		requests.filter((url) => /^https?:/.test(url)),
		[],
	);
	writeFileSync(
		`${output}/report.json`,
		JSON.stringify(
			{
				lessons: lessons.length,
				states,
				controls,
				goalChecks,
				constructionChecks,
				directGoalChecks,
				contrastChecks,
				workshops: lessons.length,
				themes: ["light", "dark"],
				modelThemes: ["light", "dark", "system-dark"],
				widths: [320, 390, 720, 1280],
				checks: [
					"two independent writing levels",
					"model construction, native pointer/keyboard actions and numerical proposals",
					"selected-chip contrast in explicit and system themes",
					"target-width and heading overflow with negative controls",
					"centred mobile molecule and task-level deep links",
					"temperature boundaries",
					"reload persistence",
					"draft invalidation",
					"published preview ZAM dialog",
					"progress reset",
				],
				runtimeErrors: 0,
				externalRequests: 0,
			},
			null,
			2,
		) + "\n",
	);
	console.log(
		`ok: ${states} lesson/level/theme states, ${controls} model views, ${goalChecks} solved model goals (${constructionChecks} constructed models), ${contrastChecks} contrast checks and ${lessons.length} solved workshops; persistence, both writing levels, mobile layouts and reset pass; no runtime errors or external requests.`,
	);
} finally {
	chrome.kill();
	const forceExit = setTimeout(() => chrome.kill("SIGKILL"), 2000);
	await closed;
	clearTimeout(forceExit);
	for (const pipe of chrome.stdio) pipe?.destroy();
	rmSync(profile, {
		recursive: true,
		force: true,
		maxRetries: 5,
		retryDelay: 100,
	});
}
