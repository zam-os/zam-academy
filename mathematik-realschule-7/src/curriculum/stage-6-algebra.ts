import { fmt, linear, paren, term } from "../exercises/format";
import { flipRelation, linearSolution } from "../models";
import { numberField as num, choiceField as pick } from "./helpers";
import {
  lab,
  range as r,
  choice as c,
  output as o,
  makeLesson as lesson,
  makeStage,
  task,
} from "./builders";
const L = (step: number, content: Parameters<typeof lesson>[3]) =>
  lesson(6, step, [6, 4], content);
export const RELATIONS = ["<", "≤", ">", "≥"];
export const compare = (left: number, right: number, relation: number) =>
  [left < right, left <= right, left > right, left >= right][relation];

const terme = L(1, {
  id: "al-1-terme",
  title: "6.1 Terme zusammenfassen",
  subtitle: "Gleichartige Summanden und Potenzgesetze",
  whyItMatters:
    "Ein übersichtlicher Term zeigt, ob zwei Rechenwege dasselbe beschreiben. Dazu musst du Addition und Multiplikation auseinanderhalten.",
  explanationHtml: `<p>Gleichartige Summanden haben denselben Variablenteil, etwa 3x und 5x oder 2x² und −x². Addiere ihre Koeffizienten: 3x + 5x = 8x. Dagegen kann x + x² nicht zu einem einzigen Potenzterm zusammengefasst werden.</p><p>Beim Multiplizieren gleicher Basen addierst du die Exponenten: 2 · x · x² = 2x³. Beim Dividieren subtrahierst du sie: 5x² : 2x = 2,5x, dabei x ≠ 0. Diese Einschränkung bleibt nach dem Kürzen bestehen. Bei einer Klammer multiplizierst du jeden Summanden: 3(x + 2) = 3x + 6.</p><div class="example">4x − 2x + 3 + 5 = 2x + 8. Für x = 3 liefern beide Terme 14. Eine einzelne Probe kann einen Fehler entdecken; Äquivalenz für alle erlaubten x begründest du mit Rechengesetzen.</div><div class="merke"><strong>Merke:</strong> Summen: nur Gleichartiges zusammenfassen. Produkte: Faktoren und Potenzen getrennt ordnen. Beim Kürzen darf der gekürzte Faktor nicht 0 sein.</div>`,
  formulas: [
    {
      name: "Gleichartige Summanden",
      html: "ax + bx = (a + b)x",
      quantities: "gleicher Variablenteil",
    },
    {
      name: "Potenzen im Produkt",
      html: "ax<sup>m</sup> · bx<sup>n</sup> = abx<sup>m+n</sup>",
      quantities: "bei Division zusätzlich x ≠ 0",
    },
  ],
  quiz: {
    question: "Wie vereinfachst du 2 · x · x²?",
    options: ["2x³", "2x²", "3x²"],
    correctIndex: 0,
    explanation:
      "Die Koeffizienten werden multipliziert, die Exponenten derselben Basis addiert: 1 + 2 = 3.",
  },
  lab: lab(
    "term",
    "Term und Gegenprobe",
    "Wähle Summe, Produkt oder Klammer und verändere x. Vergleiche Originalterm und vereinfachten Term.",
    [
      r("a", "Koeffizient a", -3, 3, 2),
      r("b", "Zahl b", -3, 3, 3),
      r("x", "Wert von x", -3, 3, 1),
      c("mode", "Termform", ["ax + bx", "ax · bx", "a(x + b)"], 0),
    ],
    [
      o("original", "Originalterm", (v) =>
        v.mode === 0
          ? v.a * v.x + v.b * v.x
          : v.mode === 1
            ? v.a * v.x * (v.b * v.x)
            : v.a * (v.x + v.b),
      ),
      o("simple", "Vereinfachter Term", (v) =>
        v.mode === 0
          ? term(v.a + v.b, "x", true) || "0"
          : v.mode === 1
            ? term(v.a * v.b, "x²", true) || "0"
            : linear(v.a, v.a * v.b),
      ),
      o("check", "Wert nach Vereinfachung", (v) =>
        v.mode === 0
          ? (v.a + v.b) * v.x
          : v.mode === 1
            ? v.a * v.b * v.x * v.x
            : v.a * v.x + v.a * v.b,
      ),
    ],
    [
      {
        id: "null",
        text: "Lasse in einer Summe 3x und −3x bei x = 2 verschwinden.",
        check: (v) => v.mode === 0 && v.a === 3 && v.b === -3 && v.x === 2,
      },
      {
        id: "produkt",
        text: "Prüfe (2x) · (3x) bei x = 2.",
        check: (v) => v.mode === 1 && v.a === 2 && v.b === 3 && v.x === 2,
      },
      {
        id: "klammer",
        text: "Prüfe −2(x + 3) bei x = 1.",
        check: (v) => v.mode === 2 && v.a === -2 && v.b === 3 && v.x === 1,
      },
    ],
  ),
  exercises: [
    {
      id: "summe-klammer",
      make: (rng, level) => {
        const a = rng.int(2, 7),
          b = rng.int(1, 5),
          k = rng.int(2, 5),
          x = rng.int(-3, 4);
        return task(
          level,
          `Fasse ${a}x + ${b}x zusammen. Gib den Koeffizienten und den Wert bei x = ${fmt(x)} an.`,
          `Vereinfache ${k}(x + ${b}) + ${a}x. Gib den x-Koeffizienten und den konstanten Summanden an; prüfe den Wert bei x = ${fmt(x)}.`,
          [
            num("x-Koeffizient =", level === 1 ? a + b : k + a, "", 0),
            ...(level === 2 ? [num("Konstante =", k * b, "", 0)] : []),
            num(
              "Termwert =",
              level === 1 ? (a + b) * x : (k + a) * x + k * b,
              "",
              0,
            ),
          ],
          "Nur Koeffizienten gleichartiger Summanden addieren; Klammern zuerst auflösen.",
          level === 1
            ? `(${a} + ${b})x = ${a + b}x.`
            : `${k}(x + ${b}) = ${k}x + ${k * b}; mit ${a}x ergibt das ${k + a}x + ${k * b}.`,
          `Termwert ${fmt(level === 1 ? (a + b) * x : (k + a) * x + k * b)}.`,
          { a, b, k, x },
        );
      },
    },
    {
      id: "produkt-quotient",
      make: (rng, level) => {
        const a = rng.int(2, 6),
          b = rng.int(2, 4),
          m = rng.int(1, 3),
          n = rng.int(1, 3);
        return task(
          level,
          `Vereinfache ${a}x<sup>${m}</sup> · ${b}x<sup>${n}</sup>. Gib Koeffizient und Exponent an.`,
          `Vereinfache (${a * b}x<sup>${m + n}</sup>) : (${b}x<sup>${n}</sup>). Gib Koeffizient und Exponent an und beachte die ursprüngliche Einschränkung.`,
          [
            num("Koeffizient =", level === 1 ? a * b : a, "", 0),
            num("Exponent =", level === 1 ? m + n : m, "", 0),
            ...(level === 2
              ? [
                  pick(
                    "Erlaubte x",
                    [
                      "x ≠ 0",
                      "alle rationalen Zahlen ohne Einschränkung",
                      "nur x = 0",
                    ],
                    0,
                  ),
                ]
              : []),
          ],
          "Produkte: Koeffizienten multiplizieren, Exponenten addieren.",
          level === 1
            ? `Koeffizient ${a} · ${b}; Exponent ${m} + ${n}.`
            : `Koeffizient ${a * b} : ${b}; Exponent ${m + n} − ${n}. Der Nenner verbietet x = 0.`,
          level === 1 ? `${a * b}x hoch ${m + n}.` : `${a}x hoch ${m}; x ≠ 0.`,
          { a, b, m, n },
        );
      },
    },
  ],
});

