import { fmt, fmtUnit, frac, quadratic, sqrtHtml } from "../exercises/format";
import {
  axialArea,
  axialBody,
  axialPerimeter,
  axialSectionName,
  axialSlant,
  cavalieri,
  compositeSolid,
  extremumAt,
  extremumBest,
  extremumBound,
  extremumInDomain,
  extremumX,
  solidNet,
} from "../lab/views-raumgeometrie";
import type { ExerciseTask, LabValues, Lesson, Stage } from "../model/types";
import { choiceField, near, numberField, within } from "./helpers";

const STAGE_ID = "stage-6-raumgeometrie";
const LP = "M10 LB 2 (II/III): Raumgeometrie";
const PI = Math.PI;
const THIRD = "⅓";

// 6.1 Rotationskörper und Axialschnitte ─────────────────────────────────────

const AXIAL_FIGURES = ["Rechteck", "rechtwinkliges Dreieck", "Halbkreis", "rechtwinkliges Trapez", "Rechteck mit Dreieck"];
const BODIES = ["Zylinder", "Kegel", "Kugel", "Kegelstumpf"];
const BODY_WITH_ARTICLE = ["ein Zylinder", "ein Kegel", "eine Kugel", "ein Kegelstumpf"];

const axialschnitt: Lesson = {
  id: "rg-1-axialschnitt",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "6.1 Rotationskörper und Axialschnitte",
  subtitle: "Eine Figur dreht sich um die Achse",
  tracks: ["II_III"],
  lehrplan: `${LP}, Rotationskörper und Axialschnitte`,
  whyItMatters:
    "Vasen, Kreisel, Schrauben und Silos entstehen an der Drehbank: Eine ebene Figur dreht sich um eine Achse. Schneidet man den Körper längs dieser Achse auf, zeigt der Axialschnitt alle Maße, die du zum Rechnen brauchst.",
  explanationHtml: `
    <p>Dreht sich eine ebene Figur einmal ganz (360°) um eine Gerade ihrer Ebene, die <strong>Rotationsachse</strong>, entsteht ein <strong>Rotationskörper</strong>. Jeder Punkt der Figur läuft dabei auf einem Kreis um die Achse.</p>
    <table class="mini">
      <tr><th>Figur (an der Achse)</th><th>Körper</th><th>Axialschnitt</th></tr>
      <tr><td>Rechteck, eine Seite auf der Achse</td><td>Zylinder</td><td>Rechteck 2r × h</td></tr>
      <tr><td>rechtwinkliges Dreieck, eine Kathete auf der Achse</td><td>Kegel</td><td>gleichschenkliges Dreieck</td></tr>
      <tr><td>Halbkreis, Durchmesser auf der Achse</td><td>Kugel</td><td>Kreis</td></tr>
      <tr><td>rechtwinkliges Trapez, Schenkel auf der Achse</td><td>Kegelstumpf</td><td>gleichschenkliges Trapez</td></tr>
    </table>
    <p>Der <strong>Axialschnitt</strong> ist die Schnittfläche, wenn man den Körper längs der Achse durchschneidet. Er besteht aus der Figur und ihrem <strong>Spiegelbild an der Achse</strong>, denn nach einer halben Drehung (180°) liegt die Figur genau gegenüber. Die Achse ist seine Symmetrieachse.</p>
    <ul>
      <li>Aus dem Axialschnitt liest du die Maße ab: r ist die halbe Breite, h die Höhe, die <strong>Mantellinie s</strong> ist der schräge Rand.</li>
      <li>Beim Kegel bilden r, h und s im halben Axialschnitt ein rechtwinkliges Dreieck: <strong>s² = r² + h²</strong>.</li>
      <li>Setzt sich die Figur aus Teilen zusammen, entsteht ein <strong>zusammengesetzter Rotationskörper</strong>: Rechteck mit aufgesetztem Dreieck ergibt einen Zylinder mit Kegelspitze. Ein Rechteck, das die Achse nicht berührt, ergibt ein Rohr.</li>
    </ul>
    <div class="example">Beispiel: Der Axialschnitt eines Kegels ist ein gleichschenkliges Dreieck mit der Grundseite 10 cm und den Schenkeln 13 cm. Also ist r = 5 cm, s = 13 cm und h = ${sqrtHtml("13² − 5²")} cm = ${sqrtHtml("144")} cm = 12 cm. Die erzeugende Figur ist das rechtwinklige Dreieck mit den Katheten 5 cm und 12 cm.</div>
    <div class="merke"><strong>Merke:</strong> Axialschnitt = Figur + Spiegelbild an der Achse. Er ist 2r breit und h hoch; beim Kegel gilt s = ${sqrtHtml("r² + h²")}.</div>
  `,
  formulas: [
    { name: "Axialschnitt", html: "Zylinder: Rechteck 2r × h · Kegel: Dreieck mit Grundseite 2r und Höhe h · Kugel: Kreis mit Radius r", quantities: "Figur und ihr Spiegelbild an der Achse" },
    { name: "Mantellinie des Kegels", html: `s = ${sqrtHtml("r² + h²")}`, quantities: "r Radius, h Höhe, s schräger Rand des Axialschnitts" },
    { name: "Flächeninhalt des Axialschnitts", html: "Zylinder: A = 2r · h · Kegel: A = r · h", quantities: "doppelt so groß wie die erzeugende Figur" },
  ],
  quiz: {
    question: "Ein Halbkreis dreht sich einmal um seinen Durchmesser. Welcher Körper entsteht, und wie sieht sein Axialschnitt aus?",
    options: ["eine Kugel; der Axialschnitt ist ein Kreis", "eine Halbkugel; der Axialschnitt ist ein Halbkreis", "ein Kegel; der Axialschnitt ist ein Dreieck", "ein Zylinder; der Axialschnitt ist ein Rechteck"],
    correctIndex: 0,
    explanation: "Jeder Punkt des Halbkreises läuft auf einem Kreis um den Durchmesser: Es entsteht eine ganze Kugel. Längs der Achse geschnitten sieht man den Halbkreis und sein Spiegelbild, zusammen einen Kreis.",
  },
  lab: {
    kind: "axial-section",
    title: "Labor: Die Drehbank",
    intro: "Wähle eine Figur und drehe sie um die Achse. Links entsteht der Körper, rechts siehst du seinen Axialschnitt in wahrer Größe. Die Punkte am Axialschnitt kannst du ziehen.",
    params: [
      { type: "choice", key: "shape", label: "Figur", options: AXIAL_FIGURES.map((label, value) => ({ value, label })), value: 0 },
      { type: "range", key: "r", label: "Radius r", unit: "cm", min: 0.5, max: 5, step: 0.1, value: 2, digits: 1 },
      { type: "range", key: "h", label: "Höhe h", unit: "cm", min: 0.5, max: 8, step: 0.1, value: 3, digits: 1, showIf: (v) => v.shape !== 2 },
      { type: "range", key: "r2", label: "Radius oben r₂", unit: "cm", min: 0.5, max: 5, step: 0.1, value: 1, digits: 1, showIf: (v) => v.shape === 3 },
      { type: "range", key: "k", label: "Höhe der Spitze k", unit: "cm", min: 0.5, max: 4, step: 0.1, value: 2, digits: 1, showIf: (v) => v.shape === 4 },
      { type: "range", key: "phi", label: "Drehung", unit: "°", min: 0, max: 360, step: 5, value: 0 },
    ],
    readouts: [
      { key: "body", label: "Körper nach einer ganzen Drehung", compute: (v) => axialBody(v) },
      { key: "section", label: "Axialschnitt", compute: (v) => axialSectionName(v) },
      { key: "s", label: "Mantellinie s", unit: "cm", digits: 2, compute: (v) => axialSlant(v) ?? "keine (Kugel)" },
      { key: "A", label: "Flächeninhalt des Axialschnitts", unit: "cm²", digits: 2, emphasis: true, compute: (v) => axialArea(v) },
      { key: "u", label: "Umfang des Axialschnitts", unit: "cm", digits: 2, compute: (v) => axialPerimeter(v) },
    ],
    goals: [
      {
        id: "quadrat",
        text: "Drehe ein Rechteck einmal ganz um die Achse, sodass ein Zylinder mit quadratischem Axialschnitt entsteht.",
        check: (v) => v.shape === 0 && v.phi === 360 && within(v.h, 2 * v.r, 1e-9),
      },
      {
        id: "gleichseitig",
        text: "Erzeuge einen Kegel, dessen Axialschnitt ein gleichseitiges Dreieck ist (Mantellinie s = 2r, ±1 %).",
        check: (v) => v.shape === 1 && near(Math.hypot(v.r, v.h), 2 * v.r, 0.01),
      },
      {
        id: "becher",
        text: "Ein Becher hat als Axialschnitt ein gleichschenkliges Trapez: unten 5 cm breit, oben 8 cm breit, 6 cm hoch. Stelle die Figur ein, die ihn erzeugt.",
        check: (v) => v.shape === 3 && within(v.r, 2.5, 1e-9) && within(v.r2, 4, 1e-9) && within(v.h, 6, 1e-9),
      },
    ],
  },
  exercises: [
    {
      id: "kegel-axialschnitt",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.stepped(1, 8, 0.5);
          const h = rng.stepped(2, 15, 0.5);
          const s = Math.hypot(r, h);
          const A = r * h;
          return {
            prompt: `Ein Kegel hat den Radius r = ${fmt(r, 1)} cm und die Höhe h = ${fmt(h, 1)} cm. Sein Axialschnitt ist ein gleichschenkliges Dreieck. Berechne die Länge der Schenkel (die Mantellinie s) und den Flächeninhalt des Axialschnitts.`,
            given: [`r = ${fmtUnit(r, "cm", 1)}`, `h = ${fmtUnit(h, "cm", 1)}`],
            formulaHint: `s = ${sqrtHtml("r² + h²")}; A = ½ · 2r · h = r · h`,
            fields: [
              numberField("s =", s, "cm", 2, { slips: [{ value: r + h, hint: "Pythagoras: erst quadrieren und addieren, dann die Wurzel ziehen. s ist nicht r + h." }] }),
              numberField("A =", A, "cm²", 2, {
                slips: [
                  { value: 2 * r * h, hint: "Das wäre ein Rechteck. Das Dreieck hat A = ½ · Grundseite 2r · Höhe h = r · h." },
                  { value: (r * h) / 2, hint: "Die Grundseite des Axialschnitts ist der Durchmesser 2r, nicht r." },
                ],
              }),
            ],
            steps: [
              "Der halbe Axialschnitt ist ein rechtwinkliges Dreieck mit den Katheten r und h; die Hypotenuse ist s.",
              `s = ${sqrtHtml(`${fmt(r, 1)}² + ${fmt(h, 1)}²`)} cm = ${sqrtHtml(fmt(r * r + h * h, 2))} cm ≈ ${fmtUnit(s, "cm")}`,
              `A = ½ · ${fmt(2 * r, 1)} cm · ${fmt(h, 1)} cm = ${fmtUnit(A, "cm²")}`,
              `<strong>s ≈ ${fmtUnit(s, "cm")}, A = ${fmtUnit(A, "cm²")}</strong>`,
            ],
            meta: { r, h },
          };
        }
        const r = rng.stepped(2, 8, 0.5);
        const s = r + rng.stepped(1, 8, 0.5);
        const u = 2 * r + 2 * s;
        const h = Math.sqrt(s * s - r * r);
        return {
          prompt: `Der Axialschnitt eines Kegels ist ein gleichschenkliges Dreieck mit dem Umfang ${fmt(u, 1)} cm; seine Grundseite ist ${fmt(2 * r, 1)} cm lang. Berechne die Höhe des Kegels und den Flächeninhalt des Axialschnitts.`,
          given: [`Umfang u = ${fmtUnit(u, "cm", 1)}`, `Grundseite 2r = ${fmtUnit(2 * r, "cm", 1)}`],
          fields: [
            numberField("h =", h, "cm", 2, {
              slips: [
                { value: Math.hypot(s, r), hint: "Die Mantellinie s ist die Hypotenuse: h² = s² − r²." },
                { value: Math.sqrt(s * s - 4 * r * r), hint: "Im halben Axialschnitt ist die Kathete der Radius r, nicht die ganze Grundseite 2r." },
              ],
            }),
            numberField("A =", r * h, "cm²", 2),
          ],
          steps: [
            `Schenkel: s = (u − 2r) : 2 = (${fmt(u, 1)} − ${fmt(2 * r, 1)}) cm : 2 = ${fmtUnit(s, "cm", 1)}; Radius r = ${fmtUnit(r, "cm", 1)}`,
            `Halber Axialschnitt: h = ${sqrtHtml(`${fmt(s, 1)}² − ${fmt(r, 1)}²`)} cm ≈ ${fmtUnit(h, "cm")}`,
            `<strong>h ≈ ${fmtUnit(h, "cm")}, A = r · h ≈ ${fmtUnit(r * h, "cm²")}</strong>`,
          ],
          meta: { r, s, u },
        };
      },
    },
    {
      id: "figur-koerper",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const kind = rng.int(0, 3);
          let prompt: string;
          let given: string[];
          let figure: number;
          let section: string;
          const meta: Record<string, number> = { kind };
          if (kind === 0) {
            const a = rng.stepped(1, 8, 0.5);
            const b = rng.stepped(2, 12, 0.5);
            prompt = `Ein Rechteck mit den Seiten a = ${fmt(a, 1)} cm und b = ${fmt(b, 1)} cm dreht sich einmal um die Seite b. Welcher Körper entsteht, und wie groß ist der Flächeninhalt seines Axialschnitts?`;
            given = [`a = ${fmtUnit(a, "cm", 1)} (senkrecht zur Achse)`, `b = ${fmtUnit(b, "cm", 1)} (auf der Achse)`];
            figure = a * b;
            section = `ein Rechteck ${fmt(2 * a, 1)} cm × ${fmt(b, 1)} cm`;
            Object.assign(meta, { a, b });
          } else if (kind === 1) {
            const a = rng.stepped(1, 8, 0.5);
            const b = rng.stepped(2, 12, 0.5);
            prompt = `Ein rechtwinkliges Dreieck mit den Katheten a = ${fmt(a, 1)} cm und b = ${fmt(b, 1)} cm dreht sich einmal um die Kathete b. Welcher Körper entsteht, und wie groß ist der Flächeninhalt seines Axialschnitts?`;
            given = [`a = ${fmtUnit(a, "cm", 1)}`, `b = ${fmtUnit(b, "cm", 1)} (auf der Achse)`];
            figure = (a * b) / 2;
            section = `ein gleichschenkliges Dreieck mit der Grundseite ${fmt(2 * a, 1)} cm und der Höhe ${fmt(b, 1)} cm`;
            Object.assign(meta, { a, b });
          } else if (kind === 2) {
            const r = rng.stepped(1, 10, 0.5);
            prompt = `Ein Halbkreis mit dem Radius r = ${fmt(r, 1)} cm dreht sich einmal um seinen Durchmesser. Welcher Körper entsteht, und wie groß ist der Flächeninhalt seines Axialschnitts?`;
            given = [`r = ${fmtUnit(r, "cm", 1)}`];
            figure = (PI * r * r) / 2;
            section = `ein Kreis mit dem Radius ${fmt(r, 1)} cm`;
            Object.assign(meta, { r });
          } else {
            const a = rng.stepped(2, 8, 0.5);
            let c = rng.stepped(1, 8, 0.5);
            while (c === a) c = rng.stepped(1, 8, 0.5);
            const h = rng.stepped(2, 10, 0.5);
            prompt = `Ein rechtwinkliges Trapez hat die parallelen Seiten a = ${fmt(a, 1)} cm (unten) und c = ${fmt(c, 1)} cm (oben). Es dreht sich um seinen Schenkel h = ${fmt(h, 1)} cm, der auf a und c senkrecht steht. Welcher Körper entsteht, und wie groß ist der Flächeninhalt seines Axialschnitts?`;
            given = [`a = ${fmtUnit(a, "cm", 1)}`, `c = ${fmtUnit(c, "cm", 1)}`, `h = ${fmtUnit(h, "cm", 1)} (auf der Achse)`];
            figure = ((a + c) * h) / 2;
            section = `ein gleichschenkliges Trapez mit den Grundseiten ${fmt(2 * a, 1)} cm und ${fmt(2 * c, 1)} cm`;
            Object.assign(meta, { a, c, h });
          }
          const A = 2 * figure;
          return {
            prompt,
            given,
            formulaHint: "Axialschnitt = Figur + Spiegelbild an der Achse: A = 2 · A(Figur)",
            fields: [
              choiceField("Körper", BODIES, kind),
              numberField("A =", A, "cm²", 2, { slips: [{ value: figure, hint: "Das ist nur die Figur. Der Axialschnitt besteht aus der Figur und ihrem Spiegelbild: doppelt so groß." }] }),
            ],
            steps: [
              `Jeder Punkt der Figur läuft auf einem Kreis um die Achse: Es entsteht ${BODY_WITH_ARTICLE[kind]}.`,
              `Der Axialschnitt ist die Figur mit ihrem Spiegelbild, ${section}. Die Figur hat ${fmtUnit(figure, "cm²")}.`,
              `<strong>${BODIES[kind]}; A = 2 · ${fmt(figure, 2)} cm² = ${fmtUnit(A, "cm²")}</strong>`,
            ],
            meta,
          };
        }
        let a = rng.stepped(3, 9, 0.5);
        const b = rng.stepped(3, 12, 0.5);
        while (a === b) a = rng.stepped(3, 9, 0.5);
        const c = Math.hypot(a, b);
        const radius = (a * b) / c;
        return {
          prompt: `Ein rechtwinkliges Dreieck mit den Katheten a = ${fmt(a, 1)} cm und b = ${fmt(b, 1)} cm dreht sich einmal um seine Hypotenuse. Beschreibe den Rotationskörper. Berechne den Radius an seiner breitesten Stelle und den Flächeninhalt seines Axialschnitts.`,
          given: [`a = ${fmtUnit(a, "cm", 1)}`, `b = ${fmtUnit(b, "cm", 1)}`, "Achse: die Hypotenuse c"],
          fields: [
            choiceField("Körper", ["zwei Kegel mit gemeinsamer Grundfläche (Doppelkegel)", "ein Kegel mit der Höhe c", "ein Zylinder mit Kegelspitze", "ein Kegelstumpf"], 0),
            numberField("r =", radius, "cm", 2, { slips: [{ value: c / 2, hint: "Der Radius ist der Abstand der rechtwinkligen Ecke von der Achse: die Höhe h_c = a · b : c." }] }),
            numberField("A =", a * b, "cm²", 2, { slips: [{ value: (a * b) / 2, hint: "Das ist nur das Dreieck. Mit dem Spiegelbild ist der Axialschnitt doppelt so groß." }] }),
          ],
          steps: [
            `c = ${sqrtHtml(`${fmt(a, 1)}² + ${fmt(b, 1)}²`)} cm ≈ ${fmtUnit(c, "cm")}. Die rechtwinklige Ecke läuft auf dem größten Kreis: Es entstehen zwei Kegel mit gemeinsamer Grundfläche, die Katheten werden ihre Mantellinien.`,
            `Radius = Höhe h<sub>c</sub> auf die Hypotenuse: ½ · a · b = ½ · c · h<sub>c</sub>, also h<sub>c</sub> = ${fmt(a * b, 2)} : ${fmt(c, 2)} ≈ ${fmtUnit(radius, "cm")}`,
            "Der Axialschnitt ist das Dreieck mit seinem Spiegelbild, ein Drachenviereck: A = c · h<sub>c</sub> = a · b.",
            `<strong>Doppelkegel, r ≈ ${fmtUnit(radius, "cm")}, A = ${fmtUnit(a * b, "cm²")}</strong>`,
          ],
          meta: { a, b },
        };
      },
    },
    {
      id: "zusammengesetzt",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.stepped(1, 6, 0.5);
          const h = rng.stepped(2, 10, 0.5);
          const k = rng.stepped(1, 6, 0.5);
          const s = Math.hypot(r, k);
          const A = 2 * r * h + r * k;
          return {
            prompt: `Eine Figur aus einem Rechteck (Breite r = ${fmt(r, 1)} cm, Höhe h = ${fmt(h, 1)} cm) und einem aufgesetzten rechtwinkligen Dreieck (Katheten r und k = ${fmt(k, 1)} cm, k auf der Achse) dreht sich um die Achse. Es entsteht ein Zylinder mit Kegelspitze. Berechne die Mantellinie s der Spitze und den Flächeninhalt des Axialschnitts.`,
            given: [`r = ${fmtUnit(r, "cm", 1)}`, `h = ${fmtUnit(h, "cm", 1)}`, `k = ${fmtUnit(k, "cm", 1)}`],
            formulaHint: `s = ${sqrtHtml("r² + k²")}; A = 2r · h + ½ · 2r · k`,
            fields: [
              numberField("s =", s, "cm", 2, { slips: [{ value: r + k, hint: "Pythagoras: s² = r² + k², also s = √(r² + k²), nicht r + k." }] }),
              numberField("A =", A, "cm²", 2, { slips: [{ value: r * h + (r * k) / 2, hint: "Das ist nur die Figur. Der Axialschnitt ist doppelt so breit: Rechteck 2r × h und Dreieck mit der Grundseite 2r." }] }),
            ],
            steps: [
              `Axialschnitt: Rechteck ${fmt(2 * r, 1)} cm × ${fmt(h, 1)} cm mit aufgesetztem gleichschenkligem Dreieck (Grundseite ${fmt(2 * r, 1)} cm, Höhe ${fmt(k, 1)} cm).`,
              `s = ${sqrtHtml(`${fmt(r, 1)}² + ${fmt(k, 1)}²`)} cm ≈ ${fmtUnit(s, "cm")}`,
              `A = ${fmt(2 * r, 1)} · ${fmt(h, 1)} cm² + ½ · ${fmt(2 * r, 1)} · ${fmt(k, 1)} cm²`,
              `<strong>s ≈ ${fmtUnit(s, "cm")}, A = ${fmtUnit(A, "cm²")}</strong>`,
            ],
            meta: { r, h, k },
          };
        }
        const r = rng.pick([2, 2.5, 3, 3.5, 4]);
        const s = r + rng.pick([0.5, 1, 1.5, 2, 3]);
        const h = rng.stepped(8, 20, 1);
        const k = Math.sqrt(s * s - r * r);
        return {
          prompt: `Ein Turm hat die Form eines Zylinders mit kegelförmigem Dach. Sein Axialschnitt ist ein Rechteck, ${fmt(2 * r, 1)} m breit und ${h} m hoch, mit einem aufgesetzten gleichschenkligen Dreieck, dessen Schenkel ${fmt(s, 1)} m lang sind. Wie hoch ist das Dach, und wie hoch ist der ganze Turm?`,
          given: [`Breite 2r = ${fmtUnit(2 * r, "m", 1)}`, `Zylinderhöhe ${h} m`, `Dachschenkel s = ${fmtUnit(s, "m", 1)}`],
          fields: [
            numberField("Dachhöhe k =", k, "m", 2, {
              slips: [
                { value: Math.hypot(s, r), hint: "Der Schenkel s ist die Hypotenuse: k² = s² − r²." },
                { value: Math.sqrt(s * s - 4 * r * r), hint: "Nimm den Radius r, die halbe Breite, nicht die ganze Breite." },
              ],
            }),
            numberField("Turmhöhe =", h + k, "m", 2, { slips: [{ value: h + s, hint: "Die Dachhöhe ist die senkrechte Kathete k, nicht der schräge Schenkel s." }] }),
          ],
          steps: [
            `r = ${fmt(2 * r, 1)} m : 2 = ${fmtUnit(r, "m", 1)}. Im halben Dreieck sind r und k die Katheten, s ist die Hypotenuse.`,
            `k = ${sqrtHtml(`${fmt(s, 1)}² − ${fmt(r, 1)}²`)} m ≈ ${fmtUnit(k, "m")}`,
            `<strong>Dachhöhe ≈ ${fmtUnit(k, "m")}, Turmhöhe ≈ ${h} m + ${fmt(k, 2)} m ≈ ${fmtUnit(h + k, "m")}</strong>`,
          ],
          meta: { r, h, s },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du siehst einer Figur an, welcher Körper beim Drehen entsteht, und liest aus dem Axialschnitt r, h und s ab.",
};

