import { fmt, paren } from "../exercises/format";
import { additiveEquation, fromRoman, roman, roundTo, termText, termValue, type TermNode } from "../models";
import { ADD_TERMS, numberName, regroupSteps, REGROUP_TERMS } from "../lab/views-gym";
import { bigNumber } from "../lab/views-natuerlich";
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
const p0 = (value: number) => paren(value, 0);
const L1 = (step: number, content: Parameters<typeof makeLesson>[3]) => makeLesson(1, step, 1, content);
const L2 = (step: number, content: Parameters<typeof makeLesson>[3]) => makeLesson(1, step, 2, content);

const unendlich = L1(1, {
  id: "nz-1-unendlich",
  title: "1.1 Natürliche Zahlen ohne Ende",
  subtitle: "Warum es keine größte natürliche Zahl gibt",
  whyItMatters:
    "Egal wie weit du zählst: Es geht immer weiter. Das kannst du sogar begründen, ohne bis dorthin zu zählen.",
  explanationHtml: `<p>Die <strong>natürlichen Zahlen</strong> sind die Zahlen, mit denen du zählst: ℕ = {1; 2; 3; …}. Die drei Punkte bedeuten: Es geht immer so weiter.</p><p>Zu jeder natürlichen Zahl n gehört der <strong>Nachfolger</strong> n + 1. Er ist um 1 größer und wieder eine natürliche Zahl. Angenommen, jemand nennt die „größte“ natürliche Zahl: Ihr Nachfolger ist noch größer. Also kann es keine größte natürliche Zahl geben.</p><div class="example">Jemand behauptet: „999.999.999 ist die größte Zahl.“ Der Nachfolger 1.000.000.000 widerlegt das. Eine kleinste natürliche Zahl gibt es dagegen: die 1.</div><div class="merke"><strong>Merke:</strong> Jede natürliche Zahl hat einen Nachfolger. Darum besitzt ℕ kein größtes Element.</div>`,
  formulas: [
    { name: "Natürliche Zahlen", html: "ℕ = {1; 2; 3; …}", quantities: "Kein größtes Element" },
    { name: "Nachfolger", html: "n + 1", quantities: "Die nächste natürliche Zahl nach n" },
  ],
  quiz: {
    question: "Warum gibt es keine größte natürliche Zahl?",
    options: [
      "Weil zu jeder natürlichen Zahl n auch n + 1 eine natürliche Zahl ist.",
      "Weil noch niemand so weit gezählt hat.",
      "Weil Zahlen mit mehr als zwölf Stellen keinen Namen haben.",
    ],
    correctIndex: 0,
    explanation: "Die Begründung kommt ohne Zählen aus: Jede genannte Zahl hat einen größeren Nachfolger.",
  },
  lab: lab(
    "successor",
    "Immer noch eine größer",
    "Wähle die erste Ziffer und die Anzahl der Nullen. Zu jeder Zahl siehst du Vorgänger und Nachfolger.",
    [r("digit", "Erste Ziffer", 1, 9, 2), r("exp", "Anzahl der Nullen", 0, 12, 3)],
    [
      o("zahl", "Zahl", (v) => n0(v.digit * 10 ** v.exp)),
      o("vorgaenger", "Vorgänger", (v) => n0(v.digit * 10 ** v.exp - 1)),
      o("nachfolger", "Nachfolger", (v) => n0(v.digit * 10 ** v.exp + 1)),
    ],
    [
      { id: "million", text: "Stelle die Zahl 1 Million ein.", check: (v) => v.digit === 1 && v.exp === 6 },
      { id: "milliarden", text: "Stelle 5 Milliarden ein.", check: (v) => v.digit === 5 && v.exp === 9 },
      { id: "billion", text: "Stelle die größte Zahl ein, die der Regler erlaubt. Auch sie hat einen Nachfolger.", check: (v) => v.digit === 9 && v.exp === 12 },
    ],
  ),
  exercises: [
    {
      id: "nachfolger-vorgaenger",
      make: (rng, level) => {
        const value = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9]) * 10 ** rng.int(6, 9);
        if (level === 1)
          return task(
            level,
            `Gib den Vorgänger und den Nachfolger von ${n0(value)} an.`,
            "",
            [num("Vorgänger:", value - 1, "", 0), num("Nachfolger:", value + 1, "", 0)],
            "Der Vorgänger ist um 1 kleiner, der Nachfolger um 1 größer.",
            `${n0(value)} − 1 = ${n0(value - 1)} und ${n0(value)} + 1 = ${n0(value + 1)}.`,
            `Vorgänger ${n0(value - 1)}, Nachfolger ${n0(value + 1)}`,
            { value },
          );
        const claim = rng.int(100, 999) * 10 ** rng.int(4, 7) - 1;
        return task(
          level,
          "",
          `Mia behauptet: „${n0(claim)} ist die größte natürliche Zahl, die es gibt.“ Mit welcher kleinsten Zahl widerlegst du die Behauptung?`,
          [num("Zahl:", claim + 1, "", 0, { slips: [{ value: claim - 1, hint: "Das ist der Vorgänger. Du brauchst eine größere Zahl." }] })],
          "Jede natürliche Zahl hat einen Nachfolger.",
          `Der Nachfolger von ${n0(claim)} ist ${n0(claim)} + 1 = ${n0(claim + 1)}.`,
          `Die Zahl ${n0(claim + 1)} widerlegt die Behauptung.`,
          { claim },
        );
      },
    },
    {
      id: "stellenzahl",
      make: (rng, level) => {
        const digits = rng.int(4, 9);
        if (level === 1) {
          const largest = rng.int(0, 1) === 0;
          const value = largest ? 10 ** digits - 1 : 10 ** (digits - 1);
          return task(
            level,
            `Wie heißt die ${largest ? "größte" : "kleinste"} natürliche Zahl mit genau ${digits} Stellen?`,
            "",
            [num("Zahl:", value, "", 0)],
            largest ? "Schreibe an jede Stelle die größte Ziffer." : "Vorne steht eine 1, dahinter Nullen.",
            largest ? `An allen ${digits} Stellen steht eine 9.` : `Eine 1 und ${digits - 1} Nullen.`,
            `Die Zahl heißt ${n0(value)}.`,
            { digits },
          );
        }
        const many = rng.int(3, 7);
        const count = 9 * 10 ** (many - 1);
        return task(
          level,
          "",
          `Wie viele natürliche Zahlen haben genau ${many} Stellen?`,
          [num("Anzahl:", count, "", 0, { slips: [{ value: 10 ** many, hint: "Zahlen beginnen nicht mit einer 0. Fange bei der kleinsten Zahl mit dieser Stellenzahl an." }] })],
          "Größte minus kleinste Zahl dieser Länge, dann noch 1 dazu.",
          `Von ${n0(10 ** (many - 1))} bis ${n0(10 ** many - 1)}: ${n0(10 ** many - 1)} − ${n0(10 ** (many - 1))} + 1 = ${n0(count)}.`,
          `Es sind ${n0(count)} Zahlen.`,
          { many },
        );
      },
    },
  ],
});

const FACTS: Array<[string, number]> = [
  ["Die Erde ist im Mittel rund 149 Millionen 600 Tausend km von der Sonne entfernt", 149_600_000],
  ["Auf der Erde leben rund 8 Milliarden Menschen", 8_000_000_000],
  ["In Deutschland leben rund 84 Millionen Menschen", 84_000_000],
  ["In Bayern leben rund 13 Millionen 400 Tausend Menschen", 13_400_000],
  ["Licht legt in einer Sekunde rund 300 Tausend km zurück", 300_000],
  ["Der Mond ist im Mittel rund 384 Tausend km von der Erde entfernt", 384_000],
];

const grosseZahlen = L1(2, {
  id: "nz-2-grosse-zahlen",
  title: "1.2 Große Zahlen benennen",
  subtitle: "Million, Milliarde und Billion",
  whyItMatters:
    "Einwohnerzahlen, Entfernungen im Weltall und Staatshaushalte reichen weit über die Million hinaus. Du musst sie sicher lesen und schreiben können.",
  explanationHtml: `<p>Lies große Zahlen in <strong>Dreiergruppen von rechts</strong>: Einer, Tausender, Millionen, Milliarden, Billionen. Jede neue Gruppe ist 1.000-mal so groß wie die vorige.</p><p>1.000 Tausender sind 1 Million (1.000.000). 1.000 Millionen sind 1 Milliarde (1.000.000.000). 1.000 Milliarden sind 1 Billion (1.000.000.000.000). Fehlt eine Gruppe, schreibst du drei Nullen.</p><div class="example">3.405.020.000 liest du: 3 Milliarden 405 Millionen 20 Tausend. Umgekehrt ist 7 Millionen 60 Tausend die Zahl 7.060.000.</div><div class="merke"><strong>Merke:</strong> Tausend, Million, Milliarde, Billion: Jede Stufe hat drei Nullen mehr.</div>`,
  formulas: [
    { name: "Million", html: "1.000.000", quantities: "6 Nullen, 1.000 Tausender" },
    { name: "Milliarde", html: "1.000.000.000", quantities: "9 Nullen, 1.000 Millionen" },
    { name: "Billion", html: "1.000.000.000.000", quantities: "12 Nullen, 1.000 Milliarden" },
  ],
  quiz: {
    question: "Wie schreibst du 2 Milliarden 30 Millionen in Ziffern?",
    options: ["2.030.000.000", "2.300.000.000", "230.000.000"],
    correctIndex: 0,
    explanation: "Die Millionengruppe besteht aus drei Ziffern: 030. Dahinter folgen zwei Gruppen mit Nullen.",
  },
  lab: lab(
    "number-names",
    "Dreiergruppen",
    "Stelle Milliarden, Millionen und Tausender ein. Beobachte die Zahl und wie du sie liest.",
    [r("mrd", "Milliarden", 0, 999, 0), r("mio", "Millionen", 0, 999, 2), r("tsd", "Tausender", 0, 999, 500)],
    [
      o("zahl", "Zahl", (v) => n0(v.mrd * 1e9 + v.mio * 1e6 + v.tsd * 1e3)),
      o("name", "Gelesen", (v) => numberName(v.mrd, v.mio, v.tsd)),
    ],
    [
      { id: "bayern", text: "Stelle 13 Millionen 400 Tausend ein, etwa die Einwohnerzahl Bayerns.", check: (v) => v.mrd === 0 && v.mio === 13 && v.tsd === 400 },
      { id: "erde", text: "Stelle 8 Milliarden ein, etwa die Zahl der Menschen auf der Erde.", check: (v) => v.mrd === 8 && v.mio === 0 && v.tsd === 0 },
      { id: "nullen", text: "Stelle 2 Milliarden 30 Millionen ein.", check: (v) => v.mrd === 2 && v.mio === 30 && v.tsd === 0 },
    ],
  ),
  exercises: [
    {
      id: "in-ziffern",
      make: (rng, level) => {
        if (level === 1) {
          const mio = rng.int(1, 99), tsd = rng.pick([20, 300, 450, 7, 60]);
          const value = mio * 1e6 + tsd * 1e3;
          return task(
            level,
            `Schreibe in Ziffern: ${numberName(0, mio, tsd)}.`,
            "",
            [num("Zahl:", value, "", 0, { slips: [{ value: mio * 1e3 + tsd, hint: "Eine Million hat 6 Nullen. Prüfe, wie viele Stellen deine Zahl hat." }] })],
            "Schreibe die Gruppen von links nach rechts, jede mit drei Ziffern.",
            `Millionen: ${mio}. Tausender: ${String(tsd).padStart(3, "0")}. Einer: 000.`,
            `Die Zahl heißt ${n0(value)}.`,
            { mio, tsd },
          );
        }
        const [sentence, value] = rng.pick(FACTS);
        return task(
          level,
          "",
          `${sentence}. Schreibe die Zahl in Ziffern.`,
          [num("Zahl:", value, "", 0)],
          "Million: 6 Nullen. Milliarde: 9 Nullen. Tausend: 3 Nullen.",
          `Zerlege den Zahlnamen in Dreiergruppen und fülle fehlende Gruppen mit Nullen.`,
          `Die Zahl heißt ${n0(value)}.`,
          { value },
        );
      },
    },
    {
      id: "stufen-umrechnen",
      make: (rng, level) => {
        if (level === 1) {
          const k = rng.int(2, 40);
          return task(
            level,
            `Wie viele Millionen sind ${k} Milliarden?`,
            "",
            [num("Millionen:", k * 1000, "", 0, { slips: [{ value: k * 10, hint: "1 Milliarde sind 1.000 Millionen, nicht 10." }] })],
            "1 Milliarde = 1.000 Millionen.",
            `${k} · 1.000 = ${n0(k * 1000)}.`,
            `${k} Milliarden sind ${n0(k * 1000)} Millionen.`,
            { k },
          );
        }
        const digits = rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const value = digits.slice(0, 9).reduce((sum, digit) => sum * 10 + digit, 0);
        const places: Array<[string, number]> = [["Millionenstelle", 6], ["Zehnmillionenstelle", 7], ["Hundertmillionenstelle", 8], ["Hunderttausenderstelle", 5]];
        const [name, exp] = rng.pick(places);
        const digit = Math.floor(value / 10 ** exp) % 10;
        return task(
          level,
          "",
          `Welche Ziffer steht in ${n0(value)} an der ${name}?`,
          [num("Ziffer:", digit, "", 0)],
          "Zähle die Dreiergruppen von rechts: Einer, Tausender, Millionen.",
          `Von rechts gezählt ist es die Stelle Nummer ${exp + 1}.`,
          `Dort steht die Ziffer ${digit}.`,
          { value, exp },
        );
      },
    },
  ],
});

