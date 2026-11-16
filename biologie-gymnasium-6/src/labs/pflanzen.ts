/**
 * Labs of stations 2 and 3 (NT6 1.2 Samenpflanzen als Lebewesen): seed
 * dispersal, germination factors, the waterweed bubble experiment for
 * photosynthesis and phototropism. Every number is a model value for
 * learning and is labelled as such in the readout.
 */
import { arrow, f1, label, labels, panel, svg } from "../figures/draw";
import {
  fmtDe,
  type LabDef,
  type LabState,
  num,
  str,
} from "./core";

/* ---------- Ausbreitung von Früchten und Samen ---------- */

export const FRUITS: Record<
  string,
  { name: string; type: string; agent: "wind" | "fell" | "vogel"; note: string }
> = {
  loewenzahn: {
    name: "Löwenzahn",
    type: "Schirmchenflieger",
    agent: "wind",
    note: "Viele leichte Früchte mit Haarschirm. Jede einzelne ist billig, aber die meisten landen an ungünstigen Stellen.",
  },
  ahorn: {
    name: "Ahorn",
    type: "Schraubenflieger",
    agent: "wind",
    note: "Der Flügel dreht die Frucht wie einen Propeller. Sie sinkt langsam und treibt mit dem Wind vom Baum weg.",
  },
  klette: {
    name: "Große Klette",
    type: "Klettfrucht",
    agent: "fell",
    note: "Hakenspitzen verhaken sich im Fell. Die Pflanze bildet kein Fruchtfleisch und spart so Baustoffe.",
  },
  kirsche: {
    name: "Kirsche",
    type: "Lockfrucht",
    agent: "vogel",
    note: "Süßes Fruchtfleisch lockt Vögel an. Der harte Kern übersteht die Verdauung und wird weit entfernt ausgeschieden.",
  },
};

/** Model distance class 0 (unter der Mutterpflanze) … 3 (weit weg). */
export function dispersalDistance(s: LabState): number {
  const fruit = FRUITS[str(s, "fruit")];
  const wind = num(s, "wind");
  const animal = str(s, "animal");
  if (fruit.agent === "wind") return Math.min(3, wind);
  if (animal === fruit.agent) return 3;
  return 0;
}

const DISTANCE_TEXT = [
  "direkt unter der Mutterpflanze: Dort konkurriert der Keimling mit ihr um Licht und Wasser",
  "nur wenige Meter entfernt",
  "deutlich entfernt",
  "weit weg von der Mutterpflanze: Der Keimling erobert einen neuen Standort",
];

