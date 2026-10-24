import {
  FATTY_ACIDS,
  indicatorColor,
  LATTICE_SALTS,
  photosynthesis,
  titrationPh,
} from "../chemistry/model";
import { fmt } from "../exercises/format";
import type { LabKind, LabValues, ReadoutValues } from "../model/types";
import { COMPARE_SUBSTANCES, EXPERIMENTS, makeLab, POLYMERS, REDOX_REACTIONS } from "./definitions";
import { arrow, circle, line, open, path, rect, text, type LabView } from "./svg";

const atom = (x: number, y: number, label: string, color = "lab-fill-a", radius = 22) =>
  circle(x, y, radius, color) + text(x, y + 5, label, "lab-text", "middle");
const dots = (count: number, x: number, y: number, label: string, color: string, cols = 6) =>
  Array.from({ length: Math.max(0, Math.min(40, count)) }, (_, i) =>
    atom(x + (i % cols) * 46, y + Math.floor(i / cols) * 46, label, color, 17),
  ).join("");
/** A row of linked beads: monomers, amino acids or sugar units. */
const chain = (count: number, labels: (i: number) => string, color: string, y = 160) => {
  const n = Math.max(1, Math.min(12, count));
  const gap = Math.min(70, 440 / n);
  const x0 = 260 - ((n - 1) * gap) / 2;
  const r = Math.min(24, gap / 2.4);
  let out = "";
  // Bonds only between the atom rims, so no line crosses a label.
  for (let i = 1; i < n; i++) out += line(x0 + (i - 1) * gap + r, y, x0 + i * gap - r, y, "lab-side-a");
  for (let i = 0; i < n; i++) out += atom(x0 + i * gap, y, labels(i), color, r);
  return out;
};

/** Carbon count of the drawn alkanol and the x of the C atom carrying O. */
const carbons = (v: LabValues, kind: LabKind) =>
  kind === "alkanol" ? v.n : [2, 3, 3, 4][v.alcohol];
const oxygenX = (v: LabValues, kind: LabKind) => {
  const n = carbons(v, kind);
  const gap = Math.min(70, 440 / n);
  const x0 = 260 - ((n - 1) * gap) / 2;
  // Primary alkanols carry O at the chain end, secondary ones at C2.
  const secondary = kind === "alkanon" && v.alcohol >= 2;
  return secondary ? x0 + gap : x0 + (n - 1) * gap;
};

const COLORS: Record<string, string> = {
  rot: "hsl(0 75% 52%)",
  orange: "hsl(28 85% 55%)",
  gelb: "hsl(50 90% 55%)",
  grün: "hsl(130 55% 45%)",
  blau: "hsl(215 75% 52%)",
  violett: "hsl(275 55% 50%)",
  pink: "hsl(320 75% 60%)",
  farblos: "transparent",
  verblassend: "hsl(320 40% 85%)",
};

/** An Erlenmeyer flask filled with a coloured solution. */
const flask = (color: string, label: string) =>
  `<path d="M220 45 V120 L150 270 Q145 290 175 290 H345 Q375 290 370 270 L300 120 V45" class="lab-orbit"/>` +
  `<path d="M190 200 H330 L360 266 Q365 282 342 282 H178 Q155 282 160 266Z" fill="${COLORS[color] ?? "transparent"}" opacity=".8"/>` +
  text(260, 245, label, "lab-text lab-text-big", "middle");

