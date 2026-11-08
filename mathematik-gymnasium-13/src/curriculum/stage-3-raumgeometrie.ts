import { fmt, paren, round, sqrtHtml } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import type { ExerciseTask } from "../model/types";
import {
  add3,
  angleBetween3,
  cross3,
  dot3,
  lineCase,
  lineDistance,
  lineIntersection,
  linePlaneAngle,
  linePlaneCase,
  linePlaneT,
  mul3,
  norm3,
  p3,
  planeAngle,
  planeCase,
  planeText,
  pv,
  sphereText,
  sub3,
  v3,
  vn,
  type V3,
} from "../lab/views-3-raumgeometrie";
import { choice, lab, makeLesson, makeStage, output, range, task } from "./builders";
import { choiceField, numberField } from "./helpers";

// ─── Helfer ────────────────────────────────────────────────────────────────

/** A non-zero integer in [−max, max]. */
const nz = (rng: Rng, max: number): number => rng.int(1, max) * rng.sign();

const ACUTE = "spitz (kleiner als 90°)";
const RIGHT = "rechtwinklig (90°)";
const OBTUSE = "stumpf (größer als 90°)";

/** Pairs of vectors whose angle has a smooth cosine: 0, ±0,5, ±0,7071, ±0,866. */
const ANGLE_PAIRS: Array<[V3, V3, number]> = [
  [v3(1, 0, 0), v3(0, 1, 0), 90],
  [v3(1, 1, 0), v3(1, 0, 1), 60],
  [v3(1, 0, 0), v3(1, 1, 0), 45],
  [v3(1, 1, 0), v3(2, 1, 1), 30],
  [v3(1, 1, 0), v3(-1, 0, 1), 120],
  [v3(1, 0, 0), v3(-1, 1, 0), 135],
  [v3(1, 1, 0), v3(-2, -1, 1), 150],
];

/** A pair of whole vectors with a smooth angle: permuted axes, flipped signs, scaled. */
function anglePair(rng: Rng, avoid?: number): { u: V3; v: V3; deg: number } {
  const options = ANGLE_PAIRS.filter(([, , deg]) => deg !== avoid);
  const [baseU, baseV, deg] = rng.pick(options);
  const perm = rng.pick([
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ] as Array<[number, number, number]>);
  const sign = [rng.sign(), rng.sign(), rng.sign()];
  const map = (value: V3): V3 => {
    const parts = [value.x, value.y, value.z];
    return v3(sign[0] * parts[perm[0]], sign[1] * parts[perm[1]], sign[2] * parts[perm[2]]);
  };
  return {
    u: mul3(rng.int(1, 3), map(baseU)),
    v: mul3(rng.int(1, 3), map(baseV)),
    deg,
  };
}

/** A unimodular 2×2 base (determinant ±1), so 2×2 systems have whole solutions. */
const UNIMOD: Array<[number, number, number, number]> = [
  [1, 0, 0, 1],
  [1, 1, 0, 1],
  [1, 0, 1, 1],
  [2, 1, 1, 1],
  [1, 2, 1, 1],
  [3, 1, 2, 1],
  [3, 2, 1, 1],
];

/** The three axes as unit vectors. */
const axisVec = (axis: number): V3 =>
  axis === 0 ? v3(1, 0, 0) : axis === 1 ? v3(0, 1, 0) : v3(0, 0, 1);

/** A normal vector with whole length 3s: s · perm(1 | 2 | 2). */
function smoothNormal(rng: Rng): { n: V3; len: number } {
  const base = rng.pick([
    [1, 2, 2],
    [2, 1, 2],
    [2, 2, 1],
  ] as Array<[number, number, number]>);
  const s = rng.int(1, 2) * rng.sign();
  return { n: v3(s * base[0], s * base[1], s * base[2]), len: 3 * Math.abs(s) };
}

/** A normal vector of length 5 whose component `zeroAt` is 0 (parallel to that axis). */
function normalWithZero(rng: Rng, zeroAt: number): V3 {
  const [p, q] = rng.pick([
    [3, 4],
    [4, 3],
  ] as Array<[number, number]>);
  const values = [0, 0, 0];
  const others = [0, 1, 2].filter((i) => i !== zeroAt);
  values[others[0]] = p * rng.sign();
  values[others[1]] = q * rng.sign();
  return v3(values[0], values[1], values[2]);
}

/** A Pythagorean pair (p | q) with whole hypotenuse. */
const PYTH = [
  [3, 4],
  [4, 3],
  [6, 8],
  [8, 6],
  [5, 12],
  [12, 5],
  [9, 12],
  [12, 9],
] as Array<[number, number]>;

/** "P(1 | 2 | −3)" for whole numbers. */
const caseWord = (value: V3, digits = 0) => p3(value.x, value.y, value.z, digits);

// ─── 3.1 Geraden im Raum ──────────────────────────────────────────────────

const geradenGleichung = {
  id: "geraden-gleichung",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    const a = v3(rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4));
    const u = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
    if (level === 1) {
      const t0 = rng.pick([-2, -1, 2, 3]);
      const x = add3(a, mul3(t0, u));
      return task(
        level,
        `Gegeben ist die Gerade g: X = ${pv(a, 0)} + t · ${pv(u, 0)}. Berechne die Koordinaten des Punkts X(${fmt(t0, 0)}).`,
        "",
        [
          numberField("X: x =", x.x, "", 0, {
            slips: [
              {
                value: a.x + u.x,
                hint: `Setze t = ${fmt(t0, 0)} ein, nicht t = 1: x = a₁ + t · u₁.`,
              },
            ],
          }),
          numberField("y =", x.y, "", 0),
          numberField("z =", x.z, "", 0),
        ],
        `X(t) = A + t · u: Setze t = ${fmt(t0, 0)} ein und rechne koordinatenweise weiter.`,
        `x = ${fmt(a.x, 0)} + ${paren(t0, 0)} · ${paren(u.x, 0)} = ${fmt(x.x, 0)}, y = ${fmt(a.y, 0)} + ${paren(t0, 0)} · ${paren(u.y, 0)} = ${fmt(x.y, 0)}, z = ${fmt(a.z, 0)} + ${paren(t0, 0)} · ${paren(u.z, 0)} = ${fmt(x.z, 0)}`,
        `X(${fmt(t0, 0)}) = ${caseWord(x)}`,
        { ax: a.x, ay: a.y, az: a.z, ux: u.x, uy: u.y, uz: u.z, t: t0 },
      );
    }
    const t2 = rng.pick([3, 4, 5]);
    const x = add3(a, mul3(t2, u));
    return task(
      level,
      "",
      `Eine Vermessungsdrohne fliegt geradlinig. Um 10:00 Uhr (t = 0) ist sie bei A = ${caseWord(a)}, um 11:00 Uhr (t = 1) bei B = ${caseWord(add3(a, u))}. Der Flug folgt einer Geraden X(t) = A + t · u mit u = B − A. Wo ist die Drohne um ${fmt(t2 + 9, 0)}:00 Uhr?`,
      [
        numberField("X: x =", x.x, "", 0),
        numberField("y =", x.y, "", 0),
        numberField("z =", x.z, "", 0),
      ],
      "Bilde zuerst den Richtungsvektor u = B − A und setze dann t ein.",
      [
        `u = B − A = ${pv(u, 0)}`,
        `X(${fmt(t2, 0)}) = ${pv(a, 0)} + ${fmt(t2, 0)} · ${pv(u, 0)} = ${caseWord(x)}`,
      ],
      `Um ${fmt(t2 + 9, 0)}:00 Uhr ist die Drohne bei ${caseWord(x)}.`,
      { ax: a.x, ay: a.y, az: a.z, ux: u.x, uy: u.y, uz: u.z, t: t2 },
    );
  },
};

const punktAufGerade = {
  id: "punkt-auf-gerade",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    const a = v3(rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3));
    const u = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
    const t0 = rng.pick([-2, -1, 1, 2, 3]);
    const on = rng.next() < 0.5;
    const off = rng.pick([v3(0, 1, 0), v3(0, 0, 1), v3(0, -1, 1), v3(0, 1, -1)]);
    const p = on ? add3(a, mul3(t0, u)) : add3(add3(a, mul3(t0, u)), off);
    const probe = on ? 0 : 1;
    if (level === 1) {
      const x2 = add3(a, mul3(2, u));
      return task(
        level,
        `Gegeben sind g: X = ${pv(a, 0)} + t · ${pv(u, 0)} und der Punkt P = ${caseWord(p)}. Berechne X(2) und entscheide: Liegt P auf g?`,
        "",
        [
          numberField("X(2): x =", x2.x, "", 0),
          numberField("y =", x2.y, "", 0),
          numberField("z =", x2.z, "", 0),
          choiceField("Liegt P auf g?", ["ja, P liegt auf g", "nein, P liegt nicht auf g"], probe),
        ],
        "P liegt genau dann auf g, wenn P − A ein Vielfaches von u ist. X(2) bekommst du mit t = 2.",
        [
          `X(2) = ${pv(a, 0)} + 2 · ${pv(u, 0)} = ${caseWord(x2)}`,
          `Probe: P − A = ${caseWord(sub3(p, a))}; vergleiche mit u = ${pv(u, 0)}`,
        ],
        on
          ? `X(2) = ${caseWord(x2)} und P = X(${fmt(t0, 0)}) liegt auf g.`
          : `X(2) = ${caseWord(x2)}; P − A ist kein Vielfaches von u, P liegt nicht auf g.`,
        {
          ax: a.x,
          ay: a.y,
          az: a.z,
          ux: u.x,
          uy: u.y,
          uz: u.z,
          px: p.x,
          py: p.y,
          pz: p.z,
          t: t0,
        },
      );
    }
    const tx = (p.x - a.x) / u.x;
    return task(
      level,
      "",
      `Eine Drohne fliegt die Bahn X(t) = ${pv(a, 0)} + t · ${pv(u, 0)} (t in Stunden). Vom Ziel P = ${caseWord(p)} wird gemeldet, es liege auf der Bahn. Prüfe das: Aus der x-Koordinate von P folgt ein Wert für t. Liegt P wirklich auf der Bahn?`,
      [
        numberField("t aus der x-Koordinate:", tx, "", 0),
        choiceField(
          "Liegt P auf der Bahn?",
          ["ja, P liegt auf der Bahn", "nein, P liegt nicht auf der Bahn"],
          probe,
        ),
      ],
      "Setze den t-Wert aus der x-Koordinate in die y- und z-Koordinate ein. Nur wenn beide stimmen, liegt P auf der Bahn.",
      [
        `Aus x = ${fmt(p.x, 0)} = ${fmt(a.x, 0)} + t · ${paren(u.x, 0)} folgt t = ${fmt(tx, 0)}.`,
        `Probe: y = ${fmt(a.y, 0)} + ${paren(tx, 0)} · ${paren(u.y, 0)} = ${fmt(a.y + tx * u.y, 0)} und z = ${fmt(a.z, 0)} + ${paren(tx, 0)} · ${paren(u.z, 0)} = ${fmt(a.z + tx * u.z, 0)}`,
      ],
      on
        ? `t = ${fmt(tx, 0)} und beide Probestimmen: P liegt auf der Bahn.`
        : `t = ${fmt(tx, 0)}, aber die Probe stimmt nicht: P liegt nicht auf der Bahn.`,
      {
        ax: a.x,
        ay: a.y,
        az: a.z,
        ux: u.x,
        uy: u.y,
        uz: u.z,
        px: p.x,
        py: p.y,
        pz: p.z,
        t: t0,
      },
    );
  },
};

const l1 = makeLesson(3, 1, {
  id: "rg-1-geraden",
  title: "3.1 Geraden im Raum",
  subtitle: "Ein Punkt, eine Richtung, ein Parameter",
  whyItMatters:
    "Im Raum gibt es kein Koordinatengitter zum Nachzeichnen: Geraden beschreibst du deshalb mit Gleichungen. Ob Flugbahn, Roboterarm oder Lichtstrahl – wer Linien im Raum rechnen kann, löst später Schnitt-, Winkel- und Abstandsaufgaben ohne Zeichnung.",
  explanationHtml: `
    <p>Eine <strong>Gerade im Raum</strong> braucht zwei Angaben: einen <strong>Stützpunkt</strong> A und einen <strong>Richtungsvektor</strong> ${vn("u")}. Beide zusammen schreibst du in der <strong>Parameterform</strong> (auch Parametergleichung genannt):</p>
    <p class="formula-line">g: X = A + t · ${vn("u")}, t ∈ ℝ</p>
    <ul>
      <li><strong>Stützvektor:</strong> Der Ortsvektor ${vn("OA")} = A des Punkts A zeigt vom Ursprung zu einem Punkt der Geraden.</li>
      <li><strong>Richtungsvektor:</strong> ${vn("u")} ist nicht der Nullvektor und gibt an, wohin die Gerade läuft. Jeder Punkt der Geraden entsteht, indem man ab A um ein Vielfaches t · ${vn("u")} weitergeht.</li>
      <li><strong>Parameter t:</strong> Für t = 0 ist X = A, für t = 1 ist X = A + ${vn("u")}, für t = 2 geht es zweimal so weit in ${vn("u")}-Richtung. Negatives t läuft rückwärts.</li>
      <li><strong>Gerade durch zwei Punkte:</strong> Aus A und B wird zuerst der Richtungsvektor ${vn("u")} = B − A (Spitze minus Schaft), dann g: X = A + t · ${vn("u")}.</li>
      <li><strong>Punktprobe:</strong> P liegt genau dann auf g, wenn P − A ein Vielfaches von ${vn("u")} ist; den passenden Wert nennt man t.</li>
    </ul>
    <div class="example">Beispiel: A = (1 | 2 | 0), ${vn("u")} = (2 | 1 | 3), also g: X = (1 | 2 | 0) + t · (2 | 1 | 3). Für t = 2 ist X = (1 | 2 | 0) + 2 · (2 | 1 | 3) = (5 | 4 | 6). Der Punkt B = (5 | 4 | 6) liegt auf g (hier zu t = 2), denn B − A = (4 | 2 | 6) = 2 · ${vn("u")}. Der Punkt (5 | 4 | 0) liegt nicht auf g, denn (4 | 2 | 0) ist kein Vielfaches von (2 | 1 | 3).</div>
    <div class="merke"><strong>Merke:</strong> g: X = A + t · ${vn("u")}, und ${vn("u")} ist nicht der Nullvektor. Ein Vielfaches von ${vn("u")} beschreibt dieselbe Gerade, etwa 2 · ${vn("u")}: Nur die Schrittweite von t ändert sich.</div>
  `,
  formulas: [
    {
      name: "Parameterform einer Geraden",
      html: `g: X = A + t · ${vn("u")}, t ∈ ℝ`,
      quantities: "A Stützpunkt (Punkt der Geraden), u Richtungsvektor (ungleich 0), t Parameter",
    },
    {
      name: "Gerade durch zwei Punkte",
      html: `${vn("u")} = B − A, dann g: X = A + t · ${vn("u")}`,
      quantities: "Spitze minus Schaft liefert die Richtung",
    },
    {
      name: "Punktprobe",
      html: `P ∈ g ⇔ P − A = t · ${vn("u")}`,
      quantities: "P − A muss ein Vielfaches des Richtungsvektors sein",
    },
  ],
  quiz: {
    question: "Welche Aussage zur Geraden g: X = A + t · u ist richtig?",
    options: [
      "Ein Vielfaches von u beschreibt dieselbe Gerade.",
      "Für t = 0 erhält man immer den Ursprung.",
      "Der Richtungsvektor u darf der Nullvektor sein.",
    ],
    correctIndex: 0,
    explanation:
      "Nur die Schrittweite von t hängt an der Länge von u: 2 · u zeigt in dieselbe Richtung und erzeugt dieselbe Punktmenge. Für t = 0 steht X = A, und der Nullvektor wäre gar keine Gerade.",
  },
  lab: lab(
    "gerade-3d",
    "Geraden im Raum",
    "Ziehe den Punkt X(t): Er wandert auf der Geraden. A ist der Stützpunkt (orange), u der Richtungsvektor. Alle Zahlen unten werden gerechnet, nicht im Bild gemessen.",
    [
      range("ax", "x von A", -4, 4, 1),
      range("ay", "y von A", -4, 4, 2),
      range("az", "z von A", -4, 4, 0),
      range("ux", "x von u", -3, 3, 1),
      range("uy", "y von u", -3, 3, 2),
      range("uz", "z von u", -3, 3, 3),
      range("t", "Parameter t", -3, 3, 1),
    ],
    [
      output("gleichung", "Gleichung", (v) => `g: X = ${p3(v.ax, v.ay, v.az)} + t · ${p3(v.ux, v.uy, v.uz)}`),
      output(
        "xt",
        "Punkt X(t)",
        (v) => `X(${fmt(v.t)}) = ${p3(v.ax + v.t * v.ux, v.ay + v.t * v.uy, v.az + v.t * v.uz)}`,
      ),
      output("laenge", "Länge |u|", (v) => Math.hypot(v.ux, v.uy, v.uz), "", 2),
    ],
    [
      {
        id: "ursprung-richtung",
        text: "Lege den Stützpunkt auf den Ursprung und die Richtung auf (1 | 0 | 0).",
        check: (v) => v.ax === 0 && v.ay === 0 && v.az === 0 && v.ux === 1 && v.uy === 0 && v.uz === 0,
      },
      {
        id: "punkt-t-zwei",
        text: "Stelle A, u und t so ein, dass t = 2 ist und X(t) = (2 | 4 | 6) herauskommt.",
        check: (v) => v.t === 2 && v.ax + 2 * v.ux === 2 && v.ay + 2 * v.uy === 4 && v.az + 2 * v.uz === 6,
      },
      {
        id: "z-achse",
        text: "Lege A auf die z-Achse, aber nicht auf den Ursprung: Die Gerade schneidet dann die z-Achse.",
        check: (v) => v.ax === 0 && v.ay === 0 && v.az !== 0,
      },
    ],
  ),
  exercises: [geradenGleichung, punktAufGerade],
});

// ─── 3.2 Lineare Abhängigkeit und Linearkombination ───────────────────────

