/** Drawn figures for Lernbereich 1 and 2: maps, diagrams, fieldwork, the Earth. Not to scale. */
import { arrow, f1, label, labels, panel, person, svg } from "./draw";
import { at, MAPS } from "./maps";

export function mapTypes(): string {
  const frame = (x: number, title: string, body: string, note: string) =>
    `${panel(x, 10, 250, 270)}${label(x + 125, 36, title, "lbl strong")}<g transform="translate(${x + 15} 50)">${body}</g>${labels(x + 125, 258, note, "lbl tiny")}`;
  const topo = `<rect class="paper" width="220" height="170" rx="6"/>
    ${[0, 1, 2, 3].map((i) => `<ellipse class="contour" cx="150" cy="70" rx="${60 - i * 14}" ry="${42 - i * 10}"/>`).join("")}
    <path class="river-line" d="M0 120C50 110 70 150 120 140S190 160 220 150"/><path class="road" d="M0 40H90L130 170"/>
    ${[[30, 60], [48, 66], [36, 78], [60, 58]].map(([x, y]) => `<rect class="house" x="${x}" y="${y}" width="10" height="8"/>`).join("")}
    ${[[160, 140], [175, 128], [190, 145], [200, 132]].map(([x, y]) => `<circle class="forest" cx="${x}" cy="${y}" r="8"/>`).join("")}
    <text class="lbl tiny" x="150" y="74" text-anchor="middle">612</text>`;
  const phys = `<rect class="hs-1" width="220" height="170" rx="6"/><path class="hs-2" d="M40 170C40 110 90 90 130 70S220 60 220 40V170Z"/><path class="hs-3" d="M100 170C110 120 150 100 180 80S220 70 220 70V170Z"/><path class="hs-4" d="M170 170C175 140 200 120 220 110V170Z"/><path class="snow" d="M196 150l10-22 14 22z"/>
    <path class="river-line" d="M0 60C60 80 80 40 140 30S200 20 220 10"/><circle class="city" cx="60" cy="72" r="5"/>`;
  const them = `<path class="dens-1" d="M0 0H120L100 80L0 70Z"/><path class="dens-3" d="M120 0H220V90L100 80Z"/><path class="dens-2" d="M0 70L100 80L90 170H0Z"/><path class="dens-4" d="M100 80L220 90V170H90Z"/>
    <rect class="dens-1" x="6" y="120" width="12" height="10"/><rect class="dens-4" x="6" y="140" width="12" height="10"/><text class="lbl tiny" x="22" y="129">wenige Einwohner</text><text class="lbl tiny" x="22" y="149">viele Einwohner</text>`;
  return svg(
    800,
    290,
    "Drei Kartenarten nebeneinander: eine topografische Karte mit Höhenlinien, Straße, Häusern und Wald, eine physische Karte mit grünen, gelben und braunen Höhenschichten und eine thematische Karte zur Bevölkerungsdichte mit Farbstufen",
    `${frame(10, "topografische Karte", topo, "viele Einzelheiten:\nWege, Häuser, Höhenlinien")}${frame(275, "physische Karte", phys, "Relief in Höhenschichten:\ngrün tief, braun hoch")}${frame(540, "thematische Karte", them, "ein Thema, hier die\nBevölkerungsdichte")}`,
  );
}

const DATA: Array<[string, number]> = [["Mo", 3], ["Di", 0], ["Mi", 11], ["Do", 6], ["Fr", 2]];

export function chartTypes(): string {
  const col = DATA.map(([d, v], i) => `<rect class="bar" x="${42 + i * 38}" y="${180 - v * 12}" width="26" height="${v * 12}"/>${label(55 + i * 38, 198, d, "lbl tiny")}`).join("");
  const bar = DATA.map(([d, v], i) => `<rect class="bar" x="300" y="${58 + i * 26}" width="${v * 16}" height="18"/>${label(292, 72 + i * 26, d, "lbl tiny", "end")}`).join("");
  const pts = DATA.map(([, v], i) => `${i ? "L" : "M"}${560 + i * 40} ${180 - v * 12}`).join("");
  const dots = DATA.map(([d, v], i) => `<circle class="temp-dot" cx="${560 + i * 40}" cy="${180 - v * 12}" r="5"/>${label(560 + i * 40, 198, d, "lbl tiny")}`).join("");
  const axes = (x: number) => `<line class="axis" x1="${x}" y1="40" x2="${x}" y2="180"/><line class="axis" x1="${x}" y1="180" x2="${x + 200}" y2="180"/>`;
  return svg(
    800,
    240,
    "Dieselben fünf Niederschlagswerte von Montag bis Freitag als Säulendiagramm, als Balkendiagramm und als Liniendiagramm",
    `${axes(32)}${col}${label(130, 28, "Säulendiagramm", "lbl strong")}${label(40, 222, "Niederschlag in mm, erfundene Schulwoche", "lbl tiny", "start")}
    <line class="axis" x1="296" y1="50" x2="296" y2="190"/><line class="axis" x1="296" y1="190" x2="500" y2="190"/>${bar}${label(400, 28, "Balkendiagramm", "lbl strong")}
    ${axes(545)}<path class="temp-line" d="${pts}"/>${dots}${label(650, 28, "Liniendiagramm", "lbl strong")}`,
  );
}

