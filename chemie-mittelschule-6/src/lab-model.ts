import type { LabKind } from "./model/types";

export interface LabState {
	mode: string;
	temperature: number;
	seen: string[];
}
export interface LabChoice {
	id: string;
	label: string;
	detail: string;
}
interface LabDefinition {
	title: string;
	choices: [LabChoice, LabChoice, LabChoice];
	limit: string;
}
export const LABS: Record<LabKind, LabDefinition> = {
	inquiry: {
		title: "Von der Messung zur begründeten Aussage",
		choices: [
			{
				id: "observe",
				label: "Beobachten",
				detail:
					"In der erfundenen Messreihe löst sich dieselbe Salzmenge bei 20 °C in 120 s, bei 40 °C in 75 s und bei 60 °C in 40 s. Wassermenge und Rühren bleiben gleich.",
			},
			{
				id: "plot",
				label: "Als Diagramm lesen",
				detail:
					"Waagerecht steht die Wassertemperatur, senkrecht die Zeit bis zum Auflösen. Die drei Messpunkte fallen nach rechts ab. Die Punkte sind Beispielwerte, keine Naturkonstanten.",
			},
			{
				id: "infer",
				label: "Schlussfolgern",
				detail:
					"Unter diesen Versuchsbedingungen löst sich das Salz bei höherer Temperatur schneller. Die Beobachtung ist eine Zeitangabe; die Schlussfolgerung beschreibt den Zusammenhang.",
			},
		],
		limit:
			"Eine vereinfachte Beispielmessreihe. Echte Versuche, Wiederholungen und ein eigenes Protokoll gehören in den Unterricht.",
	},
	safety: {
		title: "Erst das Risiko erkennen, dann handeln",
		choices: [
			{
				id: "label",
				label: "Kennzeichnung",
				detail:
					"Die rote Raute mit Flamme warnt vor entzündbaren Stoffen; das Ausrufezeichen kann zum Beispiel auf reizende Stoffe hinweisen. Lies immer auch die Hinweise auf dem Etikett.",
			},
			{
				id: "prepare",
				label: "Arbeitsplatz",
				detail:
					"Schutzbrille tragen, lange Haare zusammenbinden, Gefäße standsicher aufstellen und nur nach der Sicherheitsunterweisung arbeiten. Nichts probieren und nie direkt an unbekannten Stoffen riechen.",
			},
			{
				id: "stop",
				label: "Störung",
				detail:
					"Bei Glasbruch, Spritzern oder einer unerwarteten Reaktion unterbrichst du die Arbeit und informierst sofort die Lehrkraft. Du beginnst keinen eigenen Rettungsversuch.",
			},
		],
		limit:
			"Die Darstellung ersetzt keine Sicherheitsunterweisung. Wasserzerlegung und Gasnachweise sind ausschließlich Unterricht unter fachkundiger Aufsicht.",
	},
	waterUse: {
		title: "Ein Stoff, verschiedene Aufgaben",
		choices: [
			{
				id: "life",
				label: "Lebensraum",
				detail:
					"Wasser ist Lebensraum für Fische, Wasserpflanzen und viele kleine Lebewesen. Gelöster Sauerstoff ermöglicht vielen Wassertieren die Atmung.",
			},
			{
				id: "drink",
				label: "Lebensmittel",
				detail:
					"Menschen, Tiere und Pflanzen benötigen Wasser. Trinkwasser muss geeignete Qualität besitzen. Klares Aussehen beweist keine Trinkwasserqualität.",
			},
			{
				id: "carry",
				label: "Transport",
				detail:
					"Wasser transportiert gelöste Stoffe in Pflanzen und im Körper. Flüsse und Kanäle dienen außerdem als Verkehrswege für Schiffe.",
			},
		],
		limit:
			"Ein Übersichtsmodell zeigt Aufgaben von Wasser, aber nicht die örtliche Wasserqualität oder den Bedarf einer einzelnen Person.",
	},
	properties: {
		title: "Wasser mit Messwerten beschreiben",
		choices: [
			{
				id: "melt",
				label: "Schmelzpunkt",
				detail:
					"Bei normalem Luftdruck schmilzt reines Eis bei ungefähr 0 °C. Während Eis und Wasser zusammen vorliegen, ist eine Temperaturmessung allein noch keine Mengenangabe.",
			},
			{
				id: "boil",
				label: "Siedepunkt",
				detail:
					"Reines Wasser siedet bei normalem Luftdruck bei ungefähr 100 °C. Im Gebirge kann der Siedepunkt niedriger liegen. Heißes Wasser und Wasserdampf können verbrühen.",
			},
			{
				id: "compare",
				label: "Steckbrief",
				detail:
					"Zu einem Stoffsteckbrief gehören untersuchte Eigenschaften und Bedingungen: Wasser ist bei 20 °C flüssig, farblos und geruchlos. Aus diesen Angaben allein darfst du nicht auf Trinkbarkeit schließen.",
			},
		],
		limit:
			"Die Werte gelten für reines Wasser bei normalem Luftdruck. Die App misst keine unbekannte Probe.",
	},
	solutions: {
		title: "Lösen und Leiten sind zwei verschiedene Fragen",
		choices: [
			{
				id: "salt",
				label: "Kochsalz",
				detail:
					"Eine kleine Menge Kochsalz verteilt sich gelöst im Wasser. Die Lösung leitet elektrischen Strom deutlich besser als sehr reines Wasser. Die klar aussehende Lösung enthält weiterhin Salz.",
			},
			{
				id: "sugar",
				label: "Zucker",
				detail:
					"Eine kleine Menge Zucker kann sich ebenfalls vollständig lösen. Reine Zuckerlösung leitet trotzdem kaum Strom. Löslichkeit allein sagt also noch nichts über die Leitfähigkeit aus.",
			},
			{
				id: "sand",
				label: "Sand",
				detail:
					"Sand löst sich im Schulversuch praktisch nicht in Wasser. Er bleibt als Teilchen sichtbar und setzt sich ab. Ein Filter kann die Sandkörner zurückhalten, gelöstes Salz aber nicht.",
			},
		],
		limit:
			"Teilchen sind stark vergrößert und vereinfacht. Leitfähigkeit wird nur qualitativ verglichen; Leitungswasser enthält bereits gelöste Stoffe. Elektrische Versuche nur mit freigegebenem Schulmaterial.",
	},
	tension: {
		title: "Die Wasseroberfläche als besondere Grenzfläche",
		choices: [
			{
				id: "drop",
				label: "Wassertropfen",
				detail:
					"Wasserteilchen ziehen einander an. Die Oberfläche zieht sich möglichst klein zusammen; kleine Tropfen werden dadurch rundlich. Die Oberfläche ist keine feste Haut.",
			},
			{
				id: "strider",
				label: "Wasserläufer",
				detail:
					"Die Oberflächenspannung trägt einen leichten Wasserläufer zusammen mit seinen wasserabweisenden Beinen. Die Oberfläche wird dabei eingedellt.",
			},
			{
				id: "soap",
				label: "Spülmittel",
				detail:
					"Spülmittel verringert die Oberflächenspannung. Eine Wasseroberfläche kann dann leichten Gegenständen weniger Halt geben. Spülmittel gehört nicht in einen Teich.",
			},
		],
		limit:
			"Die Linie überzeichnet die Grenzfläche. Sie ist keine Membran. Die Tragwirkung hängt auch von Form und Benetzung des Gegenstands ab.",
	},
	particles: {
		title: "Wärmeres Wasser: gleiche Teilchen, andere Bewegung",
		choices: [
			{
				id: "solid",
				label: "Eis · −5 °C",
				detail:
					"Im festen Eis schwingen die Teilchen um feste Plätze. Das offene Gitter ist eine Besonderheit von Wasser. Die Teilchen selbst werden beim Abkühlen nicht kleiner.",
			},
			{
				id: "liquid",
				label: "Wasser · 20 °C",
				detail:
					"In flüssigem Wasser liegen die Teilchen nahe beieinander und wechseln ihre Plätze. Wasser passt sich dem Gefäß an, behält aber ungefähr sein Volumen.",
			},
			{
				id: "gas",
				label: "Wasserdampf · 105 °C",
				detail:
					"Im gasförmigen Wasser sind die Teilchen weit voneinander entfernt und bewegen sich frei. Unsichtbarer Wasserdampf ist weiterhin Wasser; sichtbarer weißer Nebel besteht aus kleinen flüssigen Tröpfchen.",
			},
		],
		limit:
			"Die Kugeln sind keine Fotos und nicht maßstabsgetreu. Bei 0 °C und 100 °C können bei normalem Luftdruck jeweils zwei Zustände gleichzeitig vorliegen. Verdunsten findet auch unterhalb des Siedepunkts statt.",
	},
	anomaly: {
		title: "Warum schwimmt Eis auf Wasser?",
		choices: [
			{
				id: "four",
				label: "4 °C",
				detail:
					"Flüssiges Wasser hat bei ungefähr 4 °C seine größte Dichte. Die gleiche Wassermasse benötigt hier das kleinste Volumen.",
			},
			{
				id: "zero",
				label: "Von 4 °C zu 0 °C",
				detail:
					"Unterhalb von 4 °C dehnt sich flüssiges Wasser beim weiteren Abkühlen wieder aus. Seine Dichte nimmt ab. Das unterscheidet es vom üblichen Verhalten vieler Stoffe.",
			},
			{
				id: "ice",
				label: "Gefrieren",
				detail:
					"Beim Gefrieren bildet sich ein offenes Teilchengitter. Eis hat eine geringere Dichte als flüssiges Wasser und schwimmt oben. Im tiefen See kann unten Wasser um 4 °C bleiben.",
			},
		],
		limit:
			"Gleiche Masse, absichtlich überzeichnete Volumenunterschiede. Ein flacher Teich kann durchfrieren; das Modell garantiert keine sichere Eisdecke.",
	},
	molecules: {
		title: "Atome zählen, Formeln verstehen",
		choices: [
			{
				id: "water",
				label: "Wasser · H₂O",
				detail:
					"Ein Wassermolekül besteht aus zwei Wasserstoffatomen und einem Sauerstoffatom. Die kleine 2 gehört zum H. Wasser ist eine Verbindung aus zwei Elementen.",
			},
			{
				id: "hydrogen",
				label: "Wasserstoff · H₂",
				detail:
					"Ein Wasserstoffmolekül besteht aus zwei Wasserstoffatomen. Weil nur eine Atomsorte vorkommt, ist Wasserstoff ein Element und keine Verbindung.",
			},
			{
				id: "oxygen",
				label: "Sauerstoff · O₂",
				detail:
					"Ein Sauerstoffmolekül besteht aus zwei Sauerstoffatomen. Auch ein Molekül mit mehreren Atomen kann zu einem Element gehören, wenn nur eine Atomsorte vorkommt.",
			},
		],
		limit:
			"Rot und hell sind Modellfarben, die Buchstaben bezeichnen die Atomsorte. Atome haben diese Farben nicht; Größen und Abstände sind vereinfacht.",
	},
	electrolysis: {
		title: "Wasser wird zu zwei neuen Stoffen",
		choices: [
			{
				id: "before",
				label: "Vorher: Wasser",
				detail:
					"Zwei Wassermoleküle enthalten zusammen vier Wasserstoffatome und zwei Sauerstoffatome. Wasser ist ein Reinstoff und eine Verbindung, kein Gemisch der beiden Gase.",
			},
			{
				id: "rearrange",
				label: "Atome neu ordnen",
				detail:
					"Bei der Elektrolyse wird elektrische Energie zugeführt. Atome gehen nicht verloren: Die vier H-Atome und zwei O-Atome werden neu miteinander verbunden.",
			},
			{
				id: "after",
				label: "Nachher: Gase",
				detail:
					"Aus zwei Wassermolekülen entstehen zwei Wasserstoffmoleküle und ein Sauerstoffmolekül. Bei gleichen Messbedingungen entsteht doppelt so viel Gasvolumen Wasserstoff wie Sauerstoff.",
			},
		],
		limit:
			"Ein Teilchenmodell, keine Bauanleitung. Die Wasserzerlegung findet nur im Unterricht unter fachkundiger Aufsicht statt. Wasserstoff ist entzündbar.",
	},
	gases: {
		title: "Eine Beobachtung identifiziert das Gas",
		choices: [
			{
				id: "hydrogen",
				label: "Wasserstoff",
				detail:
					"Bei der fachgerecht durchgeführten Knallgasprobe kann ein charakteristisches Geräusch entstehen. Wasserstoff ist farb- und geruchlos und brennbar. Die Probe führt die Lehrkraft sicher vor.",
			},
			{
				id: "oxygen",
				label: "Sauerstoff",
				detail:
					"Bei der Glimmspanprobe flammt ein glimmender Holzspan wieder auf. Sauerstoff ist farb- und geruchlos, selbst nicht brennbar, unterstützt aber Verbrennungen.",
			},
			{
				id: "unknown",
				label: "Unbekanntes Gas",
				detail:
					"Farbe und Geruch allein reichen zur Unterscheidung nicht. Ein ausgebliebener Nachweis beweist nicht, welches andere Gas vorliegt. Unbekannte Gase werden nicht eingeatmet oder selbst getestet.",
			},
		],
		limit:
			"Die App zeigt Auswertung und Eigenschaften. Gasnachweise sind keine Heimversuche und hier keine Anleitung zum Sammeln oder Entzünden von Gasen.",
	},
	hydro: {
		title: "Der Weg der Energie im Wasserkraftwerk",
		choices: [
			{
				id: "height",
				label: "Höhenunterschied",
				detail:
					"Höher gelegenes Wasser besitzt Lageenergie. Beim Abwärtsfließen wird diese in Bewegungsenergie umgewandelt. Der natürliche Wasserkreislauf wird überwiegend von der Sonne angetrieben.",
			},
			{
				id: "turbine",
				label: "Turbine",
				detail:
					"Fließendes Wasser setzt eine Turbine in Drehung. Sie überträgt mechanische Energie auf den Generator. Das Wasser wird dabei nicht als Brennstoff verbraucht.",
			},
			{
				id: "generator",
				label: "Generator & Fluss",
				detail:
					"Der Generator wandelt mechanische in elektrische Energie um. Ein Teil der Energie wird als Wärme an die Umgebung abgegeben. Wehre verändern Lebensräume; Fischaufstieg und Restwasser können Folgen mindern.",
			},
		],
		limit:
			"Das Schema zeigt keine Leistung und berechnet keinen Wirkungsgrad. Erneuerbare Energie bedeutet nicht, dass ein Kraftwerk ohne Eingriff in die Umwelt auskommt.",
	},
	foodweb: {
		title: "Stoffe kreisen durch den Wald",
		choices: [
			{
				id: "producer",
				label: "Erzeuger",
				detail:
					"Grüne Pflanzen erzeugen mit Licht energiereiche Stoffe. Die Nahrungspfeile im oberen Netz zeigen vom Futter zum Fresser: Blatt zur Raupe, Raupe zur Meise und Meise zum Sperber.",
			},
			{
				id: "consumer",
				label: "Verbraucher",
				detail:
					"Tiere nehmen Stoffe mit der Nahrung auf. Mehrere Nahrungsketten sind verknüpft: Raupen und Blattläuse fressen Pflanzenteile, Meisen fressen beide. Auch Pflanzen und Tiere geben Reste ab.",
			},
			{
				id: "decomposer",
				label: "Zersetzer",
				detail:
					"Pilze, Bakterien und Bodentiere wirken am Abbau von Resten mit. Mineralstoffe gelangen zurück in Boden und Pflanzen. Stoffe können kreisen; die Energie wird nicht im selben Sinn im Kreis zurückgegeben.",
			},
		],
		limit:
			"Das Netz lässt Arten, Jahreszeiten und viele Beziehungen weg. Pfeile im Nahrungsteil bedeuten ‚wird gefressen von‘; der untere Rückweg zeigt Stofftransport.",
	},
	photosynthesis: {
		title: "Aus Wasser und Kohlenstoffdioxid wird Traubenzucker",
		choices: [
			{
				id: "inputs",
				label: "Ausgangsstoffe",
				detail:
					"Die grüne Pflanze nimmt Wasser über die Wurzeln und Kohlenstoffdioxid aus der Luft auf. Beide sind Ausgangsstoffe der Fotosynthese.",
			},
			{
				id: "light",
				label: "Licht & Blattgrün",
				detail:
					"Mit Lichtenergie und mithilfe des Blattgrüns bildet die Pflanze Traubenzucker. Licht ist eine Energiezufuhr und kein Stoff. Die Darstellung ist eine vereinfachte Wortgleichung.",
			},
			{
				id: "products",
				label: "Produkte",
				detail:
					"Es entstehen Traubenzucker und Sauerstoff. Traubenzucker dient unter anderem als Baustoffgrundlage und Energiespeicher. Pflanzen nehmen zusätzlich Mineralstoffe auf und betreiben auch Zellatmung.",
			},
		],
		limit:
			"Die Wortgleichung fasst viele Schritte zusammen. Sie erklärt nicht die Reaktionswege im Blatt. Pflanzen gewinnen ihre Nährstoffe nicht allein aus dem Boden.",
	},
	soilLife: {
		title: "Bodenlebewesen an Merkmalen unterscheiden",
		choices: [
			{
				id: "worm",
				label: "Regenwurm",
				detail:
					"Ein Regenwurm besitzt einen langgestreckten, geringelten Körper und keine Beine. Er gehört zu den Ringelwürmern. Er mischt organische Reste mit Boden und schafft Gänge.",
			},
			{
				id: "mite",
				label: "Milbe",
				detail:
					"Eine erwachsene Milbe hat acht Beine und gehört zu den Spinnentieren. Viele Milben leben in Streu und Oberboden; sie sind nur ein Teil der zahlreichen kleinen Bodenlebewesen.",
			},
			{
				id: "woodlouse",
				label: "Assel",
				detail:
					"Eine erwachsene Landassel besitzt sieben Beinpaare und gehört zu den Krebstieren. Viele Asseln zerkleinern abgestorbene Pflanzenteile. Pilze und Bakterien bauen weiter ab.",
			},
		],
		limit:
			"Stark vergrößerte, schematische Tiere. Das ist eine Merkmalsübung, keine sichere Artbestimmung. Das Suchen und Bestimmen echter Bodenlebewesen gehört in den Unterricht.",
	},
	soil: {
		title: "Ein Bodenprofil lesen und schützen",
		choices: [
			{
				id: "layers",
				label: "Schichten",
				detail:
					"Von oben nach unten: Streu, belebter Oberboden, verwitterter Unterboden und Gestein. Nicht jeder Boden sieht gleich aus; die Schichten entstehen über lange Zeit.",
			},
			{
				id: "water",
				label: "Wasser speichern",
				detail:
					"Poren im Boden nehmen Wasser auf und bieten Lebensraum. Boden kann Stoffe zurückhalten und Wasser filtern, aber nicht jeden Schadstoff entfernen. Gefiltertes Wasser ist deshalb nicht automatisch Trinkwasser.",
			},
			{
				id: "protect",
				label: "Boden schützen",
				detail:
					"Versiegelung und starke Verdichtung erschweren das Versickern. Pflanzenbedeckung, weniger Versiegelung und das Vermeiden von Schadstoffeinträgen schützen Boden und Gewässer.",
			},
		],
		limit:
			"Ein vereinfachtes Profil, kein Schnitt durch jeden Standort. Die Filterwirkung ist begrenzt; echte Proben und Versickerungsversuche ergänzen das Modell im Unterricht.",
	},
};

