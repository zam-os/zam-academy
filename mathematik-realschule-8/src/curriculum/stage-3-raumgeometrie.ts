import { fmt, fmtUnit, len, lenText } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  AXIAL_FIGURES,
  axialBody,
  axialHeight,
  axialSectionName,
  axialSlant,
  axialWidth,
  drawnAngle,
  OBLIQUE_NAMES,
  obliqueDims,
  obliqueTrueSize,
  qText,
  SOLID_NAMES,
  solidTop,
  solidTopText,
  solidVertices,
  TRUE_BODIES,
  TRUE_FIGURES,
  trueFigure,
  hasCentre,
  locationOf,
  pictureDistance,
  point3,
  SYM_BODY_NAMES,
  SYM_CANDIDATES,
  symCandidateName,
  symImageText,
  symmetryOf,
  symVerdict,
  vec,
} from "../lab/views-raumgeometrie";
import type { ChoiceField, ExerciseTask, Lesson, Stage } from "../model/types";
import { choiceField, numberField, yesNo } from "./helpers";

const STAGE_ID = "stage-3-raumgeometrie";
const LP_I = "M8 LB 3 (I)";
const LP_II = "M8 LB 2 (II/III)";

// ─── Helpers of this stage ─────────────────────────────────────────────────

/** A choice whose options are shuffled; the right one is found again by its text. */
function shuffledChoice(rng: Rng, label: string, correct: string, wrong: string[]): ChoiceField {
  const options = rng.shuffle([correct, ...wrong.filter((w, i, all) => w !== correct && all.indexOf(w) === i)]);
  return choiceField(label, options, options.indexOf(correct));
}

/** "ja"/"nein" for a step text. */
const jaNein = (yes: boolean) => (yes ? "ja" : "nein");

/** Three different values from a list, in random order. */
function threeDifferent(rng: Rng, values: number[]): [number, number, number] {
  const [a, b, c] = rng.shuffle(values);
  return [a, b, c];
}

// 3.1 Symmetrische Körper ───────────────────────────────────────────────────

/** A body whose symmetry elements a Level-1 task counts. */
interface CountCase {
  name: string;
  planes: number;
  axes: number;
  centre: boolean;
  planeWhy: string;
  axisWhy: string;
  centreWhy: string;
  planeSlips: Array<{ value: number; hint: string }>;
  axisSlips: Array<{ value: number; hint: string }>;
  meta: Record<string, number>;
}

const PRISM_NAMES: Record<number, string> = { 3: "dreiseitiges", 5: "fünfseitiges", 6: "sechsseitiges", 8: "achtseitiges" };
const PRISM_FACES: Record<number, string> = { 3: "gleichseitiges Dreieck", 5: "regelmäßiges Fünfeck", 6: "regelmäßiges Sechseck", 8: "regelmäßiges Achteck" };

export const COUNT_KINDS = 9;

function countCase(rng: Rng, kind: number): CountCase {
  switch (kind) {
    case 0: {
      const [a, b, c] = threeDifferent(rng, [2, 3, 4, 5, 6, 8]);
      return {
        name: `ein Quader mit den Kantenlängen ${a} cm, ${b} cm und ${c} cm`,
        planes: 3,
        axes: 3,
        centre: true,
        planeWhy: "Symmetrieebenen: die drei Mittelebenen, jede parallel zu zwei gegenüberliegenden Flächen. Die Diagonalebenen durch zwei gegenüberliegende Kanten sind keine, weil die Flächen Rechtecke und keine Quadrate sind.",
        axisWhy: "Symmetrieachsen: die drei Achsen durch die Mittelpunkte gegenüberliegender Flächen, jede mit 180°.",
        centreWhy: "Der Mittelpunkt, in dem sich die Raumdiagonalen schneiden, ist Symmetriezentrum.",
        planeSlips: [
          { value: 9, hint: "9 Symmetrieebenen hat der Würfel. Beim Quader mit drei verschiedenen Kanten sind die Diagonalebenen keine Symmetrieebenen." },
          { value: 6, hint: "Die Diagonalebenen eines Quaders sind keine Symmetrieebenen: Seine Flächen sind Rechtecke, keine Quadrate. Die Diagonale eines Rechtecks ist auch keine Symmetrieachse." },
        ],
        axisSlips: [{ value: 13, hint: "13 Symmetrieachsen hat der Würfel. Beim Quader passen nur die drei Achsen durch Flächenmittelpunkte, je mit 180°." }],
        meta: { a, b, c },
      };
    }
    case 1: {
      const a = rng.pick([2, 3, 4, 5]);
      const h = rng.pick([6, 8, 9, 10, 12]);
      return {
        name: `eine quadratische Säule (Grundfläche ${a} cm × ${a} cm, Höhe ${h} cm)`,
        planes: 5,
        axes: 5,
        centre: true,
        planeWhy: "Symmetrieebenen: zwei senkrechte Mittelebenen parallel zu den Seitenflächen, zwei senkrechte Diagonalebenen durch gegenüberliegende lange Kanten und die waagrechte Mittelebene, zusammen 5.",
        axisWhy: "Symmetrieachsen: die Körperachse durch die Mittelpunkte der Quadrate (90°) und vier waagrechte Achsen durch den Mittelpunkt (180°), zusammen 5.",
        centreWhy: "Der Mittelpunkt ist Symmetriezentrum.",
        planeSlips: [
          { value: 4, hint: "Vergiss die waagrechte Mittelebene nicht: Sie spiegelt die obere Hälfte auf die untere." },
          { value: 3, hint: "Die beiden senkrechten Diagonalebenen durch gegenüberliegende lange Kanten sind auch Symmetrieebenen, weil die Grundfläche ein Quadrat ist." },
          { value: 9, hint: "9 Symmetrieebenen hat nur der Würfel. Bei der Säule sind die Seitenflächen keine Quadrate." },
        ],
        axisSlips: [
          { value: 1, hint: "Neben der Körperachse gibt es vier waagrechte Achsen mit 180°: zwei durch die Mittelpunkte gegenüberliegender Seitenflächen, zwei durch die Mitten gegenüberliegender langer Kanten." },
          { value: 3, hint: "Auch die beiden waagrechten Achsen durch die Mitten gegenüberliegender langer Kanten sind Symmetrieachsen mit 180°." },
        ],
        meta: { a, h },
      };
    }
    case 2: {
      const a = rng.pick([2, 3, 4, 5, 6]);
      return {
        name: `ein Würfel mit der Kantenlänge ${a} cm`,
        planes: 9,
        axes: 13,
        centre: true,
        planeWhy: "Symmetrieebenen: 3 Mittelebenen parallel zu den Flächen und 6 Diagonalebenen durch zwei gegenüberliegende Kanten, zusammen 9.",
        axisWhy: "Symmetrieachsen: 3 durch die Mittelpunkte gegenüberliegender Flächen (90°), 4 durch gegenüberliegende Ecken (120°) und 6 durch die Mitten gegenüberliegender Kanten (180°), zusammen 13.",
        centreWhy: "Der Mittelpunkt des Würfels ist Symmetriezentrum.",
        planeSlips: [
          { value: 3, hint: "Neben den 3 Mittelebenen gibt es 6 Diagonalebenen, jede durch zwei gegenüberliegende Kanten." },
          { value: 6, hint: "Zu den 6 Diagonalebenen kommen die 3 Mittelebenen parallel zu den Flächen." },
        ],
        axisSlips: [
          { value: 3, hint: "Es gibt nicht nur Achsen durch Flächenmittelpunkte: Auch die 4 Raumdiagonalen (120°) und die 6 Achsen durch die Mitten gegenüberliegender Kanten (180°) sind Symmetrieachsen." },
          { value: 7, hint: "Vergiss die 6 Achsen durch die Mitten gegenüberliegender Kanten nicht (je 180°)." },
          { value: 9, hint: "Zu den 3 Achsen durch Flächenmittelpunkte und den 6 durch Kantenmitten kommen die 4 Raumdiagonalen (120°)." },
        ],
        meta: { a },
      };
    }
    case 3: {
      const a = rng.pick([4, 5, 6, 8]);
      const h = rng.pick([3, 5, 6, 7, 9]);
      return {
        name: `eine gerade quadratische Pyramide (Grundkante ${a} cm, Höhe ${h} cm)`,
        planes: 4,
        axes: 1,
        centre: false,
        planeWhy: "Symmetrieebenen: alle gehen durch die Spitze, zwei durch die Mitten gegenüberliegender Grundkanten und zwei durch gegenüberliegende Ecken der Grundfläche, zusammen 4.",
        axisWhy: "Symmetrieachse: nur die Höhe durch die Spitze und den Mittelpunkt der Grundfläche, mit 90°.",
        centreWhy: "Kein Symmetriezentrum: Der Spitze liegt keine Ecke gegenüber. Die Punktspiegelung stellt die Pyramide auf den Kopf, ihr Bild hat die Spitze unten.",
        planeSlips: [
          { value: 2, hint: "Auch die beiden Ebenen durch die Spitze und zwei gegenüberliegende Ecken der Grundfläche sind Symmetrieebenen." },
          { value: 5, hint: "Die Pyramide hat 5 Flächen, aber nicht 5 Symmetrieebenen: Eine waagrechte Symmetrieebene gibt es nicht, die Spitze liegt nur oben." },
        ],
        axisSlips: [{ value: 4, hint: "Die vier Seitenflächen bedeuten den Winkel 360° : 4 = 90° um die eine Achse, nicht vier Achsen." }],
        meta: { a, h },
      };
    }
    case 4:
    case 5:
    case 6: {
      const n = [3, 6, 5][kind - 4];
      const a = rng.pick([2, 3, 4]);
      const h = rng.pick([6, 8, 10]);
      const even = n % 2 === 0;
      return {
        name: `ein regelmäßiges ${PRISM_NAMES[n]} Prisma (Grundfläche ein ${PRISM_FACES[n]} mit der Seite ${a} cm, Höhe ${h} cm)`,
        planes: n + 1,
        axes: n + 1,
        centre: even,
        planeWhy: `Symmetrieebenen: ${n} senkrechte Ebenen durch die Körperachse und die waagrechte Mittelebene, zusammen ${n + 1}.`,
        axisWhy: `Symmetrieachsen: die Körperachse mit 360° : ${n} = ${fmt(360 / n)}° und ${n} waagrechte Achsen mit 180°, zusammen ${n + 1}.`,
        centreWhy: even
          ? `Bei geradem n liegt jeder Ecke eine Ecke gegenüber: Der Mittelpunkt ist Symmetriezentrum.`
          : `Bei ungeradem n liegt einer Ecke der Grundfläche eine Seite gegenüber, keine Ecke: kein Symmetriezentrum.`,
        planeSlips: [{ value: n, hint: "Vergiss die waagrechte Mittelebene nicht: Sie spiegelt die obere Hälfte des Prismas auf die untere." }],
        axisSlips: [{ value: 1, hint: `Neben der Körperachse gibt es ${n} waagrechte Achsen durch den Mittelpunkt, jede mit 180°.` }],
        meta: { n, a, h },
      };
    }
    case 7: {
      const n = rng.pick([3, 6]);
      const a = rng.pick([3, 4, 5]);
      const h = a + rng.pick([3, 4, 5]);
      return {
        name: `eine regelmäßige ${n === 3 ? "dreiseitige" : "sechsseitige"} Pyramide (Grundfläche ein ${PRISM_FACES[n]} mit der Seite ${a} cm, Höhe ${h} cm, die Seitenkanten sind länger als die Grundkanten)`,
        planes: n,
        axes: 1,
        centre: false,
        planeWhy: `Symmetrieebenen: ${n} senkrechte Ebenen durch die Spitze und die Körperachse; eine waagrechte gibt es nicht.`,
        axisWhy: `Symmetrieachse: nur die Höhe, mit 360° : ${n} = ${fmt(360 / n)}°.`,
        centreWhy: "Kein Symmetriezentrum: Der Spitze liegt keine Ecke gegenüber, die Punktspiegelung stellt die Pyramide auf den Kopf.",
        planeSlips: [{ value: n + 1, hint: "Eine Pyramide hat keine waagrechte Symmetrieebene: Oben ist die Spitze, unten die Grundfläche." }],
        axisSlips: [{ value: n + 1, hint: "Waagrechte Achsen mit 180° gibt es bei der Pyramide nicht: Die Spitze käme nach unten." }],
        meta: { n, a, h },
      };
    }
    default: {
      const n = 8;
      const a = rng.pick([2, 3]);
      const h = rng.pick([1, 2]);
      return {
        name: `ein regelmäßiges achtseitiges Prisma (Grundfläche ein regelmäßiges Achteck mit der Seite ${a} cm, Höhe ${h} cm)`,
        planes: n + 1,
        axes: n + 1,
        centre: true,
        planeWhy: "Symmetrieebenen: 8 senkrechte Ebenen durch die Körperachse und die waagrechte Mittelebene, zusammen 9.",
        axisWhy: "Symmetrieachsen: die Körperachse mit 360° : 8 = 45° und 8 waagrechte Achsen mit 180°, zusammen 9.",
        centreWhy: "Das Achteck hat eine gerade Eckenzahl: Jeder Ecke liegt eine Ecke gegenüber, der Mittelpunkt ist Symmetriezentrum.",
        planeSlips: [{ value: 8, hint: "Vergiss die waagrechte Mittelebene nicht." }],
        axisSlips: [{ value: 1, hint: "Neben der Körperachse gibt es 8 waagrechte Achsen durch den Mittelpunkt, jede mit 180°." }],
        meta: { n, a, h },
      };
    }
  }
}

/** Objects from Natur, Kunst and Alltag: the body they are and their symmetries. */
export const SYM_OBJECTS: Array<{
  text: string;
  body: string;
  planes: string;
  planesWrong: [string, string, string];
  axes: string;
  axesWrong: [string, string, string];
  centre: boolean;
  why: string;
}> = [
  { text: "Ein Kochsalzkristall hat die Form eines Würfels.", body: "Würfel", planes: "9", planesWrong: ["3", "6", "13"], axes: "13", axesWrong: ["3", "4", "9"], centre: true, why: "Würfel: 3 Mittelebenen und 6 Diagonalebenen; 3 Achsen durch Flächenmittelpunkte, 4 Raumdiagonalen, 6 durch Kantenmitten; der Mittelpunkt ist Zentrum." },
  { text: "Ein Schuhkarton mit Deckel ist ein Quader, 32 cm lang, 20 cm breit und 12 cm hoch.", body: "Quader", planes: "3", planesWrong: ["6", "9", "2"], axes: "3", axesWrong: ["1", "6", "13"], centre: true, why: "Quader mit drei verschiedenen Kanten: die 3 Mittelebenen, die 3 Achsen durch Flächenmittelpunkte (180°) und der Mittelpunkt als Zentrum; Diagonalebenen passen nicht, die Flächen sind keine Quadrate." },
  { text: "Eine Schraubenmutter ist ein regelmäßiges sechsseitiges Prisma mit einer runden Bohrung entlang der Körperachse.", body: "regelmäßiges sechsseitiges Prisma", planes: "7", planesWrong: ["6", "3", "unendlich viele"], axes: "7", axesWrong: ["1", "6", "3"], centre: true, why: "Die Bohrung liegt auf der Achse und ändert nichts: 6 senkrechte Ebenen und die Mittelebene; die Körperachse (60°) und 6 waagrechte Achsen (180°); bei 6 Ecken liegt jeder Ecke eine gegenüber, also gibt es ein Zentrum." },
  { text: "Ein Bergkristall ist ein regelmäßiges sechsseitiges Prisma, auf dem oben und unten je eine gleich hohe sechsseitige Pyramide sitzt.", body: "sechsseitiges Prisma mit zwei gleichen Pyramiden", planes: "7", planesWrong: ["6", "1", "13"], axes: "7", axesWrong: ["1", "6", "2"], centre: true, why: "Oben und unten sind gleich: 6 senkrechte Ebenen und die waagrechte Mittelebene; die Längsachse (60°) und 6 waagrechte Achsen (180°); der Mittelpunkt ist Zentrum." },
  { text: "Ein Zelt ist ein liegendes dreiseitiges Prisma; sein Grunddreieck ist gleichschenklig, aber nicht gleichseitig.", body: "dreiseitiges Prisma mit gleichschenkligem Grunddreieck", planes: "2", planesWrong: ["4", "1", "3"], axes: "1", axesWrong: ["4", "3", "keine"], centre: false, why: "Nur die senkrechte Ebene durch den First und die Mittelebene parallel zu den Dreiecken; ihre Schnittgerade ist die einzige Achse (180°); kein Zentrum, denn die Punktspiegelung stellt das Zelt auf den Kopf: Der First käme nach unten, der Boden nach oben." },
  { text: "Eine Schokoladenpackung ist ein regelmäßiges dreiseitiges Prisma: Alle Dreieckseiten sind gleich lang.", body: "regelmäßiges dreiseitiges Prisma", planes: "4", planesWrong: ["3", "2", "6"], axes: "4", axesWrong: ["1", "3", "2"], centre: false, why: "3 Ebenen durch die Längsachse und die Mittelebene; die Längsachse (120°) und 3 Achsen mit 180°; bei 3 Ecken liegt einer Ecke eine Fläche gegenüber, also kein Zentrum." },
  { text: "Die Glaspyramide vor dem Louvre in Paris ist eine gerade quadratische Pyramide.", body: "gerade quadratische Pyramide", planes: "4", planesWrong: ["2", "5", "8"], axes: "1", axesWrong: ["4", "5", "keine"], centre: false, why: "4 Ebenen durch die Spitze (zwei durch Kantenmitten, zwei durch Ecken), die Höhe als Achse (90°), kein Zentrum." },
  { text: "Eine Konservendose hat die Form eines Zylinders.", body: "Zylinder", planes: "unendlich viele", planesWrong: ["1", "2", "3"], axes: "unendlich viele", axesWrong: ["1", "2", "keine"], centre: true, why: "Jede Ebene durch die Achse und die Mittelebene; die Körperachse (jeder Winkel) und jede waagrechte Gerade durch den Mittelpunkt (180°); der Mittelpunkt ist Zentrum." },
  { text: "Eine Eistüte hat die Form eines Kegels.", body: "Kegel", planes: "unendlich viele", planesWrong: ["1", "2", "keine"], axes: "1", axesWrong: ["unendlich viele", "2", "keine"], centre: false, why: "Jede Ebene durch die Achse; nur die Körperachse (jeder Winkel); kein Zentrum, die Spitze hat kein Gegenüber." },
  { text: "Eine Blumenvase ist rotationssymmetrisch, unten bauchig und oben schmal.", body: "Rotationskörper", planes: "unendlich viele", planesWrong: ["1", "2", "keine"], axes: "1", axesWrong: ["unendlich viele", "2", "keine"], centre: false, why: "Jede Ebene durch die Achse; nur die Körperachse (jeder Winkel); oben und unten sind verschieden, also weder waagrechte Symmetrieebene noch Zentrum." },
  { text: "Ein Tischtennisball hat die Form einer Kugel.", body: "Kugel", planes: "unendlich viele", planesWrong: ["1", "3", "9"], axes: "unendlich viele", axesWrong: ["1", "3", "13"], centre: true, why: "Jede Ebene und jede Gerade durch den Mittelpunkt; der Mittelpunkt ist Zentrum." },
  { text: "Eine Sanduhr besteht aus zwei gleichen Kegeln, deren Spitzen aneinanderstoßen.", body: "zwei gleiche Kegel (Doppelkegel)", planes: "unendlich viele", planesWrong: ["1", "2", "keine"], axes: "unendlich viele", axesWrong: ["1", "2", "keine"], centre: true, why: "Jede Ebene durch die Achse und die waagrechte Ebene durch die Spitzen; die Längsachse (jeder Winkel) und jede waagrechte Gerade durch den Berührpunkt (180°); der Berührpunkt der Spitzen ist Zentrum." },
  { text: "Ein gespitzter Bleistift ist ein regelmäßiges sechsseitiges Prisma mit einer kegelförmigen Spitze an einem Ende.", body: "sechsseitiges Prisma mit Kegelspitze", planes: "6", planesWrong: ["7", "unendlich viele", "1"], axes: "1", axesWrong: ["7", "6", "keine"], centre: false, why: "6 senkrechte Ebenen durch die Längsachse, aber keine Mittelebene, weil nur ein Ende spitz ist; nur die Längsachse (60°); kein Zentrum." },
  { text: "Ein Spielstein ist eine quadratische Säule: 2 cm × 2 cm groß und 5 cm hoch.", body: "quadratische Säule", planes: "5", planesWrong: ["3", "9", "4"], axes: "5", axesWrong: ["1", "3", "13"], centre: true, why: "2 Mittelebenen parallel zu den Seitenflächen, 2 Diagonalebenen und die waagrechte Mittelebene; die lange Achse (90°) und 4 waagrechte Achsen (180°); der Mittelpunkt ist Zentrum." },
];

/** Axes whose smallest angle a Level-1 task asks for: body, axis, n. */
export const TURN_CASES: Array<{ body: string; axis: string; n: number; slip?: { value: number; hint: string } }> = [
  { body: "Ein Würfel", axis: "die Achse durch zwei gegenüberliegende Ecken (eine Raumdiagonale)", n: 3, slip: { value: 90, hint: "90° gilt für die Achsen durch Flächenmittelpunkte. An jeder Ecke stoßen drei Flächen zusammen: 360° : 3 = 120°." } },
  { body: "Ein Würfel", axis: "die Achse durch die Mittelpunkte zweier gegenüberliegender Flächen", n: 4, slip: { value: 180, hint: "Schon nach 90° liegt die quadratische Fläche oben wieder genauso." } },
  { body: "Ein Würfel", axis: "die Achse durch die Mitten zweier gegenüberliegender Kanten", n: 2, slip: { value: 90, hint: "Nach 90° steht die Kante quer. Erst nach 180° liegt der Würfel wieder genauso." } },
  { body: "Ein Quader mit drei verschiedenen Kantenlängen", axis: "die Achse durch die Mittelpunkte von Grund- und Deckfläche", n: 2, slip: { value: 90, hint: "Die Grundfläche ist ein Rechteck und kein Quadrat: Nach 90° passt sie nicht auf sich." } },
  { body: "Eine quadratische Säule", axis: "die Körperachse durch die Mittelpunkte der beiden Quadrate", n: 4, slip: { value: 180, hint: "Das Quadrat passt schon nach einer Vierteldrehung, 90°, wieder auf sich." } },
  { body: "Ein regelmäßiges dreiseitiges Prisma", axis: "die Körperachse durch die Mittelpunkte der beiden Dreiecke", n: 3, slip: { value: 60, hint: "Das gleichseitige Dreieck hat 3 Ecken: 360° : 3 = 120°." } },
  { body: "Ein regelmäßiges sechsseitiges Prisma", axis: "die Körperachse durch die Mittelpunkte der beiden Sechsecke", n: 6, slip: { value: 120, hint: "Das Sechseck hat 6 gleiche Ecken: 360° : 6 = 60°." } },
  { body: "Eine regelmäßige fünfseitige Pyramide", axis: "die Höhe durch die Spitze und den Mittelpunkt der Grundfläche", n: 5, slip: { value: 60, hint: "Die Grundfläche ist ein Fünfeck: 360° : 5 = 72°." } },
  { body: "Ein regelmäßiges achtseitiges Prisma", axis: "die Körperachse durch die Mittelpunkte der beiden Achtecke", n: 8, slip: { value: 90, hint: "Ein Achteck hat 8 gleiche Ecken: 360° : 8 = 45°." } },
  { body: "Eine gerade quadratische Pyramide", axis: "die Höhe durch die Spitze und den Mittelpunkt der Grundfläche", n: 4, slip: { value: 180, hint: "Die quadratische Grundfläche passt schon nach 90° wieder auf sich." } },
  { body: "Ein regelmäßiges sechsseitiges Prisma", axis: "eine waagrechte Achse durch die Mitten zweier gegenüberliegender Seitenkanten", n: 2, slip: { value: 60, hint: "60° gilt für die senkrechte Körperachse. Um eine waagrechte Achse muss das Prisma auf den Kopf: 180°." } },
];

