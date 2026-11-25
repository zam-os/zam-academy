import { esc } from "./practice";
import type { DiagramNode, Lesson } from "./types";

export type AblAbsMode = "ppp" | "ppa" | "nominal";
export type AblAbsStyle = "adverbial" | "prepositional" | "coordinate";
export type MainTense = "haupttempus" | "nebentempus";
export type TimeRelation = "gleichzeitig" | "vorzeitig";
export type Conjugation = "a" | "e" | "i" | "kons";
export type KonjTense = "praesens" | "perfekt";
export type KonjVoice = "aktiv" | "passiv";
export type HauptsatzMood = "hortativ" | "jussiv" | "prohibitiv" | "optativ";

export interface AblAbsResult {
	noun: string;
	participle: string;
	relation: string;
	latin: string;
	german: string;
	hint: string;
}

export function ablAbsModel(mode: AblAbsMode, style: AblAbsStyle): AblAbsResult {
	const data: Record<AblAbsMode, Omit<AblAbsResult, "german"> & Record<AblAbsStyle, string>> = {
		ppp: {
			noun: "urbe (Abl.)",
			participle: "capta (PPP Abl.)",
			relation: "Vorzeitigkeit · Passiv",
			latin: "Urbe capta milites discesserunt.",
			hint: "Das Bezugswort steht im Ablativ; das PPP drückt aus, dass die Handlung vor dem Hauptsatz geschah.",
			adverbial: "Nachdem die Stadt eingenommen worden war, zogen die Soldaten ab.",
			prepositional: "Nach der Einnahme der Stadt zogen die Soldaten ab.",
			coordinate: "Die Stadt wurde eingenommen, und danach zogen die Soldaten ab.",
		},
		ppa: {
			noun: "duce (Abl.)",
			participle: "imperante (PPA Abl.)",
			relation: "Gleichzeitigkeit · Aktiv",
			latin: "Duce imperante milites pugnaverunt.",
			hint: "Das PPA im Ablativ (-nte/-ntibus) läuft gleichzeitig zur Handlung des Hauptsatzes ab.",
			adverbial: "Während der Feldherr befahl, kämpften die Soldaten.",
			prepositional: "Auf den Befehl / unter Führung des Feldherrn kämpften die Soldaten.",
			coordinate: "Der Feldherr befahl, und dabei kämpften die Soldaten.",
		},
		nominal: {
			noun: "Cicerone (Abl.)",
			participle: "consule (Präd. Abl.)",
			relation: "Gleichzeitigkeit · ohne Partizip",
			latin: "Cicerone consule pax servata est.",
			hint: "Im nominalen Abl. abs. tritt ein zweites Nomen oder Adjektiv an die Stelle des Partizips (ergänze gedanklich „sein“).",
			adverbial: "Als Cicero Konsul war, wurde der Frieden bewahrt.",
			prepositional: "Unter dem Konsulat Ciceros wurde der Frieden bewahrt.",
			coordinate: "Cicero war Konsul, und in dieser Zeit wurde der Frieden bewahrt.",
		},
	};
	const entry = data[mode];
	return {
		noun: entry.noun,
		participle: entry.participle,
		relation: entry.relation,
		latin: entry.latin,
		hint: entry.hint,
		german: entry[style],
	};
}

export interface ConsecutioResult {
	rule: string;
	mainClause: string;
	subClause: string;
	subForm: string;
	tenseLabel: string;
	translation: string;
}

export function consecutioModel(
	mainTense: MainTense,
	relation: TimeRelation,
): ConsecutioResult {
	if (mainTense === "haupttempus" && relation === "gleichzeitig") {
		return {
			rule: "Haupttempus + Gleichzeitigkeit → Konjunktiv Präsens",
			mainClause: "Rogo / Rogabo,",
			subClause: "quid amicus faciat.",
			subForm: "faciat",
			tenseLabel: "Konj. Präsens",
			translation: "Ich frage / werde fragen, was der Freund tut.",
		};
	}
	if (mainTense === "haupttempus" && relation === "vorzeitig") {
		return {
			rule: "Haupttempus + Vorzeitigkeit → Konjunktiv Perfekt",
			mainClause: "Rogo / Rogabo,",
			subClause: "quid amicus fecerit.",
			subForm: "fecerit",
			tenseLabel: "Konj. Perfekt",
			translation: "Ich frage / werde fragen, was der Freund getan hat.",
		};
	}
	if (mainTense === "nebentempus" && relation === "gleichzeitig") {
		return {
			rule: "Nebentempus + Gleichzeitigkeit → Konjunktiv Imperfekt",
			mainClause: "Rogabam / Rogavi,",
			subClause: "quid amicus faceret.",
			subForm: "faceret",
			tenseLabel: "Konj. Imperfekt",
			translation: "Ich fragte / habe gefragt, was der Freund tat.",
		};
	}
	return {
		rule: "Nebentempus + Vorzeitigkeit → Konjunktiv Plusquamperfekt",
		mainClause: "Rogabam / Rogavi,",
		subClause: "quid amicus fecisset.",
		subForm: "fecisset",
		tenseLabel: "Konj. Plusquamperfekt",
		translation: "Ich fragte / habe gefragt, was der Freund getan hatte.",
	};
}

export interface KonjunktivFormResult {
	stem: string;
	marker: string;
	ending: string;
	fullForm: string;
	translation: string;
	hint: string;
}

