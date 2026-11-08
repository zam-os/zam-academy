import {
  factorForm,
  fmt,
  linear,
  paren,
  quadratic,
  sum,
  term,
} from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  absQuadraticArea,
  graphenDiff,
  integralFunction,
  linearBilanz,
  polyBilanz,
  paraIntegral,
  profilData,
  quadRoots,
  rotationData,
  signChangeCount,
  stammCase,
  uneigentlich,
} from "../lab/views-1-integral";
import type { ExerciseTask, Lesson } from "../model/types";
import { choice, lab, makeLesson, makeStage, output, range, task } from "./builders";
import { choiceField, numberField } from "./helpers";

/** A readout with an optional emphasis flag (the quantity the lesson is about). */
const readout = (
  key: string,
  label: string,
  compute: (v: Record<string, number>) => number | string,
  unit = "",
  digits = 2,
  emphasis = false,
) => ({ ...output(key, label, compute, unit, digits), emphasis });

/** A non-zero integer in [−max, max]. */
function nonZero(rng: Rng, max: number): number {
  return rng.int(1, max) * rng.sign();
}

/** A constant added to a term: " + 3", " − 3", or "" for 0. */
function plus(value: number, digits = 2): string {
  return term(value, "", false, digits);
}

/** x^2, x^3 … as text. */
const POWER = ["", "x", "x²", "x³", "x⁴"];

const SUPS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const SUBS = "₀₁₂₃₄₅₆₇₈₉";
/** A whole number as a superscript exponent, e.g. −3 → "⁻³". */
const sup = (n: number): string =>
  (n < 0 ? "⁻" : "") + String(Math.abs(n)).split("").map((d) => SUPS[Number(d)]).join("");
/** A non-negative whole number as a subscript. */
const sub = (n: number): string =>
  n < 0
    ? sup(n)
    : String(n).split("").map((d) => SUBS[Number(d)]).join("");
/** An integral sign with limits: intAb(0, 4) → "∫₀⁴". */
const intAb = (a: number, b: number): string => `∫${sub(a)}${sup(b)}`;

// ─── 1.1 Das bestimmte Integral als Flächenbilanz ───────────────────────────

const flaechenwert = {
  id: "flaechenwert",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const h: number[] = [0, 0, 0].map(() => rng.int(-4, 4));
      const allZero = h.every((x): boolean => x === 0);
      if (allZero) h[0] = 2;
      const ap = h.reduce((s, x) => s + Math.max(x, 0), 0);
      const am = h.reduce((s, x) => s + Math.max(-x, 0), 0);
      const bilanz = ap - am;
      const apParts = h.filter((x) => x > 0).map((x) => `${fmt(x)} · 1`);
      const amParts = h.filter((x) => x < 0).map((x) => `${fmt(-x)} · 1`);
      return task(
        1,
        `Der Graph einer Funktion r ist stückweise konstant: Auf [0 | 1] gilt r(t) = ${fmt(h[0])}, auf [1 | 2] gilt r(t) = ${fmt(h[1])}, auf [2 | 3] gilt r(t) = ${fmt(h[2])}. Bestimme die Fläche A⁺ über der Achse, die Fläche A⁻ unter der Achse und die Bilanz.`,
        "",
        [
          numberField("A⁺ =", ap, "FE", 2),
          numberField("A⁻ =", am, "FE", 2),
          numberField("Bilanz =", bilanz, "FE", 2),
        ],
        "Jedes Stück hat die Breite 1. A⁺ addiert die Flächenstücke mit positivem Funktionswert, A⁻ die Beträge der Stücke mit negativem Funktionswert.",
        [
          `Über der Achse liegen die positiven Stücke: A⁺ = ${apParts.join(" + ") || "0"} = ${fmt(ap)} FE.`,
          `Unter der Achse liegen die negativen Stücke, als positive Zahl: A⁻ = ${amParts.join(" + ") || "0"} = ${fmt(am)} FE.`,
          `Die Bilanz ist A⁺ − A⁻ = ${fmt(ap)} − ${paren(am)} = ${fmt(bilanz)} FE.`,
        ],
        `A⁺ = ${fmt(ap)} FE, A⁻ = ${fmt(am)} FE, Bilanz = ${fmt(bilanz)} FE`,
        { h1: h[0], h2: h[1], h3: h[2] },
      );
    }
    const w = [0, 0, 0].map(() => rng.int(1, 3));
    const r = [0, 0, 0].map(() => {
      const x = rng.int(-5, 5);
      return x === 0 ? 2 : x;
    });
    const ap = r.reduce((s, x, i) => s + Math.max(x, 0) * w[i], 0);
    const am = r.reduce((s, x, i) => s + Math.max(-x, 0) * w[i], 0);
    const bilanz = ap - am;
    let t = 0;
    const spans = w.map((width) => {
      const span = `[${fmt(t)} | ${fmt(t + width)}] h`;
      t += width;
      return span;
    });
    return task(
      2,
      "",
      `An einem Vormittag wird ein Lager beliefert und geleert: Auf ${spans[0]} werden ${fmt(r[0])} Stück pro Stunde angeliefert, auf ${spans[1]} werden ${fmt(r[1])} Stück pro Stunde entnommen, auf ${spans[2]} werden ${fmt(r[2])} Stück pro Stunde angeliefert (Entnahmen mit negativem Vorzeichen). Wie viel wird insgesamt angeliefert, wie viel entnommen, und wie groß ist die Bilanz?`,
      [
        numberField("Anlieferung =", ap, "Stück", 2),
        numberField("Entnahme =", am, "Stück", 2),
        numberField("Bilanz =", bilanz, "Stück", 2),
      ],
      "Menge = Rate · Zeit. Positive Raten zählen zur Anlieferung, negative Raten zur Entnahme (als positive Zahl).",
      [
        `Anlieferung: nur die positiven Raten mal ihre Zeitdauern: ${fmt(Math.max(r[0], 0) * w[0])} + ${fmt(Math.max(r[1], 0) * w[1])} + ${fmt(Math.max(r[2], 0) * w[2])} = ${fmt(ap)} Stück.`,
        `Entnahme: die Beträge der negativen Raten mal ihre Zeitdauern: ${fmt(Math.max(-r[0], 0) * w[0])} + ${fmt(Math.max(-r[1], 0) * w[1])} + ${fmt(Math.max(-r[2], 0) * w[2])} = ${fmt(am)} Stück.`,
        `Die Bilanz ist Anlieferung − Entnahme = ${fmt(ap)} − ${paren(am)} = ${fmt(bilanz)} Stück.`,
      ],
      `Anlieferung = ${fmt(ap)} Stück, Entnahme = ${fmt(am)} Stück, Bilanz = ${fmt(bilanz)} Stück`,
      { r1: r[0], r2: r[1], r3: r[2], w1: w[0], w2: w[1], w3: w[2] },
    );
  },
};

const bilanzInterpretieren = {
  id: "bilanz-interpretieren",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const p = rng.int(1, 9);
      const n = rng.int(1, 9);
      const bilanz = p - n;
      const index = p > n ? 0 : p < n ? 1 : 2;
      return task(
        1,
        `Ein Graph bildet über [1 | 5] die Fläche A⁺ = ${fmt(p)} FE über der Achse und die Fläche A⁻ = ${fmt(n)} FE unter der Achse. Wie groß ist die Bilanz des bestimmten Integrals, und welche der beiden Flächen ist größer?`,
        "",
        [
          numberField("Bilanz =", bilanz, "FE", 2),
          choiceField(
            "Welche Fläche ist größer?",
            [
              "die Fläche über der Achse",
              "die Fläche unter der Achse",
              "beide Flächen sind gleich groß",
            ],
            index,
          ),
        ],
        "Die Bilanz ist A⁺ − A⁻. Das Vorzeichen der Bilanz verrät, welche Fläche überwiegt.",
        [
          `Bilanz = A⁺ − A⁻ = ${fmt(p)} − ${paren(n)} = ${fmt(bilanz)} FE.`,
          `Vergleich: A⁺ = ${fmt(p)} und A⁻ = ${fmt(n)}`,
          index === 0
            ? `FE. Da A⁺ > A⁻, liegt über der Achse mehr Fläche.`
            : index === 1
              ? `FE. Da A⁻ > A⁺, liegt unter der Achse mehr Fläche.`
              : `FE. Beide Flächen sind gleich groß.`,
        ],
        `Bilanz = ${fmt(bilanz)} FE; ${
          index === 0
            ? "größer ist die Fläche über der Achse"
            : index === 1
              ? "größer ist die Fläche unter der Achse"
              : "beide Flächen sind gleich groß"
        }.`,
        { p, n },
      );
    }
    const r = nonZero(rng, 5);
    const dauer = rng.int(2, 8);
    const B = r * dauer;
    return task(
      2,
      "",
      `Eine Größe ändert sich mit der konstanten Rate r = ${fmt(r)} pro Stunde. Wie lang muss das Intervall [0 | t] sein, damit die Bilanz (die Gesamtänderung) genau ${fmt(B)} beträgt?`,
      [numberField("t =", dauer, "h", 2)],
      "Die Bilanz einer konstanten Rate ist Rate · Dauer, also Dauer = Bilanz : Rate.",
      [
        `Bilanz = Rate · Dauer: ${fmt(B)} = ${paren(r)} · t.`,
        `Auflösen nach t: t = ${fmt(B)} : ${paren(r)} = ${fmt(dauer)}.`,
      ],
      `t = ${fmt(dauer)} h`,
      { r, B, t: dauer },
    );
  },
};

// ─── 1.2 Die Integralfunktion ───────────────────────────────────────────────

const integralwert = {
  id: "integralwert",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    const m = rng.pick([-4, -2, 0, 2, 4]);
    const c = rng.int(-6, 6);
    const x = rng.int(1, 5);
    const F = integralFunction(m, c, x);
    const stamm = sum([
      [m / 2, "x²"],
      [c, "x"],
    ]);
    const steps = [
      `Eine Stammfunktion von f(t) = ${linear(m, c)} ist F(x) = ${stamm}.`,
      `Einsetzen der oberen Grenze: F(${fmt(x)}) = ${fmt(F)}; die untere Grenze 0 liefert F(0) = 0.`,
    ];
    if (level === 1) {
      return task(
        1,
        `Die Funktion f ist gegeben durch f(t) = ${linear(m, c)}. Wie groß ist F(${fmt(x)}) für F(x) = ∫₀ˣ f(t) dt mit F(0) = 0?`,
        "",
        [numberField(`F(${fmt(x)}) =`, F, "", 2)],
        "Für f(t) = m t + c ist F(x) = m x² : 2 + c x; die untere Grenze 0 liefert F(0) = 0.",
        steps,
        `F(${fmt(x)}) = ${fmt(F)}`,
        { m, c, x },
      );
    }
    const rate = m * x + c;
    return task(
      2,
      "",
      `Ein Bestand wächst mit der Rate r(t) = ${linear(m, c)} (Stück pro Tag). Wie viele Stücke sind bis zum Ende von Tag ${fmt(x)} dazugekommen, und nimmt der Bestand an diesem Tag noch zu?`,
      [
        numberField("Menge =", F, "Stück", 2),
        choiceField(
          `Nimmt der Bestand an Tag ${fmt(x)} noch zu?`,
          ["Ja, denn r(x) ist positiv.", "Nein, denn r(x) ist nicht positiv."],
          rate > 0 ? 0 : 1,
        ),
      ],
      "Die Gesamtmenge bis Tag x ist ∫₀ˣ r(t) dt; das Vorzeichen von r(x) zeigt, ob gerade noch zuwächst.",
      [
        ...steps,
        `Am Ende gilt r(${fmt(x)}) = ${fmt(rate)}: ${
          rate > 0 ? "positiv, der Bestand wächst noch." : "nicht positiv, der Bestand wächst nicht mehr."
        }`,
      ],
      `Menge = ${fmt(F)} Stück; ${
        rate > 0 ? "der Bestand nimmt an Tag " + fmt(x) + " noch zu" : "der Bestand nimmt an Tag " + fmt(x) + " nicht mehr zu"
      }.`,
      { m, c, x },
    );
  },
};

const zuordnen = {
  id: "zuordnen",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const c = rng.int(-4, 4);
      const a = rng.int(0, 3);
      const w = rng.int(2, 5);
      const b = a + w;
      const dF = c * w;
      const index = c > 0 ? 0 : c < 0 ? 1 : 2;
      return task(
        1,
        `Auf dem Intervall [${fmt(a)} | ${fmt(b)}] hat f den konstanten Wert ${fmt(c)}. Wie verläuft die Integralfunktion F auf diesem Intervall, und um wie viel ändert sich F?`,
        "",
        [
          numberField("ΔF =", dF, "", 2),
          choiceField("Verlauf von F", ["steigend", "fallend", "konstant"], index),
        ],
        "ΔF = ∫ₐᵇ f = f · (b − a) bei konstantem f. Ein positives f heißt F steigend, ein negatives f heißt F fallend, f = 0 heißt F konstant.",
        [
          `ΔF = f · (b − a) = ${paren(c)} · ${fmt(w)} = ${fmt(dF)}.`,
          `Das Vorzeichen von f entscheidet: f ist ${
            c > 0 ? "positiv, also ist F steigend" : c < 0 ? "negativ, also ist F fallend" : "null, also ist F konstant"
          }.`,
        ],
        `ΔF = ${fmt(dF)}; F verläuft ${
          c > 0 ? "steigend" : c < 0 ? "fallend" : "konstant"
        }.`,
        { c, a, b },
      );
    }
    const w = nonZero(rng, 8);
    const len = rng.pick([2, 4]);
    const r = w / len;
    return task(
      2,
      "",
      `Die Integralfunktion F soll auf [0 | ${fmt(len)}] um genau ${fmt(w)} wachsen und dabei streng monoton verlaufen. Welchen konstanten Wert r muss die Funktion f annehmen, und wie verläuft F?`,
      [
        numberField("r =", r, "", 2),
        choiceField("Verlauf von F", ["steigend", "fallend", "konstant"], w > 0 ? 0 : 1),
      ],
      "ΔF = r · (b − a), also r = ΔF : (b − a). Das Vorzeichen von r legt den Verlauf von F fest.",
      [
        `ΔF = r · Länge des Intervalls: ${fmt(w)} = r · ${fmt(len)}.`,
        `Auflösen: r = ${fmt(w)} : ${fmt(len)} = ${fmt(r)}.`,
        `Da r ${
          w > 0 ? "positiv" : "negativ"
        } ist, verläuft F ${w > 0 ? "steigend" : "fallend"}.`,
      ],
      `r = ${fmt(r)}; F verläuft ${w > 0 ? "steigend" : "fallend"}.`,
      { w, len },
    );
  },
};

// ─── 1.3 Der Hauptsatz der Differential- und Integralrechnung ───────────────

