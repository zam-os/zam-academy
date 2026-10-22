import { SOLIDS } from "../curriculum/stage-3-raum";
import { fmt } from "../exercises/format";
import type { LabKind, LabValues } from "../model/types";
import { arrow, circle, line, open, path, polygon, rect, text, type LabView, type Pt } from "./svg";

const ellipse = (x: number, y: number, rx: number, ry: number, cls: string) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" class="${cls}"/>`;

const solids: LabView = {
  render: (v) => {
    let out = open(`Körpersymmetrie: ${SOLIDS[v.solid].name}`);
    const cone = v.solid === 4,
      cylinder = v.solid === 3;
    if (v.solid <= 1) {
      const w = v.solid === 0 ? 150 : 200,
        h = 150,
        x = 130,
        y = 265,
        dx = 70,
        dy = -45;
      const f = [
          { x, y },
          { x: x + w, y },
          { x: x + w, y: y - h },
          { x, y: y - h },
        ],
        b = f.map((p) => ({ x: p.x + dx, y: p.y + dy }));
      out += polygon(b, "lab-ghost") + polygon(f, "lab-shape");
      for (let i = 0; i < 4; i++)
        out += line(f[i].x, f[i].y, b[i].x, b[i].y, i === 0 ? "lab-dashed" : "lab-ink");
    } else if (v.solid === 2) {
      const base = [
          { x: 130, y: 270 },
          { x: 330, y: 270 },
          { x: 400, y: 225 },
          { x: 200, y: 225 },
        ],
        tip = { x: 265, y: 65 };
      out +=
        polygon(base, "lab-ghost") +
        polygon([base[0], base[1], tip], "lab-shape") +
        polygon([base[1], base[2], tip], "lab-shape-2") +
        line(tip.x, tip.y, base[3].x, base[3].y, "lab-dashed");
    } else if (cone || cylinder) {
      out += ellipse(260, 260, 95, 30, "lab-shape");
      if (cylinder)
        out +=
          rect(165, 90, 190, 170, "lab-fill-a") +
          line(165, 90, 165, 260, "lab-ink") +
          line(355, 90, 355, 260, "lab-ink") +
          ellipse(260, 90, 95, 30, "lab-shape");
      else
        out += polygon(
          [
            { x: 165, y: 260 },
            { x: 260, y: 65 },
            { x: 355, y: 260 },
          ],
          "lab-shape",
        );
    } else out += circle(260, 175, 110, "lab-shape") + ellipse(260, 175, 110, 28, "lab-ghost");
    if (v.plane === 0)
      out += polygon(
        [
          { x: 245, y: 45 },
          { x: 300, y: 20 },
          { x: 300, y: 290 },
          { x: 245, y: 315 },
        ],
        "lab-shape-2",
      );
    else {
      const yy = v.plane === 1 ? 175 : 105;
      out += polygon(
        [
          { x: 115, y: yy + 25 },
          { x: 350, y: yy + 25 },
          { x: 405, y: yy - 20 },
          { x: 170, y: yy - 20 },
        ],
        "lab-shape-2",
      );
    }
    out +=
      line(260, 35, 260, 300, "lab-dashed") +
      text(275, 45, "Achse / Mittellinie", "lab-text-small") +
      text(
        260,
        334,
        v.plane === 0
          ? "Senkrechte Mittelebene"
          : v.plane === 1
            ? "Waagerechte Mittelebene"
            : "Versetzte waagerechte Ebene",
        "lab-text",
        "middle",
      );
    return `${out}</svg>`;
  },
};

const axial: LabView = {
  render: (v) => {
    const s = 18,
      r = s * v.radius,
      h = s * (v.solid === 2 ? 2 * v.radius : v.height),
      y = 275,
      left = 135,
      right = 385;
    let out = open("Axialschnitt und zugehöriger Rotationskörper");
    if (v.solid === 0) {
      out +=
        rect(left - r, y - h, 2 * r, h, "lab-shape") +
        rect(right - r, y - h, 2 * r, h, "lab-fill-b") +
        ellipse(right, y, r, r / 4, "lab-shape-2") +
        ellipse(right, y - h, r, r / 4, "lab-shape-2") +
        line(right - r, y - h, right - r, y, "lab-ink") +
        line(right + r, y - h, right + r, y, "lab-ink");
    } else if (v.solid === 1)
      out +=
        polygon(
          [
            { x: left - r, y },
            { x: left + r, y },
            { x: left, y: y - h },
          ],
          "lab-shape",
        ) +
        polygon(
          [
            { x: right - r, y },
            { x: right + r, y },
            { x: right, y: y - h },
          ],
          "lab-shape-2",
        ) +
        ellipse(right, y, r, r / 4, "lab-shape-2");
    else
      out +=
        circle(left, y - r, r, "lab-shape") +
        circle(right, y - r, r, "lab-shape-2") +
        ellipse(right, y - r, r, r / 4, "lab-ghost");
    out +=
      line(left, y - h - 10, left, y + 10, "lab-dashed") +
      line(right, y - h - 10, right, y + 10, "lab-dashed") +
      text(left, 35, "Axialschnitt", "lab-text", "middle") +
      text(right, 35, "Körper", "lab-text", "middle") +
      text(left, 320, `Breite ${2 * v.radius} cm`, "lab-text", "middle") +
      text(right, 320, `r = ${fmt(v.radius, 1)} cm`, "lab-text", "middle");
    return `${out}</svg>`;
  },
};

