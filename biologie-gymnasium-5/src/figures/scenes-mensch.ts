/** Drawings of stations 3 to 6: senses, movement, metabolism, puberty. */
import { arrow, cardGrid, chain, compare, f1, label, labels, panel, svg } from "./draw";

const C = {
  blue: "var(--f-blue)",
  green: "var(--f-green)",
  orange: "var(--f-orange)",
  red: "var(--f-red)",
  purple: "var(--f-purple)",
  pink: "var(--f-pink)",
  stone: "#59636e",
  vein: "#3f6fd8",
};

const bone = "#e7dfd0";

/* ---------- Sinne und Reaktion ---------- */

export const sinnesorgane = (): string =>
  cardGrid(
    "Die Sinnesorgane des Menschen mit ihren Sinneszellen und den Reizen, die sie aufnehmen",
    [
      { head: "Auge", body: "Lichtsinneszellen in\nder Netzhaut\nReiz: Licht", colour: C.blue, icon: "👁" },
      { head: "Ohr", body: "Hörsinneszellen im\nInnenohr; auch Lage-\nund Drehsinn · Reiz: Schall", colour: C.purple, icon: "👂" },
      { head: "Nase", body: "Riechsinneszellen in\nder Riechschleimhaut\nReiz: Duftstoffe", colour: C.green, icon: "👃" },
      { head: "Zunge", body: "Geschmackssinnes-\nzellen in den Knospen\nReiz: Geschmacksstoffe", colour: C.red, icon: "👅" },
      { head: "Haut", body: "Sinneszellen für Druck,\nTemperatur und Schmerz\nReiz: Berührung, Wärme", colour: C.orange, icon: "✋" },
      { head: "Gemeinsam", body: "Jede Sinneszelle reagiert\nvor allem auf eine\nbestimmte Reizart.", colour: C.stone, icon: "★" },
    ],
    3,
  );

export const reizkette = (): string =>
  chain(
    "Reiz-Reaktions-Kette am Beispiel einer Fußgängerampel, die auf Rot springt",
    [
      { head: "Reiz", body: "rotes Licht\nder Ampel", colour: C.red },
      { head: "Sinnesorgan", body: "Auge nimmt den Reiz\nauf und wandelt ihn\nin Signale um", colour: C.blue },
      { head: "Nerv", body: "Sehnerv leitet die\nInformation weiter", colour: C.purple },
      { head: "Gehirn", body: "verarbeitet: „Rot\nheißt stehen bleiben“", colour: C.pink },
      { head: "Nerv", body: "leitet den Befehl\nzu den Muskeln", colour: C.purple },
      { head: "Muskel", body: "Beinmuskeln\nbremsen: Reaktion", colour: C.green },
    ],
    3,
  );

export const reaktionEinfluesse = (): string =>
  cardGrid(
    "Was die Reaktionsfähigkeit verschlechtert: Alkohol und andere Suchtmittel, Müdigkeit und Ablenkung",
    [
      { head: "Alkohol", body: "verlangsamt die Verarbeitung\nim Gehirn, verschlechtert\nSehen und Gleichgewicht", colour: C.red, icon: "🍺" },
      { head: "Andere Suchtmittel", body: "auch Drogen und manche\nMedikamente verändern\nWahrnehmung und Reaktion", colour: C.purple, icon: "💊" },
      { head: "Müdigkeit", body: "das Gehirn verarbeitet\nInformationen langsamer", colour: C.blue, icon: "😴" },
      { head: "Ablenkung", body: "Blick aufs Handy oder\nKopfhörer: Reize werden\nspät oder nicht bemerkt", colour: C.orange, icon: "📱" },
    ],
    4,
    680,
  );

export const lautstaerkeSkala = (): string => {
  const marks: Array<[number, string]> = [
    [25, "ruhiges Zimmer\n20 bis 30 dB"],
    [60, "Fernseher\netwa 60 dB"],
    [85, "Gefahr für das\nGehör ab 85 dB"],
    [100, "Diskothek\netwa 100 dB"],
  ];
  const x = (db: number) => 30 + db * 5.2;
  return svg(
    600,
    170,
    "Lautstärke in Dezibel: ab etwa 85 Dezibel kann das Gehör geschädigt werden",
    `<defs><linearGradient id="db-grad"><stop offset="0" stop-color="#4caf50"/><stop offset="0.7" stop-color="#ffc107"/><stop offset="0.8" stop-color="#e53935"/><stop offset="1" stop-color="#8e24aa"/></linearGradient></defs>
     <rect x="30" y="56" width="${f1(x(105) - 30)}" height="22" rx="11" fill="url(#db-grad)"/>
     <line x1="${x(85)}" y1="40" x2="${x(85)}" y2="94" stroke="var(--f-ink)" stroke-width="3" stroke-dasharray="5 3"/>
     ${marks.map(([db, t]) => `<line x1="${f1(x(db))}" y1="78" x2="${f1(x(db))}" y2="96" stroke="var(--f-ink)"/>${labels(x(db), 112, t, db === 85 ? "lbl tiny strong" : "lbl tiny", "middle", 14)}`).join("")}
     ${label(30, 40, "leise", "lbl small", "start")}${label(x(105), 40, "sehr laut", "lbl small", "end")}`,
  );
};

export const sinnesschutz = (): string =>
  cardGrid(
    "Maßnahmen zum Schutz von Ohr, Auge und Haut vor schädlichen Umwelteinflüssen",
    [
      { head: "Gehörschutz", body: "Ohrstöpsel bei Konzerten,\nAbstand zu Lautsprechern,\nKopfhörer leiser stellen", colour: C.purple, icon: "🎧" },
      { head: "Ruhepausen", body: "Nach Lärm braucht das\nOhr Erholung in\nruhiger Umgebung.", colour: C.blue, icon: "🤫" },
      { head: "UV-Schutz Auge", body: "Sonnenbrille mit UV-Schutz,\nnie direkt in die\nSonne schauen", colour: C.orange, icon: "🕶" },
      { head: "UV-Schutz Haut", body: "Schatten, Kleidung,\nKopfbedeckung und\nSonnencreme", colour: C.red, icon: "🧴" },
    ],
    4,
    680,
  );