/** Real objects that are turned about their axis: n, whether they have a centre, and the question asked. */
export const TURN_OBJECTS: Array<{ text: string; question: string; n: number; centre: boolean; why: string }> = [
  { text: "Eine Sechskantmutter (regelmäßiges sechsseitiges Prisma mit Bohrung) sitzt im Maul eines Schraubenschlüssels.", question: "Um welchen kleinsten Winkel musst du die Mutter weiterdrehen, bis der Schlüssel wieder genau passt?", n: 6, centre: true, why: "Die Mutter fällt bei einer Umdrehung 6-mal auf sich, einmal pro Ecke. Bei 6 Ecken liegt jeder Ecke eine gegenüber: Zentrum." },
  { text: "Ein Drehkreuz am Eingang eines Schwimmbads hat drei gleiche Arme, die waagrecht und gleichmäßig verteilt um die Achse abstehen.", question: "Nach welchem kleinsten Drehwinkel sieht das Drehkreuz wieder genauso aus?", n: 3, centre: false, why: "Drei gleiche Arme: 3 Lagen pro Umdrehung. Gegenüber einem Arm ist eine Lücke, also kein Zentrum." },
  { text: "Ein Zuckerwürfel wird um die Gerade durch zwei gegenüberliegende Ecken gedreht.", question: "Nach welchem kleinsten Winkel liegt er wieder genauso da?", n: 3, centre: true, why: "An der Ecke stoßen drei Flächen zusammen: 3 Lagen pro Umdrehung. Der Mittelpunkt des Würfels ist Zentrum." },
  { text: "Eine Schokoladenpackung in Form eines regelmäßigen dreiseitigen Prismas wird um ihre Längsachse gedreht.", question: "Nach welchem kleinsten Winkel sieht sie wieder genauso aus?", n: 3, centre: false, why: "Das gleichseitige Dreieck hat 3 Ecken: 3 Lagen. Einer Ecke liegt eine Fläche gegenüber, also kein Zentrum." },
  { text: "Ein Turm hat ein Dach in Form einer geraden quadratischen Pyramide. Du drehst das Dach in Gedanken um seine Höhe.", question: "Nach welchem kleinsten Winkel sieht das Dach wieder genauso aus?", n: 4, centre: false, why: "Die quadratische Grundfläche: 4 Lagen pro Umdrehung. Die Spitze hat kein Gegenüber, also kein Zentrum." },
  { text: "Ein neuer, ungespitzter Bleistift ist ein regelmäßiges sechsseitiges Prisma. Du drehst ihn um seine Längsachse.", question: "Nach welchem kleinsten Winkel sieht er wieder genauso aus?", n: 6, centre: true, why: "Sechs gleiche Seitenflächen: 6 Lagen. Beide Enden sind gleich, und jeder Ecke liegt eine gegenüber: Zentrum." },
  { text: "Ein gespitzter Bleistift ist ein regelmäßiges sechsseitiges Prisma mit einer Kegelspitze. Du drehst ihn um seine Längsachse.", question: "Nach welchem kleinsten Winkel sieht er wieder genauso aus?", n: 6, centre: false, why: "Die Kegelspitze dreht sich mit, das Sechseck gibt 6 Lagen vor. Nur ein Ende ist spitz, also kein Zentrum." },
  { text: "Ein Tischventilator hat fünf gleiche Flügel, gleichmäßig um die Achse verteilt.", question: "Nach welchem kleinsten Drehwinkel sieht das Flügelrad wieder genauso aus?", n: 5, centre: false, why: "Fünf gleiche Flügel: 5 Lagen pro Umdrehung. Gegenüber einem Flügel ist eine Lücke, also kein Zentrum." },
  { text: "Das Windrad eines Windparks hat drei gleiche Rotorblätter.", question: "Nach welchem kleinsten Drehwinkel sieht der Rotor wieder genauso aus?", n: 3, centre: false, why: "Drei Blätter: 3 Lagen pro Umdrehung. Gegenüber einem Blatt ist eine Lücke, also kein Zentrum." },
  { text: "Eine Pralinenschachtel in Form einer quadratischen Säule wird um ihre lange Achse gedreht.", question: "Nach welchem kleinsten Winkel sieht sie wieder genauso aus?", n: 4, centre: true, why: "Die Grundfläche ist ein Quadrat: 4 Lagen. Der Mittelpunkt der Schachtel ist Zentrum." },
  { text: "Ein Bergkristall (sechsseitiges Prisma mit gleichen Pyramidenspitzen oben und unten) wird um seine Längsachse gedreht.", question: "Nach welchem kleinsten Winkel sieht er wieder genauso aus?", n: 6, centre: true, why: "Das Sechseck gibt 6 Lagen vor. Oben und unten sind gleich, jeder Ecke liegt eine gegenüber: Zentrum." },
];

const symmetrischeKoerper: Lesson = {
  id: "rg-1-koerpersymmetrie",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "3.1 Symmetrische Körper",
  subtitle: "Symmetrieebenen, Drehachsen und Symmetriezentren",
  tracks: ["I"],
  lehrplan: `${LP_I}: Symmetrieebenen, Symmetrieachsen und Symmetriezentren`,
  whyItMatters:
    "Verpackungen, Kristalle, Vasen und Schraubenmuttern sind symmetrisch gebaut. Wer ihre Symmetrieebenen und Drehachsen erkennt, beschreibt einen Körper mit wenigen Worten und sieht zum Beispiel, warum ein Schraubenschlüssel in sechs Lagen auf die Mutter passt.",
  explanationHtml: `
    <p><strong>Wiederholung aus M6 und Lektion 2.2:</strong> Eine ebene Figur ist achsensymmetrisch, wenn die Spiegelung an einer Geraden sie auf sich selbst abbildet, drehsymmetrisch, wenn das eine Drehung um einen Winkel unter 360° tut, und punktsymmetrisch, wenn das die Punktspiegelung an einem Zentrum Z tut. Bei Körpern gibt es dieselben drei Symmetrien, nur im Raum:</p>
    <ul>
      <li><strong>Symmetrieebene:</strong> Spiegelst du den Körper an einer Ebene und er fällt genau auf sich selbst, ist die Ebene eine Symmetrieebene. Sie zerlegt ihn in zwei spiegelgleiche Hälften: Hältst du eine Hälfte an einen Spiegel, siehst du wieder den ganzen Körper.</li>
      <li><strong>Symmetrieachse:</strong> Drehst du den Körper um eine Gerade um einen Winkel zwischen 0° und 360° und er fällt auf sich selbst, ist die Gerade eine Symmetrieachse (Drehachse). Fällt er bei einer ganzen Umdrehung n-mal auf sich, ist der kleinste Drehwinkel α = 360° : n, etwa 180° (zweimal), 120° (dreimal) oder 90° (viermal).</li>
      <li><strong>Symmetriezentrum:</strong> Bildet die Punktspiegelung an Z den Körper auf sich ab, ist Z sein Symmetriezentrum. Dann liegt jeder Ecke auf der anderen Seite von Z, gleich weit entfernt, wieder eine Ecke gegenüber.</li>
    </ul>
    <table class="mini">
      <tr><th>Körper</th><th>Symmetrieebenen</th><th>Symmetrieachsen</th><th>Zentrum</th></tr>
      <tr><td>Quader (drei verschiedene Kanten)</td><td>3</td><td>3 (je 180°)</td><td>ja</td></tr>
      <tr><td>quadratische Säule</td><td>5</td><td>5 (eine mit 90°, vier mit 180°)</td><td>ja</td></tr>
      <tr><td>Würfel</td><td>9</td><td>13 (3 mit 90°, 4 mit 120°, 6 mit 180°)</td><td>ja</td></tr>
      <tr><td>gerade quadratische Pyramide</td><td>4</td><td>1 (90°)</td><td>nein</td></tr>
      <tr><td>Zylinder</td><td>unendlich viele</td><td>die Körperachse (jeder Winkel) und unendlich viele mit 180°</td><td>ja</td></tr>
      <tr><td>Kegel</td><td>unendlich viele (durch die Achse)</td><td>1 (jeder Winkel)</td><td>nein</td></tr>
      <tr><td>Kugel</td><td>unendlich viele</td><td>unendlich viele</td><td>ja</td></tr>
    </table>
    <p>Ein <strong>regelmäßiges n-seitiges Prisma</strong> (Grundfläche ein regelmäßiges n-Eck) hat n senkrechte Symmetrieebenen und die waagrechte Mittelebene, also n + 1, dazu die Körperachse mit dem Winkel 360° : n und n waagrechte Achsen mit 180°. Ein Symmetriezentrum hat es nur bei geradem n. Eine regelmäßige n-seitige Pyramide hat n Symmetrieebenen, eine Achse mit 360° : n und kein Zentrum. Ausnahmen sind Körper mit lauter gleich langen Kanten: Der Würfel ist ein besonderes vierseitiges Prisma mit mehr Symmetrien, ebenso die dreiseitige Pyramide aus vier gleichseitigen Dreiecken.</p>
    <div class="example"><strong>Beispiel:</strong> Eine Schachtel ist eine quadratische Säule, 4 cm × 4 cm groß und 10 cm hoch.<br>
      1. Symmetrieebenen: zwei senkrechte Mittelebenen parallel zu den Seitenflächen, zwei senkrechte Diagonalebenen durch gegenüberliegende lange Kanten und die waagrechte Mittelebene, zusammen 5. Die schrägen Ebenen durch zwei gegenüberliegende kurze Kanten sind keine Symmetrieebenen, denn die Seitenflächen sind 4 cm × 10 cm groß und keine Quadrate.<br>
      2. Symmetrieachsen: die lange Achse durch die Mittelpunkte der Quadrate mit 90°, dazu vier waagrechte Achsen durch den Mittelpunkt (zwei durch die Mittelpunkte gegenüberliegender Seitenflächen, zwei durch die Mitten gegenüberliegender langer Kanten) mit je 180°, zusammen 5.<br>
      3. Symmetriezentrum: der Mittelpunkt, in dem sich die Raumdiagonalen schneiden.<br>
      Ergebnis: 5 Symmetrieebenen, 5 Symmetrieachsen und ein Symmetriezentrum.</div>
    <p>Symmetrische Körper findest du in Natur, Kunst und Alltag: Kochsalz kristallisiert in Würfeln, Bergkristalle sind sechsseitige Prismen mit Spitzen, Vasen und Kreisel sind Rotationskörper, die Glaspyramide des Louvre in Paris ist eine gerade quadratische Pyramide, und Schraubenmuttern sind sechsseitig, damit der Schlüssel in sechs Lagen passt.</p>
    <p>Typische Fehler: die Diagonalebene eines Quaders für eine Symmetrieebene halten (so wie die Diagonale eines Rechtecks keine Symmetrieachse ist); jede Gerade durch die Mitte für eine Symmetrieachse halten; der Pyramide ein Zentrum geben, obwohl ihre Spitze kein Gegenüber hat; beim Würfel die Achsen durch gegenüberliegende Ecken übersehen.</p>
    <div class="merke"><strong>Merke:</strong> Eine Symmetrieebene spiegelt den Körper auf sich selbst, eine Symmetrieachse dreht ihn um einen Winkel unter 360° auf sich selbst, ein Symmetriezentrum bildet ihn durch Punktspiegelung auf sich ab. Fällt der Körper bei einer Umdrehung n-mal auf sich, ist der kleinste Drehwinkel α = 360° : n.</div>
  `,
  formulas: [
    { name: "Symmetrieebene", html: "Spiegelung an der Ebene bildet den Körper auf sich ab", quantities: "die Ebene zerlegt ihn in zwei spiegelgleiche Hälften" },
    { name: "Symmetrieachse", html: "Drehung um die Achse um α = 360° : n bildet den Körper auf sich ab", quantities: "α kleinster Drehwinkel (unter 360°); n Anzahl der Lagen bei einer Umdrehung, n ≥ 2" },
    { name: "Symmetriezentrum", html: "Punktspiegelung an Z bildet den Körper auf sich ab", quantities: "Z ist Mittelpunkt jeder Strecke von einem Punkt zu seinem Bildpunkt" },
    { name: "Regelmäßiges n-seitiges Prisma", html: "n + 1 Symmetrieebenen, n + 1 Symmetrieachsen, Zentrum nur bei geradem n", quantities: "Körperachse mit 360° : n, n waagrechte Achsen mit 180°; der Würfel hat als besonderes Prisma mehr" },
  ],
  quiz: {
    question: "Welche Symmetrien hat eine gerade quadratische Pyramide?",
    options: [
      "4 Symmetrieebenen, 1 Symmetrieachse und ein Symmetriezentrum",
      "2 Symmetrieebenen, 1 Symmetrieachse, kein Symmetriezentrum",
      "4 Symmetrieebenen, 1 Symmetrieachse, kein Symmetriezentrum",
      "5 Symmetrieebenen, 4 Symmetrieachsen, kein Symmetriezentrum",
    ],
    correctIndex: 2,
    explanation:
      "Durch die Spitze gehen 4 Symmetrieebenen: zwei durch die Mitten gegenüberliegender Grundkanten und zwei durch gegenüberliegende Ecken. Die Höhe ist die einzige Drehachse (90°). Ein Zentrum fehlt: Der Spitze liegt keine Ecke gegenüber, und die Punktspiegelung stellt die Pyramide auf den Kopf. Wer nur 2 Ebenen zählt, übersieht die beiden Diagonalebenen.",
  },
  lab: {
    kind: "solid-symmetry",
    title: "Labor: Der Symmetrie-Prüfstand",
    intro:
      "Wähle einen Körper und prüfe Ebenen, Achsen oder den Mittelpunkt. Orange gestrichelt siehst du das Bild des Körpers: Deckt es sich genau mit ihm, hast du eine Symmetrie gefunden. Bei einer Achse drehst du mit α, am Regler oder am Drehknopf.",
    params: [
      { type: "choice", key: "body", label: "Körper", options: SYM_BODY_NAMES.map((label, value) => ({ value, label })), value: 0 },
      { type: "choice", key: "elem", label: "Prüfe", options: [{ value: 0, label: "eine Ebene" }, { value: 1, label: "eine Achse" }, { value: 2, label: "den Mittelpunkt" }], value: 0 },
      { type: "range", key: "k", label: "Kandidat Nr.", unit: "", min: 1, max: SYM_CANDIDATES, step: 1, value: 1, showIf: (v) => v.elem !== 2 },
      { type: "range", key: "alpha", label: "Drehwinkel α", unit: "°", min: 0, max: 345, step: 15, value: 0, showIf: (v) => v.elem === 1 },
      { type: "range", key: "view", label: "Ansicht drehen", unit: "°", min: 0, max: 45, step: 15, value: 30 },
    ],
    readouts: [
      { key: "kandidat", label: "Geprüft wird", compute: (v) => symCandidateName(v) },
      { key: "urteil", label: "Ergebnis", emphasis: true, compute: (v) => symVerdict(v) },
      { key: "bild", label: "Bild des Körpers", compute: (v) => symImageText(v) },
    ],
    goals: [
      {
        id: "wuerfel-keine-ebene",
        text: "Finde beim Würfel eine Ebene durch seinen Mittelpunkt, die keine Symmetrieebene ist. Woran siehst du es am Spiegelbild?",
        check: (v) => v.body === 2 && v.elem === 0 && !symmetryOf(v).symmetric,
      },
      {
        id: "ecken-achse",
        text: "Drehe den Würfel um eine Achse durch zwei gegenüberliegende Ecken so weit, dass er wieder genau auf sich selbst fällt. Welcher Winkel ist der kleinste?",
        check: (v) => {
          const s = symmetryOf(v);
          return v.body === 2 && v.elem === 1 && s.type === "V" && v.alpha > 0 && s.turnMatches;
        },
      },
      {
        id: "achse-ohne-zentrum",
        text: "Finde einen Körper, der eine Symmetrieachse, aber kein Symmetriezentrum hat, und drehe ihn um diese Achse so, dass er auf sich selbst fällt.",
        check: (v) => {
          const s = symmetryOf(v);
          return v.elem === 1 && !hasCentre(v.body) && s.symmetric && v.alpha > 0 && s.turnMatches;
        },
      },
    ],
  },
  exercises: [
    {
      id: "zaehlen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const kind = rng.int(0, COUNT_KINDS - 1);
          const c = countCase(rng, kind);
          return {
            prompt: `Gegeben ist ${c.name}. Wie viele Symmetrieebenen und wie viele Symmetrieachsen hat der Körper? Hat er ein Symmetriezentrum?`,
            given: [],
            formulaHint: "Symmetrieebene: Spiegelung bildet den Körper auf sich ab. Symmetrieachse: Drehung um einen Winkel unter 360° bildet ihn auf sich ab. Zentrum: Punktspiegelung bildet ihn auf sich ab.",
            fields: [
              numberField("Symmetrieebenen:", c.planes, "", 0, { slips: c.planeSlips }),
              numberField("Symmetrieachsen:", c.axes, "", 0, { slips: c.axisSlips }),
              yesNo("Symmetriezentrum?", c.centre),
            ],
            steps: [c.planeWhy, c.axisWhy, c.centreWhy, `<strong>${c.planes} Symmetrieebenen, ${c.axes} ${c.axes === 1 ? "Symmetrieachse" : "Symmetrieachsen"}, Symmetriezentrum: ${jaNein(c.centre)}</strong>`],
            meta: { kind, planes: c.planes, axes: c.axes, centre: c.centre ? 1 : 0, ...c.meta },
          };
        }
        const index = rng.int(0, SYM_OBJECTS.length - 1);
        const o = SYM_OBJECTS[index];
        return {
          prompt: `${o.text} Wie viele Symmetrieebenen und Symmetrieachsen hat der Körper, und hat er ein Symmetriezentrum?`,
          given: [],
          fields: [
            shuffledChoice(rng, "Symmetrieebenen", o.planes, o.planesWrong),
            shuffledChoice(rng, "Symmetrieachsen", o.axes, o.axesWrong),
            yesNo("Symmetriezentrum?", o.centre),
          ],
          steps: [`Der Körper ist: ${o.body}.`, o.why, `<strong>Symmetrieebenen: ${o.planes}; Symmetrieachsen: ${o.axes}; Symmetriezentrum: ${jaNein(o.centre)}</strong>`],
          meta: { index },
        };
      },
    },
    {
      id: "drehwinkel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const index = rng.int(0, TURN_CASES.length - 1);
          const t = TURN_CASES[index];
          const alpha = 360 / t.n;
          const slips = [{ value: 360, hint: "360° ist eine ganze Umdrehung, die schafft jede Gerade. Gesucht ist der kleinste Winkel unter 360°." }, ...(t.slip ? [t.slip] : [])];
          return {
            prompt: `${t.body} wird um ${t.axis} gedreht. Um welchen kleinsten Winkel α muss der Körper gedreht werden, bis er wieder auf sich selbst fällt? Wie oft fällt er bei einer ganzen Umdrehung auf sich?`,
            given: [],
            formulaHint: "α = 360° : n; n ist die Anzahl der Lagen, in denen der Körper bei einer Umdrehung auf sich fällt",
            fields: [numberField("α =", alpha, "°", 0, { slips }), numberField("n =", t.n, "", 0, { slips: [{ value: alpha, hint: "Gefragt ist die Anzahl der Lagen pro Umdrehung, nicht der Winkel." }] })],
            steps: [`Bei einer ganzen Umdrehung um diese Achse fällt der Körper ${t.n}-mal auf sich: n = ${t.n}.`, `α = 360° : ${t.n} = ${fmt(alpha)}°`, `<strong>α = ${fmt(alpha)}°, n = ${t.n}</strong>`],
            meta: { index, n: t.n, alpha },
          };
        }
        const index = rng.int(0, TURN_OBJECTS.length - 1);
        const o = TURN_OBJECTS[index];
        const alpha = 360 / o.n;
        return {
          prompt: `${o.text} ${o.question} Hat der Körper ein Symmetriezentrum?`,
          given: [],
          fields: [
            numberField("kleinster Drehwinkel:", alpha, "°", 0, { slips: [{ value: 360, hint: "Nach 360° sieht jeder Körper wieder gleich aus. Gesucht ist der kleinste Winkel: Zähle die gleichen Lagen bei einer Umdrehung." }] }),
            yesNo("Symmetriezentrum?", o.centre),
          ],
          steps: [o.why, `α = 360° : ${o.n} = ${fmt(alpha)}°`, `<strong>${fmt(alpha)}°; Symmetriezentrum: ${jaNein(o.centre)}</strong>`],
          meta: { index, n: o.n, alpha },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du findest Symmetrieebenen, Drehachsen und Symmetriezentren von Körpern und kannst sie zählen.",
};

// 3.2 Rotationskörper und Axialschnitte ─────────────────────────────────────

export const BODIES = ["Zylinder", "Kegel", "Kugel", "Kegelstumpf"];
export const SECTIONS = ["Rechteck", "gleichschenkliges Dreieck", "Kreis", "gleichschenkliges Trapez"];
const BODY_WITH_ARTICLE = ["ein Zylinder", "ein Kegel", "eine Kugel", "ein Kegelstumpf"];

/** Composite bodies of the Level-2 task: the Axialschnitt in words and two of its measures. */
export const COMPOSITE_SECTIONS = [
  "Fünfeck: Rechteck mit aufgesetztem gleichschenkligem Dreieck",
  "zwei getrennte Rechtecke mit einer Lücke dazwischen",
  "zwei gleichschenklige Dreiecke mit gemeinsamer Spitze",
  "gleichschenkliges Trapez",
  "Rechteck mit aufgesetztem Halbkreis",
];

