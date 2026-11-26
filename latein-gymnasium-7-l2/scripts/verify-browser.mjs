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
const output = process.env.BROWSER_QA_DIR ?? "/private/tmp/zam-l7-browser";
mkdirSync(output, { recursive: true });
const contract = JSON.parse(
	readFileSync(`${root}/tests/fixtures/public-contract.json`, "utf8"),
);
const lessonIds = contract.map((entry) => entry.slug);

const profile = mkdtempSync(join(tmpdir(), "zam-latein7-browser-"));
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
	await evaluate(`location.hash=${JSON.stringify(hash)}`);
	await frame();
};

const KEY_SCREENSHOT_LESSONS = new Set([
	"l7-u-deklination",
	"l7-interrogativa-zahlen",
	"l7-passiv-praesens",
	"l7-aci-passiv",
	"l7-pc-adverbiale",
	"l7-indirekte-fragen",
	"l7-aussprache-betonung",
	"l7-mittelmeerraum",
	"l7-rom-karthago",
	"l7-politik-gesellschaft",
	"l7-theben-antigone",
]);

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
		40,
	);
	assert.equal(
		await evaluate('document.querySelectorAll(".stage-svg").length'),
		8,
	);

	let states = 0;
	for (const theme of ["light", "dark"]) {
		await evaluate(
			`document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
		);
		await route("");
		await screenshot(`path-${theme}`);
		for (const id of lessonIds) {
			for (const level of [1, 2]) {
				await route(`#lesson=${id}&level=${level}`);
				const result = await evaluate(
					`({title:document.querySelector('main h1')?.textContent,prompt:document.querySelector('.task-prompt')?.textContent,body:document.querySelector('main')?.innerText,quiz:document.querySelectorAll('.quiz-choice').length,practice:document.querySelectorAll('.practice-input').length,goals:document.querySelectorAll('[data-workshop]').length,svgs:document.querySelectorAll('main svg').length,over:document.documentElement.scrollWidth>innerWidth,initial:document.querySelector('#workshop-status')?.textContent})`,
				);
				assert.ok(result.title && result.title.length > 5, id);
				assert.ok(result.prompt && result.prompt.length > 25, id);
				assert.equal(result.quiz, 3, id);
				assert.equal(result.practice, 2, id);
				assert.equal(result.goals, 3, id);
				assert.ok(result.svgs >= 1, `${id}: expected inline SVG diagram`);
				assert.ok(result.initial.startsWith("0 von 3"), id);
				assert.equal(result.over, false, `${id} overflow in ${theme}`);
				assert.ok(!/\bNaN\b|\bundefined\b/.test(result.body), id);
				if (level === 1 && KEY_SCREENSHOT_LESSONS.has(id)) {
					await screenshot(`${id}-${theme}`);
				}
				states++;
			}
		}
		await route("#view=reference");
		assert.ok(
			(await evaluate('document.querySelector("main").innerText')).includes(
				"Kurzgrammatik Latein 7",
			),
		);
		await screenshot(`reference-${theme}`);
	}

	// Test Explorer Diagram interaction + live models
	await evaluate(`document.documentElement.dataset.theme="light"`);
	await route("#lesson=l7-u-deklination&level=1");
	await evaluate('document.querySelector("[data-diagram-btn=\'2\']").click()');
	assert.ok(
		(
			await evaluate('document.querySelector("[data-diagram-note]").innerText')
		).includes("cornū"),
	);

	// Test Roman numeral live SVG slider
	await route("#lesson=l7-interrogativa-zahlen&level=1");
	await evaluate(
		`var r=document.querySelector('#roman-slider');r.value='490';r.dispatchEvent(new Event('input'))`,
	);
	assert.equal(
		await evaluate('document.querySelector("#roman-out").textContent'),
		"CDXC",
	);

	// Test Active-Passive live SVG transformer
	await route("#lesson=l7-passiv-praesens&level=1");
	await evaluate('document.querySelector("[data-voice=passiv]").click()');
	assert.ok(
		(
			await evaluate('document.querySelector("#passive-svg").textContent')
		).includes("laudātur"),
	);

	// Test Consecutio temporum live SVG matrix
	await route("#lesson=l7-indirekte-fragen&level=1");
	await evaluate(
		`var g=document.querySelector('#ct-group');g.value='neben';g.dispatchEvent(new Event('change'));var r=document.querySelector('#ct-rel');r.value='vorzeitig';r.dispatchEvent(new Event('change'))`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#consecutio-readout").innerText')
		).includes("laudāvisset"),
	);

	// Test Mediterranean map layer toggle
	await route("#lesson=l7-mittelmeerraum&level=1");
	await evaluate('document.querySelector("[data-map-focus=wonders]").click()');
	assert.equal(
		await evaluate(
			'document.querySelector("[data-map-layer=provinces]").style.opacity',
		),
		"0.18",
	);

	// Responsive checks (390px and 720px)
	for (const width of [390, 720]) {
		await page("Emulation.setDeviceMetricsOverride", {
			width,
			height: 844,
			deviceScaleFactor: 1,
			mobile: width === 390,
		});
		for (const id of [
			"",
			"l7-interrogativa-zahlen",
			"l7-passiv-praesens",
			"l7-mittelmeerraum",
			"l7-politik-gesellschaft",
			"reference",
		]) {
			await route(
				id === "reference"
					? "#view=reference"
					: id
						? `#lesson=${id}&level=1`
						: "",
			);
			assert.equal(
				await evaluate("document.documentElement.scrollWidth>innerWidth"),
				false,
				`overflow ${width} ${id}`,
			);
		}
	}

	assert.deepEqual(errors, []);
	assert.deepEqual(
		requests.filter((url) => /^https?:/.test(url)),
		[],
	);
	console.log(
		`ok: ${states} lesson/level/theme views rendered cleanly; explorer diagrams and live SVG models verified; responsive checks at 390/720/1280 px passed; 0 runtime errors, 0 external requests. Screenshots in ${output}`,
	);
} finally {
	chrome.kill();
	await closed;
	rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
