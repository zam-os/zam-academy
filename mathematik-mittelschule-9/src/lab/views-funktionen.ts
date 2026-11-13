import { fmt, linear } from "../exercises/format";
import {
  circle,
  clipped,
  handle,
  infoBox,
  line,
  open,
  Plot,
  rect,
  text,
  type LabView,
} from "./svg";
import { legendRow, title } from "./view-helpers";

/** The situations of lesson 8.1: each a rule y(x) with the lab's m and t. */
export const SITUATIONS = [
  { name: "Taxi: Preis und Strecke", x: "Strecke in km", y: "Preis in €", rule: (x: number, m: number, t: number) => m * x + t },
  { name: "12 € teilen: Betrag je Person", x: "Personen", y: "€ je Person", rule: (x: number) => 12 / x },
  { name: "Quadrat: Fläche und Seite", x: "Seite in cm", y: "Fläche in cm²", rule: (x: number) => x * x },
  { name: "Äpfel: Preis und Gewicht", x: "Gewicht in kg", y: "Preis in €", rule: (x: number, m: number) => m * x },
];

/** What kind of relation the situation is with these settings. */
export function relationKind(sit: number, t: number): string {
  if (sit === 0) return t === 0 ? "proportional" : "linear";
  if (sit === 1) return "umgekehrt proportional";
  if (sit === 2) return "nicht linear";
  return "proportional";
}

// 8.1 Zuordnungen unterscheiden: Tabelle und Graph nebeneinander.
const relationTypes: LabView = {
  render(v) {
    const sit = SITUATIONS[v.sit] ?? SITUATIONS[0];
    const f = (x: number) => sit.rule(x, v.m, v.t);
    const xs = [1, 2, 3, 4, 5];
    const top = Math.max(12, ...xs.map(f)) * 1.1;
    const plot = new Plot(0, 6, 0, top, { x: 250, y: 40, w: 250, h: 250 });
    let out =
      open(`${sit.name}: ${relationKind(v.sit, v.t)}`) + title(`${sit.name}: ${relationKind(v.sit, v.t)}`);
    // Table.
    out += rect(20, 50, 210, 26, "lab-fill-a");
    out += text(70, 68, "x", "lab-text", "middle") + text(130, 68, "y", "lab-text", "middle") + text(195, 68, v.sit === 1 ? "x · y" : "y : x", "lab-text-small", "middle");
    xs.forEach((x, i) => {
      const y = f(x);
      out += rect(20, 78 + i * 28, 210, 26, i % 2 ? "lab-cell" : "lab-panel");
      out += text(70, 96 + i * 28, fmt(x), "lab-text", "middle");
      out += text(130, 96 + i * 28, fmt(y, 2), "lab-text-b", "middle");
      out += text(195, 96 + i * 28, fmt(v.sit === 1 ? x * y : y / x, 2), "lab-text-small", "middle");
    });
    out += text(20, 236, v.sit === 1 ? "Produkt x · y bleibt gleich?" : "Quotient y : x bleibt gleich?", "lab-text-small");
    out += text(20, 252, "Zunahme von Zeile zu Zeile:", "lab-text-small");
    out += text(20, 268, xs.slice(1).map((x) => fmt(f(x) - f(x - 1), 2)).join(" · "), "lab-text-c");
    // Graph.
    out += plot.clip("rel-types");
    out += plot.grid(1, 1, "x", "y");
    out += clipped("rel-types", plot.graph(f, "lab-curve", 200));
    xs.forEach((x) => {
      out += circle(plot.X(x), plot.Y(f(x)), 4, "lab-point-b");
    });
    out += text(250, 320, `${sit.x} → ${sit.y}`, "lab-text-small");
    return out + "</svg>";
  },
};

