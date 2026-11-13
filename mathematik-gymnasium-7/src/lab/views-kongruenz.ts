import { fmt } from "../exercises/format";
import {
  angleDeg,
  circumcenter,
  dist2D,
  incenter,
  inradius,
  midpoint,
  sswSolutions,
  triangleValid,
} from "../curriculum/math";
import {
  angleMark,
  circle,
  handle,
  infoBox,
  line,
  open,
  Plot,
  polar,
  polygon,
  rect,
  text,
  type LabView,
} from "./svg";
import { rail, railHandle, title } from "./view-helpers";

const congruenceMotion: LabView = {
  render(v) {
    const dx = v.dx;
    const rot = v.rot;
    const basePts = [
      { x: 110, y: 185 },
      { x: 205, y: 185 },
      { x: 140, y: 95 },
    ];
    const cx0 = (basePts[0].x + basePts[1].x + basePts[2].x) / 3;
    const cy0 = (basePts[0].y + basePts[1].y + basePts[2].y) / 3;
    const rad = (rot * Math.PI) / 180;
    const movePt = (p: { x: number; y: number }) => {
      const rx = p.x - cx0;
      const ry = p.y - cy0;
      return {
        x: cx0 + dx + rx * Math.cos(rad) - ry * Math.sin(rad),
        y: cy0 + rx * Math.sin(rad) + ry * Math.cos(rad),
      };
    };
    const movedPts = basePts.map(movePt);
    const aligned = dx === 0 && rot === 0;

    let out = open("Kongruenz: Dreiecke durch Verschieben und Drehen zur Deckung bringen");
    out += title(aligned ? "✓ Deckungsgleich (kongruent): Δ₁ ≅ Δ₂" : `Verschiebung dx = ${fmt(dx, 0)} · Drehung ${fmt(rot, 0)}°`);

    out += polygon(basePts, "lab-fill-a lab-side-a");
    out += polygon(movedPts, aligned ? "lab-fill-ok lab-side-ok" : "lab-fill-b lab-side-b");
    out += text(155, 206, "Urfigur Δ₁", "lab-text-a", "middle");
    out += text(movedPts[1].x, movedPts[1].y + 18, aligned ? "Δ₂ exakt auf Δ₁!" : "Kopie Δ₂", aligned ? "lab-text-ok" : "lab-text-b", "middle");

    out += rail("dx", "Verschiebung dx", dx, 0, 180, 245);
    out += rail("rot", "Drehwinkel (°)", rot, 0, 180, 305);
    return out + "</svg>";
  },
  handles: {
    dx: railHandle("dx", 0, 180),
    rot: railHandle("rot", 0, 180),
  },
};

const TRI_PLOT = new Plot(-1, 8, -1, 6, { x: 24, y: 38, w: 300, h: 200 });

