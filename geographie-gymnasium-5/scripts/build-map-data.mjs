// One-off, offline map preparation (not part of CI or the build).
//
// Usage: node scripts/build-map-data.mjs <folder with Natural Earth GeoJSON>
//
// Reads the public-domain Natural Earth v5.1.1 layers listed in
// src/data/NOTICE.md (their SHA-256 values are checked), projects the three
// map sections the lessons use (world, Germany, Bavaria) and writes
// src/data/maps.json: projected SVG path strings only, no properties beyond a
// name. The one hand-drawn layer (the course of the Lech) is defined below.
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
 * Simplified course of the Lech (Natural Earth has no Lech): Füssen,
 * Schongau, Landsberg, Augsburg, mouth into the Danube near Marxheim.
 */
const LECH = [
  [10.7, 47.57], [10.9, 47.81], [10.87, 48.05], [10.92, 48.37], [10.96, 48.73],
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
    if (f.properties.ADM0_A3 === "FRA") {
      // France's shape includes French Guiana: draw it with South America.
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
      rivers: [
        ...rivers(p, ["Donau", "Danube", "Main", "Isar", "Inn", "Regnitz", "Salzach"]),
        { id: "Lech", d: handPath(p, LECH, false) },
      ],
      lakes: lakes(p, ["Bodensee"]),
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
