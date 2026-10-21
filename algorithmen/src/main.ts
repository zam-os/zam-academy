import {
	checkCode,
	findLesson,
	LESSONS,
	lessonFromHash,
	lessonInLocale,
	lessonsForLocale,
	SOURCES,
} from "./curriculum";
import {
	type Frame,
	formatValue,
	type RunResult,
	runProgram,
	STEP_LIMIT,
	TRACE_ACTIONS,
} from "./engine";
import {
	asLocale,
	breakpointsLabel,
	chooseLineLabel,
	type Locale,
	lessonLabel,
	localeFromHash,
	progressLabel,
	runLabel,
	stageNames,
	trainingHash,
	UI,
} from "./i18n";
import {
	draftFor,
	freshProgress,
	isComplete,
	parseProgress,
	STORAGE_KEY,
	saveDraft,
	switchProgressLocale,
} from "./progress";

const escapeHtml = (text: string) =>
	text.replace(
		/[&<>"']/g,
		(c) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				c
			]!,
	);
let storageAvailable = true;
let progress = (() => {
	try {
		return parseProgress(localStorage.getItem(STORAGE_KEY));
	} catch {
		storageAvailable = false;
		return freshProgress();
	}
})();
let locale: Locale = localeFromHash(location.hash, progress.locale);
progress.locale = locale;
let current =
	lessonFromHash(location.hash, locale) ?? lessonsForLocale(locale)[0];
let view: "path" | "lesson" = lessonFromHash(location.hash, locale)
	? "lesson"
	: "path";
let frames: Frame[] = [],
	at = 0,
	breakpoints = new Set<number>();
