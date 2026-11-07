import { fmt } from "../exercises/format";
import { Plot, circle, handle, line, open, polygon, rect, text, type LabView } from "./svg";
import { rail, railHandle, title } from "./view-helpers";

const termBuild: LabView = {
  render(v, r) {
    let out = open("Muster, das mit jeder Figurnummer wächst") + title(`n = ${v.n}: ${r.term} = ${r.value}`);
    const n = v.n;
    const cell = Math.min(40, 430 / n);
    const x0 = 45;
    const y0 = 90;
    if (v.p === 0) {
      for (let i = 0; i <= n; i++) out += line(x0 + i * cell, y0, x0 + i * cell, y0 + cell, "lab-curve");
      for (let i = 0; i < n; i++)
        out += line(x0 + i * cell, y0, x0 + (i + 1) * cell, y0, "lab-curve") + line(x0 + i * cell, y0 + cell, x0 + (i + 1) * cell, y0 + cell, "lab-curve");
    } else if (v.p === 1) {
      for (let i = 0; i < n; i++) {
        const left = x0 + (i * cell) / 1;
        out += polygon(
          [
            { x: left, y: y0 + cell },
            { x: left + cell, y: y0 + cell },
            { x: left + cell / 2, y: y0 },
          ],
          "lab-fill-a",
        );
      }
    } else {
      const unit = 430 / 25;
      out +=
        rect(x0, y0, 5 * unit, 40, "lab-fill-b") +
        text(x0 + 2, y0 + 62, "5 € Grundpreis", "lab-text-small");
      for (let i = 0; i < n; i++) out += rect(x0 + (5 + 2 * i) * unit, y0, 2 * unit, 40, "lab-fill-a");
    }
    return (
      out +
      text(45, 200, String(r.why), "lab-text-small") +
      rail("n", "Figurnummer n", v.n, 1, 10, 300) +
      "</svg>"
    );
  },
  handles: { n: railHandle("n", 1, 10) },
};

const tablePlot = new Plot(0, 7, 0, 30, { x: 225, y: 30, w: 275, h: 270 });
const termTable: LabView = {
  render(v, r) {
    const p = tablePlot;
    const f = (x: number) => v.a * x + v.b;
    let out = open("Wertetabelle und grafische Wertetabelle eines Terms") + text(110, 25, `T(x) = ${r.term}`, "lab-text", "middle");
    out += rect(25, 40, 80, 30, "lab-panel") + rect(105, 40, 90, 30, "lab-panel") + text(65, 60, "x", "lab-text", "middle") + text(150, 60, "T(x)", "lab-text", "middle");
    for (let x = 0; x <= 6; x++) {
      const y = 70 + x * 30;
      const cls = x === v.x ? "lab-fill-a" : "lab-cell";
      out += rect(25, y, 80, 30, cls) + rect(105, y, 90, 30, cls) + text(65, y + 20, String(x), "lab-text", "middle") + text(150, y + 20, fmt(f(x)), "lab-text", "middle");
    }
    out += p.grid(1, 1, "x", "T(x)", 5, 5);
    for (let x = 0; x <= 6; x++) out += circle(p.X(x), p.Y(f(x)), 4.5, "lab-dot-small");
    return out + handle("x", p.X(v.x), p.Y(f(v.x)), "Punkt der grafischen Wertetabelle") + "</svg>";
  },
  handles: { x: { x: "x", drag: (q) => ({ x: tablePlot.invX(q.x) }) } },
};

const termValue: LabView = {
  render(v, r) {
    const px = (value: number) => 260 + value * 45;
    let out = open("Grundmenge auf der Zahlengeraden und eingesetzter Wert") + title(`T(x) = ${r.term}`);
    out += line(60, 150, 460, 150, "lab-axis");
    for (let t = -4; t <= 4; t++) {
      const inSet = v.g === 2 || v.g === 1 || t >= 1;
      out += line(px(t), 142, px(t), 158, "lab-axis") + text(px(t), 180, fmt(t), "lab-text-tick", "middle");
      if (inSet && v.g !== 2) out += circle(px(t), 150, 5, "lab-dot-small");
    }
    if (v.g === 2) out += rect(px(-4), 145, px(4) - px(-4), 10, "lab-fill-a");
    const ok = r.allowed === "ja";
    return (
      out +
      handle("x", px(v.x), 150, "Wert für x") +
      text(260, 228, `x = ${fmt(v.x)}: ${r.value}`, ok ? "lab-text-ok" : "lab-text-bad", "middle") +
      text(260, 256, `Grundmenge ${r.setName}`, "lab-text-small", "middle") +
      "</svg>"
    );
  },
  handles: { x: { x: "x", drag: (q) => ({ x: (q.x - 260) / 45 }) } },
};

