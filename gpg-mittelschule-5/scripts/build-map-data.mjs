// One-off, offline map preparation (not part of CI or the build).
//
// Usage: node scripts/build-map-data.mjs <folder with Natural Earth GeoJSON>
//
// Reads the public-domain Natural Earth v5.1.1 layers listed in
// src/data/NOTICE.md (their SHA-256 values are checked), projects the six
// map sections the lessons use and writes src/data/maps.json: projected SVG
// path strings only, no properties beyond a name. The two hand-drawn layers
// (simplified Roman Empire around 117 AD and the Limes line) are defined
// below and are labelled as simplified sketches wherever the app shows them.
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

/** Equirectangular projection; `c` stretches longitude at the map's middle latitude. */
function projection(bbox, width) {
  const [lonMin, latMin, lonMax, latMax] = bbox;
  const c = bbox.length > 4 ? bbox[4] : Math.cos(((latMin + latMax) / 2) * (Math.PI / 180));
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

/** Douglas-Peucker: keep the points that deviate more than `tol` pixels. */
function simplify(points, tol) {
  if (points.length < 4) return points;
  const keep = new Uint8Array(points.length);
  const last = points.length - 1;
  // A closed ring starts and ends on one point: split it at its middle.
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

/** Clamp to a margin around the frame and simplify with `tol` pixels. */
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
  // A ring that lies entirely in the clamped margin is invisible.
  if (Math.max(...xs) < 0 || Math.min(...xs) > p.width) return "";
  if (Math.max(...ys) < 0 || Math.min(...ys) > p.height) return "";
  return `M${out.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}${close ? "Z" : ""}`;
}
function polygonPath(p, geometry, tol) {
  const polys =
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polys
    .flatMap((poly) => poly.map((r) => ring(p, r, true, tol)))
    .join("");
}
function linePath(p, geometry, tol = 0.6) {
  const lines =
    geometry.type === "LineString" ? [geometry.coordinates] : geometry.coordinates;
  return lines.map((l) => ring(p, l, false, tol)).join("");
}
const countries = (name, p, filter = () => true, tol) =>
  layer[name].features
    .filter((f) => filter(f.properties))
    .map((f) => ({
      id: f.properties.ADM0_A3,
      d: polygonPath(p, f.geometry, tol),
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
    .map((f) => ({ id: f.properties.name, d: polygonPath(p, f.geometry) }));
const states = (p, filter) =>
  layer.ne_10m_admin_1_states_provinces.features
    .filter((f) => f.properties.adm0_a3 === "DEU" && filter(f.properties))
    .map((f) => ({ id: f.properties.name, d: polygonPath(p, f.geometry, 0.7) }))
    .filter((x) => x.d);

/**
 * Simplified sketch of the Roman Empire at its greatest extent (117 AD),
 * longitude/latitude. Only its land border matters: the app clips the land
 * with this outline, so sea areas inside it stay sea. Client kingdoms are
 * not shown.
 */
const ROMAN_EMPIRE_117 = [
  [-11, 34], [-11, 49.5], [-5.8, 49.5], [-5.6, 52], [-5, 54], [-3.6, 54.6],
  [-3, 55.05], [-1.5, 55.05], [2, 55], [4.4, 52.15], [5.1, 52.08],
  [5.9, 51.88], [6.25, 51.85], [6.7, 51.6], [6.8, 51.3], [6.95, 50.95],
  [7.1, 50.73], [7.33, 50.5], [8.57, 50.27], [8.67, 50.43], [8.95, 50.4],
  [8.98, 50.08], [9.26, 49.7], [9.37, 49.59], [9.42, 49.43], [9.47, 49.31],
  [9.55, 49.08], [9.63, 48.87], [9.69, 48.8], [10.09, 48.84], [10.53, 49.02],
  [10.75, 49.11], [10.97, 49.03], [11.39, 48.95], [11.78, 48.85],
  [12.1, 49.02], [12.57, 48.88], [13.46, 48.57], [14.29, 48.31],
  [15.6, 48.4], [16.37, 48.21], [16.86, 48.12], [17.1, 48.14], [18, 47.75],
  [18.9, 47.8], [19.05, 47.5], [18.95, 46.2], [18.9, 45.6], [19, 45.3],
  [20.4, 44.85], [21, 44.9], [21.3, 46.2], [22.5, 47], [23.3, 47.4],
  [24.5, 47.3], [25.4, 46.8], [25.8, 45.9], [25.2, 45.4], [24.6, 43.75],
  [26, 43.9], [27.3, 44.1], [28, 44.6], [28.2, 45.4], [29.6, 45.2],
  [29.8, 44.8], [41.5, 42], [43.5, 41.2], [45.5, 41], [46.5, 39.5],
  [45, 38.3], [44.5, 37.2], [45.6, 35.5], [46.5, 33], [48.5, 30],
  [47.8, 30.4], [46.3, 31.05], [45.3, 31.3], [44.4, 32], [42.8, 33.6],
  [40.9, 34.45], [40.7, 34.75], [39, 33.5], [38.5, 31], [37.9, 26.8],
  [36, 27.2], [35.5, 23.9], [32.6, 22.8], [30, 24.5], [28.5, 25.5],
  [25.5, 29], [24, 30.5], [20, 30], [19.5, 29.8], [16, 30.6], [13.5, 30.9],
  [11, 31.6], [9.5, 32.8], [8, 34], [6, 34.6], [3.5, 35.2], [1, 35.1],
  [-2, 35], [-4.5, 34.6], [-5.5, 33.9], [-7, 33.8],
];
/** Simplified line of the Upper Germanic-Raetian Limes, Rhine to Danube. */
const LIMES = [
  [7.33, 50.5], [7.75, 50.33], [8.1, 50.26], [8.57, 50.27], [8.67, 50.43],
  [8.95, 50.4], [8.98, 50.08], [9.26, 49.7], [9.37, 49.59], [9.42, 49.43],
  [9.47, 49.31], [9.55, 49.08], [9.63, 48.87], [9.69, 48.8], [10.09, 48.84],
  [10.53, 49.02], [10.75, 49.11], [10.97, 49.03], [11.39, 48.95],
  [11.78, 48.85],
];
const handPath = (p, points, close) =>
  `M${points.map((pt) => xy(p, pt).map((v) => v.toFixed(1)).join(" ")).join("L")}${close ? "Z" : ""}`;

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
    if (f.properties.ADM0_A3 !== "RUS") {
      add(continent, polygonPath(p, f.geometry, 0.6));
      continue;
    }
    // Natural Earth files all of Russia under Europe. Schools draw the
    // border at the Urals: split at about 60° E so Siberia counts as Asia.
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
  const bbox = [5.3, 47.1, 15.6, 55.2];
  const p = projection(bbox, 420);
  maps.germany = {
    proj: p,
    layers: {
      countries: countries(
        "ne_50m_admin_0_countries",
        p,
        (q) => q.ADM0_A3 !== "DEU",
      ),
      states: states(p, () => true),
      rivers: rivers(p, ["Rhein", "Rhine", "Elbe", "Donau", "Danube", "Main", "Weser", "Oder", "Mosel", "Inn", "Isar"]),
      lakes: lakes(p, ["Bodensee"]),
    },
  };
}
{
  const p = projection([8.7, 47.15, 14.1, 50.65], 460);
  maps.bavaria = {
    proj: p,
    layers: {
      countries: countries("ne_50m_admin_0_countries", p, (q) => q.ADM0_A3 !== "DEU"),
      states: states(p, () => true),
      rivers: rivers(p, ["Donau", "Danube", "Main", "Isar", "Inn", "Regnitz", "Salzach"]),
      lakes: lakes(p, ["Bodensee"]),
    },
  };
}
{
  const p = projection([24.5, 21.5, 36.5, 32.2], 380);
  maps.egypt = {
    proj: p,
    layers: {
      countries: countries("ne_50m_admin_0_countries", p),
      rivers: rivers(p, ["Nile"]),
      lakes: lakes(p, ["Lake Nasser"]),
    },
  };
}
{
  const p = projection([-11, 22, 50, 58.5], 760);
  maps.rome = {
    proj: p,
    layers: {
      countries: countries("ne_50m_admin_0_countries", p, () => true, 0.8),
      empire: [{ id: "empire-117", d: handPath(p, ROMAN_EMPIRE_117, true) }],
    },
  };
}
{
  const p = projection([5.8, 47.2, 14.2, 51.0], 520);
  maps.limes = {
    proj: p,
    layers: {
      countries: countries("ne_50m_admin_0_countries", p, (q) => q.ADM0_A3 !== "DEU"),
      states: states(p, () => true),
      rivers: rivers(p, ["Rhein", "Rhine", "Donau", "Danube", "Main", "Inn", "Isar"]),
      lakes: lakes(p, ["Bodensee"]),
      limes: [{ id: "limes", d: handPath(p, LIMES, false) }],
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
