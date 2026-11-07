import { fmt } from "../exercises/format";
import {
  AREA,
  boxSurface,
  convert,
  foldNet,
  LENGTH,
  MASS,
  MONEY,
  NET_PATTERNS,
  notchArea,
  oppositeFace,
  stackSurface,
  TIME,
  type NetPattern,
} from "../models";
import { LAKE_AREA, SIZE_KINDS, sizeTimes } from "../lab/views-gym";
import { MEASURE_OBJECTS, MEASURE_UNITS, NOTATION_KINDS, rung, SCALES, toMetres, timeText } from "../lab/views-groessen";
import { numberField as num, choiceField as pick } from "./helpers";
import {
  lab,
  range as r,
  choice as c,
  output as o,
  makeLesson,
  makeStage,
  task,
} from "./builders";

const n0 = (value: number) => fmt(value, 0);
const L1 = (step: number, content: Parameters<typeof makeLesson>[3]) => makeLesson(4, step, 1, content);
const L2 = (step: number, content: Parameters<typeof makeLesson>[3]) => makeLesson(4, step, 2, content);
/** Sizes keep all their places: 2,40 € and not 2,4 €. */
const comma = (value: number, digits: number) => value.toFixed(digits).replace(".", ",");
const lengthText = (metres: number) => (Number.isInteger(metres) ? n0(metres) : comma(metres, 2));

const laengeMasse = L1(1, {
  id: "gr-1-laenge-masse",
  title: "4.1 Messen: Länge und Masse",
  subtitle: "Maßzahl, Maßeinheit und Umrechnen",
  whyItMatters:
    "„3“ sagt nichts. Erst „3 km“ oder „3 kg“ ist eine Größe. Beim Umrechnen ändert sich die Schreibweise, nicht die Größe.",
  explanationHtml: `<p><strong>Messen</strong> heißt vergleichen: Wie oft passt die Einheit in das, was du misst? Eine <strong>Größe</strong> besteht aus <strong>Maßzahl</strong> und <strong>Maßeinheit</strong>: In 3 km ist 3 die Maßzahl und km die Einheit.</p><p><strong>Länge:</strong> 1 km = 1.000 m, 1 m = 10 dm, 1 dm = 10 cm, 1 cm = 10 mm. <strong>Masse:</strong> 1 t = 1.000 kg, 1 kg = 1.000 g, 1 g = 1.000 mg. Zur kleineren Einheit multiplizierst du, zur größeren dividierst du.</p><div class="example">3 km 250 m = 3.250 m. 7.000 g = 7 kg. 2 m 5 cm = 205 cm. Prüfe: Kleinere Einheit, größere Maßzahl.</div><div class="merke"><strong>Merke:</strong> Kleinere Einheit: größere Maßzahl. Die Größe selbst bleibt gleich.</div>`,
  formulas: [
    { name: "Länge", html: "1 km = 1.000 m, 1 m = 10 dm = 100 cm, 1 cm = 10 mm", quantities: "km, m, dm, cm, mm" },
    { name: "Masse", html: "1 t = 1.000 kg, 1 kg = 1.000 g, 1 g = 1.000 mg", quantities: "t, kg, g, mg" },
  ],
  quiz: {
    question: "Wie viele Zentimeter sind 4 m 7 cm?",
    options: ["407 cm", "47 cm", "4.007 cm"],
    correctIndex: 0,
    explanation: "4 m sind 400 cm, dazu 7 cm: 407 cm.",
  },
  lab: lab(
    "ladder-length-mass",
    "Einheitenleiter",
    "Wähle die Größe, die Maßzahl und die Einheiten. Die Leiter zeigt, ob du multiplizierst oder dividierst.",
    [c("kind", "Größe", ["Länge", "Masse"]), r("amount", "Maßzahl", 1, 5000, 2), r("from", "Von Einheit Nummer", 0, 4, 1), r("to", "Nach Einheit Nummer", 0, 4, 0)],
    [
      o("ergebnis", "Umgerechnet", (v) => {
        const ladder = v.kind === 0 ? LENGTH : MASS;
        return `${fmt(convert(ladder, v.amount, rung(ladder, v.from), rung(ladder, v.to)), 12)} ${ladder.units[rung(ladder, v.to)]}`;
      }),
    ],
    [
      { id: "kilometer", text: "Rechne 3 km in m um.", check: (v) => v.kind === 0 && v.amount === 3 && v.from === 4 && v.to === 3 },
      { id: "tonne", text: "Rechne 2 t in kg um.", check: (v) => v.kind === 1 && v.amount === 2 && rung(MASS, v.from) === 3 && rung(MASS, v.to) === 2 },
      { id: "gross", text: "Rechne 5.000 mg in g um.", check: (v) => v.kind === 1 && v.amount === 5000 && rung(MASS, v.from) === 0 && rung(MASS, v.to) === 1 },
    ],
  ),
  exercises: [
    {
      id: "umrechnen",
      make: (rng, level) => {
        const length = rng.int(0, 1) === 0;
        if (level === 1) {
          const pairs: ReadonlyArray<readonly [string, string, number]> = length
            ? [["km", "m", 1000], ["m", "cm", 100], ["m", "dm", 10], ["cm", "mm", 10]]
            : [["t", "kg", 1000], ["kg", "g", 1000], ["g", "mg", 1000]];
          const [big, small, factor] = rng.pick(pairs);
          const k = rng.int(2, 90);
          return task(
            level,
            `Rechne die gegebene Größe ${k} ${big} in ${small} um.`,
            "",
            [num(`${small}:`, k * factor, small, 0, { slips: [{ value: k, hint: "Die Maßzahl muss sich ändern, wenn sich die Einheit ändert." }] })],
            "Zur kleineren Einheit multiplizierst du.",
            `1 ${big} = ${n0(factor)} ${small}. ${k} · ${n0(factor)} = ${n0(k * factor)}.`,
            `${k} ${big} = ${n0(k * factor)} ${small}`,
            { k, factor },
          );
        }
        if (length) {
          const km = rng.int(2, 42), m = rng.int(1, 999);
          return task(
            level,
            "",
            `Ein Wanderweg ist ${km} km ${m} m lang. Wie viele Meter sind das?`,
            [num("Länge:", km * 1000 + m, "m", 0)],
            "Erst die Kilometer umrechnen, dann die Meter dazurechnen.",
            `${km} · 1.000 m = ${n0(km * 1000)} m, dann ${m} m dazu.`,
            `Der Weg ist ${n0(km * 1000 + m)} m lang.`,
            { km, m },
          );
        }
        const t = rng.int(3, 28), kg = rng.int(1, 999);
        return task(
          level,
          "",
          `Ein Lastwagen wiegt ${t} t ${kg} kg. Wie viele Kilogramm sind das?`,
          [num("Masse:", t * 1000 + kg, "kg", 0)],
          "Erst die Tonnen umrechnen, dann die Kilogramm dazurechnen.",
          `${t} · 1.000 kg = ${n0(t * 1000)} kg, dann ${kg} kg dazu.`,
          `Der Lastwagen wiegt ${n0(t * 1000 + kg)} kg.`,
          { t, kg },
        );
      },
    },
    {
      id: "vergleichen",
      make: (rng, level) => {
        const a = rng.int(2, 9), extra = rng.int(1, 9) * 100;
        const firstBigger = rng.int(0, 1) === 0;
        const left = `${a} km`;
        const value = firstBigger ? a * 1000 - extra : a * 1000 + extra;
        if (level === 1)
          return task(
            level,
            `Was ist länger: ${left} oder ${n0(value)} m?`,
            "",
            [pick("Länger ist …", [left, `${n0(value)} m`], firstBigger ? 0 : 1)],
            "Rechne beide Längen in dieselbe Einheit um.",
            `${left} = ${n0(a * 1000)} m.`,
            `Länger ist ${firstBigger ? left : `${n0(value)} m`}.`,
            { a, value },
          );
        const kg = rng.int(4, 40), g = rng.int(1, 9) * 100, parcels = rng.int(3, 9);
        const total = (kg * 1000 + g) * parcels;
        return task(
          level,
          "",
          `Ein Paket wiegt ${kg} kg ${g} g. Wie schwer sind ${parcels} solche Pakete zusammen? Gib das Ergebnis in Gramm an.`,
          [num("Masse:", total, "g", 0)],
          "Rechne ein Paket in Gramm um und vervielfache dann.",
          `${kg} kg ${g} g = ${n0(kg * 1000 + g)} g. ${n0(kg * 1000 + g)} g · ${parcels} = ${n0(total)} g.`,
          `Sie wiegen ${n0(total)} g.`,
          { kg, g, parcels },
        );
      },
    },
  ],
});

const geldZeit = L1(2, {
  id: "gr-2-geld-zeit",
  title: "4.2 Geld und Zeit",
  subtitle: "Euro und Cent, Stunden, Minuten und Sekunden",
  whyItMatters:
    "Bei Geld gilt die 100, bei der Zeit die 60. Dieser Unterschied ist eine häufige Fehlerquelle.",
  explanationHtml: `<p><strong>Geld:</strong> 1 € = 100 ct. <strong>Zeit:</strong> 1 h = 60 min, 1 min = 60 s. Die Zeit hat also keine Zehnerstufen. Darum schreibst du Zeitangaben auch nicht mit Komma, sondern als 1 h 30 min.</p><p>Eine <strong>Zeitspanne</strong> berechnest du am besten über die volle Stunde: von 7:45 Uhr bis 8:20 Uhr sind es 15 min bis 8:00 Uhr und 20 min danach.</p><div class="example">3 € 45 ct = 345 ct. 2 h 15 min = 135 min. 200 s = 3 min 20 s.</div><div class="merke"><strong>Merke:</strong> Geld: Faktor 100. Zeit: Faktor 60. Zeit rechnest du nicht in Kommaschreibweise um.</div>`,
  formulas: [
    { name: "Geld", html: "1 € = 100 ct", quantities: "Euro und Cent" },
    { name: "Zeit", html: "1 h = 60 min, 1 min = 60 s", quantities: "Stunde, Minute, Sekunde" },
  ],
  quiz: {
    question: "Wie viele Minuten sind 2 h 30 min?",
    options: ["150 min", "230 min", "90 min"],
    correctIndex: 0,
    explanation: "2 · 60 min = 120 min, dazu 30 min: 150 min.",
  },
  lab: lab(
    "ladder-money-time",
    "Geld und Zeit",
    "Wähle Geld oder Zeit und rechne um. Bei der Zeit steht die 60 auf der Leiter.",
    [c("kind", "Größe", ["Geld", "Zeit"]), r("amount", "Maßzahl", 1, 5000, 3), r("from", "Von Einheit Nummer", 0, 2, 0), r("to", "Nach Einheit Nummer", 0, 2, 1)],
    [
      o("ergebnis", "Umgerechnet", (v) => {
        const ladder = v.kind === 0 ? MONEY : TIME;
        const to = rung(ladder, v.to), from = rung(ladder, v.from);
        const value = convert(ladder, v.amount, from, to);
        if (ladder === TIME && !Number.isInteger(value)) return timeText(convert(TIME, v.amount, from, 0));
        return `${fmt(value, 12)} ${ladder.units[to]}`;
      }),
    ],
    [
      { id: "stunde", text: "Rechne 3 h in min um.", check: (v) => v.kind === 1 && v.amount === 3 && v.from === 2 && v.to === 1 },
      { id: "euro", text: "Rechne 500 ct in € um.", check: (v) => v.kind === 0 && v.amount === 500 && rung(MONEY, v.from) === 0 && rung(MONEY, v.to) === 1 },
      { id: "sekunden", text: "Rechne 90 min in Stunden und Minuten um.", check: (v) => v.kind === 1 && v.amount === 90 && v.from === 1 && v.to === 2 },
    ],
  ),
  exercises: [
    {
      id: "umrechnen-geld-zeit",
      make: (rng, level) => {
        const money = rng.int(0, 1) === 0;
        if (level === 1) {
          if (money) {
            const euro = rng.int(2, 40), ct = rng.int(1, 99);
            return task(
              level,
              `Rechne den Betrag ${euro} € ${ct} ct in Cent um.`,
              "",
              [num("Cent:", euro * 100 + ct, "ct", 0)],
              "1 € = 100 ct",
              `${euro} · 100 ct + ${ct} ct.`,
              `${euro} € ${ct} ct = ${n0(euro * 100 + ct)} ct`,
              { euro, ct },
            );
          }
          const h = rng.int(1, 9), min = rng.int(1, 59);
          return task(
            level,
            `Rechne die Zeit ${h} h ${min} min in Minuten um.`,
            "",
            [num("Minuten:", h * 60 + min, "min", 0, { slips: [{ value: h * 100 + min, hint: "Eine Stunde hat 60 Minuten, nicht 100." }] })],
            "1 h = 60 min",
            `${h} · 60 min + ${min} min.`,
            `${h} h ${min} min = ${h * 60 + min} min`,
            { h, min },
          );
        }
        const seconds = rng.int(3, 45) * 60 + rng.int(1, 59);
        return task(
          level,
          "",
          `Ein Lauf dauert ${n0(seconds)} Sekunden. Wie viele ganze Minuten und wie viele Sekunden sind das?`,
          [num("Minuten:", Math.floor(seconds / 60), "min", 0), num("Sekunden:", seconds % 60, "s", 0)],
          "Dividiere durch 60. Der Rest sind die Sekunden.",
          `${n0(seconds)} : 60 = ${Math.floor(seconds / 60)} Rest ${seconds % 60}.`,
          `${Math.floor(seconds / 60)} min ${seconds % 60} s`,
          { seconds },
        );
      },
    },
    {
      id: "zeitspanne",
      make: (rng, level) => {
        const startH = rng.int(6, 18), startMin = rng.pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
        const clock = (h: number, m: number) => `${h}:${String(m).padStart(2, "0")} Uhr`;
        const span = rng.pick([20, 35, 50, 65, 80, 95, 110, 125]);
        const total = startH * 60 + startMin + span;
        const endH = Math.floor(total / 60), endMin = total % 60;
        const sameHour = endH === startH;
        const toNext = 60 - startMin;
        const way = sameHour
          ? `${endMin} − ${startMin} = ${span} min, weil beide Zeiten in derselben Stunde liegen.`
          : endH - startH === 1
            ? endMin === 0
              ? `${toNext} min bis ${clock(startH + 1, 0)}.`
              : `${toNext} min bis ${clock(startH + 1, 0)} und ${endMin} min danach: ${toNext} + ${endMin} = ${span} min.`
            : endMin === 0
              ? `${toNext} min bis ${clock(startH + 1, 0)}, dann ${(endH - startH - 1) * 60} min: zusammen ${span} min.`
              : `${toNext} min bis ${clock(startH + 1, 0)}, dann ${(endH - startH - 1) * 60} min und ${endMin} min: zusammen ${span} min.`;
        const hint = sameHour ? "Beide Zeiten liegen in derselben Stunde: Subtrahiere die Minuten." : "Rechne über die volle Stunde.";
        if (level === 1)
          return task(
            level,
            `Wie viele Minuten liegen zwischen ${clock(startH, startMin)} und ${clock(endH, endMin)}?`,
            "",
            [num("Zeitspanne:", span, "min", 0)],
            hint,
            way,
            `Es sind ${span} min.`,
            { startH, startMin, span },
          );
        return task(
          level,
          "",
          `Ein Zug fährt um ${clock(startH, startMin)} ab und kommt um ${clock(endH, endMin)} an. Wie lange dauert die Fahrt in Minuten?`,
          [num("Dauer:", span, "min", 0)],
          hint,
          way,
          `Die Fahrt dauert ${span} min.`,
          { startH, startMin, span },
        );
      },
    },
  ],
});

