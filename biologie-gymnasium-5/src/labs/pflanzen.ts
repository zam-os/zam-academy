/**
 * Labs of stations 7 and 8: dissecting a flower, building flower diagrams,
 * a dichotomous key for grassland plants and a simplified model of grassland
 * management. Flower formulas follow the standard botanical counts.
 */
import { f1, label, labels, panel, svg } from "../figures/draw";
import {
  fmtDe,
  type LabDef,
  type LabState,
  num,
  remember,
  seen,
  str,
} from "./core";

/* ---------- Blüte präparieren ---------- */

const STEP_TEXT = [
  "Die ganze Kirschblüte: außen grüne Kelchblätter, dann weiße Kronblätter, viele Staubblätter und in der Mitte ein Fruchtblatt.",
  "Die fünf Kelchblätter sind abgezupft. Sie haben die Knospe geschützt.",
  "Auch die fünf Kronblätter sind entfernt. Sie locken mit Farbe und Duft Insekten an.",
  "Die vielen Staubblätter sind entfernt. In ihren Staubbeuteln entsteht der Pollen. Übrig bleibt das Fruchtblatt mit Narbe, Griffel und Fruchtknoten.",
];

export const flower: LabDef = {
  title: "Blüte präparieren",
  prompt:
    "Zupfe die Blüte mit der Pinzette von außen nach innen auseinander und lege die Teile geordnet auf das Präparierfeld.",
  init: () => ({ step: "0", cut: false }),
  controls: () => [
    {
      type: "choice",
      key: "step",
      label: "Präparierschritt",
      options: [
        { value: "0", label: "Ganze Blüte" },
        { value: "1", label: "Kelchblätter ab" },
        { value: "2", label: "Kronblätter ab" },
        { value: "3", label: "Staubblätter ab" },
      ],
    },
    {
      type: "toggle",
      key: "cut",
      label: "Fruchtknoten mit der Lupe längs aufschneiden",
    },
  ],
  goals: (s) => [
    { text: "Kelch- und Kronblätter abzupfen", met: Number(str(s, "step")) >= 2 },
    { text: "Bis zum Fruchtblatt präparieren", met: str(s, "step") === "3" },
    {
      text: "Den Fruchtknoten aufschneiden und die Samenanlage finden",
      met: str(s, "step") === "3" && s.cut === true,
    },
  ],
  draw: (s) => {
    const step = Number(str(s, "step"));
    const cut = s.cut === true && step === 3;
    const cx = 130;
    const base = 170;
    const sepals =
      step < 1
        ? [-1, 1]
            .map(
              (d) =>
                `<path d="M${cx} ${base} Q${cx + d * 50} ${base + 6} ${cx + d * 62} ${base + 26} Q${cx + d * 34} ${base + 20} ${cx} ${base}" fill="var(--f-green)" stroke="var(--f-ink)"/>`,
            )
            .join("")
        : "";
    const petals =
      step < 2
        ? [-1, 1]
            .map(
              (d) =>
                `<path d="M${cx + d * 8} ${base - 4} Q${cx + d * 70} ${base - 30} ${cx + d * 78} ${base - 80} Q${cx + d * 30} ${base - 70} ${cx + d * 8} ${base - 4}" fill="#fde7ef" stroke="#c76b8e" stroke-width="1.5"/>`,
            )
            .join("")
        : "";
    const stamens =
      step < 3
        ? Array.from({ length: 10 }, (_, i) => {
            const x = cx - 45 + i * 10;
            const top = base - 70 - Math.abs(i - 4.5) * -2;
            return `<line x1="${cx}" y1="${base - 8}" x2="${x}" y2="${f1(top)}" stroke="var(--f-line)"/><ellipse cx="${x}" cy="${f1(top - 3)}" rx="4" ry="3" fill="var(--f-yellow)" stroke="var(--f-ink)" stroke-width="0.8"/>`;
          }).join("")
        : "";
    const ovary = cut
      ? `<path d="M${cx - 16} ${base - 6} Q${cx - 18} ${base - 40} ${cx} ${base - 44} Q${cx + 18} ${base - 40} ${cx + 16} ${base - 6} Z" fill="#cfe8b0" stroke="var(--f-ink)" stroke-width="1.5"/>
         <ellipse cx="${cx}" cy="${base - 24}" rx="6" ry="9" fill="#fff6c9" stroke="var(--f-red)" stroke-width="2"/>
         ${label(cx + 26, base - 22, "Samenanlage", "lbl tiny strong", "start")}`
      : `<ellipse cx="${cx}" cy="${base - 24}" rx="16" ry="20" fill="var(--f-green)" stroke="var(--f-ink)" stroke-width="1.5"/>`;
    const tray: string[] = [];
    if (step >= 1)
      tray.push(
        `${label(270, 46, "Kelchblätter (5)", "lbl tiny", "start")}${Array.from({ length: 5 }, (_, i) => `<ellipse cx="${380 + i * 24}" cy="42" rx="9" ry="6" fill="var(--f-green)"/>`).join("")}`,
      );
    if (step >= 2)
      tray.push(
        `${label(270, 86, "Kronblätter (5)", "lbl tiny", "start")}${Array.from({ length: 5 }, (_, i) => `<ellipse cx="${380 + i * 24}" cy="82" rx="10" ry="8" fill="#fde7ef" stroke="#c76b8e"/>`).join("")}`,
      );
    if (step >= 3)
      tray.push(
        `${label(270, 126, "Staubblätter (viele)", "lbl tiny", "start")}${Array.from({ length: 12 }, (_, i) => `<line x1="${378 + i * 10}" y1="140" x2="${378 + i * 10}" y2="124" stroke="var(--f-line)"/><ellipse cx="${378 + i * 10}" cy="122" rx="3.5" ry="2.5" fill="var(--f-yellow)"/>`).join("")}`,
      );
    return svg(
      520,
      236,
      `Kirschblüte, Präparierschritt ${step}: ${["ganze Blüte", "ohne Kelchblätter", "ohne Kelch- und Kronblätter", "nur noch das Fruchtblatt"][step]}`,
      `${panel(8, 8, 244, 220, "panel-bg")}
       <line x1="${cx}" y1="${base}" x2="${cx}" y2="222" stroke="var(--f-green)" stroke-width="5"/>
       ${sepals}${petals}${stamens}
       <line x1="${cx}" y1="${base - 44}" x2="${cx}" y2="${base - 84}" stroke="var(--f-green)" stroke-width="3"/>
       <ellipse cx="${cx}" cy="${base - 86}" rx="7" ry="4" fill="#9ccc65" stroke="var(--f-ink)"/>
       ${ovary}
       ${step === 3 ? `${label(cx + 14, base - 86, "Narbe", "lbl tiny", "start")}${label(cx + 8, base - 62, "Griffel", "lbl tiny", "start")}${cut ? "" : label(cx + 22, base - 22, "Fruchtknoten", "lbl tiny", "start")}` : ""}
       ${panel(260, 8, 252, 220, "panel-bg")}
       ${label(386, 24, "Präparierfeld", "lbl small strong", "middle")}
       ${tray.join("") || labels(386, 110, "Noch leer: Beginne\nmit den Kelchblättern.", "lbl small muted", "middle", 16)}
       ${step === 3 ? label(270, 176, `Fruchtblatt (1)${cut ? " · aufgeschnitten" : ""}`, "lbl tiny", "start") : ""}`,
    );
  },
  readout: (s) => {
    const step = Number(str(s, "step"));
    if (s.cut === true && step < 3)
      return `${STEP_TEXT[step]} Zum Aufschneiden müssen erst alle äußeren Blütenteile entfernt sein.`;
    return step === 3 && s.cut === true
      ? "Im aufgeschnittenen Fruchtknoten liegt die Samenanlage mit der Eizelle. Nach der Befruchtung wird daraus der Samen, der Fruchtknoten wird zur Frucht (bei der Kirsche das Fruchtfleisch mit dem Kern)."
      : STEP_TEXT[step];
  },
};

