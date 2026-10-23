import { fmt, fmtUnit } from "../exercises/format";
import type { LabKind, LabValues, ReadoutValues } from "../model/types";
import {
  arrow,
  CLOSE,
  circle,
  clamp,
  DEG,
  line,
  num,
  open,
  path,
  polygon,
  r1,
  ray,
  rect,
  str,
  text,
} from "./draw";
import {
  criticalAngle,
  exitAngle,
  eyeFocusShift,
  lensImage,
  moonAngle,
  refractionAngle,
  shadowSizes,
} from "./physics";

type Renderer = (v: LabValues, r: ReadoutValues) => string;

// ─── 2.1 Sehen ────────────────────────────────────────────────────────────

function seeing(v: LabValues, r: ReadoutValues): string {
  const on = v.lamp === 1;
  const book = v.book === 1;
  const cy = 120;
  let rays = "";
  if (on) {
    rays += ray(94, cy, 424, cy, "lab-ray");
    if (book) {
      rays += ray(90, cy + 12, 232, 218, "lab-ray") + ray(292, 218, 428, cy + 14, "lab-ray");
    }
  }
  let glow = "";
  if (on) {
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      glow += line(70 + Math.cos(a) * 26, cy + Math.sin(a) * 26, 70 + Math.cos(a) * 36, cy + Math.sin(a) * 36, "lab-ray-thin");
    }
  }
  return (
    open("Eine Lampe, ein Buch und ein Auge: Wohin läuft das Licht?") +
    rays +
    glow +
    circle(70, cy, 18, on ? "lab-bulb-on" : "lab-bulb-off") +
    text(70, cy + 48, "Lampe (Sender)", "lab-text-small", "middle") +
    `<ellipse cx="450" cy="${cy}" rx="26" ry="17" class="lab-bulb-off" />` +
    circle(450, cy, 8, "lab-block") +
    text(450, cy + 48, "Auge (Empfänger)", "lab-text-small", "middle") +
    (book ? rect(230, 218, 64, 14, "lab-crate") + text(262, 252, "Buch (nicht selbstleuchtend)", "lab-text-small", "middle") : "") +
    text(20, 28, `Lampe: ${str(r, "lampSeen")}`, "lab-text") +
    text(20, 276, `Buch: ${str(r, "bookSeen")}`, "lab-text") +
    CLOSE
  );
}

// ─── 2.2 Schatten ─────────────────────────────────────────────────────────

const OBJECT_D = 10; // cm

function shadow(v: LabValues, r: ReadoutValues): string {
  const Ds = v.src;
  const a = v.a;
  const b = v.b;
  const cy = 150;
  const ky = 2.2;
  const x0 = 40;
  const kx = 440 / (a + b);
  const xo = x0 + a * kx;
  const xs = x0 + 440;
  const { umbra, penumbra } = shadowSizes(Ds, OBJECT_D, a, b);
  const half = (cm: number) => clamp((cm / 2) * ky, 0, 140);
  const objH = (OBJECT_D / 2) * ky;
  let umbraShape = "";
  if (umbra > 0) {
    umbraShape = polygon([[xo, cy - objH], [xs, cy - half(umbra)], [xs, cy + half(umbra)], [xo, cy + objH]], "lab-shadow");
  } else {
    const apex = xo + ((a * OBJECT_D) / (Ds - OBJECT_D)) * kx;
    umbraShape = polygon([[xo, cy - objH], [Math.min(apex, xs), cy], [xo, cy + objH]], "lab-shadow");
  }
  const srcShape = Ds === 0 ? circle(x0, cy, 5, "lab-sun") : rect(x0 - 5, cy - (Ds / 2) * ky, 10, Ds * ky, "lab-sun");
  return (
    open("Eine Lampe, eine Scheibe und ein Schirm mit Kernschatten und Halbschatten") +
    polygon([[xo, cy - objH], [xs, cy - half(penumbra)], [xs, cy + half(penumbra)], [xo, cy + objH]], "lab-penumbra") +
    umbraShape +
    ray(x0, cy, xs, cy, "lab-ray-thin", false) +
    srcShape +
    rect(xo - 3, cy - objH, 6, 2 * objH, "lab-block") +
    rect(xs - 3, 10, 6, 280, "lab-ground") +
    rect(xs - 3, cy - half(penumbra), 6, 2 * half(penumbra), "lab-penumbra", 'style="opacity:1"') +
    rect(xs - 3, cy - half(umbra), 6, 2 * half(umbra), "lab-shadow", 'style="opacity:1"') +
    text(x0, 286, "Lampe", "lab-text-small", "middle") +
    text(xo, 286, "Scheibe 10 cm", "lab-text-small", "middle") +
    text(xs, 300 - 2, "Schirm", "lab-text-small", "end") +
    text(20, 24, `Kernschatten ${fmtUnit(num(r, "umbra"), "cm", 1)}`, "lab-text lab-text-big") +
    text(20, 44, `Schatten mit Halbschatten ${fmtUnit(num(r, "penumbra"), "cm", 1)}`, "lab-text-muted") +
    CLOSE
  );
}