// 8.2 Fehlende Werte: Dreisatz am Graphen und in der Tabellenkalkulation.
const missingValues: LabView = {
  render(v) {
    const prop = v.kind === 0;
    const k = prop ? v.y1 / v.x1 : v.x1 * v.y1;
    const f = (x: number) => (prop ? k * x : k / x);
    const y2 = f(v.x2);
    const top = Math.max(f(1), f(10), v.y1) * 1.1;
    const plot = new Plot(0, 11, 0, Math.min(top, prop ? top : v.x1 * v.y1 * 1.1), { x: 40, y: 30, w: 270, h: 270 });
    let out =
      open(`${prop ? "proportional" : "umgekehrt proportional"}: ${fmt(v.x1)} → ${fmt(v.y1)}, ${fmt(v.x2)} → ${fmt(y2, 2)}`) +
      title(prop ? `${fmt(v.x1)} → ${fmt(v.y1)} ⇒ 1 → ${fmt(k, 2)} ⇒ ${fmt(v.x2)} → ${fmt(y2, 2)}` : `${fmt(v.x1)} → ${fmt(v.y1)} ⇒ 1 → ${fmt(k, 2)} ⇒ ${fmt(v.x2)} → ${fmt(y2, 2)}`);
    out += plot.clip("mv-clip");
    out += plot.grid(1, 2);
    out += clipped("mv-clip", plot.graph(f, "lab-curve", 300));
    out += circle(plot.X(v.x1), plot.Y(v.y1), 5, "lab-point-a");
    out += line(plot.X(v.x2), plot.Y(0), plot.X(v.x2), plot.Y(Math.min(y2, plot.ymax)), "lab-dashed");
    out += line(plot.X(0), plot.Y(Math.min(y2, plot.ymax)), plot.X(v.x2), plot.Y(Math.min(y2, plot.ymax)), "lab-dashed");
    // Spreadsheet.
    const cell = (x: number, y: number, w: number, content: string, cls = "lab-cell") =>
      rect(x, y, w, 24, cls) + text(x + 6, y + 16, content, cls === "lab-fill-a" ? "lab-text-small" : "lab-text-small");
    out += cell(330, 40, 40, "", "lab-fill-a") + cell(370, 40, 60, "A", "lab-fill-a") + cell(430, 40, 80, "B", "lab-fill-a");
    out += cell(330, 64, 40, "1", "lab-fill-a") + cell(370, 64, 60, "x") + cell(430, 64, 80, "y");
    out += cell(330, 88, 40, "2", "lab-fill-a") + cell(370, 88, 60, fmt(v.x1)) + cell(430, 88, 80, fmt(v.y1));
    out += cell(330, 112, 40, "3", "lab-fill-a") + cell(370, 112, 60, fmt(v.x2)) + cell(430, 112, 80, fmt(y2, 2), "lab-fill-b");
    out += text(330, 156, "Formel in B3:", "lab-text-small");
    out += text(330, 174, prop ? "=B2/A2*A3" : "=A2*B2/A3", "lab-text-c");
    out += infoBox(340, 214, [
      [prop ? "Quotient gleich:" : "Produkt gleich:", "lab-text-small"],
      [prop ? `y : x = ${fmt(k, 2)}` : `x · y = ${fmt(k, 2)}`, "lab-text-ok"],
    ]);
    return out + handle("x2", plot.X(v.x2), plot.Y(Math.min(y2, plot.ymax)), "gesuchter Wert") + "</svg>";
  },
  handles: {
    x2: { x: "x2", drag: (p) => ({ x2: ((p.x - 40) / 270) * 11 }) },
  },
};

// 8.3 Lineare Funktion y = mx + t mit Steigungsdreieck.
const lineMxT: LabView = {
  render(v) {
    const plot = new Plot(-6, 6, -8, 8);
    let out =
      open(`Gerade y = ${linear(v.m, v.t)}: Steigung ${fmt(v.m)}, y-Achsenabschnitt ${fmt(v.t)}`) +
      title(`y = ${linear(v.m, v.t)}`);
    out += plot.clip("mxt-clip");
    out += plot.grid(1, 2);
    out += clipped("mxt-clip", plot.lineThrough(v.m, v.t, "lab-curve"));
    // Steigungsdreieck from (0 | t) one unit to the right.
    const A = plot.P(0, v.t);
    const B = plot.P(1, v.t);
    const C = plot.P(1, v.t + v.m);
    if (v.m !== 0) {
      out += line(A.x, A.y, B.x, B.y, "lab-side-a") + line(B.x, B.y, C.x, C.y, "lab-side-b");
      out += text((A.x + B.x) / 2, A.y + (v.m > 0 ? 16 : -8), "1", "lab-text-a", "middle");
      out += text(B.x + 6, (B.y + C.y) / 2 + 4, fmt(v.m), "lab-text-b");
    }
    out += circle(A.x, A.y, 6, "lab-point-ok");
    out += text(A.x - 8, A.y - 8, `(0 | ${fmt(v.t)})`, "lab-text-small", "end");
    out += legendRow(30, 332, [
      ["lab-fill-ok", "y-Achsenabschnitt t"],
      ["lab-fill-a", "1 nach rechts"],
      ["lab-fill-b", "m nach oben (unten)"],
    ]);
    return out + handle("t", A.x, A.y, "y-Achsenabschnitt") + "</svg>";
  },
  handles: {
    t: { y: "t", drag: (p) => ({ t: 8 - ((p.y - 14) / 312) * 16 }) },
  },
};

