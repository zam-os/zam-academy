import { fmt } from "../exercises/format";
import {
  W,
  arcPath,
  circle,
  handle,
  infoBox,
  line,
  num,
  open,
  path,
  polar,
  polygon,
  r1,
  rect,
  sectorPath,
  text,
  type LabView,
} from "./svg";
import { title } from "./view-helpers";

/** 7. Kreis, Durchmesser & Abrollen des Umfangs (Kreiszahl π) */
export const circlePiPartsView: LabView = {
  render(v, r) {
    const radius = v.r ?? 3;
    const roll = (v.roll ?? 100) / 100;
    const scale = 16;
    const radPx = radius * scale;
    const cx = 110 + roll * 180;
    const cy = 148;
    const circ = num(r, "u");
    const rolledLen = Math.min(280, circ * scale * 0.45 * roll);

    return (
      open("Kreisumfang und Kreiszahl Pi") +
      title("Durchmesser d und abgerollter Umfang u = π · d") +
      line(56, cy + radPx, 468, cy + radPx, "lab-axis") +
      line(56, cy + radPx, 56 + rolledLen, cy + radPx, "lab-side-b") +
      circle(cx, cy, radPx, "lab-fill-a") +
      line(cx - radPx, cy, cx + radPx, cy, "lab-axis") +
      line(cx, cy, cx + radPx, cy, "lab-side-a") +
      text(cx, cy - 8, `d = ${fmt(2 * radius, 1)}`, "lab-text", "middle") +
      text(56 + rolledLen / 2, cy + radPx + 20, `u ≈ ${fmt(circ, 2)}`, "lab-text", "middle") +
      handle("r", cx + radPx, cy, "Radius r") +
      infoBox(
        304,
        64,
        [
          [`u : d = ${fmt(circ / (2 * radius), 4)} ≈ π`, "lab-text"],
          [`u = 2 · π · r ≈ ${fmt(circ, 2)} cm`, "lab-text-small"],
        ],
      ) +
      "</svg>"
    );
  },
  handles: {
    r: {
      x: "r",
      drag(pt, v) {
        const cx = 110 + ((v.roll ?? 100) / 100) * 180;
        const rRaw = (pt.x - cx) / 16;
        return { r: Math.max(1.5, Math.min(6, Math.round(rRaw * 2) / 2)) };
      },
    },
  },
};

/** 8. Kreisausschnitt (Sektor) & Kreisbogen b */
export const circleArcView: LabView = {
  render(v, r) {
    const radius = v.r ?? 4;
    const mu = v.mu ?? 90;
    const cx = 175;
    const cy = 172;
    const pxR = radius * 21;
    const pEnd = polar(cx, cy, pxR, mu);

    return (
      open("Kreisbogen und Kreissektor") +
      title(`Mittelpunktswinkel μ = ${fmt(mu, 0)}° und Kreisbogen b`) +
      circle(cx, cy, pxR, "lab-plot-bg") +
      path(sectorPath(cx, cy, pxR, 0, mu), "lab-fill-a") +
      path(arcPath(cx, cy, pxR, 0, mu), "lab-side-a") +
      line(cx, cy, cx + pxR, cy, "lab-axis") +
      line(cx, cy, pEnd.x, pEnd.y, "lab-axis") +
      handle("mu", pEnd.x, pEnd.y, "Winkel μ") +
      infoBox(
        318,
        84,
        [
          [`b ≈ ${fmt(num(r, "b"), 2)} cm`, "lab-text"],
          [`A_Sektor ≈ ${fmt(num(r, "aSek"), 2)} cm²`, "lab-text-small"],
        ],
      ) +
      text(cx + 30, cy - 12, `${fmt(mu, 0)}°`, "lab-text") +
      "</svg>"
    );
  },
  handles: {
    mu: {
      x: "mu",
      drag(pt) {
        const ang = (Math.atan2(172 - pt.y, pt.x - 175) * 180) / Math.PI;
        const norm = ang < 0 ? ang + 360 : ang;
        return { mu: Math.max(30, Math.min(330, Math.round(norm / 15) * 15)) };
      },
    },
  },
};

