/** Drawn figures for Lernbereich 1 (Lebensraum Erde). Not to scale. */
import { arrow, f1, label, labels, panel, person, svg } from "./draw";

const PLANETS: Array<[string, number, number, string]> = [
  ["Merkur", 150, 6, "pl-mercury"],
  ["Venus", 200, 11, "pl-venus"],
  ["Erde", 258, 12, "pl-earth"],
  ["Mars", 315, 8, "pl-mars"],
  ["Jupiter", 405, 36, "pl-jupiter"],
  ["Saturn", 520, 30, "pl-saturn"],
  ["Uranus", 626, 19, "pl-uranus"],
  ["Neptun", 718, 18, "pl-neptune"],
];

export function solarSystem(): string {
  const cy = 130;
  const orbits = PLANETS.map(
    ([, x]) =>
      `<circle class="orbit" cx="-70" cy="${cy}" r="${x + 70}"/>`,
  ).join("");
  const planets = PLANETS.map(
    ([name, x, r, cls]) =>
      `${name === "Saturn" ? `<ellipse class="ring" cx="${x}" cy="${cy}" rx="${r + 16}" ry="7"/>` : ""}<circle class="${cls}" cx="${x}" cy="${cy}" r="${r}"/>${name === "Erde" ? `<circle class="highlight-ring" cx="${x}" cy="${cy}" r="${r + 6}"/>` : ""}${label(x, 214, name, "lbl small")}`,
  ).join("");
  const body = `<rect class="space" width="800" height="260"/>${orbits}<circle class="sun" cx="-70" cy="${cy}" r="160"/>${label(30, 135, "Sonne", "lbl sun-label")}
  ${planets}
  <path class="bracket" d="M140 236v8h185v-8"/>${label(232, 256, "innere Planeten: Gesteinsplaneten", "lbl tiny")}
  <path class="bracket" d="M370 236v8h370v-8"/>${label(555, 256, "äußere Planeten: Gasplaneten", "lbl tiny")}`;
  return svg(
    800,
    262,
    "Die Sonne und die acht Planeten in ihrer Reihenfolge: Merkur, Venus, Erde, Mars, Jupiter, Saturn, Uranus, Neptun. Größen und Abstände sind nicht maßstabsgetreu.",
    body,
  );
}

export function earthFormation(): string {
  const steps: Array<[string, string]> = [
    ["Wolke aus Gas\nund Staub", "step-cloud"],
    ["glühend heiße\nKugel", "step-hot"],
    ["feste Kruste\nund Vulkane", "step-crust"],
    ["Regen füllt\ndie Ozeane", "step-ocean"],
    ["erstes Leben\nim Wasser", "step-life"],
  ];
  const body = steps
    .map(([text, cls], i) => {
      const x = 80 + i * 160;
      let inner = "";
      if (cls === "step-cloud")
        inner = Array.from({ length: 26 }, (_, k) => {
          const a = k * 0.9,
            r = 8 + k * 1.6;
          return `<circle class="dust" cx="${f1(x + r * Math.cos(a))}" cy="${f1(95 + r * Math.sin(a) * 0.7)}" r="${k % 3 ? 2 : 3.2}"/>`;
        }).join("");
      else {
        inner = `<circle class="${cls}" cx="${x}" cy="95" r="46"/>`;
        if (cls === "step-crust")
          inner += `<path class="crack" d="M${x - 30} ${80}l15 8 10-12 14 10 18-6M${x - 20} ${115}l12-6 14 8 16-4"/><path class="volcano" d="M${x - 8} 62l8-14 8 14z"/>`;
        if (cls === "step-ocean")
          inner += `<path class="cloud" d="M${x - 40} 40a12 12 0 0 1 22-6a14 14 0 0 1 26 2a10 10 0 0 1 4 20h-48a9 9 0 0 1-4-16z"/><path class="rain" d="M${x - 30} 62l-4 10M${x - 14} 62l-4 10M${x + 2} 62l-4 10M${x + 18} 62l-4 10"/>`;
        if (cls === "step-life")
          inner += `<path class="continent-blob" d="M${x - 24} 82q12-14 26-4t14 18q-8 12-24 6t-16-20z"/><circle class="cell" cx="${x + 18}" cy="118" r="5"/><circle class="cell" cx="${x + 28}" cy="108" r="3.5"/>`;
      }
      return `${inner}${labels(x, 166, text, "lbl small")}${i < steps.length - 1 ? arrow(x + 54, 95, x + 104, 95) : ""}`;
    })
    .join("");
  return svg(
    800,
    210,
    "Wie die Erde entstand, in fünf Schritten: Wolke aus Gas und Staub, glühende Kugel, feste Kruste mit Vulkanen, Regen füllt die Ozeane, erstes Leben im Wasser",
    `<rect class="space" width="800" height="210"/>${label(80, 30, "vor etwa 4,6 Milliarden Jahren", "lbl tiny on-dark")}${body}`,
  );
}

