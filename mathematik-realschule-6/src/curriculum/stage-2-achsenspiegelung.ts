import { fmt, paren, point } from "../exercises/format";
import { isSymmetryAxis, signedArea } from "../models";
import { BASE_B, BASE_C, FIGURES, familyPoints } from "../lab/views-spiegelung";
import { choiceField as pick, numberField as num, yesNo } from "./helpers";
import {
  choice as c,
  lab,
  makeLesson,
  makeStage,
  output as o,
  range as r,
  task,
} from "./builders";

const L = (step: number, content: Parameters<typeof makeLesson>[2]) =>
  makeLesson(2, step, content);

const AXIS_ANGLES = [90, 0, 45, 135];

/** Distance of (x | y) from the axis through the origin with direction `deg`. */
const distanceToAxis = (x: number, y: number, deg: number) => {
  const t = (deg * Math.PI) / 180;
  return Math.abs(x * Math.sin(t) - y * Math.cos(t));
};

const eigenschaften = L(1, {
  id: "as-1-eigenschaften",
  title: "2.1 Die Achsenspiegelung",
  subtitle: "Was gleich bleibt und was sich ändert",
  whyItMatters:
    "Spiegelbilder findest du in Architektur, Kunst und Natur. Weil dabei Längen und Winkel erhalten bleiben, kannst du mit Spiegelungen Geometrieaufgaben lösen.",
  explanationHtml: `<p>Bei einer <strong>Achsenspiegelung</strong> an der Achse a hat jeder Punkt P einen Bildpunkt P'. Die Achse ist die Mittelsenkrechte der Strecke [PP']. Das Bild ist deckungsgleich zur Figur; deshalb heißt die Achsenspiegelung eine <strong>Kongruenzabbildung</strong>.</p><p>Es gelten <strong>Längentreue</strong>, <strong>Winkeltreue</strong>, <strong>Geradentreue</strong>, <strong>Parallelentreue</strong> und <strong>Kreistreue</strong>: Strecken, Winkel, Geraden, parallele Geraden und Kreise bleiben erhalten. Die Spiegelung ist <strong>umkehrbar</strong>: Spiegelst du P' an derselben Achse, erhältst du wieder P. Nur der <strong>Umlaufsinn</strong> ändert sich.</p><p><strong>Fixelemente</strong> bleiben an ihrem Platz: Jeder Punkt der Achse ist ein Fixpunkt, jede Gerade senkrecht zur Achse eine Fixgerade. Eine <strong>Urgerade</strong> und ihre <strong>Bildgerade</strong> schneiden sich auf der Achse oder sind parallel zur Achse.</p><div class="example">Ist [AB] 5 cm lang, so ist auch [A'B'] 5 cm lang. Geht das Dreieck ABC gegen den Uhrzeigersinn herum, so geht A'B'C' im Uhrzeigersinn herum.</div><div class="merke"><strong>Merke:</strong> Achsenspiegelung: Längen und Winkel bleiben gleich, der Umlaufsinn dreht sich um. Punkte auf der Achse bleiben, wo sie sind.</div>`,
  formulas: [
    {
      name: "Abbildungsvorschrift",
      html: "a ist Mittelsenkrechte von [PP']",
      quantities: "P Urpunkt, P' Bildpunkt, a Spiegelachse",
    },
    {
      name: "Eigenschaften",
      html: "längentreu, winkeltreu, geradentreu, parallelentreu, kreistreu",
      quantities: "der Umlaufsinn kehrt sich um",
    },
  ],
  quiz: {
    question: "Was ändert sich bei einer Achsenspiegelung?",
    options: ["der Umlaufsinn der Figur", "die Längen der Seiten", "die Größe der Winkel"],
    correctIndex: 0,
    explanation: "Längen und Winkel bleiben erhalten. Nur der Umlaufsinn kehrt sich um.",
  },
  lab: lab(
    "mirror-triangle",
    "Spiegeln und beobachten",
    "Ziehe den Punkt A und wähle die Achse. Vergleiche Dreieck und Bilddreieck, vor allem an besonderen Stellen.",
    [
      c("axis", "Spiegelachse", ["senkrecht", "waagerecht", "steigend, 45°", "fallend, 135°"]),
      r("ax", "A, x-Wert", -7, 7, -4, 0.5),
      r("ay", "A, y-Wert", -4.5, 4.5, 2, 0.5),
    ],
    [
      o("ab", "Länge [AB] = [A'B']", (v) => Math.hypot(v.ax - BASE_B.x, v.ay - BASE_B.y), "", 2),
      o("sense", "Umlaufsinn", (v) => {
        const area = signedArea([{ x: v.ax, y: v.ay }, BASE_B, BASE_C]);
        return area === 0
          ? "A, B und C liegen auf einer Geraden"
          : area > 0
            ? "ABC gegen, A'B'C' im Uhrzeigersinn"
            : "ABC im, A'B'C' gegen den Uhrzeigersinn";
      }),
      o("dist", "Abstand von A zur Achse", (v) =>
        distanceToAxis(v.ax, v.ay, AXIS_ANGLES[v.axis]),
      ),
      o("note", "Beobachtung", (v) => {
        const deg = AXIS_ANGLES[v.axis];
        if (distanceToAxis(v.ax, v.ay, deg) < 1e-9) return "A liegt auf der Achse: A ist Fixpunkt, A' = A.";
        const dx = v.ax - BASE_B.x;
        const dy = v.ay - BASE_B.y;
        const t = (deg * Math.PI) / 180;
        if (Math.abs(dx * Math.cos(t) + dy * Math.sin(t)) < 1e-9 && (dx !== 0 || dy !== 0))
          return "Die Gerade AB steht senkrecht zur Achse: Sie ist eine Fixgerade.";
        if (Math.abs(dx * Math.sin(t) - dy * Math.cos(t)) < 1e-9 && (dx !== 0 || dy !== 0))
          return "Die Gerade AB ist parallel zur Achse, ihre Bildgerade auch.";
        return "Die Gerade AB und ihre Bildgerade schneiden sich auf der Achse.";
      }),
    ],
    [
      {
        id: "fixpunkt",
        text: "Mache A zum Fixpunkt: Lege A auf die Achse.",
        check: (v) => distanceToAxis(v.ax, v.ay, AXIS_ANGLES[v.axis]) < 1e-9,
      },
      {
        id: "fixgerade",
        text: "Bringe die Gerade AB in eine Lage senkrecht zur Achse: Sie wird zur Fixgeraden.",
        check: (v) => {
          const t = (AXIS_ANGLES[v.axis] * Math.PI) / 180;
          const dx = v.ax - BASE_B.x;
          const dy = v.ay - BASE_B.y;
          return (dx !== 0 || dy !== 0) && Math.abs(dx * Math.cos(t) + dy * Math.sin(t)) < 1e-9;
        },
      },
      {
        id: "parallel",
        text: "Bringe die Gerade AB in eine Lage parallel zur Achse.",
        check: (v) => {
          const t = (AXIS_ANGLES[v.axis] * Math.PI) / 180;
          const dx = v.ax - BASE_B.x;
          const dy = v.ay - BASE_B.y;
          return (dx !== 0 || dy !== 0) && Math.abs(dx * Math.sin(t) - dy * Math.cos(t)) < 1e-9;
        },
      },
    ],
  ),
  exercises: [
    {
      id: "laenge-winkel",
      make: (rng, level) => {
        const length = rng.int(21, 95) / 10;
        const angle = rng.int(25, 130);
        if (level === 1)
          return task(
            level,
            `Das Dreieck ABC wird an einer Achse gespiegelt. [AB] ist ${fmt(length)} cm lang, der Winkel bei A misst ${angle}°. Gib die Länge von [A'B'] und den Winkel bei A' an.`,
            "",
            [num("[A'B'] =", length, "cm", 1), num("Winkel bei A' =", angle, "°", 0)],
            "Die Achsenspiegelung ist längentreu und winkeltreu.",
            "Längen und Winkel ändern sich beim Spiegeln nicht.",
            `${fmt(length)} cm und ${angle}°.`,
            { length, angle },
          );
        const statements = [
          ["Ein Punkt auf der Achse ist sein eigener Bildpunkt.", true],
          ["Eine Gerade senkrecht zur Achse wird auf sich selbst abgebildet.", true],
          ["Parallele Geraden werden auf parallele Geraden abgebildet.", true],
          ["Das Bild eines Kreises ist ein gleich großer Kreis.", true],
          ["Der Umlaufsinn einer Figur bleibt erhalten.", false],
          ["Jede Gerade wird auf sich selbst abgebildet.", false],
          ["Ein Winkel wird beim Spiegeln doppelt so groß.", false],
        ] as const;
        const [text, truth] = rng.pick(statements);
        return task(
          level,
          "",
          `Entscheide: „${text}“ Bedenke dazu die Eigenschaften der Achsenspiegelung. Stimmt die Aussage? Gib außerdem an, wie lang [A'B'] ist, wenn [AB] = ${fmt(length)} cm.`,
          [yesNo("Stimmt die Aussage?", truth), num("[A'B'] =", length, "cm", 1)],
          "Nur der Umlaufsinn ändert sich, und nur besondere Geraden bleiben an ihrem Platz.",
          truth ? "Das folgt aus den Eigenschaften der Achsenspiegelung." : "Das widerspricht den Eigenschaften der Achsenspiegelung.",
          `${truth ? "Die Aussage stimmt" : "Die Aussage stimmt nicht"}; [A'B'] = ${fmt(length)} cm.`,
          { length },
        );
      },
    },
    {
      id: "abstand",
      make: (rng, level) => {
        const d = rng.int(11, 64) / 10;
        if (level === 1)
          return task(
            level,
            `Der Punkt P hat von der Achse den Abstand ${fmt(d)} cm. Wie weit ist sein Bildpunkt P' von der Achse entfernt, und wie lang ist [PP']?`,
            "",
            [num("Abstand von P' =", d, "cm", 1), num("[PP'] =", 2 * d, "cm", 1)],
            "Die Achse halbiert [PP'] und steht senkrecht darauf.",
            `Beide Punkte haben den Abstand ${fmt(d)} cm, also [PP'] = 2 · ${fmt(d)} cm.`,
            `${fmt(d)} cm und ${fmt(2 * d)} cm.`,
            { d },
          );
        const whole = rng.int(30, 160) / 10;
        return task(
          level,
          "",
          `Die Strecke [PP'] verbindet einen Punkt mit seinem Bildpunkt und ist ${fmt(whole, 1)} cm lang. Wie weit ist P von der Spiegelachse entfernt, und welchen Winkel bildet [PP'] mit der Achse?`,
          [
            num("Abstand =", whole / 2, "cm", 2, {
              slips: [{ value: whole, hint: "Das ist die ganze Strecke. Die Achse halbiert sie." }],
            }),
            num("Winkel =", 90, "°", 0),
          ],
          "Die Achse ist die Mittelsenkrechte von [PP'].",
          `${fmt(whole, 1)} cm : 2 = ${fmt(whole / 2)} cm.`,
          `${fmt(whole / 2)} cm und 90°.`,
          { whole },
        );
      },
    },
  ],
});

