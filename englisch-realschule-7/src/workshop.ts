import { esc } from "./practice";
import {
	renderDublinMap,
	renderEmigrationMap,
	renderIrelandMap,
	renderRomanBritainMap,
} from "./places-map";
import type { Lesson, Workshop } from "./types";

export function workshopGoals(
	workshop: Workshop,
	answers: string[],
): boolean[] {
	return workshop.goals.map((goal, index) => answers[index] === goal.answer);
}

/** Format numbers for German learner text: decimal comma and U+2212 minus. */
export function fmtDe(value: number, decimals = 0): string {
	const rounded = Number(value.toFixed(decimals));
	const normalized = Object.is(rounded, -0) ? 0 : rounded;
	return new Intl.NumberFormat("de-DE", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	})
		.format(normalized)
		.replace(/-/g, "−");
}

/* ---------- History timeline: from the Celts to the Normans ---------- */

export type Era = "celts" | "romans" | "anglo-saxons" | "normans";
export interface HistoryEvent {
	year: number;
	era: Era;
	en: string;
	de: string;
}

/** Selected dates from the textbooks' canon; "c." marks approximate years. */
export const HISTORY_EVENTS: readonly HistoryEvent[] = [
	{ year: -500, era: "celts", en: "By about this time, Celtic tribes live in Britain and Ireland. They build hillforts and roundhouses; Druids are their priests.", de: "Eisenzeit: keltische Stämme auf beiden Inseln." },
	{ year: -55, era: "celts", en: "Julius Caesar lands in Britain, but his army does not stay.", de: "Erster römischer Besuch, noch keine Eroberung." },
	{ year: 43, era: "romans", en: "Emperor Claudius sends an army: the south of the island becomes the Roman province of Britannia.", de: "Beginn der römischen Herrschaft in Britannien." },
	{ year: 61, era: "romans", en: "Around this time (AD 60 or 61), Queen Boudica leads a revolt against the Romans and burns Londinium.", de: "Aufstand der Icener unter Boudica." },
	{ year: 122, era: "romans", en: "The Romans start to build Hadrian's Wall in the north.", de: "Der Hadrianswall sichert die Nordgrenze." },
	{ year: 410, era: "romans", en: "c. 410: The Roman army leaves Britain.", de: "Ende der römischen Herrschaft (um 410)." },
	{ year: 450, era: "anglo-saxons", en: "c. 450: Angles, Saxons and Jutes from northern Germany and Denmark settle in Britain.", de: "Germanische Siedler kommen über die Nordsee." },
	{ year: 597, era: "anglo-saxons", en: "Augustine arrives in Kent and brings Christianity to the Anglo-Saxons.", de: "Christianisierung der Angelsachsen." },
	{ year: 793, era: "anglo-saxons", en: "Vikings attack the monastery of Lindisfarne.", de: "Beginn der Wikingerüberfälle." },
	{ year: 878, era: "anglo-saxons", en: "King Alfred the Great defeats a Viking army at Edington.", de: "Alfred der Große stoppt die Wikinger." },
	{ year: 1066, era: "normans", en: "William of Normandy wins the Battle of Hastings and becomes King of England.", de: "Normannische Eroberung Englands." },
	{ year: 1086, era: "normans", en: "The Domesday Book lists the land, people and animals of England.", de: "Bestandsaufnahme des eroberten Landes." },
	{ year: 1169, era: "normans", en: "Norman knights land in Ireland.", de: "Die Normannen kommen nach Irland." },
];

export const ERA_LABELS: Record<Era, { en: string; de: string }> = {
	celts: { en: "The Celts", de: "Kelten" },
	romans: { en: "Roman Britain", de: "Römer" },
	"anglo-saxons": { en: "Anglo-Saxons and Vikings", de: "Angelsachsen und Wikinger" },
	normans: { en: "The Normans", de: "Normannen" },
};

export function yearLabel(year: number): string {
	return year < 0 ? `${-year} BC` : `AD ${year}`;
}

export function historyEvent(index: number): HistoryEvent & { label: string } {
	const safe = Math.max(
		0,
		Math.min(HISTORY_EVENTS.length - 1, Math.round(index)),
	);
	const event = HISTORY_EVENTS[safe];
	return { ...event, label: yearLabel(event.year) };
}

