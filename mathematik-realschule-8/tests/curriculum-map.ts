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
export const EXPECTED_VIDEOS: Record<string, { author: string; id: string }> = {
  "dv-1-dreiecksexistenz": { author: "Lernen - Leicht gemacht", id: "qEE-EIEwQos" },
  "dv-2-dreieckskonstruktion": { author: "Lehrerschmidt", id: "QiCtSIUDjGI" },
  "dv-3-kongruenz": { author: "mathelex", id: "iGYSWLBsTx0" },
  "dv-4-vierecke": { author: "Lernen - Leicht gemacht", id: "weI6YhmQOr4" },
  "dv-5-viereckskonstruktion": { author: "Lernen - Leicht gemacht", id: "FCq1JEK4Xx0" },
  "dv-6-vierecke-anwenden": { author: "Mathe by Daniel Jung", id: "PwCfQIH0NkU" },
  "dr-1-drehung": { author: "einfach Schule", id: "nd_SmAur7xg" },
  "dr-2-punktspiegelung": { author: "Lehrerschmidt", id: "REtG1CV9ujc" },
  "dr-3-vektoren": { author: "Lernen - Leicht gemacht", id: "tM30Nr8Toz0" },
  "rg-1-koerpersymmetrie": { author: "Learning by Doing", id: "kFT9W0-uqJY" },
  "rg-2-axialschnitte": { author: "ObachtMathe", id: "Vw8mzvYzOj8" },
  "rg-3-raumkoordinaten": { author: "Mathe by Daniel Jung", id: "6DHotoiV7WU" },
  "rg-4-koerper-koordinaten": { author: "Koonys Schule", id: "GWtWimdfmgA" },
  "rg-5-schraegbilder": { author: "Lernen - Leicht gemacht", id: "dV6wGUgoqT0" },
  "rg-6-wahre-groesse": { author: "Lernen - Leicht gemacht", id: "BhUI23PbKK4" },
  "tg-1-terme": { author: "Lehrerschmidt", id: "_vN7NXvQbKE" },
  "tg-2-ausmultiplizieren": { author: "Lehrerschmidt", id: "GGo7qilf340" },
  "tg-3-binomische-formeln": { author: "Lehrerschmidt", id: "HbfGc8Y_VFM" },
  "tg-4-faktorisieren": { author: "Lehrerschmidt", id: "N8F9qLsE_98" },
  "tg-5-extremwerte": { author: "Lernen - Leicht gemacht", id: "hOg17k8VrQ8" },
  "tg-6-extremwertprobleme": { author: "Mathe by Daniel Jung", id: "G-Y_z65qvnM" },
  "tg-7-gleichungen": { author: "Lehrerschmidt", id: "H8kah0htP2Q" },
  "tg-8-sachaufgaben": { author: "Mathe by Daniel Jung", id: "0qeNOXhn3qk" },
  "tg-9-ungleichungen": { author: "MathemaTrick", id: "HP5LSJPBxus" },
  "br-1-bruchterme": { author: "Lehrerschmidt", id: "UIHUhlhyevI" },
  "br-2-definitionsmenge": { author: "MathemaTrick", id: "nCeR8r6dblM" },
  "br-3-verhaeltnisgleichungen": { author: "Lehrerschmidt", id: "W17816CGFPc" },
  "fu-1-funktionen": { author: "Mathe by Daniel Jung", id: "0LMjbej7bP0" },
  "fu-2-darstellungen": { author: "Mathe by Daniel Jung", id: "HCl5PCBd9c8" },
  "fu-3-werte-nullstellen": { author: "Lehrerschmidt", id: "gbAx4WzT0pI" },
  "fu-4-ursprungsgeraden": { author: "Lehrerschmidt", id: "fN52WXY_72g" },
  "fu-5-senkrecht": { author: "MathemaTrick", id: "fmfMzHcn2GI" },
  "fu-6-geraden": { author: "Lehrerschmidt", id: "4aUyOgoYJpc" },
  "fu-7-geraden-bestimmen": { author: "Lehrerschmidt", id: "jf4DrqcXdKQ" },
  "fu-8-parallelenscharen": { author: "Sebastian Schmidt", id: "dcOnGYLKbIk" },
  "fu-9-anwendungen": { author: "MathemaTrick", id: "Q733CvZN8w0" },
  "fu-10-flaechen": { author: "BLACK-SHEEP-TEACHING by Christian Schäfer", id: "8EdjSmWZMNI" },
  "dz-1-ergebnis-ereignis": { author: "Mathe by Daniel Jung", id: "ssoO6nAhcQU" },
  "dz-2-baumdiagramm": { author: "Lehrerschmidt", id: "mBknBnww5fA" },
  "dz-3-vierfeldertafel": { author: "Mathe by Daniel Jung", id: "xslCG8xjGjI" },
  "dz-4-haeufigkeiten": { author: "Lehrerschmidt", id: "PBRoDcPymec" },
};