export const dispersal: LabDef = {
  title: "Ausbreitung von Früchten",
  prompt:
    "Wähle eine Frucht und einen Ausbreitungshelfer. Wo landet der Samen? Vergleiche, was der Pflanze die Ausbreitung kostet.",
  init: () => ({ fruit: "loewenzahn", wind: 0, animal: "keins" }),
  controls: () => [
    {
      type: "choice",
      key: "fruit",
      label: "Frucht",
      options: Object.entries(FRUITS).map(([value, f]) => ({ value, label: f.name })),
    },
    {
      type: "range",
      key: "wind",
      label: "Wind",
      min: 0,
      max: 3,
      step: 1,
      format: (v) => ["windstill", "leichter Wind", "frischer Wind", "kräftiger Wind"][v] ?? "",
    },
    {
      type: "choice",
      key: "animal",
      label: "Tier in der Nähe",
      options: [
        { value: "keins", label: "kein Tier" },
        { value: "fell", label: "Reh streift vorbei" },
        { value: "vogel", label: "Amsel frisst Früchte" },
      ],
    },
  ],
  goals: (s) => {
    const fruit = FRUITS[str(s, "fruit")];
    const d = dispersalDistance(s);
    return [
      { text: "Eine Flugfrucht mit kräftigem Wind weit forttragen lassen", met: fruit.agent === "wind" && d === 3 },
      { text: "Eine Klettfrucht im Fell eines Tieres verbreiten", met: str(s, "fruit") === "klette" && d === 3 },
      { text: "Eine Lockfrucht von einem Vogel verbreiten lassen", met: str(s, "fruit") === "kirsche" && d === 3 },
    ];
  },
  draw: (s) => {
    const key = str(s, "fruit");
    const fruit = FRUITS[key];
    const d = dispersalDistance(s);
    const landX = [110, 190, 300, 450][d];
    const wind = num(s, "wind");
    const animal = str(s, "animal");
    const windArrows = Array.from({ length: wind }, (_, i) =>
      arrow(140, 50 + i * 18, 220 + wind * 30, 50 + i * 18, "arrow"),
    ).join("");
    const seed =
      key === "loewenzahn"
        ? `<line x1="0" y1="0" x2="0" y2="-14" stroke="var(--f-line)"/>${[-50, -25, 0, 25, 50].map((a) => `<line x1="0" y1="-14" x2="${f1(9 * Math.sin((a * Math.PI) / 180))}" y2="${f1(-14 - 9 * Math.cos((a * Math.PI) / 180))}" stroke="var(--f-line)"/>`).join("")}<ellipse cx="0" cy="2" rx="2" ry="4" fill="var(--f-earth)"/>`
        : key === "ahorn"
          ? `<ellipse cx="0" cy="0" rx="5" ry="5" fill="var(--f-earth)"/><path d="M3 -2 Q24 -16 30 -6 Q18 0 3 2 Z" fill="#c8a165" stroke="var(--f-line)"/>`
          : key === "klette"
            ? `<circle r="8" fill="#8d6e63"/>${Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return `<line x1="${f1(8 * Math.cos(a))}" y1="${f1(8 * Math.sin(a))}" x2="${f1(12 * Math.cos(a))}" y2="${f1(12 * Math.sin(a))}" stroke="var(--f-line)"/>`; }).join("")}`
            : `<circle r="8" fill="var(--f-red)" stroke="var(--f-ink)"/><path d="M0 -8 Q4 -16 9 -18" stroke="var(--f-green)" fill="none" stroke-width="2"/>`;
    const helper =
      animal === "fell"
        ? `<g transform="translate(${fruit.agent === "fell" ? landX - 40 : 260} 196)"><ellipse cx="0" cy="-20" rx="34" ry="14" fill="#a1683a"/><circle cx="34" cy="-30" r="9" fill="#a1683a"/><line x1="-22" y1="-8" x2="-22" y2="10" stroke="#6d4320" stroke-width="4"/><line x1="20" y1="-8" x2="20" y2="10" stroke="#6d4320" stroke-width="4"/>${label(0, 26, "Reh", "lbl tiny", "middle")}</g>`
        : animal === "vogel"
          ? `<g transform="translate(${fruit.agent === "vogel" ? landX : 300} 60)"><ellipse cx="0" cy="0" rx="16" ry="9" fill="#2b2b2b"/><circle cx="14" cy="-6" r="6" fill="#2b2b2b"/><path d="M19 -6 L27 -4 L19 -2 Z" fill="var(--f-orange)"/><path d="M-4 -4 Q-14 -22 -26 -12" fill="none" stroke="#2b2b2b" stroke-width="4"/>${label(0, 24, "Amsel", "lbl tiny", "middle")}</g>`
          : "";
    const tree = key === "ahorn" || key === "kirsche";
    const mother = tree
      ? `<line x1="90" y1="196" x2="90" y2="80" stroke="var(--f-wood)" stroke-width="8"/><circle cx="90" cy="76" r="34" fill="var(--f-forest)" opacity="0.85"/>${key === "kirsche" ? [[74, 70], [100, 62], [96, 90]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="var(--f-red)"/>`).join("") : ""}`
      : `<line x1="90" y1="196" x2="90" y2="${key === "klette" ? 96 : 130}" stroke="var(--f-green)" stroke-width="4"/>${[-1, 1].map((d) => `<path d="M90 194 Q${90 + d * 30} 180 ${90 + d * 40} 190 Q${90 + d * 24} 196 90 194 Z" fill="var(--f-green)"/>`).join("")}${key === "klette" ? `<circle cx="90" cy="90" r="9" fill="#8e5aa8" stroke="var(--f-ink)"/>` : `<circle cx="90" cy="124" r="10" fill="none" stroke="var(--f-line)" stroke-dasharray="2 2"/>`}`;
    return svg(
      560,
      240,
      `${fruit.name} (${fruit.type}): Der Samen landet ${["unter der Mutterpflanze", "wenige Meter entfernt", "deutlich entfernt", "weit entfernt"][d]}`,
      `${panel(8, 8, 544, 224, "panel-bg")}
       <rect x="8" y="196" width="544" height="36" fill="var(--f-grass)" opacity="0.6"/>
       ${mother}
       ${label(90, 216, "Mutterpflanze", "lbl tiny", "middle")}
       ${windArrows}
       ${wind > 0 ? label(150, 40, "Wind", "lbl tiny strong", "start") : ""}
       ${helper}
       <g transform="translate(${landX} 186)">${seed}</g>
       <line x1="90" y1="226" x2="${landX}" y2="226" stroke="var(--f-ink)" stroke-dasharray="4 3"/>
       ${label(d === 3 ? landX - 12 : landX + 14, 166, "Samen landet hier", "lbl tiny strong", d === 3 ? "end" : "start")}
       ${labels(400, 30, `${fruit.name}\n${fruit.type}`, "lbl small strong", "start", 17)}`,
    );
  },
  readout: (s) => {
    const fruit = FRUITS[str(s, "fruit")];
    const d = dispersalDistance(s);
    return `${fruit.name} (${fruit.type}): Der Samen landet ${DISTANCE_TEXT[d]}. ${fruit.note} (Modell, keine Messwerte)`;
  },
};

/* ---------- Keimung: Einflussfaktoren ---------- */

/** The control dish every test dish is compared with. */
export const GERM_CONTROL = { water: "feucht", light: "hell", temp: "20" };

export interface GermResult {
  germinated: number;
  pale: boolean;
  text: string;
}

/** Model result for 20 cress seeds after three days. */
export function germination(water: string, light: string, temp: string): GermResult {
  if (water === "trocken")
    return { germinated: 0, pale: false, text: "Ohne Wasser quellen die Samen nicht auf; keiner keimt." };
  if (water === "unter")
    return {
      germinated: 0,
      pale: false,
      text: "Unter abgekochtem Wasser mit Ölschicht fehlt Sauerstoff; die Samen quellen, keimen aber nicht.",
    };
  if (temp === "4")
    return { germinated: 0, pale: false, text: "Im Kühlschrank bei 4 °C ist nach drei Tagen noch kein Samen gekeimt: Kälte bremst die Keimung stark." };
  if (light === "dunkel")
    return {
      germinated: 18,
      pale: true,
      text: "Im Dunkeln keimt Kresse genauso, die Keimlinge werden aber lang, dünn und bleich. Zum Keimen braucht Kresse kein Licht, für das weitere Wachstum schon.",
    };
  return { germinated: 18, pale: false, text: "Mit Wasser, Luft und Zimmerwärme keimen fast alle Samen; im Licht werden die Keimblätter grün." };
}

const differsOnly = (s: LabState, key: "water" | "light" | "temp") =>
  (["water", "light", "temp"] as const).every((k) =>
    k === key ? str(s, k) !== GERM_CONTROL[k] : str(s, k) === GERM_CONTROL[k],
  );

function dish(x: number, title: string, water: string, light: string, temp: string): string {
  const r = germination(water, light, temp);
  const sprouts = Array.from({ length: 20 }, (_, i) => {
    const sx = x + 22 + (i % 10) * 20;
    const sy = 168 + Math.floor(i / 10) * 14;
    if (i >= r.germinated) return `<ellipse cx="${sx}" cy="${sy}" rx="3" ry="2" fill="var(--f-earth)"/>`;
    const h = r.pale ? 54 : 30;
    const colour = r.pale ? "#e6dc8c" : "var(--f-green)";
    return `<line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy - h}" stroke="${colour}" stroke-width="2"/><ellipse cx="${sx - 3}" cy="${sy - h}" rx="4" ry="2.5" fill="${colour}"/><ellipse cx="${sx + 3}" cy="${sy - h}" rx="4" ry="2.5" fill="${colour}"/>`;
  }).join("");
  const waterLayer =
    water === "unter"
      ? `<rect x="${x + 10}" y="96" width="220" height="90" fill="var(--f-sea)" opacity="0.7"/><rect x="${x + 10}" y="92" width="220" height="6" fill="var(--f-yellow)" opacity="0.8"/>${label(x + 120, 88, "Ölschicht", "lbl tiny", "middle")}`
      : water === "feucht"
        ? `<rect x="${x + 10}" y="176" width="220" height="10" fill="var(--f-sea)"/>`
        : "";
  return `${panel(x, 14, 240, 212, light === "dunkel" ? "panel-dark" : "panel-bg")}
    ${label(x + 120, 36, title, "lbl small strong", "middle")}
    ${label(x + 120, 54, `${water === "trocken" ? "trockene Watte" : water === "unter" ? "unter Wasser" : "feuchte Watte"} · ${light} · ${temp} °C`, "lbl tiny", "middle")}
    ${waterLayer}
    <path d="M${x + 10} 186 L${x + 230} 186 L${x + 222} 198 L${x + 18} 198 Z" fill="var(--f-white)" stroke="var(--f-ink)"/>
    ${sprouts}
    ${label(x + 120, 216, `${r.germinated} von 20 gekeimt`, "lbl small strong", "middle")}`;
}