/* ---------- since / for: the present perfect progressive ---------- */

export function clockLabel(hour: number): string {
	const h = Math.round(hour);
	if (h === 12) return "12 noon";
	return h < 12 ? `${h} a.m.` : `${h - 12} p.m.`;
}

/** It is 5 p.m. now; Aoife started practising at the chosen hour. */
export function sinceFor(startHour: number, nowHour = 17): {
	since: string;
	for: string;
	en: string;
	de: string;
} {
	const start = Math.max(9, Math.min(nowHour - 1, Math.round(startHour)));
	const hours = nowHour - start;
	const span = `${hours} ${hours === 1 ? "hour" : "hours"}`;
	return {
		since: `since ${clockLabel(start)}`,
		for: `for ${span}`,
		en: `Aoife has been practising the fiddle since ${clockLabel(start)}. She has been practising for ${span}.`,
		de: `since + Zeitpunkt (${clockLabel(start)}) · for + Zeitraum (${hours} ${hours === 1 ? "Stunde" : "Stunden"})`,
	};
}

/* ---------- past perfect: which action happened first? ---------- */

export function pastPerfectScene(arrivalMinute: number): {
	time: string;
	en: string;
	de: string;
} {
	const minute = Math.max(0, Math.min(30, Math.round(arrivalMinute / 5) * 5));
	const time = `10:${String(minute).padStart(2, "0")}`;
	if (minute > 15)
		return {
			time,
			en: `When Liam arrived at the bus stop at ${time}, the bus had already left.`,
			de: "Der Bus fuhr zuerst ab (Past Perfect: had left), danach kam Liam an (Simple Past: arrived).",
		};
	if (minute === 15)
		return {
			time,
			en: "When Liam arrived at 10:15, the bus was just leaving.",
			de: "Beides geschieht gleichzeitig: Past Progressive (was leaving) statt Past Perfect.",
		};
	return {
		time,
		en: `When Liam arrived at ${time}, the bus hadn't left yet, so he caught it.`,
		de: "Liam ist zuerst da; der Bus war noch nicht abgefahren (hadn't left yet).",
	};
}

/* ---------- if-clauses: type 0, 1 and 2 ---------- */

export function conditionalPattern(type: number): {
	type: 0 | 1 | 2;
	pattern: string;
	en: string;
	de: string;
} {
	const t = Math.max(0, Math.min(2, Math.round(type))) as 0 | 1 | 2;
	if (t === 0)
		return {
			type: 0,
			pattern: "if + simple present → simple present",
			en: "If you heat ice, it melts.",
			de: "Typ 0: Das gilt immer (Naturgesetz, allgemeine Tatsache).",
		};
	if (t === 1)
		return {
			type: 1,
			pattern: "if + simple present → will + infinitive",
			en: "If it rains on Saturday, we will watch a film at home.",
			de: "Typ 1: Die Bedingung ist gut möglich (reale Zukunft).",
		};
	return {
		type: 2,
		pattern: "if + simple past → would + infinitive",
		en: "If I lived in Dublin, I would go to a hurling match every week.",
		de: "Typ 2: Die Bedingung ist unwahrscheinlich oder nur gedacht.",
	};
}

/* ---------- sales tax at the checkout in the USA ---------- */

export function salesTax(price: number, ratePercent: number): {
	tax: number;
	total: number;
} {
	const cents = Math.round(price * 100);
	const taxCents = Math.round((cents * ratePercent) / 100);
	return { tax: taxCents / 100, total: (cents + taxCents) / 100 };
}

/** US price format for the English readout, e.g. "$21.60". */
export function usd(value: number): string {
	return `$${value.toFixed(2)}`;
}

/* ---------- illustrations ---------- */