const axialschnitte: Lesson = {
  id: "rg-2-axialschnitte",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "3.2 Rotationskörper und Axialschnitte",
  subtitle: "Eine Figur dreht sich um eine Achse",
  tracks: ["I"],
  lehrplan: `${LP_I}: Axialschnitte von Rotationskörpern`,
  whyItMatters:
    "Vasen, Kreisel, Rohre und Sanduhren entstehen an der Drehbank: Eine ebene Figur dreht sich um eine Achse. Der Axialschnitt zeigt alle Maße des Körpers in wahrer Größe; mit ihm rechnest du in Klasse 9 Volumen und Oberflächen aus.",
  explanationHtml: `
    <p>Dreht sich eine ebene Figur einmal ganz (360°) um eine Gerade ihrer Ebene, die <strong>Rotationsachse</strong>, entsteht ein <strong>Rotationskörper</strong>. Jeder Punkt der Figur läuft dabei auf einem Kreis um die Achse; der Punkt, der am weitesten von der Achse entfernt ist, bestimmt den größten Radius. Zylinder, Kegel und Kugel kennst du aus M5.</p>
    <table class="mini">
      <tr><th>Figur an der Achse</th><th>Rotationskörper</th><th>Axialschnitt</th></tr>
      <tr><td>Rechteck, eine Seite auf der Achse</td><td>Zylinder</td><td>Rechteck 2r × h</td></tr>
      <tr><td>rechtwinkliges Dreieck, eine Kathete auf der Achse</td><td>Kegel</td><td>gleichschenkliges Dreieck, Grundseite 2r, Höhe h</td></tr>
      <tr><td>Halbkreis, Durchmesser auf der Achse</td><td>Kugel</td><td>Kreis mit dem Durchmesser 2r</td></tr>
      <tr><td>rechtwinkliges Trapez, der Schenkel mit den rechten Winkeln auf der Achse</td><td>Kegelstumpf</td><td>gleichschenkliges Trapez</td></tr>
      <tr><td>Rechteck im Abstand d neben der Achse</td><td>Rohr (Hohlzylinder)</td><td>zwei Rechtecke mit einer Lücke von 2d</td></tr>
    </table>
    <p>Der <strong>Axialschnitt</strong> ist die Schnittfläche, wenn du den Körper mit einer Ebene durch die Achse aufschneidest, so wie du einen Apfel längs durch den Stiel halbierst. Er besteht aus der erzeugenden Figur und ihrem <strong>Spiegelbild an der Achse</strong>, denn nach einer halben Drehung liegt die Figur genau gegenüber. Die Achse ist deshalb immer eine Symmetrieachse des Axialschnitts.</p>
    <ul>
      <li><strong>Vom Körper zum Axialschnitt:</strong> Der Axialschnitt ist so breit wie der Durchmesser, also 2r, und so hoch wie der Körper.</li>
      <li><strong>Vom Axialschnitt zum Körper:</strong> Halbiere den Axialschnitt an seiner Symmetrieachse; die halbe Figur dreht sich um die Achse. Der Radius ist die halbe Breite.</li>
      <li><strong>Zusammengesetzte Figuren</strong> ergeben zusammengesetzte Körper: ein Rechteck mit aufgesetztem Dreieck einen Zylinder mit Kegelspitze (eine Rakete, ein gespitzter Buntstift), zwei gleiche Dreiecke Spitze an Spitze eine Sanduhr.</li>
      <li>Liegt die Figur <strong>nicht an der Achse</strong>, bleibt in der Mitte ein Loch: Ein Rechteck im Abstand d ergibt ein Rohr mit dem Innenradius d.</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> Der Axialschnitt eines Körpers ist ein gleichschenkliges Trapez, unten 4 cm und oben 8 cm breit und 6 cm hoch.<br>
      1. Halbiert an der Symmetrieachse bleibt ein rechtwinkliges Trapez mit den parallelen Seiten 2 cm (unten) und 4 cm (oben) und der Höhe 6 cm.<br>
      2. Es dreht sich um seinen Schenkel mit den rechten Winkeln: Es entsteht ein <strong>Kegelstumpf</strong>, der oben breiter ist als unten, zum Beispiel ein Blumentopf.<br>
      3. Maße: Radius unten 4 cm : 2 = 2 cm, Radius oben 8 cm : 2 = 4 cm, Höhe 6 cm.</div>
    <p>Typische Fehler: die ganze Breite des Axialschnitts als Radius nehmen; das Spiegelbild vergessen, dann ist der „Axialschnitt“ nur halb so breit; die falsche Seite als Achse nehmen. Ein Rechteck 2 cm × 5 cm ergibt um die 5 cm lange Seite gedreht einen schlanken Zylinder mit r = 2 cm und h = 5 cm, um die 2 cm lange Seite einen flachen mit r = 5 cm und h = 2 cm.</p>
    <div class="merke"><strong>Merke:</strong> Axialschnitt = erzeugende Figur + ihr Spiegelbild an der Achse. Er ist 2r breit und so hoch wie der Körper; die Achse ist seine Symmetrieachse.</div>
  `,
  formulas: [
    { name: "Axialschnitt", html: "erzeugende Figur + Spiegelbild an der Achse", quantities: "die Rotationsachse ist Symmetrieachse des Axialschnitts" },
    { name: "Maße", html: "Breite = 2r; Höhe = Höhe des Körpers", quantities: "r Radius, die halbe Breite des Axialschnitts" },
    { name: "Grundkörper", html: "Zylinder: Rechteck 2r × h; Kegel: gleichschenkliges Dreieck; Kugel: Kreis; Kegelstumpf: gleichschenkliges Trapez", quantities: "Rohr: zwei Rechtecke mit einer Lücke so breit wie der Innendurchmesser" },
  ],
  quiz: {
    question: "Der Axialschnitt eines Rotationskörpers ist ein gleichschenkliges Dreieck mit der Grundseite 6 cm und der Höhe 4 cm. Welcher Körper ist es?",
    options: ["ein Kegel mit r = 6 cm und h = 4 cm", "ein Kegel mit r = 3 cm und h = 4 cm", "eine Pyramide mit der Grundkante 6 cm", "ein Kegel mit r = 4 cm und h = 3 cm"],
    correctIndex: 1,
    explanation:
      "Halbiert man das Dreieck an seiner Symmetrieachse, dreht sich ein rechtwinkliges Dreieck mit den Katheten 3 cm und 4 cm um die 4 cm lange Kathete: ein Kegel mit dem Radius 3 cm (halbe Grundseite) und der Höhe 4 cm. Wer die ganze Grundseite als Radius nimmt, bekommt einen doppelt so breiten Kegel.",
  },
  lab: {
    kind: "axial-section",
    title: "Labor: Die Drehbank",
    intro:
      "Wähle eine Figur und drehe sie um die Achse. Links entsteht der Körper, rechts siehst du seinen Axialschnitt in wahrer Größe: die Figur und ihr Spiegelbild. Die Punkte am Axialschnitt kannst du ziehen.",
    params: [
      { type: "choice", key: "shape", label: "Figur", options: AXIAL_FIGURES.map((label, value) => ({ value, label })), value: 0 },
      { type: "range", key: "r", label: "Breite der Figur r", unit: "cm", min: 0.5, max: 4, step: 0.5, value: 2.5, digits: 1 },
      { type: "range", key: "h", label: "Höhe h", unit: "cm", min: 0.5, max: 8, step: 0.5, value: 4, digits: 1, showIf: (v) => v.shape !== 2 },
      { type: "range", key: "r2", label: "Breite oben r₂", unit: "cm", min: 0.5, max: 4, step: 0.5, value: 1, digits: 1, showIf: (v) => v.shape === 3 },
      { type: "range", key: "k", label: "Höhe der Spitze k", unit: "cm", min: 0.5, max: 4, step: 0.5, value: 2, digits: 1, showIf: (v) => v.shape === 4 },
      { type: "range", key: "d", label: "Abstand von der Achse d", unit: "cm", min: 0, max: 2, step: 0.5, value: 0, digits: 1, showIf: (v) => v.shape === 0 },
      { type: "range", key: "phi", label: "Drehung", unit: "°", min: 0, max: 360, step: 15, value: 0 },
    ],
    readouts: [
      { key: "body", label: "Körper nach einer ganzen Drehung", compute: (v) => axialBody(v) },
      { key: "section", label: "Axialschnitt", emphasis: true, compute: (v) => axialSectionName(v) },
      { key: "breite", label: "Breite des Axialschnitts", unit: "cm", digits: 1, compute: (v) => axialWidth(v) },
      { key: "hoehe", label: "Höhe des Körpers", unit: "cm", digits: 1, compute: (v) => axialHeight(v) },
      { key: "s", label: "schräge Seite (gemessen)", unit: "cm", digits: 1, compute: (v) => axialSlant(v) ?? "keine" },
    ],
    goals: [
      {
        id: "rohr",
        text: "Erzeuge ein Rohr: Lege das Rechteck so neben die Achse, dass nach einer ganzen Drehung ein Körper mit Loch entsteht. Wie sieht sein Axialschnitt aus?",
        check: (v) => v.shape === 0 && v.d > 0 && v.phi === 360,
      },
      {
        id: "quadrat",
        text: "Erzeuge mit einer ganzen Drehung einen Zylinder, dessen Axialschnitt ein Quadrat ist. Wie hängen r und h dann zusammen?",
        check: (v) => v.phi === 360 && ((v.shape === 0 && v.d === 0) || (v.shape === 3 && v.r === v.r2)) && v.h === 2 * v.r,
      },
      {
        id: "gleichseitig",
        text: "Erzeuge einen Kegel, dessen Axialschnitt ein gleichseitiges Dreieck ist: Die schräge Seite muss so lang sein wie die Grundseite 2r (auf 2 % genau).",
        check: (v) => v.shape === 1 && Math.abs(Math.hypot(v.r, v.h) - 2 * v.r) <= 0.02 * 2 * v.r,
      },
    ],
  },
  exercises: [
    {
      id: "figur-koerper",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const kind = rng.int(0, 3);
          let figure: string;
          let axis: string;
          let r: number;
          let h: number;
          let slips: Array<{ value: number; hint: string }> = [];
          const half = { hint: "Das ist nur die halbe Breite: Zum Axialschnitt gehört auch das Spiegelbild der Figur." };
          if (kind === 0 || kind === 1) {
            const [p, q] = rng.shuffle([2, 3, 4, 5, 6, 7, 8]).slice(0, 2);
            h = p;
            r = q;
            figure = kind === 0 ? `Ein Rechteck mit den Seiten ${p} cm und ${q} cm` : `Ein rechtwinkliges Dreieck mit den Katheten ${p} cm und ${q} cm`;
            axis = kind === 0 ? `seine ${p} cm lange Seite` : `seine ${p} cm lange Kathete`;
            slips = [{ value: q, ...half }, { value: 2 * p, hint: `Die ${p} cm lange ${kind === 0 ? "Seite" : "Kathete"} liegt auf der Achse und wird zur Höhe. Der Radius ist die andere: ${q} cm.` }];
          } else if (kind === 2) {
            r = rng.pick([2, 2.5, 3, 4, 5, 6]);
            h = 2 * r;
            figure = `Ein Halbkreis mit dem Radius ${fmt(r)} cm`;
            axis = "seinen Durchmesser";
            slips = [{ value: r, ...half }];
          } else {
            const [a, c] = rng.shuffle([2, 3, 4, 5, 6]).slice(0, 2);
            r = a;
            h = rng.pick([3, 4, 5, 6]);
            figure = `Ein rechtwinkliges Trapez mit den parallelen Seiten ${a} cm (unten) und ${c} cm (oben) und dem Schenkel ${h} cm, der auf beiden senkrecht steht,`;
            axis = "diesen Schenkel";
            slips =
              a === 2 * c
                ? [{ value: a, hint: "Das ist die halbe Breite unten (und zufällig die Breite oben). Zum Axialschnitt gehört das Spiegelbild: Breite unten = 2 · untere Seite." }]
                : [{ value: a, ...half }, { value: 2 * c, hint: "Das ist die Breite oben. Gefragt ist die Breite unten: 2 · untere Seite." }];
            return {
              prompt: `${figure} dreht sich einmal um ${axis}. Welcher Körper entsteht? Wie sieht sein Axialschnitt aus, und wie breit ist er unten?`,
              given: [],
              formulaHint: "Axialschnitt = Figur + Spiegelbild an der Achse; Breite = 2r",
              fields: [
                choiceField("Körper", BODIES, 3),
                choiceField("Axialschnitt", SECTIONS, 3),
                numberField("Breite unten:", 2 * a, "cm", 1, { slips }),
              ],
              steps: [
                `Jeder Punkt läuft auf einem Kreis um die Achse: Es entsteht ein Kegelstumpf mit den Radien ${a} cm (unten) und ${c} cm (oben) und der Höhe ${h} cm.`,
                `Der Axialschnitt ist das Trapez mit seinem Spiegelbild: ein gleichschenkliges Trapez, unten 2 · ${a} cm = ${2 * a} cm und oben 2 · ${c} cm = ${2 * c} cm breit.`,
                `<strong>Kegelstumpf; gleichschenkliges Trapez; ${2 * a} cm breit</strong>`,
              ],
              meta: { kind, r: a, r2: c, h },
            };
          }
          const width = 2 * r;
          return {
            prompt: `${figure} dreht sich einmal um ${axis}. Welcher Körper entsteht? Wie sieht sein Axialschnitt aus, und wie breit ist er?`,
            given: [],
            formulaHint: "Axialschnitt = Figur + Spiegelbild an der Achse; Breite = 2r",
            fields: [choiceField("Körper", BODIES, kind), choiceField("Axialschnitt", SECTIONS, kind), numberField("Breite:", width, "cm", 1, { slips })],
            steps: [
              kind === 2
                ? `Jeder Punkt des Halbkreises läuft auf einem Kreis um den Durchmesser: Es entsteht eine Kugel mit r = ${fmtUnit(r, "cm")}.`
                : `Jeder Punkt läuft auf einem Kreis um die Achse: Es entsteht ${BODY_WITH_ARTICLE[kind]} mit r = ${r} cm und h = ${h} cm.`,
              kind === 2
                ? `Der Axialschnitt ist der Halbkreis mit seinem Spiegelbild: ein Kreis mit dem Durchmesser 2 · ${fmt(r)} cm = ${fmtUnit(width, "cm")}.`
                : `Der Axialschnitt ist die Figur mit ihrem Spiegelbild: ${kind === 0 ? "ein Rechteck" : "ein gleichschenkliges Dreieck"}, 2 · ${r} cm = ${width} cm breit und ${h} cm hoch.`,
              `<strong>${BODIES[kind]}; ${SECTIONS[kind]}; ${fmtUnit(width, "cm")} breit</strong>`,
            ],
            meta: { kind, r, h },
          };
        }
        const ctx = rng.int(0, 4);
        if (ctx === 0) {
          const r = rng.pick([1.5, 2, 2.5, 3, 4]);
          const h = rng.pick([6, 8, 10, 12]);
          const k = rng.pick([2, 3, 4, 5]);
          return {
            prompt: `Ein Werkstück aus Holz besteht aus einem Zylinder (Radius ${fmt(r)} cm, Höhe ${h} cm), auf dem ein Kegel mit demselben Radius und der Höhe ${k} cm sitzt. Wie sieht der Axialschnitt des Werkstücks aus? Wie breit und wie hoch ist er?`,
            given: [],
            fields: [shuffledChoice(rng, "Axialschnitt", COMPOSITE_SECTIONS[0], [SECTIONS[0], SECTIONS[3], COMPOSITE_SECTIONS[2]]), numberField("Breite:", 2 * r, "cm", 1, { slips: [{ value: r, hint: "Der Axialschnitt ist so breit wie der Durchmesser, nicht wie der Radius." }] }), numberField("Gesamthöhe:", h + k, "cm", 1, { slips: [{ value: h, hint: "Die Kegelspitze gehört dazu: Zylinderhöhe plus Kegelhöhe." }] })],
            steps: [
              `Der Zylinder gibt im Axialschnitt ein Rechteck ${fmt(2 * r)} cm × ${h} cm, der Kegel darauf ein gleichschenkliges Dreieck mit derselben Grundseite und der Höhe ${k} cm: zusammen ein Fünfeck.`,
              `Breite: 2 · ${fmt(r)} cm = ${fmtUnit(2 * r, "cm")}; Höhe: ${h} cm + ${k} cm = ${h + k} cm`,
              `<strong>Fünfeck (Rechteck mit Dreieck), ${fmtUnit(2 * r, "cm")} breit und ${h + k} cm hoch</strong>`,
            ],
            meta: { ctx, a: 2 * r, b: h + k, r, h, k },
          };
        }
        if (ctx === 1) {
          const D = rng.pick([10, 11, 12, 15, 16]);
          const w = rng.pick([0.5, 1, 1.5, 2]);
          const L = rng.pick([50, 80, 100]);
          const gap = D - 2 * w;
          return {
            prompt: `Ein Abflussrohr ist ${L} cm lang, sein Außendurchmesser beträgt ${D} cm und seine Wand ist ${fmt(w)} cm dick. Wie sieht der Axialschnitt aus? Wie breit ist die Lücke zwischen den Teilen, und wie groß ist der Innenradius?`,
            given: [],
            fields: [shuffledChoice(rng, "Axialschnitt", COMPOSITE_SECTIONS[1], [SECTIONS[0], COMPOSITE_SECTIONS[2], SECTIONS[3]]), numberField("Lücke:", gap, "cm", 1, { slips: [{ value: D - w, hint: "Die Wand ist auf beiden Seiten: Ziehe die Wanddicke zweimal ab." }] }), numberField("Innenradius:", gap / 2, "cm", 2, { slips: [{ value: gap, hint: "Das ist der Innendurchmesser. Der Radius ist die Hälfte." }] })],
            steps: [
              `Geschnitten längs der Achse sieht man die Wand zweimal: zwei Rechtecke, je ${fmt(w)} cm breit und ${L} cm hoch, mit der hohlen Mitte dazwischen.`,
              `Lücke = Innendurchmesser = ${D} cm − 2 · ${fmt(w)} cm = ${fmtUnit(gap, "cm")}; Innenradius = ${fmt(gap)} cm : 2 = ${fmtUnit(gap / 2, "cm")}`,
              `<strong>zwei Rechtecke; Lücke ${fmtUnit(gap, "cm")}; Innenradius ${fmtUnit(gap / 2, "cm")}</strong>`,
            ],
            meta: { ctx, a: gap, b: gap / 2, D, w, L },
          };
        }
        if (ctx === 2) {
          const r = rng.pick([3, 4, 5, 6]);
          const h = rng.pick([6, 7, 8, 9]);
          return {
            prompt: `Eine Sanduhr besteht aus zwei gleichen Kegeln mit dem Radius ${r} cm und der Höhe ${h} cm, deren Spitzen aneinanderstoßen. Wie sieht ihr Axialschnitt aus? Wie breit und wie hoch ist er?`,
            given: [],
            fields: [shuffledChoice(rng, "Axialschnitt", COMPOSITE_SECTIONS[2], [SECTIONS[1], COMPOSITE_SECTIONS[0], SECTIONS[3]]), numberField("Breite:", 2 * r, "cm", 1, { slips: [{ value: r, hint: "Der Axialschnitt ist so breit wie der Durchmesser 2r." }] }), numberField("Gesamthöhe:", 2 * h, "cm", 1, { slips: [{ value: h, hint: "Zwei Kegel übereinander: Die Höhe verdoppelt sich." }] })],
            steps: [
              "Jeder Kegel gibt ein gleichschenkliges Dreieck; die Dreiecke berühren sich mit ihren Spitzen auf der Achse.",
              `Breite: 2 · ${r} cm = ${2 * r} cm; Höhe: 2 · ${h} cm = ${2 * h} cm`,
              `<strong>zwei gleichschenklige Dreiecke mit gemeinsamer Spitze, ${2 * r} cm breit und ${2 * h} cm hoch</strong>`,
            ],
            meta: { ctx, a: 2 * r, b: 2 * h, r, h },
          };
        }
        if (ctx === 3) {
          const r1 = rng.pick([8, 9, 10, 11]);
          const r2 = r1 + rng.pick([2, 3, 4]);
          const h = rng.pick([24, 26, 28, 30]);
          return {
            prompt: `Ein Eimer hat die Form eines Kegelstumpfs: Der Boden hat den Radius ${r1} cm, die Öffnung oben den Radius ${r2} cm, der Eimer ist ${h} cm hoch. Wie sieht der Axialschnitt aus? Wie breit ist er unten und oben?`,
            given: [],
            fields: [shuffledChoice(rng, "Axialschnitt", COMPOSITE_SECTIONS[3], [SECTIONS[0], SECTIONS[1], COMPOSITE_SECTIONS[2]]), numberField("Breite unten:", 2 * r1, "cm", 1, { slips: [{ value: r1, hint: "Die Breite ist der Durchmesser: 2 · Radius." }] }), numberField("Breite oben:", 2 * r2, "cm", 1, { slips: [{ value: r2, hint: "Die Breite ist der Durchmesser: 2 · Radius." }] })],
            steps: [
              "Ein Kegelstumpf entsteht aus einem rechtwinkligen Trapez; mit seinem Spiegelbild wird daraus ein gleichschenkliges Trapez.",
              `unten: 2 · ${r1} cm = ${2 * r1} cm; oben: 2 · ${r2} cm = ${2 * r2} cm; Höhe ${h} cm`,
              `<strong>gleichschenkliges Trapez, unten ${2 * r1} cm und oben ${2 * r2} cm breit</strong>`,
            ],
            meta: { ctx, a: 2 * r1, b: 2 * r2, r1, r2, h },
          };
        }
        const r = rng.pick([2, 2.5, 3, 3.5, 4]);
        const h = rng.pick([8, 10, 12, 15]);
        return {
          prompt: `Ein Getreidesilo ist ein Zylinder (Radius ${fmt(r)} m, Höhe ${h} m) mit einer Halbkugel als Dach. Wie sieht der Axialschnitt des Silos aus? Wie breit und wie hoch ist er?`,
          given: [],
          fields: [shuffledChoice(rng, "Axialschnitt", COMPOSITE_SECTIONS[4], [COMPOSITE_SECTIONS[0], SECTIONS[0], SECTIONS[2]]), numberField("Breite:", 2 * r, "m", 1, { slips: [{ value: r, hint: "Der Axialschnitt ist so breit wie der Durchmesser 2r." }] }), numberField("Gesamthöhe:", h + r, "m", 1, { slips: [{ value: h + 2 * r, hint: "Das Dach ist eine Halbkugel: Es ragt nur um den Radius über den Zylinder, nicht um den Durchmesser." }, { value: h, hint: "Das Dach gehört dazu: Die Halbkugel ragt um den Radius über den Zylinder." }] })],
          steps: [
            `Der Zylinder gibt ein Rechteck ${fmt(2 * r)} m × ${h} m, die Halbkugel einen Halbkreis mit dem Radius ${fmt(r)} m darauf.`,
            `Breite: 2 · ${fmt(r)} m = ${fmtUnit(2 * r, "m")}; Höhe: ${h} m + ${fmt(r)} m = ${fmtUnit(h + r, "m")}`,
            `<strong>Rechteck mit Halbkreis, ${fmtUnit(2 * r, "m")} breit und ${fmtUnit(h + r, "m")} hoch</strong>`,
          ],
          meta: { ctx, a: 2 * r, b: h + r, r, h },
        };
      },
    },
    {
      id: "masse",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const kind = rng.int(0, 3);
          const radiusSlip = (width: number) => ({ value: width, hint: "Der Radius ist die halbe Breite des Axialschnitts." });
          if (kind === 3) {
            const [g1, g2] = rng.shuffle([4, 6, 8, 10, 12, 14]).slice(0, 2).sort((p, q) => q - p);
            const h = rng.pick([3, 5, 7, 9]);
            return {
              prompt: `Der Axialschnitt eines Rotationskörpers ist ein gleichschenkliges Trapez, unten ${g1} cm und oben ${g2} cm breit und ${h} cm hoch. Welcher Körper ist es? Gib seine beiden Radien an.`,
              given: [],
              formulaHint: "Radius = halbe Breite des Axialschnitts",
              fields: [choiceField("Körper", BODIES, 3), numberField("Radius unten r₁ =", g1 / 2, "cm", 1, { slips: [radiusSlip(g1)] }), numberField("Radius oben r₂ =", g2 / 2, "cm", 1, { slips: [radiusSlip(g2)] })],
              steps: [
                "Halbiert an der Symmetrieachse bleibt ein rechtwinkliges Trapez; gedreht um seinen Schenkel mit den rechten Winkeln entsteht ein Kegelstumpf.",
                `r₁ = ${g1} cm : 2 = ${fmtUnit(g1 / 2, "cm")}; r₂ = ${g2} cm : 2 = ${fmtUnit(g2 / 2, "cm")}`,
                `<strong>Kegelstumpf mit r₁ = ${fmtUnit(g1 / 2, "cm")} und r₂ = ${fmtUnit(g2 / 2, "cm")}</strong>`,
              ],
              meta: { kind, r: g1 / 2, h: g2 / 2 },
            };
          }
          const width = kind === 2 ? rng.pick([5, 6, 8, 9, 10, 12]) : rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 12]);
          const h = kind === 2 ? width : rng.pick([2, 3, 4, 5, 6, 8, 10]);
          const shape = [`ein Rechteck, ${width} cm breit und ${h} cm hoch`, `ein gleichschenkliges Dreieck mit der Grundseite ${width} cm und der Höhe ${h} cm`, `ein Kreis mit dem Durchmesser ${width} cm`][kind];
          return {
            prompt: `Der Axialschnitt eines Rotationskörpers ist ${shape}. Welcher Körper ist es? Gib seinen Radius und seine Höhe an.`,
            given: [],
            formulaHint: "Radius = halbe Breite des Axialschnitts; Höhe = Höhe des Axialschnitts",
            fields: [choiceField("Körper", BODIES, kind), numberField("Radius r =", width / 2, "cm", 1, { slips: [radiusSlip(width)] }), numberField("Höhe h =", h, "cm", 1, { slips: kind === 2 ? [{ value: width / 2, hint: "Die Kugel ist so hoch wie ihr Durchmesser, nicht wie ihr Radius." }] : [] })],
            steps: [
              `Halbiert an der Symmetrieachse bleibt ${["ein Rechteck", "ein rechtwinkliges Dreieck", "ein Halbkreis"][kind]}; gedreht um die Achse entsteht ${BODY_WITH_ARTICLE[kind]}.`,
              `r = ${width} cm : 2 = ${fmtUnit(width / 2, "cm")}; ${kind === 2 ? `Höhe = Durchmesser = ${width} cm` : `h = ${h} cm`}`,
              `<strong>${BODIES[kind]} mit r = ${fmtUnit(width / 2, "cm")} und h = ${h} cm</strong>`,
            ],
            meta: { kind, r: width / 2, h },
          };
        }
        const ctx = rng.int(0, 4);
        if (ctx === 0) {
          const s = rng.pick([4, 5, 6, 7, 8, 9, 10, 12]);
          const u = 4 * s;
          return {
            prompt: `Der Axialschnitt eines Zylinders ist ein Quadrat mit dem Umfang ${u} cm. Wie groß sind der Radius und die Höhe des Zylinders?`,
            given: [],
            fields: [numberField("r =", s / 2, "cm", 1, { slips: [{ value: s, hint: "Die Quadratseite ist der Durchmesser; der Radius ist die Hälfte." }, { value: u / 2, hint: "Das Quadrat hat vier gleiche Seiten: Seite = Umfang : 4." }] }), numberField("h =", s, "cm", 1, { slips: [{ value: u / 2, hint: "Das Quadrat hat vier gleiche Seiten: Seite = Umfang : 4." }] })],
            steps: [`Quadratseite: ${u} cm : 4 = ${s} cm. Die Seite ist zugleich die Breite 2r und die Höhe h.`, `r = ${s} cm : 2 = ${fmtUnit(s / 2, "cm")}; h = ${s} cm`, `<strong>r = ${fmtUnit(s / 2, "cm")}, h = ${s} cm</strong>`],
            meta: { ctx, a: s / 2, b: s, u },
          };
        }
        if (ctx === 1) {
          const h = rng.pick([4, 5, 6, 8, 10]);
          const width = rng.pick([3, 4, 6, 7, 9, 12]);
          const A = width * h;
          return {
            prompt: `Ein Zylinder ist ${h} cm hoch. Sein Axialschnitt ist ein Rechteck mit dem Flächeninhalt ${A} cm². Wie breit ist der Axialschnitt, und wie groß ist der Radius des Zylinders?`,
            given: [],
            fields: [numberField("Breite:", width, "cm", 1, { slips: [{ value: A / 2, hint: "Breite = Flächeninhalt : Höhe, denn A = Breite · Höhe." }] }), numberField("r =", width / 2, "cm", 2, { slips: [{ value: width, hint: "Die Breite ist der Durchmesser; der Radius ist die Hälfte." }] })],
            steps: [`A = Breite · h, also Breite = ${A} cm² : ${h} cm = ${width} cm.`, `Die Breite ist der Durchmesser: r = ${width} cm : 2 = ${fmtUnit(width / 2, "cm")}`, `<strong>Breite ${width} cm, r = ${fmtUnit(width / 2, "cm")}</strong>`],
            meta: { ctx, a: width, b: width / 2, A, h },
          };
        }
        if (ctx === 2) {
          const side = rng.pick([4, 6, 8, 9, 10, 12, 15]);
          const u = 3 * side;
          return {
            prompt: `Der Axialschnitt eines Kegels ist ein gleichseitiges Dreieck mit dem Umfang ${u} cm. Wie groß ist der Radius des Kegels, und wie lang ist seine Mantellinie s (die schräge Seite des Axialschnitts)?`,
            given: [],
            fields: [numberField("r =", side / 2, "cm", 1, { slips: [{ value: side, hint: "Die Grundseite des Dreiecks ist der Durchmesser; der Radius ist die Hälfte." }] }), numberField("s =", side, "cm", 1, { slips: [{ value: side / 2, hint: "Im gleichseitigen Dreieck ist die schräge Seite so lang wie die Grundseite, also wie der Durchmesser." }] })],
            steps: [`Alle drei Seiten sind gleich lang: ${u} cm : 3 = ${side} cm. Die Grundseite ist der Durchmesser 2r, die Schenkel sind die Mantellinien.`, `r = ${side} cm : 2 = ${fmtUnit(side / 2, "cm")}; s = ${side} cm`, `<strong>r = ${fmtUnit(side / 2, "cm")}, s = ${side} cm</strong>`],
            meta: { ctx, a: side / 2, b: side, u },
          };
        }
        if (ctx === 3) {
          const B = rng.pick([8, 10, 12, 14, 16, 20]);
          const w = rng.pick([1, 1.5, 2, 2.5]);
          const L = rng.pick([30, 40, 60]);
          return {
            prompt: `Der Axialschnitt eines Rohrs besteht aus zwei Rechtecken, jedes ${fmt(w)} cm breit und ${L} cm hoch. Von der Außenkante des einen bis zur Außenkante des anderen sind es ${B} cm. Wie groß sind Außenradius und Innenradius des Rohrs?`,
            given: [],
            fields: [numberField("Außenradius:", B / 2, "cm", 2, { slips: [{ value: B, hint: "Das ist der Außendurchmesser; der Radius ist die Hälfte." }] }), numberField("Innenradius:", B / 2 - w, "cm", 2, { slips: [{ value: B - 2 * w, hint: "Das ist der Innendurchmesser, die Breite der Lücke. Der Radius ist die Hälfte." }, ...(B / 2 - 2 * w > 0 ? [{ value: B / 2 - 2 * w, hint: "Vom Außenradius ziehst du die Wanddicke nur einmal ab." }] : [])] })],
            steps: [`Die Gesamtbreite ist der Außendurchmesser: Außenradius = ${B} cm : 2 = ${fmtUnit(B / 2, "cm")}.`, `Jedes Rechteck ist ein Stück Wand: Innenradius = ${fmt(B / 2)} cm − ${fmt(w)} cm = ${fmtUnit(B / 2 - w, "cm")}`, `<strong>Außenradius ${fmtUnit(B / 2, "cm")}, Innenradius ${fmtUnit(B / 2 - w, "cm")}</strong>`],
            meta: { ctx, a: B / 2, b: B / 2 - w, B, w },
          };
        }
        const s = rng.pick([5, 6, 8, 10]);
        const g2 = rng.pick([4, 6, 8]);
        const g1 = g2 + rng.pick([4, 6, 8]);
        const u = g1 + g2 + 2 * s;
        return {
          prompt: `Der Axialschnitt eines Kegelstumpfs ist ein gleichschenkliges Trapez mit dem Umfang ${u} cm. Seine Schenkel sind je ${s} cm lang, seine obere Seite ist ${g2} cm lang und kürzer als die untere. Wie groß sind die Radien unten und oben?`,
          given: [],
          fields: [numberField("Radius unten r₁ =", g1 / 2, "cm", 1, { slips: [{ value: g1, hint: "Das ist die untere Breite, der Durchmesser. Der Radius ist die Hälfte." }, { value: (u - s - g2) / 2, hint: "Es gibt zwei Schenkel: Ziehe 2 · s vom Umfang ab." }] }), numberField("Radius oben r₂ =", g2 / 2, "cm", 1, { slips: [{ value: g2, hint: "Die obere Seite ist der Durchmesser oben; der Radius ist die Hälfte." }] })],
          steps: [`Untere Seite: ${u} cm − 2 · ${s} cm − ${g2} cm = ${g1} cm.`, `r₁ = ${g1} cm : 2 = ${fmtUnit(g1 / 2, "cm")}; r₂ = ${g2} cm : 2 = ${fmtUnit(g2 / 2, "cm")}`, `<strong>r₁ = ${fmtUnit(g1 / 2, "cm")}, r₂ = ${fmtUnit(g2 / 2, "cm")}</strong>`],
          meta: { ctx, a: g1 / 2, b: g2 / 2, u, s, g2 },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du gehst vom Rotationskörper zum Axialschnitt und zurück und liest die Maße ab.",
};

