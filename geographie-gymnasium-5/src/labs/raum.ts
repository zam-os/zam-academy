/** Labs of Lernbereich 3 to 5: coast, weather, land use and the city. */
import {
  choice,
  clamp,
  f1,
  fmt,
  handle,
  labSvg,
  type LabDef,
  type LabState,
  num,
  range,
  readout,
  str,
  text,
} from "./core";

/* ---------- Gezeiten, Sturmflut und Deich ---------- */

export const TIDE_PERIOD = 12.42;
export const TIDE_AMPLITUDE = 1.5;
export const STORM_SURGE = 4;
export const WATT_LEVEL = -1;
/** Water level in metres relative to the mean sea level. */
export const waterLevel = (t: number, storm: boolean): number =>
  TIDE_AMPLITUDE * Math.cos((2 * Math.PI * t) / TIDE_PERIOD) + (storm ? STORM_SURGE : 0);
const signed = (m: number) => `${m > 0.04 ? "+" : m < -0.04 ? "−" : ""}${fmt(Math.abs(m), 1)} m`;
const calm = (s: LabState) => str(s, "sturm") === "aus";

export const gezeiten: LabDef = {
  id: "gezeiten",
  title: "Ebbe, Flut und Sturmflut am Deich",
  intro:
    "Der Regler zeigt die Stunden nach dem letzten Hochwasser. Etwa alle 12 Stunden und 25 Minuten kommt das nächste. Schalte eine Sturmflut dazu und verändere die Höhe des Deichs.",
  initial: () => ({ t: 3, sturm: "aus", deich: 5 }),
  goals: [
    { text: "Stelle Niedrigwasser ein: Das Watt fällt trocken.", reached: (s) => calm(s) && waterLevel(num(s, "t"), false) < WATT_LEVEL - 0.2 },
    { text: "Stelle Hochwasser ein: Das Watt ist überflutet.", reached: (s) => calm(s) && waterLevel(num(s, "t"), false) > TIDE_AMPLITUDE - 0.3 },
    { text: "Sturmflut bei Hochwasser: Mach den Deich so hoch, dass er mit 50 cm Reserve hält.", reached: (s) => { const w = waterLevel(num(s, "t"), true); return !calm(s) && w > STORM_SURGE + TIDE_AMPLITUDE - 0.3 && num(s, "deich") >= w + 0.5; } },
  ],
  witnesses: [
    { t: 6.25, sturm: "aus", deich: 5 },
    { t: 0, sturm: "aus", deich: 5 },
    { t: 0, sturm: "an", deich: 6 },
  ],
  note: "Schema mit gerundeten Werten: 3 m Tidenhub und 4 m Sturmflutaufschlag. An der deutschen Nordseeküste ist der Tidenhub je nach Ort verschieden, echte Hauptdeiche sind meist deutlich höher als 6 m.",
  render(s) {
    const t = num(s, "t"),
      storm = !calm(s),
      dike = num(s, "deich");
    const w = waterLevel(t, storm);
    const Y = (m: number) => 250 - m * 22;
    const over = w > dike;
    const dryWatt = w < WATT_LEVEL;
    // Water first: Watt, dike and marsh cover it where the ground is higher.
    const body = `<rect class="sky" width="640" height="320" rx="12"/><rect class="sea-fill" x="0" y="${f1(Y(Math.min(w, dike)))}" width="470" height="${f1(320 - Y(Math.min(w, dike)))}"/>
      <path class="mudflat" d="M0 ${f1(Y(-2.6))}L60 ${f1(Y(-2.6))}L110 ${f1(Y(WATT_LEVEL))}L380 ${f1(Y(WATT_LEVEL))}L420 ${f1(Y(0.5))}L420 320L0 320Z"/>
      <path class="dike" d="M420 ${f1(Y(0.5))}L470 ${f1(Y(dike))}L500 ${f1(Y(dike))}L540 ${f1(Y(0.3))}L640 ${f1(Y(0.3))}L640 320L420 320Z"/>
      <path class="marsh" d="M540 ${f1(Y(0.3))}L640 ${f1(Y(0.3))}L640 320L540 320Z"/>
      <g class="house-small"><rect x="575" y="${f1(Y(0.3) - 26)}" width="34" height="26"/><path d="M571 ${f1(Y(0.3) - 26)}l21-16 21 16z"/></g>
      ${over ? `<path class="flood" d="M500 ${f1(Y(dike))}L640 ${f1(Y(dike) + 10)}L640 ${f1(Y(0.3))}L540 ${f1(Y(0.3))}Z"/>` : ""}
      <line class="level-line" x1="0" x2="470" y1="${f1(Y(0))}" y2="${f1(Y(0))}"/>${text(6, Y(0) - 5, "mittlerer Meeresspiegel", "lbl tiny", "start")}
      ${text(245, Y(WATT_LEVEL) + 26, dryWatt ? "Watt fällt trocken" : "Watt unter Wasser", "lbl small strong")}
      ${text(485, Y(dike) - 10, `Deich ${fmt(dike, 1)} m`, "lbl tiny strong")}${text(600, Y(0.3) + 30, "Marsch", "lbl tiny")}`;
    const state = over
      ? ["Das Wasser strömt über den Deich: Das Land dahinter wird überflutet!", "warn"]
      : storm
        ? [w > dike - 0.5 ? "Der Deich hält gerade noch, aber ohne Reserve." : "Der Deich hält die Sturmflut zurück.", w > dike - 0.5 ? "warn" : "good"]
        : [dryWatt ? "Ebbe: Das Wasser hat sich zurückgezogen, das Watt liegt frei." : w > 1.2 ? "Flut ist vorbei, es ist Hochwasser: Das Watt ist ganz überflutet." : "Das Wasser steigt oder fällt gerade.", ""];
    return `${range("t", "Stunden nach Hochwasser", t, 0, 12.5, 0.25, `${fmt(t, 2)} h`)}${choice("sturm", "Sturmflut", str(s, "sturm"), [["aus", "nein"], ["an", "ja"]])}${range("deich", "Deichhöhe", dike, 4, 9, 0.5, `${fmt(dike, 1)} m`)}${labSvg(640, 320, "Schnitt durch Meer, Watt, Deich und Marsch mit veränderlichem Wasserstand", body)}${readout(
      `Wasserstand: <strong>${signed(w)}</strong> gegenüber dem mittleren Meeresspiegel. ${state[0]}`,
      state[1] as "" | "good" | "warn",
    )}`;
  },
};

