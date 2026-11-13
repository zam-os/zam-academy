import { fmt, fmtUnit } from "../exercises/format";
import {
  BANK_YEAR,
  compound,
  effectiveRate,
  factorOf,
  interest,
  yearInterest,
} from "../models";
import {
  circle,
  clipped,
  handle,
  infoBox,
  line,
  open,
  Plot,
  polygon,
  rect,
  text,
  type LabView,
  type Pt,
} from "./svg";
import { legend, legendRow, rail, railHandle, title } from "./view-helpers";

const euro = (value: number) => fmtUnit(value, "€", 2);

// 1.1 Jahreszinsen: 100 Felder sind das Kapital, p davon die Zinsen.
const interestHundred: LabView = {
  render(v) {
    const cell = 21;
    const x0 = 30;
    const y0 = 48;
    const z = yearInterest(v.K, v.p);
    let out =
      open(
        `Hunderterfeld: 100 Felder sind das Kapital ${euro(v.K)}, ${fmt(v.p)} Felder sind die Zinsen ${euro(z)}`,
      ) + title(`${fmt(v.p)} % von ${euro(v.K)} sind ${euro(z)} Zinsen`);
    for (let i = 0; i < 100; i++) {
      const x = x0 + (i % 10) * cell;
      const y = y0 + Math.floor(i / 10) * cell;
      const share = Math.max(0, Math.min(1, v.p - i));
      out += rect(x, y, cell - 2, cell - 2, "lab-fill-a", 'rx="2"');
      if (share > 0)
        out += rect(x, y, (cell - 2) * share, cell - 2, "lab-fill-b", 'rx="2"');
    }
    out += text(x0 + 104, y0 + 220, "100 Felder = 100 % = Kapital K", "lab-text-small", "middle");
    out += infoBox(272, 70, [
      [`100 % = K = ${euro(v.K)}`, "lab-text-a"],
      [`1 % = K : 100 = ${euro(v.K / 100)}`, "lab-text"],
      [`${fmt(v.p)} % = ${fmt(v.p)} · ${euro(v.K / 100)}`, "lab-text"],
      [`Jahreszinsen Z = ${euro(z)}`, "lab-text-b"],
      [`nach 1 Jahr: K + Z = ${euro(v.K + z)}`, "lab-text-ok"],
    ]);
    // Kontostand nach einem Jahr: K und Z hintereinander.
    const scale = 220 / 6000;
    out += rect(272, 196, v.K * scale, 18, "lab-fill-a", 'rx="3"');
    out += rect(272 + v.K * scale, 196, Math.max(2, z * scale * 10), 18, "lab-fill-b", 'rx="3"');
    out += text(272, 232, "Zinsen zehnfach vergrößert angehängt", "lab-text-small");
    out += legend(272, 252, [
      ["lab-fill-a", "Kapital K (Grundwert)"],
      ["lab-fill-b", "Zinsen Z (Prozentwert)"],
    ]);
    return out + rail("p", "Zinssatz p in %", v.p, 0.5, 6, 312) + "</svg>";
  },
  handles: { p: railHandle("p", 0.5, 6) },
};