/** 9. Zusammengesetzter Umfang (Stadionbahn oder Halbkreis auf Rechteck) */
export const compositePerimeterView: LabView = {
  render(v, r) {
    const a = v.a ?? 6;
    const b = v.b ?? 4;
    const mode = v.mode ?? 0;
    const rad = b / 2;
    const scale = 22;
    const wPx = a * scale;
    const hPx = b * scale;
    const radPx = rad * scale;
    const x0 = 260 - wPx / 2;
    const y0 = 152 - hPx / 2;

    let shapeSvg = "";
    if (mode === 0) {
      shapeSvg =
        rect(x0, y0, wPx, hPx, "lab-plot-bg") +
        path(arcPath(x0, y0 + radPx, radPx, 90, 270), "lab-fill-a") +
        path(arcPath(x0 + wPx, y0 + radPx, radPx, -90, 90), "lab-fill-a") +
        line(x0, y0, x0 + wPx, y0, "lab-side-a") +
        line(x0, y0 + hPx, x0 + wPx, y0 + hPx, "lab-side-a");
    } else {
      shapeSvg =
        rect(x0, y0, wPx, hPx, "lab-fill-a") +
        path(arcPath(x0 + wPx, y0 + radPx, radPx, -90, 90), "lab-fill-b");
    }

    return (
      open("Zusammengesetzter Umfang") +
      title("Gerade Kanten plus Kreisbögen am Rand") +
      shapeSvg +
      text(260, y0 + hPx + 26, `Gerade l = ${fmt(a, 1)} cm · Breite b = ${fmt(b, 1)} cm (d = ${fmt(b, 1)} cm)`, "lab-text-small", "middle") +
      infoBox(
        310,
        260,
        [
          [`Umfang u ≈ ${fmt(num(r, "u"), 2)} cm`, "lab-text"],
          [`Fläche A ≈ ${fmt(num(r, "area"), 2)} cm²`, "lab-text-small"],
        ],
      ) +
      "</svg>"
    );
  },
};

/** 10. Zylinder: Schrägbild und aufgeklapptes Netz */
export const cylinderNetView: LabView = {
  render(v, r) {
    const rad = v.r ?? 3;
    const hk = v.hk ?? 5;
    const fold = v.fold ?? 0;

    if (fold === 0) {
      const rx = rad * 18;
      const ry = Math.max(10, rad * 6);
      const hPx = hk * 20;
      const cx = 195;
      const topY = 92;
      const botY = topY + hPx;
      const bodyPath = `M${r1(cx - rx)} ${r1(topY)} L${r1(cx - rx)} ${r1(botY)} A${r1(rx)} ${r1(ry)} 0 0 0 ${r1(cx + rx)} ${r1(botY)} L${r1(cx + rx)} ${r1(topY)} Z`;
      return (
        open("Zylinder-Schrägbild") +
        title("Gerader Kreiszylinder (Ansicht)") +
        path(bodyPath, "lab-fill-a") +
        `<ellipse cx="${r1(cx)}" cy="${r1(topY)}" rx="${r1(rx)}" ry="${r1(ry)}" class="lab-fill-b" />` +
        line(cx, topY, cx + rx, topY, "lab-side-a") +
        text(cx + rx / 2, topY - 12, `r = ${fmt(rad, 1)}`, "lab-text", "middle") +
        line(cx + rx + 14, topY, cx + rx + 14, botY, "lab-axis") +
        text(cx + rx + 24, (topY + botY) / 2, `hₖ = ${fmt(hk, 1)}`, "lab-text") +
        infoBox(
          318,
          96,
          [
            [`G ≈ ${fmt(num(r, "G"), 1)} cm²`, "lab-text"],
            [`M ≈ ${fmt(num(r, "M"), 1)} · O ≈ ${fmt(num(r, "O"), 1)}`, "lab-text-small"],
          ],
        ) +
        "</svg>"
      );
    }

    const rPx = Math.min(34, rad * 8);
    const mw = Math.min(270, 2 * Math.PI * rad * 8);
    const mh = Math.min(126, hk * 17);
    const mx = 260 - mw / 2;
    const my = 122;
    return (
      open("Zylindernetz") +
      title("Zylindernetz: Zwei Kreise + Rechteck u × hₖ") +
      rect(mx, my, mw, mh, "lab-fill-a", 'rx="3"') +
      circle(260, my - rPx, rPx, "lab-fill-b") +
      circle(260, my + mh + rPx, rPx, "lab-fill-b") +
      text(260, my + mh / 2 + 4, `Mantel b = u ≈ ${fmt(num(r, "u"), 1)} · hₖ = ${fmt(hk, 1)}`, "lab-text-small", "middle") +
      infoBox(
        318,
        264,
        [
          [`M ≈ ${fmt(num(r, "M"), 1)} cm²`, "lab-text"],
          [`O = 2·G + M ≈ ${fmt(num(r, "O"), 1)} cm²`, "lab-text-small"],
        ],
      ) +
      "</svg>"
    );
  },
};

