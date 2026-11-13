import { fmt, fmtUnit, linear, MINUS, round } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import { bracketTerm, FORMULAS, formulaValue } from "../lab/views-gleichungen";
import { BOTH, choice, lab, M_ONLY, makeLesson, makeStage, NAMES, output as o, range as r, task } from "./builders";
import { choiceField, numberField as num } from "./helpers";

const L = (content: Parameters<typeof makeLesson>[1]) => makeLesson(7, content);
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const eq = (value: number, digits = 2) => (near(value, round(value, digits)) ? "=" : "≈");
/** A signed summand: "+ 3", "− 3". */
const signed = (k: number) => (k < 0 ? `${MINUS} ${fmt(-k)}` : `+ ${fmt(k)}`);
/** A number in brackets when negative. */
const p = (k: number) => (k < 0 ? `(${fmt(k)})` : fmt(k));
/** "(x + a)" with sign. */
const xs = (a: number) => (a === 0 ? "x" : `(x ${signed(a)})`);

/** A nonzero integer from min to max. */
function nz(rng: Rng, min: number, max: number): number {
  let k = rng.int(min, max);
  while (k === 0) k = rng.int(min, max);
  return k;
}

// 7.1 Gleichungen mit Klammern ──────────────────────────────────────────────

const klammern = L({
  id: "gl-1-klammern",
  title: "Gleichungen mit Klammern",
  subtitle: "Aufstellen, Klammern auflösen, umformen, prüfen",
  tracks: BOTH,
  whyItMatters:
    "Ob Zahlenrätsel, Alter, Preise oder Maße: Viele Fragen lassen sich als Gleichung schreiben. Wer Klammern sicher auflöst und Schritt für Schritt umformt, findet die Lösung und kann sie begründen.",
  explanationHtml: `
    <p>Eine Gleichung löst du durch <strong>Äquivalenzumformungen</strong>: Auf beiden Seiten dasselbe tun, damit die Waage im Gleichgewicht bleibt. Bei Klammern und mehrmals auftretender Variable gehst du so vor:</p>
    <ol>
      <li>Klammern auflösen (jedes Glied in der Klammer malnehmen; Minus vor der Klammer dreht alle Vorzeichen),</li>
      <li>auf jeder Seite zusammenfassen,</li>
      <li>alle x auf eine Seite, alle Zahlen auf die andere bringen,</li>
      <li>durch die Zahl vor x teilen,</li>
      <li>Probe: Lösung in die Ausgangsgleichung einsetzen.</li>
    </ol>
    <div class="example"><strong>Beispiel:</strong> 3(x + 2) = x + 14 | Klammer auflösen<br>
    3x + 6 = x + 14 | − x − 6<br>
    2x = 8 | : 2<br>
    x = 4. Probe: 3 · (4 + 2) = 18 und 4 + 14 = 18.<br>
    Zahlenrätsel: „Addiert man zu einer Zahl 5 und verdreifacht die Summe, erhält man das Doppelte der Zahl vermehrt um 24.“ Gleichung: 3(x + 5) = 2x + 24, also 3x + 15 = 2x + 24 und x = 9.</div>
    <div class="merke"><strong>Merke:</strong> Klammern auflösen, zusammenfassen, x auf eine Seite, teilen, Probe. Bei Sachaufgaben schreibst du zuerst auf, wofür x steht, und gibst am Ende einen Antwortsatz.</div>
  `,
  formulas: [
    { name: "Distributivgesetz", html: "a · (b + c) = a · b + a · c", quantities: "Minus vor der Klammer: −(b − c) = −b + c" },
    { name: "Äquivalenzumformung", html: "auf beiden Seiten dasselbe rechnen", quantities: "+, −, · und : (nicht durch 0)" },
  ],
  quiz: {
    question: "Welche Lösung hat 2(x − 3) = x + 4?",
    options: ["x = 10", "x = 7", "x = 1", "x = −2"],
    correctIndex: 0,
    explanation: "2x − 6 = x + 4, also x = 10. Probe: 2 · 7 = 14 und 10 + 4 = 14. Wer 2 · (−3) als −3 rechnet, landet bei x = 7.",
  },
  lab: lab(
    "balance",
    "Die Waage",
    "Links liegt p(x + q), rechts m · x + n. Stelle die Gleichung ein und suche mit dem x-Regler das Gleichgewicht.",
    [r("p", "Faktor vor der Klammer p", 1, 5, 3, 1), r("q", "Zahl in der Klammer q", -5, 5, 2, 1), r("m", "x rechts: m", 0, 4, 1, 1), r("n", "Zahl rechts n", -10, 30, 14, 1), r("x", "eingesetztes x", -10, 10, 0, 0.5)],
    [
      o("links", "linke Seite", (v) => v.p * (v.x + v.q), "", 2),
      o("rechts", "rechte Seite", (v) => v.m * v.x + v.n, "", 2),
      o("diff", "Unterschied", (v) => v.p * (v.x + v.q) - (v.m * v.x + v.n), "", 2, true),
    ],
    [
      { id: "start", text: "Finde die Lösung der Startgleichung 3(x + 2) = x + 14.", check: (v) => v.p === 3 && v.q === 2 && v.m === 1 && v.n === 14 && v.x === 4 },
      { id: "negativ", text: "Stelle eine Gleichung mit negativer Lösung ein und bringe die Waage ins Gleichgewicht.", check: (v) => v.x < 0 && near(v.p * (v.x + v.q), v.m * v.x + v.n) },
      { id: "keine", text: "Stelle eine Gleichung ein, die keine Lösung hat: Die Waage bleibt bei jedem x schief.", check: (v) => v.p === v.m && v.p * v.q !== v.n },
    ],
  ),
  exercises: [
    {
      id: "loesen",
      make: (rng, level) => {
        const x0 = nz(rng, -9, 12);
        const pp = rng.int(2, 6);
        const q = nz(rng, -7, 7);
        let m = rng.int(-3, 5);
        if (m === pp) m = pp - 1;
        const n = pp * (x0 + q) - m * x0;
        const slips = [
          { value: (n - q) / (pp - m), hint: "Beim Auflösen der Klammer wird auch die Zahl in der Klammer mit dem Faktor malgenommen." },
          { value: -x0, hint: "Prüfe die Vorzeichen beim Umformen und mache die Probe." },
        ];
        const steps = [
          `Klammer auflösen: ${linear(pp, pp * q)} = ${linear(m, n)}`,
          `x-Glieder nach links, Zahlen nach rechts: ${linear(pp - m, 0)} = ${fmt(n - pp * q)}`,
          `durch ${p(pp - m)} teilen`,
        ];
        if (level === 1)
          return task(
            level,
            `Löse die Gleichung ${bracketTerm(pp, q)} = ${linear(m, n)} und mache die Probe.`,
            [num("x =", x0, "", 2, { slips })],
            "Klammer auflösen, x auf eine Seite, Zahlen auf die andere, dann teilen.",
            steps,
            `x = ${fmt(x0)}`,
            { x0, pp, q, m },
          );
        const x1 = rng.int(2, 15);
        const add = rng.int(2, 9);
        const factor = rng.int(2, 5);
        const k = rng.int(1, factor - 1);
        const plus = factor * (x1 + add) - k * x1;
        return task(
          level,
          `Zahlenrätsel: Addiert man zu einer Zahl ${add} und nimmt die Summe mal ${factor}, so erhält man das ${k === 1 ? "Einfache" : `${k}-Fache`} der Zahl vermehrt um ${plus}. Stelle eine Gleichung auf und bestimme die Zahl.`,
          [num("Zahl:", x1, "", 2, { slips: [{ value: (plus - add) / (factor - k), hint: "Die ganze Summe (Zahl + " + add + ") wird malgenommen: Klammer setzen." }] })],
          "Gleichung: Faktor · (x + Summand) = k · x + Zahl. Dann umformen.",
          [`${bracketTerm(factor, add)} = ${linear(k, plus)}`, `${linear(factor, factor * add)} = ${linear(k, plus)}`, `${linear(factor - k, 0)} = ${plus - factor * add}`],
          `Die Zahl ist ${x1}.`,
          { x1, add, factor },
        );
      },
    },
    {
      id: "sachaufgabe",
      make: (rng, level) => {
        if (level === 1) {
          const width = rng.int(3, 15);
          const more = rng.int(2, 9);
          const u = 2 * (width + width + more);
          return task(
            level,
            `Ein Rechteck ist ${more} cm länger als breit und hat den Umfang ${u} cm. Stelle eine Gleichung mit der Breite x auf. Wie breit und wie lang ist das Rechteck?`,
            [num("Breite:", width, "cm", 2, { slips: [{ value: (u - more) / 2, hint: "Der Umfang enthält jede Seite zweimal: 2 · (x + x + " + more + ")." }] }), num("Länge:", width + more, "cm", 2)],
            "Breite x, Länge x + " + more + ". Umfang: 2 · (x + x + " + more + ") = " + u + ".",
            [`2 · (x + x + ${more}) = ${u}`, `4x + ${2 * more} = ${u}`, `4x = ${u - 2 * more}`],
            `Breite ${width} cm, Länge ${width + more} cm`,
            { width, more },
          );
        }
        const [a, b] = rng.shuffle(NAMES).slice(0, 2);
        const age = rng.int(8, 16);
        const diff = rng.int(2, 6);
        const years = rng.int(3, 10);
        const sum = 2 * age + diff + 2 * years;
        return task(
          level,
          `${a} ist ${diff} Jahre älter als ${b}. In ${years} Jahren sind beide zusammen ${sum} Jahre alt. Wie alt sind ${b} und ${a} heute?`,
          [num(`${b}:`, age, "Jahre", 0, { slips: [{ value: (sum - diff - years) / 2, hint: `Beide werden ${years} Jahre älter, also kommt ${years} zweimal dazu.` }] }), num(`${a}:`, age + diff, "Jahre", 0)],
          `${b} ist x Jahre alt, ${a} x + ${diff}. In ${years} Jahren: (x + ${years}) + (x + ${diff} + ${years}).`,
          [`(x + ${years}) + (x + ${diff + years}) = ${sum}`, `2x + ${diff + 2 * years} = ${sum}`, `2x = ${sum - diff - 2 * years}`],
          `${b} ist ${age}, ${a} ${age + diff} Jahre alt.`,
          { age, diff, years },
        );
      },
    },
  ],
});

