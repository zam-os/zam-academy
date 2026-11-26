/**
 * Interactive models for LB 3 (Neue räumliche und geistige Horizonte) and
 * LB 4 (Wirtschaft und Handel):
 * - kreuzzugKarte: routes of four crusades (Natural Earth, Mediterranean)
 * - perspektive: central perspective vs. hierarchical perspective
 * - entdeckerKarte: voyages of Dias, Columbus, da Gama and Magellan (world)
 * - hanseKarte: Hanseatic network with Kontore and goods (North/Baltic Sea)
 */
import { arrow, badgePill, dot, f1, label, labels, panel, person, svg } from "../figures/draw";
import {
  atCrop,
  CRUSADE_FRAME,
  frameBase,
  HANSE_FRAME,
  WORLD_FRAME,
  worldBase,
} from "../figures/maps";
import { C } from "../figures/scenes-lb1-2";
import { type LabDef, num, str } from "./core";

/* ---------- LB 3: Kreuzzüge ---------- */

type Route = { label: string; years: string; colour: string; points: Array<[number, number]>; text: string };

export const CRUSADES: Record<string, Route> = {
  erster: {
    label: "1. Kreuzzug",
    years: "1096–1099",
    colour: C.red,
    points: [[6.96, 50.94], [16.37, 48.21], [20.46, 44.82], [28.98, 41.01], [29.72, 40.43], [36.16, 36.2], [35.21, 31.77]],
    text: "Von Köln entlang der Donau nach Konstantinopel, durch Kleinasien nach Antiochia und 1099 nach Jerusalem.",
  },
  zweiter: {
    label: "2. Kreuzzug",
    years: "1147–1149",
    colour: C.ochre,
    points: [[12.1, 49.02], [16.37, 48.21], [28.98, 41.01], [30.7, 36.9], [36.29, 33.51]],
    text: "Nach dem Fall Edessas zogen Heere über Konstantinopel; die Belagerung von Damaskus scheiterte 1148.",
  },
  dritter: {
    label: "3. Kreuzzug",
    years: "1189–1192",
    colour: C.blue,
    points: [[12.1, 49.02], [16.37, 48.21], [28.98, 41.01], [32.5, 37.9], [33.93, 36.37]],
    text: "Kaiser Friedrich Barbarossa zog über Land und ertrank 1190 im Fluss Saleph; Richard Löwenherz kam über das Meer nach Akkon.",
  },
  vierter: {
    label: "4. Kreuzzug",
    years: "1202–1204",
    colour: C.purple,
    points: [[12.33, 45.44], [15.23, 44.12], [20.0, 38.5], [26.0, 39.5], [28.98, 41.01]],
    text: "Von Venedig über Zara nach Konstantinopel: Die Kreuzfahrer eroberten und plünderten 1204 die christliche Stadt.",
  },
};

const CRUSADER_STATES: Array<{ name: string; lon: number; lat: number }> = [
  { name: "Edessa", lon: 38.79, lat: 37.16 },
  { name: "Antiochia", lon: 36.16, lat: 36.2 },
  { name: "Tripolis", lon: 35.84, lat: 34.44 },
  { name: "Jerusalem", lon: 35.21, lat: 31.77 },
];

