// One-off, offline map preparation (not part of CI or the build).
//
// Usage: node scripts/build-map-data.mjs <folder with Natural Earth GeoJSON>
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dir = process.argv[2];
if (!dir) throw new Error("Pass the folder with the Natural Earth files.");

const expected = {
  "ne_110m_admin_0_countries.geojson":
    "6866c877d39cba9c357620878839b336d569f8c662d3cfab4cb1dbe2d39c977f",
  "ne_50m_admin_0_countries.geojson":
    "3e458fc036ad0a66411f2c1e6cac49c5d7bfb81cb1123bc513b22511a2b7fdeb",
  "ne_10m_admin_1_states_provinces.geojson":
    "22d0e3ad85eb3e27f17cabf8ba2d50e554fbc27a87796ff891d958185da62fb5",
  "ne_10m_rivers_lake_centerlines.geojson":
    "bb854a900ecbd3b408df46d5e16e3e0f974ba55993f9d8b5c26e855273c0905a",
  "ne_10m_rivers_europe.geojson":
    "90712202ac46985812e90840df9acd5101599a9c649868d5bc55ee96c2fedd4c",
  "ne_10m_lakes.geojson":
    "2d036f53dedec578001c5c30c2959ee7d4eebc1306900fa4367c49929ec8f2d9",
};
const layer = {};
for (const [file, sha] of Object.entries(expected)) {
  const raw = readFileSync(join(dir, file));
  const actual = createHash("sha256").update(raw).digest("hex");
  if (actual !== sha) throw new Error(`${file}: SHA-256 ${actual}`);
  layer[file.replace(".geojson", "")] = JSON.parse(raw.toString("utf8"));
}

function projection(bbox, width) {
  const [lonMin, latMin, lonMax, latMax] = bbox;
  const c =
    bbox.length > 4
      ? bbox[4]
      : Math.cos(((latMin + latMax) / 2) * (Math.PI / 180));
  const k = width / ((lonMax - lonMin) * c);
  return {
    lonMin,
    latMax,
    k: Number(k.toFixed(5)),
    c: Number(c.toFixed(5)),
    width,
    height: Math.round((latMax - latMin) * k),
  };
}
const xy = (p, [lon, lat]) => [
  (lon - p.lonMin) * p.k * p.c,
  (p.latMax - lat) * p.k,
];

