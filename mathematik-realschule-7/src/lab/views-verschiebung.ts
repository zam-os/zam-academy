import { polygonFromAngles } from "../models";
import type { LabValues } from "../model/types";
import { fmt, point } from "../exercises/format";
import {
  Plot,
  angleMark,
  arrow,
  circle,
  clipped,
  handle,
  line,
  open,
  polygon,
  polar,
  text,
  type LabView,
} from "./svg";
import { coordinateHandle, rail, railHandle, title } from "./view-helpers";

function plotFor(v: LabValues, translation = false): Plot {
  const reach = translation
    ? Math.max(
        Math.abs(v.x),
        Math.abs(v.y),
        Math.abs(v.x + v.u),
        Math.abs(v.y + v.v),
        Math.abs(v.x + 3 + v.u),
        Math.abs(v.y + 2 + v.v),
      ) + 2
    : Math.max(
        3,
        ...[
          v.u ?? 0,
          v.v ?? 0,
          v.p ?? 0,
          v.q ?? 0,
          v.x ?? 0,
          v.y ?? 0,
          (v.u ?? 0) + (v.p ?? 0),
          (v.v ?? 0) + (v.q ?? 0),
          (v.x ?? 0) + (v.u ?? 0),
          (v.y ?? 0) + (v.v ?? 0),
        ].map(Math.abs),
      ) + 1;
  return new Plot(-reach, reach, -reach, reach, {
    x: 115,
    y: 38,
    w: 280,
    h: 280,
  });
}
const translation: LabView = {
  render(v) {
    const p = plotFor(v, true),
      A = p.P(v.x, v.y),
      B = p.P(v.x + v.u, v.y + v.v);
    let out =
      open("Originaldreieck und kongruentes verschobenes Bilddreieck") +
      title(`P${point(v.x, v.y)} → P′${point(v.x + v.u, v.y + v.v)}`) +
      p.grid(1, 2);
    const id = "translation-clip";
    out +=
      p.clip(id) +
      clipped(
        id,
        polygon([A, p.P(v.x + 3, v.y), p.P(v.x + 1, v.y + 2)], "lab-fill-a") +
          polygon(
            [
              B,
              p.P(v.x + 3 + v.u, v.y + v.v),
              p.P(v.x + 1 + v.u, v.y + 2 + v.v),
            ],
            "lab-fill-b",
          ) +
          arrow(A.x, A.y, B.x, B.y, "lab-side-c"),
      );
    return (
      out +
      handle("P", A.x, A.y, "Originalpunkt P") +
      handle("image", B.x, B.y, "Bildpunkt P′") +
      text(A.x - 12, A.y + 20, "P") +
      text(B.x + 12, B.y - 12, "P′") +
      "</svg>"
    );
  },
  handles: {
    P: coordinateHandle("x", "y", (p, v) => {
      const g = plotFor(v, true);
      return { x: g.invX(p.x), y: g.invY(p.y) };
    }),
    image: {
      x: "u",
      y: "v",
      drag: (p, v) => {
        const g = plotFor(v, true);
        return { u: g.invX(p.x) - v.x, v: g.invY(p.y) - v.y };
      },
    },
  },
};
const vector: LabView = {
  render(v) {
    const p = plotFor(v),
      O = p.P(0, 0),
      U = p.P(v.u, v.v),
      S = p.P(v.u + v.p, v.v + v.q);
    return (
      open("Zwei Vektoren Spitze an Schaft und ihr Summenvektor") +
      title(`Summe ${point(v.u + v.p, v.v + v.q)}`) +
      p.grid(1, 2) +
      arrow(O.x, O.y, U.x, U.y, "lab-side-a") +
      arrow(U.x, U.y, S.x, S.y, "lab-side-b") +
      arrow(O.x, O.y, S.x, S.y, "lab-side-c") +
      handle("u", U.x, U.y, "Erster Vektor") +
      handle("sum", S.x, S.y, "Zweiter Vektor ab der ersten Spitze") +
      text(22, 85, "Blau: erster Weg", "lab-text-small") +
      text(22, 110, "Orange: zweiter Weg", "lab-text-small") +
      "</svg>"
    );
  },
  handles: {
    u: coordinateHandle("u", "v", (p, v) => {
      const g = plotFor(v);
      return { x: g.invX(p.x), y: g.invY(p.y) };
    }),
    sum: {
      x: "p",
      y: "q",
      drag: (p, v) => {
        const g = plotFor(v);
        return { p: g.invX(p.x) - v.u, q: g.invY(p.y) - v.v };
      },
    },
  },
};
const midpoint: LabView = {
  render(v) {
    const p = plotFor(v),
      O = p.P(0, 0),
      B = p.P(v.x, v.y),
      D = p.P(v.u, v.v),
      C = p.P(v.x + v.u, v.y + v.v),
      M = p.P((v.x + v.u) / 2, (v.y + v.v) / 2);
    return (
      open("Parallelogramm mit Diagonalen und gemeinsamem Mittelpunkt") +
      title(
        `C${point(v.x + v.u, v.y + v.v)}; M${point((v.x + v.u) / 2, (v.y + v.v) / 2)}`,
      ) +
      p.grid(1, 2) +
      polygon([O, B, C, D], "lab-fill-a") +
      line(O.x, O.y, C.x, C.y, "lab-dashed") +
      line(B.x, B.y, D.x, D.y, "lab-dashed") +
      circle(M.x, M.y, 4, "lab-dot-small") +
      text(M.x + 10, M.y - 8, "M") +
      text(O.x - 12, O.y + 18, "A") +
      text(B.x + 10, B.y + 15, "B") +
      text(C.x + 8, C.y - 8, "C") +
      text(D.x - 15, D.y - 10, "D") +
      handle("B", B.x, B.y, "Punkt B") +
      handle("D", D.x, D.y, "Punkt D") +
      "</svg>"
    );
  },
  handles: {
    B: coordinateHandle("x", "y", (p, v) => {
      const g = plotFor(v);
      return { x: g.invX(p.x), y: g.invY(p.y) };
    }),
    D: coordinateHandle("u", "v", (p, v) => {
      const g = plotFor(v);
      return { x: g.invX(p.x), y: g.invY(p.y) };
    }),
  },
};
const determinant: LabView = {
  render(v) {
    const p = plotFor(v),
      O = p.P(0, 0),
      U = p.P(v.u, v.v),
      V = p.P(v.p, v.q),
      S = p.P(v.u + v.p, v.v + v.q),
      d = v.u * v.q - v.v * v.p;
    return (
      open("Dreieck und zugehöriges Parallelogramm zur Determinante") +
      title(`det = ${fmt(d, 0)}; Dreiecksfläche = ${fmt(Math.abs(d) / 2)} FE`) +
      p.grid(1, 2) +
      polygon([O, U, S, V], "lab-fill-a") +
      polygon([O, U, V], "lab-fill-b") +
      arrow(O.x, O.y, U.x, U.y, "lab-side-a") +
      arrow(O.x, O.y, V.x, V.y, "lab-side-b") +
      handle("u", U.x, U.y, "Erster Vektor") +
      handle("v", V.x, V.y, "Zweiter Vektor") +
      "</svg>"
    );
  },
  handles: {
    u: coordinateHandle("u", "v", (p, v) => {
      const g = plotFor(v);
      return { x: g.invX(p.x), y: g.invY(p.y) };
    }),
    v: coordinateHandle("p", "q", (p, v) => {
      const g = plotFor(v);
      return { x: g.invX(p.x), y: g.invY(p.y) };
    }),
  },
};
const parallel: LabView = {
  render(v) {
    const A = { x: 205, y: 100 },
      r = (v.alpha * Math.PI) / 180,
      B = { x: A.x - 110 / Math.tan(r), y: 210 },
      end1 = polar(A.x, A.y, 170, v.alpha),
      end2 = polar(A.x, A.y, 250, v.alpha + 180),
      lo = polar(B.x, B.y, 140, v.beta),
      hi = polar(B.x, B.y, 140, v.beta + 180);
    return (
      open("Zwei Geraden mit Transversale und markierten Stufenwinkeln") +
      title(
        v.beta === 0
          ? "Geraden parallel: Stufenwinkel gleich"
          : "Geraden nicht parallel: Stufenwinkel verschieden",
      ) +
      line(40, 100, 480, 100, "lab-side-a") +
      line(hi.x, hi.y, lo.x, lo.y, "lab-side-b") +
      line(end1.x, end1.y, end2.x, end2.y, "lab-ink") +
      text(A.x + 20, A.y - 15, `${v.alpha}°`) +
      text(B.x + 20, B.y - 15, `${v.alpha - v.beta}°`) +
      rail("alpha", "Oberer Winkel α", v.alpha, 40, 140) +
      "</svg>"
    );
  },
  handles: { alpha: railHandle("alpha", 40, 140) },
};
const polygonAngles: LabView = {
  render(v) {
    let out = open("Vieleck mit Diagonalen und Innenwinkeln");
    out += title(
      `${v.n}-Eck: ${v.n - 2} ${v.n === 3 ? "Dreieck" : "Dreiecke"}, ${(v.n - 2) * 180}°`,
    );
    if ("alpha" in v) {
      const rest =
        (v.n - 2) * 180 - v.alpha - v.beta - (v.n === 4 ? v.gamma : 0);
      const angles =
        v.n === 3 ? [v.alpha, v.beta, rest] : [v.alpha, v.beta, v.gamma, rest];
      const model = polygonFromAngles(angles);
      if (model) {
        const xmin = Math.min(...model.map((p) => p.x)),
          xmax = Math.max(...model.map((p) => p.x)),
          ymin = Math.min(...model.map((p) => p.y)),
          ymax = Math.max(...model.map((p) => p.y));
        const scale = Math.min(270 / (xmax - xmin), 160 / (ymax - ymin));
        const vertices = model.map((p) => ({
          x: 260 + (p.x - (xmin + xmax) / 2) * scale,
          y: 155 - (p.y - (ymin + ymax) / 2) * scale,
        }));
        out += polygon(vertices, "lab-fill-a");
        if (v.n === 4)
          out += line(
            vertices[0].x,
            vertices[0].y,
            vertices[2].x,
            vertices[2].y,
            "lab-dashed",
          );
        vertices.forEach((P, i) => {
          out += angleMark(
            P,
            vertices[(i + vertices.length - 1) % vertices.length],
            vertices[(i + 1) % vertices.length],
            16,
          );
          out += text(
            P.x + (P.x < 260 ? -14 : 14),
            P.y + (P.y < 155 ? -12 : 22),
            `${angles[i]}°`,
            "lab-text",
            P.x < 260 ? "end" : "start",
          );
        });
      } else
        out += text(
          260,
          155,
          "So entsteht kein konvexes Vieleck.",
          "lab-text",
          "middle",
        );
      out += text(
        260,
        270,
        `Fehlender Innenwinkel: ${fmt(rest, 0)}°`,
        "lab-text",
        "middle",
      );
    } else {
      const vertices = Array.from({ length: v.n }, (_, i) =>
        polar(260, 145, 100, 90 + (i * 360) / v.n),
      );
      out += polygon(vertices, "lab-fill-a");
      for (let i = 2; i < v.n - 1; i++)
        out += line(
          vertices[0].x,
          vertices[0].y,
          vertices[i].x,
          vertices[i].y,
          "lab-dashed",
        );
    }
    return (
      out +
      rail("n", "Eckenanzahl", v.n, 3, "alpha" in v ? 4 : 8, 307) +
      "</svg>"
    );
  },
  handles: {
    n: {
      x: "n",
      drag: (p, v) => railHandle("n", 3, "alpha" in v ? 4 : 8).drag(p, v),
    },
  },
};
export const VERSCHIEBUNG_VIEWS = {
  translation,
  "vector-addition": vector,
  midpoint,
  determinant,
  "parallel-angles": parallel,
  "polygon-angles": polygonAngles,
};