/** 11. Kreisflächenherleitung durch Zerlegung in n Sektoren + In-/Umquadrat */
export const circleAreaSectorsView: LabView = {
  render(v, r) {
    const rad = v.r ?? 3;
    const parts = Math.max(4, Math.round(v.parts ?? 8));
    const cx = 135;
    const cy = 164;
    const pxR = rad * 18;
    const outerSide = pxR * 2;

    let sectors = "";
    const stepDeg = 360 / parts;
    for (let i = 0; i < parts; i++) {
      sectors += path(
        sectorPath(cx, cy, pxR, i * stepDeg, (i + 1) * stepDeg),
        i % 2 === 0 ? "lab-fill-a" : "lab-fill-b",
      );
    }

    const boxW = Math.min(185, Math.PI * rad * 13);
    const boxH = Math.min(115, rad * 18);
    const rx = 285;
    const ry = 164 - boxH / 2;
    const teeth = Math.min(parts, 12);
    const toothW = boxW / teeth;
    let strips = "";
    for (let i = 0; i < teeth; i++) {
      strips += rect(
        rx + i * toothW,
        ry,
        toothW - 1,
        boxH,
        i % 2 === 0 ? "lab-fill-a" : "lab-fill-b",
        'rx="2"',
      );
    }

    return (
      open("Kreisfläche herleiten") +
      title(`Kreis in ${parts} Sektoren → Rechteck (π · r) × r = π · r²`) +
      rect(cx - pxR, cy - pxR, outerSide, outerSide, "lab-grid") +
      sectors +
      strips +
      text(rx + boxW / 2, ry - 12, `Länge ≈ ½·u = π·r ≈ ${fmt(Math.PI * rad, 1)}`, "lab-text-small", "middle") +
      text(rx + boxW / 2, ry + boxH + 18, `Höhe = r = ${fmt(rad, 1)}`, "lab-text", "middle") +
      infoBox(
        285,
        262,
        [
          [`Kreisfläche A ≈ ${fmt(num(r, "A"), 2)} cm²`, "lab-text"],
          [`Schranke: 2r² = ${fmt(2 * rad * rad, 0)} < A < 4r² = ${fmt(4 * rad * rad, 0)}`, "lab-text-small"],
        ],
      ) +
      "</svg>"
    );
  },
};

