import "./styles.css";
import {
	CARD_COUNT,
	lessonsForTrack,
	findLesson,
	LESSONS,
	SOURCES,
	STAGES,
} from "./curriculum";
import { readLocalScript, waitForLocalEnglishVoice } from "./listening";
import {
	canAccept,
	canReview,
	checkPractice,
	esc,
	isReferenceLanguageLesson,
	practiceFeedback,
	quizFeedback,
	quizOptions,
} from "./practice";
import {
	completion,
	isComplete,
	loadProgress,
	markSyntheticListening,
	mergeProgress,
	resetProgress,
	STORAGE_KEY,
	saveProgress,
	setPartnerListening,
	updateDraft,
	writingKey,
} from "./storage/progress";
import type { Lesson, Level, TrackFilter } from "./types";
import { bindWorkshop, renderWorkshop } from "./workshop";
import {
	parseTrainingDeepLink,
	trainingBaseUrl,
	zamEnrolRequest,
} from "./zam/zam-link";

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
				? "Eigener Text geändert · bitte mit einem Muster vergleichen."
				: "";
	}
	const partner = document.querySelector<HTMLInputElement>("#partner-listened");
	if (partner) {
		const evidence = progress.listening[id];
		partner.checked = evidence?.partner === true;
		const modes = [
			evidence?.synthetic ? "lokale Computerstimme" : "",
			evidence?.partner ? "Partner hat vorgelesen" : "",
		].filter(Boolean);
		element("#listened-status").textContent = modes.length
			? `Zuhörübung gespeichert: ${modes.join(" und ")}.`
			: "Zuhörübung noch offen.";
	}
}
function renderStats(): void {
	const count = completion(progress);
	element("#progress-strip").innerHTML =
		`<label for="path-progress">Level ${progress.level} · ${esc(trackLabel(progress.track))}: ${count.completed} von ${count.total} geübt</label><progress id="path-progress" value="${count.completed}" max="${count.total}">${count.percent}%</progress>`;
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
	cancelSpeech();
	if (id && findLesson(id)) {
		progress.activeLessonId = id;
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
function trackLabel(track: TrackFilter): string {
	return track === "R" ? "Regelklasse" : track === "M" ? "M-Zug" : "Regelklasse und M-Zug";
}

function levelSelect(): string {
	return `<label class="level-select" for="level">Aufgabenstufe <select id="level"><option value="1" ${progress.level === 1 ? "selected" : ""}>Level 1 · Anwenden</option><option value="2" ${progress.level === 2 ? "selected" : ""}>Level 2 · Transfer</option></select></label>`;
}

function renderPath(): void {
	const visible = lessonsForTrack(progress.track);
	const next = visible.find((lesson) => !isComplete(progress, lesson.id)) ?? visible[0];
	main.innerHTML = `${routeNotice ? `<p class="notice" role="status">${esc(routeNotice)}</p>` : ""}
    <section class="hero">
      <div><h1>Englisch 7</h1><p>Frag nach dem Weg, erkunde Irland und erzähl von dem, was du erlebt hast. Für Regelklasse und M-Zug.</p><button type="button" class="button accent" id="continue">${completion(progress).completed ? "Weiterüben" : "Mit Englisch starten"} <span aria-hidden="true">↗</span></button><p class="small">${visible.length} Lektionen · zwei Aufgabenstufen</p></div>
      <aside class="hero-note"><strong>Deine nächste Lektion</strong><p lang="en">${esc(next.title)}</p><p class="small">${esc(next.skill)}</p></aside>
    </section>
    <div class="path-heading"><h2>Dein Lernpfad</h2><div class="path-filters"><label class="level-select" for="track">Klassenzug <select id="track"><option value="all" ${progress.track === "all" ? "selected" : ""}>Alle Lektionen</option><option value="R" ${progress.track === "R" ? "selected" : ""}>Regelklasse (R7)</option><option value="M" ${progress.track === "M" ? "selected" : ""}>M-Zug (M7)</option></select></label>${levelSelect()}</div></div>
    <div class="stages">${STAGES.map((stage) => {
		const lessons = visible.filter((lesson) => lesson.stage === stage.id);
		return `<section class="stage" style="--stage-hue:${stage.hue}"><div class="stage-header"><span class="stage-icon" aria-hidden="true">${esc(stage.icon)}</span><div><h3>${esc(stage.title)}</h3><span class="small">${esc(stage.subtitle)}</span></div><span class="stage-count">${lessons.filter((lesson) => isComplete(progress, lesson.id)).length}/${lessons.length}</span></div><ol>${lessons.map((lesson) => `<li><button type="button" class="lesson-link ${isComplete(progress, lesson.id) ? "complete" : ""}" data-lesson="${lesson.id}"><span class="lesson-dot" aria-hidden="true">${isComplete(progress, lesson.id) ? "✓" : ""}</span><span><strong lang="en">${esc(lesson.title)}</strong><small>${lesson.tracks.length === 1 ? "M-Zug · " : ""}${esc(lesson.skill)}</small></span><span class="lesson-status">${isComplete(progress, lesson.id) ? "Geübt" : "Öffnen →"}</span></button></li>`).join("")}</ol></section>`;
	}).join("")}</div>`;
	main.querySelector<HTMLSelectElement>("#track")?.addEventListener("change", (event) => {
		const track = (event.currentTarget as HTMLSelectElement).value;
		progress.track = track === "R" || track === "M" ? track : "all";
		persist();
		renderPath();
		main.querySelector<HTMLElement>("#track")?.focus();
	});
	main.querySelector<HTMLSelectElement>("#level")?.addEventListener("change", (event) => {
		progress.level = (event.currentTarget as HTMLSelectElement).value === "2" ? 2 : 1;
		persist();
		renderPath();
		main.querySelector<HTMLElement>("#level")?.focus();
	});
	document
		.querySelector("#continue")
		?.addEventListener("click", () => navigate(next.id));
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
	const filtered = lessonsForTrack(progress.track);
	const outsideTrack = !filtered.includes(lesson);
	const visible = outsideTrack ? lessonsForTrack(lesson.tracks[0]) : filtered;
	const index = visible.findIndex((entry) => entry.id === lesson.id);
	const material = `<section class="panel" aria-labelledby="material-heading"><h2 id="material-heading">${lesson.listening ? "Zuerst hören" : "Dein Material"}</h2><p class="small">${esc(lesson.materialLabel)}</p>${lesson.listening ? `<p>Höre zuerst ohne mitzulesen. Das Skript ist für ${lesson.listeningAccent === "en-US" ? "amerikanisches" : "britisches"} Englisch geschrieben. ${lesson.speaking ? "Höre die Frage und sprich sie nach." : "Höre auf Schlüsselwörter."}</p><div class="self-actions"><button type="button" class="button accent" id="listen">Skript anhören</button><button type="button" class="button secondary" id="stop-listen">Stoppen</button></div><p class="small" id="voice-status" role="status"></p><details id="transcript"><summary>Transkript / Text zum Vorlesen</summary><p class="material" lang="${lesson.materialLanguage}">${esc(lesson.material)}</p></details><label class="toggle"><input type="checkbox" id="partner-listened" ${progress.listening[lesson.id]?.partner ? "checked" : ""}>Ein Partner hat mir den Text vorgelesen; ich habe zuerst ohne Mitlesen zugehört.</label><p class="small" id="listened-status" role="status"></p>` : `<p class="material" lang="${lesson.materialLanguage}">${esc(lesson.material)}</p>`}</section>`;
	main.innerHTML = `<div class="lesson-top"><button type="button" class="text-button" id="back">← Zum Lernpfad</button>${levelSelect()}</div>
    ${outsideTrack ? '<p class="notice" role="status">Diese Lektion gehört zum M-Zug. Deine Einstellung im Lernpfad bleibt gespeichert.</p>' : ""}
    <div class="lesson-heading" style="--stage-hue:${stage.hue}"><div class="eyebrow">${esc(stage.title)} · ${lesson.tracks.length === 1 ? "M7" : "R7 und M7"} · ${esc(lesson.bindings.map((binding) => binding.replace("E7 ", "LB ")).join(", "))}</div><h1 lang="en">${esc(lesson.title)}</h1><p class="intro">${esc(lesson.skill)}</p></div>
    <div class="lesson-columns" style="--lesson-hue:${stage.hue}"><div class="lesson-content">
    ${lesson.listening ? material : ""}
    <section class="panel"><h2>Verstehen</h2>${lesson.paragraphs.map((text) => `<p>${esc(text)}</p>`).join("")}<aside class="takeaway"><strong>Merke</strong><p>${esc(lesson.takeaway)}</p></aside></section>
    ${lesson.listening ? "" : material}
    ${renderWorkshop(lesson)}
    <section class="panel"><h2>1 · Schnellcheck</h2><p lang="${lesson.quiz.optionLanguage}">${esc(lesson.quiz.question)}</p><div class="quiz-options">${quizOptions(
			lesson,
		)
			.map(
				(option) =>
					`<button type="button" class="quiz-choice" lang="${lesson.quiz.optionLanguage}">${esc(option)}</button>`,
			)
			.join(
				"",
			)}</div><div id="quiz-feedback" role="status"></div>${progress.quizDone.includes(lesson.id) ? '<p class="done-mark">Bereits richtig geübt · du kannst es erneut versuchen.</p>' : ""}</section>
    <section class="panel"><h2>2 · Ausprobieren</h2><p class="small">Ergänze die kurzen Antworten. Großschreibung und ein Satzpunkt sind hier nicht entscheidend. Bei Lücken ergänze nur den fehlenden Ausdruck; beachte genannte Wörter und Formvorgaben. Freie Fragen erwarten kurze Antworten.</p><form id="practice-form">${lesson.practice.map((item, itemIndex) => `<label class="practice-label" for="practice-${itemIndex}" lang="en">${esc(item.prompt)}</label><input class="practice-input" id="practice-${itemIndex}" data-index="${itemIndex}" autocomplete="off" spellcheck="false" value="${esc(practiceAnswers.get(lesson.id)?.[itemIndex] ?? "")}" required>`).join("")}<button type="submit" class="button secondary">Antworten prüfen</button></form><div id="practice-feedback" role="status"></div>${progress.practiceDone.includes(lesson.id) ? '<p class="done-mark">Bereits richtig geübt.</p>' : ""}</section>
    <section class="panel"><h2>3 · ${lesson.speaking ? "Selbst sprechen und notieren" : "Mit eigenen Worten"}</h2><p class="task-prompt">${esc(task.prompt)}</p>${lesson.speaking ? '<p class="small">Sprich laut oder mit einem Partner. Hier speicherst du deine Notizen. Es wird nichts aufgenommen; Aussprache und Flüssigkeit werden nicht automatisch bewertet.</p>' : ""}${progress.level === 1 ? `<details><summary>Hinweis für Level 1</summary><p>${task.criteria.map(esc).join(" ")}</p></details>` : ""}<label class="answer-label" for="draft">${lesson.speaking ? "Deine Notizen" : "Deine Antwort"}</label><details class="draft-storage"><summary>Lokal gespeichert</summary><p>Teilst du dein Benutzerkonto mit anderen? Lösche am Ende deine Texte und deinen Lernstand über „Lokalen Fortschritt zurücksetzen“ unten auf der Seite.</p></details><textarea id="draft" aria-describedby="draft-note" rows="7" maxlength="8000">${esc(progress.drafts[key] ?? "")}</textarea><span class="small" id="draft-note">Mindestens 20 Zeichen, bevor du ein Muster vergleichst. Eigene Formulierungen dürfen abweichen.</span><div class="self-actions"><button type="button" class="button secondary" id="compare" ${canReview(progress.drafts[key] ?? "") ? "" : "disabled"}>Mit einem Muster vergleichen</button></div><div id="comparison"></div><p class="done-mark" id="writing-status" role="status">${progress.writingDone.includes(key) ? "Eigener Mustervergleich gespeichert." : ""}</p></section>
    </div><aside class="lesson-aside"><section class="aside-card"><h2>Deine Schritte</h2><ul class="checklist"><li>Werkstatt · 3 Ziele</li><li>1. Schnellcheck</li><li>2. Kurzaufgaben</li><li>3. Eigene Antwort + Vergleich</li>${lesson.listening ? "<li>Zusätzlich: zuerst zugehört</li>" : ""}</ul><p class="small">Dein Lernpfad zählt Werkstatt, Kurzaufgaben und Mustervergleich. Für Level 2 schreibst du eine eigene Transferantwort.</p></section><section class="aside-card"><h2>Quellen und weiterüben</h2><ul class="source-list">${lesson.sourceIds
			.map((id) => required(SOURCES.find((source) => source.id === id)))
			.map(
				(source) =>
					`<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a></li>`,
			)
			.join(
				"",
			)}</ul><p class="small">Quellen öffnen erst auf deinen Klick.</p></section></aside></div>
    <div class="lesson-navigation"><button type="button" class="button secondary" id="previous" ${index === 0 ? "disabled" : ""}>← Vorige Lektion</button><button type="button" class="button accent" id="next" ${index === visible.length - 1 ? "disabled" : ""}>Nächste Lektion →</button></div>`;
	bindWorkshop(lesson, main, () => {
		if (!progress.workshopDone.includes(lesson.id))
			progress.workshopDone.push(lesson.id);
		persist();
	});
	document.querySelector("#back")?.addEventListener("click", () => navigate());
	document
		.querySelector<HTMLSelectElement>("#level")
		?.addEventListener("change", (event) => {
			progress.level = Number(
				(event.target as HTMLSelectElement).value,
			) as Level;
			navigate(lesson.id);
		});
	document
		.querySelector("#previous")
		?.addEventListener("click", () => navigate(visible[index - 1]?.id));
	document
		.querySelector("#next")
		?.addEventListener("click", () => navigate(visible[index + 1]?.id));
	main.querySelectorAll<HTMLButtonElement>(".quiz-choice").forEach(
		(button) =>
			void button.addEventListener("click", () => {
				const correct = button.textContent === lesson.quiz.answer;
				if (correct && !progress.quizDone.includes(lesson.id)) progress.quizDone.push(lesson.id);
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
			if (results.every(Boolean) && !progress.practiceDone.includes(lesson.id)) {
				progress.practiceDone.push(lesson.id);
			}
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
				element("#practice-feedback").innerHTML = "";
				input.removeAttribute("aria-invalid");
			}),
	);
	const draft = element<HTMLTextAreaElement>("#draft");
	draft.addEventListener("input", () => {
		updateDraft(progress, lesson.id, progress.level, draft.value);
		element<HTMLButtonElement>("#compare").disabled = !canReview(draft.value);
		element("#comparison").innerHTML = "";
		element("#writing-status").textContent =
			"Eigener Text geändert · bitte erneut vergleichen.";
		persist();
	});
	document.querySelector("#compare")?.addEventListener("click", () => {
		if (!canReview(draft.value)) return;
		element("#comparison").innerHTML =
			`<div class="model-answer"><h3>Eine mögliche Lösung</h3><p class="material" lang="${task.language ?? "en"}">${esc(task.model)}</p><p class="small">Vergleiche deine eigene Antwort. Bei einem Projekt ist dieses Muster eine Strukturhilfe; die eigene Gestaltung und Recherche führst du selbst durch.</p><fieldset class="rubric"><legend>Meine Selbsteinschätzung</legend>${task.criteria.map((criterion) => `<label><input type="checkbox" class="criterion">${esc(criterion)}</label>`).join("")}</fieldset><button type="button" class="button accent" id="accept" disabled>Vergleich speichern</button><p class="small">Du bestätigst selbst, dass deine Antwort diese Punkte erfüllt.</p></div>`;
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
	if (lesson.listening) bindListening(lesson);
}
function bindListening(lesson: Lesson): void {
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
				"Vorlesen ist hier nicht verfügbar. Ein Partner kann dir den Text vorlesen; das Transkript bleibt zugänglich.";
			return;
		}
		const request = new AbortController();
		voiceRequest = request;
		status.textContent = "Installierte englische Stimmen werden geladen …";
		const voice = await waitForLocalEnglishVoice(
			window.speechSynthesis,
			request.signal,
			1500,
			lesson.listeningAccent ?? "en-GB",
		);
		if (token !== speechSession || request.signal.aborted) return;
		if (!voice) {
			voiceRequest = undefined;
			status.textContent =
				"Keine lokale englische Stimme gefunden. Versuche es später noch einmal oder bitte einen Partner, den Text vorzulesen.";
			return;
		}
		element<HTMLDetailsElement>("#transcript").open = false;
		status.textContent = `Lokale Computerstimme: ${voice.name} (${voice.lang}). Zuhören läuft …`;
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
					markSyntheticListening(progress, lesson.id);
					status.textContent =
						"Skript zu Ende vorgelesen. Natürliche Aufnahmen übst du zusätzlich.";
					persist();
				},
				failed: (reason) => {
					if (token !== speechSession) return;
					voiceRequest = undefined;
					status.textContent =
						reason === "timeout"
							? "Die Computerstimme reagiert nicht. Starte neu oder bitte einen Partner, den Text vorzulesen. Unvollständiges Vorlesen zählt nicht."
							: "Vorlesen wurde unterbrochen. Du kannst neu starten oder mit einem Partner üben.";
				},
			},
		);
	});
	document.querySelector("#stop-listen")?.addEventListener("click", () => {
		cancelSpeech();
		status.textContent =
			"Vorlesen gestoppt. Ein unvollständiges Vorlesen zählt nicht als neue Zuhörübung.";
	});
	document
		.querySelector<HTMLInputElement>("#partner-listened")
		?.addEventListener("change", (event) => {
			cancelSpeech();
			status.textContent =
				"Computerstimme gestoppt. Die Partnerbestätigung wird getrennt gespeichert.";
			const checked = (event.target as HTMLInputElement).checked;
			setPartnerListening(progress, lesson.id, checked);
			persist();
		});
}
function renderReference(): void {
	const listeningCount = LESSONS.filter((lesson) => lesson.listening).length;
	main.innerHTML = `<div class="reference"><div class="eyebrow">Nachschlagen und weiterüben</div><h1>Sprache im Zusammenhang</h1><p>Öffne die passende Lektion und übe mit einem eigenen Beispiel.</p><section class="panel"><h2>Sprache, Strukturen und Methoden</h2><ul class="reference-links">${LESSONS.filter(
		isReferenceLanguageLesson,
	)
		.map(
			(lesson) =>
				`<li><button type="button" class="text-button" data-lesson="${lesson.id}" lang="en">${esc(lesson.title)}</button>${lesson.tracks.length === 1 ? ' <span class="small">M-Zug</span>' : ""}</li>`,
		)
		.join(
			"",
		)}</ul></section><section class="panel"><h2>Hören, Sprechen und Lesen</h2><p>Die ${listeningCount} Hörskripte in britischer und amerikanischer Standardsprache können lokal vorgelesen werden. Echte Varietäten, Hintergrundgeräusche (z. B. Verkehrslärm), Mimik, Gestik und natürliche Dialoge werden dadurch nicht vollständig geübt. Nutze zusätzlich echte Aufnahmen und Partnergespräche.</p><p>Ergänze den Wortschatz aus den Lektionen mit Beispielen aus deinem Lehrwerk und Unterricht. Übe echte Gespräche und Vorträge mit Rückmeldung. Nutze für eigene Recherchen die Quellen bei der Lektion.</p></section><section class="panel"><h2>Für Eltern und Lehrkräfte</h2><p>Eigene Texte und der Lernstand bleiben im Browserprofil. Wenn mehrere Lernende dasselbe Benutzerkonto und Browserprofil verwenden, löscht „Lokalen Fortschritt zurücksetzen“ nach der Übung beides.</p></section><section class="panel"><h2>Quellen</h2><ul class="source-list">${SOURCES.map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a></li>`).join("")}</ul></section></div>`;
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
		localStorage.setItem("englisch_ms7_theme", theme);
	} catch {
		/* Theme still changes for this visit. */
	}
});
document
	.querySelector("#zam")
	?.addEventListener("click", () =>
		showDialog(
			"Mit ZAM behalten",
			`<p>Diese App gehört zur ZAM Academy. Dazu gehören ${CARD_COUNT} Wiederholungsfragen für ZAM; jede führt zurück zu ihrer Lektion.</p><p>Füge das Paket in ZAM Academy mit „Aufnehmen“ zu deiner Bibliothek hinzu. Du kannst auch folgenden Auftrag kopieren:</p><p class="material">${esc(zamEnrolRequest())}</p><p>Deine Karten startest du in ZAM. Deinen Fortschritt in der Web-App speichert dieser Browser.</p><p>Hier kannst du ohne Konto weiterüben.</p>`,
		),
	);
document.querySelector("#reset")?.addEventListener("click", () => {
	showDialog(
		"Fortschritt zurücksetzen?",
		'<p>Deine lokalen Antworten und Häkchen dieses Englisch-Pakets werden gelöscht. Das lässt sich nicht rückgängig machen.</p><button type="button" class="button danger" id="confirm-reset">Fortschritt löschen</button>',
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
	if (event.key !== STORAGE_KEY) return;
	// Read the current value: an older queued event must not undo a newer save.
	const stored = loadProgress();
	if (stored.resetAt > progress.resetAt) {
		cancelSpeech();
		practiceAnswers.clear();
	}
	progress = mergeProgress(stored, progress, baseline);
	baseline = structuredClone(stored);
	if (view === "path") {
		const focused = document.activeElement;
		const focusId = focused instanceof HTMLElement && main.contains(focused) ? focused.id : "";
		renderPath();
		if (focusId) document.getElementById(focusId)?.focus();
	} else syncSavedState();
	renderStats();
});

applyRoute();
