import { fmt, fracText } from "../exercises/format";
import { COLOURS } from "../lab/views-zufall";
import { diceCount, DICE_EVENTS, EVENTS, EXPERIMENTS, outcomes, setText } from "../models";
import { BOTH, choice, fractionFields, lab, M_ONLY, makeLesson, makeStage, NAMES, output as o, range as r, task } from "./builders";
import { choiceField, numberField as num } from "./helpers";

const L = (content: Parameters<typeof makeLesson>[1]) => makeLesson(6, content);
const pct = (p: number, digits = 2) => `${fmt(p * 100, digits)} %`;
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const eq = (value: number, digits = 2) => (near(value, Number(value.toFixed(digits))) ? "=" : "≈");

// 6.1 Ergebnisse und Ereignisse ────────────────────────────────────────────

const ergebnisse = L({
  id: "wk-1-ergebnisse-ereignisse",
  title: "Ergebnisse und Ereignisse",
  subtitle: "Ergebnismenge Ω und Ereignisse als Teilmengen",
  tracks: BOTH,
  whyItMatters:
    "Bevor du Chancen berechnest, musst du wissen, was alles passieren kann und worauf du wartest. Wer Ergebnisse und Ereignisse sauber aufschreibt, verzählt sich nicht beim Würfeln, Losen oder Drehen am Glücksrad.",
  explanationHtml: `
    <p>Ein <strong>Laplace-Experiment</strong> ist ein Zufallsexperiment, bei dem alle Ergebnisse gleich wahrscheinlich sind: ein fairer Würfel, ein Glücksrad mit gleich großen Feldern, eine Urne mit gleich großen Kugeln (Wiederholung aus Klasse 8).</p>
    <ul>
      <li>Alle möglichen Ergebnisse fasst man in der <strong>Ergebnismenge</strong> Ω zusammen. Beim Würfel: Ω = {1; 2; 3; 4; 5; 6}.</li>
      <li>Ein <strong>Ereignis</strong> E ist eine Auswahl von Ergebnissen, auf die du achtest, also eine Teilmenge von Ω. „Gerade Zahl würfeln“: E = {2; 4; 6}.</li>
      <li>Die Ergebnisse in E heißen <strong>günstig</strong>, alle Ergebnisse in Ω <strong>möglich</strong>.</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> Glücksrad mit den Zahlen 1 bis 8. Ω = {1; 2; 3; 4; 5; 6; 7; 8}, also 8 mögliche Ergebnisse. Ereignis „Primzahl“: E = {2; 3; 5; 7}, 4 günstige Ergebnisse. Ereignis „größer als 4“: E = {5; 6; 7; 8}.</div>
    <div class="merke"><strong>Merke:</strong> Ω enthält alle möglichen Ergebnisse, ein Ereignis E die günstigen. Schreibe Mengen mit geschweiften Klammern und Semikolon: E = {2; 4; 6}.</div>
  `,
  formulas: [
    { name: "Ergebnismenge", html: "Ω = {1; 2; 3; 4; 5; 6}", quantities: "alle möglichen Ergebnisse (hier: Würfel)" },
    { name: "Ereignis", html: "E = {2; 4; 6}", quantities: "die günstigen Ergebnisse (hier: gerade Zahl)" },
  ],
  quiz: {
    question: "Ein Glücksrad hat die Felder 1 bis 10. Welche Menge beschreibt das Ereignis „Vielfaches von 3“?",
    options: ["{3; 6; 9}", "{3; 6; 9; 12}", "{1; 3; 6; 9}", "{3}"],
    correctIndex: 0,
    explanation: "Vielfache von 3 unter den Zahlen 1 bis 10 sind 3, 6 und 9. Die 12 gibt es auf dem Glücksrad nicht.",
  },
  lab: lab(
    "outcome-set",
    "Ergebnisse auswählen",
    "Wähle ein Zufallsgerät und ein Ereignis. Orange sind die günstigen Ergebnisse, blau die übrigen.",
    [choice("exp", "Zufallsgerät", EXPERIMENTS.map((e) => e.name), 0), choice("event", "Ereignis", EVENTS.map((e) => e.name), 3)],
    [
      o("omega", "Ergebnismenge Ω", (v) => setText(outcomes(EXPERIMENTS[v.exp].n, v.event).omega)),
      o("E", "Ereignis E", (v) => setText(outcomes(EXPERIMENTS[v.exp].n, v.event).favourable), "", 0, true),
      o("anzahl", "günstige Ergebnisse", (v) => outcomes(EXPERIMENTS[v.exp].n, v.event).favourable.length, "", 0),
    ],
    [
      { id: "drei", text: "Finde beim Würfel ein Ereignis mit genau drei günstigen Ergebnissen.", check: (v) => v.exp === 0 && outcomes(6, v.event).favourable.length === 3 },
      { id: "vier", text: "Finde beim Glücksrad mit 8 Feldern ein Ereignis mit genau vier günstigen Ergebnissen, das nichts mit gerade oder ungerade zu tun hat.", check: (v) => v.exp === 1 && v.event > 1 && outcomes(8, v.event).favourable.length === 4 },
      { id: "zwei", text: "Finde bei der Urne mit 10 Kugeln ein Ereignis mit genau zwei günstigen Ergebnissen.", check: (v) => v.exp === 2 && outcomes(10, v.event).favourable.length === 2 },
    ],
  ),
  exercises: [
    {
      id: "zaehlen",
      make: (rng, level) => {
        const expIndex = rng.int(0, 3);
        const exp = EXPERIMENTS[expIndex];
        const event = rng.int(0, EVENTS.length - 1);
        const { omega, favourable } = outcomes(exp.n, event);
        if (level === 1)
          return task(
            level,
            `Zufallsgerät: ${exp.name} mit den Zahlen 1 bis ${exp.n}. Ereignis E: „${EVENTS[event].name}“. Wie viele Ergebnisse sind möglich, wie viele günstig?`,
            [num("möglich:", exp.n, "", 0), num("günstig:", favourable.length, "", 0, { slips: [{ value: exp.n - favourable.length, hint: "Das sind die Ergebnisse, die nicht zu E gehören." }] })],
            "Schreibe Ω und E als Mengen auf und zähle.",
            [`Ω = ${setText(omega)}`, `E = ${setText(favourable)}`],
            `${exp.n} möglich, ${favourable.length} günstig`,
            { expIndex, event },
          );
        const n = rng.pick([12, 16, 20]);
        const divisor = rng.pick([3, 4, 5]);
        const fav = Array.from({ length: n }, (_, i) => i + 1).filter((k) => k % divisor === 0);
        const wrong1 = [...fav, fav[fav.length - 1] + divisor];
        const wrong2 = fav.slice(1);
        return task(
          level,
          `Bei einem Schulfest gibt es ein Glücksrad mit ${n} gleich großen Feldern, nummeriert von 1 bis ${n}. Man gewinnt, wenn die Zahl durch ${divisor} teilbar ist. Welche Menge beschreibt das Ereignis „Gewinn“? Wie viele Felder bringen keinen Gewinn?`,
          [choiceField("E =", [setText(fav), setText(wrong1), setText(wrong2)], 0), num("kein Gewinn:", n - fav.length, "Felder", 0, { slips: [{ value: fav.length, hint: "Das sind die Gewinnfelder. Gefragt ist der Rest." }] })],
          "Liste alle Vielfachen bis zur größten Zahl auf dem Rad. Der Rest sind Nieten.",
          [`Vielfache von ${divisor} bis ${n}: ${setText(fav)}`, `${n} − ${fav.length} = ${n - fav.length}`],
          `E = ${setText(fav)}; ${n - fav.length} Felder ohne Gewinn`,
          { n, divisor },
        );
      },
    },
    {
      id: "beschreiben",
      make: (rng, level) => {
        if (level === 1) {
          const event = rng.int(0, EVENTS.length - 1);
          const others = EVENTS.map((_, i) => i).filter((i) => i !== event && setText(outcomes(6, i).favourable) !== setText(outcomes(6, event).favourable));
          const options = [event, ...rng.shuffle(others).slice(0, 2)].map((i) => EVENTS[i].name);
          const fav = outcomes(6, event).favourable;
          return task(
            level,
            `Beim Würfeln gilt E = ${setText(fav)}. Welche Beschreibung passt zu E? Wie viele Ergebnisse gehören nicht zu E?`,
            [choiceField("E bedeutet:", options, 0), num("nicht in E:", 6 - fav.length, "", 0)],
            "Prüfe jede Beschreibung an allen sechs Augenzahlen.",
            [`„${EVENTS[event].name}“ trifft genau auf ${setText(fav)} zu.`, `6 − ${fav.length} = ${6 - fav.length}`],
            `${EVENTS[event].name}; ${6 - fav.length} Ergebnisse nicht in E`,
            { event },
          );
        }
        const word = rng.pick(["ANANAS", "BANANE", "KAKAO", "PAPAGEI"]);
        const letter = rng.pick([...new Set(word.split(""))]);
        const count = word.split("").filter((c) => c === letter).length;
        return task(
          level,
          `Die Buchstaben des Wortes ${word} stehen auf ${word.length} gleichen Kärtchen. Eines wird blind gezogen. Wie viele Ergebnisse (Kärtchen) sind möglich? Wie viele sind günstig für das Ereignis „Buchstabe ${letter}“?`,
          [num("möglich:", word.length, "", 0, { slips: [{ value: new Set(word).size, hint: "Jedes Kärtchen ist ein eigenes Ergebnis, auch wenn Buchstaben doppelt vorkommen." }] }), num("günstig:", count, "", 0)],
          "Zähle die Kärtchen, nicht die verschiedenen Buchstaben.",
          [`${word} hat ${word.length} Buchstaben, also ${word.length} Kärtchen.`, `Der Buchstabe ${letter} kommt ${count}-mal vor.`],
          `${word.length} möglich, ${count} günstig`,
          { count },
        );
      },
    },
  ],
});