function renderHistoryExplorer(): string {
	const last = HISTORY_EVENTS.length - 1;
	const x = (index: number) => 40 + (index / last) * 420;
	return `<div class="explorer history-explorer">
		<svg viewBox="0 0 500 120" role="img" aria-label="Zeitstrahl von 500 v. Chr. bis 1169 n. Chr. mit den Epochen Kelten, Römer, Angelsachsen und Normannen">
			<line x1="30" y1="62" x2="470" y2="62" class="timeline-axis"/>
			${HISTORY_EVENTS.map((event, index) => `<circle cx="${x(index)}" cy="62" r="6" class="era-dot era-${event.era}"/>`).join("")}
			<text x="${x(0)}" y="96" text-anchor="start">${yearLabel(HISTORY_EVENTS[0].year)}</text>
			<text x="${x(last)}" y="96" text-anchor="end">AD ${HISTORY_EVENTS[last].year}</text>
			<text x="${x(0.5)}" y="36" class="era-name era-celts">Celts</text>
			<text x="${x(3.5)}" y="36" class="era-name era-romans" text-anchor="middle">Romans</text>
			<text x="${x(7.5)}" y="36" class="era-name era-anglo-saxons" text-anchor="middle">Anglo-Saxons · Vikings</text>
			<text x="${x(11)}" y="36" class="era-name era-normans" text-anchor="middle">Normans</text>
			<line id="history-cursor" x1="${x(4)}" y1="44" x2="${x(4)}" y2="80" class="timeline-cursor"/>
		</svg>
		<label for="history-slider">Ereignis auf dem Zeitstrahl wählen</label>
		<input id="history-slider" type="range" min="0" max="${last}" step="1" value="4">
		<p id="history-readout" lang="en" aria-live="polite"></p>
		<p id="history-note" class="small" aria-live="polite"></p>
	</div>`;
}

function renderSinceForExplorer(): string {
	return `<div class="explorer since-explorer">
		<svg viewBox="0 0 500 110" role="img" aria-label="Zeitstrahl von 9 Uhr bis 17 Uhr: since nennt den Startpunkt, for die Dauer bis jetzt">
			<line x1="30" y1="60" x2="470" y2="60" class="timeline-axis"/>
			${Array.from({ length: 9 }, (_, i) => `<text x="${40 + i * 52}" y="96" text-anchor="middle">${i + 9 === 12 ? "12" : (i + 9) % 12}</text>`).join("")}
			<rect id="since-bar" x="248" y="50" width="208" height="20" rx="10" class="compare-bar"/>
			<circle id="since-start" cx="248" cy="60" r="9" class="compare-bar-alt"/>
			<text x="456" y="34" text-anchor="middle">now (5 p.m.)</text>
		</svg>
		<label for="since-slider">Wann hat Aoife angefangen? 9 a.m. bis 4 p.m.</label>
		<input id="since-slider" type="range" min="9" max="16" step="1" value="13">
		<p id="since-readout" lang="en" aria-live="polite"></p>
		<p id="since-note" class="small" aria-live="polite"></p>
	</div>`;
}

function renderPastPerfectExplorer(): string {
	return `<div class="explorer past-perfect-explorer">
		<svg viewBox="0 0 500 110" role="img" aria-label="Zeitstrahl von 10:00 bis 10:30 Uhr: Der Bus fährt um 10:15 Uhr ab, Liams Ankunftszeit ist einstellbar">
			<line x1="30" y1="60" x2="470" y2="60" class="timeline-axis"/>
			${[0, 5, 10, 15, 20, 25, 30].map((m) => `<text x="${40 + (m / 30) * 420}" y="96" text-anchor="middle">10:${String(m).padStart(2, "0")}</text>`).join("")}
			<rect x="242" y="44" width="36" height="32" rx="6" class="compare-bar"/>
			<text x="260" y="34" text-anchor="middle">bus leaves</text>
			<line id="arrival-cursor" x1="320" y1="40" x2="320" y2="80" class="timeline-cursor"/>
		</svg>
		<label for="arrival-slider">Wann kommt Liam an der Haltestelle an?</label>
		<input id="arrival-slider" type="range" min="0" max="30" step="5" value="20">
		<p id="arrival-readout" lang="en" aria-live="polite"></p>
		<p id="arrival-note" class="small" aria-live="polite"></p>
	</div>`;
}

function renderIfExplorer(): string {
	return `<div class="explorer if-explorer">
		<div class="if-scale" aria-hidden="true"><span>immer wahr</span><span>gut möglich</span><span>unwahrscheinlich / gedacht</span></div>
		<label for="if-slider">Wie wahrscheinlich ist die Bedingung?</label>
		<input id="if-slider" type="range" min="0" max="2" step="1" value="1">
		<p id="if-pattern" class="if-pattern" aria-live="polite"></p>
		<p id="if-readout" lang="en" aria-live="polite"></p>
		<p id="if-note" class="small" aria-live="polite"></p>
	</div>`;
}