/* ---------- Wetterwoche ---------- */

export const WEEK = ["Mo", "Di", "Mi", "Do", "Fr"];
export const WEEK_TEMPS = [8, 10, 7, 5, 9];
export const WEEK_RAIN = [0, 2, 9, 4, 0];
/** Wednesday's readings at 7, 14 and 21 Uhr; the learner computes the mean. */
export const WEDNESDAY = [4, 11, 6];

export const wetterwoche: LabDef = {
  id: "wetterwoche",
  title: "Eine Wetterwoche auswerten",
  intro:
    "Für Mittwoch fehlen noch die Werte. Berechne die Tagesmitteltemperatur aus den drei Messungen und ziehe den Punkt und die Säule auf die richtigen Werte.",
  initial: () => ({ t2: 0, r2: 0, warm: "" }),
  goals: [
    { text: "Trage die Tagesmitteltemperatur vom Mittwoch ein.", reached: (s) => num(s, "t2") === WEEK_TEMPS[2] },
    { text: "Trage den Niederschlag vom Mittwoch ein.", reached: (s) => num(s, "r2") === WEEK_RAIN[2] },
    { text: "Klicke den wärmsten Tag der Woche an.", reached: (s) => str(s, "warm") === "Di" },
  ],
  handles: {
    t2: {
      pos: (s) => [306, 300 - num(s, "t2") * 16],
      move: (s, _x, y) => ({ ...s, t2: clamp(Math.round((300 - y) / 16), 0, 15) }),
      step: 16,
    },
    r2: {
      pos: (s) => [341, 300 - num(s, "r2") * 16],
      move: (s, _x, y) => ({ ...s, r2: clamp(Math.round((300 - y) / 16), 0, 15) }),
      step: 16,
    },
  },
  witnesses: [
    { t2: 7, r2: 0, warm: "" },
    { t2: 0, r2: 9, warm: "" },
    { t2: 0, r2: 0, warm: "Di" },
  ],
  note: "Erfundene Messwerte. Vereinfacht ist das Tagesmittel hier der Mittelwert der drei Ablesungen; Wetterdienste rechnen heute mit stündlichen Messwerten.",
  render(s) {
    const temps = WEEK_TEMPS.map((v, i) => (i === 2 ? num(s, "t2") : v));
    const rain = WEEK_RAIN.map((v, i) => (i === 2 ? num(s, "r2") : v));
    const X = (i: number) => 130 + i * 95;
    const table = `<table class="lab-table"><caption>Messwerte der Schulwetterstation</caption><tr><th></th>${WEEK.map((d) => `<th>${d}</th>`).join("")}</tr><tr><th>Tagesmittel</th>${WEEK_TEMPS.map((v, i) => `<td>${i === 2 ? "?" : `${v} °C`}</td>`).join("")}</tr><tr><th>Niederschlag</th>${WEEK_RAIN.map((v, i) => `<td>${i === 2 ? `${WEEK_RAIN[2]} mm` : `${v} mm`}</td>`).join("")}</tr></table><p class="small">Mittwoch: 7 Uhr ${WEDNESDAY[0]} °C · 14 Uhr ${WEDNESDAY[1]} °C · 21 Uhr ${WEDNESDAY[2]} °C. Tagesmittel = Summe der drei Werte : 3.</p>`;
    const grid = [0, 5, 10, 15].map((v) => `<line class="grid" x1="90" x2="580" y1="${300 - v * 16}" y2="${300 - v * 16}"/>${text(84, 304 - v * 16, `${v}`, "lbl tiny temp-label", "end")}${text(586, 304 - v * 16, `${v}`, "lbl tiny rain-label", "start")}`).join("");
    const bars = rain.map((r, i) => `<rect class="rain-bar ${i === 2 ? "editable" : ""}" x="${X(i) + 6}" y="${300 - r * 16}" width="30" height="${r * 16}"/>`).join("");
    const line = temps.map((v, i) => `${i ? "L" : "M"}${X(i) - 14} ${300 - v * 16}`).join("");
    const dots = temps.map((v, i) => (i === 2 ? "" : `<circle class="temp-dot" cx="${X(i) - 14}" cy="${300 - v * 16}" r="6"/>`)).join("");
    const body = `${grid}<line class="axis" x1="90" x2="580" y1="300" y2="300"/>${bars}<path class="temp-line" d="${line}"/>${dots}
      ${WEEK.map((d, i) => text(X(i), 322, d, "lbl small")).join("")}${text(90, 28, "°C", "lbl tiny strong temp-label")}${text(580, 28, "mm", "lbl tiny strong rain-label")}
      ${handle("t2", 306, 300 - num(s, "t2") * 16, "Temperaturpunkt Mittwoch", "handle-red", 8)}${handle("r2", 341, 300 - num(s, "r2") * 16, "Niederschlagssäule Mittwoch", "handle-blue", 8)}`;
    return `${table}${labSvg(640, 340, "Diagramm einer Woche mit roter Temperaturkurve und blauen Niederschlagssäulen; für Mittwoch sind Punkt und Säule verschiebbar", body)}${choice("warm", "Wärmster Tag", str(s, "warm"), WEEK.map((d) => [d, d]))}${readout(
      `Mittwoch im Diagramm: <strong>${fmt(num(s, "t2"), 0)} °C</strong> und <strong>${fmt(num(s, "r2"), 0)} mm</strong>.`,
    )}`;
  },
};

