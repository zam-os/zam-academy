import { fmt, fmtUnit, frac, fracText, round } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import { RELATIONS } from "../lab/views-zinsen";
import {
  compound,
  compoundTable,
  days360,
  daysFor,
  effectiveRate,
  factorOf,
  interest,
  MONTHS,
  rateFor,
  yearInterest,
} from "../models";
import {
  BOTH,
  choice,
  lab,
  M_ONLY,
  makeLesson,
  makeStage,
  NAMES,
  output as o,
  range as r,
  task,
} from "./builders";
import { choiceField, numberField as num } from "./helpers";

const L = (content: Parameters<typeof makeLesson>[1]) => makeLesson(1, content);
const euro = (value: number) => fmtUnit(value, "€", 2);
const pct = (value: number, digits = 2) => `${fmt(value, digits)} %`;
const same = (a: number, b: number) => Math.abs(a - b) < 1e-9;

/** Savings rates that give whole cents on multiples of 100 €. */
const SAVE_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 3, 3.5, 4, 4.5];
/** Credit rates. */
const CREDIT_RATES = [3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

// 1.1 Kapital, Zinsen, Zinssatz ────────────────────────────────────────────

const jahreszinsen = L({
  id: "zi-1-jahreszinsen",
  title: "Kapital, Zinsen, Zinssatz",
  subtitle: "Die Grundaufgaben der Prozentrechnung heißen jetzt Zinsrechnung",
  tracks: BOTH,
  whyItMatters:
    "Wer Geld spart, bekommt Zinsen; wer Geld leiht, zahlt Zinsen. Mit den drei Grundaufgaben der Prozentrechnung, die du aus den Klassen 7 und 8 kennst, rechnest du beides aus und erkennst, ob ein Angebot gut ist.",
  explanationHtml: `
    <p>In der Zinsrechnung tragen die Größen der Prozentrechnung neue Namen:</p>
    <table class="mini">
      <tr><th>Prozentrechnung</th><th>Zinsrechnung</th></tr>
      <tr><td>Grundwert G (100 %)</td><td><strong>Kapital K</strong>: das angelegte oder geliehene Geld</td></tr>
      <tr><td>Prozentsatz p %</td><td><strong>Zinssatz p %</strong>: wie viel Prozent des Kapitals es in einem Jahr als Zinsen gibt</td></tr>
      <tr><td>Prozentwert W</td><td><strong>Jahreszinsen Z</strong>: der Betrag, den die Bank nach einem Jahr zahlt oder verlangt</td></tr>
      <tr><td>(gab es nicht)</td><td><strong>Zeit t</strong>: wie lange das Geld angelegt ist, hier genau ein Jahr</td></tr>
    </table>
    <p>Die drei Grundaufgaben der Prozentrechnung sind damit auch die Grundaufgaben der Zinsrechnung: Gesucht sind die Zinsen, das Kapital oder der Zinssatz. Du rechnest mit dem Dreisatz über 1 % oder mit der Formel.</p>
    <div class="example"><strong>Beispiel:</strong> Lena legt 2.400 € für ein Jahr zu 1,5 % an. 1 % von 2.400 € sind 24 €, also sind 1,5 % genau 1,5 · 24 € = 36 €. Mit der Formel: Z = 2.400 € · 1,5 : 100 = 36 €. Nach einem Jahr hat Lena 2.436 €.<br>
    Rückwärts: Welches Kapital bringt bei 2 % genau 50 € Zinsen? 2 % sind 50 €, 1 % sind 25 €, 100 % sind 2.500 €.</div>
    <p>Kurzweg mit einem Faktor: 1,5 % = 1,5/100 = 0,015. Also Z = 2.400 € · 0,015 = 36 €.</p>
    <div class="merke"><strong>Merke:</strong> Jahreszinsen Z = K · p : 100. Umgestellt: K = Z · 100 : p und p = Z · 100 : K. Das Kapital ist immer der Grundwert, also 100 %.</div>
  `,
  formulas: [
    { name: "Jahreszinsen", html: `Z = K · ${frac("p", 100)}`, quantities: "K Kapital, p Zinssatz in %, Z Zinsen für ein Jahr" },
    { name: "Kapital und Zinssatz", html: "K = Z · 100 : p; p = Z · 100 : K", quantities: "die Grundaufgaben der Prozentrechnung, rückwärts gerechnet" },
  ],
  quiz: {
    question: "800 € werden ein Jahr lang zu 2 % angelegt. Wie viel Zinsen gibt es?",
    options: ["16 €", "160 €", "816 €", "1,60 €"],
    correctIndex: 0,
    explanation:
      "1 % von 800 € sind 8 €, also sind 2 % genau 16 €. 816 € ist der Kontostand nach einem Jahr, 160 € wären 20 %.",
  },
  lab: lab(
    "interest-hundred",
    "Das Hunderterfeld",
    "Die 100 Felder sind das Kapital. Jedes Feld ist 1 %. Verändere das Kapital mit dem Regler und den Zinssatz mit dem Punkt unten: Die orangen Felder sind die Jahreszinsen.",
    [r("K", "Kapital K", 500, 6000, 1000, 100, "€"), r("p", "Zinssatz p", 0.5, 6, 1.5, 0.25, "%")],
    [
      o("eins", "1 % des Kapitals", (v) => v.K / 100, "€", 2),
      o("Z", "Jahreszinsen Z", (v) => yearInterest(v.K, v.p), "€", 2, true),
      o("ende", "Kontostand nach 1 Jahr", (v) => v.K + yearInterest(v.K, v.p), "€", 2),
    ],
    [
      { id: "fuenfzig", text: "Stelle bei 2 % ein Kapital ein, das genau 50 € Zinsen im Jahr bringt.", check: (v) => v.p === 2 && same(yearInterest(v.K, v.p), 50) },
      { id: "satz", text: "3.000 € sollen in einem Jahr 75 € Zinsen bringen. Stelle den passenden Zinssatz ein.", check: (v) => v.K === 3000 && same(yearInterest(v.K, v.p), 75) },
      { id: "unter-drei", text: "Erzeuge genau 120 € Zinsen mit einem Zinssatz unter 3 %.", check: (v) => v.p < 3 && same(yearInterest(v.K, v.p), 120) },
    ],
  ),
  exercises: [
    {
      id: "zinsen",
      make: (rng, level) => {
        const K = 100 * rng.int(5, 60);
        const p = rng.pick(SAVE_RATES);
        const Z = yearInterest(K, p);
        const slips = [
          { value: K * p, hint: "Du hast mit p malgenommen, aber nicht durch 100 geteilt: p % sind p Hundertstel." },
          { value: K + Z, hint: "Das ist der Kontostand nach einem Jahr. Gefragt sind nur die Zinsen." },
          { value: K / p, hint: "Teile nicht durch p. Rechne erst 1 % = K : 100, dann mal p." },
        ];
        const steps = [`1 % von ${euro(K)} = ${euro(K)} : 100 = ${euro(K / 100)}`, `${pct(p)} = ${fmt(p)} · ${euro(K / 100)} = ${euro(Z)}`];
        if (level === 1)
          return task(
            level,
            `Ein Kapital von ${euro(K)} wird ein Jahr lang zu ${pct(p)} verzinst. Berechne die Jahreszinsen.`,
            [num("Z =", Z, "€", 2, { slips })],
            "Z = K · p : 100, oder erst 1 % = K : 100 und dann mal p.",
            steps,
            `Z = ${euro(Z)}`,
            { K, p },
            [`K = ${euro(K)}`, `p = ${pct(p)}`, "t = 1 Jahr"],
          );
        const name = rng.pick(NAMES);
        return task(
          level,
          `${name} legt ${euro(K)} für ein Jahr auf einem Festgeldkonto an. Die Bank zahlt ${pct(p)} Zinsen. Wie viel Zinsen bekommt ${name}, und wie viel Geld ist nach einem Jahr auf dem Konto?`,
          [num("Zinsen:", Z, "€", 2, { slips: slips.slice(0, 1).concat(slips.slice(2)) }), num("Kontostand:", K + Z, "€", 2, { slips: [{ value: Z, hint: "Zum Kontostand gehört auch das angelegte Kapital." }] })],
          "Die Zinsen sind p % des Kapitals; der Kontostand ist Kapital plus Zinsen.",
          [...steps, `Kontostand: ${euro(K)} + ${euro(Z)} = ${euro(K + Z)}`],
          `${euro(Z)} Zinsen, Kontostand ${euro(K + Z)}`,
          { K, p },
        );
      },
    },
    {
      id: "rueckwaerts",
      make: (rng, level) => {
        const wantsCapital = rng.next() < 0.5;
        if (level === 1) {
          const K = 100 * rng.int(5, 60);
          const p = rng.pick(SAVE_RATES);
          const Z = yearInterest(K, p);
          if (wantsCapital)
            return task(
              level,
              `Bei einem Zinssatz von ${pct(p)} bringt ein Kapital in einem Jahr ${euro(Z)} Zinsen. Wie groß ist das Kapital?`,
              [num("K =", K, "€", 2, { slips: [{ value: Z * p, hint: "Gesucht ist der Grundwert: Teile durch p und nimm mal 100." }, { value: Z * 100, hint: "Das wären die Zinsen von 1 %. Teile noch durch p." }, { value: (Z * p) / 100, hint: "Rückwärts heißt: K = Z · 100 : p." }] })],
              "K = Z · 100 : p, oder: p % sind Z, 1 % ist Z : p, 100 % sind 100-mal so viel.",
              [`${pct(p)} ≙ ${euro(Z)}`, `1 % ≙ ${euro(Z)} : ${fmt(p)} = ${euro(Z / p)}`, `100 % ≙ 100 · ${euro(Z / p)}`],
              `K = ${euro(K)}`,
              { K, p },
              [`Z = ${euro(Z)}`, `p = ${pct(p)}`, "t = 1 Jahr"],
            );
          return task(
            level,
            `Ein Kapital von ${euro(K)} bringt in einem Jahr ${euro(Z)} Zinsen. Berechne den Zinssatz.`,
            [num("p =", p, "%", 2, { slips: [{ value: Z / K, hint: "Das ist der Anteil als Dezimalzahl. Mal 100 ergibt Prozent." }, { value: K / Z, hint: "Teile die Zinsen durch das Kapital, nicht umgekehrt." }] })],
            "p = Z · 100 : K: Welcher Anteil des Kapitals sind die Zinsen?",
            [`Z : K = ${euro(Z)} : ${euro(K)} = ${fmt(Z / K, 4)}`, `${fmt(Z / K, 4)} = ${pct(p)}`],
            `p = ${pct(p)}`,
            { K, p },
            [`K = ${euro(K)}`, `Z = ${euro(Z)}`, "t = 1 Jahr"],
          );
        }
        if (wantsCapital) {
          const K = 500 * rng.int(2, 24);
          const p = rng.pick(SAVE_RATES);
          const Z = yearInterest(K, p);
          const name = rng.pick(NAMES);
          return task(
            level,
            `${name} möchte von den Zinsen eines Sparkontos jedes Jahr ${euro(Z)} bekommen, ohne das Kapital anzurühren. Die Bank zahlt ${pct(p)} Zinsen im Jahr. Wie viel Geld muss ${name} anlegen?`,
            [num("Kapital:", K, "€", 2, { slips: [{ value: Z * p, hint: "Die Zinsen sind nur p % des Kapitals. Das Kapital ist der Grundwert." }, { value: Z * 100, hint: "Das wäre bei 1 % richtig. Teile noch durch p." }] })],
            "Die Zinsen sind der Prozentwert, gesucht ist der Grundwert: K = Z · 100 : p.",
            [`${pct(p)} ≙ ${euro(Z)}`, `K = ${euro(Z)} · 100 : ${fmt(p)}`],
            `${name} muss ${euro(K)} anlegen.`,
            { K, p },
          );
        }
        const K = 500 * rng.int(2, 30);
        const p = rng.pick(CREDIT_RATES);
        const Z = yearInterest(K, p);
        return task(
          level,
          `Herr Weber leiht sich für ein Jahr ${euro(K)} für eine neue Küche. Am Ende des Jahres zahlt er die ${euro(K)} zurück und dazu ${euro(Z)} Zinsen. Welchen Zinssatz verlangt die Bank?`,
          [num("Zinssatz:", p, "%", 2, { slips: [{ value: Z / K, hint: "Das ist der Anteil als Dezimalzahl. Mal 100 ergibt Prozent." }, { value: ((K + Z) / K) * 100, hint: "Rechne nur mit den Zinsen, nicht mit dem ganzen Rückzahlungsbetrag." }] })],
          "p = Z · 100 : K. Das Kapital ist die geliehene Summe.",
          [`p = ${euro(Z)} · 100 : ${euro(K)}`],
          `Die Bank verlangt ${pct(p)}.`,
          { K, p },
        );
      },
    },
  ],
});

// 1.2 Zinsen für Monate und Tage ────────────────────────────────────────────

const monatsTageszinsen = L({
  id: "zi-2-monats-tageszinsen",
  title: "Zinsen für Monate und Tage",
  subtitle: "Halbe Zeit, halbe Zinsen",
  tracks: BOTH,
  whyItMatters:
    "Ein Dispokredit für ein paar Tage, ein Festgeld für drei Monate: Oft liegt Geld nicht genau ein Jahr. Weil die Zinsen proportional zur Zeit wachsen, brauchst du nur einen Schritt mehr als bei den Jahreszinsen.",
  explanationHtml: `
    <p>Der Zinssatz gilt immer für ein ganzes Jahr. Für kürzere Zeiten gilt: <strong>Zinsen und Zeit sind proportional</strong>. Die doppelte Zeit bringt die doppelten Zinsen, ein Viertel der Zeit ein Viertel der Zinsen.</p>
    <p>Banken in Deutschland rechnen bei Sparkonten oft mit dem <strong>Bankjahr</strong>: 1 Jahr hat 360 Tage, jeder Monat 30 Tage. So bleiben die Zahlen einfach.</p>
    <ul>
      <li>Monatszinsen: Z = K · p : 100 · m : 12, wobei m die Zahl der Monate ist.</li>
      <li>Tageszinsen: Z = K · p : 100 · t : 360, wobei t die Zahl der Tage ist.</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> 3.600 € werden zu 2 % für 5 Monate angelegt. Jahreszinsen: 3.600 € · 2 : 100 = 72 €. Ein Monat: 72 € : 12 = 6 €. Fünf Monate: 5 · 6 € = 30 €.<br>
    Für 75 Tage: 72 € · 75 : 360 = 15 €.</div>
    <p>Tage zählen im Bankjahr: Vom 10. März bis zum 25. Mai sind es 2 Monate (60 Tage) und 15 Tage, zusammen 75 Zinstage.</p>
    <div class="merke"><strong>Merke:</strong> Z = K · p : 100 · t : 360. Rechne zuerst die Jahreszinsen aus und nimm dann den Zeitanteil: t/360 bei Tagen, m/12 bei Monaten.</div>
  `,
  formulas: [
    { name: "Tageszinsen", html: `Z = K · ${frac("p", 100)} · ${frac("t", 360)}`, quantities: "t Zinstage, Bankjahr mit 360 Tagen" },
    { name: "Monatszinsen", html: `Z = K · ${frac("p", 100)} · ${frac("m", 12)}`, quantities: "m Monate" },
  ],
  quiz: {
    question: "5.000 € bringen in einem Jahr 100 € Zinsen. Wie viel Zinsen bringen sie in 3 Monaten?",
    options: ["25 €", "300 €", "33,33 €", "75 €"],
    correctIndex: 0,
    explanation:
      "3 Monate sind ein Viertel Jahr. Zinsen und Zeit sind proportional, also gibt es ein Viertel der Jahreszinsen: 100 € : 4 = 25 €.",
  },
  lab: lab(
    "interest-time",
    "Die Zinsuhr",
    "Ziehe den Punkt auf der Geraden oder stelle die Tage ein. Die Gerade durch den Ursprung zeigt: Die Zinsen wachsen gleichmäßig mit der Zeit, nach 360 Tagen sind es die Jahreszinsen.",
    [r("K", "Kapital K", 1000, 6000, 2400, 200, "€"), r("p", "Zinssatz p", 0.5, 5, 1.5, 0.25, "%"), r("t", "Zeit t", 0, 360, 30, 10, "Tage")],
    [
      o("jahr", "Jahreszinsen", (v) => yearInterest(v.K, v.p), "€", 2),
      o("anteil", "Zeitanteil t : 360", (v) => fracText(v.t, 360)),
      o("Z", "Zinsen für t Tage", (v) => interest(v.K, v.p, v.t), "€", 2, true),
    ],
    [
      { id: "viertel", text: "Stelle die Zeit so ein, dass es genau ein Viertel der Jahreszinsen gibt.", check: (v) => v.t === 90 },
      { id: "dreissig", text: "3.600 € zu 2 %: Nach wie vielen Tagen gibt es genau 30 € Zinsen? Stelle alles ein.", check: (v) => v.K === 3600 && v.p === 2 && v.t === 150 },
      { id: "zehn", text: "Erzeuge in genau 60 Tagen genau 10 € Zinsen.", check: (v) => v.t === 60 && same(interest(v.K, v.p, v.t), 10) },
    ],
  ),
  exercises: [
    {
      id: "monate",
      make: (rng, level) => {
        const K = 100 * rng.int(10, 80);
        const p = rng.pick(SAVE_RATES);
        const m = rng.int(1, 11);
        const year = yearInterest(K, p);
        const Z = (year * m) / 12;
        const slips = [
          { value: year, hint: "Das sind die Zinsen für ein ganzes Jahr. Nimm noch den Zeitanteil m/12." },
          { value: year * m, hint: "Die Monate sind keine Jahre: Nimm die Jahreszinsen mal m/12." },
          { value: (year * 12) / m, hint: "Zeitanteil umgedreht? Es sind m von 12 Monaten, also mal m/12." },
        ];
        const steps = [`Jahreszinsen: ${euro(K)} · ${fmt(p)} : 100 = ${euro(year)}`, `${m} von 12 Monaten: ${euro(year)} · ${m} : 12`];
        if (level === 1)
          return task(
            level,
            `Ein Kapital von ${euro(K)} wird ${m} ${m === 1 ? "Monat" : "Monate"} lang zu ${pct(p)} verzinst. Berechne die Zinsen.`,
            [num("Z =", Z, "€", 2, { slips })],
            "Z = K · p : 100 · m : 12",
            steps,
            `Z ${same(Z, round(Z, 2)) ? "=" : "≈"} ${euro(Z)}`,
            { K, p, m },
            [`K = ${euro(K)}`, `p = ${pct(p)}`, `m = ${m} ${m === 1 ? "Monat" : "Monate"}`],
          );
        const family = rng.pick(["Familie Huber", "Familie Öztürk", "Familie Schmid", "Familie Nowak"]);
        const Zc = round(Z, 2);
        return task(
          level,
          `${family} legt ${euro(K)} als Festgeld für ${m} ${m === 1 ? "Monat" : "Monate"} an. Die Bank zahlt ${pct(p)} Zinsen pro Jahr. Welcher Betrag wird am Ende der Laufzeit ausgezahlt?`,
          [num("Auszahlung:", K + Zc, "€", 2, { slips: [{ value: K + year, hint: "Das Geld liegt kein ganzes Jahr. Nimm nur den Zeitanteil der Jahreszinsen." }, { value: Zc, hint: "Ausgezahlt werden Kapital und Zinsen zusammen." }] })],
          "Erst die Zinsen für die Laufzeit, dann zum Kapital dazuzählen.",
          [...steps, `Zinsen ${same(Z, Zc) ? "=" : "≈"} ${euro(Zc)}; Auszahlung: ${euro(K)} + ${euro(Zc)}`],
          `${euro(K + Zc)}`,
          { K, p, m },
        );
      },
    },
    {
      id: "tage",
      make: (rng, level) => {
        if (level === 1) {
          const K = 100 * rng.int(10, 80);
          const p = rng.pick(SAVE_RATES);
          const t = 5 * rng.int(2, 70);
          const Z = interest(K, p, t);
          return task(
            level,
            `Berechne die Zinsen für ${euro(K)} bei ${pct(p)} für ${t} Tage. Rechne mit dem Bankjahr.`,
            [num("Z =", Z, "€", 2, { slips: [{ value: yearInterest(K, p), hint: "Das sind die Jahreszinsen. Nimm noch mal t : 360." }, { value: (K * p * t) / (100 * 365), hint: "Rechne im Bankjahr mit 360 Tagen, nicht mit 365." }, { value: (K * p * t) / 100, hint: "Die Tage müssen noch durch 360 geteilt werden." }] })],
            "Z = K · p : 100 · t : 360",
            [`Jahreszinsen: ${euro(K)} · ${fmt(p)} : 100 = ${euro(yearInterest(K, p))}`, `Zeitanteil: ${t} : 360`],
            `Z ${same(Z, round(Z, 2)) ? "=" : "≈"} ${euro(Z)}`,
            { K, p, t },
            [`K = ${euro(K)}`, `p = ${pct(p)}`, `t = ${t} Tage`],
          );
        }
        const K = 50 * rng.int(4, 40);
        const p = rng.pick([9.5, 10, 10.5, 11, 11.5, 12]);
        const fromMonth = rng.int(0, 9);
        const fromDay = rng.int(1, 28);
        const toMonth = fromMonth + rng.int(0, 2);
        const toDay = toMonth === fromMonth ? rng.int(fromDay + 5, 30) : rng.int(1, 28);
        const t = days360(fromDay, fromMonth, toDay, toMonth);
        const Z = interest(K, p, t);
        return task(
          level,
          `Das Girokonto von ${rng.pick(NAMES)} ist vom ${fromDay}. ${MONTHS[fromMonth]} bis zum ${toDay}. ${MONTHS[toMonth]} mit ${euro(K)} im Minus. Die Bank verlangt dafür ${pct(p)} Dispozinsen im Jahr. Wie viele Zinstage sind das im Bankjahr, und wie viel kostet der Dispokredit?`,
          [num("Zinstage:", t, "Tage", 0), num("Zinsen:", Z, "€", 2, { slips: [{ value: yearInterest(K, p), hint: "Das sind die Zinsen für ein ganzes Jahr. Nimm noch mal t : 360." }] })],
          "Zähle im Bankjahr jeden Monat mit 30 Tagen. Dann Z = K · p : 100 · t : 360.",
          [
            toMonth === fromMonth
              ? `Zinstage: ${toDay} − ${fromDay} = ${t} Tage`
              : `Zinstage: ${toMonth - fromMonth} · 30 Tage ${toDay - fromDay >= 0 ? "+" : "−"} ${Math.abs(toDay - fromDay)} Tage = ${t} Tage`,
            `Z = ${euro(K)} · ${fmt(p)} : 100 · ${t} : 360`,
          ],
          `${t} Tage, Zinsen ${same(Z, round(Z, 2)) ? "=" : "≈"} ${euro(Z)}`,
          { K, p, t },
        );
      },
    },
  ],
});

// 1.3 Kapital, Zinssatz und Zeit gesucht (M9) ──────────────────────────────

/** Capital as a multiple of 1200 €, rates in half steps and whole months: whole cents. */
function exactCase(rng: Rng) {
  const K = 1200 * rng.int(1, 5);
  const p = rng.pick([1, 1.5, 2, 2.5, 3, 3.5, 4]);
  const months = rng.pick([1, 2, 3, 4, 5, 6, 8, 9, 10]);
  const t = 30 * months;
  return { K, p, t, months, Z: interest(K, p, t) };
}

const umstellen = L({
  id: "zi-3-zinsformel-umstellen",
  title: "Kapital, Zinssatz und Zeit gesucht",
  subtitle: "Die Zinsformel nach jeder Größe umstellen",
  tracks: M_ONLY,
  whyItMatters:
    "Wie lange muss das Geld liegen? Welcher Zinssatz steckt hinter einem Angebot? Mit der umgestellten Zinsformel rechnest du auch für Monate und Tage rückwärts.",
  explanationHtml: `
    <p>In der Formel Z = K · p : 100 · t : 360 stecken vier Größen. Kennst du drei davon, findest du die vierte durch <strong>Äquivalenzumformung</strong>: Multipliziere beide Seiten mit 100 und mit 360 und teile durch die beiden bekannten Faktoren.</p>
    <table class="mini">
      <tr><th>gesucht</th><th>Formel</th></tr>
      <tr><td>Kapital</td><td>K = Z · 100 · 360 : (p · t)</td></tr>
      <tr><td>Zinssatz</td><td>p = Z · 100 · 360 : (K · t)</td></tr>
      <tr><td>Zeit in Tagen</td><td>t = Z · 100 · 360 : (K · p)</td></tr>
    </table>
    <div class="example"><strong>Beispiel:</strong> Wie lange müssen 4.000 € zu 3 % angelegt werden, damit es 50 € Zinsen gibt?<br>
    50 = 4.000 · 3 : 100 · t : 360, also 50 = 120 · t : 360. Mal 360 und durch 120: t = 50 · 360 : 120 = 150 Tage, das sind 5 Monate.<br>
    Probe: 4.000 € · 3 : 100 · 150 : 360 = 120 € · 150 : 360 = 50 €.</div>
    <p>Bleiben die Zinsen gleich, so hängen die anderen Größen <strong>umgekehrt proportional</strong> zusammen: Doppelter Zinssatz heißt halbe Zeit für dieselben Zinsen.</p>
    <div class="merke"><strong>Merke:</strong> Stelle Z = K · p : 100 · t : 360 nach der gesuchten Größe um und mache die Probe durch Einsetzen. Gib Zeiten in Tagen und, wenn es aufgeht, in Monaten an.</div>
  `,
  formulas: [
    { name: "Zinsformel umgestellt", html: `K = ${frac("Z · 100 · 360", "p · t")}; p = ${frac("Z · 100 · 360", "K · t")}; t = ${frac("Z · 100 · 360", "K · p")}`, quantities: "t in Tagen, Bankjahr mit 360 Tagen" },
  ],
  quiz: {
    question: "Bei festen Zinsen Z und festem Kapital wird der Zinssatz verdoppelt. Was passiert mit der nötigen Zeit?",
    options: ["Sie halbiert sich.", "Sie verdoppelt sich.", "Sie bleibt gleich.", "Sie wird um 2 Tage kürzer."],
    correctIndex: 0,
    explanation:
      "Aus t = Z · 100 · 360 : (K · p) siehst du: p steht im Nenner. Doppelter Zinssatz heißt halbe Zeit für dieselben Zinsen.",
  },
  lab: lab(
    "interest-box",
    "Der Zinsquader",
    "Die Zinsen sind ein Produkt aus Kapital, Zinssatz und Zeit, wie der Rauminhalt eines Quaders aus drei Kanten. Stelle die Kanten so ein, dass die Zinsen zum Auftrag passen.",
    [r("K", "Kapital K", 1000, 6000, 1000, 500, "€"), r("p", "Zinssatz p", 0.5, 5, 1, 0.5, "%"), r("t", "Zeit t", 30, 360, 360, 30, "Tage")],
    [
      o("Z", "Zinsen Z", (v) => interest(v.K, v.p, v.t), "€", 2, true),
      o("monate", "Zeit in Monaten", (v) => v.t / 30, "", 0),
    ],
    [
      { id: "zeit", text: "4.000 € zu 3 %: Stelle die Zeit ein, nach der es genau 50 € Zinsen gibt.", check: (v) => v.K === 4000 && v.p === 3 && same(interest(v.K, v.p, v.t), 50) },
      { id: "satz", text: "2.000 € sollen in 270 Tagen genau 30 € bringen. Stelle den nötigen Zinssatz ein.", check: (v) => v.K === 2000 && v.t === 270 && same(interest(v.K, v.p, v.t), 30) },
      { id: "kapital", text: "Bei 2,5 % sollen in 4 Monaten genau 25 € Zinsen entstehen. Stelle das nötige Kapital ein.", check: (v) => v.p === 2.5 && v.t === 120 && same(interest(v.K, v.p, v.t), 25) },
    ],
  ),
  exercises: [
    {
      id: "kapital",
      make: (rng, level) => {
        const { K, p, t, months, Z } = exactCase(rng);
        const slips = [
          { value: (Z * 100) / p, hint: "So bekommst du das Kapital für ein ganzes Jahr. Die Zeit ist kürzer, also brauchst du mehr Kapital." },
          { value: (Z * p * t) / 36000, hint: "Teile durch p und t, statt mit ihnen malzunehmen." },
        ];
        const steps = [`K = Z · 100 · 360 : (p · t)`, `K = ${euro(Z)} · 100 · 360 : (${fmt(p)} · ${t})`];
        if (level === 1)
          return task(
            level,
            `Welches Kapital bringt bei ${pct(p)} in ${t} Tagen ${euro(Z)} Zinsen?`,
            [num("K =", K, "€", 2, { slips })],
            "K = Z · 100 · 360 : (p · t)",
            steps,
            `K = ${euro(K)}`,
            { K, p, t },
            [`Z = ${euro(Z)}`, `p = ${pct(p)}`, `t = ${t} Tage`],
          );
        const name = rng.pick(NAMES);
        return task(
          level,
          `${name} möchte in ${months} Monaten allein durch Zinsen ${euro(Z)} bekommen. Die Bank zahlt ${pct(p)} Zinsen im Jahr. Wie viel Geld muss ${name} anlegen?`,
          [num("Kapital:", K, "€", 2, { slips })],
          "Rechne die Monate in Tage um (1 Monat = 30 Tage) und stelle die Zinsformel nach K um.",
          [`${months} Monate = ${t} Tage`, ...steps],
          `${name} muss ${euro(K)} anlegen.`,
          { K, p, t },
        );
      },
    },
    {
      id: "zeit-satz",
      make: (rng, level) => {
        const { K, p, t, months, Z } = exactCase(rng);
        const wantsTime = rng.next() < 0.5;
        if (wantsTime) {
          const slips = [
            { value: (t / 360) * 12, hint: "Das sind Monate. Gefragt sind Tage." },
            { value: (Z * 100) / (K * p), hint: "Das ist der Anteil eines Jahres. Mal 360 ergibt die Tage." },
          ];
          const steps = [`t = Z · 100 · 360 : (K · p)`, `t = ${euro(Z)} · 100 · 360 : (${euro(K)} · ${fmt(p)})`];
          if (level === 1)
            return task(
              level,
              `Wie viele Tage muss ein Kapital von ${euro(K)} zu ${pct(p)} angelegt sein, damit es ${euro(Z)} Zinsen bringt?`,
              [num("t =", t, "Tage", 0, { slips })],
              "t = Z · 100 · 360 : (K · p)",
              steps,
              `t = ${t} Tage = ${months} ${months === 1 ? "Monat" : "Monate"}`,
              { K, p, t },
              [`K = ${euro(K)}`, `p = ${pct(p)}`, `Z = ${euro(Z)}`],
            );
          return task(
            level,
            `Auf einem Tagesgeldkonto liegen ${euro(K)} zu ${pct(p)} Zinsen im Jahr. Am Ende werden ${euro(K + Z)} ausgezahlt. Wie viele Tage lag das Geld auf dem Konto?`,
            [num("Zeit:", t, "Tage", 0, { slips: slips.concat([{ value: daysFor(K + Z, K, p), hint: "Rechne nur mit den Zinsen: Auszahlung minus Kapital." }]) })],
            "Zinsen = Auszahlung − Kapital. Dann t = Z · 100 · 360 : (K · p).",
            [`Z = ${euro(K + Z)} − ${euro(K)} = ${euro(Z)}`, ...steps],
            `Das Geld lag ${t} Tage (${months} ${months === 1 ? "Monat" : "Monate"}) auf dem Konto.`,
            { K, p, t },
          );
        }
        const slips = [
          { value: (Z * 100) / K, hint: "So rechnest du den Zinssatz für ein ganzes Jahr. Das Geld lag aber kürzer." },
          { value: rateFor(Z, K, t) / 100, hint: "Das ist ein Anteil. Gefragt ist der Zinssatz in Prozent." },
        ];
        const steps = [`p = Z · 100 · 360 : (K · t)`, `p = ${euro(Z)} · 100 · 360 : (${euro(K)} · ${t})`];
        if (level === 1)
          return task(
            level,
            `Ein Kapital von ${euro(K)} bringt in ${t} Tagen ${euro(Z)} Zinsen. Berechne den Zinssatz.`,
            [num("p =", p, "%", 2, { slips })],
            "p = Z · 100 · 360 : (K · t)",
            steps,
            `p = ${pct(p)}`,
            { K, p, t },
            [`K = ${euro(K)}`, `t = ${t} Tage`, `Z = ${euro(Z)}`],
          );
        return task(
          level,
          `Eine Bank wirbt: „Legen Sie ${euro(K)} für ${months} ${months === 1 ? "Monat" : "Monate"} an und erhalten Sie ${euro(Z)} Zinsen.“ Welcher Zinssatz pro Jahr steckt dahinter?`,
          [num("Zinssatz:", p, "%", 2, { slips })],
          "Monate in Tage umrechnen, dann p = Z · 100 · 360 : (K · t).",
          [`${months} Monate = ${t} Tage`, ...steps],
          `Der Zinssatz beträgt ${pct(p)} pro Jahr.`,
          { K, p, t },
        );
      },
    },
  ],
});

// 1.4 Der effektive Jahreszins ──────────────────────────────────────────────

const effektiv = L({
  id: "zi-4-effektiver-jahreszins",
  title: "Der effektive Jahreszins",
  subtitle: "Kosten für kurze Zeit auf ein Jahr hochrechnen",
  tracks: BOTH,
  whyItMatters:
    "Pfandhaus, Kurzkredit, Überziehung: Viele Angebote nennen Kosten für ein paar Wochen oder Monate. Erst der Zinssatz für ein ganzes Jahr zeigt, wie teuer das Geld wirklich ist und welches Angebot günstiger ist.",
  explanationHtml: `
    <p>Kennst du die Zinsen oder Kosten für eine kurze Zeit, schließt du umgekehrt auf ein ganzes Jahr: Wie viel würde das Geld ein Jahr lang kosten? Diese Jahreskosten in Prozent des Kapitals heißen <strong>effektiver Jahreszins</strong>. Erst mit ihm kannst du Angebote mit verschiedenen Laufzeiten vergleichen.</p>
    <div class="example"><strong>Beispiel:</strong> Ein Pfandhaus leiht dir 400 € für 3 Monate und verlangt dafür 12 €. Ein Jahr hat 4-mal 3 Monate, ein Jahr lang wären es also 4 · 12 € = 48 €. 48 € von 400 € sind 12 %. Der effektive Jahreszins beträgt 12 %.<br>
    Ein anderes Angebot nennt „nur 0,04 % pro Tag“. Im Bankjahr sind das 360 · 0,04 % = 14,4 % im Jahr, also teurer.</div>
    <p>Mit der Formel: p = Z · 100 · 360 : (K · t), wobei t die Laufzeit in Tagen ist. Bei Monaten rechnest du mit 12 : m statt 360 : t.</p>
    <div class="merke"><strong>Merke:</strong> Rechne Kosten für kurze Zeit auf ein Jahr hoch und teile durch das Kapital: Das ist der effektive Jahreszins. Vergleiche Angebote immer über ihn, nicht über die Kosten in Euro.</div>
  `,
  formulas: [
    { name: "Effektiver Jahreszins", html: `p = ${frac("Z · 100 · 360", "K · t")}`, quantities: "Z Kosten oder Zinsen für t Tage, K Kapital" },
    { name: "Hochrechnen", html: "Kosten im Jahr = Kosten · 12 : m", quantities: "m Laufzeit in Monaten" },
  ],
  quiz: {
    question: "Ein Kredit über 600 € kostet für einen Monat 5 €. Wie hoch ist der effektive Jahreszins?",
    options: ["10 %", "0,83 %", "5 %", "60 %"],
    correctIndex: 0,
    explanation:
      "In einem Jahr wären es 12 · 5 € = 60 €. 60 € von 600 € sind 10 %. 0,83 % sind die Kosten für einen einzigen Monat.",
  },
  lab: lab(
    "effective-rate",
    "Zwei Angebote im Vergleich",
    "Jedes Kästchen ist ein Monat. Die Kosten eines Angebots wiederholen sich, bis das Jahr voll ist. Unten siehst du den effektiven Jahreszins.",
    [
      { type: "choice", key: "K", label: "Kapital", options: [300, 600, 1200].map((value) => ({ value, label: euro(value) })), value: 600 },
      r("costA", "Kosten Angebot A", 1, 40, 9, 1, "€"),
      r("monthsA", "Laufzeit A", 1, 12, 3, 1, "Monate"),
      r("costB", "Kosten Angebot B", 1, 40, 4, 1, "€"),
      r("monthsB", "Laufzeit B", 1, 12, 1, 1, "Monate"),
    ],
    [
      o("effA", "effektiver Jahreszins A", (v) => effectiveRate(v.K, v.costA, 30 * v.monthsA), "%", 2, true),
      o("effB", "effektiver Jahreszins B", (v) => effectiveRate(v.K, v.costB, 30 * v.monthsB), "%", 2, true),
    ],
    [
      { id: "zwoelf", text: "Stelle Angebot A auf einen effektiven Jahreszins von genau 12 % ein.", check: (v) => same(effectiveRate(v.K, v.costA, 30 * v.monthsA), 12) },
      { id: "teurer-guenstiger", text: "Mache B in Euro teurer als A, aber im effektiven Jahreszins günstiger.", check: (v) => v.costB > v.costA && effectiveRate(v.K, v.costB, 30 * v.monthsB) < effectiveRate(v.K, v.costA, 30 * v.monthsA) - 1e-9 },
      { id: "gleich", text: "Finde zwei verschiedene Angebote mit demselben effektiven Jahreszins.", check: (v) => (v.costA !== v.costB || v.monthsA !== v.monthsB) && same(effectiveRate(v.K, v.costA, 30 * v.monthsA), effectiveRate(v.K, v.costB, 30 * v.monthsB)) },
    ],
  ),
  exercises: [
    {
      id: "effektiv",
      make: (rng, level) => {
        if (level === 1) {
          const K = 100 * rng.int(2, 30);
          const m = rng.pick([1, 2, 3, 4, 6]);
          const cost = Math.max(1, Math.round((K * rng.int(5, 24) * m) / 1200));
          const eff = effectiveRate(K, cost, 30 * m);
          return task(
            level,
            `Ein Kredit über ${euro(K)} kostet für ${m} ${m === 1 ? "Monat" : "Monate"} insgesamt ${euro(cost)}. Berechne den effektiven Jahreszins.`,
            [num("p =", eff, "%", 2, { slips: [{ value: (cost * 100) / K, hint: "Das ist der Prozentsatz für die kurze Laufzeit. Rechne erst auf ein Jahr hoch." }, { value: (cost * 100 * m) / (K * 12), hint: "Hochrechnen heißt mal 12 : m, nicht mal m : 12." }] })],
            "Kosten im Jahr = Kosten · 12 : m, dann p = Jahreskosten · 100 : K.",
            [`Kosten im Jahr: ${euro(cost)} · 12 : ${m} = ${euro((cost * 12) / m)}`, `p = ${euro((cost * 12) / m)} · 100 : ${euro(K)}`],
            `p ${same(eff, round(eff, 2)) ? "=" : "≈"} ${pct(eff)}`,
            { K, m, cost },
            [`K = ${euro(K)}`, `Kosten: ${euro(cost)}`, `Laufzeit: ${m} ${m === 1 ? "Monat" : "Monate"}`],
          );
        }
        if (rng.next() < 0.5) {
          const daily = rng.pick([0.02, 0.025, 0.03, 0.035, 0.04, 0.05]);
          const K = 100 * rng.int(3, 20);
          const t = rng.int(10, 60);
          const cost = (K * daily * t) / 100;
          return task(
            level,
            `Ein Online-Kurzkredit wirbt mit „nur ${fmt(daily, 3)} % pro Tag“. Jasmin leiht sich ${euro(K)} für ${t} Tage. Wie viel kostet sie das, und wie hoch ist der effektive Jahreszins im Bankjahr?`,
            [num("Kosten:", cost, "€", 2), num("effektiver Jahreszins:", daily * 360, "%", 2, { slips: [{ value: daily * 365, hint: "Rechne im Bankjahr mit 360 Tagen." }, { value: daily * t, hint: "Das gilt nur für die Laufzeit. Der Jahreszins gilt für 360 Tage." }] })],
            "Kosten = K · Tageszins : 100 · Tage; ein Jahr hat 360 Zinstage.",
            [`Kosten: ${euro(K)} · ${fmt(daily, 3)} : 100 · ${t} = ${euro(cost)}`, `Jahreszins: 360 · ${fmt(daily, 3)} % = ${pct(daily * 360)}`],
            `Kosten ${euro(cost)}, effektiver Jahreszins ${pct(daily * 360)}`,
            { K, t },
          );
        }
        const K = 50 * rng.int(4, 20);
        const m = rng.pick([1, 2, 3, 4]);
        const monthly = rng.pick([1, 1.5, 2]);
        const cost = (K * monthly * m) / 100;
        const eff = effectiveRate(K, cost, 30 * m);
        return task(
          level,
          `Ein Pfandhaus beleiht eine Uhr mit ${euro(K)}. Es verlangt ${pct(monthly)} des Betrags pro Monat. Herr Arslan löst die Uhr nach ${m} ${m === 1 ? "Monat" : "Monaten"} wieder aus. Wie viel zahlt er zurück, und wie hoch ist der effektive Jahreszins?`,
          [num("Rückzahlung:", K + cost, "€", 2, { slips: [{ value: cost, hint: "Zurückgezahlt werden der geliehene Betrag und die Kosten." }] }), num("effektiver Jahreszins:", eff, "%", 2, { slips: [{ value: monthly * m, hint: "Das sind die Kosten für die Laufzeit. Der Jahreszins gilt für 12 Monate." }] })],
          "Kosten = K · Monatssatz : 100 · m; ein Jahr hat 12 Monate.",
          [`Kosten: ${euro(K)} · ${fmt(monthly)} : 100 · ${m} = ${euro(cost)}`, `Jahreszins: 12 · ${pct(monthly)} = ${pct(eff)}`],
          `Rückzahlung ${euro(K + cost)}, effektiver Jahreszins ${pct(eff)}`,
          { K, m },
        );
      },
    },
    {
      id: "vergleich",
      make: (rng, level) => {
        const K = 100 * rng.int(3, 15);
        let mA = rng.pick([1, 2, 3, 4, 6]);
        let mB = rng.pick([1, 2, 3, 4, 6]);
        if (mA === mB) mB = mA === 6 ? 3 : 6;
        const cA = Math.max(1, Math.round((K * rng.int(6, 20) * mA) / 1200));
        let cB = Math.max(1, Math.round((K * rng.int(6, 20) * mB) / 1200));
        const eA = effectiveRate(K, cA, 30 * mA);
        let eB = effectiveRate(K, cB, 30 * mB);
        if (Math.abs(eA - eB) < 0.1) {
          cB += 2;
          eB = effectiveRate(K, cB, 30 * mB);
        }
        const cheaper = eA < eB ? 0 : 1;
        const fields = [
          num("p (A) =", eA, "%", 2),
          num("p (B) =", eB, "%", 2),
          choiceField("Günstiger ist", ["Angebot A", "Angebot B"], cheaper),
        ];
        const steps = [
          `A: ${euro(cA)} · 12 : ${mA} = ${euro((cA * 12) / mA)} im Jahr, p = ${euro((cA * 12) / mA)} · 100 : ${euro(K)} ${same(eA, round(eA, 2)) ? "=" : "≈"} ${pct(eA)}`,
          `B: ${euro(cB)} · 12 : ${mB} = ${euro((cB * 12) / mB)} im Jahr, p = ${euro((cB * 12) / mB)} · 100 : ${euro(K)} ${same(eB, round(eB, 2)) ? "=" : "≈"} ${pct(eB)}`,
        ];
        if (level === 1)
          return task(
            level,
            `Vergleiche zwei Kredite über je ${euro(K)}: Angebot A kostet ${euro(cA)} für ${mA} ${mA === 1 ? "Monat" : "Monate"}, Angebot B ${euro(cB)} für ${mB} ${mB === 1 ? "Monat" : "Monate"}. Berechne beide effektiven Jahreszinsen.`,
            fields,
            "Jahreskosten = Kosten · 12 : m, dann p = Jahreskosten · 100 : K.",
            steps,
            `Günstiger ist Angebot ${cheaper === 0 ? "A" : "B"}.`,
            { K },
            [`A: ${euro(cA)} für ${mA} Mon.`, `B: ${euro(cB)} für ${mB} Mon.`],
          );
        return task(
          level,
          `Kim braucht ${euro(K)} für eine Reparatur. Die Freundin des Vaters bietet ihr Geld für ${mA} ${mA === 1 ? "Monat" : "Monate"} gegen ${euro(cA)} an, ein Kurzkredit kostet ${euro(cB)} für ${mB} ${mB === 1 ? "Monat" : "Monate"}. Rechne beide Angebote in effektive Jahreszinsen um. Welches ist günstiger?`,
          fields,
          "Vergleiche nicht die Euro-Beträge, sondern die effektiven Jahreszinsen.",
          steps,
          `Günstiger ist Angebot ${cheaper === 0 ? "A" : "B"}.`,
          { K },
        );
      },
    },
  ],
});

// 1.5 Zinseszins Schritt für Schritt ────────────────────────────────────────

const ZZ_RATES = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5];