const imageOf = (v: Record<string, number>) => {
  if (v.axis === 0) return { x: -v.x, y: v.y };
  if (v.axis === 1) return { x: v.x, y: -v.y };
  if (v.axis === 2) return { x: 2 * v.c - v.x, y: v.y };
  return { x: v.x, y: 2 * v.c - v.y };
};

const abbilden = L(2, {
  id: "as-2-abbilden",
  title: "2.2 Punkte und Figuren abbilden",
  subtitle: "Mit der Abbildungsvorschrift und im Koordinatensystem",
  whyItMatters:
    "Mit der Vorschrift kannst du jeden Bildpunkt konstruieren. Im Koordinatensystem kannst du ihn sogar ausrechnen, auch mit Geometriesoftware.",
  explanationHtml: `<p>So bildest du einen Punkt P ab: Zeichne die Senkrechte zur Achse durch P. Trage den Abstand von P zur Achse auf der anderen Seite ab. Dort liegt P'. Bei einer Figur bildest du die Eckpunkte ab und verbindest die Bildpunkte.</p><p>Im Koordinatensystem gilt: Bei der Spiegelung an der y-Achse ändert sich das Vorzeichen von x, bei der x-Achse das von y. Bei einer Achse x = c bleibt y gleich, und x liegt genauso weit auf der anderen Seite von c.</p><div class="example">P(3 | 2) an der y-Achse: P'(−3 | 2). P(5 | 2) an der Geraden x = 3: P liegt 2 rechts von der Achse, also P'(1 | 2).</div><p>In einer dynamischen Geometriesoftware wie GeoGebra kannst du die Spiegelung ausführen und den Urpunkt verschieben. Das Labor hier funktioniert ähnlich.</p><div class="merke"><strong>Merke:</strong> Senkrecht zur Achse, gleicher Abstand auf der anderen Seite. An x = c: x' = 2 · c − x; an y = c: y' = 2 · c − y.</div>`,
  formulas: [
    {
      name: "Spiegelung an den Koordinatenachsen",
      html: "y-Achse: P(x | y) → P'(−x | y); x-Achse: P(x | y) → P'(x | −y)",
      quantities: "die andere Koordinate bleibt gleich",
    },
    {
      name: "Spiegelung an x = c",
      html: "P(x | y) → P'(2 · c − x | y)",
      quantities: "c die Lage der senkrechten Achse",
    },
  ],
  quiz: {
    question: "Welcher Punkt ist das Bild von P(4 | −1) bei der Spiegelung an der x-Achse?",
    options: ["P'(4 | 1)", "P'(−4 | −1)", "P'(−4 | 1)"],
    correctIndex: 0,
    explanation: "An der x-Achse bleibt x gleich und y ändert sein Vorzeichen.",
  },
  lab: lab(
    "mirror-coords",
    "Spiegeln im Koordinatensystem",
    "Ziehe P und wähle die Achse. Lies P' ab und vergleiche die Koordinaten.",
    [
      c("axis", "Spiegelachse", ["y-Achse", "x-Achse", "senkrecht x = c", "waagerecht y = c"]),
      r("c", "Lage c", -3, 3, 1),
      r("x", "P, x-Wert", -7, 7, 2),
      r("y", "P, y-Wert", -4, 4, 3),
    ],
    [
      o("imageX", "x-Wert von P'", (v) => imageOf(v).x, "", 0),
      o("imageY", "y-Wert von P'", (v) => imageOf(v).y, "", 0),
      o("image", "Bildpunkt", (v) => `P'${point(imageOf(v).x, imageOf(v).y)}`),
    ],
    [
      {
        id: "y-achse",
        text: "Erzeuge an der y-Achse den Bildpunkt P'(−3 | 2).",
        check: (v) => v.axis === 0 && v.x === 3 && v.y === 2,
      },
      {
        id: "x-achse",
        text: "Erzeuge an der x-Achse den Bildpunkt P'(1 | −4).",
        check: (v) => v.axis === 1 && v.x === 1 && v.y === 4,
      },
      {
        id: "fixpunkt",
        text: "Lege P bei der Achse x = 2 auf einen Fixpunkt.",
        check: (v) => v.axis === 2 && v.c === 2 && v.x === 2,
      },
    ],
  ),
  exercises: [
    {
      id: "bildpunkt",
      make: (rng, level) => {
        const x = rng.int(1, 6) * rng.sign();
        const y = rng.int(1, 6) * rng.sign();
        if (level === 1) {
          const onY = rng.pick([true, false]);
          return task(
            level,
            `Spiegle P${point(x, y)} an der ${onY ? "y-Achse" : "x-Achse"}. Gib die Koordinaten von P' an.`,
            "",
            [num("x' =", onY ? -x : x, "", 0), num("y' =", onY ? y : -y, "", 0)],
            "An der y-Achse ändert x sein Vorzeichen, an der x-Achse y.",
            `Die ${onY ? "y" : "x"}-Koordinate bleibt gleich.`,
            `P'${point(onY ? -x : x, onY ? y : -y)}.`,
            { x, y },
          );
        }
        const k = rng.int(1, 4) * rng.sign();
        const vertical = rng.pick([true, false]);
        const ix = vertical ? 2 * k - x : x;
        const iy = vertical ? y : 2 * k - y;
        return task(
          level,
          "",
          `Das Dreieck hat die Ecke A${point(x, y)}. Es wird an der Geraden ${vertical ? "x" : "y"} = ${fmt(k)} gespiegelt. Berechne die Koordinaten von A'.`,
          [
            num("x' =", ix, "", 0, { slips: vertical ? [{ value: -x, hint: "Die Achse ist nicht die y-Achse. Miss den Abstand von der Geraden." }] : [] }),
            num("y' =", iy, "", 0, { slips: vertical ? [] : [{ value: -y, hint: "Die Achse ist nicht die x-Achse. Miss den Abstand von der Geraden." }] }),
          ],
          "Abstand von der Achse bestimmen und auf der anderen Seite abtragen.",
          `Der Abstand von der Achse ist ${fmt(Math.abs((vertical ? x : y) - k))}.`,
          `A'${point(ix, iy)}.`,
          { x, y, k },
        );
      },
    },
    {
      id: "achse-finden",
      make: (rng, level) => {
        const k = rng.int(-3, 4);
        const d = rng.int(1, 4);
        const y = rng.int(-4, 4);
        if (level === 1)
          return task(
            level,
            `P${point(k - d, y)} und P'${point(k + d, y)} sind Punkt und Bildpunkt. Die Achse steht senkrecht. Auf welcher Geraden x = c liegt sie?`,
            "",
            [num("c =", k, "", 0)],
            "Die Achse geht durch den Mittelpunkt von [PP'].",
            `Mittelpunkt: (${paren(k - d)} + ${paren(k + d)}) : 2.`,
            `x = ${fmt(k)}.`,
            { k, d, y },
          );
        const qx = rng.int(-5, 5);
        const qy = rng.int(-4, 4);
        return task(
          level,
          "",
          `Bei einer Spiegelung an einer waagerechten Achse wird A${point(y, k - d)} auf A'${point(y, k + d)} abgebildet. Bestimme die Achse y = c und den Bildpunkt von Q${point(qx, qy)}.`,
          [num("c =", k, "", 0), num("x von Q' =", qx, "", 0), num("y von Q' =", 2 * k - qy, "", 0)],
          "Die Achse liegt in der Mitte von A und A'. An y = c bleibt x gleich.",
          `c = (${paren(k - d)} + ${paren(k + d)}) : 2 = ${fmt(k)}.`,
          `y = ${fmt(k)}; Q'${point(qx, 2 * k - qy)}.`,
          { k, d, qx, qy },
        );
      },
    },
  ],
});

