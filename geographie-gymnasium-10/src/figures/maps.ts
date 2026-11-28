/**
 * Local vector maps from Natural Earth (src/data/maps.json, public domain).
 * Every position uses the exact projection stored in maps.json.
 */
import mapData from "../data/maps.json";
import { arrow, dot, f1, label, labels, svg } from "./draw";

interface Projection {
  lonMin: number;
  lonMax: number;
  latMin: number;
  latMax: number;
  c: number;
  k: number;
  width: number;
  height: number;
}
interface CountryShape {
  id: string;
  continent: string;
  d: string;
}
interface RegionData {
  proj: Projection;
  countries: CountryShape[];
}

const DATA = mapData as unknown as Record<
  "world" | "mena" | "africa" | "latam",
  RegionData
>;

function xy(proj: Projection, lon: number, lat: number): [number, number] {
  return [(lon - proj.lonMin) * proj.k * proj.c, (proj.latMax - lat) * proj.k];
}

function renderRegionMap(
  region: keyof typeof DATA,
  title: string,
  overlay = "",
  highlightIds: readonly string[] = [],
  countryClass?: (c: CountryShape) => string,
  showNorth = true,
): string {
  const { proj, countries } = DATA[region];
  const clipId = `clip-${region}-${title.length}`;
  const paths = countries
    .map((c) => {
      const cls = countryClass
        ? countryClass(c)
        : highlightIds.includes(c.id)
          ? "geo-country geo-selected"
          : "geo-country";
      return `<path class="${cls}" d="${c.d}" fill-rule="evenodd"/>`;
    })
    .join("");
  const north = showNorth
    ? label(proj.width - 26, 26, "N", "lbl strong") +
      arrow(proj.width - 26, 52, proj.width - 26, 33)
    : "";
  return svg(
    proj.width,
    proj.height,
    title,
    `<defs><clipPath id="${clipId}"><rect width="${proj.width}" height="${proj.height}"/></clipPath></defs>` +
      `<g clip-path="url(#${clipId})"><rect class="sea" width="${proj.width}" height="${proj.height}"/>${paths}${overlay}${north}</g>`,
  );
}

export function worldHeroMap(): string {
  const { proj } = DATA.world;
  const eqY = xy(proj, 0, 0)[1];
  const trN = xy(proj, 0, 23.5)[1];
  const trS = xy(proj, 0, -23.5)[1];
  const bands =
    `<rect class="geo-zone-tropics" x="0" y="${f1(trN)}" width="${proj.width}" height="${f1(trS - trN)}"/>` +
    `<line class="geo-equator" x1="0" y1="${f1(eqY)}" x2="${proj.width}" y2="${f1(eqY)}"/>` +
    `<line class="geo-tropic-line" x1="0" y1="${f1(trN)}" x2="${proj.width}" y2="${f1(trN)}"/>` +
    `<line class="geo-tropic-line" x1="0" y1="${f1(trS)}" x2="${proj.width}" y2="${f1(trS)}"/>`;
  const [mx, my] = xy(proj, 30, 26);
  const [ax, ay] = xy(proj, 18, 2);
  const [lx, ly] = xy(proj, -62, -10);
  const markers =
    dot(mx, my, "geo-focus-dot") +
    label(mx, my - 10, "MENA", "lbl small strong") +
    dot(ax, ay, "geo-focus-dot") +
    label(ax, ay + 16, "Subsahara", "lbl small strong") +
    dot(lx, ly, "geo-focus-dot") +
    label(lx, ly - 10, "Lateinamerika", "lbl small strong") +
    label(14, eqY - 5, "Äquator 0°", "lbl tiny", "start");
  return renderRegionMap(
    "world",
    "Weltkarte mit Tropengürtel, Äquator und den Schwerpunktregionen der 10. Klasse",
    bands + markers,
    ["MAR", "EGY", "SAU", "NER", "COD", "KEN", "BRA", "PER", "MEX"],
  );
}

