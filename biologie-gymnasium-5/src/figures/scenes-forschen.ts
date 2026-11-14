/** Drawings of stations 1 and 2: methods, microscope, models, cells. */
import { arrow, cardGrid, chain, compare, f1, label, labels, panel, svg } from "./draw";

const C = {
  blue: "var(--f-blue)",
  green: "var(--f-green)",
  orange: "var(--f-orange)",
  red: "var(--f-red)",
  purple: "var(--f-purple)",
  pink: "var(--f-pink)",
  stone: "#59636e",
};

export const erkenntnisweg = (): string =>
  chain(
    "Der naturwissenschaftliche Erkenntnisweg in sechs Schritten von der Frage zur Folgerung",
    [
      { head: "1 Frage", body: "Aus einer Beobachtung\nentsteht eine Frage.", colour: C.blue, icon: "?" },
      { head: "2 Hypothese", body: "Eine begründete\nVermutung, die man\nprüfen kann.", colour: C.purple },
      { head: "3 Planen", body: "Nur einen Faktor\nverändern, Kontroll-\nansatz einplanen.", colour: C.orange },
      { head: "4 Durchführen", body: "Genau nach Plan\narbeiten, beobachten,\nmessen, notieren.", colour: C.green },
      { head: "5 Auswerten", body: "Daten ordnen,\nin Tabelle und\nDiagramm darstellen.", colour: C.pink },
      { head: "6 Folgern", body: "Hypothese bestätigt\noder widerlegt?\nNeue Frage?", colour: C.red },
    ],
    3,
  );

export const laborgeraete = (): string => {
  const item = (x: number, name: string, shape: string) =>
    `${panel(x, 10, 96, 150, "panel-bg")}${shape}${label(x + 48, 148, name, "lbl tiny strong", "middle")}`;
  return svg(
    600,
    170,
    "Wichtige Arbeitsgeräte im Biologieunterricht: Becherglas, Reagenzglas, Erlenmeyerkolben, Thermometer, Waage und Lupe",
    `${item(4, "Becherglas", `<path d="M26 50 L26 120 Q26 128 34 128 L74 128 Q82 128 82 120 L82 50" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/><rect x="27" y="92" width="54" height="35" fill="var(--f-sky)"/>`)}
     ${item(104, "Reagenzglas", `<path d="M142 40 L142 116 Q142 130 152 130 Q162 130 162 116 L162 40" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/><path d="M143 96 L143 116 Q143 129 152 129 Q161 129 161 116 L161 96 Z" fill="var(--f-orange)" opacity="0.6"/>`)}
     ${item(204, "Erlenmeyerkolben", `<path d="M242 40 L242 72 L218 128 L290 128 L266 72 L266 40" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/><path d="M229 102 L279 102 L290 128 L218 128 Z" fill="var(--f-green)" opacity="0.5"/>`)}
     ${item(304, "Thermometer", `<rect x="346" y="30" width="12" height="96" rx="6" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/><circle cx="352" cy="126" r="9" fill="var(--f-red)"/><rect x="349" y="70" width="6" height="56" fill="var(--f-red)"/>${[40, 60, 80, 100].map((y) => `<line x1="358" y1="${y}" x2="366" y2="${y}" stroke="var(--f-ink)"/>`).join("")}`)}
     ${item(404, "Waage", `<rect x="420" y="96" width="64" height="30" rx="6" fill="var(--f-stone)" stroke="var(--f-ink)"/><rect x="426" y="84" width="52" height="8" rx="3" fill="var(--f-line)"/><rect x="432" y="104" width="40" height="14" rx="2" fill="#dfe8d0"/>${label(452, 115, "12,5 g", "lbl tiny", "middle")}`)}
     ${item(504, "Lupe", `<circle cx="546" cy="70" r="24" fill="var(--f-sky)" stroke="var(--f-ink)" stroke-width="4"/><line x1="562" y1="88" x2="584" y2="118" stroke="var(--f-wood)" stroke-width="9" stroke-linecap="round"/>`)}`,
  );
};