export function konjunktivForm(
	conj: Conjugation,
	tense: KonjTense,
	voice: KonjVoice,
): KonjunktivFormResult {
	const verbs: Record<
		Conjugation,
		{
			label: string;
			presStem: string;
			perfStem: string;
			ppp: string;
			meaning: string;
		}
	> = {
		a: {
			label: "a-Konjugation (laudare)",
			presStem: "laud",
			perfStem: "laudav",
			ppp: "laudatus",
			meaning: "loben",
		},
		e: {
			label: "e-Konjugation (monere)",
			presStem: "mone",
			perfStem: "monu",
			ppp: "monitus",
			meaning: "mahnen",
		},
		i: {
			label: "i-Konjugation (audire)",
			presStem: "audi",
			perfStem: "audiv",
			ppp: "auditus",
			meaning: "hören",
		},
		kons: {
			label: "konsonantische Konjugation (regere)",
			presStem: "reg",
			perfStem: "rex",
			ppp: "rectus",
			meaning: "lenken",
		},
	};
	const v = verbs[conj];
	if (tense === "praesens" && voice === "aktiv") {
		const marker = conj === "a" ? "-e-" : "-a-";
		return {
			stem: v.presStem,
			marker,
			ending: "-t (3. Sg.)",
			fullForm: `${v.presStem}${conj === "a" ? "e" : "a"}t`,
			translation: `er/sie möge ${v.meaning}`,
			hint: `${v.label}: a-Konjugation wechselt auf -e-, alle übrigen auf -a-.`,
		};
	}
	if (tense === "praesens" && voice === "passiv") {
		const marker = conj === "a" ? "-e-" : "-a-";
		return {
			stem: v.presStem,
			marker,
			ending: "-tur (3. Sg.)",
			fullForm: `${v.presStem}${conj === "a" ? "e" : "a"}tur`,
			translation: `er/sie werde gelobt / gemahnt / gehört / gelenkt`,
			hint: `${v.label}: gleiches Moduszeichen (${marker}) + Passivendung -tur.`,
		};
	}
	if (tense === "perfekt" && voice === "aktiv") {
		return {
			stem: v.perfStem,
			marker: "-eri-",
			ending: "-t (3. Sg.)",
			fullForm: `${v.perfStem}erit`,
			translation: `er/sie habe ${v.meaning === "loben" ? "gelobt" : v.meaning === "mahnen" ? "gemahnt" : v.meaning === "hören" ? "gehört" : "gelenkt"}`,
			hint: "Konjunktiv Perfekt Aktiv: Perfektstamm + -eri- + Personalendung.",
		};
	}
	return {
		stem: v.ppp,
		marker: "sit",
		ending: "(esse Konj. Präs.)",
		fullForm: `${v.ppp} sit`,
		translation: `er/sie sei ${v.meaning === "loben" ? "gelobt" : v.meaning === "mahnen" ? "gemahnt" : v.meaning === "hören" ? "gehört" : "gelenkt"} worden`,
		hint: "Konjunktiv Perfekt Passiv: PPP (KNG-kongruent) + sim, sis, sit, simus, sitis, sint.",
	};
}

export const HAUPTSATZ_MOODS: Record<
	HauptsatzMood,
	{
		title: string;
		person: string;
		negation: string;
		latin: string;
		german: string;
	}
> = {
	hortativ: {
		title: "Hortativ (Selbstaufforderung)",
		person: "1. Pers. Pl. Konj. Präsens",
		negation: "ne",
		latin: "Veritatem quaeramus! / Ne timeamus!",
		german: "Lasst uns die Wahrheit suchen! / Lasst uns nicht fürchten!",
	},
	jussiv: {
		title: "Jussiv (Befehl an 3. Person)",
		person: "3. Pers. Sg./Pl. Konj. Präsens",
		negation: "ne",
		latin: "Civis legibus pareat!",
		german: "Der Bürger soll den Gesetzen gehorchen!",
	},
	prohibitiv: {
		title: "Prohibitiv (Verbot an 2. Person)",
		person: "ne + Konj. Perfekt (2. Pers.)",
		negation: "ne",
		latin: "Ne timueris! / Ne dubitaveritis!",
		german: "Fürchte dich nicht! / Zweifelt nicht!",
	},
	optativ: {
		title: "Optativ (Wunsch)",
		person: "(utinam) + Konj. Präs. (erfüllbar) / Impf., Plusq. (unerfüllbar)",
		negation: "ne",
		latin: "Utinam pax maneat!",
		german: "Hoffentlich bleibt der Frieden bestehen!",
	},
};

export type ImperiumLayer = "provinzen" | "heiligtuemer" | "weltwunder";

export interface ImperiumPlace {
	id: string;
	name: string;
	layers: ImperiumLayer[];
	x: number;
	y: number;
	labelAnchor?: "start" | "end" | "middle";
	labelDx?: number;
	labelDy?: number;
	info: string;
}

export const IMPERIUM_PLACES: ImperiumPlace[] = [
	{
		id: "roma",
		name: "Roma",
		layers: ["provinzen"],
		x: 246,
		y: 140,
		labelAnchor: "start",
		labelDx: 10,
		labelDy: 4,
		info: "Hauptstadt des Imperium Romanum, Ausgangspunkt der Verwaltung und Triumphzüge.",
	},
	{
		id: "cambodunum",
		name: "Cambodunum",
		layers: ["provinzen"],
		x: 218,
		y: 60,
		labelAnchor: "start",
		labelDx: 10,
		labelDy: 4,
		info: "Römische Stadt in der Provinz Raetia (heute Kempten im Allgäu), ein wichtiges heimisches Zeugnis römischer Provinzialkultur.",
	},
	{
		id: "sicilia",
		name: "Sicilia",
		layers: ["provinzen"],
		x: 258,
		y: 206,
		labelAnchor: "end",
		labelDx: -10,
		labelDy: 4,
		info: "Erste römische Provinz (241 v. Chr.), strategische Brücke zwischen Italien und Nordafrika.",
	},
	{
		id: "cumae",
		name: "Cumae",
		layers: ["heiligtuemer"],
		x: 266,
		y: 166,
		labelAnchor: "start",
		labelDx: 10,
		labelDy: 4,
		info: "Älteste griechische Kolonie auf dem italienischen Festland, berühmt für die Weissagungen der Sibylle von Cumae.",
	},
	{
		id: "olympia",
		name: "Olympia",
		layers: ["heiligtuemer", "weltwunder"],
		x: 340,
		y: 194,
		labelAnchor: "end",
		labelDx: -10,
		labelDy: 5,
		info: "Zeus-Heiligtum auf der Peloponnes und Austragungsort der antiken Olympischen Spiele (Gottesfrieden ekecheiria); im Tempel stand die Zeusstatue des Phidias (eines der sieben Weltwunder).",
	},
	{
		id: "delphi",
		name: "Delphi",
		layers: ["heiligtuemer"],
		x: 352,
		y: 166,
		labelAnchor: "start",
		labelDx: 10,
		labelDy: 3,
		info: "Apollon-Heiligtum am Parnass: Die Priesterin Pythia verkündete dort vieldeutige Orakelsprüche.",
	},
	{
		id: "ephesos",
		name: "Ephesos",
		layers: ["weltwunder"],
		x: 422,
		y: 168,
		labelAnchor: "start",
		labelDx: 10,
		labelDy: -2,
		info: "An der Westküste Kleinasiens stand der gewaltige Artemistempel von Ephesos, eines der sieben Weltwunder der Antike.",
	},
	{
		id: "halikarnassos",
		name: "Halikarnassos",
		layers: ["weltwunder"],
		x: 430,
		y: 192,
		labelAnchor: "start",
		labelDx: 10,
		labelDy: 4,
		info: "An der Südwestküste Kleinasiens errichtete man für König Maussolos das monumentale Mausoleum von Halikarnassos.",
	},
	{
		id: "rhodos",
		name: "Rhodos",
		layers: ["weltwunder"],
		x: 420,
		y: 216,
		labelAnchor: "end",
		labelDx: -10,
		labelDy: 5,
		info: "Auf der Ägäisinsel Rhodos erhob sich die bronzene Sonnengottstatue (Koloss von Rhodos) nahe dem Hafen.",
	},
	{
		id: "alexandria",
		name: "Alexandria",
		layers: ["weltwunder"],
		x: 468,
		y: 252,
		labelAnchor: "end",
		labelDx: -10,
		labelDy: 3,
		info: "Hellenistische Hafenmetropole Ägyptens am westlichen Nildelta: Auf der vorgelagerten Insel Pharos wies der berühmte Leuchtturm den Schiffen den Weg.",
	},
	{
		id: "gizeh",
		name: "Gizeh",
		layers: ["weltwunder"],
		x: 486,
		y: 286,
		labelAnchor: "start",
		labelDx: 10,
		labelDy: 4,
		info: "Auf dem Plateau von Gizeh am Nil (nahe dem heutigen Kairo) stehen die Pyramiden — das älteste und einzig erhaltene der sieben Weltwunder.",
	},
	{
		id: "babylon",
		name: "Babylon",
		layers: ["weltwunder"],
		x: 576,
		y: 214,
		labelAnchor: "middle",
		labelDx: 0,
		labelDy: -12,
		info: "In Mesopotamien gelegen: bekannt für die in antiken Quellen überlieferten Hängenden Gärten und zugleich Sterbeort Alexanders des Großen (323 v. Chr.).",
	},
];