/* ---------- Blütendiagramm ---------- */

export const FLOWERS: Record<
  string,
  { name: string; k: string; c: string; a: string; g: string; note: string; colour: string }
> = {
  kirsche: {
    name: "Kirsche",
    k: "5",
    c: "5",
    a: "viele",
    g: "1",
    note: "5 freie Kelchblätter, 5 freie weiße Kronblätter, viele Staubblätter, 1 Fruchtblatt.",
    colour: "#fde7ef",
  },
  raps: {
    name: "Raps",
    k: "4",
    c: "4",
    a: "6",
    g: "2",
    note: "4 Kelchblätter, 4 gelbe Kronblätter über Kreuz, 6 Staubblätter (4 lange, 2 kurze), 2 verwachsene Fruchtblätter.",
    colour: "#ffe066",
  },
  salbei: {
    name: "Wiesen-Salbei",
    k: "5",
    c: "5",
    a: "2",
    g: "2",
    note: "5 verwachsene Kelchblätter, 5 zu Ober- und Unterlippe verwachsene Kronblätter, nur 2 Staubblätter, 2 verwachsene Fruchtblätter.",
    colour: "#b39ddb",
  },
};

export const matchesFlower = (s: LabState, key: string): boolean => {
  const f = FLOWERS[key];
  return (
    str(s, "target") === key &&
    str(s, "k") === f.k &&
    str(s, "c") === f.c &&
    str(s, "a") === f.a &&
    str(s, "g") === f.g
  );
};