function tableSteps(rows: ReturnType<typeof compoundTable>, p: number): string[] {
  return rows.map(
    (row) => `Jahr ${row.year}: ${euro(row.start)} · ${fmt(p)} : 100 = ${euro(row.interest)}, neues Kapital ${euro(row.end)}`,
  );
}

const zinseszins = L({
  id: "zi-5-zinseszins",
  title: "Zinseszins Schritt für Schritt",
  subtitle: "Zinsen bringen im nächsten Jahr selbst Zinsen",
  tracks: BOTH,
  whyItMatters:
    "Lässt du die Zinsen auf dem Konto, wächst das Kapital jedes Jahr ein Stück schneller. Wer früh spart, profitiert davon; wer Schulden stehen lässt, zahlt Zinsen auf Zinsen.",
  explanationHtml: `
    <p>Werden die Zinsen am Jahresende nicht abgehoben, gehören sie im nächsten Jahr zum Kapital und werden mitverzinst. Das nennt man <strong>Zinseszins</strong>. Du rechnest Jahr für Jahr: Zinsen vom aktuellen Kontostand berechnen, dazuzählen, mit dem neuen Kontostand weiterrechnen. Banken runden die Zinsen jedes Jahr auf Cent.</p>
    <div class="example"><strong>Beispiel:</strong> 5.000 € zu 2 % für 3 Jahre.
      <table class="mini">
        <tr><th>Jahr</th><th>Kapital am Anfang</th><th>Zinsen (2 %)</th><th>Kapital am Ende</th></tr>
        <tr><td>1</td><td>5.000,00 €</td><td>100,00 €</td><td>5.100,00 €</td></tr>
        <tr><td>2</td><td>5.100,00 €</td><td>102,00 €</td><td>5.202,00 €</td></tr>
        <tr><td>3</td><td>5.202,00 €</td><td>104,04 €</td><td>5.306,04 €</td></tr>
      </table>
      Ohne Zinseszins gäbe es dreimal 100 €, also 5.300 €. Die 6,04 € mehr sind Zinsen auf Zinsen.</div>
    <div class="merke"><strong>Merke:</strong> Beim Zinseszins wird jedes Jahr der neue Kontostand verzinst: Kapital am Jahresende = Kapital am Jahresanfang + dessen Zinsen. Rechne Jahr für Jahr in einer Tabelle.</div>
  `,
  formulas: [
    { name: "Ein Jahr mit Zinseszins", html: `K<sub>neu</sub> = K<sub>alt</sub> + K<sub>alt</sub> · ${frac("p", 100)}`, quantities: "die Zinsen werden jedes Jahr dazugezählt und mitverzinst" },
  ],
  quiz: {
    question: "1.000 € werden 2 Jahre lang zu 10 % mit Zinseszins angelegt. Wie viel Geld ist danach auf dem Konto?",
    options: ["1.210 €", "1.200 €", "1.100 €", "1.020 €"],
    correctIndex: 0,
    explanation:
      "Jahr 1: 1.000 € + 100 € = 1.100 €. Jahr 2: 1.100 € + 110 € = 1.210 €. 1.200 € wären es ohne Zinseszins.",
  },
  lab: lab(
    "compound-bars",
    "Säulen, die immer schneller wachsen",
    "Jede Säule zeigt alle Zinsen bis zum Ende eines Jahres. Orange sind die Zinsen, die es auch ohne Zinseszins gäbe, lila die Zinsen auf Zinsen. Sie wachsen von Jahr zu Jahr schneller.",
    [r("K0", "Startkapital K₀", 1000, 10000, 2000, 500, "€"), r("p", "Zinssatz p", 1, 8, 2, 0.5, "%"), r("n", "Jahre n", 1, 10, 3, 1)],
    [
      o("Kn", "Kontostand nach n Jahren", (v) => compoundTable(v.K0, v.p, v.n).at(-1)!.end, "€", 2, true),
      o("zinsen", "Zinsen insgesamt", (v) => compoundTable(v.K0, v.p, v.n).at(-1)!.end - v.K0, "€", 2),
      o("zz", "davon Zinsen auf Zinsen", (v) => compoundTable(v.K0, v.p, v.n).at(-1)!.end - v.K0 - v.n * yearInterest(v.K0, v.p), "€", 2),
    ],
    [
      { id: "sechstausend", text: "5.000 € zu 4 %: Stelle das erste Jahr ein, an dessen Ende mehr als 6.000 € auf dem Konto sind.", check: (v) => v.K0 === 5000 && v.p === 4 && v.n === 5 },
      { id: "hundert", text: "Erzeuge mehr als 100 € Zinsen auf Zinsen.", check: (v) => compound(v.K0, v.p, v.n) - v.K0 - v.n * yearInterest(v.K0, v.p) > 100 },
      { id: "verdoppeln", text: "Verdopple dein Startkapital in höchstens 10 Jahren.", check: (v) => compound(v.K0, v.p, v.n) >= 2 * v.K0 },
    ],
  ),
  exercises: [
    {
      id: "tabelle",
      make: (rng, level) => {
        const K0 = 100 * rng.int(10, 100);
        const p = rng.pick(ZZ_RATES);
        if (level === 1) {
          const rows = compoundTable(K0, p, 2);
          return task(
            level,
            `Ein Kapital von ${euro(K0)} wird zu ${pct(p)} angelegt; die Zinsen werden mitverzinst. Berechne den Kontostand nach dem ersten und nach dem zweiten Jahr.`,
            [
              num("nach 1 Jahr:", rows[0].end, "€", 2, { slips: [{ value: rows[0].interest, hint: "Das sind nur die Zinsen. Zähle sie zum Kapital dazu." }] }),
              num("nach 2 Jahren:", rows[1].end, "€", 2, { absTolerance: 0.02, slips: [{ value: K0 + 2 * yearInterest(K0, p), hint: "Im zweiten Jahr werden auch die Zinsen des ersten Jahres verzinst." }] }),
            ],
            "Jedes Jahr: Zinsen vom aktuellen Kontostand berechnen und dazuzählen.",
            tableSteps(rows, p),
            `${euro(rows[0].end)} und ${euro(rows[1].end)}`,
            { K0, p },
            [`K₀ = ${euro(K0)}`, `p = ${pct(p)}`],
          );
        }
        const rows = compoundTable(K0, p, 3);
        const end = rows[2].end;
        const plain = K0 + 3 * yearInterest(K0, p);
        return task(
          level,
          `Oma Erna legt für ihr Enkelkind ${euro(K0)} zu ${pct(p)} an. Die Zinsen bleiben auf dem Konto und werden mitverzinst. Wie viel Geld ist nach 3 Jahren auf dem Konto? Wie viel mehr ist das als ohne Zinseszins?`,
          [
            num("nach 3 Jahren:", end, "€", 2, { absTolerance: 0.03, slips: [{ value: plain, hint: "So wäre es ohne Zinseszins. Verzinse jedes Jahr den neuen Kontostand." }] }),
            num("Mehrbetrag:", end - plain, "€", 2, { absTolerance: 0.03 }),
          ],
          "Tabelle: drei Jahre, jedes Jahr vom neuen Kontostand aus. Ohne Zinseszins: dreimal dieselben Jahreszinsen.",
          [...tableSteps(rows, p), `ohne Zinseszins: ${euro(K0)} + 3 · ${euro(yearInterest(K0, p))} = ${euro(plain)}`],
          `${euro(end)}, das sind ${euro(end - plain)} mehr`,
          { K0, p },
        );
      },
    },
    {
      id: "schulden",
      make: (rng, level) => {
        const K0 = 50 * rng.int(4, 60);
        const p = rng.pick([6, 7, 8, 9, 10, 12]);
        const rows = compoundTable(K0, p, 3);
        const end = rows[2].end;
        if (level === 1) {
          return task(
            level,
            `Eine Schuld von ${euro(K0)} wird 3 Jahre lang nicht bezahlt. Jedes Jahr kommen ${pct(p)} Zinsen auf die aktuelle Schuld dazu. Berechne die Schuld nach 3 Jahren.`,
            [num("Schuld:", end, "€", 2, { absTolerance: 0.03, slips: [{ value: K0 + 3 * yearInterest(K0, p), hint: "Auch die Zinsen der Vorjahre werden verzinst." }] })],
            "Wie beim Sparen: Jahr für Jahr Zinsen vom aktuellen Betrag dazuzählen.",
            tableSteps(rows, p),
            `Schuld nach 3 Jahren: ${euro(end)}`,
            { K0, p },
            [`Schuld: ${euro(K0)}`, `p = ${pct(p)}`, "3 Jahre"],
          );
        }
        return task(
          level,
          `Ein Handyvertrag wurde nicht bezahlt: Es stehen ${euro(K0)} offen. Das Inkassobüro rechnet jedes Jahr ${pct(p)} Zinsen auf die gesamte offene Summe. Wie hoch ist die Forderung nach 3 Jahren, und wie viel davon sind Zinsen?`,
          [
            num("Forderung:", end, "€", 2, { absTolerance: 0.03, slips: [{ value: K0 + 3 * yearInterest(K0, p), hint: "Auch die Zinsen der Vorjahre werden verzinst." }] }),
            num("Zinsen:", end - K0, "€", 2, { absTolerance: 0.03 }),
          ],
          "Rechne Jahr für Jahr mit der jeweils offenen Summe.",
          tableSteps(rows, p),
          `${euro(end)}, davon ${euro(end - K0)} Zinsen`,
          { K0, p },
        );
      },
    },
  ],
});

