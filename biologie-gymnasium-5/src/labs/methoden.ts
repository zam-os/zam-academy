/**
 * Labs of station 1 and 2: planning a fair experiment, detection tests,
 * the light microscope and the cell. All values are model values for
 * learning, labelled as such in the readout where numbers appear.
 */
import { f1, label, labels, panel, svg } from "../figures/draw";
import {
  fmtDe,
  type LabDef,
  type LabState,
  num,
  remember,
  seen,
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
      label: "Kontrollansatz ohne Hefe dazustellen",
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
      text: "Nur die Temperatur unterscheidet A und B, die Zuckermenge ist gleich",
      met: str(s, "tempA") !== str(s, "tempB") && str(s, "sugarA") === str(s, "sugarB"),
    },
    {
      text: "Einen Kontrollansatz ohne Hefe einplanen",
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
       ${s.control ? flask(332, "Kontrolle", str(s, "tempB"), str(s, "sugarB"), 0, false) : `${panel(332, 14, 150, 206, "panel-bg")}${labels(407, 110, "Kein\nKontrollansatz", "lbl small muted", "middle", 16)}`}`,
    ),
  readout: (s) => {
    const tempDiff = str(s, "tempA") !== str(s, "tempB");
    const sugarDiff = str(s, "sugarA") !== str(s, "sugarB");
    const verdict =
      tempDiff && sugarDiff
        ? "Temperatur und Zucker unterscheiden sich: Du weißt nicht, welcher Faktor den Unterschied verursacht."
        : tempDiff
          ? "Nur die Temperatur unterscheidet sich: Ein Unterschied bei den Ballons lässt sich auf die Wärme zurückführen."
          : sugarDiff
            ? "Nur die Zuckermenge unterscheidet sich: So prüfst du den Zucker, nicht die Wärme."
            : "Beide Ansätze sind gleich: Es gibt keinen Faktor, dessen Wirkung du vergleichen kannst.";
    const reps = num(s, "repeats");
    return `${verdict} ${reps < 3 ? "Ein einzelner Durchgang kann durch einen Zufall oder Fehler verfälscht sein." : `${fmtDe(reps)} Durchgänge machen das Ergebnis verlässlicher.`} (Modell, keine Messwerte)`;
  },
};

/* ---------- Nachweisreaktionen ---------- */

const SAMPLES: Array<{ value: string; label: string; gas: boolean }> = [
  { value: "kartoffel", label: "Kartoffelscheibe", gas: false },
  { value: "walnuss", label: "Walnuss", gas: false },
  { value: "oel", label: "Speiseöl", gas: false },
  { value: "traubenzucker", label: "Traubenzucker", gas: false },
  { value: "ausatemluft", label: "Ausatemluft", gas: true },
  { value: "raumluft", label: "Raumluft", gas: true },
];

type Result = { text: string; colour: string; positive: boolean };

export function nachweisResult(sample: string, test: string): Result {
  const gas = SAMPLES.find((x) => x.value === sample)?.gas ?? false;
  const neutral = "var(--f-stone)";
  if (test === "kalkwasser") {
    if (!gas)
      return {
        text: "Kalkwasser prüft Gase auf Kohlenstoffdioxid. Wähle Ausatemluft oder Raumluft.",
        colour: neutral,
        positive: false,
      };
    return sample === "ausatemluft"
      ? {
          text: "Das Kalkwasser wird milchig trüb: Die Ausatemluft enthält viel Kohlenstoffdioxid.",
          colour: "#e9e6dc",
          positive: true,
        }
      : {
          text: "Das Kalkwasser bleibt in derselben Zeit fast klar: Raumluft enthält nur sehr wenig Kohlenstoffdioxid.",
          colour: "var(--f-sky)",
          positive: false,
        };
  }
  if (gas)
    return {
      text: "Diese Probe ist ein Gas. Iod-Kaliumiodid-Lösung und Fettfleckprobe prüfen feste oder flüssige Proben.",
      colour: neutral,
      positive: false,
    };
  if (test === "iod")
    return sample === "kartoffel"
      ? {
          text: "Die braune Iod-Kaliumiodid-Lösung färbt sich blauschwarz: Die Kartoffel enthält Stärke.",
          colour: "#1f2347",
          positive: true,
        }
      : {
          text:
            sample === "traubenzucker"
              ? "Die Lösung bleibt braun: Traubenzucker ist ein Zucker, aber keine Stärke."
              : "Die Lösung bleibt braun: Hier ist kaum oder keine Stärke nachweisbar.",
          colour: "#a5641c",
          positive: false,
        };
  return sample === "walnuss" || sample === "oel"
    ? {
        text: "Nach dem Trocknen bleibt ein durchscheinender Fleck auf dem Papier: Die Probe enthält Fett.",
        colour: "#f2d98c",
        positive: true,
      }
    : {
        text: "Der feuchte Fleck verschwindet beim Trocknen: Er stammt von Wasser, nicht von Fett.",
        colour: "var(--f-white)",
        positive: false,
      };
}

export const nachweis: LabDef = {
  title: "Nachweisreaktionen",
  prompt:
    "Wähle eine Probe und einen Nachweis. Ein Nachweis zeigt nur den Stoff, für den er gedacht ist.",
  init: () => ({ sample: "traubenzucker", test: "iod", tested: "" }),
  controls: () => [
    {
      type: "choice",
      key: "sample",
      label: "Probe",
      options: SAMPLES.map(({ value, label }) => ({ value, label })),
    },
    {
      type: "choice",
      key: "test",
      label: "Nachweis",
      options: [
        { value: "iod", label: "Iod-Kaliumiodid-Lösung" },
        { value: "fettfleck", label: "Fettfleckprobe" },
        { value: "kalkwasser", label: "Kalkwasserprobe" },
      ],
    },
  ],
  set: (s, key, value) => {
    s[key] = value;
    remember(s, "tested", `${str(s, "sample")}:${str(s, "test")}`);
  },
  goals: (s) => [
    {
      text: "Stärke in einem Lebensmittel nachweisen",
      met: seen(s, "tested", "kartoffel:iod"),
    },
    {
      text: "Fett mit der Fettfleckprobe nachweisen",
      met: seen(s, "tested", "walnuss:fettfleck") || seen(s, "tested", "oel:fettfleck"),
    },
    {
      text: "Ausatemluft und Raumluft mit Kalkwasser vergleichen",
      met:
        seen(s, "tested", "ausatemluft:kalkwasser") &&
        seen(s, "tested", "raumluft:kalkwasser"),
    },
  ],
  draw: (s) => {
    const sample = str(s, "sample");
    const test = str(s, "test");
    const result = nachweisResult(sample, test);
    const sampleLabel = SAMPLES.find((x) => x.value === sample)!.label;
    const vessel =
      test === "fettfleck"
        ? `<rect x="250" y="70" width="170" height="120" rx="6" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/>
           <ellipse cx="335" cy="130" rx="38" ry="26" fill="${result.colour}" opacity="${result.positive ? 0.95 : 0.35}" stroke="var(--f-line)" stroke-dasharray="${result.positive ? "0" : "4 3"}"/>
           ${label(335, 210, "Filterpapier gegen das Licht", "lbl small", "middle")}`
        : `<path d="M310 52 L310 176 Q310 200 335 200 Q360 200 360 176 L360 52" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/>
           <path d="M312 110 L312 176 Q312 198 335 198 Q358 198 358 176 L358 110 Z" fill="${result.colour}" opacity="0.92"/>
           ${test === "kalkwasser" ? `<line x1="335" y1="30" x2="335" y2="170" stroke="var(--f-line)" stroke-width="5" stroke-linecap="round"/>${label(386, 40, sample === "raumluft" ? "Pumpe" : "Strohhalm", "lbl small", "start")}` : ""}
           ${label(335, 222, test === "kalkwasser" ? "Kalkwasser" : "Probe mit Iod-Kaliumiodid-Lösung", "lbl small", "middle")}`;
    return svg(
      500,
      232,
      `Nachweis: ${sampleLabel} mit ${test === "iod" ? "Iod-Kaliumiodid-Lösung" : test === "fettfleck" ? "Fettfleckprobe" : "Kalkwasser"}, Ergebnis ${result.positive ? "positiv" : "negativ"}`,
      `${panel(8, 8, 484, 216, "panel-bg")}
       ${label(30, 40, "Probe", "lbl small muted", "start")}
       ${label(30, 64, sampleLabel, "lbl strong", "start")}
       <circle cx="90" cy="130" r="${SAMPLES.find((x) => x.value === sample)!.gas ? 34 : 30}" fill="${sample === "kartoffel" ? "#f1d98a" : sample === "walnuss" ? "#a87444" : sample === "oel" ? "#f2c94c" : sample === "traubenzucker" ? "var(--f-white)" : "var(--f-sky)"}" stroke="var(--f-ink)" stroke-width="2" ${SAMPLES.find((x) => x.value === sample)!.gas ? 'stroke-dasharray="5 4"' : ""}/>
       ${vessel}
       <rect x="150" y="108" width="80" height="34" rx="17" fill="${result.positive ? "var(--f-green)" : "var(--f-stone)"}"/>
       ${label(190, 130, result.positive ? "positiv" : "negativ", "lbl small on-dark", "middle")}`,
    );
  },
  readout: (s) => nachweisResult(str(s, "sample"), str(s, "test")).text,
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

/* ---------- Tier- und Pflanzenzelle ---------- */

export const CELL_PARTS: Record<
  string,
  { name: string; text: string; plantOnly: boolean }
> = {
  membran: {
    name: "Zellmembran",
    text: "Die dünne Zellmembran grenzt die Zelle ab und regelt, welche Stoffe hinein- und hinausgelangen.",
    plantOnly: false,
  },
  plasma: {
    name: "Zellplasma",
    text: "Das Zellplasma füllt die Zelle aus. In ihm laufen viele Stoffwechselvorgänge ab.",
    plantOnly: false,
  },
  kern: {
    name: "Zellkern",
    text: "Der Zellkern ist die Steuerzentrale. Er enthält die Erbinformation.",
    plantOnly: false,
  },
  wand: {
    name: "Zellwand",
    text: "Die feste Zellwand liegt außen um die Zellmembran und gibt der Pflanzenzelle Form und Halt.",
    plantOnly: true,
  },
  chloroplast: {
    name: "Chloroplasten",
    text: "In den grünen Chloroplasten stellt die Pflanze mithilfe von Licht Nährstoffe her.",
    plantOnly: true,
  },
  vakuole: {
    name: "Vakuole",
    text: "Die große Vakuole ist ein Zellsaftraum. Sie speichert Wasser und gelöste Stoffe und hält die Zelle prall.",
    plantOnly: true,
  },
};

export const cell: LabDef = {
  title: "Tierzelle und Pflanzenzelle",
  prompt:
    "Wähle einen Zelltyp und tippe auf einen Zellbestandteil. Welche Bestandteile hat nur die Pflanzenzelle?",
  init: () => ({ celltype: "tier", part: "", found: "" }),
  controls: () => [
    {
      type: "choice",
      key: "celltype",
      label: "Zelltyp",
      options: [
        { value: "tier", label: "Tierzelle (Mundschleimhaut)" },
        { value: "pflanze", label: "Pflanzenzelle (Wasserpest)" },
      ],
    },
    {
      type: "actions",
      key: "part",
      label: "Zellbestandteil zeigen",
      options: Object.entries(CELL_PARTS).map(([value, part]) => ({
        value,
        label: part.name,
      })),
    },
  ],
  set: (s, key, value) => {
    if (key === "celltype") {
      s.celltype = value;
      s.part = "";
      return;
    }
    s.part = value;
    const part = CELL_PARTS[String(value)];
    if (part && !(part.plantOnly && s.celltype === "tier"))
      remember(s, "found", `${str(s, "celltype")}:${value}`);
  },
  goals: (s) => [
    {
      text: "In der Pflanzenzelle Zellwand, Chloroplasten und Vakuole finden",
      met: ["wand", "chloroplast", "vakuole"].every((p) =>
        seen(s, "found", `pflanze:${p}`),
      ),
    },
    {
      text: "In der Tierzelle den Zellkern finden",
      met: seen(s, "found", "tier:kern"),
    },
    {
      text: "Die Zellmembran in beiden Zelltypen finden",
      met: seen(s, "found", "tier:membran") && seen(s, "found", "pflanze:membran"),
    },
  ],
  draw: (s) => {
    const plant = s.celltype === "pflanze";
    const part = str(s, "part");
    const hi = (p: string) =>
      part === p ? 'stroke="var(--f-red)" stroke-width="4"' : "";
    const body = plant
      ? `<rect x="60" y="30" width="300" height="180" rx="10" fill="#cfe8b0" stroke="${part === "wand" ? "var(--f-red)" : "#4e7d2c"}" stroke-width="10"/>
         <rect x="70" y="40" width="280" height="160" rx="7" fill="${part === "plasma" ? "#fff0a8" : "#e9f5d6"}" stroke="${part === "membran" ? "var(--f-red)" : "#6a9a3a"}" stroke-width="${part === "membran" ? 4 : 2}"/>
         <rect x="120" y="62" width="170" height="116" rx="40" fill="#d8eef7" opacity="0.95" ${hi("vakuole")} ${part === "vakuole" ? "" : 'stroke="#8bb7c9" stroke-width="1.5"'}/>
         ${[[88, 58], [98, 172], [318, 62], [330, 160], [300, 186], [86, 120], [200, 188]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="12" ry="7" fill="var(--f-green)" ${hi("chloroplast")}/>`).join("")}
         <circle cx="322" cy="112" r="20" fill="#b39ddb" ${hi("kern")}/>`
      : `<path d="M90 120 C 80 60, 180 30, 240 46 C 320 60, 360 110, 330 170 C 300 220, 160 214, 120 190 C 96 176, 94 150, 90 120 Z" fill="${part === "plasma" ? "#fff0a8" : "#fbe1df"}" stroke="${part === "membran" ? "var(--f-red)" : "#c0605a"}" stroke-width="${part === "membran" ? 4 : 2}"/>
         <circle cx="214" cy="122" r="26" fill="#b39ddb" ${hi("kern")}/>`;
    const info = CELL_PARTS[part];
    const missing = info && info.plantOnly && !plant;
    return svg(
      560,
      240,
      `${plant ? "Pflanzenzelle" : "Tierzelle"} im Schema${info ? `, hervorgehoben: ${info.name}` : ""}`,
      `${panel(8, 8, 380, 224, "panel-bg")}${body}
       ${panel(396, 8, 156, 224, "panel-bg")}
       ${label(474, 34, plant ? "Pflanzenzelle" : "Tierzelle", "lbl strong", "middle")}
       ${labels(406, 62, plant ? "Zellwand ✓\nZellmembran ✓\nZellplasma ✓\nZellkern ✓\nChloroplasten ✓\nVakuole ✓" : "Zellwand –\nZellmembran ✓\nZellplasma ✓\nZellkern ✓\nChloroplasten –\nVakuole –", "lbl small", "start", 22)}
       ${missing ? labels(474, 208, "fehlt in\nder Tierzelle", "lbl small strong", "middle", 15) : ""}`,
    );
  },
  readout: (s) => {
    const info = CELL_PARTS[str(s, "part")];
    if (!info) return "Tippe auf einen Zellbestandteil, um seine Aufgabe zu sehen.";
    if (info.plantOnly && s.celltype === "tier")
      return `${info.name}: In einer Tierzelle gibt es diesen Bestandteil nicht. Wechsle zur Pflanzenzelle.`;
    return `${info.name}: ${info.text}`;
  },
};