const bestimmtesIntegral = {
  id: "bestimmtes-integral",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const type = rng.int(0, 3);
      const a = rng.int(-3, type === 2 ? 2 : 3);
      const fits = (b: number) =>
        type === 0 || type === 2
          ? type === 0 || (b - a) % 3 === 0
          : (b - a) % 2 === 0;
      const candidates: number[] = [];
      for (let b = a + 1; b <= 5; b++) if (fits(b)) candidates.push(b);
      const b = rng.pick(candidates);
      const k = type === 0 ? rng.pick([2, 3, 4, 5, -2, -3, -4]) : 0;
      const value =
        type === 0
          ? k * (b - a)
          : type === 1
            ? (b * b - a * a) / 2
            : type === 2
              ? (b ** 3 - a ** 3) / 3
              : (b ** 4 - a ** 4) / 4;
      const wert = (x: number) =>
        type === 0 ? k * x : type === 1 ? (x * x) / 2 : type === 2 ? x ** 3 / 3 : x ** 4 / 4;
      const fText = type === 0 ? `f(x) = ${fmt(k)}` : `f(x) = ${POWER[type]}`;
      const FText = [
        `F(x) = ${fmt(k)}x`,
        "F(x) = x² : 2",
        "F(x) = x³ : 3",
        "F(x) = x⁴ : 4",
      ][type];
      return task(
        1,
        `Berechne das bestimmte Integral ${intAb(a, b)} f(x) dx mit ${fText}, a = ${fmt(a)} und b = ${fmt(b)}.`,
        "",
        [numberField("Wert des Integrals =", value, "", 2)],
        [
          "∫ₐᵇ k dx = k · (b − a)",
          "∫ₐᵇ x dx = (b² − a²) : 2",
          "∫ₐᵇ x² dx = (b³ − a³) : 3",
          "∫ₐᵇ x³ dx = (b⁴ − a⁴) : 4",
        ][type],
        [
          `Stammfunktion: ${FText}.`,
          `Hauptsatz: F(b) − F(a) = ${fmt(wert(b))} − ${paren(wert(a))} = ${fmt(value)}.`,
        ],
        `${intAb(a, b)} f(x) dx = ${fmt(value)}`,
        { type, a, b, k },
      );
    }
    const variant = rng.int(0, 2);
    if (variant === 0) {
      const c = rng.int(2, 8);
      const T = rng.int(2, 6);
      const s = c * T;
      return task(
        2,
        "",
        `Ein Fahrzeug fährt mit der konstanten Geschwindigkeit v(t) = ${fmt(c)} m/s. Welche Strecke legt es in den ersten ${fmt(T)} Sekunden zurück?`,
        [numberField("Strecke =", s, "m", 2)],
        "Strecke = ∫ v(t) dt; bei konstantem v ist die Strecke v · Δt (Rechteckfläche unter dem v-Graphen).",
        [
          `v ist konstant, also ist die Fläche unter dem v-Graphen ein Rechteck: ${fmt(c)} · ${fmt(T)} = ${fmt(s)}.`,
        ],
        `Die Strecke beträgt ${fmt(s)} m.`,
        { variant, c, T },
      );
    }
    if (variant === 1) {
      const a = rng.int(0, 3);
      const b = a + rng.int(1, 4);
      const s = b * b - a * a;
      return task(
        2,
        "",
        `Ein Fahrzeug beschleunigt mit v(t) = 2t (m/s). Welche Strecke legt es zwischen t = ${fmt(a)} s und t = ${fmt(b)} s zurück?`,
        [numberField("Strecke =", s, "m", 2)],
        "Strecke = ∫ₐᵇ v(t) dt; eine Stammfunktion von 2t ist t².",
        [
          `Stammfunktion von v(t) = 2t ist s(t) = t².`,
          `Hauptsatz: s(${fmt(b)}) − s(${fmt(a)}) = ${fmt(b * b)} − ${paren(a * a)} = ${fmt(s)} m.`,
        ],
        `Die Strecke beträgt ${fmt(s)} m.`,
        { variant, a, b },
      );
    }
    const T = rng.int(2, 4);
    const s = T ** 3;
    return task(
      2,
      "",
      `Ein Fahrzeug beschleunigt mit v(t) = 3t² (m/s). Welche Strecke legt es in den ersten ${fmt(T)} Sekunden zurück?`,
      [numberField("Strecke =", s, "m", 2)],
      "Strecke = ∫₀^T v(t) dt; eine Stammfunktion von 3t² ist t³.",
      [
        `Stammfunktion von v(t) = 3t² ist s(t) = t³.`,
        `Hauptsatz: s(${fmt(T)}) − s(0) = ${fmt(T ** 3)} − 0 = ${fmt(s)} m.`,
      ],
      `Die Strecke beträgt ${fmt(s)} m.`,
      { variant, T },
    );
  },
};

const stammfunktionPruefen = {
  id: "stammfunktion-pruefen",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const p = rng.pick([2, 4, 6]);
      const q = nonZero(rng, 5);
      const u = rng.int(2, 5);
      const I = (p * u * u) / 2 + q * u;
      const correct = quadratic(p / 2, q, 0);
      const options = [
        quadratic(p / 2, 0, q),
        quadratic(p, q, 0),
        quadratic(p / 2, -q, 0),
      ];
      const at = rng.int(0, 3);
      options.splice(at, 0, correct);
      return task(
        1,
        `Von f(x) = ${linear(p, q)} ist eine Stammfunktion gesucht. Welcher der vier Terme ist eine Stammfunktion von f, und wie groß ist ${intAb(0, u)} f(x) dx?`,
        "",
        [
          choiceField("Stammfunktion von f", options, at),
          numberField("Wert des Integrals =", I, "", 2),
        ],
        "Leite jeden Kandidaten ab: Gesucht ist F mit F′(x) = f(x). Für das Integral genügt dann F(u) − F(0).",
        [
          `Gesucht ist F mit F′(x) = ${linear(p, q)}. Bei ${correct} ist die Ableitung ${linear(p, q)}: das passt.`,
          `Die Ableitungen der drei anderen Kandidaten ergeben ${linear(p, 0)}, ${linear(2 * p, q)} und ${linear(p, -q)} – jeweils nicht f(x).`,
          `Integral: F(${fmt(u)}) − F(0) = ${fmt(I)} − 0 = ${fmt(I)}.`,
        ],
        `Stammfunktion: ${correct}; ${intAb(0, u)} f(x) dx = ${fmt(I)}`,
        { p, q, u },
      );
    }
    const p = rng.pick([3, 6, -3, -6]);
    const q = rng.pick([-4, -2, 2, 4]);
    const a = rng.int(-3, 2);
    const b = a + rng.int(1, 5);
    const I = (p * (b ** 3 - a ** 3)) / 3 + (q * (b * b - a * a)) / 2;
    const pool = rng.shuffle([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]);
    const marks = rng.shuffle([true, true, true, false, false]).slice(0, 4);
    const count0 = marks.reduce((n, x) => n + (x ? 1 : 0), 0);
    if (count0 < 1) marks[0] = true;
    if (count0 > 3) marks[3] = false;
    const count = marks.reduce((n, x) => n + (x ? 1 : 0), 0);
    const coeffs: Array<{ A: number; B: number; C: number }> = marks.map((right, i) => {
      const C = pool[i];
      if (right) return { A: p / 3, B: q / 2, C };
      const kind = rng.int(0, 2);
      return {
        A: kind === 1 ? p / 2 : p / 3,
        B: kind === 0 ? -q / 2 : kind === 2 ? q : q / 2,
        C,
      };
    });
    const options = coeffs.map(({ A, B, C }) =>
      sum([
        [A, "x³"],
        [B, "x²"],
        [C, ""],
      ]),
    );
    return task(
      2,
      "",
      `Wie viele der vier Terme sind Stammfunktionen von f(x) = ${quadratic(p, q, 0)}? Und wie groß ist ${intAb(a, b)} f(x) dx?`,
      [
        choiceField(
          "Anzahl der Stammfunktionen",
          ["genau einer", "genau zwei", "genau drei", "alle vier"],
          count - 1,
        ),
        numberField("Wert des Integrals =", I, "", 2),
      ],
      "Ein Term ist genau dann eine Stammfunktion, wenn seine Ableitung f(x) ergibt. Konstante Zusätze (das + C) stören nie.",
      [
        `Ableiten der Kandidaten: ${coeffs
          .map(({ A, B }, i) => `${options[i]} liefert ${quadratic(3 * A, 2 * B, 0)}`)
          .join("; ")}.`,
        `Vergleiche mit f(x) = ${quadratic(p, q, 0)}: ${count} der vier Terme passen.`,
        `Für das Integral genügt eine Stammfunktion: F(b) − F(a) = ${fmt(I)}.`,
      ],
      `${count} der vier Terme sind Stammfunktionen; ${intAb(a, b)} f(x) dx = ${fmt(I)}`,
      {
        p,
        q,
        a,
        b,
        n: count,
        a1: coeffs[0].A,
        b1: coeffs[0].B,
        c1: coeffs[0].C,
        a2: coeffs[1].A,
        b2: coeffs[1].B,
        c2: coeffs[1].C,
        a3: coeffs[2].A,
        b3: coeffs[2].B,
        c3: coeffs[2].C,
        a4: coeffs[3].A,
        b4: coeffs[3].B,
        c4: coeffs[3].C,
      },
    );
  },
};

// ─── 1.4 Vom Integranden zur Integralfunktion und zurück ────────────────────

const graphSchluss = {
  id: "graph-schluss",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const h: number[] = [0, 0, 0, 0].map(() => rng.int(-4, 4));
      const allZero = h.every((x): boolean => x === 0);
      if (allZero) h[0] = 2;
      const F4 = h.reduce((s, x) => s + x, 0);
      let count = 0;
      for (let i = 0; i + 1 < h.length; i++) {
        if (h[i] !== 0 && h[i + 1] !== 0 && Math.sign(h[i]) !== Math.sign(h[i + 1])) count++;
      }
      return task(
        1,
        `Die Funktion f ist stückweise konstant: Auf [0 | 1] gilt f = ${fmt(h[0])}, auf [1 | 2] gilt f = ${fmt(h[1])}, auf [2 | 3] gilt f = ${fmt(h[2])}, auf [3 | 4] gilt f = ${fmt(h[3])}. Es gilt F(0) = 0. Wie groß ist F(4), und wie viele Extremstellen hat F auf [0 | 4]?`,
        "",
        [
          numberField("F(4) =", F4, "", 2),
          choiceField("Extremstellen von F", ["keine", "eine", "zwei", "drei"], count),
        ],
        "F(4) ist die Flächenbilanz aller Stücke. Extremstellen von F liegen dort, wo f das Vorzeichen wechselt.",
        [
          `F(4) = Flächenbilanz = ${h.map((x) => paren(x)).join(" + ")} = ${fmt(F4)}.`,
          `Vorzeichenwechsel von f: ${count === 0 ? "keiner" : `${count} Stück`}; an jeder solchen Stelle hat F eine Extremstelle.`,
        ],
        `F(4) = ${fmt(F4)}; F hat ${count === 0 ? "keine" : count === 1 ? "eine" : count === 2 ? "zwei" : "drei"} Extremstelle${count === 1 ? "" : "n"} auf [0 | 4].`,
        { h1: h[0], h2: h[1], h3: h[2], h4: h[3] },
      );
    }
    const s = rng.int(1, 4);
    const m = rng.pick([-2, -1, 1, 2]);
    const t = -m * s;
    return task(
      2,
      "",
      `Für die Integralfunktion F(x) = ∫₀ˣ f(t) dt mit f(x) = m x + t soll bei x = ${fmt(s)} ein Maximum vorliegen. Wie groß ist m, wenn t = ${fmt(t)} gilt, und welche Art von Extremstelle liegt bei x = ${fmt(s)} vor?`,
      [
        numberField("m =", m, "", 2),
        choiceField("Art der Extremstelle", ["Maximum", "Minimum"], m < 0 ? 0 : 1),
      ],
      "Ein Maximum von F liegt dort, wo f das Vorzeichen von + nach − wechselt; diese Stelle ist die Nullstelle von f.",
      [
        `F′ = f: Extremstellen von F sind die Nullstellen von f: 0 = m x + t = m x${plus(t)}.`,
        `Für x = ${fmt(s)} folgt m = −t : x = ${paren(-t)} : ${fmt(s)} = ${fmt(m)}.`,
        `Bei m ${
          m < 0 ? "negativ: f fällt von + nach −, F hat ein Maximum" : "positiv: f steigt von − nach +, F hat ein Minimum"
        } bei x = ${fmt(s)}.`,
      ],
      `m = ${fmt(m)}; bei x = ${fmt(s)} liegt ein ${m < 0 ? "Maximum" : "Minimum"} vor.`,
      { m, t, s },
    );
  },
};

const extremstelle = {
  id: "extremstelle",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const m = rng.pick([-2, -1, 1, 2]);
      const x0 = rng.int(-3, 3);
      const t = -m * x0;
      return task(
        1,
        `Die Funktion f ist gegeben durch f(x) = ${linear(m, t)}. Die Integralfunktion F mit F(0) = 0 hat eine Extremstelle. Berechne die Extremstelle von F und gib an, ob dort ein Maximum oder ein Minimum vorliegt.`,
        "",
        [
          numberField("x =", x0, "", 2),
          choiceField("Art der Extremstelle", ["Maximum", "Minimum"], m < 0 ? 0 : 1),
        ],
        "Die Extremstelle von F ist die Nullstelle von f: 0 = m x + t, also x = −t : m. Das Vorzeichen von m entscheidet über die Art.",
        [
          `Nullstelle von f: 0 = ${linear(m, t)}, also x = ${paren(-t)} : ${paren(m)} = ${fmt(x0)}.`,
          `Für x < ${fmt(x0)} ist f ${m > 0 ? "negativ" : "positiv"}, für x > ${fmt(x0)} ist f ${
            m > 0 ? "positiv" : "negativ"
          }: F hat dort ein ${m < 0 ? "Maximum" : "Minimum"}.`,
        ],
        `Extremstelle bei x = ${fmt(x0)}; dort liegt ein ${m < 0 ? "Maximum" : "Minimum"} vor.`,
        { m, t },
      );
    }
    const a = rng.pick([-2, -1, 1, 2]);
    const p = rng.int(-3, 0);
    const q = p + rng.int(2, 5);
    return task(
      2,
      "",
      `Die Funktion f(x) = ${factorForm(a, p, q)} ist die Ableitung einer Integralfunktion F(x) = ∫₀ˣ f(t) dt. An welchen beiden Stellen hat F Extremstellen, und wo liegt das Maximum?`,
      [
        numberField("x₁ =", p, "", 2),
        numberField("x₂ =", q, "", 2),
        choiceField(
          "Wo liegt das Maximum von F?",
          [`bei x = ${fmt(p)}`, `bei x = ${fmt(q)}`, "F hat hier kein Maximum"],
          a > 0 ? 0 : 1,
        ),
      ],
      "Extremstellen von F sind die Nullstellen von f mit Vorzeichenwechsel. Bei positivem a steigt F außerhalb der Nullstellen, bei negativem a fällt F dort.",
      [
        `f(x) = 0 für x = ${fmt(p)} und x = ${fmt(q)}; an beiden Stellen wechselt f das Vorzeichen.`,
        `Bei a = ${fmt(a)} ist f zwischen den Nullstellen ${
          a > 0 ? "negativ" : "positiv"
        } und außerhalb ${a > 0 ? "positiv" : "negativ"}.`,
        `Also hat F sein Maximum bei x = ${fmt(a > 0 ? p : q)} und sein Minimum bei x = ${fmt(a > 0 ? q : p)}.`,
      ],
      `Extremstellen bei x = ${fmt(p)} und x = ${fmt(q)}; das Maximum liegt bei x = ${fmt(a > 0 ? p : q)}.`,
      { a, p, q },
    );
  },
};

