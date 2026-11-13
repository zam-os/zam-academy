/** Drawn figures for Lernbereich 2 (Zeit und Wandel). Scenes are simplified. */
import { arrow, f1, label, labels, panel, person, svg } from "./draw";

/** Year → x on a linear axis; there is no year 0 (1 v. Chr. is followed by 1 n. Chr.). */
const scale = (from: number, to: number, x0: number, x1: number) => (year: number) =>
  x0 + ((year - from) / (to - from)) * (x1 - x0);

export function timeline(): string {
  const big = scale(-10000, 2026, 40, 760);
  const zoom = scale(-1000, 600, 40, 760);
  const bar = (
    x0: number,
    x1: number,
    y: number,
    cls: string,
    text: string,
    anchor: "start" | "middle" = "middle",
  ) =>
    `<rect class="${cls}" x="${f1(x0)}" y="${y}" width="${f1(Math.max(4, x1 - x0))}" height="18" rx="5"/>${
      x1 - x0 > 120
        ? label((x0 + x1) / 2, y + 13, text, "lbl tiny on-bar")
        : label(anchor === "middle" ? (x0 + x1) / 2 : x0, y - 5, text, "lbl tiny", anchor)
    }`;
  const ticks = (s: (y: number) => number, years: number[], y: number) =>
    years
      .map(
        (yr) =>
          `<line class="tick" x1="${f1(s(yr))}" x2="${f1(s(yr))}" y1="${y - 5}" y2="${y + 5}"/>${label(s(yr), y + 20, yr < 0 ? `${-yr} v. Chr.` : yr === 2026 ? "heute" : `${yr} n. Chr.`, "lbl tiny")}`,
      )
      .join("");
  const event = (s: (y: number) => number, year: number, y: number, text: string, dy = -12) =>
    `<circle class="event" cx="${f1(s(year))}" cy="${y}" r="5"/>${labels(s(year), y + dy, text, "lbl tiny")}`;
  const top = `${label(40, 24, "12 000 Jahre im Überblick", "lbl strong", "start")}
  <line class="axis" x1="30" x2="770" y1="130" y2="130"/>
  ${bar(18, big(-9600), 60, "ep-paleo", "← Altsteinzeit", "start")}
  ${bar(big(-9600), big(-5500), 84, "ep-meso", "Mittelsteinzeit")}
  ${bar(big(-5500), big(-2200), 60, "ep-neo", "Jungsteinzeit in Mitteleuropa")}
  ${bar(big(-3000), big(-30), 96, "ep-egypt", "Altes Ägypten")}
  ${bar(big(-753), big(476), 60, "ep-rome", "Rom", "start")}
  ${ticks(big, [-10000, -8000, -6000, -4000, -2000, 1, 2026], 130)}`;
  const bottom = `${label(40, 190, "Vergrößert: 1000 v. Chr. bis 600 n. Chr.", "lbl strong", "start")}
  <line class="axis" x1="30" x2="770" y1="290" y2="290"/><line class="zero" x1="${f1(zoom(1))}" x2="${f1(zoom(1))}" y1="200" y2="300"/>${labels(zoom(1) - 6, 262, "Christi Geburt\n(Jahr 1)", "lbl tiny", "end")}
  ${bar(zoom(-1000), zoom(-30), 210, "ep-egypt", "Altes Ägypten (seit etwa 3000 v. Chr.)")}
  ${bar(zoom(-753), zoom(476), 234, "ep-rome", "Rom: Stadtgründung (Sage) 753 v. Chr. bis 476 n. Chr. im Westen")}
  ${event(zoom, -508, 290, "Athen: Volks-\nversammlung", -22)}
  ${event(zoom, -15, 290, "Römer im\nAlpenvorland", 30)}
  ${event(zoom, 100, 290, "Limes", -14)}
  ${event(zoom, 260, 290, "Limes\naufgegeben", 30)}
  ${ticks(zoom, [-1000, -500, 500], 290)}
  ${arrow(zoom(-80), 352, zoom(-760), 352, "arrow thin")}${label(zoom(-420), 368, "vor Christus: zur Zeitenwende hin werden die Zahlen kleiner", "lbl tiny")}${arrow(zoom(80), 352, zoom(560), 352, "arrow thin")}${label(zoom(320), 368, "nach Christus: Zahlen werden größer", "lbl tiny")}`;
  return svg(
    800,
    378,
    "Zwei Zeitleisten: oben 12 000 Jahre mit Altsteinzeit, Mittelsteinzeit, Jungsteinzeit, Altem Ägypten und Rom; unten vergrößert die Zeit von 1000 vor bis 600 nach Christus mit Christi Geburt als Jahr 1",
    `${top}${bottom}`,
  );
}

