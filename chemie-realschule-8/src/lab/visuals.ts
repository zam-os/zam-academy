import {
  ALKANE_NAMES,
  alkaneCombustion,
  alkaneFormula,
  averageMolarMass,
  ELEMENT_SYSTEM,
  EQUATION_REACTIONS,
  fmtSigned,
  fmtTemp,
  heatingCurveTemp,
  ISOTOPE_PAIRS,
  ionText,
  kugelwolkenConfig,
  lindeFractionation,
  PARTICLE_SPECIES,
  PHASE_SUBSTANCES,
  PSE_ELEMENTS,
  STOICH_REACTIONS,
  SUBSTANCES,
  saltFormula,
  stateOfMatter,
  VM_NORM,
} from "../chemistry/model";
import { fmt } from "../exercises/format";
import type { LabKind, LabValues, ReadoutValues } from "../model/types";
import { BINDIGKEIT_PAIRS, EXPERIMENTS, LAB_ANIONS, LAB_CATIONS } from "./definitions";
import {
  arrow,
  circle,
  clamp,
  clipped,
  handle,
  line,
  open,
  Plot,
  path,
  rect,
  text,
  type LabView,
} from "./svg";

const atom = (x: number, y: number, label: string, color = "lab-fill-a", radius = 20) =>
  circle(x, y, radius, color) + text(x, y + 5, label, "lab-text", "middle");

function drawExperiment(kind: LabKind, v: LabValues): string {
  const experiment = EXPERIMENTS[kind];
  if (!experiment) return "";
  const current = experiment.cases[v.case];
  const correct = v.prediction - 1 === current.answer;
  const title = current.name.length > 52 ? `${current.name.slice(0, 50)}…` : current.name;
  return (
    rect(34, 52, 452, 200, "lab-panel", 'rx="18"') +
    text(260, 88, title, "lab-text", "middle") +
    atom(148, 158, "?", "lab-fill-b", 34) +
    arrow(198, 158, 294, 158, "lab-side-a") +
    atom(
      352,
      158,
      v.observed ? (correct ? "✓" : "↻") : "…",
      v.observed && correct ? "lab-fill-ok" : "lab-fill-a",
      34,
    ) +
    text(
      260,
      224,
      v.observed
        ? correct
          ? "Vermutung bestätigt – lies die Auswertung darunter."
          : "Abweichung erkannt – prüfe die Beobachtung und versuche es neu."
        : "1. Vermutung wählen · 2. Modellversuch starten",
      "lab-text-small",
      "middle",
    )
  );
}

const ENERGY_PLOT = new Plot(0, 10, 0, 170, { x: 58, y: 20, w: 430, h: 286 });
const BOIL_PLOT = new Plot(0, 12, 15, 118, { x: 58, y: 20, w: 430, h: 286 });