// ─── 1.5 Stammfunktionen und Integrationsregeln ─────────────────────────────

const stammterm = {
  id: "stammterm",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const variant = rng.int(0, 2);
      if (variant === 0) {
        const k = rng.int(1, 3);
        const d = rng.int(1, 4);
        const x0 = nonZero(rng, 3);
        const c = d * (k + 1);
        const value = d * x0 ** (k + 1);
        return task(
          1,
          `Wie groß ist F(${fmt(x0)}) für die Stammfunktion F von f(x) = ${fmt(c)}${POWER[k]} mit F(0) = 0?`,
          "",
          [numberField(`F(${fmt(x0)}) =`, value, "", 2)],
          "Potenzregel: ∫ c x^k dx = c x^(k+1) : (k + 1) + C; mit F(0) = 0 fällt C weg.",
          [
            `Stammfunktion: F(x) = ${fmt(c)} · x^${k + 1} : ${k + 1} = ${fmt(d)}x^${k + 1}.`,
            `Einsetzen: F(${fmt(x0)}) = ${fmt(d)} · ${paren(x0)}^${k + 1} = ${fmt(value)}.`,
          ],
          `F(${fmt(x0)}) = ${fmt(value)}`,
          { variant, k, d, x0 },
        );
      }
      if (variant === 1) {
        const c = rng.int(1, 6);
        return task(
          1,
          `Der Term F(x) = k · ln|x| ist eine Stammfunktion von f(x) = ${fmt(c)} : x. Wie groß ist k?`,
          "",
          [numberField("k =", c, "", 2)],
          "∫ c : x dx = c · ln|x| + C; der Faktor vor ln|x| ist der Zähler c.",
          [
            `Die Stammfunktion von 1 : x ist ln|x|, also ist F(x) = ${fmt(c)} · ln|x| + C.`,
            `Vergleich mit F(x) = k · ln|x| + C liefert k = ${fmt(c)}.`,
          ],
          `k = ${fmt(c)}`,
          { variant, c },
        );
      }
      const m = rng.pick([2, 4]);
      const b = rng.int(1, 5);
      return task(
        1,
        `Die Stammfunktion von f(x) = e^(${fmt(m)}x${plus(b)}) hat die Form F(x) = a · e^(${fmt(m)}x${plus(b)}) + C. Wie groß ist a?`,
        "",
        [numberField("a =", 1 / m, "", 2)],
        "∫ e^(m x + b) dx = e^(mx+b) : m + C; der Faktor a ist 1 : m.",
        [
          `Bei f(x) = e^(m x + b) ist F(x) = e^(mx+b) : m + C.`,
          `Also ist a = 1 : ${fmt(m)} = ${fmt(1 / m)}.`,
        ],
        `a = ${fmt(1 / m)}`,
        { variant, m, b },
      );
    }
    const k = rng.int(0, 3);
    const d = rng.int(1, 4);
    const T = rng.int(2, 5);
    const c = d * (k + 1);
    const value = d * T ** (k + 1);
    return task(
      2,
      "",
      `Der Bestand eines Lagers wächst mit der Rate r(t) = ${fmt(c)}${POWER[k]} (Stück pro Tag). Wie viele Stücke kommen in den ersten ${fmt(T)} Tagen dazu?`,
      [numberField("Menge =", value, "Stück", 2)],
      "Menge = ∫₀^T r(t) dt; mit der Potenzregel ist ∫ c t^k dt = c t^(k+1) : (k + 1).",
      [
        `Stammfunktion von r(t) = ${fmt(c)}${POWER[k]} ist R(t) = ${fmt(c)} · t^${k + 1} : ${k + 1} = ${fmt(d)}t^${k + 1}.`,
        `Einsetzen: R(${fmt(T)}) − R(0) = ${fmt(d)} · ${fmt(T)}^${k + 1} = ${fmt(value)} Stück.`,
      ],
      `In den ersten ${fmt(T)} Tagen kommen ${fmt(value)} Stück dazu.`,
      { k, d, T, c },
    );
  },
};

const regelAnwenden = {
  id: "regel-anwenden",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const b = rng.int(-4, 4);
      const c = rng.int(0, 5);
      const s = nonZero(rng, 4);
      const g = quadratic(1, b, c);
      return task(
        1,
        `Bestimme k, wenn F(x) = k · ln|${g}| + C eine Stammfunktion von f(x) = ${paren(s)} · (2x${plus(b)}) : (${g}) ist. Welche Integrationsregel liegt zugrunde?`,
        "",
        [
          numberField("k =", s, "", 2),
          choiceField(
            "Integrationsregel",
            [
              "f′ : f integriert zu ln|f| + C",
              "f′ · e^f integriert zu e^f + C",
              "Potenzregel für x^n",
            ],
            0,
          ),
        ],
        `Erkenne g(x) = ${g} und g′(x) = 2x${plus(b)} im Zähler: f(x) = ${paren(s)} · g′(x) : g(x) integriert zu ${paren(s)} · ln|g(x)| + C.`,
        [
          `g(x) = ${g} hat die Ableitung g′(x) = 2x${plus(b)}.`,
          `Also ist f(x) = ${paren(s)} · g′(x) : g(x) und F(x) = ${paren(s)} · ln|g(x)| + C.`,
        ],
        `k = ${fmt(s)}; angewandt ist die Regel f′ : f → ln|f| + C.`,
        { s, b, c },
      );
    }
    const p = rng.int(-4, 4);
    const s = nonZero(rng, 4);
    const g = p === 0 ? "x²" : `x²${term(p, "x", false)}`;
    const eRule = rng.next() < 0.5;
    if (eRule)
      return task(
        2,
        "",
        `Welche Integrationsregel wendest du an, um f(x) = ${paren(s)} · (2x${plus(p)}) · e^(${g}) zu integrieren, und wie groß ist k in F(x) = k · e^(${g}) + C?`,
        [
          choiceField(
            "Integrationsregel",
            [
              "f′ · e^f integriert zu e^f + C",
              "f′ : f integriert zu ln|f| + C",
              "Partielle Integration",
            ],
            0,
          ),
          numberField("k =", s, "", 2),
        ],
        `Schreibe g(x) = ${g}; dann ist g′(x) = 2x${plus(p)} und f(x) = ${paren(s)} · g′(x) · e^{g(x)} integriert zu ${paren(s)} · e^{g(x)} + C.`,
        [
          `g(x) = ${g} hat die Ableitung g′(x) = 2x${plus(p)}; f(x) = ${paren(s)} · g′(x) · e^{g(x)}.`,
          `Die Regel f′ · e^f → e^f + C liefert F(x) = ${paren(s)} · e^(${g}) + C.`,
        ],
        `k = ${fmt(s)}; angewandt ist die Regel f′ · e^f → e^f + C.`,
        { s, p },
      );
    return task(
      2,
      "",
      `Welche Integrationsregel wendest du an, um f(x) = ${paren(s)} · (2x${plus(p)}) : (${g}) zu integrieren, und wie groß ist k in F(x) = k · ln|${g}| + C?`,
      [
        choiceField(
          "Integrationsregel",
          [
            "f′ : f integriert zu ln|f| + C",
            "f′ · e^f integriert zu e^f + C",
            "Partielle Integration",
          ],
          0,
        ),
        numberField("k =", s, "", 2),
      ],
      `Schreibe g(x) = ${g}; dann ist g′(x) = 2x${plus(p)} und f(x) = ${paren(s)} · g′(x) : g(x) integriert zu ${paren(s)} · ln|g(x)| + C.`,
      [
        `g(x) = ${g} hat die Ableitung g′(x) = 2x${plus(p)}; f(x) = ${paren(s)} · g′(x) : g(x).`,
        `Die Regel f′ : f → ln|f| + C liefert F(x) = ${paren(s)} · ln|${g}| + C.`,
      ],
      `k = ${fmt(s)}; angewandt ist die Regel f′ : f → ln|f| + C.`,
      { s, p },
    );
  },
};

// ─── 1.6 Flächen zwischen zwei Graphen ──────────────────────────────────────

/** Two lines whose difference is d·(x − x₀) over [0; v]; the area is exact. */
function linePair(rng: Rng) {
  const d = nonZero(rng, 4);
  const v = rng.int(2, 6);
  const x0 = rng.int(0, v);
  const m2 = rng.int(-3, 3);
  const t2 = rng.int(-4, 4);
  return {
    d,
    v,
    x0,
    m1: m2 + d,
    t1: t2 - d * x0,
    m2,
    t2,
    area: (Math.abs(d) * (x0 * x0 + (v - x0) ** 2)) / 2,
  };
}

/** Parabola f(x) = a x² and line g with zeros x₁ < x₂ of f − g; area |a| d³ : 6. */
function curvePair(rng: Rng) {
  const [size, dist] = rng.pick([
    [3, 2],
    [-3, 2],
    [2, 3],
    [-2, 3],
    [3, 4],
    [-3, 4],
    [2, 6],
    [-2, 6],
  ] as Array<[number, number]>);
  const x1 = rng.int(-3, 0);
  const x2 = x1 + dist;
  const m = size * (x1 + x2);
  const t = -size * x1 * x2;
  return {
    a: size,
    x1,
    x2,
    m,
    t,
    area: (Math.abs(size) * dist ** 3) / 6,
  };
}

const flaecheZwischen = {
  id: "flaeche-zwischen",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const kind = rng.int(0, 1);
      if (kind === 0) {
        const { d, v, x0, m1, t1, m2, t2, area } = linePair(rng);
        return task(
          1,
          `Zwei Geraden begrenzen über [0 | ${fmt(v)}] eine Fläche: f(x) = ${linear(m1, t1)} und g(x) = ${linear(m2, t2)}. Wie groß ist die Fläche zwischen den Graphen über [0 | ${fmt(v)}]?`,
          "",
          [numberField("Fläche =", area, "FE", 2)],
          "A = ∫₀ᵇ |f(x) − g(x)| dx. Wo sich die Geraden schneiden, wechselt der Integrand das Vorzeichen; rechne stückweise.",
          [
            `Differenz: f(x) − g(x) = ${linear(d, -d * x0)} = ${paren(d)} · (x − ${fmt(x0)}).`,
            `Die Geraden schneiden sich bei x = ${fmt(x0)}; links und rechts davon liegen zwei Dreiecke.`,
            `Fläche = ${fmt(Math.abs(d))} · (${fmt(x0)}² + ${fmt(v - x0)}²) : 2 = ${fmt(area)} FE.`,
          ],
          `Die Fläche zwischen den Graphen beträgt ${fmt(area)} FE.`,
          { variant: 0, d, x0, v },
        );
      }
      const { a, x1, x2, m, t, area } = curvePair(rng);
      return task(
        1,
        `Parabel und Gerade schließen eine Fläche ein: f(x) = ${quadratic(a, 0, 0)} und g(x) = ${linear(m, t)}. Wie groß ist die Fläche zwischen den Graphen zwischen ihren Schnittpunkten?`,
        "",
        [numberField("Fläche =", area, "FE", 2)],
        "A = ∫ |f − g| dx zwischen den Schnittpunkten. Für f − g = a(x − x₁)(x − x₂) ist A = |a| · (x₂ − x₁)³ : 6.",
        [
          `Gleichsetzen: f(x) − g(x) = ${quadratic(a, -m, -t)} = ${factorForm(a, x1, x2)}.`,
          `Die Schnittpunkte liegen bei x₁ = ${fmt(x1)} und x₂ = ${fmt(x2)}, Abstand ${fmt(x2 - x1)}.`,
          `Fläche = |${fmt(a)}| · ${fmt(x2 - x1)}³ : 6 = ${fmt(area)} FE.`,
        ],
        `Die Fläche zwischen den Graphen beträgt ${fmt(area)} FE.`,
        { variant: 1, a, x1, x2 },
      );
    }
    const { d, v, x0, m1, t1, m2, t2, area } = linePair(rng);
    return task(
      2,
      "",
      `Eine Anlage liefert die Leistung S(t) = ${linear(m1, t1)} (kW), gebraucht werden I(t) = ${linear(m2, t2)} (kW). Wie groß ist die Abweichungsfläche zwischen den Kurven über [0 | ${fmt(v)}] h?`,
      [numberField("Fläche =", area, "kWh", 2)],
      "Die Fläche zwischen den Kurven ist ∫ |S(t) − I(t)| dt; sie misst die Energie, um die Lieferung und Bedarf auseinanderliegen.",
      [
        `Differenz: S(t) − I(t) = ${linear(d, -d * x0)} = ${paren(d)} · (t − ${fmt(x0)}).`,
        `Bei t = ${fmt(x0)} h kreuzen sich die Kurven; davor und danach sind die Teilflächen Dreiecke.`,
        `Abweichungsfläche = ${fmt(Math.abs(d))} · (${fmt(x0)}² + ${fmt(v - x0)}²) : 2 = ${fmt(area)} kWh.`,
      ],
      `Die Abweichungsfläche beträgt ${fmt(area)} kWh.`,
      { variant: 0, d, x0, v },
    );
  },
};