export function globeAndMap(): string {
  const cx = 150,
    cy = 150,
    r = 110;
  const meridians = [30, 60, 90]
    .map(
      (rx) =>
        `<ellipse class="grid" cx="${cx}" cy="${cy}" rx="${f1((r * rx) / 90)}" ry="${r}"/>`,
    )
    .join("");
  const parallels = [-60, -30, 30, 60]
    .map((lat) => {
      const y = cy - r * Math.sin((lat * Math.PI) / 180);
      const half = r * Math.cos((lat * Math.PI) / 180);
      return `<line class="grid" x1="${f1(cx - half)}" x2="${f1(cx + half)}" y1="${f1(y)}" y2="${f1(y)}"/>`;
    })
    .join("");
  const compass = (x: number, y: number) =>
    `<circle class="compass" cx="${x}" cy="${y}" r="66"/><path class="needle-n" d="M${x} ${y - 58}l10 58h-20z"/><path class="needle-s" d="M${x} ${y + 58}l10-58h-20z"/><path class="needle-ew" d="M${x - 58} ${y}l58 7v-14zM${x + 58} ${y}l-58 7v-14z"/>${label(x, y - 70, "N", "lbl compass-letter")}${label(x, y + 86, "S", "lbl compass-letter")}${label(x - 82, y + 6, "W", "lbl compass-letter")}${label(x + 82, y + 6, "O", "lbl compass-letter")}${label(x + 52, y - 46, "NO", "lbl tiny")}${label(x + 52, y + 56, "SO", "lbl tiny")}${label(x - 52, y + 56, "SW", "lbl tiny")}${label(x - 52, y - 46, "NW", "lbl tiny")}`;
  const body = `<circle class="globe" cx="${cx}" cy="${cy}" r="${r}"/><path class="north-half" d="M${cx - r} ${cy}a${r} ${r} 0 0 1 ${2 * r} 0z"/>${meridians}${parallels}
  <line class="equator" x1="${cx - r}" x2="${cx + r}" y1="${cy}" y2="${cy}"/><line class="meridian0" x1="${cx}" x2="${cx}" y1="${cy - r}" y2="${cy + r}"/>
  ${label(cx, cy - r - 10, "Nordpol", "lbl small")}${label(cx, cy + r + 20, "Südpol", "lbl small")}
  ${label(cx + r + 8, cy + 4, "Äquator", "lbl small", "start")}${label(cx - 40, cy - 50, "Nordhalbkugel", "lbl small")}${label(cx - 40, cy + 60, "Südhalbkugel", "lbl small")}
  ${labels(cx + 8, cy - r + 30, "Null-\nmeridian", "lbl tiny", "start")}
  ${arrow(290, 150, 350, 150)}${label(320, 136, "abwickeln", "lbl tiny")}
  <rect class="flatmap" x="360" y="80" width="200" height="140" rx="4"/>${[1, 2, 3, 4, 5].map((i) => `<line class="grid" x1="${360 + i * 33.3}" x2="${360 + i * 33.3}" y1="80" y2="220"/>`).join("")}${[1, 2, 3].map((i) => `<line class="grid" x1="360" x2="560" y1="${80 + i * 35}" y2="${80 + i * 35}"/>`).join("")}<line class="equator" x1="360" x2="560" y1="150" y2="150"/>
  ${labels(460, 244, "Karte: flach und handlich,\naber verzerrt", "lbl small")}${labels(cx, 292, "Globus: verkleinertes Modell der Erde", "lbl small")}
  ${compass(690, 140)}${label(690, 268, "Himmelsrichtungen", "lbl small")}`;
  return svg(
    800,
    305,
    "Links ein Globus mit Äquator, Nullmeridian, Nordpol, Südpol und den beiden Erdhälften, in der Mitte eine flache Karte, rechts eine Windrose mit Norden, Osten, Süden und Westen",
    body,
  );
}