// ─── 2.3 Finsternisse ─────────────────────────────────────────────────────

function phaseShape(alpha: number, cx: number, cy: number, rad: number): string {
  const waxing = alpha <= 180;
  const a = waxing ? alpha : 360 - alpha;
  const cosA = Math.cos(a * DEG);
  const rx = Math.max(0.01, rad * Math.abs(cosA));
  const d = `M${r1(cx)} ${r1(cy - rad)} A${r1(rad)} ${r1(rad)} 0 0 1 ${r1(cx)} ${r1(cy + rad)} A${r1(rx)} ${r1(rad)} 0 0 ${cosA > 0 ? 0 : 1} ${r1(cx)} ${r1(cy - rad)} Z`;
  const shape = `<path d="${d}" class="lab-ice" />`;
  return waxing ? shape : `<g transform="translate(${r1(2 * cx)},0) scale(-1,1)">${shape}</g>`;
}

function eclipse(v: LabValues, r: ReadoutValues): string {
  const alpha = moonAngle(v.day);
  const ex = 300;
  const ey = 130;
  const R = 90;
  const mx = ex - R * Math.cos(alpha * DEG);
  const my = ey - R * Math.sin(alpha * DEG);
  let sunRays = "";
  for (let y = 40; y <= 220; y += 30) sunRays += arrow(92, y, 126, y, "lab-ray", 2);
  const inShadow = Math.abs(((alpha % 360) + 360) % 360 - 180) <= 8 && v.orbit !== 1;
  return (
    open("Sonne, Erde und Mond von oben mit dem Mond von der Erde aus gesehen") +
    circle(40, 130, 56, "lab-sun") +
    text(40, 215, "Sonne", "lab-text-small", "middle") +
    sunRays +
    polygon([[ex, ey - 15], [500, ey - 4], [500, ey + 4], [ex, ey + 15]], "lab-shadow", ) +
    polygon([[mx, my - 7], [mx + 140, my - 1], [mx + 140, my + 1], [mx, my + 7]], "lab-shadow") +
    circle(ex, ey, R, "lab-orbit") +
    circle(ex, ey, 15, "lab-fluid", 'style="opacity:1"') +
    text(ex, ey + 32, "Erde", "lab-text-small", "middle") +
    circle(mx, my, 7, inShadow ? "lab-crate" : "lab-ice") +
    `<path d="M${r1(mx)} ${r1(my - 7)} A7 7 0 0 1 ${r1(mx)} ${r1(my + 7)} Z" class="lab-shadow" style="opacity:0.8" />` +
    text(mx, my - 12, "Mond", "lab-text-small", "middle") +
    // phase seen from Earth
    circle(450, 245, 30, "lab-shadow", 'style="opacity:1"') +
    phaseShape(alpha, 450, 245, 30) +
    text(450, 292, "Mond von der Erde aus", "lab-text-small", "middle") +
    text(20, 250, `${fmt(num(r, "lit"), 0)} % beleuchtet`, "lab-text-muted") +
    text(20, 270, str(r, "phase"), "lab-text lab-text-big") +
    text(20, 24, str(r, "eclipse"), "lab-text lab-text-big") +
    CLOSE
  );
}

