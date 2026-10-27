import { fmt } from "../exercises/format";
import { circle, handle, line, open, polygon, rect, text } from "../lab/svg";
import type { ExerciseGenerator, LabDefinition, LabValues, Stage } from "../model/types";
import { cases, cc, choiceField, lesson, numberField, withSlips } from "./helpers";

const id = "bildbearbeitung";

// ─── Lab: Pixel und Vektor ───────────────────────────────────────────────

const ZOOMS = [1, 2, 4, 8, 16];
const USES = ["Schullogo", "Digitalfoto vom Ausflug", "eingescannte Urkunde", "Computerschrift"];
const USE_VECTOR = [true, false, false, true];

const pixelVektorLab: LabDefinition = {
  kind: "pixel-vektor-zoom",
  title: "Vergrößern: Pixel oder Vektor?",
  intro:
    "Derselbe Kreis ist einmal als Pixelgrafik (Raster aus Bildpunkten) und einmal als Vektorgrafik (geometrische Beschreibung) gespeichert. Vergrößere ihn und wähle für eine Anwendung die passende Grafikart.",
  params: [
    { key: "zoom", type: "choice", label: "Vergrößerung", options: ZOOMS.map((z, value) => ({ value, label: `${z}-fach` })), value: 0 },
    {
      key: "kind",
      type: "choice",
      label: "Grafikart",
      options: [
        { value: 0, label: "Pixelgrafik" },
        { value: 1, label: "Vektorgrafik" },
      ],
      value: 0,
    },
    { key: "use", type: "choice", label: "Anwendung", options: USES.map((label, value) => ({ value, label })), value: 0 },
  ],
  readouts: [
    {
      key: "edge",
      label: "Kante",
      emphasis: true,
      compute: (v) => (v.kind === 1 ? "glatt, wird neu berechnet" : ZOOMS[v.zoom] >= 8 ? "Treppeneffekt: einzelne Bildpunkte sichtbar" : "noch glatt"),
    },
    {
      key: "fit",
      label: "Passt zur Anwendung",
      compute: (v) => ((v.kind === 1) === USE_VECTOR[v.use] ? "✓ ja" : "nein"),
    },
  ],
  goals: [
    { id: "treppe", text: "Vergrößere die Pixelgrafik, bis einzelne Bildpunkte sichtbar werden.", check: (v) => v.kind === 0 && ZOOMS[v.zoom] >= 8 },
    { id: "scharf", text: "Vergrößere die Vektorgrafik 16-fach: Sie bleibt scharf.", check: (v) => v.kind === 1 && ZOOMS[v.zoom] === 16 },
    {
      id: "passend",
      text: "Stelle für die eingescannte Urkunde die passende Grafikart ein.",
      check: (v) => v.use === 2 && v.kind === 0,
    },
  ],
  witnesses: {
    treppe: { zoom: 3, kind: 0, use: 0 },
    scharf: { zoom: 4, kind: 1, use: 2 },
    passend: { zoom: 0, kind: 0, use: 2 },
  },
  view: {
    render(v) {
      const zoom = ZOOMS[v.zoom];
      let out = open("Vergrößerter Kreis");
      out += rect(110, 20, 300, 300, "lab-panel", 'rx="8"');
      const radius = 9 * zoom;
      const cx = 260;
      const cy = 170;
      if (v.kind === 1) {
        out += `<clipPath id="pv-clip"><rect x="110" y="20" width="300" height="300" /></clipPath><g clip-path="url(#pv-clip)">${circle(cx, cy, radius, "lab-fill-a")}</g>`;
      } else {
        const cells = 18;
        const size = zoom;
        for (let gy = 0; gy < cells; gy++) {
          for (let gx = 0; gx < cells; gx++) {
            const dx = gx - cells / 2 + 0.5;
            const dy = gy - cells / 2 + 0.5;
            if (dx * dx + dy * dy > 81) continue;
            const x = cx + dx * size - size / 2;
            const y = cy + dy * size - size / 2;
            if (x < 110 || y < 20 || x + size > 410 || y + size > 320) continue;
            out += rect(x, y, size, size, "lab-fill-a");
          }
        }
      }
      out += text(260, 336, `${v.kind === 1 ? "Vektorgrafik" : "Pixelgrafik"} · ${zoom}-fach`, "lab-text-small", "middle");
      return `${out}</svg>`;
    },
  },
};

const pixelZahl: ExerciseGenerator = {
  id: "pixel-zaehlen",
  make(rng, level) {
    const w = rng.pick([640, 800, 1200, 1920, 4000]);
    const h = w === 1920 ? 1080 : w === 4000 ? 3000 : (w * 3) / 4;
    if (level === 1) {
      return {
        prompt: `Ein Digitalfoto hat ${fmt(w, 0)} × ${fmt(h, 0)} Pixel. Aus wie vielen Bildpunkten besteht es?`,
        given: [`Breite ${fmt(w, 0)} Pixel`, `Höhe ${fmt(h, 0)} Pixel`],
        formulaHint: "Pixelanzahl = Breite · Höhe",
        fields: [withSlips(numberField("Pixel =", w * h), [w + h, "Die Bildpunkte bilden ein Rechteck: multiplizieren, nicht addieren."])],
        steps: [`${fmt(w, 0)} · ${fmt(h, 0)}`, `= ${fmt(w * h, 0)}`, `<strong>${fmt(w * h, 0)} Pixel</strong>`],
      };
    }
    const factor = rng.pick([2, 3]);
    return {
      prompt: `Ein Bild mit ${fmt(w, 0)} × ${fmt(h, 0)} Pixel wird in einem Bildprogramm auf die ${factor}-fache Breite und Höhe hochgerechnet. Wie viele Pixel hat es danach, und warum wird es dadurch nicht schärfer?`,
      given: [`${fmt(w, 0)} × ${fmt(h, 0)} Pixel`, `Faktor ${factor} in Breite und Höhe`],
      fields: [
        withSlips(numberField("Pixel =", w * h * factor * factor), [w * h * factor, `Breite und Höhe wachsen beide: Faktor ${factor} · ${factor}.`]),
        choiceField(rng, "Schärfe", "Neue Pixel werden nur aus den alten errechnet; Details kommen nicht hinzu.", [
          "Das Programm erfindet die fehlenden Details exakt.",
          "Mehr Pixel bedeuten immer ein schärferes Bild.",
        ]),
      ],
      steps: [`${fmt(w * factor, 0)} · ${fmt(h * factor, 0)}`, `= ${fmt(w * h * factor * factor, 0)} Pixel`, "<strong>Die neuen Pixel sind aus den alten berechnet; das Bild wird größer, aber nicht detailreicher.</strong>"],
    };
  },
};

