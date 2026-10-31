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
 * Per lesson, the pinned teacher video: author, YouTube id, and oEmbed title.
 * Each video was verified for playability (playabilityStatus: OK) and matches
 * the Bavarian Realschule LehrplanPLUS grade 8 curriculum.
 */
export const EXPECTED_VIDEOS: Record<string, { author: string; id: string; title: string }> = {
  "dv-1-dreiecksexistenz": { author: "Lernen - Leicht gemacht", id: "qEE-EIEwQos", title: "Seiten-Winkel-Beziehung und Dreiecksungleichung" },
  "dv-2-dreieckskonstruktion": { author: "Lehrerschmidt", id: "QiCtSIUDjGI", title: "SSS - SWS - WSW - SSW -Komplettvideo- Dreiecke konstruieren | Geometrie | Lehrerschmidt" },
  "dv-3-kongruenz": { author: "mathelex", id: "iGYSWLBsTx0", title: "Welche Angaben machen Dreiecke eindeutig? (SSS, SWS, WSW, SSW) | Kongruenzsätze" },
  "dv-4-vierecke": { author: "Lernen - Leicht gemacht", id: "weI6YhmQOr4", title: "Haus der Vierecke" },
  "dv-5-viereckskonstruktion": { author: "Lernen - Leicht gemacht", id: "SZZO4A9LY48", title: "Parallelogramme konstruieren" },
  "dv-6-vierecke-anwenden": { author: "Mathe by Daniel Jung", id: "PwCfQIH0NkU", title: "Flächen, Umfang, Quadrat, Rechteck, Raute, Trapez, Drachen, Parallelogramm, Übersicht" },
  "dr-1-drehung": { author: "einfach Schule", id: "nd_SmAur7xg", title: "Drehung um Z | einfach erklärt" },
  "dr-2-punktspiegelung": { author: "ObachtMathe", id: "DjO6oWtqr_I", title: "punktsymmetrische Figuren | ganz einfach erklärt | Symmetriezentrum | Punktspiegelung | ObachtMathe" },
  "dr-3-vektoren": { author: "Lernen - Leicht gemacht", id: "tM30Nr8Toz0", title: "Die 90°-Drehung im Koordinatensystem" },
  "rg-1-koerpersymmetrie": { author: "Schäfer_Kanal", id: "b1FNCF_hz0Y", title: "M 6c  - Symmetrie bei Körpern" },
  "rg-2-axialschnitte": { author: "ObachtMathe", id: "Vw8mzvYzOj8", title: "Rotationskörper & Axialschnitte | ganz einfach erklärt | Raumgeometrie | #obachtmathe" },
  "rg-3-raumkoordinaten": { author: "Frau Mh", id: "48l6M9cxHsA", title: "Einführung 3D Koordinatensystem" },
  "rg-4-koerper-koordinaten": { author: "MatheMystik", id: "JgvPr-yYt1s", title: "Pyramide zeichnen, Eckpunkte angeben, dreidimensional" },
  "rg-5-schraegbilder": { author: "Lernen - Leicht gemacht", id: "dV6wGUgoqT0", title: "Schrägbilder zeichnen" },
  "rg-6-wahre-groesse": { author: "Lernen - Leicht gemacht", id: "BhUI23PbKK4", title: "Schrägbilder: Strecken und Winkel in wahrer Größe" },
  "tg-1-terme": { author: "Lehrerschmidt", id: "_vN7NXvQbKE", title: "Terme vereinfachen und zusammenfassen - einfach erklärt | Lehrerschmidt" },
  "tg-2-ausmultiplizieren": { author: "Lehrerschmidt", id: "GGo7qilf340", title: "zwei Klammern miteinander multiplizieren | Terme und Gleichungen | Lehrerschmidt" },
  "tg-3-binomische-formeln": { author: "Lehrerschmidt", id: "HbfGc8Y_VFM", title: "Die binomischen Formeln - eine kurze Erklärung | Lehrerschmidt" },
  "tg-4-faktorisieren": { author: "MathemaTrick", id: "wXsBiLTvI9E", title: "BINOMISCHE FORMELN rückwärts anwenden einfach erklärt – faktorisieren, Beispiele" },
  "tg-5-extremwerte": { author: "Mathecheckahhh", id: "xdSkbsHxvOU", title: "Quadratische Ergänzung   8  Klasse Realschule Bayern" },
  "tg-6-extremwertprobleme": { author: "Mathe by Daniel Jung", id: "G-Y_z65qvnM", title: "Extremwertproblem ohne Ableitung | Mathe by Daniel Jung" },
  "tg-7-gleichungen": { author: "Sebastian Stoll (180grad-flip)", id: "HVUHSwmBstk", title: "Gleichungen mit Klammern - Binomische Formeln" },
  "tg-8-sachaufgaben": { author: "Mathe by Daniel Jung", id: "0qeNOXhn3qk", title: "Textaufgaben, Gleichung, Beispiel, Mathevokabeln erkannt-Gefahr gebannt | Mathe by Daniel Jung" },
  "tg-9-ungleichungen": { author: "MathemaTrick", id: "HP5LSJPBxus", title: "UNGLEICHUNGEN lösen – Lösungsmenge angeben, lineare Ungleichung Beispiele" },
  "br-1-bruchterme": { author: "Lehrerschmidt", id: "UIHUhlhyevI", title: "Bruchterme | Terme und Gleichungen | Mathematik - einfach erklärt | Lehrerschmidt" },
  "br-2-definitionsmenge": { author: "MathemaTrick", id: "nCeR8r6dblM", title: "BRUCHTERME DEFINITIONSMENGE bestimmen – gebrochen rationale Funktion" },
  "br-3-verhaeltnisgleichungen": { author: "Sebastian Schmidt", id: "nMqHhrOqH_g", title: "8.5.5 Bruchgleichungen" },
  "fu-1-funktionen": { author: "Mathe by Daniel Jung", id: "0LMjbej7bP0", title: "Funktion ja oder nein? Einem X-Wert wird ein Y-Wert zugeordnet! | Mathe by Daniel Jung" },
  "fu-2-darstellungen": { author: "Mathe by Daniel Jung", id: "HCl5PCBd9c8", title: "Zuordnungsvorschrift, Wertetabelle, Zuordnung | Mathe by Daniel Jung" },
  "fu-3-werte-nullstellen": { author: "Lehrerschmidt", id: "gbAx4WzT0pI", title: "lineare Funktion - Nullstelle berechnen | Lehrerschmidt" },
  "fu-4-ursprungsgeraden": { author: "Mathe by Daniel Jung", id: "g0z2PtOb_sk", title: "Ursprungsgerade aufstellen, Funktion durch den Ursprung | Mathe by Daniel Jung" },
  "fu-5-senkrecht": { author: "Lernen - Leicht gemacht", id: "ro-UF-Hsyhw", title: "Orthogonale (senkrechte) Ursprungsgeraden" },
  "fu-6-geraden": { author: "Lehrerschmidt", id: "4aUyOgoYJpc", title: "lineare Funktion ablesen & lineare Funktion bestimmen | Lehrerschmidt" },
  "fu-7-geraden-bestimmen": { author: "Lehrerschmidt", id: "jf4DrqcXdKQ", title: "lineare Funktion - Funktionsgleichung aus zwei Punkten bestimmen" },
  "fu-8-parallelenscharen": { author: "Sebastian Schmidt", id: "dcOnGYLKbIk", title: "4.8 Parallelenschar" },
  "fu-9-anwendungen": { author: "MathemaTrick", id: "Q733CvZN8w0", title: "LINEARE GLEICHUNG aufstellen Textaufgabe Strom – TARIF VERGLEICHEN – einfach erklärt" },
  "fu-10-flaechen": { author: "Tine Schmidt", id: "WwHEB_6GUDc", title: "Flächeninhalt mit der Determinante berechnen" },
  "dz-1-ergebnis-ereignis": { author: "einfach Schule", id: "TPh8p6qVMGg", title: "Ergebnis vs. Ereignis | Wahrscheinlichkeitsrechnung" },
  "dz-2-baumdiagramm": { author: "Lehrerschmidt", id: "mBknBnww5fA", title: "Baumdiagramm | mehrstufiger Zufallsversuch | Wahrscheinlichkeit | Stochastik | Lehrerschmidt" },
  "dz-3-vierfeldertafel": { author: "Mathe by Daniel Jung", id: "xslCG8xjGjI", title: "4-Felder-Tafel in der Stochastik | Mathe by Daniel Jung" },
  "dz-4-haeufigkeiten": { author: "Lehrerschmidt", id: "PBRoDcPymec", title: "absolute Häufigkeit & relative Häufigkeit | Wahrscheinlichkeit - einfach erklärt | Lehrerschmidt" },
};