// ─── 2.4 Reflexion ────────────────────────────────────────────────────────

function reflection(v: LabValues, r: ReadoutValues): string {
  const ox = 260;
  const oy = 190;
  const L = 150;
  const d = v.delta * DEG;
  const alpha = v.alpha * DEG;
  const tx = Math.cos(d);
  const ty = Math.sin(d);
  const nx = Math.sin(d);
  const ny = -Math.cos(d);
  const aOut = alpha + 2 * d;
  const inX = ox - L * Math.sin(alpha);
  const inY = oy - L * Math.cos(alpha);
  let surface: string;
  let reflected = "";
  if (v.surface === 0) {
    surface = line(ox - 130 * tx, oy - 130 * ty, ox + 130 * tx, oy + 130 * ty, "lab-mirror");
    reflected = ray(ox, oy, ox + L * Math.sin(aOut), oy - L * Math.cos(aOut), "lab-ray");
  } else {
    let pts = "";
    for (let i = -13; i <= 13; i++) {
      const px = ox + (i * 10) * tx + (i % 2 === 0 ? 4 : -4) * nx;
      const py = oy + (i * 10) * ty + (i % 2 === 0 ? 4 : -4) * ny;
      pts += `${i === -13 ? "M" : "L"}${r1(px)} ${r1(py)} `;
    }
    surface = path(pts, "lab-rough");
    for (const off of [-30, -15, 0, 15, 30]) {
      const nu = d + off * DEG;
      const out = alpha + 2 * nu;
      reflected += ray(ox, oy, ox + 110 * Math.sin(out), oy - 110 * Math.cos(out), "lab-ray-thin");
    }
  }
  const alphaE = num(r, "alphaE");
  return (
    open("Ein Lichtstrahl trifft auf einen Spiegel oder eine raue Fläche") +
    line(ox, oy, ox + 120 * nx, oy + 120 * ny, "lab-normal") +
    surface +
    ray(inX, inY, ox, oy, "lab-ray") +
    reflected +
    text(ox + 120 * nx + 6, oy + 120 * ny + 4, "Lot", "lab-text-small") +
    text(20, 248, `Einfallswinkel α = ${fmt(alphaE, 0)}°`, "lab-text lab-text-big") +
    text(20, 268, v.surface === 0 ? `Reflexionswinkel β = ${fmt(num(r, "beta"), 0)}°` : "diffuse Reflexion: jedes Lot zeigt woandershin", "lab-text-muted") +
    text(20, 288, v.delta !== 0 ? `Spiegel um ${fmt(Math.abs(v.delta), 0)}° gedreht: Strahl um ${fmt(num(r, "turn"), 0)}° gedreht` : "", "lab-text-muted") +
    CLOSE
  );
}

// ─── 2.5 Brechung ─────────────────────────────────────────────────────────

function refraction(v: LabValues, r: ReadoutValues): string {
  const ox = 260;
  const oy = 140;
  const L = 130;
  const alpha = v.alpha * DEG;
  const beta = refractionAngle(v.alpha, v.n) * DEG;
  return (
    open("Ein Lichtstrahl geht von Luft in einen durchsichtigen Stoff und knickt zum Lot hin") +
    rect(0, 0, 520, oy, "lab-light-bg") +
    rect(0, oy, 520, 300 - oy, "lab-glass") +
    line(ox, 20, ox, 280, "lab-normal") +
    ray(ox - L * Math.sin(alpha), oy - L * Math.cos(alpha), ox, oy, "lab-ray") +
    ray(ox, oy, ox + L * Math.sin(beta), oy + L * Math.cos(beta), "lab-ray") +
    ray(ox, oy, ox + 90 * Math.sin(alpha), oy - 90 * Math.cos(alpha), "lab-ray-virtual", false) +
    text(ox + 8, 34, "Lot", "lab-text-small") +
    text(20, 28, `Luft: c = ${fmt(300000, 0)} km/s`, "lab-text-muted") +
    text(20, 285, `Stoff: v = ${fmtUnit(num(r, "v2"), "km/s", 0)}`, "lab-text-muted") +
    text(500, 28, `α = ${fmt(v.alpha, 0)}°`, "lab-text lab-text-big", "end") +
    text(500, 285, `β = ${fmt(num(r, "beta"), 1)}°`, "lab-text lab-text-big", "end") +
    CLOSE
  );
}