export const CURSUS_STAGES = [
	{
		id: "quaestor",
		title: "1 · Quaestor",
		badge: "Finanzen & Verwaltung",
		detail: "Einstiegsamt des cursus honorum (Mindestalter meist 30 Jahre): Verwaltung der Staatskasse (aerarium) und Begleitung von Statthaltern; eröffnete den Zugang zum Senat.",
	},
	{
		id: "aedilis",
		title: "2 · Aedilis",
		badge: "Spiele, Märkte & Bauten",
		detail: "Zuständig für öffentliche Ordnung, Tempel, Getreideversorgung und große Spiele (ludi) in Rom — wichtig für Ansehen beim Volk.",
	},
	{
		id: "praetor",
		title: "3 · Praetor",
		badge: "Rechtsprechung & Imperium",
		detail: "Leitete Gerichte und besaß bereits das militärisch-politische imperium; konnte später als Propraetor eine Provinz verwalten.",
	},
	{
		id: "consul",
		title: "4 · Consul (2 pro Jahr)",
		badge: "Spitze der Republik",
		detail: "Zwei gleichberechtigte Konsuln (Kollegialität, Annuität, Veto) führten Senat und Heer; ein siegreicher Feldherr konnte einen Triumphzug beantragen.",
	},
];

export const EPOCHEN_STAGES = [
	{
		id: "republik",
		title: "Späte Republik",
		badge: "133–49 v. Chr.",
		detail: "Soziale Spannungen, Aufstieg mächtiger Feldherren und Senatskonflikte; Cicero prägte als Konsul (63 v. Chr.) und Redner Politik und Literatur.",
	},
	{
		id: "buergerkrieg",
		title: "Bürgerkriege & Caesar",
		badge: "49–44 v. Chr.",
		detail: "Überschreiten des Rubikon (Alea iacta est), Sieg Caesars über Pompeius, Verbindung zu Kleopatra in Ägypten, Ermordung Caesars an den Iden des März 44 v. Chr.",
	},
	{
		id: "octavian",
		title: "Machtkampf & Actium",
		badge: "44–27 v. Chr.",
		detail: "Bündnis und Konflikt zwischen Octavian, Antonius und Kleopatra; Entscheidung bei Actium 31 v. Chr., danach Übergang zum Prinzipat.",
	},
	{
		id: "augustus",
		title: "Augusteische Zeit",
		badge: "27 v. Chr. – 14 n. Chr.",
		detail: "Octavian trägt den Ehrennamen Augustus: pax Augusta, aurea aetas (Horaz, Vergil), Restaurationspolitik altrömischer Werte und Konflikte mit Germanen (Varus 9 n. Chr.).",
	},
];

