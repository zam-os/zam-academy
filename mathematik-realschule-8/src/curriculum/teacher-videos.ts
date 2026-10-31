import type { TeacherVideo } from "../model/types";

const watch = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/**
 * Teacher explainer videos, chosen after the lessons were written. For each
 * one YouTube oEmbed returned the title and channel below (checked
 * 2026-10-31), and the title matches the lesson topic at Realschule level.
 */
export const TEACHER_VIDEOS: Record<string, TeacherVideo> = {
  "dv-1-dreiecksexistenz": { url: watch("qEE-EIEwQos"), title: "Seiten-Winkel-Beziehung und Dreiecksungleichung", author: "Lernen - Leicht gemacht" },
  "dv-2-dreieckskonstruktion": { url: watch("QiCtSIUDjGI"), title: "SSS - SWS - WSW - SSW -Komplettvideo- Dreiecke konstruieren | Geometrie | Lehrerschmidt", author: "Lehrerschmidt" },
  "dv-3-kongruenz": { url: watch("iGYSWLBsTx0"), title: "Welche Angaben machen Dreiecke eindeutig? (SSS, SWS, WSW, SSW) | Kongruenzsätze", author: "mathelex" },
  "dv-4-vierecke": { url: watch("weI6YhmQOr4"), title: "Haus der Vierecke", author: "Lernen - Leicht gemacht" },
  "dv-5-viereckskonstruktion": { url: watch("SZZO4A9LY48"), title: "Parallelogramme konstruieren", author: "Lernen - Leicht gemacht" },
  "dv-6-vierecke-anwenden": { url: watch("PwCfQIH0NkU"), title: "Flächen, Umfang, Quadrat, Rechteck, Raute, Trapez, Drachen, Parallelogramm, Übersicht", author: "Mathe by Daniel Jung" },
  "dr-1-drehung": { url: watch("nd_SmAur7xg"), title: "Drehung um Z | einfach erklärt", author: "einfach Schule" },
  "dr-2-punktspiegelung": { url: watch("DjO6oWtqr_I"), title: "punktsymmetrische Figuren | ganz einfach erklärt | Symmetriezentrum | Punktspiegelung | ObachtMathe", author: "ObachtMathe" },
  "dr-3-vektoren": { url: watch("tM30Nr8Toz0"), title: "Die 90°-Drehung im Koordinatensystem", author: "Lernen - Leicht gemacht" },
  "rg-1-koerpersymmetrie": { url: watch("b1FNCF_hz0Y"), title: "M 6c  - Symmetrie bei Körpern", author: "Schäfer_Kanal" },
  "rg-2-axialschnitte": { url: watch("Vw8mzvYzOj8"), title: "Rotationskörper & Axialschnitte | ganz einfach erklärt | Raumgeometrie | #obachtmathe", author: "ObachtMathe" },
  "rg-3-raumkoordinaten": { url: watch("48l6M9cxHsA"), title: "Einführung 3D Koordinatensystem", author: "Frau Mh" },
  "rg-4-koerper-koordinaten": { url: watch("JgvPr-yYt1s"), title: "Pyramide zeichnen, Eckpunkte angeben, dreidimensional", author: "MatheMystik" },
  "rg-5-schraegbilder": { url: watch("dV6wGUgoqT0"), title: "Schrägbilder zeichnen", author: "Lernen - Leicht gemacht" },
  "rg-6-wahre-groesse": { url: watch("BhUI23PbKK4"), title: "Schrägbilder: Strecken und Winkel in wahrer Größe", author: "Lernen - Leicht gemacht" },
  "tg-1-terme": { url: watch("_vN7NXvQbKE"), title: "Terme vereinfachen und zusammenfassen - einfach erklärt | Lehrerschmidt", author: "Lehrerschmidt" },
  "tg-2-ausmultiplizieren": { url: watch("GGo7qilf340"), title: "zwei Klammern miteinander multiplizieren | Terme und Gleichungen | Lehrerschmidt", author: "Lehrerschmidt" },
  "tg-3-binomische-formeln": { url: watch("HbfGc8Y_VFM"), title: "Die binomischen Formeln - eine kurze Erklärung | Lehrerschmidt", author: "Lehrerschmidt" },
  "tg-4-faktorisieren": { url: watch("wXsBiLTvI9E"), title: "BINOMISCHE FORMELN rückwärts anwenden einfach erklärt – faktorisieren, Beispiele", author: "MathemaTrick" },
  "tg-5-extremwerte": { url: watch("xdSkbsHxvOU"), title: "Quadratische Ergänzung   8  Klasse Realschule Bayern", author: "Mathecheckahhh" },
  "tg-6-extremwertprobleme": { url: watch("G-Y_z65qvnM"), title: "Extremwertproblem ohne Ableitung | Mathe by Daniel Jung", author: "Mathe by Daniel Jung" },
  "tg-7-gleichungen": { url: watch("HVUHSwmBstk"), title: "Gleichungen mit Klammern - Binomische Formeln", author: "Sebastian Stoll (180grad-flip)" },
  "tg-8-sachaufgaben": { url: watch("0qeNOXhn3qk"), title: "Textaufgaben, Gleichung, Beispiel, Mathevokabeln erkannt-Gefahr gebannt | Mathe by Daniel Jung", author: "Mathe by Daniel Jung" },
  "tg-9-ungleichungen": { url: watch("HP5LSJPBxus"), title: "UNGLEICHUNGEN lösen – Lösungsmenge angeben, lineare Ungleichung Beispiele", author: "MathemaTrick" },
  "br-1-bruchterme": { url: watch("UIHUhlhyevI"), title: "Bruchterme | Terme und Gleichungen | Mathematik - einfach erklärt | Lehrerschmidt", author: "Lehrerschmidt" },
  "br-2-definitionsmenge": { url: watch("nCeR8r6dblM"), title: "BRUCHTERME DEFINITIONSMENGE bestimmen – gebrochen rationale Funktion", author: "MathemaTrick" },
  "br-3-verhaeltnisgleichungen": { url: watch("nMqHhrOqH_g"), title: "8.5.5 Bruchgleichungen", author: "Sebastian Schmidt" },
  "fu-1-funktionen": { url: watch("0LMjbej7bP0"), title: "Funktion ja oder nein? Einem X-Wert wird ein Y-Wert zugeordnet! | Mathe by Daniel Jung", author: "Mathe by Daniel Jung" },
  "fu-2-darstellungen": { url: watch("HCl5PCBd9c8"), title: "Zuordnungsvorschrift, Wertetabelle, Zuordnung | Mathe by Daniel Jung", author: "Mathe by Daniel Jung" },
  "fu-3-werte-nullstellen": { url: watch("gbAx4WzT0pI"), title: "lineare Funktion - Nullstelle berechnen | Lehrerschmidt", author: "Lehrerschmidt" },
  "fu-4-ursprungsgeraden": { url: watch("g0z2PtOb_sk"), title: "Ursprungsgerade aufstellen, Funktion durch den Ursprung | Mathe by Daniel Jung", author: "Mathe by Daniel Jung" },
  "fu-5-senkrecht": { url: watch("ro-UF-Hsyhw"), title: "Orthogonale (senkrechte) Ursprungsgeraden", author: "Lernen - Leicht gemacht" },
  "fu-6-geraden": { url: watch("4aUyOgoYJpc"), title: "lineare Funktion ablesen & lineare Funktion bestimmen | Lehrerschmidt", author: "Lehrerschmidt" },
  "fu-7-geraden-bestimmen": { url: watch("jf4DrqcXdKQ"), title: "lineare Funktion - Funktionsgleichung aus zwei Punkten bestimmen", author: "Lehrerschmidt" },
  "fu-8-parallelenscharen": { url: watch("dcOnGYLKbIk"), title: "4.8 Parallelenschar", author: "Sebastian Schmidt" },
  "fu-9-anwendungen": { url: watch("Q733CvZN8w0"), title: "LINEARE GLEICHUNG aufstellen Textaufgabe Strom – TARIF VERGLEICHEN – einfach erklärt", author: "MathemaTrick" },
  "fu-10-flaechen": { url: watch("WwHEB_6GUDc"), title: "Flächeninhalt mit der Determinante berechnen", author: "Tine Schmidt" },
  "dz-1-ergebnis-ereignis": { url: watch("TPh8p6qVMGg"), title: "Ergebnis vs. Ereignis | Wahrscheinlichkeitsrechnung", author: "einfach Schule" },
  "dz-2-baumdiagramm": { url: watch("mBknBnww5fA"), title: "Baumdiagramm | mehrstufiger Zufallsversuch | Wahrscheinlichkeit | Stochastik | Lehrerschmidt", author: "Lehrerschmidt" },
  "dz-3-vierfeldertafel": { url: watch("xslCG8xjGjI"), title: "4-Felder-Tafel in der Stochastik | Mathe by Daniel Jung", author: "Mathe by Daniel Jung" },
  "dz-4-haeufigkeiten": { url: watch("PBRoDcPymec"), title: "absolute Häufigkeit & relative Häufigkeit | Wahrscheinlichkeit - einfach erklärt | Lehrerschmidt", author: "Lehrerschmidt" },
};