export function worldLayerMap(
  layer: "umrisse" | "klima" | "vegetation" | "abholzung",
): string {
  const { proj } = DATA.world;
  const eqY = xy(proj, 0, 0)[1];
  const trN = xy(proj, 0, 23.5)[1];
  const trS = xy(proj, 0, -23.5)[1];
  const polN = xy(proj, 0, 66.5)[1];

  if (layer === "umrisse") {
    const grid =
      `<line class="geo-equator" x1="0" y1="${f1(eqY)}" x2="${proj.width}" y2="${f1(eqY)}"/>` +
      label(44, eqY - 6, "Äquator 0°", "lbl tiny", "start") +
      label(320, 42, "Nordhalbkugel", "lbl small muted") +
      label(320, 210, "Südhalbkugel", "lbl small muted");
    return renderRegionMap("world", "Weltkarte mit Kontinentumrissen und Äquator", grid);
  }

  if (layer === "klima") {
    const belts =
      `<rect class="geo-band-polar" x="0" y="0" width="${proj.width}" height="${f1(polN)}"/>` +
      `<rect class="geo-band-temp" x="0" y="${f1(polN)}" width="${proj.width}" height="${f1(trN - polN)}"/>` +
      `<rect class="geo-band-tropic" x="0" y="${f1(trN)}" width="${proj.width}" height="${f1(trS - trN)}"/>` +
      `<rect class="geo-band-temp" x="0" y="${f1(trS)}" width="${proj.width}" height="${f1(proj.height - trS)}"/>` +
      `<line class="geo-equator" x1="0" y1="${f1(eqY)}" x2="${proj.width}" y2="${f1(eqY)}"/>` +
      `<line class="geo-tropic-line" x1="0" y1="${f1(trN)}" x2="${proj.width}" y2="${f1(trN)}"/>` +
      `<line class="geo-tropic-line" x1="0" y1="${f1(trS)}" x2="${proj.width}" y2="${f1(trS)}"/>`;
    const legend =
      `<rect class="legend-panel" x="10" y="176" width="176" height="60" rx="8"/>` +
      `<rect class="geo-band-tropic" x="18" y="185" width="14" height="10" rx="2"/>` +
      label(38, 194, "Tropen (23,5° N – 23,5° S)", "lbl tiny", "start") +
      `<rect class="geo-band-temp" x="18" y="202" width="14" height="10" rx="2"/>` +
      label(38, 211, "Subtropen / Gemäßigte", "lbl tiny", "start") +
      `<rect class="geo-band-polar" x="18" y="219" width="14" height="10" rx="2"/>` +
      label(38, 228, "Subpolare / Polare Zone", "lbl tiny", "start");
    return renderRegionMap("world", "Globale Klimazonen auf der Weltkarte", belts + legend);
  }

  if (layer === "vegetation") {
    const spots: Array<[number, number, string, string]> = [
      [-62, -4, "Immerfeuchter\nRegenwald", "geo-veg-rain"],
      [22, 0, "Kongobecken\n(Regenwald)", "geo-veg-rain"],
      [114, 0, "SO-Asien", "geo-veg-rain"],
      [12, 23, "Wendekreiswüste\nSahara", "geo-veg-desert"],
      [45, 23, "Arabische\nWüste", "geo-veg-desert"],
      [20, 12, "Savannengürtel", "geo-veg-savanna"],
    ];
    const overlay =
      spots
        .map(([lon, lat, text, cls]) => {
          const [x, y] = xy(proj, lon, lat);
          return `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="15"/>${labels(x, y - 16, text, "lbl tiny strong")}`;
        })
        .join("") +
      `<line class="geo-equator" x1="0" y1="${f1(eqY)}" x2="${proj.width}" y2="${f1(eqY)}"/>`;
    return renderRegionMap("world", "Ausgewählte Vegetationsgürtel in Tropen und Subtropen", overlay);
  }

  // abholzung (Satellitenblick-Fokus)
  const [bx, by] = xy(proj, -57, -8);
  const [ix, iy] = xy(proj, 114, -1);
  const [cx, cy] = xy(proj, 21, 0);
  const overlay =
    `<circle class="geo-sat-ring" cx="${f1(bx)}" cy="${f1(by)}" r="18"/>` +
    dot(bx, by, "geo-sat-dot") +
    labels(bx + 18, by - 10, "Amazonien:\nRodungsfront", "lbl tiny strong", "start") +
    `<circle class="geo-sat-ring" cx="${f1(cx)}" cy="${f1(cy)}" r="14"/>` +
    dot(cx, cy, "geo-sat-dot") +
    label(cx, cy + 24, "Kongobecken", "lbl tiny strong") +
    `<circle class="geo-sat-ring" cx="${f1(ix)}" cy="${f1(iy)}" r="14"/>` +
    dot(ix, iy, "geo-sat-dot") +
    label(ix, iy - 18, "Borneo / Sumatra", "lbl tiny strong");
  return renderRegionMap(
    "world",
    "Satelliten-Beobachtungsräume für Landnutzungswandel in den Tropen",
    overlay,
    ["BRA", "COD", "IDN"],
  );
}