// ─── Lab: Bildgröße ──────────────────────────────────────────────────────

const DEPTHS = [1, 8, 24];
const bytesOf = (v: LabValues) => (v.w * v.h * DEPTHS[v.depth]) / 8;

const groesseLab: LabDefinition = {
  kind: "bildgroesse",
  title: "Auflösung, Farbtiefe und Dateigröße",
  intro:
    "Stelle Breite, Höhe und Farbtiefe eines Bildes ein. Die unkomprimierte Dateigröße ist Pixelanzahl mal Bit pro Pixel.",
  params: [
    { key: "w", type: "range", label: "Breite", unit: "Pixel", min: 100, max: 4000, step: 100, value: 800 },
    { key: "h", type: "range", label: "Höhe", unit: "Pixel", min: 100, max: 3000, step: 100, value: 600 },
    {
      key: "depth",
      type: "choice",
      label: "Farbtiefe",
      options: [
        { value: 0, label: "1 Bit (schwarz-weiß)" },
        { value: 1, label: "8 Bit (256 Farben)" },
        { value: 2, label: "24 Bit (True Color, RGB)" },
      ],
      value: 1,
    },
  ],
  readouts: [
    { key: "pixel", label: "Pixel", digits: 0, compute: (v) => v.w * v.h },
    { key: "colors", label: "Farben", digits: 0, compute: (v) => 2 ** DEPTHS[v.depth] },
    { key: "bytes", label: "unkomprimiert", unit: "Byte", digits: 0, compute: bytesOf },
    { key: "mb", label: "unkomprimiert", unit: "MB", digits: 2, emphasis: true, compute: (v) => bytesOf(v) / 1_000_000 },
  ],
  goals: [
    { id: "megapixel", text: "Erzeuge ein Bild mit genau 1 000 000 Pixeln (1 Megapixel).", check: (v) => v.w * v.h === 1_000_000 },
    { id: "dreiMB", text: "Erzeuge ein True-Color-Bild, das unkomprimiert genau 3 MB belegt.", check: (v) => v.depth === 2 && bytesOf(v) === 3_000_000 },
    { id: "sw", text: "Erzeuge ein Schwarz-Weiß-Bild mit 1 000 × 800 Pixeln und lies seine Größe ab.", check: (v) => v.depth === 0 && v.w === 1000 && v.h === 800 },
  ],
  witnesses: {
    megapixel: { w: 1000, h: 1000, depth: 1 },
    dreiMB: { w: 1000, h: 1000, depth: 2 },
    sw: { w: 1000, h: 800, depth: 0 },
  },
  view: {
    render(v) {
      const scale = Math.min(380 / v.w, 220 / v.h);
      let out = open("Bildfläche");
      const bw = v.w * scale;
      const bh = v.h * scale;
      out += rect(260 - bw / 2, 20, bw, bh, v.depth === 0 ? "lab-shape" : v.depth === 1 ? "lab-fill-c" : "lab-fill-a", 'rx="4"');
      out += text(260, 20 + bh / 2 + 5, `${fmt(v.w, 0)} × ${fmt(v.h, 0)} Pixel`, "lab-text", "middle");
      out += text(260, 270, `${fmt(v.w * v.h, 0)} Pixel · ${DEPTHS[v.depth]} Bit = ${fmt(bytesOf(v), 0)} Byte`, "lab-text", "middle");
      out += text(260, 300, `≈ ${fmt(bytesOf(v) / 1_000_000, 2)} MB unkomprimiert`, "lab-text-big", "middle");
      out += handle("corner", 260 + bw / 2, 20 + bh, "Bildecke: Breite und Höhe");
      return `${out}</svg>`;
    },
    handles: {
      corner: {
        x: "w",
        y: "h",
        drag: (p, v) => {
          const scale = Math.min(380 / v.w, 220 / v.h);
          return { w: Math.round(((p.x - 260) * 2) / scale / 100) * 100, h: Math.round((p.y - 20) / scale / 100) * 100 };
        },
      },
    },
  },
};

