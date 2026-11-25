/**
 * Figures for LB 1 (Der Mensch und seine Geschichte) and LB 2 (Ägypten – eine frühe Hochkultur).
 */
import {
  arrow,
  badgePill,
  cardGrid,
  chain,
  compare,
  f1,
  label,
  labels,
  panel,
  person,
  svg,
} from "./draw";

/* ---------- LB 1: Der Mensch und seine Geschichte ---------- */

export function zeitdimensionen(): string {
  return svg(
    640,
    240,
    "Die drei Zeitdimensionen Vergangenheit, Gegenwart und Zukunft am Lebensbeispiel und auf dem Zeitstrahl",
    `${panel(8, 8, 624, 224, "panel-bg")}
     ${label(320, 36, "Wie hängen Vergangenheit, Gegenwart und Zukunft zusammen?", "lbl strong")}
     <line class="axis" x1="56" y1="118" x2="584" y2="118"/>
     ${arrow(545, 118, 592, 118)}
     <rect x="34" y="64" width="166" height="92" rx="12" fill="var(--f-panel)" stroke="var(--f-earth)" stroke-width="2.5"/>
     ${badgePill(117, 66, 126, "VERGANGENHEIT", "#8a6748")}
     ${labels(117, 94, "Was bereits geschehen ist\nund Spuren hinterlässt:\nQuellen, Bauwerke,\nErfahrungen", "lbl tiny", "middle", 15)}
     <rect x="236" y="54" width="168" height="110" rx="12" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="3"/>
     ${badgePill(320, 56, 116, "GEGENWART", "var(--accent)")}
     ${labels(320, 86, "Unsere eigene Lebenswelt:\nWir deuten das Frühere\nund treffen heute\nEntscheidungen", "lbl tiny strong", "middle", 15)}
     <rect x="440" y="64" width="166" height="92" rx="12" fill="var(--f-panel)" stroke="var(--f-blue)" stroke-width="2.5"/>
     ${badgePill(523, 66, 108, "ZUKUNFT", "#2f7fd0")}
     ${labels(523, 94, "Was noch bevorsteht:\nPläne, Hoffnungen,\nFolgen unseres\nheutigen Handelns", "lbl tiny", "middle", 15)}
     ${arrow(202, 118, 232, 118)}
     ${arrow(406, 118, 436, 118)}
     ${labels(320, 198, "Geschichte fragt aus der Gegenwart nach der Vergangenheit, um für die Zukunft zu lernen.", "lbl small strong")}`,
  );
}

export function geschichtsbuchAufbau(): string {
  return svg(
    640,
    270,
    "Aufbau einer Doppelseite im Schulgeschichtsbuch: Darstellungstext, Quellenblock, Arbeitsaufträge und Zeitleiste",
    `${panel(8, 8, 624, 254, "panel-bg")}
     <rect x="28" y="24" width="284" height="222" rx="8" fill="var(--surface)" stroke="var(--f-line)" stroke-width="2"/>
     <rect x="328" y="24" width="284" height="222" rx="8" fill="var(--surface)" stroke="var(--f-line)" stroke-width="2"/>
     <line x1="320" y1="24" x2="320" y2="246" stroke="var(--f-line)" stroke-width="3"/>
     <rect x="44" y="40" width="250" height="26" rx="6" fill="var(--accent)"/>
     ${label(56, 58, "Kapitelüberschrift + Leitfrage", "lbl tiny on-dark strong", "start")}
     <rect x="44" y="76" width="250" height="96" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/>
     ${labels(56, 98, "1. Darstellungstext (Autor heute):\n• fasst Abläufe in der Rückschau\n  zusammen\n• erklärt Fachbegriffe und Gründe", "lbl tiny", "start", 16)}
     <rect x="44" y="182" width="250" height="50" rx="8" fill="var(--f-panel)" stroke="var(--f-line)"/>
     ${labels(56, 202, "2. Karte / Schaubild mit Legende\n    und Überschrift", "lbl tiny", "start", 15)}
     <rect x="344" y="40" width="250" height="84" rx="8" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2"/>
     ${labels(356, 62, "3. Quelle (aus der damaligen Zeit):\n• erkennbar an Fundort / Verfasser /\n  Entstehungsjahr in der Randzeile\n• zeigt eine Perspektive von damals", "lbl tiny strong", "start", 16)}
     <rect x="344" y="134" width="250" height="56" rx="8" fill="var(--f-panel)" stroke="var(--f-line)"/>
     ${labels(356, 156, "4. Arbeitsaufträge (Operatoren):\n    nenne, beschreibe, vergleiche, beurteile", "lbl tiny", "start", 16)}
     <rect x="344" y="198" width="250" height="34" rx="6" fill="var(--soft)" stroke="var(--f-line)"/>
     ${label(469, 220, "5. Zeitleiste / Grundwissen am Rand", "lbl tiny strong")}`,
  );
}

