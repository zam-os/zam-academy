import { fmt, paren } from "../exercises/format";
import { clean, reduce, roundSchool } from "../models";
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
  makeLesson(5, step, content);

const PATTERNS: Array<{ term: string; f: (n: number) => number; why: string }> = [
  {
    term: "3 · n + 1",
    f: (n) => 3 * n + 1,
    why: "Das erste Hölzchen links, dann für jedes Quadrat 3 weitere.",
  },
  {
    term: "2 · n + 1",
    f: (n) => 2 * n + 1,
    why: "Das erste Hölzchen, dann für jedes Dreieck 2 weitere.",
  },
  {
    term: "5 + 2 · n",
    f: (n) => 5 + 2 * n,
    why: "5 € fest, dazu 2 € für jeden Besuch.",
  },
];

const termeAufstellen = L(1, {
  id: "tg-1-terme-aufstellen",
  title: "5.1 Terme mit Variablen aufstellen",
  subtitle: "Einen Zusammenhang kurz und allgemein schreiben",
  whyItMatters:
    "Eine Variable steht für viele mögliche Zahlen. Mit einem Term beschreibst du also nicht einen Einzelfall, sondern den ganzen Zusammenhang.",
  explanationHtml: `<p>Eine <strong>Variable</strong> ist ein Platzhalter für eine Zahl, meist x, n oder a. Ein <strong>Term</strong> ist ein sinnvoller Rechenausdruck aus Zahlen, Variablen und Rechenzeichen, zum Beispiel 3 · n + 1. Den Malpunkt zwischen Zahl und Variable darfst du weglassen: 3n statt 3 · n.</p><div class="example">Ein Kinobesuch kostet 7 € pro Person, dazu kommen 2 € für die Reservierung. Bei n Personen: T(n) = 7 · n + 2. Für 4 Personen: T(4) = 7 · 4 + 2 = 30, also 30 €.</div><p>So stellst du einen Term auf: Was bleibt fest? Was ändert sich? Die veränderliche Größe bekommt eine Variable.</p><div class="merke"><strong>Merke:</strong> „je“ und „pro“ führen meist zu einem Produkt mit der Variablen; ein fester Betrag kommt als Summand dazu.</div>`,
  formulas: [
    {
      name: "Term",
      html: "T(n) = a · n + b",
      quantities: "n Variable, a Betrag je Stück, b fester Betrag",
    },
  ],
  quiz: {
    question: "Ein Paket kostet 4 €, der Versand einmalig 3 €. Welcher Term gibt den Preis für x Pakete an?",
    options: ["4 · x + 3", "(4 + 3) · x", "4 + 3 · x"],
    correctIndex: 0,
    explanation: "Der Preis je Paket wird mit x multipliziert, der Versand kommt nur einmal dazu.",
  },
  lab: lab(
    "term-build",
    "Muster wachsen lassen",
    "Wähle ein Muster und erhöhe die Figurnummer. Erkennst du, was bei jedem Schritt dazukommt?",
    [
      c("p", "Muster", ["Hölzchen: Quadratkette", "Hölzchen: Dreieckskette", "Kosten: Eintritt mit Grundpreis"]),
      r("n", "Figurnummer n", 1, 10, 1),
    ],
    [
      o("term", "Term", (v) => PATTERNS[v.p].term),
      o("value", "Termwert", (v) => PATTERNS[v.p].f(v.n), "", 0),
      o("why", "Warum?", (v) => PATTERNS[v.p].why),
    ],
    [
      {
        id: "dreizehn",
        text: "Baue die Quadratkette mit 13 Hölzchen.",
        check: (v) => v.p === 0 && v.n === 4,
      },
      {
        id: "einundzwanzig",
        text: "Baue die Dreieckskette mit 21 Hölzchen.",
        check: (v) => v.p === 1 && v.n === 10,
      },
      {
        id: "kosten",
        text: "Finde beim Eintritt die Anzahl der Besuche für 15 €.",
        check: (v) => v.p === 2 && v.n === 5,
      },
    ],
  ),
  exercises: [
    {
      id: "term-lesen",
      make: (rng, level) => {
        const a = rng.int(2, 9);
        const b = rng.int(1, 12);
        const n = rng.int(3, 12);
        if (level === 1)
          return task(
            level,
            `Eine Fahrt kostet ${a} € pro Person und einmalig ${b} € Parkgebühr. Stelle den Term T(n) = a · n + b auf. Wie hoch sind die Kosten für ${n} Personen?`,
            "",
            [num("a =", a, "", 0), num("b =", b, "", 0), num(`T(${n}) =`, a * n + b, "€", 0)],
            "a ist der Betrag je Person, b der einmalige Betrag.",
            `T(n) = ${a} · n + ${b}.`,
            `T(${n}) = ${a * n + b} €.`,
            { a, b, n },
          );
        const extra = rng.int(1, 5);
        return task(
          level,
          "",
          `Ein Handwerker berechnet ${b * 5} € Anfahrt und ${a * 5} € pro Stunde. Für Kleinteile kommen pro Stunde noch ${extra} € dazu. Stelle einen Term für x Stunden auf und berechne die Rechnung für ${n} Stunden.`,
          [
            num("Betrag je Stunde =", a * 5 + extra, "€", 0),
            num("Fester Betrag =", b * 5, "€", 0),
            num("Rechnung =", (a * 5 + extra) * n + b * 5, "€", 0),
          ],
          "Alles, was pro Stunde anfällt, gehört zur Variablen.",
          `T(x) = ${a * 5 + extra} · x + ${b * 5}.`,
          `${(a * 5 + extra) * n + b * 5} €.`,
          { a, b, n, extra },
        );
      },
    },
    {
      id: "muster",
      make: (rng, level) => {
        const perStep = rng.pick([2, 3, 4, 5]);
        const start = rng.int(1, 6);
        const n = rng.int(5, 20);
        if (level === 1)
          return task(
            level,
            `Eine Figurenfolge hat in Figur 1 genau ${start + perStep} Plättchen, in Figur 2 genau ${start + 2 * perStep}, in Figur 3 genau ${start + 3 * perStep}. Wie viele Plättchen kommen je Schritt dazu? Wie viele hat Figur ${n}?`,
            "",
            [num("Je Schritt =", perStep, "", 0), num(`Figur ${n} =`, start + perStep * n, "", 0)],
            "Der Unterschied zweier Figuren ist der Faktor vor n. Der Term hat die Form a · n + b.",
            `T(n) = ${perStep} · n + ${start}.`,
            `${start + perStep * n} Plättchen.`,
            { perStep, start, n },
          );
        const target = start + perStep * n;
        return task(
          level,
          "",
          `Für eine Figurenfolge gilt T(n) = ${perStep} · n + ${start} Plättchen. Tom hat ${target} Plättchen und möchte damit genau eine Figur legen. Die wievielte Figur ist das? Wie viele Plättchen braucht er für die nächste?`,
          [num("Figur Nr. =", n, "", 0), num("Nächste Figur =", target + perStep, "", 0)],
          "Probiere oder rechne rückwärts: erst den festen Teil abziehen, dann durch den Faktor teilen.",
          `${target} − ${start} = ${target - start}; ${target - start} : ${perStep} = ${n}.`,
          `Figur ${n}; die nächste braucht ${target + perStep} Plättchen.`,
          { perStep, start, n },
        );
      },
    },
  ],
});

