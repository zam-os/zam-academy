import { fmt } from "../exercises/format";
import type { ModelKind } from "../model/types";
import {
  BUILD_MATERIALS,
  bodyColour,
  CLOTHING,
  circuit,
  COLOUR_HEX,
  COLOUR_NAMES,
  coil,
  colouredShadows,
  compareMaterials,
  compass,
  density,
  ELEMENTS,
  eclipse,
  GAP_MATERIALS,
  irradiation,
  measurement,
  moonPhase,
  OBJECT_WIDTH,
  ordering,
  clipsHeld,
  penumbra,
  poles,
  pseudoNoise,
  RUB_PAIRS,
  rubbing,
  SCREEN,
  seeing,
  shadowSize,
  STOPPING_50,
  switching,
  TARGETS,
  visibility,
  atomCharge,
} from "../models";
import { esc } from "../workshop";

/**
 * The colour code of the package. One colour per kind of quantity, the same
 * in every figure and named in the legend below it:
 * p Nordpol und positive Ladung (rot) · sp Südpol (grün) · m Elektronen und
 * negative Ladung (blau) · s Länge und Volumen · f Kraft und Wirkung ·
 * e Licht · t Winkel und Ablesung · x Körper und Masse. The others mark a
 * verdict (ok, bad), a reference (mute), the accent of the stage (acc) and
 * the text colour (ink). styles.css holds the values for the light and the
 * dark theme as `--q-<tone>`. Coloured light keeps its real colour.
 */
export type Tone =
  | "p"
  | "sp"
  | "m"
  | "s"
  | "f"
  | "e"
  | "t"
  | "x"
  | "ok"
  | "bad"
  | "mute"
  | "acc"
  | "ink";

interface Figure {
  /** Text alternative: what the drawing shows with the current values. */
  label: string;
  height: number;
  body: string;
  /** Every colour the scene can show; the frame lists only those the drawing uses. */
  legend: Array<[Tone, string]>;
  /** Scenes that can move say what the motion shows; the learner starts it. */
  motion?: string;
}
type Values = Record<string, number>;
type Point = [number, number];

/** Every figure shares one canvas width; the height follows the scene. */
const W = 480;
const RAD = Math.PI / 180;
const clamp = (value: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, value));
/** One decimal keeps the markup short; -0 prints as 0. */
const n = (value: number): string => String(Math.round(value * 10) / 10 || 0);

const line = (x1: number, y1: number, x2: number, y2: number, tone: Tone, extra = ""): string =>
  `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" class="ln q-${tone}${extra ? ` ${extra}` : ""}"/>`;
const dot = (x: number, y: number, r: number, tone: Tone, extra = ""): string =>
  `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" class="fl q-${tone}${extra ? ` ${extra}` : ""}"/>`;
const ring = (x: number, y: number, r: number, tone: Tone, extra = ""): string =>
  `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" class="ln q-${tone}${extra ? ` ${extra}` : ""}"/>`;
const rect = (x: number, y: number, width: number, height: number, tone: Tone, extra = ""): string =>
  `<rect x="${n(x)}" y="${n(y)}" width="${n(Math.max(0, width))}" height="${n(Math.max(0, height))}" class="fl q-${tone}${extra ? ` ${extra}` : ""}"/>`;
/** A filled shape in a real colour of light or paint, outlined so it stands out in both themes. */
const paint = (shape: string, hex: string): string =>
  shape.replace("/>", ` fill="${hex}" class="painted"/>`);
const text = (
  x: number,
  y: number,
  content: string,
  tone: Tone = "ink",
  anchor: "start" | "middle" | "end" = "middle",
  extra = "",
): string =>
  `<text x="${n(x)}" y="${n(y)}" text-anchor="${anchor}" class="q-${tone}${extra ? ` ${extra}` : ""}">${esc(content)}</text>`;
const pathData = (points: Point[]): string =>
  points.map(([x, y], i) => `${i ? "L" : "M"}${n(x)} ${n(y)}`).join("");
const area = (points: Point[], tone: Tone, extra = "soft"): string =>
  `<path d="${pathData(points)}Z" class="fl q-${tone} ${extra}"/>`;

/** An arrow with a head drawn as a polygon, so it takes the tone in every browser. */
function arrow(x1: number, y1: number, x2: number, y2: number, tone: Tone, extra = ""): string {
  const dx = x2 - x1,
    dy = y2 - y1,
    length = Math.hypot(dx, dy);
  if (!(length >= 1)) return "";
  const ux = dx / length,
    uy = dy / length,
    head = Math.min(12, length * 0.7),
    half = head * 0.45,
    bx = x2 - ux * head,
    by = y2 - uy * head;
  return `<g class="q-${tone}${extra ? ` ${extra}` : ""}"><line x1="${n(x1)}" y1="${n(y1)}" x2="${n(bx)}" y2="${n(by)}" class="ln thick"/><polygon points="${n(x2)},${n(y2)} ${n(bx - uy * half)},${n(by + ux * half)} ${n(bx + uy * half)},${n(by - ux * half)}" class="fl"/></g>`;
}
/** A thin light ray with a small arrow head in the middle, as drawn in class. */
function ray(x1: number, y1: number, x2: number, y2: number, tone: Tone = "e", extra = ""): string {
  const mx = (x1 + x2) / 2,
    my = (y1 + y2) / 2,
    length = Math.hypot(x2 - x1, y2 - y1);
  if (!(length >= 1)) return "";
  const ux = (x2 - x1) / length,
    uy = (y2 - y1) / length;
  return `${line(x1, y1, x2, y2, tone, `thin${extra ? ` ${extra}` : ""}`)}<polygon points="${n(mx + ux * 6)},${n(my + uy * 6)} ${n(mx - ux * 4 - uy * 4)},${n(my - uy * 4 + ux * 4)} ${n(mx - ux * 4 + uy * 4)},${n(my - uy * 4 - ux * 4)}" class="fl q-${tone}"/>`;
}
/** A measure with end ticks, for lengths. */
const span = (x1: number, x2: number, y: number, tone: Tone): string =>
  `<path d="M${n(x1)} ${n(y - 5)}V${n(y + 5)}M${n(x1)} ${n(y)}H${n(x2)}M${n(x2)} ${n(y - 5)}V${n(y + 5)}" class="ln q-${tone}"/>`;
/** A bar magnet lying horizontally: the left half shows `left`, the right half the other pole. */
function barMagnet(x: number, y: number, length: number, left: "N" | "S", height = 34): string {
  const half = length / 2,
    leftTone: Tone = left === "N" ? "p" : "sp",
    rightTone: Tone = left === "N" ? "sp" : "p";
  return (
    rect(x, y, half, height, leftTone, "body") +
    rect(x + half, y, half, height, rightTone, "body") +
    text(x + half / 2, y + height + 18, left === "N" ? "Nordpol" : "Südpol", leftTone, "middle", "tick") +
    text(x + half + half / 2, y + height + 18, left === "N" ? "Südpol" : "Nordpol", rightTone, "middle", "tick") +
    text(x + half / 2, y + height / 2 + 5, left, "ink", "middle", "strong") +
    text(x + half + half / 2, y + height / 2 + 5, left === "N" ? "S" : "N", "ink", "middle", "strong")
  );
}
/** A short two-coloured needle around (x, y), pointing with its north end at `deg` (0 = right, 90 = up). */
function needle(x: number, y: number, length: number, deg: number, width = 3): string {
  const ux = Math.cos(deg * RAD),
    uy = -Math.sin(deg * RAD),
    h = length / 2;
  return `<line x1="${n(x)}" y1="${n(y)}" x2="${n(x + ux * h)}" y2="${n(y + uy * h)}" class="ln q-p" style="stroke-width:${width}"/><line x1="${n(x)}" y1="${n(y)}" x2="${n(x - ux * h)}" y2="${n(y - uy * h)}" class="ln q-sp" style="stroke-width:${width}"/>`;
}
/** A lamp symbol: circle with a cross; it glows when lit. */
function lampSymbol(x: number, y: number, lit: boolean, r = 14): string {
  const d = r * 0.7;
  return (
    (lit ? dot(x, y, r + 12, "e", "soft-strong") : "") +
    `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" class="fig-fill ln q-ink"/>` +
    line(x - d, y - d, x + d, y + d, "ink", "thin") +
    line(x - d, y + d, x + d, y - d, "ink", "thin")
  );
}
/** A battery symbol, vertical: the long plate is the plus pole. */
function battery(x: number, y: number): string {
  return (
    `<rect x="${n(x - 16)}" y="${n(y - 9)}" width="32" height="18" class="fig-fill"/>` +
    line(x - 15, y - 5, x + 15, y - 5, "ink", "thick") +
    line(x - 8, y + 5, x + 8, y + 5, "ink", "thick") +
    text(x + 26, y - 1, "+", "ink", "start", "strong") +
    text(x + 26, y + 16, "−", "ink", "start", "strong")
  );
}
/** A simple eye looking left. */
function eye(x: number, y: number): string {
  return (
    `<path d="M${x - 22} ${y}Q${x} ${y - 16} ${x + 22} ${y}Q${x} ${y + 16} ${x - 22} ${y}Z" class="fig-fill ln q-ink"/>` +
    dot(x - 6, y, 6, "ink")
  );
}

