import { fmt } from "../exercises/format";
import {
  annulusArea,
  circleArea,
  cylinderLateral,
  cylinderSurface,
  cylinderVolume,
  prismSurface,
  prismVolume,
  regularPolygonArea,
  sectorArc,
  sectorArea,
} from "../curriculum/math";
import {
  circle,
  ellipse,
  infoBox,
  line,
  open,
  path,
  polygon,
  rect,
  sectorPath,
  text,
  type LabView,
} from "./svg";
import { rail, railHandle, title } from "./view-helpers";

/** Lab views for Stage 7: Kreis und Zylinder. */

const circlePiUnroll: LabView = {
  render(v) {
    const d = v.d;
    const roll = v.roll;
    const u = Math.PI * d;
    const rolled = (roll / 100) * u;
    const scale = 15;
    const startX = 64;
    const groundY = 178;
    const rPx = (d * scale) / 2;
    const cx = startX + rolled * scale;
    const cy = groundY - rPx;
    let out = open("Kreiszahl Pi durch Abrollen entdecken");
    out += title(`Durchmesser d = ${fmt(d, 0)} cm   ·   Umfang U = π · d ≈ ${fmt(u, 2)} cm`);

    // Ruler
    out += line(startX, groundY, 470, groundY, "lab-axis");
    for (let cm = 0; cm <= 26; cm += 2) {
      const tx = startX + cm * scale;
      out += line(tx, groundY - 4, tx, groundY + 4, "lab-axis");
      if (cm % 4 === 0) out += text(tx, groundY + 18, fmt(cm, 0), "lab-text-tick", "middle");
    }
    out += line(startX, groundY, cx, groundY, "lab-side-ok");
    out += circle(cx, cy, rPx, "lab-fill-a lab-side-a");
    out += line(cx - rPx, cy, cx + rPx, cy, "lab-side-b");
    out += circle(startX, groundY, 4, "lab-point-ok");
    out += circle(cx, groundY, 4, "lab-point-ok");

    out += rect(64, 212, 392, 42, "lab-panel", 'rx="8"');
    out += text(260, 238, `Abgerollt (${fmt(roll, 0)} %): ${fmt(rolled, 2)} cm   ·   U / d = π ≈ 3,14`, "lab-text-a", "middle");
    out += rail("roll", "Abrollen (%)", roll, 0, 100, 296);
    return out + "</svg>";
  },
  handles: { roll: railHandle("roll", 0, 100) },
};

const circleAreaSectors: LabView = {
  render(v) {
    const r = v.r;
    const slices = v.slices;
    const area = circleArea(r);
    let out = open("Kreisfläche über Sektorenzerlegung begründen");
    out += title(`Radius r = ${fmt(r, 1)} cm   ·   A = π · r² ≈ ${fmt(area, 2)} cm²`);

    const cR = 14 + r * 11;
    const cx = 104;
    const cy = 148;
    out += circle(cx, cy, cR, "lab-fill-a lab-side-a");
    for (let i = 0; i < slices; i++) {
      const ang = (i * 360 * Math.PI) / (slices * 180);
      out += line(cx, cy, cx + cR * Math.cos(ang), cy + cR * Math.sin(ang), "lab-axis");
    }
    out += line(cx, cy, cx + cR, cy, "lab-side-b");
    out += text(cx, cy + cR + 20, `r = ${fmt(r, 1)} cm`, "lab-text-b", "middle");

    // Approximate rectangle of width pi*r and height r
    const rectW = Math.min(200, Math.PI * r * 11);
    const rectH = r * 11;
    const rx0 = 240;
    const ry0 = 148 - rectH / 2;
    out += rect(rx0, ry0, rectW, rectH, "lab-fill-ok lab-side-ok");
    out += text(rx0 + rectW / 2, ry0 - 10, `Breite ≈ π · r (${fmt(Math.PI * r, 2)} cm)`, "lab-text-ok", "middle");
    out += text(rx0 + rectW + 10, 152, `r`, "lab-text-b");

    out += rail("r", "Radius r (cm)", r, 1, 5, 294, 1);
    return out + "</svg>";
  },
  handles: { r: railHandle("r", 1, 5) },
};

