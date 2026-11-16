/**
 * Labs of stations 4 to 9 (NT6 1.3 to 1.5): body shape and water
 * resistance, body temperature of a lizard and a mouse, the metamorphosis
 * of the common frog, echolocation of a bat, a dichotomous key for the
 * vertebrate classes and a pond food web. Every number is a model value
 * for learning; the readouts say so.
 */
import { arrow, f1, label, labels, panel, svg } from "../figures/draw";
import {
  fmtDe,
  type LabDef,
  type LabState,
  num,
  remember,
  seen,
  str,
} from "./core";

/* ---------- Körperform und Wasserwiderstand ---------- */

/** Rounded model shape factors: only their ratio matters here. */
export const SHAPES: Record<string, { name: string; factor: number; example: string }> = {
  spindel: { name: "Spindelform", factor: 0.05, example: "wie Forelle, Pinguin und Delfin" },
  kugel: { name: "Kugel", factor: 0.5, example: "wie ein Ball" },
  wuerfel: { name: "Würfel", factor: 1, example: "wie eine Kiste" },
  platte: { name: "Platte quer", factor: 1.2, example: "wie ein Brett, das quer durchs Wasser gezogen wird" },
};

/** Model water resistance in relative units: shape factor · speed². */
export const resistance = (shape: string, speed: number): number =>
  SHAPES[shape].factor * speed * speed;

export const streamline: LabDef = {
  title: "Form und Wasserwiderstand",
  prompt:
    "Ziehe verschiedene Körper gleicher Größe durchs Wasser. Welche Form bremst am wenigsten, und was ändert die Geschwindigkeit?",
  init: () => ({ shape: "wuerfel", speed: 3, shapes: "", slow: false, fast: false }),
  controls: () => [
    {
      type: "choice",
      key: "shape",
      label: "Körperform",
      options: Object.entries(SHAPES).map(([value, f]) => ({ value, label: f.name })),
    },
    {
      type: "range",
      key: "speed",
      label: "Geschwindigkeit",
      min: 1,
      max: 5,
      step: 1,
      format: (v) => ["", "sehr langsam", "langsam", "mittel", "schnell", "sehr schnell"][v] ?? "",
    },
  ],
  set: (s, key, value) => {
    s[key] = value;
    remember(s, "shapes", str(s, "shape"));
    if (num(s, "speed") <= 1) s.slow = true;
    if (num(s, "speed") >= 5) s.fast = true;
  },
  goals: (s) => [
    { text: "Die Form mit dem geringsten Widerstand finden", met: str(s, "shape") === "spindel" },
    {
      text: "Alle vier Formen ausprobieren",
      met: Object.keys(SHAPES).every((k) => seen(s, "shapes", k)),
    },
    { text: "Sehr langsam und sehr schnell vergleichen", met: s.slow === true && s.fast === true },
  ],
  draw: (s) => {
    const shape = str(s, "shape");
    const speed = num(s, "speed");
    const r = resistance(shape, speed);
    const max = resistance("platte", 5);
    const bar = Math.max(4, (r / max) * 300);
    const body =
      shape === "spindel"
        ? `<path d="M150 110 Q200 82 260 104 Q270 110 260 116 Q200 138 150 110 Z" fill="var(--f-blue)" stroke="var(--f-ink)"/><path d="M152 110 L132 96 L136 110 L132 124 Z" fill="var(--f-blue)" stroke="var(--f-ink)"/>`
        : shape === "kugel"
          ? `<circle cx="210" cy="110" r="28" fill="var(--f-orange)" stroke="var(--f-ink)"/>`
          : shape === "wuerfel"
            ? `<rect x="184" y="84" width="52" height="52" fill="var(--f-purple)" stroke="var(--f-ink)"/>`
            : `<rect x="202" y="70" width="14" height="80" fill="var(--f-red)" stroke="var(--f-ink)"/>`;
    const swirls =
      shape === "spindel"
        ? ""
        : Array.from({ length: Math.min(6, Math.ceil(SHAPES[shape].factor * speed)) }, (_, i) => `<path d="M${120 - i * 14} ${96 + (i % 2) * 28} q-10 -8 -18 0 q8 8 18 0" fill="none" stroke="var(--f-river)" stroke-width="1.5"/>`).join("");
    return svg(
      560,
      240,
      `${SHAPES[shape].name} bei Geschwindigkeit ${speed} von 5: Wasserwiderstand ${fmtDe(r, 2)} Modelleinheiten`,
      `${panel(8, 8, 544, 224, "panel-bg")}
       <rect x="20" y="40" width="520" height="140" rx="8" fill="var(--f-sea)" opacity="0.5"/>
       ${Array.from({ length: speed }, (_, i) => arrow(300 + i * 4, 60 + i * 24, 400 + i * 20, 60 + i * 24)).join("")}
       ${swirls}
       ${body}
       ${label(470, 34, "Strömung", "lbl tiny", "middle")}
       ${label(24, 202, "Widerstand", "lbl tiny strong", "start")}
       <rect x="100" y="192" width="${f1(bar)}" height="16" rx="4" fill="var(--f-red)"/>
       ${label(110 + bar, 205, `${fmtDe(r, 2)}`, "lbl tiny strong", "start")}`,
    );
  },
  readout: (s) => {
    const shape = str(s, "shape");
    const speed = num(s, "speed");
    return `${SHAPES[shape].name} (${SHAPES[shape].example}): Widerstand ${fmtDe(resistance(shape, speed), 2)} Modelleinheiten. Je schneller ein Körper schwimmt, desto stärker bremst ihn das Wasser; die Spindelform bremst bei gleicher Größe am wenigsten. (Modell mit gerundeten Formfaktoren)`;
  },
};

