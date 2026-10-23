import { fmt, len, lenText, paren, point } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  add,
  angleText,
  colHtml,
  covers,
  fixedCorner,
  isPointSymmetric,
  landingArm,
  midpoint,
  named,
  neg,
  reachesTarget,
  rotatedTriangle,
  same,
  sub,
  symmetryText,
  T_CORNER,
  T_POINT,
  targetText,
  TRIANGLE,
  turn,
  turns,
  type Vec,
  vec,
  vecHtml,
  vectorLab,
  vectorReadouts,
  vn,
  W_TARGET,
} from "../lab/views-drehung";
import type { ExerciseTask, Lesson, Stage } from "../model/types";
import { choiceField, numberField } from "./helpers";

const STAGE_ID = "stage-2-drehung";
const LP = "M8 LB 2 (I)";

// ─── Helpers of this stage ─────────────────────────────────────────────────

const ORIGIN = vec(0, 0);
const pt = (p: Vec): string => point(p.x, p.y);
const deg = (phi: number): string => `${fmt(phi)}°`;
const dirWord = (phi: number): string => (phi > 0 ? "gegen den Uhrzeigersinn" : "im Uhrzeigersinn");
/** The angle as the rule names it: "+90°", "−90°", "180°". */
const ruleAngle = (phi: number): string => (phi === 90 ? "+90°" : deg(phi));

/** A whole number from ±1 to ±max. */
const nonZero = (rng: Rng, max: number): number => rng.int(1, max) * rng.sign();

/** "4 − (−2)": a difference of two coordinates as it is written down. */
const diff = (b: number, a: number): string => `${fmt(b)} − ${paren(a)}`;

/** A whole-number field for a coordinate. */
const coord = (label: string, answer: number, slips: Array<{ value: number; hint: string } | null> = []) =>
  numberField(label, answer, "", 0, { slips: slips.filter((s): s is { value: number; hint: string } => s !== null) });

type Dir = "rechts" | "links" | "oben" | "unten";

/** Where each grid direction points after the turn by +90°, −90° or 180°. */
const TURNED_DIR: Record<number, Record<Dir, Dir>> = {
  90: { rechts: "oben", oben: "links", links: "unten", unten: "rechts" },
  [-90]: { rechts: "unten", unten: "links", links: "oben", oben: "rechts" },
  180: { rechts: "links", links: "rechts", oben: "unten", unten: "oben" },
};

/** The steps of a vector on the grid: [3, "rechts"], [1, "unten"]. */
function gridSteps(d: Vec): Array<[number, Dir]> {
  const out: Array<[number, Dir]> = [];
  if (d.x !== 0) out.push([Math.abs(d.x), d.x > 0 ? "rechts" : "links"]);
  if (d.y !== 0) out.push([Math.abs(d.y), d.y > 0 ? "oben" : "unten"]);
  return out;
}

/** "3 Kästchen nach rechts und 1 nach unten". */
function moveText(d: Vec): string {
  return gridSteps(d)
    .map(([n, dir], i) => `${n}${i === 0 ? " Kästchen" : ""} nach ${dir}`)
    .join(" und ");
}

/** "aus „3 nach rechts“ wird „3 nach oben“, aus …". */
function turnedText(d: Vec, phi: number): string {
  return gridSteps(d)
    .map(([n, dir]) => `aus „${n} nach ${dir}“ wird „${n} nach ${TURNED_DIR[phi][dir]}“`)
    .join(", ");
}

/** A choice field whose options appear in random order (the app shows task options as given). */
function shuffledChoice(rng: Rng, label: string, options: string[], correct: number) {
  const order = rng.shuffle(options.map((_, i) => i));
  return choiceField(label, order.map((i) => options[i]), order.indexOf(correct));
}

/** The largest absolute coordinate of some points. */
const reach = (...pts: Vec[]): number => Math.max(...pts.map((p) => Math.max(Math.abs(p.x), Math.abs(p.y))));

/** The area of a polygon with sign (shoelace formula): positive when its corners run counter-clockwise. */
function signedArea(pts: Vec[]): number {
  let twice = 0;
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % pts.length];
    twice += p.x * q.y - q.x * p.y;
  });
  return twice / 2;
}

