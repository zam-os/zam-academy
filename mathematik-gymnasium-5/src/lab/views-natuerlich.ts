import { fmt } from "../exercises/format";
import {
  borrows,
  carries,
  digitSum,
  divisionSteps,
  divisors,
  factorText,
  isPrime,
  primeFactors,
  romanParts,
  roundTo,
  sup,
} from "../models";
import {
  arrow,
  circle,
  handle,
  line,
  open,
  rect,
  text,
  type LabView,
} from "./svg";
import { rail, railHandle, title } from "./view-helpers";

const successor: LabView = {
  render(v) {
    const n = v.digit * 10 ** v.exp;
    const xs = [150, 260, 370];
    return (
      open("Zahlenstrahl mit Vorgänger, Zahl und Nachfolger") +
      title("Zu jeder natürlichen Zahl gibt es einen Nachfolger") +
      arrow(40, 130, 500, 130, "lab-axis", 1.6) +
      xs
        .map(
          (x, i) =>
            line(x, 122, x, 138, "lab-axis") +
            text(x, 160 + (i % 2) * 18, fmt(n - 1 + i, 0), i === 1 ? "lab-text-a" : "lab-text", "middle") +
            text(x, 108, ["Vorgänger", "Zahl", "Nachfolger"][i], "lab-text-small", "middle"),
        )
        .join("") +
      text(480, 118, "… und immer weiter", "lab-text-small", "end") +
      text(260, 225, `${fmt(v.digit, 0)} · ${fmt(10 ** v.exp, 0)} = ${fmt(n, 0)}`, "lab-text-big", "middle") +
      rail("exp", "Anzahl der Nullen", v.exp, 0, 12, 295) +
      "</svg>"
    );
  },
  handles: { exp: railHandle("exp", 0, 12) },
};

const PLACES = ["zm", "m", "ht", "zt", "t", "h", "z", "e"];
const placeX = (i: number) => 50 + i * 60;
const digitY = (d: number) => 240 - d * 19;
const placeValue: LabView = {
  render(v) {
    const number = PLACES.reduce((sum, key) => sum * 10 + v[key], 0);
    let out = open("Stellenwerttafel mit acht Stellen") + title("Stellenwerttafel");
    PLACES.forEach((key, i) => {
      out +=
        rect(placeX(i) - 27, 40, 54, 212, "lab-cell") +
        text(placeX(i), 58, key.toUpperCase(), "lab-text", "middle") +
        line(placeX(i), digitY(0), placeX(i), digitY(9), "lab-thin") +
        text(placeX(i), 272, String(v[key]), "lab-text-big", "middle") +
        handle(key, placeX(i), digitY(v[key]), `Ziffer ${key.toUpperCase()}`);
    });
    return out + text(260, 312, `Die Zahl heißt ${fmt(number, 0)}.`, "lab-text-big", "middle") + "</svg>";
  },
  handles: Object.fromEntries(
    PLACES.map((key) => [
      key,
      { y: key, drag: (p: { x: number; y: number }) => ({ [key]: (240 - p.y) / 19 }) },
    ]),
  ),
};

const SCALES = [1, 10, 100, 1000];
const rayX = (k: number) => 40 + k * 22;
const numberRay: LabView = {
  render(v) {
    const scale = SCALES[v.scale];
    let out =
      open("Zahlenstrahl mit wählbarer Einteilung") +
      title(`Ein Strich bedeutet ${fmt(scale, 0)}`) +
      arrow(30, 150, 505, 150, "lab-axis", 1.6);
    for (let k = 0; k <= 20; k++) {
      const big = k % 5 === 0;
      out += line(rayX(k), big ? 140 : 145, rayX(k), big ? 160 : 155, "lab-axis");
      if (big) out += text(rayX(k), 178, fmt(k * scale, 0), "lab-text-tick", "middle");
    }
    return (
      out +
      text(rayX(v.k), 112, fmt(v.k * scale, 0), "lab-text-big", "middle") +
      handle("k", rayX(v.k), 150, "Punkt auf dem Zahlenstrahl") +
      text(260, 240, v.k * scale < 1000 ? `${fmt(v.k * scale, 0)} < 1.000` : v.k * scale > 1000 ? `${fmt(v.k * scale, 0)} > 1.000` : "1.000 = 1.000", "lab-text", "middle") +
      "</svg>"
    );
  },
  handles: {
    k: { x: "k", drag: (p) => ({ k: (p.x - 40) / 22 }) },
  },
};

