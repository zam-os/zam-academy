/**
 * Drawings of stations 4 to 9 (NT6 1.3 to 1.5): movement, food, body
 * temperature, breathing, reproduction, senses, vertebrate classes,
 * evolution and breeding, keeping animals, and the pond ecosystem.
 */
import { arrow, cardGrid, chain, compare, f1, label, labels, panel, svg } from "./draw";

const C = {
  blue: "var(--f-blue)",
  green: "var(--f-green)",
  orange: "var(--f-orange)",
  red: "var(--f-red)",
  purple: "var(--f-purple)",
  pink: "var(--f-pink)",
  stone: "#59636e",
  earth: "var(--f-earth)",
};

const pointer = (x: number, y: number, lx: number, ly: number, text: string, anchor: "start" | "end" = "start") =>
  `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(lx)}" y2="${f1(ly)}" stroke="var(--f-ink)" opacity="0.55"/>${label(anchor === "start" ? lx + 6 : lx - 6, ly + 4, text, "lbl tiny", anchor)}`;

/* ---------- Bewegung ---------- */

export const fischBau = (): string =>
  svg(
    700,
    270,
    "Bau eines Knochenfisches mit Spindelform, Schuppen, Flossen, Kiemendeckel, Seitenlinie und Schwimmblase",
    `${panel(8, 8, 684, 254, "panel-bg")}
     <path d="M110 140 Q200 70 330 96 Q380 108 400 140 Q380 172 330 184 Q200 210 110 140 Z" fill="#90a4ae" stroke="var(--f-ink)" stroke-width="2"/>
     <path d="M400 140 L460 96 L448 140 L460 184 Z" fill="#78909c" stroke="var(--f-ink)"/>
     <path d="M230 86 Q260 50 300 92 Z" fill="#78909c" stroke="var(--f-ink)"/>
     <path d="M300 184 Q320 210 340 182 Z" fill="#78909c" stroke="var(--f-ink)"/>
     <path d="M168 160 Q160 190 190 178 Z" fill="#78909c" stroke="var(--f-ink)"/>
     <path d="M240 186 Q240 214 262 192 Z" fill="#78909c" stroke="var(--f-ink)"/>
     <path d="M166 104 Q182 140 166 176" fill="none" stroke="var(--f-ink)" stroke-width="2"/>
     <circle cx="134" cy="128" r="7" fill="var(--f-white)" stroke="var(--f-ink)"/><circle cx="134" cy="128" r="3" fill="var(--f-ink)"/>
     <path d="M170 132 Q260 120 390 138" fill="none" stroke="var(--f-ink)" stroke-dasharray="3 3"/>
     <ellipse cx="270" cy="150" rx="56" ry="12" fill="var(--f-white)" opacity="0.8" stroke="var(--f-blue)"/>
     ${pointer(450, 100, 500, 60, "Schwanzflosse: Antrieb")}
     ${pointer(268, 70, 300, 30, "Rückenflosse: gegen Kippen")}
     ${pointer(176, 182, 30, 236, "Brustflosse: Steuern, Bremsen")}
     ${pointer(250, 200, 250, 222, "Bauchflosse")}
     ${pointer(326, 196, 420, 236, "Afterflosse")}
     ${pointer(166, 110, 110, 54, "Kiemendeckel")}
     ${pointer(360, 134, 500, 120, "Seitenlinie: spürt Strömung")}
     ${pointer(310, 152, 500, 160, "Schwimmblase: Schweben")}
     ${labels(520, 206, "Spindelform und Schleim\nauf den Schuppen senken\nden Wasserwiderstand.", "lbl tiny strong", "start", 14)}`,
  );