// 6.2 Netze und Oberflächen ─────────────────────────────────────────────────

const NET_SOLIDS = ["dreiseitiges Prisma", "quadratische Pyramide", "Zylinder", "Kegel"];

const oberflaeche: Lesson = {
  id: "rg-2-oberflaeche",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "6.2 Netze und Oberflächen",
  subtitle: "Körper aufschneiden und flach legen",
  tracks: ["II_III"],
  lehrplan: `${LP}, Netze und Oberflächen von Prisma, Pyramide, Zylinder und Kegel`,
  whyItMatters:
    "Wie viel Blech braucht eine Dose, wie viel Karton eine Schultüte, wie viel Kupfer ein Turmdach? Schneidet man einen Körper auf und legt ihn flach, wird seine Oberfläche zu einem Netz aus Rechtecken, Dreiecken, Kreisen und Kreissektoren.",
  explanationHtml: `
    <p>Die <strong>Oberfläche</strong> O eines Körpers ist die Summe aller Flächen, die ihn begrenzen. Klappt man sie in die Ebene, entsteht ein <strong>Netz</strong>; bei Zylinder und Kegel sagt man auch <strong>Abwicklung</strong>. Alle Flächen außer Grund- und Deckfläche bilden den <strong>Mantel</strong> M.</p>
    <ul>
      <li><strong>Prisma und Zylinder</strong> (Säulen): O = 2 · G + M. Abgewickelt ist der Mantel ein Rechteck aus dem Umfang u der Grundfläche und der Höhe h: M = u · h, beim Zylinder M = 2πr · h.</li>
      <li><strong>Pyramide</strong>: O = G + M. Bei der quadratischen Pyramide besteht der Mantel aus vier gleichschenkligen Dreiecken mit der <strong>Seitenhöhe</strong> h<sub>s</sub>: M = 4 · ½ · a · h<sub>s</sub> = 2a · h<sub>s</sub>. Pythagoras im Dreieck aus h, a/2 und h<sub>s</sub>: h<sub>s</sub> = ${sqrtHtml("h² + (a/2)²")}.</li>
      <li><strong>Kegel</strong>: O = G + M. Abgewickelt ist der Mantel ein <strong>Kreissektor</strong> mit dem Radius s (Mantellinie) und dem Bogen 2πr (Umfang der Grundfläche). Sein Mittelpunktswinkel ist α = 360° · r : s, sein Flächeninhalt M = πs² · ${frac("α", "360°")} = πs² · ${frac("r", "s")} = <strong>π · r · s</strong>.</li>
    </ul>
    <div class="example">Beispiel: Ein Kegel mit r = 3 cm und h = 4 cm hat s = ${sqrtHtml("9 + 16")} cm = 5 cm. Sein Mantel ist ein Sektor mit α = 360° · 3 : 5 = 216°: M = π · 3 · 5 cm² ≈ 47,12 cm². Mit G = π · 3² cm² ≈ 28,27 cm² ist O = G + M ≈ 75,40 cm².</div>
    <div class="merke"><strong>Merke:</strong> Säulen O = 2G + M, Spitzkörper O = G + M. Zylinder M = 2πrh, Kegel M = πrs. Schräge Längen wie s und h<sub>s</sub> berechnest du mit Pythagoras.</div>
  `,
  formulas: [
    { name: "Oberfläche", html: "Prisma, Zylinder: O = 2G + M · Pyramide, Kegel: O = G + M", quantities: "G Grundfläche, M Mantel" },
    { name: "Mantel von Zylinder und Kegel", html: `Zylinder: M = 2πr · h · Kegel: M = π · r · s mit s = ${sqrtHtml("r² + h²")}`, quantities: "r Radius, h Höhe, s Mantellinie" },
    { name: "Abwicklung des Kegelmantels", html: "Kreissektor mit dem Radius s und α = 360° · r : s", quantities: "der Bogen ist der Umfang 2πr" },
  ],
  quiz: {
    question: "Ein Kegel hat den Radius r = 4 cm und die Mantellinie s = 8 cm. Welche Form hat sein abgewickelter Mantel?",
    options: ["ein Halbkreis mit dem Radius 8 cm", "ein Viertelkreis mit dem Radius 8 cm", "ein Kreissektor mit α = 120°", "ein Dreieck mit der Höhe 8 cm"],
    correctIndex: 0,
    explanation: "α = 360° · r : s = 360° · 4 : 8 = 180°. Der Mantel ist also ein Halbkreis, sein Radius ist die Mantellinie s = 8 cm.",
  },
  lab: {
    kind: "solid-net",
    title: "Labor: Abwickeln",
    intro: "Wähle einen Körper und wickle ihn ab. Säulen rollen ihren Mantel zu einem Rechteck ab, der Kegel rollt um seine Spitze, die Pyramide klappt ihre Seiten herunter. Die Punkte am Körper kannst du ziehen.",
    params: [
      { type: "choice", key: "solid", label: "Körper", options: NET_SOLIDS.map((label, value) => ({ value, label })), value: 2 },
      { type: "range", key: "a", label: "Grundkante a", unit: "cm", min: 1, max: 6, step: 0.1, value: 3, digits: 1, showIf: (v) => v.solid <= 1 },
      { type: "range", key: "r", label: "Radius r", unit: "cm", min: 0.5, max: 5, step: 0.1, value: 2, digits: 1, showIf: (v) => v.solid >= 2 },
      { type: "range", key: "h", label: "Höhe h", unit: "cm", min: 0.5, max: 10, step: 0.1, value: 4, digits: 1 },
      { type: "range", key: "t", label: "Abwickeln", unit: "%", min: 0, max: 100, step: 1, value: 0 },
    ],
    readouts: [
      { key: "G", label: "Grundfläche G", unit: "cm²", digits: 2, compute: (v) => solidNet(v).G },
      { key: "M", label: "Mantel M", unit: "cm²", digits: 2, compute: (v) => solidNet(v).M },
      { key: "O", label: "Oberfläche O", unit: "cm²", digits: 2, emphasis: true, compute: (v) => solidNet(v).O },
      { key: "side", label: "Seitenhöhe h_s bzw. Mantellinie s", unit: "cm", digits: 2, compute: (v) => solidNet(v).side ?? "nur bei Pyramide und Kegel" },
      { key: "alpha", label: "Mittelpunktswinkel des Mantelsektors", unit: "°", digits: 1, compute: (v) => solidNet(v).alpha ?? "nur beim Kegel" },
    ],
    goals: [
      {
        id: "halbkreis",
        text: "Wickle einen Kegel ganz ab, dessen Mantel ein Halbkreis ist (α = 180° ± 1°).",
        check: (v) => v.solid === 3 && v.t === 100 && within(Number(solidNet(v).alpha), 180, 1),
      },
      {
        id: "pyramide",
        text: "Baue eine quadratische Pyramide, deren vier Seitenflächen zusammen doppelt so groß sind wie die Grundfläche (±1 %).",
        check: (v) => v.solid === 1 && near(solidNet(v).M, 2 * solidNet(v).G, 0.01),
      },
      {
        id: "prisma",
        text: "Wickle ein Prisma ganz ab, dessen Mantel ein Quadrat ist.",
        check: (v) => v.solid === 0 && v.t === 100 && within(3 * v.a, v.h, 1e-9),
      },
    ],
  },
  exercises: [
    {
      id: "kegel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.stepped(1, 8, 0.5);
          const h = rng.stepped(2, 15, 0.5);
          const s = Math.hypot(r, h);
          const M = PI * r * s;
          const O = PI * r * r + M;
          return {
            prompt: `Ein Kegel hat den Radius r = ${fmt(r, 1)} cm und die Höhe h = ${fmt(h, 1)} cm. Berechne die Mantellinie s, die Mantelfläche M und die Oberfläche O.`,
            given: [`r = ${fmtUnit(r, "cm", 1)}`, `h = ${fmtUnit(h, "cm", 1)}`],
            formulaHint: `s = ${sqrtHtml("r² + h²")}; M = π · r · s; O = π · r² + π · r · s`,
            fields: [
              numberField("s =", s, "cm", 2),
              numberField("M =", M, "cm²", 2, { slips: [{ value: PI * r * h, hint: "In M = πrs steht die Mantellinie s, nicht die Höhe h." }] }),
              numberField("O =", O, "cm²", 2, {
                slips: [
                  { value: 2 * PI * r * r + M, hint: "Ein Kegel hat nur eine Kreisfläche, die Grundfläche." },
                  { value: M, hint: "Das ist nur der Mantel. Zur Oberfläche gehört auch die Grundfläche πr²." },
                ],
              }),
            ],
            steps: [
              `s = ${sqrtHtml(`${fmt(r, 1)}² + ${fmt(h, 1)}²`)} cm ≈ ${fmtUnit(s, "cm")}`,
              `M = π · ${fmt(r, 1)} · ${fmt(s, 2)} cm² ≈ ${fmtUnit(M, "cm²")}; G = π · ${fmt(r, 1)}² cm² ≈ ${fmtUnit(PI * r * r, "cm²")}`,
              `<strong>s ≈ ${fmtUnit(s, "cm")}, M ≈ ${fmtUnit(M, "cm²")}, O ≈ ${fmtUnit(O, "cm²")}</strong>`,
            ],
            meta: { r, h },
          };
        }
        const s = rng.pick([40, 45, 50, 60, 70, 80]);
        const alpha = rng.pick([60, 72, 90, 100, 120, 135, 150]);
        const r = (s * alpha) / 360;
        const h = Math.sqrt(s * s - r * r);
        const b = (2 * PI * s * alpha) / 360;
        return {
          prompt: `Für eine Schultüte wird aus Karton ein Kreissektor mit dem Radius ${s} cm und dem Mittelpunktswinkel ${alpha}° ausgeschnitten und zu einem Kegelmantel gerollt. Wie groß ist der Radius der Öffnung, und wie hoch ist die Schultüte?`,
          given: [`Sektor: Radius ${s} cm = Mantellinie s`, `Mittelpunktswinkel α = ${alpha}°`],
          fields: [
            numberField("r =", r, "cm", 2, {
              slips: [
                { value: b, hint: "Das ist die Bogenlänge b. Sie ist der Umfang 2πr der Öffnung: Teile noch durch 2π." },
                { value: (s * alpha) / 180, hint: "Der volle Kreis hat 360°: r = s · α : 360°." },
              ],
            }),
            numberField("h =", h, "cm", 2, { slips: [{ value: Math.hypot(s, r), hint: "Die Mantellinie s ist die Hypotenuse: h² = s² − r²." }] }),
          ],
          steps: [
            `Der Bogen des Sektors wird zum Rand der Öffnung: b = 2π · ${s} cm · ${alpha}/360 ≈ ${fmtUnit(b, "cm")}.`,
            `2πr = b, also r = s · α : 360° = ${s} cm · ${alpha} : 360 ≈ ${fmtUnit(r, "cm")}`,
            `h = ${sqrtHtml(`${s}² − ${fmt(r, 2)}²`)} cm ≈ ${fmtUnit(h, "cm")}`,
            `<strong>r ≈ ${fmtUnit(r, "cm")}, h ≈ ${fmtUnit(h, "cm")}</strong>`,
          ],
          meta: { s, alpha },
        };
      },
    },
    {
      id: "pyramide",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.stepped(2, 12, 0.5);
          const h = rng.stepped(2, 15, 0.5);
          const hs = Math.hypot(h, a / 2);
          const M = 2 * a * hs;
          const O = a * a + M;
          return {
            prompt: `Eine quadratische Pyramide hat die Grundkante a = ${fmt(a, 1)} cm und die Höhe h = ${fmt(h, 1)} cm. Berechne die Seitenhöhe h<sub>s</sub> ihrer Seitenflächen und ihre Oberfläche.`,
            given: [`a = ${fmtUnit(a, "cm", 1)}`, `h = ${fmtUnit(h, "cm", 1)}`],
            formulaHint: `h<sub>s</sub> = ${sqrtHtml("h² + (a/2)²")}; O = a² + 4 · ½ · a · h<sub>s</sub>`,
            fields: [
              numberField("h<sub>s</sub> =", hs, "cm", 2, { slips: [{ value: Math.hypot(h, a), hint: "Vom Fußpunkt der Höhe bis zur Mitte der Grundkante ist es nur a/2." }] }),
              numberField("O =", O, "cm²", 2, {
                slips: [
                  { value: a * a + 4 * a * hs, hint: "Jede Seitenfläche ist ein Dreieck: ½ · a · h_s." },
                  { value: a * a + 2 * a * h, hint: "Die Seitenflächen stehen schräg: Nimm ihre Höhe h_s, nicht die Körperhöhe h." },
                  { value: M, hint: "Das ist nur der Mantel. Die quadratische Grundfläche a² gehört dazu." },
                ],
              }),
            ],
            steps: [
              `Rechtwinkliges Dreieck aus h, a/2 und h<sub>s</sub>: h<sub>s</sub> = ${sqrtHtml(`${fmt(h, 1)}² + ${fmt(a / 2, 2)}²`)} cm ≈ ${fmtUnit(hs, "cm")}`,
              `M = 4 · ½ · ${fmt(a, 1)} · ${fmt(hs, 2)} cm² ≈ ${fmtUnit(M, "cm²")}; G = ${fmt(a, 1)}² cm² = ${fmtUnit(a * a, "cm²")}`,
              `<strong>h<sub>s</sub> ≈ ${fmtUnit(hs, "cm")}, O = G + M ≈ ${fmtUnit(O, "cm²")}</strong>`,
            ],
            meta: { a, h },
          };
        }
        const a = rng.pick([4, 5, 6, 7, 8]);
        const edge = a + rng.pick([2, 3, 4, 5, 6]);
        const p = rng.pick([5, 8, 10, 12, 15]);
        const hs = Math.sqrt(edge * edge - (a / 2) ** 2);
        const M = 2 * a * hs;
        const sheet = M * (1 + p / 100);
        return {
          prompt: `Ein Kirchturmdach hat die Form einer quadratischen Pyramide ohne Boden. Die Grundkante ist ${a} m lang, jede der vier schrägen Dachkanten ${edge} m. Das Dach wird mit Kupferblech gedeckt; für Falze und Verschnitt rechnet man ${p} % dazu. Berechne die Seitenhöhe einer Dachfläche und den Blechbedarf.`,
          given: [`Grundkante a = ${a} m`, `Dachkante ${edge} m`, `Zuschlag ${p} %`],
          fields: [
            numberField("h<sub>s</sub> =", hs, "m", 2, { slips: [{ value: Math.sqrt(edge * edge - a * a), hint: "Die Höhe einer Dachfläche halbiert ihre Grundseite: h_s² = Kante² − (a/2)²." }] }),
            numberField("Blech =", sheet, "m²", 1, {
              slips: [
                { value: M, hint: `Das ist die Dachfläche ohne Zuschlag. Rechne noch ${p} % dazu.` },
                { value: 2 * sheet, hint: "Jede Dachfläche ist ein Dreieck: ½ · a · h_s." },
              ],
            }),
          ],
          steps: [
            `Eine Dachfläche ist ein gleichschenkliges Dreieck mit den Schenkeln ${edge} m und der Grundseite ${a} m. Ihre Höhe trifft die Grundseite in der Mitte: h<sub>s</sub> = ${sqrtHtml(`${edge}² − ${fmt(a / 2, 1)}²`)} m ≈ ${fmtUnit(hs, "m")}`,
            `Dachfläche M = 4 · ½ · ${a} · ${fmt(hs, 2)} m² ≈ ${fmtUnit(M, "m²")}`,
            `<strong>h<sub>s</sub> ≈ ${fmtUnit(hs, "m")}, Blech ≈ ${fmt(M, 2)} m² · ${fmt(1 + p / 100, 2)} ≈ ${fmtUnit(sheet, "m²", 1)}</strong>`,
          ],
          meta: { a, edge, p },
        };
      },
    },
    {
      id: "saeule",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          if (rng.next() < 0.5) {
            const r = rng.stepped(1, 10, 0.5);
            const h = rng.stepped(2, 20, 0.5);
            const M = 2 * PI * r * h;
            const O = 2 * PI * r * r + M;
            return {
              prompt: `Ein Zylinder hat den Radius r = ${fmt(r, 1)} cm und die Höhe h = ${fmt(h, 1)} cm. Berechne seine Mantelfläche M und seine Oberfläche O.`,
              given: [`r = ${fmtUnit(r, "cm", 1)}`, `h = ${fmtUnit(h, "cm", 1)}`],
              formulaHint: "M = 2π · r · h; O = 2 · π · r² + M",
              fields: [
                numberField("M =", M, "cm²", 2, { slips: [{ value: PI * r * h, hint: "Der Mantel ist ein Rechteck mit der Länge 2πr, dem Umfang des Kreises." }] }),
                numberField("O =", O, "cm²", 2, {
                  slips: [
                    { value: PI * r * r + M, hint: "Ein Zylinder hat zwei Kreisflächen: Boden und Deckel." },
                    { value: M, hint: "Das ist nur der Mantel. Boden und Deckel gehören zur Oberfläche." },
                  ],
                }),
              ],
              steps: [
                `Abgewickelt ist der Mantel ein Rechteck: 2π · ${fmt(r, 1)} cm ≈ ${fmtUnit(2 * PI * r, "cm")} lang und ${fmtUnit(h, "cm", 1)} hoch.`,
                `M ≈ ${fmtUnit(M, "cm²")}; 2G = 2 · π · ${fmt(r, 1)}² cm² ≈ ${fmtUnit(2 * PI * r * r, "cm²")}`,
                `<strong>M ≈ ${fmtUnit(M, "cm²")}, O ≈ ${fmtUnit(O, "cm²")}</strong>`,
              ],
              meta: { kind: 0, r, h },
            };
          }
          const a = rng.stepped(2, 9, 0.5);
          const b = rng.stepped(2, 9, 0.5);
          const h = rng.stepped(3, 15, 0.5);
          const c = Math.hypot(a, b);
          const M = (a + b + c) * h;
          const O = a * b + M;
          return {
            prompt: `Ein gerades Prisma hat als Grundfläche ein rechtwinkliges Dreieck mit den Katheten a = ${fmt(a, 1)} cm und b = ${fmt(b, 1)} cm; es ist h = ${fmt(h, 1)} cm hoch. Berechne seine Mantelfläche M und seine Oberfläche O.`,
            given: [`a = ${fmtUnit(a, "cm", 1)}`, `b = ${fmtUnit(b, "cm", 1)}`, `h = ${fmtUnit(h, "cm", 1)}`],
            formulaHint: `c = ${sqrtHtml("a² + b²")}; M = (a + b + c) · h; O = 2 · ½ · a · b + M`,
            fields: [
              numberField("M =", M, "cm²", 2, { slips: [{ value: (a + b) * h, hint: "Der Mantel hat drei Rechtecke: Auch die Hypotenuse c = √(a² + b²) gehört zum Umfang." }] }),
              numberField("O =", O, "cm²", 2, {
                slips: [
                  { value: (a * b) / 2 + M, hint: "Ein Prisma hat zwei Dreiecke: Grund- und Deckfläche." },
                  { value: 2 * a * b + M, hint: "Ein rechtwinkliges Dreieck hat nur ½ · a · b." },
                ],
              }),
            ],
            steps: [
              `Hypotenuse c = ${sqrtHtml(`${fmt(a, 1)}² + ${fmt(b, 1)}²`)} cm ≈ ${fmtUnit(c, "cm")}; Umfang u ≈ ${fmtUnit(a + b + c, "cm")}`,
              `M = u · h ≈ ${fmt(a + b + c, 2)} cm · ${fmt(h, 1)} cm ≈ ${fmtUnit(M, "cm²")}; 2G = ${fmt(a, 1)} · ${fmt(b, 1)} cm² = ${fmtUnit(a * b, "cm²")}`,
              `<strong>M ≈ ${fmtUnit(M, "cm²")}, O ≈ ${fmtUnit(O, "cm²")}</strong>`,
            ],
            meta: { kind: 1, a, b, h },
          };
        }
        const b = rng.pick([1.8, 2, 2.4, 3]);
        const hd = rng.pick([1.2, 1.5, 1.6, 2]);
        const L = rng.pick([2, 2.5, 3, 3.5]);
        const s = Math.hypot(b / 2, hd);
        const O = b * hd + 2 * s * L + b * L;
        return {
          prompt: `Ein Zelt hat die Form eines dreiseitigen Prismas. Vorder- und Rückwand sind gleichschenklige Dreiecke, ${fmt(b, 1)} m breit und ${fmt(hd, 1)} m hoch; das Zelt ist ${fmt(L, 1)} m lang. Wie lang ist eine schräge Dachseite (von der Spitze bis zum Boden), und wie viel Stoff braucht man für die beiden Giebelwände, die zwei Dachseiten und den Boden?`,
          given: [`Breite ${fmtUnit(b, "m", 1)}`, `Höhe ${fmtUnit(hd, "m", 1)}`, `Länge ${fmtUnit(L, "m", 1)}`],
          fields: [
            numberField("s =", s, "m", 2, { slips: [{ value: Math.hypot(b, hd), hint: "Die Höhe des Giebels trifft die Grundseite in der Mitte: Nimm die halbe Breite." }] }),
            numberField("Stoff =", O, "m²", 2, {
              slips: [
                { value: O - b * L, hint: "Der Boden gehört auch dazu: Breite · Länge." },
                { value: 2 * b * hd + 2 * s * L + b * L, hint: "Eine Giebelwand ist ein Dreieck: ½ · Breite · Höhe." },
              ],
            }),
          ],
          steps: [
            `Halbe Giebelwand: rechtwinkliges Dreieck mit den Katheten ${fmt(b / 2, 2)} m und ${fmt(hd, 1)} m, also s = ${sqrtHtml(`${fmt(b / 2, 2)}² + ${fmt(hd, 1)}²`)} m ≈ ${fmtUnit(s, "m")}`,
            `Giebel: 2 · ½ · ${fmt(b, 1)} · ${fmt(hd, 1)} m² = ${fmtUnit(b * hd, "m²")}; Dachseiten: 2 · ${fmt(s, 2)} · ${fmt(L, 1)} m² ≈ ${fmtUnit(2 * s * L, "m²")}; Boden: ${fmt(b, 1)} · ${fmt(L, 1)} m² = ${fmtUnit(b * L, "m²")}`,
            `<strong>s ≈ ${fmtUnit(s, "m")}, Stoff ≈ ${fmtUnit(O, "m²")}</strong>`,
          ],
          meta: { b, hd, L },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du wickelst Prisma, Pyramide, Zylinder und Kegel ab und berechnest ihre Oberfläche, auch mit Pythagoras.",
};