export const kreuzzugKarte: LabDef = {
  title: "Wege der Kreuzzüge",
  prompt:
    "Wähle einen Kreuzzug und verfolge seinen Weg. Wohin führte er – und gegen wen richtete er sich?",
  init: () => ({ zug: "ueberblick", staaten: false }),
  controls: () => [
    {
      type: "choice",
      key: "zug",
      label: "Kreuzzug",
      options: [{ value: "ueberblick", label: "Überblick" }, ...Object.entries(CRUSADES).map(([value, r]) => ({ value, label: `${r.label} (${r.years})` }))],
    },
    { type: "toggle", key: "staaten", label: "Kreuzfahrerstaaten einblenden" },
  ],
  goals: (s) => [
    { text: "Den Weg des ersten Kreuzzugs bis Jerusalem verfolgen", met: str(s, "zug") === "erster" },
    { text: "Den Kreuzzug finden, der das christliche Konstantinopel eroberte", met: str(s, "zug") === "vierter" },
    { text: "Die Kreuzfahrerstaaten an der Küste der Levante einblenden", met: Boolean(s.staaten) },
  ],
  draw: (s) => {
    const f = CRUSADE_FRAME;
    const z = str(s, "zug");
    const pt = (lon: number, lat: number) => atCrop(f, lon, lat).map(f1).join(" ");
    const routes = Object.entries(CRUSADES)
      .filter(([k]) => z === "ueberblick" || k === z)
      .map(([, r]) => `<path d="M${r.points.map(([lo, la]) => pt(lo, la)).join("L")}" fill="none" stroke="${r.colour}" stroke-width="${z === "ueberblick" ? 2.5 : 4}" stroke-linejoin="round" stroke-linecap="round" ${z === "ueberblick" ? 'stroke-dasharray="6 4"' : ""}/>`)
      .join("");
    const cities: Array<{ name: string; lon: number; lat: number; side: "start" | "end" }> = [
      { name: "Konstantinopel", lon: 28.98, lat: 41.01, side: "start" },
      { name: "Venedig", lon: 12.33, lat: 45.44, side: "end" },
      { name: "Rom", lon: 12.5, lat: 41.9, side: "end" },
      { name: "Clermont", lon: 3.08, lat: 45.78, side: "end" },
      { name: "Akkon", lon: 35.07, lat: 32.93, side: "end" },
    ];
    const [jx, jy] = atCrop(f, 35.21, 31.77);
    return svg(
      f.width,
      f.height,
      `Karte der Kreuzzüge: ${z === "ueberblick" ? "alle vier Wege" : CRUSADES[z].label}`,
      `${frameBase(f)}
       ${routes}
       ${cities.map((c) => {
         const [x, y] = atCrop(f, c.lon, c.lat);
         return `${dot(x, y, "city")}${label(x + (c.side === "start" ? 8 : -8), y + 4, c.name, "lbl tiny strong", c.side)}`;
       }).join("")}
       ${dot(jx, jy, "capital", 6)}${label(jx - 10, jy + 16, "Jerusalem", "lbl small strong", "end")}
       ${s.staaten ? CRUSADER_STATES.map((c) => {
         const [x, y] = atCrop(f, c.lon, c.lat);
         return `<circle cx="${f1(x)}" cy="${f1(y)}" r="14" fill="${C.red}" opacity="0.3" stroke="${C.red}"/>${label(x + 16, y + 4, c.name, "lbl tiny strong", "start")}`;
       }).join("") : ""}
       ${panel(12, 380, 290, 62, "panel-bg")}
       ${z === "ueberblick" ? `${label(24, 404, "Vier Kreuzzüge im Überblick", "lbl small strong", "start")}${label(24, 426, "Wähle einen Zug für Details.", "lbl tiny", "start")}` : `${badgePill(76, 402, 110, CRUSADES[z].years, CRUSADES[z].colour)}${label(140, 406, CRUSADES[z].label, "lbl small strong", "start")}${label(24, 430, "Linien vereinfacht", "lbl tiny muted", "start")}`}`,
    );
  },
  readout: (s) => {
    const z = str(s, "zug");
    const base = z === "ueberblick" ? "Zwischen 1096 und 1291 zogen immer wieder Heere aus Europa ins östliche Mittelmeer." : `${CRUSADES[z].label} (${CRUSADES[z].years}): ${CRUSADES[z].text}`;
    return s.staaten ? `${base} Nach 1099 entstanden die Kreuzfahrerstaaten Edessa, Antiochia, Tripolis und Jerusalem; Akkon fiel 1291 als letzter großer Stützpunkt.` : base;
  },
};

/* ---------- LB 3: Zentralperspektive ---------- */

