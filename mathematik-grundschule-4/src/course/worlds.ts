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
];

export const isWorldLesson = (id: string) => isMeasure(id);