export function renderStageIcon(icon: string): string {
	switch (icon) {
		case "scroll":
			return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h11a3 3 0 0 1 0 6H7a3 3 0 0 0 0 6h11"/><path d="M7 10v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8"/><path d="M10 13h6"/></svg>`;
		case "pillar":
			return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5h14M6 8h12M7 19h10M5 21h14M8 8v11M12 8v11M16 8v11"/></svg>`;
		case "verb":
			return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15c2.5-6 6-9 8-9s5.5 3 8 9"/><path d="M8 15h8"/><circle cx="12" cy="6" r="1.5" fill="currentColor"/><path d="M4 19h16"/></svg>`;
		case "scale":
			return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16M5 7h14M8 20h8"/><path d="M5 7l-2.5 6h5L5 7zM19 7l-2.5 6h5L19 7z"/></svg>`;
		case "bracket":
			return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5H5v14h2M17 5h2v14h-2"/><rect x="8.5" y="9" width="7" height="6" rx="1.5"/></svg>`;
		case "map":
			return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z"/><path d="M9 4v14M15 6v14"/></svg>`;
		case "temple":
			return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10L12 4l9 6H3zM5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 18h18M2 21h20"/></svg>`;
		default:
			return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="15.5,8.5 13.2,13.2 8.5,15.5 10.8,10.8" fill="currentColor" stroke="none"/></svg>`;
	}
}

function defaultParts(lesson: Lesson): [DiagramNode, DiagramNode, DiagramNode] {
	return (
		lesson.diagram.parts ?? [
			{
				id: "part-1",
				label: "1 · Form",
				badge: "Erkennen",
				detail: lesson.takeaway,
			},
			{
				id: "part-2",
				label: "2 · Funktion",
				badge: "Einordnen",
				detail: lesson.skill,
			},
			{
				id: "part-3",
				label: "3 · Übersetzung",
				badge: "Anwenden",
				detail: "Prüfe stets Sinnrichtung und Satzbezug im Material.",
			},
		]
	);
}

function wrapSvgText(text: string, maxChars: number): string[] {
	const words = text.split(/\s+/);
	const lines: string[] = [];
	let current = "";
	for (const word of words) {
		if (current && `${current} ${word}`.length > maxChars) {
			lines.push(current);
			current = word;
		} else {
			current = current ? `${current} ${word}` : word;
		}
	}
	if (current) lines.push(current);
	return lines.slice(0, 2);
}

function renderThreeNodeSvg(
	lesson: Lesson,
	layout: "morph" | "myth" | "syntax",
): string {
	const parts = defaultParts(lesson);
	const xs = [18, 224, 430];
	const shapes = parts.map((part, i) => {
		const x = xs[i];
		const cx = x + 96;
		const connector =
			i < 2
				? layout === "myth"
					? `<line x1="${x + 194}" y1="116" x2="${xs[i + 1] - 2}" y2="116" stroke="var(--stage-color)" stroke-width="2.5" stroke-dasharray="5 4"/>`
					: `<path d="M${x + 194} 116 H${xs[i + 1] - 8} l-6 -5 m6 5 l-6 5" fill="none" stroke="var(--stage-color)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`
				: "";
		const badgeFont = part.badge.length > 24 ? 10.5 : 11.5;
		const labelLines = wrapSvgText(part.label, 21);
		const labelHtml = labelLines
			.map(
				(line, li) =>
					`<tspan x="${cx}" dy="${li === 0 ? 0 : 17}">${esc(line)}</tspan>`,
			)
			.join("");
		const latinLines = part.latin ? wrapSvgText(part.latin, 24) : [];
		const latinStartY = labelLines.length > 1 ? 148 : 140;
		const latinHtml = latinLines
			.map(
				(line, li) =>
					`<tspan x="${cx}" dy="${li === 0 ? 0 : 15}">${esc(line)}</tspan>`,
			)
			.join("");
		return `${connector}<g class="svg-node" data-part-index="${i}" tabindex="0" role="button" aria-pressed="${i === 0}">
			<rect x="${x}" y="38" width="192" height="156" rx="14" fill="var(--surface)" stroke="${i === 0 ? "var(--stage-color)" : "var(--line)"}" stroke-width="${i === 0 ? 3 : 1.5}"/>
			<rect x="${x + 10}" y="50" width="172" height="24" rx="12" fill="var(--accent-soft)"/>
			<text x="${cx}" y="66" text-anchor="middle" font-size="${badgeFont}" font-weight="700" class="svg-accent">${esc(part.badge)}</text>
			<text x="${cx}" y="102" text-anchor="middle" font-size="14" font-weight="700">${labelHtml}</text>
			${latinLines.length ? `<text x="${cx}" y="${latinStartY}" text-anchor="middle" font-size="12" font-style="italic" class="svg-muted">${latinHtml}</text>` : ""}
		</g>`;
	});
	return `<svg class="diagram-svg" viewBox="0 0 640 218" role="img" aria-label="${esc(lesson.diagram.title)}">
		<text x="20" y="24" font-size="13" font-weight="700" class="svg-muted">Klicke auf einen der drei Bausteine:</text>
		${shapes.join("")}
	</svg>
	<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong>${esc(parts[0].label)}</strong> · <span class="small">${esc(parts[0].badge)}</span><p>${esc(parts[0].detail)}</p></div>`;
}

function renderImperiumMap(lesson: Lesson): string {
	const first = IMPERIUM_PLACES[0];
	return `<div class="diagram-controls" role="group" aria-label="Kartenebenen">
		<button type="button" class="button secondary" data-map-layer="all" aria-pressed="true">Alle Orte</button>
		<button type="button" class="button secondary" data-map-layer="provinzen" aria-pressed="false">Provinzen &amp; Rom</button>
		<button type="button" class="button secondary" data-map-layer="heiligtuemer" aria-pressed="false">Religiöse Zentren</button>
		<button type="button" class="button secondary" data-map-layer="weltwunder" aria-pressed="false">Weltwunder</button>
	</div>
	<svg class="diagram-svg" viewBox="0 0 640 320" role="img" aria-label="${esc(lesson.diagram.title)}">
		<rect x="0" y="0" width="640" height="320" class="sea"/>
		<path class="land" d="M35 18 H615 V255 L522 252 L516 205 L495 190 L446 192 L426 198 L412 182 L416 158 L392 154 L374 176 L360 204 L334 198 L316 164 L286 184 L264 192 L244 158 L220 130 L178 124 L138 148 L92 144 L50 172 L35 152 Z"/>
		<path class="land" d="M244 196 L272 196 L268 216 L242 212 Z"/>
		<path class="land" d="M412 214 L426 208 L430 218 L416 224 Z"/>
		<path class="land" d="M35 232 L215 236 L275 248 L380 252 L470 250 L522 252 L615 255 V310 H35 Z"/>
		<ellipse cx="320" cy="145" rx="225" ry="95" class="province-zone"/>
		<text x="122" y="208" text-anchor="middle" font-size="12" font-style="italic" class="svg-muted">Mare Nostrum (Mittelmeer)</text>
		<text x="112" y="94" font-size="12" class="svg-muted">Gallia</text>
		<text x="76" y="136" font-size="12" class="svg-muted">Hispania</text>
		<text x="214" y="86" font-size="12" class="svg-muted">Raetia</text>
		<text x="456" y="132" font-size="12" class="svg-muted">Asia Minor</text>
		<text x="402" y="288" font-size="12" class="svg-muted">Aegyptus</text>
		${IMPERIUM_PLACES.map((p, i) => {
			const anchor = p.labelAnchor ?? "start";
			const labelX = p.x + (p.labelDx ?? 10);
			const labelY = p.y + (p.labelDy ?? 4);
			return `<g class="svg-node" data-place-id="${p.id}" data-place-layers="${p.layers.join(",")}" tabindex="0" role="button" aria-pressed="${i === 0}">
				<circle cx="${p.x}" cy="${p.y}" r="12" fill="transparent"/>
				<circle cx="${p.x}" cy="${p.y}" r="6.5" class="svg-accent" stroke="var(--surface)" stroke-width="2"/>
				<text x="${labelX}" y="${labelY}" text-anchor="${anchor}" font-size="11.5" font-weight="700">${esc(p.name)}</text>
			</g>`;
		}).join("")}
	</svg>
	<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong>${esc(first.name)}</strong><p>${esc(first.info)}</p></div>`;
}

