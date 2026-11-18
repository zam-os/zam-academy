import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { tmpdir } from "node:os";
import assert from "node:assert/strict";
const root = fileURLToPath(new URL("../", import.meta.url)).replace(/\/$/, "");
const output = mkdtempSync(join(tmpdir(), "zam-geo6-browser-"));
const chromeBinary =
	process.env.CHROME_BIN ??
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const lessons = Array.from({ length: 7 }, (_, i) =>
	JSON.parse(readFileSync(`${root}/src/curriculum/lessons-lb${i + 1}.json`)),
).flat();
const cell = JSON.parse(readFileSync(`${root}/cell.json`, "utf8"));
const cardCount = cell.atoms.reduce(
	(count, atom) => count + atom.practice_items.length,
	0,
);
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
	assert.ok(
		await evaluate(
			`document.querySelector('.zam-version')?.getBoundingClientRect().height > 0`,
		),
		"package version is visible",
	);
	assert.equal(
		await evaluate('document.querySelectorAll(".lesson-link").length'),
		lessons.length,
	);
	const afterRender = () =>
		evaluate(
			"new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))",
		);
	const navigate = async (hash) => {
		await evaluate(`location.hash=${JSON.stringify(hash)}`);
		await afterRender();
	};
	let pages = 0;
	let scenarioChanges = 0;
	for (const theme of ["light", "dark"]) {
		await evaluate(
			`document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
		);
		await navigate("#view=path");
		assert.equal(
			await evaluate('document.querySelectorAll(".lesson-link").length'),
			lessons.length,
		);
		await screenshot(`path-${theme}`);
		for (const lesson of lessons) {
			for (const level of [1, 2]) {
				await navigate(`#lesson=${lesson.id}&level=${level}`);
				const state = await evaluate(`({
					title: document.querySelector('main h1')?.textContent,
					prompt: document.querySelector('.task-prompt')?.textContent,
					main: document.querySelector('main')?.innerText,
					quiz: document.querySelectorAll('[data-choice]').length,
					work: document.querySelectorAll('[data-assign]').length,
					visuals: document.querySelectorAll('.exploration svg, .concept-diagram').length,
					over: document.documentElement.scrollWidth > innerWidth,
				})`);
				assert.equal(state.title, lesson.title);
				assert.equal(state.prompt, lesson.tasks[level].prompt);
				assert.equal(state.quiz, 3);
				assert.equal(state.work, lesson.workshop.entries.length);
				assert.ok(state.visuals > 0, lesson.id);
				assert.doesNotMatch(state.main, /NaN|undefined/);
				assert.equal(state.over, false, lesson.id);
				if (level === 1 && lesson.model) {
					const ids = await evaluate(
						`Array.from(document.querySelectorAll('[data-scenario]'), button => button.dataset.scenario)`,
					);
					await evaluate(
						'window.originalDraft = document.querySelector("#draft")',
					);
					for (const id of ids) {
						const changed = await evaluate(`(() => {
							const selector = '[data-scenario="' + ${JSON.stringify(id)} + '"]';
							document.querySelector(selector).click();
							const button = document.querySelector(selector);
							return button === document.activeElement && button.getAttribute('aria-pressed') === 'true'
								&& button.textContent.startsWith('✓') && document.querySelector('.exploration svg[role="img"]')
								&& window.originalDraft === document.querySelector('#draft');
						})()`);
						assert.ok(changed, `${lesson.id} ${id}`);
						scenarioChanges++;
					}
					assert.match(
						await evaluate(
							'document.querySelector(".model-progress").textContent',
						),
						/Alle Ansichten geöffnet/,
					);
					await evaluate('document.querySelector("[data-scenario]").click()');
				}
				await evaluate("window.scrollTo(0, 0)");
				await screenshot(`${lesson.id}-level${level}-${theme}`);
				pages++;
			}
		}
		await navigate("#view=reference");
		assert.equal(
			await evaluate('document.querySelectorAll(".reference dt").length'),
			lessons.length,
		);
		await screenshot(`reference-${theme}`);
	}

	await evaluate(`document.querySelector('#zam').click()`);
	assert.ok(
		(
			await evaluate(`document.querySelector('dialog[open]').innerText`)
		).includes(`Die Zelle enthält ${cardCount} Karten`),
	);
	await evaluate(`document.querySelector('dialog [data-close]').click()`);

	await navigate("#lesson=europa-natur&level=1");
	await evaluate(`document.querySelector('[data-scenario="relief"]').click()`);
	const waterwayKey = await evaluate(
		`document.querySelector('.exploration .pin-key').innerText`,
	);
	assert.match(waterwayKey, /Donaudelta an der Nordwestküste/);
	assert.match(
		waterwayKey,
		/Rhein erreicht das Meer an der niederländischen Küste/,
	);
	await evaluate(`document.querySelector('[data-scenario="states"]').click();
		const dropdown = document.querySelector('[data-model-country]');
		dropdown.value = 'TUR'; dropdown.dispatchEvent(new Event('change', {bubbles:true}));`);
	assert.equal(await evaluate(`document.activeElement.id`), "country-select");
	assert.match(
		await evaluate(
			`document.querySelector('.exploration [role=status]').textContent`,
		),
		/Ankara.*asiatischen Teil/,
	);
	assert.equal(
		await evaluate(
			`document.querySelector('.selected-country').dataset.mapCountry`,
		),
		"TUR",
	);
	await screenshot("state-finder");
	await evaluate(`(() => {
		const dropdown = document.querySelector('[data-model-country]');
		dropdown.value = 'KOS';
		dropdown.dispatchEvent(new Event('change', {bubbles:true}));
	})()`);
	assert.equal(
		await evaluate(
			`document.querySelector('.selected-country').dataset.mapCountry`,
		),
		"KOS",
	);
	await evaluate(`document.querySelector('[data-choice="1"]').click()`);
	assert.match(
		await evaluate('document.querySelector(".quiz .feedback").innerText'),
		/Prüfe/,
	);
	await evaluate(`document.querySelector('[data-choice="0"]').click()`);
	await evaluate(`const answers=${JSON.stringify(lessons[0].workshop.entries.map((e) => e.target))};
		document.querySelectorAll('[data-assign]').forEach((el)=>{el.value=String(answers[Number(el.dataset.assign)]);el.dispatchEvent(new Event('change',{bubbles:true}));});
		document.querySelector('#check-workshop').click()`);
	assert.match(
		await evaluate('document.querySelector(".workshop .feedback").innerText'),
		/Die Zuordnung stimmt/,
	);
	await evaluate(`const d = document.querySelector('#draft'); d.value='Die Alpen liegen südlich von Bayern und die Donau fließt ostwärts.';d.dispatchEvent(new Event('input',{bubbles:true}));
		document.querySelector('#compare').click(); document.querySelectorAll('[data-rubric]').forEach(el=>{el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));});
		document.querySelector('#accept-writing').click()`);
	assert.match(
		await evaluate('document.querySelector("#lesson-status").innerText'),
		/abgeschlossen/,
	);
	await page("Page.reload");
	for (let i = 0; i < 60; i++) {
		if (await evaluate('!!document.querySelector("#draft")')) break;
		await new Promise((resolve) => setTimeout(resolve, 25));
	}
	assert.match(
		await evaluate('document.querySelector("#draft").value'),
		/Donau/,
	);

	await navigate("#lesson=energie-vor-ort&level=2");
	await evaluate(`document.querySelector('[data-scenario="efficient"]').click();
		const hours = document.querySelector('[data-model-hours]'); hours.value = '8';
		hours.dispatchEvent(new Event('change',{bubbles:true}));`);
	assert.match(
		await evaluate(
			`document.querySelector('.exploration [role=status]').textContent`,
		),
		/10 W · 8 h = 0,08 kWh/,
	);

	await navigate("#lesson=europa-laenderprojekt");
	await evaluate(`const country = document.querySelector('[data-project="countryName"]'); country.value = 'Spanien';
		country.dispatchEvent(new Event('input',{bubbles:true}));`);
	await navigate("#lesson=aktuelles-quellen");
	assert.ok(
		await evaluate(
			`['event','sourceA','sourceB'].every((id) => document.querySelector('[data-project="'+id+'"]'))`,
		),
	);
	await navigate("#lesson=europa-laenderprojekt");
	assert.equal(
		await evaluate(
			'document.querySelector("[data-project=countryName]").value',
		),
		"Spanien",
	);

	await page("Emulation.setDeviceMetricsOverride", {
		width: 390,
		height: 844,
		deviceScaleFactor: 1,
		mobile: true,
	});
	await navigate("#view=path");
	assert.equal(await evaluate("document.documentElement.scrollWidth"), 390);
	await screenshot("path-mobile");
	for (const lesson of lessons) {
		await navigate(`#lesson=${lesson.id}&level=1`);
		assert.ok(
			await evaluate("document.documentElement.scrollWidth <= innerWidth"),
			`mobile overflow: ${lesson.id}`,
		);
	}
	await navigate("#lesson=klimadiagramm");
	assert.equal(
		await evaluate('document.querySelector(".diagram-scroll").tabIndex'),
		0,
	);
	assert.ok(
		await evaluate(
			'document.querySelector(".diagram-scroll").scrollWidth > document.querySelector(".diagram-scroll").clientWidth',
		),
	);
	await screenshot("climate-mobile");
	assert.equal(errors.length, 0, JSON.stringify(errors[0]));
	assert.deepEqual(
		requests.filter((url) => /^https?:/.test(url)),
		[],
	);
	console.log(
		`Opened ${pages} desktop lesson/level/theme combinations and ${lessons.length} mobile lessons. Checked ${scenarioChanges} model selections, both reference views, the ZAM card count, river-mouth labels, state search, draft restoration and project inputs. Images: ${output}`,
	);
} finally {
	chrome.kill();
}
