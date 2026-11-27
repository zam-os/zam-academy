import "./styles.css";
import {
	CORE_LESSONS,
	findLesson,
	LESSONS,
	SOURCES,
	STAGES,
} from "./curriculum";
import {
	bindFigure,
	renderFigure,
	renderStageArt,
	STEP_ICONS,
	stageIcon,
} from "./figures";
import {
	canAccept,
	canReview,
	checkPractice,
	esc,
	practiceFeedback,
	quizFeedback,
	quizOptions,
} from "./practice";
import { readLocalScript, waitForLocalVoice } from "./recitation";
import {
	completion,
	isComplete,
	loadProgress,
	markSyntheticRecitation,
	mergeProgress,
	resetProgress,
	STORAGE_KEY,
	saveProgress,
	setPartnerRecitation,
	updateDraft,
	writingKey,
} from "./storage/progress";
import type { Lesson, Level } from "./types";
import { bindWorkshop, renderWorkshop } from "./workshop";
import {
	parseTrainingDeepLink,
	trainingBaseUrl,
	ZAM_CELL_ID,
} from "./zam/zam-link";

function practicePrompt(prompt: string): string {
	const hint = prompt.match(/^(.*) \(([^)]*)\)$/);
	if (!hint) return `<span lang="la">${esc(prompt)}</span>`;
	return `<span lang="la">${esc(hint[1])}</span> <span class="small">(${esc(hint[2])})</span>`;
}
function required<T>(value: T | undefined | null): T {
	if (value == null)
		throw new Error("An expected page element or lesson is missing.");
	return value;
}
function element<T extends Element = HTMLElement>(selector: string): T {
	return required(document.querySelector<T>(selector));
}

const main = element<HTMLElement>("#main");
const dialog = element<HTMLDialogElement>("#dialog");
let progress = loadProgress();
let baseline = structuredClone(progress);
let view: "path" | "lesson" | "reference" = "path";
let routeNotice = "";
const practiceAnswers = new Map<string, string[]>();
const figureFocus = new Map<string, number>();
let speechSession = 0;
let voiceRequest: AbortController | undefined;

function persist(): void {
	const saved = saveProgress(progress, baseline);
	if (saved) baseline = structuredClone(progress);
	element<HTMLElement>("#storage-warning").hidden = saved;
	syncSavedState();
	renderStats();
}