export const freshLab = (): LabState => ({
	mode: "",
	temperature: 20,
	seen: [],
});
export const fmtDe = (value: number, digits = 0): string =>
	new Intl.NumberFormat("de-DE", {
		maximumFractionDigits: digits,
		minimumFractionDigits: digits,
	})
		.format(Object.is(value, -0) ? 0 : value)
		.replace(/-/g, "−");

export function chooseLab(kind: LabKind, state: LabState, mode: string): void {
	if (!LABS[kind].choices.some((choice) => choice.id === mode)) return;
	state.mode = mode;
	if (!state.seen.includes(mode)) state.seen.push(mode);
	if (kind === "particles")
		state.temperature =
			({ solid: -5, liquid: 20, gas: 105 } as Record<string, number>)[mode] ??
			20;
}
export function setTemperature(state: LabState, value: number): void {
	if (!Number.isFinite(value)) return;
	state.temperature = Math.max(-10, Math.min(110, value));
	// At the transition temperatures, show coexistence rather than claim a single phase.
	state.mode =
		value < 0
			? "solid"
			: value > 100
				? "gas"
				: value > 0 && value < 100
					? "liquid"
					: "transition";
	if (state.mode !== "transition" && !state.seen.includes(state.mode))
		state.seen.push(state.mode);
}
export const labGoals = (kind: LabKind, state: LabState) =>
	LABS[kind].choices.map((choice) => ({
		text: `${choice.label} untersuchen und die Erklärung vergleichen`,
		met: state.seen.includes(choice.id),
	}));