export function quellenartenGrid(): string {
  return cardGrid(
    "Die vier Formen geschichtlicher Quellen mit Beispielen aus Altertum und Urgeschichte",
    [
      {
        head: "Schriftliche Quellen",
        body: "Tontafeln, Papyrusrollen, Inschriften,\nBriefe, Urkunden, Gesetzestexte.\nErst ab der Erfindung der Schrift!",
        colour: "#1b5e8a",
        icon: "📜",
      },
      {
        head: "Gegenständliche Quellen",
        body: "Faustkeile, Tonscherben, Gräber,\nMünzen, Bauwerke, Rüstungen.\nHauptquelle für die Urgeschichte.",
        colour: "#9a4b1f",
        icon: "🏺",
      },
      {
        head: "Bildliche Quellen",
        body: "Höhlenmalereien, Vasenbilder,\nReliefs, Statuen, Herrscherbildnisse.\nZeigen oft, wie man gesehen werden will.",
        colour: "#73357a",
        icon: "🎨",
      },
      {
        head: "Mündliche Quellen",
        body: "Erzählungen, Sagen, Zeitzeugen-\nberichte, überlieferte Lieder.\nMüssen kritisch überprüft werden.",
        colour: "#1e6b4f",
        icon: "🗣️",
      },
    ],
    2,
    620,
  );
}

export function ueberrestTradition(): string {
  return compare(
    "Zwei Arten geschichtlicher Zeugnisse: Überrest und Überlieferung (Tradition)",
    {
      head: "Überrest (unabsichtlich erhalten)",
      colour: "#9a4b1f",
      points: [
        "Entstand für den Alltag, nicht für uns",
        "Beispiele: Topfscherbe, Müllgrube, Münze",
        "Auch: Straßenpflaster, Feuerstelle, Skelett",
        "Selten geschönt – aber oft bruchstückhaft",
        "Typisch für Archäologie und Vorgeschichte",
      ],
    },
    {
      head: "Tradition (absichtlich für Nachwelt)",
      colour: "#1b5e8a",
      points: [
        "Sollte Erinnerung steuern und bewahren",
        "Beispiele: Siegesinschrift, Grabrede, Denkmal",
        "Auch: Münzbildnis, Chronik, Tatenbericht",
        "Verrät Absichten und Sichtweise des Autors",
        "Vorsicht: oft einseitig oder übertrieben",
      ],
    },
    620,
  );
}

