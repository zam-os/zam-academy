const RELATION = (p: number, q: number) => (p < q ? "<" : p > q ? ">" : "=");
import { fmt, frac, gcd } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import { lcm, reduce } from "../fraction-models";
import {
  choice as c,
  lab,
  makeLesson,
  output as o,
  range as r,
  task,
} from "./builders";
import { numberField as num, choiceField as pick } from "./helpers";

const L = (step: number, content: Parameters<typeof makeLesson>[3]) =>
  makeLesson(2, step, null, content);

/** A proper fraction with coprime numerator and denominator. */
function properFraction(rng: Rng, denominators: number[]): [number, number] {
  const d = rng.pick(denominators);
  let n = rng.int(1, d - 1);
  while (gcd(n, d) !== 1) n = rng.int(1, d - 1);
  return [n, d];
}

/** A money amount with both decimals, as on a price tag: "0,60". */

const ratio = (n: number, d: number) => {
  const [z, m] = reduce(n, d);
  return m === 1 ? `${z}`.replace("-", "−") : `${z}/${m}`.replace("-", "−");
};

const vergleichen = L(1, {
  id: "rz-10-vergleichen",
  title: "2.1 Rationale Zahlen vergleichen",
  subtitle: "Hauptnenner, Dezimalzahl und Lage auf der Zahlengeraden",
  whyItMatters:
    "Ist 3/4 l Saft mehr als 0,7 l? Beim Vergleichen musst du Brüche und Dezimalzahlen auf eine gemeinsame Form bringen.",
  explanationHtml: `<p>Gleichnamige Brüche vergleichst du am Zähler. Ungleichnamige Brüche erweiterst du zuerst auf einen <strong>gemeinsamen Nenner</strong> (am besten den Hauptnenner, also das kgV der Nenner). Dezimalzahlen vergleichst du Stelle für Stelle von links. Bei gemischten Darstellungen wandelst du alles in Dezimalzahlen um.</p><div class="example">${frac(3, 4)} und ${frac(2, 3)}: Hauptnenner 12, ${frac(9, 12)} &gt; ${frac(8, 12)}. Also ${frac(3, 4)} &gt; ${frac(2, 3)}.</div><p>Bei negativen Zahlen dreht sich die Beziehung für die Beträge um: −${frac(1, 2)} &lt; −${frac(1, 3)}, denn −${frac(1, 2)} liegt weiter links auf der Zahlengeraden.</p><div class="merke"><strong>Merke:</strong> Auf der Zahlengeraden liegt die kleinere Zahl immer links. Jede negative Zahl ist kleiner als jede positive.</div>`,
  formulas: [
    {
      name: "Gleichnamig machen",
      html: `${frac("a", "b")} und ${frac("c", "d")} auf den Nenner kgV(b; d) erweitern`,
      quantities: "kgV kleinstes gemeinsames Vielfaches, auch Hauptnenner",
    },
  ],
  quiz: {
    question: "Welche Aussage ist richtig?",
    options: ["−3/4 < −1/2", "−3/4 > −1/2", "−3/4 = −1/2"],
    correctIndex: 0,
    explanation:
      "−3/4 = −0,75 liegt weiter links auf der Zahlengeraden als −1/2 = −0,5.",
  },
  lab: lab(
    "compare",
    "Zwei Zahlen vergleichen",
    "Stelle zwei Brüche ein. Die Zahlengerade zeigt, welche Zahl links liegt; der Hauptnenner zeigt es rechnerisch.",
    [
      r("a", "Zähler der ersten Zahl", -12, 12, 1),
      r("b", "Nenner der ersten Zahl", 2, 12, 2),
      r("c", "Zähler der zweiten Zahl", -12, 12, 1),
      r("d", "Nenner der zweiten Zahl", 2, 12, 3),
    ],
    [
      o("relation", "Beziehung", (v) => RELATION(v.a * v.d, v.c * v.b)),
      o("common", "Hauptnenner", (v) => lcm(v.b, v.d), "", 0),
      o("ext", "Erweitert", (v) => {
        const h = lcm(v.b, v.d);
        return `${ratioRaw((v.a * h) / v.b, h)} und ${ratioRaw((v.c * h) / v.d, h)}`;
      }),
    ],
    [
      {
        id: "positiv",
        text: "Vergleiche 3/4 und 2/3.",
        check: (v) => v.a === 3 && v.b === 4 && v.c === 2 && v.d === 3,
      },
      {
        id: "negativ",
        text: "Vergleiche −1/2 und −1/3.",
        check: (v) => v.a === -1 && v.b === 2 && v.c === -1 && v.d === 3,
      },
      {
        id: "gleich",
        text: "Finde zwei wertgleiche Brüche mit den Nennern 4 und 6.",
        check: (v) => v.b === 4 && v.d === 6 && v.a * v.d === v.c * v.b,
      },
    ],
  ),
  exercises: [
    {
      id: "brueche",
      make: (rng, level) => {
        const first = properFraction(rng, [2, 3, 4, 5, 6, 8]);
        let a = first[0];
        const b = first[1];
        let [c0, d] = properFraction(rng, [3, 4, 5, 6, 8, 10]);
        while (a * d === c0 * b)
          [c0, d] = properFraction(rng, [3, 4, 5, 6, 8, 10]);
        if (level === 2) {
          a = -a;
          c0 = -c0;
        }
        const options = ["<", ">", "="];
        const rel = RELATION(a * d, c0 * b);
        const show = (x: number, y: number) =>
          `${x < 0 ? "−" : ""}${frac(Math.abs(x), y)}`;
        const h = lcm(b, d);
        return task(
          level,
          `Setze das richtige Zeichen: ${show(a, b)} ▢ ${show(c0, d)}.`,
          `Am Morgen zeigt das Thermometer ${show(a, b)} °C, am Abend ${show(c0, d)} °C. Setze das Zeichen: Morgenwert ▢ Abendwert.`,
          [pick("Zeichen", options, options.indexOf(rel))],
          "Erweitere beide Brüche auf den Hauptnenner und vergleiche die Zähler.",
          `Hauptnenner ${h}: ${ratioRaw((a * h) / b, h)} und ${ratioRaw((c0 * h) / d, h)}.`,
          `${show(a, b)} ${rel === "<" ? "&lt;" : rel === ">" ? "&gt;" : "="} ${show(c0, d)}.`,
          { a, b, c0, d },
        );
      },
    },
    {
      id: "bruch-und-dezimal",
      make: (rng, level) => {
        const [z, n] = properFraction(rng, [4, 5, 8, 10, 20]);
        let hundredths = rng.int(5, 95);
        while (hundredths * n === 100 * z) hundredths = rng.int(5, 95);
        const decimal = hundredths / 100;
        const bigger = z / n > decimal;
        if (level === 1)
          return task(
            level,
            `Welche Zahl ist größer: ${frac(z, n)} oder ${fmt(decimal)}?`,
            "",
            [pick("Größer ist", [`${z}/${n}`, fmt(decimal)], bigger ? 0 : 1)],
            "Schreibe den Bruch als Dezimalzahl und vergleiche die Stellen.",
            `${frac(z, n)} = ${fmt(z / n, 3)}.`,
            `${bigger ? `${z}/${n}` : fmt(decimal)} ist größer.`,
            { z, n, hundredths },
          );
        return task(
          level,
          "",
          `Saft A enthält ${frac(z, n)} Liter, Saft B enthält ${fmt(decimal)} Liter. Wie groß ist der Unterschied in Litern? Welcher Saft enthält mehr?`,
          [
            num("Unterschied =", Math.abs(z / n - decimal), "l", 3),
            pick("Mehr enthält", ["Saft A", "Saft B"], bigger ? 0 : 1),
          ],
          "Beide Zahlen als Dezimalzahl schreiben, dann die größere minus die kleinere.",
          `${frac(z, n)} = ${fmt(z / n, 3)}, Unterschied ${fmt(Math.abs(z / n - decimal), 3)}.`,
          `${bigger ? "Saft A" : "Saft B"}, ${fmt(Math.abs(z / n - decimal), 3)} l mehr.`,
          { z, n, hundredths },
        );
      },
    },
  ],
});