const stellenwert = L1(3, {
  id: "nz-3-stellenwert",
  title: "1.3 Das Zehnersystem",
  subtitle: "Was ein Stellenwertsystem ausmacht",
  whyItMatters:
    "Mit nur zehn Ziffern kannst du jede beliebig große Zahl schreiben. Das gelingt, weil die Stelle einer Ziffer ihren Wert mitbestimmt.",
  explanationHtml: `<p>Im <strong>Zehnersystem</strong> gibt es die zehn Ziffern 0 bis 9. Jede Stelle ist 10-mal so viel wert wie die Stelle rechts daneben: Einer, Zehner, Hunderter, Tausender, … Das ist ein <strong>Stellenwertsystem</strong>: Der Wert einer Ziffer hängt von ihrer Stelle ab.</p><p>Die 0 ist wichtig: Sie zeigt, dass eine Stelle leer ist. 305 und 35 sind verschiedene Zahlen.</p><div class="example">In 7.070 steht die 7 zweimal: links bedeutet sie 7 Tausender, rechts 7 Zehner. Zerlegt: 7.070 = 7 · 1.000 + 0 · 100 + 7 · 10 + 0 · 1.</div><div class="merke"><strong>Merke:</strong> Stellenwertsystem: dieselbe Ziffer, andere Stelle, anderer Wert. Zehn Einheiten einer Stelle ergeben eine Einheit der nächsten Stelle.</div>`,
  formulas: [
    { name: "Stellenwerte", html: "1, 10, 100, 1.000, 10.000, …", quantities: "Jede Stelle ist 10-mal so viel wert wie die rechts davon" },
  ],
  quiz: {
    question: "Welche Aussage beschreibt ein Stellenwertsystem?",
    options: [
      "Der Wert einer Ziffer hängt von ihrer Stelle in der Zahl ab.",
      "Jedes Zeichen hat immer denselben Wert, egal wo es steht.",
      "Es gibt für jede Zahl ein eigenes Zeichen.",
    ],
    correctIndex: 0,
    explanation: "Die 7 ist in 70 sieben Zehner und in 700 sieben Hunderter wert. Das kennzeichnet ein Stellenwertsystem.",
  },
  lab: lab(
    "place-value",
    "Stellenwerttafel",
    "Ziehe die Punkte in den Spalten und baue Zahlen. Die Tafel reicht bis zu den Zehnmillionen.",
    [
      r("zm", "Zehnmillionen", 0, 9, 0),
      r("m", "Millionen", 0, 9, 0),
      r("ht", "Hunderttausender", 0, 9, 1),
      r("zt", "Zehntausender", 0, 9, 2),
      r("t", "Tausender", 0, 9, 3),
      r("h", "Hunderter", 0, 9, 4),
      r("z", "Zehner", 0, 9, 5),
      r("e", "Einer", 0, 9, 6),
    ],
    [
      o("zahl", "Zahl", (v) => n0(v.zm * 1e7 + v.m * 1e6 + v.ht * 1e5 + v.zt * 1e4 + v.t * 1e3 + v.h * 100 + v.z * 10 + v.e)),
      o("tausender", "Wert der Tausender", (v) => n0(v.t * 1000)),
    ],
    [
      { id: "million", text: "Baue genau 1 Million.", check: (v) => v.zm + v.ht + v.zt + v.t + v.h + v.z + v.e === 0 && v.m === 1 },
      { id: "sieben", text: "Baue 7.070: zweimal die 7, mit ganz verschiedenem Wert.", check: (v) => v.zm + v.m + v.ht + v.zt + v.h + v.e === 0 && v.t === 7 && v.z === 7 },
      { id: "groesste", text: "Baue die größte Zahl, die die Tafel fasst.", check: (v) => [v.zm, v.m, v.ht, v.zt, v.t, v.h, v.z, v.e].every((d) => d === 9) },
    ],
  ),
  exercises: [
    {
      id: "wert-der-ziffer",
      make: (rng, level) => {
        const digits = rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 7);
        const value = digits.reduce((sum, digit) => sum * 10 + digit, 0);
        const exp = rng.int(1, 6);
        const digit = digits[6 - exp];
        if (level === 1)
          return task(
            level,
            `Welchen Wert hat die Ziffer ${digit} in der Zahl ${n0(value)}?`,
            "",
            [num("Wert:", digit * 10 ** exp, "", 0, { slips: [{ value: digit, hint: "Die Stelle zählt mit: Wie oft passt der Stellenwert hinein?" }] })],
            "Ziffer mal Stellenwert.",
            `Die ${digit} steht an der Stelle mit dem Wert ${n0(10 ** exp)}.`,
            `Sie hat den Wert ${n0(digit * 10 ** exp)}.`,
            { value, exp },
          );
        const moved = digit * 10 ** (exp - 1);
        return task(
          level,
          "",
          `In ${n0(value)} steht die ${digit} an einer bestimmten Stelle. Du rückst sie um eine Stelle nach rechts. Wie viel ist sie dann noch wert?`,
          [num("Wert:", moved, "", 0)],
          "Eine Stelle nach rechts: Der Wert wird durch 10 geteilt.",
          `Vorher: ${n0(digit * 10 ** exp)}. Eine Stelle weiter rechts: ${n0(digit * 10 ** exp)} : 10.`,
          `Sie ist dann ${n0(moved)} wert.`,
          { value, exp },
        );
      },
    },
    {
      id: "zerlegen",
      make: (rng, level) => {
        const t = rng.int(1, 9), h = rng.int(0, 9), z = rng.pick([0, rng.int(1, 9)]), e = rng.int(0, 9);
        const value = t * 1000 + h * 100 + z * 10 + e;
        if (level === 1)
          return task(
            level,
            `Welche Zahl ist ${t} · 1.000 + ${h} · 100 + ${z} · 10 + ${e} · 1?`,
            "",
            [num("Zahl:", value, "", 0)],
            "Trage die Faktoren der Reihe nach in die Stellenwerttafel ein.",
            `T: ${t}, H: ${h}, Z: ${z}, E: ${e}.`,
            `Die Zahl heißt ${n0(value)}.`,
            { value },
          );
        const add = rng.pick([1, 10, 100, 1000]);
        const name = { 1: "Einer", 10: "Zehner", 100: "Hunderter", 1000: "Tausender" }[add]!;
        const big = rng.int(1, 9) * 10 ** 6 + value;
        return task(
          level,
          "",
          `Zu ${n0(big)} addierst du 3 ${name}. Wie heißt die neue Zahl?`,
          [num("Zahl:", big + 3 * add, "", 0)],
          "3 Einheiten dieser Stelle: 3 mal den Stellenwert addieren. Ein Übertrag geht in die nächste Stelle.",
          `${n0(big)} + 3 · ${n0(add)} = ${n0(big + 3 * add)}.`,
          `Die Zahl heißt ${n0(big + 3 * add)}.`,
          { big, add },
        );
      },
    },
  ],
});

/** Typical wrong spellings: the same sign four times and the sign on the wrong side. */
const ROMAN_SLIPS: Array<[number, string, string]> = [
  [4, "IIII", "VI"],
  [9, "VIIII", "XI"],
  [14, "XIIII", "XVI"],
  [19, "XVIIII", "XXI"],
  [24, "XXIIII", "XXVI"],
  [29, "XXVIIII", "XXXI"],
  [40, "XXXX", "LX"],
  [44, "XXXXIV", "LXIV"],
  [49, "XXXXVIIII", "LXI"],
  [90, "LXXXX", "CX"],
  [94, "LXXXXIV", "CXIV"],
  [99, "LXXXXVIIII", "CI"],
  [400, "CCCC", "DC"],
  [900, "DCCCC", "MC"],
];
const YEARS = [1492, 1789, 1806, 1871, 1919, 1949, 1989, 2000, 2024, 1648, 1517, 1776];
const roemisch = L1(4, {
  id: "nz-4-roemisch",
  title: "1.4 Römische Zahlen",
  subtitle: "Ein Zahlensystem ohne Stellenwert",
  whyItMatters:
    "An Kirchen und in Büchern stehen römische Zahlen bis heute. Der Vergleich zeigt dir, was unser Zehnersystem so praktisch macht.",
  explanationHtml: `<p>Die Römer schrieben Zahlen mit Zeichen: I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1.000. Das ist <strong>kein Stellenwertsystem</strong>: X bedeutet immer 10, egal wo es steht. Die Werte werden addiert.</p><p>Steht ein kleineres Zeichen <strong>vor</strong> einem größeren, wird es abgezogen: IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900. Dasselbe Zeichen steht höchstens dreimal nebeneinander.</p><div class="example">MCMXCIV = 1.000 + 900 + 90 + 4 = 1.994. Umgekehrt zerlegst du 2.024 in 2.000 + 20 + 4 und schreibst MMXXIV.</div><div class="merke"><strong>Merke:</strong> Im Zehnersystem zählt die Stelle einer Ziffer, im römischen System der feste Wert des Zeichens. Eine Null gibt es bei den Römern nicht.</div>`,
  formulas: [
    { name: "Zeichen", html: "I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1.000", quantities: "Werte werden addiert" },
    { name: "Abziehen", html: "IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900", quantities: "Kleineres Zeichen vor größerem" },
  ],
  quiz: {
    question: "Warum ist das römische Zahlensystem kein Stellenwertsystem?",
    options: [
      "Weil ein Zeichen wie X immer denselben Wert hat, egal an welcher Stelle es steht.",
      "Weil es nur für kleine Zahlen funktioniert.",
      "Weil man die Zeichen nicht addieren darf.",
    ],
    correctIndex: 0,
    explanation: "In XX bedeutet jedes X genau 10. In 77 ist die linke 7 dagegen 70 wert.",
  },
  lab: lab(
    "roman",
    "Zeichen zerlegen",
    "Ziehe die Zahl. Die App zerlegt sie in die römischen Zeichen und ihre Werte.",
    [r("n", "Zahl", 1, 2000, 8)],
    [
      o("roemisch", "Römisch", (v) => roman(v.n)),
      o("zeichen", "Anzahl der Zeichen", (v) => roman(v.n).length),
    ],
    [
      { id: "vierzehn", text: "Stelle XIV ein.", check: (v) => v.n === 14 },
      { id: "lang", text: "Finde eine Zahl unter 100, die 7 oder mehr Zeichen braucht.", check: (v) => v.n < 100 && roman(v.n).length >= 7 },
      { id: "jedes", text: "Stelle MDCLXVI ein: jedes der sieben Zeichen einmal.", check: (v) => v.n === 1666 },
    ],
  ),
  exercises: [
    {
      id: "roemisch-lesen",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.int(14, 399);
          const text = roman(n);
          return task(
            level,
            `Welche Zahl im Zehnersystem ist ${text}?`,
            "",
            [num("Zahl:", n, "", 0)],
            "Addiere die Werte. Steht ein kleineres Zeichen vor einem größeren, ziehe es ab.",
            `${text} ergibt ${n}.`,
            `${text} = ${n}`,
            { n },
          );
        }
        const year = rng.pick(YEARS);
        const text = roman(year);
        return task(
          level,
          "",
          `An einem alten Gebäude steht die Jahreszahl ${text}. In welchem Jahr wurde es gebaut?`,
          [num("Jahr:", fromRoman(text), "", 0)],
          "Zerlege in Tausender, Hunderter, Zehner und Einer.",
          `${text} ergibt ${year}.`,
          `Es wurde im Jahr ${year} gebaut.`,
          { year },
        );
      },
    },
    {
      id: "roemisch-schreiben",
      make: (rng, level) => {
        if (level === 1) {
          const [n, wrong, third] = rng.pick(ROMAN_SLIPS);
          const right = roman(n);
          return task(
            level,
            `Wie schreibst du ${n} korrekt in römischen Zeichen?`,
            "",
            [pick("Schreibweise:", [right, wrong, third], 0)],
            "Dasselbe Zeichen steht höchstens dreimal nebeneinander. Zerlege die Zahl in ihre Stellen.",
            `${n} zerlegst du nach Stellen und setzt die Zeichen zusammen.`,
            `${n} = ${right}`,
            { n },
          );
        }
        const a = rng.int(11, 40), b = rng.int(11, 40);
        return task(
          level,
          "",
          `Berechne ${roman(a)} + ${roman(b)} und gib das Ergebnis im Zehnersystem an. Wandle dazu zuerst beide Zahlen um.`,
          [num("Ergebnis:", a + b, "", 0)],
          "Wandle zuerst beide Zahlen um. Im Zehnersystem kannst du stellenweise rechnen.",
          `${roman(a)} = ${a} und ${roman(b)} = ${b}. ${a} + ${b} = ${a + b}.`,
          `Das Ergebnis ist ${a + b}, römisch ${roman(a + b)}.`,
          { a, b },
        );
      },
    },
  ],
});

