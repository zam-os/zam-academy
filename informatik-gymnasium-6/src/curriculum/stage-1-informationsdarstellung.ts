import type { LabDefinition, LabValues, Stage } from "../model/types";
import { fmt } from "../exercises/format";
import { clamp, H, open, rect, text, line, circle, polygon, polyline, W } from "../lab/svg";
import { containmentArrow, umlCard } from "../lab/oop-svg";
import { cases, cc, lesson, numberField, textField, withSlips } from "./helpers";

const STAGE_ID = "stage-1-informationsdarstellung";

// ─── Lab 1: Darstellungsformen von Information ───────────────────────────────

const SITUATIONEN = [
  "Schulweg zur Turnhalle erklären",
  "Temperaturverlauf einer Schulwoche zeigen",
  "Ruhiges Pausenzeichen im lauten Werkraum",
  "Bauplan einer Blüte im Biologie-Heft",
] as const;

const FORMEN = [
  "Langer Fließtext",
  "Wegskizze",
  "Liniendiagramm",
  "Pantomime / Handzeichen",
  "Beschriftete Zeichnung",
] as const;

function formRating(situation: number, form: number): { label: string; ok: boolean; why: string } {
  const best: Record<number, number> = { 0: 1, 1: 2, 2: 3, 3: 4 };
  if (best[situation] === form) {
    return { label: "Sehr gut geeignet", ok: true, why: "Passt genau zu Zweck, Umgebung und Lesetempo." };
  }
  if (form === 0) {
    return {
      label: "Möglich, aber langsam",
      ok: false,
      why: "Langer Text zwingt zum Wort-für-Wort-Lesen statt zum Überblick.",
    };
  }
  return {
    label: "Weniger geeignet",
    ok: false,
    why: "Diese Darstellungsform bildet die gefragte Information nicht direkt ab.",
  };
}

function drawRepresentationPreview(form: number): string {
  const bx = 270;
  const by = 64;
  if (form === 0) {
    return [
      rect(bx, by, 210, 170, "lab-panel", `rx="10"`),
      text(bx + 14, by + 28, "Absatz 1: Gehe zuerst ...", "lab-text-small"),
      text(bx + 14, by + 50, "über den Hof nach links,", "lab-text-small"),
      text(bx + 14, by + 72, "danach 120 m geradeaus,", "lab-text-small"),
      text(bx + 14, by + 94, "bis das blaue Tor kommt.", "lab-text-muted"),
      text(bx + 14, by + 132, "Viele Wörter, kein Überblick", "lab-text-bad"),
    ].join("");
  }
  if (form === 1) {
    return [
      rect(bx, by, 210, 170, "lab-panel", `rx="10"`),
      rect(bx + 20, by + 108, 46, 32, "lab-fill-b", `rx="4"`),
      text(bx + 43, by + 128, "Aula", "lab-text-small", "middle"),
      rect(bx + 142, by + 30, 52, 34, "lab-fill-ok", `rx="4"`),
      text(bx + 168, by + 51, "Halle", "lab-text-small", "middle"),
      polyline(
        [
          { x: bx + 66, y: by + 124 },
          { x: bx + 114, y: by + 124 },
          { x: bx + 114, y: by + 47 },
          { x: bx + 142, y: by + 47 },
        ],
        "lab-side-a",
      ),
      text(bx + 105, by + 158, "Richtung und Abzweig sofort klar", "lab-text-ok", "middle"),
    ].join("");
  }
  if (form === 2) {
    return [
      rect(bx, by, 210, 170, "lab-panel", `rx="10"`),
      line(bx + 26, by + 136, bx + 190, by + 136, "lab-axis"),
      line(bx + 26, by + 26, bx + 26, by + 136, "lab-axis"),
      polyline(
        [
          { x: bx + 36, y: by + 108 },
          { x: bx + 72, y: by + 84 },
          { x: bx + 108, y: by + 62 },
          { x: bx + 144, y: by + 76 },
          { x: bx + 180, y: by + 42 },
        ],
        "lab-curve",
      ),
      circle(bx + 180, by + 42, 4, "lab-point-a"),
      text(bx + 105, by + 158, "Anstieg auf einen Blick sichtbar", "lab-text-ok", "middle"),
    ].join("");
  }
  if (form === 3) {
    return [
      rect(bx, by, 210, 170, "lab-panel", `rx="10"`),
      circle(bx + 105, by + 56, 16, "lab-fill-b"),
      line(bx + 105, by + 72, bx + 105, by + 118, "lab-side-a"),
      line(bx + 70, by + 88, bx + 142, by + 68, "lab-side-a"),
      text(bx + 105, by + 150, "Lautlos und ohne Worte", "lab-text-ok", "middle"),
    ].join("");
  }
  return [
    rect(bx, by, 210, 170, "lab-panel", `rx="10"`),
    circle(bx + 105, by + 84, 30, "lab-fill-a"),
    circle(bx + 105, by + 84, 10, "lab-fill-b"),
    line(bx + 135, by + 64, bx + 158, by + 50, "lab-thin"),
    text(bx + 162, by + 52, "Kronblatt", "lab-text-small"),
    text(bx + 105, by + 158, "Bauteile exakt beschriftet", "lab-text-ok", "middle"),
  ].join("");
}

const darstellungLab: LabDefinition = {
  kind: "darstellungsformen",
  title: "Darstellungsform passend zur Situation wählen",
  intro: "Vergleiche rechts, wie dieselbe oder eine passende Information dargestellt wird.",
  params: [
    {
      key: "situation",
      type: "choice",
      label: "Situation",
      value: 0,
      options: SITUATIONEN.map((label, value) => ({ value, label })),
    },
    {
      key: "form",
      type: "choice",
      label: "Darstellungsform",
      value: 0,
      options: FORMEN.map((label, value) => ({ value, label })),
    },
  ],
  readouts: [
    {
      key: "bewertung",
      label: "Bewertung",
      emphasis: true,
      compute: (v) => formRating(v.situation, v.form).label,
    },
    {
      key: "begruendung",
      label: "Begründung",
      compute: (v) => formRating(v.situation, v.form).why,
    },
  ],
  goals: [
    {
      id: "weg",
      text: "Wähle für den Schulweg zur Turnhalle die Wegskizze.",
      check: (v) => v.situation === 0 && v.form === 1,
    },
    {
      id: "temp",
      text: "Zeige den Temperaturverlauf mit einem Liniendiagramm.",
      check: (v) => v.situation === 1 && v.form === 2,
    },
    {
      id: "leise",
      text: "Gib im lauten Werkraum das Pausenzeichen per Pantomime / Handzeichen.",
      check: (v) => v.situation === 2 && v.form === 3,
    },
  ],
  view: {
    render: (v) => {
      const rating = formRating(v.situation, v.form);
      return [
        open("Darstellungsformen im Vergleich"),
        rect(16, 16, W - 32, H - 32, "lab-plot-bg", `rx="12"`),
        text(32, 42, `Aufgabe: ${SITUATIONEN[v.situation]}`, "lab-text-big"),
        rect(32, 64, 218, 170, rating.ok ? "lab-fill-ok" : "lab-panel", `rx="10"`),
        text(48, 94, "Gewählte Form:", "lab-text-muted"),
        text(48, 120, FORMEN[v.form], "lab-text-a"),
        text(48, 156, "Bewertung:", "lab-text-muted"),
        text(48, 180, rating.label, rating.ok ? "lab-text-ok" : "lab-text-bad"),
        drawRepresentationPreview(v.form),
        text(32, 276, rating.why, "lab-text-small"),
        "</svg>",
      ].join("");
    },
  },
};

// ─── Lab 2: Objekte, Attribute, Methoden & Punktnotation ───────────────────────

const OBJEKT_FARBEN = ["blau", "grün", "orange"] as const;
const OBJEKT_FILL = ["lab-fill-a", "lab-fill-ok", "lab-fill-b"] as const;

const punktnotationLab: LabDefinition = {
  kind: "punktnotation-objekt",
  title: "Objektkarte, Attribute und Punktnotation",
  intro: "Ziehe das Rechteck „banner“ an seinem Punkt oder führe Methoden aus.",
  params: [
    { key: "posX", type: "range", label: "Position x", unit: "px", min: 40, max: 200, step: 10, value: 60 },
    { key: "posY", type: "range", label: "Position y", unit: "px", min: 50, max: 190, step: 10, value: 70 },
    { key: "breite", type: "range", label: "Breite", unit: "px", min: 60, max: 160, step: 10, value: 80 },
    {
      key: "farbe",
      type: "choice",
      label: "Füllfarbe",
      value: 0,
      options: OBJEKT_FARBEN.map((label, value) => ({ value, label })),
    },
    { key: "aktionen", type: "state", value: 0 },
  ],
  actions: [
    {
      id: "verschieben",
      label: "banner.verschieben(40, 30)",
      apply: (v) => ({
        ...v,
        posX: v.posX + 40,
        posY: v.posY + 30,
        aktionen: v.aktionen + 1,
      }),
    },
    {
      id: "orange-faerben",
      label: "banner.setzeFarbe(„orange“)",
      apply: (v) => ({ ...v, farbe: 2, aktionen: v.aktionen + 1 }),
    },
  ],
  witnesses: {
    breit: { posX: 60, posY: 70, breite: 140, farbe: 0, aktionen: 0 },
    bewegt: { posX: 160, posY: 130, breite: 80, farbe: 0, aktionen: 1 },
    methode: { posX: 60, posY: 70, breite: 80, farbe: 2, aktionen: 1 },
  },
  readouts: [
    { key: "zustand", label: "Objektzustand", compute: (v) => `x = ${v.posX} px, y = ${v.posY} px` },
    {
      key: "punkt",
      label: "Punktnotation",
      emphasis: true,
      compute: (v) => `banner.breite = ${v.breite} · banner.farbe = „${OBJEKT_FARBEN[v.farbe]}“`,
    },
    { key: "aufrufe", label: "Methodenaufrufe", compute: (v) => v.aktionen, digits: 0 },
  ],
  goals: [
    {
      id: "breit",
      text: "Setze banner.breite auf mindestens 140 px.",
      check: (v) => v.breite >= 140,
    },
    {
      id: "bewegt",
      text: "Bewege banner so, dass x ≥ 160 px und y ≥ 120 px ist.",
      check: (v) => v.posX >= 160 && v.posY >= 120,
    },
    {
      id: "methode",
      text: "Färbe banner mit der Methode setzeFarbe(„orange“) um.",
      check: (v) => v.farbe === 2 && v.aktionen >= 1,
    },
  ],
  view: {
    render: (v) => {
      const boxW = Math.round(v.breite * 0.72);
      const handleX = v.posX + boxW / 2;
      const handleY = v.posY + 38;
      return [
        open("Objektkarte und Live-Zeichenfläche"),
        rect(14, 14, 290, H - 28, "lab-plot-bg", `rx="10"`),
        text(26, 36, "Zeichenfläche", "lab-text-muted"),
        rect(160, 120, 130, 110, "lab-dashed", `rx="8"`),
        text(225, 224, "Zielbereich", "lab-text-muted", "middle"),
        rect(v.posX, v.posY, boxW, 54, OBJEKT_FILL[v.farbe], `rx="8"`),
        text(v.posX + boxW / 2, v.posY + 20, "banner", "lab-text-small", "middle"),
        circle(handleX, handleY, 15, "lab-handle-hit"),
        `<g class="lab-handle lab-handle-a" data-handle="banner" tabindex="0" role="button" aria-label="Objekt banner ziehen oder mit Pfeiltasten verschieben">` +
          circle(handleX, handleY, 7, "lab-handle-dot") +
          `</g>`,
        umlCard({
          x: 316,
          y: 18,
          w: 190,
          isObject: true,
          title: "banner : RECHTECK",
          attributes: [
            `x = ${v.posX}`,
            `y = ${v.posY}`,
            `breite = ${v.breite}`,
            `farbe = „${OBJEKT_FARBEN[v.farbe]}“`,
          ],
          methods: ["verschieben(dx, dy)", "setzeFarbe(f)"],
        }),
        rect(16, 268, W - 32, 52, "lab-panel", `rx="8"`),
        text(28, 291, `Punktnotation: banner.breite = ${v.breite}; banner.x = ${v.posX}`, "lab-text-a"),
        text(28, 310, `Aufgerufene Methoden in dieser Sitzung: ${v.aktionen}`, "lab-text-muted"),
        "</svg>",
      ].join("");
    },
    handles: {
      banner: {
        x: "posX",
        y: "posY",
        drag: (p: { x: number; y: number }, v: LabValues) => ({
          posX: clamp(p.x - Math.round((v.breite * 0.72) / 2), 40, 200),
          posY: clamp(p.y - 38, 50, 190),
        }),
      },
    },
  },
};

// ─── Lab 3: Klassen, Objekt- & Klassendiagramme ──────────────────────────────