const linearkombinationGen = {
  id: "linearkombination",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const [a, b, c, d] = rng.pick(UNIMOD);
      const u = v3(a, b, 0);
      const v = v3(c, d, 0);
      const r0 = nz(rng, 3);
      const s0 = nz(rng, 3);
      const w = add3(mul3(r0, u), mul3(s0, v));
      return task(
        level,
        `Gegeben sind u = ${pv(u, 0)} und v = ${pv(v, 0)}. Stelle den Vektor w = ${pv(w, 0)} als Linearkombination w = r · u + s · v dar.`,
        "",
        [numberField("r =", r0, "", 0), numberField("s =", s0, "", 0)],
        "Stelle das Gleichungssystem aus den beiden Koordinaten auf und löse es, am besten mit der 2×2-Determinante.",
        [
          `${fmt(a, 0)} · r + ${paren(c, 0)} · s = ${fmt(w.x, 0)} und ${paren(b, 0)} · r + ${paren(d, 0)} · s = ${fmt(w.y, 0)}`,
          `Determinante = ${fmt(a * d - b * c, 0)}: eindeutig lösbar. Eingesetzt ergibt r = ${fmt(r0, 0)} und s = ${fmt(s0, 0)}.`,
        ],
        `r = ${fmt(r0, 0)}, s = ${fmt(s0, 0)}`,
        { ux: u.x, uy: u.y, vx: v.x, vy: v.y, wx: w.x, wy: w.y, r: r0, s: s0 },
      );
    }
    const u = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
    let v = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
    while (norm3(cross3(u, v)) < 1e-9) v = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
    const r0 = nz(rng, 3);
    const s0 = nz(rng, 3);
    const w = add3(mul3(r0, u), mul3(s0, v));
    return task(
      level,
      "",
      `Zwei Mülsorten werden gemischt. Sorte A hat den Nährwertvektor A = ${pv(u, 0)} (Eiweiß | Fett | Zucker in g je Portion), Sorte B den Vektor B = ${pv(v, 0)}. Die Mischung M = ${pv(w, 0)} soll genau r Portionen A und s Portionen B enthalten. Bestimme r und s.`,
      [
        numberField("Portionen A (r) =", r0, "", 0),
        numberField("Portionen B (s) =", s0, "", 0),
      ],
      "Jede Nährwertkomponente liefert eine Gleichung: r · A + s · B = M. Zwei der drei Gleichungen reichen zum Lösen.",
      [
        `Kontrolle Eiweiß: ${paren(r0, 0)} · ${paren(u.x, 0)} + ${paren(s0, 0)} · ${paren(v.x, 0)} = ${fmt(w.x, 0)}`,
        `Kontrolle Fett: ${paren(r0, 0)} · ${paren(u.y, 0)} + ${paren(s0, 0)} · ${paren(v.y, 0)} = ${fmt(w.y, 0)}`,
      ],
      `Die Mischung enthält ${fmt(r0, 0)} Portionen A und ${fmt(s0, 0)} Portionen B.`,
      { ux: u.x, uy: u.y, uz: u.z, vx: v.x, vy: v.y, vz: v.z, wx: w.x, wy: w.y, wz: w.z, r: r0, s: s0 },
    );
  },
};

const abhaengigkeit = {
  id: "abhaengigkeit",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const dependent = rng.next() < 0.5;
      const u = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
      const lam = rng.pick([-3, -2, -1, 1, 2, 3]);
      let v = dependent ? mul3(lam, u) : v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
      while (!dependent && norm3(cross3(u, v)) < 1e-9) v = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
      const c = cross3(u, v);
      const dependentNow = c.x === 0 && c.y === 0 && c.z === 0;
      return task(
        level,
        `Gegeben sind u = ${pv(u, 0)} und v = ${pv(v, 0)}. Berechne das Kreuzprodukt u × v und entscheide: Sind die beiden Vektoren linear unabhängig?`,
        "",
        [
          numberField("(u × v) x =", c.x, "", 0),
          numberField("y =", c.y, "", 0),
          numberField("z =", c.z, "", 0),
          choiceField(
            "Die Vektoren sind …",
            ["linear unabhängig", "linear abhängig"],
            dependentNow ? 1 : 0,
          ),
        ],
        "Zwei Vektoren sind genau dann linear abhängig, wenn das Kreuzprodukt der Nullvektor ist (dann ist einer ein Vielfaches des anderen).",
        [
          `u × v = (u₂ · v₃ − u₃ · v₂ | u₃ · v₁ − u₁ · v₃ | u₁ · v₂ − u₂ · v₁) = ${pv(c, 0)}`,
          dependentNow
            ? "Das Kreuzprodukt ist der Nullvektor: die Vektoren sind linear abhängig."
            : "Das Kreuzprodukt ist nicht der Nullvektor: die Vektoren sind linear unabhängig.",
        ],
        dependentNow
          ? `u × v = (0 | 0 | 0): u und v sind linear abhängig.`
          : `u × v = ${pv(c, 0)} und nicht der Nullvektor: u und v sind linear unabhängig.`,
        {
          ux: u.x,
          uy: u.y,
          uz: u.z,
          vx: v.x,
          vy: v.y,
          vz: v.z,
          dependent: dependentNow ? 1 : 0,
        },
      );
    }
    const u = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
    const lam = rng.pick([-3, -2, 2, 3]);
    const v = mul3(lam, u);
    const alpha = nz(rng, 3);
    const w = mul3(alpha, u);
    const r1v = alpha - lam;
    const r2v = alpha + lam;
    return task(
      level,
      "",
      `Die Vektoren u = ${pv(u, 0)} und v = ${pv(v, 0)} sind linear abhängig. Zeige das mit einer Abhängigkeitsgleichung: Gesucht sind r und s mit r · u + s · v = w für w = ${pv(w, 0)}. Bestimme r für s = 1 und zum Vergleich r′ für s = −1.`,
      [
        numberField("r (bei s = 1) =", r1v, "", 0),
        numberField("r′ (bei s = −1) =", r2v, "", 0),
      ],
      "Nutze v = λ · u: Ersetze v durch λ · u, dann fasst du u zusammen und liest r ab.",
      [
        `Da v = ${fmt(lam, 0)} · u ist, wird r · u + s · ${fmt(lam, 0)} · u = (r + s · ${paren(lam, 0)}) · u.`,
        `Das soll w = ${fmt(alpha, 0)} · u sein, also r + s · ${paren(lam, 0)} = ${fmt(alpha, 0)}.`,
      ],
      `Bei s = 1 ist r = ${fmt(r1v, 0)}, bei s = −1 ist r′ = ${fmt(r2v, 0)}.`,
      { ux: u.x, uy: u.y, uz: u.z, lam, alpha, r1: r1v, r2: r2v },
    );
  },
};

const l2 = makeLesson(3, 2, {
  id: "rg-2-linearkombination",
  title: "3.2 Lineare Abhängigkeit und Linearkombination",
  subtitle: "Wann ein Vektor aus anderen entsteht",
  whyItMatters:
    "Linearkombinationen sind das Handwerkszeug der Raumgeometrie: Ebenen spannen sich aus zwei Vektoren auf, Schnittgeraden entstehen als Kombination von Normalenvektoren. Und wer prüft, ob Vektoren abhängig sind, erkennt, ob eine Lösung eindeutig ist.",
  explanationHtml: `
    <p>Eine <strong>Linearkombination</strong> entsteht, wenn man Vektoren mit Zahlen vervielfacht und addiert: w = r · ${vn("u")} + s · ${vn("v")} mit reellen Zahlen r und s. Im Raum liegen alle Linearkombinationen von ${vn("u")} und ${vn("v")} in der Ebene, die durch den Ursprung geht und von ${vn("u")}, ${vn("v")} aufgespannt wird.</p>
    <ul>
      <li><strong>Linear abhängig:</strong> ${vn("u")} und ${vn("v")} sind linear abhängig, wenn es Zahlen λ und μ gibt (nicht beide 0), mit λ · ${vn("u")} + μ · ${vn("v")} = ${vn("0")}. Bei zwei Vektoren heißt das: Einer ist ein Vielfaches des anderen (kollinear).</li>
      <li><strong>Linear unabhängig:</strong> Keiner ist ein Vielfache des anderen; im ℝ³ gilt das genau dann, wenn ${vn("u")} × ${vn("v")} nicht der Nullvektor ist.</li>
      <li><strong>Vier und mehr Vektoren im ℝ³:</strong> Vier oder mehr Vektoren sind im Raum immer linear abhängig; drei können eine Basis bilden, etwa die Einheitsvektoren.</li>
      <li><strong>Darstellen:</strong> w = r · ${vn("u")} + s · ${vn("v")} aufstellen heißt, ein Gleichungssystem zu lösen. Geht das nicht (z. B. weil w aus der Ebene herausragt), ist w keine Linearkombination.</li>
    </ul>
    <div class="example">Beispiel: ${vn("u")} = (1 | 0 | 0), ${vn("v")} = (0 | 1 | 0), w = (2 | 3 | 0). Dann ist w = 2 · ${vn("u")} + 3 · ${vn("v")}, also eine Linearkombination mit r = 2 und s = 3. Der Vektor w′ = (2 | 3 | 1) ist keine Linearkombination von ${vn("u")} und ${vn("v")}: Die z-Koordinate ließe sich nicht erzeugen. Und (2 | 0 | 0) mit (4 | 0 | 0) sind abhängig, denn (4 | 0 | 0) = 2 · (2 | 0 | 0).</div>
    <div class="merke"><strong>Merke:</strong> Zwei Vektoren sind linear unabhängig, wenn keiner ein Vielfaches des anderen ist. Eine Linearkombination w = r · ${vn("u")} + s · ${vn("v")} ist genau dann möglich, wenn das Gleichungssystem lösbar ist.</div>
  `,
  formulas: [
    {
      name: "Linearkombination",
      html: `w = r · ${vn("u")} + s · ${vn("v")}`,
      quantities: "r, s reelle Zahlen; u, v die Basisvektoren, w die Linearkombination",
    },
    {
      name: "Lineare Abhängigkeit (zwei Vektoren)",
      html: `${vn("u")}, ${vn("v")} abhängig ⇔ ${vn("u")} × ${vn("v")} = ${vn("0")}`,
      quantities: "das Kreuzprodukt ist der Nullvektor, wenn einer ein Vielfaches des anderen ist",
    },
  ],
  quiz: {
    question: "Wann sind zwei Vektoren u und v im ℝ³ linear unabhängig?",
    options: [
      "Wenn keiner der beiden ein Vielfache des anderen ist.",
      "Wenn beide Vektoren eine 0 als Koordinate haben.",
      "Wenn beide Vektoren gleich lang sind.",
    ],
    correctIndex: 0,
    explanation:
      "Lineare Unabhängigkeit bei zwei Vektoren heißt: kein Vielfaches-Zusammenhang, also u × v ist nicht der Nullvektor. Gleich lange Vektoren können trotzdem kollinear sein – die Länge sagt nichts darüber aus.",
  },
  lab: lab(
    "linearkombination",
    "Linearkombination im Raum",
    "Ziehe die Spitzen von u und v in der xy-Ebene. Der Zielvektor w soll als r · u + s · v dastehen. Die z-Koordinate von w entscheidet, ob das überhaupt geht: u und v liegen in der xy-Ebene.",
    [
      range("ux", "x von u", -3, 3, 1),
      range("uy", "y von u", -3, 3, 0),
      range("vx", "x von v", -3, 3, 1),
      range("vy", "y von v", -3, 3, 1),
      range("wx", "x von w", -3, 3, 2),
      range("wy", "y von w", -3, 3, 1),
      range("wz", "z von w", -2, 2, 0),
    ],
    [
      output("det", "Determinante det(u | v)", (v) => v.ux * v.vy - v.uy * v.vx, "", 0),
      output("rs", "Koeffizienten", (v) => {
        const det = v.ux * v.vy - v.uy * v.vx;
        if (det !== 0) {
          const r = (v.wx * v.vy - v.wy * v.vx) / det;
          const s = (v.ux * v.wy - v.uy * v.wx) / det;
          return v.wz === 0 ? `r = ${fmt(r)}, s = ${fmt(s)}` : "nicht darstellbar (z von w ≠ 0)";
        }
        if (v.wz !== 0) return "nicht darstellbar (z von w ≠ 0)";
        return v.ux * v.wy - v.uy * v.wx === 0
          ? "unendlich viele Lösungen"
          : "nicht darstellbar";
      }),
      output("lage", "Lage von w", (v) => {
        const det = v.ux * v.vy - v.uy * v.vx;
        if (v.wz !== 0) return "w ragt aus der xy-Ebene heraus";
        return det !== 0 ? "w liegt in der Ebene von u und v" : "u und v sind kollinear";
      }),
    ],
    [
      {
        id: "r-zwei-s-minus-eins",
        text: "Stelle w so ein, dass w = 2 · u + (−1) · v wird, also r = 2 und s = −1.",
        check: (v) => {
          const det = v.ux * v.vy - v.uy * v.vx;
          return (
            det !== 0 &&
            v.wz === 0 &&
            Math.abs((v.wx * v.vy - v.wy * v.vx) / det - 2) < 1e-9 &&
            Math.abs((v.ux * v.wy - v.uy * v.wx) / det + 1) < 1e-9
          );
        },
      },
      {
        id: "kollinear",
        text: "Mache u und v kollinear (einer ist ein Vielfache des anderen): Die Determinante wird 0.",
        check: (v) =>
          (v.ux !== 0 || v.uy !== 0) &&
          (v.vx !== 0 || v.vy !== 0) &&
          v.ux * v.vy - v.uy * v.vx === 0,
      },
      {
        id: "ausserhalb-der-ebene",
        text: "Stelle w außerhalb der von u und v aufgespannten Ebene: Die z-Koordinate von w ist nicht 0.",
        check: (v) => v.wz !== 0,
      },
    ],
  ),
  exercises: [linearkombinationGen, abhaengigkeit],
});

// ─── 3.3 Ebenen in Parameterform ──────────────────────────────────────────

const ebeneParameterGen = {
  id: "ebene-parameter",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    const p = v3(rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3));
    const u = v3(nz(rng, 2), nz(rng, 2), nz(rng, 2));
    const v = v3(nz(rng, 2), nz(rng, 2), nz(rng, 2));
    if (level === 1) {
      const r0 = nz(rng, 2);
      const s0 = nz(rng, 2);
      const x = add3(add3(p, mul3(r0, u)), mul3(s0, v));
      return task(
        level,
        `Die Ebene E hat die Parameterform X = ${pv(p, 0)} + r · ${pv(u, 0)} + s · ${pv(v, 0)}. Berechne den Punkt X(${fmt(r0, 0)} | ${fmt(s0, 0)}).`,
        "",
        [
          numberField("X: x =", x.x, "", 0, {
            slips: [
              {
                value: p.x + r0 * v.x + s0 * u.x,
                hint: "r multipliziert u, s multipliziert v – nicht vertauschen.",
              },
            ],
          }),
          numberField("y =", x.y, "", 0),
          numberField("z =", x.z, "", 0),
        ],
        "X = P + r · u + s · v: addiere zu P zuerst r · u, dann s · v, koordinatenweise.",
        [
          `r · u = ${fmt(r0, 0)} · ${pv(u, 0)} = ${pv(mul3(r0, u), 0)}, s · v = ${fmt(s0, 0)} · ${pv(v, 0)} = ${pv(mul3(s0, v), 0)}`,
          `X = ${pv(p, 0)} + ${pv(mul3(r0, u), 0)} + ${pv(mul3(s0, v), 0)} = ${caseWord(x)}`,
        ],
        `X(${fmt(r0, 0)} | ${fmt(s0, 0)}) = ${caseWord(x)}`,
        {
          px: p.x,
          py: p.y,
          pz: p.z,
          ux: u.x,
          uy: u.y,
          uz: u.z,
          vx: v.x,
          vy: v.y,
          vz: v.z,
          r: r0,
          s: s0,
        },
      );
    }
    const q = add3(p, u);
    const r3 = add3(p, v);
    return task(
      level,
      "",
      `Eine schiefe Fläche geht durch die Punkte P = ${caseWord(p)}, Q = ${caseWord(q)} und R = ${caseWord(r3)}. Stelle die Parameterform X = P + r · u + s · v mit u = Q − P und v = R − P auf.`,
      [
        numberField("u: x =", u.x, "", 0),
        numberField("y =", u.y, "", 0),
        numberField("z =", u.z, "", 0),
        numberField("v: x =", v.x, "", 0),
        numberField("y =", v.y, "", 0),
        numberField("z =", v.z, "", 0),
      ],
      "Die Spannvektoren sind Verbindungsvektoren: Spitze minus Schaft, koordinatenweise.",
      [
        `u = Q − P = ${pv(q, 0)} − ${pv(p, 0)} = ${pv(u, 0)}`,
        `v = R − P = ${pv(r3, 0)} − ${pv(p, 0)} = ${pv(v, 0)}`,
      ],
      `E: X = ${pv(p, 0)} + r · ${pv(u, 0)} + s · ${pv(v, 0)}`,
      {
        px: p.x,
        py: p.y,
        pz: p.z,
        ux: u.x,
        uy: u.y,
        uz: u.z,
        vx: v.x,
        vy: v.y,
        vz: v.z,
      },
    );
  },
};

