/**
 * Interactive models for LB 1 (König und Reich) and LB 2 (Leben und Kultur im
 * Mittelalter):
 * - ottonenReich: map stepper 843–962 (Natural Earth, Central Europe)
 * - investiturstreit: power balance between king, pope and princes 1000–1122
 * - lehnswesen: feudal pyramid with roles and heritability
 * - kurfuerstenwahl: the seven electors of the Golden Bull vote
 * - kathedrale: build a Romanesque or Gothic church
 * - altstadt: read the plan of a medieval old town
 * - pestKarte: spread of the Black Death 1346–1351 (Natural Earth, Europe)
 */
import { arrow, badgePill, crown, dot, f1, label, labels, panel, person, svg } from "../figures/draw";
import {
  atCrop,
  CENTRAL_FRAME,
  type CropFrame,
  EUROPE_FRAME,
  frameBase,
  GERMANY_FRAME,
} from "../figures/maps";
import { C } from "../figures/scenes-lb1-2";
import { type LabDef, num, remember, seen, str } from "./core";

/* ---------- LB 1: Vom Ostfrankenreich zum Reich der Ottonen ---------- */

export const OTTONEN_STEPS: Record<
  string,
  { year: string; title: string; text: string; lon: number; lat: number; place: string }
> = {
  "843": { year: "843", title: "Vertrag von Verdun", text: "Die Enkel Karls des Großen teilen das Frankenreich; im Osten entsteht das Ostfrankenreich.", lon: 5.39, lat: 49.16, place: "Verdun" },
  "919": { year: "919", title: "Wahl Heinrichs I.", text: "Franken und Sachsen wählen in Fritzlar den Sachsenherzog Heinrich zum König.", lon: 9.27, lat: 51.13, place: "Fritzlar" },
  "936": { year: "936", title: "Krönung Ottos I.", text: "Otto wird in Aachen auf den Thron Karls des Großen gesetzt und gesalbt.", lon: 6.08, lat: 50.77, place: "Aachen" },
  "955": { year: "955", title: "Schlacht auf dem Lechfeld", text: "Otto besiegt die Ungarn bei Augsburg; sein Ansehen steigt im ganzen Reich.", lon: 10.9, lat: 48.37, place: "Lechfeld bei Augsburg" },
  "962": { year: "962", title: "Kaiserkrönung in Rom", text: "Papst Johannes XII. krönt Otto den Großen zum Kaiser.", lon: 12.5, lat: 41.9, place: "Rom" },
};

const DUCHIES: Array<{ name: string; lon: number; lat: number; c: string }> = [
  { name: "Sachsen", lon: 10.6, lat: 52.6, c: C.red },
  { name: "Franken", lon: 9.4, lat: 50.2, c: C.ochre },
  { name: "Bayern", lon: 12.6, lat: 48.4, c: C.blue },
  { name: "Schwaben", lon: 9.3, lat: 47.9, c: C.green },
  { name: "Lothringen", lon: 6.2, lat: 50.2, c: C.purple },
  { name: "Italien (ab 951)", lon: 11.0, lat: 44.6, c: C.slate },
];

export const ottonenReich: LabDef = {
  title: "Der Weg zum Reich der Ottonen",
  prompt:
    "Springe durch die Stationen von 843 bis 962. Wo geschah was – und wie weit reichte die Herrschaft?",
  init: () => ({ year: "843", duchies: false }),
  controls: () => [
    {
      type: "choice",
      key: "year",
      label: "Station",
      options: Object.keys(OTTONEN_STEPS).map((y) => ({ value: y, label: y })),
    },
    { type: "toggle", key: "duchies", label: "Herzogtümer einblenden" },
  ],
  goals: (s) => [
    { text: "Den Ort der Königswahl von 919 finden", met: str(s, "year") === "919" },
    { text: "Den Sieg über die Ungarn 955 auf der Karte verorten", met: str(s, "year") === "955" },
    {
      text: "Mit eingeblendeten Herzogtümern zur Kaiserkrönung 962 springen",
      met: str(s, "year") === "962" && Boolean(s.duchies),
    },
  ],
  draw: (s) => {
    const f: CropFrame = CENTRAL_FRAME;
    const step = OTTONEN_STEPS[str(s, "year")];
    const [x, y] = atCrop(f, step.lon, step.lat);
    const [qx, qy] = atCrop(f, 11.15, 51.79);
    return svg(
      f.width,
      f.height,
      `Karte Mitteleuropas: ${step.year} ${step.title} in ${step.place}`,
      `${frameBase(f)}
       ${s.duchies ? DUCHIES.map((d) => {
         const [dx, dy] = atCrop(f, d.lon, d.lat);
         return `<circle cx="${f1(dx)}" cy="${f1(dy)}" r="34" fill="${d.c}" opacity="0.28"/>${label(dx, dy + 4, d.name, "lbl tiny strong")}`;
       }).join("") : ""}
       ${dot(qx, qy, "city")}${label(qx + 8, qy + 4, "Quedlinburg", "lbl tiny", "start")}
       ${str(s, "year") !== "843" ? arrow(qx, qy, x + (x < qx ? 10 : -6), y - 10, "arrow power") : ""}
       <circle cx="${f1(x)}" cy="${f1(y)}" r="16" fill="none" stroke="var(--accent)" stroke-width="4"/>
       ${dot(x, y, "capital", 6)}
       ${label(x + 20, y + 4, step.place, "lbl small strong", "start")}
       ${panel(12, 12, 300, 70, "panel-bg")}
       ${badgePill(64, 34, 84, step.year)}
       ${label(116, 38, step.title, "lbl small strong", "start")}
       ${labels(24, 60, step.text.length > 46 ? step.text.replace(/^(.{1,46})\s/, "$1\n") : step.text, "lbl tiny", "start", 13)}`,
    );
  },
  readout: (s) => {
    const step = OTTONEN_STEPS[str(s, "year")];
    return `${step.year}: ${step.title} – ${step.text}`;
  },
};

