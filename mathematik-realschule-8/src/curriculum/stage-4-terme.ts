import { fmt } from "../exercises/format";
import { solveLinear } from "../math";
import { choice, choiceField, defineLesson, numberField, range, stage, task } from "./helpers";

const operations = defineLesson("tg-1-termoperationen", {
  subtitle: "Gleichartige Glieder sammeln, jedes mit jedem multiplizieren",
  whyItMatters: "Sicheres Umformen macht aus langen Rechnungen übersichtliche Gleichungen.",
  explanationHtml: `<p>Nur gleichartige Glieder lassen sich zusammenfassen: 3x²y + 5x²y = 8x²y, aber 3x²y + 5xy² bleibt eine Summe. Ein Minus vor einer Klammer wechselt alle Vorzeichen.</p><p>Bei Produkten von Summentermen multiplizierst du jedes Glied der ersten Klammer mit jedem Glied der zweiten. Bei Potenzen gleicher Basis addierst du beim Multiplizieren die Exponenten: x² · x³ = x⁵.</p><div class="example">(2x + 3y)(4x − y) = 8x² − 2xy + 12xy − 3y² = 8x² + 10xy − 3y².</div><div class="merke">Prüfe eine Umformung durch Einsetzen kleiner Zahlen in Ausgangs- und Ergebnisterm. Gleiche Beispiele allein sind noch kein Beweis; das Distributivgesetz begründet die Umformung.</div>`,
  formulas: [
    {
      name: "Distributivgesetz",
      html: "(a + b)(c + d) = ac + ad + bc + bd",
      quantities: "jedes Glied mit jedem",
    },
    {
      name: "Potenzen gleicher Basis",
      html: "x<sup>p</sup> · x<sup>q</sup> = x<sup>p+q</sup>",
      quantities: "p, q natürliche Exponenten",
    },
  ],
  quiz: {
    question: "Welche Summe ist gleich 3x²y − 2xy² + 5x²y?",
    options: ["6x²y", "8x²y − 2xy²", "8x⁴y² − 2xy²"],
    correctIndex: 1,
    explanation: "Nur 3x²y und 5x²y sind gleichartig. Ihre Koeffizienten werden addiert.",
  },
  lab: {
    kind: "term-operations",
    title: "Produkte sortieren",
    intro:
      "Verändere die Koeffizienten in (a·xᵖ + b·y)(c·xᵖ + y). Die vier Teilprodukte werden zu drei Gruppen.",
    params: [
      range("a", "a", -3, 4, 2),
      range("b", "b", -3, 4, 3),
      range("c", "c", 1, 4, 2),
      range("p", "Exponent p", 1, 3, 1),
    ],
    readouts: [
      { key: "xx", label: "Koeffizient von x²ᵖ", compute: (v) => v.a * v.c },
      { key: "xy", label: "Koeffizient von xᵖy", compute: (v) => v.a + v.b * v.c },
      { key: "yy", label: "Koeffizient von y²", compute: (v) => v.b },
    ],
    goals: [
      {
        id: "minus",
        text: "Untersuche a = 2, b = −1, c = 3, p = 1. Der gemischte Koeffizient ist −1.",
        check: (v) => v.a === 2 && v.b === -1 && v.c === 3 && v.p === 1,
      },
      {
        id: "potenz",
        text: "Stelle a = 3, b = 2, c = 2, p = 3 ein: Das erste Teilprodukt enthält x⁶.",
        check: (v) => v.a === 3 && v.b === 2 && v.c === 2 && v.p === 3,
      },
    ],
  },
  exercises: [
    {
      id: "ausmultiplizieren",
      make: (rng, level) => {
        const a = rng.int(1, 5),
          b = rng.int(1, 5) * rng.sign(),
          c = rng.int(1, 4),
          d = rng.int(1, 4) * rng.sign(),
          e = level === 2 ? rng.int(1, 5) : 0,
          p = level === 1 ? 1 : rng.pick([2, 3]);
        return task(
          `Vereinfache ( ${a}x<sup>${p}</sup> + (${fmt(b)})y )( ${c}x<sup>${p}</sup> + (${fmt(d)})y )${e ? ` − ${e}x<sup>${p}</sup>y` : ""}. Trage die Koeffizienten nach dem Sammeln ein.`,
          [
            numberField(`vor x<sup>${2 * p}</sup>:`, a * c, "", 0),
            numberField(`vor x<sup>${p}</sup>y:`, a * d + b * c - e, "", 0),
            numberField("vor y²:", b * d, "", 0),
          ],
          [
            `Teilprodukte: ${a * c}x<sup>${2 * p}</sup>, (${fmt(a * d)})x<sup>${p}</sup>y, (${fmt(b * c)})x<sup>${p}</sup>y, (${fmt(b * d)})y².`,
            `Gemischte Glieder: ${fmt(a * d)} + (${fmt(b * c)})${e ? ` − ${e}` : ""} = ${fmt(a * d + b * c - e)}.`,
            `<strong>Koeffizienten: ${a * c}; ${fmt(a * d + b * c - e)}; ${fmt(b * d)}.</strong>`,
          ],
          level === 1 ? "Jedes mit jedem; danach gleichartige Glieder sammeln." : undefined,
          { a, b, c, d, e, p },
        );
      },
    },
  ],
});