const darstellungen = L(2, {
  id: "tg-2-darstellungen",
  title: "5.2 Terme in Tabelle, Graph, Skizze und Text",
  subtitle: "Dasselbe in verschiedenen Sprachen",
  whyItMatters:
    "Ein Term lässt sich als Text, Tabelle, Punktgraph oder Skizze zeigen. Oft erkennst du in einer Darstellung sofort, was in einer anderen schwer zu sehen ist.",
  explanationHtml: `<p>In einer <strong>Wertetabelle</strong> ordnest du jedem x den Termwert T(x) zu. Trägst du diese Paare als Punkte in ein Koordinatensystem ein, entsteht eine <strong>grafische Wertetabelle</strong>. Auch eine <strong>Skizze</strong> oder ein <strong>Text</strong> kann einen Term beschreiben.</p><div class="example">T(x) = 2 · x + 1: x = 0, 1, 2, 3 ergibt 1, 3, 5, 7. In der Tabelle steigt der Wert je Schritt um 2, im Graphen liegen die Punkte auf einer Linie. Der Wert bei x = 0 ist 1, der feste Teil. Text: „das Doppelte einer Zahl, vermehrt um 1“.</div><div class="merke"><strong>Merke:</strong> Wächst x in der Tabelle um 1, so wächst T(x) bei T(x) = a · x + b immer um a. Für x = 0 liest du b ab.</div>`,
  formulas: [
    {
      name: "Term aus Tabelle",
      html: "a = Zunahme je Schritt; b = T(0)",
      quantities: "gilt für Terme der Form a · x + b",
    },
  ],
  quiz: {
    question: "Eine Tabelle zeigt T(0) = 4, T(1) = 7, T(2) = 10. Welcher Term passt?",
    options: ["3 · x + 4", "4 · x + 3", "x + 7"],
    correctIndex: 0,
    explanation: "Je Schritt kommen 3 dazu, und bei x = 0 ist der Wert 4.",
  },
  lab: lab(
    "term-table",
    "Tabelle und Graph",
    "Stelle a und b ein und ziehe den Punkt. Tabelle und Punkte zeigen denselben Term.",
    [
      r("a", "a (Zunahme je Schritt)", 0, 4, 1, 0.5),
      r("b", "b (Wert bei x = 0)", 0, 6, 1),
      r("x", "Markierter x-Wert", 0, 6, 1),
    ],
    [
      o("term", "Term", (v) => `${fmt(v.a)} · x + ${fmt(v.b)}`),
      o("value", "Markierter Termwert", (v) => v.a * v.x + v.b),
    ],
    [
      {
        id: "doppelt",
        text: "Zeige den Term 2 · x + 3.",
        check: (v) => v.a === 2 && v.b === 3,
      },
      {
        id: "halb",
        text: "Zeige den Term 0,5 · x + 4.",
        check: (v) => v.a === 0.5 && v.b === 4,
      },
      {
        id: "zehn",
        text: "Finde bei T(x) = 2 · x + 2 das x mit dem Termwert 10.",
        check: (v) => v.a === 2 && v.b === 2 && v.x === 4,
      },
    ],
  ),
  exercises: [
    {
      id: "tabelle",
      make: (rng, level) => {
        const a = rng.int(2, 6);
        const b = rng.int(0, 9);
        if (level === 1) {
          const x = rng.int(2, 9);
          return task(
            level,
            `Fülle die Wertetabelle für T(x) = ${a} · x + ${b} an der Stelle x = ${x} aus. Um wie viel wächst T(x), wenn x um 1 wächst?`,
            "",
            [num(`T(${x}) =`, a * x + b, "", 0), num("Zunahme =", a, "", 0)],
            "Setze x ein. Die Zunahme steht direkt vor dem x.",
            `${a} · ${x} + ${b}.`,
            `T(${x}) = ${a * x + b}, Zunahme ${a}.`,
            { a, b, x },
          );
        }
        const x0 = rng.int(1, 4);
        return task(
          level,
          "",
          `Eine Wertetabelle zeigt: x = ${x0} ergibt ${a * x0 + b}, x = ${x0 + 1} ergibt ${a * (x0 + 1) + b}, x = ${x0 + 2} ergibt ${a * (x0 + 2) + b}. Bestimme den Term T(x) = a · x + b.`,
          [num("a =", a, "", 0), num("b =", b, "", 0)],
          "a ist die Zunahme je Schritt. Gehe dann rückwärts bis x = 0.",
          `Zunahme ${a}; ${a * x0 + b} − ${a} · ${x0} = ${b}.`,
          `T(x) = ${a} · x + ${b}.`,
          { a, b, x0 },
        );
      },
    },
    {
      id: "skizze",
      make: (rng, level) => {
        const extra = rng.int(1, 6);
        const x = rng.int(2, 9);
        if (level === 1)
          return task(
            level,
            `Ein Rechteck hat die Breite x und die Länge x + ${extra}. Sein Umfang ist 2 · x + 2 · (x + ${extra}). Berechne den Umfang für x = ${x} cm.`,
            "",
            [num("U =", 4 * x + 2 * extra, "cm", 0)],
            "Setze x ein. Rechne die Klammer zuerst aus.",
            `2 · ${x} + 2 · ${x + extra}.`,
            `${4 * x + 2 * extra} cm.`,
            { extra, x },
          );
        const k = rng.int(2, 4);
        return task(
          level,
          "",
          `Eine Skizze zeigt ein Rechteck mit der Breite x und der Länge ${k} · x, davor einen ${extra} m breiten Weg entlang der Länge. Gib den Faktor a im Term der Rechtecksfläche ohne Weg an (Fläche = a · x · x) und berechne die Fläche mit Weg für x = ${x} m.`,
          [
            num("a =", k, "", 0),
            num("Fläche mit Weg =", k * x * (x + extra), "m²", 0),
          ],
          "Mit Weg ist die Breite x + Wegbreite; die Länge bleibt k · x.",
          `(${x} + ${extra}) · ${k} · ${x}.`,
          `a = ${k}; ${k * x * (x + extra)} m².`,
          { k, extra, x },
        );
      },
    },
  ],
});