const STEP_TEXT = [
  ["Gegeben: Strecke [AB]", "Kreis um A", "Kreis um B mit gleichem Radius", "Schnittpunkte verbinden: die Mittelsenkrechte"],
  ["Gegeben: Gerade g und Punkt P außerhalb", "Kreis um P schneidet g in A und B", "Kreise um A und B mit gleichem Radius", "Durch P und den zweiten Schnittpunkt Q: das Lot von P auf g"],
  ["Gegeben: Gerade g und Punkt P auf g", "Kreis um P schneidet g in A und B", "Kreise um A und B mit größerem Radius", "Schnittpunkte und P verbinden: die Senkrechte in P"],
];

const senkrechte = L(3, {
  id: "as-3-senkrechte-lot",
  title: "2.3 Mittelsenkrechte, Lot und Senkrechte",
  subtitle: "Konstruieren nur mit Zirkel und Lineal",
  whyItMatters:
    "Schon im antiken Griechenland wurde nur mit Zirkel und Lineal konstruiert, etwa bei Euklid. Diese Grundkonstruktionen stecken in fast jeder Geometrieaufgabe.",
  explanationHtml: `<p>Die <strong>Mittelsenkrechte</strong> von [AB] steht senkrecht auf [AB] und geht durch den Mittelpunkt. Jeder ihrer Punkte ist von A und B gleich weit entfernt. Du zeichnest um A und B zwei Kreise mit gleichem Radius, der größer als die halbe Streckenlänge ist, und verbindest die beiden Schnittpunkte.</p><p>Das <strong>Lot</strong> von einem Punkt P auf eine Gerade g fällst du so: Ein Kreis um P schneidet g in A und B. Dann konstruierst du die Mittelsenkrechte von [AB], sie geht durch P. Die <strong>Senkrechte</strong> in einem Punkt P auf g entsteht genauso: Der Kreis um P liefert A und B auf g, ihre Mittelsenkrechte geht durch P.</p><div class="example">[AB] ist 6 cm lang. Der Radius muss größer als 3 cm sein, zum Beispiel 4 cm. Bei 3 cm berühren sich die Kreise nur, bei 2 cm schneiden sie sich nicht.</div><p>Führe die Konstruktionen auf Papier mit Zirkel und Lineal aus. Das Labor zeigt die Schritte, messen musst du selbst.</p><div class="merke"><strong>Merke:</strong> Alle drei Konstruktionen nutzen dieselbe Idee: zwei gleich große Kreise um zwei Punkte, deren Schnittpunkte die Senkrechte festlegen.</div>`,
  formulas: [
    {
      name: "Mittelsenkrechte",
      html: "Für jeden Punkt Q auf der Mittelsenkrechten gilt: |QA| = |QB|",
      quantities: "A, B Endpunkte der Strecke",
    },
    {
      name: "Radius",
      html: "r > ½ · |AB|",
      quantities: "sonst schneiden sich die Kreise nicht in zwei Punkten",
    },
  ],
  quiz: {
    question: "Welcher Radius eignet sich für die Mittelsenkrechte einer 8 cm langen Strecke?",
    options: ["5 cm", "4 cm", "3 cm"],
    correctIndex: 0,
    explanation: "Der Radius muss größer als die halbe Strecke (4 cm) sein. Bei 4 cm berühren sich die Kreise nur.",
  },
  lab: lab(
    "construct-perp",
    "Schritt für Schritt konstruieren",
    "Wähle die Konstruktion und gehe durch die Schritte. Ändere den Radius und beobachte, wann die Konstruktion gelingt.",
    [
      c("mode", "Konstruktion", ["Mittelsenkrechte", "Lot von P auf g", "Senkrechte in P auf g"]),
      r("step", "Schritt", 0, 3, 0),
      r("r", "Radius", 2, 6, 2, 0.5, "cm"),
    ],
    [
      o("stepText", "Aktueller Schritt", (v) => STEP_TEXT[v.mode][v.step]),
      o("ok", "Gelingt die Konstruktion?", (v) => {
        const need = v.mode === 0 ? 3 : v.mode === 1 ? 3 : 0;
        return v.r > need ? "ja" : "nein, der Radius ist zu klein";
      }),
    ],
    [
      {
        id: "mittelsenkrechte",
        text: "Konstruiere die Mittelsenkrechte bis zum letzten Schritt.",
        check: (v) => v.mode === 0 && v.step === 3 && v.r > 3,
      },
      {
        id: "lot",
        text: "Fälle das Lot von P auf g bis zum letzten Schritt.",
        check: (v) => v.mode === 1 && v.step === 3 && v.r > 3,
      },
      {
        id: "senkrechte",
        text: "Errichte die Senkrechte in P auf g bis zum letzten Schritt.",
        check: (v) => v.mode === 2 && v.step === 3,
      },
    ],
  ),
  exercises: [
    {
      id: "gleich-weit",
      make: (rng, level) => {
        const pa = rng.int(21, 79) / 10;
        if (level === 1)
          return task(
            level,
            `Der Punkt Q liegt auf der Mittelsenkrechten von [AB]. Die Strecke [QA] ist ${fmt(pa)} cm lang. Wie lang ist [QB]?`,
            "",
            [num("[QB] =", pa, "cm", 1)],
            "Jeder Punkt der Mittelsenkrechten ist von A und B gleich weit entfernt.",
            "Die Mittelsenkrechte ist eine Spiegelachse, die A auf B abbildet.",
            `${fmt(pa)} cm.`,
            { pa },
          );
        const ax = rng.int(-4, 2);
        const len = 2 * rng.int(1, 4);
        const y = rng.int(-3, 3);
        return task(
          level,
          "",
          `Gegeben sind A${point(ax, y)} und B${point(ax + len, y)}. Wie lautet die Mittelsenkrechte x = c? Wie groß muss der Radius für die Konstruktion mindestens sein (Grenzwert, der selbst noch nicht reicht)?`,
          [num("c =", ax + len / 2, "", 0), num("Grenzwert r =", len / 2, "LE", 0)],
          "Die Mittelsenkrechte geht durch den Mittelpunkt. Der Radius muss größer als die halbe Strecke sein.",
          `Mittelpunkt bei x = ${fmt(ax + len / 2)}; halbe Strecke ${fmt(len / 2)}.`,
          `x = ${fmt(ax + len / 2)}; r muss größer als ${fmt(len / 2)} LE sein.`,
          { ax, len, y },
        );
      },
    },
    {
      id: "lot",
      make: (rng, level) => {
        if (level === 1) {
          const len = rng.pick([6, 8, 10, 12]);
          const options = [len / 2 + 1, len / 2, len / 2 - 1];
          return task(
            level,
            `Du konstruierst die Mittelsenkrechte einer ${len} cm langen Strecke. Welcher Radius führt zu zwei Schnittpunkten?`,
            "",
            [pick("Radius", options.map((value) => `${value} cm`), 0)],
            "Der Radius muss größer als die halbe Strecke sein.",
            `Die halbe Strecke ist ${len / 2} cm.`,
            `${options[0]} cm.`,
            { len },
          );
        }
        const x = rng.int(-6, 6);
        const y = rng.int(1, 5) * rng.sign();
        return task(
          level,
          "",
          `Fälle das Lot von P${point(x, y)} auf die x-Achse. Gib den Lotfußpunkt und den Abstand von P zur x-Achse an.`,
          [num("x des Fußpunkts =", x, "", 0), num("y des Fußpunkts =", 0, "", 0), num("Abstand =", Math.abs(y), "LE", 0)],
          "Das Lot auf die x-Achse verläuft senkrecht. Abstände sind nie negativ.",
          `Der Fußpunkt liegt unter oder über P auf der x-Achse.`,
          `F${point(x, 0)}, Abstand ${Math.abs(y)} LE.`,
          { x, y },
        );
      },
    },
  ],
});

