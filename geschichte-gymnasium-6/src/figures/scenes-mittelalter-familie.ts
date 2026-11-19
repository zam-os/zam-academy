/**
 * Figures for LB 6 (Von der Antike zum Mittelalter) and LB 7 (Leben in der Familie),
 * plus the Lernpfad hero panorama and the Nachschlagen full timeline.
 */
import {
  arrow,
  badgePill,
  cardGrid,
  column,
  crown,
  label,
  labels,
  panel,
  person,
  pyramidShape,
  svg,
} from "./draw";

/* ---------- LB 6: Von der Antike zum Mittelalter ---------- */

export function voelkerwanderungAnfuehrungszeichen(): string {
  return svg(
    640,
    240,
    "Warum „Völkerwanderung“ in Anführungszeichen steht: gemischte Kriegergruppen und Verbände statt geschlossener Urvölker und Vergleich mit Migration heute",
    `${panel(8, 8, 624, 224, "panel-bg")}
     ${label(320, 34, "Warum steht „Völkerwanderung“ (4.–6. Jh.) oft in Anführungszeichen?", "lbl small strong")}
     ${panel(24, 52, 286, 162, "panel-bg")}
     <rect x="24" y="52" width="286" height="30" rx="10" fill="#9e2a2b"/>
     ${label(38, 72, "Altes Bild (zu einfach)", "lbl tiny on-dark strong", "start")}
     ${labels(38, 102, "• Früher stellte man sich feste,\n  reine Urvölker vor, die plötzlich\n  als ganze Stämme loszogen.\n• Einseitiger Fokus nur auf\n  Zerstörung und Einbruch.\n• Blendet Verträge und Handel aus.", "lbl tiny", "start", 16)}
     ${panel(330, 52, 286, 162, "panel-bg")}
     <rect x="330" y="52" width="286" height="30" rx="10" fill="#1e6b4f"/>
     ${label(344, 72, "Heutige Forschung", "lbl tiny on-dark strong", "start")}
     ${labels(344, 102, "• Es zogen oft gemischte Gruppen,\n  Gefolgschaften und Familien.\n• Gründe: Klimawandel, Hunnen-Druck,\n  Hoffnung auf Land, Sold & Schutz.\n• Viele dienten als Verbündete\n  (Föderaten) im römischen Heer.", "lbl tiny", "start", 16)}`,
  );
}

export function dreiteilungMittelmeer(): string {
  return cardGrid(
    "Dreiteilung der Mittelmeerwelt nach der Antike: Byzanz, islamische Reiche und das lateinisch-christliche Frankenreich",
    [
      {
        head: "1. Oströmisches Reich (Byzanz)",
        body: "Hauptstadt Konstantinopel;\nbewahrt römisches Recht, griechische\nSprache und christliches Kaisertum.",
        colour: "#73357a",
        icon: "⛪",
      },
      {
        head: "2. Islamische Welt (ab 7. Jh.)",
        body: "Von Arabien über Nordafrika bis\nSpanien; blühende Städte, Handel,\nWissenschaft (z. B. Medizin & Optik).",
        colour: "#1e6b4f",
        icon: "🕌",
      },
      {
        head: "3. Frankenreich (Westeuropa)",
        body: "Seit um 500 unter den Franken;\nverbindet germanische, römische\nund christliche Traditionen bis 800.",
        colour: "#a16c0e",
        icon: "👑",
      },
    ],
    3,
    640,
  );
}

export function islamGrundlagen(): string {
  return svg(
    640,
    240,
    "Die fünf Säulen des Islam und die rasche Ausbreitung ab dem 7. Jahrhundert mit Wissensaustausch am Mittelmeer",
    `${panel(8, 8, 624, 224, "panel-bg")}
     ${label(320, 34, "Islam als neue Weltreligion und Kulturkraft ab dem 7. Jahrhundert", "lbl small strong")}
     ${[
       { x: 24, n: "1. Bekenntnis", desc: "Ein Gott (Allah),\nMohammed als\nsein Prophet" },
       { x: 144, n: "2. Gebet", desc: "Fünfmal täglich\nin Richtung\nMekka" },
       { x: 264, n: "3. Almosen", desc: "Abgabe für\nBedürftige und\nGemeinschaft" },
       { x: 384, n: "4. Fasten", desc: "Verzicht auf\nSpeise & Trank\nim Ramadan" },
       { x: 504, n: "5. Pilgerfahrt", desc: "Einmal im\nLeben nach\nMekka" },
     ]
       .map(
         (p) => `<rect x="${p.x}" y="54" width="110" height="106" rx="10" fill="var(--surface)" stroke="#1e6b4f" stroke-width="2"/>
           <rect x="${p.x}" y="54" width="110" height="28" rx="8" fill="#1e6b4f"/>
           ${label(p.x + 55, 73, p.n, "lbl tiny on-dark strong")}
           ${labels(p.x + 55, 102, p.desc, "lbl tiny", "middle", 16)}`,
       )
       .join("")}
     ${labels(320, 186, "Nach dem Tod des Propheten Mohammed (632) entstand ein großes Kalifenreich mit Zentren in Damaskus, Bagdad und Córdoba.\nGelehrte bewahrten antike Schriften und gaben indisch-arabische Ziffern, Papier und Medizin nach Europa weiter.", "lbl tiny strong", "middle", 16)}`,
  );
}