const zahlenstrahl = L1(5, {
  id: "nz-5-zahlenstrahl",
  title: "1.5 Der Zahlenstrahl",
  subtitle: "Ablesen und eine passende Einteilung wählen",
  whyItMatters:
    "Auf einem Zahlenstrahl siehst du sofort, wie groß Zahlen im Vergleich sind. Dazu musst du die Einteilung passend zu den Zahlen wählen.",
  explanationHtml: `<p>Auf dem <strong>Zahlenstrahl</strong> liegen die Zahlen geordnet: Rechts liegt immer die größere Zahl. Der Abstand zwischen zwei Teilstrichen steht immer für denselben Wert. Diesen Wert nennt man die <strong>Skalierung</strong>.</p><p>Zum Ablesen bestimmst du zuerst, was ein Teilstrich bedeutet: Abstand zweier beschrifteter Zahlen geteilt durch die Zahl der Abschnitte dazwischen. Zum Zeichnen wählst du die Einteilung so, dass alle Zahlen Platz haben und du sie gut unterscheiden kannst.</p><div class="example">Zwischen 2.000 und 3.000 liegen 5 gleich lange Abschnitte. Ein Abschnitt steht für 1.000 : 5 = 200. Der 3. Teilstrich nach 2.000 ist also 2.600.</div><div class="merke"><strong>Merke:</strong> Erst die Einteilung bestimmen, dann ablesen. Gleiche Abstände bedeuten gleiche Unterschiede.</div>`,
  formulas: [
    { name: "Ein Teilstrich", html: "Abstand der Zahlen : Anzahl der Abschnitte", quantities: "Wert eines Abschnitts" },
  ],
  quiz: {
    question: "Du willst 1.200, 3.500 und 8.000 auf einem Zahlenstrahl von 10 cm Länge zeigen. Welche Einteilung passt?",
    options: ["1 cm steht für 1.000", "1 cm steht für 10", "1 cm steht für 100.000"],
    correctIndex: 0,
    explanation: "Mit 1 cm für 1.000 reicht der Strahl bis 10.000, und die Zahlen liegen gut verteilt. Die anderen Einteilungen sind viel zu klein oder zu groß.",
  },
  lab: lab(
    "number-ray",
    "Zahlenstrahl einteilen",
    "Wähle, wofür ein Teilstrich steht, und ziehe den Punkt.",
    [c("scale", "Ein Teilstrich", ["1", "10", "100", "1.000"]), r("k", "Teilstrich Nummer", 0, 20, 5)],
    [
      o("wert", "Wert am Punkt", (v) => n0([1, 10, 100, 1000][v.scale] * v.k)),
      o("rechnung", "Rechnung", (v) => `${v.k} · ${n0([1, 10, 100, 1000][v.scale])}`),
    ],
    [
      { id: "siebzig", text: "Zeige die Zahl 70 mit der Einteilung 10.", check: (v) => v.scale === 1 && v.k === 7 },
      { id: "tausend", text: "Zeige 1.300 mit der Einteilung 100.", check: (v) => v.scale === 2 && v.k === 13 },
      { id: "gross", text: "Zeige die größte Zahl, die diese Einteilungen überhaupt erreichen.", check: (v) => v.scale === 3 && v.k === 20 },
    ],
  ),
  exercises: [
    {
      id: "ablesen",
      make: (rng, level) => {
        const parts = rng.pick([4, 5, 10]);
        const span = rng.pick([1000, 2000, 10000, 20000, 1000000]);
        const step = span / parts;
        const startK = rng.int(1, 6);
        const start = startK * span;
        const k = rng.int(1, parts - 1);
        const value = start + k * step;
        if (level === 1)
          return task(
            level,
            `Zwischen ${n0(start)} und ${n0(start + span)} liegen ${parts} gleich lange Abschnitte. Welche Zahl steht am ${k}. Teilstrich nach ${n0(start)}?`,
            "",
            [num("Zahl:", value, "", 0, { slips: [{ value: start + k, hint: "Ein Abschnitt bedeutet hier nicht 1. Teile zuerst den Abstand durch die Zahl der Abschnitte." }] })],
            "Ein Abschnitt: Abstand geteilt durch die Zahl der Abschnitte.",
            `Ein Abschnitt steht für ${n0(span)} : ${parts} = ${n0(step)}. Also ${n0(start)} + ${k} · ${n0(step)}.`,
            `Dort steht ${n0(value)}.`,
            { parts, span, k },
          );
        return task(
          level,
          "",
          `An einem Zahlenstrahl steht bei ${n0(start)} und bei ${n0(start + span)} je eine Beschriftung, dazwischen sind ${parts - 1} Teilstriche ohne Zahl. Die Marke steht auf dem ${k}. dieser Teilstriche. Welche Zahl zeigt sie?`,
          [num("Zahl:", value, "", 0, { slips: [{ value: start + (k * span) / (parts - 1), hint: "Die Teilstriche dazwischen ergeben einen Abschnitt mehr, als es Teilstriche sind." }] })],
          "Teilstriche dazwischen plus 1 ergibt die Zahl der Abschnitte.",
          `${parts - 1} Teilstriche teilen die Strecke in ${parts} Abschnitte. Ein Abschnitt steht für ${n0(step)}, also ${n0(start)} + ${k} · ${n0(step)}.`,
          `Die Marke zeigt ${n0(value)}.`,
          { parts, span, k },
        );
      },
    },
    {
      id: "einteilung-waehlen",
      make: (rng, level) => {
        const perCm = rng.pick([50, 100, 200, 500, 1000, 5000]);
        const cm = rng.int(3, 18);
        const value = perCm * cm;
        if (level === 1)
          return task(
            level,
            `Auf einem Zahlenstrahl steht 1 cm für ${n0(perCm)}. Wie viele Zentimeter von der 0 entfernt liegt die Zahl ${n0(value)}?`,
            "",
            [num("Abstand:", cm, "cm", 0)],
            "Teile die Zahl durch den Wert von 1 cm.",
            `${n0(value)} : ${n0(perCm)} = ${cm}.`,
            `Sie liegt ${cm} cm von der 0 entfernt.`,
            { perCm, cm },
          );
        const length = rng.pick([10, 20]);
        const max = perCm * length;
        return task(
          level,
          "",
          `Du zeichnest einen Zahlenstrahl von ${length} cm Länge, der genau bis ${n0(max)} reichen soll. Für welchen Wert steht dann 1 cm?`,
          [num("1 cm steht für:", perCm, "", 0)],
          "Größte Zahl geteilt durch die Länge.",
          `${n0(max)} : ${length} = ${n0(perCm)}.`,
          `1 cm steht für ${n0(perCm)}.`,
          { max, length },
        );
      },
    },
  ],
});

const PLACE_NAMES: Array<[string, number]> = [["Zehner", 10], ["Hunderter", 100], ["Tausender", 1000], ["Zehntausender", 10000], ["Hunderttausender", 100000]];
const runden = L1(6, {
  id: "nz-6-runden",
  title: "1.6 Runden",
  subtitle: "Genau genug statt übergenau",
  whyItMatters:
    "Niemand sagt: „Im Stadion waren 48.723 Leute.“ Gerundete Zahlen sind leichter zu merken und oft alles, was man braucht.",
  explanationHtml: `<p>Beim <strong>Runden</strong> entscheidet die Ziffer rechts neben der Rundungsstelle: Bei 0, 1, 2, 3, 4 wird <strong>abgerundet</strong>, bei 5, 6, 7, 8, 9 wird <strong>aufgerundet</strong>. Alle Ziffern rechts davon werden zu Nullen. Das Zeichen ≈ heißt „ist ungefähr“.</p><p>Im Sachzusammenhang überlegst du zusätzlich, was sinnvoll ist: Für 87 Kinder und Busse mit 40 Plätzen brauchst du 3 Busse, obwohl 87 : 40 näher bei 2 liegt. Dort rundet die Sache, nicht die Regel.</p><div class="example">48.723 auf Tausender: Rechts neben der 8 steht eine 7, also aufrunden: 48.723 ≈ 49.000. Auf Hunderter: Neben der 7 steht eine 2, also abrunden: 48.723 ≈ 48.700.</div><div class="merke"><strong>Merke:</strong> Nur die Ziffer direkt rechts von der Rundungsstelle entscheidet. Prüfe im Sachzusammenhang, ob das Ergebnis passt.</div>`,
  formulas: [
    { name: "Runden", html: "0 bis 4: abrunden, 5 bis 9: aufrunden", quantities: "Entscheidend ist die Ziffer rechts der Rundungsstelle" },
  ],
  quiz: {
    question: "Runde 3.496 auf Hunderter.",
    options: ["3.500", "3.400", "3.000"],
    correctIndex: 0,
    explanation: "Rechts neben der 4 steht eine 9. Also wird aufgerundet: 3.500.",
  },
  lab: lab(
    "rounding",
    "Runden am Zahlenstrahl",
    "Wähle die Rundungsstelle und ziehe die Zahl. Der Punkt springt zur nächsten runden Zahl.",
    [c("place", "Runden auf", ["Zehner", "Hunderter", "Tausender"], 1), r("n", "Zahl", 1000, 5000, 1234)],
    [
      o("ergebnis", "Gerundet", (v) => n0(roundTo(v.n, [10, 100, 1000][v.place]))),
      o("richtung", "Richtung", (v) => { const place = [10, 100, 1000][v.place]; const rounded = roundTo(v.n, place); return rounded === v.n ? "schon rund" : rounded > v.n ? "aufrunden" : "abrunden"; }),
    ],
    [
      { id: "mitte", text: "Stelle eine Zahl genau in der Mitte ein: 2.650 auf Hunderter.", check: (v) => v.place === 1 && v.n === 2650 },
      { id: "knapp", text: "Stelle die größte Zahl ein, die auf Tausender gerundet 3.000 ergibt.", check: (v) => v.place === 2 && v.n === 3499 },
      { id: "kette", text: "Stelle 4.995 auf Zehner ein: Der Überlauf reicht bis zu den Tausendern.", check: (v) => v.place === 0 && v.n === 4995 },
    ],
  ),
  exercises: [
    {
      id: "runden-stelle",
      make: (rng, level) => {
        if (level === 1) {
          const [name, place] = rng.pick(PLACE_NAMES);
          const value = rng.int(1_000_001, 9_999_999);
          const result = roundTo(value, place);
          return task(
            level,
            `Runde die Zahl ${n0(value)} auf ${name}.`,
            "",
            [num("Gerundet:", result, "", 0)],
            "Sieh dir die Ziffer rechts neben der Rundungsstelle an.",
            `Rechts neben der ${name}stelle steht eine ${Math.floor(value / (place / 10)) % 10}.`,
            `${n0(value)} ≈ ${n0(result)}`,
            { value, place },
          );
        }
        const visitors = rng.int(11_000, 74_999);
        const place = rng.pick([100, 1000]);
        const result = roundTo(visitors, place);
        return task(
          level,
          "",
          `Bei einem Fußballspiel sind ${n0(visitors)} Zuschauer im Stadion. Die Zeitung rundet auf ${place === 100 ? "Hunderter" : "Tausender"}. Welche Zahl steht in der Zeitung?`,
          [num("Zuschauer:", result, "", 0)],
          "Runden wie gelernt. Die Zeitung schreibt dann „rund“.",
          `Die Ziffer rechts der Rundungsstelle ist ${Math.floor(visitors / (place / 10)) % 10}.`,
          `In der Zeitung steht rund ${n0(result)}.`,
          { visitors, place },
        );
      },
    },
    {
      id: "runden-sinnvoll",
      make: (rng, level) => {
        const seats = rng.pick([40, 50, 30]);
        const kids = seats * rng.int(2, 6) + rng.int(1, seats - 1);
        const buses = Math.ceil(kids / seats);
        if (level === 1) {
          const value = rng.int(10_000, 99_999);
          const lo = roundTo(value, 1000) - 500;
          return task(
            level,
            `Eine Zahl wurde auf Tausender gerundet, das Ergebnis ist ${n0(lo + 500)}. Wie heißt die kleinste natürliche Zahl, die so gerundet wird?`,
            "",
            [num("Kleinste Zahl:", lo, "", 0, { slips: [{ value: lo + 499, hint: "Das ist die größte Zahl. Gesucht ist die kleinste." }] })],
            "500 unter dem Ergebnis beginnt das Aufrunden.",
            `Ab ${n0(lo)} wird auf ${n0(lo + 500)} aufgerundet.`,
            `Die kleinste Zahl ist ${n0(lo)}.`,
            { value },
          );
        }
        return task(
          level,
          "",
          `${kids} Kinder fahren ins Schullandheim. In einen Bus passen ${seats} Kinder. Wie viele Busse braucht die Schule?`,
          [num("Busse:", buses, "", 0, { slips: [{ value: buses - 1, hint: "Dann bleiben Kinder zurück. Hier musst du aufrunden, auch wenn der Rest klein ist." }] })],
          "Alle müssen mitfahren. Überlege, was die Rechnung für den Rest bedeutet.",
          `${kids} : ${seats} = ${buses - 1} Rest ${kids - (buses - 1) * seats}. Für die übrigen Kinder braucht es noch einen Bus.`,
          `Die Schule braucht ${buses} Busse.`,
          { kids, seats },
        );
      },
    },
  ],
});