function ratioRaw(n: number, d: number): string {
  return `${n < 0 ? "−" : ""}${Math.abs(n)}/${d}`;
}

const NL_STEPS = [1 / 2, 1 / 4, 1 / 5, 1 / 10];
const nearly = (a: number, b: number) => Math.abs(a - b) < 1e-9;

const zahlengerade = L(2, {
  id: "rz-11-zahlengerade",
  title: "2.2 Rationale Zahlen auf der Zahlengeraden",
  subtitle: "Ablesen, eintragen und passend skalieren",
  whyItMatters:
    "Die Zahlengerade zeigt dir sofort, wie groß eine Zahl ist und wie weit sie von anderen entfernt liegt. Dazu brauchst du eine passende Einteilung.",
  explanationHtml: `<p>Zwischen zwei ganzen Zahlen liegen unendlich viele rationale Zahlen. Wähle die <strong>Skalierung</strong> nach den Nennern der Zahlen: Für Viertel teilst du jede Einheit in 4 Teile, für Zehntel in 10.</p><div class="example">Für −${frac(3, 4)}, ${frac(1, 2)} und 1,25 passt eine Einteilung in Viertel, denn ${frac(1, 2)} = ${frac(2, 4)} und 1,25 = ${frac(5, 4)}. −${frac(3, 4)} liegt 3 Striche links von 0, ${frac(1, 2)} liegt 2 Striche und 1,25 liegt 5 Striche rechts von 0.</div><p>Beim Ablesen zählst du zuerst, wie viele Striche eine Einheit hat. Daraus ergibt sich der Wert eines Strichs.</p><div class="merke"><strong>Merke:</strong> Wert eines Strichs = 1 : Anzahl der Teile je Einheit. Die Lage einer Zahl = Anzahl der Striche · Wert eines Strichs, links von 0 negativ.</div>`,
  formulas: [
    {
      name: "Skalierung",
      html: "Wert eines Strichs = 1 : Teile je Einheit",
      quantities: "die Teile je Einheit ergeben sich aus den Nennern",
    },
  ],
  quiz: {
    question:
      "Eine Einheit ist in 5 Teile geteilt. P liegt 3 Striche links von 0. Welche Zahl ist P?",
    options: ["−3/5", "3/5", "−5/3"],
    correctIndex: 0,
    explanation:
      "Ein Strich ist 1/5 wert; drei Striche links von 0 ergeben −3/5.",
  },
  lab: lab(
    "number-line",
    "Punkt auf der Zahlengeraden",
    "Wähle die Einteilung und ziehe den Punkt P. Nicht jede Zahl lässt sich in jeder Einteilung treffen.",
    [
      c("s", "Eine Einheit hat", ["2 Teile", "4 Teile", "5 Teile", "10 Teile"]),
      r("t", "Striche von 0", -20, 20, 1),
    ],
    [
      o("value", "P als Dezimalzahl", (v) => fmt(v.t * NL_STEPS[v.s], 2)),
      o("frac", "P als Bruch", (v) => {
        const denominator = [2, 4, 5, 10][v.s];
        return ratio(v.t, denominator);
      }),
    ],
    [
      {
        id: "minus-dreiviertel",
        text: "Setze P auf −3/4.",
        check: (v) => nearly(v.t * NL_STEPS[v.s], -0.75),
      },
      {
        id: "eins-zwei",
        text: "Setze P auf 1,2.",
        check: (v) => nearly(v.t * NL_STEPS[v.s], 1.2),
      },
      {
        id: "minus-drei-zehntel",
        text: "Setze P auf −0,3. Dazu brauchst du die feinste Einteilung.",
        check: (v) => nearly(v.t * NL_STEPS[v.s], -0.3),
      },
    ],
  ),
  exercises: [
    {
      id: "ablesen",
      make: (rng, level) => {
        const parts = rng.pick([2, 4, 5, 10]);
        const ticks = rng.int(1, 3 * parts) * rng.sign();
        const value = ticks / parts;
        if (level === 1)
          return task(
            level,
            `Eine Einheit der Zahlengeraden ist in ${parts} Teile geteilt. P liegt ${Math.abs(ticks)} Striche ${ticks < 0 ? "links" : "rechts"} von 0. Welche Zahl ist P?`,
            "",
            [num("P =", value, "", 2)],
            "Wert eines Strichs mal Anzahl der Striche; links von 0 ist die Zahl negativ.",
            `Ein Strich ist ${frac(1, parts)} wert.`,
            `P = ${fmt(value)}.`,
            { parts, ticks },
          );
        const a = ticks / parts;
        const distance = rng.int(1, 4);
        const b = a + distance;
        return task(
          level,
          "",
          `Auf einer Zahlengeraden sind A = ${fmt(a)} und B = ${fmt(b)} eingetragen. Welche Zahl liegt genau in der Mitte zwischen A und B?`,
          [num("Mitte =", (a + b) / 2, "", 3)],
          "Halbiere den Abstand und gehe von der kleineren Zahl aus so weit nach rechts.",
          `Abstand ${distance}, die Hälfte ${fmt(distance / 2)}.`,
          `${fmt((a + b) / 2, 3)}.`,
          { a, b },
        );
      },
    },
    {
      id: "skalierung",
      make: (rng, level) => {
        const options = ["2 Teile", "4 Teile", "5 Teile", "10 Teile"];
        const idx = rng.int(1, 3);
        const d = [2, 4, 5, 10][idx];
        let z = rng.int(1, d - 1);
        while (gcd(z, d) !== 1) z = rng.int(1, d - 1);
        const other = idx === 1 ? "0,5" : idx === 2 ? "0,4" : "0,7";
        if (level === 1)
          return task(
            level,
            `Du möchtest −${frac(z, d)} und ${other} eintragen. Welche Einteilung einer Einheit ist am besten geeignet?`,
            "",
            [pick("Einteilung", options, idx)],
            "Schreibe beide Zahlen als Bruch mit gleichem Nenner.",
            `${other} und −${frac(z, d)} lassen sich mit dem Nenner ${d} schreiben.`,
            `${options[idx]}.`,
            { d, z },
          );
        const length = rng.pick([2, 3, 4]);
        const unit = rng.pick([2, 4, 5]);
        return task(
          level,
          "",
          `Deine Zahlengerade soll von 0 bis ${length} reichen und jede Einheit in ${d} Teile teilen. Eine Einheit soll ${unit} cm lang sein. Wie lang ist ein Strichabstand in cm, und wie viele Strichabstände liegen zwischen 0 und ${length}?`,
          [
            num("Abstand =", unit / d, "cm", 2),
            num("Strichabstände =", length * d, "", 0),
          ],
          "Einheitslänge durch Teile je Einheit; Einheiten mal Teile.",
          `${unit} : ${d} = ${fmt(unit / d)} und ${length} · ${d} = ${length * d}.`,
          `${fmt(unit / d)} cm, ${length * d} Abstände.`,
          { d, length, unit },
        );
      },
    },
  ],
});

export const LESSONS = [vergleichen, zahlengerade];
