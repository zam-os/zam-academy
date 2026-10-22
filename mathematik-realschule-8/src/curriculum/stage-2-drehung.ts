import { fmt } from "../exercises/format";
import { rotate } from "../math";
import {
  choice,
  choiceField,
  defineLesson,
  near,
  numberField,
  range,
  stage,
  task,
} from "./helpers";

export const SYMMETRY_LABELS = [
  "gleichseitiges Dreieck",
  "Quadrat",
  "regelmäßiges Fünfeck",
  "regelmäßiges Sechseck",
  "Rechteck (kein Quadrat)",
];
export const SYMMETRY_ORDERS = [3, 4, 5, 6, 2];
export const ROTATION_ANGLES = [90, -90, 180];

const rotation = defineLesson("dr-1-drehung", {
  subtitle: "Gleicher Abstand zum Zentrum, gleicher Drehwinkel",
  whyItMatters:
    "Eine Drehung beschreibt präzise, wie ein Punkt oder eine ganze Figur ihre Lage ändert.",
  explanationHtml: `<p>Eine Drehung wird durch Zentrum Z und Winkel φ festgelegt. Positive Winkel drehen gegen den Uhrzeigersinn, negative im Uhrzeigersinn. Für den Bildpunkt P′ gilt: ZP′ = ZP und der gerichtete Winkel von ZP zu ZP′ ist φ.</p><p>Zum Konstruieren zeichnest du den Kreis um Z durch P und trägst den Drehwinkel ab. Wiederhole das für jeden Eckpunkt. Streckenlängen und Winkel bleiben erhalten: Die Drehung ist eine <strong>Kongruenzabbildung</strong>. Auch der Umlaufsinn einer Figur bleibt erhalten.</p><div class="merke">Zeichne ein Dreieck und ein Zentrum außerhalb der Figur. Drehe die drei Ecken mit Zirkel und Winkelmesser um +60°. Verbinde die Bildpunkte und prüfe die Seitenlängen.</div>`,
  formulas: [
    {
      name: "Drehvorschrift",
      html: "ZP′ = ZP; ∠(ZP, ZP′) = φ",
      quantities: "Zentrum Z, Drehwinkel φ mit Drehsinn",
    },
  ],
  quiz: {
    question: "Was bedeutet ein Drehwinkel von +90°?",
    options: [
      "Eine Vierteldrehung gegen den Uhrzeigersinn.",
      "Eine Vierteldrehung im Uhrzeigersinn.",
      "Eine Verdopplung aller Abstände.",
    ],
    correctIndex: 0,
    explanation:
      "Positive Winkel drehen gegen den Uhrzeigersinn; Abstände und Längen ändern sich nicht.",
  },
  lab: {
    kind: "rotation",
    title: "Punkt und Dreieck drehen",
    intro: "Ziehe P, verschiebe Z oder ändere den Winkel. Das Bilddreieck dreht sich mit.",
    params: [
      range("x", "P: x", -3, 3, 2),
      range("y", "P: y", -3, 3, 1),
      range("zx", "Z: x", -1, 1, 0),
      range("zy", "Z: y", -1, 1, 0),
      range("angle", "Drehwinkel", -180, 180, 30, 15, "°"),
    ],
    readouts: [
      {
        key: "xp",
        label: "P′: x",
        digits: 2,
        compute: (v) => rotate({ x: v.x, y: v.y }, v.angle, { x: v.zx, y: v.zy }).x,
      },
      {
        key: "yp",
        label: "P′: y",
        digits: 2,
        compute: (v) => rotate({ x: v.x, y: v.y }, v.angle, { x: v.zx, y: v.zy }).y,
      },
      {
        key: "radius",
        label: "ZP = ZP′",
        digits: 2,
        compute: (v) => Math.hypot(v.x - v.zx, v.y - v.zy),
      },
    ],
    goals: [
      {
        id: "viertel",
        text: "Drehe P(3|1) um Z(0|0) mit +90°.",
        check: (v) => v.x === 3 && v.y === 1 && v.zx === 0 && v.zy === 0 && v.angle === 90,
      },
      {
        id: "anderes-zentrum",
        text: "Drehe P(3|1) um Z(1|1) mit 180°.",
        check: (v) => v.x === 3 && v.y === 1 && v.zx === 1 && v.zy === 1 && v.angle === 180,
      },
    ],
  },
  exercises: [
    {
      id: "bildpunkt",
      make: (rng, level) => {
        const x = rng.int(1, 5) * rng.sign(),
          y = rng.int(1, 5) * rng.sign(),
          angle = rng.pick(ROTATION_ANGLES),
          zx = level === 1 ? 0 : rng.int(-2, 2),
          zy = level === 1 ? 0 : rng.int(-2, 2);
        const p = rotate({ x, y }, angle, { x: zx, y: zy });
        return task(
          `${level === 1 ? "Bestimme den Bildpunkt" : "Ein Markierungspunkt auf einer Drehscheibe liegt bei"} P(${fmt(x)}|${fmt(y)}). Drehe ihn um Z(${fmt(zx)}|${fmt(zy)}) um ${fmt(angle)}°.`,
          [numberField("P′: x =", p.x, "", 0), numberField("P′: y =", p.y, "", 0)],
          [
            `Verschiebe gedanklich das Zentrum in den Ursprung: (${fmt(x - zx)}|${fmt(y - zy)}).`,
            `Drehe den Verbindungsvektor und addiere die Zentrumskoordinaten wieder.`,
            `<strong>P′(${fmt(p.x)}|${fmt(p.y)}).</strong>`,
          ],
          level === 1 ? "+90°: (x|y) → (−y|x); −90°: (y|−x); 180°: (−x|−y)" : undefined,
          { x, y, angle, zx, zy },
        );
      },
    },
  ],
});