const dateigroesse: ExerciseGenerator = {
  id: "bild-dateigroesse",
  make(rng, level) {
    if (level === 1) {
      const w = rng.pick([100, 200, 400, 500]);
      const h = rng.pick([100, 200, 300]);
      const depth = rng.pick([8, 24]);
      const bytes = (w * h * depth) / 8;
      return {
        prompt: `Ein Bild hat ${w} × ${h} Pixel und eine Farbtiefe von ${depth} Bit. Wie viele Byte belegt es unkomprimiert?`,
        given: [`${w} × ${h} Pixel`, `${depth} Bit pro Pixel`],
        formulaHint: "Dateigröße in Byte = Breite · Höhe · Farbtiefe in Bit ÷ 8",
        fields: [withSlips(numberField("Größe =", bytes, "Byte"), [w * h * depth, "Das sind Bit. Teile durch 8 für Byte."], [w * h, "Die Farbtiefe fehlt noch."])],
        steps: [`${w} · ${h} = ${fmt(w * h, 0)} Pixel`, `${fmt(w * h, 0)} · ${depth} Bit ÷ 8`, `<strong>${fmt(bytes, 0)} Byte</strong>`],
      };
    }
    const [w, h] = rng.pick([
      [4000, 3000],
      [3000, 2000],
      [1920, 1080],
      [2000, 1500],
    ]);
    const mb = (w * h * 3) / 1_000_000;
    return {
      prompt: `Eine Kamera speichert Fotos mit ${fmt(w, 0)} × ${fmt(h, 0)} Pixeln in True Color (24 Bit). Wie viele Megabyte (1 MB = 1 000 000 Byte) wären das unkomprimiert?`,
      given: [`${fmt(w, 0)} × ${fmt(h, 0)} Pixel`, "24 Bit = 3 Byte pro Pixel"],
      fields: [withSlips(numberField("Größe =", mb, "MB", 2), [mb * 8, "24 Bit sind 3 Byte, nicht 24 Byte."], [mb / 3, "Jeder Pixel braucht 3 Byte (Rot, Grün, Blau)."])],
      steps: [`${fmt(w * h, 0)} Pixel · 3 Byte = ${fmt(w * h * 3, 0)} Byte`, `÷ 1 000 000`, `<strong>${fmt(mb, 2)} MB</strong>`],
    };
  },
};

// ─── Lab: Vektorobjekte bearbeiten ───────────────────────────────────────

const COLORS = ["grau", "rot", "blau"];

const bearbeitenLab: LabDefinition = {
  kind: "vektor-bearbeiten",
  title: "Ein Vektorhaus bearbeiten",
  intro:
    "Das Haus besteht aus zwei Vektorobjekten: Wand (Rechteck) und Dach (Dreieck). Ausgewählt ist das Dach. Färbe, gruppiere, skaliere und drehe.",
  params: [
    { key: "color", type: "choice", label: "Füllfarbe des Dachs", options: COLORS.map((label, value) => ({ value, label })), value: 0 },
    {
      key: "group",
      type: "choice",
      label: "Gruppierung",
      options: [
        { value: 0, label: "nicht gruppiert (nur Dach ausgewählt)" },
        { value: 1, label: "Wand und Dach gruppiert" },
      ],
      value: 0,
    },
    { key: "scale", type: "range", label: "Skalieren", unit: "%", min: 50, max: 200, step: 25, value: 100 },
    { key: "rot", type: "range", label: "Drehen", unit: "°", min: 0, max: 180, step: 15, value: 0 },
  ],
  readouts: [
    {
      key: "state",
      label: "Ergebnis",
      emphasis: true,
      compute: (v) =>
        v.group === 0 && (v.scale !== 100 || v.rot !== 0)
          ? "Nur das Dach verändert sich: Das Haus fällt auseinander."
          : v.scale !== 100 || v.rot !== 0
            ? "✓ Das ganze Haus verändert sich gemeinsam."
            : "unverändert",
    },
  ],
  goals: [
    { id: "rot", text: "Färbe das Dach rot.", check: (v) => v.color === 1 },
    { id: "gross", text: "Vergrößere das ganze Haus auf 150 %, ohne dass es auseinanderfällt.", check: (v) => v.group === 1 && v.scale === 150 },
    { id: "drehen", text: "Drehe das ganze Haus um 90°.", check: (v) => v.group === 1 && v.rot === 90 },
  ],
  view: {
    render(v) {
      const s = v.scale / 100;
      const cx = 260;
      const cy = 190;
      const tf = (scaled: boolean) => (scaled ? `transform="rotate(${v.rot} ${cx} ${cy}) translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})"` : "");
      let out = open("Vektorhaus aus Wand und Dach");
      out += `<g ${tf(v.group === 1)}>${rect(210, 170, 100, 80, "lab-shape")}${rect(248, 210, 24, 40, "lab-fill-c")}</g>`;
      const fill = ["lab-shape", "lab-fill-b", "lab-fill-a"][v.color];
      out += `<g ${tf(true)}>${polygon(
        [
          { x: 200, y: 172 },
          { x: 260, y: 120 },
          { x: 320, y: 172 },
        ],
        fill,
      )}</g>`;
      out += text(260, 326, `Dach ${COLORS[v.color]} · ${v.scale} % · ${v.rot}° · ${v.group === 1 ? "gruppiert" : "einzeln"}`, "lab-text-small", "middle");
      return `${out}</svg>`;
    },
  },
};

const zuschneiden: ExerciseGenerator = {
  id: "zuschneiden",
  make(rng, level) {
    const [w, h] = rng.pick([
      [4000, 3000],
      [3000, 2000],
      [2400, 1800],
    ]);
    if (level === 1) {
      const cw = w / 2;
      const ch = h / 2;
      return {
        prompt: `Du schneidest ein Foto mit ${fmt(w, 0)} × ${fmt(h, 0)} Pixeln auf den mittleren Ausschnitt mit ${fmt(cw, 0)} × ${fmt(ch, 0)} Pixeln zu. Wie viele Pixel bleiben übrig?`,
        given: [`vorher ${fmt(w, 0)} × ${fmt(h, 0)}`, `nachher ${fmt(cw, 0)} × ${fmt(ch, 0)}`],
        formulaHint: "Pixel nach dem Zuschneiden = neue Breite · neue Höhe",
        fields: [withSlips(numberField("Pixel =", cw * ch), [(w * h) / 2, "Breite und Höhe halbieren sich beide: Es bleibt ein Viertel."])],
        steps: [`${fmt(cw, 0)} · ${fmt(ch, 0)}`, `= ${fmt(cw * ch, 0)}`, `<strong>${fmt(cw * ch, 0)} Pixel</strong>`],
      };
    }
    const side = Math.min(w, h);
    return {
      prompt: `Für ein quadratisches Profilbild schneidest du ein Foto mit ${fmt(w, 0)} × ${fmt(h, 0)} Pixeln so groß wie möglich quadratisch zu. Wie viele Pixel hat das Profilbild?`,
      given: [`Foto ${fmt(w, 0)} × ${fmt(h, 0)} Pixel`, "Ausschnitt quadratisch, so groß wie möglich"],
      fields: [withSlips(numberField("Pixel =", side * side), [w * w, "Das Quadrat kann nicht breiter sein als die kürzere Seite hoch ist."], [w * h, "Beim Zuschneiden fallen Pixel weg."])],
      steps: [`Größtes Quadrat: Seite = kürzere Seite = ${fmt(side, 0)} Pixel`, `${fmt(side, 0)} · ${fmt(side, 0)}`, `<strong>${fmt(side * side, 0)} Pixel</strong>`],
    };
  },
};

