import "./styles.css";
import { bindWorkshop, renderWorkshop } from "./workshop";
import {
	lessonsForTrack,
	findLesson,
	SOURCES,
	STAGES,
} from "./curriculum";
import { readLocalScript, waitForLocalFrenchVoice } from "./listening";
import {
	canAccept,
	canReview,
	checkPractice,
	esc,
	quizOptions,
	quizFeedback,
	practiceFeedback,
} from "./practice";
import {
	completion,
	currentTrack,
	markSyntheticListening,
	mergeProgress,
	resetProgress,
	setPartnerListening,
	STORAGE_KEY,
	isComplete,
	loadProgress,
	saveProgress,
	updateDraft,
	writingKey,
} from "./storage/progress";
import type { Lesson, Level, Track } from "./types";
import {
	parseTrainingDeepLink,
	trainingBaseUrl,
	ZAM_CELL_ID,
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
const tracks = [
	{ id: "f2", title: "2. Fremdsprache", detail: "Ich beginne mit Französisch." },
	{ id: "f1", title: "1. Fremdsprache", detail: "Ich lerne Französisch seit Klasse 5." },
] as const;

function nextLesson(track: Track): Lesson {
	const lessons = lessonsForTrack(track);
	return lessons.find((lesson) => !isComplete(progress, lesson.id)) ?? lessons[0];
}
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
				? "Entwurf geändert · bitte mit einem Muster vergleichen."
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
		`<label for="path-progress">${currentTrack(progress) === "f1" ? "1." : "2."} Fremdsprache · ${count.completed} von ${count.total} Lektionen geübt</label><progress id="path-progress" value="${count.completed}" max="${count.total}">${count.percent}%</progress>`;
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
	const track = currentTrack(progress);
	const lessons = lessonsForTrack(track);
	const next = nextLesson(track);
	main.innerHTML = `${routeNotice ? `<p class="notice" role="status">${esc(routeNotice)}</p>` : ""}
    <section class="hero"><div><div class="eyebrow">Gymnasium Bayern · 6. Klasse</div><h1>Französisch im Alltag</h1><p>Finde dich in einer Stadt zurecht, verabrede dich und erzähle in kurzen Sätzen. Wähle den Weg, der zu deinem Unterricht passt.</p>
    <div class="track-picker" role="group" aria-label="Französisch-Lernpfad">${tracks.map((entry) => `<button type="button" data-track="${entry.id}" aria-pressed="${entry.id === track}"><strong>${entry.title}</strong><span>${entry.detail}</span></button>`).join("")}</div></div>
    <aside class="hero-note"><div class="eyebrow">Dein nächster Schritt</div><strong lang="fr">${esc(next.title)}</strong><p>${esc(next.skill)}</p><button type="button" class="button accent" id="continue">${completion(progress).completed ? "Weiterüben" : "Mit dieser Lektion starten"} <span aria-hidden="true">↗</span></button></aside></section>
    <div class="path-heading"><div><h2>Dein Lernpfad</h2><p>${lessons.length} Lektionen · Jede kann direkt geöffnet werden.</p></div></div>
    <div class="stages">${STAGES.filter((stage) => stage.track === track)
			.map((stage) => {
				const stageLessons = lessons.filter((lesson) => lesson.stage === stage.id);
				return `<section class="stage" style="--stage-hue:${stage.hue}"><div class="stage-header"><span class="stage-icon" aria-hidden="true">${esc(stage.icon)}</span><div><h3>${esc(stage.title)}</h3><span class="small">${esc(stage.subtitle)}</span></div><span class="stage-count">${stageLessons.filter((lesson) => isComplete(progress, lesson.id)).length}/${stageLessons.length}</span></div><ol>${stageLessons.map((lesson) => `<li><button type="button" class="lesson-link ${isComplete(progress, lesson.id) ? "complete" : ""}" data-lesson="${lesson.id}"><span class="lesson-dot" aria-hidden="true">${isComplete(progress, lesson.id) ? "✓" : ""}</span><span><strong lang="fr">${esc(lesson.title)}</strong><small>${esc(lesson.skill)}</small></span><span class="lesson-status">${isComplete(progress, lesson.id) ? "Geübt" : "Öffnen →"}</span></button></li>`).join("")}</ol></section>`;
			})
			.join(
				"",
			)}</div><aside class="notice"><p>Übe Gespräche mit anderen und ergänze die Hörübungen durch echte Aufnahmen.</p></aside>`;
	document
		.querySelector("#continue")
		?.addEventListener("click", () => navigate(next.id));
	main.querySelectorAll<HTMLButtonElement>("[data-track]").forEach((button) => {
		button.addEventListener("click", () => {
			const selected = tracks.find((entry) => entry.id === button.dataset.track);
			if (!selected || selected.id === track) return;
			progress.activeLessonId = nextLesson(selected.id).id;
			persist();
			renderPath();
			main.querySelector<HTMLButtonElement>(`[data-track="${selected.id}"]`)?.focus();
		});
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
function accentKeys(id: string): string {
	return `<div id="${id}" class="accent-keys" role="group" aria-label="Französische Sonderzeichen">${Array.from("éèêëàâùûüîïôçœ").map((char) =>
		`<button type="button" data-char="${char}" lang="fr">${char}</button>`,
	).join("")}</div>`;
}

function bindAccentKeys(selector: string, inputs: (HTMLInputElement | HTMLTextAreaElement)[]): void {
	let selected = inputs[0];
	for (const input of inputs) input.addEventListener("focus", () => { selected = input; });
	for (const button of element(selector).querySelectorAll<HTMLButtonElement>("[data-char]")) {
		button.addEventListener("click", () => {
			const start = selected.selectionStart ?? selected.value.length;
			const end = selected.selectionEnd ?? start;
			if (selected.maxLength >= 0 && selected.value.length - (end - start) >= selected.maxLength) return;
			selected.setRangeText(button.dataset.char ?? "", start, end, "end");
			selected.focus();
			selected.dispatchEvent(new Event("input", { bubbles: true }));
		});
	}
}

function renderLesson(lesson: Lesson): void {
	const task = lesson.tasks[progress.level];
	const key = writingKey(lesson.id, progress.level);
	const stage = required(STAGES.find((entry) => entry.id === lesson.stage));
	const visible = lessonsForTrack(lesson.track);
	const index = visible.findIndex((entry) => entry.id === lesson.id);
	const material = `<section class="panel" aria-labelledby="material-heading"><h2 id="material-heading">${lesson.listening ? "Zuerst hören" : "Dein Material"}</h2><p class="small">${esc(lesson.materialLabel)}</p>${lesson.listening ? `<p>Höre zuerst ohne mitzulesen. Die lokale Computerstimme spricht ein Übungsskript; natürliche Stimmen und Hörsehtexte übst du zusätzlich.</p><div class="self-actions"><button type="button" class="button accent" id="listen">Skript anhören</button><button type="button" class="button secondary" id="stop-listen">Stoppen</button></div><p class="small" id="voice-status" role="status"></p><details id="transcript"><summary>Transkript / Text zum Vorlesen</summary><p class="material" lang="${lesson.materialLanguage}">${esc(lesson.material)}</p></details><label class="toggle"><input type="checkbox" id="partner-listened" ${progress.listening[lesson.id]?.partner ? "checked" : ""}>Ein Partner hat mir den Text vorgelesen; ich habe zuerst ohne Mitlesen zugehört.</label><p class="small" id="listened-status" role="status"></p>` : `<p class="material" lang="${lesson.materialLanguage}">${esc(lesson.material)}</p>`}</section>`;
	main.innerHTML = `<div class="lesson-top"><button type="button" class="text-button" id="back">← Zum Lernpfad</button><label class="level-select" for="level">Aufgabenstufe <select id="level"><option value="1" ${progress.level === 1 ? "selected" : ""}>Level 1 · Anwenden</option><option value="2" ${progress.level === 2 ? "selected" : ""}>Level 2 · Transfer</option></select></label></div>
    <div class="lesson-heading" style="--stage-hue:${stage.hue}"><div class="eyebrow">${esc(stage.title)}</div><h1 lang="fr">${esc(lesson.title)}</h1><p class="intro">${esc(lesson.skill)}</p></div>
    <div class="lesson-columns" style="--lesson-hue:${stage.hue}"><div class="lesson-content">${lesson.listening ? material : ""}<section class="panel"><h2>Verstehen</h2>${lesson.paragraphs.map((text) => `<p>${esc(text)}</p>`).join("")}<aside class="takeaway"><strong>Merke</strong><p>${esc(lesson.takeaway)}</p></aside></section>
    ${renderWorkshop(lesson)}
    ${lesson.listening ? "" : material}
    <section class="panel"><h2>1 · Schnellcheck</h2><p>${esc(lesson.quiz.question)}</p><div class="quiz-options">${quizOptions(
			lesson,
		)
			.map(
				(option) =>
					`<button type="button" class="quiz-choice" lang="${lesson.quiz.optionLanguage}">${esc(option)}</button>`,
			)
			.join(
				"",
			)}</div><div id="quiz-feedback" role="status"></div>${progress.quizDone.includes(lesson.id) ? '<p class="done-mark">Bereits richtig geübt · du kannst es erneut versuchen.</p>' : ""}</section>
    <section class="panel"><h2>2 · Ausprobieren</h2><p class="small">Ergänze die kurzen Antworten. Großschreibung und ein Satzpunkt sind hier nicht entscheidend. Akzente zählen: a und à sind verschieden; eine französische Apostrophe darf gerade oder geschwungen sein. Bei längeren Formulierungen sind weitere gute Antworten möglich; diese Aufgabe prüft die angegebenen Kurzformen.</p><form id="practice-form">${lesson.practice.map((item, itemIndex) => `<label class="practice-label" for="practice-${itemIndex}">${esc(item.prompt)}</label><input class="practice-input" id="practice-${itemIndex}" lang="fr" data-index="${itemIndex}" autocomplete="off" spellcheck="false" value="${esc(practiceAnswers.get(lesson.id)?.[itemIndex] ?? "")}" required>`).join("")}${accentKeys("practice-accents")}<button type="submit" class="button secondary">Antworten prüfen</button></form><div id="practice-feedback" role="status"></div>${progress.practiceDone.includes(lesson.id) ? '<p class="done-mark">Bereits richtig geübt.</p>' : ""}</section>
    <section class="panel"><h2>3 · ${lesson.speaking ? "Selbst sprechen und notieren" : "Mit eigenen Worten"}</h2><p class="task-prompt">${esc(task.prompt)}</p>${lesson.speaking ? '<p class="small">Sprich laut oder mit einem Partner. Hier speicherst du deine Notizen. Es wird nichts aufgenommen; Aussprache und Flüssigkeit werden nicht automatisch bewertet.</p>' : ""}<label class="answer-label" for="draft">${lesson.speaking ? "Deine Notizen" : "Deine Antwort"}</label><textarea id="draft" rows="7" maxlength="8000">${esc(progress.drafts[key] ?? "")}</textarea><span class="small" id="draft-note">Mindestens 20 Zeichen, bevor du ein Muster vergleichst. Eigene Formulierungen dürfen abweichen.</span>${accentKeys("draft-accents")}<div class="self-actions"><button type="button" class="button secondary" id="compare" ${canReview(progress.drafts[key] ?? "") ? "" : "disabled"}>Mit einem Muster vergleichen</button></div><div id="comparison"></div><p class="done-mark" id="writing-status" role="status">${progress.writingDone.includes(key) ? "Eigener Mustervergleich gespeichert." : ""}</p></section>
    </div><aside class="lesson-aside"><section class="aside-card"><h2>Deine Schritte</h2><ul class="checklist"><li>Entdeckerwerkstatt · 3 Ziele</li><li>1. Schnellcheck</li><li>2. Kurzaufgaben</li><li>3. Eigene Antwort + Vergleich</li>${lesson.listening ? "<li>Zusätzlich: zuerst zugehört</li>" : ""}</ul><p class="small">Werkstatt und Level 1 zählen zum Kernpfad. Level 2 ist zusätzliche Transferübung. Ein Häkchen bestätigt deine Übung, keine geprüfte Sprachkompetenz.</p></section><section class="aside-card"><h2>Quellen und weiterüben</h2><ul class="source-list">${lesson.sourceIds
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
	bindAccentKeys("#draft-accents", [draft]);
	bindAccentKeys("#practice-accents", [...main.querySelectorAll<HTMLInputElement>(".practice-input")]);
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
			`<div class="model-answer"><h3>Eine mögliche Lösung</h3><p class="material" lang="${task.language ?? "fr"}">${esc(task.model)}</p><p class="small">Vergleiche deine eigene Antwort. Bei einem Projekt ist dieses Muster eine Strukturhilfe; die eigene Gestaltung und Recherche führst du selbst durch.</p><fieldset class="rubric"><legend>Meine Selbsteinschätzung</legend>${task.criteria.map((criterion) => `<label><input type="checkbox" class="criterion">${esc(criterion)}</label>`).join("")}</fieldset><button type="button" class="button accent" id="accept" disabled>Vergleich speichern</button><p class="small">Du bestätigst selbst, dass deine Antwort diese Punkte erfüllt.</p></div>`;
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
		status.textContent = "Installierte französische Stimmen werden geladen …";
		const voice = await waitForLocalFrenchVoice(
			window.speechSynthesis,
			request.signal,
		);
		if (token !== speechSession || request.signal.aborted) return;
		if (!voice) {
			voiceRequest = undefined;
			status.textContent =
				"Keine lokale französische Stimme gefunden. Versuche es später noch einmal oder bitte einen Partner, den Text vorzulesen.";
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
	main.innerHTML = `<div class="reference"><div class="eyebrow">Nachschlagen und weiterüben</div><h1>Sprache im Zusammenhang</h1><p>Öffne die passende Lektion und übe mit einem eigenen Beispiel.</p><section class="panel"><h2>Sprachwerkstatt</h2><ul class="reference-links">${lessonsForTrack(currentTrack(progress)).filter((lesson) =>
		lesson.bindings.some((binding) => binding.startsWith("1.2")))
		.map(
			(lesson) =>
				`<li><button type="button" class="text-button" data-lesson="${lesson.id}" lang="fr">${esc(lesson.title)}</button></li>`,
		)
		.join(
			"",
		)}</ul></section><section class="panel"><h2>Hören, Sprechen und Recherchieren</h2><p>Die Hör- und Aussprache-Skripte können lokal vorgelesen werden. Echte Varietäten, Hintergrundgeräusche, Körpersprache und natürliche Dialoge werden dadurch nicht vollständig geübt. Nutze zusätzlich echte Aufnahmen und Partnergespräche.</p><p>Das Paket übt einen ausgewählten Wortschatz. Dein Lehrwerk, Unterricht und eigene Wörter ergänzen ihn. Ein eigenes Vokabelheft mit neuen Wendungen, Aussprache und Beispielsätzen gehört dazu. Aktuelle Recherche, zusätzliche Lektüre und Lehrkraftfeedback bleiben weitere Aufgaben.</p></section><section class="panel"><h2>Quellen</h2><ul class="source-list">${SOURCES.map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a></li>`).join("")}</ul></section></div>`;
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
		localStorage.setItem("franzoesisch_gym6_theme", theme);
	} catch {
		/* Theme still changes for this visit. */
	}
});
document
	.querySelector("#zam")
	?.addEventListener("click", () =>
		showDialog(
			"Mit ZAM behalten",
			`<p>Für beide Lernpfade sind zusammen 222 Wiederholungsfragen vorbereitet. Jede führt zurück zu ihrer Lektion.</p><p>Wenn die Zelle veröffentlicht und in ZAM verfügbar ist, findest du sie unter „Aus der ZAM Academy“. Die Lektionen der beiden Lernpfade haben eigene Karten. Die Zelle heißt <strong>${esc(ZAM_CELL_ID)}</strong>.</p><p>Du kannst hier auch ohne Konto alle Lektionen offline üben.</p>`,
		),
	);
document.querySelector("#reset")?.addEventListener("click", () => {
	showDialog(
		"Fortschritt zurücksetzen?",
		'<p>Deine lokalen Antworten und Häkchen dieses Französisch-Pakets werden gelöscht. Das lässt sich nicht rückgängig machen.</p><button type="button" class="button danger" id="confirm-reset">Fortschritt löschen</button>',
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
	if (view === "path") renderPath();
	else syncSavedState();
	renderStats();
});

applyRoute();
