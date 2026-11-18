/**
 * Figures for LB 3 (Die griechische Antike) and LB 4 (Menschen machen Geschichte – Längsschnitt).
 */
import {
  arrow,
  cardGrid,
  chain,
  column,
  compare,
  crown,
  label,
  labels,
  panel,
  person,
  shipTrireme,
  svg,
} from "./draw";

/* ---------- LB 3: Die griechische Antike ---------- */

export function polisAufbau(): string {
  return svg(
    640,
    260,
    "Schematischer Aufbau einer griechischen Polis mit Akropolis auf dem Burghügel, Agora als Marktplatz, Wohnvierteln, Stadtmauer, Umland und Hafen",
    `${panel(8, 8, 624, 244, "panel-bg")}
     <rect x="16" y="16" width="608" height="170" rx="10" class="sky"/>
     <rect x="16" y="176" width="608" height="68" rx="10" class="meadow"/>
     <rect x="466" y="178" width="158" height="66" rx="8" class="sea"/>
     <path d="M56 184 L126 78 L216 184 Z" fill="var(--f-stone)" stroke="var(--f-ink)" stroke-width="1.5"/>
     <rect x="92" y="72" width="68" height="8" fill="var(--f-stone)"/>
     ${column(104, 72, 34, "doric")}
     ${column(126, 72, 34, "doric")}
     ${column(148, 72, 34, "doric")}
     <polygon points="88,38 126,20 164,38" class="column"/>
     ${labels(126, 126, "1. Akropolis\n(Tempelhügel)", "lbl tiny strong", "middle", 13)}
     <rect x="218" y="144" width="136" height="40" rx="6" fill="var(--f-panel)" stroke="var(--f-line)"/>
     ${person(244, 178, 0.72, "cloth-citizen", "down")}
     ${person(272, 178, 0.72, "cloth-citizen-b", "out")}
     ${person(302, 178, 0.72, "cloth-trader", "down")}
     ${label(286, 134, "2. Agora (Markt)", "lbl tiny strong")}
     <rect x="372" y="138" width="68" height="46" fill="var(--f-stone)" stroke="var(--f-ink)"/>
     <rect x="380" y="150" width="22" height="34" class="house"/>
     <rect x="408" y="154" width="22" height="30" class="house"/>
     ${label(406, 128, "3. Stadt & Mauer", "lbl tiny strong")}
     <path d="M18 182 H96 V218 H18 Z" fill="var(--f-earth)" opacity="0.45"/>
     ${labels(57, 198, "4. Umland\n(Öl, Wein, Korn)", "lbl tiny", "middle", 13)}
     ${shipTrireme(545, 206, 0.65)}
     ${label(545, 168, "5. Hafen & Handel", "lbl tiny strong")}
     ${label(320, 236, "Polis = befestigte Stadt + zugehöriges Umland als selbstständiger Bürgerstaat", "lbl tiny strong")}`,
  );
}

export function migrationVergleich(): string {
  return compare(
    "Griechische Kolonisation (8.–6. Jh. v. Chr.) vs. Migration heute",
    {
      head: "Griechische Kolonisation (Antike)",
      colour: "#1b5e8a",
      points: [
        "Gründe: Landnot, Missernte, Konflikt",
        "Ablauf: Gruppen einer Polis segeln los",
        "Folge: neue eigenständige Tochterstädte",
        "Kontakt zur Mutterstadt: Kult & Handel",
        "Spannungen und Mischung vor Ort",
      ],
    },
    {
      head: "Migration in der Gegenwart",
      colour: "#1e6b4f",
      points: [
        "Gründe: Arbeit, Studium, Armut, Flucht",
        "Ablauf: Einzelne oder Familien wandern",
        "Folge: Integration in bestehende Staaten",
        "Kontakt zur Heimat: digital & Reisen",
        "Gemeinsam: Suche nach Chancen & Schutz",
      ],
    },
    620,
  );
}

