import { fmt } from "../exercises/format";
import { handle, line, open, rect, text, type LabView } from "./svg";
import { rail, railHandle, title } from "./view-helpers";

export const CHART_NAMES = ["Sport", "Kunst", "Musik", "Mathe", "Deutsch"];
export const CHART_KEYS = ["a", "b", "c", "d", "e"];
const X0 = 60;
const STEP = 86;
const BASE = 275;
const UNIT = 21;

/** Tally marks in bundles of five, as SVG. */
function tally(count: number, x: number, y: number): string {
  let out = "";
  let cursor = x;
  for (let done = 0; done < count; done += 5) {
    const bundle = Math.min(5, count - done);
    for (let i = 0; i < Math.min(bundle, 4); i++)
      out += line(cursor + i * 6, y - 15, cursor + i * 6, y + 3, "lab-ink");
    if (bundle === 5)
      out += line(cursor - 3, y, cursor + 21, y - 12, "lab-ink");
    cursor += 38;
  }
  return out;
}

const chart: LabView = {
  render(v) {
    const values = CHART_KEYS.map((key) => v[key]);
    let out =
      open("Dieselben Daten als Strichliste, Säulen oder Balken") +
      title(["Strichliste", "Säulendiagramm", "Balkendiagramm"][v.type]);
    if (v.type === 0) {
      CHART_NAMES.forEach((name, i) => {
        const y = 68 + i * 48;
        out +=
          text(30, y, name, "lab-text") +
          tally(values[i], 110, y) +
          text(490, y, String(values[i]), "lab-text", "end");
      });
    } else if (v.type === 1) {
      for (let g = 0; g <= 10; g += 2) {
        const y = BASE - g * UNIT;
        out +=
          line(X0 - 8, y, 480, y, "lab-grid") +
          text(X0 - 14, y + 4, String(g), "lab-text-tick", "end");
      }
      CHART_NAMES.forEach((name, i) => {
        const x = X0 + i * STEP;
        out +=
          rect(x, BASE - values[i] * UNIT, 52, values[i] * UNIT, "lab-bar-a") +
          text(x + 26, BASE + 18, name, "lab-text-small", "middle") +
          handle(
            CHART_KEYS[i],
            x + 26,
            BASE - values[i] * UNIT,
            `${name} ziehen`,
          );
      });
    } else {
      CHART_NAMES.forEach((name, i) => {
        const y = 48 + i * 48;
        out +=
          text(84, y + 19, name, "lab-text", "end") +
          rect(92, y, values[i] * 36, 28, "lab-bar-b") +
          text(92 + values[i] * 36 + 8, y + 19, String(values[i]), "lab-text");
      });
    }
    return out + "</svg>";
  },
  handles: Object.fromEntries(
    CHART_KEYS.map((key) => [
      key,
      {
        y: key,
        drag: (p: { x: number; y: number }) => ({ [key]: (BASE - p.y) / UNIT }),
      },
    ]),
  ),
};

const fourField: LabView = {
  render(v) {
    const col = [110, 240, 370];
    const row = [70, 120, 170];
    const cell = (x: number, y: number, value: string, cls = "lab-cell") =>
      rect(x, y, 120, 44, cls) +
      text(x + 60, y + 28, value, "lab-text-big", "middle");
    return (
      open("Vierfeldertafel mit Summen") +
      title("Wie kommen die Kinder zur Schule?") +
      text(170, 60, "Bus", "lab-text", "middle") +
      text(300, 60, "Fahrrad", "lab-text", "middle") +
      text(430, 60, "Summe", "lab-text", "middle") +
      text(100, row[0] + 28, "Mädchen", "lab-text", "end") +
      text(100, row[1] + 28, "Jungen", "lab-text", "end") +
      text(100, row[2] + 28, "Summe", "lab-text", "end") +
      cell(col[0], row[0], String(v.a)) +
      cell(col[1], row[0], String(v.b)) +
      cell(col[2], row[0], String(v.a + v.b), "lab-cell-sum") +
      cell(col[0], row[1], String(v.c)) +
      cell(col[1], row[1], String(v.d)) +
      cell(col[2], row[1], String(v.c + v.d), "lab-cell-sum") +
      cell(col[0], row[2], String(v.a + v.c), "lab-cell-sum") +
      cell(col[1], row[2], String(v.b + v.d), "lab-cell-sum") +
      cell(col[2], row[2], String(v.a + v.b + v.c + v.d), "lab-fill-ok") +
      rail("a", "Mädchen mit dem Bus", v.a, 0, 20, 295) +
      "</svg>"
    );
  },
  handles: { a: railHandle("a", 0, 20) },
};

/** How much taller bar A looks than bar B when the axis starts at `start`. */
export const seemingRatio = (a: number, b: number, start: number) =>
  (a - start) / (b - start);

const truncatedAxis: LabView = {
  render(v) {
    const base = 248;
    const scale = 190 / (100 - v.start);
    const bar = (x: number, value: number, cls: string, label: string) =>
      rect(
        x,
        base - (value - v.start) * scale,
        90,
        (value - v.start) * scale,
        cls,
      ) +
      text(
        x + 45,
        base - (value - v.start) * scale - 8,
        String(value),
        "lab-text-big",
        "middle",
      ) +
      text(x + 45, base + 18, label, "lab-text-small", "middle");
    let out =
      open("Säulendiagramm mit wählbarem Achsenbeginn") +
      title(
        v.start === 0
          ? "Die Achse beginnt bei 0: ehrlich."
          : `Die Achse beginnt bei ${v.start}: Vorsicht!`,
      );
    for (let g = v.start; g <= 100; g += 10) {
      const y = base - (g - v.start) * scale;
      out +=
        line(70, y, 420, y, "lab-grid") +
        text(62, y + 4, String(g), "lab-text-tick", "end");
    }
    const looks = seemingRatio(v.a, v.b, v.start);
    return (
      out +
      bar(120, v.a, "lab-bar-a", "Produkt A") +
      bar(260, v.b, "lab-bar-b", "Produkt B") +
      text(495, 120, "wirkt", "lab-text-small", "end") +
      text(495, 140, `${fmt(looks, 1)}-mal`, "lab-text-big", "end") +
      text(495, 190, "ist", "lab-text-small", "end") +
      text(495, 210, `${fmt(v.a / v.b, 1)}-mal`, "lab-text-big", "end") +
      text(495, 230, "so groß", "lab-text-small", "end") +
      rail("start", "Achsenbeginn", v.start, 0, 45, 306) +
      "</svg>"
    );
  },
  handles: { start: railHandle("start", 0, 45) },
};

export const DATEN_VIEWS: Record<string, LabView> = {
  chart,
  "four-field": fourField,
  "truncated-axis": truncatedAxis,
};
