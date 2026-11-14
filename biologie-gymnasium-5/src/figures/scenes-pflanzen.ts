/** Drawings of stations 7 and 8: flowers, pollination, plant families, grassland. */
import { arrow, cardGrid, compare, f1, label, labels, panel, svg } from "./draw";

const C = {
  blue: "var(--f-blue)",
  green: "var(--f-green)",
  orange: "var(--f-orange)",
  red: "var(--f-red)",
  purple: "var(--f-purple)",
  pink: "var(--f-pink)",
  stone: "#59636e",
};

export const blueteSchnitt = (): string =>
  svg(
    600,
    300,
    "Längsschnitt durch eine Kirschblüte mit Kelchblatt, Kronblatt, Staubblatt aus Staubfaden und Staubbeutel sowie Fruchtblatt aus Narbe, Griffel und Fruchtknoten mit Samenanlage",
    `${panel(8, 8, 584, 284, "panel-bg")}
     <line x1="240" y1="230" x2="240" y2="290" stroke="var(--f-green)" stroke-width="6"/>
     <path d="M180 220 Q240 250 300 220 L280 200 Q240 214 200 200 Z" fill="#9ccc65" stroke="var(--f-ink)"/>
     <path d="M200 214 Q150 222 130 250 Q170 240 206 222 Z M280 214 Q330 222 350 250 Q310 240 274 222 Z" fill="var(--f-green)" stroke="var(--f-ink)"/>
     <path d="M206 204 Q120 170 110 90 Q170 110 220 196 Z M274 204 Q360 170 370 90 Q310 110 260 196 Z" fill="#fde7ef" stroke="#c76b8e" stroke-width="2"/>
     ${[-1, 1].flatMap((d) => [0, 1, 2].map((i) => `<line x1="${240 + d * (8 + i * 6)}" y1="200" x2="${240 + d * (30 + i * 14)}" y2="${120 - i * 6}" stroke="var(--f-line)" stroke-width="2"/><ellipse cx="${240 + d * (30 + i * 14)}" cy="${116 - i * 6}" rx="6" ry="4" fill="var(--f-yellow)" stroke="var(--f-ink)"/>`)).join("")}
     <path d="M226 206 Q222 170 240 166 Q258 170 254 206 Z" fill="#cfe8b0" stroke="var(--f-ink)" stroke-width="1.5"/>
     <ellipse cx="240" cy="190" rx="6" ry="9" fill="#fff6c9" stroke="var(--f-red)" stroke-width="1.5"/>
     <line x1="240" y1="166" x2="240" y2="100" stroke="#9ccc65" stroke-width="5"/>
     <ellipse cx="240" cy="96" rx="9" ry="5" fill="#7cb342" stroke="var(--f-ink)"/>
     ${[
       [250, 96, "Narbe", 60],
       [244, 130, "Griffel", 92],
       [254, 180, "Fruchtknoten", 150],
       [246, 192, "Samenanlage mit Eizelle", 176],
       [282, 104, "Staubbeutel: Pollen", 120],
       [346, 110, "Kronblatt: lockt an", 210],
       [330, 236, "Kelchblatt: schützt die Knospe", 244],
     ]
       .map(([x, y, t, ly]) => `<line x1="${x}" y1="${y}" x2="400" y2="${ly}" stroke="var(--f-ink)" opacity="0.55"/>${label(406, Number(ly) + 4, String(t), "lbl tiny", "start")}`)
       .join("")}
     <line x1="226" y1="150" x2="90" y2="150" stroke="var(--f-ink)" opacity="0.55"/>${labels(84, 146, "Staubfaden\n(Staubblatt)", "lbl tiny", "end", 14)}
     ${labels(30, 40, "männlich: Staubblätter\nweiblich: Fruchtblatt", "lbl tiny strong", "start", 15)}`,
  );