const punktInEbene = {
  id: "punkt-in-ebene",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    const [a, b, c, d] = rng.pick(UNIMOD);
    const p = v3(rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3));
    const r0 = nz(rng, 2);
    const s0 = nz(rng, 2);
    if (level === 1) {
      const u = v3(a, b, 0);
      const v = v3(c, d, 0);
      const x = add3(add3(p, mul3(r0, u)), mul3(s0, v));
      return task(
        level,
        `In der Ebene E: X = ${pv(p, 0)} + r · ${pv(u, 0)} + s · ${pv(v, 0)} liegt der Punkt X = ${caseWord(x)}. Bestimme die passenden Werte r und s.`,
        "",
        [numberField("r =", r0, "", 0), numberField("s =", s0, "", 0)],
        "Setze X = P + r · u + s · v an und löse das Gleichungssystem aus den ersten beiden Koordinaten.",
        [
          `${fmt(x.x, 0)} = ${fmt(p.x, 0)} + ${paren(a, 0)} · r + ${paren(c, 0)} · s und ${fmt(x.y, 0)} = ${fmt(p.y, 0)} + ${paren(b, 0)} · r + ${paren(d, 0)} · s`,
          `Gelöst: r = ${fmt(r0, 0)}, s = ${fmt(s0, 0)}. Probe mit der dritten Koordinate: ${fmt(p.z, 0)} = ${fmt(x.z, 0)}`,
        ],
        `r = ${fmt(r0, 0)}, s = ${fmt(s0, 0)}`,
        { px: p.x, py: p.y, pz: p.z, ux: a, uy: b, vx: c, vy: d, r: r0, s: s0 },
      );
    }
    const u = v3(a, b, nz(rng, 2));
    const v = v3(c, d, nz(rng, 2));
    const inPlane = rng.next() < 0.5;
    const wz = inPlane ? 0 : rng.sign();
    const x = add3(add3(add3(p, mul3(r0, u)), mul3(s0, v)), v3(0, 0, wz));
    const q = add3(p, u);
    const r3 = add3(p, v);
    return task(
      level,
      "",
      `Die Ebene E geht durch P = ${caseWord(p)}, Q = ${caseWord(q)} und R = ${caseWord(r3)} (Parameterform mit u = Q − P, v = R − P). Ein Punkt X = ${caseWord(x)} wird gemeldet. Bestimme r und s aus den ersten beiden Koordinaten und entscheide: Liegt X wirklich in der Ebene?`,
      [
        numberField("r =", r0, "", 0),
        numberField("s =", s0, "", 0),
        choiceField(
          "Liegt X in der Ebene?",
          ["ja, X liegt in der Ebene", "nein, X liegt nicht in der Ebene"],
          inPlane ? 0 : 1,
        ),
      ],
      "Löse r und s aus x- und y-Koordinate und prüfe danach die z-Koordinate: Passt sie nicht, liegt X außerhalb.",
      [
        `u = ${pv(u, 0)}, v = ${pv(v, 0)}`,
        `Aus x und y folgt r = ${fmt(r0, 0)}, s = ${fmt(s0, 0)}. Probe z: ${fmt(p.z, 0)} + ${paren(r0, 0)} · ${paren(u.z, 0)} + ${paren(s0, 0)} · ${paren(v.z, 0)} = ${fmt(p.z + r0 * u.z + s0 * v.z, 0)} (X hat z = ${fmt(x.z, 0)})`,
      ],
      inPlane
        ? `r = ${fmt(r0, 0)}, s = ${fmt(s0, 0)} und die Probe stimmt: X liegt in der Ebene.`
        : `r = ${fmt(r0, 0)}, s = ${fmt(s0, 0)}, aber die z-Probe stimmt nicht: X liegt nicht in der Ebene.`,
      {
        px: p.x,
        py: p.y,
        pz: p.z,
        ux: u.x,
        uy: u.y,
        uz: u.z,
        vx: v.x,
        vy: v.y,
        vz: v.z,
        r: r0,
        s: s0,
        wz,
        inPlane: inPlane ? 1 : 0,
      },
    );
  },
};

const l3 = makeLesson(3, 3, {
  id: "rg-3-ebene-parameterform",
  title: "3.3 Ebenen in Parameterform",
  subtitle: "Ein Punkt, zwei Richtungen, zwei Parameter",
  whyItMatters:
    "Ebenen tauchen überall auf, wo Flächen im Raum eine Rolle spielen: Wände, Dächer, Spiegel, Grenzflächen. Die Parameterform ist der Einstieg, weil sie aus Punkten und Vektoren direkt entsteht – und weil sie die Basis für alle anderen Ebenengleichungen ist.",
  explanationHtml: `
    <p>Eine <strong>Ebene im Raum</strong> beschreibst du mit einem Punkt und zwei Richtungen: einem <strong>Stützpunkt</strong> P und zwei <strong>Spannvektoren</strong> ${vn("u")} und ${vn("v")}, die nicht kollinear sind. Die <strong>Parameterform</strong> lautet:</p>
    <p class="formula-line">E: X = P + r · ${vn("u")} + s · ${vn("v")}, r, s ∈ ℝ</p>
    <ul>
      <li><strong>Ortsvektor:</strong> P ist ein Punkt der Ebene (für r = s = 0).</li>
      <li><strong>Spannvektoren:</strong> ${vn("u")} und ${vn("v")} dürfen nicht kollinear sein – sonst entsteht nur eine Gerade. Sie spannen das Spannparallelogramm auf.</li>
      <li><strong>Parameter r, s:</strong> Jedes Zahlenpaar (r | s) liefert einen Punkt der Ebene; umgekehrt hat jeder Punkt der Ebene ein solches Paar.</li>
      <li><strong>Ebene durch drei Punkte:</strong> Aus P, Q, R bildest du ${vn("u")} = Q − P und ${vn("v")} = R − P und setzt beides in die Parameterform ein.</li>
      <li><strong>Punktprobe:</strong> X liegt genau dann in E, wenn es r und s mit X = P + r · ${vn("u")} + s · ${vn("v")} gibt; am schnellsten löst du das Gleichungssystem zweier Koordinaten und prüfst die dritte.</li>
    </ul>
    <div class="example">Beispiel: P = (1 | 0 | 0), ${vn("u")} = (1 | 2 | 1), ${vn("v")} = (1 | 1 | −1). Dann ist X(1 | 1) = (1 | 0 | 0) + 1 · (1 | 2 | 1) + 1 · (1 | 1 | −1) = (3 | 3 | 0). Für die drei Punkte P, Q = (2 | 2 | 1), R = (2 | 1 | −1) ist u = Q − P = (1 | 2 | 1) und v = R − P = (1 | 1 | −1).</div>
    <div class="merke"><strong>Merke:</strong> E: X = P + r · ${vn("u")} + s · ${vn("v")} – ein Punkt, zwei nicht kollineare Richtungen. Sind ${vn("u")} und ${vn("v")} Vielfache voneinander, beschreibt die Gleichung nur eine Gerade.</div>
  `,
  formulas: [
    {
      name: "Parameterform der Ebene",
      html: `E: X = P + r · ${vn("u")} + s · ${vn("v")}, r, s ∈ ℝ`,
      quantities: "P Stützpunkt, u und v Spannvektoren (nicht kollinear), r und s Parameter",
    },
    {
      name: "Ebene durch drei Punkte",
      html: `${vn("u")} = Q − P, ${vn("v")} = R − P`,
      quantities: "zwei Verbindungsvektoren als Spannvektoren",
    },
    {
      name: "Punktprobe",
      html: `X ∈ E ⇔ X = P + r · ${vn("u")} + s · ${vn("v")} für passende r, s`,
      quantities: "Gleichungssystem lösen und die übrige Koordinate prüfen",
    },
  ],
  quiz: {
    question: "Was passiert, wenn die Spannvektoren u und v einer Ebenengleichung kollinear sind?",
    options: [
      "Die Gleichung beschreibt nur eine Gerade, keine Ebene.",
      "Die Gleichung beschreibt zwei parallele Ebenen.",
      "Die Gleichung beschreibt weiterhin eine Ebene.",
    ],
    correctIndex: 0,
    explanation:
      "Kollineare Spannvektoren laufen in dieselbe Richtung: Alle Punkte P + r·u + s·v bleiben auf einer Geraden. Für eine echte Ebene muss u × v ein von 0 verschiedener Vektor sein.",
  },
  lab: lab(
    "ebene-parameter",
    "Ebene in Parameterform",
    "P ist der Stützpunkt (orange), u und v spannen die Ebene auf. Ziehe X(r | s) im Spannparallelogramm – die Parameter r und s ändern sich dabei.",
    [
      range("px", "x von P", -3, 3, 1),
      range("py", "y von P", -3, 3, 0),
      range("pz", "z von P", -3, 3, 0),
      range("ux", "x von u", -2, 2, 1),
      range("uy", "y von u", -2, 2, 1),
      range("uz", "z von u", -2, 2, 0),
      range("vx", "x von v", -2, 2, 1),
      range("vy", "y von v", -2, 2, 0),
      range("vz", "z von v", -2, 2, 1),
      range("r", "Parameter r", -2, 2, 1),
      range("s", "Parameter s", -2, 2, 1),
    ],
    [
      output(
        "gleichung",
        "Gleichung",
        (v) => `E: X = ${p3(v.px, v.py, v.pz)} + r · ${p3(v.ux, v.uy, v.uz)} + s · ${p3(v.vx, v.vy, v.vz)}`,
      ),
      output(
        "xrs",
        "Punkt X(r | s)",
        (v) =>
          `X(${fmt(v.r)} | ${fmt(v.s)}) = ${p3(v.px + v.r * v.ux + v.s * v.vx, v.py + v.r * v.uy + v.s * v.vy, v.pz + v.r * v.uz + v.s * v.vz)}`,
      ),
      output(
        "normale",
        "Normalenvektor n = u × v",
        (v) =>
          pv(v3(v.uy * v.vz - v.uz * v.vy, v.uz * v.vx - v.ux * v.vz, v.ux * v.vy - v.uy * v.vx)),
      ),
      output(
        "nlaenge",
        "Länge |n|",
        (v) =>
          Math.hypot(v.uy * v.vz - v.uz * v.vy, v.uz * v.vx - v.ux * v.vz, v.ux * v.vy - v.uy * v.vx),
        "",
        2,
      ),
    ],
    [
      {
        id: "ebene-durch-ursprung",
        text: "Lege die Ebene durch den Ursprung: P = (0 | 0 | 0).",
        check: (v) => v.px === 0 && v.py === 0 && v.pz === 0,
      },
      {
        id: "x-drei-vier-null",
        text: "Stelle r = 1 und s = 1 ein, sodass X(r | s) = (3 | 4 | 0) wird.",
        check: (v) =>
          v.r === 1 &&
          v.s === 1 &&
          v.px + v.ux + v.vx === 3 &&
          v.py + v.uy + v.vy === 4 &&
          v.pz + v.uz + v.vz === 0,
      },
      {
        id: "senkrecht-z-achse",
        text: "Lege die Ebene senkrecht zur z-Achse: Beide Spannvektoren liegen in der xy-Ebene und sind nicht kollinear.",
        check: (v) => v.uz === 0 && v.vz === 0 && v.ux * v.vy - v.uy * v.vx !== 0,
      },
    ],
  ),
  exercises: [ebeneParameterGen, punktInEbene],
});

// ─── 3.4 Normalenform und Koordinatenform ─────────────────────────────────

const koordinatenform = {
  id: "koordinatenform",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    const perm = rng.pick([
      [1, 2, 2],
      [2, 1, 2],
      [2, 2, 1],
    ] as Array<[number, number, number]>);
    const s = rng.int(1, 2) * rng.sign();
    const k = rng.pick([-2, -1, 1, 2]);
    const n = v3(s * perm[0], s * perm[1], s * perm[2]);
    const d = 6 * k * s;
    const cuts = [d / n.x, d / n.y, d / n.z];
    if (level === 1) {
      return task(
        level,
        `Die Ebene E hat die Koordinatenform ${planeText(n, d, 0)} mit n = ${pv(n, 0)}. Berechne die drei Achsenabschnitte.`,
        "",
        [
          numberField("x-Abschnitt:", cuts[0], "", 0),
          numberField("y-Abschnitt:", cuts[1], "", 0),
          numberField("z-Abschnitt:", cuts[2], "", 0),
        ],
        "Für den x-Abschnitt setzt du y = 0 und z = 0 in die Koordinatenform ein und löst nach x auf (x = d : n₁).",
        [
          `y = 0 und z = 0 eingesetzt: ${fmt(n.x, 0)} · x = ${fmt(d, 0)}, also x = ${fmt(cuts[0], 0)}`,
          `Analog: y = ${fmt(d, 0)} : ${paren(n.y, 0)} = ${fmt(cuts[1], 0)} und z = ${fmt(d, 0)} : ${paren(n.z, 0)} = ${fmt(cuts[2], 0)}`,
        ],
        `Achsenabschnitte: x = ${fmt(cuts[0], 0)}, y = ${fmt(cuts[1], 0)}, z = ${fmt(cuts[2], 0)}`,
        { nx: n.x, ny: n.y, nz: n.z, d, cx: cuts[0], cy: cuts[1], cz: cuts[2] },
      );
    }
    const p = v3(cuts[0], 0, 0);
    const distance = Math.abs(d) / norm3(n);
    return task(
      level,
      "",
      `Eine geneigte Glaswand wird durch E: n ⊙ X = d mit n = ${pv(n, 0)} beschrieben. Der Messpunkt P = ${caseWord(p)} liegt auf der Wand. Bestimme d und den Abstand der Wand zum Ursprung.`,
      [
        numberField("d =", d, "", 0),
        numberField("Abstand zum Ursprung:", distance, "LE", 0),
      ],
      "d bekommst du aus der Punktprobe d = n ⊙ P. Der Abstand zum Ursprung ist |d| : |n|.",
      [
        `Punktprobe: d = n ⊙ P = ${paren(n.x, 0)} · ${paren(p.x, 0)} + ${paren(n.y, 0)} · 0 + ${paren(n.z, 0)} · 0 = ${fmt(d, 0)}`,
        `|n| = ${fmt(norm3(n), 0)}, also Abstand = ${fmt(Math.abs(d), 0)} : ${fmt(norm3(n), 0)} = ${fmt(distance, 0)} LE`,
      ],
      `d = ${fmt(d, 0)} und der Abstand zum Ursprung beträgt ${fmt(distance, 0)} LE.`,
      { nx: n.x, ny: n.y, nz: n.z, d, distance },
    );
  },
};

const besondereLage = {
  id: "besondere-lage",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    const OPTIONS = [
      "E geht durch den Ursprung",
      "E verläuft parallel zur x-Achse",
      "E verläuft parallel zur y-Achse",
      "E verläuft parallel zur z-Achse",
      "E hat eine allgemeine Lage",
    ];
    if (level === 1) {
      const kind = rng.int(0, 2);
      let n: V3;
      let d: number;
      let distance: number;
      let correct: number;
      if (kind === 0) {
        n = smoothNormal(rng).n;
        d = 0;
        distance = 0;
        correct = 0;
      } else if (kind === 1) {
        const zeroAt = rng.int(0, 2);
        n = normalWithZero(rng, zeroAt);
        const k = rng.pick([-3, -2, -1, 1, 2, 3]);
        d = 5 * k;
        distance = Math.abs(k);
        correct = 1 + zeroAt;
      } else {
        const { n: nn, len } = smoothNormal(rng);
        n = nn;
        const k = rng.pick([-2, -1, 1, 2]);
        d = 2 * k * len;
        distance = 2 * Math.abs(k);
        correct = 4;
      }
      return task(
        level,
        `Die Ebene E hat die Koordinatenform ${planeText(n, d, 0)} mit n = ${pv(n, 0)}, d = ${fmt(d, 0)}. Bestimme ihre Lage im Koordinatensystem und ihren Abstand zum Ursprung.`,
        "",
        [
          choiceField("Lage der Ebene", OPTIONS, correct),
          numberField("Abstand zum Ursprung:", distance, "LE", 0),
        ],
        "d = 0 heißt: E geht durch den Ursprung. Eine Komponente von n = 0 heißt: E verläuft parallel zu dieser Achse. Der Abstand ist |d| : |n|.",
        [
          `n = ${pv(n, 0)}, d = ${fmt(d, 0)}`,
          `Abstand = ${fmt(Math.abs(d), 0)} : ${fmt(norm3(n), 0)} = ${fmt(distance, 0)} LE`,
        ],
        `${OPTIONS[correct]} mit dem Abstand ${fmt(distance, 0)} LE.`,
        { nx: n.x, ny: n.y, nz: n.z, d, distance, correct },
      );
    }
    const zeroAt = rng.int(0, 2);
    const n = normalWithZero(rng, zeroAt);
    const k = rng.pick([-3, -2, -1, 1, 2, 3]);
    const d = 5 * k;
    const distance = Math.abs(k);
    const p =
      zeroAt === 0 ? v3(0, d / n.y, 0) : zeroAt === 1 ? v3(d / n.x, 0, 0) : v3(d / n.x, 0, 0);
    return task(
      level,
      "",
      `Eine schiefe Fläche verläuft parallel zu einer Achse des Koordinatensystems und hat den Normalenvektor n = ${pv(n, 0)}. Sie enthält den Punkt P = ${caseWord(p)}. Stelle ihre Koordinatenform auf: Wie groß sind d und der Abstand zum Ursprung, und zu welcher Achse verläuft sie parallel?`,
      [
        numberField("d =", d, "", 0),
        numberField("Abstand zum Ursprung:", distance, "LE", 0),
        choiceField("Die Fläche verläuft parallel zur …", ["x-Achse", "y-Achse", "z-Achse"], zeroAt),
      ],
      "d = n ⊙ P aus der Punktprobe; die Nullstelle in n verrät, zu welcher Achse die Fläche parallel läuft.",
      [
        `d = n ⊙ P = ${fmt(d, 0)}`,
        `In n = ${pv(n, 0)} ist die ${["x", "y", "z"][zeroAt]}-Komponente 0: parallel zur ${["x", "y", "z"][zeroAt]}-Achse. Abstand = ${fmt(Math.abs(d), 0)} : ${fmt(norm3(n), 0)} = ${fmt(distance, 0)} LE`,
      ],
      `d = ${fmt(d, 0)}, Abstand ${fmt(distance, 0)} LE, parallel zur ${["x", "y", "z"][zeroAt]}-Achse.`,
      { nx: n.x, ny: n.y, nz: n.z, d, distance, zeroAt },
    );
  },
};