/* ---------- Natürliche Einflussfaktoren und Landnutzung ---------- */

export type Soil = "sand" | "lehm" | "loess";
export const USES = ["Ackerbau", "Grünland", "Wald"] as const;
/** A deliberately simple teaching model, not an agronomic forecast. */
export function suitability(temp: number, rain: number, soil: Soil): [number, number, number] {
  const ack =
    { loess: 3, lehm: 2, sand: 0.5 }[soil] +
    (temp >= 8 ? 1.5 : temp >= 7 ? 0.8 : 0) +
    (rain >= 550 && rain <= 900 ? 1.5 : rain <= 1100 ? 0.7 : 0);
  const gruen =
    (rain >= 1100 ? 2 : rain >= 900 ? 1 : 0.3) +
    (temp < 8 ? 1 : 0.5) +
    { loess: 0.8, lehm: 1, sand: 0.4 }[soil];
  const wald = (soil === "sand" ? 2 : 0.6) + (temp < 6.5 ? 1.5 : 0.5) + (rain >= 600 ? 0.5 : 0);
  return [ack, gruen, wald];
}
export function bestUse(temp: number, rain: number, soil: Soil): (typeof USES)[number] {
  const scores = suitability(temp, rain, soil);
  return USES[scores.indexOf(Math.max(...scores))];
}
const use = (s: LabState) => bestUse(num(s, "temp"), num(s, "rain"), str(s, "soil") as Soil);