export const diagrammSymbole = (): string =>
  svg(
    600,
    210,
    "Zeichen im Blütendiagramm: grüne Bögen für Kelchblätter, farbige Bögen für Kronblätter, Doppelovale für Staubbeutel, Kreis mit Kammern für den Fruchtknoten",
    `${panel(8, 8, 584, 194, "panel-bg")}
     ${[
       [60, `<path d="M-18 0 Q0 -16 18 0 Q0 -6 -18 0 Z" fill="var(--f-green)" stroke="var(--f-ink)"/>`, "Kelchblatt"],
       [190, `<path d="M-18 0 Q0 -16 18 0 Q0 -6 -18 0 Z" fill="#fde7ef" stroke="var(--f-ink)"/>`, "Kronblatt"],
       [320, `<ellipse cx="-4" cy="0" rx="4" ry="6" fill="var(--f-yellow)" stroke="var(--f-ink)"/><ellipse cx="4" cy="0" rx="4" ry="6" fill="var(--f-yellow)" stroke="var(--f-ink)"/>`, "Staubblatt\n(Querschnitt)"],
       [460, `<circle r="16" fill="var(--f-green)" stroke="var(--f-ink)" stroke-width="2"/><line x1="-16" y1="0" x2="16" y2="0" stroke="var(--f-ink)" stroke-width="2"/><circle cy="-7" r="3" fill="#fff6c9"/><circle cy="7" r="3" fill="#fff6c9"/>`, "Fruchtknoten\naus 2 Fruchtblättern"],
     ]
       .map(([x, shape, t]) => `<g transform="translate(${x} 70) scale(1.6)">${shape}</g>${labels(Number(x), 120, String(t), "lbl tiny strong", "middle", 14)}`)
       .join("")}
     ${labels(300, 166, "Das Diagramm ist ein Grundriss von oben: Es zeigt Anzahl und Anordnung,\naber nicht Größe, Farbe, Duft oder Form der Blütenteile.", "lbl tiny", "middle", 15)}`,
  );

export const pollenschlauch = (): string =>
  svg(
    600,
    300,
    "Bestäubung und Befruchtung: Ein Pollenkorn landet auf der Narbe, ein Pollenschlauch wächst durch den Griffel zur Samenanlage, die männliche Keimzelle verschmilzt mit der Eizelle",
    `${panel(8, 8, 300, 284, "panel-bg")}
     <path d="M110 260 Q100 200 150 190 Q200 200 190 260 Z" fill="#cfe8b0" stroke="var(--f-ink)" stroke-width="2"/>
     <ellipse cx="150" cy="232" rx="14" ry="20" fill="#fff6c9" stroke="var(--f-red)" stroke-width="2"/>
     <circle cx="150" cy="238" r="5" fill="var(--f-purple)"/>
     <rect x="143" y="70" width="14" height="122" fill="#9ccc65"/>
     <ellipse cx="150" cy="64" rx="26" ry="10" fill="#7cb342" stroke="var(--f-ink)"/>
     <circle cx="150" cy="50" r="9" fill="var(--f-yellow)" stroke="var(--f-ink)"/>
     <circle cx="150" cy="50" r="3" fill="var(--f-blue)"/>
     <path d="M150 58 Q154 120 146 170 Q144 210 150 226" fill="none" stroke="var(--f-orange)" stroke-width="3"/>
     <circle cx="147" cy="198" r="3.5" fill="var(--f-blue)" stroke="var(--f-ink)"/>
     <path d="M144 198 L64 186" stroke="var(--f-ink)" stroke-width="1"/>
     ${label(172, 50, "Pollenkorn", "lbl tiny", "start")}
     ${label(184, 70, "Narbe", "lbl tiny", "start")}
     ${label(164, 130, "Pollenschlauch im Griffel", "lbl tiny", "start")}
     ${labels(18, 166, "männliche Keimzelle\naus dem Pollenkorn", "lbl tiny", "start", 13)}
     ${labels(196, 232, "Eizelle in der\nSamenanlage", "lbl tiny", "start", 13)}
     ${panel(316, 8, 276, 284, "panel-bg")}
     ${label(454, 32, "Zwei Schritte", "lbl small strong", "middle")}
     ${labels(330, 62, "1 Bestäubung:\nPollen gelangt durch Wind\noder Tiere auf die Narbe\neiner Blüte derselben Art.", "lbl tiny", "start", 15)}
     ${labels(330, 150, "2 Befruchtung:\nDer Pollenschlauch wächst\nzur Samenanlage. Die männ-\nliche Keimzelle aus dem Pollen-\nkorn verschmilzt mit der Eizelle.", "lbl tiny", "start", 15)}
     ${labels(330, 248, "Danach: Samenanlage → Samen,\nFruchtknoten → Frucht", "lbl tiny strong", "start", 15)}`,
  );