// 6.3 Volumen: das Prinzip von Cavalieri ────────────────────────────────────

const CAV_MODES = ["Säulen: gerade und schief", "Spitzkörper: Treppenpyramide", "Kugel: Halbkugel und Zylinder ohne Kegel"];

const volumen: Lesson = {
  id: "rg-3-volumen",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "6.3 Volumen: das Prinzip von Cavalieri",
  subtitle: "Ein schiefer Stapel hat dasselbe Volumen",
  tracks: ["II_III"],
  lehrplan: `${LP}, Prinzip von Cavalieri und Volumen von Prisma, Pyramide, Zylinder, Kegel und Kugel`,
  whyItMatters:
    "Schiebst du einen Stapel Bierdeckel schief, ändert sich sein Volumen nicht. Mit dieser Idee von Cavalieri bekommst du die Volumen von Säulen, Spitzkörpern und sogar der Kugel.",
  explanationHtml: `
    <p><strong>Prinzip von Cavalieri</strong> (Bonaventura Cavalieri, 1598–1647): Haben zwei Körper die gleiche Höhe und in <strong>jeder Höhe gleich große Querschnitte</strong>, dann haben sie das <strong>gleiche Volumen</strong>. Stell dir beide Körper aus vielen hauchdünnen Scheiben aufgebaut vor: Gleich große Scheiben ergeben dasselbe Volumen, egal wie man sie verschiebt.</p>
    <ul>
      <li><strong>Säulen</strong> (Prisma, Zylinder, auch schiefe): Jeder Querschnitt ist so groß wie die Grundfläche G, also <strong>V = G · h</strong>. Bei schiefen Körpern ist h die senkrechte Höhe.</li>
      <li><strong>Spitzkörper</strong> (Pyramide, Kegel): Ein Würfel lässt sich in drei gleiche Pyramiden zerlegen, jede hat ⅓ · a² · a. Alle Pyramiden und Kegel mit gleicher Grundfläche und gleicher Höhe haben in jeder Höhe gleich große Querschnitte, also gilt für alle <strong>V = ⅓ · G · h</strong>. Eine Treppenpyramide aus immer dünneren Scheiben kommt diesem Wert immer näher.</li>
      <li><strong>Kugel</strong>: Eine Halbkugel hat in jeder Höhe z denselben Querschnitt wie ein Zylinder (Radius r, Höhe r), aus dem ein Kegel herausgebohrt ist: π(r² − z²) = πr² − πz². Also ist V<sub>Halbkugel</sub> = πr³ − ⅓πr³ = ⅔πr³ und <strong>V = ${frac(4, 3)} · π · r³</strong>. Zerlegt man die Kugel in viele dünne Pyramiden mit der Spitze im Mittelpunkt, ist V = ⅓ · O · r, daraus folgt <strong>O = 4 · π · r²</strong>.</li>
    </ul>
    <div class="example">Beispiel: Ein Kegel mit r = 3 cm und h = 10 cm hat V = ⅓ · π · 3² · 10 cm³ ≈ 94,25 cm³. Soll ein Kegel mit r = 3 cm 150 cm³ fassen, stellst du um: h = 3V : (πr²) = 450 : (9π) cm ≈ 15,92 cm.</div>
    <div class="merke"><strong>Merke:</strong> Säule V = G · h, Spitzkörper V = ⅓ · G · h, Kugel V = ${frac(4, 3)}πr³ und O = 4πr². Für eine fehlende Länge stellst du die Formel nach ihr um.</div>
  `,
  formulas: [
    { name: "Prinzip von Cavalieri", html: "gleiche Höhe und in jeder Höhe gleich große Querschnitte ⇒ gleiches Volumen", quantities: "gilt auch für schiefe Körper" },
    { name: "Säule und Spitzkörper", html: "Prisma, Zylinder: V = G · h · Pyramide, Kegel: V = ⅓ · G · h", quantities: "G Grundfläche, h senkrechte Höhe" },
    { name: "Kugel", html: `V = ${frac(4, 3)} · π · r³ · O = 4 · π · r²`, quantities: "r Radius" },
  ],
  quiz: {
    question: "Ein gerader und ein schiefer Zylinder haben denselben Radius und dieselbe (senkrechte) Höhe. Was gilt für ihre Volumen?",
    options: ["Sie sind gleich groß.", "Der schiefe Zylinder hat mehr Volumen.", "Der schiefe Zylinder hat weniger Volumen.", "Das hängt davon ab, wie schief er steht."],
    correctIndex: 0,
    explanation: "In jeder Höhe ist der Querschnitt ein Kreis mit demselben Radius. Nach Cavalieri haben beide dasselbe Volumen V = πr² · h.",
  },
  lab: {
    kind: "cavalieri",
    title: "Labor: Scheiben stapeln",
    intro: "Beide Körper sind aus gleich dicken Scheiben gebaut. Schiebe den rechten Stapel schief, verfeinere die Scheiben und vergleiche die Querschnitte in der lila Höhe, die du am linken Rand ziehen kannst.",
    params: [
      { type: "choice", key: "mode", label: "Vergleich", options: CAV_MODES.map((label, value) => ({ value, label })), value: 0 },
      { type: "range", key: "a", label: "Grundkante a", unit: "cm", min: 1, max: 5, step: 0.5, value: 3, digits: 1, showIf: (v) => v.mode !== 2 },
      { type: "range", key: "h", label: "Höhe h", unit: "cm", min: 1, max: 8, step: 0.5, value: 5, digits: 1, showIf: (v) => v.mode !== 2 },
      { type: "range", key: "r", label: "Radius r", unit: "cm", min: 1, max: 5, step: 0.5, value: 4, digits: 1, showIf: (v) => v.mode === 2 },
      { type: "range", key: "shift", label: "Verschiebung oben", unit: "cm", min: 0, max: 6, step: 0.5, value: 0, digits: 1, showIf: (v) => v.mode !== 2 },
      { type: "choice", key: "n", label: "Scheiben", options: [4, 8, 16, 32, 64].map((n) => ({ value: n, label: `${n} Scheiben` })), value: 8 },
      { type: "range", key: "z", label: "Schnitthöhe (Anteil der Höhe)", unit: "%", min: 0, max: 100, step: 5, value: 40 },
    ],
    readouts: [
      { key: "Vf", label: "Volumen je Körper (Formel)", unit: "cm³", digits: 2, emphasis: true, compute: (v) => cavalieri(v).Vf },
      { key: "Vs", label: "Volumen der Scheiben je Körper", unit: "cm³", digits: 2, compute: (v) => cavalieri(v).Vs },
      { key: "dev", label: "Scheiben über der Formel", unit: "%", digits: 1, compute: (v) => (cavalieri(v).Vs / cavalieri(v).Vf - 1) * 100 },
      { key: "Ql", label: "Querschnitt links", unit: "cm²", digits: 2, compute: (v) => cavalieri(v).Ql },
      { key: "Qr", label: "Querschnitt rechts", unit: "cm²", digits: 2, compute: (v) => cavalieri(v).Qr },
      {
        key: "sphere",
        label: "ganze Kugel",
        compute: (v) => (v.mode === 2 ? `V = ${fmt((4 / 3) * PI * v.r ** 3, 2)} cm³, O = ${fmt(4 * PI * v.r * v.r, 2)} cm²` : "nur beim Kugel-Vergleich"),
      },
    ],
    goals: [
      {
        id: "schief",
        text: "Schiebe die Säule so schief, dass die Deckfläche ganz neben der Grundfläche liegt. Ändert sich das Volumen?",
        check: (v) => v.mode === 0 && v.shift >= v.a,
      },
      {
        id: "drittel",
        text: "Verfeinere die Treppenpyramide, bis ihr Volumen weniger als 5 % über ⅓ · G · h liegt.",
        check: (v, r) => v.mode === 1 && Number(r.dev) < 5,
      },
      {
        id: "kugel",
        text: "Stelle eine Kugel ein, deren Volumen in cm³ und Oberfläche in cm² dieselbe Maßzahl haben.",
        check: (v) => v.mode === 2 && within((4 / 3) * PI * v.r ** 3, 4 * PI * v.r * v.r, 1e-6),
      },
    ],
  },
  exercises: [
    {
      id: "volumen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const kind = rng.int(0, 3);
          const h = rng.stepped(2, 15, 0.5);
          if (kind === 0) {
            const G = rng.int(6, 60);
            const V = G * h;
            return {
              prompt: `Ein Prisma hat die Grundfläche G = ${G} cm² und die Höhe h = ${fmt(h, 1)} cm. Berechne sein Volumen.`,
              given: [`G = ${G} cm²`, `h = ${fmtUnit(h, "cm", 1)}`],
              formulaHint: "V = G · h",
              fields: [numberField("V =", V, "cm³", 1, { slips: [{ value: V / 3, hint: "Ein Prisma ist eine Säule: V = G · h, ohne ⅓." }] })],
              steps: ["Jeder Querschnitt ist so groß wie G: V = G · h.", `<strong>V = ${G} cm² · ${fmt(h, 1)} cm = ${fmtUnit(V, "cm³", 1)}</strong>`],
              meta: { kind, G, h },
            };
          }
          if (kind === 2) {
            const a = rng.stepped(2, 10, 0.5);
            const V = (a * a * h) / 3;
            return {
              prompt: `Eine quadratische Pyramide hat die Grundkante a = ${fmt(a, 1)} cm und die Höhe h = ${fmt(h, 1)} cm. Berechne ihr Volumen.`,
              given: [`a = ${fmtUnit(a, "cm", 1)}`, `h = ${fmtUnit(h, "cm", 1)}`],
              formulaHint: "V = ⅓ · a² · h",
              fields: [numberField("V =", V, "cm³", 1, { slips: [{ value: 3 * V, hint: "Das ist das Prisma. Ein Spitzkörper hat nur ⅓ davon: V = ⅓ · G · h." }] })],
              steps: [`G = ${fmt(a, 1)}² cm² = ${fmtUnit(a * a, "cm²")}`, `<strong>V = ⅓ · ${fmt(a * a, 2)} cm² · ${fmt(h, 1)} cm ≈ ${fmtUnit(V, "cm³", 1)}</strong>`],
              meta: { kind, a, h },
            };
          }
          const r = rng.stepped(1, 8, 0.5);
          const column = PI * r * r * h;
          const V = kind === 1 ? column : column / 3;
          return {
            prompt: `Ein ${kind === 1 ? "Zylinder" : "Kegel"} hat den Radius r = ${fmt(r, 1)} cm und die Höhe h = ${fmt(h, 1)} cm. Berechne sein Volumen.`,
            given: [`r = ${fmtUnit(r, "cm", 1)}`, `h = ${fmtUnit(h, "cm", 1)}`],
            formulaHint: kind === 1 ? "V = π · r² · h" : "V = ⅓ · π · r² · h",
            fields: [
              numberField("V =", V, "cm³", 1, {
                slips: [
                  kind === 1
                    ? { value: column / 3, hint: "Ein Zylinder ist eine Säule: V = G · h, ohne ⅓." }
                    : { value: column, hint: "Das ist der Zylinder. Ein Kegel hat nur ⅓ davon." },
                  { value: kind === 1 ? 4 * column : (4 * column) / 3, hint: "In G = πr² steht der Radius, nicht der Durchmesser." },
                ],
              }),
            ],
            steps: [`G = π · ${fmt(r, 1)}² cm² ≈ ${fmtUnit(PI * r * r, "cm²")}`, `<strong>V = ${kind === 1 ? "" : `${THIRD} · `}${fmt(PI * r * r, 2)} cm² · ${fmt(h, 1)} cm ≈ ${fmtUnit(V, "cm³", 1)}</strong>`],
            meta: { kind, r, h },
          };
        }
        const coins = [
          { name: "1-Euro-Münzen", d: 23.25, t: 2.33 },
          { name: "2-Euro-Münzen", d: 25.75, t: 2.2 },
          { name: "50-Cent-Münzen", d: 24.25, t: 2.38 },
          { name: "10-Cent-Münzen", d: 19.75, t: 1.93 },
        ];
        const coin = rng.pick(coins);
        const n = rng.pick([20, 25, 30, 40, 50]);
        const x = rng.pick([10, 15, 20, 25]);
        const height = n * coin.t;
        const G = PI * (coin.d / 2) ** 2;
        const V = G * height;
        return {
          prompt: `Ein Stapel aus ${n} ${coin.name} (Durchmesser ${fmt(coin.d, 2)} mm, Dicke ${fmt(coin.t, 2)} mm) ist schief verrutscht: Die oberste Münze liegt ${x} mm weiter rechts als die unterste. Wie hoch ist der Stapel, und welches Volumen hat er in cm³?`,
          given: [`${n} Münzen, d = ${fmt(coin.d, 2)} mm, Dicke ${fmt(coin.t, 2)} mm`, `oben ${x} mm verschoben`, "1 cm³ = 1000 mm³"],
          fields: [
            numberField("h =", height, "mm", 2),
            numberField("V =", V / 1000, "cm³", 2, {
              slips: [
                { value: (G * Math.hypot(height, x)) / 1000, hint: "Cavalieri: Jede Münze bleibt gleich groß. Es zählt die senkrechte Höhe des Stapels, nicht die schräge Länge." },
                { value: V, hint: "Das sind mm³. 1 cm³ = 1000 mm³." },
              ],
            }),
          ],
          steps: [
            "Nach Cavalieri hat der schiefe Stapel dasselbe Volumen wie der gerade: In jeder Höhe liegt eine gleich große Kreisfläche.",
            `h = ${n} · ${fmt(coin.t, 2)} mm = ${fmtUnit(height, "mm")}; G = π · (${fmt(coin.d / 2, 3)} mm)² ≈ ${fmtUnit(G, "mm²")}`,
            `V = G · h ≈ ${fmt(G, 2)} mm² · ${fmt(height, 2)} mm ≈ ${fmtUnit(V, "mm³", 0)}`,
            `<strong>h = ${fmtUnit(height, "mm")}, V ≈ ${fmtUnit(V / 1000, "cm³")}</strong>`,
          ],
          meta: { n, d: coin.d, t: coin.t, x },
        };
      },
    },
    {
      id: "umstellen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const kind = rng.int(0, 2);
          if (kind === 0) {
            const r = rng.stepped(1, 8, 0.5);
            const V = rng.int(20, 800);
            const h = (3 * V) / (PI * r * r);
            return {
              prompt: `Ein Kegel hat das Volumen V = ${V} cm³ und den Radius r = ${fmt(r, 1)} cm. Wie hoch ist er?`,
              given: [`V = ${V} cm³`, `r = ${fmtUnit(r, "cm", 1)}`],
              formulaHint: "V = ⅓ · π · r² · h, also h = 3V : (π · r²)",
              fields: [
                numberField("h =", h, "cm", 2, {
                  slips: [
                    { value: V / (PI * r * r), hint: "Beim Kegel steht ⅓ in der Formel: h = 3V : (πr²)." },
                    { value: (3 * V) / (PI * r), hint: "Teile durch die ganze Grundfläche πr², also auch durch r²." },
                  ],
                }),
              ],
              steps: [`V = ⅓ · G · h, also h = 3V : G mit G = π · ${fmt(r, 1)}² cm² ≈ ${fmtUnit(PI * r * r, "cm²")}`, `<strong>h = ${3 * V} : ${fmt(PI * r * r, 2)} cm ≈ ${fmtUnit(h, "cm")}</strong>`],
              meta: { kind, r, V },
            };
          }
          if (kind === 1) {
            const h = rng.stepped(2, 15, 0.5);
            const V = rng.int(20, 800);
            const a = Math.sqrt((3 * V) / h);
            return {
              prompt: `Eine quadratische Pyramide hat das Volumen V = ${V} cm³ und die Höhe h = ${fmt(h, 1)} cm. Wie lang ist ihre Grundkante?`,
              given: [`V = ${V} cm³`, `h = ${fmtUnit(h, "cm", 1)}`],
              formulaHint: `V = ⅓ · a² · h, also a = ${sqrtHtml("3V : h")}`,
              fields: [
                numberField("a =", a, "cm", 2, {
                  slips: [
                    { value: Math.sqrt(V / h), hint: "Vergiss den Faktor 3 nicht: a² = 3V : h." },
                    { value: (3 * V) / h, hint: "Das ist a². Ziehe noch die Wurzel." },
                  ],
                }),
              ],
              steps: [`a² = 3V : h = ${3 * V} : ${fmt(h, 1)} ≈ ${fmt((3 * V) / h, 3)}`, `<strong>a = ${sqrtHtml(fmt((3 * V) / h, 3))} cm ≈ ${fmtUnit(a, "cm")}</strong>`],
              meta: { kind, h, V },
            };
          }
          const h = rng.stepped(2, 20, 0.5);
          const V = rng.int(50, 2000);
          const r = Math.sqrt(V / (PI * h));
          return {
            prompt: `Ein Zylinder hat das Volumen V = ${V} cm³ und die Höhe h = ${fmt(h, 1)} cm. Wie groß ist sein Radius?`,
            given: [`V = ${V} cm³`, `h = ${fmtUnit(h, "cm", 1)}`],
            formulaHint: `V = π · r² · h, also r = ${sqrtHtml("V : (π · h)")}`,
            fields: [numberField("r =", r, "cm", 2, { slips: [{ value: V / (PI * h), hint: "Das ist r². Ziehe noch die Wurzel." }] })],
            steps: [`r² = V : (π · h) = ${V} : (π · ${fmt(h, 1)}) ≈ ${fmt(V / (PI * h), 3)}`, `<strong>r = ${sqrtHtml(fmt(V / (PI * h), 3))} cm ≈ ${fmtUnit(r, "cm")}</strong>`],
            meta: { kind, h, V },
          };
        }
        const litres = rng.pick([0.1, 0.12, 0.15, 0.2]);
        const d = rng.pick([5, 6, 7, 8]);
        const V = litres * 1000;
        const r = d / 2;
        const h = (3 * V) / (PI * r * r);
        return {
          prompt: `Ein kegelförmiges Sektglas soll bis zum Rand ${fmt(litres, 2)} l fassen. Die Öffnung hat innen einen Durchmesser von ${d} cm. Wie tief muss der Kelch innen sein?`,
          given: [`V = ${fmtUnit(litres, "l", 2)}`, `d = ${d} cm`, "1 l = 1000 cm³"],
          fields: [
            numberField("h =", h, "cm", 2, {
              slips: [
                { value: V / (PI * r * r), hint: "Der Kelch ist ein Kegel: h = 3V : (πr²), das ⅓ fehlt." },
                { value: (3 * V) / (PI * d * d), hint: "Rechne mit dem Radius r = d : 2." },
                { value: (3 * litres) / (PI * r * r), hint: "Rechne die Liter zuerst in cm³ um: 1 l = 1000 cm³." },
              ],
            }),
          ],
          steps: [
            `V = ${fmt(litres, 2)} l = ${fmt(V, 0)} cm³; r = ${d} cm : 2 = ${fmtUnit(r, "cm", 1)}; G = π · ${fmt(r, 1)}² cm² ≈ ${fmtUnit(PI * r * r, "cm²")}`,
            `V = ⅓ · G · h, also h = 3V : G = ${fmt(3 * V, 0)} : ${fmt(PI * r * r, 2)}`,
            `<strong>h ≈ ${fmtUnit(h, "cm")}</strong>`,
          ],
          meta: { litres, d },
        };
      },
    },
    {
      id: "kugel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const useDiameter = rng.next() < 0.5;
          const value = rng.stepped(1, 12, 0.5);
          const r = useDiameter ? value / 2 : value;
          const V = (4 / 3) * PI * r ** 3;
          const O = 4 * PI * r * r;
          return {
            prompt: `Eine Kugel hat ${useDiameter ? `den Durchmesser d = ${fmt(value, 1)} cm` : `den Radius r = ${fmt(value, 1)} cm`}. Berechne ihr Volumen und ihre Oberfläche.`,
            given: [useDiameter ? `d = ${fmtUnit(value, "cm", 1)}` : `r = ${fmtUnit(value, "cm", 1)}`],
            formulaHint: `${useDiameter ? "r = d : 2; " : ""}V = ${frac(4, 3)} · π · r³; O = 4 · π · r²`,
            fields: [
              numberField("V =", V, "cm³", 2, {
                slips: [
                  { value: (4 / 3) * PI * r * r, hint: "Im Volumen steht r³, nicht r²." },
                  ...(useDiameter ? [{ value: (4 / 3) * PI * value ** 3, hint: "Halbiere zuerst den Durchmesser: r = d : 2." }] : []),
                ],
              }),
              numberField("O =", O, "cm²", 2, { slips: [{ value: PI * r * r, hint: "Das ist ein Großkreis. Die Kugeloberfläche ist viermal so groß: 4πr²." }] }),
            ],
            steps: [
              `${useDiameter ? `r = ${fmt(value, 1)} cm : 2 = ${fmtUnit(r, "cm", 2)}; ` : ""}r³ = ${fmt(r ** 3, 3)}, r² = ${fmt(r * r, 2)}`,
              `V = ${frac(4, 3)} · π · ${fmt(r ** 3, 3)} cm³ ≈ ${fmtUnit(V, "cm³")}`,
              `<strong>V ≈ ${fmtUnit(V, "cm³")}, O = 4 · π · ${fmt(r * r, 2)} cm² ≈ ${fmtUnit(O, "cm²")}</strong>`,
            ],
            meta: { r },
          };
        }
        if (rng.next() < 0.5) {
          const a = rng.stepped(4, 20, 1);
          const r = a / 2;
          const V = (4 / 3) * PI * r ** 3;
          const waste = (1 - V / a ** 3) * 100;
          return {
            prompt: `Aus einem Holzwürfel mit der Kantenlänge ${a} cm wird die größtmögliche Kugel gedrechselt. Berechne das Volumen der Kugel und wie viel Prozent des Holzes dabei als Späne abfallen.`,
            given: [`Würfel a = ${a} cm`],
            fields: [
              numberField("V =", V, "cm³", 1, { slips: [{ value: (4 / 3) * PI * a ** 3, hint: "Der Durchmesser der Kugel ist die Kantenlänge: r = a : 2." }] }),
              numberField("Abfall =", waste, "%", 1, { slips: [{ value: 100 - waste, hint: "So viel Prozent des Würfels nimmt die Kugel ein. Gefragt ist der Rest." }] }),
            ],
            steps: [
              `Die Kugel berührt alle sechs Würfelflächen: d = a = ${a} cm, r = ${fmt(r, 1)} cm.`,
              `V = ${frac(4, 3)} · π · ${fmt(r, 1)}³ cm³ ≈ ${fmtUnit(V, "cm³", 1)}; Würfel: ${a}³ cm³ = ${fmt(a ** 3, 0)} cm³`,
              `Anteil der Kugel: ${fmt(V, 1)} : ${fmt(a ** 3, 0)} ≈ ${fmt(100 - waste, 1)} %`,
              `<strong>V ≈ ${fmtUnit(V, "cm³", 1)}, Abfall ≈ ${fmt(waste, 1)} %</strong>`,
            ],
            meta: { variant: 0, a },
          };
        }
        const O = rng.pick([1250, 1400, 1500, 1600, 1800]);
        const r = Math.sqrt(O / (4 * PI));
        const V = (4 / 3) * PI * r ** 3;
        return {
          prompt: `Die Oberfläche eines Balls beträgt ${fmt(O, 0)} cm². Berechne seinen Radius und sein Volumen in Litern.`,
          given: [`O = ${fmt(O, 0)} cm²`, "1 l = 1000 cm³"],
          fields: [
            numberField("r =", r, "cm", 2, {
              slips: [
                { value: O / (4 * PI), hint: "Das ist r². Ziehe noch die Wurzel." },
                { value: Math.sqrt(O / PI), hint: "Die Kugeloberfläche ist 4πr², nicht πr²." },
              ],
            }),
            numberField("V =", V / 1000, "l", 2, { slips: [{ value: V, hint: "Das sind cm³. 1 l = 1000 cm³." }] }),
          ],
          steps: [
            `O = 4πr², also r = ${sqrtHtml(`${fmt(O, 0)} : (4π)`)} cm ≈ ${fmtUnit(r, "cm")}`,
            `V = ${frac(4, 3)} · π · ${fmt(r, 2)}³ cm³ ≈ ${fmtUnit(V, "cm³", 0)}`,
            `<strong>r ≈ ${fmtUnit(r, "cm")}, V ≈ ${fmtUnit(V / 1000, "l")}</strong>`,
          ],
          meta: { variant: 1, O },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erklärst mit Cavalieri, warum V = G · h, ⅓ · G · h und ⁴⁄₃πr³ gilt, und stellst die Formeln nach jeder Länge um.",
};

