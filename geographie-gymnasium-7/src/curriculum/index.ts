import type { Lesson, Source, Stage } from "../model/types";
import lb1 from "./lessons-lb1.json";
import lb2 from "./lessons-lb2.json";
import lb3 from "./lessons-lb3.json";
import lb4 from "./lessons-lb4.json";
import lb5 from "./lessons-lb5.json";
import lb6 from "./lessons-lb6.json";

export const LESSONS = [...lb1, ...lb2, ...lb3, ...lb4, ...lb5, ...lb6] as Lesson[];
export const CORE_LESSONS = LESSONS;
export const STAGES: Stage[] = [
  { lb: 1, title: "Geographische Arbeitstechniken", shortTitle: "Karten und Daten", icon: "⌖" },
  { lb: 2, title: "Einheit und Vielfalt in Europa", shortTitle: "Europa im Alltag", icon: "✦" },
  { lb: 3, title: "Naturgeographie Europas im Überblick", shortTitle: "Klima und Natur", icon: "▲" },
  { lb: 4, title: "Ländliche Räume Europas", shortTitle: "Landwirtschaft und Land", icon: "▦" },
  { lb: 5, title: "Metropolen und Verdichtungsräume in Europa", shortTitle: "Städte und Verbindungen", icon: "▥" },
  { lb: 6, title: "Meere und Küsten Europas", shortTitle: "Meere und Küsten", icon: "≈" },
];

export const CURRICULUM_URL = "https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/geographie";
export const SOURCES: Source[] = [
  { id: "lehrplan", label: "LehrplanPLUS · Geographie 7 Gymnasium", url: CURRICULUM_URL },
  { id: "eu", label: "Europäische Union · Binnenmarkt", url: "https://european-union.europa.eu/priorities-and-actions/actions-topic/single-market_de" },
  { id: "natural-earth", label: "Natural Earth · Kartengrundlage", url: "https://www.naturalearthdata.com/about/terms-of-use/" },
  { id: "strom", label: "Met Office · Ozean und Klima (Englisch)", url: "https://weather.metoffice.gov.uk/learn-about/weather/oceans" },
  { id: "esa", label: "ESA · Radarbild von Rotterdam und Umgebung (Englisch)", url: "https://www.esa.int/media/earth-from-space-southwest-netherlands-en-377990" },
  { id: "watt", label: "Weltnaturerbe Wattenmeer", url: "https://www.waddensea-worldheritage.org/" },
];

export const findLesson = (id: string) => LESSONS.find((lesson) => lesson.id === id);