const FIGURES: Record<ModelKind, (v: Values) => Figure> = {
  einstrahlung: (v) => {
    const h = v.h,
      r = irradiation(h),
      cx = 240,
      cy = 236,
      half = clamp(25 / Math.sin(h * RAD), 25, 190),
      dx = -Math.cos(h * RAD),
      dy = -Math.sin(h * RAD),
      reach = 190,
      p1: Point = [cx - half, cy],
      p2: Point = [cx + half, cy],
      q1: Point = [p1[0] + dx * reach, p1[1] + dy * reach],
      q2: Point = [p2[0] + dx * reach, p2[1] + dy * reach],
      lx = cx + dx * (reach + 12),
      ly = cy + dy * (reach + 12),
      arcR = 46,
      ax = cx - arcR,
      ay = cy,
      bx = cx + dx * arcR,
      by = cy + dy * arcR;
    return {
      label: `Ein paralleles Lichtbündel trifft unter ${fmt(h)} Grad auf eine waagrechte Fläche. Der Lichtfleck ist ${fmt(r.area, 2)}-mal so lang wie bei senkrechtem Einfall; jede Stelle erhält ${fmt(100 * r.share, 0)} Prozent des Lichts.`,
      height: 300,
      body:
        area([p1, p2, q2, q1], "e", "soft") +
        line(p1[0], p1[1], q1[0], q1[1], "e", "thin") +
        line(p2[0], p2[1], q2[0], q2[1], "e", "thin") +
        `<rect x="${n(lx - 22)}" y="${n(ly - 12)}" width="44" height="24" rx="5" transform="rotate(${n(-h)} ${n(lx)} ${n(ly)})" class="fl q-ink"/>` +
        line(30, cy, 450, cy, "mute") +
        `<line x1="${n(p1[0])}" y1="${cy}" x2="${n(p2[0])}" y2="${cy}" class="ln q-e" style="stroke-width:9;stroke-opacity:${n(0.25 + 0.75 * r.share)}"/>` +
        (h < 90
          ? `<path d="M${n(ax)} ${n(ay)}A${arcR} ${arcR} 0 0 1 ${n(bx)} ${n(by)}" class="ln q-t"/>` +
            text(cx - arcR - 8, cy - 14, `${fmt(h)}°`, "t", "end")
          : text(cx + 14, cy - 40, "90°", "t", "start")) +
        span(p1[0], p2[0], cy + 22, "s") +
        text(cx, cy + 46, `Lichtfleck: ${fmt(r.area, 2)} × so lang wie bei 90°`, "s"),
      legend: [
        ["e", "Lichtbündel und Lichtfleck, heller bei mehr Licht je Fläche"],
        ["t", "Winkel zwischen Bündel und Fläche"],
        ["s", "Länge des Lichtflecks"],
      ],
    };
  },
  pole: (v) => {
    const r = poles(v.like, v.d, v.between),
      gap = 14 * v.d,
      y = 70,
      left = 40,
      length = 150,
      start = left + length + gap,
      plate = v.between,
      mid = left + length + gap / 2,
      force = r.kind === "kaum spürbar" ? 0 : clamp(10 + 9 * Math.sqrt(r.strength), 14, 100),
      dir = r.kind === "Anziehung" ? 1 : -1;
    const shapes = [
      "",
      line(mid, y - 20, mid, y + 54, "mute", "thin"),
      rect(mid - 5, y - 20, 10, 74, "mute", "soft-strong"),
      rect(mid - 4, y - 20, 8, 74, "mute"),
    ];
    return {
      label: `Zwei Stabmagnete im Abstand von ${fmt(v.d)} Zentimetern; dem Nordpol links steht ein ${v.like ? "Nordpol" : "Südpol"} gegenüber. Dazwischen: ${["Luft", "Papier", "ein Holzbrett", "ein Eisenblech"][plate]}. Ergebnis: ${r.kind}.`,
      height: 200,
      body:
        barMagnet(left, y, length, "S") +
        barMagnet(start, y, length, v.like ? "N" : "S") +
        shapes[plate] +
        (force
          ? arrow(left + length / 2, y - 26, left + length / 2 + dir * force, y - 26, "f") +
            arrow(start + length / 2, y - 26, start + length / 2 - dir * force, y - 26, "f")
          : "") +
        text(240, 190, `${r.kind}${r.screened ? ": Das Eisenblech schirmt ab" : ""}`, r.kind === "kaum spürbar" ? "mute" : "f"),
      legend: [
        ["p", "Nordpol"],
        ["sp", "Südpol"],
        ["f", "Kraft auf jeden Magneten"],
        ["mute", "Schicht zwischen den Magneten"],
      ],
    };
  },
  elementar: (v) => {
    const order = ordering(v.material, v.strokes, v.treat),
      clips = clipsHeld(order, v.split),
      split = v.split === 1,
      copper = v.material === 1,
      x0 = 50,
      x1 = 430,
      y0 = 70,
      y1 = 140,
      cols = 14,
      rows = 3;
    let body = "";
    const pieces: Array<[number, number]> = split
      ? [
          [x0, 234],
          [246, x1],
        ]
      : [[x0, x1]];
    for (const [a, b] of pieces)
      body += `<rect x="${a}" y="${y0}" width="${b - a}" height="${y1 - y0}" rx="8" class="${copper ? "copper" : "steel"}"/>`;
    if (!copper)
      for (let row = 0; row < rows; row++)
        for (let col = 0; col < cols; col++) {
          const i = row * cols + col,
            x = x0 + 16 + col * ((x1 - x0 - 32) / (cols - 1)),
            y = y0 + 16 + row * 19,
            ordered = (pseudoNoise(i, 31) + 1) / 2 < order,
            angle = ordered ? 0 : ((pseudoNoise(i, 32) + 1) / 2) * 360;
          if (split && x > 228 && x < 252) continue;
          body += needle(x, y, 16, angle, 2.6);
        }
    else
      for (let i = 0; i < 18; i++)
        body += dot(x0 + 20 + i * 20, (y0 + y1) / 2, 2.5, "x");
    if (order > 0.3)
      for (const [a, b] of pieces)
        body +=
          text(a + 14, y1 + 22, "S", "sp", "middle", "strong") +
          text(b - 14, y1 + 22, "N", "p", "middle", "strong");
    for (let i = 0; i < Math.min(clips, 6); i++)
      body += `<rect x="${n(x1 - 26)}" y="${n(y1 + 30 + i * 18)}" width="16" height="14" rx="6" class="ln q-mute"/>`;
    if (v.strokes > 0)
      body +=
        rect(74, 2, 16, 18, "p", "body") +
        rect(74, 20, 16, 18, "sp", "body") +
        text(98, 34, "Südpol streicht", "sp", "start", "tick") +
        arrow(200, 22, 400, 22, "f") +
        text(410, 27, `${fmt(v.strokes)} Striche`, "f", "start", "tick");
    body += text(240, 56, copper ? "Kupfer: keine Elementarmagnete" : `${fmt(100 * order, 0)} % der Elementarmagnete geordnet`, copper ? "x" : "ink", "middle", "tick");
    if (v.treat > 0) body += text(240, y1 + 40, v.treat === 1 ? "danach kräftig geschlagen" : "danach stark erhitzt", "bad", "middle", "tick");
    return {
      label: copper
        ? "Ein Kupferdraht. Im Modell besitzt Kupfer keine Elementarmagnete; er wird nicht magnetisch."
        : `Eine Stahlnadel${split ? ", in der Mitte geteilt," : ""} mit 42 Elementarmagneten. ${fmt(100 * order, 0)} Prozent zeigen mit dem Nordpol nach rechts. Die Nadel hält ${clips} Büroklammern.`,
      height: 260,
      body,
      legend: [
        ["p", "Nordpol eines Elementarmagneten"],
        ["sp", "Südpol eines Elementarmagneten"],
        ["mute", "Büroklammern, die die Nadel hält"],
        ["f", "Strichrichtung: Am Ende des Strichs entsteht der Nordpol"],
        ["x", "Kupfer: im Modell ohne Elementarmagnete"],
        ["bad", "Behandlung danach"],
      ],
    };
  },
  kompass: (v) => {
    const r = compass(v.rot, v.target),
      cx = 240,
      cy = 175,
      size = 230,
      toPoint = (bearing: number, dist: number): Point => [
        cx + dist * Math.sin(bearing * RAD),
        cy - dist * Math.cos(bearing * RAD),
      ];
    let map = rect(cx - size / 2, cy - size / 2, size, size, "mute", "soft");
    for (let i = 1; i < 4; i++)
      map +=
        line(cx - size / 2 + (i * size) / 4, cy - size / 2, cx - size / 2 + (i * size) / 4, cy + size / 2, "mute", "thin") +
        line(cx - size / 2, cy - size / 2 + (i * size) / 4, cx + size / 2, cy - size / 2 + (i * size) / 4, "mute", "thin");
    map += arrow(cx - size / 2 + 22, cy - size / 2 + 46, cx - size / 2 + 22, cy - size / 2 + 12, "acc") + text(cx - size / 2 + 36, cy - size / 2 + 26, "N", "acc", "start", "strong");
    for (const t of TARGETS) {
      const [x, y] = toPoint(t.bearing, 88);
      map += dot(x, y, 6, t.name === r.name ? "t" : "mute") + text(x, y - 11, t.name, t.name === r.name ? "t" : "mute", "middle", "tick");
    }
    map += line(cx, cy, ...toPoint(r.bearing, 80), "t", "dash");
    const [mx, my] = toPoint(r.bearing + v.rot, 112),
      [tx, ty] = toPoint(r.bearing, 112);
    return {
      label: `Wanderkarte, um ${fmt(v.rot)} Grad gegen Norden gedreht. Die Kompassnadel zeigt nach Norden. Ziel ${r.name}: laut ${r.oriented ? "eingenordeter " : "verdrehter "}Karte in Richtung ${fmt((r.bearing + v.rot) % 360)} Grad; tatsächlich liegt es im ${r.direction}.`,
      height: 360,
      body:
        `<g transform="rotate(${n(v.rot)} ${cx} ${cy})">${map}</g>` +
        ring(cx, cy, 30, "ink", "thin") +
        `<circle cx="${cx}" cy="${cy}" r="30" class="fig-fill" style="opacity:0.7"/>` +
        needle(cx, cy, 52, 90, 4) +
        arrow(cx, cy, mx, my, "t") +
        (r.oriented ? "" : arrow(cx, cy, tx, ty, "ok", "dash")) +
        text(cx, 22, "Norden im Gelände", "ink", "middle", "tick") +
        text(cx, 350, r.oriented ? `Karte eingenordet: ${r.name} liegt im ${r.direction}` : `Karte um ${fmt(r.offset)}° verdreht: Die Karte zeigt eine falsche Richtung`, r.oriented ? "ok" : "bad"),
      legend: [
        ["p", "Nordpol der Kompassnadel"],
        ["t", "Richtung zum Ziel, abgelesen auf der Karte"],
        ["ok", "tatsächliche Richtung zum Ziel"],
        ["acc", "Nordpfeil der Karte"],
      ],
    };
  },
  dichte: (v) => {
    const r = density(v.material, v.V),
      side = 26 * Math.cbrt(v.V),
      depth = side * 0.45,
      x = 70,
      yb = 230,
      water = v.V,
      top = Math.max(r.mass, water) * 1.15,
      scale = (m: number) => (m / top) * 180,
      barX = [300, 380];
    return {
      label: `Ein Würfel aus ${r.name} mit ${fmt(v.V)} Kubikzentimetern hat die Masse ${fmt(r.mass, 1)} Gramm. Wasser mit gleichem Volumen hätte ${fmt(water)} Gramm.`,
      height: 290,
      body:
        `<path d="M${n(x)} ${n(yb - side)}l${n(depth)} ${n(-depth)}h${n(side)}l${n(-depth)} ${n(depth)}Z" class="fl q-x soft-strong ln"/>` +
        `<path d="M${n(x + side)} ${n(yb)}l${n(depth)} ${n(-depth)}v${n(-side)}l${n(-depth)} ${n(depth)}Z" class="fl q-x hatch ln"/>` +
        rect(x, yb - side, side, side, "x", "soft") +
        `<rect x="${n(x)}" y="${n(yb - side)}" width="${n(side)}" height="${n(side)}" class="ln q-x"/>` +
        text(x + side / 2, yb + 22, `${fmt(v.V)} cm³ ${r.name}`, "x", "middle", "tick") +
        line(270, 230, 450, 230, "mute") +
        rect(barX[0], 230 - scale(r.mass), 44, scale(r.mass), "x") +
        rect(barX[1], 230 - scale(water), 44, scale(water), "s") +
        text(barX[0] + 22, 222 - scale(r.mass), `${fmt(r.mass, 1)} g`, "x") +
        text(barX[1] + 22, 222 - scale(water), `${fmt(water)} g`, "s") +
        text(barX[0] + 22, 252, "Würfel", "x", "middle", "tick") +
        text(barX[1] + 22, 252, "Wasser", "s", "middle", "tick") +
        text(240, 280, `ρ = m / V = ${fmt(r.rho, 2)} g/cm³`, "ink"),
      legend: [
        ["x", "Würfel und seine Masse"],
        ["s", "Masse von Wasser mit gleichem Volumen"],
      ],
    };
  },
  messzylinder: (v) => {
    const r = measurement(v.sample, v.scale),
      x = 90,
      w = 70,
      bottom = 270,
      ml = 2.2,
      yOf = (value: number) => bottom - value * ml,
      trueLevel = r.v1 + [8, 6, 15][v.sample];
    let scale = "";
    for (let value = 0; value <= 100; value += r.step)
      scale += line(x + w - (value % 10 === 0 ? 18 : 10), yOf(value), x + w, yOf(value), "ink", "thin");
    for (let value = 10; value <= 100; value += 10)
      scale += text(x + w + 6, yOf(value) + 4, `${value}`, "ink", "start", "tick");
    // Zoomed view of the readings between 40 and 75 ml.
    const zx = 300,
      zw = 120,
      zTop = 40,
      zBottom = 250,
      zLo = 40,
      zHi = 75,
      zy = (value: number) => zBottom - ((value - zLo) / (zHi - zLo)) * (zBottom - zTop);
    let zoom = `<rect x="${zx}" y="${zTop}" width="${zw}" height="${zBottom - zTop}" class="fig-fill ln q-mute"/>`;
    zoom += rect(zx, zy(trueLevel), zw, zBottom - zy(trueLevel), "s", "soft");
    zoom += rect(zx, zy(r.v2 + r.step / 2), zw, zy(r.v2 - r.step / 2) - zy(r.v2 + r.step / 2), "t", "soft");
    for (let value = zLo; value <= zHi; value += r.step)
      zoom += line(zx, zy(value), zx + (value % 10 === 0 ? 30 : 18), zy(value), "ink", "thin") + (value % 5 === 0 ? text(zx + 36, zy(value) + 4, `${value}`, "ink", "start", "tick") : "");
    zoom +=
      line(zx, zy(trueLevel), zx + zw, zy(trueLevel), "s") +
      line(zx, zy(r.v2), zx + zw, zy(r.v2), "t", "dash") +
      line(zx, zy(r.v1), zx + zw, zy(r.v1), "mute", "dash") +
      text(zx + zw / 2, zTop - 10, "Lupe: 40 bis 75 ml", "ink", "middle", "tick");
    return {
      label: `Messzylinder mit ${r.step}-ml-Teilung. Vorher 50 Milliliter, mit ${r.name} abgelesen ${r.v2} Milliliter. Die Dichte liegt zwischen ${fmt(r.rhoMin, 1)} und ${fmt(r.rhoMax, 1)} Gramm pro Kubikzentimeter.`,
      height: 300,
      body:
        `<rect x="${x}" y="${yOf(100) - 6}" width="${w}" height="${100 * ml + 6}" rx="6" class="fig-fill ln q-ink"/>` +
        rect(x + 2, yOf(trueLevel), w - 4, trueLevel * ml - 2, "s", "soft-strong") +
        line(x, yOf(r.v1), x + w, yOf(r.v1), "mute", "dash") +
        `<path d="M${x + 22} ${yOf(10)}l12 -14l14 6l4 16l-12 10l-16 -4Z" class="fl q-x body"/>` +
        line(x + 35, yOf(10) - 10, x + 35, yOf(100), "mute", "thin") +
        scale +
        line(x - 10, yOf(r.v2), x + w + 2, yOf(r.v2), "t", "dash") +
        text(x - 14, yOf(r.v2) + 4, `${r.v2} ml`, "t", "end", "tick") +
        text(x - 14, yOf(r.v1) + 14, `${r.v1} ml`, "mute", "end", "tick") +
        zoom +
        text(240, 292, `V = ${r.volume} cm³ ± ${fmt(r.step / 2, 1)} cm³`, "t"),
      legend: [
        ["s", "Wasser mit eingetauchtem Körper"],
        ["t", "abgelesener Wasserstand und Ablesebereich"],
        ["x", "Körper am Faden"],
        ["mute", "Wasserstand vorher"],
      ],
    };
  },
  werkstoff: (v) => {
    const r = compareMaterials(v.a, v.b, v.V),
      tilt = clamp((Math.atan((r.ma - r.mb) / (r.ma + r.mb)) * 180) / Math.PI, -14, 14),
      cx = 240,
      cy = 110,
      arm = 140,
      lx = cx - arm * Math.cos(tilt * RAD),
      ly = cy + arm * Math.sin(tilt * RAD),
      rx = cx + arm * Math.cos(tilt * RAD),
      ry = cy - arm * Math.sin(tilt * RAD),
      block = 18 + v.V / 25;
    const pan = (x: number, y: number, tone: Tone, name: string, mass: number) =>
      line(x, y, x, y + 50, "mute", "thin") +
      line(x - 50, y + 50, x + 50, y + 50, "mute") +
      rect(x - block / 2, y + 50 - block, block, block, tone, "body") +
      text(x, y + 74, name, tone, "middle", "tick") +
      text(x, y + 92, `${fmt(mass, 2)} kg`, tone);
    return {
      label: `Balkenwaage: links ein Bauteil aus ${BUILD_MATERIALS[v.a].name} mit ${fmt(r.ma, 2)} Kilogramm, rechts ein gleich großes aus ${BUILD_MATERIALS[v.b].name} mit ${fmt(r.mb, 2)} Kilogramm.`,
      height: 280,
      body:
        `<path d="M${cx} ${cy}l-26 140h52Z" class="fl q-mute soft-strong"/>` +
        line(lx, ly, rx, ry, "ink", "thick") +
        dot(cx, cy, 5, "ink") +
        pan(lx, ly, "x", `A: ${BUILD_MATERIALS[v.a].name}`, r.ma) +
        pan(rx, ry, "s", `B: ${BUILD_MATERIALS[v.b].name}`, r.mb) +
        text(cx, 272, r.ma === r.mb ? "Gleiche Masse" : `Unterschied: ${fmt(Math.abs(r.difference), 2)} kg bei je ${fmt(v.V)} cm³`, "ink"),
      legend: [
        ["x", "Bauteil aus Werkstoff A"],
        ["s", "Bauteil aus Werkstoff B, gleiches Volumen"],
        ["mute", "Balkenwaage"],
      ],
    };
  },
  sehen: (v) => {
    const r = seeing(v.lamp, v.wall1, v.wall2),
      L: Point = [70, 70],
      B: Point = [230, 220],
      E: Point = [420, 110],
      w1: Point = [150, 145],
      w2: Point = [325, 165];
    let body = "";
    if (v.lamp) {
      body += ray(L[0], L[1], E[0] - 24, E[1] - 2, "e", "dash");
      body += v.wall1 ? ray(L[0], L[1], w1[0] - 6, w1[1] - 5) : ray(L[0], L[1], B[0] - 8, B[1] - 14);
      if (r.lit) body += v.wall2 ? ray(B[0] + 10, B[1] - 12, w2[0] - 4, w2[1] + 2) : ray(B[0] + 10, B[1] - 12, E[0] - 22, E[1] + 4);
    }
    body +=
      (v.lamp ? dot(L[0], L[1], 26, "e", "soft-strong") : "") +
      dot(L[0], L[1], 13, v.lamp ? "e" : "mute", "body") +
      text(L[0], L[1] - 28, v.lamp ? "Lampe an" : "Lampe aus", v.lamp ? "e" : "mute") +
      `<rect x="${B[0] - 30}" y="${B[1] - 12}" width="60" height="24" rx="3" class="${r.lit ? "book lit" : "book"}"/>` +
      text(B[0], B[1] + 34, r.lit ? "Buch, beleuchtet" : "Buch, dunkel", "ink", "middle", "tick") +
      (v.wall1 ? rect(w1[0] - 6, w1[1] - 40, 12, 80, "mute") : "") +
      (v.wall2 ? rect(w2[0] - 6, w2[1] - 40, 12, 80, "mute") : "") +
      eye(E[0], E[1]) +
      text(E[0], E[1] + 36, r.seesBook ? "sieht das Buch" : "sieht das Buch nicht", r.seesBook ? "ok" : "bad", "middle", "tick");
    return {
      label: `Lampe ${v.lamp ? "an" : "aus"}. ${r.lit ? "Licht erreicht das Buch." : "Das Buch bekommt kein Licht."} ${r.seesBook ? "Licht vom Buch gelangt ins Auge: Das Buch ist zu sehen." : "Kein Licht vom Buch gelangt ins Auge: Das Buch ist nicht zu sehen."}`,
      height: 270,
      body,
      legend: [
        ["e", "Lichtstrahlen (Modell), gestrichelt direkt ins Auge"],
        ["ink", "Buch und Auge"],
        ["mute", "ausgeschaltete Lampe und undurchsichtiger Schirm"],
      ],
    };
  },
  farbe: (v) => {
    const r = bodyColour(v.light, v.object),
      parts = [1, 2, 4],
      hexOf = (bit: number) => COLOUR_HEX[bit],
      objectX = 250,
      objectY = 150;
    let body =
      dot(60, 70, 24, "e", "soft-strong") +
      dot(60, 70, 16, "ink") +
      paint(`<circle cx="60" cy="70" r="12"/>`, hexOf(r.incoming)) +
      text(60, 40, `Licht: ${COLOUR_NAMES[r.incoming]}`, "ink", "middle", "tick");
    parts.forEach((bit, i) => {
      if (!(r.incoming & bit)) return;
      const y0 = 64 + i * 6,
        y1 = objectY - 20 + i * 14;
      body += `<line x1="80" y1="${y0}" x2="${objectX - 40}" y2="${y1}" style="stroke:${hexOf(bit)}" class="ln colour-ray"/>`;
      if (r.seen & bit)
        body += `<line x1="${objectX + 36}" y1="${y1}" x2="400" y2="${110 + i * 8}" style="stroke:${hexOf(bit)}" class="ln colour-ray"/>`;
      else body += text(objectX - 40, y1 + 4, "≈", "f", "end", "strong");
    });
    body +=
      paint(`<ellipse cx="${objectX}" cy="${objectY}" rx="40" ry="34"/>`, hexOf(r.seen)) +
      text(objectX, objectY + 60, `Gegenstand im weißen Licht: ${COLOUR_NAMES[r.reflects]}`, "ink", "middle", "tick") +
      eye(420, 118) +
      text(420, 160, `sieht ${r.name}`, "ink", "middle", "tick") +
      (r.absorbed ? text(objectX - 54, objectY + 36, "absorbiert: Wärme", "f", "end", "tick") : "");
    return {
      label: `${COLOUR_NAMES[r.incoming]}es Licht trifft einen Gegenstand, der im weißen Licht ${COLOUR_NAMES[r.reflects]} ist. Er reflektiert ${r.seen ? COLOUR_NAMES[r.seen] : "kein Licht"} und erscheint ${r.name}.`,
      height: 250,
      body,
      legend: [
        ["e", "Lampe"],
        ["ink", "Gegenstand und Auge; Strahlen in ihrer Lichtfarbe"],
        ["f", "absorbierter Anteil, der zu Wärme wird"],
      ],
    };
  },
  farbschatten: (v) => {
    const r = colouredShadows(v.r, v.g, v.b),
      lamps = [
        { bit: 1, x: 150, on: v.r },
        { bit: 2, x: 240, on: v.g },
        { bit: 4, x: 330, on: v.b },
      ],
      ly = 46,
      rodY = 136,
      wallY = 236,
      k = (wallY - ly) / (rodY - ly);
    let body = rect(40, wallY, 400, 40, "ink", "soft");
    body += paint(`<rect x="40" y="${wallY}" width="400" height="40"/>`, COLOUR_HEX[r.wall]);
    for (const lamp of lamps) {
      body += lamp.on
        ? paint(`<circle cx="${lamp.x}" cy="${ly}" r="13"/>`, COLOUR_HEX[lamp.bit])
        : ring(lamp.x, ly, 13, "mute", "dash");
      if (!lamp.on) continue;
      const centre = lamp.x + (240 - lamp.x) * k,
        half = 6 * k,
        colour = r.shadows.find((s) => s.lamp === lamp.bit)!.colour;
      body +=
        line(lamp.x, ly, centre - half, wallY, "mute", "thin dash") +
        line(lamp.x, ly, centre + half, wallY, "mute", "thin dash") +
        paint(`<rect x="${n(centre - half)}" y="${wallY}" width="${n(2 * half)}" height="40"/>`, COLOUR_HEX[colour]) +
        text(centre, wallY + 58, COLOUR_NAMES[colour], "ink", "middle", "tick");
    }
    body += rect(234, rodY - 30, 12, 60, "ink") + text(262, rodY - 18, "Stab", "ink", "start", "tick") + text(240, wallY - 8, `Wand: ${COLOUR_NAMES[r.wall]}`, "ink", "middle", "tick");
    return {
      label: `${r.shadows.length} ${r.shadows.length === 1 ? "Lampe beleuchtet" : "Lampen beleuchten"} einen Stab vor einer weißen Wand. Die Wand erscheint ${COLOUR_NAMES[r.wall]}. Farben der Schatten: ${r.shadows.map((s) => COLOUR_NAMES[s.colour]).join(", ") || "keine"}.`,
      height: 310,
      body,
      legend: [
        ["ink", "Stab und weiße Wand, Lampen und Schatten in ihrer Farbe"],
        ["mute", "Randstrahlen, ausgeschaltete Lampe"],
      ],
    };
  },
  schatten: (v) => {
    const r = shadowSize(v.a, v.g),
      lampX = 40,
      screenX = 440,
      px = (screenX - lampX) / SCREEN,
      vy = 5,
      cy = 150,
      ox = lampX + v.a * px,
      half = (v.g / 2) * vy,
      shadowHalf = clamp((r.size / 2) * vy, 0, 135),
      clipped = (r.size / 2) * vy > 135;
    return {
      label: `Punktförmige Lampe, Gegenstand von ${fmt(v.g)} Zentimetern in ${fmt(v.a)} Zentimetern Abstand, Schirm in ${SCREEN} Zentimetern. Der Schatten ist ${fmt(r.size, 1)} Zentimeter groß.`,
      height: 300,
      body:
        area([[lampX, cy], [screenX, 15], [screenX, 285]], "e", "soft") +
        area([[ox, cy - half], [screenX, cy - shadowHalf], [screenX, cy + shadowHalf], [ox, cy + half]], "ink", "soft-strong") +
        ray(lampX, cy, screenX, cy - shadowHalf) +
        ray(lampX, cy, screenX, cy + shadowHalf) +
        dot(lampX, cy, 9, "e", "body") +
        rect(ox - 3, cy - half, 6, 2 * half, "x") +
        line(screenX, 10, screenX, 290, "ink") +
        rect(screenX, cy - shadowHalf, 10, 2 * shadowHalf, "ink") +
        text(screenX - 6, Math.max(14, cy - shadowHalf - 8), `${fmt(r.size, 1)} cm${clipped ? " (größer als das Bild)" : ""}`, "ink", "end", "tick") +
        span(lampX, ox, 290, "s") +
        text((lampX + ox) / 2, 283, `${fmt(v.a)} cm`, "s", "middle", "tick"),
      legend: [
        ["e", "Licht und Randstrahlen"],
        ["x", "Gegenstand"],
        ["ink", "Schattenraum, Schirm und Schatten"],
        ["s", "Abstand Lampe bis Gegenstand"],
      ],
    };
  },
  halbschatten: (v) => {
    const extended = v.source === 1,
      r = penumbra(v.d, v.a),
      lampX = 40,
      screenX = 440,
      px = (screenX - lampX) / SCREEN,
      vy = 4,
      cy = 150,
      ox = lampX + v.a * px,
      k = SCREEN / v.a,
      lamps = [-v.d / 2, v.d / 2],
      edge = (lampY: number, objY: number) => lampY + (objY - lampY) * k,
      sy = (cm: number) => clamp(cy - cm * vy, 6, 294);
    let body = line(screenX, 10, screenX, 290, "ink");
    const lo = edge(lamps[1], -OBJECT_WIDTH / 2),
      hi = edge(lamps[0], OBJECT_WIDTH / 2),
      coreLo = edge(lamps[0], -OBJECT_WIDTH / 2),
      coreHi = edge(lamps[1], OBJECT_WIDTH / 2);
    // Screen bands: half shadow (or transition) outside, core shadow inside.
    if (extended)
      body +=
        `<defs><linearGradient id="ph7-up" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="currentColor" stop-opacity="0.9"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient><linearGradient id="ph7-down" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity="0.9"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs>` +
        `<g class="q-ink gradient"><rect x="${screenX}" y="${n(sy(hi))}" width="12" height="${n(Math.max(0, sy(Math.max(coreHi, coreLo)) - sy(hi)))}" fill="url(#ph7-up)"/><rect x="${screenX}" y="${n(sy(Math.min(coreLo, coreHi)))}" width="12" height="${n(Math.max(0, sy(lo) - sy(Math.min(coreLo, coreHi))))}" fill="url(#ph7-down)"/></g>`;
    else body += rect(screenX, sy(hi), 12, sy(lo) - sy(hi), "mute", "soft-strong");
    if (r.core > 0) body += rect(screenX, sy(r.core / 2), 12, sy(-r.core / 2) - sy(r.core / 2), "ink");
    if (r.gap > 0) body += rect(screenX, sy(r.gap / 2), 12, sy(-r.gap / 2) - sy(r.gap / 2), "e", "soft");
    for (const lampY of lamps)
      body +=
        line(lampX, sy(lampY), screenX, sy(edge(lampY, OBJECT_WIDTH / 2)), "e", "thin") +
        line(lampX, sy(lampY), screenX, sy(edge(lampY, -OBJECT_WIDTH / 2)), "e", "thin");
    body += extended
      ? rect(lampX - 5, sy(v.d / 2), 10, v.d * vy, "e", "body")
      : dot(lampX, sy(lamps[0]), 7, "e", "body") + dot(lampX, sy(lamps[1]), 7, "e", "body");
    body +=
      rect(ox - 3, sy(OBJECT_WIDTH / 2), 6, OBJECT_WIDTH * vy, "x") +
      text(screenX - 8, Math.max(16, sy(hi) - 8), extended ? "Übergangsschatten" : "Halbschatten", "mute", "end", "tick") +
      (r.core > 0 ? text(screenX - 8, cy + 4, `Kernschatten ${fmt(r.core, 1)} cm`, "ink", "end", "tick") : text(screenX - 8, cy + 4, "kein Kernschatten", "ink", "end", "tick"));
    return {
      label: `${extended ? "Eine ausgedehnte Leuchte" : "Zwei kleine Lampen"} über ${fmt(v.d)} Zentimeter, Gegenstand von ${OBJECT_WIDTH} Zentimetern in ${fmt(v.a)} Zentimetern Abstand. Kernschatten ${fmt(r.core, 1)} Zentimeter, ${extended ? "Übergangsschatten" : "Halbschatten"} je ${fmt(r.half, 1)} Zentimeter.`,
      height: 300,
      body,
      legend: [
        ["e", "Lampen und Randstrahlen"],
        ["x", "Gegenstand"],
        ["ink", "Kernschatten auf dem Schirm"],
        ["mute", extended ? "Übergangsschatten" : "Halbschatten"],
      ],
    };
  },
  mondphasen: (v) => {
    const r = moonPhase(v.theta),
      ex = 180,
      ey = 160,
      R = 110,
      phi = (180 + v.theta) * RAD,
      mx = ex + R * Math.cos(phi),
      my = ey - R * Math.sin(phi),
      mr = 14;
    let body = "";
    for (let i = 0; i < 4; i++) body += arrow(4, 60 + i * 66, 34, 60 + i * 66, "e");
    body += text(20, 40, "Sonnenlicht", "e", "start", "tick") + ring(ex, ey, R, "mute", "thin dash");
    for (let a = 0; a < 360; a += 45)
      if (a !== v.theta) {
        const p = (180 + a) * RAD;
        body += dot(ex + R * Math.cos(p), ey - R * Math.sin(p), 4, "mute");
      }
    body +=
      `<circle cx="${ex}" cy="${ey}" r="22" class="earth"/>` +
      text(ex, ey + 40, "Erde", "ink", "middle", "tick") +
      `<circle cx="${n(mx)}" cy="${n(my)}" r="${mr}" class="moon-dark"/>` +
      `<path d="M${n(mx)} ${n(my - mr)}A${mr} ${mr} 0 0 0 ${n(mx)} ${n(my + mr)}Z" class="moon-lit"/>`;
    // View from the Earth: the lit part of the disc as the eye sees it.
    const cx = 380,
      cy = 150,
      rr = 54,
      t = ((v.theta % 360) + 360) % 360,
      rx = rr * Math.abs(Math.cos(t * RAD)),
      crescent = t < 90 || t > 270;
    let disc = `<circle cx="${cx}" cy="${cy}" r="${rr}" class="moon-dark"/>`;
    if (t === 180) disc += `<circle cx="${cx}" cy="${cy}" r="${rr}" class="moon-lit"/>`;
    else if (t !== 0) {
      const d = `M${cx} ${cy - rr}A${rr} ${rr} 0 0 1 ${cx} ${cy + rr}A${n(rx)} ${rr} 0 0 ${crescent ? 0 : 1} ${cx} ${cy - rr}Z`;
      disc += `<path d="${d}" class="moon-lit"${r.waxing ? "" : ` transform="matrix(-1 0 0 1 ${2 * cx} 0)"`}/>`;
    }
    body += disc + ring(cx, cy, rr, "mute", "thin") + text(cx, cy - rr - 14, "Ansicht von der Erde", "ink", "middle", "tick") + text(cx - 10, cy + rr + 26, r.name, "acc", "middle");
    return {
      label: `Der Mond steht ${fmt(v.theta)} Grad von der Richtung zur Sonne entfernt auf seiner Bahn. Von der Erde aus ist ${fmt(100 * r.lit, 0)} Prozent der Scheibe beleuchtet: ${r.name}, etwa ${fmt(r.days, 1)} Tage nach Neumond.`,
      height: 320,
      body,
      legend: [
        ["e", "Sonnenlicht von links"],
        ["mute", "Mondbahn und weitere Stellungen"],
        ["acc", "Name der Mondphase"],
      ],
    };
  },
  finsternis: (v) => {
    const r = eclipse(v.full, v.offset),
      cy = 130,
      D = 14,
      moonY = cy - v.offset * D,
      earthR = 1.83 * D,
      newMoon = v.full === 0,
      earthX = newMoon ? 400 : 230,
      moonX = newMoon ? 250 : 410,
      total = r.kind.startsWith("totale"),
      partial = r.kind.startsWith("partielle") || r.kind.startsWith("Halbschatten");
    let body = `<circle cx="-30" cy="${cy}" r="80" class="sun"/>` + text(14, 238, "Sonne", "e", "start", "tick") + line(60, cy, 470, cy, "mute", "thin dash");
    if (newMoon) {
      body +=
        area([[moonX, moonY - D / 2], [earthX - earthR + 4, moonY - D * 1.6], [earthX - earthR + 4, moonY + D * 1.6], [moonX, moonY + D / 2]], "mute", "soft-strong") +
        area([[moonX, moonY - D / 2], [earthX - earthR + 2, moonY], [moonX, moonY + D / 2]], "ink", "hatch");
    } else {
      body +=
        area([[earthX, cy - earthR], [480, cy - 2.6 * D], [480, cy + 2.6 * D], [earthX, cy + earthR]], "mute", "soft-strong") +
        area([[earthX, cy - earthR], [480, cy - 1.1 * D], [480, cy + 1.1 * D], [earthX, cy + earthR]], "ink", "hatch");
    }
    body +=
      `<circle cx="${earthX}" cy="${cy}" r="${n(earthR)}" class="earth"/>` +
      text(earthX, cy + earthR + 20, "Erde", "ink", "middle", "tick") +
      `<circle cx="${moonX}" cy="${n(moonY)}" r="${D / 2}" class="${!newMoon && total ? "moon-red" : !newMoon && partial ? "moon-half" : "moon-lit"}"/>` +
      text(moonX, moonY - 14, "Mond", "ink", "middle", "tick") +
      text(240, 248, `${newMoon ? "Neumond" : "Vollmond"}: ${r.kind}`, r.kind === "keine Finsternis" ? "mute" : "acc", "middle", "strong");
    return {
      label: `${newMoon ? "Neumond" : "Vollmond"}, Mond ${fmt(Math.abs(v.offset), 1)} Monddurchmesser ${v.offset >= 0 ? "oberhalb" : "unterhalb"} der Erdbahnebene: ${r.kind}. ${r.where}`,
      height: 262,
      body,
      legend: [
        ["e", "Sonne"],
        ["ink", "Kernschatten"],
        ["mute", "Halbschatten und Erdbahnebene"],
        ["acc", "Ergebnis"],
      ],
    };
  },
  sichtbarkeit: (v) => {
    const r = visibility(v.cloth, v.dist),
      x0 = 70,
      x1 = 450,
      px = (x1 - x0) / 150,
      X = (m: number) => x0 + m * px,
      road = 120,
      cloth = ["#2b2f3a", "#e9e6dc", "#e9e6dc"][v.cloth];
    let body =
      rect(20, road - 40, 460, 80, "mute", "soft") +
      area([[x0, road - 6], [x1, road - 40], [x1, road + 40], [x0, road + 6]], "e", "soft") +
      rect(X(0), road + 44, STOPPING_50 * px, 10, "bad") +
      text(X(0), road + 72, `Anhalteweg aus 50 km/h: ${STOPPING_50} m`, "bad", "start", "tick") +
      line(X(r.range), road - 52, X(r.range), road + 40, "t", "dash") +
      text(X(r.range), road - 58, `erkennbar ab ${r.range} m`, "t", r.range > 120 ? "end" : "middle", "tick") +
      `<rect x="20" y="${road - 16}" width="46" height="32" rx="7" class="fl q-ink"/>` +
      dot(66, road - 8, 4, "e") +
      dot(66, road + 8, 4, "e");
    const px0 = X(v.dist);
    body +=
      `<circle cx="${n(px0)}" cy="${road - 26}" r="7" fill="${cloth}" class="painted"/>` +
      `<rect x="${n(px0 - 7)}" y="${road - 18}" width="14" height="30" rx="4" fill="${cloth}" class="painted"/>` +
      (v.cloth === 2 ? `<rect x="${n(px0 - 7)}" y="${road - 6}" width="14" height="4" class="reflex"/>` : "") +
      text(px0, road + 30, `${fmt(v.dist)} m`, "ink", "middle", "tick");
    for (let m = 0; m <= 150; m += 25) body += text(X(m), 214, `${m} m`, "mute", "middle", "tick");
    body += text(240, 240, r.seen ? (r.inTime ? "Erkannt, und das Auto kann rechtzeitig halten." : "Erkannt, aber zu spät zum Anhalten.") : "Noch nicht erkannt.", r.seen && r.inTime ? "ok" : "bad", "middle", "strong");
    return {
      label: `Fußgänger mit ${CLOTHING[v.cloth].name} ${fmt(v.dist)} Meter vor dem Auto. Erkennbar ab ${r.range} Metern, Anhalteweg ${STOPPING_50} Meter. ${r.seen ? "Die Fahrerin erkennt ihn." : "Die Fahrerin erkennt ihn noch nicht."}`,
      height: 252,
      body,
      legend: [
        ["e", "Scheinwerferlicht"],
        ["t", "Erkennungsweite für diese Kleidung"],
        ["bad", "Anhalteweg bei einer Notbremsung"],
      ],
    };
  },
  atom: (v) => {
    const r = atomCharge(v.element, v.e),
      cx = 200,
      cy = 150,
      neutrons = r.protons === 1 ? 0 : r.protons;
    let body = `<circle cx="${cx}" cy="${cy}" r="118" class="fl q-m soft"/>` + ring(cx, cy, 118, "m", "thin dash");
    const particles: Tone[] = [];
    for (let j = 0; j < Math.max(r.protons, neutrons); j++) {
      if (j < r.protons) particles.push("p");
      if (j < neutrons) particles.push("mute");
    }
    particles.forEach((tone, i) => {
      const a = i * 2.4,
        rr = 3.2 * Math.sqrt(i);
      body += dot(cx + rr * Math.cos(a), cy + rr * Math.sin(a), 4, tone, "body");
    });
    for (let i = 0; i < v.e; i++) {
      const a = (i / Math.max(1, v.e)) * 2 * Math.PI + pseudoNoise(i, 5) * 0.3,
        rr = 60 + 45 * ((pseudoNoise(i, 6) + 1) / 2);
      body += dot(cx + rr * Math.cos(a), cy + rr * Math.sin(a), 9, "m", "body") + `<text x="${n(cx + rr * Math.cos(a))}" y="${n(cy + rr * Math.sin(a) + 5)}" text-anchor="middle" class="on-dot">−</text>`;
    }
    body +=
      text(cx, 18, `${ELEMENTS[v.element].name}: Kern und Hülle`, "ink", "middle", "tick") +
      text(360, 100, `${r.protons} Protonen`, "p", "start") +
      text(360, 126, `${v.e} Elektronen`, "m", "start") +
      text(360, 172, r.charge === 0 ? "neutral" : `Ladung ${r.charge > 0 ? "+" : "−"}${Math.abs(r.charge)}`, r.charge === 0 ? "ok" : r.charge > 0 ? "p" : "m", "start", "strong");
    return {
      label: `${ELEMENTS[v.element].name}: ${r.protons} Protonen im Kern, ${v.e} Elektronen in der Hülle. Das Teilchen ist ${r.state}.`,
      height: 290,
      body,
      legend: [
        ["p", "Protonen im Kern, positiv"],
        ["m", "Elektronen und Atomhülle, negativ"],
        ["mute", "Neutronen, ungeladen"],
      ],
    };
  },
  reiben: (v) => {
    const r = rubbing(v.pair, v.rubs, v.test),
      pair = RUB_PAIRS[v.pair],
      balloon = v.pair === 0,
      signs = (x: number, y: number, count: number, sign: "+" | "−", width: number) => {
        let out = "";
        for (let i = 0; i < Math.min(10, count); i++)
          out += text(x - width / 2 + 10 + (i % 5) * ((width - 20) / 4), y + Math.floor(i / 5) * 18, sign, sign === "+" ? "p" : "m", "middle", "strong");
        return out;
      },
      shape = (x: number, y: number) =>
        balloon
          ? `<ellipse cx="${x}" cy="${y}" rx="52" ry="62" class="fl q-mute soft-strong"/>`
          : `<rect x="${x - 70}" y="${y - 16}" width="140" height="32" rx="14" class="fl q-mute soft-strong"/>`,
      excess = Math.abs(r.body) / 3;
    let body =
      `<rect x="20" y="110" width="80" height="80" rx="16" class="fl q-x soft"/>` +
      text(60, 210, pair.cloth, "x", "middle", "tick") +
      signs(60, 140, excess, r.cloth > 0 ? "+" : "−", 70) +
      shape(190, 150) +
      text(190, 240, pair.body, "ink", "middle", "tick") +
      signs(190, 140, excess, r.body < 0 ? "−" : "+", 100);
    if (v.test === 0) {
      for (let i = 0; i < 6; i++) body += `<rect x="${n(360 + (i % 3) * 22)}" y="${n(180 + Math.floor(i / 3) * 18 - (r.moved && i < 3 ? 40 : 0))}" width="14" height="10" class="fl q-mute"/>`;
      body += text(392, 236, "Papierschnipsel", "ink", "middle", "tick");
    } else {
      body += shape(390, 150) + signs(390, 140, excess, r.body < 0 ? "−" : "+", 100) + text(390, 240, `zweiter ${pair.body}`, "ink", "middle", "tick");
    }
    if (r.moved)
      body += v.test === 0 ? arrow(380, 150, 300, 150, "f") : arrow(330, 90, 400, 90, "f");
    body += text(240, 30, r.moved ? `${r.moved} Elektronen übertragen (Modellwert): ${r.effect}` : "Ungerieben: beide Körper neutral", r.moved ? "f" : "mute");
    return {
      label: `${pair.body} und ${pair.cloth}, ${fmt(v.rubs)} Reibbewegungen. ${r.moved ? `Der ${pair.body} ist ${r.body < 0 ? "negativ" : "positiv"}, das Tuch oder die Haare ${r.cloth < 0 ? "negativ" : "positiv"} geladen.` : "Keine Ladungen getrennt."} Wirkung: ${r.effect}.`,
      height: 260,
      body,
      legend: [
        ["m", "Elektronenüberschuss, negativ"],
        ["p", "Elektronenmangel, positiv"],
        ["f", "Kraft auf den angenäherten Körper"],
        ["x", "Tuch oder Haare"],
        ["mute", "geriebener und angenäherter Körper"],
      ],
    };
  },
  stromkreis: (v) => {
    const r = circuit(v.switch, v.gap),
      L = 80,
      R = 400,
      T = 60,
      B = 220,
      gap = GAP_MATERIALS[v.gap],
      closed = v.switch === 1,
      // Electron path: from the minus pole (bottom left) around to the plus pole.
      path = `M${L} ${B - 70}V${B}H${R}V${T}H${L}V${T + 70}`;
    let body =
      `<path d="M${L} ${T + 70}V${T}H${R}V${T + 60}M${R} ${T + 100}V${B}H${270}M${210} ${B}H${L}V${B - 70}" class="ln q-ink"/>` +
      battery(L, (T + B) / 2) +
      lampSymbol(240, T, r.flowing) +
      dot(R, T + 60, 3.5, "ink") +
      dot(R, T + 100, 3.5, "ink") +
      (closed ? line(R, T + 60, R, T + 100, "ink") : line(R, T + 100, R + 26, T + 66, "ink")) +
      text(R - 10, T + 84, closed ? "Schalter zu" : "Schalter offen", "ink", "end", "tick") +
      `<rect x="205" y="${B - 9}" width="70" height="18" rx="4" class="${gap.conducts ? "conductor" : "insulator"}"/>` +
      text(240, B + 32, gap.name, "ink", "middle", "tick");
    if (r.flowing) body += `<path d="${path}" class="ln q-m flow"/>`;
    else body += `<path d="${path}" class="ln q-m electrons"/>`;
    body += text(240, 270, r.flowing ? "Stromkreis geschlossen: Elektronen bewegen sich" : gap.conducts ? "Stromkreis offen: keine Bewegung" : "Isolator in der Lücke: kein Strom", r.flowing ? "ok" : "bad", "middle", "strong");
    return {
      label: `Stromkreis aus Batterie, Lampe und Schalter; in der Prüfstrecke ${gap.name}. Schalter ${closed ? "geschlossen" : "offen"}. ${r.flowing ? "Die Lampe leuchtet; Elektronen bewegen sich vom Minuspol durch die Lampe zum Pluspol." : "Die Lampe bleibt dunkel."}`,
      height: 290,
      body,
      legend: [
        ["m", "Elektronen in den Leitungen"],
        ["e", "Licht der Lampe"],
        ["ink", "Leitungen, Batterie und Schalter"],
      ],
      ...(r.flowing ? { motion: "Die Elektronen wandern vom Minuspol durch Prüfstrecke und Lampe zum Pluspol." } : {}),
    };
  },
  spule: (v) => {
    const r = coil(v.on, v.dir, v.n, v.core),
      x0 = 120,
      x1 = 300,
      cy = 110,
      loops = v.n / 25,
      step = (x1 - x0) / loops;
    let body = v.core ? rect(x0 - 20, cy - 16, x1 - x0 + 40, 32, "mute") : "";
    for (let i = 0; i < loops; i++) {
      const x = x0 + i * step;
      body += `<path d="M${n(x)} ${cy + 34}C${n(x - step * 0.6)} ${cy}, ${n(x - step * 0.6)} ${cy - 34}, ${n(x + step / 2)} ${cy - 34}C${n(x + step * 1.1)} ${cy - 34}, ${n(x + step * 1.1)} ${cy + 20}, ${n(x + step)} ${cy + 34}" class="ln q-x"/>`;
    }
    body +=
      `<path d="M${x0} ${cy + 34}V230H190M250 230H${x1}V${cy + 34}" class="ln q-ink"/>` +
      battery(220, 230) +
      (v.on ? "" : line(170, 230, 190, 210, "ink")) +
      text(220, 270, v.on ? (v.dir ? "umgepolt, Strom an" : "Strom an") : "Strom aus", "ink", "middle", "tick");
    if (r.magnetic) {
      const rightN = r.rightPole === "Nordpol";
      body +=
        text(x1 + 36, cy - 26, rightN ? "N" : "S", rightN ? "p" : "sp", "middle", "strong") +
        text(x0 - 36, cy - 26, rightN ? "S" : "N", rightN ? "sp" : "p", "middle", "strong");
    }
    const compassX = 410;
    body += ring(compassX, cy, 30, "ink", "thin") + needle(compassX, cy, 48, !r.magnetic ? 90 : r.rightPole === "Nordpol" ? 0 : 180, 4) + text(compassX, cy + 52, "Kompass", "ink", "middle", "tick");
    for (let i = 0; i < Math.min(r.nails, 12); i++)
      body += line(x1 + 6 + (i % 4) * 8, cy + 18 + Math.floor(i / 4) * 24, x1 + 6 + (i % 4) * 8, cy + 38 + Math.floor(i / 4) * 24, "mute", "thick");
    body += text(240, 20, `${fmt(v.n)} Windungen ${v.core ? "mit" : "ohne"} Eisenkern · ${r.nails} ${r.nails === 1 ? "Nagel" : "Nägel"} (Modellwert)`, "ink", "middle", "tick");
    return {
      label: `Spule mit ${fmt(v.n)} Windungen ${v.core ? "mit" : "ohne"} Eisenkern, Strom ${v.on ? "an" : "aus"}. ${r.magnetic ? `Rechts entsteht ein ${r.rightPole}; die Kompassnadel wird abgelenkt.` : "Die Kompassnadel zeigt nach Norden."} Die Spule hält ${r.nails} Nägel.`,
      height: 280,
      body,
      legend: [
        ["x", "Spule aus Kupferdraht"],
        ["p", "Nordpol"],
        ["sp", "Südpol"],
        ["mute", "Eisenkern und gehaltene Eisennägel"],
      ],
    };
  },
  schaltung: (v) => {
    const on = switching(v.type, v.a, v.b),
      T = 60,
      B = 220,
      L = 60,
      R = 420,
      sw = (x: number, y: number, closed: boolean, name: string) =>
        dot(x - 22, y, 3.5, "ink") +
        dot(x + 22, y, 3.5, "ink") +
        (closed ? line(x - 22, y, x + 22, y, "ink") : line(x - 22, y, x + 16, y - 20, "ink")) +
        text(x, y - 26, `${name} = ${closed ? 1 : 0}`, "ink", "middle", "tick");
    let body = battery(L, (T + B) / 2) + lampSymbol(R, (T + B) / 2, on);
    let current = "";
    if (v.type === 0) {
      body += `<path d="M${L} ${(T + B) / 2 - 10}V${T}H148M192 ${T}H268M312 ${T}H${R}V${(T + B) / 2 - 14}M${R} ${(T + B) / 2 + 14}V${B}H${L}V${(T + B) / 2 + 10}" class="ln q-ink"/>` + sw(170, T, v.a === 1, "A") + sw(290, T, v.b === 1, "B");
      current = `M${L} ${B}V${T}H${R}V${B}H${L}`;
    } else if (v.type === 1) {
      body +=
        `<path d="M${L} ${(T + B) / 2 - 10}V${T}H198M242 ${T}H${R}V${(T + B) / 2 - 14}M${R} ${(T + B) / 2 + 14}V${B}H${L}V${(T + B) / 2 + 10}M150 ${T}V${T + 60}H198M242 ${T + 60}H300V${T}" class="ln q-ink"/>` +
        sw(220, T, v.a === 1, "A") +
        sw(220, T + 60, v.b === 1, "B");
      current = `M${L} ${B}V${T}H${R}V${B}H${L}`;
    } else {
      const sA = 150,
        sB = 330,
        up = T + 20,
        down = T + 70,
        lever = (x: number, pivotLeft: boolean, upper: boolean) => {
          const px = pivotLeft ? x - 24 : x + 24,
            cx = pivotLeft ? x + 20 : x - 20;
          return dot(px, (up + down) / 2, 3.5, "ink") + dot(cx, up, 3.5, "ink") + dot(cx, down, 3.5, "ink") + line(px, (up + down) / 2, cx, upper ? up : down, "ink");
        };
      body +=
        `<path d="M${L} ${(T + B) / 2 - 10}V${(up + down) / 2}H${sA - 24}M${sA + 20} ${up}H${sB - 20}M${sA + 20} ${down}H${sB - 20}M${sB + 24} ${(up + down) / 2}H${R}V${(T + B) / 2 - 14}M${R} ${(T + B) / 2 + 14}V${B}H${L}V${(T + B) / 2 + 10}" class="ln q-ink"/>` +
        lever(sA, true, v.a === 1) +
        lever(sB, false, v.b === 1) +
        text(sA, up - 16, `A: Hebel ${v.a ? "oben" : "unten"}`, "ink", "middle", "tick") +
        text(sB, up - 16, `B: Hebel ${v.b ? "oben" : "unten"}`, "ink", "middle", "tick");
      const wire = v.a ? up : down;
      current = `M${L} ${B}V${(up + down) / 2}H${sA - 24}L${sA + 20} ${wire}H${sB - 20}L${sB + 24} ${(up + down) / 2}H${R}V${B}H${L}`;
    }
    if (on) body += `<path d="${current}" class="ln q-m flow"/>`;
    body += text(240, 262, on ? "Lampe an" : "Lampe aus", on ? "ok" : "mute", "middle", "strong");
    return {
      label: `${["UND-Schaltung: zwei Schalter in Reihe", "ODER-Schaltung: zwei Schalter parallel", "Wechselschaltung mit zwei Wechselschaltern"][v.type]}. Schalter A = ${v.a}, Schalter B = ${v.b}. Die Lampe ist ${on ? "an" : "aus"}.`,
      height: 280,
      body,
      legend: [
        ["ink", "Leitungen, Schalter, Batterie und Lampe"],
        ["e", "Licht der Lampe"],
        ["m", "geschlossener Weg der Elektronen"],
        ["mute", "Stromkreis unterbrochen: Lampe aus"],
      ],
      ...(on ? { motion: "Die Elektronen laufen im geschlossenen Stromkreis um." } : {}),
    };
  },
};

