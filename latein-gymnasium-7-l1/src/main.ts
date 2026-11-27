import "./styles.css";
import { renderStageIcon } from "./diagrams";
import { bindWorkshop, renderWorkshop } from "./workshop";
import {
	CORE_LESSONS,
	findLesson,
	LESSONS,
	SOURCES,
	STAGES,
} from "./curriculum";
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
	mergeProgress,
	resetProgress,
	STORAGE_KEY,
	isComplete,
	loadProgress,
	saveProgress,
	updateDraft,
	writingKey,
} from "./storage/progress";
import type { Lesson, Level } from "./types";
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
const practiceAnswers = new Map<string, string[]>();

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
}

function renderStats(): void {
	const count = completion(progress);
	element("#progress-strip").innerHTML =
		`<label for="path-progress">Kernpfad: ${count.completed} von ${count.total} geübt</label><progress id="path-progress" value="${count.completed}" max="${count.total}">${count.percent}%</progress>`;
}

function pageUrl(): string {
	return trainingBaseUrl(location.pathname, location.search);
}

function navigate(id?: string): void {
	routeNotice = "";
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
    <section class="hero"><div><div class="eyebrow">Gymnasium Bayern · 7. Klasse · 1. Fremdsprache</div><h1>Latein, das im Satz<br> sichtbar wird.</h1><p>Konjunktiv, Ablativus absolutus, Imperium Romanum, Politik und Mythos: Mit interaktiven Schaubildern, Texten und ZAM-Karten behältst du Struktur und Sinn im Blick.</p><button type="button" class="button accent" id="continue">${completion(progress).completed ? "Weiterüben" : "Mit Latein 7 starten"} <span aria-hidden="true">↗</span></button><p class="small">36 Lektionen · 108 Entdeckerziele · 108 verknüpfte ZAM-Karten</p></div>
    <aside class="hero-note"><div class="eyebrow">Dein nächster Schritt</div><strong>${esc(next.title)}</strong><p>Erst verstehen, dann im Schaubild prüfen und selbst übersetzen, bevor du mit einer möglichen Lösung vergleichst.</p><span class="small">Ohne Konto · Fortschritt in diesem Browser</span></aside></section>
    <div class="path-heading"><div><h2>Dein Lernpfad</h2><p>Sprachliche Basis, kultureller Kontext und Methodik greifen ineinander. Du kannst jede Lektion direkt öffnen.</p></div><label class="toggle" hidden><input id="foundations" type="checkbox" ${progress.includeFoundations ? "checked" : ""}>Ergänzungen zeigen</label></div>
    <div class="stages">${STAGES.filter(
			(stage) => !stage.optional || progress.includeFoundations,
		)
			.map((stage) => {
				const lessons = LESSONS.filter((lesson) => lesson.stage === stage.id);
				return `<section class="stage" style="--stage-hue:${stage.hue}"><div class="stage-header"><span class="stage-icon" aria-hidden="true">${renderStageIcon(stage.icon)}</span><div><h3>${esc(stage.title)}</h3><span class="small">${esc(stage.subtitle)}</span></div><span class="stage-count">${lessons.filter((lesson) => isComplete(progress, lesson.id)).length}/${lessons.length}</span></div><ol>${lessons.map((lesson) => `<li><button type="button" class="lesson-link ${isComplete(progress, lesson.id) ? "complete" : ""}" data-lesson="${lesson.id}"><span class="lesson-dot" aria-hidden="true">${isComplete(progress, lesson.id) ? "✓" : ""}</span><span><strong>${esc(lesson.title)}</strong><small>${esc(lesson.skill)}</small></span><span class="lesson-status">${isComplete(progress, lesson.id) ? "Geübt" : "Öffnen →"}</span></button></li>`).join("")}</ol></section>`;
			})
			.join(
				"",
			)}</div><aside class="notice"><strong>Üben ist mehr als ein Häkchen.</strong><p>Der Fortschritt zählt deine App-Aufgaben und deinen Mustervergleich. Regelmäßiges Vokabellernen mit deinem Lehrwerk, lautes Lesen und Unterrichtsgespräche ergänzen die App.</p></aside>`;
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
	main.innerHTML = `<div class="lesson-top"><button type="button" class="text-button" id="back">← Zum Lernpfad</button><label class="level-select" for="level">Aufgabenstufe <select id="level"><option value="1" ${progress.level === 1 ? "selected" : ""}>Level 1 · Anwenden</option><option value="2" ${progress.level === 2 ? "selected" : ""}>Level 2 · Transfer</option></select></label></div>
    <div class="lesson-heading" style="--stage-hue:${stage.hue}"><div class="eyebrow">${esc(stage.title)}${lesson.optional ? " · freiwillige Ergänzung" : ""}</div><h1>${esc(lesson.title)}</h1><p class="intro">${esc(lesson.skill)}</p></div>
    <div class="lesson-columns" style="--lesson-hue:${stage.hue}"><div class="lesson-content"><section class="panel"><h2>Verstehen</h2>${lesson.paragraphs.map((text) => `<p>${esc(text)}</p>`).join("")}<aside class="takeaway"><strong>Merke</strong><p>${esc(lesson.takeaway)}</p></aside></section>
    ${renderWorkshop(lesson)}
    <section class="panel" aria-labelledby="material-heading"><h2 id="material-heading">Dein Material</h2><p class="small">${esc(lesson.materialLabel)}</p><p class="material" lang="${lesson.materialLanguage}">${esc(lesson.material)}</p></section>
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
    <section class="panel"><h2>2 · Ausprobieren</h2><p class="small">Ergänze die kurzen Antworten. Großschreibung, Längenzeichen (Makrons) und ein Satzpunkt am Ende spielen keine Rolle.</p><form id="practice-form">${lesson.practice.map((item, itemIndex) => `<label class="practice-label" for="practice-${itemIndex}">${esc(item.prompt)}</label><input class="practice-input" id="practice-${itemIndex}" data-index="${itemIndex}" autocomplete="off" spellcheck="false" value="${esc(practiceAnswers.get(lesson.id)?.[itemIndex] ?? "")}" required>`).join("")}<button type="submit" class="button secondary">Antworten prüfen</button></form><div id="practice-feedback" role="status"></div>${progress.practiceDone.includes(lesson.id) ? '<p class="done-mark">Bereits richtig geübt.</p>' : ""}</section>
    <section class="panel"><h2>3 · Mit eigenen Worten</h2><p class="task-prompt">${esc(task.prompt)}</p><label class="answer-label" for="draft">Deine Antwort</label><textarea id="draft" rows="7" maxlength="8000">${esc(progress.drafts[key] ?? "")}</textarea><span class="small" id="draft-note">Mindestens 20 Zeichen, bevor du ein Muster vergleichst. Eigene Formulierungen dürfen abweichen.</span><div class="self-actions"><button type="button" class="button secondary" id="compare" ${canReview(progress.drafts[key] ?? "") ? "" : "disabled"}>Mit einem Muster vergleichen</button></div><div id="comparison"></div><p class="done-mark" id="writing-status" role="status">${progress.writingDone.includes(key) ? "Eigener Mustervergleich gespeichert." : ""}</p></section>
    </div><aside class="lesson-aside"><section class="aside-card"><h2>Deine Schritte</h2><ul class="checklist"><li>Entdeckerwerkstatt · 3 Ziele</li><li>1. Schnellcheck</li><li>2. Kurzaufgaben</li><li>3. Eigene Antwort + Vergleich</li></ul><p class="small">Werkstatt und Level 1 zählen zum Kernpfad. Level 2 ist zusätzliche Transferübung.</p></section><section class="aside-card"><h2>Quellen und weiterüben</h2><ul class="source-list">${lesson.sourceIds
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
			`<div class="model-answer"><h3>Eine mögliche Lösung</h3><p class="material" lang="${task.language ?? "de"}">${esc(task.model)}</p><p class="small">Vergleiche deine eigene Antwort. Eigene Formulierungen und gleichwertige Übersetzungsvarianten sind willkommen.</p><fieldset class="rubric"><legend>Meine Selbsteinschätzung</legend>${task.criteria.map((criterion) => `<label><input type="checkbox" class="criterion">${esc(criterion)}</label>`).join("")}</fieldset><button type="button" class="button accent" id="accept" disabled>Vergleich speichern</button><p class="small">Du bestätigst selbst, dass deine Antwort diese Punkte erfüllt.</p></div>`;
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
}

function renderReference(): void {
	main.innerHTML = `<div class="reference"><div class="eyebrow">Nachschlagen und weiterüben</div><h1>Grammatik- &amp; Epochen-Übersicht (Latein 7 · L1)</h1><p>Alle Kernregeln der 7. Klasse (1. Fremdsprache) im Überblick. Klicke auf eine Lektion, um sie direkt zu öffnen.</p>
	<section class="panel"><h2>Konjunktiv Präsens &amp; Perfekt</h2><div class="ref-table-wrap"><table class="ref-table"><thead><tr><th>Kategorie</th><th>Bildungsregel</th><th>Beispiel (3. Sg.)</th></tr></thead><tbody>
	<tr><td>Konj. Präsens Aktiv/Passiv</td><td>a-Konj. mit <em>-e-</em>, e-/i-/kons. Konj. mit <em>-a-</em></td><td lang="la">laudet / laudetur; moneat, audiat, regat</td></tr>
	<tr><td>Konj. Perfekt Aktiv</td><td>Perfektstamm + <em>-eri-</em> + Personalendung</td><td lang="la">laudaverim, laudaveris, laudaverit</td></tr>
	<tr><td>Konj. Perfekt Passiv</td><td>PPP (KNG-kongruent) + <em>sim, sis, sit …</em></td><td lang="la">laudatus, -a, -um sit</td></tr>
	<tr><td>Consecutio temporum</td><td>Haupttempus: Präs. (glz.) / Perf. (vrz.) · Nebentempus: Impf. (glz.) / Plusq. (vrz.)</td><td lang="la">rogo, quid faciat / fecerit · rogavi, quid faceret / fecisset</td></tr>
	</tbody></table></div></section>
	<section class="panel"><h2>Steigerung, Nominalformen &amp; Ablativus absolutus</h2><div class="ref-table-wrap"><table class="ref-table"><thead><tr><th>Phänomen</th><th>Kennzeichen</th><th>Bedeutung / Wiedergabe</th></tr></thead><tbody>
	<tr><td>Komparativ &amp; Superlativ</td><td><em>-ior / -ius</em>; <em>-issimus, -a, -um</em> (sowie <em>-rimus / -limus</em>)</td><td>Vergleich mit <em>quam</em> oder <em>Ablativus comparationis</em></td></tr>
	<tr><td>Partizip &amp; Infinitiv Futur Aktiv</td><td><em>-urus, -ura, -urum</em> (+ <em>esse</em>)</td><td>Nachzeitigkeit im AcI und PC („im Begriff sein zu …“)</td></tr>
	<tr><td>Gerund</td><td><em>-ndi, -ndo, -ndum, -ndo</em> (Verbalsubstantiv im Neutr. Sg.)</td><td>dekliniertes Tun („das …“, z. B. <em>ars dicendi</em>)</td></tr>
	<tr><td>Ablativus absolutus</td><td>Nomen im Abl. + PPP (vorzeitig), PPA (gleichzeitig) oder zweites Nomen</td><td>Adverbialsatz (nachdem/während/weil/obwohl/als), Präpositionalausdruck, Beiordnung</td></tr>
	</tbody></table></div></section>
	<section class="panel"><h2>Lektionen nach Lernbereichen</h2><ul class="reference-links">${LESSONS.map((lesson) => `<li><button type="button" class="text-button" data-lesson="${lesson.id}">${esc(lesson.title)}</button> · <span class="small">${esc(lesson.skill)}</span></li>`).join("")}</ul></section>
	<section class="panel"><h2>Hinweise zu Wortschatz &amp; Museumsbesuchen</h2><p>Das Paket übt gezielt Kern- und Kulturvokabeln der 7. Klasse im Satzzusammenhang. Der Gesamtumfang von rund 1200 Grundwortschatz-Wörtern wird dauerhaft mit deinem Lehrwerk, einer eigenen Vokabelkartei und regelmäßigem lautem Vorlesen aufgebaut.</p></section>
	<section class="panel"><h2>Geprüfte Quellen</h2><ul class="source-list">${SOURCES.map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a></li>`).join("")}</ul></section></div>`;
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
		localStorage.setItem("latein_gym7_l1_theme", theme);
	} catch {
		/* Theme still changes for this visit. */
	}
});
document
	.querySelector("#zam")
	?.addEventListener("click", () =>
		showDialog(
			"Mit ZAM behalten",
			`<p>Für dieses Paket sind 108 Wiederholungsfragen vorbereitet. Jede führt zurück zu ihrer Lektion.</p><p>Die Karten stehen im Academy-Katalog. In ZAM erscheint es im Importmenü „Aus der ZAM Academy“, sobald ZAM die Academy-Zelle übernommen hat. Die Zelle heißt <strong>${esc(ZAM_CELL_ID)}</strong>.</p><p>Du kannst hier auch ohne Konto alle Lektionen offline üben.</p>`,
		),
	);
document.querySelector("#reset")?.addEventListener("click", () => {
	showDialog(
		"Fortschritt zurücksetzen?",
		'<p>Deine lokalen Antworten und Häkchen dieses Latein-Pakets werden gelöscht. Das lässt sich nicht rückgängig machen.</p><button type="button" class="button danger" id="confirm-reset">Fortschritt löschen</button>',
	);
	document.querySelector("#confirm-reset")?.addEventListener("click", () => {
		progress = resetProgress(progress);
		practiceAnswers.clear();
		dialog.close();
		navigate();
	});
});
window.addEventListener("hashchange", applyRoute);
window.addEventListener("storage", (event) => {
	if (event.key !== STORAGE_KEY) return;
	const stored = loadProgress();
	if (stored.resetAt > progress.resetAt) {
		practiceAnswers.clear();
	}
	progress = mergeProgress(stored, progress, baseline);
	baseline = structuredClone(stored);
	if (view === "path") renderPath();
	else syncSavedState();
	renderStats();
});

applyRoute();