const schnittpunkte = {
  id: "schnittpunkte",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const { a, x1, x2, m, t, area } = curvePair(rng);
      return task(
        1,
        `Bestimme die Schnittpunkte von f(x) = ${quadratic(a, 0, 0)} und g(x) = ${linear(m, t)} und berechne die Fläche zwischen den beiden Graphen.`,
        "",
        [
          numberField("x₁ =", x1, "", 2),
          numberField("x₂ =", x2, "", 2),
          numberField("Fläche =", area, "FE", 2),
        ],
        "Gleichsetzen und nach x auflösen: f(x) − g(x) = 0. Zwischen den Schnittpunkten ist A = |a| · (x₂ − x₁)³ : 6.",
        [
          `Gleichsetzen: ${quadratic(a, -m, -t)} = 0, also ${factorForm(a, x1, x2)} = 0.`,
          `Lösungen: x₁ = ${fmt(x1)} und x₂ = ${fmt(x2)}.`,
          `Fläche zwischen den Schnittpunkten: |${fmt(a)}| · ${fmt(x2 - x1)}³ : 6 = ${fmt(area)} FE.`,
        ],
        `Schnittpunkte bei x = ${fmt(x1)} und x = ${fmt(x2)}; Fläche = ${fmt(area)} FE.`,
        { variant: 1, a, x1, x2, m, t },
      );
    }
    const m = rng.pick([-4, -2, 2, 4]);
    const t = rng.int(-5, 5);
    const c = t + (m * m) / 4;
    return task(
      2,
      "",
      `Die Parabel p: y = x²${plus(c)} soll die Gerade g: y = ${linear(m, t)} genau berühren. Wie groß muss c sein, und wie viele Schnittpunkte haben p und g in diesem Fall?`,
      [
        numberField("c =", c, "", 2),
        choiceField(
          "Schnittpunkte im Berührungsfall",
          ["genau einer (Berührung)", "keine", "zwei"],
          0,
        ),
      ],
      "Berühren heißt: Die Gleichung f(x) − g(x) = 0 hat genau eine Lösung, die Diskriminante ist 0: D = m² − 4(c − t).",
      [
        `Gleichsetzen: x²${plus(c)} = ${linear(m, t)}, also x²${term(-m, "x", false)}${plus(c - t)} = 0.`,
        `Diskriminante D = ${paren(m)}² − 4 · 1 · ${paren(c - t)} = 0 ergibt c = t + m² : 4 = ${fmt(c)}.`,
        `Bei D = 0 berühren sich Parabel und Gerade: genau ein gemeinsamer Punkt.`,
      ],
      `c = ${fmt(c)}; p und g haben genau einen Schnittpunkt (Berührung).`,
      { m, t, c },
    );
  },
};

// ─── 1.7 Uneigentliche Integrale ────────────────────────────────────────────

const uneigentlichWert = {
  id: "uneigentlich-wert",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const p = rng.pick([2, 3]);
      const b = rng.pick(p === 2 ? [2, 4, 5, 10] : [2, 5, 10]);
      const value = uneigentlich(p, b);
      return task(
        1,
        `Berechne den Wert von ∫₁^${fmt(b)} 1 : x^p dx mit p = ${fmt(p)}. Das ist der Anteil des uneigentlichen Integrals ∫₁^∞ 1 : x^p dx bis zur oberen Grenze b = ${fmt(b)}.`,
        "",
        [numberField("Wert =", value, "", 3)],
        "Für p ≠ 1 ist ∫₁^b x^(−p) dx = (b^(1−p) − 1) : (1 − p); für p = 1 ist der Wert ln b.",
        [
          `Stammfunktion von x^(−${fmt(p)}) ist F(x) = x^(1−p) : (1 − p).`,
          `Einsetzen der Grenzen: (${fmt(b)}^(1−${fmt(p)}) − 1) : (1 − ${fmt(p)}) = ${fmt(value, 3)}.`,
        ],
        `∫₁^${fmt(b)} 1 : x^p dx = ${fmt(value, 3)}`,
        { p, b },
      );
    }
    const b = rng.pick([2, 4, 5, 10]);
    const k = rng.int(1, 4);
    const c = k * b;
    const value = k * (b - 1);
    return task(
      2,
      "",
      `In einen See gelangt ein Schadstoff mit der Rate r(t) = ${fmt(c)} : t² (Gramm pro Stunde). Wie viel Schadstoff ist von t = 1 h bis t = ${fmt(b)} h insgesamt dazugekommen – und verschwindet die Zufuhr über die gesamte Zeit (t ≥ 1)?`,
      [
        numberField("Menge =", value, "g", 2),
        choiceField(
          "Gesamtmenge über alle t ≥ 1",
          [
            "Ja: Die Gesamtmenge bleibt endlich, weil der Exponent 2 größer als 1 ist.",
            "Nein: Die Gesamtmenge wird beliebig groß.",
          ],
          0,
        ),
      ],
      "∫₁^b c : t² dt = c · (1 − 1 : b). Für p > 1 bleibt der Grenzwert b → ∞ endlich (hier c · 1).",
      [
        `∫₁^${fmt(b)} ${fmt(c)} : t² dt = ${fmt(c)} · (1 − 1 : ${fmt(b)}) = ${fmt(value)} g.`,
        `Der Exponent p = 2 ist größer als 1: Der Grenzwert für b → ∞ ist ${fmt(c)} g, die Gesamtmenge bleibt also endlich.`,
      ],
      `${fmt(value)} g sind dazugekommen; die Gesamtmenge bleibt endlich.`,
      { b, k, c },
    );
  },
};

const konvergenz = {
  id: "konvergenz",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    const p = rng.stepped(0.5, 3, 0.5);
    const oben = level === 1 ? 4 : 5;
    const value = Number(uneigentlich(p, oben).toFixed(3));
    const fields = [
      numberField(`Wert des Integrals =`, value, "", 3),
      choiceField(
        "Verhalten von ∫₁^∞ 1 : x^p dx",
        ["konvergiert", "divergiert"],
        p > 1 ? 0 : 1,
      ),
    ];
    const steps = [
      `${intAb(1, oben)} 1 : x^p dx = ${fmt(value, 3)}.`,
      p > 1
        ? `p = ${fmt(p)} ist größer als 1: Der Grenzwert für b → ∞ ist 1 : (p − 1) = ${fmt(1 / (p - 1))}, das Integral konvergiert.`
        : `p = ${fmt(p)} ist höchstens 1: Der Wert wächst mit b beliebig weiter, das Integral divergiert.`,
    ];
    const result = `${intAb(1, oben)} 1 : x^p dx = ${fmt(value, 3)}; das uneigentliche Integral ${p > 1 ? "konvergiert" : "divergiert"}.`;
    const hint =
      "Wert bis b = " +
      oben +
      ": (b^(1−p) − 1) : (1 − p) bzw. ln b. Konvergenz liegt genau bei p > 1 vor, mit Grenzwert 1 : (p − 1).";
    if (level === 1) {
      return task(
        1,
        `Gegeben ist p = ${fmt(p)}. Berechne ${intAb(1, oben)} 1 : x^p dx und entscheide, ob das uneigentliche Integral ∫₁^∞ 1 : x^p dx konvergiert oder divergiert.`,
        "",
        fields,
        hint,
        steps,
        result,
        { p, oben },
      );
    }
    return task(
      2,
      "",
      `Eine Größe verliert mit der Rate r(t) = 1 : t^p pro Stunde an Menge (p = ${fmt(p)}). Wie viel Menge geht von t = 1 bis t = ${oben} verloren, und bleibt die Gesamtänderung über alle Zeiten endlich?`,
      fields,
      hint,
      steps,
      result,
      { p, oben },
    );
  },
};

// ─── 1.8 Das bestimmte Integral als Gesamtänderung ──────────────────────────

const streckeGeschwindigkeit = {
  id: "strecke-geschwindigkeit",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    const w = [0, 0, 0].map(() => rng.int(1, 3));
    const v = [0, 0, 0].map(() => {
      const x = rng.int(-5, 5);
      return x === 0 ? 2 : x;
    });
    const strecke = v.reduce((s, x, i) => s + Math.abs(x) * w[i], 0);
    const verschiebung = v.reduce((s, x, i) => s + x * w[i], 0);
    const beschreibung = (zeit: string, rate: string) => {
      let t = 0;
      return v
        .map((x, i) => {
          const span = `[${fmt(t)} | ${fmt(t + w[i])}] ${zeit}`;
          t += w[i];
          return `Auf ${span} gilt ${rate} = ${fmt(x)}`;
        })
        .join(", ");
    };
    if (level === 1) {
      return task(
        1,
        `Ein Fahrzeug fährt in drei Abschnitten mit konstanter Geschwindigkeit: ${beschreibung("s", "v")} m/s. Wie groß ist die zurückgelegte Strecke, und wie groß ist die Verschiebung?`,
        "",
        [
          numberField("Strecke =", strecke, "m", 2),
          numberField("Verschiebung =", verschiebung, "m", 2),
        ],
        "Die Strecke addiert die Beträge |v| · Δt, die Verschiebung die Flächen v · Δt mit Vorzeichen.",
        [
          `Strecke = ${v.map((x, i) => `${fmt(Math.abs(x))} · ${fmt(w[i])}`).join(" + ")} = ${fmt(strecke)} m.`,
          `Verschiebung = ${v.map((x, i) => `${paren(x)} · ${fmt(w[i])}`).join(" + ")} = ${fmt(verschiebung)} m.`,
        ],
        `Strecke = ${fmt(strecke)} m, Verschiebung = ${fmt(verschiebung)} m`,
        { v1: v[0], v2: v[1], v3: v[2], w1: w[0], w2: w[1], w3: w[2] },
      );
    }
    return task(
      2,
      "",
      `Ein Speicher wird in drei Phasen gefüllt und geleert: ${beschreibung("min", "r")} l/min. Wie viel Wasser wird insgesamt bewegt, wie groß ist der Nettozuwachs, und ist der Speicher am Ende voller oder leerer als zu Beginn?`,
      [
        numberField("bewegte Menge =", strecke, "l", 2),
        numberField("Nettozuwachs =", verschiebung, "l", 2),
        choiceField(
          "Speicher am Ende",
          ["voller", "leerer", "genau gleich voll"],
          verschiebung > 0 ? 0 : verschiebung < 0 ? 1 : 2,
        ),
      ],
      "Die bewegte Menge addiert die Beträge |r| · Δt, der Nettozuwachs die Flächen r · Δt mit Vorzeichen.",
      [
        `Bewegte Menge = ${v.map((x, i) => `${fmt(Math.abs(x))} · ${fmt(w[i])}`).join(" + ")} = ${fmt(strecke)} l.`,
        `Nettozuwachs = ${v.map((x, i) => `${paren(x)} · ${fmt(w[i])}`).join(" + ")} = ${fmt(verschiebung)} l.`,
        `Der Nettozuwachs ist ${verschiebung > 0 ? "positiv: der Speicher ist am Ende voller" : verschiebung < 0 ? "negativ: der Speicher ist am Ende leerer" : "null: der Speicher ist am Ende gleich voll"}.`,
      ],
      `Bewegte Menge = ${fmt(strecke)} l, Nettozuwachs = ${fmt(verschiebung)} l; der Speicher ist am Ende ${
        verschiebung > 0 ? "voller" : verschiebung < 0 ? "leerer" : "genau gleich voll"
      }.`,
      { v1: v[0], v2: v[1], v3: v[2], w1: w[0], w2: w[1], w3: w[2] },
    );
  },
};

const gesamtAenderung = {
  id: "gesamt-aenderung",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    if (level === 1) {
      const r = nonZero(rng, 6);
      const dauer = rng.int(2, 6);
      const B = r * dauer;
      return task(
        1,
        `Eine Größe ändert sich mit der konstanten Rate r = ${fmt(r)} pro Stunde. Wie lang muss das Intervall [0 | t] sein, damit die Gesamtänderung genau ${fmt(B)} beträgt – und steigt oder fällt die Größe dabei?`,
        "",
        [
          numberField("t =", dauer, "h", 2),
          choiceField("Richtung der Änderung", ["steigend", "fallend"], r > 0 ? 0 : 1),
        ],
        "Gesamtänderung = ∫ r(t) dt = Rate · Dauer bei konstanter Rate; Dauer = Gesamtänderung : Rate.",
        [
          `Gesamtänderung = Rate · Dauer: ${fmt(B)} = ${paren(r)} · t.`,
          `Auflösen: t = ${fmt(B)} : ${paren(r)} = ${fmt(dauer)}.`,
          `Die Rate ist ${r > 0 ? "positiv, die Größe steigt" : "negativ, die Größe fällt"}.`,
        ],
        `t = ${fmt(dauer)} h; die Größe ${r > 0 ? "steigt" : "fällt"}.`,
        { r, B, t: dauer },
      );
    }
    const r1 = nonZero(rng, 5);
    const t1 = rng.int(1, 4);
    const r2 = nonZero(rng, 5);
    const t2 = rng.int(1, 5);
    const B = r1 * t1 + r2 * t2;
    return task(
      2,
      "",
      `Ein Tank wird zuerst ${fmt(t1)} min mit ${fmt(r1)} l/min gefüllt, danach mit ${fmt(r2)} l/min. Wie lang muss die zweite Phase dauern, damit sich die Füllmenge insgesamt um ${fmt(B)} l ändert?`,
      [numberField("Dauer der zweiten Phase =", t2, "min", 2)],
      "Gesamtänderung = r₁ · t₁ + r₂ · t₂; auflösen nach t₂: t₂ = (Gesamtänderung − r₁ · t₁) : r₂.",
      [
        `Erste Phase: ${paren(r1)} · ${fmt(t1)} = ${fmt(r1 * t1)} l.`,
        `Es fehlen noch ${fmt(B)} − ${paren(r1 * t1)} = ${fmt(r2 * t2)} l; mit ${paren(r2)} l/min ergibt das ${fmt(t2)} min.`,
      ],
      `Die zweite Phase dauert ${fmt(t2)} min.`,
      { r1, t1, r2, t2, B },
    );
  },
};

// ─── 1.9 Rotationskörper und Volumen ────────────────────────────────────────

function rotationsFall(rng: Rng): {
  variant: number;
  k: number;
  d: number;
  a: number;
  b: number;
  vpi: number;
} {
  const variant = rng.int(0, 2);
  if (variant === 0) {
    const d = rng.int(2, 5);
    const b = rng.int(2, 5);
    return { variant, k: 0, d, a: 0, b, vpi: d * d * b };
  }
  if (variant === 1) {
    const useThree = rng.int(0, 1) === 0;
    const k = useThree ? rng.int(1, 5) : 3;
    const b = useThree ? 3 : rng.int(1, 5);
    return { variant, k, d: 0, a: 0, b, vpi: (k * k * b ** 3) / 3 };
  }
  const k = rng.int(1, 3);
  const d = rng.int(1, 5);
  const a = rng.int(-3, 0);
  const b = a + 3;
  const vpi =
    (k * k * (b ** 3 - a ** 3)) / 3 + k * d * (b * b - a * a) + d * d * (b - a);
  return { variant, k, d, a, b, vpi };
}