let languageNotice = false;
function save() {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
	} catch {
		storageAvailable = false;
		const note = document.querySelector("#storage-note");
		if (note) note.textContent = UI[locale].storage;
	}
}
function captureDraft() {
	const editor = document.querySelector<HTMLTextAreaElement>("#editor");
	if (view === "lesson" && editor)
		saveDraft(progress, locale, current.id, editor.value);
}
function clearRun() {
	frames = [];
	at = 0;
	breakpoints.clear();
}
function showPath() {
	captureDraft();
	save();
	view = "path";
	history.replaceState(null, "", trainingHash(null, locale));
	clearRun();
	languageNotice = false;
	render();
}
function navigate(id: string) {
	const lesson = findLesson(id, locale);
	if (!lesson) return;
	captureDraft();
	save();
	current = lesson;
	view = "lesson";
	history.pushState(null, "", trainingHash(id, locale));
	clearRun();
	languageNotice = false;
	render();
	document.querySelector<HTMLElement>("main")?.focus();
}
function changeLanguage(target: Locale) {
	const editor = document.querySelector<HTMLTextAreaElement>("#editor");
	progress = switchProgressLocale(
		progress,
		target,
		view === "lesson" ? current.id : null,
		editor?.value,
	);
	locale = target;
	current = lessonInLocale(current, locale);
	history.replaceState(
		null,
		"",
		trainingHash(view === "lesson" ? current.id : null, locale),
	);
	clearRun();
	languageNotice = true;
	save();
	render();
}
function render() {
	const t = UI[locale],
		done = LESSONS.filter((lesson) => isComplete(progress, lesson.id)).length;
	document.documentElement.lang = locale;
	document.title =
		locale === "en"
			? "Algorithms & Programming · ZAM Academy"
			: "Algorithmen & Programmieren · ZAM Academy";
	document.querySelector<HTMLDivElement>("#app")!.innerHTML =
		`<header><a class="brand" href="#" id="home"><span class="mark" aria-hidden="true">{ }</span><span>${t.brand}<small>${t.tagline}</small></span></a><div class="header-actions"><label class="language-select" for="locale"><span class="sr-only">${t.language}</span><select id="locale" aria-label="${t.language}"><option value="de" ${locale === "de" ? "selected" : ""}>Deutsch</option><option value="en" ${locale === "en" ? "selected" : ""}>English</option></select></label><button id="path">${t.path}</button><button id="help">${t.help}</button><button id="zam" class="primary">${t.zam}</button></div></header><div class="progress-strip"><span>${progressLabel(locale, done, LESSONS.length)}</span><progress value="${done}" max="${LESSONS.length}" aria-label="${t.progress}"></progress><button id="reset" class="text-button">${t.reset}</button></div><main tabindex="-1">${languageNotice ? `<p class="language-notice" role="status">${t.languageChanged}</p>` : ""}${view === "path" ? pathHtml() : lessonHtml()}</main><footer><span>${t.footerScope}</span><span>${t.privacy}</span><span id="storage-note" role="status">${storageAvailable ? "" : t.storage}</span><a href="${SOURCES[0].url}" target="_blank" rel="noopener">${t.official}</a></footer><dialog id="dialog"><div id="dialog-body"></div><button id="close-dialog" class="primary">${t.close}</button></dialog>`;
	document.querySelector("#home")!.addEventListener("click", (event) => {
		event.preventDefault();
		showPath();
	});
	document.querySelector("#path")!.addEventListener("click", showPath);
	document
		.querySelector<HTMLSelectElement>("#locale")!
		.addEventListener("change", (event) =>
			changeLanguage(asLocale((event.target as HTMLSelectElement).value)),
		);
	document.querySelector("#help")!.addEventListener("click", syntaxHelp);
	document
		.querySelector("#zam")!
		.addEventListener("click", () =>
			showDialog(
				`<h2>${t.zamTitle}</h2><p>${t.zamIntro}</p><p>${t.zamLinks}</p><p>${t.zamOnlyCards}</p>${locale === "en" ? "<p>The current ZAM cards for this package are in German.</p>" : ""}`,
			),
		);
	document
		.querySelector("#close-dialog")!
		.addEventListener("click", () =>
			document.querySelector<HTMLDialogElement>("#dialog")!.close(),
		);
	document.querySelector("#reset")!.addEventListener("click", () => {
		showDialog(
			`<h2>${t.resetTitle}</h2><p>${t.resetText}</p><button id="confirm-reset" class="danger">${t.confirmReset}</button>`,
		);
		document.querySelector("#confirm-reset")!.addEventListener("click", () => {
			progress = freshProgress();
			progress.locale = locale;
			save();
			clearRun();
			render();
		});
	});
	document.querySelectorAll<HTMLElement>("[data-lesson]").forEach((button) => {
		button.addEventListener("click", () => navigate(button.dataset.lesson!));
	});
	if (view === "lesson") bindLesson();
}
function pathHtml() {
	const t = UI[locale],
		lessons = lessonsForLocale(locale),
		counter = locale === "en" ? "score" : "punkte";
	return `<section class="hero"><div><div class="eyebrow">${t.eyebrow}</div><h1>${t.heroTitle}<br><em>${t.heroEm}</em></h1><p>${t.heroText}</p><button class="primary large" data-lesson="${(lessons.find((l) => !isComplete(progress, l.id)) ?? lessons[0]).id}">${progress.completed.length ? t.continue : t.start} <span aria-hidden="true">→</span></button><p class="small">${t.heroMeta}</p></div><div class="hero-code" aria-label="${t.exampleLabel}"><div class="code-toolbar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span>${t.firstIdea}</span></div><pre><span class="code-muted">${t.exampleComment}</span>\n<span class="code-keyword">let</span> ${counter} = <span class="code-number">0</span>;\n<span class="code-keyword">for</span> (let i = 1; i &lt;= 3; i = i + 1) {\n  ${counter} = ${counter} + i;\n}\n<span class="code-call">print</span>(${counter});</pre><div class="code-output">${t.output} <strong>6</strong><span>${t.traceable}</span></div></div></section><aside class="scope-note"><strong>${t.scope}</strong><p>${t.scopeText}</p></aside><section class="path-grid">${stageNames[
		locale
	]
		.map(
			(stage, i) =>
				`<article class="stage"><div class="eyebrow">${t.stage} ${i + 1}</div><h2>${stage}</h2><div class="lesson-list">${lessons
					.filter((l) => l.stage === i)
					.map(
						(lesson) =>
							`<button data-lesson="${lesson.id}" class="lesson-row"><span class="lesson-state ${isComplete(progress, lesson.id) ? "done" : ""}" aria-label="${isComplete(progress, lesson.id) ? t.complete : t.open}">${isComplete(progress, lesson.id) ? "✓" : String(lessons.indexOf(lesson) + 1).padStart(2, "0")}</span><span>${escapeHtml(lesson.title)}<small>${escapeHtml(lesson.goal)}</small></span><span aria-hidden="true">→</span></button>`,
					)
					.join("")}</div></article>`,
		)
		.join(
			"",
		)}</section><section class="final-note"><h2>${t.ownWorkTitle}</h2><p>${t.ownWorkText}</p></section>`;
}
function lessonHtml() {
	const t = UI[locale],
		lessons = lessonsForLocale(locale),
		index = lessons.indexOf(current);
	return `<div class="lesson-heading"><div><div class="eyebrow">${lessonLabel(locale, current.stage + 1, index + 1, lessons.length)}</div><h1>${escapeHtml(current.title)}</h1><p>${escapeHtml(current.goal)}</p></div><div class="pager"><button ${index ? `data-lesson="${lessons[index - 1].id}"` : "disabled"} aria-label="${t.previous}">←</button><button ${index < lessons.length - 1 ? `data-lesson="${lessons[index + 1].id}"` : "disabled"} aria-label="${t.next}">→</button></div></div><div class="lesson-grid"><div><section class="panel reading"><span class="tag">${t.understand}</span>${current.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}<h2>${t.model}</h2><ol class="flow">${current.model.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol><p class="small">${t.modelNote}</p></section><section class="panel quiz"><span class="tag">${t.quickCheck}</span><h2>${escapeHtml(current.question)}</h2><fieldset><legend class="sr-only">${t.choose}</legend>${current.options.map((option, i) => `<label><input type="radio" name="quiz" value="${i}"> <span>${escapeHtml(option)}</span></label>`).join("")}</fieldset><button id="check-quiz">${t.checkAnswer}</button><div id="quiz-feedback" role="status">${progress.quiz.includes(current.id) ? t.quizAlready : ""}</div></section><section class="panel completion"><h2>${t.practiceStatus}</h2><p id="completion-status">${completionText()}</p><button class="primary" ${index < lessons.length - 1 ? `data-lesson="${lessons[index + 1].id}"` : `id="back-path"`}>${index < lessons.length - 1 ? t.nextLesson : t.backPath}</button></section></div><section class="panel workshop"><div class="workshop-heading"><span class="tag">${t.workshop}</span><span class="language-badge">${t.subset}</span></div><h2>${t.yourTurn}</h2><p>${escapeHtml(current.task)}</p><p class="small">${t.readPrint}</p><p class="small">${t.codeLocale}</p><label class="editor-label" for="editor">${t.program}</label><textarea id="editor" spellcheck="false" autocomplete="off" autocapitalize="off" aria-describedby="editor-help">${escapeHtml(draftFor(progress, locale, current.id) ?? current.starter)}</textarea><div class="small" id="editor-help">${t.editorHelp}</div><div class="toolbar"><button id="run" class="primary">${t.run}</button><button id="check-code">${t.allTests}</button><button id="restart" class="text-button">${t.template}</button></div><div class="workshop-details"><details><summary>${t.hint}</summary><p>${escapeHtml(current.hint)}</p></details><details><summary>${t.solution}</summary><pre>${escapeHtml(current.solution)}</pre><p>${t.solutionNote}</p></details></div><div id="run-feedback" class="run-feedback" role="status"></div><div class="console"><h3>${t.output} <small>Test 1 · ${t.inputs} ${escapeHtml(JSON.stringify(current.tests[0].inputs))}</small></h3><pre id="output">${t.notRun}</pre></div><section class="trace"><h3>${t.stepByStep}</h3><p class="small">${t.traceNote}</p><div class="toolbar"><button id="trace-prev" disabled>${t.stepBack}</button><button id="trace-next" disabled>${t.stepNext}</button><button id="trace-continue" disabled>${t.untilBreakpoint}</button></div><label for="breakpoint">${t.breakpoint}</label><input id="breakpoint" type="number" min="1" max="500" value="1"><button id="breakpoint-toggle">${t.toggleBreakpoint}</button><span id="breakpoint-status" class="small" role="status">${t.noBreakpoint}</span><div id="trace-state" aria-live="polite"><p>${t.runFirst}</p></div></section></section></div>`;
}
function refreshHeaderProgress() {
	const done = LESSONS.filter((lesson) =>
		isComplete(progress, lesson.id),
	).length;
	document.querySelector(".progress-strip span")!.textContent = progressLabel(
		locale,
		done,
		LESSONS.length,
	);
	document.querySelector<HTMLProgressElement>("progress")!.value = done;
}
function completionText() {
	const t = UI[locale];
	return isComplete(progress, current.id)
		? t.bothDone
		: `${progress.quiz.includes(current.id) ? "✓" : "○"} ${t.quizStatus} · ${progress.completed.includes(current.id) ? "✓" : "○"} ${t.codeStatus}`;
}
const runError = (result: RunResult) =>
	`${UI[locale].line} ${result.error?.line}: ${result.error?.messages[locale] ?? UI[locale].error}`;
