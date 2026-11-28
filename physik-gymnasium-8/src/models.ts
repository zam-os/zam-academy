import type { ModelKind } from "./model/types";

type Values = Record<string, number>;
export type ModelState = Values;
export interface Param {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  initial: number;
  unit: string;
  options?: string[];
}

const range = (
  key: string,
  label: string,
  min: number,
  max: number,
  step: number,
  initial: number,
  unit: string,
): Param => ({ key, label, min, max, step, initial, unit });
const choice = (
  key: string,
  label: string,
  initial: number,
  ...options: string[]
): Param => ({
  key,
  label,
  min: 0,
  max: options.length - 1,
  step: 1,
  initial,
  unit: "",
  options,
});

export const PARAMS: Record<ModelKind, Param[]> = {
  stromkreis: [
    range("u", "Quellenspannung", 2, 8, 1, 4, "V"),
    range("r", "Widerstand", 10, 50, 5, 20, "Ω"),
    choice("closed", "Schalter", 1, "Offen", "Geschlossen"),
  ],
  kennlinie: [
    range("u", "Spannung am Bauteil", 1, 8, 1, 3, "V"),
    choice("lamp", "Bauteil", 0, "Widerstand", "Glühlampe"),
  ],
  reihenschaltung: [
    range("r2", "Widerstand R₂", 10, 50, 5, 20, "Ω"),
    choice("third", "Anzahl Widerstände", 0, "Zwei", "Drei"),
  ],
  "parallel-haushalt": [
    range("r2", "Widerstand R₂", 10, 60, 5, 30, "Ω"),
    choice(
      "mode",
      "Zweigschaltung",
      1,
      "Zweig 2 offen",
      "Zwei Zweige",
      "Drei Zweige",
    ),
  ],
  spiegel: [
    range("angle", "Einfallswinkel zum Lot", 10, 60, 5, 35, "°"),
    range("distance", "Abstand zur Spiegelfläche", 10, 35, 5, 20, "cm"),
  ],
  brechung: [
    range("angle", "Einfallswinkel zum Lot", 0, 70, 5, 35, "°"),
    choice(
      "medium",
      "Übergang",
      0,
      "Luft → Wasser",
      "Wasser → Luft",
      "Luft → Glas",
    ),
  ],
  sammellinse: [range("g", "Gegenstandsweite", 5, 35, 1, 16, "cm")],
  auge: [
    choice(
      "eye",
      "Fokus ohne Brille",
      1,
      "Auf der Netzhaut",
      "Vor der Netzhaut",
      "Hinter der Netzhaut",
    ),
    choice(
      "glass",
      "Brillenglas",
      0,
      "Ohne Glas",
      "Zerstreuungslinse",
      "Sammellinse",
    ),
  ],
  totalreflexion: [
    range("angle", "Einfallswinkel zum Lot", 15, 82, 1, 30, "°"),
    choice(
      "medium",
      "Übergang",
      0,
      "Glas → Luft",
      "Luft → Glas",
      "Faserkern → Mantel",
    ),
  ],
  tempo: [
    range("speed", "Tempo des Rollers", 2, 8, 1, 4, "m/s"),
    range("time", "Zeit je Aufnahme", 0.1, 0.5, 0.1, 0.3, "s"),
  ],
  vektoren: [
    range("bend", "Richtungswechsel", 0, 90, 15, 30, "°"),
    range("speed", "Tempo", 2, 6, 1, 3, "m/s"),
  ],
  kraftstoss: [
    range("m", "Masse des Pucks", 0.5, 2, 0.5, 1, "kg"),
    range("time", "Einwirkzeit", 0.25, 1, 0.25, 0.5, "s"),
    choice(
      "direction",
      "Kraftrichtung",
      1,
      "Nach vorn",
      "Seitwärts",
      "Entgegen der Fahrt",
    ),
  ],
  beschleunigung: [
    range("time", "Zeitspanne", 1, 5, 1, 3, "s"),
    range("end", "Tempo am Ende", 0, 12, 1, 5, "m/s"),
  ],
  gewichtskraft: [
    range("m", "Masse des Körpers", 1, 8, 1, 3, "kg"),
    choice("place", "Ort", 0, "Erde", "Mond"),
  ],
  gleichgewicht: [
    range("drive", "Antriebskraft", 0, 12, 1, 8, "N"),
    range("drag", "Widerstandskraft", 0, 12, 1, 4, "N"),
  ],
  "schiefe-ebene": [range("angle", "Neigung der Rampe", 0, 60, 5, 25, "°")],
  feder: [
    range("f", "Belastende Kraft", 1, 6, 1, 2, "N"),
    choice("hard", "Federhärte", 0, "Weiche Feder", "Härtere Feder"),
  ],
  solarmodule: [
    range("angle", "Winkel zum senkrechten Lichteinfall", 0, 75, 5, 25, "°"),
    range("shade", "Abdeckung an Modul 2", 0, 80, 10, 0, "%"),
    choice("parallel", "Verschaltung", 0, "Reihe", "Parallel"),
  ],
  stromquellen: [
    choice(
      "cell",
      "Elektrizitätsquelle",
      0,
      "Batterie",
      "Galvanisches Modellelement",
    ),
    range("load", "Lastwiderstand", 5, 30, 5, 15, "Ω"),
    choice("closed", "Messung", 1, "Leerlauf", "Unter Last"),
  ],
  forschungsauftrag: [
    range("bend", "Seitliche Ablenkung", 0, 90, 15, 30, "°"),
    range("speed", "Tempo des Balls", 2, 6, 1, 3, "m/s"),
  ],
};

