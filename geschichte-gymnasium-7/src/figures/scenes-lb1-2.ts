/**
 * Figures for LB 1 (König und Reich) and LB 2 (Leben und Kultur im Mittelalter).
 * Colours come from the shared palette so both themes stay readable.
 */
import {
  arrow,
  badgePill,
  cardGrid,
  chain,
  compare,
  crown,
  f1,
  label,
  labels,
  panel,
  person,
  svg,
} from "./draw";

export const C = {
  red: "#9e2a2b",
  green: "#1e6b4f",
  purple: "#73357a",
  ochre: "#a16c0e",
  blue: "#1b5e8a",
  slate: "#37536e",
  brown: "#9a4b1f",
  teal: "#1f6f78",
};

/* ---------- LB 1 ---------- */

export function herzogtuemer(): string {
  return cardGrid(
    "Die großen Herzogtümer im Ostfrankenreich um 919 und das Kerngebiet der Ottonen in Sachsen",
    [
      { head: "Sachsen", body: "Kernland der Ottonen:\nQuedlinburg, Magdeburg,\nMemleben", colour: C.red, icon: "👑" },
      { head: "Franken", body: "Land der fränkischen Großen;\nMainz, Würzburg,\nFrankfurt am Main", colour: C.ochre, icon: "🛡️" },
      { head: "Bayern", body: "Regensburg als Zentrum;\nbis zur Enns und\nnach Kärnten", colour: C.blue, icon: "🛡️" },
      { head: "Schwaben", body: "Bodensee, Oberrhein und\nAugsburg; Grenze zu\nBurgund und Italien", colour: C.green, icon: "🛡️" },
      { head: "Lothringen", body: "Aachen und Köln; zwischen\nOst- und Westfrankenreich\nlange umstritten", colour: C.purple, icon: "🛡️" },
      { head: "Ab 951: Italien", body: "Otto I. wird König der\nLangobarden; 962 Kaiser-\nkrönung in Rom", colour: C.slate, icon: "⛪" },
    ],
    3,
    660,
  );
}

export function herrschaftsRechtfertigung(): string {
  const pillars = [
    { t: "Gottes Wahl", s: "„von Gott\nerwählt“", c: C.purple },
    { t: "Designation", s: "vom Vater\nbestimmt", c: C.ochre },
    { t: "Wahl", s: "durch die\nFürsten", c: C.brown },
    { t: "Salbung", s: "Aachen\n936", c: C.blue },
    { t: "Sieg", s: "Lechfeld\n955", c: C.red },
    { t: "Kaiserkrone", s: "Rom\n962", c: C.green },
  ];
  return svg(
    660,
    280,
    "Sechs Begründungen für die Herrschaft Ottos I.: Gottes Wahl, Designation durch den Vater, Wahl durch die Fürsten, Salbung, Sieg auf dem Lechfeld und Kaiserkrönung 962",
    `${panel(8, 8, 644, 264, "panel-bg")}
     ${label(330, 34, "Warum Otto I. herrschen darf – sechs Begründungen", "lbl small strong")}
     <rect x="250" y="52" width="160" height="38" rx="10" fill="var(--accent)"/>
     ${crown(330, 76, 0.9)}
     ${label(330, 104, "OTTO I. (936–973)", "lbl tiny strong")}
     <rect x="40" y="112" width="580" height="10" rx="4" fill="var(--f-wood)"/>
     ${pillars
       .map((p, i) => {
         const x = 52 + i * 94;
         return `<rect x="${x}" y="126" width="78" height="96" rx="6" fill="var(--surface)" stroke="${p.c}" stroke-width="2.4"/>
           <rect x="${x}" y="126" width="78" height="26" rx="6" fill="${p.c}"/>
           ${label(x + 39, 144, p.t, "lbl tiny on-dark strong")}
           ${labels(x + 39, 176, p.s, "lbl tiny", "middle", 15)}`;
       })
       .join("")}
     <rect x="40" y="226" width="580" height="10" rx="4" fill="var(--f-wood)"/>
     ${label(330, 258, "Die Begründungen stützen sich gegenseitig – fällt eine weg, wackelt die Herrschaft.", "lbl tiny muted")}`,
  );
}