export function oldStoneAge(): string {
  const reindeer = (x: number, y: number) =>
    `<g class="animal"><ellipse cx="${x}" cy="${y}" rx="16" ry="8"/><path d="M${x + 12} ${y - 4}l8-10 4 2-6 10z"/><path class="antler" d="M${x + 20} ${y - 14}l-4-10m4 10l6-9"/><path class="leg" d="M${x - 10} ${y + 6}v12M${x + 8} ${y + 6}v12"/></g>`;
  const body = `<rect class="sky cold" width="800" height="300"/><path class="hill snowy" d="M0 170Q160 110 320 160T640 140T800 150V300H0Z"/><path class="ground-cold" d="M0 220Q200 200 400 215T800 210V300H0Z"/>
  <g class="mammoth"><ellipse cx="640" cy="150" rx="34" ry="22"/><circle cx="672" cy="140" r="14"/><path d="M682 146q14 18 4 30" class="trunk"/><path class="leg" d="M618 166v18M636 168v18M652 168v18"/></g>
  ${reindeer(470, 182)}${reindeer(520, 190)}${reindeer(560, 178)}
  <path class="tent" d="M120 250L170 150L220 250Z"/><path class="tent-pole" d="M162 140l8 10 8-10"/><path class="tent-door" d="M160 250l10-30 10 30z"/>
  <path class="fire" d="M270 250q-14-18 0-38q4 14 10 4q8 18-2 34z"/><path class="wood" d="M256 252l36-6M258 246l34 8"/>
  ${person(330, 252, 1.2, "cloth-fur", "out")}<line class="spear" x1="350" y1="262" x2="372" y2="190"/><path class="spear-tip" d="M372 190l-2 10 6-1z"/>
  ${person(80, 252, 1.1, "cloth-fur")}<path class="bush" d="M30 252q0-24 22-24t22 24z"/><circle class="berry" cx="44" cy="238" r="3"/><circle class="berry" cx="56" cy="234" r="3"/><circle class="berry" cx="60" cy="244" r="3"/>
  <path class="handaxe" d="M720 230q14 10 10 40q-12 10-22 0q-4-30 12-40z"/>
  ${label(170, 272, "Zelt aus Fellen", "lbl tiny")}${label(276, 272, "Feuer", "lbl tiny")}${label(350, 280, "Jäger mit Speer", "lbl tiny")}${label(60, 280, "Sammeln", "lbl tiny")}${label(515, 220, "Rentierherde", "lbl tiny")}${label(645, 110, "Mammut", "lbl tiny")}${label(720, 288, "Faustkeil", "lbl tiny")}
  ${label(400, 30, "Altsteinzeit: Leben in der Eiszeit", "lbl strong")}`;
  return svg(
    800,
    300,
    "Szene aus der Altsteinzeit in der Eiszeit: ein Zelt aus Fellen, ein Feuer, ein Jäger mit Speer, eine Person sammelt Beeren, in der Ferne Rentiere und ein Mammut, dazu ein Faustkeil",
    body,
  );
}