export const sicherheitsregeln = (): string =>
  cardGrid(
    "Verhaltens- und Sicherheitsregeln im Fachraum und im Freiland",
    [
      { head: "Nach Anleitung", body: "Erst lesen, dann arbeiten.\nNur Versuche, die die\nLehrkraft freigibt.", colour: C.blue, icon: "📋" },
      { head: "Schutzbrille", body: "Bei Flüssigkeiten und\nWärme immer tragen.\nLange Haare zusammenbinden.", colour: C.orange, icon: "🥽" },
      { head: "Nichts probieren", body: "Im Fachraum nicht essen\noder trinken. Keine Probe\nin den Mund nehmen.", colour: C.red, icon: "🚫" },
      { head: "Ordnung", body: "Geräte zurückstellen,\nScherben melden, Reste\nnach Anweisung entsorgen.", colour: C.green, icon: "🧹" },
      { head: "Im Freiland", body: "Auf Wegen bleiben, nur\nwenige häufige Pflanzen\npflücken, Tiere schonen.", colour: "var(--f-forest)", icon: "🌿" },
      { head: "Danach", body: "Hände waschen,\nBeobachtungen sofort\nim Protokoll notieren.", colour: C.purple, icon: "🧼" },
    ],
    3,
  );

export const ablesefehler = (): string =>
  svg(
    600,
    210,
    "Ablesefehler am Thermometer: Nur wer auf Höhe der Flüssigkeitssäule schaut, liest richtig ab",
    `${panel(8, 8, 290, 194, "panel-bg")}
     <rect x="140" y="26" width="16" height="150" rx="8" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/>
     <rect x="144" y="100" width="8" height="76" fill="var(--f-red)"/>
     <circle cx="148" cy="180" r="11" fill="var(--f-red)"/>
     ${[40, 60, 80, 100, 120, 140, 160].map((y, i) => `<line x1="156" y1="${y}" x2="166" y2="${y}" stroke="var(--f-ink)"/>${label(172, y + 4, `${60 - i * 10}`, "lbl tiny", "start")}`).join("")}
     <circle cx="40" cy="60" r="10" fill="var(--f-skin)" stroke="var(--f-ink)"/>${label(40, 44, "zu hoch", "lbl tiny", "middle")}
     <line x1="50" y1="64" x2="200" y2="112" stroke="var(--f-red)" stroke-dasharray="4 3"/>
     <circle cx="40" cy="100" r="10" fill="var(--f-skin)" stroke="var(--f-ink)"/>${label(40, 124, "richtig", "lbl tiny strong", "middle")}
     <line x1="50" y1="100" x2="200" y2="100" stroke="var(--f-green)" stroke-width="2"/>
     <circle cx="40" cy="150" r="10" fill="var(--f-skin)" stroke="var(--f-ink)"/>${label(40, 174, "zu tief", "lbl tiny", "middle")}
     <line x1="50" y1="146" x2="200" y2="90" stroke="var(--f-red)" stroke-dasharray="4 3"/>
     ${label(220, 104, "30 °C", "lbl small strong", "start")}
     ${panel(306, 8, 286, 194, "panel-bg")}
     ${label(320, 34, "Typische Fehlerquellen", "lbl small strong", "start")}
     ${labels(320, 60, "• schräg abgelesen\n• Waage nicht auf null gestellt\n• Ansätze unterschiedlich behandelt\n• nur ein einziger Durchgang\n• Probe verunreinigt\n• Beobachtung erst später notiert", "lbl tiny", "start", 20)}`,
  );

export const nachweiseTafel = (): string =>
  cardGrid(
    "Drei einfache Nachweisreaktionen mit ihren positiven Ergebnissen",
    [
      { head: "Stärkenachweis", body: "Iod-Kaliumiodid-Lösung\n(braun) auf die Probe:\nblauschwarz = Stärke", colour: "#283593", icon: "🥔" },
      { head: "Fettfleckprobe", body: "Probe auf Papier reiben,\ntrocknen lassen: bleibt ein\ndurchscheinender Fleck = Fett", colour: "#b8860b", icon: "🥜" },
      { head: "Kalkwasserprobe", body: "Gas durch Kalkwasser leiten:\nmilchig trüb =\nKohlenstoffdioxid", colour: C.stone, icon: "💨" },
    ],
    3,
  );