/* ---------- LB 1: Investiturstreit ---------- */

export const INVESTITUR_STEPS = [
  { year: "um 1000", title: "Reichskirche", king: 80, pope: 20, text: "Der König setzt Bischöfe ein; die Kirche ist eine Stütze seiner Herrschaft." },
  { year: "1075", title: "Verbot der Laieninvestitur", king: 60, pope: 40, text: "Gregor VII. verbietet, dass Laien Geistliche einsetzen." },
  { year: "1076", title: "Absetzung und Kirchenbann", king: 35, pope: 65, text: "Heinrich IV. erklärt den Papst für abgesetzt; der Papst bannt den König und löst die Treueide." },
  { year: "1077", title: "Gang nach Canossa", king: 45, pope: 55, text: "Heinrich erreicht durch Buße die Lösung vom Bann – um den Preis seines Ansehens." },
  { year: "1122", title: "Wormser Konkordat", king: 50, pope: 50, text: "Ring und Stab gibt die Kirche, das Zepter mit den weltlichen Rechten der König." },
];

export const investiturstreit: LabDef = {
  title: "Machtwaage im Investiturstreit",
  prompt:
    "Bewege dich durch den Streit zwischen König und Papst. Wie verschiebt sich die Macht – und welche Rolle spielen die Fürsten?",
  init: () => ({ step: 0, fuersten: false }),
  controls: () => [
    {
      type: "range",
      key: "step",
      label: "Zeitpunkt",
      min: 0,
      max: INVESTITUR_STEPS.length - 1,
      step: 1,
      format: (v) => INVESTITUR_STEPS[v].year,
    },
    { type: "toggle", key: "fuersten", label: "Fürsten einblenden" },
  ],
  goals: (s) => [
    { text: "Untersuchen, wie der Kirchenbann von 1076 den König unter Druck setzt", met: num(s, "step") === 2 },
    { text: "In Canossa 1077 die Rolle der Fürsten einblenden", met: num(s, "step") === 3 && Boolean(s.fuersten) },
    { text: "Die Lösung von 1122 untersuchen", met: num(s, "step") === 4 },
  ],
  draw: (s) => {
    const st = INVESTITUR_STEPS[num(s, "step")];
    const tilt = ((st.pope - st.king) / 100) * 22;
    const fx = Boolean(s.fuersten);
    const fWeight = num(s, "step") >= 2 ? (num(s, "step") === 4 ? 2 : 3) : 1;
    return svg(
      640,
      316,
      `Machtwaage ${st.year}: König ${st.king}, Papst ${st.pope}`,
      `${panel(8, 8, 624, 300, "panel-bg")}
       ${badgePill(320, 32, 300, `${st.year} · ${st.title}`)}
       <polygon points="320,110 300,240 340,240" fill="var(--f-wood)"/>
       <g transform="rotate(${f1(tilt)} 320 110)">
         <rect x="120" y="104" width="400" height="10" rx="4" fill="var(--f-ink)"/>
         <line x1="150" y1="114" x2="150" y2="160" stroke="var(--f-ink)" stroke-width="2"/>
         <line x1="490" y1="114" x2="490" y2="160" stroke="var(--f-ink)" stroke-width="2"/>
         <path d="M100 160H200L186 180H114Z" fill="${C.red}"/>
         <path d="M440 160H540L526 180H454Z" fill="${C.purple}"/>
         ${crown(150, 156, 0.8)}
         <path d="M482 150L490 126L498 150Z" fill="#f2cf3d" stroke="var(--f-ink)"/>
         ${label(150, 200, `König ${st.king}`, "lbl small strong")}
         ${label(490, 200, `Papst ${st.pope}`, "lbl small strong")}
       </g>
       ${fx ? `${Array.from({ length: fWeight }, (_, i) => person(560 - i * 26, 268, 0.8, "cloth-a")).join("")}${labels(470, 236, fWeight >= 3 ? "Fürsten nutzen den Streit\nund drohen mit Neuwahl" : fWeight === 2 ? "Fürsten gewinnen\nan Einfluss" : "Fürsten stützen\nden König", "lbl tiny strong", "end", 13)}` : ""}
       ${labels(24, 278, st.text.replace(/^(.{1,70})\s/, "$1\n"), "lbl tiny", "start", 14)}`,
    );
  },
  readout: (s) => {
    const st = INVESTITUR_STEPS[num(s, "step")];
    return `${st.year}: ${st.text}${s.fuersten && num(s, "step") >= 2 ? " Die Fürsten nutzen die Schwäche des Königs für ihre eigene Macht." : ""}`;
  },
};

