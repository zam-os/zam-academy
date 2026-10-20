import type { Source, Stage } from "../model/types";

export const CURRICULUM_URL =
  "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/geschichte";
export const SOURCES: Source[] = [
  { id: "lehrplan", label: "ISB · LehrplanPLUS Geschichte 9 Realschule", url: CURRICULUM_URL },
  {
    id: "kolonien",
    label: "Deutsches Historisches Museum · Kolonialpolitik",
    url: "https://www.dhm.de/lemo/kapitel/kaiserreich/aussenpolitik/kolonialpolitik",
  },
  {
    id: "herero",
    label: "DHM · Kolonialkrieg und Völkermord an den Herero",
    url: "https://www.dhm.de/lemo/kapitel/kaiserreich/aussenpolitik/herero-krieg-1904",
  },
  {
    id: "nama",
    label: "DHM · Widerstand der Nama",
    url: "https://www.dhm.de/lemo/kapitel/kaiserreich/aussenpolitik/widerstand-der-nama",
  },
  {
    id: "wk1",
    label: "DHM · Erster Weltkrieg",
    url: "https://www.dhm.de/lemo/kapitel/erster-weltkrieg",
  },
  {
    id: "weimar",
    label: "DHM · Weimarer Republik",
    url: "https://www.dhm.de/lemo/kapitel/weimarer-republik",
  },
  {
    id: "demokratie",
    label: "DHM · Keine Chance für die Demokratie?",
    url: "https://www.dhm.de/bildung/ida/zwanzigstes-jahrhundert/weimar/",
  },
  { id: "ns", label: "DHM · NS-Regime", url: "https://www.dhm.de/lemo/kapitel/ns-regime" },
  {
    id: "gesetz",
    label: "USHMM · The Enabling Act (Beschluss 23., Veröffentlichung 24. März 1933)",
    url: "https://encyclopedia.ushmm.org/content/en/article/the-enabling-act",
  },
  {
    id: "dachau",
    label: "KZ-Gedenkstätte Dachau · KZ Dachau 1933–1945",
    url: "https://www.kz-gedenkstaette-dachau.de/historischer-ort/kz-dachau-1933-1945/",
  },
  {
    id: "wk2",
    label: "DHM · Zweiter Weltkrieg",
    url: "https://www.dhm.de/lemo/kapitel/zweiter-weltkrieg",
  },
  {
    id: "shoah",
    label: "United States Holocaust Memorial Museum · Introduction to the Holocaust",
    url: "https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust",
  },
  {
    id: "wannsee",
    label: "Haus der Wannsee-Konferenz · Besprechung am 20. Januar 1942",
    url: "https://www.ghwk.de/de/konferenz",
  },
  {
    id: "wandervogel",
    label: "DHM · Wandervogelbewegung",
    url: "https://www.dhm.de/lemo/kapitel/weimarer-republik/alltagsleben/wandervogelbewegung",
  },
  {
    id: "hj",
    label: "DHM · Hitler-Jugend",
    url: "https://www.dhm.de/lemo/kapitel/ns-regime/ns-organisationen/jugend",
  },
  {
    id: "un",
    label: "Vereinte Nationen · Entstehung der Menschenrechtserklärung",
    url: "https://www.un.org/en/about-us/udhr/history-of-the-declaration",
  },
  {
    id: "emrk",
    label: "Europäischer Gerichtshof für Menschenrechte · Konvention",
    url: "https://www.echr.coe.int/en/web/echr/european-convention-on-human-rights",
  },
  {
    id: "gg",
    label: "Bundesministerium der Justiz · Grundgesetz Artikel 1",
    url: "https://www.gesetze-im-internet.de/gg/art_1.html",
  },
  {
    id: "iwm1914",
    label: "Imperial War Museums · 4 August 1914",
    url: "https://www.iwm.org.uk/sites/default/files/press-release/4_August_1914_Factsheet.pdf",
  },
  {
    id: "civilrights",
    label: "U.S. National Park Service · The Modern Civil Rights Movement",
    url: "https://www.nps.gov/subjects/civilrights/modern-civil-rights-movement.htm",
  },
  {
    id: "selma",
    label: "U.S. National Park Service · Selma and voting rights",
    url: "https://www.nps.gov/semo/learn/historyculture/bloody-sunday.htm",
  },
  {
    id: "wels",
    label: "Bundesarchiv · Otto Wels und seine Rede vom 23. März 1933",
    url: "https://www.bundesarchiv.de/themen-entdecken/online-entdecken/geschichtsgalerien/otto-wels-freiheit-und-leben-kann-man-uns-nehmen-die-ehre-nicht/",
  },
  {
    id: "weimar-art1",
    label: "Weimarer Republik e. V. · Originalwortlaut von Artikel 1 der Verfassung 1919",
    url: "https://lernportal.weimarer-republik.net/lernmodule/die-weimarer-verfassung/artikel-die-vieles-aendern/parlamentarisches-regierungssystem/artikel-1/",
  },
  {
    id: "wahlen",
    label:
      "Bundeszentrale für politische Bildung · Weimarer Republik, Zeittafel und Wahlergebnisse",
    url: "https://www.bpb.de/shop/zeitschriften/izpb/weimarer-republik-346/333544/zeittafel/",
  },
];

export const STAGES: Stage[] = [
  {
    lb: 1,
    shortTitle: "Geschichte untersuchen",
    title: "Methoden und Arbeitstechniken",
    icon: "🔎",
  },
  {
    lb: 2,
    shortTitle: "Imperialismus & Weltkrieg",
    title: "Imperialismus und Erster Weltkrieg",
    icon: "🌍",
    hours: 16,
  },
  {
    lb: 3,
    shortTitle: "Demokratie in Weimar",
    title: "Weimarer Republik – die erste deutsche Demokratie",
    icon: "🏛️",
    hours: 10,
  },
  {
    lb: 4,
    shortTitle: "Die NS-Diktatur",
    title: "Nationalsozialismus – Ideologie und Politik bis 1939",
    icon: "⚖️",
    hours: 10,
  },
  {
    lb: 5,
    shortTitle: "Krieg, Verbrechen, Verantwortung",
    title:
      "Nationalsozialismus, Zweiter Weltkrieg und Holocaust – Schuld, Widerstand und Verantwortung",
    icon: "🕯️",
    hours: 10,
  },
  {
    lb: 6,
    shortTitle: "Jung sein im Wandel",
    title: "Jugend und Jugendkultur im Wandel der Zeit (Längsschnitt)",
    icon: "🎒",
    hours: 5,
  },
  {
    lb: 7,
    shortTitle: "Menschenrechte",
    title: "Menschenrechte – Rechte für alle Menschen (Längsschnitt)",
    icon: "🤝",
    hours: 5,
  },
  {
    lb: 8,
    shortTitle: "History in English",
    title: "Bilingualer Sachfachunterricht (optional)",
    icon: "💬",
    optional: true,
  },
];