export function developmentWorldMap(): string {
  const veryHighHdi = new Set([
    "DEU", "FRA", "GBR", "USA", "CAN", "JPN", "AUS", "NOR", "SWE", "CHE",
    "ITA", "ESP", "AUT", "NLD", "KOR", "NZL", "ARE", "SAU", "CHL", "ARG", "TUR",
  ]);
  const highMidHdi = new Set(["BRA", "MEX", "CHN", "IND", "ZAF", "IDN", "MAR", "EGY", "COL", "PER", "VNM"]);
  const lowHdi = new Set(["NER", "TCD", "CAF", "SSD", "SOM", "MLI", "BFA", "BDI", "MOZ", "ETH", "COD", "HTI"]);
  const cls = (c: CountryShape) => {
    if (veryHighHdi.has(c.id)) return "geo-country geo-dev-high";
    if (highMidHdi.has(c.id)) return "geo-country geo-dev-mid";
    if (lowHdi.has(c.id)) return "geo-country geo-dev-low";
    return "geo-country";
  };
  const labelsOverlay =
    labels(320, 44, "Sehr hoher HDI (Beispiele:\nDeutschland, Japan, USA, VAE)", "lbl tiny strong") +
    labels(455, 174, "Hoher / mittlerer HDI (Beispiele:\nBrasilien, Indien, China)", "lbl tiny strong") +
    labels(355, 126, "Niedriger HDI (Beispiele:\nu. a. im Sahelgürtel)", "lbl tiny strong") +
    `<rect class="legend-panel" x="10" y="178" width="234" height="58" rx="8"/>` +
    `<rect class="geo-dev-high" x="18" y="187" width="12" height="10" rx="2"/>` +
    label(36, 196, "Sehr hoher HDI (Beispiele)", "lbl tiny", "start") +
    `<rect class="geo-dev-mid" x="18" y="203" width="12" height="10" rx="2"/>` +
    label(36, 212, "Hoher / mittlerer HDI (Beispiele)", "lbl tiny", "start") +
    `<rect class="geo-dev-low" x="18" y="219" width="12" height="10" rx="2"/>` +
    label(36, 228, "Niedriger HDI (Beispiele)", "lbl tiny", "start");
  return renderRegionMap(
    "world",
    "Weltkarte mit Modellbeispielen für Länder nach UNDP-HDI-Stufen",
    labelsOverlay,
    [],
    cls,
  );
}

export function climateZonesWorldMap(): string {
  return worldLayerMap("klima");
}

export function tippingWorldMap(): string {
  const { proj } = DATA.world;
  const tips: Array<[number, number, string, "start" | "middle" | "end"]> = [
    [-42, 71, "Grönländischer Eisschild\n(Albedo & Meeresspiegel)", "start"],
    [-32, 52, "Nordatlantik-Umwälzzirkulation\n(AMOC)", "end"],
    [95, 65, "Permafrostböden\n(Methan & CO₂)", "middle"],
    [-60, -6, "Amazonas-Regenwald\n(Trockenstress / Savannisierung)", "start"],
    [146, -18, "Tropische Korallenriffe\n(Erwärmung & Versauerung)", "end"],
  ];
  const overlay = tips
    .map(([lon, lat, text, anchor]) => {
      const [x, y] = xy(proj, lon, lat);
      const dx = anchor === "start" ? 12 : anchor === "end" ? -12 : 0;
      const dy = anchor === "middle" ? -14 : 4;
      return `<circle class="geo-tip-ring" cx="${f1(x)}" cy="${f1(y)}" r="9"/>${dot(x, y, "geo-tip-dot")}${labels(x + dx, y + dy, text, "lbl tiny strong", anchor, 13)}`;
    })
    .join("");
  return renderRegionMap(
    "world",
    "Ausgewählte Kippelemente des globalen Klimasystems auf der Weltkarte",
    overlay,
    ["GRL", "BRA", "RUS"],
  );
}

