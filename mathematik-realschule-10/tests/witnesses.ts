import type { LabValues } from "../src/model/types";
import { GOAL_WITNESSES_STAGE_1 } from "./witnesses-stage-1";
import { GOAL_WITNESSES_STAGE_2 } from "./witnesses-stage-2";
import { GOAL_WITNESSES_STAGE_3 } from "./witnesses-stage-3";
import { GOAL_WITNESSES_STAGE_4 } from "./witnesses-stage-4";
import { GOAL_WITNESSES_STAGE_5 } from "./witnesses-stage-5";
import { GOAL_WITNESSES_STAGE_6 } from "./witnesses-stage-6";
import { GOAL_WITNESSES_STAGE_7 } from "./witnesses-stage-7";
import { GOAL_WITNESSES_STAGE_8 } from "./witnesses-stage-8";

/**
 * ZAM cards (zam-academy:mathematik-realschule-10) cite these ids. Renaming a
 * lesson breaks every card that cites it: change the cell in the same step.
 */
export const LESSON_IDS = [
  "tr-1-einheitskreis",
  "tr-2-winkel-bis-360",
  "tr-3-steigungswinkel",
  "tr-4-sinusfunktion",
  "tr-5-kosinus-tangens",
  "tr-6-additionstheoreme",
  "dr-1-sinussatz",
  "dr-2-kosinussatz",
  "dr-3-flaecheninhalt",
  "dr-4-ebene-raum",
  "dr-5-gleichungen",
  "vk-1-vektoren",
  "vk-2-skalarprodukt",
  "vk-3-abstand",
  "ab-1-verschiebung-streckung",
  "ab-2-achsenspiegelung",
  "ab-3-drehung",
  "ab-4-determinante",
  "ab-5-traegergraph",
  "pt-1-potenzgesetze",
  "pt-2-wurzeln",
  "pt-3-potenzfunktionen",
  "pt-4-parameter",
  "pt-5-umkehrfunktion",
  "el-1-exponentialfunktion",
  "el-2-wachstum",
  "el-3-logarithmus",
  "el-4-logarithmensaetze",
  "el-5-exponentialfunktion-allgemein",
  "el-6-logarithmusfunktion",
  "ab-6-funktionsgraphen",
  "rg-1-axialschnitt",
  "rg-2-oberflaeche",
  "rg-3-volumen",
  "rg-4-zusammengesetzt",
  "rg-5-extremwerte",
  "qf-1-parabeln",
  "qf-2-scheitelpunkt",
  "qf-3-bestimmungsstuecke",
  "qf-4-extremwerte",
  "qf-5-loesungsformel",
  "qf-6-schnittpunkte",
  "dz-1-mehrstufig",
  "dz-2-pfadregeln",
  "dz-3-anwendungen",
];

/** Per lesson and lab goal, a setting that reaches the goal (see the stage files). */
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  ...GOAL_WITNESSES_STAGE_1,
  ...GOAL_WITNESSES_STAGE_2,
  ...GOAL_WITNESSES_STAGE_3,
  ...GOAL_WITNESSES_STAGE_4,
  ...GOAL_WITNESSES_STAGE_5,
  ...GOAL_WITNESSES_STAGE_6,
  ...GOAL_WITNESSES_STAGE_7,
  ...GOAL_WITNESSES_STAGE_8,
};

/**
 * Per lesson, the pinned teacher video: author and YouTube id, each checked
 * with YouTube oEmbed when chosen (src/curriculum/teacher-videos.ts). Every
 * lesson has one.
 */