const rotationsvolumen = {
  id: "rotationsvolumen",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    const { variant, k, d, a, b, vpi } = rotationsFall(rng);
    const fText = linear(k, d);
    const beschreibung =
      variant === 0
        ? `einen Zylinder aus f(x) = ${fmt(d)} über [${fmt(a)} | ${fmt(b)}]`
        : variant === 1
          ? `einen Kegel aus f(x) = ${fmt(k)}x über [${fmt(a)} | ${fmt(b)}]`
          : `einen Kegelstumpf aus f(x) = ${fText} über [${fmt(a)} | ${fmt(b)}]`;
    const hinweis = [
      "V = π ∫ₐᵇ r² dx = π r² h beim Zylinder (f konstant).",
      "V = π ∫₀^h (k x)² dx = π k² h³ : 3 beim Kegel.",
      "V = π ∫ₐᵇ (k x + d)² dx; quadriere die Gerade und integriere gliedweise.",
    ][variant];
    const rechenweg = [
      `f(x)² = ${fmt(d * d)}, ∫_${fmt(a)}^${fmt(b)} f² dx = ${fmt(d * d)} · ${fmt(b - a)} = ${fmt(vpi)}.`,
      `f(x)² = ${fmt(k * k)}x², ∫_${fmt(a)}^${fmt(b)} f² dx = ${fmt(k * k)} · ${fmt(b)}³ : 3 = ${fmt(vpi)}.`,
      `f(x)² = ${quadratic(k * k, 2 * k * d, d * d)}; ∫_${fmt(a)}^${fmt(b)} f² dx = ${fmt(vpi)}.`,
    ][variant];
    if (level === 1) {
      return task(
        1,
        `Ein Rotationskörper entsteht durch Drehen von ${beschreibung} um die x-Achse. Wie groß ist das Volumen? Gib V als Vielfaches von π an.`,
        "",
        [numberField("V = π ·", vpi, "", 2)],
        hinweis,
        [
          "Scheibenmethode: V = π ∫ₐᵇ f(x)² dx.",
          rechenweg,
        ],
        `V = π · ${fmt(vpi)}`,
        { variant, k, d, a, b, vpi },
      );
    }
    return task(
      2,
      "",
      `Ein Bauteil entsteht durch Drehen des Profils f(x) = ${fText} über [${fmt(a)} | ${fmt(b)}] um die x-Achse. Wie groß ist sein Volumen? Gib V als Vielfaches von π an.`,
      [numberField("V = π ·", vpi, "", 2)],
      "V = π ∫ₐᵇ f(x)² dx; quadriere den Profilterm und integriere gliedweise.",
      [
        "Scheibenmethode: Jeder Schnitt bei x ist eine Scheibe mit Fläche π f(x)².",
        rechenweg,
      ],
      `V = π · ${fmt(vpi)}`,
      { variant, k, d, a, b, vpi },
    );
  },
};

const volumenVergleich = {
  id: "volumen-vergleich",
  make: (rng: Rng, level: 1 | 2): ExerciseTask => {
    const r = rng.int(2, 5);
    const h = rng.int(2, 5);
    const k = rng.int(1, 4);
    const h2 = 3;
    const v1 = r * r * h;
    const v2 = (k * k * h2 ** 3) / 3;
    const diff = Math.abs(v1 - v2);
    const groesser = v1 > v2 ? 0 : v1 < v2 ? 1 : 2;
    const angaben = `Ein Zylinder entsteht aus f(x) = ${fmt(r)} über [0 | ${fmt(h)}], ein Kegel aus g(x) = ${fmt(k)}x über [0 | ${fmt(h2)}]`;
    if (level === 1) {
      return task(
        1,
        `${angaben}, jeweils um die x-Achse gedreht. Gib beide Volumina als Vielfaches von π an.`,
        "",
        [
          numberField("V₁ = π ·", v1, "", 2),
          numberField("V₂ = π ·", v2, "", 2),
        ],
        "Zylinder: V = π r² h. Kegel: V = π k² h³ : 3 (aus V = π ∫₀^h (k x)² dx).",
        [
          `Zylinder: V₁ = π · ${fmt(r)}² · ${fmt(h)} = π · ${fmt(v1)}.`,
          `Kegel: V₂ = π · ${fmt(k)}² · ${fmt(h2)}³ : 3 = π · ${fmt(v2)}.`,
        ],
        `V₁ = π · ${fmt(v1)}, V₂ = π · ${fmt(v2)}`,
        { r, h, k, h2, v1, v2 },
      );
    }
    return task(
      2,
      "",
      `${angaben}, jeweils um die x-Achse gedreht. Welcher Körper hat das größere Volumen, und um wie viel Vielfaches von π unterscheiden sich die Volumina?`,
      [
        choiceField(
          "Welcher Körper ist größer?",
          ["der Zylinder", "der Kegel", "beide Volumina sind gleich"],
          groesser,
        ),
        numberField("Unterschied = π ·", diff, "", 2),
      ],
      "Berechne beide Volumina als Vielfaches von π und vergleiche: Zylinder r² h, Kegel k² h³ : 3.",
      [
        `Zylinder: V₁ = π · ${fmt(v1)}; Kegel: V₂ = π · ${fmt(v2)}.`,
        `Vergleich: ${fmt(v1)} ${v1 > v2 ? ">" : v1 < v2 ? "<" : "="} ${fmt(v2)}, also ist ${
          v1 > v2 ? "der Zylinder" : v1 < v2 ? "der Kegel" : "kein Körper"
        } größer.`,
        `Unterschied: |${fmt(v1)} − ${paren(v2)}| = ${fmt(diff)}.`,
      ],
      `${v1 > v2 ? "Der Zylinder" : v1 < v2 ? "Der Kegel" : "Beide Körper"} ${
        v1 === v2 ? "sind gleich groß" : "ist größer"
      }; der Unterschied beträgt π · ${fmt(diff)}.`,
      { r, h, k, h2, v1, v2 },
    );
  },
};

// ─── The lessons ────────────────────────────────────────────────────────────

const flaechenbilanz: Lesson = makeLesson(1, 1, {
  id: "int-1-flaechenbilanz",
  title: "1.1 Das bestimmte Integral als Flächenbilanz",
  subtitle: "Über der Achse positiv, unter der Achse negativ",
  whyItMatters:
    "Fast jede Integralaufgabe im Abitur fragt am Ende nach einer Fläche oder nach einer Bilanz. Wer die Vorzeichen der Flächenstücke sicher liest, verliert keine Punkte mehr an vermeintlichen Kleinigkeiten – und versteht, warum ein Integral auch negativ sein kann.",
  explanationHtml: `
    <p>Zerlege die Fläche zwischen dem Graphen einer Funktion f und der x-Achse in schmale Rechtecke der Breite Δx und Höhe f(x). Die Summe dieser Flächenstücke heißt <strong>Riemann-Summe</strong>; für immer schmalere Rechtecke nähert sie sich dem <strong>bestimmten Integral</strong> ∫<sub>a</sub><sup>b</sup> f(x) dx an.</p>
    <p>Flächenstücke <strong>über</strong> der x-Achse zählen positiv, Stücke <strong>unter</strong> der x-Achse negativ. Das bestimmte Integral ist deshalb eine <strong>Flächenbilanz</strong>:</p>
    <p class="formula-line">∫<sub>a</sub><sup>b</sup> f(x) dx = A⁺ − A⁻</p>
    <p>Dabei ist A⁺ die Fläche zwischen Graph und Achse über der Achse und A⁻ die Fläche darunter, jeweils als positive Zahl. Aus den beiden Teilflächen liest du die Bilanz ab, und umgekehrt verrät das Vorzeichen der Bilanz, welche Seite überwiegt.</p>
    <div class="example">f(x) = x − 2 über [0 | 4]: Die Gerade schneidet die Achse bei x = 2. Links davon liegt ein Dreieck unter der Achse mit A⁻ = 2 · 2 : 2 = 2 FE, rechts eines über der Achse mit A⁺ = 2 · 2 : 2 = 2 FE. Also ist ∫₀⁴ (x − 2) dx = 2 − 2 = 0. Die Gesamtfläche beider Dreiecke beträgt dagegen 4 FE.</div>
    <div class="merke"><strong>Merke:</strong> Die Flächenbilanz ist nicht der Flächeninhalt. Der Flächeninhalt ist A⁺ + A⁻ (alle Stücke positiv gezählt), die Bilanz ist A⁺ − A⁻. Erst wenn der Graph ganz auf einer Seite der Achse liegt, stimmen beide überein.</div>
  `,
  formulas: [
    {
      name: "Flächenbilanz",
      html: "∫<sub>a</sub><sup>b</sup> f(x) dx = A⁺ − A⁻",
      quantities: "A⁺ Fläche über der x-Achse, A⁻ Fläche unter der x-Achse (als positive Zahl)",
    },
    {
      name: "Flächeninhalt zwischen Graph und Achse",
      html: "A = A⁺ + A⁻ = ∫<sub>a</sub><sup>b</sup> |f(x)| dx",
      quantities: "für den Flächeninhalt ohne Vorzeichen",
    },
  ],
  quiz: {
    question:
      "Über [1 | 2] liegen 2 FE zwischen Graph und x-Achse, über [2 | 3] liegen 5 FE zwischen Graph und x-Achse unter der Achse. Was misst ∫₁³ f(x) dx?",
    options: [
      "die Flächenbilanz −3 FE",
      "den Flächeninhalt 7 FE",
      "die Flächenbilanz 3 FE",
      "den Flächeninhalt −3 FE",
    ],
    correctIndex: 0,
    explanation:
      "Das bestimmte Integral ist die Flächenbilanz: A⁺ − A⁻ = 2 − 5 = −3 FE. Der Flächeninhalt wäre A⁺ + A⁻ = 7 FE.",
  },
  lab: lab(
    "area-bilanz",
    "Die Flächenbilanz einer Geraden",
    "Ziehe die Intervallgrenzen a und b an der Achse und stelle mit m und t die Gerade f(x) = m x + t ein. Die Farben zeigen A⁺ (grün) und A⁻ (blau), die Bilanz liest du im Kasten ab.",
    [
      range("m", "Steigung m von f(x) = m x + t", -3, 3, 0.5, 0.5),
      range("t", "Achsenabschnitt t", -4, 4, 1, 1),
      range("a", "Intervallgrenze a", -6, 6, 0, 1),
      range("b", "Intervallgrenze b", -6, 6, 2, 1),
    ],
    [
      readout("ap", "A⁺ (Fläche über der Achse)", (v) => linearBilanz(v.m, v.t, v.a, v.b).ap, "FE"),
      readout("am", "A⁻ (Fläche unter der Achse)", (v) => linearBilanz(v.m, v.t, v.a, v.b).am, "FE"),
      readout(
        "bilanz",
        "Bilanz A⁺ − A⁻",
        (v) => linearBilanz(v.m, v.t, v.a, v.b).bilanz,
        "FE",
        2,
        true,
      ),
    ],
    [
      {
        id: "negativ",
        text: "Stelle eine Bilanz ein, die negativ ist: Mehr Fläche unter der Achse.",
        check: (_v, r) => Number(r.bilanz) < -1e-9,
      },
      {
        id: "ausgleich",
        text: "Erzeuge eine Bilanz von genau 0 mit Flächen auf beiden Seiten.",
        check: (_v, r) =>
          Math.abs(Number(r.bilanz)) < 1e-9 && Number(r.ap) > 1e-9 && Number(r.am) > 1e-9,
      },
      {
        id: "nur-ueber",
        text: "Wähle ein Intervall ganz über der Achse mit A⁺ größer als 4 FE.",
        check: (_v, r) => Number(r.am) < 1e-9 && Number(r.ap) > 4,
      },
    ],
  ),
  exercises: [flaechenwert, bilanzInterpretieren],
});

const integralfunktionLesson: Lesson = makeLesson(1, 2, {
  id: "int-2-integralfunktion",
  title: "1.2 Die Integralfunktion",
  subtitle: "Was die Fläche bis x mit x macht",
  whyItMatters:
    "Die Integralfunktion verbindet Flächen mit dem Verlauf von Funktionen – genau das verlangen Aufgaben zu Verlaufsschluss und Extremstellen im Abitur. Wer F(x) = ∫ₐˣ f(t) dt liest, erkennt sofort, wo eine Größe wächst, fällt oder umkehrt.",
  explanationHtml: `
    <p>Fixiere eine untere Grenze a und lasse die obere Grenze x laufen: <strong>F(x) = ∫<sub>a</sub><sup>x</sup> f(t) dt</strong> heißt <strong>Integralfunktion</strong> von f. Für jedes x zählt F(x) die Flächenbilanz von a bis x. Der Wert hängt also von x ab: F ist eine Funktion, ihr Graph entsteht aus Flächen.</p>
    <p>Das Verhalten von F liest du direkt an f ab:</p>
    <ul>
      <li>Wo <strong>f(x) > 0</strong> liegt, wächst die Bilanz: F ist dort <strong>steigend</strong>.</li>
      <li>Wo <strong>f(x) &lt; 0</strong> liegt, schrumpft die Bilanz: F ist dort <strong>fallend</strong>.</li>
      <li>Wo f das Vorzeichen wechselt, kehrt F um: dort hat F eine <strong>Extremstelle</strong>.</li>
    </ul>
    <p>Das Verhältnis von f und F ist so grundlegend, dass man ihm einen eigenen Namen gibt: F′ = f. Die Ableitung der Integralfunktion ist der Integrand. Den sauberen Beweis dafür bringt der Hauptsatz in der nächsten Lektion; hier genügt die Anschauung: Über einem kurzen Intervall der Länge Δx ändert sich F um etwa f(x) · Δx, also ist die momentane Änderungsrate von F gerade f(x).</p>
    <div class="example">f(t) = 3 ist konstant. Dann ist F(x) = ∫₀ˣ 3 dt = 3x: eine Gerade mit Steigung 3. Für x = 4 ist F(4) = 12 – die Fläche des Rechtecks 3 · 4. Wächst x um 1, wächst F um 3: Die Änderungsrate von F ist tatsächlich f.</div>
    <div class="merke"><strong>Merke:</strong> F(x) = ∫ₐˣ f(t) dt ist die Flächenfunktion mit der festen Untergrenze a. f positiv lässt F steigen, f negativ lässt F fallen, Vorzeichenwechsel von f sind Extremstellen von F.</div>
  `,
  formulas: [
    {
      name: "Integralfunktion",
      html: "F(x) = ∫<sub>a</sub><sup>x</sup> f(t) dt, F(a) = 0",
      quantities: "a feste untere Grenze, x variable obere Grenze",
    },
    {
      name: "Zusammenhang f und F",
      html: "f positiv: F steigend; f negativ: F fallend; Vorzeichenwechsel von f: Extremstelle von F",
      quantities: "F′ = f (anschaulich begründet, Beweis im Hauptsatz)",
    },
  ],
  quiz: {
    question: "Für f(x) = 3 ist F(x) = ∫₀ˣ f(t) dt. Wie verläuft F?",
    options: [
      "linear steigend mit F(x) = 3x",
      "quadratisch mit F(x) = x³",
      "konstant mit F(x) = 3",
      "linear fallend mit F(x) = −3x",
    ],
    correctIndex: 0,
    explanation:
      "Eine konstante Rate erzeugt eine lineare Flächenfunktion: F(x) = 3x wächst um 3 pro Einheit x, also linear steigend.",
  },
  lab: lab(
    "integralfunktion",
    "Integrand und Integralfunktion",
    "Stelle mit m und t den Integranden f(x) = m x + t ein und ziehe x. Blau ist f, grün ist F(x) = ∫₀ˣ f(t) dt. Der Kasten zeigt F(x) und wie f den Verlauf von F bestimmt.",
    [
      range("m", "Steigung m von f", -3, 3, 1, 0.5),
      range("t", "Achsenabschnitt t von f", -3, 3, 0, 1),
      range("x", "Stelle x", -4, 4, 3, 0.5),
    ],
    [
      readout("Fx", "F(x)", (v) => integralFunction(v.m, v.t, v.x), "", 2, true),
      readout("fx", "f(x) = F′(x)", (v) => v.m * v.x + v.t, "", 2),
      readout(
        "df",
        "ΔF über [x − 1 | x]",
        (v) => integralFunction(v.m, v.t, v.x) - integralFunction(v.m, v.t, v.x - 1),
        "",
        2,
      ),
      readout("art", "Verhalten an x", (v) => {
        const fx = v.m * v.x + v.t;
        return fx > 0 ? "f(x) > 0: F steigt" : fx < 0 ? "f(x) < 0: F fällt" : "f(x) = 0: Extremstelle";
      }),
    ],
    [
      {
        id: "maximum",
        text: "Wähle x auf die Stelle, an der F ein Maximum hat (f wechselt von + nach −).",
        check: (v) => v.m < 0 && Math.abs(v.x - -v.t / v.m) < 1e-9,
      },
      {
        id: "nullstelle",
        text: "Stelle F(x) = 0 ein mit einer Stelle x ungleich 0.",
        check: (v) => v.x !== 0 && Math.abs(integralFunction(v.m, v.t, v.x)) < 1e-9,
      },
      {
        id: "wachstum",
        text: "Lass F über [x − 1 | x] genau um 2 wachsen.",
        check: (v) =>
          Math.abs(
            integralFunction(v.m, v.t, v.x) - integralFunction(v.m, v.t, v.x - 1) - 2,
          ) < 1e-9,
      },
    ],
  ),
  exercises: [integralwert, zuordnen],
});