// 6.4 Zusammengesetzte Körper ───────────────────────────────────────────────

const COMPOSITE_MODELS = ["Silo: Zylinder + Kegeldach", "Turm: Zylinder + Halbkugel", "Eistüte: Kegel + Halbkugel", "Kapsel: Halbkugeln + Zylinder", "Werkstück: Zylinder mit Kegelbohrung"];

const zusammengesetzt: Lesson = {
  id: "rg-4-zusammengesetzt",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "6.4 Zusammengesetzte Körper",
  subtitle: "Silo, Eistüte und Werkstück",
  tracks: ["II_III"],
  lehrplan: `${LP}, Volumen und Oberfläche zusammengesetzter Körper, Modellieren`,
  whyItMatters:
    "Kaum ein echter Gegenstand ist ein einziger Grundkörper: Ein Silo ist Zylinder plus Kegeldach, ein Werkstück ein Quader mit Bohrung. Wer zerlegt, addiert und abzieht, berechnet auch solche Körper sicher.",
  explanationHtml: `
    <p>Einen <strong>zusammengesetzten Körper</strong> zerlegst du in Grundkörper, deren Formeln du kennst:</p>
    <ol class="steps">
      <li><strong>Skizze und Zerlegung:</strong> Welche Teilkörper gibt es? Welche Maße gehören zu welchem Teil (gemeinsamer Radius, Teilhöhen)?</li>
      <li><strong>Volumen:</strong> Teilvolumen <strong>addieren</strong>; was ausgebohrt oder ausgeschnitten ist, <strong>abziehen</strong>.</li>
      <li><strong>Oberfläche:</strong> Nur Flächen, die man von außen berühren kann, zählen. Wo zwei Teile aneinanderstoßen, fällt die Berührfläche bei beiden weg. Bei einer Bohrung fehlt ein Stück der Deckfläche, dafür kommt die Innenwand der Bohrung dazu.</li>
      <li><strong>Einheiten:</strong> 1 l = 1 dm³ = 1000 cm³, 1 m³ = 1000 l. Das Ergebnis sinnvoll runden und im Sachzusammenhang deuten.</li>
    </ol>
    <div class="example">Beispiel Silo: Zylinder (r = 3 m, h = 10 m) mit kegelförmigem Dach (Höhe 4 m), flacher Boden. V = π · 3² · 10 m³ + ⅓ · π · 3² · 4 m³ = 90π m³ + 12π m³ = 102π m³ ≈ 320,44 m³. Für die Oberfläche: Boden π · 3² m² ≈ 28,27 m², Zylindermantel 2π · 3 · 10 m² ≈ 188,50 m², Dach π · 3 · 5 m² ≈ 47,12 m² (s = ${sqrtHtml("9 + 16")} m = 5 m), zusammen O = 84π m² ≈ 263,89 m². Der Kreis zwischen Zylinder und Dach liegt innen und zählt nicht.</div>
    <p>Für Halbkugeln brauchst du die halben Kugelformeln: V = ⅔ · π · r³ und die gewölbte Fläche 2 · π · r².</p>
    <div class="merke"><strong>Merke:</strong> Volumen: Teile addieren, Hohlräume abziehen. Oberfläche: nur die Außenflächen; Berührflächen fallen weg, Innenwände von Bohrungen kommen dazu.</div>
  `,
  formulas: [
    { name: "Volumen zusammengesetzt", html: "aufgesetzt: V = V₁ + V₂ · ausgebohrt: V = V₁ − V₂", quantities: "Teilkörper einzeln berechnen" },
    { name: "Oberfläche zusammengesetzt", html: "O = Summe der Außenflächen", quantities: "ohne Berührflächen, mit den Innenwänden von Bohrungen" },
    { name: "Halbkugel", html: "V = ⅔ · π · r³ · gewölbte Fläche 2 · π · r²", quantities: "die Hälfte der Kugel" },
  ],
  quiz: {
    question: "Auf einen Zylinder wird ein Kegel mit gleichem Radius gesetzt. Aus welchen Flächen besteht die Oberfläche des neuen Körpers?",
    options: [
      "aus der Grundfläche, dem Zylindermantel und dem Kegelmantel",
      "aus zwei Kreisen, dem Zylindermantel und dem Kegelmantel",
      "aus der Oberfläche des Zylinders und der des Kegels",
      "nur aus dem Zylindermantel und dem Kegelmantel",
    ],
    correctIndex: 0,
    explanation: "Der Kreis, in dem sich Zylinder und Kegel berühren, liegt innen und zählt nicht. Außen bleiben der Boden, der Zylindermantel und der Kegelmantel.",
  },
  lab: {
    kind: "composite-solid",
    title: "Labor: Körperbaukasten",
    intro: "Setze aus Zylinder, Kegel und Halbkugel einen Körper zusammen oder bohre ihn aus. Rechts stehen die Teilvolumen und die Flächen, die zur Oberfläche zählen; gestrichelt sind die Berührkreise innen.",
    params: [
      { type: "choice", key: "model", label: "Körper", options: COMPOSITE_MODELS.map((label, value) => ({ value, label })), value: 0 },
      { type: "range", key: "r", label: "Radius r", unit: "cm", min: 1, max: 6, step: 0.1, value: 3, digits: 1 },
      { type: "range", key: "h", label: "Zylinderhöhe h", unit: "cm", min: 1, max: 15, step: 0.1, value: 6, digits: 1, showIf: (v) => v.model !== 2 },
      { type: "range", key: "k", label: "Kegelhöhe k", unit: "cm", min: 1, max: 15, step: 0.1, value: 3, digits: 1, showIf: (v) => v.model === 0 || v.model === 2 },
      { type: "range", key: "t", label: "Bohrtiefe (Anteil von h)", unit: "%", min: 10, max: 100, step: 5, value: 50, showIf: (v) => v.model === 4 },
    ],
    readouts: [
      { key: "V", label: "Volumen V", unit: "cm³", digits: 1, emphasis: true, compute: (v) => compositeSolid(v).V },
      { key: "l", label: "Inhalt", unit: "l", digits: 3, compute: (v) => compositeSolid(v).V / 1000 },
      { key: "O", label: "Oberfläche O", unit: "cm²", digits: 1, compute: (v) => compositeSolid(v).O },
      {
        key: "faces",
        label: "Die Oberfläche besteht aus",
        compute: (v) => compositeSolid(v).faces.filter((face) => face.counts).map((face) => face.name).join(" + "),
      },
    ],
    goals: [
      {
        id: "liter",
        text: "Baue ein Silo-Modell (Zylinder mit Kegeldach), das genau 1 Liter fasst (±1 %).",
        check: (v) => v.model === 0 && near(compositeSolid(v).V, 1000, 0.01),
      },
      {
        id: "eistuete",
        text: "Baue eine Eistüte, deren Kegel genau so viel Eis fasst wie die Halbkugel obendrauf.",
        check: (v) => v.model === 2 && within(v.k, 2 * v.r, 1e-9),
      },
      {
        id: "kapsel",
        text: "Baue eine Kapsel mit r = 2 cm und 100 cm² Oberfläche (±1 %).",
        check: (v) => v.model === 3 && within(v.r, 2, 1e-9) && near(compositeSolid(v).O, 100, 0.01),
      },
    ],
  },
  exercises: [
    {
      id: "aufsetzen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const cone = rng.next() < 0.5;
          const r = rng.stepped(1, 6, 0.5);
          const h = rng.stepped(2, 12, 0.5);
          const k = rng.stepped(1, 8, 0.5);
          const s = Math.hypot(r, k);
          const cyl = PI * r * r * h;
          const top = cone ? (PI * r * r * k) / 3 : (2 / 3) * PI * r ** 3;
          const V = cyl + top;
          const topArea = cone ? PI * r * s : 2 * PI * r * r;
          const O = PI * r * r + 2 * PI * r * h + topArea;
          return {
            prompt: cone
              ? `Ein Körper besteht aus einem Zylinder (r = ${fmt(r, 1)} cm, h = ${fmt(h, 1)} cm) mit aufgesetztem Kegel (gleicher Radius, Höhe k = ${fmt(k, 1)} cm). Berechne Volumen und Oberfläche des Körpers.`
              : `Ein Körper besteht aus einem Zylinder (r = ${fmt(r, 1)} cm, h = ${fmt(h, 1)} cm) mit aufgesetzter Halbkugel vom gleichen Radius. Berechne Volumen und Oberfläche des Körpers.`,
            given: cone ? [`r = ${fmtUnit(r, "cm", 1)}`, `h = ${fmtUnit(h, "cm", 1)}`, `k = ${fmtUnit(k, "cm", 1)}`] : [`r = ${fmtUnit(r, "cm", 1)}`, `h = ${fmtUnit(h, "cm", 1)}`],
            formulaHint: cone
              ? `V = π r² h + ⅓ π r² k; O = π r² + 2π r h + π r s mit s = ${sqrtHtml("r² + k²")}`
              : "V = π r² h + ⅔ π r³; O = π r² + 2π r h + 2π r²",
            fields: [
              numberField("V =", V, "cm³", 1, {
                slips: [cone ? { value: cyl + 3 * top, hint: "Der Kegel ist ein Spitzkörper: ⅓ · π r² · k." } : { value: cyl + 2 * top, hint: "Oben sitzt nur eine Halbkugel: ⅔ · π r³." }],
              }),
              numberField("O =", O, "cm²", 1, {
                slips: [
                  { value: O + PI * r * r, hint: "Der Kreis zwischen Zylinder und Aufsatz liegt innen und zählt nicht zur Oberfläche." },
                  ...(cone ? [{ value: O - topArea + PI * r * k, hint: "Für den Kegelmantel brauchst du die Mantellinie s, nicht die Höhe k." }] : []),
                ],
              }),
            ],
            steps: [
              `Zylinder: π · ${fmt(r, 1)}² · ${fmt(h, 1)} cm³ ≈ ${fmtUnit(cyl, "cm³", 1)}; ${cone ? `Kegel: ⅓ · π · ${fmt(r, 1)}² · ${fmt(k, 1)} cm³` : `Halbkugel: ⅔ · π · ${fmt(r, 1)}³ cm³`} ≈ ${fmtUnit(top, "cm³", 1)}`,
              `Außenflächen: Boden ${fmt(PI * r * r, 1)} cm², Zylindermantel ${fmt(2 * PI * r * h, 1)} cm², ${cone ? `Kegelmantel π · ${fmt(r, 1)} · ${fmt(s, 2)} cm²` : "Halbkugel 2π r²"} ≈ ${fmtUnit(topArea, "cm²", 1)}. Der Berührkreis zählt nicht.`,
              `<strong>V ≈ ${fmtUnit(V, "cm³", 1)}, O ≈ ${fmtUnit(O, "cm²", 1)}</strong>`,
            ],
            meta: { cone: cone ? 1 : 0, r, h, k },
          };
        }
        const d = rng.pick([4, 5, 6, 8]);
        const h = rng.pick([8, 10, 12, 15]);
        const k = rng.pick([1.5, 2, 2.5, 3]);
        const r = d / 2;
        const s = Math.hypot(r, k);
        const V = PI * r * r * h + (PI * r * r * k) / 3;
        const sheet = 2 * PI * r * h + PI * r * s;
        return {
          prompt: `Ein Getreidesilo besteht aus einem Zylinder (Durchmesser ${d} m, Höhe ${h} m) mit einem kegelförmigen Dach (Dachhöhe ${fmt(k, 1)} m). Wie viele Kubikmeter fasst das Silo einschließlich Dachraum? Wie viele Quadratmeter Blech braucht man für Wand und Dach, wenn der Boden aus Beton ist?`,
          given: [`d = ${d} m`, `h = ${h} m`, `Dachhöhe ${fmtUnit(k, "m", 1)}`],
          fields: [
            numberField("V =", V, "m³", 1, { slips: [{ value: PI * r * r * h, hint: "Der Dachraum gehört dazu: Addiere den Kegel ⅓ · π r² · k." }] }),
            numberField("Blech =", sheet, "m²", 1, {
              slips: [
                { value: sheet + PI * r * r, hint: "Der Boden ist aus Beton und braucht kein Blech." },
                { value: 2 * PI * r * h + PI * r * k, hint: "Das Dach ist schräg: Nimm die Mantellinie s = √(r² + k²)." },
              ],
            }),
          ],
          steps: [
            `r = ${fmt(r, 1)} m. V = π · ${fmt(r, 1)}² · ${h} m³ + ⅓ · π · ${fmt(r, 1)}² · ${fmt(k, 1)} m³ ≈ ${fmtUnit(V, "m³", 1)}`,
            `s = ${sqrtHtml(`${fmt(r, 1)}² + ${fmt(k, 1)}²`)} m ≈ ${fmtUnit(s, "m")}; Wand 2π · ${fmt(r, 1)} · ${h} m² ≈ ${fmtUnit(2 * PI * r * h, "m²", 1)}, Dach π · ${fmt(r, 1)} · ${fmt(s, 2)} m² ≈ ${fmtUnit(PI * r * s, "m²", 1)}`,
            `<strong>V ≈ ${fmtUnit(V, "m³", 1)}, Blech ≈ ${fmtUnit(sheet, "m²", 1)}</strong>`,
          ],
          meta: { d, h, k },
        };
      },
    },
    {
      id: "aushoehlen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.stepped(4, 12, 1);
          const d = rng.stepped(1, a - 2, 0.5);
          const r = d / 2;
          const V = a ** 3 - PI * r * r * a;
          const O = 6 * a * a - 2 * PI * r * r + 2 * PI * r * a;
          return {
            prompt: `Durch einen Würfel mit der Kantenlänge a = ${a} cm wird von der Mitte der Deckfläche bis zur Mitte der Grundfläche ein zylindrisches Loch mit dem Durchmesser d = ${fmt(d, 1)} cm gebohrt. Berechne Volumen und Oberfläche des Werkstücks.`,
            given: [`a = ${a} cm`, `d = ${fmtUnit(d, "cm", 1)}`],
            formulaHint: "V = a³ − π r² · a; O = 6a² − 2 · π r² + 2π r · a",
            fields: [
              numberField("V =", V, "cm³", 1, { slips: [{ value: a ** 3 - PI * d * d * a, hint: "Rechne mit dem Radius r = d : 2." }] }),
              numberField("O =", O, "cm²", 1, {
                slips: [
                  { value: 6 * a * a - 2 * PI * r * r, hint: "Die Innenwand der Bohrung gehört auch zur Oberfläche: 2πr · a." },
                  { value: 6 * a * a + 2 * PI * r * a, hint: "Oben und unten fehlt jetzt je ein Kreis: 2πr² abziehen." },
                ],
              }),
            ],
            steps: [
              `r = ${fmt(r, 2)} cm. V = ${a}³ cm³ − π · ${fmt(r, 2)}² · ${a} cm³ ≈ ${fmt(a ** 3, 0)} cm³ − ${fmt(PI * r * r * a, 1)} cm³`,
              `O = 6 · ${a}² cm² − 2 · π · ${fmt(r, 2)}² cm² + 2π · ${fmt(r, 2)} · ${a} cm²: zwei Kreise fehlen, die Innenwand kommt dazu.`,
              `<strong>V ≈ ${fmtUnit(V, "cm³", 1)}, O ≈ ${fmtUnit(O, "cm²", 1)}</strong>`,
            ],
            meta: { a, d },
          };
        }
        const d = rng.pick([6, 8, 10, 12]);
        const h = rng.pick([5, 6, 8, 10]);
        const depth = rng.stepped(2, h, 0.5);
        const r = d / 2;
        const V = PI * r * r * h - (PI * r * r * depth) / 3;
        const m = (V * 7.85) / 1000;
        return {
          prompt: `Ein Werkstück aus Stahl ist ein Zylinder (Durchmesser ${d} cm, Höhe ${h} cm), in den von oben eine kegelförmige Vertiefung mit dem gleichen Durchmesser und der Tiefe ${fmt(depth, 1)} cm gefräst ist. Berechne Volumen und Masse des Werkstücks (Stahl: 7,85 g pro cm³).`,
          given: [`d = ${d} cm`, `h = ${h} cm`, `Tiefe ${fmtUnit(depth, "cm", 1)}`, "ρ = 7,85 g/cm³"],
          fields: [
            numberField("V =", V, "cm³", 1, {
              slips: [
                { value: PI * r * r * h + (PI * r * r * depth) / 3, hint: "Die Vertiefung fehlt im Werkstück: Ihr Volumen wird abgezogen." },
                { value: PI * r * r * (h - depth), hint: "Die Vertiefung ist ein Kegel: ⅓ · π r² · Tiefe." },
              ],
            }),
            numberField("m =", m, "kg", 2, { slips: [{ value: V * 7.85, hint: "Das sind Gramm. 1 kg = 1000 g." }] }),
          ],
          steps: [
            `Zylinder: π · ${fmt(r, 1)}² · ${h} cm³ ≈ ${fmtUnit(PI * r * r * h, "cm³", 1)}; Kegel: ⅓ · π · ${fmt(r, 1)}² · ${fmt(depth, 1)} cm³ ≈ ${fmtUnit((PI * r * r * depth) / 3, "cm³", 1)}`,
            `V ≈ ${fmtUnit(V, "cm³", 1)}; m = ${fmt(V, 1)} cm³ · 7,85 g/cm³ ≈ ${fmt(V * 7.85, 0)} g`,
            `<strong>V ≈ ${fmtUnit(V, "cm³", 1)}, m ≈ ${fmtUnit(m, "kg")}</strong>`,
          ],
          meta: { d, h, depth },
        };
      },
    },
    {
      id: "liter",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.stepped(5, 20, 1);
          const h = rng.stepped(5, 40, 1);
          const V = (2 / 3) * PI * r ** 3 + PI * r * r * h;
          return {
            prompt: `Ein Behälter besteht aus einer Halbkugel (r = ${r} cm) als Boden und einem aufgesetzten Zylinder mit gleichem Radius und der Höhe h = ${h} cm. Wie viele Liter fasst er?`,
            given: [`r = ${r} cm`, `h = ${h} cm`, "1 l = 1000 cm³"],
            formulaHint: "V = ⅔ · π · r³ + π · r² · h; 1 l = 1000 cm³",
            fields: [
              numberField("V =", V / 1000, "l", 2, {
                slips: [
                  { value: V, hint: "Das sind cm³. 1 l = 1000 cm³." },
                  { value: ((4 / 3) * PI * r ** 3 + PI * r * r * h) / 1000, hint: "Unten ist nur eine Halbkugel: ⅔ · π · r³." },
                ],
              }),
            ],
            steps: [
              `Halbkugel: ⅔ · π · ${r}³ cm³ ≈ ${fmtUnit((2 / 3) * PI * r ** 3, "cm³", 1)}; Zylinder: π · ${r}² · ${h} cm³ ≈ ${fmtUnit(PI * r * r * h, "cm³", 1)}`,
              `V ≈ ${fmtUnit(V, "cm³", 1)} = ${fmt(V, 1)} : 1000 l`,
              `<strong>V ≈ ${fmtUnit(V / 1000, "l")}</strong>`,
            ],
            meta: { r, h },
          };
        }
        const d = rng.pick([8, 10, 12, 14]);
        const h = rng.pick([4, 5, 6, 8]);
        const q = rng.pick([20, 25, 40, 50]);
        const r = d / 2;
        const V = PI * r * r * h + (2 / 3) * PI * r ** 3;
        const seconds = (V * 1000) / q;
        return {
          prompt: `Der Behälter eines Wasserturms ist ein Zylinder (Durchmesser ${d} m, Höhe ${h} m) mit einer Halbkugel als Boden. Eine Pumpe füllt ${q} Liter pro Sekunde ein. Wie viel Wasser fasst der Behälter, und wie viele Minuten dauert es, ihn leer bis voll zu füllen?`,
          given: [`d = ${d} m`, `h = ${h} m`, `${q} l pro Sekunde`, "1 m³ = 1000 l"],
          fields: [
            numberField("V =", V, "m³", 1, { slips: [{ value: PI * r * r * h + (4 / 3) * PI * r ** 3, hint: "Unten ist nur eine Halbkugel: ⅔ · π · r³." }] }),
            numberField("t =", seconds / 60, "min", 0, {
              slips: [
                { value: seconds, hint: "Das sind Sekunden. 1 min = 60 s." },
                { value: V / q / 60, hint: "Rechne die m³ zuerst in Liter um: 1 m³ = 1000 l." },
              ],
            }),
          ],
          steps: [
            `r = ${r} m. V = π · ${r}² · ${h} m³ + ⅔ · π · ${r}³ m³ ≈ ${fmtUnit(V, "m³", 1)} ≈ ${fmt(V * 1000, 0)} l`,
            `t = ${fmt(V * 1000, 0)} l : ${q} l/s ≈ ${fmt(seconds, 0)} s`,
            `<strong>V ≈ ${fmtUnit(V, "m³", 1)}, t ≈ ${fmt(seconds, 0)} s : 60 ≈ ${fmt(seconds / 60, 0)} min</strong>`,
          ],
          meta: { d, h, q },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du zerlegst zusammengesetzte Körper, addierst und ziehst ab und weißt genau, welche Flächen zur Oberfläche zählen.",
};