const negativeZahlen = L1(7, {
  id: "nz-7-negative-zahlen",
  title: "1.7 Warum negative Zahlen?",
  subtitle: "Die Erweiterung zu den ganzen Zahlen",
  whyItMatters:
    "3 − 5 hat bei den natürlichen Zahlen keine Lösung. Trotzdem kann es morgens 3 °C haben und abends 5 Grad kälter sein.",
  explanationHtml: `<p>In ℕ kannst du nicht jede Subtraktion ausführen: 3 − 5 geht nicht. Darum <strong>erweitern</strong> wir den Zahlenbereich um die <strong>negativen Zahlen</strong> −1, −2, −3, … Zusammen mit der 0 und den positiven Zahlen ergeben sie die <strong>ganzen Zahlen</strong> ℤ = {…; −2; −1; 0; 1; 2; …}.</p><p>Negative Zahlen brauchst du überall, wo etwas unter einem Nullpunkt liegt: Temperaturen unter 0 °C, Schulden, Stockwerke unter dem Erdgeschoss, Orte unter dem Meeresspiegel.</p><div class="example">Morgens 3 °C, bis zum Abend 5 Grad kälter: 3 − 5 = −2. Abends hat es −2 °C. Wer 20 € Guthaben hat und 50 € ausgibt, steht bei −30 €.</div><div class="merke"><strong>Merke:</strong> ℤ reicht in beide Richtungen ohne Ende. Die 0 ist weder positiv noch negativ.</div>`,
  formulas: [
    { name: "Ganze Zahlen", html: "ℤ = {…; −2; −1; 0; 1; 2; …}", quantities: "ℕ ist ein Teil davon" },
  ],
  quiz: {
    question: "Warum reichen die natürlichen Zahlen nicht aus?",
    options: [
      "Weil zum Beispiel 3 − 5 keine natürliche Zahl ergibt.",
      "Weil es nur endlich viele natürliche Zahlen gibt.",
      "Weil man natürliche Zahlen nicht addieren kann.",
    ],
    correctIndex: 0,
    explanation: "Das Ergebnis −2 liegt außerhalb von ℕ. In ℤ geht jede Subtraktion auf.",
  },
  lab: lab(
    "thermometer",
    "Unter der Null",
    "Wähle eine Situation und ziehe den Wert. Du siehst, wann die Zahl negativ wird.",
    [c("ctx", "Situation", ["Temperatur", "Kontostand", "Stockwerk"]), r("t", "Wert", -20, 30, 5)],
    [
      o("art", "Art der Zahl", (v) => (v.t < 0 ? "negativ" : v.t > 0 ? "positiv" : "weder noch")),
      o("satz", "Bedeutung", (v) => {
        if (v.ctx === 0) return v.t < 0 ? `${-v.t} Grad unter dem Gefrierpunkt` : v.t === 0 ? "Gefrierpunkt" : `${v.t} Grad über dem Gefrierpunkt`;
        if (v.ctx === 1) return v.t < 0 ? `${-v.t} € Schulden` : v.t === 0 ? "kein Geld, keine Schulden" : `${v.t} € Guthaben`;
        return v.t < 0 ? `${-v.t}. Untergeschoss` : v.t === 0 ? "Erdgeschoss" : `${v.t}. Obergeschoss`;
      }),
    ],
    [
      { id: "frost", text: "Stelle starken Frost ein: −12 °C.", check: (v) => v.ctx === 0 && v.t === -12 },
      { id: "schulden", text: "Stelle 20 € Schulden ein.", check: (v) => v.ctx === 1 && v.t === -20 },
      { id: "keller", text: "Fahre mit dem Aufzug in das 3. Untergeschoss.", check: (v) => v.ctx === 2 && v.t === -3 },
    ],
  ),
  exercises: [
    {
      id: "temperatur",
      make: (rng, level) => {
        const start = rng.int(1, 9), drop = start + rng.int(1, 9);
        const end = start - drop;
        if (level === 1)
          return task(
            level,
            `Am Morgen zeigt das Thermometer ${start} °C. Bis zum Abend wird es ${drop} Grad kälter. Wie warm ist es dann?`,
            "",
            [num("Temperatur:", end, "°C", 0, { slips: [{ value: -end, hint: "Das Ergebnis liegt unter null. Vergiss das Minuszeichen nicht." }] })],
            `Rechne ${start} − ${drop}.`,
            `Bis 0 °C ${start === 1 ? "ist es" : "sind es"} ${start} Grad, danach ${drop - start === 1 ? "fehlt" : "fehlen"} noch ${drop - start} Grad.`,
            `Es hat ${n0(end)} °C.`,
            { start, drop },
          );
        const rise = rng.int(3, 15);
        return task(
          level,
          "",
          `In der Nacht hat es ${n0(end)} °C. Bis zum Mittag steigt die Temperatur um ${rise} Grad, am Abend fällt sie wieder um ${drop} Grad. Welche Temperatur hat es am Abend?`,
          [num("Temperatur:", end + rise - drop, "°C", 0)],
          "Rechne Schritt für Schritt und stelle es dir an der Zahlengeraden vor.",
          `${n0(end)} + ${rise} = ${n0(end + rise)}, dann ${n0(end + rise)} − ${drop} = ${n0(end + rise - drop)}.`,
          `Am Abend hat es ${n0(end + rise - drop)} °C.`,
          { end, rise, drop },
        );
      },
    },
    {
      id: "situation",
      make: (rng, level) => {
        const amount = rng.int(5, 90);
        const items = [
          [`${amount} € Schulden`, -amount],
          [`${amount} € Guthaben`, amount],
          [`${amount} m unter dem Meeresspiegel`, -amount],
          [`${amount} m über dem Meeresspiegel`, amount],
        ] as const;
        const [label, value] = rng.pick(items);
        if (level === 1)
          return task(
            level,
            `Schreibe „${label}“ als ganze Zahl.`,
            "",
            [num("Zahl:", value, "", 0, { slips: [{ value: -value, hint: "Prüfe das Vorzeichen: Liegt der Wert über oder unter der Null?" }] })],
            "Unter der Null: negativ. Über der Null: positiv.",
            `„${label}“ liegt ${value < 0 ? "unter" : "über"} dem Nullpunkt.`,
            `Die Zahl ist ${n0(value)}.`,
            { value },
          );
        const pay = amount + rng.int(5, 60);
        return task(
          level,
          "",
          `Lena hat ${amount} € auf dem Konto. Sie bezahlt ein Fahrradschloss und Zubehör für ${pay} €. Wie hoch ist ihr Kontostand danach?`,
          [num("Kontostand:", amount - pay, "€", 0, { slips: [{ value: pay - amount, hint: "Dann hätte Lena Guthaben. Sie hat aber mehr ausgegeben, als da war." }] })],
          "Mehr ausgegeben, als da war: negativer Kontostand.",
          `${amount} − ${pay} = ${n0(amount - pay)}.`,
          `Der Kontostand ist ${n0(amount - pay)} €.`,
          { amount, pay },
        );
      },
    },
  ],
});

const zahlengerade = L1(8, {
  id: "nz-8-zahlengerade",
  title: "1.8 Zahlengerade und Betrag",
  subtitle: "Ganze Zahlen ordnen und ihren Abstand zur Null sehen",
  whyItMatters:
    "Die Zahlengerade macht klar, warum −8 kleiner ist als −3. Der Betrag sagt dir, wie weit eine Zahl von der Null entfernt liegt.",
  explanationHtml: `<p>Auf der <strong>Zahlengeraden</strong> setzt du den Zahlenstrahl nach links fort. Von zwei Zahlen ist immer die weiter rechts liegende die größere: −3 &gt; −8 und 2 &gt; −5.</p><p>Die <strong>Gegenzahl</strong> liegt im selben Abstand auf der anderen Seite der Null. Der <strong>Betrag</strong> ist der Abstand einer Zahl zur Null. Du schreibst ihn mit senkrechten Strichen. Er ist nie negativ.</p><div class="example">Der Größe nach: −8 &lt; −3 &lt; 0 &lt; 2 &lt; 7. Beträge: |−8| = 8 und |8| = 8. Die Gegenzahl von −8 ist 8.</div><div class="merke"><strong>Merke:</strong> Rechts liegt die größere Zahl. Bei negativen Zahlen ist also die mit dem größeren Betrag die kleinere.</div>`,
  formulas: [
    { name: "Betrag", html: "|−7| = 7, |7| = 7", quantities: "Abstand zur Null, nie negativ" },
    { name: "Gegenzahl", html: "−(−7) = 7", quantities: "Gleicher Abstand, andere Seite" },
  ],
  quiz: {
    question: "Welche Ordnung ist richtig?",
    options: ["−9 < −4 < 0 < 2", "−4 < −9 < 0 < 2", "0 < 2 < −4 < −9"],
    correctIndex: 0,
    explanation: "−9 liegt am weitesten links und ist darum die kleinste Zahl.",
  },
  lab: lab(
    "opposite",
    "Spiegelbild an der Null",
    "Ziehe die Zahl auf der Geraden. Der Bogen zeigt den Betrag, der orange Punkt die Gegenzahl.",
    [r("z", "Zahl", -20, 20, 5)],
    [
      o("vorzeichen", "Vorzeichen", (v) => (v.z > 0 ? "plus" : v.z < 0 ? "minus" : "keines")),
      o("gegenzahl", "Gegenzahl", (v) => n0(-v.z)),
      o("betrag", "Betrag", (v) => Math.abs(v.z)),
    ],
    [
      { id: "minus-sieben", text: "Stelle −7 ein: Betrag 7, Gegenzahl 7.", check: (v) => v.z === -7 },
      { id: "null", text: "Stelle die Zahl ein, die ihre eigene Gegenzahl ist.", check: (v) => v.z === 0 },
      { id: "zwoelf", text: "Stelle die negative Zahl mit dem Betrag 12 ein.", check: (v) => v.z === -12 },
    ],
  ),
  exercises: [
    {
      id: "ordnen",
      make: (rng, level) => {
        const set = new Set<number>();
        while (set.size < 4) set.add(rng.int(-30, 30));
        const values = [...set];
        const sorted = [...values].sort((a, b) => a - b);
        if (level === 1) {
          const smallest = rng.int(0, 1) === 0;
          return task(
            level,
            `Welche der Zahlen ${values.map(n0).join("; ")} ist die ${smallest ? "kleinste" : "größte"}?`,
            "",
            [num("Zahl:", smallest ? sorted[0] : sorted[3], "", 0)],
            "Stelle dir die Zahlengerade vor: Links liegt die kleinere Zahl.",
            `Der Größe nach: ${sorted.map(n0).join(" < ")}.`,
            `Die ${smallest ? "kleinste" : "größte"} Zahl ist ${n0(smallest ? sorted[0] : sorted[3])}.`,
            { first: values[0] },
          );
        }
        const heights = [rng.int(900, 2900), rng.int(120, 800), -rng.int(5, 40), -rng.int(41, 200)];
        const places = ["Berggipfel", "Talort", "Tauchplatz", "Meeresgrund"];
        const text = rng.shuffle(heights.map((h, i) => `${places[i]}: ${n0(h)} m`)).join(", ");
        const asked = rng.int(1, 2);
        const ordered = [...heights].sort((a, b) => a - b);
        return task(
          level,
          "",
          `Höhenangaben bezogen auf den Meeresspiegel: ${text}. Welche Höhe ist die ${asked === 1 ? "zweitniedrigste" : "drittniedrigste"}?`,
          [num("Höhe:", ordered[asked], "m", 0)],
          "Ordne alle vier Werte auf der Zahlengeraden.",
          `Der Größe nach: ${ordered.map(n0).join(" < ")}.`,
          `Die gesuchte Höhe ist ${n0(ordered[asked])} m.`,
          { asked },
        );
      },
    },
    {
      id: "betrag-abstand",
      make: (rng, level) => {
        const z = rng.sign() * rng.int(3, level === 1 ? 30 : 400);
        if (level === 1)
          return task(
            level,
            `Gib zu ${n0(z)} die Gegenzahl und den Betrag an.`,
            "",
            [num("Gegenzahl:", -z, "", 0), num("Betrag:", Math.abs(z), "", 0)],
            "Gegenzahl: Vorzeichen wechseln. Betrag: Abstand zur Null.",
            `Auf der anderen Seite der Null liegt ${n0(-z)}. Der Abstand zur Null ist ${Math.abs(z)}.`,
            `Gegenzahl ${n0(-z)}, Betrag ${Math.abs(z)}`,
            { z },
          );
        const a = rng.int(3, 90), b = rng.int(3, 90);
        return task(
          level,
          "",
          `Auf der Zahlengeraden liegen −${a} und ${b}. Wie groß ist der Abstand der beiden Zahlen?`,
          [num("Abstand:", a + b, "", 0, { slips: [{ value: Math.abs(b - a), hint: "Die Zahlen liegen auf verschiedenen Seiten der Null. Addiere ihre Abstände zur Null." }] })],
          "Beide Zahlen liegen auf verschiedenen Seiten der Null.",
          `|−${a}| + |${b}| = ${a} + ${b} = ${a + b}.`,
          `Der Abstand ist ${a + b}.`,
          { a, b },
        );
      },
    },
  ],
});

