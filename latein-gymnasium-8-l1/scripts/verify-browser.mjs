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
const output = process.env.BROWSER_QA_DIR ?? "/private/tmp/zam-l8-browser";
mkdirSync(output, { recursive: true });

const lessons = [];
for (let i = 1; i <= 8; i++) {
	lessons.push(
		...JSON.parse(readFileSync(join(root, `src/curriculum/stage-${i}.json`), "utf8")),
	);
}

const profile = mkdtempSync(join(tmpdir(), "zam-latein8-browser-"));
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
		await evaluate('document.querySelectorAll(".stage-icon svg").length'),
		8,
	);

	const screenshotLessons = new Set([
		"l8-wortschatz-kontext",
		"l8-deponentien-i-kons",
		"l8-gerundiv-praedikativ",
		"l8-nci-aufbau",
		"l8-deliberativ-potentialis",
		"l8-kaiserzeit-epochen",
		"l8-limes-germanen",
		"l8-roemisches-recht-grundzuege",
		"l8-epikur-stoa",
		"l8-phaedrus-fabeln",
		"l8-satzanalyse-methoden",
	]);

	let states = 0;
	for (const theme of ["light", "dark"]) {
		await evaluate(
			`document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
		);
		await route("");
		await screenshot(`path-${theme}`);
		for (const lesson of lessons) {
			for (const level of [1, 2]) {
				await route(`#lesson=${lesson.id}&level=${level}`);
				const result = await evaluate(
					`({title:document.querySelector('main h1')?.textContent,prompt:document.querySelector('.task-prompt')?.textContent,body:document.querySelector('main')?.innerText,quiz:document.querySelectorAll('.quiz-choice').length,practice:document.querySelectorAll('.practice-input').length,goals:document.querySelectorAll('[data-workshop]').length,svgs:document.querySelectorAll('.diagram-card svg').length,over:document.documentElement.scrollWidth>innerWidth,initial:document.querySelector('#workshop-status')?.textContent})`,
				);
				assert.equal(result.title, lesson.title);
				assert.equal(result.prompt, lesson.tasks[level].prompt);
				assert.equal(result.quiz, 3);
				assert.equal(result.practice, 2);
				assert.equal(result.goals, 3);
				assert.ok(result.svgs >= 1, `${lesson.id}: missing diagram SVG`);
				assert.ok(result.initial.startsWith("0 von 3"), lesson.id);
				assert.equal(result.over, false, lesson.id);
				assert.ok(!/NaN|undefined/.test(result.body), `${lesson.id} L${level}`);
				if (level === 1 && screenshotLessons.has(lesson.id)) {
					await screenshot(`${lesson.id}-level1-${theme}`);
				}
				states++;
			}
		}
		await route("#view=reference");
		const refText = await evaluate('document.querySelector("main").innerText');
		assert.ok(refText.includes("Dativus auctoris"));
		assert.ok(refText.includes("Nominativus cum Infinitivo"));
		assert.ok(refText.includes("Römisches Recht"));
		await screenshot(`reference-${theme}`);
	}

	// Test every workshop handler across all 40 lessons
	for (const lesson of lessons) {
		await route(`#lesson=${lesson.id}&level=1`);
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

	// Interactive check on first lesson: quiz, practice, draft, rubric, dialogs, reload
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
		`var answers=${JSON.stringify(first.practice.map((p) => p.answers[0]))};document.querySelectorAll('.practice-input').forEach((el,i)=>{el.value=answers[i];});document.querySelector('#practice-form').requestSubmit()`,
	);

	// Check #storage-info modal dialog
	await evaluate('document.querySelector("#storage-info").click()');
	assert.equal(await evaluate('document.querySelector("#dialog").open'), true);
	await evaluate('document.querySelector("#close-dialog").click()');
	assert.equal(await evaluate('document.querySelector("#dialog").open'), false);

	await evaluate(
		`var draft=document.querySelector('#draft');draft.value='Der Konsul sorgt für das Gemeinwesen und fragt den Senat um Rat.';draft.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#compare').click()`,
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
		).includes("1 von 40"),
	);

	// Check #reset modal dialog safe Cancel (form method="dialog" + autofocus) keeps progress
	await evaluate('document.querySelector("#reset").click()');
	assert.equal(await evaluate('document.querySelector("#dialog").open'), true);
	assert.equal(
		await evaluate(
			'document.activeElement?.getAttribute("value") === "cancel"',
		),
		true,
	);
	await evaluate('document.querySelector("#dialog button[value=cancel]").click()');
	assert.equal(await evaluate('document.querySelector("#dialog").open'), false);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("1 von 40"),
	);

	await page("Page.reload");
	for (let i = 0; i < 100; i++) {
		if (await evaluate('!!document.querySelector("#draft")')) break;
		await new Promise((r) => setTimeout(r, 20));
	}
	assert.ok(
		(await evaluate('document.querySelector("#draft").value')).includes(
			"Gemeinwesen",
		),
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("1 von 40"),
	);
	await evaluate(
		`var draft=document.querySelector('#draft');draft.value='Eine geänderte Übersetzung ohne erneute Bestätigung.';draft.dispatchEvent(new Event('input',{bubbles:true}));`,
	);
	assert.ok(
		(
			await evaluate('document.querySelector("#progress-strip").innerText')
		).includes("0 von 40"),
	);

	// Interactive SVG labs checks (all 9 special interactive diagrams)
	await route("#lesson=l8-wortschatz-kontext&level=1");
	await evaluate('document.querySelector("[data-paen-word=gerundivum]").click()');
	assert.ok(
		(await evaluate('document.querySelector("#diagram-detail").innerText')).includes(
			"ge-run-DĪ-vum",
		),
	);

	await route("#lesson=l8-deponentien-i-kons&level=1");
	await evaluate('document.querySelector("[data-verb-kind=fieri]").click()');
	assert.ok(
		(await evaluate('document.querySelector("#vl-pres").textContent')).includes(
			"fit / fīunt",
		),
	);

	await route("#lesson=l8-gerundiv-praedikativ&level=1");
	await evaluate('document.querySelector("[data-ger-mode=auctoris]").click()');
	await evaluate('document.querySelector("[data-ger-style=idiomatisch]").click()');
	assert.ok(
		(await evaluate('document.querySelector("#gl-left-text").textContent')).includes(
			"cīvĭbus",
		),
	);
	assert.ok(
		(await evaluate('document.querySelector("#diagram-detail").innerText')).includes(
			"Gute Bürger müssen die Gesetze immer achten.",
		),
	);

	await route("#lesson=l8-nci-aufbau&level=1");
	await evaluate('document.querySelector("[data-nci-trig=videtur]").click()');
	await evaluate('document.querySelector("[data-nci-rel=vorzeitig]").click()');
	await evaluate('document.querySelector("[data-nci-style=modal]").click()');
	assert.ok(
		(await evaluate('document.querySelector("#nl-lat").textContent')).length > 10,
	);

	await route("#lesson=l8-deliberativ-potentialis&level=1");
	await evaluate('document.querySelector("[data-m8-mood=potentialis]").click()');
	assert.ok(
		(await evaluate('document.querySelector("#m8-neg").textContent')).includes(
			"non",
		),
	);
	assert.ok(
		(await evaluate('document.querySelector("#m8-lat").textContent')).includes(
			"Aliquis dicat",
		),
	);

	await route("#lesson=l8-konjunktiv-relativsatz&level=1");
	await evaluate('document.querySelector("[data-rel-sense=final]").click()');
	assert.ok(
		(await evaluate('document.querySelector("#rm-lat").textContent')).includes(
			"qui pacem peterent",
		),
	);

	await route("#lesson=l8-kaiserzeit-epochen&level=1");
	await evaluate(
		'document.querySelector("[data-kz-index=\'2\']").dispatchEvent(new MouseEvent("click",{bubbles:true}))',
	);
	assert.equal(
		await evaluate(
			'document.querySelector("[data-kz-index=\'2\']").getAttribute("aria-pressed")',
		),
		"true",
	);

	await route("#lesson=l8-limes-germanen&level=1");
	await evaluate('document.querySelector("[data-limes-layer=handel]").click()');
	for (const id of [
		"mogontiacum",
		"aalen",
		"castra-regina",
		"batavis",
		"augusta-vindelicum",
	]) {
		assert.equal(
			await evaluate(
				`document.querySelector('[data-limes-id=${id}]').style.opacity`,
			),
			"1",
		);
	}
	for (const id of ["saalburg", "biriciana", "quintana"]) {
		assert.equal(
			await evaluate(
				`document.querySelector('[data-limes-id=${id}]').style.opacity`,
			),
			"0.22",
		);
	}
	await evaluate(
		'document.querySelector("[data-limes-id=biriciana]").dispatchEvent(new MouseEvent("click",{bubbles:true}))',
	);
	assert.ok(
		(await evaluate('document.querySelector("#diagram-detail").innerText')).includes(
			"Biriciana",
		),
	);
	for (const theme of ["light", "dark"]) {
		await evaluate(
			`document.documentElement.dataset.theme=${JSON.stringify(theme)}`,
		);
		await frame();
		await screenshot(`l8-limes-handel-layer-${theme}`);
	}

	await route("#lesson=l8-roemisches-recht-grundzuege&level=1");
	await evaluate('document.querySelector("[data-recht-idx=\'2\']").click()');
	assert.equal(
		await evaluate('document.querySelector("#rl-maxim").textContent'),
		"Pacta sunt servanda",
	);

	await route("#lesson=l8-epikur-stoa&level=1");
	await evaluate(
		'document.querySelector("[data-philo-idx=\'3\']").dispatchEvent(new MouseEvent("click",{bubbles:true}))',
	);
	assert.ok(
		(await evaluate('document.querySelector("#pl-term").textContent')).includes(
			"Apatheia",
		),
	);

	// Responsive widths check
	for (const width of [390, 720]) {
		await page("Emulation.setDeviceMetricsOverride", {
			width,
			height: 844,
			deviceScaleFactor: 1,
			mobile: width === 390,
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
						"l8-gerundiv-praedikativ",
						"l8-limes-germanen",
						"reference",
					].includes(id)
				) {
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
		`ok: ${states} lesson/level/theme views; 120 goals; all 9 interactive SVG labs; modals; responsive checks at 390/720/1280 px; persistence; 0 runtime errors or network requests.`,
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