function renderSalesTaxExplorer(): string {
	return `<div class="explorer tax-explorer">
		<div class="price-tag" aria-hidden="true"><span>Hoodie</span><strong id="tag-price">$40.00</strong><small>+ tax</small></div>
		<div>
			<label for="tax-price">Preis auf dem Schild: <span id="tax-price-val"></span></label>
			<input id="tax-price" type="range" min="10" max="100" step="5" value="40">
			<label for="tax-rate">Beispielsatz für die sales tax: <span id="tax-rate-val"></span></label>
			<input id="tax-rate" type="range" min="0" max="10" step="1" value="7">
			<p id="tax-readout" lang="en" aria-live="polite"></p>
			<p id="tax-note" class="small" aria-live="polite"></p>
		</div>
	</div>`;
}

function renderYouthSurvey(): string {
	const items = [
		{ label: "Listening to music", pct: 85, kind: "music" },
		{ label: "Doing sport", pct: 60, kind: "sport" },
		{ label: "Watching films and series", pct: 55, kind: "film" },
		{ label: "Theatre or drama club", pct: 15, kind: "theatre" },
	];
	return `<figure class="places-map"><svg viewBox="0 0 500 185" role="img" aria-label="Erfundene Beispielumfrage der Klasse 7c zur Freizeit (Übungswerte, keine echte Statistik)">
		${items
			.map((item, idx) => {
				const y = 18 + idx * 40;
				const width = Math.round(item.pct * 2.5);
				return `<text x="12" y="${y + 18}" class="region-name">${esc(item.label)}</text>
				<rect x="196" y="${y + 4}" width="${width}" height="20" rx="6" class="survey-bar survey-${item.kind}"/>
				<text x="${204 + width}" y="${y + 18}" class="region-name">${item.pct} %</text>`;
			})
			.join("")}
	</svg><figcaption>Erfundene Beispielumfrage (Klasse 7c · Übungsmaterial, keine echte Statistik): „What do you do in your free time at least once a week?“ Mehrfachnennungen möglich.</figcaption></figure>`;
}

function renderJobsChart(): string {
	const items = [
		{ label: "Services (shops, hospitals, offices)", pct: 55, kind: "film" },
		{ label: "Technology and pharma", pct: 25, kind: "music" },
		{ label: "Tourism", pct: 12, kind: "sport" },
		{ label: "Farming", pct: 8, kind: "theatre" },
	];
	return `<figure class="places-map"><svg viewBox="0 0 520 185" role="img" aria-label="Erfundene Beispielgrafik: Berufe der Eltern einer Klasse in Cork (Übungswerte, keine echte Statistik)">
		${items
			.map((item, idx) => {
				const y = 18 + idx * 40;
				const width = Math.round(item.pct * 4);
				return `<text x="12" y="${y + 18}" class="region-name">${esc(item.label)}</text>
				<rect x="236" y="${y + 4}" width="${width}" height="20" rx="6" class="survey-bar survey-${item.kind}"/>
				<text x="${244 + width}" y="${y + 18}" class="region-name">${item.pct} %</text>`;
			})
			.join("")}
	</svg><figcaption>Erfundene Beispielgrafik (Übungsmaterial, keine echte Statistik): Berufe der Eltern einer 7. Klasse in Cork. Echte Zahlen findest du auf offiziellen Seiten der EU oder der irischen Regierung.</figcaption></figure>`;
}