const sssSws: LabView = {
  render(v) {
    const mode = v.mode;
    const a = v.a;
    const b = 4;
    const c = 6;
    const alpha = v.alpha;

    let out = open("Kongruenzsätze SSS und SWS");
    out += TRI_PLOT.grid(1, 2);
    const A = TRI_PLOT.P(1, 1);
    const B = TRI_PLOT.P(1 + c, 1);
    out += line(A.x, A.y, B.x, B.y, "lab-side-a");
    out += circle(A.x, A.y, 4, "lab-point-a");
    out += circle(B.x, B.y, 4, "lab-point-b");
    out += text(A.x - 6, A.y + 16, "A", "lab-text-a", "end");
    out += text(B.x + 8, B.y + 16, "B", "lab-text-b");

    if (mode === 0) {
      const valid = triangleValid(a, b, c);
      out += title(valid ? `SSS: a=${fmt(a, 1)}, b=4, c=6 ⇒ Dreieck eindeutig` : `a=${fmt(a, 1)}, b=4, c=6: a + b ≤ c (kein Dreieck!)`);
      out += `<circle cx="${A.x.toFixed(1)}" cy="${A.y.toFixed(1)}" r="${(b * TRI_PLOT.sx).toFixed(1)}" class="lab-curve-dashed" />`;
      out += `<circle cx="${B.x.toFixed(1)}" cy="${B.y.toFixed(1)}" r="${(a * TRI_PLOT.sx).toFixed(1)}" class="lab-curve-dashed" />`;
      if (valid) {
        const xOff = (b * b + c * c - a * a) / (2 * c);
        const yOff = Math.sqrt(Math.max(0, b * b - xOff * xOff));
        const C = TRI_PLOT.P(1 + xOff, 1 + yOff);
        out += polygon([A, B, C], "lab-fill-ok lab-side-ok");
        out += circle(C.x, C.y, 4.5, "lab-point-ok");
        out += text(C.x, C.y - 10, "C", "lab-text-ok", "middle");
      }
      out += infoBox(498, 60, [
        [`SSS (a, b, c)`, "lab-text-a"],
        [`a + b = ${fmt(a + b, 1)} vs. c = 6`, valid ? "lab-text-ok" : "lab-text-bad"],
        [valid ? "✓ Dreiecksungleichung erfüllt" : "✗ Bögen schneiden sich nicht", valid ? "lab-text-ok" : "lab-text-bad"],
      ], "end");
    } else {
      const rad = (alpha * Math.PI) / 180;
      const C = TRI_PLOT.P(1 + b * Math.cos(rad), 1 + b * Math.sin(rad));
      out += title(`SWS: c = 6, b = 4, eingeschlossen α = ${fmt(alpha, 0)}°`);
      out += polygon([A, B, C], "lab-fill-ok lab-side-ok");
      out += angleMark(A, B, C, 24, "lab-angle-ok");
      out += circle(C.x, C.y, 4.5, "lab-point-ok");
      out += text(C.x + 8, C.y - 8, "C", "lab-text-ok");
      out += infoBox(498, 60, [
        [`SWS (c, b, α)`, "lab-text-a"],
        [`Eingeschlossen α = ${fmt(alpha, 0)}°`, "lab-text-ok"],
        [`✓ Immer eindeutig!`, "lab-text-ok"],
      ], "end");
    }

    out += rail("a", "Seite a (SSS)", a, 1.5, 8, 255, 1);
    out += rail("alpha", "Winkel α (SWS)", alpha, 30, 135, 308);
    return out + "</svg>";
  },
  handles: {
    a: railHandle("a", 1.5, 8),
    alpha: railHandle("alpha", 30, 135),
  },
};

const wswSsw: LabView = {
  render(v) {
    const b = 5;
    const a = v.a;
    const alpha = v.alpha;
    const rad = (alpha * Math.PI) / 180;
    const A = { x: 85, y: 220 };
    const unit = 32;
    const C = { x: A.x + b * unit * Math.cos(rad), y: A.y - b * unit * Math.sin(rad) };
    const sol = sswSolutions(b, a, alpha);

    let out = open("SsW vs. sSW: Eindeutigkeit der Konstruktion prüfen");
    const status =
      sol.count === 0
        ? "0 Lösungen (Kreis zu klein!)"
        : sol.count === 2
          ? "2 Lösungen! (sSW mehrdeutig, da a < b)"
          : a >= b
            ? "✓ SsW eindeutig! (a > b)"
            : "1 Berührpunkt (rechtwinklig)";
    out += title(status);

    // Base ray & side b
    out += line(A.x, A.y, 455, A.y, "lab-axis");
    out += line(A.x, A.y, C.x, C.y, "lab-side-a");
    out += angleMark(A, { x: 400, y: A.y }, C, 24, "lab-angle");
    out += text(A.x + 30, A.y - 10, `α=${fmt(alpha, 0)}°`, "lab-text-a");
    out += text((A.x + C.x) / 2 - 14, (A.y + C.y) / 2 - 6, `b=5`, "lab-text-a", "end");

    // Compass circle around C with radius a
    out += `<circle cx="${C.x.toFixed(1)}" cy="${C.y.toFixed(1)}" r="${(a * unit).toFixed(1)}" class="lab-curve-dashed" />`;

    sol.cs.forEach((cLen, idx) => {
      const B = { x: A.x + cLen * unit, y: A.y };
      out += line(C.x, C.y, B.x, B.y, sol.count === 1 ? "lab-side-ok" : idx === 0 ? "lab-side-b" : "lab-side-c");
      out += circle(B.x, B.y, 4.5, sol.count === 1 ? "lab-point-ok" : "lab-point-b");
      out += text(B.x, B.y + 18, `B${sol.count > 1 ? idx + 1 : ""}`, sol.count === 1 ? "lab-text-ok" : "lab-text-b", "middle");
    });

    out += circle(A.x, A.y, 4, "lab-point-a");
    out += circle(C.x, C.y, 4.5, "lab-point-a");
    out += text(C.x + 8, C.y - 8, `C`, "lab-text-a");

    out += infoBox(495, 58, [
      [`b = 5 · a = ${fmt(a, 1)}`, a > b ? "lab-text-ok" : "lab-text-b"],
      [`Lösungen: ${fmt(sol.count, 0)}`, sol.count === 1 ? "lab-text-ok" : "lab-text-bad"],
    ], "end");

    out += rail("a", "Gegenseite a", a, 2, 7, 258, 1);
    out += rail("alpha", "Winkel α (°)", alpha, 30, 60, 308);
    return out + "</svg>";
  },
  handles: {
    a: railHandle("a", 2, 7),
    alpha: railHandle("alpha", 30, 60),
  },
};