const hauptsatzLesson: Lesson = makeLesson(1, 3, {
  id: "int-3-hauptsatz",
  title: "1.3 Der Hauptsatz der Differential- und Integralrechnung",
  subtitle: "Stammfunktion einsetzen, Grenzen einsetzen, subtrahieren",
  whyItMatters:
    "Der Hauptsatz ist das Werkzeug, mit dem im Abitur praktisch jedes bestimmte Integral berechnet wird. Und er klärt ein für alle Mal den Unterschied zwischen Integralfunktion und Stammfunktion – eine Unterscheidung, die in Prüfungen gezielt abgefragt wird.",
  explanationHtml: `
    <p>Warum gilt F′ = f für die Integralfunktion F(x) = ∫<sub>a</sub><sup>x</sup> f(t) dt? Vergrößere x um ein kleines Δx: Dazu kommt ein Flächenstreifen der Breite Δx und Höhe etwa f(x), also wächst F um rund f(x) · Δx. Die momentane Änderungsrate ist damit f(x); im Grenzwert Δx → 0 wird daraus F′(x) = f(x).</p>
    <p>Genau das nutzt der <strong>Hauptsatz der Differential- und Integralrechnung</strong>: Ist F irgendeine Stammfunktion von f (also F′ = f), dann ist die Flächenbilanz einfach die Differenz der Funktionswerte:</p>
    <p class="formula-line">∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a)</p>
    <p><strong>Integralfunktion und Stammfunktion</strong> auseinanderhalten: Die Integralfunktion F(x) = ∫<sub>a</sub><sup>x</sup> f(t) dt hat die feste Untergrenze a und erfüllt F(a) = 0. Eine Stammfunktion ist jeder Term G mit G′ = f – sie ist nur bis auf eine Konstante bestimmt, denn die Ableitung einer Konstanten verschwindet. Beide unterscheiden sich also höchstens um eine Zahl, und bei der Differenz F(b) − F(a) fällt jede Konstante weg.</p>
    <div class="example">∫₀³ x² dx: Eine Stammfunktion von x² ist F(x) = x³ : 3. Hauptsatz: F(3) − F(0) = 27 : 3 − 0 = 9. Zur Kontrolle: Der Graph von x² liegt über [0 | 3] vollständig über der Achse, die Fläche muss also positiv sein – 9 passt.</div>
    <div class="merke"><strong>Merke:</strong> Stammfunktion bestimmen, obere Grenze einsetzen, untere Grenze einsetzen, subtrahieren. Und: Konstanten (das + C) brauchst du nur beim unbestimmten Integral, nicht beim bestimmten.</div>
  `,
  formulas: [
    {
      name: "Hauptsatz",
      html: "∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a) mit F′ = f",
      quantities: "F Stammfunktion von f, a untere und b obere Grenze",
    },
    {
      name: "Abgrenzung",
      html: "Integralfunktion: F(x) = ∫<sub>a</sub><sup>x</sup> f(t) dt mit fester Untergrenze; Stammfunktion: G′ = f, bestimmt bis auf eine Konstante",
      quantities: "beide unterscheiden sich nur um eine Konstante",
    },
  ],
  quiz: {
    question: "Wie groß ist ∫₀³ x² dx?",
    options: ["9", "6", "12", "3"],
    correctIndex: 0,
    explanation:
      "Eine Stammfunktion von x² ist F(x) = x³ : 3. Der Hauptsatz liefert F(3) − F(0) = 27 : 3 − 0 = 9.",
  },
  lab: lab(
    "hauptsatz",
    "Hauptsatz am Polynom",
    "Stelle f(x) = a x² + b x + c ein und schiebe die Intervallgrenzen u und v. Das Labor rechnet die Bilanz zweimal: einmal über die Stammfunktion (F(b) − F(a)), einmal über die Teilflächen A⁺ und A⁻. Die Differenz muss 0 sein.",
    [
      range("a", "Koeffizient a", -2, 2, 1, 0.5),
      range("b", "Koeffizient b", -4, 4, 0, 1),
      range("c", "Koeffizient c", -6, 6, 2, 1),
      range("u", "Intervallgrenze u", -6, 6, 0, 1),
      range("v", "Intervallgrenze v", -6, 6, 4, 1),
    ],
    [
      readout("fbfa", "F(v) − F(u) über die Stammfunktion", (v) => {
        const F = (x: number) => (v.a * x ** 3) / 3 + (v.b * x * x) / 2 + v.c * x;
        return F(Math.max(v.u, v.v)) - F(Math.min(v.u, v.v));
      }),
      readout("bilanz", "Bilanz aus A⁺ − A⁻", (v) => polyBilanz(v.a, v.b, v.c, v.u, v.v).bilanz, "", 2, true),
      readout("diff", "Differenz der beiden Wege", (v) => {
        const F = (x: number) => (v.a * x ** 3) / 3 + (v.b * x * x) / 2 + v.c * x;
        const fbfa = F(Math.max(v.u, v.v)) - F(Math.min(v.u, v.v));
        return polyBilanz(v.a, v.b, v.c, v.u, v.v).bilanz - fbfa;
      }),
      readout("am", "A⁻ (Fläche unter der Achse)", (v) => polyBilanz(v.a, v.b, v.c, v.u, v.v).am),
    ],
    [
      {
        id: "bilanz-null",
        text: "Finde ein Intervall ungleicher Grenzen, auf dem die Bilanz genau 0 ist.",
        check: (v, r) => v.u !== v.v && Math.abs(Number(r.bilanz)) < 1e-9,
      },
      {
        id: "bilanz-zwoelf",
        text: "Stelle die Bilanz auf genau 12 ein.",
        check: (_v, r) => Math.abs(Number(r.bilanz) - 12) < 1e-9,
      },
      {
        id: "unter-der-achse",
        text: "Sorge dafür, dass A⁻ größer als 0 ist: Dann ist die Bilanz kleiner als die Fläche über der Achse.",
        check: (_v, r) => Number(r.am) > 1e-9,
      },
    ],
  ),
  exercises: [bestimmtesIntegral, stammfunktionPruefen],
});

const graphenLesson: Lesson = makeLesson(1, 4, {
  id: "int-4-graphen",
  title: "1.4 Vom Integranden zur Integralfunktion und zurück",
  subtitle: "Steigend, fallend, Extremstellen",
  whyItMatters:
    "Im Abitur bekommst du oft einen Graphen und sollst ohne Rechnung den Verlauf der zugehörigen Integralfunktion beschreiben – oder umgekehrt. Diese Verlaufsschluss-Aufgaben sind schnell gelöst, wenn du die Merkmale kennst, und teuer, wenn du sie verwechselst.",
  explanationHtml: `
    <p>Der Graph von f verrät den Verlauf von F(x) = ∫<sub>0</sub><sup>x</sup> f(t) dt, und der Graph von F verrät f zurück. Die charakteristischen Merkmale:</p>
    <ul>
      <li><strong>f positiv</strong> auf einem Intervall ⇔ F dort <strong>steigend</strong>; f negativ ⇔ F fallend.</li>
      <li><strong>Vorzeichenwechsel von + nach −</strong> bei x₀ ⇔ F hat bei x₀ ein <strong>Maximum</strong>; von − nach + ⇔ ein <strong>Minimum</strong>.</li>
      <li><strong>f konstant</strong> ⇔ F linear; <strong>f linear</strong> ⇔ F eine Parabel (Stammfunktion hebt den Grad um 1).</li>
      <li>Umgekehrt: Wo F steigt, ist f positiv; wo F einen Wendepunkt hat, hat f eine Extremstelle.</li>
    </ul>
    <p>Achtung bei der Umkehrung: Extremstellen von F sind Nullstellen von f <strong>mit</strong> Vorzeichenwechsel. Eine Nullstelle ohne Wechsel (z. B. bei einem doppelten Nullpunkt) ist keine Extremstelle von F.</p>
    <div class="example">f(x) = x − 2: f ist negativ vor x = 2 und positiv danach. Also fällt F bis 2 und steigt ab 2 – F hat bei x = 2 ein Minimum. Der Wert: F(2) = ∫₀² (t − 2) dt = 2 − 4 = −2. Bei x = 4 ist F(4) = 8 − 8 = 0: F kehrt bei 4 auf Null zurück.</div>
    <div class="merke"><strong>Merke:</strong> f beschreibt die Steigung von F. Über der Achse wächst F, unter der Achse schrumpft F, und an den Vorzeichenwechseln von f kehrt F um.</div>
  `,
  formulas: [
    {
      name: "Verlaufsschluss",
      html: "f positiv ⇒ F steigend; f negativ ⇒ F fallend; Vorzeichenwechsel von f bei x₀ ⇒ Extremstelle von F bei x₀",
      quantities: "F Integralfunktion von f, x₀ Stelle des Vorzeichenwechsels",
    },
    {
      name: "Grad-Anhebung",
      html: "f konstant ⇒ F linear; f linear ⇒ F quadratisch",
      quantities: "Stammfunktionen erhöhen den Grad bei Polynomen um 1",
    },
  ],
  quiz: {
    question: "Die Funktion f wechselt bei x = 2 das Vorzeichen von + nach −. Was gilt für F(x) = ∫₀ˣ f(t) dt?",
    options: [
      "F hat bei x = 2 ein Maximum.",
      "F hat bei x = 2 ein Minimum.",
      "F hat bei x = 2 eine Nullstelle.",
      "F ist bei x = 2 nicht definiert.",
    ],
    correctIndex: 0,
    explanation:
      "Vor + nach − heißt: F steigt vorher und fällt nachher. Das ist die Definition eines Maximums; eine Nullstelle folgt daraus nicht.",
  },
  lab: lab(
    "graph-schluss",
    "Vom Integranden zur Integralfunktion",
    "Stelle f(x) = a(x − s)² + k ein; gezeichnet sind f (blau) und F(x) = ∫₀ˣ f(t) dt (grün). Der Kasten kontrolliert die Ableitung: F′(x) muss f(x) ergeben. Ziehe x auf eine Extremstelle und prüfe das Verhalten.",
    [
      range("a", "Faktor a von f", -2, 2, 1, 0.5),
      range("s", "Scheitel-Abstand s", -5, 5, 0, 1),
      range("k", "Höhe k", -4, 4, 2, 1),
      range("x", "Stelle x", -5, 5, 1, 0.5),
    ],
    [
      readout("Fx", "F(x)", (v) => paraIntegral(v.a, v.s, v.k, v.x), "", 2, true),
      readout("steigung", "F′(x) = f(x)", (v) => v.a * (v.x - v.s) ** 2 + v.k, "", 2),
      readout("anzahl", "Extremstellen von F im Fenster", (v) =>
        signChangeCount(v.a, v.s, v.k, -5, 5),
      ),
      readout("art", "Verhalten an x", (v) => {
        const fx = v.a * (v.x - v.s) ** 2 + v.k;
        return fx > 0
          ? "f(x) > 0: F steigt hier"
          : fx < 0
            ? "f(x) < 0: F fällt hier"
            : "f(x) = 0: Extremstellen-Kandidat";
      }),
    ],
    [
      {
        id: "maximum",
        text: "Lege x auf das Maximum von F: f wechselt dort von + nach −.",
        check: (v) =>
          v.a < 0 &&
          v.k > 0 &&
          Math.abs(v.x - (v.s + Math.sqrt(v.k / -v.a))) < 1e-9,
      },
      {
        id: "nullstelle",
        text: "Stelle F(x) = 0 ein mit einer Stelle x ungleich 0.",
        check: (v) => v.x !== 0 && Math.abs(paraIntegral(v.a, v.s, v.k, v.x)) < 1e-9,
      },
      {
        id: "eine-extremstelle",
        text: "Finde eine Einstellung mit genau einer Extremstelle im Fenster (−5 bis 5) und einem negativen F(x).",
        check: (v) =>
          signChangeCount(v.a, v.s, v.k, -5, 5) === 1 &&
          paraIntegral(v.a, v.s, v.k, v.x) < 0,
      },
    ],
  ),
  exercises: [graphSchluss, extremstelle],
});