const diagrammLab: LabDefinition = {
  kind: "diagramm-vergleich",
  title: "Objektdiagramm und Klassendiagramm vergleichen",
  intro: "Schalte zwischen konkreten Objekten und dem abstrakten Bauplan um und korrigiere die Enthält-Beziehung.",
  params: [
    {
      key: "modus",
      type: "choice",
      label: "Diagrammart",
      value: 0,
      options: [
        { value: 0, label: "Objektdiagramm (konkret)" },
        { value: 1, label: "Klassendiagramm (Bauplan)" },
      ],
    },
    {
      key: "richtung",
      type: "choice",
      label: "Pfeilrichtung",
      value: 1,
      options: [
        { value: 0, label: "Dokument enthält Textfeld" },
        { value: 1, label: "Textfeld enthält Dokument" },
      ],
    },
    {
      key: "details",
      type: "choice",
      label: "Karteninhalt",
      value: 0,
      options: [
        { value: 0, label: "Nur Namen" },
        { value: 1, label: "Mit Attributen und Methoden" },
      ],
    },
  ],
  readouts: [
    {
      key: "ebene",
      label: "Modellebene",
      compute: (v) => (v.modus === 0 ? "Konkrete Instanzen mit Werten" : "Abstrakte Klassen (Baupläne)"),
    },
    {
      key: "pruefung",
      label: "Enthält-Beziehung",
      emphasis: true,
      compute: (v) => (v.richtung === 0 ? "Stimmt: großes Dokument enthält kleines Textfeld" : "Falsch herum: Teil kann kein Ganzes enthalten"),
    },
  ],
  goals: [
    {
      id: "richtung",
      text: "Richte die Enthält-Beziehung sinnvoll aus.",
      check: (v) => v.richtung === 0,
    },
    {
      id: "objekt",
      text: "Prüfe das Objektdiagramm mit konkreten Attributwerten.",
      check: (v) => v.modus === 0 && v.richtung === 0 && v.details === 1,
    },
    {
      id: "klasse",
      text: "Abstrahiere zum Klassendiagramm mit Attributnamen (ohne Werte).",
      check: (v) => v.modus === 1 && v.richtung === 0 && v.details === 1,
    },
  ],
  view: {
    render: (v) => {
      const isObj = v.modus === 0;
      const okDir = v.richtung === 0;
      const leftAttrs = v.details
        ? isObj
          ? ["breite = 21 cm", "höhe = 29,7 cm", "hintergrund = „weiß“"]
          : ["breite", "höhe", "hintergrund"]
        : ["…"];
      const leftMethods = v.details ? ["drucken()", "speichern()"] : [];
      const rightAttrs = v.details
        ? isObj
          ? ["text = „Schulfest“", "schriftgröße = 36 pt", "x = 40"]
          : ["text", "schriftgröße", "x, y"]
        : ["…"];
      const rightMethods = v.details ? ["textÄndern(t)"] : [];

      return [
        open("Objektdiagramm und Klassendiagramm"),
        rect(16, 16, W - 32, H - 32, "lab-plot-bg", `rx="12"`),
        text(
          W / 2,
          44,
          isObj ? "Objektdiagramm: d1 und t1" : "Klassendiagramm: Bauplan für alle Plakate",
          "lab-text-big",
          "middle",
        ),
        umlCard({
          x: 24,
          y: 82,
          w: 196,
          isObject: isObj,
          title: isObj ? "d1 : GRAFIKDOKUMENT" : "GRAFIKDOKUMENT",
          attributes: leftAttrs,
          methods: leftMethods,
        }),
        umlCard({
          x: 300,
          y: 82,
          w: 196,
          isObject: isObj,
          title: isObj ? "t1 : TEXTFELD" : "TEXTFELD",
          attributes: rightAttrs,
          methods: rightMethods,
        }),
        containmentArrow(
          okDir ? 220 : 300,
          132,
          okDir ? 300 : 220,
          132,
          "enthält",
          "lab-side-a",
          okDir,
        ),
        ...(okDir
          ? [
              text(
                W / 2,
                292,
                isObj
                  ? "Objektkarte: enthält konkrete Werte wie „Schulfest“."
                  : "Klassenkarte: Großbuchstaben, nur Bauplan ohne Einzelwerte.",
                "lab-text-ok",
                "middle",
              ),
            ]
          : [
              text(W / 2, 282, "Falsch herum: Ein TEXTFELD enthält", "lab-text-bad", "middle"),
              text(W / 2, 304, "kein ganzes GRAFIKDOKUMENT!", "lab-text-bad", "middle"),
            ]),
        "</svg>",
      ].join("");
    },
  },
};

// ─── Lab 4: Vektor- vs. Pixelgrafik (Zoom-Lupe) ───────────────────────────────

const grafikZoomLab: LabDefinition = {
  kind: "vektor-pixel-lupe",
  title: "Vektor- und Pixelgrafik unter der Zoom-Lupe",
  intro: "Vergrößere einen Grundrissplan und ein Naturfoto und vergleiche Kanten und Eignung.",
  params: [
    {
      key: "motiv",
      type: "choice",
      label: "Praxisbeispiel",
      value: 0,
      options: [
        { value: 0, label: "Grundrissplan / Schullogo" },
        { value: 1, label: "Foto eines Sees" },
      ],
    },
    {
      key: "typ",
      type: "choice",
      label: "Grafikart",
      value: 0,
      options: [
        { value: 0, label: "Pixelgrafik (Raster)" },
        { value: 1, label: "Vektorgrafik (Objekte)" },
      ],
    },
    { key: "zoom", type: "range", label: "Vergrößerung", unit: "×", min: 1, max: 12, step: 1, value: 2 },
  ],
  readouts: [
    {
      key: "kante",
      label: "Kanten beim Zoomen",
      compute: (v) =>
        v.typ === 1 ? "Gestochen scharf (mathematisch neu berechnet)" : v.zoom >= 6 ? "Deutliche Treppenstufen (Pixel sichtbar)" : "Noch feines Raster",
    },
    {
      key: "eignung",
      label: "Eignung",
      emphasis: true,
      compute: (v) => {
        if (v.motiv === 0 && v.typ === 1) return "Ideal: Plan bleibt bei jedem Maßstab scharf";
        if (v.motiv === 1 && v.typ === 0) return "Ideal: Fotos bestehen aus feinen Farbübergängen";
        if (v.motiv === 0 && v.typ === 0) return "Ungünstig: beim Drucken treten Treppeneffekte auf";
        return "Ungeeignet: geometrische Formen bilden Fotos kaum realistisch ab";
      },
    },
  ],
  goals: [
    {
      id: "treppen",
      text: "Zoome eine Pixelgrafik auf mindestens 8×, um Treppeneffekte zu sehen.",
      check: (v) => v.typ === 0 && v.zoom >= 8,
    },
    {
      id: "plan-vektor",
      text: "Stelle den Grundrissplan auf Vektorgrafik und prüfe ihn bei 8× oder mehr.",
      check: (v) => v.motiv === 0 && v.typ === 1 && v.zoom >= 8,
    },
    {
      id: "foto-pixel",
      text: "Wähle für das Foto eines Sees die geeignete Grafikart.",
      check: (v) => v.motiv === 1 && v.typ === 0,
    },
  ],
  view: {
    render: (v) => {
      const bx = 36;
      const by = 60;
      const size = 180;
      const parts: string[] = [
        open("Vektor- gegen Pixelgrafik"),
        rect(16, 16, W - 32, H - 32, "lab-plot-bg", `rx="12"`),
        text(36, 44, `${v.typ === 0 ? "Pixelgrafik" : "Vektorgrafik"} bei ${v.zoom}× Zoom`, "lab-text-big"),
        rect(bx, by, size, size, "lab-panel", `rx="8"`),
      ];

      if (v.typ === 0) {
        // Discrete raster blocks grow visible as zoom increases.
        const cells = v.zoom >= 8 ? 6 : v.zoom >= 4 ? 9 : 15;
        const cell = size / cells;
        for (let r = 0; r < cells; r++) {
          for (let c = 0; c < cells; c++) {
            const fill =
              v.motiv === 0
                ? Math.abs(r + c - (cells - 1)) <= 0 || r === 1 || c === cells - 2
                : r >= Math.floor(cells * 0.52) || (r + c) % 3 === 0;
            if (fill) {
              const cls = v.motiv === 1 && r >= Math.floor(cells * 0.52) ? "lab-fill-a" : "lab-fill-b";
              parts.push(rect(bx + c * cell + 0.5, by + r * cell + 0.5, cell - 1, cell - 1, cls));
            }
          }
        }
        parts.push(text(bx + size / 2, by + size + 22, "Feste Bildpunkte (Raster)", "lab-text-muted", "middle"));
      } else if (v.motiv === 0) {
        const s = 14 + Math.min(34, v.zoom * 3);
        parts.push(
          polygon(
            [
              { x: bx + 32, y: by + 135 },
              { x: bx + 148, y: by + 40 },
              { x: bx + 148, y: by + 135 },
            ],
            "lab-fill-a",
          ),
          line(bx + 32, by + 135, bx + 148, by + 40, "lab-side-a"),
          circle(bx + 70, by + 56, clamp(s * 0.35, 8, 22), "lab-fill-ok"),
          text(bx + size / 2, by + size + 22, "Mathematische Linien & Flächen", "lab-text-ok", "middle"),
        );
      } else {
        parts.push(
          polygon(
            [
              { x: bx + 20, y: by + 150 },
              { x: bx + 85, y: by + 60 },
              { x: bx + 160, y: by + 150 },
            ],
            "lab-fill-c",
          ),
          text(bx + size / 2, by + size + 22, "Vereinfachte Flächen statt Foto-Details", "lab-text-bad", "middle"),
        );
      }

      const infoCls =
        (v.motiv === 0 && v.typ === 1) || (v.motiv === 1 && v.typ === 0) ? "lab-fill-ok" : "lab-panel";
      parts.push(
        rect(240, 60, 246, 180, infoCls, `rx="10"`),
        text(256, 90, v.motiv === 0 ? "Beispiel: Grundrissplan" : "Beispiel: Naturfoto", "lab-text-a"),
        text(
          256,
          122,
          v.typ === 1 ? "Gespeichert als: Objekte" : "Gespeichert als: Pixelmatrix",
          "lab-text-small",
        ),
        text(
          256,
          148,
          v.typ === 1 ? "(LINIE, RECHTECK, KREIS)" : "(feste Zeilen × Spalten)",
          "lab-text-muted",
        ),
        text(
          256,
          196,
          (v.motiv === 0 && v.typ === 1) || (v.motiv === 1 && v.typ === 0)
            ? "Passt zum Einsatzzweck ✅"
            : "Format noch nicht optimal",
          (v.motiv === 0 && v.typ === 1) || (v.motiv === 1 && v.typ === 0)
            ? "lab-text-ok"
            : "lab-text-bad",
        ),
        "</svg>",
      );
      return parts.join("");
    },
  },
};

// ─── Lab 5: Vektorgrafik-Ebenen & Gruppieren ───────────────────────────────────

const vektorEbenenLab: LabDefinition = {
  kind: "vektor-ebenen-gruppen",
  title: "Vektorobjekte anordnen, nach vorne holen und gruppieren",
  intro: "Das Textfeld steckt hinter dem blauen Rechteck fest. Hol es nach vorne, zieh den Kreis in den Zielrahmen und gruppiere das Logo.",
  params: [
    { key: "xKreis", type: "range", label: "Kreis x", unit: "px", min: 90, max: 390, step: 10, value: 120 },
    { key: "yKreis", type: "range", label: "Kreis y", unit: "px", min: 80, max: 230, step: 10, value: 110 },
    {
      key: "ebeneText",
      type: "choice",
      label: "Ebene von titel : TEXTFELD",
      value: 0,
      options: [
        { value: 0, label: "Hinter dem Rechteck (hinten)" },
        { value: 1, label: "Vor dem Rechteck (vorne)" },
      ],
    },
    {
      key: "gruppiert",
      type: "choice",
      label: "Objektgruppe",
      value: 0,
      options: [
        { value: 0, label: "Einzelne Objekte" },
        { value: 1, label: "RECHTECK + TEXTFELD + KREIS gruppiert" },
      ],
    },
  ],
  readouts: [
    {
      key: "sichtbarkeit",
      label: "Textfeld",
      compute: (v) => (v.ebeneText === 1 ? "Sichtbar (in vorderer Ebene)" : "Verdeckt hinter schildBox"),
    },
    {
      key: "gruppe",
      label: "Gruppe",
      emphasis: true,
      compute: (v) => (v.gruppiert === 1 ? "Gruppiert (gemeinsam verschiebbar)" : "Unabhängige Einzelobjekte"),
    },
  ],
  goals: [
    {
      id: "vorne",
      text: "Bringe das TEXTFELD vor das RECHTECK, damit „INFO“ lesbar wird.",
      check: (v) => v.ebeneText === 1,
    },
    {
      id: "kreis-platz",
      text: "Ziehe den KREIS in das rechteckige Schild (x zwischen 290 und 370 px, y zwischen 130 und 200 px).",
      check: (v) => v.xKreis >= 290 && v.xKreis <= 370 && v.yKreis >= 130 && v.yKreis <= 200,
    },
    {
      id: "gruppe",
      text: "Gruppiere die sichtbaren und platzierten Logo-Teile.",
      check: (v) =>
        v.ebeneText === 1 &&
        v.gruppiert === 1 &&
        v.xKreis >= 290 &&
        v.xKreis <= 370 &&
        v.yKreis >= 130 &&
        v.yKreis <= 200,
    },
  ],
  view: {
    render: (v) => {
      const inBox = v.xKreis >= 290 && v.xKreis <= 370 && v.yKreis >= 130 && v.yKreis <= 200;
      const boxRect = `<rect x="260" y="96" width="190" height="126" rx="12" fill="var(--brand)" stroke="var(--lab-ink)" stroke-width="2" />`;
      const textBox = [
        rect(282, 114, 146, 36, "lab-panel", `rx="6"`),
        text(355, 137, "TEXTFELD: INFO", "lab-text-a", "middle"),
      ].join("");

      return [
        open("Vektorgrafik-Ebenen und Gruppieren"),
        rect(16, 16, W - 32, H - 32, "lab-plot-bg", `rx="12"`),
        text(32, 42, "GRAFIKDOKUMENT (Ebenenreihenfolge & Gruppe)", "lab-text-big"),
        line(248, 240, 462, 240, "lab-side-b"),
        text(28, 72, "Klassen: GRAFIKDOKUMENT → RECHTECK, TEXTFELD, KREIS, LINIE", "lab-text-muted"),
        v.gruppiert === 1 && inBox ? rect(244, 84, 224, 170, "lab-dashed", `rx="14"`) : "",
        v.ebeneText === 1 ? boxRect + textBox : textBox + boxRect,
        circle(v.xKreis, v.yKreis, 22, "lab-fill-ok"),
        circle(v.xKreis, v.yKreis, 15, "lab-handle-hit"),
        `<g class="lab-handle lab-handle-b" data-handle="kreis" tabindex="0" role="button" aria-label="Kreis-Objekt verschieben (ziehen oder Pfeiltasten)">` +
          circle(v.xKreis, v.yKreis, 7.5, "lab-handle-dot") +
          `</g>`,
        text(v.xKreis, v.yKreis + 36, `KREIS (${v.xKreis}, ${v.yKreis})`, "lab-text-small", "middle"),
        v.gruppiert === 1 && inBox ? text(356, 274, "Gruppenrahmen aktiv", "lab-text-ok", "middle") : "",
        text(32, 304, "Tipp: SVG zeichnet Objekte von hinten nach vorne.", "lab-text-muted"),
        "</svg>",
      ].join("");
    },
    handles: {
      kreis: {
        x: "xKreis",
        y: "yKreis",
        drag: (p: { x: number; y: number }) => ({
          xKreis: clamp(p.x, 90, 390),
          yKreis: clamp(p.y, 80, 230),
        }),
      },
    },
  },
};