export const perspektive: LabDef = {
  title: "Zentralperspektive ausprobieren",
  prompt:
    "Verschiebe Fluchtpunkt und Horizont oder wechsle zur mittelalterlichen Bedeutungsperspektive. Wie verändert sich das Bild?",
  init: () => ({ modus: "zentral", fx: 220, horizont: 120 }),
  controls: (s) => [
    {
      type: "choice",
      key: "modus",
      label: "Darstellung",
      options: [
        { value: "zentral", label: "Zentralperspektive (Renaissance)" },
        { value: "bedeutung", label: "Bedeutungsperspektive (Mittelalter)" },
      ],
    },
    ...(str(s, "modus") === "zentral"
      ? [
          { type: "range" as const, key: "fx", label: "Fluchtpunkt waagrecht", min: 160, max: 480, step: 10, format: (v: number) => (Math.abs(v - 320) <= 10 ? "Mitte" : v < 320 ? "links" : "rechts") },
          { type: "range" as const, key: "horizont", label: "Horizont (Augenhöhe)", min: 80, max: 200, step: 10, format: (v: number) => (v >= 180 ? "tief" : v <= 100 ? "hoch" : "mittel") },
        ]
      : []),
  ],
  goals: (s) => [
    { text: "Den Fluchtpunkt genau in die Bildmitte legen", met: str(s, "modus") === "zentral" && Math.abs(num(s, "fx") - 320) <= 10 },
    { text: "Den Horizont tief legen – wie aus Kinderaugen", met: str(s, "modus") === "zentral" && num(s, "horizont") >= 180 },
    { text: "Zur Bedeutungsperspektive wechseln und vergleichen", met: str(s, "modus") === "bedeutung" },
  ],
  draw: (s) => {
    if (str(s, "modus") === "bedeutung") {
      return svg(
        640,
        280,
        "Bedeutungsperspektive: Die wichtigste Figur ist am größten, der Hintergrund ist golden",
        `<rect x="8" y="8" width="624" height="264" rx="12" fill="#d9b44a"/>
         <circle cx="320" cy="70" r="40" fill="#f2cf3d" opacity="0.8"/>
         ${person(320, 250, 4.2, "cloth-scribe", "up")}
         ${person(130, 250, 1.3, "cloth-linen")}${person(180, 250, 1.3, "cloth-linen")}
         ${person(460, 250, 1.3, "cloth-linen")}${person(510, 250, 1.3, "cloth-linen")}
         ${label(320, 270, "wichtig = groß, Goldgrund = himmlische Welt", "lbl small strong")}`,
      );
    }
    const vx = num(s, "fx");
    const vy = num(s, "horizont");
    const floor = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => 60 + i * 65);
    const depth = (t: number) => vy + (270 - vy) * t;
    const rows = [1, 0.62, 0.4, 0.26, 0.17].map((t) => {
      const y = depth(t);
      const xl = vx + (60 - vx) * t;
      const xr = vx + (580 - vx) * t;
      return `<line x1="${f1(xl)}" y1="${f1(y)}" x2="${f1(xr)}" y2="${f1(y)}" stroke="var(--f-line)" stroke-width="1.2"/>`;
    });
    return svg(
      640,
      280,
      `Zentralperspektive mit Fluchtpunkt bei x=${vx} und Horizont bei y=${vy}`,
      `<rect x="8" y="8" width="624" height="264" rx="12" fill="var(--f-sky)"/>
       <rect x="8" y="${vy}" width="624" height="${272 - vy}" fill="var(--f-sand)" opacity="0.7"/>
       <line x1="8" y1="${vy}" x2="632" y2="${vy}" stroke="var(--f-ink)" stroke-width="1.5"/>
       ${floor.map((x) => `<line x1="${x}" y1="270" x2="${vx}" y2="${vy}" stroke="var(--accent)" stroke-width="1.4" stroke-dasharray="4 3"/>`).join("")}
       ${rows.join("")}
       ${[0.9, 0.5, 0.28].map((t, i) => person(vx + (180 - vx) * t, depth(t), 2.2 * t + 0.2, ["cloth-a", "cloth-b", "cloth-c"][i])).join("")}
       ${[0.75, 0.35].map((t, i) => person(vx + (470 - vx) * t, depth(t), 2.2 * t + 0.2, ["cloth-d", "cloth-a"][i])).join("")}
       <circle cx="${vx}" cy="${vy}" r="7" fill="var(--f-red)" stroke="var(--f-halo)" stroke-width="2"/>
       ${label(vx, vy - 12, "Fluchtpunkt", "lbl tiny strong")}
       ${label(600, vy - 8, "Horizont", "lbl tiny strong", "end")}`,
    );
  },
  readout: (s) => {
    if (str(s, "modus") === "bedeutung") return "Im Mittelalter malte man oft nach Bedeutung: Heilige oder Herrscher groß, einfache Menschen klein, dazu ein Goldgrund als Zeichen des Himmels.";
    const centred = Math.abs(num(s, "fx") - 320) <= 10;
    const low = num(s, "horizont") >= 180;
    return `Alle Linien in die Tiefe treffen sich im Fluchtpunkt auf der Horizontlinie; ferne Figuren werden kleiner.${centred ? " Mit mittigem Fluchtpunkt wirkt der Raum ruhig und symmetrisch." : ""}${low ? " Ein tiefer Horizont zeigt den Raum aus niedriger Augenhöhe." : ""}`;
  },
};