const project = (x: number, y: number, z: number): Pt => ({
  x: 85 + 26 * x + 19 * y,
  y: 282 - 12 * y - 27 * z,
});
const coords: LabView = {
  render: (v) => {
    const O = project(0, 0, 0),
      P = project(v.x, v.y, v.z),
      A = project(v.x, 0, 0),
      B = project(v.x, v.y, 0);
    let out = open("Dreidimensionales Koordinatensystem mit Punkt und Hilfsquader");
    for (const [end, label] of [
      [project(7, 0, 0), "x"],
      [project(0, 7, 0), "y"],
      [project(0, 0, 8), "z"],
    ] as const)
      out += arrow(O.x, O.y, end.x, end.y, "lab-axis") + text(end.x + 6, end.y - 5, label);
    for (let i = 1; i <= 6; i++) {
      const x = project(i, 0, 0),
        y = project(0, i, 0),
        z = project(0, 0, i);
      out +=
        line(x.x, x.y - 4, x.x, x.y + 4, "lab-thin") +
        text(x.x, x.y + 18, String(i), "lab-text-tick", "middle") +
        line(y.x - 4, y.y - 3, y.x + 4, y.y + 3, "lab-thin") +
        text(y.x + 8, y.y + 3, String(i), "lab-text-tick") +
        line(z.x - 4, z.y, z.x + 4, z.y, "lab-thin") +
        text(z.x - 9, z.y + 3, String(i), "lab-text-tick", "end");
    }
    const corners = [
      [0, 0, 0],
      [v.x, 0, 0],
      [v.x, v.y, 0],
      [0, v.y, 0],
      [0, 0, v.z],
      [v.x, 0, v.z],
      [v.x, v.y, v.z],
      [0, v.y, v.z],
    ];
    for (const [a, b] of [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ]) {
      const p = project(...(corners[a] as [number, number, number])),
        q = project(...(corners[b] as [number, number, number]));
      out += line(p.x, p.y, q.x, q.y, "lab-dashed");
    }
    out +=
      arrow(O.x, O.y, A.x, A.y, "lab-side-a") +
      arrow(A.x, A.y, B.x, B.y, "lab-side-b") +
      arrow(B.x, B.y, P.x, P.y, "lab-side-c") +
      circle(P.x, P.y, 5, "lab-point-ok") +
      text(P.x + 10, P.y - 9, `P(${v.x}|${v.y}|${v.z})`);
    return `${out}</svg>`;
  },
};

function drawOblique(v: LabValues): string {
  const depth = v.depth * v.q * 22,
    dx = depth * Math.cos((v.angle * Math.PI) / 180),
    dy = -depth * Math.sin((v.angle * Math.PI) / 180),
    x = 110,
    y = 280,
    width = v.solid === 1 ? 22 * v.depth : 145,
    height = 140;
  const base = [
    { x, y },
    { x: x + width, y },
    { x: x + width + dx, y: y + dy },
    { x: x + dx, y: y + dy },
  ];
  let out = open("Schrägbild mit markierter Tiefenrichtung") + polygon(base, "lab-ghost");
  if (v.solid === 1) {
    const tip = { x: x + width / 2 + dx / 2, y: y + dy / 2 - height };
    out +=
      polygon([base[0], base[1], tip], "lab-shape") +
      polygon([base[1], base[2], tip], "lab-shape-2") +
      line(tip.x, tip.y, base[3].x, base[3].y, "lab-dashed") +
      line(tip.x, tip.y, tip.x, y + dy / 2, "lab-dashed");
  } else {
    const top = base.map((p) => ({ x: p.x, y: p.y - height }));
    out += polygon([base[0], base[1], top[1], top[0]], "lab-shape") + polygon(top, "lab-shape-2");
    base.forEach((p, i) => {
      out += line(p.x, p.y, top[i].x, top[i].y, i === 3 ? "lab-dashed" : "lab-ink");
    });
  }
  out +=
    arrow(base[1].x, base[1].y, base[2].x, base[2].y, "lab-side-b") +
    text(
      260,
      325,
      `Tiefe im Bild: ${fmt(v.depth * v.q, 2)} cm · Winkel ${v.angle}°`,
      "lab-text",
      "middle",
    );
  return `${out}</svg>`;
}

const trueSize: LabView = {
  render: (v) => {
    const s = 16,
      x = 35,
      y = 255,
      dx = (v.depth * v.q * s) / Math.sqrt(2),
      dy = -dx,
      width = v.width * s;
    const pts = [
      { x, y },
      { x: x + width, y },
      { x: x + width + dx, y: y + dy },
      { x: x + dx, y: y + dy },
    ];
    const rx = 315,
      ry = 255,
      rh = v.depth * s;
    return (
      open("Projizierte rechteckige Grundfläche neben ihrer wahren Größe") +
      polygon(pts, "lab-shape") +
      line(x, y, pts[2].x, pts[2].y, "lab-dashed") +
      rect(rx, ry - rh, width, rh, "lab-shape-2") +
      line(rx, ry, rx + width, ry - rh, "lab-dashed") +
      path(`M${rx + 14} ${ry} v-14 h-14`, "lab-angle") +
      text(150, 40, "Schrägbild (45°)", "lab-text", "middle") +
      text(390, 40, "Wahre Größe", "lab-text", "middle") +
      text(
        150,
        305,
        `${v.width} × ${fmt(v.depth * v.q, 2)} cm im Bild`,
        "lab-text-small",
        "middle",
      ) +
      text(390, 305, `${v.width} × ${v.depth} cm, Winkel 90°`, "lab-text-small", "middle") +
      "</svg>"
    );
  },
};

export const RAUM_VIEWS: Partial<Record<LabKind, LabView>> = {
  "solid-symmetry": solids,
  "axial-section": axial,
  "space-coordinates": coords,
  oblique: { render: drawOblique },
  "true-size": trueSize,
};