export function griechischeKulturSpuren(): string {
  return cardGrid(
    "Was die unabhängigen Poleis verband – und welche Spuren bis heute sichtbar sind",
    [
      {
        head: "Mythen & Epen (Homer)",
        body: "Ilias und Odyssee erzählten allen\nGriechen gemeinsame Geschichten – bis\nheute Grundstoff in Literatur und Film.",
        colour: "#1b5e8a",
        icon: "📖",
      },
      {
        head: "Olympische Spiele (ab 776 v. Chr.)",
        body: "Alle vier Jahre Wettkämpfe für Zeus;\nheiliger Waffenstillstand verband die\nPoleis. Heute weltweites Sportereignis.",
        colour: "#a16c0e",
        icon: "🌿",
      },
      {
        head: "Theater (Tragödie & Komödie)",
        body: "Freilichtbühnen fragten nach Recht,\nSchicksal und Macht. Bis heute Vorbild\nfür Bühnenform, Chor und Begriffe.",
        colour: "#73357a",
        icon: "🎭",
      },
      {
        head: "Architektur & Sprache",
        body: "Säulenordnungen (z. B. am Königsplatz\nin München) und Wörter wie Demokratie,\nPhilosophie, Stadion, Technik.",
        colour: "#1e6b4f",
        icon: "🏛️",
      },
    ],
    2,
    620,
  );
}

export function saeulenVaseQuelle(): string {
  return svg(
    640,
    250,
    "Gegenständliche Quellen der griechischen Antike: drei Säulenordnungen und eine rotfigurige/schwarzfigurige Amphore",
    `${panel(8, 8, 624, 234, "panel-bg")}
     ${label(200, 34, "Säulenordnungen (Bauwerke in Bayern & Athen)", "lbl small strong")}
     ${column(82, 168, 96, "doric")}
     ${labels(82, 188, "Dorisch\n(schlicht, kräftig)", "lbl tiny", "middle", 13)}
     ${column(200, 168, 96, "ionic")}
     ${labels(200, 188, "Ionisch\n(Schneckenkapitell)", "lbl tiny", "middle", 13)}
     ${column(318, 168, 96, "corinthian")}
     ${labels(318, 188, "Korinthisch\n(Blattkapitell)", "lbl tiny", "middle", 13)}
     <line x1="396" y1="24" x2="396" y2="226" stroke="var(--line)" stroke-width="2"/>
     ${label(510, 34, "Vase als Bildquelle", "lbl small strong")}
     <path d="M482 64 H538 L526 84 C554 106 552 158 524 182 H496 C468 158 466 106 494 84 Z" fill="#c96532" stroke="var(--f-ink)" stroke-width="2"/>
     <path d="M486 84 Q456 96 476 126" fill="none" stroke="var(--f-ink)" stroke-width="4"/>
     <path d="M534 84 Q564 96 544 126" fill="none" stroke="var(--f-ink)" stroke-width="4"/>
     <rect x="488" y="106" width="44" height="44" rx="6" fill="#231f1b"/>
     <circle cx="510" cy="122" r="6" fill="#e69a5c"/>
     <path d="M500 146 L510 128 L520 146 Z" fill="#e69a5c"/>
     ${labels(510, 206, "Zeigt Alltag, Sport, Götter –\naber immer aus Sicht der\nWerkstatt und Käufer.", "lbl tiny", "middle", 14)}`,
  );
}

export function verfassungswegAthen(): string {
  return chain(
    "Der Weg Athens von der Adelsherrschaft zur Demokratie",
    [
      {
        head: "Adelsherrschaft",
        body: "Um 700 v. Chr.: reiche\nAdlige bestimmen allein;\nBauern verschulden sich",
        colour: "#8a6748",
      },
      {
        head: "Solon (594 v. Chr.)",
        body: "Schafft Schuldknechtschaft\nab; Rechte nun nach\nErnte-Vermögen (4 Klassen)",
        colour: "#a16c0e",
      },
      {
        head: "Kleisthenes (508/507)",
        body: "Mischt Stämme (Phylen);\nRat der 500 + Schutz durch\nScherbengericht",
        colour: "#1b5e8a",
      },
      {
        head: "Perikles (5. Jh. v. Chr.)",
        body: "Blütezeit Athens: Tagegelder\n(Diäten) lassen auch arme\nBürger Ämter ausüben",
        colour: "#1e6b4f",
      },
    ],
    4,
    640,
  );
}