export function menaOverviewMap(): string {
  const { proj } = DATA.mena;
  const [kairoX, kairoY] = xy(proj, 31.2, 30.0);
  const [riadX, riadY] = xy(proj, 46.7, 24.7);
  const [hormusX, hormusY] = xy(proj, 56.4, 26.5);
  const [atlasX, atlasY] = xy(proj, -4, 32.5);
  const [nil1X, nil1Y] = xy(proj, 32.5, 11);
  const [nil2X, nil2Y] = xy(proj, 31.2, 31.3);
  const [eup1X, eup1Y] = xy(proj, 39, 36.5);
  const [eup2X, eup2Y] = xy(proj, 48.5, 30.0);

  const [eupMidX, eupMidY] = xy(proj, 44, 33);

  const rivers =
    `<path class="river" d="M${f1(nil1X)} ${f1(nil1Y)} Q${f1(nil1X + 4)} ${f1((nil1Y + nil2Y) / 2)} ${f1(nil2X)} ${f1(nil2Y)}"/>` +
    `<path class="river" d="M${f1(eup1X)} ${f1(eup1Y)} Q${f1(eupMidX)} ${f1(eupMidY)} ${f1(eup2X)} ${f1(eup2Y)}"/>`;
  const ridge = `<polyline class="geo-ridge" points="${[
    xy(proj, -8, 31),
    xy(proj, -2, 34),
    xy(proj, 6, 35.5),
  ]
    .map(([x, y]) => `${f1(x)},${f1(y)}`)
    .join(" ")}"/>`;

  const overlay =
    rivers +
    ridge +
    dot(kairoX, kairoY) +
    label(kairoX - 8, kairoY - 8, "Kairo (Nil)", "lbl small strong", "end") +
    dot(riadX, riadY) +
    label(riadX, riadY + 18, "Riad", "lbl small strong") +
    dot(hormusX, hormusY, "geo-tip-dot") +
    label(hormusX - 4, hormusY + 15, "Straße v. Hormus", "lbl tiny strong", "end") +
    label(atlasX, atlasY - 16, "Atlasgebirge", "lbl tiny strong") +
    label(xy(proj, 15, 22)[0], xy(proj, 15, 22)[1], "Sahara", "lbl desert-label") +
    label(xy(proj, 44, 19)[0], xy(proj, 44, 19)[1], "Arabische Halbinsel", "lbl tiny strong") +
    label(xy(proj, 18, 35.5)[0], xy(proj, 18, 35.5)[1], "Mittelmeer", "lbl sea-label") +
    label(xy(proj, 50.8, 27.6)[0], xy(proj, 50.8, 27.6)[1], "Persischer Golf", "lbl tiny sea-label", "end");

  const menaIds = [
    "MAR", "DZA", "TUN", "LBY", "EGY", "JOR", "LBN", "SYR", "IRQ",
    "IRN", "SAU", "OMN", "YEM", "ARE", "QAT", "KWT", "ISR", "PSE", "TUR",
  ];
  return renderRegionMap(
    "mena",
    "Überblickskarte Nordafrika, Naher und Mittlerer Osten (MENA)",
    overlay,
    menaIds,
  );
}

export function africaZonesMap(): string {
  const { proj } = DATA.africa;
  const bands: Array<[number, number, string, string]> = [
    [22, 16, "geo-band-desert", "Sahara (Wüste)"],
    [16, 11, "geo-band-sahel", "Sahelzone (Dorn-/Trockensavanne)"],
    [11, 4, "geo-band-savanna", "Feucht- und Trockensavanne (Nord)"],
    [4, -5, "geo-band-rain", "Tropischer Regenwald (Kongobecken)"],
    [-5, -17, "geo-band-savanna", "Feucht- und Trockensavanne (Süd)"],
    [-17, -22, "geo-band-sahel", "Dornsavanne (Übergang Süd)"],
    [-22, -28, "geo-band-desert", "Trockenräume Kalahari / Namib"],
  ];
  const bandRects = bands
    .map(([latTop, latBot, cls]) => {
      const y1 = xy(proj, 0, latTop)[1];
      const y2 = xy(proj, 0, latBot)[1];
      return `<rect class="${cls}" x="0" y="${f1(y1)}" width="${proj.width}" height="${f1(y2 - y1)}" opacity="0.28"/>`;
    })
    .join("");
  const [bengX1, bengY1] = xy(proj, 10, -28);
  const [bengX2, bengY2] = xy(proj, 9, -12);
  const [rift1X, rift1Y] = xy(proj, 39, 9);
  const [rift2X, rift2Y] = xy(proj, 35, -8);

  const overlay =
    bandRects +
    `<line class="geo-cold-current" x1="${f1(bengX1)}" y1="${f1(bengY1)}" x2="${f1(bengX2)}" y2="${f1(bengY2)}"/>` +
    arrow(bengX1, bengY1, bengX2, bengY2, "geo-cold-arrow") +
    labels(bengX1 - 6, (bengY1 + bengY2) / 2, "Kalter\nBenguelastrom\n(Namib)", "lbl tiny strong", "end") +
    `<path class="geo-ridge" d="M${f1(rift1X)} ${f1(rift1Y)} L${f1(rift2X)} ${f1(rift2Y)}"/>` +
    label(rift1X - 8, rift1Y - 6, "Ostafrikanischer Graben", "lbl tiny strong", "end") +
    label(xy(proj, 14, 20)[0], xy(proj, 14, 20)[1], "Sahara", "lbl desert-label") +
    label(xy(proj, 13, 13.5)[0], xy(proj, 13, 13.5)[1], "Sahelzone", "lbl small strong") +
    label(xy(proj, 21, -0.5)[0], xy(proj, 21, -0.5)[1], "Kongobecken", "lbl small strong") +
    label(xy(proj, 22, -23)[0], xy(proj, 22, -23)[1], "Kalahari", "lbl tiny strong");

  return renderRegionMap(
    "africa",
    "Naturräumliche Gliederung und Klima- und Vegetationsgürtel Afrikas",
    overlay,
    ["SEN", "MLI", "NER", "TCD", "SDN", "NGA", "COD", "KEN", "ETH", "TZA", "ZAF", "NAM"],
  );
}