export const vogelLeichtbau = (): string =>
  svg(
    600,
    270,
    "Leichtbau des Vogels: hohler Röhrenknochen mit Verstrebungen, Brustbein mit Kamm für die Flugmuskeln und Aufbau einer Schwungfeder",
    `${panel(8, 8, 190, 254, "panel-bg")}
     ${label(103, 30, "Röhrenknochen", "lbl small strong", "middle")}
     <rect x="60" y="60" width="86" height="160" rx="30" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="5"/>
     ${[0, 1, 2, 3, 4].map((i) => `<line x1="66" y1="${80 + i * 30}" x2="140" y2="${100 + i * 30}" stroke="var(--f-line)" stroke-width="2"/>`).join("")}
     ${labels(103, 238, "hohl, luftgefüllt,\nmit Verstrebungen", "lbl tiny", "middle", 13)}
     ${panel(206, 8, 190, 254, "panel-bg")}
     ${label(301, 30, "Brustbein mit Kamm", "lbl small strong", "middle")}
     <path d="M240 80 Q301 70 362 80 L340 110 Q301 120 262 110 Z" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/>
     <path d="M301 112 L301 200 L280 116 Z M301 112 L301 200 L322 116 Z" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/>
     <path d="M262 112 Q240 160 290 196" fill="var(--f-red)" opacity="0.35"/>
     <path d="M340 112 Q362 160 312 196" fill="var(--f-red)" opacity="0.35"/>
     ${labels(301, 226, "großer Ansatz für die\nkräftigen Flugmuskeln", "lbl tiny", "middle", 13)}
     ${panel(404, 8, 188, 254, "panel-bg")}
     ${label(498, 30, "Schwungfeder", "lbl small strong", "middle")}
     <line x1="498" y1="230" x2="498" y2="50" stroke="var(--f-ink)" stroke-width="3"/>
     <path d="M498 60 Q450 120 470 200 L498 200 Z" fill="#cfd8dc" stroke="var(--f-line)"/>
     <path d="M498 60 Q560 120 540 200 L498 200 Z" fill="#b0bec5" stroke="var(--f-line)"/>
     ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="498" y1="${80 + i * 20}" x2="${470 + (i % 2) * 2}" y2="${92 + i * 20}" stroke="var(--f-line)"/><line x1="498" y1="${80 + i * 20}" x2="${538 - (i % 2) * 2}" y2="${92 + i * 20}" stroke="var(--f-line)"/>`).join("")}
     ${labels(414, 236, "Schaft · Fahne aus Ästen,\ndie mit Häkchen verhaken", "lbl tiny", "start", 13)}`,
  );

export const flugarten = (): string =>
  cardGrid(
    "Flugarten der Vögel: Ruderflug, Gleitflug, Segelflug und Rüttelflug",
    [
      { head: "Ruderflug", body: "Flügelschläge treiben\nan; kostet viel Energie.\nZ. B. Taube, Amsel", colour: C.blue, icon: "🕊" },
      { head: "Gleitflug", body: "Ohne Flügelschlag;\nder Vogel verliert\nlangsam an Höhe.", colour: C.green, icon: "↘" },
      { head: "Segelflug", body: "Aufwind trägt nach oben;\nspart Energie. Z. B.\nMäusebussard, Storch", colour: C.orange, icon: "🌀" },
      { head: "Rüttelflug", body: "Auf der Stelle in der Luft\nstehen und Beute suchen.\nZ. B. Turmfalke", colour: C.red, icon: "🎯" },
    ],
    2,
  );

export const fusshaltung = (): string => {
  const leg = (x: number, title: string, kind: "sohle" | "zehe" | "spitze", animals: string) => {
    const shape =
      kind === "sohle"
        ? `<path d="M${x + 60} 60 L${x + 60} 150 L${x + 50} 196 L${x + 120} 196 L${x + 120} 186 L${x + 72} 180 L${x + 76} 150 L${x + 76} 60 Z" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/>`
        : kind === "zehe"
          ? `<path d="M${x + 60} 60 L${x + 62} 120 L${x + 90} 160 L${x + 100} 196 L${x + 130} 196 L${x + 112} 186 L${x + 100} 150 L${x + 76} 116 L${x + 76} 60 Z" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/>`
          : `<path d="M${x + 60} 60 L${x + 62} 100 L${x + 92} 130 L${x + 96} 186 L${x + 110} 196 L${x + 112} 186 L${x + 108} 128 L${x + 76} 96 L${x + 76} 60 Z" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/><rect x="${x + 92}" y="184" width="22" height="12" rx="3" fill="#5d4037"/>`;
    return `${panel(x, 8, 188, 254, "panel-bg")}${label(x + 94, 30, title, "lbl small strong", "middle")}<line x1="${x + 10}" y1="198" x2="${x + 178}" y2="198" stroke="var(--f-earth)" stroke-width="3"/>${shape}${labels(x + 94, 222, animals, "lbl tiny", "middle", 14)}`;
  };
  return svg(
    600,
    270,
    "Drei Fußhaltungen der Säugetiere: Sohlengänger setzen die ganze Sohle auf, Zehengänger nur die Zehen, Zehenspitzengänger nur die Zehenspitzen mit Hufen",
    `${leg(8, "Sohlengänger", "sohle", "ganze Sohle am Boden:\nstandfest · Bär, Igel, Mensch")}${leg(206, "Zehengänger", "zehe", "nur die Zehen:\nschnell, leise · Hund, Katze")}${leg(404, "Zehenspitzengänger", "spitze", "nur die Spitzen mit Huf:\nausdauernd · Pferd, Reh")}`,
  );
};

export const fortbewegungLebensraum = (): string =>
  cardGrid(
    "Angepasstheit der Fortbewegung an verschiedene Lebensräume am Beispiel einzelner Wirbeltiere",
    [
      { head: "Graben: Maulwurf", body: "Schaufelhände, walzen-\nförmiger Körper, Fell\nohne Strich", colour: C.earth, icon: "⛏" },
      { head: "Klettern: Eichhörnchen", body: "spitze Krallen,\nbuschiger Schwanz\nzum Balancieren", colour: C.orange, icon: "🌳" },
      { head: "Springen: Grasfrosch", body: "lange Hinterbeine,\nSchwimmhäute\nan den Füßen", colour: C.green, icon: "🐸" },
      { head: "Tauchen: Pinguin", body: "Flügel als Flossen,\nSpindelform, schwere\nKnochen", colour: C.blue, icon: "🐧" },
      { head: "Fliegen: Fledermaus", body: "Flughaut zwischen\nlangen Fingerknochen\nund Beinen", colour: C.purple, icon: "🦇" },
      { head: "Laufen: Pferd", body: "lange Beine,\nZehenspitzen mit Huf,\nweite Steppe", colour: C.stone, icon: "🐎" },
    ],
    3,
  );

export const bionikTiere = (): string =>
  cardGrid(
    "Bionik: Fortbewegungsstrukturen von Wirbeltieren als Vorbild für Technik, die Menschen beweglicher macht",
    [
      { head: "Pinguin → Schiff", body: "Strömungsgünstige\nSpindelform für Rümpfe\nund Unterwasserfahrzeuge", colour: C.blue, icon: "🚢" },
      { head: "Vogelflügel → Flugzeug", body: "Gewölbte Tragflächen;\nhochgebogene Flügelenden\nsparen Treibstoff", colour: C.orange, icon: "✈" },
      { head: "Gepard → Laufprothese", body: "Federnde Sportprothese\nin Form eines Hinterlaufs\nspeichert Energie", colour: C.red, icon: "🦿" },
      { head: "Haihaut → Folien", body: "Feine Rillen senken\nden Strömungswiderstand\nan Flugzeugen und Schiffen", colour: C.stone, icon: "🦈" },
    ],
    2,
  );

/* ---------- Stoffwechsel ---------- */

export const gebisse = (): string => {
  const jaw = (x: number, title: string, teeth: string, points: string) =>
    `${panel(x, 8, 288, 254, "panel-bg")}${label(x + 144, 30, title, "lbl small strong", "middle")}
     <path d="M${x + 30} 120 Q${x + 144} 40 ${x + 258} 120" fill="none" stroke="var(--f-line)" stroke-width="10" stroke-linecap="round"/>
     ${teeth}${labels(x + 16, 168, points, "lbl tiny", "start", 15)}`;
  const dog = `${[0, 1, 2].map((i) => `<rect x="${42 + i * 8}" y="${108 - i * 4}" width="6" height="10" fill="var(--f-white)" stroke="var(--f-ink)"/>`).join("")}
     <path d="M70 92 L78 92 L74 126 Z" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="1.5"/>
     ${[0, 1, 2].map((i) => `<path d="M${96 + i * 20} ${78 - i * 3} l8 14 l8 -14 Z" fill="var(--f-white)" stroke="var(--f-ink)"/>`).join("")}
     <path d="M160 70 l10 22 l10 -22 l10 22 l8 -22 Z" fill="var(--f-white)" stroke="var(--f-red)" stroke-width="2"/>
     ${label(74, 140, "Fangzahn", "lbl tiny strong", "middle")}${label(180, 108, "Reißzahn", "lbl tiny strong", "middle")}`;
  const cow = `<rect x="338" y="108" width="40" height="8" rx="3" fill="#bcaaa4" stroke="var(--f-ink)"/>
     ${label(358, 136, "Hornplatte", "lbl tiny strong", "middle")}
     ${label(420, 98, "Lücke", "lbl tiny", "middle")}
     ${[0, 1, 2, 3, 4].map((i) => `<rect x="${458 + i * 18}" y="${70 + Math.abs(i - 2) * 3}" width="16" height="16" fill="var(--f-white)" stroke="var(--f-ink)"/><path d="M${461 + i * 18} ${74 + Math.abs(i - 2) * 3} q5 8 10 0" fill="none" stroke="var(--f-line)"/>`).join("")}
     ${label(500, 108, "Mahlzähne", "lbl tiny strong", "middle")}`;
  return svg(
    600,
    270,
    "Oberkiefer eines Hundes mit Fangzähnen und Reißzähnen im Vergleich mit dem Oberkiefer eines Rindes mit Hornplatte, Lücke und breiten Mahlzähnen",
    `${jaw(8, "Hund: Fleischfresser", dog, "• Fangzähne halten Beute\n• Reißzähne schneiden wie eine Schere\n• Kiefer klappt nur auf und zu\n• kurzer Darm: Fleisch ist leicht verdaulich")}${jaw(304, "Rind: Pflanzenfresser", cow, "• Gras wird mit Zunge und unteren\n  Schneidezähnen gegen die Hornplatte\n  abgerupft und zermahlen\n• Wiederkäuen, mehrere Mägen, langer Darm")}`,
  );
};

export const schnaebel = (): string => {
  type Beak = (x: number, y: number) => string;
  const hook: Beak = (x, y) => `M${x + 60} ${y + 44} Q${x + 88} ${y + 46} ${x + 80} ${y + 68} Q${x + 76} ${y + 58} ${x + 60} ${y + 58} Z`;
  const chisel: Beak = (x, y) => `M${x + 60} ${y + 46} L${x + 106} ${y + 52} L${x + 60} ${y + 58} Z`;
  const sieve: Beak = (x, y) => `M${x + 58} ${y + 46} Q${x + 108} ${y + 42} ${x + 104} ${y + 56} Q${x + 82} ${y + 62} ${x + 58} ${y + 58} Z`;
  const cone: Beak = (x, y) => `M${x + 60} ${y + 40} L${x + 84} ${y + 52} L${x + 60} ${y + 64} Z`;
  const spear: Beak = (x, y) => `M${x + 60} ${y + 48} L${x + 140} ${y + 52} L${x + 60} ${y + 56} Z`;
  const general: Beak = (x, y) => `M${x + 60} ${y + 46} L${x + 90} ${y + 52} L${x + 60} ${y + 58} Z`;
  const bird = (x: number, y: number, title: string, beak: Beak, text: string) =>
    `${panel(x, y, 188, 124, "panel-bg")}<circle cx="${x + 40}" cy="${y + 52}" r="22" fill="#a1887f" stroke="var(--f-ink)"/><circle cx="${x + 48}" cy="${y + 46}" r="3" fill="var(--f-ink)"/><path d="${beak(x, y)}" fill="var(--f-orange)" stroke="var(--f-ink)"/>${label(x + 178, y + 20, title, "lbl small strong", "end")}${labels(x + 12, y + 92, text, "lbl tiny", "start", 13)}`;
  return svg(
    600,
    270,
    "Schnabelformen der Vögel und ihre Nahrung: Hakenschnabel, Meißelschnabel, Seihschnabel, Körnerschnabel, Speerschnabel und Allzweckschnabel",
    [
      bird(8, 8, "Mäusebussard", hook, "Hakenschnabel:\nreißt Fleisch von der Beute"),
      bird(206, 8, "Buntspecht", chisel, "Meißelschnabel:\nhackt Insekten aus dem Holz"),
      bird(404, 8, "Stockente", sieve, "Seihschnabel:\nfiltert Nahrung aus dem Wasser"),
      bird(8, 140, "Buchfink", cone, "Körnerschnabel:\nknackt Samen"),
      bird(206, 140, "Graureiher", spear, "Speerschnabel:\npackt Fische und Frösche"),
      bird(404, 140, "Amsel", general, "Allzweckschnabel:\nWürmer, Beeren, Insekten"),
    ].join(""),
  );
};

export const isolation = (): string =>
  cardGrid(
    "Schutz vor Wärmeverlust bei gleichwarmen Tieren: Fell, Federn, Fettschicht und kleine Körperanhänge",
    [
      { head: "Fell", body: "Dichte Unterwolle hält\nLuft fest; im Winter\nwächst ein Winterfell.", colour: C.earth, icon: "🦊" },
      { head: "Federn", body: "Daunen halten Luft;\nbei Kälte plustern sich\nVögel auf.", colour: C.blue, icon: "🐦" },
      { head: "Fettschicht", body: "Robben und Wale haben\nunter der Haut eine\ndicke Speckschicht.", colour: C.stone, icon: "🦭" },
      { head: "Kleine Ohren", body: "Der Polarfuchs verliert\nüber kleine Ohren wenig\nWärme, der Wüstenfuchs\ngibt über große viel ab.", colour: C.orange, icon: "👂" },
    ],
    2,
  );

export const ueberwinterung = (): string =>
  cardGrid(
    "Wie Wirbeltiere den Winter überstehen: Kältestarre, Winterschlaf, Winterruhe, Vogelzug, Vorräte und Winterfell",
    [
      { head: "Kältestarre", body: "Wechselwarme: Körper\nso kalt wie das Versteck.\nGrasfrosch, Eidechse", colour: C.blue, icon: "❄" },
      { head: "Winterschlaf", body: "Temperatur stark gesenkt,\nlebt vom Fett, wacht\nselten auf. Igel, Murmeltier", colour: C.purple, icon: "💤" },
      { head: "Winterruhe", body: "Temperatur kaum gesenkt,\nwacht oft auf und frisst.\nEichhörnchen, Dachs", colour: C.earth, icon: "🐿" },
      { head: "Vogelzug", body: "Insektenfresser fliegen\nnach Süden. Weißstorch,\nSchwalbe, Mauersegler", colour: C.orange, icon: "🕊" },
      { head: "Vorräte", body: "Eichhörnchen und\nEichelhäher verstecken\nNüsse und Eicheln.", colour: C.green, icon: "🌰" },
      { head: "Aktiv bleiben", body: "Reh, Fuchs, Meise:\nWinterfell oder Gefieder,\nsparsam bewegen.", colour: C.stone, icon: "🦌" },
    ],
    3,
  );

export const atmungsorgane = (): string =>
  cardGrid(
    "Atmungsorgane der Wirbeltierklassen im Vergleich mit dem Medium, aus dem sie Sauerstoff aufnehmen",
    [
      { head: "Fische: Kiemen", body: "Viele dünne Kiemenblättchen\nnehmen Sauerstoff aus\ndem Wasser auf.", colour: C.blue, icon: "🐟" },
      { head: "Amphibien", body: "Larven: Kiemen.\nErwachsen: einfache Lunge\nund feuchte Haut.", colour: C.green, icon: "🐸" },
      { head: "Reptilien: Lunge", body: "Lunge mit Kammern\nund Falten; trockene\nHaut atmet nicht.", colour: C.earth, icon: "🦎" },
      { head: "Vögel: Lunge + Luftsäcke", body: "Frische Luft strömt auch\nbeim Ausatmen durch die\nLunge: Flug braucht viel.", colour: C.orange, icon: "🐦" },
      { head: "Säugetiere: Lunge", body: "Sehr viele Lungenbläschen\nergeben eine riesige\ninnere Oberfläche.", colour: C.red, icon: "🐭" },
      { head: "Je-desto", body: "Je höher der Sauerstoff-\nbedarf, desto größer die\nOberfläche der Atmungsorgane.", colour: C.stone },
    ],
    3,
  );

/* ---------- Fortpflanzung ---------- */

export const wasserLandReihe = (): string =>
  chain(
    "Fortpflanzung von Wasser zu Land: von äußerer Befruchtung und Laich ohne Schale bis zu innerer Befruchtung, beschalten Eiern und Entwicklung im Mutterleib",
    [
      { head: "Fische", body: "äußere Befruchtung,\nLaich ohne Schale\nim Wasser", colour: C.blue, icon: "🐟" },
      { head: "Amphibien", body: "meist äußere Befruch-\ntung, Laich im Wasser,\nLarven mit Kiemen", colour: C.green, icon: "🐸" },
      { head: "Reptilien", body: "innere Befruchtung,\nEier mit ledriger Schale\nan Land", colour: C.earth, icon: "🦎" },
      { head: "Vögel", body: "innere Befruchtung,\nEier mit Kalkschale,\nBrüten", colour: C.orange, icon: "🥚" },
      { head: "Säugetiere", body: "innere Befruchtung,\nJunge wachsen im\nMutterleib, Säugen", colour: C.red, icon: "🍼" },
    ],
    3,
    680,
  );

export const kaulquappeFrosch = (): string =>
  compare(
    "Kaulquappe und erwachsener Grasfrosch im Vergleich",
    {
      head: "Kaulquappe (Larve)",
      colour: C.blue,
      points: ["lebt nur im Wasser", "atmet mit Kiemen", "schwimmt mit Ruderschwanz", "frisst Algen und Pflanzenreste", "langer, gewundener Darm"],
    },
    {
      head: "Grasfrosch (erwachsen)",
      colour: C.green,
      points: ["lebt meist an Land", "atmet mit Lunge und Haut", "springt mit langen Hinterbeinen", "frisst Insekten, Würmer, Schnecken", "kurzer Darm"],
    },
  );

export const vogelei = (): string =>
  svg(
    600,
    260,
    "Bau eines Hühnereis mit Kalkschale und Poren, Schalenhäuten, Luftkammer, Eiklar, Dotter, Keimscheibe und Hagelschnüren",
    `${panel(8, 8, 584, 244, "panel-bg")}
     <ellipse cx="200" cy="130" rx="150" ry="104" fill="#fff8e1" stroke="#bcaaa4" stroke-width="6"/>
     <path d="M60 96 Q50 130 60 164 Q86 130 60 96 Z" fill="var(--f-sky)" stroke="var(--f-line)"/>
     <circle cx="200" cy="130" r="44" fill="var(--f-yellow)" stroke="var(--f-orange)" stroke-width="2"/>
     <circle cx="200" cy="92" r="7" fill="var(--f-white)" stroke="var(--f-red)" stroke-width="2"/>
     <path d="M156 130 Q130 120 96 132 M244 130 Q270 140 310 128" fill="none" stroke="var(--f-white)" stroke-width="5"/>
     <path d="M156 130 Q130 120 96 132 M244 130 Q270 140 310 128" fill="none" stroke="var(--f-line)" stroke-width="1" stroke-dasharray="3 3"/>
     ${[[350, 120, "Kalkschale mit Poren für Luft", 40], [340, 160, "Schalenhäute", 70], [64, 130, "Luftkammer am stumpfen Ende", 100], [270, 190, "Eiklar: Wasser, Schutz, Eiweiß", 130], [230, 140, "Dotter: Vorrat an Nährstoffen", 160], [206, 92, "Keimscheibe: daraus wird das Küken", 190], [300, 130, "Hagelschnur hält den Dotter", 220]]
       .map(([x, y, t, ly]) => pointer(Number(x), Number(y), 380, Number(ly), String(t)))
       .join("")}`,
  );

export const nesthockerNestfluechter = (): string =>
  compare(
    "Nesthocker und Nestflüchter im Vergleich mit Beispielen",
    {
      head: "Nesthocker",
      colour: C.orange,
      points: ["nackt oder kaum befiedert", "Augen geschlossen", "brauchen Wärme im Nest", "werden lange gefüttert", "Amsel, Meise; Kaninchen, Maus"],
    },
    {
      head: "Nestflüchter",
      colour: C.green,
      points: ["mit Daunen oder Fell", "Augen offen", "laufen oder schwimmen bald", "suchen früh selbst Nahrung", "Stockente, Huhn; Feldhase, Pferd"],
    },
  );

export const elternaufwand = (): string => {
  const rows: Array<[string, string, string, number]> = [
    ["Kabeljau", "im Durchschnitt etwa 1 Million Eier", "keine Brutpflege", 0],
    ["Grasfrosch", "meist 1000 bis 2500 Eier", "keine Brutpflege", 0],
    ["Dreistachliger Stichling", "Männchen baut ein Nest", "Männchen bewacht die Eier", 1],
    ["Amsel", "meist 4 bis 5 Eier", "Weibchen brütet, beide füttern", 2],
    ["Mensch", "meist 1 Kind je Geburt", "viele Jahre Fürsorge", 3],
  ];
  return svg(
    600,
    270,
    "Elternaufwand im Vergleich: Viele Nachkommen ohne Brutpflege beim Kabeljau, wenige Nachkommen mit langer Fürsorge bei Amsel und Mensch",
    `${panel(8, 8, 584, 254, "panel-bg")}
     ${label(24, 32, "Art", "lbl tiny strong", "start")}${label(200, 32, "Nachkommen", "lbl tiny strong", "start")}${label(400, 32, "Fürsorge", "lbl tiny strong", "start")}
     ${rows
       .map(
         ([a, n, f, care], i) =>
           `<rect x="16" y="${42 + i * 38}" width="568" height="32" rx="8" fill="var(--f-white)" opacity="0.7"/>${label(24, 62 + i * 38, a, "lbl tiny strong", "start")}${label(200, 62 + i * 38, n, "lbl tiny", "start")}${label(400, 62 + i * 38, f, "lbl tiny", "start")}<rect x="16" y="${42 + i * 38}" width="${6 + care * 2}" height="32" fill="var(--f-green)"/>`,
       )
       .join("")}
     ${label(300, 250, "Je mehr Aufwand die Eltern pro Junges treiben, desto weniger Nachkommen haben sie.", "lbl tiny strong", "middle")}`,
  );
};

export const balzSignale = (): string =>
  cardGrid(
    "Innerartliche Kommunikation durch Signale und ihre Bedeutung für die Fortpflanzung",
    [
      { head: "Stichling: Balztracht", body: "Männchen mit roter Kehle\nlockt Weibchen mit\nZickzacktanz zum Nest.", colour: C.red, icon: "🐟" },
      { head: "Amsel: Gesang", body: "Männchen singt: Revier\nbesetzt, Weibchen\nwillkommen.", colour: "#37474f", icon: "🎶" },
      { head: "Frösche: Rufe", body: "Männchen rufen im\nLaichgewässer, viele\nmit Schallblasen.", colour: C.green, icon: "🐸" },
      { head: "Rothirsch: Röhren", body: "Lautes Röhren in der\nBrunft schreckt Rivalen\nab und zeigt Stärke.", colour: C.earth, icon: "🦌" },
    ],
    2,
  );

/* ---------- Sinne ---------- */

export const besondereSinne = (): string =>
  cardGrid(
    "Besondere Sinnesleistungen von Wirbeltieren: Ultraschallortung, Seitenlinienorgan und Grubenorgan",
    [
      { head: "Ultraschallortung", body: "Fledermäuse rufen in\nUltraschall und orten\nBeute am Echo, auch\nin völliger Dunkelheit.", colour: C.purple, icon: "🦇" },
      { head: "Seitenlinienorgan", body: "Fische spüren mit der\nSeitenlinie Strömungen\nund Wasserbewegungen\nvon Beute und Feinden.", colour: C.blue, icon: "🐟" },
      { head: "Grubenorgan", body: "Grubenottern wie die\nKlapperschlange spüren\nmit Gruben am Kopf die\nWärme ihrer Beute.", colour: C.red, icon: "🐍" },
    ],
    3,
  );

export const sinneLebensraum = (): string =>
  cardGrid(
    "Angepasstheit der Sinnesorgane an Lebensraum und Lebensweise: Eule, Mäusebussard, Maulwurf, Hund, Feldhase und Fisch im trüben Wasser",
    [
      { head: "Eule: nachts", body: "große Augen nach vorn,\nsehr feines Gehör,\nGesichtsschleier", colour: C.purple, icon: "🦉" },
      { head: "Bussard: Tag", body: "sieht Mäuse aus großer\nHöhe; Augen nach vorn\nfür räumliches Sehen", colour: C.orange, icon: "🦅" },
      { head: "Maulwurf: Erde", body: "winzige Augen; Tasthaare\nund Geruch finden\nRegenwürmer", colour: C.earth, icon: "🕳" },
      { head: "Hund: Spuren", body: "Nase viel empfindlicher\nals unsere; folgt\nFährten am Boden", colour: C.stone, icon: "🐕" },
      { head: "Feldhase: Beute", body: "Augen seitlich: fast\nRundumsicht, um Feinde\nfrüh zu bemerken", colour: C.green, icon: "🐇" },
      { head: "Fisch: trübes Wasser", body: "Seitenlinie und Geruch\nersetzen die Augen,\nwo man nichts sieht", colour: C.blue, icon: "🐟" },
    ],
    3,
  );

/* ---------- Verwandtschaft und Evolution ---------- */

export const wirbeltierTabelle = (): string => {
  const head = ["", "Körperbedeckung", "Körpertemperatur", "Atmung", "Fortpflanzung"];
  const rows = [
    ["Fische", "Schuppen, Schleim", "wechselwarm", "Kiemen", "Laich im Wasser"],
    ["Amphibien", "feuchte Drüsenhaut", "wechselwarm", "Larve Kiemen, dann\nLunge und Haut", "Laich im Wasser,\nMetamorphose"],
    ["Reptilien", "Hornschuppen,\ntrocken", "wechselwarm", "Lunge", "Eier mit ledriger\nSchale an Land"],
    ["Vögel", "Federn", "gleichwarm", "Lunge, Luftsäcke", "Eier mit Kalkschale,\nBrüten"],
    ["Säugetiere", "Haare, Fell", "gleichwarm", "Lunge", "lebend geboren,\ngesäugt"],
  ];
  const colours = [C.blue, C.green, C.earth, C.orange, C.red];
  const w = [96, 120, 110, 126, 128];
  const xs = w.map((_, i) => 8 + w.slice(0, i).reduce((a, b) => a + b, 0));
  return svg(
    600,
    290,
    "Übersicht der fünf Wirbeltierklassen nach Körperbedeckung, Körpertemperatur, Atmung und Fortpflanzung",
    `${head.map((h, i) => `<rect x="${xs[i]}" y="8" width="${w[i] - 2}" height="28" fill="var(--f-panel)"/>${label(xs[i] + 6, 27, h, "lbl tiny strong", "start")}`).join("")}
     ${rows
       .map(
         (r, j) =>
           `${r.map((c, i) => `<rect x="${xs[i]}" y="${40 + j * 50}" width="${w[i] - 2}" height="46" fill="${i === 0 ? colours[j] : "var(--f-white)"}" opacity="${i === 0 ? 0.9 : 0.75}" stroke="var(--f-line)" stroke-width="0.5"/>${labels(xs[i] + 6, 58 + j * 50, c, i === 0 ? "lbl tiny on-dark" : "lbl tiny", "start", 13)}`).join("")}`,
       )
       .join("")}`,
  );
};

export const variationAuslese = (): string => {
  const mouse = (x: number, y: number, light: boolean) =>
    `<ellipse cx="${x}" cy="${y}" rx="14" ry="8" fill="${light ? "#e0d6c8" : "#4e3b2a"}" stroke="var(--f-ink)" stroke-width="0.8"/><circle cx="${x + 12}" cy="${y - 4}" r="4" fill="${light ? "#e0d6c8" : "#4e3b2a"}"/>`;
  const gen = (x: number, title: string, lights: number) =>
    `${panel(x, 8, 188, 230, "panel-bg")}${label(x + 94, 30, title, "lbl small strong", "middle")}<rect x="${x + 10}" y="44" width="168" height="150" rx="10" fill="#5d4c3a" opacity="0.8"/>${Array.from({ length: 10 }, (_, i) => mouse(x + 36 + (i % 3) * 52, 70 + Math.floor(i / 3) * 34, i < lights)).join("")}${label(x + 94, 214, `${lights} helle, ${10 - lights} dunkle Mäuse`, "lbl tiny", "middle")}`;
  return svg(
    600,
    270,
    "Vereinfachtes Modell der Evolution: Auf dunklem Boden werden helle Mäuse häufiger von Greifvögeln entdeckt; über Generationen nimmt der Anteil dunkler Mäuse zu",
    `${gen(8, "Generation 1", 5)}${gen(206, "einige Generationen später", 3)}${gen(404, "viele Generationen später", 1)}
     ${arrow(196, 120, 214, 120)}${arrow(394, 120, 412, 120)}
     ${label(300, 258, "Unterschiede (Variation) + Vererbung + Greifvögel fangen auffällige Mäuse häufiger (Auslese)", "lbl tiny strong", "middle")}`,
  );
};