/* ---------- LB 3: Entdeckungsfahrten ---------- */

export const VOYAGES: Record<string, Route> = {
  dias: {
    label: "Bartolomeu Dias",
    years: "1487/88",
    colour: C.green,
    points: [[-9.14, 38.72], [-17.0, 20.0], [-10.0, 5.0], [8.0, -5.0], [12.0, -20.0], [18.47, -34.36], [22.0, -34.0]],
    text: "Portugal tastet sich an Afrikas Küste nach Süden; Dias umrundet das Kap der Guten Hoffnung.",
  },
  kolumbus: {
    label: "Christoph Kolumbus",
    years: "1492",
    colour: C.red,
    points: [[-6.95, 37.22], [-15.4, 28.1], [-40.0, 26.0], [-74.5, 24.1]],
    text: "Von Palos über die Kanaren nach Westen; am 12. Oktober landet Kolumbus auf einer Insel der Bahamas.",
  },
  gama: {
    label: "Vasco da Gama",
    years: "1497/98",
    colour: C.blue,
    points: [[-9.14, 38.72], [-23.0, 15.0], [-25.0, -15.0], [18.47, -34.36], [40.0, -15.0], [39.67, -4.05], [75.78, 11.25]],
    text: "Um das Kap der Guten Hoffnung und über den Indischen Ozean erreicht da Gama 1498 Calicut in Indien.",
  },
  magellan: {
    label: "Expedition Magellans",
    years: "1519–1522",
    colour: C.purple,
    points: [[-6.36, 36.78], [-38.0, -5.0], [-60.0, -40.0], [-70.0, -53.0], [-90.0, -30.0], [-150.0, 0.0], [124.0, 10.3], [105.0, -8.0], [60.0, -30.0], [18.47, -34.36], [-15.0, 10.0], [-6.36, 36.78]],
    text: "Erste Umrundung der Erde: Magellan fällt 1521 auf den Philippinen, Elcano bringt ein Schiff 1522 zurück.",
  },
};

export const entdeckerKarte: LabDef = {
  title: "Wege der Entdeckungsfahrten",
  prompt:
    "Wähle eine Fahrt und verfolge ihren Weg. Wer suchte den Ostweg, wer den Westweg nach Asien?",
  init: () => ({ fahrt: "ueberblick", tordesillas: false }),
  controls: () => [
    {
      type: "choice",
      key: "fahrt",
      label: "Fahrt",
      options: [{ value: "ueberblick", label: "Überblick" }, ...Object.entries(VOYAGES).map(([value, v]) => ({ value, label: `${v.label} (${v.years})` }))],
    },
    { type: "toggle", key: "tordesillas", label: "Teilungslinie von Tordesillas (1494) einblenden" },
  ],
  goals: (s) => [
    { text: "Den Westweg des Kolumbus nach „Indien“ verfolgen", met: str(s, "fahrt") === "kolumbus" },
    { text: "Den Seeweg nach Indien um Afrika finden", met: str(s, "fahrt") === "gama" },
    { text: "Die erste Erdumrundung mit der Teilungslinie von Tordesillas vergleichen", met: str(s, "fahrt") === "magellan" && Boolean(s.tordesillas) },
  ],
  draw: (s) => {
    const f = WORLD_FRAME;
    const v = str(s, "fahrt");
    const pt = (lon: number, lat: number) => atCrop(f, lon, lat).map(f1).join(" ");
    const routes = Object.entries(VOYAGES)
      .filter(([k]) => v === "ueberblick" || k === v)
      .map(([, r]) => {
        // Split the Magellan route where it crosses the date line.
        const segs: string[] = [];
        let cur: string[] = [];
        r.points.forEach(([lo, la], i) => {
          if (i > 0 && Math.abs(lo - r.points[i - 1][0]) > 180) {
            segs.push(cur.join("L"));
            cur = [];
          }
          cur.push(pt(lo, la));
        });
        segs.push(cur.join("L"));
        return segs.map((d) => `<path d="M${d}" fill="none" stroke="${r.colour}" stroke-width="${v === "ueberblick" ? 2 : 3}" stroke-linejoin="round"/>`).join("");
      })
      .join("");
    const [tx1, ty1] = atCrop(f, -46.6, 80);
    const [, ty2] = atCrop(f, -46.6, -60);
    const [lx, ly] = atCrop(f, -9.14, 38.72);
    return svg(
      f.width,
      f.height + 40,
      `Weltkarte der Entdeckungsfahrten: ${v === "ueberblick" ? "alle vier Fahrten" : VOYAGES[v].label}`,
      `${worldBase(f)}
       ${s.tordesillas ? `<line x1="${f1(tx1)}" y1="${f1(ty1)}" x2="${f1(tx1)}" y2="${f1(ty2)}" stroke="var(--f-ink)" stroke-width="2" stroke-dasharray="6 4"/>${label(tx1 - 6, 30, "Spanien ←  → Portugal", "lbl tiny strong")}` : ""}
       ${routes}
       ${dot(lx, ly, "capital")}${label(lx + 8, ly - 6, "Lissabon", "lbl tiny strong", "start")}
       <rect x="0" y="${f.height}" width="${f.width}" height="40" fill="var(--f-panel)"/>
       ${Object.values(VOYAGES).map((r, i) => `<line x1="${16 + i * 162}" y1="${f.height + 22}" x2="${36 + i * 162}" y2="${f.height + 22}" stroke="${r.colour}" stroke-width="3"/>${label(42 + i * 162, f.height + 26, `${r.label.split(" ").pop()} ${r.years}`, "lbl tiny strong", "start")}`).join("")}`,
    );
  },
  readout: (s) => {
    const v = str(s, "fahrt");
    const base = v === "ueberblick" ? "Portugal suchte den Ostweg um Afrika, Spanien mit Kolumbus den Westweg über den Atlantik." : `${VOYAGES[v].label} (${VOYAGES[v].years}): ${VOYAGES[v].text}`;
    return s.tordesillas ? `${base} Im Vertrag von Tordesillas teilten Spanien und Portugal 1494 die neu entdeckten Gebiete entlang einer Linie im Atlantik auf – westlich Spanien, östlich Portugal.` : base;
  },
};