// 7.2 Gleichungen mit Brüchen und Mischungsaufgaben ────────────────────────

const lcm = (a: number, b: number) => (a * b) / gcd2(a, b);
function gcd2(a: number, b: number): number {
  return b === 0 ? a : gcd2(b, a % b);
}

const PART: Record<number, string> = { 2: "die Hälfte", 3: "ein Drittel", 4: "ein Viertel", 5: "ein Fünftel", 6: "ein Sechstel" };

const brueche = L({
  id: "gl-2-brueche-mischung",
  title: "Gleichungen mit Brüchen und Mischungen",
  subtitle: "Mit dem Hauptnenner malnehmen, Wirkstoff vorher gleich nachher",
  tracks: BOTH,
  whyItMatters:
    "Ein Drittel davon, ein Viertel dafür, wie viel war es am Anfang? Und wie mischt man Kaffee, Saft oder Reinigungsmittel genau richtig? Solche Fragen führen auf Gleichungen mit Brüchen.",
  explanationHtml: `
    <p>Steht x im <strong>Zähler</strong> von Brüchen, nimmst du beide Seiten mit dem <strong>Hauptnenner</strong> mal. Dann verschwinden die Brüche:</p>
    <div class="example"><strong>Beispiel:</strong> x/3 + x/4 = 14 | · 12<br>
    4x + 3x = 168<br>
    7x = 168, also x = 24. Probe: 24/3 + 24/4 = 8 + 6 = 14.</div>
    <p>Manchmal ist die Dezimalschreibweise bequemer: x/2 = 0,5x und x/4 = 0,25x. Bei Dritteln bleibst du besser bei Brüchen, denn 1/3 ≈ 0,33 ist gerundet.</p>
    <p><strong>Mischungsaufgaben:</strong> Was in den Teilen steckt, steckt auch in der Mischung. Bei Preisen: Menge · Preis der ersten Sorte + Menge · Preis der zweiten = Gesamtmenge · Mischpreis. Bei Anteilen in Prozent genauso.</p>
    <div class="example"><strong>Beispiel:</strong> Wie viel kg Kaffee zu 8 €/kg mischt man mit 5 kg zu 12 €/kg, damit 1 kg Mischung 9,60 € kostet?<br>
    8x + 12 · 5 = 9,6 · (x + 5)<br>
    8x + 60 = 9,6x + 48, also 12 = 1,6x und x = 7,5 kg.</div>
    <div class="merke"><strong>Merke:</strong> Brüche mit x im Zähler: mit dem Hauptnenner malnehmen. Mischungen: Wert (oder Wirkstoff) der Teile = Wert der Mischung. Probe nicht vergessen.</div>
  `,
  formulas: [
    { name: "Hauptnenner", html: "x/3 + x/4 = 14 | · 12", quantities: "kleinstes gemeinsames Vielfaches der Nenner" },
    { name: "Mischung", html: "a₁ · p₁ + a₂ · p₂ = (a₁ + a₂) · p", quantities: "Mengen a, Preise oder Anteile p" },
  ],
  quiz: {
    question: "Mit welcher Zahl nimmst du x/6 + x/4 = 10 am besten mal?",
    options: ["12", "24", "10", "6"],
    correctIndex: 0,
    explanation: "12 ist das kleinste gemeinsame Vielfache von 6 und 4. 24 geht auch, macht die Zahlen aber unnötig groß.",
  },
  lab: lab(
    "mixing",
    "Mischen",
    "Gieße zwei Flüssigkeiten mit verschiedenem Anteil zusammen. Lila ist der Anteil des Wirkstoffs. Die Menge Wirkstoff bleibt beim Mischen gleich.",
    [r("a1", "Menge 1", 0, 10, 2, 0.5, "l"), r("c1", "Anteil 1", 0, 100, 40, 5, "%"), r("a2", "Menge 2", 0, 10, 3, 0.5, "l"), r("c2", "Anteil 2", 0, 100, 10, 5, "%")],
    [o("mix", "Anteil der Mischung", (v) => (v.a1 + v.a2 > 0 ? (v.a1 * v.c1 + v.a2 * v.c2) / (v.a1 + v.a2) : 0), "%", 2, true), o("menge", "Menge der Mischung", (v) => v.a1 + v.a2, "l", 1)],
    [
      { id: "zwanzig", text: "Mische 30-prozentigen und 10-prozentigen Saft zu genau 10 l mit 20 %.", check: (v) => v.c1 === 30 && v.c2 === 10 && v.a1 + v.a2 === 10 && near((v.a1 * 30 + v.a2 * 10) / 10, 20) },
      { id: "verduennen", text: "Verdünne 2 l Sirup mit 30 % mit Wasser (0 %) auf 10 %.", check: (v) => v.a1 === 2 && v.c1 === 30 && v.c2 === 0 && near((v.a1 * v.c1) / (v.a1 + v.a2), 10) },
      { id: "fuenfundzwanzig", text: "Erzeuge aus 40-prozentigem und 10-prozentigem Saft eine Mischung mit 25 %.", check: (v) => v.c1 === 40 && v.c2 === 10 && v.a1 + v.a2 > 0 && near((v.a1 * 40 + v.a2 * 10) / (v.a1 + v.a2), 25) },
    ],
  ),
  exercises: [
    {
      id: "brueche",
      make: (rng, level) => {
        if (level === 1) {
          const [a, b] = rng.shuffle([2, 3, 4, 5, 6]).slice(0, 2);
          const k = lcm(a, b);
          const x0 = k * rng.int(1, 8);
          const plus = rng.next() < 0.6;
          const rhs = plus ? x0 / a + x0 / b : x0 / Math.min(a, b) - x0 / Math.max(a, b);
          const [s, t] = plus ? [a, b] : [Math.min(a, b), Math.max(a, b)];
          return task(
            level,
            `Löse die Gleichung x/${s} ${plus ? "+" : "−"} x/${t} = ${fmt(rhs)}.`,
            [num("x =", x0, "", 2, { slips: [{ value: rhs * (s + t), hint: "Nimm beide Seiten mit dem Hauptnenner mal, nicht mit der Summe der Nenner." }] })],
            `Hauptnenner ${k}: beide Seiten mal ${k}.`,
            [`· ${k}: ${k / s}x ${plus ? "+" : "−"} ${k / t}x = ${fmt(rhs * k)}`, `${plus ? k / s + k / t : k / s - k / t}x = ${fmt(rhs * k)}`],
            `x = ${fmt(x0)}`,
            { x0, s, t },
          );
        }
        const name = rng.pick(NAMES);
        const [a, b] = rng.pick([[3, 4], [2, 5], [3, 5], [4, 6], [2, 3]]);
        const k = lcm(a, b);
        const rest = (k - k / a - k / b) * rng.int(1, 6);
        const x0 = (rest * k) / (k - k / a - k / b);
        return task(
          level,
          `${name} gibt ${PART[a]} des Taschengeldes für Kino aus und ${PART[b]} für Snacks. Es bleiben ${rest} € übrig. Wie viel Taschengeld hatte ${name}?`,
          [num("Taschengeld:", x0, "€", 2, { slips: [{ value: rest * 2, hint: "Gleichung: x − x/" + a + " − x/" + b + " = " + rest + "." }] })],
          "Taschengeld x. Ausgaben x/" + a + " und x/" + b + ". Rest = x − Ausgaben.",
          [`x − x/${a} − x/${b} = ${rest} | · ${k}`, `${k}x − ${k / a}x − ${k / b}x = ${rest * k}`, `${k - k / a - k / b}x = ${rest * k}`],
          `${name} hatte ${fmtUnit(x0, "€")}.`,
          { a, b, rest },
        );
      },
    },
    {
      id: "mischung",
      make: (rng, level) => {
        if (level === 1) {
          const p1 = rng.pick([6, 7, 8, 9]);
          const p2 = p1 + rng.pick([2, 3, 4, 5, 6]);
          // A total of 4, 5, 10 or 20 kg keeps the mixed price at whole cents.
          const total = rng.pick([4, 5, 10, 20]);
          const a1 = rng.int(1, total - 1);
          const a2 = total - a1;
          const mix = (a1 * p1 + a2 * p2) / (a1 + a2);
          return task(
            level,
            `Eine Rösterei mischt Kaffee zu ${fmtUnit(p1, "€")} pro kg mit ${a2} kg Kaffee zu ${fmtUnit(p2, "€")} pro kg. 1 kg Mischung soll ${fmtUnit(mix, "€")} kosten. Wie viel kg der billigeren Sorte braucht sie?`,
            [num("x =", a1, "kg", 2, { slips: [{ value: a2, hint: "Stelle die Gleichung auf: " + p1 + "x + " + p2 + " · " + a2 + " = Mischpreis · (x + " + a2 + ")." }] })],
            "Wert der Teile = Wert der Mischung: p₁ · x + p₂ · a₂ = p · (x + a₂).",
            [`${fmt(p1)}x + ${fmt(p2)} · ${a2} = ${fmt(mix)} · (x + ${a2})`, `${fmt(p1)}x + ${fmt(p2 * a2)} = ${fmt(mix)}x + ${fmt(mix * a2)}`, `${fmt(p2 * a2 - mix * a2)} = ${fmt(mix - p1)}x`],
            `x = ${fmt(a1)} kg`,
            { p1, p2, a1, a2 },
          );
        }
        const syrup = rng.pick([0.5, 1, 1.5, 2]);
        const c1 = rng.pick([20, 30, 40, 60]);
        const c = rng.pick([5, 10]);
        const water = (syrup * (c1 - c)) / c;
        return task(
          level,
          `Ein Sirup enthält ${c1} % Fruchtanteil. ${rng.pick(NAMES)} hat ${fmtUnit(syrup, "l")} davon und will ein Getränk mit ${c} % Fruchtanteil mischen. Wie viel Liter Wasser muss sie oder er dazugeben?`,
          [num("Wasser:", water, "l", 2, { slips: [{ value: (syrup * c1) / c, hint: "Das ist die Menge der ganzen Mischung. Ziehe den Sirup noch ab." }] })],
          "Fruchtanteil vorher = nachher: Sirup · " + c1 + " % = (Sirup + Wasser) · " + c + " %.",
          [`${fmt(syrup)} · ${c1} = (${fmt(syrup)} + x) · ${c}`, `${fmt(syrup * c1)} = ${fmt(syrup * c)} + ${c}x`, `${c}x = ${fmt(syrup * c1 - syrup * c)}`],
          `${fmtUnit(water, "l")} Wasser`,
          { syrup, c1, c },
        );
      },
    },
  ],
});