export const zuechtungEvolution = (): string =>
  compare(
    "Züchtung durch den Menschen und natürliche Evolution im Vergleich",
    {
      head: "Züchtung: Mensch wählt aus",
      colour: C.orange,
      points: [
        "Der Mensch setzt ein Ziel.",
        "Nur Tiere mit Wunschmerkmal vermehren sich.",
        "Merkmale können übertrieben werden.",
        "schnell: oft wenige Jahrzehnte",
        "Wolf → viele Hunderassen",
      ],
    },
    {
      head: "Evolution: Umwelt wählt aus",
      colour: C.green,
      points: [
        "Es gibt kein Ziel und keinen Plan.",
        "Feinde, Klima und Nahrung wirken.",
        "Besser Angepasste haben mehr Junge.",
        "langsam: sehr viele Generationen",
        "Neue Arten können entstehen.",
      ],
    },
  );

export const tiergerecht = (): string =>
  cardGrid(
    "Tiergerechte Haltung von Heimtieren und Nutztieren: Bedürfnisse, die Halter erfüllen müssen",
    [
      { head: "Artgenossen", body: "Kaninchen, Meerschwein-\nchen, Wellensittich nie\nallein halten.", colour: C.blue, icon: "👥" },
      { head: "Platz und Auslauf", body: "Bewegung, Verstecke,\nRennen, Graben,\nFliegen ermöglichen.", colour: C.green, icon: "🏡" },
      { head: "Futter und Pflege", body: "Artgerechtes Futter,\nfrisches Wasser,\nsauberer Stall.", colour: C.orange, icon: "🥕" },
      { head: "Gesundheit", body: "Tierarzt, Krallen, Zähne\nkontrollieren; Urlaub\nund Kosten vorher planen.", colour: C.red, icon: "🩺" },
      { head: "Nutztiere", body: "Auch Rind, Schwein und\nHuhn brauchen Platz,\nLicht und Beschäftigung.", colour: C.earth, icon: "🐄" },
      { head: "Gesetz", body: "Das Tierschutzgesetz\nverlangt Haltung nach\nArt und Bedürfnissen.", colour: C.stone, icon: "§" },
    ],
    3,
  );