const BISECT_STEPS = [
  "Gegeben: Winkel mit Scheitel S",
  "Kreis um S schneidet die Schenkel in A und B",
  "Gleich große Kreise um A und B schneiden sich in W",
  "Halbgerade von S durch W: die Winkelhalbierende",
];

const winkelhalbierende = L(4, {
  id: "as-4-winkelhalbierende",
  title: "2.4 Die Winkelhalbierende",
  subtitle: "Einen Winkel mit Zirkel und Lineal halbieren",
  whyItMatters:
    "Ohne Winkelmesser einen Winkel exakt halbieren: Das ist die vierte Grundkonstruktion. Sie ist zugleich eine Symmetrieachse des Winkels.",
  explanationHtml: `<p>Die <strong>Winkelhalbierende</strong> teilt einen Winkel in zwei gleich große Teile. Sie ist die Symmetrieachse des Winkels, denn beim Spiegeln an ihr wird der eine Schenkel auf den anderen abgebildet.</p><p>So konstruierst du sie: Ein Kreis um den Scheitel S schneidet die Schenkel in A und B. Zwei gleich große Kreise um A und B schneiden sich in W. Die Halbgerade von S durch W ist die Winkelhalbierende.</p><div class="example">α = 70°. Jeder Teilwinkel misst 35°. Ein Punkt auf der Winkelhalbierenden hat von beiden Schenkeln denselben Abstand.</div><div class="merke"><strong>Merke:</strong> Die Winkelhalbierende ist die Symmetrieachse des Winkels. Jeder ihrer Punkte ist von beiden Schenkeln gleich weit entfernt.</div>`,
  formulas: [
    {
      name: "Teilwinkel",
      html: "α₁ = α₂ = α : 2",
      quantities: "α der ganze Winkel",
    },
  ],
  quiz: {
    question: "Was gilt für einen Punkt auf der Winkelhalbierenden?",
    options: [
      "Er ist von beiden Schenkeln gleich weit entfernt.",
      "Er ist vom Scheitel immer gleich weit entfernt.",
      "Er liegt immer auf einem Schenkel.",
    ],
    correctIndex: 0,
    explanation: "Die Winkelhalbierende ist Symmetrieachse: Sie bildet die Schenkel aufeinander ab, also auch die Abstände.",
  },
  lab: lab(
    "construct-bisector",
    "Winkel halbieren",
    "Stelle den Winkel ein und gehe durch die Schritte. Führe die Konstruktion danach auf Papier aus.",
    [r("alpha", "Winkel α", 20, 160, 40, 10, "°"), r("step", "Schritt", 0, 3, 0)],
    [
      o("stepText", "Aktueller Schritt", (v) => BISECT_STEPS[v.step]),
      o("half", "Teilwinkel", (v) => v.alpha / 2, "°", 0),
    ],
    [
      {
        id: "sechzig",
        text: "Halbiere einen Winkel von 60° vollständig: Du erhältst 30°.",
        check: (v) => v.alpha === 60 && v.step === 3,
      },
      {
        id: "rechter",
        text: "Halbiere einen rechten Winkel vollständig.",
        check: (v) => v.alpha === 90 && v.step === 3,
      },
      {
        id: "stumpf",
        text: "Halbiere einen stumpfen Winkel von 140° vollständig.",
        check: (v) => v.alpha === 140 && v.step === 3,
      },
    ],
  ),
  exercises: [
    {
      id: "teilwinkel",
      make: (rng, level) => {
        const alpha = 2 * rng.int(11, 85);
        if (level === 1)
          return task(
            level,
            `Ein Winkel misst ${alpha}°. Wie groß ist ein Teilwinkel nach dem Halbieren?`,
            "",
            [num("Teilwinkel =", alpha / 2, "°", 0)],
            "Die Winkelhalbierende teilt den Winkel in zwei gleich große Teile.",
            `${alpha}° : 2.`,
            `${alpha / 2}°.`,
            { alpha },
          );
        const beta = 4 * rng.int(6, 40);
        return task(
          level,
          "",
          `Ein Winkel von ${beta}° wird halbiert, dann wird einer der beiden Teilwinkel noch einmal halbiert. Wie groß ist der kleinste Winkel? Wie groß ist der Nebenwinkel des ursprünglichen Winkels?`,
          [num("Kleinster Winkel =", beta / 4, "°", 0), num("Nebenwinkel =", 180 - beta, "°", 0)],
          "Zweimal halbieren heißt: durch 4 teilen. Nebenwinkel ergänzen sich zu 180°.",
          `${beta}° : 4 = ${beta / 4}°; 180° − ${beta}° = ${180 - beta}°.`,
          `${beta / 4}° und ${180 - beta}°.`,
          { beta },
        );
      },
    },
    {
      id: "abstand",
      make: (rng, level) => {
        const d = rng.int(11, 69) / 10;
        if (level === 1)
          return task(
            level,
            `Der Punkt P liegt auf der Winkelhalbierenden. Von einem Schenkel ist er ${fmt(d)} cm entfernt. Wie weit ist er vom anderen Schenkel entfernt?`,
            "",
            [num("Abstand =", d, "cm", 1)],
            "Die Winkelhalbierende ist Symmetrieachse des Winkels.",
            "Beim Spiegeln an der Winkelhalbierenden gehen die Schenkel ineinander über.",
            `${fmt(d)} cm.`,
            { d },
          );
        const half = 5 * rng.int(4, 16);
        return task(
          level,
          "",
          `Die Winkelhalbierende eines Winkels bildet mit einem Schenkel ${half}°. Wie groß ist der ganze Winkel? Handelt es sich um einen spitzen Winkel?`,
          [num("Winkel =", 2 * half, "°", 0), yesNo("Spitzer Winkel?", 2 * half < 90)],
          "Der ganze Winkel ist das Doppelte eines Teilwinkels. Spitz heißt: kleiner als 90°.",
          `2 · ${half}° = ${2 * half}°.`,
          `${2 * half}°, ${2 * half < 90 ? "spitz" : "nicht spitz"}.`,
          { half },
        );
      },
    },
  ],
});