/* ---------- Körpertemperatur: Eidechse und Maus ---------- */

export interface ThermoResult {
  body: number;
  activity: string;
  /** Relative food demand of the animal, 1 = at 30 °C. */
  demand: number;
}

export function thermo(animal: string, outside: number): ThermoResult {
  if (animal === "eidechse") {
    const activity =
      outside <= 5 ? "Kältestarre: bewegungslos im Versteck" : outside < 20 ? "träge und langsam" : "flink und voll aktiv";
    return { body: outside, activity, demand: Math.max(0.05, outside / 30) * 0.1 };
  }
  return { body: 37, activity: "aktiv", demand: 1 + (30 - outside) / 25 };
}

export const thermoLab: LabDef = {
  title: "Wechselwarm und gleichwarm",
  prompt:
    "Verändere die Außentemperatur. Beobachte Körpertemperatur, Aktivität und Nahrungsbedarf einer Zauneidechse und einer Hausmaus.",
  init: () => ({ animal: "eidechse", outside: 15 }),
  controls: () => [
    {
      type: "choice",
      key: "animal",
      label: "Tier",
      options: [
        { value: "eidechse", label: "Zauneidechse" },
        { value: "maus", label: "Hausmaus" },
      ],
    },
    {
      type: "range",
      key: "outside",
      label: "Außentemperatur",
      min: 0,
      max: 35,
      step: 5,
      format: (v) => `${fmtDe(v)} °C`,
    },
  ],
  goals: (s) => [
    { text: "Die Eidechse in Kältestarre fallen lassen", met: str(s, "animal") === "eidechse" && num(s, "outside") <= 5 },
    { text: "Die Eidechse bei Wärme voll aktiv sehen", met: str(s, "animal") === "eidechse" && num(s, "outside") >= 25 },
    { text: "Die Maus bei 0 °C aktiv sehen und ihren Nahrungsbedarf ablesen", met: str(s, "animal") === "maus" && num(s, "outside") <= 0 },
  ],
  draw: (s) => {
    const animal = str(s, "animal");
    const outside = num(s, "outside");
    const r = thermo(animal, outside);
    const thermometer = (x: number, value: number, title: string) => {
      const h = ((value + 5) / 45) * 140;
      return `<rect x="${x}" y="40" width="16" height="150" rx="8" fill="var(--f-white)" stroke="var(--f-ink)"/><rect x="${x + 4}" y="${f1(186 - h)}" width="8" height="${f1(h)}" fill="var(--f-red)"/><circle cx="${x + 8}" cy="194" r="10" fill="var(--f-red)"/>${labels(x + 8, 216, `${title}\n${fmtDe(value)} °C`, "lbl tiny", "middle", 13)}`;
    };
    const creature =
      animal === "eidechse"
        ? `<path d="M250 140 Q290 120 340 136 Q360 140 380 138 L420 150 L380 146 Q350 154 320 150 Q280 156 250 140 Z" fill="var(--f-green)" stroke="var(--f-ink)"/><circle cx="262" cy="136" r="2" fill="var(--f-ink)"/>${[280, 330].map((x) => `<line x1="${x}" y1="146" x2="${x - 8}" y2="162" stroke="var(--f-ink)" stroke-width="3"/>`).join("")}`
        : `<ellipse cx="320" cy="140" rx="40" ry="22" fill="#9e9e9e" stroke="var(--f-ink)"/><circle cx="282" cy="124" r="10" fill="#bdbdbd" stroke="var(--f-ink)"/><circle cx="272" cy="134" r="2" fill="var(--f-ink)"/><path d="M360 146 Q400 160 420 140" fill="none" stroke="#9e9e9e" stroke-width="3"/>`;
    const frozen = animal === "eidechse" && outside <= 5 ? `${label(330, 100, "❄ starr", "lbl small strong", "middle")}` : "";
    return svg(
      560,
      240,
      `${animal === "eidechse" ? "Zauneidechse" : "Hausmaus"} bei ${outside} °C Außentemperatur: Körpertemperatur ${r.body} °C, ${r.activity}`,
      `${panel(8, 8, 544, 224, "panel-bg")}
       ${thermometer(40, outside, "außen")}
       ${thermometer(120, r.body, "Körper")}
       ${creature}${frozen}
       ${label(330, 190, r.activity, "lbl small strong", "middle")}
       ${label(470, 40, "Nahrungsbedarf", "lbl tiny strong", "middle")}
       <rect x="456" y="${f1(200 - Math.min(140, r.demand * 60))}" width="28" height="${f1(Math.min(140, r.demand * 60))}" rx="4" fill="var(--f-orange)"/>`,
    );
  },
  readout: (s) => {
    const animal = str(s, "animal");
    const outside = num(s, "outside");
    const r = thermo(animal, outside);
    return animal === "eidechse"
      ? `Die Zauneidechse ist wechselwarm (thermokonform): Ihre Körpertemperatur folgt der Außentemperatur (${fmtDe(r.body)} °C). Sie ist ${r.activity} und braucht wenig Nahrung. (Modell)`
      : `Die Hausmaus ist gleichwarm (Thermoregulator): Sie hält etwa ${fmtDe(r.body)} °C und bleibt aktiv. Je kälter es ist, desto mehr Nahrung braucht sie, um Wärme zu erzeugen: ${fmtDe(r.demand, 1)}-fach gegenüber 30 °C. (Modell)`;
  },
};