interface Claim {
  text: string;
  /** A pair that disproves the claim and two pairs that do not. */
  counter: [number, number];
  notCounter: [[number, number], [number, number]];
}
const aussagen = L1(9, {
  id: "nz-9-aussagen",
  title: "1.9 Aussagen prüfen",
  subtitle: "Ein Gegenbeispiel genügt",
  whyItMatters:
    "„Das stimmt doch immer!“ Mathematisch wird das erst, wenn du es prüfst. Für eine falsche Aussage genügt ein einziges Gegenbeispiel.",
  explanationHtml: `<p>Eine Aussage über alle Zahlen ist <strong>falsch</strong>, sobald ein einziges Beispiel nicht passt. Dieses Beispiel heißt <strong>Gegenbeispiel</strong>. Mehrere passende Beispiele beweisen dagegen noch nicht, dass die Aussage immer stimmt.</p><p>Prüfe die Aussage „Von zwei ganzen Zahlen ist diejenige größer, die den größeren Betrag hat.“ Für 5 und 2 passt sie. Für −5 und 2 passt sie nicht: |−5| = 5 ist größer als |2| = 2, aber −5 &lt; 2.</p><div class="example">„Eine Zahl mit Minus davor ist immer negativ.“ Gegenbeispiel: −(−3) = 3 ist positiv. Die Aussage ist widerlegt.</div><div class="merke"><strong>Merke:</strong> Eine falsche Aussage widerlegst du mit einem Gegenbeispiel. Beispiele allein beweisen keine Aussage.</div>`,
  formulas: [
    { name: "Gegenbeispiel", html: "Ein Fall, in dem die Aussage nicht gilt", quantities: "Genügt, um eine Aussage über alle Zahlen zu widerlegen" },
  ],
  quiz: {
    question: "Welches Zahlenpaar widerlegt „Die Zahl mit dem größeren Betrag ist die größere“?",
    options: ["−7 und 3", "7 und 3", "7 und −3"],
    correctIndex: 0,
    explanation: "|−7| ist größer als |3|, aber −7 liegt links von 3. Bei den beiden anderen Paaren hat 7 den größeren Betrag und ist auch die größere Zahl.",
  },
  lab: lab(
    "compare-abs",
    "Gegenbeispiele suchen",
    "Ziehe die beiden Zahlen. Die App vergleicht Größe und Betrag.",
    [r("a", "a", -20, 20, 12), r("b", "b", -20, 20, 7)],
    [
      o("groesser", "Größere Zahl", (v) => (v.a > v.b ? "a" : v.a < v.b ? "b" : "gleich")),
      o("betrag", "Größerer Betrag", (v) => (Math.abs(v.a) > Math.abs(v.b) ? "a" : Math.abs(v.a) < Math.abs(v.b) ? "b" : "gleich")),
    ],
    [
      { id: "gegenbeispiel", text: "Finde ein Gegenbeispiel mit a negativ und b positiv.", check: (v) => v.a < 0 && v.b > 0 && Math.abs(v.a) > Math.abs(v.b) },
      { id: "beide-negativ", text: "Finde ein Gegenbeispiel, bei dem beide Zahlen negativ sind.", check: (v) => v.a < 0 && v.b < 0 && Math.abs(v.a) !== Math.abs(v.b) },
      { id: "gleicher-betrag", text: "Stelle zwei verschiedene Zahlen mit gleichem Betrag ein.", check: (v) => v.a !== v.b && Math.abs(v.a) === Math.abs(v.b) },
    ],
  ),
  exercises: [
    {
      id: "gegenbeispiel-waehlen",
      make: (rng, level) => {
        const a = rng.int(4, 18), b = rng.int(1, a - 1);
        if (level === 1) {
          const pairs: Array<[number, number]> = [[-a, b], [a, b], [-b, a]];
          const shown = pairs.map(([x, y]) => `${n0(x)} und ${n0(y)}`);
          return task(
            level,
            "Welches Zahlenpaar widerlegt die Aussage „Von zwei ganzen Zahlen ist diejenige größer, die den größeren Betrag hat“?",
            "",
            [pick("Gegenbeispiel:", shown, 0)],
            "Gesucht: größerer Betrag, aber kleinere Zahl. Das geht mit einer negativen Zahl.",
            `|${n0(-a)}| = ${a} ist größer als |${b}| = ${b}, aber ${n0(-a)} < ${b}.`,
            `Gegenbeispiel: ${n0(-a)} und ${b}`,
            { a, b },
          );
        }
        const claims: Claim[] = [
          { text: "Die Summe zweier ganzer Zahlen ist immer größer als jede der beiden Zahlen.", counter: [a, -b], notCounter: [[a, b], [b, a]] },
          { text: "Die Differenz zweier natürlicher Zahlen ist immer eine natürliche Zahl.", counter: [b, a], notCounter: [[a, b], [a + 1, b]] },
          { text: "Wenn du von einer Zahl etwas abziehst, wird das Ergebnis immer kleiner.", counter: [a, -b], notCounter: [[a, b], [-a, b]] },
        ];
        const claim = rng.pick(claims);
        const op = claim === claims[0] ? "+" : "−";
        const show = ([x, y]: [number, number]) => `${n0(x)} ${op} ${p0(y)}`;
        return task(
          level,
          "",
          `Aussage: „${claim.text}“ Welche Rechnung ist ein Gegenbeispiel?`,
          [pick("Gegenbeispiel:", [show(claim.counter), show(claim.notCounter[0]), show(claim.notCounter[1])], 0)],
          "Rechne jede Möglichkeit aus und vergleiche das Ergebnis mit der Aussage.",
          `${show(claim.counter)} = ${n0(op === "+" ? claim.counter[0] + claim.counter[1] : claim.counter[0] - claim.counter[1])}. Das passt nicht zur Aussage.`,
          `Gegenbeispiel: ${show(claim.counter)}`,
          { a, b },
        );
      },
    },
    {
      id: "wahr-falsch",
      make: (rng, level) => {
        const z = rng.int(2, 25);
        const easy = [
          [`|−${z}| = ${z}`, true, "Der Betrag ist der Abstand zur Null."],
          [`|−${z}| = −${z}`, false, "Ein Betrag ist nie negativ."],
          [`Die Gegenzahl von −${z} ist ${z}.`, true, "Gleicher Abstand, andere Seite der Null."],
          ["Der Betrag einer Zahl kann negativ sein.", false, "Ein Abstand ist nie negativ."],
          ["Die Null hat kein Vorzeichen.", true, "Die 0 ist weder positiv noch negativ."],
          ["Jede ganze Zahl ist entweder positiv oder negativ.", false, "Die 0 ist ein Gegenbeispiel."],
        ] as const;
        const hard = [
          ["Jede natürliche Zahl ist auch eine ganze Zahl.", true, "ℕ ist ein Teil von ℤ."],
          ["Jede ganze Zahl ist auch eine natürliche Zahl.", false, "Gegenbeispiel: −1."],
          ["Es gibt eine kleinste ganze Zahl.", false, "Zu jeder ganzen Zahl n ist n − 1 noch kleiner."],
          ["Es gibt eine kleinste natürliche Zahl.", true, "Die kleinste natürliche Zahl ist 1."],
          ["Zwei verschiedene Zahlen können denselben Betrag haben.", true, `Zum Beispiel ${z} und −${z}.`],
          ["Jede ganze Zahl hat genau eine Gegenzahl.", true, "Auf der anderen Seite der Null gibt es im selben Abstand genau einen Punkt."],
          ["Die Gegenzahl einer Zahl ist immer negativ.", false, `Gegenbeispiel: Die Gegenzahl von −${z} ist ${z}.`],
        ] as const;
        const pool: ReadonlyArray<readonly [string, boolean, string]> = level === 1 ? easy : hard;
        const [claim, truth, why] = rng.pick(pool);
        return task(
          level,
          `Stimmt diese Aussage über ganze Zahlen? ${claim}`,
          `Prüfe die Aussage und begründe mit einem Gegenbeispiel, falls sie falsch ist: ${claim}`,
          [pick("Die Aussage ist …", ["wahr", "falsch"], truth ? 0 : 1)],
          "Prüfe die Begriffe, und denke auch an die 0 und an negative Zahlen.",
          why,
          truth ? "Die Aussage ist wahr." : "Die Aussage ist falsch.",
          { z },
        );
      },
    },
  ],
});