interface Goal {
  id: string;
  label: string;
  reached: (values: Values) => boolean;
}
function goals(entries: [string, Goal["reached"]][]): Goal[] {
  return entries.map(([label, reached], i) => ({
    id: String(i + 1),
    label,
    reached,
  }));
}

export const MODEL_SCENARIOS: Record<ModelKind, Goal[]> = {
  stromkreis: goals([
    ["Öffne den Stromkreis und finde I = 0.", (v) => !v.closed],
    [
      "Erreiche bei 4 V im geschlossenen Kreis 0,4 A.",
      (v) => v.closed === 1 && v.u === 4 && v.r === 10,
    ],
  ]),
  kennlinie: goals([
    ["Miss am Widerstand bei 6 V.", (v) => !v.lamp && v.u === 6],
    [
      "Miss an der Glühlampe bei 6 V und vergleiche beide Punkte.",
      (v) => v.lamp === 1 && v.u === 6,
    ],
  ]),
  reihenschaltung: goals([
    [
      "Verteile 6 V gleichmäßig auf zwei Widerstände.",
      (v) => !v.third && v.r2 === 10,
    ],
    [
      "Verteile 6 V gleichmäßig auf drei Widerstände.",
      (v) => v.third === 1 && v.r2 === 10,
    ],
  ]),
  "parallel-haushalt": goals([
    ["Unterbrich Zweig 2.", (v) => !v.mode],
    ["Lass drei Zweige gleichzeitig Strom führen.", (v) => v.mode === 2],
  ]),
  spiegel: goals([
    ["Stelle 30° Reflexionswinkel ein.", (v) => v.angle === 30],
    ["Erzeuge ein Bild 30 cm hinter dem Spiegel.", (v) => v.distance === 30],
  ]),
  brechung: goals([
    [
      "Schicke einen Strahl ohne Knick durch die Grenzfläche.",
      (v) => v.angle === 0,
    ],
    [
      "Lass Wasser nach Luft einen Strahl vom Lot weg brechen.",
      (v) => v.medium === 1 && v.angle > 0 && ray(v.angle, 1.33, 1) !== null,
    ],
  ]),
  sammellinse: goals([
    ["Erzeuge ein gleich großes, reelles Bild.", (v) => v.g === 20],
    ["Erzeuge ein aufrechtes Lupenbild.", (v) => v.g <= 8],
  ]),
  auge: goals([
    ["Korrigiere Kurzsichtigkeit.", (v) => v.eye === 1 && v.glass === 1],
    ["Korrigiere Weitsichtigkeit.", (v) => v.eye === 2 && v.glass === 2],
  ]),
  totalreflexion: goals([
    [
      "Finde bei Glas → Luft die Totalreflexion.",
      (v) => v.medium === 0 && ray(v.angle, 1.5, 1) === null,
    ],
    [
      "Halte Licht an der Kern-Mantel-Grenze in der Faser.",
      (v) => v.medium === 2 && ray(v.angle, 1.5, 1.45) === null,
    ],
  ]),
  tempo: goals([
    [
      "Zeige zwischen zwei Bildern 1 m Weg.",
      (v) => Math.abs(v.speed * v.time - 1) < 0.001,
    ],
    [
      "Konfiguriere 18 km/h und 0,2 s Aufnahmeabstand.",
      (v) => v.speed === 5 && v.time === 0.2,
    ],
  ]),
  vektoren: goals([
    ["Zeige gleich lange Pfeile auf gerader Bahn.", (v) => !v.bend],
    [
      "Ändere die Richtung um 60° bei 4 m/s.",
      (v) => v.bend === 60 && v.speed === 4,
    ],
  ]),
  kraftstoss: goals([
    [
      "Erreiche eine seitliche Änderung um 2 m/s.",
      (v) => v.direction === 1 && v.time / v.m === 1,
    ],
    [
      "Bringe den Puck mit dem Gegenstoß zum Stillstand.",
      (v) => v.direction === 2 && (2 * v.time) / v.m === 3,
    ],
  ]),
  beschleunigung: goals([
    ["Stelle gleichförmige Bewegung bei 8 m/s ein.", (v) => v.end === 8],
    [
      "Bremse mit mittlerer Beschleunigung −2 m/s².",
      (v) => (v.end - 8) / v.time === -2,
    ],
  ]),
  gewichtskraft: goals([
    [
      "Vergleiche den Körper mit derselben Masse auf dem Mond.",
      (v) => v.place === 1 && v.m === 3,
    ],
    [
      "Stelle auf der Erde etwa 20 N Gewichtskraft ein.",
      (v) => !v.place && v.m === 2,
    ],
  ]),
  gleichgewicht: goals([
    [
      "Gleiche zwei Kräfte aus, die beide größer als null sind.",
      (v) => v.drive > 0 && v.drive === v.drag,
    ],
    ["Lass den Widerstand um 4 N überwiegen.", (v) => v.drag - v.drive === 4],
  ]),
  "schiefe-ebene": goals([
    ["Lass die Hangabtriebskraft verschwinden.", (v) => v.angle === 0],
    [
      "Finde den Winkel mit halb so großem Hangabtrieb wie Gewichtskraft.",
      (v) => v.angle === 30,
    ],
  ]),
  feder: goals([
    [
      "Belaste die weiche Feder bis außerhalb ihres Hooke’schen Bereichs.",
      (v) => !v.hard && v.f > 3,
    ],
    [
      "Erzeuge mit der härteren Feder 3 cm Dehnung.",
      (v) => v.hard === 1 && v.f === 3,
    ],
  ]),
  solarmodule: goals([
    [
      "Richte beide Module für senkrechten Lichteinfall aus.",
      (v) => v.angle === 0 && !v.shade,
    ],
    [
      "Beschatte Modul 2 zur Hälfte und schalte parallel.",
      (v) => v.parallel === 1 && v.shade === 50,
    ],
  ]),
  stromquellen: goals([
    ["Miss die Leerlaufspannung der Batterie.", (v) => !v.cell && !v.closed],
    [
      "Belaste das galvanische Modellelement mit 10 Ω.",
      (v) => v.cell === 1 && v.closed === 1 && v.load === 10,
    ],
  ]),
  forschungsauftrag: goals([
    [
      "Erzeuge bei 3 m/s eine Ablenkung um 90°.",
      (v) => v.speed === 3 && v.bend === 90,
    ],
    [
      "Erzeuge die gerade Kontrollbahn bei gleichem Tempo.",
      (v) => v.speed === 3 && v.bend === 0,
    ],
  ]),
};