export function newStoneAge(): string {
  const sheep = (x: number, y: number) =>
    `<g class="sheep"><ellipse cx="${x}" cy="${y}" rx="14" ry="9"/><circle class="sheep-head" cx="${x + 14}" cy="${y - 3}" r="5"/><path class="leg" d="M${x - 8} ${y + 7}v9M${x + 6} ${y + 7}v9"/></g>`;
  const grain = Array.from({ length: 18 }, (_, i) => {
    const x = 470 + i * 16;
    return `<path class="grain" d="M${x} 262v-34"/><ellipse class="ear" cx="${x}" cy="226" rx="3" ry="8"/>`;
  }).join("");
  const body = `<rect class="sky" width="800" height="300"/><path class="hill green" d="M0 180Q200 140 400 170T800 160V300H0Z"/>
  <rect class="field" x="450" y="212" width="320" height="60" rx="6"/>${grain}
  <rect class="longhouse" x="60" y="170" width="250" height="82"/><path class="thatch" d="M44 176L185 110L326 176Z"/><rect class="door" x="170" y="212" width="26" height="40"/><path class="smoke" d="M190 100q-10-14 4-24t-2-24"/>
  <path class="fence" d="M330 252v-30M350 252v-30M370 252v-30M390 252v-30M410 252v-30M326 232h88M326 244h88"/>
  ${sheep(360, 262)}${sheep(400, 270)}
  <path class="pot" d="M100 272h36v-18q0-10-10-12h-16q-10 2-10 12z"/><path class="pot-pattern" d="M104 258h28M104 264h28"/>
  ${person(440, 270, 1.15, "cloth-linen", "out")}<path class="sickle" d="M458 254q16-16 2-28"/>
  ${label(185, 290, "Langhaus aus Holz, Lehm und Stroh", "lbl tiny")}${label(118, 290, "", "lbl tiny")}${label(118, 240, "Tontopf", "lbl tiny")}${label(615, 290, "Feld mit Getreide", "lbl tiny")}${label(380, 292, "Haustiere", "lbl tiny")}${label(470, 200, "Ernte mit der Sichel", "lbl tiny", "start")}
  ${label(400, 30, "Jungsteinzeit: Leben im Dorf", "lbl strong")}`;
  return svg(
    800,
    300,
    "Szene aus der Jungsteinzeit: ein Langhaus aus Holz, Lehm und Stroh, ein Zaun mit Schafen, ein Tontopf, ein Getreidefeld und eine Person mit Sichel",
    body,
  );
}

export function huntersToFarmers(): string {
  const rows: Array<[string, string, string]> = [
    ["Nahrung", "jagen und sammeln", "Getreide anbauen, Tiere halten"],
    ["Wohnen", "Zelte und Höhlen, oft wechselnd", "feste Häuser im Dorf"],
    ["Lebensweise", "ziehen den Tieren nach", "bleiben am Feld: sesshaft"],
    ["Dinge", "Faustkeil, Speer, Kleidung aus Fell", "Tontöpfe, Sichel, geschliffenes Beil, Webstoff"],
  ];
  const body = `${panel(130, 10, 320, 330, "col-old")}${panel(470, 10, 320, 330, "col-new")}
  ${labels(290, 40, "Jäger und Sammler\n(Altsteinzeit)", "lbl strong")}${labels(630, 40, "Ackerbauern und Viehzüchter\n(Jungsteinzeit)", "lbl strong")}
  ${rows
    .map(
      ([head, a, b], i) =>
        `${label(18, 108 + i * 64, head, "lbl small strong", "start")}${labels(290, 104 + i * 64, a.length > 30 ? a.replace(", ", ",\n") : a, "lbl small")}${labels(630, 104 + i * 64, b.length > 30 ? b.replace(", ", ",\n") : b, "lbl small")}`,
    )
    .join("")}
  ${arrow(452, 330, 468, 330)}${label(460, 360, "allmählicher Wandel über viele Generationen", "lbl tiny")}`;
  return svg(
    800,
    370,
    "Vergleich in zwei Spalten: Jäger und Sammler der Altsteinzeit und Ackerbauern und Viehzüchter der Jungsteinzeit nach Nahrung, Wohnen, Lebensweise und Dingen des Alltags",
    body,
  );
}