/** Update saved evidence without replacing an open form or its focus. */
function syncSavedState(): void {
	if (view !== "lesson") return;
	const id = progress.activeLessonId;
	const draft = document.querySelector<HTMLTextAreaElement>("#draft");
	if (draft) {
		const key = writingKey(id, progress.level);
		const saved = progress.drafts[key] ?? "";
		if (draft.value !== saved) {
			draft.value = saved;
			element<HTMLButtonElement>("#compare").disabled = !canReview(saved);
			element("#comparison").innerHTML = "";
		}
		element("#writing-status").textContent = progress.writingDone.includes(key)
			? "Eigener Mustervergleich gespeichert."
			: canReview(saved)
				? "Entwurf geändert · bitte mit einem Muster vergleichen."
				: "";
	}
	const partner = document.querySelector<HTMLInputElement>("#partner-listened");
	if (partner) {
		const evidence = progress.recitation[id];
		partner.checked = evidence?.partner === true;
		const modes = [
			evidence?.synthetic ? "lokale Computerstimme" : "",
			evidence?.partner ? "Partner hat mitgelesen" : "",
		].filter(Boolean);
		element("#listened-status").textContent = modes.length
			? `Vortragsübung gespeichert: ${modes.join(" und ")}.`
			: "Vortragsübung noch offen.";
	}
}
function renderStats(): void {
	const count = completion(progress);
	element("#progress-strip").innerHTML =
		`<label for="path-progress">Kernpfad: ${count.completed} von ${count.total} geübt</label><progress id="path-progress" value="${count.completed}" max="${count.total}">${count.percent}%</progress>`;
}
function cancelSpeech(): void {
	speechSession++;
	voiceRequest?.abort();
	voiceRequest = undefined;
}
function pageUrl(): string {
	return trainingBaseUrl(location.pathname, location.search);
}
function navigate(id?: string): void {
	routeNotice = "";
	cancelSpeech();
	if (id && findLesson(id)) {
		progress.activeLessonId = id;
		if (findLesson(id)?.optional) progress.includeFoundations = true;
		view = "lesson";
		history.replaceState(
			null,
			"",
			`${pageUrl()}#lesson=${id}&level=${progress.level}`,
		);
	} else {
		view = id === "reference" ? "reference" : "path";
		history.replaceState(
			null,
			"",
			`${pageUrl()}${view === "reference" ? "#view=reference" : ""}`,
		);
	}
	persist();
	render();
	main.focus();
	window.scrollTo({ top: 0, behavior: "instant" });
}
function render(): void {
	document
		.querySelectorAll<HTMLButtonElement>("[data-view]")
		.forEach((button) => {
			if (
				button.dataset.view === view ||
				(view === "lesson" && button.dataset.view === "path")
			)
				button.setAttribute("aria-current", "page");
			else button.removeAttribute("aria-current");
		});
	renderStats();
	if (view === "lesson")
		renderLesson(required(findLesson(progress.activeLessonId)));
	else if (view === "reference") renderReference();
	else renderPath();
}
function renderPath(): void {
	const next =
		CORE_LESSONS.find((lesson) => !isComplete(progress, lesson.id)) ??
		CORE_LESSONS[0];
	main.innerHTML = `${routeNotice ? `<p class="notice" role="status">${esc(routeNotice)}</p>` : ""}
    <section class="hero"><div><div class="eyebrow">Gymnasium Bayern · 6. Klasse (1. Fremdsprache)</div><h1>Latein zwischen Republik,<br>Vesuv und Verwandlung.</h1><p>Erkunde Passiv, Konjunktiv Präteritum und Partizipien (PPA &amp; PPP), erschließe Italiens Geschichte auf der Karte und begegne Plinius d. J. sowie Ovids Mythen. 44 Schaubilder und interaktive Werkstätten machen jede Form und Satzklammer sichtbar.</p><button type="button" class="button accent" id="continue">${completion(progress).completed ? "Weiterüben" : "Mit Latein 6 starten"} <span aria-hidden="true">↗</span></button><p class="small">44 Lektionen · 132 Entdeckerziele · 44 Schaubilder · dein Lateinpfad für Klasse 6</p></div>
    <aside class="hero-note"><div class="eyebrow">Dein nächster Schritt</div><strong>${esc(next.title)}</strong><p>Erst verstehen und im Schaubild entdecken, dann Formen bilden und selbst übersetzen, bevor du ein Muster vergleichst.</p><span class="small">Ohne Konto · Fortschritt in diesem Browser</span></aside></section>
    <div class="path-heading"><div><h2>Dein Lernpfad</h2><p>Sprachliche Basis, Romkultur und Methodik greifen ineinander. Du kannst jede Lektion direkt öffnen.</p></div><label class="toggle" hidden><input id="foundations" type="checkbox" ${progress.includeFoundations ? "checked" : ""}>Ergänzungen zeigen</label></div>
    <div class="stages">${STAGES.filter(
			(stage) => !stage.optional || progress.includeFoundations,
		)
			.map((stage) => {
				const lessons = LESSONS.filter((lesson) => lesson.stage === stage.id);
				return `<section class="stage" style="--stage-hue:${stage.hue}"><div class="stage-header"><span class="stage-icon" aria-hidden="true">${stageIcon(stage.id)}</span><div><h3>${esc(stage.title)}</h3><span class="small">${esc(stage.subtitle)}</span></div><span class="stage-count">${lessons.filter((lesson) => isComplete(progress, lesson.id)).length}/${lessons.length}</span></div>${renderStageArt(stage.id)}<ol>${lessons.map((lesson) => `<li><button type="button" class="lesson-link ${isComplete(progress, lesson.id) ? "complete" : ""}" data-lesson="${lesson.id}"><span class="lesson-dot" aria-hidden="true">${isComplete(progress, lesson.id) ? "✓" : ""}</span><span><strong>${esc(lesson.title)}</strong><small>${esc(lesson.skill)}</small></span><span class="lesson-status">${isComplete(progress, lesson.id) ? "Geübt" : "Öffnen →"}</span></button></li>`).join("")}</ol></section>`;
			})
			.join(
				"",
			)}</div><aside class="notice"><strong>Üben ist mehr als ein Häkchen.</strong><p>Der Fortschritt zählt deine App-Aufgaben und deinen Mustervergleich. Das laufende Einprägen des Grundwortschatzes (ca. 900 Wörter bis Ende Klasse 6), das laute Vortragen und gemeinsame Gespräche im Unterricht gehören zusätzlich dazu.</p></aside>`;
	document
		.querySelector("#continue")
		?.addEventListener("click", () => navigate(next.id));
	document
		.querySelector<HTMLInputElement>("#foundations")
		?.addEventListener("change", (event) => {
			progress.includeFoundations = (event.target as HTMLInputElement).checked;
			persist();
			renderPath();
		});
	main
		.querySelectorAll<HTMLButtonElement>("[data-lesson]")
		.forEach(
			(button) =>
				void button.addEventListener("click", () =>
					navigate(button.dataset.lesson),
				),
		);
}
function renderLesson(lesson: Lesson): void {
	const task = lesson.tasks[progress.level];
	const key = writingKey(lesson.id, progress.level);
	const stage = required(STAGES.find((entry) => entry.id === lesson.stage));
	const visible = progress.includeFoundations ? LESSONS : CORE_LESSONS;
	const index = visible.findIndex((entry) => entry.id === lesson.id);
	const focus = figureFocus.get(lesson.id) ?? 0;
	main.innerHTML = `<div class="lesson-top"><button type="button" class="text-button" id="back">← Zum Lernpfad</button><label class="level-select" for="level">Aufgabenstufe <select id="level"><option value="1" ${progress.level === 1 ? "selected" : ""}>Level 1 · Anwenden</option><option value="2" ${progress.level === 2 ? "selected" : ""}>Level 2 · Transfer</option></select></label></div>
    <div class="lesson-heading" style="--stage-hue:${stage.hue}"><div class="eyebrow">${esc(stage.title)}${lesson.optional ? " · freiwillige Ergänzung" : ""}</div><h1>${esc(lesson.title)}</h1><p class="intro">${esc(lesson.skill)}</p></div>
    <div class="lesson-columns" style="--stage-hue:${stage.hue}"><div class="lesson-content"><section class="panel"><div class="eyebrow">${STEP_ICONS.read}<span>1 · Verstehen</span></div><h2>Erklärung und Material</h2>${lesson.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}<div class="document"><strong>${esc(lesson.materialLabel)}</strong><blockquote lang="${lesson.materialLanguage}" class="material">${esc(lesson.material)}</blockquote></div>${renderFigure(lesson.id, focus)}<div class="takeaway"><strong>Merke</strong><p>${esc(lesson.takeaway)}</p></div></section>
    ${renderWorkshop(lesson)}
    ${lesson.recitation ? `<section class="panel" id="recitation-panel"><div class="panel-heading"><h2>${STEP_ICONS.voice} Laut lesen und vortragen</h2><span class="done-mark" id="listened-status"></span></div><p class="small">Die App nutzt ausschließlich eine auf deinem Gerät bereits installierte Stimme. Ist keine passende Stimme vorhanden, lies den Text laut mit einem Lernpartner.</p><div class="self-actions"><button type="button" class="button secondary" id="listen">Mit lokaler Stimme anhören</button><button type="button" class="button secondary" id="stop-listen">Stopp</button></div><p class="small" id="voice-status" role="status"></p><details id="transcript" open><summary>Text zum Mitlesen</summary><p lang="${lesson.materialLanguage}" class="material">${esc(lesson.material)}</p></details><label class="toggle"><input type="checkbox" id="partner-listened" ${progress.recitation[lesson.id]?.partner ? "checked" : ""}>Ich habe den Text mit einem Partner laut gelesen und die Betonung geprüft.</label></section>` : ""}
    <section class="panel"><div class="panel-heading"><h2>Kurzcheck</h2><span class="done-mark">${progress.quizDone.includes(lesson.id) ? "✓ gelöst" : ""}</span></div><p>${esc(lesson.quiz.question)}</p><div class="quiz-options">${quizOptions(lesson).map((option) => `<button type="button" class="quiz-choice" lang="${lesson.quiz.optionLanguage}">${esc(option)}</button>`).join("")}</div><div id="quiz-feedback" role="status"></div></section>
    <section class="panel"><div class="panel-heading"><h2>Formen und Sätze üben</h2><span class="done-mark">${progress.practiceDone.includes(lesson.id) ? "✓ gelöst" : ""}</span></div><form id="practice-form">${lesson.practice.map((item, itemIndex) => `<label class="practice-label" for="practice-${itemIndex}">${itemIndex + 1}. ${practicePrompt(item.prompt)}</label><input class="practice-input" id="practice-${itemIndex}" value="${esc(practiceAnswers.get(lesson.id)?.[itemIndex] ?? "")}" autocomplete="off" autocapitalize="none" spellcheck="false">`).join("")}<p class="small">Hinweis: Längenzeichen (Makrons wie ā, ē, ī, ō, ū) darfst du eingeben oder weglassen.</p><button type="submit" class="button accent">Antworten prüfen</button><div id="practice-feedback" role="status"></div></form></section>
    <section class="panel"><h2>Selbst formulieren und übersetzen · Level ${progress.level}</h2><p class="task-prompt">${esc(task.prompt)}</p><label class="answer-label" for="draft">Dein Entwurf</label><textarea id="draft" maxlength="8000" rows="7" aria-describedby="draft-note">${esc(progress.drafts[key] ?? "")}</textarea><span id="draft-note" class="small">Mindestens 20 Zeichen öffnen den Mustervergleich. Das ist keine automatische Bewertung; eigene gute Lösungen können anders formuliert sein.</span><details class="draft-info small"><summary><span aria-hidden="true">ⓘ</span> Wo bleibt mein Text?</summary><p>Dein Text bleibt nur in diesem Browser auf diesem Gerät. Die App liest, bewertet oder verschickt ihn nicht. Der Browser trennt ihn nach Benutzerkonto, Browser und Profil und gleicht ihn nicht ab. Hast du dein eigenes Benutzerkonto oder teilst du es mit anderen? Falls du es teilst, lösche am Ende den Lernstand und die Texte über „Lokalen Fortschritt zurücksetzen“.</p></details><div class="self-actions"><button type="button" class="button accent" id="compare" ${canReview(progress.drafts[key] ?? "") ? "" : "disabled"}>Mit dem Muster vergleichen</button><span class="small" id="writing-status" role="status"></span></div><div id="comparison"></div></section></div>
    <aside class="lesson-aside"><section class="aside-card"><h2>Fortschritt</h2><ul class="checklist"><li>${progress.workshopDone.includes(lesson.id) ? "✓" : "○"} Werkstatt</li><li>${progress.quizDone.includes(lesson.id) ? "✓" : "○"} Kurzcheck</li><li>${progress.practiceDone.includes(lesson.id) ? "✓" : "○"} Übung</li><li>${progress.writingDone.includes(writingKey(lesson.id, 1)) ? "✓" : "○"} Level-1-Entwurf</li>${lesson.recitation ? `<li>${progress.recitation[lesson.id]?.synthetic || progress.recitation[lesson.id]?.partner ? "✓" : "○"} Vortragen</li>` : ""}</ul><p class="small">Für „Geübt“ auf dem Lernpfad zählen Werkstatt, Kurzcheck, Übung und Level-1-Entwurf${lesson.recitation ? " sowie das laute Lesen" : ""}. Level 2 ist die vertiefende Transferaufgabe.</p></section>
    <section class="aside-card"><h2>Lehrplan und Quellen</h2><p class="small">LehrplanPLUS Latein 6 (1. Fremdsprache): ${esc(lesson.bindings.join(", "))}</p><ul class="source-list">${lesson.sourceIds.map((id) => {
			const source = required(SOURCES.find((entry) => entry.id === id));
			return `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a></li>`;
		}).join("")}</ul></section></aside></div>
    <nav class="lesson-navigation" aria-label="Zwischen Lektionen wechseln">${index > 0 ? `<button type="button" class="button secondary" id="prev">← ${esc(visible[index - 1].title)}</button>` : "<span></span>"}${index >= 0 && index + 1 < visible.length ? `<button type="button" class="button accent" id="next">${esc(visible[index + 1].title)} →</button>` : ""}</nav>`;

	document
		.querySelector("#back")
		?.addEventListener("click", () => navigate());
	document
		.querySelector<HTMLSelectElement>("#level")
		?.addEventListener("change", (event) => {
			progress.level = Number((event.target as HTMLSelectElement).value) as Level;
			persist();
			renderLesson(lesson);
		});
	document
		.querySelector("#prev")
		?.addEventListener("click", () => navigate(visible[index - 1].id));
	document
		.querySelector("#next")
		?.addEventListener("click", () => navigate(visible[index + 1].id));
	bindFigure(lesson.id, figureFocus);
	bindWorkshop(lesson, main, () => {
		if (!progress.workshopDone.includes(lesson.id))
			progress.workshopDone.push(lesson.id);
		persist();
	});
	main.querySelectorAll<HTMLButtonElement>(".quiz-choice").forEach(
		(button) =>
			void button.addEventListener("click", () => {
				const correct = button.textContent === lesson.quiz.answer;
				progress.quizDone = progress.quizDone.filter((id) => id !== lesson.id);
				if (correct) progress.quizDone.push(lesson.id);
				main
					.querySelectorAll(".quiz-choice")
					.forEach(
						(entry) =>
							void entry.classList.toggle("selected", entry === button),
					);
				element("#quiz-feedback").innerHTML =
					`<div class="feedback ${correct ? "success" : "hint"}">${esc(quizFeedback(lesson, button.textContent ?? ""))}</div>`;
				persist();
			}),
	);
	document
		.querySelector("#practice-form")
		?.addEventListener("submit", (event) => {
			event.preventDefault();
			const answers = [
				...main.querySelectorAll<HTMLInputElement>(".practice-input"),
			].map((input) => input.value);
			practiceAnswers.set(lesson.id, answers);
			const results = checkPractice(lesson.practice, answers);
			progress.practiceDone = progress.practiceDone.filter(
				(id) => id !== lesson.id,
			);
			if (results.every(Boolean)) progress.practiceDone.push(lesson.id);
			element("#practice-feedback").innerHTML =
				`<div class="feedback ${results.every(Boolean) ? "success" : "hint"}"><strong>${results.filter(Boolean).length} von ${results.length} richtig.</strong><ol>${results.map((correct, itemIndex) => `<li>${correct ? "✓ " : ""}${esc(practiceFeedback(lesson.practice[itemIndex], correct))}</li>`).join("")}</ol></div>`;
			main
				.querySelectorAll<HTMLInputElement>(".practice-input")
				.forEach(
					(input, itemIndex) =>
						void input.setAttribute(
							"aria-invalid",
							String(!results[itemIndex]),
						),
				);
			persist();
		});
	main.querySelectorAll<HTMLInputElement>(".practice-input").forEach(
		(input) =>
			void input.addEventListener("input", () => {
				practiceAnswers.set(
					lesson.id,
					[...main.querySelectorAll<HTMLInputElement>(".practice-input")].map(
						(entry) => entry.value,
					),
				);
				progress.practiceDone = progress.practiceDone.filter(
					(id) => id !== lesson.id,
				);
				element("#practice-feedback").innerHTML = "";
				input.removeAttribute("aria-invalid");
				persist();
			}),
	);
	const draft = element<HTMLTextAreaElement>("#draft");
	draft.addEventListener("input", () => {
		updateDraft(progress, lesson.id, progress.level, draft.value);
		element<HTMLButtonElement>("#compare").disabled = !canReview(draft.value);
		element("#comparison").innerHTML = "";
		element("#writing-status").textContent =
			"Geänderter Entwurf · bitte erneut vergleichen.";
		persist();
	});
	document.querySelector("#compare")?.addEventListener("click", () => {
		if (!canReview(draft.value)) return;
		element("#comparison").innerHTML =
			`<div class="model-answer"><h3>Eine mögliche Lösung</h3><p class="material" lang="${task.language ?? "de"}">${esc(task.model)}</p><p class="small">Vergleiche deine eigene Antwort mit dem Muster. Bei offenen Aufgaben gibt es oft mehrere gute Wege.</p><fieldset class="rubric"><legend>Meine Selbsteinschätzung</legend>${task.criteria.map((criterion) => `<label><input type="checkbox" class="criterion">${esc(criterion)}</label>`).join("")}</fieldset><button type="button" class="button accent" id="accept" disabled>Vergleich speichern</button><p class="small">Du bestätigst selbst, dass deine Antwort diese Punkte erfüllt.</p></div>`;
		const checks = () =>
			[...main.querySelectorAll<HTMLInputElement>(".criterion")].map(
				(input) => input.checked,
			);
		const accept = element<HTMLButtonElement>("#accept");
		main.querySelectorAll(".criterion").forEach(
			(input) =>
				void input.addEventListener("change", () => {
					accept.disabled = !canAccept(draft.value, checks());
				}),
		);
		accept.addEventListener("click", () => {
			if (!canAccept(draft.value, checks())) return;
			if (!progress.writingDone.includes(key)) progress.writingDone.push(key);
			element("#writing-status").textContent =
				"Eigener Mustervergleich gespeichert.";
			accept.disabled = true;
			persist();
		});
	});
	if (lesson.recitation) bindRecitation(lesson);
}
function bindRecitation(lesson: Lesson): void {
	const status = element("#voice-status");
	syncSavedState();
	document.querySelector("#listen")?.addEventListener("click", async () => {
		cancelSpeech();
		const token = speechSession;
		if (
			!("speechSynthesis" in window) ||
			!("SpeechSynthesisUtterance" in window)
		) {
			status.textContent =
				"Vorlesen ist hier nicht verfügbar. Lies den Text mit einem Lernpartner laut.";
			return;
		}
		const request = new AbortController();
		voiceRequest = request;
		status.textContent = "Installierte Stimmen werden geprüft …";
		const voice = await waitForLocalVoice(
			window.speechSynthesis,
			request.signal,
		);
		if (token !== speechSession || request.signal.aborted) return;
		if (!voice) {
			voiceRequest = undefined;
			status.textContent =
				"Keine lokale Stimme gefunden. Bitte lies den Text laut mit einem Lernpartner.";
			return;
		}
		element<HTMLDetailsElement>("#transcript").open = false;
		status.textContent = `Lokale Stimme: ${voice.name} (${voice.lang}). Vorlesen läuft …`;
		readLocalScript(
			window.speechSynthesis,
			(text) => new SpeechSynthesisUtterance(text),
			lesson.material,
			voice,
			request.signal,
			{
				complete: () => {
					if (token !== speechSession) return;
					voiceRequest = undefined;
					markSyntheticRecitation(progress, lesson.id);
					status.textContent =
						"Text zu Ende vorgelesen. Eigenes lautes Sprechen und Quantitäten übst du zusätzlich.";
					persist();
				},
				failed: (reason) => {
					if (token !== speechSession) return;
					voiceRequest = undefined;
					status.textContent =
						reason === "timeout"
							? "Die Stimme reagiert nicht. Starte neu oder lies mit einem Partner. Unvollständiges Vorlesen zählt nicht."
							: "Vorlesen wurde unterbrochen. Du kannst neu starten oder mit einem Partner üben.";
				},
			},
		);
	});
	document.querySelector("#stop-listen")?.addEventListener("click", () => {
		cancelSpeech();
		status.textContent =
			"Vorlesen gestoppt. Ein unvollständiges Vorlesen zählt nicht als neue Übung.";
	});
	document
		.querySelector<HTMLInputElement>("#partner-listened")
		?.addEventListener("change", (event) => {
			cancelSpeech();
			status.textContent =
				"Vorlesehilfe gestoppt. Die Partnerbestätigung wird getrennt gespeichert.";
			const checked = (event.target as HTMLInputElement).checked;
			setPartnerRecitation(progress, lesson.id, checked);
			persist();
		});
}
function renderReference(): void {
	main.innerHTML = `<div class="reference"><div class="eyebrow">Grammatik- und Kulturkompendium</div><h1>Latein 6 auf einen Blick</h1><p>Alle neuen Formen, Modi, Partizipialkonstruktionen, Kasusfunktionen, Satzarten sowie Geschichte und Mythen der Jahrgangsstufe 6. Klicke auf eine Lektion, um sie direkt zu öffnen.</p>
    <section class="panel"><h2>Passiv in allen sechs Tempora &amp; Konjunktiv Präteritum</h2><div class="table-scroll"><table class="gram-table"><thead><tr><th>Tempus / Modus</th><th>Stamm &amp; Bildungsregel</th><th>Aktiv (3. Sg./Pl.)</th><th>Passiv (3. Sg./Pl.)</th><th>Deutsche Übersetzung (Passiv)</th></tr></thead><tbody>
      <tr><th>Präsens</th><td>Präsensstamm + -r/-ris/-tur/-mur/-minī/-ntur</td><td>vocat / dēfendunt</td><td>vocātur / dēfenduntur</td><td>er wird gerufen / sie werden verteidigt</td></tr>
      <tr><th>Imperfekt</th><td>Präsensstamm + -bā-/-ēbā- + Passivendung</td><td>vocābat / dēfendēbant</td><td>vocābātur / dēfendēbantur</td><td>er wurde gerufen / sie wurden verteidigt</td></tr>
      <tr><th>Futur I</th><td>-b-/-bi-/-bu- (a/e) · -a-/-ē- (kons./i) + Passivendung</td><td>vocābit / dēfendent</td><td>vocābitur / dēfendentur</td><td>er wird gerufen werden / werden verteidigt werden</td></tr>
      <tr><th>Perfekt</th><td>PPP (KNG!) + Präsens von <em>esse</em> (sum, es, est ...)</td><td>vocāvit / servāvērunt</td><td>vocātus est / servātī sunt</td><td>wurde gerufen / sind gerettet worden</td></tr>
      <tr><th>Plusquamperfekt</th><td>PPP (KNG!) + Imperfekt von <em>esse</em> (eram ...)</td><td>mīsit / servāvit</td><td>missa erat / servātum erat</td><td>war geschickt worden / war gerettet worden</td></tr>
      <tr><th>Futur II</th><td>PPP (KNG!) + Futur I von <em>esse</em> (erō ...)</td><td>servāverit</td><td>servātus erit</td><td>wird gerettet worden sein</td></tr>
      <tr><th>Konjunktiv Impf.</th><td>Infinitiv Präsens + Personalendung (-m/-r ...)</td><td>vocāret / caperent / posset</td><td>vocārētur / caperentur</td><td>würde rufen/fangen / würde gerufen</td></tr>
      <tr><th>Konjunktiv Plusq.</th><td>Inf. Perf. + Endung (Akt.) · PPP + essem (Pass.)</td><td>vēnisset / potuissēmus</td><td>templa servāta essent</td><td>wäre gekommen / wären gerettet worden</td></tr>
    </tbody></table></div><p class="small">Infinitive Passiv: Präsens <em>vocārī, habērī, mittī, capī, audīrī</em> (Gleichzeitigkeit im AcI); Perfekt <em>vocātum, -am, -um esse</em> (Vorzeitigkeit im AcI, mit KNG-Kongruenz!).</p></section>
    <section class="panel"><h2>Partizipien, Demonstrativpronomina &amp; Erweiterungen</h2><div class="table-scroll"><table class="gram-table"><thead><tr><th>Bereich</th><th>Formen / Besonderheit</th><th>Schlüsselbeispiel</th><th>Bedeutung / Übersetzungshilfe</th></tr></thead><tbody>
      <tr><th>PPA (gleichzeitig aktiv)</th><td>Präsensstamm + -ns / -ntem (i-Stamm; <em>fugiēns</em>, <em>iēns/euntis</em>)</td><td><em>Māter fīliam flentem vīdit.</em></td><td>die weinende Tochter / während sie weint</td></tr>
      <tr><th>PPP (vorzeitig passiv)</th><td>4. Stammform (-us, -a, -um; a-/o-Dekl.)</td><td><em>Cōnsul vulnerātus tamen pugnāvit.</em></td><td>obwohl er verwundet worden war</td></tr>
      <tr><th>3. Dekl. Adjektive (Sonderfälle)</th><td><em>dīves, pauper, vetus</em> konsonantisch: Abl. -e, Gen. Pl. -um, n. Pl. -a</td><td><em>cum amīcō paupere · exempla veterum</em></td><td>mit dem armen Freund · Vorbilder der Alten (normal: <em>gravī / -ium / -ia</em>)</td></tr>
      <tr><th>hic · ille · iste</th><td>Sprecherperspektive (nah / fern-berühmt / abwertend); Gen./Dat. huius/huic, illīus/illī, istīus/istī</td><td><em>in hāc terrā · ille Homērus · iste adversārius</em></td><td>dieses Land hier · jener berühmte Homer · dieser Gegner da</td></tr>
      <tr><th>īdem &amp; ipse</th><td><em>īdem, eadem, idem</em> (derselbe) · <em>ipse, ipsa, ipsum</em> (selbst)</td><td><em>eādem hōrā · Dea ipsa · idem carmen</em></td><td>zur selben Stunde · die Göttin selbst · dasselbe Lied</td></tr>
      <tr><th>īre &amp; Zahlen bis M</th><td><em>eō, īs, it ... eunt</em> (Präs.), <em>adībat, adiit</em>; <em>IV/IX/XL/XC/CD/CM</em></td><td><em>duo mīlia mīlitum (CCXVIII, CDXC)</em></td><td>2000 Soldaten (Gen. Pl. nach <em>mīlia</em>; 218 · 490)</td></tr>
    </tbody></table></div></section>
    <section class="panel"><h2>Neue Kasusfunktionen, Nebensätze &amp; Geschichte / Mythos</h2><div class="table-scroll"><table class="gram-table"><thead><tr><th>Thema / Stichwort</th><th>Signal / Kennzeichen</th><th>Beispiel / Eckdaten</th><th>Merksatz / Bedeutung</th></tr></thead><tbody>
      <tr><th>Satzglieder &amp; Kasus</th><td>doppelter Nom./Akk. · Prädikativum · Dat. fīn./comm. · Gen./Abl. quāl. · Gen. sub./obi.</td><td><em>sociīs auxiliō · vir summī ingeniī · dēsīderium patriae</em></td><td>zu Hilfe · von höchstem Verstand · Sehnsucht nach der Heimat</td></tr>
      <tr><th>Irrealis &amp; ut / nē / cum</th><td><em>sī + Konj. Impf./Plusq.</em> · <em>ut / nē</em> (final) · <em>tam ... ut nōn</em> (kons.) · <em>cum + Konj.</em></td><td><em>nē perīret · tam magnus ut nōn · cum tamen</em></td><td>damit nicht · sodass nicht · obwohl (<em>cum</em> + <em>tamen</em>)</td></tr>
      <tr><th>Vesuv &amp; Kampanien</th><td>79 n. Chr. · Misenum, Pompeji, Herkulaneum · <em>cavē canem</em></td><td>Plinius d. J., Briefe 6,16 &amp; 6,20 an Tacitus</td><td>Pinienwolke (<em>fōrma pīnus</em>), Fresko, Thermopolium, Papyri</td></tr>
      <tr><th>Republik &amp; Werte</th><td>509 · 494 (Sēcessiō) · 450 (Zwölf Tafeln) · 280 (Pyrrhos) · 218–202 (Hannibal / Zama)</td><td>Annuität, Kollegialität, Vetō, Klientel · <em>cōnstantia, concordia, dō ut dēs</em></td><td>Roms Zusammenhalt durch die <em>sociī</em> und vertragstreues Handeln</td></tr>
      <tr><th>Mythen &amp; Ovid</th><td>Europa (Stier), Theseus (Ariadnefaden), Daedalus &amp; Ikarus, Orpheus, Troja, Odysseus</td><td>Ovids <em>Metamorphosen</em> · <em>Inter utrumque volā!</em> (8,206)</td><td>Attribut im Bild vs. zeitliches Nacheinander &amp; Gefühle im Text</td></tr>
    </tbody></table></div></section>
    <section class="panel"><h2>Alle Lektionen und Merksätze</h2>${STAGES.map((stage) => `<h3 style="color:hsl(${stage.hue} 55% 36%)">${esc(stage.title)}</h3><ul class="reference-links">${LESSONS.filter((l) => l.stage === stage.id).map((l) => `<li><button type="button" class="text-button" data-lesson="${l.id}">${esc(l.title)}</button><div class="merke-item" style="--stage-hue:${stage.hue}"><span class="small">${esc(l.takeaway)}</span></div></li>`).join("")}</ul>`).join("")}</section>
    <section class="panel"><h2>Hinweis für Eltern und Lehrkräfte</h2><p>Antworten, eigene Übersetzungsentwürfe und Häkchen speichert die App ausschließlich lokal im Browser dieses Geräts (<code>localStorage</code>). Der Browser trennt diese Daten nach Benutzerkonto, Browser, Profil und Herkunft; sie werden nicht verschickt, nicht ausgewertet und nicht mit anderen Geräten synchronisiert. Teilen sich mehrere Lernende ein Gerät oder Benutzerkonto, sollte am Ende über „Lokalen Fortschritt zurücksetzen“ alles gelöscht werden; das entfernt auch alle geschriebenen Texte. Die App ergänzt das Lehrbuch und ersetzt weder die laufende Wortschatzarbeit (ca. 900 Grundwörter bis Ende Klasse 6) noch das Unterrichtsgespräch oder die Rückmeldung einer Lehrkraft.</p></section>
    <section class="panel"><h2>Quellen</h2><ul class="source-list">${SOURCES.map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a></li>`).join("")}</ul></section></div>`;
	main
		.querySelectorAll<HTMLButtonElement>("[data-lesson]")
		.forEach(
			(button) =>
				void button.addEventListener("click", () =>
					navigate(button.dataset.lesson),
				),
		);
}
function showDialog(title: string, content: string): void {
	dialog.innerHTML = `<div class="dialog-heading"><h2 id="dialog-title">${esc(title)}</h2><button type="button" class="icon-button" id="close-dialog" aria-label="Schließen">×</button></div>${content}`;
	document
		.querySelector("#close-dialog")
		?.addEventListener("click", () => dialog.close());
	dialog.showModal();
}
function applyRoute(): void {
	cancelSpeech();
	const link = parseTrainingDeepLink(location.hash, location.search);
	const rawParams = new URLSearchParams(location.hash.replace(/^#/, ""));
	const requestedLesson =
		rawParams.has("lesson") ||
		new URLSearchParams(location.search).has("lesson");
	routeNotice = "";
	if (link.level) progress.level = link.level;
	if (link.lessonId && findLesson(link.lessonId)) {
		progress.activeLessonId = link.lessonId;
		if (findLesson(link.lessonId)?.optional) progress.includeFoundations = true;
		view = "lesson";
	} else if (requestedLesson) {
		view = "path";
		routeNotice =
			"Diese Lektion ist nicht vorhanden. Wähle eine Lektion aus dem Lernpfad.";
	} else view = rawParams.get("view") === "reference" ? "reference" : "path";
	persist();
	render();
}
document.querySelector("#home")?.addEventListener("click", (event) => {
	event.preventDefault();
	navigate();
});
document.querySelector(".skip-link")?.addEventListener("click", (event) => {
	event.preventDefault();
	main.focus();
	main.scrollIntoView();
});
document
	.querySelectorAll<HTMLButtonElement>("[data-view]")
	.forEach(
		(button) =>
			void button.addEventListener("click", () =>
				navigate(button.dataset.view === "reference" ? "reference" : undefined),
			),
	);
document.querySelector("#theme")?.addEventListener("click", () => {
	const current =
		document.documentElement.dataset.theme ??
		(matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
	const theme = current === "dark" ? "light" : "dark";
	document.documentElement.dataset.theme = theme;
	try {
		localStorage.setItem("latein_gym6_theme", theme);
	} catch {
		/* Theme still changes for this visit. */
	}
});
document
	.querySelector("#zam")
	?.addEventListener("click", () =>
		showDialog(
			"Mit ZAM behalten",
			`<p>Für dieses Paket sind 132 Wiederholungskarten vorbereitet. Jede führt zurück zu ihrer Lektion.</p><p>Die Karten liegen in der Zelle <strong>${esc(ZAM_CELL_ID)}</strong>. Sie erscheinen im ZAM-Import „Aus der ZAM Academy“, sobald die Zelle im Katalog steht. Üben in dieser App schreibt die Karten nicht in deine persönliche Bibliothek.</p><p>Du kannst hier ohne Konto weiterüben.</p>`,
		),
	);
document.querySelector("#reset")?.addEventListener("click", () => {
	showDialog(
		"Fortschritt zurücksetzen?",
		'<p>Deine lokalen Antworten, eigenen Texte und Häkchen dieses Latein-Pakets werden gelöscht. Das lässt sich nicht rückgängig machen.</p><button type="button" class="button danger" id="confirm-reset">Fortschritt löschen</button>',
	);
	document.querySelector("#confirm-reset")?.addEventListener("click", () => {
		progress = resetProgress(progress);
		practiceAnswers.clear();
		dialog.close();
		navigate();
	});
});
window.addEventListener("hashchange", applyRoute);
window.addEventListener("pagehide", cancelSpeech);
window.addEventListener("storage", (event) => {
	if (event.key !== null && event.key !== STORAGE_KEY) return;
	// Read the current value: an older queued event must not undo a newer save.
	const stored = loadProgress();
	const reset = stored.resetAt > progress.resetAt;
	if (reset) {
		cancelSpeech();
		practiceAnswers.clear();
	}
	progress = mergeProgress(stored, progress, baseline);
	baseline = structuredClone(stored);
	if (reset || view === "path") render();
	else syncSavedState();
	renderStats();
});

applyRoute();
