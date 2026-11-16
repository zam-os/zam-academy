/**
 * Labs of station 1, taken over from Biologie 5 Gymnasium: planning a fair
 * experiment (now in the terms of NT6: Variable, Konstante, Kontrollversuch)
 * and the light microscope. All values are model values for learning,
 * labelled as such in the readout where numbers appear.
 */
import { f1, label, labels, panel, svg } from "../figures/draw";
import {
  fmtDe,
  type LabDef,
  type LabState,
  num,
  str,
} from "./core";

/* ---------- Faires Experiment: Hefe, Wärme und Gas ---------- */

function balloon(temp: string, sugar: string): number {
  // Modell: Hefe bildet bei 35 °C etwa doppelt so viel Gas wie bei 20 °C,
  // mit doppelter Zuckermenge etwas mehr. Nur zur Veranschaulichung.
  return (temp === "35" ? 2 : 1) * (sugar === "2" ? 1.5 : 1);
}

function flask(
  x: number,
  title: string,
  temp: string,
  sugar: string,
  size: number,
  yeast: boolean,
): string {
  const r = 8 + size * 9;
  const spoons = Number(sugar);
  return `${panel(x, 14, 150, 206, "panel-bg")}
    ${label(x + 75, 36, title, "lbl strong", "middle")}
    <rect x="${x + 14}" y="150" width="122" height="52" rx="8" fill="${temp === "35" ? "var(--f-orange)" : "var(--f-sky)"}" opacity="0.55"/>
    ${label(x + 75, 196, `Wasserbad ${temp} °C`, "lbl small", "middle")}
    <path d="M${x + 66} 118 L${x + 66} 104 L${x + 84} 104 L${x + 84} 118 L${x + 106} 176 L${x + 44} 176 Z" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/>
    <path d="M${x + 52} 158 L${x + 98} 158 L${x + 106} 176 L${x + 44} 176 Z" fill="${yeast ? "#d8b46a" : "var(--f-sky)"}" opacity="0.9"/>
    <ellipse cx="${x + 75}" cy="${f1(100 - r)}" rx="${f1(r * 0.85)}" ry="${f1(r)}" fill="${yeast ? "var(--f-red)" : "var(--f-stone)"}" opacity="0.8" stroke="var(--f-ink)"/>
    ${label(x + 75, 56, yeast ? `Hefe + ${spoons} Löffel Zucker` : "ohne Hefe", "lbl small", "middle")}`;
}

