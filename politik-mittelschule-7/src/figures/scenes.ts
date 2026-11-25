/**
 * Drawn figures for GPG 7 Lernbereich 3. Every drawing is a schematic, not a
 * picture of a real place; captions in index.ts say so. Colours are CSS
 * classes (figure block in styles.css), so both themes apply.
 */
import { esc } from "../workshop";
import { arrow, f1, label, labels, panel, person, svg } from "./draw";

const rect = (x: number, y: number, w: number, h: number, cls: string, rx = 0): string =>
  `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}"${rx ? ` rx="${rx}"` : ""}/>`;
const line = (x1: number, y1: number, x2: number, y2: number, cls: string): string =>
  `<line class="${cls}" x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}"/>`;
const circle = (x: number, y: number, r: number, cls: string): string =>
  `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;

/** A row of windows; `lit` decides between bright and dark panes. */
function windows(x: number, y: number, cols: number, rows: number, lit: boolean, gap = 22): string {
  let out = "";
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      out += rect(x + c * gap, y + r * 34, 12, 18, lit ? "window-lit" : "window-dark", 2);
  return out;
}

/** A small gabled house. */
function house(x: number, y: number, w: number, h: number, cls = "old-house"): string {
  return `${rect(x, y, w, h, cls)}<path class="roof-red" d="M${f1(x - 3)} ${f1(y)}L${f1(x + w / 2)} ${f1(y - h * 0.6)}L${f1(x + w + 3)} ${f1(y)}Z"/>`;
}

/** A factory hall with a saw-tooth roof and a smoking chimney. */
function factory(x: number, y: number, w: number, smoke = true): string {
  const teeth = Math.max(2, Math.round(w / 26));
  const step = w / teeth;
  let roof = `M${f1(x)} ${f1(y)}`;
  for (let i = 0; i < teeth; i++)
    roof += `L${f1(x + i * step)} ${f1(y - 16)}L${f1(x + (i + 1) * step)} ${f1(y)}`;
  return `<g class="factory-group">${rect(x + w - 14, y - 52, 10, 52, "chimney")}${smoke ? `<path class="smoke" d="M${f1(x + w - 9)} ${f1(y - 56)}c-10 -8 4 -14 -6 -24c12 2 18 -8 26 -2c6 6 -6 14 2 20z"/>` : ""}<path class="factory" d="${roof}L${f1(x + w)} ${f1(y + 34)}L${f1(x)} ${f1(y + 34)}Z"/>${windows(x + 8, y + 8, Math.max(1, Math.floor((w - 12) / 20)), 1, false, 20)}</g>`;
}

export function factoryHall(): string {
  const workers = [
    [330, "cloth-a", "out"],
    [500, "cloth-b", "out"],
    [660, "cloth-c", "out"],
  ] as const;
  const machines = [300, 470, 630]
    .map(
      (x) =>
        `${rect(x - 6, 212, 92, 58, "machine", 6)}${circle(x + 18, 240, 13, "spindle")}${circle(x + 56, 240, 13, "spindle")}${line(x + 40, 92, x + 40, 212, "belt")}${line(x + 50, 92, x + 50, 212, "belt")}${circle(x + 45, 86, 11, "pulley")}`,
    )
    .join("");
  const people = workers
    .map(([x, cls, arms]) => person(x - 26, 300, 1.5, cls, arms))
    .join("");
  const child = person(712, 300, 1.05, "cloth-d", "out");
  return svg(
    800,
    360,
    "Schematische Fabrikhalle um 1880: Links treibt eine Dampfmaschine mit großem Schwungrad eine Welle unter der Decke an. Von der Welle laufen Treibriemen ohne Schutz zu drei Spinnmaschinen. An den Maschinen arbeiten Erwachsene und ein Kind. An der Wand hängen eine Uhr, die sechs Uhr zeigt, und die Fabrikordnung.",
    `${rect(0, 0, 800, 360, "hall-wall")}${rect(0, 300, 800, 60, "hall-floor")}${line(150, 92, 790, 92, "shaft")}${circle(98, 200, 74, "flywheel")}${line(98, 200, 98, 126, "spoke-line")}${line(98, 200, 162, 236, "spoke-line")}${line(98, 200, 34, 236, "spoke-line")}${rect(118, 210, 70, 90, "steam-engine", 6)}${line(98, 126, 150, 92, "belt")}${machines}${people}${child}
    ${circle(250, 40, 24, "clock")}${line(250, 40, 250, 22, "clock-hand")}${line(250, 40, 250, 56, "clock-hand")}
    ${rect(712, 110, 70, 86, "notice", 4)}${line(722, 140, 772, 140, "notice-line")}${line(722, 152, 772, 152, "notice-line")}${line(722, 164, 760, 164, "notice-line")}${line(722, 176, 768, 176, "notice-line")}
    ${label(98, 330, "Dampfmaschine", "lbl small strong")}${label(560, 80, "Welle und Treibriemen: ohne Schutz", "lbl small")}${label(282, 36, "6 Uhr:", "lbl tiny strong", "start")}${label(282, 52, "Schichtbeginn", "lbl tiny", "start")}${label(747, 214, "Fabrikordnung:", "lbl tiny strong")}${label(747, 228, "Strafen, Pausen", "lbl tiny")}${label(712, 336, "Kinderarbeit", "lbl tiny strong")}${label(470, 336, "Lärm, Staub, 12 bis 14 Stunden", "lbl small")}`,
  );
}

export function tenement(): string {
  const front = `${rect(60, 70, 230, 230, "brick")}${windows(80, 90, 9, 5, true)}${rect(150, 300, 50, 40, "cellar")}${rect(160, 306, 12, 14, "window-dark")}`;
  const back = `${rect(430, 70, 230, 230, "brick-dark")}${windows(450, 90, 9, 5, false)}${rect(430, 300, 230, 40, "cellar")}${rect(470, 306, 12, 14, "window-dark")}${rect(600, 306, 12, 14, "window-dark")}`;
  const court = `${rect(290, 110, 140, 190, "court")}${rect(290, 300, 140, 40, "court-floor")}`;
  const rays = [0, 1, 2]
    .map((i) => line(30, 20 + i * 8, 120 + i * 70, 90 + i * 40, "sunray"))
    .join("");
  return svg(
    800,
    360,
    "Querschnitt durch eine Mietskaserne um 1900: Links das Vorderhaus an der Straße mit hellen Fenstern, in der Mitte ein enger, dunkler Hof, rechts das Hinterhaus mit dunklen Fenstern. Unter beiden Häusern liegen Kellerwohnungen. Die Sonne beleuchtet nur das Vorderhaus.",
    `${rect(0, 0, 800, 340, "sky")}${circle(26, 24, 18, "sun")}${rays}${front}${court}${back}${rect(0, 340, 800, 20, "street")}
    ${label(175, 60, "Vorderhaus", "lbl strong")}${labels(175, 356, "zur Straße", "lbl tiny")}${label(545, 60, "Hinterhaus", "lbl strong")}${labels(360, 150, "enger Hof:\nwenig Licht\nund Luft", "lbl small on-fill")}
    ${labels(720, 110, "kleine,\ndunkle\nWohnungen,\noft mit\nSchlafgängern", "lbl small", "middle")}${labels(720, 290, "feuchte\nKeller-\nwohnungen", "lbl small")}${arrow(690, 300, 664, 318, "arrow thin")}
    ${labels(175, 240, "größere,\nhellere\nWohnungen", "lbl small on-fill")}`,
  );
}

export function strike(): string {
  const strikers = [0, 1, 2, 3, 4, 5, 6]
    .map((i) =>
      person(380 + i * 52, 300, 1.4, ["cloth-a", "cloth-b", "cloth-c", "cloth-d"][i % 4], i % 2 ? "up" : "down"),
    )
    .join("");
  return svg(
    800,
    360,
    "Gezeichnete Szene eines Streiks: Vor einem Fabriktor mit stillstehendem Schornstein stehen Arbeiterinnen und Arbeiter mit einem Transparent für kürzere Arbeitszeit. Am Tor steht der Fabrikbesitzer. Daneben drei Schilder: Verein, Gewerkschaft, Partei.",
    `${rect(0, 0, 800, 300, "sky")}${rect(0, 300, 800, 60, "street")}${factory(30, 150, 220, false)}${rect(250, 160, 80, 140, "gate")}${line(270, 160, 270, 300, "gate-bar")}${line(290, 160, 290, 300, "gate-bar")}${line(310, 160, 310, 300, "gate-bar")}${person(225, 300, 1.4, "cloth-owner", "out")}
    ${strikers}${rect(420, 150, 300, 44, "banner", 6)}${line(430, 194, 430, 250, "pole")}${line(710, 194, 710, 250, "pole")}${label(570, 178, "Acht Stunden sind genug!", "lbl strong on-banner")}
    ${label(225, 335, "Fabrikbesitzer", "lbl small")}${label(560, 335, "Streik: Alle legen die Arbeit nieder.", "lbl small strong")}
    ${rect(30, 18, 230, 34, "tag tag-1", 17)}${label(145, 40, "Arbeiterbildungsverein", "lbl small on-fill")}${rect(280, 18, 230, 34, "tag tag-2", 17)}${label(395, 40, "Gewerkschaft", "lbl small on-fill")}${rect(530, 18, 240, 34, "tag tag-3", 17)}${label(650, 40, "Arbeiterpartei, später SPD", "lbl small on-fill")}${label(145, 120, "Maschinen stehen still", "lbl tiny")}`,
  );
}

export function helpers(): string {
  const church = `<path class="church-roof" d="M70 170L120 120L170 170Z"/>${rect(75, 170, 90, 110, "church")}${rect(108, 230, 24, 50, "door")}${rect(150, 90, 30, 190, "church")}<path class="church-roof" d="M146 90L165 50L184 90Z"/>`;
  const company = `${factory(290, 160, 150)}${[0, 1, 2, 3].map((i) => house(300 + i * 36, 250, 28, 30, "settlement")).join("")}`;
  const self = [0, 1, 2, 3, 4].map((i) => person(580 + i * 38, 270, 1.25, ["cloth-a", "cloth-b", "cloth-c", "cloth-d", "cloth-a"][i], "up")).join("");
  return svg(
    800,
    360,
    "Drei Wege, auf die Soziale Frage zu antworten: Links eine Kirche mit Gesellenhaus für Kolping und die Innere Mission, in der Mitte eine Fabrik mit Werkssiedlung und Krankenkasse für Unternehmer wie Krupp, rechts Arbeiter, die sich in Vereinen und Gewerkschaften selbst helfen.",
    `${panel(10, 10, 250, 340, "scene-bg")}${panel(275, 10, 250, 340, "scene-bg")}${panel(540, 10, 250, 340, "scene-bg")}
    ${church}${label(135, 36, "Kirchen", "lbl strong")}${labels(135, 300, "Kolping: Gesellenverein\nWichern: Innere Mission\nchristliche Gewerkschaften", "lbl tiny")}
    ${company}${label(400, 36, "Unternehmer", "lbl strong")}${labels(400, 300, "Krupp: Krankenkasse,\nWohnungen, Werksladen\naber: Gewerkschaft verboten", "lbl tiny")}
    ${self}${label(665, 36, "Arbeiter selbst", "lbl strong")}${labels(665, 300, "Bildungsvereine,\nGewerkschaften, Streiks,\neigene Partei", "lbl tiny")}`,
  );
}

export function shields(): string {
  const parts: Array<[string, string, string, string]> = [
    ["1883", "Krankheit", "shield-1", "⅔ Arbeiter,\n⅓ Arbeitgeber"],
    ["1884", "Unfall", "shield-2", "nur die\nUnternehmer"],
    ["1889", "Invalidität und Alter", "shield-3", "Versicherte und\nArbeitgeber je zur Hälfte,\ndazu Staatszuschuss"],
  ];
  const icons = [
    (x: number) => `${rect(x - 6, 92, 12, 40, "icon-white")}${rect(x - 20, 106, 40, 12, "icon-white")}`,
    (x: number) => `${circle(x, 112, 18, "icon-white-ring")}${circle(x, 112, 6, "icon-white")}`,
    (x: number) => `<path class="icon-white-line" d="M${x - 6} 132V96q0 -8 10 -8q8 0 8 8"/>`,
  ];
  const body = parts
    .map(([year, risk, cls, pays], i) => {
      const x = 140 + i * 260;
      return `<path class="${cls}" d="M${x - 70} 50H${x + 70}V140Q${x + 70} 200 ${x} 230Q${x - 70} 200 ${x - 70} 140Z"/>${icons[i](x)}${label(x, 74, year, "lbl strong on-fill")}${label(x, 170, risk, "lbl small on-fill")}${label(x, 262, "Beiträge:", "lbl tiny strong")}${labels(x, 280, pays, "lbl tiny")}`;
    })
    .join("");
  return svg(
    800,
    360,
    "Drei Schutzschilde für Bismarcks Sozialgesetze: 1883 Krankenversicherung mit Beiträgen zu zwei Dritteln von Arbeitern und einem Drittel von Arbeitgebern, 1884 Unfallversicherung nur von Unternehmern bezahlt, 1889 Invaliditäts- und Altersversicherung mit Beiträgen je zur Hälfte und einem Zuschuss des Staates.",
    `${rect(0, 0, 800, 360, "scene-bg")}${body}${label(400, 30, "Bismarcks Sozialversicherung", "lbl strong")}${label(400, 345, "Altersrente ab 70 Jahren · Rechtsanspruch auch beim Wechsel des Betriebs", "lbl tiny")}`,
  );
}

export function fivePillars(): string {
  const pillars: Array<[string, string, string]> = [
    ["Kranken-\nversicherung", "1883", "pillar-old"],
    ["Unfall-\nversicherung", "1884", "pillar-old"],
    ["Renten-\nversicherung", "1889", "pillar-old"],
    ["Arbeitslosen-\nversicherung", "1927", "pillar-new"],
    ["Pflege-\nversicherung", "1995", "pillar-new"],
  ];
  const body = pillars
    .map(([name, year, cls], i) => {
      const x = 130 + i * 135;
      return `${rect(x - 40, 110, 80, 170, cls, 4)}${label(x, 134, year, "lbl strong on-fill")}${labels(x, 200, name, "lbl tiny on-fill")}`;
    })
    .join("");
  return svg(
    800,
    360,
    "Das Haus der Sozialversicherung heute: Ein Dach mit der Aufschrift Sozialversicherung ruht auf fünf Säulen. Drei stammen aus Bismarcks Zeit: Krankenversicherung 1883, Unfallversicherung 1884, Rentenversicherung 1889. Zwei kamen später: Arbeitslosenversicherung 1927 und Pflegeversicherung 1995. Das Fundament heißt Solidarprinzip.",
    `${rect(0, 0, 800, 360, "scene-bg")}<path class="pillar-roof" d="M60 104L400 30L740 104Z"/>${label(400, 88, "Sozialversicherung heute", "lbl strong on-fill")}${body}${rect(60, 280, 680, 34, "pillar-base", 4)}${label(400, 302, "Solidarprinzip: Alle zahlen nach Einkommen ein, wer Hilfe braucht, bekommt sie.", "lbl tiny on-fill")}
    ${rect(80, 326, 18, 14, "pillar-old", 2)}${label(104, 338, "aus Bismarcks Zeit", "lbl tiny", "start")}${rect(420, 326, 18, 14, "pillar-new", 2)}${label(444, 338, "später hinzugekommen", "lbl tiny", "start")}`,
  );
}

/** Shares of all employed people, rounded as in the LeMO text (1871 and 1907). */
export const SECTOR_SHARES = {
  1871: { agrar: 50, industrie: 29 },
  1907: { agrar: 34, industrie: 40 },
} as const;

export function sectors(): string {
  const scale = 5.6;
  const bar = (year: 1871 | 1907, y: number) => {
    const { agrar, industrie } = SECTOR_SHARES[year];
    const rest = 100 - agrar - industrie;
    const x0 = 120;
    const w1 = agrar * scale,
      w2 = industrie * scale,
      w3 = rest * scale;
    return `${label(60, y + 32, String(year), "lbl strong")}${rect(x0, y, w1, 50, "sec-agrar")}${rect(x0 + w1, y, w2, 50, "sec-ind")}${rect(x0 + w1 + w2, y, w3, 50, "sec-rest")}${label(x0 + w1 / 2, y + 31, year === 1871 ? "rund die Hälfte" : "34 %", "lbl small on-fill")}${label(x0 + w1 + w2 / 2, y + 31, year === 1871 ? "rund 29 %" : "40 %", "lbl small on-fill")}${label(x0 + w1 + w2 + w3 / 2, y + 31, "übrige", "lbl tiny on-fill")}`;
  };
  return svg(
    800,
    360,
    "Balkendiagramm der Beschäftigten im Deutschen Reich: 1871 arbeitete rund die Hälfte in der Landwirtschaft und rund 29 Prozent in Gewerbe und Industrie. 1907 waren es 34 Prozent in der Landwirtschaft und 40 Prozent in Gewerbe und Industrie. Der Rest entfällt auf übrige Bereiche.",
    `${rect(0, 0, 800, 360, "scene-bg")}${label(400, 36, "Wo arbeiteten die Beschäftigten?", "lbl strong")}${bar(1871, 70)}${bar(1907, 160)}
    ${rect(120, 250, 22, 16, "sec-agrar")}${label(150, 263, "Landwirtschaft", "lbl small", "start")}${rect(300, 250, 22, 16, "sec-ind")}${label(330, 263, "Gewerbe und Industrie", "lbl small", "start")}${rect(540, 250, 22, 16, "sec-rest")}${label(570, 263, "übrige Bereiche", "lbl small", "start")}
    ${labels(400, 300, "Von der Agrargesellschaft zur Industriegesellschaft:\nDie Bevölkerung wuchs von 1871 bis 1910 von 41 auf 65 Millionen.", "lbl small")}`,
  );
}

/** The years the model town can show; the lesson's buttons switch between them. */
export const TOWN_YEARS = [1850, 1870, 1890, 1910] as const;
export const TOWN_NEWS: Record<(typeof TOWN_YEARS)[number], string> = {
  1850: "1850: Kleine Altstadt mit Kirche, Markt und Stadtmauer. Ringsum Felder.",
  1870: "1870: Die Eisenbahn kommt. Am Bahnhof entstehen die ersten Fabriken.",
  1890: "1890: Die Mauer ist abgerissen. Mietshausviertel wachsen um die Fabriken, im Westen erste Villen.",
  1910: "1910: Ein Kraftwerk liefert Strom, eine elektrische Straßenbahn verbindet die Viertel.",
};

export function modelTown(): string {
  const oldTown = `${[0, 1, 2, 3, 4, 5].map((i) => house(250 + (i % 3) * 34, 170 + Math.floor(i / 3) * 40, 26, 24)).join("")}<path class="roof-red" d="M282 120L292 80L302 120Z"/>${rect(284, 120, 16, 32, "church")}${rect(300, 214, 34, 16, "market")}`;
  const wall = `<ellipse class="city-wall" cx="300" cy="200" rx="80" ry="66"/>`;
  const rail = `${line(0, 110, 800, 110, "rail")}${line(0, 110, 800, 110, "rail-ties")}${rect(420, 86, 60, 24, "station")}`;
  const factories = `${factory(500, 140, 90)}${factory(620, 150, 70)}`;
  const blocks = [0, 1, 2, 3, 4, 5, 6, 7]
    .map((i) => rect(440 + (i % 4) * 58, 220 + Math.floor(i / 4) * 44, 46, 34, "block"))
    .join("");
  const villas = [0, 1, 2]
    .map((i) => `${circle(60 + i * 50, 190 + (i % 2) * 40, 16, "tree")}${house(44 + i * 50, 240 + (i % 2) * 20, 30, 22, "villa")}`)
    .join("");
  const plant = `${rect(700, 210, 60, 50, "plant")}${rect(740, 168, 10, 42, "chimney")}<path class="bolt" d="M722 222l-8 16h8l-6 16l16 -20h-8l6 -12z"/>`;
  const tram = `<path class="tram" d="M120 300Q300 330 470 300T780 290"/>${rect(300, 306, 34, 16, "tram-car", 4)}`;
  const fields = `${rect(0, 0, 800, 360, "field")}`;
  return `<div class="town-controls" role="group" aria-label="Zeitregler der Modellstadt">${TOWN_YEARS.map((year, i) => `<button type="button" class="chip" data-town-year="${year}" aria-pressed="${i === 0}">${year}</button>`).join("")}</div>${svg(
    800,
    360,
    "Erfundene Modellstadt Neustadt am Fluss, die sich mit dem Zeitregler von 1850 bis 1910 verändert: 1850 eine kleine Altstadt mit Mauer und Feldern, 1870 Eisenbahn, Bahnhof und erste Fabriken, 1890 abgerissene Mauer, Mietshausviertel und Villen, 1910 Kraftwerk und elektrische Straßenbahn.",
    `${fields}<path class="river" d="M0 340Q200 310 400 336T800 330V360H0Z"/>${oldTown}<g class="until-1870">${wall}</g><g class="from-1870">${rail}${factories}</g><g class="from-1890">${blocks}${villas}</g><g class="from-1910">${plant}${tram}</g>${label(300, 290, "Altstadt", "lbl small strong")}<g class="from-1870">${label(450, 78, "Bahnhof", "lbl tiny strong")}${label(590, 196, "Fabriken", "lbl tiny strong")}</g><g class="from-1890">${label(556, 316, "Mietshäuser", "lbl tiny strong")}${label(110, 290, "Villen", "lbl tiny strong")}</g><g class="from-1910">${label(730, 280, "Kraftwerk", "lbl tiny strong")}${label(200, 340, "Straßenbahn", "lbl tiny strong")}</g>`,
  )}<p class="town-news" aria-live="polite">${TOWN_YEARS.map((year, i) => `<span data-news="${year}"${i === 0 ? "" : " hidden"}>${esc(TOWN_NEWS[year])}</span>`).join("")}</p>`;
}

export function districts(): string {
  const workers = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    .map((i) => rect(500 + (i % 3) * 52, 130 + Math.floor(i / 3) * 52, 42, 42, "block"))
    .join("");
  const villas = [0, 1, 2, 3, 4]
    .map((i) => `${circle(70 + (i % 3) * 70, 120 + Math.floor(i / 3) * 90, 20, "tree")}${house(92 + (i % 3) * 70, 160 + Math.floor(i / 3) * 90, 34, 24, "villa")}`)
    .join("");
  const settlement = [0, 1, 2, 3, 4, 5]
    .map((i) => house(560 + (i % 6) * 36, 320, 28, 22, "settlement"))
    .join("");
  return svg(
    800,
    360,
    "Schematischer Plan einer Industriestadt um 1900: In der Mitte die Altstadt, rechts Fabriken mit einem dichten Arbeiterviertel aus Mietshäusern, darunter eine Werkssiedlung mit gleichen Häusern. Links im Grünen ein Villenviertel. Eine Straßenbahn verbindet die Viertel.",
    `${rect(0, 0, 800, 360, "field")}${rect(0, 60, 270, 240, "garden-zone", 18)}${rect(480, 60, 310, 230, "worker-zone", 18)}${rect(530, 296, 250, 56, "settlement-zone", 12)}
    ${villas}${workers}${factory(680, 110, 90)}${settlement}${circle(380, 190, 56, "old-core")}${label(380, 195, "Altstadt", "lbl small strong")}
    <path class="tram" d="M200 330Q380 280 520 250"/>
    ${label(135, 50, "Villenviertel", "lbl strong")}${label(135, 290, "Gärten, Ruhe, gute Luft", "lbl tiny")}${label(600, 50, "Arbeiterviertel", "lbl strong")}${label(725, 200, "Fabriken", "lbl tiny strong")}${label(655, 312, "Werkssiedlung der Firma", "lbl tiny strong")}${label(330, 330, "Straßenbahn", "lbl tiny")}`,
  );
}

export function jobs(): string {
  const cards: Array<[string, string, (x: number, y: number) => string]> = [
    ["Lokführer", "seit der Eisenbahn", (x, y) => `${rect(x - 34, y - 6, 52, 26, "loco")}${rect(x + 18, y - 22, 22, 42, "loco")}${rect(x - 30, y - 24, 10, 18, "chimney")}${circle(x - 20, y + 24, 9, "wheel")}${circle(x + 10, y + 24, 9, "wheel")}${circle(x + 32, y + 24, 9, "wheel")}`],
    ["Elektriker", "seit Strom und Kraftwerken", (x, y) => `${circle(x, y - 4, 20, "bulb")}${rect(x - 9, y + 16, 18, 14, "bulb-base")}<path class="bolt" d="M${x + 2} ${y - 16}l-8 12h7l-5 12l13 -15h-7l5 -9z"/>`],
    ["Chemiker", "seit der chemischen Industrie", (x, y) => `<path class="flask" d="M${x - 8} ${y - 28}h16v18l18 34h-52l18 -34z"/><path class="flask-liquid" d="M${x - 20} ${y + 12}h40l6 12h-52z"/>`],
    ["Ingenieur", "plant Maschinen und Werke", (x, y) => `${circle(x, y, 22, "gear")}${circle(x, y, 8, "gear-hole")}`],
    ["Büroangestellte", "Buchhaltung und Schriftverkehr", (x, y) => `${rect(x - 30, y - 6, 60, 28, "desk", 3)}${rect(x - 20, y - 26, 40, 22, "paper")}${line(x - 14, y - 18, x + 14, y - 18, "paper-line")}${line(x - 14, y - 11, x + 10, y - 11, "paper-line")}`],
    ["Verkäuferin", "im Warenhaus", (x, y) => `${rect(x - 34, y, 68, 26, "counter", 3)}${person(x, y + 2, 0.9, "cloth-b")}${rect(x - 30, y - 30, 16, 14, "parcel")}${rect(x + 16, y - 26, 14, 12, "parcel")}`],
  ];
  const body = cards
    .map(([title, note, icon], i) => {
      const x = 140 + (i % 3) * 260;
      const y = 30 + Math.floor(i / 3) * 165;
      return `${panel(x - 115, y, 230, 150, "job-card")}${icon(x, y + 62)}${label(x, y + 122, title, "lbl strong")}${label(x, y + 140, note, "lbl tiny")}`;
    })
    .join("");
  return svg(
    800,
    360,
    "Sechs Berufe der Industriegesellschaft als Bildkarten: Lokführer mit Lokomotive, Elektriker mit Glühbirne, Chemiker mit Glaskolben, Ingenieur mit Zahnrad, Büroangestellte mit Schreibtisch und Papier, Verkäuferin an der Ladentheke eines Warenhauses.",
    `${rect(0, 0, 800, 360, "scene-bg")}${body}`,
  );
}

export function alliances(): string {
  const box = (x: number, y: number, w: number, name: string, cls: string) =>
    `${rect(x, y, w, 44, cls, 10)}${label(x + w / 2, y + 27, name, "lbl small on-fill")}`;
  return svg(
    800,
    360,
    "Schema der Bündnisse vor 1914, keine Landkarte: Links und rechts die Entente aus Großbritannien, Frankreich und Russland in Blau, in der Mitte die Mittelmächte Deutsches Reich und Österreich-Ungarn in Orange. Serbien ist mit Russland verbunden. Italien gehörte zum Dreibund, trat 1915 aber gegen Österreich-Ungarn in den Krieg ein.",
    `${rect(0, 0, 800, 360, "scene-bg")}
    ${line(150, 92, 120, 180, "ally-entente")}${line(170, 202, 610, 202, "ally-entente faint")}${line(180, 70, 630, 180, "ally-entente faint")}${line(390, 138, 420, 230, "ally-central")}${line(640, 225, 560, 300, "ally-serbia")}${line(430, 250, 530, 310, "conflict")}
    ${box(60, 48, 180, "Großbritannien", "bloc-entente")}${box(40, 180, 170, "Frankreich", "bloc-entente")}${box(600, 180, 170, "Russland", "bloc-entente")}${box(310, 96, 190, "Deutsches Reich", "bloc-central")}${box(330, 230, 200, "Österreich-Ungarn", "bloc-central")}${box(500, 296, 130, "Serbien", "bloc-serbia")}${box(190, 296, 150, "Italien", "bloc-neutral")}
    ${rect(560, 24, 22, 16, "bloc-entente", 4)}${label(590, 37, "Entente", "lbl small", "start")}${rect(560, 50, 22, 16, "bloc-central", 4)}${label(590, 63, "Mittelmächte", "lbl small", "start")}${rect(560, 76, 22, 16, "bloc-neutral", 4)}${label(590, 89, "Dreibund, 1915 Seitenwechsel", "lbl tiny", "start")}
    ${label(470, 290, "Konflikt", "lbl tiny strong")}${label(400, 22, "Zwei Blöcke vor 1914", "lbl strong")}`,
  );
}

export function dominoes(): string {
  const stones: Array<[string, string]> = [
    ["Serbien", "bloc-serbia"],
    ["Österreich-Ungarn", "bloc-central"],
    ["Russland", "bloc-entente"],
    ["Deutsches Reich", "bloc-central"],
    ["Frankreich", "bloc-entente"],
    ["Belgien", "bloc-neutral"],
    ["Großbritannien", "bloc-entente"],
  ];
  const body = stones
    .map(([name, cls], i) => {
      const x = 70 + i * 106;
      const tilt = i < 6 ? -14 + i * 2 : 0;
      return `<g transform="rotate(${tilt} ${x} 260)">${rect(x - 22, 110, 44, 150, cls, 8)}${circle(x, 150, 6, "pip")}${circle(x, 220, 6, "pip")}</g>${labels(x, 290, name.replace("-", "-\n").replace(" ", "\n"), "lbl tiny strong")}`;
    })
    .join("");
  return svg(
    800,
    360,
    "Sieben Dominosteine stehen hintereinander und kippen: Serbien, Österreich-Ungarn, Russland, Deutsches Reich, Frankreich, Belgien und Großbritannien. Das Bild zeigt, wie die Bündnisse einen Staat nach dem anderen in den Krieg zogen.",
    `${rect(0, 0, 800, 360, "scene-bg")}${rect(0, 260, 800, 6, "domino-floor")}${body}${label(400, 40, "Wie Bündnisse Staat um Staat in den Krieg zogen", "lbl strong")}${label(400, 70, "Bild für die Julikrise: Der erste Stein brachte die anderen ins Kippen.", "lbl tiny")}`,
  );
}

export function debate(): string {
  const stations: Array<[number, string, string, string]> = [
    [90, "1919", "Versailler Vertrag:\nDeutschland und\nVerbündete verantwortlich", "pos-1"],
    [270, "1930er", "„Hineingeschlittert“:\nkeiner allein\nverantwortlich", "pos-2"],
    [450, "1961", "Fritz Fischer:\nHauptverantwortung\nder Reichsleitung", "pos-3"],
    [630, "2012/13", "Christopher Clark:\nalle Großmächte\nbeteiligt", "pos-4"],
  ];
  const body = stations
    .map(
      ([x, year, text, cls]) =>
        `${circle(x, 90, 16, cls)}${label(x, 60, year, "lbl strong")}${rect(x - 80, 130, 160, 92, `bubble ${cls}`, 12)}${labels(x, 158, text, "lbl tiny on-fill")}${line(x, 106, x, 130, "axis")}`,
    )
    .join("");
  return svg(
    800,
    360,
    "Zeitstrahl der Kriegsschuldfrage: 1919 erklärt der Versailler Vertrag Deutschland und seine Verbündeten für verantwortlich, in den 1930er Jahren heißt es, Europa sei hineingeschlittert, 1961 sieht Fritz Fischer die Hauptverantwortung bei der Reichsleitung, 2012 und 2013 betont Christopher Clark die Beteiligung aller Großmächte. Heute streitet die Forschung weiter.",
    `${rect(0, 0, 800, 360, "scene-bg")}${line(40, 90, 760, 90, "axis")}${arrow(700, 90, 780, 90)}${body}${rect(160, 260, 480, 60, "panel-bg", 14)}${labels(400, 284, "Heute: Die Forschung streitet weiter. Manche, etwa Gerd Krumeich,\nsehen die größte Verantwortung weiter beim Deutschen Reich.", "lbl tiny")}`,
  );
}

/** Territories in the Versailles diagram, placed roughly by direction from the Reich. */
export const VERSAILLES_LOSSES: ReadonlyArray<readonly [x: number, y: number, region: string, to: string]> = [
  [400, 34, "Nordschleswig", "geteilt mit Dänemark (Abstimmung)"],
  [640, 60, "Memelgebiet", "alliierte Kontrolle"],
  [560, 112, "Danzig", "Freie Stadt (Völkerbund)"],
  [680, 196, "Posen, Westpreußen", "an Polen (Teile blieben)"],
  [600, 306, "Hultschiner Ländchen", "an die Tschechoslowakei"],
  [116, 92, "Eupen-Malmedy", "an Belgien (Abstimmung)"],
  [96, 196, "Elsass-Lothringen", "an Frankreich"],
  [150, 300, "Saargebiet", "15 Jahre Völkerbund"],
];

export function versaillesMap(): string {
  const losses = VERSAILLES_LOSSES.map(([x, y, region, to]) => {
    const dx = x - 400,
      dy = y - 190;
    const d = Math.hypot(dx, dy);
    const sx = 400 + (dx / d) * 120,
      sy = 190 + (dy / d) * 70;
    const ex = x - (dx / d) * 40,
      ey = y - (dy / d) * 18;
    return `${arrow(sx, sy, ex, ey, "arrow loss")}${rect(x - 82, y - 20, 164, 40, "loss-box", 8)}${label(x, y - 3, region, "lbl tiny strong")}${label(x, y + 12, to, "lbl tiny")}`;
  }).join("");
  return svg(
    800,
    360,
    "Schema der Gebietsverluste nach dem Versailler Vertrag, keine maßstabsgetreue Karte: Vom Deutschen Reich in der Mitte führen Pfeile zu Nordschleswig, Memelgebiet, Danzig, Posen und Westpreußen, Hultschiner Ländchen, Eupen-Malmedy, Elsass-Lothringen und Saargebiet. Dazu kommen der Verlust aller Kolonien und das besetzte, entmilitarisierte Rheinland.",
    `${rect(0, 0, 800, 360, "scene-bg")}<ellipse class="reich" cx="400" cy="190" rx="130" ry="80"/>${rect(282, 150, 44, 96, "rhineland", 8)}${labels(304, 182, "Rhein-\nland", "lbl tiny strong on-fill")}${labels(420, 176, "Deutsches Reich\nnach 1919", "lbl small strong on-fill")}${labels(420, 220, "⅐ des Gebiets und\n⅒ der Bevölkerung verloren", "lbl tiny on-fill")}${losses}${rect(300, 300, 200, 44, "loss-box", 8)}${label(400, 318, "Alle Kolonien", "lbl tiny strong")}${label(400, 334, "abgegeben", "lbl tiny")}`,
  );
}

export function voices(): string {
  const people: Array<[number, string, string, string]> = [
    [100, "cloth-uniform", "Militär", "Nur noch\n100 000 Mann?\nIch verliere\nmeine Stellung."],
    [300, "cloth-a", "Wirtschaft", "Reparationen!\nWer soll das\nbezahlen?"],
    [500, "cloth-c", "Grenzen", "Unsere Stadt\ngehört jetzt\nzu Polen."],
    [700, "cloth-d", "Ehre und Schuld", "Allein schuld?\nEine\nDemütigung!"],
  ];
  const body = people
    .map(
      ([x, cls, group, text], i) =>
        `${rect(x - 86, 24, 172, 112, `voice voice-${i + 1}`, 14)}<path class="voice voice-${i + 1}" d="M${x - 10} 136l10 18l10 -18z"/>${labels(x, 52, text, "lbl small on-fill")}${person(x, 260, 1.9, cls)}${label(x, 290, group, "lbl small strong")}`,
    )
    .join("");
  return svg(
    800,
    360,
    "Vier gezeichnete Personen mit Sprechblasen nach dem Versailler Vertrag: ein Offizier, der seine Stellung verliert, ein Unternehmer, der die Reparationen fürchtet, eine Frau aus Posen, deren Stadt nun zu Polen gehört, und ein Mann, der die Kriegsschuld als Demütigung empfindet. Darunter ein Band zur Dolchstoßlegende.",
    `${rect(0, 0, 800, 360, "scene-bg")}${body}${rect(80, 310, 640, 40, "legend-band", 10)}${label(400, 335, "Gegner der Republik nutzten die Unzufriedenheit: Dolchstoßlegende", "lbl small strong on-fill")}`,
  );
}