export const landnutzung: LabDef = {
  id: "landnutzung",
  title: "Was wächst hier am besten?",
  intro:
    "Stelle die Jahresmitteltemperatur, den Jahresniederschlag und den Boden ein. Das Modell zeigt, welche Nutzung unter diesen Bedingungen am besten passt.",
  initial: () => ({ temp: 7.5, rain: 800, soil: "lehm" }),
  goals: [
    { text: "Bedingungen wie im Gäuboden: Auf Lössboden ist Ackerbau am besten.", reached: (s) => use(s) === "Ackerbau" && str(s, "soil") === "loess" },
    { text: "Bedingungen wie im Allgäu: Bei mindestens 1200 mm Niederschlag ist Grünland am besten.", reached: (s) => use(s) === "Grünland" && num(s, "rain") >= 1200 },
    { text: "Finde Bedingungen, unter denen auf Sandboden Wald am besten ist.", reached: (s) => use(s) === "Wald" && str(s, "soil") === "sand" },
  ],
  witnesses: [
    { temp: 8.5, rain: 700, soil: "loess" },
    { temp: 7, rain: 1500, soil: "lehm" },
    { temp: 6, rain: 800, soil: "sand" },
  ],
  note: "Stark vereinfachtes Lernmodell. In der Wirklichkeit zählen auch Hangneigung, Höhenlage, Betriebsgröße, Preise und die Entscheidung der Landwirtinnen und Landwirte.",
  render(s) {
    const temp = num(s, "temp"),
      rain = num(s, "rain"),
      soil = str(s, "soil") as Soil;
    const scores = suitability(temp, rain, soil);
    const best = use(s);
    const bars = USES.map((u, i) => `<rect class="use-track" x="140" y="${30 + i * 46}" width="300" height="26" rx="6"/><rect class="use-bar use-${i} ${u === best ? "use-best" : ""}" x="140" y="${30 + i * 46}" width="${f1((scores[i] / 6) * 300)}" height="26" rx="6"/>${text(130, 48 + i * 46, u, "lbl small", "end")}`).join("");
    const scene =
      best === "Ackerbau"
        ? `<rect class="field-a" x="470" y="70" width="150" height="80"/>${[0, 1, 2, 3, 4, 5].map((k) => `<line class="furrow" x1="${470 + k * 25}" x2="${490 + k * 25}" y1="150" y2="70"/>`).join("")}`
        : best === "Grünland"
          ? `<rect class="meadow" x="470" y="70" width="150" height="80"/><g class="cow-icon"><rect x="510" y="98" width="44" height="22" rx="8"/><rect x="550" y="92" width="16" height="14" rx="4"/><path d="M516 120v12M548 120v12"/></g>`
          : `<rect class="forest-floor" x="470" y="70" width="150" height="80"/>${[490, 520, 550, 580, 605].map((x) => `<path class="tree" d="M${x} 140l-14 0 14-50 14 50z"/>`).join("")}`;
    const body = `<rect class="panel-bg" width="640" height="170" rx="12"/>${bars}${scene}${text(545, 165, `am besten: ${best}`, "lbl tiny strong")}`;
    return `${range("temp", "Jahresmitteltemperatur", temp, 5, 10, 0.5, `${fmt(temp)} °C`)}${range("rain", "Jahresniederschlag", rain, 500, 2000, 50, `${fmt(rain, 0)} mm`)}${choice("soil", "Boden", soil, [["sand", "Sand: locker, nährstoffarm"], ["lehm", "Lehm"], ["loess", "Löss: fruchtbar"]])}${labSvg(640, 170, "Balken für die Eignung von Ackerbau, Grünland und Wald und eine kleine Landschaft der am besten geeigneten Nutzung", body)}${readout(
      `Bei ${fmt(temp)} °C, ${fmt(rain, 0)} mm und ${soil === "loess" ? "Lössboden" : soil === "lehm" ? "Lehmboden" : "Sandboden"} passt am besten: <strong>${best}</strong>.`,
    )}`;
  },
};