const schriftlich = L2(10, {
  id: "nz-10-schriftlich",
  title: "1.10 Schriftlich rechnen über einer Million",
  subtitle: "Addieren, subtrahieren und die Größenordnung prüfen",
  whyItMatters:
    "Die Verfahren aus der Grundschule funktionieren auch bei großen Zahlen. Ein Überschlag zeigt dir, ob dein Ergebnis überhaupt stimmen kann.",
  explanationHtml: `<p>Schreibe die Zahlen <strong>stellengerecht</strong> untereinander: Einer unter Einer, Zehner unter Zehner. Rechne von rechts nach links. Beim Addieren entsteht ein <strong>Übertrag</strong>, beim Subtrahieren musst du entbündeln oder ergänzen.</p><p>Danach prüfst du die <strong>Größenordnung</strong> durch Abschätzen: Runde die Zahlen auf eine Stelle und rechne im Kopf. Liegt dein Ergebnis weit daneben, suche den Fehler.</p><div class="example">4.587.420 + 2.319.750: stellengerecht rechnen ergibt 6.907.170. Überschlag: 5 Millionen + 2 Millionen = 7 Millionen. Das passt.</div><div class="merke"><strong>Merke:</strong> Stellengerecht schreiben, von rechts rechnen, mit einem Überschlag prüfen.</div>`,
  formulas: [
    { name: "Fachbegriffe", html: "Summand + Summand = Summe; Minuend − Subtrahend = Differenz", quantities: "Die Namen der Zahlen beim Rechnen" },
    { name: "Überschlag", html: "Runden, im Kopf rechnen, vergleichen", quantities: "Prüft die Größenordnung" },
  ],
  quiz: {
    question: "Lena rechnet 3.912.000 + 2.150.000 und erhält 8.062.000. Was zeigt der Überschlag?",
    options: [
      "4 Millionen + 2 Millionen = 6 Millionen, also stimmt ihr Ergebnis nicht.",
      "4 Millionen + 2 Millionen = 8 Millionen, also stimmt es.",
      "Man kann das nur mit dem Taschenrechner prüfen.",
    ],
    correctIndex: 0,
    explanation: "Das Ergebnis liegt bei rund 6 Millionen, nicht bei 8 Millionen. Sie hat sich an der Millionenstelle verrechnet.",
  },
  lab: lab(
    "written-calc",
    "Rechnen in Spalten",
    "Stelle zwei Zahlen über einer Million ein. Die App zeigt das Ergebnis mit Überträgen.",
    [
      c("op", "Rechenart", ["Addition", "Subtraktion"]),
      r("am", "Millionen der ersten Zahl", 1, 9, 2),
      r("at", "Tausender der ersten Zahl", 0, 999, 300),
      r("bm", "Millionen der zweiten Zahl", 1, 9, 1),
      r("bt", "Tausender der zweiten Zahl", 0, 999, 200),
    ],
    [
      o("ergebnis", "Ergebnis", (v) => {
        const a = bigNumber(v.am, v.at, 475), b = bigNumber(v.bm, v.bt, 268);
        return n0(v.op === 0 ? a + b : a - b);
      }),
      o("ueberschlag", "Überschlag", (v) => `${n0(v.am + (v.at >= 500 ? 1 : 0))} Mio. ${v.op === 0 ? "+" : "−"} ${n0(v.bm + (v.bt >= 500 ? 1 : 0))} Mio.`),
    ],
    [
      { id: "zehn-millionen", text: "Wähle eine Addition, deren Summe über 10 Millionen liegt.", check: (v) => v.op === 0 && bigNumber(v.am, v.at, 475) + bigNumber(v.bm, v.bt, 268) > 10_000_000 },
      { id: "uebertrag-tausend", text: "Wähle eine Subtraktion, bei der der Tausenderteil der zweiten Zahl größer ist als der der ersten.", check: (v) => v.op === 1 && v.am > v.bm && v.bt > v.at },
      { id: "fast-gleich", text: "Wähle eine Subtraktion mit Ergebnis unter 1 Million.", check: (v) => { const d = bigNumber(v.am, v.at, 475) - bigNumber(v.bm, v.bt, 268); return v.op === 1 && d >= 0 && d < 1_000_000; } },
    ],
  ),
  exercises: [
    {
      id: "spalten",
      make: (rng, level) => {
        const a = rng.int(2_000_000, 9_000_000) + rng.int(0, 999);
        const b = rng.int(1_000_000, 1_900_000) + rng.int(0, 999);
        if (level === 1) {
          const plus = rng.int(0, 1) === 0;
          const value = plus ? a + b : a - b;
          return task(
            level,
            `Berechne schriftlich: ${n0(a)} ${plus ? "+" : "−"} ${n0(b)}.`,
            "",
            [num("Ergebnis:", value, "", 0)],
            "Stellengerecht untereinander schreiben, von rechts nach links rechnen.",
            `Überschlag: rund ${n0(roundTo(a, 1_000_000))} ${plus ? "+" : "−"} ${n0(roundTo(b, 1_000_000))}.`,
            `Das Ergebnis ist ${n0(value)}.`,
            { a, b },
          );
        }
        const city = rng.int(1_100_000, 1_600_000), more = rng.int(100_000, 900_000);
        return task(
          level,
          "",
          `In einem Jahr fahren ${n0(city + more)} Menschen mit einer Bahnlinie, im Folgejahr sind es ${n0(city)}. Um wie viele Fahrgäste ist die Zahl gesunken?`,
          [num("Weniger:", more, "", 0)],
          "Subtrahiere die kleinere von der größeren Zahl.",
          `${n0(city + more)} − ${n0(city)} = ${n0(more)}.`,
          `Die Zahl ist um ${n0(more)} gesunken.`,
          { city, more },
        );
      },
    },
    {
      id: "ueberschlag",
      make: (rng, level) => {
        const a = rng.int(2, 8) * 1_000_000 + rng.int(100, 400) * 1000 + rng.int(1, 999);
        const b = rng.int(1, 5) * 1_000_000 + rng.int(100, 400) * 1000 + rng.int(1, 999);
        const exact = a + b;
        const rough = roundTo(a, 1_000_000) + roundTo(b, 1_000_000);
        if (level === 1)
          return task(
            level,
            `Runde beide Zahlen auf Millionen und überschlage: ${n0(a)} + ${n0(b)}.`,
            "",
            [num("Überschlag:", rough, "", 0)],
            "Erst beide Zahlen runden, dann im Kopf addieren.",
            `${n0(a)} ≈ ${n0(roundTo(a, 1_000_000))} und ${n0(b)} ≈ ${n0(roundTo(b, 1_000_000))}.`,
            `Der Überschlag ist ${n0(rough)}.`,
            { a, b },
          );
        const wrong = rng.int(0, 1) === 0;
        const claimed = wrong ? exact * 10 : exact;
        return task(
          level,
          "",
          `Tom rechnet ${n0(a)} + ${n0(b)} und erhält ${n0(claimed)}. Kann das nach einem Überschlag stimmen?`,
          [pick("Sein Ergebnis …", ["kann stimmen", "kann nicht stimmen"], wrong ? 1 : 0)],
          "Runde auf Millionen und vergleiche die Größenordnung.",
          `Überschlag: ${n0(rough)}. Toms Ergebnis ist ${n0(claimed)}.`,
          wrong ? "Sein Ergebnis kann nicht stimmen: Es ist etwa 10-mal zu groß." : "Sein Ergebnis kann stimmen: Die Größenordnung passt.",
          { a, b },
        );
      },
    },
  ],
});

const summen = L2(11, {
  id: "nz-11-summen",
  title: "1.11 Summen ganzer Zahlen",
  subtitle: "Guthaben, Schulden, Vorzeichen und Rechenzeichen",
  whyItMatters:
    "Kontostände und Temperaturen ändern sich ständig. Mit einer klaren Vorstellung von Guthaben und Schulden rechnest du sicher mit negativen Zahlen.",
  explanationHtml: `<p>Stell dir eine Zahl als Kontostand vor: Positive Zahlen sind <strong>Guthaben</strong>, negative Zahlen <strong>Schulden</strong>. Beim Addieren kommt etwas dazu: 5 + (−8) heißt „5 € Guthaben, dazu 8 € Schulden“, zusammen −3.</p><p><strong>Gleiche Vorzeichen:</strong> Beträge addieren, das Vorzeichen bleibt. <strong>Verschiedene Vorzeichen:</strong> kleineren vom größeren Betrag abziehen, das Ergebnis erhält das Vorzeichen der Zahl mit dem größeren Betrag.</p><p>Unterscheide klar: Das <strong>Rechenzeichen</strong> sagt, was du rechnest. Das <strong>Vorzeichen</strong> gehört zur Zahl. Steht beides nebeneinander, kommt eine Klammer: 5 + (−8).</p><div class="example">(−7) + (−5) = −12. (−7) + 5 = −2. 7 + (−5) = 2.</div><div class="merke"><strong>Merke:</strong> Gleiche Vorzeichen: Beträge addieren. Verschiedene Vorzeichen: Beträge subtrahieren. Das Vorzeichen des größeren Betrags gewinnt.</div>`,
  formulas: [
    { name: "Gleiche Vorzeichen", html: "(−7) + (−5) = −12", quantities: "Beträge addieren, Vorzeichen bleibt" },
    { name: "Verschiedene Vorzeichen", html: "(−7) + 5 = −2", quantities: "Beträge subtrahieren, Vorzeichen des größeren Betrags" },
  ],
  quiz: {
    question: "Was ist (−12) + 5?",
    options: ["−7", "7", "−17"],
    correctIndex: 0,
    explanation: "Verschiedene Vorzeichen: 12 − 5 = 7. Der größere Betrag gehört zu −12, also ist das Ergebnis −7.",
  },
  lab: lab(
    "account",
    "Konto im Blick",
    "Stelle Kontostand und Buchung ein. Der Pfeil zeigt, wie sich der Stand ändert.",
    [
      r("s", "Kontostand vorher", -50, 50, 20),
      c("op", "Rechenzeichen", ["plus", "minus"]),
      r("c", "Zahl", -50, 50, 10),
    ],
    [o("neu", "Neuer Stand", (v) => n0(v.s + (v.op === 0 ? v.c : -v.c)), "€")],
    [
      { id: "ins-minus", text: "Starte mit 20 € Guthaben und addiere −30 €.", check: (v) => v.s === 20 && v.op === 0 && v.c === -30 },
      { id: "tiefer", text: "Starte mit 15 € Schulden und addiere noch einmal 15 € Schulden.", check: (v) => v.s === -15 && v.op === 0 && v.c === -15 },
      { id: "null", text: "Starte mit 40 € Schulden und addiere so viel, dass das Konto genau bei 0 € steht.", check: (v) => v.s === -40 && v.op === 0 && v.c === 40 },
    ],
  ),
  exercises: [
    {
      id: "summe",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.sign() * rng.int(3, 60), b = rng.sign() * rng.int(3, 60);
          return task(
            level,
            `Berechne den Wert der Summe ${p0(a)} + ${p0(b)}.`,
            "",
            [num("Summe:", a + b, "", 0, { slips: [{ value: -(a + b), hint: "Der Betrag stimmt, aber prüfe das Vorzeichen." }] })],
            "Gleiche Vorzeichen: Beträge addieren. Verschiedene Vorzeichen: Beträge subtrahieren.",
            Math.sign(a) === Math.sign(b)
              ? `Gleiche Vorzeichen: ${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(a) + Math.abs(b)}.`
              : a + b === 0
                ? "Die Beträge sind gleich: Zahl und Gegenzahl ergeben 0."
                : `Verschiedene Vorzeichen: Der Unterschied der Beträge ist ${Math.abs(Math.abs(a) - Math.abs(b))}.`,
            `Das Ergebnis ist ${n0(a + b)}.`,
            { a, b },
          );
        }
        const start = rng.int(10, 80), out = start + rng.int(10, 60), income = rng.int(5, 90);
        const end = start - out + income;
        return task(
          level,
          "",
          `Auf Bens Konto sind ${start} €. Er bezahlt ein Ticket für ${out} € und bekommt danach ${income} € Taschengeld. Wie hoch ist der Kontostand jetzt?`,
          [num("Kontostand:", end, "€", 0)],
          "Rechne die beiden Buchungen nacheinander.",
          `${start} − ${out} = ${n0(start - out)}, dann ${p0(start - out)} + ${income} = ${n0(end)}.`,
          `Der Kontostand ist ${n0(end)} €.`,
          { start, out, income },
        );
      },
    },
    {
      id: "vor-rechenzeichen",
      make: (rng, level) => {
        const a = rng.int(2, 40), b = rng.int(2, 40);
        if (level === 1) {
          const first = rng.int(0, 1) === 0;
          return task(
            level,
            `In ${a} − (−${b}) stehen zwei Minuszeichen. Was ist das ${first ? "erste" : "zweite"} Minus?`,
            "",
            [pick("Es ist ein …", ["Rechenzeichen", "Vorzeichen"], first ? 0 : 1)],
            "Das Rechenzeichen verbindet zwei Zahlen. Das Vorzeichen gehört zu einer Zahl.",
            first ? "Das erste Minus verbindet die Zahlen und sagt: subtrahieren." : `Das zweite Minus gehört zur Zahl −${b}.`,
            first ? "Das erste Minus ist ein Rechenzeichen." : "Das zweite Minus ist ein Vorzeichen.",
            { a, b },
          );
        }
        const cellar = rng.int(1, 3), up = rng.int(3, 14), down = rng.int(2, up);
        return task(
          level,
          "",
          `Ein Fahrstuhl steht im Stockwerk −${cellar}. Er fährt ${up} Stockwerke nach oben und dann ${down} Stockwerke nach unten. Schreibe das als Summe und nenne das Stockwerk.`,
          [num("Stockwerk:", -cellar + up - down, "", 0)],
          "Nach oben ist positiv, nach unten negativ.",
          `(−${cellar}) + ${up} + (−${down}) = ${n0(-cellar + up - down)}.`,
          `Der Fahrstuhl steht im Stockwerk ${n0(-cellar + up - down)}.`,
          { cellar, up, down },
        );
      },
    },
  ],
});