const kommaschreibweise = L1(3, {
  id: "gr-3-kommaschreibweise",
  title: "4.3 Größen in Kommaschreibweise",
  subtitle: "Die Einheitentafel für Geld, Länge und Masse",
  whyItMatters:
    "Auf jedem Preisschild steht 3,75 €, auf der Waage 1,250 kg. Das Komma trennt die Einheiten, und die Einheitentafel zeigt dir, wo jede Ziffer hingehört.",
  explanationHtml: `<p>Die <strong>Kommaschreibweise</strong> ist eine kurze Schreibweise für zwei Einheiten. Das Komma steht direkt hinter der größeren Einheit. In der <strong>Einheitentafel</strong> steht jede Ziffer an ihrem Platz: Bei € und ct sind es nach dem Komma zwei Stellen, bei m und cm zwei, bei kg und g drei, bei km und m drei.</p><p>3,75 € sind 3 € 75 ct. 2,05 m sind 2 m 5 cm, denn die 5 steht auf dem Platz der Zentimeter. 1,250 kg sind 1 kg 250 g. Eine Null am Ende darf fehlen: 1,25 kg und 1,250 kg sind gleich.</p><div class="example">1,5 m = 150 cm. 3,04 € = 304 ct. 0,75 kg = 750 g. Umgekehrt: 4.300 m = 4,3 km.</div><div class="merke"><strong>Merke:</strong> Trage die Größe in die Einheitentafel ein. Das Komma steht hinter der größeren Einheit. Bei der Zeit verwendest du diese Schreibweise nicht.</div>`,
  formulas: [
    { name: "Geld", html: "3,75 € = 3 € 75 ct = 375 ct", quantities: "Zwei Stellen nach dem Komma bis ct" },
    { name: "Länge", html: "2,05 m = 205 cm; 1,5 km = 1.500 m", quantities: "m und cm: zwei Stellen; km und m: drei Stellen" },
    { name: "Masse", html: "1,250 kg = 1.250 g", quantities: "Drei Stellen bis g" },
  ],
  quiz: {
    question: "Wie viel sind 2,05 m in Zentimetern?",
    options: ["205 cm", "250 cm", "2,05 cm"],
    correctIndex: 0,
    explanation: "Die 5 steht an der Stelle der Zentimeter, die 0 an der Stelle der Dezimeter.",
  },
  lab: lab(
    "notation",
    "Drei Schreibweisen",
    "Wähle die Einheit und ziehe. Du siehst dieselbe Größe in drei Schreibweisen.",
    [c("kind", "Einheit", NOTATION_KINDS.map((k) => `${k.big} und ${k.small}`)), r("whole", "Ganze", 0, 5, 1), r("pct", "Anteil (von 100)", 0, 95, 20, 5)],
    [
      o("komma", "Mit Komma", (v) => { const k = NOTATION_KINDS[v.kind]; return `${(v.whole + v.pct / 100).toFixed(k.digits).replace(".", ",")} ${k.big}`; }),
      o("klein", "In der kleineren Einheit", (v) => { const k = NOTATION_KINDS[v.kind]; return `${n0(v.whole * k.base + (k.base * v.pct) / 100)} ${k.small}`; }),
    ],
    [
      { id: "euro", text: "Stelle 3,75 € ein.", check: (v) => v.kind === 0 && v.whole === 3 && v.pct === 75 },
      { id: "kilo", text: "Stelle 2,500 kg ein.", check: (v) => v.kind === 2 && v.whole === 2 && v.pct === 50 },
      { id: "kilometer", text: "Stelle 4,250 km ein, das sind 4.250 m.", check: (v) => v.kind === 3 && v.whole === 4 && v.pct === 25 },
    ],
  ),
  exercises: [
    {
      id: "komma-in-klein",
      make: (rng, level) => {
        const [big, small, base, digits] = rng.pick([
          ["€", "ct", 100, 2],
          ["m", "cm", 100, 2],
          ["kg", "g", 1000, 3],
          ["km", "m", 1000, 3],
        ] as const);
        const whole = rng.int(1, 19);
        const part = rng.int(1, base - 1);
        const value = (whole * base + part) / base;
        if (level === 1)
          return task(
            level,
            `Schreibe die Größe ${comma(value, digits)} ${big} in ${small}.`,
            "",
            [num(`${small}:`, whole * base + part, small, 0)],
            `1 ${big} = ${n0(base)} ${small}. Nutze die Einheitentafel.`,
            `${whole} ${big} und ${part} ${small}: ${n0(whole * base)} + ${part}.`,
            `${comma(value, digits)} ${big} = ${n0(whole * base + part)} ${small}`,
            { whole, part, base },
          );
        return task(
          level,
          "",
          `Schreibe die Größe ${n0(whole * base + part)} ${small} in Kommaschreibweise mit der Einheit ${big}.`,
          [num(`${big}:`, value, big, digits, { slips: [{ value: whole * base + part, hint: "Das ist die Maßzahl in der kleineren Einheit. Das Komma fehlt noch." }] })],
          `Teile durch ${n0(base)}: Das Komma rückt ${digits} Stellen nach links.`,
          `${n0(whole * base + part)} : ${n0(base)}.`,
          `${n0(whole * base + part)} ${small} = ${comma(value, digits)} ${big}`,
          { whole, part, base },
        );
      },
    },
    {
      id: "einheitentafel",
      make: (rng, level) => {
        const m = rng.int(1, 9), cm = rng.pick([5, 8, 10, 25, 40, 60, 75, 90]);
        const value = (m * 100 + cm) / 100;
        if (level === 1)
          return task(
            level,
            `Eine Schnur ist ${m} m ${cm} cm lang. Schreibe die Länge mit Komma in Meter.`,
            "",
            [num("Länge:", value, "m", 2, { slips: [{ value: m + cm / 10, hint: "Nach dem Komma stehen zwei Stellen: Dezimeter und Zentimeter." }] })],
            "Hinter dem Komma stehen Dezimeter und Zentimeter.",
            `${cm} cm stehen mit zwei Stellen hinter dem Komma.`,
            `Die Schnur ist ${comma(value, 2)} m lang.`,
            { m, cm },
          );
        const kg = rng.int(1, 12), g = rng.int(5, 999);
        const inKg = (kg * 1000 + g) / 1000;
        return task(
          level,
          "",
          `Auf dem Paket steht ${comma(inKg, 3)} kg. Wie viele Gramm wiegt es?`,
          [num("Masse:", kg * 1000 + g, "g", 0)],
          "1 kg = 1.000 g. Hinter dem Komma stehen drei Stellen.",
          `${kg} kg = ${n0(kg * 1000)} g, dazu ${g} g.`,
          `Es wiegt ${n0(kg * 1000 + g)} g.`,
          { kg, g },
        );
      },
    },
  ],
});

