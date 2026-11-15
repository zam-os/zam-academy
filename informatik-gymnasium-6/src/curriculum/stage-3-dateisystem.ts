import type { LabDefinition, LabValues, Stage } from "../model/types";
import { clamp, esc, H, open, path as svgPath, rect, text, line, circle, W } from "../lab/svg";
import { containmentArrow, treeNode, umlCard } from "../lab/oop-svg";
import { cases, cc, lesson, numberField, textField, withSlips } from "./helpers";

const STAGE_ID = "stage-3-dateisystem";

// ─── Lab 1: Baumdiagramme erkunden ───────────────────────────────────────────

const baumLab: LabDefinition = {
  kind: "inf6-baumstrukturen",
  title: "Baumdiagramm erkunden",
  intro:
    "Stelle die Verzweigungstiefe ein und hebe Wurzel, innere Knoten, Blätter oder einen Pfad farbig hervor.",
  params: [
    {
      key: "beispiel",
      type: "choice",
      label: "Beispielbaum",
      options: [
        { value: 0, label: "Stammbaum (Familie Weber)" },
        { value: 1, label: "Buchgliederung (NT-Heft)" },
      ],
      value: 0,
    },
    {
      key: "tiefe",
      type: "range",
      label: "Verzweigungstiefe",
      unit: "Ebenen",
      min: 1,
      max: 3,
      step: 1,
      value: 1,
    },
    {
      key: "markierung",
      type: "choice",
      label: "Hervorhebung",
      options: [
        { value: 0, label: "Keine Markierung" },
        { value: 1, label: "Wurzel (oberster Knoten)" },
        { value: 2, label: "Innere Knoten (Verzweigungen)" },
        { value: 3, label: "Blätter (Endknoten)" },
        { value: 4, label: "Pfad zum Zielblatt" },
      ],
      value: 0,
    },
  ],
  readouts: [
    {
      key: "knoten",
      label: "Knoten & Kanten",
      emphasis: true,
      compute: (v) => {
        const nodes = v.tiefe === 1 ? 3 : v.tiefe === 2 ? 7 : 11;
        return `${nodes} Knoten · ${nodes - 1} Kanten`;
      },
    },
    {
      key: "blaetter",
      label: "Blätter / Innere Knoten",
      compute: (v) => {
        const leaves = v.tiefe === 1 ? 2 : v.tiefe === 2 ? 4 : 6;
        const inner = (v.tiefe === 1 ? 3 : v.tiefe === 2 ? 7 : 11) - leaves;
        return `${leaves} Blätter · ${inner} ${inner === 1 ? "innerer Knoten" : "innere Knoten"}`;
      },
    },
    {
      key: "pfad",
      label: "Beispielpfad",
      compute: (v) => {
        if (v.beispiel === 0) {
          if (v.tiefe === 1) return "Oma Anna → Mutter Lena (1 Kante)";
          if (v.tiefe === 2) return "Oma Anna → Mutter Lena → Mia (2 Kanten)";
          return "Oma Anna → Mutter Lena → Mia → Tim (3 Kanten)";
        }
        if (v.tiefe === 1) return "NT-Heft → 1 Grafik (1 Kante)";
        if (v.tiefe === 2) return "NT-Heft → 1 Grafik → 1a Vektor (2 Kanten)";
        return "NT-Heft → 1 Grafik → 1a Vektor → Kurve (3 Kanten)";
      },
    },
  ],
  goals: [
    {
      id: "g1",
      text: "Erweitere den Baum auf Tiefe 3 (11 Knoten) und markiere alle Blätter.",
      check: (v) => v.tiefe === 3 && v.markierung === 3,
    },
    {
      id: "g2",
      text: "Verfolge in der Buchgliederung (mindestens Tiefe 2) einen Pfad von der Wurzel bis zum Zielblatt.",
      check: (v) => v.beispiel === 1 && v.tiefe >= 2 && v.markierung === 4,
    },
    {
      id: "g3",
      text: "Lass im Stammbaum mit Tiefe 2 alle inneren Knoten (mit Nachfolgern) anzeigen.",
      check: (v) => v.beispiel === 0 && v.tiefe === 2 && v.markierung === 2,
    },
  ],
  witnesses: {
    g1: { beispiel: 0, tiefe: 3, markierung: 3 },
    g2: { beispiel: 1, tiefe: 2, markierung: 4 },
    g3: { beispiel: 0, tiefe: 2, markierung: 2 },
  },
  view: {
    handles: {
      depthHandle: {
        y: "tiefe",
        drag(point: { x: number; y: number }): Partial<LabValues> {
          const yNorm = clamp((point.y - 60) / 190, 0, 1);
          return { tiefe: clamp(Math.round(1 + yNorm * 2), 1, 3) };
        },
      },
    },
    render(v) {
      const fam = v.beispiel === 0;
      const tiefe = v.tiefe;
      const mark = v.markierung;

      interface TreeItem {
        id: string;
        parent?: string;
        x: number;
        y: number;
        w: number;
        label: string;
        depth: number;
      }

      const allItems: TreeItem[] = [
        { id: "r", x: 250, y: 44, w: 94, label: fam ? "Oma Anna" : "NT-Heft", depth: 0 },
        { id: "a", parent: "r", x: 140, y: 118, w: 96, label: fam ? "Mutter Lena" : "1 Grafik", depth: 1 },
        { id: "b", parent: "r", x: 360, y: 118, w: 96, label: fam ? "Onkel Paul" : "2 Text", depth: 1 },
        { id: "a1", parent: "a", x: 78, y: 196, w: 78, label: fam ? "Mia" : "1a Vektor", depth: 2 },
        { id: "a2", parent: "a", x: 196, y: 196, w: 78, label: fam ? "Leo" : "1b Pixel", depth: 2 },
        { id: "b1", parent: "b", x: 314, y: 196, w: 78, label: fam ? "Jan" : "2a Absatz", depth: 2 },
        { id: "b2", parent: "b", x: 432, y: 196, w: 78, label: fam ? "Eva" : "2b Zeichen", depth: 2 },
        { id: "a1x", parent: "a1", x: 48, y: 274, w: 68, label: fam ? "Tim" : "Kurve", depth: 3 },
        { id: "a1y", parent: "a1", x: 122, y: 274, w: 68, label: fam ? "Nora" : "Ebene", depth: 3 },
        { id: "b1x", parent: "b1", x: 278, y: 274, w: 68, label: fam ? "Ben" : "Einzug", depth: 3 },
        { id: "b1y", parent: "b1", x: 356, y: 274, w: 68, label: fam ? "Lia" : "Schrift", depth: 3 },
      ];

      const visible = allItems.filter((item) => item.depth <= tiefe);
      const childrenSet = new Set(visible.map((i) => i.parent).filter(Boolean));
      const targetId = tiefe === 3 ? "a1x" : tiefe === 2 ? "a1" : "a";
      const pathIds = new Set<string>(["r", "a"]);
      if (tiefe >= 2) pathIds.add("a1");
      if (tiefe >= 3) pathIds.add("a1x");

      const edges = visible
        .filter((item) => item.parent)
        .map((item) => {
          const p = visible.find((x) => x.id === item.parent)!;
          const onPath = mark === 4 && pathIds.has(item.id) && pathIds.has(p.id);
          return svgPath(`M ${p.x} ${p.y + 13} L ${item.x} ${item.y - 13}`, onPath ? "lab-ok-stroke" : "lab-thin", `stroke-width="${onPath ? 3 : 1.5}"`);
        })
        .join("");

      const nodesSvg = visible
        .map((item) => {
          const isRoot = item.depth === 0;
          const isLeaf = !childrenSet.has(item.id);
          const isInner = !isLeaf;
          const kind = isRoot ? "root" : isLeaf ? "leaf" : "folder";
          const active =
            (mark === 1 && isRoot) ||
            (mark === 2 && isInner) ||
            (mark === 3 && isLeaf) ||
            (mark === 4 && pathIds.has(item.id));
          return treeNode(item.x, item.y, item.w, item.label, kind, active || (mark === 4 && item.id === targetId));
        })
        .join("");

      const handleY = 60 + ((tiefe - 1) / 2) * 190;
      const legend =
        mark === 1
          ? "Markiert: genau 1 Wurzel ganz oben"
          : mark === 2
            ? "Markiert: innere Knoten (haben mindestens ein Kind)"
            : mark === 3
              ? "Markiert: Blätter (Endknoten ohne Nachfolger)"
              : mark === 4
                ? "Markiert: eindeutiger Pfad von der Wurzel zum Blatt"
                : "Jede Linie ist eine Kante · genau ein Pfad je Knoten";

      return [
        open("Baumdiagramm erkunden"),
        rect(12, 12, 466, 294, "lab-panel", `rx="10"`),
        edges,
        nodesSvg,
        line(494, 58, 494, 254, "lab-thin"),
        `<g class="lab-handle lab-handle-a" data-handle="depthHandle" role="slider" aria-label="Verzweigungstiefe" aria-valuemin="1" aria-valuemax="3" aria-valuenow="${tiefe}">`,
        circle(494, handleY, 15, "lab-handle-hit"),
        circle(494, handleY, 7, "lab-handle-dot"),
        text(494, handleY - 12, `T${tiefe}`, "lab-text-a", "middle"),
        "</g>",
        text(250, H - 10, legend, "lab-text-muted", "middle"),
        "</svg>",
      ].join("");
    },
  },
};