// ─── 2.6 Totalreflexion ───────────────────────────────────────────────────

function totalReflection(v: LabValues): string {
  const ox = 260;
  const oy = 150;
  const L = 130;
  const alpha = v.alpha * DEG;
  const alphaG = criticalAngle(v.n);
  const total = v.alpha >= alphaG;
  const exit = exitAngle(v.alpha, v.n);
  let out = "";
  if (total) {
    out = ray(ox, oy, ox + L * Math.sin(alpha), oy + L * Math.cos(alpha), "lab-ray");
  } else {
    out =
      ray(ox, oy, ox + L * Math.sin(exit * DEG), oy - L * Math.cos(exit * DEG), "lab-ray") +
      ray(ox, oy, ox + 70 * Math.sin(alpha), oy + 70 * Math.cos(alpha), "lab-ray-virtual", false);
  }
  const g = alphaG * DEG;
  return (
    open("Ein Lichtstrahl läuft im Stoff nach oben zur Grenzfläche und tritt aus oder wird total reflektiert") +
    rect(0, 0, 520, oy, "lab-light-bg") +
    rect(0, oy, 520, 300 - oy, "lab-glass") +
    line(ox, 20, ox, 280, "lab-normal") +
    ray(ox - L * Math.sin(alpha), oy + L * Math.cos(alpha), ox, oy, "lab-ray") +
    out +
    line(ox, oy, ox + 110 * Math.sin(g), oy + 110 * Math.cos(g), "lab-grid") +
    text(ox + 110 * Math.sin(g) + 6, oy + 110 * Math.cos(g), `Grenzwinkel ${fmt(alphaG, 1)}°`, "lab-text-small") +
    text(20, 28, "Luft", "lab-text-muted") +
    text(20, 285, `Stoff, n = ${fmt(v.n, 2)}`, "lab-text-muted") +
    text(500, 28, `α = ${fmt(v.alpha, 0)}°`, "lab-text lab-text-big", "end") +
    text(500, 52, total ? "Totalreflexion" : `austretend unter ${fmt(exit, 1)}°`, "lab-text", "end") +
    CLOSE
  );
}

// ─── 2.7 Linsen ───────────────────────────────────────────────────────────

function lensShape(cx: number, cy: number, converging: boolean): string {
  if (converging) {
    return path(`M${cx} ${cy - 70} Q${cx + 30} ${cy} ${cx} ${cy + 70} Q${cx - 30} ${cy} ${cx} ${cy - 70} Z`, "lab-lens");
  }
  return path(`M${cx - 10} ${cy - 70} H${cx + 10} Q${cx - 2} ${cy} ${cx + 10} ${cy + 70} H${cx - 10} Q${cx + 2} ${cy} ${cx - 10} ${cy - 70} Z`, "lab-lens");
}