const gleichungen = L(2, {
  id: "al-2-gleichungen",
  title: "6.2 Lineare Gleichungen lösen",
  subtitle: "Beide Seiten ordnen und dieselbe Umformung ausführen",
  whyItMatters:
    "Eine unbekannte Zahl lässt sich systematisch bestimmen. Jeder Schritt muss dieselben Lösungen wie die vorige Gleichung behalten.",
  explanationHtml: `<p>Äquivalenzumformungen verändern die Lösungsmenge nicht: Du darfst auf beiden Seiten dieselbe Zahl oder denselben Term addieren bzw. subtrahieren und durch dieselbe Zahl ungleich 0 teilen. Fasse beide Seiten zuerst zusammen, bringe dann die x-Terme auf eine Seite und die Zahlen auf die andere.</p><div class="example">3x + 2 + x = 2x + 10. Zusammenfassen: 4x + 2 = 2x + 10. Auf beiden Seiten −2x: 2x + 2 = 10. Auf beiden Seiten −2: 2x = 8. Durch 2: x = 4. Probe in der ursprünglichen Gleichung: links 18, rechts 18.</div><p>Fällt x vollständig weg, prüfe die verbleibende Aussage. 0x = 0 ist für alle rationalen x wahr; 0x = 5 für keines. Deshalb darfst du nicht durch einen Koeffizienten 0 teilen.</p><div class="merke"><strong>Merke:</strong> Fasse zusammen, forme auf beiden Seiten gleich um und mache die Probe in der Ausgangsgleichung. Schreibe die Lösungsmenge, etwa L = {4}.</div>`,
  formulas: [
    {
      name: "Lineare Gleichung",
      html: "ax + b = c ⇒ x = (c − b) : a",
      quantities: "a ≠ 0; Grundmenge ℚ",
    },
  ],
  quiz: {
    question: "Was folgt aus 0x = 5?",
    options: ["Keine Lösung.", "x = 0.", "Jede rationale Zahl ist Lösung."],
    correctIndex: 0,
    explanation: "Die linke Seite bleibt immer 0 und kann nicht 5 sein.",
  },
  lab: lab(
    "equation",
    "Beide Seiten vergleichen",
    "Ziehe die Probezahl x. Die Anzeige vergleicht ax + b mit dx + c. Verändere die Koeffizienten und untersuche auch Fälle ohne eindeutige Lösung.",
    [
      r("a", "a links", -4, 4, 2),
      r("b", "b links", -5, 5, 1),
      r("d", "d rechts", -3, 3, 0),
      r("c", "c rechts", -8, 8, 5),
      r("x", "Probezahl x", -5, 5, 1),
    ],
    [
      o("left", "Linke Seite", (v) => v.a * v.x + v.b),
      o("right", "Rechte Seite", (v) => v.d * v.x + v.c),
      o("solution", "Lösung", (v) => {
        const s = linearSolution(v.a, v.b, v.c, v.d);
        return typeof s === "number"
          ? fmt(s)
          : s === "alle"
            ? "L = ℚ"
            : "L = ∅";
      }),
    ],
    [
      {
        id: "positiv",
        text: "Löse 2x + 1 = 7 und stelle die Probezahl ein (d = 0).",
        check: (v) =>
          v.a === 2 && v.b === 1 && v.d === 0 && v.c === 7 && v.x === 3,
      },
      {
        id: "negativ",
        text: "Löse −2x + 3 = 7 mit d = 0.",
        check: (v) =>
          v.a === -2 && v.b === 3 && v.d === 0 && v.c === 7 && v.x === -2,
      },
      {
        id: "beidseitig",
        text: "Löse 3x + 1 = x + 5 und prüfe x = 2.",
        check: (v) =>
          v.a === 3 && v.b === 1 && v.d === 1 && v.c === 5 && v.x === 2,
      },
    ],
  ),
  exercises: [
    {
      id: "ax-plus-b",
      make: (rng, level) => {
        const a = rng.pick([-4, -3, -2, 2, 3, 4]),
          b = rng.int(-6, 6),
          x = rng.int(-4, 5),
          c = a * x + b,
          d = rng.int(1, 3);
        return task(
          level,
          `Bestimme die Lösung der Gleichung ${linear(a, b)} = ${fmt(c)} in ℚ.`,
          `Fasse zusammen und löse: ${linear(a + d, b)} = ${linear(d, c)}. Gib auch den gemeinsamen Wert beider Seiten bei der Lösung an.`,
          [
            num("x =", x, "", 0, {
              slips: [
                {
                  value: (c + b) / a,
                  hint: "Du hast b addiert. Ziehe b auf beiden Seiten ab, bevor du durch den x-Koeffizienten teilst.",
                },
              ],
            }),
            ...(level === 2
              ? [num("gemeinsamer Wert =", d * x + c, "", 0)]
              : []),
          ],
          "Zuerst b subtrahieren, dann durch a teilen.",
          `${level === 2 ? `Auf beiden Seiten ${term(d, "x", true)} subtrahieren. ` : ""}${term(a, "x", true)} = ${fmt(c)} − ${paren(b)} = ${fmt(a * x)}; durch ${fmt(a)} teilen.`,
          `L = {${fmt(x)}}.${level === 2 ? ` Beide Seiten ergeben ${d} · ${paren(x)}${term(c, "", false)} = ${fmt(d * x + c)}.` : ""}`,
          { a, b, c, d, x },
        );
      },
    },
    {
      id: "sonderfaelle",
      make: (rng, level) => {
        const a = rng.int(2, 6),
          b = rng.int(1, 5),
          same = rng.pick([true, false]),
          c = b + (same ? 0 : 2);
        return task(
          level,
          `Bestimme die Lösungsmenge in ℚ: ${a}x + ${b} = ${a}x + ${c}.`,
          `Ein Schüler löst ${a}(x + ${b}) = ${a}x + ${a * c} durch Teilen durch 0, nachdem er x weggekürzt hat. Bestimme die richtige Lösungsmenge.`,
          [pick("Lösungsmenge", ["L = ℚ", "L = ∅", "L = {0}"], same ? 0 : 1)],
          "Die x-Terme auf beiden Seiten subtrahieren und die verbleibende Aussage prüfen.",
          `Nach Zusammenfassen und Subtrahieren bleibt ${level === 1 ? b : a * b} = ${level === 1 ? c : a * c}. Diese Aussage ist ${same ? "immer wahr" : "falsch"}; durch 0 wird nicht geteilt.`,
          `${same ? "L = ℚ" : "L = ∅"}.`,
          { a, b, c, same: Number(same) },
        );
      },
    },
  ],
});