const isoscelesLab: LabView = {
  render(v) {
    const c = v.c;
    const a = v.a;
    const valid = 2 * a > c;
    const equi = Math.abs(a - c) < 1e-6;
    const baseRad = valid ? Math.acos(Math.min(0.999, c / (2 * a))) : 0;
    const baseDeg = (baseRad * 180) / Math.PI;
    const apexDeg = 180 - 2 * baseDeg;

    const unit = 32;
    const mx = 240;
    const baseY = 205;
    const A = { x: mx - (c * unit) / 2, y: baseY };
    const B = { x: mx + (c * unit) / 2, y: baseY };
    const hPx = valid ? Math.sqrt(Math.max(0, a * a - (c / 2) ** 2)) * unit : 0;
    const C = { x: mx, y: baseY - hPx };

    let out = open("Gleichschenkliges und gleichseitiges Dreieck");
    out += title(
      !valid
        ? `2 · ${fmt(a, 1)} ≤ ${fmt(c, 1)}: Schenkel zu kurz!`
        : equi
          ? `Gleichseitig (a = b = c = ${fmt(a, 1)}): alle Winkel 60°!`
          : `Gleichschenklig: Basiswinkel α = β = ${fmt(baseDeg, 1)}° · γ = ${fmt(apexDeg, 1)}°`,
    );

    if (valid) {
      out += polygon([A, B, C], equi ? "lab-fill-ok lab-side-ok" : "lab-fill-a lab-side-a");
      out += line(mx, baseY + 14, mx, C.y - 16, "lab-dashed");
      out += angleMark(A, B, C, 24, "lab-angle");
      out += angleMark(B, C, A, 24, "lab-angle");
      out += text(A.x - 8, baseY + 16, "A", "lab-text-a", "end");
      out += text(B.x + 8, baseY + 16, "B", "lab-text-a");
      out += text(C.x, C.y - 10, `C (γ=${fmt(apexDeg, 1)}°)`, "lab-text-b", "middle");
    }

    out += infoBox(495, 62, [
      [`Basis c = ${fmt(c, 1)}`, "lab-text-small"],
      [`Schenkel a = b = ${fmt(a, 1)}`, "lab-text-a"],
      ...(valid ? [[`α = β = ${fmt(baseDeg, 1)}°`, equi ? "lab-text-ok" : "lab-text-b"] as [string, string]] : []),
    ], "end");

    out += rail("c", "Basis c", c, 3, 8, 255);
    out += rail("a", "Schenkellänge a", a, 2.5, 7, 308, 1);
    return out + "</svg>";
  },
  handles: {
    c: railHandle("c", 3, 8),
    a: railHandle("a", 2.5, 7),
  },
};

const CONVERSE_STATEMENTS = [
  {
    name: "Quadrat → Rechteck",
    premise: "Viereck ist ein Quadrat",
    concl: "Viereck hat 4 rechte Winkel (Rechteck)",
    converseTrue: false,
  },
  {
    name: "Gleichseitig → Gleichschenklig",
    premise: "Alle 3 Seiten gleich lang",
    concl: "Mindestens 2 Seiten gleich lang",
    converseTrue: false,
  },
  {
    name: "Thales: auf Kreis → 90°",
    premise: "C liegt auf Thaleskreis über [AB]",
    concl: "∠ACB = 90°",
    converseTrue: true,
  },
] as const;