export function latamOverviewMap(): string {
  const { proj } = DATA.latam;
  const andes = [
    xy(proj, -76, 8),
    xy(proj, -78, -2),
    xy(proj, -70, -16),
    xy(proj, -69, -30),
    xy(proj, -72, -48),
  ];
  const [h1x, h1y] = xy(proj, -73.8, -33.5);
  const [hmx, hmy] = xy(proj, -72.6, -23.5);
  const [h2x, h2y] = xy(proj, -79.5, -11.5);
  const [hur1x, hur1y] = xy(proj, -60, 14);
  const [hurMidX, hurMidY] = xy(proj, -70, 18.5);
  const [hur2x, hur2y] = xy(proj, -80, 22);

  const overlay =
    `<polyline class="geo-ridge" points="${andes.map(([x, y]) => `${f1(x)},${f1(y)}`).join(" ")}"/>` +
    `<path class="geo-cold-current" fill="none" d="M${f1(h1x)} ${f1(h1y)} Q${f1(hmx)} ${f1(hmy)} ${f1(h2x)} ${f1(h2y)}"/>` +
    arrow(hmx + (h2x - hmx) * 0.72, hmy + (h2y - hmy) * 0.72, h2x, h2y, "geo-cold-arrow") +
    labels(xy(proj, -76.5, -28.0)[0], xy(proj, -76.5, -28.0)[1], "Kalter\nHumboldtstrom", "lbl tiny strong", "end") +
    label(xy(proj, -73.0, -21.0)[0], xy(proj, -73.0, -21.0)[1], "Atacama", "lbl tiny strong", "end") +
    `<path class="geo-warm-track" d="M${f1(hur1x)} ${f1(hur1y)} Q${f1(hurMidX)} ${f1(hurMidY)} ${f1(hur2x)} ${f1(hur2y)}"/>` +
    arrow(hur2x + 12, hur2y - 4, hur2x, hur2y, "geo-warm-arrow") +
    label(xy(proj, -72, 23)[0], xy(proj, -72, 23)[1], "Karibik (Hurrikanbahn)", "lbl tiny strong") +
    label(xy(proj, -60, -5)[0], xy(proj, -60, -5)[1], "Amazonasbecken", "lbl small strong") +
    label(xy(proj, -69.2, -16.5)[0], xy(proj, -69.2, -16.5)[1], "Anden", "lbl tiny strong", "start") +
    label(xy(proj, -61, -35)[0], xy(proj, -61, -35)[1], "Pampa", "lbl tiny strong") +
    dot(...xy(proj, -99.1, 19.4)) +
    label(xy(proj, -99.1, 19.4)[0], xy(proj, -99.1, 19.4)[1] - 10, "Mexiko-Stadt", "lbl tiny strong") +
    dot(...xy(proj, -46.6, -23.5)) +
    label(xy(proj, -46.6, -23.5)[0] - 8, xy(proj, -46.6, -23.5)[1] + 15, "São Paulo", "lbl tiny strong", "end");

  return renderRegionMap(
    "latam",
    "Mittel- und Südamerika sowie Karibik: Naturräume, Anden, Amazonasbecken und Meeresströmungen",
    overlay,
    ["MEX", "CUB", "HTI", "DOM", "COL", "PER", "BRA", "CHL", "ARG"],
  );
}