export function dreiWurzelnFranken(): string {
  return svg(
    640,
    240,
    "Die Verbindung germanischer, römischer und christlicher Traditionen bei der Reichsbildung der Franken um 500",
    `${panel(8, 8, 624, 224, "panel-bg")}
     ${panel(24, 28, 178, 126, "panel-bg")}
     <rect x="24" y="28" width="178" height="28" rx="8" fill="#9a4b1f"/>
     ${label(113, 47, "Germanische Tradition", "lbl tiny on-dark strong")}
     ${labels(113, 76, "• Gefolgschaft & Treue\n• Reisekönigtum (Pfalzen)\n• mündliche Rechtsbräuche\n• fränkische Kriegerelite", "lbl tiny", "middle", 16)}
     ${panel(231, 28, 178, 126, "panel-bg")}
     <rect x="231" y="28" width="178" height="28" rx="8" fill="#9e2a2b"/>
     ${label(320, 47, "Römische Tradition", "lbl tiny on-dark strong")}
     ${labels(320, 76, "• Latein als Schriftsprache\n• Städte & Straßennetz\n• Vorbild des Kaisertums\n• geschriebene Gesetze", "lbl tiny", "middle", 16)}
     ${panel(438, 28, 178, 126, "panel-bg")}
     <rect x="438" y="28" width="178" height="28" rx="8" fill="#1e6b4f"/>
     ${label(527, 47, "Christliche Tradition", "lbl tiny on-dark strong")}
     ${labels(527, 76, "• Taufe Chlodwigs (um 500)\n• Zusammenarbeit mit\n  Bischöfen und Papst\n• Klöster als Schulzentren", "lbl tiny", "middle", 16)}
     ${arrow(113, 156, 268, 186)}
     ${arrow(320, 156, 320, 180)}
     ${arrow(527, 156, 372, 186)}
     ${badgePill(320, 198, 390, "Ergebnis: Das Frankenreich verbindet Kontinuität und Neuanfang", "var(--accent)")}`,
  );
}

export function epochengrenzenKandidaten(): string {
  return svg(
    640,
    240,
    "Warum Epochengrenzen zwischen Antike und Mittelalter an mehreren historischen Ereignissen festgemacht werden: 395, 476, 500, 632 und 800",
    `${panel(8, 8, 624, 224, "panel-bg")}
     ${label(320, 34, "Wann endete die Antike – und wann begann das Mittelalter?", "lbl small strong")}
     <line class="axis" x1="36" y1="92" x2="604" y2="92"/>
     ${[
       { x: 76, year: "395 n. Chr.", title: "Reichsteilung\nWest / Ost", c: "#73357a" },
       { x: 196, year: "476 n. Chr.", title: "Ende des\nWestkaisers", c: "#9e2a2b" },
       { x: 316, year: "um 500", title: "Reichsbildung\nder Franken", c: "#a16c0e" },
       { x: 436, year: "ab 632", title: "Ausbreitung\ndes Islam", c: "#1e6b4f" },
       { x: 556, year: "800", title: "Kaiserkrönung\nKarls d. Gr.", c: "#1b5e8a" },
     ]
       .map(
         (e) => `<circle cx="${e.x}" cy="92" r="10" fill="${e.c}" stroke="var(--f-halo)" stroke-width="2.5"/>
           ${label(e.x, 68, e.year, "lbl tiny strong")}
           ${labels(e.x, 120, e.title, "lbl tiny", "middle", 15)}`,
       )
       .join("")}
     ${labels(320, 184, "Epochengrenzen sind Ordnungsbegriffe der Nachwelt – niemand wachte im Jahr 476 im „Mittelalter“ auf.\nViele römische Straßen, Städte, die lateinische Sprache und das Christentum bestanden weiter (Kontinuität).", "lbl tiny strong", "middle", 16)}`,
  );
}