export const vergleichMenschPflanze = (): string =>
  compare(
    "Geschlechtliche Fortpflanzung bei Samenpflanzen und beim Menschen im Vergleich",
    {
      head: "Samenpflanze",
      colour: C.green,
      points: [
        "Keimzellen: männliche Keimzelle und Eizelle",
        "Pollenkorn bringt sie zur Narbe (Wind, Tiere)",
        "Befruchtung in der Samenanlage",
        "aus der befruchteten Eizelle: Keimling im Samen",
        "Samen keimt außerhalb der Mutterpflanze",
      ],
    },
    {
      head: "Mensch",
      colour: C.red,
      points: [
        "Keimzellen: Spermienzelle und Eizelle",
        "Spermien gelangen beim Geschlechtsverkehr",
        "Befruchtung im Eileiter",
        "aus der befruchteten Eizelle: Embryo",
        "Kind wächst in der Gebärmutter heran",
      ],
    },
  );

export const windTier = (): string =>
  svg(
    600,
    280,
    "Windbestäubung bei der Hasel und Tierbestäubung bei der Kirsche mit ihren Kosten und ihrem Nutzen",
    `${panel(8, 8, 288, 264, "panel-bg")}
     ${label(152, 30, "Windbestäubung: Hasel", "lbl small strong", "middle")}
     <path d="M60 50 L240 80" stroke="var(--f-wood)" stroke-width="5"/>
     ${[90, 140, 190].map((x) => `<path d="M${x} ${58 + (x - 60) / 6} q-6 30 4 56 q8 -26 -4 -56" fill="#d4b55a" stroke="var(--f-ink)" stroke-width="0.8"/>`).join("")}
     ${Array.from({ length: 30 }, (_, i) => `<circle cx="${f1(110 + (i * 37) % 160)}" cy="${f1(130 + (i * 23) % 40)}" r="1.8" fill="#c9a227"/>`).join("")}
     ${arrow(60, 150, 120, 150, "arrow thin")}
     ${labels(22, 196, "+ keine Blütenblätter, kein Nektar\n+ blüht früh, ohne Insekten\n− riesige Mengen Pollen nötig\n− meist landet Pollen daneben", "lbl tiny", "start", 16)}
     ${panel(304, 8, 288, 264, "panel-bg")}
     ${label(448, 30, "Tierbestäubung: Kirsche", "lbl small strong", "middle")}
     ${Array.from({ length: 5 }, (_, i) => {
       const a = (i / 5) * Math.PI * 2;
       return `<ellipse cx="${f1(420 + 26 * Math.cos(a))}" cy="${f1(100 + 26 * Math.sin(a))}" rx="20" ry="14" transform="rotate(${f1((a * 180) / Math.PI)} ${f1(420 + 26 * Math.cos(a))} ${f1(100 + 26 * Math.sin(a))})" fill="#fde7ef" stroke="#c76b8e"/>`;
     }).join("")}
     <circle cx="420" cy="100" r="10" fill="var(--f-yellow)"/>
     <ellipse cx="500" cy="80" rx="14" ry="9" fill="#f5b700" stroke="var(--f-ink)"/><path d="M490 76 h20 M490 84 h20" stroke="var(--f-ink)"/><ellipse cx="494" cy="70" rx="8" ry="5" fill="var(--f-white)" opacity="0.8"/>
     ${labels(318, 196, "+ wenig Pollen reicht, Insekt\n   bringt ihn gezielt zur Blüte\n− Kosten für Farbe, Duft, Nektar\n− abhängig von Bestäubern", "lbl tiny", "start", 16)}`,
  );