// ─── Lab 2: Dateisystem als Baum, Objektdiagramm & Klassendiagramm ───────────

const dateisystemOopLab: LabDefinition = {
  kind: "inf6-dateisystem-oop",
  title: "Dateisystem zwischen Dateimanager und OOP",
  intro:
    "Vergleiche denselben Verzeichnisbestand als Baum, als konkretes Objektdiagramm und als abstraktes Klassendiagramm.",
  params: [
    {
      key: "darstellung",
      type: "choice",
      label: "Ansichtsmodus",
      options: [
        { value: 0, label: "Dateimanager-Baum" },
        { value: 1, label: "Objektdiagramm (konkret)" },
        { value: 2, label: "Klassendiagramm (abstrakt)" },
      ],
      value: 0,
    },
    {
      key: "struktur",
      type: "choice",
      label: "Ordnerorganisation",
      options: [
        { value: 0, label: "Flach (alles unsortiert in Schule)" },
        { value: 1, label: "Nach Fächern geordnet (Informatik & Bio)" },
        { value: 2, label: "Mit Unterordner ‚Grafiken‘ in Informatik" },
      ],
      value: 0,
    },
    {
      key: "rekursion",
      type: "choice",
      label: "Enthält-Beziehungen hervorheben",
      options: [
        { value: 0, label: "Aus" },
        { value: 1, label: "Rekursive Ordner-Beziehung zeigen" },
      ],
      value: 0,
    },
  ],
  readouts: [
    {
      key: "ansicht",
      label: "Dargestellte Ebene",
      emphasis: true,
      compute: (v) =>
        v.darstellung === 0
          ? "Dateibaum (Anwendungssicht)"
          : v.darstellung === 1
            ? "Objektdiagramm (konkrete Instanzen)"
            : "Klassendiagramm (ORDNER & DATEI)",
    },
    {
      key: "rekursiv",
      label: "Enthält-Beziehung",
      compute: (v) =>
        v.darstellung === 2
          ? "ORDNER enthält DATEI und rekursiv ORDNER"
          : v.struktur === 0
            ? "Nur Ordner Schule → Dateien direkt"
            : "Ordner enthält Unterordner und Dateien",
    },
    {
      key: "ordnung",
      label: "Übersichtlichkeit",
      compute: (v) =>
        v.struktur === 0
          ? "Unübersichtlich (alles auf einer Ebene)"
          : v.struktur === 1
            ? "Klar nach Fächern gruppiert"
            : "Sauber bis zum Themen-Unterordner gegliedert",
    },
  ],
  goals: [
    {
      id: "g1",
      text: "Bringe die Dateien im Dateimanager-Baum in mindestens Fächer- oder Unterordner-Ordnung.",
      check: (v) => v.darstellung === 0 && v.struktur >= 1,
    },
    {
      id: "g2",
      text: "Betrachte das konkrete Objektdiagramm der tief gegliederten Struktur (mit Unterordner ‚Grafiken‘).",
      check: (v) => v.darstellung === 1 && v.struktur === 2,
    },
    {
      id: "g3",
      text: "Wechsle ins Klassendiagramm und hebe die rekursive Enthält-Beziehung der Klasse ORDNER hervor.",
      check: (v) => v.darstellung === 2 && v.rekursion === 1,
    },
  ],
  witnesses: {
    g1: { darstellung: 0, struktur: 1, rekursion: 0 },
    g2: { darstellung: 1, struktur: 2, rekursion: 0 },
    g3: { darstellung: 2, struktur: 2, rekursion: 1 },
  },
  view: {
    render(v) {
      const mode = v.darstellung;
      const org = v.struktur;
      const hi = v.rekursion === 1;

      if (mode === 0) {
        if (org === 0) {
          return [
            open("Dateimanager-Baum: unsortiert"),
            rect(16, 14, W - 32, H - 34, "lab-panel", `rx="10"`),
            line(260, 62, 95, 146, "lab-thin"),
            line(260, 62, 260, 146, "lab-thin"),
            line(260, 62, 425, 146, "lab-thin"),
            treeNode(260, 48, 124, "Ordner: Schule", "root"),
            treeNode(95, 160, 124, "Plakat.svg", "leaf"),
            treeNode(260, 160, 128, "Referat.odt", "leaf"),
            treeNode(425, 160, 120, "Zelle.png", "leaf"),
            text(260, 224, "Alles im Hauptordner – schnell unübersichtlich!", "lab-text-bad", "middle"),
            text(260, 250, "Beim Wachsen geht der Überblick verloren.", "lab-text-muted", "middle"),
            text(260, H - 10, "Dateien sind stets Blätter (Endknoten) und können nichts enthalten.", "lab-text-muted", "middle"),
            "</svg>",
          ].join("");
        }
        if (org === 1) {
          return [
            open("Dateimanager-Baum: nach Fächern"),
            rect(16, 14, W - 32, H - 34, "lab-panel", `rx="10"`),
            svgPath("M 260 60 L 150 124", hi ? "lab-ok-stroke" : "lab-thin", `stroke-width="${hi ? 2.5 : 1.5}"`),
            svgPath("M 260 60 L 385 124", hi ? "lab-ok-stroke" : "lab-thin", `stroke-width="${hi ? 2.5 : 1.5}"`),
            line(150, 150, 88, 224, "lab-thin"),
            line(150, 150, 212, 224, "lab-thin"),
            line(385, 150, 385, 224, "lab-thin"),
            treeNode(260, 46, 118, "Schule", "root"),
            treeNode(150, 136, 118, "Informatik", "folder", hi),
            treeNode(385, 136, 110, "Biologie", "folder", hi),
            treeNode(88, 238, 110, "Plakat.svg", "leaf"),
            treeNode(212, 238, 112, "Referat.odt", "leaf"),
            treeNode(385, 238, 110, "Zelle.png", "leaf"),
            text(260, H - 10, "Unterordner gruppieren passende Dateien nach Fächern.", "lab-text-muted", "middle"),
            "</svg>",
          ].join("");
        }
        return [
          open("Dateimanager-Baum: Unterordner Grafiken"),
          rect(16, 14, W - 32, H - 34, "lab-panel", `rx="10"`),
          svgPath("M 260 52 L 155 110", hi ? "lab-ok-stroke" : "lab-thin", `stroke-width="${hi ? 2.5 : 1.5}"`),
          svgPath("M 260 52 L 385 110", hi ? "lab-ok-stroke" : "lab-thin", `stroke-width="${hi ? 2.5 : 1.5}"`),
          svgPath("M 155 136 L 98 198", hi ? "lab-ok-stroke" : "lab-thin", `stroke-width="${hi ? 2.5 : 1.5}"`),
          line(155, 136, 222, 198, "lab-thin"),
          line(385, 136, 385, 198, "lab-thin"),
          line(98, 224, 98, 274, "lab-thin"),
          treeNode(260, 40, 110, "Schule", "root"),
          treeNode(155, 122, 116, "Informatik", "folder", hi),
          treeNode(385, 122, 108, "Biologie", "folder", hi),
          treeNode(98, 210, 104, "Grafiken", "folder", hi),
          treeNode(222, 210, 112, "Referat.odt", "leaf"),
          treeNode(385, 210, 108, "Zelle.png", "leaf"),
          treeNode(98, 286, 106, "Plakat.svg", "leaf"),
          text(260, H - 10, "Ordner im Ordner: Schule → Informatik → Grafiken → Plakat.svg", "lab-text-muted", "middle"),
          "</svg>",
        ].join("");
      }

      if (mode === 1) {
        if (org === 0) {
          return [
            open("Objektdiagramm der unsortierten Ablage"),
            rect(16, 14, W - 32, H - 34, "lab-panel", `rx="10"`),
            umlCard({ x: 168, y: 30, w: 184, title: "Schule : ORDNER", attributes: ["Name = ‚Schule‘"], isObject: true }),
            containmentArrow(205, 86, 120, 178, "enthält"),
            containmentArrow(315, 86, 390, 178, "enthält"),
            umlCard({ x: 34, y: 180, w: 190, title: "Plakat : DATEI", attributes: ["Dateityp = ‚svg‘", "Größe = ‚42 KB‘"], isObject: true }),
            umlCard({ x: 296, y: 180, w: 190, title: "Referat : DATEI", attributes: ["Dateityp = ‚odt‘", "Größe = ‚98 KB‘"], isObject: true }),
            text(260, H - 10, "Jede konkrete Datei und jeder Ordner bekommt eine Objektkarte.", "lab-text-muted", "middle"),
            "</svg>",
          ].join("");
        }
        return [
          open("Objektdiagramm mit Unterordnern"),
          rect(16, 14, W - 32, H - 34, "lab-panel", `rx="10"`),
          umlCard({ x: 175, y: 24, w: 170, title: "Schule : ORDNER", attributes: ["Name = ‚Schule‘"], isObject: true }),
          containmentArrow(220, 78, 126, 130, "enthält", hi ? "lab-ok-stroke" : "lab-side-a", true),
          containmentArrow(300, 78, 392, 130, "enthält", hi ? "lab-ok-stroke" : "lab-side-a", true),
          umlCard({ x: 36, y: 132, w: 180, title: "Informatik : ORDNER", attributes: ["Name = ‚Informatik‘"], isObject: true }),
          umlCard({ x: 302, y: 132, w: 180, title: "Biologie : ORDNER", attributes: ["Name = ‚Biologie‘"], isObject: true }),
          org === 2
            ? containmentArrow(126, 186, 126, 232, "enthält", hi ? "lab-ok-stroke" : "lab-side-a", true) +
              umlCard({ x: 36, y: 234, w: 180, title: "Grafiken : ORDNER", attributes: ["Name = ‚Grafiken‘"], isObject: true }) +
              containmentArrow(216, 260, 302, 260, "enthält") +
              umlCard({ x: 304, y: 226, w: 180, title: "Plakat : DATEI", attributes: ["Dateityp = ‚svg‘"], isObject: true })
            : containmentArrow(126, 186, 126, 232, "enthält") +
              umlCard({ x: 36, y: 234, w: 180, title: "Referat : DATEI", attributes: ["Dateityp = ‚odt‘"], isObject: true }) +
              containmentArrow(392, 186, 392, 232, "enthält") +
              umlCard({ x: 302, y: 234, w: 180, title: "Zelle : DATEI", attributes: ["Dateityp = ‚png‘"], isObject: true }),
          text(260, H - 10, "Ordner-Objekte enthalten sowohl Ordner-Objekte als auch Datei-Objekte.", "lab-text-muted", "middle"),
          "</svg>",
        ].join("");
      }

      // Klassendiagramm (mode === 2)
      const loopCls = hi ? "lab-ok-stroke" : "lab-side-a";
      return [
        open("Klassendiagramm des Dateisystems"),
        rect(16, 14, W - 32, H - 34, "lab-panel", `rx="10"`),
        umlCard({
          x: 50,
          y: 112,
          w: 180,
          title: "ORDNER",
          attributes: ["Name", "Erstellungsdatum"],
          methods: ["anlegen()", "umbenennen()"],
          isObject: false,
        }),
        umlCard({
          x: 310,
          y: 112,
          w: 174,
          title: "DATEI",
          attributes: ["Name", "Dateityp", "Dateigröße"],
          methods: ["oeffnen()", "kopieren()"],
          isObject: false,
        }),
        containmentArrow(230, 168, 310, 168, "enthält"),
        `<path d="M 105 112 C 105 46, 195 46, 195 112" fill="none" class="${loopCls}" stroke-width="${hi ? 3 : 2}" />`,
        svgPath("M 188 102 L 195 112", loopCls, `stroke-width="${hi ? 3 : 2}"`),
        svgPath("M 202 102 L 195 112", loopCls, `stroke-width="${hi ? 3 : 2}"`),
        rect(78, 52, 144, 22, hi ? "lab-fill-ok" : "lab-panel", `rx="6"`),
        text(150, 67, "enthält (rekursiv)", hi ? "lab-text-ok" : "lab-text-a", "middle"),
        text(
          260,
          H - 10,
          "ORDNER enthält DATEI sowie rekursiv weitere ORDNER.",
          "lab-text-muted",
          "middle",
        ),
        "</svg>",
      ].join("");
    },
  },
};

