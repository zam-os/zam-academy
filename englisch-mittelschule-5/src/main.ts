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
    <section class="hero"><div><div class="eyebrow">LehrplanPLUS Bayern · Mittelschule 5 · ca. 550 Wörter und Wendungen</div><h1>Englisch für Alltag,<br> Schule und Großbritannien.</h1><p>Entdecke die Britischen Inseln, übe echte Alltagssituationen und trainiere Satzbau, Zeiten und Wortschatz Schritt für Schritt.</p><button type="button" class="button accent" id="continue">${completion(progress).completed ? "Weiterüben" : "Mit Englisch starten"} <span aria-hidden="true">↗</span></button><p class="small">${CORE_LESSONS.length} Lektionen · ${CORE_LESSONS.length * 3} Entdeckerziele · zwei Aufgabenstufen</p></div>
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
			)}</div><aside class="notice"><strong>Üben ist mehr als ein Häkchen.</strong><p>Der Fortschritt zählt deine Werkstatt, Aufgaben und deinen Mustervergleich. Echte Gespräche, natürliche Hör- und Hörsehtexte, Lieder, eigene Recherche und ein Vokabelheft gehören zusätzlich dazu.</p></aside>`;
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
	const gridTicks = [0, 3, 6, 9, 12];
	const description = `${chart.title}: ${chart.values.map((entry) => `${entry.label} ${entry.value} ${chart.unit}`).join(", ")}. Invented classroom data.`;
	return `<figure class="data-figure"><svg role="img" aria-label="${esc(description)}" viewBox="0 0 620 ${height}"><text x="170" y="24" font-weight="700">${esc(chart.title)} · total ${total} ${esc(chart.unit.toLowerCase())}</text>${gridTicks
		.filter((tick) => tick <= Math.max(maximum, 12))
		.map((tick) => {
			const gx = 170 + (340 * tick) / maximum;
			return `<line x1="${gx}" y1="36" x2="${gx}" y2="${height - 26}" stroke="currentColor" stroke-opacity="0.14" stroke-dasharray="3 3"/><text x="${gx}" y="${height - 8}" text-anchor="middle" font-size="12" opacity="0.72">${tick}</text>`;
		})
		.join("")}${chart.values
		.map((entry, index) => {
			const y = 44 + index * 56;
			const barWidth = (340 * entry.value) / maximum;
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
	if (key === "house") {
		const roofBottom = y + h * 0.38;
		return `<polygon points="${x - 6},${roofBottom} ${x + w / 2},${y} ${x + w + 6},${roofBottom}" fill="hsl(14 55% 48%)" stroke="var(--surface)" stroke-width="2"/><rect x="${x}" y="${roofBottom}" width="${w}" height="${h * 0.62}" rx="3" fill="hsl(40 35% 90%)" stroke="var(--surface)" stroke-width="2"/><rect x="${x + w * 0.42}" y="${y + h * 0.62}" width="${w * 0.18}" height="${h * 0.38}" rx="2" fill="hsl(24 40% 36%)"/><rect x="${x + w * 0.14}" y="${roofBottom + 10}" width="${w * 0.18}" height="${w * 0.18}" rx="2" fill="hsl(200 65% 75%)" stroke="hsl(220 20% 45%)" stroke-width="1.5"/><rect x="${x + w * 0.68}" y="${roofBottom + 10}" width="${w * 0.18}" height="${w * 0.18}" rx="2" fill="hsl(200 65% 75%)" stroke="hsl(220 20% 45%)" stroke-width="1.5"/>`;
	}
	if (key === "fence") {
		const pickets = 6;
		const step = w / pickets;
		return `<rect x="${x}" y="${y + h * 0.35}" width="${w}" height="4" fill="hsl(32 32% 52%)"/><rect x="${x}" y="${y + h * 0.72}" width="${w}" height="4" fill="hsl(32 32% 52%)"/>${Array.from({ length: pickets }, (_, idx) => `<rect x="${x + idx * step + 3}" y="${y}" width="${Math.max(8, step - 7)}" height="${h}" rx="2" fill="hsl(36 42% 84%)" stroke="hsl(30 25% 45%)" stroke-width="1.2"/>`).join("")}`;
	}
	if (key === "terrace") {
		return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="hsl(32 22% 70%)" stroke="hsl(30 18% 48%)" stroke-width="1.8"/><line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="hsl(30 18% 55%)" stroke-width="1" stroke-dasharray="4 3"/><line x1="${x}" y1="${y + h / 2}" x2="${x + w}" y2="${y + h / 2}" stroke="hsl(30 18% 55%)" stroke-width="1" stroke-dasharray="4 3"/>`;
	}
	if (key === "tree") {
		const cx = x + w / 2;
		const trunkW = Math.max(16, w * 0.22);
		return `<rect x="${cx - trunkW / 2}" y="${y + h * 0.55}" width="${trunkW}" height="${h * 0.45}" rx="3" fill="hsl(28 38% 36%)" stroke="none"/><circle cx="${cx}" cy="${y + h * 0.36}" r="${w * 0.44}" fill="hsl(136 44% 40%)"/><circle cx="${cx - w * 0.22}" cy="${y + h * 0.44}" r="${w * 0.3}" fill="hsl(136 44% 44%)" stroke="none"/><circle cx="${cx + w * 0.22}" cy="${y + h * 0.44}" r="${w * 0.3}" fill="hsl(136 44% 42%)" stroke="none"/>`;
	}
	if (key === "dog") {
		return `<ellipse cx="${x + w * 0.48}" cy="${y + h * 0.62}" rx="${w * 0.34}" ry="${h * 0.24}" fill="hsl(28 45% 42%)" stroke="var(--surface)" stroke-width="1.5"/><circle cx="${x + w * 0.78}" cy="${y + h * 0.36}" r="${h * 0.24}" fill="hsl(28 45% 42%)" stroke="var(--surface)" stroke-width="1.5"/><ellipse cx="${x + w * 0.68}" cy="${y + h * 0.36}" rx="4" ry="8" fill="hsl(24 45% 28%)"/><line x1="${x + w * 0.26}" y1="${y + h * 0.78}" x2="${x + w * 0.24}" y2="${y + h}" stroke="hsl(28 45% 32%)" stroke-width="4" stroke-linecap="round"/><line x1="${x + w * 0.64}" y1="${y + h * 0.78}" x2="${x + w * 0.66}" y2="${y + h}" stroke="hsl(28 45% 32%)" stroke-width="4" stroke-linecap="round"/><path d="M ${x + w * 0.16} ${y + h * 0.56} Q ${x} ${y + h * 0.35} ${x + w * 0.1} ${y + h * 0.28}" fill="none" stroke="hsl(28 45% 36%)" stroke-width="3" stroke-linecap="round"/>`;
	}
	if (key === "sofa") {
		return `<rect x="${x + 6}" y="${y}" width="${w - 12}" height="${h * 0.52}" rx="6" fill="hsl(212 48% 46%)"/><rect x="${x}" y="${y + h * 0.38}" width="${w}" height="${h * 0.52}" rx="6" fill="hsl(212 52% 52%)"/><rect x="${x}" y="${y + h * 0.26}" width="12" height="${h * 0.64}" rx="4" fill="hsl(212 45% 38%)"/><rect x="${x + w - 12}" y="${y + h * 0.26}" width="12" height="${h * 0.64}" rx="4" fill="hsl(212 45% 38%)"/>`;
	}
	if (key === "bike") {
		const wy = y + h * 0.68;
		const r = h * 0.3;
		const lx = x + w * 0.22;
		const rx = x + w * 0.78;
		return `<circle cx="${lx}" cy="${wy}" r="${r}" fill="none" stroke="hsl(210 20% 28%)" stroke-width="3.5"/><circle cx="${rx}" cy="${wy}" r="${r}" fill="none" stroke="hsl(210 20% 28%)" stroke-width="3.5"/><path d="M ${lx} ${wy} L ${x + w * 0.48} ${wy - r * 0.9} L ${rx} ${wy} M ${x + w * 0.48} ${wy - r * 0.9} L ${x + w * 0.42} ${y + 6} M ${rx} ${wy} L ${rx - 6} ${y + 8} L ${rx + 5} ${y + 8}" fill="none" stroke="hsl(350 65% 48%)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
	}
	if (key === "box") {
		return `<polygon points="${x},${y + 10} ${x + 12},${y} ${x + w - 12},${y} ${x + w},${y + 10}" fill="hsl(34 45% 58%)" stroke="hsl(30 35% 36%)" stroke-width="1.5"/><rect x="${x}" y="${y + 10}" width="${w}" height="${h - 10}" rx="3" fill="hsl(34 48% 68%)" stroke="hsl(30 35% 36%)" stroke-width="1.8"/><path d="M ${x} ${y + 10} L ${x - 8} ${y + 2} M ${x + w} ${y + 10} L ${x + w + 8} ${y + 2}" stroke="hsl(30 35% 36%)" stroke-width="2" stroke-linecap="round"/>`;
	}
	if (key === "cat") {
		const cx = x + w * 0.52;
		const cy = y + h * 0.46;
		return `<path d="M ${x + w * 0.1} ${y + h * 0.75} Q ${cx} ${y + h * 0.2} ${x + w * 0.85} ${y + h * 0.82}" fill="none" stroke="hsl(28 70% 52%)" stroke-width="1.6" stroke-dasharray="3 2"/><ellipse cx="${cx}" cy="${y + h * 0.62}" rx="${w * 0.3}" ry="${h * 0.22}" fill="hsl(28 70% 56%)" stroke="var(--surface)" stroke-width="1.4"/><circle cx="${cx + w * 0.2}" cy="${cy - 2}" r="${h * 0.22}" fill="hsl(28 70% 56%)" stroke="var(--surface)" stroke-width="1.4"/><polygon points="${cx + 2},${cy - 8} ${cx + 6},${cy - 18} ${cx + 10},${cy - 9}" fill="hsl(28 70% 56%)"/><polygon points="${cx + 10},${cy - 8} ${cx + 15},${cy - 18} ${cx + 17},${cy - 8}" fill="hsl(28 70% 56%)"/><path d="M ${x + 4} ${y + h * 0.56} Q ${x - 2} ${y + h * 0.25} ${x + 10} ${y + h * 0.24}" fill="none" stroke="hsl(28 70% 50%)" stroke-width="2.8" stroke-linecap="round"/>`;
	}
	return item.shape === "person"
		? `<circle cx="${x + w / 2}" cy="${y + w / 2}" r="${w / 2}"/><rect x="${x}" y="${y + w}" width="${w}" height="${h - w}" rx="${w / 3}"/>`
		: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${item.shape === "round" ? Math.min(w, h) / 2 : 4}"/>`;
}
function renderScene(lesson: Lesson): string {
	const scene = lesson.scene;
	if (!scene) return "";
	const description = `${scene.title}: ${scene.items.map((item) => item.label).join(", ")}. Self-drawn practice picture.`;
	return `<figure class="scene-figure"><svg role="img" aria-label="${esc(description)}" viewBox="0 0 620 340"><rect class="scene-sky" x="0" y="0" width="620" height="200"/><rect class="scene-ground" x="0" y="200" width="620" height="140"/>${scene.items
		.map((item) => {
			const labelY =
				item.label === "cat" || item.label === "house"
					? Math.max(item.y - 6, 18)
					: Math.min(item.y + item.h + 16, 334);
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
    <section class="panel" aria-labelledby="material-heading"><h2 id="material-heading">${lesson.listening ? "Zuerst hören" : "Dein Material"}</h2><p class="small">${esc(lesson.materialLabel)}</p>${lesson.listening ? `<p>Höre zuerst ohne mitzulesen. Die lokale Computerstimme spricht ein Übungsskript; natürliche Stimmen und Hörsehtexte übst du zusätzlich.</p><div class="self-actions"><button type="button" class="button accent" id="listen">Skript anhören</button><button type="button" class="button secondary" id="stop-listen">Stoppen</button></div><p class="small" id="voice-status" role="status"></p><details id="transcript"><summary>Transkript / Text zum Vorlesen</summary><p class="material" lang="${lesson.materialLanguage}">${esc(lesson.material)}</p></details><label class="toggle"><input type="checkbox" id="partner-listened" ${progress.listening[lesson.id]?.partner ? "checked" : ""}>Ein Partner hat mir den Text vorgelesen; ich habe zuerst ohne Mitlesen zugehört.</label><p class="small" id="listened-status" role="status"></p>` : `${renderGraphic(lesson)}${renderScene(lesson)}<p class="material" lang="${lesson.materialLanguage}">${esc(lesson.material)}</p>`}</section>
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
			"Geänderter Entwurf · bitte erneut vergleichen.";
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
	main.innerHTML = `<div class="reference"><div class="eyebrow">Nachschlagen und weiterüben</div><h1>Sprache im Zusammenhang</h1><p>Öffne die passende Lektion und übe mit einem eigenen Beispiel.</p><section class="panel"><h2>Sprachwerkstatt</h2><ul class="reference-links">${LESSONS.filter(
		(lesson) =>
			lesson.bindings.some((b) => /\b1\.2\b/.test(b)) ||
			lesson.stage.startsWith("grammar") ||
			lesson.optional,
	)
		.map(
			(lesson) =>
				`<li><button type="button" class="text-button" data-lesson="${lesson.id}" lang="en">${esc(lesson.title)}</button>${lesson.optional ? ' <span class="small">freiwillige Ergänzung</span>' : ""}</li>`,
		)
		.join(
			"",
		)}</ul></section><section class="panel"><h2>Hören, Sprechen und Lesen</h2><p>Die vier Hörskripte können lokal vorgelesen werden. Echte Varietäten, Hintergrundgeräusche, Körpersprache und natürliche Dialoge werden dadurch nicht vollständig geübt. Nutze zusätzlich echte Aufnahmen und Partnergespräche.</p><p>Das Paket übt einen ausgewählten Wortschatz (Zielumfang ca. 550 Wörter und Wendungen in Jahrgangsstufe 5). Dein Lehrwerk, Unterricht und ein eigenes Vokabelheft mit Lautschrift und Beispielsätzen ergänzen ihn. Aktuelle Recherche und Lehrkraftfeedback bleiben eigene Aufgaben im Unterricht.</p></section><section class="panel"><h2>Quellen</h2><ul class="source-list">${SOURCES.map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a></li>`).join("")}</ul></section></div>`;
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
		localStorage.setItem("englisch_ms5_theme", theme);
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
