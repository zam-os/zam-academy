import type { TeacherVideo } from "../model/types";

const watch = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/**
 * Teacher explainer videos, chosen after the lessons were written. For each
 * one YouTube's oEmbed returned the title and channel below (checked
 * 2026-10-22), and the title matches the lesson's topic at Realschule level
 * (degrees, no radians). The four added last (tr-5, tr-6, pt-4, rg-5) were
 * also checked frame by frame in YouTube's storyboard; the rg-5 video works
 * the physikspicker task sheet "Ma 10 II III Raumgeometrie", page 6, task 3.
 */
export const TEACHER_VIDEOS: Record<string, TeacherVideo> = {
  "tr-1-einheitskreis": { url: watch("82WucXmm770"), title: "Sinus und Kosinus am Einheitskreis – einfach erklärt", author: "MathemaTrick" },
  "tr-2-winkel-bis-360": { url: watch("6atwwOBZriw"), title: "Einheitskreis - negativer Winkel und Supplementbeziehung", author: "Realschulmathe" },
  "tr-3-steigungswinkel": { url: watch("7WY1NZfLZWo"), title: "Schnittwinkel zwischen 2 Geraden - 3 Fälle eine Formel | Tangens, Mathe, Klasse 8", author: "Koonys Schule" },
  "tr-4-sinusfunktion": { url: watch("T8kNcfv8LvY"), title: "Sinus-/Kosinusfunktion verdeutlicht mit Einheitskreis, Kreisfunktionen | Mathe by Daniel Jung", author: "Daniel Jung" },
  "tr-5-kosinus-tangens": { url: watch("vypt8MMHmHU"), title: "Zusammenhänge Trigonometrie - Goniometrische Grundformeln / Komplementbeziehungen", author: "Lernen - Leicht gemacht" },
  "tr-6-additionstheoreme": { url: watch("zAQdXMdNOw8"), title: "Additionstheoreme", author: "Lernen - Leicht gemacht" },
  "dr-1-sinussatz": { url: watch("jl3w0wGoWlY"), title: "Sinussatz, erkennen, aufstellen, anwenden, Trigonometrie | Mathe by Daniel Jung", author: "Daniel Jung" },
  "dr-2-kosinussatz": { url: watch("PaF_ClPIc_A"), title: "Kosinussatz erkennen, aufstellen, Trigonometrie | Mathe by Daniel Jung", author: "Daniel Jung" },
  "dr-3-flaecheninhalt": { url: watch("ecyr76wmaLw"), title: "Flächeninhalt im Dreieck (Sinusformel)", author: "Lernen - Leicht gemacht" },
  "dr-4-ebene-raum": { url: watch("F0xOygTxp7M"), title: "Winkel in einer Pyramide berechnen I Trigonometrie I Textaufgabe", author: "YOUR MODERN SCHOOL" },
  "dr-5-gleichungen": { url: watch("Ytb0q7BrMCk"), title: "Trägergraph (Winkelmaß)", author: "Lernen - Leicht gemacht" },
  "vk-1-vektoren": { url: watch("R4nJTT60zU8"), title: "Grundlagen VEKTOREN – Einstieg Vektorgeometrie einfach erklärt", author: "MathemaTrick" },
  "vk-2-skalarprodukt": { url: watch("heHSqU2kXMY"), title: "Winkel zwischen Vektoren (Skalarprodukt)", author: "Lernen - Leicht gemacht" },
  "vk-3-abstand": { url: watch("08E5-R6qbDg"), title: "Abstand eines Punktes von einer Geraden (Skalarprodukt)", author: "Lernen - Leicht gemacht" },
  "ab-1-verschiebung-streckung": { url: watch("3ep4k3D0Dbs"), title: "3.3a Zentrische Streckung mithilfe von Vektoren", author: "Lernen - Leicht gemacht" },
  "ab-2-achsenspiegelung": { url: watch("kjV4_GLnDQw"), title: "7.4 Spiegelung an einer Ursprungsgeraden", author: "Lernen - Leicht gemacht" },
  "ab-3-drehung": { url: watch("95N5jDrv6Tk"), title: "Drehung (um den Ursprung) und Drehmatrix", author: "Lernen - Leicht gemacht" },
  "ab-4-determinante": { url: watch("8EdjSmWZMNI"), title: "9.3.8 Flächeninhalt Parallelogramm Dreieck mit der Determinante berechnen", author: "BLACK-SHEEP-TEACHING" },
  "ab-5-traegergraph": { url: watch("mGZBMra2gDM"), title: "4.8 Der Trägergraph", author: "Lernen - Leicht gemacht" },
  "pt-1-potenzgesetze": { url: watch("r73k0gX5vBI"), title: "Potenzen mit RATIONALEN EXPONENTEN – Wurzelschreibweise, Potenzschreibweise, Wurzeln", author: "MathemaTrick" },
  "pt-2-wurzeln": { url: watch("NucUdbvOKIM"), title: "Wurzel und Potenzen, Beispiele, umschreiben, Zusammenfassen | Mathe by Daniel Jung", author: "Daniel Jung" },
  "pt-3-potenzfunktionen": { url: watch("OVWF5UATHVc"), title: "Potenzfunktionen Übersicht, Basis, Exponent, Verlauf | Mathe by Daniel Jung", author: "Daniel Jung" },
  "pt-4-parameter": { url: watch("tXakBAAwzL4"), title: "Graphen von Potenzfunktionen", author: "Lernen - Leicht gemacht" },
  "pt-5-umkehrfunktion": { url: watch("X8QDtWIWu6Q"), title: "Ablauf Umkehrfunktion bestimmen | Mathe by Daniel Jung", author: "Daniel Jung" },
  "el-1-exponentialfunktion": { url: watch("mf4QfGCBHQQ"), title: "Lineares und Exponentielles Wachstum, Übersicht, Unterschiede, Exponentialfunktionen", author: "Daniel Jung" },
  "el-2-wachstum": { url: watch("affn4KyXXFk"), title: "Wachstum und Zerfall - Mathematik - einfach erklärt | Lehrerschmidt", author: "Lehrerschmidt" },
  "el-3-logarithmus": { url: watch("f1tFVT0_Iz8"), title: "Logarithmus - einfach erklärt 10^x = 1000 | Lehrerschmidt", author: "Lehrerschmidt" },
  "el-4-logarithmensaetze": { url: watch("XyeZjk7fh-c"), title: "LOGARITHMENGESETZE anwenden einfach erklärt – Logarithmus zusammenfassen, Beispiele", author: "MathemaTrick" },
  "el-5-exponentialfunktion-allgemein": { url: watch("kPgI2H0_N-U"), title: "Exponentialfunktionen, Transformation, Veränderung | Mathe by Daniel Jung", author: "Daniel Jung" },
  "el-6-logarithmusfunktion": { url: watch("2FH8DXiWMxs"), title: "die Logarithmusfunktion Graph skizzieren und Funktionsgleichung ablesen", author: "MathePur" },
  "ab-6-funktionsgraphen": { url: watch("ZiR8V75xBlU"), title: "Transformation von Funktionen, Entwicklung, Übersicht, Graphen verändern | Mathe by Daniel Jung", author: "Daniel Jung" },
  "rg-1-axialschnitt": { url: watch("Vw8mzvYzOj8"), title: "Rotationskörper & Axialschnitte | ganz einfach erklärt | Raumgeometrie | #obachtmathe", author: "ObachtMathe" },
  "rg-2-oberflaeche": { url: watch("2bTUdVtbsd8"), title: "Kegel - Oberfläche berechnen | Geometrische Körper | Mathematik - einfach erklärt | Lehrerschmidt", author: "Lehrerschmidt" },
  "rg-3-volumen": { url: watch("SYtVzZzbYuM"), title: "Das Prinzip des Cavalieri: Mathe erklärt von Lars Jung", author: "Mathe erklärt" },
  "rg-4-zusammengesetzt": { url: watch("dStxah0ZBcw"), title: "Körper, mehrere zusammengebastelt, Volumen, Oberfläche bestimmen | Mathe by Daniel Jung", author: "Daniel Jung" },
  "rg-5-extremwerte": { url: watch("XE5UkMQF4nU"), title: "Ma 10 II Raumgeometrie - Kreiskegel mit einbeschriebenem Zylinder | Aufgabe 3", author: "Florian Daniek (physikspicker)" },
  "qf-1-parabeln": { url: watch("sYfZbyrGXMY"), title: "Parabeln - quadratische Funktionen - Verschiebungen - einfach erklärt | Lehrerschmidt", author: "Lehrerschmidt" },
  "qf-2-scheitelpunkt": { url: watch("0DXjdwpJ3S0"), title: "quadratische Ergänzung - von der Normalform zur Scheitelpunktform | Lehrerschmidt", author: "Lehrerschmidt" },
  "qf-3-bestimmungsstuecke": { url: watch("0PtVRTIo-vc"), title: "PARABEL aufstellen mit Scheitelpunkt – Funktionsgleichung", author: "MathemaTrick" },
  "qf-4-extremwerte": { url: watch("G-Y_z65qvnM"), title: "Extremwertproblem ohne Ableitung | Mathe by Daniel Jung", author: "Daniel Jung" },
  "qf-5-loesungsformel": { url: watch("PD-wQ3nTh1E"), title: "Diskriminante bei PQ-Formel, ABC-Formel, Mitternachtsformel | Mathe by Daniel Jung", author: "Daniel Jung" },
  "qf-6-schnittpunkte": { url: watch("rzm0jBm0cM4"), title: "Schnittpunkt(e) einer quadratischen und einer linearen Funktion zeichnen und berechnen", author: "Lehrerschmidt" },
  "dz-1-mehrstufig": { url: watch("ZjEjYIqd8bo"), title: "Baumdiagramm, ohne Zurücklegen, Wahrscheinlichkeit | Mathe by Daniel Jung", author: "Daniel Jung" },
  "dz-2-pfadregeln": { url: watch("gw0AaVLkRE0"), title: "1. & 2. Pfadregel in der Wahrscheinlichkeitsrechnung | Mathe by Daniel Jung", author: "Daniel Jung" },
  "dz-3-anwendungen": { url: watch("NryS4fyJ4sA"), title: "3M-Aufgabe (dreimal-mindestens Aufgabe) | Stochastik | Mathe by Daniel Jung", author: "Daniel Jung" },
};