export const mikroskopBau = (): string =>
  svg(
    600,
    300,
    "Bauteile des Lichtmikroskops mit Okular, Tubus, Objektivrevolver, Objektiven, Objekttisch, Blende, Lampe sowie Grob- und Feintrieb",
    `${panel(8, 8, 584, 284, "panel-bg")}
     <rect x="210" y="262" width="170" height="20" rx="6" fill="var(--f-line)"/>
     <path d="M340 262 L340 140 Q340 108 312 98 L286 90" fill="none" stroke="var(--f-line)" stroke-width="22" stroke-linecap="round"/>
     <rect x="250" y="40" width="30" height="96" rx="6" fill="var(--f-ink)" opacity="0.85" transform="rotate(-10 265 88)"/>
     <rect x="246" y="18" width="26" height="30" rx="5" fill="var(--f-blue)" transform="rotate(-10 259 33)"/>
     <path d="M246 136 L300 136 L292 150 L254 150 Z" fill="var(--f-stone)"/>
     <rect x="256" y="150" width="10" height="22" rx="3" fill="var(--f-orange)"/>
     <rect x="272" y="150" width="10" height="28" rx="3" fill="var(--f-orange)" opacity="0.8"/>
     <rect x="216" y="190" width="120" height="10" rx="3" fill="var(--f-stone)"/>
     <rect x="250" y="186" width="44" height="4" fill="var(--f-sky)"/>
     <rect x="258" y="204" width="28" height="8" rx="2" fill="var(--f-line)"/>
     <circle cx="272" cy="236" r="10" fill="var(--f-yellow)" stroke="var(--f-ink)"/>
     <circle cx="350" cy="196" r="14" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/>
     <circle cx="350" cy="196" r="7" fill="var(--f-white)" stroke="var(--f-ink)"/>
     ${[
       [258, 30, "Okular (z. B. 10-fach)", 30],
       [262, 80, "Tubus", 70],
       [272, 142, "Objektivrevolver", 110],
       [262, 166, "Objektive (4-, 10-, 40-fach)", 150],
       [230, 194, "Objekttisch mit Objektträger", 190],
       [270, 208, "Blende", 226],
       [266, 236, "Lampe", 262],
     ]
       .map(([x, y, t, ly]) => `<line x1="${x}" y1="${y}" x2="190" y2="${ly}" stroke="var(--f-ink)" opacity="0.6"/>${label(184, Number(ly) + 4, String(t), "lbl tiny", "end")}`)
       .join("")}
     <line x1="364" y1="196" x2="410" y2="196" stroke="var(--f-ink)" opacity="0.6"/>${labels(416, 192, "Grobtrieb (außen)\nFeintrieb (innen)", "lbl tiny", "start", 14)}
     <line x1="340" y1="160" x2="410" y2="120" stroke="var(--f-ink)" opacity="0.6"/>${label(416, 124, "Stativ", "lbl tiny", "start")}
     ${labels(416, 40, "Gesamtvergrößerung =\nOkular · Objektiv\n10 · 40 = 400-fach", "lbl small strong", "start", 18)}`,
  );

export const praeparatSchritte = (): string => {
  const slide = (x: number) =>
    `<rect x="${x + 10}" y="70" width="110" height="26" rx="2" fill="var(--f-sky)" opacity="0.6" stroke="var(--f-ink)"/>`;
  return svg(
    600,
    190,
    "Ein Frischpräparat herstellen in vier Schritten: Wassertropfen, Objekt, Deckgläschen schräg absenken, anfärben",
    [
      [
        "1 Wassertropfen",
        `<ellipse cx="65" cy="68" rx="10" ry="5" fill="var(--f-river)"/>`,
        "Tropfen Wasser auf\nden Objektträger",
      ],
      [
        "2 Objekt auflegen",
        `<ellipse cx="215" cy="68" rx="10" ry="5" fill="var(--f-river)"/><rect x="205" y="62" width="22" height="6" fill="#f6eecf" stroke="#b28a3a"/>`,
        "z. B. Zwiebelhaut\nflach und ohne Falten",
      ],
      [
        "3 Deckgläschen",
        `<line x1="330" y1="66" x2="374" y2="40" stroke="var(--f-ink)" stroke-width="3"/>${arrow(380, 36, 380, 60, "arrow thin")}`,
        "schräg ansetzen und\nlangsam absenken:\nkeine Luftblasen",
      ],
      [
        "4 Anfärben",
        `<rect x="490" y="62" width="40" height="6" fill="#9fb7e6" stroke="var(--f-ink)"/><circle cx="480" cy="64" r="5" fill="var(--f-purple)"/><rect x="534" y="58" width="10" height="16" fill="var(--f-white)" stroke="var(--f-ink)"/>`,
        "Farbstoff an eine Seite,\nFilterpapier saugt ihn\nunter dem Glas durch",
      ],
    ]
      .map(([head, extra, text], i) => {
        const x = 8 + i * 148;
        return `${panel(x, 8, 140, 174, "panel-bg")}${label(x + 70, 30, head, "lbl small strong", "middle")}${slide(x)}${extra}${labels(x + 70, 124, text, "lbl tiny", "middle", 15)}`;
      })
      .join(""),
  );
};