const binomial = defineLesson("tg-2-binomische-formeln", {
  subtitle: "Das gemischte Glied gehört dazu",
  whyItMatters:
    "Die Formeln sparen Arbeit und helfen dir später beim Faktorisieren und Optimieren.",
  explanationHtml: `<p>Ein Quadrat mit Seitenlänge a + b zerfällt in ein a²-Quadrat, zwei ab-Rechtecke und ein b²-Quadrat. Deshalb ist (a + b)² nicht a² + b².</p><p>Ausmultiplizieren begründet auch (a − b)² = a² − 2ab + b². Beim Produkt (a + b)(a − b) heben sich die gemischten Glieder auf. Die Formeln gelten ebenso für Variablenterme.</p><div class="example">(3x − 4y)² = 9x² − 24xy + 16y². Das Minuszeichen steht vor dem gemischten Glied; der letzte Summand ist positiv.</div>`,
  formulas: [
    { name: "1. binomische Formel", html: "(a + b)² = a² + 2ab + b²", quantities: "Plusquadrat" },
    { name: "2. binomische Formel", html: "(a − b)² = a² − 2ab + b²", quantities: "Minusquadrat" },
    {
      name: "3. binomische Formel",
      html: "(a + b)(a − b) = a² − b²",
      quantities: "Quadratdifferenz",
    },
  ],
  quiz: {
    question: "Welcher Term ist gleich (x − 3)²?",
    options: ["x² − 9", "x² − 6x + 9", "x² + 9"],
    correctIndex: 1,
    explanation: "Das gemischte Glied ist −2 · x · 3 = −6x; der letzte Summand ist +9.",
  },
  lab: {
    kind: "binomial",
    title: "Flächen machen die Formel sichtbar",
    intro:
      "Wähle eine Formel. Für das Minusquadrat wird aus dem a-Quadrat zweimal ein Streifen entfernt; das Eckquadrat muss einmal zurück.",
    params: [
      choice("formula", "Formel", ["(a + b)²", "(a − b)²", "(a + b)(a − b)"]),
      range("a", "a", 4, 10, 6, 1, "cm"),
      range("b", "b", 1, 3, 2, 1, "cm"),
    ],
    readouts: [
      { key: "square", label: "a²", compute: (v) => v.a * v.a },
      {
        key: "mixed",
        label: "Gemischtes Glied",
        compute: (v) => (v.formula === 2 ? 0 : (v.formula === 1 ? -1 : 1) * 2 * v.a * v.b),
      },
      {
        key: "total",
        label: "Gesamter Termwert",
        compute: (v) =>
          v.formula === 0
            ? (v.a + v.b) ** 2
            : v.formula === 1
              ? (v.a - v.b) ** 2
              : v.a ** 2 - v.b ** 2,
      },
    ],
    goals: [
      {
        id: "minusquadrat",
        text: "Stelle (7 − 3)² dar und verfolge das gemischte Glied −42.",
        check: (v) => v.formula === 1 && v.a === 7 && v.b === 3,
      },
      {
        id: "differenz",
        text: "Stelle (8 + 2)(8 − 2) als Quadratdifferenz dar.",
        check: (v) => v.formula === 2 && v.a === 8 && v.b === 2,
      },
    ],
  },
  exercises: [
    {
      id: "binom",
      make: (rng, level) => {
        const a = rng.int(1, 6),
          b = rng.int(1, 7),
          kind = rng.int(0, 2),
          xy = kind === 2 ? 0 : (kind === 1 ? -1 : 1) * 2 * a * b,
          yy = (kind === 2 ? -1 : 1) * b * b,
          name =
            kind === 0
              ? `(${a}x + ${b}y)²`
              : kind === 1
                ? `(${a}x − ${b}y)²`
                : `(${a}x + ${b}y)(${a}x − ${b}y)`;
        if (level === 1)
          return task(
            `Multipliziere ${name} aus.`,
            [
              numberField("vor x²:", a * a, "", 0),
              numberField("vor xy:", xy, "", 0),
              numberField("vor y²:", yy, "", 0),
            ],
            [
              `Setze a = ${a}x und b = ${b}y in die passende Formel ein.`,
              `<strong>Koeffizienten ${a * a}, ${fmt(xy)}, ${fmt(yy)}.</strong>`,
            ],
            "a² ± 2ab + b² oder a² − b²",
            { a, b, kind },
          );
        const x = rng.int(2, 6),
          y = rng.int(1, 3),
          value =
            kind === 0
              ? (a * x + b * y) ** 2
              : kind === 1
                ? (a * x - b * y) ** 2
                : (a * x) ** 2 - (b * y) ** 2;
        return task(
          `Ein Kontrollprogramm behauptet, ${name} enthalte kein gemischtes Glied. Prüfe das: Bestimme den Koeffizienten vor xy und den Termwert bei x = ${x}, y = ${y}.`,
          [numberField("vor xy:", xy, "", 0), numberField("Termwert:", value, "", 0)],
          [
            `Die binomische Formel liefert den gemischten Koeffizienten ${fmt(xy)}.`,
            `Einsetzen in den Ausgangsterm mit ${a * x} und ${b * y}.`,
            `<strong>Termwert ${value}.</strong> Nur bei der Quadratdifferenz fällt das gemischte Glied weg.`,
          ],
          undefined,
          { a, b, kind, x, y },
        );
      },
    },
  ],
});