const rechnenMitGroessen = L1(4, {
  id: "gr-4-rechnen",
  title: "4.4 Rechnen mit Größen",
  subtitle: "Addieren, subtrahieren, vervielfachen, dividieren",
  whyItMatters:
    "3 m + 20 cm ist nicht 23. Beim Rechnen zählt die Einheit genauso viel wie die Zahl.",
  explanationHtml: `<p><strong>Addieren und subtrahieren</strong> darfst du nur Größen derselben Art in <strong>derselben Einheit</strong>. Dann rechnest du mit den Maßzahlen, die Einheit bleibt. Mit Kommaschreibweise schreibst du die Kommas untereinander.</p><p><strong>Vervielfachen und Dividieren durch eine Zahl:</strong> Die Maßzahl wird multipliziert oder geteilt, die Einheit bleibt. <strong>Größe durch Größe:</strong> Das Ergebnis ist eine Zahl ohne Einheit, sie sagt, wie oft die eine in die andere passt.</p><div class="example">2,35 m + 80 cm = 2,35 m + 0,80 m = 3,15 m. 3 kg 200 g · 4 = 3.200 g · 4 = 12.800 g. 2 m : 25 cm = 200 cm : 25 cm = 8.</div><div class="merke"><strong>Merke:</strong> Erst gleiche Einheiten, dann rechnen. Die Einheit gehört zur Antwort.</div>`,
  formulas: [
    { name: "Addieren", html: "3 m + 20 cm = 300 cm + 20 cm = 320 cm", quantities: "Vorher in dieselbe Einheit umrechnen" },
    { name: "Vervielfachen", html: "4 · 3 kg = 12 kg", quantities: "Die Maßzahl ändert sich, die Einheit nicht" },
    { name: "Größe durch Größe", html: "2 m : 25 cm = 8", quantities: "Ergebnis ohne Einheit" },
  ],
  quiz: {
    question: "Was ergibt 1,50 € + 75 ct?",
    options: ["2,25 €", "76,50 €", "1,75 €"],
    correctIndex: 0,
    explanation: "75 ct = 0,75 €. 1,50 € + 0,75 € = 2,25 €.",
  },
  lab: lab(
    "size-times",
    "Vervielfachen",
    "Stelle die Größe und den Faktor ein. Die App rechnet über die kleinere Einheit.",
    [c("kind", "Einheiten", SIZE_KINDS.map((k) => `${k.big} und ${k.small}`)), r("whole", "Ganze", 0, 9, 3), r("part", "Kleinere Einheit (Fünferschritte)", 0, 95, 20, 5), r("k", "Faktor", 1, 9, 2)],
    [
      o("klein", "In der kleineren Einheit", (v) => `${n0(SIZE_KINDS[v.kind].base * v.whole + v.part)} ${SIZE_KINDS[v.kind].small}`),
      o("ergebnis", "Mal Faktor", (v) => sizeTimes(v.kind, v.whole, v.part, v.k)),
    ],
    [
      { id: "beispiel", text: "Stelle 3 m 20 cm mal 4 ein.", check: (v) => v.kind === 0 && v.whole === 3 && v.part === 20 && v.k === 4 },
      { id: "kilo", text: "Stelle 2 kg 50 g mal 3 ein.", check: (v) => v.kind === 1 && v.whole === 2 && v.part === 50 && v.k === 3 },
      { id: "geld", text: "Stelle 1 € 25 ct mal 8 ein: genau 10 €.", check: (v) => v.kind === 2 && v.whole === 1 && v.part === 25 && v.k === 8 },
    ],
  ),
  exercises: [
    {
      id: "gemischte-einheiten",
      make: (rng, level) => {
        if (level === 1 && rng.int(0, 1) === 0) {
          const kg = rng.int(1, 9), g1 = rng.int(1, 19) * 50, g2 = rng.int(1, 19) * 50;
          const plus = rng.int(0, 1) === 0 || kg * 1000 + g1 <= g2;
          const startKg = (kg * 1000 + g1) / 1000;
          const value = (kg * 1000 + g1 + (plus ? g2 : -g2)) / 1000;
          return task(
            level,
            `Berechne ${comma(startKg, 3)} kg ${plus ? "+" : "−"} ${g2} g. Gib das Ergebnis mit Komma in Kilogramm an.`,
            "",
            [num("Ergebnis:", value, "kg", 3)],
            "Rechne zuerst auf dieselbe Einheit um: 1 kg = 1.000 g.",
            `${g2} g = ${comma(g2 / 1000, 3)} kg. ${comma(startKg, 3)} kg ${plus ? "+" : "−"} ${comma(g2 / 1000, 3)} kg.`,
            `Das Ergebnis ist ${comma(value, 3)} kg.`,
            { kg, g1, g2 },
          );
        }
        if (level === 1) {
          const m = rng.int(1, 9), cm1 = rng.int(1, 19) * 5, cm2 = rng.int(1, 19) * 5;
          const total = (m * 100 + cm1 + cm2) / 100;
          const start = (m * 100 + cm1) / 100;
          return task(
            level,
            `Berechne ${comma(start, 2)} m + ${cm2} cm. Gib das Ergebnis mit Komma in Meter an.`,
            "",
            [num("Summe:", total, "m", 2, { slips: [{ value: start + cm2, hint: "Rechne vorher auf dieselbe Einheit um." }] })],
            `${cm2} cm = ${comma(cm2 / 100, 2)} m.`,
            `${comma(start, 2)} m + ${comma(cm2 / 100, 2)} m.`,
            `Das Ergebnis ist ${comma(total, 2)} m.`,
            { m, cm1, cm2 },
          );
        }
        const paid = rng.pick([10, 20, 50]);
        const cents = rng.int(3, 18) * 25 + rng.int(4, 40) * 5;
        const change = paid * 100 - cents;
        return task(
          level,
          "",
          `Ein Einkauf kostet ${comma(cents / 100, 2)} €. Du zahlst mit einem ${paid}-€-Schein. Wie viel Rückgeld bekommst du?`,
          [num("Rückgeld:", change / 100, "€", 2)],
          "Subtrahiere stellengerecht mit dem Komma untereinander.",
          `${comma(paid, 2)} € − ${comma(cents / 100, 2)} €.`,
          `Du bekommst ${comma(change / 100, 2)} € zurück.`,
          { paid, cents },
        );
      },
    },
    {
      id: "groesse-teilen",
      make: (rng, level) => {
        const parts = rng.int(2, 9);
        if (level === 1) {
          const each = rng.int(2, 9) * 100 + rng.pick([0, 50]);
          const total = each * parts;
          return task(
            level,
            `Dividiere die Größe: ${n0(total)} g : ${parts}.`,
            "",
            [num("Ergebnis:", each, "g", 0)],
            "Größe durch Zahl: Nur die Maßzahl wird geteilt, die Einheit bleibt.",
            `${n0(total)} : ${parts} = ${each}, die Einheit bleibt g.`,
            `Das Ergebnis ist ${each} g.`,
            { total, parts },
          );
        }
        const each = rng.int(2, 9);
        const metres = each * parts;
        return task(
          level,
          "",
          `Eine Leine von ${metres} m Länge wird in ${parts} gleich lange Stücke geschnitten. Wie lang ist ein Stück?`,
          [num("Ein Stück:", each, "m", 0)],
          "Größe durch Zahl: Das Ergebnis hat wieder eine Einheit.",
          `${metres} m : ${parts} = ${each} m.`,
          `Ein Stück ist ${each} m lang.`,
          { metres, parts },
        );
      },
    },
    {
      id: "vervielfachen-teilen",
      make: (rng, level) => {
        if (level === 1) {
          const kg = rng.int(1, 9), g = rng.int(1, 9) * 100, k = rng.int(2, 9);
          const total = (kg * 1000 + g) * k;
          return task(
            level,
            `Berechne ${k} · ${kg} kg ${g} g. Gib das Ergebnis in Gramm an.`,
            "",
            [num("Masse:", total, "g", 0)],
            "Rechne zuerst in Gramm um, dann vervielfache die Maßzahl.",
            `${kg} kg ${g} g = ${n0(kg * 1000 + g)} g. ${k} · ${n0(kg * 1000 + g)} g.`,
            `Das Ergebnis ist ${n0(total)} g.`,
            { kg, g, k },
          );
        }
        const piece = rng.pick([20, 25, 40, 50, 75, 80]);
        const count = rng.int(6, 40);
        const lengthCm = piece * count;
        const canMeters = lengthCm % 100 === 0;
        const shown = canMeters ? `${n0(lengthCm / 100)} m` : `${n0(lengthCm)} cm`;
        return task(
          level,
          "",
          `Eine Rolle Band ist ${shown} lang. Du schneidest Stücke von je ${piece} cm ab. Wie viele Stücke entstehen?`,
          [num("Stücke:", count, "", 0)],
          "Größe durch Größe: Rechne beide in dieselbe Einheit um. Das Ergebnis hat keine Einheit.",
          `${n0(lengthCm)} cm : ${piece} cm = ${count}.`,
          `Es entstehen ${count} Stücke.`,
          { piece, count },
        );
      },
    },
  ],
});

const schaetzen = L1(5, {
  id: "gr-5-schaetzen",
  title: "4.5 Größen schätzen",
  subtitle: "Bezugsgrößen helfen beim Kontrollieren",
  whyItMatters:
    "Ein 80 m hohes Klassenzimmer? Mit Bezugsgrößen fällt ein unmögliches Ergebnis sofort auf.",
  explanationHtml: `<p>Beim <strong>Schätzen</strong> vergleichst du mit einer <strong>Bezugsgröße</strong>, die du kennst: Ein Kind ist etwa 1,50 m groß, eine Tür etwa 2 m hoch, ein Stockwerk etwa 3 m hoch, ein Schritt etwa 60 cm lang, eine Tafel Schokolade wiegt 100 g, ein Liter Wasser 1 kg, ein Auto etwa 1,5 t.</p><p>Bei Sachaufgaben nutzt du das zur <strong>Kontrolle</strong>: Passt das Ergebnis zur Wirklichkeit? Bist du dir nicht sicher, recherchierst du gezielt, zum Beispiel im Internet, in einem Lexikon oder bei einer offiziellen Stelle. Schreibe immer auf, wie du vorgegangen bist.</p><div class="example">Ein Haus hat 9 Stockwerke. Schätzung der Höhe: 9 · 3 m = 27 m. Eine Angabe von 270 m kann nicht stimmen.</div><div class="merke"><strong>Merke:</strong> Eine gute Schätzung nennt die Bezugsgröße und die Rechnung. Eine Größe muss zur Wirklichkeit passen.</div>`,
  formulas: [
    { name: "Bezugsgrößen", html: "Tür etwa 2 m, Stockwerk etwa 3 m, Schritt etwa 60 cm", quantities: "Vergleichswerte zum Schätzen" },
  ],
  quiz: {
    question: "Wie hoch ist ein Klassenzimmer ungefähr?",
    options: ["3 m", "30 m", "30 cm"],
    correctIndex: 0,
    explanation: "Eine Tür ist etwa 2 m hoch, das Klassenzimmer etwas höher.",
  },
  lab: lab(
    "measure-sense",
    "Größen einschätzen",
    "Wähle einen Gegenstand, eine Maßzahl und eine Einheit. Der grüne Bereich zeigt, was passt.",
    [c("object", "Gegenstand", MEASURE_OBJECTS.map((m) => m.name)), r("value", "Maßzahl", 1, 1000, 5), c("unit", "Einheit", MEASURE_UNITS, 2)],
    [
      o("groesse", "Deine Angabe", (v) => `${n0(v.value)} ${MEASURE_UNITS[v.unit]}`),
      o("urteil", "Urteil", (v) => {
        const m = toMetres(v.value, v.unit);
        const t = MEASURE_OBJECTS[v.object];
        return m >= t.low && m <= t.high ? "passt" : m > t.high ? "viel zu groß" : "viel zu klein";
      }),
    ],
    [
      { id: "bleistift", text: "Gib eine passende Länge für den Bleistift an.", check: (v) => v.object === 0 && toMetres(v.value, v.unit) >= 0.1 && toMetres(v.value, v.unit) <= 0.25 },
      { id: "tuer", text: "Gib eine passende Höhe für die Tür an.", check: (v) => v.object === 1 && toMetres(v.value, v.unit) >= 1.8 && toMetres(v.value, v.unit) <= 2.5 },
      { id: "weg", text: "Gib die passende Länge für den Weg von München nach Nürnberg an.", check: (v) => v.object === 2 && toMetres(v.value, v.unit) >= 150000 && toMetres(v.value, v.unit) <= 200000 },
    ],
  ),
  exercises: [
    {
      id: "was-passt",
      make: (rng, level) => {
        const items = [
          ["Wie hoch ist eine Zimmertür?", ["2 m", "20 m", "20 cm"], "Die Tür ist etwas höher als ein Erwachsener."],
          ["Wie schwer ist eine Tafel Schokolade?", ["100 g", "10 kg", "1 g"], "Sie steht auf der Packung und liegt leicht in der Hand."],
          ["Wie schwer ist ein Auto?", ["1,5 t", "150 kg", "15 t"], "Ein Auto wiegt deutlich mehr als zehn Erwachsene zusammen."],
          ["Wie lang ist ein Schulbus?", ["12 m", "120 cm", "120 m"], "Ein Bus ist etwa so lang wie drei Autos hintereinander."],
          ["Wie lange dauert ein Schultag ungefähr?", ["6 h", "60 h", "6 min"], "Ein ganzer Tag hat nur 24 Stunden."],
          ["Wie breit ist ein Fingernagel?", ["1 cm", "1 dm", "1 m"], "Ein Lineal zeigt: etwa ein Zentimeter."],
        ] as const;
        const [question, options, why] = rng.pick(items);
        if (level === 1)
          return task(
            level,
            `${question} Wähle die passende Angabe.`,
            "",
            [pick("Passend ist …", [...options], 0)],
            "Vergleiche mit einer Bezugsgröße, die du kennst.",
            why,
            `Passend ist ${options[0]}.`,
            { index: items.findIndex((i) => i[0] === question) },
          );
        const floors = rng.int(4, 28);
        return task(
          level,
          "",
          `Ein Hochhaus hat ${floors} Stockwerke. Schätze seine Höhe mit einer Bezugsgröße von 3 m pro Stockwerk.`,
          [num("Höhe:", floors * 3, "m", 0)],
          "Stockwerke mal Bezugsgröße.",
          `${floors} · 3 m = ${floors * 3} m.`,
          `Das Haus ist etwa ${floors * 3} m hoch.`,
          { floors },
        );
      },
    },
    {
      id: "kontrolle",
      make: (rng, level) => {
        if (level === 1) {
          const steps = rng.int(2, 30) * 5;
          return task(
            level,
            `Dein Schritt ist etwa 60 cm lang. Der Weg zum Bäcker hat ${steps} Schritte. Wie viele Meter sind das ungefähr?`,
            "",
            [num("Weg:", (steps * 60) / 100, "m", 0, { slips: [{ value: steps * 60, hint: "Das sind Zentimeter. Gefragt sind Meter." }] })],
            "Schritte mal 60 cm, dann in Meter umrechnen.",
            `${steps} · 60 cm = ${n0(steps * 60)} cm.`,
            `Es sind etwa ${(steps * 60) / 100} m.`,
            { steps },
          );
        }
        const floors = rng.int(3, 8);
        const honest = rng.int(0, 1) === 0;
        const claim = honest ? floors * 3 : floors * 30;
        return task(
          level,
          "",
          `Lena liest: „Unsere Schule ist ein Gebäude mit ${floors} Stockwerken und ${claim} m Höhe.“ Kann diese Angabe stimmen?`,
          [pick("Die Angabe …", ["kann stimmen", "kann nicht stimmen"], honest ? 0 : 1)],
          "Ein Stockwerk ist etwa 3 m hoch.",
          `Schätzung: ${floors} · 3 m = ${floors * 3} m.`,
          honest ? "Die Angabe kann stimmen." : "Die Angabe kann nicht stimmen: Sie ist 10-mal zu groß.",
          { floors, claim },
        );
      },
    },
  ],
});