export const zeichenregeln = (): string =>
  compare(
    "Regeln für eine biologische Zeichnung im Vergleich mit typischen Fehlern",
    {
      head: "So gelingt die Zeichnung",
      colour: C.green,
      points: [
        "Bleistift, klare durchgehende Linien",
        "nur zeichnen, was du wirklich siehst",
        "groß genug, etwa halbe Seite",
        "Beschriftung rechts, Linien mit Lineal",
        "Überschrift, Objekt und Vergrößerung",
      ],
    },
    {
      head: "Typische Fehler",
      colour: C.red,
      points: [
        "Schatten, Farbe und Schraffur",
        "Teile aus dem Schulbuch dazugemalt",
        "winzige Zeichnung in der Ecke",
        "Beschriftungslinien kreuzen sich",
        "keine Angabe, was gezeigt wird",
      ],
    },
  );

export const modellOriginal = (): string =>
  svg(
    600,
    230,
    "Funktionsmodell der Atmung mit Glasglocke, Luftballons und Gummihaut im Vergleich zu Lunge und Zwerchfell",
    `${panel(8, 8, 280, 214, "panel-bg")}
     ${label(148, 30, "Modell", "lbl small strong", "middle")}
     <path d="M88 60 Q148 30 208 60 L208 180 L88 180 Z" fill="var(--f-sky)" opacity="0.5" stroke="var(--f-ink)" stroke-width="2"/>
     <line x1="148" y1="40" x2="148" y2="90" stroke="var(--f-ink)" stroke-width="4"/>
     <path d="M148 90 L124 104 M148 90 L172 104" stroke="var(--f-ink)" stroke-width="3"/>
     <circle cx="120" cy="124" r="20" fill="#f6c1b5" stroke="#b5544a"/><circle cx="176" cy="124" r="20" fill="#f6c1b5" stroke="#b5544a"/>
     <path d="M88 180 Q148 204 208 180" fill="none" stroke="var(--f-orange)" stroke-width="4"/>
     ${label(214, 112, "Ballons", "lbl tiny", "start")}${label(214, 200, "Gummihaut", "lbl tiny", "start")}${label(214, 70, "Glasglocke", "lbl tiny", "start")}
     ${panel(296, 8, 296, 214, "panel-bg")}
     ${label(444, 30, "Modell und Original", "lbl small strong", "middle")}
     ${labels(310, 56, "Ballons ↔ Lungenflügel\nGlasglocke ↔ Brustkorb\nGummihaut ↔ Zwerchfell\nZiehen an der Haut ↔ Einatmen\n\nAnders als im Original:\nkeine Lungenbläschen, kein Blut,\nGlas bewegt sich nicht wie Rippen", "lbl tiny", "start", 17)}`,
  );

export const strukturFunktion = (): string =>
  cardGrid(
    "Kennzeichen von Modellen in der Biologie: Strukturmodelle zeigen den Bau, Funktionsmodelle zeigen, wie etwas arbeitet",
    [
      { head: "Strukturmodell", body: "zeigt den Bau,\nz. B. Torso, Skelett,\nZellmodell", colour: C.blue },
      { head: "Funktionsmodell", body: "zeigt, wie etwas\narbeitet, z. B. Lungen-\nmodell, Armmodell", colour: C.orange },
      { head: "Vereinfacht", body: "hebt Wichtiges hervor,\nlässt Nebensächliches\nweg, anderes Material", colour: C.purple },
      { head: "Grenzen", body: "Kein Modell zeigt alles:\nVergleiche es immer\nmit dem Original.", colour: C.red },
    ],
    4,
  );