const TERMS: Array<{ name: string; f: (x: number) => number }> = [
  { name: "2 · x + 1", f: (x) => 2 * x + 1 },
  { name: "3 − x", f: (x) => 3 - x },
  { name: "x · x", f: (x) => x * x },
];
const SETS = ["ℕ = {1; 2; 3; …}", "ℤ = {…; −1; 0; 1; …}", "ℚ (alle rationalen Zahlen)"];
const inSet = (x: number, g: number) =>
  g === 2 ? true : Number.isInteger(x) && (g === 1 || x >= 1);

const termwerte = L(3, {
  id: "tg-3-termwerte",
  title: "5.3 Termwerte und Grundmenge",
  subtitle: "Einsetzen, aber nur was erlaubt ist",
  whyItMatters:
    "Für eine Anzahl von Personen ist 2,5 kein sinnvoller Wert. Die Grundmenge legt fest, welche Zahlen du für die Variable einsetzen darfst.",
  explanationHtml: `<p>Einen <strong>Termwert</strong> erhältst du, indem du die Variable mit einer Zahl belegst und ausrechnest. Die <strong>Grundmenge</strong> G gibt an, welche Zahlen dafür erlaubt sind. Du kennst ℕ = {1; 2; 3; …}, ℤ = {…; −1; 0; 1; …} und ℚ.</p><div class="example">T(x) = 2 · x + 1 mit G = ℤ: T(−3) = 2 · (−3) + 1 = −5. Mit G = ℕ wäre x = −3 nicht erlaubt. Setze negative Zahlen immer in Klammern ein.</div><p>Die Grundmenge kann auch eine kleine Liste sein, etwa G = {1; 2; 3}, oder aus der Sache folgen: Eine Personenzahl ist natürlich.</p><div class="merke"><strong>Merke:</strong> Erst prüfen, ob die Zahl in G liegt, dann einsetzen. Es gilt die Reihenfolge: Klammer, Potenz, Punkt, Strich.</div>`,
  formulas: [
    {
      name: "Termwert",
      html: "T(3) ist der Wert von T für x = 3",
      quantities: "x wird überall durch dieselbe Zahl ersetzt",
    },
    {
      name: "Grundmengen",
      html: "ℕ ⊂ ℤ ⊂ ℚ",
      quantities: "natürliche, ganze, rationale Zahlen",
    },
  ],
  quiz: {
    question: "Was ist T(−2) für T(x) = 3 − x?",
    options: ["5", "1", "−5"],
    correctIndex: 0,
    explanation: "3 − (−2) = 3 + 2 = 5. Der Wert 1 entsteht, wenn du die Klammer und das Minus vergisst.",
  },
  lab: lab(
    "term-value",
    "Einsetzen mit Grundmenge",
    "Wähle Term und Grundmenge und ziehe x. Nur Zahlen aus der Grundmenge sind erlaubt.",
    [
      c("t", "Term", TERMS.map((term) => term.name)),
      c("g", "Grundmenge", ["ℕ", "ℤ", "ℚ"]),
      r("x", "Belegung x", -4, 4, 1, 0.5),
    ],
    [
      o("term", "Term", (v) => TERMS[v.t].name),
      o("setName", "Grundmenge", (v) => SETS[v.g]),
      o("allowed", "x in G?", (v) => (inSet(v.x, v.g) ? "ja" : "nein")),
      o("value", "Termwert", (v) =>
        inSet(v.x, v.g) ? `T = ${fmt(TERMS[v.t].f(v.x))}` : "x liegt nicht in G",
      ),
    ],
    [
      {
        id: "natuerlich",
        text: "Berechne für 2 · x + 1 den Wert bei x = 3 mit G = ℕ.",
        check: (v) => v.t === 0 && v.g === 0 && v.x === 3,
      },
      {
        id: "ganz",
        text: "Berechne für 3 − x den Wert bei x = −2 mit G = ℤ.",
        check: (v) => v.t === 1 && v.g === 1 && v.x === -2,
      },
      {
        id: "rational",
        text: "Berechne für x · x den Wert bei x = 1,5. Welche Grundmenge muss das sein?",
        check: (v) => v.t === 2 && v.g === 2 && v.x === 1.5,
      },
    ],
  ),
  exercises: [
    {
      id: "belegen",
      make: (rng, level) => {
        const a = rng.int(2, 7);
        const b = rng.int(1, 12) * rng.sign();
        const x = rng.int(1, 9) * (level === 1 ? 1 : rng.sign());
        const xv = level === 1 ? x : x / 2;
        const value = clean(a * xv + b);
        const term = `${a} · x ${b < 0 ? "−" : "+"} ${Math.abs(b)}`;
        return task(
          level,
          `Berechne den Termwert von T(x) = ${term} für x = ${x}.`,
          `Berechne T(x) = ${term} für x = ${fmt(xv)}. Liegt x in ℤ?`,
          [
            num("T =", value, "", 2),
            ...(level === 2 ? [yesNo("x in ℤ?", Number.isInteger(xv))] : []),
          ],
          "Setze x ein; negative Zahlen in Klammern. Punkt vor Strich.",
          `${a} · ${paren(xv)} ${b < 0 ? "−" : "+"} ${Math.abs(b)}.`,
          `${fmt(value)}.`,
          { a, b, xv },
        );
      },
    },
    {
      id: "grundmenge",
      make: (rng, level) => {
        if (level === 1) {
          const candidates = [
            { value: "−2", g: 0, ok: false },
            { value: "0,5", g: 1, ok: false },
            { value: "4", g: 0, ok: true },
            { value: "−3", g: 1, ok: true },
            { value: "1,5", g: 2, ok: true },
            { value: "0", g: 0, ok: false },
          ];
          const pickOne = rng.pick(candidates);
          return task(
            level,
            `Darfst du x = ${pickOne.value} einsetzen, wenn die Grundmenge ${["ℕ", "ℤ", "ℚ"][pickOne.g]} ist?`,
            "",
            [yesNo("Erlaubt?", pickOne.ok)],
            "ℕ enthält 1, 2, 3, …; ℤ auch 0 und negative ganze Zahlen; ℚ auch Brüche.",
            `Prüfe, ob ${pickOne.value} in der Menge liegt.`,
            pickOne.ok ? "Ja, erlaubt." : "Nein, nicht erlaubt.",
            { g: pickOne.g },
          );
        }
        const a = rng.int(2, 5);
        const b = rng.int(1, 6);
        const list = [1, 2, 3];
        const sum = list.reduce((total, x) => total + a * x + b, 0);
        const k = rng.int(2, 4);
        return task(
          level,
          "",
          `Für T(x; y) = x · y + ${b} ist die Grundmenge von x und y die Menge ℕ. Berechne T(${a}; ${k}). Berechne außerdem die Summe der Werte von S(x) = ${a} · x + ${b} für G = {1; 2; 3}.`,
          [num("T =", a * k + b, "", 0), num("Summe =", sum, "", 0)],
          "Belege beide Variablen. Bei G = {1; 2; 3} rechnest du dreimal.",
          `${a} · ${k} + ${b}; ${a + b} + ${2 * a + b} + ${3 * a + b}.`,
          `${a * k + b} und ${sum}.`,
          { a, b, k },
        );
      },
    },
  ],
});