const l4 = makeLesson(3, 4, {
  id: "rg-4-ebene-koordinatenform",
  title: "3.4 Normalenform und Koordinatenform",
  subtitle: "Der Normalenvektor beschreibt die Ebene",
  whyItMatters:
    "Die Koordinatenform ist die kompakteste Ebenengleichung: Eine Zeile verrät Normalenvektor und Lage. In der Physik stehen Ebenen so als Grenzflächen, in der Technik als schiefe Ebenen – und Abstandsfragen löst du am elegantesten mit der Hesse'schen Normalform.",
  explanationHtml: `
    <p>Zur Ebene E gehört ein <strong>Normalenvektor</strong> ${vn("n")} (ungleich dem Nullvektor), der senkrecht auf ihr steht. Jeder Punkt X der Ebene erfüllt dann die <strong>Normalenform</strong> ${vn("n")} ⊙ (X − P) = 0. Ausmultipliziert entsteht die <strong>Koordinatenform</strong>:</p>
    <p class="formula-line">${vn("n")} ⊙ X = d mit d = ${vn("n")} ⊙ P, also n₁ · x + n₂ · y + n₃ · z = d</p>
    <ul>
      <li><strong>Lesen:</strong> Die Koeffizienten sind die Koordinaten des Normalenvektors, rechts steht d.</li>
      <li><strong>Einsetzen:</strong> d berechnest du mit einem bekannten Punkt der Ebene: d = ${vn("n")} ⊙ P.</li>
      <li><strong>Vielfaches:</strong> ${vn("n")} ⊙ X = d und (2 · ${vn("n")}) ⊙ X = 2d beschreiben dieselbe Ebene – beim Vergleichen also immer mitziehen.</li>
      <li><strong>Besondere Lage:</strong> d = 0: E geht durch den Ursprung. Eine Komponente von ${vn("n")} ist 0: E verläuft parallel zu dieser Achse (z. B. n₃ = 0: parallel zur z-Achse).</li>
      <li><strong>Achsenabschnitte:</strong> x = d : n₁ (für y = z = 0), entsprechend y = d : n₂ und z = d : n₃ – wo eine Komponente 0 ist, gibt es den Abschnitt nicht.</li>
      <li><strong>Abstand zum Ursprung:</strong> Mit dem Einheitsnormalenvektor n₀ = ${vn("n")} : |${vn("n")}| wird d₀ = d : |${vn("n")}| – der Betrag von d₀ ist der Abstand der Ebene zum Ursprung.</li>
    </ul>
    <div class="example">Beispiel: E: 2x + 3y + 6z = 6, also n = (2 | 3 | 6), d = 6. Die Achsenabschnitte: x = 6 : 2 = 3, y = 6 : 3 = 2, z = 6 : 6 = 1. Es ist |n| = ${sqrtHtml("4 + 9 + 36")} = 7, also ist der Abstand zum Ursprung 6 : 7 ≈ ${fmt(6 / 7)} LE. Die Punkte (3 | 0 | 0), (0 | 2 | 0) und (0 | 0 | 1) liegen auf E.</div>
    <div class="merke"><strong>Merke:</strong> ${vn("n")} steht senkrecht auf der Ebene. Ein Vielfaches von ${vn("n")} (und von d) beschreibt dieselbe Ebene. Der Abstand zum Ursprung ist |d| : |${vn("n")}|.</div>
  `,
  formulas: [
    {
      name: "Normalenform",
      html: `${vn("n")} ⊙ (X − P) = 0`,
      quantities: "n Normalenvektor, P ein Punkt der Ebene",
    },
    {
      name: "Koordinatenform",
      html: `${vn("n")} ⊙ X = d, also n₁x + n₂y + n₃z = d`,
      quantities: "d = n ⊙ P; ein Vielfaches von n und d beschreibt dieselbe Ebene",
    },
    {
      name: "Abstand zum Ursprung",
      html: `|d| : |${vn("n")}|`,
      quantities: "mit n₀ = n : |n| als Einheitsnormalenvektor (Hesse'sche Normalform)",
    },
  ],
  quiz: {
    question: "Was bedeutet es, wenn in der Koordinatenform n₁x + n₂y + n₃z = d die dritte Komponente n₃ = 0 ist?",
    options: [
      "Die Ebene verläuft parallel zur z-Achse.",
      "Die Ebene verläuft parallel zur xy-Ebene.",
      "Die Ebene geht durch den Ursprung.",
    ],
    correctIndex: 0,
    explanation:
      "n₃ = 0 heißt: Der Normalenvektor steht senkrecht auf der z-Achse – die Ebene nimmt die z-Richtung auf und verläuft parallel zu ihr. Parallel zur xy-Ebene wäre n = (0 | 0 | c), und d = 0 brächte den Ursprung ins Spiel.",
  },
  lab: lab(
    "ebene-normal",
    "Normalenvektor und Koordinatenform",
    "Der Normalenvektor (blau) steht senkrecht auf der Ebene. Der gestrichelte Strahl zum Ursprung zeigt den Abstand. Die Achsenabschnitte liest du aus der Gleichung ab.",
    [
      range("nx", "x von n", -3, 3, 1),
      range("ny", "y von n", -3, 3, 1),
      range("nz", "z von n", -3, 3, 1),
      range("d", "d", -4, 4, 2),
    ],
    [
      output("koordinatenform", "Koordinatenform", (v) =>
        v.nx === 0 && v.ny === 0 && v.nz === 0
          ? "n = 0: keine Ebene"
          : `E: ${planeText(v3(v.nx, v.ny, v.nz), v.d, 0)}`,
      ),
      output("abschnitte", "Achsenabschnitte", (v) =>
        [0, 1, 2]
          .map((i) => {
            const ni = [v.nx, v.ny, v.nz][i];
            return ni !== 0
              ? `${["x", "y", "z"][i]}: ${fmt(v.d / ni)}`
              : `${["x", "y", "z"][i]}: keine`;
          })
          .join(", "),
      ),
      output("abstand", "Abstand zum Ursprung", (v) => {
        const len = Math.hypot(v.nx, v.ny, v.nz);
        return len > 1e-9 ? `d(O; E) = ${fmt(Math.abs(v.d) / len)}` : "nicht definiert (n = 0)";
      }),
      output("lage", "Lage", (v) => {
        const len = Math.hypot(v.nx, v.ny, v.nz);
        if (len < 1e-9) return "keine Ebene (n = 0)";
        return v.d === 0 ? "E geht durch den Ursprung" : "E verfehlt den Ursprung";
      }),
    ],
    [
      {
        id: "ursprung-n-zwei",
        text: "Stelle n = (0 | 0 | 2) und d = 0 ein: Eine Ebene durch den Ursprung, senkrecht zur z-Achse.",
        check: (v) => v.nx === 0 && v.ny === 0 && v.nz === 2 && v.d === 0,
      },
      {
        id: "x-abschnitt-drei",
        text: "Sorge dafür, dass die Ebene die x-Achse bei x = 3 schneidet (x-Abschnitt 3).",
        check: (v) => v.nx !== 0 && v.d === 3 * v.nx,
      },
      {
        id: "parallel-z-achse",
        text: "Lege eine Ebene parallel zur z-Achse, die nicht durch den Ursprung geht.",
        check: (v) => v.nz === 0 && v.d !== 0 && (v.nx !== 0 || v.ny !== 0),
      },
    ],
  ),
  exercises: [koordinatenform, besondereLage],
});

// ─── 3.5 Die Lage zweier Geraden ──────────────────────────────────────────

const CASE_OPTIONS = ["sich schneidend", "parallel", "windschief"];

const lagerelation = {
  id: "lagerelation",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const kind = rng.int(0, 2);
      if (kind === 0) {
        const s = v3(rng.int(-2, 2), rng.int(-2, 2), rng.int(-2, 2));
        const u = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
        let w = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
        while (norm3(cross3(u, w)) < 1e-9) w = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
        const t0 = rng.pick([-2, -1, 1, 2]);
        const s0 = rng.pick([-2, -1, 1, 2]);
        const a = sub3(s, mul3(t0, u));
        const b = sub3(s, mul3(s0, w));
        return task(
          level,
          `Gegeben sind g: X = ${pv(a, 0)} + t · ${pv(u, 0)} und h: X = ${pv(b, 0)} + s · ${pv(w, 0)}. Bestimme den Fall der Lage und – falls vorhanden – die Koordinaten des Schnittpunkts.`,
          "",
          [
            numberField("S: x =", s.x, "", 0),
            numberField("y =", s.y, "", 0),
            numberField("z =", s.z, "", 0),
            choiceField("Lage von g und h", CASE_OPTIONS, 0),
          ],
          "Löse A + t · u = B + s · w. Gibt es eine Lösung, schneiden sich die Geraden; die Lösung ist der Schnittpunkt.",
          [
            `Gleichungssystem: ${pv(a, 0)} + t · ${pv(u, 0)} = ${pv(b, 0)} + s · ${pv(w, 0)}`,
            `Gelöst: t = ${fmt(t0, 0)}, s = ${fmt(s0, 0)}, also S = ${caseWord(s)}`,
          ],
          `S = ${caseWord(s)}: g und h schneiden sich.`,
          {
            kind,
            ax: a.x,
            ay: a.y,
            az: a.z,
            ux: u.x,
            uy: u.y,
            uz: u.z,
            bx: b.x,
            by: b.y,
            bz: b.z,
            wx: w.x,
            wy: w.y,
            wz: w.z,
          },
        );
      }
      const axis = rng.int(0, 2);
      const k = rng.int(1, 3);
      const lam = rng.pick([-2, -1, 2, 3]);
      const u = mul3(k, axisVec(axis));
      const w = mul3(lam, u);
      const [pq, qr] = rng.pick(PYTH);
      const others = [0, 1, 2].filter((i) => i !== axis);
      const arr = [0, 0, 0];
      arr[axis] = rng.int(-3, 3);
      arr[others[0]] = pq * rng.sign();
      arr[others[1]] = qr * rng.sign();
      const off = v3(arr[0], arr[1], arr[2]);
      const a = v3(rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3));
      const b = add3(a, off);
      const distance = Math.hypot(pq, qr);
      return task(
        level,
        `Gegeben sind g: X = ${pv(a, 0)} + t · ${pv(u, 0)} und h: X = ${pv(b, 0)} + s · ${pv(w, 0)}. Bestimme den Fall der Lage und – falls vorhanden – den Abstand der beiden Geraden.`,
        "",
        [
          choiceField("Lage von g und h", CASE_OPTIONS, 1),
          numberField("Abstand:", distance, "LE", 0),
        ],
        "Vergleiche die Richtungsvektoren: Sind sie Vielfache voneinander, bleibt nur Parallelität oder Deckung. Der Abstand zweier paralleler Geraden misst sich senkrecht.",
        [
          `${pv(w, 0)} = ${fmt(lam, 0)} · ${pv(u, 0)}: die Richtungen sind parallel`,
          `B − A = ${pv(off, 0)} ist kein Vielfaches von u: die Geraden sind echt parallel, Abstand = ${fmt(distance, 0)} LE`,
        ],
        `g und h sind parallel mit dem Abstand ${fmt(distance, 0)} LE.`,
        {
          kind,
          ax: a.x,
          ay: a.y,
          az: a.z,
          ux: u.x,
          uy: u.y,
          uz: u.z,
          bx: b.x,
          by: b.y,
          bz: b.z,
          wx: w.x,
          wy: w.y,
          wz: w.z,
          distance,
        },
      );
    }
    // Level 2: Parameteraufgabe
    const u = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
    let w = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
    while (Math.abs(u.y * w.z - u.z * w.y) < 1e-9) w = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
    const t0 = rng.pick([-2, -1, 1, 2]);
    const s0 = rng.pick([-2, -1, 1, 2]);
    const a = v3(rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3));
    const s = add3(a, mul3(t0, u));
    const b = sub3(s, mul3(s0, w));
    return task(
      level,
      "",
      `Zwei Wege im Raum folgen g: X = ${pv(a, 0)} + t · ${pv(u, 0)} und h: X = (a | ${fmt(b.y, 0)} | ${fmt(b.z, 0)}) + s · ${pv(w, 0)}. Für welchen Wert von a kreuzen sich die beiden Wege? Bestimme a und den Parameter t des Schnittpunkts auf g.`,
      [numberField("a =", b.x, "", 0), numberField("t =", t0, "", 0)],
      "Gleiche die Koordinaten an: Aus der y- und z-Gleichung folgen t und s, dann liefert die x-Gleichung a.",
      [
        `Gleichungssystem: ${pv(a, 0)} + t · ${pv(u, 0)} = (a | ${fmt(b.y, 0)} | ${fmt(b.z, 0)}) + s · ${pv(w, 0)}`,
        `Aus y und z folgt t = ${fmt(t0, 0)} und s = ${fmt(s0, 0)}; eingesetzt in x: a = ${fmt(b.x, 0)}`,
      ],
      `Bei a = ${fmt(b.x, 0)} schneiden sich die Wege, und zwar für t = ${fmt(t0, 0)}.`,
      {
        ax: a.x,
        ay: a.y,
        az: a.z,
        ux: u.x,
        uy: u.y,
        uz: u.z,
        a: b.x,
        by: b.y,
        bz: b.z,
        wx: w.x,
        wy: w.y,
        wz: w.z,
        t: t0,
        s: s0,
      },
    );
  },
};

const schnittwinkel = {
  id: "schnittwinkel",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    const { u, v, deg } = anglePair(rng);
    const product = dot3(u, v);
    const kindIndex = deg < 90 ? 0 : deg === 90 ? 1 : 2;
    if (level === 1) {
      return task(
        level,
        `Berechne den Winkel φ zwischen den Richtungsvektoren u = ${pv(u, 0)} und v = ${pv(v, 0)} (0° ≤ φ ≤ 180°).`,
        "",
        [
          numberField("φ =", deg, "°", 1),
          choiceField("Der Winkel ist …", [ACUTE, RIGHT, OBTUSE], kindIndex),
        ],
        "cos φ = (u ⊙ v) : (|u| · |v|); der Winkel entsteht mit cos⁻¹ (Taschenrechner auf DEG).",
        [
          `u ⊙ v = ${fmt(product, 0)}, |u| = ${fmt(norm3(u), 2)}, |v| = ${fmt(norm3(v), 2)}`,
          `cos φ = ${fmt(product, 0)} : ${fmt(norm3(u) * norm3(v), 2)} und mit cos⁻¹ ergibt φ = ${fmt(deg, 0)}°`,
        ],
        `φ = ${fmt(deg, 0)}°: ${[ACUTE, RIGHT, OBTUSE][kindIndex]}.`,
        {
          ux: u.x,
          uy: u.y,
          uz: u.z,
          vx: v.x,
          vy: v.y,
          vz: v.z,
          deg,
          product,
        },
      );
    }
    return task(
      level,
      "",
      `Zwei Straßen laufen durch eine Kreuzung. Ihre Richtungsvektoren sind u = ${pv(u, 0)} und v = ${pv(v, 0)} (in 100 m). Unter welchem Winkel laufen die Straßen auseinander, und wie groß ist das Skalarprodukt u ⊙ v?`,
      [
        numberField("φ =", deg, "°", 1),
        numberField("u ⊙ v =", product, "", 0),
      ],
      "Winkel über cos φ = (u ⊙ v) : (|u| · |v|); das Skalarprodukt ist die Summe der Komponentenprodukte.",
      [
        `u ⊙ v = ${paren(u.x, 0)} · ${paren(v.x, 0)} + ${paren(u.y, 0)} · ${paren(v.y, 0)} + ${paren(u.z, 0)} · ${paren(v.z, 0)} = ${fmt(product, 0)}`,
        `|u| · |v| = ${fmt(norm3(u) * norm3(v), 2)}, also cos φ = ${fmt(product / (norm3(u) * norm3(v)), 2)} und φ = ${fmt(deg, 0)}°`,
      ],
      `Die Straßen laufen unter ${fmt(deg, 0)}° auseinander, u ⊙ v = ${fmt(product, 0)}.`,
      { ux: u.x, uy: u.y, uz: u.z, vx: v.x, vy: v.y, vz: v.z, deg, product },
    );
  },
};