export const protokollAufbau = (): string =>
  svg(
    600,
    250,
    "Aufbau eines naturwissenschaftlichen Protokolls mit Titel, Aufbau und Durchführung, Beobachtung, Auswertung und Interpretation",
    `<rect x="150" y="8" width="300" height="234" rx="8" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/>
     ${[
       ["Titel", "Frage oder Thema, Datum, Namen", C.blue],
       ["Aufbau und Durchführung", "Material, Skizze, Arbeitsschritte", C.orange],
       ["Beobachtung", "nur, was man sieht und misst", C.green],
       ["Auswertung und Interpretation", "Erklärung, Antwort auf die Frage", C.purple],
     ]
       .map(
         ([h, t, c], i) =>
           `<rect x="162" y="${20 + i * 55}" width="276" height="46" rx="6" fill="${c}" opacity="0.18"/><rect x="162" y="${20 + i * 55}" width="6" height="46" fill="${c}"/>${label(176, 38 + i * 55, h, "lbl small strong", "start")}${label(176, 56 + i * 55, t, "lbl tiny", "start")}`,
       )
       .join("")}
     ${labels(470, 150, "Beobachtung und\nDeutung bleiben\ngetrennt.", "lbl small strong", "start", 17)}
     ${labels(18, 40, "Beispiel\nBeobachtung:\n„Das Kalkwasser\nwird trüb.“\n\nDeutung:\n„Die Luft enthält\nKohlenstoff-\ndioxid.“", "lbl tiny", "start", 15)}`,
  );

export const tabelleDiagramm = (): string => {
  const rows: Array<[string, number]> = [
    ["Ruhe", 80],
    ["Gehen", 100],
    ["Rennen", 165],
  ];
  return svg(
    600,
    230,
    "Dieselben Beispielwerte als Tabelle und als Säulendiagramm: Herzschläge pro Minute in Ruhe, beim Gehen und beim Rennen",
    `${panel(8, 8, 240, 214, "panel-bg")}
     ${label(128, 32, "Tabelle", "lbl small strong", "middle")}
     <rect x="24" y="44" width="208" height="28" fill="var(--f-blue)" opacity="0.25"/>
     ${label(32, 63, "Tätigkeit", "lbl tiny strong", "start")}${label(224, 63, "Schläge pro Minute", "lbl tiny strong", "end")}
     ${rows.map(([t, v], i) => `<line x1="24" y1="${100 + i * 30}" x2="232" y2="${100 + i * 30}" stroke="var(--f-line)" opacity="0.5"/>${label(32, 92 + i * 30, t, "lbl tiny", "start")}${label(224, 92 + i * 30, String(v), "lbl tiny", "end")}`).join("")}
     ${label(128, 200, "Beispielwerte", "lbl tiny muted", "middle")}
     ${arrow(254, 115, 290, 115)}
     ${panel(296, 8, 296, 214, "panel-bg")}
     ${label(444, 32, "Säulendiagramm", "lbl small strong", "middle")}
     <line x1="340" y1="190" x2="570" y2="190" stroke="var(--f-ink)"/><line x1="340" y1="50" x2="340" y2="190" stroke="var(--f-ink)"/>
     ${[0, 50, 100, 150].map((v) => `<line x1="336" y1="${190 - v * 0.8}" x2="340" y2="${190 - v * 0.8}" stroke="var(--f-ink)"/>${label(332, 194 - v * 0.8, String(v), "lbl tiny", "end")}`).join("")}
     ${rows.map(([t, v], i) => `<rect x="${362 + i * 70}" y="${f1(190 - v * 0.8)}" width="40" height="${f1(v * 0.8)}" fill="${[C.blue, C.orange, C.red][i]}"/>${label(382 + i * 70, 206, t, "lbl tiny", "middle")}`).join("")}
     ${label(318, 46, "Schläge", "lbl tiny", "start")}`,
  );
};