// 1.2 Monats- und Tageszinsen: Die Zinsen wachsen proportional mit der Zeit.
const interestTime: LabView = {
  render(v) {
    const year = yearInterest(v.K, v.p);
    const z = interest(v.K, v.p, v.t);
    const plot = new Plot(0, 380, 0, year * 1.18, { x: 52, y: 40, w: 440, h: 226 });
    let out =
      open(
        `Zinsen in Abhängigkeit von der Zeit: nach ${fmt(v.t)} Tagen ${euro(z)} von ${euro(year)} Jahreszinsen`,
      ) + title(`${fmt(v.t)} Tage = ${fmt(v.t / 30, 1)} ${v.t === 30 ? "Monat" : "Monate"}: Z = ${euro(year)} · ${fmt(v.t)}/360 = ${euro(z)}`);
    out += rect(plot.box.x, plot.box.y, plot.box.w, plot.box.h, "lab-plot-bg");
    for (let m = 0; m <= 12; m++) {
      const x = plot.X(m * 30);
      out += line(x, plot.box.y, x, plot.box.y + plot.box.h, "lab-grid");
      if (m % 3 === 0)
        out += text(x, plot.box.y + plot.box.h + 14, `${m * 30}`, "lab-text-tick", "middle");
    }
    out += text(plot.box.x + plot.box.w, plot.box.y + plot.box.h + 28, "Tage (1 Monat = 30 Tage)", "lab-text-axis", "end");
    out += line(plot.box.x, plot.Y(year), plot.box.x + plot.box.w, plot.Y(year), "lab-dashed");
    out += text(plot.box.x + 4, plot.Y(year) - 5, `Jahreszinsen ${euro(year)}`, "lab-text-small");
    out += line(plot.X(0), plot.Y(0), plot.X(BANK_YEAR), plot.Y(year), "lab-curve");
    // Zeitanteil auf der Achse, Zinsen als senkrechte Strecke.
    out += rect(plot.X(0), plot.Y(0) - 8, plot.X(v.t) - plot.X(0), 8, "lab-fill-a");
    out += line(plot.X(v.t), plot.Y(0), plot.X(v.t), plot.Y(z), "lab-side-b");
    out += text(plot.X(v.t) + 8, (plot.Y(0) + plot.Y(z)) / 2, `Z = ${euro(z)}`, "lab-text-b");
    out += text(plot.X(0) - 6, plot.box.y + 10, "€", "lab-text-axis", "end");
    out += legendRow(60, 330, [
      ["lab-fill-a", "Zeitanteil t : 360"],
      ["lab-fill-b", "Zinsen für diese Zeit"],
    ]);
    return out + handle("t", plot.X(v.t), plot.Y(z), "Zeitpunkt") + "</svg>";
  },
  handles: {
    t: {
      x: "t",
      drag: (p) => ({ t: ((p.x - 52) / 440) * 380 }),
    },
  },
};

/** Oblique projection for the interest box. */
function obl(x: number, y: number, z: number): Pt {
  return { x: 96 + x + y * 0.55, y: 290 - z - y * 0.45 };
}

// 1.3 Zinsformel umstellen: Die Zinsen sind ein Produkt aus K, p und t.
const interestBox: LabView = {
  render(v) {
    const z = interest(v.K, v.p, v.t);
    const a = (v.K / 6000) * 160;
    const b = (v.p / 5) * 110;
    const c = (v.t / 360) * 190;
    const P = (x: number, y: number, h: number) => obl(x, y, h);
    let out =
      open(
        `Zinsquader: Breite Kapital ${euro(v.K)}, Tiefe Zinssatz ${fmt(v.p)} %, Höhe Zeit ${fmt(v.t)} Tage, Rauminhalt wie die Zinsen ${euro(z)}`,
      ) + title(`Z = K · p/100 · t/360 = ${euro(z)}`);
    out += polygon([P(0, 0, 0), P(a, 0, 0), P(a, 0, c), P(0, 0, c)], "lab-fill-ok");
    out += polygon([P(a, 0, 0), P(a, b, 0), P(a, b, c), P(a, 0, c)], "lab-fill-ok");
    out += polygon([P(0, 0, c), P(a, 0, c), P(a, b, c), P(0, b, c)], "lab-fill-ok");
    out += line(P(0, 0, 0).x, P(0, 0, 0).y, P(a, 0, 0).x, P(a, 0, 0).y, "lab-side-a");
    out += line(P(a, 0, 0).x, P(a, 0, 0).y, P(a, b, 0).x, P(a, b, 0).y, "lab-side-b");
    out += line(P(0, 0, 0).x, P(0, 0, 0).y, P(0, 0, c).x, P(0, 0, c).y, "lab-side-c");
    out += text(P(a / 2, 0, 0).x, P(0, 0, 0).y + 18, `K = ${euro(v.K)}`, "lab-text-a", "middle");
    out += text(P(a, b / 2, 0).x + 8, P(a, b / 2, 0).y + 4, `p = ${fmt(v.p)} %`, "lab-text-b");
    out += text(P(0, 0, c / 2).x - 6, P(0, 0, c / 2).y, `t = ${fmt(v.t)} d`, "lab-text-c", "end");
    out += infoBox(340, 80, [
      ["100 · 360 = 36.000", "lab-text-small"],
      [`K = Z · 36.000 : (p · t)`, "lab-text-a"],
      [`p = Z · 36.000 : (K · t)`, "lab-text-b"],
      [`t = Z · 36.000 : (K · p)`, "lab-text-c"],
      [`Z = ${euro(z)}`, "lab-text-ok"],
    ]);
    out += text(340, 218, "Bleibt Z gleich und wird", "lab-text-small");
    out += text(340, 234, "eine Kante länger, muss", "lab-text-small");
    out += text(340, 250, "eine andere kürzer werden.", "lab-text-small");
    return out + "</svg>";
  },
};