function renderSchoolCompare(): string {
	return `<figure class="places-map"><svg viewBox="0 0 540 230" role="img" aria-label="Vergleich der Schulbegriffe in England und den USA">
		<rect x="10" y="10" width="250" height="210" rx="12" class="land"/>
		<rect x="280" y="10" width="250" height="210" rx="12" class="land"/>
		<text x="135" y="38" text-anchor="middle" class="region-name">England</text>
		<text x="405" y="38" text-anchor="middle" class="region-name">USA</text>
		<rect x="24" y="54" width="222" height="40" rx="8" class="school-state"/>
		<text x="135" y="79" text-anchor="middle">state school (free)</text>
		<rect x="294" y="54" width="222" height="40" rx="8" class="school-state"/>
		<text x="405" y="79" text-anchor="middle">public school (free)</text>
		<rect x="24" y="106" width="222" height="40" rx="8" class="school-private"/>
		<text x="135" y="131" text-anchor="middle">independent / “public” school</text>
		<rect x="294" y="106" width="222" height="40" rx="8" class="school-private"/>
		<text x="405" y="131" text-anchor="middle">private school (fees)</text>
		<rect x="24" y="158" width="222" height="40" rx="8" class="school-boarding"/>
		<text x="135" y="183" text-anchor="middle">boarding school</text>
		<rect x="294" y="158" width="222" height="40" rx="8" class="school-boarding"/>
		<text x="405" y="183" text-anchor="middle">boarding school</text>
	</svg><figcaption>Gleiche Farbe = gleiche Schulart. Vorsicht: Eine englische „public school“ wie Eton ist eine teure Privatschule, eine amerikanische „public school“ dagegen eine kostenlose staatliche Schule.</figcaption></figure>`;
}

function renderIntonation(): string {
	return `<figure class="places-map"><svg viewBox="0 0 540 170" role="img" aria-label="Intonationspfeile: fallende Stimme bei einer erwarteten Zustimmung, steigende Stimme bei einer echten Frage">
		<text x="20" y="40">It's cold today,</text>
		<text x="150" y="40" class="tone-fall">isn't it?</text>
		<path class="tone-arrow fall" d="M150 52 C180 52, 205 62, 225 78"/>
		<text x="270" y="40" class="small-note">↘ falling: Ich erwarte Zustimmung.</text>
		<text x="20" y="120">You're from Cork,</text>
		<text x="160" y="120" class="tone-rise">aren't you?</text>
		<path class="tone-arrow rise" d="M160 150 C190 150, 220 140, 245 124"/>
		<text x="270" y="120" class="small-note">↗ rising: Ich bin nicht sicher.</text>
	</svg><figcaption>Die Stimme macht den Unterschied: fallend = Bestätigung erwartet, steigend = echte Frage.</figcaption></figure>`;
}

function renderLetterLayout(): string {
	const parts = [
		["Dear Siobhan,", "greeting · Anrede"],
		["Thanks for your letter …", "opening · Bezug auf den Brief"],
		["First, … Then, … However, …", "body · linking words"],
		["Write back soon! / Best wishes,", "closing · Schlussformel"],
		["Lena", "your name · Name"],
	];
	return `<figure class="places-map"><svg viewBox="0 0 540 250" role="img" aria-label="Aufbau eines persönlichen Briefs oder einer E-Mail mit Anrede, Einleitung, Hauptteil, Schluss und Name">
		<rect x="14" y="10" width="300" height="230" rx="12" class="land"/>
		${parts
			.map(
				([line, note], i) =>
					`<rect x="28" y="${22 + i * 43}" width="272" height="32" rx="6" class="letter-part part-${i}"/><text x="40" y="${43 + i * 43}">${esc(line)}</text><text x="330" y="${43 + i * 43}" class="region-name">${esc(note)}</text>`,
			)
			.join("")}
	</svg><figcaption>Persönliche Briefe und E-Mails: Anrede mit Komma, eine Einleitung mit Bezug, ein gegliederter Hauptteil mit linking words und eine Schlussformel.</figcaption></figure>`;
}

function renderWordBuilder(): string {
	return `<figure class="places-map"><svg viewBox="0 0 540 210" role="img" aria-label="Wortfamilie zu help mit Präfix, Suffixen, Zusammensetzung und Konversion">
		<rect x="214" y="84" width="112" height="40" rx="20" class="word-root"/>
		<text x="270" y="109" text-anchor="middle">help</text>
		<path class="word-link" d="M214 104 H150 M326 104 H390 M270 84 V54 M270 124 V154 M240 124 L160 162 M300 124 L380 162"/>
		<rect x="40" y="86" width="110" height="36" rx="8" class="word-suffix"/><text x="95" y="109" text-anchor="middle">helpful</text>
		<rect x="390" y="86" width="110" height="36" rx="8" class="word-suffix"/><text x="445" y="109" text-anchor="middle">helpless</text>
		<rect x="215" y="18" width="110" height="36" rx="8" class="word-suffix"/><text x="270" y="41" text-anchor="middle">helper</text>
		<rect x="200" y="154" width="140" height="36" rx="8" class="word-prefix"/><text x="270" y="177" text-anchor="middle">unhelpful</text>
		<rect x="60" y="160" width="100" height="36" rx="8" class="word-compound"/><text x="110" y="183" text-anchor="middle">helpline</text>
		<rect x="380" y="160" width="140" height="36" rx="8" class="word-conversion"/><text x="450" y="183" text-anchor="middle">to help → a help</text>
	</svg><figcaption>Farbcode: Grün = Suffix, Rot = Präfix, Blau = Zusammensetzung, Gelb = Konversion (gleiches Wort, neue Wortart).</figcaption></figure>`;
}

