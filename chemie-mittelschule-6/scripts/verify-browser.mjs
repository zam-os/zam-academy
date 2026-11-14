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
const output = process.env.BROWSER_QA_DIR ?? "/private/tmp/zam-chemie6-browser";
mkdirSync(output, { recursive: true });
const lessons = ["methods", "water", "soil"].flatMap((name) =>
	JSON.parse(readFileSync(`${root}/src/curriculum/lessons-${name}.json`)),
);
// A fresh browser profile keeps the verification independent of previous runs.
const profile = mkdtempSync(join(tmpdir(), "zam-chemie6-browser-"));
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
		await new Promise((resolve) => setTimeout(resolve, 25));
	}
	assert.equal(
		await evaluate('document.querySelectorAll(".lesson-link").length'),
		17,
	);
	assert.ok(
		(
			await evaluate('document.querySelector(".local-draft").innerText')
		).includes("Lokaler Entwurf"),
	);
	let states = 0,
		controls = 0;
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
			17,
		);
		await screenshot(`reference-${theme}`);
	}
	for (const l of lessons) {
		await route(`#lesson=${l.id}&level=1`);
		const choices = await evaluate(
			'Array.from(document.querySelectorAll("[data-lab-choice]")).map(b=>b.dataset.labChoice)',
		);
		for (const [i, id] of choices.entries()) {
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
				).includes(`${i + 1} / 3`),
			);
			assert.ok(
				(
					await evaluate(
						'document.querySelector("[data-lab-detail]").textContent',
					)
				).length > 60,
			);
			controls++;
		}
		await screenshot(`${l.id}-explored`);
		// Solve with the same four classification controls the learner operates.
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
			).startsWith(`${level === 1 ? 0 : 1} / 17`),
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
		).startsWith("1 / 17"),
	);
	await evaluate(
		`var d=document.querySelector('#draft');d.value='Ein geänderter eigener Entwurf zur neuen Begründung.';d.dispatchEvent(new Event('input',{bubbles:true}))`,
	);
	await frame();
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-label").textContent')
		).startsWith("0 / 17"),
	);
	await evaluate(`document.querySelector('#zam').click()`);
	assert.ok(
		(await evaluate('document.querySelector("dialog").innerText')).includes(
			"51 Karten",
		),
	);
	assert.ok(
		(await evaluate('document.querySelector("dialog").innerText')).includes(
			"lokaler Entwurf",
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
					await evaluate("document.documentElement.scrollWidth>innerWidth"),
					false,
					`overflow ${width} ${theme} ${id}`,
				);
				if (
					[
						"",
						"c6-molekuele",
						"c6-wasserzerlegung",
						"c6-bodenschutz",
						"reference",
					].includes(id)
				)
					await screenshot(`mobile-${width}-${id || "path"}-${theme}`);
			}
		}
	}
	await route("");
	await evaluate(
		`document.querySelector('#reset').click();document.querySelector('#confirm-reset').click()`,
	);
	await frame();
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-label").textContent')
		).startsWith("0 / 17"),
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
				lessons: 17,
				states,
				controls,
				workshops: 17,
				themes: ["light", "dark"],
				widths: [320, 390, 720, 1280],
				checks: [
					"two independent writing levels",
					"model controls",
					"temperature boundaries",
					"reload persistence",
					"draft invalidation",
					"local draft ZAM dialog",
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
		`ok: ${states} lesson/level/theme states, ${controls} model actions and 17 solved workshops; persistence, both writing levels, mobile layouts and reset pass; no runtime errors or external requests.`,
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