/* ---------- Pendler und Stadt-Umland ---------- */

/** Share of the 20 commuters who are in the city at each full hour. */
export const IN_CITY = [0, 0, 0, 0, 0, 0, 0.25, 0.6, 0.9, 1, 1, 1, 1, 1, 1, 1, 0.8, 0.45, 0.2, 0.05, 0, 0, 0, 0];
const flow = (h: number) => IN_CITY[h] - IN_CITY[(h + 23) % 24];

export const pendler: LabDef = {
  id: "pendler",
  title: "Ein Tag zwischen Stadt und Umland",
  intro:
    "20 Menschen aus den Dörfern im Umland arbeiten in der Stadt. Verschiebe die Uhrzeit und beobachte, wann sie pendeln.",
  initial: () => ({ h: 2 }),
  goals: [
    { text: "Zeige den Berufsverkehr am Morgen: Viele fahren gerade in die Stadt.", reached: (s) => flow(num(s, "h")) >= 0.25 },
    { text: "Finde eine Uhrzeit, zu der alle 20 in der Stadt arbeiten.", reached: (s) => IN_CITY[num(s, "h")] === 1 },
    { text: "Zeige den Feierabendverkehr: Viele fahren gerade zurück ins Umland.", reached: (s) => flow(num(s, "h")) <= -0.25 },
  ],
  witnesses: [{ h: 7 }, { h: 11 }, { h: 17 }],
  note: "Schema mit erfundenen Zahlen. Pendlerströme gibt es auch umgekehrt, aus der Stadt ins Umland, und zu Schulen, Einkauf und Freizeit.",
  render(s) {
    const h = num(s, "h");
    const inside = Math.round(IN_CITY[h] * 20);
    const f = flow(h);
    const villages: Array<[number, number, string]> = [[90, 70, "Adorf"], [550, 60, "Bheim"], [580, 230, "Cstetten"], [100, 250, "Dhausen"], [320, 268, "Ezell"]];
    const arrows = villages.map(([x, y]) => {
      if (Math.abs(f) < 0.05) return "";
      const [x1, y1, x2, y2] = f > 0 ? [x, y, 320 + (x - 320) * 0.35, 165 + (y - 165) * 0.35] : [320 + (x - 320) * 0.35, 165 + (y - 165) * 0.35, x, y];
      const a = Math.atan2(y2 - y1, x2 - x1);
      return `<g class="flow ${f > 0 ? "flow-in" : "flow-out"}"><line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke-width="${f1(2 + Math.abs(f) * 14)}"/><path d="M${f1(x2)} ${f1(y2)}l${f1(-14 * Math.cos(a - 0.5))} ${f1(-14 * Math.sin(a - 0.5))}l${f1(14 * Math.cos(a - 0.5) - 14 * Math.cos(a + 0.5))} ${f1(14 * Math.sin(a - 0.5) - 14 * Math.sin(a + 0.5))}z"/></g>`;
    }).join("");
    const people = Array.from({ length: 20 }, (_, i) => {
      const inCity = i < inside;
      const [vx, vy] = villages[i % 5];
      const x = inCity ? 270 + (i % 10) * 11 : vx - 16 + Math.floor(i / 5) * 10;
      const y = inCity ? 150 + Math.floor(i / 10) * 14 : vy + 26;
      return `<circle class="commuter" cx="${x}" cy="${y}" r="4"/>`;
    }).join("");
    const body = `<rect class="${h >= 7 && h < 19 ? "sky" : "space"}" width="640" height="320" rx="12"/>
      <circle class="umland" cx="320" cy="165" r="150"/>
      <circle class="city-core" cx="320" cy="165" r="62"/>${text(320, 120, "Stadt", "lbl small strong")}${text(320, 212, "Arbeitsplätze, Schulen, Klinik, Geschäfte", "lbl tiny")}
      ${villages.map(([x, y, n]) => `<g class="village"><rect x="${x - 22}" y="${y - 14}" width="44" height="28" rx="6"/></g>${text(x, y + 4, n, "lbl tiny strong")}`).join("")}
      ${arrows}${people}${text(20, 304, `${String(h).padStart(2, "0")}:00 Uhr`, `lbl small strong ${h >= 7 && h < 19 ? "" : "on-dark"}`, "start")}`;
    const what = f >= 0.25 ? "Berufsverkehr in die Stadt." : f <= -0.25 ? "Feierabendverkehr zurück ins Umland." : inside === 20 ? "Alle arbeiten in der Stadt." : inside === 0 ? "Alle sind zu Hause im Umland." : "Nur wenige sind unterwegs.";
    return `${range("h", "Uhrzeit", h, 0, 23, 1, `${h} Uhr`)}${labSvg(640, 320, "Eine Stadt in der Mitte, fünf Dörfer im Umland, Pfeile für Pendlerströme und Punkte für 20 Pendler", body)}${readout(
      `${h} Uhr: <strong>${inside} von 20</strong> sind in der Stadt. ${what}`,
      Math.abs(f) >= 0.25 ? "good" : "",
    )}`;
  },
};