// 3.3 Punkte im Raum ────────────────────────────────────────────────────────

export const LOCATIONS = ["auf der x-Achse", "auf der y-Achse", "auf der z-Achse", "in der xy-Ebene", "in der xz-Ebene", "in der yz-Ebene", "in keiner Koordinatenebene"];
const VERTEX_NAMES = ["A", "B", "C", "D", "E", "F", "G", "H"];

/** Corner of the cuboid with A in the origin, [AB] on the x-axis, [AD] on the y-axis and [AE] on the z-axis. */
export function cuboidVertex(name: string, a: number, b: number, c: number, origin: [number, number, number] = [0, 0, 0]): [number, number, number] {
  const i = VERTEX_NAMES.indexOf(name);
  const x = i === 1 || i === 2 || i === 5 || i === 6 ? a : 0;
  const y = i === 2 || i === 3 || i === 6 || i === 7 ? b : 0;
  const z = i >= 4 ? c : 0;
  return [origin[0] + x, origin[1] + y, origin[2] + z];
}

/** The edges of the cuboid whose midpoints a task asks for, with the coordinate that is halved. */
const MID_EDGES: Array<[string, string]> = [
  ["F", "G"],
  ["C", "G"],
  ["E", "H"],
  ["B", "C"],
  ["D", "H"],
  ["G", "H"],
  ["B", "F"],
  ["E", "F"],
];

const CUBOID_GIVEN = "Grundfläche ABCD unten; E liegt über A, F über B, G über C, H über D";

/** A room with the origin in its back left corner on the floor. */
const ROOM_GIVEN = "Ursprung: hintere linke Ecke am Boden; x-Achse an der linken Wand nach vorne, y-Achse an der Rückwand nach rechts, z-Achse nach oben; 1 Einheit = 1 m";