/* ---------- Metamorphose des Grasfrosches ---------- */

export const STAGES_FROG: Array<{ from: number; name: string; text: string; organ: string }> = [
  { from: 0, name: "Laichballen", text: "Ein Laichballen mit meist 1000 bis 2500 Eiern liegt im flachen Wasser; die Gallerthülle schützt die Eier.", organ: "über die Eihülle" },
  { from: 1, name: "Larve mit Außenkiemen", text: "Die Kaulquappe ist geschlüpft und atmet mit büschelartigen Außenkiemen.", organ: "Außenkiemen" },
  { from: 3, name: "Kaulquappe mit Innenkiemen", text: "Eine Hautfalte überwächst die Kiemen. Mit dem Ruderschwanz schwimmt die Kaulquappe und frisst Algen.", organ: "Innenkiemen" },
  { from: 6, name: "Hinterbeine", text: "Zuerst wachsen die Hinterbeine. Der Schwanz bleibt das wichtigste Schwimmorgan.", organ: "Innenkiemen" },
  { from: 9, name: "Vorderbeine und Lunge", text: "Die Vorderbeine brechen durch, die Lungen entwickeln sich, die Kaulquappe schnappt an der Oberfläche nach Luft.", organ: "Lunge" },
  { from: 11, name: "Jungfrosch", text: "Der Schwanz ist zurückgebildet. Der kleine Frosch atmet mit Lunge und Haut, frisst kleine Tiere und geht an Land.", organ: "Lunge und Haut" },
];

export const frogStage = (week: number) =>
  [...STAGES_FROG].reverse().find((stage) => week >= stage.from)!;

