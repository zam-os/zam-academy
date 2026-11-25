/**
 * The regional maps of the course. Coordinates are approximate teaching
 * values; the maps are for orientation, not for measuring.
 */
import { label } from "./draw";
import { AFRICA, geoMap, ORIENT, POLAR, TRENCHES, TROPIC, type Location, type Name, type Place } from "./maps";

// ---------------------------------------------------------------- world

/** Simplified climate belts of the Earth (school model, boundaries approximate). */
export function worldZonesMap(): string {
  const belts = [
    { south: -TROPIC, north: TROPIC, cls: "belt-tropic" },
    { south: TROPIC, north: 40, cls: "belt-subtropic" },
    { south: -40, north: -TROPIC, cls: "belt-subtropic" },
    { south: 40, north: 60, cls: "belt-temperate" },
    { south: -60, north: -40, cls: "belt-temperate" },
    { south: 60, north: 90, cls: "belt-cold" },
    { south: -90, north: -60, cls: "belt-cold" },
  ];
  return geoMap({
    region: "world",
    title: "Vereinfachte Klimazonen der Erde als Gürtel mit Äquator, Wendekreisen und Polarkreisen",
    belts,
    parallels: [0, TROPIC, -TROPIC, POLAR, -POLAR],
    names: [
      ["Tropen", -150, 3, "lbl small strong"],
      ["Subtropen", -150, 31, "lbl small strong"],
      ["Subtropen", -150, -31, "lbl small strong"],
      ["gemäßigte Zone", -140, 50, "lbl small strong"],
      ["gemäßigte Zone", -140, -50, "lbl small strong"],
      ["kalte Zone", -150, 70, "lbl small strong"],
    ],
    places: [["Bayern", 11.5, 48.8, 8, 4]],
  });
}

export const TIME_CITIES: ReadonlyArray<readonly [name: string, utc: number, lon: number, lat: number, dx: number, dy: number]> = [
  ["New York", -5, -74, 40.7, 0, -10],
  ["London", 0, -0.13, 51.5, -6, -8],
  ["München", 1, 11.58, 48.14, 8, 14],
  ["Nairobi", 3, 36.82, -1.29, 0, 18],
  ["Dubai", 4, 55.3, 25.27, 8, -6],
  ["Jakarta", 7, 106.85, -6.2, 0, 18],
  ["Tokio", 9, 139.69, 35.69, 0, -10],
];

/** Local clock time (0–23) and day shift for a city when it is `munich` o'clock in Munich (MEZ). */
export function localTime(munich: number, utc: number): { hour: number; day: -1 | 0 | 1 } {
  const raw = munich - 1 + utc;
  const hour = ((raw % 24) + 24) % 24;
  return { hour, day: raw < 0 ? -1 : raw >= 24 ? 1 : 0 };
}

export function timeZoneMap(munich?: number): string {
  const meridians = Array.from({ length: 24 }, (_, i) => -172.5 + i * 15);
  const places: Place[] = TIME_CITIES.map(([name, utc, lon, lat, dx, dy]) => {
    if (munich === undefined) return [`${name} · UTC${utc === 0 ? "" : utc > 0 ? ` +${utc}` : ` −${-utc}`}`, lon, lat, dx, dy] as const;
    const { hour, day } = localTime(munich, utc);
    return [`${name} ${hour} Uhr${day === 1 ? " (+1 Tag)" : day === -1 ? " (−1 Tag)" : ""}`, lon, lat, dx, dy] as const;
  });
  return geoMap({
    region: "world",
    title: munich === undefined
      ? "Weltkarte mit Grenzen der Zeitzonen im Abstand von 15 Längengraden und sieben Städten"
      : `Uhrzeiten in sieben Städten, wenn es in München ${munich} Uhr ist`,
    meridians,
    parallels: [0],
    dashed: [{ cls: "date-line", points: [[180, -58], [180, 80]] }],
    names: [["Datumsgrenze", 150, -50, "lbl tiny strong"], ["Nullmeridian", 0, -50, "lbl tiny strong"]],
    places,
    overlay: (project) => {
      const [x0, y0] = project([-7.5, 80]);
      const [x1, y1] = project([7.5, -58]);
      return `<rect class="utc-band" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}"/>`;
    },
  });
}

// ---------------------------------------------------------------- africa