function illustration(lesson: Lesson): string {
	switch (lesson.workshop.kind) {
		case "history-timeline":
			return renderHistoryExplorer();
		case "roman-britain":
			return renderRomanBritainMap();
		case "emigration-route":
			return renderEmigrationMap();
		case "ireland-map":
			return renderIrelandMap();
		case "dublin-map":
			return renderDublinMap();
		case "since-for":
			return renderSinceForExplorer();
		case "past-perfect":
			return renderPastPerfectExplorer();
		case "if-machine":
			return renderIfExplorer();
		case "sales-tax":
			return renderSalesTaxExplorer();
		case "youth-survey":
			return renderYouthSurvey();
		case "jobs-chart":
			return renderJobsChart();
		case "school-compare":
			return renderSchoolCompare();
		case "intonation":
			return renderIntonation();
		case "letter-layout":
			return renderLetterLayout();
		case "word-builder":
			return renderWordBuilder();
		default:
			return "";
	}
}

export function renderWorkshop(lesson: Lesson): string {
	return `<section class="panel workshop" aria-labelledby="workshop-title"><h2 id="workshop-title">Deine Entdeckerwerkstatt</h2><p>Verbinde die Bausteine. Beobachte, was sich ändert, und erreiche die drei Ziele. Du kannst jede Auswahl ändern.</p>${illustration(lesson)}<div class="construction">${lesson.workshop.goals
		.map((goal, index) => {
			const options = [
				...goal.options.slice(index + 1),
				...goal.options.slice(0, index + 1),
			];
			return `<div class="construction-row" data-goal="${index}"><span class="goal-number" aria-hidden="true">${index + 1}</span><div><label for="workshop-${index}">${esc(goal.label)}</label><div class="word-chain">${goal.before ? `<span class="word-piece" lang="en">${esc(goal.before)}</span><span aria-hidden="true">→</span>` : ""}<select id="workshop-${index}" data-workshop="${index}"><option value="">Baustein wählen…</option>${options.map((option) => `<option lang="en" value="${esc(option)}">${esc(option)}</option>`).join("")}</select>${goal.after ? `<span class="word-piece" lang="en">${esc(goal.after)}</span>` : ""}</div><p class="goal-feedback small" role="status">Ziel noch offen.</p></div></div>`;
		})
		.join("")}</div><p id="workshop-status" role="status">0 von 3 Zielen erreicht.</p></section>`;
}

function text(container: HTMLElement, selector: string, value: string): void {
	const target = container.querySelector(selector);
	if (target) target.textContent = value;
}

