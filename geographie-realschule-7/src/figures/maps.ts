/**
 * Offline maps from the Natural Earth countries (src/data/countries.json,
 * see NOTICE.md). Each region is drawn in a simple equirectangular frame
 * whose longitudes are shortened by the cosine of the central latitude.
 * The frames are for orientation only: no distances are measured on them.
 */
import countries from "../data/countries.json";
import { arrow, dot, f1, label, svg } from "./draw";

type Bounds = readonly [west: number, east: number, south: number, north: number];
export type Location = readonly [lon: number, lat: number];
/** A named point: dot and label. `dx`/`dy` move the label away from the dot. */
export type Place = readonly [name: string, lon: number, lat: number, dx?: number, dy?: number];
/**
 * A label without a dot, e.g. a sea or a landscape. `surface` says where the
 * anchor must lie; a test checks it against the country polygons. Sea and
 * desert labels default to "sea" and "land".
 */
export type Surface = "land" | "sea";
export type Name = readonly [text: string, lon: number, lat: number, cls?: string, surface?: Surface, anchor?: "start" | "middle" | "end"];

export const REGIONS = {
  world: [-170, 180, -70, 80],
  africa: [-20, 55, -36, 24],
  orient: [-18, 64, 12, 45],
  islands: [70, 146, -12, 27],
  japan: [127, 147, 29, 46],
  australia: [110, 157, -45, -9],
  pacific: [90, 180, -45, 47],
} as const satisfies Record<string, Bounds>;
export type Region = keyof typeof REGIONS;

const WIDTH = 580;
const PAD = 8;

interface Frame {
  bounds: Bounds;
  height: number;
  project: (location: Location) => [number, number];
}

function frame(region: Region): Frame {
  const bounds = REGIONS[region];
  const [west, east, south, north] = bounds;
  const k = Math.cos((((south + north) / 2) * Math.PI) / 180);
  const scale = (WIDTH - 2 * PAD) / ((east - west) * k);
  const height = Math.round((north - south) * scale + 2 * PAD);
  return {
    bounds,
    height,
    project: ([lon, lat]) => [PAD + (lon - west) * k * scale, PAD + (north - lat) * scale],
  };
}

const outlineCache = new Map<string, string>();
/** Country outlines of a region; highlighted codes get the selection colour. */
function outlines(region: Region, highlight: readonly string[]): string {
  const key = `${region}|${highlight.join(",")}`;
  const cached = outlineCache.get(key);
  if (cached) return cached;
  const { bounds, project } = frame(region);
  const [west, east, south, north] = bounds;
  const paths = countries
    .map((country) => {
      const polygons = (
        country.geometry.type === "Polygon"
          ? [country.geometry.coordinates]
          : country.geometry.coordinates
      ) as number[][][][];
      // Keep polygons whose extent meets the frame; the clip path cuts the rest.
      const visible = polygons.filter(
        ([ring]) =>
          ring.some(([lon]) => lon >= west) &&
          ring.some(([lon]) => lon <= east) &&
          ring.some(([, lat]) => lat >= south) &&
          ring.some(([, lat]) => lat <= north),
      );
      if (!visible.length) return "";
      const d = visible
        .flatMap((polygon) =>
          polygon.map(
            (ring) =>
              ring
                .map(([lon, lat], i) => {
                  const [x, y] = project([lon, lat]);
                  return `${i ? "L" : "M"}${f1(x)} ${f1(y)}`;
                })
                .join("") + "Z",
          ),
        )
        .join("");
      const selected = highlight.includes(country.code);
      return `<path class="geo-country${selected ? " geo-selected" : ""}" data-country="${country.code}" d="${d}" fill-rule="evenodd"/>`;
    })
    .join("");
  outlineCache.set(key, paths);
  return paths;
}