const factoring = defineLesson("tg-3-faktorisieren", {
  subtitle: "Die binomischen Formeln rückwärts lesen",
  whyItMatters:
    "Eine Produktform zeigt gemeinsame Faktoren und macht Ausschlüsse in Bruchtermen sichtbar.",
  explanationHtml: `<p>Beim Ausklammern suchst du einen Faktor in allen Summanden: 6x² + 12xy = 6x(x + 2y). Prüfe die Produktform durch Ausmultiplizieren.</p><p>Bei a² − b² erkennst du die dritte binomische Formel rückwärts. Für ein vollständiges Quadrat muss auch das gemischte Glied passen: x² + 10x + 25 = (x + 5)². Dagegen ist x² + 25 keine Quadratdifferenz und nicht (x + 5)².</p><div class="example">25a² − 49b² = (5a − 7b)(5a + 7b).</div>`,
  formulas: [
    {
      name: "Ausklammern",
      html: "ka + kb = k(a + b)",
      quantities: "gemeinsamen Faktor herausziehen",
    },
    {
      name: "Quadratdifferenz",
      html: "a² − b² = (a − b)(a + b)",
      quantities: "bei einer Summe von Quadraten nicht anwendbar",
    },
  ],
  quiz: {
    question: "Welche Produktform gehört zu x² − 16?",
    options: ["(x − 4)²", "(x − 4)(x + 4)", "(x − 8)(x + 8)"],
    correctIndex: 1,
    explanation: "16 = 4². Die gemischten Glieder heben sich auf.",
  },
  lab: {
    kind: "factoring",
    title: "Vom Summenterm zum Produkt",
    intro:
      "Wähle ein Muster und ändere die Zahlen. Multipliziere die angezeigten Faktoren gedanklich zurück.",
    params: [
      choice("mode", "Muster", ["ausklammern", "Quadratdifferenz", "vollständiges Quadrat"]),
      range("a", "Faktor a", 2, 8, 3),
      range("b", "Zahl b", 1, 6, 2),
    ],
    readouts: [
      {
        key: "sum",
        label: "Summenterm",
        compute: (v) =>
          v.mode === 0
            ? `${v.a}x + ${v.a * v.b}`
            : v.mode === 1
              ? `${v.a ** 2}x² − ${v.b ** 2}`
              : `x² + ${2 * v.b}x + ${v.b ** 2}`,
      },
      {
        key: "product",
        label: "Produktform",
        compute: (v) =>
          v.mode === 0
            ? `${v.a}(x + ${v.b})`
            : v.mode === 1
              ? `(${v.a}x − ${v.b})(${v.a}x + ${v.b})`
              : `(x + ${v.b})²`,
      },
    ],
    goals: [
      {
        id: "differenz",
        text: "Faktorisiere 25x² − 9.",
        check: (v) => v.mode === 1 && v.a === 5 && v.b === 3,
      },
      {
        id: "quadrat",
        text: "Faktorisiere x² + 8x + 16.",
        check: (v) => v.mode === 2 && v.b === 4,
      },
    ],
  },
  exercises: [
    {
      id: "faktoren",
      make: (rng, level) => {
        const k = rng.int(2, 8),
          a = rng.int(2, 7),
          b = rng.int(1, 7);
        if (level === 1)
          return task(
            `Klammere aus ${k * a}x² + ${k * b}xy genau den Faktor ${k}x aus: ${k}x · (u·x + v·y).`,
            [numberField("u =", a, "", 0), numberField("v =", b, "", 0)],
            [`Teile beide Summanden durch ${k}x.`, `<strong>${k}x(${a}x + ${b}y).</strong>`],
            "Jeder Summand wird durch den ausgeklammerten Faktor geteilt.",
            { k, a, b },
          );
        return task(
          `Eine Differenz von Flächentermen lautet ${a * a}x² − ${b * b}y². Schreibe sie als (u·x − v·y)(u·x + v·y) mit positiven u und v.`,
          [numberField("u =", a, "", 0), numberField("v =", b, "", 0)],
          [
            `${a * a}x² = (${a}x)² und ${b * b}y² = (${b}y)².`,
            `<strong>(${a}x − ${b}y)(${a}x + ${b}y).</strong> Beim Rückmultiplizieren fallen die gemischten Glieder weg.`,
          ],
          undefined,
          { a, b },
        );
      },
    },
  ],
});