const LETTERS: Array<[string, number]> = [
  ["H", 2],
  ["A", 1],
  ["F", 0],
  ["E", 1],
  ["T", 1],
  ["X", 2],
  ["M", 1],
  ["L", 0],
];

const FIGURE_NOTE: Record<string, string> = {
  Parallelogramm: ", das weder Raute noch Rechteck ist",
  Rechteck: ", das kein Quadrat ist",
  "gleichschenkliges Dreieck": ", das nicht gleichseitig ist",
};

const symmetrieachsen = L(5, {
  id: "as-5-symmetrieachsen",
  title: "2.5 Symmetrieachsen finden",
  subtitle: "Wann eine Figur auf sich selbst fällt",
  whyItMatters:
    "Symmetrie spart Arbeit: Kennst du eine Hälfte, kennst du das Ganze. Außerdem siehst du an den Achsen sofort Eigenschaften einer Figur.",
  explanationHtml: `<p>Eine Figur ist <strong>achsensymmetrisch</strong>, wenn es eine Gerade gibt, an der gespiegelt die Figur auf sich selbst fällt. Diese Gerade heißt <strong>Symmetrieachse</strong>. Du kannst sie mit einem Faltversuch oder durch Spiegeln prüfen.</p><div class="example">Ein Rechteck hat 2 Symmetrieachsen: die Mittellinien. Seine Diagonalen sind keine Achsen, denn beim Falten liegen die Ecken nicht aufeinander. Ein Quadrat hat 4 Achsen, ein gleichseitiges Dreieck 3, ein Parallelogramm im Allgemeinen keine.</div><p>Zusammengehörige Punkte liegen gleich weit von der Achse entfernt, und ihre Verbindung steht senkrecht auf der Achse.</p><div class="merke"><strong>Merke:</strong> Eine Gerade ist nur dann Symmetrieachse, wenn beim Spiegeln wirklich jeder Punkt der Figur wieder auf einen Punkt der Figur fällt.</div>`,
  formulas: [
    {
      name: "Symmetrieachse",
      html: "Figur gespiegelt an a = Figur",
      quantities: "a die Symmetrieachse",
    },
  ],
  quiz: {
    question: "Warum ist die Diagonale eines Rechtecks mit verschieden langen Seiten keine Symmetrieachse?",
    options: [
      "Beim Spiegeln an ihr fallen die Ecken nicht auf die anderen Ecken.",
      "Weil sie durch den Mittelpunkt geht.",
      "Weil das Rechteck vier rechte Winkel hat.",
    ],
    correctIndex: 0,
    explanation: "Die gespiegelten Ecken liegen außerhalb des Rechtecks. Nur beim Quadrat ist die Diagonale eine Achse.",
  },
  lab: lab(
    "symmetry-axes",
    "Achse drehen und prüfen",
    "Wähle eine Figur und drehe die Achse am runden Griff. Grün bedeutet: Das Bild deckt die Figur genau.",
    [
      c("figure", "Figur", FIGURES.map((figure) => figure.name)),
      r("theta", "Winkel der Achse", 0, 165, 30, 15, "°"),
    ],
    [
      o("isAxis", "Symmetrieachse?", (v) =>
        isSymmetryAxis(FIGURES[v.figure].points, v.theta) ? "ja" : "nein",
      ),
      o("total", "Achsen der Figur insgesamt", (v) => FIGURES[v.figure].axes, "", 0),
    ],
    [
      {
        id: "rechteck",
        text: "Finde eine Symmetrieachse des Rechtecks.",
        check: (v) => v.figure === 0 && isSymmetryAxis(FIGURES[0].points, v.theta),
      },
      {
        id: "quadrat-diagonale",
        text: "Finde eine Diagonale des Quadrats als Symmetrieachse.",
        check: (v) => v.figure === 1 && (v.theta === 45 || v.theta === 135),
      },
      {
        id: "dreieck",
        text: "Finde eine schräge Symmetrieachse des gleichseitigen Dreiecks.",
        check: (v) => v.figure === 2 && (v.theta === 30 || v.theta === 150),
      },
    ],
  ),
  exercises: [
    {
      id: "anzahl",
      make: (rng, level) => {
        if (level === 1) {
          const figure = rng.pick(FIGURES);
          return task(
            level,
            `Wie viele Symmetrieachsen hat ein ${figure.name}${FIGURE_NOTE[figure.name] ?? ""}?`,
            "",
            [num("Anzahl =", figure.axes, "", 0)],
            "Stelle dir den Faltversuch vor: Bei welchen Geraden decken sich die Hälften?",
            "Prüfe Mittellinien, Diagonalen und Winkelhalbierende.",
            `${figure.axes}.`,
            { axes: figure.axes },
          );
        }
        const [letter, axes] = rng.pick(LETTERS);
        const [other, otherAxes] = rng.pick(LETTERS.filter(([name]) => name !== letter));
        return task(
          level,
          "",
          `Auf einem Schild stehen die Großbuchstaben in Blockschrift ${letter} und ${other}. Wie viele Symmetrieachsen hat jeder der beiden Buchstaben?`,
          [num(`Achsen von ${letter} =`, axes, "", 0), num(`Achsen von ${other} =`, otherAxes, "", 0)],
          "Prüfe eine senkrechte und eine waagerechte Achse durch die Mitte.",
          `${letter} hat ${axes}, ${other} hat ${otherAxes}.`,
          `${axes} und ${otherAxes}.`,
          { axes, otherAxes },
        );
      },
    },
    {
      id: "ergaenzen",
      make: (rng, level) => {
        const x = rng.int(1, 6);
        const y = rng.int(-4, 5);
        if (level === 1)
          return task(
            level,
            `Eine Figur ist symmetrisch zur y-Achse. Sie enthält den Punkt A${point(-x, y)}. Welche Koordinaten hat der Partnerpunkt?`,
            "",
            [num("x =", x, "", 0), num("y =", y, "", 0)],
            "Der Partnerpunkt liegt gleich weit von der Achse entfernt, auf der anderen Seite.",
            "An der y-Achse ändert x das Vorzeichen.",
            `${point(x, y)}.`,
            { x, y },
          );
        const c0 = rng.int(1, 5);
        const half = rng.int(1, 4);
        const h = rng.int(2, 6);
        return task(
          level,
          "",
          `Ein gleichschenkliges Dreieck hat die Basis von A${point(c0 - half, 0)} nach B${point(c0 + half, 0)}. Seine Spitze C hat den y-Wert ${h}. Bestimme den x-Wert von C und die Gleichung der Symmetrieachse x = c.`,
          [num("x von C =", c0, "", 0), num("c =", c0, "", 0)],
          "Die Spitze liegt auf der Symmetrieachse, und die geht durch die Mitte der Basis.",
          `Mitte der Basis: (${paren(c0 - half)} + ${paren(c0 + half)}) : 2 = ${fmt(c0)}.`,
          `C${point(c0, h)}; x = ${fmt(c0)}.`,
          { c0, half, h },
        );
      },
    },
  ],
});