const PLACE_VALUES = [10, 100, 1000];
const rounding: LabView = {
  render(v) {
    const place = PLACE_VALUES[v.place];
    const low = Math.floor(v.n / place) * place;
    const high = low + place;
    const x = (value: number) => 65 + (390 * (value - low)) / place;
    const rounded = roundTo(v.n, place);
    return (
      open("Die Zahl zwischen den zwei benachbarten runden Zahlen") +
      title(`Runden auf ${["Zehner", "Hunderter", "Tausender"][v.place]}`) +
      line(65, 130, 455, 130, "lab-axis") +
      rect(65, 118, 195, 24, "lab-fill-a") +
      rect(260, 118, 195, 24, "lab-fill-b") +
      text(65, 165, fmt(low, 0), "lab-text-a", "middle") +
      text(455, 165, fmt(high, 0), "lab-text-b", "middle") +
      text(260, 165, `Mitte ${fmt(low + place / 2, 0)}`, "lab-text-tick", "middle") +
      circle(x(v.n), 130, 7, "lab-point") +
      text(x(v.n), 104, fmt(v.n, 0), "lab-text-big", "middle") +
      text(260, 215, `${fmt(v.n, 0)} ≈ ${fmt(rounded, 0)}`, "lab-text-big", "middle") +
      text(260, 240, rounded === high ? "Ab der Mitte wird aufgerundet." : "Vor der Mitte wird abgerundet.", "lab-text", "middle") +
      rail("n", "Zahl", v.n, 1000, 5000, 295) +
      "</svg>"
    );
  },
  handles: { n: railHandle("n", 1000, 5000) },
};

const romanLab: LabView = {
  render(v) {
    const parts = romanParts(v.n);
    let out = open("Römische Zahl als Zeichenfolge") + title(`${fmt(v.n, 0)} in römischen Zahlzeichen`);
    const signs = parts;
    const width = Math.min(36, 460 / signs.length);
    signs.forEach(([value, sign], i) => {
      const x = 260 + (i - (signs.length - 1) / 2) * width;
      out +=
        rect(x - width / 2 + 1, 70, width - 2, 56, sign.length === 2 ? "lab-fill-b" : "lab-fill-a", 'rx="6"') +
        text(x, 104, sign, width < 26 ? "lab-text" : "lab-text-big", "middle") +
        text(x, 144, fmt(value, 0), "lab-text-tick", "middle");
    });
    return (
      out +
      text(260, 190, signs.map(([value]) => fmt(value, 0)).join(" + "), signs.length > 8 ? "lab-text-small" : "lab-text", "middle") +
      text(260, 228, `${signs.map(([, sign]) => sign).join("")} = ${fmt(v.n, 0)}`, "lab-text-big", "middle") +
      rail("n", "Zahl", v.n, 1, 2000, 295) +
      "</svg>"
    );
  },
  handles: { n: railHandle("n", 1, 2000) },
};

const digitsOf = (n: number, length: number) =>
  String(n).padStart(length, " ").split("");
export const bigNumber = (millions: number, thousands: number, last: number): number =>
  millions * 1_000_000 + thousands * 1000 + last;