// 6.2 Wahrscheinlichkeiten bei Laplace-Experimenten ────────────────────────

const laplace = L({
  id: "wk-2-laplace",
  title: "Wahrscheinlichkeiten bei Laplace-Experimenten",
  subtitle: "günstige durch mögliche, als Bruch und in Prozent",
  tracks: BOTH,
  whyItMatters:
    "Wie groß ist die Chance auf einen Gewinn bei der Tombola? Mit dem Verhältnis von günstigen zu möglichen Ergebnissen gibst du sie als Bruch und in Prozent an, statt nur zu raten.",
  explanationHtml: `
    <p>Bei einem Laplace-Experiment ist die <strong>Wahrscheinlichkeit</strong> eines Ereignisses E das Verhältnis der günstigen zu den möglichen Ergebnissen:</p>
    <p class="formula-line">P(E) = Anzahl der günstigen Ergebnisse : Anzahl der möglichen Ergebnisse</p>
    <p>Du gibst P(E) als gekürzten Bruch, als Dezimalzahl oder in Prozent an. Es gilt immer 0 ≤ P(E) ≤ 1, also zwischen 0 % (unmöglich) und 100 % (sicher).</p>
    <p>Anschaulich zeigt ein <strong>Baumdiagramm</strong> die Ergebnisse als Äste mit ihren Wahrscheinlichkeiten. Eine <strong>Strichliste</strong> oder Tabelle hilft beim Zählen; bei vielen Versuchen liegt die relative Häufigkeit nahe bei der Wahrscheinlichkeit.</p>
    <div class="example"><strong>Beispiel:</strong> In einer Urne liegen 3 rote, 2 blaue und 1 grüne Kugel. P(rot) = 3/6 = 1/2 = 50 %. P(blau) = 2/6 = 1/3 ≈ 33,3 %. P(grün) = 1/6 ≈ 16,7 %. Die drei Äste des Baumdiagramms ergeben zusammen 1.<br>
    Ein Würfel wird 60-mal geworfen, die 6 fällt 12-mal: relative Häufigkeit 12/60 = 20 %. Die Wahrscheinlichkeit ist 1/6 ≈ 16,7 %.</div>
    <div class="merke"><strong>Merke:</strong> P(E) = günstige : mögliche. Kürze den Bruch und rechne in Prozent um. Alle Äste eines Baumdiagramms zusammen ergeben 1.</div>
  `,
  formulas: [
    { name: "Laplace-Wahrscheinlichkeit", html: "P(E) = Anzahl günstige : Anzahl mögliche", quantities: "0 ≤ P(E) ≤ 1" },
    { name: "In Prozent", html: "P(E) · 100 %", quantities: "z. B. 1/4 = 0,25 = 25 %" },
  ],
  quiz: {
    question: "In einer Lostrommel liegen 40 Lose, davon 8 Gewinne. Wie groß ist die Wahrscheinlichkeit, einen Gewinn zu ziehen?",
    options: ["20 %", "8 %", "32 %", "5 %"],
    correctIndex: 0,
    explanation: "P = 8/40 = 1/5 = 0,2 = 20 %. 8 % wäre es nur bei 100 Losen.",
  },
  lab: lab(
    "laplace-urn",
    "Die Urne",
    "Lege rote, blaue und grüne Kugeln in die Urne und wähle die Farbe, auf die du wartest. Das Baumdiagramm zeigt die Wahrscheinlichkeiten aller Farben.",
    [r("red", "rote Kugeln", 0, 10, 3, 1), r("blue", "blaue Kugeln", 0, 10, 2, 1), r("green", "grüne Kugeln", 0, 10, 1, 1), choice("target", "Ereignis: Farbe", COLOURS, 0)],
    [
      o("bruch", "P als Bruch", (v) => { const t = v.red + v.blue + v.green; return t ? fracText([v.red, v.blue, v.green][v.target], t) : "keine Kugel"; }, "", 0, true),
      o("prozent", "P in Prozent", (v) => { const t = v.red + v.blue + v.green; return t ? pct([v.red, v.blue, v.green][v.target] / t, 1) : "keine Kugel"; }),
    ],
    [
      { id: "viertel", text: "Stelle die Urne so ein, dass P(rot) = 1/4 ist.", check: (v) => { const t = v.red + v.blue + v.green; return t > 0 && near(v.red / t, 0.25) && v.target === 0; } },
      { id: "gleich", text: "Mache alle drei Farben gleich wahrscheinlich.", check: (v) => v.red > 0 && v.red === v.blue && v.blue === v.green },
      { id: "sechzig", text: "Erzeuge für die gewählte Farbe eine Wahrscheinlichkeit von genau 60 %.", check: (v) => { const t = v.red + v.blue + v.green; return t > 0 && near([v.red, v.blue, v.green][v.target] / t, 0.6); } },
    ],
  ),
  exercises: [
    {
      id: "urne",
      make: (rng, level) => {
        if (level === 1) {
          const counts = [rng.int(1, 9), rng.int(1, 9), rng.int(0, 6)];
          const total = counts[0] + counts[1] + counts[2];
          const target = rng.int(0, counts[2] ? 2 : 1);
          const fav = counts[target];
          return task(
            level,
            `In einer Urne liegen ${counts[0]} rote, ${counts[1]} blaue und ${counts[2]} grüne Kugeln. Eine wird blind gezogen. Gib P(${COLOURS[target]}) als gekürzten Bruch und in Prozent an.`,
            [...fractionFields(fav, total), num("in %:", (fav / total) * 100, "%", 1, { slips: [{ value: fav, hint: "Das ist die Anzahl der günstigen Kugeln. Teile durch die Anzahl aller Kugeln." }] })],
            "P = günstige : mögliche. Mögliche Ergebnisse sind alle Kugeln.",
            [`möglich: ${counts[0]} + ${counts[1]} + ${counts[2]} = ${total}`, `P(${COLOURS[target]}) = ${fav}/${total} = ${fracText(fav, total)}`],
            `${fracText(fav, total)} ${eq((fav / total) * 100, 1)} ${pct(fav / total, 1)}`,
            { fav, total },
          );
        }
        const total = rng.pick([50, 80, 100, 120, 150, 200]);
        const wins = rng.pick([5, 8, 10, 12, 15, 20, 25, 30].filter((w) => w < total));
        const p = wins / total;
        return task(
          level,
          `Bei der Tombola des Sportvereins sind ${total} Lose in der Trommel, davon ${wins} Gewinnlose. ${rng.pick(NAMES)} zieht das erste Los. Wie groß ist die Gewinnwahrscheinlichkeit in Prozent? Wie viele Nieten sind in der Trommel?`,
          [num("Gewinn:", p * 100, "%", 2, { slips: [{ value: wins, hint: "Prozent heißt von hundert: Teile die Gewinnlose durch alle Lose." }] }), num("Nieten:", total - wins, "", 0)],
          "P = Gewinnlose : alle Lose. Nieten = alle Lose − Gewinnlose.",
          [`P = ${wins}/${total} = ${fracText(wins, total)} = ${fmt(p, 4)}`, `Nieten: ${total} − ${wins}`],
          `${pct(p)} Gewinnchance, ${total - wins} Nieten`,
          { total, wins },
        );
      },
    },
    {
      id: "baum-strichliste",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.pick([6, 8, 10, 12]);
          const red = rng.int(1, n - 3);
          const blue = rng.int(1, n - red - 1);
          const yellow = n - red - blue;
          return task(
            level,
            `Ein Glücksrad hat ${n} gleich große Felder: ${red} rote, ${blue} blaue und ${yellow} gelbe. Zeichne ein einstufiges Baumdiagramm. Wie groß ist die Wahrscheinlichkeit für „rot oder blau“?`,
            [...fractionFields(red + blue, n), num("in %:", ((red + blue) / n) * 100, "%", 1)],
            "Die Äste für rot und blau werden addiert: (rot + blau) : alle Felder.",
            [`Äste: rot ${fracText(red, n)}, blau ${fracText(blue, n)}, gelb ${fracText(yellow, n)}`, `P(rot oder blau) = ${red}/${n} + ${blue}/${n} = ${red + blue}/${n}`],
            `${fracText(red + blue, n)} ${eq(((red + blue) / n) * 100, 1)} ${pct((red + blue) / n, 1)}`,
            { n, red, blue },
          );
        }
        const throws = rng.pick([30, 60, 90, 120]);
        const sixes = Math.round(throws / 6) + rng.pick([-4, -2, 2, 4, 6]);
        return task(
          level,
          `Mehmet würfelt ${throws}-mal und führt eine Strichliste. Die Sechs hat ${sixes} Striche. Wie groß ist die relative Häufigkeit der Sechs in Prozent? Wie groß ist die Wahrscheinlichkeit einer Sechs bei einem fairen Würfel?`,
          [num("relative Häufigkeit:", (sixes / throws) * 100, "%", 1), num("Wahrscheinlichkeit:", 100 / 6, "%", 1, { slips: [{ value: (sixes / throws) * 100, hint: "Das ist die beobachtete Häufigkeit. Die Wahrscheinlichkeit folgt aus günstig : möglich." }] })],
          "Relative Häufigkeit = Anzahl : Würfe. Wahrscheinlichkeit = 1 : 6.",
          [`${sixes} : ${throws} = ${fmt(sixes / throws, 4)}`, `P(6) = 1/6 ≈ ${pct(1 / 6, 1)}`],
          `${pct(sixes / throws, 1)} beobachtet; ${pct(1 / 6, 1)} Wahrscheinlichkeit`,
          { throws, sixes },
        );
      },
    },
  ],
});