/* ---------- Skelett und Bewegung ---------- */

export const skelett = (): string => {
  const b = (x1: number, y1: number, x2: number, y2: number, w = 8) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${bone}" stroke-width="${w}" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--f-line)" stroke-width="1"/>`;
  const tag = (x: number, y: number, tx: number, t: string) =>
    `<line x1="${x}" y1="${y}" x2="${tx > x ? tx - 4 : tx + 4}" y2="${y}" stroke="var(--f-ink)" opacity="0.55"/>${label(tx, y + 4, t, "lbl tiny", tx > x ? "start" : "end")}`;
  return svg(
    600,
    360,
    "Das menschliche Skelett mit Schädel, Wirbelsäule, Brustkorb, Schulter- und Beckengürtel sowie Armen und Beinen",
    `${panel(8, 8, 584, 344, "panel-bg")}
     <ellipse cx="300" cy="44" rx="24" ry="28" fill="${bone}" stroke="var(--f-line)"/>
     ${Array.from({ length: 16 }, (_, i) => `<rect x="${f1(295 + Math.sin(i / 2.5) * 3)}" y="${76 + i * 9}" width="10" height="7" rx="2" fill="${bone}" stroke="var(--f-line)" stroke-width="0.6"/>`).join("")}
     ${Array.from({ length: 6 }, (_, i) => `<path d="M300 ${96 + i * 10} Q${262 - i} ${104 + i * 10} ${270} ${120 + i * 11} M300 ${96 + i * 10} Q${338 + i} ${104 + i * 10} ${330} ${120 + i * 11}" fill="none" stroke="${bone}" stroke-width="5"/>`).join("")}
     ${b(258, 88, 342, 88, 6)}
     <path d="M266 226 Q300 206 334 226 L326 250 Q300 260 274 250 Z" fill="${bone}" stroke="var(--f-line)"/>
     ${b(256, 92, 240, 160)}${b(240, 160, 230, 222)}${b(344, 92, 360, 160)}${b(360, 160, 370, 222)}
     ${b(282, 254, 276, 332, 10)}${b(318, 254, 324, 332, 10)}
     ${tag(324, 44, 420, "Schädel: schützt das Gehirn")}
     ${tag(342, 88, 420, "Schultergürtel")}
     ${tag(334, 120, 420, "Brustkorb: schützt Herz und Lunge")}
     ${tag(305, 170, 420, "Wirbelsäule: stützt den Körper")}
     ${tag(334, 236, 420, "Becken: trägt die Eingeweide")}
     ${tag(244, 160, 180, "Oberarmknochen")}
     ${tag(234, 200, 180, "Elle und Speiche")}
     ${tag(279, 300, 180, "Oberschenkelknochen")}
     ${labels(30, 320, "Stütze · Schutz · Bewegung", "lbl small strong", "start", 16)}`,
  );
};

export const wirbelsaeule = (): string => {
  const pts = Array.from({ length: 22 }, (_, i) => {
    const t = i / 21;
    const x = 120 + 26 * Math.sin(t * Math.PI * 2.1 + 0.3);
    return [x, 24 + i * 12] as const;
  });
  return svg(
    600,
    300,
    "Doppelt S-förmige Wirbelsäule von der Seite mit Wirbeln und Bandscheiben, die Stöße federnd abfangen",
    `${panel(8, 8, 240, 284, "panel-bg")}
     ${pts.map(([x, y], i) => `<rect x="${f1(x - 13)}" y="${y}" width="26" height="8" rx="2" fill="${bone}" stroke="var(--f-line)"/>${i < 21 ? `<rect x="${f1(x - 11)}" y="${y + 8}" width="22" height="4" rx="2" fill="var(--f-sky)"/>` : ""}`).join("")}
     ${label(200, 60, "Hals", "lbl tiny", "start")}${label(200, 120, "Brust", "lbl tiny", "start")}${label(200, 200, "Lende", "lbl tiny", "start")}${label(200, 270, "Kreuzbein", "lbl tiny", "start")}
     ${panel(256, 8, 336, 284, "panel-bg")}
     <rect x="280" y="50" width="80" height="34" rx="6" fill="${bone}" stroke="var(--f-line)"/>
     <rect x="284" y="86" width="72" height="14" rx="6" fill="var(--f-sky)" stroke="var(--f-river)"/>
     <rect x="280" y="102" width="80" height="34" rx="6" fill="${bone}" stroke="var(--f-line)"/>
     ${label(372, 72, "Wirbelkörper", "lbl tiny", "start")}
     ${label(372, 98, "Bandscheibe", "lbl tiny strong", "start")}
     ${labels(272, 170, "Die Bandscheiben sind elastische\nPolster zwischen den Wirbeln.\nSie federn Stöße ab und machen\ndie Wirbelsäule beweglich.\nDie Doppel-S-Form federt wie\neine Feder beim Gehen und Springen.", "lbl tiny", "start", 17)}`,
  );
};

export const gelenkBau = (): string =>
  svg(
    600,
    260,
    "Bau eines Gelenks mit Gelenkkopf, Gelenkpfanne, Gelenkknorpel, Gelenkspalt mit Gelenkschmiere, Gelenkkapsel und Bändern",
    `${panel(8, 8, 584, 244, "panel-bg")}
     <path d="M180 20 L180 110 Q180 150 220 150 Q260 150 260 110 L260 20 Z" fill="${bone}" stroke="var(--f-line)" stroke-width="2"/>
     <path d="M184 112 Q184 146 220 146 Q256 146 256 112" fill="none" stroke="#9fd3e8" stroke-width="7"/>
     <path d="M160 240 L160 170 Q160 150 172 152 Q220 170 268 152 Q280 150 280 170 L280 240 Z" fill="${bone}" stroke="var(--f-line)" stroke-width="2"/>
     <path d="M170 160 Q220 178 270 160" fill="none" stroke="#9fd3e8" stroke-width="7"/>
     <path d="M170 156 Q220 170 270 156" fill="none" stroke="var(--f-yellow)" stroke-width="3" opacity="0.8"/>
     <path d="M168 90 Q140 150 156 200 M272 90 Q300 150 284 200" fill="none" stroke="var(--f-purple)" stroke-width="5"/>
     <path d="M176 70 L164 190 M264 70 L276 190" stroke="var(--f-orange)" stroke-width="3"/>
     ${[
       [220, 60, "Gelenkkopf", 50],
       [250, 136, "Gelenkknorpel (dämpft, glatt)", 100],
       [250, 160, "Gelenkspalt mit Gelenkschmiere", 150],
       [220, 210, "Gelenkpfanne", 200],
       [292, 150, "Gelenkkapsel", 250],
     ]
       .map(([x, y, t]) => `<line x1="${x}" y1="${y}" x2="330" y2="${y}" stroke="var(--f-ink)" opacity="0.55"/>${label(336, Number(y) + 4, String(t), "lbl tiny", "start")}`)
       .join("")}
     <line x1="166" y1="120" x2="120" y2="120" stroke="var(--f-ink)" opacity="0.55"/>${label(114, 124, "Bänder", "lbl tiny", "end")}`,
  );

export const gelenktypen = (): string => {
  const card = (x: number, title: string, drawing: string, where: string, how: string) =>
    `${panel(x, 8, 140, 220, "panel-bg")}${label(x + 70, 30, title, "lbl small strong", "middle")}${drawing}${labels(x + 70, 168, where, "lbl tiny strong", "middle", 14)}${labels(x + 70, 200, how, "lbl tiny", "middle", 14)}`;
  return svg(
    600,
    236,
    "Vier Gelenktypen am eigenen Körper: Kugelgelenk, Scharniergelenk, Sattelgelenk und Drehgelenk",
    `${card(8, "Kugelgelenk", `<circle cx="78" cy="90" r="22" fill="${bone}" stroke="var(--f-line)" stroke-width="2"/><path d="M48 110 Q78 140 108 110" fill="none" stroke="var(--f-line)" stroke-width="8"/><path d="M60 64 A30 30 0 1 1 96 64" fill="none" stroke="var(--f-orange)" stroke-width="2" stroke-dasharray="4 3"/>`, "Schulter, Hüfte", "in alle Richtungen\ndrehbar")}
     ${card(156, "Scharniergelenk", `<rect x="200" y="70" width="52" height="40" rx="18" fill="${bone}" stroke="var(--f-line)" stroke-width="2"/><path d="M196 116 L256 116" stroke="var(--f-line)" stroke-width="8"/><path d="M226 60 A40 40 0 0 1 266 100" fill="none" stroke="var(--f-orange)" stroke-width="2" stroke-dasharray="4 3"/>`, "Ellbogen, Finger", "beugen und strecken\nwie eine Tür")}
     ${card(304, "Sattelgelenk", `<path d="M344 90 Q374 70 404 90 L404 110 L344 110 Z" fill="${bone}" stroke="var(--f-line)" stroke-width="2"/><path d="M350 86 Q374 104 398 86" fill="none" stroke="var(--f-line)" stroke-width="7"/><path d="M340 70 L408 70 M374 52 L374 124" stroke="var(--f-orange)" stroke-width="2" stroke-dasharray="4 3"/>`, "Daumenwurzel", "in zwei\nRichtungen")}
     ${card(452, "Drehgelenk", `<rect x="510" y="58" width="24" height="70" rx="8" fill="${bone}" stroke="var(--f-line)" stroke-width="2"/><ellipse cx="522" cy="94" rx="40" ry="12" fill="none" stroke="var(--f-orange)" stroke-width="2" stroke-dasharray="4 3"/>`, "1. und 2. Halswirbel", "Kopf drehen\num eine Achse")}`,
  );
};

export const muskelModell = (): string =>
  compare(
    "Ein selbst gebautes Armmodell aus Pappe und Gummibändern im Vergleich mit dem echten Arm",
    {
      head: "Modell aus Pappe",
      colour: C.orange,
      points: [
        "zwei Pappstreifen mit Musterklammer",
        "zwei Gummibänder vorn und hinten",
        "Ziehen am vorderen Band: Arm beugt",
        "Ziehen am hinteren Band: Arm streckt",
      ],
    },
    {
      head: "Echter Arm",
      colour: C.red,
      points: [
        "Oberarm, Elle und Speiche, Ellbogen",
        "Bizeps vorn, Trizeps hinten",
        "Muskeln verkürzen sich aktiv",
        "Sehnen verbinden Muskeln mit Knochen",
      ],
    },
  );

export const bewegungGesund = (): string =>
  cardGrid(
    "Gesundheitsvorsorge für Knochen, Gelenke und Muskeln im Alltag und beim Sport",
    [
      { head: "Aufwärmen", body: "Muskeln und Gelenke\nvor dem Sport\nlangsam vorbereiten", colour: C.orange, icon: "🔥" },
      { head: "Schutzausrüstung", body: "Helm, Knie- und\nHandgelenkschoner\nbeim Fahren", colour: C.blue, icon: "⛑" },
      { head: "Richtig heben", body: "in die Knie gehen,\nRücken gerade,\nLast nah am Körper", colour: C.green, icon: "📦" },
      { head: "Schulranzen", body: "beide Gurte nutzen,\nnur Nötiges einpacken,\nnah am Rücken tragen", colour: C.purple, icon: "🎒" },
      { head: "Ernährung", body: "Milchprodukte und Gemüse\nliefern Calcium für die\nKnochen, Eiweiß für Muskeln", colour: C.red, icon: "🥛" },
      { head: "Bewegung", body: "Täglich aktiv sein:\nKnochen und Muskeln\nwerden kräftiger", colour: "var(--f-forest)", icon: "🏃" },
    ],
    3,
  );

/* ---------- Stoffwechsel ---------- */

export const energieBedarf = (): string =>
  cardGrid(
    "Wofür der Körper Energie braucht: Bewegung, Wachstum, Regeneration und Temperaturregulation",
    [
      { head: "Bewegung", body: "Muskeln arbeiten\nbeim Gehen, Sport,\nAtmen und Herzschlag", colour: C.green, icon: "🏃" },
      { head: "Wachstum", body: "neue Zellen für\nKnochen, Muskeln\nund Organe", colour: C.purple, icon: "📏" },
      { head: "Regeneration", body: "Wunden heilen,\nverbrauchte Zellen\nwerden ersetzt", colour: C.blue, icon: "🩹" },
      { head: "Körpertemperatur", body: "etwa 37 °C halten,\nauch wenn es\ndraußen kalt ist", colour: C.red, icon: "🌡" },
    ],
    4,
    680,
  );

export const zellatmungSchema = (): string =>
  svg(
    640,
    230,
    "Reaktionsschema der Zellatmung: Traubenzucker und Sauerstoff werden zu Kohlenstoffdioxid und Wasser, dabei wird Energie umgewandelt",
    `${panel(8, 8, 624, 214, "panel-bg")}
     ${label(320, 34, "Zellatmung in jeder Zelle", "lbl small strong", "middle")}
     <rect x="30" y="70" width="130" height="44" rx="10" fill="var(--f-yellow)" opacity="0.85"/>${label(95, 97, "Traubenzucker", "lbl small strong", "middle")}
     ${label(176, 98, "+", "lbl strong", "middle")}
     <rect x="192" y="70" width="110" height="44" rx="10" fill="var(--f-blue)" opacity="0.7"/>${label(247, 97, "Sauerstoff", "lbl small strong", "middle")}
     ${arrow(312, 92, 376, 92)}
     <rect x="386" y="70" width="150" height="44" rx="10" fill="var(--f-stone)" opacity="0.6"/>${label(461, 97, "Kohlenstoffdioxid", "lbl small strong", "middle")}
     ${label(550, 98, "+", "lbl strong", "middle")}
     <rect x="562" y="70" width="62" height="44" rx="10" fill="var(--f-river)" opacity="0.6"/>${label(593, 97, "Wasser", "lbl small strong", "middle")}
     ${label(166, 140, "Ausgangsstoffe", "lbl tiny muted", "middle")}${label(505, 140, "Endstoffe", "lbl tiny muted", "middle")}
     <path d="M344 100 L344 170" stroke="var(--f-orange)" stroke-width="5"/>${arrow(344, 150, 344, 182)}
     ${label(354, 176, "Energie für Bewegung, Wachstum und Wärme", "lbl small", "start")}
     ${labels(30, 172, "aus der Nahrung (Dünndarm)\naus der Atemluft (Lunge)", "lbl tiny", "start", 15)}
     ${labels(470, 206, "wird ausgeatmet", "lbl tiny", "middle", 15)}`,
  );

export const naehrstoffeTafel = (): string =>
  cardGrid(
    "Nahrungsbestandteile und ihre Bedeutung für den Körper",
    [
      { head: "Kohlenhydrate", body: "Brot, Nudeln, Kartoffeln:\nwichtigste Energiequelle\n1 g ≈ 17 kJ", colour: "#c79a00", icon: "🍞" },
      { head: "Fette", body: "Öl, Butter, Nüsse:\nviel Energie, Energiespeicher\n1 g ≈ 37 kJ", colour: C.orange, icon: "🥜" },
      { head: "Eiweiße", body: "Milch, Hülsenfrüchte, Fisch:\nBaustoff für Muskeln\n1 g ≈ 17 kJ", colour: C.red, icon: "🥚" },
      { head: "Vitamine, Mineralstoffe", body: "Obst, Gemüse, Milch:\nfür Knochen, Blut und\nAbwehr, kaum Energie", colour: C.green, icon: "🍎" },
      { head: "Ballaststoffe", body: "Vollkorn, Gemüse:\nunverdaulich, halten\ndie Verdauung in Gang", colour: "var(--f-forest)", icon: "🥦" },
      { head: "Wasser", body: "Lösungs- und Transport-\nmittel, kühlt den Körper\nkeine Energie", colour: C.blue, icon: "💧" },
    ],
    3,
  );

export const ernaehrungspyramide = (): string => {
  const levels: Array<[string, string]> = [
    ["Süßes, Knabbereien", "#e53935"],
    ["Fette und Öle", "#fb8c00"],
    ["Milch, Fleisch, Fisch, Ei", "#fdd835"],
    ["Brot, Getreide, Kartoffeln", "#9ccc65"],
    ["Gemüse und Obst", "#43a047"],
    ["Getränke: Wasser, Tee", "#42a5f5"],
  ];
  return svg(
    600,
    270,
    "Vereinfachte Ernährungspyramide: unten reichlich Getränke, Gemüse, Obst und Getreide, oben sparsam Fette und Süßes",
    `${levels
      .map(([t, colour], i) => {
        const row = levels.length - 1 - i;
        const y = 20 + i * 38;
        const half = 30 + row * 40;
        return `<path d="M${300 - half} ${y + 36} L${300 + half} ${y + 36} L${300 + half - 36} ${y} L${300 - half + 36} ${y} Z" fill="${colour}" opacity="0.85"/>${label(300, y + 23, t, "lbl small strong", "middle")}`;
      })
      .join("")}
     ${label(560, 40, "sparsam", "lbl small strong", "end")}${label(560, 140, "mäßig", "lbl small strong", "end")}${label(560, 240, "reichlich", "lbl small strong", "end")}`,
  );
};

export const verdauungssystem = (): string =>
  svg(
    600,
    360,
    "Verdauungssystem des Menschen: Mund, Speiseröhre, Magen, Leber, Bauchspeicheldrüse, Dünndarm, Dickdarm und After",
    `${panel(8, 8, 584, 344, "panel-bg")}
     <path d="M230 20 Q300 0 370 20 L380 120 Q420 140 420 220 Q420 330 300 340 Q180 330 180 220 Q180 140 220 120 Z" fill="var(--f-skin)" opacity="0.35" stroke="var(--f-line)"/>
     <ellipse cx="300" cy="46" rx="22" ry="10" fill="#e57373"/>
     <path d="M300 56 L300 136" stroke="#e57373" stroke-width="9"/>
     <path d="M296 136 Q330 128 352 150 Q362 186 320 190 Q298 190 290 172" fill="#ef9a9a" stroke="#b5544a" stroke-width="2"/>
     <path d="M232 150 Q262 132 296 146 L292 176 Q252 186 232 170 Z" fill="#8d6e63"/>
     <rect x="300" y="190" width="58" height="12" rx="6" fill="#ffcc80"/>
     <path d="M246 220 L246 310 L356 310 L356 220 Z" fill="none" stroke="#a1887f" stroke-width="12" stroke-linejoin="round"/>
     <path d="M270 222 q14 12 28 0 q14 -12 28 0 q14 12 28 0 M268 246 q14 12 28 0 q14 -12 28 0 q14 12 28 0 M268 270 q14 12 28 0 q14 -12 28 0 q14 12 28 0 M268 294 q14 -12 28 0 q14 12 28 0" fill="none" stroke="#f48fb1" stroke-width="7"/>
     <path d="M300 316 L300 340" stroke="#a1887f" stroke-width="8"/>
     ${[
       [322, 46, "Mund: zerkleinern, Speichel", 40],
       [306, 100, "Speiseröhre", 90],
       [358, 160, "Magen: Magensaft, kneten", 150],
       [356, 196, "Bauchspeicheldrüse", 190],
       [356, 272, "Dünndarm: zerlegen, ins Blut aufnehmen", 270],
       [358, 228, "Dickdarm: Wasser zurückholen", 230],
       [306, 336, "After", 330],
     ]
       .map(([x, y, t, ly]) => `<line x1="${x}" y1="${y}" x2="430" y2="${ly}" stroke="var(--f-ink)" opacity="0.55"/>${label(436, Number(ly) + 4, String(t), "lbl tiny", "start")}`)
       .join("")}
     <line x1="240" y1="160" x2="170" y2="160" stroke="var(--f-ink)" opacity="0.55"/>${label(164, 164, "Leber: Gallensaft", "lbl tiny", "end")}`,
  );

export const verdauungPrinzip = (): string =>
  svg(
    600,
    220,
    "Grundprinzip der Verdauung: große Nährstoffteilchen werden in kleine Bausteine zerlegt, die durch die Darmwand ins Blut gelangen",
    `${panel(8, 8, 584, 204, "panel-bg")}
     ${label(110, 34, "große Nährstoffteilchen", "lbl small strong", "middle")}
     ${Array.from({ length: 8 }, (_, i) => `<circle cx="${50 + i * 17}" cy="70" r="8" fill="var(--f-yellow)" stroke="var(--f-ink)"/>`).join("")}
     ${arrow(200, 70, 260, 70)}
     ${labels(230, 98, "Verdauungssäfte\nzerlegen", "lbl tiny", "middle", 14)}
     ${label(380, 34, "kleine Bausteine", "lbl small strong", "middle")}
     ${Array.from({ length: 8 }, (_, i) => `<circle cx="${300 + (i % 4) * 34}" cy="${60 + Math.floor(i / 4) * 24}" r="8" fill="var(--f-yellow)" stroke="var(--f-ink)"/>`).join("")}
     <rect x="290" y="130" width="160" height="12" fill="#f48fb1"/>${label(460, 140, "Darmwand", "lbl tiny", "start")}
     <rect x="290" y="168" width="160" height="26" rx="12" fill="var(--f-red)" opacity="0.75"/>${label(370, 186, "Blut", "lbl small on-dark", "middle")}
     ${arrow(334, 110, 334, 166)}${arrow(400, 110, 400, 166)}
     ${labels(30, 150, "Nur kleine Bausteine passen\ndurch die Darmwand.\nDas Blut verteilt sie\nim ganzen Körper.", "lbl tiny", "start", 15)}`,
  );

export const zottenLungenblaeschen = (): string =>
  svg(
    600,
    230,
    "Oberflächenvergrößerung im Körper: Darmzotten im Dünndarm und Lungenbläschen in der Lunge, beide von feinen Blutgefäßen umgeben",
    `${panel(8, 8, 288, 214, "panel-bg")}
     ${label(152, 30, "Dünndarmzotten", "lbl small strong", "middle")}
     ${Array.from({ length: 5 }, (_, i) => `<path d="M${40 + i * 48} 200 L${40 + i * 48} 90 Q${60 + i * 48} 60 ${80 + i * 48} 90 L${80 + i * 48} 200" fill="#f6c1b5" stroke="#b5544a" stroke-width="2"/><path d="M${52 + i * 48} 196 L${52 + i * 48} 98 Q${60 + i * 48} 84 ${68 + i * 48} 98 L${68 + i * 48} 196" fill="none" stroke="var(--f-red)" stroke-width="2"/>`).join("")}
     ${labels(152, 52, "fingerförmige Ausstülpungen\nmit feinen Blutgefäßen", "lbl tiny", "middle", 13)}
     ${panel(304, 8, 288, 214, "panel-bg")}
     ${label(448, 30, "Lungenbläschen", "lbl small strong", "middle")}
     <path d="M448 40 L448 90" stroke="#b5544a" stroke-width="10"/>
     ${Array.from({ length: 9 }, (_, i) => `<circle cx="${408 + (i % 3) * 40}" cy="${116 + Math.floor(i / 3) * 34}" r="20" fill="#f6c1b5" stroke="#b5544a" stroke-width="2"/>`).join("")}
     <path d="M388 196 Q448 120 508 196" fill="none" stroke="var(--f-red)" stroke-width="2"/>
     <path d="M388 110 Q448 200 508 110" fill="none" stroke="${C.vein}" stroke-width="2"/>
     ${labels(448, 214, "dünnwandige Bläschen, umsponnen von Kapillaren", "lbl tiny", "middle", 13)}`,
  );

export const atmungsorgane = (): string =>
  svg(
    600,
    300,
    "Atmungsorgane des Menschen: Nase und Mund, Luftröhre, Bronchien, Lungenflügel mit Lungenbläschen und Zwerchfell",
    `${panel(8, 8, 584, 284, "panel-bg")}
     <path d="M296 30 L296 110" stroke="#b0bec5" stroke-width="16"/>
     ${Array.from({ length: 6 }, (_, i) => `<line x1="288" y1="${38 + i * 12}" x2="304" y2="${38 + i * 12}" stroke="var(--f-line)"/>`).join("")}
     <path d="M296 110 L250 150 M296 110 L342 150" stroke="#b0bec5" stroke-width="10"/>
     <path d="M244 120 Q190 140 186 230 Q200 260 270 252 Q284 190 272 132 Z" fill="#f6c1b5" stroke="#b5544a" stroke-width="2"/>
     <path d="M348 120 Q402 140 406 230 Q392 260 322 252 Q308 190 320 132 Z" fill="#f6c1b5" stroke="#b5544a" stroke-width="2"/>
     <path d="M250 150 L226 190 M250 150 L250 210 M342 150 L366 190 M342 150 L342 210" stroke="#b5544a" stroke-width="3"/>
     <path d="M180 262 Q296 230 412 262" fill="none" stroke="var(--f-orange)" stroke-width="6"/>
     ${[
       [304, 40, "Luftröhre (Knorpelringe)", 40],
       [342, 150, "Bronchien", 120],
       [400, 200, "Lungenflügel mit vielen Lungenbläschen", 200],
       [410, 258, "Zwerchfell", 260],
     ]
       .map(([x, y, t, ly]) => `<line x1="${x}" y1="${y}" x2="440" y2="${ly}" stroke="var(--f-ink)" opacity="0.55"/>${label(446, Number(ly) + 4, String(t), "lbl tiny", "start")}`)
       .join("")}
     ${labels(30, 40, "Einatmen:\nNase wärmt, befeuchtet\nund reinigt die Luft.", "lbl tiny", "start", 15)}`,
  );

export const gasaustausch = (): string =>
  svg(
    600,
    250,
    "Gasaustausch zwischen Lungenbläschen und Blut sowie zwischen Blut und Körperzellen; Zusammensetzung von eingeatmeter und ausgeatmeter Luft",
    `${panel(8, 8, 300, 234, "panel-bg")}
     <circle cx="120" cy="120" r="70" fill="#fde0dc" stroke="#b5544a" stroke-width="3"/>
     ${label(120, 124, "Lungenbläschen", "lbl small strong", "middle")}
     <path d="M200 40 Q230 120 200 200" fill="none" stroke="var(--f-red)" stroke-width="16" opacity="0.7"/>
     ${label(250, 220, "Kapillare", "lbl tiny", "middle")}
     ${arrow(160, 90, 205, 90)}${label(160, 80, "Sauerstoff", "lbl tiny strong", "start")}
     ${arrow(205, 160, 160, 160)}${label(160, 180, "Kohlenstoffdioxid", "lbl tiny strong", "start")}
     ${panel(316, 8, 276, 234, "panel-bg")}
     ${label(454, 32, "Atemluft (ungefähre Anteile)", "lbl small strong", "middle")}
     ${label(470, 60, "eingeatmet", "lbl tiny strong", "middle")}${label(556, 60, "ausgeatmet", "lbl tiny strong", "middle")}
     ${label(330, 86, "Sauerstoff", "lbl tiny", "start")}${label(470, 86, "21 %", "lbl tiny", "middle")}${label(556, 86, "etwa 16 %", "lbl tiny", "middle")}
     ${label(330, 110, "Kohlenstoffdioxid", "lbl tiny", "start")}${label(470, 110, "0,04 %", "lbl tiny", "middle")}${label(556, 110, "etwa 4 %", "lbl tiny", "middle")}
     ${labels(330, 150, "In den Körperzellen läuft es umgekehrt:\nDas Blut gibt Sauerstoff ab und\nnimmt Kohlenstoffdioxid auf.", "lbl tiny", "start", 15)}`,
  );

export const kreislaufSchema = (): string =>
  svg(
    600,
    340,
    "Doppelter Blutkreislauf: Das Herz pumpt Blut durch den Lungenkreislauf und den Körperkreislauf; Arterien führen vom Herzen weg, Venen zum Herzen hin",
    `${panel(8, 8, 584, 324, "panel-bg")}
     <rect x="200" y="30" width="200" height="50" rx="16" fill="#f6c1b5" stroke="#b5544a"/>${label(300, 60, "Lunge (Kapillaren)", "lbl small strong", "middle")}
     <rect x="200" y="260" width="200" height="50" rx="16" fill="#ffe0b2" stroke="#ef6c00"/>${label(300, 290, "Körper (Kapillaren)", "lbl small strong", "middle")}
     <path d="M260 150 Q300 128 340 150 Q340 196 300 206 Q260 196 260 150 Z" fill="var(--f-red)" opacity="0.9"/>
     <line x1="300" y1="140" x2="300" y2="204" stroke="var(--f-white)" stroke-width="3"/>
     ${label(300, 228, "Herz", "lbl small strong", "middle")}
     ${label(278, 176, "rechts", "lbl tiny on-dark", "middle")}${label(322, 176, "links", "lbl tiny on-dark", "middle")}
     <path d="M270 150 Q200 120 230 82" fill="none" stroke="${C.vein}" stroke-width="7"/>${arrow(232, 92, 230, 80)}
     <path d="M370 82 Q400 120 330 150" fill="none" stroke="var(--f-red)" stroke-width="7"/>
     <path d="M330 200 Q420 230 370 260" fill="none" stroke="var(--f-red)" stroke-width="7"/>${arrow(378, 250, 370, 262)}
     <path d="M230 260 Q180 230 270 200" fill="none" stroke="${C.vein}" stroke-width="7"/>
     ${labels(30, 110, "Lungenkreislauf:\nBlut holt Sauerstoff\nund gibt CO₂ ab", "lbl tiny", "start", 15)}
     ${labels(30, 250, "Körperkreislauf:\nBlut bringt Sauerstoff\nund Nährstoffe zu den Zellen", "lbl tiny", "start", 15)}
     <line x1="440" y1="120" x2="470" y2="120" stroke="var(--f-red)" stroke-width="7"/>${label(478, 124, "Arterie: vom Herzen weg", "lbl tiny", "start")}
     <line x1="440" y1="150" x2="470" y2="150" stroke="${C.vein}" stroke-width="7"/>${label(478, 154, "Vene: zum Herzen hin", "lbl tiny", "start")}
     <line x1="440" y1="180" x2="470" y2="180" stroke="#b5544a" stroke-width="2"/>${label(478, 184, "Kapillare: Austausch", "lbl tiny", "start")}
     ${labels(440, 214, "rot = sauerstoffreich\nblau = sauerstoffarm", "lbl tiny muted", "start", 14)}`,
  );

export const wochenBewegung = (): string => {
  const days: Array<[string, number]> = [
    ["Mo", 45], ["Di", 70], ["Mi", 30], ["Do", 90], ["Fr", 40], ["Sa", 120], ["So", 60],
  ];
  return svg(
    600,
    230,
    "Beispiel eines Bewegungsprotokolls über eine Woche mit Minuten aktiver Bewegung pro Tag und der Marke von 60 Minuten",
    `${panel(8, 8, 584, 214, "panel-bg")}
     <line x1="60" y1="190" x2="560" y2="190" stroke="var(--f-ink)"/>
     ${days.map(([d, m], i) => `<rect x="${80 + i * 68}" y="${f1(190 - m)}" width="40" height="${m}" rx="4" fill="${m >= 60 ? C.green : C.orange}"/>${label(100 + i * 68, 206, d, "lbl tiny", "middle")}${label(100 + i * 68, 184 - m, `${m}`, "lbl tiny", "middle")}`).join("")}
     <line x1="60" y1="130" x2="560" y2="130" stroke="var(--f-red)" stroke-dasharray="6 4" stroke-width="2"/>
     ${label(64, 124, "Empfehlung der WHO: im Schnitt 60 Minuten am Tag", "lbl tiny strong", "start")}
     ${label(560, 30, "Beispielwoche (Minuten)", "lbl tiny muted", "end")}`,
  );
};

export const rauchenLunge = (): string =>
  compare(
    "Folgen des Rauchens für Atemwege und Körper sowie die Ursachen der Abhängigkeit",
    {
      head: "Was Rauch schädigt",
      colour: C.stone,
      points: [
        "Teer lagert sich in der Lunge ab",
        "Flimmerhärchen werden gelähmt: Husten",
        "Kohlenmonoxid verdrängt Sauerstoff im Blut",
        "Atemwege entzünden sich, Kondition sinkt",
        "Risiko für Lungenkrebs und Herzinfarkt",
      ],
    },
    {
      head: "Warum man abhängig wird",
      colour: C.red,
      points: [
        "Nikotin wirkt schnell im Gehirn",
        "Körper gewöhnt sich, will mehr",
        "Rauchen wird zur Gewohnheit",
        "ohne Zigarette: Unruhe, Gereiztheit",
        "am besten gar nicht erst anfangen",
      ],
    },
  );

/* ---------- Fortpflanzung und Pubertät ---------- */

export const weiblicheOrgane = (): string =>
  svg(
    600,
    260,
    "Schema der weiblichen Geschlechtsorgane von vorn: Eierstöcke, Eileiter, Gebärmutter und Scheide",
    `${panel(8, 8, 584, 244, "panel-bg")}
     <path d="M250 70 Q300 56 350 70 L338 150 Q300 176 262 150 Z" fill="#f9d3d0" stroke="#b5544a" stroke-width="2"/>
     <path d="M286 164 L286 226 L314 226 L314 164" fill="#f9d3d0" stroke="#b5544a" stroke-width="2"/>
     <path d="M250 76 Q206 64 186 96" fill="none" stroke="#b5544a" stroke-width="7" stroke-linecap="round"/>
     <path d="M350 76 Q394 64 414 96" fill="none" stroke="#b5544a" stroke-width="7" stroke-linecap="round"/>
     <ellipse cx="190" cy="118" rx="20" ry="13" fill="#f3c6a5" stroke="#b5544a"/>
     <ellipse cx="410" cy="118" rx="20" ry="13" fill="#f3c6a5" stroke="#b5544a"/>
     ${[
       [190, 130, "Eierstock: Eizellen reifen", 170, "end", 150],
       [214, 70, "Eileiter: Ort der Befruchtung", 50, "end", 160],
       [340, 110, "Gebärmutter: hier wächst ein Kind heran", 110, "start", 440],
       [314, 210, "Scheide: verbindet mit außen", 210, "start", 440],
     ]
       .map(([x, y, t, ly, anchor, tx]) => `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ly}" stroke="var(--f-ink)" opacity="0.55"/>${label(Number(tx) + (anchor === "end" ? -4 : 4), Number(ly) + 4, String(t), "lbl tiny", anchor as "start" | "end")}`)
       .join("")}`,
  );

export const maennlicheOrgane = (): string =>
  chain(
    "Weg der Spermienzellen durch die männlichen Geschlechtsorgane: Hoden, Nebenhoden, Spermienleiter, Drüsen, Harn-Spermien-Röhre im Penis",
    [
      { head: "Hoden", body: "im Hodensack: Spermien-\nzellen entstehen, ab der\nPubertät ständig neu", colour: C.blue },
      { head: "Nebenhoden", body: "Spermienzellen reifen\nund werden gespeichert", colour: C.purple },
      { head: "Spermienleiter", body: "leitet sie beim\nSamenerguss weiter", colour: C.orange },
      { head: "Drüsen", body: "Bläschendrüse und\nVorsteherdrüse geben\nFlüssigkeit dazu: Sperma", colour: C.green },
      { head: "Penis", body: "Harn-Spermien-Röhre:\nführt Urin oder Sperma\nnach außen", colour: C.red },
    ],
    5,
    760,
  );

export const keimzellen = (): string =>
  svg(
    600,
    210,
    "Eizelle und Spermienzelle im Größenvergleich: Die Eizelle ist rund und viel größer, die Spermienzelle hat einen Kopf und einen Schwanz",
    `${panel(8, 8, 300, 194, "panel-bg")}
     <circle cx="120" cy="100" r="66" fill="#fff3c4" stroke="#c9a227" stroke-width="3"/>
     <circle cx="120" cy="100" r="18" fill="#b39ddb"/>
     ${labels(250, 70, "Eizelle\netwa 0,1 mm\nunbeweglich,\nmit Vorrat", "lbl tiny", "middle", 14)}
     ${panel(316, 8, 276, 194, "panel-bg")}
     <ellipse cx="380" cy="100" rx="10" ry="7" fill="#b39ddb" stroke="var(--f-ink)"/>
     <path d="M390 100 Q420 90 440 100 T490 100 T540 100" fill="none" stroke="var(--f-ink)" stroke-width="2"/>
     ${labels(454, 150, "Spermienzelle\nviel kleiner, bewegt\nsich mit dem Schwanz", "lbl tiny", "middle", 14)}
     ${label(380, 80, "Kopf mit Zellkern", "lbl tiny", "middle")}`,
  );

export const pubertaet = (): string =>
  cardGrid(
    "Veränderungen in der Pubertät bei Mädchen, bei Jungen und bei allen",
    [
      { head: "Bei Mädchen", body: "Brüste wachsen, Becken\nwird breiter, erste\nMenstruation", colour: C.pink, icon: "♀" },
      { head: "Bei allen", body: "Wachstumsschub, Haare\nunter den Achseln und im\nSchambereich, mehr Schweiß", colour: C.purple, icon: "⚥" },
      { head: "Bei Jungen", body: "Stimmbruch, Bartwuchs,\nHoden und Penis wachsen,\nerster Samenerguss", colour: C.blue, icon: "♂" },
      { head: "Gefühle", body: "Stimmungen wechseln,\neigene Meinung wird\nwichtiger, Verliebtsein", colour: C.orange, icon: "💭" },
      { head: "Zeitpunkt", body: "bei jedem anders,\nbei Mädchen oft früher:\nalles ist normal", colour: C.green, icon: "⏱" },
      { head: "Pflege", body: "täglich waschen, frische\nWäsche, Binden oder\nTampons wechseln", colour: C.stone, icon: "🧼" },
    ],
    3,
  );

export const naeheZonen = (): string =>
  svg(
    600,
    260,
    "Individualdistanz: ein innerer Bereich nur für sehr vertraute Menschen, ein mittlerer für Freunde und ein äußerer für Fremde",
    `${panel(8, 8, 584, 244, "panel-bg")}
     <circle cx="200" cy="130" r="110" fill="var(--f-sky)" opacity="0.45"/>
     <circle cx="200" cy="130" r="72" fill="var(--f-green)" opacity="0.35"/>
     <circle cx="200" cy="130" r="36" fill="var(--f-pink)" opacity="0.6"/>
     <circle cx="200" cy="120" r="9" fill="var(--f-skin)"/><rect x="192" y="130" width="16" height="22" rx="6" fill="var(--f-purple)"/>
     ${labels(360, 60, "Innerer Bereich:\nnur sehr vertraute Menschen,\nund nur, wenn du es willst", "lbl tiny", "start", 15)}
     ${labels(360, 130, "Mittlerer Bereich:\nFreundinnen und Freunde", "lbl tiny", "start", 15)}
     ${labels(360, 190, "Äußerer Bereich:\nfremde Menschen", "lbl tiny", "start", 15)}
     ${label(200, 250, "Du bestimmst, wer dir nahekommt.", "lbl small strong", "middle")}`,
  );

export const hilfeWege = (): string =>
  chain(
    "Was du tun kannst, wenn sich eine Berührung oder Situation falsch anfühlt",
    [
      { head: "Gefühl ernst nehmen", body: "Ein komisches Gefühl\nist ein wichtiges\nWarnsignal.", colour: C.orange },
      { head: "Nein sagen", body: "laut und deutlich:\n„Nein! Hör auf!“", colour: C.red },
      { head: "Weggehen", body: "Abstand schaffen,\ndorthin, wo andere\nMenschen sind", colour: C.purple },
      { head: "Hilfe holen", body: "Vertrauensperson oder\nNummer gegen Kummer\n116 111 (kostenlos)", colour: C.green },
    ],
    4,
    700,
  );