/* ---------- Planquadrate im Stadtplan ---------- */

export const COLS = ["A", "B", "C", "D", "E", "F"];
export const PLACES: Record<string, { name: string; icon: string }> = {
  C3: { name: "Rathaus", icon: "R" },
  E4: { name: "Bahnhof", icon: "DB" },
  B1: { name: "Krankenhaus", icon: "+" },
  F2: { name: "Hallenbad", icon: "≈" },
  A4: { name: "Gymnasium", icon: "G" },
  D2: { name: "Museum", icon: "M" },
  C5: { name: "Stadtpark", icon: "♣" },
};
const PLAN_GOALS = [
  ["r", "C3"],
  ["b", "E4"],
  ["k", "B1"],
] as const;

export const planquadrat: LabDef = {
  id: "planquadrat",
  title: "Mit Planquadraten suchen",
  intro:
    "Im Straßen- und Gebäudeverzeichnis eines Stadtplans steht hinter jedem Namen ein Planquadrat. Klicke auf ein Feld, um zu sehen, was dort liegt.",
  initial: () => ({ cell: "", r: "", b: "", k: "" }),
  update: (s) => {
    const next = { ...s };
    for (const [flag, cell] of PLAN_GOALS) if (s.cell === cell) next[flag] = "ja";
    return next;
  },
  goals: [
    { text: "Im Verzeichnis steht: Rathaus C3. Klicke dieses Planquadrat an.", reached: (s) => s.r === "ja" },
    { text: "Im Verzeichnis steht: Bahnhof E4. Finde ihn.", reached: (s) => s.b === "ja" },
    { text: "Das Krankenhaus fehlt im Verzeichnis. Finde es über die Legende und klicke sein Planquadrat an.", reached: (s) => s.k === "ja" },
  ],
  witnesses: [
    { cell: "C3", r: "ja", b: "", k: "" },
    { cell: "E4", r: "", b: "ja", k: "" },
    { cell: "B1", r: "", b: "", k: "ja" },
  ],
  note: "Erfundener Stadtplan. Auf echten Plänen liest du die Buchstaben am oberen Rand und die Zahlen am linken Rand ab.",
  render(s) {
    const cell = str(s, "cell");
    const cw = 100,
      ch = 64,
      ox = 30,
      oy = 26;
    const cells = COLS.flatMap((c, ci) =>
      [1, 2, 3, 4, 5].map((r) => {
        const id = `${c}${r}`;
        const x = ox + ci * cw,
          y = oy + (r - 1) * ch;
        const place = PLACES[id];
        return `<rect class="plan-cell ${cell === id ? "plan-on" : ""}" x="${x}" y="${y}" width="${cw}" height="${ch}" data-lab-set="cell" data-lab-value="${id}" role="button" tabindex="0" aria-label="Planquadrat ${id}"/>${place ? `<g class="plan-icon" pointer-events="none"><circle cx="${x + cw / 2 + ((ci * 17) % 30) - 15}" cy="${y + ch / 2 + ((r * 13) % 20) - 10}" r="14"/>${text(x + cw / 2 + ((ci * 17) % 30) - 15, y + ch / 2 + ((r * 13) % 20) - 5, place.icon, "lbl tiny strong")}</g>` : ""}`;
      }),
    ).join("");
    const streets = `<path class="road-line" pointer-events="none" d="M30 122H630M30 250H630M230 26V346M430 26V346M30 300C200 280 420 330 630 300"/><path class="river-line" pointer-events="none" d="M30 60C160 90 260 40 380 80S560 120 630 90"/>`;
    const heads = COLS.map((c, i) => text(ox + i * cw + cw / 2, 18, c, "lbl small strong")).join("") + [1, 2, 3, 4, 5].map((r) => text(16, oy + (r - 1) * ch + ch / 2 + 5, String(r), "lbl small strong")).join("");
    const legend = `<ul class="plan-legend">${Object.values(PLACES).map((p) => `<li><span class="plan-key">${p.icon}</span>${p.name}</li>`).join("")}</ul>`;
    const found = cell ? PLACES[cell]?.name ?? "Wohnhäuser und Straßen" : "";
    return `${labSvg(640, 352, "Erfundener Stadtplan mit Gitter aus den Spalten A bis F und den Zeilen 1 bis 5, Straßen, einem Fluss und Symbolen für wichtige Gebäude", `<rect class="paper" width="640" height="352" rx="10"/>${streets}${cells}${heads}`)}${legend}${readout(
      cell ? `Planquadrat <strong>${cell}</strong>: ${found}.` : "Noch kein Planquadrat gewählt.",
    )}`;
  },
};