export const quellencheck = (): string =>
  cardGrid(
    "Fünf Fragen an eine Quelle, bevor du ihr eine Antwort entnimmst",
    [
      { head: "Wer?", body: "Wer hat den Text\ngeschrieben? Fachleute,\nVerlag, Behörde?", colour: C.blue },
      { head: "Wann?", body: "Wie alt ist die Quelle?\nIst das Wissen noch\naktuell?", colour: C.orange },
      { head: "Für wen?", body: "Schulbuch, Kinderlexikon,\nZeitschrift oder\nWerbung?", colour: C.purple },
      { head: "Was genau?", body: "Welche Stelle beantwortet\nmeine Frage? Text,\nTabelle oder Bild?", colour: C.green },
      { head: "Belegt?", body: "Nennt die Quelle\nMessungen, Versuche\noder Fachleute?", colour: C.red },
      { head: "Eigene Worte", body: "Antwort mit Fachbegriffen\nformulieren und die\nQuelle angeben.", colour: C.stone },
    ],
    3,
  );

export const fachsprache = (): string =>
  compare(
    "Alltagssprache und Fachsprache im Vergleich",
    {
      head: "Alltagssprache",
      colour: C.stone,
      points: [
        "„Die Pflanze trinkt Wasser.“",
        "„Das Herz pumpt Luft.“",
        "„Der Muskel drückt den Arm hoch.“",
        "„Im Mikroskop ist es größer.“",
        "„Blütenstaub“",
      ],
    },
    {
      head: "Fachsprache",
      colour: C.blue,
      points: [
        "Die Wurzel nimmt Wasser auf.",
        "Das Herz pumpt Blut.",
        "Der Bizeps zieht den Unterarm hoch.",
        "Das Mikroskop vergrößert 100-fach.",
        "Pollen",
      ],
    },
  );

export const rediVersuch = (): string => {
  const jar = (x: number, title: string, cover: string, maggots: boolean, note: string) =>
    `${panel(x, 8, 190, 212, "panel-bg")}${label(x + 95, 30, title, "lbl small strong", "middle")}
     <path d="M${x + 45} 60 L${x + 45} 170 Q${x + 45} 180 ${x + 55} 180 L${x + 135} 180 Q${x + 145} 180 ${x + 145} 170 L${x + 145} 60" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/>
     ${cover}
     <ellipse cx="${x + 95}" cy="166" rx="34" ry="10" fill="#c0605a"/>
     ${maggots ? Array.from({ length: 6 }, (_, i) => `<ellipse cx="${x + 70 + i * 10}" cy="${160 - (i % 2) * 4}" rx="4" ry="2" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="0.6"/>`).join("") : ""}
     ${labels(x + 95, 198, note, "lbl tiny", "middle", 13)}`;
  return svg(
    600,
    228,
    "Redis Versuch von 1668 mit drei Gläsern: offen, mit Gaze und fest verschlossen; nur ins offene Glas gelangen Fliegen und es entstehen Maden",
    `${jar(8, "offen", "", true, "Fliegen landen:\nMaden entstehen")}
     ${jar(205, "mit Gaze", `<line x1="250" y1="60" x2="350" y2="60" stroke="var(--f-ink)" stroke-dasharray="2 2" stroke-width="3"/>`, false, "Eier nur auf der Gaze,\nkeine Maden im Fleisch")}
     ${jar(402, "verschlossen", `<rect x="445" y="52" width="104" height="10" fill="var(--f-line)"/>`, false, "keine Fliegen:\nkeine Maden")}`,
  );
};

export const wissenZeitleiste = (): string => {
  const events: Array<[number, string, string]> = [
    [40, "um 160", "Galen: Blut entsteht\nständig neu in der Leber"],
    [170, "1628", "Harvey: Das Blut\nfließt im Kreis"],
    [300, "1665", "Hooke sieht im Kork\nkleine Kammern: „Zellen“"],
    [430, "1668", "Redi: Maden entstehen\naus Fliegeneiern"],
    [560, "heute", "Alle Lebewesen\nbestehen aus Zellen"],
  ];
  return svg(
    620,
    170,
    "Zeitleiste: Wie sich Wissen in der Biologie verändert hat, von Galen über Harvey, Hooke und Redi bis heute",
    `<line x1="20" y1="60" x2="600" y2="60" stroke="var(--f-line)" stroke-width="4"/>
     ${events.map(([x, year, text], i) => `<circle cx="${x}" cy="60" r="9" fill="${[C.stone, C.red, C.green, C.orange, C.blue][i]}"/>${label(x, 40, year, "lbl small strong", "middle")}${labels(x, 90, text, "lbl tiny", "middle", 15)}`).join("")}`,
  );
};

