import {
  Plot,
  angleMark,
  circle,
  clipped,
  handle,
  line,
  open,
  polygon,
  rect,
  text,
  type LabView,
} from "./svg";
import { coordinateHandle, title } from "./view-helpers";
const p = new Plot(-6, 6, -5, 5, { x: 92, y: 28, w: 336, h: 280 });
const pointHandle = coordinateHandle("x", "y", (pt) => ({
  x: p.invX(pt.x),
  y: p.invY(pt.y),
}));
function point(v: Record<string, number>, label = "P") {
  return (
    handle("P", p.X(v.x), p.Y(v.y), `Punkt ${label}`) +
    text(p.X(v.x) + 12, p.Y(v.y) - 10, label)
  );
}
const circleLocus: LabView = {
  render(v) {
    let out =
      open("Kreislinie und Ortsbereich mit beweglichem Prüfpunkt") +
      p.grid(1, 2) +
      title(
        [
          "Abstand genau r",
          "Abstand höchstens r",
          "Abstand mindestens r",
          "Abstand weniger als r",
        ][v.mode],
      );
    if (v.mode === 1 || v.mode === 3)
      out += circle(p.X(0), p.Y(0), v.radius * p.sx, "lab-fill-a");
    if (v.mode === 2)
      out +=
        `<defs><mask id="outside"><rect x="92" y="28" width="336" height="280" fill="white"/><circle cx="${p.X(0)}" cy="${p.Y(0)}" r="${v.radius * p.sx}" fill="black"/></mask></defs>` +
        rect(92, 28, 336, 280, "lab-fill-a", 'mask="url(#outside)"');
    out +=
      circle(
        p.X(0),
        p.Y(0),
        v.radius * p.sx,
        v.mode === 3 ? "lab-curve lab-dashed" : "lab-curve",
      ) +
      line(p.X(0), p.Y(0), p.X(v.x), p.Y(v.y), "lab-side-b") +
      point(v) +
      text(p.X(0) - 15, p.Y(0) + 15, "M");
    return out + "</svg>";
  },
  handles: { P: pointHandle },
};
const bisector: LabView = {
  render(v) {
    let out =
      open(
        "Mittelsenkrechte, Winkelhalbierende oder Abstandsparallelen mit Bereichen",
      ) + p.grid(1, 2);
    if (v.mode === 3)
      out += rect(p.X(-6), p.Y(5), 6 * p.sx, 10 * p.sy, "lab-fill-a");
    if (v.mode === 4)
      out += rect(p.X(-6), p.Y(2), 12 * p.sx, 4 * p.sy, "lab-fill-a");
    if (v.mode === 5)
      out +=
        rect(p.X(-6), p.Y(5), 12 * p.sx, 3 * p.sy, "lab-fill-a") +
        rect(p.X(-6), p.Y(-2), 12 * p.sx, 3 * p.sy, "lab-fill-a");
    if (v.mode === 0 || v.mode === 3) {
      out +=
        line(
          p.X(0),
          p.Y(-5),
          p.X(0),
          p.Y(5),
          v.mode === 3 ? "lab-curve lab-dashed" : "lab-curve",
        ) +
        circle(p.X(-3), p.Y(0), 4, "lab-dot-small") +
        circle(p.X(3), p.Y(0), 4, "lab-dot-small") +
        text(p.X(-3), p.Y(0) + 20, "A") +
        text(p.X(3), p.Y(0) + 20, "B") +
        line(p.X(-3), p.Y(0), p.X(v.x), p.Y(v.y), "lab-side-a") +
        line(p.X(3), p.Y(0), p.X(v.x), p.Y(v.y), "lab-side-b");
    } else if (v.mode === 1)
      out +=
        line(p.X(0), p.Y(0), p.X(5), p.Y(5), "lab-curve") +
        line(p.X(v.x), p.Y(v.y), p.X(v.x), p.Y(0), "lab-dashed") +
        line(p.X(v.x), p.Y(v.y), p.X(0), p.Y(v.y), "lab-dashed");
    else
      out +=
        line(p.X(-6), p.Y(2), p.X(6), p.Y(2), "lab-curve") +
        line(p.X(-6), p.Y(-2), p.X(6), p.Y(-2), "lab-curve");
    return out + point(v) + "</svg>";
  },
  handles: { P: pointHandle },
};
const thales: LabView = {
  render(v) {
    const A = p.P(-4, 0),
      B = p.P(4, 0),
      C = p.P(v.x, v.y);
    return (
      open("Thaleskreis über AB mit Winkel bei C") +
      p.grid(1, 2) +
      circle(p.X(0), p.Y(0), 4 * p.sx, "lab-curve") +
      polygon([A, B, C], "lab-fill-b") +
      (v.y > 0
        ? angleMark(C, A, B, 22, "lab-angle", v.x * v.x + v.y * v.y === 16)
        : "") +
      text(A.x - 12, A.y + 20, "A") +
      text(B.x + 8, B.y + 20, "B") +
      point(v, "C") +
      "</svg>"
    );
  },
  handles: { P: pointHandle },
};
const linePlot = new Plot(-8, 8, -7, 7, { x: 68, y: 2, w: 384, h: 336 });
const circleLine: LabView = {
  render(v) {
    const p = linePlot;
    let out =
      open("Kreis und horizontale Gerade mit Mittelpunktlot") +
      p.grid(1, 2) +
      circle(p.X(0), p.Y(0), v.radius * p.sx, "lab-curve") +
      line(p.X(-6), p.Y(v.d), p.X(6), p.Y(v.d), "lab-side-b") +
      line(p.X(0), p.Y(0), p.X(0), p.Y(v.d), "lab-dashed");
    if (Math.abs(v.d) <= v.radius) {
      const x = Math.sqrt(Math.max(0, v.radius * v.radius - v.d * v.d));
      out +=
        circle(p.X(x), p.Y(v.d), 4, "lab-dot-small") +
        circle(p.X(-x), p.Y(v.d), 4, "lab-dot-small");
    }
    return (
      out +
      handle("line", p.X(5), p.Y(v.d), "Gerade senkrecht verschieben") +
      "</svg>"
    );
  },
  handles: { line: { y: "d", drag: (pt) => ({ d: linePlot.invY(pt.y) }) } },
};
const tangentPlot = new Plot(-5, 10, -5, 5, { x: 20, y: 30, w: 450, h: 300 });
const tangent: LabView = {
  render(v) {
    const p = tangentPlot,
      M = p.P(0, 0),
      P = p.P(v.d, 0),
      tx = (v.radius * v.radius) / v.d,
      ty = v.radius * Math.sqrt(1 - (v.radius * v.radius) / (v.d * v.d));
    let out =
      open("Tangenten-Konstruktion über dem Thaleskreis MP") +
      circle(M.x, M.y, v.radius * p.sx, "lab-curve") +
      line(M.x, M.y, P.x, P.y, "lab-dashed") +
      text(M.x - 12, M.y + 20, "M") +
      text(P.x + 10, P.y + 20, "P");
    if (v.step >= 2)
      out +=
        circle(p.X(v.d / 2), p.Y(0), (v.d / 2) * p.sx, "lab-ghost") +
        text(p.X(v.d / 2), p.Y(0) + 20, "H");
    if (v.step >= 3)
      for (const y of [ty, -ty]) {
        const T = p.P(tx, y);
        out +=
          circle(T.x, T.y, 5, "lab-dot-small") +
          text(T.x - 15, T.y + (y > 0 ? -12 : 20), y > 0 ? "T₁" : "T₂");
        if (v.step >= 4)
          out +=
            line(P.x, P.y, T.x, T.y, "lab-side-b") +
            line(M.x, M.y, T.x, T.y, "lab-side-a") +
            angleMark(T, M, P, 13, "lab-angle", true);
      }
    return out + handle("P", P.x, P.y, "Äußerer Punkt P") + "</svg>";
  },
  handles: { P: { x: "d", drag: (pt) => ({ d: tangentPlot.invX(pt.x) }) } },
};
const intersection: LabView = {
  render(v) {
    const A = p.P(-2, 0),
      B = p.P(2, 0),
      radius = 3 * p.sx;
    let out =
      open("Zwei Kreisscheiben und ihre Schnittmenge oder Vereinigung") +
      p.grid(1, 2) +
      `<defs><clipPath id="discA"><circle cx="${A.x}" cy="${A.y}" r="${radius}"/></clipPath></defs>`;
    if (v.mode === 1)
      out +=
        circle(A.x, A.y, radius, "lab-fill-a") +
        circle(B.x, B.y, radius, "lab-fill-a");
    else out += clipped("discA", circle(B.x, B.y, radius, "lab-fill-ok"));
    out +=
      circle(A.x, A.y, radius, v.mode === 2 ? "lab-dashed" : "lab-thin") +
      circle(B.x, B.y, radius, v.mode === 2 ? "lab-dashed" : "lab-thin") +
      text(A.x, A.y + 20, "A") +
      text(B.x, B.y + 20, "B") +
      title(
        v.mode === 1
          ? "Vereinigung: eine Bedingung reicht"
          : "Schnittmenge: beide Bedingungen",
      ) +
      point(v);
    return out + "</svg>";
  },
  handles: { P: pointHandle },
};
export const ORTSLINIEN_VIEWS = {
  "circle-locus": circleLocus,
  "bisector-locus": bisector,
  "thales-locus": thales,
  "circle-line": circleLine,
  "tangent-construction": tangent,
  "locus-intersection": intersection,
};
