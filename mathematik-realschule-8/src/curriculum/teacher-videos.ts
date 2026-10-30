import type { TeacherVideo } from "../model/types";

const watch = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/**
 * Teacher explainer videos, chosen after the lessons were written. For each
 * one YouTube oEmbed returned the title and channel below (checked
 * 2026-10-30), and the title matches the lesson topic at Realschule level.
 */
export const TEACHER_VIDEOS: Record<string, TeacherVideo> = {
  "dv-1-dreiecksexistenz": { url: watch("qEE-EIEwQos"), title: "Seiten-Winkel-Beziehung und Dreiecksungleichung", author: "Lernen - Leicht gemacht" },
  "dv-2-dreieckskonstruktion": { url: watch("QiCtSIUDjGI"), title: "SSS - SWS - WSW - SSW -Komplettvideo- Dreiecke konstruieren | Geometrie | Lehrerschmidt", author: "Lehrerschmidt" },
  "dv-3-kongruenz": { url: watch("iGYSWLBsTx0"), title: "Welche Angaben machen Dreiecke eindeutig? (SSS, SWS, WSW, SSW) | Kongruenzsätze", author: "mathelex" },
  "dv-4-vierecke": { url: watch("weI6YhmQOr4"), title: "Haus der Vierecke", author: "Lernen - Leicht gemacht" },
  "dv-5-viereckskonstruktion": { url: watch("FCq1JEK4Xx0"), title: "Vierecke konstruieren", author: "Lernen - Leicht gemacht" },
  "dv-6-vierecke-anwenden": { url: watch("PwCfQIH0NkU"), title: "Flächen, Umfang, Quadrat, Rechteck, Raute, Trapez, Drachen, Parallelogramm, Übersicht", author: "Mathe by Daniel Jung" },
  "dr-1-drehung": { url: watch("nd_SmAur7xg"), title: "Drehung um Z | einfach erklärt", author: "einfach Schule" },
  "dr-2-punktspiegelung": { url: watch("REtG1CV9ujc"), title: "Punktspiegelung mit Zirkel und Geodreieck - Mathematik - einfach erklärt | Lehrerschmidt", author: "Lehrerschmidt" },
  "dr-3-vektoren": { url: watch("tM30Nr8Toz0"), title: "Die 90°-Drehung im Koordinatensystem", author: "Lernen - Leicht gemacht" },
  "rg-1-koerpersymmetrie": { url: watch("kFT9W0-uqJY"), title: "Symmetrieebenen und Körperachsen", author: "Learning by Doing" },
  "rg-2-axialschnitte": { url: watch("Vw8mzvYzOj8"), title: "Rotationskörper & Axialschnitte | ganz einfach erklärt | Raumgeometrie | #obachtmathe", author: "ObachtMathe" },
  "rg-3-raumkoordinaten": { url: watch("6DHotoiV7WU"), title: "Koordinatensystem mit 3 Achsen (Vektorgeometrie+Analysis) | Mathe by Daniel Jung", author: "Mathe by Daniel Jung" },
  "rg-4-koerper-koordinaten": { url: watch("GWtWimdfmgA"), title: "Würfel zeichnen und fehlende Koordinaten bestimmen | 3D, Vektorrechnung, Abitur", author: "Koonys Schule" },
  "rg-5-schraegbilder": { url: watch("dV6wGUgoqT0"), title: "Schrägbilder zeichnen", author: "Lernen - Leicht gemacht" },
  "rg-6-wahre-groesse": { url: watch("BhUI23PbKK4"), title: "Schrägbilder: Strecken und Winkel in wahrer Größe", author: "Lernen - Leicht gemacht" },
  "tg-1-terme": { url: watch("_vN7NXvQbKE"), title: "Terme vereinfachen und zusammenfassen - einfach erklärt | Lehrerschmidt", author: "Lehrerschmidt" },
  "tg-2-ausmultiplizieren": { url: watch("GGo7qilf340"), title: "zwei Klammern miteinander multiplizieren | Terme und Gleichungen | Lehrerschmidt", author: "Lehrerschmidt" },
  "tg-3-binomische-formeln": { url: watch("HbfGc8Y_VFM"), title: "Die binomischen Formeln - eine kurze Erklärung | Lehrerschmidt", author: "Lehrerschmidt" },
  "tg-4-faktorisieren": { url: watch("N8F9qLsE_98"), title: "Terme faktorisieren (ausklammern) | Terme und Gleichungen | Mathematik | Lehrerschmidt", author: "Lehrerschmidt" },
  "tg-5-extremwerte": { url: watch("hOg17k8VrQ8"), title: "Extremwerte quadratischer Terme", author: "Lernen - Leicht gemacht" },
  "tg-6-extremwertprobleme": { url: watch("G-Y_z65qvnM"), title: "Extremwertproblem ohne Ableitung | Mathe by Daniel Jung", author: "Mathe by Daniel Jung" },
  "tg-7-gleichungen": { url: watch("H8kah0htP2Q"), title: "Gleichungen mit Klammern | Terme und Gleichungen | Mathematik | Lehrerschmidt", author: "Lehrerschmidt" },
  "tg-8-sachaufgaben": { url: watch("0qeNOXhn3qk"), title: "Textaufgaben, Gleichung, Beispiel, Mathevokabeln erkannt-Gefahr gebannt | Mathe by Daniel Jung", author: "Mathe by Daniel Jung" },
  "tg-9-ungleichungen": { url: watch("HP5LSJPBxus"), title: "UNGLEICHUNGEN lösen – Lösungsmenge angeben, lineare Ungleichung Beispiele", author: "MathemaTrick" },
  "br-1-bruchterme": { url: watch("UIHUhlhyevI"), title: "Bruchterme | Terme und Gleichungen | Mathematik - einfach erklärt | Lehrerschmidt", author: "Lehrerschmidt" },
  "br-2-definitionsmenge": { url: watch("nCeR8r6dblM"), title: "BRUCHTERME DEFINITIONSMENGE bestimmen – gebrochen rationale Funktion", author: "MathemaTrick" },
  "br-3-verhaeltnisgleichungen": { url: watch("W17816CGFPc"), title: "einfache Bruchgleichungen lösen", author: "Lehrerschmidt" },
  "fu-1-funktionen": { url: watch("0LMjbej7bP0"), title: "Funktion ja oder nein? Einem X-Wert wird ein Y-Wert zugeordnet! | Mathe by Daniel Jung", author: "Mathe by Daniel Jung" },
  "fu-2-darstellungen": { url: watch("HCl5PCBd9c8"), title: "Zuordnungsvorschrift, Wertetabelle, Zuordnung | Mathe by Daniel Jung", author: "Mathe by Daniel Jung" },
  "fu-3-werte-nullstellen": { url: watch("gbAx4WzT0pI"), title: "lineare Funktion - Nullstelle berechnen | Lehrerschmidt", author: "Lehrerschmidt" },
  "fu-4-ursprungsgeraden": { url: watch("fN52WXY_72g"), title: "Steigungsdreieck bei einer linearen Funktion | Lehrerschmidt", author: "Lehrerschmidt" },
  "fu-5-senkrecht": { url: watch("fmfMzHcn2GI"), title: "ORTHOGONALE GERADEN – Senkrechte Gerade durch Punkt aufstellen, Steigung berechnen", author: "MathemaTrick" },
  "fu-6-geraden": { url: watch("4aUyOgoYJpc"), title: "lineare Funktion ablesen & lineare Funktion bestimmen | Lehrerschmidt", author: "Lehrerschmidt" },
  "fu-7-geraden-bestimmen": { url: watch("jf4DrqcXdKQ"), title: "lineare Funktion - Funktionsgleichung aus zwei Punkten bestimmen", author: "Lehrerschmidt" },
  "fu-8-parallelenscharen": { url: watch("dcOnGYLKbIk"), title: "4.8 Parallelenschar", author: "Sebastian Schmidt" },
  "fu-9-anwendungen": { url: watch("Q733CvZN8w0"), title: "LINEARE GLEICHUNG aufstellen Textaufgabe Strom – TARIF VERGLEICHEN – einfach erklärt", author: "MathemaTrick" },
  "fu-10-flaechen": { url: watch("8EdjSmWZMNI"), title: "9.3.8 Flächeninhalt Parallelogramm Dreieck mit der Determinante berechnen", author: "BLACK-SHEEP-TEACHING by Christian Schäfer" },
  "dz-1-ergebnis-ereignis": { url: watch("ssoO6nAhcQU"), title: "Zufallsexperiment, Zufallsversuch, Ergebnis, Ergebnismenge, Ergebnisraum | Mathe by Daniel Jung", author: "Mathe by Daniel Jung" },
  "dz-2-baumdiagramm": { url: watch("mBknBnww5fA"), title: "Baumdiagramm | mehrstufiger Zufallsversuch | Wahrscheinlichkeit | Stochastik | Lehrerschmidt", author: "Lehrerschmidt" },
  "dz-3-vierfeldertafel": { url: watch("xslCG8xjGjI"), title: "4-Felder-Tafel in der Stochastik | Mathe by Daniel Jung", author: "Mathe by Daniel Jung" },
  "dz-4-haeufigkeiten": { url: watch("PBRoDcPymec"), title: "absolute Häufigkeit & relative Häufigkeit | Wahrscheinlichkeit - einfach erklärt | Lehrerschmidt", author: "Lehrerschmidt" },
};