/** Fictional village map; the workshop asks for grid squares (Planquadrate). */
export function readingMaps(): string {
  const x0 = 40,
    y0 = 40,
    cw = 110,
    rh = 75;
  const cols = ["A", "B", "C", "D"];
  const grid = `${cols.map((c, i) => label(x0 + cw * i + cw / 2, y0 - 10, c, "lbl small")).join("")}${[1, 2, 3, 4].map((r, i) => label(x0 - 16, y0 + rh * i + rh / 2 + 5, String(r), "lbl small")).join("")}`;
  const lines = [1, 2, 3]
    .map(
      (i) =>
        `<line class="map-grid" x1="${x0 + cw * i}" x2="${x0 + cw * i}" y1="${y0}" y2="${y0 + 4 * rh}"/><line class="map-grid" x1="${x0}" x2="${x0 + 4 * cw}" y1="${y0 + rh * i}" y2="${y0 + rh * i}"/>`,
    )
    .join("");
  const forest = [
    [70, 70],
    [95, 60],
    [120, 82],
    [80, 100],
    [110, 108],
    [140, 60],
  ]
    .map(([x, y]) => `<circle class="forest" cx="${x}" cy="${y}" r="14"/>`)
    .join("");
  const church = (x: number, y: number) =>
    `<rect class="symbol" x="${x - 8}" y="${y - 6}" width="16" height="14"/><path class="symbol-line" d="M${x} ${y - 20}v12M${x - 5} ${y - 15}h10"/>`;
  const school = (x: number, y: number) =>
    `<rect class="school" x="${x - 12}" y="${y - 9}" width="24" height="18"/><path class="symbol-line" d="M${x} ${y - 9}v-12"/><path class="flag" d="M${x} ${y - 21}h10l-3 4 3 4h-10z"/>`;
  const station = (x: number, y: number) =>
    `<rect class="station" x="${x - 12}" y="${y - 8}" width="24" height="16" rx="3"/>`;
  const body = `<rect class="paper" x="${x0}" y="${y0}" width="${4 * cw}" height="${4 * rh}"/>
  ${forest}<path class="lake-fill" d="M70 230q20-18 46-8t14 30q-18 16-42 8t-18-30z"/>
  <path class="river-line" d="M210 40q-20 60 10 110t-20 110q-10 30 0 40"/>
  <path class="road" d="M40 160h120q50 0 80-30t110-20h120"/>
  <path class="rail" d="M260 40q40 120 120 200t90 80"/><path class="rail-ties" d="M260 40q40 120 120 200t90 80"/>
  ${church(240, 92)}${school(330, 72)}${station(420, 302)}
  ${[0, 1, 2, 3].map((i) => `<rect class="house" x="${235 + (i % 2) * 20}" y="${140 + Math.floor(i / 2) * 18}" width="14" height="12"/>`).join("")}
  ${lines}${grid}
  <path class="north-arrow" d="M462 70l10-26 10 26-10-7z"/>${label(472, 92, "N", "lbl small")}
  <rect class="scale-a" x="40" y="${y0 + 4 * rh + 18}" width="55" height="8"/><rect class="scale-b" x="95" y="${y0 + 4 * rh + 18}" width="55" height="8"/>${label(40, y0 + 4 * rh + 44, "0", "lbl tiny")}${label(150, y0 + 4 * rh + 44, "500 m", "lbl tiny")}${label(200, y0 + 4 * rh + 28, "Maßstabsleiste", "lbl tiny", "start")}
  ${panel(510, 40, 260, 320)}${label(530, 66, "Legende", "lbl strong", "start")}
  <circle class="forest" cx="540" cy="92" r="9"/>${label(560, 97, "Wald", "lbl small", "start")}
  <rect class="lake-fill" x="530" y="112" width="20" height="14" rx="5"/>${label(560, 124, "See", "lbl small", "start")}
  <path class="river-line" d="M530 150h22"/>${label(560, 154, "Fluss", "lbl small", "start")}
  <path class="road" d="M530 178h22"/>${label(560, 182, "Straße", "lbl small", "start")}
  <path class="rail" d="M530 206h22"/><path class="rail-ties" d="M530 206h22"/>${label(560, 210, "Bahnlinie", "lbl small", "start")}
  ${church(541, 240)}${label(560, 244, "Kirche", "lbl small", "start")}
  ${school(541, 276)}${label(560, 280, "Schule", "lbl small", "start")}
  ${station(541, 312)}${label(560, 316, "Bahnhof", "lbl small", "start")}
  <rect class="house" x="534" y="334" width="14" height="12"/>${label(560, 345, "Wohnhaus", "lbl small", "start")}`;
  return svg(
    800,
    400,
    "Erfundene Karte eines Dorfes mit Gitter aus den Spalten A bis D und den Zeilen 1 bis 4, mit Wald, See, Fluss, Straße, Bahnlinie, Kirche, Schule, Bahnhof und Wohnhäusern, dazu Legende, Nordpfeil und Maßstabsleiste",
    body,
  );
}

