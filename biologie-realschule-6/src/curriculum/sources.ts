import type { Source, Stage } from "../model/types";
export const CURRICULUM_URL =
	"https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/biologie";
export const SOURCES: Source[] = [
	{
		id: "lp",
		label: "ISB · LehrplanPLUS Biologie 6 Realschule · geprüft 13.11.2026",
		url: CURRICULUM_URL,
	},
	{
		id: "puberty",
		label: "IQWiG · Was passiert in der Pubertät?",
		url: "https://www.gesundheitsinformation.de/was-passiert-in-der-pubertaet.html",
	},
	{
		id: "condom",
		label: "BIÖG · Das Kondom: Verhütung und Infektionsschutz",
		url: "https://www.familienplanung.de/verhuetung/verhuetungsmethoden/kondom/",
	},
	{
		id: "insects",
		label: "Bundesumweltministerium · Insektenschutz",
		url: "https://www.bundesumweltministerium.de/faqs/insektenschutz",
	},
];
export const STAGES: Stage[] = [
	{
		lb: 1,
		title: "Prozessbezogene Kompetenzen",
		shortTitle: "Fragen stellen und Belege prüfen",
		icon: "⌕",
	},
	{
		lb: 2,
		title: "Fortpflanzung und Sexualität",
		shortTitle: "Wie neues Leben entsteht",
		icon: "✿",
		hours: 18,
	},
	{
		lb: 3,
		title: "Vielfalt von Wirbeltieren",
		shortTitle: "Verwandt und verschieden",
		icon: "↝",
		hours: 20,
	},
	{
		lb: 4,
		title: "Ein heimatnahes Ökosystem",
		shortTitle: "Leben in deiner Umgebung",
		icon: "🌿",
		hours: 18,
	},
];