function simplify(points, tol) {
  if (points.length < 4) return points;
  const keep = new Uint8Array(points.length);
  const last = points.length - 1;
  const mid = Math.floor(last / 2);
  keep[0] = keep[mid] = keep[last] = 1;
  const stack = [
    [0, mid],
    [mid, last],
  ];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = points[a],
      [bx, by] = points[b];
    const len = Math.hypot(bx - ax, by - ay) || 1;
    let worst = -1,
      index = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = points[i];
      const d =
        Math.abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / len;
      if (d > worst) {
        worst = d;
        index = i;
      }
    }
    if (worst > tol) {
      keep[index] = 1;
      stack.push([a, index], [index, b]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

function ring(p, coords, close, tol = 0.6) {
  const m = 30;
  const out = [];
  for (const point of coords) {
    let [x, y] = xy(p, point);
    x = Math.min(p.width + m, Math.max(-m, x));
    y = Math.min(p.height + m, Math.max(-m, y));
    const last = out[out.length - 1];
    if (last && Math.hypot(last[0] - x, last[1] - y) < 0.3) continue;
    out.push([x, y]);
  }
  const simplified = simplify(out, tol);
  out.length = 0;
  out.push(...simplified);
  if (out.length < (close ? 3 : 2)) return "";
  const xs = out.map((q) => q[0]),
    ys = out.map((q) => q[1]);
  if (Math.max(...xs) < 0 || Math.min(...xs) > p.width) return "";
  if (Math.max(...ys) < 0 || Math.min(...ys) > p.height) return "";
  return `M${out.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}${close ? "Z" : ""}`;
}

function polygonPath(p, geometry, tol, polyFilter = () => true) {
  const polys =
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polys
    .filter((poly) => polyFilter(poly[0]))
    .flatMap((poly) => poly.map((r) => ring(p, r, true, tol)))
    .join("");
}

function linePath(p, geometry, tol = 0.6) {
  const lines =
    geometry.type === "LineString" ? [geometry.coordinates] : geometry.coordinates;
  return lines.map((l) => ring(p, l, false, tol)).join("");
}

const countries = (
  name,
  p,
  filter = () => true,
  tol = 0.6,
  polyFilter = () => true,
) =>
  layer[name].features
    .filter((f) => filter(f.properties))
    .map((f) => ({
      id: f.properties.ADM0_A3,
      d: polygonPath(p, f.geometry, tol, polyFilter),
    }))
    .filter((x) => x.d);

const rivers = (p, names) => {
  const all = [
    ...layer.ne_10m_rivers_lake_centerlines.features,
    ...layer.ne_10m_rivers_europe.features,
  ];
  return names
    .map((name) => ({
      id: name,
      d: all
        .filter((f) => f.properties.name === name)
        .map((f) => linePath(p, f.geometry))
        .join(""),
    }))
    .filter((x) => x.d);
};

const lakes = (p, names) =>
  layer.ne_10m_lakes.features
    .filter((f) => names.includes(f.properties.name))
    .map((f) => ({ id: f.properties.name, d: polygonPath(p, f.geometry, 0.6) }))
    .filter((x) => x.d);

const states = (p, filter) =>
  layer.ne_10m_admin_1_states_provinces.features
    .filter((f) => f.properties.adm0_a3 === "DEU" && filter(f.properties))
    .map((f) => ({ id: f.properties.name, d: polygonPath(p, f.geometry, 0.7) }))
    .filter((x) => x.d);

const handPath = (p, points, close) =>
  `M${points.map((pt) => xy(p, pt).map((v) => v.toFixed(1)).join(" ")).join("L")}${close ? "Z" : ""}`;

// Filter out positive-lon Aleutians and tropical Hawaii for mainland NA view
const mainlandNA = (adm0) => (outerRing) => {
  if (adm0 === "USA") {
    return outerRing.every(([lon, lat]) => lon < -50 && lat > 23);
  }
  if (adm0 === "RUS") {
    return outerRing.every(([lon]) => lon >= -30 && lon <= 60);
  }
  return true;
};

// Simplified sketch of the Axis-controlled area in Europe around Nov 1942
const AXIS_EUROPE_1942 = [
  [-9.3, 43.0], [-1.8, 43.4], [-5.0, 48.4], [1.6, 51.0], [5.0, 53.5],
  [8.2, 57.1], [5.0, 61.5], [16.0, 69.5], [29.0, 70.0], [32.0, 61.0],
  [30.5, 59.5], [35.0, 56.0], [38.5, 51.5], [44.5, 48.7], [43.0, 44.0],
  [37.5, 44.8], [29.0, 45.2], [28.0, 41.0], [23.8, 37.9], [16.0, 38.0],
  [12.5, 41.9], [8.0, 43.8], [3.1, 42.4], [3.5, 46.5], [-1.5, 46.2],
  [-1.8, 43.4],
];

// Simplified sketch of the 4 Occupation Zones boundaries inside Germany 1945-1949
// Used purely as simplified zone guide lines / overlays on the Germany map.
const ZONE_SBZ = [
  [10.9, 53.95], [10.6, 53.3], [11.0, 52.8], [10.6, 51.9], [10.0, 51.4],
  [9.9, 50.8], [10.4, 50.4], [11.3, 50.25], [12.15, 50.3], [14.8, 50.9],
  [14.7, 52.0], [14.1, 53.2], [14.3, 54.0], [13.4, 54.7], [11.8, 54.1],
];
const ZONE_BRIT = [
  [5.8, 50.7], [7.3, 50.6], [8.5, 51.3], [9.9, 51.5], [10.6, 51.9],
  [11.0, 52.8], [10.6, 53.3], [10.9, 53.95], [8.4, 55.1], [6.6, 53.6],
  [5.8, 51.8],
];
const ZONE_FRENCH = [
  [6.1, 49.5], [6.8, 50.7], [7.8, 50.6], [8.3, 49.9], [8.5, 49.1],
  [9.4, 48.7], [10.1, 48.2], [9.7, 47.5], [7.5, 47.5], [7.9, 48.9],
  [6.3, 49.1],
];

const maps = {};
{
  const p = projection([-180, -86, 180, 84, 1], 800);
  const groups = {};
  const add = (continent, d) => {
    groups[continent] = (groups[continent] ?? "") + d;
  };
  for (const f of layer.ne_110m_admin_0_countries.features) {
    const continent = f.properties.CONTINENT;
    if (continent === "Seven seas (open ocean)") continue;
    if (f.properties.ADM0_A3 === "FRA") {
      const all =
        f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
      for (const poly of all)
        add(
          poly[0].every(([lon]) => lon < -30) ? "South America" : continent,
          polygonPath(p, { type: "Polygon", coordinates: poly }, 0.6),
        );
      continue;
    }
    if (f.properties.ADM0_A3 !== "RUS") {
      add(continent, polygonPath(p, f.geometry, 0.6));
      continue;
    }
    const URAL = 60;
    const clampLon = (geometry, fn) => ({
      type: "MultiPolygon",
      coordinates: geometry.coordinates.map((poly) =>
        poly.map((r) => r.map(([lon, lat]) => [fn(lon), lat])),
      ),
    });
    const polys = { type: "MultiPolygon", coordinates: [] },
      farEast = { type: "MultiPolygon", coordinates: [] };
    const all =
      f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
    for (const poly of all)
      (poly[0].every(([lon]) => lon < -100) ? farEast : polys).coordinates.push(poly);
    add("Europe", polygonPath(p, clampLon(polys, (lon) => Math.min(lon, URAL)), 0.6));
    add("Asia", polygonPath(p, clampLon(polys, (lon) => Math.max(lon, URAL)), 0.6));
    add("Asia", polygonPath(p, farEast, 0.6));
  }
  maps.world = {
    proj: p,
    layers: {
      continents: Object.entries(groups).map(([id, d]) => ({ id, d })),
    },
  };
}
{
  const naCodes = new Set(["USA", "CAN", "MEX", "GRL", "CUB", "GTM", "BLZ", "HND", "SLV", "NIC", "CRI", "PAN", "HTI", "DOM", "JAM", "BHS"]);
  const p = projection([-168, 12, -50, 74], 760);
  maps.northAmerica = {
    proj: p,
    layers: {
      countries: layer.ne_50m_admin_0_countries.features
        .filter((f) => naCodes.has(f.properties.ADM0_A3))
        .map((f) => ({
          id: f.properties.ADM0_A3,
          d: polygonPath(p, f.geometry, 0.7, mainlandNA(f.properties.ADM0_A3)),
        }))
        .filter((x) => x.d),
      rivers: rivers(p, ["Mississippi", "Missouri", "Rio Grande", "St. Lawrence", "Yukon", "Mackenzie", "Colorado", "Columbia"]),
      lakes: lakes(p, ["Lake Superior", "Lake Michigan", "Lake Huron", "Lake Erie", "Lake Ontario", "Great Bear Lake", "Great Slave Lake"]),
    },
  };
}
{
  const naEuCodes = new Set(["USA", "CAN", "MEX", "GRL", "GBR", "IRL", "FRA", "ESP", "PRT", "DEU", "POL", "ITA", "NOR", "SWE", "FIN", "DNK", "NLD", "BEL", "CHE", "AUT", "CZE", "UKR", "BLR", "ISL"]);
  const p = projection([-168, 22, 44, 72], 800);
  maps.northAmericaEurope = {
    proj: p,
    layers: {
      countries: layer.ne_110m_admin_0_countries.features
        .filter((f) => naEuCodes.has(f.properties.ADM0_A3))
        .map((f) => ({
          id: f.properties.ADM0_A3,
          d: polygonPath(p, f.geometry, 0.8, mainlandNA(f.properties.ADM0_A3)),
        }))
        .filter((x) => x.d),
    },
  };
}
{
  const p = projection([-12, 34, 46, 62], 720);
  maps.europe1942 = {
    proj: p,
    layers: {
      countries: countries("ne_50m_admin_0_countries", p, () => true, 0.8, mainlandNA("RUS")),
      axis: [{ id: "axis-1942", d: handPath(p, AXIS_EUROPE_1942, true) }],
    },
  };
}
{
  const p = projection([5.2, 47.0, 15.8, 55.3], 480);
  maps.germany1945 = {
    proj: p,
    layers: {
      countries: countries("ne_50m_admin_0_countries", p, (q) => q.ADM0_A3 !== "DEU"),
      states: states(p, () => true),
      rivers: rivers(p, ["Rhein", "Rhine", "Elbe", "Donau", "Danube", "Main", "Weser", "Oder"]),
      lakes: lakes(p, ["Bodensee"]),
      zones: [
        { id: "sbz", d: handPath(p, ZONE_SBZ, true) },
        { id: "brit", d: handPath(p, ZONE_BRIT, true) },
        { id: "french", d: handPath(p, ZONE_FRENCH, true) },
      ],
    },
  };
}

const out = join(root, "src/data/maps.json");
writeFileSync(out, `${JSON.stringify(maps)}\n`);
console.log(
  `wrote ${out}: ${Object.entries(maps)
    .map(([k, v]) => `${k} ${v.proj.width}×${v.proj.height}`)
    .join(", ")}; ${readFileSync(out).length} bytes`,
);
