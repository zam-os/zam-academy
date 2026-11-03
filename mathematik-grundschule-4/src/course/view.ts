import { format } from "../math/place-value";
import { random } from "../practice/tasks";
import { algorithmBoard } from "./algorithm-board";
import type { ForestLesson } from "./catalog";
import { columnBoard } from "./column-board";
import { investigationBoard } from "./investigation-board";
import {
	activeForestTask,
	type ForestProgress,
	forestKey,
	forestRecallEligible,
	independentForest,
} from "./progress";
import { subtractionBoard } from "./subtraction-board";
import type { ForestTask } from "./tasks";
import { additionColumns } from "./written-addition";
import { ALGORITHM_EXAMPLES, algorithmModel } from "./written-algorithms";
import { subtractionColumns } from "./written-subtraction";
export const escapeHtml = (text: string): string =>
	text.replace(
		/[&<>"']/g,
		(c) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
				c
			] ?? c,
	);
export function forestGraphic(task: ForestTask, position = 0): string {
	if (task.columns)
		return task.kind === "columns"
			? ""
			: columnBoard(task.columns, [], false, false);
	if (task.hops) {
		const { start, unit, direction } = task.hops;
		const end = start + direction * position * unit;
		return `<div class="calculation-model"><p class="jump-equation">${format(start)} ${direction === 1 ? "+" : "−"} ${position} · ${format(unit)} = <strong>${format(end)}</strong></p><svg viewBox="0 0 700 130" role="img" aria-label="${position} ${position === 1 ? "Sprung" : "Sprünge"} zu je ${format(unit)} nach ${direction === 1 ? "rechts" : "links"}. Start ${format(start)}, aktuell ${format(end)}."><path d="M40 90H660" stroke="currentColor" stroke-width="3"/>${Array.from({ length: 11 }, (_, i) => `<path d="M${40 + i * 62} 82v16" stroke="currentColor" stroke-width="2"/>`).join("")}${Array.from(
			{ length: position },
			(_, i) => {
				const x = direction === 1 ? 40 + i * 62 : 660 - i * 62;
				return `<path d="M${x} 80q${direction * 31} -65 ${direction * 62} 0l${-direction * 12} -6m${direction * 12} 6v-15" fill="none" stroke="var(--purple)" stroke-width="4"/>`;
			},
		).join(
			"",
		)}<circle cx="${direction === 1 ? 40 + position * 62 : 660 - position * 62}" cy="90" r="12" class="path-marker"/></svg><p>Ein Sprung: ${direction === 1 ? "+" : "−"} ${format(unit)} · ${position} ${position === 1 ? "Sprung" : "Sprünge"} gewählt</p></div>`;
	}
	if (task.groups) {
		const { each } = task.groups;
		return `<div class="basket-model" role="group" aria-label="${position} ${position === 1 ? "Korb" : "Körbe"} mit je ${format(each)} Samen"><div class="basket-grid">${Array.from({ length: position }, () => `<span class="seed-basket"><span aria-hidden="true">♧</span><strong>${format(each)}</strong><small>Samen</small></span>`).join("") || "<p>Noch kein Korb gepackt.</p>"}</div><p class="jump-equation">${position} · ${format(each)} = <strong>${format(position * each)}</strong></p><p>${position} ${position === 1 ? "gleich gefüllter Korb" : "gleich gefüllte Körbe"} · je ${format(each)} Samen</p></div>`;
	}
	if (task.calculation) {
		const { a, b, op } = task.calculation;
		if (task.inverseProbe && op === "−")
			return `<div class="sum-puzzle" aria-label="Additionsprobe"><span>${format(b)}</span><b>+</b><span class="missing-part">?</span><b>=</b><span>${format(a)}</span></div>`;
		return `<div class="sum-puzzle" aria-label="Rechenaufgabe"><span>${format(a)}</span><b>${op}</b><span>${format(b)}</span><b>=</b><span class="missing-part">?</span></div>`;
	}
	if (task.line) {
		const { start, step } = task.line,
			marker = task.kind === "line" ? position : task.line.marker;
		const x = 45 + marker * 61;
		return `<div class="number-path"><svg viewBox="0 0 700 150" role="img" aria-label="Zahlenstrahl von ${format(start)} bis ${format(start + 10 * step)} mit zehn gleich großen Abschnitten${marker >= 0 ? `, Blatt am ${marker}. Abschnitt nach dem Anfang` : ""}"><path d="M45 90H655" stroke="currentColor" stroke-width="5"/>${Array.from({ length: 11 }, (_, i) => `<path d="M${45 + i * 61} 79v22" stroke="currentColor" stroke-width="3"/>`).join("")}<text x="45" y="132" text-anchor="start">${format(start)}</text><text x="655" y="132" text-anchor="end">${format(start + 10 * step)}</text>${marker >= 0 ? `<g transform="translate(${x} 53)"><circle r="21" class="path-marker"/><text y="8" text-anchor="middle" aria-hidden="true">♧</text><path d="M0 21v15" stroke="currentColor" stroke-width="3"/></g>` : ""}</svg></div>`;
	}
	if (task.kind === "split" && task.whole) {
		const left = (task.whole * position) / 10,
			right = task.whole - left;
		return `<div class="treasure-model" role="group" aria-label="Zerlegung von ${format(task.whole)}"><div class="treasure-whole">Ganzer Schatz: <strong>${format(task.whole)}</strong></div><div class="treasure-bar" aria-hidden="true"><span style="width:${position * 10}%"></span><span style="width:${100 - position * 10}%"></span></div><div class="treasure-parts"><span>Linke Truhe<strong>${format(left)}</strong></span><b>+</b><span>Rechte Truhe<strong>${format(right)}</strong></span></div><p>Beide Teile zusammen bleiben ${format(task.whole)}.</p></div>`;
	}
	if (task.kind === "choice" && task.numbers?.length === 2)
		return `<div class="number-gate" aria-label="Zwei Zahlen zum Vergleichen"><strong>${format(task.numbers[0])}</strong><span aria-hidden="true">?</span><strong>${format(task.numbers[1])}</strong></div>`;
	if (task.kind === "number" && task.whole && task.numbers)
		return `<div class="sum-puzzle"><span>${format(task.numbers[0])}</span><b>+</b><span class="missing-part">?</span><b>=</b><span>${format(task.whole)}</span></div>`;
	return "";
}
function choices(
	task: ForestTask,
	seed: number,
): NonNullable<ForestTask["choices"]> {
	const next = random(seed),
		options = [...(task.choices ?? [])];
	for (let i = options.length - 1; i > 0; i--) {
		const j = Math.floor(next() * (i + 1));
		[options[i], options[j]] = [options[j], options[i]];
	}
	return options;
}
export function forestTaskView(
	p: ForestProgress,
	task: ForestTask,
	feedback: string,
	draft: string,
): string {
	const key = forestKey(p),
		last = [...p.attempts].reverse().find((a) => a.key === key),
		solved = last?.outcome ?? false;
	const assisted = p.helped.includes(key) || last?.helped;
	const wrong = p.attempts.filter((a) => a.key === key && !a.outcome).length;
	const controls =
		task.kind === "line" ||
		task.kind === "split" ||
		task.kind === "hops" ||
		task.kind === "groups";
	const input =
		task.kind === "columns" ||
		task.kind === "subtraction" ||
		task.kind === "algorithm" ||
		task.kind === "investigation"
			? '<button class="primary" data-action="forest-check">Meine Rechnung prüfen</button>'
			: task.kind === "choice"
				? `<div class="answer-options">${choices(
						task,
						p.seed + p.round + p.index,
					)
						.map(
							(c) =>
								`<button data-action="forest-choice" data-value="${c.value}">${escapeHtml(c.label)}</button>`,
						)
						.join("")}</div>`
				: task.kind === "order" || task.kind === "parts"
					? `<div class="number-chips" role="group" aria-label="${task.kind === "order" ? "Zahlen in Reihenfolge auswählen" : "Passende Zahlenteile auswählen"}">${task.numbers?.map((n) => `<button data-action="forest-select" data-value="${n}" aria-pressed="${p.selection.includes(n)}" >${format(n)}</button>`).join("")}</div><p class="selection-readout" aria-live="polite">${p.selection.length ? `Deine Auswahl: ${p.selection.map(format).join(task.kind === "order" ? " → " : " + ")}` : "Wähle die Zahlen durch Antippen."}</p><button data-action="forest-back">Letzte Auswahl zurücknehmen</button><button data-action="forest-clear">Auswahl leeren</button><button class="primary" data-action="forest-check">Meine Auswahl prüfen</button>`
					: controls
						? `<div class="path-controls"><button data-action="forest-left" aria-label="${task.hops ? "Einen Sprung zurücknehmen" : task.groups ? "Einen Korb zurücknehmen" : "Einen Schritt nach links"}" ${p.position === 0 ? "disabled" : ""}>${task.hops || task.groups ? "−" : "←"}</button><label for="forest-position">${task.kind === "line" ? "Milos Standort" : task.kind === "hops" ? "Anzahl der Sprünge" : task.kind === "groups" ? "Anzahl der Körbe" : "Aufteilung der Truhen"}<input type="range" id="forest-position" data-action="forest-position" min="0" max="10" step="1" value="${p.position}"></label><button data-action="forest-right" aria-label="${task.hops ? "Einen Sprung hinzufügen" : task.groups ? "Einen Korb hinzufügen" : "Einen Schritt nach rechts"}" ${p.position === 10 ? "disabled" : ""}>${task.hops || task.groups ? "+" : "→"}</button></div><button class="primary" data-action="forest-check">Meine Darstellung prüfen</button>`
						: `<div class="numeric-answer"><label for="forest-answer">Meine Antwort<input id="forest-answer" inputmode="numeric" autocomplete="off" spellcheck="false" value="${escapeHtml(draft)}" placeholder="Zahl eingeben"></label><button class="primary" data-action="forest-check">Meine Idee prüfen</button></div>`;
	return `<span class="mission-label">${p.recall ? "Später erinnern · neue Aufgaben" : p.optional ? `Noch eine Runde · Stufe ${p.optional}` : p.stage === "lab" ? `Entdeckerwerkstatt · Ziel ${p.index + 1} von 3` : p.stage === "practice-1" || p.stage === "practice-2" ? `Stufe ${p.stage === "practice-1" ? 1 : 2} · ${p.solved[p.stage === "practice-1" ? 1 : 2]} von 3 Aufgaben gelöst` : p.stage === "quiz" ? "Ein kurzer Denkcheck" : `Neue Aufgabe · ${p.index + 1} von 3`}</span><h2 id="lesson-heading" tabindex="-1">${escapeHtml(task.prompt)}</h2><div id="forest-graphic">${task.investigation ? investigationBoard(task.investigation, p.investigationWork ?? [], solved) : task.algorithm ? algorithmBoard(task.algorithm, p.algorithmWork ?? [], solved) : task.subtraction ? subtractionBoard(task.subtraction, p.subtractionWork, solved) : task.kind === "columns" && task.columns ? columnBoard(task.columns, p.columnWork, solved) : forestGraphic(task, p.position)}</div>${solved ? `<div class="feedback success" role="status">${assisted ? "Mit Hilfe geschafft. " : "Richtig! "}${escapeHtml(task.explanation)}</div><button class="primary" data-action="forest-next">${p.optional ? "Noch eine Aufgabe" : "Weiter"}</button>` : `${input}<div class="help-row"><button class="text-button" data-action="forest-hint">Ein kleiner Tipp</button>${assisted || wrong >= 2 ? '<button class="text-button" data-action="forest-solution">Lösung gemeinsam ansehen</button>' : ""}</div>${feedback ? `<p class="feedback" role="status">${escapeHtml(feedback)}</p>` : ""}${assisted && feedback === task.explanation ? '<button class="primary" data-action="forest-worked">Mit Hilfe weiter</button>' : ""}`}${p.optional ? '<button class="text-button" data-action="forest-stop">Übungsrunde beenden</button>' : ""}`;
}
export function forestExplanation(def: ForestLesson): string {
	const algorithm =
		def.id === "schriftlich-multiplizieren"
			? ALGORITHM_EXAMPLES.multiply
			: def.id === "schriftlich-dividieren"
				? ALGORITHM_EXAMPLES.divide
				: null;
	const algorithmExample = algorithm
		? algorithmBoard(
				algorithm,
				algorithmModel(algorithm).answer.map(String),
				true,
			)
		: "";
	return `${def.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}<div class="example"><strong>Ein Beispiel</strong><p>${escapeHtml(def.example)}</p>${algorithmExample}${def.id === "schriftlich-subtrahieren" ? subtractionBoard({ a: 5002, b: 1786 }, { bundles: subtractionColumns(5002, 1786).bundles, result: subtractionColumns(5002, 1786).result.map(String) }, true) : ""}${def.id === "schriftlich-addieren" ? columnBoard({ a: 30407, b: 2685 }, additionColumns(30407, 2685).answer.map(String), true) : ""}</div><p class="merke"><strong>Merke:</strong> ${escapeHtml(def.takeaway)}</p>`;
}
export function forestTeacherPanel(def: ForestLesson): string {
	return `<details class="teacher-panel"><summary>So geht’s: Erklärung und Lehrervideo</summary><div class="teacher-content"><h3>${escapeHtml(def.shortTitle)}</h3><div class="video-pending"><span aria-hidden="true">🎬</span><div><strong>Das Lehrervideo kommt noch.</strong><p>Du kannst schon mit der Erklärung und der Werkstatt lernen.</p></div></div>${forestExplanation(def)}<p class="teacher-note">Erprobungsfassung: Aufnahme und fachliche Freigabe durch eine Grundschullehrkraft stehen noch aus.</p></div></details>`;
}
export function forestLessonView(
	def: ForestLesson,
	p: ForestProgress,
	feedback: string,
	draft: string,
): string {
	if (p.resting)
		return `<div class="pause"><span class="large-symbol">☾</span><h2 id="lesson-heading" tabindex="-1">Alles wartet auf dich.</h2><p>Deine Entdeckungen und Milos Belohnungen bleiben erhalten. Ihr könnt jederzeit weitermachen.</p><button class="primary" data-action="rest">Gemeinsam weitermachen</button></div>`;
	const task = activeForestTask(p);
	if (task) return forestTaskView(p, task, feedback, draft);
	if (p.stage === "welcome")
		return `<span class="mission-label">Ein neuer Ort im Zahlenwald</span><h2 id="lesson-heading" tabindex="-1">${escapeHtml(def.title)}</h2><div class="forest-emblem" aria-hidden="true">${def.icon}</div><p class="lead">${escapeHtml(def.lead)}</p><ul class="forest-goals">${def.goals.map((g) => `<li>${escapeHtml(g)}</li>`).join("")}</ul><p>Zwei Missionen mit Erklärung, drei Werkstattzielen und frischen Aufgaben. Du bestimmst dein Tempo.</p><button class="primary" data-action="forest-next">Mit Milo entdecken</button>`;
	if (p.stage === "learn")
		return `<span class="mission-label">Mission 1 · Zusammenhänge entdecken</span><h2 id="lesson-heading" tabindex="-1">${escapeHtml(def.shortTitle)}</h2>${forestExplanation(def)}<button class="primary" data-action="forest-next">Jetzt selbst ausprobieren</button>`;
	if (p.stage === "transfer")
		return `<div class="milestone"><span class="large-symbol">✿</span><span class="mission-label">Mission 1 geschafft</span><h2 id="lesson-heading" tabindex="-1">Eine Blume für eure Entdeckung!</h2><p>${escapeHtml(def.transfer)}</p><p>Die drei Werkstattziele und die erste Übungsstufe sind geschafft. Deine Blume bleibt.</p><button class="primary" data-action="forest-next">Mission 2 entdecken</button><button data-action="rest">Für heute eine Pause</button></div>`;
	return `<div class="milestone"><span class="large-symbol">✧</span><h2 id="lesson-heading" tabindex="-1">Eine neue Entdeckung für dich und Milo.</h2><p>Du hast beide Übungsstufen und drei neue Aufgaben bearbeitet. In der Elternansicht könnt ihr eure Schritte anschauen.</p><p class="explanation-callout">Ein Apfel ist als Dank für eure gemeinsame Übung da. Er ist keine Schulnote. Auch mit Hilfe darfst du dich über deine Entdeckung freuen.</p><button data-action="forest-practice" data-level="1">Weiterüben: Stufe 1</button><button data-action="forest-practice" data-level="2">Weiterüben: Stufe 2</button><button class="primary" data-action="rest">Für heute fertig</button>${forestRecallEligible(p) ? '<button data-action="forest-recall">Mit drei neuen Aufgaben nachschauen</button>' : '<p class="fine-print">Ab morgen kannst du mit drei neuen Aufgaben nachschauen, woran du dich erinnerst.</p>'}</div>`;
}
export function forestParentView(def: ForestLesson, p: ForestProgress): string {
	const date = (n: number) =>
		new Intl.DateTimeFormat("de-DE", {
			day: "numeric",
			month: "long",
			year: "numeric",
		}).format(n);
	return `<section class="parent-view"><p class="eyebrow">${escapeHtml(def.shortTitle)} · lokale Beobachtungen</p><h1>Das hat dein Kind ausprobiert.</h1><p class="lead">Diese Aufgaben stammen aus dieser Lektion auf diesem Gerät. Ein geübter Abschnitt ist noch kein Nachweis, dass alles sicher beherrscht wird.</p><div class="parent-grid"><div>${def.goals
		.map((goal, i) => {
			const attempts = p.attempts.filter((a) => a.goal === i + 1),
				success = [...attempts].reverse().find(independentForest),
				helped = [...attempts].reverse().find((a) => a.outcome && a.helped),
				last = success ?? helped ?? attempts.at(-1);
			const later =
				success?.mode === "later" &&
				p.completed["mission-b"] !== undefined &&
				success.at - p.completed["mission-b"] >= 86400000;
			const label = later
				? "An einem späteren Tag geprüft"
				: success
					? "Neue Aufgabe selbstständig gelöst"
					: helped
						? "Mit Hilfe geübt"
						: last
							? "Ausprobiert"
							: "Noch offen";
			return `<article class="observation"><span class="observation-mark" aria-hidden="true">${success ? "✓" : helped ? "◇" : "○"}</span><div><span class="eyebrow">${label}</span><h3>${escapeHtml(goal)}</h3><p>${last ? `${date(last.at)} · ${last.mode === "guided" ? "Übung in der Werkstatt" : "Neue Aufgabe"}${last.helped ? " · mit Tipp oder weiterem Versuch" : ""}` : "Dazu gibt es noch keinen Aufgabenversuch."}</p>${last ? `<p class="evidence-example">Beispiel: ${escapeHtml(last.prompt)} <span>${escapeHtml(last.explanation)}</span></p>` : ""}</div></article>`;
		})
		.join(
			"",
		)}</div><aside class="parent-tip"><h2>Eine Frage für zu Hause</h2><p>„${escapeHtml(def.parentPrompt)}“</p><p>Lass dein Kind seinen Weg zeigen. Eine Zeichnung oder Dinge vom Tisch reichen aus.</p><hr><h3>Der nächste kleine Schritt</h3><p>${p.stage === "finished" ? "Mit frischen Aufgaben weiterüben oder beim nächsten Besuch eine andere Lektion im Zahlenwald entdecken." : "Die aktuelle Mission fortsetzen. Hinweise und Pausen sind jederzeit erlaubt."}</p></aside></div><p class="fine-print">Quelle: lokale Academy-Übungen · keine Schulnote, Diagnose oder Schullaufbahnempfehlung. ZAM-Wiederholungen werden getrennt in ZAM geführt.</p></section>`;
}
