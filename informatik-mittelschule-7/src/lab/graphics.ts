import type { LabDefinition, LabValues } from "../model/types";
import { action, goal, panel, readout, select, slider } from "./workbench";
import { esc } from "../exercises/format";

const palette = ["#dbeee6", "#89ccbb", "#146f72", "#28335b", "#ffcc68", "#f08268"];
const sprite = [
  "00044000", "00444400", "44444444", "00444400",
  "01033010", "01333310", "11111111", "22222222",
];

function mosaic(cells: string[], name: string): string {
  return `<svg class="viz-mosaic" viewBox="0 0 ${cells[0].length * 10} ${cells.length * 10}" role="img" aria-label="${esc(name)}" shape-rendering="crispEdges">${cells.map((row, y) => [...row].map((color, x) =>
    color === "." ? "" : `<rect x="${x * 10}" y="${y * 10}" width="10" height="10" fill="${palette[Number(color)]}"/>`).join("")).join("")}</svg>`;
}

const formats = [
  { name: "PNG", use: "Verlustfrei, unterstützt Transparenz" },
  { name: "JPG", use: "Verlustbehaftet, oft klein bei Fotos" },
  { name: "GIF", use: "Bis zu 256 Farben pro Einzelbild, kann animiert sein" },
];

export const pixelLab: LabDefinition = {
  kind: "pixel-mosaik", title: "Pixel unter der Lupe",
  intro: "Vergleiche die Aufnahmen im Modell. Wähle danach ein Dateiformat für den geplanten Einsatz.",
  params: [
    select("input", "Bild erfassen", ["Kamera: Modellfoto", "Scanner: Modellskizze"]),
    select("size", "Auflösung des Modells", ["4 × 4 Pixel", "8 × 8 Pixel"]),
    select("format", "Dateiformat", formats.map((format) => format.name)),
  ],
  readouts: [
    readout("pixels", "Anzahl Pixel", (v) => v.size ? 64 : 16),
    readout("format", "Eigenschaft des Formats", (v) => formats[v.format].use),
  ],
  goals: [
    goal("details", "Stelle das Modellfoto mit 64 Pixeln dar.", (v) => v.input === 0 && v.size === 1),
    goal("scan", "Wähle PNG für die gescannte Modellskizze mit 64 Pixeln.", (v) => v.input === 1 && v.format === 0 && v.size === 1),
    goal("photo", "Wähle JPG für das Modellfoto mit 64 Pixeln.", (v) => v.input === 0 && v.format === 1 && v.size === 1),
  ],
  view: {
    render(v) {
      const source = v.input ? ["00003300", "00033000", "00330000", "03300030", "33000330", "30003300", "00033000", "00330000"] : sprite;
      const cells = v.size ? source : source.map((_, y) => [...source[y - y % 2]].map((_, x) => source[y - y % 2][x - x % 2]).join(""));
      return `<div class="viz-image-grid"><figure>${mosaic(cells, v.input ? "Pixelraster einer eingescannten Blitzskizze" : "Pixelraster eines Modellfotos mit Stern")}<figcaption>${v.size ? "8 × 8 Pixel" : "4 × 4 Pixel, zur Ansicht vergrößert"}</figcaption></figure>${panel(formats[v.format].name, formats[v.format].use, true)}</div>`;
    },
  },
};

export const editLab: LabDefinition = {
  kind: "raster-bearbeiten", title: "Drei Bearbeitungen im Vergleich",
  intro: "Vergleiche Original und Ergebnis. Untersuche, was sich bei jeder Bearbeitung am Raster ändert.",
  params: [select("tool", "Werkzeug", ["Original", "Zuschneiden", "Freistellen", "Retuschieren"])],
  readouts: [readout("effect", "Änderung", (v) => [
    "Alle Bildpunkte bleiben erhalten.", "Der äußere Rand fällt weg. Das Raster wird kleiner.",
    "Der Hintergrund wird transparent. Das Raster bleibt gleich groß.", "Ein Fleck wird durch passende Nachbarfarbe ersetzt.",
  ][v.tool])],
  goals: [
    goal("crop", "Verkleinere das Bild auf den inneren Ausschnitt.", (v) => v.tool === 1),
    goal("mask", "Mache den Hintergrund transparent.", (v) => v.tool === 2),
    goal("fix", "Entferne den störenden Fleck am Himmel.", (v) => v.tool === 3),
  ],
  view: {
    render(v) {
      const damaged = sprite.map((row, y) => y === 1 ? "50044400" : row);
      const cropped = damaged.slice(1, 7).map((row) => row.slice(1, 7));
      const cropPreview = mosaic(cropped, "Innerer Ausschnitt ohne Rand");
      const isolated = sprite.map((row) => row.replace(/[^4]/g, "."));
      const out = v.tool === 1 ? cropPreview : mosaic([damaged, damaged, isolated, sprite][v.tool],
        ["Unbearbeitetes Motiv", "Ausschnitt", "Stern vor transparentem Hintergrund", "Bild ohne Fleck"][v.tool]);
      return `<div class="viz-image-grid"><figure>${mosaic(damaged, "Original mit kleinem Fleck links oben")}<figcaption>Original · 8 × 8</figcaption></figure><figure>${out}<figcaption>Ergebnis · ${v.tool === 1 ? "6 × 6" : "8 × 8"}</figcaption></figure></div>`;
    },
  },
};