const l5 = makeLesson(3, 5, {
  id: "rg-5-lage-geraden",
  title: "3.5 Die Lage zweier Geraden",
  subtitle: "sich schneidend, parallel oder windschief",
  whyItMatters:
    "Zwei Leitungen, zwei Flugrouten, zwei Kanten: Bevor du rechnest, willst du den Fall wissen. Die Fallunterscheidung schützt vor falschen Schnittpunkten – und im Abitur steckt genau darin der Punktzahl-Gewinn.",
  explanationHtml: `
    <p>Zwei Geraden g: X = A + t · ${vn("u")} und h: X = B + s · ${vn("v")} können sich auf drei Weisen zueinander verhalten. Systematisch prüfst du das Gleichungssystem A + t · ${vn("u")} = B + s · ${vn("v")}:</p>
    <ul>
      <li><strong>Sich schneidend:</strong> ${vn("u")} und ${vn("v")} sind nicht parallel und das System hat eine Lösung – die Geraden treffen sich in genau einem Punkt S.</li>
      <li><strong>Parallel:</strong> ${vn("u")} und ${vn("v")} sind Vielfache voneinander, aber B − A ist kein Vielfaches von ${vn("u")} – kein Schnittpunkt, überall derselbe Abstand.</li>
      <li><strong>Windschief:</strong> ${vn("u")} und ${vn("v")} sind nicht parallel, aber das System hat keine Lösung – die Geraden kreuzen sich im Raum, ohne sich zu berühren.</li>
      <li><strong>Identisch:</strong> Jeder Punkt von g liegt auch auf h (Sonderfall von Parallelität).</li>
    </ul>
    <p>Der <strong>Schnittwinkel</strong> zweier Geraden ist der spitze Winkel zwischen den Richtungsvektoren: cos φ = |${vn("u")} ⊙ ${vn("v")}| : (|${vn("u")}| · |${vn("v")}|). Wenn du den Winkel zwischen den Richtungsvektoren selbst suchst (0° bis 180°), nimmst du das Skalarprodukt ohne Betrag.</p>
    <div class="example">Beispiel: g: X = (0 | 0 | 0) + t · (1 | 0 | 0) und h: X = (0 | 1 | 1) + s · (0 | 1 | 0). Die Richtungen sind nicht parallel. Das Gleichungssystem verlangt in der z-Koordinate 0 = 1 – ein Widerspruch, also windschief. Der Abstand beträgt 1 LE. Die Geraden g′: X = (1 | 1 | 0) + t · (1 | 0 | 0) und h′: X = (0 | 2 | 0) + s · (2 | 0 | 0) sind parallel (die Richtungen sind Vielfache), ihr Abstand beträgt ebenfalls 1 LE.</div>
    <div class="merke"><strong>Merke:</strong> Windschief heißt: im Raum gekreuzt, aber ohne Schnittpunkt. Erst die Richtungen vergleichen, dann das Gleichungssystem lösen.</div>
  `,
  formulas: [
    {
      name: "Schnittpunkt",
      html: `A + t · ${vn("u")} = B + s · ${vn("v")}`,
      quantities: "eindeutig lösbar: die Geraden schneiden sich in einem Punkt",
    },
    {
      name: "Schnittwinkel",
      html: `cos φ = |${vn("u")} ⊙ ${vn("v")}| : (|${vn("u")}| · |${vn("v")}|)`,
      quantities: "φ der spitze Winkel zwischen den Geraden, 0° ≤ φ ≤ 90°",
    },
    {
      name: "Parallelität",
      html: `${vn("u")} ∥ ${vn("v")} ⇔ ${vn("u")} × ${vn("v")} = ${vn("0")}`,
      quantities: "und B − A darf dann kein Vielfaches von u sein (sonst identisch)",
    },
  ],
  quiz: {
    question:
      "Zwei Geraden haben nicht parallele Richtungsvektoren, aber das Gleichungssystem A + t·u = B + s·v hat keine Lösung. Wie liegen sie?",
    options: ["Sie sind windschief.", "Sie sind parallel.", "Sie schneiden sich in einem Punkt."],
    correctIndex: 0,
    explanation:
      "Nicht parallele Richtungen schließen Parallelität aus. Bleibt nur übrig: entweder eine Lösung (Schnittpunkt) oder keine Lösung – dann windschief. Windschiefe Geraden kreuzen sich im Bild, ohne gemeinsame Punkte zu haben.",
  },
  lab: lab(
    "geraden-lage",
    "Zwei Geraden im Raum",
    "Stelle die beiden Geraden g (blau) und h (grün) ein. Der Fall, der Schnittpunkt, der Winkel und der Abstand werden gerechnet – die Zeichnung veranschaulicht nur.",
    [
      range("ax", "x von A", -3, 3, 0),
      range("ay", "y von A", -3, 3, 0),
      range("az", "z von A", -3, 3, 0),
      range("ux", "x von u", -3, 3, 1),
      range("uy", "y von u", -3, 3, 0),
      range("uz", "z von u", -3, 3, 0),
      range("bx", "x von B", -3, 3, 1),
      range("by", "y von B", -3, 3, 1),
      range("bz", "z von B", -3, 3, 0),
      range("vx", "x von v", -3, 3, 0),
      range("vy", "y von v", -3, 3, 1),
      range("vz", "z von v", -3, 3, 0),
    ],
    [
      output("fall", "Fall der Lage", (v) => {
        const fall = lineCase(
          v3(v.ax, v.ay, v.az),
          v3(v.ux, v.uy, v.uz),
          v3(v.bx, v.by, v.bz),
          v3(v.vx, v.vy, v.vz),
        );
        return {
          schnittpunkt: "sich schneidend",
          parallel: "parallel",
          windschief: "windschief",
          identisch: "identisch (dieselbe Gerade)",
          degeneriert: "Nullvektor: keine echte Gerade",
        }[fall];
      }),
      output("schnittpunkt", "Schnittpunkt", (v) => {
        const s = lineIntersection(
          v3(v.ax, v.ay, v.az),
          v3(v.ux, v.uy, v.uz),
          v3(v.bx, v.by, v.bz),
          v3(v.vx, v.vy, v.vz),
        );
        if (s) return `S = ${p3(s.p.x, s.p.y, s.p.z)}`;
        return lineCase(
          v3(v.ax, v.ay, v.az),
          v3(v.ux, v.uy, v.uz),
          v3(v.bx, v.by, v.bz),
          v3(v.vx, v.vy, v.vz),
        ) === "identisch"
          ? "unendlich viele"
          : "kein Schnittpunkt";
      }),
      output("winkel", "Winkel der Richtungen", (v) => {
        const phi = angleBetween3(v3(v.ux, v.uy, v.uz), v3(v.vx, v.vy, v.vz));
        return phi === null ? "nicht definiert (Nullvektor)" : `φ = ${fmt(phi, 1)}°`;
      }),
      output(
        "abstand",
        "Abstand",
        (v) =>
          lineDistance(
            v3(v.ax, v.ay, v.az),
            v3(v.ux, v.uy, v.uz),
            v3(v.bx, v.by, v.bz),
            v3(v.vx, v.vy, v.vz),
          ),
        "LE",
        2,
      ),
    ],
    [
      {
        id: "schnittpunkt-ursprung",
        text: "Stelle sich schneidende Geraden ein, deren Schnittpunkt der Ursprung ist.",
        check: (v) => {
          const s = lineIntersection(
            v3(v.ax, v.ay, v.az),
            v3(v.ux, v.uy, v.uz),
            v3(v.bx, v.by, v.bz),
            v3(v.vx, v.vy, v.vz),
          );
          return s !== null && norm3(s.p) < 1e-9;
        },
      },
      {
        id: "parallele-geraden",
        text: "Stelle zwei parallele Geraden ein (gleiche Richtungslinie, verschiedene Geraden).",
        check: (v) =>
          lineCase(
            v3(v.ax, v.ay, v.az),
            v3(v.ux, v.uy, v.uz),
            v3(v.bx, v.by, v.bz),
            v3(v.vx, v.vy, v.vz),
          ) === "parallel",
      },
      {
        id: "windschief",
        text: "Stelle windschiefe Geraden ein: Sie kreuzen sich im Bild, haben aber keinen gemeinsamen Punkt.",
        check: (v) =>
          lineCase(
            v3(v.ax, v.ay, v.az),
            v3(v.ux, v.uy, v.uz),
            v3(v.bx, v.by, v.bz),
            v3(v.vx, v.vy, v.vz),
          ) === "windschief" &&
          lineDistance(
            v3(v.ax, v.ay, v.az),
            v3(v.ux, v.uy, v.uz),
            v3(v.bx, v.by, v.bz),
            v3(v.vx, v.vy, v.vz),
          ) > 0,
      },
    ],
  ),
  exercises: [lagerelation, schnittwinkel],
});

// ─── 3.6 Gerade und Ebene ─────────────────────────────────────────────────

const GE_CASES = [
  "g schneidet E in genau einem Punkt",
  "g liegt in der Ebene E",
  "g verläuft parallel zu E (kein Schnittpunkt)",
];

const schnittpunktGeradeEbene = {
  id: "schnittpunkt-gerade-ebene",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    const n = v3(nz(rng, 2), nz(rng, 2), nz(rng, 2));
    if (level === 1) {
      let u = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
      while (Math.abs(dot3(n, u)) < 1e-9) u = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
      const a = v3(rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3));
      const t0 = rng.pick([-2, -1, 1, 2]);
      const s = add3(a, mul3(t0, u));
      const d = dot3(n, s);
      return task(
        level,
        `Die Gerade g: X = ${pv(a, 0)} + t · ${pv(u, 0)} schneidet die Ebene E: ${planeText(n, d, 0)}. Berechne den Parameter t des Schnittpunkts und seine Koordinaten.`,
        "",
        [
          numberField("t =", t0, "", 0),
          numberField("S: x =", s.x, "", 0),
          numberField("y =", s.y, "", 0),
          numberField("z =", s.z, "", 0),
        ],
        "Setze X = A + t · u in n · X = d ein: t = (d − n · A) : (n · u).",
        [
          `n · u = ${fmt(dot3(n, u), 0)}, n · A = ${fmt(dot3(n, a), 0)}`,
          `t = (${fmt(d, 0)} − ${paren(dot3(n, a), 0)}) : ${paren(dot3(n, u), 0)} = ${fmt(t0, 0)}; eingesetzt: S = ${caseWord(s)}`,
        ],
        `t = ${fmt(t0, 0)}, der Schnittpunkt ist S = ${caseWord(s)}.`,
        {
          nx: n.x,
          ny: n.y,
          nz: n.z,
          d,
          ax: a.x,
          ay: a.y,
          az: a.z,
          ux: u.x,
          uy: u.y,
          uz: u.z,
          t: t0,
        },
      );
    }
    // Level 2: Fallunterscheidung im Sachkontext
    const kind = rng.int(0, 2);
    const a = v3(rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3));
    if (kind === 0) {
      let u = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
      while (Math.abs(dot3(n, u)) < 1e-9) u = v3(nz(rng, 3), nz(rng, 3), nz(rng, 3));
      const t0 = rng.pick([-2, -1, 1, 2]);
      const s = add3(a, mul3(t0, u));
      const d = dot3(n, s);
      return task(
        level,
        "",
        `Ein Laserstrahl folgt g: X = ${pv(a, 0)} + t · u mit u = ${pv(u, 0)}. Die Glasfläche wird durch E: ${planeText(n, d, 0)} beschrieben. Berechne den Auftreffpunkt und bestimme die Lage von Strahl und Fläche.`,
        [
          numberField("t =", t0, "", 0),
          numberField("S: x =", s.x, "", 0),
          numberField("y =", s.y, "", 0),
          numberField("z =", s.z, "", 0),
          choiceField("Lage von g und E", GE_CASES, 0),
        ],
        "Setze die Geradengleichung in n · X = d ein. Ist n · u ungleich 0, gibt es genau einen Schnittpunkt.",
        [
          `n · u = ${fmt(dot3(n, u), 0)} ≠ 0: eindeutiger Schnittpunkt`,
          `t = (${fmt(d, 0)} − ${paren(dot3(n, a), 0)}) : ${paren(dot3(n, u), 0)} = ${fmt(t0, 0)}, also S = ${caseWord(s)}`,
        ],
        `Der Strahl trifft die Fläche in S = ${caseWord(s)} (t = ${fmt(t0, 0)}).`,
        {
          nx: n.x,
          ny: n.y,
          nz: n.z,
          d,
          ax: a.x,
          ay: a.y,
          az: a.z,
          ux: u.x,
          uy: u.y,
          uz: u.z,
          t: t0,
          kind,
        },
      );
    }
    let u = cross3(n, v3(nz(rng, 2), nz(rng, 2), nz(rng, 2)));
    while (norm3(u) < 1e-9) u = cross3(n, v3(nz(rng, 2), nz(rng, 2), nz(rng, 2)));
    if (kind === 1) {
      const d = dot3(n, a);
      return task(
        level,
        "",
        `Ein Flugzeug fliegt die Strecke g: X = ${pv(a, 0)} + t · u mit u = ${pv(u, 0)}. Die Wolkenschicht wird durch E: ${planeText(n, d, 0)} beschrieben. Das Flugzeug bleibt in der Wolkenschicht – überprüfe das mit den Kontrollzahlen.`,
        [
          choiceField("Lage von g und E", GE_CASES, 1),
          numberField("Kontrollzahl n · u =", 0, "", 0),
        ],
        "Prüfe n · u und die Punktprobe n · A = d. Beide gleichzeitig erfüllt heißt: Die Gerade liegt in der Ebene.",
        [
          `n · u = ${fmt(dot3(n, u), 0)} und n · A = ${fmt(dot3(n, a), 0)} = d`,
          "Beide Bedingungen stimmen: Die Gerade liegt vollständig in der Ebene.",
        ],
        `n · u = 0 und n · A = d: Die Gerade liegt in der Ebene.`,
        {
          nx: n.x,
          ny: n.y,
          nz: n.z,
          d,
          ax: a.x,
          ay: a.y,
          az: a.z,
          ux: u.x,
          uy: u.y,
          uz: u.z,
          kind,
        },
      );
    }
    const offset = rng.int(1, 3) * rng.sign();
    const d = dot3(n, a) + offset;
    return task(
      level,
      "",
      `Eine Straße verläuft als g: X = ${pv(a, 0)} + t · u mit u = ${pv(u, 0)} und bleibt konstant ${fmt(Math.abs(offset), 0)} Einheiten von der Fläche E: ${planeText(n, d, 0)} entfernt (gemessen in Richtung von n). Prüfe die Lage mit den Kontrollzahlen.`,
      [
        choiceField("Lage von g und E", GE_CASES, 2),
        numberField("Kontrollzahl n · A − d =", -offset, "", 0),
      ],
      "Prüfe n · u und die Punktprobe: n · A − d ungleich 0 heißt, der Stützpunkt A liegt nicht in der Ebene.",
      [
        `n · u = ${fmt(dot3(n, u), 0)}: keine eindeutige Lösung für t`,
        `n · A − d = ${fmt(dot3(n, a), 0)} − ${paren(d, 0)} = ${fmt(-offset, 0)} ≠ 0: A liegt nicht in E, also parallel.`,
      ],
        `n · u = 0 und n · A − d = ${fmt(-offset, 0)}: Die Gerade verläuft parallel zur Ebene.`,
      {
        nx: n.x,
        ny: n.y,
        nz: n.z,
        d,
        ax: a.x,
        ay: a.y,
        az: a.z,
        ux: u.x,
        uy: u.y,
        uz: u.z,
        kind,
      },
    );
  },
};

const winkelGeradeEbene = {
  id: "winkel-gerade-ebene",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const { u, v, deg } = anglePair(rng, 90);
      const n = u;
      const line = v;
      const phi = Math.abs(90 - deg);
      const sin = Math.abs(dot3(n, line)) / (norm3(n) * norm3(line));
      return task(
        level,
        `Berechne den Winkel φ zwischen der Geraden g (Richtung u = ${pv(line, 0)}) und der Ebene E mit n = ${pv(n, 0)} (0° ≤ φ ≤ 90°).`,
        "",
        [
          numberField("sin φ =", round(sin, 2), "", 2),
          numberField("φ =", phi, "°", 1),
        ],
        "sin φ = |n · u| : (|n| · |u|); der Winkel zur Ebene ergibt sich mit sin⁻¹ (DEG).",
        [
          `|n · u| = ${fmt(Math.abs(dot3(n, line)), 0)}, |n| · |u| = ${fmt(norm3(n) * norm3(line), 2)}`,
          `sin φ = ${fmt(Math.abs(dot3(n, line)), 0)} : ${fmt(norm3(n) * norm3(line), 2)} = ${fmt(round(sin, 2), 2)}, also φ = ${fmt(phi, 0)}°`,
        ],
        `sin φ = ${fmt(round(sin, 2), 2)} und φ = ${fmt(phi, 0)}°.`,
        {
          nx: n.x,
          ny: n.y,
          nz: n.z,
          ux: line.x,
          uy: line.y,
          uz: line.z,
          deg,
          phi,
        },
      );
    }
    const kind = rng.int(0, 2);
    let n: V3;
    let u: V3;
    let phi: number;
    if (kind === 0) {
      n = smoothNormal(rng).n;
      u = cross3(n, v3(nz(rng, 2), nz(rng, 2), nz(rng, 2)));
      while (norm3(u) < 1e-9) u = cross3(n, v3(nz(rng, 2), nz(rng, 2), nz(rng, 2)));
      phi = 0;
    } else if (kind === 1) {
      n = smoothNormal(rng).n;
      u = mul3(rng.int(1, 3) * rng.sign(), n);
      phi = 90;
    } else {
      const pair = anglePair(rng, 90);
      n = pair.u;
      u = pair.v;
      phi = Math.abs(90 - pair.deg);
    }
    const product = dot3(n, u);
    return task(
      level,
      "",
      `Eine Sonnenstrahl g: X = A + t · u mit u = ${pv(u, 0)} trifft auf eine Glasfläche E: n · X = d mit n = ${pv(n, 0)}. Entscheide anhand des Winkels φ, wie der Strahl auf die Fläche trifft, und berechne die Kontrollzahl n · u.`,
      [
        choiceField(
          "Der Strahl trifft die Fläche …",
          [
            "flach: er verläuft parallel zur Fläche oder liegt in ihr",
            "senkrecht: er steht rechtwinklig auf der Fläche",
            "schief: er schneidet die Fläche in einem Winkel zwischen 0° und 90°",
          ],
          kind,
        ),
        numberField("Kontrollzahl n · u =", product, "", 0),
      ],
      "sin φ = |n · u| : (|n| · |u|). Ist n · u = 0, liegt φ bei 0°; ist u ein Vielfaches von n, liegt φ bei 90°.",
      [
        `n · u = ${fmt(product, 0)}`,
        product === 0
          ? "n · u = 0, also sin φ = 0 und φ = 0°: Der Strahl läuft flach."
          : Math.abs(Math.abs(product) - norm3(n) * norm3(u)) < 1e-9
            ? "u ist ein Vielfaches von n, also φ = 90°: Der Strahl steht senkrecht."
            : `sin φ = ${fmt(round(Math.abs(product) / (norm3(n) * norm3(u)), 2), 2)}: Der Strahl schneidet schief.`,
      ],
      product === 0
        ? `n · u = 0: φ = 0°, der Strahl verläuft flach zur Fläche.`
        : Math.abs(Math.abs(product) - norm3(n) * norm3(u)) < 1e-9
          ? `u ∥ n: φ = 90°, der Strahl steht senkrecht auf der Fläche.`
          : `Der Strahl schneidet die Fläche schief (n · u = ${fmt(product, 0)}).`,
      {
        nx: n.x,
        ny: n.y,
        nz: n.z,
        ux: u.x,
        uy: u.y,
        uz: u.z,
        phi,
        kind,
        product,
      },
    );
  },
};