export const germinationLab: LabDef = {
  title: "Keimungsversuch mit Kresse",
  prompt:
    "Die Kontrollschale hat feuchte Watte, Licht und 20 °C. Verändere in der Versuchsschale immer nur eine Variable und vergleiche nach drei Tagen.",
  init: () => ({ water: "feucht", light: "hell", temp: "20" }),
  controls: () => [
    {
      type: "choice",
      key: "water",
      label: "Versuchsschale · Wasser",
      options: [
        { value: "feucht", label: "feuchte Watte" },
        { value: "trocken", label: "trockene Watte" },
        { value: "unter", label: "unter Wasser mit Ölschicht" },
      ],
    },
    {
      type: "choice",
      key: "light",
      label: "Versuchsschale · Licht",
      options: [
        { value: "hell", label: "hell" },
        { value: "dunkel", label: "dunkel (Karton darüber)" },
      ],
    },
    {
      type: "choice",
      key: "temp",
      label: "Versuchsschale · Temperatur",
      options: [
        { value: "20", label: "20 °C" },
        { value: "4", label: "4 °C (Kühlschrank)" },
      ],
    },
  ],
  goals: (s) => [
    { text: "Nur das Wasser weglassen und zeigen, dass Wasser nötig ist", met: str(s, "water") === "trocken" && differsOnly(s, "water") },
    { text: "Nur den Sauerstoff entziehen und zeigen, dass Sauerstoff nötig ist", met: str(s, "water") === "unter" && differsOnly(s, "water") },
    { text: "Nur das Licht wegnehmen und prüfen, ob Kresse Licht zum Keimen braucht", met: differsOnly(s, "light") },
  ],
  draw: (s) =>
    svg(
      520,
      236,
      `Keimungsversuch: Kontrollschale mit ${germination("feucht", "hell", "20").germinated} gekeimten Samen und Versuchsschale mit ${germination(str(s, "water"), str(s, "light"), str(s, "temp")).germinated} gekeimten Samen nach drei Tagen`,
      `${dish(8, "Kontrollschale", "feucht", "hell", "20")}${dish(272, "Versuchsschale", str(s, "water"), str(s, "light"), str(s, "temp"))}`,
    ),
  readout: (s) => {
    const changed = (["water", "light", "temp"] as const).filter((k) => str(s, k) !== GERM_CONTROL[k]).length;
    const r = germination(str(s, "water"), str(s, "light"), str(s, "temp"));
    const fairness =
      changed === 0
        ? "Beide Schalen sind gleich: Du hast noch keine Variable verändert."
        : changed === 1
          ? "Genau eine Variable ist verändert, alles andere bleibt konstant: Der Vergleich ist aussagekräftig."
          : "Mehr als eine Variable ist verändert: Du kannst nicht sagen, welche den Unterschied verursacht.";
    return `${fairness} ${r.text} (Modellversuch, 20 Samen je Schale)`;
  },
};