// 8.4 Umgekehrt proportional: Rechtecke mit gleichem Flächeninhalt.
const hyperbolaRect: LabView = {
  render(v) {
    const y = v.k / v.x;
    const plot = new Plot(0, 13, 0, 13, { x: 40, y: 20, w: 300, h: 300 });
    let out =
      open(`y = ${fmt(v.k)} : x: bei x = ${fmt(v.x)} ist y = ${fmt(y, 2)}`) + title(`y = ${fmt(v.k)} : x  ·  x · y = ${fmt(v.k)}`);
    out += plot.clip("hyp-clip");
    out += plot.grid(1, 2);
    const yy = Math.min(y, 13);
    out += clipped("hyp-clip", rect(plot.X(0), plot.Y(yy), plot.X(v.x) - plot.X(0), plot.Y(0) - plot.Y(yy), "lab-fill-a") + plot.graph((x) => v.k / x, "lab-curve", 300));
    out += infoBox(360, 70, [
      [`Breite x = ${fmt(v.x)}`, "lab-text"],
      [`Höhe y = ${fmt(v.k)} : ${fmt(v.x)} = ${fmt(y, 2)}`, "lab-text"],
      [`Fläche x · y = ${fmt(v.k)}`, "lab-text-ok"],
    ]);
    out += text(360, 190, "Doppelte Breite,", "lab-text-small");
    out += text(360, 206, "halbe Höhe.", "lab-text-small");
    return out + handle("x", plot.X(v.x), plot.Y(yy), "Ecke des Rechtecks") + "</svg>";
  },
  handles: {
    x: { x: "x", drag: (p) => ({ x: ((p.x - 40) / 300) * 13 }) },
  },
};

// 8.5 Zwei Tarife: Schnittpunkt zeichnerisch und rechnerisch.
const tariffs: LabView = {
  render(v) {
    const plot = new Plot(0, 20, 0, 60, { x: 40, y: 44, w: 450, h: 258 });
    const fa = (x: number) => v.ta + v.ma * x;
    const fb = (x: number) => v.tb + v.mb * x;
    const same = Math.abs(v.ma - v.mb) < 1e-9;
    const sx = same ? Number.NaN : (v.tb - v.ta) / (v.ma - v.mb);
    let out =
      open(`Tarif A y = ${linear(v.ma, v.ta)}, Tarif B y = ${linear(v.mb, v.tb)}`) +
      title(same ? "Gleiche Steigung: kein Schnittpunkt (oder überall gleich)" : `Schnittpunkt bei x = ${fmt(sx, 2)} h, y = ${fmt(fa(sx), 2)} €`);
    out += plot.clip("tar-clip");
    out += plot.grid(2, 4, "Stunden", "€");
    out += clipped("tar-clip", plot.graph(fa, "lab-side-a", 60) + plot.graph(fb, "lab-side-b", 60));
    if (!same && plot.contains(sx, fa(sx))) {
      out += circle(plot.X(sx), plot.Y(fa(sx)), 6, "lab-point-ok");
      out += line(plot.X(sx), plot.Y(0), plot.X(sx), plot.Y(fa(sx)), "lab-dashed");
    }
    out += legendRow(46, 334, [
      ["lab-fill-a", `A: ${fmt(v.ta)} € + ${fmt(v.ma)} € je h`],
      ["lab-fill-b", `B: ${fmt(v.tb)} € + ${fmt(v.mb)} € je h`],
    ]);
    return out + "</svg>";
  },
};

export const FUNKTIONEN_VIEWS: Record<string, LabView> = {
  "relation-types": relationTypes,
  "missing-values": missingValues,
  "line-mx-t": lineMxT,
  "hyperbola-rect": hyperbolaRect,
  tariffs,
};