const writtenCalc: LabView = {
  render(v) {
    const plus = v.op === 0;
    const a = bigNumber(v.am, v.at, 475);
    const b = bigNumber(v.bm, v.bt, 268);
    const xs = [150, 180, 210, 240, 270, 300, 330, 360];
    const row = (n: number, y: number, cls = "lab-text-big") =>
      digitsOf(n, 8)
        .map((d, i) => (d === " " ? "" : text(xs[i], y, d, cls, "middle")))
        .join("");
    let out = open("Schriftliche Rechnung in Spalten") + title(plus ? "Schriftlich addieren" : "Schriftlich subtrahieren");
    out += row(a, 110) + text(120, 150, plus ? "+" : "−", "lab-text-big", "middle") + row(b, 150) + line(110, 165, 385, 165, "lab-ink");
    const rails = rail("am", "Millionen der ersten Zahl", v.am, 1, 9, 295);
    if (!plus && b > a) {
      return (
        out +
        text(260, 205, "Die zweite Zahl ist größer: Rechne b − a und", "lab-text", "middle") +
        text(260, 228, "setze ein Minus vor das Ergebnis.", "lab-text", "middle") +
        rails +
        "</svg>"
      );
    }
    const marks = plus ? carries(a, b) : borrows(a, b);
    marks.forEach((mark, i) => {
      if (mark && i + 1 < 8) out += text(xs[8 - i - 2] + 11, 82, plus ? "1" : "•", "lab-text-b", "middle");
    });
    out += row(plus ? a + b : a - b, 198);
    out += text(410, 82, plus ? "Übertrag" : "entbündelt", "lab-text-b");
    return out + rails + "</svg>";
  },
  handles: { am: railHandle("am", 1, 9) },
};

const writtenMult: LabView = {
  render(v) {
    let out = open("Schriftliche Multiplikation oder Division in Zeilen");
    if (v.op === 0) {
      const ones = v.b % 10;
      const tens = Math.floor(v.b / 10);
      out +=
        title("Schriftlich multiplizieren") +
        text(260, 70, `${fmt(v.a, 0)} · ${v.b}`, "lab-text-big", "middle") +
        (tens ? text(260, 110, `${fmt(v.a, 0)} · ${tens * 10} = ${fmt(v.a * tens * 10, 0)}`, "lab-text", "middle") : "") +
        text(260, 140, `${fmt(v.a, 0)} · ${ones} = ${fmt(v.a * ones, 0)}`, "lab-text", "middle") +
        line(150, 155, 370, 155, "lab-ink") +
        text(260, 185, `Produkt: ${fmt(v.a * v.b, 0)}`, "lab-text-big", "middle");
    } else {
      const steps = divisionSteps(v.a, v.b);
      out += title("Schriftlich dividieren") + text(260, 66, `${fmt(v.a, 0)} : ${v.b}`, "lab-text-big", "middle");
      steps.forEach((step, i) => {
        out += text(260, 98 + i * 26, `${fmt(step.part, 0)} : ${v.b} = ${step.digit}, Rest ${step.rest}`, "lab-text", "middle");
      });
      out +=
        line(150, 182, 370, 182, "lab-ink") +
        text(260, 212, `Quotient: ${fmt(Math.floor(v.a / v.b), 0)}${v.a % v.b ? `, Rest ${v.a % v.b}` : ", kein Rest"}`, "lab-text-big", "middle");
    }
    return out + rail("a", "Erste Zahl", v.a, 100, 999, 295) + "</svg>";
  },
  handles: { a: railHandle("a", 100, 999) },
};

