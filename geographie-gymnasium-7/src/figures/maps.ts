import countries from "../data/europe.json";
import { arrow, dot, label, svg } from "./draw";

type Place = readonly [name: string, lon: number, lat: number];
type Location = readonly [lon: number, lat: number];
const WIDTH = 580;
const HEIGHT = 340;
const project = ([lon, lat]: Location): [number, number] =>
  [(lon + 32) * 6, (74 - lat) * 8.5];

export const europeRegions = {
  north: ["NOR", "SWE", "FIN", "ISL", "DNK"],
  southwest: ["PRT", "ESP"],
  centre: ["DEU", "CZE", "AUT", "SVK", "POL"],
};
const stateLabels: Record<string, Place[]> = {
  north: [["Norwegen", 10, 61], ["Finnland", 27, 66], ["Island", -19, 65]],
  southwest: [["Portugal", -8.05, 40.5], ["Spanien", -2.7, 41.1]],
  centre: [["Deutschland", 8.7, 52.4], ["Polen", 20.1, 53.1], ["Tschechien", 15.5, 49.8]],
};

function annotate([name, lon, lat]: Place, mark = false): string {
  const [x, y] = project([lon, lat]);
  return (mark ? dot(x, y) : "") + label(x, y - (mark ? 8 : 0), name, "lbl geo-map-label");
}

export function europeMap(title: string, overlay = "", highlights: readonly string[] = []): string {
  const base = countries.map(({ id, path }) =>
    `<path class="${highlights.includes(id) ? "geo-country geo-selected" : "geo-country"}" d="${path}" fill-rule="evenodd"/>`
  ).join("");
  const north = label(548, 30, "N", "lbl strong") + arrow(548, 58, 548, 37);
  return svg(WIDTH, HEIGHT, title, `<rect class="sea" width="${WIDTH}" height="${HEIGHT}"/>${base}${overlay}${north}`);
}

export function regionsMap(region?: keyof typeof europeRegions): string {
  const names = region ? stateLabels[region] : [
    ["Island", -19, 65], ["Norwegen", 10, 61], ["Portugal", -9.4, 39],
    ["Spanien", -1.7, 40], ["Tschechien", 16, 50],
  ] satisfies Place[];
  const flags = region ? europeRegions[region] : Object.values(europeRegions).flat();
  return europeMap("Europas Teilräume mit markierten Staaten", names.map((entry) => annotate(entry)).join(""), flags);
}

export function portsMap(showRoutes = true): string {
  const rotterdam: Location = [4.48, 51.92];
  const hamburg: Location = [9.99, 53.55];
  const duisburg: Location = [6.75, 51.43];
  const [rx, ry] = project(rotterdam);
  const [hx, hy] = project(hamburg);
  const [dx, dy] = project(duisburg);
  const routes = showRoutes
    ? `<path class="geo-route" d="M${rx} ${ry} Q${rx - 6} ${ry - 25} ${hx - 22} ${hy - 10} L${hx} ${hy}"/><path class="geo-inland" d="M${rx} ${ry} L${dx} ${dy}"/>`
    : "";
  const labels = label(rx - 8, ry + 16, "Rotterdam", "lbl geo-map-label", "end")
    + label(hx + 7, hy - 9, "Hamburg", "lbl geo-map-label", "start")
    + label(dx + 10, dy + 20, "Duisburg", "lbl geo-map-label", "start");
  return europeMap("Rotterdam an der Nordsee, Hamburg an der Elbe und Duisburg im Hinterland", routes +
    dot(rx, ry) + dot(hx, hy) + dot(dx, dy) + labels);
}

export function reliefMap(): string {
  const labels: Place[] = [
    ["Pyrenäen", 0.3, 42.65], ["Alpen", 10.5, 46.8], ["Ural", 59, 62],
    ["Osteuropäische Ebene", 37, 53], ["Skandinavisches Gebirge", 13, 65],
  ];
  const ridges: Location[][] = [
    [[-2, 42.8], [2.8, 42.5]], [[5.8, 45.1], [9, 46.7], [15.5, 47.2]],
    [[8, 60.5], [14, 65.8], [18, 68.5]], [[55, 53], [59, 60], [64, 66]],
  ];
  const lines = ridges.map((ridge) => `<polyline class="geo-ridge" points="${ridge.map(project).map((point) => point.join(",")).join(" ")}"/>`).join("");
  return europeMap("Schematische Lage europäischer Gebirgssysteme und der Osteuropäischen Ebene", lines +
    labels.map((entry) => annotate(entry)).join(""));
}

export function seasMap(): string {
  const seas: Place[] = [
    ["Atlantik", -20, 48], ["Nordsee", 2, 56], ["Ostsee", 20, 58.5],
    ["Mittelmeer", 15, 34.9], ["Schwarzes Meer", 34, 43.9],
  ];
  return europeMap("Atlantik, Nordsee, Ostsee, Mittelmeer und Schwarzes Meer", seas.map((entry) => annotate(entry)).join(""));
}

export function tectonicMap(): string {
  const places: Place[] = [["Island", -18, 65], ["Süditalien", 15, 40.6], ["Griechenland", 24, 37]];
  return europeMap("Lagebeispiele für Plattengrenzen in Island und im südlichen Europa", places.map((entry) => annotate(entry, true)).join(""));
}

export function connectionsMap(): string {
  const [x, y] = project([12.66, 55.62]);
  const leader = `<line class="geo-leader" x1="${x}" y1="${y}" x2="${x + 28}" y2="${y + 17}"/>`;
  const point = leader + dot(x, y) + label(x + 33, y + 22, "Öresund", "lbl geo-map-label", "start");
  const names: Place[] = [["Dänemark", 9.2, 56.1], ["Schweden", 18.8, 59.5]];
  return europeMap("Öresund zwischen Dänemark und Schweden", point + names.map((entry) => annotate(entry)).join(""), ["DNK", "SWE"]);
}
