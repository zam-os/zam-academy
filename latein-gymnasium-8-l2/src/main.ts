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
    <section class="hero"><div><div class="eyebrow">Gymnasium Bayern · 8. Klasse · 2. Fremdsprache</div><h1>Latein als zweite Fremdsprache</h1><p>Verfolge Handlungen auf der Zeitachse, untersuche lateinische Sätze und übersetze Texte über Rom, Delphi und Olympia.</p><button type="button" class="button accent" id="continue">${completion(progress).completed ? "Weiterüben" : "Mit Latein 8 starten"} <span aria-hidden="true">↗</span></button><p class="small">${LESSONS.length} Lektionen · ${LESSONS.length * 3} Werkstattziele</p></div>
    <aside class="hero-note"><div class="eyebrow">Dein nächster Schritt</div><strong>${esc(next.title)}</strong><p>Erst verstehen, dann im Schaubild prüfen und selbst übersetzen oder erörtern, bevor du mit einer möglichen Lösung vergleichst.</p><span class="small">Ohne Konto · Fortschritt in diesem Browser</span></aside></section>
    <div class="path-heading"><div><h2>Dein Lernpfad</h2><p>Wortschatz, Formenlehre, Satzlehre, Kulturkontext und Methodik greifen ineinander. Du kannst jede Lektion direkt öffnen.</p></div><label class="toggle" hidden><input id="foundations" type="checkbox" ${progress.includeFoundations ? "checked" : ""}>Ergänzungen zeigen</label></div>
    <div class="stages">${STAGES.filter(
			(stage) => !stage.optional || progress.includeFoundations,
		)
			.map((stage) => {
				const lessons = LESSONS.filter((lesson) => lesson.stage === stage.id);
				return `<section class="stage" style="--stage-hue:${stage.hue}"><div class="stage-header"><span class="stage-icon" aria-hidden="true">${renderStageIcon(stage.icon)}</span><div><h3>${esc(stage.title)}</h3><span class="small">${esc(stage.subtitle)}</span></div><span class="stage-count">${lessons.filter((lesson) => isComplete(progress, lesson.id)).length}/${lessons.length}</span></div><ol>${lessons.map((lesson) => `<li><button type="button" class="lesson-link ${isComplete(progress, lesson.id) ? "complete" : ""}" data-lesson="${lesson.id}"><span class="lesson-dot" aria-hidden="true">${isComplete(progress, lesson.id) ? "✓" : ""}</span><span><strong>${esc(lesson.title)}</strong><small>${esc(lesson.skill)}</small></span><span class="lesson-status">${isComplete(progress, lesson.id) ? "Geübt" : "Öffnen →"}</span></button></li>`).join("")}</ol></section>`;
			})
			.join(
				"",
			)}</div><aside class="notice"><strong>Wortschatz und Aussprache</strong><p>Hier übst du ausgewählte Wörter im Satz. Für die rund 1300 Grundwörter und das laute Lesen arbeitest du auch mit deinem Lehrwerk.</p></aside>`;
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
    <section class="panel"><h2>3 · Mit eigenen Worten</h2><p class="task-prompt">${esc(task.prompt)}</p><div class="answer-label-row"><label class="answer-label" for="draft">Deine Antwort</label><button type="button" class="text-button small" id="storage-info">Speicherhinweis</button></div><textarea id="draft" rows="7" maxlength="8000">${esc(progress.drafts[key] ?? "")}</textarea><span class="small" id="draft-note">Mindestens 20 Zeichen, bevor du ein Muster vergleichst. Treffende eigene Formulierungen dürfen vom Muster abweichen.</span><div class="self-actions"><button type="button" class="button secondary" id="compare" ${canReview(progress.drafts[key] ?? "") ? "" : "disabled"}>Mit einem Muster vergleichen</button></div><div id="comparison"></div><p class="done-mark" id="writing-status" role="status">${progress.writingDone.includes(key) ? "Eigener Mustervergleich gespeichert." : ""}</p></section>
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
	document
		.querySelector("#storage-info")
		?.addEventListener("click", () =>
			showDialog(
				"Speicherhinweis",
				"<p>Deine Antworten bleiben lokal in diesem Browser und werden weder ausgewertet noch versendet. Hast du dein eigenes Benutzerkonto oder teilst du es mit anderen? Falls du es teilst, lösche am Ende den Lernstand und die Texte über „Lokalen Fortschritt zurücksetzen“ in der Fußzeile.</p>",
			),
		);
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
	main.innerHTML = `<div class="reference"><div class="eyebrow">Nachschlagen und weiterüben</div><h1>Grammatik- &amp; Kultur-Übersicht (Latein 8 · L2)</h1><p>Alle Kernregeln und Epochen der 8. Klasse (2. Fremdsprache) im Überblick. Klicke auf eine Lektion, um sie direkt zu öffnen.</p>
	<section class="panel"><h2>Steigerung &amp; Nachzeitigkeit</h2><div class="ref-table-wrap"><table class="ref-table"><thead><tr><th>Form</th><th>Beispiel</th><th>Funktion</th></tr></thead><tbody>
	<tr><td>Adjektiv</td><td lang="la">brevis · brevior · brevissimus</td><td>Eigenschaft, Vergleich und Höchststufe</td></tr>
	<tr><td>Adverb</td><td lang="la">celeriter · celerius · celerrime</td><td>Eine Handlung näher beschreiben und vergleichen</td></tr>
	<tr><td>PFA im PC</td><td lang="la">Legati pacem petituri venerunt.</td><td>Sie kamen, um Frieden zu erbitten.</td></tr>
	<tr><td>AcI mit Infinitiv Futur Aktiv</td><td lang="la">Dicit legatos venturos esse.</td><td>Er sagt, dass die Gesandten kommen werden.</td></tr>
	</tbody></table></div></section>
	<section class="panel"><h2>Gerund, Gerundiv &amp; Kasusfunktionen</h2><div class="ref-table-wrap"><table class="ref-table"><thead><tr><th>Konstruktion</th><th>Bau &amp; Kongruenz</th><th>Bedeutung / Beispiel</th></tr></thead><tbody>
	<tr><td>Gerund</td><td>Verbalsubstantiv (Neutr. Sg. <em>-ndi/-ndo/-ndum/-ndo</em>), ohne KNG-Partner</td><td lang="la">ars discendi → die Kunst zu lernen / des Lernens</td></tr>
	<tr><td>Attributives Gerundiv</td><td>Verbaladjektiv auf <em>-ndus, -nda, -ndum</em> in KNG-Kongruenz zum Nomen</td><td lang="la">spes urbis servandae → die Hoffnung auf Rettung der Stadt</td></tr>
	<tr><td>Prädikatives Gerundiv + <em>esse</em></td><td>Subjekt + Gerundiv (KNG) + <em>esse</em> (unpers. Neutr. <em>-ndum est</em> bei Intrans.)</td><td lang="la">Carthago delenda est → Karthago muss zerstört werden</td></tr>
	<tr><td>Dativus auctoris</td><td>Handelnde Person beim Gerundiv mit <em>esse</em> steht im Dativ (nicht <em>a/ab</em>)</td><td lang="la">Lex civibus servanda est → Die Bürger müssen das Gesetz achten</td></tr>
	</tbody></table></div></section>
	<section class="panel"><h2>Pronomina, Deponentien, Perfektopräsentien &amp; fieri</h2><div class="ref-table-wrap"><table class="ref-table"><thead><tr><th>Bereich</th><th>Kennzeichen &amp; Besonderheit</th><th>Beispiel</th></tr></thead><tbody>
	<tr><td>Indefinit- &amp; verallg. Pronomina</td><td><em>quidam</em> (Assimil. <em>quendam</em>), <em>quisque</em>; <em>quisquis / quicumque</em> (+ Indikativ)</td><td lang="la">suum cuique · quicumque hoc dicit</td></tr>
	<tr><td>Deponentien</td><td>Viele Formen mit Passivendungen, normalerweise aktive Bedeutung</td><td lang="la">mentiri (lügen), loqui (sprechen), pati (erleiden)</td></tr>
	<tr><td>Semideponentien &amp; Perfektopräsentien</td><td>Semideponens: Präsensstamm aktiv, Perfektstamm passiv; Perfektopräsens: Perfektform = Gegenwart</td><td lang="la">audere, ausus sum (wagen) · odisse (hassen), meminisse (sich erinnern)</td></tr>
	<tr><td><em>fieri</em></td><td>Präsensstamm unregelmäßig (<em>fio, fis, fit, fimus, fitis, fiunt</em>), Perfekt <em>factus sum</em></td><td lang="la">Consul fit → Er wird Konsul / wird zum Konsul gemacht</td></tr>
	</tbody></table></div></section>
	<section class="panel"><h2>NcI, Konjunktive &amp; Relativsätze</h2><div class="ref-table-wrap"><table class="ref-table"><thead><tr><th>Phänomen</th><th>Erkennungsmerkmal</th><th>Übersetzung</th></tr></thead><tbody>
	<tr><td>NcI (3. Person)</td><td>Nom. Subjekt + Passiv von Sagen/Glauben/Sehen/Anordnen + Infinitiv (Prädikatsnomen im Nom.)</td><td lang="la">Socrates sapiens fuisse dicitur → Man sagt, Sokrates sei weise gewesen</td></tr>
	<tr><td>Begehrssätze</td><td>Hortativ (wir), Jussiv (sie sollen), Optativ (Wunsch), Prohibitiv (Verbot)</td><td lang="la">Eamus! · Veniant! · Utinam veniant! · Ne timueris!</td></tr>
	<tr><td>Deliberativ &amp; Potentialis</td><td>Hauptsatzkonjunktiv, stets mit <em>non</em> verneint (nicht <em>ne</em>!)</td><td lang="la">Quid faciam? (Was soll ich tun?) · Hoc non dixerim (Das möchte ich nicht behaupten)</td></tr>
	<tr><td>Konjunktiv im Relativsatz</td><td><em>qui/quae/quod</em> + Konjunktiv drückt Zweck, Grund, Folge oder Einräumung aus</td><td lang="la">Legatos misit, qui pacem peterent → um Frieden zu erbitten (final)</td></tr>
	<tr><td>Verschränkter Relativsatz</td><td>Relativpronomen im Nebensatz gehört logisch zu einem Gliedsatz (AcI / Abl. abs. / Konj.-Satz)</td><td lang="la">Quam rem scio veram esse → Eine Sache, von der ich weiß, dass sie wahr ist</td></tr>
	</tbody></table></div></section>
	<section class="panel"><h2>Kaiserzeit, Limes, Römisches Recht &amp; Philosophie</h2><div class="ref-table-wrap"><table class="ref-table"><thead><tr><th>Themenkreis</th><th>Epochen, Orte &amp; Grundbegriffe</th><th>Kernbezug</th></tr></thead><tbody>
	<tr><td>Kaiserzeit &amp; Christentum</td><td>Julisch-claudisch, Adoptivkaiser, Reichskrise, Spätantike; 313 n. Chr. Vereinbarung von Mailand, 380 n. Chr. Edikt von Thessaloniki</td><td>Prinzipat bis 476 n. Chr.; wechselseitiger Austausch Antike–Christentum</td></tr>
	<tr><td>Limes &amp; Germanen</td><td>Obergermanisch-Raetischer Limes &amp; Donaulimes (Saalburg, Aalen, Weißenburg, Regensburg, Künzing)</td><td>Grenzkontrolle, Handel, <em>interpretatio Romana</em></td></tr>
	<tr><td>Römisches Recht</td><td>Zwölftafelgesetz, Prätor, <em>Corpus Iuris Civilis</em>; Werte: <em>iustitia, aequitas, humanitas</em></td><td>Rechtssätze bis heute: <em>in dubio pro reo, audiatur et altera pars, pacta sunt servanda</em></td></tr>
	<tr><td>Delphi &amp; Olympia</td><td>Apollonorakel mit Pythia · Zeusheiligtum mit Wettkämpfen</td><td>Griechische Heiligtümer als Orte für Religion, Beratung und Sport</td></tr>
	<tr><td>Philosophie &amp; Fabel</td><td>Vorsokratiker, Sokrates, Epikureer (<em>ataraxia</em>), Stoiker (<em>apatheia</em>); Cicero, Seneca; Phaedrus</td><td>Lebensgestaltung, Selbstprüfung, griechische Vorbilder in Rom</td></tr>
	</tbody></table></div></section>
	<section class="panel"><h2>Lektionen nach Lernbereichen</h2><ul class="reference-links">${LESSONS.map((lesson) => `<li><button type="button" class="text-button" data-lesson="${lesson.id}">${esc(lesson.title)}</button> · <span class="small">${esc(lesson.skill)}</span></li>`).join("")}</ul></section>
	<section class="panel"><h2>Hinweise zu Wortschatz, Konto &amp; Speicher</h2><p>Das Paket übt Grund- und Kulturvokabeln der 8. Klasse im Satzzusammenhang. Der vollständige Grundwortschatz (ca. 1300 Wörter) wächst dauerhaft mit deinem Lehrwerk, eigener Vokabelarbeit und lautem Lesen im Unterricht.</p><p>Lernstand und eigene Entwürfe bleiben lokal in diesem Browser. Hast du dein eigenes Benutzerkonto auf dem Gerät oder teilst du es mit anderen? Falls mehrere Lernende ein gemeinsames Konto nutzen, lösche am Ende über „Lokalen Fortschritt zurücksetzen“ in der Fußzeile sowohl den Lernstand als auch die Texte.</p></section>
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
		localStorage.setItem("latein_gym8_l2_theme", theme);
	} catch {
		/* Theme still changes for this visit. */
	}
});
document
	.querySelector("#zam")
	?.addEventListener("click", () =>
		showDialog(
			"Mit ZAM behalten",
			`<p>Für dieses Paket sind ${LESSONS.length * 3} Wiederholungsfragen in der ZAM-Zelle <strong>${esc(ZAM_CELL_ID)}</strong> verfügbar. In ZAM findest du sie unter „Aus der ZAM Academy“.</p><p>Du kannst hier auch ohne Konto alle Lektionen offline üben.</p>`,
		),
	);
document.querySelector("#reset")?.addEventListener("click", () => {
	showDialog(
		"Fortschritt zurücksetzen?",
		'<p>Deine lokalen Antworten, Texte und Häkchen dieses Latein-Pakets werden gelöscht. Das lässt sich nicht rückgängig machen.</p><form method="dialog" class="dialog-actions"><button type="submit" value="cancel" class="button secondary" autofocus>Abbrechen</button><button type="button" class="button danger" id="confirm-reset">Fortschritt löschen</button></form>',
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