const l6 = makeLesson(3, 6, {
  id: "rg-6-gerade-ebene",
  title: "3.6 Gerade und Ebene",
  subtitle: "Schnittpunkt, Parallelität oder Gerade in der Ebene",
  whyItMatters:
    "Trifft ein Strahl eine Fläche, und wenn ja wo? Solche Fragen kommen in Physik, Messtechnik und Computergrafik ständig vor. Die Fallunterscheidung mit n · u ist das Werkzeug dafür – und der Winkel zur Ebene verrät, wie schief der Aufprall ist.",
  explanationHtml: `
    <p>Du setzt die Geradengleichung in die Ebenengleichung ein: n · (A + t · u) = d. Das ergibt eine Gleichung für t:</p>
    <p class="formula-line">t = (d − n · A) : (n · u), falls n · u nicht 0 ist</p>
    <ul>
      <li><strong>Schnittpunkt:</strong> n · u ≠ 0 – es gibt genau ein t und damit einen Schnittpunkt S = A + t · u.</li>
      <li><strong>Gerade in der Ebene:</strong> n · u = 0 und n · A = d – jeder Punkt der Geraden liegt in E.</li>
      <li><strong>Parallel:</strong> n · u = 0 und n · A ≠ d – kein gemeinsamer Punkt.</li>
      <li><strong>Winkel:</strong> Der Winkel φ zwischen Gerade und Ebene folgt aus sin φ = |n · u| : (|n| · |u|) – gemessen wird zur Ebene, nicht zur Normale.</li>
    </ul>
    <div class="example">Beispiel: E: x + 2y + 2z = 9, also n = (1 | 2 | 2); g: X = (1 | 1 | 1) + t · (1 | 0 | 0). Dann ist n · u = 1 ≠ 0, also gibt es einen Schnittpunkt: t = (9 − 5) : 1 = 4, S = (5 | 1 | 1). Der Winkel: sin φ = 1 : (3 · 1) = ${fmt(1 / 3)}, also φ ≈ ${fmt((Math.asin(1 / 3) * 180) / Math.PI, 1)}°.</div>
    <div class="merke"><strong>Merke:</strong> n · u ≠ 0 heißt Schnittpunkt. Bei n · u = 0 bleibt nur Parallelität oder Gerade in der Ebene – der Unterschied steht in der Punktprobe n · A = d.</div>
  `,
  formulas: [
    {
      name: "Schnittpunkt Gerade–Ebene",
      html: `t = (d − n · A) : (n · u), S = A + t · u`,
      quantities: "für n · u ≠ 0; n Normalenvektor der Ebene",
    },
    {
      name: "Winkel Gerade–Ebene",
      html: `sin φ = |n · u| : (|n| · |u|)`,
      quantities: "φ zwischen 0° und 90°; 0°: parallel oder in der Ebene, 90°: senkrecht",
    },
    {
      name: "Fallunterscheidung",
      html: `n · u = 0 und n · A = d: g in E; n · u = 0 und n · A ≠ d: parallel`,
      quantities: "Punktprobe über den Stützpunkt A",
    },
  ],
  quiz: {
    question: "Für eine Gerade g: X = A + t·u und eine Ebene E: n·X = d gilt n·u = 0. Was folgt daraus?",
    options: [
      "Die Gerade verläuft parallel zur Ebene oder liegt in ihr.",
      "Die Gerade schneidet die Ebene in genau einem Punkt.",
      "Die Gerade steht senkrecht auf der Ebene.",
    ],
    correctIndex: 0,
    explanation:
      "n · u = 0 heißt: u steht senkrecht auf der Normale, die Gerade läuft also in der Ebene „mit“. Ob sie in der Ebene liegt oder parallel daneben, entscheidet die Punktprobe n · A = d. Senkrecht wäre u ein Vielfaches von n.",
  },
  lab: lab(
    "gerade-ebene",
    "Gerade und Ebene",
    "Die Gerade (blau) trifft die Ebene oder läuft an ihr vorbei. Der Schnittpunkt und der Winkel φ werden gerechnet – der Normalenvektor misst den Winkel zur Ebene.",
    [
      range("nx", "x von n", -3, 3, 0),
      range("ny", "y von n", -3, 3, 0),
      range("nz", "z von n", -3, 3, 1),
      range("d", "d", -4, 4, 0),
      range("ax", "x von A", -3, 3, 1),
      range("ay", "y von A", -3, 3, 1),
      range("az", "z von A", -3, 3, 1),
      range("ux", "x von u", -3, 3, 1),
      range("uy", "y von u", -3, 3, 0),
      range("uz", "z von u", -3, 3, 1),
    ],
    [
      output("fall", "Fall", (v) => {
        const fall = linePlaneCase(
          v3(v.nx, v.ny, v.nz),
          v.d,
          v3(v.ax, v.ay, v.az),
          v3(v.ux, v.uy, v.uz),
        );
        return {
          schnittpunkt: "eindeutiger Schnittpunkt",
          "in-der-ebene": "die Gerade liegt in der Ebene",
          parallel: "parallel zur Ebene (kein Schnittpunkt)",
          degeneriert: "Nullvektor: keine echte Gerade oder Ebene",
        }[fall];
      }),
      output("t", "Parameter t", (v) => {
        const t = linePlaneT(v3(v.nx, v.ny, v.nz), v.d, v3(v.ax, v.ay, v.az), v3(v.ux, v.uy, v.uz));
        return t === null ? "kein Schnittpunkt" : `t = ${fmt(t)}`;
      }),
      output("schnittpunkt", "Schnittpunkt", (v) => {
        const t = linePlaneT(v3(v.nx, v.ny, v.nz), v.d, v3(v.ax, v.ay, v.az), v3(v.ux, v.uy, v.uz));
        if (t === null) return "kein Schnittpunkt";
        return `S = ${p3(v.ax + t * v.ux, v.ay + t * v.uy, v.az + t * v.uz)}`;
      }),
      output("winkel", "Winkel φ", (v) => {
        const phi = linePlaneAngle(v3(v.nx, v.ny, v.nz), v3(v.ux, v.uy, v.uz));
        return phi === null ? "nicht definiert (Nullvektor)" : `φ = ${fmt(phi, 1)}°`;
      }),
    ],
    [
      {
        id: "schnitt-t-eins",
        text: "Stelle einen Schnittpunkt mit t = 1 ein.",
        check: (v) => {
          const t = linePlaneT(v3(v.nx, v.ny, v.nz), v.d, v3(v.ax, v.ay, v.az), v3(v.ux, v.uy, v.uz));
          return t !== null && Math.abs(t - 1) < 1e-9;
        },
      },
      {
        id: "gerade-in-ebene",
        text: "Lege die Gerade komplett in die Ebene hinein.",
        check: (v) =>
          linePlaneCase(v3(v.nx, v.ny, v.nz), v.d, v3(v.ax, v.ay, v.az), v3(v.ux, v.uy, v.uz)) ===
          "in-der-ebene",
      },
      {
        id: "parallel-zur-ebene",
        text: "Stelle eine Gerade, die parallel zur Ebene verläuft und nicht in ihr liegt.",
        check: (v) =>
          linePlaneCase(v3(v.nx, v.ny, v.nz), v.d, v3(v.ax, v.ay, v.az), v3(v.ux, v.uy, v.uz)) ===
          "parallel",
      },
    ],
  ),
  exercises: [schnittpunktGeradeEbene, winkelGeradeEbene],
});

// ─── 3.7 Die Lage zweier Ebenen ───────────────────────────────────────────

const EB_CASES = ["Schnittgerade", "parallel", "identisch"];

const ebenenLageGen = {
  id: "ebenen-lage",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const kind = rng.int(0, 2);
      if (kind === 0) {
        const { u: n1, v: n2, deg } = anglePair(rng);
        const d1 = rng.int(-4, 4);
        const d2 = rng.int(-4, 4);
        return task(
          level,
          `Gegeben sind E₁: ${planeText(n1, d1, 0)} und E₂: ${planeText(n2, d2, 0)}. Bestimme den Fall der Lage und den Winkel φ zwischen den Normalenvektoren.`,
          "",
          [
            choiceField("Lage von E₁ und E₂", EB_CASES, 0),
            numberField("φ =", deg, "°", 1),
          ],
          "Vergleiche die Normalenvektoren: Nicht parallel heißt Schnittgerade. Der Winkel der Ebenen ist der Winkel zwischen n₁ und n₂.",
          [
            `n₁ × n₂ ≠ (0 | 0 | 0): die Normalen sind nicht parallel, es gibt eine Schnittgerade`,
            `cos φ = (n₁ ⊙ n₂) : (|n₁| · |n₂|) liefert φ = ${fmt(deg, 0)}°`,
          ],
          `E₁ und E₂ schneiden sich in einer Geraden, der Winkel zwischen den Normalen beträgt ${fmt(deg, 0)}°.`,
          {
            n1x: n1.x,
            n1y: n1.y,
            n1z: n1.z,
            d1,
            n2x: n2.x,
            n2y: n2.y,
            n2z: n2.z,
            d2,
            deg,
            kind,
          },
        );
      }
      const { n, len } = smoothNormal(rng);
      const lam = rng.pick([-3, -2, -1, 1, 2, 3]);
      const n2 = mul3(lam, n);
      const d1 = rng.int(-3, 3);
      const k = rng.pick([-3, -2, -1, 1, 2, 3]);
      if (kind === 1) {
        const d2 = lam * (d1 + k * len);
        return task(
          level,
          `Gegeben sind E₁: ${planeText(n, d1, 0)} und E₂: ${planeText(n2, d2, 0)}. Bestimme den Fall der Lage und – falls vorhanden – den Abstand der beiden Ebenen.`,
          "",
          [
            choiceField("Lage von E₁ und E₂", EB_CASES, 1),
            numberField("Abstand:", Math.abs(k), "LE", 0),
          ],
          "Sind die Normalen Vielfache voneinander, bleibt Parallelität oder Deckung. Der Abstand paralleler Ebenen misst sich senkrecht: |d₂ : λ − d₁| : |n₁|.",
          [
            `n₂ = ${fmt(lam, 0)} · n₁: die Normalen sind parallel`,
            `d₂ : λ = ${fmt(d1 + k * len, 0)} ≠ d₁ = ${fmt(d1, 0)}: verschiedene Ebenen, Abstand = ${fmt(Math.abs(k), 0)} LE`,
          ],
          `E₁ und E₂ sind parallel mit dem Abstand ${fmt(Math.abs(k), 0)} LE.`,
          {
            n1x: n.x,
            n1y: n.y,
            n1z: n.z,
            d1,
            n2x: n2.x,
            n2y: n2.y,
            n2z: n2.z,
            d2,
            lam,
            distance: Math.abs(k),
            kind,
          },
        );
      }
      const d2 = lam * d1;
      return task(
        level,
        `Gegeben sind E₁: ${planeText(n, d1, 0)} und E₂: ${planeText(n2, d2, 0)}. Bestimme den Fall der Lage und den Faktor λ mit n₂ = λ · n₁.`,
        "",
        [
          choiceField("Lage von E₁ und E₂", EB_CASES, 2),
          numberField("λ =", lam, "", 0),
        ],
        "Sind die Normalen Vielfache und die d-Werte im selben Verhältnis, decken sich die Ebenen.",
        [
          `n₂ = ${fmt(lam, 0)} · n₁ und d₂ = ${fmt(lam, 0)} · d₁`,
          "Beide Gleichungen beschreiben dieselbe Punktmenge: Die Ebenen sind identisch.",
        ],
        `E₁ und E₂ sind identisch, λ = ${fmt(lam, 0)}.`,
        {
          n1x: n.x,
          n1y: n.y,
          n1z: n.z,
          d1,
          n2x: n2.x,
          n2y: n2.y,
          n2z: n2.z,
          d2,
          lam,
          kind,
        },
      );
    }
    // Level 2: Umkehrung mit Parameter
    const n1 = v3(nz(rng, 2), nz(rng, 2), nz(rng, 2));
    const lam = rng.pick([-3, -2, -1, 1, 2, 3]);
    const n2 = mul3(lam, n1);
    const slot = rng.int(0, 2);
    const comps: Array<string> = [fmt(n2.x, 0), fmt(n2.y, 0), fmt(n2.z, 0)];
    const answer = [n2.x, n2.y, n2.z][slot];
    comps[slot] = "a";
    const d1 = rng.int(-3, 3);
    const identical = rng.next() < 0.5;
    const d2 = identical ? lam * d1 : lam * d1 + rng.int(1, 3) * rng.sign();
    return task(
      level,
      "",
      `Die Ebenen E₁: ${planeText(n1, d1, 0)} und E₂ mit n₂ = (${comps[0]} | ${comps[1]} | ${comps[2]}) und d₂ = ${fmt(d2, 0)} sollen parallel sein. Bestimme den Parameter a und entscheide, ob die Ebenen sich decken.`,
      [
        numberField("a =", answer, "", 0),
        choiceField(
          "Bei diesem a sind die Ebenen …",
          ["identisch (dieselbe Ebene)", "parallel, aber verschieden"],
          identical ? 0 : 1,
        ),
      ],
      "Parallel heißt: n₂ = λ · n₁ für ein λ, und die d-Werte müssen im selben Verhältnis stehen, damit die Ebenen sich decken.",
      [
        `n₂ muss ein Vielfaches von n₁ = ${pv(n1, 0)} sein: n₂ = ${fmt(lam, 0)} · n₁ = ${pv(n2, 0)}, also a = ${fmt(answer, 0)}`,
        identical
          ? `d₂ = ${fmt(d2, 0)} = ${fmt(lam, 0)} · ${fmt(d1, 0)}: die Ebenen sind identisch.`
          : `d₂ = ${fmt(d2, 0)} ≠ ${fmt(lam, 0)} · ${fmt(d1, 0)}: die Ebenen sind echt parallel.`,
      ],
      `a = ${fmt(answer, 0)}; die Ebenen sind ${identical ? "identisch" : "parallel, aber verschieden"}.`,
      {
        n1x: n1.x,
        n1y: n1.y,
        n1z: n1.z,
        d1,
        n2x: n2.x,
        n2y: n2.y,
        n2z: n2.z,
        d2,
        lam,
        slot,
        identical: identical ? 1 : 0,
      },
    );
  },
};

const schnittgeradeGen = {
  id: "schnittgerade",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    const n1 = v3(nz(rng, 2), nz(rng, 2), nz(rng, 2));
    if (level === 1) {
      let n2 = v3(nz(rng, 2), nz(rng, 2), nz(rng, 2));
      while (Math.abs(n1.x * n2.y - n1.y * n2.x) < 1e-9) {
        n2 = v3(nz(rng, 2), nz(rng, 2), nz(rng, 2));
      }
      const s = v3(rng.int(-2, 2), rng.int(-2, 2), 0);
      const d1 = dot3(n1, s);
      const d2 = dot3(n2, s);
      const u = cross3(n1, n2);
      return task(
        level,
        `Die Ebenen E₁: ${planeText(n1, d1, 0)} und E₂: ${planeText(n2, d2, 0)} schneiden sich in einer Geraden. Bestimme die Richtung u = n₁ × n₂ der Schnittgerade und einen Punkt S mit z = 0.`,
        "",
        [
          numberField("u: x =", u.x, "", 0),
          numberField("y =", u.y, "", 0),
          numberField("z =", u.z, "", 0),
          numberField("S: x =", s.x, "", 0),
          numberField("y =", s.y, "", 0),
        ],
        "Für die Richtung berechnest du das Kreuzprodukt n₁ × n₂. Für einen Punkt setzt du z = 0 und löst die beiden Gleichungen nach x und y.",
        [
          `u = n₁ × n₂ = ${pv(u, 0)}`,
          `z = 0 eingesetzt und gelöst: S = (${fmt(s.x, 0)} | ${fmt(s.y, 0)} | 0)`,
        ],
        `Richtung u = ${pv(u, 0)}, ein Punkt der Schnittgeraden ist S = (${fmt(s.x, 0)} | ${fmt(s.y, 0)} | 0).`,
        {
          n1x: n1.x,
          n1y: n1.y,
          n1z: n1.z,
          d1,
          n2x: n2.x,
          n2y: n2.y,
          n2z: n2.z,
          d2,
          sx: s.x,
          sy: s.y,
        },
      );
    }
    // Level 2: Schnittkante zweier Flächen, Punkt zu gegebenem x
    let n2 = v3(nz(rng, 2), nz(rng, 2), nz(rng, 2));
    while (Math.abs(n1.y * n2.z - n1.z * n2.y) < 1e-9) {
      n2 = v3(nz(rng, 2), nz(rng, 2), nz(rng, 2));
    }
    const c = rng.int(-2, 2);
    const y0 = rng.int(-2, 2);
    const z0 = rng.int(-2, 2);
    const s = v3(c, y0, z0);
    const d1 = dot3(n1, s);
    const d2 = dot3(n2, s);
    return task(
      level,
      "",
      `Zwei Wände schneiden sich in einer Kante. Die erste Wand wird durch E₁: ${planeText(n1, d1, 0)} beschrieben, die zweite durch E₂: ${planeText(n2, d2, 0)}. Für x = ${fmt(c, 0)} verläuft die Kante bei welchen y- und z-Werten?`,
      [numberField("y =", y0, "", 0), numberField("z =", z0, "", 0)],
      `Setze x = ${fmt(c, 0)} in beide Gleichungen ein und löse das Gleichungssystem nach y und z auf.`,
      [
        `x = ${fmt(c, 0)} eingesetzt: ${fmt(n1.y, 0)} · y + ${paren(n1.z, 0)} · z = ${fmt(d1 - n1.x * c, 0)} und ${fmt(n2.y, 0)} · y + ${paren(n2.z, 0)} · z = ${fmt(d2 - n2.x * c, 0)}`,
        `Gelöst: y = ${fmt(y0, 0)}, z = ${fmt(z0, 0)}`,
      ],
      `Die Kante verläuft bei x = ${fmt(c, 0)} durch y = ${fmt(y0, 0)} und z = ${fmt(z0, 0)}.`,
      {
        n1x: n1.x,
        n1y: n1.y,
        n1z: n1.z,
        d1,
        n2x: n2.x,
        n2y: n2.y,
        n2z: n2.z,
        d2,
        c,
        y0,
        z0,
      },
    );
  },
};