/* ---------- Wasserpest: Licht und Photosynthese ---------- */

/** Model: oxygen bubbles per minute of a waterweed shoot. */
export function bubbles(lamp: boolean, distance: number, co2: boolean): number {
  if (!lamp) return 0;
  const light = (10 / distance) ** 2;
  return Math.round(30 * (light / (light + 0.25)) * (co2 ? 1 : 0.5));
}

export const waterweed: LabDef = {
  title: "Wasserpest im Licht",
  prompt:
    "Ein Spross der Wasserpest steht im Wasser. Verändere den Abstand der Lampe und zähle die Sauerstoffbläschen pro Minute.",
  init: () => ({ lamp: true, distance: 30, co2: false, seenNear: false, seenFar: false }),
  controls: () => [
    { type: "toggle", key: "lamp", label: "Lampe an" },
    {
      type: "range",
      key: "distance",
      label: "Abstand der Lampe",
      min: 10,
      max: 50,
      step: 5,
      format: (v) => `${fmtDe(v)} cm`,
    },
    { type: "toggle", key: "co2", label: "Etwas Mineralwasser zugeben (mehr Kohlenstoffdioxid)" },
  ],
  set: (s, key, value) => {
    s[key] = value;
    if (s.lamp === true && num(s, "distance") <= 15) s.seenNear = true;
    if (s.lamp === true && num(s, "distance") >= 40) s.seenFar = true;
  },
  goals: (s) => [
    { text: "Die Lampe ausschalten: Ohne Licht entsteht kein Sauerstoff", met: s.lamp === false },
    {
      text: "Mit naher Lampe und mehr Kohlenstoffdioxid mindestens 20 Bläschen pro Minute erreichen",
      met: bubbles(s.lamp === true, num(s, "distance"), s.co2 === true) >= 20,
    },
    { text: "Eine nahe (bis 15 cm) und eine ferne Lampe (ab 40 cm) vergleichen", met: s.seenNear === true && s.seenFar === true },
  ],
  draw: (s) => {
    const n = bubbles(s.lamp === true, num(s, "distance"), s.co2 === true);
    const lampX = 280 - (num(s, "distance") - 10) * 5;
    const beam = s.lamp === true ? `<path d="M${lampX + 30} 92 L330 70 L330 190 Z" fill="var(--f-yellow)" opacity="0.25"/>` : "";
    const bubbleDots = Array.from({ length: Math.min(n, 30) }, (_, i) => `<circle cx="${f1(392 + Math.sin(i * 1.7) * 8)}" cy="${f1(66 + (i % 15) * 7)}" r="${i % 3 === 0 ? 3 : 2}" fill="var(--f-white)" stroke="var(--f-river)"/>`).join("");
    return svg(
      560,
      240,
      `Wasserpest-Versuch: Lampe ${s.lamp === true ? `in ${num(s, "distance")} cm Abstand` : "aus"}, ${n} Sauerstoffbläschen pro Minute`,
      `${panel(8, 8, 544, 224, "panel-bg")}
       ${beam}
       <rect x="${lampX}" y="78" width="30" height="28" rx="6" fill="${s.lamp === true ? "var(--f-yellow)" : "var(--f-stone)"}" stroke="var(--f-ink)"/>
       <line x1="${lampX + 15}" y1="106" x2="${lampX + 15}" y2="210" stroke="var(--f-ink)" stroke-width="3"/>
       ${label(lampX + 15, 70, s.lamp === true ? "Lampe" : "Lampe aus", "lbl tiny", "middle")}
       <rect x="330" y="40" width="130" height="170" rx="6" fill="var(--f-sea)" opacity="0.6" stroke="var(--f-ink)" stroke-width="2"/>
       <path d="M395 206 Q385 160 395 120 Q405 90 395 64" fill="none" stroke="var(--f-forest)" stroke-width="4"/>
       ${[80, 100, 120, 140, 160, 180].map((y, i) => `<ellipse cx="${395 + (i % 2 ? 10 : -10)}" cy="${y}" rx="9" ry="3" fill="var(--f-green)" transform="rotate(${i % 2 ? -30 : 30} ${395 + (i % 2 ? 10 : -10)} ${y})"/>`).join("")}
       ${bubbleDots}
       ${label(395, 30, "Wasserpest", "lbl tiny strong", "middle")}
       ${labels(474, 70, `${n}\nBläschen\npro Minute`, "lbl small strong", "start", 17)}
       ${label(lampX + 15 + (330 - lampX - 15) / 2, 226, `${fmtDe(num(s, "distance"))} cm`, "lbl tiny", "middle")}`,
    );
  },
  readout: (s) => {
    const n = bubbles(s.lamp === true, num(s, "distance"), s.co2 === true);
    if (s.lamp !== true) return "Ohne Licht steigen keine Bläschen auf: Die Pflanze betreibt keine Photosynthese und bildet keinen Sauerstoff. (Modellwerte)";
    return `${n} Sauerstoffbläschen pro Minute. Je näher die Lampe, desto mehr Licht trifft die Blätter und desto mehr Sauerstoff entsteht. ${s.co2 === true ? "Mit mehr Kohlenstoffdioxid im Wasser steigt die Bläschenzahl zusätzlich." : "Kohlenstoffdioxid ist hier knapp und begrenzt die Bläschenzahl."} (Modellwerte)`;
  },
};