// ─── Lab: Diagramm-Manipulation ──────────────────────────────────────────

const A = 48;
const B = 52;
const visualRatio = (v: LabValues) => (B - v.start) / (A - v.start);

const manipulationLab: LabDefinition = {
  kind: "diagramm-manipulation",
  title: "Ein Säulendiagramm manipulieren",
  intro:
    "Bei einer Umfrage stimmten 48 % für Vorschlag A und 52 % für Vorschlag B. Verschiebe den Startwert der y-Achse und beobachte, wie stark der Unterschied wirkt.",
  params: [
    { key: "start", type: "range", label: "y-Achse beginnt bei", unit: "%", min: 0, max: 45, step: 5, value: 40 },
    {
      key: "mark",
      type: "choice",
      label: "Achsenbruch",
      options: [
        { value: 0, label: "nicht gekennzeichnet" },
        { value: 1, label: "deutlich gekennzeichnet (≈)" },
      ],
      value: 0,
    },
  ],
  readouts: [
    { key: "real", label: "tatsächliches Verhältnis B : A", digits: 2, compute: () => B / A },
    { key: "seen", label: "sichtbares Verhältnis der Säulen", digits: 2, emphasis: true, compute: visualRatio },
  ],
  goals: [
    { id: "fair", text: "Zeichne das Diagramm fair: Die Säulen geben das echte Verhältnis wieder.", check: (v) => v.start === 0 },
    { id: "doppelt", text: "Lass B mindestens doppelt so groß wirken wie A.", check: (v) => visualRatio(v) >= 2 },
    { id: "ehrlich", text: "Beginne die Achse nicht bei 0, aber kennzeichne den Achsenbruch deutlich.", check: (v) => v.start > 0 && v.mark === 1 },
  ],
  view: {
    render(v) {
      const base = 290;
      const scale = 240 / (55 - v.start);
      const hA = (A - v.start) * scale;
      const hB = (B - v.start) * scale;
      let out = open("Säulendiagramm der Umfrage");
      out += line(80, base, 460, base, "lab-axis");
      out += line(80, base, 80, 30, "lab-axis");
      for (let t = v.start; t <= 55; t += 5) {
        const y = base - (t - v.start) * scale;
        out += line(76, y, 84, y, "lab-axis");
        out += text(70, y + 4, `${t} %`, "lab-text-tick", "end");
      }
      if (v.mark === 1 && v.start > 0) out += text(80, base - 6, "≈", "lab-text-big", "middle");
      out += rect(150, base - hA, 90, hA, "lab-fill-a");
      out += rect(300, base - hB, 90, hB, "lab-fill-b");
      out += text(195, base + 18, "A: 48 %", "lab-text", "middle");
      out += text(345, base + 18, "B: 52 %", "lab-text", "middle");
      out += text(270, 24, `sichtbar ${fmt(visualRatio(v), 2)}-fach, tatsächlich ${fmt(B / A, 2)}-fach`, "lab-text-small", "middle");
      out += handle("start", 80, base, "Startwert der y-Achse");
      return `${out}</svg>`;
    },
    handles: {
      start: { y: "start", drag: (p) => ({ start: Math.round((290 - p.y) / 5 / 5) * 5 }) },
    },
  },
};

const saeulenTask: ExerciseGenerator = {
  id: "saeulen-wirkung",
  make(rng, level) {
    const a = rng.pick([40, 45, 48, 60]);
    const b = a + rng.pick([2, 4, 5]);
    const start = a - rng.pick([2, 4, 5]);
    const seen = (b - start) / (a - start);
    if (level === 1) {
      return {
        prompt: `Ein Diagramm zeigt A = ${a} und B = ${b}. Die y-Achse beginnt bei ${start}. Wie viel Mal so hoch wirkt die Säule B wie die Säule A?`,
        given: [`A = ${a}, B = ${b}`, `Achse beginnt bei ${start}`],
        formulaHint: "sichtbare Höhe = Wert − Achsenstart; Verhältnis = Höhe B ÷ Höhe A",
        fields: [withSlips(numberField("B wirkt so viel Mal so hoch:", seen, "", 2), [b / a, "Das ist das echte Verhältnis. Sichtbar ist nur der Teil über dem Achsenstart."])],
        steps: [`Höhe A = ${a} − ${start} = ${a - start}; Höhe B = ${b} − ${start} = ${b - start}`, `${b - start} ÷ ${a - start}`, `<strong>≈ ${fmt(seen, 2)}-mal so hoch</strong>`],
      };
    }
    return {
      prompt: `Eine Werbung zeigt: „Unser Saft: ${b} % Fruchtgehalt, Konkurrenz: ${a} %“. Die Säulen beginnen bei ${start} %. Wie viel Mal so hoch wirkt die eigene Säule, wie viel Mal so groß ist der Wert wirklich?`,
      given: [`eigener Saft ${b} %, Konkurrenz ${a} %`, `Achse ab ${start} %`],
      fields: [
        withSlips(numberField("sichtbarer Faktor =", seen, "", 2), [b / a, "Das ist das echte Verhältnis, gefragt ist zuerst das sichtbare."]),
        withSlips(numberField("tatsächlicher Faktor =", b / a, "", 2), [seen, "Das ist das sichtbare Verhältnis. Teile die echten Werte."]),
      ],
      steps: [`sichtbar: (${b} − ${start}) ÷ (${a} − ${start}) = ${fmt(seen, 2)}`, `tatsächlich: ${b} ÷ ${a} = ${fmt(b / a, 2)}`, `<strong>sichtbar ${fmt(seen, 2)}-fach, tatsächlich nur ${fmt(b / a, 2)}-fach</strong>`],
    };
  },
};