export function altsteinzeitLager(): string {
  return svg(
    640,
    270,
    "Lagerplatz von Jägern und Sammlern in der Altsteinzeit mit Zelt aus Stangen und Fellen, Feuerstelle und Mammut",
    `${panel(8, 8, 624, 254, "panel-bg")}
     <rect x="14" y="14" width="612" height="150" rx="10" class="sky"/>
     <rect x="14" y="156" width="612" height="98" rx="10" class="ground-cold"/>
     <path class="hill green" d="M14 162 Q130 118 270 156 Q440 120 626 158 L626 174 L14 174 Z"/>
     <polygon class="tent" points="70,192 142,88 214,192"/>
     <line class="tent-pole" x1="142" y1="84" x2="124" y2="70"/>
     <line class="tent-pole" x1="142" y1="84" x2="160" y2="70"/>
     <path class="tent-door" d="M128 192 Q142 150 156 192 Z"/>
     ${label(142, 70, "Fellzelt (schnell abbaubar)", "lbl tiny strong")}
     <ellipse cx="290" cy="202" rx="22" ry="7" fill="var(--f-stone)"/>
     <path class="fire" d="M276 200 Q282 174 290 184 Q298 164 306 186 Q312 176 306 200 Z"/>
     ${label(292, 224, "Feuerstelle (Wärme, Kochen, Schutz)", "lbl tiny strong")}
     ${person(244, 198, 0.9, "cloth-fur", "out")}
     ${person(346, 196, 0.9, "cloth-fur", "down")}
     <line class="spear" x1="362" y1="192" x2="380" y2="142"/>
     <polygon class="spear-tip" points="376,144 384,132 384,148"/>
     ${labels(384, 114, "Speer mit\nFeuersteinspitze", "lbl tiny", "middle", 13)}
     <g class="mammoth" transform="translate(500,152)">
       <ellipse cx="0" cy="0" rx="44" ry="28"/>
       <circle cx="-38" cy="-10" r="18"/>
       <path class="trunk" d="M-54 -4 Q-64 16 -52 28"/>
       <path fill="none" stroke="var(--f-white)" stroke-width="4" d="M-46 6 Q-64 14 -68 2"/>
       <line class="leg" x1="-22" y1="22" x2="-24" y2="46"/>
       <line class="leg" x1="20" y1="22" x2="22" y2="46"/>
     </g>
     ${label(510, 218, "Großwild (z. B. Mammut, Rentier)", "lbl tiny strong")}
     <g transform="translate(565,126)">
       <circle cx="0" cy="0" r="22" class="bush"/>
       <circle cx="-6" cy="-5" r="3" class="berry"/>
       <circle cx="7" cy="4" r="3" class="berry"/>
       <circle cx="2" cy="-9" r="3" class="berry"/>
     </g>
     ${labels(568, 84, "Beeren &\nWurzeln", "lbl tiny", "middle", 13)}
     ${label(320, 248, "Nomaden der Altsteinzeit: kleine Gruppen ziehen den Tierherden nach (aneignende Wirtschaft).", "lbl tiny strong")}`,
  );
}

export function feuerTechnikWirkung(): string {
  return chain(
    "Wie vorgeschichtliche Überlebenstechniken die Lebensform der Menschen veränderten",
    [
      {
        head: "Feuer beherrschen",
        body: "Wärme in der Eiszeit,\nSchutz vor Raubtieren,\nFleisch braten & härten",
        colour: "#b4232c",
        icon: "🔥",
      },
      {
        head: "Werkzeug & Waffen",
        body: "Faustkeil, Klinge, Speer,\nKnochennadel, Fellkleidung\n→ gezieltere Jagd",
        colour: "#9a4b1f",
        icon: "🪨",
      },
      {
        head: "Wohnungsbau",
        body: "Von Höhle und Fellzelt\nzu festen Lehm-Holz-\nLanghäusern im Dorf",
        colour: "#a16c0e",
        icon: "🏠",
      },
      {
        head: "Kultur & Gruppe",
        body: "Arbeitsteilung, Pflege\nvon Schwachen, Malerei,\nGemeinschaft am Herd",
        colour: "#1e6b4f",
        icon: "🤝",
      },
    ],
    4,
    640,
  );
}

export function steinzeitWandel(): string {
  return compare(
    "Wandel von der Altsteinzeit zur Jungsteinzeit („Neolithische Revolution“)",
    {
      head: "Altsteinzeit (Jäger & Sammler)",
      colour: "#8a6748",
      points: [
        "Wirtschaft: Jagen, Fischen, Sammeln (aneignend)",
        "Wohnen: Höhlen und Zelte, ständiger Ortswechsel",
        "Werkzeug: geschlagener Feuerstein (Faustkeil)",
        "Vorrat: kaum haltbare Vorräte möglich",
        "Gruppe: kleine Sippen bis etwa 30 Menschen",
      ],
    },
    {
      head: "Jungsteinzeit (Bauern, ab ca. 10 000 v. Chr.)",
      colour: "#3e8e48",
      points: [
        "Wirtschaft: Ackerbau und Viehzucht (produzierend)",
        "Wohnen: feste Langhäuser in Dörfern (sesshaft)",
        "Werkzeug: geschliffene Steinbeile, Sichel, Keramik",
        "Vorrat: Tonkrüge sichern Getreide über Winter",
        "Folge: Bevölkerung wächst, Berufe entstehen",
      ],
    },
    620,
  );
}

/* ---------- LB 2: Ägypten – eine frühe Hochkultur ---------- */

