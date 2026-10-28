import "./styles.css";
import { findLesson, LESSONS, SOURCES, STAGES } from "./curriculum";
import { canAccept, canReview, checkCases, esc, quizOptions } from "./practice";
import {
	completion,
	confirmWriting,
	freshProgress,
	isComplete,
	loadProgress,
	recordQuizAnswer,
	saveProgress,
	submitCaseAnswers,
	updateDraft,
	writingKey,
} from "./storage/progress";
import type { Lesson, Level } from "./types";
import { parseTrainingDeepLink, trainingBaseUrl } from "./zam/zam-link";

function required<T>(value: T | undefined): T {
	if (value === undefined) throw new Error("Missing curriculum entry");
	return value;
}
function element<T extends Element = HTMLElement>(selector: string): T {
	const found = document.querySelector<T>(selector);
	if (!found) throw new Error(`Missing page element: ${selector}`);
	return found;
}
const main = element<HTMLElement>("#main");
const dialog = element<HTMLDialogElement>("#dialog");
let progress = loadProgress();
let view: "path" | "lesson" | "reference" = "path";
let lessonId = LESSONS[0].id;
let routeNotice = "";

function stats(): void {
	const count = completion(progress);
	element("#progress-strip").innerHTML =
		`<label for="path-progress">Level ${progress.level}: ${count.completed} von ${count.total} bearbeitet</label><progress id="path-progress" value="${count.completed}" max="${count.total}"></progress>`;
}
async function persist(): Promise<void> {
	const active = progress;
	const saved = await saveProgress(active);
	if (active !== progress) return;
	element<HTMLElement>("#storage-warning").hidden = saved;
	if (view === "path") {
		// Navigation rendered before the asynchronous merge. Refresh the path's
		// lesson marks, stage counts and next task from the adopted progress.
		render();
		return;
	}
	const draft = main.querySelector<HTMLTextAreaElement>("#draft");
	if (view === "lesson" && draft) {
		const current = progress.drafts[writingKey(lessonId, progress.level)] ?? "";
		if (draft.value !== current) {
			draft.value = current;
			element<HTMLButtonElement>("#compare").disabled = !canReview(current);
			element("#comparison").innerHTML = "";
			element("#writing-status").textContent =
				"Der Entwurf wurde in einem anderen Tab geändert. Bitte erneut vergleichen.";
		}
	}
	stats();
}
function navigate(id?: string): void {
	routeNotice = "";
	if (id && findLesson(id)) {
		lessonId = id;
		view = "lesson";
	} else view = id === "reference" ? "reference" : "path";
	const hash =
		view === "lesson"
			? `#lesson=${lessonId}&level=${progress.level}`
			: view === "reference"
				? "#view=reference"
				: "";
	history.replaceState(
		null,
		"",
		`${trainingBaseUrl(location.pathname, location.search)}${hash}`,
	);
	void persist();
	render();
	main.focus();
	window.scrollTo({ top: 0, behavior: "instant" });
}
const levelSelect = (): string =>
	`<label class="level-select">Aufgabenstufe <select id="level"><option value="1" ${progress.level === 1 ? "selected" : ""}>Level 1 · Anwenden</option><option value="2" ${progress.level === 2 ? "selected" : ""}>Level 2 · Transfer</option></select></label>`;
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
	const lesson = findLesson(lessonId);
	main.dataset.stage = view === "lesson" ? lesson?.stage : "";
	if (view === "lesson" && lesson) renderLesson(lesson);
	else if (view === "reference") renderReference();
	else renderPath();
	stats();
	main
		.querySelectorAll<HTMLButtonElement>("[data-lesson]")
		.forEach(
			(button) =>
				void button.addEventListener("click", () =>
					navigate(button.dataset.lesson),
				),
		);
	main.querySelector("#back")?.addEventListener("click", () => navigate());
	main
		.querySelector<HTMLSelectElement>("#level")
		?.addEventListener("change", (event) => {
			progress.level = Number(
				(event.target as HTMLSelectElement).value,
			) as Level;
			navigate(view === "lesson" ? lessonId : undefined);
		});
}
function renderPath(): void {
	const next = LESSONS.find((l) => !isComplete(progress, l.id));
	main.innerHTML = `${routeNotice ? `<p class="notice" role="status">${esc(routeNotice)}</p>` : ""}
    <section class="hero"><div><div class="eyebrow">Realschule 8 · LehrplanPLUS Bayern</div><h1>Genau hinsehen.<br> Mit Worten weiterkommen.</h1><p>Geschichten entdecken, Informationen prüfen und die eigene Meinung begründen. Deutsch üben: mit kurzen Texten, konkreten Fällen und deinen eigenen Worten.</p><button class="button accent" id="continue">${next ? (completion(progress).completed ? "Weiterüben" : "Mit Deutsch starten") : "Noch einmal vertiefen"} ↗</button><p class="small">40 Lektionen · 4 Lernbereiche · zwei Aufgabenstufen</p></div><aside class="hero-note"><div class="eyebrow">Dein nächster Schritt</div><strong>${esc(next?.title ?? "Deine Texte weiterentwickeln")}</strong><p>Erst verstehen und ausprobieren. Dann selbst schreiben, ein Muster vergleichen und gezielt überarbeiten.</p><span class="small">Ohne Konto · funktioniert auch offline</span></aside></section>
    <div class="path-heading"><div><h2>Dein Lernpfad</h2><p>Du kannst jede Lektion direkt öffnen. Dein Fortschritt zählt für die gewählte Aufgabenstufe.</p></div>${levelSelect()}</div>
    <div class="stages">${STAGES.map((stage) => {
			const lessons = LESSONS.filter((l) => l.stage === stage.id);
			return `<section class="stage" data-stage="${stage.id}"><div class="stage-header"><span class="stage-icon" aria-hidden="true">${stage.icon}</span><div><h3>${esc(stage.title)}</h3><span class="small">${esc(stage.subtitle)}</span></div><span class="stage-count">${lessons.filter((l) => isComplete(progress, l.id)).length}/${lessons.length}</span></div><ol>${lessons.map((l) => `<li><button class="lesson-link ${isComplete(progress, l.id) ? "complete" : ""}" data-lesson="${l.id}"><span class="lesson-dot" aria-hidden="true">${isComplete(progress, l.id) ? "✓" : ""}</span><span><strong>${esc(l.title)}</strong><small>${esc(l.skill)}</small></span><span class="lesson-status">Öffnen →</span></button></li>`).join("")}</ol></section>`;
		}).join(
			"",
		)}</div><aside class="notice"><strong>Deine Praxis gehört dazu.</strong><p>Eigene Texte werden hier nicht automatisch bewertet. Echte Gespräche, Vorträge und Aufführungen, eine Jugendbuch-Ganzschrift, weitere Originallektüre und eigene Recherche ergänzen die App. Ein Häkchen dokumentiert bearbeitete Aufgaben und deine Selbsteinschätzung.</p><button class="text-button" id="practice-info">Quellen und ergänzende Praxis ansehen →</button></aside>`;
	element("#continue").addEventListener("click", () =>
		navigate(next?.id ?? LESSONS[0].id),
	);
	element("#practice-info").addEventListener("click", () =>
		navigate("reference"),
	);
}
function renderLesson(lesson: Lesson): void {
	const task = lesson.tasks[progress.level];
	const key = writingKey(lesson.id, progress.level);
	const stage = required(STAGES.find((s) => s.id === lesson.stage));
	const index = LESSONS.indexOf(lesson);
	const answers = progress.cases[lesson.id] ?? [];
	main.innerHTML = `<div class="lesson-top"><button class="text-button" id="back">← Zum Lernpfad</button>${levelSelect()}</div><div class="lesson-heading"><div class="eyebrow">${esc(stage.title)} · ${index + 1} / ${LESSONS.length}</div><h1>${esc(lesson.title)}</h1><p class="intro">${esc(lesson.skill)}</p><p class="small">${esc(lesson.lehrplan)}</p></div>
    <div class="lesson-columns"><div class="lesson-content"><section class="panel"><h2>Verstehen</h2>${lesson.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}<aside class="takeaway"><strong>Merke</strong><p>${esc(lesson.takeaway)}</p></aside></section><section class="panel"><h2>Dein Material</h2><p class="small">${esc(lesson.materialLabel)}</p><p class="material">${esc(lesson.material)}</p></section>
    <section class="panel"><h2>1 · Schnellcheck</h2><p>${esc(lesson.quiz.question)}</p><div class="quiz-options">${quizOptions(
			lesson,
		)
			.map((o) => `<button class="quiz-choice">${esc(o)}</button>`)
			.join(
				"",
			)}</div><div id="quiz-feedback" role="status"></div>${progress.quizDone.includes(lesson.id) ? '<p class="done-mark" id="quiz-done">Schon richtig bearbeitet · du kannst erneut prüfen.</p>' : ""}</section>
    <section class="panel"><h2>2 · Am Fall entscheiden</h2><p class="small">Wähle für jeden Fall die passende Aussage. Du erhältst zu jeder Entscheidung eine Begründung.</p><form id="cases-form">${lesson.cases.map((c, i) => `<fieldset class="case" data-case="${i}"><legend>${esc(c.prompt)}</legend>${c.options.map((o) => `<label><input type="radio" name="case-${i}" required ${answers[i] === o ? "checked" : ""} value="${esc(o)}"><span>${esc(o)}</span></label>`).join("")}</fieldset>`).join("")}<button class="button secondary" type="submit">Entscheidungen prüfen</button></form><div id="case-feedback" role="status"></div></section>
    <section class="panel"><h2>3 · Mit eigenen Worten</h2><p class="task-prompt">${esc(task.prompt)}</p><label class="answer-label" for="draft">Dein Entwurf</label><textarea id="draft" maxlength="8000" rows="7" aria-describedby="draft-note">${esc(progress.drafts[key] ?? "")}</textarea><span id="draft-note" class="small">Mindestens 20 Zeichen öffnen den Mustervergleich. Das ist keine Qualitätsbewertung. Eigene gute Lösungen können anders aussehen.</span><div class="self-actions"><button class="button secondary" id="compare" ${canReview(progress.drafts[key] ?? "") ? "" : "disabled"}>Mit einem Muster vergleichen</button></div><div id="comparison"></div><p class="done-mark" id="writing-status" role="status">${progress.writingDone.includes(key) ? "Eigene Antwort verglichen und selbst eingeschätzt." : ""}</p></section>
    ${lesson.extension ? `<section class="panel"><h2>4 · In der Praxis weitergehen</h2><p>${esc(lesson.extension)}</p><p class="small">Diese zusätzliche Leistung wird hier nicht automatisch geprüft oder als erledigt bestätigt.</p></section>` : ""}</div>
    <aside class="lesson-aside"><section class="aside-card"><h2>Deine Schritte</h2><ol><li>Schnellcheck beantworten</li><li>Zwei Fälle entscheiden</li><li>Selbst schreiben und vergleichen</li></ol><p class="small">Level 1 und Level 2 haben eigene Entwürfe und Abschlüsse. Die Fallentscheidungen und der Schnellcheck gelten für beide.</p></section><section class="aside-card"><h2>Quellen und weiterlesen</h2><ul class="source-list">${lesson.sourceIds
			.map((id) => required(SOURCES.find((s) => s.id === id)))
			.map(
				(s) =>
					`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`,
			)
			.join(
				"",
			)}</ul><p class="small">Externe Quellen öffnen erst auf deinen Klick.</p></section></aside></div>
    <div class="lesson-navigation"><button class="button secondary" id="previous" ${index === 0 ? "disabled" : ""}>← Vorige Lektion</button><button class="button accent" id="next" ${index === LESSONS.length - 1 ? "disabled" : ""}>Nächste Lektion →</button></div>`;
	element("#previous").addEventListener("click", () =>
		navigate(LESSONS[index - 1]?.id),
	);
	element("#next").addEventListener("click", () =>
		navigate(LESSONS[index + 1]?.id),
	);
	main.querySelectorAll<HTMLButtonElement>(".quiz-choice").forEach(
		(button) =>
			void button.addEventListener("click", () => {
				const correct = button.textContent === lesson.quiz.answer;
				recordQuizAnswer(progress, lesson.id, correct);
				main.querySelector("#quiz-done")?.remove();
				main
					.querySelectorAll(".quiz-choice")
					.forEach((b) => void b.classList.toggle("selected", b === button));
				element("#quiz-feedback").innerHTML =
					`<p class="feedback ${correct ? "success" : "hint"}">${correct ? `Richtig. ${esc(lesson.quiz.explanation)}` : "Prüfe noch einmal. Lies die drei Antworten noch einmal."}</p>`;
				void persist();
			}),
	);
	// Only a submitted form replaces stored decisions. Unsubmitted selections
	// remain local to this view and leave the previous evidence untouched.
	const groups = () => [
		...main.querySelectorAll<HTMLFieldSetElement>("[data-case]"),
	];
	const decisions = () => [
		...main.querySelectorAll<HTMLInputElement>("[data-case] input"),
	];
	decisions().forEach(
		(select) =>
			void select.addEventListener("change", () => {
				element("#case-feedback").innerHTML = "";
				groups().forEach((s) => void s.removeAttribute("aria-invalid"));
			}),
	);
	element("#cases-form").addEventListener("submit", (event) => {
		event.preventDefault();
		const values = groups().map(
			(group) =>
				group.querySelector<HTMLInputElement>("input:checked")?.value ?? "",
		);
		const results = checkCases(lesson.cases, values);
		submitCaseAnswers(progress, lesson.id, values);
		element("#case-feedback").innerHTML =
			`<div class="feedback ${results.every(Boolean) ? "success" : "hint"}"><strong>${results.filter(Boolean).length} von ${results.length} richtig.</strong><ol>${results.map((correct, i) => `<li>${correct ? "✓ " : "Noch prüfen: "}${esc(lesson.cases[i].feedback)}</li>`).join("")}</ol></div>`;
		groups().forEach(
			(s, i) => void s.setAttribute("aria-invalid", String(!results[i])),
		);
		void persist();
	});
	const draft = element<HTMLTextAreaElement>("#draft");
	draft.addEventListener("input", () => {
		updateDraft(progress, lesson.id, progress.level, draft.value);
		element<HTMLButtonElement>("#compare").disabled = !canReview(draft.value);
		element("#comparison").innerHTML = "";
		element("#writing-status").textContent =
			"Entwurf geändert · bitte erneut vergleichen.";
		void persist();
	});
	element("#compare").addEventListener("click", () => {
		if (!canReview(draft.value)) return;
		const comparedText = draft.value;
		element("#comparison").innerHTML =
			`<div class="model-answer"><h3>Eine mögliche Lösung</h3><p class="material">${esc(task.model)}</p><p class="small">Bei Recherche- und Praxisaufgaben ist das Muster eine Strukturhilfe. Eigene Fundstellen und echte Durchführung ergänzt du selbst.</p><fieldset class="rubric"><legend>Meine Selbsteinschätzung</legend>${task.criteria.map((c) => `<label><input type="checkbox" class="criterion">${esc(c)}</label>`).join("")}</fieldset><button class="button accent" id="accept" disabled>Vergleich speichern</button></div>`;
		const checks = () =>
			[...main.querySelectorAll<HTMLInputElement>(".criterion")].map(
				(c) => c.checked,
			);
		const accept = element<HTMLButtonElement>("#accept");
		main.querySelectorAll(".criterion").forEach(
			(c) =>
				void c.addEventListener("change", () => {
					accept.disabled = !canAccept(draft.value, checks());
				}),
		);
		accept.addEventListener("click", () => {
			if (!canAccept(draft.value, checks())) return;
			const confirmed = confirmWriting(
				progress,
				lesson.id,
				progress.level,
				comparedText,
			);
			element("#writing-status").textContent = confirmed
				? "Eigene Antwort verglichen und selbst eingeschätzt."
				: "Der Entwurf wurde geändert. Bitte erneut vergleichen.";
			accept.disabled = true;
			void persist();
		});
	});
}
function renderReference(): void {
	main.innerHTML = `<div class="reference"><button class="text-button" id="back">← Zum Lernpfad</button><h1>Quellen & Praxis</h1><p class="intro">Die App bereitet vor. Deine Stimme, deine Lektüre und echte Rückmeldungen machen daraus Praxis.</p><section class="panel"><h2>Den Lernpfad nutzen</h2><p>Alle 40 Lektionen sind frei zugänglich. Level 1 übt die Anwendung, Level 2 verlangt Transfer, Vergleich oder ein begründetes Urteil. Ein Abschluss setzt einen richtigen Schnellcheck, zwei richtige Fallentscheidungen und deinen bestätigten Mustervergleich voraus.</p><p>Die App speichert lokal in diesem Browser. Ein anderes Gerät oder ein anderer Browser hat einen eigenen Fortschritt. Ein Häkchen ist kein Nachweis vollständiger Kompetenz und keine Prüfungsnote.</p></section><section class="panel"><h2>Zusätzliche Unterrichtspraxis</h2><ul><li>Echte Hörbeiträge, Gespräche, Diskussionen und Vorträge mit Beobachtung von Stimme, Mimik und Gestik.</li><li>Eine eigene Inszenierung und eine tatsächliche Aufführung oder Aufzeichnung mit begründeter Kritik.</li><li>Mindestens ein geeignetes Jugendbuch als Ganzschrift lesen, ein Lesejournal führen und Empfehlungen austauschen.</li><li>Ausgewählte Originaltexte der Aufklärung, des Sturm und Drang und der Klassik lesen; unter anderem Goethe einbeziehen und Textbelege vergleichen.</li><li>Eine tatsächliche Filmszene mit der dramatischen Vorlage vergleichen, echte Bilder als Schreibimpuls nutzen sowie eigene Recherche und Lehrkraftfeedback ergänzen.</li><li>Persönliche Fehlerschwerpunkte an neuen eigenen Texten erneut prüfen.</li></ul><p>Die Materialien sind überwiegend eigene, als erfunden gekennzeichnete Texte und Daten. Kurze Originalstellen von Lessing und Goethe sind belegt. Die Schreibaufträge üben Teilhandlungen; ein Häkchen bescheinigt die Bearbeitung und Selbsteinschätzung.</p></section><section class="panel"><h2>Quellen</h2><p class="small">Lehrplanabgleich am 28. Oktober 2026. Links benötigen eine Verbindung und öffnen erst auf deinen Klick.</p><ul class="source-list">${SOURCES.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`).join("")}</ul></section></div>`;
}
function showDialog(title: string, html: string): void {
	dialog.innerHTML = `<div class="dialog-heading"><h2 id="dialog-title">${esc(title)}</h2><button class="icon-button" id="close-dialog" aria-label="Schließen">×</button></div>${html}`;
	element("#close-dialog").addEventListener("click", () => dialog.close());
	dialog.showModal();
}
function applyRoute(): void {
	const link = parseTrainingDeepLink(location.hash, location.search);
	const hash = new URLSearchParams(location.hash.replace(/^#/, ""));
	routeNotice = "";
	if (link.level) progress.level = link.level;
	if (link.lessonId && findLesson(link.lessonId)) {
		lessonId = link.lessonId;
		view = "lesson";
	} else {
		view = hash.get("view") === "reference" ? "reference" : "path";
		if (
			hash.has("lesson") ||
			new URLSearchParams(location.search).has("lesson")
		) {
			view = "path";
			routeNotice =
				"Diese Lektion ist nicht vorhanden. Wähle eine Lektion aus dem Lernpfad.";
		}
	}
	void persist();
	render();
	main.focus();
	window.scrollTo({ top: 0, behavior: "instant" });
}
element("#home").addEventListener("click", (event) => {
	event.preventDefault();
	navigate();
});
element(".skip-link").addEventListener("click", (event) => {
	event.preventDefault();
	main.focus();
	main.scrollIntoView();
});
document
	.querySelectorAll<HTMLButtonElement>("[data-view]")
	.forEach(
		(b) =>
			void b.addEventListener("click", () =>
				navigate(b.dataset.view === "reference" ? "reference" : undefined),
			),
	);
element("#theme").addEventListener("click", () => {
	const current =
		document.documentElement.dataset.theme ??
		(matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
	const theme = current === "dark" ? "light" : "dark";
	document.documentElement.dataset.theme = theme;
	try {
		localStorage.setItem("deutsch_rs8_theme", theme);
	} catch {
		/* Theme works for this visit. */
	}
});
element("#zam").addEventListener("click", () =>
	showDialog(
		"Mit ZAM behalten",
		"<p>80 Wiederholungsfragen führen direkt zu den passenden Lektionen zurück.</p><p>Wähle in ZAM die Academy und nimm das Paket Deutsch 8 Realschule auf. Sobald es im Academy-Katalog veröffentlicht ist, kannst du die Wiederholungsfragen dort lernen. Die Übungen hier funktionieren ohne Konto.</p>",
	),
);
element("#reset").addEventListener("click", () => {
	showDialog(
		"Fortschritt zurücksetzen?",
		'<p>Deine lokalen Deutsch-8-Entwürfe und Häkchen werden gelöscht. Das lässt sich nicht rückgängig machen.</p><button class="button danger" id="confirm-reset">Fortschritt löschen</button>',
	);
	element("#confirm-reset").addEventListener("click", () => {
		progress = freshProgress();
		dialog.close();
		navigate();
	});
});
window.addEventListener("hashchange", applyRoute);
applyRoute();