export const flowerDiagram: LabDef = {
  title: "Blütendiagramm",
  prompt:
    "Zähle die Blütenteile der Vorlage und baue das Blütendiagramm: Kelch außen, dann Krone, Staubblätter und in der Mitte der Fruchtknoten.",
  init: () => ({ target: "kirsche", k: "4", c: "4", a: "5", g: "2" }),
  controls: () => [
    {
      type: "choice",
      key: "target",
      label: "Vorlage",
      options: Object.entries(FLOWERS).map(([value, f]) => ({ value, label: f.name })),
    },
    { type: "choice", key: "k", label: "Kelchblätter", options: ["4", "5"].map((v) => ({ value: v, label: v })) },
    { type: "choice", key: "c", label: "Kronblätter", options: ["4", "5"].map((v) => ({ value: v, label: v })) },
    {
      type: "choice",
      key: "a",
      label: "Staubblätter",
      options: ["2", "5", "6", "viele"].map((v) => ({ value: v, label: v })),
    },
    { type: "choice", key: "g", label: "Fruchtblätter", options: ["1", "2"].map((v) => ({ value: v, label: v })) },
  ],
  goals: () => [],
  draw: () => "",
  readout: () => "",
};

function ring(n: number, r: number, shape: (x: number, y: number, deg: number) => string, offset = 0): string {
  return Array.from({ length: n }, (_, i) => {
    const a = ((i + offset) / n) * Math.PI * 2 - Math.PI / 2;
    return shape(120 + r * Math.cos(a), 120 + r * Math.sin(a), (a * 180) / Math.PI + 90);
  }).join("");
}

flowerDiagram.goals = (s) => [
  { text: "Das Blütendiagramm der Kirsche bauen", met: matchesFlower(s, "kirsche") },
  { text: "Das Blütendiagramm des Rapses bauen", met: matchesFlower(s, "raps") },
  { text: "Das Blütendiagramm des Wiesen-Salbeis bauen", met: matchesFlower(s, "salbei") },
];