/* ---------- LB 1: Lehnswesen ---------- */

const ROLES: Record<string, { label: string; text: string }> = {
  ueberblick: { label: "Überblick", text: "Lehen und Schutz gehen nach unten, Treue, Rat und Kriegsdienst nach oben." },
  koenig: { label: "König", text: "Oberster Lehnsherr: vergibt Lehen an Herzöge, Grafen und Bischöfe und braucht ihre Treue und Krieger." },
  kronvasall: { label: "Kronvasall", text: "Herzog oder Bischof: Vasall des Königs, zugleich Lehnsherr seiner eigenen Untervasallen." },
  untervasall: { label: "Untervasall", text: "Ritter: schuldet seinem direkten Herrn Treue und Kriegsdienst – nicht unmittelbar dem König." },
};

export const lehnswesen: LabDef = {
  title: "Schaubild Lehnswesen",
  prompt:
    "Wähle eine Stufe der Lehnspyramide. Was gibt sie, was erhält sie – und was ändert sich, wenn Lehen erblich werden?",
  init: () => ({ role: "ueberblick", erblich: false }),
  controls: () => [
    {
      type: "choice",
      key: "role",
      label: "Stufe",
      options: Object.entries(ROLES).map(([value, r]) => ({ value, label: r.label })),
    },
    { type: "toggle", key: "erblich", label: "Lehen werden erblich" },
  ],
  goals: (s) => [
    { text: "Die doppelte Rolle eines Kronvasallen untersuchen", met: str(s, "role") === "kronvasall" },
    { text: "Herausfinden, wem ein Ritter als Untervasall Treue schuldet", met: str(s, "role") === "untervasall" },
    {
      text: "Erblichkeit einschalten und prüfen, wie sich die Macht des Königs verändert",
      met: Boolean(s.erblich) && str(s, "role") === "koenig",
    },
  ],
  draw: (s) => {
    const role = str(s, "role");
    const er = Boolean(s.erblich);
    const tiers = [
      { id: "koenig", y: 50, w: 140, t: "König", c: C.red },
      { id: "kronvasall", y: 120, w: 300, t: "Kronvasallen: Herzöge, Grafen, Bischöfe", c: C.purple },
      { id: "untervasall", y: 190, w: 460, t: "Untervasallen: Ritter", c: C.blue },
    ];
    return svg(
      640,
      300,
      `Lehnspyramide mit Hervorhebung: ${ROLES[role].label}`,
      `${panel(8, 8, 624, 284, "panel-bg")}
       ${tiers
         .map((t) => {
           const on = role === t.id || role === "ueberblick";
           const w = t.id === "koenig" && er ? 100 : t.id === "kronvasall" && er ? 360 : t.w;
           return `<rect x="${f1(320 - w / 2)}" y="${t.y}" width="${w}" height="50" rx="10" fill="${on ? t.c : "var(--surface)"}" stroke="${t.c}" stroke-width="2.4"/>
             ${label(320, t.y + 30, t.t, `lbl small strong${on ? " on-dark" : ""}`)}`;
         })
         .join("")}
       <rect x="70" y="252" width="500" height="30" rx="8" fill="var(--f-grass)" opacity="0.35"/>
       ${label(320, 272, "Bauern bewirtschaften das Land (Grundherrschaft)", "lbl tiny strong")}
       ${arrow(96, 70, 96, 220)}
       ${labels(84, 120, "Lehen\nund\nSchutz", "lbl tiny strong", "end", 13)}
       ${arrow(544, 220, 544, 70)}
       ${labels(556, 120, "Treue,\nRat und\nKriegs-\ndienst", "lbl tiny strong", "start", 13)}
       ${er ? `${badgePill(320, 30, 330, "Erblich: Lehen bleiben in den Familien", C.ochre)}` : ""}`,
    );
  },
  readout: (s) => {
    const base = ROLES[str(s, "role")].text;
    if (!s.erblich) return base;
    return `${base} Erblichkeit: Der König kann Lehen nach dem Tod eines Vasallen nicht mehr neu vergeben – die Familien der Fürsten werden mächtiger, der König schwächer.`;
  },
};