const converseChecker: LabView = {
  render(v) {
    const stmt = CONVERSE_STATEMENTS[v.stmt] ?? CONVERSE_STATEMENTS[0];
    const w = v.w;
    const h = 4;
    const isSquare = w === h;

    let out = open("Voraussetzung, Behauptung und Kehrsatz prüfen");
    out += title(`Satz: „Wenn ${stmt.premise}, dann ${stmt.concl}“`);

    // Visual counterexample for rectangle/triangle depending on w
    if (v.stmt === 0) {
      out += rect(170, 82, w * 30, h * 26, isSquare ? "lab-fill-ok lab-side-ok" : "lab-fill-b lab-side-b");
      out += text(170 + w * 15, 82 + h * 13 + 5, `${fmt(w, 0)} × ${fmt(h, 0)}`, isSquare ? "lab-text-ok" : "lab-text-b", "middle");
    } else if (v.stmt === 1) {
      const A = { x: 185, y: 185 };
      const B = { x: 185 + w * 26, y: 185 };
      const C = { x: (A.x + B.x) / 2, y: 185 - h * 22 };
      out += polygon([A, B, C], isSquare ? "lab-fill-ok lab-side-ok" : "lab-fill-b lab-side-b");
      out += text((A.x + B.x) / 2, 202, `Basis ${fmt(w, 0)} · Schenkel ${fmt(h, 0)}`, isSquare ? "lab-text-ok" : "lab-text-b", "middle");
    } else {
      const A = { x: 165, y: 175 };
      const B = { x: 345, y: 175 };
      const ang = (w * 24 * Math.PI) / 180;
      const C = { x: 255 + 90 * Math.cos(ang), y: 175 - 90 * Math.sin(ang) };
      out += `<path d="M${A.x} ${A.y} A90 90 0 0 1 ${B.x} ${B.y}" class="lab-curve-dashed" />`;
      out += polygon([A, B, C], "lab-fill-ok lab-side-ok");
      out += text(255, 200, "Hier gilt auch die Umkehrung immer!", "lab-text-ok", "middle");
    }

    const msg = stmt.converseTrue
      ? "✓ Kehrsatz ist WAHR (Äquivalenz)"
      : isSquare
        ? "Spezialfall w = 4: Noch kein Gegenbeispiel! Ändere w."
        : `✗ Gegenbeispiel (w = ${fmt(w, 0)} ≠ 4): Behauptung wahr, Voraussetzung falsch!`;
    out += text(260, 240, msg, stmt.converseTrue ? "lab-text-ok" : isSquare ? "lab-text-small" : "lab-text-bad", "middle");
    out += rail("w", "Seitenmaß w (Spezialfall bei 4)", w, 2, 6, 298);
    return out + "</svg>";
  },
  handles: { w: railHandle("w", 2, 6) },
};

const DGS_PLOT = new Plot(0, 10, 0, 7, { x: 24, y: 38, w: 300, h: 256 });