flowerDiagram.draw = (s) => {
  const f = FLOWERS[str(s, "target")];
  const k = Number(str(s, "k"));
  const c = Number(str(s, "c"));
  const a = str(s, "a") === "viele" ? 16 : Number(str(s, "a"));
  const g = Number(str(s, "g"));
  const crescent = (colour: string, w: number) => (x: number, y: number, deg: number) =>
    `<path d="M${f1(-w)} 0 Q0 ${f1(-w * 0.9)} ${f1(w)} 0 Q0 ${f1(-w * 0.35)} ${f1(-w)} 0 Z" transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(deg)})" fill="${colour}" stroke="var(--f-ink)"/>`;
  const anther = (x: number, y: number, deg: number) =>
    `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(deg)})"><ellipse cx="-4" cy="0" rx="4" ry="5" fill="var(--f-yellow)" stroke="var(--f-ink)"/><ellipse cx="4" cy="0" rx="4" ry="5" fill="var(--f-yellow)" stroke="var(--f-ink)"/></g>`;
  const ovary =
    g === 1
      ? `<circle cx="120" cy="120" r="18" fill="var(--f-green)" stroke="var(--f-ink)" stroke-width="2"/><circle cx="120" cy="120" r="4" fill="#fff6c9"/>`
      : `<circle cx="120" cy="120" r="18" fill="var(--f-green)" stroke="var(--f-ink)" stroke-width="2"/><line x1="102" y1="120" x2="138" y2="120" stroke="var(--f-ink)" stroke-width="2"/><circle cx="120" cy="112" r="3.5" fill="#fff6c9"/><circle cx="120" cy="128" r="3.5" fill="#fff6c9"/>`;
  const ref = Array.from({ length: Number(f.c) }, (_, i) => {
    const ang = (i / Number(f.c)) * Math.PI * 2;
    return `<ellipse cx="${f1(400 + 40 * Math.cos(ang))}" cy="${f1(106 + 40 * Math.sin(ang))}" rx="28" ry="18" transform="rotate(${f1((ang * 180) / Math.PI)} ${f1(400 + 40 * Math.cos(ang))} ${f1(106 + 40 * Math.sin(ang))})" fill="${f.colour}" stroke="var(--f-ink)"/>`;
  }).join("");
  return svg(
    520,
    246,
    `Blütendiagramm mit ${k} Kelchblättern, ${c} Kronblättern, ${str(s, "a")} Staubblättern und ${g} Fruchtblättern; Vorlage ${f.name}`,
    `${panel(8, 8, 232, 230, "panel-bg")}
     <circle cx="120" cy="120" r="104" fill="none" stroke="var(--f-line)" stroke-dasharray="3 4"/>
     ${ring(k, 92, crescent("var(--f-green)", 20))}
     ${ring(c, 70, crescent(f.colour, 18), 0.5)}
     ${ring(a, a > 8 ? 46 : 46, anther, 0.25)}
     ${ovary}
     ${panel(248, 8, 264, 230, "panel-bg")}
     ${label(380, 30, `Vorlage: ${f.name}`, "lbl strong", "middle")}
     ${ref}
     <circle cx="400" cy="106" r="16" fill="var(--f-yellow)" stroke="var(--f-ink)"/>
     ${labels(262, 182, f.note.replace(/, /g, ",\n"), "lbl tiny", "start", 13)}`,
  );
};

flowerDiagram.readout = (s) => {
  const f = FLOWERS[str(s, "target")];
  const ok = matchesFlower(s, str(s, "target"));
  return ok
    ? `Richtig: K${f.k} C${f.c} A ${f.a} G${f.g}. Das Diagramm zeigt Anzahl und Anordnung, aber nicht Größe, Farbe oder Duft der echten Blüte.`
    : `Dein Diagramm: ${str(s, "k")} Kelch-, ${str(s, "c")} Kron-, ${str(s, "a")} Staub- und ${str(s, "g")} Fruchtblätter. Zähle an der Vorlage nach.`;
};

/* ---------- Bestimmungsschlüssel ---------- */

export const PLANTS: Record<
  string,
  { name: string; features: string; colour: string }
> = {
  loewenzahn: {
    name: "Gewöhnlicher Löwenzahn",
    features: "Ganz gelbes Körbchen aus vielen Zungenblüten · hohler Stängel mit weißem Milchsaft · gezähnte Blätter in einer Rosette",
    colour: "#ffd23f",
  },
  margerite: {
    name: "Wiesen-Margerite",
    features: "Körbchen mit weißen Zungenblüten außen und gelber Mitte · kein Milchsaft",
    colour: "#ffffff",
  },
  salbei: {
    name: "Wiesen-Salbei",
    features: "Blauviolette Blüten mit Ober- und Unterlippe · vierkantiger Stängel · Blätter gegenständig",
    colour: "#7e57c2",
  },
  klee: {
    name: "Rot-Klee",
    features: "Rosarote, kugelige Blütenköpfchen · dreizählige Blätter · runder Stängel",
    colour: "#e57399",
  },
  hahnenfuss: {
    name: "Scharfer Hahnenfuß",
    features: "Fünf glänzend gelbe Kronblätter · Blätter handförmig geteilt · runder Stängel",
    colour: "#f5c400",
  },
  spitzwegerich: {
    name: "Spitzwegerich",
    features: "Unscheinbare bräunliche Blütenähren · schmale Blätter mit Längsnerven in einer Rosette",
    colour: "#8d6e63",
  },
};