export const fairTest: LabDef = {
  title: "Faires Experiment",
  prompt:
    "Frage: Bildet Hefe bei Wärme mehr Gas? Plane die Ansätze so, dass nur ein Faktor den Unterschied erklären kann.",
  init: () => ({
    tempA: "20",
    tempB: "20",
    sugarA: "1",
    sugarB: "2",
    control: false,
    repeats: 1,
  }),
  controls: () => [
    {
      type: "choice",
      key: "tempA",
      label: "Ansatz A · Temperatur",
      options: [
        { value: "20", label: "20 °C" },
        { value: "35", label: "35 °C" },
      ],
    },
    {
      type: "choice",
      key: "sugarA",
      label: "Ansatz A · Zucker",
      options: [
        { value: "1", label: "1 Löffel" },
        { value: "2", label: "2 Löffel" },
      ],
    },
    {
      type: "choice",
      key: "tempB",
      label: "Ansatz B · Temperatur",
      options: [
        { value: "20", label: "20 °C" },
        { value: "35", label: "35 °C" },
      ],
    },
    {
      type: "choice",
      key: "sugarB",
      label: "Ansatz B · Zucker",
      options: [
        { value: "1", label: "1 Löffel" },
        { value: "2", label: "2 Löffel" },
      ],
    },
    {
      type: "toggle",
      key: "control",
      label: "Kontrollversuch ohne Hefe dazustellen",
    },
    {
      type: "range",
      key: "repeats",
      label: "Wiederholungen je Ansatz",
      min: 1,
      max: 5,
      step: 1,
      format: (v) => `${fmtDe(v)}-mal`,
    },
  ],
  goals: (s) => [
    {
      text: "Nur die Temperatur ist die Variable, die Zuckermenge bleibt konstant",
      met: str(s, "tempA") !== str(s, "tempB") && str(s, "sugarA") === str(s, "sugarB"),
    },
    {
      text: "Einen Kontrollversuch ohne Hefe einplanen",
      met: s.control === true,
    },
    {
      text: "Jeden Ansatz mindestens dreimal durchführen",
      met: num(s, "repeats") >= 3,
    },
  ],
  draw: (s) =>
    svg(
      500,
      232,
      "Versuchsaufbau mit Gärröhrchen: zwei Kolben mit Hefe und Zucker im Wasserbad, Luftballons zeigen die Gasmenge",
      `${flask(8, "Ansatz A", str(s, "tempA"), str(s, "sugarA"), balloon(str(s, "tempA"), str(s, "sugarA")), true)}
       ${flask(170, "Ansatz B", str(s, "tempB"), str(s, "sugarB"), balloon(str(s, "tempB"), str(s, "sugarB")), true)}
       ${s.control ? flask(332, "Kontrolle", str(s, "tempB"), str(s, "sugarB"), 0, false) : `${panel(332, 14, 150, 206, "panel-bg")}${labels(407, 110, "Kein\nKontrollversuch", "lbl small muted", "middle", 16)}`}`,
    ),
  readout: (s) => {
    const tempDiff = str(s, "tempA") !== str(s, "tempB");
    const sugarDiff = str(s, "sugarA") !== str(s, "sugarB");
    const verdict =
      tempDiff && sugarDiff
        ? "Temperatur und Zucker sind beide verändert: Mit zwei Variablen weißt du nicht, welche den Unterschied verursacht."
        : tempDiff
          ? "Nur die Temperatur ist die Variable, der Zucker ist eine Konstante: Ein Unterschied bei den Ballons lässt sich auf die Wärme zurückführen."
          : sugarDiff
            ? "Nur die Zuckermenge ist die Variable: So prüfst du den Zucker, nicht die Wärme."
            : "Beide Ansätze sind gleich: Es gibt keine Variable, deren Wirkung du vergleichen kannst.";
    const reps = num(s, "repeats");
    return `${verdict} ${reps < 3 ? "Ein einzelner Durchgang kann durch einen Zufall oder Fehler verfälscht sein." : `${fmtDe(reps)} Durchgänge machen das Ergebnis verlässlicher.`} (Modell, keine Messwerte)`;
  },
};

/* ---------- Lichtmikroskop ---------- */

const TARGET: Record<string, number> = { "4": 40, "10": 48, "40": 52 };
const TOLERANCE: Record<string, number> = { "4": 8, "10": 5, "40": 3 };

export function microscopeView(s: LabState) {
  const objective = str(s, "objective");
  const total = 10 * Number(objective);
  const offset = Math.abs(num(s, "focus") - TARGET[objective]);
  const sharp = offset <= TOLERANCE[objective];
  const needLight = objective === "40" ? 60 : objective === "10" ? 35 : 20;
  const brightEnough = num(s, "light") >= needLight;
  return { objective, total, offset, sharp, brightEnough };
}