// 1.6 Mit dem Zinsfaktor rechnen (M9) ───────────────────────────────────────

const zinsfaktor = L({
  id: "zi-6-zinsfaktor",
  title: "Mit dem Zinsfaktor rechnen",
  subtitle: "Kₙ = K₀ · qⁿ statt Jahr für Jahr",
  tracks: M_ONLY,
  whyItMatters:
    "Für zehn oder zwanzig Jahre wird die Zinstabelle lang. Mit dem Zinsfaktor rechnest du jede Laufzeit in einem Schritt, auch rückwärts: Welches Startkapital brauche ich für mein Ziel?",
  explanationHtml: `
    <p>Kapital und Zinsen eines Jahres zusammen sind K + K · p : 100 = K · (1 + p : 100). Den Faktor <strong>q = 1 + p : 100</strong> nennt man <strong>Zinsfaktor</strong>. Bei 2 % ist q = 1,02, bei 3,5 % ist q = 1,035.</p>
    <p>Jedes Jahr wird der Kontostand mit q malgenommen. Nach n Jahren ist das n-mal derselbe Faktor, also eine Potenz:</p>
    <p class="formula-line">K<sub>n</sub> = K<sub>0</sub> · q · q · … · q = K<sub>0</sub> · q<sup>n</sup></p>
    <div class="example"><strong>Beispiel:</strong> 4.000 € zu 3 % für 5 Jahre: K<sub>5</sub> = 4.000 € · 1,03<sup>5</sup> ≈ 4.000 € · 1,159274 ≈ 4.637,10 €. Das Kapital ist um rund 15,9 % gewachsen, mehr als 5 · 3 % = 15 %.<br>
    Rückwärts: Wie viel muss man heute zu 3 % anlegen, um in 5 Jahren 5.000 € zu haben? K<sub>0</sub> = 5.000 € : 1,03<sup>5</sup> ≈ 4.313,04 €.</div>
    <p>Auch andere Änderungen sind Faktoren: Eine Zunahme um 20 % ist der Faktor 1,2, eine Abnahme um 20 % der Faktor 0,8.</p>
    <div class="merke"><strong>Merke:</strong> Zinsfaktor q = 1 + p : 100. Kapital nach n Jahren: K<sub>n</sub> = K<sub>0</sub> · q<sup>n</sup>. Rückwärts: K<sub>0</sub> = K<sub>n</sub> : q<sup>n</sup>. Am Taschenrechner nutzt du die Potenztaste (x<sup>y</sup> oder ^).</div>
  `,
  formulas: [
    { name: "Zinsfaktor", html: `q = 1 + ${frac("p", 100)}`, quantities: "p Zinssatz in %" },
    { name: "Zinseszinsformel", html: "K<sub>n</sub> = K<sub>0</sub> · q<sup>n</sup>; K<sub>0</sub> = K<sub>n</sub> : q<sup>n</sup>", quantities: "K₀ Startkapital, n Jahre, Kₙ Kapital nach n Jahren" },
  ],
  quiz: {
    question: "Welcher Term gibt das Kapital nach 6 Jahren an, wenn 2.000 € zu 4 % mit Zinseszins angelegt werden?",
    options: ["2.000 · 1,04⁶", "2.000 · 1,4⁶", "2.000 · 0,04⁶", "2.000 + 6 · 0,04"],
    correctIndex: 0,
    explanation:
      "Der Zinsfaktor ist q = 1 + 4 : 100 = 1,04, und er wirkt sechsmal: 2.000 · 1,04⁶. 1,4 wäre ein Zuwachs von 40 % pro Jahr.",
  },
  lab: lab(
    "interest-factor",
    "Die Zinsfaktor-Kurve",
    "Die orange Kurve zeigt K₀ · qⁿ, die blaue Gerade das Kapital ohne Zinseszins. Ziehe den Punkt nach rechts: Der Abstand der beiden wächst von Jahr zu Jahr.",
    [r("K0", "Startkapital K₀", 1000, 10000, 2000, 100, "€"), r("p", "Zinssatz p", 0.5, 8, 2, 0.5, "%"), r("n", "Jahre n", 1, 20, 5, 1)],
    [
      o("q", "Zinsfaktor q", (v) => factorOf(v.p), "", 3),
      o("Kn", "Kapital Kₙ", (v) => compound(v.K0, v.p, v.n), "€", 2, true),
      o("zuwachs", "Zuwachs insgesamt", (v) => (factorOf(v.p) ** v.n - 1) * 100, "%", 1),
    ],
    [
      { id: "fuenftausend", text: "Aus 4.000 € sollen in 6 Jahren mehr als 5.000 € werden. Stelle den kleinsten Zinssatz ein, der das schafft.", check: (v) => v.K0 === 4000 && v.n === 6 && compound(4000, v.p, 6) > 5000 && compound(4000, v.p - 0.5, 6) <= 5000 },
      { id: "verdoppeln", text: "1.000 € zu 5 %: Stelle die kleinste Zahl von Jahren ein, nach der sich das Kapital verdoppelt hat.", check: (v) => v.K0 === 1000 && v.p === 5 && v.n === 15 },
      { id: "rueckwaerts", text: "Welches Startkapital wird bei 3 % in 10 Jahren zu rund 6.720 €? Stelle es ein.", check: (v) => v.p === 3 && v.n === 10 && Math.abs(compound(v.K0, 3, 10) - 6720) < 10 },
    ],
  ),
  exercises: [
    {
      id: "faktor",
      make: (rng, level) => {
        const K0 = 500 * rng.int(2, 20);
        const p = rng.pick([1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]);
        const n = rng.int(4, 15);
        const q = factorOf(p);
        const Kn = compound(K0, p, n);
        if (level === 1)
          return task(
            level,
            `${euro(K0)} werden ${n} Jahre lang zu ${pct(p)} mit Zinseszins angelegt. Gib den Zinsfaktor an und berechne das Endkapital.`,
            [
              num("q =", q, "", 3, { slips: [{ value: p / 100, hint: "Zum Faktor gehört noch die 1 für das Kapital selbst: q = 1 + p : 100." }, { value: 1 + p / 10, hint: "p % sind p Hundertstel, nicht Zehntel." }] }),
              num("Kₙ =", Kn, "€", 2, { absTolerance: 0.02, slips: [{ value: K0 * (1 + (p * n) / 100), hint: "So wäre es ohne Zinseszins. Der Faktor q wirkt n-mal: q hoch n." }, { value: K0 * q * n, hint: "q hoch n heißt n-mal mit q malnehmen, nicht mal n." }] }),
            ],
            "q = 1 + p : 100; Kₙ = K₀ · qⁿ",
            [`q = 1 + ${fmt(p)} : 100 = ${fmt(q, 3)}`, `Kₙ = ${euro(K0)} · ${fmt(q, 3)}<sup>${n}</sup>`],
            `q = ${fmt(q, 3)}; Kₙ ≈ ${euro(Kn)}`,
            { K0, p, n },
            [`K₀ = ${euro(K0)}`, `p = ${pct(p)}`, `n = ${n} Jahre`],
          );
        return task(
          level,
          `Ein Sparbrief über ${euro(K0)} läuft ${n} Jahre, die Zinsen von ${pct(p)} werden mitverzinst. Wie viel wird am Ende ausgezahlt? Um wie viel Prozent ist das Geld insgesamt gewachsen?`,
          [
            num("Auszahlung:", Kn, "€", 2, { absTolerance: 0.02, slips: [{ value: K0 * (1 + (p * n) / 100), hint: "So wäre es ohne Zinseszins. Rechne mit q hoch n." }] }),
            num("Zuwachs:", (q ** n - 1) * 100, "%", 1, { slips: [{ value: p * n, hint: "Beim Zinseszins ist der Zuwachs größer als n mal p %." }] }),
          ],
          "Kₙ = K₀ · qⁿ; Zuwachs in % = (qⁿ − 1) · 100.",
          [`q = ${fmt(q, 3)}, qⁿ = ${fmt(q, 3)}<sup>${n}</sup> ≈ ${fmt(q ** n, 4)}`, `Kₙ = ${euro(K0)} · ${fmt(q ** n, 4)}`],
          `${euro(Kn)}, ein Zuwachs von etwa ${fmt((q ** n - 1) * 100, 1)} %`,
          { K0, p, n },
        );
      },
    },
    {
      id: "rueckwaerts",
      make: (rng, level) => {
        const target = 500 * rng.int(4, 40);
        const p = rng.pick([1.5, 2, 2.5, 3, 3.5, 4]);
        const n = rng.int(3, 12);
        const q = factorOf(p);
        const K0 = target / q ** n;
        const slips = [
          { value: target * q ** n, hint: "Rückwärts heißt: durch qⁿ teilen, nicht malnehmen." },
          { value: target / (1 + (p * n) / 100), hint: "Das wäre ohne Zinseszins. Teile durch q hoch n." },
        ];
        const steps = [`q = ${fmt(q, 3)}; qⁿ = ${fmt(q, 3)}<sup>${n}</sup> ≈ ${fmt(q ** n, 4)}`, `K₀ = ${euro(target)} : ${fmt(q ** n, 4)}`];
        if (level === 1)
          return task(
            level,
            `Welches Startkapital wächst bei ${pct(p)} mit Zinseszins in ${n} Jahren auf ${euro(target)}?`,
            [num("K₀ =", K0, "€", 2, { absTolerance: 0.02, slips })],
            "K₀ = Kₙ : qⁿ",
            steps,
            `K₀ ≈ ${euro(K0)}`,
            { target, p, n },
            [`Kₙ = ${euro(target)}`, `p = ${pct(p)}`, `n = ${n} Jahre`],
          );
        const name = rng.pick(NAMES);
        return task(
          level,
          `${name} möchte in ${n} Jahren ${euro(target)} für den Führerschein und ein gebrauchtes Auto haben. Die Bank zahlt ${pct(p)} Zinsen, die mitverzinst werden. Wie viel muss ${name} heute einmalig anlegen?`,
          [num("Einzahlung:", K0, "€", 2, { absTolerance: 0.02, slips })],
          "Gesucht ist das Startkapital: Kₙ durch qⁿ teilen.",
          steps,
          `${name} muss heute etwa ${euro(K0)} anlegen.`,
          { target, p, n },
        );
      },
    },
  ],
});