const stammfunktionenLesson: Lesson = makeLesson(1, 5, {
  id: "int-5-stammfunktionen",
  title: "1.5 Stammfunktionen und Integrationsregeln",
  subtitle: "Potenz, e-Funktion, verkettete Regeln",
  whyItMatters:
    "Ohne Stammfunktionen kein bestimmtes Integral – und in der Prüfung kommen selten nur Potenzterme. Die drei verketteten Regeln aus dem Lehrplan (f′/f, f′ · e^f, f(ax+b)) tauchen in Kombinationsaufgaben immer wieder auf und entscheiden über Erfolg oder Misserfolg.",
  explanationHtml: `
    <p>Eine <strong>Stammfunktion</strong> von f ist jeder Term F mit F′ = f. Da die Ableitung einer Konstanten verschwindet, sind Stammfunktionen nur bis auf eine Konstante bestimmt: Schreibe beim unbestimmten Integral immer <strong>+ C</strong> dazu.</p>
    <p>Die wichtigsten Regeln:</p>
    <ul>
      <li><strong>Potenzregel:</strong> ∫ x<sup>n</sup> dx = x<sup>n+1</sup> : (n + 1) + C (für n ≠ −1).</li>
      <li><strong>Kehrwert:</strong> ∫ 1 : x dx = ln|x| + C.</li>
      <li><strong>e-Funktion:</strong> ∫ e<sup>x</sup> dx = e<sup>x</sup> + C, allgemein ∫ e<sup>ax+b</sup> dx = e<sup>ax+b</sup> : a + C.</li>
      <li><strong>Regel für f′ : f:</strong> ∫ f′(x) : f(x) dx = ln|f(x)| + C.</li>
      <li><strong>Regel für f′ · e<sup>f</sup>:</strong> ∫ f′(x) · e<sup>f(x)</sup> dx = e<sup>f(x)</sup> + C.</li>
      <li><strong>Lineare Verkettung:</strong> ∫ f(ax + b) dx = F(ax + b) : a + C mit der Stammfunktion F von f.</li>
    </ul>
    <p>Der Trick bei verketteten Termen: Erkenne im Zähler (oder als Faktor) die Ableitung des inneren Terms. Dann liegt eine der Regeln direkt vor – meistens muss nichts substituiert werden.</p>
    <div class="example">∫ (3x + 2 : x) dx = 3x² : 2 + 2 ln|x| + C. Kontrolle durch Ableiten: (3x² : 2)′ = 3x und (2 ln|x|)′ = 2 : x – das ist f.</div>
    <div class="merke"><strong>Merke:</strong> Beim bestimmten Integral fällt das + C in der Differenz F(b) − F(a) weg. Kontrolliere jede Stammfunktion durch Ableiten – das ist der schnellste Fehlercheck überhaupt.</div>
  `,
  formulas: [
    {
      name: "Potenz- und Kehrwertregel",
      html: "∫ x<sup>n</sup> dx = x<sup>n+1</sup> : (n + 1) + C; ∫ 1 : x dx = ln|x| + C",
      quantities: "n ≠ −1; + C nur beim unbestimmten Integral",
    },
    {
      name: "Verkettete Regeln",
      html: "∫ f′(x) : f(x) dx = ln|f(x)| + C; ∫ f′(x) · e<sup>f(x)</sup> dx = e<sup>f(x)</sup> + C; ∫ f(ax + b) dx = F(ax + b) : a + C",
      quantities: "F Stammfunktion von f; die innere Ableitung muss als Faktor erkennbar sein",
    },
  ],
  quiz: {
    question: "Welche Stammfunktion hat f(x) = 1 : x?",
    options: [
      "F(x) = ln|x| + C",
      "F(x) = 1 : x² + C",
      "F(x) = −1 : x² + C",
      "F(x) = x · ln|x| + C",
    ],
    correctIndex: 0,
    explanation:
      "Die Ableitung von ln|x| ist 1 : x. Die anderen Terme leiten zu −1 : x² bzw. zu Produkten ab, nicht zu 1 : x.",
  },
  lab: lab(
    "stammfunktion",
    "Stammfunktionen auf die Probe stellen",
    "Wähle eine Funktionsfamilie und stelle die Parameter ein. Der Kasten zeigt die zugehörige Stammfunktion und die Probe: Die mittlere Änderung von F an der Stelle x muss f(x) ergeben. Nur wenn die Probe klein ist, passt die Stammfunktion.",
    [
      choice("fam", "Funktion", [
        "f(x) = x^n",
        "f(x) = e^(ax+b)",
        "f(x) = f′/f-Typ",
        "f(x) = f′ · e^f-Typ",
      ]),
      range("n", "Exponent n", 1, 4, 3, 1),
      range("a", "Faktor a im Exponenten", 1, 3, 1, 1),
      range("b", "Summand b im Exponenten", -2, 2, 0, 1),
      range("p", "Faktor p", 1, 3, 1, 1),
      range("q", "Summand q", 0, 2, 0, 1),
      range("x", "Stelle x", 0.5, 4, 2, 0.5),
    ],
    [
      readout("term", "Stammfunktion", (v) => stammCase(v).termF),
      readout("Fx", "F(x)", (v) => stammCase(v).Fx, "", 2, true),
      readout("fx", "f(x)", (v) => stammCase(v).fx, "", 2),
      readout("probe", "Probe |ΔF − f(x)|", (v) => stammCase(v).probe, "", 4),
    ],
    [
      {
        id: "ln-typ",
        text: "Wähle den f′/f-Typ und lies die Stammfunktion F(x) = ln|…| ab.",
        check: (v, r) => v.fam === 2 && String(r.term).includes("ln"),
      },
      {
        id: "probe",
        text: "Stelle eine Einstellung ein, bei der die Probe unter 0,01 liegt.",
        check: (_v, r) => Number(r.probe) < 0.01,
      },
      {
        id: "zwei",
        text: "Stelle F(x) = 2 ein.",
        check: (_v, r) => Math.abs(Number(r.Fx) - 2) < 1e-9,
      },
    ],
  ),
  exercises: [stammterm, regelAnwenden],
});

const flaechenLesson: Lesson = makeLesson(1, 6, {
  id: "int-6-flaechen",
  title: "1.6 Flächen zwischen zwei Graphen",
  subtitle: "Oberer Graph minus unterer Graph",
  whyItMatters:
    "Flächen zwischen zwei Kurven sind der Klassiker unter den Integralaufgaben: Soll-Ist-Vergleiche, Preisdifferenzen, Überschüsse. Wer die Grenzen aus den Schnittpunkten nimmt und richtig sortiert, hat die Aufgabe im Prinzip schon gelöst.",
  explanationHtml: `
    <p>Die Fläche zwischen zwei Graphen f und g über [a | b] ist das Integral über die <strong>Differenz der Funktionen</strong>:</p>
    <p class="formula-line">A = ∫<sub>a</sub><sup>b</sup> |f(x) − g(x)| dx</p>
    <p>Liegt f durchgängig über g, genügt A = ∫<sub>a</sub><sup>b</sup> (f(x) − g(x)) dx. Die <strong>Schnittpunkte</strong> der beiden Graphen sind die natürlichen Integrationsgrenzen: Zwischen ihnen liegt die Fläche zusammenhängend, und dort wechselt f − g das Vorzeichen, wenn sich die Graphen kreuzen. Dann zerlegst du das Integral an den Schnittpunkten und addierst die Beträge.</p>
    <p>Vorgehen Schritt für Schnitt:</p>
    <ol class="steps">
      <li><strong>Schnittpunkte bestimmen:</strong> f(x) = g(x) lösen.</li>
      <li><strong>Oberen und unteren Graphen klären:</strong> Testpunkt zwischen die Schnittpunkte setzen.</li>
      <li><strong>Integrieren:</strong> ∫ (oben − unten) dx, bei Vorzeichenwechseln stückweise.</li>
    </ol>
    <div class="example">f(x) = x² und g(x) = x über [0 | 1]: Schnittpunkte bei 0 und 1. Auf (0 | 1) liegt g über f, also ist A = ∫₀¹ (x − x²) dx = [x² : 2 − x³ : 3]₀¹ = 1 : 2 − 1 : 3 = 1 : 6 FE.</div>
    <div class="merke"><strong>Merke:</strong> Immer „oben minus unten“ – nicht f minus g per se. Wer die Reihenfolge falsch wählt, bekommt das richtige Vorzeichen mit umgekehrtem Vorzeichen; beim Flächeninhalt nimmst du am Ende den Betrag.</div>
  `,
  formulas: [
    {
      name: "Fläche zwischen zwei Graphen",
      html: "A = ∫<sub>a</sub><sup>b</sup> |f(x) − g(x)| dx; bei f ≥ g: A = ∫<sub>a</sub><sup>b</sup> (f(x) − g(x)) dx",
      quantities: "a, b meist die Schnittpunkte von f und g",
    },
    {
      name: "Schnittpunkte",
      html: "f(x) = g(x) lösen, bei f − g = a(x − x₁)(x − x₂): A = |a| · (x₂ − x₁)³ : 6",
      quantities: "x₁, x₂ die Schnittpunkte, a der Faktor vor x² der Differenz",
    },
  ],
  quiz: {
    question: "Wie berechnest du die Fläche zwischen f(x) = x² und g(x) = x über [0 | 1]?",
    options: [
      "A = ∫₀¹ (g(x) − f(x)) dx = 1 : 6",
      "A = ∫₀¹ (f(x) − g(x)) dx = 1 : 6",
      "A = 1 : 2, die Fläche des Dreiecks unter g",
      "A = 0, weil sich die Graphen schneiden",
    ],
    correctIndex: 0,
    explanation:
      "Auf (0 | 1) liegt g über f, also ist „oben minus unten“ g − f. Das Integral liefert 1 : 2 − 1 : 3 = 1 : 6; ein negatives Vorzeichen würde die Reihenfolge verraten.",
  },
  lab: lab(
    "zwei-graphen",
    "Fläche zwischen Parabel und Gerade",
    "Stelle f(x) = a x² + b und g(x) = m x + t ein und wähle die Grenzen: automatisch zwischen den Schnittpunkten oder fest auf [0 | 2]. Die Fläche zwischen den Graphen wird farbig gezeigt, die Schnittpunkte sind markiert.",
    [
      range("a", "Faktor a von f", -2, 2, 1, 0.5),
      range("b", "Summand b von f", -4, 4, 2, 1),
      range("m", "Steigung m von g", -3, 3, 0, 0.5),
      range("t", "Achsenabschnitt t von g", -4, 4, 0, 1),
      range("x", "Stelle x für die Differenz", -5, 5, 1, 0.5),
      choice("grenzen", "Intervallgrenzen", [
        "zwischen den Schnittpunkten",
        "fest [0 | 2]",
      ]),
    ],
    [
      readout("schnittpunkte", "Schnittpunkte", (v) => {
        const { A, B, C } = graphenDiff(v);
        const xs = quadRoots(A, B, C);
        return xs.length === 2
          ? `x₁ = ${fmt(xs[0])}, x₂ = ${fmt(xs[1])}`
          : xs.length === 1
            ? `x = ${fmt(xs[0])} (Berührung)`
            : "keine Schnittpunkte";
      }),
      readout("flaeche", "Fläche zwischen den Graphen", (v) => {
        const { A, B, C } = graphenDiff(v);
        const xs = quadRoots(A, B, C);
        const two = xs.length === 2;
        const u = v.grenzen === 1 || !two ? 0 : xs[0];
        const w = v.grenzen === 1 || !two ? 2 : xs[1];
        return absQuadraticArea(A, B, C, u, w);
      }, "", 2, true),
      readout("differenz", "f(x) − g(x) an der Stelle x", (v) => v.a * v.x * v.x + v.b - (v.m * v.x + v.t)),
      readout("intervall", "Verwendetes Intervall", (v) => {
        const { A, B, C } = graphenDiff(v);
        const xs = quadRoots(A, B, C);
        const two = xs.length === 2;
        const u = v.grenzen === 1 || !two ? 0 : xs[0];
        const w = v.grenzen === 1 || !two ? 2 : xs[1];
        return `[${fmt(u)} | ${fmt(w)}]${v.grenzen === 0 && !two ? " (Ersatzgrenzen)" : ""}`;
      }),
    ],
    [
      {
        id: "zwei-schnittpunkte",
        text: "Stelle zwei Schnittpunkte ein und lies die Fläche dazwischen ab.",
        check: (v, r) => {
          const { A, B, C } = graphenDiff(v);
          return quadRoots(A, B, C).length === 2 && Number(r.flaeche) > 1e-9;
        },
      },
      {
        id: "flaeche-acht",
        text: "Stelle die Fläche auf genau 8 ein.",
        check: (_v, r) => Math.abs(Number(r.flaeche) - 8) < 1e-9,
      },
      {
        id: "ohne-schnitt",
        text: "Wähle eine Einstellung ohne Schnittpunkt und rechne die Fläche über [0 | 2] aus.",
        check: (v, r) => {
          const { A, B, C } = graphenDiff(v);
          return (
            quadRoots(A, B, C).length === 0 &&
            v.grenzen === 1 &&
            Number(r.flaeche) > 1e-9
          );
        },
      },
    ],
  ),
  exercises: [flaecheZwischen, schnittpunkte],
});