const PAIRS: Array<{ left: string; right: string; l: (x: number) => number; r: (x: number) => number; equal: boolean }> = [
  { left: "2 · (x + 3)", right: "2 · x + 6", l: (x) => 2 * (x + 3), r: (x) => 2 * x + 6, equal: true },
  { left: "3 · x + x", right: "4 · x", l: (x) => 3 * x + x, r: (x) => 4 * x, equal: true },
  { left: "2 · x + 3", right: "3 · x + 1", l: (x) => 2 * x + 3, r: (x) => 3 * x + 1, equal: false },
  { left: "x + x", right: "x · x", l: (x) => x + x, r: (x) => x * x, equal: false },
];

const aequivalenz = L(4, {
  id: "tg-4-aequivalenz",
  title: "5.4 Gleichwertige Terme",
  subtitle: "Prüfen durch Einsetzen und Umformen",
  whyItMatters:
    "2 · (x + 3) und 2 · x + 6 sehen verschieden aus, liefern aber immer dasselbe. Mit Umformungen vereinfachst du Terme, bevor du rechnest.",
  explanationHtml: `<p>Zwei Terme sind <strong>äquivalent</strong>, wenn sie für jede Belegung aus der Grundmenge denselben Wert haben. Ein einziges Gegenbeispiel genügt, um zu zeigen, dass sie nicht äquivalent sind. Eine einzelne Übereinstimmung beweist dagegen nichts.</p><p>Zeigen kannst du die Äquivalenz durch <strong>Umformen mit den Rechengesetzen</strong>: gleichartige Glieder zusammenfassen (3x + x = 4x) und das Verteilungsgesetz anwenden (2 · (x + 3) = 2x + 6).</p><div class="example">2x + 3 und 3x + 1 haben für x = 2 beide den Wert 7. Trotzdem sind sie nicht äquivalent: Für x = 0 ergibt sich 3 und 1.</div><div class="merke"><strong>Merke:</strong> Nur gleichartige Glieder lassen sich zusammenfassen: 3x + 2x = 5x, aber 3x + 2 bleibt 3x + 2.</div>`,
  formulas: [
    {
      name: "Zusammenfassen",
      html: "a · x + b · x = (a + b) · x",
      quantities: "nur gleiche Variablen",
    },
    {
      name: "Verteilungsgesetz",
      html: "a · (x + b) = a · x + a · b",
      quantities: "jeder Summand wird malgenommen",
    },
  ],
  quiz: {
    question: "Welcher Term ist äquivalent zu 3 · (x + 2)?",
    options: ["3 · x + 6", "3 · x + 2", "5 · x"],
    correctIndex: 0,
    explanation: "Beide Summanden werden mit 3 malgenommen. Bei 3x + 2 wurde die 2 vergessen.",
  },
  lab: lab(
    "term-equiv",
    "Zwei Terme vergleichen",
    "Wähle ein Termpaar und probiere Belegungen aus. Achte darauf: Einmal gleich heißt nicht immer gleich.",
    [
      c("pair", "Termpaar", PAIRS.map((pair) => `${pair.left} und ${pair.right}`)),
      r("x", "Belegung x", -4, 4, 1),
    ],
    [
      o("left", "Linker Term", (v) => PAIRS[v.pair].left),
      o("right", "Rechter Term", (v) => PAIRS[v.pair].right),
      o("leftValue", "Linker Wert", (v) => PAIRS[v.pair].l(v.x), "", 0),
      o("rightValue", "Rechter Wert", (v) => PAIRS[v.pair].r(v.x), "", 0),
      o("same", "Für dieses x", (v) =>
        PAIRS[v.pair].l(v.x) === PAIRS[v.pair].r(v.x) ? "gleicher Wert" : "verschiedene Werte: Gegenbeispiel",
      ),
      o("verdict", "Äquivalent?", (v) =>
        PAIRS[v.pair].equal ? "Ja, das zeigt die Umformung." : "Nein, es gibt ein Gegenbeispiel.",
      ),
    ],
    [
      {
        id: "zufall",
        text: "Finde beim Paar 2 · x + 3 und 3 · x + 1 die Belegung mit gleichem Wert.",
        check: (v) => v.pair === 2 && v.x === 2,
      },
      {
        id: "gegenbeispiel",
        text: "Zeige beim Paar x + x und x · x ein Gegenbeispiel mit negativem x.",
        check: (v) => v.pair === 3 && v.x < 0,
      },
      {
        id: "null",
        text: "Finde beim Paar 2 · (x + 3) und 2 · x + 6 die Belegung, bei der beide 0 ergeben.",
        check: (v) => v.pair === 0 && v.x === -3,
      },
    ],
  ),
  exercises: [
    {
      id: "vereinfachen",
      make: (rng, level) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        if (level === 1) {
          const k = rng.int(1, 9);
          return task(
            level,
            `Fasse zusammen: ${a} · x + ${b} · x + ${k}. Schreibe das Ergebnis als p · x + q.`,
            "",
            [
              num("p =", a + b, "", 0),
              num("q =", k, "", 0, {
                slips: [{ value: 0, hint: "Die Zahl ohne x bleibt stehen." }],
              }),
            ],
            "Nur gleichartige Glieder lassen sich zusammenfassen.",
            `${a} · x + ${b} · x = ${a + b} · x.`,
            `${a + b} · x + ${k}.`,
            { a, b, k },
          );
        }
        const c0 = rng.int(1, 6);
        const d = rng.int(1, 6);
        return task(
          level,
          "",
          `Vereinfache mit dem Verteilungsgesetz: ${a} · (x + ${c0}) + ${d} · x. Schreibe das Ergebnis als p · x + q.`,
          [
            num("p =", a + d, "", 0),
            num("q =", a * c0, "", 0, {
              slips: [{ value: c0, hint: "Auch der zweite Summand in der Klammer wird malgenommen." }],
            }),
          ],
          "Klammer auflösen, dann gleichartige Glieder zusammenfassen.",
          `${a} · x + ${a * c0} + ${d} · x.`,
          `${a + d} · x + ${a * c0}.`,
          { a, c0, d },
        );
      },
    },
    {
      id: "pruefen",
      make: (rng, level) => {
        const a = rng.int(2, 6);
        const b = rng.int(1, 6);
        const equivalent = rng.pick([true, false]);
        const right = `${a} · x + ${equivalent ? a * b : a + b}`;
        const q = equivalent ? a * b : a + b;
        const x = rng.int(0, 5);
        if (level === 1)
          return task(
            level,
            `Vergleiche ${a} · (x + ${b}) und ${right}. Berechne beide Werte für x = ${x}. Sind die Terme äquivalent?`,
            "",
            [
              num("Linker Wert =", a * (x + b), "", 0),
              num("Rechter Wert =", a * x + q, "", 0),
              yesNo("Äquivalent?", a * b === q),
            ],
            "Rechne die Werte aus und forme den linken Term um.",
            `${a} · (x + ${b}) = ${a} · x + ${a * b}.`,
            `${a * (x + b)} und ${a * x + q}; ${a * b === q ? "äquivalent" : "nicht äquivalent"}.`,
            { a, b, x },
          );
        const s = rng.int(2, 5);
        const t = rng.int(2, 6);
        // s · x + t and (s + 1) · x + (t − k) meet exactly at x = k.
        const k = rng.int(1, t - 1);
        return task(
          level,
          "",
          `Max sagt: „${s} · x + ${t} und ${s + 1} · x + ${fmt(t - k)} sind äquivalent, denn für x = ${k} kommt dasselbe heraus.“ Berechne den Wert beider Terme für x = 0 und entscheide.`,
          [
            num("Erster Term =", t, "", 0),
            num("Zweiter Term =", t - k, "", 0),
            pick("Hat Max recht?", ["nein, ein Gegenbeispiel reicht", "ja, eine Übereinstimmung genügt"], 0),
          ],
          "Für Äquivalenz müssten die Werte für jede Belegung gleich sein.",
          `Für x = 0 ergeben sich ${t} und ${fmt(t - k)}.`,
          "Max hat nicht recht.",
          { s, t, k },
        );
      },
    },
  ],
});