/** Name and axes of a member of the lab's families of figures. */
function classify(v: Record<string, number>): { name: string; axes: number; list: string } {
  if (v.family === 0) {
    if (Math.abs(v.s) >= v.a / 2)
      return { name: "kein Drachenviereck: Der Versatz ist zu groß", axes: 1, list: "senkrecht" };
    if (v.s !== 0) return { name: "Drachenviereck", axes: 1, list: "Diagonale senkrecht" };
    // This square stands on a corner: its diagonals are the upright axes.
    if (v.a === v.b)
      return { name: "Quadrat", axes: 4, list: "Diagonalen senkrecht und waagerecht, Mittellinien schräg" };
    return { name: "Raute", axes: 2, list: "Diagonalen senkrecht und waagerecht" };
  }
  if (v.family === 1) {
    if (v.s === 0 && v.a === v.b)
      return v.a === 3
        ? { name: "Quadrat", axes: 4, list: "Mittellinien senkrecht und waagerecht, Diagonalen schräg" }
        : { name: "Rechteck", axes: 2, list: "Mittellinien senkrecht und waagerecht" };
    if (v.s === 0)
      return { name: "gleichschenkliges Trapez", axes: 1, list: "senkrecht durch die Seitenmitten" };
    if (v.a === v.b) return { name: "Parallelogramm", axes: 0, list: "keine" };
    return { name: "allgemeines Trapez", axes: 0, list: "keine" };
  }
  if (v.s === 0)
    return { name: "gleichschenkliges Dreieck", axes: 1, list: "senkrecht" };
  // With the apex moved, two sides can still be equal: the axis then runs at a slant.
  const base = v.a * v.a;
  const left = (v.s + v.a / 2) ** 2 + v.b * v.b;
  const right = (v.s - v.a / 2) ** 2 + v.b * v.b;
  return left === base || right === base
    ? { name: "gleichschenkliges Dreieck", axes: 1, list: "schräg" }
    : { name: "unregelmäßiges Dreieck", axes: 0, list: "keine" };
}