export type AfricaLayer = "fluesse" | "hochland" | "staaten";
export function africaMap(layer?: AfricaLayer): string {
  const rivers = Object.values(AFRICA.rivers);
  const showRivers = layer === undefined || layer === "fluesse";
  const showHigh = layer === undefined || layer === "hochland";
  const names: Name[] = [
    ["Atlantischer Ozean", -10, -12, "sea-label"],
    ["Indischer Ozean", 48, -26, "sea-label"],
    ["Golf von Guinea", 3, 1.5, "sea-label"],
    ["Sahara", 10, 21, "desert-label"],
    ["Sahel", 2, 15, "lbl small"],
  ];
  if (showRivers)
    names.push(["Kongo", 21, 2.8, "river-label"], ["Niger", -6, 15.5, "river-label"], ["Nil", 34.5, 13, "river-label"], ["Sambesi", 30, -14.2, "river-label"],
      ["Viktoriasee", 29.6, -3.6, "lbl tiny strong"], ["Kongobecken", 21, -2.5, "lbl small"]);
  if (showHigh)
    names.push(["Äthiop. Hochland", 39.5, 10.5, "lbl small strong"], ["Ostafrik. Graben", 44.5, 4.5, "lbl tiny strong"], ["Drakensberge", 34, -29.5, "lbl tiny strong"],
      ["Kalahari", 22, -23, "desert-label"], ["Namib", 13.5, -24, "desert-label"]);
  const places: Place[] = layer === "staaten"
    ? [["Lagos", 3.4, 6.5, -6, 4], ["Kinshasa", 15.3, -4.3, -6, 4], ["Nairobi", 36.8, -1.3, 7, 4], ["Addis Abeba", 38.75, 9, 7, 4], ["Johannesburg", 28.05, -26.2, 7, 4]]
    : showHigh ? [["Kilimandscharo", 37.35, -3.07, 7, 12]] : [];
  return geoMap({
    region: "africa",
    title: "Afrika südlich der Sahara mit Flüssen, Hochländern, Landschaften und Städten",
    highlight: layer === "staaten" ? ["NGA", "COD", "KEN", "ETH", "ZAF"] : [],
    rivers: showRivers ? rivers : [],
    ridges: showHigh ? Object.values(AFRICA.ridges) : [],
    parallels: [0, -TROPIC],
    names,
    places,
  });
}

// ---------------------------------------------------------------- orient

export type OrientLayer = "meere" | "fluesse" | "staaten";
export function orientMap(layer?: OrientLayer): string {
  const names: Name[] = [
    ["Mittelmeer", 18, 34.5, "sea-label"],
    ["Rotes Meer", 38.6, 20, "sea-label"],
    ["Persischer Golf", 51.5, 27.4, "sea-label"],
    ["Arabisches Meer", 60, 16, "sea-label"],
    ["Atlantik", -14, 27, "sea-label"],
    ["Schwarzes Meer", 34, 43.3, "sea-label"],
    ["Kasp. Meer", 51, 41.5, "sea-label"],
  ];
  if (layer !== "meere") names.push(["Sahara", 8, 25, "desert-label"], ["Arabische Halbinsel", 46, 23, "desert-label"]);
  if (layer === undefined || layer === "fluesse")
    names.push(["Nil", 30.3, 25.5, "river-label"], ["Euphrat", 39.6, 34.2, "river-label"], ["Tigris", 45.3, 35.6, "river-label"],
      ["Atlas", -3, 33.5, "lbl tiny strong"], ["Zagros", 51, 31.6, "lbl tiny strong"], ["Taurus", 33, 38.4, "lbl tiny strong"]);
  const places: Place[] = layer === "staaten"
    ? [["Kairo", 31.24, 30.04, -6, 12], ["Riad", 46.7, 24.7, 0, -9], ["Dubai", 55.3, 25.27, 7, 10], ["Teheran", 51.39, 35.69, 0, -9], ["Bagdad", 44.36, 33.31, -6, -6], ["Istanbul", 28.98, 41.01, 0, -9]]
    : layer === undefined ? [["Kairo", 31.24, 30.04, -6, 12], ["Dubai", 55.3, 25.27, 7, 10]] : [];
  return geoMap({
    region: "orient",
    title: "Nordafrika und Westasien mit Meeren, Flüssen, Gebirgen und Städten",
    highlight: layer === "staaten" ? ["EGY", "SAU", "ARE", "IRN", "IRQ", "TUR"] : [],
    rivers: layer === undefined || layer === "fluesse" ? Object.values(ORIENT.rivers) : [],
    ridges: layer === undefined || layer === "fluesse" ? Object.values(ORIENT.ridges) : [],
    parallels: [TROPIC],
    names,
    places,
  });
}