// 7.3 Werte in Formeln einsetzen ───────────────────────────────────────────

const formeln = L({
  id: "gl-3-formeln",
  title: "Formeln umstellen",
  subtitle: "Einsetzen, nach der gesuchten Größe auflösen, prüfen",
  tracks: BOTH,
  whyItMatters:
    "In der Werkstatt, im Labor und bei der Bank stehen Formeln. Oft fehlt aber nicht das Ergebnis, sondern eine der anderen Größen. Mit Äquivalenzumformungen holst du jede Größe aus einer Formel heraus.",
  explanationHtml: `
    <p>Eine Formel ist eine Gleichung mit mehreren Variablen. Ist eine Größe gesucht, gibt es zwei Wege:</p>
    <ul>
      <li><strong>Erst einsetzen, dann lösen:</strong> Alle bekannten Werte einsetzen und die Gleichung wie gewohnt lösen.</li>
      <li><strong>Erst umstellen, dann einsetzen:</strong> Die Formel nach der gesuchten Größe auflösen. Das lohnt sich, wenn du oft dieselbe Größe brauchst.</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> Trapez A = (a + c) · h : 2 mit A = 24 cm², a = 5 cm, c = 3 cm. Einsetzen: 24 = 8 · h : 2 = 4h, also h = 6 cm.<br>
    Umstellen: A = (a + c) · h : 2 | · 2 | : (a + c) ergibt h = 2A : (a + c).<br>
    Geschwindigkeit: s = v · t, also t = s : v. Bei 150 km und 60 km/h: t = 2,5 h.<br>
    Natur und Technik: Dichte ρ = m : V, also m = ρ · V und V = m : ρ.</div>
    <div class="merke"><strong>Merke:</strong> Beim Umstellen tust du auf beiden Seiten dasselbe, bis die gesuchte Größe allein steht. Achte auf passende Einheiten und prüfe, ob das Ergebnis zur Sache passt.</div>
  `,
  formulas: [
    { name: "Trapez", html: "A = (a + c) · h : 2; h = 2A : (a + c)", quantities: "a, c parallele Seiten, h Höhe" },
    { name: "Geschwindigkeit", html: "s = v · t; t = s : v; v = s : t", quantities: "s Strecke, v Geschwindigkeit, t Zeit" },
    { name: "Dichte", html: "ρ = m : V; m = ρ · V", quantities: "m Masse, V Volumen" },
  ],
  quiz: {
    question: "Die Formel U = R · I wird nach I umgestellt. Was kommt heraus?",
    options: ["I = U : R", "I = U · R", "I = R : U", "I = U − R"],
    correctIndex: 0,
    explanation: "Beide Seiten durch R teilen: U : R = I. Die Probe mit Zahlen hilft: U = 12 V, R = 4 Ω ergibt I = 3 A.",
  },
  lab: lab(
    "formula",
    "Drei Formeln",
    "Wähle eine Formel und verändere ihre Größen. Bei den Laboraufträgen ist das Ergebnis vorgegeben: Stelle die fehlende Größe ein.",
    [
      choice("f", "Formel", FORMULAS.map((f) => f.name), 0),
      { ...r("a", "Seite a", 1, 10, 4, 0.5, "cm"), showIf: (v: Record<string, number>) => v.f === 0 },
      { ...r("c", "Seite c", 1, 10, 2, 0.5, "cm"), showIf: (v: Record<string, number>) => v.f === 0 },
      { ...r("h", "Höhe h", 1, 10, 3, 0.5, "cm"), showIf: (v: Record<string, number>) => v.f !== 1 },
      { ...r("v", "Geschwindigkeit v", 10, 120, 50, 10, "km/h"), showIf: (v: Record<string, number>) => v.f === 1 },
      { ...r("t", "Zeit t", 0.5, 8, 2, 0.5, "h"), showIf: (v: Record<string, number>) => v.f === 1 },
      { ...r("r", "Radius r", 1, 8, 2, 0.5, "cm"), showIf: (v: Record<string, number>) => v.f === 2 },
    ],
    [o("wert", "Ergebnis der Formel", (v) => formulaValue(v), "", 2, true)],
    [
      { id: "trapez", text: "Trapez mit a = 5 cm und c = 3 cm soll A = 24 cm² haben. Stelle die Höhe ein.", check: (v) => v.f === 0 && v.a === 5 && v.c === 3 && near(formulaValue(v), 24) },
      { id: "strecke", text: "Mit 60 km/h sollen 150 km gefahren werden. Stelle die nötige Zeit ein.", check: (v) => v.f === 1 && v.v === 60 && near(formulaValue(v), 150) },
      { id: "zylinder", text: "Ein Zylinder mit r = 5 cm soll etwa 314 cm³ fassen. Stelle die Höhe ein.", check: (v) => v.f === 2 && v.r === 5 && Math.abs(formulaValue(v) - 314) < 1 },
    ],
  ),
  exercises: [
    {
      id: "geometrie",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.int(4, 15);
          const c = rng.int(2, a);
          const h = rng.int(2, 12);
          const A = ((a + c) * h) / 2;
          return task(
            level,
            `Ein Trapez hat die parallelen Seiten a = ${a} cm und c = ${c} cm und den Flächeninhalt A = ${fmtUnit(A, "cm²")}. Wie groß ist seine Höhe h?`,
            [num("h =", h, "cm", 2, { slips: [{ value: A / (a + c), hint: "Vergiss das : 2 in der Formel nicht: h = 2A : (a + c)." }] })],
            "A = (a + c) · h : 2, umgestellt h = 2A : (a + c)",
            [`${fmt(A)} = (${a} + ${c}) · h : 2 = ${fmt((a + c) / 2)} · h`, `h = ${fmt(A)} : ${fmt((a + c) / 2)}`],
            `h = ${h} cm`,
            { a, c, h },
          );
        }
        const d = rng.pick([40, 50, 60, 70, 80]);
        const liters = rng.pick([100, 150, 200, 250, 300]);
        const h = (liters * 1000) / (Math.PI * (d / 2) ** 2);
        return task(
          level,
          `Eine zylinderförmige Regentonne hat innen einen Durchmesser von ${d} cm. Sie soll ${liters} l fassen. Wie hoch muss sie mindestens sein?`,
          [num("Höhe:", h, "cm", 1, { slips: [{ value: (liters * 1000) / (Math.PI * d * d), hint: "In V = π · r² · h steht der Radius, also der halbe Durchmesser." }, { value: liters / (Math.PI * (d / 2) ** 2), hint: "Rechne Liter in cm³ um: 1 l = 1.000 cm³." }] })],
          "V = π · r² · h, also h = V : (π · r²). Einheiten: 1 l = 1.000 cm³.",
          [`V = ${liters} l = ${fmt(liters * 1000)} cm³, r = ${d / 2} cm`, `h = ${fmt(liters * 1000)} : (π · ${d / 2}²) = ${fmt(liters * 1000)} : ${fmt(Math.PI * (d / 2) ** 2, 2)}`],
          `h ≈ ${fmtUnit(h, "cm", 1)}`,
          { d, liters },
        );
      },
    },
    {
      id: "naturwissenschaft",
      make: (rng, level) => {
        if (level === 1) {
          const v = 10 * rng.int(3, 12);
          const t = rng.pick([0.5, 1.5, 2, 2.5, 3, 4]);
          const s = v * t;
          return task(
            level,
            `Ein Bus fährt mit durchschnittlich ${v} km/h. Wie lange braucht er für ${fmt(s)} km? Stelle s = v · t nach t um.`,
            [num("t =", t, "h", 2, { slips: [{ value: v / s, hint: "t = s : v, nicht v : s." }, { value: s * v, hint: "Teile die Strecke durch die Geschwindigkeit." }] })],
            "s = v · t | : v ergibt t = s : v",
            [`t = s : v = ${fmt(s)} : ${v}`],
            `t = ${fmtUnit(t, "h")}`,
            { v, t },
          );
        }
        if (rng.next() < 0.5) {
          const metal = rng.pick([
            { name: "Aluminium", rho: 2.7 },
            { name: "Eisen", rho: 7.9 },
            { name: "Kupfer", rho: 8.9 },
          ]);
          const mass = rng.pick([500, 1000, 2000, 2500]);
          const V = mass / metal.rho;
          return task(
            level,
            `Ein Block aus ${metal.name} (Dichte ${fmt(metal.rho)} g/cm³) wiegt ${fmt(mass)} g. Welches Volumen hat er? Stelle ρ = m : V nach V um.`,
            [num("V =", V, "cm³", 2, { slips: [{ value: mass * metal.rho, hint: "V = m : ρ: Teile die Masse durch die Dichte." }] })],
            "ρ = m : V | · V | : ρ ergibt V = m : ρ.",
            [`V = m : ρ = ${fmt(mass)} : ${fmt(metal.rho)}`],
            `V ${eq(V)} ${fmtUnit(V, "cm³")}`,
            { mass },
          );
        }
        const U = rng.pick([4.5, 6, 9, 12, 24]);
        const I = rng.pick([0.2, 0.25, 0.3, 0.5, 1.5]);
        const R = U / I;
        return task(
          level,
          `An einem Widerstand liegt die Spannung ${fmt(U)} V, es fließt der Strom ${fmt(I)} A. Wie groß ist der Widerstand? Stelle U = R · I nach R um.`,
          [num("R =", R, "Ω", 2, { slips: [{ value: U * I, hint: "R = U : I." }] })],
          "U = R · I | : I ergibt R = U : I.",
          [`R = U : I = ${fmt(U)} : ${fmt(I)}`],
          `R ${eq(R)} ${fmtUnit(R, "Ω")}`,
          { U, I },
        );
      },
    },
  ],
});

