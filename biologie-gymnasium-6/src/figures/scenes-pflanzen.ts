/**
 * Drawings of stations 2 and 3 (NT6 1.2 Samenpflanzen als Lebewesen): seeds
 * and fruits, dispersal, bionics, runners, germination, the tasks of the
 * plant organs, photosynthesis and cellular respiration, plant reactions.
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
  forest: "var(--f-forest)",
};

export const bohnensamen = (): string =>
  svg(
    680,
    260,
    "Bau eines Bohnensamens: Samenschale, zwei Keimblätter als Nährstoffspeicher und der Embryo mit Keimwurzel, Keimstängel und Keimknospe; daneben ein Maiskorn mit eigenem Nährgewebe",
    `${panel(8, 8, 440, 244, "panel-bg")}
     ${label(228, 30, "Bohnensamen, aufgeklappt", "lbl small strong", "middle")}
     <path d="M70 140 Q70 60 150 60 Q230 60 230 140 Q230 220 150 220 Q70 220 70 140 Z" fill="#f3e5c0" stroke="#8d6e63" stroke-width="5"/>
     <path d="M84 140 Q84 74 150 74 Q216 74 216 140 Q216 206 150 206 Q84 206 84 140 Z" fill="#fff3d6" stroke="var(--f-line)"/>
     <path d="M150 78 L150 202" stroke="var(--f-line)" stroke-dasharray="4 3"/>
     <path d="M158 110 Q182 108 186 128 Q176 136 160 128 Z" fill="var(--f-green)"/>
     <path d="M158 128 L160 168 Q162 182 170 190" fill="none" stroke="#c0a060" stroke-width="7" stroke-linecap="round"/>
     ${[
       [226, 140, "Samenschale", 60],
       [110, 160, "Keimblatt: Nährstoffspeicher", 100],
       [184, 118, "Keimknospe (erste Laubblätter)", 140],
       [162, 150, "Keimstängel", 180],
       [170, 190, "Keimwurzel", 220],
     ]
       .map(([x, y, t, ly]) => `<line x1="${x}" y1="${y}" x2="250" y2="${ly}" stroke="var(--f-ink)" opacity="0.55"/>${label(256, Number(ly) + 4, String(t), "lbl tiny", "start")}`)
       .join("")}
     ${labels(20, 236, "Embryo = Keimknospe + Keimstängel + Keimwurzel", "lbl tiny strong", "start")}
     ${panel(456, 8, 216, 244, "panel-bg")}
     ${label(564, 30, "Maiskorn, längs", "lbl small strong", "middle")}
     <path d="M510 70 Q564 40 618 70 L618 200 Q564 230 510 200 Z" fill="#ffe082" stroke="#b28a3a" stroke-width="4"/>
     <path d="M570 120 Q600 130 600 180 Q582 206 564 196 Q566 150 570 120 Z" fill="#c5e1a5" stroke="var(--f-line)"/>
     ${labels(522, 104, "Nährgewebe", "lbl tiny strong", "start")}
     ${labels(570, 222, "Embryo", "lbl tiny strong", "start")}
     `,
  );

export const blueteZurFrucht = (): string =>
  chain(
    "Von der Blüte zur Frucht am Beispiel der Kirsche: Bestäubung, Befruchtung, Fruchtknoten wird Frucht, Samenanlage wird Samen",
    [
      { head: "Blüte", body: "Fruchtknoten mit\nSamenanlage und\nEizelle", colour: C.pink, icon: "🌸" },
      { head: "Bestäubung", body: "Pollen gelangt\nauf die Narbe\n(Wiederholung NT5)", colour: C.orange },
      { head: "Befruchtung", body: "Keimzellen\nverschmelzen in der\nSamenanlage", colour: C.purple },
      { head: "Frucht", body: "Fruchtknoten → Frucht\nSamenanlage → Samen\nmit Embryo", colour: C.red, icon: "🍒" },
    ],
    4,
    700,
  );

export const ausbreitungstypen = (): string =>
  cardGrid(
    "Ausbreitungsstrategien von Früchten und Samen: Wind, Tiere außen, Tiere innen, Verstecken und Selbstausbreitung",
    [
      { head: "Wind: Flieger", body: "Löwenzahn (Schirmchen),\nAhorn (Schraube), Linde.\nViele leichte Früchte.", colour: C.blue, icon: "🌬" },
      { head: "Tiere außen", body: "Klette, Klebkraut:\nHaken am Fell.\nKein Fruchtfleisch nötig.", colour: C.orange, icon: "🦌" },
      { head: "Tiere innen", body: "Kirsche, Holunder:\nsüßes Fruchtfleisch,\nharter Samen.", colour: C.red, icon: "🐦" },
      { head: "Verstecken", body: "Haselnuss, Eichel:\nEichhörnchen und Häher\nvergessen Vorräte.", colour: "var(--f-earth)", icon: "🐿" },
      { head: "Selbst", body: "Springkraut, Erbse:\nFrucht platzt auf und\nschleudert Samen.", colour: C.green, icon: "💥" },
      { head: "Kosten und Nutzen", body: "Fruchtfleisch kostet viel,\nbringt Samen gezielt fort.\nFlieger: billig, viel Verlust.", colour: C.stone },
    ],
    3,
  );

export const bionikPflanzen = (): string =>
  cardGrid(
    "Bionik: Strukturen von Samenpflanzen als Vorbild für technische Produkte",
    [
      { head: "Ahornfrucht → Rotor", body: "Ein Flügel dreht sich\nwie ein Propeller und\nbremst den Fall.", colour: C.orange, icon: "🍁" },
      { head: "Klette → Klettverschluss", body: "Elastische Haken greifen\nin Schlaufen; das Vorbild\nhängt im Hundefell.", colour: "var(--f-earth)", icon: "🪝" },
      { head: "Lotusblatt → Farbe", body: "Winzige Noppen lassen\nWasser abperlen; es\nnimmt Schmutz mit.", colour: C.blue, icon: "💧" },
      { head: "Löwenzahn → Schirm", body: "Ein Haarkranz bremst\nim Wind und hält die\nFrucht lange in der Luft.", colour: C.green, icon: "🌼" },
    ],
    2,
  );

export const erdbeerAuslaeufer = (): string =>
  svg(
    600,
    230,
    "Ungeschlechtliche Fortpflanzung der Erdbeere: Eine Mutterpflanze bildet oberirdische Ausläufer, an deren Knoten Tochterpflanzen Wurzeln schlagen",
    `${panel(8, 8, 584, 214, "panel-bg")}
     <rect x="8" y="160" width="584" height="62" fill="var(--f-earth)" opacity="0.35"/>
     ${[[100, 1.2], [300, 0.9], [480, 0.7]]
       .map(
         ([x, sc]) => `<g transform="translate(${x} 160) scale(${sc})">
           ${[-30, 0, 30].map((a) => `<ellipse cx="${f1(26 * Math.sin((a * Math.PI) / 180))}" cy="${f1(-34 - 10 * Math.cos((a * Math.PI) / 180))}" rx="14" ry="20" fill="var(--f-green)" stroke="var(--f-forest)" transform="rotate(${a} ${f1(26 * Math.sin((a * Math.PI) / 180))} ${f1(-34 - 10 * Math.cos((a * Math.PI) / 180))})"/>`).join("")}
           <line x1="0" y1="0" x2="0" y2="-24" stroke="var(--f-forest)" stroke-width="3"/>
           ${[-16, -6, 6, 16].map((dx) => `<path d="M0 0 Q${dx} 16 ${dx * 1.6} 34" fill="none" stroke="#8d6e63" stroke-width="2"/>`).join("")}
         </g>`,
       )
       .join("")}
     <path d="M110 156 Q200 130 300 158" fill="none" stroke="#c62828" stroke-width="3"/>
     <path d="M310 158 Q400 136 480 158" fill="none" stroke="#c62828" stroke-width="3"/>
     <circle cx="128" cy="100" r="9" fill="var(--f-red)"/>
     ${label(100, 40, "Mutterpflanze", "lbl small strong", "middle")}
     ${label(300, 70, "Tochterpflanze", "lbl small strong", "middle")}
     ${label(480, 86, "Enkelpflanze", "lbl small strong", "middle")}
     ${label(205, 126, "Ausläufer", "lbl tiny strong", "middle")}
     ${labels(150, 202, "Erdbeere mit Samen: geschlechtlich", "lbl tiny", "start")}
     ${labels(330, 212, "Ausläufer: ungeschlechtlich, erbgleich", "lbl tiny", "start")}`,
  );

export const fortpflanzungKosten = (): string =>
  compare(
    "Kosten und Nutzen der geschlechtlichen und der ungeschlechtlichen Fortpflanzung bei Samenpflanzen",
    {
      head: "Geschlechtlich: Samen",
      colour: C.purple,
      points: [
        "braucht Blüten und Bestäubung",
        "Nektar, Pollen, Früchte kosten Stoffe",
        "Nachkommen sind verschieden",
        "Samen breiten sich weit aus",
        "Samen überdauern Winter und Trockenheit",
      ],
    },
    {
      head: "Ungeschlechtlich: Ausläufer, Knollen",
      colour: C.green,
      points: [
        "kein Partner, keine Bestäubung nötig",
        "schnell und sicher, gut versorgt",
        "Nachkommen sind erbgleich",
        "bleiben nahe der Mutterpflanze",
        "alle gleich anfällig für Krankheiten",
      ],
    },
  );

export const keimungBohne = (): string =>
  chain(
    "Keimung einer Gartenbohne: Quellung, Keimwurzel, Keimstängel als Haken, Keimblätter über der Erde, erste Laubblätter",
    [
      { head: "1 Quellung", body: "Samen nimmt Wasser\nauf, wird dicker,\nSchale reißt auf", colour: C.blue },
      { head: "2 Keimwurzel", body: "wächst nach unten,\nverankert und nimmt\nWasser auf", colour: "var(--f-earth)" },
      { head: "3 Keimstängel", body: "schiebt sich als Haken\ndurch die Erde\nnach oben", colour: C.orange },
      { head: "4 Laubblätter", body: "ergrünen im Licht;\nKeimblätter werden\nverbraucht, fallen ab", colour: C.green },
    ],
    4,
    720,
  );

export const pflanzeAufgaben = (): string =>
  svg(
    600,
    300,
    "Grundbauplan einer Samenpflanze mit den Aufgaben von Wurzel, Sprossachse und Blatt sowie den Transportwegen von Wasser und Zucker",
    `${panel(8, 8, 584, 284, "panel-bg")}
     <rect x="8" y="200" width="584" height="92" fill="var(--f-earth)" opacity="0.3"/>
     <line x1="200" y1="200" x2="200" y2="60" stroke="var(--f-forest)" stroke-width="8"/>
     ${[[90, -1], [120, 1], [150, -1]].map(([y, d]) => `<ellipse cx="${200 + Number(d) * 44}" cy="${y}" rx="40" ry="14" fill="var(--f-green)" stroke="var(--f-forest)" transform="rotate(${Number(d) * -20} ${200 + Number(d) * 44} ${y})"/>`).join("")}
     <circle cx="200" cy="50" r="14" fill="var(--f-yellow)" stroke="var(--f-orange)" stroke-width="3"/>
     ${[[-50, 260], [-20, 280], [10, 286], [40, 270], [60, 240]].map(([dx, y]) => `<path d="M200 200 Q${200 + Number(dx) / 2} ${(200 + Number(y)) / 2} ${200 + Number(dx)} ${y}" fill="none" stroke="#8d6e63" stroke-width="3"/>`).join("")}
     ${arrow(214, 196, 214, 128, "arrow")}
     ${label(222, 172, "Wasser", "lbl tiny strong", "start")}
     ${arrow(186, 104, 186, 190, "arrow power")}
     ${label(178, 176, "Zucker", "lbl tiny strong", "end")}
     ${labels(330, 40, "Blatt\n• Photosynthese: baut Zucker\n• Gasaustausch über Spaltöffnungen\n• verdunstet Wasser und zieht so\n  Wasser nach oben", "lbl tiny", "start", 15)}
     ${labels(330, 130, "Sprossachse\n• trägt die Blätter zum Licht\n• leitet Wasser nach oben und\n  Zucker in alle Teile\n• kann speichern (Kartoffelknolle)", "lbl tiny", "start", 15)}
     ${labels(330, 222, "Wurzel\n• verankert die Pflanze im Boden\n• nimmt mit Wurzelhaaren Wasser\n  und Mineralstoffe auf\n• kann speichern (Möhre)", "lbl tiny", "start", 15)}`,
  );

function ball(x: number, y: number, kind: "C" | "O" | "H"): string {
  const fill = kind === "C" ? "#37474f" : kind === "O" ? "var(--f-red)" : "var(--f-white)";
  const r = kind === "H" ? 5 : 8;
  return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${fill}" stroke="var(--f-ink)" stroke-width="1"/>`;
}

export const photosyntheseTeilchen = (): string => {
  const co2 = Array.from({ length: 6 }, (_, i) => {
    const x = 40 + (i % 3) * 44;
    const y = 70 + Math.floor(i / 3) * 34;
    return `${ball(x - 14, y, "O")}${ball(x, y, "C")}${ball(x + 14, y, "O")}`;
  }).join("");
  const h2o = Array.from({ length: 6 }, (_, i) => {
    const x = 40 + (i % 3) * 44;
    const y = 170 + Math.floor(i / 3) * 34;
    return `${ball(x - 9, y + 8, "H")}${ball(x, y, "O")}${ball(x + 9, y + 8, "H")}`;
  }).join("");
  const sugar = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2;
    const x = 380 + 26 * Math.cos(a);
    const y = 110 + 26 * Math.sin(a);
    return `${ball(x + 14 * Math.cos(a), y + 14 * Math.sin(a), "O")}${ball(x + 8 * Math.cos(a + 1.2), y + 8 * Math.sin(a + 1.2), "H")}${ball(x + 8 * Math.cos(a - 1.2), y + 8 * Math.sin(a - 1.2), "H")}${ball(x, y, "C")}`;
  }).join("");
  const o2 = Array.from({ length: 6 }, (_, i) => {
    const x = 352 + (i % 3) * 44;
    const y = 196 + Math.floor(i / 3) * 30;
    return `${ball(x - 7, y, "O")}${ball(x + 7, y, "O")}`;
  }).join("");
  return svg(
    600,
    280,
    "Stark vereinfachtes Teilchenmodell der Photosynthese: Sechs Kohlenstoffdioxid-Teilchen und sechs Wasser-Teilchen werden mit Lichtenergie zu einem Traubenzucker-Teilchen und sechs Sauerstoff-Teilchen umgebaut; die Bausteine bleiben erhalten",
    `${panel(8, 8, 584, 264, "panel-bg")}
     ${label(84, 34, "6 Kohlenstoffdioxid", "lbl tiny strong", "middle")}${co2}
     ${label(84, 150, "6 Wasser", "lbl tiny strong", "middle")}${h2o}
     <circle cx="250" cy="60" r="18" fill="var(--f-yellow)"/>${label(250, 92, "Licht", "lbl tiny strong", "middle")}
     ${arrow(200, 140, 310, 140, "arrow power")}
     ${label(255, 128, "Chloroplast", "lbl tiny", "middle")}
     ${label(380, 34, "1 Traubenzucker", "lbl tiny strong", "middle")}${sugar}
     ${label(396, 176, "6 Sauerstoff", "lbl tiny strong", "middle")}${o2}
     ${ball(450, 46, "C")}${label(464, 50, "Kohlenstoff-Baustein", "lbl tiny", "start")}
     ${ball(450, 70, "O")}${label(464, 74, "Sauerstoff-Baustein", "lbl tiny", "start")}
     ${ball(450, 92, "H")}${label(464, 96, "Wasserstoff-Baustein", "lbl tiny", "start")}
     ${labels(20, 248, "Die Bausteine werden nur neu zusammengesetzt: links und rechts je 6 C, 12 H und 18 O.\nDie Lichtenergie steckt danach im Zucker.", "lbl tiny", "start", 14)}`,
  );
};

export const stoffkreislauf = (): string =>
  svg(
    600,
    270,
    "Photosynthese und Zellatmung als Kreislauf: Die Photosynthese baut mit Lichtenergie Zucker und Sauerstoff auf, die Zellatmung baut sie wieder zu Kohlenstoffdioxid und Wasser ab und setzt Energie frei",
    `${panel(8, 8, 584, 254, "panel-bg")}
     <rect x="40" y="96" width="170" height="80" rx="14" fill="var(--f-green)" opacity="0.9"/>
     ${labels(125, 126, "Photosynthese\nnur im Licht, in\nChloroplasten", "lbl small on-dark", "middle", 16)}
     <rect x="390" y="96" width="170" height="80" rx="14" fill="var(--f-orange)" opacity="0.95"/>
     ${labels(475, 126, "Zellatmung\nTag und Nacht,\nin allen Zellen", "lbl small on-dark", "middle", 16)}
     ${arrow(214, 112, 386, 112, "arrow")}
     ${label(300, 100, "Traubenzucker + Sauerstoff", "lbl tiny strong", "middle")}
     ${arrow(386, 162, 214, 162, "arrow")}
     ${label(300, 184, "Kohlenstoffdioxid + Wasser", "lbl tiny strong", "middle")}
     <circle cx="125" cy="44" r="18" fill="var(--f-yellow)"/>${arrow(125, 64, 125, 92, "arrow power")}
     ${label(160, 48, "Lichtenergie", "lbl tiny strong", "start")}
     ${arrow(475, 180, 475, 220, "arrow power")}
     ${labels(475, 236, "Energie für Wachstum,\nBewegung und Wärme", "lbl tiny strong", "middle", 14)}
     ${labels(30, 222, "Stoffe kreisen,\nEnergie fließt hindurch.", "lbl tiny strong", "start", 15)}`,
  );

export const photosyntheseBedeutung = (): string =>
  cardGrid(
    "Bedeutung der Photosynthese: Nahrung, Sauerstoff, nachwachsende Rohstoffe und fossile Brennstoffe",
    [
      { head: "Nahrung", body: "Alle Nahrungsketten\nbeginnen bei Pflanzen:\nGetreide, Gemüse, Futter.", colour: C.green, icon: "🌾" },
      { head: "Sauerstoff", body: "Die Luft enthält Sauer-\nstoff, weil Pflanzen und\nAlgen ihn freisetzen.", colour: C.blue, icon: "💨" },
      { head: "Nachwachsend", body: "Holz, Baumwolle, Raps-\nöl, Biogas aus Mais:\nwachsen jedes Jahr nach.", colour: C.orange, icon: "🪵" },
      { head: "Fossil", body: "Kohle, Erdöl, Erdgas:\nReste von Lebewesen\nvor Millionen Jahren.", colour: C.stone, icon: "⛏" },
    ],
    2,
  );

export const pflanzenreaktionen = (): string =>
  cardGrid(
    "Pflanzen reagieren auf Reize aus der Umwelt; die Reaktionen dienen Ernährung, Fortpflanzung und Schutz",
    [
      { head: "Ernährung", body: "Spross und Blätter\nwachsen zum Licht hin;\nmehr Licht, mehr Zucker.", colour: C.green, icon: "☀" },
      { head: "Ernährung", body: "Die Wurzel wächst\nnach unten zu Wasser\nund Mineralstoffen.", colour: "var(--f-earth)", icon: "⬇" },
      { head: "Fortpflanzung", body: "Löwenzahn öffnet im Licht\nseine Blüten und schließt\nsie abends: Pollen bleibt\ntrocken, Insekten finden\nsie am Tag.", colour: C.orange, icon: "🌼" },
      { head: "Schutz", body: "Die Mimose klappt bei\nBerührung ihre Blätter\nzusammen und senkt sie ab.", colour: C.purple, icon: "🌿" },
    ],
    2,
  );

export const reizReaktionVergleich = (): string =>
  compare(
    "Reiz-Reaktions-Kette beim Menschen und Reaktion einer Pflanze auf Licht im Vergleich",
    {
      head: "Mensch: Ball fliegt auf dich zu",
      colour: C.blue,
      points: [
        "Reiz: Licht vom Ball",
        "Sinneszellen im Auge nehmen ihn auf",
        "Nerven leiten Signale zum Gehirn",
        "Gehirn verarbeitet, Nerven zum Muskel",
        "Reaktion in Sekundenbruchteilen",
      ],
    },
    {
      head: "Keimling: Licht von der Seite",
      colour: C.green,
      points: [
        "Reiz: Licht von einer Seite",
        "Die Sprossspitze nimmt es auf",
        "Ein Wuchsstoff gelangt zur Schattenseite",
        "Dort strecken sich die Zellen stärker",
        "Krümmung nach Stunden, ohne Nerven",
      ],
    },
  );