// 1.4 Effektiver Jahreszins: kurze Kosten auf ein ganzes Jahr hochrechnen.
const effective: LabView = {
  render(v) {
    const K = v.K;
    const rows = [
      { name: "A", cost: v.costA, months: v.monthsA, cls: "lab-fill-a", text: "lab-text-a" },
      { name: "B", cost: v.costB, months: v.monthsB, cls: "lab-fill-b", text: "lab-text-b" },
    ];
    let out =
      open(
        `Zwei Angebote für ${euro(K)}: effektiver Jahreszins A ${fmt(effectiveRate(K, v.costA, 30 * v.monthsA))} %, B ${fmt(effectiveRate(K, v.costB, 30 * v.monthsB))} %`,
      ) + title(`Kredit über ${euro(K)}: Kosten auf ein Jahr hochgerechnet`);
    const x0 = 70;
    const w = 380;
    rows.forEach((row, i) => {
      const y = 58 + i * 120;
      const yearly = (row.cost * 12) / row.months;
      out += text(20, y + 18, row.name, `${row.text} lab-text-big`);
      for (let m = 0; m < 12; m++) {
        out += rect(x0 + (m * w) / 12, y, w / 12 - 2, 26, "lab-cell", 'rx="2"');
      }
      for (let start = 0; start < 12; start += row.months) {
        const len = Math.min(row.months, 12 - start);
        out += rect(x0 + (start * w) / 12, y, (len * w) / 12 - 2, 26, row.cls, 'rx="3"');
        out += text(x0 + ((start + len / 2) * w) / 12, y + 18, len === row.months ? `${fmt(row.cost)} €` : "…", "lab-text-small", "middle");
      }
      out += text(x0, y + 46, `${fmt(row.cost)} € für ${row.months} ${row.months === 1 ? "Monat" : "Monate"} → im Jahr ${fmt(row.cost)} € · 12/${row.months} = ${euro(yearly)}`, "lab-text-small");
      const eff = effectiveRate(K, row.cost, row.months * 30);
      out += rect(x0, y + 58, Math.min(w, (eff / 40) * w), 16, row.cls, 'rx="3"');
      out += text(x0 + Math.min(w, (eff / 40) * w) + 8, y + 71, `${fmt(eff, 2)} % effektiv`, row.text);
    });
    out += text(x0, 318, "Monate eines Jahres: jedes Kästchen ist ein Monat; Balken unten: 0 bis 40 %.", "lab-text-small");
    return out + "</svg>";
  },
};