function lensRays(v: LabValues, r: ReadoutValues): string {
  const lx = 260;
  const cy = 150;
  const ps = 20;
  const f = v.f;
  const converging = v.type === 0;
  let rays = "";
  for (const h of [-55, -35, -15, 15, 35, 55]) {
    const y0 = cy + h;
    if (converging) {
      const xf = lx + f * ps;
      const slope = -h / (xf - lx);
      rays += ray(20, y0, lx, y0, "lab-ray") + ray(lx, y0, 505, y0 + slope * (505 - lx), "lab-ray");
    } else {
      const xv = lx - f * ps;
      const slope = h / (lx - xv);
      rays +=
        ray(20, y0, lx, y0, "lab-ray") +
        ray(lx, y0, 505, y0 + slope * (505 - lx), "lab-ray") +
        ray(lx, y0, xv, cy, "lab-ray-virtual", false);
    }
  }
  const fMark = (x: number, label: string) => circle(x, cy, 4, "lab-marker") + text(x, cy + 22, label, "lab-text-small", "middle");
  return (
    open("Paralleles Licht trifft eine Sammellinse oder eine Zerstreuungslinse") +
    line(10, cy, 510, cy, "lab-axis") +
    rays +
    lensShape(lx, cy, converging) +
    fMark(lx + f * ps, converging ? "F′ (reell)" : "F") +
    fMark(lx - f * ps, converging ? "F" : "F′ (virtuell)") +
    text(20, 28, converging ? "Sammellinse bündelt im Brennpunkt" : "Zerstreuungslinse lässt auseinanderlaufen", "lab-text lab-text-big") +
    text(20, 50, `f = ${fmtUnit(f, "cm", 0)}, D = ${fmtUnit(num(r, "D"), "dpt", 1)}`, "lab-text-muted") +
    CLOSE
  );
}

function lensImageDrawing(v: LabValues, r: ReadoutValues): string {
  const lx = 270;
  const cy = 160;
  const ps = 10;
  const f = v.f;
  const g = v.g;
  const G = 30; // object height in px
  const T = { x: lx - g * ps, y: cy - G };
  const Fl = { x: lx - f * ps, y: cy };
  const Fr = { x: lx + f * ps, y: cy };
  const img = lensImage(f, g);
  const far = 505;
  // parallel ray
  const slope1 = (Fr.y - T.y) / (Fr.x - lx);
  let rays = ray(T.x, T.y, lx, T.y, "lab-ray") + ray(lx, T.y, far, T.y + slope1 * (far - lx), "lab-ray");
  // central ray
  const slope2 = (cy - T.y) / (lx - T.x);
  rays += ray(T.x, T.y, far, T.y + slope2 * (far - T.x), "lab-ray");
  // focal ray
  if (Math.abs(Fl.x - T.x) > 0.5) {
    const y3 = T.y + ((Fl.y - T.y) * (lx - T.x)) / (Fl.x - T.x);
    rays += ray(T.x, T.y, lx, y3, "lab-ray") + ray(lx, y3, far, y3, "lab-ray");
  }
  let image = "";
  const iy = cy + (G * img.b) / g;
  if (img.b === 999) {
    image = text(lx + 20, 40, "Die Strahlen laufen parallel: kein Bild", "lab-text lab-text-force");
  } else if (img.real) {
    const ix = lx + img.b * ps;
    if (ix < 500) {
      image = arrow(ix, cy, ix, iy, "lab-image", 4);
    } else {
      image = text(lx + 20, 40, "Das Bild liegt weit rechts außerhalb", "lab-text lab-text-force");
    }
  } else {
    const ix = lx + img.b * ps;
    // virtual: dashed back-extension of the diverging rays
    const back = (slope: number, y0: number, x0: number) => ray(x0, y0, ix, y0 + slope * (ix - x0), "lab-ray-virtual", false);
    rays += back(slope1, T.y, lx) + back(slope2, T.y, lx);
    image = line(ix, cy, ix, iy, "lab-image-virtual");
  }
  return (
    open("Eine Sammellinse bildet einen Gegenstandspfeil ab: drei Strahlen und das Bild") +
    line(10, cy, 510, cy, "lab-axis") +
    rays +
    lensShape(lx, cy, true) +
    circle(Fl.x, cy, 3.5, "lab-marker") +
    text(Fl.x, cy + 20, "F", "lab-text-small", "middle") +
    circle(Fr.x, cy, 3.5, "lab-marker") +
    text(Fr.x, cy + 20, "F′", "lab-text-small", "middle") +
    arrow(T.x, cy, T.x, T.y, "lab-object", 4) +
    image +
    text(20, 24, str(r, "kind"), "lab-text lab-text-big") +
    text(20, 46, `g = ${fmtUnit(g, "cm", 0)}, b = ${img.b === 999 ? "∞" : fmtUnit(Math.abs(img.b), "cm", 1)}${img.b < 0 ? " (virtuell)" : ""}`, "lab-text-muted") +
    CLOSE
  );
}