export function nileYear(): string {
  const cx = 200,
    cy = 170,
    r = 120;
  const sector = (a0: number, a1: number, cls: string) => {
    const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x0, y0] = p(a0),
      [x1, y1] = p(a1);
    return `<path class="${cls}" d="M${cx} ${cy}L${f1(x0)} ${f1(y0)}A${r} ${r} 0 0 1 ${f1(x1)} ${f1(y1)}Z"/>`;
  };
  const t = (deg: number) => (deg * Math.PI) / 180;
  const body = `${sector(t(-90), t(30), "season-flood")}${sector(t(30), t(150), "season-grow")}${sector(t(150), t(270), "season-harvest")}<circle class="hub" cx="${cx}" cy="${cy}" r="42"/>${labels(cx, cy - 4, "Das Jahr\nam Nil", "lbl small strong")}
  ${labels(cx + 64, cy - 46, "Achet:\nÜber-\nschwemmung", "lbl tiny on-season", "middle", 13)}${labels(cx, cy + 62, "Peret:\nAussaat und\nWachstum", "lbl tiny on-season", "middle", 13)}${labels(cx - 64, cy - 46, "Schemu:\nErnte und\nTrockenzeit", "lbl tiny on-season", "middle", 13)}
  ${panel(360, 30, 420, 280)}${label(380, 62, "Was die Ägypter daraus lernten", "lbl strong", "start")}
  ${labels(380, 100, "• Sie beobachteten jedes Jahr, wann die Flut kam.\n• Daraus entstand ein Kalender mit 365 Tagen:\n   12 Monate zu 30 Tagen und 5 Zusatztage.\n• Nach der Flut waren die Grenzsteine der Felder\n   oft verschwunden. Landvermesser maßen die\n   Felder mit Schnüren neu aus.\n• Schreiber hielten Ernten und Abgaben\n   in Hieroglyphen auf Papyrus fest.", "lbl small", "start", 22)}`;
  return svg(
    800,
    330,
    "Kreis mit den drei Jahreszeiten am Nil: Achet, die Überschwemmung, Peret, Aussaat und Wachstum, und Schemu, Ernte und Trockenzeit; daneben, was die Ägypter daraus entwickelten: Kalender, Vermessung und Schrift",
    body,
  );
}

export function nileToday(): string {
  const body = `${panel(10, 10, 380, 300)}${label(200, 40, "Früher", "lbl strong")}
  <path class="river-band" d="M30 150h340"/><path class="flood-zone" d="M30 120h340v60H30z"/>${labels(200, 214, "Jedes Jahr Hochwasser:\nfruchtbarer Schlamm auf den Feldern,\naber auch Zerstörung, wenn die Flut\nzu hoch war, und Hunger bei zu wenig Wasser", "lbl small")}
  ${panel(410, 10, 380, 300)}${label(600, 40, "Heute: Assuan-Hochdamm", "lbl strong")}
  <path class="reservoir" d="M430 90h150v120H430z"/>${labels(505, 146, "Nasser-\nStausee", "lbl small on-water")}
  <path class="dam" d="M580 80h40l20 140h-80z"/><circle class="turbine-wheel" cx="610" cy="190" r="10"/>
  <path class="river-band" d="M640 200h130"/>
  ${arrow(626, 180, 700, 112, "arrow power")}${labels(706, 96, "Strom aus\nWasserkraft", "lbl tiny", "start")}
  ${labels(600, 252, "Wasser für die Felder das ganze Jahr\nund Schutz vor Hochwasser –\nder Schlamm bleibt im Stausee", "lbl small")}`;
  return svg(
    800,
    320,
    "Links früher: jedes Jahr Hochwasser mit fruchtbarem Schlamm. Rechts heute: Der Assuan-Hochdamm staut den Nasser-Stausee, erzeugt Strom und liefert das ganze Jahr Wasser, aber der Schlamm bleibt im See.",
    body,
  );
}

