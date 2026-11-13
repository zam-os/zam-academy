import { fmt, fmtUnit, round } from "../exercises/format";
import { overtakeYear, STARTS } from "../lab/views-wachstum";
import { choiceField, numberField as num } from "./helpers";
import { lab, makeLesson, makeStage, NAMES, output as o, range as r, task } from "./builders";

const L = (content: Parameters<typeof makeLesson>[1]) => makeLesson(2, content);
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const eq = (value: number, digits = 2) => (near(value, round(value, digits)) ? "=" : "≈");

// 2.1 Lineares und exponentielles Wachstum ────────────────────────────────

const linearExp = L({
  id: "ex-1-linear-exponentiell",
  title: "Lineares und exponentielles Wachstum",
  subtitle: "Gleiche Summanden oder gleiche Faktoren",
  whyItMatters:
    "Ein Sparschwein, in das jede Woche 5 € kommen, und ein Konto mit Zinseszins wachsen ganz verschieden. Wer lineares und exponentielles Wachstum unterscheidet, kann Vorhersagen über Geld, Bevölkerung oder Viren richtig einschätzen.",
  explanationHtml: `
    <p>Bei <strong>linearem Wachstum</strong> kommt in jedem Schritt <strong>derselbe Betrag d</strong> dazu: y = a + d · x. In der Tabelle sind die Differenzen gleich, der Graph ist eine Gerade.</p>
    <p>Bei <strong>exponentiellem Wachstum</strong> wird in jedem Schritt mit <strong>demselben Faktor q</strong> malgenommen: y = a · q<sup>x</sup>. In der Tabelle sind die Quotienten gleich, der Graph ist eine Kurve, die immer steiler wird. Ist 0 &lt; q &lt; 1, nimmt die Größe exponentiell ab.</p>
    <table class="mini">
      <tr><th>x</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
      <tr><td>linear (+ 10)</td><td>100</td><td>110</td><td>120</td><td>130</td><td>140</td></tr>
      <tr><td>exponentiell (· 1,1)</td><td>100</td><td>110</td><td>121</td><td>133,1</td><td>146,41</td></tr>
    </table>
    <div class="example"><strong>Beispiel:</strong> Ein Sparschwein startet mit 50 € und bekommt jeden Monat 5 € dazu: linear, y = 50 + 5x. Ein Konto mit 50 € wächst jedes Jahr um 10 %: exponentiell, y = 50 · 1,1<sup>x</sup>. Exponentielles Wachstum wirkt anfangs langsam, überholt aber jedes lineare Wachstum irgendwann.</div>
    <div class="merke"><strong>Merke:</strong> Linear: gleiche Differenzen, y = a + d · x, Gerade. Exponentiell: gleiche Quotienten, y = a · q<sup>x</sup>, Kurve; q &gt; 1 Zunahme, 0 &lt; q &lt; 1 Abnahme.</div>
  `,
  formulas: [
    { name: "Lineares Wachstum", html: "y = a + d · x", quantities: "a Startwert, d gleicher Zuwachs pro Schritt" },
    { name: "Exponentielles Wachstum", html: "y = a · q<sup>x</sup>", quantities: "a Startwert, q gleicher Faktor pro Schritt" },
  ],
  quiz: {
    question: "Eine Tabelle zeigt 200, 240, 288, 345,6. Welches Wachstum liegt vor?",
    options: ["exponentiell mit q = 1,2", "linear mit d = 40", "linear mit d = 48", "kein regelmäßiges Wachstum"],
    correctIndex: 0,
    explanation: "Die Differenzen 40, 48, 57,6 sind nicht gleich, aber jeder Wert ist das 1,2-Fache des vorigen: 240 : 200 = 1,2.",
  },
  lab: lab(
    "growth-compare",
    "Wer wächst schneller?",
    "Blau wächst linear um d pro Schritt, orange exponentiell um p Prozent. Ziehe den Punkt zu einem Schritt x und vergleiche Tabelle und Graph.",
    [r("a", "Startwert a", 50, 200, 100, 50), r("d", "linear: Zuwachs d", 5, 50, 20, 5), r("p", "exponentiell: Zuwachs p", 5, 50, 10, 5, "%"), r("x", "Schritt x", 0, 15, 0, 1)],
    [
      o("lin", "linear", (v) => v.a + v.d * v.x, "", 2),
      o("exp", "exponentiell", (v) => v.a * (1 + v.p / 100) ** v.x, "", 2, true),
    ],
    [
      { id: "erstes-jahr", text: "Stelle beide Modelle so ein, dass sie nach dem ersten Schritt gleich groß sind.", check: (v) => near(v.a + v.d, v.a * (1 + v.p / 100)) },
      { id: "ueberholen", text: "Ziehe den Punkt zu dem Schritt, in dem exponentiell erstmals linear überholt.", check: (v) => v.x > 0 && v.x === overtakeYear(v.a, v.d, v.p) },
      { id: "verdoppeln", text: "Stelle Schritt 5 und einen Prozentsatz ein, bei dem sich der exponentielle Wert mindestens verdoppelt hat.", check: (v) => v.x === 5 && (1 + v.p / 100) ** 5 >= 2 },
    ],
  ),
  exercises: [
    {
      id: "erkennen",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.pick([100, 200, 400, 500]);
          const exponential = rng.next() < 0.5;
          const d = rng.pick([20, 25, 50]);
          const q = rng.pick([1.1, 1.2, 1.5, 0.9, 0.8, 0.5]);
          const values = [0, 1, 2, 3].map((x) => (exponential ? a * q ** x : a + d * x));
          const next = exponential ? a * q ** 4 : a + d * 4;
          return task(
            level,
            `Eine Größe hat nacheinander die Werte ${values.map((y) => fmt(y, 3)).join("; ")}. Ist das Wachstum linear oder exponentiell? Berechne den nächsten Wert.`,
            [choiceField("Wachstum:", ["linear", "exponentiell"], exponential ? 1 : 0), num("nächster Wert:", next, "", 3)],
            "Prüfe die Differenzen (linear) und die Quotienten (exponentiell) aufeinanderfolgender Werte.",
            [exponential ? `Quotient immer ${fmt(q, 2)}: ${fmt(values[1], 3)} : ${fmt(values[0], 3)} = ${fmt(q, 2)}` : `Differenz immer ${d}: ${fmt(values[1])} − ${fmt(values[0])} = ${d}`, exponential ? `${fmt(values[3], 3)} · ${fmt(q, 2)}` : `${fmt(values[3])} + ${d}`],
            `${exponential ? "exponentiell" : "linear"}, nächster Wert ${fmt(next, 3)}`,
            { a, exponential: exponential ? 1 : 0 },
          );
        }
        const cases = [
          { text: "Ein Handyvertrag kostet 15 € im Monat. Gesamtkosten nach x Monaten.", kind: 0, param: 15, label: "Zuwachs d" },
          { text: "Eine Bakterienkultur verdoppelt sich jede Stunde. Anzahl nach x Stunden.", kind: 1, param: 2, label: "Faktor q" },
          { text: "Ein Kapital wächst jedes Jahr um 3 % mit Zinseszins. Kontostand nach x Jahren.", kind: 1, param: 1.03, label: "Faktor q" },
          { text: "Eine Kerze brennt jede Stunde um 2 cm ab. Höhe nach x Stunden.", kind: 0, param: -2, label: "Zuwachs d" },
          { text: "Ein Auto verliert jedes Jahr 15 % seines Werts. Wert nach x Jahren.", kind: 1, param: 0.85, label: "Faktor q" },
          { text: "In einen Pool laufen pro Minute 40 Liter. Wassermenge nach x Minuten.", kind: 0, param: 40, label: "Zuwachs d" },
        ];
        const c = rng.pick(cases);
        return task(
          level,
          `${c.text} Ist das ein lineares oder ein exponentielles Modell? Gib ${c.kind === 0 ? "den Zuwachs d pro Schritt" : "den Faktor q pro Schritt"} an.`,
          [choiceField("Modell:", ["linear", "exponentiell"], c.kind), num(`${c.label}:`, c.param, "", 2, { slips: c.kind === 1 ? [{ value: c.param - 1, hint: "Der Faktor enthält die 1 für den bisherigen Bestand: q = 1 ± p/100." }] : [] })],
          "Kommt in jedem Schritt derselbe Betrag dazu, ist es linear. Wird mit demselben Faktor malgenommen, ist es exponentiell.",
          [c.kind === 0 ? `Jeder Schritt: ${c.param > 0 ? "+" : ""}${fmt(c.param)}` : `Jeder Schritt: · ${fmt(c.param, 2)}`],
          `${c.kind === 0 ? "linear" : "exponentiell"}, ${c.label} = ${fmt(c.param, 2)}`,
          { kind: c.kind },
        );
      },
    },
    {
      id: "vergleichen",
      make: (rng, level) => {
        // Only offers in which B overtakes A within 25 steps, and not at once.
        let a = 100;
        let d = 10;
        let p = 5;
        do {
          a = rng.pick([100, 200, 500]);
          d = rng.pick([10, 20, 30, 50]);
          p = rng.pick([5, 8, 10, 12, 15]);
        } while (overtakeYear(a, d, p) < 2 || overtakeYear(a, d, p) > 25);
        if (level === 1) {
          const n = rng.int(3, 10);
          const lin = a + d * n;
          const exp = a * (1 + p / 100) ** n;
          return task(
            level,
            `Startwert ${a}. Modell A wächst linear um ${d} pro Schritt, Modell B exponentiell um ${p} % pro Schritt. Berechne beide Werte nach ${n} Schritten.`,
            [num("A:", lin, "", 2, { slips: [{ value: a + d, hint: "Der Zuwachs kommt " + n + "-mal dazu." }] }), num("B:", exp, "", 2, { slips: [{ value: a * (1 + (p * n) / 100), hint: "Exponentiell heißt Faktor hoch n, nicht n mal den Prozentsatz." }] })],
            "A: a + d · n. B: a · qⁿ mit q = 1 + p/100.",
            [`A: ${a} + ${d} · ${n} = ${fmt(lin)}`, `B: ${a} · ${fmt(1 + p / 100, 2)}<sup>${n}</sup> ${eq(exp)} ${fmt(exp, 2)}`],
            `A = ${fmt(lin)}, B ${eq(exp)} ${fmt(exp, 2)}`,
            { a, d, p, n },
          );
        }
        const year = overtakeYear(a, d, p);
        const name = rng.pick(NAMES);
        return task(
          level,
          `${name} hat ${fmtUnit(a, "€")}. Angebot A: jedes Jahr ${fmtUnit(d, "€")} Bonus. Angebot B: jedes Jahr ${p} % Zinsen mit Zinseszins. Nach wie vielen Jahren bringt B erstmals mehr als A?`,
          [num("Jahre:", year, "", 0, { slips: [{ value: year - 1, hint: "Prüfe genau: im Jahr davor ist B noch nicht größer." }] })],
          "Rechne Jahr für Jahr beide Werte aus (Tabelle oder Tabellenkalkulation), bis B größer ist.",
          [`A nach ${year} Jahren: ${fmt(a + d * year)} €, B: ${fmt(a * (1 + p / 100) ** year, 2)} €`, `ein Jahr vorher: A ${fmt(a + d * (year - 1))} €, B ${fmt(a * (1 + p / 100) ** (year - 1), 2)} €`],
          `nach ${year} Jahren`,
          { a, d, p },
        );
      },
    },
  ],
});