const l7 = makeLesson(3, 7, {
  id: "rg-7-lage-ebenen",
  title: "3.7 Die Lage zweier Ebenen",
  subtitle: "Schnittgerade, Parallelität oder Deckung",
  whyItMatters:
    "Wo zwei Flächen sich schneiden, entsteht eine Kante – Dächer, Rampen, Spiegelungen. Wer die Schnittgerade berechnen kann, löst Aufgaben zu Körpern, Winkeln und Abständen im Raum.",
  explanationHtml: `
    <p>Zwei Ebenen E₁: ${vn("n₁")} ⊙ X = d₁ und E₂: ${vn("n₂")} ⊙ X = d₂ verhalten sich zueinander über ihre <strong>Normalenvektoren</strong>:</p>
    <ul>
      <li><strong>Schnittgerade:</strong> ${vn("n₁")} und ${vn("n₂")} sind nicht parallel – die Ebenen schneiden sich in einer Geraden mit der Richtung ${vn("u")} = ${vn("n₁")} × ${vn("n₂")}.</li>
      <li><strong>Parallel:</strong> ${vn("n₂")} = λ · ${vn("n₁")}, aber d₂ ≠ λ · d₁ – die Ebenen liegen übereinander, ohne sich zu berühren.</li>
      <li><strong>Identisch:</strong> ${vn("n₂")} = λ · ${vn("n₁")} und d₂ = λ · d₁ – beide Gleichungen beschreiben dieselbe Punktmenge.</li>
    </ul>
    <p>Den <strong>Schnittwinkel zweier Ebenen</strong> misst man am Winkel ihrer Normalenvektoren: cos φ = |${vn("n₁")} ⊙ ${vn("n₂")}| : (|${vn("n₁")}| · |${vn("n₂")}|) liefert den spitzen Ebenenwinkel; der Winkel zwischen den Normalen selbst läuft von 0° bis 180°.</p>
    <p><strong>Schnittgerade berechnen:</strong> Die Richtung ist ${vn("u")} = ${vn("n₁")} × ${vn("n₂")}. Einen Punkt suchst du am einfachsten mit einem Ansatz: z = 0 einsetzen und die beiden Gleichungen nach x und y auflösen (wenn die Gerade nicht parallel zur xy-Ebene liegt).</p>
    <div class="example">Beispiel: E₁: x + y = 2 und E₂: x + z = 2. Die Normalen (1 | 1 | 0) und (1 | 0 | 1) sind nicht parallel, u = n₁ × n₂ = (1 | −1 | −1). Mit z = 0 folgt aus E₁ und E₂: x + y = 2 und x = 2, also y = 0 und S = (2 | 0 | 0). Die Schnittgerade heißt g: X = (2 | 0 | 0) + t · (1 | −1 | −1).</div>
    <div class="merke"><strong>Merke:</strong> Zwei Ebenen schneiden sich fast immer in einer Geraden. Nur parallele Normalen bringen Parallelität oder Deckung – der Unterschied steckt in den d-Werten.</div>
  `,
  formulas: [
    {
      name: "Schnittgeradenrichtung",
      html: `${vn("u")} = ${vn("n₁")} × ${vn("n₂")}`,
      quantities: "Kreuzprodukt der Normalenvektoren, für nicht parallele Normalen",
    },
    {
      name: "Parallelität und Deckung",
      html: `${vn("n₂")} = λ · ${vn("n₁")}; identisch, wenn zusätzlich d₂ = λ · d₁`,
      quantities: "sonst echt parallel mit Abstand |d₂ : λ − d₁| : |n₁⃗|",
    },
    {
      name: "Winkel zweier Ebenen",
      html: `cos φ = |${vn("n₁")} ⊙ ${vn("n₂")}| : (|${vn("n₁")}| · |${vn("n₂")}|)`,
      quantities: "der spitze Winkel zwischen den Ebenen",
    },
  ],
  quiz: {
    question: "Wann schneiden sich zwei Ebenen in einer Geraden?",
    options: [
      "Wenn ihre Normalenvektoren nicht parallel sind.",
      "Wenn ihre Normalenvektoren parallel sind.",
      "Wenn beide Ebenen durch den Ursprung gehen.",
    ],
    correctIndex: 0,
    explanation:
      "Nicht parallele Normalenvektoren spannen eine gemeinsame Richtung auf: die Schnittgerade. Bei parallelen Normalen gibt es nur Deckung oder echte Parallelität.",
  },
  lab: lab(
    "ebenen-lage",
    "Zwei Ebenen",
    "Zwei Ebenen (blau und grün) im Raum. Der Fall, die Richtung der Schnittgerade und der Winkel zwischen den Normalenvektoren werden gerechnet.",
    [
      range("n1x", "x von n₁", -3, 3, 1),
      range("n1y", "y von n₁", -3, 3, 0),
      range("n1z", "z von n₁", -3, 3, 0),
      range("d1", "d₁", -4, 4, 1),
      range("n2x", "x von n₂", -3, 3, 1),
      range("n2y", "y von n₂", -3, 3, 1),
      range("n2z", "z von n₂", -3, 3, 0),
      range("d2", "d₂", -4, 4, 0),
    ],
    [
      output("fall", "Fall", (v) => {
        const fall = planeCase(v3(v.n1x, v.n1y, v.n1z), v.d1, v3(v.n2x, v.n2y, v.n2z), v.d2);
        return {
          schnittgerade: "Schnittgerade",
          parallel: "parallel (verschiedene Ebenen)",
          identisch: "identisch (dieselbe Ebene)",
          degeneriert: "Nullvektor: keine echte Ebene",
        }[fall];
      }),
      output("richtung", "Richtung der Schnittgerade", (v) => {
        const u = cross3(v3(v.n1x, v.n1y, v.n1z), v3(v.n2x, v.n2y, v.n2z));
        return norm3(u) > 1e-9 ? `u = ${pv(u, 0)}` : "keine eindeutige Richtung";
      }),
      output("winkel", "Winkel der Normalen", (v) => {
        const phi = planeAngle(v3(v.n1x, v.n1y, v.n1z), v3(v.n2x, v.n2y, v.n2z));
        return phi === null ? "nicht definiert (Nullvektor)" : `φ = ${fmt(phi, 1)}°`;
      }),
    ],
    [
      {
        id: "schnitt-x-achse",
        text: "Stelle zwei Ebenen ein, deren Schnittgerade parallel zur x-Achse verläuft.",
        check: (v) => {
          const u = cross3(v3(v.n1x, v.n1y, v.n1z), v3(v.n2x, v.n2y, v.n2z));
          return norm3(u) > 1e-9 && u.y === 0 && u.z === 0;
        },
      },
      {
        id: "parallele-ebenen",
        text: "Stelle zwei parallele Ebenen ein, die sich nicht decken.",
        check: (v) =>
          planeCase(v3(v.n1x, v.n1y, v.n1z), v.d1, v3(v.n2x, v.n2y, v.n2z), v.d2) === "parallel",
      },
      {
        id: "senkrechte-ebenen",
        text: "Stelle zwei Ebenen senkrecht zueinander (Winkel 90°).",
        check: (v) => {
          const phi = planeAngle(v3(v.n1x, v.n1y, v.n1z), v3(v.n2x, v.n2y, v.n2z));
          return phi !== null && Math.abs(phi - 90) < 1e-6;
        },
      },
    ],
  ),
  exercises: [ebenenLageGen, schnittgeradeGen],
});

// ─── 3.8 Abstände im Raum ─────────────────────────────────────────────────

const abstandPunktGerade = {
  id: "abstand-punkt-gerade",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    const axis = rng.int(0, 2);
    const k = rng.int(1, 3);
    const u = mul3(k * rng.sign(), axisVec(axis));
    const [pq, qr] = rng.pick(PYTH);
    const others = [0, 1, 2].filter((i) => i !== axis);
    const arr = [0, 0, 0];
    arr[axis] = 0;
    arr[others[0]] = pq * rng.sign();
    arr[others[1]] = qr * rng.sign();
    const w = v3(arr[0], arr[1], arr[2]);
    const t0 = rng.pick([-2, -1, 1, 2, 3]);
    const a = v3(rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3));
    const p = add3(add3(a, mul3(t0, u)), w);
    const distance = Math.hypot(pq, qr);
    if (level === 1) {
      return task(
        level,
        `Berechne den Abstand des Punkts P = ${caseWord(p)} von der Geraden g: X = ${pv(a, 0)} + t · ${pv(u, 0)}. Gib auch den Parameter t des Lotfußpunkts an.`,
        "",
        [
          numberField("Abstand:", distance, "LE", 0),
          numberField("t des Lotfußpunkts:", t0, "", 0),
        ],
        "Der Lotfußpunkt F liegt auf g, PF steht senkrecht auf u. Der Abstand ist die Länge von PF (Pythagoras oder |PF × u| : |u|).",
        [
          `PF = ${pv(w, 0)} steht senkrecht auf u: PF ⊙ u = 0`,
          `|PF| = ${fmt(distance, 0)} LE; der Fußpunkt ist F = A + ${paren(t0, 0)} · u, also t = ${fmt(t0, 0)}`,
        ],
        `Der Abstand beträgt ${fmt(distance, 0)} LE, der Lotfußpunkt liegt bei t = ${fmt(t0, 0)}.`,
        {
          ax: a.x,
          ay: a.y,
          az: a.z,
          ux: u.x,
          uy: u.y,
          uz: u.z,
          px: p.x,
          py: p.y,
          pz: p.z,
          t: t0,
          distance,
        },
      );
    }
    return task(
      level,
      "",
      `Eine Bahnstrecke verläuft geradlinig entlang g: X = ${pv(a, 0)} + t · ${pv(u, 0)} (1 LE = 10 m). Das Haus P = ${caseWord(p)} steht neben der Strecke. Wie weit ist P von der Bahn entfernt (in Metern), und bei welchem t steht der nächste Punkt der Bahn?`,
      [
        numberField("Abstand:", 10 * distance, "m", 0),
        numberField("t des nächstgelegenen Punkts:", t0, "", 0),
      ],
      "Kürzeste Entfernung heißt senkrecht: erst den Lotfußpunkt finden, dann PF ausrechnen und in Meter umrechnen (1 LE = 10 m).",
      [
        `PF = ${pv(w, 0)}, |PF| = ${fmt(distance, 0)} LE`,
        `In Meter: ${fmt(distance, 0)} · 10 = ${fmt(10 * distance, 0)} m; der Fußpunkt liegt bei t = ${fmt(t0, 0)}`,
      ],
      `Das Haus ist ${fmt(10 * distance, 0)} m von der Bahn entfernt, der nächste Punkt liegt bei t = ${fmt(t0, 0)}.`,
      {
        ax: a.x,
        ay: a.y,
        az: a.z,
        ux: u.x,
        uy: u.y,
        uz: u.z,
        px: p.x,
        py: p.y,
        pz: p.z,
        t: t0,
        distance,
      },
    );
  },
};

const abstandPunktEbene = {
  id: "abstand-punkt-ebene",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    const { n, len } = smoothNormal(rng);
    const p = v3(rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3));
    const m = rng.int(1, 4);
    const side = rng.sign();
    const d = dot3(n, p) - side * m * len;
    const distance = m;
    const product = dot3(n, p);
    if (level === 1) {
      return task(
        level,
        `Berechne den Abstand des Punkts P = ${caseWord(p)} von der Ebene E: ${planeText(n, d, 0)} mit Hilfe der Hesse'schen Normalform. Kontrolliere zuerst den Wert von n ⊙ P.`,
        "",
        [
          numberField("Abstand:", distance, "LE", 0),
          numberField("n ⊙ P =", product, "", 0),
        ],
        "Hesse'sche Normalform: Abstand = |n ⊙ P − d| : |n|, mit |n| = √(n₁² + n₂² + n₃²).",
        [
          `n ⊙ P = ${paren(n.x, 0)} · ${paren(p.x, 0)} + ${paren(n.y, 0)} · ${paren(p.y, 0)} + ${paren(n.z, 0)} · ${paren(p.z, 0)} = ${fmt(product, 0)}`,
          `Abstand = |${fmt(product, 0)} − ${paren(d, 0)}| : ${fmt(len, 0)} = ${fmt(distance, 0)} LE`,
        ],
        `n ⊙ P = ${fmt(product, 0)}, der Abstand von P zu E beträgt ${fmt(distance, 0)} LE.`,
        { nx: n.x, ny: n.y, nz: n.z, d, px: p.x, py: p.y, pz: p.z, distance, product },
      );
    }
    return task(
      level,
      "",
      `Eine Fläche E: ${planeText(n, d, 0)} wird parallel verschoben, bis der Abstand zum Punkt P = ${caseWord(p)} genau ${fmt(distance, 0)} LE beträgt. Auf welcher Seite von E liegt P gemessen in Richtung des Normalenvektors, und wie groß ist n ⊙ P?`,
      [
        numberField("n ⊙ P =", product, "", 0),
        choiceField(
          "P liegt …",
          ["in Richtung des Normalenvektors", "entgegengesetzt zum Normalenvektor"],
          side > 0 ? 0 : 1,
        ),
      ],
      "Der Abstand ist |n ⊙ P − d| : |n|; das Vorzeichen von n ⊙ P − d verrät die Seite.",
      [
        `|n ⊙ P − d| = ${fmt(distance * len, 0)} = Abstand · |n|`,
        side > 0
          ? `n ⊙ P − d = ${fmt(product - d, 0)} ist positiv: P liegt in Richtung des Normalenvektors, n ⊙ P = ${fmt(product, 0)}`
          : `n ⊙ P − d = ${fmt(product - d, 0)} ist negativ: P liegt entgegengesetzt, n ⊙ P = ${fmt(product, 0)}`,
      ],
      `n ⊙ P = ${fmt(product, 0)}, P liegt ${side > 0 ? "in Richtung" : "entgegengesetzt"} zum Normalenvektor.`,
      { nx: n.x, ny: n.y, nz: n.z, d, px: p.x, py: p.y, pz: p.z, distance, product, side },
    );
  },
};

const l8 = makeLesson(3, 8, {
  id: "rg-8-abstaende",
  title: "3.8 Abstände im Raum",
  subtitle: "Immer senkrecht gemessen",
  whyItMatters:
    "Abstände sind die häufigste Rechenaufgabe der Raumgeometrie: Wie weit ist ein Punkt von einer Wand, ein Satellit von einer Fläche, eine Straße von einem Haus entfernt? Alle Formeln folgen einem Prinzip: senkrecht messen, mit Vektoren rechnen.",
  explanationHtml: `
    <p>Im Raum misst man Abstände <strong>senkrecht</strong> – als kurzen Verbindungsweg zwischen den Objekten. Die wichtigsten Formeln:</p>
    <ul>
      <li><strong>Punkt–Gerade:</strong> d(P; g) = |${vn("AB")} × ${vn("u")}| : |${vn("u")}| mit A auf g. Alternativ Pythagoras über den Lotfußpunkt.</li>
      <li><strong>Punkt–Ebene (Hesse'sche Normalform):</strong> d(P; E) = |n ⊙ P − d| : |n|. Mit dem Einheitsnormalenvektor n₀ wird daraus |n₀ ⊙ P − d₀| – die linke Seite misst dann direkt den Abstand.</li>
      <li><strong>Parallele Geraden:</strong> Wie Punkt–Gerade: einen Punkt der einen Geraden gegen die andere messen.</li>
      <li><strong>Windschiefe Geraden:</strong> d = |${vn("AB")} ⊙ (${vn("u")} × ${vn("v")})| : |${vn("u")} × ${vn("v")}| – der gemeinsame senkrechte Verbindungsweg.</li>
      <li><strong>Parallele Ebenen:</strong> d = |d₂ : λ − d₁| : |n₁|, wenn n₂ = λ · n₁ ist.</li>
      <li><strong>Gerade–Ebene (parallel):</strong> Wie Punkt–Ebene: einen Punkt der Geraden gegen die Ebene messen.</li>
    </ul>
    <div class="example">Beispiel (Punkt–Ebene): E: 2x + 2y − z = 8, P = (1 | 2 | 3). Dann ist n ⊙ P = 2 + 4 − 3 = 3, |n| = ${sqrtHtml("4 + 4 + 1")} = 3. Der Abstand: |3 − 8| : 3 = 5 : 3 = ${fmt(5 / 3)} LE.<br>Beispiel (windschiefe Geraden): g = x-Achse, h: X = (0 | 1 | 1) + s · (0 | 1 | 0). Dann ist u × v = (0 | 0 | 1) und AB = (0 | 1 | 1): d = |1| : 1 = 1 LE.</div>
    <div class="merke"><strong>Merke:</strong> Jede Abstandsformel misst senkrecht. Die Hesse'sche Normalform macht aus n ⊙ X = d eine Gleichung, deren linke Seite den Abstand zum Ursprung angibt.</div>
  `,
  formulas: [
    {
      name: "Abstand Punkt–Gerade",
      html: `d(P; g) = |${vn("AB")} × ${vn("u")}| : |${vn("u")}|`,
      quantities: "A ein Punkt der Geraden, u ihr Richtungsvektor",
    },
    {
      name: "Abstand Punkt–Ebene (Hesse)",
      html: `d(P; E) = |n ⊙ P − d| : |n|`,
      quantities: "n Normalenvektor, d aus der Koordinatenform",
    },
    {
      name: "Abstand windschiefer Geraden",
      html: `d = |${vn("AB")} ⊙ (${vn("u")} × ${vn("v")})| : |${vn("u")} × ${vn("v")}|`,
      quantities: "AP verbindet Stützpunkte beider Geraden",
    },
    {
      name: "Abstand paralleler Ebenen",
      html: `d = |d₂ : λ − d₁| : |${vn("n₁")}| für n₂ = λ · n₁`,
      quantities: "gemessen senkrecht zu beiden Ebenen",
    },
  ],
  quiz: {
    question: "Wie groß ist der Abstand des Punkts P = (0 | 0 | 5) von der Ebene E: z = 2?",
    options: ["3 LE", "2 LE", "5 LE"],
    correctIndex: 0,
    explanation:
      "E: 0x + 0y + 1z = 2, also n = (0 | 0 | 1), d = 2. Der Abstand ist |n ⊙ P − d| : |n| = |5 − 2| : 1 = 3 LE. Es zählt nur die Entfernung senkrecht zur Ebene, hier entlang der z-Achse.",
  },
  lab: lab(
    "abstand",
    "Abstände im Raum",
    "Wähle die Konstellation und stelle die Daten ein. Der Abstand wird gerechnet (senkrecht gemessen), die Zeichnung zeigt das Lot.",
    [
      choice("mode", "Konstellation", ["Punkt zu Gerade", "Punkt zu Ebene", "Zwei windschiefe Geraden"], 0),
      range("px", "x von P", -4, 4, 2),
      range("py", "y von P", -4, 4, 3),
      range("pz", "z von P", -4, 4, 1),
      range("ay", "y von A bzw. g", -3, 3, 0),
      range("az", "z von A bzw. g", -3, 3, 0),
      range("nx", "x von n", -2, 2, 1),
      range("d", "d", -6, 6, 2),
      range("b", "z von h", -3, 3, 2),
    ],
    [
      output(
        "abstand",
        "Abstand",
        (v) => {
          if (v.mode === 0) return Math.hypot(v.py - v.ay, v.pz - v.az);
          if (v.mode === 1)
            return Math.abs(v.nx * v.px + 2 * v.py + 2 * v.pz - v.d) / Math.sqrt(v.nx * v.nx + 8);
          return Math.abs(v.b);
        },
        "LE",
        2,
      ),
      output("hilfe", "Hilfsgrößen", (v) => {
        if (v.mode === 0) return `Lotfußpunkt F = (${fmt(v.px)} | ${fmt(v.ay)} | ${fmt(v.az)})`;
        if (v.mode === 1)
          return `Zähler |n ⊙ P − d| = ${fmt(Math.abs(v.nx * v.px + 2 * v.py + 2 * v.pz - v.d))}, |n| = ${fmt(Math.sqrt(v.nx * v.nx + 8))}`;
        return `g = x-Achse, h verläuft in y-Richtung bei z = ${fmt(v.b)}`;
      }),
    ],
    [
      {
        id: "abstand-zwei",
        text: "Stelle den Abstand eines Punkts von der Ebene auf genau 2 LE.",
        check: (v) =>
          v.mode === 1 &&
          Math.abs(
            Math.abs(v.nx * v.px + 2 * v.py + 2 * v.pz - v.d) / Math.sqrt(v.nx * v.nx + 8) - 2,
          ) < 1e-9,
      },
      {
        id: "punkt-auf-gerade",
        text: "Lege P auf die Gerade (Abstand 0), aber nicht auf ihren Stützpunkt A.",
        check: (v) => v.mode === 0 && v.py === v.ay && v.pz === v.az && v.px !== 0,
      },
      {
        id: "windschief-eins",
        text: "Stelle windschiefe Geraden mit dem Abstand 1 LE ein.",
        check: (v) => v.mode === 2 && v.b !== 0 && Math.abs(Math.abs(v.b) - 1) < 1e-9,
      },
    ],
  ),
  exercises: [abstandPunktGerade, abstandPunktEbene],
});

