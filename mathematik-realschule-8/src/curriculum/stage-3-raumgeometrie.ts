import { fmt, fmtUnit } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  AXIAL_FIGURES,
  axialBody,
  axialHeight,
  axialSectionName,
  axialSlant,
  axialWidth,
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
        centreWhy: "Kein Symmetriezentrum: Bei einer Punktspiegelung käme die Spitze nach unten, unter die Grundfläche.",
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
        centreWhy: "Kein Symmetriezentrum: Die Spitze hätte kein Gegenüber.",
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
  { text: "Ein Zelt ist ein liegendes dreiseitiges Prisma; sein Grunddreieck ist gleichschenklig, aber nicht gleichseitig.", body: "dreiseitiges Prisma mit gleichschenkligem Grunddreieck", planes: "2", planesWrong: ["4", "1", "3"], axes: "1", axesWrong: ["4", "3", "keine"], centre: false, why: "Nur die senkrechte Ebene durch den First und die Mittelebene parallel zu den Dreiecken; ihre Schnittgerade ist die einzige Achse (180°); kein Zentrum, der First hat kein Gegenüber am Boden." },
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
    <p><strong>Wiederholung aus M6 und Etappe 2:</strong> Eine ebene Figur ist achsensymmetrisch, wenn die Spiegelung an einer Geraden sie auf sich selbst abbildet, drehsymmetrisch, wenn das eine Drehung um einen Winkel unter 360° tut, und punktsymmetrisch, wenn das die Punktspiegelung an einem Zentrum Z tut. Bei Körpern gibt es dieselben drei Symmetrien, nur im Raum:</p>
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
    <p>Ein <strong>regelmäßiges n-seitiges Prisma</strong> (Grundfläche ein regelmäßiges n-Eck) hat n senkrechte Symmetrieebenen und die waagrechte Mittelebene, also n + 1, dazu die Körperachse mit dem Winkel 360° : n und n waagrechte Achsen mit 180°. Ein Symmetriezentrum hat es nur bei geradem n. Eine regelmäßige n-seitige Pyramide hat n Symmetrieebenen, eine Achse mit 360° : n und kein Zentrum.</p>
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
    { name: "Regelmäßiges n-seitiges Prisma", html: "n + 1 Symmetrieebenen, n + 1 Symmetrieachsen, Zentrum nur bei geradem n", quantities: "Körperachse mit 360° : n, n waagrechte Achsen mit 180°" },
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
      "Durch die Spitze gehen 4 Symmetrieebenen: zwei durch die Mitten gegenüberliegender Grundkanten und zwei durch gegenüberliegende Ecken. Die Höhe ist die einzige Drehachse (90°). Ein Zentrum fehlt, weil die Punktspiegelung die Spitze unter die Grundfläche schicken würde. Wer nur 2 Ebenen zählt, übersieht die beiden Diagonalebenen.",
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
      { type: "range", key: "view", label: "Ansicht drehen", unit: "°", min: 0, max: 90, step: 15, value: 30 },
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
          prompt: `${o.text} Welcher Körper ist das? Wie viele Symmetrieebenen und Symmetrieachsen hat er, und hat er ein Symmetriezentrum?`,
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
    <div class="example"><strong>Beispiel:</strong> Der Axialschnitt eines Körpers ist ein gleichschenkliges Trapez, unten 8 cm und oben 4 cm breit und 6 cm hoch.<br>
      1. Halbiert an der Symmetrieachse bleibt ein rechtwinkliges Trapez mit den parallelen Seiten 4 cm und 2 cm und der Höhe 6 cm.<br>
      2. Es dreht sich um seinen Schenkel mit den rechten Winkeln: Es entsteht ein <strong>Kegelstumpf</strong>, zum Beispiel ein Blumentopf, der unten schmaler ist.<br>
      3. Maße: Radius unten 8 cm : 2 = 4 cm, Radius oben 4 cm : 2 = 2 cm, Höhe 6 cm.</div>
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
      { type: "range", key: "r", label: "Breite der Figur r", unit: "cm", min: 0.5, max: 4, step: 0.5, value: 2, digits: 1 },
      { type: "range", key: "h", label: "Höhe h", unit: "cm", min: 0.5, max: 8, step: 0.5, value: 3, digits: 1, showIf: (v) => v.shape !== 2 },
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
            slips = [{ value: a, ...half }, { value: 2 * c, hint: "Das ist die Breite oben. Gefragt ist die Breite unten: 2 · untere Seite." }];
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
            fields: [numberField("Außenradius:", B / 2, "cm", 2, { slips: [{ value: B, hint: "Das ist der Außendurchmesser; der Radius ist die Hälfte." }] }), numberField("Innenradius:", B / 2 - w, "cm", 2, { slips: [{ value: B - 2 * w, hint: "Das ist der Innendurchmesser, die Breite der Lücke. Der Radius ist die Hälfte." }, { value: B / 2 - 2 * w, hint: "Vom Außenradius ziehst du die Wanddicke nur einmal ab." }] })],
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
    <p><strong>Besondere Lagen:</strong> Ist eine Koordinate 0, liegt der Punkt in einer <strong>Koordinatenebene</strong>. Die Ebene heißt nach den beiden Achsen, die in ihr liegen: z = 0 in der xy-Ebene (dem „Boden“), y = 0 in der xz-Ebene, x = 0 in der yz-Ebene. Sind zwei Koordinaten 0, liegt der Punkt auf einer Achse: (0 | 0 | 3) liegt auf der z-Achse in der Höhe 3. Der Abstand eines Punktes von einer Koordinatenebene ist der Betrag der dritten Koordinate: P(2 | 5 | 3) liegt 3 Einheiten über der xy-Ebene und 2 Einheiten vor der yz-Ebene.</p>
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
    { name: "Abstand von einer Koordinatenebene", html: "von der xy-Ebene: |z|; von der xz-Ebene: |y|; von der yz-Ebene: |x|", quantities: "der Betrag der Koordinate, die nicht in der Ebene liegt" },
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
      { type: "range", key: "u", label: "x-Koordinate von Q", unit: "", min: 0, max: 5, step: 0.5, value: 4, digits: 1 },
      { type: "range", key: "v", label: "y-Koordinate von Q", unit: "", min: 0, max: 7, step: 0.5, value: 1, digits: 1 },
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
            name = `den Mittelpunkt M der Kante [${edge[0]}${edge[1]}]`;
            route = `${edge[0]}${point3(...p)} und ${edge[1]}${point3(...q)}; M liegt in der Mitte: Jede Koordinate ist der Mittelwert, ((x₁ + x₂) : 2 | (y₁ + y₂) : 2 | (z₁ + z₂) : 2).`;
          } else {
            const vertex = rng.pick(["B", "C", "D", "E", "F", "G", "H"]);
            target = cuboidVertex(vertex, a, b, c);
            name = `die Ecke ${vertex}`;
            route = `Von A aus: ${fmt(target[0])} in x-Richtung (nach vorne), ${fmt(target[1])} in y-Richtung (nach rechts), ${fmt(target[2])} nach oben.`;
          }
          const label = mid ? "M" : name.slice(-1);
          return {
            prompt: `Ein Quader ABCDEFGH liegt so im Koordinatensystem, dass A im Ursprung liegt, [AB] auf der x-Achse, [AD] auf der y-Achse und [AE] auf der z-Achse. Gib die Koordinaten von ${name} an.`,
            given: [`[AB] = ${a}, [AD] = ${b}, [AE] = ${c} (in Einheiten)`, CUBOID_GIVEN],
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
            numberField("Abstand:", distance, "m", 1, { slips: [px, py, pz].filter((value) => value !== distance).map((value) => ({ value, hint: `Der Abstand von dieser Wand oder vom Boden ist die ${letter}-Koordinate von P.` })) }),
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

export const STAGE_RAUMGEOMETRIE: Stage = {
  id: STAGE_ID,
  stageNumber: 3,
  title: "Raumgeometrie",
  subtitle: "Symmetrische Körper, Axialschnitte, Koordinaten im Raum, Schrägbilder und wahre Größe",
  icon: "🧊",
  accent: "#0891b2",
  badgeTitle: "Raumforscher",
  lehrplanLabel: "LB 3 (I) · LB 2 (II/III)",
  lessons: [symmetrischeKoerper, axialschnitte, raumkoordinaten],
};