function bindLesson() {
	const t = UI[locale],
		editor = document.querySelector<HTMLTextAreaElement>("#editor")!;
	editor.addEventListener("input", () => {
		saveDraft(progress, locale, current.id, editor.value);
		save();
	});
	editor.addEventListener("keydown", (event) => {
		if (event.key === "Tab") {
			event.preventDefault();
			editor.setRangeText(
				"  ",
				editor.selectionStart,
				editor.selectionEnd,
				"end",
			);
			editor.dispatchEvent(new Event("input"));
		}
	});
	document.querySelector("#check-quiz")!.addEventListener("click", () => {
		const choice = document.querySelector<HTMLInputElement>(
				'input[name="quiz"]:checked',
			),
			feedback = document.querySelector("#quiz-feedback")!;
		if (!choice) {
			feedback.textContent = t.chooseFirst;
			return;
		}
		const right = Number(choice.value) === current.correct;
		feedback.textContent =
			(right ? t.correct : t.incorrect) + current.explanation;
		feedback.className = right ? "success" : "error";
		if (right && !progress.quiz.includes(current.id))
			progress.quiz.push(current.id);
		save();
		document.querySelector("#completion-status")!.textContent =
			completionText();
		refreshHeaderProgress();
	});
	document.querySelector("#restart")!.addEventListener("click", () => {
		editor.value = current.starter;
		editor.dispatchEvent(new Event("input"));
		frames = [];
		updateTrace();
		document.querySelector("#run-feedback")!.textContent = t.templateLoaded;
	});
	document.querySelector("#run")!.addEventListener("click", () => {
		const result = runProgram(
			editor.value,
			current.tests[0].inputs,
			STEP_LIMIT,
			locale,
		);
		frames = result.trace;
		at = 0;
		document.querySelector("#output")!.textContent =
			result.output.join("\n") || t.noOutput;
		const feedback = document.querySelector("#run-feedback")!;
		feedback.textContent = result.ok
			? runLabel(locale, result.steps, result.trace.length)
			: runError(result);
		feedback.className = `run-feedback ${result.ok ? "" : "error"}`;
		updateTrace();
	});
	document.querySelector("#check-code")!.addEventListener("click", () => {
		const result = checkCode(current, editor.value, locale),
			feedback = document.querySelector("#run-feedback")!;
		feedback.innerHTML = `<strong>${result.passed ? t.testsPassed : t.testsFailed}</strong><ul>${result.results.map((run, i) => `<li>Test ${i + 1} · ${t.inputs} ${escapeHtml(JSON.stringify(current.tests[i].inputs))}: ${run.ok ? `${t.expected} ${escapeHtml(JSON.stringify(current.tests[i].expected))}, ${t.actual} ${escapeHtml(JSON.stringify(run.output))}` : escapeHtml(runError(run))}</li>`).join("")}</ul>`;
		feedback.className = `run-feedback ${result.passed ? "success" : "error"}`;
		if (result.passed && !progress.completed.includes(current.id))
			progress.completed.push(current.id);
		save();
		document.querySelector("#completion-status")!.textContent =
			completionText();
		refreshHeaderProgress();
	});
	document.querySelector("#trace-prev")!.addEventListener("click", () => {
		at--;
		updateTrace();
	});
	document.querySelector("#trace-next")!.addEventListener("click", () => {
		at++;
		updateTrace();
	});
	document.querySelector("#trace-continue")!.addEventListener("click", () => {
		if (at < frames.length - 1)
			do {
				at++;
			} while (at < frames.length - 1 && !breakpoints.has(frames[at].line));
		updateTrace();
	});
	document
		.querySelector("#breakpoint-toggle")!
		.addEventListener("click", () => {
			const line = Number(
					document.querySelector<HTMLInputElement>("#breakpoint")!.value,
				),
				count = editor.value.split("\n").length;
			if (!Number.isInteger(line) || line < 1 || line > count) {
				document.querySelector("#breakpoint-status")!.textContent =
					chooseLineLabel(locale, count);
				return;
			}
			if (breakpoints.has(line)) breakpoints.delete(line);
			else breakpoints.add(line);
			document.querySelector("#breakpoint-status")!.textContent =
				breakpoints.size
					? breakpointsLabel(
							locale,
							[...breakpoints].sort((a, b) => a - b),
						)
					: t.noBreakpoint;
		});
	document.querySelector("#back-path")?.addEventListener("click", showPath);
}
function updateTrace() {
	const t = UI[locale];
	at = Math.max(0, Math.min(at, frames.length - 1));
	for (const [id, disabled] of [
		["trace-prev", at <= 0],
		["trace-next", !frames.length || at >= frames.length - 1],
		["trace-continue", !frames.length || at >= frames.length - 1],
	] as const)
		document.querySelector<HTMLButtonElement>(`#${id}`)!.disabled = disabled;
	const frame = frames[at],
		element = document.querySelector("#trace-state")!;
	if (!frame) {
		element.innerHTML = `<p>${t.runFirst}</p>`;
		return;
	}
	element.innerHTML = `<p><strong>${t.state} ${at + 1} / ${frames.length} · ${t.line} ${frame.line}</strong><br>${escapeHtml(TRACE_ACTIONS[frame.actionKey][locale])}</p><table><caption>${t.variables}</caption><thead><tr><th>${t.name}</th><th>${t.value}</th></tr></thead><tbody>${
		Object.entries(frame.variables)
			.map(
				([name, value]) =>
					`<tr><td>${escapeHtml(name)}</td><td>${escapeHtml(formatValue(value))}</td></tr>`,
			)
			.join("") || `<tr><td colspan="2">${t.noVariables}</td></tr>`
	}</tbody></table><p class="small">${t.outputSoFar}: ${escapeHtml(JSON.stringify(frame.output))}</p>`;
}
function showDialog(html: string) {
	document.querySelector("#dialog-body")!.innerHTML = html;
	document.querySelector<HTMLDialogElement>("#dialog")!.showModal();
}
function syntaxHelp() {
	const t = UI[locale],
		name = locale === "en" ? "doubleValue" : "doppelt";
	showDialog(
		`<h2>${t.syntaxTitle}</h2><p>${escapeHtml(t.syntaxScope)}</p><pre>let n = read();\nfunction ${name}(x) {\n  return x * 2;\n}\nprint(${name}(n));</pre><p>${t.syntaxHelpers}</p><p>${t.syntaxLimits}</p><p>${t.syntaxResources}</p><p>${t.syntaxTests}</p>${SOURCES.map((source, i) => `<p><a href="${source.url}" target="_blank" rel="noopener">${i === 0 ? t.sourceCurriculum : t.sourceStandard} ↗</a></p>`).join("")}`,
	);
}
function missingLesson() {
	const t = UI[locale];
	showDialog(`<h2>${t.missingTitle}</h2><p>${t.missingText}</p>`);
}
window.addEventListener("hashchange", () => {
	captureDraft();
	locale = localeFromHash(location.hash, locale);
	progress.locale = locale;
	// An unknown lesson keeps the current one, but it must belong to the new locale.
	current = lessonInLocale(current, locale);
	const lesson = lessonFromHash(location.hash, locale);
	if (lesson) {
		current = lesson;
		view = "lesson";
		clearRun();
		languageNotice = false;
		save();
		render();
	} else if (new URLSearchParams(location.hash.slice(1)).has("lesson")) {
		render();
		missingLesson();
	} else {
		view = "path";
		clearRun();
		save();
		render();
	}
});
save();
render();
if (
	new URLSearchParams(location.hash.slice(1)).has("lesson") &&
	!lessonFromHash(location.hash, locale)
)
	missingLesson();
