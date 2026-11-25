import {
	AIR_GASES,
	ALTITUDES,
	ELEMENT_EXAMPLES,
	ELEMENTS,
	ISOTOPES,
	MOLECULES,
	magnesiumEquation,
	neutralAtom,
	shells,
} from "../chemistry/models";
import type {
	ChoiceParam,
	LabDefinition,
	LabGoal,
	RangeParam,
} from "../model/types";

function choice(
	key: string,
	label: string,
	options: readonly string[],
): ChoiceParam {
	return {
		type: "choice",
		key,
		label,
		value: 0,
		options: options.map((name, value) => ({ label: name, value })),
	};
}

function range(
	key: string,
	label: string,
	min: number,
	max: number,
	unit = "",
): RangeParam {
	return { type: "range", key, label, min, max, step: 1, value: min, unit };
}

function goal(id: string, text: string, check: LabGoal["check"]): LabGoal {
	return { id, text, check };
}

export const INSPECTIONS = {
	investigation: [
		[
			"Versuchsfrage",
			"Rostet Eisen ohne Wasser?",
			"Frage → Vermutung → Vergleich",
		],
		[
			"Fairer Vergleich",
			"Gleiche Nägel, gleicher Zugang zu Luft, gleiche Dauer. Nur die Feuchtigkeit ändert sich.",
			"A · trocken | B · feucht",
		],
		[
			"Beobachtung",
			"A bleibt blank. Auf B entsteht eine rotbraune Schicht.",
			"Farbe an A ↔ Farbe an B",
		],
		[
			"Deutung",
			"Die Daten stützen die Vermutung, dass Feuchtigkeit die Rostbildung begünstigt.",
			"Beobachtung → begründete Folgerung",
		],
	],
	evidence: [
		[
			"Fragestellung",
			"Welches Gas nimmt den meisten Raum in trockener Luft ein?",
			"Quelle wählen → Daten lesen",
		],
		[
			"Tabelle",
			"Stickstoff etwa 78 %, Sauerstoff etwa 21 %, übrige Gase etwa 1 %.",
			"Volumenanteil in Prozent",
		],
		[
			"Teilchenbild",
			"Das Bild zeigt, dass Luft verschiedene Teilchensorten enthält. Die Zahl der gezeichneten Teilchen ist hier schematisch.",
			"N₂ neben O₂ und Ar",
		],
		[
			"Aussage prüfen",
			"„Stickstoff hat den größten Anteil“ beschreibt Daten. „Das Diagramm ist gut lesbar“ bewertet eine Darstellung.",
			"Beschreibung ↔ Bewertung",
		],
	],
	safety: [
		[
			"Auftrag",
			"Prüfe vor der Arbeit Kennzeichnung, Gerät und Schutzmaßnahmen.",
			"Erst prüfen · dann handeln",
		],
		[
			"Entzündbar",
			"Das Flammensymbol warnt vor Brandgefahr. Halte den Stoff von Zündquellen fern.",
			"Gefahr → Zündquellen fernhalten",
		],
		[
			"Ätzend",
			"Das Symbol warnt vor schweren Verätzungen. Die Lehrkraft legt Umgang und Schutzausrüstung fest.",
			"Gefahr → Augen und Haut schützen",
		],
		[
			"Gasbrenner",
			"Die Lehrkraft weist dich ein. Sie prüft Gerät und Versuchsaufbau vor dem Einsatz.",
			"Gerät → Einweisung",
		],
	],
	protection: [
		[
			"Rauch im Gebäude",
			"Verlasse das Gebäude über einen sicheren Fluchtweg, warne andere und rufe von einem sicheren Ort 112.",
			"Abstand · Fluchtweg · Hilfe",
		],
		[
			"Brandschutztür",
			"Eine geschlossene Brandschutztür kann Feuer und Rauch eine Zeit lang am Ausbreiten hindern.",
			"Ausbreitung hemmen",
		],
		[
			"Kühlung",
			"Geeignete Löschmittel können dem Brand Wärme entziehen. Wasser kommt nur für geeignete Brände infrage.",
			"Wärme ↓",
		],
		[
			"Abdecken",
			"Bei geeigneten kleinen Brandherden kann professionelles Abdecken die Sauerstoffzufuhr unterbrechen.",
			"Sauerstoffzufuhr ↓",
		],
	],
	history: [
		[
			"Modelle wählen",
			"Wissenschaftliche Modelle machen bestimmte Beobachtungen verständlich.",
			"Idee → Modell → neue Beobachtung",
		],
		[
			"Demokrit",
			"Die Vorstellung kleinster, unteilbarer Teilchen war eine philosophische Idee.",
			"Gedankenmodell",
		],
		[
			"Dalton",
			"Atome als Kugeln erklären einfache feste Zahlenverhältnisse. Die Kugeln haben in diesem Modell keinen inneren Aufbau.",
			"Feste Teilchenverhältnisse",
		],
		[
			"Rutherford",
			"Im Streuversuch flogen die meisten Teilchen geradeaus, einige wurden stark abgelenkt. Das spricht für einen kleinen positiven Kern.",
			"Kleiner Kern · große Hülle",
		],
	],
	respiration: [
		[
			"Ausgangsstoffe",
			"Traubenzucker und Sauerstoff gelangen zu den Körperzellen.",
			"Traubenzucker + Sauerstoff",
		],
		[
			"Stoffumwandlung",
			"Bei der Zellatmung entstehen Kohlenstoffdioxid und Wasser.",
			"Kohlenstoffdioxid + Wasser",
		],
		[
			"Energie",
			"Die Zelle macht einen Teil der Energie aus Traubenzucker für ihre Arbeit verfügbar. Ein Teil wird als Wärme abgegeben.",
			"Verfügbare Energie · Wärme",
		],
	],
} as const;