// 1.7 Zusammenhänge beschreiben, Schaubilder befragen ──────────────────────

const BANKS = ["A", "B", "C", "D"];

/** A small bar chart for a task prompt; `from` is where the value axis starts. */
function rateChart(rates: number[], from: number): string {
  const w = 360;
  const h = 170;
  const top = Math.max(...rates) + 0.5;
  const Y = (value: number) => 140 - ((value - from) / (top - from)) * 120;
  let svg = `<svg class="task-chart" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="Säulendiagramm der Zinssätze von vier Banken">`;
  svg += `<line x1="40" y1="140" x2="350" y2="140" class="lab-axis"/><line x1="40" y1="140" x2="40" y2="12" class="lab-axis"/>`;
  for (let tick = from; tick <= top + 1e-9; tick += 0.5) {
    svg += `<line x1="36" y1="${Y(tick).toFixed(1)}" x2="350" y2="${Y(tick).toFixed(1)}" class="lab-grid"/><text x="32" y="${(Y(tick) + 4).toFixed(1)}" class="lab-text-tick" text-anchor="end">${fmt(tick, 1)}</text>`;
  }
  rates.forEach((rate, i) => {
    const x = 60 + i * 75;
    svg += `<rect x="${x}" y="${Y(rate).toFixed(1)}" width="44" height="${(140 - Y(rate)).toFixed(1)}" class="${i % 2 === 0 ? "lab-fill-a" : "lab-fill-b"}"/>`;
    svg += `<text x="${x + 22}" y="158" class="lab-text-small" text-anchor="middle">Bank ${BANKS[i]}</text>`;
  });
  svg += `<text x="8" y="10" class="lab-text-small">Zinssatz in %</text></svg>`;
  return svg;
}