function renderTimelineOrCursus(lesson: Lesson): string {
	const isCursus = lesson.diagram.preset === "cursus";
	const items = isCursus ? CURSUS_STAGES : EPOCHEN_STAGES;
	const first = items[0];
	if (isCursus) {
		const boxes = items
			.map((item, i) => {
				const w = 360 - i * 52;
				const x = 320 - w / 2;
				const y = 172 - i * 44;
				return `<g class="svg-node" data-step-index="${i}" tabindex="0" role="button" aria-pressed="${i === 0}">
					<rect x="${x}" y="${y}" width="${w}" height="36" rx="8" fill="var(--surface)" stroke="${i === 0 ? "var(--stage-color)" : "var(--line)"}" stroke-width="${i === 0 ? 3 : 1.5}"/>
					<text x="320" y="${y + 23}" text-anchor="middle" font-size="13" font-weight="700">${esc(item.title)}</text>
				</g>`;
			})
			.join("");
		return `<svg class="diagram-svg" viewBox="0 0 640 230" role="img" aria-label="${esc(lesson.diagram.title)}">
			<text x="20" y="24" font-size="12" font-weight="700" class="svg-muted">Römische Ämterlaufbahn (cursus honorum) · Stufe wählen:</text>
			${boxes}
			<text x="320" y="220" text-anchor="middle" font-size="12" class="svg-muted">Mischverfassung: Konsuln (monarchisch) · Senat (aristokratisch) · Volksversammlung (demokratisch)</text>
		</svg>
		<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong>${esc(first.title)}</strong> · <span class="small">${esc(first.badge)}</span><p>${esc(first.detail)}</p></div>`;
	}
	return `<svg class="diagram-svg" viewBox="0 0 640 200" role="img" aria-label="${esc(lesson.diagram.title)}">
		<line x1="48" y1="92" x2="592" y2="92" stroke="var(--stage-color)" stroke-width="4" stroke-linecap="round"/>
		${items
			.map((item, i) => {
				const x = 86 + i * 156;
				return `<g class="svg-node" data-step-index="${i}" tabindex="0" role="button" aria-pressed="${i === 0}">
					<rect x="${x - 66}" y="22" width="132" height="52" rx="10" fill="var(--surface)" stroke="${i === 0 ? "var(--stage-color)" : "var(--line)"}" stroke-width="${i === 0 ? 3 : 1.5}"/>
					<text x="${x}" y="44" text-anchor="middle" font-size="12" font-weight="700">${esc(item.title)}</text>
					<text x="${x}" y="62" text-anchor="middle" font-size="11" class="svg-muted">${esc(item.badge)}</text>
					<circle cx="${x}" cy="92" r="9" class="svg-accent" stroke="var(--surface)" stroke-width="2.5"/>
				</g>`;
			})
			.join("")}
		<text x="320" y="162" text-anchor="middle" font-size="12" class="svg-muted">Klicke auf einen Epochenabschnitt, um Personen und Ereignisse einzublenden.</text>
	</svg>
	<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong>${esc(first.title)}</strong> · <span class="small">${esc(first.badge)}</span><p>${esc(first.detail)}</p></div>`;
}

function renderAblAbsLab(lesson: Lesson): string {
	const init = ablAbsModel("ppp", "adverbial");
	return `<div class="diagram-controls" role="group" aria-label="Ablativus-absolutus-Typ">
		<button type="button" class="button secondary" data-abl-mode="ppp" aria-pressed="true">PPP (vorzeitig)</button>
		<button type="button" class="button secondary" data-abl-mode="ppa" aria-pressed="false">PPA (gleichzeitig)</button>
		<button type="button" class="button secondary" data-abl-mode="nominal" aria-pressed="false">Nominal (ohne Partizip)</button>
	</div>
	<div class="diagram-controls" role="group" aria-label="Übersetzungsvariante">
		<button type="button" class="button secondary" data-abl-style="adverbial" aria-pressed="true">Adverbialsatz</button>
		<button type="button" class="button secondary" data-abl-style="prepositional" aria-pressed="false">Präpositionalausdruck</button>
		<button type="button" class="button secondary" data-abl-style="coordinate" aria-pressed="false">Beiordnung</button>
	</div>
	<svg class="diagram-svg" id="abl-svg" viewBox="0 0 640 190" role="img" aria-label="${esc(lesson.diagram.title)}">
		<path d="M36 42 H26 V126 H36" fill="none" stroke="var(--stage-color)" stroke-width="4" stroke-linecap="round"/>
		<path d="M374 42 H384 V126 H374" fill="none" stroke="var(--stage-color)" stroke-width="4" stroke-linecap="round"/>
		<rect x="44" y="46" width="156" height="58" rx="10" fill="var(--surface)" stroke="var(--stage-color)" stroke-width="2"/>
		<text x="122" y="70" text-anchor="middle" font-size="11" class="svg-muted">Bezugswort (Ablativ)</text>
		<text id="abl-noun" x="122" y="92" text-anchor="middle" font-size="14" font-weight="700">${esc(init.noun)}</text>
		<rect x="212" y="46" width="154" height="58" rx="10" fill="var(--surface)" stroke="var(--stage-color)" stroke-width="2"/>
		<text x="289" y="70" text-anchor="middle" font-size="11" class="svg-muted">Partizip / Prädikativ (Abl.)</text>
		<text id="abl-part" x="289" y="92" text-anchor="middle" font-size="14" font-weight="700">${esc(init.participle)}</text>
		<path d="M394 75 H436 l-7 -5 m7 5 l-7 5" fill="none" stroke="var(--stage-color)" stroke-width="2.5" stroke-linecap="round"/>
		<rect x="444" y="46" width="174" height="58" rx="10" fill="var(--accent-soft)" stroke="var(--line)" stroke-width="1.5"/>
		<text x="531" y="70" text-anchor="middle" font-size="11" class="svg-muted">Hauptsatz</text>
		<text x="531" y="92" text-anchor="middle" font-size="13" font-weight="700">Subjekt + Prädikat</text>
		<text id="abl-rel" x="205" y="152" text-anchor="middle" font-size="13" font-weight="700" class="svg-accent">${esc(init.relation)}</text>
		<text x="531" y="152" text-anchor="middle" font-size="12" class="svg-muted">eigenständige Zeitangabe</text>
	</svg>
	<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong lang="la">${esc(init.latin)}</strong><p>→ ${esc(init.german)}</p><p class="small">${esc(init.hint)}</p></div>`;
}

