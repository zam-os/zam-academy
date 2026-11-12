import { fmt } from "../exercises/format";
import {
  arcPath,
  circle,
  handle,
  infoBox,
  line,
  num,
  open,
  path,
  polar,
  r1,
  rect,
  sectorPath,
  text,
  type LabView,
} from "./svg";
import { title } from "./view-helpers";

/** 1. Verkettete Preisänderungen, Rabatt + Skonto + USt & Wachstumsfaktor q */
export const discountChainView: LabView = {
  render(v, r) {
    const start = v.start ?? 100;
    const mid = num(r, "mid");
    const end = num(r, "end");
    const maxVal = Math.max(start, mid, end, 120) * 1.15;
    const barW = (val: number) => Math.max(8, (Math.max(0, val) / maxVal) * 320);

    const rows = [
      { label: "Ausgangspreis", val: start, cls: "lab-bar-a", y: 82 },
      {
        label: `1. Schritt (${(v.p1 ?? 0) >= 0 ? "+" : ""}${fmt(v.p1 ?? 0, 0)} %)`,
        val: mid,
        cls: "lab-bar-b",
        y: 138,
      },
      {
        label: `2. Schritt (${(v.p2 ?? 0) >= 0 ? "+" : ""}${fmt(v.p2 ?? 0, 0)} %)`,
        val: end,
        cls: "lab-bar-c",
        y: 194,
      },
    ];

    const bars = rows
      .map((row) => {
        const w = barW(row.val);
        return (
          text(36, row.y - 6, row.label, "lab-text-small") +
          rect(36, row.y, w, 28, row.cls, 'rx="4"') +
          text(44 + w, row.y + 19, `${fmt(row.val, 2)} €`, "lab-text")
        );
      })
      .join("");

    const q1 = 1 + (v.p1 ?? 0) / 100;
    const q2 = 1 + (v.p2 ?? 0) / 100;
    const hx = 120 + ((v.p1 ?? 0) + 50) * 2.8;
    return (
      open("Preisänderung in zwei Schritten") +
      title("Preisänderungen & Wachstumsfaktor q") +
      bars +
      line(36, 250, 484, 250, "lab-axis") +
      text(36, 274, "Ziehpunkt 1. Änderung (−50 % bis +50 %):", "lab-text-muted") +
      line(120, 294, 400, 294, "lab-grid") +
      handle("p1", hx, 294, "1. Änderung") +
      infoBox(
        310,
        46,
        [
          [`q = ${fmt(q1, 2)} · ${fmt(q2, 2)} = ${fmt(q1 * q2, 4)}`, "lab-text"],
          [`Gesamt: ${fmt(end - start, 2)} € (${fmt(num(r, "netPct"), 1)} %)`, "lab-text-small"],
        ],
      ) +
      "</svg>"
    );
  },
  handles: {
    p1: {
      x: "p1",
      drag(pt) {
        const p = -50 + ((pt.x - 120) / 280) * 100;
        return { p1: Math.max(-50, Math.min(50, Math.round(p / 5) * 5)) };
      },
    },
  },
};

/** 2. Brutto, Netto und Tara mit Waage & Mengen-Balken */
export const bruttoNettoTaraView: LabView = {
  render(v, r) {
    const mode = v.mode ?? 0;
    const brutto = num(r, "brutto");
    const netto = v.netto ?? 40;
    const tara = v.tara ?? 10;
    const total = Math.max(brutto, 1);
    const barW = 400;
    const wNet = (netto / total) * barW;
    const wTara = Math.max(0, barW - wNet);

    const label =
      mode === 0
        ? "Gewicht: Brutto = Netto + Tara"
        : "Preis: Brutto = Netto + Umsatzsteuer";
    const subLeft =
      mode === 0
        ? `Netto: ${fmt(netto, 1)} kg`
        : `Netto: ${fmt(netto, 2)} €`;
    const subRight =
      mode === 0
        ? `Tara: ${fmt(tara, 1)} kg (${fmt(num(r, "taraPct"), 1)} %)`
        : `USt: ${fmt(tara, 2)} €`;
    const sumLabel =
      mode === 0
        ? `Bruttomasse: ${fmt(brutto, 1)} kg`
        : `Bruttopreis: ${fmt(brutto, 2)} €`;

    return (
      open(label) +
      title(label) +
      text(60, 88, subLeft, "lab-text-small") +
      text(460, 88, subRight, "lab-text-small", "end") +
      rect(60, 100, barW, 44, "lab-plot-bg", 'rx="6"') +
      rect(60, 100, Math.max(4, wNet), 44, "lab-fill-a", 'rx="6" style="stroke:var(--lab-a);stroke-width:2"') +
      (wTara > 1 ? rect(60 + wNet, 100, wTara, 44, "lab-fill-b", 'rx="6" style="stroke:var(--lab-b);stroke-width:2"') : "") +
      line(60, 165, 460, 165, "lab-axis") +
      text(260, 186, sumLabel, "lab-text", "middle") +
      rect(60, 214, 186, 62, "lab-plot-bg", 'rx="8"') +
      text(74, 240, "Nettoanteil", "lab-text-muted") +
      text(74, 262, `${fmt((netto / total) * 100, 1)} % vom Brutto`, "lab-text") +
      rect(274, 214, 186, 62, "lab-plot-bg", 'rx="8"') +
      text(288, 240, mode === 0 ? "Verpackung (Tara)" : "Steueranteil", "lab-text-muted") +
      text(288, 262, subRight, "lab-text") +
      "</svg>"
    );
  },
};