// 6.5 Funktionale Abhängigkeiten und Extremwerte bei Körpern ────────────────

/** The quantity of the extremum lab at the current x, as text. */
function extremumText(v: LabValues): string {
  if (!extremumInDomain(v)) return "x liegt nicht in D";
  const name = v.task === 1 || v.qty === 1 ? "V" : "M";
  return `${name}(${fmt(extremumX(v), 1)}) = ${fmt(extremumAt(v, extremumX(v)), 2)} ${name === "V" ? "cm³" : "cm²"}`;
}

/** Cone pairs whose slope h : r has at most two decimals. */
const CONES: Array<[number, number]> = [[4, 6], [4, 8], [4, 10], [5, 10], [6, 9], [6, 12], [8, 12], [10, 15], [5, 7.5], [8, 10]];
const BOX_SIDES = [12, 16, 18, 20, 22, 24, 25, 26, 28, 30];

/** The box volume x · (a − 2x)² at whole x, and the best whole x. */
export function boxTable(a: number): { values: number[]; best: number } {
  const values: number[] = [];
  for (let x = 1; 2 * x < a; x++) values.push(x * (a - 2 * x) ** 2);
  const best = values.indexOf(Math.max(...values)) + 1;
  return { values, best };
}

const extremwerte: Lesson = {
  id: "rg-5-extremwerte",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "6.5 Funktionale Abhängigkeiten und Extremwerte bei Körpern",
  subtitle: "Der größte Zylinder im Kegel",
  tracks: ["II_III"],
  lehrplan: `${LP}, funktionale Abhängigkeiten und Extremwertprobleme bei Körpern`,
  whyItMatters:
    "Welcher Zylinder im Kegel hat den größten Mantel, welche Schachtel aus einem Karton fasst am meisten? Hängen die Maße eines Körpers von x ab, werden Volumen und Oberfläche zu Funktionen von x, in der Abschlussprüfung heißt das „in Abhängigkeit von x“.",
  explanationHtml: `
    <p>Hängen die Maße eines Körpers von einer Variablen x ab, sind auch Volumen und Oberfläche <strong>Funktionen von x</strong>. So gehst du vor:</p>
    <ol class="steps">
      <li>Die Maße in Abhängigkeit von x aufschreiben, oft mit dem Strahlensatz oder mit Pythagoras.</li>
      <li>Die <strong>Definitionsmenge</strong> angeben: Für welche x gibt es den Körper? Alle Längen müssen größer als 0 sein.</li>
      <li>Den Term für V(x) oder O(x) aufstellen und vereinfachen.</li>
      <li>Den Extremwert bestimmen: Ist der Term quadratisch, mit der <strong>quadratischen Ergänzung</strong> (Scheitel, wie in der 8. Klasse; mehr dazu in Etappe 7), sonst mit einer <strong>Wertetabelle</strong> oder dem Graphen.</li>
    </ol>
    <div class="example">Beispiel: Einem Kegel mit r = 6 cm und h = 9 cm werden Zylinder mit dem Radius x cm einbeschrieben. Im Axialschnitt gilt nach dem Strahlensatz h(x) : 9 = (6 − x) : 6, also h(x) = 9 − 1,5x mit 0 &lt; x &lt; 6. Mantelfläche: M(x) = 2πx · (9 − 1,5x) = −3πx² + 18πx = −3π(x − 3)² + 27π. Der Zylinder mit x = 3 cm und h = 4,5 cm hat den größten Mantel: M<sub>max</sub> = 27π cm² ≈ 84,82 cm².</div>
    <p>Das Volumen V(x) = πx² · (9 − 1,5x) ist nicht quadratisch. Die Wertetabelle zeigt sein Maximum bei x = 4 (genauer geht es mit kleineren Schritten oder dem Graphen):</p>
    <table class="mini">
      <tr><th>x in cm</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr>
      <tr><th>V(x) in cm³</th><td>23,56</td><td>75,40</td><td>127,23</td><td>150,80</td><td>117,81</td></tr>
    </table>
    <div class="merke"><strong>Merke:</strong> Maße in Abhängigkeit von x, Definitionsmenge, Term, dann Scheitel (bei quadratischen Termen) oder Wertetabelle. Das Ergebnis im Sachzusammenhang deuten.</div>
  `,
  formulas: [
    { name: "Zylinder im Kegel", html: "h(x) = h<sub>K</sub> · (1 − x : r<sub>K</sub>) mit 0 &lt; x &lt; r<sub>K</sub>", quantities: "Strahlensatz im Axialschnitt" },
    { name: "Extremwert eines quadratischen Terms", html: "a · (x − x<sub>S</sub>)² + y<sub>S</sub> hat bei x = x<sub>S</sub> den Extremwert y<sub>S</sub>", quantities: "a < 0: Maximum, a > 0: Minimum" },
    { name: "Schachtel aus Karton", html: "V(x) = x · (a − 2x)² mit 0 &lt; x &lt; a : 2", quantities: "a Kartonseite, x Seite der ausgeschnittenen Quadrate" },
  ],
  quiz: {
    question: "Einem Kegel mit r = 6 cm und h = 9 cm werden Zylinder mit dem Radius x cm einbeschrieben. Welche Werte kann x annehmen?",
    options: ["0 < x < 6", "0 < x < 9", "0 ≤ x ≤ 6", "alle x > 0"],
    correctIndex: 0,
    explanation: "Der Zylinder muss in den Kegel passen: Sein Radius ist kleiner als 6 cm. Bei x = 0 und bei x = 6 cm gäbe es keinen Zylinder mehr, also gilt 0 < x < 6.",
  },
  lab: {
    kind: "solid-extremum",
    title: "Labor: Das Beste herausholen",
    intro: "Ändere x und beobachte, wie sich der Körper und der Graph mitändern. Der Punkt auf dem Graphen zeigt den aktuellen Wert. Die Ecke des Zylinders oder des ausgeschnittenen Quadrats kannst du ziehen.",
    params: [
      { type: "choice", key: "task", label: "Aufgabe", options: [{ value: 0, label: "Zylinder im Kegel" }, { value: 1, label: "Schachtel aus Karton" }], value: 0 },
      { type: "choice", key: "qty", label: "Größe", options: [{ value: 0, label: "Mantelfläche M(x)" }, { value: 1, label: "Volumen V(x)" }], value: 0, showIf: (v) => v.task === 0 },
      { type: "range", key: "R", label: "Kegelradius", unit: "cm", min: 3, max: 8, step: 0.5, value: 6, digits: 1, showIf: (v) => v.task === 0 },
      { type: "range", key: "hk", label: "Kegelhöhe", unit: "cm", min: 4, max: 12, step: 0.5, value: 9, digits: 1, showIf: (v) => v.task === 0 },
      { type: "range", key: "x", label: "Zylinderradius x", unit: "cm", min: 0, max: 8, step: 0.1, value: 1, digits: 1, showIf: (v) => v.task === 0 },
      { type: "range", key: "L", label: "Kartonseite a", unit: "cm", min: 10, max: 30, step: 1, value: 20, showIf: (v) => v.task === 1 },
      { type: "range", key: "c", label: "ausgeschnittenes Quadrat x", unit: "cm", min: 0, max: 15, step: 0.1, value: 1, digits: 1, showIf: (v) => v.task === 1 },
    ],
    readouts: [
      { key: "D", label: "Definitionsmenge", compute: (v) => `0 < x < ${fmt(extremumBound(v), 1)}` },
      {
        key: "dep",
        label: "Maße in Abhängigkeit von x",
        compute: (v) => {
          if (!extremumInDomain(v)) return "x liegt nicht in D";
          const x = extremumX(v);
          return v.task === 1 ? `Grundkante a − 2x = ${fmt(v.L - 2 * x, 1)} cm, Höhe x = ${fmt(x, 1)} cm` : `Radius x = ${fmt(x, 1)} cm, Höhe h(x) = ${fmt(v.hk * (1 - x / v.R), 2)} cm`;
        },
      },
      { key: "f", label: "aktueller Wert", emphasis: true, compute: (v) => extremumText(v) },
      { key: "best", label: "größtmöglicher Wert", compute: (v) => `${fmt(extremumBest(v).value, 2)} ${v.task === 1 || v.qty === 1 ? "cm³" : "cm²"}` },
    ],
    goals: [
      {
        id: "mantel",
        text: "Finde den Zylinder mit der größten Mantelfläche. Wie groß ist x im Vergleich zum Kegelradius?",
        check: (v) => v.task === 0 && v.qty === 0 && extremumInDomain(v) && extremumAt(v, v.x) >= 0.999 * extremumBest(v).value,
      },
      {
        id: "volumen",
        text: "Finde den Zylinder mit dem größten Volumen. Liegt er beim selben x wie der größte Mantel?",
        check: (v) => v.task === 0 && v.qty === 1 && extremumInDomain(v) && extremumAt(v, v.x) >= 0.999 * extremumBest(v).value,
      },
      {
        id: "schachtel",
        text: "Schneide die Ecken so aus, dass die Schachtel möglichst viel fasst.",
        check: (v) => v.task === 1 && extremumInDomain(v) && extremumAt(v, v.c) >= 0.999 * extremumBest(v).value,
      },
    ],
  },
  exercises: [
    {
      id: "zylinder-im-kegel",
      make: (rng, level): ExerciseTask => {
        const [R, H] = rng.pick(CONES);
        const m = H / R;
        const best = (PI * R * H) / 2;
        const vertex = `−${fmt(2 * m, 2)}π(x − ${fmt(R / 2, 2)})² + ${fmt((R * H) / 2, 2)}π`;
        const square = [
          `M(x) = 2πx · (${fmt(H, 1)} − ${fmt(m, 2)}x) = −${fmt(2 * m, 2)}π · (x² − ${fmt(R, 1)}x)`,
          `= −${fmt(2 * m, 2)}π · [(x − ${fmt(R / 2, 2)})² − ${fmt((R * R) / 4, 2)}] = ${vertex}`,
        ];
        const maxSlips = [
          { value: PI * R * H, hint: `Setze x = ${fmt(R / 2, 2)} in h(x) ein: Die Zylinderhöhe ist dann nur noch die halbe Kegelhöhe.` },
          { value: (R * H) / 2, hint: "Der Mantel ist 2π · x · h(x): π gehört dazu." },
        ];
        if (level === 1) {
          return {
            prompt: `Einem Kegel mit dem Radius ${fmt(R, 1)} cm und der Höhe ${fmt(H, 1)} cm werden Zylinder mit dem Radius x cm einbeschrieben. Für ihre Höhe gilt h(x) = (${fmt(H, 1)} − ${fmt(m, 2)}x) cm. Für welches x ist die Mantelfläche M(x) = 2π · x · h(x) am größten? Wie groß ist sie dann?`,
            given: [`h(x) = (${fmt(H, 1)} − ${fmt(m, 2)}x) cm`, `M(x) = 2π · x · (${fmt(H, 1)} − ${fmt(m, 2)}x) cm²`],
            formulaHint: `M(x) = −${fmt(2 * m, 2)}π · x² + ${fmt(2 * H, 1)}π · x: −${fmt(2 * m, 2)}π ausklammern und quadratisch ergänzen`,
            fields: [
              numberField("x =", R / 2, "cm", 2, { slips: [{ value: R, hint: "Bei x = r des Kegels hätte der Zylinder die Höhe 0." }] }),
              numberField("M<sub>max</sub> =", best, "cm²", 2, { slips: maxSlips }),
            ],
            steps: [...square, `<strong>x = ${fmt(R / 2, 2)} cm: M<sub>max</sub> = ${fmt((R * H) / 2, 2)}π cm² ≈ ${fmtUnit(best, "cm²")}</strong>`],
            meta: { R, H },
          };
        }
        const x0 = rng.int(1, R - 1);
        return {
          prompt: `Einem Kegel mit dem Grundkreisradius ${fmt(R, 1)} cm und der Höhe ${fmt(H, 1)} cm werden Zylinder einbeschrieben, deren Radius x cm beträgt. a) Gib die obere Grenze der Definitionsmenge an. b) Bestimme mit dem Strahlensatz die Höhe h(x) der Zylinder und berechne sie für x = ${x0}. c) Berechne den größtmöglichen Mantelflächeninhalt der Zylinder.`,
          given: [`Kegel: r = ${fmtUnit(R, "cm", 1)}, h = ${fmtUnit(H, "cm", 1)}`, "Zylinderradius x cm"],
          fields: [
            numberField("x <", R, "cm", 1),
            numberField(`h(${x0}) =`, H - m * x0, "cm", 2, { slips: [{ value: m * x0, hint: "Das ist, um wie viel der Zylinder niedriger als der Kegel ist. h(x) = Kegelhöhe minus dieses Stück." }] }),
            numberField("M<sub>max</sub> =", best, "cm²", 2, { slips: maxSlips }),
          ],
          steps: [
            `a) Der Zylinder muss in den Kegel passen: 0 &lt; x &lt; ${fmt(R, 1)}.`,
            `b) Im Axialschnitt: h(x) : ${fmt(H, 1)} = (${fmt(R, 1)} − x) : ${fmt(R, 1)}, also h(x) = (${fmt(H, 1)} − ${fmt(m, 2)}x) cm und h(${x0}) = ${fmtUnit(H - m * x0, "cm")}.`,
            `c) ${square[0]}`,
            square[1],
            `<strong>x &lt; ${fmt(R, 1)}; h(${x0}) = ${fmtUnit(H - m * x0, "cm")}; M<sub>max</sub> ≈ ${fmtUnit(best, "cm²")} für x = ${fmt(R / 2, 2)} cm</strong>`,
          ],
          meta: { R, H, x0 },
        };
      },
    },
    {
      id: "schachtel",
      make: (rng, level): ExerciseTask => {
        const a = rng.pick(BOX_SIDES);
        if (level === 1) {
          const x0 = rng.stepped(1, a / 2 - 1, 0.5);
          const V = x0 * (a - 2 * x0) ** 2;
          return {
            prompt: `Aus einem quadratischen Karton mit der Seitenlänge a = ${a} cm werden an den vier Ecken Quadrate mit der Seitenlänge x cm ausgeschnitten, dann werden die Ränder zu einer offenen Schachtel hochgeklappt. Gib die obere Grenze der Definitionsmenge an und berechne das Volumen der Schachtel für x = ${fmt(x0, 1)}.`,
            given: [`a = ${a} cm`, `V(x) = x · (${a} − 2x)² cm³`],
            formulaHint: "V(x) = x · (a − 2x)² mit 0 &lt; x &lt; a : 2",
            fields: [
              numberField("x <", a / 2, "cm", 1),
              numberField(`V(${fmt(x0, 1)}) =`, V, "cm³", 2, {
                slips: [
                  { value: x0 * (a - x0) ** 2, hint: "An jeder Seite werden zwei Quadrate abgeschnitten: Die Grundkante ist a − 2x." },
                  { value: (a - 2 * x0) ** 2, hint: "Das ist nur die Grundfläche. Die Höhe der Schachtel ist x." },
                ],
              }),
            ],
            steps: [
              `Die Grundfläche ist ein Quadrat mit der Kante ${a} − 2x, die Höhe ist x. Eine Schachtel entsteht nur für 0 &lt; x &lt; ${fmt(a / 2, 1)}.`,
              `V(${fmt(x0, 1)}) = ${fmt(x0, 1)} · (${a} − ${fmt(2 * x0, 1)})² = ${fmt(x0, 1)} · ${fmt(a - 2 * x0, 1)}²`,
              `<strong>x &lt; ${fmt(a / 2, 1)}; V = ${fmtUnit(V, "cm³")}</strong>`,
            ],
            meta: { a, x0 },
          };
        }
        const { values, best } = boxTable(a);
        return {
          prompt: `Aus einem quadratischen Karton mit ${a} cm Seitenlänge soll eine offene Schachtel entstehen: An den Ecken werden Quadrate mit der Seitenlänge x cm ausgeschnitten und die Ränder hochgeklappt. Bestimme mit einer Wertetabelle (Schrittweite 1 cm), für welches ganzzahlige x das Volumen am größten ist, und gib dieses Volumen an.`,
          given: [`Kartonseite ${a} cm`, "Schrittweite 1 cm"],
          fields: [
            numberField("x =", best, "cm", 0, { slips: [{ value: a / 2, hint: "Bei x = a : 2 bleibt keine Grundfläche übrig. Lies das größte V in der Tabelle ab." }] }),
            numberField("V =", values[best - 1], "cm³", 0, { slips: [{ value: (a - 2 * best) ** 2, hint: "Das ist nur die Grundfläche. Die Höhe der Schachtel ist x." }] }),
          ],
          steps: [
            `V(x) = x · (${a} − 2x)² mit 0 &lt; x &lt; ${fmt(a / 2, 1)}`,
            `Wertetabelle: ${values.map((value, i) => `V(${i + 1}) = ${fmt(value, 0)}`).join("; ")}`,
            `<strong>x = ${best} cm: V = ${fmt(values[best - 1], 0)} cm³</strong> (eine feinere Tabelle zeigt das genaue Maximum bei x ≈ ${fmt(a / 6, 2)} cm)`,
          ],
          meta: { a },
        };
      },
    },
    {
      id: "abhaengig",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.pick([4, 5, 6, 8, 10]);
          const k = rng.int(1, 2);
          const h = rng.int(1, k * r - 1);
          const xs = (k * r - h) / (2 * k);
          const b = (k * r - h) / k;
          const best = (PI * (k * r + h) ** 2) / (2 * k);
          const kx = k === 1 ? "x" : `${k}x`;
          return {
            prompt: `Ein Zylinder hat den Radius ${r} cm und die Höhe ${h} cm. Verkürzt man den Radius um x cm und verlängert zugleich die Höhe um ${kx} cm, entstehen neue Zylinder mit der Mantelfläche M(x) = 2π · (${r} − x) · (${h} + ${kx}) cm². Für welches x ist der Mantel am größten, und wie groß ist er dann?`,
            given: [`M(x) = 2π · (${r} − x) · (${h} + ${kx}) cm²`],
            formulaHint: "Ausmultiplizieren, den Faktor vor x² ausklammern und quadratisch ergänzen: Der Scheitel ist das Maximum.",
            fields: [
              numberField("x =", xs, "cm", 2),
              numberField("M<sub>max</sub> =", best, "cm²", 2, { slips: [{ value: 2 * PI * r * h, hint: "Das ist der Mantel des ursprünglichen Zylinders (x = 0)." }] }),
            ],
            steps: [
              `M(x) = 2π · (${quadratic(-k, k * r - h, r * h)}) = −${2 * k}π · (x² − ${b === 1 ? "" : fmt(b, 2)}x) + ${2 * r * h}π`,
              `= −${2 * k}π · (x − ${fmt(xs, 2)})² + ${fmt(best / PI, 2)}π`,
              `<strong>x = ${fmt(xs, 2)} cm: M<sub>max</sub> = ${fmt(best / PI, 2)}π cm² ≈ ${fmtUnit(best, "cm²")}</strong>`,
            ],
            meta: { r, h, k },
          };
        }
        const a = rng.int(3, 8);
        const b = a + 2 * rng.int(1, 4);
        const c = rng.int(3, 10);
        const xs = (b - a) / 2;
        const side = (a + b) / 2;
        const best = c * side * side;
        return {
          prompt: `Ein Quader hat die Grundkanten a = ${a} cm und b = ${b} cm und die Höhe c = ${c} cm. Die Kante a wird um x cm verlängert, die Kante b um x cm verkürzt; die Höhe bleibt gleich. Stelle das Volumen V(x) der neuen Quader auf. Für welches x ist das Volumen am größten? Wie groß ist es, und welche Form hat die Grundfläche dann?`,
          given: [`a = ${a} cm, b = ${b} cm, c = ${c} cm`, `neue Kanten: (${a} + x) cm und (${b} − x) cm`],
          fields: [
            numberField("x =", xs, "cm", 2),
            numberField("V<sub>max</sub> =", best, "cm³", 2, { slips: [{ value: a * b * c, hint: "Das ist das Volumen des ursprünglichen Quaders (x = 0)." }] }),
            choiceField("Grundfläche", ["ein Quadrat", "ein Rechteck, doppelt so lang wie breit", "ein Rechteck mit den alten Seiten"], 0),
          ],
          steps: [
            `V(x) = ${c} · (${a} + x) · (${b} − x) = ${c} · (${quadratic(-1, b - a, a * b)})`,
            `= −${c} · (x² − ${b - a}x) + ${c * a * b} = −${c} · (x − ${fmt(xs, 2)})² + ${fmt(best, 2)}`,
            `<strong>x = ${fmt(xs, 2)} cm: V<sub>max</sub> = ${fmtUnit(best, "cm³")}; beide Grundkanten sind ${fmt(side, 2)} cm lang, die Grundfläche ist ein Quadrat.</strong>`,
          ],
          meta: { a, b, c },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du stellst Volumen und Oberfläche in Abhängigkeit von x auf, gibst die Definitionsmenge an und findest das Maximum.",
};

export const STAGE_RAUMGEOMETRIE: Stage = {
  id: STAGE_ID,
  stageNumber: 6,
  title: "Raumgeometrie",
  subtitle: "Axialschnitte, Netze, Cavalieri, Volumen und Oberfläche, Extremwerte",
  icon: "🧊",
  accent: "#0891b2",
  badgeTitle: "Körper-Profi",
  lehrplanLabel: "LB 2 (nur Zweig II/III)",
  lessons: [axialschnitt, oberflaeche, volumen, zusammengesetzt, extremwerte],
};