/** Fixed drawings for lessons whose explanation needs a picture beside the model. */
const ILLUSTRATIONS: Record<string, () => Figure> = {
  erdmagnetfeld: () => {
    const cx = 240,
      cy = 160,
      R = 82;
    let body = "";
    for (const k of [1.35, 1.9, 2.6])
      body +=
        `<ellipse cx="${n(cx - R * k * 0.55)}" cy="${cy}" rx="${n(R * k * 0.55)}" ry="${n(R * k * 0.62)}" class="ln q-mute thin"/>` +
        `<ellipse cx="${n(cx + R * k * 0.55)}" cy="${cy}" rx="${n(R * k * 0.55)}" ry="${n(R * k * 0.62)}" class="ln q-mute thin"/>`;
    body +=
      `<circle cx="${cx}" cy="${cy}" r="${R}" class="earth"/>` +
      rect(cx - 10, cy - 52, 20, 52, "sp", "body") +
      rect(cx - 10, cy, 20, 52, "p", "body") +
      text(cx + 18, cy - 30, "S", "ink", "start", "strong") +
      text(cx + 18, cy + 40, "N", "ink", "start", "strong") +
      text(cx, cy - R - 14, "geographischer Nordpol", "ink", "middle", "tick") +
      text(cx, cy + R + 24, "geographischer Südpol", "ink", "middle", "tick") +
      needle(cx - 150, cy - 60, 30, 90, 3.5) +
      needle(cx + 150, cy - 60, 30, 90, 3.5) +
      needle(cx - 170, cy + 40, 30, 90, 3.5) +
      text(cx - 160, cy + 76, "Kompassnadeln zeigen nach Norden", "ink", "start", "tick");
    return {
      label:
        "Die Erde mit einem gedachten Stabmagneten im Inneren. Sein magnetischer Südpol liegt beim geographischen Nordpol, sein Nordpol beim geographischen Südpol. Rundherum liegen Feldlinien; Kompassnadeln zeigen mit dem Nordpol nach Norden.",
      height: 300,
      body,
      legend: [
        ["p", "Nordpol"],
        ["sp", "Südpol"],
        ["mute", "Verlauf des Erdmagnetfelds"],
      ],
    };
  },
  "waerme-licht": () => {
    const bulb = (cx: number, name: string, heat: number, glow: number, led: boolean) => {
      let out = `<path d="M${cx - 40} 110a40 40 0 1 1 80 0c0 22-16 30-18 50h-44c-2-20-18-28-18-50Z" class="fig-fill ln q-ink"/>` + rect(cx - 20, 162, 40, 26, "mute");
      out += led
        ? rect(cx - 9, 104, 18, 14, "e")
        : `<path d="M${cx - 20} 110l6 -10l6 10l6 -10l6 10l6 -10l6 10" class="ln q-e thick"/>` + line(cx - 20, 110, cx - 14, 162, "mute", "thin") + line(cx + 20, 110, cx + 14, 162, "mute", "thin");
      for (let i = 0; i < glow; i++) {
        const a = (-150 + i * (120 / Math.max(1, glow - 1))) * RAD;
        out += arrow(cx + 50 * Math.cos(a), 110 + 50 * Math.sin(a), cx + 80 * Math.cos(a), 110 + 80 * Math.sin(a), "e");
      }
      for (let i = 0; i < heat; i++) {
        const y = 80 + i * 26;
        out += `<path d="M${cx + 48} ${y}c8 -6 14 6 22 0s14 6 22 0" class="ln q-f"/>`;
      }
      return out + text(cx, 214, name, "ink", "middle", "tick");
    };
    return {
      label:
        "Links eine Glühlampe: Ein dünner Draht glüht; sie gibt wenig Licht und viel Wärme ab. Rechts eine LED-Lampe: Sie gibt ähnlich viel Licht, aber wenig Wärme ab.",
      height: 230,
      body: bulb(130, "Glühlampe: glühender Draht", 4, 3, false) + bulb(350, "LED-Lampe", 1, 3, true),
      legend: [
        ["e", "Licht"],
        ["f", "Wärme"],
      ],
    };
  },
};