// 7.4 Produkte von Summen (M9) ─────────────────────────────────────────────

/** "x² + 5x + 6" for x² + b·x + c. */
const quad = (b: number, c: number) => `x²${b === 0 ? "" : ` ${b > 0 ? "+" : MINUS} ${Math.abs(b) === 1 ? "" : fmt(Math.abs(b))}x`}${c === 0 ? "" : ` ${signed(c)}`}`;

const produkte = L({
  id: "gl-4-produkte-summen",
  title: "Gleichungen mit Produkten von Summen",
  subtitle: "Jedes Glied mit jedem malnehmen",
  tracks: M_ONLY,
  whyItMatters:
    "Wird ein Rechteck auf beiden Seiten verlängert, ändert sich sein Flächeninhalt nach einem Produkt zweier Summen. Wer solche Produkte ausmultipliziert, löst auch Gleichungen, in denen zunächst x² vorkommt.",
  explanationHtml: `
    <p>Zwei Summen werden multipliziert, indem du <strong>jedes Glied der ersten Klammer mit jedem Glied der zweiten</strong> malnimmst und dann zusammenfasst:</p>
    <p class="formula-line">(a + b) · (c + d) = ac + ad + bc + bd</p>
    <p>Das Rechteckmodell zeigt es: Ein Rechteck mit den Seiten x + 2 und x + 3 besteht aus x², 3x, 2x und 6, also (x + 2)(x + 3) = x² + 5x + 6. Bei Differenzen gelten die Vorzeichenregeln: (x − 4)(x + 1) = x² + x − 4x − 4 = x² − 3x − 4.</p>
    <div class="example"><strong>Beispiel:</strong> (x + 2)(x + 3) = (x + 1)(x + 7)<br>
    x² + 5x + 6 = x² + 8x + 7 | − x²<br>
    5x + 6 = 8x + 7 | − 5x − 7<br>
    −1 = 3x, also x = −1/3. Das x² fällt auf beiden Seiten weg, übrig bleibt eine lineare Gleichung.</div>
    <div class="merke"><strong>Merke:</strong> Jedes Glied mit jedem malnehmen, Vorzeichen beachten, zusammenfassen. Kommt x² auf beiden Seiten gleich vor, fällt es weg.</div>
  `,
  formulas: [
    { name: "Produkt zweier Summen", html: "(a + b)(c + d) = ac + ad + bc + bd", quantities: "jedes Glied mit jedem" },
    { name: "Mit x", html: "(x + a)(x + b) = x² + (a + b)x + ab", quantities: "a, b auch negativ" },
  ],
  quiz: {
    question: "Was ergibt (x − 3)(x + 5)?",
    options: ["x² + 2x − 15", "x² − 15", "x² + 2x + 15", "x² − 8x − 15"],
    correctIndex: 0,
    explanation: "x · x + 5x − 3x − 15 = x² + 2x − 15. Wer nur die ersten und letzten Glieder malnimmt, vergisst die gemischten Glieder 5x und −3x.",
  },
  lab: lab(
    "area-product",
    "Das Rechteckmodell",
    "Das Rechteck hat die Seiten x + a und x + b. Es zerfällt in vier Teilflächen: x², a · x, b · x und a · b.",
    [r("a", "a", 1, 6, 2, 1), r("b", "b", 1, 6, 3, 1), r("x", "x", 1, 8, 2, 0.5)],
    [
      o("produkt", "(x + a)(x + b)", (v) => (v.x + v.a) * (v.x + v.b), "", 2, true),
      o("term", "ausmultipliziert", (v) => quad(v.a + v.b, v.a * v.b)),
    ],
    [
      { id: "sechsundfuenfzig", text: "Bei a = 2 und b = 3: Stelle x so ein, dass das Rechteck den Flächeninhalt 56 hat.", check: (v) => v.a === 2 && v.b === 3 && near((v.x + 2) * (v.x + 3), 56) },
      { id: "quadrat", text: "Mache aus dem Rechteck ein Quadrat.", check: (v) => v.a === v.b },
      { id: "terme", text: "Stelle a und b so ein, dass das Rechteck x² + 7x + 12 zeigt.", check: (v) => v.a + v.b === 7 && v.a * v.b === 12 },
    ],
  ),
  exercises: [
    {
      id: "ausmultiplizieren",
      make: (rng, level) => {
        if (level === 1) {
          const a = nz(rng, -9, 9);
          const b = nz(rng, -9, 9);
          return task(
            level,
            `Multipliziere aus und fasse zusammen: ${xs(a)}${xs(b)} = x² + ☐x + ☐`,
            [num("x-Glied:", a + b, "", 0, { slips: [{ value: a * b, hint: "Das x-Glied entsteht aus x · " + p(b) + " und " + p(a) + " · x." }] }), num("Zahl:", a * b, "", 0, { slips: [{ value: a + b, hint: "Die Zahl ohne x ist das Produkt der beiden Zahlen." }] })],
            "(x + a)(x + b) = x · x + x · b + a · x + a · b",
            [`x · x + x · ${p(b)} + ${p(a)} · x + ${p(a)} · ${p(b)}`, `= x² ${signed(b)}x ${signed(a)}x ${signed(a * b)}`],
            `${quad(a + b, a * b)}`,
            { a, b },
          );
        }
        const k = rng.int(2, 4);
        const a = nz(rng, -6, 6);
        const b = nz(rng, -6, 6);
        return task(
          level,
          `Multipliziere aus und fasse zusammen: (${k}x ${signed(a)})(x ${signed(-b)}) = ☐x² + ☐x + ☐`,
          [num("x²-Glied:", k, "", 0), num("x-Glied:", -k * b + a, "", 0, { slips: [{ value: k * b + a, hint: "Achte auf das Vorzeichen: " + k + "x · (" + fmt(-b) + ")." }] }), num("Zahl:", -a * b, "", 0)],
          "Jedes Glied mit jedem: kx · x, kx · (−b), a · x, a · (−b).",
          [`${k}x · x + ${k}x · ${p(-b)} + ${p(a)} · x + ${p(a)} · ${p(-b)}`],
          `${k}x² ${signed(-k * b + a)}x ${signed(-a * b)}`,
          { k, a, b },
        );
      },
    },
    {
      id: "gleichung",
      make: (rng, level) => {
        if (level === 1) {
          for (let tries = 0; tries < 200; tries++) {
            const x0 = nz(rng, -6, 8);
            const a = nz(rng, -6, 6);
            const b = nz(rng, -6, 6);
            const c = nz(rng, -6, 6);
            if (x0 + c === 0) continue;
            const num1 = x0 * (a + b - c) + a * b;
            if (num1 % (x0 + c) !== 0) continue;
            const d = num1 / (x0 + c);
            if (d === 0 || Math.abs(d) > 9 || a + b === c + d || (a === c && b === d) || (a === d && b === c)) continue;
            return task(
              level,
              `Löse die Gleichung ${xs(a)}${xs(b)} = ${xs(c)}${xs(d)}.`,
              [num("x =", x0, "", 2)],
              "Beide Seiten ausmultiplizieren. Das x² fällt weg, dann wie gewohnt lösen.",
              [`${quad(a + b, a * b)} = ${quad(c + d, c * d)} | − x²`, `${linear(a + b, a * b)} = ${linear(c + d, c * d)}`, `${linear(a + b - c - d, 0)} = ${fmt(c * d - a * b)}`],
              `x = ${fmt(x0)}`,
              { x0, a, b, c, d },
            );
          }
          return task(level, "Löse die Gleichung (x + 2)(x + 3) = (x + 1)(x + 6).", [num("x =", 0, "", 2)], "Ausmultiplizieren, x² fällt weg.", ["x² + 5x + 6 = x² + 7x + 6", "5x = 7x, also 2x = 0"], "x = 0", {});
        }
        const width = rng.int(3, 12);
        const more = rng.int(1, 5);
        const grow = rng.int(1, 4);
        const increase = (width + grow) * (width + more + grow) - width * (width + more);
        return task(
          level,
          `Ein Rechteck ist ${more} cm länger als breit. Verlängert man beide Seiten um ${grow} cm, wird sein Flächeninhalt um ${increase} cm² größer. Wie breit ist das Rechteck ursprünglich?`,
          [num("Breite:", width, "cm", 2, { slips: [{ value: increase / (2 * grow), hint: "Gleichung: (x + " + grow + ")(x + " + (more + grow) + ") = x(x + " + more + ") + " + increase + "." }] })],
          "Breite x, Länge x + " + more + ". Neu: (x + " + grow + ")(x + " + (more + grow) + "). Fläche neu = Fläche alt + Zuwachs.",
          [`(x + ${grow})(x + ${more + grow}) = x(x + ${more}) + ${increase}`, `${quad(more + 2 * grow, grow * (more + grow))} = ${quad(more, increase)}`, `${2 * grow}x = ${increase - grow * (more + grow)}`],
          `Das Rechteck ist ${width} cm breit.`,
          { width, more, grow },
        );
      },
    },
  ],
});