export function fieldTrip(): string {
  const step = (x: number, n: string, title: string, body: string) =>
    `${panel(x, 20, 230, 230)}<circle class="step-badge" cx="${x + 26}" cy="46" r="15"/>${label(x + 26, 51, n, "lbl small strong on-dark")}${label(x + 130, 52, title, "lbl strong")}${body}`;
  const prepare = `<rect class="clipboard" x="60" y="80" width="80" height="110" rx="6"/><rect class="paper" x="70" y="96" width="60" height="84"/>
    ${[110, 124, 138, 152].map((y) => `<line class="map-grid" x1="76" x2="124" y1="${y}" y2="${y}"/>`).join("")}${label(100, 108, "Leitfrage?", "lbl tiny strong")}
    <rect class="paper" x="150" y="120" width="70" height="56" rx="3"/><path class="river-line" d="M150 150q20-12 35 0t35-6"/><path class="road" d="M165 120V176"/>${label(130, 230, "Frage, Aufgaben, Material", "lbl tiny")}`;
  const field = `<path class="meadow" d="M285 200H515V250H285Z"/><path class="sea-fill" d="M285 214C350 204 420 226 515 212V232C420 244 350 222 285 232Z"/>
    ${person(330, 200, 1.4, "cloth-a", "out")}<rect class="thermo" x="352" y="160" width="6" height="40" rx="3"/><circle class="thermo-bulb" cx="355" cy="202" r="6"/>
    ${person(420, 200, 1.4, "cloth-d", "up")}<rect class="clipboard" x="432" y="130" width="22" height="28" rx="3"/>${label(375, 120, "beobachten, messen,", "lbl tiny")}${label(375, 134, "notieren", "lbl tiny")}`;
  const evaluate = `<rect class="board" x="545" y="80" width="170" height="120" rx="6"/>${[0, 1, 2, 3].map((i) => `<rect class="bar" x="${568 + i * 36}" y="${180 - [40, 70, 30, 55][i]}" width="24" height="${[40, 70, 30, 55][i]}"/>`).join("")}<line class="axis-light" x1="560" y1="180" x2="705" y2="180"/>
    ${person(735, 240, 1.2, "cloth-b", "out")}${label(630, 230, "auswerten, präsentieren", "lbl tiny")}`;
  return svg(
    800,
    270,
    "Drei Schritte einer Erkundung: vorbereiten mit Leitfrage, Karte und Klemmbrett, durchführen mit Messungen am Bach und auswerten mit einem Diagramm an der Tafel",
    `${step(20, "1", "vorbereiten", prepare)}${arrow(252, 135, 278, 135)}${step(285, "2", "durchführen", field)}${arrow(517, 135, 543, 135)}${step(550, "3", "auswerten", evaluate)}`,
  );
}

