import "./styles.css";
import { findLesson, LESSONS, SOURCES, STAGES } from "./curriculum";
import { bindLab, renderLab } from "./labs";
import { canAccept, canReview, checkCases, esc, quizOptions } from "./practice";
import {
	completion,
	freshProgress,
	isComplete,
	loadProgress,
	saveProgress,
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
function persist(): void {
	element<HTMLElement>("#storage-warning").hidden = saveProgress(progress);
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
	persist();
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
			if (view === "lesson") navigate(lessonId);
			else {
				persist();
				render();
			}
		});
}
function renderPath(): void {
	const next = LESSONS.find((l) => !isComplete(progress, l.id));
	main.innerHTML = `${routeNotice ? `<p class="notice" role="status">${esc(routeNotice)}</p>` : ""}
    <section class="hero"><div><div class="eyebrow">Realschule 10 · LehrplanPLUS Bayern</div><h1>Demokratie verstehen.<br> Deine Stimme zählt.</h1><p>Wer entscheidet? Wie kannst du mitwirken? Prüfe Quellen, erkunde politische Regeln und entwickle ein begründetes Urteil.</p><button class="button accent" id="continue">${next ? (completion(progress).completed ? "Weiterüben" : "Mit Politik starten") : "Noch einmal vertiefen"} ↗</button><p class="small">32 Lektionen · 4 Lernbereiche · zwei Aufgabenstufen</p></div><aside class="hero-note"><div class="eyebrow">Dein nächster Schritt</div><strong>${esc(next?.title ?? "Dein Urteil weiterentwickeln")}</strong><p>Erst verstehen, dann Fälle prüfen und selbst urteilen. Probiere Kompromisse aus und untersuche reale politische Fragen.</p><span class="small">Ohne Konto · funktioniert auch offline</span></aside></section>
    <div class="path-heading"><div><h2>Dein Lernpfad</h2><p>Du kannst jede Lektion direkt öffnen. Dein Fortschritt zählt für die gewählte Aufgabenstufe.</p></div>${levelSelect()}</div>
    <div class="stages">${STAGES.map((stage) => {
			const lessons = LESSONS.filter((l) => l.stage === stage.id);
			return `<section class="stage" data-stage="${stage.id}"><div class="stage-header"><span class="stage-icon" aria-hidden="true">${stage.icon}</span><div><h3>${esc(stage.title)}</h3><span class="small">${esc(stage.subtitle)}</span></div><span class="stage-count">${lessons.filter((l) => isComplete(progress, l.id)).length}/${lessons.length}</span></div><ol>${lessons.map((l) => `<li><button class="lesson-link ${isComplete(progress, l.id) ? "complete" : ""}" data-lesson="${l.id}"><span class="lesson-dot" aria-hidden="true">${isComplete(progress, l.id) ? "✓" : ""}</span><span><strong>${esc(l.title)}</strong><small>${esc(l.skill)}</small></span><span class="lesson-status">Öffnen →</span></button></li>`).join("")}</ol></section>`;
		}).join(
			"",
		)}</div><aside class="notice"><strong>Deine Praxis gehört dazu.</strong><p>Eigene Texte werden hier nicht automatisch bewertet. Echte Debatten, aktuelle Recherche, Rollenspiele und Erkundungen politischer Entscheidungsorte ergänzen die App. Deine politische Meinung wird nicht bewertet. Ein Häkchen dokumentiert bearbeitete Aufgaben und deine Selbsteinschätzung.</p><button class="text-button" id="practice-info">Quellen und ergänzende Praxis ansehen →</button></aside>`;
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
	main.innerHTML = `<div class="lesson-top"><button class="text-button" id="back">← Zum Lernpfad</button>${levelSelect()}</div><div class="lesson-heading"><div class="eyebrow">${esc(stage.title)} · ${index + 1} / ${LESSONS.length}</div><h1>${esc(lesson.title)}</h1><p class="intro">${esc(lesson.skill)}</p></div>
    <div class="lesson-columns"><div class="lesson-content"><section class="panel"><h2>Verstehen</h2>${lesson.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}<p class="takeaway"><strong>Merke</strong>${esc(lesson.takeaway)}</p></section><section class="panel"><h2>Dein Material</h2><p class="small">${esc(lesson.materialLabel)}</p><p class="material">${esc(lesson.material)}</p>${renderLab(lesson.id)}</section>
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
	bindLab(main, lesson.id);
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
				progress.quizDone = progress.quizDone.filter((id) => id !== lesson.id);
				if (correct) progress.quizDone.push(lesson.id);
				main.querySelector("#quiz-done")?.remove();
				main
					.querySelectorAll(".quiz-choice")
					.forEach((b) => void b.classList.toggle("selected", b === button));
				element("#quiz-feedback").innerHTML =
					`<p class="feedback ${correct ? "success" : "hint"}">${correct ? "Richtig. " : "Prüfe noch einmal. "}${esc(lesson.quiz.explanation)}</p>`;
				persist();
			}),
	);
	// Selections are drafts until checked; changing one immediately removes the
	// previous completion evidence. Only submitted decisions enter progress.cases.
	const groups = () => [
		...main.querySelectorAll<HTMLFieldSetElement>("[data-case]"),
	];
	const decisions = () => [
		...main.querySelectorAll<HTMLInputElement>("[data-case] input"),
	];
	decisions().forEach(
		(select) =>
			void select.addEventListener("change", () => {
				delete progress.cases[lesson.id];
				element("#case-feedback").innerHTML = "";
				groups().forEach((s) => void s.removeAttribute("aria-invalid"));
				persist();
			}),
	);
	element("#cases-form").addEventListener("submit", (event) => {
		event.preventDefault();
		const values = groups().map(
			(group) =>
				group.querySelector<HTMLInputElement>("input:checked")?.value ?? "",
		);
		const results = checkCases(lesson.cases, values);
		progress.cases[lesson.id] = values;
		element("#case-feedback").innerHTML =
			`<div class="feedback ${results.every(Boolean) ? "success" : "hint"}"><strong>${results.filter(Boolean).length} von ${results.length} richtig.</strong><ol>${results.map((correct, i) => `<li>${correct ? "✓ " : "Noch prüfen: "}${esc(lesson.cases[i].feedback)}</li>`).join("")}</ol></div>`;
		groups().forEach(
			(s, i) => void s.setAttribute("aria-invalid", String(!results[i])),
		);
		persist();
	});
	const draft = element<HTMLTextAreaElement>("#draft");
	draft.addEventListener("input", () => {
		updateDraft(progress, lesson.id, progress.level, draft.value);
		element<HTMLButtonElement>("#compare").disabled = !canReview(draft.value);
		element("#comparison").innerHTML = "";
		element("#writing-status").textContent =
			"Entwurf geändert · bitte erneut vergleichen.";
		persist();
	});
	element("#compare").addEventListener("click", () => {
		if (!canReview(draft.value)) return;
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
			if (!progress.writingDone.includes(key)) progress.writingDone.push(key);
			element("#writing-status").textContent =
				"Eigene Antwort verglichen und selbst eingeschätzt.";
			accept.disabled = true;
			persist();
		});
	});
}
function renderReference(): void {
	main.innerHTML = `<div class="reference"><button class="text-button" id="back">← Zum Lernpfad</button><h1>Quellen & Praxis</h1><p class="intro">Informationen prüfen, Interessen verstehen und ein eigenes begründetes Urteil bilden.</p><section class="panel"><h2>Den Lernpfad nutzen</h2><p>Alle 32 Lektionen sind frei zugänglich. Level 1 übt Anwendung, Level 2 Vergleich, Recherche und Urteil. Für eine bearbeitete Lektion zählen ein richtiger Schnellcheck, zwei richtige Fallentscheidungen und dein bestätigter Mustervergleich. Eine politische Position ist kein Abschlusskriterium.</p><p>Häkchen dokumentieren Arbeit und Selbsteinschätzung, keine vollständige Kompetenz oder Prüfungsnote. Eigene Texte werden nicht automatisch bewertet. Die Werkstätten zählen nicht als Nachweis tatsächlicher politischer Teilnahme.</p></section><section class="panel"><h2>Zusätzliche Unterrichtspraxis</h2><ul><li>Aktuelle journalistische Formen und zwei unabhängige datierte Quellen vergleichen; Ergebnisse selbst präsentieren.</li><li>Eine echte Karikatur, einen Satirebeitrag oder ein Lied im politischen Kontext untersuchen.</li><li>Gemeinsam debattieren, Rollen spielen und Rückmeldungen geben; Kompromiss und Gegenposition dokumentieren.</li><li>Eine Erkundung eines politischen Entscheidungsorts vorbereiten, durchführen und auswerten.</li><li>Einen eigenen politischen Text schreiben; eine Veröffentlichung ist eine gesonderte eigene Entscheidung.</li><li>Aktuelle EU-Entscheidung, Wirtschaftsindikatoren, globale Produktionsbedingungen und deutsche Außenpolitik mit tatsächlichen Quellen untersuchen.</li></ul><p>Fiktive Materialien sind als solche gekennzeichnet. Wahlrecht und Beispiele wurden am 25. Oktober 2026 abgeglichen. Geltende Regeln können sich ändern; aktuelle Recherche bleibt Teil des Lernens.</p></section><section class="panel"><h2>Modelle und Datenschutz</h2><p>Die Budgetwerkstatt verwendet erfundene Ratsgruppen und feste Zustimmungsschwellen. Sie zeigt Verhandlungsspielräume und errechnet keine beste politische Position. Das Einproduktmodell trennt Mengen- und Preiseffekte; es ersetzt keine amtliche BIP-Rechnung. Werkstatteinstellungen gelten für den laufenden Besuch der Lektion.</p><p>Entwürfe und Fortschritt bleiben lokal im Browser. Es gibt keine Konten, Werbung, Telemetrie oder automatischen Datenabrufe. Ein anderes Gerät hat einen eigenen Fortschritt. Externe Links öffnen erst auf deinen Klick.</p></section><section class="panel"><h2>Quellen</h2><p class="small">Abgleich: 25. Oktober 2026. Nutze für aktuelle politische Fragen datierte Quellen und prüfe geltende Regeln.</p><ul class="source-list">${SOURCES.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`).join("")}</ul></section></div>`;
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
	persist();
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
		localStorage.setItem("pug_rs10_theme", theme);
	} catch {
		/* Theme works for this visit. */
	}
});
element("#zam").addEventListener("click", () =>
	showDialog(
		"Mit ZAM behalten",
		"<p>64 Wiederholungsfragen führen direkt zu den passenden Lektionen zurück.</p><p>Dieses Paket ist ein lokaler Entwurf. Nach seiner Veröffentlichung kannst du es in der ZAM Academy auswählen und aufnehmen. Bis dahin kannst du hier ohne Konto weiterüben.</p>",
	),
);
element("#reset").addEventListener("click", () => {
	showDialog(
		"Fortschritt zurücksetzen?",
		'<p>Deine lokalen PuG-10-Entwürfe und Häkchen werden gelöscht. Das lässt sich nicht rückgängig machen.</p><button class="button danger" id="confirm-reset">Fortschritt löschen</button>',
	);
	element("#confirm-reset").addEventListener("click", () => {
		progress = freshProgress();
		dialog.close();
		navigate();
	});
});
window.addEventListener("hashchange", applyRoute);
applyRoute();