export const bauplanSamenpflanze = (): string =>
  svg(
    600,
    300,
    "Grundbauplan einer Samenpflanze mit Wurzel, Sprossachse, Laubblättern und Blüte",
    `${panel(8, 8, 584, 284, "panel-bg")}
     <rect x="20" y="210" width="560" height="74" fill="var(--f-earth)" opacity="0.35"/>
     <path d="M260 210 L260 70" stroke="var(--f-green)" stroke-width="6"/>
     <path d="M260 160 Q220 140 200 160 Q224 176 260 160 M260 120 Q300 100 320 120 Q296 136 260 120" fill="var(--f-green)" stroke="var(--f-forest)"/>
     ${Array.from({ length: 5 }, (_, i) => {
       const a = (i / 5) * Math.PI * 2;
       return `<ellipse cx="${f1(260 + 16 * Math.cos(a))}" cy="${f1(56 + 16 * Math.sin(a))}" rx="12" ry="8" transform="rotate(${f1((a * 180) / Math.PI)} ${f1(260 + 16 * Math.cos(a))} ${f1(56 + 16 * Math.sin(a))})" fill="var(--f-yellow)" stroke="var(--f-ink)"/>`;
     }).join("")}
     <path d="M260 210 L250 250 L230 270 M260 210 L268 254 L290 272 M260 210 L262 280" fill="none" stroke="var(--f-wood)" stroke-width="3"/>
     ${[
       [280, 56, "Blüte: Fortpflanzung", 56],
       [318, 120, "Laubblatt", 120],
       [264, 180, "Sprossachse (Stängel)", 180],
       [290, 262, "Wurzel", 262],
     ]
       .map(([x, y, t, ly]) => `<line x1="${x}" y1="${y}" x2="380" y2="${ly}" stroke="var(--f-ink)" opacity="0.55"/>${label(386, Number(ly) + 4, String(t), "lbl small", "start")}`)
       .join("")}
     ${labels(30, 40, "Alle Samenpflanzen\nhaben diese\nGrundorgane.\nForm, Zahl und\nAnordnung unter-\nscheiden die Arten.", "lbl tiny", "start", 15)}`,
  );

export const kreuzLippen = (): string =>
  compare(
    "Kennzeichen der Kreuzblütler und der Lippenblütler im Vergleich",
    {
      head: "Kreuzblütler (z. B. Raps)",
      colour: "#c79a00",
      points: [
        "4 Kelch- und 4 Kronblätter über Kreuz",
        "6 Staubblätter: 4 lange, 2 kurze",
        "Fruchtknoten aus 2 Fruchtblättern",
        "Früchte als Schoten oder Schötchen",
        "Blüten oft in Trauben",
      ],
    },
    {
      head: "Lippenblütler (z. B. Wiesen-Salbei)",
      colour: C.purple,
      points: [
        "Krone mit Ober- und Unterlippe",
        "Stängel vierkantig",
        "Blätter gegenständig",
        "oft 4 oder 2 Staubblätter",
        "viele duften (Minze, Salbei, Thymian)",
      ],
    },
  );

export const schluesselBaum = (): string => {
  const box = (x: number, y: number, t: string, leaf = false) =>
    `<rect x="${x - 70}" y="${y - 16}" width="140" height="32" rx="${leaf ? 16 : 6}" fill="${leaf ? "var(--f-green)" : "var(--f-panel)"}" stroke="var(--f-ink)"/>${label(x, y + 4, t, leaf ? "lbl tiny on-dark" : "lbl tiny strong", "middle")}`;
  const line = (x1: number, y1: number, x2: number, y2: number, t: string) =>
    `<line x1="${x1}" y1="${y1 + 16}" x2="${x2}" y2="${y2 - 16}" stroke="var(--f-line)" stroke-width="2"/>${label((x1 + x2) / 2 + 6, (y1 + y2) / 2 + 4, t, "lbl tiny", "start")}`;
  return svg(
    640,
    300,
    "Ein dichotomer Bestimmungsschlüssel als Baum: Jede Frage hat zwei Antworten, bis am Ende ein Artname steht",
    `${line(320, 30, 140, 100, "nein")}${line(320, 30, 440, 100, "ja")}
     ${box(320, 30, "Blüten auffällig bunt?")}${box(140, 100, "Spitzwegerich", true)}
     ${line(440, 100, 300, 170, "ja")}${line(440, 100, 560, 170, "nein")}
     ${box(440, 100, "Körbchen?")}
     ${line(300, 170, 220, 240, "ja")}${line(300, 170, 380, 240, "nein")}
     ${box(300, 170, "ganz gelb, Milchsaft?")}${box(220, 240, "Löwenzahn", true)}${box(380, 240, "Margerite", true)}
     ${box(560, 170, "Stängel vierkantig?")}
     ${label(560, 210, "ja: Wiesen-Salbei", "lbl tiny", "middle")}${label(560, 228, "nein: weiter …", "lbl tiny", "middle")}`,
  );
};