function renderConsecutioLab(lesson: Lesson): string {
	const init = consecutioModel("haupttempus", "gleichzeitig");
	return `<div class="diagram-controls" role="group" aria-label="Hauptsatztempus">
		<button type="button" class="button secondary" data-ct-main="haupttempus" aria-pressed="true">Haupttempus (Präs. / Fut.)</button>
		<button type="button" class="button secondary" data-ct-main="nebentempus" aria-pressed="false">Nebentempus (Impf. / Perf. / Plusq.)</button>
	</div>
	<div class="diagram-controls" role="group" aria-label="Zeitverhältnis">
		<button type="button" class="button secondary" data-ct-rel="gleichzeitig" aria-pressed="true">Gleichzeitigkeit</button>
		<button type="button" class="button secondary" data-ct-rel="vorzeitig" aria-pressed="false">Vorzeitigkeit</button>
	</div>
	<svg class="diagram-svg" viewBox="0 0 640 185" role="img" aria-label="${esc(lesson.diagram.title)}">
		<line x1="44" y1="108" x2="596" y2="108" stroke="var(--line)" stroke-width="4" stroke-linecap="round"/>
		<rect x="44" y="24" width="230" height="54" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
		<text x="159" y="46" text-anchor="middle" font-size="11" class="svg-muted">Übergeordneter Satz</text>
		<text id="ct-main-text" x="159" y="66" text-anchor="middle" font-size="14" font-weight="700">${esc(init.mainClause)}</text>
		<rect x="330" y="24" width="266" height="54" rx="10" fill="var(--accent-soft)" stroke="var(--stage-color)" stroke-width="2"/>
		<text id="ct-tense-label" x="463" y="46" text-anchor="middle" font-size="11" font-weight="700" class="svg-accent">${esc(init.tenseLabel)}</text>
		<text id="ct-sub-text" x="463" y="66" text-anchor="middle" font-size="14" font-weight="700">${esc(init.subClause)}</text>
		<circle id="ct-dot-main" cx="420" cy="108" r="9" fill="var(--muted)"/>
		<text id="ct-axis-main" x="420" y="136" text-anchor="middle" font-size="11" class="svg-muted">Hauptsatz</text>
		<circle id="ct-dot-sub" cx="420" cy="108" r="6" class="svg-accent"/>
		<text id="ct-axis-sub" x="420" y="156" text-anchor="middle" font-size="11" font-weight="700" class="svg-accent">Nebensatz (gleichzeitig)</text>
	</svg>
	<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong>${esc(init.rule)}</strong><p><span lang="la">${esc(init.mainClause)} ${esc(init.subClause)}</span> → ${esc(init.translation)}</p></div>`;
}

function renderKonjunktivLab(lesson: Lesson): string {
	if (lesson.diagram.preset === "hauptsatz") {
		const init = HAUPTSATZ_MOODS.hortativ;
		return `<div class="diagram-controls" role="group" aria-label="Hauptsatz-Konjunktiv">
			${(Object.keys(HAUPTSATZ_MOODS) as HauptsatzMood[])
				.map(
					(key, i) =>
						`<button type="button" class="button secondary" data-hs-mood="${key}" aria-pressed="${i === 0}">${key[0].toUpperCase()}${key.slice(1)}</button>`,
				)
				.join("")}
		</div>
		<svg class="diagram-svg" viewBox="0 0 640 165" role="img" aria-label="${esc(lesson.diagram.title)}">
			<rect x="24" y="24" width="286" height="58" rx="10" fill="var(--surface)" stroke="var(--stage-color)" stroke-width="2"/>
			<text x="167" y="46" text-anchor="middle" font-size="11" class="svg-muted">Form &amp; Person</text>
			<text id="hs-person" x="167" y="68" text-anchor="middle" font-size="13" font-weight="700">${esc(init.person)}</text>
			<rect x="330" y="24" width="286" height="58" rx="10" fill="var(--accent-soft)" stroke="var(--line)" stroke-width="1.5"/>
			<text x="473" y="46" text-anchor="middle" font-size="11" class="svg-muted">Verneinung im Hauptsatz</text>
			<text id="hs-neg" x="473" y="68" text-anchor="middle" font-size="14" font-weight="700" class="svg-accent">${esc(init.negation)} (nicht non!)</text>
			<text id="hs-latin" x="320" y="122" text-anchor="middle" font-size="15" font-weight="700" font-style="italic">${esc(init.latin)}</text>
			<text id="hs-german" x="320" y="146" text-anchor="middle" font-size="13" class="svg-muted">${esc(init.german)}</text>
		</svg>
		<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong>${esc(init.title)}</strong><p><span lang="la">${esc(init.latin)}</span> → ${esc(init.german)}</p></div>`;
	}
	const initTense: KonjTense = lesson.id === "l7-konjunktiv-perfekt" ? "perfekt" : "praesens";
	const init = konjunktivForm("a", initTense, "aktiv");
	return `<div class="diagram-controls" role="group" aria-label="Konjugation">
		<button type="button" class="button secondary" data-conj="a" aria-pressed="true">a-Konj.</button>
		<button type="button" class="button secondary" data-conj="e" aria-pressed="false">e-Konj.</button>
		<button type="button" class="button secondary" data-conj="i" aria-pressed="false">i-Konj.</button>
		<button type="button" class="button secondary" data-conj="kons" aria-pressed="false">kons. Konj.</button>
	</div>
	<div class="diagram-controls" role="group" aria-label="Tempus und Genus Verbi">
		<button type="button" class="button secondary" data-ktense="praesens" aria-pressed="${initTense === "praesens"}">Konj. Präsens</button>
		<button type="button" class="button secondary" data-ktense="perfekt" aria-pressed="${initTense === "perfekt"}">Konj. Perfekt</button>
		<button type="button" class="button secondary" data-kvoice="aktiv" aria-pressed="true">Aktiv</button>
		<button type="button" class="button secondary" data-kvoice="passiv" aria-pressed="false">Passiv</button>
	</div>
	<svg class="diagram-svg" viewBox="0 0 640 175" role="img" aria-label="${esc(lesson.diagram.title)}">
		<rect x="28" y="28" width="166" height="62" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
		<text x="111" y="50" text-anchor="middle" font-size="11" class="svg-muted">Stamm / Partizip</text>
		<text id="kf-stem" x="111" y="74" text-anchor="middle" font-size="16" font-weight="700">${esc(init.stem)}</text>
		<text x="208" y="66" text-anchor="middle" font-size="18" font-weight="700">+</text>
		<rect x="224" y="28" width="166" height="62" rx="10" fill="var(--accent-soft)" stroke="var(--stage-color)" stroke-width="2"/>
		<text x="307" y="50" text-anchor="middle" font-size="11" class="svg-muted">Modus-/Tempuszeichen</text>
		<text id="kf-marker" x="307" y="74" text-anchor="middle" font-size="16" font-weight="700" class="svg-accent">${esc(init.marker)}</text>
		<text x="404" y="66" text-anchor="middle" font-size="18" font-weight="700">+</text>
		<rect x="420" y="28" width="192" height="62" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="1.5"/>
		<text x="516" y="50" text-anchor="middle" font-size="11" class="svg-muted">Personalendung</text>
		<text id="kf-ending" x="516" y="74" text-anchor="middle" font-size="15" font-weight="700">${esc(init.ending)}</text>
		<text id="kf-full" x="320" y="138" text-anchor="middle" font-size="20" font-weight="700" class="svg-accent" lang="la">${esc(init.fullForm)}</text>
	</svg>
	<div class="diagram-detail" id="diagram-detail" aria-live="polite"><strong lang="la">${esc(init.fullForm)}</strong> · <span>${esc(init.translation)}</span><p>${esc(init.hint)}</p></div>`;
}