/** 3. Handelskalkulation von Einkaufspreis bis Brutto-Verkaufspreis */
export const kalkulationSchemaView: LabView = {
  render(v, r) {
    const ek = v.ek ?? 100;
    const sk = num(r, "selfCost");
    const nvk = num(r, "netVk");
    const bvk = num(r, "bruttoVk");
    const maxV = Math.max(bvk, 120);
    const scale = (x: number) => Math.max(6, (x / maxV) * 320);

    const steps = [
      { name: "Einkaufspreis (EK)", val: ek, y: 74, cls: "lab-bar-a" },
      { name: "Selbstkosten (SK)", val: sk, y: 124, cls: "lab-bar-b" },
      { name: "Netto-VK (mit Gewinn)", val: nvk, y: 174, cls: "lab-bar-c" },
      { name: "Brutto-VK (mit USt)", val: bvk, y: 224, cls: "lab-bar-a" },
    ];

    return (
      open("Kalkulationsschema") +
      title("Kalkulation: EK → Selbstkosten → Netto-VK → Brutto-VK") +
      steps
        .map((s) => {
          const w = scale(Math.max(0, s.val));
          return (
            text(34, s.y - 5, s.name, "lab-text-small") +
            rect(34, s.y, w, 22, s.cls, 'rx="4"') +
            text(42 + w, s.y + 16, `${fmt(s.val, 2)} €`, "lab-text")
          );
        })
        .join("") +
      infoBox(
        304,
        276,
        [
          [`Gewinn/Stück: ${fmt(nvk - sk, 2)} €`, "lab-text"],
          [`USt (${fmt(v.ust ?? 19, 0)} %): ${fmt(bvk - nvk, 2)} €`, "lab-text-small"],
        ],
      ) +
      "</svg>"
    );
  },
};

/** 4. Plus-Minus-Diagramm & Halbkreisdiagramm (M8) */
export const percentDiagrams8View: LabView = {
  render(v, r) {
    const mode = v.mode ?? 0;
    if (mode === 0) {
      const vals = [
        { name: "Bereich A", p: v.a ?? 15, y: 86 },
        { name: "Bereich B", p: v.b ?? -10, y: 146 },
        { name: "Bereich C", p: v.c ?? 20, y: 206 },
      ];
      const scale = 3.2;
      return (
        open("Plus-Minus-Diagramm") +
        title("Plus-Minus-Diagramm (Abweichungen in %)") +
        line(260, 62, 260, 262, "lab-axis") +
        text(260, 282, "0 % (Ausgangswert)", "lab-text-muted", "middle") +
        vals
          .map((item) => {
            const w = Math.abs(item.p) * scale;
            const x = item.p >= 0 ? 260 : 260 - w;
            const cls = item.p >= 0 ? "lab-bar-b" : "lab-bar-c";
            const labelX = item.p >= 0 ? 268 + w : 252 - w;
            const anchor = item.p >= 0 ? "start" : "end";
            return (
              text(30, item.y + 20, item.name, "lab-text-small") +
              rect(x, item.y, Math.max(2, w), 30, cls, 'rx="4"') +
              text(
                labelX,
                item.y + 20,
                `${item.p > 0 ? "+" : ""}${fmt(item.p, 0)} %`,
                "lab-text",
                anchor,
              )
            );
          })
          .join("") +
        infoBox(
          304,
          286,
          [
            [`Mittel: ${fmt(num(r, "avg"), 1)} %`, "lab-text"],
            ["Links: Rückgang · Rechts: Zuwachs", "lab-text-small"],
          ],
        ) +
        "</svg>"
      );
    }

    const pa = Math.max(0, v.posA ?? 40);
    const pb = Math.max(0, v.posB ?? 35);
    const sum = Math.max(1, pa + pb + Math.max(0, 100 - pa - pb));
    const a1 = (pa / sum) * 180;
    const a2 = a1 + (pb / sum) * 180;
    const cx = 260;
    const cy = 248;
    const rad = 148;
    return (
      open("Halbkreisdiagramm") +
      title("Halbkreisdiagramm (180° = 100 % → 1 % = 1,8°)") +
      path(sectorPath(cx, cy, rad, 180 - a1, 180), "lab-bar-a") +
      path(sectorPath(cx, cy, rad, 180 - a2, 180 - a1), "lab-bar-b") +
      path(sectorPath(cx, cy, rad, 0, 180 - a2), "lab-bar-c") +
      infoBox(
        18,
        64,
        [
          [`Feld A: ${fmt(pa, 0)} % (${fmt(a1, 1)}°)`, "lab-text"],
          [`Feld B: ${fmt(pb, 0)} % (${fmt(a2 - a1, 1)}°)`, "lab-text-small"],
        ],
      ) +
      "</svg>"
    );
  },
};