export function bindWorkshop(
	lesson: Lesson,
	container: HTMLElement,
	complete: () => void,
): void {
	const inputs = [
		...container.querySelectorAll<HTMLSelectElement>("[data-workshop]"),
	];
	for (const input of inputs)
		input.addEventListener("change", () => {
			const reached = workshopGoals(
				lesson.workshop,
				inputs.map((entry) => entry.value),
			);
			container
				.querySelectorAll<HTMLElement>("[data-goal]")
				.forEach((row, index) => {
					row.dataset.reached = String(reached[index]);
					row.querySelector(".goal-feedback")!.textContent = reached[index]
						? `✓ ${lesson.workshop.goals[index].explanation}`
						: inputs[index].value
							? "Noch offen. Vergleiche den Baustein mit der Erklärung und dem Material."
							: "Ziel noch offen.";
				});
			const count = reached.filter(Boolean).length;
			text(
				container,
				"#workshop-status",
				`${count} von 3 Zielen erreicht.${count === 3 ? " Werkstatt gespeichert." : ""}`,
			);
			if (count === 3) complete();
		});
	for (const button of container.querySelectorAll<HTMLButtonElement>(
		"[data-map-focus]",
	))
		button.addEventListener("click", () => {
			const selected = button.getAttribute("aria-pressed") !== "true";
			for (const other of container.querySelectorAll("[data-map-focus]"))
				other.setAttribute(
					"aria-pressed",
					String(other === button && selected),
				);
			for (const layer of container.querySelectorAll<SVGGElement>(
				"[data-map-layer]",
			))
				layer.style.opacity =
					selected && layer.dataset.mapLayer !== button.dataset.mapFocus
						? "0.18"
						: "1";
		});

	const history = container.querySelector<HTMLInputElement>("#history-slider");
	if (history) {
		const last = HISTORY_EVENTS.length - 1;
		const update = () => {
			const event = historyEvent(Number(history.value));
			const index = HISTORY_EVENTS.findIndex((e) => e.year === event.year);
			const x = 40 + (index / last) * 420;
			const cursor = container.querySelector("#history-cursor");
			cursor?.setAttribute("x1", String(x));
			cursor?.setAttribute("x2", String(x));
			text(container, "#history-readout", `${event.label} · ${event.en}`);
			text(
				container,
				"#history-note",
				`Epoche: ${ERA_LABELS[event.era].de} (${ERA_LABELS[event.era].en}) · ${event.de}`,
			);
		};
		history.addEventListener("input", update);
		update();
	}

	const since = container.querySelector<HTMLInputElement>("#since-slider");
	if (since) {
		const update = () => {
			const start = Number(since.value);
			const info = sinceFor(start);
			const x = 40 + (start - 9) * 52;
			container.querySelector("#since-start")?.setAttribute("cx", String(x));
			const bar = container.querySelector("#since-bar");
			bar?.setAttribute("x", String(x));
			bar?.setAttribute("width", String(456 - x));
			text(container, "#since-readout", info.en);
			text(container, "#since-note", info.de);
		};
		since.addEventListener("input", update);
		update();
	}

	const arrival = container.querySelector<HTMLInputElement>("#arrival-slider");
	if (arrival) {
		const update = () => {
			const minute = Number(arrival.value);
			const x = 40 + (minute / 30) * 420;
			const cursor = container.querySelector("#arrival-cursor");
			cursor?.setAttribute("x1", String(x));
			cursor?.setAttribute("x2", String(x));
			const info = pastPerfectScene(minute);
			text(container, "#arrival-readout", info.en);
			text(container, "#arrival-note", info.de);
		};
		arrival.addEventListener("input", update);
		update();
	}

	const ifSlider = container.querySelector<HTMLInputElement>("#if-slider");
	if (ifSlider) {
		const update = () => {
			const info = conditionalPattern(Number(ifSlider.value));
			text(container, "#if-pattern", `Type ${info.type}: ${info.pattern}`);
			text(container, "#if-readout", info.en);
			text(container, "#if-note", info.de);
		};
		ifSlider.addEventListener("input", update);
		update();
	}

	const price = container.querySelector<HTMLInputElement>("#tax-price");
	const rate = container.querySelector<HTMLInputElement>("#tax-rate");
	if (price && rate) {
		const update = () => {
			const p = Number(price.value);
			const r = Number(rate.value);
			const { tax, total } = salesTax(p, r);
			text(container, "#tag-price", usd(p));
			text(container, "#tax-price-val", `${fmtDe(p, 2)} $`);
			text(container, "#tax-rate-val", `${fmtDe(r)} %`);
			text(
				container,
				"#tax-readout",
				`The price tag says ${usd(p)}. With ${r} % sales tax you pay ${usd(total)} at the checkout.`,
			);
			text(
				container,
				"#tax-note",
				`Steuer ${fmtDe(tax, 2)} $ · an der Kasse ${fmtDe(total, 2)} $. Der Satz ist ein Beispiel: Er hängt vom Bundesstaat und oft von der Stadt ab, manche Staaten erheben keine.`,
			);
		};
		price.addEventListener("input", update);
		rate.addEventListener("input", update);
		update();
	}
}