export const wieseLebensgemeinschaft = (): string =>
  svg(
    640,
    300,
    "Ökosystem Wiese: Der Lebensraum mit Boden, Licht, Wasser und Temperatur und die Lebensgemeinschaft aus Pflanzen, Tieren und Bodenlebewesen",
    `<rect x="8" y="8" width="624" height="200" rx="12" fill="var(--f-sky)" opacity="0.6"/>
     <circle cx="590" cy="44" r="22" fill="var(--f-yellow)"/>
     <rect x="8" y="200" width="624" height="92" rx="12" fill="var(--f-earth)" opacity="0.5"/>
     ${Array.from({ length: 40 }, (_, i) => `<path d="M${20 + i * 15} 204 q${(i % 3) - 1} -30 ${4 - (i % 5)} -${40 + (i * 13) % 30}" fill="none" stroke="var(--f-green)" stroke-width="2"/>`).join("")}
     ${[[80, 130, "#7e57c2"], [160, 140, "#ffd23f"], [250, 126, "#e57399"], [330, 144, "#ffffff"], [420, 130, "#f5c400"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}" stroke="var(--f-line)"/>`).join("")}
     <ellipse cx="260" cy="96" rx="9" ry="6" fill="#f5b700" stroke="var(--f-ink)"/>${label(260, 82, "Biene", "lbl tiny", "middle")}
     <path d="M370 90 q-14 -14 -18 4 q14 6 18 -4 q14 -14 18 4 q-14 6 -18 -4" fill="var(--f-orange)" stroke="var(--f-ink)"/>${label(370, 74, "Schmetterling", "lbl tiny", "middle")}
     <path d="M480 180 l24 -8 l8 6 l-26 8 Z" fill="var(--f-green)" stroke="var(--f-ink)"/>${label(496, 166, "Heuschrecke", "lbl tiny", "middle")}
     <path d="M120 250 q20 -10 40 0 t40 0" fill="none" stroke="#c48b7a" stroke-width="5" stroke-linecap="round"/>${label(160, 274, "Regenwurm", "lbl tiny", "middle")}
     <ellipse cx="560" cy="250" rx="18" ry="10" fill="#8d6e63"/>${label(560, 278, "Feldmaus", "lbl tiny", "middle")}
     ${label(24, 30, "Lebensraum: Boden, Licht, Wasser, Temperatur", "lbl small strong", "start")}
     ${label(24, 52, "Lebensgemeinschaft: alle Pflanzen, Tiere, Pilze …", "lbl small strong", "start")}
     ${label(320, 236, "Lebensraum + Lebensgemeinschaft = Ökosystem", "lbl small strong", "middle")}`,
  );

export const umweltfaktorenMessen = (): string =>
  cardGrid(
    "Umweltfaktoren im Grünland untersuchen und im Protokoll festhalten",
    [
      { head: "Temperatur", body: "Thermometer am Boden\nund in 1 m Höhe,\nim Schatten ablesen", colour: C.red, icon: "🌡" },
      { head: "Niederschlag", body: "Regenmesser aufstellen,\njeden Tag zur gleichen\nZeit ablesen", colour: C.blue, icon: "🌧" },
      { head: "Boden", body: "Spatenprobe: feucht oder\ntrocken, Farbe, Krümel,\nBodenlebewesen", colour: "var(--f-earth)", icon: "🪱" },
      { head: "Licht", body: "Sonne oder Schatten?\nWie hoch wachsen die\nPflanzen?", colour: C.orange, icon: "☀" },
      { head: "Protokoll", body: "Ort, Datum, Uhrzeit,\nWetter, Messwerte in\neiner Tabelle", colour: C.purple, icon: "📝" },
      { head: "Vergleichen", body: "zwei Stellen messen,\nz. B. Wiese und\nWaldrand", colour: C.green, icon: "⚖" },
    ],
    3,
  );

export const intensivExtensiv = (): string =>
  compare(
    "Intensiv und extensiv bewirtschaftetes Grünland im Vergleich",
    {
      head: "Intensiv bewirtschaftet",
      colour: C.orange,
      points: [
        "häufig gemäht, oft 4- bis 5-mal im Jahr",
        "stark gedüngt",
        "viel und eiweißreiches Futter",
        "wenige, schnell wachsende Grasarten",
        "Blumen kommen kaum zur Samenbildung",
      ],
    },
    {
      head: "Extensiv bewirtschaftet",
      colour: C.green,
      points: [
        "selten gemäht, 1- bis 2-mal im Jahr",
        "wenig oder gar nicht gedüngt",
        "weniger Futter pro Fläche",
        "viele Blumen, Insekten und Vögel",
        "wichtig für die Artenvielfalt",
      ],
    },
  );
