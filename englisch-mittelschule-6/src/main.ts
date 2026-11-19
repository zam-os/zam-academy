import "./styles.css";
import {
	CARD_COUNT,
	CORE_LESSONS,
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
import type { Lesson, Level } from "./types";
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
    <section class="hero"><div><div class="eyebrow">LehrplanPLUS Bayern · Mittelschule 6 · ca. 400 neue Wörter und Wendungen</div><h1>Englisch für UK, USA,<br> Alltag und Zukunftspläne.</h1><p>Erkunde britische Städte und die 50 US-Staaten, übe echte Begegnungen unterwegs und trainiere Steigerung, Modalverben, Verlaufsform und will-future Schritt für Schritt.</p><button type="button" class="button accent" id="continue">${completion(progress).completed ? "Weiterüben" : "Mit Englisch starten"} <span aria-hidden="true">↗</span></button><p class="small">${CORE_LESSONS.length} Lektionen · ${CORE_LESSONS.length * 3} Entdeckerziele · zwei Aufgabenstufen</p></div>
    <aside class="hero-note"><div class="eyebrow">Dein nächster Schritt</div><strong>${esc(next.title)}</strong><p>Erst verstehen, dann ausprobieren. Schreibe oder sprich selbst, bevor du ein Muster vergleichst.</p><span class="small">Ohne Konto · Fortschritt in diesem Browser</span></aside></section>
    <div class="path-heading"><div><h2>Dein Lernpfad</h2><p>Themen und Sprachwerkstatt greifen ineinander. Du kannst jede Lektion direkt öffnen.</p></div></div>
    <div class="stages">${STAGES.filter(
			(stage) => !stage.optional || progress.includeFoundations,
		)
			.map((stage) => {
				const lessons = LESSONS.filter((lesson) => lesson.stage === stage.id);
				return `<section class="stage" style="--stage-hue:${stage.hue}"><div class="stage-header"><span class="stage-icon" aria-hidden="true">${esc(stage.icon)}</span><div><h3>${esc(stage.title)}</h3><span class="small">${esc(stage.subtitle)}</span></div><span class="stage-count">${lessons.filter((lesson) => isComplete(progress, lesson.id)).length}/${lessons.length}</span></div><ol>${lessons.map((lesson) => `<li><button type="button" class="lesson-link ${isComplete(progress, lesson.id) ? "complete" : ""}" data-lesson="${lesson.id}"><span class="lesson-dot" aria-hidden="true">${isComplete(progress, lesson.id) ? "✓" : ""}</span><span><strong lang="en">${esc(lesson.title)}</strong><small>${esc(lesson.skill)}</small></span><span class="lesson-status">${isComplete(progress, lesson.id) ? "Geübt" : "Öffnen →"}</span></button></li>`).join("")}</ol></section>`;
			})
			.join(
				"",
			)}</div><aside class="notice"><strong>Üben ist mehr als ein Häkchen.</strong><p>Der Fortschritt zählt deine Werkstatt, Aufgaben und deinen Mustervergleich. Echte Gespräche, natürliche Hör- und Hörsehtexte, eigene Recherchen und ein Vokabelheft gehören zusätzlich dazu.</p></aside>`;
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
function renderGraphic(lesson: Lesson): string {
	const chart = lesson.graphic;
	if (!chart) return "";
	const maximum = Math.max(1, ...chart.values.map((entry) => entry.value));
	const total = chart.values.reduce((sum, entry) => sum + entry.value, 0);
	const height = chart.values.length * 56 + 64;
	const step = Math.max(1, Math.ceil(maximum / 4));
	const gridTicks = [0, step, step * 2, step * 3, step * 4].filter(
		(tick) => tick <= maximum + step,
	);
	const description = `${chart.title}: ${chart.values.map((entry) => `${entry.label} ${entry.value} ${chart.unit}`).join(", ")}. Invented classroom data.`;
	return `<figure class="data-figure"><svg role="img" aria-label="${esc(description)}" viewBox="0 0 620 ${height}"><text x="170" y="24" font-weight="700">${esc(chart.title)} · total ${total} ${esc(chart.unit.toLowerCase())}</text>${gridTicks
		.map((tick) => {
			const gx = 170 + (320 * Math.min(tick, maximum)) / maximum;
			return `<line x1="${gx}" y1="36" x2="${gx}" y2="${height - 26}" stroke="currentColor" stroke-opacity="0.14" stroke-dasharray="3 3"/><text x="${gx}" y="${height - 8}" text-anchor="middle" font-size="12" opacity="0.72">${tick}</text>`;
		})
		.join("")}${chart.values
		.map((entry, index) => {
			const y = 44 + index * 56;
			const barWidth = (320 * entry.value) / maximum;
			const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;
			return `<text x="6" y="${y + 21}" font-weight="600">${esc(entry.label)}</text><rect x="170" y="${y}" width="${barWidth}" height="32" rx="6" fill="var(--stage-color)" opacity="0.88"/><text x="${180 + barWidth}" y="${y + 21}" font-weight="700">${entry.value} (${pct} %)</text>`;
		})
		.join("")}</svg><figcaption class="small">Erfundene Übungsdaten · keine Messwerte oder repräsentative Studie. Die Werte stehen auch im Text.</figcaption></figure>`;
}
function renderSceneItemShape(
	item: NonNullable<Lesson["scene"]>["items"][number],
): string {
	const { x, y, w, h } = item;
	const key = item.label.toLowerCase();
	if (key === "window") {
		return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="hsl(202 68% 78%)" stroke="hsl(30 25% 40%)" stroke-width="3"/><line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="hsl(30 25% 40%)" stroke-width="2"/><line x1="${x}" y1="${y + h / 2}" x2="${x + w}" y2="${y + h / 2}" stroke="hsl(30 25% 40%)" stroke-width="2"/>`;
	}
	if (key === "poster") {
		return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="hsl(45 72% 84%)" stroke="hsl(220 25% 42%)" stroke-width="2"/><circle cx="${x + w / 2}" cy="${y + h * 0.44}" r="${Math.min(w, h) * 0.22}" fill="hsl(14 68% 54%)" stroke="none"/><rect x="${x + 8}" y="${y + h * 0.72}" width="${w - 16}" height="5" rx="2" fill="hsl(220 25% 42%)" stroke="none"/>`;
	}
	if (key === "shelf") {
		return `<rect x="${x}" y="${y}" width="${w}" height="${h * 0.35}" rx="3" fill="hsl(30 38% 46%)" stroke="hsl(28 35% 30%)" stroke-width="1.5"/><rect x="${x + 10}" y="${y - 16}" width="14" height="16" rx="2" fill="hsl(212 58% 48%)" stroke="none"/><rect x="${x + 28}" y="${y - 20}" width="12" height="20" rx="2" fill="hsl(148 48% 42%)" stroke="none"/><rect x="${x + 44}" y="${y - 14}" width="16" height="14" rx="2" fill="hsl(14 64% 52%)" stroke="none"/>`;
	}
	if (key === "bed") {
		return `<rect x="${x}" y="${y + h * 0.28}" width="${w}" height="${h * 0.56}" rx="6" fill="hsl(212 46% 48%)" stroke="hsl(212 35% 32%)" stroke-width="2"/><rect x="${x}" y="${y}" width="14" height="${h * 0.92}" rx="3" fill="hsl(30 35% 38%)" stroke="none"/><rect x="${x + w - 12}" y="${y + h * 0.35}" width="12" height="${h * 0.57}" rx="3" fill="hsl(30 35% 38%)" stroke="none"/><rect x="${x + 18}" y="${y + h * 0.14}" width="34" height="${h * 0.22}" rx="6" fill="hsl(0 0% 96%)" stroke="hsl(210 15% 75%)" stroke-width="1.2"/>`;
	}
	if (key === "desk") {
		return `<rect x="${x}" y="${y}" width="${w}" height="${h * 0.24}" rx="4" fill="hsl(32 42% 52%)" stroke="hsl(28 35% 34%)" stroke-width="1.8"/><rect x="${x + 6}" y="${y + h * 0.24}" width="10" height="${h * 0.76}" rx="2" fill="hsl(30 36% 40%)" stroke="none"/><rect x="${x + w - 16}" y="${y + h * 0.24}" width="10" height="${h * 0.76}" rx="2" fill="hsl(30 36% 40%)" stroke="none"/>`;
	}
	if (key === "chair") {
		return `<rect x="${x + w * 0.68}" y="${y}" width="9" height="${h * 0.58}" rx="3" fill="hsl(28 40% 40%)" stroke="none"/><rect x="${x}" y="${y + h * 0.48}" width="${w}" height="10" rx="3" fill="hsl(28 42% 48%)" stroke="hsl(28 35% 32%)" stroke-width="1.4"/><rect x="${x + 4}" y="${y + h * 0.58}" width="8" height="${h * 0.42}" rx="2" fill="hsl(28 35% 36%)" stroke="none"/><rect x="${x + w - 12}" y="${y + h * 0.58}" width="8" height="${h * 0.42}" rx="2" fill="hsl(28 35% 36%)" stroke="none"/>`;
	}
	if (key === "lamp") {
		return `<polygon points="${x + 6},${y + h * 0.42} ${x + w - 6},${y + h * 0.42} ${x + w - 12},${y} ${x + 12},${y}" fill="hsl(45 84% 72%)" stroke="hsl(38 55% 42%)" stroke-width="1.5"/><line x1="${x + w / 2}" y1="${y + h * 0.42}" x2="${x + w / 2}" y2="${y + h - 4}" stroke="hsl(215 18% 42%)" stroke-width="4" stroke-linecap="round"/><rect x="${x + w * 0.22}" y="${y + h - 8}" width="${w * 0.56}" height="8" rx="4" fill="hsl(215 18% 36%)" stroke="none"/>`;
	}
	if (key === "rug") {
		return `<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}" fill="hsl(350 48% 58%)" stroke="hsl(350 38% 40%)" stroke-width="2"/><ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w * 0.34}" ry="${h * 0.32}" fill="none" stroke="hsl(40 70% 82%)" stroke-width="2" stroke-dasharray="5 3"/>`;
	}
	if (key === "box") {
		return `<polygon points="${x},${y + 10} ${x + 10},${y} ${x + w - 10},${y} ${x + w},${y + 10}" fill="hsl(34 45% 58%)" stroke="hsl(30 35% 36%)" stroke-width="1.5"/><rect x="${x}" y="${y + 10}" width="${w}" height="${h - 10}" rx="3" fill="hsl(34 48% 68%)" stroke="hsl(30 35% 36%)" stroke-width="1.8"/>`;
	}
	return item.shape === "person"
		? `<circle cx="${x + w / 2}" cy="${y + w / 2}" r="${w / 2}"/><rect x="${x}" y="${y + w}" width="${w}" height="${h - w}" rx="${w / 3}"/>`
		: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${item.shape === "round" ? Math.min(w, h) / 2 : 4}"/>`;
}
function renderScene(lesson: Lesson): string {
	const scene = lesson.scene;
	if (!scene) return "";
	const description = `${scene.title}: ${scene.items.map((item) => item.label).join(", ")}. Self-drawn practice picture.`;
	return `<figure class="scene-figure"><svg role="img" aria-label="${esc(description)}" viewBox="0 0 620 340"><rect class="scene-sky" x="0" y="0" width="620" height="205"/><rect class="scene-ground" x="0" y="205" width="620" height="135"/>${scene.items
		.map((item) => {
			const labelY =
				item.label === "lamp"
					? Math.max(item.y - 8, 18)
					: Math.min(item.y + item.h + 18, 334);
			return `<g class="scene-item scene-${item.shape}" data-scene-item="${esc(item.label)}">${renderSceneItemShape(item)}<text x="${item.x + item.w / 2}" y="${labelY}" text-anchor="middle">${esc(item.label)}</text></g>`;
		})
		.join("")}</svg><figcaption class="small">Selbst gezeichnetes Übungsbild · kein Foto. Die Beschriftungen stehen auch im Text.</figcaption></figure>`;
}
function renderLesson(lesson: Lesson): void {
	const task = lesson.tasks[progress.level];
	const key = writingKey(lesson.id, progress.level);
	const stage = required(STAGES.find((entry) => entry.id === lesson.stage));
	const visible = progress.includeFoundations ? LESSONS : CORE_LESSONS;
	const index = visible.findIndex((entry) => entry.id === lesson.id);
	main.innerHTML = `<div class="lesson-top"><button type="button" class="text-button" id="back">← Zum Lernpfad</button><label class="level-select" for="level">Aufgabenstufe <select id="level"><option value="1" ${progress.level === 1 ? "selected" : ""}>Level 1 · Anwenden</option><option value="2" ${progress.level === 2 ? "selected" : ""}>Level 2 · Transfer</option></select></label></div>
    <div class="lesson-heading" style="--stage-hue:${stage.hue}"><div class="eyebrow">${esc(stage.title)}${lesson.optional ? " · freiwillige Ergänzung" : ""}</div><h1 lang="en">${esc(lesson.title)}</h1><p class="intro">${esc(lesson.skill)}</p></div>
    <div class="lesson-columns" style="--lesson-hue:${stage.hue}"><div class="lesson-content"><section class="panel"><h2>Verstehen</h2>${lesson.paragraphs.map((text) => `<p>${esc(text)}</p>`).join("")}<aside class="takeaway"><strong>Merke</strong><p>${esc(lesson.takeaway)}</p></aside></section>
    ${renderWorkshop(lesson)}
    <section class="panel" aria-labelledby="material-heading"><h2 id="material-heading">${lesson.listening ? "Zuerst hören" : "Dein Material"}</h2><p class="small">${esc(lesson.materialLabel)}</p>${lesson.listening ? `<p>Höre zuerst ohne mitzulesen. Die lokale Computerstimme spricht ein Übungsskript (${lesson.listeningAccent === "en-US" ? "amerikanisches Englisch" : "britisches Englisch"}); natürliche Stimmen und Hörsehtexte übst du zusätzlich.</p><div class="self-actions"><button type="button" class="button accent" id="listen">Skript anhören</button><button type="button" class="button secondary" id="stop-listen">Stoppen</button></div><p class="small" id="voice-status" role="status"></p><details id="transcript"><summary>Transkript / Text zum Vorlesen</summary><p class="material" lang="${lesson.materialLanguage}">${esc(lesson.material)}</p></details><label class="toggle"><input type="checkbox" id="partner-listened" ${progress.listening[lesson.id]?.partner ? "checked" : ""}>Ein Partner hat mir den Text vorgelesen; ich habe zuerst ohne Mitlesen zugehört.</label><p class="small" id="listened-status" role="status"></p>` : `${renderGraphic(lesson)}${renderScene(lesson)}<p class="material" lang="${lesson.materialLanguage}">${esc(lesson.material)}</p>`}</section>
    <section class="panel"><h2>1 · Schnellcheck</h2><p lang="en">${esc(lesson.quiz.question)}</p><div class="quiz-options">${quizOptions(
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
    <section class="panel"><h2>3 · ${lesson.speaking ? "Selbst sprechen und notieren" : "Mit eigenen Worten"}</h2><p class="task-prompt">${esc(task.prompt)}</p>${lesson.speaking ? '<p class="small">Sprich laut oder mit einem Partner. Hier speicherst du deine Notizen. Es wird nichts aufgenommen; Aussprache und Flüssigkeit werden nicht automatisch bewertet.</p>' : ""}${progress.level === 1 ? `<details><summary>Hinweis für Level 1</summary><p>${task.criteria.map(esc).join(" ")}</p></details>` : ""}<label class="answer-label" for="draft">${lesson.speaking ? "Deine Notizen" : "Deine Antwort"}</label><textarea id="draft" rows="7" maxlength="8000">${esc(progress.drafts[key] ?? "")}</textarea><span class="small" id="draft-note">Mindestens 20 Zeichen, bevor du ein Muster vergleichst. Eigene Formulierungen dürfen abweichen.</span><div class="self-actions"><button type="button" class="button secondary" id="compare" ${canReview(progress.drafts[key] ?? "") ? "" : "disabled"}>Mit einem Muster vergleichen</button></div><div id="comparison"></div><p class="done-mark" id="writing-status" role="status">${progress.writingDone.includes(key) ? "Eigener Mustervergleich gespeichert." : ""}</p></section>
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
		(lesson) =>
			lesson.stage === "words-structures" ||
			lesson.stage === "tenses-syntax" ||
			lesson.bindings.some((b) => /\b1\.2\b|\b4\b/.test(b)) ||
			lesson.optional,
	)
		.map(
			(lesson) =>
				`<li><button type="button" class="text-button" data-lesson="${lesson.id}" lang="en">${esc(lesson.title)}</button>${lesson.optional ? ' <span class="small">freiwillige Ergänzung</span>' : ""}</li>`,
		)
		.join(
			"",
		)}</ul></section><section class="panel"><h2>Hören, Sprechen und Lesen</h2><p>Die ${listeningCount} Hörskripte in britischer und amerikanischer Standardsprache können lokal vorgelesen werden. Echte Varietäten, Hintergrundgeräusche (z. B. Verkehrslärm), Mimik, Gestik und natürliche Dialoge werden dadurch nicht vollständig geübt. Nutze zusätzlich echte Aufnahmen und Partnergespräche.</p><p>Das Paket übt einen ausgewählten Wortschatz (Zielumfang ca. 400 neue Wörter und Wendungen in Jahrgangsstufe 6). Dein Lehrwerk, Unterricht und ein eigenes Vokabelheft mit Lautschrift und Beispielsätzen ergänzen ihn. Aktuelle Recherche und Lehrkraftfeedback bleiben eigene Aufgaben im Unterricht.</p></section><section class="panel"><h2>Quellen</h2><ul class="source-list">${SOURCES.map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a></li>`).join("")}</ul></section></div>`;
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
		localStorage.setItem("englisch_ms6_theme", theme);
	} catch {
		/* Theme still changes for this visit. */
	}
});
document
	.querySelector("#zam")
	?.addEventListener("click", () =>
		showDialog(
			"Mit ZAM behalten",
			`<p>Diese App gehört zur ZAM Academy. Dazu gehören ${CARD_COUNT} Wiederholungsfragen für ZAM; jede führt zurück zu ihrer Lektion.</p><p>Die Fragen stehen in ZAM bereit, sobald ein späterer ZAM-Stand diese Zelle übernimmt. Bitte deinen Agenten erst dann:</p><p class="material">${esc(zamEnrolRequest())}</p><p>Für Englisch an der Mittelschule gibt es keine Altzelle, daher überträgt diese Zelle keine fremden Lernverläufe. Alle Karten beginnen ohne Lernstand und werden getrennt von deinem App-Fortschritt geübt.</p><p>Hier kannst du ohne Konto weiterüben.</p>`,
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
	if (view === "path") renderPath();
	else syncSavedState();
	renderStats();
});

applyRoute();