const laws: LabView = {
  render(v) {
    let out = open("Rechengesetz mit zwei gleichen Ergebnissen");
    if (v.law === 1) {
      out +=
        title("Klammern dürfen bei einem reinen Produkt wandern") +
        text(260, 95, `(${v.a} · ${v.b}) · ${v.c} = ${fmt(v.a * v.b, 0)} · ${v.c} = ${fmt(v.a * v.b * v.c, 0)}`, "lab-text-big", "middle") +
        text(260, 145, `${v.a} · (${v.b} · ${v.c}) = ${v.a} · ${fmt(v.b * v.c, 0)} = ${fmt(v.a * v.b * v.c, 0)}`, "lab-text-big", "middle") +
        text(260, 200, "Rechne zuerst den Teil, der eine runde Zahl ergibt.", "lab-text", "middle");
    } else {
      const s = Math.min(170 / Math.max(v.a, v.b), 12);
      out +=
        title(`${v.a} · ${v.b} = ${v.b} · ${v.a} = ${fmt(v.a * v.b, 0)}`) +
        rect(60, 60, v.a * s, v.b * s, "lab-fill-a") +
        rect(290, 60, v.b * s, v.a * s, "lab-fill-b") +
        text(260, 262, "Gedreht bleibt das Rechteck gleich groß.", "lab-text", "middle");
    }
    return out + rail("a", "a", v.a, 1, 40, 300) + "</svg>";
  },
  handles: { a: railHandle("a", 1, 40) },
};

const power: LabView = {
  render(v) {
    const value = v.base ** v.exp;
    const base = v.base < 0 ? `(−${-v.base})` : String(v.base);
    let out =
      open("Potenz als Produkt gleicher Faktoren") +
      title(`${base}${sup(v.exp)} = ${fmt(value, 0)}`) +
      text(260, 62, Array.from({ length: v.exp }, () => base).join(" · "), "lab-text-big", "middle") +
      text(260, 84, `${v.exp === 1 ? "1 Faktor" : `${v.exp} gleiche Faktoren`}, Basis ${fmt(v.base, 0)}, Exponent ${v.exp}`, "lab-text-small", "middle");
    if (v.exp === 2 && v.base > 0) {
      const cell = 170 / v.base;
      const left = 260 - (v.base * cell) / 2;
      for (let row = 0; row < v.base; row++)
        for (let col = 0; col < v.base; col++)
          out += rect(left + col * cell, 96 + row * cell, cell, cell, "lab-fill-a");
    } else if (v.base < 0) {
      out += text(260, 150, v.exp % 2 === 0 ? "Gerade Anzahl negativer Faktoren: Der Wert ist positiv." : "Ungerade Anzahl negativer Faktoren: Der Wert ist negativ.", "lab-text", "middle");
    } else {
      out += text(260, 170, v.exp === 1 ? "Mit Exponent 1 steht die Basis allein." : "Mit Exponent 2 und positiver Basis siehst du hier ein Quadrat aus Kästchen.", "lab-text", "middle");
    }
    return out + rail("base", "Basis", v.base, -10, 20, 300) + "</svg>";
  },
  handles: { base: railHandle("base", -10, 20) },
};

const powersOfTen: LabView = {
  render(v) {
    const value = v.a * 10 ** v.n;
    return (
      open("Zehnerpotenz und ausgeschriebene Zahl") +
      title("Der Exponent zählt die Nullen") +
      text(260, 95, `${v.a} · 10${sup(v.n)}`, "lab-text-big", "middle") +
      text(260, 140, fmt(value, 0), "lab-text-big", "middle") +
      text(260, 180, `10${sup(v.n)} = 1 mit ${v.n} ${v.n === 1 ? "Null" : "Nullen"}`, "lab-text", "middle") +
      rail("n", "Exponent", v.n, 1, 12, 295) +
      "</svg>"
    );
  },
  handles: { n: railHandle("n", 1, 12) },
};

const divisibility: LabView = {
  render(v) {
    const rules: Array<[number, string]> = [
      [2, "letzte Ziffer gerade"],
      [3, `Quersumme ${digitSum(v.n)}`],
      [5, "letzte Ziffer 0 oder 5"],
      [10, "letzte Ziffer 0"],
    ];
    let out = open("Teilbarkeitsregeln für eine Zahl") + title(`Ist ${fmt(v.n, 0)} teilbar?`);
    rules.forEach(([d, why], i) => {
      const ok = v.n % d === 0;
      const y = 44 + i * 29;
      out +=
        rect(70, y, 380, 25, ok ? "lab-fill-ok" : "lab-cell", 'rx="6"') +
        text(82, y + 17, `durch ${d}`, "lab-text") +
        text(180, y + 17, why, "lab-text-small") +
        text(438, y + 17, ok ? "ja" : "nein", ok ? "lab-text-ok" : "lab-text-muted", "end");
    });
    const list = divisors(v.n).join("; ");
    return (
      out +
      text(260, 240, `Teiler: { ${list} }`, list.length > 52 ? "lab-text-small" : "lab-text", "middle") +
      rail("n", "Zahl", v.n, 2, 300, 298) +
      "</svg>"
    );
  },
  handles: { n: railHandle("n", 2, 300) },
};