const circumInCircle: LabView = {
  render(v) {
    const mode = v.mode;
    const A = { x: 2.5, y: 2 };
    const B = { x: 7.5, y: 2 };
    const C = { x: v.cx, y: v.cy };
    const Ap = DGS_PLOT.P(A.x, A.y);
    const Bp = DGS_PLOT.P(B.x, B.y);
    const Cp = DGS_PLOT.P(C.x, C.y);
    const gamma = angleDeg(C, A, B);

    let out = open("Dynamische Geometrie: Umkreis und Inkreis");
    out += DGS_PLOT.grid(1, 2);
    out += polygon([Ap, Bp, Cp], "lab-fill-a lab-side-a");

    if (mode === 0) {
      const U = circumcenter(A, B, C) ?? { x: 5, y: 4 };
      const R = dist2D(U, A);
      const Up = DGS_PLOT.P(U.x, U.y);
      const outside = gamma > 90.5;
      out += title(`Umkreis (Mittelsenkrechten): γ = ${fmt(gamma, 1)}°`);
      out += `<circle cx="${Up.x.toFixed(1)}" cy="${Up.y.toFixed(1)}" r="${(R * DGS_PLOT.sx).toFixed(1)}" class="lab-curve-dashed" />`;
      const mAB = DGS_PLOT.P((A.x + B.x) / 2, (A.y + B.y) / 2);
      const mAC = DGS_PLOT.P((A.x + C.x) / 2, (A.y + C.y) / 2);
      out += line(mAB.x, mAB.y, Up.x, Up.y, "lab-grid");
      out += line(mAC.x, mAC.y, Up.x, Up.y, "lab-grid");
      out += circle(Up.x, Up.y, 5, outside ? "lab-point-bad" : "lab-point-ok");
      out += text(Up.x + 8, Up.y - 6, "U", outside ? "lab-text-bad" : "lab-text-ok");
      out += infoBox(498, 62, [
        [`∠C = γ = ${fmt(gamma, 1)}°`, "lab-text-a"],
        [`U(${fmt(U.x, 1)}|${fmt(U.y, 1)})`, "lab-text-small"],
        [outside ? "U liegt außerhalb!" : Math.abs(gamma - 90) < 2.5 ? "U auf [AB] (γ ≈ 90°)" : "U im Inneren", outside ? "lab-text-bad" : "lab-text-ok"],
      ], "end");
    } else {
      const I = incenter(A, B, C);
      const r = inradius(A, B, C);
      const Ip = DGS_PLOT.P(I.x, I.y);
      out += title(`Inkreis (Winkelhalbierende): Radius ρ = ${fmt(r, 2)}`);
      out += `<circle cx="${Ip.x.toFixed(1)}" cy="${Ip.y.toFixed(1)}" r="${(r * DGS_PLOT.sx).toFixed(1)}" class="lab-curve-ok" />`;
      out += line(Ap.x, Ap.y, Ip.x, Ip.y, "lab-dashed");
      out += line(Bp.x, Bp.y, Ip.x, Ip.y, "lab-dashed");
      out += line(Cp.x, Cp.y, Ip.x, Ip.y, "lab-dashed");
      out += circle(Ip.x, Ip.y, 5, "lab-point-ok");
      out += text(Ip.x + 8, Ip.y - 6, "I", "lab-text-ok");
      out += infoBox(498, 62, [
        [`Winkel γ = ${fmt(gamma, 1)}°`, "lab-text-a"],
        [`Inkreisradius ρ = ${fmt(r, 2)}`, "lab-text-ok"],
        [`I liegt immer im Dreieck`, "lab-text-ok"],
      ], "end");
    }

    out += circle(Ap.x, Ap.y, 4, "lab-point-a");
    out += circle(Bp.x, Bp.y, 4, "lab-point-a");
    out += text(Ap.x - 6, Ap.y + 16, "A", "lab-text-a", "end");
    out += text(Bp.x + 8, Bp.y + 16, "B", "lab-text-a");
    out += handle("c", Cp.x, Cp.y, "Ecke C");
    out += text(Cp.x + 10, Cp.y - 10, "C", "lab-text-b");
    return out + "</svg>";
  },
  handles: {
    c: {
      x: "cx",
      y: "cy",
      drag: (pt) => ({ cx: DGS_PLOT.invX(pt.x), cy: DGS_PLOT.invY(pt.y) }),
    },
  },
};

const thalesLab: LabView = {
  render(v) {
    const R = 105;
    const r = v.r;
    const phi = v.phi;
    const M = { x: 240, y: 185 };
    const A = { x: M.x - R, y: M.y };
    const B = { x: M.x + R, y: M.y };
    const C = polar(M.x, M.y, r, phi);
    const onCircle = Math.abs(r - R) < 2;
    const gamma = angleDeg(C, A, B);
    const alpha1 = angleDeg(A, B, C);
    const beta1 = angleDeg(B, A, C);

    let out = open("Beweis zum Satz des Thales");
    out += title(onCircle ? `C auf dem Thaleskreis (|MC| = r): ∠ACB = ${fmt(gamma, 1)}° = 90°!` : `|MC| = ${fmt(r / 35, 1)} vs. Radius 3,0 · ∠ACB = ${fmt(gamma, 1)}°`);

    // Thales semicircle over AB
    out += `<path d="M${A.x} ${A.y} A${R} ${R} 0 0 1 ${B.x} ${B.y}" class="lab-curve-dashed" />`;
    out += polygon([A, B, C], onCircle ? "lab-fill-ok lab-side-ok" : "lab-fill-a lab-side-a");
    out += line(M.x, M.y, C.x, C.y, onCircle ? "lab-side-b" : "lab-dashed");
    out += angleMark(C, A, B, 18, onCircle ? "lab-angle-ok" : "lab-angle", onCircle);

    out += circle(M.x, M.y, 4, "lab-point-b");
    out += text(M.x, M.y + 18, "M", "lab-text-b", "middle");
    out += text(A.x - 8, A.y + 16, `A (${fmt(alpha1, 0)}°)`, "lab-text-a", "end");
    out += text(B.x + 8, B.y + 16, `B (${fmt(beta1, 0)}°)`, "lab-text-a");
    out += circle(C.x, C.y, 5, onCircle ? "lab-point-ok" : "lab-point-b");
    out += text(C.x, C.y - 12, `C (γ=${fmt(gamma, 1)}°)`, onCircle ? "lab-text-ok" : "lab-text-b", "middle");

    out += infoBox(495, 58, [
      [`2·α₁ + 2·β₁ = 180°`, onCircle ? "lab-text-ok" : "lab-text-muted"],
      [`γ = ${fmt(gamma, 1)}°`, onCircle ? "lab-text-ok" : "lab-text-bad"],
    ], "end");

    out += rail("r", "Abstand |MC| (Kreis bei 105)", r, 70, 140, 248);
    out += rail("phi", "Winkelposition φ auf dem Bogen (°)", phi, 25, 155, 305);
    return out + "</svg>";
  },
  handles: {
    r: railHandle("r", 70, 140),
    phi: railHandle("phi", 25, 155),
  },
};