export function sketchAndProfile(): string {
  const m = MAPS.bavaria;
  const k = 0.62;
  const bayern = m.layers.states.find((s) => s.id === "Bayern")!;
  const pt = (lon: number, lat: number) => {
    const [x, y] = at(m, lon, lat);
    return [20 + x * k, 30 + y * k] as const;
  };
  const river = (pts: Array<[number, number]>) => pts.map(([lon, lat], i) => { const [x, y] = pt(lon, lat); return `${i ? "L" : "M"}${f1(x)} ${f1(y)}`; }).join("");
  const city = (lon: number, lat: number, name: string) => { const [x, y] = pt(lon, lat); return `<circle class="city" cx="${f1(x)}" cy="${f1(y)}" r="5"/>${label(x + 8, y + 4, name, "lbl tiny", "start")}`; };
  const alps = [10.4, 10.9, 11.4, 11.9, 12.5, 12.9].map((lon) => { const [x, y] = pt(lon, 47.55); return `<path class="sketch-mountain" d="M${f1(x - 10)} ${f1(y + 6)}l10-16 10 16z"/>`; }).join("");
  const sketch = `<g transform="translate(20 30) scale(${k})"><path class="sketch-outline" d="${bayern.d}"/></g>
    <path class="sketch-river" d="${river([[10.0, 48.45], [10.9, 48.72], [11.4, 48.76], [12.1, 49.02], [12.9, 48.75], [13.46, 48.57]])}"/>
    <path class="sketch-river" d="${river([[11.75, 50.1], [11.0, 50.0], [10.5, 50.05], [10.2, 49.98], [9.93, 49.79], [9.6, 49.9], [9.1, 50.05]])}"/>
    ${alps}${city(11.58, 48.14, "München")}${city(11.08, 49.45, "Nürnberg")}${city(12.1, 49.02, "Regensburg")}${city(9.93, 49.79, "Würzburg")}
    <path class="north-arrow" d="M300 60l9-24 9 24-9-6z"/>${label(309, 78, "N", "lbl small")}
    ${label(160, 22, "Kartenskizze Bayern", "lbl strong")}`;
  const profile = `${panel(380, 10, 410, 290)}${label(585, 36, "Profil entlang einer Linie A–B", "lbl strong")}
    <line class="axis" x1="420" y1="60" x2="420" y2="250"/><line class="axis" x1="420" y1="250" x2="770" y2="250"/>
    ${[0, 1, 2, 3].map((i) => `<line class="grid" x1="420" x2="770" y1="${250 - i * 50}" y2="${250 - i * 50}"/>${label(414, 254 - i * 50, `${400 + i * 200} m`, "lbl tiny", "end")}`).join("")}
    <path class="profile" d="M420 250L420 225L470 220L510 205L540 160L570 120L590 110L610 130L650 190L700 210L770 215L770 250Z"/>
    ${label(425, 272, "A", "lbl small strong")}${label(765, 272, "B", "lbl small strong")}${label(590, 100, "Gipfel", "lbl tiny")}${label(595, 288, "Strecke · Höhe stark überhöht", "lbl tiny")}`;
  return svg(
    800,
    310,
    "Links eine Kartenskizze von Bayern mit Donau, Main, Alpen, vier Städten und Nordpfeil; rechts ein überhöhtes Geländeprofil von A nach B mit Höhenachse",
    `${panel(10, 10, 360, 290)}${sketch}${profile}`,
  );
}

export function geomedia(): string {
  const sats = [[120, 50], [400, 30], [680, 60]].map(([x, y]) => `<g class="satellite"><rect x="${x - 10}" y="${y - 7}" width="20" height="14" rx="2"/><rect class="panel-wing" x="${x - 38}" y="${y - 5}" width="24" height="10"/><rect class="panel-wing" x="${x + 14}" y="${y - 5}" width="24" height="10"/></g><line class="signal" x1="${x}" y1="${y + 8}" x2="400" y2="170"/>`).join("");
  return svg(
    800,
    320,
    "Drei Navigationssatelliten senden Signale an ein Smartphone mit Kartenansicht und Standortpunkt; daneben ein Geocache-Behälter mit Koordinaten",
    `<rect class="space" width="800" height="120" rx="12"/><rect class="sky" y="110" width="800" height="210"/>${sats}${label(400, 104, "Satellitensignale", "lbl tiny on-dark")}
    <rect class="phone" x="340" y="140" width="120" height="170" rx="16"/><rect class="paper" x="350" y="158" width="100" height="134" rx="4"/>
    <path class="road" d="M350 250L400 210L450 220"/><path class="river-line" d="M350 180C380 200 420 170 450 190"/><circle class="forest" cx="430" cy="270" r="10"/><circle class="pos-ring" cx="400" cy="214" r="14"/><circle class="pos-dot" cx="400" cy="214" r="6"/>
    ${label(400, 306, "48,137 · 11,575", "lbl tiny on-dark")}
    <path class="meadow" d="M520 300H780V320H520Z"/><rect class="cache" x="600" y="262" width="60" height="38" rx="6"/>${label(630, 286, "Cache", "lbl tiny strong on-dark")}
    ${labels(650, 200, "Geocaching:\nmit Koordinaten\neinen Behälter finden", "lbl small")}
    ${labels(150, 200, "Online-Karte:\nzoomen, Ebenen,\nRoute, Standort", "lbl small")}`,
  );
}