const dreisatz = L1(6, {
  id: "gr-6-dreisatz",
  title: "4.6 Schlussrechnung und Dreisatz",
  subtitle: "Über die Einheit zum Ziel",
  whyItMatters:
    "Wenn 6 Hefte 18 € kosten, was kosten dann 8? Über den Preis für eines kommst du immer ans Ziel.",
  explanationHtml: `<p>Bei der <strong>Schlussrechnung</strong> schließt du von einer gegebenen Menge auf eine andere. Wenn doppelt so viel auch doppelt so viel kostet, kannst du sie anwenden. Strukturiert schreibst du sie als <strong>Dreisatz</strong> in drei Zeilen:</p><p>1. Zeile: Das ist gegeben. 2. Zeile: Das gilt für 1 Stück (dividieren). 3. Zeile: Das gilt für die gesuchte Menge (multiplizieren).</p><div class="example">6 Hefte kosten 18 €. 1 Heft kostet 18 € : 6 = 3 €. 8 Hefte kosten 3 € · 8 = 24 €.</div><div class="merke"><strong>Merke:</strong> Gegeben, für eines, für die gesuchte Menge: Erst teilen, dann vervielfachen. Prüfe, ob doppelt so viel wirklich doppelt so viel bedeutet.</div>`,
  formulas: [
    { name: "Dreisatz", html: "gegeben → 1 Stück → gesucht", quantities: "Erst dividieren, dann multiplizieren" },
  ],
  quiz: {
    question: "5 Eintrittskarten kosten 35 €. Was kosten 3 Karten?",
    options: ["21 €", "7 €", "33 €"],
    correctIndex: 0,
    explanation: "1 Karte kostet 7 €, 3 Karten kosten 21 €.",
  },
  lab: lab(
    "dreisatz",
    "Drei Zeilen",
    "Stelle gegebene Anzahl, Preis pro Stück und gesuchte Anzahl ein. Die App zeigt den Dreisatz.",
    [r("n", "Gegebene Anzahl", 1, 12, 2), r("p", "Preis pro Stück", 1, 20, 2, 1, "€"), r("t", "Gesuchte Anzahl", 1, 20, 3)],
    [
      o("gegeben", "Gegeben", (v) => `${v.n} kosten ${v.n * v.p} €`),
      o("eines", "1 Stück", (v) => `${v.p} €`),
      o("gesucht", "Gesucht", (v) => `${v.t} kosten ${v.t * v.p} €`),
    ],
    [
      { id: "beispiel", text: "Stelle ein: 6 Hefte kosten 18 €, gesucht sind 8.", check: (v) => v.n === 6 && v.p === 3 && v.t === 8 },
      { id: "gleich", text: "Stelle dieselbe Anzahl für gegeben und gesucht ein, bei 12 Stück.", check: (v) => v.n === 12 && v.t === 12 },
      { id: "hundert", text: "Finde eine Einstellung, bei der die gesuchte Anzahl genau 100 € kostet und die Anzahl 20 ist.", check: (v) => v.t === 20 && v.p === 5 },
    ],
  ),
  exercises: [
    {
      id: "preis",
      make: (rng, level) => {
        const unit = rng.int(2, 18), n = rng.int(3, 12);
        let t = rng.int(2, 15);
        if (t === n) t = n + 1;
        const total = unit * n;
        const [thing, plural] = rng.pick([["Heft", "Hefte"], ["Karte", "Karten"], ["Buch", "Bücher"], ["Ball", "Bälle"]] as const);
        if (level === 1)
          return task(
            level,
            `${n} ${plural} kosten ${total} €. Was kosten ${t} ${plural}? Nutze den Dreisatz.`,
            "",
            [num("Preis:", unit * t, "€", 0)],
            "Erst den Preis für 1 Stück, dann für die gesuchte Anzahl.",
            `${thing === "Karte" ? "1 Karte kostet" : thing === "Heft" ? "1 Heft kostet" : thing === "Buch" ? "1 Buch kostet" : "1 Ball kostet"} ${total} € : ${n} = ${unit} €. ${t} kosten ${unit} € · ${t}.`,
            `${t} ${plural} kosten ${unit * t} €.`,
            { n, t, total },
          );
        const perTen = rng.pick([2, 3, 4, 5]), km = perTen * rng.int(2, 6), minutes = km * (10 / perTen);
        const askMinutes = rng.int(3, 9) * 10;
        return task(
          level,
          "",
          `Mia fährt mit dem Rad gleichmäßig schnell: ${km} km in ${minutes} Minuten. Wie weit kommt sie in ${askMinutes} Minuten?`,
          [num("Weg:", (askMinutes / 10) * perTen, "km", 0)],
          "Berechne zuerst den Weg für 10 Minuten.",
          `In 10 min schafft sie ${km} km : ${minutes / 10} = ${perTen} km. In ${askMinutes} min sind es ${askMinutes / 10} · ${perTen} km.`,
          `Sie kommt ${(askMinutes / 10) * perTen} km weit.`,
          { km, minutes, askMinutes },
        );
      },
    },
    {
      id: "passt-dreisatz",
      make: (rng, level) => {
        if (level === 1) {
          const g = rng.pick([50, 100, 200, 250]), each = rng.pick([2, 3, 4, 5]), kids = rng.int(3, 8), target = rng.int(9, 28);
          return task(
            level,
            `Für ${kids} Portionen Müsli brauchst du ${n0(kids * g)} g Haferflocken. Wie viel Gramm brauchst du für ${target} Portionen?`,
            "",
            [num("Haferflocken:", g * target, "g", 0)],
            "Erst die Menge für 1 Portion, dann für die gesuchte Anzahl.",
            `1 Portion: ${n0(kids * g)} g : ${kids} = ${g} g. ${target} Portionen: ${target} · ${g} g = ${n0(g * target)} g.`,
            `Du brauchst ${n0(g * target)} g.`,
            { g, each, kids, target },
          );
        }
        const proportional = rng.int(0, 1) === 0;
        const cases = proportional
          ? ["1 kg Äpfel kostet 3 €. Passt der Dreisatz für 4 kg?", "Eine Maschine füllt in 1 Stunde 200 Flaschen. Passt der Dreisatz für 3 Stunden?"]
          : ["Ein Kind braucht für 100 m genau 15 Sekunden. Passt der Dreisatz sicher für 10 km?", "Ein Sänger singt ein Lied in 3 Minuten. Passt der Dreisatz für 4 Sänger, die es gemeinsam singen?"];
        const text = rng.pick(cases);
        return task(
          level,
          "",
          `${text} Überlege, ob doppelt so viel wirklich doppelt so viel bedeutet.`,
          [pick("Der Dreisatz passt:", ["ja", "nein"], proportional ? 0 : 1)],
          "Prüfe: Verdoppelt sich die zweite Größe, wenn sich die erste verdoppelt?",
          proportional ? "Der Preis oder die Menge wächst gleichmäßig mit." : "Hier wächst die zweite Größe nicht gleichmäßig mit.",
          proportional ? "Ja, der Dreisatz passt." : "Nein, der Dreisatz passt hier nicht.",
          { proportional: proportional ? 1 : 0 },
        );
      },
    },
  ],
});

const massstab = L1(7, {
  id: "gr-7-massstab",
  title: "4.7 Der Maßstab",
  subtitle: "Karte, Plan und Wirklichkeit",
  whyItMatters:
    "Auf der Wanderkarte sind es nur 6 cm, in Wirklichkeit 1,5 km. Der Maßstab rechnet beides ineinander um.",
  explanationHtml: `<p>Der <strong>Maßstab</strong> sagt, wievielmal größer die Wirklichkeit als das Bild ist. <strong>1 : 25.000</strong> bedeutet: 1 cm auf der Karte sind 25.000 cm in Wirklichkeit, also 250 m. Beim <strong>Modell</strong> kann es auch umgekehrt sein: 5 : 1 heißt, das Bild ist 5-mal so groß.</p><p>Von der Karte in die Wirklichkeit <strong>multiplizierst</strong> du, zurück <strong>dividierst</strong> du. Wähle danach eine passende Einheit: Kilometer für Wege, Meter für Häuser.</p><div class="example">Karte 1 : 50.000. Der Weg misst dort 6 cm: 6 · 50.000 cm = 300.000 cm = 3 km. Ein See mit 4 km Länge: 400.000 cm : 50.000 = 8 cm auf der Karte.</div><div class="merke"><strong>Merke:</strong> Bildlänge mal Maßstabszahl ergibt die wirkliche Länge. Rechne in die passende Einheit um.</div>`,
  formulas: [
    { name: "Wirklichkeit", html: "Bildlänge · Maßstabszahl", quantities: "Maßstab 1 : Maßstabszahl" },
    { name: "Bild", html: "Wirkliche Länge : Maßstabszahl", quantities: "In gleicher Einheit rechnen" },
  ],
  quiz: {
    question: "Maßstab 1 : 100. Im Plan misst ein Zimmer 5 cm. Wie lang ist es wirklich?",
    options: ["5 m", "50 cm", "500 m"],
    correctIndex: 0,
    explanation: "5 cm · 100 = 500 cm = 5 m.",
  },
  lab: lab(
    "scale",
    "Bild und Wirklichkeit",
    "Wähle den Maßstab und ziehe die Länge im Bild.",
    [c("scale", "Maßstab", SCALES.map((s) => s.label)), r("b", "Länge im Bild", 1, 20, 3, 1, "cm")],
    [o("wirklich", "Wirkliche Länge", (v) => `${Number.isInteger(v.b * SCALES[v.scale].factor) ? n0(v.b * SCALES[v.scale].factor) : fmt(v.b * SCALES[v.scale].factor, 1)} cm`)],
    [
      { id: "zimmer", text: "Stelle mit 1 : 100 ein Zimmer von 5 m Länge ein.", check: (v) => v.scale === 1 && v.b === 5 },
      { id: "karte", text: "Stelle auf der Karte 1 : 25.000 einen Weg von 1 km ein.", check: (v) => v.scale === 2 && v.b === 4 },
      { id: "modell", text: "Stelle mit 5 : 1 ein Bild von 10 cm für einen wirklichen Käfer von 2 cm ein.", check: (v) => v.scale === 3 && v.b === 10 },
    ],
  ),
  exercises: [
    {
      id: "karte-wirklichkeit",
      make: (rng, level) => {
        const scale = rng.pick([10000, 20000, 25000, 50000, 100000]);
        const cm = rng.pick([2, 4, 6, 8, 10, 12, 16, 20]);
        const m = (cm * scale) / 100;
        if (level === 1)
          return task(
            level,
            `Auf einer Karte im Maßstab 1 : ${n0(scale)} ist ein Weg ${cm} cm lang. Wie viele Meter ist er in Wirklichkeit lang?`,
            "",
            [num("Weg:", m, "m", 0, { slips: [{ value: cm * scale, hint: "Das sind noch Zentimeter. Rechne in Meter um." }] })],
            "Bildlänge mal Maßstabszahl, dann in Meter umrechnen.",
            `${cm} cm · ${n0(scale)} = ${n0(cm * scale)} cm = ${n0(m)} m.`,
            `Der Weg ist ${n0(m)} m lang.`,
            { scale, cm },
          );
        const km = rng.int(1, 10);
        const onMap = rng.pick([25000, 50000, 100000]);
        const mapCm = (km * 100000) / onMap;
        return task(
          level,
          "",
          `Eine Radstrecke ist ${km} km lang. Wie lang ist sie auf einer Karte im Maßstab 1 : ${n0(onMap)}?`,
          [num("Länge:", mapCm, "cm", 0)],
          "Rechne die wirkliche Länge in Zentimeter um und dividiere.",
          `${km} km = ${n0(km * 100000)} cm. ${n0(km * 100000)} cm : ${n0(onMap)} = ${mapCm} cm.`,
          `Auf der Karte ist sie ${mapCm} cm lang.`,
          { km, onMap },
        );
      },
    },
    {
      id: "massstab-bestimmen",
      make: (rng, level) => {
        if (level === 1) {
          const [factor, inPlan] = rng.pick([[10, 12], [10, 18], [20, 6], [20, 8], [20, 10], [25, 4], [25, 6], [25, 8], [25, 10], [50, 2], [50, 4]]);
          const height = factor * inPlan;
          return task(
            level,
            `Ein Regal ist ${height} cm hoch. Im Plan misst es ${inPlan} cm. Welche Maßstabszahl hat der Plan?`,
            "",
            [num("1 :", factor, "", 0)],
            "Wirkliche Länge durch Bildlänge, in gleicher Einheit.",
            `${height} cm : ${inPlan} cm = ${factor}.`,
            `Der Maßstab ist 1 : ${factor}.`,
            { height, inPlan },
          );
        }
        const metres = rng.int(2, 12) * 5;
        const plan = rng.pick([5, 10, 20]);
        const factor = (metres * 100) / plan;
        return task(
          level,
          "",
          `Der Schulhof ist ${metres} m lang. Auf dem Plan ist er ${plan} cm lang. Welche Maßstabszahl hat der Plan?`,
          [num("1 :", factor, "", 0, { slips: [{ value: metres / plan, hint: "Rechne zuerst beide Längen in dieselbe Einheit um." }] })],
          "Rechne die wirkliche Länge in Zentimeter um.",
          `${metres} m = ${n0(metres * 100)} cm. ${n0(metres * 100)} cm : ${plan} cm = ${n0(factor)}.`,
          `Der Maßstab ist 1 : ${n0(factor)}.`,
          { metres, plan },
        );
      },
    },
  ],
});

