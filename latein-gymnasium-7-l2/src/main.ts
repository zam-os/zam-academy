import "./styles.css";
import {
	CORE_LESSONS,
	findLesson,
	LESSONS,
	SOURCES,
	STAGES,
} from "./curriculum";
import { bindExplorerDiagram, renderExplorerDiagram } from "./diagrams";
import { heroBannerSvg, stageIconSvg } from "./icons";
import {
	canAccept,
	canReview,
	checkPractice,
	esc,
	practiceFeedback,
	quizFeedback,
	quizOptions,
} from "./practice";
import {
	completion,
	isComplete,
	loadProgress,
	mergeProgress,
	resetProgress,
	saveProgress,
	STORAGE_KEY,
	updateDraft,
	writingKey,
} from "./storage/progress";
import type { Lesson, Level } from "./types";
import {
	parseTrainingDeepLink,
	trainingBaseUrl,
	ZAM_CELL_ID,
} from "./zam/zam-link";
import { bindWorkshop, renderWorkshop } from "./workshop";

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
		<section class="hero">
			<div>
				<div class="eyebrow">Gymnasium Bayern · 7. Klasse · 2. Fremdsprache (L2)</div>
				<h1>Latein durchschauen,<br> sicher übersetzen.</h1>
				<p>Von der u- und e-Deklination über Passiv, Participium coniunctum, Ablativus absolutus und Konjunktiv bis zu Hannibal, Augustus, den sieben Weltwundern und antiken Mythen. Jede Lektion zeigt dir den Aufbau mit einem interaktiven Schaubild.</p>
				<button type="button" class="button accent" id="continue">${completion(progress).completed ? "Weiterüben" : "Mit Latein 7 starten"} <span aria-hidden="true">↗</span></button>
				<p class="small">40 Lektionen · 120 Entdeckerziele · 8 interaktive Sprach- und Kulturmodelle · 120 ZAM-Karten</p>
			</div>
			<aside class="hero-note">
				${heroBannerSvg()}
				<div class="eyebrow">Dein nächster Schritt</div>
				<strong>${esc(next.title)}</strong>
				<p>Erst das Schaubild erkunden, dann Formen und Sätze selbst prüfen und anschließend deine eigene Übersetzung mit einem Muster vergleichen.</p>
				<span class="small">Ohne Konto · Fortschritt bleibt in diesem Browser</span>
			</aside>
		</section>
		<div class="path-heading">
			<div>
				<h2>Dein Lernpfad (L7 · 2. Fremdsprache)</h2>
				<p>Formenlehre, Satzlehre, Wortschatz, Kultur und Methodik greifen ineinander. Du kannst jede Lektion direkt öffnen.</p>
			</div>
		</div>
		<div class="stages">${STAGES.filter(
			(stage) => !stage.optional || progress.includeFoundations,
		)
			.map((stage) => {
				const lessons = LESSONS.filter((lesson) => lesson.stage === stage.id);
				return `<section class="stage" style="--stage-hue:${stage.hue}">
					<div class="stage-header">
						<span class="stage-icon" aria-hidden="true">${stageIconSvg(stage.id)}</span>
						<div>
							<h3>${esc(stage.title)}</h3>
							<span class="small">${esc(stage.subtitle)}</span>
						</div>
						<span class="stage-count">${lessons.filter((lesson) => isComplete(progress, lesson.id)).length}/${lessons.length}</span>
					</div>
					<ol>${lessons
						.map(
							(lesson) => `<li><button type="button" class="lesson-link ${isComplete(progress, lesson.id) ? "complete" : ""}" data-lesson="${lesson.id}">
								<span class="lesson-dot" aria-hidden="true">${isComplete(progress, lesson.id) ? "✓" : ""}</span>
								<span><strong>${esc(lesson.title)}</strong><small>${esc(lesson.skill)}</small></span>
								<span class="lesson-status">${isComplete(progress, lesson.id) ? "Geübt" : "Öffnen →"}</span>
							</button></li>`,
						)
						.join("")}</ol>
				</section>`;
			})
			.join("")}</div>
		<aside class="notice">
			<strong>Üben ist mehr als ein Häkchen.</strong>
			<p>Der Fortschritt zählt deine Werkstattziele, Schnellchecks, Kurzaufgaben und deinen Mustervergleich auf Level 1. Lautes, quantitätsgerechtes Vortragen, Partner- und Gruppenarbeit, eigene Recherchen, Museumsbesuche (z. B. München oder Cambodunum) sowie Rückmeldungen deiner Lehrkraft ergänzen die App.</p>
		</aside>`;
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
	const visible = progress.includeFoundations ? LESSONS : CORE_LESSONS;
	const index = visible.findIndex((entry) => entry.id === lesson.id);
	main.innerHTML = `<div class="lesson-top">
			<button type="button" class="text-button" id="back">← Zum Lernpfad</button>
			<label class="level-select" for="level">Aufgabenstufe
				<select id="level">
					<option value="1" ${progress.level === 1 ? "selected" : ""}>Level 1 · Anwenden</option>
					<option value="2" ${progress.level === 2 ? "selected" : ""}>Level 2 · Transfer</option>
				</select>
			</label>
		</div>
		<div class="lesson-heading" style="--stage-hue:${stage.hue}">
			<div class="eyebrow">${esc(stage.title)} · ${esc(lesson.lehrplan)}</div>
			<h1>${esc(lesson.title)}</h1>
			<p class="intro">${esc(lesson.skill)}</p>
		</div>
		<div class="lesson-columns" style="--lesson-hue:${stage.hue}; --stage-hue:${stage.hue}">
			<div class="lesson-content">
				<section class="panel">
					<h2>Verstehen</h2>
					${lesson.paragraphs.map((text) => `<p>${esc(text)}</p>`).join("")}
					${renderExplorerDiagram(lesson.diagram)}
					<aside class="takeaway">
						<strong>Merke</strong>
						<p>${esc(lesson.takeaway)}</p>
					</aside>
				</section>
				${renderWorkshop(lesson)}
				<section class="panel" aria-labelledby="material-heading">
					<h2 id="material-heading">Lateinischer Übungstext & Material</h2>
					<p class="small">${esc(lesson.materialLabel)}</p>
					<p class="material" lang="${lesson.materialLanguage}">${esc(lesson.material)}</p>
					${lesson.readingAloud ? '<p class="small">Tipp zum Vortragen: Lies den Text einmal laut und achte dabei auf lange Vokale und die Betonung der vorletzten oder drittletzten Silbe.</p>' : ""}
				</section>
				<section class="panel">
					<h2>1 · Schnellcheck</h2>
					<p>${esc(lesson.quiz.question)}</p>
					<div class="quiz-options">${quizOptions(lesson)
						.map(
							(option) =>
								`<button type="button" class="quiz-choice" lang="${lesson.quiz.optionLanguage}">${esc(option)}</button>`,
						)
						.join("")}</div>
					<div id="quiz-feedback" role="status"></div>
					${progress.quizDone.includes(lesson.id) ? '<p class="done-mark">Bereits richtig geübt · du kannst es erneut versuchen.</p>' : ""}
				</section>
				<section class="panel">
					<h2>2 · Ausprobieren</h2>
					<p class="small">Ergänze die kurzen Antworten. Groß- und Kleinschreibung sowie Längenzeichen (Makrons wie ā oder ī) sind bei der Eingabe nicht entscheidend; du kannst normale Buchstaben tippen.</p>
					<form id="practice-form">${lesson.practice
						.map(
							(item, itemIndex) =>
								`<label class="practice-label" for="practice-${itemIndex}">${esc(item.prompt)}</label><input class="practice-input" id="practice-${itemIndex}" data-index="${itemIndex}" autocomplete="off" spellcheck="false" value="${esc(practiceAnswers.get(lesson.id)?.[itemIndex] ?? "")}" required>`,
						)
						.join("")}<button type="submit" class="button secondary">Antworten prüfen</button></form>
					<div id="practice-feedback" role="status"></div>
					${progress.practiceDone.includes(lesson.id) ? '<p class="done-mark">Bereits richtig geübt.</p>' : ""}
				</section>
				<section class="panel">
					<h2>3 · Übersetzen & anwenden</h2>
					<p class="task-prompt">${esc(task.prompt)}</p>
					<div class="answer-label-row"><label class="answer-label" for="draft">Deine Antwort</label><button type="button" class="text-button small" id="storage-info">Speicherhinweis</button></div>
					<textarea id="draft" rows="7" maxlength="8000">${esc(progress.drafts[key] ?? "")}</textarea>
					<span class="small" id="draft-note">Mindestens 20 Zeichen, bevor du ein Muster vergleichst. Treffende eigene Formulierungen dürfen vom Muster abweichen.</span>
					<div class="self-actions">
						<button type="button" class="button secondary" id="compare" ${canReview(progress.drafts[key] ?? "") ? "" : "disabled"}>Mit einem Muster vergleichen</button>
					</div>
					<div id="comparison"></div>
					<p class="done-mark" id="writing-status" role="status">${progress.writingDone.includes(key) ? "Eigener Mustervergleich gespeichert." : ""}</p>
				</section>
			</div>
			<aside class="lesson-aside">
				<section class="aside-card">
					<h2>Deine Schritte</h2>
					<ul class="checklist">
						<li>Schaubild erkunden</li>
						<li>Entdeckerwerkstatt · 3 Ziele</li>
						<li>1. Schnellcheck</li>
						<li>2. Kurzaufgaben</li>
						<li>3. Eigene Übersetzung / Antwort + Vergleich</li>
					</ul>
					<p class="small">Werkstatt, Checks und Level 1 zählen zum Kernpfad. Level 2 vertieft im Stil von Schulaufgaben.</p>
				</section>
				<section class="aside-card">
					<h2>Quellen & Weiterüben</h2>
					<ul class="source-list">${lesson.sourceIds
						.map((id) => required(SOURCES.find((source) => source.id === id)))
						.map(
							(source) =>
								`<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a></li>`,
						)
						.join("")}</ul>
					<p class="small">Externe Quellen öffnen erst auf deinen Klick.</p>
				</section>
			</aside>
		</div>
		<div class="lesson-navigation">
			<button type="button" class="button secondary" id="previous" ${index === 0 ? "disabled" : ""}>← Vorige Lektion</button>
			<button type="button" class="button accent" id="next" ${index === visible.length - 1 ? "disabled" : ""}>Nächste Lektion →</button>
		</div>`;

	bindExplorerDiagram(lesson.diagram, main);
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
	document.querySelector("#storage-info")?.addEventListener("click", () => {
		showDialog(
			"Speicherhinweis zu deinen Texten",
			"<p>Deine Antworten bleiben lokal in diesem Browser und werden weder ausgewertet noch versendet. Hast du dein eigenes Benutzerkonto oder teilst du es mit anderen? Falls du es teilst, lösche am Ende den Lernstand und die Texte über „Lokalen Fortschritt zurücksetzen“ in der Fußzeile.</p>",
		);
	});
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
		element("#comparison").innerHTML = `<div class="model-answer">
			<h3>Eine mögliche Lösung</h3>
			<p class="material" lang="${task.language ?? "de"}">${esc(task.model)}</p>
			<p class="small">Vergleiche deine eigene Übersetzung oder Antwort. Im Deutschen gibt es oft mehrere treffende Formulierungen.</p>
			<fieldset class="rubric">
				<legend>Meine Selbsteinschätzung</legend>
				${task.criteria.map((criterion) => `<label><input type="checkbox" class="criterion">${esc(criterion)}</label>`).join("")}
			</fieldset>
			<button type="button" class="button accent" id="accept" disabled>Vergleich speichern</button>
			<p class="small">Du bestätigst selbst, dass deine Antwort diese drei Kriterien erfüllt.</p>
		</div>`;
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
	const grammarLessons = LESSONS.filter((l) =>
		["nomina", "passiv", "partizip", "konjunktiv", "wortschatz"].includes(
			l.stage,
		),
	);
	main.innerHTML = `<div class="reference">
		<div class="eyebrow">Nachschlagen & Kurzgrammatik · Latein 7 (L2)</div>
		<h1>Formen- und Satzübersicht</h1>
		<p>Die wichtigsten Formen, Signalzeichen und Übersetzungsmuster der 7. Klasse auf einen Blick. Klicke auf eine Lektion, um das passende Schaubild und Übungsbeispiele zu öffnen.</p>

		<section class="panel">
			<h2>Kurzgrammatik Latein 7 (2. Fremdsprache)</h2>
			<div class="grammar-grid">
				<div class="grammar-card">
					<h3>4. & 5. Deklination</h3>
					<p><strong>u-Dekl. (exercitus, -ūs m.):</strong> Sg. -us, -ūs, -uī, -um, -ū · Pl. -ūs, -uum, -ibus, -ūs, -ibus. Neutra (cornū): Nom./Akk. Pl. -ua.</p>
					<p><strong>e-Dekl. (rēs, reī f.):</strong> Sg. -ēs, -eī, -eī, -em, -ē · Pl. -ēs, -ērum, -ēbus, -ēs, -ēbus.</p>
				</div>
				<div class="grammar-card">
					<h3>Passiv-Endungen & Perfektstamm</h3>
					<p><strong>Präsensstamm:</strong> -r, -ris, -tur, -mur, -minī, -ntur (Inf. Präs. Pass.: -rī, kons. -ī).</p>
					<p><strong>Perfektstamm:</strong> PPP (in KNG-Kongruenz zum Subjekt) + sum/es/est (Perf.), eram (Plusq.), erō (Fut. II); Inf. Perf. Pass.: PPP + esse.</p>
				</div>
				<div class="grammar-card">
					<h3>Partizipien: PC & Abl. abs.</h3>
					<p><strong>PPP (-tus, -a, -um):</strong> vorzeitig & passiv · <strong>PPA (-ns, -ntis):</strong> gleichzeitig & aktiv.</p>
					<p><strong>PC:</strong> Partizip in KNG-Kongruenz mit einem Satzglied. <strong>Abl. abs.:</strong> Nomen + Partizip (oder 2. Nomen) losgelöst im Ablativ.</p>
				</div>
				<div class="grammar-card">
					<h3>Konjunktiv & Consecutio temporum</h3>
					<p><strong>Präsens:</strong> a-Konj. -e-, sonst -a- · <strong>Imperfekt:</strong> Inf. Präs. + Endung · <strong>Perfekt:</strong> Perf.stamm + -eri- / PPP + sim · <strong>Plusq.:</strong> Inf. Perf. + Endung / PPP + essem.</p>
					<p><strong>Zeitenfolge:</strong> Haupttempus → Konj. Präs. (glz.) / Perf. (vorz.); Nebentempus → Konj. Impf. (glz.) / Plusq. (vorz.).</p>
				</div>
				<div class="grammar-card">
					<h3>Irrealis & wichtige Subjunktionen</h3>
					<p><strong>Irrealis im Hauptsatz:</strong> Konj. Imperfekt (Gegenwart: wenn … wäre), Konj. Plusquamperfekt (Vergangenheit: wenn … gewesen wäre).</p>
					<p><strong>ut/nē:</strong> final (damit / damit nicht), konsekutiv (so dass / ut nōn). <strong>cum + Konj.:</strong> als/nachdem, weil, obwohl.</p>
				</div>
				<div class="grammar-card">
					<h3>Römische Zahlen bis 1000</h3>
					<p><strong>Zeichen:</strong> I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000.</p>
					<p><strong>Subtraktionsregel:</strong> IV (4), IX (9), XL (40), XC (90), CD (400), CM (900).</p>
				</div>
			</div>
		</section>

		<section class="panel">
			<h2>Sprach- und Grammatiklektionen</h2>
			<ul class="reference-links">${grammarLessons
				.map(
					(lesson) =>
						`<li><button type="button" class="text-button" data-lesson="${lesson.id}">${esc(lesson.title)}</button> <span class="small">· ${esc(lesson.skill)}</span></li>`,
				)
				.join("")}</ul>
		</section>

		<section class="panel">
			<h2>Abgrenzung zu Klasse 6 und Klasse 8 (L2)</h2>
			<p>Dieses Paket baut auf dem Stoff der 6. Klasse auf (1.–3. Deklination, alle Indikative Aktiv, AcI aktiv, Gründungsmythos, Olympier) und deckt alle vier Lernbereiche der 7. Klasse (L2) ab. Erscheinungen der 8. Klasse wie Steigerung der Adjektive, Deponentien, Gerund/Gerundiv, NcI sowie Hortativ/Jussiv/Optativ im Hauptsatz bleiben der 8. Klasse vorbehalten.</p>
			<p>Das Paket übt einen exemplarischen Grund- und Kulturwortschatz; dein Lehrwerk, deine eigene Vokabelkartei, lautes Vortragen und Rückmeldungen der Lehrkraft gehören zusätzlich dazu.</p>
		</section>

		<section class="panel">
			<h2>Verifizierte Quellen</h2>
			<ul class="source-list">${SOURCES.map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a></li>`).join("")}</ul>
		</section>
	</div>`;
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
		localStorage.setItem("latein_gym7_l2_theme", theme);
	} catch {
		/* Theme still changes for this visit. */
	}
});
document
	.querySelector("#zam")
	?.addEventListener("click", () =>
		showDialog(
			"Mit ZAM behalten",
			`<p>Für dieses Paket sind 120 Wiederholungsfragen vorbereitet (3 Karten pro Lektion). Jede Karte führt direkt zu ihrer Lektion zurück.</p><p>Die Karten stehen im Academy-Katalog. In ZAM erscheint das Paket im Importmenü „Aus der ZAM Academy“, sobald ZAM die Academy-Zelle übernommen hat. Die Zelle heißt <strong>${esc(ZAM_CELL_ID)}</strong>.</p><p>Du kannst hier auch ohne Konto alle 40 Lektionen offline üben.</p>`,
		),
	);
document.querySelector("#reset")?.addEventListener("click", () => {
	showDialog(
		"Fortschritt zurücksetzen?",
		'<p>Deine lokalen Antworten, Übersetzungen und Häkchen dieses Latein-Pakets werden gelöscht. Das lässt sich nicht rückgängig machen.</p><button type="button" class="button danger" id="confirm-reset">Fortschritt löschen</button>',
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