const extrema = defineLesson("tg-4-extremwerte", {
  subtitle: "Quadratisch ergänzen und das Quadrat ausnutzen",
  whyItMatters:
    "Mit quadratischen Termen findest du die günstigste Fläche oder den kleinsten Wert ohne Probieren.",
  explanationHtml: `<p>Ein Quadrat ist nie negativ. Bringe einen quadratischen Term in die Form a(x − h)² + k. Für a &gt; 0 ist k der kleinste Wert; für a &lt; 0 ist k der größte. Er wird jeweils bei x = h erreicht.</p><div class="example">2x² − 12x + 23 = 2(x² − 6x + 9) + 5 = 2(x − 3)² + 5. Das Minimum ist 5 bei x = 3.</div><p>Für ax² + bx + c klammerst du zuerst a aus den beiden x-Gliedern aus und ergänzt dann (b/(2a))². Bei Sachaufgaben prüfst du zusätzlich den erlaubten Bereich: Liegt h außerhalb, genügt der Extremwert des uneingeschränkten Terms nicht.</p>`,
  formulas: [
    {
      name: "Quadratische Ergänzung",
      html: "ax² + bx + c = a(x + b/(2a))² + c − b²/(4a)",
      quantities: "a ≠ 0",
    },
    {
      name: "Extremstelle",
      html: "x = −b/(2a)",
      quantities: "Minimum für a > 0, Maximum für a < 0",
    },
  ],
  quiz: {
    question: "Welchen kleinsten Wert hat 3(x − 2)² + 4?",
    options: ["2", "3", "4"],
    correctIndex: 2,
    explanation: "Das Quadrat wird bei x = 2 null. Es bleibt 4.",
  },
  lab: {
    kind: "term-extremum",
    title: "Einen Extremwert finden",
    intro:
      "Untersuche T(x) = a(x − h)² + k. Der markierte Punkt zeigt den Wert des Terms für dein x.",
    params: [
      choice("factor", "a", ["−2", "−1", "0,5", "1", "2"], 3),
      range("h", "h", -4, 4, 2),
      range("k", "k", -6, 8, 3),
      range("x", "x", -6, 6, 0, 0.5),
    ],
    readouts: [
      {
        key: "value",
        label: "T(x)",
        digits: 2,
        compute: (v) => [-2, -1, 0.5, 1, 2][v.factor] * (v.x - v.h) ** 2 + v.k,
      },
      {
        key: "type",
        label: "Extremwert",
        compute: (v) => `${v.factor < 2 ? "Maximum" : "Minimum"} ${v.k} bei x = ${v.h}`,
      },
    ],
    goals: [
      {
        id: "minimum",
        text: "Finde das Minimum von 2(x − 3)² + 5 mit dem x-Regler.",
        check: (v) => v.factor === 4 && v.h === 3 && v.k === 5 && v.x === 3,
      },
      {
        id: "maximum",
        text: "Finde das Maximum von −(x + 2)² + 4.",
        check: (v) => v.factor === 1 && v.h === -2 && v.k === 4 && v.x === -2,
      },
    ],
  },
  exercises: [
    {
      id: "quadratisch-ergaenzen",
      make: (rng, level) => {
        const a = rng.pick([-3, -2, -1, 1, 2, 3]),
          h = rng.int(-5, 5),
          k = rng.int(-9, 12),
          b = -2 * a * h,
          c = a * h * h + k;
        if (level === 1)
          return task(
            `Bestimme den Extremwert von T(x) = ${a}x² + (${fmt(b)})x + (${fmt(c)}) für reelle x.`,
            [
              numberField("Extremstelle x =", h, "", 0),
              numberField("Extremwert:", k, "", 0),
              choiceField("Art", ["Minimum", "Maximum"], a > 0 ? 0 : 1),
            ],
            [
              `Quadratische Ergänzung: T(x) = ${a}(x − (${fmt(h)}))² + (${fmt(k)}).`,
              `<strong>${a > 0 ? "Minimum" : "Maximum"} ${fmt(k)} bei x = ${fmt(h)}.</strong>`,
            ],
            "a(x − h)² + k; Quadrat ≥ 0",
            { a, b, c, h, k },
          );
        const fence = 4 * rng.int(4, 12),
          x = fence / 4;
        return task(
          `An einer geraden Mauer soll ein rechteckiges Beet mit ${fence} m Zaun an den drei übrigen Seiten entstehen. Die beiden Seiten senkrecht zur Mauer heißen x; entlang der Mauer wird kein Zaun benötigt. Welche Breite x bringt die größte Fläche?`,
          [
            numberField("x =", x, "m", 0),
            numberField("andere Seite:", fence / 2, "m", 0),
            numberField("größte Fläche:", (fence * fence) / 8, "m²", 0),
          ],
          [
            `Die dritte Zaunseite ist ${fence} − 2x; erlaubt ist 0 < x < ${fence / 2}.`,
            `A(x) = x(${fence} − 2x) = −2(x − ${x})² + ${(fence * fence) / 8}.`,
            `<strong>x = ${x} m, andere Seite ${fence / 2} m, Fläche ${(fence * fence) / 8} m².</strong> Die Extremstelle liegt im erlaubten Bereich.`,
          ],
          undefined,
          { fence },
        );
      },
    },
  ],
});