interface KeyNode {
  q: string;
  ja: string;
  nein: string;
}

/** Leaves are plant ids; inner nodes are "q0" … "q4". */
export const KEY: Record<string, KeyNode> = {
  q0: { q: "Sind die Blüten bunt und auffällig?", ja: "q1", nein: "spitzwegerich" },
  q1: {
    q: "Sieht der Blütenstand aus wie eine einzige große Blüte mit vielen schmalen Blättchen (ein Körbchen wie beim Gänseblümchen)?",
    ja: "q2",
    nein: "q3",
  },
  q2: { q: "Ist das Körbchen ganz gelb und enthält der Stängel weißen Milchsaft?", ja: "loewenzahn", nein: "margerite" },
  q3: { q: "Ist der Stängel vierkantig und hat die Blüte eine Ober- und eine Unterlippe?", ja: "salbei", nein: "q4" },
  q4: { q: "Sind die Blätter dreizählig und die Blüten rosarote Köpfchen?", ja: "klee", nein: "hahnenfuss" },
};

export function keyPosition(answers: string): string {
  let node = "q0";
  for (const a of answers) {
    const current = KEY[node];
    if (!current) break;
    node = a === "j" ? current.ja : current.nein;
  }
  return node;
}

export const key: LabDef = {
  title: "Bestimmungsschlüssel",
  prompt:
    "Wähle ein Fundstück aus der Wiese. Lies seine Merkmale und beantworte die Fragen des Schlüssels Schritt für Schritt.",
  init: () => ({ plant: "klee", answers: "", identified: "" }),
  controls: (s) => [
    {
      type: "choice",
      key: "plant",
      label: "Fundstück",
      options: Object.keys(PLANTS).map((value, i) => ({ value, label: `Pflanze ${i + 1}` })),
    },
    KEY[keyPosition(str(s, "answers"))]
      ? {
          type: "actions",
          key: "answer",
          label: "Antwort",
          options: [
            { value: "j", label: "Ja" },
            { value: "n", label: "Nein" },
          ],
        }
      : {
          type: "actions",
          key: "answer",
          label: "Weiter",
          options: [{ value: "reset", label: "Neu bestimmen" }],
        },
  ],
  set: (s, k, value) => {
    if (k === "plant") {
      s.plant = value;
      s.answers = "";
      return;
    }
    if (value === "reset") {
      s.answers = "";
      return;
    }
    if (!KEY[keyPosition(str(s, "answers"))]) return;
    s.answers = `${str(s, "answers")}${value}`;
    const end = keyPosition(str(s, "answers"));
    if (!KEY[end] && end === str(s, "plant")) remember(s, "identified", end);
  },
  goals: (s) => [
    {
      text: "Eine gelb blühende Pflanze richtig bestimmen",
      met: seen(s, "identified", "loewenzahn") || seen(s, "identified", "hahnenfuss"),
    },
    { text: "Den Wiesen-Salbei richtig bestimmen", met: seen(s, "identified", "salbei") },
    {
      text: "Drei verschiedene Pflanzen richtig bestimmen",
      met: String(s.identified).split(",").filter(Boolean).length >= 3,
    },
  ],
  draw: (s) => {
    const p = PLANTS[str(s, "plant")];
    const plant = str(s, "plant");
    const node = keyPosition(str(s, "answers"));
    const flowerShape =
      plant === "spitzwegerich"
        ? `<ellipse cx="110" cy="70" rx="9" ry="22" fill="${p.colour}"/><line x1="110" y1="92" x2="110" y2="200" stroke="var(--f-green)" stroke-width="3"/>`
        : plant === "klee"
          ? `<circle cx="110" cy="78" r="22" fill="${p.colour}" stroke="var(--f-ink)"/><line x1="110" y1="100" x2="110" y2="200" stroke="var(--f-green)" stroke-width="4"/>${[-1, 1].map((d) => `<g transform="translate(${110 + d * 34} 150)">${[0, 120, 240].map((r) => `<ellipse cx="0" cy="-9" rx="6" ry="10" fill="var(--f-green)" transform="rotate(${r})"/>`).join("")}</g>`).join("")}`
          : plant === "salbei"
            ? `${[0, 1, 2].map((i) => `<path d="M${102 - i * 2} ${60 + i * 26} q-14 -8 -18 4 q10 6 18 -4 Z M${118 + i * 2} ${60 + i * 26} q16 -10 22 2 q-12 8 -22 -2 Z" fill="${p.colour}"/>`).join("")}<rect x="107" y="50" width="7" height="150" fill="var(--f-green)"/>`
            : `${Array.from({ length: plant === "hahnenfuss" ? 5 : 16 }, (_, i) => {
                const n = plant === "hahnenfuss" ? 5 : 16;
                const a = (i / n) * Math.PI * 2;
                const r = plant === "hahnenfuss" ? 14 : 22;
                return `<ellipse cx="${f1(110 + r * Math.cos(a))}" cy="${f1(76 + r * Math.sin(a))}" rx="${plant === "hahnenfuss" ? 11 : 12}" ry="${plant === "hahnenfuss" ? 9 : 3.5}" transform="rotate(${f1((a * 180) / Math.PI)} ${f1(110 + r * Math.cos(a))} ${f1(76 + r * Math.sin(a))})" fill="${p.colour}" stroke="var(--f-line)" stroke-width="0.6"/>`;
              }).join("")}<circle cx="110" cy="76" r="${plant === "margerite" ? 10 : 6}" fill="${plant === "loewenzahn" ? "#f5b700" : "#f5c400"}"/><line x1="110" y1="98" x2="110" y2="200" stroke="var(--f-green)" stroke-width="4"/>`;
    const path = str(s, "answers")
      .split("")
      .map((a, i) => `${i + 1}. ${a === "j" ? "ja" : "nein"}`)
      .join(" · ");
    return svg(
      540,
      240,
      `Fundstück ${Object.keys(PLANTS).indexOf(plant) + 1} mit Merkmalen und aktuellem Schritt im Bestimmungsschlüssel`,
      `${panel(8, 8, 204, 224, "panel-bg")}${flowerShape}
       ${panel(220, 8, 312, 224, "panel-bg")}
       ${label(236, 32, "Merkmale", "lbl small strong", "start")}
       ${labels(236, 52, p.features.split(" · ").join("\n"), "lbl tiny", "start", 15)}
       <line x1="236" y1="116" x2="516" y2="116" stroke="var(--f-line)"/>
       ${KEY[node] ? labels(236, 140, wrap(KEY[node].q, 44), "lbl small strong", "start", 16) : labels(236, 146, `Ergebnis: ${PLANTS[node].name}\n${node === plant ? "✓ passt zu den Merkmalen" : "✗ passt nicht: Prüfe deine Antworten"}`, "lbl small strong", "start", 20)}
       ${label(236, 222, path || "Noch keine Antwort", "lbl tiny muted", "start")}`,
    );
  },
  readout: (s) => {
    const node = keyPosition(str(s, "answers"));
    if (KEY[node]) return `Frage: ${KEY[node].q}`;
    return node === str(s, "plant")
      ? `Bestimmt: ${PLANTS[node].name}. Alle Antworten passen zu den Merkmalen.`
      : `Der Schlüssel führt zu ${PLANTS[node].name}, das passt nicht zu den Merkmalen. Beginne neu und lies jede Frage genau.`;
  },
};