const raumkoordinaten: Lesson = {
  id: "rg-3-raumkoordinaten",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "3.3 Punkte im Raum",
  subtitle: "Das dreidimensionale Koordinatensystem",
  tracks: ["I"],
  lehrplan: `${LP_I}: Das dreidimensionale Koordinatensystem`,
  whyItMatters:
    "Mit drei Zahlen beschreibst du jeden Ort in einem Zimmer, auf einer Baustelle oder in einem 3D-Drucker genau. Wer Koordinaten im Raum lesen und einzeichnen kann, zeichnet in der nächsten Lektion ganze Körper hinein.",
  explanationHtml: `
    <p>Einen Punkt in der Ebene beschreibst du mit zwei Zahlen, P(x | y). Für einen Punkt im Raum brauchst du drei: Im <strong>dreidimensionalen Koordinatensystem</strong> stehen drei Achsen paarweise senkrecht aufeinander und schneiden sich im <strong>Ursprung O(0 | 0 | 0)</strong>.</p>
    <ul>
      <li>Die <strong>x-Achse</strong> zeigt nach vorne, auf dich zu.</li>
      <li>Die <strong>y-Achse</strong> zeigt nach rechts.</li>
      <li>Die <strong>z-Achse</strong> zeigt nach oben.</li>
    </ul>
    <p>Ein Punkt hat drei Koordinaten, <strong>P(x | y | z)</strong>. So erreichst du ihn vom Ursprung aus: x Einheiten in x-Richtung nach vorne, dann y Einheiten parallel zur y-Achse nach rechts, dann z Einheiten parallel zur z-Achse nach oben. Diese drei Strecken zeichnest du als <strong>Hilfslinien</strong> ein. Die Achsen gehen über den Ursprung hinaus weiter: Negative Koordinaten bedeuten nach hinten, nach links oder nach unten.</p>
    <p><strong>So wird gezeichnet:</strong> Die y- und die z-Achse zeichnest du in wahrer Größe, eine Einheit ist 1 cm. Die x-Achse zeigt auf dich zu und wird wie eine Tiefenkante im Schrägbild gezeichnet: unter 45° nach links unten und auf die Hälfte verkürzt (q = ½). Eine Einheit auf der x-Achse ist im Bild also nur 0,5 cm lang. Deshalb kannst du in x-Richtung keine Längen im Bild abmessen, und ein einzelner Bildpunkt verrät die Koordinaten nicht: Die Punkte (0 | 2 | 2) und (3 | 3 | 3) liegen im Bild fast an derselben Stelle. Erst die Hilfslinien zeigen, welcher Punkt gemeint ist.</p>
    <p><strong>Besondere Lagen:</strong> Ist eine Koordinate 0, liegt der Punkt in einer <strong>Koordinatenebene</strong>. Die Ebene heißt nach den beiden Achsen, die in ihr liegen: z = 0 in der xy-Ebene (dem „Boden“), y = 0 in der xz-Ebene, x = 0 in der yz-Ebene. Sind zwei Koordinaten 0, liegt der Punkt auf einer Achse: (0 | 0 | 3) liegt auf der z-Achse in der Höhe 3. Der Abstand eines Punktes von einer Koordinatenebene ist der Betrag der Koordinate, die in dieser Ebene 0 ist: P(2 | 5 | 3) liegt 3 Einheiten über der xy-Ebene (z = 3) und 2 Einheiten vor der yz-Ebene (x = 2).</p>
    <div class="example"><strong>Beispiel (Koordinatisierung):</strong> Ein Zimmer ist 5 m lang, 4 m breit und 2,5 m hoch. Der Ursprung liegt in der hinteren linken Ecke am Boden, die x-Achse läuft an der linken Wand nach vorne, die y-Achse an der Rückwand nach rechts, die z-Achse in der Ecke nach oben; 1 Einheit = 1 m.<br>
      1. Die Lampe hängt an der Decke über der Mitte des Bodens: 5 : 2 = 2,5 nach vorne, 4 : 2 = 2 nach rechts, 2,5 nach oben, also L(2,5 | 2 | 2,5).<br>
      2. Die vordere rechte Ecke am Boden ist E(5 | 4 | 0); sie liegt in der xy-Ebene.<br>
      3. Ein Bild hängt an der Rückwand (x = 0), 1,5 m von der linken Wand entfernt und 1,6 m hoch: B(0 | 1,5 | 1,6) ist ein Punkt der yz-Ebene.</div>
    <p>Typische Fehler: x und y vertauschen (x zeigt nach vorne, nicht nach rechts); die x-Koordinate im Bild abmessen, obwohl dort alles halb so lang gezeichnet ist; einen Punkt ohne Hilfslinien einzeichnen; die Ebene nach der Koordinate benennen, die 0 ist (P(4 | 0 | 2) liegt in der xz-Ebene, nicht „in der y-Ebene“).</p>
    <div class="merke"><strong>Merke:</strong> P(x | y | z): x nach vorne, y nach rechts, z nach oben. Die x-Achse wird unter 45° und auf die Hälfte verkürzt gezeichnet, darum gehören Hilfslinien zu jedem Punkt. Eine Koordinate 0: Der Punkt liegt in einer Koordinatenebene; zwei Koordinaten 0: auf einer Achse.</div>
  `,
  formulas: [
    { name: "Punkt im Raum", html: "P(x | y | z)", quantities: "x nach vorne, y nach rechts, z nach oben; O(0 | 0 | 0) Ursprung" },
    { name: "Koordinatenebenen", html: "xy-Ebene: z = 0; xz-Ebene: y = 0; yz-Ebene: x = 0", quantities: "auf einer Achse sind zwei Koordinaten 0, auf der z-Achse x = 0 und y = 0" },
    { name: "Zeichnen", html: "x-Achse unter 45° nach links unten, Verkürzung q = ½", quantities: "y- und z-Achse in wahrer Größe; in x-Richtung nicht abmessen" },
    { name: "Abstand von einer Koordinatenebene", html: "von der xy-Ebene: |z|; von der xz-Ebene: |y|; von der yz-Ebene: |x|", quantities: "der Betrag der Koordinate, die in dieser Ebene 0 ist" },
  ],
  quiz: {
    question: "Wo liegt der Punkt P(4 | 0 | 2)?",
    options: ["in der yz-Ebene", "in der xy-Ebene", "auf der y-Achse", "in der xz-Ebene"],
    correctIndex: 3,
    explanation:
      "Die y-Koordinate ist 0. Alle Punkte mit y = 0 bilden die xz-Ebene, in der die x- und die z-Achse liegen. Die Ebene heißt nach den beiden Achsen, die in ihr liegen, nicht nach der Koordinate, die 0 ist. Auf der y-Achse wären x und z gleich 0.",
  },
  lab: {
    kind: "space-coordinates",
    title: "Labor: Punkte im Raum",
    intro:
      "Stelle P und Q mit den Reglern ein oder ziehe sie; beim Ziehen bleibt die x-Koordinate gleich. Der farbige Weg zeigt, wie du P vom Ursprung aus erreichst: erst nach vorne, dann nach rechts, dann nach oben.",
    params: [
      { type: "range", key: "x", label: "x-Koordinate von P", unit: "", min: 0, max: 5, step: 0.5, value: 2, digits: 1 },
      { type: "range", key: "y", label: "y-Koordinate von P", unit: "", min: 0, max: 7, step: 0.5, value: 3, digits: 1 },
      { type: "range", key: "z", label: "z-Koordinate von P", unit: "", min: 0, max: 5, step: 0.5, value: 2, digits: 1 },
      { type: "range", key: "u", label: "x-Koordinate von Q", unit: "", min: 0, max: 5, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "v", label: "y-Koordinate von Q", unit: "", min: 0, max: 7, step: 0.5, value: 5, digits: 1 },
      { type: "range", key: "w", label: "z-Koordinate von Q", unit: "", min: 0, max: 5, step: 0.5, value: 3, digits: 1 },
      { type: "choice", key: "qpath", label: "Hilfslinien für Q", options: [{ value: 0, label: "aus" }, { value: 1, label: "ein" }], value: 0 },
    ],
    readouts: [
      { key: "P", label: "Punkt P", compute: (v) => `P${point3(v.x, v.y, v.z)}` },
      { key: "lageP", label: "Lage von P", emphasis: true, compute: (v) => locationOf(v.x, v.y, v.z) },
      { key: "Q", label: "Punkt Q", compute: (v) => `Q${point3(v.u, v.v, v.w)}` },
      { key: "lageQ", label: "Lage von Q", compute: (v) => locationOf(v.u, v.v, v.w) },
      { key: "bild", label: "Abstand der Bildpunkte", unit: "cm", digits: 1, compute: (v) => pictureDistance(vec(v.x, v.y, v.z), vec(v.u, v.v, v.w)) },
    ],
    goals: [
      {
        id: "yz-ebene",
        text: "Lege P in die yz-Ebene, aber auf keine Achse. Welche Koordinate ist dann 0?",
        check: (v) => v.x === 0 && v.y > 0 && v.z > 0,
      },
      {
        id: "gleiches-bild",
        text: "Stelle Q so ein, dass sein Bildpunkt auf dem von P liegt (höchstens 1 mm daneben), obwohl Q andere Koordinaten hat. Schalte dann die Hilfslinien für Q ein.",
        check: (v) => (v.u !== v.x || v.v !== v.y || v.w !== v.z) && pictureDistance(vec(v.x, v.y, v.z), vec(v.u, v.v, v.w)) <= 0.1,
      },
      {
        id: "fusspunkt",
        text: "Lege Q genau senkrecht unter P in die xy-Ebene: an die Stelle, an der der Weg zu P nach oben abbiegt.",
        check: (v) => v.u === v.x && v.v === v.y && v.w === 0 && v.z > 0,
      },
    ],
  },
  exercises: [
    {
      id: "quader-punkte",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const mid = rng.next() < 0.45;
          let a = rng.int(2, 6);
          let b = rng.int(2, 8);
          let c = rng.int(2, 6);
          let name: string;
          let target: [number, number, number];
          let route: string;
          let edge: [string, string] = ["A", "A"];
          if (mid) {
            edge = rng.pick(MID_EDGES);
            // the halved edge gets an even length, so the midpoint has whole coordinates
            if (edge.join("") === "FG" || edge.join("") === "EH" || edge.join("") === "BC") b = rng.pick([2, 4, 6, 8]);
            if (edge.join("") === "CG" || edge.join("") === "DH" || edge.join("") === "BF") c = rng.pick([2, 4, 6]);
            if (edge.join("") === "GH" || edge.join("") === "EF") a = rng.pick([2, 4, 6]);
            const p = cuboidVertex(edge[0], a, b, c);
            const q = cuboidVertex(edge[1], a, b, c);
            target = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2];
            name = `des Mittelpunkts M der Kante [${edge[0]}${edge[1]}]`;
            route = `${edge[0]}${point3(...p)} und ${edge[1]}${point3(...q)}; M liegt in der Mitte: Jede Koordinate ist der Mittelwert, ((x₁ + x₂) : 2 | (y₁ + y₂) : 2 | (z₁ + z₂) : 2).`;
          } else {
            const vertex = rng.pick(["B", "C", "D", "E", "F", "G", "H"]);
            target = cuboidVertex(vertex, a, b, c);
            name = `der Ecke ${vertex}`;
            route = `Von A aus: ${fmt(target[0])} in x-Richtung (nach vorne), ${fmt(target[1])} in y-Richtung (nach rechts), ${fmt(target[2])} nach oben.`;
          }
          const label = mid ? "M" : name.slice(-1);
          return {
            prompt: `Ein Quader ABCDEFGH liegt so im Koordinatensystem, dass A im Ursprung liegt, [AB] auf der x-Achse, [AD] auf der y-Achse und [AE] auf der z-Achse. Gib die Koordinaten ${name} an.`,
            given: [`${len("AB")} = ${a}, ${len("AD")} = ${b}, ${len("AE")} = ${c} (in Einheiten)`, CUBOID_GIVEN],
            formulaHint: "Weg vom Ursprung: x nach vorne, y nach rechts, z nach oben; Mittelpunkt: von jeder Koordinate den Mittelwert",
            fields: [numberField("x =", target[0], "", 1), numberField("y =", target[1], "", 1), numberField("z =", target[2], "", 1)],
            steps: [route, `<strong>${label}${point3(...target)}</strong>`],
            meta: { mid: mid ? 1 : 0, a, b, c, x: target[0], y: target[1], z: target[2], e0: VERTEX_NAMES.indexOf(edge[0]), e1: VERTEX_NAMES.indexOf(edge[1]) },
          };
        }
        const L = rng.pick([4, 4.5, 5, 6]);
        const B = rng.pick([3, 3.5, 4, 5]);
        const H = rng.pick([2.5, 2.6, 2.8, 3]);
        const ctx = rng.int(0, 4);
        let item: string;
        let target: [number, number, number];
        let why: string;
        let detail: number[] = [];
        if (ctx === 0) {
          const below = rng.pick([0.5, 0.6, 0.8, 1]);
          item = `Eine Lampe hängt ${fmt(below)} m unter der Decke genau über der Mitte des Bodens.`;
          target = [L / 2, B / 2, H - below];
          detail = [below];
          why = `Mitte des Bodens: x = ${fmt(L)} : 2 = ${fmt(L / 2)}, y = ${fmt(B)} : 2 = ${fmt(B / 2)}; Höhe: ${fmt(H)} − ${fmt(below)} = ${fmt(H - below)}.`;
        } else if (ctx === 1) {
          const fx = rng.pick([1, 1.5, 2]);
          const fy = rng.pick([1, 1.5, 2]);
          item = `Ein Rauchmelder sitzt an der Decke, ${fmt(fx)} m von der Rückwand und ${fmt(fy)} m von der linken Wand entfernt.`;
          target = [fx, fy, H];
          detail = [fx, fy];
          why = `Abstand von der Rückwand ist die x-Koordinate (${fmt(fx)}), Abstand von der linken Wand die y-Koordinate (${fmt(fy)}), an der Decke ist z = ${fmt(H)}.`;
        } else if (ctx === 2) {
          item = "Eine Spinne sitzt in der vorderen rechten oberen Ecke des Zimmers.";
          target = [L, B, H];
          why = `Ganz vorne: x = ${fmt(L)}; ganz rechts: y = ${fmt(B)}; oben an der Decke: z = ${fmt(H)}.`;
        } else if (ctx === 3) {
          const px = rng.pick([1.5, 2, 2.5, 3]);
          const pz = rng.pick([1.4, 1.5, 1.6]);
          item = `Ein Bild hängt an der linken Wand; sein Mittelpunkt ist ${fmt(px)} m von der Rückwand entfernt und ${fmt(pz)} m über dem Boden.`;
          target = [px, 0, pz];
          detail = [px, pz];
          why = `An der linken Wand ist y = 0; ${fmt(px)} m von der Rückwand heißt x = ${fmt(px)}; die Höhe ist z = ${fmt(pz)}.`;
        } else {
          const depth = rng.pick([0.5, 0.6]);
          const width = rng.pick([1, 1.2, 1.5]);
          const height = rng.pick([1.8, 2, 2.2]);
          item = `In der hinteren rechten Ecke steht ein Schrank, ${fmt(depth)} m tief, ${fmt(width)} m breit und ${fmt(height)} m hoch. Gesucht ist seine vordere obere linke Ecke.`;
          target = [depth, B - width, height];
          detail = [depth, width, height];
          why = `Der Schrank steht an der Rückwand: vorne bei x = ${fmt(depth)}. Er steht rechts in der Ecke: seine linke Seite bei y = ${fmt(B)} − ${fmt(width)} = ${fmt(B - width)}. Oben: z = ${fmt(height)}.`;
        }
        const question = ["Gib die Koordinaten der Lampe an.", "Gib die Koordinaten des Rauchmelders an.", "Gib die Koordinaten der Spinne an.", "Gib die Koordinaten des Bildmittelpunkts an.", "Gib die Koordinaten dieser Schrankecke an."][ctx];
        return {
          prompt: `Ein Zimmer ist ${fmt(L)} m lang (von der Rückwand nach vorne), ${fmt(B)} m breit und ${fmt(H)} m hoch. ${item} ${question}`,
          given: [ROOM_GIVEN],
          fields: [numberField("x =", target[0], "", 2), numberField("y =", target[1], "", 2), numberField("z =", target[2], "", 2)],
          steps: [why, `<strong>${point3(...target)}</strong>`],
          meta: { ctx, L, B, H, x: target[0], y: target[1], z: target[2], p1: detail[0] ?? 0, p2: detail[1] ?? 0, p3: detail[2] ?? 0 },
        };
      },
    },
    {
      id: "lage",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const roll = rng.next();
          const zeros = roll < 0.3 ? 2 : roll < 0.82 ? 1 : 0;
          const zeroAt = rng.shuffle([0, 1, 2]).slice(0, zeros);
          const coord = [0, 1, 2].map((i) => (zeroAt.includes(i) ? 0 : (rng.next() < 0.25 ? -1 : 1) * rng.int(1, 6)));
          const [x, y, z] = coord;
          const where = locationOf(x, y, z);
          const letters = ["x", "y", "z"];
          let wrong: string[];
          if (zeros === 1) {
            const c = zeroAt[0];
            wrong = [`auf der ${letters[c]}-Achse`, ...LOCATIONS.slice(3, 6).filter((l) => l !== where)];
          } else if (zeros === 2) {
            const nz = [0, 1, 2].find((i) => !zeroAt.includes(i)) ?? 0;
            const others = letters.filter((_, i) => i !== nz);
            wrong = [`in der ${others.join("")}-Ebene`, `auf der ${letters[zeroAt[0]]}-Achse`, "in keiner Koordinatenebene"];
          } else {
            wrong = LOCATIONS.slice(3, 6);
          }
          const plane = rng.int(0, 2);
          const planeName = ["yz", "xz", "xy"][plane];
          const distance = Math.abs(coord[plane]);
          const otherSlips = [0, 1, 2]
            .filter((i) => i !== plane && Math.abs(coord[i]) !== distance)
            .filter((i, k, all) => all.findIndex((j) => Math.abs(coord[j]) === Math.abs(coord[i])) === k)
            .map((i) => ({ value: Math.abs(coord[i]), hint: `Der Abstand von der ${planeName}-Ebene hängt nur von der Koordinate ab, die nicht in dieser Ebene liegt: hier ${letters[plane]}.` }));
          return {
            prompt: `Gegeben ist der Punkt P${point3(x, y, z)}. Wo liegt P? Wie weit ist P von der ${planeName}-Ebene entfernt?`,
            given: [],
            formulaHint: "eine Koordinate 0: Koordinatenebene, benannt nach den beiden anderen Achsen; zwei Koordinaten 0: Achse; Abstand von der xy-Ebene = |z|",
            fields: [shuffledChoice(rng, "Lage von P", where, wrong.slice(0, 3)), numberField(`Abstand von der ${planeName}-Ebene:`, distance, "", 1, { slips: otherSlips })],
            steps: [
              zeros === 0
                ? "Keine Koordinate ist 0: P liegt in keiner Koordinatenebene."
                : zeros === 1
                  ? `Die ${letters[zeroAt[0]]}-Koordinate ist 0. Die Ebene heißt nach den beiden anderen Achsen: P liegt ${where}.`
                  : `Zwei Koordinaten sind 0, nur ${letters[[0, 1, 2].find((i) => !zeroAt.includes(i)) ?? 0]} nicht: P liegt ${where}.`,
              `Der Abstand von der ${planeName}-Ebene ist der Betrag der ${letters[plane]}-Koordinate: |${fmt(coord[plane])}| = ${fmt(distance)}.`,
              `<strong>P liegt ${where}; Abstand ${fmt(distance)}</strong>`,
            ],
            meta: { x, y, z, plane, distance },
          };
        }
        const L = rng.pick([5, 6]);
        const B = rng.pick([4, 5]);
        const H = rng.pick([2.5, 3]);
        const px = rng.pick([1, 1.5, 2, 2.5, 3, 3.5]);
        const py = rng.pick([1, 1.5, 2, 2.5, 3]);
        const pz = rng.pick([0.8, 1, 1.2, 1.5, 1.8, 2]);
        const thing = rng.pick(["Eine kleine Drohne schwebt", "Eine Seifenblase schwebt", "Eine Fliege sitzt an einer Lampe"]);
        const target = rng.int(0, 2);
        const spot: [number, number, number] = [target === 2 ? 0 : px, target === 1 ? 0 : py, target === 0 ? 0 : pz];
        const distance = [pz, py, px][target];
        const question = [
          "Welcher Punkt des Bodens liegt genau unter ihr, und wie hoch über dem Boden ist sie?",
          "Ein Laserstrahl geht von ihr aus senkrecht auf die linke Wand. In welchem Punkt trifft er die Wand, und wie weit ist sie von der linken Wand entfernt?",
          "Ein Laserstrahl geht von ihr aus senkrecht auf die Rückwand. In welchem Punkt trifft er die Wand, und wie weit ist sie von der Rückwand entfernt?",
        ][target];
        const plane = ["Der Boden ist die xy-Ebene (z = 0)", "Die linke Wand ist die xz-Ebene (y = 0)", "Die Rückwand ist die yz-Ebene (x = 0)"][target];
        const letter = ["z", "y", "x"][target];
        return {
          prompt: `Ein Zimmer ist ${L} m lang, ${B} m breit und ${fmt(H)} m hoch. ${thing} im Punkt P${point3(px, py, pz)}. ${question}`,
          given: [ROOM_GIVEN],
          fields: [
            numberField("x =", spot[0], "", 1),
            numberField("y =", spot[1], "", 1),
            numberField("z =", spot[2], "", 1),
            numberField("Abstand:", distance, "m", 1, { slips: [px, py, pz].filter((value) => value !== distance).map((value) => ({ value, hint: ["Der Abstand vom Boden ist die Höhe, also die z-Koordinate von P.", "Der Abstand von der linken Wand ist die y-Koordinate von P.", "Der Abstand von der Rückwand ist die x-Koordinate von P."][target] })) }),
          ],
          steps: [
            `${plane}. Senkrecht dorthin ändert sich nur die ${letter}-Koordinate: Sie wird 0, die beiden anderen bleiben.`,
            `Abstand = ${letter}-Koordinate von P = ${fmtUnit(distance, "m")}`,
            `<strong>${point3(...spot)}; Abstand ${fmtUnit(distance, "m")}</strong>`,
          ],
          meta: { px, py, pz, target, distance },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du liest und setzt Punkte im Raum mit drei Koordinaten und erkennst ihre Lage.",
};

// 3.4 Körper im Koordinatensystem ───────────────────────────────────────────