const ungleichungen = L(3, {
  id: "al-3-ungleichungen",
  title: "6.3 Ungleichungen und Lösungsintervalle",
  subtitle: "Bei negativer Division kehrt sich das Zeichen um",
  whyItMatters:
    "Oft ist nicht genau ein Wert erlaubt, sondern ein ganzer Bereich. Das Vergleichszeichen und die Randpunkte entscheiden darüber.",
  explanationHtml: `<p>Beim Addieren oder Subtrahieren auf beiden Seiten bleibt das Vergleichszeichen gleich. Beim Multiplizieren oder Dividieren mit einer <strong>negativen</strong> Zahl kehrt es sich um. Zum Beispiel folgt aus 2 &lt; 5 nach Multiplikation mit −1: −2 &gt; −5.</p><div class="example">−2x + 3 ≤ 9. Auf beiden Seiten −3: −2x ≤ 6. Durch −2 teilen und Zeichen umkehren: x ≥ −3. Mengenschreibweise: L = {x ∈ ℚ | x ≥ −3}. Intervallschreibweise über ℚ: L = [−3; ∞[ ∩ ℚ.</div><p>≤ und ≥ schließen die Grenze ein: gefüllter Punkt. &lt; und &gt; schließen sie aus: offener Punkt. Für x &lt; 4 gilt L = ]−∞; 4[ ∩ ℚ. ∞ ist keine Zahl und wird nie eingeschlossen.</p><div class="merke"><strong>Merke:</strong> Negative Multiplikation oder Division dreht das Zeichen. Unterscheide Grenze, Richtung und Zugehörigkeit des Randpunkts.</div>`,
  formulas: [
    {
      name: "Negative Division",
      html: "a &lt; b ⇒ −a &gt; −b",
      quantities: "gilt entsprechend für ≤, ≥ und >",
    },
    {
      name: "Lösungsmenge",
      html: "x ≥ k ⇔ [k; ∞[ ∩ ℚ",
      quantities: "Grundmenge ℚ; Rand eingeschlossen",
    },
  ],
  quiz: {
    question: "Was folgt aus −3x < 6?",
    options: ["x > −2", "x < −2", "x > 2"],
    correctIndex: 0,
    explanation:
      "Durch −3 teilen: 6 : (−3) = −2; das Zeichen dreht sich von < zu >.",
  },
  lab: lab(
    "inequality",
    "Lösungsbereich auf der Zahlengeraden",
    "Ziehe die Probezahl x. Ändere das Vorzeichen von a und achte auf Richtung und offenen oder geschlossenen Rand.",
    [
      r("a", "a", -4, 4, 2),
      r("b", "b", -4, 4, 1),
      r("c", "c", -8, 8, 5),
      c("relation", "Zeichen", RELATIONS, 0),
      r("x", "Probezahl x", -6, 6, 0),
    ],
    [
      o("bound", "Grenze / Sonderfall", (v) =>
        v.a === 0
          ? compare(v.b, v.c, v.relation)
            ? "alle rationalen Zahlen"
            : "keine Lösung"
          : fmt((v.c - v.b) / v.a),
      ),
      o("relation", "Zeichen für x", (v) =>
        v.a === 0
          ? "Sonderfall"
          : v.a < 0
            ? flipRelation(RELATIONS[v.relation])
            : RELATIONS[v.relation],
      ),
      o("true", "Probe erfüllt Ausgangsungleichung", (v) =>
        compare(v.a * v.x + v.b, v.c, v.relation) ? "ja" : "nein",
      ),
    ],
    [
      {
        id: "offen",
        text: "Stelle 2x + 1 < 5 ein und prüfe die ausgeschlossene Grenze x = 2.",
        check: (v) =>
          v.a === 2 && v.b === 1 && v.c === 5 && v.relation === 0 && v.x === 2,
      },
      {
        id: "negativ",
        text: "Stelle −2x + 1 ≤ 5 ein und prüfe die eingeschlossene Grenze x = −2.",
        check: (v) =>
          v.a === -2 &&
          v.b === 1 &&
          v.c === 5 &&
          v.relation === 1 &&
          v.x === -2,
      },
      {
        id: "rechts",
        text: "Stelle x − 2 ≥ 1 ein und prüfe x = 4.",
        check: (v) =>
          v.a === 1 && v.b === -2 && v.c === 1 && v.relation === 3 && v.x === 4,
      },
    ],
  ),
  exercises: [
    {
      id: "loesen-grenze",
      make: (rng, level) => {
        const a = rng.pick([-4, -2, 2, 3]),
          b = rng.int(-5, 5),
          bound = rng.int(-4, 4),
          c = a * bound + b,
          rel = rng.int(0, 3),
          flipped = a < 0 ? flipRelation(RELATIONS[rel]) : RELATIONS[rel],
          closed = rel === 1 || rel === 3;
        return task(
          level,
          `Löse ${linear(a, b)} ${RELATIONS[rel]} ${fmt(c)}. Gib Grenze und Vergleichszeichen für x an.`,
          `Eine Lösungsmenge wird aus ${linear(a, b)} ${RELATIONS[rel]} ${fmt(c)} ermittelt. Bestimme Grenze und Richtung; entscheide zusätzlich über den Randpunkt.`,
          [
            num("Grenze =", bound, "", 0),
            pick("Zeichen für x", RELATIONS, RELATIONS.indexOf(flipped)),
            ...(level === 2
              ? [pick("Rand gehört dazu?", ["ja", "nein"], closed ? 0 : 1)]
              : []),
          ],
          "b subtrahieren; bei Division durch negatives a Zeichen umkehren.",
          `Nach Subtraktion bleibt ${fmt(a)}x ${RELATIONS[rel]} ${fmt(a * bound)}. Durch ${fmt(a)} teilen${a < 0 ? " und das Zeichen umkehren" : ""}.`,
          `L = {x ∈ ℚ | x ${flipped} ${fmt(bound)}}.`,
          { a, b, c, bound, rel },
        );
      },
    },
    {
      id: "intervall",
      make: (rng, level) => {
        const k = rng.int(-5, 5),
          mode = rng.int(0, 3),
          rel = RELATIONS[mode],
          left = mode < 2,
          closed = mode === 1 || mode === 3,
          interval = left
            ? `]−∞; ${fmt(k)}${closed ? "]" : "["}`
            : `${closed ? "[" : "]"}${fmt(k)}; ∞[`;
        return task(
          level,
          `Die Lösungsmenge ist {x ∈ ℚ | x ${rel} ${fmt(k)}}. Wähle die zugehörige Intervallschreibweise.`,
          `Ein Intervall über ℚ ist ${interval} ∩ ℚ. Entscheide, welche Richtung markiert wird und ob die Grenze ${fmt(k)} dazugehört.`,
          level === 1
            ? [
                pick(
                  "Intervall (jeweils ∩ ℚ)",
                  [
                    interval,
                    left ? `[${fmt(k)}; ∞[` : `]−∞; ${fmt(k)}]`,
                    left
                      ? `]−∞; ${fmt(k)}${closed ? "[" : "]"}`
                      : `${closed ? "]" : "["}${fmt(k)}; ∞[`,
                  ],
                  0,
                ),
              ]
            : [
                pick(
                  "Richtung",
                  ["links der Grenze", "rechts der Grenze"],
                  left ? 0 : 1,
                ),
                pick("Grenze eingeschlossen?", ["ja", "nein"], closed ? 0 : 1),
              ],
          "Kleiner: nach links; größer: nach rechts. ≤ und ≥ schließen die Grenze ein.",
          `Das Zeichen ${rel} markiert ${left ? "links" : "rechts"}; der Rand ist ${closed ? "geschlossen" : "offen"}.`,
          `L = ${interval} ∩ ℚ.`,
          { k, mode },
        );
      },
    },
  ],
});