/** The smallest interior angle of a convex polygon, in degrees. */
function smallestAngle(pts: Vec[]): number {
  return Math.min(
    ...pts.map((p, i) => {
      const u = sub(pts[(i + pts.length - 1) % pts.length], p);
      const w = sub(pts[(i + 1) % pts.length], p);
      const cos = (u.x * w.x + u.y * w.y) / (Math.hypot(u.x, u.y) * Math.hypot(w.x, w.y));
      return (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
    }),
  );
}

/** The smallest angle a generated figure may have: no nearly flat triangles or parallelograms. */
const MIN_ANGLE = 20;

/**
 * A figure the learner draws and names: its corners run counter-clockwise
 * (as the package names every figure), it covers at least `minArea` FE and
 * has no angle under MIN_ANGLE.
 */
function wellShaped(pts: Vec[], minArea: number): boolean {
  return signedArea(pts) >= minArea && smallestAngle(pts) >= MIN_ANGLE;
}

// 2.1 Die Drehung ────────────────────────────────────────────────────────────

/** A rotation by ±90° or 180° about a grid point, P and P' inside −7 … 7. */
function gridTurn(rng: Rng) {
  for (;;) {
    const z = vec(rng.int(-3, 3), rng.int(-3, 3));
    const d = vec(rng.int(-4, 4), rng.int(-4, 4));
    if (d.x === 0 && d.y === 0) continue;
    // mostly a way with both directions; a centre in the origin only now and then
    if ((d.x === 0 || d.y === 0) && rng.next() < 0.8) continue;
    if (same(z, ORIGIN) && rng.next() < 0.85) continue;
    const phi = rng.pick([90, 90, -90, -90, 180]);
    const p = add(z, d);
    const q = add(z, turn(d, phi));
    if (reach(p, q) > 7) continue;
    return { z, d, phi, p, q };
  }
}

/**
 * Level 2 of the grid task: a triangle and its image under ±90° or 180°
 * about a grid point Z. For ±90°, ZA→ and ZB→ lie on the two diagonals of the
 * grid, so the Mittelsenkrechten of [AA'] and [BB'] run along grid lines and
 * Z can be read off the drawing.
 */
function findCentre(rng: Rng) {
  for (;;) {
    const phi = rng.pick([90, 90, -90, -90, 180]);
    const z = vec(rng.int(-2, 2), rng.int(-2, 2));
    let a: Vec;
    let b: Vec;
    if (phi === 180) {
      a = vec(rng.int(-4, 4), rng.int(-4, 4));
      b = vec(rng.int(-4, 4), rng.int(-4, 4));
    } else {
      const s = rng.sign();
      const ka = nonZero(rng, 3);
      let kb = nonZero(rng, 3);
      // equal lengths would put B' on A or A' on B
      while (Math.abs(kb) === Math.abs(ka)) kb = nonZero(rng, 3);
      a = vec(ka, ka * s);
      b = vec(kb, -kb * s);
    }
    const c = vec(rng.int(-4, 4), rng.int(-4, 4));
    const corners = [a, b, c].map((d) => add(z, d));
    const images = [a, b, c].map((d) => add(z, turn(d, phi)));
    if ([a, b, c].some((d) => d.x === 0 && d.y === 0)) continue;
    // ABC counter-clockwise and not flat; the image keeps both
    if (!wellShaped(corners, 3)) continue;
    if (reach(...corners, ...images) > 7) continue;
    // no corner of the image on a corner of the triangle, no corner on Z
    if (images.some((q) => corners.some((p) => same(p, q))) || corners.some((p) => same(p, z))) continue;
    // for 180° the two midpoints must not give the answer away by sitting on a corner
    if (phi === 180 && (a.x === 0 || a.y === 0) && rng.next() < 0.7) continue;
    return { phi, z, corners, images };
  }
}

const drehung: Lesson = {
  id: "dr-1-drehung",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "2.1 Die Drehung",
  subtitle: "Drehzentrum, Drehwinkel und die Eigenschaften der Drehung",
  tracks: ["I"],
  lehrplan: `${LP}: Drehung als Kongruenzabbildung`,
  whyItMatters:
    "Uhrzeiger, Riesenräder, Drehtüren und Windräder bewegen sich durch Drehungen. Mit der Abbildungsvorschrift konstruierst du gedrehte Figuren und findest Drehzentrum und Drehwinkel; in Lektion 2.3 berechnest du gedrehte Punkte mit Vektoren.",
  explanationHtml: `
    <p><strong>Wiederholung aus M6 und M7:</strong> Achsenspiegelung und Parallelverschiebung sind Kongruenzabbildungen: Sie ändern die Lage einer Figur, aber nicht ihre Form und Größe. Die Drehung ist die dritte Kongruenzabbildung.</p>
    <p>Eine <strong>Drehung</strong> ist durch ihr <strong>Drehzentrum Z</strong> und ihren <strong>Drehwinkel φ</strong> festgelegt. Ein positiver Drehwinkel dreht gegen den Uhrzeigersinn, ein negativer im Uhrzeigersinn. Die <strong>Abbildungsvorschrift</strong> der Drehung um Z mit φ: Der Bildpunkt P' eines Punktes P liegt auf dem Kreis um Z durch P, also ${len("ZP'")} = ${len("ZP")}, und die Halbgerade [ZP' entsteht aus [ZP durch eine Drehung um |φ| in Drehrichtung. Weil ein Winkel ∢PZP' immer gegen den Uhrzeigersinn von [ZP nach [ZP' gemessen wird, gilt für positives φ ∢PZP' = φ; für negatives φ, etwa φ = −50°, ist ∢P'ZP = 50°. Das Drehzentrum selbst bleibt liegen.</p>
    <p><strong>Konstruktion mit Zirkel und Geodreieck</strong> (Drehung um Z mit φ = 70°):</p>
    <ol class="steps">
      <li>Zeichne die Halbgerade [ZP.</li>
      <li>Trage in Z an [ZP den Winkel 70° gegen den Uhrzeigersinn an.</li>
      <li>Der Kreis um Z mit dem Radius ${len("ZP")} schneidet den freien Schenkel in P'.</li>
    </ol>
    <p>Eine Strecke oder ein Vieleck drehst du, indem du die Eckpunkte drehst und die Bildpunkte verbindest; bei einem Kreis drehst du den Mittelpunkt, der Radius bleibt.</p>
    <p><strong>Eigenschaften:</strong> Die Drehung ist eine Kongruenzabbildung.</p>
    <table class="mini">
      <tr><th>Eigenschaft</th><th>bedeutet</th></tr>
      <tr><td>längentreu</td><td>${len("A'B'")} = ${len("AB")}</td></tr>
      <tr><td>winkeltreu</td><td>Bildwinkel und Urwinkel sind gleich groß</td></tr>
      <tr><td>geradentreu, parallelentreu</td><td>Bild einer Geraden ist eine Gerade; parallele Geraden haben parallele Bildgeraden</td></tr>
      <tr><td>kreistreu</td><td>Bild eines Kreises ist ein Kreis mit gleichem Radius</td></tr>
    </table>
    <ul>
      <li>Der <strong>Umlaufsinn</strong> bleibt erhalten: Folgen A, B, C gegen den Uhrzeigersinn aufeinander, dann auch A', B', C'. Bei der Achsenspiegelung kehrt er sich um; ein Spiegelbild lässt sich deshalb nie durch eine Drehung erreichen.</li>
      <li>Für 0° &lt; φ &lt; 360° ist Z der einzige <strong>Fixpunkt</strong>. Bei einer vollen Umdrehung (360°) bleibt jeder Punkt liegen, wie bei 0°.</li>
      <li><strong>φ und φ − 360°</strong> beschreiben dieselbe Drehung: −90° (im Uhrzeigersinn) führt zum selben Bild wie 270° gegen den Uhrzeigersinn.</li>
      <li>Die <strong>Umkehrabbildung</strong> der Drehung um Z mit φ ist die Drehung um Z mit −φ: Sie bringt P' zurück nach P.</li>
      <li>Zwei Drehungen um <strong>dasselbe</strong> Zentrum nacheinander ergeben die Drehung um Z mit φ<sub>1</sub> + φ<sub>2</sub>.</li>
    </ul>
    <p><strong>Drehzentrum und Drehwinkel finden:</strong> Wegen ${len("ZP")} = ${len("ZP'")} ist Z von P und P' gleich weit entfernt und liegt deshalb auf der Mittelsenkrechten von [PP'] (Wiederholung aus M6). Kennst du zwei Punkte P und Q mit ihren Bildpunkten, ist Z der Schnittpunkt der Mittelsenkrechten von [PP'] und [QQ']. Den Drehwinkel misst du danach zwischen [ZP und [ZP' und achtest auf die Richtung. Mit einer Geometriesoftware geht beides mit den Werkzeugen „Mittelsenkrechte“ und „Drehung um einen Punkt“.</p>
    <div class="example"><strong>Beispiel:</strong> Eine Drehung bildet P(4 | 3) auf P'(4 | −1) und Q(5 | 2) auf Q'(3 | −2) ab. Gesucht sind Z und φ.<br>
      1. P und P' liegen übereinander, der Mittelpunkt von [PP'] ist (4 | 1). Die Mittelsenkrechte von [PP'] ist die Waagrechte y = 1.<br>
      2. Die Mittelsenkrechte von [QQ'] geht durch den Mittelpunkt (4 | 0) von [QQ'] und steht senkrecht auf [QQ']. Eingezeichnet schneidet sie die Waagrechte y = 1 im Punkt Z(2 | 1).<br>
      3. Probe mit Kästchen: Von Z nach Q geht es 3 nach rechts und 1 nach oben, von Z nach Q' 1 nach rechts und 3 nach unten. Die Wege sind gleich lang und um einen rechten Winkel gegeneinander gedreht.<br>
      4. Von [ZP nach [ZP' dreht man um 90° im Uhrzeigersinn: φ = −90°, gleichwertig φ = 270°.</div>
    <p><strong>Typische Fehler:</strong> den Winkel in die falsche Richtung antragen (auf das Vorzeichen achten), den Winkel an P statt an Z antragen, den Kreis mit dem falschen Radius zeichnen (der Radius ist ${len("ZP")}) und beim Drehzentrum die Mittelsenkrechte von [PQ] statt von [PP'] nehmen.</p>
    <div class="merke"><strong>Merke:</strong> Bei der Drehung um Z mit φ liegt P' auf dem Kreis um Z durch P, und [ZP' entsteht aus [ZP durch eine Drehung um |φ|, für positives φ gegen den Uhrzeigersinn, für negatives im Uhrzeigersinn. Die Drehung ist eine Kongruenzabbildung, die den Umlaufsinn erhält; Z ist ihr einziger Fixpunkt. Das Drehzentrum liegt auf der Mittelsenkrechten jeder Strecke [PP'].</div>
  `,
  formulas: [
    { name: "Abbildungsvorschrift", html: `${len("ZP'")} = ${len("ZP")}; für φ &gt; 0 ist ∢PZP' = φ, für φ &lt; 0 ist ∢P'ZP = |φ|`, quantities: "Z Drehzentrum, φ Drehwinkel (positiv: gegen den Uhrzeigersinn, negativ: im Uhrzeigersinn), P' Bildpunkt von P" },
    { name: "Dieselbe Drehung", html: "φ und φ − 360°, zum Beispiel −90° und 270°", quantities: "beide Winkel führen zu denselben Bildpunkten" },
    { name: "Umkehren und nacheinander drehen", html: "Umkehrabbildung: Drehung um Z mit −φ; erst φ<sub>1</sub>, dann φ<sub>2</sub> um dasselbe Z: φ<sub>1</sub> + φ<sub>2</sub>", quantities: "φ₁, φ₂ Drehwinkel um dasselbe Zentrum" },
    { name: "Drehzentrum", html: "Z = Schnittpunkt der Mittelsenkrechten von [PP'] und [QQ']", quantities: "P, Q zwei Punkte, P', Q' ihre Bildpunkte" },
  ],
  quiz: {
    question: "Der Punkt P soll um Z mit dem Drehwinkel φ = −60° gedreht werden. Wie konstruierst du P'?",
    options: [
      "Kreis um P durch Z zeichnen und in P an [PZ den Winkel 60° antragen.",
      "Kreis um Z durch P zeichnen und in Z an [ZP den Winkel 60° gegen den Uhrzeigersinn antragen.",
      "Kreis um Z durch P zeichnen und in Z an [ZP den Winkel 60° im Uhrzeigersinn antragen.",
      `Durch P die Senkrechte zu ZP zeichnen und P' im Abstand ${lenText("ZP")} von P markieren.`,
    ],
    correctIndex: 2,
    explanation:
      "P' liegt auf dem Kreis um Z durch P, und der Winkel wird in Z an [ZP angetragen. Das Minuszeichen heißt: im Uhrzeigersinn. Gegen den Uhrzeigersinn wäre die Drehung um +60°, und ein Kreis um P hat den falschen Mittelpunkt.",
  },
  lab: {
    kind: "rotation",
    title: "Labor: Drehen mit Kreis und Winkel",
    intro:
      "Ziehe das Drehzentrum Z und den Bildpunkt A' (er stellt den Drehwinkel φ ein). Die gestrichelten Bögen sind die Kreise um Z, auf denen die Ecken wandern; die kleinen Kreispfeile zeigen den Umlaufsinn. Die Hilfslinien zeichnen die Mittelsenkrechten zu einem der beiden Zieldreiecke ein.",
    params: [
      { type: "range", key: "phi", label: "Drehwinkel φ", unit: "°", min: -360, max: 360, step: 5, value: 60 },
      { type: "range", key: "zx", label: "x von Z", unit: "", min: -6, max: 6, step: 0.5, value: -3, digits: 1 },
      { type: "range", key: "zy", label: "y von Z", unit: "", min: -6, max: 6, step: 0.5, value: -2, digits: 1 },
      {
        type: "choice",
        key: "hilfe",
        label: "Hilfslinien: Mittelsenkrechten",
        options: [
          { value: 0, label: "keine" },
          { value: 1, label: "zu Dreieck 1" },
          { value: 2, label: "zu Dreieck 2" },
        ],
        value: 0,
      },
    ],
    readouts: [
      {
        key: "bild",
        label: "Bildpunkt A'",
        compute: (v) => {
          const a = rotatedTriangle(v)[0];
          const exact = Math.abs(a.x * 100 - Math.round(a.x * 100)) < 1e-6 && Math.abs(a.y * 100 - Math.round(a.y * 100)) < 1e-6;
          return exact ? named("A'", a) : `A' ≈ ${point(a.x, a.y)}`;
        },
      },
      { key: "radius", label: `${lenText("ZA")} = ${lenText("ZA'")}`, unit: "LE", digits: 2, compute: (v) => Math.hypot(TRIANGLE[0].x - v.zx, TRIANGLE[0].y - v.zy) },
      { key: "winkel", label: "Drehwinkel", compute: (v) => angleText(v.phi) },
      { key: "ziel", label: "Zieldreiecke", emphasis: true, compute: (v) => targetText(v) },
    ],
    goals: [
      {
        id: "ziel",
        text: "Nur eines der beiden gestrichelten Dreiecke lässt sich durch eine Drehung erreichen. Finde Drehzentrum und Drehwinkel, sodass A'B'C' genau darauf liegt. Warum gelingt es beim anderen nie?",
        check: (v) => reachesTarget(v, 1),
      },
      {
        id: "negativ",
        text: "Bringe ABC noch einmal auf dasselbe Dreieck, jetzt mit einem negativen Drehwinkel. Wie hängen die beiden Drehwinkel zusammen?",
        check: (v) => reachesTarget(v, 1) && v.phi < 0,
      },
      {
        id: "fixpunkt",
        text: "Finde eine Drehung, deren Drehwinkel kein Vielfaches von 360° ist und bei der eine Ecke des Dreiecks ABC an ihrem Platz bleibt. Wo liegt dann Z?",
        check: (v) => turns(v.phi) && fixedCorner(v) >= 0,
      },
    ],
  },
  exercises: [
    {
      id: "winkel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          if (rng.next() < 0.5) {
            const phi = rng.sign() * rng.pick([20, 30, 40, 45, 50, 60, 70, 75, 80, 100, 110, 120, 130, 135, 140, 150, 160]);
            const partner = phi > 0 ? phi - 360 : phi + 360;
            const otherWay = phi > 0 ? 360 - phi : -360 - phi;
            return {
              prompt: `Die Drehung um Z mit φ = ${deg(phi)} bildet den Punkt P auf P' ab. Gib den Drehwinkel der Umkehrabbildung zwischen −180° und 180° an und den Drehwinkel mit dem anderen Vorzeichen, der dieselbe Drehung wie φ = ${deg(phi)} beschreibt.`,
              given: [`φ = ${deg(phi)}, also ${dirWord(phi)}`],
              formulaHint: "Umkehrabbildung: Drehung um Z mit −φ; dieselbe Drehung: φ − 360° bzw. φ + 360°",
              fields: [
                numberField("Umkehrabbildung: φ =", -phi, "°", 0, {
                  slips: [{ value: otherWay, hint: `${deg(otherWay)} dreht P' zwar auch zurück, gefragt ist aber der Winkel zwischen −180° und 180°: einfach in die Gegenrichtung drehen.` }],
                }),
                numberField("dieselbe Drehung: φ =", partner, "°", 0, {
                  slips: [{ value: -phi, hint: "−φ ist die Umkehrabbildung, sie dreht zurück. Dieselbe Drehung erreichst du in der anderen Richtung, wenn du die fehlenden Grad bis zur vollen Umdrehung drehst: φ − 360°." }],
                }),
              ],
              steps: [
                `Die Umkehrabbildung dreht P' auf demselben Kreis zurück nach P, also gleich weit in die Gegenrichtung: φ = ${deg(-phi)}.`,
                `Eine volle Umdrehung ändert keinen Punkt: ${deg(phi)} ${phi > 0 ? "−" : "+"} 360° = ${deg(partner)} führt zum selben Bildpunkt wie ${deg(phi)}.`,
                `<strong>Umkehrabbildung: φ = ${deg(-phi)}; dieselbe Drehung: φ = ${deg(partner)}</strong>`,
              ],
              meta: { kind: 0, phi },
            };
          }
          // two rotations about the same centre whose sum leaves −180° … 180°
          const sign = rng.sign();
          let p1 = 0;
          let p2 = 0;
          do {
            p1 = sign * rng.int(6, 17) * 10;
            p2 = sign * rng.int(6, 17) * 10;
          } while (Math.abs(p1 + p2) <= 190 || Math.abs(p1 + p2) >= 350);
          const total = p1 + p2;
          const inRange = total > 0 ? total - 360 : total + 360;
          return {
            prompt: `Ein Punkt P wird erst um Z mit φ<sub>1</sub> = ${deg(p1)} und danach um dasselbe Zentrum Z mit φ<sub>2</sub> = ${deg(p2)} gedreht. Mit welcher einzigen Drehung um Z kommt P direkt an dieselbe Stelle? Gib den Drehwinkel als Summe und als Winkel zwischen −180° und 180° an.`,
            given: [`φ<sub>1</sub> = ${deg(p1)}`, `φ<sub>2</sub> = ${deg(p2)}`],
            formulaHint: "erst φ<sub>1</sub>, dann φ<sub>2</sub> um dasselbe Z: φ = φ<sub>1</sub> + φ<sub>2</sub>; φ und φ − 360° (bzw. φ + 360°) beschreiben dieselbe Drehung",
            fields: [
              numberField("φ<sub>1</sub> + φ<sub>2</sub> =", total, "°", 0, {
                slips: [{ value: p1 - p2, hint: "Beide Drehungen gehen in dieselbe Richtung weiter: Die Drehwinkel werden addiert." }],
              }),
              numberField("zwischen −180° und 180°: φ =", inRange, "°", 0, {
                slips: [{ value: total, hint: `${deg(total)} liegt nicht zwischen −180° und 180°. Rechne mit ${total > 0 ? "− 360°" : "+ 360°"} um: Das ist dieselbe Drehung.` }],
              }),
            ],
            steps: [
              `Zwei Drehungen um dasselbe Zentrum: φ = φ<sub>1</sub> + φ<sub>2</sub> = ${deg(p1)} + ${p2 < 0 ? `(${deg(p2)})` : deg(p2)} = ${deg(total)}.`,
              `${deg(total)} ${total > 0 ? "−" : "+"} 360° = ${deg(inRange)} beschreibt dieselbe Drehung, ${dirWord(inRange)}.`,
              `<strong>φ = ${deg(total)}, gleichwertig φ = ${deg(inRange)}</strong>`,
            ],
            meta: { kind: 1, p1, p2 },
          };
        }
        if (rng.next() < 0.5) {
          // the hands of a clock
          const minutes = rng.int(2, 11) * 5;
          const hour = rng.int(1, 10);
          const start = rng.int(0, 11) * 5;
          const endTotal = start + minutes;
          const time = (h: number, m: number) => `${h}:${String(m).padStart(2, "0")} Uhr`;
          const from = time(hour, start);
          const to = time(endTotal >= 60 ? hour + 1 : hour, endTotal % 60);
          const minuteHand = -6 * minutes;
          const hourHand = -0.5 * minutes;
          return {
            prompt: `Eine Uhr zeigt ${from}. Bis ${to} drehen sich ihre Zeiger um die gemeinsame Achse in der Mitte des Zifferblatts. Um welchen Winkel dreht sich in dieser Zeit der Minutenzeiger, um welchen der Stundenzeiger? Gib die Drehwinkel mit Vorzeichen an: gegen den Uhrzeigersinn positiv, im Uhrzeigersinn negativ.`,
            given: [`von ${from} bis ${to}`],
            fields: [
              numberField("Minutenzeiger: φ =", minuteHand, "°", 0, {
                slips: [
                  { value: -minutes, hint: "In 60 Minuten dreht sich der Minutenzeiger einmal ganz herum, also um 360° : 60 = 6° pro Minute." },
                  { value: 6 * minutes, hint: "Die Zeiger einer Uhr drehen im Uhrzeigersinn: Der Drehwinkel ist negativ." },
                ],
              }),
              numberField("Stundenzeiger: φ =", hourHand, "°", 1, {
                slips: [
                  { value: -minutes, hint: "Der Stundenzeiger braucht für 30° (von einer Zahl zur nächsten) eine ganze Stunde, in einer Minute schafft er 30° : 60 = 0,5°." },
                  { value: -6 * minutes, hint: "Das ist der Winkel des Minutenzeigers. Der Stundenzeiger ist zwölfmal langsamer: 0,5° pro Minute." },
                  { value: 0.5 * minutes, hint: "Die Zeiger einer Uhr drehen im Uhrzeigersinn: Der Drehwinkel ist negativ." },
                ],
              }),
            ],
            steps: [
              `Von ${from} bis ${to} vergehen ${minutes} Minuten. Beide Zeiger drehen im Uhrzeigersinn, die Drehwinkel sind also negativ.`,
              `Minutenzeiger: 360° in 60 Minuten, also 6° pro Minute; ${minutes} · 6° = ${deg(6 * minutes)}.`,
              `Stundenzeiger: 30° in 60 Minuten, also 0,5° pro Minute; ${minutes} · 0,5° = ${deg(0.5 * minutes)}.`,
              `<strong>Der Minutenzeiger dreht sich um φ = ${deg(minuteHand)}, der Stundenzeiger um φ = ${deg(hourHand)}.</strong>`,
            ],
            meta: { kind: 2, minutes, hour, start },
          };
        }
        // a Ferris wheel: angle from time, then the gondola at the entrance
        for (;;) {
          const n = rng.pick([12, 18, 20, 24, 30, 36]);
          const period = rng.pick([10, 12, 15, 18, 20, 24, 30]);
          const t = rng.int(1, period - 1);
          const phi = (360 * t) / period;
          const alpha = 360 / n;
          const steps = phi / alpha;
          if (!Number.isInteger(steps) || phi === 180) continue;
          return {
            prompt: `Ein Riesenrad mit ${n} Gondeln dreht sich gleichmäßig gegen den Uhrzeigersinn und braucht für eine volle Umdrehung ${period} Minuten. Die Gondeln sind in der Reihenfolge nummeriert, in der sie unten am Einstieg ankommen; am Anfang ist Gondel 1 am Einstieg. Um welchen Winkel dreht sich das Rad in ${t} ${t === 1 ? "Minute" : "Minuten"}, und welche Gondel ist dann am Einstieg?`,
            given: [`${n} Gondeln`, `${period} Minuten für 360°`, `${t} ${t === 1 ? "Minute" : "Minuten"}`],
            fields: [
              numberField("Drehwinkel: φ =", phi, "°", 0, {
                slips: [{ value: t * alpha, hint: "Rechne zuerst den Winkel aus der Zeit aus: In einer Minute dreht sich das Rad um 360° geteilt durch die Minuten einer Umdrehung." }],
              }),
              numberField("Gondel Nr.", steps + 1, "", 0, {
                slips: [{ value: steps, hint: `Gondel 1 war am Anfang unten. Nach ${steps} Gondelabständen ist die Gondel mit der Nummer 1 + ${steps} am Einstieg.` }],
              }),
            ],
            steps: [
              `In ${period} Minuten 360°, also in einer Minute 360° : ${period} = ${deg(360 / period)}; in ${t} ${t === 1 ? "Minute" : "Minuten"}: ${t} · ${deg(360 / period)} = ${deg(phi)}.`,
              `Zwei benachbarte Gondeln liegen 360° : ${n} = ${deg(alpha)} auseinander.`,
              `${deg(phi)} : ${deg(alpha)} = ${steps}: Das Rad hat sich um ${steps} Gondelabstände weitergedreht.`,
              `<strong>Das Rad dreht sich um φ = ${deg(phi)}; am Einstieg ist dann Gondel ${steps + 1}.</strong>`,
            ],
            meta: { kind: 3, n, period, t },
          };
        }
      },
    },
    {
      id: "gitter",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const { z, d, phi, p, q } = gridTurn(rng);
          const aboutO = turn(p, phi);
          const wrongWay = phi === 180 ? null : add(z, turn(d, -phi));
          const atP = add(p, turn(d, phi));
          const forgotZ = "Du hast um den Ursprung gedreht. Zähle die Kästchen von Z aus und drehe diesen Weg.";
          const way = phi > 0 ? "Positive Drehwinkel drehen gegen den Uhrzeigersinn." : "Negative Drehwinkel drehen im Uhrzeigersinn.";
          const fromP = "Der gedrehte Weg beginnt wieder bei Z, nicht bei P.";
          return {
            prompt: `Drehe den Punkt P${pt(p)} um das Drehzentrum Z${pt(z)} mit φ = ${deg(phi)}. Zähle dazu auf dem Gitter die Kästchen von Z nach P und drehe diesen Weg mit. Gib die Koordinaten des Bildpunkts P' an.`,
            given: [`P${pt(p)}`, `Z${pt(z)}`, `φ = ${deg(phi)}${phi === 180 ? "" : `, ${dirWord(phi)}`}`],
            formulaHint:
              "Weg von Z nach P abzählen und mitdrehen: Bei +90° wird „nach rechts“ zu „nach oben“ und „nach oben“ zu „nach links“, bei −90° umgekehrt; bei 180° kehrt sich jede Richtung um.",
            fields: [
              coord("P': x' =", q.x, [{ value: aboutO.x, hint: forgotZ }, wrongWay && { value: wrongWay.x, hint: way }, { value: atP.x, hint: fromP }]),
              coord("y' =", q.y, [{ value: aboutO.y, hint: forgotZ }, wrongWay && { value: wrongWay.y, hint: way }, { value: atP.y, hint: fromP }]),
            ],
            steps: [
              `Von Z nach P: ${moveText(d)}.`,
              `Um ${deg(phi)} gedreht: ${turnedText(d, phi)}.`,
              `Von Z${pt(z)} aus ${moveText(turn(d, phi))} führt zu P'.`,
              `<strong>P'${pt(q)}</strong>`,
            ],
            meta: { px: p.x, py: p.y, zx: z.x, zy: z.y, phi },
          };
        }
        const { phi, z, corners, images } = findCentre(rng);
        const [A, B, C] = corners;
        const [A1, B1, C1] = images;
        const M1 = midpoint(A, A1);
        const M2 = midpoint(B, B1);
        const bisector = (P: Vec, Q: Vec, M: Vec, name: string, index: string) =>
          P.y === Q.y
            ? `${name} und ${name}' haben dieselbe y-Koordinate. Die Mittelsenkrechte von [${name}${name}'] ist die Senkrechte x = ${fmt(M.x)} durch den Mittelpunkt M<sub>${index}</sub>${pt(M)}.`
            : `${name} und ${name}' haben dieselbe x-Koordinate. Die Mittelsenkrechte von [${name}${name}'] ist die Waagrechte y = ${fmt(M.y)} durch den Mittelpunkt M<sub>${index}</sub>${pt(M)}.`;
        const steps =
          phi === 180
            ? [
                `Mittelpunkt von [AA']: ((${fmt(A.x)} + ${paren(A1.x)}) : 2 | (${fmt(A.y)} + ${paren(A1.y)}) : 2) = ${pt(M1)}; der Mittelpunkt von [BB'] ist derselbe Punkt.`,
                `Die Mittelsenkrechten von [AA'] und [BB'] gehen beide durch diesen Punkt, er ist das Drehzentrum Z${pt(z)}.`,
                `A, Z und A' liegen auf einer Geraden, Z in der Mitte: Der Drehwinkel ist 180°.`,
                `<strong>Z${pt(z)}, φ = 180°</strong>`,
              ]
            : [
                bisector(A, A1, M1, "A", "1"),
                bisector(B, B1, M2, "B", "2"),
                `Die beiden Mittelsenkrechten schneiden sich in Z${pt(z)}. Probe: Von Z nach C geht es ${moveText(sub(C, z))}, nach C' ${moveText(sub(C1, z))}: gleich lange Wege, um einen rechten Winkel gedreht.`,
                `Von [ZA nach [ZA' dreht man um 90° ${dirWord(phi)}: φ = ${deg(phi)}.`,
                `<strong>Z${pt(z)}, φ = ${deg(phi)}</strong>`,
              ];
        const midSlip = "Der Mittelpunkt von [AA'] liegt zwar auf der Mittelsenkrechten, ist aber nicht das Drehzentrum: Schneide sie mit der Mittelsenkrechten von [BB'].";
        return {
          prompt: `Eine Drehung bildet das Dreieck ABC mit A${pt(A)}, B${pt(B)} und C${pt(C)} auf das Dreieck A'B'C' mit A'${pt(A1)}, B'${pt(B1)} und C'${pt(C1)} ab. Zeichne beide Dreiecke in ein Koordinatensystem, bestimme das Drehzentrum Z mithilfe der Mittelsenkrechten und den Drehwinkel φ mit −180° &lt; φ ≤ 180°.`,
          given: [`A${pt(A)}, B${pt(B)}, C${pt(C)}`, `A'${pt(A1)}, B'${pt(B1)}, C'${pt(C1)}`],
          fields: [
            coord("Z: x =", z.x, phi === 180 ? [] : [{ value: M1.x, hint: midSlip }]),
            coord("y =", z.y, phi === 180 ? [] : [{ value: M1.y, hint: midSlip }]),
            numberField("φ =", phi, "°", 0, { slips: phi === 180 ? [] : [{ value: -phi, hint: "Prüfe die Richtung: Von [ZA nach [ZA' gegen den Uhrzeigersinn ist positiv, im Uhrzeigersinn negativ." }] }),
          ],
          steps,
          meta: { phi, zx: z.x, zy: z.y, ax: A.x, ay: A.y, bx: B.x, by: B.y, cx: C.x, cy: C.y },
        };
      },
    },
    {
      id: "eigenschaften",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const ab = rng.int(25, 90) / 10;
          const alpha = rng.int(25, 115);
          // two different lengths and α different from |φ|: each slip keeps its hint
          let za = ab;
          while (za === ab) za = rng.int(20, 70) / 10;
          let phi = alpha;
          while (Math.abs(phi) === alpha) phi = rng.sign() * rng.pick([35, 40, 55, 65, 75, 80, 100, 115, 125, 140, 160]);
          const ccw = rng.next() < 0.5;
          const sense = ccw ? "gegen den Uhrzeigersinn" : "im Uhrzeigersinn";
          return {
            prompt: `Das Dreieck ABC wird um einen Punkt Z mit φ = ${deg(phi)} auf A'B'C' gedreht. Von ABC kennt man ${len("AB")} = ${fmt(ab)} cm und den Innenwinkel α = ${alpha}° bei A; außerdem ist ${len("ZA")} = ${fmt(za)} cm, und die Ecken A, B, C folgen ${sense} aufeinander. Gib ${len("A'B'")}, den Innenwinkel α' bei A', ${len("ZA'")} und den Umlaufsinn von A'B'C' an.`,
            given: [`${len("AB")} = ${fmt(ab)} cm, α = ${alpha}°`, `${len("ZA")} = ${fmt(za)} cm`, `φ = ${deg(phi)}`],
            formulaHint: `Die Drehung ist längentreu und winkeltreu, ${len("ZP'")} = ${len("ZP")}, und der Umlaufsinn bleibt erhalten.`,
            fields: [
              numberField(`${len("A'B'")} =`, ab, "cm", 1, { slips: [{ value: za, hint: `${lenText("ZA")} ist der Abstand von A zum Drehzentrum. Die Seite [A'B'] ist so lang wie die Seite [AB].` }] }),
              numberField("α' =", alpha, "°", 0, { slips: [{ value: Math.abs(phi), hint: "φ ist der Drehwinkel um Z. Die Winkel im Dreieck ändern sich beim Drehen nicht." }] }),
              numberField(`${len("ZA'")} =`, za, "cm", 1, { slips: [{ value: ab, hint: `A' liegt auf dem Kreis um Z durch A: ${lenText("ZA'")} = ${lenText("ZA")}.` }] }),
              choiceField("Umlaufsinn von A'B'C':", ["gegen den Uhrzeigersinn", "im Uhrzeigersinn"], ccw ? 0 : 1),
            ],
            steps: [
              `Die Drehung ist längentreu: ${len("A'B'")} = ${len("AB")} = ${fmt(ab)} cm. A' liegt auf dem Kreis um Z durch A, also ${len("ZA'")} = ${len("ZA")} = ${fmt(za)} cm.`,
              `Sie ist winkeltreu: α' = α = ${alpha}°. Der Drehwinkel ${deg(phi)} spielt für die Größen im Dreieck keine Rolle.`,
              `Eine Drehung erhält den Umlaufsinn (nur eine Achsenspiegelung kehrt ihn um): A', B', C' folgen ebenfalls ${sense} aufeinander.`,
              `<strong>${len("A'B'")} = ${fmt(ab)} cm, α' = ${alpha}°, ${len("ZA'")} = ${fmt(za)} cm, ${sense}</strong>`,
            ],
            meta: { ab, alpha, za, phi, ccw: ccw ? 1 : 0 },
          };
        }
        if (rng.next() < 0.6) {
          const size = rng.pick([40, 50, 55, 60, 60, 70, 80, 90, 90, 100, 110, 120, 130, 140]);
          const phi = rng.sign() * size;
          const zp = rng.int(25, 80) / 10;
          const base = (180 - size) / 2;
          const type = size === 60 ? 1 : size === 90 ? 2 : 0;
          const types = ["nur gleichschenklig mit der Spitze Z", "gleichseitig", "gleichschenklig und rechtwinklig"];
          const fields = [
            shuffledChoice(rng, "Das Dreieck ZPP' ist", types, type),
            numberField("Winkel bei Z:", size, "°", 0, { slips: phi < 0 ? [{ value: phi, hint: "Ein Winkel im Dreieck ist nie negativ; das Minus von φ gibt nur die Drehrichtung an." }] : [] }),
            numberField("Winkel bei P:", base, "°", 1, {
              slips: [
                { value: 180 - size, hint: "Die beiden Basiswinkel bei P und P' sind gleich groß und teilen sich 180° minus den Winkel bei Z." },
                { value: 90 - size, hint: "Innenwinkelsumme: Die drei Winkel ergeben 180°, und die beiden Basiswinkel bei P und P' sind gleich groß." },
              ],
            }),
          ];
          if (type === 1) fields.push(numberField(`${len("PP'")} =`, zp, "cm", 1, { slips: [{ value: 2 * zp, hint: "Im gleichseitigen Dreieck sind alle drei Seiten gleich lang." }] }));
          const name = types[type];
          return {
            prompt: `Bei einer Drehung um Z mit φ = ${deg(phi)} wird der Punkt P auf P' abgebildet; dabei ist ${len("ZP")} = ${fmt(zp)} cm. Welche besondere Form hat das Dreieck ZPP'? Berechne die Innenwinkel des Dreiecks bei Z und bei P${type === 1 ? " sowie die Länge der Strecke [PP']" : ""}.`,
            given: [`φ = ${deg(phi)}`, `${len("ZP")} = ${fmt(zp)} cm`],
            fields,
            steps: [
              `${len("ZP'")} = ${len("ZP")} = ${fmt(zp)} cm: Das Dreieck ZPP' ist gleichschenklig mit der Spitze Z${type === 1 ? ", und weil der Winkel an der Spitze 60° beträgt, sogar gleichseitig" : type === 2 ? " und hat bei Z einen rechten Winkel" : ""}.`,
              `Der Winkel an der Spitze Z ist so groß wie der Betrag des Drehwinkels: ${size}°${phi < 0 ? " (das Minus von φ gibt nur die Richtung an)" : ""}.`,
              `Die Basiswinkel bei P und P' sind gleich groß: (180° − ${size}°) : 2 = ${deg(base)}.${type === 1 ? ` Im gleichseitigen Dreieck ist ${len("PP'")} = ${len("ZP")} = ${fmt(zp)} cm.` : ""}`,
              `<strong>${name[0].toUpperCase()}${name.slice(1)}; Winkel bei Z: ${size}°, bei P: ${deg(base)}${type === 1 ? `, ${len("PP'")} = ${fmt(zp)} cm` : ""}</strong>`,
            ],
            meta: { kind: 0, phi, zp },
          };
        }
        const base = rng.int(4, 17) * 5;
        const clockwise = rng.next() < 0.5;
        const size = 180 - 2 * base;
        const phi = clockwise ? -size : size;
        return {
          prompt: `Eine Drehung um Z ${clockwise ? "im" : "gegen den"} Uhrzeigersinn bildet den Punkt P auf P' ab. Im Dreieck ZPP' hat der Innenwinkel bei P die Größe ${base}°. Wie groß ist der Innenwinkel bei Z, und welchen Drehwinkel φ (mit Vorzeichen, −180° &lt; φ &lt; 180°) hat die Drehung?`,
          given: [`Innenwinkel bei P: ${base}°`, clockwise ? "im Uhrzeigersinn" : "gegen den Uhrzeigersinn"],
          fields: [
            numberField("Winkel bei Z:", size, "°", 0, { slips: [{ value: 180 - base, hint: `Im Dreieck ZPP' sind beide Basiswinkel ${base}° groß: 180° − 2 · ${base}°.` }] }),
            numberField("φ =", phi, "°", 0, {
              slips: [
                { value: clockwise ? -(180 - base) : 180 - base, hint: `Im Dreieck ZPP' sind beide Basiswinkel ${base}° groß: Der Winkel bei Z ist 180° − 2 · ${base}°.` },
                { value: -phi, hint: "Prüfe das Vorzeichen: Im Uhrzeigersinn ist der Drehwinkel negativ, gegen den Uhrzeigersinn positiv." },
              ],
            }),
          ],
          steps: [
            `${len("ZP")} = ${len("ZP'")}, also ist das Dreieck ZPP' gleichschenklig mit der Spitze Z, und die Basiswinkel bei P und P' sind beide ${base}° groß.`,
            `Innenwinkelsumme: Der Winkel bei Z ist 180° − 2 · ${base}° = ${size}°.`,
            `Er ist so groß wie der Betrag des Drehwinkels. Die Drehung läuft ${clockwise ? "im" : "gegen den"} Uhrzeigersinn, also φ = ${deg(phi)}.`,
            `<strong>Winkel bei Z: ${size}°; φ = ${deg(phi)}</strong>`,
          ],
          meta: { kind: 1, base, clockwise: clockwise ? 1 : 0 },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du drehst Figuren mit Kreis und Winkel, findest Drehzentrum und Drehwinkel und kennst die Eigenschaften der Drehung.",
};