export const kennzeichenLeben = (): string => {
  const items: Array<[string, string]> = [
    ["Reize & Reaktion", "Informationen aufnehmen,\nverarbeiten, reagieren"],
    ["Bewegung", "aktive Bewegung\n(auch Pflanzenteile)"],
    ["Stoffwechsel", "Stoffe aufnehmen,\numwandeln, abgeben"],
    ["Fortpflanzung", "Nachkommen\nhervorbringen"],
    ["Wachstum", "größer werden"],
    ["Entwicklung", "sich im Lauf des\nLebens verändern"],
  ];
  const colours = [C.blue, C.orange, C.green, C.pink, C.purple, C.red];
  return svg(
    600,
    300,
    "Die grundlegenden Kennzeichen aller Lebewesen rund um die Zelle als kleinste Einheit des Lebens",
    `<circle cx="300" cy="150" r="54" fill="#cfe8b0" stroke="var(--f-forest)" stroke-width="4"/>
     <circle cx="316" cy="140" r="12" fill="#b39ddb"/>
     ${labels(300, 186, "aus Zellen\naufgebaut", "lbl tiny strong", "middle", 13)}
     ${items
       .map(([h, t], i) => {
         const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
         const x = 300 + 200 * Math.cos(a);
         const y = 150 + 108 * Math.sin(a);
         return `<line x1="${f1(300 + 58 * Math.cos(a))}" y1="${f1(150 + 58 * Math.sin(a))}" x2="${f1(300 + 150 * Math.cos(a))}" y2="${f1(150 + 80 * Math.sin(a))}" stroke="${colours[i]}" stroke-width="3"/>${panel(x - 82, y - 26, 164, 52, "panel-bg")}<rect x="${f1(x - 82)}" y="${f1(y - 26)}" width="164" height="6" rx="3" fill="${colours[i]}"/>${label(x, y - 6, h, "lbl small strong", "middle")}${labels(x, y + 9, t, "lbl tiny", "middle", 12)}`;
       })
       .join("")}`,
  );
};

export const lebewesenVergleich = (): string =>
  svg(
    600,
    200,
    "Vergleich: Katze, Kerzenflamme und Saugroboter erfüllen einzelne Kennzeichen, aber nur die Katze erfüllt alle",
    `${panel(8, 8, 584, 184, "panel-bg")}
     ${["Kennzeichen", "Katze", "Kerzenflamme", "Saugroboter"].map((h, i) => label(i === 0 ? 24 : 250 + (i - 1) * 120, 34, h, "lbl small strong", i === 0 ? "start" : "middle")).join("")}
     ${[
       ["reagiert auf Reize", "✓", "–", "✓ (Sensor)"],
       ["bewegt sich aktiv", "✓", "flackert", "✓ (Motor)"],
       ["Stoffwechsel", "✓", "verbrennt Wachs", "– (Strom)"],
       ["wächst", "✓", "–", "–"],
       ["pflanzt sich fort", "✓", "–", "–"],
       ["besteht aus Zellen", "✓", "–", "–"],
     ]
       .map((row, r) => row.map((cell, c) => label(c === 0 ? 24 : 250 + (c - 1) * 120, 60 + r * 22, cell, c === 0 ? "lbl tiny" : "lbl tiny strong", c === 0 ? "start" : "middle")).join(""))
       .join("")}`,
  );