// 7.5 Bruchgleichungen (M9) ────────────────────────────────────────────────

const bruchgleichungen = L({
  id: "gl-5-bruchgleichungen",
  title: "Bruchgleichungen",
  subtitle: "x im Nenner: erst die Definitionsmenge, dann lösen",
  tracks: M_ONLY,
  whyItMatters:
    "Fahrzeiten, Arbeitszeiten und Durchschnittspreise führen auf Brüche mit x im Nenner. Weil man nicht durch 0 teilen darf, gehört zu jeder Bruchgleichung die Frage: Welche Zahlen sind überhaupt erlaubt?",
  explanationHtml: `
    <p>Steht x im <strong>Nenner</strong>, heißt die Gleichung <strong>Bruchgleichung</strong>. So gehst du vor:</p>
    <ol>
      <li><strong>Definitionsmenge</strong> D bestimmen: Alle Zahlen, für die ein Nenner 0 wird, sind ausgeschlossen.</li>
      <li>Mit dem Hauptnenner malnehmen, sodass keine Brüche mehr übrig sind.</li>
      <li>Die entstandene Gleichung lösen.</li>
      <li>Prüfen, ob die Lösung in D liegt, und die <strong>Lösungsmenge</strong> L angeben.</li>
    </ol>
    <div class="example"><strong>Beispiel:</strong> 6/(x − 1) = 2. D = ℚ ∖ {1}. Mal (x − 1): 6 = 2(x − 1) = 2x − 2, also x = 4. 4 liegt in D: L = {4}.<br>
    3/x = 5/(x + 4). D = ℚ ∖ {0; −4}. Mal x(x + 4): 3(x + 4) = 5x, also 12 = 2x und x = 6. L = {6}.<br>
    Sachaufgabe: Zwei Züge fahren gleich lang. Der erste fährt 240 km, der zweite 300 km und ist 15 km/h schneller. 240/v = 300/(v + 15), also 240v + 3.600 = 300v und v = 60 km/h.</div>
    <div class="merke"><strong>Merke:</strong> Erst D bestimmen (Nenner ≠ 0), dann mit dem Hauptnenner malnehmen und lösen. Eine Lösung, die nicht in D liegt, fällt weg; dann ist L = { }.</div>
  `,
  formulas: [
    { name: "Definitionsmenge", html: "D = ℚ ∖ {Zahlen, für die ein Nenner 0 wird}", quantities: "durch 0 darf man nicht teilen" },
    { name: "Lösungsmenge", html: "L = {Lösungen, die in D liegen}", quantities: "L = { }, wenn keine Lösung übrig bleibt" },
  ],
  quiz: {
    question: "Welche Zahl gehört nicht zur Definitionsmenge der Gleichung 4/(x + 3) = 1?",
    options: ["−3", "3", "4", "1"],
    correctIndex: 0,
    explanation: "Für x = −3 wird der Nenner x + 3 = 0. Darum ist D = ℚ ∖ {−3}. Die Lösung ist x = 1.",
  },
  lab: lab(
    "fraction-graph",
    "Hyperbel trifft Gerade",
    "Die linke Seite a : (x − b) ist eine Hyperbel mit einer Lücke bei x = b (rot), die rechte Seite c eine waagrechte Gerade. Die Lösung ist der Schnittpunkt. Ziehe den Probe-Punkt, um x einzusetzen.",
    [r("a", "Zähler a", 1, 12, 6, 1), r("b", "b im Nenner (x − b)", -4, 4, 1, 1), r("c", "rechte Seite c", 1, 6, 2, 1), r("x", "eingesetztes x", -6, 10, 0, 0.5)],
    [
      o("D", "Definitionsmenge", (v) => `ℚ ∖ {${fmt(v.b)}}`),
      o("L", "Lösung", (v) => fmt(v.b + v.a / v.c, 2), "", 0, true),
    ],
    [
      { id: "start", text: "Setze die Lösung der Startgleichung 6 : (x − 1) = 2 ein.", check: (v) => v.a === 6 && v.b === 1 && v.c === 2 && v.x === 4 },
      { id: "drei", text: "Stelle eine Gleichung ein, bei der x = 3 nicht zur Definitionsmenge gehört.", check: (v) => v.b === 3 },
      { id: "negativ", text: "Stelle eine Gleichung mit negativer Lösung ein und setze die Lösung ein.", check: (v) => v.b + v.a / v.c < 0 && near(v.x, v.b + v.a / v.c) },
    ],
  ),
  exercises: [
    {
      id: "loesen",
      make: (rng, level) => {
        if (level === 1) {
          const c = rng.int(1, 5);
          const k = nz(rng, -5, 6);
          const a = c * k;
          const b = nz(rng, -5, 5);
          const x0 = b + k;
          if (a <= 0) {
            return task(
              level,
              `Bestimme die Definitionsmenge und löse ${fmt(-a)}/(x ${signed(-b)}) = ${fmt(-c)}.`,
              [num("ausgeschlossen:", b, "", 0), num("x =", x0, "", 2)],
              "Nenner = 0 setzen ergibt die ausgeschlossene Zahl. Dann mit dem Nenner malnehmen.",
              [`x ${signed(-b)} = 0 für x = ${fmt(b)}: D = ℚ ∖ {${fmt(b)}}`, `${fmt(-a)} = ${fmt(-c)} · (x ${signed(-b)})`, `x ${signed(-b)} = ${fmt(a / c)}`],
              `D = ℚ ∖ {${fmt(b)}}, L = {${fmt(x0)}}`,
              { a, b, c },
            );
          }
          return task(
            level,
            `Bestimme die Definitionsmenge und löse ${fmt(a)}/(x ${signed(-b)}) = ${fmt(c)}.`,
            [num("ausgeschlossen:", b, "", 0, { slips: [{ value: -b, hint: "Für welches x wird x " + signed(-b) + " zu 0?" }] }), num("x =", x0, "", 2)],
            "Nenner = 0 setzen ergibt die ausgeschlossene Zahl. Dann mit dem Nenner malnehmen.",
            [`x ${signed(-b)} = 0 für x = ${fmt(b)}: D = ℚ ∖ {${fmt(b)}}`, `${fmt(a)} = ${fmt(c)} · (x ${signed(-b)})`, `x ${signed(-b)} = ${fmt(a / c)}`],
            `D = ℚ ∖ {${fmt(b)}}, L = {${fmt(x0)}}`,
            { a, b, c },
          );
        }
        for (let tries = 0; tries < 200; tries++) {
          const a = rng.int(1, 8);
          const b = rng.int(1, 8);
          const pp = nz(rng, -5, 5);
          const q = nz(rng, -5, 5);
          if (a === b || pp === q) continue;
          const numer = a * q - b * pp;
          if (numer % (a - b) !== 0) continue;
          const x0 = numer / (a - b);
          if (x0 === pp || x0 === q || Math.abs(x0) > 20) continue;
          return task(
            level,
            `Bestimme die Definitionsmenge und die Lösungsmenge von ${a}/(x ${signed(-pp)}) = ${b}/(x ${signed(-q)}).`,
            [num("ausgeschlossen 1:", pp, "", 0), num("ausgeschlossen 2:", q, "", 0), num("x =", x0, "", 2)],
            "Beide Nenner dürfen nicht 0 werden. Dann über Kreuz malnehmen: a · (x − q) = b · (x − p).",
            [`D = ℚ ∖ {${fmt(pp)}; ${fmt(q)}}`, `${a}(x ${signed(-q)}) = ${b}(x ${signed(-pp)})`, `${linear(a, -a * q)} = ${linear(b, -b * pp)}`, `${linear(a - b, 0)} = ${fmt(a * q - b * pp)}`],
            `L = {${fmt(x0)}}`,
            { a, b, pp, q },
          );
        }
        return task(level, "Bestimme D und L von 3/x = 5/(x + 4).", [num("ausgeschlossen 1:", 0, "", 0), num("ausgeschlossen 2:", -4, "", 0), num("x =", 6, "", 2)], "Nenner ≠ 0, dann über Kreuz malnehmen.", ["D = ℚ ∖ {0; −4}", "3(x + 4) = 5x"], "L = {6}", {});
      },
    },
    {
      id: "sachaufgabe",
      make: (rng, level) => {
        if (level === 1) {
          const [a, b] = rng.pick([[2, 3], [3, 6], [4, 12], [6, 12], [4, 6], [3, 4], [5, 20]]);
          const t = (a * b) / (a + b);
          return task(
            level,
            `Pumpe A füllt ein Becken allein in ${a} Stunden, Pumpe B allein in ${b} Stunden. Wie lange brauchen beide zusammen? Löse 1/${a} + 1/${b} = 1/t.`,
            [num("t =", t, "h", 2, { slips: [{ value: (a + b) / 2, hint: "Die Zeiten werden nicht gemittelt: Pro Stunde schaffen beide zusammen 1/" + a + " + 1/" + b + " des Beckens." }] })],
            "Pro Stunde: A schafft 1/a, B 1/b, zusammen 1/t des Beckens. Mit dem Hauptnenner malnehmen.",
            [`1/${a} + 1/${b} = ${fmt(a + b)}/${a * b}`, `1/t = ${a + b}/${a * b}, also t = ${a * b}/${a + b}`],
            `t ${eq(t)} ${fmtUnit(t, "h")}`,
            { a, b },
          );
        }
        const v = rng.pick([40, 50, 60, 75, 80, 90]);
        const dv = rng.pick([10, 15, 20, 25]);
        const time = rng.pick([2, 3, 4]);
        const d1 = v * time;
        const d2 = (v + dv) * time;
        return task(
          level,
          `Zwei Züge fahren gleich lange. Der erste legt ${d1} km zurück, der zweite ${d2} km; er ist im Schnitt ${dv} km/h schneller. Stelle eine Bruchgleichung auf und berechne die Geschwindigkeit des ersten Zuges.`,
          [num("v =", v, "km/h", 2, { slips: [{ value: d1 / time, hint: "Die Fahrzeit ist nicht gegeben: Setze die beiden Zeiten s : v gleich." }] })],
          "Fahrzeit = Strecke : Geschwindigkeit. Beide Zeiten gleich: " + d1 + "/v = " + d2 + "/(v + " + dv + ").",
          [`${d1}/v = ${d2}/(v + ${dv}); D: v ≠ 0, v ≠ ${fmt(-dv)}`, `${d1}(v + ${dv}) = ${d2}v`, `${d1 * dv} = ${d2 - d1}v`],
          `v = ${v} km/h`,
          { v, dv, time },
        );
      },
    },
  ],
});