function frameFigure(figure: Figure, playing: boolean): string {
  const moving = playing && figure.motion !== undefined,
    legend = figure.legend.filter(([tone]) =>
      new RegExp(`q-${tone}(?![a-z])`).test(figure.body),
    );
  return `<figure class="model-figure${moving ? " playing" : ""}"><svg class="physics-figure" viewBox="0 0 ${W} ${figure.height}" role="img" aria-label="${esc(figure.label)}">${figure.body}</svg>${figure.motion ? `<div class="motion-bar"><button type="button" class="button secondary motion-toggle" data-motion aria-pressed="${moving}">${moving ? "■ Bewegung anhalten" : "▶ Bewegung zeigen"}</button><span class="small">${esc(figure.motion)}</span></div>` : ""}<ul class="figure-legend">${legend.map(([tone, label]) => `<li class="q-${tone}"><span class="swatch" aria-hidden="true"></span>${esc(label)}</li>`).join("")}</ul></figure>`;
}

/** Whether the scene of a model can be set in motion. */
export const hasMotion = (kind: ModelKind, v: Values): boolean =>
  FIGURES[kind](v).motion !== undefined;

/** The drawing of a model for the current values. Motion never starts on its own. */
export function renderFigure(kind: ModelKind, v: Values, playing = false): string {
  return frameFigure(FIGURES[kind](v), playing);
}

/** The fixed drawing of a lesson, or nothing. */
export function renderIllustration(lessonId: string): string {
  const illustration = ILLUSTRATIONS[lessonId];
  return illustration ? frameFigure(illustration(), false) : "";
}
export const ILLUSTRATED_LESSONS = Object.keys(ILLUSTRATIONS);