const factorTree: LabView = {
  render(v) {
    const factors = primeFactors(v.n);
    let out = open("Primfaktorzerlegung als Baum") + title(isPrime(v.n) ? `${fmt(v.n, 0)} ist eine Primzahl` : `${fmt(v.n, 0)} = ${factorText(v.n)}`);
    let rest = v.n;
    const stepY = Math.min(30, 200 / Math.max(1, factors.length));
    let x = 200;
    factors.slice(0, -1).forEach((p, i) => {
      const y = 48 + i * stepY;
      const next = rest / p;
      out +=
        text(x, y, fmt(rest, 0), "lab-text", "middle") +
        line(x, y + 4, x - 26, y + stepY - 11, "lab-thin") +
        line(x, y + 4, x + 26, y + stepY - 11, "lab-thin") +
        text(x - 30, y + stepY, String(p), "lab-text-b", "middle");
      rest = next;
      x += 26;
    });
    const y = 48 + Math.max(0, factors.length - 1) * stepY;
    out += text(x, y, fmt(rest, 0), factors.length === 1 ? "lab-text-big" : "lab-text-b", "middle");
    return out + rail("n", "Zahl", v.n, 2, 200, 298) + "</svg>";
  },
  handles: { n: railHandle("n", 2, 200) },
};

const combiTree: LabView = {
  render(v) {
    const total = v.t * v.h * v.s;
    const top = 52;
    const height = 215;
    let out = open("Baumdiagramm der Möglichkeiten") + title(`${v.t} · ${v.h} · ${v.s} = ${total} ${total === 1 ? "Möglichkeit" : "Möglichkeiten"}`);
    const y = (index: number, count: number) => top + ((index + 0.5) * height) / count;
    for (let i = 0; i < v.t; i++) {
      const y1 = y(i, v.t);
      out += line(40, top + height / 2, 170, y1, "lab-thin");
      for (let j = 0; j < v.h; j++) {
        const y2 = y(i * v.h + j, v.t * v.h);
        out += line(170, y1, 300, y2, "lab-thin");
        for (let k = 0; k < v.s; k++) {
          const y3 = y((i * v.h + j) * v.s + k, total);
          out += line(300, y2, 430, y3, "lab-thin") + circle(430, y3, total > 24 ? 2 : 3.5, "lab-point-a");
        }
        out += circle(300, y2, 3, "lab-dot-small");
      }
      out += circle(170, y1, 4, "lab-dot-small") + text(170, y1 - 8, `T${i + 1}`, "lab-text-small", "middle");
    }
    return (
      out +
      circle(40, top + height / 2, 5, "lab-dot-small") +
      text(170, 46, "T-Shirt", "lab-text-small", "middle") +
      text(300, 46, "Hose", "lab-text-small", "middle") +
      text(430, 46, "Schuhe", "lab-text-small", "middle") +
      rail("t", "T-Shirts", v.t, 1, 4, 305) +
      "</svg>"
    );
  },
  handles: { t: railHandle("t", 1, 4) },
};

export const NATUERLICH_VIEWS: Record<string, LabView> = {
  successor,
  "place-value": placeValue,
  "number-ray": numberRay,
  rounding,
  roman: romanLab,
  "written-calc": writtenCalc,
  "written-mult": writtenMult,
  laws,
  power,
  "powers-of-ten": powersOfTen,
  divisibility,
  "factor-tree": factorTree,
  "combi-tree": combiTree,
};