const CHANGES: Array<{ factor: number; word: string }> = [
  { factor: 2, word: "verdoppelt" },
  { factor: 3, word: "verdreifacht" },
  { factor: 4, word: "vervierfacht" },
  { factor: 0.5, word: "halbiert" },
];

const zusammenhaenge = L({
  id: "zi-7-zusammenhaenge-schaubilder",
  title: "Zusammenhänge beschreiben, Schaubilder befragen",
  subtitle: "Je … desto, wenn … dann und Fragen an ein Diagramm",
  tracks: BOTH,
  whyItMatters:
    "Banken, Werbung und Nachrichten zeigen Zinsen und Preise in Diagrammen. Wer in Worten sagen kann, wie eine Größe von einer anderen abhängt, und gezielt nachfragt, lässt sich nicht so leicht täuschen.",
  explanationHtml: `
    <p>Die Grundgrößen hängen voneinander ab. Bleiben zwei davon fest, kannst du den Zusammenhang der beiden anderen in Worten sagen:</p>
    <ul>
      <li><strong>Proportional:</strong> Bei festem Zinssatz und fester Zeit gilt: Wenn das Kapital verdoppelt wird, dann verdoppeln sich die Zinsen. Je mehr Kapital, desto mehr Zinsen. Genauso hängen Zinsen und Zeit zusammen, und Prozentwert und Grundwert.</li>
      <li><strong>Umgekehrt proportional:</strong> Sollen die Zinsen gleich bleiben, gilt: Je höher der Zinssatz, desto weniger Kapital braucht man. Doppelter Zinssatz, halbes Kapital.</li>
      <li><strong>Weder noch:</strong> Beim Zinseszins wächst das Kapital mit der Zeit, aber doppelte Laufzeit bringt nicht das doppelte Kapital.</li>
    </ul>
    <p>Zu einem <strong>Schaubild</strong> stellst du selbst Fragen, die du mit den abgelesenen Zahlen beantworten kannst: Welcher Wert ist am größten? Wie groß ist der Unterschied? Was bedeutet er für 1.000 €? Prüfe auch, ob die Achse bei 0 beginnt. Sonst wirken kleine Unterschiede riesig.</p>
    <div class="example"><strong>Beispiel:</strong> Ein Säulendiagramm zeigt Tagesgeld-Zinssätze: Bank A 1,5 %, Bank B 2 %, Bank C 2,5 %. Frage: Wie viel Zinsen bringen 2.000 € in einem Jahr bei Bank C mehr als bei Bank A? Rechnung: 2.000 € · 2,5 : 100 − 2.000 € · 1,5 : 100 = 50 € − 30 € = 20 €.</div>
    <div class="merke"><strong>Merke:</strong> Beschreibe Abhängigkeiten mit „je …, desto …“ und „wenn …, dann …“ und sage dazu, welche Größen fest bleiben. Zu einem Schaubild stellst du Fragen, die du mit abgelesenen Zahlen berechnen kannst, und prüfst den Beginn der Achsen.</div>
  `,
  formulas: [
    { name: "Proportional", html: "doppelt so viel → doppelt so viel", quantities: "Zinsen und Kapital, Zinsen und Zeit (die anderen Größen fest)" },
    { name: "Umgekehrt proportional", html: "doppelt so viel → halb so viel", quantities: "Zinssatz und nötiges Kapital bei festen Zinsen" },
  ],
  quiz: {
    question: "Zinssatz und Zeit bleiben gleich, das Kapital wird halbiert. Welcher Satz stimmt?",
    options: ["Wenn das Kapital halbiert wird, dann halbieren sich die Zinsen.", "Je weniger Kapital, desto mehr Zinsen.", "Die Zinsen bleiben gleich.", "Die Zinsen verdoppeln sich."],
    correctIndex: 0,
    explanation:
      "Bei festem Zinssatz und fester Zeit sind Zinsen und Kapital proportional: halbes Kapital, halbe Zinsen.",
  },
  lab: lab(
    "relation-graph",
    "Je mehr, desto …?",
    "Wähle einen Zusammenhang und ziehe den Punkt: Wie ändert sich das Ergebnis, wenn die Eingabe mal k genommen wird? Der blaue Punkt ist die Ausgangslage.",
    [choice("rel", "Zusammenhang", RELATIONS.map((rel) => `${rel.input} → ${rel.output}`), 0), r("k", "Faktor k bei der Eingabe", 0.5, 4, 1, 0.5)],
    [
      o("faktor", "Faktor beim Ergebnis", (v) => (RELATIONS[v.rel] ?? RELATIONS[0]).f(v.k), "", 2, true),
      o("art", "Art des Zusammenhangs", (v) => (RELATIONS[v.rel] ?? RELATIONS[0]).kind),
    ],
    [
      { id: "umgekehrt", text: "Zeige einen Je-mehr-desto-weniger-Zusammenhang: Verdreifache den Zinssatz bei festen Zinsen.", check: (v) => v.rel === 2 && v.k === 3 },
      { id: "nicht-proportional", text: "Finde den Zusammenhang, bei dem die doppelte Eingabe nicht das doppelte Ergebnis gibt, und stelle k = 2 ein.", check: (v) => v.rel === 3 && v.k === 2 },
      { id: "zweieinhalb", text: "Zeige am Graphen: Das 2,5-fache Kapital bringt die 2,5-fachen Zinsen.", check: (v) => v.rel === 0 && v.k === 2.5 },
    ],
  ),
  exercises: [
    {
      id: "je-desto",
      make: (rng, level) => {
        const K = 400 * rng.int(2, 12);
        const p = rng.pick([1, 1.5, 2, 2.5, 3]);
        const Z = yearInterest(K, p);
        if (level === 1) {
          const change = rng.pick(CHANGES);
          const varyCapital = rng.next() < 0.5;
          const options = [`werden ${change.word}`, `werden ${change.factor === 0.5 ? "verdoppelt" : "halbiert"}`, "bleiben gleich"];
          return task(
            level,
            `${euro(K)} bringen bei ${pct(p)} in einem Jahr ${euro(Z)} Zinsen. ${varyCapital ? "Das Kapital" : "Die Zeit"} wird ${change.word}, ${varyCapital ? "Zinssatz und Zeit bleiben gleich" : "Kapital und Zinssatz bleiben gleich"}. Was passiert mit den Zinsen? Wie hoch sind sie dann?`,
            [choiceField("Die Zinsen …", options, 0), num("neue Zinsen:", Z * change.factor, "€", 2, { slips: [{ value: Z / change.factor, hint: "Zinsen und Kapital (oder Zeit) sind proportional, nicht umgekehrt proportional." }] })],
            "Bei festen übrigen Größen sind Zinsen und Kapital proportional, ebenso Zinsen und Zeit.",
            [`Proportional: ${varyCapital ? "Kapital" : "Zeit"} mal ${fmt(change.factor)} → Zinsen mal ${fmt(change.factor)}`, `${euro(Z)} · ${fmt(change.factor)} = ${euro(Z * change.factor)}`],
            `Die Zinsen werden ${change.word}: ${euro(Z * change.factor)}`,
            { K, p },
            [`K = ${euro(K)}`, `p = ${pct(p)}`, `Z = ${euro(Z)}`],
          );
        }
        const kind = rng.int(0, 2);
        if (kind === 0) {
          return task(
            level,
            `Bei festem Zinssatz wird das Kapital verdoppelt und die Anlagezeit halbiert. Vorher gab es ${euro(Z)} Zinsen. Wie ändern sich die Zinsen? Beschreibe mit „wenn …, dann …“ und gib die neuen Zinsen an.`,
            [choiceField("Die Zinsen …", ["bleiben gleich", "verdoppeln sich", "halbieren sich", "vervierfachen sich"], 0), num("neue Zinsen:", Z, "€", 2, { slips: [{ value: 4 * Z, hint: "Die Zeit wird halbiert, das gleicht die Verdopplung aus." }] })],
            "Jede Änderung wirkt als Faktor auf die Zinsen: Kapital mal 2, Zeit mal 1/2.",
            ["Wenn das Kapital verdoppelt wird, dann verdoppeln sich die Zinsen.", "Wenn die Zeit halbiert wird, dann halbieren sich die Zinsen. Zusammen: mal 2 mal 1/2 = mal 1."],
            `Die Zinsen bleiben gleich: ${euro(Z)}`,
            { K, p },
          );
        }
        const factor = rng.pick([2, 3, 4]);
        return task(
          level,
          `Für ${euro(Z)} Zinsen in einem Jahr braucht man bei ${pct(p)} ein Kapital von ${euro(K)}. Wie viel Kapital braucht man für dieselben Zinsen, wenn der Zinssatz ${factor === 2 ? "doppelt" : factor === 3 ? "dreimal" : "viermal"} so hoch ist? Welcher Satz beschreibt den Zusammenhang?`,
          [num("Kapital:", K / factor, "€", 2, { slips: [{ value: K * factor, hint: "Bei festen Zinsen gilt: je höher der Zinssatz, desto weniger Kapital." }] }), choiceField("Zusammenhang", ["Je höher der Zinssatz, desto weniger Kapital.", "Je höher der Zinssatz, desto mehr Kapital.", "Der Zinssatz ändert das Kapital nicht."], 0)],
          "Bei festen Zinsen sind Zinssatz und Kapital umgekehrt proportional.",
          [`Zinssatz mal ${factor} → Kapital durch ${factor}`, `${euro(K)} : ${factor} = ${euro(K / factor)}`],
          `${euro(K / factor)}; je höher der Zinssatz, desto weniger Kapital`,
          { K, p },
        );
      },
    },
    {
      id: "schaubild",
      make: (rng, level) => {
        const rates = BANKS.map(() => rng.pick([1, 1.5, 2, 2.5, 3, 3.5]));
        while (new Set(rates).size < 3) rates[rng.int(0, 3)] = rng.pick([1, 1.5, 2, 2.5, 3, 3.5]);
        const best = Math.max(...rates);
        const worst = Math.min(...rates);
        const bi = rates.indexOf(best);
        const wi = rates.indexOf(worst);
        const K = 500 * rng.int(2, 12);
        if (level === 1)
          return task(
            level,
            `Das Säulendiagramm zeigt die Zinssätze für Tagesgeld bei vier Banken. Lies den höchsten Zinssatz ab und berechne, wie viel Zinsen ${euro(K)} damit in einem Jahr bringen.<br>${rateChart(rates, 0)}`,
            [num("höchster Zinssatz:", best, "%", 1), num("Zinsen:", yearInterest(K, best), "€", 2, { slips: [{ value: yearInterest(K, worst), hint: "Das ist der niedrigste Zinssatz. Gefragt war der höchste." }] })],
            "Ablesen an der höchsten Säule, dann Z = K · p : 100.",
            [`Höchste Säule: Bank ${BANKS[bi]} mit ${pct(best, 1)}`, `Z = ${euro(K)} · ${fmt(best)} : 100`],
            `${pct(best, 1)}, Zinsen ${euro(yearInterest(K, best))}`,
            { K },
          );
        const misleading = rng.next() < 0.6;
        const from = misleading ? worst - 0.5 : 0;
        const ratioShown = (best - from) / (worst - from);
        return task(
          level,
          `Eine Werbung zeigt die Tagesgeld-Zinssätze von vier Banken. Stelle dir die Frage: Wie viel mehr Zinsen bringen ${euro(K)} in einem Jahr bei der besten als bei der schlechtesten Bank? Beantworte sie. Prüfe außerdem die Achse: Ist die Säule der besten Bank im Bild ${fmt(ratioShown, 1)}-mal so hoch wie die der schlechtesten, ist dann auch ihr Zinssatz ${fmt(ratioShown, 1)}-mal so hoch?<br>${rateChart(rates, from)}`,
          [
            num("Unterschied:", yearInterest(K, best) - yearInterest(K, worst), "€", 2, { slips: [{ value: best - worst, hint: "Das ist der Unterschied der Zinssätze in Prozentpunkten. Gefragt sind Euro." }] }),
            choiceField("Zinssatz im gleichen Verhältnis wie die Säulen?", misleading ? ["Nein, die Achse beginnt nicht bei 0.", "Ja, die Säulen zeigen das Verhältnis."] : ["Ja, die Achse beginnt bei 0.", "Nein, die Achse beginnt nicht bei 0."], 0),
          ],
          "Lies beide Zinssätze ab, berechne beide Jahreszinsen und ziehe sie voneinander ab. Schau, bei welchem Wert die senkrechte Achse beginnt.",
          [`Beste Bank ${BANKS[bi]}: ${pct(best, 1)}, schlechteste Bank ${BANKS[wi]}: ${pct(worst, 1)}`, `${euro(yearInterest(K, best))} − ${euro(yearInterest(K, worst))}`, misleading ? `Die Achse beginnt bei ${fmt(from, 1)} %. Die Säulenhöhen übertreiben den Unterschied: ${fmt(best, 1)} : ${fmt(worst, 1)} ≈ ${fmt(best / worst, 2)}.` : "Die Achse beginnt bei 0, die Säulenhöhen stimmen mit den Zinssätzen überein."],
          `${euro(yearInterest(K, best) - yearInterest(K, worst))} mehr; ${misleading ? "die Säulen täuschen" : "die Säulen zeigen das Verhältnis richtig"}`,
          { K },
        );
      },
    },
  ],
});

export const STAGE = makeStage(
  1,
  "Kapital, Zinsen, Zinssatz und Zeit: von Jahreszinsen bis Zinseszins",
  "#0f766e",
  "💶",
  [jahreszinsen, monatsTageszinsen, umstellen, effektiv, zinseszins, zinsfaktor, zusammenhaenge],
);