/** 12. Kreisring (R > r) & Sektorwinkel */
export const annulusSectorView: LabView = {
  render(v, r) {
    const R = v.R ?? 5;
    const rad = Math.min(v.r ?? 2.5, R - 0.5);
    const mu = v.mu ?? 360;
    const cx = 175;
    const cy = 166;
    const scale = 18;
    const rOuter = R * scale;
    const rInner = rad * scale;

    return (
      open("Kreisring und Kreissektor") +
      title(`Kreisring R = ${fmt(R, 1)} cm, r = ${fmt(rad, 1)} cm`) +
      path(sectorPath(cx, cy, rOuter, 0, mu), "lab-fill-a") +
      path(sectorPath(cx, cy, rInner, 0, mu), "lab-plot-bg") +
      circle(cx, cy, rOuter, "lab-grid") +
      circle(cx, cy, rInner, "lab-grid") +
      line(cx, cy, cx + rOuter, cy, "lab-axis") +
      handle("R", cx + rOuter, cy, "Außenradius R") +
      infoBox(
        312,
        78,
        [
          [`A ≈ ${fmt(num(r, "area"), 2)} cm²`, "lab-text"],
          [mu === 360 ? "Vollring (360°)" : `Ausschnitt ${fmt(mu, 0)}°`, "lab-text-small"],
        ],
      ) +
      "</svg>"
    );
  },
  handles: {
    R: {
      x: "R",
      drag(pt) {
        const raw = (pt.x - 175) / 18;
        return { R: Math.max(3, Math.min(6, Math.round(raw * 2) / 2)) };
      },
    },
  },
};

/** 13. Zusammengesetzte Kreisflächen (Quadrat mit Halbkreis / Quadrant-Aussparung) */
export const compositeCircleAreaView: LabView = {
  render(v, r) {
    const a = v.a ?? 6;
    const mode = v.mode ?? 0;
    const scale = 22;
    const sPx = a * scale;
    const x0 = 170 - sPx / 2;
    const y0 = 166 - sPx / 2;
    const halfPx = sPx / 2;

    let shape = "";
    if (mode === 0) {
      shape =
        rect(x0, y0 + 20, sPx, sPx, "lab-fill-a") +
        path(sectorPath(x0 + halfPx, y0 + 20, halfPx, 0, 180), "lab-fill-b");
    } else {
      shape =
        rect(x0, y0, sPx, sPx, "lab-fill-a") +
        path(sectorPath(x0, y0, halfPx, -90, 0), "lab-plot-bg") +
        path(sectorPath(x0 + sPx, y0, halfPx, 180, 270), "lab-plot-bg") +
        path(sectorPath(x0, y0 + sPx, halfPx, 0, 90), "lab-plot-bg") +
        path(sectorPath(x0 + sPx, y0 + sPx, halfPx, 90, 180), "lab-plot-bg");
    }

    return (
      open("Zusammengesetzte Kreisflächen") +
      title(mode === 0 ? "Quadrat plus Halbkreis" : "Quadrat minus ein voller Kreis (4 Viertel)") +
      shape +
      text(170, y0 + sPx + 40, `Seite a = ${fmt(a, 1)} cm`, "lab-text", "middle") +
      infoBox(
        312,
        96,
        [
          [`Gesamtfläche A ≈ ${fmt(num(r, "area"), 2)} cm²`, "lab-text"],
          [`Quadrat a² = ${fmt(a * a, 1)} cm²`, "lab-text-small"],
        ],
      ) +
      "</svg>"
    );
  },
};