/* ---------- LB 7: Gesellschaftsordnung im Kleinen: Leben in der Familie ---------- */

export function athenOikosGrundriss(): string {
  return svg(
    640,
    250,
    "Schematischer Grundriss eines athenischen Wohnhauses (Oikos) mit Innenhof, Männerraum (Andron) und Frauen- und Familienbereich (Gynaikonitis)",
    `${panel(8, 8, 624, 234, "panel-bg")}
     ${label(320, 34, "Der athenische Oikos (Hausgemeinschaft im 5. Jh. v. Chr.)", "lbl small strong")}
     <rect x="34" y="52" width="322" height="162" rx="8" fill="var(--f-panel)" stroke="var(--f-ink)" stroke-width="2"/>
     <rect x="50" y="68" width="128" height="58" rx="4" fill="var(--accent-soft)" stroke="#1b5e8a" stroke-width="1.5"/>
     ${labels(114, 92, "Andron (Männerraum)\nEmpfang & Gespräche", "lbl tiny strong")}
     <rect x="194" y="68" width="146" height="58" rx="4" fill="var(--gold-soft)" stroke="#73357a" stroke-width="1.5"/>
     ${labels(267, 92, "Gynaikonitis (Innenbereich)\nWeben, Vorräte, Kinder", "lbl tiny strong")}
     <rect x="50" y="140" width="176" height="58" rx="4" fill="var(--gold-soft)" stroke="var(--gold)"/>
     ${labels(138, 166, "Innenhof (Licht & Brunnen)\nAlltag der Sklavinnen & Familie", "lbl tiny strong")}
     <rect x="242" y="140" width="98" height="58" rx="4" fill="var(--soft)" stroke="var(--f-line)"/>
     ${labels(291, 166, "Werkstatt /\nSpeisekammer", "lbl tiny")}
     ${panel(374, 52, 240, 162, "panel-bg")}
     ${labels(388, 76, "Rollen im Spiegel der Polis:", "lbl small strong", "start", 16)}
     ${labels(388, 104, "• Der Mann (Bürger): vertritt den\n  Oikos auf der Agora, in der\n  Volksversammlung und im Heer.\n• Die Ehefrau: leitet Haushalt,\n  Webarbeit und Erziehung,\n  hat aber keine Bürgerrechte.\n• Sklaven: leisten einen Großteil\n  der Haus- und Feldarbeit.", "lbl tiny", "start", 16)}`,
  );
}

export function roemischeFamiliaNetz(): string {
  return svg(
    640,
    250,
    "Aufbau der römischen Familia unter der Hausgewalt des Pater familias (Ehefrau, Kinder, Sklaven und Freigelassene)",
    `${panel(8, 8, 624, 234, "panel-bg")}
     ${label(320, 34, "Die römische „familia“ – mehr als nur Eltern und Kinder", "lbl small strong")}
     <rect x="200" y="50" width="240" height="44" rx="10" fill="#9e2a2b"/>
     ${label(320, 70, "Pater familias (Hausvater)", "lbl small on-dark strong")}
     ${label(320, 86, "rechtliches Oberhaupt, Ahnenkult, Vermögen", "lbl tiny on-dark")}
     ${arrow(260, 96, 114, 128)}
     ${arrow(320, 96, 320, 128)}
     ${arrow(380, 96, 526, 128)}
     ${[
       { x: 24, head: "Mater familias (Ehefrau)", body: "führt die Hauswirtschaft,\nerzieht Kinder, genießt mehr\nAusgang als in Athen;\nunter Vormundschaft", c: "#73357a" },
       { x: 230, head: "Söhne & Töchter", body: "unterstehen der patria\npotestas; Ehe wird oft\nnach Familienansehen\nund Politik geplant", c: "#1b5e8a" },
       { x: 436, head: "Sklaven & Freigelassene", body: "gehören rechtlich zur\nfamilia; arbeiten im Haus,\nin Betrieben oder als\nHauslehrer", c: "#37536e" },
     ]
       .map(
         (b) => `${panel(b.x, 130, 180, 94, "panel-bg")}
           <rect x="${b.x}" y="130" width="180" height="24" rx="8" fill="${b.c}"/>
           ${label(b.x + 90, 146, b.head, "lbl tiny on-dark strong")}
           ${labels(b.x + 90, 168, b.body, "lbl tiny", "middle", 14)}`,
       )
       .join("")}`,
  );
}