export function koenigtumAntikeMittelalter(): string {
  return compare(
    "Vergleich der Monarchie des Augustus mit dem Königtum Ottos I.",
    {
      head: "Augustus (um Christi Geburt)",
      colour: C.red,
      points: [
        "nennt sich „erster Bürger“ (Prinzipat)",
        "stehendes Heer und Berufssoldaten",
        "Beamte, Steuern, Hauptstadt Rom",
        "Nachfolge durch Adoption geregelt",
        "Staatskult; später göttliche Verehrung",
      ],
    },
    {
      head: "Otto I. (936–973)",
      colour: C.blue,
      points: [
        "König durch Wahl der Fürsten",
        "Heer aus Vasallen und Bischöfen",
        "keine Hauptstadt, Reisekönigtum",
        "Designation durch den Vater",
        "Salbung: König von Gottes Gnaden",
      ],
    },
    660,
  );
}

export function reichskircheKreislauf(): string {
  const nodes = [
    { x: 330, y: 70, t: "König", s: "setzt Bischof ein\n(Ring und Stab)", c: C.red },
    { x: 560, y: 160, t: "Bischof", s: "erhält Land, Zoll,\nMarkt und Münze", c: C.purple },
    { x: 330, y: 250, t: "Dienst", s: "Beherbergung des Hofes,\nKrieger fürs Heer", c: C.green },
    { x: 100, y: 160, t: "Tod", s: "kein Erbe (ehelos) –\nBistum fällt zurück", c: C.slate },
  ];
  return svg(
    660,
    310,
    "Kreislauf des Reichskirchensystems: Der König setzt Bischöfe ein, diese erhalten Rechte, dienen dem König und können ihr Amt nicht vererben",
    `${panel(8, 8, 644, 294, "panel-bg")}
     ${label(330, 30, "Das Reichskirchensystem als Kreislauf", "lbl small strong")}
     ${arrow(420, 80, 520, 128)}
     ${arrow(520, 200, 420, 244)}
     ${arrow(240, 244, 140, 200)}
     ${arrow(140, 128, 240, 80)}
     ${nodes
       .map(
         (n) => `<rect x="${n.x - 90}" y="${n.y - 34}" width="180" height="68" rx="12" fill="var(--surface)" stroke="${n.c}" stroke-width="2.4"/>
         <rect x="${n.x - 90}" y="${n.y - 34}" width="180" height="24" rx="12" fill="${n.c}"/>
         ${label(n.x, n.y - 17, n.t, "lbl tiny on-dark strong")}
         ${labels(n.x, n.y + 6, n.s, "lbl tiny", "middle", 14)}`,
       )
       .join("")}
     ${badgePill(330, 165, 230, "Investiturstreit ab 1075")}
     ${label(330, 190, "Der Papst will den ersten Schritt", "lbl tiny muted")}
     ${label(330, 204, "für die Kirche beanspruchen.", "lbl tiny muted")}`,
  );
}

export function territorialisierungWeg(): string {
  return chain(
    "Vom Lehen zum Territorium: Schritte der Territorialisierung im Reich",
    [
      { head: "Lehen", body: "Fürsten erhalten Land\nund Ämter vom König", colour: C.ochre, icon: "📜" },
      { head: "Erblichkeit", body: "Lehen bleiben in\nder Familie", colour: C.brown, icon: "👪" },
      { head: "Rechte sammeln", body: "Gericht, Zoll, Burgen,\nStädte, Münze", colour: C.purple, icon: "🏰" },
      { head: "Landesherr", body: "Fürst regiert sein\nTerritorium selbst", colour: C.green, icon: "🗺️" },
    ],
    4,
    660,
  );
}

/* ---------- LB 2 ---------- */