type Inspection = keyof typeof INSPECTIONS;

export function inspection(
	kind: Inspection,
	title: string,
	intro: string,
	goals: string[],
): LabDefinition {
	const rows = INSPECTIONS[kind];
	return {
		kind,
		title,
		intro,
		params: [
			choice(
				"view",
				"Station",
				rows.map(([name]) => name),
			),
		],
		readouts: [
			{ key: "result", label: "Ergebnis", compute: (v) => rows[v.view][1] },
		],
		goals: goals.map((text, i) =>
			goal("compare-" + (i + 1), text, (v) => v.view === i + 1),
		),
	};
}

export const labs = {
	air: {
		kind: "air",
		title: "Gasanteile sichtbar machen",
		intro:
			"Wähle im Modell der trockenen Luft ein Gas. Jedes Feld steht für etwa 1 % des Volumens. Wasserdampf und Schwankungen bleiben hier außen vor.",
		params: [
			choice("gas", "Hervorheben", [
				"Gesamte Mischung",
				...AIR_GASES.map((gas) => gas.name),
			]),
		],
		readouts: [
			{
				key: "share",
				label: "Volumenanteil",
				unit: "%",
				compute: (v) => (v.gas === 0 ? 100 : AIR_GASES[v.gas - 1].share),
			},
		],
		goals: [
			goal(
				"dominant",
				"Markiere das Gas mit dem größten Anteil.",
				(_, r) => r.share === 78,
			),
			goal(
				"oxygen",
				"Markiere das Atemgas, das etwa ein Fünftel ausmacht.",
				(_, r) => r.share === 21,
			),
			goal(
				"rest",
				"Zeige das Restfeld mit Argon und Spuren anderer Gase.",
				(_, r) => r.share === 1,
			),
		],
	},
	pressure: {
		kind: "pressure",
		title: "Wie viel Luft liegt über dir?",
		intro:
			"Wechsle zwischen drei Höhen. Die Werte stammen aus einem vereinfachten Vergleich unter Standardbedingungen. Die Punktdichte veranschaulicht den Unterschied.",
		params: [
			choice("height", "Standort", [
				"Vergleich starten",
				...ALTITUDES.map((site) => site.name),
			]),
		],
		readouts: [
			{
				key: "pressure",
				label: "Luftdruck",
				unit: "hPa",
				compute: (v) => ALTITUDES[Math.max(0, v.height - 1)].pressure,
			},
		],
		goals: [
			goal(
				"highest",
				"Wähle den Ort mit dem größten Luftdruck.",
				(v) => v.height === 1,
			),
			goal(
				"lower",
				"Finde den Ort mit einem Luftdruck zwischen 800 und 900 hPa.",
				(_, r) => r.pressure === 846,
			),
			goal(
				"lowest",
				"Zeige den niedrigsten Druck im Modell.",
				(_, r) => r.pressure === 701,
			),
		],
	},
	molecule: {
		kind: "molecule",
		title: "Atome in Formeln lesen",
		intro:
			"Wähle einen Stoff. Lies die Formel und vergleiche sie mit dem Teilchenbild. Die Abstände im Bild sind schematisch.",
		params: [
			choice(
				"molecule",
				"Stoff",
				MOLECULES.map((entry) => entry.name),
			),
		],
		readouts: [
			{
				key: "formula",
				label: "Formel",
				compute: (v) => MOLECULES[v.molecule].formula,
			},
			{
				key: "atoms",
				label: "Atome je Teilchen",
				compute: (v) => MOLECULES[v.molecule].atoms.length,
			},
		],
		goals: [
			goal(
				"element",
				"Zeige das Teilchen des Sauerstoffs.",
				(v) => v.molecule === 1,
			),
			goal(
				"water",
				"Finde ein Teilchen mit zwei H-Atomen und einem O-Atom.",
				(v) => v.molecule === 2,
			),
			goal(
				"single",
				"Wähle ein Gas, dessen Teilchen einzelne Atome sind.",
				(v) => v.molecule === 5 || v.molecule === 6,
			),
		],
	},
	fire: {
		kind: "fire",
		title: "Das Feuerdreieck",
		intro:
			"Schalte die drei Bedingungen im Modell einzeln um. Finde heraus, ob alle zusammen erfüllt sein müssen.",
		params: [
			choice("fuel", "Brennstoff", ["fehlt", "da"]),
			choice("air", "Sauerstoff", ["fehlt", "da"]),
			choice("heat", "Entzündungstemperatur", ["unerreicht", "erreicht"]),
		],
		readouts: [
			{
				key: "state",
				label: "Ergebnis",
				compute: (v) =>
					v.fuel && v.air && v.heat
						? "Verbrennung möglich"
						: "Keine Verbrennung",
			},
		],
		goals: [
			goal(
				"all",
				"Erfülle alle Bedingungen für eine Verbrennung.",
				(v) => v.fuel + v.air + v.heat === 3,
			),
			goal(
				"air",
				"Lass nur Sauerstoff fehlen.",
				(v) => !!(v.fuel && !v.air && v.heat),
			),
			goal(
				"heat",
				"Lass nur die nötige Wärme fehlen.",
				(v) => !!(v.fuel && v.air && !v.heat),
			),
		],
	},
	oxidation: {
		kind: "oxidation",
		title: "Sauerstoff im Produkt verfolgen",
		intro:
			"Vergleiche Ausgangsstoffe und Produkte. Die Zeichnung stellt Magnesiumoxid als Paar von Symbolen für ein Zahlenverhältnis dar.",
		params: [
			choice("reaction", "Reaktion", [
				"Magnesium + Sauerstoff",
				"Kohlenstoff + Sauerstoff",
				"Schwefel + Sauerstoff",
			]),
			choice("step", "Ansicht", ["Ausgangsstoffe", "Produkt"]),
		],
		readouts: [
			{
				key: "product",
				label: "Stoff",
				compute: (v) =>
					v.step === 0
						? "Sauerstoff ist noch ein eigener Stoff."
						: [
								"Magnesiumoxid · Metalloxid",
								"Kohlenstoffdioxid · Nichtmetalloxid",
								"Schwefeldioxid · Nichtmetalloxid",
							][v.reaction],
			},
		],
		goals: [
			goal(
				"metal",
				"Zeige die Bildung eines Metalloxids.",
				(v) => v.reaction === 0 && v.step === 1,
			),
			goal(
				"carbon",
				"Finde das Nichtmetalloxid aus Kohlenstoff.",
				(v) => v.reaction === 1 && v.step === 1,
			),
			goal(
				"sulfur",
				"Finde das Nichtmetalloxid aus Schwefel.",
				(v) => v.reaction === 2 && v.step === 1,
			),
		],
	},
	rust: {
		kind: "rust",
		title: "Wann rostet dieser Nagel?",
		intro:
			"Ändere Feuchtigkeit, Sauerstoff und Schutzschicht. Alle anderen Bedingungen bleiben gleich. Das Modell vergleicht die Oberflächen nach derselben Zeit.",
		params: [
			choice("water", "Wasser", ["trocken", "feucht"]),
			choice("oxygen", "Sauerstoff", ["Zutritt", "ausgeschlossen"]),
			choice("coat", "Schutzschicht", ["unbeschichtet", "intakter Lack"]),
		],
		readouts: [
			{
				key: "result",
				label: "Oberfläche",
				compute: (v) =>
					v.water && !v.oxygen && !v.coat
						? "Rotbraune Rostschicht"
						: "Kein Rost im Modell",
			},
		],
		goals: [
			goal(
				"rusted",
				"Erzeuge Rost am unbeschichteten Nagel.",
				(v) => !!(v.water && !v.oxygen && !v.coat),
			),
			goal(
				"without-oxygen",
				"Verhindere den Rost am feuchten Nagel durch Ausschluss von Sauerstoff.",
				(v) => !!(v.water && v.oxygen && !v.coat),
			),
			goal(
				"coated",
				"Schütze den Nagel in feuchter Luft mit einer intakten Schicht.",
				(v) => !!(v.water && !v.oxygen && v.coat),
			),
		],
	},
	equation: {
		kind: "equation",
		title: "Atome auf beiden Seiten zählen",
		intro:
			"Verändere nur die Zahlen vor den Formeln. Links und rechts müssen gleich viele Magnesium- und Sauerstoffatome stehen.",
		params: [
			range("mg", "Anzahl Mg", 1, 4),
			range("oxygen", "Anzahl O₂", 1, 3),
			range("oxide", "Anzahl MgO", 1, 6),
		],
		readouts: [
			{
				key: "balance",
				label: "Bilanz",
				compute: (v) =>
					magnesiumEquation(v.mg, v.oxygen, v.oxide).balanced
						? "Ausgeglichen"
						: "Noch ungleich",
			},
		],
		goals: [
			goal(
				"oxygen",
				"Stelle je zwei O-Atome ein, während links noch zu wenig Mg steht.",
				(v) => v.mg === 1 && v.oxygen === 1 && v.oxide === 2,
			),
			goal(
				"smallest",
				"Gleiche beide Atomsorten mit den kleinsten Zahlen aus.",
				(v) => v.mg === 2 && v.oxygen === 1 && v.oxide === 2,
			),
		],
	},
	atom: {
		kind: "atom",
		title: "Vom Atom in den Kern hineinzoomen",
		intro:
			"Springe von der Übersicht zum Maßstabsvergleich und zur Kernvergrößerung. In der Übersicht ist der Kern zur Orientierung stark vergrößert.",
		params: [
			choice("zoom", "Ansicht", [
				"Übersicht",
				"Größenvergleich",
				"Kern vergrößert",
			]),
		],
		readouts: [
			{
				key: "size",
				label: "Aussage",
				compute: (v) =>
					[
						"Elektronen gehören zur Hülle. Der positive Kern liegt in der Mitte.",
						"Ist das Atom etwa 100 m breit, ist der Kern in diesem Beispiel etwa 1 mm breit.",
						"Protonen und Neutronen sitzen eng im Kern. Fast die gesamte Masse steckt dort.",
					][v.zoom],
			},
		],
		goals: [
			goal(
				"scale",
				"Vergleiche die Durchmesser bei gleicher Skala.",
				(v) => v.zoom === 1,
			),
			goal(
				"nucleus",
				"Finde die Teilchen, die im Kern sitzen.",
				(v) => v.zoom === 2,
			),
		],
	},
	isotopes: {
		kind: "isotopes",
		title: "Isotope im Kern vergleichen",
		intro:
			"Wähle ein neutrales Atom. Massenzahl A und Ordnungszahl Z sind gegeben. Prüfe im Modell, welche Zähler sich ändern.",
		params: [
			choice(
				"isotope",
				"Atom",
				ISOTOPES.map((entry) => entry.symbol + "–" + entry.a),
			),
		],
		readouts: [
			{ key: "p", label: "Protonen", compute: (v) => ISOTOPES[v.isotope].z },
			{
				key: "n",
				label: "Neutronen",
				compute: (v) => {
					const { z, a } = ISOTOPES[v.isotope];
					return neutralAtom(z, a).neutrons;
				},
			},
			{ key: "e", label: "Elektronen", compute: (v) => ISOTOPES[v.isotope].z },
		],
		goals: [
			goal(
				"c12",
				"Finde ein Kohlenstoffatom mit sechs Neutronen.",
				(v) => v.isotope === 1,
			),
			goal(
				"c13",
				"Finde das Kohlenstoffisotop mit einem Neutron mehr.",
				(v) => v.isotope === 2,
			),
			goal(
				"sodium",
				"Wähle das Atom mit elf Protonen und zwölf Neutronen.",
				(v) => v.isotope === 4,
			),
		],
	},
	periodic: {
		kind: "periodic",
		title: "Spuren im Periodensystem",
		intro:
			"Untersuche einen Ausschnitt des Periodensystems mit den ersten 18 Elementen. Die Lücke zwischen Gruppe 2 und 13 steht für hier ausgelassene Spalten.",
		params: [
			choice("element", "Element", [
				"Übersicht",
				...ELEMENT_EXAMPLES.map(({ z }) => ELEMENTS[z - 1][1]),
			]),
		],
		readouts: [
			{
				key: "family",
				label: "Stoffklasse",
				compute: (v) =>
					v.element
						? ELEMENT_EXAMPLES[v.element - 1].group
						: "Wähle ein Element.",
			},
			{
				key: "use",
				label: "Verwendung",
				compute: (v) =>
					v.element
						? ELEMENT_EXAMPLES[v.element - 1].use
						: "Vergleiche Zeilen und Spalten.",
			},
		],
		goals: [
			goal(
				"period3",
				"Wähle das Metall, das für leichte Fahrradrahmen verwendet wird.",
				(v) => v.element === 5,
			),
			goal(
				"group18",
				"Finde das Edelgas, das in einer Leuchtröhre rotorange leuchtet.",
				(v) => v.element === 3,
			),
			goal(
				"group17",
				"Finde das Nichtmetall, das zur Herstellung von Kunststoffen verwendet wird.",
				(v) => v.element === 6,
			),
		],
	},
	shells: {
		kind: "shells",
		title: "Elektronen auf Energiestufen",
		intro:
			"Stelle die Ordnungszahl eines neutralen Atoms ein. Beobachte bei den ersten 18 Elementen, wann eine weitere Schale besetzt wird.",
		params: [range("z", "Ordnungszahl Z", 1, 18)],
		readouts: [
			{
				key: "element",
				label: "Element",
				compute: (v) => ELEMENTS[v.z - 1][1],
			},
			{
				key: "shells",
				label: "Besetzte Schalen",
				compute: (v) => shells(v.z).length,
			},
			{
				key: "outer",
				label: "Außenelektronen",
				compute: (v) => shells(v.z).at(-1) ?? 0,
			},
		],
		goals: [
			goal(
				"duet",
				"Finde das Edelgas, dessen erste Schale mit zwei Elektronen voll ist.",
				(v) => v.z === 2,
			),
			goal(
				"octet",
				"Finde ein Edelgas mit zwei besetzten Schalen und acht Außenelektronen.",
				(v) => v.z === 10,
			),
			goal(
				"new-shell",
				"Gehe von Neon einen Schritt weiter und öffne die dritte Schale.",
				(v) => v.z === 11,
			),
		],
	},
} satisfies Record<string, LabDefinition>;

export const magnesiumFormula = "2 Mg + O₂ → 2 MgO";
