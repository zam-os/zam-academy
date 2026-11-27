import type { Source, Stage } from "../model/types";

export const CURRICULUM_URL =
	"https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/biologie";
export const SOURCES: Source[] = [
	{ id: "lp", label: "ISB · LehrplanPLUS Biologie 7", url: CURRICULUM_URL },
	{
		id: "noise",
		label: "IQWiG · Kann Lärm das Gehör schädigen?",
		url: "https://www.gesundheitsinformation.de/kann-laerm-das-gehoer-schaedigen.html",
	},
	{
		id: "hearing",
		label: "IQWiG · Was hilft schwerhörigen oder gehörlosen Erwachsenen?",
		url: "https://www.gesundheitsinformation.de/was-hilft-schwerhoerigen-oder-gehoerlosen-erwachsenen.html",
	},
	{
		id: "pancreas",
		label: "IQWiG · Wie funktioniert die Bauchspeicheldrüse?",
		url: "https://www.gesundheitsinformation.de/wie-funktioniert-die-bauchspeicheldruese.html",
	},
];

export const STAGES: Stage[] = [
	{ lb: 1, title: "Prozessbezogene Kompetenzen", shortTitle: "Biologisch arbeiten", icon: "⌕" },
	{ lb: 2, title: "Die Zelle – Grundbaustein aller Lebewesen", shortTitle: "Zellen und Einzeller", icon: "◎", hours: 10 },
	{ lb: 3, title: "Stoffwechselvorgänge bei Pflanzen", shortTitle: "Pflanzen und Fotosynthese", icon: "☘", hours: 15 },
	{ lb: 4, title: "Organsysteme des Menschen", shortTitle: "Organsysteme des Menschen", icon: "♡", hours: 30 },
];