const koerperKoordinaten: Lesson = {
  id: "rg-4-koerper-koordinaten",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "3.4 Körper im Koordinatensystem",
  subtitle: "Strecken, Vielecke, Quader, Pyramiden und Prismen",
  tracks: ["I"],
  lehrplan: `${LP_I}: Strecken, Vielecke und Körper im Koordinatensystem`,
  whyItMatters:
    "Architekten, Spieleentwickler und 3D-Drucker beschreiben Körper durch die Koordinaten ihrer Ecken. Wer aus wenigen Angaben alle Ecken eines Quaders oder die Spitze einer Pyramide bestimmen kann, zeichnet jeden einfachen Körper sicher ins Koordinatensystem.",
  explanationHtml: `
    <p>Im dreidimensionalen Koordinatensystem zeichnest du Strecken, Vielecke und Körper, indem du ihre Eckpunkte mit Hilfslinien einträgst und sie verbindest. Eine Strecke [PQ] hat die Endpunkte P und Q, ein Dreieck oder Viereck zeichnest du Ecke für Ecke. Verdeckte Kanten eines Körpers werden gestrichelt.</p>
    <p><strong>Quader:</strong> Liegt A im Ursprung und laufen die Kanten [AB], [AD] und [AE] entlang der x-, y- und z-Achse, dann folgen alle acht Ecken aus der Länge a (x-Richtung), der Breite b (y-Richtung) und der Höhe c: A(0 | 0 | 0), B(a | 0 | 0), C(a | b | 0), D(0 | b | 0), E(0 | 0 | c), F(a | 0 | c), G(a | b | c), H(0 | b | c). Die Ecken der Deckfläche haben dieselben x- und y-Koordinaten wie die Ecken darunter, nur z = c. Liegt A nicht im Ursprung, addierst du a, b und c zu den Koordinaten von A.</p>
    <p><strong>Kantenlängen:</strong> Eine Kante parallel zu einer Achse ist so lang wie der Unterschied der einen Koordinate, die sich ändert: Von B(4 | 0 | 0) nach C(4 | 3 | 0) ändert sich nur y, also ist ${len("BC")} = 3 − 0 = 3. Die Länge einer schrägen Strecke wie einer Flächendiagonale kannst du so nicht ablesen; wie man sie berechnet, lernst du in Klasse 9.</p>
    <p><strong>Pyramide:</strong> Bei einer geraden Pyramide über einem Rechteck liegt die Spitze S senkrecht über dem Mittelpunkt M der Grundfläche. M ist der Mittelpunkt der Diagonale [AC]: Von den x-Koordinaten und von den y-Koordinaten bildest du jeweils den Mittelwert, M((x₁ + x₂) : 2 | (y₁ + y₂) : 2 | z). Die Spitze hat dieselben x- und y-Koordinaten wie M, ihre z-Koordinate ist die Höhe der Grundfläche plus die Höhe h der Pyramide.</p>
    <p><strong>Prisma:</strong> Ein dreiseitiges Prisma, etwa ein Zelt mit dem First [EF], hat zwei gleiche Dreiecke als Grund- und Deckfläche. Steht das Zelt auf dem Rechteck ABCD, sind seine Dreiecke gleichschenklig und ist der First parallel zu [AB], liegt er genau über der Mittellinie des Bodens: E und F haben die y-Koordinate (y₁ + y₂) : 2 und als z-Koordinate die Firsthöhe.</p>
    <p><strong>Verschieben:</strong> Wird ein Körper um 2 Einheiten in y-Richtung verschoben, wächst bei jeder Ecke die y-Koordinate um 2, x und z bleiben. Die Kantenlängen ändern sich dabei nicht.</p>
    <div class="example"><strong>Beispiel:</strong> Die Grundfläche einer geraden Pyramide ist das Rechteck ABCD mit A(1 | 2 | 0), B(5 | 2 | 0), C(5 | 8 | 0) und D(1 | 8 | 0); die Pyramide ist 6 hoch.<br>
      1. Kantenlängen: ${len("AB")} = 5 − 1 = 4 (nur x ändert sich), ${len("BC")} = 8 − 2 = 6 (nur y ändert sich).<br>
      2. Mittelpunkt der Diagonale [AC]: M((1 + 5) : 2 | (2 + 8) : 2 | 0) = M(3 | 5 | 0).<br>
      3. Spitze senkrecht darüber: S(3 | 5 | 6).<br>
      4. Stellt man die Pyramide auf einen 3 hohen Sockel, kommt zu jeder z-Koordinate 3 dazu: S′(3 | 5 | 9).</div>
    <p>Typische Fehler: bei der Spitze die Höhe vergessen oder die Höhe der Grundfläche nicht dazuzählen; den Mittelpunkt einer Kante statt der Diagonale nehmen; den Unterschied (x₂ − x₁) statt des Mittelwerts bilden; beim Verschieben auch die anderen Koordinaten ändern.</p>
    <div class="merke"><strong>Merke:</strong> Mittelpunkt einer Strecke: M((x₁ + x₂) : 2 | (y₁ + y₂) : 2 | (z₁ + z₂) : 2). Die Spitze einer geraden Pyramide liegt senkrecht über dem Mittelpunkt der Grundfläche. Kante parallel zu einer Achse: Länge = Unterschied der einen Koordinate, die sich ändert. Verschieben: zur passenden Koordinate jeder Ecke dieselbe Zahl addieren.</div>
  `,
  formulas: [
    { name: "Quader mit A im Ursprung", html: "B(a | 0 | 0), C(a | b | 0), D(0 | b | 0), G(a | b | c)", quantities: "a Länge in x-Richtung, b Breite in y-Richtung, c Höhe in z-Richtung" },
    { name: "Mittelpunkt einer Strecke", html: "M((x₁ + x₂) : 2 | (y₁ + y₂) : 2 | (z₁ + z₂) : 2)", quantities: "die Spitze einer geraden Pyramide liegt senkrecht über dem Mittelpunkt der Diagonale [AC]" },
    { name: "Kante parallel zu einer Achse", html: "Länge = größere minus kleinere Koordinate", quantities: "nur eine Koordinate ändert sich" },
    { name: "Verschiebung", html: "(x | y | z) → (x + u | y + v | z + w)", quantities: "alle Ecken um dieselben Zahlen; die Kantenlängen bleiben" },
  ],
  quiz: {
    question: "Die Grundfläche einer geraden Pyramide hat die Ecken A(0 | 0 | 0), B(4 | 0 | 0), C(4 | 6 | 0) und D(0 | 6 | 0); die Pyramide ist 5 hoch. Wo liegt die Spitze S?",
    options: ["S(4 | 6 | 5)", "S(2 | 3 | 0)", "S(0 | 0 | 5)", "S(2 | 3 | 5)"],
    correctIndex: 3,
    explanation:
      "Die Spitze liegt senkrecht über dem Mittelpunkt M der Diagonale [AC]: M((0 + 4) : 2 | (0 + 6) : 2 | 0) = M(2 | 3 | 0). Darüber in der Höhe 5 liegt S(2 | 3 | 5). S(4 | 6 | 5) läge über der Ecke C, und (2 | 3 | 0) ist erst der Mittelpunkt ohne die Höhe.",
  },
  lab: {
    kind: "solid-coordinates",
    title: "Labor: Körper im Koordinatensystem",
    intro:
      "Wähle einen Körper und stelle Länge, Breite, Höhe und die Lage der Ecke A ein; rechts stehen die Koordinaten aller Ecken. Ziehe A, um den Körper zu verschieben, die Ecke C für die Breite und die oberste Ecke für die Höhe.",
    params: [
      { type: "choice", key: "body", label: "Körper", options: SOLID_NAMES.map((label, value) => ({ value, label })), value: 0 },
      { type: "range", key: "a", label: "Länge a (x-Richtung)", unit: "", min: 1, max: 4, step: 0.5, value: 3, digits: 1 },
      { type: "range", key: "b", label: "Breite b (y-Richtung)", unit: "", min: 1, max: 6, step: 0.5, value: 4, digits: 1 },
      { type: "range", key: "c", label: "Höhe c (z-Richtung)", unit: "", min: 1, max: 5, step: 0.5, value: 2, digits: 1 },
      { type: "range", key: "ax", label: "x-Koordinate von A", unit: "", min: 0, max: 2, step: 0.5, value: 0, digits: 1 },
      { type: "range", key: "ay", label: "y-Koordinate von A", unit: "", min: 0, max: 3, step: 0.5, value: 0, digits: 1 },
      { type: "range", key: "az", label: "z-Koordinate von A", unit: "", min: 0, max: 2, step: 0.5, value: 0, digits: 1 },
    ],
    readouts: [
      { key: "A", label: "Ecke A", compute: (v) => `A${point3(v.ax, v.ay, v.az)}` },
      { key: "top", label: "Oben", emphasis: true, compute: (v) => solidTopText(v) },
      { key: "M", label: "Mittelpunkt der Grundfläche", compute: (v) => `M${point3(v.ax + v.a / 2, v.ay + v.b / 2, v.az)}` },
      { key: "kanten", label: "Kanten", compute: (v) => `${lenText("AB")} = ${fmt(v.a)}, ${lenText("BC")} = ${fmt(v.b)}, Höhe ${fmt(v.c)}` },
    ],
    goals: [
      {
        id: "wuerfel",
        text: "Baue einen Würfel mit der Kantenlänge 3, dessen Deckfläche in der Höhe z = 4 liegt.",
        check: (v) => v.body === 0 && v.a === 3 && v.b === 3 && v.c === 3 && v.az + v.c === 4,
      },
      {
        id: "spitze",
        text: "Stelle eine Pyramide ein, deren Spitze im Punkt S(2 | 3 | 5) liegt.",
        check: (v) => {
          const S = solidTop(v).p;
          return v.body === 1 && S.x === 2 && S.y === 3 && S.z === 5;
        },
      },
      {
        id: "first",
        text: "Stelle ein Zelt ein, dessen First von E(1 | 2 | 3) bis F(5 | 2 | 3) reicht.",
        check: (v) => {
          const [, , , , E, F] = solidVertices(v);
          return v.body === 2 && E.p.x === 1 && E.p.y === 2 && E.p.z === 3 && F.p.x === 5 && F.p.y === 2 && F.p.z === 3;
        },
      },
    ],
  },
  exercises: [
    {
      id: "quader-ecken",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const variant = rng.int(0, 1);
          const A: [number, number, number] = [rng.int(0, 3), rng.int(1, 4), rng.int(0, 2)];
          const a = rng.int(2, 6);
          const b = rng.int(2, 6);
          const c = rng.int(1, 5);
          if (variant === 0) {
            const vertex = rng.pick(["C", "F", "G", "H", "B", "D", "E"]);
            const target = cuboidVertex(vertex, a, b, c, A);
            const sums = target.map((value, i) => (value !== A[i] ? `${["x", "y", "z"][i]} = ${fmt(A[i])} + ${fmt(value - A[i])} = ${fmt(value)}` : `${["x", "y", "z"][i]} = ${fmt(A[i])}`));
            return {
              prompt: `Ein Quader ABCDEFGH hat die Ecke A${point3(...A)}; seine Kanten sind parallel zu den Achsen. [AB] ist ${a} lang (x-Richtung), [AD] ist ${b} lang (y-Richtung), [AE] ist ${c} lang (z-Richtung). Gib die Koordinaten der Ecke ${vertex} an.`,
              given: [CUBOID_GIVEN],
              formulaHint: "Ecke = A plus die Kantenlängen in x-, y- und z-Richtung, die du auf dem Weg zur Ecke gehst",
              fields: [numberField("x =", target[0], "", 1), numberField("y =", target[1], "", 1), numberField("z =", target[2], "", 1)],
              steps: [
                `Von A nach ${vertex}: ${["B", "C", "F", "G"].includes(vertex) ? `${a} in x-Richtung` : "nichts in x-Richtung"}, ${["C", "D", "G", "H"].includes(vertex) ? `${b} in y-Richtung` : "nichts in y-Richtung"}, ${["E", "F", "G", "H"].includes(vertex) ? `${c} nach oben` : "nichts nach oben"}.`,
                sums.join("; "),
                `<strong>${vertex}${point3(...target)}</strong>`,
              ],
              meta: { variant, ax: A[0], ay: A[1], az: A[2], a, b, c, vertex: VERTEX_NAMES.indexOf(vertex), x: target[0], y: target[1], z: target[2] },
            };
          }
          const G = cuboidVertex("G", a, b, c, A);
          const slip = (value: number, answer: number) => (value !== answer ? [{ value, hint: "Die Kantenlänge ist der Unterschied der Koordinaten: Koordinate von G minus Koordinate von A." }] : []);
          return {
            prompt: `Ein Quader ABCDEFGH hat die Ecken A${point3(...A)} und G${point3(...G)}; seine Kanten sind parallel zu den Achsen. Wie lang sind die Kanten [AB] (x-Richtung), [AD] (y-Richtung) und [AE] (z-Richtung)?`,
            given: [CUBOID_GIVEN],
            formulaHint: "Kante parallel zu einer Achse: Länge = Unterschied der Koordinate, die sich ändert",
            fields: [numberField(`${len("AB")} =`, a, "", 1, { slips: slip(G[0], a) }), numberField(`${len("AD")} =`, b, "", 1, { slips: slip(G[1], b) }), numberField(`${len("AE")} =`, c, "", 1, { slips: slip(G[2], c) })],
            steps: ["G liegt A gegenüber: Von A nach G ändern sich alle drei Koordinaten, jede um eine Kantenlänge.", `${len("AB")} = ${G[0]} − ${A[0]} = ${a}; ${len("AD")} = ${G[1]} − ${A[1]} = ${b}; ${len("AE")} = ${G[2]} − ${A[2]} = ${c}`, `<strong>${len("AB")} = ${a}, ${len("AD")} = ${b}, ${len("AE")} = ${c}</strong>`],
            meta: { variant, ax: A[0], ay: A[1], az: A[2], a, b, c },
          };
        }
        const ctx = rng.int(0, 2);
        if (ctx === 0) {
          const a = rng.pick([3, 4, 5]);
          const b = rng.pick([2, 3, 4]);
          const c = rng.pick([2, 3]);
          const dx = rng.pick([1, 2, 3]);
          const dy = rng.pick([2, 3, 4]);
          const t = rng.pick([7, 8]);
          const G: [number, number, number] = [a + dx, b + dy, c + t];
          return {
            prompt: `Ein Karton (Quader ABCDEFGH) ist ${a} dm lang, ${b} dm breit und ${c} dm hoch. Er steht zuerst so, dass A im Ursprung liegt und [AB], [AD] und [AE] entlang der x-, y- und z-Achse laufen (1 Einheit = 1 dm). Dann wird er ${dx} dm nach vorne und ${dy} dm nach rechts geschoben und auf einen ${t} dm hohen Tisch gehoben. Gib die neuen Koordinaten der Ecke G an.`,
            given: [CUBOID_GIVEN, "x nach vorne, y nach rechts, z nach oben"],
            fields: [
              numberField("x =", G[0], "", 1, { slips: [{ value: a, hint: "Das ist G vor dem Verschieben. Nach vorne heißt: Zur x-Koordinate kommt etwas dazu." }] }),
              numberField("y =", G[1], "", 1, { slips: [{ value: b, hint: "Das ist G vor dem Verschieben. Nach rechts heißt: Zur y-Koordinate kommt etwas dazu." }] }),
              numberField("z =", G[2], "", 1, { slips: [{ value: t, hint: "Der Karton steht auf dem Tisch: Zur Tischhöhe kommt seine eigene Höhe dazu." }, { value: c, hint: "Der Tisch hebt den Karton an: Zu jeder z-Koordinate kommt die Tischhöhe dazu." }] }),
            ],
            steps: [`Vorher: G(${a} | ${b} | ${c}).`, `Verschieben: x + ${dx}, y + ${dy}; auf den Tisch: z + ${t}.`, `<strong>G′${point3(...G)}</strong>`],
            meta: { ctx, a, b, c, dx, dy, t, x: G[0], y: G[1], z: G[2] },
          };
        }
        if (ctx === 1) {
          const A: [number, number, number] = [rng.int(0, 2), rng.int(1, 3), 0];
          const a = rng.int(2, 5);
          const b = rng.int(2, 5);
          const c = rng.int(1, 4);
          const m = rng.pick([2, 3, 4, 5]);
          const G = cuboidVertex("G", a, b, c, A);
          const C: [number, number, number] = [G[0], G[1] + m, 0];
          return {
            prompt: `Eine Kiste (Quader ABCDEFGH) hat die Ecken A${point3(...A)} und G${point3(...G)}; ihre Kanten sind parallel zu den Achsen. Sie wird um ${m} Einheiten in y-Richtung verschoben. Gib die Koordinaten der verschobenen Ecke C an und die Länge der Kante [BC].`,
            given: [CUBOID_GIVEN],
            fields: [
              numberField("x =", C[0], "", 1),
              numberField("y =", C[1], "", 1, { slips: [{ value: G[1], hint: "Das ist C vor dem Verschieben: Zur y-Koordinate kommt noch die Verschiebung dazu." }] }),
              numberField("z =", C[2], "", 1, { slips: [{ value: G[2], hint: "C liegt in der Grundfläche, unter G: Die z-Koordinate ist die von A." }] }),
              numberField(`${len("BC")} =`, b, "", 1, { slips: [{ value: b + m, hint: "Beim Verschieben ändert sich keine Kantenlänge." }, { value: G[1], hint: "Die Länge ist der Unterschied der y-Koordinaten von G und A." }] }),
            ],
            steps: [`C liegt unter G in der Grundfläche: vorher C(${G[0]} | ${G[1]} | 0).`, `Verschoben um ${m} in y-Richtung: y = ${G[1]} + ${m} = ${G[1] + m}. [BC] läuft in y-Richtung: ${len("BC")} = ${G[1]} − ${A[1]} = ${b}; beim Verschieben bleibt die Länge.`, `<strong>C′${point3(...C)}; ${len("BC")} = ${b}</strong>`],
            meta: { ctx, ax: A[0], ay: A[1], a, b, c, m, x: C[0], y: C[1], z: C[2] },
          };
        }
        const s = rng.pick([2, 3, 4]);
        const n = rng.pick([2, 3]);
        return {
          prompt: `${n === 2 ? "Zwei" : "Drei"} gleiche Würfel mit der Kantenlänge ${s} werden genau übereinandergestapelt. Der unterste Würfel ABCDEFGH hat die Ecke A im Ursprung, und seine Kanten [AB], [AD], [AE] laufen entlang der x-, y- und z-Achse. Gib die Koordinaten der obersten Ecke des Turms an, die senkrecht über C liegt.`,
          given: [CUBOID_GIVEN],
          fields: [numberField("x =", s, "", 1), numberField("y =", s, "", 1), numberField("z =", n * s, "", 1, { slips: [{ value: s, hint: `Das ist die Ecke G des untersten Würfels. Der Turm ist ${n} Würfel hoch.` }] })],
          steps: [`C(${s} | ${s} | 0). Senkrecht darüber ändert sich nur z.`, `Der Turm ist ${n} · ${s} = ${n * s} hoch.`, `<strong>(${s} | ${s} | ${n * s})</strong>`],
          meta: { ctx, s, n, x: s, y: s, z: n * s },
        };
      },
    },
    {
      id: "pyramide-spitze",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const x1 = rng.int(0, 3);
          const y1 = rng.int(0, 3);
          const x2 = x1 + rng.pick([2, 4, 6]);
          const y2 = y1 + rng.pick([2, 4, 6]);
          const z0 = rng.pick([0, 0, 1, 2]);
          const h = rng.int(3, 8);
          const S: [number, number, number] = [(x1 + x2) / 2, (y1 + y2) / 2, z0 + h];
          const zSlips = [{ value: z0, hint: "Die Höhe der Pyramide fehlt: z = Höhe der Grundfläche + h." }, ...(z0 > 0 ? [{ value: h, hint: `Die Grundfläche liegt schon in der Höhe ${z0}: z = ${z0} + ${h}.` }] : [])];
          return {
            prompt: `Die Grundfläche einer geraden Pyramide ABCDS ist das Rechteck ABCD mit A${point3(x1, y1, z0)} und der gegenüberliegenden Ecke C${point3(x2, y2, z0)}; die Kanten sind parallel zur x- und zur y-Achse. Die Pyramide ist ${h} hoch. Gib die Koordinaten der Spitze S an.`,
            given: [],
            formulaHint: "S liegt senkrecht über M, dem Mittelpunkt von [AC]: M((x₁ + x₂) : 2 | (y₁ + y₂) : 2 | z)",
            fields: [
              numberField("x =", S[0], "", 1, { slips: [{ value: x2, hint: "Die Spitze liegt über der Mitte der Grundfläche, nicht über der Ecke C." }, { value: x2 - x1, hint: "Für die Mitte bildest du den Mittelwert (x₁ + x₂) : 2, nicht den Unterschied." }] }),
              numberField("y =", S[1], "", 1, { slips: [{ value: y2, hint: "Die Spitze liegt über der Mitte der Grundfläche, nicht über der Ecke C." }, { value: y2 - y1, hint: "Für die Mitte bildest du den Mittelwert (y₁ + y₂) : 2, nicht den Unterschied." }] }),
              numberField("z =", S[2], "", 1, { slips: zSlips }),
            ],
            steps: [`M ist der Mittelpunkt der Diagonale [AC]: M((${x1} + ${x2}) : 2 | (${y1} + ${y2}) : 2 | ${z0}) = M${point3(S[0], S[1], z0)}.`, `S liegt ${h} senkrecht über M: z = ${z0} + ${h} = ${z0 + h}.`, `<strong>S${point3(...S)}</strong>`],
            meta: { x1, y1, x2, y2, z0, h, x: S[0], y: S[1], z: S[2] },
          };
        }
        const ctx = rng.int(0, 2);
        if (ctx === 0) {
          const p = rng.pick([4, 6, 8]);
          const q = rng.pick([4, 6]);
          const T = rng.pick([8, 10, 12]);
          const r = rng.pick([3, 4, 5]);
          const S: [number, number, number] = [p / 2, q / 2, T + r];
          return {
            prompt: `Ein Turm ist ein Quader mit der Grundfläche ABCD, A(0 | 0 | 0) und C(${p} | ${q} | 0), und der Höhe ${T}. Auf ihm sitzt ein Dach in Form einer geraden Pyramide mit derselben Grundfläche und der Höhe ${r}. Gib die Koordinaten der Dachspitze an.`,
            given: ["Die Kanten des Turms sind parallel zu den Achsen; 1 Einheit = 1 m"],
            fields: [numberField("x =", S[0], "", 1), numberField("y =", S[1], "", 1), numberField("z =", S[2], "", 1, { slips: [{ value: r, hint: "Das Dach sitzt oben auf dem Turm: z = Turmhöhe + Dachhöhe." }, { value: T, hint: "Das ist die Höhe der Dachkante. Die Spitze liegt noch um die Dachhöhe höher." }] })],
            steps: [`Die Spitze liegt über der Mitte der Grundfläche: x = ${p} : 2 = ${fmt(p / 2)}, y = ${q} : 2 = ${fmt(q / 2)}.`, `Das Dach beginnt in der Höhe ${T}: z = ${T} + ${r} = ${T + r}.`, `<strong>${point3(...S)}</strong>`],
            meta: { ctx, p, q, T, r, x: S[0], y: S[1], z: S[2] },
          };
        }
        if (ctx === 1) {
          const L = rng.pick([3, 4, 5]);
          const W = rng.pick([2, 3, 4]);
          const H = rng.pick([1.5, 2, 2.5]);
          return {
            prompt: `Ein Zelt hat die Form eines dreiseitigen Prismas ABCDEF. Es steht auf dem Rechteck ABCD mit A(0 | 0 | 0), B(${L} | 0 | 0), C(${L} | ${W} | 0) und D(0 | ${W} | 0). Der First [EF] ist parallel zu [AB] und liegt ${fmt(H)} hoch genau über der Mittellinie des Bodens; F liegt über der Kante [BC]. Gib die Koordinaten von F und die Länge des Firsts an.`,
            given: ["1 Einheit = 1 m"],
            fields: [
              numberField("x =", L, "", 1),
              numberField("y =", W / 2, "", 2, { slips: [{ value: W, hint: "Der First liegt über der Mitte des Bodens: y = (0 + Breite) : 2." }] }),
              numberField("z =", H, "", 1),
              numberField(`${len("EF")} =`, L, "", 1, { slips: [{ value: W, hint: "Der First ist parallel zu [AB], also so lang wie [AB]." }] }),
            ],
            steps: [`F liegt über der Mitte von [BC]: x = ${L}, y = (0 + ${W}) : 2 = ${fmt(W / 2)}, z = ${fmt(H)}.`, `Der First [EF] ist parallel zu [AB] und gleich lang: ${L}.`, `<strong>F${point3(L, W / 2, H)}; ${len("EF")} = ${L}</strong>`],
            meta: { ctx, L, W, H, x: L, y: W / 2, z: H },
          };
        }
        const x1 = rng.int(0, 2);
        const y1 = rng.int(0, 2);
        const x2 = x1 + rng.pick([2, 4, 6]);
        const y2 = y1 + rng.pick([2, 4, 6]);
        const h = rng.int(3, 6);
        const dy = rng.pick([2, 3, 4]);
        const dz = rng.pick([1, 2, 3]);
        const S: [number, number, number] = [(x1 + x2) / 2, (y1 + y2) / 2 + dy, h + dz];
        return {
          prompt: `Eine gerade Pyramide hat das Rechteck ABCD mit A${point3(x1, y1, 0)} und C${point3(x2, y2, 0)} als Grundfläche und ist ${h} hoch. Sie wird um ${dy} Einheiten in y-Richtung verschoben und auf einen Sockel der Höhe ${dz} gestellt. Gib die Koordinaten der verschobenen Spitze an.`,
          given: ["Die Kanten der Grundfläche sind parallel zur x- und zur y-Achse"],
          fields: [
            numberField("x =", S[0], "", 1),
            numberField("y =", S[1], "", 1, { slips: [{ value: (y1 + y2) / 2, hint: "Das ist die Spitze vor dem Verschieben: Zur y-Koordinate kommt die Verschiebung dazu." }] }),
            numberField("z =", S[2], "", 1, { slips: [{ value: h, hint: "Der Sockel hebt die Pyramide an: z = Höhe + Sockel." }] }),
          ],
          steps: [`Spitze vorher: über M((${x1} + ${x2}) : 2 | (${y1} + ${y2}) : 2 | 0) in der Höhe ${h}, also S${point3((x1 + x2) / 2, (y1 + y2) / 2, h)}.`, `Verschieben: y + ${dy}; Sockel: z + ${dz}.`, `<strong>S′${point3(...S)}</strong>`],
          meta: { ctx, x1, y1, x2, y2, h, dy, dz, x: S[0], y: S[1], z: S[2] },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du bestimmst die Ecken von Quadern, Pyramiden und Prismen im Raum und verschiebst Körper sicher.",
};

// 3.5 Schrägbilder von Prismen und Pyramiden ─────────────────────────────────