export function kriterienKarte(): string {
  return chain(
    "Vorgegebener Kriterienkatalog: Eine einfache Geschichtskarte erschließen",
    [
      {
        head: "1. Titel & Raum",
        body: "Welches Thema, welches\nGebiet und welche Zeit\nstellt die Karte dar?",
        colour: "#1b5e8a",
      },
      {
        head: "2. Zeichen & Farben",
        body: "Was bedeuten Flächen,\nLinien (Flüsse, Wege)\nund Symbole der Legende?",
        colour: "#a16c0e",
      },
      {
        head: "3. Auswertung",
        body: "Welche Vorteile oder\nGefahren bietet der Raum\nfür das Leben damals?",
        colour: "#1e6b4f",
      },
      {
        head: "4. Einordnung",
        body: "Was unterscheidet das\nKartenbild von der Lage\nheutiger Staaten?",
        colour: "#73357a",
      },
    ],
    4,
    640,
  );
}

export function nilKalenderRad(): string {
  const cx = 190;
  const cy = 148;
  const r = 98;
  const sector = (a1: number, a2: number, cls: string) => {
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);
    return `<path class="${cls}" d="M${f1(cx)} ${f1(cy)}L${f1(x1)} ${f1(y1)}A${r} ${r} 0 0 1 ${f1(x2)} ${f1(y2)}Z" stroke="var(--f-halo)" stroke-width="3"/>`;
  };
  const tau = Math.PI * 2;
  return svg(
    620,
    296,
    "Der ägyptische Jahreskreislauf am Nil mit den drei Jahreszeiten Überschwemmung (Achet), Aussaat (Peret) und Ernte (Schemu)",
    `${panel(8, 8, 604, 280, "panel-bg")}
     ${sector(-Math.PI / 2, -Math.PI / 2 + tau / 3, "season-flood")}
     ${sector(-Math.PI / 2 + tau / 3, -Math.PI / 2 + (2 * tau) / 3, "season-grow")}
     ${sector(-Math.PI / 2 + (2 * tau) / 3, -Math.PI / 2 + tau, "season-harvest")}
     <circle class="hub" cx="${cx}" cy="${cy}" r="36" stroke="var(--f-line)" stroke-width="2"/>
     ${labels(cx, cy - 3, "365 Tage\nNiljahr", "lbl tiny strong")}
     ${labels(cx + 52, cy - 36, "1. Achet\nJuli–Okt.\nFlut", "lbl tiny on-season")}
     ${labels(cx, cy + 68, "2. Peret · Nov.–Feb.\nAussaat im Schlamm", "lbl tiny on-season")}
     ${labels(cx - 56, cy - 36, "3. Schemu\nMärz–Juni\nErnte", "lbl tiny on-season")}
     ${panel(334, 28, 260, 240, "panel-bg")}
     ${label(350, 52, "Was passiert in den Phasen?", "lbl small strong", "start")}
     <rect x="350" y="68" width="12" height="12" rx="2" class="season-flood"/>
     ${labels(370, 78, "Überschwemmung: Felder stehen\nunter Wasser, Nährschlamm sinkt.\nBauern arbeiten an Tempeln/Gräbern.", "lbl tiny", "start", 15)}
     <rect x="350" y="132" width="12" height="12" rx="2" class="season-grow"/>
     ${labels(370, 142, "Aussaat: Felder werden mit dem\nMessseil neu eingeteilt; Kanäle\nund Schadufs leiten Wasser.", "lbl tiny", "start", 15)}
     <rect x="350" y="196" width="12" height="12" rx="2" class="season-harvest"/>
     ${labels(370, 206, "Ernte & Trockenzeit: Getreide\nernten, dreschen und als Steuer\nin den Speichern des Pharao lagern.", "lbl tiny", "start", 15)}`,
  );
}

export function hochkulturStern(): string {
  return cardGrid(
    "Fünf Merkmale einer frühen Hochkultur am Beispiel Ägyptens (ab etwa 3000 v. Chr.)",
    [
      {
        head: "1. Bewässerung & Überschüsse",
        body: "Kanäle, Dämme und Schöpfwerke\n(Schaduf) sichern mehrere Ernten und\nversorgen Städte und Handwerker.",
        colour: "#2278c2",
        icon: "🌊",
      },
      {
        head: "2. Staat & Verwaltung",
        body: "Gesetze, Steuern in Kornspeichern,\nLandvermessung nach der Flut\nund ein Beamtenapparat unter dem Pharao.",
        colour: "#a16c0e",
        icon: "⚖️",
      },
      {
        head: "3. Schrift & Kalender",
        body: "Hieroglyphen auf Papyrus halten\nSteuern, Verträge und Wissen fest;\nSonnenkalender mit 365 Tagen.",
        colour: "#1e6b4f",
        icon: "✒️",
      },
      {
        head: "4. Arbeitsteilung & Städte",
        body: "Neben Bauern arbeiten Schreiber,\nSteinmetze, Töpfer, Bäcker, Priester\nund Händler in spezialisierten Berufen.",
        colour: "#9a4b1f",
        icon: "🏛️",
      },
      {
        head: "5. Religion & Großbauten",
        body: "Tempel und Pyramiden drücken den\nGlauben an die göttliche Ordnung und\ndas Weiterleben im Jenseits aus.",
        colour: "#73357a",
        icon: "🔺",
      },
      {
        head: "Leistung bis heute",
        body: "Papier-Vorläufer Papyrus, Geometrie,\n365-Tage-Jahr und Baukunst wirken bis\nin unsere Gegenwart weiter.",
        colour: "#37536e",
        icon: "⏳",
      },
    ],
    3,
    640,
  );
}