export function specialEarth(): string {
  const icon = (x: number, y: number, title: string, text: string) =>
    `${panel(x, y, 200, 70)}${label(x + 100, y + 26, title, "lbl small strong")}${labels(x + 100, y + 46, text, "lbl tiny")}`;
  return svg(
    800,
    330,
    "Die Erde in der Mitte mit Lufthülle, Wasser und Magnetfeld; ringsum fünf Bedingungen für Leben: passender Abstand zur Sonne, flüssiges Wasser, Lufthülle mit Sauerstoff, Magnetfeld und fruchtbare Böden",
    `<circle class="sun" cx="-40" cy="165" r="110"/>${label(30, 300, "Sonne", "lbl small")}
    ${[0, 1, 2].map((i) => `<path class="field-line" d="M400 ${95 - i * 18}C${520 + i * 40} ${70 - i * 20} ${520 + i * 40} ${260 + i * 20} 400 ${235 + i * 18}"/><path class="field-line" d="M400 ${95 - i * 18}C${280 - i * 40} ${70 - i * 20} ${280 - i * 40} ${260 + i * 20} 400 ${235 + i * 18}"/>`).join("")}
    <circle class="air" cx="400" cy="165" r="82"/><circle class="pl-earth" cx="400" cy="165" r="66"/><path class="continent-blob" d="M370 130q20-20 44-6t10 34q-14 18-36 10t-18-38zM420 190q16-6 24 8t-8 22q-14 4-20-10z"/>
    ${arrow(120, 165, 310, 165)}${label(215, 155, "passender Abstand", "lbl small strong")}
    ${icon(590, 20, "Wasser", "flüssig in Meeren,\nSeen und Flüssen")}${icon(590, 130, "Lufthülle", "Sauerstoff, Wärme,\nSchutz vor Strahlung")}${icon(590, 240, "Magnetfeld", "Schutzschild gegen\nTeilchen der Sonne")}${icon(150, 240, "Böden", "Pflanzen wachsen,\nNahrung entsteht")}`,
  );
}

export function graticuleGlobe(): string {
  const cx = 230,
    cy = 170,
    r = 140;
  const lat = (deg: number) => {
    const y = cy - r * Math.sin((deg * Math.PI) / 180);
    const rx = r * Math.cos((deg * Math.PI) / 180);
    return `<ellipse class="${deg === 0 ? "equator-line" : "grid"}" cx="${cx}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(rx * 0.18)}"/>`;
  };
  const lon = (deg: number) => `<ellipse class="${deg === 0 ? "meridian0" : "grid"}" cx="${cx}" cy="${cy}" rx="${f1(Math.abs(r * Math.sin((deg * Math.PI) / 180)))}" ry="${r}"/>`;
  const [mx, my] = [cx + r * Math.cos((48 * Math.PI) / 180) * Math.sin((12 * Math.PI) / 180) + 20, cy - r * Math.sin((48 * Math.PI) / 180)];
  return svg(
    800,
    350,
    "Globus mit Gradnetz: Breitenkreise parallel zum Äquator, Längenhalbkreise von Pol zu Pol, hervorgehoben Äquator und Nullmeridian; daneben die Zählweise der Breite bis 90 Grad und der Länge bis 180 Grad",
    `<circle class="globe" cx="${cx}" cy="${cy}" r="${r}"/>${[-60, -30, 0, 30, 60].map(lat).join("")}${[0, 30, 60].map(lon).join("")}<line class="meridian0" x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}"/>
    <circle class="city" cx="${f1(mx)}" cy="${f1(my)}" r="6"/>${label(mx + 10, my - 6, "München ≈ 48° N, 12° O", "lbl small strong", "start")}
    ${label(cx, cy - r - 10, "Nordpol 90° N", "lbl small")}${label(cx, cy + r + 22, "Südpol 90° S", "lbl small")}${label(cx + r + 8, cy + 4, "Äquator 0°", "lbl small strong", "start")}${label(cx - 6, cy + r - 30, "Nullmeridian", "lbl tiny", "end")}
    ${panel(470, 30, 310, 290)}${label(625, 58, "So zählst du", "lbl strong")}
    ${labels(490, 90, "Breitenkreise: parallel zum Äquator\n0° am Äquator bis 90° N oder 90° S", "lbl small", "start")}
    ${labels(490, 150, "Längenhalbkreise (Meridiane):\nvon Pol zu Pol, 0° in Greenwich\nbis 180° O oder 180° W", "lbl small", "start")}
    ${labels(490, 230, "Lage angeben: zuerst Breite,\ndann Länge, z. B. 48° N | 12° O", "lbl small", "start")}`,
  );
}