export const metamorphosis: LabDef = {
  title: "Vom Laich zum Frosch",
  prompt:
    "Verfolge die Entwicklung eines Grasfrosches Woche für Woche. Achte auf Beine, Schwanz und Atmungsorgane.",
  init: () => ({ week: 0 }),
  controls: () => [
    {
      type: "range",
      key: "week",
      label: "Zeit nach dem Ablaichen",
      min: 0,
      max: 12,
      step: 1,
      format: (v) => `${fmtDe(v)} Wochen`,
    },
  ],
  goals: (s) => {
    const name = frogStage(num(s, "week")).name;
    return [
      { text: "Die Larve mit Außenkiemen finden", met: name === "Larve mit Außenkiemen" },
      { text: "Das erste Beinpaar entdecken", met: name === "Hinterbeine" },
      { text: "Den Jungfrosch an Land sehen", met: name === "Jungfrosch" },
    ];
  },
  draw: (s) => {
    const week = num(s, "week");
    const stage = frogStage(week);
    const i = STAGES_FROG.indexOf(stage);
    const tail = i >= 5 ? 0 : i >= 1 ? 60 - (i >= 4 ? 30 : 0) : 0;
    const animal =
      i === 0
        ? Array.from({ length: 24 }, (_, k) => `<circle cx="${f1(250 + (k % 6) * 14 + (Math.floor(k / 6) % 2) * 7)}" cy="${f1(110 + Math.floor(k / 6) * 12)}" r="6" fill="#e3f2fd" stroke="var(--f-river)"/><circle cx="${f1(250 + (k % 6) * 14 + (Math.floor(k / 6) % 2) * 7)}" cy="${f1(110 + Math.floor(k / 6) * 12)}" r="2.5" fill="#2b2b2b"/>`).join("")
        : `<ellipse cx="280" cy="130" rx="${i >= 5 ? 26 : 22}" ry="${i >= 5 ? 18 : 16}" fill="${i >= 5 ? "#8d7b4a" : "#5d4c2e"}" stroke="var(--f-ink)"/>
           ${tail ? `<path d="M302 130 Q${302 + tail / 2} 116 ${302 + tail} 130 Q${302 + tail / 2} 144 302 130 Z" fill="#5d4c2e" stroke="var(--f-ink)"/>` : ""}
           ${i === 1 ? `<path d="M266 118 q-10 -10 -4 -16 M272 116 q-4 -12 2 -16" stroke="#e57373" stroke-width="3" fill="none"/>` : ""}
           ${i >= 3 ? `<path d="M292 142 l12 18 l10 2" stroke="#5d4c2e" stroke-width="5" fill="none"/>` : ""}
           ${i >= 4 ? `<path d="M266 144 l-6 14 l-8 2" stroke="#5d4c2e" stroke-width="5" fill="none"/>` : ""}
           <circle cx="266" cy="124" r="3" fill="var(--f-ink)"/>`;
    return svg(
      560,
      240,
      `Grasfrosch nach ${week} Wochen: ${stage.name}, Atmung über ${stage.organ}`,
      `${panel(8, 8, 544, 224, "panel-bg")}
       <rect x="20" y="${i >= 5 ? 170 : 60}" width="${i >= 5 ? 200 : 520}" height="${i >= 5 ? 50 : 160}" rx="8" fill="var(--f-sea)" opacity="0.6"/>
       ${i >= 5 ? `<rect x="220" y="150" width="320" height="70" rx="8" fill="var(--f-grass)" opacity="0.6"/>` : ""}
       ${animal}
       ${label(280, 40, `${stage.name}`, "lbl small strong", "middle")}
       ${labels(400, 80, `Atmung:\n${stage.organ}`, "lbl tiny strong", "start", 15)}
       ${STAGES_FROG.map((_, k) => `<circle cx="${60 + k * 88}" cy="226" r="6" fill="${k <= i ? "var(--f-green)" : "var(--f-stone)"}"/>`).join("")}`,
    );
  },
  readout: (s) => {
    const week = num(s, "week");
    const stage = frogStage(week);
    return `Woche ${fmtDe(week)}: ${stage.name}. ${stage.text} (Zeitangaben ungefähr; sie hängen stark von der Wassertemperatur ab.)`;
  },
};

/* ---------- Echoortung der Fledermaus ---------- */