/** 14. Zylindervolumen V = G · hₖ = r² · π · hₖ mit Füllstand */
function createCylinderVolumeView(literMode: boolean): LabView {
  return {
    render(v, r) {
      const rad = v.r ?? 3;
      const hk = v.hk ?? 6;
      const fill = (v.fill ?? 100) / 100;
      const rx = rad * 18;
      const ry = Math.max(9, rad * 5.5);
      const hPx = hk * 18;
      const cx = 185;
      const botY = 264;
      const topY = botY - hPx;
      const fillH = hPx * fill;
      const fillTopY = botY - fillH;

      const uLen = literMode ? "dm" : "cm";
      const uArea = literMode ? "dm²" : "cm²";
      const uVol = literMode ? "dm³ (l)" : "cm³";
      const labelTitle = literMode
        ? "Behälter- & Teilvolumen (1 dm³ = 1 Liter)"
        : "Zylindervolumen V = G · hₖ = r² · π · hₖ";

      const shellPath = `M${r1(cx - rx)} ${r1(topY)} L${r1(cx - rx)} ${r1(botY)} A${r1(rx)} ${r1(ry)} 0 0 0 ${r1(cx + rx)} ${r1(botY)} L${r1(cx + rx)} ${r1(topY)} Z`;
      const liquidPath = `M${r1(cx - rx)} ${r1(fillTopY)} L${r1(cx - rx)} ${r1(botY)} A${r1(rx)} ${r1(ry)} 0 0 0 ${r1(cx + rx)} ${r1(botY)} L${r1(cx + rx)} ${r1(fillTopY)} Z`;

      return (
        open(labelTitle) +
        title(labelTitle) +
        path(shellPath, "lab-plot-bg") +
        (fill > 0 ? path(liquidPath, "lab-fill-a") : "") +
        `<ellipse cx="${r1(cx)}" cy="${r1(fillTopY)}" rx="${r1(rx)}" ry="${r1(ry)}" class="lab-fill-b" />` +
        `<ellipse cx="${r1(cx)}" cy="${r1(topY)}" rx="${r1(rx)}" ry="${r1(ry)}" class="lab-grid" />` +
        text(cx, botY + 26, `r = ${fmt(rad, 1)} ${uLen} · hₖ = ${fmt(hk, 1)} ${uLen}`, "lab-text", "middle") +
        infoBox(
          318,
          96,
          [
            [`G ≈ ${fmt(num(r, "G"), 1)} ${uArea}`, "lab-text"],
            [`V ≈ ${fmt(num(r, "V"), 1)} ${uVol} (${fmt(fill * 100, 0)} %)`, "lab-text-small"],
          ],
        ) +
        "</svg>"
      );
    },
  };
}

export const cylinderVolumeView = createCylinderVolumeView(false);
export const cylinderCompoundView = createCylinderVolumeView(true);

/** 15. Hohlzylinder / Rohrvolumen V = (R² − r²) · π · hₖ */
export const hollowCylinderView: LabView = {
  render(v, r) {
    const R = v.R ?? 5;
    const rad = Math.min(v.r ?? 3, R - 0.5);
    const hk = v.hk ?? 6;
    const cx = 135;
    const cy = 166;
    const scale = 17;
    const rx = R * scale;
    const rIn = rad * scale;
    const pipeLen = hk * 15;

    return (
      open("Hohlzylinder") +
      title("Hohlzylinder / Rohr: V = (R² − r²) · π · hₖ") +
      circle(cx, cy, rx, "lab-fill-a") +
      circle(cx, cy, rIn, "lab-plot-bg") +
      rect(245, cy - rx * 0.45, pipeLen, rx * 0.9, "lab-fill-a", 'rx="3"') +
      rect(245, cy - rIn * 0.45, pipeLen, rIn * 0.9, "lab-plot-bg") +
      line(cx, cy, cx + rx, cy, "lab-side-a") +
      text(cx, cy + rx + 22, `R = ${fmt(R, 1)} · r = ${fmt(rad, 1)}`, "lab-text", "middle") +
      text(245 + pipeLen / 2, cy + rx * 0.45 + 22, `Länge hₖ = ${fmt(hk, 1)} cm`, "lab-text-small", "middle") +
      infoBox(
        245,
        250,
        [
          [`Ringfläche G ≈ ${fmt(num(r, "G"), 1)} cm²`, "lab-text"],
          [`Volumen V ≈ ${fmt(num(r, "V"), 1)} cm³`, "lab-text-small"],
        ],
      ) +
      "</svg>"
    );
  },
};

export { W, polygon };