const equations = defineLesson("tg-5-gleichungen", {
  subtitle: "Gleich viele Lösungen vor und nach jedem Schritt",
  whyItMatters:
    "Ein Rechenweg muss die Lösungsmenge erhalten, auch wenn am Ende kein x mehr steht.",
  explanationHtml: `<p>Äquivalenzumformungen ändern die Lösungsmenge nicht: auf beiden Seiten dasselbe addieren oder subtrahieren und mit derselben von null verschiedenen Zahl multiplizieren oder dividieren. Mit null multiplizieren kann Information vernichten; durch null teilen ist nicht erlaubt.</p><p>Löse zuerst Klammern und Produkte auf und fasse zusammen. Auch quadratische Glieder können sich aufheben; dann bleibt eine lineare Gleichung.</p><div class="example">(x + 2)² − x² = x + 13 wird zu 4x + 4 = x + 13, also 3x = 9 und x = 3. Probe: 25 − 9 = 3 + 13.</div><p>Über G = ℚ gilt: 0 = 0 liefert alle rationalen Zahlen; 0 = 5 liefert keine Lösung. Eine einzelne Lösung muss die ursprüngliche Gleichung erfüllen.</p>`,
  formulas: [
    {
      name: "Allgemeiner Fall",
      html: "ax + b = cx + d ⇒ (a − c)x = d − b",
      quantities: "a = c: wahre oder falsche Aussage ohne x prüfen",
    },
  ],
  quiz: {
    question: "Was bedeutet die Endzeile 0 = 0 beim Lösen über G = ℚ?",
    options: ["Nur x = 0 ist Lösung.", "Es gibt keine Lösung.", "Jede rationale Zahl ist Lösung."],
    correctIndex: 2,
    explanation: "Die wahre Aussage schränkt x nicht ein; L = ℚ.",
  },
  lab: {
    kind: "equation",
    title: "Drei Lösungsfälle",
    intro: "Untersuche ax + b = cx + d. Gleiche x-Koeffizienten sind ein besonders wichtiger Fall.",
    params: [
      range("a", "a", -4, 4, 1),
      range("b", "b", -4, 4, 1),
      range("c", "c", -4, 4, 2),
      range("d", "d", -4, 4, 0),
    ],
    readouts: [
      { key: "reduced", label: "Nach dem Sammeln", compute: (v) => `${v.a - v.c}x = ${v.d - v.b}` },
      {
        key: "solution",
        label: "Lösungsmenge über ℚ",
        compute: (v) => {
          const s = solveLinear(v.a, v.b, v.c, v.d);
          return s.kind === "one" ? `{${fmt(s.x, 2)}}` : s.kind === "all" ? "ℚ" : "leer";
        },
      },
    ],
    goals: [
      {
        id: "alle",
        text: "Erzeuge 2x + 3 = 2x + 3.",
        check: (v) => v.a === 2 && v.b === 3 && v.c === 2 && v.d === 3,
      },
      {
        id: "keine",
        text: "Ändere nur die rechte Konstante so, dass 2x + 3 = 2x + 4 keine Lösung hat.",
        check: (v) => v.a === 2 && v.b === 3 && v.c === 2 && v.d === 4,
      },
    ],
  },
  exercises: [
    {
      id: "lineare-gleichung",
      make: (rng, level) => {
        const b = rng.int(1, 7),
          kind = rng.int(0, 3),
          x = rng.int(-6, 8),
          coefficient = rng.int(1, 5) * rng.sign(),
          a = kind < 2 ? 2 * b : 2 * b - coefficient,
          d = kind === 0 ? b * b : kind === 1 ? b * b + rng.int(1, 6) : b * b + coefficient * x;
        const s = solveLinear(2 * b, b * b, a, d),
          idx = s.kind === "one" ? 0 : s.kind === "none" ? 1 : 2;
        return task(
          `${level === 1 ? "Löse über G = ℚ" : "Prüfe den Rechenplan einschließlich Lösungsfall und Probe"}: (x + ${b})² − x² = ${a}x + (${fmt(d)}).`,
          [
            choiceField(
              "Lösungsfall",
              ["genau eine Lösung", "keine Lösung", "alle rationalen Zahlen"],
              idx,
            ),
          ],
          [
            `Binomisch auflösen: ${2 * b}x + ${b * b} = ${a}x + (${fmt(d)}).`,
            `Sammeln: ${2 * b - a}x = ${fmt(d - b * b)}.`,
            s.kind === "one"
              ? `<strong>x = ${fmt(s.x, 2)}.</strong> Einsetzen in beide Ausgangsseiten ergibt jeweils ${fmt(2 * b * s.x + b * b, 2)}.`
              : s.kind === "all"
                ? `<strong>0 = 0, also L = ℚ.</strong>`
                : `<strong>Falsche Aussage, also L ist leer.</strong>`,
          ],
          level === 1 ? "Klammer auflösen, x² kürzen, x-Glieder sammeln." : undefined,
          { b, a, d },
        );
      },
    },
    {
      id: "eindeutig-loesen",
      make: (rng, level) => {
        const b = rng.int(1, 7),
          a = rng.int(1, 5) * rng.sign(),
          x = rng.int(-8, 8),
          rhs = b * b + a * x;
        return task(
          `${level === 1 ? "Löse die Gleichung über G = ℚ" : "Ein Prüfprogramm hat folgende Gleichung erzeugt. Bestimme die Lösung und kontrolliere sie im Ausgangsterm"}: (x + ${b})² − x² = ${2 * b - a}x + (${fmt(rhs)}).`,
          [numberField("x =", x, "", 0)],
          [
            `Links ausmultiplizieren: ${2 * b}x + ${b * b}.`,
            `Sammeln: ${a}x = ${a * x}.`,
            `<strong>x = ${fmt(x)}.</strong> Probe: Beide Ausgangsseiten sind ${fmt(2 * b * x + b * b)}.`,
          ],
          level === 1 ? "Binomisch auflösen, x² kürzen, linear lösen." : undefined,
          { b, a: 2 * b - a, d: rhs },
        );
      },
    },
  ],
});