// ---------------------------------------------------------------- islands

export type IslandLayer = "inseln" | "meere" | "staaten";
const VOLCANOES: Place[] = [["Krakatau", 105.42, -6.1, -6, 12], ["Merapi", 110.44, -7.54, 0, 16], ["Pinatubo", 120.35, 15.13, 8, 12]];
export function islandsMap(layer?: IslandLayer, hazards = false): string {
  const names: Name[] = [["Indischer Ozean", 86, -7, "sea-label"], ["Pazifik", 139, 13, "sea-label"]];
  if (layer !== "staaten" || hazards)
    names.push(["Südchines. Meer", 113, 13, "sea-label"], ["Philippinensee", 131, 21, "sea-label"], ["Javasee", 111, -5, "sea-label"],
      ["Str. v. Malakka", 95.5, 5.6, "lbl tiny strong"]);
  if (layer === undefined || layer === "inseln")
    names.push(["Sumatra", 101.5, -1.5, "lbl small strong"], ["Java", 110, -8.9, "lbl tiny strong"], ["Borneo", 114, 0.6, "lbl small strong"],
      ["Sulawesi", 121, -2.3, "lbl tiny strong"], ["Luzon", 121.3, 17.4, "lbl tiny strong"], ["Mindanao", 125, 7.7, "lbl tiny strong"],
      ["Neuguinea", 140, -4.5, "lbl small strong"], ["Taiwan", 121, 24.4, "lbl tiny strong"], ["Sri Lanka", 80.7, 9.6, "lbl tiny strong"]);
  const places: Place[] = hazards
    ? VOLCANOES
    : layer === "staaten"
      ? [["Jakarta", 106.85, -6.2, -6, 12], ["Manila", 120.98, 14.6, 7, 4], ["Kuala Lumpur", 101.69, 3.14, -6, -6], ["Singapur", 103.82, 1.35, 7, 10], ["Taipeh", 121.56, 25.03, 7, 4], ["Colombo", 79.86, 6.93, 7, 6], ["Malé", 73.5, 4.17, 0, -9]]
      : layer === undefined ? [["Singapur", 103.82, 1.35, 7, 10], ["Manila", 120.98, 14.6, 7, 4]] : [];
  return geoMap({
    region: "islands",
    title: hazards
      ? "Inselwelt Südostasiens mit Tiefseegräben an Plattengrenzen und ausgewählten Vulkanen"
      : "Die Inselstaaten Asiens mit Inseln, Meeren und Hauptstädten",
    highlight: layer === "staaten" ? ["IDN", "PHL", "MYS", "BRN", "TLS", "TWN", "LKA"] : [],
    parallels: [0],
    dashed: hazards ? [{ cls: "trench", points: TRENCHES.sunda }, { cls: "trench", points: TRENCHES.philippine }] : [],
    names,
    places,
  });
}

/** Epicentre of the Banda Sea earthquake of 2026-11-21 (GEOFON: 7.62° S, 127.39° E). */
export const BANDA: Location = [127.39, -7.62];
export function bandaMap(): string {
  return geoMap({
    region: "islands",
    title: "Epizentrum des Erdbebens vom 21. November 2026 in der Bandasee nordöstlich von Osttimor",
    highlight: ["IDN", "TLS"],
    parallels: [0],
    dashed: [{ cls: "trench", points: TRENCHES.sunda }],
    names: [["Bandasee", 128, -5.2, "sea-label"], ["Sulawesi", 121, -2.3, "lbl tiny strong"], ["Timor", 124.8, -10.4, "lbl tiny strong"], ["Indonesien", 112, -1.8, "lbl small strong"]],
    places: [["Jakarta", 106.85, -6.2, -6, 12], ["Dili", 125.57, -8.56, -8, 4]],
    overlay: (project) => {
      const [x, y] = project(BANDA);
      return `<circle class="quake-ring" cx="${x}" cy="${y}" r="16"/><circle class="quake-ring" cx="${x}" cy="${y}" r="28"/><circle class="quake" cx="${x}" cy="${y}" r="7"/>` +
        label(x - 18, y - 16, "Epizentrum · 21. 11. 2026", "lbl small strong", "end");
    },
  });
}