// ─── Lab 3: Dateipfade im Verzeichnisbaum ────────────────────────────────────

interface PfadTarget {
  file: string;
  parts: string[];
}

const PFAD_ZIELE: PfadTarget[] = [
  { file: "Hausaufgabe.odt", parts: ["H:", "Klasse6", "Informatik", "Hausaufgabe.odt"] },
  { file: "Logo.svg", parts: ["H:", "Klasse6", "Informatik", "Bilder", "Logo.svg"] },
  { file: "Versuch.pdf", parts: ["H:", "Klasse6", "Biologie", "Versuch.pdf"] },
  { file: "Stundenplan.pdf", parts: ["H:", "Klasse6", "Stundenplan.pdf"] },
];

const pfadLab: LabDefinition = {
  kind: "inf6-pfade-dateizugriff",
  title: "Pfad-Navigator im Dateibaum",
  intro: "Wähle eine Zieldatei, eine Pfadart sowie das Trennzeichen und schiebe den Tiefenregler entlang des Weges.",
  params: [
    {
      key: "ziel",
      type: "choice",
      label: "Zieldatei",
      options: [
        { value: 0, label: "Hausaufgabe.odt (in Informatik)" },
        { value: 1, label: "Logo.svg (in Informatik / Bilder)" },
        { value: 2, label: "Versuch.pdf (in Biologie)" },
        { value: 3, label: "Stundenplan.pdf (direkt in Klasse6)" },
      ],
      value: 0,
    },
    {
      key: "pfadart",
      type: "choice",
      label: "Pfadart",
      options: [
        { value: 0, label: "– bitte Pfadart wählen –" },
        { value: 1, label: "Absoluter Pfad (ab Laufwerk H:)" },
        { value: 2, label: "Relativer Pfad (ab aktuellem Ordner Klasse6)" },
      ],
      value: 0,
    },
    {
      key: "trenner",
      type: "choice",
      label: "Trennzeichen",
      options: [
        { value: 0, label: "Backslash \\ (z. B. Windows)" },
        { value: 1, label: "Schrägstrich / (Netzwerk, macOS, Linux)" },
      ],
      value: 0,
    },
    {
      key: "schritt",
      type: "range",
      label: "Verfolgte Tiefe ab Wurzel",
      unit: "Ebenen",
      min: 1,
      max: 5,
      step: 1,
      value: 1,
    },
  ],
  readouts: [
    {
      key: "pfad",
      label: "Gebildeter Pfad",
      emphasis: true,
      compute: (v) => {
        if (v.pfadart === 0) return "Bitte zuerst oben ‚Absolut‘ oder ‚Relativ‘ auswählen.";
        const sep = v.trenner === 0 ? "\\" : "/";
        const target = PFAD_ZIELE[v.ziel];
        return v.pfadart === 1 ? target.parts.join(sep) : target.parts.slice(2).join(sep);
      },
    },
    {
      key: "netz",
      label: "Bedeutung der Wurzel",
      compute: (v) =>
        v.pfadart === 2
          ? "Startet relativ im bereits geöffneten Ordner ‚Klasse6‘"
          : "Startet an der Wurzel H: (z. B. Netzlaufwerk auf dem Schulserver)",
    },
  ],
  goals: [
    {
      id: "g1",
      text: "Verfolge den absoluten Pfad zu Logo.svg komplett bis Ebene 5.",
      check: (v) => v.ziel === 1 && v.pfadart === 1 && v.schritt === 5,
    },
    {
      id: "g2",
      text: "Wähle den absoluten Netzwerk-Pfad (mit Schrägstrich /) zu Versuch.pdf und gehe bis mindestens Ebene 4.",
      check: (v) => v.ziel === 2 && v.pfadart === 1 && v.trenner === 1 && v.schritt >= 4,
    },
    {
      id: "g3",
      text: "Stelle für Logo.svg den relativen Pfad ab dem Ordner Klasse6 ein.",
      check: (v) => v.ziel === 1 && v.pfadart === 2 && v.schritt >= 3,
    },
  ],
  witnesses: {
    g1: { ziel: 1, pfadart: 1, trenner: 0, schritt: 5 },
    g2: { ziel: 2, pfadart: 1, trenner: 1, schritt: 4 },
    g3: { ziel: 1, pfadart: 2, trenner: 0, schritt: 3 },
  },
  view: {
    handles: {
      stepHandle: {
        y: "schritt",
        drag(point: { x: number; y: number }): Partial<LabValues> {
          const norm = clamp((point.y - 44) / 224, 0, 1);
          return { schritt: clamp(Math.round(1 + norm * 4), 1, 5) };
        },
      },
    },
    render(v) {
      const target = PFAD_ZIELE[v.ziel];
      const depth = v.schritt;
      const showPath = v.pfadart > 0;
      const activeNames = new Set(target.parts.slice(0, depth));
      const nodes: Array<{ id: string; parent?: string; x: number; y: number; w: number; label: string; kind: "root" | "folder" | "leaf" }> = [
        { id: "H:", x: 250, y: 40, w: 66, label: "H:", kind: "root" },
        { id: "Klasse6", parent: "H:", x: 250, y: 96, w: 96, label: "Klasse6", kind: "folder" },
        { id: "Informatik", parent: "Klasse6", x: 145, y: 156, w: 102, label: "Informatik", kind: "folder" },
        { id: "Stundenplan.pdf", parent: "Klasse6", x: 280, y: 156, w: 112, label: "Stundenplan.pdf", kind: "leaf" },
        { id: "Biologie", parent: "Klasse6", x: 410, y: 156, w: 92, label: "Biologie", kind: "folder" },
        { id: "Hausaufgabe.odt", parent: "Informatik", x: 76, y: 218, w: 116, label: "Hausaufgabe.odt", kind: "leaf" },
        { id: "Bilder", parent: "Informatik", x: 205, y: 218, w: 78, label: "Bilder", kind: "folder" },
        { id: "Versuch.pdf", parent: "Biologie", x: 410, y: 218, w: 98, label: "Versuch.pdf", kind: "leaf" },
        { id: "Logo.svg", parent: "Bilder", x: 205, y: 278, w: 86, label: "Logo.svg", kind: "leaf" },
      ];

      const edges = nodes
        .filter((n) => n.parent)
        .map((n) => {
          const p = nodes.find((x) => x.id === n.parent)!;
          const on = showPath && activeNames.has(n.id) && activeNames.has(p.id);
          return svgPath(`M ${p.x} ${p.y + 13} L ${n.x} ${n.y - 13}`, on ? "lab-ok-stroke" : "lab-thin", `stroke-width="${on ? 3 : 1.5}"`);
        })
        .join("");

      const nodesSvg = nodes
        .map((n) => treeNode(n.x, n.y, n.w, n.label, n.kind, showPath && activeNames.has(n.id)))
        .join("");

      const sep = v.trenner === 0 ? "\\" : "/";
      const shownPath =
        v.pfadart === 0
          ? "Wähle eine Pfadart (absolut oder relativ)"
          : v.pfadart === 1
            ? target.parts.join(sep)
            : target.parts.slice(2).join(sep);

      const handleY = 44 + ((depth - 1) / 4) * 224;

      return [
        open("Pfad-Navigator im Dateibaum"),
        rect(12, 12, 458, 290, "lab-panel", `rx="10"`),
        edges,
        nodesSvg,
        line(488, 44, 488, 268, "lab-thin"),
        `<g class="lab-handle lab-handle-a" data-handle="stepHandle" role="slider" aria-label="Pfadtiefe" aria-valuemin="1" aria-valuemax="5" aria-valuenow="${depth}">`,
        circle(488, handleY, 15, "lab-handle-hit"),
        circle(488, handleY, 7, "lab-handle-dot"),
        text(488, handleY - 11, `E${depth}`, "lab-text-a", "middle"),
        "</g>",
        rect(16, 308, 488, 26, showPath ? "lab-fill-ok" : "lab-panel", `rx="6"`),
        text(260, 325, shownPath, showPath ? "lab-text-ok" : "lab-text-muted", "middle"),
        "</svg>",
      ].join("");
    },
  },
};