// 1.5 Zinseszins: Säulen der Zinsen bis zu jedem Jahr, Zinsen auf Zinsen eigens gefärbt.
const compoundBars: LabView = {
  render(v) {
    const n = v.n;
    const simple = yearInterest(v.K0, v.p);
    const final = compound(v.K0, v.p, n);
    const top = Math.max(final - v.K0, simple) * 1.15;
    const x0 = 70;
    const y0 = 262;
    const h = 200;
    const slot = 420 / (n + 1);
    const bw = Math.min(34, slot * 0.7);
    const Y = (value: number) => y0 - (value / top) * h;
    let out =
      open(
        `Zinsen bis zu den Jahren 1 bis ${n}: Kontostand ${euro(final)} nach ${n} Jahren`,
      ) + title(`${euro(v.K0)} zu ${fmt(v.p)} %: nach ${n} ${n === 1 ? "Jahr" : "Jahren"} ${euro(final)}`);
    out += line(x0 - 6, y0, 500, y0, "lab-axis");
    out += line(x0 - 6, y0, x0 - 6, y0 - h - 8, "lab-axis");
    for (const share of [0.25, 0.5, 0.75, 1]) {
      const value = (top / 1.15) * share;
      out += line(x0 - 6, Y(value), 500, Y(value), "lab-grid");
      out += text(x0 - 10, Y(value) + 4, fmt(value, 0), "lab-text-tick", "end");
    }
    for (let year = 0; year <= n; year++) {
      const cx = x0 + slot * year + slot / 2;
      const all = compound(v.K0, v.p, year) - v.K0;
      const plain = simple * year;
      if (year > 0) {
        out += rect(cx - bw / 2, Y(plain), bw, y0 - Y(plain), "lab-fill-b");
        if (all - plain > top / 300)
          out += rect(cx - bw / 2, Y(all), bw, Y(plain) - Y(all), "lab-fill-c");
      }
      out += text(cx, y0 + 14, String(year), "lab-text-tick", "middle");
    }
    out += text(500, y0 + 28, "Jahre", "lab-text-axis", "end");
    out += text(x0 - 6, 50, "Zinsen in €", "lab-text-axis");
    out += legend(84, 302, [
      ["lab-fill-b", `Zinsen ohne Zinseszins: je Jahr ${euro(simple)}`],
      ["lab-fill-c", "Zinsen auf Zinsen"],
    ]);
    out += text(500, 302, `Startkapital ${euro(v.K0)}`, "lab-text-a", "end");
    out += text(500, 320, `+ Zinsen ${euro(final - v.K0)}`, "lab-text-b", "end");
    return out + "</svg>";
  },
};

// 1.6 Zinsfaktor: jedes Jahr mal q, im Vergleich zur Geraden ohne Zinseszins.
const interestFactor: LabView = {
  render(v) {
    const q = factorOf(v.p);
    const end = compound(v.K0, v.p, v.n);
    const top = compound(v.K0, v.p, 20) * 1.08;
    const plot = new Plot(0, 20.5, 0, top, { x: 64, y: 40, w: 430, h: 236 });
    let out =
      open(
        `Kapital mit Zinsfaktor ${fmt(q, 4)}: nach ${v.n} Jahren ${euro(end)}`,
      ) + title(`Kₙ = K₀ · qⁿ = ${euro(v.K0)} · ${fmt(q, 4)}^${v.n} = ${euro(end)}`);
    out += plot.clip("factor-clip");
    out += rect(plot.box.x, plot.box.y, plot.box.w, plot.box.h, "lab-plot-bg");
    for (let year = 0; year <= 20; year += 5) {
      out += line(plot.X(year), plot.box.y, plot.X(year), plot.box.y + plot.box.h, "lab-grid");
      out += text(plot.X(year), plot.box.y + plot.box.h + 14, String(year), "lab-text-tick", "middle");
    }
    out += line(plot.box.x, plot.Y(v.K0), plot.box.x + plot.box.w, plot.Y(v.K0), "lab-dashed");
    out += line(plot.box.x, plot.Y(2 * v.K0), plot.box.x + plot.box.w, plot.Y(2 * v.K0), "lab-grid");
    out += text(plot.box.x + 4, plot.Y(2 * v.K0) - 4, "doppeltes Startkapital", "lab-text-small");
    out += clipped(
      "factor-clip",
      plot.graph((x) => v.K0 + yearInterest(v.K0, v.p) * x, "lab-side-a", 60) +
        plot.graph((x) => compound(v.K0, v.p, x), "lab-curve", 200),
    );
    for (let year = 1; year <= v.n; year++) {
      const a = plot.P(year - 1, compound(v.K0, v.p, year - 1));
      const b = plot.P(year, compound(v.K0, v.p, year));
      out += circle(a.x, a.y, 2.5, "lab-dot-small");
      if (year === v.n) out += circle(b.x, b.y, 2.5, "lab-dot-small");
    }
    out += line(plot.X(v.n), plot.Y(0), plot.X(v.n), plot.Y(end), "lab-side-b");
    out += text(plot.X(v.n) + (v.n > 14 ? -8 : 8), plot.Y(end) - 8, euro(end), "lab-text-b", v.n > 14 ? "end" : "start");
    out += legendRow(70, 330, [
      ["lab-fill-b", "mit Zinseszins: K₀ · qⁿ"],
      ["lab-fill-a", "ohne Zinseszins: K₀ + n · Z"],
    ]);
    return out + handle("n", plot.X(v.n), plot.Y(end), "Laufzeit") + "</svg>";
  },
  handles: {
    n: {
      x: "n",
      drag: (p) => ({ n: ((p.x - 64) / 430) * 20.5 }),
    },
  },
};