export function renderDiagram(lesson: Lesson): string {
	let body = "";
	switch (lesson.diagram.kind) {
		case "imperium-map":
			body = renderImperiumMap(lesson);
			break;
		case "timeline-cursus":
			body = renderTimelineOrCursus(lesson);
			break;
		case "abl-abs-lab":
			body = renderAblAbsLab(lesson);
			break;
		case "ct-timeline":
			body = renderConsecutioLab(lesson);
			break;
		case "konjunktiv-builder":
			body = renderKonjunktivLab(lesson);
			break;
		case "myth-values":
			body = renderThreeNodeSvg(lesson, "myth");
			break;
		case "syntax-tree":
			body = renderThreeNodeSvg(lesson, "syntax");
			break;
		default:
			body = renderThreeNodeSvg(lesson, "morph");
			break;
	}
	return `<figure class="diagram-card">
		<div class="diagram-header"><h3>${esc(lesson.diagram.title)}</h3><span class="small">Interaktives Schaubild</span></div>
		${body}
		<figcaption class="diagram-caption">${esc(lesson.diagram.caption)}</figcaption>
	</figure>`;
}

export function bindDiagram(lesson: Lesson, container: HTMLElement): void {
	const detail = container.querySelector<HTMLElement>("#diagram-detail");
	if (!detail) return;

	// 1. Three-part interactive explorer
	const partNodes = container.querySelectorAll<SVGGElement>("[data-part-index]");
	if (partNodes.length) {
		const parts = defaultParts(lesson);
		const selectPart = (idx: number) => {
			partNodes.forEach((node, i) => {
				node.setAttribute("aria-pressed", String(i === idx));
				const rect = node.querySelector("rect");
				if (rect) {
					rect.setAttribute("stroke", i === idx ? "var(--stage-color)" : "var(--line)");
					rect.setAttribute("stroke-width", i === idx ? "3" : "1.5");
				}
			});
			const p = parts[idx];
			detail.innerHTML = `<strong>${esc(p.label)}</strong> · <span class="small">${esc(p.badge)}</span><p>${esc(p.detail)}</p>`;
		};
		partNodes.forEach((node) => {
			const idx = Number(node.dataset.partIndex);
			node.addEventListener("click", () => selectPart(idx));
			node.addEventListener("keydown", (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					selectPart(idx);
				}
			});
		});
	}

	// 2. Imperium map
	const mapLayerButtons = container.querySelectorAll<HTMLButtonElement>("[data-map-layer]");
	const placeNodes = container.querySelectorAll<SVGGElement>("[data-place-id]");
	if (mapLayerButtons.length && placeNodes.length) {
		mapLayerButtons.forEach((btn) =>
			btn.addEventListener("click", () => {
				const layer = btn.dataset.mapLayer;
				mapLayerButtons.forEach((b) =>
					b.setAttribute("aria-pressed", String(b === btn)),
				);
				placeNodes.forEach((node) => {
					const layers = (node.dataset.placeLayers ?? "").split(",");
					const show = layer === "all" || (layer ? layers.includes(layer) : false);
					node.style.opacity = show ? "1" : "0.22";
				});
			}),
		);
		const selectPlace = (id: string) => {
			const place = IMPERIUM_PLACES.find((p) => p.id === id);
			if (!place) return;
			placeNodes.forEach((node) =>
				node.setAttribute("aria-pressed", String(node.dataset.placeId === id)),
			);
			detail.innerHTML = `<strong>${esc(place.name)}</strong><p>${esc(place.info)}</p>`;
		};
		placeNodes.forEach((node) => {
			const id = node.dataset.placeId ?? "";
			node.addEventListener("click", () => selectPlace(id));
			node.addEventListener("keydown", (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					selectPlace(id);
				}
			});
		});
	}

	// 3. Cursus honorum & Epochenstrahl
	const stepNodes = container.querySelectorAll<SVGGElement>("[data-step-index]");
	if (stepNodes.length) {
		const items = lesson.diagram.preset === "cursus" ? CURSUS_STAGES : EPOCHEN_STAGES;
		const selectStep = (idx: number) => {
			const item = items[idx];
			if (!item) return;
			stepNodes.forEach((node, i) => {
				node.setAttribute("aria-pressed", String(i === idx));
				const rect = node.querySelector("rect");
				if (rect) {
					rect.setAttribute("stroke", i === idx ? "var(--stage-color)" : "var(--line)");
					rect.setAttribute("stroke-width", i === idx ? "3" : "1.5");
				}
			});
			detail.innerHTML = `<strong>${esc(item.title)}</strong> · <span class="small">${esc(item.badge)}</span><p>${esc(item.detail)}</p>`;
		};
		stepNodes.forEach((node) => {
			const idx = Number(node.dataset.stepIndex);
			node.addEventListener("click", () => selectStep(idx));
			node.addEventListener("keydown", (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					selectStep(idx);
				}
			});
		});
	}

	// 4. Ablativus absolutus lab
	const ablModeBtns = container.querySelectorAll<HTMLButtonElement>("[data-abl-mode]");
	const ablStyleBtns = container.querySelectorAll<HTMLButtonElement>("[data-abl-style]");
	if (ablModeBtns.length && ablStyleBtns.length) {
		let mode: AblAbsMode = "ppp";
		let style: AblAbsStyle = "adverbial";
		const updateAbl = () => {
			const res = ablAbsModel(mode, style);
			container.querySelector("#abl-noun")!.textContent = res.noun;
			container.querySelector("#abl-part")!.textContent = res.participle;
			container.querySelector("#abl-rel")!.textContent = res.relation;
			detail.innerHTML = `<strong lang="la">${esc(res.latin)}</strong><p>→ ${esc(res.german)}</p><p class="small">${esc(res.hint)}</p>`;
		};
		ablModeBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				mode = btn.dataset.ablMode as AblAbsMode;
				ablModeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				updateAbl();
			}),
		);
		ablStyleBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				style = btn.dataset.ablStyle as AblAbsStyle;
				ablStyleBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				updateAbl();
			}),
		);
	}

	// 5. Consecutio temporum timeline
	const ctMainBtns = container.querySelectorAll<HTMLButtonElement>("[data-ct-main]");
	const ctRelBtns = container.querySelectorAll<HTMLButtonElement>("[data-ct-rel]");
	if (ctMainBtns.length && ctRelBtns.length) {
		let mainTense: MainTense = "haupttempus";
		let rel: TimeRelation = "gleichzeitig";
		const updateCt = () => {
			const res = consecutioModel(mainTense, rel);
			container.querySelector("#ct-main-text")!.textContent = res.mainClause;
			container.querySelector("#ct-sub-text")!.textContent = res.subClause;
			container.querySelector("#ct-tense-label")!.textContent = res.tenseLabel;
			const mainX = mainTense === "haupttempus" ? 420 : 240;
			const subX = rel === "gleichzeitig" ? mainX : mainX - 110;
			container.querySelector("#ct-dot-main")!.setAttribute("cx", String(mainX));
			container.querySelector("#ct-axis-main")!.setAttribute("x", String(mainX));
			container.querySelector("#ct-dot-sub")!.setAttribute("cx", String(subX));
			const axisSub = container.querySelector("#ct-axis-sub")!;
			axisSub.setAttribute("x", String(subX));
			axisSub.textContent = `Nebensatz (${rel})`;
			detail.innerHTML = `<strong>${esc(res.rule)}</strong><p><span lang="la">${esc(res.mainClause)} ${esc(res.subClause)}</span> → ${esc(res.translation)}</p>`;
		};
		ctMainBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				mainTense = btn.dataset.ctMain as MainTense;
				ctMainBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				updateCt();
			}),
		);
		ctRelBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				rel = btn.dataset.ctRel as TimeRelation;
				ctRelBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				updateCt();
			}),
		);
	}

	// 6. Konjunktiv builder & Hauptsatz moods
	const hsBtns = container.querySelectorAll<HTMLButtonElement>("[data-hs-mood]");
	if (hsBtns.length) {
		hsBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				const mood = btn.dataset.hsMood as HauptsatzMood;
				const data = HAUPTSATZ_MOODS[mood];
				hsBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				container.querySelector("#hs-person")!.textContent = data.person;
				container.querySelector("#hs-neg")!.textContent = `${data.negation} (nicht non!)`;
				container.querySelector("#hs-latin")!.textContent = data.latin;
				container.querySelector("#hs-german")!.textContent = data.german;
				detail.innerHTML = `<strong>${esc(data.title)}</strong><p><span lang="la">${esc(data.latin)}</span> → ${esc(data.german)}</p>`;
			}),
		);
	}
	const conjBtns = container.querySelectorAll<HTMLButtonElement>("[data-conj]");
	const tenseBtns = container.querySelectorAll<HTMLButtonElement>("[data-ktense]");
	const voiceBtns = container.querySelectorAll<HTMLButtonElement>("[data-kvoice]");
	if (conjBtns.length && tenseBtns.length && voiceBtns.length) {
		let conj: Conjugation = "a";
		let tense: KonjTense = lesson.id === "l7-konjunktiv-perfekt" ? "perfekt" : "praesens";
		let voice: KonjVoice = "aktiv";
		const updateKonj = () => {
			const res = konjunktivForm(conj, tense, voice);
			container.querySelector("#kf-stem")!.textContent = res.stem;
			container.querySelector("#kf-marker")!.textContent = res.marker;
			container.querySelector("#kf-ending")!.textContent = res.ending;
			container.querySelector("#kf-full")!.textContent = res.fullForm;
			detail.innerHTML = `<strong lang="la">${esc(res.fullForm)}</strong> · <span>${esc(res.translation)}</span><p>${esc(res.hint)}</p>`;
		};
		conjBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				conj = btn.dataset.conj as Conjugation;
				conjBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				updateKonj();
			}),
		);
		tenseBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				tense = btn.dataset.ktense as KonjTense;
				tenseBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				updateKonj();
			}),
		);
		voiceBtns.forEach((btn) =>
			btn.addEventListener("click", () => {
				voice = btn.dataset.kvoice as KonjVoice;
				voiceBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				updateKonj();
			}),
		);
	}
}
