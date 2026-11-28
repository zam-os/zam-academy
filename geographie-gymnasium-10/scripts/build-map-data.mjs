// Usage: node scripts/build-map-data.mjs /path/to/ne_110m_admin_0_countries.geojson
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const raw = readFileSync(process.argv[2]);
const sha256 = createHash("sha256").update(raw).digest("hex");
if (
  sha256 !== "6866c877d39cba9c357620878839b336d569f8c662d3cfab4cb1dbe2d39c977f"
) {
  throw new Error("Expected Natural Earth v5.1.1 Admin 0 countries at 1:110m");
}

const { features } = JSON.parse(raw);

function spec(lonMin, latMin, lonMax, latMax, width, cosine = true) {
  const c = cosine ? Math.cos(((latMin + latMax) / 2) * (Math.PI / 180)) : 1;
  const k = width / ((lonMax - lonMin) * c);
  return {
    lonMin,
    lonMax,
    latMin,
    latMax,
    c: Number(c.toFixed(5)),
    k: Number(k.toFixed(5)),
    width,
    height: Math.round((latMax - latMin) * k),
  };
}

const REGIONS = {
  world: spec(-180, -58, 180, 80, 640, false),
  mena: spec(-18, 10, 66, 44, 580, true),
  africa: spec(-20, -36, 54, 24, 520, true),
  latam: spec(-118, -56, -32, 33, 480, true),
};

function ringHasWrapJump(ring) {
  for (let i = 1; i < ring.length; i++) {
    if (Math.abs(ring[i][0] - ring[i - 1][0]) > 180) return true;
  }
  return false;
}

function projectRegion(p) {
  const m = 24;
  const toXY = ([lon, lat]) => {
    const x = Math.min(p.width + m, Math.max(-m, (lon - p.lonMin) * p.k * p.c));
    const y = Math.min(p.height + m, Math.max(-m, (p.latMax - lat) * p.k));
    return [x.toFixed(1), y.toFixed(1)];
  };

  const countries = [];
  for (const { properties, geometry } of features) {
    if (properties.ADM0_A3 === "ATA") continue;
    const polygons =
      geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
    const visible = polygons.filter(([outer]) => {
      if (ringHasWrapJump(outer)) return false;
      return outer.some(
        ([lon, lat]) =>
          lon >= p.lonMin - 4 &&
          lon <= p.lonMax + 4 &&
          lat >= p.latMin - 4 &&
          lat <= p.latMax + 4,
      );
    });
    if (visible.length === 0) continue;
    const d = visible
      .flatMap((polygon) =>
        polygon.map(
          (ring) =>
            ring
              .map((pt, i) => {
                const [x, y] = toXY(pt);
                return `${i ? "L" : "M"}${x} ${y}`;
              })
              .join("") + "Z",
        ),
      )
      .join("");
    countries.push({
      id: properties.ADM0_A3,
      continent: properties.CONTINENT,
      d,
    });
  }
  return { proj: p, countries };
}

const maps = Object.fromEntries(
  Object.entries(REGIONS).map(([name, p]) => [name, projectRegion(p)]),
);

writeFileSync(
  new URL("../src/data/maps.json", import.meta.url),
  JSON.stringify(maps) + "\n",
);
console.log(
  Object.entries(maps)
    .map(([k, v]) => `${k} (${v.proj.width}x${v.proj.height}): ${v.countries.length} shapes`)
    .join(" | "),
);
