import type { Track } from "../src/model/types";

/**
 * ZAM cards (zam-academy:mathematik-realschule-8) cite these ids. Renaming a
 * lesson breaks every card that cites it: change the cell in the same step.
 */
export const LESSON_IDS = [
  "dv-1-dreiecksexistenz",
  "dv-2-dreieckskonstruktion",
  "dv-3-kongruenz",
  "dv-4-vierecke",
  "dv-5-viereckskonstruktion",
  "dv-6-vierecke-anwenden",
  "dr-1-drehung",
  "dr-2-punktspiegelung",
  "dr-3-vektoren",
  "rg-1-koerpersymmetrie",
  "rg-2-axialschnitte",
  "rg-3-raumkoordinaten",
  "rg-4-koerper-koordinaten",
  "rg-5-schraegbilder",
  "rg-6-wahre-groesse",
  "tg-1-terme",
  "tg-2-ausmultiplizieren",
  "tg-3-binomische-formeln",
  "tg-4-faktorisieren",
  "tg-5-extremwerte",
  "tg-6-extremwertprobleme",
  "tg-7-gleichungen",
  "tg-8-sachaufgaben",
  "tg-9-ungleichungen",
  "br-1-bruchterme",
  "br-2-definitionsmenge",
  "br-3-verhaeltnisgleichungen",
  "fu-1-funktionen",
  "fu-2-darstellungen",
  "fu-3-werte-nullstellen",
  "fu-4-ursprungsgeraden",
  "fu-5-senkrecht",
  "fu-6-geraden",
  "fu-7-geraden-bestimmen",
  "fu-8-parallelenscharen",
  "fu-9-anwendungen",
  "fu-10-flaechen",
  "dz-1-ergebnis-ereignis",
  "dz-2-baumdiagramm",
  "dz-3-vierfeldertafel",
  "dz-4-haeufigkeiten",
];

/**
 * LehrplanPLUS Mathematik 8 (Realschule): the Lernbereich of each lesson
 * family per Zweig. Zweig I: LB 1 Vierecke, LB 2 Drehung, LB 3 Raumgeometrie,
 * LB 4 Terme, Gleichungen und Ungleichungen, LB 5 Bruchterme, LB 6
 * Funktionen, LB 7 Daten und Zufall. Zweig II/III: LB 1 Dreiecke und
 * Vierecke, LB 2 Raumgeometrie, LB 3 Terme und Gleichungen, LB 4 Bruchterme,
 * LB 5 Funktionen, LB 6 Daten und Zufall.
 */
export const LERNBEREICH: Record<string, Partial<Record<Track, number>>> = {
  dv: { I: 1, II_III: 1 },
  dr: { I: 2 },
  rg: { I: 3, II_III: 2 },
  tg: { I: 4, II_III: 3 },
  br: { I: 5, II_III: 4 },
  fu: { I: 6, II_III: 5 },
  dz: { I: 7, II_III: 6 },
};

/**
 * The lessons one Zweig does not have: Zweig I learnt triangles and
 * Schrägbilder in M7, Zweig II/III has no Drehung, no space coordinates, no
 * Ungleichungen and meets y = mx + t only in M9.
 */
export const ONLY_I = [
  "dr-1-drehung",
  "dr-2-punktspiegelung",
  "dr-3-vektoren",
  "rg-1-koerpersymmetrie",
  "rg-2-axialschnitte",
  "rg-3-raumkoordinaten",
  "rg-4-koerper-koordinaten",
  "tg-9-ungleichungen",
  "fu-6-geraden",
  "fu-7-geraden-bestimmen",
  "fu-8-parallelenscharen",
  "fu-9-anwendungen",
  "fu-10-flaechen",
];
export const ONLY_II_III = ["dv-1-dreiecksexistenz", "dv-2-dreieckskonstruktion", "dv-3-kongruenz", "rg-5-schraegbilder", "rg-6-wahre-groesse"];

/**
 * Per lesson, the pinned teacher video: author and YouTube id, each checked
 * with YouTube oEmbed when chosen. Videos are added in a later step
 * (AGENTS.md, section 4); lessons without an entry have none yet.
 */
export const EXPECTED_VIDEOS: Record<string, { author: string; id: string }> = {};