const strategien = L(5, {
  id: "tg-5-gleichungen-strategien",
  title: "5.5 Gleichungen aufstellen und lösen",
  subtitle: "Probieren, Rückwärtsrechnen und Skizzieren",
  whyItMatters:
    "Viele Rätsel und Sachaufgaben lassen sich als Gleichung schreiben. Du kannst sie oft schon lösen, bevor du feste Umformungsregeln kennst.",
  explanationHtml: `<p>Eine <strong>Gleichung</strong> besteht aus zwei Termen mit einem Gleichheitszeichen dazwischen. Eine Zahl ist <strong>Lösung</strong>, wenn beim Einsetzen beide Seiten denselben Wert haben. Text und Gleichung kannst du ineinander übersetzen.</p><div class="example">„Das Dreifache einer Zahl, vermehrt um 4, ergibt 19.“ Gleichung: 3 · x + 4 = 19. <strong>Rückwärtsrechnen:</strong> 19 − 4 = 15, 15 : 3 = 5. <strong>Probe:</strong> 3 · 5 + 4 = 19, stimmt.</div><p>Strategien: geschicktes <strong>Probieren</strong>, <strong>Rückwärtsrechnen</strong>, eine <strong>Skizze</strong> oder das <strong>Zerlegen eines Textes</strong> in kleine Abschnitte. Beim Rückwärtsrechnen kehrst du die Rechenarten und ihre Reihenfolge um.</p><div class="merke"><strong>Merke:</strong> Mache immer die Probe in der Ausgangsgleichung. Eine Lösung muss beide Seiten gleich machen.</div>`,
  formulas: [
    {
      name: "Rückwärtsrechnen",
      html: "a · x + b = c → x = (c − b) : a",
      quantities: "Umkehrrechnungen in umgekehrter Reihenfolge",
    },
  ],
  quiz: {
    question: "Welche Gleichung passt zu: „Die Hälfte einer Zahl, vermindert um 3, ergibt 5“?",
    options: ["x : 2 − 3 = 5", "(x − 3) : 2 = 5", "2 · x − 3 = 5"],
    correctIndex: 0,
    explanation: "Zuerst wird die Zahl halbiert, danach 3 abgezogen. Die Reihenfolge im Text ist entscheidend.",
  },
  lab: lab(
    "equation-try",
    "Probieren mit Balken",
    "Stelle die Gleichung ein und probiere Werte für x. Die Balken zeigen, ob links zu wenig oder zu viel ist.",
    [
      r("a", "a", 1, 5, 2),
      r("b", "b", 0, 9, 1),
      r("c", "c", 1, 30, 9),
      r("x", "Probezahl x", 0, 10, 1),
    ],
    [
      o("left", "Linke Seite", (v) => v.a * v.x + v.b, "", 0),
      o("back", "Rückwärts gerechnet", (v) => `(${v.c} − ${v.b}) : ${v.a} = ${fmt((v.c - v.b) / v.a)}`),
    ],
    [
      {
        id: "neunzehn",
        text: "Löse 3 · x + 4 = 19 durch Probieren.",
        check: (v) => v.a === 3 && v.b === 4 && v.c === 19 && v.x === 5,
      },
      {
        id: "fuenfzehn",
        text: "Löse 2 · x + 7 = 15.",
        check: (v) => v.a === 2 && v.b === 7 && v.c === 15 && v.x === 4,
      },
      {
        id: "dreissig",
        text: "Löse 4 · x + 6 = 30.",
        check: (v) => v.a === 4 && v.b === 6 && v.c === 30 && v.x === 6,
      },
    ],
  ),
  exercises: [
    {
      id: "uebersetzen",
      make: (rng, level) => {
        const a = rng.int(2, 6);
        const x = rng.int(2, 15);
        const b = rng.int(1, 20);
        const c0 = a * x + b;
        const name: Record<number, string> = { 2: "Das Doppelte", 3: "Das Dreifache", 4: "Das Vierfache", 5: "Das Fünffache", 6: "Das Sechsfache" };
        if (level === 1)
          return task(
            level,
            `${name[a]} einer Zahl, vermehrt um ${b}, ergibt ${c0}. Welche Zahl ist es?`,
            "",
            [num("x =", x, "", 0)],
            `Gleichung ${a} · x + ${b} = ${c0}. Rechne rückwärts.`,
            `${c0} − ${b} = ${c0 - b}; ${c0 - b} : ${a} = ${x}.`,
            `x = ${x}.`,
            { a, b, x },
          );
        return task(
          level,
          "",
          `Lena denkt sich eine Zahl, nimmt sie mal ${a} und addiert ${b}. Sie erhält ${c0}. Ihr Bruder rechnet (${c0} : ${a}) − ${b}. Warum ist das falsch? Gib Lenas Zahl an und das Ergebnis, das der Bruder ausrechnet (auf zwei Stellen gerundet).`,
          [
            num("Lenas Zahl =", x, "", 0),
            num("Rechnung des Bruders =", clean(c0 / a - b), "", 2),
            pick("Der Fehler", ["Die Reihenfolge wurde nicht umgekehrt.", "Er hat falsch geteilt.", "Es gibt keine Lösung."], 0),
          ],
          "Beim Rückwärtsrechnen kehrst du auch die Reihenfolge um.",
          `Richtig: (${c0} − ${b}) : ${a} = ${x}.`,
          `${x}; der Bruder rechnet ${fmt(clean(c0 / a - b))}.`,
          { a, b, x },
        );
      },
    },
    {
      id: "probe",
      make: (rng, level) => {
        const a = rng.int(2, 7);
        const x = rng.int(1, 12);
        const b = rng.int(1, 15);
        const test = rng.pick([x, x + 1, x - 1]);
        const c0 = a * x + b;
        if (level === 1)
          return task(
            level,
            `Prüfe durch Einsetzen: Ist ${fmt(test)} eine Lösung von ${a} · x + ${b} = ${c0}?`,
            "",
            [num("Linke Seite =", a * test + b, "", 0), yesNo("Lösung?", test === x)],
            "Setze die Zahl ein und vergleiche beide Seiten.",
            `${a} · ${paren(test)} + ${b} = ${a * test + b}.`,
            test === x ? "Ja, das ist die Lösung." : "Nein, keine Lösung.",
            { a, b, x, test },
          );
        const age = rng.int(9, 14);
        const parentGap = rng.int(24, 34);
        return task(
          level,
          "",
          `Mira ist ${age} Jahre alt. Ihre Mutter ist ${parentGap} Jahre älter. In wie vielen Jahren ist die Mutter genau doppelt so alt wie Mira? Teste mit einer Gleichung: 2 · (${age} + x) = ${age + parentGap} + x.`,
          [num("x =", parentGap - age, "Jahre", 0), num("Alter von Mira dann =", parentGap, "Jahre", 0)],
          "Zerlege den Text oder probiere verschiedene Werte für x.",
          `Der Altersunterschied bleibt ${parentGap}. Doppelt so alt bedeutet: Mira ist dann ${parentGap}.`,
          `In ${parentGap - age} Jahren; Mira ist dann ${parentGap}.`,
          { age, parentGap },
        );
      },
    },
  ],
});