/** Speed of sound in air, rounded. */
export const SOUND_SPEED = 340;

/** Time until the echo returns, in milliseconds. */
export const echoTime = (distance: number): number => ((2 * distance) / SOUND_SPEED) * 1000;

export const echolocation: LabDef = {
  title: "Echoortung",
  prompt:
    "Eine Fledermaus stößt Ultraschallrufe aus und hört das Echo. Verändere den Abstand zum Insekt und vergleiche die Echozeit.",
  init: () => ({ distance: 3, night: false, near: false, far: false }),
  controls: () => [
    {
      type: "range",
      key: "distance",
      label: "Abstand zum Insekt",
      min: 1,
      max: 10,
      step: 1,
      format: (v) => `${fmtDe(v)} m`,
    },
    { type: "toggle", key: "night", label: "Völlige Dunkelheit" },
  ],
  set: (s, key, value) => {
    s[key] = value;
    if (num(s, "distance") <= 1) s.near = true;
    if (num(s, "distance") >= 8) s.far = true;
  },
  goals: (s) => [
    { text: "Ein Insekt in 1 m Abstand orten", met: s.near === true },
    { text: "Ein Insekt in mindestens 8 m Abstand orten", met: s.far === true },
    { text: "In völliger Dunkelheit orten: Die Augen werden nicht gebraucht", met: s.night === true },
  ],
  draw: (s) => {
    const d = num(s, "distance");
    const x = 100 + d * 40;
    const waves = [0, 1, 2].map((k) => `<path d="M${110 + k * 18} 90 q8 30 0 60" fill="none" stroke="var(--f-purple)" stroke-width="2"/>`).join("");
    const echo = [0, 1].map((k) => `<path d="M${x - 16 - k * 16} 100 q-8 20 0 40" fill="none" stroke="var(--f-orange)" stroke-width="2"/>`).join("");
    return svg(
      560,
      240,
      `Fledermaus und Insekt in ${d} m Abstand: Das Echo kommt nach ${fmtDe(echoTime(d), 1)} Millisekunden zurück`,
      `${panel(8, 8, 544, 224, s.night === true ? "panel-dark" : "panel-bg")}
       <path d="M60 120 q-30 -30 -46 -6 q16 0 22 14 q8 -6 24 -8 q16 2 24 8 q6 -14 22 -14 q-16 -24 -46 6 Z" fill="#4e342e" stroke="var(--f-ink)"/>
       <circle cx="60" cy="112" r="8" fill="#4e342e"/>
       ${waves}${echo}
       <g transform="translate(${x} 120)"><ellipse rx="8" ry="4" fill="var(--f-ink)"/><ellipse cx="-2" cy="-5" rx="6" ry="3" fill="var(--f-sky)" opacity="0.8"/></g>
       <line x1="60" y1="190" x2="${x}" y2="190" stroke="var(--f-ink)" stroke-dasharray="4 3"/>
       ${label((60 + x) / 2, 206, `${fmtDe(d)} m`, "lbl small strong", "middle")}
       ${label(60, 150, "Fledermaus", "lbl tiny", "middle")}
       ${label(x, 146, "Insekt", "lbl tiny", "middle")}
       ${labels(400, 40, `Echo nach\n${fmtDe(echoTime(d), 1)} ms`, "lbl small strong", "start", 17)}`,
    );
  },
  readout: (s) => {
    const d = num(s, "distance");
    return `Der Ruf läuft ${fmtDe(d)} m hin und ${fmtDe(d)} m zurück. Bei etwa ${SOUND_SPEED} m pro Sekunde dauert das ${fmtDe(echoTime(d), 1)} Millisekunden. Je weiter das Insekt entfernt ist, desto später kommt das Echo. ${s.night === true ? "Auch in völliger Dunkelheit klappt die Ortung, denn die Fledermaus hört ihren Weg." : ""} (gerundete Werte)`.trim();
  },
};

/* ---------- Bestimmungsschlüssel der Wirbeltierklassen ---------- */