function wrap(text: string, width: number): string {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > width) {
      lines.push(line.trim());
      line = word;
    } else line = `${line} ${word}`;
  }
  if (line.trim()) lines.push(line.trim());
  return lines.join("\n");
}

/* ---------- Bewirtschaftung von Grünland ---------- */

/** Vereinfachtes Lernmodell mit Indexwerten von 0 bis 100, keine Messwerte. */
export function meadowModel(cuts: number, dung: number) {
  const fodder = Math.min(100, 20 + 12 * cuts + 15 * dung);
  const species = Math.max(5, 85 - 10 * cuts - 12 * dung);
  return { fodder, species };
}

const DUNG = ["keine Düngung", "wenig Dünger", "viel Dünger"];

export const meadow: LabDef = {
  title: "Wiese bewirtschaften",
  prompt:
    "Wie oft wird gemäht und wie stark gedüngt? Vergleiche Futtermenge und Artenvielfalt in diesem vereinfachten Modell.",
  init: () => ({ cuts: 5, dung: "0" }),
  controls: () => [
    {
      type: "range",
      key: "cuts",
      label: "Schnitte pro Jahr",
      min: 1,
      max: 5,
      step: 1,
      format: (v) => `${fmtDe(v)}-mal`,
    },
    {
      type: "choice",
      key: "dung",
      label: "Düngung",
      options: DUNG.map((label, i) => ({ value: String(i), label })),
    },
  ],
  goals: (s) => {
    const m = meadowModel(num(s, "cuts"), Number(str(s, "dung")));
    return [
      { text: "Möglichst viel Futter erzeugen (Futter-Index ab 85)", met: m.fodder >= 85 },
      { text: "Eine artenreiche Wiese erhalten (Arten-Index ab 60)", met: m.species >= 60 },
      {
        text: "Einen Kompromiss finden: Futter-Index ab 55 und Arten-Index ab 45",
        met: m.fodder >= 55 && m.species >= 45,
      },
    ];
  },
  draw: (s) => {
    const cuts = num(s, "cuts");
    const m = meadowModel(cuts, Number(str(s, "dung")));
    const colours = ["#7e57c2", "#e57399", "#f5c400", "#ffffff", "#42a5f5", "#ef6c00", "#ab47bc", "#d81b60"];
    const kinds = Math.max(1, Math.round(m.species / 11));
    const flowers = Array.from({ length: 26 }, (_, i) => {
      const x = 22 + i * 9.4;
      const h = 30 + ((i * 37) % 23) + (6 - cuts) * 8;
      const colour = colours[i % kinds];
      return `<line x1="${f1(x)}" y1="200" x2="${f1(x)}" y2="${f1(200 - h)}" stroke="var(--f-green)" stroke-width="2"/>${i % 2 === 0 ? `<circle cx="${f1(x)}" cy="${f1(200 - h)}" r="4" fill="${colour}" stroke="var(--f-line)" stroke-width="0.5"/>` : ""}`;
    }).join("");
    const bar = (y: number, name: string, value: number, colour: string) =>
      `${label(296, y - 6, `${name}: ${value >= 70 ? "hoch" : value >= 45 ? "mittel" : "gering"}`, "lbl small strong", "start")}<rect x="296" y="${y}" width="200" height="16" rx="8" fill="var(--f-stone)" opacity="0.35"/><rect x="296" y="${y}" width="${f1(value * 2)}" height="16" rx="8" fill="${colour}"/>`;
    return svg(
      520,
      236,
      `Wiese mit ${cuts} Schnitten pro Jahr und ${DUNG[Number(str(s, "dung"))]}: Futter-Index ${m.fodder}, Arten-Index ${m.species}`,
      `${panel(8, 8, 272, 220, "panel-bg")}
       <rect x="14" y="200" width="260" height="22" fill="var(--f-earth)" opacity="0.6"/>
       ${flowers}
       ${label(144, 32, `${cuts} Schnitte · ${DUNG[Number(str(s, "dung"))]}`, "lbl small strong", "middle")}
       ${panel(288, 8, 224, 220, "panel-bg")}
       ${bar(60, "Futtermenge", m.fodder, "var(--f-green)")}
       ${bar(120, "Artenvielfalt", m.species, "var(--f-purple)")}
       ${labels(296, 172, "Vereinfachtes Modell\nmit Indexwerten,\nkeine Messwerte", "lbl tiny muted", "start", 14)}`,
    );
  },
  readout: (s) => {
    const cuts = num(s, "cuts");
    const dung = Number(str(s, "dung"));
    const m = meadowModel(cuts, dung);
    return `Futter-Index ${m.fodder}, Arten-Index ${m.species} (Modell). ${cuts >= 4 ? "Bei häufigem Mähen können viele Wiesenblumen keine Samen mehr bilden." : "Bei seltenem Mähen blühen viele Wiesenblumen und bilden Samen."} ${dung >= 2 ? "Viel Dünger fördert schnell wachsende Gräser, die andere Arten verdrängen." : ""}`.trim();
  },
};