const uneigentlichLesson: Lesson = makeLesson(1, 7, {
  id: "int-7-uneigentlich",
  title: "1.7 Uneigentliche Integrale",
  subtitle: "Grenzwert statt Zahlengerade",
  whyItMatters:
    "Uneigentliche Integrale treten überall dort auf, wo etwas über unendlich lange Zeit andauert oder am Rand unendlich groß wird – Energieaufnahme, Zersetzungsprozesse, Wahrscheinlichkeiten. Im Abitur wird gern die Entscheidung konvergiert/divergiert zusammen mit einem konkreten Wert verlangt.",
  explanationHtml: `
    <p>Manche Integrale sprengen den Rahmen des bestimmten Integrals, weil eine Grenze unendlich ist oder der Integrand nahe einer Grenze unbeschränkt wird. Dann ersetzt ein <strong>Grenzwert</strong> die fehlende Grenze:</p>
    <p class="formula-line">∫<sub>1</sub><sup>∞</sup> f(x) dx = lim<sub>b→∞</sub> ∫<sub>1</sub><sup>b</sup> f(x) dx</p>
    <p>Existiert dieser Grenzwert, <strong>konvergiert</strong> das uneigentliche Integral; wächst der Wert ohne Schranke, <strong>divergiert</strong> es. Das Prototyp-Beispiel ist f(x) = 1 : x<sup>p</sup> über [1 | ∞):</p>
    <ul>
      <li><strong>p > 1:</strong> konvergiert, der Grenzwert ist 1 : (p − 1).</li>
      <li><strong>p ≤ 1:</strong> divergiert – auch p = 1, denn ∫₁ᵇ 1 : x dx = ln b wächst über jede Schranke.</li>
    </ul>
    <p>Nahe x = 0 wird 1 : x<sup>p</sup> unbeschränkt; dort rechnest du genauso mit einem Grenzwert, z. B. ∫₀¹ 1 : √x dx = lim<sub>c→0</sub> ∫<sub>c</sub><sup>1</sup> x<sup>−1/2</sup> dx = 2.</p>
    <div class="example">∫₁^∞ 1 : x² dx: ∫₁^b x^(−2) dx = [−1 : x]₁^b = 1 − 1 : b. Für b → ∞ strebt 1 : b gegen 0, also ist der Grenzwert 1. Die Fläche unter dem Graphen über [1 | ∞) ist endlich: genau 1.</div>
    <div class="merke"><strong>Merke:</strong> Rechne zuerst das bestimmte Integral bis b, dann den Grenzwert b → ∞. Und merke dir die Entscheidungsregel: ∫₁^∞ 1 : x<sup>p</sup> konvergiert genau bei p > 1.</div>
  `,
  formulas: [
    {
      name: "Uneigentliches Integral",
      html: "∫<sub>1</sub><sup>∞</sup> f(x) dx = lim<sub>b→∞</sub> ∫<sub>1</sub><sup>b</sup> f(x) dx",
      quantities: "Grenzwert des bestimmten Integrals, falls er existiert",
    },
    {
      name: "Prototyp 1 : x hoch p",
      html: "∫<sub>1</sub><sup>b</sup> 1 : x<sup>p</sup> dx = (b<sup>1−p</sup> − 1) : (1 − p) für p ≠ 1, ln b für p = 1; Konvergenz genau für p > 1 mit Grenzwert 1 : (p − 1)",
      quantities: "p Exponent, b obere Grenze",
    },
  ],
  quiz: {
    question: "Welches uneigentliche Integral konvergiert?",
    options: [
      "∫₁^∞ 1 : x² dx",
      "∫₁^∞ 1 : x dx",
      "∫₁^∞ 1 : √x dx",
      "∫₀¹ 1 : x² dx",
    ],
    correctIndex: 0,
    explanation:
      "Bei 1 : x² ist p = 2 größer als 1, also konvergiert das Integral (Grenzwert 1 : (2 − 1) = 1). Bei 1 : x und 1 : √x ist p ≤ 1 über [1 | ∞), und ∫₀¹ 1 : x² dx divergiert am linken Rand.",
  },
  lab: lab(
    "uneigentlich",
    "1 : x hoch p – wie viel Fläche sammelt sich an?",
    "Stelle den Exponenten p und die obere Grenze b ein. Die schraffierte Fläche ist ∫₁^b 1 : x^p dx; die Vergleichslinien bei 10 und 50 zeigen, wie viel im langen Schwanz noch dazukommt.",
    [
      range("p", "Exponent p", 0.5, 3, 1, 0.5),
      range("b", "obere Grenze b", 1, 50, 10, 1),
    ],
    [
      readout("wert", "∫₁^b 1 : x^p dx", (v) => uneigentlich(v.p, v.b), "", 3, true),
      readout("wert10", "∫₁^10 1 : x^p dx", (v) => uneigentlich(v.p, 10), "", 3),
      readout("wert50", "∫₁^50 1 : x^p dx", (v) => uneigentlich(v.p, 50), "", 3),
      readout("fall", "Fall für b → ∞", (v) =>
        v.p > 1
          ? `konvergiert gegen 1 : (${fmt(v.p)} − 1) = ${fmt(1 / (v.p - 1))}`
          : "divergiert, der Wert wächst weiter",
      ),
    ],
    [
      {
        id: "klein",
        text: "Wähle p größer als 1 so, dass der Wert ∫₁^b unter 1,2 bleibt.",
        check: (v, r) => v.p > 1 && Number(r.wert) < 1.2,
      },
      {
        id: "logarithmus",
        text: "Stelle p = 1 ein und lass den Wert über 3 wachsen.",
        check: (v, r) => v.p === 1 && Number(r.wert) > 3,
      },
      {
        id: "schwanz",
        text: "Mache die Divergenz sichtbar: Der Wert bei b = 50 soll um mindestens 2 über dem Wert bei b = 10 liegen.",
        check: (_v, r) => Number(r.wert50) - Number(r.wert10) >= 2,
      },
    ],
  ),
  exercises: [uneigentlichWert, konvergenz],
});

const gesamtAenderungLesson: Lesson = makeLesson(1, 8, {
  id: "int-8-gesaendteraenderung",
  title: "1.8 Das bestimmte Integral als Gesamtänderung",
  subtitle: "Von der Momentanrate zur Gesamtmenge",
  whyItMatters:
    "Geschwindigkeit und Strecke, Zuwachsrate und Bestand, Leistung und Energie: Überall dort, wo eine Rate gegeben ist, liefert das bestimmte Integral die Gesamtmenge. Diese Übersetzung ist eine der meistverlangten Kompetenzen im Abitur und im Studium Alltag.",
  explanationHtml: `
    <p>Beschreibt f(t) die <strong>momentane Änderungsrate</strong> einer Größe (z. B. die Geschwindigkeit), dann ist das bestimmte Integral die <strong>Gesamtänderung</strong>:</p>
    <p class="formula-line">∫<sub>a</sub><sup>b</sup> r(t) dt = M(b) − M(a)</p>
    <p>Beispiel Geschwindigkeit: v(t) ist die Änderungsrate der Position, also ist ∫<sub>a</sub><sup>b</sup> v(t) dt die <strong>Verschiebung</strong> – mit Vorzeichen: Rückwärtsfahrten zählen negativ. Die <strong>Strecke</strong> dagegen addiert nur Bewegung, ohne Vorzeichen: s = ∫<sub>a</sub><sup>b</sup> |v(t)| dt.</p>
    <ul>
      <li><strong>Verschiebung</strong> = Flächenbilanz des v-Graphen (kann 0 sein, obwohl gefahren wurde).</li>
      <li><strong>Strecke</strong> = Flächeninhalt des v-Graphen (alle Stücke positiv).</li>
    </ul>
    <p>Denselben Unterschied machst du bei jeder Rate: Eine Bilanz kann 0 sein, während viel hin- und herbewegt wurde. Die Einheiten passen immer als „Rate mal Zeit“.</p>
    <div class="example">v(t) = 4 m/s auf [0 | 2] s und v(t) = −2 m/s auf [2 | 5] s. Verschiebung: 4 · 2 + (−2) · 3 = 8 − 6 = 2 m. Strecke: 8 + 6 = 14 m. Das Fahrzeug steht am Ende 2 m weiter vorn, hat aber 14 m zurückgelegt.</div>
    <div class="merke"><strong>Merke:</strong> Der Integrand ist die lokale Änderungsrate, das Integral die Gesamtmenge. Für die Strecke nimmst du den Betrag, für die Verschiebung das Vorzeichen.</div>
  `,
  formulas: [
    {
      name: "Gesamtänderung",
      html: "∫<sub>a</sub><sup>b</sup> r(t) dt = M(b) − M(a)",
      quantities: "r lokale Änderungsrate, M die gesuchte Größe",
    },
    {
      name: "Strecke und Verschiebung",
      html: "Verschiebung = ∫<sub>a</sub><sup>b</sup> v(t) dt; Strecke = ∫<sub>a</sub><sup>b</sup> |v(t)| dt",
      quantities: "v Geschwindigkeit; Einheit der Fläche: (m/s) · s = m",
    },
  ],
  quiz: {
    question: "Ein Fahrzeug hat auf [0 | 3] s die konstante Geschwindigkeit v(t) = −2 m/s. Was misst ∫₀³ v(t) dt?",
    options: [
      "eine Verschiebung von −6 m (das Fahrzeug fährt rückwärts)",
      "eine Strecke von −6 m",
      "eine Verschiebung von 6 m",
      "eine Strecke von 0 m",
    ],
    correctIndex: 0,
    explanation:
      "Das Integral der Geschwindigkeit ist die Verschiebung: (−2 m/s) · 3 s = −6 m. Strecken sind nie negativ; die Strecke wäre 6 m.",
  },
  lab: lab(
    "gesamt-aenderung",
    "Geschwindigkeitsprofil als Bilanz",
    "Das Profil ist zweiphasig: Mit vmax fährst du vorwärts, danach rückwärts mit vback. Verschiebung und Strecke entstehen als Flächen über und unter der Achse; die mittlere Geschwindigkeit bezieht sich auf die Strecke.",
    [
      range("vmax", "Höchstgeschwindigkeit vmax (Hinweg)", 1, 6, 3, 1),
      range("t1", "Dauer der Hinphase t1", 1, 5, 2, 1),
      range("vback", "Rückwärtsgeschwindigkeit vback", 0, 6, 1, 1),
      range("T", "Gesamtdauer T", 2, 10, 5, 1),
    ],
    [
      readout("verschiebung", "Verschiebung", (v) => profilData(v).disp, "m", 2, true),
      readout("strecke", "Strecke", (v) => profilData(v).strecke, "m"),
      readout("mittel", "Mittelgeschwindigkeit", (v) => profilData(v).mittel, "m/s"),
      readout("phasen", "Phasen", (v) => {
        const { t1 } = profilData(v);
        return `[0 | ${fmt(t1)}] s mit ${fmt(v.vmax)} m/s, danach ${fmt(Math.max(0, v.T - t1))} s mit ${fmt(-v.vback)} m/s`;
      }),
    ],
    [
      {
        id: "hin-rueck",
        text: "Stelle einen echten Hin- und Rückweg ein: Verschiebung 0, aber Strecke größer als 0.",
        check: (_v, r) => Math.abs(Number(r.verschiebung)) < 1e-9 && Number(r.strecke) > 1e-9,
      },
      {
        id: "strecke-zehn",
        text: "Stelle die Strecke auf genau 10 m ein.",
        check: (_v, r) => Math.abs(Number(r.strecke) - 10) < 1e-9,
      },
      {
        id: "acht",
        text: "Fahre mit vmax = 5 und erreiche eine Verschiebung von genau 8 m.",
        check: (v, r) => v.vmax === 5 && Math.abs(Number(r.verschiebung) - 8) < 1e-9,
      },
    ],
  ),
  exercises: [streckeGeschwindigkeit, gesamtAenderung],
});

const rotationsLesson: Lesson = makeLesson(1, 9, {
  id: "int-9-rotationskoerper",
  title: "1.9 Rotationskörper und Volumen",
  subtitle: "π ∫ f² um die x-Achse",
  whyItMatters:
    "Rotationskörper verbinden Integralrechnung mit Raumgeometrie – eine im Abitur gern geprüfte Verbindung. Wer die Scheibenmethode versteht, leitet Zylinder- und Kegelvolumen nicht nur nach, sondern erkennt, warum die Formeln aussehen wie sie aussehen.",
  explanationHtml: `
    <p>Dreht man den Graphen von f(x) ≥ 0 über [a | b] um die x-Achse, entsteht ein <strong>Rotationskörper</strong>. Schneide ihn senkrecht zur x-Achse in dünne Scheiben: Bei x hat die Scheibe den Radius f(x) und die Fläche π · f(x)². Aufsummieren und im Grenzwert integrieren liefert die <strong>Scheibenmethode</strong>:</p>
    <p class="formula-line">V = π ∫<sub>a</sub><sup>b</sup> f(x)² dx</p>
    <p>Die bekannten Körperformeln sind Spezialfälle:</p>
    <ul>
      <li><strong>Zylinder</strong> (f(x) = r konstant): V = π ∫<sub>a</sub><sup>b</sup> r² dx = π r² h.</li>
      <li><strong>Kegel</strong> (f(x) = k x über [0 | h]): V = π ∫<sub>0</sub><sup>h</sup> k²x² dx = π k² h³ : 3 = π r² h : 3 mit r = k h.</li>
    </ul>
    <p>Achte auf das <strong>Quadrat</strong> von f: Negative Funktionswerte ergeben durch das Quadrat dieselbe Fläche – der Körper hängt nur vom Abstand zur Achse ab. Willst du um eine andere Achse drehen, musst du zuerst den Radius als Funktion der Drehachse aufschreiben.</p>
    <div class="example">f(x) = 2x über [0 | 3] um die x-Achse: V = π ∫₀³ 4x² dx = π · [4x³ : 3]₀³ = π · 36. Ein Kegel mit Grundradius r = f(3) = 6 und Höhe 3: π r² h : 3 = π · 36 · 3 : 3 = π · 36 – die Formeln stimmen überein.</div>
    <div class="merke"><strong>Merke:</strong> V = π ∫ₐᵇ f(x)² dx, immer mit dem Radius zur x-Achse. Erst quadrieren, dann integrieren – nicht umgekehrt.</div>
  `,
  formulas: [
    {
      name: "Scheibenmethode",
      html: "V = π ∫<sub>a</sub><sup>b</sup> f(x)² dx",
      quantities: "f(x) Radius der Scheibe bei x, Drehung um die x-Achse",
    },
    {
      name: "Zylinder und Kegel",
      html: "Zylinder: V = π r² h; Kegel: V = π r² h : 3",
      quantities: "r Grundradius, h Höhe; Spezialfälle von f konstant bzw. f linear",
    },
  ],
  quiz: {
    question: "Welches Volumen hat der Rotationskörper aus f(x) = 2 über [0 | 3], um die x-Achse gedreht?",
    options: ["V = 12π", "V = 36π", "V = 6π", "V = 4π"],
    correctIndex: 0,
    explanation:
      "f ist konstant, also ist der Körper ein Zylinder mit r = 2 und h = 3: V = π r² h = π · 4 · 3 = 12π. Mit der Formel: π ∫₀³ 4 dx = π · 12.",
  },
  lab: lab(
    "rotationskoerper",
    "Rotationskörper aus einer Geraden",
    "Stelle f(x) = k x + d und das Intervall [a | b] ein. Der Körper wird als Scheibenreihe gezeigt; V = π ∫ f² dx wird exakt berechnet und mit der Körperart (Zylinder, Kegel, Kegelstumpf) verglichen.",
    [
      range("k", "Steigung k von f", -6, 6, 0, 0.5),
      range("d", "Achsenabschnitt d", -6, 6, 2, 1),
      range("a", "Intervallgrenze a", -6, 6, 0, 1),
      range("b", "Intervallgrenze b", -6, 6, 3, 1),
    ],
    [
      readout("vpi", "V als Vielfaches von π", (v) => rotationData(v).vpi, "", 2, true),
      readout("V", "Volumen V", (v) => rotationData(v).V, "", 2),
      readout("radius", "mittlerer Radius", (v) => rotationData(v).radius, "", 2),
      readout("art", "Körperart", (v) => rotationData(v).art),
    ],
    [
      {
        id: "zylinder",
        text: "Stelle einen Zylinder (k = 0) mit V = 27π ein.",
        check: (v, r) => Math.abs(v.k) < 1e-9 && Math.abs(Number(r.vpi) - 27) < 1e-9,
      },
      {
        id: "kegel",
        text: "Stelle einen Kegel mit V = 12π ein.",
        check: (v, r) =>
          Math.abs(v.k) > 1e-9 &&
          rotationData(v).art === "Kegel" &&
          Math.abs(Number(r.vpi) - 12) < 1e-9,
      },
      {
        id: "gross",
        text: "Erzeuge einen Rotationskörper mit V größer als 50.",
        check: (_v, r) => Number(r.V) > 50,
      },
    ],
  ),
  exercises: [rotationsvolumen, volumenVergleich],
});

export const STAGE_INTEGRAL = makeStage(
  1,
  "Bestimmtes Integral, Stammfunktionen, Flächen und Rotationskörper",
  "#2563eb",
  "∫",
  [
    flaechenbilanz,
    integralfunktionLesson,
    hauptsatzLesson,
    graphenLesson,
    stammfunktionenLesson,
    flaechenLesson,
    uneigentlichLesson,
    gesamtAenderungLesson,
    rotationsLesson,
  ],
);
