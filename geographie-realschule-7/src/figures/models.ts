/**
 * Drawn models of the course. All numbers are teaching values ("Modell"),
 * never measurements; the captions and lab notes say so.
 */
import { arrow, dot, f1, label, labels, svg } from "./draw";

type Row = readonly [label: string, value: number];
export const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const MONTH_NAMES = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

/** German number format with the real minus sign. */
export const fmt = (value: number): string =>
  new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 })
    .format(value)
    .replace("-", "−");

// ---------------------------------------------------------------- climate

interface Station { name: string; temp: readonly number[]; rain: readonly number[] }
const stations = {
  regenwald: {
    name: "Station A · äquatornah",
    temp: [26, 26, 26, 26, 26, 25, 24, 24, 25, 25, 25, 25],
    rain: [150, 160, 190, 200, 160, 110, 90, 120, 170, 220, 210, 170],
  },
  feuchtsavanne: {
    name: "Station B · etwa 10° N",
    temp: [25, 27, 29, 30, 28, 26, 25, 25, 26, 27, 26, 25],
    rain: [3, 8, 25, 70, 130, 170, 220, 250, 200, 90, 15, 4],
  },
  trockensavanne: {
    name: "Station C · etwa 12° N",
    temp: [24, 27, 30, 31, 30, 28, 26, 25, 26, 28, 27, 25],
    rain: [0, 1, 5, 20, 75, 110, 170, 210, 140, 40, 3, 0],
  },
  dornsavanne: {
    name: "Station D · etwa 14° N",
    temp: [22, 25, 29, 32, 33, 31, 28, 27, 28, 29, 26, 23],
    rain: [0, 0, 2, 5, 25, 50, 140, 180, 90, 15, 1, 0],
  },
  wueste: {
    name: "Station E · am nördlichen Wendekreis",
    temp: [16, 18, 22, 27, 31, 33, 34, 33, 31, 28, 22, 17],
    rain: [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  },
  japan: {
    name: "Station F · Pazifikküste Japans",
    temp: [5, 6, 9, 14, 19, 22, 26, 27, 24, 18, 13, 8],
    rain: [50, 60, 115, 130, 140, 165, 150, 150, 210, 200, 95, 55],
  },
  outback: {
    name: "Station G · Inneres Australiens",
    temp: [29, 28, 25, 20, 15, 12, 12, 14, 18, 23, 26, 28],
    rain: [40, 40, 30, 15, 15, 12, 8, 8, 8, 20, 25, 35],
  },
};
export type StationId = keyof typeof stations;
export const STATIONS: Record<StationId, Station> = stations;

/** Humid month: the rain bar reaches the temperature curve (10 °C ≙ 20 mm). */
export const isHumid = (temp: number, rain: number): boolean => rain > 2 * temp;
export function humidMonths(id: StationId): number {
  const { temp, rain } = STATIONS[id];
  return temp.filter((t, i) => isHumid(t, rain[i])).length;
}
export function climateFacts(id: StationId) {
  const { temp, rain } = STATIONS[id];
  const max = Math.max(...temp);
  const min = Math.min(...temp);
  return {
    range: max - min,
    total: rain.reduce((sum, value) => sum + value, 0),
    warmest: MONTH_NAMES[temp.indexOf(max)],
    humid: humidMonths(id),
  };
}

/**
 * Climate chart after Walter and Lieth: 10 °C ≙ 20 mm; above 100 mm the
 * rain scale shrinks to a tenth (10 °C ≙ 200 mm). Humid months get a blue
 * stripe, arid months a sand stripe.
 */
export function climateChart(id: StationId): string {
  const { name, temp, rain } = STATIONS[id];
  const x = (i: number) => 70 + i * 38;
  const zero = 236;
  const unit = 3.1; // px per °C, i.e. per 2 mm below 100 mm
  const ty = (t: number) => zero - t * unit;
  const ry = (mm: number) => zero - (mm <= 100 ? mm / 2 : 50 + (mm - 100) / 20) * unit;
  const stripes = temp
    .map((t, i) => `<rect class="${isHumid(t, rain[i]) ? "humid-month" : "arid-month"}" x="${x(i) - 19}" y="${f1(ty(60))}" width="38" height="${f1(zero - ty(60))}"/>`)
    .join("");
  const grid = [0, 10, 20, 30, 40]
    .map((t) => `<line class="geo-axis" x1="51" y1="${f1(ty(t))}" x2="527" y2="${f1(ty(t))}"/>` + label(44, ty(t) + 4, String(t), "lbl small", "end"))
    .join("");
  const right = [[0, "0"], [10, "20"], [20, "40"], [30, "60"], [40, "80"], [50, "100"], [55, "200"]] as const;
  const rightAxis = right.map(([t, text]) => label(534, ty(t) + 4, text, "lbl small", "start")).join("");
  const bars = rain
    .map((mm, i) => `<rect class="geo-rain" x="${x(i) - 10}" y="${f1(ry(mm))}" width="20" height="${f1(zero - ry(mm))}"/>`)
    .join("");
  const line = temp.map((t, i) => `${x(i)},${f1(ty(t))}`).join(" ");
  const facts = climateFacts(id);
  return svg(
    580,
    292,
    `Klimadiagramm ${name}: Temperatur als Linie, Niederschlag als Säulen, ${facts.humid} humide Monate`,
    label(290, 18, `${name} · Modelldaten`, "lbl strong") +
      label(40, 40, "°C", "lbl small") + label(548, 40, "mm", "lbl small") +
      stripes + grid + rightAxis +
      `<line class="scale-break" x1="51" y1="${f1(ty(50))}" x2="527" y2="${f1(ty(50))}"/>` +
      bars +
      `<polyline class="geo-temp" points="${line}"/>` +
      MONTHS.map((m, i) => label(x(i), zero + 18, m, "lbl small")).join("") +
      label(290, zero + 44, `Jahresniederschlag ${facts.total} mm · Spanne ${fmt(facts.range)} °C · ${facts.humid} humide Monate`, "lbl small strong"),
  );
}

export function climateTable(id: StationId): string {
  const { name, temp, rain } = STATIONS[id];
  return `<details class="climate-values"><summary>Alle Monatswerte · ${name}</summary><table class="lab-table geo-table"><thead><tr><th scope="col">Monat</th><th scope="col">Temperatur</th><th scope="col">Niederschlag</th><th scope="col">humid?</th></tr></thead><tbody>${temp
    .map((t, i) => `<tr><th scope="row">${MONTH_NAMES[i]}</th><td>${fmt(t)} °C</td><td>${rain[i]} mm</td><td>${isHumid(t, rain[i]) ? "humid" : "arid"}</td></tr>`)
    .join("")}</tbody></table></details>`;
}

// ---------------------------------------------------------------- planet

export type Season = "juni" | "dezember" | "maerz";
/** Latitude where the sun stands in the zenith at noon. */
export const ZENITH: Record<Season, number> = { juni: 23.44, dezember: -23.44, maerz: 0 };

/**
 * Side view of the lit Earth. The sun shines from the left; the right half
 * is night. In June the north end of the axis leans towards the sun.
 */
export function illumination(season: Season): string {
  const cx = 360, cy = 150, r = 105;
  const tilt = ZENITH[season]; // degrees the north pole leans towards the sun
  const rad = (tilt * Math.PI) / 180;
  // Rotate a point given in the Earth's frame (x right, y up).
  const rot = (x: number, y: number): [number, number] => [
    cx + x * Math.cos(rad) - y * Math.sin(rad),
    cy - (x * Math.sin(rad) + y * Math.cos(rad)),
  ];
  const chord = (lat: number, cls: string, text: string) => {
    const phi = (lat * Math.PI) / 180;
    const h = r * Math.sin(phi), w = r * Math.cos(phi);
    const [ax, ay] = rot(-w, h), [bx, by] = rot(w, h);
    return `<line class="${cls}" x1="${f1(ax)}" y1="${f1(ay)}" x2="${f1(bx)}" y2="${f1(by)}"/>` + label(bx + 6, by + 4, text, "lbl tiny", "start");
  };
  const [nx, ny] = rot(0, r + 22), [sx, sy] = rot(0, -r - 22);
  const rays = [-70, -35, 0, 35, 70]
    .map((dy) => arrow(70, cy + dy, cx - Math.sqrt(Math.max(0, r * r - dy * dy)) - 4, cy + dy, "arrow ray-arrow"))
    .join("");
  const note = {
    juni: "Nordhalbkugel zur Sonne geneigt: Polartag im Norden, Polarnacht im Süden",
    dezember: "Südhalbkugel zur Sonne geneigt: Polartag im Süden, Polarnacht im Norden",
    maerz: "Keine Halbkugel zur Sonne geneigt: überall etwa 12 Stunden Tag",
  }[season];
  return svg(
    580,
    300,
    `Beleuchtung der Erde ${{ juni: "am 21. Juni", dezember: "am 21. Dezember", maerz: "zur Tagundnachtgleiche" }[season]}`,
    `<rect class="space" width="580" height="300"/>` +
      `<circle class="sun" cx="22" cy="${cy}" r="44"/>` + rays +
      `<circle class="globe" cx="${cx}" cy="${cy}" r="${r}"/>` +
      `<path class="night" d="M${cx} ${cy - r}A${r} ${r} 0 0 1 ${cx} ${cy + r}Z"/>` +
      chord(0, "equator", "Äquator") +
      chord(23.44, "latitude light", "Wendekreis") + chord(-23.44, "latitude light", "Wendekreis") +
      chord(66.56, "latitude light", "Polarkreis") + chord(-66.56, "latitude light", "Polarkreis") +
      `<line class="axis-line" x1="${f1(sx)}" y1="${f1(sy)}" x2="${f1(nx)}" y2="${f1(ny)}"/>` +
      label(nx, ny - 6, "N", "lbl strong on-dark") +
      `<circle class="zenith-mark" cx="${cx - r}" cy="${cy}" r="7"/>` +
      label(cx + r + 14, cy - r + 6, "Nacht", "lbl small on-dark", "start") +
      label(cx - r - 70, cy - r - 8, "Tag", "lbl small on-dark") +
      label(290, 288, note, "lbl small on-dark") +
      label(cx - r - 12, cy + 24, `Zenit über ${{ juni: "23,5° N", dezember: "23,5° S", maerz: "dem Äquator" }[season]}`, "lbl tiny on-dark", "end"),
  );
}

/** Day length in hours at a latitude (simple sunrise equation, no refraction). */
export function dayLength(lat: number, season: Season): number {
  const decl = (ZENITH[season] * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const x = -Math.tan(phi) * Math.tan(decl);
  if (x <= -1) return 24;
  if (x >= 1) return 0;
  return (24 / Math.PI) * Math.acos(x);
}

// ---------------------------------------------------------------- weather

export const FOEHN = { startHeight: 500, crest: 3000, startTemp: 15 };
/** Temperatures of an air parcel crossing the Alps; cloud base in metres. */
export function foehn(cloudBase: number) {
  const { startHeight, crest, startTemp } = FOEHN;
  const base = Math.min(Math.max(cloudBase, startHeight), crest);
  const atBase = startTemp - (base - startHeight) / 100;
  const atCrest = atBase - (crest - base) / 200;
  const lee = atCrest + (crest - startHeight) / 100;
  return { base, atBase, atCrest, lee, gain: lee - startTemp };
}

export function foehnProfile(cloudBase: number): string {
  const { startHeight, crest, startTemp } = FOEHN;
  const t = foehn(cloudBase);
  const y = (h: number) => 230 - (h / 3000) * 180;
  const left = 40, peak = 290, right = 540;
  const xAt = (h: number) => left + ((h - startHeight) / (crest - startHeight)) * (peak - left);
  const baseY = y(t.base);
  const cloud = t.base < crest
    ? `<path class="cloud" d="M${f1(xAt(t.base) - 18)} ${f1(baseY)}L${peak} ${y(crest) - 6}L${peak + 18} ${y(crest) - 22}Q${f1((xAt(t.base) + peak) / 2)} ${f1(y((t.base + crest) / 2) - 50)} ${f1(xAt(t.base) - 30)} ${f1(baseY - 14)}Z"/>` +
      [0.3, 0.55, 0.8].map((k) => {
        const h = t.base + (crest - t.base) * k * 0.6;
        return `<path class="rain" d="M${f1(xAt(h) - 14)} ${f1(y(h) - 4)}l-6 16m14 -14l-6 16"/>`;
      }).join("")
    : "";
  return svg(
    580,
    262,
    `Föhn: Luftpaket mit Wolkenuntergrenze in ${t.base} m, Lee-Temperatur ${fmt(t.lee)} °C`,
    `<rect class="sky" width="580" height="262"/>` +
      `<path class="mountain" d="M0 ${y(startHeight)}L${left} ${y(startHeight)}L${peak} ${y(crest)}L${right} ${y(startHeight)}L580 ${y(startHeight)}V262H0Z"/>` +
      `<path class="snow" d="M${peak - 26} ${y(crest) + 19}L${peak} ${y(crest)}L${peak + 26} ${y(crest) + 19}Z"/>` +
      cloud +
      (t.base < crest ? `<line class="cloud-base" x1="${f1(xAt(t.base) - 30)}" y1="${f1(baseY)}" x2="${f1(xAt(t.base) + 60)}" y2="${f1(baseY)}"/>` + label(xAt(t.base) - 34, baseY + 4, `${t.base} m`, "lbl tiny", "end") : "") +
      arrow(left - 30, y(startHeight) - 18, left + 40, y(startHeight + 600) - 18) +
      arrow(peak + 30, y(crest) - 16, right - 10, y(startHeight) - 30) +
      label(left + 2, y(startHeight) + 22, `Luv · ${startHeight} m · ${fmt(startTemp)} °C`, "lbl small strong", "start") +
      label(peak, y(crest) - 30, `Kamm · ${crest} m · ${fmt(t.atCrest)} °C`, "lbl small strong") +
      label(right - 2, y(startHeight) + 22, `Lee · ${startHeight} m · ${fmt(t.lee)} °C`, "lbl small strong", "end") +
      label(150, 30, "Wind", "lbl small") + label(150, 48, "Steigungsregen im Luv", "lbl tiny") +
      label(450, 48, "warmer, trockener Fallwind", "lbl tiny"),
  );
}

// ---------------------------------------------------------------- tropics

export type PassatMonth = "maerz" | "juli" | "januar";
/** Model latitude of the ITC over Africa. */
export const ITC_LAT: Record<PassatMonth, number> = { maerz: 0, juli: 12, januar: -12 };

/** North–south section from 30° S to 30° N with the trade-wind circulation. */
export function passatSection(month: PassatMonth): string {
  const x = (lat: number) => 290 + lat * 8.2;
  const itc = x(ITC_LAT[month]);
  const ground = 228;
  const cell = (to: number) =>
    arrow(itc, 120, itc, 66) +
    arrow(itc + (to - itc) * 0.08, 52, to - (to - itc) * 0.08, 52) +
    arrow(to, 66, to, 170) +
    arrow(to - (to - itc) * 0.06, 196, itc + (to - itc) * 0.12, 196, "arrow passat-wind");
  return svg(
    580,
    282,
    `Passatkreislauf mit der ITC bei ${ITC_LAT[month] === 0 ? "0°" : ITC_LAT[month] > 0 ? `${ITC_LAT[month]}° N` : `${-ITC_LAT[month]}° S`}`,
    `<rect class="sky" width="580" height="282"/>` +
      `<rect class="land desert" x="0" y="${ground}" width="580" height="54"/>` +
      `<rect class="rain-belt" x="${f1(itc - 48)}" y="${ground - 4}" width="96" height="10"/>` +
      `<path class="cloud" d="M${f1(itc - 40)} 120Q${f1(itc - 44)} 96 ${f1(itc - 20)} 96Q${f1(itc - 10)} 70 ${f1(itc + 14)} 86Q${f1(itc + 44)} 82 ${f1(itc + 40)} 120Z"/>` +
      [-24, -8, 8, 24].map((d) => `<path class="rain" d="M${f1(itc + d)} 128l-5 18m5 4l-5 18"/>`).join("") +
      cell(x(30)) + cell(x(-30)) +
      label(itc, 160, "ITC · Tief", "lbl small strong") +
      label(x(30), 186, "Hoch", "lbl small strong") + label(x(-30), 186, "Hoch", "lbl small strong") +
      label(x(19), 214, "Nordost-Passat", "lbl tiny") + label(x(-19), 214, "Südost-Passat", "lbl tiny") +
      label(itc, ground + 20, "Regenzeit", "lbl small strong") +
      [-30, -20, -10, 0, 10, 20, 30].map((lat) => label(x(lat), ground + 42, lat === 0 ? "0°" : lat > 0 ? `${lat}° N` : `${-lat}° S`, "lbl tiny")).join("") +
      label(290, 22, `Zenitstand der Sonne bei ${ITC_LAT[month] === 0 ? "etwa 0°" : ITC_LAT[month] > 0 ? "nördlichen Breiten" : "südlichen Breiten"} · Modell`, "lbl small"),
  );
}

export type TropicZone = "Tropischer Regenwald" | "Feuchtsavanne" | "Trockensavanne" | "Dornsavanne" | "Halbwüste und Wüste";
export function zoneForHumidMonths(humid: number): TropicZone {
  if (humid >= 10) return "Tropischer Regenwald";
  if (humid >= 7) return "Feuchtsavanne";
  if (humid >= 5) return "Trockensavanne";
  if (humid >= 2) return "Dornsavanne";
  return "Halbwüste und Wüste";
}

/** A belt from the equator to the tropic with the five vegetation zones. */
export function tropicTransect(humid?: number): string {
  const zones: Array<[TropicZone, number, number, string, string]> = [
    ["Tropischer Regenwald", 12, 10, "veg-rain", "10 bis 12"],
    ["Feuchtsavanne", 9, 7, "veg-wet", "7 bis 9"],
    ["Trockensavanne", 6, 5, "veg-dry", "5 bis 6"],
    ["Dornsavanne", 4, 2, "veg-thorn", "2 bis 4"],
    ["Halbwüste und Wüste", 1, 0, "veg-desert", "0 bis 1"],
  ];
  const w = 104;
  const body = zones
    .map(([name, hi, lo, cls, range], i) => {
      const x0 = 30 + i * w;
      const trees = cls === "veg-rain" ? 5 : cls === "veg-wet" ? 3 : cls === "veg-dry" ? 2 : cls === "veg-thorn" ? 1 : 0;
      const glyphs = Array.from({ length: trees }, (_, k) => {
        const tx = x0 + 16 + k * (72 / Math.max(trees, 1));
        const h = cls === "veg-rain" ? 70 : 40;
        return `<rect class="trunk" x="${f1(tx)}" y="${150 - h}" width="4" height="${h}"/><circle class="forest" cx="${f1(tx + 2)}" cy="${150 - h}" r="${cls === "veg-rain" ? 14 : 10}"/>`;
      }).join("");
      const grass = cls === "veg-desert" ? "" : `<path class="grass" d="M${x0 + 4} 150q6 -14 12 0q6 -14 12 0q6 -14 12 0q6 -14 12 0q6 -14 12 0q6 -14 12 0q6 -14 12 0q6 -14 12 0"/>`;
      const active = humid !== undefined && humid <= hi && humid >= lo;
      return `<rect class="${cls}${active ? " zone-active" : ""}" x="${x0}" y="52" width="${w - 4}" height="118" rx="8"/>` + glyphs + grass +
        labels(x0 + w / 2 - 2, 190, name.replace(" und ", "\nund ").replace("Tropischer ", "Tropischer\n"), "lbl tiny strong") +
        labels(x0 + w / 2 - 2, 228, `${range}\nhumide Monate`, "lbl tiny", "middle", 13);
    })
    .join("");
  return svg(
    580,
    256,
    "Vegetationszonen der Tropen vom Äquator zum Wendekreis nach der Zahl humider Monate",
    label(290, 22, "Vom Äquator zum Wendekreis: immer weniger humide Monate", "lbl small strong") +
      arrow(40, 38, 540, 38) + body,
  );
}

/** Rainforest and European mixed forest side by side, with where nutrients are stored. */
export function forestComparison(): string {
  const layer = (x: number, y: number, w: number, h: number, cls: string, text: string) =>
    `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="5"/>` + label(x + w / 2, y + h / 2 + 4, text, "lbl tiny strong");
  return svg(
    580,
    300,
    "Stockwerkbau und Nährstoffspeicher im tropischen Regenwald und im europäischen Mischwald",
    label(145, 20, "Tropischer Regenwald", "lbl small strong") + label(435, 20, "Europäischer Mischwald", "lbl small strong") +
      layer(30, 32, 230, 26, "veg-rain", "Urwaldriesen · bis etwa 60 m") +
      layer(30, 62, 230, 34, "veg-rain", "geschlossenes Kronendach") +
      layer(30, 100, 230, 30, "veg-wet", "untere Baumschicht") +
      layer(30, 134, 230, 24, "veg-dry", "Strauchschicht") +
      layer(30, 162, 230, 18, "veg-dry", "Krautschicht · wenig Licht") +
      `<rect class="soil-thin" x="30" y="184" width="230" height="10"/>` +
      layer(320, 70, 230, 40, "veg-wet", "Baumschicht · bis etwa 35 m") +
      layer(320, 114, 230, 26, "veg-dry", "Strauchschicht") +
      layer(320, 144, 230, 22, "veg-dry", "Krautschicht") +
      layer(320, 170, 230, 14, "veg-thorn", "Moosschicht") +
      `<rect class="soil-humus" x="320" y="184" width="230" height="28"/>` +
      label(145, 212, "dünne Humusschicht", "lbl tiny") + label(435, 204, "dicke Humusschicht", "lbl tiny on-dark") +
      label(290, 238, "Wo stecken die meisten Nährstoffe?", "lbl small strong") +
      `<rect class="nutrient-bio" x="30" y="250" width="190" height="18" rx="4"/><rect class="nutrient-soil" x="220" y="250" width="40" height="18" rx="4"/>` +
      `<rect class="nutrient-bio" x="320" y="250" width="90" height="18" rx="4"/><rect class="nutrient-soil" x="410" y="250" width="140" height="18" rx="4"/>` +
      label(125, 290, "vor allem in den Pflanzen", "lbl tiny") + label(435, 290, "zu einem großen Teil im Boden", "lbl tiny"),
  );
}

/** Fields of a village in shifting cultivation: 2 years of farming per field. */
export const CROP_YEARS = 2;
export const RECOVERY_YEARS = 10;
export const fallowYears = (fields: number): number => CROP_YEARS * (fields - 1);
export function shiftingFields(fields: number): string {
  const cx = 290, cy = 140, R = 92;
  const fallow = fallowYears(fields);
  const enough = fallow >= RECOVERY_YEARS;
  const items = Array.from({ length: fields }, (_, i) => {
    const a = (i / fields) * 2 * Math.PI - Math.PI / 2;
    const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
    const cls = i === 0 ? "field-crop" : enough ? "field-forest" : "field-bush";
    return `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="24"/>` + label(x, y + 4, i === 0 ? "Anbau" : `${i * CROP_YEARS} J.`, "lbl tiny strong");
  }).join("");
  return svg(
    580,
    290,
    `${fields} Felder im Wanderfeldbau: ${fallow} Jahre Brache`,
    `<circle class="village" cx="${cx}" cy="${cy}" r="28"/>` + label(cx, cy + 4, "Dorf", "lbl small strong") + items +
      label(290, 270, `${fields} Felder · je ${CROP_YEARS} Jahre Anbau · ${fallow} Jahre Brache · ${enough ? "Wald wächst nach" : "zu kurze Brache"}`, "lbl small strong"),
  );
}

// ---------------------------------------------------------------- orient

export type MedinaPart = "moschee" | "suq" | "wohnviertel" | "neustadt";
/** Schematic plan of an oriental old town with a new town outside the wall. */
export function medinaPlan(highlight?: MedinaPart): string {
  const hi = (part: MedinaPart) => (highlight === part ? " plan-active" : "");
  const deadEnds = [
    "M70 70h40v20", "M70 110h30v-12", "M80 150h40", "M70 190h44v14", "M240 60v34h-20", "M262 120h-30v20",
    "M250 190h-36", "M240 230v-26h-20", "M100 236h30v-14",
  ];
  return svg(
    580,
    300,
    "Schematischer Grundriss einer orientalischen Altstadt mit Neustadt außerhalb der Stadtmauer",
    `<rect class="paper" width="580" height="300"/>` +
      `<path class="wall" d="M40 30H300V270H40Z"/>` +
      `<path class="alleys${hi("wohnviertel")}" d="${deadEnds.join("")}"/>` +
      `<path class="suq-lane${hi("suq")}" d="M40 150H300M170 30V270"/>` +
      `<rect class="mosque${hi("moschee")}" x="146" y="126" width="48" height="48" rx="4"/>` +
      `<circle class="minaret" cx="190" cy="130" r="5"/>` +
      `<rect class="kasbah" x="244" y="34" width="52" height="40" rx="3"/>` +
      `<path class="grid-street${hi("neustadt")}" d="M340 40H560M340 100H560M340 160H560M340 220H560M360 30V270M420 30V270M480 30V270M540 30V270"/>` +
      `<path class="road-line thin" d="M300 150H340"/>` +
      label(170, 120, "Große Moschee", "lbl tiny strong") +
      label(105, 144, "Suq", "lbl tiny strong") + label(178, 70, "Suq", "lbl tiny strong") +
      label(80, 60, "Sackgassen", "lbl tiny") + label(270, 88, "Kasbah", "lbl tiny strong") +
      label(450, 20, "Neustadt", "lbl small strong") + label(170, 20, "Altstadt (Medina)", "lbl small strong") +
      label(450, 290, "breite, gerade Straßen", "lbl tiny") + label(170, 290, "Stadtmauer mit Toren", "lbl tiny") +
      `<path class="gate" d="M36 142h8v16h-8zM296 142h8v16h-8zM162 26h16v8h-16z"/>`,
  );
}

/** Oasis with its layers of use under date palms. */
export function oasisLayers(): string {
  const palm = (x: number) =>
    `<rect class="trunk" x="${x}" y="70" width="6" height="110"/><path class="palm" d="M${x + 3} 70q-34 -8 -44 14M${x + 3} 70q34 -8 44 14M${x + 3} 70q-20 -26 -40 -24M${x + 3} 70q20 -26 40 -24"/>`;
  const tree = (x: number) => `<rect class="trunk" x="${x}" y="140" width="4" height="40"/><circle class="forest" cx="${x + 2}" cy="136" r="16"/>`;
  return svg(
    580,
    262,
    "Stockwerkbau einer Oase: Dattelpalmen, Obstbäume und Gemüse über einem Bewässerungskanal",
    `<rect class="sky" width="580" height="262"/><rect class="land desert" y="180" width="580" height="82"/>` +
      [70, 210, 350, 490].map(palm).join("") + [130, 270, 420].map(tree).join("") +
      `<path class="grass" d="M40 180q8 -16 16 0q8 -16 16 0q8 -16 16 0M240 180q8 -16 16 0q8 -16 16 0q8 -16 16 0M440 180q8 -16 16 0q8 -16 16 0q8 -16 16 0"/>` +
      `<path class="canal" d="M0 192H580"/>` +
      `<path class="groundwater" d="M0 238H580"/>` +
      label(560, 54, "Dattelpalmen", "lbl small strong", "end") +
      label(560, 126, "Obstbäume", "lbl small strong", "end") +
      label(560, 172, "Gemüse und Getreide", "lbl small strong", "end") +
      label(20, 210, "Bewässerungskanal", "lbl tiny", "start") +
      label(20, 252, "Grundwasser", "lbl tiny on-dark", "start"),
  );
}

// ---------------------------------------------------------------- hazards

/** Tsunami speed over the deep ocean in the model (km/h). */
export const TSUNAMI_SPEED = 700;
export const tsunamiMinutes = (km: number): number => Math.round((km / TSUNAMI_SPEED) * 60);
export function tsunamiProfile(km: number): string {
  const minutes = tsunamiMinutes(km);
  const coast = 520;
  const quake = coast - (km / 2000) * 440;
  return svg(
    580,
    220,
    `Tsunami: Erdbeben ${km} km vor der Küste, Ankunft nach etwa ${minutes} Minuten`,
    `<rect class="sky" width="580" height="220"/><rect class="sea-fill" x="0" y="90" width="${coast}" height="130"/>` +
      `<path class="land" d="M${coast - 30} 220L${coast} 90L580 70V220Z"/>` +
      `<path class="geo-plate" d="M0 190H${f1(quake + 10)}L${f1(quake + 60)} 220H0Z"/>` +
      `<circle class="quake" cx="${f1(quake)}" cy="196" r="9"/>` +
      `<path class="wave" d="M${f1(quake - 40)} 90q20 -16 40 0q20 -16 40 0"/>` +
      arrow(quake + 50, 74, coast - 20, 74) +
      label(quake, 214, "Epizentrum", "lbl tiny on-dark") +
      label((quake + coast) / 2, 64, `${km} km · etwa ${minutes} min`, "lbl small strong") +
      label(556, 60, "Küste", "lbl small strong", "end"),
  );
}

/** Model island: heights of five zones in centimetres above mean sea level. */
export const ISLAND_ZONES: Row[] = [
  ["Strand", 40],
  ["Hafen und Uferstraße", 80],
  ["Wohnhäuser", 120],
  ["Schule", 160],
  ["Höchster Punkt", 220],
];
export const floodedZones = (rise: number, surge: number): number =>
  ISLAND_ZONES.filter(([, height]) => height <= rise + surge).length;
export function islandProfile(rise: number, surge: number): string {
  const y = (cm: number) => 190 - cm * 0.55;
  const level = rise + surge;
  const zones = ISLAND_ZONES.map(([name, h], i) => {
    const x = 60 + i * 96;
    const wet = h <= level;
    return `<rect class="${wet ? "island-wet" : "island-dry"}" x="${x}" y="${f1(y(h))}" width="92" height="${f1(190 - y(h) + 20)}"/>` +
      labels(x + 46, y(h) - 10, `${name}\n${h} cm`, "lbl tiny strong");
  }).join("");
  return svg(
    580,
    230,
    `Modellinsel bei ${level} cm Wasserstand über dem heutigen Mittel`,
    `<rect class="sky" width="580" height="230"/>` + zones +
      `<rect class="sea-fill flood" x="0" y="${f1(y(level))}" width="580" height="${f1(230 - y(level))}"/>` +
      `<line class="mean-sea" x1="0" y1="${y(0)}" x2="580" y2="${y(0)}"/>` +
      label(12, y(0) - 6, "heutiges Mittel", "lbl tiny", "start"),
  );
}

// ---------------------------------------------------------------- generic

export function comparisonBars(title: string, values: readonly Row[], unit: string, maximum: number): string {
  const body = values.map(([name, value], i) => {
    const y = 48 + 43 * i;
    return label(176, y + 19, name, "lbl small", "end")
      + `<rect class="geo-bar-bg" x="190" y="${y}" width="310" height="29" rx="6"/><rect class="geo-color-${i % 4}" x="190" y="${y}" width="${f1(310 * Math.min(value, maximum) / maximum)}" height="29" rx="6"/>`
      + label(510, y + 19, `${fmt(value)}${unit ? ` ${unit}` : ""}`, "lbl small", "start");
  }).join("");
  return svg(580, 62 + 43 * values.length, title, label(290, 26, title, "lbl strong") + body);
}

export function processFigure(title: string, names: readonly string[], subtitle: readonly string[], ordered = false): string {
  const body = names.map((name, i) => {
    const x = 25 + i * (530 / names.length), w = 530 / names.length - 13;
    return `<rect class="geo-step geo-color-${i % 4}" x="${f1(x)}" y="46" width="${f1(w)}" height="94" rx="13"/>`
      + labels(x + w / 2, 72, name, "lbl strong")
      + labels(x + w / 2, 112, subtitle[i], "lbl small")
      + (ordered && i < names.length - 1 ? arrow(x + w + 1, 93, x + w + 12, 93) : "");
  }).join("");
  return svg(580, 160, title, label(290, 24, title, "lbl strong") + body);
}

/**
 * Plate cross-sections. `eastward` mirrors the subduction drawing so the ocean
 * plate comes from the right (east), as off Japan; labels stay readable.
 */
export function plateProfile(motion: "apart" | "under" | "past", eastward = false): string {
  const titles = { apart: "Platten driften auseinander", under: "Eine Platte taucht ab", past: "Platten gleiten seitlich vorbei" };
  const mx = (x: number) => (eastward ? 580 - x : x);
  const body = {
    apart: `<path class="geo-plate" d="M20 95H222L265 130L222 146H20Z M560 95H358L315 130L358 146H560Z"/>
      <path class="geo-magma" d="M265 151L290 94L315 151Z"/>${arrow(237, 74, 165, 74)}${arrow(341, 74, 414, 74)}
      ${label(290, 178, "Magma steigt auf", "lbl small")}`,
    under: `<g${eastward ? ' transform="matrix(-1 0 0 1 580 0)"' : ""}><path class="geo-plate" d="M20 95H241L430 156L397 169L220 124H20Z M255 71H560V115H386Z"/>
      <path class="geo-magma" d="M367 70L394 40L425 70Z"/>${arrow(130, 77, 209, 77)}${arrow(512, 59, 438, 59)}${dot(300, 120, "quake")}</g>
      ${label(mx(130), 60, eastward ? "Pazifische Platte" : "ozeanische Platte", "lbl small")}${label(mx(480), 135, eastward ? "Japan mit Vulkanen" : "Inselbogen mit Vulkanen", "lbl small")}
      ${label(mx(237), 156, "Absinkende Platte", "lbl small")}${label(mx(300), 104, "Erdbebenherd", "lbl tiny")}${label(mx(241), 88, "Tiefseegraben", "lbl tiny")}
      ${eastward ? label(18, 186, "Westen", "lbl small strong", "start") + label(562, 186, "Osten", "lbl small strong", "end") : ""}`,
    past: `<path class="geo-plate" d="M35 56H545V103H35Z M35 112H545V160H35Z"/>
      ${arrow(190, 80, 370, 80)}${arrow(372, 135, 182, 135)}${label(286, 179, "Störung in Draufsicht", "lbl small")}`,
  };
  return svg(580, 196, titles[motion] + (eastward ? " · Schnitt durch Japan von Westen nach Osten" : ""), label(290, 25, titles[motion], "lbl strong") + body[motion]);
}