const rechteckFlaeche = L2(8, {
  id: "fl-1-rechteck",
  title: "4.8 Der Flächeninhalt eines Rechtecks",
  subtitle: "Mit Einheitsquadraten messen",
  whyItMatters:
    "Wie groß ist die Fläche des Klassenzimmers? Du zählst nicht jedes Kästchen, sondern nutzt eine Formel, die du dir selbst erklären kannst.",
  explanationHtml: `<p>Den <strong>Flächeninhalt</strong> misst du mit <strong>Einheitsquadraten</strong>: Du zählst, wie viele davon in die Fläche passen. Bei einem Rechteck musst du nicht einzeln zählen. In eine Reihe passen a Quadrate, und es gibt b Reihen. Das sind a · b Quadrate.</p><p>Das ist die Formel <strong>A = a · b</strong>. Beim Quadrat sind beide Seiten gleich: <strong>A = a²</strong>. Seiten in cm ergeben cm², Seiten in m ergeben m².</p><div class="example">Rechteck 5 cm lang und 3 cm breit: 3 Reihen zu je 5 Quadraten mit 1 cm Seitenlänge, also A = 5 cm · 3 cm = 15 cm².</div><div class="merke"><strong>Merke:</strong> A = a · b. Beide Seiten brauchen dieselbe Einheit. Das Ergebnis trägt die quadratische Einheit.</div>`,
  formulas: [
    { name: "Rechteck", html: "A = a · b", quantities: "a Länge, b Breite" },
    { name: "Quadrat", html: "A = a²", quantities: "a Seitenlänge" },
  ],
  quiz: {
    question: "Warum darf man beim Rechteck a · b rechnen?",
    options: [
      "Weil b Reihen mit je a Einheitsquadraten entstehen.",
      "Weil Fläche und Umfang dasselbe sind.",
      "Weil es nur für Quadrate gilt.",
    ],
    correctIndex: 0,
    explanation: "Das Auslegen mit Einheitsquadraten begründet die Formel.",
  },
  lab: lab(
    "area-rect",
    "Quadrate zählen",
    "Ziehe die Ecken. Du siehst, wie viele Einheitsquadrate in das Rechteck passen.",
    [r("a", "Seite a", 1, 12, 5, 1, "cm"), r("b", "Seite b", 1, 12, 2, 1, "cm")],
    [o("flaeche", "Flächeninhalt", (v) => v.a * v.b, "cm²", 0), o("reihen", "Reihen", (v) => v.b, "", 0)],
    [
      { id: "achtundvierzig", text: "Forme ein Rechteck mit 48 cm² und einer Seite von 6 cm.", check: (v) => (v.a === 6 && v.b === 8) || (v.a === 8 && v.b === 6) },
      { id: "quadrat", text: "Forme ein Quadrat mit 49 cm².", check: (v) => v.a === 7 && v.b === 7 },
      { id: "schmal", text: "Forme einen Streifen mit 12 cm² und nur einer Reihe.", check: (v) => v.a === 12 && v.b === 1 },
    ],
  ),
  exercises: [
    {
      id: "flaeche-berechnen",
      make: (rng, level) => {
        const a = rng.int(4, 25), b = rng.int(3, a);
        if (level === 1)
          return task(
            level,
            `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Wie groß ist sein Flächeninhalt?`,
            "",
            [num("A =", a * b, "cm²", 0, { slips: [{ value: 2 * (a + b), hint: "Das ist der Umfang. Für den Flächeninhalt multiplizierst du." }] })],
            "A = a · b",
            `${a} cm · ${b} cm.`,
            `A = ${a * b} cm²`,
            { a, b },
          );
        const roomA = rng.int(6, 12), roomB = rng.int(4, 6);
        return task(
          level,
          "",
          `Ein Klassenzimmer ist ${roomA} m lang und ${roomB} m breit. Wie viele Quadratmeter Teppich werden gebraucht?`,
          [num("Teppich:", roomA * roomB, "m²", 0)],
          "Der Teppich bedeckt die ganze Fläche.",
          `${roomA} m · ${roomB} m = ${roomA * roomB} m².`,
          `Es werden ${roomA * roomB} m² gebraucht.`,
          { roomA, roomB },
        );
      },
    },
    {
      id: "fliesen",
      make: (rng, level) => {
        const a = rng.int(3, 12), b = rng.int(4, 15);
        if (level === 1)
          return task(
            level,
            `Ein Rechteck hat den Flächeninhalt ${a * b} cm² und die Länge ${a} cm. Wie breit ist es?`,
            "",
            [num("b =", b, "cm", 0)],
            "A = a · b. Bilde die Umkehraufgabe.",
            `${a * b} : ${a} = ${b}.`,
            `Es ist ${b} cm breit.`,
            { a, b },
          );
        const tile = rng.pick([20, 25, 50]);
        const countA = rng.int(8, 20), countB = rng.int(6, 12);
        const lenM = (tile * countA) / 100;
        const widM = (tile * countB) / 100;
        return task(
          level,
          "",
          `Eine Wand ist ${lengthText(lenM)} m lang und ${lengthText(widM)} m hoch. Sie wird mit quadratischen Fliesen von ${tile} cm Seitenlänge belegt. Wie viele Fliesen werden gebraucht?`,
          [num("Fliesen:", countA * countB, "", 0)],
          "Bestimme, wie viele Fliesen in eine Reihe passen und wie viele Reihen es gibt.",
          `${n0(tile * countA)} cm : ${tile} cm = ${countA} und ${n0(tile * countB)} cm : ${tile} cm = ${countB}.`,
          `Es werden ${countA * countB} Fliesen gebraucht.`,
          { tile, countA, countB },
        );
      },
    },
  ],
});

const flaecheneinheiten = L2(9, {
  id: "fl-2-einheiten",
  title: "4.9 Flächeneinheiten umrechnen",
  subtitle: "Von mm² bis km², mit Komma",
  whyItMatters:
    "Ein Handybildschirm misst cm², ein Bauernhof ha, Bayern km². Weil jede Stufe das Hundertfache ist, kannst du leicht umrechnen.",
  explanationHtml: `<p>Die <strong>Flächeneinheiten</strong> bauen auf Quadraten auf: 1 cm² ist ein Quadrat mit 1 cm Seitenlänge. Weil in ein Quadrat mit 1 dm Seitenlänge 10 · 10 = 100 Quadrate von 1 cm passen, gilt 1 dm² = 100 cm². Die <strong>Umrechnungszahl ist immer 100</strong>:</p><p>mm² → cm² → dm² → m² → a → ha → km². Dabei ist 1 a (Ar) ein Quadrat mit 10 m Seitenlänge, 1 ha (Hektar) eines mit 100 m Seitenlänge.</p><p>In der <strong>Einheitentafel</strong> belegt jede Einheit zwei Stellen. So verstehst du auch die Kommaschreibweise: 3,25 m² = 325 dm², und 2,5 ha = 250 a.</p><div class="example">1 km² = 100 ha = 10.000 a. 75 dm² = 0,75 m². 4 m² 8 dm² = 408 dm² = 4,08 m².</div><div class="merke"><strong>Merke:</strong> Flächeneinheiten unterscheiden sich um den Faktor 100, und jede Einheit belegt zwei Stellen.</div>`,
  formulas: [
    { name: "Stufen", html: "mm² → cm² → dm² → m² → a → ha → km²", quantities: "Immer der Faktor 100" },
    { name: "Ar und Hektar", html: "1 a = 100 m², 1 ha = 100 a", quantities: "1 a: Quadrat mit 10 m Seite, 1 ha: Quadrat mit 100 m Seite" },
  ],
  quiz: {
    question: "Warum ist 1 m² = 100 dm² und nicht 10 dm²?",
    options: [
      "Weil in ein Quadrat von 1 m Seitenlänge 10 · 10 Quadrate von 1 dm passen.",
      "Weil Flächen immer mit 1.000 umgerechnet werden.",
      "Weil 1 m = 100 dm ist.",
    ],
    correctIndex: 0,
    explanation: "In einer Reihe liegen 10, und es gibt 10 Reihen.",
  },
  lab: lab(
    "area-ladder",
    "Einheitenleiter für Flächen",
    "Stelle Maßzahl und Einheiten ein. Bei jedem Schritt ändert sich die Maßzahl um den Faktor 100.",
    [r("amount", "Maßzahl", 1, 5000, 1), r("from", "Von Einheit Nummer", 0, 6, 3), r("to", "Nach Einheit Nummer", 0, 6, 2)],
    [
      o("ergebnis", "Umgerechnet", (v) => `${fmt(convert(AREA, v.amount, v.from, v.to), 12)} ${AREA.units[v.to]}`),
      o("stufen", "Stufen", (v) => Math.abs(v.from - v.to)),
    ],
    [
      { id: "ar", text: "Rechne 3 a in m² um.", check: (v) => v.amount === 3 && v.from === 4 && v.to === 3 },
      { id: "hektar", text: "Rechne 200 a in ha um.", check: (v) => v.amount === 200 && v.from === 4 && v.to === 5 },
      { id: "quadratkilometer", text: "Rechne 5 km² in ha um.", check: (v) => v.amount === 5 && v.from === 6 && v.to === 5 },
    ],
  ),
  exercises: [
    {
      id: "flaeche-umrechnen",
      make: (rng, level) => {
        if (level === 1) {
          const from = rng.int(1, 6), k = rng.int(2, 95);
          return task(
            level,
            `Rechne die Fläche ${k} ${AREA.units[from]} in ${AREA.units[from - 1]} um.`,
            "",
            [num(`${AREA.units[from - 1]}:`, k * 100, AREA.units[from - 1], 0, { slips: [{ value: k * 10, hint: "Bei Flächen ist der Faktor 100, nicht 10." }] })],
            "Eine Stufe tiefer: mal 100.",
            `${k} · 100 = ${n0(k * 100)}.`,
            `${k} ${AREA.units[from]} = ${n0(k * 100)} ${AREA.units[from - 1]}`,
            { from, k },
          );
        }
        const from = rng.int(4, 5), whole = rng.int(1, 9), hundredth = rng.pick([5, 10, 25, 40, 50, 60, 75]);
        const value = (whole * 100 + hundredth) / 100;
        return task(
          level,
          "",
          `Ein Grundstück hat ${comma(value, 2)} ${AREA.units[from]}. Wie viele ${AREA.units[from - 1]} sind das?`,
          [num(`${AREA.units[from - 1]}:`, whole * 100 + hundredth, AREA.units[from - 1], 0)],
          "Jede Einheit belegt zwei Stellen in der Einheitentafel.",
          `${comma(value, 2)} · 100 = ${whole * 100 + hundredth}.`,
          `Es sind ${whole * 100 + hundredth} ${AREA.units[from - 1]}.`,
          { from, whole, hundredth },
        );
      },
    },
    {
      id: "flaeche-mit-komma",
      make: (rng, level) => {
        if (level === 1) {
          const m2 = rng.int(1, 30), dm2 = rng.int(1, 99);
          return task(
            level,
            `Schreibe die Fläche ${m2} m² ${dm2} dm² in dm².`,
            "",
            [num("dm²:", m2 * 100 + dm2, "dm²", 0)],
            "1 m² = 100 dm²",
            `${m2} · 100 dm² + ${dm2} dm².`,
            `${n0(m2 * 100 + dm2)} dm²`,
            { m2, dm2 },
          );
        }
        const cm2 = rng.int(1001, 9899);
        return task(
          level,
          "",
          `Ein Plakat hat einen Flächeninhalt von ${n0(cm2)} cm². Wie viele dm² sind das in Kommaschreibweise?`,
          [num("dm²:", cm2 / 100, "dm²", 2, { slips: [{ value: cm2 / 10, hint: "Bei Flächen rückt das Komma um zwei Stellen, nicht um eine." }] })],
          "Eine Stufe höher: Das Komma rückt zwei Stellen nach links.",
          `${n0(cm2)} : 100.`,
          `Es sind ${comma(cm2 / 100, 2)} dm².`,
          { cm2 },
        );
      },
    },
  ],
});