// 2.2 Punktspiegelung und Drehsymmetrie ──────────────────────────────────────

const POLYGON_NAMES: Record<number, string> = {
  3: "ein gleichseitiges Dreieck",
  4: "ein Quadrat",
  5: "ein regelmäßiges Fünfeck",
  6: "ein regelmäßiges Sechseck",
  8: "ein regelmäßiges Achteck",
  9: "ein regelmäßiges Neuneck",
  10: "ein regelmäßiges Zehneck",
  12: "ein regelmäßiges Zwölfeck",
};

interface SymmetricObject {
  /** The description of the object. */
  text: string;
  /** Its own question for the smallest angle. */
  question: string;
  /** How many equal parts repeat around the centre (with the colours or lengths counted). */
  repeats: number;
  /** What a learner gets when the pattern is ignored: the angle of all parts. */
  naive?: number;
  naiveHint?: string;
  /** The answer sentence for the smallest angle. */
  answer: (angle: number) => string;
}

const OBJECTS: SymmetricObject[] = [
  {
    text: "Eine Radkappe hat 5 gleiche Speichen, die gleichmäßig um die Mitte verteilt sind.",
    question: "Um welchen Winkel muss man die Radkappe mindestens drehen, damit sie wieder genauso aussieht?",
    repeats: 5,
    answer: (a) => `Nach einer Drehung um ${a}° sieht die Radkappe wieder genauso aus.`,
  },
  {
    text: "Ein Windrad hat drei gleiche Rotorblätter.",
    question: "Nach welcher kleinsten Drehung steht das Windrad wieder genauso da wie vorher?",
    repeats: 3,
    answer: (a) => `Das Windrad steht nach ${a}° wieder genauso da.`,
  },
  {
    text: "Eine Blüte hat 8 gleiche Blütenblätter, die gleichmäßig um die Mitte angeordnet sind.",
    question: "Um welchen kleinsten Winkel kann man die Blüte drehen, sodass sie sich selbst überdeckt?",
    repeats: 8,
    answer: (a) => `Die Blüte überdeckt sich nach ${a}° selbst.`,
  },
  {
    text: "Ein rundes Rosettenfenster hat 12 gleich große Felder, die abwechselnd rot und blau verglast sind.",
    question: "Um welchen kleinsten Winkel muss man das Fenster drehen, damit wieder Rot auf Rot und Blau auf Blau liegt?",
    repeats: 6,
    naive: 30,
    naiveHint: "Die Farben müssen auch passen: Erst nach zwei Feldern liegt wieder Rot auf Rot.",
    answer: (a) => `Erst nach ${a}°, also zwei Feldern, liegt wieder Rot auf Rot.`,
  },
  {
    text: "Ein Seestern hat fünf gleiche Arme.",
    question: "Um welchen kleinsten Winkel muss man ihn um seine Mitte drehen, damit er sich selbst überdeckt?",
    repeats: 5,
    answer: (a) => `Der Seestern überdeckt sich nach ${a}°.`,
  },
  {
    text: "Eine Schneeflocke hat sechs gleiche Äste.",
    question: "Nach welcher kleinsten Drehung um ihre Mitte sieht sie wieder genauso aus?",
    repeats: 6,
    answer: (a) => `Die Schneeflocke sieht nach ${a}° wieder genauso aus.`,
  },
  {
    text: "Ein Deckenventilator hat vier gleiche Flügel.",
    question: "Um welchen kleinsten Winkel muss er sich drehen, bis er wieder genauso aussieht?",
    repeats: 4,
    answer: (a) => `Nach ${a}° sieht der Ventilator wieder genauso aus.`,
  },
  {
    text: "Ein Stern hat 10 Zacken, die abwechselnd lang und kurz sind.",
    question: "Um welchen kleinsten Winkel muss man ihn drehen, damit wieder lange auf langen Zacken liegen?",
    repeats: 5,
    naive: 36,
    naiveHint: "Lange und kurze Zacken wechseln sich ab: Erst nach zwei Zacken liegt wieder eine lange auf einer langen.",
    answer: (a) => `Erst nach ${a}°, also zwei Zacken, liegen wieder lange auf langen Zacken.`,
  },
  {
    text: "Ein Zahnrad hat 18 gleiche Zähne.",
    question: "Um welchen kleinsten Winkel muss es sich drehen, bis jeder Zahn auf dem Platz eines anderen steht?",
    repeats: 18,
    answer: (a) => `Nach ${a}° steht jeder Zahn auf dem Platz seines Nachbarn.`,
  },
];