/* ---------- Nutzungskartierung ---------- */

export const USE_TYPES = ["Wohnen", "Einzelhandel", "Gastronomie", "Dienstleistung", "Leerstand"];
/** Ground floor and upper floor of eight houses in an invented main street. */
export const STREET: Array<{ eg: [string, number]; og: [string, number] }> = [
  { eg: ["Bäckerei", 1], og: ["Wohnungen", 0] },
  { eg: ["Café", 2], og: ["Wohnungen", 0] },
  { eg: ["Arztpraxis", 3], og: ["Steuerbüro", 3] },
  { eg: ["Schuhladen", 1], og: ["Wohnungen", 0] },
  { eg: ["leer", 4], og: ["Wohnungen", 0] },
  { eg: ["Bank", 3], og: ["Versicherung", 3] },
  { eg: ["Pizzeria", 2], og: ["Wohnungen", 0] },
  { eg: ["Buchhandlung", 1], og: ["Wohnungen", 0] },
];
const floorRight = (s: LabState, floor: "e" | "o", upTo = STREET.length) =>
  STREET.slice(0, upTo).every((h, i) => num(s, `${floor}${i}`) === (floor === "e" ? h.eg[1] : h.og[1]));
const blank = () => Object.fromEntries(STREET.flatMap((_, i) => [[`e${i}`, -1], [`o${i}`, -1]]));
const solved = (floor: "e" | "o") => Object.fromEntries(STREET.map((h, i) => [`${floor}${i}`, floor === "e" ? h.eg[1] : h.og[1]]));