export function staendeBild(): string {
  const rows = [
    { y: 40, t: "Die Betenden", s: "Geistliche: Bischöfe, Mönche, Nonnen, Priester", c: C.purple, cls: "cloth-scribe" },
    { y: 118, t: "Die Kämpfenden", s: "Adel: König, Herzöge, Grafen, Ritter", c: C.red, cls: "cloth-a" },
    { y: 196, t: "Die Arbeitenden", s: "Bauern: rund neun von zehn Menschen", c: C.green, cls: "cloth-linen" },
  ];
  return svg(
    660,
    286,
    "Die mittelalterliche Ständeordnung: Betende, Kämpfende und Arbeitende",
    `${panel(8, 8, 644, 270, "panel-bg")}
     ${label(330, 28, "Die Lehre von den drei Ständen (um 1000)", "lbl small strong")}
     ${rows
       .map(
         (r, i) => `<rect x="${40 + i * 24}" y="${r.y}" width="${580 - i * 48}" height="66" rx="12" fill="var(--surface)" stroke="${r.c}" stroke-width="2.4"/>
         <rect x="${40 + i * 24}" y="${r.y}" width="12" height="66" rx="6" fill="${r.c}"/>
         ${person(110 + i * 24, r.y + 60, 0.95, r.cls, i === 1 ? "up" : "out")}
         ${label(150 + i * 24, r.y + 28, r.t, "lbl small strong", "start")}
         ${label(150 + i * 24, r.y + 50, r.s, "lbl tiny", "start")}`,
       )
       .join("")}
     ${label(330, 274, "Gedacht als gottgewollte Ordnung: Jeder Stand dient den anderen – Aufstieg war kaum möglich.", "lbl tiny muted")}`,
  );
}

export function grundherrschaftSchema(): string {
  return svg(
    660,
    250,
    "Schaubild Grundherrschaft: Der Grundherr gibt Land, Schutz und Gericht, die Bauern leisten Abgaben und Frondienste",
    `${panel(8, 8, 644, 234, "panel-bg")}
     <rect x="200" y="22" width="260" height="58" rx="12" fill="${C.red}"/>
     ${label(330, 46, "Grundherr", "lbl small on-dark strong")}
     ${label(330, 66, "König, Adliger, Bischof oder Kloster", "lbl tiny on-dark")}
     <rect x="200" y="166" width="260" height="58" rx="12" fill="${C.green}"/>
     ${label(330, 190, "Abhängige Bauern", "lbl small on-dark strong")}
     ${label(330, 210, "hörig oder zinspflichtig, an den Hof gebunden", "lbl tiny on-dark")}
     ${arrow(250, 84, 250, 160)}
     ${arrow(410, 160, 410, 84)}
     ${labels(236, 112, "Land (Hof)\nSchutz\nGericht", "lbl tiny strong", "end", 15)}
     ${labels(424, 104, "Abgaben: Getreide,\nVieh, Eier, Wachs\nFrondienste auf\ndem Herrenland", "lbl tiny strong", "start", 15)}
     ${labels(32, 46, "Herrenland\n(Salland)", "lbl tiny muted", "start", 14)}
     ${labels(32, 196, "Bauernhöfe\n(Hufen)", "lbl tiny muted", "start", 14)}`,
  );
}

export function dreifelderSchema(): string {
  const crops = [
    { n: "Wintergetreide", c: "#c9a227" },
    { n: "Sommergetreide", c: "#7fa64a" },
    { n: "Brache (Vieh)", c: "#a5876a" },
  ];
  const cell = (col: number, row: number) => crops[(col + row) % 3];
  let cells = "";
  for (let year = 0; year < 3; year++)
    for (let field = 0; field < 3; field++) {
      const x = 150 + field * 160;
      const y = 50 + year * 56;
      const c = cell(field, year);
      cells += `<rect x="${x}" y="${y}" width="150" height="46" rx="8" fill="${c.c}" opacity="0.85"/>${label(x + 75, y + 28, c.n, "lbl tiny strong")}`;
    }
  return svg(
    660,
    260,
    "Dreifelderwirtschaft: drei Felder wechseln jährlich zwischen Wintergetreide, Sommergetreide und Brache",
    `${panel(8, 8, 644, 244, "panel-bg")}
     ${label(150 + 75, 40, "Feld A", "lbl tiny strong")}
     ${label(310 + 75, 40, "Feld B", "lbl tiny strong")}
     ${label(470 + 75, 40, "Feld C", "lbl tiny strong")}
     ${["Jahr 1", "Jahr 2", "Jahr 3"].map((y, i) => label(70, 78 + i * 56, y, "lbl small strong")).join("")}
     ${cells}
     ${label(330, 232, "Zwei von drei Feldern tragen Getreide – bei der älteren Zweifelderwirtschaft nur eines von zwei.", "lbl tiny muted")}`,
  );
}