/** "72°, 144°, 216° und 288°". */
function anglesList(alpha: number, n: number): string {
  const all = Array.from({ length: n - 1 }, (_, i) => deg((i + 1) * alpha));
  return all.length === 1 ? all[0] : `${all.slice(0, -1).join(", ")} und ${all[all.length - 1]}`;
}

const punktspiegelung: Lesson = {
  id: "dr-2-punktspiegelung",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "2.2 Punktspiegelung und Drehsymmetrie",
  subtitle: "Die Drehung um 180° und Figuren, die sich beim Drehen selbst überdecken",
  tracks: ["I"],
  lehrplan: `${LP}: Punktspiegelung, dreh- und punktsymmetrische Figuren`,
  whyItMatters:
    "Radkappen, Windräder, Blüten und Rosettenfenster sehen nach einer Teildrehung wieder genauso aus. Mit der Punktspiegelung berechnest du fehlende Ecken von Parallelogrammen, und in Etappe 3 suchst du Symmetriezentren von Körpern.",
  explanationHtml: `
    <p>Die Drehung um Z mit φ = 180° heißt <strong>Punktspiegelung</strong> an Z. Weil 180° und −180° dieselbe Drehung beschreiben, spielt die Drehrichtung keine Rolle. P, Z und P' liegen auf einer Geraden, und Z ist der Mittelpunkt der Strecke [PP']. Zum Konstruieren zeichnest du die Gerade PZ und trägst die Länge ${len("ZP")} auf der anderen Seite von Z ab.</p>
    <p>Als Drehung ist die Punktspiegelung eine Kongruenzabbildung, die den Umlaufsinn erhält. Dazu kommen zwei besondere Eigenschaften:</p>
    <ul>
      <li>Jede Gerade ist zu ihrer Bildgeraden parallel; eine Gerade durch Z wird auf sich selbst abgebildet.</li>
      <li>Zweimal an Z gespiegelt sind 360°: Jeder Punkt ist wieder an seinem Platz. Die Punktspiegelung ist ihre eigene Umkehrabbildung.</li>
    </ul>
    <p><strong>Mit Koordinaten</strong> (Wiederholung aus M7: Gegenvektor und Vektorkette): ${vn("ZP'")} ist der Gegenvektor von ${vn("ZP")}. Für Z(z₁ | z₂) und P(x | y) gilt</p>
    <p class="formula-line">${vn("ZP'")} = −${vn("ZP")} und P' = Z ⊕ ${vn("ZP'")}, also P'(2z₁ − x | 2z₂ − y).</p>
    <div class="example"><strong>Beispiel:</strong> P(5 | 1) wird an Z(2 | 3) gespiegelt.<br>
      1. ${vn("ZP")} = ${vecHtml("5 − 2", "1 − 3")} = ${vecHtml(3, -2)}<br>
      2. Gegenvektor: ${vn("ZP'")} = ${vecHtml(-3, 2)}<br>
      3. P' = Z ⊕ ${vn("ZP'")}: x' = 2 + (−3) = −1 und y' = 3 + 2 = 5, also P'(−1 | 5).<br>
      Probe: Der Mittelpunkt von [PP'] ist ((5 + (−1)) : 2 | (1 + 5) : 2) = (2 | 3), also Z.</div>
    <p><strong>Drehsymmetrische Figuren:</strong> Eine Figur heißt <strong>drehsymmetrisch</strong>, wenn eine Drehung um einen Punkt Z mit 0° &lt; φ &lt; 360° sie auf sich selbst abbildet. Besteht sie aus n gleichen Teilen, die gleichmäßig um Z verteilt sind (ein regelmäßiges n-Eck, ein Stern mit n gleichen Zacken), ist der <strong>kleinste Drehwinkel 360° : n</strong>. Jedes Vielfache davon unter 360° bildet die Figur ebenfalls auf sich ab; das sind n − 1 Drehwinkel. 360° zählt nicht mit, denn eine volle Umdrehung bildet jede Figur auf sich ab.</p>
    <p>Eine Figur ist <strong>punktsymmetrisch</strong>, wenn die Punktspiegelung an Z sie auf sich abbildet, wenn also 180° einer ihrer Drehwinkel ist; Z heißt dann Symmetriezentrum. Ein regelmäßiges n-Eck ist für gerades n punktsymmetrisch, für ungerades n drehsymmetrisch, aber nicht punktsymmetrisch.</p>
    <table class="mini">
      <tr><th>Figur</th><th>kleinster Drehwinkel</th><th>punktsymmetrisch?</th></tr>
      <tr><td>gleichseitiges Dreieck, Windrad mit drei Flügeln</td><td>120°</td><td>nein</td></tr>
      <tr><td>Quadrat, Ventilator mit vier Flügeln</td><td>90°</td><td>ja</td></tr>
      <tr><td>regelmäßiges Fünfeck, Seestern</td><td>72°</td><td>nein</td></tr>
      <tr><td>regelmäßiges Sechseck, Schneeflocke</td><td>60°</td><td>ja</td></tr>
      <tr><td>Parallelogramm, Rechteck, Raute; die Buchstaben N, S, Z</td><td>180°</td><td>ja</td></tr>
    </table>
    <p>Punktsymmetrisch sind auch die Druckbuchstaben H, I, O und X: Nach einer Drehung um 180° sehen sie wieder genauso aus. Die Buchstaben A, T und V sind nur achsensymmetrisch.</p>
    <p>Auch das Muster zählt: Ein Rosettenfenster mit 12 Feldern, die abwechselnd rot und blau sind, deckt sich erst nach zwei Feldern wieder, also nach 360° : 6 = 60°. Das Symmetriezentrum einer punktsymmetrischen Figur ist der Mittelpunkt der Strecke zwischen zwei zugeordneten Punkten, beim Parallelogramm also der Schnittpunkt der Diagonalen (Lektion 1.4: Im Parallelogramm halbieren sich die Diagonalen).</p>
    <p><strong>Typische Fehler:</strong> punktsymmetrisch und achsensymmetrisch verwechseln (das gleichseitige Dreieck hat drei Symmetrieachsen, ist aber nicht punktsymmetrisch), 360° als Drehwinkel mitzählen, beim Spiegeln am Ursprung statt an Z spiegeln oder den Gegenvektor an P statt an Z anhängen.</p>
    <div class="merke"><strong>Merke:</strong> Die Punktspiegelung an Z ist die Drehung um Z mit 180°: Z ist der Mittelpunkt von [PP'], und ${vn("ZP'")} = −${vn("ZP")}. Eine Figur aus n gleichen Teilen um Z ist drehsymmetrisch mit dem kleinsten Drehwinkel 360° : n; sie ist punktsymmetrisch, wenn 180° ein Vielfaches dieses Winkels ist.</div>
  `,
  formulas: [
    { name: "Punktspiegelung an Z", html: "Drehung um Z mit φ = 180°; Z ist der Mittelpunkt von [PP']", quantities: "P' Bildpunkt von P; Gerade und Bildgerade sind parallel" },
    { name: "Bildpunkt", html: `${vn("ZP'")} = −${vn("ZP")}; P' = Z ⊕ ${vn("ZP'")}, also P'(2z₁ − x | 2z₂ − y)`, quantities: "Z(z₁ | z₂) Zentrum, P(x | y) Urpunkt" },
    { name: "Drehsymmetrie", html: "kleinster Drehwinkel α = 360° : n; Drehwinkel α, 2α, …, (n − 1) · α", quantities: "n gleiche Teile, gleichmäßig um das Drehzentrum verteilt" },
    { name: "Punktsymmetrie", html: "180° ist ein Drehwinkel der Figur", quantities: "das Drehzentrum heißt dann Symmetriezentrum" },
  ],
  quiz: {
    question: "Welche dieser Figuren ist punktsymmetrisch?",
    options: ["ein gleichseitiges Dreieck", "ein Parallelogramm", "ein regelmäßiges Fünfeck", "ein Windrad mit drei Flügeln"],
    correctIndex: 1,
    explanation:
      "Punktsymmetrisch heißt: Die Drehung um 180° bildet die Figur auf sich ab. Beim Parallelogramm gelingt das um den Schnittpunkt der Diagonalen. Dreieck, Fünfeck und Windrad haben die kleinsten Drehwinkel 120°, 72° und 120°, und 180° ist kein Vielfaches davon; sie sind drehsymmetrisch, aber nicht punktsymmetrisch.",
  },
  lab: {
    kind: "point-symmetry",
    title: "Labor: Deckt sich die gedrehte Figur?",
    intro:
      "Die gestrichelte Kopie ist um den Drehwinkel φ um Z gedreht. Ziehe die Spitze 1' oder nutze den Regler und finde heraus, bei welchen Winkeln die Kopie die Figur genau überdeckt. Wähle die Zahl der Arme und das Muster.",
    params: [
      { type: "choice", key: "n", label: "Zahl der Arme", options: [2, 3, 4, 5, 6, 8].map((n) => ({ value: n, label: `${n} Arme` })), value: 4 },
      {
        type: "choice",
        key: "muster",
        label: "Muster",
        options: [
          { value: 0, label: "gleiche Arme" },
          { value: 1, label: "Windrad (Arme mit Haken)" },
          { value: 2, label: "zwei Farben abwechselnd" },
        ],
        value: 0,
      },
      { type: "range", key: "phi", label: "Drehwinkel φ", unit: "°", min: 0, max: 360, step: 1, value: 30 },
    ],
    readouts: [
      { key: "anteil", label: "Anteil einer vollen Umdrehung", compute: (v) => (v.phi === 0 ? "0" : v.phi === 360 ? "1 (volle Umdrehung)" : fmtFraction(v.phi)) },
      { key: "arm", label: "Arm 1 landet", compute: (v) => (landingArm(v.n, v.phi) > 0 ? `auf dem Platz von Arm ${landingArm(v.n, v.phi)}` : "zwischen zwei Armen") },
      { key: "deckt", label: "Überdeckt die Kopie die Figur?", emphasis: true, compute: (v) => symmetryText(v.n, v.muster, v.phi) },
    ],
    goals: [
      {
        id: "fuenf",
        text: "Wähle 5 gleiche Arme und finde den kleinsten Drehwinkel über 0°, bei dem sich die Figur selbst überdeckt.",
        check: (v) => v.n === 5 && v.muster !== 2 && v.phi === 72,
      },
      {
        id: "nur-dreh",
        text: "Finde eine Figur, die drehsymmetrisch, aber nicht punktsymmetrisch ist, und stelle einen Drehwinkel ein, bei dem sie sich selbst überdeckt.",
        check: (v) => v.phi > 0 && v.phi < 360 && covers(v.n, v.muster, v.phi) && !isPointSymmetric(v.n, v.muster),
      },
      {
        id: "groesster",
        text: "Eine Figur mit sechs gleichen Armen überdeckt sich bei mehreren Drehwinkeln unter 360°. Stelle den größten davon ein. Wie viele sind es insgesamt?",
        check: (v) => v.n === 6 && v.muster !== 2 && v.phi === 300,
      },
    ],
  },
  exercises: [
    {
      id: "punktspiegelung",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          let z = ORIGIN;
          let p = ORIGIN;
          for (;;) {
            z = vec(rng.int(-4, 4), rng.int(-4, 4));
            p = vec(rng.int(-6, 6), rng.int(-6, 6));
            if (same(z, ORIGIN) || same(p, z)) continue;
            if ((p.x === z.x || p.y === z.y) && rng.next() < 0.8) continue;
            if (reach(sub(add(z, z), p)) > 9) continue;
            break;
          }
          const d = sub(p, z);
          const q = sub(add(z, z), p);
          const atOrigin = "Du hast am Ursprung gespiegelt. Das Zentrum ist Z: Hänge den Gegenvektor von ZP→ an Z an.";
          const atP = "Hänge den Gegenvektor an Z an, nicht den Vektor ZP→ an P.";
          const noSign = "Der Gegenvektor hat bei beiden Koordinaten das andere Vorzeichen.";
          const half = "Z ist der Mittelpunkt von [PP'], nicht P' der Mittelpunkt von [PZ].";
          return {
            prompt: `Spiegle den Punkt P${pt(p)} am Punkt Z${pt(z)}. Berechne die Koordinaten des Bildpunkts P' mit dem Gegenvektor von ${vn("ZP")}.`,
            given: [`P${pt(p)}`, `Z${pt(z)}`],
            formulaHint: `${vn("ZP'")} = −${vn("ZP")} (Gegenvektor); P' = Z ⊕ ${vn("ZP'")}`,
            fields: [
              numberField("P': x' =", q.x, "", 1, { slips: [{ value: -p.x, hint: atOrigin }, { value: 2 * p.x - z.x, hint: atP }, { value: p.x, hint: noSign }, { value: (p.x + z.x) / 2, hint: half }] }),
              numberField("y' =", q.y, "", 1, { slips: [{ value: -p.y, hint: atOrigin }, { value: 2 * p.y - z.y, hint: atP }, { value: p.y, hint: noSign }, { value: (p.y + z.y) / 2, hint: half }] }),
            ],
            steps: [
              `${vn("ZP")} = ${vecHtml(diff(p.x, z.x), diff(p.y, z.y))} = ${colHtml(d)}`,
              `Gegenvektor: ${vn("ZP'")} = ${colHtml(neg(d))}`,
              `P' = Z ⊕ ${vn("ZP'")}: x' = ${fmt(z.x)} + ${paren(-d.x)} = ${fmt(q.x)}, y' = ${fmt(z.y)} + ${paren(-d.y)} = ${fmt(q.y)}`,
              `<strong>P'${pt(q)}</strong>`,
            ],
            meta: { kind: 0, px: p.x, py: p.y, zx: z.x, zy: z.y },
          };
        }
        if (rng.next() < 0.55) {
          // a parallelogram completed from two corners and the centre
          for (;;) {
            const m = vec(rng.int(-2, 2), rng.int(-2, 2));
            const a = add(m, vec(rng.int(-5, -1), rng.int(-4, 1)));
            const b = add(m, vec(rng.int(0, 5), rng.int(-5, -1)));
            const c = sub(add(m, m), a);
            const d = sub(add(m, m), b);
            // ABCD counter-clockwise, at least 6 FE and not flat
            if (!wellShaped([a, b, c, d], 6) || reach(a, b, c, d) > 8) continue;
            const ma = sub(a, m);
            const mb = sub(b, m);
            const swap = "C liegt A gegenüber, D liegt B gegenüber: Spiegle A an M, um C zu erhalten, und B an M für D.";
            return {
              prompt: `Von einem Parallelogramm ABCD kennt man die Eckpunkte A${pt(a)} und B${pt(b)} sowie den Schnittpunkt M${pt(m)} seiner Diagonalen. Berechne die Koordinaten der Eckpunkte C und D.`,
              given: [`A${pt(a)}`, `B${pt(b)}`, `M${pt(m)}`],
              fields: [
                coord("C: x =", c.x, [{ value: d.x, hint: swap }, { value: a.x + 2 * (b.x - a.x), hint: swap }]),
                coord("y =", c.y, [{ value: d.y, hint: swap }]),
                coord("D: x =", d.x, [{ value: c.x, hint: swap }]),
                coord("y =", d.y, [{ value: c.y, hint: swap }]),
              ],
              steps: [
                "Ein Parallelogramm ist punktsymmetrisch zum Schnittpunkt M seiner Diagonalen: Die Punktspiegelung an M bildet A auf C und B auf D ab.",
                `${vn("MA")} = ${colHtml(ma)}, Gegenvektor ${vn("MC")} = ${colHtml(neg(ma))}, also C = M ⊕ ${vn("MC")} = C${pt(c)}.`,
                `${vn("MB")} = ${colHtml(mb)}, Gegenvektor ${vn("MD")} = ${colHtml(neg(mb))}, also D = M ⊕ ${vn("MD")} = D${pt(d)}.`,
                `<strong>C${pt(c)}, D${pt(d)}</strong>`,
              ],
              meta: { kind: 1, ax: a.x, ay: a.y, bx: b.x, by: b.y, mx: m.x, my: m.y },
            };
          }
        }
        // the centre from a point and its image, then one more image
        for (;;) {
          const a = vec(rng.int(-6, 6), rng.int(-6, 6));
          const a1 = vec(rng.int(-6, 6), rng.int(-6, 6));
          const z = midpoint(a, a1);
          const b = vec(rng.int(-5, 5), rng.int(-5, 5));
          const b1 = sub(add(z, z), b);
          if (same(a, a1) || same(b, z) || same(b, a) || same(b, a1) || reach(b1) > 9) continue;
          if (Number.isInteger(z.x) && Number.isInteger(z.y) && rng.next() < 0.4) continue;
          const zb = sub(b, z);
          const midHint = "Das Zentrum ist der Mittelpunkt von [AA']: Addiere die Koordinaten von A und A' und halbiere die Summe.";
          return {
            prompt: `Bei einer Punktspiegelung wird A${pt(a)} auf A'${pt(a1)} abgebildet. Bestimme das Zentrum Z der Punktspiegelung und den Bildpunkt B' von B${pt(b)}.`,
            given: [`A${pt(a)}`, `A'${pt(a1)}`, `B${pt(b)}`],
            fields: [
              numberField("Z: x =", z.x, "", 1, { slips: [{ value: (a1.x - a.x) / 2, hint: midHint }, { value: a1.x - a.x, hint: midHint }] }),
              numberField("y =", z.y, "", 1, { slips: [{ value: (a1.y - a.y) / 2, hint: midHint }, { value: a1.y - a.y, hint: midHint }] }),
              numberField("B': x =", b1.x, "", 1, { slips: [{ value: -b.x, hint: "Gespiegelt wird an Z, nicht am Ursprung." }, { value: b.x + (a1.x - a.x), hint: "Das wäre eine Verschiebung um AA'→. Bei der Punktspiegelung hängst du den Gegenvektor von ZB→ an Z an." }] }),
              numberField("y =", b1.y, "", 1, { slips: [{ value: -b.y, hint: "Gespiegelt wird an Z, nicht am Ursprung." }, { value: b.y + (a1.y - a.y), hint: "Das wäre eine Verschiebung um AA'→. Bei der Punktspiegelung hängst du den Gegenvektor von ZB→ an Z an." }] }),
            ],
            steps: [
              `Z ist der Mittelpunkt von [AA']: Z((${fmt(a.x)} + ${paren(a1.x)}) : 2 | (${fmt(a.y)} + ${paren(a1.y)}) : 2) = Z${pt(z)}.`,
              `${vn("ZB")} = ${vecHtml(diff(b.x, z.x), diff(b.y, z.y))} = ${colHtml(zb)}, Gegenvektor ${vn("ZB'")} = ${colHtml(neg(zb))}.`,
              `B' = Z ⊕ ${vn("ZB'")}: x' = ${fmt(z.x)} + ${paren(-zb.x)} = ${fmt(b1.x)}, y' = ${fmt(z.y)} + ${paren(-zb.y)} = ${fmt(b1.y)}.`,
              `<strong>Z${pt(z)}, B'${pt(b1)}</strong>`,
            ],
            meta: { kind: 2, ax: a.x, ay: a.y, a1x: a1.x, a1y: a1.y, bx: b.x, by: b.y },
          };
        }
      },
    },
    {
      id: "drehsymmetrie",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const star = rng.next() < 0.4;
          const n = star ? rng.pick([4, 5, 6, 8, 9, 10, 12]) : rng.pick([3, 4, 5, 6, 8, 9, 10, 12]);
          const alpha = 360 / n;
          const point = n % 2 === 0;
          const figure = star ? `ein Stern mit ${n} gleichen Zacken` : POLYGON_NAMES[n];
          return {
            prompt: `Gegeben ist ${figure}. Gib den kleinsten Drehwinkel an, mit dem die Figur bei einer Drehung um ihren Mittelpunkt auf sich selbst abgebildet wird, die Anzahl aller solchen Drehwinkel zwischen 0° und 360° und ob die Figur punktsymmetrisch ist.`,
            given: [`${n} gleiche ${star ? "Zacken" : "Ecken und Seiten"}`],
            formulaHint: "kleinster Drehwinkel α = 360° : n; weitere Drehwinkel: 2α, 3α, … unter 360°; punktsymmetrisch, wenn 180° darunter ist",
            fields: [
              numberField("kleinster Drehwinkel: φ =", alpha, "°", 0, { slips: [{ value: 180 / n, hint: "Eine volle Umdrehung hat 360°, nicht 180°: α = 360° : n." }, { value: 360 / (n - 1), hint: `Die ${n} gleichen Teile teilen die volle Umdrehung in ${n} gleiche Winkel: 360° : ${n}.` }] }),
              numberField("Anzahl der Drehwinkel zwischen 0° und 360°:", n - 1, "", 0, { slips: [{ value: n, hint: "360° zählt nicht mit: Nach einer vollen Umdrehung deckt sich jede Figur." }] }),
              choiceField("punktsymmetrisch?", ["ja", "nein"], point ? 0 : 1),
            ],
            steps: [
              `Die Figur besteht aus ${n} gleichen Teilen um ihren Mittelpunkt: kleinster Drehwinkel 360° : ${n} = ${deg(alpha)}.`,
              `Drehwinkel zwischen 0° und 360°: ${anglesList(alpha, n)}, das sind ${n - 1}.`,
              point ? `180° = ${n / 2} · ${deg(alpha)} ist darunter: Die Figur ist punktsymmetrisch.` : `180° ist kein Vielfaches von ${deg(alpha)}: Die Figur ist nicht punktsymmetrisch.`,
              `<strong>φ = ${deg(alpha)}, ${n - 1} Drehwinkel, ${point ? "punktsymmetrisch" : "nicht punktsymmetrisch"}</strong>`,
            ],
            meta: { n, star: star ? 1 : 0 },
          };
        }
        const index = rng.int(0, OBJECTS.length - 1);
        const object = OBJECTS[index];
        const k = object.repeats;
        const alpha = 360 / k;
        const point = k % 2 === 0;
        return {
          prompt: `${object.text} ${object.question} Wie viele Drehwinkel zwischen 0° und 360° bilden das Muster auf sich selbst ab, und ist es punktsymmetrisch?`,
          given: [object.text],
          fields: [
            numberField("kleinster Drehwinkel: φ =", alpha, "°", 0, { slips: object.naive ? [{ value: object.naive, hint: object.naiveHint ?? "" }] : [{ value: 180 / k, hint: "Eine volle Umdrehung hat 360°, nicht 180°." }] }),
            numberField("Anzahl der Drehwinkel zwischen 0° und 360°:", k - 1, "", 0, {
              slips: [{ value: k, hint: "360° zählt nicht mit: Nach einer vollen Umdrehung deckt sich jede Figur." }, ...(object.naive ? [{ value: 360 / object.naive - 1, hint: object.naiveHint ?? "" }] : [])],
            }),
            choiceField("punktsymmetrisch?", ["ja", "nein"], point ? 0 : 1),
          ],
          steps: [
            object.naive
              ? `${object.naiveHint} Das Muster wiederholt sich also ${k}-mal um die Mitte, und der kleinste Drehwinkel ist 360° : ${k} = ${deg(alpha)}.`
              : `Die ${k} gleichen Teile teilen die volle Umdrehung: kleinster Drehwinkel 360° : ${k} = ${deg(alpha)}.`,
            `Weitere Drehwinkel sind die Vielfachen von ${deg(alpha)} unter 360°: zusammen ${k - 1}.`,
            point ? `180° = ${k / 2} · ${deg(alpha)} ist ein Drehwinkel: punktsymmetrisch.` : `180° ist kein Vielfaches von ${deg(alpha)}: nicht punktsymmetrisch.`,
            `<strong>${object.answer(alpha)} Es gibt ${k - 1} Drehwinkel unter 360°; ${point ? "das Muster ist punktsymmetrisch" : "punktsymmetrisch ist es nicht"}.</strong>`,
          ],
          meta: { index, repeats: k },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du spiegelst Punkte an einem Zentrum und bestimmst Drehwinkel und Symmetriezentrum symmetrischer Figuren.",
};