// ─── 3.9 Kugeln im Raum ───────────────────────────────────────────────────

const kugelGleichung = {
  id: "kugel-gleichung",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const m = v3(rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4));
      const r = rng.int(2, 6);
      return task(
        level,
        `Die Kugel k hat die Gleichung ${sphereText(m, r, 0)}. Lies den Mittelpunkt M und den Radius r ab.`,
        "",
        [
          numberField("M: x =", m.x, "", 0),
          numberField("y =", m.y, "", 0),
          numberField("z =", m.z, "", 0),
          numberField("r =", r, "", 0),
        ],
        "In (x − m₁)² + (y − m₂)² + (z − m₃)² = r² stehen die Koordinaten von M in den Klammern (mit umgekehrtem Vorzeichen) und r² rechts.",
        [
          `Die Klammern zeigen m₁ = ${fmt(m.x, 0)}, m₂ = ${fmt(m.y, 0)}, m₃ = ${fmt(m.z, 0)} – beachte das Vorzeichen: ${m.x === 0 ? "x" : m.x > 0 ? `(x − ${fmt(m.x, 0)})` : `(x + ${fmt(-m.x, 0)})`} heißt m₁ = ${fmt(m.x, 0)}`,
          `Rechts steht ${fmt(r * r, 0)} = r², also r = ${fmt(r, 0)}`,
        ],
        `M = ${caseWord(m)}, r = ${fmt(r, 0)}`,
        { mx: m.x, my: m.y, mz: m.z, r },
      );
    }
    const m = v3(rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3));
    const [pq, qr] = rng.pick(PYTH);
    const arr = [0, 0, 0];
    const axis = rng.int(0, 2);
    const others = [0, 1, 2].filter((i) => i !== axis);
    arr[others[0]] = pq * rng.sign();
    arr[others[1]] = qr * rng.sign();
    const offset = v3(arr[0], arr[1], arr[2]);
    const p = add3(m, offset);
    const distance = Math.hypot(pq, qr);
    const inRange = rng.next() < 0.5;
    const r = inRange ? distance + rng.int(1, 3) : distance - rng.int(1, 3);
    return task(
      level,
      "",
      `Ein Sendemast steht bei M = ${caseWord(m)} und hat eine Reichweite von r = ${fmt(r, 0)} LE (1 LE = 100 m). Ein Ort P = ${caseWord(p)} wird gemeldet. Wie weit ist P vom Mast entfernt, und liegt P im Empfangsbereich?`,
      [
        numberField("Abstand M–P:", distance, "LE", 0),
        choiceField(
          "Punkt P liegt …",
          ["im Empfangsbereich", "außerhalb des Empfangsbereichs"],
          inRange ? 0 : 1,
        ),
      ],
      "Der Empfangsbereich ist eine Kugel um M mit Radius r. Entscheidend ist der Abstand M–P im Vergleich zu r (Satz des Pythagoras in drei Dimensionen).",
      [
        `MP = ${pv(offset, 0)}, |MP| = ${fmt(distance, 0)} LE`,
        `Vergleich: ${fmt(distance, 0)} ${inRange ? "≤" : ">"} r = ${fmt(r, 0)}`,
      ],
      `P ist ${fmt(distance, 0)} LE vom Mast entfernt und liegt ${inRange ? "im" : "außerhalb des"} Empfangsbereich${inRange ? "" : "s"}.`,
      {
        mx: m.x,
        my: m.y,
        mz: m.z,
        px: p.x,
        py: p.y,
        pz: p.z,
        r,
        distance,
        inRange: inRange ? 1 : 0,
      },
    );
  },
};

const lageKugelEbene = {
  id: "lage-kugel-ebene",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    const { n, len } = smoothNormal(rng);
    const m = v3(rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3));
    const side = rng.sign();
    if (level === 1) {
      const kind = rng.int(0, 2);
      if (kind === 0) {
        const distance = rng.int(1, 4);
        const r = distance;
        const d = dot3(n, m) - side * distance * len;
        return task(
          level,
          `Die Kugel k mit M = ${caseWord(m)} und r = ${fmt(r, 0)} und die Ebene E: ${planeText(n, d, 0)} liegen im Raum. Bestimme die Lage von Kugel und Ebene und den Abstand von M zu E.`,
          "",
          [
            choiceField("Lage von k und E", ["tangent (berührend)", "schneidend", "kein Kontakt"], 0),
            numberField("Abstand M–E:", distance, "LE", 0),
          ],
          "Vergleiche den Abstand d(M; E) = |n · M − d| : |n| mit dem Radius r: gleich groß heißt tangent.",
          [
            `d(M; E) = ${fmt(distance, 0)} LE und r = ${fmt(r, 0)}`,
            "Abstand = Radius: Die Ebene berührt die Kugel in genau einem Punkt.",
          ],
          `d(M; E) = ${fmt(distance, 0)} = r: Die Ebene ist tangent zur Kugel.`,
          {
            nx: n.x,
            ny: n.y,
            nz: n.z,
            d,
            mx: m.x,
            my: m.y,
            mz: m.z,
            r,
            distance,
            kind,
          },
        );
      }
      if (kind === 1) {
        const [a, b, c] = rng.pick([
          [3, 4, 5],
          [4, 3, 5],
          [6, 8, 10],
          [8, 6, 10],
          [5, 12, 13],
          [12, 5, 13],
        ] as Array<[number, number, number]>);
        const d = dot3(n, m) - side * a * len;
        return task(
          level,
          `Die Kugel k mit M = ${caseWord(m)} und r = ${fmt(c, 0)} und die Ebene E: ${planeText(n, d, 0)} liegen im Raum. Bestimme die Lage und den Radius des Schnittkreises.`,
          "",
          [
            choiceField("Lage von k und E", ["tangent (berührend)", "schneidend", "kein Kontakt"], 1),
            numberField("Radius des Schnittkreises:", b, "LE", 0),
          ],
          "Der Abstand d(M; E) bildet mit dem Schnittkreisradius und dem Kugelradius ein rechtwinkliges Dreieck: r² = d² + ρ².",
          [
            `d(M; E) = ${fmt(a, 0)} LE, r = ${fmt(c, 0)}`,
            `ρ = √(r² − d²) = √(${fmt(c * c, 0)} − ${fmt(a * a, 0)}) = ${fmt(b, 0)} LE`,
          ],
          `Die Ebene schneidet die Kugel, der Schnittkreis hat den Radius ${fmt(b, 0)} LE.`,
          {
            nx: n.x,
            ny: n.y,
            nz: n.z,
            d,
            mx: m.x,
            my: m.y,
            mz: m.z,
            r: c,
            distance: a,
            rho: b,
            kind,
          },
        );
      }
      const distance = rng.int(2, 5);
      const r = distance - 1;
      const d = dot3(n, m) - side * distance * len;
      return task(
        level,
        `Die Kugel k mit M = ${caseWord(m)} und r = ${fmt(r, 0)} und die Ebene E: ${planeText(n, d, 0)} liegen im Raum. Bestimme die Lage von Kugel und Ebene und den Abstand von M zu E.`,
        "",
        [
          choiceField("Lage von k und E", ["tangent (berührend)", "schneidend", "kein Kontakt"], 2),
          numberField("Abstand M–E:", distance, "LE", 0),
        ],
        "Vergleiche d(M; E) mit r: größer als r heißt, die Ebene verfehlt die Kugel.",
        [
          `d(M; E) = ${fmt(distance, 0)} LE und r = ${fmt(r, 0)}`,
          `Abstand größer als Radius: kein gemeinsamer Punkt.`,
        ],
        `d(M; E) = ${fmt(distance, 0)} ist größer als r = ${fmt(r, 0)}: kein Kontakt.`,
        {
          nx: n.x,
          ny: n.y,
          nz: n.z,
          d,
          mx: m.x,
          my: m.y,
          mz: m.z,
          r,
          distance,
          kind,
        },
      );
    }
    // Level 2: Umkehrung
    const distance = rng.int(2, 5);
    const d = dot3(n, m) - side * distance * len;
    const delta = rng.pick([-1, 2, 3]);
    const probe = distance + delta;
    return task(
      level,
      "",
      `Eine Kugel mit Mittelpunkt M = ${caseWord(m)} soll die Ebene E: ${planeText(n, d, 0)} genau tangential berühren. Wie groß muss der Radius r sein? Und welche Lage hat die Kugel zu E, wenn stattdessen r = ${fmt(probe, 0)} gilt?`,
      [
        numberField("r für tangentiales Berühren:", distance, "LE", 0),
        choiceField(
          `Bei r = ${fmt(probe, 0)} ist die Lage …`,
          ["tangent (berührend)", "die Ebene schneidet die Kugel", "kein Kontakt"],
          probe < distance ? 2 : 1,
        ),
      ],
      "Tangential heißt Abstand = Radius. Ist r kleiner als der Abstand, gibt es keinen Kontakt; ist r größer, schneidet die Ebene die Kugel.",
      [
        `d(M; E) = ${fmt(distance, 0)} LE`,
        `Für tangiales Berühren gilt r = d(M; E) = ${fmt(distance, 0)}. Bei r = ${fmt(probe, 0)} ist r ${probe < distance ? "kleiner" : "größer"} als der Abstand.`,
      ],
      `r = ${fmt(distance, 0)} LE berührt tangential; bei r = ${fmt(probe, 0)} ${probe < distance ? "gibt es keinen Kontakt" : "schneidet die Ebene die Kugel"}.`,
      {
        nx: n.x,
        ny: n.y,
        nz: n.z,
        d,
        mx: m.x,
        my: m.y,
        mz: m.z,
        distance,
        probe,
      },
    );
  },
};

const l9 = makeLesson(3, 9, {
  id: "rg-9-kugeln",
  title: "3.9 Kugeln im Raum",
  subtitle: "Mittelpunkt, Radius und der Abstand entscheiden",
  whyItMatters:
    "Kugeln modellieren alles, was einen Radius hat: Empfangsbereiche, Planeten, Atome, Ballons. Die Lagefragen zu Ebenen und Geraden löst du immer gleich: Abstand des Mittelpunkts berechnen und mit dem Radius vergleichen.",
  explanationHtml: `
    <p>Eine <strong>Kugel</strong> besteht aus allen Punkten, die vom <strong>Mittelpunkt</strong> M genau den Abstand r (den <strong>Radius</strong>) haben. Ihre <strong>Koordinatenform</strong> lautet:</p>
    <p class="formula-line">k: (x − m₁)² + (y − m₂)² + (z − m₃)² = r²</p>
    <ul>
      <li><strong>Lesen:</strong> In den Klammern stehen die Koordinaten von M (mit umgekehrtem Vorzeichen), rechts das Quadrat des Radius.</li>
      <li><strong>Aufstellen:</strong> Aus M und r direkt einsetzen; umgekehrt hilft die quadratische Ergänzung, um aus einer Gleichung wie x² + y² + z² − 2x + 4y = 12 wieder die Kugel abzulesen.</li>
      <li><strong>Lage Kugel–Ebene:</strong> Den Abstand d(M; E) mit der Hesse'schen Normalform berechnen und mit r vergleichen: d = r tangent, d kleiner als r schneidend (Schnittkreis), d größer als r kein Kontakt.</li>
      <li><strong>Lage Kugel–Gerade:</strong> Genauso mit d(M; g): d = r tangent (ein Punkt), d kleiner als r schneidend – dann hat die Gerade <strong>zwei Schnittpunkte</strong> –, d größer als r kein Kontakt.</li>
      <li><strong>Sehne und Schnittkreis:</strong> Liegt d unter r, ist ρ = ${sqrtHtml("r² − d²")} die halbe Sehne zwischen den Schnittpunkten; bei einer schneidenden Ebene ist zugleich der Radius des Schnittkreises.</li>
    </ul>
    <div class="example">Beispiel: k: (x − 1)² + (y + 2)² + (z − 3)² = 25 hat M = (1 | −2 | 3) und r = 5. Die Ebene E: z = 8 hat den Abstand zu M: |3 − 8| = 5 = r – sie ist tangent. Für E: z = 6 ist d = 3 kleiner als 5: die Ebene schneidet die Kugel, der Schnittkreis hat ρ = ${sqrtHtml("25 − 9")} = 4.</div>
    <div class="merke"><strong>Merke:</strong> Alle Lagenfragen sind Abstandsfragen: d(M; Objekt) gegen r halten. tangent bei Gleichheit, schneidend bei kleinerem Abstand, sonst kein Kontakt.</div>
  `,
  formulas: [
    {
      name: "Kugelgleichung",
      html: `(x − m₁)² + (y − m₂)² + (z − m₃)² = r²`,
      quantities: "M = (m₁ | m₂ | m₃) Mittelpunkt, r Radius",
    },
    {
      name: "Lage Kugel–Ebene",
      html: `d(M; E) = |n · M − d| : |n| vergleichen mit r`,
      quantities: "d = r tangent, d kleiner r schneidend, d größer r kein Kontakt",
    },
    {
      name: "Schnittkreis",
      html: `ρ = ${sqrtHtml("r² − d(M; E)²")}`,
      quantities: "Radius des Schnittkreises bei d(M; E) kleiner r",
    },
  ],
  quiz: {
    question: "Was entscheidet, ob eine Ebene eine Kugel tangiert?",
    options: [
      "Der Abstand des Mittelpunkts zur Ebene ist gleich dem Radius.",
      "Der Radius ist doppelt so lang wie der Abstand.",
      "Die Ebene geht durch den Mittelpunkt.",
    ],
    correctIndex: 0,
    explanation:
      "Berühren heißt: Abstand = Radius. Bei kleinerem Abstand entsteht ein Schnittkreis, bei größerem gibt es keinen Kontakt. Durch den Mittelpunkt geht die Ebene nur bei Abstand 0 – dann ist der Schnittkreis so groß wie die Kugel.",
  },
  lab: lab(
    "kugel",
    "Kugel im Raum",
    "Die Kugel (blau) und eine Ebene oder Gerade. Ob tangent, schneidend oder kein Kontakt, entscheidet der gerechnete Abstand des Mittelpunkts – im Bild siehst du die Veranschaulichung.",
    [
      choice("mode", "Konstellation", ["Kugel und Ebene", "Kugel und Gerade"], 0),
      range("mx", "x von M", -3, 3, 1),
      range("my", "y von M", -3, 3, 1),
      range("mz", "z von M", -3, 3, 1),
      range("r", "Radius r", 1, 5, 2),
      range("nx", "x von n", -2, 2, 0),
      range("ny", "y von n", -2, 2, 0),
      range("nz", "z von n", -2, 2, 1),
      range("d", "d", -5, 5, 4),
      range("ay", "y von g", -3, 3, 0),
      range("az", "z von g", -3, 3, 0),
    ],
    [
      output("gleichung", "Kugelgleichung", (v) => sphereText(v3(v.mx, v.my, v.mz), v.r, 0)),
      output("abstand", "Abstand", (v) => {
        if (v.mode === 0) {
          const len = Math.hypot(v.nx, v.ny, v.nz);
          return len > 1e-9
            ? `d(M; E) = ${fmt(Math.abs(v.nx * v.mx + v.ny * v.my + v.nz * v.mz - v.d) / len)}`
            : "keine Ebene (n = 0)";
        }
        return `d(M; g) = ${fmt(Math.hypot(v.my - v.ay, v.mz - v.az))}`;
      }),
      output("lage", "Lage", (v) => {
        const dist =
          v.mode === 0
            ? Math.hypot(v.nx, v.ny, v.nz) < 1e-9
              ? Infinity
              : Math.abs(v.nx * v.mx + v.ny * v.my + v.nz * v.mz - v.d) / Math.hypot(v.nx, v.ny, v.nz)
            : Math.hypot(v.my - v.ay, v.mz - v.az);
        return dist < v.r - 1e-9
          ? "schneidend"
          : Math.abs(dist - v.r) < 1e-9
            ? "tangent"
            : "kein Kontakt";
      }),
      output("schnitt", "Schnitt", (v) => {
        const dist =
          v.mode === 0
            ? Math.hypot(v.nx, v.ny, v.nz) < 1e-9
              ? Infinity
              : Math.abs(v.nx * v.mx + v.ny * v.my + v.nz * v.mz - v.d) / Math.hypot(v.nx, v.ny, v.nz)
            : Math.hypot(v.my - v.ay, v.mz - v.az);
        if (dist > v.r + 1e-9) return "kein Schnitt";
        if (Math.abs(dist - v.r) < 1e-9) return "tangent, ein Punkt";
        const rho = Math.sqrt(Math.max(0, v.r * v.r - dist * dist));
        return v.mode === 0
          ? `Schnittkreis ρ = ${fmt(rho)}`
          : `zwei Punkte, halbe Sehne ρ = ${fmt(rho)}`;
      }),
    ],
    [
      {
        id: "kugel-ursprung",
        text: "Stelle eine Kugel mit Mittelpunkt im Ursprung und dem Radius 3 ein.",
        check: (v) => v.mx === 0 && v.my === 0 && v.mz === 0 && v.r === 3,
      },
      {
        id: "tangent",
        text: "Lege die Ebene tangential zur Kugel (Abstand = Radius).",
        check: (v) => {
          const len = Math.hypot(v.nx, v.ny, v.nz);
          return (
            v.mode === 0 &&
            len > 1e-9 &&
            Math.abs(Math.abs(v.nx * v.mx + v.ny * v.my + v.nz * v.mz - v.d) / len - v.r) < 1e-9
          );
        },
      },
      {
        id: "schneidend",
        text: "Lege die Ebene so, dass sie die Kugel schneidet (Abstand kleiner als r).",
        check: (v) => {
          const len = Math.hypot(v.nx, v.ny, v.nz);
          return (
            v.mode === 0 &&
            len > 1e-9 &&
            Math.abs(v.nx * v.mx + v.ny * v.my + v.nz * v.mz - v.d) / len < v.r - 1e-9
          );
        },
      },
    ],
  ),
  exercises: [kugelGleichung, lageKugelEbene],
});

export const STAGE_RAUMGEOMETRIE = makeStage(
  3,
  "Geraden, Ebenen, Kugeln, Lagebeziehungen und Abstände im Raum",
  "#059669",
  "📐",
  [l1, l2, l3, l4, l5, l6, l7, l8, l9],
);