const words = defineLesson("tg-6-sachaufgaben", {
  subtitle: "Unbekannte festlegen, Modell prüfen, Antwort geben",
  whyItMatters:
    "Ein richtig gerechnetes Ergebnis hilft nur, wenn die Gleichung den Text tatsächlich beschreibt.",
  explanationHtml: `<ol><li>Lege die Unbekannte mit Einheit fest.</li><li>Übersetze den Zusammenhang in eine Gleichung.</li><li>Löse mit Äquivalenzumformungen.</li><li>Prüfe das Ergebnis im ursprünglichen Text und im erlaubten Zahlenbereich.</li><li>Schreibe einen Antwortsatz.</li></ol><div class="example">Ein erfundener Werkstattpreis besteht aus 6 € Grundpreis und 3 € je Teil. Bei 30 € Gesamtkosten gilt 6 + 3x = 30, also x = 8 Teile. Probe: 6 + 3 · 8 = 30.</div><p>Bei geometrischen Aufgaben kann das Auflösen zweier quadratischer Terme eine lineare Gleichung ergeben. Eine negative Seitenlänge wäre trotzdem keine sinnvolle Lösung des Modells.</p>`,
  formulas: [
    {
      name: "Kostenmodell",
      html: "Gesamtkosten = Grundpreis + Stückpreis · Anzahl",
      quantities: "nur solange das beschriebene lineare Modell gilt",
    },
  ],
  quiz: {
    question:
      "Ein Modell kostet 5 € Grundpreis und 2 € je Teil. Welche Gleichung passt zu 19 € Gesamtkosten?",
    options: ["5x + 2 = 19", "5 + 2x = 19", "(5 + 2)x = 19"],
    correctIndex: 1,
    explanation:
      "Nur der Stückpreis wird mit der Anzahl multipliziert; der Grundpreis fällt einmal an.",
  },
  lab: {
    kind: "word-equation",
    title: "Passt das Kostenmodell?",
    intro:
      "Der Betrag links wird aus Anzahl, Grundpreis und Stückpreis berechnet. Suche die Anzahl zum Zielbetrag.",
    params: [
      range("base", "Grundpreis", 0, 12, 6, 1, "€"),
      range("unit", "Stückpreis", 1, 6, 3, 1, "€"),
      range("count", "Anzahl", 0, 15, 2),
      range("budget", "Zielbetrag", 6, 60, 30, 1, "€"),
    ],
    readouts: [
      {
        key: "cost",
        label: "Berechneter Betrag",
        unit: "€",
        compute: (v) => v.base + v.unit * v.count,
      },
      {
        key: "difference",
        label: "Berechnet minus Ziel",
        unit: "€",
        compute: (v) => v.base + v.unit * v.count - v.budget,
      },
    ],
    goals: [
      {
        id: "acht",
        text: "Finde die Anzahl für 6 € Grundpreis, 3 € je Teil und 30 € Zielbetrag.",
        check: (v) => v.base === 6 && v.unit === 3 && v.budget === 30 && v.count === 8,
      },
      {
        id: "fuenf",
        text: "Löse das neue Modell mit 4 € Grundpreis, 5 € je Teil und 29 € Zielbetrag.",
        check: (v) => v.base === 4 && v.unit === 5 && v.budget === 29 && v.count === 5,
      },
    ],
  },
  exercises: [
    {
      id: "modellieren",
      make: (rng, level) => {
        const x = rng.int(3, 12),
          base = rng.int(3, 10),
          unit = rng.int(2, 6);
        if (level === 1)
          return task(
            `Eine erfundene Werkstatt verlangt ${base} € Grundpreis und ${unit} € je Teil. Die Rechnung beträgt ${base + unit * x} €. Wie viele Teile wurden gefertigt?`,
            [numberField("Anzahl:", x, "Teile", 0)],
            [
              `${base} + ${unit}x = ${base + unit * x}.`,
              `${unit}x = ${unit * x}; x = ${x}.`,
              `<strong>${x} Teile.</strong> Probe: ${base} + ${unit} · ${x} = ${base + unit * x}.`,
            ],
            "Grundpreis + Stückpreis · Anzahl = Rechnung",
            { x, base, unit },
          );
        const increase = rng.int(2, 6),
          area = (x + increase) ** 2 - x * x;
        return task(
          `Zwei quadratische Platten unterscheiden sich in der Seitenlänge um ${increase} cm. Ihre Flächen unterscheiden sich um ${area} cm². Bestimme die Seitenlänge der kleineren Platte.`,
          [
            numberField("kleinere Seite:", x, "cm", 0),
            numberField("größere Seite:", x + increase, "cm", 0),
          ],
          [
            `Sei x die kleinere Seite: (x + ${increase})² − x² = ${area}.`,
            `${2 * increase}x + ${increase ** 2} = ${area}; x = ${x}.`,
            `<strong>${x} cm und ${x + increase} cm.</strong> Probe: ${(x + increase) ** 2} − ${x * x} = ${area} cm²; beide Seiten sind positiv.`,
          ],
          undefined,
          { x, increase, area },
        );
      },
    },
  ],
});