/** φ : 360° as a reduced fraction, "1/5". */
function fmtFraction(phi: number): string {
  const g = gcdInt(phi, 360);
  return `${phi / g}/${360 / g}`;
}

function gcdInt(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

// 2.3 Vektoren drehen ────────────────────────────────────────────────────────

/** The rule of an angle with the letters x and y, as HTML. */
const RULE_HTML: Record<number, string> = {
  90: `${vecHtml("x", "y")} ↦ ${vecHtml("−y", "x")}`,
  [-90]: `${vecHtml("x", "y")} ↦ ${vecHtml("y", "−x")}`,
  180: `${vecHtml("x", "y")} ↦ ${vecHtml("−x", "−y")}`,
};

/** The rule with the numbers put in: (−(−2); 3). */
function ruleWithNumbers(v: Vec, phi: number): string {
  const minus = (k: number) => (k < 0 ? `−(${fmt(k)})` : `−${fmt(k)}`);
  if (phi === 90) return vecHtml(minus(v.y), fmt(v.x));
  if (phi === -90) return vecHtml(fmt(v.y), minus(v.x));
  return vecHtml(minus(v.x), minus(v.y));
}

/** The slips of a turned vector, per coordinate: swapped without a sign, the other direction. */
function turnSlips(v: Vec, phi: number): { x: Array<{ value: number; hint: string }>; y: Array<{ value: number; hint: string }> } {
  if (phi === 180) {
    const hint = "Bei 180° werden die Koordinaten nicht getauscht; beide wechseln nur das Vorzeichen.";
    return { x: [{ value: -v.y, hint }], y: [{ value: -v.x, hint }] };
  }
  const swap = phi === 90 ? "Bei +90° tauschen die Koordinaten die Plätze, und die neue x-Koordinate bekommt das andere Vorzeichen: Aus x und y werden −y und x." : "Bei −90° tauschen die Koordinaten die Plätze, und die neue y-Koordinate bekommt das andere Vorzeichen: Aus x und y werden y und −x.";
  const other = phi === 90 ? "Das Minus steht bei +90° vor der neuen x-Koordinate, nicht vor der y-Koordinate; so dreht man um −90°." : "Das Minus steht bei −90° vor der neuen y-Koordinate, nicht vor der x-Koordinate; so dreht man um +90°.";
  if (phi === 90) return { x: [{ value: v.y, hint: swap }], y: [{ value: -v.x, hint: other }] };
  return { x: [{ value: -v.y, hint: other }], y: [{ value: v.x, hint: swap }] };
}

const vektoren: Lesson = {
  id: "dr-3-vektoren",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "2.3 Vektoren drehen",
  subtitle: "Koordinaten nach einer Drehung um +90°, −90° und 180°",
  tracks: ["I"],
  lehrplan: `${LP}: Vektoren um ±90° und 180° drehen`,
  whyItMatters:
    "Mit gedrehten Vektoren berechnest du die Ecken von Quadraten und gedrehten Figuren, ohne zu zeichnen. Solche Aufgaben kommen in Prüfungen immer wieder vor, wenn Figuren im Koordinatensystem gedreht oder Quadrate aus zwei Ecken ergänzt werden.",
  explanationHtml: `
    <p><strong>Wiederholung aus M7:</strong> Ein Vektor ${vn("v")} = ${vecHtml("x", "y")} sagt, wie weit man nach rechts (x) und nach oben (y) geht. Den Vektor zwischen zwei Punkten berechnest du mit „Spitze minus Schaft“, und P ⊕ ${vn("v")} hängt ${vn("v")} an den Punkt P an.</p>
    <p><strong>Warum die Koordinaten die Plätze tauschen:</strong> Zeichne zu ${vn("v")} = ${vecHtml(3, 1)} den Weg auf dem Gitter: 3 Kästchen nach rechts, dann 1 nach oben. Zusammen mit dem Pfeil von ${vn("v")} bildet dieser Kästchenweg ein rechtwinkliges Dreieck. Dreht man das ganze Dreieck um 90° gegen den Uhrzeigersinn, wird aus „3 nach rechts“ der Weg „3 nach oben“ und aus „1 nach oben“ der Weg „1 nach links“. Der Bildvektor ist ${vecHtml(-1, 3)}: Die Koordinaten tauschen die Plätze, und die neue x-Koordinate bekommt das andere Vorzeichen.</p>
    <table class="mini">
      <tr><th>Drehwinkel</th><th>Bildvektor von ${vecHtml("x", "y")}</th><th>Beispiel ${vecHtml(3, 1)}</th></tr>
      <tr><td>+90° (gegen den Uhrzeigersinn)</td><td>${vecHtml("−y", "x")}</td><td>${vecHtml(-1, 3)}</td></tr>
      <tr><td>−90° (im Uhrzeigersinn)</td><td>${vecHtml("y", "−x")}</td><td>${vecHtml(1, -3)}</td></tr>
      <tr><td>180°</td><td>${vecHtml("−x", "−y")}</td><td>${vecHtml(-3, -1)}</td></tr>
    </table>
    <p>Zweimal um +90° gedreht sind 180°: ${vecHtml(3, 1)} ↦ ${vecHtml(-1, 3)} ↦ ${vecHtml(-3, -1)}, der Gegenvektor. Die Drehung um −90° macht die Drehung um +90° rückgängig.</p>
    <p><strong>Punkte um ein Zentrum Z drehen:</strong> Gedreht wird nicht der Punkt selbst, sondern der Pfeil von Z nach P.</p>
    <ol class="steps">
      <li>${vn("ZP")} mit „Spitze minus Schaft“ berechnen.</li>
      <li>${vn("ZP")} mit der Regel drehen, das ergibt ${vn("ZP'")}.</li>
      <li>${vn("ZP'")} an Z anhängen: P' = Z ⊕ ${vn("ZP'")}.</li>
    </ol>
    <div class="example"><strong>Beispiel:</strong> P(5 | 3) wird um Z(2 | 1) mit φ = 90° gedreht.<br>
      1. ${vn("ZP")} = ${vecHtml("5 − 2", "3 − 1")} = ${vecHtml(3, 2)}<br>
      2. ${vn("ZP'")} = ${vecHtml(-2, 3)}<br>
      3. P' = Z ⊕ ${vn("ZP'")}: x' = 2 + (−2) = 0 und y' = 1 + 3 = 4, also P'(0 | 4).<br>
      Probe am Gitter: Von Z nach P geht es 3 nach rechts und 2 nach oben, von Z nach P' 2 nach links und 3 nach oben.</div>
    <p><strong>Quadrate aus zwei Ecken:</strong> Folgen die Ecken des Quadrats ABCD gegen den Uhrzeigersinn aufeinander, entsteht ${vn("AD")} aus ${vn("AB")} durch eine Drehung um +90°. Dann ist D = A ⊕ ${vn("AD")} und C = B ⊕ ${vn("AD")}, denn ${vn("BC")} = ${vn("AD")}. Für A(1 | 1) und B(4 | 2) ist ${vn("AB")} = ${vecHtml(3, 1)} und ${vn("AD")} = ${vecHtml(-1, 3)}, also D(0 | 4) und C(3 | 5). Folgen die Ecken im Uhrzeigersinn, drehst du ${vn("AB")} um −90°.</p>
    <p><strong>Typische Fehler:</strong> nur tauschen und das Vorzeichen vergessen (aus ${vecHtml(3, 1)} wird ${vecHtml(1, 3)}: Das ist eine Achsenspiegelung an der Geraden y = x, keine Drehung), das Minus an die falsche Koordinate setzen (das ergibt die Drehung in die andere Richtung) und den Punkt P statt des Vektors ${vn("ZP")} drehen, also Z vergessen.</p>
    <div class="merke"><strong>Merke:</strong> +90°: ${vecHtml("x", "y")} ↦ ${vecHtml("−y", "x")}; −90°: ${vecHtml("x", "y")} ↦ ${vecHtml("y", "−x")}; 180°: ${vecHtml("x", "y")} ↦ ${vecHtml("−x", "−y")}. Einen Punkt drehst du um Z, indem du ${vn("ZP")} drehst und an Z anhängst: P' = Z ⊕ ${vn("ZP'")}.</div>
  `,
  formulas: [
    { name: "Drehung um +90°", html: RULE_HTML[90], quantities: "gegen den Uhrzeigersinn: tauschen, neue x-Koordinate mit anderem Vorzeichen" },
    { name: "Drehung um −90°", html: RULE_HTML[-90], quantities: "im Uhrzeigersinn: tauschen, neue y-Koordinate mit anderem Vorzeichen" },
    { name: "Drehung um 180°", html: RULE_HTML[180], quantities: "der Gegenvektor, wie bei der Punktspiegelung" },
    { name: "Punkt um Z drehen", html: `${vn("ZP")} drehen ergibt ${vn("ZP'")}; P' = Z ⊕ ${vn("ZP'")}`, quantities: "Z Drehzentrum, P Urpunkt, P' Bildpunkt" },
  ],
  quiz: {
    question: "Der Vektor v→ mit den Koordinaten x = 4 und y = −1 wird um −90° gedreht. Welche Koordinaten hat der Bildvektor?",
    options: ["x = −1 und y = −4", "x = 1 und y = 4", "x = −1 und y = 4", "x = −4 und y = 1"],
    correctIndex: 0,
    explanation:
      "Bei −90° wird aus x und y das Paar y und −x: aus 4 und −1 also −1 und −4. Die Koordinaten 1 und 4 gehören zur Drehung um +90°, −1 und 4 sind nur vertauscht, und −4 und 1 sind der Gegenvektor (180°).",
  },
  lab: {
    kind: "vector-rotation",
    title: "Labor: Vektoren drehen",
    intro:
      "Wähle, was gedreht wird: ein Vektor am Ursprung, ein fester Punkt P um ein Zentrum Z oder die Seite AB eines Quadrats. Die gestrichelten Kästchenwege an den Pfeilen (erst nach rechts oder links, dann nach oben oder unten) zeigen, wie die Koordinaten beim Drehen die Plätze tauschen; rechts steht die Rechnung.",
    params: [
      {
        type: "choice",
        key: "mode",
        label: "Was wird gedreht?",
        options: [
          { value: 0, label: "Vektor v am Ursprung" },
          { value: 1, label: "Punkt P um ein Zentrum Z" },
          { value: 2, label: "Quadrat ABCD aus A und B" },
        ],
        value: 0,
      },
      {
        type: "choice",
        key: "phi",
        label: "Drehwinkel (+ gegen, − im Uhrzeigersinn)",
        options: [
          { value: 90, label: "+90°" },
          { value: -90, label: "−90°" },
          { value: 180, label: "180°" },
        ],
        value: 90,
        showIf: (v) => v.mode !== 2,
      },
      { type: "range", key: "vx", label: "x von v", unit: "", min: -5, max: 5, step: 1, value: 3, showIf: (v) => v.mode === 0 },
      { type: "range", key: "vy", label: "y von v", unit: "", min: -5, max: 5, step: 1, value: 1, showIf: (v) => v.mode === 0 },
      { type: "range", key: "zx", label: "x von Z", unit: "", min: -5, max: 5, step: 0.5, value: -2, digits: 1, showIf: (v) => v.mode === 1 },
      { type: "range", key: "zy", label: "y von Z", unit: "", min: -5, max: 5, step: 0.5, value: -1, digits: 1, showIf: (v) => v.mode === 1 },
      { type: "range", key: "bx", label: "x von B", unit: "", min: -5, max: 5, step: 1, value: -1, showIf: (v) => v.mode === 2 },
      { type: "range", key: "by", label: "y von B", unit: "", min: -5, max: 5, step: 1, value: -4, showIf: (v) => v.mode === 2 },
    ],
    readouts: [
      { key: "vorher", label: "Vektor vor der Drehung", compute: (v) => vectorReadouts(v).before },
      { key: "nachher", label: "gedrehter Vektor", emphasis: true, compute: (v) => vectorReadouts(v).after },
      { key: "punkte", label: "Bildpunkte", compute: (v) => vectorReadouts(v).points },
    ],
    goals: [
      {
        id: "umkehren",
        text: "Finde den Vektor v, dessen Bild bei der Drehung um +90° genau der grüne Vektor w ist. Wie erhältst du v aus w?",
        check: (v) => v.mode === 0 && v.phi === 90 && same(vectorLab(v).after, W_TARGET),
      },
      {
        id: "zentrum",
        text: "Drehe den festen Punkt P(4 | 1) um ein Zentrum Z so, dass P' genau auf T(−1 | 2) landet. Gelingt es mit jedem der drei Drehwinkel, und wo liegt Z dann?",
        check: (v) => v.mode === 1 && same(vectorLab(v).result[0], T_POINT),
      },
      {
        id: "quadrat",
        text: "Ziehe B so, dass die Ecke C des Quadrats ABCD genau auf T(2 | 2) liegt.",
        check: (v) => v.mode === 2 && same(vectorLab(v).result[0], T_CORNER),
      },
    ],
  },
  exercises: [
    {
      id: "vektor",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          let v = ORIGIN;
          do {
            v = vec(nonZero(rng, 6), nonZero(rng, 6));
          } while (Math.abs(v.x) === Math.abs(v.y));
          const phi = rng.pick([90, -90, 180]);
          const w = turn(v, phi);
          const slips = turnSlips(v, phi);
          return {
            prompt: `Drehe den Vektor ${vn("v")} = ${colHtml(v)} um φ = ${ruleAngle(phi)}${phi === 180 ? "" : ` (${dirWord(phi)})`}. Gib die Koordinaten des Bildvektors ${vn("v'")} an.`,
            given: [`${vn("v")} = ${colHtml(v)}`, `φ = ${ruleAngle(phi)}`],
            formulaHint: `${ruleAngle(phi)}: ${RULE_HTML[phi]}`,
            fields: [coord("x' =", w.x, slips.x), coord("y' =", w.y, slips.y)],
            steps: [
              `Regel für ${ruleAngle(phi)}: ${RULE_HTML[phi]}`,
              `Mit x = ${fmt(v.x)} und y = ${fmt(v.y)}: ${vn("v'")} = ${ruleWithNumbers(v, phi)} = ${colHtml(w)}`,
              `<strong>${vn("v'")} = ${colHtml(w)}</strong>`,
            ],
            meta: { kind: 0, vx: v.x, vy: v.y, phi },
          };
        }
        if (rng.next() < 0.6) {
          // a triangle turned about its corner A
          for (;;) {
            const a = vec(rng.int(-4, 4), rng.int(-4, 4));
            const ab = vec(rng.int(-4, 4), rng.int(-4, 4));
            const ac = vec(rng.int(-4, 4), rng.int(-4, 4));
            if ((ab.x === 0 && ab.y === 0) || (ac.x === 0 && ac.y === 0)) continue;
            if (same(a, ORIGIN)) continue;
            const phi = rng.pick([90, -90, 180]);
            const b = add(a, ab);
            const c = add(a, ac);
            // ABC counter-clockwise and not flat
            if (!wellShaped([a, b, c], 3)) continue;
            const b1 = add(a, turn(ab, phi));
            const c1 = add(a, turn(ac, phi));
            if (reach(a, b, c, b1, c1) > 8) continue;
            const aboutO = (p: Vec) => turn(p, phi);
            const forgot = "Du hast um den Ursprung gedreht. Drehe den Vektor von A zum Punkt und hänge ihn an A an.";
            const other = phi === 180 ? null : (p: Vec) => add(a, turn(sub(p, a), -phi));
            const way = "Prüfe die Drehrichtung: +90° gegen den Uhrzeigersinn, −90° im Uhrzeigersinn.";
            return {
              prompt: `Das Dreieck ABC mit A${pt(a)}, B${pt(b)} und C${pt(c)} wird um seine Ecke A mit φ = ${ruleAngle(phi)} gedreht. Berechne die Koordinaten der Bildpunkte B' und C'.`,
              given: [`A${pt(a)}, B${pt(b)}, C${pt(c)}`, `Drehzentrum A, φ = ${ruleAngle(phi)}`],
              fields: [
                coord("B': x =", b1.x, [{ value: aboutO(b).x, hint: forgot }, other && { value: other(b).x, hint: way }]),
                coord("y =", b1.y, [{ value: aboutO(b).y, hint: forgot }, other && { value: other(b).y, hint: way }]),
                coord("C': x =", c1.x, [{ value: aboutO(c).x, hint: forgot }, other && { value: other(c).x, hint: way }]),
                coord("y =", c1.y, [{ value: aboutO(c).y, hint: forgot }, other && { value: other(c).y, hint: way }]),
              ],
              steps: [
                `Das Drehzentrum ist A, A bleibt liegen. ${vn("AB")} = ${colHtml(ab)}, ${vn("AC")} = ${colHtml(ac)}.`,
                `Um ${ruleAngle(phi)} gedreht (${RULE_HTML[phi]}): ${vn("AB'")} = ${colHtml(turn(ab, phi))}, ${vn("AC'")} = ${colHtml(turn(ac, phi))}.`,
                `B' = A ⊕ ${vn("AB'")} = B'${pt(b1)}, C' = A ⊕ ${vn("AC'")} = C'${pt(c1)}.`,
                `<strong>B'${pt(b1)}, C'${pt(c1)}</strong>`,
              ],
              meta: { kind: 1, ax: a.x, ay: a.y, bx: b.x, by: b.y, cx: c.x, cy: c.y, phi },
            };
          }
        }
        // the Urpunkt: turn ZP'→ back
        for (;;) {
          const z = vec(rng.int(-3, 3), rng.int(-3, 3));
          const zq = vec(rng.int(-5, 5), rng.int(-5, 5));
          if (zq.x === 0 || zq.y === 0 || Math.abs(zq.x) === Math.abs(zq.y)) continue;
          const phi = rng.pick([90, -90]);
          const q = add(z, zq);
          const zp = turn(zq, -phi);
          const p = add(z, zp);
          if (reach(p, q) > 8) continue;
          const further = add(z, turn(zq, phi));
          const back = phi === 90 ? "−90°" : "+90°";
          const hint = `Du hast P' noch einmal um ${ruleAngle(phi)} gedreht. Für den Urpunkt drehst du ${"ZP'→"} zurück, also um ${back}.`;
          return {
            prompt: `Bei einer Drehung um Z${pt(z)} mit φ = ${ruleAngle(phi)} entsteht der Bildpunkt P'${pt(q)}. Berechne die Koordinaten des Urpunkts P.`,
            given: [`Z${pt(z)}`, `φ = ${ruleAngle(phi)}`, `P'${pt(q)}`],
            fields: [
              coord("P: x =", p.x, [{ value: further.x, hint }, { value: turn(q, -phi).x, hint: "Drehe den Vektor von Z nach P' und hänge ihn an Z an, nicht den Punkt um den Ursprung." }]),
              coord("y =", p.y, [{ value: further.y, hint }, { value: turn(q, -phi).y, hint: "Drehe den Vektor von Z nach P' und hänge ihn an Z an, nicht den Punkt um den Ursprung." }]),
            ],
            steps: [
              `Die Umkehrabbildung ist die Drehung um Z mit ${back}: Sie bringt P' zurück nach P.`,
              `${vn("ZP'")} = ${vecHtml(diff(q.x, z.x), diff(q.y, z.y))} = ${colHtml(zq)}`,
              `Um ${back} gedreht (${RULE_HTML[-phi]}): ${vn("ZP")} = ${colHtml(zp)}`,
              `P = Z ⊕ ${vn("ZP")}: x = ${fmt(z.x)} + ${paren(zp.x)} = ${fmt(p.x)}, y = ${fmt(z.y)} + ${paren(zp.y)} = ${fmt(p.y)}`,
              `<strong>P${pt(p)}</strong>`,
            ],
            meta: { kind: 2, zx: z.x, zy: z.y, qx: q.x, qy: q.y, phi },
          };
        }
      },
    },
    {
      id: "figur",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          for (;;) {
            const a = vec(rng.int(-4, 3), rng.int(-4, 3));
            const ab = vec(rng.int(-4, 4), rng.int(-4, 4));
            if (ab.x === 0 && ab.y === 0) continue;
            if ((ab.x === 0 || ab.y === 0) && rng.next() < 0.8) continue;
            const clockwise = rng.next() < 0.3;
            const phi = clockwise ? -90 : 90;
            const ad = turn(ab, phi);
            const b = add(a, ab);
            const d = add(a, ad);
            const c = add(b, ad);
            if (reach(a, b, c, d) > 8) continue;
            const wrong = add(a, turn(ab, -phi));
            const way = clockwise ? "Im Uhrzeigersinn entsteht AD→ aus AB→ durch eine Drehung um −90°." : "Gegen den Uhrzeigersinn entsteht AD→ aus AB→ durch eine Drehung um +90°.";
            const swap = "C liegt A gegenüber: C = B ⊕ AD→, D = A ⊕ AD→.";
            return {
              prompt: `A${pt(a)} und B${pt(b)} sind benachbarte Eckpunkte des Quadrats ABCD, dessen Ecken ${clockwise ? "im" : "gegen den"} Uhrzeigersinn aufeinander folgen. Berechne die Koordinaten von D und C.`,
              given: [`A${pt(a)}`, `B${pt(b)}`, `Ecken ${clockwise ? "im" : "gegen den"} Uhrzeigersinn`],
              formulaHint: `${vn("AD")} = ${vn("AB")} um ${ruleAngle(phi)} gedreht (${RULE_HTML[phi]}); D = A ⊕ ${vn("AD")}, C = B ⊕ ${vn("AD")}`,
              fields: [
                coord("D: x =", d.x, [{ value: wrong.x, hint: way }, { value: c.x, hint: swap }]),
                coord("y =", d.y, [{ value: wrong.y, hint: way }, { value: c.y, hint: swap }]),
                coord("C: x =", c.x, [{ value: d.x, hint: swap }, { value: add(b, turn(ab, -phi)).x, hint: way }]),
                coord("y =", c.y, [{ value: d.y, hint: swap }, { value: add(b, turn(ab, -phi)).y, hint: way }]),
              ],
              steps: [
                `${vn("AB")} = ${vecHtml(diff(b.x, a.x), diff(b.y, a.y))} = ${colHtml(ab)}`,
                `${vn("AD")} = ${vn("AB")} um ${ruleAngle(phi)} gedreht: ${colHtml(ad)}`,
                `D = A ⊕ ${vn("AD")} = D${pt(d)}, C = B ⊕ ${vn("AD")} = C${pt(c)}`,
                `<strong>D${pt(d)}, C${pt(c)}</strong>`,
              ],
              meta: { kind: 0, ax: a.x, ay: a.y, bx: b.x, by: b.y, clockwise: clockwise ? 1 : 0 },
            };
          }
        }
        if (rng.next() < 0.55) {
          // a square from one corner and its centre: turn MA→ about M
          for (;;) {
            const m = vec(rng.int(-2, 2), rng.int(-2, 2));
            const ma = vec(rng.int(-4, 4), rng.int(-4, 4));
            if (ma.x === 0 && ma.y === 0) continue;
            if ((ma.x === 0 || ma.y === 0 || Math.abs(ma.x) === Math.abs(ma.y)) && rng.next() < 0.8) continue;
            const a = add(m, ma);
            const b = add(m, turn(ma, 90));
            const c = add(m, turn(ma, 180));
            const d = add(m, turn(ma, -90));
            if (reach(a, b, c, d) > 8) continue;
            const turnHint = "Die Diagonalen eines Quadrats sind gleich lang, halbieren sich und stehen senkrecht: MB→ entsteht aus MA→ durch eine Drehung um +90°, MD→ durch eine um −90°.";
            return {
              prompt: `Die Ecken des Quadrats ABCD folgen gegen den Uhrzeigersinn aufeinander. Sein Diagonalenschnittpunkt ist M${pt(m)}, eine Ecke ist A${pt(a)}. Berechne die Koordinaten der Ecken B, C und D.`,
              given: [`M${pt(m)}`, `A${pt(a)}`, "Ecken gegen den Uhrzeigersinn"],
              fields: [
                coord("B: x =", b.x, [{ value: d.x, hint: turnHint }]),
                coord("y =", b.y, [{ value: d.y, hint: turnHint }]),
                coord("C: x =", c.x, [{ value: -a.x, hint: "C entsteht durch die Punktspiegelung von A an M, nicht am Ursprung." }]),
                coord("y =", c.y, [{ value: -a.y, hint: "C entsteht durch die Punktspiegelung von A an M, nicht am Ursprung." }]),
                coord("D: x =", d.x, [{ value: b.x, hint: turnHint }]),
                coord("y =", d.y, [{ value: b.y, hint: turnHint }]),
              ],
              steps: [
                `Die Diagonalen des Quadrats sind gleich lang, halbieren sich und stehen senkrecht aufeinander: B, C und D entstehen aus A durch Drehungen um M mit +90°, 180° und −90°. ${vn("MA")} = ${colHtml(ma)}.`,
                `${vn("MB")} = ${colHtml(turn(ma, 90))} (+90°), ${vn("MC")} = ${colHtml(turn(ma, 180))} (180°), ${vn("MD")} = ${colHtml(turn(ma, -90))} (−90°)`,
                `Jeweils an M angehängt: B${pt(b)}, C${pt(c)}, D${pt(d)}`,
                `<strong>B${pt(b)}, C${pt(c)}, D${pt(d)}</strong>`,
              ],
              meta: { kind: 1, mx: m.x, my: m.y, ax: a.x, ay: a.y },
            };
          }
        }
        // a rectangle whose side [AD] is twice as long as [AB]
        for (;;) {
          const a = vec(rng.int(-4, 2), rng.int(-5, 0));
          const ab = vec(rng.int(-3, 3), rng.int(-3, 3));
          if (ab.x === 0 && ab.y === 0) continue;
          if ((ab.x === 0 || ab.y === 0) && rng.next() < 0.8) continue;
          const turned = turn(ab, 90);
          const ad = vec(2 * turned.x, 2 * turned.y);
          const b = add(a, ab);
          const d = add(a, ad);
          const c = add(b, ad);
          if (reach(a, b, c, d) > 9) continue;
          const once = add(a, turned);
          const half = "[AD] ist doppelt so lang wie [AB]: Verdopple beide Koordinaten des gedrehten Vektors.";
          return {
            prompt: `Das Rechteck ABCD hat die Eckpunkte A${pt(a)} und B${pt(b)}; seine Ecken folgen gegen den Uhrzeigersinn aufeinander, und die Seite [AD] ist doppelt so lang wie die Seite [AB]. Berechne die Koordinaten von C und D.`,
            given: [`A${pt(a)}`, `B${pt(b)}`, `${len("AD")} = 2 · ${len("AB")}, Ecken gegen den Uhrzeigersinn`],
            fields: [
              coord("C: x =", c.x, [{ value: add(b, turned).x, hint: half }]),
              coord("y =", c.y, [{ value: add(b, turned).y, hint: half }]),
              coord("D: x =", d.x, [{ value: once.x, hint: half }, { value: add(a, vec(-2 * turned.x, -2 * turned.y)).x, hint: "Gegen den Uhrzeigersinn: Drehe AB→ um +90°." }]),
              coord("y =", d.y, [{ value: once.y, hint: half }, { value: add(a, vec(-2 * turned.x, -2 * turned.y)).y, hint: "Gegen den Uhrzeigersinn: Drehe AB→ um +90°." }]),
            ],
            steps: [
              `${vn("AB")} = ${colHtml(ab)}; um +90° gedreht: ${colHtml(turned)}. Dieser Vektor ist so lang wie [AB] und steht senkrecht darauf.`,
              `[AD] ist doppelt so lang: ${vn("AD")} = ${vecHtml(`2 · ${paren(turned.x)}`, `2 · ${paren(turned.y)}`)} = ${colHtml(ad)}`,
              `D = A ⊕ ${vn("AD")} = D${pt(d)}, C = B ⊕ ${vn("AD")} = C${pt(c)}`,
              `<strong>C${pt(c)}, D${pt(d)}</strong>`,
            ],
            meta: { kind: 2, ax: a.x, ay: a.y, bx: b.x, by: b.y },
          };
        }
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du drehst Vektoren um ±90° und 180°, drehst Punkte um ein Zentrum und ergänzt Quadrate aus zwei Ecken.",
};

export const STAGE_DREHUNG: Stage = {
  id: "stage-2-drehung",
  stageNumber: 2,
  title: "Drehung",
  subtitle: "Drehzentrum, Drehwinkel, Punktspiegelung, Drehsymmetrie und gedrehte Vektoren",
  icon: "🔄",
  accent: "#7c3aed",
  badgeTitle: "Drehprofi",
  lehrplanLabel: "LB 2 (nur Zweig I)",
  lessons: [drehung, punktspiegelung, vektoren],
};