export function ostrakonSzene(): string {
  return svg(
    620,
    220,
    "Ostrakon (Tonscherbe) beim Scherbengericht in Athen als Schutz vor einem neuen Tyrannen",
    `${panel(8, 8, 604, 204, "panel-bg")}
     <path d="M48 64 L198 46 L236 106 L184 176 L62 162 L34 114 Z" fill="#c96e3b" stroke="#6b3519" stroke-width="2.5"/>
     ${labels(136, 108, "THEMISTOKLES\n(eingeritzt)", "lbl small on-dark strong")}
     ${label(136, 196, "Ostrakon = beschriebene Tonscherbe", "lbl tiny strong")}
     ${panel(268, 28, 328, 164, "panel-bg")}
     ${labels(284, 54, "Wie funktionierte das Scherbengericht?", "lbl small strong", "start", 16)}
     ${labels(284, 84, "• Einmal im Jahr fragte die Volksversammlung,\n  ob ein Politiker zu mächtig wurde.\n• Wenn mindestens 6000 Bürger abstimmten,\n  musste der meistgenannte Mann Athen für\n  10 Jahre verlassen – ohne Ehrverlust.\n• Ziel: eine Rückkehr zur Tyrannis verhindern.", "lbl tiny", "start", 16)}`,
  );
}

export function triereUrsacheWirkung(): string {
  return chain(
    "Wie die Perserkriege die attische Demokratie stärkten",
    [
      {
        head: "Persische Angriffe",
        body: "490 v. Chr. Marathon,\n480 v. Chr. Thermopylen\nund Seeschlacht bei Salamis",
        colour: "#9e2a2b",
      },
      {
        head: "Flotte aus Trieren",
        body: "Athen baut 200 schnelle\nKriegsschiffe; jedes braucht\netwa 170 Ruderer (Theten)",
        colour: "#1b5e8a",
      },
      {
        head: "Rettung der Polis",
        body: "Die ärmsten Bürger tragen\nden Sieg bei Salamis (480)\nin der ersten Reihe mit",
        colour: "#a16c0e",
      },
      {
        head: "Politische Forderung",
        body: "Wer für Athen rudert, will\nauch mitbestimmen → voller\nAusbau der Demokratie",
        colour: "#1e6b4f",
      },
    ],
    4,
    640,
  );
}

export function athenVsHeute(): string {
  return compare(
    "Attische Demokratie (5. Jh. v. Chr.) vs. unsere heutige Demokratie",
    {
      head: "Athen zur Blütezeit (Perikles)",
      colour: "#1b5e8a",
      points: [
        "Direkt: Bürger stimmen selbst auf der Pnyx ab",
        "Auslosung schützt viele Ämter vor Wahlkampf",
        "Nur erwachsene männliche Vollbürger (ca. 15 %)",
        "Ausgeschlossen: Frauen, Metöken (Fremde), Sklaven",
        "Keine festen Grundrechte für Minderheiten",
      ],
    },
    {
      head: "Demokratie in Deutschland heute",
      colour: "#1e6b4f",
      points: [
        "Repräsentativ: wir wählen Parlamente (Bundestag)",
        "Wahlen sind allgemein, frei, gleich und geheim",
        "Frauen und Männer sind gleichberechtigt",
        "Menschenwürde und Grundrechte gelten für alle",
        "Gewaltenteilung kontrolliert die Regierung",
      ],
    },
    620,
  );
}

/* ---------- LB 4: Menschen machen Geschichte (Längsschnitt) ---------- */