const tangentThales: LabView = {
  render(v) {
    const phi = v.phi;
    const showThales = v.showThales === 1;
    const R = 64;
    const M = { x: 155, y: 145 };
    const P = { x: 155 + 2 * R, y: 145 }; // |MP| = 2*R => tangent touches cleanly at phi = 60°!
    const B = polar(M.x, M.y, R, phi);
    const mbp = angleDeg(B, M, P);
    const isTangent = Math.abs(mbp - 90) < 1.5;

    let out = open("Kreistangente durch äußeren Punkt P mithilfe des Thaleskreises");
    out += title(isTangent ? `φ = 60°: ∠MBP = 90° ⇒ PB ist Tangente!` : `∠MBP = ${fmt(mbp, 1)}° (Tangente bei genau 90°)`);

    out += `<circle cx="${M.x}" cy="${M.y}" r="${R}" class="lab-fill-a lab-side-a" />`;
    if (showThales) {
      const H = midpoint(M, P);
      out += `<circle cx="${H.x}" cy="${H.y}" r="${R}" class="lab-curve-dashed" />`;
      out += circle(H.x, H.y, 4, "lab-point-b");
      out += text(H.x, H.y + 16, "H", "lab-text-b", "middle");
    }

    out += line(M.x, M.y, P.x, P.y, "lab-axis");
    out += line(M.x, M.y, B.x, B.y, "lab-side-b");
    out += line(P.x, P.y, B.x + (B.x - P.x) * 0.45, B.y + (B.y - P.y) * 0.45, isTangent ? "lab-side-ok" : "lab-side-b");
    out += angleMark(B, M, P, 14, isTangent ? "lab-angle-ok" : "lab-angle", isTangent);

    out += circle(M.x, M.y, 4, "lab-point-a");
    out += text(M.x - 8, M.y + 16, "M", "lab-text-a", "end");
    out += circle(P.x, P.y, 4.5, "lab-point-a");
    out += text(P.x + 8, P.y + 16, "P", "lab-text-a");
    out += circle(B.x, B.y, 4.5, isTangent ? "lab-point-ok" : "lab-point-b");
    out += text(B.x - 10, B.y - 10, "B", isTangent ? "lab-text-ok" : "lab-text-b", "end");

    out += infoBox(495, 62, [
      [`|MP| = 2·r`, "lab-text-small"],
      [`∠MBP = ${fmt(mbp, 1)}°`, isTangent ? "lab-text-ok" : "lab-text-bad"],
    ], "end");

    out += rail("phi", "Winkel φ für Berührpunkt B (°)", phi, 20, 85, 298);
    return out + "</svg>";
  },
  handles: { phi: railHandle("phi", 20, 85) },
};