// ─── Lab 6: Textdokumente: Klassen, Attribute & Layoutobjekte ─────────────────

const AUSRICHTUNG = ["linksbündig", "zentriert", "Blocksatz"] as const;
const ZEILENABSTAND = ["1,0-fach", "1,5-fach"] as const;
const LAYOUT_OBJEKTE = ["Nur Absätze", "Mit eingefügtem BILD", "Mit eingefügter TABELLE"] as const;

const textdokumentLab: LabDefinition = {
  kind: "textdokument-hierarchie",
  title: "TEXTDOKUMENT, ABSATZ und ZEICHEN formatieren",
  intro: "Stelle Absatz- und Zeichenattribute um, ziehe den linken Einzug am Lineal und füge Layoutobjekte ein.",
  params: [
    { key: "einzug", type: "range", label: "ABSATZ-Einzug links", unit: "mm", min: 0, max: 40, step: 5, value: 0 },
    { key: "schriftPt", type: "range", label: "ZEICHEN-Größe", unit: "pt", min: 10, max: 18, step: 2, value: 12 },
    {
      key: "ausrichtung",
      type: "choice",
      label: "ABSATZ-Ausrichtung",
      value: 0,
      options: AUSRICHTUNG.map((label, value) => ({ value, label })),
    },
    {
      key: "zeilenabstand",
      type: "choice",
      label: "ABSATZ-Zeilenabstand",
      value: 0,
      options: ZEILENABSTAND.map((label, value) => ({ value, label })),
    },
    {
      key: "zusatz",
      type: "choice",
      label: "Layoutobjekt einfügen",
      value: 0,
      options: LAYOUT_OBJEKTE.map((label, value) => ({ value, label })),
    },
  ],
  readouts: [
    { key: "absatz", label: "ABSATZ-Zustand", compute: (v) => `${AUSRICHTUNG[v.ausrichtung]}, Abstand ${ZEILENABSTAND[v.zeilenabstand]}, Einzug ${v.einzug} mm` },
    { key: "zeichen", label: "ZEICHEN-Zustand", emphasis: true, compute: (v) => `Schriftgröße = ${v.schriftPt} pt` },
  ],
  goals: [
    {
      id: "einzug",
      text: "Ziehe den linken ABSATZ-Einzug auf mindestens 20 mm.",
      check: (v) => v.einzug >= 20,
    },
    {
      id: "absatz-form",
      text: "Stelle den Absatz auf Blocksatz und 1,5-fachen Zeilenabstand.",
      check: (v) => v.ausrichtung === 2 && v.zeilenabstand === 1,
    },
    {
      id: "tabelle",
      text: "Füge eine strukturierte TABELLE in das TEXTDOKUMENT ein.",
      check: (v) => v.zusatz === 2,
    },
  ],
  view: {
    render: (v) => {
      const pxEinzug = v.einzug * 2;
      const hx = 64 + pxEinzug;
      const hy = 52;
      const anchor = v.ausrichtung === 1 ? "middle" : "start";
      const tx = v.ausrichtung === 1 ? 260 : 64 + pxEinzug;
      const lineStep = v.zeilenabstand === 1 ? 24 : 16;

      return [
        open("Formatierung von TEXTDOKUMENT, ABSATZ und ZEICHEN"),
        rect(16, 16, W - 32, H - 32, "lab-plot-bg", `rx="12"`),
        rect(48, 42, 424, 22, "lab-shape", `rx="4"`),
        line(64, 53, 456, 53, "lab-axis"),
        circle(hx, hy, 15, "lab-handle-hit"),
        `<g class="lab-handle lab-handle-a" data-handle="einzug" tabindex="0" role="button" aria-label="Linken Absatzeinzug ziehen oder Pfeiltasten drücken">` +
          circle(hx, hy, 7, "lab-handle-dot") +
          `</g>`,
        text(456, 57, `Einzug: ${v.einzug} mm`, "lab-text-muted", "end"),
        rect(48, 72, 424, 212, "lab-panel", `rx="8"`),
        text(tx, 102, "Referat: Unsere heimischen Vögel", "lab-text-a", anchor),
        line(tx, 114, v.ausrichtung === 1 ? 390 : 440, 114, "lab-thin"),
        text(tx, 114 + lineStep, `Zeile 1 (${v.schriftPt} pt, ${AUSRICHTUNG[v.ausrichtung]})`, "lab-text-small", anchor),
        text(tx, 114 + lineStep * 2, `Zeile 2 mit ${ZEILENABSTAND[v.zeilenabstand]} Abstand`, "lab-text-small", anchor),
        v.zusatz === 1
          ? rect(320, 186, 130, 80, "lab-fill-b", `rx="6"`) +
            text(385, 230, "BILD-Objekt", "lab-text-b", "middle")
          : "",
        v.zusatz === 2
          ? [
              rect(68, 188, 250, 74, "lab-cell", `rx="4"`),
              line(68, 212, 318, 212, "lab-ink"),
              line(188, 188, 188, 262, "lab-ink"),
              text(128, 204, "Art", "lab-text-a", "middle"),
              text(252, 204, "Merkmal", "lab-text-a", "middle"),
              text(128, 230, "Amsel", "lab-text-small", "middle"),
              text(252, 230, "gelber Schnabel", "lab-text-small", "middle"),
            ].join("")
          : "",
        text(
          32,
          306,
          `TEXTDOKUMENT → enthält ABSATZ → enthält ZEICHEN (${v.schriftPt} pt)`,
          "lab-text-muted",
        ),
        "</svg>",
      ].join("");
    },
    handles: {
      einzug: {
        x: "einzug",
        drag: (p: { x: number }) => ({
          einzug: clamp(Math.round((p.x - 64) / 2), 0, 40),
        }),
      },
    },
  },
};

// ─── Lab 7: Multimediadokumente & Modi ────────────────────────────────────────

const multimediaLab: LabDefinition = {
  kind: "multimedia-modus",
  title: "MULTIMEDIADOKUMENT: Bearbeitungs- und Vorführmodus",
  intro: "Schalte das AUDIO-Objekt zu, wechsle in den Vorführmodus und löse Animationsschritte per Klick aus.",
  params: [
    {
      key: "modus",
      type: "choice",
      label: "Programm-Modus",
      value: 0,
      options: [
        { value: 0, label: "Bearbeitungsmodus" },
        { value: 1, label: "Vorführmodus (Präsentation)" },
      ],
    },
    {
      key: "audioAktiv",
      type: "choice",
      label: "Medien auf FOLIE 1",
      value: 0,
      options: [
        { value: 0, label: "Nur TEXTFELD + BILD" },
        { value: 1, label: "TEXTFELD + BILD + AUDIO" },
      ],
    },
    { key: "schritt", type: "state", value: 0, resetOnChange: true },
  ],
  actions: [
    {
      id: "klick",
      label: "Mausklick im Vorführmodus",
      apply: (v) => ({
        ...v,
        schritt: v.modus === 1 ? Math.min(3, v.schritt + 1) : v.schritt,
      }),
    },
  ],
  witnesses: {
    audio: { modus: 0, audioAktiv: 1, schritt: 0 },
    vorfuehren: { modus: 1, audioAktiv: 0, schritt: 0 },
    anim: { modus: 1, audioAktiv: 1, schritt: 2 },
  },
  readouts: [
    {
      key: "ansicht",
      label: "Aktiver Modus",
      compute: (v) => (v.modus === 0 ? "Bearbeitungsmodus (Werkzeugleisten sichtbar)" : `Vorführmodus (Animationsschritt ${v.schritt} von 3)`),
    },
    {
      key: "methode",
      label: "Ausgelöste Methode",
      emphasis: true,
      compute: (v) =>
        v.modus === 0
          ? "Keine — im Bearbeitungsmodus wird entworfen, nicht abgespielt"
          : v.schritt === 0
            ? "Warte auf ersten Klick"
            : v.schritt === 1
              ? "stichpunkt1.einblenden()"
              : v.schritt === 2
                ? "vogelFoto.einblenden()"
                : "vogelRuf.abspielen()",
    },
  ],
  goals: [
    {
      id: "audio",
      text: "Ergänze FOLIE 1 um ein AUDIO-Objekt.",
      check: (v) => v.audioAktiv === 1,
    },
    {
      id: "vorfuehren",
      text: "Wechsle in den Vorführmodus.",
      check: (v) => v.modus === 1,
    },
    {
      id: "anim",
      text: "Führe mit AUDIO-Objekt mindestens zwei Animationsschritte im Vorführmodus aus.",
      check: (v) => v.modus === 1 && v.audioAktiv === 1 && v.schritt >= 2,
    },
  ],
  view: {
    render: (v) => {
      const live = v.modus === 1;
      return [
        open("Multimediadokument und Programm-Modi"),
        rect(14, 14, W - 28, H - 28, "lab-plot-bg", `rx="12"`),
        live ? "" : rect(26, 26, 98, 250, "lab-shape", `rx="8"`),
        live ? "" : text(75, 52, "Folienleiste", "lab-text-small", "middle"),
        live ? "" : rect(36, 70, 78, 46, "lab-fill-a", `rx="4"`),
        live ? "" : text(75, 97, "Folie 1", "lab-text-small", "middle"),
        rect(live ? 36 : 138, 26, live ? W - 72 : 354, 250, "lab-panel", `rx="10"`),
        text(
          live ? W / 2 : 315,
          56,
          "FOLIE 1: Singvögel im Schulgarten",
          "lab-text-big",
          "middle",
        ),
        !live || v.schritt >= 1
          ? text(live ? 66 : 162, 108, "• Amsel singt morgens", "lab-text-a")
          : text(live ? 66 : 162, 108, "(Klicke für Stichpunkt …)", "lab-text-muted"),
        !live || v.schritt >= 2
          ? rect(live ? 310 : 350, 128, 120, 84, "lab-fill-ok", `rx="8"`) +
            text(live ? 370 : 410, 174, "BILD", "lab-text-ok", "middle")
          : "",
        v.audioAktiv === 1
          ? rect(live ? 66 : 162, 166, 136, 46, !live || v.schritt >= 3 ? "lab-fill-b" : "lab-shape-2", `rx="8"`) +
            text(live ? 134 : 230, 193, "🔊 AUDIO-Objekt", "lab-text-b", "middle")
          : "",
        text(
          32,
          306,
          live
            ? "Vorführmodus: Vollbild fürs Publikum · Klick ruft Animationsmethoden auf."
            : "Bearbeitungsmodus: Folien und Objekte entwerfen (noch keine Show).",
          "lab-text-muted",
        ),
        "</svg>",
      ].join("");
    },
  },
};

// ─── Stage 1 Definition ───────────────────────────────────────────────────────

