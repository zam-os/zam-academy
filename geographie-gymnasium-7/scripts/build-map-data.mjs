// Usage: node scripts/build-map-data.mjs ne_110m_admin_0_countries.geojson
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const raw = readFileSync(process.argv[2]);
const sha256 = createHash("sha256").update(raw).digest("hex");
if (sha256 !== "6866c877d39cba9c357620878839b336d569f8c662d3cfab4cb1dbe2d39c977f") {
  throw new Error("Expected Natural Earth v5.1.1 Admin 0 countries at 1:110m");
}

const { features } = JSON.parse(raw);
const shapes = features.flatMap(({ properties, geometry }) => {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  const visible = polygons.filter(([outer]) => outer.some(([lon, lat]) =>
    lon > -34 && lon < 69 && lat > 27 && lat < 74));
  if (visible.length === 0) return [];
  return [{
    id: properties.ADM0_A3,
    path: visible.flatMap((polygon) => polygon.map((ring) =>
      ring.map(([lon, lat], i) =>
        `${i ? "L" : "M"}${((lon + 32) * 6).toFixed(1)} ${((74 - lat) * 8.5).toFixed(1)}`
      ).join("") + "Z"
    )).join(""),
  }];
});
writeFileSync(new URL("../src/data/europe.json", import.meta.url), JSON.stringify(shapes) + "\n");