/* ---------- LB 4: Hanse ---------- */

export const KONTORE: Record<string, { name: string; lon: number; lat: number; goods: string; text: string }> = {
  london: { name: "London (Stalhof)", lon: -0.08, lat: 51.5, goods: "Wolle, Tuch, Zinn", text: "Im Stalhof an der Themse lebten Hansekaufleute nach eigenen Regeln und kauften englische Wolle und Tuch." },
  bruegge: { name: "Brügge", lon: 3.22, lat: 51.21, goods: "feines Tuch, Wein, Gewürze", text: "Brügge war der große Markt des Westens: flandrisches Tuch, Wein aus Frankreich und Gewürze aus dem Süden." },
  bergen: { name: "Bergen", lon: 5.32, lat: 60.39, goods: "Stockfisch", text: "In Bergen tauschten die Kaufleute Getreide gegen getrockneten Kabeljau, den Stockfisch – eine haltbare Fastenspeise." },
  nowgorod: { name: "Nowgorod (Peterhof)", lon: 31.27, lat: 58.52, goods: "Pelze, Wachs", text: "Im Peterhof in Nowgorod kauften die Kaufleute Pelze und Wachs aus den Wäldern Russlands." },
};

const HANSE_CITIES: Array<{ name: string; lon: number; lat: number; side: "start" | "end"; dy: number }> = [
  { name: "Hamburg", lon: 9.99, lat: 53.55, side: "end", dy: -4 },
  { name: "Bremen", lon: 8.8, lat: 53.08, side: "end", dy: 6 },
  { name: "Köln", lon: 6.96, lat: 50.94, side: "start", dy: 12 },
  { name: "Stralsund", lon: 13.09, lat: 54.31, side: "start", dy: 4 },
  { name: "Danzig", lon: 18.65, lat: 54.35, side: "start", dy: 4 },
  { name: "Visby", lon: 18.29, lat: 57.64, side: "start", dy: 4 },
  { name: "Riga", lon: 24.1, lat: 56.95, side: "start", dy: 16 },
  { name: "Lüneburg", lon: 10.41, lat: 53.25, side: "start", dy: 16 },
];