// ─── 2.9 Auge ─────────────────────────────────────────────────────────────

function eyeGlasses(v: LabValues, r: ReadoutValues): string {
  const cy = 150;
  const retinaX = 470;
  const lensX = 240;
  const dx = eyeFocusShift(v.eye, v.D);
  const focusX = retinaX + dx * 9;
  const hEntry = 34;
  const hLens = hEntry * (1 - 0.07 * v.D);
  let rays = "";
  for (const sign of [-1, 1]) {
    const y0 = cy + sign * hEntry;
    const yl = cy + sign * hLens;
    const slope = (cy - yl) / (focusX - lensX);
    rays +=
      ray(20, y0, 150, y0, "lab-ray") +
      ray(150, y0, lensX, yl, "lab-ray", false) +
      ray(lensX, yl, retinaX + 25, yl + slope * (retinaX + 25 - lensX), "lab-ray");
  }
  const blur = Math.abs(hLens) * (Math.abs(retinaX - focusX) / Math.max(1, focusX - lensX));
  const sharp = Math.abs(dx) <= 0.5;
  let glasses = "";
  if (v.D > 0) glasses = path(`M150 ${cy - 55} Q172 ${cy} 150 ${cy + 55} Q128 ${cy} 150 ${cy - 55} Z`, "lab-lens");
  else if (v.D < 0) glasses = path(`M140 ${cy - 55} H160 Q150 ${cy} 160 ${cy + 55} H140 Q150 ${cy} 140 ${cy - 55} Z`, "lab-lens");
  return (
    open("Paralleles Licht läuft durch eine Brille und die Augenlinse auf die Netzhaut") +
    `<ellipse cx="${(lensX + retinaX) / 2}" cy="${cy}" rx="${(retinaX - lensX) / 2 + 6}" ry="78" class="lab-bulb-off" />` +
    rays +
    glasses +
    path(`M${lensX} ${cy - 40} Q${lensX + 16} ${cy} ${lensX} ${cy + 40} Q${lensX - 16} ${cy} ${lensX} ${cy - 40} Z`, "lab-lens") +
    path(`M${retinaX} ${cy - 70} Q${retinaX + 14} ${cy} ${retinaX} ${cy + 70}`, "lab-wall") +
    `<line x1="${retinaX + 2}" y1="${r1(cy - clamp(blur, 1.5, 70))}" x2="${retinaX + 2}" y2="${r1(cy + clamp(blur, 1.5, 70))}" class="${sharp ? "lab-ok" : "lab-bad"}" stroke="${sharp ? "var(--success)" : "var(--danger)"}" stroke-width="6" />` +
    circle(focusX, cy, 4, "lab-marker") +
    text(lensX, 70, "Augenlinse", "lab-text-small", "middle") +
    text(retinaX, 70, "Netzhaut", "lab-text-small", "middle") +
    (glasses ? text(150, 70, "Brille", "lab-text-small", "middle") : "") +
    text(20, 24, str(r, "state"), "lab-text lab-text-big") +
    text(20, 42, `Bildlage ${fmt(dx, 1)} mm zur Netzhaut (roter Punkt: scharfer Punkt)`, "lab-text-muted") +
    text(20, 285, "Linse rechts: Augenlinse, links: Brille. Vereinfachtes Modell.", "lab-text-small") +
    CLOSE
  );
}

export const OPTIK_RENDERERS: Partial<Record<LabKind, Renderer>> = {
  seeing,
  shadow,
  eclipse,
  reflection,
  refraction,
  "total-reflection": totalReflection,
  "lens-rays": lensRays,
  "lens-image": lensImageDrawing,
  "eye-glasses": eyeGlasses,
};