// 6.3 Gegenereignis und Chancen ────────────────────────────────────────────

const gegenereignis = L({
  id: "wk-3-gegenereignis",
  title: "Gegenereignis und Chancen",
  subtitle: "P(Ē) = 1 − P(E)",
  tracks: BOTH,
  whyItMatters:
    "Ist ein Spiel fair, oder gewinnt am Ende immer der Veranstalter? Wer die Wahrscheinlichkeiten von Ereignis und Gegenereignis vergleicht, beurteilt seine Chancen, bevor er einsetzt.",
  explanationHtml: `
    <p>Das <strong>Gegenereignis</strong> Ē von E besteht aus allen Ergebnissen, die nicht zu E gehören. Beim Würfeln ist das Gegenereignis von „gerade Zahl“ das Ereignis „ungerade Zahl“, von „eine 6“ das Ereignis „keine 6“.</p>
    <p>E und Ē zusammen enthalten alle Ergebnisse. Darum gilt:</p>
    <p class="formula-line">P(Ē) = 1 − P(E)</p>
    <p><strong>Chancen beurteilen:</strong> Ist P(E) größer als P(Ē), ist E wahrscheinlicher. Ein Spiel zwischen zwei Personen ist fair, wenn beide dieselbe Gewinnwahrscheinlichkeit haben.</p>
    <div class="example"><strong>Beispiel:</strong> E: „Augenzahl größer als 2“, also E = {3; 4; 5; 6}, P(E) = 4/6 = 2/3. Gegenereignis Ē: „Augenzahl höchstens 2“, Ē = {1; 2}, P(Ē) = 1 − 2/3 = 1/3.<br>
    Ein Glücksrad mit 10 Feldern hat 3 Gewinnfelder. P(Gewinn) = 30 %, P(kein Gewinn) = 70 %. Verlieren ist mehr als doppelt so wahrscheinlich wie Gewinnen.</div>
    <div class="merke"><strong>Merke:</strong> P(Ē) = 1 − P(E) bzw. 100 % − P(E). Vergleiche P(E) und P(Ē), um Chancen zu beurteilen. Fair ist ein Spiel für zwei, wenn beide Wahrscheinlichkeiten 50 % sind.</div>
  `,
  formulas: [
    { name: "Gegenereignis", html: "P(Ē) = 1 − P(E)", quantities: "Ē: alle Ergebnisse, die nicht zu E gehören" },
  ],
  quiz: {
    question: "Die Wahrscheinlichkeit, bei einem Spiel zu gewinnen, beträgt 35 %. Wie groß ist die Wahrscheinlichkeit, nicht zu gewinnen?",
    options: ["65 %", "35 %", "−35 %", "50 %"],
    correctIndex: 0,
    explanation: "Gewinnen und Nichtgewinnen sind Gegenereignisse: 100 % − 35 % = 65 %.",
  },
  lab: lab(
    "wheel-fair",
    "Gewinnen oder nicht?",
    "Stelle die Zahl der Felder und der Gewinnfelder ein. Die Balken vergleichen Ereignis und Gegenereignis.",
    [r("n", "Felder insgesamt", 2, 12, 6, 1), r("k", "Gewinnfelder", 0, 12, 1, 1)],
    [
      o("pE", "P(Gewinn)", (v) => pct(Math.min(v.k, v.n) / v.n, 1), "", 0, true),
      o("pG", "P(kein Gewinn)", (v) => pct(1 - Math.min(v.k, v.n) / v.n, 1)),
    ],
    [
      { id: "fair", text: "Mache das Spiel fair: Gewinn und kein Gewinn gleich wahrscheinlich, mit 10 Feldern.", check: (v) => v.n === 10 && v.k === 5 },
      { id: "dreiviertel", text: "Stelle ein Rad ein, bei dem das Gegenereignis die Wahrscheinlichkeit 75 % hat.", check: (v) => v.k <= v.n && near(1 - v.k / v.n, 0.75) },
      { id: "besser", text: "Bei 10 Feldern: Mache Gewinnen wahrscheinlicher als Verlieren, mit so wenigen Gewinnfeldern wie möglich.", check: (v) => v.n === 10 && v.k === 6 },
    ],
  ),
  exercises: [
    {
      id: "gegenereignis",
      make: (rng, level) => {
        if (level === 1) {
          const k = rng.int(1, 5);
          const p = (6 - k) / 6;
          return task(
            level,
            `Beim Würfeln ist E: „Augenzahl größer als ${k}“. Beschreibe das Gegenereignis und berechne P(E) und P(Ē) in Prozent.`,
            [choiceField("Ē:", [`Augenzahl höchstens ${k}`, `Augenzahl kleiner als ${k}`, `Augenzahl größer als ${6 - k}`], 0), num("P(E) =", p * 100, "%", 1), num("P(Ē) =", (1 - p) * 100, "%", 1, { slips: [{ value: p * 100, hint: "Das ist P(E). P(Ē) = 100 % − P(E)." }] })],
            "Ē enthält alle Augenzahlen, die nicht zu E gehören. P(Ē) = 1 − P(E).",
            [`E = ${setText(Array.from({ length: 6 - k }, (_, i) => k + 1 + i))}, P(E) = ${fracText(6 - k, 6)}`, `Ē = ${setText(Array.from({ length: k }, (_, i) => i + 1))}, P(Ē) = 1 − ${fracText(6 - k, 6)} = ${fracText(k, 6)}`],
            `Ē: höchstens ${k}; P(E) ${eq(p * 100, 1)} ${pct(p, 1)}, P(Ē) ${eq((1 - p) * 100, 1)} ${pct(1 - p, 1)}`,
            { k },
          );
        }
        const every = rng.pick([3, 4, 5, 8, 10]);
        const p = 1 / every;
        return task(
          level,
          `Eine Losbude wirbt: „Jedes ${every}. Los gewinnt!“ Das bedeutet eine Gewinnwahrscheinlichkeit von 1/${every}. Wie groß ist die Wahrscheinlichkeit für eine Niete in Prozent? Ist ein Gewinn oder eine Niete wahrscheinlicher?`,
          [num("P(Niete) =", (1 - p) * 100, "%", 1, { slips: [{ value: p * 100, hint: "Das ist die Gewinnwahrscheinlichkeit. Die Niete ist das Gegenereignis." }] }), choiceField("wahrscheinlicher:", ["eine Niete", "ein Gewinn", "beides gleich"], 0)],
          "Niete ist das Gegenereignis zu Gewinn: 1 − P(Gewinn).",
          [`P(Gewinn) = 1/${every} ${eq(p * 100, 1)} ${pct(p, 1)}`, `P(Niete) = 1 − 1/${every} = ${fracText(every - 1, every)}`],
          `${eq((1 - p) * 100, 1)} ${pct(1 - p, 1)}; eine Niete ist wahrscheinlicher`,
          { every },
        );
      },
    },
    {
      id: "chancen",
      make: (rng, level) => {
        if (level === 1) {
          const dieWin = rng.int(1, 4);
          const n = rng.pick([8, 10, 12]);
          let k = rng.int(1, n - 1);
          while (near(k / n, dieWin / 6)) k = rng.int(1, n - 1);
          const better = dieWin / 6 > k / n ? 0 : 1;
          return task(
            level,
            `Spiel A: Du gewinnst, wenn du eine Zahl bis ${dieWin} würfelst. Spiel B: Ein Glücksrad hat ${n} gleiche Felder, ${k} davon gewinnen. Berechne beide Gewinnwahrscheinlichkeiten in Prozent. Wo sind deine Chancen besser?`,
            [num("P(A) =", (dieWin / 6) * 100, "%", 1), num("P(B) =", (k / n) * 100, "%", 1), choiceField("besser:", ["Spiel A", "Spiel B"], better)],
            "Für jedes Spiel: günstige : mögliche. Dann vergleichen.",
            [`P(A) = ${dieWin}/6 ≈ ${pct(dieWin / 6, 1)}`, `P(B) = ${k}/${n} ${eq((k / n) * 100, 1)} ${pct(k / n, 1)}`],
            `Spiel ${better === 0 ? "A" : "B"} ist günstiger.`,
            { dieWin, n, k },
          );
        }
        const n = rng.pick([6, 8, 10, 12]);
        const k = rng.int(1, n - 1);
        const verdict = 2 * k === n ? 0 : 2 * k > n ? 1 : 2;
        const [a, b] = rng.shuffle(NAMES).slice(0, 2);
        return task(
          level,
          `${a} und ${b} drehen ein Glücksrad mit ${n} gleich großen Feldern. ${k} Felder sind rot: Dann gewinnt ${a}. Bei allen anderen Feldern gewinnt ${b}. Wie groß ist die Wahrscheinlichkeit, dass ${b} gewinnt? Ist das Spiel fair?`,
          [num(`P(${b}) =`, ((n - k) / n) * 100, "%", 1, { slips: [{ value: (k / n) * 100, hint: `Das ist die Chance von ${a}. ${b} gewinnt beim Gegenereignis.` }] }), choiceField("Das Spiel …", [`ist fair`, `begünstigt ${a}`, `begünstigt ${b}`], verdict)],
          `${b} gewinnt beim Gegenereignis von „rot“. Fair ist das Spiel nur bei gleichen Wahrscheinlichkeiten.`,
          [`P(${a}) = ${k}/${n}`, `P(${b}) = 1 − ${k}/${n} = ${fracText(n - k, n)}`],
          `P(${b}) ${eq(((n - k) / n) * 100, 1)} ${pct((n - k) / n, 1)}; ${["fair", `begünstigt ${a}`, `begünstigt ${b}`][verdict]}`,
          { n, k },
        );
      },
    },
  ],
});

