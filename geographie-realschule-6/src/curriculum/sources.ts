import type { Source, Stage } from "../model/types";

export const CURRICULUM_URL = "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/geographie";
export const EDITORIAL_DATE = "2026-11-18";
export const STAGES: Stage[] = [
	{
		"lb": 1,
		"title": "Europa – Einheit und Vielfalt eines Kontinents",
		"shortTitle": "Europa entdecken",
		"icon": "🧭",
		"hours": 8
	},
	{
		"lb": 2,
		"title": "Wetter und Klima",
		"shortTitle": "Wetter und Klima",
		"icon": "🌦️",
		"hours": 10
	},
	{
		"lb": 3,
		"title": "Landwirtschaft und Nahrungsmittel",
		"shortTitle": "Vom Feld auf den Teller",
		"icon": "🌾",
		"hours": 9
	},
	{
		"lb": 4,
		"title": "Verkehr und Industrie",
		"shortTitle": "Verkehr und Industrie",
		"icon": "🚆",
		"hours": 9
	},
	{
		"lb": 5,
		"title": "Energie",
		"shortTitle": "Energie vernetzt",
		"icon": "⚡",
		"hours": 8
	},
	{
		"lb": 6,
		"title": "Tourismus",
		"shortTitle": "Tourismus",
		"icon": "🏔️",
		"hours": 8
	},
	{
		"lb": 7,
		"title": "Aktuelle geographische Fragestellung",
		"shortTitle": "Europa in den Nachrichten",
		"icon": "🔎",
		"hours": 4
	}
];
export const SOURCES: Source[] = [
	{
		"id": "lehrplan",
		"label": "LehrplanPLUS Bayern · Geographie 6",
		"url": "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/geographie"
	},
	{
		"id": "eu",
		"label": "Europäische Union · Euro und Schengen (Englisch)",
		"url": "https://european-union.europa.eu/easy-read_en"
	},
	{
		"id": "atlas",
		"label": "BayernAtlas · Karten und Luftbilder",
		"url": "https://atlas.bayern.de/"
	},
	{
		"id": "klima",
		"label": "Umweltbundesamt · Klima",
		"url": "https://www.umweltbundesamt.de/service/glossar/klima"
	},
	{
		"id": "brenner",
		"label": "Brenner Basistunnel · Projektüberblick",
		"url": "https://www.bbt-se.com/brenner-basistunnel/projektueberblick/"
	},
	{
		"id": "bmw",
		"label": "BMW Group · Werk Dingolfing",
		"url": "https://www.bmwgroup-werke.com/content/grpw/websites/bmwgroup-werke_com/dingolfing/de.html"
	},
	{
		"id": "statnett",
		"label": "Statnett · NordLink und Stromverbindungen (Englisch)",
		"url": "https://www.statnett.no/en/The-power-system/interconnectors/"
	},
	{
		"id": "kreta",
		"label": "Copernicus · Überschwemmungen auf Kreta (Englisch)",
		"url": "https://mapping.emergency.copernicus.eu/news/flood-in-crete-greece-emsr933/"
	},
	{
		"id": "nachricht",
		"label": "Euronews · Starkregen auf Kreta (Englisch)",
		"url": "https://www.euronews.com/2026/10/01/crete-at-the-mercy-of-severe-weather-floods-landslides-power-cuts-and-closed-schools"
	}
];