/** The relations of lesson 1.7: input factor k → output factor. */
export const RELATIONS = [
  {
    input: "Kapital K",
    output: "Zinsen Z",
    fixed: "p und t fest",
    kind: "proportional",
    f: (k: number) => k,
    sentence: "Je mehr Kapital, desto mehr Zinsen.",
  },
  {
    input: "Zeit t",
    output: "Zinsen Z",
    fixed: "K und p fest",
    kind: "proportional",
    f: (k: number) => k,
    sentence: "Je länger angelegt, desto mehr Zinsen.",
  },
  {
    input: "Zinssatz p",
    output: "nötiges Kapital K",
    fixed: "Z und t fest",
    kind: "umgekehrt proportional",
    f: (k: number) => 1 / k,
    sentence: "Je höher der Zinssatz, desto weniger Kapital braucht man.",
  },
  {
    input: "Laufzeit n (Basis 10 Jahre)",
    output: "Endkapital Kₙ",
    fixed: "Zinseszins, 5 %",
    kind: "weder proportional noch umgekehrt proportional",
    f: (k: number) => 1.05 ** (10 * k) / 1.05 ** 10,
    sentence: "Je länger die Laufzeit, desto mehr Geld, aber nicht im gleichen Verhältnis.",
  },
];

// 1.7 Zusammenhänge sprachlich: Was passiert, wenn eine Größe k-mal so groß wird?
const relationGraph: LabView = {
  render(v) {
    const rel = RELATIONS[v.rel] ?? RELATIONS[0];
    const plot = new Plot(0, 4.3, 0, 4.3, { x: 56, y: 40, w: 250, h: 250 });
    const y = rel.f(v.k);
    let out =
      open(
        `Zusammenhang ${rel.input} und ${rel.output}: mal ${fmt(v.k)} ergibt mal ${fmt(y, 2)}`,
      ) + title(`${rel.input} mal ${fmt(v.k)} → ${rel.output} mal ${fmt(y, 2)}`);
    out += plot.clip("rel-clip");
    out += plot.grid(1, 1, "Faktor bei der Eingabe", "Faktor beim Ergebnis");
    out += clipped("rel-clip", plot.graph(rel.f, "lab-curve", 200));
    const base = plot.P(1, 1);
    out += circle(base.x, base.y, 5, "lab-point-a");
    const at = plot.P(v.k, Math.min(y, 4.3));
    out += line(at.x, plot.Y(0), at.x, at.y, "lab-dashed");
    out += line(plot.X(0), at.y, at.x, at.y, "lab-dashed");
    out += infoBox(326, 78, [
      [rel.input, "lab-text-a"],
      [`→ ${rel.output}`, "lab-text-b"],
      [`(${rel.fixed})`, "lab-text-small"],
      [`mal ${fmt(v.k)} → mal ${fmt(y, 2)}`, "lab-text"],
      [rel.kind, "lab-text-c"],
    ]);
    const words = rel.sentence.split(" ");
    let row = "";
    let lineNo = 0;
    for (const word of words) {
      if ((row + " " + word).length > 30) {
        out += text(326, 214 + lineNo * 16, row.trim(), "lab-text-small");
        row = "";
        lineNo++;
      }
      row += ` ${word}`;
    }
    out += text(326, 214 + lineNo * 16, row.trim(), "lab-text-small");
    out += legend(326, 300, [["lab-fill-a", "Ausgangslage: Faktor 1"]]);
    return out + handle("k", at.x, at.y, "Faktor") + "</svg>";
  },
  handles: {
    k: {
      x: "k",
      drag: (p) => ({ k: ((p.x - 56) / 250) * 4.3 }),
    },
  },
};

export const ZINSEN_VIEWS: Record<string, LabView> = {
  "interest-hundred": interestHundred,
  "interest-time": interestTime,
  "interest-box": interestBox,
  "effective-rate": effective,
  "compound-bars": compoundBars,
  "interest-factor": interestFactor,
  "relation-graph": relationGraph,
};