const circleParts: LabView = {
  render(v) {
    const isRing = v.mode === 1;
    const r = v.r;
    const alpha = v.alpha;
    const rInner = Math.min(v.ri, r - 1);
    const cx = 145;
    const cy = 152;
    const pxR = r * 16;
    let out = open("Kreisteile: Sektor und Kreisring");
    if (!isRing) {
      const arc = sectorArc(r, alpha);
      const area = sectorArea(r, alpha);
      out += title(`Kreissektor: r = ${fmt(r, 0)} cm, α = ${fmt(alpha, 0)}°`);
      out += circle(cx, cy, pxR, "lab-dashed");
      out += path(sectorPath(cx, cy, pxR, 0, alpha), "lab-fill-a lab-side-a");
      out += infoBox(498, 86, [
        [`Bogen b = ${fmt(arc, 2)} cm`, "lab-text-a"],
        [`Fläche A = ${fmt(area, 2)} cm²`, "lab-text-ok"],
        [`Anteil: ${fmt(alpha, 0)}° / 360°`, "lab-text-small"],
      ], "end");
      out += rail("alpha", "Winkel α (°)", alpha, 30, 270, 294);
    } else {
      const area = annulusArea(r, rInner);
      const pxRi = rInner * 16;
      out += title(`Kreisring: R = ${fmt(r, 0)} cm, r = ${fmt(rInner, 0)} cm`);
      out += circle(cx, cy, pxR, "lab-fill-b lab-side-b");
      out += circle(cx, cy, pxRi, "lab-plot-bg lab-side-a");
      out += infoBox(498, 86, [
        [`Außen R = ${fmt(r, 0)} cm`, "lab-text-b"],
        [`Innen r = ${fmt(rInner, 0)} cm`, "lab-text-a"],
        [`A_Ring = ${fmt(area, 2)} cm²`, "lab-text-ok"],
      ], "end");
      out += rail("r", "Außenradius R (cm)", r, 2, 6, 294);
    }
    return out + "</svg>";
  },
  handles: {},
};

const cylinderPrismNet: LabView = {
  render(v) {
    const isPrism = v.body === 1;
    const r = v.r;
    const h = v.h;
    const G = isPrism ? r * r : circleArea(r);
    const M = isPrism ? 4 * r * h : cylinderLateral(r, h);
    const O = isPrism ? prismSurface(r * r, 4 * r, h) : cylinderSurface(r, h);
    let out = open("Schrägbild und Körpernetz von Prisma und Zylinder");
    out += title(isPrism ? `Quadratisches Prisma (a = ${fmt(r, 0)} cm, h = ${fmt(h, 0)} cm)` : `Gerader Kreiszylinder (r = ${fmt(r, 0)} cm, h = ${fmt(h, 0)} cm)`);

    // Left oblique sketch
    const cx = 96;
    const topY = 92;
    const hPx = h * 15;
    if (isPrism) {
      const s = r * 14;
      out += rect(cx - s / 2, topY, s, hPx, "lab-fill-a lab-side-a");
      out += polygon(
        [
          { x: cx - s / 2, y: topY },
          { x: cx + s / 2, y: topY },
          { x: cx + s / 2 + 16, y: topY - 12 },
          { x: cx - s / 2 + 16, y: topY - 12 },
        ],
        "lab-fill-ok lab-side-ok",
      );
      out += line(cx + s / 2 + 16, topY - 12, cx + s / 2 + 16, topY + hPx - 12, "lab-side-a");
      out += line(cx + s / 2, topY + hPx, cx + s / 2 + 16, topY + hPx - 12, "lab-side-a");
    } else {
      const rx = r * 11;
      const ry = Math.max(8, rx * 0.34);
      out += ellipse(cx, topY, rx, ry, "lab-fill-ok lab-side-ok");
      out += line(cx - rx, topY, cx - rx, topY + hPx, "lab-side-a");
      out += line(cx + rx, topY, cx + rx, topY + hPx, "lab-side-a");
      out += path(`M${cx - rx} ${topY + hPx} A${rx} ${ry} 0 0 0 ${cx + rx} ${topY + hPx}`, "lab-side-a");
    }

    // Right unfolded net
    const netX = 210;
    const netY = 114;
    const mW = isPrism ? Math.min(180, r * 36) : Math.min(185, r * 38);
    const mH = h * 14;
    out += rect(netX, netY, mW, mH, "lab-net");
    if (isPrism) {
      const sq = mW / 4;
      out += rect(netX, netY - sq, sq, sq, "lab-fill-ok lab-side-ok");
      out += rect(netX, netY + mH, sq, sq, "lab-fill-ok lab-side-ok");
      out += text(netX + mW / 2, netY + mH / 2 + 4, `M = 4a·h`, "lab-text-a", "middle");
    } else {
      const cr = Math.min(26, r * 7);
      out += circle(netX + cr + 10, netY - cr - 2, cr, "lab-fill-ok lab-side-ok");
      out += circle(netX + cr + 10, netY + mH + cr + 2, cr, "lab-fill-ok lab-side-ok");
      out += text(netX + mW / 2, netY + mH / 2 + 4, `M = 2πr·h`, "lab-text-a", "middle");
    }

    out += infoBox(505, 86, [
      [`G = ${fmt(G, 2)} cm²`, "lab-text-ok"],
      [`M = ${fmt(M, 2)} cm²`, "lab-text-a"],
      [`O = 2G + M = ${fmt(O, 2)} cm²`, "lab-text-big"],
    ], "end");
    out += rail("h", "Höhe h (cm)", h, 2, 6, 296);
    return out + "</svg>";
  },
  handles: { h: railHandle("h", 2, 6) },
};