export const eiercode = (): string =>
  svg(
    600,
    230,
    "Der Code auf dem Ei: Die erste Ziffer nennt die Haltungsform, 0 ökologisch, 1 Freiland, 2 Boden, 3 Käfig oder Kleingruppe; danach Land und Betrieb",
    `${panel(8, 8, 584, 214, "panel-bg")}
     <ellipse cx="150" cy="115" rx="80" ry="100" fill="#f3e0c8" stroke="var(--f-line)" stroke-width="2"/>
     ${label(150, 120, "1-DE-0912345", "lbl small strong", "middle")}
     ${labels(250, 40, "1. Ziffer = Haltungsform der Hennen\n0  ökologische Erzeugung (Bio)\n1  Freilandhaltung\n2  Bodenhaltung\n3  Käfig- oder Kleingruppenhaltung", "lbl tiny", "start", 17)}
     ${labels(250, 150, "DE = Land, in dem das Ei gelegt wurde\nDanach: Bundesland, Betrieb, Stall\n\nBeim Einkauf kannst du so mitentscheiden.", "lbl tiny", "start", 17)}`,
  );

/* ---------- Ökosystem Gewässer ---------- */

export const gewaesserMessen = (): string =>
  svg(
    600,
    270,
    "Abiotische Faktoren im Gewässer messen: Wassertemperatur mit dem Thermometer, Sichttiefe mit der Secchi-Scheibe und Fließgeschwindigkeit mit einem Schwimmkörper",
    `${panel(8, 8, 188, 254, "panel-bg")}
     ${label(102, 30, "Wassertemperatur", "lbl small strong", "middle")}
     <rect x="20" y="120" width="164" height="90" fill="var(--f-sea)"/>
     <rect x="96" y="60" width="12" height="110" rx="6" fill="var(--f-white)" stroke="var(--f-ink)"/><circle cx="102" cy="172" r="9" fill="var(--f-red)"/>
     ${labels(102, 232, "in gleicher Tiefe,\nim Schatten ablesen", "lbl tiny", "middle", 13)}
     ${panel(206, 8, 188, 254, "panel-bg")}
     ${label(300, 30, "Sichttiefe", "lbl small strong", "middle")}
     <rect x="218" y="60" width="164" height="150" fill="var(--f-sea)"/>
     <line x1="300" y1="44" x2="300" y2="160" stroke="var(--f-ink)"/>
     ${[0, 1, 2, 3].map((i) => `<line x1="296" y1="${70 + i * 25}" x2="304" y2="${70 + i * 25}" stroke="var(--f-ink)"/>`).join("")}
     <ellipse cx="300" cy="162" rx="22" ry="6" fill="var(--f-white)" stroke="var(--f-ink)"/>
     ${labels(300, 232, "weiße Scheibe absenken:\nTiefe, bei der sie verschwindet", "lbl tiny", "middle", 13)}
     ${panel(404, 8, 188, 254, "panel-bg")}
     ${label(498, 30, "Fließgeschwindigkeit", "lbl small strong", "middle")}
     <rect x="416" y="90" width="164" height="70" fill="var(--f-sea)"/>
     <circle cx="430" cy="120" r="7" fill="var(--f-orange)"/>${arrow(440, 120, 560, 120)}
     ${label(498, 84, "10 m", "lbl tiny strong", "middle")}
     ${labels(498, 186, "Zeit messen: 20 s\n10 m : 20 s = 0,5 m/s", "lbl tiny strong", "middle", 15)}
     ${labels(498, 232, "mehrmals messen,\nMittelwert bilden", "lbl tiny", "middle", 13)}`,
  );