/* ---------- LB 1: Kurfürstenwahl nach der Goldenen Bulle ---------- */

export const ELECTORS: Array<{ key: string; name: string; seat: string; lon: number; lat: number; spiritual: boolean; side: "start" | "end"; dy: number }> = [
  { key: "mainz", name: "Erzbischof von Mainz", seat: "Mainz", lon: 8.27, lat: 50.0, spiritual: true, side: "end", dy: 16 },
  { key: "koeln", name: "Erzbischof von Köln", seat: "Köln", lon: 6.96, lat: 50.94, spiritual: true, side: "start", dy: -6 },
  { key: "trier", name: "Erzbischof von Trier", seat: "Trier", lon: 6.64, lat: 49.75, spiritual: true, side: "end", dy: 4 },
  { key: "boehmen", name: "König von Böhmen", seat: "Prag", lon: 14.42, lat: 50.09, spiritual: false, side: "end", dy: 22 },
  { key: "pfalz", name: "Pfalzgraf bei Rhein", seat: "Heidelberg", lon: 8.69, lat: 49.41, spiritual: false, side: "start", dy: 8 },
  { key: "sachsen", name: "Herzog von Sachsen", seat: "Wittenberg", lon: 12.65, lat: 51.87, spiritual: false, side: "start", dy: 4 },
  { key: "brandenburg", name: "Markgraf von Brandenburg", seat: "Brandenburg", lon: 12.55, lat: 52.41, spiritual: false, side: "start", dy: 4 },
];

export const countVotes = (s: Record<string, unknown>) =>
  ELECTORS.filter((e) => Boolean(s[e.key])).length;

