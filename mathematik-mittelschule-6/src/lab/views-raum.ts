import { fmt } from "../exercises/format";
import {
  handle,
  line,
  open,
  polygon,
  rect,
  text,
  type LabView,
  type Pt,
} from "./svg";
import { rail, railHandle, title } from "./view-helpers";

/** Oblique drawing (Schrägbild): depth at 45° and half length, as learned in grade 5. */
function project(
  x: number,
  y: number,
  z: number,
  u: number,
  ox: number,
  oy: number,
): Pt {
  const q = 0.5 * Math.SQRT1_2;
  return { x: ox + (x + y * q) * u, y: oy - (z + y * q) * u };
}

function cuboidFaces(
  x: number,
  y: number,
  z: number,
  a: number,
  b: number,
  c: number,
  u: number,
  ox: number,
  oy: number,
  cls: string,
): string {
  const p = (dx: number, dy: number, dz: number) =>
    project(x + dx, y + dy, z + dz, u, ox, oy);
  return (
    polygon([p(0, 0, c), p(a, 0, c), p(a, b, c), p(0, b, c)], cls) +
    polygon([p(a, 0, 0), p(a, b, 0), p(a, b, c), p(a, 0, c)], cls) +
    polygon([p(0, 0, 0), p(a, 0, 0), p(a, 0, c), p(0, 0, c)], cls)
  );
}

const unitCubes: LabView = {
  render(v, r) {
    const u = Math.min(38, 300 / (v.a + 0.36 * v.b), 190 / (v.c + 0.36 * v.b));
    const ox = 90;
    const oy = 262;
    let out =
      open("Quader, schichtweise mit Einheitswürfeln gefüllt") +
      title(
        `${v.a} · ${v.b} = ${v.a * v.b} Würfel je Schicht, ${v.l} von ${v.c} Schichten`,
      );
    out += cuboidFaces(0, 0, 0, v.a, v.b, v.c, u, ox, oy, "lab-ghost-fill");
    const layers = Math.min(v.l, v.c);
    for (let z = 0; z < layers; z++)
      for (let y = v.b - 1; y >= 0; y--)
        for (let x = 0; x < v.a; x++)
          out += cuboidFaces(
            x,
            y,
            z,
            1,
            1,
            1,
            u,
            ox,
            oy,
            z % 2 === 0 ? "lab-fill-a" : "lab-fill-b",
          );
    return (
      out +
      text(500, 292, `Gefüllt: ${r.filled} ${r.unitName}`, "lab-text", "end") +
      rail("l", "Schichten", v.l, 0, 6, 312) +
      "</svg>"
    );
  },
  handles: { l: railHandle("l", 0, 6) },
};

const LADDER = ["m³", "dm³ = l", "cm³ = ml", "mm³"];

const volumeUnits: LabView = {
  render(v, r) {
    let out =
      open("Einheitenleiter der Raummaße") +
      title(`${fmt(v.amount)} ${r.fromName} = ${r.result} ${r.toName}`);
    LADDER.forEach((name, i) => {
      const y = 62 + i * 58;
      const active = i === v.from || i === v.to;
      out += rect(
        150,
        y,
        220,
        42,
        active ? (i === v.from ? "lab-fill-a" : "lab-fill-b") : "lab-cell",
      );
      out += text(260, y + 27, name, "lab-text", "middle");
      if (i < 3) {
        out += text(395, y + 54, "· 1000 ↓", "lab-text-small");
        out += text(125, y + 54, "↑ : 1000", "lab-text-small", "end");
      }
    });
    return (
      out +
      text(
        260,
        325,
        "Jede Stufe ist der Faktor 1000: 10 mal 10 mal 10.",
        "lab-text-small",
        "middle",
      ) +
      "</svg>"
    );
  },
};

const volumeBox: LabView = {
  render(v, r) {
    const u = Math.min(26, 300 / (v.a + 0.36 * v.b), 200 / (v.c + 0.36 * v.b));
    const ox = 80;
    const oy = 275;
    const level = (v.w / 100) * v.c;
    const handleAt = project(v.a, 0, level, u, ox, oy);
    return (
      open("Aquarium als Quader mit Wasserstand") +
      title(
        `V = ${fmt(v.a)} · ${fmt(v.b)} · ${fmt(v.c)} = ${fmt(Number(r.volume))} dm³`,
      ) +
      (level > 0
        ? cuboidFaces(0, 0, 0, v.a, v.b, level, u, ox, oy, "lab-fill-a")
        : "") +
      cuboidFaces(0, 0, 0, v.a, v.b, v.c, u, ox, oy, "lab-ghost-fill") +
      text(
        ox,
        300,
        `Wasser bis ${v.w} % der Höhe: ${fmt(Number(r.water))} l`,
        "lab-text",
      ) +
      handle("w", handleAt.x, handleAt.y, "Wasserstand") +
      "</svg>"
    );
  },
  handles: {
    w: {
      y: "w",
      drag: (q, v) => {
        const u = Math.min(
          26,
          300 / (v.a + 0.36 * v.b),
          200 / (v.c + 0.36 * v.b),
        );
        return { w: ((275 - q.y) / u / v.c) * 100 };
      },
    },
  },
};

const composite: LabView = {
  render(v, r) {
    const u = Math.min(30, 300 / (v.a + 0.36 * v.t), 190 / (v.b + 0.36 * v.t));
    const ox = 70;
    const oy = 280;
    let out =
      open("Zusammengesetzter Körper aus Quadern") + title(String(r.calc));
    if (v.mode === 0) {
      out += cuboidFaces(0, 0, 0, v.a, v.t, v.d, u, ox, oy, "lab-fill-a");
      out += cuboidFaces(
        0,
        0,
        v.d,
        v.c,
        v.t,
        v.b - v.d,
        u,
        ox,
        oy,
        "lab-fill-b",
      );
    } else {
      out += cuboidFaces(0, 0, 0, v.a, v.t, v.b, u, ox, oy, "lab-ghost-fill");
      out += cuboidFaces(0, 0, 0, v.a, v.t, v.d, u, ox, oy, "lab-fill-a");
      out += cuboidFaces(
        0,
        0,
        v.d,
        v.c,
        v.t,
        v.b - v.d,
        u,
        ox,
        oy,
        "lab-fill-a",
      );
    }
    return (
      out +
      line(ox, oy + 8, ox + v.a * u, oy + 8, "lab-axis") +
      text(
        ox + (v.a * u) / 2,
        oy + 26,
        `a = ${fmt(v.a)}`,
        "lab-text-small",
        "middle",
      ) +
      "</svg>"
    );
  },
};

export const RAUM_VIEWS = {
  "unit-cubes": unitCubes,
  "volume-units": volumeUnits,
  "volume-box": volumeBox,
  "composite-solid": composite,
};