export const ANIMALS: Record<string, { name: string; features: string; klasse: string; colour: string }> = {
  blindschleiche: {
    name: "Blindschleiche",
    features: "kein Fell, keine Federn · atmet mit Lungen · trockene Haut mit Hornschuppen · keine Beine",
    klasse: "reptil",
    colour: "#a1887f",
  },
  feuersalamander: {
    name: "Feuersalamander",
    features: "kein Fell, keine Federn · erwachsen mit Lungen · feuchte, drüsenreiche Haut ohne Schuppen · Larven leben im Bach",
    klasse: "amphib",
    colour: "#f9a825",
  },
  seepferdchen: {
    name: "Seepferdchen",
    features: "kein Fell, keine Federn · atmet mit Kiemen · Knochenplatten unter der Haut · lebt im Meer",
    klasse: "fisch",
    colour: "#ff8a65",
  },
  pinguin: {
    name: "Pinguin",
    features: "kein Fell · kurze, dichte Federn · kann nicht fliegen · legt Eier mit Kalkschale",
    klasse: "vogel",
    colour: "#37474f",
  },
  delfin: {
    name: "Delfin",
    features: "glatte Haut ohne Schuppen · säugt seine Jungen · atmet an der Oberfläche mit Lungen · lebt im Meer",
    klasse: "saeuger",
    colour: "#78909c",
  },
  fledermaus: {
    name: "Fledermaus",
    features: "Fell · säugt ihre Jungen · Flughaut zwischen den Fingern · fliegt",
    klasse: "saeuger",
    colour: "#5d4037",
  },
};

export const CLASS_NAMES: Record<string, string> = {
  fisch: "Fische",
  amphib: "Amphibien (Lurche)",
  reptil: "Reptilien (Kriechtiere)",
  vogel: "Vögel",
  saeuger: "Säugetiere",
};

interface KeyNode {
  q: string;
  ja: string;
  nein: string;
}

/** Leaves are class ids; inner nodes are "q0" … "q3". */
export const VKEY: Record<string, KeyNode> = {
  q0: { q: "Säugt das Tier seine Jungen mit Milch?", ja: "saeuger", nein: "q1" },
  q1: { q: "Hat das Tier Federn?", ja: "vogel", nein: "q2" },
  q2: { q: "Atmet das erwachsene Tier mit Kiemen?", ja: "fisch", nein: "q3" },
  q3: { q: "Ist die Haut trocken und mit Hornschuppen bedeckt?", ja: "reptil", nein: "amphib" },
};

export function vkeyPosition(answers: string): string {
  let node = "q0";
  for (const a of answers) {
    const current = VKEY[node];
    if (!current) break;
    node = a === "j" ? current.ja : current.nein;
  }
  return node;
}