export const microscope: LabDef = {
  title: "Lichtmikroskop",
  prompt:
    "Betrachte Zwiebelhaut. Beginne mit dem kleinsten Objektiv, stelle scharf und wechsle erst dann zur stärkeren Vergrößerung.",
  init: () => ({ objective: "4", focus: 10, light: 30 }),
  controls: () => [
    {
      type: "choice",
      key: "objective",
      label: "Objektiv am Revolver",
      options: [
        { value: "4", label: "4-fach" },
        { value: "10", label: "10-fach" },
        { value: "40", label: "40-fach" },
      ],
    },
    {
      type: "range",
      key: "focus",
      label: "Fein- und Grobtrieb",
      min: 0,
      max: 100,
      step: 1,
      format: (v) => `Stellung ${fmtDe(v)}`,
    },
    {
      type: "range",
      key: "light",
      label: "Blende und Lampe",
      min: 0,
      max: 100,
      step: 5,
      format: (v) => `${fmtDe(v)} % Helligkeit`,
    },
  ],
  goals: (s) => {
    const v = microscopeView(s);
    return [
      {
        text: "Mit dem 4-fach-Objektiv (40-fache Vergrößerung) ein scharfes Bild einstellen",
        met: v.objective === "4" && v.sharp,
      },
      {
        text: "Bei 100-facher Gesamtvergrößerung scharf stellen",
        met: v.objective === "10" && v.sharp,
      },
      {
        text: "Bei 400-facher Vergrößerung Zellkerne scharf und hell genug sehen",
        met: v.objective === "40" && v.sharp && v.brightEnough,
      },
    ];
  },
  draw: (s) => {
    const v = microscopeView(s);
    const cellW = v.total === 40 ? 26 : v.total === 100 ? 64 : 240;
    const cellH = cellW * 0.38;
    const blur = v.sharp ? 0 : Math.min(6, 1 + (v.offset / TOLERANCE[v.objective]) * 0.9);
    const dim = v.brightEnough ? 0 : 0.55;
    const cx = 360;
    const cy = 120;
    const rows: string[] = [];
    for (let row = -6; row <= 6; row++) {
      const shift = (row % 2) * cellW * 0.5;
      for (let col = -6; col <= 6; col++) {
        const x = cx + col * cellW + shift - cellW / 2;
        const y = cy + row * cellH - cellH / 2;
        if (Math.abs(x - cx) > 110 + cellW || Math.abs(y - cy) > 110 + cellH) continue;
        rows.push(
          `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(cellW)}" height="${f1(cellH)}" fill="#f6eecf" stroke="#b28a3a" stroke-width="${f1(Math.max(1, cellW / 40))}"/><ellipse cx="${f1(x + cellW * 0.32)}" cy="${f1(y + cellH * 0.5)}" rx="${f1(cellW * 0.07)}" ry="${f1(cellH * 0.2)}" fill="#8d5a2b"/>`,
        );
      }
    }
    return svg(
      520,
      240,
      `Lichtmikroskop mit ${v.total}-facher Gesamtvergrößerung, Bild ${v.sharp ? "scharf" : "unscharf"}`,
      `<defs><clipPath id="mic-view"><circle cx="${cx}" cy="${cy}" r="104"/></clipPath><filter id="mic-blur"><feGaussianBlur stdDeviation="${f1(blur)}"/></filter></defs>
       ${panel(8, 8, 200, 224, "panel-bg")}
       <rect x="74" y="200" width="100" height="16" rx="5" fill="var(--f-line)"/>
       <path d="M150 200 L150 112 Q150 92 132 86 L118 82" fill="none" stroke="var(--f-line)" stroke-width="14" stroke-linecap="round"/>
       <rect x="90" y="40" width="22" height="70" rx="5" fill="var(--f-ink)" opacity="0.85" transform="rotate(-12 101 75)"/>
       <rect x="88" y="24" width="18" height="22" rx="4" fill="var(--f-blue)" transform="rotate(-12 97 35)"/>
       <rect x="${v.objective === "40" ? 104 : v.objective === "10" ? 100 : 96}" y="112" width="10" height="${v.objective === "40" ? 26 : v.objective === "10" ? 20 : 14}" rx="3" fill="var(--f-orange)"/>
       <rect x="70" y="150" width="76" height="8" rx="3" fill="var(--f-stone)"/>
       <circle cx="108" cy="182" r="7" fill="${v.brightEnough ? "var(--f-yellow)" : "var(--f-stone)"}" stroke="var(--f-ink)"/>
       <circle cx="160" cy="150" r="9" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/>
       ${label(16, 34, "Okular 10×", "lbl tiny", "start")}
       ${label(16, 130, `Objektiv ${v.objective}×`, "lbl tiny", "start")}
       ${label(16, 164, "Objekttisch", "lbl tiny", "start")}
       ${label(16, 190, "Lampe", "lbl tiny", "start")}
       ${label(172, 140, "Trieb", "lbl tiny", "start")}
       <circle cx="${cx}" cy="${cy}" r="108" fill="#20201c"/>
       <g clip-path="url(#mic-view)"><rect x="${cx - 110}" y="${cy - 110}" width="220" height="220" fill="#fbf5df"/><g filter="url(#mic-blur)">${rows.join("")}</g><rect x="${cx - 110}" y="${cy - 110}" width="220" height="220" fill="#000" opacity="${dim}"/></g>
       ${label(cx, 236, `${v.total}-fach · ${v.sharp ? "scharf" : "unscharf"}${v.brightEnough ? "" : " · zu dunkel"}`, "lbl small strong", "middle")}`,
    );
  },
  readout: (s) => {
    const v = microscopeView(s);
    const focusHint = v.sharp
      ? "Das Bild ist scharf."
      : num(s, "focus") < TARGET[v.objective]
        ? "Unscharf: Drehe den Trieb weiter auf."
        : "Unscharf: Drehe den Trieb ein Stück zurück.";
    return `Gesamtvergrößerung = Okular 10 · Objektiv ${v.objective} = ${v.total}-fach. ${focusHint}${v.brightEnough ? "" : " Für diese Vergrößerung brauchst du mehr Licht."}`;
  },
};

