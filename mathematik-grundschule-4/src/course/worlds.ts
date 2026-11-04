export const MEASURE_IDS = [
	"laengen-messen",
	"masse-fassungsvermoegen",
	"uhrzeit-zeitspannen",
	"geld-einkaufen",
	"einheiten-wechseln",
	"schaetzen-sachprobleme",
] as const;
export type MeasureId = (typeof MEASURE_IDS)[number];
export const isMeasure = (id: string): id is MeasureId =>
	MEASURE_IDS.some((key) => key === id);
export const SHAPE_IDS = [
	"wege-lageplaene",
	"wuerfelgebaeude-ansichten",
	"figuren-zeichnen",
	"koerper-netze",
	"spiegeln-symmetrie",
	"vergroessern-verkleinern",
	"parkette-ornamente",
	"flaechen-vergleichen",
	"rauminhalte-wuerfel",
] as const;
export type ShapeId = (typeof SHAPE_IDS)[number];
export const isShape = (id: string): id is ShapeId =>
	SHAPE_IDS.some((key) => key === id);
export const DATA_IDS = [
	"daten-sammeln-darstellen",
	"tabellen-diagramme-auswerten",
	"zufallsexperimente",
] as const;
export const EXPEDITION_IDS = [
	"expedition-werkstatt",
	"expedition-reise",
	"expedition-inselfest",
] as const;
export const FINAL_IDS = [...DATA_IDS, ...EXPEDITION_IDS] as const;
export type FinalId = (typeof FINAL_IDS)[number];
export const isFinalLesson = (id: string): id is FinalId =>
	FINAL_IDS.some((key) => key === id);
export type World = "forest" | "measure" | "shape" | "chance" | "expedition";
export const WORLDS: {
	id: World;
	label: string;
	icon: string;
	lead: string;
}[] = [
	{
		id: "forest",
		label: "Zahlenwald",
		icon: "♧",
		lead: "Zahlen und Rechnen entdecken",
	},
	{
		id: "measure",
		label: "Messmarkt",
		icon: "☀",
		lead: "Messen, wechseln und planen",
	},
	{
		id: "shape",
		label: "Formenbucht",
		icon: "◇",
		lead: "Bauen, zeichnen und verwandeln",
	},
	{
		id: "chance",
		label: "Zufallsgarten",
		icon: "✧",
		lead: "Daten ordnen und Chancen erkunden",
	},
	{
		id: "expedition",
		label: "Inselexpeditionen",
		icon: "⚑",
		lead: "Werkzeuge wählen und gemeinsam planen",
	},
];

export const isWorldLesson = (id: string) =>
	isMeasure(id) || isShape(id) || isFinalLesson(id);