export function familienformenHeute(): string {
  return cardGrid(
    "Familien im Wandel: Neue Rollenbilder und vielfältige Lebensformen heute",
    [
      {
        head: "Gleichberechtigung im Recht",
        body: "Mütter und Väter haben gleiche Rechte\nund gemeinsame Verantwortung; Kinder\nhaben ein Recht auf gewaltfreie Erziehung.",
        colour: "#1e6b4f",
        icon: "⚖️",
      },
      {
        head: "Geteilte Aufgaben",
        body: "Erwerbsarbeit, Haushalt und Kinder-\nbetreuung werden heute oft zwischen\nbeiden Partnern aufgeteilt.",
        colour: "#1b5e8a",
        icon: "🤝",
      },
      {
        head: "Vielfalt der Familienformen",
        body: "Kernfamilien, Alleinerziehende,\nPatchwork-Familien, Regenbogenfamilien\nund Mehrgenerationenhaushalte.",
        colour: "#73357a",
        icon: "🏡",
      },
      {
        head: "Wandel braucht Diskussion",
        body: "Rollenbilder verändern sich nicht über\nNacht – Vereinbarkeit von Beruf und\nFamilie bleibt ein aktuelles Thema.",
        colour: "#37536e",
        icon: "💬",
      },
    ],
    2,
    620,
  );
}

export function gesellschaftUndFamilie(): string {
  return svg(
    640,
    240,
    "Zusammenhang zwischen Gesellschaftsordnung und Familie im Längsschnitt von Athen über Rom zur Gegenwart",
    `${panel(8, 8, 624, 224, "panel-bg")}
     ${label(320, 34, "Spiegel im Kleinen: Wie Gesellschaft und Familie zusammenhängen", "lbl small strong")}
     ${[
       { x: 24, head: "Athen (5. Jh. v. Chr.)", top: "Polis-Demokratie:\nnur Männer = Bürger", bot: "Frauen im Haus,\nkeine politische Stimme", c: "#1b5e8a" },
       { x: 230, head: "Rom (um Chr. Geburt)", top: "Ständegesellschaft &\nPatriarchat", bot: "Pater familias als\nhierarchische Spitze", c: "#9e2a2b" },
       { x: 436, head: "Gegenwart (Bayern/DE)", top: "Grundgesetz:\nMenschenwürde & Gleichheit", bot: "Partnerschaftlichkeit\n& Kinderrechte", c: "#1e6b4f" },
     ]
       .map(
         (col) => `<rect x="${col.x}" y="52" width="180" height="162" rx="12" fill="var(--surface)" stroke="${col.c}" stroke-width="2"/>
           <rect x="${col.x}" y="52" width="180" height="28" rx="8" fill="${col.c}"/>
           ${label(col.x + 90, 70, col.head, "lbl tiny on-dark strong")}
           ${labels(col.x + 90, 98, col.top, "lbl tiny strong", "middle", 15)}
           ${arrow(col.x + 90, 126, col.x + 90, 152)}
           ${labels(col.x + 90, 174, col.bot, "lbl tiny", "middle", 15)}`,
       )
       .join("")}`,
  );
}

/* ---------- Hero-Panorama & Gesamt-Zeitleiste (Lernpfad & Nachschlagen) ---------- */