export function herrscherbildnisAnalyse(): string {
  return svg(
    640,
    250,
    "Vorgegebener Kriterienkatalog am Beispiel einer Herrscherdarstellung: Haltung, Kleidung, Insignien, Inschrift und Aussageabsicht",
    `${panel(8, 8, 624, 234, "panel-bg")}
     <rect x="28" y="28" width="212" height="194" rx="12" fill="var(--f-sand)" stroke="var(--f-line)" stroke-width="2"/>
     ${crown(134, 62, 1.1)}
     ${person(134, 152, 1.5, "cloth-linen", "out")}
     <rect x="98" y="156" width="72" height="16" rx="4" fill="var(--f-stone)"/>
     <line x1="168" y1="126" x2="184" y2="96" stroke="var(--f-yellow)" stroke-width="4" stroke-linecap="round"/>
     <circle cx="134" cy="186" r="14" fill="var(--f-panel)" stroke="var(--f-line)"/>
     ${label(134, 190, "Kartusche", "lbl tiny")}
     ${arrow(156, 52, 260, 52)}
     ${arrow(174, 108, 260, 108)}
     ${arrow(160, 148, 260, 160)}
     ${arrow(152, 186, 260, 206)}
     ${label(268, 56, "1. Kopfschmuck / Krone: zeigt das höchste Amt (z. B. Doppelkrone)", "lbl tiny strong", "start")}
     ${label(268, 112, "2. Insignien & Haltung: Zepter, Bart oder Thron zeigen Würde und Macht", "lbl tiny strong", "start")}
     ${label(268, 164, "3. Kleidung & Idealbild: verjüngt und makellos – kein Schnappschuss!", "lbl tiny strong", "start")}
     ${label(268, 210, "4. Inschrift & Absicht: Wer hat das Bild in Auftrag gegeben – und wofür?", "lbl tiny strong", "start")}`,
  );
}

export function hatschepsutSpielraum(): string {
  return svg(
    640,
    240,
    "Handlungsspielraum und Grenzen der Pharaonin Hatschepsut in der ägyptischen Monarchie",
    `${panel(8, 8, 624, 224, "panel-bg")}
     ${panel(24, 24, 286, 192, "panel-bg")}
     <rect x="24" y="24" width="286" height="32" rx="10" fill="#a16c0e"/>
     ${label(38, 45, "Spielräume in ihrer Herrschaft", "lbl small on-dark", "start")}
     ${labels(38, 76, "• Nutzte traditionelle Titel & Zeremoniell\n  (Darstellung oft mit Königsbart)\n• Stützte sich auf treue Beamte und\n  Priester des Amun-Kults\n• Sicherte Frieden und Wohlstand durch\n  Handelsexpedition nach Punt\n• Ließ den Terrassentempel Deir el-Bahari\n  als steinernes Zeichen errichten", "lbl tiny", "start", 16)}
     ${panel(330, 24, 286, 192, "panel-bg")}
     <rect x="330" y="24" width="286" height="32" rx="10" fill="#73357a"/>
     ${label(344, 45, "Grenzen ihrer Macht", "lbl small on-dark", "start")}
     ${labels(344, 76, "• Musste die traditionelle Ordnung (Maat)\n  und die Priesterschaft achten\n• Blieb formal an männliche Herrschafts-\n  symbole gebunden\n• Nach ihrem Tod ließ Thutmosis III.\n  viele ihrer Bildnisse meißeln/tilgen\n→ Auch ein Pharao regiert nicht völlig\n  ohne Rücksicht auf Traditionen.", "lbl tiny", "start", 16)}`,
  );
}