const inequalities = defineLesson("tg-7-ungleichungen", {
  subtitle: "Beim Teilen durch negative Zahlen dreht sich das Zeichen um",
  whyItMatters:
    "Grenzen für Kosten oder Größen beschreiben oft viele erlaubte Werte statt einer einzelnen Lösung.",
  explanationHtml: `<p>Addieren und Subtrahieren derselben Zahl auf beiden Seiten ändern die Richtung nicht. Multiplizieren oder Dividieren mit einer positiven Zahl ebenfalls nicht. Bei einer <strong>negativen Zahl</strong> kehrt sich das Relationszeichen um.</p><div class="example">5 − 3x ≥ 17 ⇒ −3x ≥ 12 ⇒ x ≤ −4. Über G = ℚ ist L = {x ∈ ℚ | x ≤ −4}. Der Randpunkt −4 gehört dazu; bei einem strengen Zeichen wäre er ausgeschlossen.</div><p>Auch hier löst du zuerst Produkte und Klammern auf. Prüfe einen Wert innerhalb und einen außerhalb deiner Lösungsmenge in der ursprünglichen Ungleichung.</p>`,
  formulas: [
    {
      name: "Negativer Faktor",
      html: "a &lt; b ⇒ −a &gt; −b",
      quantities: "entsprechend für ≤ und ≥",
    },
  ],
  quiz: {
    question: "Was folgt aus −2x ≥ 8?",
    options: ["x ≥ −4", "x ≤ −4", "x ≥ 4"],
    correctIndex: 1,
    explanation: "Beim Teilen durch −2 muss aus ≥ das Zeichen ≤ werden.",
  },
  lab: {
    kind: "inequality",
    title: "Lösungsbereich auf der Zahlengeraden",
    intro: "Untersuche ax + b ≥ d. Der ausgefüllte Randpunkt gehört zur Lösungsmenge.",
    params: [
      choice("factor", "a", ["−3", "−2", "−1", "1", "2", "3"], 4),
      range("b", "b", -4, 4, 1),
      range("d", "d", -8, 8, 5),
      range("x", "Prüfwert x", -6, 6, 0, 0.5),
    ],
    readouts: [
      {
        key: "boundary",
        label: "Randwert (gerundet)",
        digits: 2,
        compute: (v) => (v.d - v.b) / [-3, -2, -1, 1, 2, 3][v.factor],
      },
      {
        key: "direction",
        label: "Lösungsbereich exakt",
        compute: (v) =>
          `x ${v.factor < 3 ? "≤" : "≥"} (${v.d - v.b})/(${[-3, -2, -1, 1, 2, 3][v.factor]})`,
      },
      {
        key: "valid",
        label: "Prüfwert erlaubt?",
        compute: (v) => ([-3, -2, -1, 1, 2, 3][v.factor] * v.x + v.b >= v.d ? "ja" : "nein"),
      },
    ],
    goals: [
      {
        id: "negativ",
        text: "Untersuche −3x + 4 ≥ 7 am erlaubten Randpunkt x = −1.",
        check: (v) => v.factor === 0 && v.b === 4 && v.d === 7 && v.x === -1,
      },
      {
        id: "positiv",
        text: "Untersuche 2x + 1 ≥ 5 am erlaubten Randpunkt x = 2.",
        check: (v) => v.factor === 4 && v.b === 1 && v.d === 5 && v.x === 2,
      },
    ],
  },
  exercises: [
    {
      id: "ungleichung",
      make: (rng, level) => {
        const b = rng.int(1, 6),
          coefficient = rng.int(1, 5) * rng.sign(),
          boundary = rng.int(-5, 5),
          a = 2 * b - coefficient,
          d = b * b + coefficient * boundary;
        if (level === 1)
          return task(
            `Löse über G = ℚ: (x + ${b})² − x² ≥ ${a}x + (${fmt(d)}).`,
            [
              numberField("Randwert:", boundary, "", 0),
              choiceField("Richtung", ["x ≥ Randwert", "x ≤ Randwert"], coefficient > 0 ? 0 : 1),
            ],
            [
              `Ausmultiplizieren: ${2 * b}x + ${b * b} ≥ ${a}x + (${fmt(d)}).`,
              `Sammeln: ${coefficient}x ≥ ${coefficient * boundary}.`,
              `<strong>x ${coefficient > 0 ? "≥" : "≤"} ${fmt(boundary)}.</strong> ${coefficient < 0 ? "Beim Teilen durch den negativen Koeffizienten kehrt sich das Zeichen um." : "Der positive Divisor erhält die Richtung."}`,
            ],
            "Erst vereinfachen; beim Teilen Vorzeichen beachten.",
            { b, a, d, coefficient, boundary },
          );
        const start = rng.int(15, 25),
          rate = rng.int(1, 4),
          hours = rng.int(2, 4),
          target = start - rate * hours;
        return task(
          `Ein vereinfachtes Abkühlmodell lautet T(t) = ${start} − ${rate}t für die ersten 5 Stunden, t ≥ 0. Wie lange beträgt die Temperatur mindestens ${target} °C? Gib den oberen Zeitrand an und entscheide, ob er dazugehört.`,
          [
            numberField("bis t =", hours, "h", 0),
            choiceField("Randpunkt gehört dazu?", ["ja", "nein"], 0),
          ],
          [
            `${start} − ${rate}t ≥ ${target} ⇒ −${rate}t ≥ −${rate * hours}.`,
            `<strong>0 ≤ t ≤ ${hours} Stunden.</strong> Teilen durch −${rate} kehrt das Zeichen um; der obere Rand gehört dazu.`,
          ],
          undefined,
          { start, rate, hours, target },
        );
      },
    },
  ],
});

export const STAGE_TERME = stage("terme-gleichungen", [
  operations,
  binomial,
  factoring,
  extrema,
  equations,
  words,
  inequalities,
]);