export function heroPanorama(): string {
  return svg(
    860,
    150,
    "Historisches Panorama von der Altsteinzeit über die ägyptischen Pyramiden, den griechischen Tempel und das Römische Reich bis zu Karl dem Großen 800",
    `<rect width="860" height="150" rx="12" class="sky"/>
     <rect x="0" y="106" width="860" height="44" fill="var(--f-land)"/>
     <line x1="0" y1="106" x2="860" y2="106" stroke="var(--f-line)" stroke-width="1.5"/>
     <!-- 1. Steinzeit -->
     <polygon class="tent" points="28,106 62,56 96,106"/>
     <path class="fire" d="M110 106 Q116 86 122 94 Q128 80 134 94 Q138 88 134 106 Z"/>
     ${label(78, 126, "Alt- & Jungsteinzeit", "lbl tiny strong")}
     <!-- 2. Ägypten -->
     ${pyramidShape(226, 106, 86, 60, true)}
     ${pyramidShape(278, 106, 54, 38, false)}
     ${label(248, 126, "Ägypten (ab 3000 v. Chr.)", "lbl tiny strong")}
     <!-- 3. Griechenland -->
     <rect x="358" y="96" width="84" height="10" fill="var(--f-stone)"/>
     ${column(374, 96, 42, "ionic")}
     ${column(400, 96, 42, "ionic")}
     ${column(426, 96, 42, "ionic")}
     <polygon points="354,54 400,34 446,54" class="column"/>
     ${label(400, 126, "Athen (5. Jh. v. Chr.)", "lbl tiny strong")}
     <!-- 4. Rom / Limes -->
     <rect x="498" y="64" width="124" height="42" fill="var(--f-stone)" stroke="var(--f-ink)" stroke-width="1.2"/>
     <path d="M510 106 V86 A12 12 0 0 1 534 86 V106 Z" fill="var(--f-sky)"/>
     <path d="M548 106 V86 A12 12 0 0 1 572 86 V106 Z" fill="var(--f-sky)"/>
     <path d="M586 106 V86 A12 12 0 0 1 610 86 V106 Z" fill="var(--f-sky)"/>
     <rect x="494" y="54" width="132" height="10" fill="var(--f-stone)"/>
     ${label(560, 126, "Rom & Limes (753 v. Chr.–5. Jh.)", "lbl tiny strong")}
     <!-- 5. Mittelalter / Karl -->
     <rect x="688" y="56" width="112" height="50" rx="6" class="wall"/>
     ${crown(744, 52, 0.9)}
     ${person(744, 106, 0.9, "cloth-a", "out")}
     ${label(744, 126, "Frankenreich & 800", "lbl tiny strong")}`,
  );
}

export function gesamtZeitleiste(): string {
  const events = [
    { x: 56, date: "ca. 10 000 v. Chr.", label: "Jungsteinzeit", lb: "#9a4b1f", y: 66 },
    { x: 146, date: "ab 3000 v. Chr.", label: "Hochkultur\nÄgypten", lb: "#a16c0e", y: 144 },
    { x: 236, date: "753 v. Chr.", label: "Mythische\nGründung Roms", lb: "#9e2a2b", y: 66 },
    { x: 326, date: "5. Jh. v. Chr.", label: "Blütezeit\nAthens", lb: "#1b5e8a", y: 144 },
    { x: 416, date: "1. Jh. v. Chr.", label: "Republik →\nKaiserzeit", lb: "#9e2a2b", y: 66 },
    { x: 506, date: "um Chr. Geb.", label: "Zeitalter des\nAugustus", lb: "#9e2a2b", y: 144 },
    { x: 596, date: "um 500", label: "Reichsbildung\nder Franken", lb: "#1e6b4f", y: 66 },
    { x: 686, date: "800", label: "Kaiserkrönung\nKarls d. Gr.", lb: "#1e6b4f", y: 144 },
  ];
  return svg(
    744,
    216,
    "Gesamt-Zeitleiste aller Grundlegenden Daten der 6. Klasse Geschichte Gymnasium von der Jungsteinzeit bis zur Kaiserkrönung Karls des Großen 800",
    `${panel(6, 6, 732, 204, "panel-bg")}
     <rect x="22" y="96" width="440" height="16" rx="4" fill="#1b5e8a" opacity="0.2"/>
     <rect x="462" y="96" width="260" height="16" rx="4" fill="#1e6b4f" opacity="0.22"/>
     <line class="axis" x1="22" y1="104" x2="718" y2="104"/>
     ${arrow(702, 104, 728, 104)}
     <line class="zero" x1="462" y1="22" x2="462" y2="188"/>
     ${label(462, 18, "Zeitenwende", "lbl tiny strong")}
     ${events
       .map(
         (e) => `<line x1="${e.x}" y1="104" x2="${e.x}" y2="${e.y < 104 ? 82 : 126}" stroke="${e.lb}" stroke-width="2"/>
           <circle cx="${e.x}" cy="104" r="6.5" fill="${e.lb}" stroke="var(--f-halo)" stroke-width="2"/>
           ${label(e.x, e.y < 104 ? 36 : 144, e.date, "lbl tiny strong")}
           ${labels(e.x, e.y < 104 ? 52 : 160, e.label, "lbl tiny", "middle", 14)}`,
       )
       .join("")}`,
  );
}