const SET_LABELS = ["ℕ", "ℤ", "ℚ"];
const ratioText = (n: number, d: number) => {
  const [z, m] = reduce(n, d);
  const sign = z < 0 ? "−" : "";
  return m === 1 ? `${sign}${Math.abs(z)}` : `${sign}${Math.abs(z)}/${m}`;
};
/** The solution set of x + k = c (mode 0) or k · x = c (mode 1) in the chosen set. */
function solutionSet(mode: number, k: number, c0: number, g: number): string {
  const x = mode === 0 ? c0 - k : c0 / k;
  const text = mode === 0 ? ratioText(c0 - k, 1) : ratioText(c0, k);
  return inSet(x, g) ? `L = {${text}}` : "L = { }";
}

const umformungen = L(6, {
  id: "tg-6-aequivalenzumformungen",
  title: "5.6 Äquivalenzumformungen",
  subtitle: "Gleichungen a · x = c und x + b = c lösen",
  whyItMatters:
    "Eine Waage bleibt im Gleichgewicht, wenn du auf beiden Seiten dasselbe machst. Dieses Prinzip löst Gleichungen sicher und ohne Probieren.",
  explanationHtml: `<p>Eine <strong>Äquivalenzumformung</strong> ändert eine Gleichung, aber nicht ihre Lösungen: Du addierst oder subtrahierst auf beiden Seiten dieselbe Zahl, oder du multiplizierst oder dividierst beide Seiten mit derselben Zahl ungleich 0.</p><div class="example">x + 5 = 12 | − 5 ergibt x = 7. 3 · x = −12 | : 3 ergibt x = −4.</div><p>Die <strong>Lösungsmenge</strong> L enthält die Lösungen, die in der <strong>Grundmenge</strong> liegen. 2 · x = 5 hat die Lösung x = 2,5. Bei G = ℚ ist L = {2,5}, bei G = ℤ dagegen L = { }, die Lösungsmenge ist also leer.</p><div class="merke"><strong>Merke:</strong> Umkehrrechnung auf beiden Seiten: Aus + wird −, aus · wird :. Prüfe am Schluss, ob die Zahl in G liegt.</div>`,
  formulas: [
    {
      name: "Addition",
      html: "x + b = c | − b → x = c − b",
      quantities: "auf beiden Seiten b abziehen",
    },
    {
      name: "Multiplikation",
      html: "a · x = c | : a → x = c : a",
      quantities: "a ≠ 0; auf beiden Seiten durch a teilen",
    },
  ],
  quiz: {
    question: "Wie lautet die Lösungsmenge von 2 · x = 7 mit G = ℕ?",
    options: ["L = { }", "L = {3,5}", "L = {3}"],
    correctIndex: 0,
    explanation: "x = 3,5 ist keine natürliche Zahl, also ist die Lösungsmenge leer.",
  },
  lab: lab(
    "balance",
    "Die Waage",
    "Wähle Gleichung und Grundmenge. Stelle die Zahl ein, die du auf beiden Seiten abziehst oder durch die du teilst, bis x allein steht.",
    [
      c("mode", "Gleichungstyp", ["x + k = c", "k · x = c"]),
      c("g", "Grundmenge", SET_LABELS),
      r("k", "k", 1, 9, 3),
      r("c", "c", -12, 24, 8),
      r("d", "Umformen mit", 0, 9, 0),
    ],
    [
      o("setName", "Grundmenge", (v) => SET_LABELS[v.g]),
      o("start", "Gleichung", (v) =>
        v.mode === 0 ? `x + ${v.k} = ${fmt(v.c)}` : `${v.k} · x = ${fmt(v.c)}`,
      ),
      o("leftNow", "Linke Seite", (v) => {
        if (v.mode === 0) {
          const rest = v.k - v.d;
          return rest === 0 ? "x" : rest > 0 ? `x + ${rest}` : `x − ${-rest}`;
        }
        if (v.d === 0) return `${v.k} · x`;
        const coefficient = ratioText(v.k, v.d);
        return coefficient === "1" ? "x" : `${coefficient} · x`;
      }),
      o("rightNow", "Rechte Seite", (v) => {
        if (v.mode === 0) return fmt(v.c - v.d);
        return v.d === 0 ? fmt(v.c) : ratioText(v.c, v.d);
      }),
      o("step", "Schritt", (v) => {
        if (v.d === 0) return "Noch keine Umformung.";
        return v.mode === 0 ? `Auf beiden Seiten − ${v.d}.` : `Beide Seiten : ${v.d}.`;
      }),
      o("solution", "Lösungsmenge", (v) => solutionSet(v.mode, v.k, v.c, v.g)),
    ],
    [
      {
        id: "plus",
        text: "Löse x + 5 = 12 mit G = ℕ bis x allein steht.",
        check: (v) => v.mode === 0 && v.k === 5 && v.c === 12 && v.g === 0 && v.d === 5,
      },
      {
        id: "mal",
        text: "Löse 3 · x = −12 mit G = ℤ bis x allein steht.",
        check: (v) => v.mode === 1 && v.k === 3 && v.c === -12 && v.g === 1 && v.d === 3,
      },
      {
        id: "leer",
        text: "Zeige: 2 · x = 5 hat mit G = ℤ die leere Lösungsmenge.",
        check: (v) => v.mode === 1 && v.k === 2 && v.c === 5 && v.g === 1 && v.d === 2,
      },
    ],
  ),
  exercises: [
    {
      id: "plus",
      make: (rng, level) => {
        const b = rng.int(2, 25);
        const x = rng.int(2, 30);
        if (level === 1)
          return task(
            level,
            `Löse die Gleichung x + ${b} = ${x + b} mit G = ℕ.`,
            "",
            [
              num("x =", x, "", 0, {
                slips: [{ value: x + 2 * b, hint: "Hier muss abgezogen werden: Umkehrrechnung von + ist −." }],
              }),
            ],
            `Auf beiden Seiten ${b} abziehen.`,
            `x + ${b} = ${x + b} | − ${b}.`,
            `L = {${x}}.`,
            { b, x },
          );
        const small = rng.int(2, 20);
        const big = small + rng.int(3, 20);
        const decimal = rng.pick([0.5, 1.5, 2.25, 3.75]);
        const useSet = rng.int(0, 1);
        const right = useSet === 0 ? small : clean(small + decimal);
        const value = clean(right - big);
        const options = useSet === 0
          ? [`L = {${fmt(value)}}`, "L = { }", `L = {${fmt(-value)}}`]
          : ["L = { }", `L = {${fmt(value)}}`, `L = {${fmt(-value)}}`];
        return task(
          level,
          "",
          `Löse x + ${big} = ${fmt(right)} mit G = ℤ. Gib die Lösungsmenge an.`,
          [pick("Lösungsmenge", options, 0)],
          "Erst umformen, dann prüfen, ob die Zahl in G liegt.",
          `x = ${fmt(right)} − ${big} = ${fmt(value)}.`,
          `${options[0]}.`,
          { big, right },
        );
      },
    },
    {
      id: "mal",
      make: (rng, level) => {
        const a = rng.int(2, 9);
        const x = rng.int(1, 12) * (level === 1 ? 1 : rng.sign());
        if (level === 1)
          return task(
            level,
            `Löse die Gleichung ${a} · x = ${a * x} mit G = ℕ.`,
            "",
            [num("x =", x, "", 0)],
            `Beide Seiten durch ${a} teilen.`,
            `${a} · x = ${a * x} | : ${a}.`,
            `L = {${x}}.`,
            { a, x },
          );
        const fractional = rng.pick([true, false]);
        const c0 = fractional ? a * x + 1 : a * x;
        const exact = c0 / a;
        const whole = Number.isInteger(exact);
        const value = ratioText(c0, a);
        const setInt = whole ? `L = {${value}}` : "L = { }";
        const distractor = `L = {${ratioText(a, c0 === 0 ? 1 : c0)}}`;
        const options = [setInt, whole ? "L = { }" : `L = {${value}}`, distractor];
        return task(
          level,
          "",
          `Löse ${a} · x = ${fmt(c0)} mit G = ℤ. Gib die Lösungsmenge an und notiere die Lösung über ℚ als Zahl.`,
          [
            pick("Lösungsmenge über ℤ", [...new Set(options)], 0),
            num("Lösung über ℚ =", exact, "", 3),
          ],
          "Teile durch den Faktor. In ℤ zählt die Lösung nur, wenn sie ganz ist.",
          `x = ${fmt(c0)} : ${a} = ${value}.`,
          `${setInt}; über ℚ ist x = ${value}.`,
          { a, c0 },
        );
      },
    },
  ],
});