export const kurfuerstenwahl: LabDef = {
  title: "Königswahl nach der Goldenen Bulle (1356)",
  prompt:
    "Lege fest, welche Kurfürsten für Kandidat A stimmen; alle anderen wählen Kandidat B. Wann ist ein König gewählt?",
  init: () => Object.fromEntries(ELECTORS.map((e) => [e.key, false])),
  controls: () =>
    ELECTORS.map((e) => ({
      type: "toggle" as const,
      key: e.key,
      label: `${e.name} stimmt für A`,
    })),
  goals: (s) => {
    const a = countVotes(s);
    return [
      {
        text: "Prüfen, dass die drei geistlichen Kurfürsten allein keine Mehrheit haben",
        met: a === 3 && ELECTORS.filter((e) => e.spiritual).every((e) => Boolean(s[e.key])),
      },
      { text: "Mit vier Stimmen eine Mehrheit für Kandidat A bilden", met: a >= 4 },
      { text: "Eine einstimmige Wahl aller sieben Kurfürsten herbeiführen", met: a === 7 },
    ];
  },
  draw: (s) => {
    const f = GERMANY_FRAME;
    const a = countVotes(s);
    const [fx, fy] = atCrop(f, 8.68, 50.11);
    const [ax, ay] = atCrop(f, 6.08, 50.77);
    const map = `${frameBase(f, true)}
      ${ELECTORS.map((e) => {
        const [x, y] = atCrop(f, e.lon, e.lat);
        const vote = Boolean(s[e.key]);
        return `<circle cx="${f1(x)}" cy="${f1(y)}" r="10" fill="${vote ? C.green : C.slate}" stroke="${e.spiritual ? "#f2cf3d" : "var(--f-halo)"}" stroke-width="3"/>${label(x + (e.side === "start" ? 13 : -13), y + e.dy, e.seat, "lbl tiny strong", e.side)}`;
      }).join("")}
      <rect x="${f1(fx - 7)}" y="${f1(fy - 7)}" width="14" height="14" fill="var(--f-red)" transform="rotate(45 ${f1(fx)} ${f1(fy)})"/>
      ${label(fx + 12, fy - 8, "Wahl in Frankfurt", "lbl tiny strong", "start")}
      ${dot(ax, ay, "capital")}${label(ax - 4, ay + 20, "Krönung in Aachen", "lbl tiny strong", "start")}`;
    const result = a >= 4 ? "Kandidat A ist gewählt" : "Kandidat B ist gewählt";
    return svg(
      640,
      527,
      `Karte der sieben Kurfürsten: ${a} Stimmen für A, ${7 - a} für B – ${result}`,
      `<g>${map}</g>
       ${panel(428, 12, 204, 300, "panel-bg")}
       ${label(530, 38, "Auszählung", "lbl small strong")}
       <rect x="446" y="56" width="${f1((a / 7) * 168)}" height="24" fill="${C.green}"/>
       <rect x="${f1(446 + (a / 7) * 168)}" y="56" width="${f1(((7 - a) / 7) * 168)}" height="24" fill="${C.slate}"/>
       <line x1="${f1(446 + (3.5 / 7) * 168)}" y1="50" x2="${f1(446 + (3.5 / 7) * 168)}" y2="86" stroke="var(--f-ink)" stroke-dasharray="3 2"/>
       ${label(530, 104, `A: ${a}  ·  B: ${7 - a}`, "lbl small strong")}
       ${badgePill(530, 134, 176, result, a >= 4 ? C.green : C.slate)}
       ${labels(442, 170, "Grün: Stimme für A\nGrau: Stimme für B\nGoldener Rand: geistlicher\nKurfürst\n\nMehrheit: mindestens 4\nvon 7 Stimmen", "lbl tiny", "start", 16)}`,
    );
  },
  readout: (s) => {
    const a = countVotes(s);
    const geistlich = ELECTORS.filter((e) => e.spiritual && Boolean(s[e.key])).length;
    return `Für A stimmen ${a} Kurfürsten (davon ${geistlich} geistliche), für B ${7 - a}. ${a >= 4 ? "A hat die Mehrheit und wird in Aachen gekrönt." : "B hat die Mehrheit – drei Stimmen reichen nicht."}`;
  },
};

/* ---------- LB 2: Romanik oder Gotik? ---------- */

export function churchStyle(s: Record<string, unknown>): "romanik" | "gotik" | "gefahr" | "mischung" {
  const bogen = String(s.bogen);
  const wand = String(s.wand);
  const fenster = String(s.fenster);
  if (fenster === "gross" && wand === "dick") return "gefahr";
  if (bogen === "rund" && wand === "dick" && fenster === "klein") return "romanik";
  if (bogen === "spitz" && wand === "streben" && fenster === "gross") return "gotik";
  return "mischung";
}

export const kathedrale: LabDef = {
  title: "Baue eine Kirche",
  prompt:
    "Wähle Bogenform, Wandbau und Fenster. Entsteht eine romanische oder eine gotische Kirche – und was trägt das Gewölbe?",
  init: () => ({ bogen: "spitz", wand: "dick", fenster: "klein" }),
  controls: () => [
    { type: "choice", key: "bogen", label: "Bogen", options: [{ value: "rund", label: "Rundbogen" }, { value: "spitz", label: "Spitzbogen" }] },
    { type: "choice", key: "wand", label: "Wände", options: [{ value: "dick", label: "dicke Mauern" }, { value: "streben", label: "Pfeiler mit Strebewerk" }] },
    { type: "choice", key: "fenster", label: "Fenster", options: [{ value: "klein", label: "kleine Fenster" }, { value: "gross", label: "große Glasfenster" }] },
  ],
  goals: (s) => [
    { text: "Eine rein romanische Kirche bauen", met: churchStyle(s) === "romanik" },
    { text: "Eine rein gotische Kirche bauen", met: churchStyle(s) === "gotik" },
    { text: "Große Fenster ohne Strebewerk ausprobieren und die Warnung lesen", met: churchStyle(s) === "gefahr" },
  ],
  draw: (s) => {
    const spitz = str(s, "bogen") === "spitz";
    const streben = str(s, "wand") === "streben";
    const gross = str(s, "fenster") === "gross";
    const style = churchStyle(s);
    const wallW = streben ? 16 : 40;
    const roofTop = spitz ? 40 : 70;
    const arch = (x: number, w: number, top: number, bottom: number) =>
      spitz
        ? `M${x} ${bottom}V${top + w * 0.8}Q${x} ${top} ${x + w / 2} ${top}Q${x + w} ${top} ${x + w} ${top + w * 0.8}V${bottom}Z`
        : `M${x} ${bottom}V${top + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${top + w / 2}V${bottom}Z`;
    const win = gross ? { w: 40, top: 110, bottom: 220 } : { w: 18, top: 150, bottom: 185 };
    const tag =
      style === "romanik" ? "Romanik" : style === "gotik" ? "Gotik" : style === "gefahr" ? "Einsturzgefahr!" : "Stilmischung";
    const tagC = style === "romanik" ? C.brown : style === "gotik" ? C.blue : style === "gefahr" ? C.red : C.slate;
    return svg(
      640,
      300,
      `Querschnitt einer Kirche: ${tag}`,
      `${panel(8, 8, 624, 284, "panel-bg")}
       <path d="M150 ${roofTop + 60}L320 ${roofTop}L490 ${roofTop + 60}Z" fill="var(--f-wood)" stroke="var(--f-ink)"/>
       <rect x="${150}" y="${roofTop + 60}" width="${wallW}" height="${250 - roofTop - 60}" fill="var(--f-stone)" stroke="var(--f-ink)"/>
       <rect x="${490 - wallW}" y="${roofTop + 60}" width="${wallW}" height="${250 - roofTop - 60}" fill="var(--f-stone)" stroke="var(--f-ink)"/>
       <rect x="${150 + wallW}" y="${roofTop + 60}" width="${340 - 2 * wallW}" height="${250 - roofTop - 60}" fill="var(--surface)" opacity="0.6"/>
       <path d="${arch(270, 100, roofTop + 70, 250)}" fill="none" stroke="var(--f-ink)" stroke-width="2"/>
       <path d="${arch(178 + (streben ? 0 : 10), win.w, win.top, win.bottom)}" fill="${gross ? "#2f7fd0" : "#3a3026"}" stroke="var(--f-ink)"/>
       <path d="${arch(462 - win.w - (streben ? 0 : 10), win.w, win.top, win.bottom)}" fill="${gross ? "#2f7fd0" : "#3a3026"}" stroke="var(--f-ink)"/>
       ${streben ? `<path d="M150 150L96 210V250H120V214L150 186" fill="var(--f-stone)" stroke="var(--f-ink)"/><path d="M490 150L544 210V250H520V214L490 186" fill="var(--f-stone)" stroke="var(--f-ink)"/>${label(80, 200, "Strebewerk", "lbl tiny strong", "end")}` : ""}
       ${style === "gefahr" ? `<path d="M${150 + wallW / 2} 120L${160 + wallW / 2} 140L${148 + wallW / 2} 160" stroke="${C.red}" stroke-width="3" fill="none"/><path d="M${490 - wallW / 2} 120L${480 - wallW / 2} 140L${492 - wallW / 2} 160" stroke="${C.red}" stroke-width="3" fill="none"/>` : ""}
       <line x1="40" y1="250" x2="600" y2="250" stroke="var(--f-line)" stroke-width="2"/>
       ${badgePill(320, 280, 200, tag, tagC)}`,
    );
  },
  readout: (s) => {
    const style = churchStyle(s);
    if (style === "romanik") return "Romanik: Rundbögen und dicke Mauern tragen das Gewölbe; deshalb bleiben die Fenster klein – die Kirche wirkt wie eine Burg Gottes.";
    if (style === "gotik") return "Gotik: Spitzbögen, Pfeiler und Strebewerk leiten die Last nach außen; die Wände werden zu großen Glasfenstern, der Raum füllt sich mit Licht.";
    if (style === "gefahr") return "Große Fenster in einer tragenden Mauer schwächen sie: Ohne Strebewerk drohen Risse und Einsturz. Genau dieses Problem löste die Gotik.";
    return "Diese Mischung passt zu keinem reinen Stil. Prüfe, welche Merkmale zur Romanik und welche zur Gotik gehören.";
  },
};

/* ---------- LB 2: Altstadtplan ---------- */

export const OLD_TOWN: Record<string, { label: string; text: string }> = {
  ueberblick: { label: "Überblick", text: "Eine typische mittelalterliche Stadt: Mauerring, Markt in der Mitte, Fluss und Burg." },
  mauer: { label: "Mauer und Tore", text: "Stadtmauer und Tore schützten die Bürger und kontrollierten, wer und welche Waren hereinkamen – oft gegen Zoll." },
  markt: { label: "Marktplatz", text: "Mit dem Marktrecht begann die Stadt. Hier boten Händler und Handwerker ihre Waren an." },
  rathaus: { label: "Rathaus", text: "Sitz des Rates: Hier verwalteten die Bürger ihre Stadt selbst, sprachen Recht und legten Steuern fest." },
  kirche: { label: "Hauptkirche", text: "Die große Pfarrkirche am Markt zeigte Frömmigkeit und Reichtum der Bürger." },
  gerber: { label: "Gerbergasse", text: "Gerber brauchten viel Wasser und stanken – deshalb arbeiteten sie am Fluss, flussabwärts der Stadt." },
  judengasse: { label: "Judengasse", text: "Jüdische Familien lebten nahe Markt und Synagoge – später in vielen Städten in einem abgeschlossenen Viertel." },
  spital: { label: "Spital", text: "Ein Spital versorgte Kranke, Alte und Arme; Bürger stifteten dafür Geld." },
  burg: { label: "Burg", text: "Die Burg des Stadtherrn lag oft erhöht; viele Städte entstanden in ihrem Schutz." },
};

export const altstadt: LabDef = {
  title: "Einen Altstadtplan lesen",
  prompt:
    "Wähle die Teile der Stadt aus. Was verrät ihre Lage über Handel, Schutz, Selbstverwaltung und Zusammenleben?",
  init: () => ({ ort: "ueberblick", seenOrte: "" }),
  controls: () => [
    {
      type: "choice",
      key: "ort",
      label: "Ort im Plan",
      options: Object.entries(OLD_TOWN).map(([value, o]) => ({ value, label: o.label })),
    },
  ],
  set: (state, key, value) => {
    state[key] = value;
    if (key === "ort") remember(state, "seenOrte", String(value));
  },
  goals: (s) => [
    { text: "Den Ort der Selbstverwaltung finden", met: str(s, "ort") === "rathaus" },
    { text: "Herausfinden, warum die Gerber am Fluss arbeiteten", met: str(s, "ort") === "gerber" },
    {
      text: "Alle acht Teile der Stadt einmal untersuchen",
      met: Object.keys(OLD_TOWN)
        .filter((k) => k !== "ueberblick")
        .every((k) => seen(s, "seenOrte", k)),
    },
  ],
  draw: (s) => {
    const o = str(s, "ort");
    const hi = (k: string) => (o === k ? "var(--accent)" : "var(--f-line)");
    const hw = (k: string) => (o === k ? 4 : 1.5);
    return svg(
      640,
      330,
      `Plan einer mittelalterlichen Altstadt, hervorgehoben: ${OLD_TOWN[o].label}`,
      `${panel(8, 8, 624, 314, "panel-bg")}
       <path d="M30 250Q200 270 340 300Q460 318 610 300" fill="none" stroke="var(--f-river)" stroke-width="22" opacity="0.8"/>
       ${label(560, 290, "Fluss", "lbl tiny strong")}
       <path d="M110 70L330 40L520 80L560 200L470 270L210 270L90 200Z" fill="var(--f-land)" stroke="${hi("mauer")}" stroke-width="${o === "mauer" ? 8 : 6}"/>
       ${[[110, 70], [520, 80], [470, 270], [90, 200]].map(([x, y]) => `<rect x="${x - 10}" y="${y - 10}" width="20" height="20" fill="var(--f-stone)" stroke="${hi("mauer")}" stroke-width="2"/>`).join("")}
       <path d="M200 150L460 150M330 60V260M150 110L300 150M470 110L360 150" stroke="var(--f-stone)" stroke-width="6"/>
       <rect x="280" y="125" width="110" height="60" fill="#f4e6c8" stroke="${hi("markt")}" stroke-width="${hw("markt")}"/>
       ${label(335, 160, "Markt", "lbl tiny strong")}
       <rect x="392" y="128" width="40" height="26" fill="${C.red}" stroke="${hi("rathaus")}" stroke-width="${hw("rathaus")}"/>
       ${label(412, 122, "Rathaus", "lbl tiny strong")}
       <path d="M240 128H272V178H240ZM248 128L256 104L264 128Z" fill="${C.purple}" stroke="${hi("kirche")}" stroke-width="${hw("kirche")}"/>
       ${label(232, 196, "Kirche", "lbl tiny strong", "end")}
       <rect x="300" y="230" width="90" height="22" fill="var(--f-wood)" stroke="${hi("gerber")}" stroke-width="${hw("gerber")}"/>
       ${label(345, 246, "Gerbergasse", "lbl tiny on-dark strong")}
       <rect x="400" y="190" width="70" height="40" fill="${C.ochre}" opacity="0.8" stroke="${hi("judengasse")}" stroke-width="${hw("judengasse")}"/>
       ${labels(435, 206, "Juden-\ngasse", "lbl tiny strong", "middle", 12)}
       <rect x="160" y="200" width="70" height="40" fill="${C.green}" opacity="0.8" stroke="${hi("spital")}" stroke-width="${hw("spital")}"/>
       ${label(195, 224, "Spital", "lbl tiny on-dark strong")}
       <path d="M300 34L330 14L360 34V52H300Z" fill="var(--f-stone)" stroke="${hi("burg")}" stroke-width="${hw("burg")}"/>
       ${label(380, 30, "Burg", "lbl tiny strong", "start")}
       ${label(60, 60, "Tor", "lbl tiny muted", "start")}`,
    );
  },
  readout: (s) => OLD_TOWN[str(s, "ort")].text,
};

/* ---------- LB 2: Ausbreitung der Pest ---------- */

export const PLAGUE_CITIES: Array<{ name: string; lon: number; lat: number; year: number }> = [
  { name: "Caffa", lon: 35.38, lat: 45.03, year: 1346 },
  { name: "Konstantinopel", lon: 28.98, lat: 41.01, year: 1347 },
  { name: "Messina", lon: 15.55, lat: 38.19, year: 1347 },
  { name: "Marseille", lon: 5.37, lat: 43.3, year: 1347 },
  { name: "Genua", lon: 8.93, lat: 44.41, year: 1348 },
  { name: "Venedig", lon: 12.33, lat: 45.44, year: 1348 },
  { name: "Florenz", lon: 11.25, lat: 43.77, year: 1348 },
  { name: "Barcelona", lon: 2.17, lat: 41.39, year: 1348 },
  { name: "Paris", lon: 2.35, lat: 48.86, year: 1348 },
  { name: "London", lon: -0.13, lat: 51.5, year: 1348 },
  { name: "Wien", lon: 16.37, lat: 48.21, year: 1349 },
  { name: "Frankfurt", lon: 8.68, lat: 50.11, year: 1349 },
  { name: "Köln", lon: 6.96, lat: 50.94, year: 1349 },
  { name: "Lübeck", lon: 10.69, lat: 53.87, year: 1350 },
  { name: "Danzig", lon: 18.65, lat: 54.35, year: 1350 },
];

export const pestKarte: LabDef = {
  title: "Die Ausbreitung der Pest 1346–1350",
  prompt:
    "Verschiebe das Jahr und beobachte, wie die Pest Europa erreichte. Welche Orte waren zuerst betroffen – und warum?",
  init: () => ({ year: 1346, wege: false }),
  controls: () => [
    { type: "range", key: "year", label: "Jahr", min: 1346, max: 1350, step: 1, format: (v) => String(v) },
    { type: "toggle", key: "wege", label: "Seehandelswege einblenden" },
  ],
  goals: (s) => [
    { text: "Verfolgen, wie die Pest 1347 mit Schiffen Sizilien erreichte", met: num(s, "year") === 1347 },
    { text: "Das Jahr finden, in dem die Pest Frankfurt und Köln erreichte", met: num(s, "year") === 1349 },
    { text: "Die Seehandelswege einblenden und erkennen, warum Häfen zuerst betroffen waren", met: Boolean(s.wege) && num(s, "year") >= 1348 },
  ],
  draw: (s) => {
    const f = EUROPE_FRAME;
    const y = num(s, "year");
    const reached = PLAGUE_CITIES.filter((c) => c.year <= y);
    const pt = (lon: number, lat: number) => atCrop(f, lon, lat).map(f1).join(" ");
    const routes = [
      [[35.38, 45.03], [29.0, 41.0], [26.0, 38.5], [15.55, 38.19], [9.0, 42.0], [5.37, 43.3]],
      [[15.55, 38.19], [12.33, 45.44]],
      [[5.37, 43.3], [2.17, 41.39]],
      [[-9.0, 43.5], [-5.0, 48.5], [-0.13, 51.5]],
    ];
    return svg(
      f.width,
      f.height,
      `Europakarte ${y}: Pest in ${reached.length} von ${PLAGUE_CITIES.length} Orten`,
      `${frameBase(f)}
       ${s.wege ? routes.map((r) => `<path d="M${r.map(([lo, la]) => pt(lo, la)).join("L")}" class="route-sea"/>`).join("") : ""}
       ${PLAGUE_CITIES.map((c) => {
         const [x, yy] = atCrop(f, c.lon, c.lat);
         const on = c.year <= y;
         return `${on ? `<circle cx="${f1(x)}" cy="${f1(yy)}" r="13" fill="${C.red}" opacity="0.3"/>` : ""}<circle cx="${f1(x)}" cy="${f1(yy)}" r="5" fill="${on ? C.red : "var(--f-halo)"}" stroke="var(--f-ink)" stroke-width="1.2"/>${on ? label(x + 8, yy + 4, `${c.name} ${c.year}`, "lbl tiny strong", "start") : ""}`;
       }).join("")}
       ${panel(12, 420, 270, 80, "panel-bg")}
       ${badgePill(70, 442, 90, String(y), C.red)}
       ${label(124, 446, `${reached.length} Orte erreicht`, "lbl small strong", "start")}
       ${labels(24, 468, "Vereinfacht nach den ersten Belegen;\nSkandinavien liegt nördlich des Ausschnitts.", "lbl tiny muted", "start", 13)}`,
    );
  },
  readout: (s) => {
    const y = num(s, "year");
    const now = PLAGUE_CITIES.filter((c) => c.year === y).map((c) => c.name);
    const base = now.length ? `${y}: Die Pest erreicht ${now.join(", ")}.` : `${y}: keine neuen Orte.`;
    return s.wege ? `${base} Schiffe genuesischer und venezianischer Händler brachten die Seuche von Hafen zu Hafen – erst danach ins Landesinnere.` : base;
  },
};