function draw(kind: LabKind, v: LabValues, _r: ReadoutValues): string {
  if (EXPERIMENTS[kind]) return drawExperiment(kind, v);

  switch (kind) {
    case "modellgrenzen": {
      const names = ["Teilchenmodell", "Dalton-Modell", "Ionengitter", "Energiestufen"];
      const ok = v.phenomenon === v.model;
      let out = rect(36, 36, 448, 268, "lab-panel", 'rx="16"');
      names.forEach((n, idx) => {
        const x = 86 + idx * 116;
        const cls = idx === v.model ? (ok ? "lab-fill-ok" : "lab-fill-b") : "lab-shape";
        out += rect(x - 48, 92, 96, 68, cls, 'rx="12"');
        out += text(x, 124, `Stufe ${idx + 1}`, "lab-text-small", "middle");
        out += text(x, 144, n, "lab-text-small", "middle");
        if (idx < 3) out += arrow(x + 50, 126, x + 66, 126, "lab-axis", 1.8);
      });
      out += text(
        260,
        215,
        ok
          ? "Modell passt zum gewählten Phänomen!"
          : v.model < v.phenomenon
            ? "Modellgrenze: Dieses Modell reicht noch nicht aus."
            : "Ein einfacheres Modell genügt bereits.",
        "lab-text",
        "middle",
      );
      out += text(
        260,
        252,
        `Phänomen ${v.phenomenon + 1} ↔ ${names[v.model]}`,
        "lab-text-small",
        "middle",
      );
      return out;
    }

    case "kenngroessen": {
      const s = SUBSTANCES[v.sample];
      const mass = s.density * v.vol;
      const waterTop = 250 - v.vol * 3.0;
      return (
        // Messzylinder links
        rect(90, 65, 96, 215, "lab-panel", 'rx="8"') +
        rect(94, waterTop, 88, 280 - waterTop, "lab-fill-a", 'rx="4"') +
        line(90, 280, 186, 280, "lab-axis") +
        text(138, 48, `V = ${v.vol} cm³`, "lab-text", "middle") +
        handle("vol", 138, waterTop, "Probenvolumen V einstellen") +
        // Laborwaage rechts
        rect(280, 225, 170, 36, "lab-shape-2", 'rx="8"') +
        rect(300, 212, 130, 13, "lab-axis", 'rx="4"') +
        rect(322, 150, 86, 62, "lab-fill-b", 'rx="8"') +
        text(365, 185, s.formula, "lab-text-big", "middle") +
        text(365, 248, `m = ${fmt(mass, 1)} g`, "lab-text", "middle") +
        text(260, 316, `ρ = m / V = ${fmt(s.density, 2)} g/cm³ (${s.name})`, "lab-text", "middle")
      );
    }

    case "siedekurve": {
      const f = (t: number) => heatingCurveTemp(v.salt, t);
      const pure = (t: number) => heatingCurveTemp(0, t);
      const curT = f(v.time);
      const pt = BOIL_PLOT.P(v.time, curT);
      return (
        `<defs>${BOIL_PLOT.clip("boil-clip")}</defs>` +
        BOIL_PLOT.grid(2, 2, "t / min", "ϑ / °C", 20, 20) +
        clipped(
          "boil-clip",
          (v.salt > 0 ? BOIL_PLOT.graph(pure, "lab-axis") : "") + BOIL_PLOT.graph(f, "lab-curve"),
        ) +
        circle(pt.x, pt.y, 5, "lab-fill-b") +
        handle("time", pt.x, pt.y, "Erhitzungsdauer t ziehen") +
        text(
          275,
          44,
          v.salt === 0
            ? `Reines Wasser: ${fmt(curT, 1)} °C (Siedeplateau 100 °C)`
            : `Salzlösung (${v.salt} %): ${fmt(curT, 1)} °C (Siedebereich)`,
          "lab-text-small",
          "middle",
        )
      );
    }

    case "teilchenmodell": {
      const sub = PHASE_SUBSTANCES[v.substance];
      const st = stateOfMatter(sub, v.temp);
      const mercY = 270 - ((v.temp + 100) / 240) * 190;
      let particles = "";
      if (st === "fest") {
        for (let r = 0; r < 4; r++)
          for (let c = 0; c < 5; c++)
            particles += circle(145 + c * 32, 165 + r * 32, 12, "lab-fill-a");
      } else if (st === "flüssig") {
        const pts = [
          [130, 220], [162, 226], [195, 218], [228, 225], [260, 220], [290, 226],
          [145, 250], [178, 248], [212, 252], [246, 247], [278, 251],
          [160, 276], [196, 275], [230, 277], [265, 275],
        ];
        for (const [x, y] of pts) particles += circle(x, y, 12, "lab-fill-a");
      } else {
        const pts = [
          [118, 95], [205, 82], [292, 104], [154, 152], [256, 146],
          [125, 228], [222, 215], [302, 238], [176, 272], [275, 276],
        ];
        for (const [x, y] of pts) {
          particles += circle(x, y, 11, "lab-fill-b") + arrow(x + 12, y - 6, x + 26, y - 14, "lab-axis", 1.5);
        }
      }
      return (
        rect(96, 56, 236, 244, "lab-panel", 'rx="14"') +
        particles +
        text(214, 322, `${sub.name}: ${st}`, "lab-text", "middle") +
        // Thermometer rechts
        rect(406, 68, 20, 210, "lab-panel", 'rx="10"') +
        rect(410, mercY, 12, 282 - mercY, "lab-fill-b", 'rx="6"') +
        circle(416, 284, 16, "lab-fill-b") +
        handle("temp", 416, mercY, "Temperatur ϑ ziehen") +
        text(416, 48, fmtTemp(v.temp), "lab-text", "middle")
      );
    }

    case "trennwerkstatt": {
      const ok = v.mixture === v.method;
      const titles = ["Filtration", "Magnetscheiden", "Destillation", "Extraktion"];
      return (
        rect(38, 44, 444, 246, "lab-panel", 'rx="16"') +
        rect(68, 96, 144, 110, "lab-fill-b", 'rx="12"') +
        text(140, 142, "Stoffgemisch", "lab-text-small", "middle") +
        text(140, 166, `Probe ${v.mixture + 1}`, "lab-text-big", "middle") +
        arrow(224, 150, 294, 150, ok ? "lab-side-a" : "lab-axis") +
        text(259, 134, titles[v.method], "lab-text-small", "middle") +
        rect(306, 82, 146, 62, ok ? "lab-fill-ok" : "lab-shape", 'rx="10"') +
        rect(306, 160, 146, 62, ok ? "lab-fill-a" : "lab-shape", 'rx="10"') +
        text(379, 118, ok ? "Fraktion 1 rein" : "noch vermischt", "lab-text-small", "middle") +
        text(379, 196, ok ? "Fraktion 2 rein" : "keine Trennung", "lab-text-small", "middle") +
        text(
          260,
          266,
          ok ? "Trennprinzip passt exakt zur Stoffeigenschaft!" : "Wähle das Trennverfahren mit passender Kenngröße.",
          "lab-text-small",
          "middle",
        )
      );
    }

    case "linde": {
      const f = lindeFractionation(v.temp);
      const yPos = 68 + ((v.temp + 175) / -30) * 200; // -175 oben? Nein: -205 unten, -175 oben:
      const handleY = clamp(268 - ((v.temp + 205) / 30) * 200, 68, 268);
      void yPos;
      return (
        // Kolonne
        rect(170, 48, 160, 244, "lab-panel", 'rx="22"') +
        line(170, 128, 330, 128, "lab-grid") +
        line(170, 208, 330, 208, "lab-grid") +
        text(250, 92, `Kopf: N₂ (${f.n2})`, "lab-text-small", "middle") +
        (v.preclean === 0
          ? rect(182, 138, 136, 60, "lab-fill-b", 'rx="10"') +
            text(250, 172, "Eis + CO₂-Schnee!", "lab-text", "middle")
          : text(250, 172, `Mitte: Ar (${f.ar})`, "lab-text-small", "middle")) +
        text(250, 252, `Sumpf: O₂ (${f.o2})`, "lab-text-small", "middle") +
        // Temperaturregler rechts
        line(416, 68, 416, 268, "lab-axis") +
        handle("temp", 416, handleY, "Kolonnentemperatur ϑ ziehen") +
        text(416, 46, fmtTemp(v.temp), "lab-text", "middle") +
        text(
          250,
          318,
          v.preclean === 0 ? "Vorreinigung fehlt: Rohre vereisen!" : `Luftzerlegung bei ${fmtTemp(v.temp)}`,
          "lab-text-small",
          "middle",
        )
      );
    }

    case "elementklassen": {
      const el = ELEMENT_SYSTEM[v.element];
      const st = v.temp < el.mp ? "fest" : v.temp < el.bp ? "flüssig" : "gasförmig";
      const color = el.kind === "Metall" ? "lab-fill-b" : "lab-fill-a";
      let atoms = "";
      for (let i = 0; i < 6; i++) {
        const x = 112 + (i % 3) * 56;
        const y = st === "gasförmig" ? 115 + Math.floor(i / 3) * 88 : 155 + Math.floor(i / 3) * 48;
        atoms += atom(x, y, el.symbol, color, 20);
      }
      return (
        rect(62, 64, 224, 212, "lab-panel", 'rx="16"') +
        atoms +
        rect(312, 64, 168, 212, "lab-panel", 'rx="16"') +
        text(396, 104, el.name, "lab-text-big", "middle") +
        text(396, 136, el.kind, "lab-text", "middle") +
        text(396, 172, `Zustand: ${st}`, "lab-text-small", "middle") +
        text(396, 202, `ρ = ${fmt(el.density, 2)} g/cm³`, "lab-text-small", "middle") +
        text(396, 232, el.conductive ? "Lampe leuchtet ✓" : "Lampe dunkel ✗", "lab-text-small", "middle") +
        text(260, 312, `Prüftemperatur: ${fmtTemp(v.temp)}`, "lab-text", "middle")
      );
    }

    case "teilchenverbaende": {
      const dx = v.heat * 8;
      let inner = "";
      if (v.assembly === 0) {
        for (let r = 0; r < 3; r++)
          for (let c = 0; c < 4; c++)
            inner += atom(150 + c * 68, 105 + r * 62, "Cu⁺", "lab-fill-b", 19) + circle(178 + c * 68, 128 + r * 62, 4, "lab-fill-a");
      } else if (v.assembly === 1) {
        for (let r = 0; r < 3; r++)
          for (let c = 0; c < 4; c++) {
            const cat = (r + c) % 2 === 0;
            inner += atom(150 + c * 68, 105 + r * 62, cat ? "Na⁺" : "Cl⁻", cat ? "lab-fill-b" : "lab-fill-a", 20);
          }
      } else if (v.assembly === 2) {
        const centers = [
          [155 - dx, 118 - dx], [345 + dx, 115 - dx],
          [165 - dx, 222 + dx], [340 + dx, 225 + dx],
        ];
        for (const [cx, cy] of centers) {
          inner +=
            line(cx - 22, cy + 16, cx, cy, "lab-axis") +
            line(cx + 22, cy + 16, cx, cy, "lab-axis") +
            atom(cx, cy, "O", "lab-fill-b", 16) +
            atom(cx - 24, cy + 18, "H", "lab-fill-a", 11) +
            atom(cx + 24, cy + 18, "H", "lab-fill-a", 11);
        }
      } else {
        const pts = [[135, 105], [265, 95], [385, 120], [165, 225], [295, 215], [395, 235]];
        for (const [x, y] of pts) inner += atom(x, y, "Ar", "lab-fill-c", 18);
      }
      return (
        rect(64, 52, 392, 232, "lab-panel", 'rx="16"') +
        inner +
        text(
          260,
          314,
          ["Metallgitter (ungerichtet)", "Ionengitter (ungerichtet)", "Moleküle (innen gerichtet)", "Einzelne Edelgasatome"][v.assembly],
          "lab-text",
          "middle",
        )
      );
    }

    case "bindigkeit": {
      const p = BINDIGKEIT_PAIRS[v.pair];
      const sat = v.nA * p.bA === v.nB * p.bB;
      let out = rect(44, 48, 432, 224, "lab-panel", 'rx="16"');
      for (let i = 0; i < v.nA; i++) {
        const y = v.nA === 1 ? 158 : 118 + i * 80;
        out += atom(185, y, p.symA, "lab-fill-b", 26);
      }
      for (let j = 0; j < v.nB; j++) {
        const y = 88 + (j * 140) / Math.max(1, v.nB - 1 || 1);
        const yy = v.nB === 1 ? 158 : y;
        out += line(212, 158, 314, yy, sat ? "lab-side-a" : "lab-axis");
        out += atom(340, yy, p.symB, "lab-fill-a", 21);
      }
      out += text(
        260,
        306,
        sat
          ? `Alle Bindungsarme besetzt: ${p.common}`
          : `Unpaarige Bindungsarme (${v.nA * p.bA} vs. ${v.nB * p.bB})`,
        "lab-text",
        "middle",
      );
      return out;
    }

    case "salzverhaeltnis": {
      const c = LAB_CATIONS[v.cat];
      const a = LAB_ANIONS[v.an];
      const pos = v.nc * c.charge;
      const neg = Math.abs(v.na * a.charge);
      const tilt = clamp((neg - pos) * 5, -18, 18);
      let ions = "";
      for (let i = 0; i < v.nc; i++)
        ions += atom(135 + i * 42, 128, ionText(c.symbol, c.charge), "lab-fill-b", 19);
      for (let i = 0; i < v.na; i++)
        ions += atom(315 + i * 42, 128, ionText(a.symbol, a.charge), "lab-fill-a", 19);
      return (
        rect(42, 48, 436, 232, "lab-panel", 'rx="16"') +
        ions +
        line(110, 205 - tilt, 410, 205 + tilt, "lab-axis") +
        path("M245 255 L260 205 L275 255 Z", "lab-shape-2") +
        text(165, 178, `+${pos} Ladungen`, "lab-text-small", "middle") +
        text(355, 178, `${fmtSigned(-neg)} Ladungen`, "lab-text-small", "middle") +
        text(
          260,
          310,
          pos === neg ? `Neutral: ${saltFormula(c, a)}` : "Waage noch nicht im Ladungsgleichgewicht",
          "lab-text",
          "middle",
        )
      );
    }

    case "gitterverschiebung": {
      const dx = v.shift * 56;
      const split = v.substance === 1 && v.shift === 0.5 && v.molten === 0 ? 18 : 0;
      let out = rect(48, 44, 424, 236, "lab-panel", 'rx="16"');
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
          const topRow = r === 0;
          const x = 135 + c * 56 + (topRow ? dx : 0) + (v.molten === 1 ? (r % 2) * 14 : 0);
          const y = 105 + r * 58 - (topRow ? split : 0);
          if (v.substance === 0) {
            out += atom(x, y, "Cu⁺", "lab-fill-b", 20);
          } else if (v.substance === 1) {
            const isCat = (r + c) % 2 === 0;
            out += atom(x, y, isCat ? "+" : "−", isCat ? "lab-fill-b" : "lab-fill-a", 20);
          } else {
            out += atom(x, y, "I₂", "lab-fill-c", 20);
          }
        }
      }
      if (v.molten === 0) {
        out += handle("shift", 135 + dx, 105 - split, "Obere Gitterschicht verschieben");
      }
      out += text(
        260,
        312,
        split > 0
          ? "Gleichnamige Ionen gegenüber → Abstoßung spaltet den Kristall!"
          : v.molten === 1
            ? "Schmelze: Teilchen frei beweglich"
            : `Verschiebung: ${fmt(v.shift, 1)} Gittereinheiten`,
        "lab-text",
        "middle",
      );
      return out;
    }

    case "umgruppierung": {
      const after = v.stage === 1;
      const chem = v.process === 1 || v.process === 3;
      return (
        rect(42, 52, 436, 224, "lab-panel", 'rx="16"') +
        atom(140, 156, after ? (chem ? "AB" : "A") : "A", "lab-fill-b", 32) +
        (chem && !after ? atom(218, 156, "B", "lab-fill-a", 28) : "") +
        arrow(258, 156, 326, 156, chem ? "lab-side-a" : "lab-axis") +
        atom(378, 156, after ? (chem ? "Neu!" : "Gleich") : "?", after && chem ? "lab-fill-ok" : "lab-fill-a", 34) +
        text(
          260,
          246,
          chem
            ? "Chemische Reaktion: Bindungen brechen, Atome gruppieren sich neu"
            : "Physikalischer Vorgang: Teilchensorte bleibt unverändert",
          "lab-text-small",
          "middle",
        )
      );
    }

    case "stoffsystematik": {
      const magnetNear = v.test === 1;
      let body = "";
      if (v.sample === 0) {
        for (let i = 0; i < 6; i++) body += atom(135 + (i % 3) * 52, 130 + Math.floor(i / 3) * 52, "Fe", "lab-fill-b", 19);
      } else if (v.sample === 1) {
        for (let i = 0; i < 6; i++) body += atom(135 + (i % 3) * 52, 130 + Math.floor(i / 3) * 52, "S", "lab-fill-a", 19);
      } else if (v.sample === 2) {
        for (let i = 0; i < 3; i++) {
          body += atom(magnetNear ? 335 : 135 + i * 52, 125 + (magnetNear ? i * 38 : 0), "Fe", "lab-fill-b", 18);
          body += atom(135 + i * 52, 190, "S", "lab-fill-a", 18);
        }
      } else {
        for (let r = 0; r < 2; r++)
          for (let c = 0; c < 4; c++) {
            const fe = (r + c) % 2 === 0;
            body += atom(125 + c * 46, 135 + r * 48, fe ? "Fe²⁺" : "S²⁻", fe ? "lab-fill-b" : "lab-fill-a", 18);
          }
      }
      return (
        rect(48, 56, 424, 224, "lab-panel", 'rx="16"') +
        body +
        (magnetNear
          ? rect(372, 92, 68, 130, "lab-fill-c", 'rx="8"') + text(406, 162, "Magnet", "lab-text-small", "middle")
          : "") +
        text(
          260,
          310,
          v.sample === 2 && magnetNear
            ? "Gemenge: Magnet zieht Eisenkörner heraus!"
            : v.sample === 3 && magnetNear
              ? "Verbindung FeS: nicht magnetisch, neue Eigenschaften"
              : ["Element Eisen", "Element Schwefel", "Gemenge Fe + S", "Verbindung Eisen(II)-sulfid"][v.sample],
          "lab-text",
          "middle",
        )
      );
    }

    case "hofmann": {
      const h2Height = v.reaction === 0 ? v.amount * 4.2 : v.amount * 2.5;
      const o2Height = v.reaction === 0 ? v.amount * 2.1 : v.amount * 3.2;
      const handleY = 260 - v.amount * 5;
      return (
        // Zwei Schenkel des Hofmann-Apparats
        rect(120, 52, 68, 216, "lab-panel", 'rx="10"') +
        rect(272, 52, 68, 216, "lab-panel", 'rx="10"') +
        rect(124, 56 + h2Height, 60, Math.max(8, 208 - h2Height), "lab-fill-a", 'rx="6"') +
        rect(276, 56 + o2Height, 60, Math.max(8, 208 - o2Height), "lab-fill-a", 'rx="6"') +
        rect(120, 250, 220, 24, "lab-fill-a", 'rx="8"') +
        text(154, 40, v.reaction === 1 ? "I₂-Dampf" : `H₂: ${2 * v.amount} ml`, "lab-text-small", "middle") +
        text(306, 40, v.reaction === 1 ? `O₂: ${fmt(v.amount * 1.5, 1)} ml` : `O₂: ${v.amount} ml`, "lab-text-small", "middle") +
        line(426, 110, 426, 260, "lab-axis") +
        handle("amount", 426, handleY, "Umsatz einstellen") +
        text(426, 90, "Umsatz", "lab-text-small", "middle") +
        text(
          230,
          312,
          v.reaction === 0
            ? "Hofmann-Apparat: V(H₂) : V(O₂) = 2 : 1 bestätigt H₂O"
            : v.reaction === 1
              ? "Thermolyse: 2 I₂O₅ → 2 I₂ + 5 O₂"
              : "Umkehrreaktion: 2 H₂ + O₂ → 2 H₂O (exotherm)",
          "lab-text-small",
          "middle",
        )
      );
    }

    case "gleichungswaage": {
      const r = EQUATION_REACTIONS[v.rx];
      const balanced = r.atoms.every((at) => v.a * at.counts[0] + v.b * at.counts[1] === v.c * at.counts[2]);
      const sumAB = r.atoms.reduce((acc, at) => acc + v.a * at.counts[0] + v.b * at.counts[1], 0);
      const sumC = r.atoms.reduce((acc, at) => acc + v.c * at.counts[2], 0);
      const leftCount = r.isDecomposition ? sumC : sumAB;
      const rightCount = r.isDecomposition ? sumAB : sumC;
      const tilt = clamp((rightCount - leftCount) * 3, -16, 16);
      return (
        rect(42, 48, 436, 228, "lab-panel", 'rx="16"') +
        rect(95, 108 - tilt, 120, 64, balanced ? "lab-fill-ok" : "lab-fill-b", 'rx="10"') +
        rect(305, 108 + tilt, 120, 64, balanced ? "lab-fill-ok" : "lab-fill-a", 'rx="10"') +
        text(155, 145 - tilt, `${leftCount} Atome`, "lab-text", "middle") +
        text(365, 145 + tilt, `${rightCount} Atome`, "lab-text", "middle") +
        line(115, 190 - tilt, 405, 190 + tilt, "lab-axis") +
        path("M245 248 L260 190 L275 248 Z", "lab-shape-2") +
        text(
          260,
          308,
          balanced
            ? "Ausgeglichen! Alle Atomsorten bleiben in der Anzahl erhalten."
            : "Noch unausgeglichen – passe die Koeffizienten a, b, c an.",
          "lab-text",
          "middle",
        )
      );
    }

    case "energiediagramm": {
      const peakUncat = Math.max(v.ee, v.ep) + v.ea;
      const peakCat = Math.max(v.ee, v.ep) + v.ea / 2;
      const profile = (peak: number) => (x: number) => {
        if (x <= 2) return v.ee;
        if (x >= 8) return v.ep;
        const u = (x - 2) / 6; // 0..1
        const base = v.ee + (v.ep - v.ee) * (3 * u * u - 2 * u * u * u);
        const bump = (peak - Math.max(v.ee, v.ep) + Math.abs(v.ep - v.ee) * 0.5) * Math.sin(Math.PI * u) ** 2;
        return base + bump;
      };
      const pProd = ENERGY_PLOT.P(9, v.ep);
      return (
        `<defs>${ENERGY_PLOT.clip("en-clip")}</defs>` +
        ENERGY_PLOT.grid(2, 2, "Reaktionsweg", "Eᵢ / kJ", 20, 40, false) +
        clipped(
          "en-clip",
          ENERGY_PLOT.graph(profile(peakUncat), "lab-curve") +
            (v.cat === 1 ? ENERGY_PLOT.graph(profile(peakCat), "lab-curve-2") : ""),
        ) +
        handle("ep", pProd.x, pProd.y, "Innere Energie der Produkte ziehen") +
        text(108, ENERGY_PLOT.Y(v.ee) - 8, `Edukte (${v.ee} kJ)`, "lab-text-small", "middle") +
        text(426, ENERGY_PLOT.Y(v.ep) - 8, `Produkte (${v.ep} kJ)`, "lab-text-small", "middle") +
        text(
          275,
          38,
          `ΔEᵢ = ${fmtSigned(v.ep - v.ee, 0, "kJ")} · E_A = ${v.cat === 1 ? v.ea / 2 : v.ea} kJ`,
          "lab-text-small",
          "middle",
        )
      );
    }

    case "katalyse": {
      let surface = "";
      const teeth = v.surface === 1 ? 12 : 5;
      for (let i = 0; i < teeth; i++) {
        surface += rect(66 + i * (388 / teeth), 220, 388 / teeth - 4, 34, "lab-shape-2", 'rx="4"');
      }
      const yMol = [105, 192, 196, 192, 98][v.step];
      return (
        rect(48, 48, 424, 232, "lab-panel", 'rx="16"') +
        surface +
        text(260, 270, "Katalysatoroberfläche (Platin)", "lab-text-small", "middle") +
        atom(180, yMol, v.step >= 3 ? "CO₂" : "CO", v.step >= 3 ? "lab-fill-ok" : "lab-fill-b", 24) +
        atom(320, yMol, v.step >= 3 ? "CO₂" : v.step === 2 ? "O · O" : "O₂", v.step >= 3 ? "lab-fill-ok" : "lab-fill-a", 24) +
        text(260, 312, `Schritt ${v.step} von 4 der Oberflächenkatalyse`, "lab-text", "middle")
      );
    }

    case "molmasse": {
      const sp = PARTICLE_SPECIES[v.species];
      return (
        rect(44, 52, 196, 212, "lab-panel", 'rx="16"') +
        atom(142, 136, sp.formula, "lab-fill-a", 32) +
        text(142, 198, "1 Teilchen", "lab-text", "middle") +
        text(142, 224, `${fmt(sp.massE24g, 2)} · 10⁻²⁴ g`, "lab-text-small", "middle") +
        arrow(248, 156, 276, 156, "lab-side-a") +
        rect(284, 52, 196, 212, "lab-panel", 'rx="16"') +
        rect(322, 108, 120, 74, "lab-fill-ok", 'rx="12"') +
        text(382, 142, `${fmt(v.moles, 1)} mol ${sp.formula}`, "lab-text", "middle") +
        text(382, 166, `m = ${fmt(v.moles * sp.molarMass, 1)} g`, "lab-text", "middle") +
        text(382, 224, `M = ${fmt(sp.molarMass, 1)} g/mol`, "lab-text-small", "middle") +
        text(260, 308, "M = m(Teilchen) · N_A mit N_A = 6,022 · 10²³ mol⁻¹", "lab-text-small", "middle")
      );
    }

    case "quantitaetsgroessen": {
      const vol = v.n * VM_NORM;
      const pistonX = 110 + (v.n / 3.0) * 280;
      return (
        rect(96, 104, 326, 116, "lab-panel", 'rx="10"') +
        rect(100, 108, pistonX - 100, 108, "lab-fill-a", 'rx="6"') +
        rect(pistonX, 100, 16, 124, "lab-shape-2", 'rx="4"') +
        rect(pistonX + 16, 154, 80, 16, "lab-axis", 'rx="4"') +
        handle("n", pistonX + 8, 162, "Kolben für Stoffmenge n ziehen") +
        text(260, 76, `Stoffmenge n = ${fmt(v.n, 1)} mol → Gasvolumen V = ${fmt(vol, 1)} l`, "lab-text", "middle") +
        text(260, 274, "Satz von Avogadro: V = n · 22,4 l/mol bei 0 °C und 1013 hPa", "lab-text-small", "middle")
      );
    }

    case "stoffumsatz": {
      const r = STOICH_REACTIONS[v.rx];
      const n1 = v.mEdukt / r.eduktM;
      const n2 = n1 * (r.produktNu / r.eduktNu);
      const m2 = n2 * r.produktM;
      const h1 = clamp(n1 * 22, 12, 175);
      const h2 = clamp(n2 * 22, 12, 175);
      return (
        rect(44, 48, 432, 232, "lab-panel", 'rx="16"') +
        rect(112, 240 - h1, 88, h1, "lab-fill-b", 'rx="6"') +
        rect(320, 240 - h2, 88, h2, "lab-fill-ok", 'rx="6"') +
        arrow(218, 168, 302, 168, "lab-side-a") +
        text(260, 148, `${r.eduktNu} : ${r.produktNu}`, "lab-text", "middle") +
        text(156, 262, `${r.eduktFormula}: ${fmt(n1, 2)} mol (${v.mEdukt} g)`, "lab-text-small", "middle") +
        text(364, 262, `${r.produktFormula}: ${fmt(n2, 2)} mol (${fmt(m2, 1)} g)`, "lab-text-small", "middle") +
        text(260, 310, r.equation, "lab-text", "middle")
      );
    }

    case "alkanverbrennung": {
      const c = alkaneCombustion(v.n, v.oxygen);
      const flameCls = v.oxygen === 2 ? "lab-fill-a" : "lab-fill-b";
      let chainSvg = "";
      const gap = Math.min(48, 250 / v.n);
      const x0 = 175 - ((v.n - 1) * gap) / 2;
      for (let i = 0; i < v.n; i++) {
        if (i > 0) chainSvg += line(x0 + (i - 1) * gap + 15, 170, x0 + i * gap - 15, 170, "lab-axis");
        chainSvg += atom(x0 + i * gap, 170, "C", "lab-fill-b", 15);
      }
      return (
        rect(38, 48, 274, 220, "lab-panel", 'rx="16"') +
        chainSvg +
        text(175, 92, `${ALKANE_NAMES[v.n]} (${alkaneFormula(v.n)})`, "lab-text", "middle") +
        text(175, 240, "Homologe Reihe CₙH₂ₙ₊₂", "lab-text-small", "middle") +
        // Brennerflamme rechts
        rect(382, 196, 44, 72, "lab-shape-2", 'rx="6"') +
        path("M404 78 Q442 142 422 196 H386 Q366 142 404 78 Z", flameCls) +
        (v.oxygen === 0 ? circle(404, 62, 10, "lab-axis") : "") +
        text(260, 310, c.equation, "lab-text-small", "middle")
      );
    }

    case "abgasreinigung": {
      const katActive = v.kat === 1 && v.temp >= 300;
      return (
        rect(38, 86, 444, 152, "lab-panel", 'rx="16"') +
        text(86, 166, "CO + Ruß", "lab-text", "middle") +
        arrow(132, 162, 168, 162, "lab-axis") +
        rect(174, 110, 108, 104, katActive ? "lab-fill-ok" : v.kat === 1 ? "lab-fill-b" : "lab-shape", 'rx="10"') +
        text(228, 154, "3-Wege-Kat", "lab-text-small", "middle") +
        text(228, 176, v.kat === 1 ? `${v.temp} °C` : "aus", "lab-text-small", "middle") +
        arrow(288, 162, 314, 162, "lab-axis") +
        rect(320, 110, 102, 104, v.filter === 1 ? "lab-fill-a" : "lab-shape", 'rx="10"') +
        text(371, 154, "Partikel-", "lab-text-small", "middle") +
        text(371, 176, v.filter === 1 ? "filter aktiv" : "filter aus", "lab-text-small", "middle") +
        text(
          260,
          292,
          katActive && v.filter === 1
            ? "Sauberes Abgas: CO → CO₂ und Rußpartikel zurückgehalten!"
            : "Prüfe Betriebstemperatur (≥ 300 °C), Katalysator und Partikelfilter.",
          "lab-text-small",
          "middle",
        )
      );
    }

    case "verbrennungsfaktoren": {
      const extinguished = v.measure > 0;
      const intense = !extinguished && (v.o2 === 1 || v.form === 2);
      return (
        rect(44, 48, 432, 224, "lab-panel", 'rx="16"') +
        path("M165 225 L260 85 L355 225 Z", extinguished ? "lab-shape" : intense ? "lab-fill-b" : "lab-fill-a") +
        text(260, 108, "Zündtemperatur", "lab-text-small", "middle") +
        text(165, 246, "Brennbarer Stoff", "lab-text-small", "middle") +
        text(355, 246, v.o2 === 1 ? "100 % O₂" : "Luft (21 % O₂)", "lab-text-small", "middle") +
        text(
          260,
          178,
          extinguished ? "Gestoppt ✓" : v.form === 2 ? "Explosion!" : v.o2 === 1 ? "Heftige Glut!" : "Ruhig",
          "lab-text-big",
          "middle",
        ) +
        text(260, 308, "Verbrennungsdreieck und Oberflächeneffekt", "lab-text", "middle")
      );
    }

    case "kohlenstoffkreislauf": {
      const fossil = v.fuel <= 1;
      const h2 = v.fuel === 3;
      return (
        rect(42, 46, 436, 232, "lab-panel", 'rx="16"') +
        rect(175, 64, 170, 52, "lab-fill-a", 'rx="12"') +
        text(260, 95, "Atmosphäre (CO₂)", "lab-text", "middle") +
        rect(72, 184, 146, 62, "lab-fill-ok", 'rx="12"') +
        text(145, 214, "Fotosynthese", "lab-text-small", "middle") +
        text(145, 234, "(Biomasse / Holz)", "lab-text-small", "middle") +
        rect(302, 184, 146, 62, fossil ? "lab-fill-b" : "lab-shape", 'rx="12"') +
        text(375, 214, h2 ? "2 H₂ + O₂ → 2 H₂O" : fossil ? "Fossiles Lager" : "Kreislauf-Nutzung", "lab-text-small", "middle") +
        arrow(205, 118, 152, 180, "lab-side-a") +
        (h2 ? "" : arrow(362, 180, 312, 118, fossil ? "lab-curve-2" : "lab-side-a")) +
        text(
          260,
          310,
          h2
            ? "Grüner Wasserstoff setzt bei der Verbrennung kein CO₂ frei."
            : fossil
              ? "Fossile Brennstoffe erhöhen den CO₂-Gehalt der Atmosphäre netto."
              : "Nachhaltige Biomasse bleibt im kurzfristigen Kohlenstoff-Kreislauf.",
          "lab-text-small",
          "middle",
        )
      );
    }

    case "rutherford": {
      const coreX = 320;
      const coreY = 170;
      const startY = coreY - v.b * 1.3;
      let ray = "";
      if (v.b === 0) {
        ray = arrow(70, coreY, 294, coreY, "lab-curve-2") + arrow(294, coreY + 12, 92, coreY + 26, "lab-curve-2");
      } else if (v.b <= 30) {
        ray = path(`M 70 ${startY} Q ${coreX - 18} ${startY} 445 ${startY - (40 - v.b) * 2.4}`, "lab-curve-2");
      } else {
        ray = arrow(70, startY, 455, startY - 4, "lab-curve");
      }
      return (
        circle(coreX, coreY, 118, "lab-panel") +
        circle(coreX, coreY, 12, "lab-fill-b") +
        text(coreX, coreY + 4, "+", "lab-text-small", "middle") +
        ray +
        handle("b", 96, startY, "Trefferabstand b des α-Teilchens ziehen") +
        text(260, 314, `Trefferabstand b = ${v.b} pm zum winzigen positiven Atomkern`, "lab-text", "middle")
      );
    }

    case "energiestufen":
    case "pse-ionen": {
      const el = PSE_ELEMENTS[v.z - 1];
      const ionMode = kind === "pse-ionen" && v.mode === 1 && el.ionCharge !== null && el.ionCharge !== 0;
      const eCount = ionMode && el.ionCharge !== null ? el.z - el.ionCharge : el.z;
      const shellSource = PSE_ELEMENTS.find((item) => item.z === eCount) ?? el;
      const shells = eCount === 0 ? [] : shellSource.shells;
      let rings = atom(260, 164, `${el.z}p⁺`, "lab-fill-b", 22);
      shells.forEach((cnt, idx) => {
        const rad = 48 + idx * 28;
        rings += `<circle cx="260" cy="164" r="${rad}" fill="none" stroke="var(--lab-axis)" stroke-dasharray="4 3" />`;
        for (let k = 0; k < cnt; k++) {
          const ang = (2 * Math.PI * k) / cnt - Math.PI / 2;
          rings += circle(260 + rad * Math.cos(ang), 164 + rad * Math.sin(ang), 5.5, "lab-fill-a");
        }
      });
      const label =
        ionMode && el.ionCharge !== null
          ? `Ion ${ionText(el.symbol, el.ionCharge)} (${shells.join(" · ") || "0 e⁻"})`
          : `${el.name} (${el.symbol}) · Energiestufen: ${el.shells.join(" · ")}`;
      return rings + text(260, 318, label, "lab-text", "middle");
    }

    case "kugelwolken": {
      const el = PSE_ELEMENTS[v.z - 1];
      const kw = kugelwolkenConfig(v.z);
      const offsets =
        kw.maxOuterClouds === 1
          ? [[0, -68]]
          : [
              [0, -76],
              [78, 0],
              [0, 76],
              [-78, 0],
            ];
      let clouds = atom(260, 165, el.symbol, "lab-fill-b", 24);
      offsets.forEach(([dx, dy], idx) => {
        const cx = 260 + dx;
        const cy = 165 + dy;
        const hasPair = idx < kw.pairs;
        const hasSingle = !hasPair && idx < kw.pairs + kw.singles;
        clouds += circle(cx, cy, 30, hasPair ? "lab-fill-ok" : hasSingle ? "lab-fill-a" : "lab-panel");
        if (hasPair) {
          clouds += circle(cx - 8, cy, 5.5, "lab-fill-b") + circle(cx + 8, cy, 5.5, "lab-fill-b");
        } else if (hasSingle) {
          clouds += circle(cx, cy, 6, "lab-fill-b");
        }
      });
      return (
        clouds +
        text(
          260,
          316,
          `${el.name}: ${kw.pairs} Elektronenpaar(e), ${kw.singles} einzelne(s) Elektron(en) → Bindigkeit ${kw.bindigkeit}`,
          "lab-text-small",
          "middle",
        )
      );
    }

    case "isotopie": {
      const p = ISOTOPE_PAIRS[v.element];
      const m = averageMolarMass(p.a1, p.a2, v.pct);
      const splitX = 70 + (v.pct / 100) * 380;
      return (
        rect(48, 52, 424, 224, "lab-panel", 'rx="16"') +
        rect(70, 128, Math.max(0, splitX - 70), 54, "lab-fill-a", 'rx="8"') +
        rect(splitX, 128, Math.max(0, 450 - splitX), 54, "lab-fill-b", 'rx="8"') +
        handle("pct", splitX, 155, "Isotopenanteil verschieben") +
        text(165, 108, `${p.symbol}-${p.a1}: ${v.pct} %`, "lab-text", "middle") +
        text(355, 108, `${p.symbol}-${p.a2}: ${100 - v.pct} %`, "lab-text", "middle") +
        text(260, 232, `Mittlere molare Masse M = ${fmt(m, 2)} g/mol`, "lab-text-big", "middle") +
        text(260, 308, `Beide Isotope besitzen Z = ${p.z} Protonen, aber verschieden viele Neutronen.`, "lab-text-small", "middle")
      );
    }
    default:
      return "";
  }
}