export function nileAchievements(): string {
  const cards: Array<[string, string]> = [
    ["Schiffe", "mit der Strömung nach Norden,\nmit dem Wind nach Süden"],
    ["Kalender", "365 Tage, abgeleitet\nvom Rhythmus der Flut"],
    ["Vermessung", "Felder nach jeder Flut\nneu ausmessen"],
    ["Schrift", "Hieroglyphen auf Papyrus\naus der Nilpflanze"],
    ["Bewässerung", "Kanäle und Schaduf\nheben Wasser aufs Feld"],
  ];
  const icon = (i: number, x: number, y: number) =>
    [
      `<path class="hull" d="M${x - 30} ${y + 10}h60l-10 12h-40z"/><line class="mast" x1="${x}" y1="${y + 10}" x2="${x}" y2="${y - 30}"/><path class="sail" d="M${x + 2} ${y - 28}l24 30h-24z"/>`,
      `<rect class="calendar" x="${x - 26}" y="${y - 26}" width="52" height="48" rx="5"/><rect class="calendar-top" x="${x - 26}" y="${y - 26}" width="52" height="12" rx="5"/><text class="lbl calendar-num" x="${x}" y="${y + 14}" text-anchor="middle">365</text>`,
      `<rect class="field" x="${x - 30}" y="${y - 20}" width="60" height="40"/><path class="rope" d="M${x - 30} ${y - 20}L${x + 30} ${y + 20}"/><circle class="peg" cx="${x - 30}" cy="${y - 20}" r="4"/><circle class="peg" cx="${x + 30}" cy="${y + 20}" r="4"/>`,
      `<rect class="papyrus" x="${x - 28}" y="${y - 26}" width="56" height="50" rx="3"/><path class="glyph" d="M${x - 16} ${y - 12}q6-8 12 0M${x - 14} ${y + 2}h10v10M${x + 6} ${y - 14}a6 6 0 1 0 0.1 0M${x + 4} ${y + 4}l10 10"/>`,
      `<line class="shaduf" x1="${x - 24}" y1="${y + 22}" x2="${x - 24}" y2="${y - 8}"/><line class="shaduf" x1="${x - 44}" y1="${y - 2}" x2="${x + 24}" y2="${y - 24}"/><path class="bucket" d="M${x + 20} ${y - 18}v20h10v-20"/><path class="water-line" d="M${x - 10} ${y + 24}h44"/>`,
    ][i];
  const body = cards
    .map(([title, text], i) => {
      const x = 80 + i * 160;
      return `${panel(x - 72, 16, 144, 230)}${icon(i, x, 80)}${label(x, 146, title, "lbl strong")}${labels(x, 176, text, "lbl tiny")}`;
    })
    .join("");
  return svg(
    800,
    260,
    "Fünf Leistungen, die mit dem Nil zusammenhängen: Schiffe auf dem Fluss, ein Kalender mit 365 Tagen, die Vermessung der Felder, die Schrift auf Papyrus und die Bewässerung mit Kanälen und Schaduf",
    body,
  );
}