const uses = [
  { label: "Logo für Plakat und Sticker", good: 1, reason: "Die Formen bleiben in beiden Größen scharf." },
  { label: "Foto aus der Kamera", good: 0, reason: "Die vielen Helligkeits- und Farbdetails werden als Pixel gespeichert." },
  { label: "Vergrößerbarer Wegeplan", good: 1, reason: "Linien und Beschriftungen lassen sich passend zur Anzeige berechnen." },
];

export const compareLab: LabDefinition = {
  kind: "raster-vektor", title: "Zoom-Vergleich",
  intro: "Vergrößere beide Fassungen desselben Symbols. Wähle die Darstellung für unterschiedliche Einsätze.",
  params: [slider("zoom", "Zoom", 1, 4, 1, "×"), select("job", "Einsatz", uses.map((job) => job.label)),
    select("format", "Darstellung", ["Raster", "Vektor"]), { type: "state", key: "tested", value: 0, resetOnChange: true }],
  actions: [action("compare", "Auswahl prüfen", (v) => ({ ...v, tested: 1 }))],
  readouts: [readout("why", "Entscheidung", (v) => !v.tested ? "Wähle eine Darstellung und prüfe sie." :
    uses[v.job].good === v.format ? uses[v.job].reason : "Überlege, ob feste Bildpunkte oder skalierbare Formen zum Einsatz passen.")],
  goals: uses.map((job, index) => goal("einsatz-" + index, `${job.label}: zoome mindestens dreifach und prüfe die passende Wahl.`,
    (v) => v.job === index && v.zoom >= 3 && v.tested === 1 && v.format === job.good)),
  view: {
    render(v) {
      const diamond = ["00044000", "00444400", "04444440", "44444444", "44444444", "04444440", "00444400", "00044000"];
      const size = 36 + 22 * v.zoom;
      return `<div class="viz-image-grid zoom-pair">
        <figure><div class="zoom-window" style="--zoom-size:${size}px">${mosaic(diamond.map((row) => row.replace(/0/g, ".")), "Treppenförmige Kante des Pixelsymbols")}</div><figcaption>Raster · 8 × 8</figcaption></figure>
        <figure><div class="zoom-window" style="--zoom-size:${size}px"><svg viewBox="0 0 80 80" role="img" aria-label="Glatte Kante des Vektorsymbols"><path d="M40 0 L80 40 L40 80 L0 40 Z" fill="#ffcc68"/></svg></div><figcaption>Vektor · 4 Punkte</figcaption></figure></div>`;
    },
  },
};

const colors = ["#1c807e", "#f4b842", "#a17ce8"];
const colorNames = ["Türkis", "Gelb", "Violett"];

function vectorShapes(v: LabValues): string {
  return [
    v.shape === 1 && `<rect x="35" y="24" width="${v.width}" height="46" rx="2" fill="${colors[v.color]}"/>`,
    v.shape === 2 && `<circle cx="72" cy="48" r="${v.width / 2}" fill="${colors[v.color]}"/>`,
    v.line === 1 && `<line x1="26" y1="97" x2="114" y2="${97 - v.slope}" stroke="#2840a8" stroke-width="5" stroke-linecap="round"/>`,
  ].filter(Boolean).join("");
}

export const vectorLab: LabDefinition = {
  kind: "vektor-objekte", title: "Formenstudio",
  intro: "Erzeuge ein Objekt und ändere seine Attributwerte. Baue dann eine Linie mit eigenem Attribut hinzu.",
  params: [
    select("shape", "Formobjekt", ["Keines", "Rechteck", "Kreis"]),
    slider("width", "Breite oder Durchmesser", 24, 72, 40), select("color", "Füllfarbe", colorNames),
    select("line", "Linienobjekt", ["Keines", "Linie hinzufügen"]), slider("slope", "Höhe des Linienendes", 0, 22, 0),
  ],
  readouts: [
    readout("shape", "Attributwerte der Form", (v) => v.shape === 0 ? "Kein Formobjekt" : `${v.shape === 1 ? "Breite" : "Durchmesser"} ${v.width} · Füllfarbe ${colorNames[v.color]}`),
    readout("line", "Attributwert der Linie", (v) => v.line ? `Endhöhe ${v.slope}` : "Keine Linie"),
  ],
  goals: [
    goal("rectangle", "Erzeuge ein gelbes Rechteck mit Breite 60.", (v) => v.shape === 1 && v.color === 1 && v.width === 60),
    goal("circle", "Erzeuge einen violetten Kreis mit Durchmesser 48.", (v) => v.shape === 2 && v.color === 2 && v.width === 48),
    goal("line", "Füge eine Linie hinzu und stelle ihre Endhöhe auf 15.", (v) => v.line === 1 && v.slope === 15),
  ],
  view: {
    handles: {
      "line-end": { y: "slope", drag: ({ y }) => ({ slope: Math.round(97 - y) }) },
    },
    render(v) {
      const shapes = vectorShapes(v);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 112">${shapes}</svg>`;
      const marker = v.line ? `<g class="lab-handle" data-handle="line-end" tabindex="0" role="button" aria-label="Linienende verschieben (ziehen oder Pfeiltasten)"><circle cx="114" cy="${97 - v.slope}" r="10" class="lab-handle-hit"/><circle cx="114" cy="${97 - v.slope}" r="4" class="lab-handle-dot"/></g>` : "";
      return `<figure class="viz-vector"><svg viewBox="0 0 140 112" aria-label="Zeichenfläche für Formen und Linien">${shapes}${marker}</svg><figcaption>${shapes ? `<a download="meine-formen.svg" href="data:image/svg+xml,${encodeURIComponent(svg)}">Eigene Vektorgrafik speichern</a>` : "Wähle ein Form- oder Linienobjekt."}</figcaption></figure>`;
    },
  },
};