export function landscapeProfile(): string {
  const ground =
    "M0 230L0 205L60 205L80 200L300 196L320 180L345 150L370 170L395 140L420 165L450 130L480 160L505 185L560 178L590 182L615 170L640 120L660 150L690 60L705 45L720 90L745 70L770 110L800 95L800 230Z";
  const body = `<rect class="sky" width="800" height="230"/><rect class="sea" x="0" y="196" width="80" height="34"/><path class="profile" d="${ground}"/>
  <path class="snow" d="M682 72L690 60L705 45L713 66L700 62L692 72Z M740 76L745 70L756 86L748 84Z"/>
  ${labels(40, 186, "Nord-\nsee", "lbl tiny")}
  ${labels(190, 176, "Norddeutsches\nTiefland", "lbl small")}${labels(410, 110, "Mittelgebirge", "lbl small")}${labels(560, 150, "Alpen-\nvorland", "lbl small")}${labels(745, 34, "Alpen", "lbl small")}
  ${label(705, 30, "Zugspitze 2962 m", "lbl tiny", "end")}
  ${arrow(150, 252, 20, 252)}${label(160, 256, "Norden", "lbl small", "start")}${arrow(650, 252, 780, 252)}${label(640, 256, "Süden", "lbl small", "end")}`;
  return svg(
    800,
    270,
    "Querschnitt durch Deutschland von Norden nach Süden: Nordsee, Norddeutsches Tiefland, Mittelgebirge, Alpenvorland und Alpen mit der Zugspitze. Die Höhen sind stark überhöht.",
    body,
  );
}