export const hanseKarte: LabDef = {
  title: "Das Handelsnetz der Hanse",
  prompt:
    "Wähle ein Kontor und verfolge den Weg der Waren nach Lübeck. Welche Räume tauschten was miteinander?",
  init: () => ({ kontor: "luebeck", waren: false }),
  controls: () => [
    {
      type: "choice",
      key: "kontor",
      label: "Kontor",
      options: [{ value: "luebeck", label: "Lübeck (Zentrum)" }, ...Object.entries(KONTORE).map(([value, k]) => ({ value, label: k.name }))],
    },
    { type: "toggle", key: "waren", label: "Warenströme einblenden" },
  ],
  goals: (s) => [
    { text: "Das Kontor finden, aus dem Pelze und Wachs kamen", met: str(s, "kontor") === "nowgorod" },
    { text: "Das Kontor für Stockfisch finden", met: str(s, "kontor") === "bergen" },
    { text: "Die Warenströme einblenden und den Tausch zwischen Ost und West in Brügge verfolgen", met: Boolean(s.waren) && str(s, "kontor") === "bruegge" },
  ],
  draw: (s) => {
    const f = HANSE_FRAME;
    const k = str(s, "kontor");
    const [lx, ly] = atCrop(f, 10.69, 53.87);
    const clampY = (y: number) => Math.max(14, y);
    const kontor = (key: string) => {
      const c = KONTORE[key];
      const [x, y0] = atCrop(f, c.lon, c.lat);
      const y = clampY(y0);
      const on = k === key;
      const side = c.lon > 20 || key === "london" ? "end" : "start";
      const dy = key === "bruegge" ? 18 : 4;
      const off = y0 < 14 ? label(x + (side === "end" ? -12 : 12), y + 18, "↑ weiter nördlich", "lbl tiny muted", side) : "";
      return `${on ? `<line x1="${f1(lx)}" y1="${f1(ly)}" x2="${f1(x)}" y2="${f1(y)}" stroke="${C.blue}" stroke-width="4"/>` : ""}<rect x="${f1(x - 8)}" y="${f1(y - 8)}" width="16" height="16" fill="${on ? C.blue : "var(--f-halo)"}" stroke="${C.blue}" stroke-width="2.5"/>${label(x + (side === "end" ? -12 : 12), y + dy, c.name, "lbl tiny strong", side)}${off}`;
    };
    const [ox, oy] = atCrop(f, 28, 57.4);
    const [wx, wy] = atCrop(f, 4, 51.4);
    const flows = s.waren
      ? `${arrow(ox, oy, lx + 30, ly - 10, "arrow power")}${arrow(lx - 20, ly + 6, wx + 20, wy - 6, "arrow power")}${arrow(wx + 24, wy + 10, lx - 14, ly + 18, "arrow thin")}${labels(lx + 60, ly - 40, "Pelze, Wachs,\nGetreide →", "lbl tiny strong", "start", 13)}${labels(wx + 30, wy + 34, "← Tuch, Wein\nnach Osten", "lbl tiny strong", "start", 13)}`
      : "";
    return svg(
      f.width,
      f.height,
      `Karte der Hanse mit Lübeck und dem Kontor ${k === "luebeck" ? "–" : KONTORE[k].name}`,
      `${frameBase(f)}
       ${HANSE_CITIES.map((c) => {
         const [x, y] = atCrop(f, c.lon, c.lat);
         return `${dot(x, y, "city", 4)}${label(x + (c.side === "start" ? 7 : -7), y + c.dy, c.name, "lbl tiny", c.side)}`;
       }).join("")}
       ${Object.keys(KONTORE).map(kontor).join("")}
       ${flows}
       ${dot(lx, ly, "capital", 7)}${label(lx + 4, ly - 12, "Lübeck", "lbl small strong", "middle")}
       ${label(atCrop(f, 2, 55.5)[0], atCrop(f, 2, 55.5)[1], "Nordsee", "lbl small sea-label")}
       ${label(atCrop(f, 19.5, 55.6)[0], atCrop(f, 19.5, 55.6)[1], "Ostsee", "lbl small sea-label")}`,
    );
  },
  readout: (s) => {
    const k = str(s, "kontor");
    const base = k === "luebeck" ? "Lübeck war das Zentrum der Hanse; hier tagten die Hansetage. Wähle ein Kontor." : `${KONTORE[k].name}: ${KONTORE[k].text} Wichtige Waren: ${KONTORE[k].goods}.`;
    return s.waren ? `${base} Rohstoffe aus dem Osten und Norden flossen nach Westen, Fertigwaren wie Tuch nach Osten – die Hanse verdiente am Zwischenhandel.` : base;
  },
};