export function labView(kind: LabKind): LabView {
  const render = (v: LabValues, r: ReadoutValues) => `${open(kind)}${draw(kind, v, r)}</svg>`;
  switch (kind) {
    case "kenngroessen":
      return {
        render,
        handles: {
          vol: { y: "vol", drag: (p) => ({ vol: Math.round(((250 - p.y) / 3.0) / 5) * 5 }) },
        },
      };
    case "siedekurve":
      return {
        render,
        handles: {
          time: { x: "time", drag: (p) => ({ time: Math.round(BOIL_PLOT.invX(p.x)) }) },
        },
      };
    case "teilchenmodell":
      return {
        render,
        handles: {
          temp: { y: "temp", drag: (p) => ({ temp: Math.round((((270 - p.y) / 190) * 240 - 100) / 20) * 20 }) },
        },
      };
    case "linde":
      return {
        render,
        handles: {
          temp: { y: "temp", drag: (p) => ({ temp: -205 + Math.round((((268 - p.y) / 200) * 30) / 3) * 3 }) },
        },
      };
    case "gitterverschiebung":
      return {
        render,
        handles: {
          shift: { x: "shift", drag: (p) => ({ shift: Math.round(((p.x - 135) / 56) * 2) / 2 }) },
        },
      };
    case "hofmann":
      return {
        render,
        handles: {
          amount: { y: "amount", drag: (p) => ({ amount: Math.round(((260 - p.y) / 5) / 5) * 5 }) },
        },
      };
    case "energiediagramm":
      return {
        render,
        handles: {
          ep: { y: "ep", drag: (p) => ({ ep: Math.round(ENERGY_PLOT.invY(p.y) / 20) * 20 }) },
        },
      };
    case "quantitaetsgroessen":
      return {
        render,
        handles: {
          n: { x: "n", drag: (p) => ({ n: Math.round((((p.x - 110) / 280) * 3.0) * 2) / 2 }) },
        },
      };
    case "rutherford":
      return {
        render,
        handles: {
          b: { y: "b", drag: (p) => ({ b: Math.round(((170 - p.y) / 1.3) / 10) * 10 }) },
        },
      };
    case "isotopie":
      return {
        render,
        handles: {
          pct: { x: "pct", drag: (p) => ({ pct: Math.round((((p.x - 70) / 380) * 100) / 5) * 5 }) },
        },
      };
    default:
      return { render };
  }
}