/** Verzerrungsmaßstäbe of the tasks, with the true lengths that give simple drawn lengths. */
const Q_CHOICES: Array<{ q: number; text: string; lengths: number[] }> = [
  { q: 0.5, text: "½", lengths: [2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { q: 0.5, text: "½", lengths: [3, 4, 5, 6, 8] },
  { q: 1 / 3, text: "⅓", lengths: [3, 6, 9, 12] },
  { q: 0.25, text: "¼", lengths: [4, 8, 10, 12] },
  { q: 0.75, text: "¾", lengths: [4, 8, 12] },
];

/** Pairs of segments of a pyramid ABCDS with [AB] on s: both undistorted, or at least one distorted. */
export const PYRAMID_TRUE_PAIRS = ["[AB] und [MS]", "[CD] und [MS]", "[AB] und [CD]"];
export const PYRAMID_DISTORTED_PAIRS = ["[BC] und [MS]", "[AB] und [BS]", "[AC] und [MS]", "[AD] und [CD]", "[BC] und [AD]"];

const OBLIQUE_HINT = "Tiefenkante: gezeichnete Länge = q · wahre Länge; Kanten auf s und Höhen in wahrer Größe";

const schraegbilder: Lesson = {
  id: "rg-5-schraegbilder",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "3.5 Schrägbilder von Prismen und Pyramiden",
  subtitle: "Schrägbildachse, Verzerrungswinkel und Verzerrungsmaßstab",
  tracks: ["II_III"],
  lehrplan: `${LP_II}: Schrägbilder`,
  whyItMatters:
    "Ein Schrägbild zeigt einen Körper räumlich auf dem Papier, so dass jeder ihn nach denselben Regeln zeichnen und lesen kann. In der Abschlussprüfung beginnt fast jede Aufgabe zur Raumgeometrie mit dem Schrägbild eines Prismas oder einer Pyramide.",
  explanationHtml: `
    <p><strong>Wiederholung aus M5:</strong> Schrägbilder von Würfeln und Quadern kennst du schon. Damit jeder ein Schrägbild gleich zeichnet, gelten feste Regeln:</p>
    <ul>
      <li>Die <strong>Schrägbildachse s</strong> ist eine waagrechte Gerade. Eine Kante der Grundfläche liegt auf s; sie bildet die Vorderkante.</li>
      <li>Alle Strecken und Flächen parallel zur Zeichenebene erscheinen in <strong>wahrer Größe</strong>: die Vorderfläche, Kanten parallel zu s, senkrechte Kanten und Höhen.</li>
      <li>Kanten, die senkrecht zur Zeichenebene nach hinten laufen, heißen <strong>Tiefenkanten</strong>. Du zeichnest sie unter dem <strong>Verzerrungswinkel ω</strong> zu s (meist 45°) und verkürzt sie mit dem <strong>Verzerrungsmaßstab q</strong> (meist ½): gezeichnete Länge = q · wahre Länge.</li>
      <li><strong>Verdeckte Kanten</strong> zeichnest du gestrichelt.</li>
    </ul>
    <p><strong>Prisma, Schritt für Schritt</strong> (Grundfläche unten, eine Grundkante auf s): 1. Die Grundkante auf s in wahrer Größe zeichnen. 2. Die Tiefenkanten unter ω antragen, Länge q · wahre Länge; so entsteht das Schrägbild der Grundfläche. Ist sie ein Dreieck, trägst du seine Höhe als Tiefenstrecke ab. 3. In jeder Ecke die Höhe des Prismas senkrecht nach oben in wahrer Größe antragen. 4. Die Deckfläche verbinden und die verdeckten Kanten stricheln.</p>
    <p><strong>Pyramide, Schritt für Schritt:</strong> 1. Die Grundfläche wie beim Prisma zeichnen. 2. Die Diagonalen schneiden sich im Mittelpunkt M, dem Fußpunkt der Höhe. 3. Von M aus die Höhe h senkrecht nach oben in wahrer Größe antragen: Das ist die Spitze S. 4. S mit den Ecken verbinden, die Höhe [MS] und verdeckte Kanten stricheln.</p>
    <p><strong>Was sich ändert:</strong> Ein größeres ω lässt die Tiefenkanten steiler laufen, ein kleineres q macht sie kürzer. Welche Fläche vorne in wahrer Größe erscheint, hängt davon ab, welche Kante auf s liegt. Ein rechter Winkel zwischen der Vorderkante und einer Tiefenkante wird im Bild vorne links zum Winkel ω und vorne rechts zum Winkel 180° − ω.</p>
    <div class="example"><strong>Beispiel:</strong> Ein Quader ist 6 cm lang, 4 cm breit und 3 cm hoch; die 6 cm lange Kante liegt auf s, ω = 45°, q = ½.<br>
      1. Vorderkante: 6 cm auf s, in wahrer Größe.<br>
      2. Tiefenkanten: q · 4 cm = ½ · 4 cm = 2 cm, unter 45° nach rechts oben.<br>
      3. Höhen: 3 cm senkrecht, in wahrer Größe.<br>
      4. Die drei Kanten an der hinteren linken unteren Ecke sind verdeckt und werden gestrichelt. In wahrer Größe erscheinen die Vorderfläche 6 cm × 3 cm und die Rückfläche. Legst du stattdessen die 4 cm lange Kante auf s, erscheint vorne die Fläche 4 cm × 3 cm, und die Tiefenkanten werden ½ · 6 cm = 3 cm lang.</div>
    <p>Typische Fehler: Tiefenkanten nicht verkürzen oder durch q teilen statt mit q zu multiplizieren; auch die Höhe verkürzen; ω von der falschen Seite abtragen; verdeckte Kanten durchgezogen zeichnen; die Spitze der Pyramide über einer Ecke statt über M ansetzen.</p>
    <div class="merke"><strong>Merke:</strong> Kanten auf s, alle Strecken parallel zu s und alle senkrechten Strecken erscheinen in wahrer Größe. Tiefenkanten zeichnest du unter dem Verzerrungswinkel ω zu s und mit dem Verzerrungsmaßstab q verkürzt: gezeichnete Länge = q · wahre Länge. Verdeckte Kanten werden gestrichelt.</div>
  `,
  formulas: [
    { name: "Tiefenkante", html: "gezeichnete Länge = q · wahre Länge", quantities: "q Verzerrungsmaßstab (meist ½); gezeichnet unter dem Verzerrungswinkel ω zu s (meist 45°)" },
    { name: "Unverzerrt", html: "Strecken parallel zur Zeichenebene in wahrer Größe", quantities: "Kanten auf s und parallel zu s, senkrechte Kanten und Höhen" },
    { name: "Rechter Winkel im Bild", html: "zwischen Vorderkante und Tiefenkante: ω (links) bzw. 180° − ω (rechts)", quantities: "ω Verzerrungswinkel" },
    { name: "Zurückrechnen", html: "wahre Länge = gezeichnete Länge : q", quantities: "für Tiefenkanten, die du im Schrägbild misst" },
  ],
  quiz: {
    question: "Ein Quader ist 8 cm lang, 6 cm breit und 5 cm hoch. Die 8 cm lange Kante liegt auf der Schrägbildachse, ω = 45°, q = ½. Wie lang zeichnest du die Tiefenkanten?",
    options: ["6 cm", "12 cm", "3 cm", "4 cm"],
    correctIndex: 2,
    explanation:
      "Die Tiefenkanten sind die 6 cm langen Kanten nach hinten; sie werden mit q verkürzt: ½ · 6 cm = 3 cm. 6 cm wäre unverkürzt, 12 cm entsteht, wenn man durch q teilt, und 4 cm wäre die Hälfte der Kante auf s, die gar nicht verkürzt wird.",
  },
  lab: {
    kind: "oblique-drawing",
    title: "Labor: Schrägbild-Werkstatt",
    intro:
      "Wähle Körper, Maße, den Verzerrungswinkel ω, den Verzerrungsmaßstab q und die Kante, die auf der Schrägbildachse s liegt. Orange sind die Tiefenkanten, gestrichelt die verdeckten Kanten. Die Ecken kannst du ziehen.",
    params: [
      { type: "choice", key: "body", label: "Körper", options: OBLIQUE_NAMES.map((label, value) => ({ value, label })), value: 0 },
      { type: "choice", key: "pos", label: "Auf der Schrägbildachse s", options: [{ value: 0, label: "Kante a" }, { value: 1, label: "Kante b" }], value: 0 },
      { type: "range", key: "a", label: "Kante a", unit: "cm", min: 2, max: 7, step: 0.5, value: 5, digits: 1 },
      { type: "range", key: "b", label: "Kante b", unit: "cm", min: 2, max: 7, step: 0.5, value: 4, digits: 1 },
      { type: "range", key: "h", label: "Höhe h", unit: "cm", min: 2, max: 7, step: 0.5, value: 3, digits: 1 },
      { type: "range", key: "omega", label: "Verzerrungswinkel ω", unit: "°", min: 30, max: 90, step: 15, value: 45 },
      { type: "range", key: "q", label: "Verzerrungsmaßstab q", unit: "", min: 0.25, max: 1, step: 0.25, value: 0.5, digits: 2 },
    ],
    readouts: [
      { key: "vorne", label: "Kante auf s", compute: (v) => `${obliqueDims(v).frontName} = ${fmt(obliqueDims(v).front)} cm, unverkürzt` },
      { key: "tiefe", label: "Tiefenkanten im Bild", emphasis: true, compute: (v) => `${qText(v.q)} · ${fmt(obliqueDims(v).depth)} cm = ${fmt(v.q * obliqueDims(v).depth)} cm` },
      { key: "hoehe", label: "Höhe im Bild", compute: (v) => `${fmt(v.h)} cm, unverkürzt` },
      { key: "winkel", label: "rechter Winkel bei A im Bild", unit: "°", digits: 0, compute: (v) => v.omega },
      { key: "wahr", label: "In wahrer Größe", compute: (v) => obliqueTrueSize(v) },
    ],
    goals: [
      {
        id: "raute-bild",
        text: "Stelle einen Quader oder eine Pyramide mit rechteckiger, nicht quadratischer Grundfläche so ein, dass die Grundfläche im Schrägbild (ω unter 90°) wie eine Raute aussieht: alle vier Seiten im Bild gleich lang. Wie hängen q, die Tiefenkante und die Kante auf s dann zusammen, und warum ist diese Raute kein Quadrat?",
        check: (v) => {
          const { front, depth } = obliqueDims(v);
          // the drawn depth edge q · depth as long as the edge on s; at ω < 90° the right angle is drawn as ω: a rhombus, no square
          return (v.body === 0 || v.body === 2) && v.omega < 90 && front !== depth && Math.abs(v.q * depth - front) < 1e-9;
        },
      },
      {
        id: "tiefe-zwei",
        text: "Lege das dreiseitige Prisma so, dass die längere Kathete seines Grunddreiecks in die Tiefe läuft, und wähle ihre Länge und q so, dass sie im Bild genau 2 cm lang ist.",
        check: (v) => {
          const { front, depth } = obliqueDims(v);
          return v.body === 1 && depth > front && v.q * depth === 2;
        },
      },
      {
        id: "wahre-flaeche",
        text: "Ein Quader ist 6 cm lang, 4 cm breit und 3 cm hoch. Stelle ihn so ein, dass seine 4 cm × 3 cm große Seitenfläche vorne in wahrer Größe erscheint.",
        check: (v) => {
          const { front, depth } = obliqueDims(v);
          return v.body === 0 && front === 4 && depth === 6 && v.h === 3;
        },
      },
    ],
  },
  exercises: [
    {
      id: "zeichnen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const body = rng.int(0, 2);
          const qc = rng.pick(Q_CHOICES);
          const omega = rng.pick([45, 45, 30, 60]);
          const depth = rng.pick(qc.lengths);
          const front = rng.pick([4, 5, 6, 7, 8].filter((x) => x !== depth));
          const h = rng.pick([3, 4, 5, 6, 7, 8]);
          const drawn = qc.q * depth;
          const names = [
            { body: `Von einem Quader ABCDEFGH sind ${len("AB")} = ${front} cm, ${len("BC")} = ${depth} cm und ${len("AE")} = ${h} cm bekannt.`, front: "AB", depth: "BC", height: "AE" },
            { body: `Ein gerades Prisma ABCDEF hat als Grundfläche das rechtwinklige Dreieck ABC mit dem rechten Winkel bei A, ${len("AB")} = ${front} cm und ${len("AC")} = ${depth} cm; die Höhe [AD] des Prismas ist ${h} cm lang.`, front: "AB", depth: "AC", height: "AD" },
            { body: `Eine gerade Pyramide ABCDS hat das Rechteck ABCD mit ${len("AB")} = ${front} cm und ${len("BC")} = ${depth} cm als Grundfläche; ihre Höhe [MS] ist ${h} cm lang.`, front: "AB", depth: "BC", height: "MS" },
          ][body];
          return {
            prompt: `${names.body} Im Schrägbild liegt [AB] auf der Schrägbildachse, ω = ${omega}°, q = ${qc.text}. Wie lang zeichnest du [${names.front}], die Tiefenkante [${names.depth}] und die Höhe [${names.height}]?`,
            given: [],
            formulaHint: OBLIQUE_HINT,
            fields: [
              numberField(`${len(names.front)} im Bild:`, front, "cm", 2, { slips: [{ value: qc.q * front, hint: "Die Kante auf s liegt in der Zeichenebene und bleibt unverkürzt." }] }),
              numberField(`${len(names.depth)} im Bild:`, drawn, "cm", 2, { slips: [{ value: depth, hint: "Tiefenkanten werden verkürzt: gezeichnete Länge = q · wahre Länge." }, { value: depth / qc.q, hint: "Mit q multiplizieren, nicht durch q teilen: Die Tiefenkante wird kürzer, nicht länger." }] }),
              numberField(`${len(names.height)} im Bild:`, h, "cm", 2, { slips: [{ value: qc.q * h, hint: "Die Höhe steht senkrecht, parallel zur Zeichenebene: Sie bleibt unverkürzt." }] }),
            ],
            steps: [
              `[${names.front}] liegt auf s und [${names.height}] steht senkrecht: beide in wahrer Größe, ${front} cm und ${h} cm.`,
              `[${names.depth}] läuft nach hinten: ${qc.text} · ${depth} cm = ${fmtUnit(drawn, "cm")}, gezeichnet unter ${omega}° zu s.`,
              `<strong>im Bild: ${len(names.front)} = ${front} cm; ${len(names.depth)} = ${fmtUnit(drawn, "cm")}; ${len(names.height)} = ${h} cm</strong>`,
            ],
            meta: { body, q: qc.q, omega, front, depth, h },
          };
        }
        const kind = rng.int(0, 1);
        const omega = rng.pick([30, 45, 60]);
        if (kind === 0) {
          const qc = rng.pick(Q_CHOICES);
          const b = rng.pick(qc.lengths);
          const a = rng.pick([5, 6, 7, 8, 9].filter((x) => x !== b));
          const h = rng.pick([6, 7, 8, 9]);
          const pair = rng.pick(PYRAMID_TRUE_PAIRS);
          return {
            prompt: `Die Grundfläche der geraden Pyramide ABCDS ist das Rechteck ABCD mit ${len("AB")} = ${a} cm und ${len("BC")} = ${b} cm. Die Spitze S liegt ${h} cm senkrecht über dem Diagonalenschnittpunkt M. Im Schrägbild liegt [AB] auf der Schrägbildachse; ω = ${omega}°, q = ${qc.text}. Wie lang werden [BC] und [MS] gezeichnet? Wie groß erscheint der Winkel ∢CBA? Welches Streckenpaar erscheint in wahrer Größe?`,
            given: [],
            fields: [
              numberField(`${len("BC")} im Bild:`, qc.q * b, "cm", 2, { slips: [{ value: b, hint: "[BC] ist eine Tiefenkante und wird mit q verkürzt." }, { value: b / qc.q, hint: "Mit q multiplizieren, nicht durch q teilen." }] }),
              numberField(`${len("MS")} im Bild:`, h, "cm", 2, { slips: [{ value: qc.q * h, hint: "Die Höhe [MS] steht senkrecht und wird nicht verkürzt." }] }),
              numberField("∢CBA im Bild:", 180 - omega, "°", 0, { slips: [{ value: omega, hint: "ω liegt vorne links bei A. Bei B liegt der Nebenwinkel: 180° − ω." }, { value: 90, hint: "In Wirklichkeit ist ∢CBA ein rechter Winkel, im Schrägbild nicht: Die Tiefenkante läuft unter ω." }] }),
              shuffledChoice(rng, "In wahrer Größe:", pair, rng.shuffle(PYRAMID_DISTORTED_PAIRS).slice(0, 3)),
            ],
            steps: [
              `[BC] läuft in die Tiefe: ${qc.text} · ${b} cm = ${fmtUnit(qc.q * b, "cm")}. [MS] steht senkrecht: ${h} cm.`,
              `Bei B liegen die Tiefenkante [BC] (unter ${omega}° nach rechts oben) und die Kante [BA] (nach links): ∢CBA = 180° − ${omega}° = ${180 - omega}°.`,
              `In wahrer Größe erscheinen die Kanten parallel zu s, [AB] und [CD], und die senkrechte Höhe [MS]; Tiefenkanten, Diagonalen und Seitenkanten sind verzerrt.`,
              `<strong>im Bild: ${len("BC")} = ${fmtUnit(qc.q * b, "cm")}, ${len("MS")} = ${h} cm, ∢CBA = ${180 - omega}°; wahre Größe: ${pair}</strong>`,
            ],
            meta: { kind, q: qc.q, omega, a, b, h },
          };
        }
        const [L, B, H] = rng.shuffle([4, 5, 6, 8]).slice(0, 3);
        const onS = rng.next() < 0.5 ? B : L;
        const depth = onS === B ? L : B;
        return {
          prompt: `Ein Quader ist ${L} cm lang, ${B} cm breit und ${H} cm hoch. Er wird so gezeichnet, dass die ${onS} cm lange Kante der Grundfläche auf der Schrägbildachse liegt (ω = ${omega}°, q = ½). Welche Fläche erscheint vorne in wahrer Größe? Wie lang werden die Tiefenkanten gezeichnet? Wie groß erscheint der rechte Winkel der Grundfläche vorne rechts?`,
          given: [],
          fields: [
            shuffledChoice(rng, "vorne in wahrer Größe:", `die Fläche ${onS} cm × ${H} cm`, [`die Fläche ${depth} cm × ${H} cm`, `die Fläche ${L} cm × ${B} cm`, "keine Fläche"]),
            numberField("Tiefenkanten im Bild:", depth / 2, "cm", 2, {
              slips:
                onS / 2 === depth
                  ? [{ value: depth, hint: "Die Kante auf s wird nicht verkürzt, und die Tiefenkante wird mit q = ½ verkürzt: ½ · wahre Länge der Tiefenkante." }]
                  : [{ value: onS / 2, hint: "Die Kante auf s wird nicht verkürzt. In die Tiefe läuft die andere Kante der Grundfläche." }, { value: depth, hint: "Tiefenkanten werden mit q = ½ verkürzt." }],
            }),
            numberField("Winkel vorne rechts:", 180 - omega, "°", 0, { slips: [{ value: omega, hint: "ω liegt vorne links. Vorne rechts liegt der Nebenwinkel 180° − ω." }] }),
          ],
          steps: [
            `Auf s liegt die ${onS} cm lange Kante; mit der Höhe bildet sie die Vorderfläche ${onS} cm × ${H} cm in wahrer Größe.`,
            `In die Tiefe läuft die ${depth} cm lange Kante: ½ · ${depth} cm = ${fmtUnit(depth / 2, "cm")}. Vorne rechts liegen die Kante auf s und eine Tiefenkante: 180° − ${omega}° = ${180 - omega}°.`,
            `<strong>die Fläche ${onS} cm × ${H} cm; ${fmtUnit(depth / 2, "cm")}; ${180 - omega}°</strong>`,
          ],
          meta: { kind, omega, L, B, H, onS, depth },
        };
      },
    },
    {
      id: "zurueck",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const qc = rng.pick(Q_CHOICES);
          const omega = rng.pick([45, 45, 30, 60]);
          const depth = rng.pick(qc.lengths);
          const front = rng.pick([4, 5, 6, 7, 8]);
          const h = rng.pick([3, 4, 5, 6]);
          const drawn = qc.q * depth;
          return {
            prompt: `Im Schrägbild eines Quaders ABCDEFGH (ω = ${omega}°, q = ${qc.text}) liegt [AB] auf der Schrägbildachse. Im Bild misst du: [AB] ist ${front} cm lang, die Tiefenkante [BC] ${fmtUnit(drawn, "cm")} und die Höhe [BF] ${h} cm. Wie lang sind die drei Kanten in Wirklichkeit?`,
            given: [],
            formulaHint: "wahre Länge einer Tiefenkante = gezeichnete Länge : q; Kanten auf s und Höhen sind unverkürzt",
            fields: [
              numberField(`${len("AB")} =`, front, "cm", 2),
              numberField(`${len("BC")} =`, depth, "cm", 2, { slips: [{ value: drawn * qc.q, hint: "Im Bild ist die Tiefenkante schon verkürzt. Zurück rechnest du mit: gezeichnete Länge : q." }, { value: drawn, hint: "Die Tiefenkante ist im Bild verkürzt; teile durch q." }] }),
              numberField(`${len("BF")} =`, h, "cm", 2, { slips: [{ value: h / qc.q, hint: "Die Höhe ist im Bild nicht verkürzt: Sie ist so lang wie in Wirklichkeit." }] }),
            ],
            steps: [`[AB] liegt auf s und [BF] steht senkrecht: Beide sind unverkürzt, ${front} cm und ${h} cm.`, `[BC] ist eine Tiefenkante: ${fmt(drawn)} cm : ${qc.text} = ${depth} cm.`, `<strong>${len("AB")} = ${front} cm, ${len("BC")} = ${depth} cm, ${len("BF")} = ${h} cm</strong>`],
            meta: { q: qc.q, omega, front, depth, h, drawn },
          };
        }
        const qc = rng.pick(Q_CHOICES);
        const square = rng.next() < 0.5;
        const b = rng.pick(qc.lengths);
        const a = square ? b : rng.pick([4, 5, 6, 7, 8, 9, 10].filter((x) => x !== b));
        const h = rng.pick([5, 6, 7, 8]);
        const drawn = qc.q * b;
        return {
          prompt: `Im Schrägbild einer geraden Pyramide ABCDS mit rechteckiger Grundfläche liegt [AB] auf der Schrägbildachse (ω = 45°, q = ${qc.text}). Im Bild misst du: [AB] ist ${a} cm lang, [BC] ${fmtUnit(drawn, "cm")} und die Höhe [MS] ${h} cm. Wie lang ist [BC] in Wirklichkeit? Wie groß ist der Flächeninhalt der Grundfläche? Ist die Grundfläche ein Quadrat?`,
          given: [],
          fields: [
            numberField(`${len("BC")} =`, b, "cm", 2, { slips: [{ value: drawn, hint: "Im Bild ist [BC] verkürzt. Die wahre Länge ist gezeichnete Länge : q." }, { value: drawn * qc.q, hint: "Zurück rechnest du mit : q, nicht mit · q." }] }),
            numberField("Grundfläche:", a * b, "cm²", 2, { slips: [{ value: a * drawn, hint: "Für den Flächeninhalt brauchst du die wahre Länge von [BC], nicht die Bildlänge." }] }),
            yesNo("Quadrat?", square),
          ],
          steps: [`[BC] ist eine Tiefenkante: ${fmt(drawn)} cm : ${qc.text} = ${b} cm.`, `Grundfläche: ${a} cm · ${b} cm = ${a * b} cm². ${square ? "Beide Kanten sind gleich lang: ein Quadrat, auch wenn es im Bild wie ein Parallelogramm aussieht." : "Die Kanten sind verschieden lang: ein Rechteck, kein Quadrat."}`, `<strong>${len("BC")} = ${b} cm; ${a * b} cm²; Quadrat: ${jaNein(square)}</strong>`],
          meta: { q: qc.q, a, b, h, drawn, square: square ? 1 : 0 },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du zeichnest und liest Schrägbilder mit Verzerrungswinkel, Verzerrungsmaßstab und Schrägbildachse.",
};

// 3.6 Strecken und Winkel in wahrer Größe ───────────────────────────────────

/**
 * Angles a Level-1 task asks for in true size; the stage test checks how they
 * look in the Schrägbild (ω = 45°, q = ½). Each name ∢XYZ is measured
 * counterclockwise from ray YX to ray YZ in the Schrägbild ([AB] on s, the
 * Tiefenkanten to the right and up), as Bavarian books name angles.
 */
export const ANGLE_CASES: Array<{ body: string; name: string; where: string; value: number; picture: "kleiner" | "gleich" | "größer"; why: string }> = [
  { body: "einem Würfel ABCDEFGH mit der Kantenlänge 4 cm", name: "∢BAC", where: "zwischen der Kante [AB] und der Flächendiagonale [AC] der Grundfläche", value: 45, picture: "kleiner", why: "Die Grundfläche ist ein Quadrat: Die Diagonale halbiert den rechten Winkel, 90° : 2 = 45°." },
  { body: "einem Würfel ABCDEFGH mit der Kantenlänge 4 cm", name: "∢FBA", where: "zwischen den Kanten [BF] und [BA] der Vorderfläche", value: 90, picture: "gleich", why: "Die Vorderfläche ist ein Quadrat: rechter Winkel. Sie liegt parallel zur Zeichenebene und erscheint unverzerrt." },
  { body: "einem Quader ABCDEFGH (6 cm × 4 cm × 3 cm)", name: "∢BAD", where: "zwischen der Kante [AB] auf s und der Tiefenkante [AD]", value: 90, picture: "kleiner", why: "Die Grundfläche ist ein Rechteck: rechter Winkel. Im Bild läuft [AD] unter ω = 45° zu s." },
  { body: "einem Quader ABCDEFGH (6 cm × 4 cm × 3 cm)", name: "∢CBA", where: "zwischen der Tiefenkante [BC] und der Kante [BA]", value: 90, picture: "größer", why: "Die Grundfläche ist ein Rechteck: rechter Winkel. Im Bild ist er 180° − 45° = 135° groß." },
  { body: "einem Quader ABCDEFGH (6 cm × 4 cm × 3 cm)", name: "∢CBF", where: "zwischen der Tiefenkante [BC] und der senkrechten Kante [BF]", value: 90, picture: "kleiner", why: "Die rechte Seitenfläche ist ein Rechteck: rechter Winkel. Im Bild steht [BF] senkrecht und [BC] läuft unter 45°: 90° − 45° = 45°." },
  { body: "einer quadratischen Pyramide ABCDS mit acht gleich langen Kanten von je 4 cm", name: "∢BAS", where: "in der Seitenfläche ABS bei der Ecke A", value: 60, picture: "kleiner", why: "Die Seitenfläche hat drei gleich lange Seiten: ein gleichseitiges Dreieck mit lauter 60°-Winkeln." },
  { body: "einem Würfel ABCDEFGH mit der Kantenlänge 4 cm", name: "∢ACB", where: "zwischen der Flächendiagonale [CA] und der Tiefenkante [CB]", value: 45, picture: "kleiner", why: "Im Quadrat ABCD halbiert die Diagonale den rechten Winkel bei C: 45°." },
  { body: "einem Quader ABCDEFGH (6 cm × 4 cm × 3 cm)", name: "∢AEH", where: "zwischen der senkrechten Kante [EA] und der Tiefenkante [EH]", value: 90, picture: "größer", why: "Die linke Seitenfläche ist ein Rechteck: rechter Winkel. Im Bild ist er 90° + 45° = 135° groß." },
];
export const COMPARE = ["kleiner als in Wirklichkeit", "genauso groß", "größer als in Wirklichkeit"];

/** Segments and angles of a cuboid ABCDEFGH with [AB] on s: in the front face ABFE undistorted, elsewhere distorted. */
export const TRUE_SEGMENTS = ["die Kante [BF]", "die Kante [AE]", "die Kante [EF]"];
export const DISTORTED_SEGMENTS = ["die Tiefenkante [BC]", "die Tiefenkante [AD]", "die Tiefenkante [FG]", "die Diagonale [AC]", "die Diagonale [BG]"];
/** Named counterclockwise in the Schrägbild, like ANGLE_CASES. */
export const TRUE_ANGLES = ["∢FBA", "∢BAE", "∢AEF", "∢EFB"];
export const DISTORTED_ANGLES = ["∢CBA", "∢BAD", "∢CBF", "∢DAE", "∢GCB"];

/** A face diagonal as a pupil measures it in a true-size drawing: to a tenth of a centimetre. */
export function measured(a: number, b: number): number {
  return Math.round(Math.hypot(a, b) * 10) / 10;
}

const wahreGroesse: Lesson = {
  id: "rg-6-wahre-groesse",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "3.6 Strecken und Winkel in wahrer Größe",
  subtitle: "Ebene Figuren aus dem Schrägbild entnehmen",
  tracks: ["II_III"],
  lehrplan: `${LP_II}: Ebene Figuren in wahrer Größe`,
  whyItMatters:
    "Im Schrägbild sind Diagonalen, Seitenkanten und viele Winkel verzerrt; wer sie dort abmisst, misst falsch. Mit einer Figur in wahrer Größe bestimmst du sie richtig, etwa die Länge eines Dachsparrens oder die Neigung einer Pyramidenseite.",
  explanationHtml: `
    <p>Im Schrägbild sind nur Strecken parallel zur Zeichenebene unverzerrt. Tiefenkanten sind verkürzt, und schräge Strecken wie Diagonalen oder die Seitenkanten einer Pyramide erscheinen verzerrt, ebenso die Winkel zwischen ihnen: Ein rechter Winkel der Grundfläche sieht bei ω = 45° im Bild aus wie 45° oder 135°, und eine Raumdiagonale ist im Bild nicht so lang wie in Wirklichkeit. Messen darfst du im Schrägbild deshalb nur unverzerrte Strecken.</p>
    <p><strong>So ermittelst du eine Strecke oder einen Winkel:</strong></p>
    <ol class="steps">
      <li>Suche eine ebene Figur im Körper, in der die gesuchte Strecke oder der gesuchte Winkel liegt und von der du genug wahre Längen kennst.</li>
      <li>Bestimme diese wahren Längen: Kanten auf s und Höhen sind unverkürzt; eine Tiefenkante misst du im Bild und teilst durch q.</li>
      <li>Zeichne die Figur in wahrer Größe neben das Schrägbild, mit rechten Winkeln dort, wo der Körper rechte Winkel hat.</li>
      <li>Miss die gesuchte Strecke oder den gesuchten Winkel in dieser Zeichnung.</li>
    </ol>
    <table class="mini">
      <tr><th>gesucht</th><th>Figur in wahrer Größe</th><th>bekannte Stücke</th></tr>
      <tr><td>Flächendiagonale [AC] eines Quaders</td><td>Grundfläche ABCD, ein Rechteck</td><td>[AB], [BC], rechter Winkel bei B</td></tr>
      <tr><td>Raumdiagonale [AG] eines Quaders</td><td>Diagonalschnitt ACGE, ein Rechteck</td><td>[AC] aus der Grundfläche, Höhe [CG]</td></tr>
      <tr><td>Seitenkante [AS] einer Pyramide</td><td>Dreieck AMS, rechter Winkel bei M</td><td>halbe Diagonale [AM], Höhe [MS]</td></tr>
      <tr><td>Höhe der Seitenfläche ABS</td><td>Dreieck NMS (N Mitte von [AB]), rechter Winkel bei M</td><td>${len("NM")} = ½ · ${len("BC")}, Höhe [MS]</td></tr>
    </table>
    <p><strong>Winkel, die du ohne Messen kennst:</strong> Rechte Winkel des Körpers bleiben in wahrer Größe rechte Winkel. Die Diagonale eines Quadrats bildet mit seinen Seiten 45°. In einem gleichseitigen Dreieck, etwa der Seitenfläche einer Pyramide mit lauter gleich langen Kanten, misst jeder Winkel 60°. Im Schrägbild dagegen erscheint der Winkel zwischen einer Vorderkante und einer Tiefenkante als ω oder 180° − ω.</p>
    <div class="example"><strong>Beispiel:</strong> Ein Quader ist 6 cm lang und 3 cm hoch; im Schrägbild (ω = 45°, q = ½) ist die Tiefenkante [BC] 2 cm lang. Gesucht ist die Raumdiagonale [AG].<br>
      1. Figur: [AG] liegt im Diagonalschnitt ACGE, in Wahrheit ein Rechteck.<br>
      2. Wahre Längen: ${len("BC")} = 2 cm : ½ = 4 cm. Zeichne die Grundfläche 6 cm × 4 cm in wahrer Größe und miss die Diagonale: ${len("AC")} ≈ 7,2 cm.<br>
      3. Zeichne das Rechteck ACGE mit ${len("AC")} ≈ 7,2 cm und ${len("CG")} = 3 cm.<br>
      4. Miss: ${len("AG")} ≈ 7,8 cm. Im Schrägbild ist [AG] dagegen etwa 8,6 cm lang.</div>
    <p>Typische Fehler: die Strecke direkt im Schrägbild messen; die Tiefenkante mit ihrer Bildlänge statt der wahren Länge zeichnen; eine Figur wählen, in der nur eine Seite bekannt ist; einen rechten Winkel so zeichnen, wie er im Schrägbild aussieht.</p>
    <div class="merke"><strong>Merke:</strong> Verzerrte Strecken und Winkel ermittelst du an einer ebenen Figur in wahrer Größe: Figur mit der gesuchten Größe wählen, ihre wahren Längen bestimmen (Tiefenkante = Bildlänge : q), die Figur mit ihren rechten Winkeln zeichnen und dort messen.</div>
  `,
  formulas: [
    { name: "Wahre Länge einer Tiefenkante", html: "wahre Länge = gezeichnete Länge : q", quantities: "q Verzerrungsmaßstab" },
    { name: "Raumdiagonale eines Quaders", html: "im Rechteck ACGE", quantities: "[AC] Flächendiagonale aus der Grundfläche, [CG] Höhe" },
    { name: "Seitenkante einer Pyramide", html: "im Dreieck AMS mit dem rechten Winkel bei M", quantities: "[AM] halbe Diagonale der Grundfläche, [MS] Höhe" },
    { name: "Feste Winkel", html: "Quadratdiagonale und Seite: 45°; gleichseitiges Dreieck: 60°; rechte Winkel bleiben 90°", quantities: "in wahrer Größe, nicht im Schrägbild" },
  ],
  quiz: {
    question: "Gesucht ist die Länge der Seitenkante [CS] einer geraden quadratischen Pyramide ABCDS; die Spitze S liegt über dem Mittelpunkt M der Grundfläche. Welche Figur zeichnest du in wahrer Größe?",
    options: ["die Seitenfläche BCS, so wie sie im Schrägbild aussieht", "das Dreieck MCS mit dem rechten Winkel bei M", "die Grundfläche ABCD", "das Dreieck ABS"],
    correctIndex: 1,
    explanation:
      "Im Dreieck MCS kennst du zwei Seiten in wahrer Größe, die Höhe [MS] und die halbe Diagonale [MC] aus der Grundfläche, und der Winkel bei M ist ein rechter. Die Seitenfläche BCS ist im Schrägbild verzerrt, und von ihr kennst du gerade die gesuchte Seite nicht.",
  },
  lab: {
    kind: "true-size",
    title: "Labor: Wahre Größe",
    intro:
      "Links das Schrägbild (q = ½) mit der gewählten Figur in Türkis, rechts dieselbe Figur in wahrer Größe. Dort misst das Labor die gesuchte Strecke und den Winkel; unten steht zum Vergleich, wie groß der Winkel im Schrägbild aussieht.",
    params: [
      { type: "choice", key: "body", label: "Körper", options: TRUE_BODIES.map((label, value) => ({ value, label })), value: 0 },
      { type: "choice", key: "figQ", label: "Figur im Quader", options: TRUE_FIGURES[0].map((label, value) => ({ value, label })), value: 1, showIf: (v) => v.body === 0 },
      { type: "choice", key: "figP", label: "Figur in der Pyramide", options: TRUE_FIGURES[1].map((label, value) => ({ value, label })), value: 0, showIf: (v) => v.body === 1 },
      { type: "range", key: "a", label: "Kante [AB]", unit: "cm", min: 2, max: 7, step: 0.5, value: 6, digits: 1 },
      { type: "range", key: "b", label: "Kante [BC]", unit: "cm", min: 2, max: 7, step: 0.5, value: 4, digits: 1 },
      { type: "range", key: "h", label: "Höhe", unit: "cm", min: 2, max: 7, step: 0.5, value: 3, digits: 1 },
      { type: "range", key: "omega", label: "Verzerrungswinkel ω", unit: "°", min: 30, max: 90, step: 15, value: 45 },
    ],
    readouts: [
      { key: "figur", label: "Figur", compute: (v) => `${trueFigure(v).name}: in Wahrheit ${trueFigure(v).shape}` },
      { key: "bekannt", label: "Bekannt", compute: (v) => trueFigure(v).known },
      { key: "strecke", label: "Gesuchte Strecke (gemessen)", emphasis: true, compute: (v) => `${lenText(trueFigure(v).wantedName.slice(1, -1))} ≈ ${fmt(trueFigure(v).length, 1)} cm` },
      { key: "wahr", label: "Winkel in wahrer Größe", compute: (v) => `${trueFigure(v).angle.name} ≈ ${fmt(trueFigure(v).angle.value, 1)}°` },
      { key: "bild", label: "Derselbe Winkel im Schrägbild", compute: (v) => `${trueFigure(v).angle.name} ≈ ${fmt(drawnAngle(v), 1)}°` },
    ],
    goals: [
      {
        id: "hoehe-kante",
        text: "Wähle die Figur, in der die Höhe der Pyramide und eine Seitenkante zusammen vorkommen. Welcher Winkel ist darin ein rechter?",
        check: (v) => v.body === 1 && v.figP === 1,
      },
      {
        id: "diagonale-45",
        text: "Stelle die Grundfläche des Quaders so ein, dass die Diagonale [AC] in wahrer Größe mit der Kante [AB] einen Winkel von 45° bildet. Wie groß sieht der Winkel im Schrägbild aus?",
        check: (v) => v.body === 0 && v.figQ === 0 && v.a === v.b,
      },
      {
        id: "gleichseitig",
        text: "Stelle die Pyramide so ein, dass ihre Seitenfläche ABS in wahrer Größe ein gleichseitiges Dreieck ist: Die Seitenkante [AS] muss so lang sein wie [AB] (auf 2 % genau).",
        check: (v) => v.body === 1 && v.figP === 0 && Math.abs(trueFigure(v).length - v.a) <= 0.02 * v.a,
      },
    ],
  },
  exercises: [
    {
      id: "tiefenkanten",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const qc = rng.pick(Q_CHOICES);
          const depth = rng.pick(qc.lengths);
          const front = rng.pick([4, 5, 6, 7]);
          const h = rng.pick([3, 4, 5, 6]);
          const drawn = qc.q * depth;
          const seg = rng.pick(TRUE_SEGMENTS);
          const ang = rng.pick(TRUE_ANGLES);
          return {
            prompt: `Im Schrägbild eines Quaders ABCDEFGH (ω = 45°, q = ${qc.text}) liegt [AB] auf der Schrägbildachse. Im Bild misst du: [AB] ist ${front} cm lang, die Tiefenkante [BC] ${fmtUnit(drawn, "cm")} und [BF] ${h} cm. Wie lang ist [BC] in Wirklichkeit? Welche Strecke darfst du im Schrägbild in wahrer Größe abmessen, und welcher Winkel erscheint dort unverzerrt?`,
            given: [],
            formulaHint: "wahre Länge einer Tiefenkante = gezeichnete Länge : q; unverzerrt sind nur Strecken und Winkel parallel zur Zeichenebene",
            fields: [
              numberField(`${len("BC")} =`, depth, "cm", 2, { slips: [{ value: drawn, hint: "Das ist die Bildlänge. Tiefenkanten sind verkürzt: wahre Länge = Bildlänge : q." }, { value: drawn * qc.q, hint: "Zurück rechnest du mit : q, nicht mit · q." }] }),
              shuffledChoice(rng, "Strecke in wahrer Größe:", seg, rng.shuffle(DISTORTED_SEGMENTS).slice(0, 3)),
              shuffledChoice(rng, "Winkel unverzerrt:", ang, rng.shuffle(DISTORTED_ANGLES).slice(0, 3)),
            ],
            steps: [`[BC] ist eine Tiefenkante: ${fmt(drawn)} cm : ${qc.text} = ${depth} cm.`, `Unverzerrt ist alles in der Vorderfläche ABFE, denn sie liegt parallel zur Zeichenebene: ${seg.replace("die ", "")} und der rechte Winkel ${ang}. Tiefenkanten, Diagonalen und Winkel an einer Tiefenkante sind verzerrt.`, `<strong>${len("BC")} = ${depth} cm; ${seg}; ${ang}</strong>`],
            meta: { q: qc.q, depth, front, h, drawn },
          };
        }
        const qc = rng.pick(Q_CHOICES.slice(0, 3));
        const b = rng.pick(qc.lengths.filter((x) => x <= 9));
        const a = rng.pick([4, 5, 6, 7, 8].filter((x) => x !== b));
        const h = rng.pick([5, 6, 7, 8, 9]);
        const d = measured(a, b);
        const corner = rng.pick(["A", "B", "C", "D"]);
        const face = ({ A: "ABS", B: "BCS", C: "CDS", D: "DAS" } as Record<string, string>)[corner];
        return {
          prompt: `Von einer geraden Pyramide ABCDS mit rechteckiger Grundfläche ist ein Schrägbild gezeichnet ([AB] auf s, ω = 45°, q = ${qc.text}). Im Bild misst du: [AB] ist ${a} cm lang, [BC] ${fmtUnit(qc.q * b, "cm")} und die Höhe [MS] ${h} cm. Gesucht ist die Seitenkante [${corner}S]. Wie lang ist [BC] in Wirklichkeit? In welcher Figur zeichnest du [${corner}S] in wahrer Größe? Die Diagonale [AC] hast du in der Grundfläche in wahrer Größe zu ${fmt(d)} cm gemessen: Wie lang ist die Seite [${corner}M] dieser Figur?`,
          given: [],
          fields: [
            numberField(`${len("BC")} =`, b, "cm", 2, { slips: [{ value: qc.q * b, hint: "Das ist die Bildlänge. Die wahre Länge ist Bildlänge : q." }] }),
            shuffledChoice(rng, "Figur:", `das Dreieck ${corner}MS mit dem rechten Winkel bei M`, [`die Seitenfläche ${face}, wie sie im Schrägbild aussieht`, "die Grundfläche ABCD", "das Dreieck NMS mit N in der Mitte von [AB]"]),
            numberField(`${len(`${corner}M`)} =`, d / 2, "cm", 2, { slips: [{ value: d, hint: "M halbiert die Diagonale: Die Seite zur Ecke ist die halbe Diagonale." }, { value: a / 2, hint: "M ist der Mittelpunkt der Diagonale, nicht der Kante: Nimm die halbe Diagonale." }] }),
          ],
          steps: [
            `[BC] ist eine Tiefenkante: ${fmt(qc.q * b)} cm : ${qc.text} = ${b} cm.`,
            `[${corner}S] liegt im Dreieck ${corner}MS: Die Höhe [MS] ist ${h} cm lang, [${corner}M] ist die halbe Diagonale, und bei M ist ein rechter Winkel. Die Seitenfläche ist im Bild verzerrt, und ihre Seitenkante ist ja gerade gesucht.`,
            `${corner === "A" || corner === "C" ? `M halbiert die Diagonale [AC]` : `[${corner}M] ist die halbe Diagonale [BD]; im Rechteck sind beide Diagonalen gleich lang und halbieren sich`}: ${len(`${corner}M`)} = ${fmt(d)} cm : 2 = ${fmtUnit(d / 2, "cm")}`,
            `<strong>${len("BC")} = ${b} cm; Dreieck ${corner}MS; ${len(`${corner}M`)} = ${fmtUnit(d / 2, "cm")}</strong>`,
          ],
          meta: { q: qc.q, a, b, h, d },
        };
      },
    },
    {
      id: "winkel-figur",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const index = rng.int(0, ANGLE_CASES.length - 1);
          const c = ANGLE_CASES[index];
          const answer = c.picture === "kleiner" ? 0 : c.picture === "gleich" ? 1 : 2;
          return {
            prompt: `In ${c.body} betrachtest du den Winkel ${c.name} ${c.where}. Wie groß ist er in Wirklichkeit? Wie erscheint er im Schrägbild mit ω = 45° und q = ½, wenn [AB] auf der Schrägbildachse liegt?`,
            given: [],
            formulaHint: "rechte Winkel bleiben in wahrer Größe 90°; Quadratdiagonale: 45°; gleichseitiges Dreieck: 60°",
            fields: [
              numberField(`${c.name} =`, c.value, "°", 0, {
                slips:
                  c.value === 90
                    ? [45, 135].map((value) => ({ value, hint: "So groß kann der Winkel im Schrägbild aussehen. In Wirklichkeit ist er ein rechter Winkel." }))
                    : c.value === 60
                      ? [{ value: 90, hint: "Die Seitenfläche hat drei gleich lange Seiten: ein gleichseitiges Dreieck, jeder Winkel misst 60°." }]
                      : [{ value: 90, hint: "Die Diagonale halbiert den rechten Winkel des Quadrats: Es sind nicht 90°." }],
              }),
              choiceField("im Schrägbild:", COMPARE, answer),
            ],
            steps: [c.why, c.picture === "gleich" ? "Im Schrägbild: Der Winkel liegt parallel zur Zeichenebene und erscheint genauso groß." : `Im Schrägbild erscheint der Winkel ${c.picture} als in Wirklichkeit, denn die Fläche, in der er liegt, ist nicht parallel zur Zeichenebene.`, `<strong>${c.name} = ${c.value}°; im Schrägbild ${COMPARE[answer]}</strong>`],
            meta: { index, value: c.value, answer },
          };
        }
        const kind = rng.int(0, 1);
        if (kind === 0) {
          let a = 0;
          let b = 0;
          let c = 0;
          let d = 0;
          do {
            a = rng.int(4, 8);
            b = rng.int(3, 7);
            c = rng.int(3, 8);
            d = measured(a, b);
          } while (Math.abs(d - c) < 0.5 || a === b);
          return {
            prompt: `Ein Quader ABCDEFGH ist ${a} cm lang, ${b} cm breit und ${c} cm hoch. Im Schrägbild sieht der Diagonalschnitt ACGE aus wie ein Parallelogramm. Die Flächendiagonale [AC] hast du in der Grundfläche in wahrer Größe zu ${fmt(d)} cm gemessen. Welche Form hat ACGE in wahrer Größe? Berechne seinen Flächeninhalt und seinen Umfang.`,
            given: [],
            fields: [
              shuffledChoice(rng, "ACGE in wahrer Größe:", "ein Rechteck", ["ein Parallelogramm mit schiefen Winkeln", "ein Quadrat", "ein gleichschenkliges Trapez"]),
              numberField("Flächeninhalt:", d * c, "cm²", 2, { slips: [{ value: a * c, hint: "Eine Seite des Diagonalschnitts ist die Diagonale [AC], nicht die Kante [AB]." }] }),
              numberField("Umfang:", 2 * (d + c), "cm", 2, { slips: [{ value: d + c, hint: `Das Rechteck hat vier Seiten: u = 2 · (${lenText("AC")} + ${lenText("CG")}).` }] }),
            ],
            steps: [
              `[AE] und [CG] stehen senkrecht auf der Grundfläche, also auch auf [AC]: In wahrer Größe ist ACGE ein Rechteck mit den Seiten ${len("AC")} ≈ ${fmt(d)} cm und ${len("CG")} = ${c} cm. Nur das Schrägbild verzerrt es zum Parallelogramm.`,
              `A = ${fmt(d)} cm · ${c} cm = ${fmtUnit(d * c, "cm²")}; u = 2 · (${fmt(d)} cm + ${c} cm) = ${fmtUnit(2 * (d + c), "cm")}`,
              `<strong>ein Rechteck; A = ${fmtUnit(d * c, "cm²")}; u = ${fmtUnit(2 * (d + c), "cm")}</strong>`,
            ],
            meta: { kind, a, b, c, d },
          };
        }
        let a = 0;
        let b = 0;
        let h = 0;
        let d = 0;
        // far from equilateral (h near d · √3 : 2) and from right-angled at S (h near d : 2), so only one option fits
        do {
          a = rng.int(4, 8);
          b = rng.int(3, 8);
          h = rng.int(4, 9);
          d = measured(a, b);
        } while (Math.abs(h - (d * Math.sqrt(3)) / 2) < 0.5 || Math.abs(h - d / 2) < 0.5);
        return {
          prompt: `Eine gerade Pyramide ABCDS hat ${a === b ? `das Quadrat ABCD mit der Seitenlänge ${a} cm` : `das Rechteck ABCD mit ${len("AB")} = ${a} cm und ${len("BC")} = ${b} cm`} als Grundfläche und die Höhe ${len("MS")} = ${h} cm. Die Diagonale [AC] hast du in wahrer Größe zu ${fmt(d)} cm gemessen. Welche Form hat der Diagonalschnitt ACS in wahrer Größe? Wie lang ist [AM], und wie groß ist der Flächeninhalt des Dreiecks ACS?`,
          given: [],
          fields: [
            shuffledChoice(rng, "ACS in wahrer Größe:", "ein gleichschenkliges Dreieck", ["ein rechtwinkliges Dreieck", "ein gleichseitiges Dreieck", "ein Parallelogramm"]),
            numberField(`${len("AM")} =`, d / 2, "cm", 2, { slips: [{ value: d, hint: "M ist die Mitte der Diagonale: [AM] ist die halbe Diagonale." }] }),
            numberField("Flächeninhalt:", (d * h) / 2, "cm²", 2, { slips: [{ value: d * h, hint: "Dreieck: A = ½ · Grundseite · Höhe." }, { value: (a * h) / 2, hint: "Die Grundseite des Dreiecks ACS ist die Diagonale [AC], nicht die Kante [AB]." }] }),
          ],
          steps: [
            `S liegt über der Mitte M von [AC]: [AS] und [CS] sind gleich lang, das Dreieck ACS ist gleichschenklig mit der Grundseite [AC], ${len("AC")} ≈ ${fmt(d)} cm, und der Höhe [MS], ${len("MS")} = ${h} cm.`,
            `${len("AM")} = ${fmt(d)} cm : 2 = ${fmtUnit(d / 2, "cm")}; A = ½ · ${fmt(d)} cm · ${h} cm = ${fmtUnit((d * h) / 2, "cm²")}`,
            `<strong>ein gleichschenkliges Dreieck; ${len("AM")} = ${fmtUnit(d / 2, "cm")}; A = ${fmtUnit((d * h) / 2, "cm²")}</strong>`,
          ],
          meta: { kind, a, b, h, d },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du findest die passende Figur, zeichnest sie in wahrer Größe und bestimmst Strecken und Winkel richtig.",
};

export const STAGE_RAUMGEOMETRIE: Stage = {
  id: STAGE_ID,
  stageNumber: 3,
  title: "Raumgeometrie",
  subtitle: "Symmetrische Körper, Axialschnitte, Koordinaten im Raum, Schrägbilder und wahre Größe",
  icon: "🧊",
  accent: "#0891b2",
  badgeTitle: "Raumforscher",
  lehrplanLabel: "LB 3 (I) · LB 2 (II/III)",
  lessons: [symmetrischeKoerper, axialschnitte, raumkoordinaten, koerperKoordinaten, schraegbilder, wahreGroesse],
};