const termEquiv: LabView = {
  render(v, r) {
    return (
      open("Zwei Terme mit derselben Belegung") +
      title(`x = ${fmt(v.x)}`) +
      rect(40, 55, 200, 100, "lab-fill-a") +
      rect(280, 55, 200, 100, "lab-fill-b") +
      text(140, 90, String(r.left), "lab-text", "middle") +
      text(380, 90, String(r.right), "lab-text", "middle") +
      text(140, 130, `= ${fmt(Number(r.leftValue))}`, "lab-text-big", "middle") +
      text(380, 130, `= ${fmt(Number(r.rightValue))}`, "lab-text-big", "middle") +
      text(260, 192, String(r.same), "lab-text", "middle") +
      text(260, 222, String(r.verdict), "lab-text-small", "middle") +
      rail("x", "Belegung x", v.x, -4, 4, 300) +
      "</svg>"
    );
  },
  handles: { x: railHandle("x", -4, 4) },
};

const equationTry: LabView = {
  render(v, r) {
    const left = Number(r.left);
    const s = 390 / Math.max(v.c, left, 1);
    return (
      open("Beide Seiten der Gleichung als Balken") +
      title(`${v.a} · x + ${v.b} = ${v.c}`) +
      text(65, 72, `Linke Seite für x = ${v.x}: ${fmt(left)}`, "lab-text") +
      rect(65, 82, left * s, 45, "lab-fill-a") +
      text(65, 160, `Rechte Seite: ${v.c}`, "lab-text") +
      rect(65, 170, v.c * s, 45, "lab-fill-b") +
      text(260, 245, left === v.c ? "Gleichheit: x ist die Lösung." : left < v.c ? "Links ist noch zu wenig." : "Links ist zu viel.", left === v.c ? "lab-text-ok" : "lab-text-small", "middle") +
      rail("x", "Probezahl x", v.x, 0, 10, 300) +
      "</svg>"
    );
  },
  handles: { x: railHandle("x", 0, 10) },
};

const balance: LabView = {
  render(_v, r) {
    const panel = (x: number, content: string, cls: string) =>
      rect(x, 90, 190, 60, cls, 'rx="10"') + text(x + 95, 127, content, "lab-text-big", "middle");
    return (
      open("Waage: Auf beiden Seiten dasselbe tun") +
      title(String(r.start)) +
      line(260, 170, 260, 245, "lab-axis") +
      line(60, 170, 460, 170, "lab-axis") +
      panel(50, String(r.leftNow), "lab-fill-a") +
      panel(280, String(r.rightNow), "lab-fill-b") +
      text(260, 270, String(r.step), "lab-text-small", "middle") +
      text(260, 298, `Lösungsmenge in ${r.setName}: ${r.solution}`, "lab-text", "middle") +
      "</svg>"
    );
  },
};

const wordEquation: LabView = {
  render(v, r) {
    const s = 390 / Math.max(v.T, 1);
    const x = Number(r.x);
    return (
      open("Grundpreis und Stückkosten als Balken gegenüber dem Gesamtbetrag") +
      title(`${v.p} · x + ${v.f} = ${v.T}`) +
      text(65, 72, `Gesamtbetrag ${v.T} €`, "lab-text") +
      rect(65, 82, v.T * s, 40, "lab-fill-b") +
      text(65, 155, `Grundbetrag ${v.f} € und x Stück zu je ${v.p} €`, "lab-text") +
      rect(65, 165, v.f * s, 40, "lab-fill-c") +
      rect(65 + v.f * s, 165, Math.max(0, x) * v.p * s, 40, "lab-fill-a") +
      text(260, 240, `x = ${r.xText}`, "lab-text", "middle") +
      text(260, 268, String(r.verdict), Number.isInteger(x) && x >= 0 ? "lab-text-ok" : "lab-text-bad", "middle") +
      rail("T", "Gesamtbetrag in €", v.T, 12, 60, 312) +
      "</svg>"
    );
  },
  handles: { T: railHandle("T", 12, 60) },
};

export const TERME_VIEWS = {
  "term-build": termBuild,
  "term-table": termTable,
  "term-value": termValue,
  "term-equiv": termEquiv,
  "equation-try": equationTry,
  balance,
  "word-equation": wordEquation,
};