// ---------------------------------------------------------------- Japan and Australia

export function japanMap(plains = false): string {
  const names: Name[] = [
    ["Japanisches Meer", 134, 40.5, "sea-label"], ["Pazifik", 143.5, 32.5, "sea-label"],
    ["Hokkaido", 143, 43.6, "lbl small strong"], ["Honshu", 139.2, 38.4, "lbl small strong"],
    ["Shikoku", 133.4, 32.9, "lbl tiny strong"], ["Kyushu", 130.4, 31.4, "lbl tiny strong"],
  ];
  if (plains) names.push(["Kanto-Ebene", 140.6, 36.6, "lbl tiny strong"]);
  return geoMap({
    region: "japan",
    title: plains
      ? "Japan mit dem Städteband von Tokio über Nagoya bis Osaka in den Küstenebenen"
      : "Japan mit den vier Hauptinseln, dem Fuji und großen Städten",
    highlight: ["JPN"],
    dashed: [{ cls: "trench", points: TRENCHES.japan }],
    names,
    places: [["Tokio", 139.69, 35.69, 8, 4], ["Osaka", 135.5, 34.69, -6, 12], ["Nagoya", 136.9, 35.18, 0, 16], ["Sapporo", 141.35, 43.06, -7, 4], ["Fuji", 138.73, 35.36, -6, -6]],
    overlay: plains
      ? (project) => {
        const band = ([[139.9, 35.9], [136.9, 35.2], [135.4, 34.7], [132.5, 34.3], [130.4, 33.6]] as Location[]).map((p) => project(p).join(",")).join(" ");
        return `<polyline class="city-band" points="${band}"/>`;
      }
      : undefined,
  });
}

export function australiaMap(): string {
  return geoMap({
    region: "australia",
    title: "Australien mit Großer Wasserscheide, Outback, Great Barrier Reef und Küstenstädten",
    highlight: ["AUS"],
    parallels: [-TROPIC],
    ridges: [[[145.3, -15], [147, -20], [149, -25], [151, -29], [150, -33], [148, -36], [146.5, -37.3]]],
    dashed: [{ cls: "reef", points: [[143.5, -11], [145.6, -15], [147.5, -18.5], [150, -21], [152.8, -24]] }],
    names: [
      ["Outback", 128, -25.5, "desert-label"], ["Great Barrier Reef", 151.5, -17, "lbl tiny strong"],
      ["Große Wasserscheide", 141.5, -27.5, "lbl tiny strong"], ["Indischer Ozean", 113.5, -37, "sea-label"],
      ["Pazifik", 155, -36, "sea-label"], ["Wendekreis", 115, -22.4, "lbl tiny"],
    ],
    places: [["Sydney", 151.21, -33.87, -6, 4], ["Melbourne", 144.96, -37.81, 0, 14], ["Brisbane", 153.03, -27.47, -6, 4], ["Perth", 115.86, -31.95, 7, 4], ["Canberra", 149.13, -35.28, -6, 6], ["Uluru", 131.04, -25.34, 0, 14]],
  });
}

export function pacificMap(trade = false): string {
  return geoMap({
    region: "pacific",
    title: trade
      ? "Handelsströme: Rohstoffe von Australien nach Japan, Industriegüter von Japan nach Australien"
      : "Japan auf der Nordhalbkugel und Australien auf der Südhalbkugel am Pazifik",
    highlight: ["JPN", "AUS"],
    parallels: [0, TROPIC, -TROPIC],
    names: trade
      ? [["Eisenerz, Kohle, Flüssiggas", 147, 3, "lbl small strong"], ["Autos, Maschinen", 122, 8, "lbl small strong"]]
      : [["Japan", 147, 40, "lbl small strong"], ["Australien", 134, -26, "lbl small strong"], ["Äquator", 156, 2, "lbl tiny"]],
    arrows: trade
      ? [[[148, -20], [142, 32], "arrow export-arrow"], [[136, 33], [131, -12], "arrow import-arrow"]]
      : [],
    places: [["Tokio", 139.69, 35.69, -7, 4], ["Sydney", 151.21, -33.87, -7, 4]],
  });
}