const sachaufgaben = L(7, {
  id: "tg-7-sachaufgaben",
  title: "5.7 Sachaufgaben mit Gleichungen",
  subtitle: "Aufstellen, lösen, bewerten",
  whyItMatters:
    "Eine Gleichung ist nur ein Werkzeug. Am Ende musst du prüfen, ob das Ergebnis zur Situation passt: 6,3 Karten lassen sich nicht kaufen.",
  explanationHtml: `<p>Bei Sachaufgaben gehst du so vor: Gesuchte Größe als Variable festlegen, Grundmenge aus der Sache überlegen, Gleichung aufstellen, lösen, Probe machen, Ergebnis <strong>bewerten</strong> und einen Antwortsatz schreiben.</p><div class="example">Für einen Kinobesuch zahlt eine Gruppe insgesamt 30 €: 6 € Gebühr und x Karten zu 4 €. Gleichung: 4 · x + 6 = 30. Rückwärts: 24 : 4 = 6. Probe: 4 · 6 + 6 = 30. Antwort: Die Gruppe hat 6 Karten gekauft.</div><p>Wäre der Gesamtbetrag 31 €, ergäbe sich x = 6,25. Das passt nicht zur Sache, denn man kann nur ganze Karten kaufen. Dann stimmt etwas an den Angaben nicht.</p><div class="merke"><strong>Merke:</strong> Ein rechnerisch richtiges Ergebnis muss nicht sinnvoll sein. Vergleiche es mit der Grundmenge, die aus der Sache folgt.</div>`,
  formulas: [
    {
      name: "Vorgehen",
      html: "Variable → Gleichung → Lösung → Probe → Bewertung",
      quantities: "die Grundmenge folgt aus der Sache",
    },
  ],
  quiz: {
    question: "Eine Rechnung ergibt 7,5 Schüler. Was folgt daraus?",
    options: [
      "Das Ergebnis passt nicht zur Sache. Die Angaben oder die Rechnung sind zu prüfen.",
      "Es sind 8 Schüler, denn man rundet immer auf.",
      "Es sind 7 Schüler, denn man rundet immer ab.",
    ],
    correctIndex: 0,
    explanation: "Personen sind nur ganzzahlig. Das Ergebnis zeigt also einen Fehler oder unpassende Angaben.",
  },
  lab: lab(
    "word-equation",
    "Gesamtbetrag zerlegen",
    "Stelle Gesamtbetrag, Stückpreis und Grundbetrag ein. Prüfe, ob die Anzahl x zur Sache passt.",
    [
      r("T", "Gesamtbetrag in €", 12, 60, 20),
      r("p", "Stückpreis in €", 2, 6, 3),
      r("f", "Grundbetrag in €", 0, 12, 1),
    ],
    [
      o("x", "x", (v) => (v.T - v.f) / v.p, "", 2),
      o("xText", "x als Zahl", (v) => ratioText(v.T - v.f, v.p)),
      o("verdict", "Bewertung", (v) => {
        const x = (v.T - v.f) / v.p;
        return Number.isInteger(x) && x >= 0 ? "Eine ganze Anzahl: Das passt zur Sache." : "Keine ganze Anzahl: Das passt nicht zur Sache.";
      }),
    ],
    [
      {
        id: "acht",
        text: "Berechne 3 · x = 24 ohne Grundbetrag.",
        check: (v) => v.T === 24 && v.p === 3 && v.f === 0,
      },
      {
        id: "unpassend",
        text: "Zeige ein unpassendes Ergebnis: 25 € bei 3 € je Stück ohne Grundbetrag.",
        check: (v) => v.T === 25 && v.p === 3 && v.f === 0,
      },
      {
        id: "beispiel",
        text: "Stelle das Beispiel ein: 30 € insgesamt, 4 € je Karte, 6 € Gebühr.",
        check: (v) => v.T === 30 && v.p === 4 && v.f === 6,
      },
    ],
  ),
  exercises: [
    {
      id: "aufstellen",
      make: (rng, level) => {
        const p = rng.int(2, 9);
        const x = rng.int(3, 15);
        const f = rng.int(2, 15);
        if (level === 1)
          return task(
            level,
            `Hefte kosten ${p} € pro Stück. Du zahlst für x Hefte insgesamt ${p * x} €. Stelle die Gleichung ${p} · x = ${p * x} auf und löse sie. Wie viele Hefte sind es?`,
            "",
            [num("x =", x, "Hefte", 0)],
            "Teile beide Seiten durch den Preis pro Stück.",
            `${p * x} : ${p} = ${x}.`,
            `${x} Hefte.`,
            { p, x },
          );
        return task(
          level,
          "",
          `Ein Klassenausflug kostet insgesamt ${p * x + f} €: ${f} € Buchung und ${p} € je Kind. Stelle eine Gleichung auf. Wie viele Kinder fahren mit? Wie viel würde es kosten, wenn ${x + 2} Kinder mitführen?`,
          [num("Kinder =", x, "", 0), num("Kosten =", p * (x + 2) + f, "€", 0)],
          "Gleichung: p · x + Buchung = Gesamtpreis. Rechne rückwärts.",
          `${p} · x + ${f} = ${p * x + f}; ${p * x} : ${p} = ${x}.`,
          `${x} Kinder; ${p * (x + 2) + f} €.`,
          { p, x, f },
        );
      },
    },
    {
      id: "bewerten",
      make: (rng, level) => {
        const p = rng.pick([3, 4, 6, 8]);
        const x = rng.int(3, 12);
        const off = rng.int(0, 1);
        const total = p * x + off;
        const fits = off === 0;
        const quotient = roundSchool(total / p, 2);
        if (level === 1)
          return task(
            level,
            `Eintrittskarten kosten ${p} € pro Stück. Eine Gruppe bezahlt angeblich ${total} €. Löse ${p} · x = ${total}. Runde auf zwei Stellen. Passt das Ergebnis zur Sache?`,
            "",
            [num("x =", quotient, "", 2), yesNo("Passt es zur Sache?", fits)],
            "Karten gibt es nur als ganze Anzahl.",
            `${total} : ${p} ≈ ${fmt(quotient)}.`,
            fits ? `${x} Karten, das passt.` : "Das passt nicht: Die Anzahl ist nicht ganz.",
            { p, total },
          );
        const side = rng.int(3, 12);
        const perimeter = 4 * side + off * 2;
        return task(
          level,
          "",
          `Ein quadratisches Beet soll mit ${perimeter} m Zaun umgeben werden. Stelle eine Gleichung für die Seitenlänge auf und löse sie. Wie groß ist die Fläche des Beets? Ist auch eine Seitenlänge mit Komma sinnvoll?`,
          [
            num("Seite =", perimeter / 4, "m", 2),
            num("Fläche =", (perimeter / 4) ** 2, "m²", 2),
            pick("Bewertung", ["Ja, Längen dürfen auch Dezimalzahlen sein.", "Nein, Längen müssen ganzzahlig sein."], 0),
          ],
          "4 · x = Umfang. Bei Längen ist ℚ als Grundmenge sinnvoll, anders als bei Anzahlen.",
          `4 · x = ${perimeter}; x = ${fmt(perimeter / 4)}.`,
          `${fmt(perimeter / 4)} m und ${fmt((perimeter / 4) ** 2)} m².`,
          { perimeter },
        );
      },
    },
  ],
});

export const STAGE_TERME_GLEICHUNGEN = makeStage(
  5,
  "Terme und Gleichungen",
  "Zusammenhänge mit Variablen beschreiben und Gleichungen lösen",
  "#be185d",
  "⚖️",
  [termeAufstellen, darstellungen, termwerte, aequivalenz, strategien, umformungen, sachaufgaben],
);
