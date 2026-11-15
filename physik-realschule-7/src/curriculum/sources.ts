import type { Source, Stage, Track } from "../model/types";
export const CURRICULUM_URL =
	"https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/physik/wpfg1";
export const curriculumUrl = (_track: Track): string => CURRICULUM_URL;
export const SOURCES: Source[] = [
	{ id: "lp", label: "LehrplanPLUS · Physik 7 (I)", url: CURRICULUM_URL },
	{
		id: "isb",
		label: "ISB · Physik an der Realschule",
		url: "https://www.isb.bayern.de/schularten/realschule/faecher/physik/",
	},
	{
		id: "basics",
		label: "ISB · Grundlagen der Physik",
		url: "https://www.isb.bayern.de/schularten/realschule/faecher/physik/grundlagen-der-physik/",
	},
];
export const STAGES: Stage[] = [
	{
		lb: 1,
		title: "Messen, Bewegung, Kräfte und Stoffe · ca. 26 Stunden im Lehrplan",
		shortTitle: "Mechanik",
		icon: "↗",
	},
	{
		lb: 2,
		title: "Lichtwege, Bilder und optische Geräte · ca. 18 Stunden im Lehrplan",
		shortTitle: "Optik",
		icon: "☀",
	},
	{
		lb: 3,
		title: "Magnete, Stromkreise und Schutz · ca. 12 Stunden im Lehrplan",
		shortTitle: "Magnetismus & Elektrizität",
		icon: "⊕",
	},
];