// 2.2 Wachstumsmodelle ─────────────────────────────────────────────────────

const modelle = L({
  id: "ex-2-wachstumsmodelle",
  title: "Exponentielle Zunahme und Abnahme",
  subtitle: "y = a · qˣ für Zinsen, Bevölkerung und Zerfall",
  whyItMatters:
    "Zinseszins, eine wachsende Stadt, ein Medikament, das im Blut abgebaut wird, radioaktiver Zerfall: Alle folgen demselben Modell. Wer Startwert und Faktor findet, kann rechnen und Vorhersagen prüfen.",
  explanationHtml: `
    <p>Nimmt eine Größe in gleichen Zeitschritten um den gleichen Prozentsatz p zu oder ab, beschreibt sie das Modell</p>
    <p class="formula-line">y = a · q<sup>x</sup> mit q = 1 + p : 100 (Zunahme) oder q = 1 − p : 100 (Abnahme)</p>
    <p>a ist der <strong>Anfangswert</strong> (bei x = 0), q der <strong>Wachstumsfaktor</strong>, p % die <strong>Wachstumsrate</strong>. Der Graph geht durch (0 | a); er steigt für q &gt; 1 und fällt für 0 &lt; q &lt; 1, ohne je 0 zu erreichen.</p>
    <p>Bei Zerfall gibt man oft die <strong>Halbwertszeit</strong> an: die Zeit, nach der nur noch die Hälfte übrig ist.</p>
    <div class="example"><strong>Beispiel:</strong> Eine Stadt hat 50.000 Einwohner und wächst um 5 % pro Jahr: y = 50.000 · 1,05<sup>x</sup>. Nach 4 Jahren: 50.000 · 1,05<sup>4</sup> ≈ 60.775.<br>
    Ein Medikament wird pro Stunde um 20 % abgebaut: q = 0,8. Von 400 mg sind nach 3 Stunden 400 · 0,8<sup>3</sup> = 204,8 mg übrig.<br>
    Jod-131 hat eine Halbwertszeit von 8 Tagen. Von 80 mg sind nach 24 Tagen (3 Halbwertszeiten) 80 · (1/2)<sup>3</sup> = 10 mg übrig.</div>
    <div class="merke"><strong>Merke:</strong> y = a · q<sup>x</sup>. Zunahme um p %: q = 1 + p : 100. Abnahme um p %: q = 1 − p : 100. Die Halbwertszeit ist die Zeit, in der sich die Größe halbiert.</div>
  `,
  formulas: [
    { name: "Wachstumsmodell", html: "y = a · q<sup>x</sup>", quantities: "a Anfangswert, q Wachstumsfaktor" },
    { name: "Faktor aus der Rate", html: "q = 1 + p : 100 bzw. q = 1 − p : 100", quantities: "Zunahme bzw. Abnahme um p %" },
  ],
  quiz: {
    question: "Ein Auto verliert jedes Jahr 15 % an Wert. Welcher Wachstumsfaktor gehört dazu?",
    options: ["0,85", "0,15", "1,15", "−0,15"],
    correctIndex: 0,
    explanation: "Es bleiben jedes Jahr 100 % − 15 % = 85 % übrig, also q = 0,85. Mit 0,15 würde nur der Verlust berechnet.",
  },
  lab: lab(
    "growth-model",
    "Zunahme und Abnahme",
    "Wähle einen Anfangswert und die Rate. Negative Raten bedeuten Abnahme. Ziehe den Punkt, um den Wert nach x Schritten abzulesen.",
    [{ type: "choice", key: "a", label: "Anfangswert a", options: STARTS.map((value) => ({ value, label: fmt(value) })), value: 100 }, r("p", "Rate p", -50, 50, 10, 5, "%"), r("x", "Schritte x", 0, 20, 0, 1)],
    [o("q", "Faktor q", (v) => 1 + v.p / 100, "", 2), o("y", "Wert nach x Schritten", (v) => v.a * (1 + v.p / 100) ** v.x, "", 2, true)],
    [
      { id: "unter-haelfte", text: "Abnahme um 20 % pro Jahr: Stelle das erste Jahr ein, in dem weniger als die Hälfte übrig ist.", check: (v) => v.p === -20 && v.x === 4 },
      { id: "stadt", text: "Eine Stadt mit 50.000 Einwohnern wächst um 5 % pro Jahr. Stelle das erste Jahr mit mehr als 60.000 Einwohnern ein.", check: (v) => v.a === 50000 && v.p === 5 && v.x === 4 },
      { id: "zehn-jahre", text: "Finde den kleinsten Prozentsatz (in 5er-Schritten), bei dem sich ein Wert in 10 Jahren mindestens verdoppelt, und stelle Jahr 10 ein.", check: (v) => v.p === 10 && v.x === 10 },
    ],
  ),
  exercises: [
    {
      id: "modell",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.pick([200, 500, 800, 1000, 2000]);
          const p = rng.pick([2, 3, 4, 5, 8, 10, 15, 20]);
          const grow = rng.next() < 0.5;
          const q = grow ? 1 + p / 100 : 1 - p / 100;
          const n = rng.int(2, 8);
          return task(
            level,
            `Eine Größe hat den Anfangswert ${fmt(a)} und ${grow ? "wächst" : "nimmt ab"} um ${p} % pro Schritt. Gib den Wachstumsfaktor q an und berechne den Wert nach ${n} Schritten.`,
            [num("q =", q, "", 2, { slips: [{ value: p / 100, hint: "Der Faktor enthält die 1 für den bisherigen Bestand: q = 1 ± p/100." }, { value: grow ? 1 - p / 100 : 1 + p / 100, hint: grow ? "Bei Zunahme ist q größer als 1." : "Bei Abnahme ist q kleiner als 1." }] }), num("Wert:", a * q ** n, "", 2)],
            "q = 1 + p/100 bei Zunahme, q = 1 − p/100 bei Abnahme; y = a · qⁿ.",
            [`q = 1 ${grow ? "+" : "−"} ${p} : 100 = ${fmt(q, 2)}`, `y = ${fmt(a)} · ${fmt(q, 2)}<sup>${n}</sup>`],
            `q = ${fmt(q, 2)}, y ${eq(a * q ** n)} ${fmt(a * q ** n, 2)}`,
            { a, p, n },
          );
        }
        const dose = rng.pick([200, 400, 500, 600]);
        const p = rng.pick([10, 15, 20, 25]);
        const h = rng.int(3, 8);
        const rest = dose * (1 - p / 100) ** h;
        return task(
          level,
          `Ein Patient bekommt ${dose} mg eines Medikaments. Der Körper baut jede Stunde ${p} % der noch vorhandenen Menge ab. Wie viel ist nach ${h} Stunden noch im Körper? Wie viel Prozent der Anfangsmenge sind abgebaut?`,
          [num("Rest:", rest, "mg", 2, { slips: [{ value: dose * (1 - (p * h) / 100), hint: "Abgebaut wird ein Prozentsatz der jeweils noch vorhandenen Menge: Faktor hoch Stunden." }] }), num("abgebaut:", (1 - (1 - p / 100) ** h) * 100, "%", 1)],
          "Abnahme um p % pro Stunde: Faktor q = 1 − p/100, Rest = Anfang · qʰ.",
          [`q = ${fmt(1 - p / 100, 2)}`, `${dose} · ${fmt(1 - p / 100, 2)}<sup>${h}</sup> ${eq(rest)} ${fmt(rest, 2)} mg`, `abgebaut: (1 − ${fmt((1 - p / 100) ** h, 4)}) · 100 %`],
          `${fmtUnit(rest, "mg")} übrig, etwa ${fmt((1 - (1 - p / 100) ** h) * 100, 1)} % abgebaut`,
          { dose, p, h },
        );
      },
    },
    {
      id: "deuten",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.pick([100, 300, 500, 2000]);
          const q = rng.pick([0.9, 0.8, 1.1, 1.25, 0.5, 2]);
          return task(
            level,
            `Gegeben ist das Modell y = ${fmt(a)} · ${fmt(q, 2)}<sup>x</sup>. Beschreibt es eine Zunahme oder eine Abnahme? Um wie viel Prozent ändert sich der Wert pro Schritt?`,
            [choiceField("Art:", ["Zunahme", "Abnahme", "kein Wachstum"], q > 1 ? 0 : 1), num("Rate:", Math.abs(q - 1) * 100, "%", 1, { slips: [{ value: q * 100, hint: "Die Rate ist der Unterschied des Faktors zu 1, in Prozent." }] })],
            "q > 1: Zunahme um (q − 1) · 100 %. 0 < q < 1: Abnahme um (1 − q) · 100 %.",
            [q > 1 ? `${fmt(q, 2)} − 1 = ${fmt(q - 1, 2)}` : `1 − ${fmt(q, 2)} = ${fmt(1 - q, 2)}`],
            `${q > 1 ? "Zunahme" : "Abnahme"} um ${fmt(Math.abs(q - 1) * 100, 1)} %`,
            { a, q },
          );
        }
        const halfLife = rng.pick([5, 8, 10, 12, 30]);
        const k = rng.int(2, 5);
        const start = rng.pick([40, 80, 160, 320]);
        return task(
          level,
          `Ein radioaktiver Stoff hat eine Halbwertszeit von ${halfLife} Tagen. Eine Probe enthält ${start} mg. Wie viel ist nach ${k * halfLife} Tagen noch übrig? Wie viele Halbwertszeiten sind das?`,
          [num("Halbwertszeiten:", k, "", 0), num("Rest:", start / 2 ** k, "mg", 2, { slips: [{ value: start / (2 * k), hint: "Nach jeder Halbwertszeit halbiert sich der Rest: durch 2 hoch k." }] })],
          "Zeit : Halbwertszeit = Anzahl der Halbierungen. Rest = Anfang · (1/2)ᵏ.",
          [`${k * halfLife} : ${halfLife} = ${k}`, `${start} · (1/2)<sup>${k}</sup> = ${start} : ${2 ** k}`],
          `${k} Halbwertszeiten, ${fmtUnit(start / 2 ** k, "mg")} übrig`,
          { halfLife, k, start },
        );
      },
    },
  ],
});