// 7.6 Gleichungssysteme (M9) ───────────────────────────────────────────────

const gleichungssysteme = L({
  id: "gl-6-gleichungssysteme",
  title: "Lineare Gleichungssysteme",
  subtitle: "Gleichsetzen, Einsetzen, Addieren",
  tracks: M_ONLY,
  whyItMatters:
    "Zwei Unbekannte, zwei Bedingungen: Eintrittspreise für Kinder und Erwachsene, zwei Handytarife, zwei Zahlen in einem Rätsel. Mit einem Gleichungssystem bestimmst du beide Werte auf einmal.",
  explanationHtml: `
    <p>Zwei lineare Gleichungen mit den Variablen x und y bilden ein <strong>lineares Gleichungssystem</strong>. Eine Lösung ist ein Zahlenpaar (x | y), das beide Gleichungen erfüllt. Im Koordinatensystem ist es der <strong>Schnittpunkt</strong> der beiden Geraden.</p>
    <ul>
      <li><strong>Gleichsetzungsverfahren:</strong> Beide Gleichungen nach y auflösen und gleichsetzen. Gut, wenn y schon allein steht.</li>
      <li><strong>Einsetzungsverfahren:</strong> Eine Gleichung nach einer Variablen auflösen und in die andere einsetzen.</li>
      <li><strong>Additionsverfahren:</strong> Gleichungen so malnehmen, dass vor einer Variablen Gegenzahlen stehen, dann addieren. Gut, wenn beide Gleichungen die Form ax + by = c haben.</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> I: y = 2x − 1, II: y = −x + 5. Gleichsetzen: 2x − 1 = −x + 5, also 3x = 6, x = 2 und y = 3. L = {(2 | 3)}.<br>
    I: 2x + 3y = 12, II: 4x − 3y = 6. Addieren: 6x = 18, also x = 3, dann 6 + 3y = 12 und y = 2.<br>
    Sind die Geraden parallel, gibt es keine Lösung; sind sie gleich, unendlich viele.</div>
    <div class="merke"><strong>Merke:</strong> Wähle das Verfahren, das am wenigsten Rechnung braucht. Prüfe die Lösung in beiden Gleichungen. Bei Sachaufgaben: zuerst festlegen, wofür x und y stehen.</div>
  `,
  formulas: [
    { name: "Gleichsetzen", html: "y = m₁x + t₁ und y = m₂x + t₂ ⇒ m₁x + t₁ = m₂x + t₂", quantities: "dann x ausrechnen und einsetzen" },
    { name: "Addieren", html: "ax + by = c und dx − by = e ⇒ (a + d)x = c + e", quantities: "y fällt weg" },
  ],
  quiz: {
    question: "Welches Zahlenpaar löst I: x + y = 10 und II: x − y = 4?",
    options: ["(7 | 3)", "(3 | 7)", "(6 | 4)", "(5 | 5)"],
    correctIndex: 0,
    explanation: "Addieren: 2x = 14, also x = 7 und y = 3. Probe: 7 + 3 = 10 und 7 − 3 = 4. (6 | 4) erfüllt nur die erste Gleichung.",
  },
  lab: lab(
    "two-lines",
    "Zwei Geraden",
    "Jede Gleichung ist eine Gerade. Verändere Steigung und y-Achsenabschnitt: Der Schnittpunkt ist die Lösung des Gleichungssystems.",
    [r("m1", "Steigung I", -3, 3, 1, 0.5), r("t1", "Achsenabschnitt I", -6, 6, 1, 1), r("m2", "Steigung II", -3, 3, -1, 0.5), r("t2", "Achsenabschnitt II", -6, 6, 5, 1)],
    [o("S", "Lösung", (v) => (v.m1 !== v.m2 ? `(${fmt((v.t2 - v.t1) / (v.m1 - v.m2), 2)} | ${fmt((v.m1 * (v.t2 - v.t1)) / (v.m1 - v.m2) + v.t1, 2)})` : v.t1 === v.t2 ? "unendlich viele" : "keine"), "", 0, true)],
    [
      { id: "parallel", text: "Stelle ein Gleichungssystem ohne Lösung ein.", check: (v) => v.m1 === v.m2 && v.t1 !== v.t2 },
      { id: "gleich", text: "Stelle ein Gleichungssystem mit unendlich vielen Lösungen ein.", check: (v) => v.m1 === v.m2 && v.t1 === v.t2 },
      { id: "ursprung", text: "Lege den Schnittpunkt in den Ursprung (0 | 0).", check: (v) => v.m1 !== v.m2 && v.t1 === 0 && v.t2 === 0 },
    ],
  ),
  exercises: [
    {
      id: "verfahren",
      make: (rng, level) => {
        const x0 = nz(rng, -6, 6);
        const y0 = nz(rng, -6, 6);
        if (level === 1) {
          const m1 = nz(rng, -3, 3);
          let m2 = nz(rng, -3, 3);
          if (m2 === m1) m2 = -m1;
          const t1 = y0 - m1 * x0;
          const t2 = y0 - m2 * x0;
          return task(
            level,
            `Löse das Gleichungssystem mit dem Gleichsetzungsverfahren: I: y = ${linear(m1, t1)}, II: y = ${linear(m2, t2)}.`,
            [num("x =", x0, "", 2), num("y =", y0, "", 2)],
            "Rechte Seiten gleichsetzen, x ausrechnen, in I einsetzen.",
            [`${linear(m1, t1)} = ${linear(m2, t2)}`, `${linear(m1 - m2, 0)} = ${fmt(t2 - t1)}, x = ${fmt(x0)}`, `y = ${fmt(m1)} · ${p(x0)} ${signed(t1)} = ${fmt(y0)}`],
            `L = {(${fmt(x0)} | ${fmt(y0)})}`,
            { x0, y0 },
          );
        }
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const d = rng.int(1, 5);
        return task(
          level,
          `Löse mit dem Additionsverfahren: I: ${a}x + ${b}y = ${fmt(a * x0 + b * y0)}, II: ${d}x − ${b}y = ${fmt(d * x0 - b * y0)}. Warum ist dieses Verfahren hier günstig?`,
          [num("x =", x0, "", 2), num("y =", y0, "", 2), choiceField("Grund:", ["Vor y stehen schon Gegenzahlen.", "y steht schon allein.", "Die Geraden sind parallel."], 0)],
          "I + II: y fällt weg. Dann x in I einsetzen.",
          [`I + II: ${a + d}x = ${fmt(a * x0 + b * y0 + d * x0 - b * y0)}, x = ${fmt(x0)}`, `${a} · ${p(x0)} + ${b}y = ${fmt(a * x0 + b * y0)}, y = ${fmt(y0)}`],
          `L = {(${fmt(x0)} | ${fmt(y0)})}`,
          { x0, y0 },
        );
      },
    },
    {
      id: "textaufgabe",
      make: (rng, level) => {
        if (level === 1) {
          const x0 = rng.int(5, 40);
          const y0 = rng.int(1, x0 - 1);
          return task(
            level,
            `Die Summe zweier Zahlen ist ${x0 + y0}, ihre Differenz ${x0 - y0}. Stelle ein Gleichungssystem auf und bestimme beide Zahlen (die größere zuerst).`,
            [num("größere:", x0, "", 2), num("kleinere:", y0, "", 2)],
            "I: x + y = Summe, II: x − y = Differenz. Addieren.",
            [`I + II: 2x = ${2 * x0}, x = ${x0}`, `${x0} + y = ${x0 + y0}, y = ${y0}`],
            `${x0} und ${y0}`,
            { x0, y0 },
          );
        }
        const adult = rng.pick([8, 9, 10, 12, 14]);
        const child = rng.pick([3, 4, 5, 6]);
        const a1 = rng.int(1, 3);
        const c1 = rng.int(2, 4);
        const a2 = rng.int(2, 4);
        let c2 = rng.int(1, 3);
        if (a1 * c2 === a2 * c1) c2 += 1;
        return task(
          level,
          `Im Freizeitbad zahlt Familie Kaya für ${a1} ${a1 === 1 ? "Erwachsenen" : "Erwachsene"} und ${c1} Kinder ${fmtUnit(a1 * adult + c1 * child, "€")}, Familie Berger für ${a2} Erwachsene und ${c2} ${c2 === 1 ? "Kind" : "Kinder"} ${fmtUnit(a2 * adult + c2 * child, "€")}. Was kostet ein Eintritt für Erwachsene, was für Kinder?`,
          [num("Erwachsene:", adult, "€", 2), num("Kinder:", child, "€", 2)],
          "x Preis Erwachsene, y Preis Kinder. Zwei Gleichungen aufstellen und ein Verfahren wählen.",
          [`I: ${a1}x + ${c1}y = ${a1 * adult + c1 * child}`, `II: ${a2}x + ${c2}y = ${a2 * adult + c2 * child}`],
          `Erwachsene ${fmtUnit(adult, "€")}, Kinder ${fmtUnit(child, "€")}`,
          { adult, child },
        );
      },
    },
  ],
});