/** 5. Promille-Skala (1 ‰ = 1/1 000 = 0,1 %) */
export const promilleScaleView: LabView = {
  render(v, r) {
    const pm = v.pm ?? 15;
    const active = Math.min(100, Math.round(pm));
    let cells = "";
    const cellW = 14;
    const startX = 48;
    const startY = 82;
    for (let i = 0; i < 100; i++) {
      const col = i % 20;
      const row = Math.floor(i / 20);
      cells += rect(
        startX + col * (cellW + 2),
        startY + row * (cellW + 2),
        cellW,
        cellW,
        i < active ? "lab-bar-a" : "lab-plot-bg",
        'rx="2"',
      );
    }
    const base = v.base ?? 1000;
    return (
      open("Promille als Tausendstel") +
      title("Promille (‰): Tausendstel verstehen") +
      cells +
      text(48, 186, `Ausschnitt 100 von 1 000 Feldern · markiert: ${fmt(pm, 1)} ‰`, "lab-text-small") +
      infoBox(
        48,
        228,
        [
          [`${fmt(pm, 1)} ‰ = ${fmt(pm / 10, 2)} % = ${fmt(pm / 1000, 4)}`, "lab-text"],
          [`Promillewert von ${fmt(base, 0)}: ${fmt(num(r, "val"), 2)}`, "lab-text-small"],
        ],
      ) +
      "</svg>"
    );
  },
};

/** 6. Quadratzahl & Quadratwurzel geometrisch über die Quadratfläche + Überschlagsskala */
export const squareRootAreaView: LabView = {
  render(v, r) {
    const area = Math.max(1, v.area ?? 25);
    const side = num(r, "side");
    const ox = 56;
    const oy = 250;
    const pxPerUnit = 12;
    const sizePx = side * pxPerUnit;

    const lo = Math.floor(side);
    const hi = lo + 1;
    const barX = 276;
    const barY = 178;
    const barW = 200;
    const fracPos = hi > lo ? (side - lo) / (hi - lo) : 0;
    const markerX = barX + clamp01(fracPos) * barW;

    const hx = ox + sizePx;
    const hy = oy - sizePx;

    return (
      open("Quadratfläche und Seitenlänge") +
      title("Quadratinhalt A und Quadratwurzel a = √A") +
      rect(ox, oy - sizePx, sizePx, sizePx, "lab-fill-a", 'rx="4"') +
      text(ox + sizePx / 2, oy - sizePx / 2 + 5, `A = ${fmt(area, 0)}`, "lab-text", "middle") +
      text(ox + sizePx / 2, oy + 20, `a = √${fmt(area, 0)} ≈ ${fmt(side, 2)}`, "lab-text", "middle") +
      handle("area", hx, hy, "A ändern") +
      rect(barX, 66, barW, 82, "lab-plot-bg", 'rx="8"') +
      text(barX + 12, 92, "Benachbarte Quadratzahlen:", "lab-text-muted") +
      text(barX + 12, 116, `${lo}² = ${lo * lo} ≤ ${fmt(area, 0)} ≤ ${hi * hi} = ${hi}²`, "lab-text") +
      text(barX + 12, 136, `√${fmt(area, 0)} liegt zwischen ${lo} und ${hi}`, "lab-text-small") +
      line(barX, barY, barX + barW, barY, "lab-axis") +
      circle(barX, barY, 4, "lab-dot-small") +
      circle(barX + barW, barY, 4, "lab-dot-small") +
      circle(markerX, barY, 6, "lab-point") +
      text(barX, barY + 20, `${lo}`, "lab-text-small", "middle") +
      text(barX + barW, barY + 20, `${hi}`, "lab-text-small", "middle") +
      text(markerX, barY - 12, fmt(side, 2), "lab-text", "middle") +
      infoBox(
        barX,
        242,
        [
          [`Quadrieren: ${fmt(side, 2)}² = ${fmt(area, 0)}`, "lab-text-small"],
          [`Radizieren: √${fmt(area, 0)} ≈ ${fmt(side, 2)}`, "lab-text-small"],
        ],
      ) +
      "</svg>"
    );
  },
  handles: {
    area: {
      x: "area",
      y: "area",
      drag(pt) {
        const s = Math.max(1, (pt.x - 56) / 12);
        return { area: Math.round(s * s) };
      },
    },
  },
};

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}
export { arcPath, polar, r1 };