const sachgleichung = L(4, {
  id: "al-4-sachgleichungen",
  title: "6.4 Sachaufgaben als Gleichung",
  subtitle: "Unbekannte festlegen, Modell aufstellen, prüfen",
  whyItMatters:
    "Eine Gleichung ist ein Modell einer Situation. Die Lösung muss zu Einheiten, Anzahl und ursprünglicher Frage passen.",
  explanationHtml: `<p>Lege zuerst fest, was x bedeutet und welche Werte sachlich erlaubt sind. Übersetze dann den Zusammenhang in eine Gleichung. Löse sie, prüfe in der Situation und schreibe einen Antwortsatz.</p><div class="example">Eine Fahrt kostet 4 € Grundpreis und 2 € je Kilometer. Insgesamt zahlst du 18 €. Mit x als Kilometerzahl gilt 4 + 2x = 18. Also 2x = 14 und x = 7. Probe: 4 € + 2 € · 7 = 18 €. Antwort: Die Fahrt war 7 km lang.</div><p>Bei „das Dreifache einer Zahl, um 5 vermindert“ lautet der Term 3x − 5. Bei „das Dreifache der um 5 verminderten Zahl“ lautet er 3(x − 5). Die Reihenfolge im Text ist entscheidend.</p><div class="merke"><strong>Merke:</strong> Variable mit Bedeutung und Einheit → Gleichung → Lösung → sachliche Probe und Antwort.</div>`,
  formulas: [
    {
      name: "Kostenmodell",
      html: "Gesamtkosten = Grundpreis + Stückpreis · Anzahl",
      quantities: "passende Einheiten verwenden",
    },
  ],
  quiz: {
    question: "„Das Dreifache einer Zahl, danach 5 abziehen“ heißt …",
    options: ["3x − 5", "3(x − 5)", "x : 3 − 5"],
    correctIndex: 0,
    explanation:
      "Erst verdreifachen, danach 5 abziehen; die 5 wird nicht mit verdreifacht.",
  },
  lab: lab(
    "word-equation",
    "Preis und Anzahl",
    "Verschiebe die Anzahl und finde die Menge zum vorgegebenen Gesamtpreis. Die Grafik trennt Grundpreis und variable Kosten.",
    [
      r("fee", "Grundpreis", 0, 6, 2),
      r("price", "Preis je Stück", 1, 5, 3),
      r("n", "Anzahl", 0, 8, 2),
      r("budget", "Gesamtpreis", 4, 30, 14),
    ],
    [
      o("cost", "Berechneter Preis", (v) => v.fee + v.price * v.n, "€"),
      o("solution", "Rechnerische Anzahl", (v) => (v.budget - v.fee) / v.price),
      o("fit", "Preis getroffen", (v) =>
        v.fee + v.price * v.n === v.budget ? "ja" : "nein",
      ),
    ],
    [
      {
        id: "treffen",
        text: "Finde bei Grundpreis 2 €, Stückpreis 3 € und Gesamtpreis 14 € die Anzahl.",
        check: (v) =>
          v.fee === 2 && v.price === 3 && v.budget === 14 && v.n === 4,
      },
      {
        id: "zweiter",
        text: "Finde bei Grundpreis 4 €, Stückpreis 2 € und Gesamtpreis 18 € die Anzahl.",
        check: (v) =>
          v.fee === 4 && v.price === 2 && v.budget === 18 && v.n === 7,
      },
      {
        id: "kein-grundpreis",
        text: "Ohne Grundpreis, bei 5 € pro Stück: Erreiche 20 €.",
        check: (v) =>
          v.fee === 0 && v.price === 5 && v.budget === 20 && v.n === 4,
      },
    ],
  ),
  exercises: [
    {
      id: "preisgleichung",
      make: (rng, level) => {
        const fee = rng.int(2, 8),
          price = rng.int(2, 6),
          n = rng.int(3, 9),
          total = fee + price * n;
        return task(
          level,
          `Ein Verleih verlangt ${fee} € Grundpreis und ${price} € je Stunde. Du zahlst ${fmt(total)} €. Wie lange war die Mietdauer?`,
          `Anbieter A verlangt ${fee} € Grundpreis und ${price} € je Stunde, Anbieter B ${fee + n} € Grundpreis und ${price - 1} € je Stunde. Bei welcher Stundenzahl sind beide gleich teuer, und wie hoch ist der Preis?`,
          [
            num("Stundenzahl =", n, "h", 0),
            ...(level === 2 ? [num("Preis =", total, "€", 2)] : []),
          ],
          "Stelle Grundpreis + Stundenpreis · x = Gesamtpreis auf.",
          level === 1
            ? `${fee} + ${price}x = ${fmt(total)} ⇒ ${price}x = ${price * n}.`
            : `${fee} + ${price}x = ${fee + n} + ${price - 1}x ⇒ x = ${n}.`,
          `Dauer ${n} h; Preis ${fmt(total)} €.`,
          { fee, price, n, total },
        );
      },
    },
    {
      id: "zahlentext",
      make: (rng, level) => {
        const x = rng.int(2, 9),
          a = rng.int(2, 5),
          b = rng.int(2, 7),
          total = level === 1 ? a * x - b : a * (x + b);
        return task(
          level,
          `Das ${a}-Fache einer Zahl, danach um ${b} vermindert, ergibt ${fmt(total)}. Bestimme die Zahl.`,
          `Das ${a}-Fache der um ${b} vermehrten Zahl ergibt ${fmt(total)}. Stelle die passende Gleichung auf und bestimme die Zahl.`,
          [
            num("Zahl =", x, "", 0),
            ...(level === 2
              ? [
                  pick(
                    "Gleichung",
                    [
                      `${a}(x + ${b}) = ${fmt(total)}`,
                      `${a}x + ${b} = ${fmt(total)}`,
                      `x + ${a * b} = ${fmt(total)}`,
                    ],
                    0,
                  ),
                ]
              : []),
          ],
          "Reihenfolge beachten: erst vervielfachen, danach vermindern.",
          level === 1
            ? `${a}x − ${b} = ${fmt(total)}; zunächst ${b} addieren, dann durch ${a} teilen.`
            : `${a}(x + ${b}) = ${fmt(total)}; zunächst durch ${a} teilen, dann ${b} abziehen.`,
          `x = ${x}.`,
          { a, b, x, total },
        );
      },
    },
  ],
});