export interface MapSpec {
  region: Region;
  /** Read by screen readers; the figure caption explains the map. */
  title: string;
  highlight?: readonly string[];
  places?: readonly Place[];
  names?: readonly Name[];
  rivers?: ReadonlyArray<readonly Location[]>;
  ridges?: ReadonlyArray<readonly Location[]>;
  /** Dashed lines such as plate boundaries or reef edges. */
  dashed?: ReadonlyArray<{ cls: string; points: readonly Location[] }>;
  /** Latitude circles: 0 equator, ±23.44 tropics, ±66.56 polar circles. */
  parallels?: readonly number[];
  /** Coloured latitude belts, drawn under the countries' outlines. */
  belts?: ReadonlyArray<{ south: number; north: number; cls: string }>;
  meridians?: readonly number[];
  arrows?: ReadonlyArray<readonly [from: Location, to: Location, cls?: string]>;
  /** Extra SVG drawn on top, built with `project`. */
  overlay?: (project: (location: Location) => [number, number]) => string;
}

/** Every spec drawn since the last reset; the tests check label positions with it. */
export const DRAWN_SPECS: MapSpec[] = [];

export function geoMap(spec: MapSpec): string {
  DRAWN_SPECS.push(spec);
  if (DRAWN_SPECS.length > 500) DRAWN_SPECS.shift();
  const { bounds, height, project } = frame(spec.region);
  const [west, east] = bounds;
  const [x0, y0] = project([west, bounds[3]]);
  const [x1, y1] = project([east, bounds[2]]);
  const id = `clip-${spec.region}`;
  const line = (points: readonly Location[]) =>
    points.map((point) => project(point).map(f1).join(",")).join(" ");
  const belts = (spec.belts ?? [])
    .map(({ south, north, cls }) => {
      const [, top] = project([west, north]);
      const [, bottom] = project([west, south]);
      return `<rect class="${cls}" x="${f1(x0)}" y="${f1(top)}" width="${f1(x1 - x0)}" height="${f1(bottom - top)}"/>`;
    })
    .join("");
  const parallels = (spec.parallels ?? [])
    .map((lat) => {
      const [, y] = project([west, lat]);
      return `<line class="${lat === 0 ? "equator" : "latitude"}" x1="${f1(x0)}" y1="${f1(y)}" x2="${f1(x1)}" y2="${f1(y)}"/>`;
    })
    .join("");
  const meridians = (spec.meridians ?? [])
    .map((lon) => {
      const [x] = project([lon, 0]);
      return `<line class="latitude" x1="${f1(x)}" y1="${f1(y0)}" x2="${f1(x)}" y2="${f1(y1)}"/>`;
    })
    .join("");
  const rivers = (spec.rivers ?? [])
    .map((points) => `<polyline class="river-line" points="${line(points)}"/>`)
    .join("");
  const ridges = (spec.ridges ?? [])
    .map((points) => `<polyline class="geo-ridge" points="${line(points)}"/>`)
    .join("");
  const dashed = (spec.dashed ?? [])
    .map(({ cls, points }) => `<polyline class="${cls}" points="${line(points)}"/>`)
    .join("");
  const arrows = (spec.arrows ?? [])
    .map(([from, to, cls]) => {
      const [ax, ay] = project(from);
      const [bx, by] = project(to);
      return arrow(ax, ay, bx, by, cls ?? "arrow");
    })
    .join("");
  const names = (spec.names ?? [])
    .map(([text, lon, lat, cls, , anchor]) => {
      const [x, y] = project([lon, lat]);
      return label(x, y, text, cls ?? "lbl geo-map-label", anchor ?? "middle");
    })
    .join("");
  const places = (spec.places ?? [])
    .map(([name, lon, lat, dx = 0, dy = -9]) => {
      const [x, y] = project([lon, lat]);
      const anchor = dx > 0 ? "start" : dx < 0 ? "end" : "middle";
      return dot(x, y) + label(x + dx, y + dy, name, "lbl small strong", anchor);
    })
    .join("");
  const north = label(WIDTH - 22, 26, "N", "lbl strong") + arrow(WIDTH - 22, 52, WIDTH - 22, 31);
  // Tall frames (e.g. the Pacific) are shown narrower so they stay on screen.
  const maxWidth = Math.round(Math.min(WIDTH * 1.35, (560 * WIDTH) / height));
  return svg(
    WIDTH,
    height,
    spec.title,
    `<defs><clipPath id="${id}"><rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(x1 - x0)}" height="${f1(y1 - y0)}"/></clipPath></defs>` +
      `<rect class="sea" x="${f1(x0)}" y="${f1(y0)}" width="${f1(x1 - x0)}" height="${f1(y1 - y0)}"/>` +
      `<g clip-path="url(#${id})">${belts}${outlines(spec.region, spec.highlight ?? [])}${meridians}${parallels}${rivers}${ridges}${dashed}${arrows}${spec.overlay ? spec.overlay(project) : ""}</g>` +
      names +
      places +
      north,
  ).replace(/max-width:\d+px/, `max-width:${maxWidth}px`);
}

