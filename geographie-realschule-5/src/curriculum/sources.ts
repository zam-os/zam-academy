import type { Source, Stage } from "../model/types";
export const EDITORIAL_DATE = "2026-11-13";
export const CURRICULUM_URL =
	"https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/5/geographie";
export const SOURCES: Source[] = [
	{
		id: "lehrplan",
		url: "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/5/geographie",
		label: "LehrplanPLUS - Realschule - 5 - Geographie - Fachlehrpläne",
	},
	{
		id: "nasa-earth",
		url: "https://science.nasa.gov/earth/facts/",
		label: "Facts About Earth",
	},
	{
		id: "nasa-solar",
		url: "https://science.nasa.gov/solar-system/",
		label: "Solar System Exploration",
	},
	{
		id: "usgs",
		url: "https://pubs.usgs.gov/gip/dynamic/understanding.html",
		label: "Understanding plate motions [This Dynamic Earth, USGS]",
	},
	{
		id: "atlas",
		url: "https://geoportal.bayern.de/bayernatlas/",
		label: "BayernAtlas",
	},
	{
		id: "wald",
		url: "https://www.nationalpark-bayerischer-wald.bayern.de/ueber_uns/aufgaben/index.htm",
		label: "Aufgaben und Ziele",
	},
	{
		id: "esa",
		url: "https://www.esa.int/Space_Safety/Space_Debris",
		label: "Space Debris",
	},
	{
		id: "bayern",
		url: "https://www.regierung.mittelfranken.bayern.de/",
		label: "Regierung von Mittelfranken - Regierung von Mittelfranken",
	},
	{
		id: "lfu",
		url: "https://www.lfu.bayern.de/geologie/geologie_bayerns/ueberblick/index.htm",
		label: "Geologischer Überblick Bayern - LfU Bayern",
	},
];
export const STAGES: Stage[] = [
	{
		lb: 1,
		title: "Einführung in das Fach",
		shortTitle: "Einführung in das Fach",
		hours: 8,
		icon: "🧭",
	},
	{
		lb: 2,
		title: "Planet Erde",
		shortTitle: "Planet Erde",
		hours: 8,
		icon: "🌍",
	},
	{
		lb: 3,
		title: "Gestalt und Gliederung der Erde",
		shortTitle: "Gestalt und Gliederung der Erde",
		hours: 10,
		icon: "🗺️",
	},
	{
		lb: 4,
		title: "Veränderung der Erdoberfläche",
		shortTitle: "Veränderung der Erdoberfläche",
		hours: 10,
		icon: "⛰️",
	},
	{
		lb: 5,
		title: "Naturräumliche und politische Strukturen in Deutschland und Bayern",
		shortTitle: "Deutschland und Bayern",
		hours: 8,
		icon: "📍",
	},
	{
		lb: 6,
		title: "Anwendung im Nahraum",
		shortTitle: "Anwendung im Nahraum",
		hours: 8,
		icon: "🏘️",
	},
	{
		lb: 7,
		title: "Aktuelle geographische Fragestellung",
		shortTitle: "Aktuelle geographische Fragestellung",
		hours: 4,
		icon: "🔎",
	},
];