export function hieroglyphenPapyrus(): string {
  return svg(
    620,
    230,
    "Schreibgeräte im Alten Ägypten: Papyrusblatt aus Nil-Pflanzen, Schreiberpalette und schematische Hieroglyphen",
    `${panel(8, 8, 604, 214, "panel-bg")}
     <rect x="26" y="28" width="276" height="174" rx="10" class="papyrus"/>
     ${label(42, 54, "Papyrusblatt (aus Schilfstreifen)", "lbl small strong", "start")}
     <path class="glyph" d="M52 108 Q74 82 96 108 Q74 134 52 108 Z"/>
     <circle cx="74" cy="108" r="5" fill="#6b4b1f"/>
     ${label(74, 148, "Auge", "lbl tiny")}
     <path class="glyph" d="M132 106 Q146 92 160 106 Q174 120 188 106"/>
     <path class="glyph" d="M132 122 Q146 108 160 122 Q174 136 188 122"/>
     ${label(160, 148, "Wasser", "lbl tiny")}
     <circle class="glyph" cx="238" cy="108" r="14"/>
     <circle cx="238" cy="108" r="4" fill="#6b4b1f"/>
     ${label(238, 148, "Sonne (Re)", "lbl tiny")}
     ${labels(42, 178, "Bilder stehen für ganze Wörter\noder für einzelne Laute (über 700 Zeichen).", "lbl tiny", "start", 15)}
     ${arrow(312, 115, 344, 115)}
     <rect x="352" y="28" width="242" height="174" rx="10" fill="var(--surface)" stroke="var(--f-line)"/>
     ${labels(368, 56, "Warum Schreiber so mächtig waren:", "lbl small strong", "start", 16)}
     ${labels(368, 88, "• Nur wenige konnten lesen und\n  schreiben (lange Ausbildung).\n• Sie vermaßen nach der Nilflut die\n  Felder neu und legten Abgaben fest.\n• „Wissen ist Macht“: Schreiber waren\n  von schwerer Feldarbeit befreit.", "lbl tiny", "start", 17)}`,
  );
}

export function totengerichtSzene(): string {
  return svg(
    640,
    260,
    "Jenseitsglaube im Alten Ägypten: Waage beim Totengericht mit Herz, Feder der Maat und Weiterleben als Lohn",
    `${panel(8, 8, 624, 244, "panel-bg")}
     ${label(320, 34, "Ägyptischer Jenseitsglaube und Totengericht (schematisch)", "lbl strong")}
     <line x1="190" y1="62" x2="190" y2="198" stroke="var(--f-wood)" stroke-width="6" stroke-linecap="round"/>
     <rect x="148" y="196" width="84" height="12" rx="4" fill="var(--f-wood)"/>
     <line x1="100" y1="84" x2="280" y2="84" stroke="var(--f-wood)" stroke-width="5" stroke-linecap="round"/>
     <line x1="112" y1="84" x2="100" y2="146" class="rope"/>
     <line x1="112" y1="84" x2="124" y2="146" class="rope"/>
     <path d="M90 146 H134 Q112 164 90 146 Z" fill="var(--f-yellow)" stroke="var(--f-line)"/>
     <circle cx="112" cy="134" r="11" class="heart"/>
     ${label(112, 180, "Herz des Toten", "lbl tiny strong")}
     <line x1="268" y1="84" x2="256" y2="146" class="rope"/>
     <line x1="268" y1="84" x2="280" y2="146" class="rope"/>
     <path d="M246 146 H290 Q268 164 246 146 Z" fill="var(--f-yellow)" stroke="var(--f-line)"/>
     <path d="M268 112 Q278 124 268 142 Q260 124 268 112 Z" fill="var(--f-blue)" stroke="var(--f-ink)"/>
     ${labels(264, 178, "Feder der Maat\n(Wahrheit & Recht)", "lbl tiny strong", "middle", 13)}
     ${panel(336, 52, 276, 178, "panel-bg")}
     ${labels(352, 76, "Drei Voraussetzungen für das Jenseits:", "lbl small strong", "start", 16)}
     ${labels(352, 106, "1. Gutes Leben: Das Herz darf beim\n    Wiegen nicht schwerer sein als\n    die Feder der Göttin Maat.\n2. Erhaltener Körper: Mumifizierung\n    bewahrt die Hülle für die Seele.\n3. Grabbeigaben & Grabmal: Schutz\n    und Versorgung für die Ewigkeit.", "lbl tiny", "start", 16)}
     ${label(190, 232, "Waage im Gleichgewicht = ewiges Leben", "lbl tiny strong")}`,
  );
}