export const zellenVergleich = (): string =>
  svg(
    600,
    240,
    "Tierzelle und Pflanzenzelle im Vergleich mit Zellmembran, Zellplasma, Zellkern sowie Zellwand, Chloroplasten und Vakuole",
    `${panel(8, 8, 284, 224, "panel-bg")}
     ${label(150, 30, "Tierzelle", "lbl small strong", "middle")}
     <path d="M60 130 C 52 80, 130 50, 180 62 C 240 74, 266 110, 244 160 C 222 206, 120 204, 92 186 C 72 172, 64 154, 60 130 Z" fill="#fbe1df" stroke="#c0605a" stroke-width="2"/>
     <circle cx="160" cy="128" r="22" fill="#b39ddb"/>
     ${label(160, 132, "Zellkern", "lbl tiny", "middle")}
     ${label(80, 216, "Zellmembran · Zellplasma", "lbl tiny", "start")}
     ${panel(300, 8, 292, 224, "panel-bg")}
     ${label(446, 30, "Pflanzenzelle", "lbl small strong", "middle")}
     <rect x="324" y="46" width="244" height="160" rx="8" fill="#cfe8b0" stroke="#4e7d2c" stroke-width="9"/>
     <rect x="333" y="55" width="226" height="142" rx="5" fill="#e9f5d6" stroke="#6a9a3a" stroke-width="2"/>
     <rect x="372" y="74" width="140" height="104" rx="34" fill="#d8eef7" stroke="#8bb7c9"/>
     ${[[346, 70], [352, 184], [540, 76], [544, 170], [460, 190]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="6" fill="var(--f-green)"/>`).join("")}
     <circle cx="540" cy="124" r="16" fill="#b39ddb"/>
     ${label(442, 130, "Vakuole", "lbl tiny strong", "middle")}
     ${label(446, 224, "Zellwand · Chloroplasten · Zellkern", "lbl tiny", "middle")}`,
  );

export const organisationsebenen = (): string =>
  chain(
    "Organisationsebenen vom Zellbaustein bis zum ganzen Lebewesen am Beispiel des Menschen",
    [
      { head: "Zelle", body: "z. B. Muskelzelle", colour: C.pink },
      { head: "Gewebe", body: "viele gleichartige\nZellen: Muskelgewebe", colour: C.red },
      { head: "Organ", body: "verschiedene Gewebe\narbeiten zusammen: Herz", colour: C.orange },
      { head: "Organsystem", body: "Organe mit gemeinsamer\nAufgabe: Blutkreislauf", colour: C.purple },
      { head: "Organismus", body: "alle Organsysteme:\nder ganze Mensch", colour: C.blue },
    ],
    5,
    700,
  );

export const gewebeMikroskop = (): string => {
  const view = (cx: number, inner: string, title: string, note: string) =>
    `<defs><clipPath id="clip-${cx}"><circle cx="${cx}" cy="110" r="80"/></clipPath></defs><circle cx="${cx}" cy="110" r="84" fill="#20201c"/><g clip-path="url(#clip-${cx})"><rect x="${cx - 90}" y="20" width="180" height="180" fill="#fbf5df"/>${inner}</g>${label(cx, 214, title, "lbl small strong", "middle")}${label(cx, 232, note, "lbl tiny", "middle")}`;
  const onion = Array.from({ length: 6 }, (_, r) =>
    Array.from({ length: 4 }, (_, c) => {
      const x = 60 + c * 56 + (r % 2) * 28;
      const y = 30 + r * 30;
      return `<rect x="${x}" y="${y}" width="56" height="30" fill="none" stroke="#b28a3a" stroke-width="2"/><ellipse cx="${x + 18}" cy="${y + 15}" rx="4" ry="5" fill="#8d5a2b"/>`;
    }).join(""),
  ).join("");
  const mouth = [
    [400, 70], [460, 60], [430, 120], [490, 120], [380, 140], [450, 170],
  ]
    .map(([x, y], i) => `<path d="M${x - 26} ${y - 8} L${x - 4} ${y - 24} L${x + 24} ${y - 14} L${x + 26} ${y + 14} L${x} ${y + 24} L${x - 22} ${y + 12} Z" fill="#c9d6f2" stroke="#4b5fa8" stroke-width="1.5" transform="rotate(${i * 17} ${x} ${y})"/><circle cx="${x}" cy="${y}" r="5" fill="#3949ab"/>`)
    .join("");
  return svg(
    600,
    244,
    "Zwei Gewebe im Mikroskop: Zwiebelhaut mit rechteckigen Zellen und Mundschleimhaut mit unregelmäßigen, flachen Zellen",
    `${view(160, onion, "Zwiebelhaut (Pflanze)", "eckig, mit Zellwand, dicht an dicht")}${view(440, mouth, "Mundschleimhaut (Mensch)", "unregelmäßig, ohne Zellwand, angefärbt")}`,
  );
};