export const EXPECTED_VIDEOS: Record<string, { author: string; id: string }> = {
  "tr-1-einheitskreis": { author: "MathemaTrick", id: "82WucXmm770" },
  "tr-2-winkel-bis-360": { author: "Realschulmathe", id: "6atwwOBZriw" },
  "tr-3-steigungswinkel": { author: "Koonys Schule", id: "7WY1NZfLZWo" },
  "tr-4-sinusfunktion": { author: "Daniel Jung", id: "T8kNcfv8LvY" },
  "tr-5-kosinus-tangens": { author: "Lernen - Leicht gemacht", id: "vypt8MMHmHU" },
  "tr-6-additionstheoreme": { author: "Lernen - Leicht gemacht", id: "zAQdXMdNOw8" },
  "dr-1-sinussatz": { author: "Daniel Jung", id: "jl3w0wGoWlY" },
  "dr-2-kosinussatz": { author: "Daniel Jung", id: "PaF_ClPIc_A" },
  "dr-3-flaecheninhalt": { author: "Lernen - Leicht gemacht", id: "ecyr76wmaLw" },
  "dr-4-ebene-raum": { author: "YOUR MODERN SCHOOL", id: "F0xOygTxp7M" },
  "dr-5-gleichungen": { author: "Lernen - Leicht gemacht", id: "Ytb0q7BrMCk" },
  "vk-1-vektoren": { author: "MathemaTrick", id: "R4nJTT60zU8" },
  "vk-2-skalarprodukt": { author: "Lernen - Leicht gemacht", id: "heHSqU2kXMY" },
  "vk-3-abstand": { author: "Lernen - Leicht gemacht", id: "08E5-R6qbDg" },
  "ab-1-verschiebung-streckung": { author: "Lernen - Leicht gemacht", id: "3ep4k3D0Dbs" },
  "ab-2-achsenspiegelung": { author: "Lernen - Leicht gemacht", id: "kjV4_GLnDQw" },
  "ab-3-drehung": { author: "Lernen - Leicht gemacht", id: "95N5jDrv6Tk" },
  "ab-4-determinante": { author: "BLACK-SHEEP-TEACHING", id: "8EdjSmWZMNI" },
  "ab-5-traegergraph": { author: "Lernen - Leicht gemacht", id: "mGZBMra2gDM" },
  "pt-1-potenzgesetze": { author: "MathemaTrick", id: "r73k0gX5vBI" },
  "pt-2-wurzeln": { author: "Daniel Jung", id: "NucUdbvOKIM" },
  "pt-3-potenzfunktionen": { author: "Daniel Jung", id: "OVWF5UATHVc" },
  "pt-4-parameter": { author: "Lernen - Leicht gemacht", id: "tXakBAAwzL4" },
  "pt-5-umkehrfunktion": { author: "Daniel Jung", id: "X8QDtWIWu6Q" },
  "el-1-exponentialfunktion": { author: "Daniel Jung", id: "mf4QfGCBHQQ" },
  "el-2-wachstum": { author: "Lehrerschmidt", id: "affn4KyXXFk" },
  "el-3-logarithmus": { author: "Lehrerschmidt", id: "f1tFVT0_Iz8" },
  "el-4-logarithmensaetze": { author: "MathemaTrick", id: "XyeZjk7fh-c" },
  "el-5-exponentialfunktion-allgemein": { author: "Daniel Jung", id: "kPgI2H0_N-U" },
  "el-6-logarithmusfunktion": { author: "MathePur", id: "2FH8DXiWMxs" },
  "ab-6-funktionsgraphen": { author: "Daniel Jung", id: "ZiR8V75xBlU" },
  "rg-1-axialschnitt": { author: "ObachtMathe", id: "Vw8mzvYzOj8" },
  "rg-2-oberflaeche": { author: "Lehrerschmidt", id: "2bTUdVtbsd8" },
  "rg-3-volumen": { author: "Mathe erklärt", id: "SYtVzZzbYuM" },
  "rg-4-zusammengesetzt": { author: "Daniel Jung", id: "dStxah0ZBcw" },
  "rg-5-extremwerte": { author: "Florian Daniek (physikspicker)", id: "XE5UkMQF4nU" },
  "qf-1-parabeln": { author: "Lehrerschmidt", id: "sYfZbyrGXMY" },
  "qf-2-scheitelpunkt": { author: "Lehrerschmidt", id: "0DXjdwpJ3S0" },
  "qf-3-bestimmungsstuecke": { author: "MathemaTrick", id: "0PtVRTIo-vc" },
  "qf-4-extremwerte": { author: "Daniel Jung", id: "G-Y_z65qvnM" },
  "qf-5-loesungsformel": { author: "Daniel Jung", id: "PD-wQ3nTh1E" },
  "qf-6-schnittpunkte": { author: "Lehrerschmidt", id: "rzm0jBm0cM4" },
  "dz-1-mehrstufig": { author: "Daniel Jung", id: "ZjEjYIqd8bo" },
  "dz-2-pfadregeln": { author: "Daniel Jung", id: "gw0AaVLkRE0" },
  "dz-3-anwendungen": { author: "Daniel Jung", id: "NryS4fyJ4sA" },
};