// 7.7 Reinquadratische Gleichungen (M9) ────────────────────────────────────

const reinquadratisch = L({
  id: "gl-7-reinquadratisch",
  title: "Reinquadratische Gleichungen",
  subtitle: "x² = d: zwei, eine oder keine Lösung",
  tracks: M_ONLY,
  whyItMatters:
    "Welche Seitenlänge hat ein quadratisches Grundstück mit 400 m²? Wie lange fällt ein Stein von einer Brücke? Steht x nur im Quadrat, hilft die Quadratwurzel aus Klasse 8, aber du musst auf beide Vorzeichen achten.",
  explanationHtml: `
    <p>Eine <strong>reinquadratische Gleichung</strong> enthält x nur als x², zum Beispiel 3x² − 48 = 0. Du bringst sie auf die Form x² = d:</p>
    <ul>
      <li>d &gt; 0: zwei Lösungen, x₁ = −√d und x₂ = √d, denn (−4)² = 4² = 16.</li>
      <li>d = 0: eine Lösung, x = 0.</li>
      <li>d &lt; 0: keine Lösung, denn ein Quadrat ist nie negativ. L = { }.</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> 3x² − 48 = 0 | + 48 | : 3 ergibt x² = 16, also L = {−4; 4}.<br>
    Umgekehrt: Zur Lösungsmenge L = {−5; 5} passt x² = 25, also zum Beispiel x² − 25 = 0 oder 2x² = 50.<br>
    Ein quadratisches Beet hat 196 m². x² = 196 ergibt x = ±14. Eine Länge ist nicht negativ, also ist die Seite 14 m lang.</div>
    <div class="merke"><strong>Merke:</strong> Auf x² = d bringen. d &gt; 0: L = {−√d; √d}; d = 0: L = {0}; d &lt; 0: L = { }. In Sachaufgaben entscheidest du, ob die negative Lösung Sinn ergibt.</div>
  `,
  formulas: [
    { name: "Reinquadratische Gleichung", html: "x² = d ⇒ x = ±√d (d &gt; 0)", quantities: "d = 0: nur x = 0; d &lt; 0: keine Lösung" },
  ],
  quiz: {
    question: "Welche Lösungsmenge hat x² + 9 = 0?",
    options: ["L = { }", "L = {−3; 3}", "L = {3}", "L = {−9}"],
    correctIndex: 0,
    explanation: "x² + 9 = 0 heißt x² = −9. Kein Quadrat ist negativ, also gibt es keine Lösung.",
  },
  lab: lab(
    "pure-quadratic",
    "Parabel und Gerade",
    "Die Gleichung a · x² = c wird zu x² = c : a. Die Lösungen sind die Stellen, an denen die Normalparabel die waagrechte Gerade y = c : a trifft.",
    [r("a", "Faktor a vor x²", 1, 5, 1, 1), r("c", "rechte Seite c", -10, 50, 8, 1)],
    [
      o("d", "x² = d mit d =", (v) => v.c / v.a, "", 2),
      o("L", "Lösungsmenge", (v) => (v.c > 0 ? `{−${fmt(Math.sqrt(v.c / v.a), 2)}; ${fmt(Math.sqrt(v.c / v.a), 2)}}` : v.c === 0 ? "{0}" : "{ }"), "", 0, true),
    ],
    [
      { id: "drei", text: "Stelle eine Gleichung mit den Lösungen −3 und 3 ein.", check: (v) => near(v.c / v.a, 9) },
      { id: "eine", text: "Stelle eine Gleichung mit genau einer Lösung ein.", check: (v) => v.c === 0 },
      { id: "keine", text: "Stelle eine Gleichung ohne Lösung ein.", check: (v) => v.c < 0 },
    ],
  ),
  exercises: [
    {
      id: "loesen",
      make: (rng, level) => {
        if (level === 1) {
          const k = rng.int(1, 12);
          const a = rng.int(1, 5);
          const c = nz(rng, -20, 20);
          const d = a * k * k;
          return {
            ...task(
            level,
            `Löse die reinquadratische Gleichung ${a === 1 ? "" : a}x² ${signed(c)} = ${fmt(d + c)} und gib beide Lösungen an.`,
            [num("x₁ =", -k, "", 2), num("x₂ =", k, "", 2)],
            "Auf x² = d bringen, dann beide Wurzeln: x = ±√d.",
            [`${a === 1 ? "" : a}x² = ${fmt(d)}${a === 1 ? "" : ` | : ${a}`}`, `x² = ${k * k}`, `x = ±√${k * k} = ±${k}`],
            `L = {−${k}; ${k}}`,
            { a, k },
            ),
            anyOrder: [0, 1],
          };
        }
        const k = rng.int(2, 15);
        const factor = rng.int(1, 4);
        const other = rng.int(1, 9);
        const kind = rng.int(0, 2);
        const shown = kind === 0 ? `${other}x² + ${other * 4} = 0` : kind === 1 ? `${other}x² = 0` : `x² − ${other * other} = 0`;
        return task(
          level,
          `Gib d so an, dass ${factor}x² = d die Lösungsmenge L = {−${k}; ${k}} hat. Wie viele Lösungen hat dagegen die Gleichung ${shown}?`,
          [num("d =", factor * k * k, "", 0, { slips: [{ value: k * k, hint: "Teile am Ende durch " + factor + ": x² = d : " + factor + " muss " + k * k + " sein." }, { value: factor * k, hint: "x² = " + k * k + ", nicht " + k + "." }] }), choiceField("Lösungen:", ["keine", "eine", "zwei"], kind === 0 ? 0 : kind === 1 ? 1 : 2)],
          "Aus x = ±k folgt x² = k², also " + factor + "x² = " + factor + " · k². Für die zweite Gleichung: auf x² = … bringen.",
          [`x² = ${k}² = ${k * k}, also ${factor}x² = ${factor * k * k}`, kind === 0 ? `${shown}: x² = −4, keine Lösung` : kind === 1 ? `${shown}: x² = 0, nur x = 0` : `${shown}: x² = ${other * other}, x = ±${other}`],
          `d = ${factor * k * k}; ${kind === 0 ? "keine Lösung" : kind === 1 ? "eine Lösung" : "zwei Lösungen"}`,
          { k, factor },
        );
      },
    },
    {
      id: "sachaufgabe",
      make: (rng, level) => {
        if (level === 1) {
          if (rng.next() < 0.5) {
            const side = rng.int(5, 30);
            return task(
              level,
              `Ein quadratisches Grundstück hat den Flächeninhalt ${side * side} m². Wie lang ist eine Seite? Warum fällt eine Lösung der Gleichung x² = ${side * side} weg?`,
              [num("Seite:", side, "m", 2), choiceField("Grund:", ["Eine Länge ist nicht negativ.", "Eine Länge ist nie größer als 20 m.", "x² hat immer nur eine Lösung."], 0)],
              "x² = A, dann die Wurzel ziehen. Nur die positive Lösung ist eine Länge.",
              [`x² = ${side * side}, x = ±${side}`, "Die negative Lösung ist keine Länge."],
              `Seite ${side} m`,
              { side },
            );
          }
          const A = rng.int(20, 300);
          const rr = Math.sqrt(A / Math.PI);
          return task(
            level,
            `Ein kreisrundes Beet soll ${A} m² groß werden. Welchen Radius muss es haben? Löse π · r² = ${A}.`,
            [num("r =", rr, "m", 2, { slips: [{ value: A / Math.PI, hint: "Das ist r². Ziehe noch die Wurzel." }] })],
            "r² = A : π, dann r = √(A : π).",
            [`r² = ${A} : π ≈ ${fmt(A / Math.PI, 2)}`, `r = √${fmt(A / Math.PI, 2)}`],
            `r ≈ ${fmtUnit(rr, "m")}`,
            { A },
          );
        }
        const t = rng.pick([1.5, 2, 2.5, 3, 4]);
        const s = 5 * t * t;
        return task(
          level,
          `Ein Stein fällt von einer ${fmt(s)} m hohen Brücke ins Wasser. Für den freien Fall gilt näherungsweise s = 5 · t² (s in m, t in s). Wie lange fällt der Stein?`,
          [num("t =", t, "s", 2, { slips: [{ value: s / 5, hint: "Das ist t². Ziehe noch die Wurzel." }, { value: -t, hint: "Eine Fallzeit ist nicht negativ." }] })],
          "t² = s : 5, dann die Wurzel; nur die positive Lösung ergibt eine Zeit.",
          [`5t² = ${fmt(s)}, t² = ${fmt(s / 5)}`, `t = ±${fmt(t)}; nur t = ${fmt(t)} s ist sinnvoll.`],
          `t = ${fmtUnit(t, "s")}`,
          { t },
        );
      },
    },
  ],
});

export const STAGE = makeStage(
  7,
  "Klammern, Brüche, Formeln und mehr: Gleichungen lösen",
  "#0891b2",
  "⚖️",
  [klammern, brueche, formeln, produkte, bruchgleichungen, gleichungssysteme, reinquadratisch],
);