const umfangFlaeche = L2(10, {
  id: "fl-3-umfang-flaeche",
  title: "4.10 Umfang und Flächeninhalt",
  subtitle: "Zwei verschiedene Fragen",
  whyItMatters:
    "Für den Zaun brauchst du den Umfang, für den Rasen den Flächeninhalt. Wer beides verwechselt, kauft das Falsche.",
  explanationHtml: `<p>Der <strong>Umfang</strong> U ist die Länge des Randes. Der <strong>Flächeninhalt</strong> A sagt, wie viel Fläche im Inneren liegt. Am Rechteck gilt U = 2 · a + 2 · b und A = a · b, am Quadrat U = 4 · a und A = a².</p><p>Bei einer Sachaufgabe fertigst du zuerst eine <strong>Skizze</strong> an und überlegst, was gefragt ist: Rand oder Innenfläche? Zwei Rechtecke mit gleichem Umfang können verschiedene Flächeninhalte haben.</p><div class="example">Beet 6 m lang, 4 m breit. Zaun: U = 2 · 6 m + 2 · 4 m = 20 m. Rasen: A = 6 m · 4 m = 24 m². Ein Beet mit 5 m und 5 m hat auch U = 20 m, aber A = 25 m².</div><div class="merke"><strong>Merke:</strong> Rand: Umfang in m. Innenfläche: Flächeninhalt in m². Zeichne eine Skizze.</div>`,
  formulas: [
    { name: "Rechteck", html: "U = 2 · a + 2 · b; A = a · b", quantities: "a Länge, b Breite" },
    { name: "Quadrat", html: "U = 4 · a; A = a²", quantities: "a Seitenlänge" },
  ],
  quiz: {
    question: "Du willst einen Garten einzäunen. Was brauchst du?",
    options: ["Den Umfang", "Den Flächeninhalt", "Die Summe aus beiden"],
    correctIndex: 0,
    explanation: "Der Zaun läuft um den Rand herum.",
  },
  lab: lab(
    "perimeter",
    "Rechteck ziehen",
    "Ziehe die Seiten des Rechtecks und beobachte Umfang und Flächeninhalt.",
    [r("a", "Seite a", 1, 12, 6, 1, "cm"), r("b", "Seite b", 1, 12, 3, 1, "cm")],
    [o("umfang", "Umfang", (v) => 2 * (v.a + v.b), "cm", 0), o("flaeche", "Flächeninhalt", (v) => v.a * v.b, "cm²", 0)],
    [
      { id: "gleich-u", text: "Forme ein Quadrat mit dem Umfang 24 cm.", check: (v) => v.a === 6 && v.b === 6 },
      { id: "gleich-a", text: "Finde ein Rechteck mit 24 cm² und dem Umfang 28 cm.", check: (v) => (v.a === 12 && v.b === 2) || (v.a === 2 && v.b === 12) },
      { id: "kleinste", text: "Forme bei einem Umfang von 26 cm das Rechteck mit dem kleinsten Flächeninhalt.", check: (v) => (v.a === 12 && v.b === 1) || (v.a === 1 && v.b === 12) },
    ],
  ),
  exercises: [
    {
      id: "u-und-a",
      make: (rng, level) => {
        const a = rng.int(4, 25), b = rng.int(3, 18);
        if (level === 1)
          return task(
            level,
            `Ein Rechteck hat die Seiten ${a} cm und ${b} cm. Berechne Umfang und Flächeninhalt.`,
            "",
            [num("U =", 2 * (a + b), "cm", 0), num("A =", a * b, "cm²", 0)],
            "U = 2 · a + 2 · b und A = a · b.",
            `U = 2 · ${a} cm + 2 · ${b} cm. A = ${a} cm · ${b} cm.`,
            `U = ${2 * (a + b)} cm, A = ${a * b} cm²`,
            { a, b },
          );
        const scenes = [
          [`Ein Sportplatz ist ${Math.max(a, b) * 5} m lang und ${Math.min(a, b) * 5} m breit. Um ihn herum wird ein Zaun gebaut. Wie viele Meter Zaun braucht man?`, 2 * (a + b) * 5, "m", "Zaun: Es geht um den Rand."],
          [`Ein Sportplatz ist ${Math.max(a, b) * 5} m lang und ${Math.min(a, b) * 5} m breit. Er wird neu eingesät. Wie viele Quadratmeter Rasen sind das?`, a * b * 25, "m²", "Rasen: Es geht um die Innenfläche."],
        ] as const;
        const [text, answer, unit, why] = rng.pick(scenes);
        return task(
          level,
          "",
          text,
          [num("Ergebnis:", answer, unit, 0)],
          "Überlege: Rand oder Innenfläche?",
          why,
          `Es sind ${n0(answer)} ${unit}.`,
          { a, b },
        );
      },
    },
    {
      id: "gleicher-umfang",
      make: (rng, level) => {
        const side = rng.int(3, 25);
        if (level === 1)
          return task(
            level,
            `Ein Quadrat hat den Umfang ${4 * side} cm. Wie lang ist eine Seite, und wie groß ist sein Flächeninhalt?`,
            "",
            [num("a =", side, "cm", 0), num("A =", side * side, "cm²", 0)],
            "U = 4 · a. Daraus folgt die Seite, dann A = a².",
            `${4 * side} : 4 = ${side}. ${side} cm · ${side} cm.`,
            `a = ${side} cm, A = ${side * side} cm²`,
            { side },
          );
        const half = rng.int(10, 24);
        const narrow = rng.int(2, Math.floor(half / 2) - 1);
        const wide = narrow + rng.int(1, Math.floor(half / 2) - narrow);
        const [first, second] = rng.int(0, 1) === 0 ? [narrow, wide] : [wide, narrow];
        const firstArea = first * (half - first), secondArea = second * (half - second);
        return task(
          level,
          "",
          `Zwei Rechtecke haben beide den Umfang ${2 * half} m. Rechteck 1 ist ${first} m breit, Rechteck 2 ist ${second} m breit. Welches hat den größeren Flächeninhalt?`,
          [pick("Größer ist …", ["Rechteck 1", "Rechteck 2"], firstArea > secondArea ? 0 : 1)],
          "Berechne zuerst die zweite Seite jedes Rechtecks mit dem halben Umfang.",
          `Rechteck 1: ${first} m · ${half - first} m = ${firstArea} m². Rechteck 2: ${second} m · ${half - second} m = ${secondArea} m².`,
          firstArea > secondArea ? "Rechteck 1 ist größer." : "Rechteck 2 ist größer.",
          { half, first, second },
        );
      },
    },
  ],
});

const LAKES: Array<[string, number, number]> = [
  ["Der Bodensee ist etwa 60 km lang und im Mittel etwa 9 km breit", 60, 9],
  ["Der Chiemsee ist etwa 15 km lang und im Mittel etwa 5 km breit", 15, 5],
  ["Der Starnberger See ist etwa 20 km lang und im Mittel etwa 3 km breit", 20, 3],
  ["Bayern lässt sich grob durch ein Rechteck von 350 km Länge und 200 km Breite beschreiben", 350, 200],
  ["Deutschland lässt sich grob durch ein Rechteck von 800 km Länge und 450 km Breite beschreiben", 800, 450],
];
const naeherung = L2(11, {
  id: "fl-4-naeherung",
  title: "4.11 Näherungswerte mit Rechtecken",
  subtitle: "Unregelmäßige Flächen abschätzen",
  whyItMatters:
    "Wie groß ist der Bodensee? Formeln gibt es für solche Flächen nicht. Mit einem passenden Rechteck kommst du trotzdem zu einem guten Näherungswert.",
  explanationHtml: `<p>Für unregelmäßige Flächen bestimmst du einen <strong>Näherungswert</strong>: Du ersetzt die Fläche durch ein Rechteck, das sie möglichst gut beschreibt, also so viel überdeckt, wie es außen abschneidet. Das nennt man eine <strong>Modellierung</strong>.</p><p>Dann rechnest du mit der Formel A = a · b. Liegt das Rechteck ganz innerhalb der Fläche, ist die Näherung zu klein. Liegt die Fläche ganz im Rechteck, ist sie zu groß.</p><div class="example">Der Bodensee: etwa 60 km lang, im Mittel etwa 9 km breit. Näherung: A ≈ 60 km · 9 km = 540 km². Eine Recherche nennt rund 536 km².</div><div class="merke"><strong>Merke:</strong> Modelliere mit einem passenden Rechteck und schreibe „≈“. Der Näherungswert ist keine exakte Angabe.</div>`,
  formulas: [
    { name: "Näherung", html: "A ≈ a · b", quantities: "a und b gut gewählte Maße des Rechtecks" },
  ],
  quiz: {
    question: "Eine Figur liegt ganz in einem Rechteck mit 12 cm². Was gilt für ihren Flächeninhalt?",
    options: ["Er ist kleiner als 12 cm².", "Er ist größer als 12 cm².", "Er ist genau 12 cm²."],
    correctIndex: 0,
    explanation: "Das Rechteck enthält die Figur und noch mehr.",
  },
  lab: lab(
    "approx-rect",
    "Rechteck über dem See",
    "Passe die Breite und Höhe des Rechtecks so an, dass es den See möglichst gut beschreibt.",
    [r("w", "Breite", 2, 10, 3, 1, "km"), r("h", "Höhe", 2, 6, 2, 1, "km")],
    [
      o("flaeche", "Rechteck", (v) => v.w * v.h, "km²", 0),
      o("vergleich", "Vergleich mit dem See", (v) => (v.w * v.h > LAKE_AREA + 2 ? "zu groß" : v.w * v.h < LAKE_AREA - 2 ? "zu klein" : "passt gut")),
    ],
    [
      { id: "passt", text: "Finde ein Rechteck, das den See gut beschreibt (innerhalb von 2 km²).", check: (v) => Math.abs(v.w * v.h - LAKE_AREA) <= 2 },
      { id: "zu-gross", text: "Lege ein Rechteck, das den See ganz umschließt: 8 km mal 4 km.", check: (v) => v.w === 8 && v.h === 4 },
      { id: "zu-klein", text: "Stelle ein kleines Rechteck von 4 km mal 2 km ein: Es liegt innerhalb des Sees.", check: (v) => v.w === 4 && v.h === 2 },
    ],
  ),
  exercises: [
    {
      id: "see-modellieren",
      make: (rng, level) => {
        const [sentence, a, b] = rng.pick(LAKES);
        if (level === 1) {
          const w = rng.int(3, 12) * 10, h = rng.int(2, 6) * 10;
          return task(
            level,
            `Eine Lichtung im Wald sieht auf dem Luftbild ungefähr aus wie ein Rechteck von ${w} m Länge und ${h} m Breite. Bestimme einen Näherungswert für ihren Flächeninhalt.`,
            "",
            [num("A ≈", w * h, "m²", 0)],
            "Modelliere mit dem Rechteck: A ≈ a · b.",
            `${w} m · ${h} m = ${n0(w * h)} m².`,
            `A ≈ ${n0(w * h)} m²`,
            { w, h },
          );
        }
        return task(
          level,
          "",
          `${sentence}. Bestimme mit einem Rechteck einen Näherungswert für den Flächeninhalt.`,
          [num("A ≈", a * b, "km²", 0)],
          "A ≈ a · b",
          `${n0(a)} km · ${n0(b)} km = ${n0(a * b)} km².`,
          `A ≈ ${n0(a * b)} km²`,
          { a, b },
        );
      },
    },
    {
      id: "zu-gross-zu-klein",
      make: (rng, level) => {
        const a = rng.int(5, 20), b = rng.int(3, 15);
        const inside = rng.int(0, 1) === 0;
        if (level === 1)
          return task(
            level,
            inside
              ? `Ein Rechteck mit ${a} cm und ${b} cm liegt ganz innerhalb einer Figur. Ist der Flächeninhalt der Figur größer oder kleiner als ${a * b} cm²?`
              : `Eine Figur liegt ganz innerhalb eines Rechtecks mit ${a} cm und ${b} cm. Ist der Flächeninhalt der Figur größer oder kleiner als ${a * b} cm²?`,
            "",
            [pick("Der Flächeninhalt der Figur ist …", ["größer", "kleiner"], inside ? 0 : 1)],
            "Was ist das Innere, was das Äußere?",
            inside ? "Die Figur enthält das Rechteck und noch mehr." : "Das Rechteck enthält die Figur und noch mehr.",
            inside ? "Der Flächeninhalt der Figur ist größer." : "Der Flächeninhalt der Figur ist kleiner.",
            { a, b, inside: inside ? 1 : 0 },
          );
        const lower = a * b;
        const upper = (a + 2) * (b + 2);
        return task(
          level,
          "",
          `Ein Teich liegt ganz in einem Rechteck von ${a + 2} m und ${b + 2} m und enthält ganz ein Rechteck von ${a} m und ${b} m. Um wie viel Quadratmeter unterscheiden sich die beiden Rechtecke?`,
          [num("Unterschied:", upper - lower, "m²", 0)],
          "Berechne beide Flächeninhalte und subtrahiere.",
          `${upper} m² − ${lower} m² = ${upper - lower} m².`,
          `Der Unterschied beträgt ${upper - lower} m².`,
          { a, b },
        );
      },
    },
  ],
});