export function alpsAndCoast(): string {
  const left = `${panel(10, 10, 380, 280, "scene-bg")}<rect class="sky" x="10" y="10" width="380" height="180" rx="14"/>
  <path class="mountain" d="M10 190L90 70L150 140L210 40L290 150L340 90L390 160V190Z"/><path class="snow" d="M195 64L210 40L226 62L214 58ZM78 88L90 70L101 86L92 82ZM330 104L340 90L350 104Z"/>
  <path class="meadow" d="M10 190L390 170V290H10Z"/><path class="cable" d="M60 230L260 80"/><rect class="gondola" x="150" y="150" width="20" height="14" rx="3"/>
  <rect class="hut" x="280" y="200" width="44" height="30"/><path class="roof" d="M274 202l28-22 28 22z"/>
  <ellipse class="cow" cx="120" cy="248" rx="18" ry="9"/><circle class="cow" cx="138" cy="242" r="6"/>
  ${label(200, 32, "Alpen in Bayern", "lbl strong")}${label(300, 270, "Almhütte", "lbl tiny")}${label(110, 278, "Almwirtschaft", "lbl tiny")}${label(240, 120, "Seilbahn", "lbl tiny", "start")}`;
  const right = `${panel(410, 10, 380, 280, "scene-bg")}<rect class="sky" x="410" y="10" width="380" height="160" rx="14"/>
  <path class="sea-fill" d="M410 150H790V230H410Z"/><path class="wave" d="M420 170q10-6 20 0t20 0 20 0 20 0 20 0 20 0M560 190q10-6 20 0t20 0 20 0 20 0"/>
  <path class="mudflat" d="M410 215Q520 205 640 220T790 214V240H410Z"/><path class="dike" d="M410 290V240L560 240L620 214L790 214V290Z"/>
  <rect class="lighthouse-a" x="700" y="110" width="18" height="104"/><rect class="lighthouse-b" x="700" y="134" width="18" height="14"/><rect class="lighthouse-b" x="700" y="166" width="18" height="14"/><path class="roof" d="M696 112l13-16 13 16z"/>
  <line class="turbine" x1="480" y1="150" x2="480" y2="70"/><path class="blade" d="M480 70l-4-36 8 0zM480 70l32 18-4 7zM480 70l-32 18 4 7z"/>
  <path class="boat" d="M600 160h50l-8 12h-34z"/><line class="mast" x1="625" y1="160" x2="625" y2="132"/>
  ${label(600, 32, "Nordseeküste", "lbl strong")}${label(520, 234, "Watt bei Ebbe", "lbl tiny")}${label(690, 260, "Deich", "lbl tiny")}${label(480, 60, "Windrad", "lbl tiny")}${label(709, 92, "Leuchtturm", "lbl tiny")}`;
  return svg(
    800,
    300,
    "Zwei Landschaften im Vergleich: links die Alpen in Bayern mit Bergen, Schnee, Alm, Kühen und Seilbahn; rechts die Nordseeküste mit Meer, Watt, Deich, Leuchtturm, Windrad und Boot",
    `${left}${right}`,
  );
}