export { classify as classifyFamilyFigure };

const besondereFiguren = L(6, {
  id: "as-6-besondere-figuren",
  title: "2.6 Besondere Dreiecke und Vierecke",
  subtitle: "Figuren über ihre Symmetrie erkennen",
  whyItMatters:
    "An der Symmetrie liest du ab, was gleich lang und was gleich groß sein muss. Dazu musst du nichts messen.",
  explanationHtml: `<p>Ein <strong>gleichschenkliges Dreieck</strong> hat 1 Achse: Sie geht durch die Spitze und halbiert die Basis. Deshalb sind die Schenkel und die Basiswinkel gleich groß. Ein <strong>gleichseitiges Dreieck</strong> hat 3 Achsen, alle Seiten und alle Winkel (60°) sind gleich.</p><p>Bei den Vierecken: Das <strong>Drachenviereck</strong> hat 1 Achse, eine Diagonale. Die <strong>Raute</strong> hat 2 Achsen, beide Diagonalen. Das <strong>gleichschenklige Trapez</strong> hat 1 Achse durch die Mitten der parallelen Seiten. Das <strong>Rechteck</strong> hat 2 Achsen, die Mittellinien. Das <strong>Quadrat</strong> hat 4 Achsen, Mittellinien und Diagonalen.</p><div class="example">In einem Drachenviereck mit der Symmetrieachse AC ist [AB] so lang wie [AD], und [CB] ist so lang wie [CD]. Das folgt direkt aus der Längentreue.</div><div class="merke"><strong>Merke:</strong> Ein Parallelogramm, das weder Raute noch Rechteck ist, hat keine Symmetrieachse. Figuren mit Achsen: Drachen und Trapez 1, Raute und Rechteck 2, Quadrat 4.</div>`,
  formulas: [
    {
      name: "Anzahl der Symmetrieachsen",
      html: "gleichschenkliges Dreieck 1; gleichseitiges Dreieck 3; Drachen 1; gleichschenkliges Trapez 1; Raute 2; Rechteck 2; Quadrat 4",
      quantities: "ein allgemeines Parallelogramm hat keine",
    },
  ],
  quiz: {
    question: "Welches Viereck hat genau zwei Symmetrieachsen, und diese sind seine Diagonalen?",
    options: ["Raute", "Rechteck", "Drachenviereck"],
    correctIndex: 0,
    explanation: "Beim Rechteck sind die Achsen die Mittellinien, beim Drachenviereck gibt es nur eine Achse.",
  },
  lab: lab(
    "special-figures",
    "Figuren verwandeln",
    "Wähle eine Familie und verändere die Maße. Die App benennt die Figur und zeichnet ihre Achsen. Bei den Dreiecken zeigt sie nur die gleichschenklige Form.",
    [
      c("family", "Familie", ["Diagonalen senkrecht", "zwei parallele Seiten", "Dreieck"]),
      r("a", "Maß a", 1, 7, 6),
      r("b", "Maß b", 1, 7, 4),
      r("s", "Versatz", -2, 2, 1),
    ],
    [
      o("name", "Figur", (v) => classify(v).name),
      o("axes", "Symmetrieachsen", (v) => classify(v).axes, "", 0),
      o("axesList", "Lage der Achsen", (v) => classify(v).list),
      o("area", "Prüfung durch Spiegeln an der y-Achse", (v) =>
        isSymmetryAxis(familyPoints(v.family, v.a, v.b, v.s), 90) ? "fällt auf sich" : "fällt nicht auf sich",
      ),
    ],
    [
      {
        id: "raute",
        text: "Erzeuge eine Raute, die kein Quadrat ist.",
        check: (v) => classify(v).name === "Raute",
      },
      {
        id: "trapez",
        text: "Erzeuge ein gleichschenkliges Trapez.",
        check: (v) => classify(v).name === "gleichschenkliges Trapez",
      },
      {
        id: "parallelogramm",
        text: "Erzeuge ein Parallelogramm ohne Symmetrieachse.",
        check: (v) => classify(v).name === "Parallelogramm",
      },
    ],
  ),
  exercises: [
    {
      id: "welche-figur",
      make: (rng, level) => {
        const names = ["Drachenviereck", "Raute", "Rechteck", "Quadrat", "gleichschenkliges Trapez"];
        const facts: Record<string, [string, number]> = {
          Drachenviereck: ["genau eine Diagonale ist Symmetrieachse", 1],
          Raute: ["beide Diagonalen sind Symmetrieachsen, die Mittellinien aber nicht", 2],
          Rechteck: ["die beiden Mittellinien sind Symmetrieachsen, die Diagonalen nicht", 2],
          Quadrat: ["Diagonalen und Mittellinien sind Symmetrieachsen", 4],
          "gleichschenkliges Trapez": ["nur die Gerade durch die Mitten der beiden parallelen Seiten ist Symmetrieachse", 1],
        };
        const name = rng.pick(names);
        const [fact, axes] = facts[name];
        const options = [name, ...rng.shuffle(names.filter((entry) => entry !== name)).slice(0, 2)];
        if (level === 1)
          return task(
            level,
            `Bei einem Viereck gilt: ${fact}. Um welches Viereck handelt es sich?`,
            "",
            [pick("Viereck", options, 0)],
            "Drachen und Trapez haben 1 Achse, Raute und Rechteck 2, das Quadrat 4.",
            `Die Beschreibung passt zu ${axes} Achse${axes === 1 ? "" : "n"}.`,
            `${name}.`,
            { axes },
          );
        const base = rng.int(30, 80);
        return task(
          level,
          "",
          `In einem gleichschenkligen Dreieck misst ein Basiswinkel ${base}°. Begründe mit der Symmetrie: Wie groß ist der andere Basiswinkel? Wie groß ist der Winkel an der Spitze? Wie viele Symmetrieachsen hat das Dreieck?`,
          [
            num("Anderer Basiswinkel =", base, "°", 0),
            num("Winkel an der Spitze =", 180 - 2 * base, "°", 0),
            num("Achsen =", base === 60 ? 3 : 1, "", 0),
          ],
          "Die Achse bildet die Basiswinkel aufeinander ab. Die Winkelsumme im Dreieck ist 180°.",
          `180° − 2 · ${base}° = ${180 - 2 * base}°.`,
          `${base}°, ${180 - 2 * base}° und ${base === 60 ? "3 Achsen, denn es ist sogar gleichseitig" : "1 Achse"}.`,
          { base },
        );
      },
    },
    {
      id: "partnerpunkte",
      make: (rng, level) => {
        if (level === 1) {
          const y = rng.int(2, 5);
          const x = rng.int(1, 5);
          return task(
            level,
            `Ein Drachenviereck hat die y-Achse als Symmetrieachse. Eine Ecke ist B${point(x, y)}. Gib die Koordinaten der Partnerecke D an.`,
            "",
            [num("x =", -x, "", 0), num("y =", y, "", 0)],
            "An der y-Achse ändert x sein Vorzeichen, y bleibt gleich.",
            "B und D liegen gleich weit von der Achse entfernt.",
            `D${point(-x, y)}.`,
            { x, y },
          );
        }
        const c0 = rng.int(2, 5);
        const bottom = rng.int(2, 4);
        const top = rng.int(1, bottom - 1);
        const h = rng.int(2, 5);
        return task(
          level,
          "",
          `Ein gleichschenkliges Trapez ABCD hat die Symmetrieachse x = ${c0}. Es ist A${point(c0 - bottom, 0)} und D${point(c0 - top, h)}. Bestimme B und C.`,
          [
            num("x von B =", c0 + bottom, "", 0),
            num("y von B =", 0, "", 0),
            num("x von C =", c0 + top, "", 0),
            num("y von C =", h, "", 0),
          ],
          "A und B sowie D und C sind Partnerpunkte. Sie liegen gleich weit von der Achse entfernt.",
          `A liegt ${bottom} links von der Achse, D liegt ${top} links davon.`,
          `B${point(c0 + bottom, 0)}, C${point(c0 + top, h)}.`,
          { c0, bottom, top, h },
        );
      },
    },
  ],
});

export const STAGE_ACHSENSPIEGELUNG = makeStage(
  2,
  "Achsenspiegelung und Symmetrie",
  "Spiegeln, konstruieren und Symmetrien erkennen",
  "#7c3aed",
  "🪞",
  [eigenschaften, abbilden, senkrechte, winkelhalbierende, symmetrieachsen, besondereFiguren],
);