export const STAGE_INFORMATIONSDARSTELLUNG: Stage = {
  id: STAGE_ID,
  stageNumber: 1,
  title: "Informationsdarstellung und Objekte",
  subtitle: "Darstellungsformen, Punktnotation, Klassen sowie Grafik-, Text- und Multimediadokumente",
  icon: "🧩",
  accent: "#1d58c9",
  badgeTitle: "Modelliererin der Dokumente",
  lehrplanLabel: "NT6 2.1 · ca. 18 Std.",
  module: "2.1",
  lessons: [
    lesson(STAGE_ID, "2.1", 1, {
      id: "inf6-darstellungsformen",
      title: "Darstellungsformen von Information",
      subtitle: "Text, Bild, Diagramm, Ton, Pantomime, Zeichnung und Skizze vergleichen und bewerten",
      why: "Dieselbe Nachricht kann je nach Situation blitzschnell verstanden werden oder für Verwirrung sorgen – die passende Darstellungsform entscheidet.",
      html: `<p>Informationen lassen sich auf ganz verschiedene Weisen darstellen: als <strong>Text</strong>, <strong>Bild</strong> (Foto oder Piktogramm), <strong>Diagramm</strong>, <strong>Ton</strong> (Sprache, Warnsignal), <strong>Pantomime</strong> (Bewegung ohne Worte), exakte <strong>Zeichnung</strong> oder schnelle <strong>Skizze</strong>. Keine Form ist immer die beste – du vergleichst und bewertest sie nach <strong>Situation</strong>, <strong>Empfänger</strong> und <strong>Zweck</strong>.</p>
<p>Braucht jemand rasch räumliche Orientierung, hilft eine Skizze schneller als ein langer Aufsatz. Will man viele Messwerte vergleichen, zeigt ein Diagramm den Verlauf auf einen Blick. Wo Menschen verschiedene Sprachen sprechen oder es sehr laut ist, funktionieren eindeutige Bilder oder Pantomime besonders zuverlässig.</p>
<div class="example"><strong>Beispiel:</strong> Für den Wetterbericht einer Projektwoche notiert Klasse 6b nicht sieben lange Sätze hintereinander, sondern wählt ein <strong>Liniendiagramm</strong>. Steigen und Fallen der Temperatur sieht jede sofort. Für den Weg zur Sporthalle genügt dagegen eine einfache <strong>Skizze</strong> mit Abzweigungen.</div>
<div class="merke"><strong>Merke:</strong> Wähle die Darstellungsform nach dem Zweck: Diagramme vergleichen Zahlen, Skizzen und Zeichnungen zeigen Raum und Aufbau, Bilder und Pantomime wirken auch ohne gemeinsame Sprache.</div>`,
      rule: "Die beste Darstellungsform hängt von Zweck, Empfänger und Situation ab",
      terms: [
        ["Darstellungsformen", "Text · Bild · Diagramm · Ton · Pantomime · Zeichnung · Skizze", "Jede betont andere Merkmale"],
        ["Bewertungskriterien", "Überblick · Genauigkeit · Tempo · Sprachunabhängigkeit", "Entscheiden über die beste Wahl"],
      ],
      quiz: [
        "Welche Darstellungsform zeigt den Temperaturverlauf über eine Woche am übersichtlichsten auf einen Blick?",
        "Ein Diagramm",
        "Eine Pantomime",
        "Eine reine Audioaufnahme ohne Tabelle",
        "Ein Diagramm macht Steigen, Fallen und Höhepunkte von Messwerten sofort vergleichbar.",
      ],
      lab: darstellungLab,
      exercises: [
        cases(
          "darstellung-waehlen",
          [
            cc(
              "Du willst auf einen Blick zeigen, wie sich die Schülerzahl an eurer Schule in fünf Jahren verändert hat.",
              "Diagramm",
              ["Pantomime", "Warnton"],
              "Diagramme machen Zahlenverläufe über Jahre sofort sichtbar.",
              "Womit stellt man Zahlenreihen übersichtlich dar?",
            ),
            cc(
              "Ein Rettungsweg-Schild auf dem Flur muss auch von Gästen ohne Deutschkenntnisse sofort verstanden werden.",
              "Piktogramm / Bild",
              ["Langer Fließtext", "Tonaufnahme ohne Schrift"],
              "Einfache Symbole wirken sprachunabhängig und auf einen Blick.",
              "Welche Form braucht keine gemeinsame Sprache?",
            ),
            cc(
              "Während einer Theaterprobe soll auf der Bühne geräuschlos gezeigt werden, dass jemand ein schweres Paket trägt.",
              "Pantomime",
              ["Säulendiagramm", "Textabsatz"],
              "Pantomime drückt Handlungen durch Gestik und Bewegung ohne Worte aus.",
              "Welche Form arbeitet mit Bewegung statt Sprache?",
            ),
          ],
          [
            cc(
              "Ein Gast fragt am Schulhof schnell nach dem Weg ins Sekretariat im zweiten Stock. Warum ist eine kleine Hand-Skizze oft besser als zehn geschriebene Sätze?",
              "Räumliche Abzweigungen und Stockwerke sind in einer Skizze sofort erfassbar.",
              ["Weil eine Skizze immer schöner klingt als Text.", "Weil man eine Skizze nur am Computer zeichnen darf."],
              "Die Skizze reduziert auf wesentliche Wegpunkte und Richtungspfeile.",
              "Was leistet eine räumliche Skizze besser als Fließtext?",
            ),
            cc(
              "Wann ist eine maßstabsgetreue Konstruktionszeichnung besser als eine flüchtige Skizze?",
              "Wenn genaue Maße und Bauteile exakt gebaut oder gefertigt werden müssen.",
              ["Wenn man nur grob zeigen will, wo der Fußballplatz liegt.", "Wenn ein Gefühl vorgespielt werden soll."],
              "Zeichnungen enthalten genaue Längen und Verhältnisse; Skizzen halten grobe Ideen fest.",
              "Vergleiche Genauigkeit zwischen Zeichnung und Skizze.",
            ),
            cc(
              "Auf dem Schulhof soll das Ende der Pause gemeldet werden, während alle im Gespräch sind. Warum wählt die Schule einen kurzen Ton (Schulglocke) statt eines Plakats?",
              "Ein akustisches Signal erreicht auch Personen, die gerade nicht auf eine Tafel schauen.",
              ["Weil ein Ton immer leiser als ein Bild ist.", "Weil Plakate keine Buchstaben haben dürfen."],
              "Ton wirkt rundum unabhängig von der Blickrichtung.",
              "Achte auf die Umgebungssituation im Schulhof.",
            ),
          ],
        ),
        cases(
          "darstellung-bewerten",
          [
            cc(
              "Welche Aussage beschreibt eine Skizze im Vergleich zu einer genauen Zeichnung treffend?",
              "Sie hält wesentliche Merkmale schnell und vereinfacht fest, ohne jedes exakte Maß.",
              ["Sie enthält zwingend Geräusche und Musik.", "Sie besteht ausschließlich aus Tabellen."],
              "Eine Skizze konzentriert sich auf groben Aufbau und schnelle Verständlichkeit.",
              "Denke an eine schnelle Handskizze im Heft.",
            ),
            cc(
              "Was eignet sich am besten, um den Aufbau einer Pflanzenzelle mit allen Schichten genau zu beschriften?",
              "Eine beschriftete Zeichnung (oder Abbildung)",
              ["Eine reine Pantomime", "Ein Pfeifton"],
              "Zeichnung und Beschriftung zeigen Lage und Namen der Zellbestandteile klar.",
              "Kombiniere Bild mit gezielten Begriffen.",
            ),
            cc(
              "Warum ist ein reiner Warnton für eine detaillierte Bastelanleitung ungeeignet?",
              "Ein Ton vermittelt keine einzelnen Arbeitsschritte und Abmessungen.",
              ["Weil Töne in Deutschland verboten sind.", "Weil Menschen Töne grundsätzlich nicht unterscheiden können."],
              "Warntöne melden ein Ereignis, ersetzen aber keine schrittweise Anleitung.",
              "Überlege, wie viel Detail ein Signalton trägt.",
            ),
          ],
          [
            cc(
              "Für ein Natur-und-Technik-Plakat liegt derselbe Datensatz als 20-zeiliger Text und als Balkendiagramm vor. Welche Bewertung trifft für ein Publikum im Vorbeigehen zu?",
              "Das Balkendiagramm erlaubt den direkten Größenvergleich in Sekunden, der Text liefert Details erst beim Nachlesen.",
              ["Der Text lässt sich im Vorbeigehen immer schneller erfassen als Balken.", "Das Diagramm hat denselben Nachteil wie Pantomime."],
              "Diagramme gewinnen beim schnellen Größenvergleich; Text gewinnt bei genauen Begründungen.",
              "Unterscheide schnellen Überblick und genaue Einzelerklärung.",
            ),
            cc(
              "Eine Klasse vergleicht zwei Anleitungen für ein Vogelhäuschen: nur Text vs. Zeichnung mit Maßen und kurzem Begleittext. Warum gewinnt die Kombination?",
              "Räumliche Lage und Maße sieht man in der Zeichnung sofort, während der Text die Reihenfolge klärt.",
              ["Weil doppelte Informationen immer falsch sind.", "Weil man Text nie lesen sollte."],
              "Verschiedene Darstellungsformen ergänzen sich gezielt nach ihren Stärken.",
              "Was kann die Zeichnung, was kann der Text?",
            ),
            cc(
              "In einer sehr ruhigen Bibliothek möchte eine Lehrkraft auf „Ruhe bitte“ hinweisen. Welche Darstellungsform passt besser als lautes Rufen?",
              "Ein sichtbares Piktogramm-Schild oder eine ruhige Geste (Pantomime)",
              ["Eine laute Sirene", "Ein Balkendiagramm über Lautstärke"],
              "Bild oder Geste stört die Ruhe in der Bibliothek nicht.",
              "Welche Form stört die Bibliothek nicht?",
            ),
          ],
        ),
      ],
    }),

    lesson(STAGE_ID, "2.1", 2, {
      id: "inf6-objekte-attribute-punktnotation",
      title: "Objekte, Attribute, Methoden und Punktnotation",
      subtitle: "Informationseinheiten analysieren, Objektkarten erstellen und in Punktnotation verändern",
      why: "Ob Grafikprogramm, Textverarbeitung oder Präsentation: Wenn du das Prinzip von Objekt, Attribut und Methode kennst, findest du dich in jeder Software sofort zurecht.",
      html: `<p>In der Informatik betrachten wir Dokumente als Sammlung von Bausteinen – sogenannten <strong>Objekten</strong>. Jedes Objekt besitzt eigene Eigenschaften, die <strong>Attribute</strong> (z. B. <code>breite</code>, <code>farbe</code>, <code>schriftgröße</code>). Der konkrete Wert einer Eigenschaft heißt <strong>Attributwert</strong> (z. B. <code>„blau“</code> oder <code>140</code>). Alle aktuellen Attributwerte zusammen ergeben den <strong>Zustand</strong> des Objekts.</p>
<p>Objekte werden nicht nur angeschaut, sondern auch verändert – durch <strong>Methoden</strong> (z. B. <code>verschieben(40, 30)</code>). Um Änderungen kurz, eindeutig und unabhängig von einem bestimmten Programm zu notieren, nutzt die Informatik die <strong>Punktnotation</strong>: <code>objekt.attribut = wert</code> für das Setzen eines Attributs oder <code>objekt.methode(parameter)</code> für einen Methodenaufruf. Standardsoftware teilt sich zudem Grundfunktionen wie <strong>Speichern</strong>, <strong>Öffnen</strong>, <strong>Schließen</strong>, <strong>Kopieren</strong> (erstellt eine zweite Kopie im Zwischenspeicher, Original bleibt) und <strong>Einfügen</strong>.</p>
<div class="example"><strong>Beispiel:</strong> Ein Rechteck heißt <code>plakatBox</code>. Auf seiner <strong>Objektkarte</strong> steht oben <code>plakatBox : RECHTECK</code>, darunter <code>farbe = „blau“</code>, <code>breite = 80</code>. Nach dem Methodenaufruf <code>plakatBox.setzeFarbe(„orange“)</code> lautet die Punktnotation seines neuen Attributwerts <code>plakatBox.farbe = „orange“</code>.</div>
<div class="merke"><strong>Merke:</strong> Punktnotation trennt Objekt und Eigenschaft oder Aktion mit einem Punkt: <code>objekt.attribut = wert</code> und <code>objekt.methode(werte)</code>.</div>`,
      rule: "Objekt = konkretes Ding · Attribut = Eigenschaft · Attributwert = aktueller Wert · Methode = Aktion · Punktnotation: objekt.attribut = wert",
      terms: [
        ["Zustand & Objektkarte", "Gesamtheit aller aktuellen Attributwerte eines Objekts in einer Objektkarte", "Oben: objektname : KLASSE"],
        ["Punktnotation", "<code>objekt.attribut = wert</code> · <code>objekt.methode(parameter)</code>", "Unabhängig vom konkreten Programm"],
        ["Standardfunktionen", "Speichern · Öffnen · Schließen · Kopieren · Einfügen", "Kopieren lässt das Original unverändert"],
      ],
      quiz: [
        "Was beschreibt der Ausdruck „banner.farbe = ‚blau‘“ in der Punktnotation?",
        "Das Attribut farbe des Objekts banner bekommt den Attributwert „blau“",
        "Das Programm erzeugt eine völlig neue Klasse namens farbe",
        "Das Objekt banner wird aus dem Dokument gelöscht",
        "Links vom Punkt steht der Objektname, rechts das Attribut; hinter dem Gleichheitszeichen folgt der neue Attributwert.",
      ],
      lab: punktnotationLab,
      exercises: [
        {
          id: "punktnotation-schreiben",
          make(rng, level) {
            if (level === 1) {
              const items = [
                { obj: "banner", attr: "breite", val: String(rng.pick([120, 140, 160, 180])), raw: true },
                { obj: "titel", attr: "schriftgröße", val: String(rng.pick([18, 20, 24, 28])), raw: true },
                { obj: "kreis1", attr: "farbe", val: rng.pick(["rot", "blau", "grün"]), raw: false },
                { obj: "rahmen", attr: "höhe", val: String(rng.pick([50, 75, 90, 110])), raw: true },
              ];
              const pick = rng.pick(items);
              const accepted = pick.raw
                ? [`${pick.obj}.${pick.attr}=${pick.val}`]
                : [
                    `${pick.obj}.${pick.attr}=${pick.val}`,
                    `${pick.obj}.${pick.attr}="${pick.val}"`,
                    `${pick.obj}.${pick.attr}='${pick.val}'`,
                    `${pick.obj}.${pick.attr}=„${pick.val}“`,
                  ];
              return {
                prompt: `Formuliere in Punktnotation: Das Objekt <code>${pick.obj}</code> soll für das Attribut <code>${pick.attr}</code> den Wert <code>${pick.raw ? pick.val : `„${pick.val}“`}</code> erhalten.`,
                given: [`Objekt: ${pick.obj}`, `Attribut: ${pick.attr}`, `Wert: ${pick.val}`],
                formulaHint: "objekt.attribut = wert",
                fields: [
                  textField(
                    "Punktnotation =",
                    accepted,
                    `${pick.obj}.${pick.attr} = ${pick.val}`,
                    [[`${pick.attr}=${pick.val}`, "Vergiss nicht, vor dem Punkt den Objektnamen zu nennen."]],
                  ),
                ],
                steps: [
                  `Vor den Punkt gehört der Objektname: ${pick.obj}.`,
                  `Nach dem Punkt folgen Attributname und neuer Wert: .${pick.attr} = ${pick.raw ? pick.val : `„${pick.val}“`}.`,
                  `<strong>${pick.obj}.${pick.attr} = ${pick.raw ? pick.val : `„${pick.val}“`}</strong>`,
                ],
              };
            }
            const mItems = [
              {
                obj: "kreis1",
                desc: "um 30 nach rechts und 20 nach unten verschieben",
                method: "verschieben",
                args: ["30", "20"],
                rawArgs: true,
              },
              {
                obj: "box1",
                desc: "mit der Methode setzeFarbe auf gelb umfärben",
                method: "setzeFarbe",
                args: ["gelb"],
                rawArgs: false,
              },
              {
                obj: "titel",
                desc: "mit der Methode setzeGroesse auf 24 setzen",
                method: "setzeGroesse",
                args: ["24"],
                rawArgs: true,
              },
            ];
            const pick = rng.pick(mItems);
            const argComma = pick.args.join(",");
            const accepted = pick.rawArgs
              ? [`${pick.obj}.${pick.method}(${argComma})`, `${pick.obj}.${pick.method}(${pick.args.join(";")})`]
              : [
                  `${pick.obj}.${pick.method}(${pick.args[0]})`,
                  `${pick.obj}.${pick.method}("${pick.args[0]}")`,
                  `${pick.obj}.${pick.method}('${pick.args[0]}')`,
                  `${pick.obj}.${pick.method}(„${pick.args[0]}“)`,
                ];
            return {
              prompt: `Du sollst am Objekt <code>${pick.obj}</code> die Aktion „${pick.desc}“ über die Methode <code>${pick.method}</code> ausführen. Wie lautet der Aufruf in Punktnotation?`,
              given: [],
              fields: [
                textField(
                  "Methodenaufruf =",
                  accepted,
                  `${pick.obj}.${pick.method}(...)`,
                  [
                    [
                      `${pick.obj}.${pick.method}`,
                      "Schreibe hinter den Methodennamen runde Klammern mit dem passenden Übergabewert.",
                    ],
                  ],
                ),
              ],
              steps: [
                `Links vom Punkt steht das Objekt (${pick.obj}).`,
                `Rechts vom Punkt folgt der Methodenname mit runden Klammern (${pick.method}(…)).`,
                `<strong>${pick.obj}.${pick.method}(${pick.rawArgs ? pick.args.join(", ") : `„${pick.args[0]}“`})</strong>`,
              ],
            };
          },
        },
        cases(
          "objekt-konzepte",
          [
            cc(
              "Was nennt man in der Informatik den „Zustand“ eines Objekts?",
              "Die Gesamtheit aller aktuellen Attributwerte zu einem bestimmten Zeitpunkt",
              ["Den Namen der Software, in der man arbeitet", "Den Preis des Computers"],
              "Ändert man auch nur einen Attributwert, geht das Objekt in einen neuen Zustand über.",
              "Denke an alle Werte auf der aktuellen Objektkarte.",
            ),
            cc(
              "Wofür steht beim Objekt rechteck1 der Eintrag „farbe“?",
              "Für ein Attribut (eine Eigenschaft)",
              ["Für eine Methode (eine Aktion)", "Für eine Dateierweiterung"],
              "farbe ist der Name einer Eigenschaft; ein konkreter Wert wäre z. B. „rot“.",
              "Unterscheide Eigenschaft, Wert und Aktion.",
            ),
            cc(
              "Welche Standardfunktion behält das ursprüngliche Objekt an seinem Platz und legt eine zweite Kopie ab?",
              "Kopieren und Einfügen",
              ["Schließen ohne Speichern", "Umbenennen"],
              "Beim Kopieren wird ein Duplikat im Zwischenspeicher abgelegt und beim Einfügen platziert.",
              "Das Original bleibt genau wo es war.",
            ),
          ],
          [
            cc(
              "Warum hilft dir das Denken in Objekten und Attributen beim Wechsel auf ein neues Zeichenprogramm?",
              "Weil Objekte wie Rechtecke und deren Attribute (Farbe, Größe, Position) in fast jedem Programm gleich aufgebaut sind.",
              ["Weil alle Programme exakt denselben Dateinamen erzwingen.", "Weil man in neuen Programmen keine Attribute ändern kann."],
              "Obwohl Menüs anders aussehen, bleibt die Grundstruktur aus Objekten, Attributen und Methoden identisch.",
              "Warum ist das Verständnis produktunabhängig?",
            ),
            cc(
              "Auf der Objektkarte eines Textes steht zuvor „schriftgröße = 12“, danach „schriftgröße = 18“. Wodurch ist dieser neue Zustand entstanden?",
              "Durch Ändern eines Attributwerts mithilfe einer passenden Methode",
              ["Durch Löschen des gesamten Dokuments", "Durch Schließen des Programms ohne Speichern"],
              "Methoden modifizieren Attributwerte und verbessern damit gezielt die Informationsdarstellung.",
              "Wie ändern Programme gezielt Eigenschaften eines Objekts?",
            ),
            cc(
              "Ein Schüler möchte das unfertige Plakat am nächsten Tag weiterbearbeiten. Welche Grundfunktion von Standardsoftware muss er zwingend vor dem Schließen ausführen?",
              "Speichern",
              ["Kopieren in die Zwischenablage", "Schriftgröße verringern"],
              "Nur durch Speichern werden die aktuellen Objektzustände dauerhaft auf dem Datenträger gesichert.",
              "Ohne welche Aktion geht die aktuelle Arbeit nach dem Schließen verloren?",
            ),
          ],
        ),
      ],
    }),

    lesson(STAGE_ID, "2.1", 3, {
      id: "inf6-klassen-diagramme",
      title: "Klassen, Objekt- und Klassendiagramme",
      subtitle: "Gleichartige Objekte abstrahieren und Enthält-Beziehungen im Diagramm darstellen",
      why: "Auf einem Plakat liegen oft zehn Sterne oder zwanzig Textfelder. Statt jedes einzelne immer neu zu beschreiben, fasst die Informatik gleichartige Objekte in einer Klasse als Bauplan zusammen.",
      html: `<p>Haben viele Objekte dieselben Attribute (z. B. <code>breite</code>, <code>höhe</code>, <code>füllfarbe</code>) und dieselben Methoden, fasst man sie zu einer <strong>Klasse</strong> zusammen. Eine Klasse ist der allgemeine <strong>Bauplan</strong> für gleichartige Objekte – Klassennamen schreibt man in Großbuchstaben (z. B. <code>RECHTECK</code>, <code>TEXTFELD</code>, <code>GRAFIKDOKUMENT</code>). Die <strong>Klassenkarte</strong> nennt deshalb nur Attributnamen ohne konkrete Werte.</p>
<p>In Dokumenten stecken Objekte ineinander: Ein Plakat enthält Überschriften, Rechtecke und Kreise. Solche Verknüpfungen heißen <strong>Beziehungen</strong> – in unseren Dokumenten vor allem die <strong>Enthält-Beziehung</strong>. Stellt man konkrete Instanzen mit ihren Werten und Pfeilen dar, entsteht ein <strong>Objektdiagramm</strong>. Stellt man die allgemeinen Baupläne und ihre Beziehungen dar, entsteht ein <strong>Klassendiagramm</strong>.</p>
<div class="example"><strong>Beispiel:</strong> <code>plakat : GRAFIKDOKUMENT</code> enthält <code>titel : TEXTFELD</code> (mit <code>text = „Schulfest“</code>) und <code>rahmen : RECHTECK</code>. Im <strong>Klassendiagramm</strong> abstrahieren wir zu <code>GRAFIKDOKUMENT</code> — enthält → <code>TEXTFELD</code> und <code>GRAFIKDOKUMENT</code> — enthält → <code>RECHTECK</code>, ohne die konkreten Namen <code>plakat</code> oder „Schulfest“.</div>
<div class="merke"><strong>Merke:</strong> Objektkarte zeigt konkrete Attributwerte (<code>titel : TEXTFELD</code>). Klassenkarte ist der Bauplan ohne konkrete Werte (<code>TEXTFELD</code>). Beziehungen verbinden enthaltende und enthaltene Elemente.</div>`,
      rule: "Klasse = Bauplan für gleichartige Objekte (Großbuchstaben, keine Einzelwerte) · Objektdiagramm = konkrete Objekte + Beziehungen · Klassendiagramm = Klassen + Beziehungen",
      terms: [
        ["Klasse & Klassenkarte", "Allgemeiner Bauplan (z. B. <code>KREIS</code>) mit Attributnamen und Methoden, ohne konkrete Werte", "Abstraktion gleichartiger Objekte"],
        ["Objekt- vs. Klassendiagramm", "Objektdiagramm zeigt Einzelfälle mit Werten · Klassendiagramm zeigt das allgemeine Schema", "Verbunden durch „enthält“-Pfeile"],
      ],
      quiz: [
        "Worin unterscheidet sich eine Klassenkarte von einer Objektkarte?",
        "Die Klassenkarte nennt nur den Klassennamen und Attributnamen ohne konkrete Attributwerte",
        "Die Klassenkarte steht immer für eine einzelne, benannte Instanz mit Werten",
        "Die Klassenkarte darf niemals Methoden enthalten",
        "Eine Klasse ist der allgemeine Bauplan für viele Objekte und legt deshalb noch keine einzelnen Werte wie „rot“ oder „14“ fest.",
      ],
      lab: diagrammLab,
      exercises: [
        cases(
          "klasse-abstraktion",
          [
            cc(
              "Auf einem Plakat gibt es stern1, stern2 und stern3. Alle haben die Attribute farbe, größe und position. Welchen Klassennamen wählst du?",
              "STERN",
              ["stern1", "rot"],
              "Gleichartige Objekte werden zu einem Bauplan mit Großbuchstaben-Klassennamen abstrahiert.",
              "Wie schreibt man Klassennamen in der Regel?",
            ),
            cc(
              "Woran erkennst du auf einen Blick eine Objektkarte statt einer Klassenkarte?",
              "An konkreten Attributwerten (z. B. breite = 120) und dem Bezeichner vor dem Doppelpunkt.",
              ["Daran, dass gar keine Attribute notiert sind.", "Daran, dass sie grün gefärbt sein muss."],
              "Nur konkrete Objekte besitzen bereits konkrete Attributwerte.",
              "Schau auf Doppelpunkt und Gleichheitszeichen.",
            ),
            cc(
              "Wie verläuft die Enthält-Beziehung zwischen plakat : GRAFIKDOKUMENT und kreis1 : KREIS richtig?",
              "plakat enthält kreis1",
              ["kreis1 enthält plakat", "Beide enthalten sich nie gegenseitig in einem Dokument"],
              "Das übergeordnete Grafikdokument enthält die einzelnen Zeichenobjekte.",
              "Was steckt worin?",
            ),
          ],
          [
            cc(
              "In einem Klassendiagramm steht bei der Klasse RECHTECK der Eintrag „farbe = grün“. Welcher Modellierungsfehler liegt vor?",
              "In eine Klassenkarte gehören nur Attributnamen wie „farbe“, keine konkreten Werte eines Einzelobjekts.",
              ["Rechtecke dürfen grundsätzlich keine Farbe haben.", "RECHTECK darf nicht großgeschrieben werden."],
              "Erst beim konkreten Objekt (im Objektdiagramm) erhält „farbe“ einen Wert.",
              "Unterscheide Bauplan und konkretes Exemplar.",
            ),
            cc(
              "Warum zeichnet man für ein großes Buch lieber ein Klassendiagramm (TEXTDOKUMENT — enthält → ABSATZ) statt ein Objektdiagramm aller 400 Absätze?",
              "Das Klassendiagramm beschreibt kompakt den gemeinsamen Aufbau aller Dokumente ohne jedes Einzelobjekt aufzulisten.",
              ["Weil man im Klassendiagramm überhaupt keine Pfeile zeichnen muss.", "Weil ein Objektdiagramm für Textdokumente verboten ist."],
              "Abstraktion zu Klassen macht komplexe Strukturen mit wenigen Karten übersichtlich.",
              "Was leistet Abstraktion bei Hunderten ähnlicher Bausteine?",
            ),
            cc(
              "Eine Schülerin beschreibt zwei unterschiedliche Formen: kreis1 : KREIS (radius = 12) und kreis2 : KREIS (radius = 25). Was teilen beide Objekte miteinander?",
              "Sie stammen vom selben Bauplan (Klasse KREIS) ab und besitzen dieselben Attribute und Methoden, aber unterschiedliche Attributwerte.",
              ["Sie haben automatisch immer denselben Radius 12.", "Sie dürfen nicht im selben Grafikdokument vorkommen."],
              "Verschiedene Instanzen derselben Klasse können verschiedene Zustände haben.",
              "Gleich im Bauplan, unterschiedlich im Zustand.",
            ),
          ],
        ),
        cases(
          "diagramm-fehler",
          [
            cc(
              "Welche Schreibweise bezeichnet ein konkretes Objekt der Klasse TEXTFELD im Objektdiagramm?",
              "titel : TEXTFELD",
              ["TEXTFELD", "schriftfarbe = blau"],
              "Vor dem Doppelpunkt steht der Objektname klein, dahinter die Klasse groß.",
              "Objektname : KLASSENNAME.",
            ),
            cc(
              "Was bedeutet ein Pfeil mit der Beschriftung „enthält“ im Klassendiagramm?",
              "Objekte der Startklasse fassen Objekte der Zielklasse als Teilbausteine zusammen.",
              ["Das Startobjekt wird beim Speichern gelöscht.", "Die Zielklasse ist größer als die Startklasse."],
              "Die Enthält-Beziehung zeigt die Schachtelung von Dokumenten und Informationseinheiten.",
              "Lies die Pfeilrichtung wie einen deutschen Satz.",
            ),
            cc(
              "Welche Angabe gehört in eine Klassenkarte der Klasse LINIE?",
              "Attributnamen wie startX, startY, endX, endY, strichstärke",
              ["Konkrete Werte wie „startX = 45, endX = 210“", "Das Passwort des Benutzers"],
              "Klassenkarten benennen die möglichen Eigenschaften aller Objekte dieser Klasse.",
              "Attribute ja, feste Zahlenwerte nein.",
            ),
          ],
          [
            cc(
              "In einem Klassendiagramm zeigt der Pfeil „enthält“ vom ZEICHEN zum TEXTDOKUMENT. Wie korrigierst du das Modell?",
              "Drehe den Pfeil um: TEXTDOKUMENT → ABSATZ → ZEICHEN.",
              ["Lösche die Klasse ZEICHEN komplett aus der Informatik.", "Ersetze TEXTDOKUMENT durch BILD."],
              "Das Gesamtdokument enthält Absätze, und Absätze enthalten Zeichen – niemals umgekehrt.",
              "Wer ist der übergeordnete Baustein?",
            ),
            cc(
              "Auf einer Klassenkarte stehen sowohl „radius“ als auch „vergrößern(faktor)“. Wo gehört was hin?",
              "radius steht im Attributbereich, vergrößern(faktor) im Methodenbereich darunter.",
              ["Beides gehört in den Titelbalken.", "radius ist eine Methode und vergrößern ein Attribut."],
              "Attribute beschreiben Eigenschaften, Methoden (mit Klammern) beschreiben Operationen.",
              "Achte auf die runden Klammern.",
            ),
            cc(
              "Welcher Übergang beschreibt das Abstrahieren korrekt?",
              "Von konkreten Karten wie dreieck1 : DREIECK und dreieck2 : DREIECK zur gemeinsamen Klassenkarte DREIECK",
              ["Von der Klasse DREIECK zum Löschen aller Koordinaten", "Von einem Foto zu einem einzelnen Pixel"],
              "Abstrahieren bedeutet, gemeinsame Bauplan-Merkmale mehrerer Objekte in einer Klasse zu bündeln.",
              "Von den Einzelbeispielen zum Bauplan.",
            ),
          ],
        ),
      ],
    }),

    lesson(STAGE_ID, "2.1", 4, {
      id: "inf6-vektor-pixelgrafik",
      title: "Vektor- und Pixelgrafik",
      subtitle: "Aufbau vergleichen, Treppeneffekte erkennen und für Praxisbeispiele begründet wählen",
      why: "Ein Schullogo auf dem T-Shirt muss riesig gedruckt genauso scharf aussehen wie auf der Schulwebseite – beim Urlaubsfoto geht dagegen kein Weg am Pixelraster vorbei.",
      html: `<p>Digitale Bilder werden auf zwei grundverschiedene Arten gespeichert. Eine <strong>Pixelgrafik</strong> (Rastergrafik, z. B. für Fotos) teilt das Bild in ein feines Schachbrettgitter aus winzigen Bildpunkten, den <strong>Pixeln</strong>. Jeder Bildpunkt speichert eine feste Farbe. Vergrößert man stark, werden die quadratischen Pixel als unschöne <strong>Treppeneffekte</strong> sichtbar.</p>
<p>Eine <strong>Vektorgrafik</strong> (z. B. SVG oder Zeichnungen aus einem Vektorprogramm) speichert keine Bildpunkte, sondern mathematisch beschriebene geometrische Objekte wie Linien, Kreise, Rechtecke und Textfelder mit Koordinaten, Farben und Strichstärken. Beim Vergrößern berechnet der Rechner jede Kante exakt neu – darum skaliert eine Vektorgrafik <strong>völlig verlustfrei</strong> und bleibt bei jedem Zoom scharf.</p>
<div class="example"><strong>Beispiel:</strong> Für das Schulfest entstehen zwei Dateien: Das Gruppenfoto vor dem Pausenhof hat Tausende feine Farbverläufe in Gesichtern und Bäumen – es muss eine <strong>Pixelgrafik</strong> sein. Der <strong>Grundrissplan</strong> des Schulhauses für die Gäste besteht aus klaren Wänden, Türen und Raumnummern – als <strong>Vektorgrafik</strong> bleibt er sowohl auf dem Handy als auch als großes Wandplakat gestochen scharf.</div>
<div class="merke"><strong>Merke:</strong> Pixelgrafik speichert feste Bildpunkte (ideal für Fotos, treppig bei starkem Zoom). Vektorgrafik speichert mathematische Objekte (ideal für Pläne, Logos und Schriften, verlustfrei skalierbar).</div>`,
      rule: "Pixelgrafik = Punktraster (Fotos, Treppeneffekt bei Zoom) · Vektorgrafik = geometrische Objekte (Pläne/Logos, beliebig scharf skalierbar)",
      terms: [
        ["Pixelgrafik", "Regelmäßiges Raster aus Bildpunkten (Pixeln)", "Ideal für Fotos mit weichen Farbverläufen"],
        ["Vektorgrafik", "Geometrische Objekte mit mathematischer Beschreibung", "Verlustfrei vergrößerbar ohne Treppeneffekt"],
      ],
      quiz: [
        "Warum entstehen bei einer stark vergrößerten Vektorgrafik keine Treppeneffekte?",
        "Die mathematisch beschriebenen Objekte werden bei jeder Größe exakt neu berechnet",
        "Die Vektorgrafik speichert schon vorab unendlich viele winzige Pixel",
        "Weil der Bildschirm bei Vektorgrafiken keine Pixel mehr besitzt",
        "Weil nur Koordinaten, Formen und Längen gespeichert werden, zeichnet das System Linien und Kurven für jeden Zoom neu.",
      ],
      lab: grafikZoomLab,
      exercises: [
        cases(
          "grafikart-beurteilen",
          [
            cc(
              "Du erstellst den Grundrissplan eures Klassenzimmers mit Tischen, Fenstern und Maßen. Welche Grafikart eignet sich besser?",
              "Vektorgrafik",
              ["Pixelgrafik mit kleinem Raster", "Eine reine Audiodatei"],
              "Ein Grundriss besteht aus Linien, Rechtecken und Texten und muss auf jedem Ausdruck scharf bleiben.",
              "Aus welchen Elementen besteht ein Grundriss?",
            ),
            cc(
              "Du fotografierst auf der Klassenfahrt eine Berglandschaft mit Wolken und Spiegelung im See. Welche Grafikart passt?",
              "Pixelgrafik",
              ["Nur drei Vektor-Rechtecke", "Eine Baumstruktur ohne Bilder"],
              "Natürliche Fotos mit feinen Farb- und Lichtverläufen lassen sich realistisch nur als Pixelraster erfassen.",
              "Wie speichert eine Kamera echte Fotos?",
            ),
            cc(
              "Ein Verein druckt sein Wappen auf Briefpapier (2 cm) und auf eine Turnhallen-Fahne (3 m). Warum ist hier eine Vektorgrafik überlegen?",
              "Sie lässt sich ohne Unschärfe oder Treppeneffekte beliebig vergrößern.",
              ["Weil Pixelgrafiken nicht gedruckt werden dürfen.", "Weil Vektorgrafiken immer automatisch blinken."],
              "Mathematische Formen skalieren verlustfrei von ganz klein bis riesig.",
              "Denke an den Größenunterschied von 2 cm zu 3 m.",
            ),
          ],
          [
            cc(
              "Auf dem Schulplakat ist das Logo an schrägen Kanten treppenförmig ausgefranst. Was ist wahrscheinlich passiert?",
              "Das Logo wurde als kleine Pixelgrafik eingefügt und stark vergrößert.",
              ["Man hat versehentlich Vektorgrafik statt Pixelgrafik verwendet.", "Das Papier war falsch herum eingelegt."],
              "Treppeneffekte beim Vergrößern sind das typische Zeichen eines zu grob gewählten Pixelrasters.",
              "Welches Grafikformat bekommt beim Zoomen Treppeneffekte?",
            ),
            cc(
              "Warum ist es nicht sinnvoll, ein echtes Porträtfoto Punkt für Punkt mit Vektor-Kreisen und Rechtecken nachbauen zu wollen?",
              "Millionen feinste Farbnuancen von Haut und Haaren lassen sich viel natürlicher im Pixelraster als in einzelnen Geometrieformen beschreiben.",
              ["Weil man Kreise in keinem Programm färben kann.", "Weil Vektorgrafiken niemals Rechtecke enthalten."],
              "Jedes Verfahren hat seinen Bereich: Vektoren für klare Formen, Pixel für komplexe reale Aufnahmen.",
              "Vergleiche Aufwand und Bildwirkung bei einem echten Foto.",
            ),
            cc(
              "Du möchtest in einem schulischen Lageplan einzelne Klassenzimmer nachträglich breiter ziehen, ohne dass Nachbarräume verschwimmen. Warum hilft dir eine Vektorgrafik?",
              "Jeder Raum ist ein eigenes bearbeitbares Objekt mit Koordinaten und Breite.",
              ["Weil in einer Vektorgrafik nur die Farben, aber keine Formen gespeichert werden.", "Weil man nur ein einzelnes Pixel verschieben muss."],
              "Objektorientierung erlaubt es, gezeichnete Formen jederzeit exakt nachzujustieren.",
              "Sind Objekte unabhängig oder zu einem festen Bild verschmolzen?",
            ),
          ],
        ),
        {
          id: "pixel-raster-anzahl",
          make(rng, level) {
            const w = rng.int(8, 20) * 2;
            const h = rng.int(6, 15) * 2;
            const px = w * h;
            if (level === 1) {
              return {
                prompt: `Ein kleines Symbol liegt als Pixelgrafik vor. Das Raster ist <strong>${w} Pixel</strong> breit und <strong>${h} Pixel</strong> hoch. Aus wie vielen Bildpunkten (Pixeln) besteht das gesamte Bild?`,
                given: [`Breite = ${w} Pixel`, `Höhe = ${h} Pixel`],
                formulaHint: "Pixelanzahl = Breite · Höhe",
                fields: [
                  withSlips(
                    numberField("Pixelanzahl =", px, "Pixel"),
                    [w + h, "Multipliziere Breite und Höhe miteinander, statt sie zu addieren."],
                    [2 * (w + h), "Du hast den Umfang berechnet, nicht die Zahl aller Bildpunkte."],
                  ),
                ],
                steps: [
                  `Jede der ${h} Zeilen enthält ${w} Bildpunkte.`,
                  `Multipliziere: ${w} · ${h} = ${fmt(px, 0)}`,
                  `<strong>${fmt(px, 0)} Pixel</strong>`,
                ],
              };
            }
            const factorW = 2;
            const factorH = 2;
            const neuPx = w * factorW * (h * factorH);
            return {
              prompt: `Eine Pixelgrafik mit <strong>${w} × ${h} Pixeln</strong> wird für einen größeren Ausdruck in der Breite verdoppelt und in der Höhe verdoppelt. Wie viele Bildpunkte muss das neue Raster insgesamt speichern?`,
              given: [],
              fields: [
                withSlips(
                  numberField("Neue Pixelanzahl =", neuPx, "Pixel"),
                  [2 * px, "Achtung: Breite UND Höhe wurden verdoppelt – dadurch vervierfacht sich die Pixelzahl."],
                  [px, "Das war die alte Pixelzahl vor der Verdopplung von Breite und Höhe."],
                ),
              ],
              steps: [
                `Neue Breite: 2 · ${w} = ${w * 2} Pixel · Neue Höhe: 2 · ${h} = ${h * 2} Pixel.`,
                `Gesamtzahl: ${w * 2} · ${h * 2} = ${fmt(neuPx, 0)} (viermal so viele wie vorher).`,
                `<strong>${fmt(neuPx, 0)} Pixel</strong>`,
              ],
            };
          },
        },
      ],
    }),

    lesson(STAGE_ID, "2.1", 5, {
      id: "inf6-vektorgrafik-ebenen",
      title: "Vektorgrafikdokumente: Objekte, Gruppen und Ebenen",
      subtitle: "Klassenmodell des Grafikdokuments, Ebenenreihenfolge und Gruppieren beherrschen",
      why: "Wenn beim Zeichnen ein Text plötzlich verschwindet oder sich beim Verschieben eines Logos alle Einzelteile auseinanderziehen, fehlen genau zwei Techniken: Ebenen und Gruppieren.",
      html: `<p>Ein Vektorgrafikdokument lässt sich mit festen Klassen sauber modellieren: Das <strong>GRAFIKDOKUMENT</strong> enthält über eine Enthält-Beziehung geometrische und Textobjekte der Klassen <strong>RECHTECK</strong> (mit der Sonderform <strong>QUADRAT</strong>, wenn Breite gleich Höhe ist), <strong>ELLIPSE</strong> (mit der Sonderform <strong>KREIS</strong>), <strong>LINIE</strong> und <strong>TEXTFELD</strong>.</p>
<p>In Vektorgrafiksoftware liegen Objekte wie durchsichtige Folien übereinander – das bestimmt die <strong>Anordnung der Ebenen</strong>. Liegt ein ausgefülltes Rechteck weiter vorne als ein Textfeld, verdeckt es den Text. Mit Befehlen wie <em>„in den Vordergrund“</em> oder <em>„eine Ebene nach hinten“</em> korrigierst du diese Reihenfolge. Und damit aus mehreren Einzelteilen – etwa Rechteck, Kreis und Text – ein festes Bauteil wird, markierst du sie und wählst <strong>Gruppieren</strong>: Dann verschiebst und vergrößerst du alle zusammen ohne Verrutschen.</p>
<div class="example"><strong>Beispiel:</strong> Maja zeichnet ein Namensschild aus einem ausgefüllten blauen <code>RECHTECK</code> und einem <code>TEXTFELD</code>. Sie fügt zuerst das Textfeld ein und danach das Rechteck – prompt ist der Text weg! Sie wählt das Rechteck an und klickt auf <em>„in den Hintergrund“</em>. Danach markiert sie Rechteck und Textfeld zusammen und drückt <strong>Gruppieren</strong>.</div>
<div class="merke"><strong>Merke:</strong> Ein Vektorgrafikdokument enthält RECHTECK/QUADRAT, ELLIPSE/KREIS, LINIE und TEXTFELD. Ebenen regeln, was vorne liegt; Gruppieren verbindet Objekte zu einer gemeinsamen Einheit.</div>`,
      rule: "GRAFIKDOKUMENT enthält RECHTECK/QUADRAT, ELLIPSE/KREIS, LINIE, TEXTFELD · Ebenen = Vorne/Hinten · Gruppieren = gemeinsam bewegen",
      terms: [
        ["Klassen & Sonderformen", "<code>QUADRAT</code> ist ein <code>RECHTECK</code> mit gleichen Seiten · <code>KREIS</code> ist eine gleichmäßige <code>ELLIPSE</code>", "Enthalten in GRAFIKDOKUMENT"],
        ["Ebenen & Gruppieren", "Ebene steuert Überdeckung · Gruppieren verbindet Objekte vorübergehend zu einem Ganzen", "Lässt sich auch wieder aufheben"],
      ],
      quiz: [
        "Ein neu gezeichnetes, ausgefülltes Rechteck verdeckt plötzlich ein bereits vorhandenes Textfeld. Wie machst du den Text wieder sichtbar?",
        "Das Textfeld eine Ebene nach vorne (oder das Rechteck nach hinten) schieben",
        "Die beiden Objekte sofort gruppieren",
        "Das Textfeld als Pixelgrafik speichern",
        "Gruppieren erhält die Reihenfolge und würde die Verdeckung nicht lösen; erst die Änderung der Ebene holt das Textfeld nach vorne.",
      ],
      lab: vektorEbenenLab,
      exercises: [
        cases(
          "vektor-ebenen-gruppen",
          [
            cc(
              "Du hast ein Haus aus fünf Einzelteilen (Rechteck, Dreieck, Linie, zwei Quadrate) gezeichnet und möchtest das ganze Haus gemeinsam an den rechten Rand schieben. Was spart Fehler?",
              "Alle Teile markieren und gruppieren",
              ["Jedes Objekt einzeln in den Hintergrund schieben", "Das Dokument sofort schließen"],
              "Durch Gruppieren bewegen sich alle zugehörigen Objekte gemeinsam im gleichen Abstand.",
              "Welche Funktion hält mehrere Objekte zusammen?",
            ),
            cc(
              "Was legt die Ebenenreihenfolge in einem Vektorgrafikdokument fest?",
              "Welches Objekt im Vordergrund und welches dahinter liegt, wenn sie sich überschneiden",
              ["Wie viele Wörter das Textfeld enthalten darf", "Mit welchem Programm die Datei geöffnet wird"],
              "Objekte auf vorderen Ebenen überdecken Objekte auf hinteren Ebenen.",
              "Wie gestapelte Folien übereinander.",
            ),
            cc(
              "Kann man eine Gruppierung in Vektorgrafiksoftware auch wieder rückgängig machen, um ein Einzelteil zu färben?",
              "Ja, über „Gruppierung aufheben“",
              ["Nein, gruppierte Objekte verschmelzen dauerhaft zu einem Foto", "Nur indem man das gesamte Grafikdokument neu anlegt"],
              "Vektorobjekte behalten ihre Selbstständigkeit innerhalb der Gruppe.",
              "Bleiben die einzelnen Objekte im Vektordokument erhalten?",
            ),
          ],
          [
            cc(
              "In einem Verkehrszeichen-Entwurf siehst du den weißen Querbalken nicht, obwohl er in der Objektliste steht. Der rote Kreis hat „füllfarbe = rot“. Was ist die Ursache?",
              "Der ausgefüllte rote Kreis liegt auf einer vorderen Ebene vor dem weißen Querbalken.",
              ["Der weiße Querbalken hat keine Ebenen-Eigenschaft.", "Weil Kreis und Rechteck sich gegenseitig löschen."],
              "Liegt eine deckende Fläche darüber, verschwindet das dahinter liegende Objekt optisch.",
              "Prüfe Überdeckung und Ebenenreihenfolge.",
            ),
            cc(
              "Warum verschiebt man vor dem Gruppieren zwei kleine Augen-Kreise auf einem Comicgesicht besser zuerst genau an die richtige Stelle – oder hebt danach noch einmal auf?",
              "Weil man in einer bestehenden Gruppe sonst meist alle Objekte gemeinsam verschiebt statt nur ein einzelnes.",
              ["Weil Kreise nie zu einer Gruppe gehören dürfen.", "Weil beim Gruppieren automatisch ein Textfeld gelöscht wird."],
              "Gruppieren bündelt Aktionen auf alle Elemente der Gruppe.",
              "Wie verhalten sich Elemente innerhalb einer aktiven Gruppe?",
            ),
            cc(
              "Ein Freund meint: „Mein Plakat ist fertig – jetzt füge ich noch eine unsichtbare Linie über alle Objekte in Ebene 1 ein, damit alles verdeckt bleibt.“ Warum ändert das die Sichtbarkeit nicht?",
              "Nur ausgefüllte Flächen verdecken andere Objekte; eine dünne Linie lässt den Bereich daneben sichtbar.",
              ["Weil Linien in der Informatik gar keine Objekte sind.", "Weil Linien automatisch hinter jedem Rechteck liegen."],
              "Entscheidend für das Verdecken sind Position, Größe und ob ein Objekt deckend gefüllt ist.",
              "Wann verdeckt ein Objekt ein anderes?",
            ),
          ],
        ),
        cases(
          "vektor-klassenmodell",
          [
            cc(
              "Welche Klasse bildet im Klassendiagramm die gesamte Zeichenfläche ab, in der Rechtecke, Ellipsen und Linien liegen?",
              "GRAFIKDOKUMENT",
              ["ZEICHEN", "FOLIE"],
              "GRAFIKDOKUMENT ist die umfassende Dokumentklasse der Vektorgrafik.",
              "Suche die Klasse für das Gesamtdokument.",
            ),
            cc(
              "Welches Attribut besitzt zwar ein RECHTECK, nicht aber eine mathematisch dünne LINIE?",
              "füllfarbe",
              ["linienfarbe", "strichstärke"],
              "Nur geschlossene Flächen (wie Rechteck, Quadrat, Ellipse, Kreis) haben einen Innenraum zum Füllen.",
              "Kann man das Innere einer geraden Linie ausfüllen?",
            ),
            cc(
              "Wie hängen die Klassen QUADRAT und RECHTECK geometrisch zusammen?",
              "Ein QUADRAT ist eine Sonderform des RECHTECKs mit gleich langen Seiten.",
              ["Ein RECHTECK hat fünf Ecken, ein QUADRAT vier.", "Sie haben nichts miteinander zu tun."],
              "Ist bei einem Rechteck breite = höhe, entsteht ein Quadrat.",
              "Vergleiche Seitenlängen.",
            ),
          ],
          [
            cc(
              "Modellierst du ein Stoppschild mit weißem Text in einem roten KREIS auf einer GRAFIKDOKUMENT-Fläche: Welche Objekte brauchst du mindestens?",
              "Ein GRAFIKDOKUMENT, darin mindestens einen KREIS (oder ELLIPSE) und ein TEXTFELD",
              ["Nur ein TEXTDOKUMENT mit Absätzen", "Nur ein AUDIO-Objekt"],
              "Die grafische Fläche und die Beschriftung werden als KREIS und TEXTFELD im GRAFIKDOKUMENT zusammengefasst.",
              "Welche Klassen stammen aus der Vektorgrafik-Welt?",
            ),
            cc(
              "Welchen Unterschied hat ein TEXTFELD im Grafikdokument gegenüber einer einfachen LINIE?",
              "Ein TEXTFELD besitzt Textinhalt und Schriftattribute wie schriftart und schriftgröße.",
              ["Ein TEXTFELD hat keine Position x und y.", "Eine LINIE kann nicht auf einer Ebene verschoben werden."],
              "Textfelder kombinieren einen positionierten Rahmen mit Text- und Zeichenattributen.",
              "Was steckt zusätzlich in einem Textfeld?",
            ),
            cc(
              "Auf dem Klassenmodell einer Gruppenarbeit fehlt die Verbindung von GRAFIKDOKUMENT zu ELLIPSE. Welche Beziehung ergänzt du?",
              "enthält (GRAFIKDOKUMENT → ELLIPSE)",
              ["ist gleich (ELLIPSE → TEXTFELD)", "löscht (ELLIPSE → GRAFIKDOKUMENT)"],
              "Alle platzierten Formen stehen in einer Enthält-Beziehung zum Grafikdokument.",
              "Welche Beziehung verbindet Dokument und Formen?",
            ),
          ],
        ),
      ],
    }),

    lesson(STAGE_ID, "2.1", 6, {
      id: "inf6-textdokumente",
      title: "Textdokumente: Klassen, Attribute und Layoutobjekte",
      subtitle: "TEXTDOKUMENT, ABSATZ und ZEICHEN unterscheiden sowie Bilder und Tabellen einsetzen",
      why: "Wer Zeilen durch fünfmaliges Drücken der Leertaste einrückt oder Tabellen aus Leerzeichen baut, verliert bei der kleinsten Textänderung das gesamte Layout.",
      html: `<p>Textverarbeitungsprogramme strukturieren jedes Schriftstück hierarchisch mithilfe von drei Grundklassen und der <strong>Enthält-Beziehung</strong>: Ein <strong>TEXTDOKUMENT</strong> enthält beliebig viele <strong>ABSÄTZE</strong>, und jeder <strong>ABSATZ</strong> enthält einzelne <strong>ZEICHEN</strong> (Buchstaben, Ziffern, Satzzeichen, Leerzeichen).</p>
<p>Jede Klasse verwaltet genau passende Attribute: Zur Klasse <strong>ZEICHEN</strong> gehören <em>Schriftart</em>, <em>Schriftgröße</em>, <em>Schriftfarbe</em> und <em>Schriftschnitt</em> (fett, kursiv). Zur Klasse <strong>ABSATZ</strong> gehören <em>Ausrichtung</em> (linksbündig, zentriert, rechtsbündig, Blocksatz), <em>Zeilenabstand</em>, <em>Abstand vor/nach</em> und <em>Einzüge</em>. Zum <strong>TEXTDOKUMENT</strong> gehören globale Angaben wie <em>Seitenränder</em> und <em>Papierformat</em>. Zur besseren Veranschaulichung und Ordnung fügst du außerdem <strong>Bilder</strong> und strukturierte <strong>Tabellen</strong> als eigene Objekte ein.</p>
<div class="example"><strong>Beispiel:</strong> Du klickst mitten in einen Absatz – ohne ein Wort zu markieren – und stellst den <strong>Zeilenabstand auf 1,5</strong>. Sofort verändert sich der <em>ganze Absatz</em>, weil Zeilenabstand ein Attribut der Klasse <strong>ABSATZ</strong> ist. Für ein Wort in roter Schrift markierst du dagegen gezielt Zeichen und änderst das ZEICHEN-Attribut <code>farbe</code>.</div>
<div class="merke"><strong>Merke:</strong> TEXTDOKUMENT (Seitenränder) → enthält → ABSATZ (Ausrichtung, Zeilenabstand, Einzug) → enthält → ZEICHEN (Schriftart, Schriftgröße, Farbe, fett). Bilder und Tabellen werden als eigene Objekte eingefügt.</div>`,
      rule: "TEXTDOKUMENT enthält ABSATZ (Ausrichtung, Zeilenabstand, Einzug) · ABSATZ enthält ZEICHEN (Schriftart, Größe, Farbe, Schnitt)",
      terms: [
        ["Klasse ZEICHEN", "schriftart · schriftgröße · schriftfarbe · schriftschnitt (fett/kursiv)", "Wirkt nur auf markierte Zeichen"],
        ["Klasse ABSATZ", "ausrichtung · zeilenabstand · einzug · absatzabstand", "Wirkt immer auf den ganzen Absatz bis zur Enter-Taste"],
        ["Bilder & Tabellen", "Eigene Layoutobjekte im Textdokument für Vergleiche und Veranschaulichung", "Nie durch Leerzeichen ersetzen"],
      ],
      quiz: [
        "Zu welcher Objektebene eines Textdokuments gehören die Attribute „Zeilenabstand“ und „Ausrichtung“?",
        "Zur Klasse ABSATZ",
        "Zur Klasse ZEICHEN",
        "Nur zu eingefügten Bildern",
        "Zeilenabstand und Ausrichtung wirken niemals auf einzelne Buchstaben, sondern immer auf einen vollständigen Absatz.",
      ],
      lab: textdokumentLab,
      exercises: [
        cases(
          "text-attribute-klassen",
          [
            cc(
              "Zu welcher Objektebene in der Textverarbeitung gehört das Attribut „Zeilenabstand“ (z. B. 1,5-fach) bzw. „Ausrichtung“ (z. B. Blocksatz)?",
              "Zur Klasse ABSATZ",
              ["Zur Klasse ZEICHEN", "Zur Klasse GRAFIKDOKUMENT"],
              "Zeilenabstand und Ausrichtung sind typische Eigenschaften eines gesamten Absatzes.",
              "Kann ein einzelner Buchstabe mitten im Satz zentriert werden?",
            ),
            cc(
              "Welches Attribut veränderst du auf Ebene der Klasse ZEICHEN?",
              "Schriftfarbe oder Schriftschnitt (fett / kursiv)",
              ["Papierformat A4", "Seitenränder links und rechts"],
              "Schriftart, Schriftgröße, Farbe und Schnitt betreffen einzelne Zeichen.",
              "Was lässt sich schon für ein einziges Wort verändern?",
            ),
            cc(
              "Welche Enthält-Kette beschreibt ein einfaches Textdokument richtig?",
              "TEXTDOKUMENT → enthält → ABSATZ → enthält → ZEICHEN",
              ["ZEICHEN → enthält → ABSATZ → enthält → TEXTDOKUMENT", "ABSATZ → enthält → TEXTDOKUMENT → enthält → FOLIE"],
              "Das Dokument gliedert sich in Absätze, und jeder Absatz besteht aus Zeichen.",
              "Sortiere vom größten Baustein zum kleinsten.",
            ),
          ],
          [
            cc(
              "Du klickst nur an den Anfang eines dreizeiligen Absatzes, ohne etwas zu markieren, und wählst „zentriert“. Warum rückt der gesamte Block in die Mitte?",
              "Weil die Ausrichtung ein Attribut der Klasse ABSATZ ist und automatisch auf den aktuellen Absatz wirkt.",
              ["Weil immer das ganze Dokument zentriert wird.", "Weil dein Computer alle Leerzeichen gelöscht hat."],
              "Für Absatzattribute genügt der Cursor im gewünschten Absatz.",
              "Welche Klasse speichert die Ausrichtung?",
            ),
            cc(
              "Tim möchte 10 Zeilen Text um 2 cm einrücken und drückt dafür am Anfang jeder Zeile zehnmal die Leertaste. Warum zerfällt dieses Layout bei kleineren Schriftgrößen?",
              "Leerzeichen sind ZEICHEN fester Breite statt eines sauberen ABSATZ-Einzugs; ändert sich der Umbruch, wandern die Leerzeichen mitten in den Text.",
              ["Weil die Leertaste in Textdokumenten überhaupt nicht gespeichert wird.", "Weil man Textdokumente nie kleiner drucken darf."],
              "Für Einrückungen ändert man das ABSATZ-Attribut „einzug“.",
              "Vergleiche das Einfügen von Zeichen mit dem Setzen eines Absatz-Attributs.",
            ),
            cc(
              "Wie verbesserst du in einem Referat einen unübersichtlichen Vergleich von drei Säugetier-Merkmalen sauber?",
              "Durch Ändern von Überschrift-Attributen (fett, größere Schrift) und das Einfügen einer echten Tabelle",
              ["Durch Hinzufügen von fünfzig Leerzeilen hintereinander", "Durch Färben jedes zweiten Buchstabens in grellem Gelb"],
              "Klare Schrift-Hierarchie und echte Tabellen ordnen Informationen verlässlich.",
              "Welches Objekt ordnet Zeilen und Spalten sauber?",
            ),
          ],
        ),
        cases(
          "text-objekt-praxis",
          [
            cc(
              "Welches Attribut gehört eindeutig zum gesamten TEXTDOKUMENT (und nicht zu einem einzelnen Zeichen)?",
              "Seitenränder",
              ["Schriftfarbe eines Wortes", "Kursivdruck einer Zahl"],
              "Seitenränder bestimmen den freien Rand auf den Seiten des Textdokuments.",
              "Was gilt für die Seiten des Dokuments?",
            ),
            cc(
              "Wann endet in der Textverarbeitung ein Objekt der Klasse ABSATZ?",
              "Bei einer Absatzschaltung (Drücken der Eingabetaste / Enter)",
              ["Nach jedem einzelnen Leerzeichen", "Sobald ein fettgedrucktes Wort folgt"],
              "Auch wenn sich Zeichenformate ändern, bleibt derselbe Absatz bis zur Enter-Taste erhalten.",
              "Welche Taste schließt einen Absatz ab?",
            ),
            cc(
              "Was verbessert die Lesbarkeit längerer Texte im Sinne von „Ändern von Attributwerten“ sinnvoll?",
              "Angemessene Schriftgröße, übersichtlicher Zeilenabstand und klare Hervorhebungen wichtiger Begriffe",
              ["Zehn verschiedene bunte Schriftarten in einem einzigen Absatz", "Sehr kleine Schrift 6 pt bei grellem Hintergrund"],
              "Gezieltes Ändern von Attributwerten soll Übersicht und Lesbarkeit steigern.",
              "Was erleichtert dem Leser die Orientierung?",
            ),
          ],
          [
            cc(
              "In einem Textdokument steckt ein Stundenplan aus Wochentagen und Fächern. Warum ist eine echte TABELLE dem Ausrichten mit Leerzeichen oder Tabstops deutlich überlegen?",
              "Zellen halten Spalten auch dann ausgerichtet, wenn Fachnamen länger werden oder die Schriftgröße geändert wird.",
              ["Weil eine Tabelle nur aus Grafiken ohne Buchstaben besteht.", "Weil man Text in einer Tabelle nicht mehr speichern kann."],
              "Tabellenobjekte speichern Struktur in Zeilen und Spalten unabhängig vom genauen Textinhalt.",
              "Was passiert beim Einfügen eines längeren Fachnamens?",
            ),
            cc(
              "Ein Foto wird in einen Bericht eingefügt und verdeckt dort wichtigen Text. Welches Objekt-Attribut des eingefügten Bildes passt du an?",
              "Textumfluss (Textumbruch) und Position/Größe des Bildobjekts",
              ["Die Schriftfarbe aller Überschriften", "Die Dateierweiterung von .docx in .txt"],
              "Der Textumfluss legt fest, wie Absätze um das eingefügte Bild herumfließen.",
              "Welches Layoutmerkmal regelt das Zusammenspiel von Bild und Fließtext?",
            ),
            cc(
              "Auf der Objektkarte von absatz2 stehen „ausrichtung = linksbündig“, „zeilenabstand = 1,5“. Welcher Aufruf in Punktnotation wechselt ihn auf Blocksatz?",
              "absatz2.ausrichtung = „Blocksatz“",
              ["zeichen.ausrichtung = „Blocksatz“", "TEXTDOKUMENT.fett = wahr"],
              "Objektname absatz2, Punkt, Attribut ausrichtung, neuer Wert „Blocksatz“.",
              "Nutze Punktnotation am Objekt absatz2.",
            ),
          ],
        ),
      ],
    }),

    lesson(STAGE_ID, "2.1", 7, {
      id: "inf6-multimediadokumente",
      title: "Multimediadokumente: Folien, Medien und Modi",
      subtitle: "MULTIMEDIADOKUMENT, FOLIE, BILD und AUDIO modellieren sowie Bearbeitungs- und Vorführmodus trennen",
      why: "Ein Referat soll Bild, Text, vielleicht einen kurzen Ton und klare Schritte zeigen – und beim Vortrag darf keine Werkzeugleiste den Bildschirm blockieren.",
      html: `<p>Ein <strong>Multimediadokument</strong> (Präsentation) verbindet verschiedene Darstellungsformen wie Text, Bild, Grafik und Audio oder Video. Im objektorientierten Modell enthält das <strong>MULTIMEDIADOKUMENT</strong> einzelne <strong>FOLIEn</strong>, und jede <strong>FOLIE</strong> enthält unter anderem Objekte der Klassen <strong>TEXTFELD</strong>, <strong>BILD</strong> und <strong>AUDIO</strong>.</p>
<p>Bei Präsentationsprogrammen unterscheidet man zwei wichtige Arbeitsweisen: Im <strong>Bearbeitungsmodus</strong> entwirfst du die Folien, fügst Medien ein und änderst Attribute. Im <strong>Vorführmodus</strong> erscheint die Präsentation im Vollbild für das Publikum. Erst dort werden hinterlegte <strong>Animationen</strong> über Methoden wie <code>aufzaehlung.einblenden()</code> oder <code>vogelruf.abspielen()</code> per Klick nacheinander ausgeführt.</p>
<div class="example"><strong>Beispiel:</strong> Lukas baut eine Folie über heimische Singvögel: Sie enthält <code>titel : TEXTFELD</code>, <code>amselBild : BILD</code> und <code>gesang : AUDIO</code>. Während des Entwerfens klickt er Testweise auf den Text – nichts blendet ein, denn er ist noch im <strong>Bearbeitungsmodus</strong>. Nach dem Umschalten in den <strong>Vorführmodus</strong> löst jeder Klick gezielt den nächsten Auftritt aus.</div>
<div class="merke"><strong>Merke:</strong> MULTIMEDIADOKUMENT → enthält → FOLIE → enthält → TEXTFELD / BILD / AUDIO. Bearbeitungsmodus zum Gestalten, Vorführmodus für Vollbild und Animationen.</div>`,
      rule: "MULTIMEDIADOKUMENT enthält FOLIE · FOLIE enthält TEXTFELD, BILD, AUDIO · Bearbeitungsmodus (entwerfen) vs. Vorführmodus (vorführen)",
      terms: [
        ["Multimediadokument", "Verbindet mehrere Medienarten (Text, Bild, Audio) auf einzelnen Folien", "Klassen: MULTIMEDIADOKUMENT, FOLIE, BILD, AUDIO"],
        ["Bearbeitungs- vs. Vorführmodus", "Bearbeiten: Werkzeuge und Folienliste · Vorführen: Vollbild ohne Menüs, Animationen laufen ab", "Umschalten über Bildschirmpräsentation starten"],
      ],
      quiz: [
        "Wann werden eingestellte Objekt-Animationen (z. B. schrittweises Einblenden beim Klicken) tatsächlich abgespielt?",
        "Im Vorführmodus",
        "Im Bearbeitungsmodus beim Verschieben des Textfeldes",
        "Nur beim Ausdrucken auf Papier",
        "Im Bearbeitungsmodus richtest du Objekte und Effekte ein; vorgeführt wird im Vollbild des Vorführmodus.",
      ],
      lab: multimediaLab,
      exercises: [
        cases(
          "multimedia-klassen-modi",
          [
            cc(
              "Welche Klasse enthält in einer Präsentation unmittelbar die einzelnen BILD- und AUDIO-Objekte?",
              "FOLIE",
              ["ZEICHEN", "ORDNER"],
              "Das MULTIMEDIADOKUMENT enthält FOLIE-Objekte, und jede FOLIE enthält Textfelder, Bilder oder Audios.",
              "Worauf werden Texte und Medien in einer Präsentation abgelegt?",
            ),
            cc(
              "In welchem Modus siehst du die Folienübersicht am Rand sowie Symbole zum Schriftändern und Einfügen?",
              "Im Bearbeitungsmodus",
              ["Im Vorführmodus", "Auf einem gedruckten Handzettel"],
              "Der Bearbeitungsmodus stellt alle Werkzeuge zum Erstellen und Ändern bereit.",
              "Wo gestaltest du die Folien?",
            ),
            cc(
              "Welches Objekt ermöglicht auf einer Folie das Abspielen einer Vogelstimme während des Vortrags?",
              "Ein Objekt der Klasse AUDIO",
              ["Ein Objekt der Klasse RECHTECK", "Ein Objekt der Klasse ZEICHEN"],
              "Klang- und Tonaufnahmen werden über AUDIO-Objekte in die Folie eingebunden.",
              "Welche Klasse steht für Ton?",
            ),
          ],
          [
            cc(
              "Bei der Probe im Klassenzimmer startet die Schülerin ihren Vortrag direkt im Bearbeitungsmodus. Welche zwei Nachteile fallen dem Publikum sofort auf?",
              "Man sieht ablenkende Werkzeugleisten sowie die kommenden Folien am Rand, und Klick-Animationen laufen nicht ab.",
              ["Die Datei wird automatisch gelöscht.", "Alle Bilder verwandeln sich sofort in reine Zahlen."],
              "Darum wechselt man zu Beginn jedes Vortrags gezielt in den Vorführmodus.",
              "Was stört das Publikum im Bearbeitungsmodus?",
            ),
            cc(
              "Ein Referat über das Sonnensystem zeigt zuerst eine Frage im TEXTFELD und erst nach dem Klick des Redners das dazugehörige BILD. Welche Aussage stimmt?",
              "Das schrittweise Einblenden des BILD-Objekts ist eine gezielte Animation per Methode im Vorführmodus.",
              ["Animationen funktionieren nur ohne Textfelder.", "Dazu braucht man zehn identische Folien mit demselben Inhalt."],
              "Durch Animationen auf derselben Folie deckt man Informationen passend zum Vortrag auf.",
              "Wie blendet man Objekte auf einer Folie nacheinander ein?",
            ),
            cc(
              "Vergleiche ein reines TEXTDOKUMENT mit einem MULTIMEDIADOKUMENT aus objektorientierter Sicht.",
              "Das Textdokument gliedert fortlaufenden Text in ABSÄTZE und ZEICHEN, das Multimediadokument ordnet Text, Bild und Ton seitenweise auf FOLIEn an.",
              ["Ein Textdokument darf grundsätzlich niemals Bilder enthalten.", "Ein Multimediadokument hat niemals Textfelder."],
              "Jeder Dokumenttyp hat die zu seinem Einsatz passende Klassenhierarchie.",
              "Schau auf die typischen Containerklassen beider Dokumentarten.",
            ),
          ],
        ),
        cases(
          "multimedia-animation-praxis",
          [
            cc(
              "Was macht in Punktnotation der Aufruf „hinweisBox.einblenden()“ im Vorführmodus?",
              "Er ruft eine Methode auf, die das Objekt hinweisBox sichtbar werden lässt.",
              ["Er speichert die gesamte Festplatte.", "Er ändert das Papierformat des Druckers."],
              "Methoden steuern unter anderem das Animieren einzelner Folienobjekte.",
              "einblenden() hat runde Klammern — worum handelt es sich?",
            ),
            cc(
              "Warum spricht man beim Zusammenspiel von Text, Foto und Tonspuren von einem „Multi“-mediadokument?",
              "Weil mehrere Medienarten (Text, Bild, Ton) gemeinsam in einem Dokument kombiniert werden.",
              ["Weil jede Präsentation exakt zehn Folien haben muss.", "Weil man nur ein einziges Programm benutzen darf."],
              "Multi-Media bedeutet das Verbinden mehrerer medialer Darstellungsformen.",
              "Zerlege das Wort „Multimedia“.",
            ),
            cc(
              "Auf FOLIE 2 liegen „diagramm1 : BILD“ und „ton1 : AUDIO“. Wer gehört im Klassendiagramm als enthaltendes Element davor?",
              "FOLIE (und darüber MULTIMEDIADOKUMENT)",
              ["ABSATZ (und darunter ZEICHEN)", "KREIS (und darunter LINIE)"],
              "MULTIMEDIADOKUMENT enthält FOLIE, und FOLIE enthält BILD sowie AUDIO.",
              "Ergänze die Enthält-Kette nach oben.",
            ),
          ],
          [
            cc(
              "Während eines Vortrags soll eine kurze Tieraufnahme abgespielt werden, aber erst nachdem zwei Stichpunkte besprochen wurden. Was legst du auf der Folie fest?",
              "Eine sinnvolle Reihenfolge der Animationen: zuerst die Stichpunkte einblenden, danach das AUDIO-Objekt abspielen.",
              ["Den Ton direkt beim Öffnen des Programms im Bearbeitungsmodus starten.", "Die Stichpunkte in winziger 8-pt-Schrift verstecken."],
              "Gezielte Methodenaufrufe und eine klare Animationsreihenfolge halten das Publikum bei der Sache.",
              "In welcher Reihenfolge soll was sichtbar oder hörbar sein?",
            ),
            cc(
              "Was passiert beim Drücken der Escape-Taste (Esc) während des Vorführmodus in den meisten Präsentationsprogrammen?",
              "Man kehrt aus dem Vollbild in den Bearbeitungsmodus zurück.",
              ["Die Folie wird um 180 Grad gedreht.", "Die Schriftfarbe wechselt auf unsichtbar."],
              "Zwischen Vorführen und Bearbeiten lässt sich jederzeit schnell hin- und herschalten.",
              "Wie verlässt man die laufende Bildschirmpräsentation?",
            ),
            cc(
              "Warum ist es praktisch, vor dem Vortrag auf dem Klassenrechner einmal kurz vom Bearbeitungs- in den Vorführmodus zu wechseln und wieder zurück?",
              "Um zu prüfen, ob alle Bilder, Schriften, Animationen und Audioobjekte im Vollbild richtig laufen.",
              ["Weil das Programm sonst gar nicht gespeichert werden darf.", "Weil die Maus nur im Vorführmodus angeschlossen wird."],
              "Ein kurzer Probelauf deckt abgeschnittene Ränder oder fehlende Mediendateien frühzeitig auf.",
              "Was testest du damit vor den Augen der Klasse?",
            ),
          ],
        ),
      ],
    }),
  ],
};