export const teichZonen = (): string =>
  svg(
    600,
    290,
    "Zonen eines Teichs mit typischen Pflanzen und Tieren: Röhricht mit Schilf, Schwimmblattzone mit Seerose, Tauchblattzone mit Wasserpest, Freiwasser mit Plankton und Bodenzone",
    `${panel(8, 8, 584, 274, "panel-bg")}
     <path d="M8 120 L120 120 Q300 260 592 180 L592 282 L8 282 Z" fill="var(--f-earth)" opacity="0.45"/>
     <path d="M70 120 L592 120 L592 180 Q300 260 120 120 Z" fill="var(--f-sea)"/>
     ${[30, 50, 70, 90, 110].map((x) => `<line x1="${x}" y1="140" x2="${x}" y2="${50 + (x % 3) * 6}" stroke="#7c8b3c" stroke-width="3"/><ellipse cx="${x}" cy="${46 + (x % 3) * 6}" rx="3" ry="9" fill="#6d4c41"/>`).join("")}
     ${[180, 220].map((x) => `<ellipse cx="${x}" cy="120" rx="18" ry="5" fill="var(--f-green)"/><circle cx="${x + 4}" cy="114" r="6" fill="var(--f-white)" stroke="var(--f-pink)"/><line x1="${x}" y1="122" x2="${x - 4}" y2="180" stroke="var(--f-green)"/>`).join("")}
     ${[300, 330].map((x) => `<path d="M${x} 214 Q${x - 6} 180 ${x} 150" fill="none" stroke="var(--f-forest)" stroke-width="3"/>`).join("")}
     ${[420, 450, 480, 510].map((x, i) => `<circle cx="${x}" cy="${140 + (i % 2) * 14}" r="3" fill="var(--f-green)"/>`).join("")}
     <path d="M360 160 q20 -12 40 0 q-20 12 -40 0 Z M400 160 l10 -6 l0 12 Z" fill="#78909c"/>
     <ellipse cx="300" cy="96" rx="16" ry="8" fill="#8d6e63"/><circle cx="314" cy="88" r="5" fill="#2e7d32"/>
     <line x1="140" y1="118" x2="140" y2="70" stroke="#90a4ae" stroke-width="3"/><ellipse cx="140" cy="64" rx="8" ry="10" fill="#90a4ae"/>
     ${label(70, 30, "Röhricht: Schilf", "lbl tiny strong", "middle")}
     ${label(200, 100, "Schwimmblatt: Seerose", "lbl tiny strong", "middle")}
     ${label(316, 236, "Tauchblatt: Wasserpest", "lbl tiny strong", "middle")}
     ${label(470, 110, "Freiwasser: Algen, Wasserfloh", "lbl tiny strong", "middle")}
     ${label(380, 186, "Rotauge", "lbl tiny", "middle")}
     ${label(300, 74, "Stockente", "lbl tiny", "middle")}
     ${label(140, 56, "Graureiher", "lbl tiny", "end")}
     ${label(470, 262, "Bodenzone: Schlamm, Muscheln, Zersetzer", "lbl tiny strong", "middle")}`,
  );