// 6.4 Zwei Würfel (M9) ─────────────────────────────────────────────────────

const zweiWuerfel = L({
  id: "wk-4-zwei-wuerfel",
  title: "Zwei Würfel: 36 Ergebnisse",
  subtitle: "Ergebnistabelle, Augensumme und Pasch",
  tracks: M_ONLY,
  whyItMatters:
    "Viele Brettspiele werfen zwei Würfel. Warum kommt die 7 so oft, die 12 so selten? Mit einer Tabelle aller 36 Ergebnisse beurteilst du auch anspruchsvollere Chancen genau.",
  explanationHtml: `
    <p>Wirfst du zwei <strong>unterscheidbare</strong> Würfel (zum Beispiel rot und blau), ist ein Ergebnis ein Paar (rot | blau). Es gibt 6 · 6 = <strong>36</strong> gleich wahrscheinliche Ergebnisse; (2 | 5) und (5 | 2) sind verschieden. Eine <strong>Ergebnistabelle</strong> mit 6 Zeilen und 6 Spalten zeigt alle.</p>
    <ul>
      <li>Augensumme 7: (1 | 6), (2 | 5), (3 | 4), (4 | 3), (5 | 2), (6 | 1), also 6 günstige Ergebnisse: P = 6/36 = 1/6.</li>
      <li>Augensumme 12: nur (6 | 6), P = 1/36.</li>
      <li>Pasch (beide gleich): 6 Ergebnisse, P = 1/6.</li>
    </ul>
    <p>Bei schwierigen Ereignissen hilft oft das Gegenereignis: „mindestens eine 6“ hat das Gegenereignis „keine 6“ mit 5 · 5 = 25 Ergebnissen. Also P(mindestens eine 6) = 1 − 25/36 = 11/36.</p>
    <div class="example"><strong>Beispiel:</strong> Lisa gewinnt bei Augensumme 6, 7 oder 8, Tim bei allen anderen. Günstig für Lisa: 5 + 6 + 5 = 16 Ergebnisse, P = 16/36 ≈ 44,4 %. Für Tim: 20/36 ≈ 55,6 %. Tim hat die besseren Chancen.</div>
    <div class="merke"><strong>Merke:</strong> Zwei unterscheidbare Würfel haben 36 gleich wahrscheinliche Ergebnisse. Zähle die günstigen in der Tabelle; bei „mindestens …“ ist das Gegenereignis oft schneller.</div>
  `,
  formulas: [
    { name: "Zwei Würfel", html: "6 · 6 = 36 Ergebnisse", quantities: "Paare (rot | blau), alle gleich wahrscheinlich" },
    { name: "Mindestens eine 6", html: "1 − 25/36 = 11/36", quantities: "über das Gegenereignis „keine 6“" },
  ],
  quiz: {
    question: "Zwei unterscheidbare Würfel werden geworfen. Wie groß ist die Wahrscheinlichkeit für die Augensumme 4?",
    options: ["3/36 = 1/12", "1/11", "2/36", "4/36"],
    correctIndex: 0,
    explanation: "Augensumme 4: (1 | 3), (2 | 2), (3 | 1). Das sind 3 von 36 Ergebnissen. Die 11 Summen von 2 bis 12 sind nicht gleich wahrscheinlich.",
  },
  lab: lab(
    "two-dice",
    "Die Ergebnistabelle",
    "Jedes Kästchen ist ein Ergebnis: Zeile rot, Spalte blau. Wähle ein Ereignis; grün sind die günstigen Ergebnisse.",
    [choice("type", "Ereignis", DICE_EVENTS, 0), r("s", "Augensumme s", 2, 12, 4, 1)],
    [
      o("count", "günstige Ergebnisse", (v) => diceCount(v.type, v.s), "", 0),
      o("P", "Wahrscheinlichkeit", (v) => `${fracText(diceCount(v.type, v.s), 36)} ≈ ${pct(diceCount(v.type, v.s) / 36, 1)}`, "", 0, true),
    ],
    [
      { id: "sieben", text: "Finde die Augensumme, die am wahrscheinlichsten ist.", check: (v) => v.type === 0 && v.s === 7 },
      { id: "pasch", text: "Zeige alle Pasche. Wie wahrscheinlich ist ein Pasch?", check: (v) => v.type === 2 },
      { id: "gegen", text: "Finde ein Ereignis, dessen Gegenereignis die Wahrscheinlichkeit 25/36 hat.", check: (v) => diceCount(v.type, v.s) === 11 },
    ],
  ),
  exercises: [
    {
      id: "summe",
      make: (rng, level) => {
        if (level === 1) {
          const s = rng.int(2, 12);
          const c = diceCount(0, s);
          return task(
            level,
            `Zwei unterscheidbare Würfel werden geworfen. Wie viele Ergebnisse haben die Augensumme ${s}? Gib P(Augensumme ${s}) als gekürzten Bruch an.`,
            [num("günstig:", c, "", 0), ...fractionFields(c, 36)],
            "Zähle alle Paare (rot | blau) mit der Summe; (1 | 3) und (3 | 1) sind verschieden. Möglich sind 36.",
            [`Paare: ${Array.from({ length: 6 }, (_, i) => i + 1).filter((rr) => s - rr >= 1 && s - rr <= 6).map((rr) => `(${rr} | ${s - rr})`).join(", ")}`, `P = ${c}/36`],
            `${c} Ergebnisse, P = ${fracText(c, 36)}`,
            { s },
          );
        }
        const s = rng.int(8, 11);
        const c = diceCount(1, s);
        return task(
          level,
          `Bei einem Spiel darf man mit zwei Würfeln noch einmal würfeln, wenn die Augensumme mindestens ${s} beträgt. Wie viele der 36 Ergebnisse sind günstig? Wie groß ist die Wahrscheinlichkeit, nicht noch einmal würfeln zu dürfen (in Prozent)?`,
          [num("günstig:", c, "", 0), num("P(nicht) =", ((36 - c) / 36) * 100, "%", 1, { slips: [{ value: (c / 36) * 100, hint: "Gefragt ist das Gegenereignis: 1 − P(E)." }] })],
          "Zähle die Summen von s bis 12 in der Tabelle. Dann Gegenereignis: 1 − P(E).",
          [`günstig: ${Array.from({ length: 13 - s }, (_, i) => s + i).map((t) => diceCount(0, t)).join(" + ")} = ${c}`, `P(nicht) = 1 − ${c}/36 = ${fracText(36 - c, 36)}`],
          `${c} günstig; P(nicht) ≈ ${pct((36 - c) / 36, 1)}`,
          { s },
        );
      },
    },
    {
      id: "vergleich",
      make: (rng, level) => {
        if (level === 1) {
          const type = rng.pick([2, 3, 4]);
          const c = diceCount(type, 7);
          return task(
            level,
            `Zwei unterscheidbare Würfel: Wie viele Ergebnisse gehören zum Ereignis „${DICE_EVENTS[type]}“? Wie groß ist die Wahrscheinlichkeit in Prozent?`,
            [num("günstig:", c, "", 0), num("P =", (c / 36) * 100, "%", 1)],
            type === 3 ? "Nutze das Gegenereignis „keine 6“: 5 · 5 Ergebnisse." : "Zähle in der Ergebnistabelle.",
            [type === 3 ? `keine 6: 5 · 5 = 25, also 36 − 25 = ${c}` : `günstig: ${c}`, `P = ${c}/36 = ${fracText(c, 36)}`],
            `${c} Ergebnisse, P ≈ ${pct(c / 36, 1)}`,
            { type },
          );
        }
        const width = rng.pick([3, 4]);
        const low = width === 3 ? rng.int(4, 8) : rng.int(5, 6);
        const sums = Array.from({ length: width }, (_, i) => low + i);
        const c = sums.reduce((n, t) => n + diceCount(0, t), 0);
        const [a, b] = rng.shuffle(NAMES).slice(0, 2);
        const better = c > 18 ? 0 : c < 18 ? 1 : 2;
        return task(
          level,
          `${a} gewinnt bei der Augensumme ${sums.slice(0, -1).join(", ")} oder ${sums[sums.length - 1]}, ${b} bei allen anderen Summen. Berechne die Gewinnwahrscheinlichkeit von ${a} in Prozent. Wer hat die besseren Chancen?`,
          [num(`P(${a}) =`, (c / 36) * 100, "%", 1, { slips: [{ value: (3 / 11) * 100, hint: "Die Summen 2 bis 12 sind nicht gleich wahrscheinlich: Zähle die Paare." }] }), choiceField("bessere Chancen:", [a, b, "beide gleich"], better)],
          "Zähle für jede der drei Summen die Paare und addiere. Vergleiche mit dem Gegenereignis.",
          [`günstig: ${sums.map((t) => diceCount(0, t)).join(" + ")} = ${c}`, `P(${a}) = ${c}/36, P(${b}) = ${36 - c}/36`],
          `P(${a}) ≈ ${pct(c / 36, 1)}; ${better === 2 ? "beide gleich" : `${[a, b][better]} hat die besseren Chancen`}`,
          { low },
        );
      },
    },
  ],
});

export const STAGE = makeStage(
  6,
  "Ergebnisse, Ereignisse, Laplace-Wahrscheinlichkeiten und Chancen",
  "#db2777",
  "🎲",
  [ergebnisse, laplace, gegenereignis, zweiWuerfel],
);