export function themistoklesHandlung(): string {
  return chain(
    "Politisches Handeln in der Demokratie: Themistokles (5. Jh. v. Chr.)",
    [
      {
        head: "Idee & Vorschlag",
        body: "483 v. Chr.: Silberfund in\nLaurion nutzen, um eine\nKriegsflotte zu bauen",
        colour: "#1b5e8a",
      },
      {
        head: "Überzeugungsarbeit",
        body: "Keine Alleinentscheidung:\nThemistokles muss die\nVolksversammlung gewinnen",
        colour: "#73357a",
      },
      {
        head: "Erfolg bei Salamis",
        body: "480 v. Chr. besiegt seine\nFlotte die Perser in der\nengen Meerenge",
        colour: "#1e6b4f",
      },
      {
        head: "Grenze: Ostrakismos",
        body: "Später verbannt ihn die\nMehrheit per Scherbengericht\n– Bürger behalten Kontrolle",
        colour: "#9e2a2b",
      },
    ],
    4,
    640,
  );
}

export function hellenismusKultur(): string {
  return cardGrid(
    "Möglichkeiten und Grenzen von Eroberung: Das Reich Alexanders des Großen",
    [
      {
        head: "Militärische Leistung",
        body: "In nur elf Jahren (334–323 v. Chr.)\neroschlägt Alexander das Perserreich\nund zieht bis zum Fluss Indus.",
        colour: "#9e2a2b",
        icon: "⚔️",
      },
      {
        head: "Grenze an der Versorgung",
        body: "Nach tausenden Kilometern verweigert\ndas erschöpfte Heer am Indus den\nWeitermarsch – Alexander muss umkehren.",
        colour: "#73357a",
        icon: "🛑",
      },
      {
        head: "Zerfall ohne Nachfolger",
        body: "323 v. Chr. stirbt Alexander in Babylon\nmit 32 Jahren. Ohne festen Erben teilen\nseine Generäle das Riesenreich auf.",
        colour: "#37536e",
        icon: "⚖️",
      },
      {
        head: "Folge: Hellenismus",
        body: "Griechische Sprache, Wissenschaft und\nStädte (z. B. Alexandria) verbinden sich\nmit orientalischen Kulturen.",
        colour: "#1e6b4f",
        icon: "🌍",
      },
    ],
    2,
    620,
  );
}

export function dreiHerrschaftsformen(): string {
  return svg(
    640,
    240,
    "Vergleich von drei Persönlichkeiten in ihrer Zeit und Herrschaftsform: Hatschepsut (Monarchie), Themistokles (Demokratie) und Alexander (Eroberungsmonarchie)",
    `${panel(8, 8, 624, 224, "panel-bg")}
     ${[
       {
         x: 22,
         head: "Hatschepsut",
         time: "ca. 1479–1458 v. Chr.",
         form: "Monarchie (Ägypten)",
         colour: "#a16c0e",
         text: "Gestützt auf Titel,\nPriester & Tradition;\nGrenze: Nachfolge",
       },
       {
         x: 224,
         head: "Themistokles",
         time: "5. Jh. v. Chr. (Blütezeit)",
         form: "Demokratie (Polis Athen)",
         colour: "#1b5e8a",
         text: "Braucht Mehrheit\nder Volksversammlung;\nGrenze: Ostrakismos",
       },
       {
         x: 426,
         head: "Alexander der Große",
         time: "336–323 v. Chr.",
         form: "Königtum & Weltreich",
         colour: "#73357a",
         text: "Riesige Eroberung;\nGrenzen: Heer, Raum\n& früher Tod 323 v. Chr.",
       },
     ]
       .map(
         (c) => `${panel(c.x, 22, 192, 194, "panel-bg")}
           <rect x="${c.x}" y="22" width="192" height="32" rx="10" fill="${c.colour}"/>
           ${label(c.x + 96, 43, c.head, "lbl small on-dark", "middle")}
           ${label(c.x + 96, 72, c.time, "lbl tiny strong")}
           ${label(c.x + 96, 90, c.form, "lbl tiny muted")}
           <line x1="${c.x + 16}" y1="104" x2="${c.x + 176}" y2="104" stroke="var(--line)"/>
           ${labels(c.x + 96, 128, c.text, "lbl tiny", "middle", 17)}`,
       )
       .join("")}`,
  );
}