const prismToCylinder: LabView = {
  render(v) {
    const n = v.n;
    const r = v.r;
    const h = v.h;
    const gPoly = regularPolygonArea(n, r);
    const vPoly = prismVolume(gPoly, h);
    const vCyl = cylinderVolume(r, h);
    const pct = (vPoly / vCyl) * 100;
    let out = open("Zylinder als Grenzfall gerader Prismen");
    out += title(`${fmt(n, 0)}-Eck-Prisma vs. Kreiszylinder (r = ${fmt(r, 0)} cm, h = ${fmt(h, 0)} cm)`);

    const cx = 148;
    const cy = 148;
    const pxR = r * 19;
    out += circle(cx, cy, pxR, "lab-fill-ok lab-side-ok");
    const pts = Array.from({ length: n }, (_, i) => {
      const ang = (2 * Math.PI * i) / n - Math.PI / 2;
      return { x: cx + pxR * Math.cos(ang), y: cy + pxR * Math.sin(ang) };
    });
    out += polygon(pts, "lab-fill-a lab-side-a");
    out += text(cx, cy + 4, `${fmt(n, 0)}-Eck`, "lab-text-a", "middle");

    out += infoBox(505, 86, [
      [`V_Prisma = G_n · h = ${fmt(vPoly, 2)} cm³`, "lab-text-a"],
      [`V_Zylinder = πr²·h = ${fmt(vCyl, 2)} cm³`, "lab-text-ok"],
      [`Abdeckung: ${fmt(pct, 1)} %`, "lab-text-big"],
    ], "end");
    out += rail("n", "Eckenanzahl n", n, 4, 32, 294);
    return out + "</svg>";
  },
  handles: { n: railHandle("n", 4, 32) },
};

const bodyModeling: LabView = {
  render(v) {
    const hBox = v.hBox;
    const rTop = v.rTop;
    const hTop = v.hTop;
    const vBox = 36 * hBox;
    const vCyl = cylinderVolume(rTop, hTop);
    const vTot = vBox + vCyl;
    // Surface: cuboid (2*36 + 24*hBox) + cylinder lateral (2*pi*rTop*hTop) (top disk replaces covered disk!)
    const oTot = 72 + 24 * hBox + cylinderLateral(rTop, hTop);
    let out = open("Zusammengesetzter Körper im Sachkontext");
    out += title(`Sockel (6×6×${fmt(hBox, 0)} cm) + Aufsatz (r = ${fmt(rTop, 0)} cm, h = ${fmt(hTop, 0)} cm)`);

    const bx = 92;
    const by = 186 - hBox * 14;
    out += rect(bx, by, 108, hBox * 14, "lab-fill-a lab-side-a");
    const rx = rTop * 15;
    const ry = 8;
    const cx = bx + 54;
    const topY = by - hTop * 14;
    out += ellipse(cx, topY, rx, ry, "lab-fill-ok lab-side-ok");
    out += line(cx - rx, topY, cx - rx, by, "lab-side-ok");
    out += line(cx + rx, topY, cx + rx, by, "lab-side-ok");
    out += path(`M${cx - rx} ${by} A${rx} ${ry} 0 0 0 ${cx + rx} ${by}`, "lab-side-ok");

    out += infoBox(505, 76, [
      [`V_Sockel = ${fmt(vBox, 0)} cm³`, "lab-text-a"],
      [`V_Zylinder = ${fmt(vCyl, 2)} cm³`, "lab-text-ok"],
      [`V_gesamt = ${fmt(vTot, 2)} cm³`, "lab-text-big"],
      [`O_außen = ${fmt(oTot, 2)} cm²`, "lab-text-small"],
    ], "end");
    out += rail("hBox", "Sockelhöhe (cm)", hBox, 2, 6, 294);
    return out + "</svg>";
  },
  handles: { hBox: railHandle("hBox", 2, 6) },
};

export const VIEWS_KREIS_ZYLINDER: Record<string, LabView> = {
  "circle-pi-unroll": circlePiUnroll,
  "circle-area-sectors": circleAreaSectors,
  "circle-parts": circleParts,
  "cylinder-prism-net": cylinderPrismNet,
  "prism-to-cylinder": prismToCylinder,
  "body-modeling": bodyModeling,
};