export const initialModelState = (): ModelState => ({});
export function modelValues(kind: ModelKind, state: ModelState): Values {
  return Object.fromEntries(
    PARAMS[kind].map((p) => [p.key, state[p.key] ?? p.initial]),
  );
}
export function setModelValue(
  kind: ModelKind,
  state: ModelState,
  key: string,
  value: number,
): ModelState {
  const param = PARAMS[kind].find((p) => p.key === key);
  if (!param || !Number.isFinite(value)) return state;
  const steps = Math.round(
    (Math.min(param.max, Math.max(param.min, value)) - param.min) / param.step,
  );
  return {
    ...state,
    [key]: Number((param.min + steps * param.step).toFixed(3)),
  };
}
export const modelReady = (kind: ModelKind, reached: string[]): boolean =>
  MODEL_SCENARIOS[kind].every((goal) => reached.includes(goal.id));
export function recordExploration(
  kind: ModelKind,
  reached: string[],
  state: ModelState,
): string[] {
  const values = modelValues(kind, state);
  return [
    ...new Set([
      ...reached,
      ...MODEL_SCENARIOS[kind]
        .filter((goal) => goal.reached(values))
        .map((goal) => goal.id),
    ]),
  ];
}

export const radians = (degrees: number): number => (degrees * Math.PI) / 180;
export function ray(angle: number, n1: number, n2: number): number | null {
  const sine = (n1 * Math.sin(radians(angle))) / n2;
  return sine > 1 ? null : (Math.asin(sine) * 180) / Math.PI;
}
export const focalLength = 10;
export function lensImage(g: number): number | null {
  return g === focalLength ? null : (focalLength * g) / (g - focalLength);
}
export const lampCurrent = (u: number): number => u / (12 + 6 * Math.sqrt(u));
export const extension = (force: number, hard: number): number =>
  (hard ? 1 : 2) * force + (hard ? 0 : 0.5 * Math.max(0, force - 3) ** 2);
export const fallFactor = (place: number): number => (place ? 1.62 : 9.81);
export const sourceCurrent = (
  u: number,
  inside: number,
  load: number,
  closed: number,
): number => (closed ? u / (inside + load) : 0);