const sachungleichung = L(5, {
  id: "al-5-sachungleichungen",
  title: "6.5 Höchstens, mindestens und ganze Anzahlen",
  subtitle: "Eine rechnerische Grenze sachgerecht auswerten",
  whyItMatters:
    "Ein Budget erlaubt oft mehrere Mengen. Ganze Eintrittskarten oder Fahrzeuge kann man nicht durch beliebige Dezimalzahlen ersetzen.",
  explanationHtml: `<p>Höchstens bedeutet ≤, mindestens ≥, weniger als &lt;, mehr als &gt;. Bestimme nach dem Lösen die sachlich zulässigen Werte: Bei Stückzahlen ist x eine nichtnegative ganze Zahl.</p><div class="example">Ein Ausflug kostet 3 € Grundgebühr und 4 € pro Fahrt. Du hast höchstens 22 € zur Verfügung: 3 + 4x ≤ 22 ⇒ x ≤ 4,75. Erlaubt sind x ∈ {0; 1; 2; 3; 4}, also höchstens 4 Fahrten. 5 Fahrten kosteten 23 €.</div><p>Bei 3 + 4x &lt; 23 gilt x &lt; 5 und ebenfalls höchstens 4 Fahrten. Bei mindestens 23 € Umsatz gilt x ≥ 5. Eine strenge Grenze, die selbst ganzzahlig ist, darf nicht als zulässige Anzahl übernommen werden.</p><div class="merke"><strong>Merke:</strong> Erst die Ungleichung lösen, dann mit der Grundmenge der Situation schneiden. Prüfe die größte oder kleinste ganze Anzahl und ihren Nachbarn.</div>`,
  formulas: [
    {
      name: "Text übersetzen",
      html: "höchstens ≤ · mindestens ≥ · weniger als &lt; · mehr als &gt;",
      quantities: "bei Anzahlen zusätzlich x ∈ ℕ₀",
    },
  ],
  quiz: {
    question:
      "Eine ganzzahlige Anzahl erfüllt x < 5. Wie groß ist sie höchstens?",
    options: ["4", "5", "6"],
    correctIndex: 0,
    explanation:
      "5 ist als strenge Grenze ausgeschlossen; die größte kleinere ganze Zahl ist 4.",
  },
  lab: lab(
    "word-inequality",
    "Budgetgrenze testen",
    "Ziehe die Anzahl bis zum Rand. Vergleiche „höchstens“ und „weniger als“ bei genau getroffenem Budget.",
    [
      r("fee", "Grundgebühr", 0, 5, 2),
      r("price", "Preis pro Stück", 1, 5, 3),
      r("n", "Anzahl", 0, 9, 3),
      r("budget", "Budget", 5, 30, 20),
      c("strict", "Bedingung", ["höchstens Budget", "weniger als Budget"], 0),
    ],
    [
      o("cost", "Kosten", (v) => v.fee + v.price * v.n, "€"),
      o("max", "Größte erlaubte Anzahl", (v) =>
        Math.max(
          -1,
          v.strict === 0
            ? Math.floor((v.budget - v.fee) / v.price)
            : Math.ceil((v.budget - v.fee) / v.price) - 1,
        ),
      ),
      o("allowed", "Anzahl erlaubt", (v) =>
        (
          v.strict === 0
            ? v.fee + v.price * v.n <= v.budget
            : v.fee + v.price * v.n < v.budget
        )
          ? "ja"
          : "nein",
      ),
    ],
    [
      {
        id: "hoechstens",
        text: "Bei 2 € + 3 € pro Stück und Budget 20 €: Prüfe 6 Stück mit „höchstens“.",
        check: (v) =>
          v.fee === 2 &&
          v.price === 3 &&
          v.budget === 20 &&
          v.n === 6 &&
          v.strict === 0,
      },
      {
        id: "streng",
        text: "Prüfe dieselben 6 Stück mit „weniger als 20 €“.",
        check: (v) =>
          v.fee === 2 &&
          v.price === 3 &&
          v.budget === 20 &&
          v.n === 6 &&
          v.strict === 1,
      },
      {
        id: "nachbar",
        text: "Prüfe bei „weniger als 20 €“ die erlaubte Nachbarzahl 5 (Grundgebühr 2 €, Preis 3 €).",
        check: (v) =>
          v.fee === 2 &&
          v.price === 3 &&
          v.budget === 20 &&
          v.n === 5 &&
          v.strict === 1,
      },
    ],
  ),
  exercises: [
    {
      id: "maximale-anzahl",
      make: (rng, level) => {
        const fee = rng.int(1, 5),
          price = rng.int(2, 6),
          limit = rng.int(3, 8),
          budget = fee + price * limit + (level === 1 ? price / 2 : 0),
          answer = level === 1 ? limit : limit - 1;
        return task(
          level,
          `Du hast höchstens ${fmt(budget)} € für ${fee} € Grundgebühr und ${price} € je Fahrt. Wie viele ganze Fahrten sind maximal möglich?`,
          `Ein Gutschein verlangt Gesamtkosten weniger als ${budget} €. Grundgebühr ${fee} €, Preis je Fahrt ${price} €. Wie viele ganze Fahrten sind höchstens möglich, und was kostet eine weitere?`,
          [
            num("maximale Anzahl =", answer, "", 0),
            ...(level === 2
              ? [
                  num(
                    "Kosten einer weiteren Fahrtanzahl =",
                    fee + price * (answer + 1),
                    "€",
                    2,
                  ),
                ]
              : []),
          ],
          level === 1
            ? "Löse Grundgebühr + Preis · x ≤ Budget und runde die obere Grenze auf die größte erlaubte ganze Anzahl ab."
            : "Löse Grundgebühr + Preis · x < Budget. Die ganzzahlige Grenze selbst ist ausgeschlossen: Wähle die nächstkleinere ganze Anzahl und prüfe ihre Kosten.",
          `${fee} + ${price}x ${level === 1 ? "≤" : "<"} ${fmt(budget)} ⇒ x ${level === 1 ? "≤" : "<"} ${fmt((budget - fee) / price)}. ${level === 2 ? "Die ganzzahlige Grenze selbst ist ausgeschlossen." : "Nur ganze Fahrten sind erlaubt."}`,
          `Höchstens ${answer} Fahrten kosten ${fmt(fee + price * answer)} €. ${answer + 1} Fahrten kosten ${fmt(fee + price * (answer + 1))} €${level === 2 ? ` und treffen das ausgeschlossene Budget von ${fmt(budget)} € genau` : ` und überschreiten das Budget von ${fmt(budget)} €`}.`,
          { fee, price, budget, answer },
        );
      },
    },
    {
      id: "mindestens",
      make: (rng, level) => {
        const base = rng.int(2, 6),
          price = rng.int(2, 5),
          n = rng.int(4, 9),
          target = base + price * n - (level === 1 ? price / 2 : 0),
          answer = level === 1 ? n : n + 1;
        return task(
          level,
          `Eine Aktion bringt ${base} € feste Spende und ${price} € je verkauftem Heft. Wie viele Hefte sind mindestens nötig, um mindestens ${fmt(target)} € zu erreichen?`,
          `Eine Aktion bringt ${base} € feste Spende und ${price} € je Heft. Es sollen mehr als ${target} € erreicht werden. Bestimme die kleinste ganze Heftzahl und den damit erreichten Betrag.`,
          [
            num("kleinste Anzahl =", answer, "", 0),
            ...(level === 2
              ? [num("Betrag =", base + price * answer, "€", 2)]
              : []),
          ],
          "Löse die untere Grenze und suche die kleinste erlaubte ganze Zahl.",
          `${base} + ${price}x ${level === 1 ? "≥" : ">"} ${fmt(target)}. Bei einer unteren Grenze wird nach oben gesucht; bei strengem > ist die Grenze ausgeschlossen.`,
          `Mindestens ${answer} Hefte; Betrag ${base + price * answer} €.`,
          { base, price, target, answer },
        );
      },
    },
  ],
});
export const STAGE_ALGEBRA = makeStage(
  6,
  "Terme, Gleichungen und Ungleichungen",
  "Umformen, Lösungsbereiche und Sachaufgaben",
  "#ea580c",
  "x",
  [6, 4],
  [terme, gleichungen, ungleichungen, sachgleichung, sachungleichung],
);