/** Tropics and polar circles in degrees; the axial tilt is about 23.44°. */
export const TROPIC = 23.44;

/** Ray casting on the country polygons: is the point on land? */
export function onLand([lon, lat]: Location): boolean {
  return countries.some((country) => {
    const polygons = (country.geometry.type === "Polygon" ? [country.geometry.coordinates] : country.geometry.coordinates) as number[][][][];
    return polygons.some((polygon) => {
      let inside = false;
      for (const ring of polygon) {
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
          const [xi, yi] = ring[i], [xj, yj] = ring[j];
          if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
        }
      }
      return inside;
    });
  });
}
export const POLAR = 66.56;

// ---------- Regional base data (approximate teaching coordinates) ----------

export const AFRICA = {
  rivers: {
    Kongo: [[26.5, -10], [25.9, -5], [25.2, 0.5], [22.5, 1.8], [18.3, 0.05], [16.5, -2.5], [15.3, -4.3], [12.3, -6]],
    Niger: [[-10.7, 9.1], [-8, 12.6], [-3, 16.8], [0.1, 16.3], [2.1, 13.5], [4.7, 10.6], [6.7, 7.8], [6.1, 4.5]],
    Nil: [[33.2, 0.4], [32.4, 2.6], [31.6, 4.85], [31.4, 9.5], [32.5, 15.6], [33.6, 18.5], [31.5, 21.5], [32.9, 24.1]],
    Sambesi: [[24, -11.4], [23.1, -14], [25.86, -17.93], [27.8, -16.8], [30.5, -15.6], [33.5, -16.1], [36.3, -18.8]],
  } satisfies Record<string, Location[]>,
  ridges: {
    Ostafrikanischer_Graben: [[40.5, 11], [38.5, 7], [36.5, 2], [35.8, -2], [35, -6], [34.5, -12]],
    Drakensberge: [[31, -25.5], [29.6, -28.5], [28.4, -31]],
  } satisfies Record<string, Location[]>,
};

export const ORIENT = {
  rivers: {
    Nil: [[32.5, 15.6], [33.6, 18.5], [31.5, 21.5], [32.9, 24.1], [32.6, 25.7], [31.4, 27.5], [31.25, 30.05], [31, 31.5]],
    Euphrat: [[38.5, 39], [38.2, 36.8], [40.1, 35.3], [43.3, 33.4], [46.3, 31], [48, 30.4]],
    Tigris: [[40.5, 38.4], [43.1, 36.3], [44.4, 33.3], [46.2, 32.3], [47.4, 31], [48, 30.4]],
    Jordan: [[35.6, 33.2], [35.55, 32.2], [35.5, 31.5]],
  } satisfies Record<string, Location[]>,
  ridges: {
    Atlas: [[-9, 30.5], [-5, 32], [0, 34], [5, 35.5], [9, 35.6]],
    Zagros: [[45, 35.6], [48, 33], [52, 29.5], [56, 27.5]],
    Taurus: [[30, 37], [34, 37.2], [38, 38]],
  } satisfies Record<string, Location[]>,
};

/** Simplified plate boundaries with ocean trenches near the island arcs. */
export const TRENCHES: Record<string, Location[]> = {
  sunda: [[93, 7], [95, 3], [97.5, -1.5], [101, -5.5], [106, -9], [112, -10.3], [118, -11], [124, -10.5]],
  philippine: [[126.8, 4.5], [127, 8], [126.6, 11.5], [124.5, 14.5], [123.5, 17.5]],
  japan: [[131.5, 30.5], [134, 32.5], [137, 33.6], [141.5, 34.5], [143.5, 37], [144.5, 40], [145.5, 42.5]],
};