export function klosterPlan(): string {
  const room = (x: number, y: number, w: number, h: number, t: string, c: string) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="var(--surface)" stroke="${c}" stroke-width="2"/>${labels(x + w / 2, y + h / 2 - (t.includes("\n") ? 3 : -4), t, "lbl tiny strong", "middle", 13)}`;
  return svg(
    660,
    346,
    "Vereinfachter Klosterplan nach dem Vorbild des St. Galler Klosterplans mit Kirche, Kreuzgang, Schreibstube, Krankenhaus, Gärten und Werkstätten",
    `${panel(8, 8, 644, 330, "panel-bg")}
     ${label(330, 28, "Ein Kloster wie eine kleine Stadt (nach dem St. Galler Klosterplan, 9. Jh.)", "lbl small strong")}
     <rect x="170" y="44" width="320" height="70" rx="8" fill="${C.purple}" opacity="0.9"/>
     ${label(330, 76, "Klosterkirche", "lbl small on-dark strong")}
     ${label(330, 96, "mehrmals täglich Stundengebet", "lbl tiny on-dark")}
     <rect x="250" y="126" width="160" height="110" rx="6" fill="var(--f-grass)" opacity="0.35" stroke="${C.green}" stroke-width="2"/>
     ${labels(330, 176, "Kreuzgang\n(Innenhof)", "lbl tiny strong", "middle", 14)}
     ${room(170, 126, 72, 52, "Schreib-\nstube", C.blue)}
     ${room(170, 184, 72, 52, "Bibliothek", C.blue)}
     ${room(418, 126, 72, 52, "Schlaf-\nsaal", C.slate)}
     ${room(418, 184, 72, 52, "Speise-\nsaal", C.slate)}
     ${room(250, 244, 160, 40, "Küche und Keller", C.slate)}
     ${room(30, 44, 120, 60, "Schule", C.blue)}
     ${room(30, 112, 120, 60, "Gästehaus\n(Pilger)", C.ochre)}
     ${room(30, 180, 120, 60, "Krankenhaus", C.red)}
     ${room(30, 248, 120, 50, "Kräutergarten", C.green)}
     ${room(510, 44, 120, 60, "Mühle und\nBrauhaus", C.brown)}
     ${room(510, 112, 120, 60, "Werkstätten", C.brown)}
     ${room(510, 180, 120, 60, "Ställe", C.brown)}
     ${room(510, 248, 120, 50, "Obst- und\nGemüsegarten", C.green)}
     ${label(330, 324, "Violett: Gebet · Blau: Bildung · Rot und Ocker: Fürsorge · Braun und Grün: Arbeit und Wirtschaft", "lbl tiny muted")}`,
  );
}

export function ritterWeg(): string {
  return chain(
    "Der Weg eines adligen Jungen zum Ritter: Page, Knappe, Schwertleite, Ritter",
    [
      { head: "Page (ab ca. 7)", body: "Erziehung an einem\nfremden Hof: Benehmen,\nReiten, Dienst bei Tisch", colour: C.blue, icon: "🧒" },
      { head: "Knappe (ab ca. 14)", body: "begleitet einen Ritter,\nlernt Kampf mit Schwert\nund Lanze", colour: C.ochre, icon: "🛡️" },
      { head: "Schwertleite", body: "feierliche Aufnahme\nmit Umgürten des\nSchwertes", colour: C.purple, icon: "⚔️" },
      { head: "Ritter", body: "dient seinem Herrn,\nsoll höfische Tugenden\nleben", colour: C.red, icon: "🐎" },
    ],
    4,
    780,
  );
}

export function hoefischeTugenden(): string {
  return cardGrid(
    "Höfische Tugenden des Ritterideals um 1200 mit ihren mittelhochdeutschen Namen",
    [
      { head: "êre – Ehre", body: "Ansehen durch\nvorbildliches Handeln", colour: C.red },
      { head: "triuwe – Treue", body: "zum Herrn, zu Freunden\nund zur Dame", colour: C.purple },
      { head: "mâze – Maß", body: "sich beherrschen,\nnicht übertreiben", colour: C.blue },
      { head: "milte – Freigebigkeit", body: "großzügig schenken\nund Feste geben", colour: C.ochre },
      { head: "staete – Beständigkeit", body: "zuverlässig und\ntreu bleiben", colour: C.green },
      { head: "minne – Liebe", body: "Verehrung einer Dame,\nbesungen im Minnesang", colour: C.brown },
    ],
    3,
    660,
  );
}

function facade(x: number, gothic: boolean): string {
  const base = 250;
  if (!gothic) {
    return `<rect x="${x}" y="110" width="180" height="${base - 110}" fill="var(--f-stone)" stroke="var(--f-line)" stroke-width="2"/>
      <rect x="${x - 10}" y="70" width="44" height="${base - 70}" fill="var(--f-stone)" stroke="var(--f-line)" stroke-width="2"/>
      <rect x="${x + 146}" y="70" width="44" height="${base - 70}" fill="var(--f-stone)" stroke="var(--f-line)" stroke-width="2"/>
      <path d="M${x - 14} 70L${x + 12} 40L${x + 38} 70Z" fill="var(--f-wood)"/>
      <path d="M${x + 142} 70L${x + 168} 40L${x + 194} 70Z" fill="var(--f-wood)"/>
      <path d="M${x + 60} ${base}V200A30 30 0 0 1 ${x + 120} 200V${base}Z" fill="#3a3026"/>
      <path d="M${x + 76} 150V134A14 14 0 0 1 ${x + 104} 134V150Z" fill="#3a3026"/>
      <path d="M${x + 2} 160V148A10 10 0 0 1 ${x + 22} 148V160Z" fill="#3a3026"/>
      <path d="M${x + 158} 160V148A10 10 0 0 1 ${x + 178} 148V160Z" fill="#3a3026"/>`;
  }
  return `<path d="M${x} ${base}V120L${x + 90} 70L${x + 180} 120V${base}Z" fill="var(--f-stone)" stroke="var(--f-line)" stroke-width="2"/>
    <path d="M${x - 8} 50L${x + 12} 4L${x + 32} 50Z" fill="var(--f-stone)" stroke="var(--f-line)"/>
    <rect x="${x - 6}" y="50" width="36" height="${base - 50}" fill="var(--f-stone)" stroke="var(--f-line)" stroke-width="2"/>
    <path d="M${x + 148} 50L${x + 168} 4L${x + 188} 50Z" fill="var(--f-stone)" stroke="var(--f-line)"/>
    <rect x="${x + 150}" y="50" width="36" height="${base - 50}" fill="var(--f-stone)" stroke="var(--f-line)" stroke-width="2"/>
    <path d="M${x + 60} ${base}V196L${x + 90} 160L${x + 120} 196V${base}Z" fill="#3a3026"/>
    <circle cx="${x + 90}" cy="124" r="20" fill="#2f7fd0" stroke="#f2cf3d" stroke-width="3"/>
    <path d="M${x + 2} 180V110L${x + 12} 92L${x + 22} 110V180Z" fill="#2f7fd0"/>
    <path d="M${x + 158} 180V110L${x + 168} 92L${x + 178} 110V180Z" fill="#2f7fd0"/>
    <path d="M${x + 186} 220L${x + 214} 160" stroke="var(--f-line)" stroke-width="4"/>
    <path d="M${x - 6} 220L${x - 34} 160" stroke="var(--f-line)" stroke-width="4"/>`;
}

export function romanikGotikVergleich(): string {
  return svg(
    660,
    300,
    "Vergleich einer romanischen und einer gotischen Kirchenfassade: Rundbögen und kleine Fenster gegenüber Spitzbögen, großen Glasfenstern und Strebewerk",
    `${panel(8, 8, 644, 284, "panel-bg")}
     ${badgePill(170, 26, 220, "Romanik (ca. 1000–1250)", C.brown)}
     ${badgePill(490, 26, 240, "Gotik (ab Mitte 12. Jh.)", C.blue)}
     <g transform="translate(0,6)">${facade(80, false)}${facade(400, true)}</g>
     <line x1="20" y1="257" x2="640" y2="257" stroke="var(--f-line)" stroke-width="2"/>
     ${label(170, 276, "Rundbogen · dicke Mauern · kleine Fenster", "lbl tiny strong")}
     ${label(490, 276, "Spitzbogen · Strebewerk · große Glasfenster", "lbl tiny strong")}`,
  );
}

export function stadtGesellschaft(): string {
  const layers = [
    { t: "Patrizier", s: "reiche Fernhändler, lange im Rat", c: C.red, w: 220 },
    { t: "Zunfthandwerker", s: "Meister mit Bürgerrecht", c: C.ochre, w: 380 },
    { t: "Gesellen, Mägde, Knechte", s: "meist ohne Bürgerrecht", c: C.slate, w: 500 },
    { t: "Arme, Bettler, Tagelöhner", s: "auf Almosen und Spitäler angewiesen", c: C.brown, w: 600 },
  ];
  return svg(
    660,
    280,
    "Gesellschaft der mittelalterlichen Stadt: Patrizier, Zunfthandwerker, Gesellen und Gesinde sowie Arme",
    `${panel(8, 8, 644, 264, "panel-bg")}
     ${label(330, 30, "Wer gehörte zur Stadtgesellschaft?", "lbl small strong")}
     ${layers
       .map(
         (l, i) => `<rect x="${330 - l.w / 2}" y="${44 + i * 54}" width="${l.w}" height="46" rx="10" fill="${l.c}"/>
         ${label(330, 64 + i * 54, l.t, "lbl small on-dark strong")}
         ${label(330, 82 + i * 54, l.s, "lbl tiny on-dark")}`,
       )
       .join("")}
`,
  );
}

export function juedischesLebenWeg(): string {
  const events = [
    { y: "321", t: "Juden in Köln erwähnt", c: C.green },
    { y: "um 1000", t: "Blüte der SchUM-Gemeinden", c: C.green },
    { y: "1096", t: "Kreuzzugspogrome am Rhein", c: C.red },
    { y: "1215", t: "Kennzeichnungspflicht", c: C.ochre },
    { y: "1349", t: "Pestpogrome", c: C.red },
    { y: "1462", t: "Frankfurter Judengasse", c: C.ochre },
    { y: "1519", t: "Vertreibung aus Regensburg", c: C.red },
  ];
  const step = 500 / (events.length - 1);
  return svg(
    660,
    220,
    "Zeitleiste jüdischen Lebens im Reich zwischen Schutz, Blüte, Ausgrenzung und Verfolgung von 321 bis 1519",
    `${panel(8, 8, 644, 204, "panel-bg")}
     ${label(330, 30, "Zwischen Blüte, Schutz und Verfolgung", "lbl small strong")}
     <line x1="30" y1="110" x2="630" y2="110" stroke="var(--f-line)" stroke-width="3"/>
     ${events
       .map((e, i) => {
         const x = 80 + i * step;
         const up = i % 2 === 0;
         return `<circle cx="${f1(x)}" cy="110" r="9" fill="${e.c}" stroke="var(--f-halo)" stroke-width="2"/>
           ${label(x, up ? 88 : 140, e.y, "lbl tiny strong")}
           ${labels(x, up ? 58 : 160, e.t.replace(" ", "\n"), "lbl tiny", "middle", 13)}`;
       })
       .join("")}
     <circle cx="200" cy="198" r="6" fill="${C.green}"/>${label(212, 202, "Blüte", "lbl tiny", "start")}
     <circle cx="290" cy="198" r="6" fill="${C.ochre}"/>${label(302, 202, "Ausgrenzung", "lbl tiny", "start")}
     <circle cx="410" cy="198" r="6" fill="${C.red}"/>${label(422, 202, "Gewalt", "lbl tiny", "start")}`,
  );
}

export function pestDeutungen(): string {
  return cardGrid(
    "Wie Menschen im 14. Jahrhundert die Pest deuteten und wie die Seuche heute erklärt wird",
    [
      { head: "Strafe Gottes", body: "→ Gebete, Prozessionen,\nBuße, Geißlerzüge", colour: C.purple, icon: "⛪" },
      { head: "Verdorbene Luft", body: "→ Kräuter verbrennen,\nFlucht aufs Land", colour: C.slate, icon: "💨" },
      { head: "Sterne und Planeten", body: "→ Gutachten gelehrter\nÄrzte", colour: C.blue, icon: "✨" },
      { head: "Sündenböcke", body: "→ Lüge von der Brunnen-\nvergiftung, Pogrome", colour: C.red, icon: "⚠️" },
      { head: "Ansteckung", body: "→ Absonderung von\nAnkommenden (Quarantäne)", colour: C.green, icon: "⚓" },
      { head: "Heute bekannt", body: "Bakterium, übertragen\nvor allem durch Flöhe", colour: C.ochre, icon: "🔬" },
    ],
    3,
    660,
  );
}