export const oekosystemTeich = (): string =>
  cardGrid(
    "Ökosystem Teich als Gesamtheit aus unbelebter Natur und Lebensgemeinschaft mit Produzenten, Konsumenten und Zersetzern",
    [
      { head: "Unbelebte Natur", body: "Wasser, Licht, Temperatur,\nSauerstoff, Boden,\nFließgeschwindigkeit", colour: C.stone, icon: "💧" },
      { head: "Produzenten", body: "Algen und Wasserpflanzen\nbauen mit Licht\nZucker auf.", colour: C.green, icon: "🌿" },
      { head: "Konsumenten", body: "Wasserfloh, Rotauge,\nHecht, Graureiher fressen\nandere Lebewesen.", colour: C.blue, icon: "🐟" },
      { head: "Zersetzer", body: "Bakterien, Pilze, Würmer\nim Schlamm bauen tote\nReste wieder ab.", colour: C.earth, icon: "🪱" },
    ],
    2,
  );

export const gewaesserGefahren = (): string =>
  chain(
    "Gefährdung eines Gewässers durch Dünger: mehr Nährstoffe, viele Algen, Zersetzung verbraucht Sauerstoff, Fische ersticken; daneben Schutzmaßnahmen",
    [
      { head: "Dünger", body: "Regen spült Dünger\nvom Feld ins\nGewässer.", colour: C.orange, icon: "🚜" },
      { head: "Algen", body: "Mehr Nährstoffe:\nAlgen vermehren sich\nstark.", colour: C.green },
      { head: "Zersetzung", body: "Tote Algen sinken ab;\nZersetzer verbrauchen\nviel Sauerstoff.", colour: C.earth },
      { head: "Folgen", body: "Sauerstoffmangel:\nFische und Kleintiere\nsterben.", colour: C.red, icon: "⚠" },
      { head: "Schutz", body: "Uferstreifen ohne\nDünger, Kläranlage,\nEnten nicht füttern", colour: C.blue, icon: "🛡" },
      { head: "Mehr Schutz", body: "Fischtreppen, natür-\nliche Ufer, Wasser\nnicht aufheizen", colour: C.purple },
    ],
    3,
  );