export function limesStructure(): string {
  const body = `<rect class="sky" width="800" height="280"/><path class="ground-line" d="M0 220H800V280H0Z"/>
  ${Array.from({ length: 9 }, (_, i) => `<rect class="palisade" x="${90 + i * 12}" y="150" width="9" height="70"/><path class="palisade" d="M${90 + i * 12} 150l4.5-8 4.5 8z"/>`).join("")}${label(142, 238, "Palisade aus Holz", "lbl tiny")}
  <path class="ditch" d="M222 220l40 34 40-34z"/>${label(262, 274, "Graben (später)", "lbl tiny")}
  <path class="wall-earth" d="M318 220q40-40 80 0z"/>${label(358, 238, "Wall (später)", "lbl tiny")}
  <rect class="tower" x="430" y="100" width="56" height="120"/><rect class="tower-top" x="424" y="86" width="68" height="20"/><path class="roof" d="M420 88l38-30 38 30z"/><rect class="tower-window" x="450" y="120" width="16" height="16"/>${label(458, 238, "Wachturm", "lbl tiny")}
  <rect class="fort" x="560" y="160" width="200" height="60"/>${Array.from({ length: 10 }, (_, i) => `<rect class="fort" x="${560 + i * 20}" y="152" width="10" height="10"/>`).join("")}<rect class="gate" x="645" y="184" width="30" height="36" rx="15"/>${label(660, 238, "Kastell mit Soldaten", "lbl tiny")}
  ${person(520, 220, 1, "cloth-trader")}${arrow(500, 200, 470, 200, "arrow thin")}${labels(600, 120, "Händler durften an Toren\nmit Kontrolle passieren", "lbl tiny")}
  ${labels(50, 40, "← Gebiet freier Germanen", "lbl small", "start")}${labels(750, 40, "Römisches Reich →", "lbl small", "end")}
  ${labels(560, 270, "In Raetien (heute vor allem Bayern) ersetzte später eine Steinmauer die Palisade.", "lbl tiny")}`;
  return svg(
    800,
    280,
    "Aufbau des Limes in Obergermanien im Querschnitt, von den Germanen aus gesehen: Palisade aus Holz, dahinter später ein Graben und ein Wall, dann ein Wachturm und ein Kastell mit Tor, an dem Händler kontrolliert passieren durften",
    body,
  );
}

export function romanTraces(): string {
  const words: Array<[string, string]> = [
    ["murus", "Mauer"],
    ["fenestra", "Fenster"],
    ["cellarium", "Keller"],
    ["vinum", "Wein"],
    ["tegula", "Ziegel"],
    ["(via) strata", "Straße"],
  ];
  const body = `${panel(10, 10, 250, 140)}<path class="roman-road" d="M30 120L130 60L240 90"/><path class="road-stones" d="M30 120L130 60L240 90"/>${label(135, 36, "Römerstraße", "lbl strong")}${labels(135, 140, "z. B. Via Claudia Augusta über Augsburg", "lbl tiny")}
  ${panel(275, 10, 250, 140)}<path class="bath" d="M300 110h200v20H300z"/><path class="steam" d="M340 100q-8-12 0-24t0-24M400 100q-8-12 0-24t0-24M460 100q-8-12 0-24t0-24"/>${label(400, 36, "Thermen (Bäder)", "lbl strong")}${labels(400, 140, "z. B. Römische Thermen Weißenburg", "lbl tiny")}
  ${panel(540, 10, 250, 140)}<path class="gate-stone" d="M590 130V60h140v70h-40v-40q0-20-30-20t-30 20v40z"/>${label(665, 36, "Tor eines Lagers", "lbl strong")}${labels(665, 146, "z. B. Porta Praetoria in Regensburg", "lbl tiny")}
  ${panel(10, 165, 780, 165)}${label(400, 194, "Lateinische Wörter in unserer Sprache", "lbl strong")}
  ${words
    .map(([la, de], i) => {
      const x = 75 + (i % 3) * 250,
        y = 232 + Math.floor(i / 3) * 52;
      return `${label(x, y, la, "lbl latin", "start")}${arrow(x + 96, y - 5, x + 126, y - 5, "arrow thin")}${label(x + 134, y, de, "lbl small strong", "start")}`;
    })
    .join("")}`;
  return svg(
    800,
    340,
    "Römische Spuren heute: eine Römerstraße, Thermen, das Tor eines Lagers und lateinische Wörter, aus denen deutsche Wörter wurden, zum Beispiel murus zu Mauer und fenestra zu Fenster",
    body,
  );
}