const zerlegen = L2(12, {
  id: "fl-5-zerlegen",
  title: "4.12 Zerlegen und Ergänzen",
  subtitle: "Verschiedene Wege, ein Ergebnis",
  whyItMatters:
    "Ein L-förmiger Garten ist kein Rechteck. Aber du kannst ihn in Rechtecke zerlegen oder zu einem Rechteck ergänzen.",
  explanationHtml: `<p>Eine zusammengesetzte Figur berechnest du durch <strong>Zerlegen</strong>: Du teilst sie in Rechtecke und addierst deren Flächeninhalte. Oder durch <strong>Ergänzen</strong>: Du ergänzt sie zu einem großen Rechteck und ziehst das fehlende Stück ab.</p><p>Beide Wege führen zum selben Ergebnis, aber oft ist einer kürzer. Vergleiche die Lösungswege und beurteile, welcher einfacher ist.</p><div class="example">L-Form: 10 m mal 8 m, in einer Ecke fehlen 4 m mal 3 m. Ergänzen: 10 · 8 − 4 · 3 = 68 m². Zerlegen: 10 · 5 + 6 · 3 = 68 m². Hier ist das Ergänzen kürzer.</div><div class="merke"><strong>Merke:</strong> Zerlegen: addieren. Ergänzen: subtrahieren. Wähle den Weg mit weniger Rechenschritten und prüfe mit dem anderen.</div>`,
  formulas: [
    { name: "Zerlegen", html: "A = A₁ + A₂", quantities: "Die Teile addieren" },
    { name: "Ergänzen", html: "A = A<sub>groß</sub> − A<sub>fehlt</sub>", quantities: "Das Fehlende abziehen" },
  ],
  quiz: {
    question: "Ein Rechteck 8 m mal 6 m hat ein quadratisches Loch mit 2 m Seitenlänge. Welcher Term passt?",
    options: ["8 · 6 − 2 · 2", "8 · 6 + 2 · 2", "(8 − 2) · (6 − 2)"],
    correctIndex: 0,
    explanation: "Vom großen Rechteck ziehst du das Loch ab.",
  },
  lab: lab(
    "composite",
    "Zerlegen oder ergänzen",
    "Wechsle die Methode und verändere die Figur. Das Ergebnis bleibt bei beiden Wegen gleich.",
    [c("method", "Methode", ["Zerlegen", "Ergänzen"]), r("w", "Breite", 5, 12, 6, 1, "m"), r("h", "Höhe", 4, 10, 5, 1, "m"), r("cw", "Ecke breit", 1, 4, 2, 1, "m"), r("ch", "Ecke hoch", 1, 3, 1, 1, "m")],
    [o("a", "Flächeninhalt", (v) => notchArea(v.w, v.h, v.cw, v.ch), "m²", 0), o("rechnung", "Ergänzen", (v) => `${v.w} · ${v.h} − ${v.cw} · ${v.ch}`)],
    [
      { id: "beispiel", text: "Stelle das Beispiel ein: 10 m mal 8 m, Ecke 4 m mal 3 m.", check: (v) => v.w === 10 && v.h === 8 && v.cw === 4 && v.ch === 3 },
      { id: "achtundvierzig", text: "Erreiche 48 m² mit der Methode Ergänzen.", check: (v) => v.method === 1 && notchArea(v.w, v.h, v.cw, v.ch) === 48 },
      { id: "zerlegt", text: "Erreiche mit der Methode Zerlegen genau 100 m².", check: (v) => v.method === 0 && notchArea(v.w, v.h, v.cw, v.ch) === 100 },
    ],
  ),
  exercises: [
    {
      id: "l-form",
      make: (rng, level) => {
        const w = rng.int(7, 20), h = rng.int(5, 15), cw = rng.int(2, Math.min(w - 3, 6)), ch = rng.int(2, Math.min(h - 3, 5));
        const area = notchArea(w, h, cw, ch);
        if (level === 1)
          return task(
            level,
            `Ein Rechteck hat die Seiten ${w} m und ${h} m. In einer Ecke fehlt ein Rechteck mit ${cw} m und ${ch} m. Wie groß ist der Flächeninhalt der Figur?`,
            "",
            [num("A =", area, "m²", 0, { slips: [{ value: w * h, hint: "Das ist das ganze Rechteck. Ziehe das fehlende Stück ab." }] })],
            "Ergänzen: großes Rechteck minus fehlendes Stück.",
            `${w} · ${h} − ${cw} · ${ch} = ${w * h} − ${cw * ch}.`,
            `A = ${area} m²`,
            { w, h, cw, ch },
          );
        const price = rng.int(3, 9);
        return task(
          level,
          "",
          `Ein L-förmiger Garten: Außenmaße ${w} m und ${h} m, in einer Ecke steht ein Schuppen mit ${cw} m und ${ch} m. Der Rest bekommt Rasen für ${price} € pro Quadratmeter. Wie viel kostet der Rasen?`,
          [num("Kosten:", area * price, "€", 0)],
          "Erst die Rasenfläche bestimmen, dann mit dem Preis multiplizieren.",
          `${w * h} m² − ${cw * ch} m² = ${area} m². ${area} · ${price} €.`,
          `Der Rasen kostet ${n0(area * price)} €.`,
          { w, h, cw, ch, price },
        );
      },
    },
    {
      id: "zerlegen-teile",
      make: (rng, level) => {
        const a = rng.int(3, 12), b = rng.int(2, 8), d = rng.int(2, 9), e = rng.int(2, 8);
        if (level === 1)
          return task(
            level,
            `Eine Figur setzt sich aus zwei Rechtecken zusammen: ${a} cm mal ${b} cm und ${d} cm mal ${e} cm. Wie groß ist ihr Flächeninhalt?`,
            "",
            [num("A =", a * b + d * e, "cm²", 0)],
            "Zerlegen: die Flächeninhalte addieren.",
            `${a} · ${b} + ${d} · ${e} = ${a * b} + ${d * e}.`,
            `A = ${a * b + d * e} cm²`,
            { a, b, d, e },
          );
        const w = rng.int(6, 12), h = rng.int(4, 9), cw = rng.int(1, 2), ch = rng.int(1, 2);
        const ergaenzenBetter = rng.int(0, 1) === 0;
        const text = ergaenzenBetter
          ? `Ein Rechteck ${w} m mal ${h} m hat eine kleine Ecke ${cw} m mal ${ch} m verloren`
          : `Zwei gleich große Rechtecke ${w} m mal ${h} m liegen so aneinander, dass kein Spalt und keine Überlappung entsteht`;
        return task(
          level,
          "",
          `${text}. Welcher Weg ist hier kürzer?`,
          [pick("Kürzer ist …", ["Ergänzen", "Zerlegen"], ergaenzenBetter ? 0 : 1)],
          "Zähle die Rechenschritte für beide Wege.",
          ergaenzenBetter
            ? `Ergänzen: ${w} · ${h} − ${cw} · ${ch} nutzt die gegebenen Maße. Beim Zerlegen müsstest du zuerst Restlängen wie ${w - cw} m berechnen.`
            : `Die Figur besteht schon aus zwei Rechtecken: 2 · ${w} · ${h}. Beim Ergänzen müsstest du erst ein größeres Rechteck suchen.`,
          ergaenzenBetter ? "Ergänzen ist kürzer." : "Zerlegen ist kürzer.",
          { w, h, cw, ch },
        );
      },
    },
  ],
});

const oberflaeche = L2(13, {
  id: "fl-6-oberflaeche",
  title: "4.13 Netz und Oberflächeninhalt",
  subtitle: "Quader und Würfel aufklappen",
  whyItMatters:
    "Wie viel Papier braucht man für eine Geschenkschachtel? Klappst du die Schachtel auf, siehst du es direkt.",
  explanationHtml: `<p>Ein <strong>Quader</strong> hat 6 Rechtecke als Flächen, je zwei gegenüberliegende sind gleich groß. Schneidest du ihn an einigen Kanten auf und klappst ihn in die Ebene, entsteht ein <strong>Netz</strong>. Der <strong>Oberflächeninhalt</strong> ist die Summe aller Flächen.</p><p>Beim Quader mit den Kanten a, b, c gilt O = 2 · (a · b + b · c + a · c). Beim Würfel mit Kante a gilt O = 6 · a². Fehlt eine Fläche, etwa bei einer Schachtel ohne Deckel, ziehst du sie ab.</p><div class="example">Quader 5 cm, 3 cm, 2 cm: O = 2 · (15 + 6 + 10) = 62 cm². Ohne Deckel (5 cm mal 3 cm): 62 cm² − 15 cm² = 47 cm².</div><div class="merke"><strong>Merke:</strong> O = 2 · (a · b + b · c + a · c). Prüfe im Netz, welche Flächen wirklich vorkommen.</div>`,
  formulas: [
    { name: "Oberflächeninhalt Quader", html: "O = 2 · (a · b + b · c + a · c)", quantities: "a, b, c Kantenlängen" },
    { name: "Oberflächeninhalt Würfel", html: "O = 6 · a²", quantities: "a Kantenlänge" },
  ],
  quiz: {
    question: "Wie groß ist der Oberflächeninhalt eines Würfels mit 3 cm Kantenlänge?",
    options: ["54 cm²", "27 cm²", "18 cm²"],
    correctIndex: 0,
    explanation: "6 · 3 cm · 3 cm = 54 cm².",
  },
  lab: lab(
    "box-net",
    "Quadernetz zeichnen",
    "Stelle die Kanten ein. Das Netz zeigt alle sechs Flächen.",
    [r("a", "Länge a", 1, 5, 3, 1, "cm"), r("b", "Höhe b", 1, 5, 2, 1, "cm"), r("c", "Tiefe c", 1, 5, 1, 1, "cm")],
    [o("o", "Oberflächeninhalt", (v) => boxSurface(v.a, v.b, v.c), "cm²", 0), o("groesste", "Größte Fläche", (v) => Math.max(v.a * v.b, v.b * v.c, v.a * v.c), "cm²", 0)],
    [
      { id: "wuerfel", text: "Stelle einen Würfel mit 4 cm Kantenlänge ein.", check: (v) => v.a === 4 && v.b === 4 && v.c === 4 },
      { id: "zweiundsechzig", text: "Stelle den Quader 5 cm, 3 cm und 2 cm ein.", check: (v) => v.a === 5 && v.b === 3 && v.c === 2 },
      { id: "groesste", text: "Finde den größten möglichen Oberflächeninhalt.", check: (v) => v.a === 5 && v.b === 5 && v.c === 5 },
    ],
  ),
  exercises: [
    {
      id: "oberflaeche-berechnen",
      make: (rng, level) => {
        if (level === 1) {
          const cube = rng.int(0, 1) === 0;
          const a = rng.int(2, 15), b = rng.int(2, 12), c1 = rng.int(2, 10);
          const value = cube ? 6 * a * a : boxSurface(a, b, c1);
          return task(
            level,
            cube ? `Ein Würfel hat die Kantenlänge ${a} cm. Berechne den Oberflächeninhalt.` : `Ein Quader hat die Kanten ${a} cm, ${b} cm und ${c1} cm. Berechne den Oberflächeninhalt.`,
            "",
            [num("O =", value, "cm²", 0)],
            cube ? "O = 6 · a²" : "O = 2 · (a · b + b · c + a · c)",
            cube ? `6 · ${a} · ${a}.` : `2 · (${a * b} + ${b * c1} + ${a * c1}).`,
            `O = ${n0(value)} cm²`,
            { a, b, c1 },
          );
        }
        const a = rng.int(10, 30), b = rng.int(8, 25), c1 = rng.int(5, 20);
        const open = boxSurface(a, b, c1) - a * b;
        return task(
          level,
          "",
          `Eine Schachtel ohne Deckel ist ${a} cm lang, ${b} cm breit und ${c1} cm hoch. Wie viele Quadratzentimeter Pappe braucht man ohne Klebekanten?`,
          [num("Pappe:", open, "cm²", 0, { slips: [{ value: boxSurface(a, b, c1), hint: "Der Deckel fehlt. Ziehe seine Fläche ab." }] })],
          "Oberflächeninhalt des Quaders minus Deckel.",
          `${n0(boxSurface(a, b, c1))} cm² − ${a * b} cm².`,
          `Man braucht ${n0(open)} cm² Pappe.`,
          { a, b, c1 },
        );
      },
    },
    {
      id: "waende-streichen",
      make: (rng, level) => {
        const a = rng.int(4, 12), b = rng.int(3, Math.min(a, 9)), h = 3;
        if (level === 1) {
          const edge = rng.int(2, 9);
          return task(
            level,
            `Das Netz eines Würfels besteht aus 6 gleich großen Quadraten mit ${edge} cm Seitenlänge. Wie groß ist die Fläche eines dieser Quadrate?`,
            "",
            [num("A =", edge * edge, "cm²", 0)],
            "A = a²",
            `${edge} cm · ${edge} cm.`,
            `A = ${edge * edge} cm²`,
            { edge },
          );
        }
        const door = 2;
        const walls = 2 * (a + b) * h - door;
        return task(
          level,
          "",
          `Ein Zimmer ist ${a} m lang, ${b} m breit und ${h} m hoch. Die vier Wände werden gestrichen, die Tür mit ${door} m² nicht. Wie viel Quadratmeter Wand sind das?`,
          [num("Wand:", walls, "m²", 0)],
          "Vier Wände, nicht die ganze Oberfläche: Boden und Decke fehlen.",
          `2 · (${a} + ${b}) · ${h} − ${door} = ${walls}.`,
          `Es sind ${walls} m².`,
          { a, b, h },
        );
      },
    },
  ],
});