/* ---------- Phototropismus ---------- */

/** Model bending angle in degrees towards the light (negative = left). */
export function bendAngle(s: LabState): number {
  const light = str(s, "light");
  const hours = num(s, "hours");
  if (s.cap === true || light === "oben" || light === "dunkel") return 0;
  const angle = Math.min(45, hours * 2);
  return light === "links" ? -angle : angle;
}

export const phototropism: LabDef = {
  title: "Keimling und Licht",
  prompt:
    "Ein Haferkeimling wächst in einem Kasten. Wähle, woher das Licht kommt, decke die Spitze ab und lass Zeit vergehen.",
  init: () => ({ light: "oben", cap: false, hours: 0 }),
  controls: () => [
    {
      type: "choice",
      key: "light",
      label: "Licht",
      options: [
        { value: "oben", label: "von oben" },
        { value: "links", label: "von links" },
        { value: "rechts", label: "von rechts" },
        { value: "dunkel", label: "kein Licht" },
      ],
    },
    { type: "toggle", key: "cap", label: "Spitze mit einer lichtdichten Kappe abdecken" },
    {
      type: "range",
      key: "hours",
      label: "Zeit",
      min: 0,
      max: 24,
      step: 2,
      format: (v) => `${fmtDe(v)} Stunden`,
    },
  ],
  goals: (s) => [
    { text: "Licht von der Seite: Der Keimling krümmt sich zum Licht", met: Math.abs(bendAngle(s)) >= 30 },
    {
      text: "Mit abgedeckter Spitze und Seitenlicht einen Tag warten: keine Krümmung",
      met: s.cap === true && (str(s, "light") === "links" || str(s, "light") === "rechts") && num(s, "hours") >= 24,
    },
    { text: "Einen Tag ohne Licht: Der Keimling wird lang und bleich", met: str(s, "light") === "dunkel" && num(s, "hours") >= 24 },
  ],
  draw: (s) => {
    const angle = bendAngle(s);
    const light = str(s, "light");
    const hours = num(s, "hours");
    const dark = light === "dunkel";
    const length = 70 + hours * (dark ? 4 : 2);
    const lower = Math.min(length, 50);
    const upper = length - lower;
    const rad = (angle * Math.PI) / 180;
    const bx = 260;
    const by = 200 - lower;
    const tx = bx + upper * Math.sin(rad);
    const ty = by - upper * Math.cos(rad);
    const colour = dark ? "#e6dc8c" : "var(--f-green)";
    const sun =
      light === "oben"
        ? `<circle cx="260" cy="26" r="14" fill="var(--f-yellow)"/>${arrow(260, 44, 260, 70)}`
        : light === "links"
          ? `<circle cx="40" cy="120" r="14" fill="var(--f-yellow)"/>${arrow(58, 120, 110, 120)}`
          : light === "rechts"
            ? `<circle cx="480" cy="120" r="14" fill="var(--f-yellow)"/>${arrow(462, 120, 410, 120)}`
            : "";
    return svg(
      520,
      240,
      `Haferkeimling nach ${hours} Stunden, Licht ${light === "dunkel" ? "fehlt" : `kommt von ${light}`}${s.cap === true ? ", Spitze abgedeckt" : ""}: Krümmung ${Math.abs(angle)} Grad`,
      `${panel(8, 8, 504, 224, dark ? "panel-dark" : "panel-bg")}
       ${sun}
       <rect x="200" y="200" width="120" height="24" rx="4" fill="var(--f-earth)"/>
       <path d="M${bx} 200 L${bx} ${f1(by)} Q${bx} ${f1(by - upper * 0.4)} ${f1(tx)} ${f1(ty)}" fill="none" stroke="${colour}" stroke-width="8" stroke-linecap="round"/>
       ${s.cap === true ? `<path d="M${f1(tx - 7)} ${f1(ty + 6)} L${f1(tx)} ${f1(ty - 12)} L${f1(tx + 7)} ${f1(ty + 6)} Z" fill="#2b2b2b"/>${label(tx + 14, ty - 4, "Kappe", "lbl tiny", "start")}` : ""}
       ${label(bx, 236 - 4, "Haferkeimling", "lbl tiny", "middle")}
       ${labels(30, 30, `${hours} h`, "lbl small strong", "start")}`,
    );
  },
  readout: (s) => {
    const light = str(s, "light");
    const hours = num(s, "hours");
    if (hours === 0) return "Noch ist keine Zeit vergangen. Stelle die Zeit ein, um das Wachstum zu verfolgen.";
    if (light === "dunkel")
      return "Ohne Licht wächst der Keimling schnell in die Länge, bleibt dünn und bleich. So erreicht er mit seinen Vorräten vielleicht doch noch das Licht. (Modell)";
    if (light === "oben") return "Bei Licht von oben wächst der Keimling gerade nach oben. (Modell)";
    if (s.cap === true)
      return "Mit abgedeckter Spitze krümmt sich der Keimling nicht: Die Spitze nimmt das Licht wahr. Ohne diese Information wächst er gerade. (Modell)";
    return `Krümmung ${fmtDe(Math.abs(bendAngle(s)))} Grad zum Licht: Die Spitze nimmt das Seitenlicht wahr, ein Wuchsstoff gelangt auf die Schattenseite, dort strecken sich die Zellen stärker. (Modell)`;
  },
};