export const kartierung: LabDef = {
  id: "kartierung",
  title: "Eine Hauptstraße kartieren",
  intro:
    "Wähle eine Farbe aus der Legende und klicke dann auf ein Geschoss. So hältst du fest, wie jedes Geschoss genutzt wird, wie bei einer echten Kartierung.",
  initial: () => ({ pen: 0, ...blank() }),
  goals: [
    { text: "Kartiere das Erdgeschoss der ersten vier Häuser richtig.", reached: (s) => floorRight(s, "e", 4) },
    { text: "Kartiere das ganze Erdgeschoss richtig.", reached: (s) => floorRight(s, "e") },
    { text: "Kartiere das ganze Obergeschoss richtig.", reached: (s) => floorRight(s, "o") },
  ],
  witnesses: [
    { pen: 0, ...blank(), ...Object.fromEntries(STREET.slice(0, 4).map((h, i) => [`e${i}`, h.eg[1]])) },
    { pen: 0, ...blank(), ...solved("e") },
    { pen: 0, ...blank(), ...solved("o") },
  ],
  note: "Erfundene Straße. Bei einer echten Kartierung gehst du die Straße ab, notierst jedes Geschoss und zeichnest danach eine Karte mit Legende.",
  render(s) {
    const pen = num(s, "pen");
    const houses = STREET.map((h, i) => {
      const x = 14 + i * 77;
      const floor = (key: string, y: number, label: string) => {
        const v = num(s, key);
        return `<rect class="facade use-${v < 0 ? "none" : v}" x="${x}" y="${y}" width="70" height="62" data-lab-paint="${key}" role="button" tabindex="0" aria-label="${label}: ${v < 0 ? "noch nicht kartiert" : USE_TYPES[v]}"/>`;
      };
      return `<path class="roof-gable" d="M${x - 2} 60L${x + 35} 26L${x + 72} 60Z"/>${floor(`o${i}`, 60, `Haus ${i + 1}, Obergeschoss, ${h.og[0]}`)}${floor(`e${i}`, 122, `Haus ${i + 1}, Erdgeschoss, ${h.eg[0]}`)}
        <rect class="window" x="${x + 12}" y="72" width="18" height="18"/><rect class="window" x="${x + 40}" y="72" width="18" height="18"/>
        ${text(x + 35, 104, h.og[0].length > 12 ? h.og[0].slice(0, 11) + "." : h.og[0], "lbl tiny", "middle")}${text(x + 35, 142, h.eg[0], "lbl tiny strong")}<rect class="door" x="${x + 26}" y="156" width="18" height="28"/>`;
    }).join("");
    const done = STREET.reduce((n, _, i) => n + (num(s, `e${i}`) >= 0 ? 1 : 0) + (num(s, `o${i}`) >= 0 ? 1 : 0), 0);
    return `<div class="lab-choice palette" role="group" aria-label="Legende"><span>Farbe</span>${USE_TYPES.map((u, i) => `<button type="button" class="swatch use-${i}" data-lab-set="pen" data-lab-value="${i}" aria-pressed="${pen === i}">${u}</button>`).join("")}</div>${labSvg(640, 200, "Fassaden von acht Häusern einer Hauptstraße mit Erdgeschoss und Obergeschoss, die du einfärben kannst", `<rect class="sky" width="640" height="200" rx="10"/>${houses}<rect class="street" x="0" y="184" width="640" height="16"/>`)}${readout(
      `${done} von 16 Geschossen kartiert. ${floorRight(s, "e") && floorRight(s, "o") ? "Im Erdgeschoss überwiegen Geschäfte, Gaststätten und Dienstleister, darüber wird vor allem gewohnt." : ""}`,
    )}`;
  },
};