function draw(kind: LabKind, v: LabValues, r: ReadoutValues): string {
  const experiment = EXPERIMENTS[kind];
  if (experiment) {
    const current = experiment.cases[v.case];
    const correct = v.prediction === current.answer;
    const name = current.name.length > 46 ? `${current.name.slice(0, 44)}…` : current.name;
    return (
      rect(40, 65, 440, 175, "lab-panel", 'rx="18"') +
      text(260, 100, name, "lab-text", "middle") +
      atom(160, 163, "?", "lab-fill-b", 34) +
      arrow(215, 163, 290, 163, "lab-side-a") +
      atom(
        350,
        163,
        v.observed ? (correct ? "✓" : "↻") : "…",
        v.observed && correct ? "lab-fill-c" : "lab-fill-a",
        34,
      ) +
      text(
        260,
        218,
        v.observed
          ? "Vergleiche die Auswertung unter dem Bild."
          : "Vermutung wählen → Modellversuch starten",
        "lab-text-small",
        "middle",
      )
    );
  }
  switch (kind) {
    case "ionenbildung":
      return (
        atom(140, 150, String(r.cation), "lab-fill-b", 46) +
        atom(380, 150, String(r.anion), "lab-fill-a", 46) +
        arrow(195, 150, 325, 150, "lab-side-c") +
        text(260, 135, `${r.electrons} e⁻ je Formeleinheit`, "lab-text-small", "middle") +
        text(140, 230, "Metall gibt ab", "lab-text", "middle") +
        text(380, 230, "Nichtmetall nimmt auf", "lab-text", "middle") +
        text(260, 300, String(r.formula), "lab-text lab-text-big", "middle")
      );
    case "teilgleichung": {
      const rx = REDOX_REACTIONS[v.reaction];
      const given = v.ox * rx.charge;
      const taken = v.red * rx.accepts;
      const scale = 18;
      return (
        rect(110, 280 - given * scale, 80, given * scale, "lab-fill-b") +
        rect(330, 280 - taken * scale, 80, taken * scale, "lab-fill-a") +
        line(80, 280, 440, 280, "lab-side-a") +
        text(150, 305, `abgegeben: ${given} e⁻`, "lab-text", "middle") +
        text(370, 305, `aufgenommen: ${taken} e⁻`, "lab-text", "middle") +
        text(260, 40, given === taken ? "Elektronenbilanz ausgeglichen" : "Elektronenbilanz offen", "lab-text", "middle")
      );
    }
    case "salzformel":
    case "gitter": {
      const salt = kind === "gitter" ? LATTICE_SALTS[v.salt] : undefined;
      const size = salt ? 18 + (salt.distance - 200) / 8 : 22;
      let out = "";
      for (let row = 0; row < 4; row++)
        for (let col = 0; col < 6; col++) {
          const plus = (row + col) % 2 === 0;
          out += atom(110 + col * 60, 70 + row * 55, plus ? "+" : "−", plus ? "lab-fill-b" : "lab-fill-a", plus ? size * 0.7 : size);
        }
      return (
        out +
        text(
          260,
          322,
          salt ? `${salt.formula}: ${salt.energy} kJ/mol` : `${r.formula}: ${r.ratio}`,
          "lab-text",
          "middle",
        )
      );
    }
    case "loesen":
      return (
        arrow(140, 270, 140, 270 - (v.lattice - 400) / 2.5, "lab-side-b") +
        arrow(380, 70, 380, 70 + (v.hydration - 400) / 2.5, "lab-side-a") +
        text(140, 305, "Gitter trennen (aufwenden)", "lab-text", "middle") +
        text(380, 305, "Hydrathüllen (frei)", "lab-text", "middle") +
        atom(260, 170, "Na⁺", "lab-fill-b", 24) +
        dots(1, 300, 170, "δ−", "lab-fill-c") +
        text(260, 40, `Bilanz: ${fmt(Number(r.delta), 0)} kJ/mol`, "lab-text", "middle")
      );
    case "indikator":
      return flask(String(r.color), `pH ${v.ph}`) + text(260, 325, String(r.class), "lab-text", "middle");
    case "saeurerest":
      return (
        atom(130, 160, String(r.particle), "lab-fill-a", 60) +
        dots(Math.min(v.protons, 3), 300, 120, "H⁺", "lab-fill-c", 3) +
        arrow(200, 160, 290, 160, "lab-side-c") +
        text(260, 290, "Jedes abgegebene H⁺ senkt die Ladung um eins.", "lab-text-small", "middle")
      );
    case "verduennung": {
      let out = "";
      for (let i = 0; i <= 4; i++) {
        const fill = `hsl(${i * 25} 75% ${52 + i * 6}%)`;
        out +=
          `<rect x="${60 + i * 85}" y="120" width="60" height="140" rx="8" class="lab-orbit"/>` +
          `<rect x="${63 + i * 85}" y="${170}" width="54" height="87" rx="6" fill="${fill}" opacity="${i <= v.steps ? 0.85 : 0.15}"/>` +
          text(90 + i * 85, 290, `pH ${1 + i}`, i === v.steps ? "lab-text" : "lab-text-small", "middle");
      }
      return out + text(260, 60, `aktuell: c(H₃O⁺) = ${r.c}`, "lab-text", "middle");
    }
    case "neutralisation":
    case "titration": {
      const ph =
        kind === "neutralisation"
          ? titrationPh(10, 0.1, v.base, 0.1)
          : titrationPh(10, [0.08, 0.12, 0.15][v.sample], v.base, 0.1);
      const level = Math.min(150, v.base * 7);
      return (
        rect(390, 30, 26, 190, "lab-orbit") +
        rect(393, 40 + level, 20, 177 - level, "lab-soft-a") +
        line(403, 220, 403, 250, "lab-side-a") +
        `<path d="M220 110 L170 260 Q165 285 195 285 H325 Q355 285 350 260 L300 110Z" class="lab-orbit"/>` +
        `<path d="M200 200 H320 L345 262 Q350 278 328 278 H192 Q170 278 175 262Z" fill="${COLORS[indicatorColor(1, ph)]}" opacity=".8"/>` +
        text(260, 245, `pH ${fmt(ph, 1)}`, "lab-text lab-text-big", "middle") +
        text(100, 60, `${v.base} ml Natronlauge`, "lab-text", "start")
      );
    }
    case "carbonat":
      return (
        flask("farblos", "") +
        (v.reactant === 4 ? "" : dots(6, 205, 140, "∘", "lab-fill-c", 3)) +
        text(260, 30, String(r.gas), "lab-text", "middle") +
        text(260, 325, String(r.salt), "lab-text", "middle")
      );
    case "fotosynthese": {
      const p = photosynthesis(v.co2, v.water, v.light === 1);
      return (
        (v.light ? circle(470, 50, 26, "lab-fill-c") + text(470, 55, "☀", "lab-text", "middle") : "") +
        dots(p.co2, 30, 60, "CO₂", "lab-fill-a", 3) +
        dots(p.water, 30, 210, "H₂O", "lab-fill-b", 3) +
        arrow(180, 160, 260, 160, "lab-side-c") +
        dots(p.glucose, 280, 120, "C₆", "lab-fill-c", 2) +
        dots(Math.min(12, p.oxygen), 280, 220, "O₂", "lab-fill-a", 4)
      );
    }
    case "kalorimetrie": {
      const rise = Number(r.rise);
      return (
        rect(180, 60, 160, 130, "lab-orbit") +
        rect(183, 63 + 120 * (1 - v.water / 500), 154, 124 * (v.water / 500), "lab-soft-a") +
        `<path d="M240 270 Q260 ${230 - v.mass * 15} 280 270Z" class="lab-fill-b"/>` +
        rect(430, 40, 18, 220, "lab-orbit") +
        rect(433, 257 - Math.min(210, rise * 3), 12, Math.min(210, rise * 3), "lab-fill-a") +
        text(400, 300, `ΔT = ${fmt(rise, 1)} K`, "lab-text", "middle") +
        text(260, 310, `${fmt(Number(r.energy), 1)} kJ`, "lab-text", "middle")
      );
    }
    case "addition": {
      const done = String(r.color) === "entfärbt";
      return (
        atom(150, 150, "C", "lab-fill-a", 26) +
        atom(230, 150, "C", "lab-fill-a", 26) +
        line(176, 145, 204, 145, "lab-side-a") +
        (v.substance === 1 || v.substance === 2 ? (v.step < 3 ? line(176, 157, 204, 157, "lab-side-a") : "") : "") +
        atom(150, done ? 90 : 60, "Br", "lab-fill-b", 22) +
        atom(done ? 230 : 330, done ? 90 : 60, "Br", "lab-fill-b", 22) +
        (v.step >= 1 && v.step < 3 && (v.substance === 1 || v.substance === 2)
          ? text(150, 30, "δ+", "lab-text-small", "middle") + text(330, 30, "δ−", "lab-text-small", "middle")
          : "") +
        `<rect x="360" y="170" width="90" height="110" rx="8" fill="${done ? "transparent" : "hsl(28 70% 45%)"}" class="lab-orbit"/>` +
        text(405, 305, `Bromwasser: ${r.color}`, "lab-text-small", "middle")
      );
    }
    case "substitution": {
      const on = v.light === 1;
      return (
        (on ? circle(470, 45, 24, "lab-fill-c") + text(470, 50, "☀", "lab-text", "middle") : "") +
        atom(120, 160, "CH₄", "lab-fill-a", 34) +
        atom(260, 160, v.halogen ? "Cl₂" : "Br₂", "lab-fill-b", 30) +
        (on && v.step >= 1 ? atom(380, 110, v.halogen ? "Cl·" : "Br·", "lab-fill-c", 26) : "") +
        (on && v.step >= 2 ? atom(380, 210, "·CH₃", "lab-fill-c", 26) : "") +
        text(260, 300, `Schritt ${v.step}`, "lab-text", "middle")
      );
    }
    case "oxzahl":
      return (
        atom(260, 160, "C", "lab-fill-a", 34) +
        text(260, 70, String(r.partners), "lab-text", "middle") +
        text(260, 260, `Deine Zahl: ${v.guess > 0 ? "+" : ""}${fmt(v.guess, 0)}`, "lab-text lab-text-big", "middle") +
        text(260, 300, String(r.check), "lab-text-small", "middle")
      );
    case "alkanol":
    case "alkanon":
      return (
        line(oxygenX(v, kind), 136, oxygenX(v, kind), 92, "lab-side-a") +
        chain(carbons(v, kind), () => "C", "lab-fill-a", 160) +
        atom(oxygenX(v, kind), 70, "O", "lab-fill-b", 22) +
        text(260, 260, String(kind === "alkanol" ? r.name : r.product), "lab-text lab-text-big", "middle") +
        text(260, 300, `Oxidationszahl: ${r.oz}`, "lab-text", "middle")
      );
    case "ester":
      return (
        chain(v.acid, () => "C", "lab-fill-a", 130) +
        atom(260, 200, "O", "lab-fill-b", 22) +
        chain(v.alcohol, () => "C", "lab-fill-c", 260) +
        text(460, 320, "+ H₂O", "lab-text", "end")
      );
    case "ester-eig": {
      const bar = (index: number, x: number, value: number) =>
        rect(x, 280 - value * 1.6, 80, value * 1.6, index === 0 ? "lab-fill-a" : "lab-fill-b") +
        text(x + 40, 300, `${value} °C`, "lab-text", "middle");
      return (
        bar(0, 140, COMPARE_SUBSTANCES[v.a].boiling) +
        bar(1, 300, COMPARE_SUBSTANCES[v.b].boiling) +
        line(110, 280, 420, 280, "lab-side-a")
      );
    }
    case "peptid":
      return (
        chain(v.n, (i) => `AS${i + 1}`, "lab-fill-a") +
        text(260, 250, `${v.n - 1} Peptidbindung${v.n === 2 ? "" : "en"} · ${v.n - 1} H₂O abgespalten`, "lab-text", "middle")
      );
    case "polysaccharid":
      return (
        chain(v.type === 2 ? 2 : v.n, (i) => (v.type === 2 && i === 1 ? "Fru" : "Glc"), v.type === 1 ? "lab-fill-b" : "lab-fill-a") +
        text(260, 260, String(r.shape), "lab-text", "middle")
      );
    case "fett": {
      const acids = [v.a1, v.a2, v.a3].map((i) => FATTY_ACIDS[i]);
      let out = rect(60, 80, 50, 180, "lab-fill-a") + text(85, 290, "Glycerin", "lab-text-small", "middle");
      acids.forEach((acid, i) => {
        const y = 110 + i * 60;
        out += line(110, y, 150, y, "lab-side-a");
        let x = 150;
        for (let k = 0; k < 6; k++) {
          const bend = acid.doubleBonds > k / 2 && k % 2 === 1 ? 14 : 0;
          out += line(x, y, x + 50, y + (k % 2 ? -bend : bend), acid.doubleBonds > k / 2 ? "lab-side-c" : "lab-side-b");
          x += 50;
        }
      });
      return out + text(300, 310, String(r.state), "lab-text", "middle");
    }
    case "polymerisation":
      return (
        chain(v.n, () => "", "lab-fill-a") +
        atom(40, 160, "R·", "lab-fill-c", 18) +
        text(260, 250, `[${POLYMERS[v.monomer].unit}]ₙ`, "lab-text lab-text-big", "middle")
      );
    case "polykondensation":
      return (
        chain(v.links + 1, (i) => (v.pair === 2 ? "M" : i % 2 ? "B" : "A"), "lab-fill-b") +
        dots(Math.min(10, v.links), 40, 250, "H₂O", "lab-fill-c", 10)
      );
    case "vernetzung": {
      let out = "";
      for (let i = 0; i < 4; i++)
        out += path(`M60 ${80 + i * 55} Q160 ${60 + i * 55} 260 ${80 + i * 55} T460 ${80 + i * 55}`, "lab-side-a", 'fill="none"');
      const links = [0, 2, 8][v.crosslink];
      for (let k = 0; k < links; k++) {
        const x = 90 + ((k * 47) % 350);
        const y = 80 + (k % 3) * 55;
        out += line(x, y, x, y + 55, "lab-side-c");
      }
      return out + text(260, 315, `${r.class}: ${r.behaviour}`, "lab-text", "middle");
    }
    case "silikon":
      return (
        chain(Math.min(10, v.di / 2 + 2), (i) => (i % 2 ? "O" : "Si"), "lab-fill-a", 140) +
        dots(Math.min(8, v.tri), 40, 230, "⋔", "lab-fill-c", 8) +
        text(260, 320, String(r.type), "lab-text", "middle")
      );
    case "akku":
      return (
        rect(75, 145, 370, 145, "lab-soft-a") +
        rect(100, 95, 30, 155, "lab-fill-b") +
        rect(390, 95, 30, 155, "lab-fill-c") +
        path("M115 95 V55 H405 V95", "lab-side-a") +
        atom(260, 55, v.mode === 1 ? "⚡" : "💡", "lab-fill-a", 25) +
        arrow(v.mode === 0 ? 145 : 375, 75, v.mode === 0 ? 375 : 145, 75, "lab-side-b") +
        text(115, 280, "Zink", "lab-text-small", "middle") +
        text(405, 280, "Graphit", "lab-text-small", "middle") +
        rect(200, 300, 120 * (v.charge / 100), 16, "lab-fill-c") +
        rect(200, 300, 120, 16, "lab-orbit") +
        (v.view === 1 ? dots(3, 170, 190, "Zn²⁺", "lab-fill-b", 3) + dots(3, 270, 230, "I⁻", "lab-fill-a", 3) : "")
      );
    case "brennstoffzelle":
      return (
        dots(v.hydrogen, 20, 80, "H₂", "lab-fill-a", 2) +
        dots(v.oxygen, 420, 80, "O₂", "lab-fill-b", 2) +
        rect(140, 60, 20, 220, "lab-orbit") +
        rect(360, 60, 20, 220, "lab-orbit") +
        rect(170, 60, 180, 220, "lab-soft-a") +
        path("M150 60 V30 H370 V60", "lab-side-a") +
        arrow(160, 40, 360, 40, "lab-side-c") +
        text(260, 25, `${r.electrons} e⁻`, "lab-text-small", "middle") +
        dots(Number(r.water), 190, 120, "H₂O", "lab-fill-c", 3)
      );
    default:
      return "";
  }
}

export function labView(kind: LabKind): LabView {
  return {
    render: (values, readouts) =>
      open(`${makeLab(kind).title}. Auswertung folgt unter der Zeichnung.`) +
      draw(kind, values, readouts) +
      "</svg>",
  };
}