export const vertebrateKey: LabDef = {
  title: "Wirbeltierklassen bestimmen",
  prompt:
    "Wähle ein unbekanntes Tier, lies seine Merkmale und beantworte die Fragen des Schlüssels. Achte auf die Merkmale der Klasse, nicht auf den Lebensraum.",
  init: () => ({ animal: "delfin", answers: "", identified: "" }),
  controls: (s) => [
    {
      type: "choice",
      key: "animal",
      label: "Tier",
      options: Object.entries(ANIMALS).map(([value, a]) => ({ value, label: a.name })),
    },
    VKEY[vkeyPosition(str(s, "answers"))]
      ? {
          type: "actions",
          key: "answer",
          label: "Antwort",
          options: [
            { value: "j", label: "Ja" },
            { value: "n", label: "Nein" },
          ],
        }
      : {
          type: "actions",
          key: "answer",
          label: "Weiter",
          options: [{ value: "reset", label: "Neu bestimmen" }],
        },
  ],
  set: (s, k, value) => {
    if (k === "animal") {
      s.animal = value;
      s.answers = "";
      return;
    }
    if (value === "reset") {
      s.answers = "";
      return;
    }
    if (!VKEY[vkeyPosition(str(s, "answers"))]) return;
    s.answers = `${str(s, "answers")}${value}`;
    const end = vkeyPosition(str(s, "answers"));
    if (!VKEY[end] && end === ANIMALS[str(s, "animal")].klasse) remember(s, "identified", str(s, "animal"));
  },
  goals: (s) => [
    { text: "Den Delfin trotz Lebensraum Meer richtig einordnen", met: seen(s, "identified", "delfin") },
    { text: "Blindschleiche und Feuersalamander richtig unterscheiden", met: seen(s, "identified", "blindschleiche") && seen(s, "identified", "feuersalamander") },
    { text: "Vier verschiedene Tiere richtig bestimmen", met: String(s.identified).split(",").filter(Boolean).length >= 4 },
  ],
  draw: (s) => {
    const animal = ANIMALS[str(s, "animal")];
    const node = vkeyPosition(str(s, "answers"));
    const path = str(s, "answers")
      .split("")
      .map((a, i) => `${i + 1}. ${a === "j" ? "ja" : "nein"}`)
      .join(" · ");
    const result = VKEY[node]
      ? labels(236, 140, wrap(VKEY[node].q, 40), "lbl small strong", "start", 16)
      : labels(236, 146, `Ergebnis: ${CLASS_NAMES[node]}\n${node === animal.klasse ? "✓ passt zu den Merkmalen" : "✗ passt nicht: Prüfe deine Antworten"}`, "lbl small strong", "start", 20);
    return svg(
      540,
      240,
      `${animal.name} mit Merkmalen und aktuellem Schritt im Bestimmungsschlüssel der Wirbeltierklassen`,
      `${panel(8, 8, 204, 224, "panel-bg")}
       <circle cx="110" cy="100" r="54" fill="${animal.colour}" opacity="0.85"/>
       ${label(110, 106, animal.name, "lbl small strong", "middle")}
       ${labels(20, 180, wrap(animal.features.split(" · ").slice(0, 2).join(", "), 30), "lbl tiny", "start", 13)}
       ${panel(220, 8, 312, 224, "panel-bg")}
       ${label(236, 32, "Merkmale", "lbl small strong", "start")}
       ${labels(236, 52, animal.features.split(" · ").join("\n"), "lbl tiny", "start", 15)}
       ${result}
       ${label(236, 222, path || "Noch keine Antwort", "lbl tiny muted", "start")}`,
    );
  },
  readout: (s) => {
    const node = vkeyPosition(str(s, "answers"));
    const animal = ANIMALS[str(s, "animal")];
    if (VKEY[node]) return `Frage: ${VKEY[node].q}`;
    return node === animal.klasse
      ? `Bestimmt: ${animal.name} gehört zu den ${CLASS_NAMES[node]}. Alle Antworten passen zu den Merkmalen.`
      : `Der Schlüssel führt zu ${CLASS_NAMES[node]}, das passt nicht zu den Merkmalen. Beginne neu und lies jede Frage genau.`;
  },
};

function wrap(text: string, width: number): string {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && `${line} ${word}`.length > width) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines.join("\n");
}

/* ---------- Nahrungsnetz im Teich ---------- */

export const POND: Record<string, { name: string; x: number; y: number; producer: boolean; eats: string[] }> = {
  algen: { name: "Algen", x: 110, y: 212, producer: true, eats: [] },
  pflanzen: { name: "Wasserpflanzen", x: 330, y: 212, producer: true, eats: [] },
  wasserfloh: { name: "Wasserfloh", x: 110, y: 154, producer: false, eats: ["algen"] },
  libellenlarve: { name: "Libellenlarve", x: 110, y: 96, producer: false, eats: ["wasserfloh"] },
  rotauge: { name: "Rotauge", x: 310, y: 124, producer: false, eats: ["pflanzen", "algen", "wasserfloh", "libellenlarve"] },
  hecht: { name: "Hecht", x: 230, y: 38, producer: false, eats: ["rotauge"] },
  graureiher: { name: "Graureiher", x: 410, y: 38, producer: false, eats: ["rotauge", "hecht"] },
};

export interface WebEffect {
  lostFood: string[];
  starving: string[];
  fewerEnemies: string[];
}

/**
 * Which species lose food, which find no food at all in the long run and
 * which lose an enemy. A species whose every food is absent or starving
 * starves too, so the effect runs up the chains until nothing changes.
 */
