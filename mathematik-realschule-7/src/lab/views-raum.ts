import type { LabValues } from "../model/types";
import { fmt } from "../exercises/format";
import {
  angleMark,
  line,
  open,
  polygon,
  text,
  handle,
  type LabView,
  type Pt,
} from "./svg";
import { rail, railHandle, title } from "./view-helpers";
function body(
  v: LabValues,
  s = 25,
  origin = { x: 80, y: 250 },
): Record<string, Pt> {
  const w = v.width ?? 5,
    d = v.depth ?? 4,
    h = v.height ?? 3,
    q = v.q ?? 0.5,
    a = ((v.angle ?? 45) * Math.PI) / 180;
  const A = origin,
    B = { x: A.x + w * s, y: A.y },
    D = { x: A.x + d * q * s * Math.cos(a), y: A.y - d * q * s * Math.sin(a) },
    C = { x: B.x + D.x - A.x, y: D.y };
  const up = (p: Pt) => ({ x: p.x, y: p.y - h * s });
  return { A, B, C, D, E: up(A), F: up(B), G: up(C), H: up(D) };
}
function segment(p: Record<string, Pt>, edge: string, cls: string) {
  return line(p[edge[0]].x, p[edge[0]].y, p[edge[1]].x, p[edge[1]].y, cls);
}
function solid(
  v: LabValues,
  labels = true,
  s = 25,
  origin = { x: 80, y: 250 },
): string {
  const p = body(v, s, origin);
  let out = polygon([p.A, p.B, p.C, p.D], "lab-fill-a");
  if (v.shape === 1) {
    const M = { x: (p.A.x + p.C.x) / 2, y: (p.A.y + p.C.y) / 2 },
      S = { x: M.x, y: M.y - v.height * s };
    for (const key of ["A", "B", "C", "D"])
      out += line(
        p[key].x,
        p[key].y,
        S.x,
        S.y,
        key === "D" ? "lab-dashed" : "lab-ink",
      );
    out +=
      line(M.x, M.y, S.x, S.y, "lab-side-c") +
      text(S.x + 10, S.y - 5, "S") +
      text(M.x + 8, M.y + 15, "M");
  } else {
    out +=
      polygon([p.A, p.B, p.F, p.E], "lab-fill-b") +
      polygon([p.B, p.C, p.G, p.F], "lab-fill-c");
    for (const edge of [
      "AB",
      "BC",
      "CD",
      "DA",
      "AE",
      "BF",
      "CG",
      "DH",
      "EF",
      "FG",
      "GH",
      "HE",
    ])
      out += segment(
        p,
        edge,
        ["CD", "DA", "DH"].includes(edge) ? "lab-dashed" : "lab-ink",
      );
  }
  if (labels)
    for (const [name, at] of Object.entries(p)) {
      if (v.shape === 1 && ["E", "F", "G", "H"].includes(name)) continue;
      out += text(at.x - 10, at.y + (name < "E" ? 18 : -10), name);
    }
  return out;
}
const relations: LabView = {
  render(v) {
    const p = body(v);
    let out =
      open("Quader ABCD–EFGH mit ausgewählten Geraden und Ebenen") +
      title(
        [
          "AB ∥ GH",
          "AB und CG windschief",
          "AE ⟂ Grundebene",
          "Grundebene und Vorderfläche: 90°",
        ][v.case],
      ) +
      solid(v);
    if (v.case === 0)
      out += segment(p, "AB", "lab-side-a") + segment(p, "GH", "lab-side-b");
    if (v.case === 1)
      out += segment(p, "AB", "lab-side-a") + segment(p, "CG", "lab-side-b");
    if (v.case === 2)
      out +=
        polygon([p.A, p.B, p.C, p.D], "lab-fill-ok") +
        segment(p, "AE", "lab-side-c");
    if (v.case === 3)
      out +=
        polygon([p.A, p.B, p.F, p.E], "lab-fill-b") +
        segment(p, "AB", "lab-side-c") +
        text(365, 165, "Normalschnitt:", "lab-text-small") +
        line(385, 210, 440, 210, "lab-side-a") +
        line(385, 210, 385, 160, "lab-side-b") +
        text(400, 192, "90°");
    return (
      out + rail("angle", "Ansichtswinkel", v.angle, 20, 70, 305) + "</svg>"
    );
  },
  handles: { angle: railHandle("angle", 20, 70) },
};
const oblique: LabView = {
  render(v) {
    const p = body(v);
    return (
      open("Schrägbild eines Prismas oder einer geraden Pyramide") +
      title(
        `ω = ${v.angle}°, q = ${fmt(v.q)}; Tiefenbild ${fmt(v.depth * v.q)} cm`,
      ) +
      solid(v) +
      handle("depth", p.D.x, p.D.y, "Ende der Tiefenachse") +
      text(
        260,
        315,
        "Frontmaße bleiben wahr; gestrichelt = verdeckt.",
        "lab-text-small",
        "middle",
      ) +
      "</svg>"
    );
  },
  handles: {
    depth: {
      x: "q",
      y: "angle",
      drag: (p, v) => {
        const A = body(v).A;
        return {
          q: Math.hypot(p.x - A.x, p.y - A.y) / (v.depth * 25),
          angle: (Math.atan2(A.y - p.y, p.x - A.x) * 180) / Math.PI,
        };
      },
    },
  },
};
const trueSize: LabView = {
  render(v) {
    let out =
      open("Schrägbild links und unverzerrte Hilfsfigur rechts") +
      title(
        [
          "Grundrechteck in wahrer Größe",
          "Hilfsdreieck für die Raumdiagonale",
          "Normalschnitt einer geraden Pyramide",
        ][v.section],
      ) +
      solid({ ...v, angle: 45, shape: v.section === 2 ? 1 : 0 }, false, 14, {
        x: 35,
        y: 200,
      }) +
      text(125, 245, "Schrägbild", "lab-text-small", "middle");
    const A = { x: 285, y: 235 };
    if (v.section === 0) {
      const B = { x: A.x + v.width * 28, y: A.y },
        C = { x: B.x, y: A.y - v.depth * 28 },
        D = { x: A.x, y: C.y };
      out +=
        polygon([A, B, C, D], "lab-fill-a") +
        line(A.x, A.y, C.x, C.y, "lab-side-c") +
        text(
          A.x + (B.x - A.x) / 2,
          257,
          `${v.width} cm`,
          "lab-text",
          "middle",
        ) +
        text(A.x - 8, (A.y + D.y) / 2, `${v.depth} cm`, "lab-text", "end");
    } else {
      const base = v.section === 1 ? Math.hypot(v.width, v.depth) : v.depth / 2,
        s = 23,
        B = { x: A.x + base * s, y: A.y },
        C = { x: B.x, y: B.y - v.height * s };
      out +=
        polygon([A, B, C], "lab-fill-a") +
        angleMark(B, A, C, 15, "lab-angle", true) +
        line(A.x, A.y, C.x, C.y, "lab-side-c") +
        text(
          (A.x + B.x) / 2,
          257,
          v.section === 1 ? "Grunddiagonale" : `${fmt(base)} cm`,
          "lab-text-small",
          "middle",
        ) +
        text(C.x + 8, (C.y + B.y) / 2, `${v.height} cm`) +
        text(A.x + 30, A.y - 10, "Winkel hier messen", "lab-text-small");
    }
    return (
      out +
      rail("q", "Verkürzung nur im linken Bild", v.q, 0.25, 0.75, 305) +
      "</svg>"
    );
  },
  handles: { q: railHandle("q", 0.25, 0.75) },
};
export const RAUM_VIEWS = {
  "space-relations": relations,
  oblique,
  "true-size": trueSize,
};