const differenzen = L2(12, {
  id: "nz-12-differenzen",
  title: "1.12 Differenzen ganzer Zahlen",
  subtitle: "Subtrahieren heißt: die Gegenzahl addieren",
  whyItMatters:
    "Was bedeutet 5 − (−3)? Schulden wegnehmen macht reicher. Die Regel dazu macht jede Subtraktion zu einer Addition.",
  explanationHtml: `<p>Eine Zahl subtrahieren bedeutet dasselbe wie ihre <strong>Gegenzahl addieren</strong>: a − b = a + (−b). Das passt zum Konto: Wenn dir jemand 3 € Schulden wegnimmt, hast du 3 € mehr. Also ist 5 − (−3) = 5 + 3 = 8.</p><p>Auf der Zahlengeraden zeigt der Pfeil beim Subtrahieren einer positiven Zahl nach links, beim Subtrahieren einer negativen Zahl nach rechts. Bei geeigneten Zahlen rechnest du das im Kopf.</p><div class="example">−4 − 6 = −4 + (−6) = −10. −4 − (−6) = −4 + 6 = 2. 3 − 10 = −7.</div><div class="merke"><strong>Merke:</strong> a − b = a + (−b). Subtrahieren einer negativen Zahl macht größer.</div>`,
  formulas: [
    { name: "Differenz als Summe", html: "a − b = a + (−b)", quantities: "Subtrahieren: Gegenzahl addieren" },
  ],
  quiz: {
    question: "Was ist −5 − (−8)?",
    options: ["3", "−13", "−3"],
    correctIndex: 0,
    explanation: "−5 − (−8) = −5 + 8 = 3.",
  },
  lab: lab(
    "int-add",
    "Pfeil auf der Zahlengeraden",
    "Stelle eine Startzahl, das Rechenzeichen und eine zweite Zahl ein. Der Pfeil zeigt die Richtung.",
    [r("a", "Startzahl", -15, 15, 2), c("op", "Rechenzeichen", ["plus", "minus"]), r("b", "Zweite Zahl", -15, 15, 3)],
    [
      o("ergebnis", "Ergebnis", (v) => n0(v.op === 0 ? v.a + v.b : v.a - v.b)),
      o("als-summe", "Als Summe", (v) => `${n0(v.a)} + ${p0(v.op === 0 ? v.b : -v.b)}`),
    ],
    [
      { id: "minus-minus", text: "Stelle 5 − (−3) ein: Der Pfeil zeigt nach rechts.", check: (v) => v.a === 5 && v.op === 1 && v.b === -3 },
      { id: "unter-null", text: "Stelle 3 − 10 ein: Das Ergebnis liegt unter null.", check: (v) => v.a === 3 && v.op === 1 && v.b === 10 },
      { id: "gleich", text: "Stelle −4 − (−4) ein.", check: (v) => v.a === -4 && v.op === 1 && v.b === -4 },
    ],
  ),
  exercises: [
    {
      id: "differenz",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.sign() * rng.int(2, 40), b = rng.sign() * rng.int(2, 40);
          return task(
            level,
            `Berechne den Wert der Differenz ${n0(a)} − ${p0(b)}.`,
            "",
            [num("Differenz:", a - b, "", 0, { slips: [{ value: a + b, hint: "Du hast addiert. Subtrahieren heißt: die Gegenzahl addieren." }] })],
            "a − b = a + (−b)",
            `${n0(a)} − ${p0(b)} = ${n0(a)} + ${p0(-b)}.`,
            `Das Ergebnis ist ${n0(a - b)}.`,
            { a, b },
          );
        }
        const peak = rng.int(800, 2900), below = rng.int(10, 400);
        return task(
          level,
          "",
          `Ein Gipfel liegt ${n0(peak)} m über dem Meeresspiegel, eine Höhle tief im Meer ${below} m darunter. Berechne den Höhenunterschied als Differenz: ${n0(peak)} − (−${below}).`,
          [num("Höhenunterschied:", peak + below, "m", 0, { slips: [{ value: peak - below, hint: "Beide Orte liegen auf verschiedenen Seiten des Meeresspiegels." }] })],
          "Eine negative Zahl subtrahieren heißt: ihre Gegenzahl addieren.",
          `${n0(peak)} − (−${below}) = ${n0(peak)} + ${below} = ${n0(peak + below)}.`,
          `Der Höhenunterschied ist ${n0(peak + below)} m.`,
          { peak, below },
        );
      },
    },
    {
      id: "temperaturunterschied",
      make: (rng, level) => {
        const low = -rng.int(1, 25), high = rng.int(1, 30);
        if (level === 1)
          return task(
            level,
            `Schreibe ${high} − (${n0(low)}) als Summe und berechne.`,
            "",
            [num("Ergebnis:", high - low, "", 0)],
            "Aus Minus einer negativen Zahl wird Plus ihrer Gegenzahl.",
            `${high} − (${n0(low)}) = ${high} + ${-low}.`,
            `Das Ergebnis ist ${high - low}.`,
            { low, high },
          );
        const askColder = rng.int(0, 1) === 0;
        const change = rng.int(3, 20);
        return task(
          level,
          "",
          askColder
            ? `Am Morgen hat es ${n0(low)} °C. Am Nachmittag ist es ${high - low} Grad wärmer. Welche Temperatur hat es am Nachmittag?`
            : `Am Morgen hat es ${n0(low)} °C. Bis zum Abend wird es noch ${change} Grad kälter. Welche Temperatur hat es am Abend?`,
          [num("Temperatur:", askColder ? high : low - change, "°C", 0)],
          "Wärmer: addieren. Kälter: subtrahieren.",
          askColder ? `${p0(low)} + ${high - low} = ${high}.` : `${n0(low)} − ${change} = ${n0(low - change)}.`,
          `Es hat ${n0(askColder ? high : low - change)} °C.`,
          { low, high, change },
        );
      },
    },
  ],
});

const gleichungenAdd = L2(13, {
  id: "nz-13-gleichungen",
  title: "1.13 Gleichungen mit Plus und Minus",
  subtitle: "Probieren und Umkehraufgabe",
  whyItMatters:
    "„Welche Zahl fehlt?“ Solche Fragen kennst du aus der Grundschule. Mit der Umkehraufgabe löst du sie auch mit negativen Zahlen sicher.",
  explanationHtml: `<p>In einer <strong>Gleichung</strong> steht eine gesuchte Zahl x. Du kannst <strong>systematisch probieren</strong>: Werte einsetzen und vergleichen, wobei du erkennst, ob du höher oder tiefer gehen musst.</p><p>Schneller ist die <strong>Umkehraufgabe</strong>. Für die drei Formen gilt:</p><p>a + x = b führt zu x = b − a. x − a = b führt zu x = b + a. a − x = b führt zu x = a − b.</p><div class="example">−3 + x = 5: x = 5 − (−3) = 8. x − 7 = −2: x = −2 + 7 = 5. 4 − x = 9: x = 4 − 9 = −5. Probe: 4 − (−5) = 9.</div><div class="merke"><strong>Merke:</strong> Bilde die Umkehraufgabe und mache danach die Probe, indem du x einsetzt.</div>`,
  formulas: [
    { name: "a + x = b", html: "x = b − a", quantities: "Umkehraufgabe zur Addition" },
    { name: "x − a = b", html: "x = b + a", quantities: "Umkehraufgabe zur Subtraktion" },
    { name: "a − x = b", html: "x = a − b", quantities: "Der Subtrahend ist gesucht" },
  ],
  quiz: {
    question: "Wie lautet die Umkehraufgabe zu 12 − x = 20?",
    options: ["x = 12 − 20", "x = 20 − 12", "x = 12 + 20"],
    correctIndex: 0,
    explanation: "Bei a − x = b gilt x = a − b, also x = 12 − 20 = −8. Probe: 12 − (−8) = 20.",
  },
  lab: lab(
    "equation-add",
    "Probieren und prüfen",
    "Wähle die Form der Gleichung und ziehe x, bis beide Seiten gleich sind.",
    [
      c("form", "Form", ["a + x = b", "x − a = b", "a − x = b"]),
      r("a", "a", -20, 20, 3),
      r("b", "b", -20, 20, 9),
      r("x", "x", -40, 40, 1),
    ],
    [
      o("links", "Linke Seite", (v) => n0(additiveEquation(v.form, v.a, v.b).left(v.x))),
      o("loesung", "Passt?", (v) => (additiveEquation(v.form, v.a, v.b).left(v.x) === v.b ? "ja" : "noch nicht")),
    ],
    [
      { id: "plus", text: "Löse −3 + x = 5.", check: (v) => v.form === 0 && v.a === -3 && v.b === 5 && v.x === 8 },
      { id: "minus", text: "Löse x − 7 = −2.", check: (v) => v.form === 1 && v.a === 7 && v.b === -2 && v.x === 5 },
      { id: "subtrahend", text: "Löse 4 − x = 9.", check: (v) => v.form === 2 && v.a === 4 && v.b === 9 && v.x === -5 },
    ],
  ),
  exercises: [
    {
      id: "umkehraufgabe",
      make: (rng, level) => {
        const form = rng.int(0, 2);
        const a = rng.sign() * rng.int(2, 30), b = rng.sign() * rng.int(2, 30);
        const equation = additiveEquation(form, a, b);
        const x = equation.solution!;
        if (level === 1)
          return task(
            level,
            `Löse die Gleichung ${equation.text("x")} mit einer Umkehraufgabe.`,
            "",
            [num("x =", x, "", 0, { slips: [{ value: -x, hint: "Prüfe das Vorzeichen durch Einsetzen in die Gleichung." }] })],
            ["a + x = b: x = b − a", "x − a = b: x = b + a", "a − x = b: x = a − b"][form],
            equation.inverse,
            `x = ${n0(x)}`,
            { form, a, b },
          );
        const stories = [
          () => ({ text: `Ein Konto steht bei ${n0(a)} €. Nach einer Buchung von x Euro steht es bei ${n0(b)} €. Welche Zahl ist x?`, solution: b - a, way: `${n0(a)} + x = ${n0(b)}, also x = ${n0(b)} − ${p0(a)}.` }),
          () => ({ text: `Maya denkt sich eine Zahl. Sie subtrahiert ${p0(a)} und erhält ${n0(b)}. Wie heißt die gedachte Zahl?`, solution: b + a, way: `x − ${p0(a)} = ${n0(b)}, also x = ${n0(b)} + ${p0(a)}.` }),
          () => ({ text: `Maya subtrahiert von der Zahl ${n0(a)} eine gedachte Zahl und erhält ${n0(b)}. Wie heißt die gedachte Zahl?`, solution: a - b, way: `${n0(a)} − x = ${n0(b)}, also x = ${n0(a)} − ${p0(b)}.` }),
        ];
        const story = stories[form]();
        return task(
          level,
          "",
          story.text,
          [num("x =", story.solution, "", 0)],
          "Stelle zuerst die Gleichung auf, dann die Umkehraufgabe.",
          story.way,
          `Die gesuchte Zahl ist ${n0(story.solution)}.`,
          { form, a, b },
        );
      },
    },
    {
      id: "probieren",
      make: (rng, level) => {
        const a = rng.int(5, 40), x = rng.int(-12, 12);
        if (level === 1) {
          const b = a + x;
          const options = [x, x + 2, x - 2].map(n0);
          return task(
            level,
            `Welche Zahl löst die Gleichung ${a} + x = ${n0(b)}? Setze ein.`,
            "",
            [pick("x =", options, 0)],
            "Setze die Zahlen nacheinander für x ein.",
            `${a} + ${p0(x)} = ${n0(b)}.`,
            `x = ${n0(x)}`,
            { a, x },
          );
        }
        const b = a - x;
        return task(
          level,
          "",
          `Lukas probiert bei ${a} − x = ${n0(b)}: Mit x = ${n0(x + 3)} erhält er ${n0(a - x - 3)}. Das ist zu ${b > a - x - 3 ? "klein" : "groß"}. Welche Zahl ist die Lösung?`,
          [num("x =", x, "", 0, { slips: [{ value: x + 6, hint: "Je größer x wird, desto kleiner wird die linke Seite. Du bist in die falsche Richtung gegangen." }] })],
          "Wenn x größer wird, wird der Wert von a − x kleiner.",
          `Umkehraufgabe: x = ${a} − ${p0(b)} = ${n0(x)}.`,
          `x = ${n0(x)}`,
          { a, x },
        );
      },
    },
  ],
});