export function energyHome(): string {
  const body = `${panel(20, 20, 520, 300, "scene-bg")}<path class="roof" d="M10 120L280 20L550 120Z"/><rect class="wall" x="40" y="120" width="480" height="200"/><line class="floor" x1="40" y1="220" x2="520" y2="220"/><line class="floor" x1="280" y1="120" x2="280" y2="320"/>
  <path class="lamp-on" d="M150 130h20l8 18h-36z"/><circle class="glow" cx="160" cy="160" r="16"/>${label(160, 200, "Licht im leeren Raum", "lbl tiny")}
  <rect class="window" x="360" y="140" width="60" height="50"/><path class="window-tilt" d="M360 140l14-10h60l-14 10"/><rect class="heater" x="440" y="180" width="60" height="30" rx="4"/>${label(430, 120 + 90, "Fenster gekippt,", "lbl tiny")}${label(430, 120 + 102, "Heizung an", "lbl tiny")}
  <rect class="tv" x="70" y="250" width="70" height="44" rx="4"/><circle class="standby" cx="134" cy="288" r="3.5"/>${label(105, 312, "Stand-by", "lbl tiny")}
  <path class="pot" d="M330 270h60v28q0 10-10 10h-40q-10 0-10-10z"/><path class="lid" d="M326 268q34-16 68 0z"/><rect class="stove" x="316" y="306" width="88" height="8"/>${label(360, 252, "Deckel auf dem Topf", "lbl tiny")}
  ${panel(560, 20, 220, 300)}${label(670, 48, "Energie sparen", "lbl strong")}
  ${labels(580, 80, "✓ Licht ausschalten,\n   wenn niemand im Raum ist", "lbl small", "start")}
  ${labels(580, 130, "✓ Stoßlüften statt\n   Fenster kippen", "lbl small", "start")}
  ${labels(580, 180, "✓ Geräte ganz ausschalten\n   statt Stand-by", "lbl small", "start")}
  ${labels(580, 230, "✓ beim Kochen\n   Deckel benutzen", "lbl small", "start")}
  ${labels(580, 280, "✓ kurze Wege zu Fuß\n   oder mit dem Rad", "lbl small", "start")}`;
  return svg(
    800,
    340,
    "Ein Haus mit vier Stellen, an denen Energie verloren geht: Licht im leeren Raum, gekipptes Fenster bei laufender Heizung, Fernseher im Stand-by und Kochen ohne Deckel; daneben eine Liste mit Spartipps",
    body,
  );
}

export function everydayEnvironment(): string {
  const bins: Array<[string, string, string]> = [
    ["bin-paper", "Papier", "Zeitungen,\nKartons"],
    ["bin-yellow", "Wertstoffe", "Verpackungen aus\nPlastik und Metall"],
    ["bin-bio", "Bio", "Obst- und\nGemüsereste"],
    ["bin-glass", "Glas", "Flaschen und\nGläser"],
    ["bin-rest", "Restmüll", "was nicht\nverwertbar ist"],
  ];
  const binRow = bins
    .map(([cls, name, text], i) => {
      const x = 70 + i * 150;
      return `<rect class="${cls}" x="${x - 30}" y="200" width="60" height="70" rx="6"/><rect class="${cls} lidbar" x="${x - 34}" y="192" width="68" height="10" rx="3"/>${label(x, 240, name, "lbl tiny on-bin")}${labels(x, 290, text, "lbl tiny")}`;
    })
    .join("");
  const body = `${panel(10, 10, 780, 150)}${label(30, 40, "Woher kommt mein Apfel?", "lbl strong", "start")}
  <circle class="apple" cx="50" cy="80" r="12"/><rect class="route-short" x="80" y="74" width="44" height="12" rx="6"/>${label(134, 85, "aus der Region: wenige Kilometer mit dem Lieferwagen", "lbl small", "start")}
  <circle class="apple" cx="50" cy="126" r="12"/><rect class="route-long" x="80" y="120" width="620" height="12" rx="6"/><path class="ship" d="M706 118h40l-6 14h-28z"/>${label(80, 152, "aus Neuseeland: mehr als 18 000 km mit dem Schiff", "lbl small", "start")}
  ${label(400, 186, "Müll trennen: Jede Tonne sammelt anderes – die genauen Regeln legt deine Gemeinde fest.", "lbl small")}
  ${binRow}`;
  return svg(
    800,
    330,
    "Oben: Ein Apfel aus der Region legt wenige Kilometer zurück, ein Apfel aus Neuseeland mehr als 18 000 Kilometer. Unten: fünf Tonnen für Papier, Wertstoffe, Bioabfall, Glas und Restmüll.",
    body,
  );
}

export { person };
