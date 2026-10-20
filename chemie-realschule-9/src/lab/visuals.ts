import { clouds, element, hydrocarbon, MOLECULES, reaction, shells } from "../chemistry/model";
import type { LabKind, LabValues, ReadoutValues } from "../model/types";
import { EXPERIMENTS, makeLab } from "./definitions";
import { arrow, circle, line, open, path, rect, text, type LabView } from "./svg";

const atom = (x: number, y: number, label: string, color = "lab-fill-a", radius = 22) =>
  circle(x, y, radius, color) + text(x, y + 5, label, "lab-text", "middle");
const dots = (count: number, x: number, y: number, label: string, color: string, cols = 6) =>
  Array.from({ length: Math.max(0, Math.min(40, count)) }, (_, i) =>
    atom(x + (i % cols) * 46, y + Math.floor(i / cols) * 46, label, color, 17),
  ).join("");

function draw(kind: LabKind, v: LabValues, r: ReadoutValues): string {
  const experiment = EXPERIMENTS[kind];
  if (experiment) {
    const current = experiment.cases[v.case];
    const correct = v.prediction === current.answer;
    return (
      rect(80, 65, 360, 175, "lab-panel", 'rx="18"') +
      text(260, 100, current.name, "lab-text", "middle") +
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
    case "particles": {
      let out = rect(80, 45, 360, 240, "lab-panel", 'rx="14"');
      for (let i = 0; i < 20; i++) {
        const gaseous = v.temperature > 100;
        const x = gaseous
          ? 110 + ((i * 71) % 300)
          : 150 + (i % 5) * 52 + (v.temperature > 0 ? Math.sin(i * 5) * 7 : 0);
        const y = gaseous ? 70 + ((i * 43) % 190) : 100 + Math.floor(i / 5) * 43;
        out += atom(x, y, "", "lab-fill-a", 10);
      }
      return out + text(260, 322, String(r.phase), "lab-text", "middle");
    }
    case "reaction":
    case "fuelcell": {
      const after =
        kind === "reaction"
          ? reaction(v.hydrogen, v.oxygen)
          : { water: 2 * Math.min(v.hydrogen / 2, v.oxygen) };
      return (
        text(120, 40, `${v.hydrogen} H₂`, "lab-text", "middle") +
        text(350, 40, `${v.oxygen} O₂`, "lab-text", "middle") +
        dots(v.hydrogen, 45, 80, "H₂", "lab-fill-a", 4) +
        dots(v.oxygen, 310, 80, "O₂", "lab-fill-b", 4) +
        arrow(260, 125, 260, 190, "lab-side-c") +
        dots(after.water, 100, 220, "H₂O", "lab-fill-c", 7) +
        text(
          260,
          320,
          "Atome bleiben erhalten; Bindungen werden neu geordnet.",
          "lab-text-small",
          "middle",
        )
      );
    }
    case "energy": {
      const start = 220;
      const end = v.endo ? 145 : 270;
      const peak = v.catalyst ? 105 : 50;
      return (
        arrow(45, 300, 45, 25, "lab-side-a") +
        arrow(45, 300, 485, 300, "lab-side-a") +
        text(65, 32, "Energie", "lab-text") +
        text(350, 328, "Reaktionsverlauf", "lab-text-small") +
        path(
          `M65 ${start} L125 ${start} C195 ${start} 205 ${peak} 260 ${peak} S315 ${end} 385 ${end} L475 ${end}`,
          "lab-curve",
        ) +
        line(65, start, 475, start, "lab-grid") +
        text(65, start - 12, "Edukte", "lab-text") +
        text(395, end - 12, "Produkte", "lab-text")
      );
    }
    case "amount":
      return (
        rect(
          75,
          245 - Math.min(190, Number(r.moles) * 40),
          100,
          Math.min(190, Number(r.moles) * 40),
          "lab-fill-a",
        ) +
        text(125, 275, `${Number(r.moles).toFixed(2)} mol`, "lab-text", "middle") +
        arrow(210, 150, 290, 150, "lab-side-b") +
        Array.from({ length: Math.round(Number(r.moles) * 6) }, (_, index) =>
          circle(310 + (index % 5) * 30, 65 + Math.floor(index / 5) * 28, 7, "lab-fill-c"),
        ).join("") +
        text(360, 290, "Teilchenzahl ∝ Stoffmenge", "lab-text-small", "middle")
      );
    case "rutherford": {
      const y = 170 - v.impact * 10;
      const endY = v.impact === 0 ? 170 : v.impact <= 2 ? 25 : y - 6;
      return (
        rect(265, 20, 14, 285, "lab-fill-b") +
        atom(272, 170, "+", "lab-fill-c", 18) +
        arrow(30, y, 235, y, "lab-side-a") +
        (v.impact === 0
          ? arrow(238, y + 8, 90, y + 8, "lab-side-b")
          : arrow(240, y, 475, endY, "lab-side-b")) +
        text(
          260,
          327,
          "Kern winzig gegenüber der Hülle · Skizze nicht maßstäblich",
          "lab-text-small",
          "middle",
        )
      );
    }
    case "atom": {
      let out =
        circle(260, 164, 115, "lab-orbit") + atom(260, 164, `${v.p}p / ${v.n}n`, "lab-fill-b", 57);
      for (let i = 0; i < v.e; i++) {
        const angle = (2 * Math.PI * i) / v.e;
        out += atom(
          260 + 115 * Math.cos(angle),
          164 + 115 * Math.sin(angle),
          "−",
          "lab-fill-a",
          11,
        );
      }
      return (
        out +
        text(
          260,
          320,
          `${element(v.p).symbol} · A = ${v.p + v.n} · Ladung ${v.p - v.e}`,
          "lab-text",
          "middle",
        )
      );
    }
    case "shells":
    case "periodic": {
      const distribution = shells(v.z);
      let out = atom(260, 164, element(v.z).symbol, "lab-fill-b", 22);
      distribution.forEach((count, index) => {
        const radius = 43 + index * 28;
        out += circle(260, 164, radius, "lab-orbit");
        for (let i = 0; i < count; i++) {
          const angle = (i * 2 * Math.PI) / count;
          out += circle(
            260 + radius * Math.cos(angle),
            164 + radius * Math.sin(angle),
            5,
            "lab-fill-a",
          );
        }
      });
      return (
        out +
        text(
          260,
          320,
          `Periode ${distribution.length} · Hauptgruppe ${element(v.z).group}`,
          "lab-text",
          "middle",
        )
      );
    }
    case "clouds": {
      let out = atom(260, 170, "Kern", "lab-fill-b", 28);
      clouds(v.valence).forEach((count, index) => {
        const a = Math.PI / 4 + (index * Math.PI) / 2;
        const x = 260 + Math.cos(a) * 100;
        const y = 170 + Math.sin(a) * 100;
        out +=
          circle(x, y, 54, "lab-soft-a") +
          text(
            x,
            y + 5,
            "↑".repeat(Math.min(1, count)) + (count === 2 ? "↓" : ""),
            "lab-text",
            "middle",
          );
      });
      return out;
    }
    case "ionic":
      return (
        dots(v.cations, 65, 75, `+${v.positive}`, "lab-fill-a", 3) +
        dots(v.anions, 325, 75, `−${v.negative}`, "lab-fill-b", 3) +
        text(260, 290, `Gesamtladungszahl: ${r.charge}`, "lab-text", "middle")
      );
    case "metal": {
      const conducts = r.conducts === "leitet";
      let out = rect(70, 50, 380, 225, "lab-panel", 'rx="15"');
      for (let i = 0; i < 18; i++) {
        const liquid = v.phase !== 0;
        const x = 110 + (i % 6) * 60 + (liquid ? Math.sin(i) * 12 : 0);
        const y = 90 + Math.floor(i / 6) * 65;
        out += atom(
          x,
          y,
          v.material === 0 ? "+" : i % 2 ? "−" : "+",
          i % 2 ? "lab-fill-b" : "lab-fill-a",
          17,
        );
        if (v.material === 0 && v.phase !== 2) out += circle(x + 20, y + 24, 4, "lab-fill-c");
      }
      return (
        out +
        text(
          260,
          320,
          conducts ? "Bewegliche Ladungsträger → Stromleitung" : String(r.conducts),
          "lab-text",
          "middle",
        )
      );
    }
    case "lewis":
    case "geometry": {
      const m = MOLECULES[v.molecule];
      let out = "";
      const terminals = m.domains;
      for (let i = 0; i < terminals; i++) {
        const angle =
          terminals === 2
            ? ((-90 + (i ? m.angle / 2 : -m.angle / 2)) * Math.PI) / 180
            : ((-90 + (i * 360) / terminals) * Math.PI) / 180;
        const tetraProjection = [
          [165, 90],
          [350, 95],
          [350, 245],
          [170, 250],
        ];
        const projection =
          m.formula === "CH₄"
            ? tetraProjection[i]
            : m.formula === "NH₃"
              ? [
                  [155, 195],
                  [350, 200],
                  [270, 280],
                ][i]
              : null;
        const x = projection?.[0] ?? 260 + Math.cos(angle) * 113;
        const y = projection?.[1] ?? 165 + Math.sin(angle) * 113;
        const bonds = terminals === 1 ? v.bonds : Math.max(1, Math.round(v.bonds / terminals));
        if (v.bonds > 0) {
          if (projection && i === terminals - 1) out += line(260, 165, x, y, "lab-dashed");
          else if (projection && i === terminals - 2)
            out += `<polygon points="260,165 ${x - 7},${y + 5} ${x + 7},${y - 5}" class="lab-side-a lab-arrowhead"/>`;
          else
            for (let j = 0; j < bonds; j++) {
              const length = Math.hypot(x - 260, y - 165);
              const offset = (j - (bonds - 1) / 2) * 6;
              const dx = (-(y - 165) / length) * offset;
              const dy = ((x - 260) / length) * offset;
              out += line(260 + dx, 165 + dy, x + dx, y + dy, "lab-side-a");
            }
        }
        out += atom(
          x,
          y,
          m.formula === "CO₂" || m.formula === "O₂" ? "O" : m.formula === "N₂" ? "N" : "H",
          "lab-fill-a",
          22,
        );
      }
      for (let i = 0; i < v.lone; i++) out += text(230 + i * 30, 118, "••", "lab-text", "middle");
      out += atom(260, 165, m.center, "lab-fill-b", 30);
      return (
        out +
        text(
          260,
          322,
          "Valenzstrichbild / räumliche Projektion · nicht maßstäblich",
          "lab-text-small",
          "middle",
        )
      );
    }
    case "polarity": {
      let out = "";
      for (const sign of [-1, 1]) {
        const a = ((-90 + (sign * v.angle) / 2) * Math.PI) / 180;
        const x = 260 + Math.cos(a) * 110;
        const y = 180 + Math.sin(a) * 110;
        out +=
          line(260, 180, x, y, "lab-side-a") +
          atom(x, y, v.difference ? "δ+" : "B", "lab-fill-a", 18);
        if (v.difference)
          out += arrow(
            260 + Math.cos(a) * 80,
            180 + Math.sin(a) * 80,
            260 + Math.cos(a) * 32,
            180 + Math.sin(a) * 32,
            "lab-side-b",
          );
      }
      return (
        out +
        arrow(260, 180, 260, 180 + Number(r.dipole) * 32, "lab-ok-stroke") +
        atom(260, 180, v.difference ? "δ−" : "A", "lab-fill-b", 25) +
        text(
          260,
          318,
          "Pfeile zur δ−-Seite · Grün: resultierender Dipol",
          "lab-text-small",
          "middle",
        )
      );
    }
    case "organic": {
      const h = hydrocarbon(v.carbon, v.bond + 1);
      let out = "";
      let nodes = "";
      for (let i = 0; i < v.carbon; i++) {
        if (i)
          for (let j = 0; j < (i === 1 ? v.bond + 1 : 1); j++)
            out += line(65 + (i - 1) * 73, 150 + j * 7, 65 + i * 73, 150 + j * 7, "lab-side-a");
        nodes += atom(65 + i * 73, 150, "C", "lab-fill-b", 22);
      }
      return (
        out +
        nodes +
        text(260, 245, h.formula, "lab-text lab-text-big", "middle") +
        text(
          260,
          295,
          "H-Atome ergänzen die Vierbindigkeit jedes C-Atoms.",
          "lab-text-small",
          "middle",
        )
      );
    }
    case "redox":
      return (
        dots(v.donor * v.dCount, 55, 85, "e⁻", "lab-fill-a", 3) +
        dots(v.acceptor * v.aCount, 340, 85, "e⁻", "lab-fill-b", 3) +
        arrow(210, 150, 310, 150, "lab-side-c") +
        text(260, 290, `Elektronenbilanz: ${r.balance}`, "lab-text", "middle")
      );
    case "oxidation":
      return (
        text(
          260,
          115,
          ["2 · (+I) + OZ(O)", "2 · (+I) + 2 · OZ(O)", "+I + OZ(H)"][v.compound],
          "lab-text lab-text-big",
          "middle",
        ) +
        text(260, 190, `Summe = ${r.sum}`, "lab-text lab-text-big", "middle") +
        text(260, 265, "Neutrale Verbindung: Summe muss null sein.", "lab-text", "middle")
      );
    case "salt-solution":
      return (
        arrow(130, 270, 130, 270 - v.lattice / 5, "lab-side-b") +
        arrow(370, 70, 370, 70 + v.hydration / 5, "lab-side-a") +
        text(130, 305, "Gitter trennen", "lab-text", "middle") +
        text(370, 305, "Hydrathüllen bilden", "lab-text", "middle") +
        text(260, 35, `Bilanz: ${r.delta} kJ/mol`, "lab-text", "middle")
      );
    case "cell":
    case "electrolysis":
      return (
        rect(75, 145, 370, 145, "lab-soft-a") +
        rect(100, 95, 30, 155, "lab-fill-b") +
        rect(390, 95, 30, 155, "lab-fill-c") +
        path("M115 95 V55 H405 V95", "lab-side-a") +
        atom(260, 55, v.mode === 2 ? "±" : v.mode === 1 ? "⚡" : "○", "lab-fill-a", 25) +
        (v.mode
          ? arrow(v.mode === 1 ? 145 : 375, 55, v.mode === 1 ? 375 : 145, 55, "lab-side-b") +
            text(260, 115, "e⁻ im äußeren Leiter", "lab-text-small", "middle")
          : "") +
        dots(6, 145, 180, "+", "lab-fill-b", 3) +
        dots(6, 300, 180, "−", "lab-fill-a", 3) +
        text(
          260,
          324,
          "In der Lösung wandern Ionen, keine freien Elektronen.",
          "lab-text-small",
          "middle",
        )
      );
    case "corrosion":
      return (
        atom(160, 150, ["Mg", "Zn", "Fe", "Cu"][v.metal], "lab-fill-b", 50) +
        atom(370, 150, ["Mg²⁺", "Zn²⁺", "Fe²⁺", "Cu²⁺"][v.ion], "lab-fill-a", 50) +
        (v.metal < v.ion
          ? arrow(220, 150, 310, 150, "lab-side-c") +
            text(260, 120, "Elektronen", "lab-text-small", "middle")
          : text(260, 150, "×", "lab-text lab-text-big", "middle")) +
        text(
          260,
          275,
          "Unedel → Elektronendonator; edlere Ionen → Akzeptor",
          "lab-text-small",
          "middle",
        )
      );
    case "indicator": {
      const hue = v.ph < 7 ? v.ph * 17 : 120 + (v.ph - 7) * 23;
      return (
        `<path d="M190 45 V120 L145 255 Q140 285 180 285 H340 Q380 285 375 255 L330 120 V45" class="lab-orbit"/>` +
        `<path d="M173 200 H347 L363 255 Q368 272 340 272 H180 Q152 272 157 255Z" fill="hsl(${hue} 65% 52%)" opacity=".8"/>` +
        text(260, 180, `pH ${v.ph}`, "lab-text lab-text-big", "middle") +
        text(260, 325, String(r.class), "lab-text", "middle")
      );
    }
    case "proton":
      return (
        atom(135, 155, v.case === 1 ? "H₂O" : v.case === 0 ? "HCl" : "Säure", "lab-fill-b", 45) +
        atom(385, 155, v.case === 1 ? "NH₃" : "H₂O", "lab-fill-a", 45) +
        arrow(195, 155, 325, 155, "lab-side-c") +
        atom(v.transferred ? 320 : 200, 115, "H⁺", "lab-fill-c", 22) +
        text(135, 255, "Donator", "lab-text", "middle") +
        text(385, 255, "Akzeptor", "lab-text", "middle")
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