const rechenvorteile = L2(14, {
  id: "nz-14-rechenvorteile",
  title: "1.14 Rechenvorteile beim Addieren",
  subtitle: "Kommutativgesetz, Assoziativgesetz und die Differenz als Summe",
  whyItMatters:
    "27 − 13 + 23 − 7 sieht sperrig aus. Geschickt geordnet rechnest du es im Kopf.",
  explanationHtml: `<p><strong>Kommutativgesetz:</strong> Summanden darfst du vertauschen: a + b = b + a. <strong>Assoziativgesetz:</strong> Summanden darfst du beliebig zusammenfassen: (a + b) + c = a + (b + c).</p><p>Für Differenzen gelten diese Gesetze nicht: 7 − 3 ist nicht 3 − 7. Aber jede Differenz kannst du als Summe auffassen: a − b = a + (−b). Dann darfst du vertauschen, wobei das Vorzeichen bei der Zahl bleibt.</p><div class="example">27 − 13 + 23 − 7 = 27 + 23 + (−13) + (−7) = 50 + (−20) = 30.</div><div class="merke"><strong>Merke:</strong> Schreibe Differenzen als Summen, dann ordne so, dass runde Zwischenergebnisse entstehen. Jede Zahl nimmt ihr Vorzeichen mit.</div>`,
  formulas: [
    { name: "Kommutativgesetz", html: "a + b = b + a", quantities: "Summanden vertauschen" },
    { name: "Assoziativgesetz", html: "(a + b) + c = a + (b + c)", quantities: "Summanden zusammenfassen" },
  ],
  quiz: {
    question: "Welche Umformung von 15 − 8 + 5 ist richtig?",
    options: ["15 + 5 + (−8)", "15 + 8 + 5", "8 − 15 + 5"],
    correctIndex: 0,
    explanation: "15 − 8 + 5 = 15 + (−8) + 5. Die Zahl −8 behält beim Vertauschen ihr Vorzeichen.",
  },
  lab: lab(
    "regroup",
    "Geschickt ordnen",
    "Wähle eine Rechnung und vergleiche beide Reihenfolgen. Runde Zwischenergebnisse leuchten grün.",
    [c("term", "Rechnung", ["27 − 13 + 23 − 7", "−48 + 95 − 52 + 5", "64 + 17 − 14 − 7 + 40"]), c("order", "Reihenfolge", ["wie gegeben", "geschickt geordnet"])],
    [
      o("ergebnis", "Ergebnis", (v) => n0(REGROUP_TERMS[v.term].reduce((s, n) => s + n, 0))),
      o("runde", "Runde Zwischenergebnisse", (v) => regroupSteps(REGROUP_TERMS[v.term], v.order === 1).filter((s) => s % 10 === 0).length),
    ],
    [
      { id: "erste", text: "Ordne die Rechnung 27 − 13 + 23 − 7 geschickt.", check: (v) => v.term === 0 && v.order === 1 },
      { id: "zweite", text: "Ordne die Rechnung −48 + 95 − 52 + 5 geschickt.", check: (v) => v.term === 1 && v.order === 1 },
      { id: "dritte", text: "Sieh dir die dritte Rechnung geschickt geordnet an.", check: (v) => v.term === 2 && v.order === 1 },
    ],
  ),
  exercises: [
    {
      id: "geschickt-rechnen",
      make: (rng, level) => {
        const t = rng.pick([20, 30, 40, 50, 60]);
        const a = rng.int(11, t - 11), b = rng.int(3, 19);
        const c1 = t - a;
        if (level === 1)
          return task(
            level,
            `Rechne geschickt und im Kopf: ${a} + ${b} + ${c1}.`,
            "",
            [num("Summe:", a + b + c1, "", 0)],
            `Fasse die zwei Zahlen zusammen, die eine runde Summe ergeben: ${a} + ${c1}.`,
            `${a} + ${c1} = ${t}, dann ${t} + ${b} = ${t + b}.`,
            `Das Ergebnis ist ${t + b}.`,
            { a, b },
          );
        const out = rng.int(11, 39), out2 = rng.pick([50, 60, 70, 80, 100]) - out;
        const start = rng.int(12, 45);
        const total = start - out - out2 + 150;
        return task(
          level,
          "",
          `Klassenkasse: Anfangsstand ${start} €, Ausgabe für Bastelzeug ${out} €, Einnahme vom Kuchenverkauf 150 €, Ausgabe für den Ausflug ${out2} €. Wie hoch ist der neue Stand? Fasse die Ausgaben geschickt zusammen.`,
          [num("Stand:", total, "€", 0)],
          "Ausgaben sind negative Summanden. Fasse sie zusammen.",
          `Ausgaben zusammen: ${out} + ${out2} = ${out + out2}. Also ${start} + 150 − ${out + out2} = ${total}.`,
          `Der neue Stand ist ${n0(total)} €.`,
          { start, out, out2 },
        );
      },
    },
    {
      id: "differenz-als-summe",
      make: (rng, level) => {
        const a = rng.int(12, 60), b = rng.int(3, 30), c1 = rng.int(2, 20);
        if (level === 1)
          return task(
            level,
            `Schreibe ${a} − ${b} als Summe: ${a} + (?). Welche Zahl gehört in die Klammer?`,
            "",
            [num("In die Klammer:", -b, "", 0, { slips: [{ value: b, hint: "Die Zahl behält ihr Minuszeichen als Vorzeichen." }] })],
            "a − b = a + (−b)",
            `${a} − ${b} = ${a} + (−${b}).`,
            `In die Klammer gehört −${b}.`,
            { a, b },
          );
        const claims = [
          [`${a} − ${b} − ${c1} = ${a} − ${c1} − ${b}`, true, "Beide Seiten sind die Summe aus denselben Zahlen, nur vertauscht."],
          [`${a} − ${b} = ${b} − ${a}`, false, "Das Kommutativgesetz gilt nicht für Differenzen: Die Ergebnisse sind Gegenzahlen."],
          [`(${a} − ${b}) − ${c1} = ${a} − (${b} − ${c1})`, false, "Das Assoziativgesetz gilt nicht für Differenzen: Rechts wird etwas Anderes abgezogen."],
          [`${a} + ${b} − ${c1} = ${a} − ${c1} + ${b}`, true, "Jede Zahl behält ihr Vorzeichen, die Reihenfolge ändert sich."],
        ] as const;
        const [claim, truth, why] = rng.pick(claims);
        return task(
          level,
          "",
          `Stimmt die Gleichung, ohne dass du alles ausrechnest? ${claim}`,
          [pick("Die Gleichung …", ["stimmt", "stimmt nicht"], truth ? 0 : 1)],
          "Schreibe alles als Summe. Dann darfst du vertauschen, aber nicht einfach Klammern verschieben.",
          why,
          truth ? "Die Gleichung stimmt." : "Die Gleichung stimmt nicht.",
          { a, b, c1 },
        );
      },
    },
  ],
});

const CHAIN: Array<(a: number, b: number, c: number, d: number) => TermNode> = [
  (a, b, c) => ({ op: "−", left: { op: "+", left: a, right: b }, right: c }),
  (a, b, c) => ({ op: "+", left: a, right: { op: "−", left: b, right: c } }),
  (a, b, c, d) => ({ op: "−", left: { op: "+", left: a, right: b }, right: { op: "−", left: c, right: d } }),
];
const termeAdd = L2(15, {
  id: "nz-15-terme",
  title: "1.15 Terme gliedern und berechnen",
  subtitle: "Summe, Differenz, Klammern und klare Rechenschritte",
  whyItMatters:
    "Ein langer Term wird einfach, wenn du seine Struktur erkennst: Was wird zuletzt gerechnet? Daraus folgt auch der Rechenweg.",
  explanationHtml: `<p>Einen Rechenausdruck wie 34 + (−12) − 9 nennt man <strong>Term</strong>. Sein Name richtet sich nach der Rechnung, die du <strong>zuletzt</strong> ausführst: <strong>Summe</strong> aus Summanden oder <strong>Differenz</strong> aus Minuend und Subtrahend.</p><p>Klammern rechnest du zuerst, sonst gehst du von links nach rechts vor. Schreibe jeden Schritt in eine neue Zeile oder hinter ein Gleichheitszeichen: Das nennt man fortlaufende Rechnung.</p><div class="example">40 − 7 − (12 + (−5)) ist eine Differenz. Minuend: 40 − 7. Subtrahend: 12 + (−5). Rechnung: = 33 − 7 = 26.</div><div class="merke"><strong>Merke:</strong> Die zuletzt ausgeführte Rechnung gibt dem Term seinen Namen. Klammern zuerst, sonst von links nach rechts.</div>`,
  formulas: [
    { name: "Summe", html: "Summand + Summand", quantities: "Letzte Rechnung ist eine Addition" },
    { name: "Differenz", html: "Minuend − Subtrahend", quantities: "Letzte Rechnung ist eine Subtraktion" },
  ],
  quiz: {
    question: "Wie heißt der Term 25 + (8 − 15)?",
    options: ["Summe", "Differenz", "Produkt"],
    correctIndex: 0,
    explanation: "Die Klammer rechnest du zuerst. Zuletzt addierst du. Also ist der Term eine Summe.",
  },
  lab: lab(
    "term-tree-add",
    "Termbaum",
    "Wähle einen Term. Oben steht die Rechnung, die du zuletzt ausführst. Ziehe den Regler für die Rechenschritte.",
    [
      { type: "choice" as const, key: "term", label: "Term", value: 0, options: ADD_TERMS.map((term, value) => ({ value, label: termText(term) })) },
      r("step", "Rechenschritt", 0, 4, 0),
    ],
    [
      o("art", "Art des Terms", (v) => ({ "+": "Summe", "−": "Differenz" })[(ADD_TERMS[v.term] as { op: "+" | "−" }).op]),
      o("wert", "Wert", (v) => n0(termValue(ADD_TERMS[v.term]))),
    ],
    [
      { id: "erster", text: "Rechne den ersten Term bis zum Ende.", check: (v) => v.term === 0 && v.step >= 2 },
      { id: "zweiter", text: "Rechne den zweiten Term bis zum Ende.", check: (v) => v.term === 1 && v.step >= 2 },
      { id: "dritter", text: "Rechne den dritten Term bis zum Ende.", check: (v) => v.term === 2 && v.step >= 3 },
    ],
  ),
  exercises: [
    {
      id: "term-art",
      make: (rng, level) => {
        const a = rng.int(5, 40), b = rng.int(2, 30), c1 = rng.int(2, 25), d = rng.int(2, 25);
        const term = rng.pick(CHAIN)(a, b, c1, d);
        const node = term as Exclude<TermNode, number>;
        if (level === 1)
          return task(
            level,
            `Wie heißt der Term ${termText(term)}: Summe oder Differenz?`,
            "",
            [pick("Der Term ist eine …", ["Summe", "Differenz"], node.op === "+" ? 0 : 1)],
            "Überlege, welche Rechnung du zuletzt ausführst.",
            `Zuletzt rechnest du ${node.op === "+" ? "plus" : "minus"}.`,
            `Der Term ist eine ${node.op === "+" ? "Summe" : "Differenz"}.`,
            { a, b, c1, d },
          );
        const askLeft = rng.int(0, 1) === 0;
        const part = askLeft ? node.left : node.right;
        const name = askLeft ? (node.op === "+" ? "ersten Summanden" : "Minuenden") : node.op === "+" ? "zweiten Summanden" : "Subtrahenden";
        return task(
          level,
          "",
          `Gliedere den Term ${termText(term)}. Welchen Wert hat sein ${name.replace("ersten", "erster").replace("zweiten", "zweiter").replace("Summanden", "Summand").replace("Minuenden", "Minuend").replace("Subtrahenden", "Subtrahend")}?`,
          [num("Wert:", termValue(part), "", 0)],
          "Suche die Rechnung, die zuletzt kommt. Links und rechts davon stehen die beiden Teile.",
          typeof part === "number" ? `Der Teil ist die Zahl ${n0(part)}.` : `Der Teil ${termText(part)} hat den Wert ${n0(termValue(part))}.`,
          `Der Wert ist ${n0(termValue(part))}.`,
          { a, b, c1, d },
        );
      },
    },
    {
      id: "term-wert",
      make: (rng, level) => {
        const a = rng.int(5, 60), b = rng.int(2, 40), c1 = rng.int(2, 30), d = rng.int(2, 30);
        if (level === 1) {
          const term = rng.pick(CHAIN)(a, b, c1, d);
          const value = termValue(term);
          return task(
            level,
            `Berechne in fortlaufender Rechnung: ${termText(term)}.`,
            "",
            [num("Wert:", value, "", 0)],
            "Klammern zuerst, sonst von links nach rechts.",
            `Rechne die Klammer und danach von links nach rechts.`,
            `Der Wert ist ${n0(value)}.`,
            { a, b, c1, d },
          );
        }
        const value = a + b - (c1 - d);
        return task(
          level,
          "",
          `Subtrahiere von der Summe aus ${a} und ${b} die Differenz aus ${c1} und ${d}. Welchen Wert hat der Term?`,
          [num("Wert:", value, "", 0, { slips: [{ value: a + b - c1 - d, hint: "Die Differenz gehört in eine Klammer, weil du sie als Ganzes subtrahierst." }] })],
          "Schreibe den Term mit Klammern: (a + b) − (c − d).",
          `(${a} + ${b}) − (${c1} − ${d}) = ${a + b} − ${p0(c1 - d)}.`,
          `Der Wert ist ${n0(value)}.`,
          { a, b, c1, d },
        );
      },
    },
  ],
});

export const STAGE_ADDITION = makeStage(
  1,
  "Große Zahlen, Stellenwert, Zahlengerade und Rechnen mit Plus und Minus",
  "#2563eb",
  "🔢",
  [
    unendlich,
    grosseZahlen,
    stellenwert,
    roemisch,
    zahlenstrahl,
    runden,
    negativeZahlen,
    zahlengerade,
    aussagen,
    schriftlich,
    summen,
    differenzen,
    gleichungenAdd,
    rechenvorteile,
    termeAdd,
  ],
);
