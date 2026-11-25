import type { Lesson, Source, Stage } from "../model/types";
import lb1 from "./lessons-lb1.json";
import lb2 from "./lessons-lb2.json";
import lb3 from "./lessons-lb3.json";
import lb4 from "./lessons-lb4.json";
import lb5 from "./lessons-lb5.json";
import lb6 from "./lessons-lb6.json";

export const LESSONS = [...lb1, ...lb2, ...lb3, ...lb4, ...lb5, ...lb6] as Lesson[];
export const CORE_LESSONS = LESSONS;
/** The six compulsory Lernbereiche; the optional bilingual LB 7 is not offered (see coverage.json). */
export const STAGES: Stage[] = [
  { lb: 1, title: "Planetarische Grundlagen im Zusammenhang mit Klima und Vegetation", shortTitle: "Planet, Klima, Zonen", icon: "☀", hours: 10 },
  { lb: 2, title: "Afrika südlich der Sahara", shortTitle: "Afrika südlich der Sahara", icon: "◍", hours: 11 },
  { lb: 3, title: "Nordafrika und westliches Asien", shortTitle: "Nordafrika und Westasien", icon: "◐", hours: 11 },
  { lb: 4, title: "Asiatisch-pazifische Inselwelt (ohne Japan)", shortTitle: "Asiatische Inselwelt", icon: "≈", hours: 10 },
  { lb: 5, title: "Japan und Australien im Vergleich", shortTitle: "Japan und Australien", icon: "⇄", hours: 10 },
  { lb: 6, title: "Aktuelle geographische Fragestellung", shortTitle: "Aktuelles Ereignis", icon: "✦", hours: 4 },
];

export const CURRICULUM_URL = "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/geographie";
/** Every link was opened on 2026-11-25 and its page title read; see docs/geographie-7-coverage.md. */
export const SOURCES: Source[] = [
  { id: "lehrplan", label: "LehrplanPLUS · Geographie 7 Realschule", url: CURRICULUM_URL },
  { id: "natural-earth", label: "Natural Earth · Kartengrundlage (Englisch)", url: "https://www.naturalearthdata.com/about/terms-of-use/" },
  { id: "ptb-zeit", label: "Physikalisch-Technische Bundesanstalt · Gesetzliche Zeit", url: "https://www.ptb.de/cms/ptb/fachabteilungen/abt4/fb-44/ag-441/darstellung-der-gesetzlichen-zeit.html" },
  { id: "dwd-foehn", label: "Deutscher Wetterdienst · Glossar: Föhn", url: "https://www.dwd.de/DE/service/lexikon/Functions/glossar.html?lv2=100784&lv3=100882" },
  { id: "aa-laender", label: "Auswärtiges Amt · Länderinformationen", url: "https://www.auswaertiges-amt.de/de/service/laender" },
  { id: "bmz-kongo", label: "BMZ · Demokratische Republik Kongo", url: "https://www.bmz.de/de/laender/demokratische-republik-kongo" },
  { id: "uba-elektro", label: "Umweltbundesamt · Elektroaltgeräte", url: "https://www.umweltbundesamt.de/themen/abfall-ressourcen/produktverantwortung-in-der-abfallwirtschaft/elektroaltgeraete" },
  { id: "hdr", label: "Vereinte Nationen · Index der menschlichen Entwicklung (Englisch)", url: "https://hdr.undp.org/data-center/human-development-index" },
  { id: "who-hiv", label: "Weltgesundheitsorganisation · HIV und AIDS (Englisch)", url: "https://www.who.int/news-room/fact-sheets/detail/hiv-aids" },
  { id: "destatis-int", label: "Statistisches Bundesamt · Internationale Statistik", url: "https://www.destatis.de/DE/Themen/Laender-Regionen/Internationales/_inhalt.html" },
  { id: "engagement", label: "Engagement Global · Entwicklungspolitisches Engagement", url: "https://www.engagement-global.de/" },
  { id: "handy-sammeln", label: "Handysammelcenter · Alte Handys sammeln", url: "https://www.handysammelcenter.de/" },
  { id: "fao-aquastat", label: "FAO AQUASTAT · Wasser und Landwirtschaft (Englisch)", url: "https://www.fao.org/aquastat/en/" },
  { id: "masdar", label: "Masdar City · Projektseite (Englisch)", url: "https://masdarcity.ae/" },
  { id: "wwf-palmoel", label: "WWF Deutschland · Palmöl", url: "https://www.wwf.de/themen-projekte/landwirtschaft/produkte-aus-der-landwirtschaft/palmoel" },
  { id: "geofon", label: "GFZ GEOFON · Aktuelle Erdbeben (Englisch)", url: "https://geofon.gfz.de/" },
  { id: "jma-tsunami", label: "Japanischer Wetterdienst · Tsunamiwarnungen (Englisch)", url: "https://www.data.jma.go.jp/eqev/data/en/tsunami/tsunami_warning.html" },
  { id: "stat-japan", label: "Statistikamt Japan (Englisch)", url: "https://www.stat.go.jp/english/" },
  { id: "abs", label: "Australisches Statistikamt (Englisch)", url: "https://www.abs.gov.au/" },
  { id: "geofon-banda", label: "GFZ GEOFON · Erdbeben in der Bandasee, 21. November 2026 (Englisch)", url: "https://geofon.gfz.de/eqinfo/event.php?id=gfz2026wusf" },
  { id: "erdbebennews-banda", label: "Erdbebennews · Bericht zum Beben in der Bandasee", url: "https://erdbebennews.de/2026/11/schweres-erdbeben-m6-8-erschuettert-osttimor-und-indonesien/" },
  { id: "klicksafe", label: "klicksafe · Desinformation erkennen", url: "https://www.klicksafe.de/desinformation-und-meinung" },
  { id: "tagesschau", label: "tagesschau.de · Nachrichten", url: "https://www.tagesschau.de/" },
];

export const findLesson = (id: string) => LESSONS.find((lesson) => lesson.id === id);