const symmetry = defineLesson("dr-2-drehsymmetrie", {
  subtitle: "Wann deckt sich eine Figur wieder?",
  whyItMatters: "Symmetrien erklären regelmäßige Muster, Räder und Logos.",
  explanationHtml: `<p>Eine Figur ist drehsymmetrisch, wenn sie nach einer Drehung um weniger als 360° wieder auf sich selbst liegt. Beim regelmäßigen n-Eck ist der kleinste positive Drehwinkel 360°/n; alle Vielfachen davon sind ebenfalls Symmetriewinkel.</p><p>Ein Rechteck, das kein Quadrat ist, passt erst bei 180° wieder auf sich. Eine Drehung um 180° ist die <strong>Punktspiegelung</strong>: Z liegt genau in der Mitte zwischen P und P′. Ein regelmäßiges Fünfeck ist drehsymmetrisch, aber nicht punktsymmetrisch.</p><div class="merke">Suche in einem Muster aus Alltag, Natur oder Kunst ein mögliches Drehzentrum. Zeichne eine Kopie auf Transparentpapier und prüfe den kleinsten Drehwinkel.</div>`,
  formulas: [
    {
      name: "Regelmäßiges n-Eck",
      html: "φ<sub>min</sub> = 360° / n",
      quantities: "n ist die Anzahl der Ecken",
    },
    { name: "Punktspiegelung", html: "P′ = 2Z − P", quantities: "Drehung um 180°" },
  ],
  quiz: {
    question: "Welches regelmäßige Vieleck ist nicht punktsymmetrisch?",
    options: ["Quadrat", "Sechseck", "Fünfeck"],
    correctIndex: 2,
    explanation: "180° ist beim Fünfeck kein Vielfaches von 72°.",
  },
  lab: {
    kind: "rotational-symmetry",
    title: "Zur Deckung bringen",
    intro: "Drehe eine Kopie der Figur. Suche echte Symmetriedrehungen zwischen 0° und 360°.",
    params: [
      choice("shape", "Figur", SYMMETRY_LABELS),
      range("angle", "Drehwinkel", 0, 360, 30, 6, "°"),
    ],
    readouts: [
      {
        key: "smallest",
        label: "Kleinster positiver Symmetriewinkel",
        unit: "°",
        compute: (v) => 360 / SYMMETRY_ORDERS[v.shape],
      },
      {
        key: "match",
        label: "Deckung",
        compute: (v) =>
          near(
            v.angle / (360 / SYMMETRY_ORDERS[v.shape]),
            Math.round(v.angle / (360 / SYMMETRY_ORDERS[v.shape])),
          )
            ? "ja"
            : "nein",
      },
    ],
    goals: [
      {
        id: "fuenfeck",
        text: "Finde den kleinsten positiven Symmetriewinkel des Fünfecks.",
        check: (v) => v.shape === 2 && v.angle === 72,
      },
      {
        id: "punktspiegelung",
        text: "Bringe das Rechteck durch Punktspiegelung auf sich selbst.",
        check: (v) => v.shape === 4 && v.angle === 180,
      },
    ],
  },
  exercises: [
    {
      id: "symmetriewinkel",
      make: (rng, level) => {
        const n = rng.pick([3, 4, 5, 6, 8, 10, 12]),
          k = rng.int(1, n - 1);
        return task(
          level === 1
            ? `Ein regelmäßiges ${n}-Eck wird um seinen Mittelpunkt gedreht. Bestimme den kleinsten positiven Symmetriewinkel.`
            : `Eine Rosette hat ${n} gleichmäßig verteilte, identische Blätter. Wie weit muss sie mindestens gedreht werden, bis sie wieder passt? Passt sie auch nach 180°?`,
          [
            numberField("kleinster Winkel:", 360 / n, "°", 2),
            ...(level === 2
              ? [choiceField("Punktsymmetrisch?", ["ja", "nein"], n % 2 === 0 ? 0 : 1)]
              : [numberField(`Winkel nach ${k} Schritten:`, (k * 360) / n, "°", 2)]),
          ],
          [
            `Der Vollwinkel wird in ${n} gleiche Teile geteilt.`,
            `<strong>360° / ${n} = ${fmt(360 / n, 2)}°.</strong> ${n % 2 === 0 ? "Bei gerader Ordnung gehört 180° dazu." : "Bei ungerader Ordnung gehört 180° nicht dazu."}`,
          ],
          level === 1 ? "360° / Anzahl der gleichen Teile" : undefined,
          { n, k },
        );
      },
    },
  ],
});