export const STAGE_BILDBEARBEITUNG: Stage = {
  id,
  stageNumber: 5,
  title: "Einführung in die Bildbearbeitung",
  subtitle: "Pixel- und Vektorgrafik, Auflösung und Farbtiefe, Bearbeiten und Manipulation erkennen",
  icon: "🎨",
  accent: "#db2777",
  badgeTitle: "Bildprofi",
  lehrplanLabel: "IT 1.5 · ca. 14 Std.",
  module: "1.5",
  lessons: [
    lesson(id, "1.5", 1, {
      id: "it8-pixel-vektor",
      title: "Pixelgrafik und Vektorgrafik",
      subtitle: "Aufbau, Merkmale und passende Anwendungsgebiete",
      why: "Ein Logo, das auf einem Plakat verschwimmt, oder ein Foto, das sich nicht bearbeiten lässt: Wer Pixel und Vektor unterscheidet, wählt die richtige Grafikart.",
      html: `<p>Eine <strong>Pixelgrafik</strong> (Rastergrafik) besteht aus vielen gefärbten <strong>Bildpunkten (Pixeln)</strong> mit festen Positionen in einem Raster. Sie eignet sich für Bilder mit feinen Farbverläufen: <strong>Digitalfotos, Scans</strong>. Vergrößert man sie stark, werden die Pixel sichtbar und Kanten wirken treppig (<strong>Treppeneffekt</strong>).</p>
<p>Eine <strong>Vektorgrafik</strong> beschreibt <strong>geometrische Formen</strong> wie Linien, Kreise und Kurven mit Eigenschaften (Position, Größe, Füllfarbe). Beim Vergrößern wird sie neu berechnet und bleibt <strong>verlustfrei scharf</strong>. Sie eignet sich für klare Formen: <strong>Computerschriften, Logos, Vektorkarten, technische Zeichnungen</strong>. Für Fotos ist sie ungeeignet, weil Millionen Farbpunkte keine einfachen Formen bilden.</p>
<div class="example"><strong>Beispiel:</strong> Das Schullogo soll auf T-Shirts, Briefköpfe und ein 3-m-Banner. Als Vektorgrafik (z. B. SVG) bleibt es überall scharf. Das Klassenfoto vom Ausflug ist dagegen eine Pixelgrafik (z. B. JPEG).</div>
<div class="merke"><strong>Merke:</strong> Pixelgrafik = Raster aus Bildpunkten, ideal für Fotos, verpixelt beim Vergrößern. Vektorgrafik = geometrische Formen, ideal für Logos und Schriften, beliebig skalierbar.</div>`,
      rule: "Pixel: Fotos, Scans · treppig beim Vergrößern. Vektor: Logos, Schriften, Pläne · verlustfrei skalierbar",
      terms: [
        ["Pixelgrafik", "Raster aus gefärbten Bildpunkten mit festen Positionen", "z. B. JPEG, PNG; Digitalfotos, Scans"],
        ["Vektorgrafik", "geometrisch beschriebene Formen mit Attributen", "z. B. SVG; Logos, Schriften, Vektorkarten"],
      ],
      quiz: [
        "Welchen Vorteil hat eine Vektorgrafik gegenüber einer Pixelgrafik beim Vergrößern?",
        "Sie bleibt ohne Treppeneffekt scharf.",
        "Sie zeigt Fotos detailreicher.",
        "Sie braucht beim Vergrößern immer mehr Speicher.",
        "Vektorformen werden für jede Größe neu berechnet; Pixel werden nur größer und damit sichtbar.",
      ],
      lab: pixelVektorLab,
      exercises: [
        cases(
          "grafikart-waehlen",
          [
            cc("Welche Grafikart entsteht beim Fotografieren mit dem Handy?", "Pixelgrafik", ["Vektorgrafik", "Tabellengrafik"], "Der Kamerasensor misst Farbwerte für jeden Bildpunkt.", "Die Kamera misst Bildpunkte."),
            cc("In welcher Grafikart sind Computerschriften gespeichert?", "Vektorgrafik", ["Pixelgrafik", "Scan"], "Schriften bestehen aus Kurven, damit sie in jeder Größe scharf sind.", "Schriften gibt es in jeder Größe."),
            cc("Woraus besteht eine Pixelgrafik?", "Aus gefärbten Bildpunkten in einem Raster.", ["Aus Linien und Kurven mit Formeln.", "Aus Buchstaben und Absätzen."], "Jeder Pixel hat eine feste Position und eine Farbe.", "Pixel = Bildpunkt."),
          ],
          [
            cc(
              "Ein Verein lässt sein Logo auf Visitenkarten und auf ein 5 m breites Banner drucken. Welche Datei schickst du an die Druckerei?",
              "Das Logo als Vektorgrafik (z. B. SVG).",
              ["Ein kleines JPEG-Foto des Logos.", "Einen Screenshot des Logos."],
              "Nur die Vektorgrafik wird für jede Druckgröße scharf neu berechnet.",
              "Welche Grafikart lässt sich beliebig vergrößern?",
            ),
            cc(
              "Warum speichert man ein Urlaubsfoto nicht als Vektorgrafik?",
              "Fotos haben unzählige feine Farbverläufe, die sich nicht sinnvoll als einfache Formen beschreiben lassen.",
              ["Weil Vektorgrafiken keine Farben haben.", "Weil Vektorgrafiken nicht gespeichert werden können."],
              "Vektorgrafiken eignen sich für klare Formen; Fotos brauchen das Pixelraster.",
              "Welche Formen enthält ein Foto?",
            ),
            cc(
              "Eine Wanderkarte in einer App bleibt beim Hineinzoomen scharf, Straßennamen werden neu gezeichnet. Was ist sie wahrscheinlich?",
              "Eine Vektorkarte",
              ["Ein eingescanntes Papierfoto", "Eine Pixelgrafik mit niedriger Auflösung"],
              "Vektorkarten speichern Straßen und Flächen als Formen und berechnen sie beim Zoomen neu.",
              "Was passiert beim Zoomen?",
            ),
          ],
        ),
        pixelZahl,
      ],
    }),
    lesson(id, "1.5", 2, {
      id: "it8-bildgroesse-formate",
      title: "Auflösung, Farbtiefe, Farbmodell und Dateiformate",
      subtitle: "Digitale Bilder mit den wichtigen Einheiten erstellen und passend speichern",
      why: "Ob ein Bild in eine E-Mail passt oder auf einem Plakat gut aussieht, hängt von Auflösung, Farbtiefe und Format ab.",
      html: `<p>Die <strong>Auflösung</strong> eines Pixelbildes ist seine Größe in Pixeln, z. B. 4 000 × 3 000 (12 Megapixel). Für den Druck zählt auch, wie viele Pixel auf einen Zoll kommen (ppi bzw. dpi; für Fotodrucke etwa 300). Die <strong>Farbtiefe</strong> gibt an, wie viele Bit ein Pixel hat: 1 Bit = 2 Farben (schwarz-weiß), 8 Bit = 256 Farben, 24 Bit = rund 16,7 Millionen Farben (True Color).</p>
<p>Im <strong>Farbmodell RGB</strong> (Bildschirm) mischt jeder Pixel Rot, Grün und Blau mit je 8 Bit (0 bis 255). Die Mischung ist <strong>additiv</strong>: (255, 255, 255) ergibt Weiß, (0, 0, 0) Schwarz. Drucker arbeiten mit <strong>CMYK</strong> (Cyan, Magenta, Gelb, Schwarz). Die unkomprimierte <strong>Dateigröße</strong> = Breite · Höhe · Farbtiefe ÷ 8 Byte. <strong>Dateiformate</strong>: <strong>JPEG</strong> komprimiert verlustbehaftet, gut für Fotos; <strong>PNG</strong> komprimiert verlustfrei und kann Transparenz, gut für Grafiken und Screenshots; <strong>GIF</strong> hat höchstens 256 Farben; <strong>SVG</strong> speichert Vektorgrafiken.</p>
<div class="example"><strong>Beispiel:</strong> Ein Foto mit 2 000 × 1 500 Pixeln in 24 Bit belegt unkomprimiert 2 000 · 1 500 · 3 Byte = 9 000 000 Byte = 9 MB. Als JPEG gespeichert sind es oft weniger als 1 MB, mit kaum sichtbarem Qualitätsverlust.</div>
<div class="merke"><strong>Merke:</strong> Größe in Byte = Breite · Höhe · Bit pro Pixel ÷ 8. RGB additiv: alle Farben voll = Weiß. JPEG für Fotos, PNG für Grafiken mit Transparenz, SVG für Vektoren.</div>`,
      rule: "Dateigröße (Byte) = Breite · Höhe · Farbtiefe (Bit) ÷ 8; 24 Bit = 3 Byte = RGB",
      terms: [
        ["Farbtiefe", "1 Bit: 2 Farben · 8 Bit: 256 Farben · 24 Bit: ≈ 16,7 Mio. Farben", "Farben = 2^Farbtiefe"],
        ["Dateiformate", "JPEG (verlustbehaftet, Fotos) · PNG (verlustfrei, Transparenz) · GIF (256 Farben) · SVG (Vektor)", "Format nach Verwendung wählen"],
      ],
      quiz: [
        "Welche Farbe zeigt ein Bildschirmpixel mit den RGB-Werten (255, 255, 255)?",
        "Weiß",
        "Schwarz",
        "Braun",
        "RGB mischt Licht additiv: Alle drei Farben mit voller Stärke ergeben Weiß.",
      ],
      lab: groesseLab,
      exercises: [
        dateigroesse,
        cases(
          "format-farbe",
          [
            cc("Welches Format passt für ein Logo mit durchsichtigem Hintergrund auf einer Webseite?", "PNG", ["JPEG", "TXT"], "PNG speichert verlustfrei und unterstützt Transparenz.", "Welches Format kennt Transparenz?"),
            cc("Wie viele Farben kann ein Pixel mit 8 Bit Farbtiefe haben?", "256", ["8", "16"], "2⁸ = 256.", "Farben = 2 hoch Farbtiefe."),
            cc("Welche Farbe ergibt RGB (255, 0, 0)?", "Rot", ["Grün", "Weiß"], "Nur der Rotanteil leuchtet voll.", "Reihenfolge R, G, B."),
          ],
          [
            cc(
              "Du willst 30 Urlaubsfotos per E-Mail schicken. Welches Format ist sinnvoll?",
              "JPEG, weil es Fotos stark verkleinert und kaum sichtbar an Qualität verliert.",
              ["BMP, weil es unkomprimiert die beste Qualität hat.", "SVG, weil Vektoren klein sind."],
              "JPEG komprimiert Fotos verlustbehaftet und spart viel Platz.",
              "Welches Format ist für Fotos gemacht?",
            ),
            cc(
              "Ein Screenshot mit Text sieht als JPEG an den Buchstaben unscharf aus. Was ist besser?",
              "Als PNG speichern, weil es verlustfrei komprimiert.",
              ["Als JPEG mit noch stärkerer Kompression speichern.", "Die Farbtiefe auf 1 Bit senken."],
              "JPEG-Kompression erzeugt an scharfen Kanten Artefakte; PNG speichert verlustfrei.",
              "Verlustbehaftet oder verlustfrei?",
            ),
            cc(
              "Welche Farbe ergibt im RGB-Modell (255, 255, 0)?",
              "Gelb",
              ["Weiß", "Violett"],
              "Rotes und grünes Licht mischen sich additiv zu Gelb.",
              "Rot + Grün, ohne Blau.",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.5", 3, {
      id: "it8-bildbearbeitung",
      title: "Methoden der Bildbearbeitung",
      subtitle: "Pixel zuschneiden, drehen, freistellen, färben; Vektoren färben, gruppieren, skalieren, rendern",
      why: "Ein gutes Foto wird erst durch Zuschneiden richtig stark, ein Plakat entsteht aus gruppierten Formen. Mit den Grundmethoden setzt du deine Ideen um.",
      html: `<p>Bei <strong>Pixelgrafiken</strong> wirken die Methoden auf Bildpunkte: <strong>Zuschneiden</strong> entfernt Ränder und damit Pixel; <strong>Drehen</strong> richtet ein schiefes Foto gerade; <strong>Freistellen</strong> löst ein Motiv vom Hintergrund (z. B. mit Auswahlwerkzeugen), der Hintergrund wird transparent; <strong>Färben</strong> ändert Farben in einem Bereich.</p>
<p>Bei <strong>Vektorgrafiken</strong> verändert man die Attribute von Objekten: <strong>Färben</strong> ändert die Füll- oder Linienfarbe; <strong>Gruppieren</strong> fasst mehrere Objekte zusammen, damit sie gemeinsam verschoben, gedreht oder <strong>skaliert</strong> werden; Skalieren ändert die Größe ohne Qualitätsverlust. <strong>Rendern</strong> berechnet aus der Vektorbeschreibung ein Pixelbild, etwa zum Export als PNG.</p>
<div class="example"><strong>Beispiel:</strong> Ein Haus aus Wand und Dach soll größer werden. Ohne Gruppieren wächst nur das ausgewählte Dach, und das Haus fällt auseinander. Nach dem Gruppieren werden beide gemeinsam auf 150 % skaliert.</div>
<div class="merke"><strong>Merke:</strong> Pixel: zuschneiden, drehen, freistellen, färben. Vektor: färben, gruppieren, skalieren, rendern. Gruppieren vor dem gemeinsamen Verändern.</div>`,
      rule: "Zuschneiden entfernt Pixel; Gruppieren vor gemeinsamem Skalieren/Drehen; Rendern = Vektor → Pixelbild",
      terms: [
        ["Freistellen", "Motiv vom Hintergrund lösen", "Hintergrund wird transparent, z. B. für PNG"],
        ["Gruppieren · Rendern", "Objekte zusammenfassen · aus Vektoren ein Pixelbild berechnen", "gruppiert lassen sich Objekte gemeinsam bearbeiten"],
      ],
      quiz: [
        "Du willst eine Person aus einem Foto ohne Hintergrund auf ein Plakat setzen. Welche Methode brauchst du?",
        "Freistellen",
        "Rendern",
        "Gruppieren",
        "Beim Freistellen wird das Motiv vom Hintergrund gelöst; Rendern und Gruppieren sind Vektormethoden.",
      ],
      lab: bearbeitenLab,
      exercises: [
        cases(
          "methode-waehlen",
          [
            cc("Auf deinem Foto ist am Rand ein fremder Arm zu sehen. Welche Methode entfernt ihn am einfachsten?", "Zuschneiden", ["Gruppieren", "Rendern"], "Zuschneiden entfernt den Bildrand mitsamt seinen Pixeln.", "Der Arm ist am Rand."),
            cc("Ein Foto vom Horizont ist schief. Was tust du?", "Drehen", ["Freistellen", "Färben"], "Drehen richtet die Horizontlinie gerade aus.", "Was ist schief?"),
            cc("Du willst Kreis und Text eines Logos gemeinsam verschieben. Was tust du vorher?", "Gruppieren", ["Zuschneiden", "Freistellen"], "Gruppierte Objekte werden gemeinsam bearbeitet.", "Wie werden mehrere Objekte eins?"),
          ],
          [
            cc(
              "Dein Vektorplakat soll in einer Präsentation als Bilddatei eingefügt werden, die jedes Programm öffnet. Was machst du?",
              "Das Plakat rendern und als PNG exportieren.",
              ["Das Plakat freistellen.", "Alle Objekte zuschneiden."],
              "Rendern berechnet aus den Vektoren ein Pixelbild, das als PNG überall angezeigt wird.",
              "Wie wird aus Vektoren ein Pixelbild?",
            ),
            cc(
              "Ein freigestelltes Motiv soll seinen transparenten Hintergrund behalten. In welchem Format speicherst du?",
              "PNG",
              ["JPEG", "GIF mit weißem Hintergrund"],
              "JPEG kennt keine Transparenz; PNG speichert sie.",
              "Welches Format kann durchsichtig?",
            ),
            cc(
              "Beim Vergrößern eines Vektorlogos verschiebt sich der Schriftzug gegen das Symbol. Was ist schiefgelaufen?",
              "Symbol und Schriftzug waren nicht gruppiert.",
              ["Das Logo war gerendert.", "Die Farbtiefe war zu klein."],
              "Ohne Gruppierung wird nur das ausgewählte Objekt skaliert.",
              "Wurden beide Objekte zusammen bearbeitet?",
            ),
          ],
        ),
        zuschneiden,
      ],
    }),
    lesson(id, "1.5", 4, {
      id: "it8-manipulation",
      title: "Bildmanipulationen erkennen und bewerten",
      subtitle: "Retusche, Filter, Fotomontage und manipulierte Diagramme",
      why: "Bilder wirken glaubwürdig. Gerade deshalb werden sie verändert, um zu täuschen. Wer die Tricks kennt, fällt nicht darauf herein.",
      html: `<p>Bei <strong>Pixelgrafiken</strong> sind typische Manipulationen die <strong>Retusche</strong> (Hautunreinheiten, Personen oder Gegenstände werden entfernt oder hinzugefügt), <strong>Filter</strong> (Farben, Schärfe, Weichzeichnung verändern die Wirkung) und die <strong>Fotomontage</strong> (Teile aus verschiedenen Bildern werden zusammengesetzt). Auch ein geschickter <strong>Bildausschnitt</strong> kann täuschen.</p>
<p>Bei <strong>Vektorgrafiken</strong> werden häufig <strong>Diagramme</strong> manipuliert: Eine y-Achse, die nicht bei 0 beginnt, lässt kleine Unterschiede riesig wirken; verzerrte Achsen, weggelassene Werte oder 3D-Effekte täuschen ebenfalls. Bewerte Bilder kritisch: Quelle prüfen, auf Licht, Schatten und Kanten achten, eine <strong>Bilder-Rückwärtssuche</strong> nutzen, bei Diagrammen Achsen und Zahlen lesen. Manipulierte Bilder können Menschen bloßstellen oder Meinungen beeinflussen.</p>
<div class="example"><strong>Beispiel:</strong> 48 % stimmen für A, 52 % für B. Beginnt die Achse bei 45 %, ist die Säule B (7 Einheiten) mehr als doppelt so hoch wie A (3 Einheiten), obwohl B nur gut 8 % mehr Stimmen hat.</div>
<div class="merke"><strong>Merke:</strong> Retusche, Filter und Montage verändern Fotos; abgeschnittene Achsen verzerren Diagramme. Sichtbares Verhältnis = (B − Start) ÷ (A − Start).</div>`,
      rule: "Diagramm prüfen: Beginnt die Achse bei 0? Sichtbares Verhältnis = (B − Start) ÷ (A − Start)",
      terms: [
        ["Retusche · Filter · Fotomontage", "Details entfernen/hinzufügen · Wirkung verändern · Bilder zusammensetzen", "Manipulationen an Pixelgrafiken"],
        ["Achsenmanipulation", "y-Achse beginnt nicht bei 0", "kleine Unterschiede wirken riesig; Achsenbruch kennzeichnen"],
      ],
      quiz: [
        "In einem Diagramm beginnt die y-Achse bei 90 %. Was bewirkt das?",
        "Kleine Unterschiede wirken viel größer, als sie sind.",
        "Die Werte werden genauer gemessen.",
        "Die Säulen zeigen die echten Verhältnisse.",
        "Gezeigt wird nur der Teil über 90 %; dadurch wachsen die sichtbaren Unterschiede stark.",
      ],
      lab: manipulationLab,
      exercises: [
        saeulenTask,
        cases(
          "manipulation-erkennen",
          [
            cc("Auf einem Werbefoto ist die Haut völlig ohne Poren und Falten. Welche Manipulation ist wahrscheinlich?", "Retusche", ["Zuschneiden", "Rendern"], "Bei der Retusche werden Details wie Poren entfernt.", "Was wurde entfernt?"),
            cc("Ein Foto zeigt einen Hai auf einer überfluteten Autobahn. Was liegt nahe?", "Eine Fotomontage aus zwei Bildern", ["Ein unbearbeitetes Handyfoto", "Ein Vektorlogo"], "Teile verschiedener Bilder wurden zusammengesetzt.", "Passen Licht und Schatten zusammen?"),
            cc("Womit prüfst du, ob ein Foto schon früher in anderem Zusammenhang veröffentlicht wurde?", "Mit einer Bilder-Rückwärtssuche", ["Mit einem Weichzeichner", "Mit der Rechtschreibprüfung"], "Die Rückwärtssuche findet frühere Veröffentlichungen desselben Bildes.", "Suche mit dem Bild statt mit Text."),
          ],
          [
            cc(
              "Vor einer Wahl kursiert ein Foto, das einen Politiker angeblich bei einer verbotenen Feier zeigt. Wie gehst du vor?",
              "Quelle prüfen, Rückwärtssuche nutzen und seriöse Medien vergleichen, bevor du es teilst.",
              ["Sofort teilen, weil Fotos nicht lügen.", "Den Politiker im Kommentar beschimpfen."],
              "Manipulierte Bilder sollen Meinungen beeinflussen; erst prüfen, dann teilen.",
              "Woher stammt das Foto?",
            ),
            cc(
              "Ein Liniendiagramm zeigt den Schulweg-Unfall-Rückgang von 21 auf 20 Fälle, die Achse reicht nur von 19 bis 21. Wie bewertest du es?",
              "Der Rückgang wirkt dramatisch, beträgt aber nur einen Fall.",
              ["Die Unfälle haben sich halbiert.", "Das Diagramm ist neutral, weil die Zahlen stimmen."],
              "Die Zahlen stimmen, aber der enge Achsenbereich übertreibt die Änderung.",
              "Lies die Zahlen an der Achse.",
            ),
            cc(
              "Ein Mitschüler bearbeitet ein Klassenfoto so, dass eine Person lächerlich aussieht, und will es posten. Wie bewertest du das?",
              "Es ist eine verletzende Manipulation; die Person wird bloßgestellt und hat ein Recht am eigenen Bild.",
              ["Harmloser Spaß, weil es nur ein Filter ist.", "Erlaubt, wenn das Original vom Mitschüler stammt."],
              "Manipulationen können Menschen bloßstellen; ohne Einwilligung darf das Bild nicht veröffentlicht werden.",
              "Wie wirkt das Bild auf die betroffene Person?",
            ),
          ],
        ),
      ],
    }),
  ],
};