const heightConstruction: LabView = {
  render(v) {
    const c = 6;
    const hc = v.hc;
    const alpha = v.alpha;
    const unit = 38;
    const A = { x: 95, y: 205 };
    const B = { x: A.x + c * unit, y: 205 };
    const rad = (alpha * Math.PI) / 180;
    const bLen = hc / Math.sin(rad);
    const dx = hc / Math.tan(rad);
    const C = { x: A.x + dx * unit, y: A.y - hc * unit };
    const D = { x: C.x, y: A.y };

    let out = open("Dreieckskonstruktion mit Höhe h_c über Parallelstreifen");
    out += title(`c = 6 cm · h_c = ${fmt(hc, 1)} cm · α = ${fmt(alpha, 0)}° ⇒ b = ${fmt(bLen, 2)} cm`);

    // Parallel strip at height hc
    out += line(45, C.y, 465, C.y, "lab-curve-dashed");
    out += text(50, C.y - 8, `Parallele im Abstand h_c = ${fmt(hc, 1)}`, "lab-text-b");

    out += polygon([A, B, C], "lab-fill-a lab-side-a");
    // Right-angled subtriangle ADC highlighted
    out += line(C.x, C.y, D.x, D.y, "lab-side-ok");
    out += angleMark(D, C, A, 12, "lab-angle-ok", true);
    out += angleMark(A, B, C, 24, "lab-angle");

    out += text(A.x - 8, A.y + 16, "A", "lab-text-a", "end");
    out += text(B.x + 8, B.y + 16, "B", "lab-text-a");
    out += text(C.x, C.y - 10, "C", "lab-text-ok", "middle");
    out += text(D.x + 6, (C.y + D.y) / 2, `h_c=${fmt(hc, 1)}`, "lab-text-ok");

    out += rail("hc", "Höhe h_c (cm)", hc, 2, 4.5, 255, 1);
    out += rail("alpha", "Winkel α (°)", alpha, 35, 105, 305);
    return out + "</svg>";
  },
  handles: {
    hc: railHandle("hc", 2, 4.5),
    alpha: railHandle("alpha", 35, 105),
  },
};

const surveyModeling: LabView = {
  render(v) {
    const baseline = 60; // meters real life
    const alpha = v.alpha;
    const beta = v.beta;
    const radA = (alpha * Math.PI) / 180;
    const radB = (beta * Math.PI) / 180;
    const widthM =
      (baseline * Math.sin(radA) * Math.sin(radB)) / Math.sin(radA + radB);
    const scalePx = 3.2; // 1 m = 3.2 px
    const A = { x: 110, y: 210 };
    const B = { x: A.x + baseline * scalePx, y: 210 };
    const xC = widthM / Math.tan(radA);
    const C = { x: A.x + xC * scalePx, y: A.y - widthM * scalePx };

    let out = open("Anwendungsaufgabe: Flussbreite durch Peilen (WSW)");
    out += title(`Standlinie c = 60 m · α = ${fmt(alpha, 0)}°, β = ${fmt(beta, 0)}° ⇒ Breite ≈ ${fmt(widthM, 1)} m`);

    // River band
    out += rect(45, C.y - 8, 430, A.y - C.y, "lab-fill-c");
    out += polygon([A, B, C], "lab-fill-a lab-side-a");
    out += line(C.x, C.y, C.x, A.y, "lab-side-ok");
    out += angleMark(A, B, C, 22, "lab-angle");
    out += angleMark(B, C, A, 22, "lab-angle");

    out += text(A.x - 6, A.y + 16, `A (${fmt(alpha, 0)}°)`, "lab-text-a", "end");
    out += text(B.x + 8, B.y + 16, `B (${fmt(beta, 0)}°)`, "lab-text-a");
    out += text(C.x, C.y - 10, "Zielbaum C", "lab-text-ok", "middle");

    out += infoBox(495, 52, [
      [`Maßstab 1 : 1000`, "lab-text-small"],
      [`Zeichnung c: 6,0 cm`, "lab-text-small"],
      [`Flussbreite: ${fmt(widthM, 1)} m`, "lab-text-ok"],
    ], "end");

    out += rail("alpha", "Peilwinkel α bei A (°)", alpha, 35, 75, 258);
    out += rail("beta", "Peilwinkel β bei B (°)", beta, 40, 75, 308);
    return out + "</svg>";
  },
  handles: {
    alpha: railHandle("alpha", 35, 75),
    beta: railHandle("beta", 40, 75),
  },
};

export const VIEWS_KONGRUENZ: Record<string, LabView> = {
  "congruence-motion": congruenceMotion,
  "sss-sws": sssSws,
  "wsw-ssw": wswSsw,
  "isosceles-lab": isoscelesLab,
  "converse-checker": converseChecker,
  "circum-in-circle": circumInCircle,
  "thales-lab": thalesLab,
  "tangent-thales": tangentThales,
  "height-construction": heightConstruction,
  "survey-modeling": surveyModeling,
};