export function gesellschaftspyramideAegypten(): string {
  const layers = [
    { label: "Pharao (Gottkönig)", sub: "oberster Herrscher, Priester, Richter", cls: "layer-1" },
    { label: "Wesir & hohe Priester", sub: "Regierung, Tempel, Bauleitung", cls: "layer-2" },
    { label: "Schreiber & Beamte", sub: "Steuern, Feldvermessung, Gesetze", cls: "layer-3" },
    { label: "Handwerker & Künstler", sub: "Bildhauer, Goldschmiede, Baumeister", cls: "layer-4" },
    { label: "Bauern (größte Mehrheit)", sub: "Ackerbau und Baufrondienst", cls: "layer-5" },
    { label: "Kriegsgefangene / Unfreie", sub: "schwere Arbeit ohne eigene Rechte", cls: "layer-6" },
  ];
  const cx = 240;
  const topY = 26;
  const h = 38;
  const gap = 3;
  return svg(
    640,
    290,
    "Die ägyptische Gesellschaftspyramide vom Pharao an der Spitze bis zu den Bauern und Unfreien an der Basis",
    `${panel(8, 8, 624, 274, "panel-bg")}
     ${layers
       .map((layer, i) => {
         const y = topY + i * (h + gap);
         const wTop = 58 + i * 56;
         const wBot = 58 + (i + 1) * 56;
         const pts = `${f1(cx - wTop / 2)},${y} ${f1(cx + wTop / 2)},${y} ${f1(cx + wBot / 2)},${y + h} ${f1(cx - wBot / 2)},${y + h}`;
         return `<polygon class="${layer.cls}" points="${pts}" stroke="var(--f-halo)" stroke-width="1.5"/>
           ${label(cx, y + 24, `${i + 1}`, "lbl tiny on-layer")}
           <line x1="${f1(cx + wBot / 2 + 4)}" y1="${y + h / 2}" x2="438" y2="${y + h / 2}" stroke="var(--f-line)" stroke-dasharray="3 3"/>
           ${label(446, y + 16, layer.label, "lbl small strong", "start")}
           ${label(446, y + 32, layer.sub, "lbl tiny muted", "start")}`;
       })
       .join("")}`,
  );
}

export function monarchieMerkmale(): string {
  return compare(
    "Herrschaftsform Monarchie im Alten Ägypten vs. heutige Maßstäbe",
    {
      head: "Merkmale der Pharao-Monarchie",
      colour: "#a16c0e",
      points: [
        "Alleinherrschaft eines Einzelnen auf Lebenszeit",
        "Amt wird in der Herrscherfamilie vererbt",
        "Machtfülle: Gesetze, Heer, Richter und Priester",
        "Religiöse Rechtfertigung als Gottkönig (Horus/Re)",
        "Keine Wahlen und keine Gewaltenteilung",
      ],
    },
    {
      head: "Beurteilung aus heutiger Sicht",
      colour: "#37536e",
      points: [
        "Starke Ordnung sicherte Dämme und Kornvorräte",
        "Aber: einfache Bauern hatten kaum Mitsprache",
        "Frondienste belasteten die Mehrheit stark",
        "Heute gilt: Alle Staatsgewalt geht vom Volk aus",
        "Macht braucht Kontrolle, Recht und Verfassung",
      ],
    },
    620,
  );
}