// 2.3 Wachstum berechnen ───────────────────────────────────────────────────

const berechnen = L({
  id: "ex-3-wachstum-berechnen",
  title: "Wachstum berechnen",
  subtitle: "Anfangswert, Faktor, Rate und Dauer",
  whyItMatters:
    "Um wie viel Prozent ist eine Stadt jährlich gewachsen? Wann ist ein Auto nur noch die Hälfte wert? Mit Wurzel und Logarithmus findest du jede Größe im Modell y = a · qˣ, auch rückwärts.",
  explanationHtml: `
    <p>Im Modell y = a · q<sup>n</sup> kann jede Größe gesucht sein. Du stellst mit den Potenz-, Wurzel- und Logarithmusgesetzen um:</p>
    <table class="mini">
      <tr><th>gesucht</th><th>Rechnung</th></tr>
      <tr><td>Anfangswert a</td><td>a = y : q<sup>n</sup></td></tr>
      <tr><td>Wachstumsfaktor q</td><td>q = <sup>n</sup>√(y : a)</td></tr>
      <tr><td>Rate p</td><td>p = (q − 1) · 100</td></tr>
      <tr><td>Dauer n</td><td>n = lg(y : a) : lg(q)</td></tr>
    </table>
    <div class="example"><strong>Beispiel:</strong> Eine Gemeinde wächst in 8 Jahren von 12.000 auf 15.000 Einwohner. q = <sup>8</sup>√(15.000 : 12.000) = <sup>8</sup>√1,25 ≈ 1,0283, also etwa 2,83 % pro Jahr.<br>
    Ein Auto verliert 15 % pro Jahr. Wann ist es nur noch die Hälfte wert? 0,85<sup>n</sup> = 0,5, also n = lg(0,5) : lg(0,85) ≈ 4,27. Nach 5 Jahren ist es weniger als die Hälfte wert.<br>
    Plausibel? Eine Rate von 2,83 % ist für eine Gemeinde realistisch; ein Ergebnis wie 280 % pro Jahr wäre es nicht.</div>
    <p>Für längere Rechnungen hilft eine Tabellenkalkulation: In jeder Zeile steht der vorige Wert mal q.</p>
    <div class="merke"><strong>Merke:</strong> a = y : q<sup>n</sup>, q = <sup>n</sup>√(y : a), n = lg(y : a) : lg(q). Prüfe jedes Ergebnis auf Plausibilität.</div>
  `,
  formulas: [
    { name: "Faktor", html: "q = <sup>n</sup>√(y : a)", quantities: "a Anfangswert, y Wert nach n Schritten" },
    { name: "Dauer", html: "n = lg(y : a) : lg(q)", quantities: "mit dem Logarithmus" },
    { name: "Anfangswert", html: "a = y : q<sup>n</sup>", quantities: "rückwärts" },
  ],
  quiz: {
    question: "Ein Wert wächst in 2 Jahren von 400 auf 484. Wie groß ist der jährliche Wachstumsfaktor?",
    options: ["1,1", "1,21", "1,05", "42"],
    correctIndex: 0,
    explanation: "q = √(484 : 400) = √1,21 = 1,1. 1,21 ist der Faktor für beide Jahre zusammen.",
  },
  lab: lab(
    "growth-solver",
    "Faktor aus zwei Werten",
    "Stelle Anfangswert, Endwert und Dauer ein. Die Kurve geht durch beide Punkte; rechts stehen Faktor, Rate und Verdopplungs- oder Halbierungszeit.",
    [r("a", "Anfangswert a", 100, 1000, 400, 100), r("y", "Endwert y", 50, 2000, 600, 10), r("n", "Dauer n", 1, 12, 4, 1)],
    [o("q", "Faktor q", (v) => (v.y / v.a) ** (1 / v.n), "", 4, true), o("p", "Rate", (v) => ((v.y / v.a) ** (1 / v.n) - 1) * 100, "%", 2)],
    [
      { id: "zehn-prozent", text: "Stelle Werte ein, die ein Wachstum von genau 10 % pro Schritt ergeben.", check: (v) => near((v.y / v.a) ** (1 / v.n), 1.1) },
      { id: "halbiert", text: "Stelle einen Zerfall ein, bei dem sich der Wert in 5 Schritten halbiert.", check: (v) => v.n === 5 && near(v.y * 2, v.a) },
      { id: "verdreifacht", text: "Stelle ein Wachstum ein, bei dem sich der Wert in 10 Schritten verdreifacht.", check: (v) => v.n === 10 && near(v.y, 3 * v.a) },
    ],
  ),
  exercises: [
    {
      id: "faktor",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.pick([100, 200, 400, 500]);
          const q = rng.pick([1.1, 1.2, 0.9, 0.8, 1.5]);
          const n = rng.int(2, 3);
          const y = round(a * q ** n, 4);
          return task(
            level,
            `Ein Wert wächst in ${n} Schritten von ${fmt(a)} auf ${fmt(y, 4)}. Berechne den Wachstumsfaktor q pro Schritt und die Rate in Prozent.`,
            [num("q =", q, "", 4, { slips: [{ value: y / a, hint: "Das ist der Faktor für alle " + n + " Schritte zusammen. Ziehe die " + n + ". Wurzel." }] }), num("Rate:", (q - 1) * 100, "%", 2)],
            "q = ⁿ√(y : a); Rate = (q − 1) · 100 %",
            [`y : a = ${fmt(y, 4)} : ${fmt(a)} = ${fmt(y / a, 4)}`, `q = ${n === 2 ? "√" : "<sup>3</sup>√"}${fmt(y / a, 4)} = ${fmt(q, 4)}`],
            `q = ${fmt(q, 4)}, Rate ${fmt((q - 1) * 100, 2)} %`,
            { a, q, n },
          );
        }
        const from = rng.pick([8000, 12000, 20000, 40000]);
        const growth = rng.pick([1.15, 1.25, 1.3, 1.4]);
        const to = from * growth;
        const n = rng.pick([5, 6, 8, 10]);
        const q = growth ** (1 / n);
        return task(
          level,
          `Eine Gemeinde wuchs in ${n} Jahren von ${fmt(from)} auf ${fmt(to)} Einwohner. Um wie viel Prozent ist sie im Mittel jährlich gewachsen, wenn man exponentielles Wachstum annimmt?`,
          [num("Rate:", (q - 1) * 100, "%", 2, { slips: [{ value: ((growth - 1) * 100) / n, hint: "Das wäre lineares Wachstum. Exponentiell: q = n-te Wurzel aus (Ende : Anfang)." }] })],
          "q = ⁿ√(Ende : Anfang), dann Rate = (q − 1) · 100 %.",
          [`Ende : Anfang = ${fmt(growth, 2)}`, `q = <sup>${n}</sup>√${fmt(growth, 2)} ≈ ${fmt(q, 4)}`],
          `etwa ${fmt((q - 1) * 100, 2)} % pro Jahr`,
          { from, n },
        );
      },
    },
    {
      id: "dauer",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.pick([1000, 2000, 5000]);
          const p = rng.pick([2, 3, 4, 5, 6]);
          const f = rng.pick([1.5, 2, 3]);
          const n = Math.log10(f) / Math.log10(1 + p / 100);
          return task(
            level,
            `Ein Kapital von ${fmt(a)} € wächst um ${p} % pro Jahr. Nach wie vielen Jahren hat es ${fmt(a * f)} € erreicht? Berechne n mit dem Logarithmus.`,
            [num("n =", n, "", 2, { slips: [{ value: ((f - 1) * 100) / p, hint: "Das wäre ohne Zinseszins. n = lg(y : a) : lg(q)." }] })],
            "n = lg(y : a) : lg(q)",
            [`y : a = ${fmt(f)}`, `n = lg(${fmt(f)}) : lg(${fmt(1 + p / 100, 2)}) ≈ ${fmt(n, 2)}`],
            `n ${eq(n)} ${fmt(n, 2)} Jahre`,
            { a, p, f },
          );
        }
        const price = rng.pick([15000, 20000, 24000, 30000]);
        const p = rng.pick([12, 15, 18, 20]);
        const n = Math.log10(0.5) / Math.log10(1 - p / 100);
        return task(
          level,
          `Ein Neuwagen kostet ${fmt(price)} €. Er verliert jedes Jahr ${p} % seines Werts. Nach wie vielen Jahren ist er weniger als die Hälfte wert? Gib n und die Zahl der vollen Jahre an.`,
          [num("n =", n, "", 2, { slips: [{ value: 50 / p, hint: "Das wäre lineare Abnahme. Exponentiell: (1 − p/100)ⁿ = 0,5." }] }), num("volle Jahre:", Math.ceil(n), "", 0)],
          "Halbierung: qⁿ = 0,5 mit q = 1 − p/100, also n = lg(0,5) : lg(q). Aufrunden.",
          [`q = ${fmt(1 - p / 100, 2)}`, `n = lg(0,5) : lg(${fmt(1 - p / 100, 2)}) ≈ ${fmt(n, 2)}`],
          `n ≈ ${fmt(n, 2)}, also nach ${Math.ceil(n)} Jahren`,
          { price, p },
        );
      },
    },
  ],
});

export const STAGE = makeStage(
  2,
  "Lineares und exponentielles Wachstum, Zunahme und Zerfall",
  "#0f766e",
  "📈",
  [linearExp, modelle, berechnen],
);