const vectors = defineLesson("dr-3-vektoren", {
  subtitle: "Koordinaten tauschen und Vorzeichen beachten",
  whyItMatters: "Mit einer kurzen Koordinatenregel berechnest du Bildvektoren ohne Winkelmessung.",
  explanationHtml: `<p>Ein Vektor beschreibt eine Verschiebung. Bei +90° wird aus (x|y) der Vektor (−y|x); bei −90° wird daraus (y|−x), bei 180° (−x|−y). Die Länge bleibt erhalten.</p><div class="example">Aus v = (3|2) wird bei +90° v′ = (−2|3). Beginnt der gedrehte Vektor bei A(1|−1), endet er bei B′(−1|2). Für einen freien Vektor spielt sein Startpunkt bei der Drehregel keine Rolle.</div>`,
  formulas: [
    { name: "+90°", html: "(x | y) → (−y | x)", quantities: "gegen den Uhrzeigersinn" },
    { name: "−90°", html: "(x | y) → (y | −x)", quantities: "im Uhrzeigersinn" },
    { name: "180°", html: "(x | y) → (−x | −y)", quantities: "Gegenvektor" },
  ],
  quiz: {
    question: "Was wird aus dem Vektor (4|−1) bei +90°?",
    options: ["(−1|−4)", "(1|4)", "(−4|1)"],
    correctIndex: 1,
    explanation: "−y = 1 und x = 4 ergeben (1|4).",
  },
  lab: {
    kind: "vector-rotation",
    title: "Vektor drehen",
    intro: "Ziehe die Pfeilspitze oder ändere die Koordinaten. Vergleiche die beiden Pfeile.",
    params: [
      range("x", "v: x", -5, 5, 3),
      range("y", "v: y", -5, 5, 2),
      choice("turn", "Drehung", ["+90°", "−90°", "180°"]),
    ],
    readouts: [
      {
        key: "xp",
        label: "v′: x",
        compute: (v) => rotate({ x: v.x, y: v.y }, ROTATION_ANGLES[v.turn]).x,
      },
      {
        key: "yp",
        label: "v′: y",
        compute: (v) => rotate({ x: v.x, y: v.y }, ROTATION_ANGLES[v.turn]).y,
      },
    ],
    goals: [
      {
        id: "rechts",
        text: "Drehe (4|−2) im Uhrzeigersinn um 90°.",
        check: (v) => v.x === 4 && v.y === -2 && v.turn === 1,
      },
      {
        id: "gegenvektor",
        text: "Erzeuge den Gegenvektor von (−3|2) durch eine Drehung.",
        check: (v) => v.x === -3 && v.y === 2 && v.turn === 2,
      },
    ],
  },
  exercises: [
    {
      id: "vektor",
      make: (rng, level) => {
        const x = rng.int(1, 5) * rng.sign(),
          y = rng.int(1, 5) * rng.sign(),
          angle = rng.pick(ROTATION_ANGLES),
          ax = level === 1 ? 0 : rng.int(-3, 3),
          ay = level === 1 ? 0 : rng.int(-3, 3),
          v = rotate({ x, y }, angle);
        return task(
          level === 1
            ? `Drehe v = (${fmt(x)}|${fmt(y)}) um ${fmt(angle)}°.`
            : `Ein Roboter steht bei A(${fmt(ax)}|${fmt(ay)}). Seine geplante Verschiebung v = (${fmt(x)}|${fmt(y)}) wird um ${fmt(angle)}° gedreht. Wo endet er nach der gedrehten Verschiebung?`,
          [
            numberField(level === 1 ? "v′: x =" : "Endpunkt: x =", v.x + ax, "", 0),
            numberField(level === 1 ? "v′: y =" : "Endpunkt: y =", v.y + ay, "", 0),
          ],
          [
            `Bildvektor: (${fmt(v.x)}|${fmt(v.y)}).`,
            `<strong>${level === 1 ? "v′" : "Endpunkt"} = (${fmt(v.x + ax)}|${fmt(v.y + ay)}).</strong> ${level === 2 ? "Zum Startpunkt wird der Bildvektor addiert." : "Kontrolliere den Drehsinn."}`,
          ],
          level === 1 ? "+90°: (−y|x); −90°: (y|−x); 180°: (−x|−y)" : undefined,
          { x, y, angle, ax, ay },
        );
      },
    },
  ],
});

export const STAGE_DREHUNG = stage("drehung", [rotation, symmetry, vectors]);