export function webEffects(s: LabState): WebEffect {
  const present = (k: string) => s[k] !== false;
  const removed = Object.keys(POND).filter((k) => !present(k));
  const starving = new Set<string>();
  let changed = true;
  while (changed) {
    changed = false;
    for (const [k, sp] of Object.entries(POND)) {
      if (!present(k) || sp.producer || starving.has(k)) continue;
      if (sp.eats.every((f) => !present(f) || starving.has(f))) {
        starving.add(k);
        changed = true;
      }
    }
  }
  const lostFood = new Set<string>();
  for (const [k, sp] of Object.entries(POND)) {
    if (!present(k) || sp.producer) continue;
    if (sp.eats.some((f) => !present(f) || starving.has(f))) lostFood.add(k);
  }
  const fewerEnemies = new Set<string>();
  for (const r of removed) for (const f of POND[r].eats) if (present(f) && !starving.has(f)) fewerEnemies.add(f);
  return { lostFood: [...lostFood], starving: [...starving], fewerEnemies: [...fewerEnemies] };
}

export const foodWeb: LabDef = {
  title: "Nahrungsnetz im Teich",
  prompt:
    "Jeder Pfeil zeigt vom Gefressenen zum Fresser. Nimm einzelne Arten aus dem Teich und verfolge, wen das trifft.",
  init: () => Object.fromEntries(Object.keys(POND).map((k) => [k, true])),
  controls: () =>
    Object.entries(POND).map(([key, sp]) => ({ type: "toggle" as const, key, label: `${sp.name} vorhanden` })),
  goals: (s) => [
    { text: "Die Wasserflöhe entfernen: Wer verliert Nahrung?", met: s.wasserfloh === false },
    { text: "Den Hecht entfernen: Welche Beute hat einen Feind weniger?", met: s.hecht === false },
    {
      text: "Beide Produzenten entfernen: Zeige, dass alle Tiere von ihnen abhängen",
      met: s.algen === false && s.pflanzen === false,
    },
  ],
  draw: (s) => {
    const e = webEffects(s);
    const present = (k: string) => s[k] !== false;
    const arrows = Object.entries(POND)
      .flatMap(([k, sp]) =>
        sp.eats.map((f) => {
          const a = POND[f];
          const on = present(k) && present(f);
          const dx = sp.x - a.x;
          const dy = sp.y - a.y;
          // Start and end on the border of the 104 × 28 boxes, plus a small gap.
          const t = Math.min(56 / Math.abs(dx || 1e-9), 18 / Math.abs(dy || 1e-9));
          return on ? arrow(a.x + dx * t, a.y + dy * t, sp.x - dx * t, sp.y - dy * t) : "";
        }),
      )
      .join("");
    const nodes = Object.entries(POND)
      .map(([k, sp]) => {
        const fill = !present(k)
          ? "var(--f-stone)"
          : e.starving.includes(k)
            ? "var(--f-red)"
            : e.lostFood.includes(k)
              ? "var(--f-orange)"
              : sp.producer
                ? "var(--f-green)"
                : "var(--f-blue)";
        return `<rect x="${sp.x - 52}" y="${sp.y - 14}" width="104" height="28" rx="12" fill="${fill}" opacity="${present(k) ? 0.9 : 0.35}"/>${label(sp.x, sp.y + 5, sp.name, "lbl tiny on-dark", "middle")}`;
      })
      .join("");
    return svg(
      540,
      240,
      `Nahrungsnetz im Teich mit ${Object.keys(POND).filter(present).length} von 7 Arten; ${e.starving.length} Arten finden keine Nahrung mehr`,
      `${panel(8, 8, 524, 224, "panel-bg")}${arrows}${nodes}
       ${labels(400, 176, "grün: Produzent\nblau: Konsument\norange: weniger Futter\nrot: kein Futter", "lbl tiny", "start", 14)}`,
    );
  },
  readout: (s) => {
    const e = webEffects(s);
    const names = (list: string[]) => list.map((k) => POND[k].name).join(", ");
    const parts: string[] = [];
    if (e.starving.length) parts.push(`Finden auf Dauer keine Nahrung mehr: ${names(e.starving)}.`);
    const partial = e.lostFood.filter((k) => !e.starving.includes(k));
    if (partial.length) parts.push(`Eine Nahrungsquelle weniger: ${names(partial)}.`);
    if (e.fewerEnemies.length) parts.push(`Werden zunächst weniger gefressen und können sich vermehren: ${names(e.fewerEnemies)}.`);
    return parts.length
      ? `${parts.join(" ")} (vereinfachtes Modell eines Teichs)`
      : "Alle Arten sind vorhanden. Nimm eine Art heraus und beobachte die Folgen im Netz. (vereinfachtes Modell eines Teichs)";
  },
};