const zusammengesetzt = L2(14, {
  id: "fl-7-zusammengesetzt",
  title: "4.14 Schrägbild und zusammengesetzte Körper",
  subtitle: "Einen Körper räumlich zeichnen und seine Oberfläche finden",
  whyItMatters:
    "Ein Schrägbild zeigt den Körper räumlich. Sitzt ein Würfel auf einem Quader, musst du überlegen, welche Flächen verschwinden und welche dazukommen.",
  explanationHtml: `<p>Im <strong>Schrägbild</strong> zeichnest du die Vorderfläche in Originalgröße. Die nach hinten laufenden Kanten verlaufen schräg und werden verkürzt dargestellt, auf Karopapier oft auf der Kästchendiagonale. Verdeckte Kanten zeichnest du <strong>gestrichelt</strong>.</p><p>Sitzt ein kleinerer Körper auf einem größeren, fällt beim oberen seine Grundfläche weg, und beim unteren wird dieselbe Fläche verdeckt. Es verschwinden also zwei gleich große Flächen.</p><div class="example">Würfel mit 2 cm Kante auf einem Quader 6 cm, 4 cm, 3 cm. Quader: 108 cm². Würfel: 24 cm². Abzug: 2 · 4 cm². Zusammen: 108 + 24 − 8 = 124 cm². Das ist dasselbe wie 108 + 4 · 4.</div><div class="merke"><strong>Merke:</strong> Beim Zusammenfügen verschwinden die beiden Berührflächen. Beim aufgesetzten Würfel bleiben von ihm nur 4 Seitenflächen übrig, seine Deckfläche ersetzt das Verdeckte.</div>`,
  formulas: [
    { name: "Würfel auf Quader", html: "O = O<sub>Quader</sub> + 4 · k²", quantities: "k Kantenlänge des Würfels" },
    { name: "Berührflächen", html: "Zweimal abziehen", quantities: "Je einmal bei beiden Körpern" },
  ],
  quiz: {
    question: "Zwei gleiche Würfel mit 2 cm Kante werden zusammengeklebt. Wie groß ist die Oberfläche?",
    options: ["40 cm²", "48 cm²", "24 cm²"],
    correctIndex: 0,
    explanation: "2 · 24 cm² − 2 · 4 cm² = 40 cm². Die zwei Klebeflächen sind verschwunden.",
  },
  lab: lab(
    "box-stack",
    "Würfel auf Quader",
    "Stelle Quader und Würfel ein. Das Schrägbild zeigt den Körper, die Rechnung den Oberflächeninhalt.",
    [r("a", "Länge a", 2, 8, 6, 1, "cm"), r("b", "Höhe b", 1, 5, 3, 1, "cm"), r("c", "Tiefe c", 2, 6, 3, 1, "cm"), r("k", "Würfelkante", 1, 4, 2, 1, "cm")],
    [
      o("o", "Oberflächeninhalt", (v) => stackSurface(v.a, v.b, v.c, Math.min(v.k, v.a, v.c)), "cm²", 0),
      o("quader", "Quader allein", (v) => boxSurface(v.a, v.b, v.c), "cm²", 0),
    ],
    [
      { id: "beispiel", text: "Stelle das Beispiel ein: Quader 6 cm, 3 cm und 4 cm, Würfel mit 2 cm Kante.", check: (v) => v.a === 6 && v.b === 3 && v.c === 4 && v.k === 2 },
      { id: "kleiner", text: "Finde bei einem Quader 5 cm, 4 cm und 3 cm mit einem Würfel von 1 cm den Oberflächeninhalt.", check: (v) => v.a === 5 && v.b === 4 && v.c === 3 && v.k === 1 },
      { id: "breit", text: "Setze den größten möglichen Würfel auf einen Quader mit 8 cm Länge und 6 cm Tiefe.", check: (v) => v.a === 8 && v.c === 6 && v.k === 4 },
    ],
  ),
  exercises: [
    {
      id: "wuerfel-aufgesetzt",
      make: (rng, level) => {
        const a = rng.int(4, 12), b = rng.int(2, 8), c1 = rng.int(3, 10), k = rng.int(1, 3);
        const value = stackSurface(a, b, c1, k);
        if (level === 1)
          return task(
            level,
            `Auf einen Quader mit den Kanten ${a} cm, ${b} cm und ${c1} cm wird ein Würfel mit ${k} cm Kante gesetzt. Wie groß ist der Oberflächeninhalt des Körpers?`,
            "",
            [num("O =", value, "cm²", 0)],
            "Quader plus vier Seitenflächen des Würfels.",
            `${boxSurface(a, b, c1)} cm² + 4 · ${k * k} cm².`,
            `O = ${value} cm²`,
            { a, b, c1, k },
          );
        const n = rng.int(2, 5), edge = rng.int(2, 6);
        const towers = (4 * n + 2) * edge * edge;
        return task(
          level,
          "",
          `${n} Würfel mit ${edge} cm Kantenlänge werden zu einem Turm übereinandergestapelt. Wie groß ist die Oberfläche des Turms?`,
          [num("O =", towers, "cm²", 0, { slips: [{ value: 6 * n * edge * edge, hint: "Die Flächen zwischen den Würfeln gehören nicht mehr zur Oberfläche." }] })],
          "Der Turm hat vier hohe Seitenflächen, einen Boden und einen Deckel.",
          `4 · ${n} · ${edge * edge} + 2 · ${edge * edge} = ${towers}.`,
          `O = ${towers} cm²`,
          { n, edge },
        );
      },
    },
    {
      id: "schraegbild-fragen",
      make: (rng, level) => {
        const q = rng.pick([
          ["Wie viele Ecken hat ein Quader?", 8, "Vier Ecken vorne und vier hinten."],
          ["Wie viele Kanten hat ein Quader?", 12, "Vier Kanten vorne, vier hinten und vier dazwischen."],
          ["Wie viele Flächen hat ein Quader?", 6, "Vorne, hinten, oben, unten, links und rechts."],
          ["Wie viele Kanten sind im Schrägbild eines Quaders normalerweise gestrichelt?", 3, "Drei Kanten treffen sich in der verdeckten Ecke hinten unten."],
          ["Wie viele Flächen eines Quaders sind im Schrägbild verdeckt?", 3, "Hinten, unten und eine Seite sind nicht zu sehen."],
        ] as const);
        if (level === 1)
          return task(
            level,
            `${q[0]} Stelle dir das Schrägbild vor.`,
            "",
            [num("Anzahl:", q[1], "", 0)],
            "Stelle dir den Quader von vorn rechts oben vor.",
            q[2],
            `Es sind ${q[1]}.`,
            { answer: q[1] },
          );
        const a = rng.int(3, 12), b = rng.int(2, 10);
        return task(
          level,
          "",
          `Im Schrägbild eines Quaders zeichnest du die Vorderfläche in Originalgröße: ${a} cm breit und ${b} cm hoch. Welchen Flächeninhalt hat die Vorderfläche in deiner Zeichnung?`,
          [num("A =", a * b, "cm²", 0)],
          "Die Vorderfläche bleibt unverzerrt.",
          `${a} cm · ${b} cm.`,
          `A = ${a * b} cm²`,
          { a, b },
        );
      },
    },
  ],
});

const VALID_NETS = NET_PATTERNS.filter((pattern) => foldNet(pattern.cells));
const netHtml = (pattern: NetPattern): string => {
  const width = Math.max(...pattern.cells.map(([x]) => x)) + 1;
  const height = Math.max(...pattern.cells.map(([, y]) => y)) + 1;
  const rows: string[] = [];
  for (let y = 0; y < height; y++) {
    const row: string[] = [];
    for (let x = 0; x < width; x++) {
      const index = pattern.cells.findIndex(([cx, cy]) => cx === x && cy === y);
      row.push(index >= 0 ? String(index + 1) : "·");
    }
    rows.push(row.join(" "));
  }
  return `<code style="display:block;white-space:pre;line-height:1.5">${rows.join("\n")}</code>`;
};
const kopfgeometrie = L2(15, {
  id: "fl-8-kopfgeometrie",
  title: "4.15 Im Kopf falten und rechnen",
  subtitle: "Räumliche Vorstellung trainieren",
  whyItMatters:
    "Welche Fläche liegt gegenüber? Ohne Stift und Schere: So trainierst du deine Vorstellung für Körper und Flächen.",
  explanationHtml: `<p>Bei <strong>Kopfgeometrie</strong> löst du eine Aufgabe nur in Gedanken. Falte das Netz im Kopf: Quadrate, die in einer geraden Reihe mit genau einem Quadrat dazwischen liegen, werden beim Würfel <strong>Gegenflächen</strong>.</p><p>Nicht jedes Muster aus 6 Quadraten ergibt einen Würfel. Eine lange Reihe aus 5 oder 6 Quadraten klappt sich selbst zu oder überlappt sich.</p><p>Auch bei ebenen Fragen kannst du dir die Rechnung sparen, wenn du dir Teile vorstellst: Ein 8 cm breiter Streifen mit 5 cm Höhe enthält 40 cm².</p><div class="example">Im Kreuz-Netz liegen die Felder 1 und 6 sowie 2 und 4 einander gegenüber, die Felder 3 und 5 ebenfalls.</div><div class="merke"><strong>Merke:</strong> Zwei Felder in einer Reihe mit genau einem Feld dazwischen sind Gegenflächen. Stelle dir jeden Schritt in Ruhe vor.</div>`,
  formulas: [
    { name: "Gegenflächen", html: "Reihe mit genau einem Feld dazwischen", quantities: "Beim Falten eines Würfels" },
  ],
  quiz: {
    question: "Welche Muster lassen sich nicht zu einem Würfel falten?",
    options: ["Sechs Quadrate in einer langen Reihe", "Das Kreuz", "Die Treppe"],
    correctIndex: 0,
    explanation: "Bei einer langen Reihe überlappen sich die Flächen.",
  },
  lab: lab(
    "cube-net",
    "Netz im Kopf falten",
    "Wähle ein Muster und eine Fläche. Die App zeigt die Gegenfläche, wenn das Muster passt.",
    [c("pattern", "Muster", NET_PATTERNS.map((p) => p.name)), r("face", "Fläche", 1, 6, 3)],
    [
      o("gegen", "Gegenfläche", (v) => oppositeFace(NET_PATTERNS[v.pattern], v.face) ?? "kein Würfel"),
      o("passt", "Würfel möglich", (v) => (foldNet(NET_PATTERNS[v.pattern].cells) ? "ja" : "nein")),
    ],
    [
      { id: "kreuz", text: "Sieh dir im Kreuz die Gegenfläche von Feld 1 an.", check: (v) => v.pattern === 0 && v.face === 1 },
      { id: "treppe", text: "Sieh dir bei der Treppe die Gegenfläche von Feld 2 an.", check: (v) => v.pattern === 1 && v.face === 2 },
      { id: "kein-wuerfel", text: "Wähle den langen Streifen und überzeuge dich, dass kein Würfel entsteht.", check: (v) => v.pattern === 4 },
    ],
  ),
  exercises: [
    {
      id: "gegenflaeche",
      make: (rng, level) => {
        const pattern = rng.pick(VALID_NETS);
        const face = rng.int(1, 6);
        const opposite = oppositeFace(pattern, face)!;
        if (level === 1)
          return task(
            level,
            `Dieses Muster (${pattern.name}) wird zu einem Würfel gefaltet. Punkte stehen für leere Felder: ${netHtml(pattern)} Welches Feld liegt Feld ${face} gegenüber?`,
            "",
            [num("Feld:", opposite, "", 0)],
            "Falte im Kopf: Zwei Felder in einer Reihe mit genau einem Feld dazwischen liegen sich gegenüber.",
            `Beim Falten landet Feld ${opposite} auf der gegenüberliegenden Seite.`,
            `Feld ${opposite} liegt Feld ${face} gegenüber.`,
            { face, opposite },
          );
        const spots = rng.pick([1, 2, 3, 4, 5, 6]);
        return task(
          level,
          "",
          `Bei einem Spielwürfel ergeben gegenüberliegende Augenzahlen zusammen immer 7. Oben liegt die ${spots}. Welche Augenzahl liegt unten?`,
          [num("Augenzahl:", 7 - spots, "", 0)],
          "Gegenüber: zusammen 7.",
          `7 − ${spots} = ${7 - spots}.`,
          `Unten liegt die ${7 - spots}.`,
          { spots },
        );
      },
    },
    {
      id: "im-kopf-rechnen",
      make: (rng, level) => {
        const a = rng.int(4, 12), b = rng.int(3, 9);
        if (level === 1)
          return task(
            level,
            `Rechne im Kopf: Ein Rechteck ${a} cm mal ${b} cm wird in der Mitte zerschnitten. Wie groß ist der Flächeninhalt beider Teile zusammen?`,
            "",
            [num("A =", a * b, "cm²", 0)],
            "Beim Zerschneiden geht keine Fläche verloren.",
            `Beide Teile zusammen sind das ganze Rechteck: ${a} · ${b}.`,
            `A = ${a * b} cm²`,
            { a, b },
          );
        const k = rng.int(2, 6);
        return task(
          level,
          "",
          `Ein Würfel mit ${k} cm Kantenlänge steht auf dem Tisch. Wie groß ist die Fläche, die du von außen sehen und anfassen kannst, ohne ihn hochzuheben?`,
          [num("Fläche:", 5 * k * k, "cm²", 0, { slips: [{ value: 6 * k * k, hint: "Die Unterseite liegt auf dem Tisch." }] })],
          "Eine der sechs Flächen liegt auf dem Tisch.",
          `5 · ${k} cm · ${k} cm.`,
          `Es sind ${5 * k * k} cm².`,
          { k },
        );
      },
    },
  ],
});

export const STAGE_GROESSEN = makeStage(
  4,
  "Einheiten, Kommaschreibweise, Schätzen, Dreisatz, Maßstab, Flächen und Oberflächen",
  "#7c3aed",
  "📏",
  [
    laengeMasse,
    geldZeit,
    kommaschreibweise,
    rechnenMitGroessen,
    schaetzen,
    dreisatz,
    massstab,
    rechteckFlaeche,
    flaecheneinheiten,
    umfangFlaeche,
    naeherung,
    zerlegen,
    oberflaeche,
    zusammengesetzt,
    kopfgeometrie,
  ],
);