// ─── Stage 3 Definition ───────────────────────────────────────────────────────

export const STAGE_DATEISYSTEM: Stage = {
  id: STAGE_ID,
  stageNumber: 3,
  title: "Dateisystem als hierarchische Struktur",
  subtitle: "Bäume mit Wurzel, Knoten, Kanten und Blättern, OOP-Sicht auf Ordner/Dateien sowie Dateipfade",
  icon: "🗂️",
  accent: "#6d28d9",
  badgeTitle: "Architektin der Dateibäume",
  lehrplanLabel: "NT6 2.3 · ca. 6 Std.",
  module: "2.3",
  lessons: [
    lesson(STAGE_ID, "2.3", 1, {
      id: "inf6-baumstrukturen",
      title: "Hierarchische Strukturen und Baumdiagramme",
      subtitle: "Wurzel, Knoten, Kante, innerer Knoten, Blatt und Pfad an Alltagsbeispielen",
      why: "Ob Stammbaum, Buchkapitel oder Ordner auf einem Schulrechner – dieselben Baumregeln helfen dir sofort weiter.",
      html: `<p>Viele Informationen besitzen eine klare Über- und Unterordnung, also eine <strong>hierarchische Struktur</strong>: Vorfahren und Nachkommen im <strong>Stammbaum</strong>, Haupt- und Unterkapitel in einem Buch oder Spielrunden in einem Turnier. In der Informatik zeichnet man solche Zusammenhänge als <strong>Baumdiagramm</strong> – meist steht der oberste Punkt oben und verzweigt sich nach unten.</p>
<ul>
<li><strong>Knoten:</strong> Jedes einzelne Element des Baums (egal ob ganz oben, in der Mitte oder am Ende).</li>
<li><strong>Wurzel:</strong> Der genau <strong>eine</strong> oberste Knoten ohne Vorgänger.</li>
<li><strong>Kante:</strong> Die direkte Verbindungslinie zwischen einem übergeordneten Knoten und einem direkt darunterliegenden Kindknoten.</li>
<li><strong>Blatt:</strong> Ein Endknoten <strong>ohne</strong> eigene Nachfolger. Knoten mit mindestens einem Kindknoten heißen <strong>innere Knoten</strong>.</li>
<li><strong>Pfad:</strong> Der eindeutige Weg über Kanten von einem Ausgangsknoten (meist von der Wurzel) bis zu einem gesuchten Zielknoten.</li>
</ul>
<p>Da es im Baum niemals Kreise gibt und jeder Knoten außer der Wurzel genau einen direkten Vorgänger hat, gilt für jeden Baum mit <code>n</code> Knoten stets die Zählregel: Er hat genau <code>n − 1</code> Kanten.</p>
<div class="example"><strong>Beispiel:</strong> Ein Turnierbaum hat ganz oben das Finale (<code>1</code> Wurzel), darunter <code>2</code> Halbfinale (innere Knoten) und darunter je <code>2</code> Viertelfinale (insgesamt <code>4</code> Blätter). Alle <code>1 + 2 + 4 = 7</code> Knoten sind durch genau <code>7 − 1 = 6</code> Kanten verbunden.</div>
<div class="merke"><strong>Merke:</strong> Ein Baum hat genau eine Wurzel, Verzweigungen an inneren Knoten, Endpunkte als Blätter – und bei n Knoten immer genau n − 1 Kanten ohne jeden Kreis.</div>`,
      rule: "Ein Baum hat genau 1 Wurzel, Blätter ohne Nachfolger und bei n Knoten immer n − 1 Kanten",
      terms: [
        ["Wurzel", "Der genau eine oberste Knoten ohne Vorgänger", "Ausgangspunkt aller Pfade von oben"],
        ["Knoten & innerer Knoten", "Element im Baum; ein innerer Knoten hat mindestens einen Nachfolger", "Bilden Verzweigungspunkte"],
        ["Blatt", "Ein Endknoten ohne weitere Nachfolger", "Hier enden Zweige (wie Dateien)"],
        ["Kante & Pfad", "Kante verbindet Eltern- und Kindknoten; ein Pfad ist ein Kantenweg dazwischen", "Bei n Knoten gibt es stets n − 1 Kanten"],
      ],
      quiz: [
        "Welches Merkmal trifft auf JEDES Blatt in einem Baumdiagramm zu?",
        "Es hat genau einen direkten Vorgänger (außer im Ein-Knoten-Baum), aber keinen einzigen Nachfolger.",
        "Es liegt immer ganz oben im Baum und hat keinen Vorgänger.",
        "Es besitzt immer mindestens zwei direkte Verbindungen zu tieferen Knoten.",
        "Blätter sind die Endknoten eines Baums: Nach ihnen zweigt nichts mehr ab.",
      ],
      lab: baumLab,
      exercises: [
        {
          id: "inf6-baum-zaehlen",
          make(rng, level) {
            if (level === 1) {
              const askEdges = rng.next() < 0.5;
              const nodes = rng.int(5, 19);
              const edges = nodes - 1;
              if (askEdges) {
                return {
                  prompt: `Ein Baumdiagramm (z. B. ein Stammbaum oder eine Gliederung) besteht aus genau ${nodes} Knoten. Wie viele Kanten verbinden diese Knoten?`,
                  given: [`Knoten n: ${nodes}`],
                  formulaHint: "Jeder Knoten außer der genau einen Wurzel hängt an genau einer Kante nach oben: Kanten = n − 1.",
                  fields: [
                    withSlips(
                      numberField("Anzahl Kanten", edges, "Kanten", 0),
                      [nodes, "Die oberste Wurzel selbst besitzt keine Kante nach oben – ziehe 1 ab!"],
                      [nodes + 1, "Ein Baum hat weniger Kanten als Knoten, nicht mehr."],
                    ),
                  ],
                  steps: [
                    "In jedem Baum hat außer der genau einen Wurzel jeder andere Knoten genau einen direkten Vorgänger (eine Kante nach oben).",
                    `Rechnung: ${nodes} − 1`,
                    `Ergebnis: ${edges} Kanten`,
                  ],
                };
              }
              return {
                prompt: `In einem Baumdiagramm zählst du genau ${edges} Kanten (Verbindungslinien). Wie viele Knoten enthält dieser Baum insgesamt?`,
                given: [`Kanten: ${edges}`],
                formulaHint: "Addiere zur Kantenzahl die oberste Wurzel dazu: Knoten = Kanten + 1.",
                fields: [
                  withSlips(
                    numberField("Anzahl Knoten", nodes, "Knoten", 0),
                    [edges, "Vergiss die Wurzel nicht! Sie hat als einziger Knoten keine Kante über sich."],
                    [edges - 1, "Jede Kante erschließt unter der Wurzel einen weiteren Knoten."],
                  ),
                ],
                steps: [
                  "An jeder Kante hängt ein neuer Knoten, hinzu kommt die genau eine Wurzel ganz oben.",
                  `Rechnung: ${edges} + 1`,
                  `Ergebnis: ${nodes} Knoten`,
                ],
              };
            }

            const haupt = rng.int(3, 5);
            const verzweigt = rng.int(1, haupt - 1);
            const unter = rng.int(2, 4);
            const askLeaves = rng.next() < 0.5;
            const leaves = (haupt - verzweigt) + verzweigt * unter;
            const totalNodes = 1 + haupt + verzweigt * unter;
            const totalEdges = totalNodes - 1;

            if (askLeaves) {
              return {
                prompt: `Ein Schulbuch hat eine Titelseite als Wurzel und direkt darunter ${haupt} Hauptkapitel. Genau ${verzweigt} dieser Hauptkapitel teilen sich jeweils weiter in ${unter} Unterkapitel auf; die übrigen Hauptkapitel bleiben ungeteilt. Wie viele Blätter hat dieser Gliederungsbaum insgesamt?`,
                given: [
                  `Hauptkapitel: ${haupt}`,
                  `Geteilte Kapitel: ${verzweigt} mit je ${unter} Unterkapiteln`,
                ],
                formulaHint: "Blätter sind alle Endknoten ohne Nachfolger: die ungeteilten Hauptkapitel plus alle Unterkapitel.",
                fields: [
                  withSlips(
                    numberField("Anzahl Blätter", leaves, "Blätter", 0),
                    [verzweigt * unter, "Zähle auch die ungeteilten Hauptkapitel mit – auch sie enden als Blätter!"],
                    [totalNodes, "Wurzel und geteilte Hauptkapitel haben Nachfolger und sind keine Blätter."],
                  ),
                ],
                steps: [
                  `Ungeteilte Hauptkapitel (Blätter): ${haupt} − ${verzweigt} = ${haupt - verzweigt}`,
                  `Unterkapitel (Blätter): ${verzweigt} · ${unter} = ${verzweigt * unter}`,
                  `Gesamtzahl der Blätter: ${haupt - verzweigt} + ${verzweigt * unter} = ${leaves}`,
                ],
              };
            }

            return {
              prompt: `Eine Vereinsstruktur hat 1 Vorsitz als Wurzel, direkt darunter ${haupt} Abteilungen. Von diesen Abteilungen besitzen ${verzweigt} jeweils genau ${unter} Untergruppen; alle anderen Abteilungen bleiben ungeteilt. Wie viele Kanten hat das zugehörige Baumdiagramm?`,
              given: [
                `Wurzel + Abteilungen: 1 + ${haupt}`,
                `Untergruppen: ${verzweigt} · ${unter}`,
              ],
              formulaHint: "Bestimme zuerst alle Knoten zusammen und ziehe dann 1 für die Wurzel ab.",
              fields: [
                withSlips(
                  numberField("Anzahl Kanten", totalEdges, "Kanten", 0),
                  [totalNodes, "Das ist die Anzahl der Knoten! Für die Kanten ziehe 1 ab."],
                  [haupt + verzweigt * unter - 1, "Die Kanten von der Wurzel zu jeder Abteilung zählen auch mit."],
                ),
              ],
              steps: [
                `Alle Knoten: 1 + ${haupt} + ${verzweigt} · ${unter} = ${totalNodes}`,
                `Für die Kanten die oberste Wurzel abziehen: ${totalNodes} − 1`,
                `Ergebnis: ${totalEdges} Kanten`,
              ],
            };
          },
        },
        cases(
          "inf6-baum-begriffe",
          [
            cc(
              "Wie viele direkte Vorgänger (Elternknoten) hat die Wurzel eines Baumdiagramms?",
              "Keinen (0) – sie bildet die oberste Ebene der Hierarchie",
              ["Immer mindestens zwei", "Genau einen direkten Vorgänger"],
              "Die Wurzel steht als eindeutiger Ausgangspunkt ganz oben und besitzt keinen übergeordneten Knoten.",
              "Wo liegt die Wurzel in einer Hierarchie?",
            ),
            cc(
              "Ein Stammbaum zeigt die Großeltern ganz oben, darunter ihre Kinder und darunter ihre Enkel. Wie nennt man die Kinder-Knoten mit eigenen Nachkommen?",
              "Innere Knoten",
              ["Blätter", "Isolierte Kanten"],
              "Knoten, die selbst mindestens einen Nachfolger haben (und unterhalb der Wurzel liegen), heißen innere Knoten.",
              "Enden diese Knoten ohne Kinder oder verzweigen sie weiter?",
            ),
            cc(
              "Welches Alltagsbeispiel lässt sich besonders natürlich als Baumdiagramm darstellen?",
              "Die Gliederung eines Fachbuchs in Teile, Kapitel und Unterabschnitte",
              ["Ein Kreisverkehr, bei dem man endlos im Kreis fährt", "Ein ungeordneter Haufen loser Lose ohne Themen"],
              "Kapitel unterordnen sich eindeutig genau einem übergeordneten Abschnitt – eine klassische Baumhierarchie.",
              "Bei welchem Beispiel gibt es klare Über- und Unterordnung ohne Kreise?",
            ),
          ],
          [
            cc(
              "In einer Zeichnung verläuft plötzlich ein Querstrich zwischen zwei verschiedenen Unterzweigen derselben Familie, sodass ein geschlossener Ring entsteht. Handelt es sich noch um ein Baumdiagramm der Informatik?",
              "Nein, denn durch den Ring hat ein Knoten zwei Vorgänger und es entsteht ein verbotener Kreis.",
              [
                "Ja, solange alle Kanten dünn gezeichnet sind",
                "Ja, Bäume dürfen beliebig viele geschlossene Kreise enthalten",
              ],
              "In einem echten Baum führt von der Wurzel zu jedem Knoten genau ein eindeutiger Pfad – geschlossene Kreise sind ausgeschlossen.",
              "Wie viele eindeutige Wege führen in einem Baum von der Wurzel zu einem Knoten?",
            ),
            cc(
              "Du entfernst aus einem Baum alle Kanten und fügst einen neuen Knoten hinzu, ohne ihn irgendwo anzuschließen. Bleibt das ein einzelner Baum?",
              "Nein, ein unverbundener Knoten zerstört die Zusammenhangseigenschaft des Baums.",
              [
                "Ja, ein Baum kann aus mehreren getrennten Inseln ohne Verbindung bestehen",
                "Ja, solange der lose Knoten ‚Blatt‘ genannt wird",
              ],
              "Von der Wurzel aus muss jeder Knoten des Baums über einen Pfad aus Kanten erreichbar sein.",
              "Muss jeder Knoten von der Wurzel aus erreichbar sein?",
            ),
            cc(
              "Warum ist in einem Turnierbaum mit K.-o.-System die Gesamtanzahl aller Pfade von der Wurzel zu einem Blatt gleich der Anzahl der Blätter?",
              "Weil zu jedem Blatt von der genau einen Wurzel aus exakt ein eindeutiger Kantenweg führt",
              [
                "Weil alle Kanten doppelt so breit wie die Knoten sind",
                "Weil jedes Blatt drei verschiedene Wurzeln gleichzeitig besitzt",
              ],
              "Durch die eindeutigen Eltern-Kind-Verbindungen korrespondiert jedes Blatt umkehrbar eindeutig mit genau einem Pfad ab der Wurzel.",
              "Wie viele Wege führen von der Wurzel zu einem bestimmten Blatt?",
            ),
          ],
        ),
      ],
    }),

    lesson(STAGE_ID, "2.3", 2, {
      id: "inf6-dateisystem-oop",
      title: "Dateisystem: Ordner, Dateien und OOP-Sicht",
      subtitle: "Dateimanager-Organisation sowie Objekt- und Klassendiagramm mit rekursiver Beziehung",
      why: "Wenn hunderte Fotos, Referate und Downloads zusammenkommen, hältst du nur mit klaren Ordnern und Namen den Durchblick.",
      html: `<p>Ein <strong>Dateisystem</strong> speichert alle Daten eines Rechners in einer Baumstruktur aus <strong>Ordnern</strong> (Verzeichnissen) und <strong>Dateien</strong>. Im <strong>Dateimanager</strong> (z. B. Explorer oder Finder) ordnest du Dateien thematisch in passende Ordner und Unterordner, damit du sie sicher abspeicherst und blitzschnell wiederfindest. Wichtige Aktionen sind <strong>Anlegen</strong>, <strong>Umbenennen</strong> (mit klaren, sprechenden Dateinamen), <strong>Verschieben</strong> und <strong>Kopieren</strong>.</p>
<p>Betrachtest du das Dateisystem objektorientiert, ist jeder konkrete Ordner (z. B. <code>Informatik : ORDNER</code>) ein Objekt der Klasse <strong><code>ORDNER</code></strong> und jede Datei (z. B. <code>Plakat.svg : DATEI</code>) ein Objekt der Klasse <strong><code>DATEI</code></strong>:</p>
<ul>
<li>Im <strong>Objektdiagramm</strong> zeigen konkrete <code>enthält</code>-Pfeile von jedem Ordner zu den in ihm liegenden Unterordnern und Dateien.</li>
<li>Im abstrakten <strong>Klassendiagramm</strong> stehen nur die beiden Klassen <strong><code>ORDNER</code></strong> und <strong><code>DATEI</code></strong>. Da ein Ordner beliebig viele weitere Unterordner fassen kann, hat die Klasse <code>ORDNER</code> neben dem Pfeil zu <code>DATEI</code> eine <strong>rekursive Enthält-Beziehung</strong> – also einen Pfeil von <code>ORDNER</code> auf sich selbst! Eine <code>DATEI</code> hingegen ist stets ein Blatt und enthält weder Ordner noch andere Dateien.</li>
</ul>
<div class="example"><strong>Beispiel:</strong> Im Ordner <code>Schule</code> liegen die Unterordner <code>Informatik</code> und <code>Biologie</code>, und in <code>Informatik</code> wiederum der Unterordner <code>Grafiken</code> mit der Datei <code>Plakat.svg</code>. Im Klassendiagramm genügen die zwei Klassen <code>ORDNER</code> (enthält rekursiv <code>ORDNER</code> und <code>DATEI</code>) und <code>DATEI</code> für beliebig tiefe Verschachtelungen.</div>
<div class="merke"><strong>Merke:</strong> Im Dateisystem bilden Ordner die inneren Knoten und Dateien die Blätter. Im Klassendiagramm sorgt die rekursive Enthält-Beziehung von ORDNER auf ORDNER dafür, dass Ordner in Ordnern geschachtelt werden können.</div>`,
      rule: "Im Klassendiagramm enthält ORDNER sowohl DATEI als auch rekursiv weitere ORDNER",
      terms: [
        ["Ordner", "Behälter / innerer Knoten im Dateisystem; kann Dateien und Unterordner aufnehmen", "Klasse ORDNER"],
        ["Datei", "Speichert Daten (Text, Bild, Audio); stets ein Blatt ohne weitere Inhalte", "Klasse DATEI"],
        ["Rekursive Enthält-Beziehung", "Eine Beziehung einer Klasse zurück auf sich selbst (ORDNER enthält ORDNER)", "Ermöglicht beliebig tiefe Ordnerbäume"],
        ["Dateimanager", "Programm zum Anlegen, Umbenennen, Verschieben und Kopieren in Ordnerbäumen", "Hilft beim sicheren Ablegen und Wiederfinden"],
      ],
      quiz: [
        "Warum zeigt im Klassendiagramm des Dateisystems ein ‚enthält‘-Pfeil von der Klasse ORDNER wieder zurück auf die Klasse ORDNER?",
        "Weil ein Ordner weitere Unterordner (Objekte derselben Klasse ORDNER) enthalten kann.",
        "Weil jede einzelne Textdatei automatisch einen kompletten neuen Ordner in sich trägt.",
        "Weil ein Dateimanager keine Dateien, sondern nur gleichnamige Ordner kopieren darf.",
        "Ordner lassen sich beliebig in anderen Ordnern verschachteln – genau das beschreibt eine rekursive Enthält-Beziehung.",
      ],
      lab: dateisystemOopLab,
      exercises: [
        cases(
          "inf6-ds-modell",
          [
            cc(
              "Was unterscheidet ein Objekt der Klasse DATEI im Baumdiagramm grundlegend von einem Objekt der Klasse ORDNER?",
              "Eine Datei ist immer ein Blatt und kann keine weiteren Dateien oder Ordner enthalten",
              [
                "Eine Datei bildet immer die Wurzel ganz oben im Baum",
                "Eine Datei besitzt als Einzige eine rekursive Enthält-Beziehung auf sich selbst",
              ],
              "Dateien speichern konkrete Daten und beenden einen Zweig; nur Ordner bilden Container für weitere Knoten.",
              "Kannst du in einem Bild ‚Zelle.png‘ einen weiteren Unterordner ablegen?",
            ),
            cc(
              "Wofür steht die ‚rekursive Enthält-Beziehung‘ im Klassendiagramm des Dateisystems?",
              "Ein Objekt der Klasse ORDNER kann ein oder mehrere weitere Objekte der Klasse ORDNER enthalten",
              [
                "Beim Löschen einer Datei wird gleichzeitig das gesamte Betriebssystem geleert",
                "Jeder Dateiname muss mindestens zweimal rückwärts geschrieben werden",
              ],
              "Rekursiv bedeutet hier ‚auf sich selbst bezogen‘: Ordner enthalten nicht nur Dateien, sondern auch wiederum Ordner.",
              "Wie entstehen Unterordner innerhalb eines Ordners im Klassenmodell?",
            ),
            cc(
              "Welches Diagramm zeigt konkret ‚Informatik : ORDNER‘ mit ‚Name = Informatik‘ und ‚Referat : DATEI‘, und welches abstrahiert das Prinzip auf zwei Kästchen?",
              "Das Objektdiagramm zeigt die konkreten Instanzen, das Klassendiagramm die abstrakten Klassen ORDNER und DATEI",
              [
                "Das Klassendiagramm zeigt nur konkrete Dateigrößen, das Objektdiagramm keine Namen",
                "Beide Diagramme müssen immer dieselbe exakte Anzahl an Kästchen für alle 500 Dateien besitzen",
              ],
              "Objektdiagramme bilden einen konkreten Momentanzustand ab; Klassendiagramme fassen die allgemeine Bauplan-Struktur zusammen.",
              "Konkret = Objektkarte/Objektdiagramm, allgemeiner Bauplan = ?",
            ),
          ],
          [
            cc(
              "Ein Verzeichnis enthält 300 konkrete Dateien verteilt über fünf Ebenen. Wie viele Klassen braucht man mindestens, um diese Grundstruktur im Klassendiagramm abzubilden?",
              "Nur zwei Klassen (ORDNER und DATEI) dank der rekursiven Enthält-Beziehung von ORDNER",
              [
                "Genau 300 verschiedene Klassen – eine pro gespeicherter Datei",
                "Fünf unterschiedliche Klassen namens ‚Ordner_Ebene_1‘ bis ‚Ordner_Ebene_5‘",
              ],
              "Genau deshalb abstrahiert die OOP auf Klassenebene: zwei Klassen plus Rekursion beschreiben beliebig große Bäume.",
              "Wofür spart die rekursive Enthält-Beziehung bei der Modellierung von Ebenen?",
            ),
            cc(
              "Du verschiebst im Dateimanager die Datei ‚Vortrag.odp‘ aus dem Ordner ‚Downloads‘ in den Ordner ‚Referate‘. Was ändert sich im Objektdiagramm?",
              "Die Kante ‚enthält‘ führt nicht mehr von ‚Downloads‘, sondern neu von ‚Referate‘ auf ‚Vortrag‘",
              [
                "Die Klasse DATEI wird dadurch in die Klasse ORDNER umgewandelt",
                "Es entsteht eine Kopie, sodass genau derselbe Pfeil von beiden Ordnern ausgeht",
              ],
              "Beim Verschieben (anders als beim Kopieren!) wandert das Objekt an eine neue Stelle unter einem neuen Elternordner.",
              "Unterscheide Verschieben von Kopieren: bleibt das Objekt zweimal erhalten oder wechselt es seinen Elternordner?",
            ),
            cc(
              "Darf ein Unterordner A gleichzeitig einen Ordner B enthalten UND von genau diesem selben Ordner B wieder direkt als Unterordner enthalten sein?",
              "Nein – sonst entsteht ein geschlossener Kreis und die Struktur ist kein gültiger Dateibaum mehr",
              [
                "Ja, jeder Ordner ist immer automatisch sein eigener Unterordner",
                "Ja, solange beide Ordner dieselbe Farbe haben",
              ],
              "Ein echtes Dateisystem bleibt durch Über- und Unterordnung baumartig: jeder Ordner hat außer der Wurzel genau einen direkten Elternordner.",
              "Prüfe an der Baumregel: Sind gegenseitige Kreise im Baum erlaubt?",
            ),
          ],
        ),
        cases(
          "inf6-ds-manager",
          [
            cc(
              "Du speicherst ein Biologie-Arbeitsblatt ab. Welcher Dateiname hilft dir Monate später im Dateimanager am schnellsten?",
              "‚2026-11_Bio_Zellaufbau_Arbeitsblatt.pdf‘ statt ‚Unbenannt1.pdf‘",
              [
                "‚neu_final_2_aaa‘ ohne genauere Angabe des Fachs",
                "Alle Arbeitsblätter genau gleich ‚Aufgabe.pdf‘ nennen und bunt verstreuen",
              ],
              "Sprechende Namen mit Thema (und optional Datum/Fach) machen Dateien auch ohne Öffnen sofort erkennbar.",
              "Woran erkennst du in einer Ordnerliste auf den ersten Blick, was drinsteckt?",
            ),
            cc(
              "Wann wählst du im Dateimanager ‚Kopieren und Einfügen‘ statt ‚Ausschneiden (Verschieben)‘?",
              "Wenn das Original im bisherigen Ordner unverändert erhalten bleiben und zusätzlich eine zweite Kopie anderswo liegen soll",
              [
                "Wenn eine Datei aus dem Papierkorb endgültig gelöscht werden soll",
                "Wenn der Dateityp einer Grafik von Pixel auf Vektor geändert werden soll",
              ],
              "Kopieren verdoppelt das Objekt (neues unabhängiges Dateiobjekt am Zielort); Verschieben verlagert das Original.",
              "Bleibt die Datei am Startort bestehen oder verschwindet sie dort?",
            ),
            cc(
              "Warum solltest du bei Dateinamen auf dem Schulrechner Leerzeichen und Sonderzeichen wie ?, *, / oder : möglichst meiden?",
              "Manche Zeichen wie / oder : dienen als Pfadtrennzeichen oder Laufwerksangabe und sind in Dateinamen verboten oder sorgen in Netzen für Fehler",
              [
                "Weil der Monitor sonst beim Speichern sofort ausschaltet",
                "Weil jede Ziffer im Dateinamen die Schrift im Textdokument vergrößert",
              ],
              "Bindestrich oder Unterstrich (z. B. ‚Referat_Biene.odt‘) funktionieren zuverlässig auf jedem Betriebssystem und Netzlaufwerk.",
              "Welche Aufgabe haben Schrägstriche und Doppelpunkte bereits im Dateisystem?",
            ),
          ],
          [
            cc(
              "Lea kopiert die Datei ‚Skizze.svg‘ in einen zweiten Ordner und ändert später nur dort die Farben. Was sieht sie beim Öffnen der ursprünglichen Datei im ersten Ordner?",
              "Sie sieht noch den alten Stand vor der Farbänderung, weil Kopieren zwei voneinander unabhängige Objekte erzeugt hat",
              [
                "Beide Dateien ändern automatisch gleichzeitig ihre Farbe",
                "Die ursprüngliche Datei wurde durch das Kopieren automatisch gelöscht",
              ],
              "Kopieren erstellt eine eigenständige Dublette: Änderungen am einen Objekt verändern das andere nicht.",
              "Sind Kopie und Original danach zwei getrennte Datei-Objekte?",
            ),
            cc(
              "Auf dem Klassenlaufwerk suchen zwanzig Schülerinnen und Schüler gleichzeitig ihre Referate. Welche Ordner-Strategie ist am saubersten?",
              "Gemeinsamer Projektordner → darunter je Fach/Thema ein Unterordner → darin Dateien mit Namen ‚Thema_Vorname.odp‘",
              [
                "Alle zwanzig Dateien auf dem Desktop ablegen und ‚Praesentation.odp‘ nennen",
                "Für jeden Buchstaben des Alphabets einen leeren Ordner anlegen und alles in ‚Sonstiges‘ werfen",
              ],
              "Klare Gruppierung nach Ebenen plus eindeutiger Benennung verhindert Überschreiben und erleichtert das Wiederfinden.",
              "Wie findet eine Gruppe ihre eigene Datei sofort ohne Suchen?",
            ),
            cc(
              "Ein Mitschüler löscht im Dateimanager den noch vollen Unterordner ‚Grafiken‘, der drei Bilder enthält. Was passiert mit diesen drei Bilddateien?",
              "Die Bilder gehen mit dem Ordner verloren (bzw. landen gemeinsam im Papierkorb), da ihre ‚enthält‘-Verbindung zum Baum gelöst wurde",
              [
                "Die Bilder verschieben sich von selbst in den Ordner ‚Musik‘",
                "Nur der Ordnername verschwindet, alle enthaltenen Dateien vervielfachen sich dreifach",
              ],
              "Wer einen Container löscht, entfernt damit auch den Teilbaum seiner Inhalte.",
              "Was gehört im Dateisystem alles zum Teilbaum eines Ordners?",
            ),
          ],
        ),
      ],
    }),

    lesson(STAGE_ID, "2.3", 3, {
      id: "inf6-pfade-dateizugriff",
      title: "Dateipfade angeben und verfolgen",
      subtitle: "Absoluter und relativer Pfad im Dateibaum – lokal und auf Netzlaufwerken",
      why: "Damit ein Rechner oder Schulserver aus tausenden Ordnern genau die richtige Datei findet, braucht er ihre eindeutige Pfadangabe.",
      html: `<p>Ein <strong>Dateipfad</strong> (kurz <strong>Pfad</strong>) ist die genaue Wegbeschreibung vom Startpunkt durch die Ordnerhierarchie bis zu einer bestimmten Datei oder einem Unterordner. Dabei unterscheidet man zwei Wege:</p>
<ul>
<li><strong>Absoluter Pfad:</strong> Er startet immer ganz oben an der <strong>Wurzel</strong> des Dateibaums – unter Windows z. B. bei einem Laufwerksbuchstaben wie <code>C:\\</code> oder einem <strong>Netzlaufwerk</strong> wie <code>H:\\</code>, unter macOS, Linux und in Netzwerkadressen oft bei <code>/</code>. Beispiel: <code>H:\\Klasse6\\Informatik\\Bilder\\Logo.svg</code>. Egal in welchem Ordner du gerade stehst, der absolute Pfad weist eindeutig auf dieselbe Datei.</li>
<li><strong>Relativer Pfad:</strong> Er startet <strong>nicht</strong> an der Wurzel, sondern in dem Ordner, in dem du dich bereits befindest (dem aktuellen Arbeitsordner). Befindest du dich schon in <code>H:\\Klasse6\\Informatik</code>, lautet der relative Pfad zu <code>Logo.svg</code> einfach <code>Bilder\\Logo.svg</code>. Mit <code>..</code> springst du bei Bedarf eine Ebene höher zum Elternordner.</li>
</ul>
<p>Je nach System werden Ordnernamen durch den Backslash <code>\\</code> (Windows) oder den Schrägstrich <code>/</code> (Linux, macOS, Web- und Netzwerkpfade) getrennt. In Schulen liegen viele Dateien auf zentralen Servern (<strong>Netzlaufwerken</strong> wie <code>T:\\Tausch\\...</code>): Über den Pfad greifen alle Klassenrechner eindeutig darauf zu.</p>
<div class="example"><strong>Beispiel:</strong> Vom Arbeitsordner <code>C:\\Schule</code> lautet der <strong>absolute Pfad</strong> zu deiner Zeichnung <code>C:\\Schule\\Kunst\\Plakat.svg</code>, der <strong>relative Pfad</strong> von <code>Schule</code> aus aber nur <code>Kunst\\Plakat.svg</code>.</div>
<div class="merke"><strong>Merke:</strong> Ein absoluter Pfad beginnt immer an der Wurzel (z. B. C:\\ oder /) und gilt überall; ein relativer Pfad startet ab dem aktuellen Ordner.</div>`,
      rule: "Absoluter Pfad ab Wurzel (z. B. H:\\... oder /...) vs. relativer Pfad ab aktuellem Ordner",
      terms: [
        ["Dateipfad", "Eindeutige Wegbeschreibung zu einer Datei oder einem Ordner im Baum", "Liste der Knoten auf dem Weg, durch \\ oder / getrennt"],
        ["Absoluter Pfad", "Startet immer an der Wurzel (z. B. C:\\ oder /)", "Bezeichnet die Datei unabhängig vom aktuellen Standort"],
        ["Relativer Pfad", "Startet ab dem aktuell geöffneten Ordner", "Kürzer, hängt aber vom aktuellen Ausgangsordner ab"],
        ["Netzlaufwerk", "Freigegebener Ordner auf einem Schul- oder Firmenserver (z. B. H:\\ oder T:\\)", "Macht zentrale Dateien über Pfade im Netzwerk erreichbar"],
      ],
      quiz: [
        "Worin liegt der sichere Unterschied zwischen einem absoluten und einem relativen Dateipfad?",
        "Ein absoluter Pfad beginnt stets an der Wurzel (z. B. C:\\ oder /), ein relativer startet im aktuellen Ordner.",
        "Ein absoluter Pfad enthält nur den Dateinamen ohne Endung, ein relativer auch die Uhrzeit.",
        "Absolute Pfade gibt es nur für Vektorgrafiken, relative nur für Textdateien.",
        "Der Ausgangspunkt entscheidet: Die Wurzel macht den absoluten Pfad weltweit/systemweit eindeutig, der aktuelle Ordner dient als Start beim relativen Pfad.",
      ],
      lab: pfadLab,
      exercises: [
        cases(
          "inf6-pfad-lesen",
          [
            cc(
              "Du öffnest im Schulnetz die Datei ‚T:\\Klasse6b\\NT\\Versuch.pdf‘. Wo befindet sich das oberste Startverzeichnis (die Wurzel) dieses Pfades?",
              "Beim Netzlaufwerk ‚T:\\‘",
              ["Direkt bei ‚Versuch.pdf‘", "Immer beim Buchstaben ‚NT‘"],
              "Der Laufwerksbuchstabe ganz links am Anfang markiert bei absoluten Windows-Pfaden die Wurzel des Verzeichnisbaums.",
              "Lies den Pfad von links nach rechts: Welcher Knoten steht ganz am Anfang?",
            ),
            cc(
              "Welche Angabe beschreibt einen relativen Pfad, wenn du dich bereits im Ordner ‚C:\\Schule\\Informatik‘ befindest?",
              "‚Projekte\\Roboter.svg‘ (nur der restliche Weg ab dem aktuellen Ordner)",
              [
                "‚C:\\Schule\\Informatik\\Projekte\\Roboter.svg‘ (startet ganz oben an C:\\)",
                "‚C:\\‘ (nur die Wurzel ohne Ziel)",
              ],
              "Der relative Pfad lässt die Wurzel und die bereits betretenen übergeordneten Ordner weg.",
              "Was steht beim relativen Pfad nicht mehr am Anfang?",
            ),
            cc(
              "Wozu dienen Trennzeichen wie ‚\\‘ oder ‚/‘ in einem Dateipfad?",
              "Sie grenzen aufeinanderfolgende Ordnernamen und den Dateinamen sauber voneinander ab",
              [
                "Sie rechnen die Dateigröße durch zwei oder teilen den Text in Spalten",
                "Sie schalten eine Datei von Pixelgrafik auf Textdokument um",
              ],
              "Jedes Trennzeichen entspricht dem Schritt über eine Kante eine Ebene tiefer in den nächsten Unterordner.",
              "Woran erkennt der Rechner, wo ein Ordnername endet und der nächste anfängt?",
            ),
          ],
          [
            cc(
              "Zwei Klassen arbeiten über das Schulnetz gleichzeitig am selben Tauschordner ‚T:\\Klassen\\Info6‘. Tim ruft eine Datei relativ mit ‚Blatt.pdf‘ auf, liegt selbst aber in ‚H:\\Privat‘. Warum findet der Rechner das Arbeitsblatt nicht?",
              "Weil ein relativer Pfad immer vom eigenen aktuellen Ordner (hier H:\\Privat) ausgeht, nicht automatisch vom Tauschordner",
              [
                "Weil PDF-Dateien im Netzwerk niemals über Pfade geöffnet werden können",
                "Weil der Schrägstrich für relative Pfade komplett gesperrt ist",
              ],
              "Relative Pfade beziehen sich streng auf den momentanen Standort; laufwerksübergreifend braucht man den absoluten Pfad.",
              "Prüfe, von welchem aktuellen Ordner aus ‚Blatt.pdf‘ gesucht wird!",
            ),
            cc(
              "Ein Programm sucht unter ‚/home/lena/musik/lied.mp3‘ vergeblich, weil der Benutzer im Dateimanager ‚musik‘ in ‚audio‘ umbenannt hat. Warum hilft der alte Pfad nicht mehr?",
              "Der Knotenname ‚musik‘ im Verzeichnisbaum hat sich geändert, sodass die Kante unter diesem Namen nicht mehr existiert",
              [
                "Weil Linux keine Unterordner mit Kleinbuchstaben kennt",
                "Weil Musikdateien grundsätzlich direkt auf der Wurzel liegen müssen",
              ],
              "Ein Pfad folgt exakten Knoten- und Ordnernamen; benennt oder verschiebt man einen Knoten auf dem Weg, ändert sich auch der gültige Pfad.",
              "Welche Auswirkung hat das Umbenennen eines übergeordneten Ordners auf die Pfade darunter?",
            ),
            cc(
              "Du stehst im Ordner ‚H:\\Klasse6\\Biologie‘ und siehst die Pfadangabe ‚..\\Informatik\\Plan.odt‘. Wohin führt dieser relative Pfad?",
              "Zuerst eine Ebene hoch zum Elternordner ‚Klasse6‘, dann hinab in ‚Informatik‘ zur Datei ‚Plan.odt‘",
              [
                "Noch zwei Ebenen tiefer in ‚Biologie\\..‘",
                "Auf die lokale Festplatte C:\\ ins Hauptverzeichnis",
              ],
              "Das Symbol ‚..‘ steht im Pfadsystem immer für den direkten Elternordner über dem aktuellen Ordner.",
              "Wofür steht ‚..‘ beim Navigieren in Verzeichnisbäumen?",
            ),
          ],
        ),
        {
          id: "inf6-pfad-bauen",
          make(rng, level) {
            const drive = rng.pick(["C:", "H:", "T:"]);
            const top = rng.pick(["Schule", "Projekt", "Klasse6"]);
            const sub = rng.pick(["Informatik", "Biologie", "Kunst", "Musik"]);
            const file = rng.pick(["Referat.odt", "Logo.svg", "Versuch.pdf", "Plakat.svg", "Plan.pdf"]);

            if (level === 1) {
              const absWin = `${drive}\\${top}\\${sub}\\${file}`;
              const absUnix = `${drive}/${top}/${sub}/${file}`;
              return {
                prompt: `Auf Laufwerk ${drive} liegt der Ordner „${top}“, darin der Unterordner „${sub}“ und darin die Datei „${file}“. Schreibe den vollständigen absoluten Dateipfad auf.`,
                given: [
                  `Wurzel: ${drive}`,
                  `Ordnerweg: ${top} → ${sub}`,
                  `Datei: ${file}`,
                ],
                formulaHint: `Beginne bei ${drive} und trenne jeden Ordner und die Datei mit \\ (oder /).`,
                fields: [
                  textField(
                    "Absoluter Pfad",
                    [absWin, absUnix],
                    `z. B. ${drive}\\Ordner\\Unterordner\\Datei`,
                    [
                      [`${top}\\${sub}\\${file}`, `Vergiss die Wurzel „${drive}\\“ am Anfang des absoluten Pfades nicht!`],
                      [file, "Ein absoluter Pfad nennt den gesamten Weg ab der Wurzel, nicht nur den Dateinamen."],
                    ],
                  ),
                ],
                steps: [
                  `Start an der Wurzel: ${drive}`,
                  `Über „${top}“ in „${sub}“ bis „${file}“`,
                  `Absoluter Pfad: <strong>${esc(absWin)}</strong> (oder mit / statt \\)`,
                ],
              };
            }

            const deepFolder = rng.pick(["Bilder", "Entwurf", "Abgabe"]);
            const relWin = `${sub}\\${deepFolder}\\${file}`;
            const relUnix = `${sub}/${deepFolder}/${file}`;
            const wrongAbs = `${drive}\\${top}\\${sub}\\${deepFolder}\\${file}`;
            return {
              prompt: `Du bist im Dateimanager bereits in den Ordner „${drive}\\${top}“ gewechselt. Darin befindet sich der Ordner „${sub}“, darin „${deepFolder}“ und darin die Datei „${file}“. Gib den <strong>relativen Pfad</strong> ab deinem aktuellen Standort zur Datei an.`,
              given: [
                `Aktueller Ordner: ${drive}\\${top}`,
                `Tieferer Weg: ${sub} → ${deepFolder} → ${file}`,
              ],
              formulaHint: "Der relative Pfad beginnt erst nach dem aktuellen Ordner (ohne C:\\ oder den aktuellen Ordnernamen).",
              fields: [
                textField(
                  "Relativer Pfad",
                  [relWin, relUnix],
                  `z. B. ${sub}\\${deepFolder}\\${file}`,
                  [
                    [wrongAbs, "Das wäre der absolute Pfad! Für den relativen Pfad lässt du deinen aktuellen Ordner vorne weg."],
                    [`${top}\\${relWin}`, `Du bist schon in „${top}“ – starte erst beim nächsten Unterordner „${sub}“.`],
                  ],
                ),
              ],
              steps: [
                `Aktueller Ausgangsordner ist bereits „${drive}\\${top}“.`,
                `Weiterer Weg ab dort: „${sub}“ → „${deepFolder}“ → „${file}“`,
                `Relativer Pfad: <strong>${esc(relWin)}</strong> (oder mit / statt \\)`,
              ],
            };
          },
        },
      ],
    }),
  ],
};
