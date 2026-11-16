/**
 * Drawings of station 1 (NT6 1.1): inquiry, errors, observing and
 * recording, microscope and binocular, slides, models, diagrams, sources.
 * Seven scenes are taken over from Biologie 5 Gymnasium and adapted.
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
};

export const erkenntnisweg = (): string =>
  chain(
    "Der naturwissenschaftliche Erkenntnisweg in sechs Schritten von der Frage zur Folgerung",
    [
      { head: "1 Frage", body: "Aus einer Beobachtung\nentsteht eine Frage.", colour: C.blue, icon: "?" },
      { head: "2 Hypothese", body: "Eine begründete\nVermutung, die man\nprüfen kann.", colour: C.purple },
      { head: "3 Planen", body: "Eine Variable ändern,\nKonstanten festlegen,\nKontrollversuch.", colour: C.orange },
      { head: "4 Durchführen", body: "Genau nach Plan\narbeiten, beobachten,\nmessen, notieren.", colour: C.green },
      { head: "5 Auswerten", body: "Daten ordnen,\nin Tabelle und\nDiagramm darstellen.", colour: C.pink },
      { head: "6 Folgern", body: "Hypothese bestätigt\noder widerlegt?\nNeue Frage?", colour: C.red },
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

export const strukturFunktion = (): string =>
  cardGrid(
    "Kennzeichen von Modellen in der Biologie: Strukturmodelle zeigen den Bau, Funktionsmodelle zeigen, wie etwas arbeitet",
    [
      { head: "Strukturmodell", body: "zeigt den Bau,\nz. B. Vogelskelett,\nBlütenmodell", colour: C.blue },
      { head: "Funktionsmodell", body: "zeigt, wie etwas\narbeitet, z. B. Flügel-\nmodell aus Papier", colour: C.orange },
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
     ${labels(18, 40, "Beispiel\nBeobachtung:\n„In Schale A\nsind 18 von 20\nSamen gekeimt.“\n\nDeutung:\n„Kresse braucht\nWasser zum\nKeimen.“", "lbl tiny", "start", 15)}`,
  );

export const planungskriterien = (): string =>
  cardGrid(
    "Kriterien für die Planung einer Untersuchung: Frage, Hypothese, Variable, Konstanten, Kontrollversuch, Wiederholungen und Messgröße",
    [
      { head: "Frage", body: "Genau eine Frage,\ndie man mit einer\nUntersuchung prüfen kann", colour: C.blue, icon: "?" },
      { head: "Hypothese", body: "„Wenn …, dann …“\nmit Begründung;\nsie kann falsch sein", colour: C.purple },
      { head: "Variable", body: "Nur ein Faktor wird\nzwischen den Ansätzen\nverändert", colour: C.orange },
      { head: "Konstanten", body: "Alle anderen Faktoren\nbleiben in allen\nAnsätzen gleich", colour: C.green },
      { head: "Kontrollversuch", body: "Ein Ansatz ohne die\nVeränderung zum\nVergleich", colour: C.red },
      { head: "Messen", body: "Was wird wie oft\nund womit gemessen?\nMehrere Durchgänge", colour: C.stone },
    ],
    3,
  );

export const variablenSchema = (): string =>
  svg(
    600,
    250,
    "Keimungsversuch mit Variable und Konstanten: Ansatz A feucht, Kontrollversuch trocken; Licht, Temperatur und Samenzahl bleiben gleich",
    `${panel(8, 8, 584, 234, "panel-bg")}
     ${[
       [40, "Versuchsansatz", "trockene Watte", "var(--f-orange)"],
       [320, "Kontrollversuch", "feuchte Watte", "var(--f-blue)"],
     ]
       .map(
         ([x, h, w, c]) => `<rect x="${x}" y="30" width="240" height="120" rx="12" fill="${c}" opacity="0.15"/>${label(Number(x) + 120, 54, String(h), "lbl small strong", "middle")}
         <path d="M${Number(x) + 40} 120 L${Number(x) + 200} 120 L${Number(x) + 190} 134 L${Number(x) + 50} 134 Z" fill="var(--f-white)" stroke="var(--f-ink)"/>
         ${Array.from({ length: 8 }, (_, i) => `<ellipse cx="${Number(x) + 62 + i * 16}" cy="116" rx="3" ry="2" fill="var(--f-earth)"/>`).join("")}
         ${label(Number(x) + 120, 84, `Variable: ${w}`, "lbl tiny strong", "middle")}`,
       )
       .join("")}
     ${label(300, 178, "Konstanten in beiden Ansätzen", "lbl small strong", "middle")}
     ${label(300, 200, "gleich viele Samen derselben Sorte · Licht · 20 °C · gleiche Schale · gleiche Dauer", "lbl tiny", "middle")}
     ${label(300, 224, "Nur so lässt sich ein Unterschied auf die Variable zurückführen.", "lbl tiny strong", "middle")}`,
  );

export const fehlerVermeiden = (): string =>
  cardGrid(
    "Fehlerquellen bei einer Untersuchung und wie man sie vermeidet",
    [
      { head: "Zu wenige Samen", body: "Zufall wirkt stark.\n→ Viele Samen und\nmehrere Ansätze", colour: C.blue },
      { head: "Zwei Variablen", body: "Ursache bleibt unklar.\n→ Immer nur einen\nFaktor verändern", colour: C.orange },
      { head: "Kein Kontrollversuch", body: "Kein Vergleich möglich.\n→ Kontrollansatz\ngleich mitstarten", colour: C.red },
      { head: "Ungenaues Messen", body: "Schräg abgelesen,\nWaage nicht genullt.\n→ Messregeln beachten", colour: C.purple },
      { head: "Spät notiert", body: "Werte vergessen.\n→ Sofort ins\nProtokoll schreiben", colour: C.green },
      { head: "Erwartung", body: "Man sieht, was man\nerwartet. → Erst\nbeobachten, dann deuten", colour: C.stone },
    ],
    3,
  );

export const beobachtungsbogen = (): string =>
  svg(
    600,
    260,
    "Beobachtungsbogen für Vögel am Futterhaus mit vorgegebenen Kriterien: Art, Uhrzeit, Anzahl und Verhalten in einer Strichliste",
    `<rect x="8" y="8" width="584" height="244" rx="10" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/>
     ${label(24, 34, "Beobachtungsbogen · Vögel am Futterhaus · 14. 1. · 7:30 bis 7:45 Uhr", "lbl small strong", "start")}
     ${["Art", "Anzahl (Strichliste)", "Verhalten", "Fresstechnik"].map((h, i) => `<rect x="${24 + i * 140}" y="48" width="138" height="26" fill="var(--f-panel)" stroke="var(--f-line)"/>${label(30 + i * 140, 66, h, "lbl tiny strong", "start")}`).join("")}
     ${[
       ["Kohlmeise", "|||| |", "hängt kopfüber", "hackt Körner auf"],
       ["Amsel", "||", "frisst am Boden", "pickt Äpfel"],
       ["Buchfink", "|||", "sitzt auf dem Rand", "knackt Samen"],
       ["Rotkehlchen", "|", "vertreibt andere", "pickt Haferflocken"],
     ]
       .map((row, r) => row.map((c, i) => `<rect x="${24 + i * 140}" y="${76 + r * 30}" width="138" height="28" fill="none" stroke="var(--f-line)"/>${label(30 + i * 140, 95 + r * 30, c, "lbl tiny", "start")}`).join(""))
       .join("")}
     ${labels(24, 214, "Kriterien vorher festlegen: Was, wann, wie lange und wie wird gezählt?\nNur notieren, was man sieht. Deutungen kommen später.", "lbl tiny", "start", 16)}`,
  );

export const vergroesserung = (): string =>
  cardGrid(
    "Lupe, Binokular und Lichtmikroskop im Vergleich: Vergrößerung, Bild und passende Objekte",
    [
      { head: "Lupe", body: "etwa 3- bis 10-fach\nfür Blüten, Samen,\nkleine Tiere im Freiland", colour: C.green, icon: "🔍" },
      { head: "Binokular", body: "etwa 10- bis 40-fach\nräumliches Bild, Auflicht\nfür ganze Objekte", colour: C.orange, icon: "👀" },
      { head: "Lichtmikroskop", body: "etwa 40- bis 400-fach\nLicht von unten durch\nsehr dünne Präparate", colour: C.blue, icon: "🔬" },
    ],
    3,
  );

export const schnittTechnik = (): string =>
  chain(
    "Einen dünnen Querschnitt durch einen Stängel herstellen und anfärben",
    [
      { head: "Einspannen", body: "Stängelstück fest\nhalten oder in\nHolundermark klemmen", colour: C.green },
      { head: "Schneiden", body: "Mit Rasierklinge\nziehend und sehr\ndünn schneiden", colour: C.red, icon: "⚠" },
      { head: "Auswählen", body: "Den dünnsten,\ndurchscheinenden\nSchnitt nehmen", colour: C.orange },
      { head: "Anfärben", body: "Farbstoff zugeben,\nwirken lassen,\nmit Wasser spülen", colour: C.purple },
    ],
    4,
    720,
  );

export const modellAhornfrucht = (): string =>
  svg(
    600,
    250,
    "Original und Modell: Ahornfrucht und Papiermodell im Vergleich mit Gemeinsamkeiten und Abweichungen",
    `${panel(8, 8, 190, 234, "panel-bg")}
     ${label(103, 32, "Original", "lbl small strong", "middle")}
     <ellipse cx="80" cy="150" rx="14" ry="12" fill="#a1683a" stroke="var(--f-ink)"/>
     <path d="M90 142 Q150 70 172 92 Q150 128 92 156 Z" fill="#c8a165" stroke="var(--f-line)"/>
     ${[0, 1, 2, 3].map((i) => `<line x1="94" y1="${148 - i * 3}" x2="${150 + i * 4}" y2="${100 + i * 6}" stroke="var(--f-line)" opacity="0.5"/>`).join("")}
     ${label(103, 220, "Ahornfrucht", "lbl tiny", "middle")}
     ${panel(206, 8, 190, 234, "panel-bg")}
     ${label(301, 32, "Modell", "lbl small strong", "middle")}
     <rect x="246" y="80" width="40" height="110" fill="var(--f-white)" stroke="var(--f-ink)"/>
     <rect x="290" y="80" width="40" height="110" fill="var(--f-white)" stroke="var(--f-ink)" transform="rotate(12 290 80)"/>
     <rect x="282" y="186" width="16" height="16" fill="var(--f-stone)"/>
     ${label(301, 220, "Papierstreifen mit Büroklammer", "lbl tiny", "middle")}
     ${panel(404, 8, 188, 234, "panel-bg")}
     ${labels(416, 34, "Gleich:\n• Flügel dreht sich\n• sinkt langsam\n• Gewicht unten\n\nAnders:\n• Papier statt Gewebe\n• kein Samen\n• andere Form\n  und Größe", "lbl tiny", "start", 15)}`,
  );

/** Model numbers shared with the germination and waterweed labs. */
export const saeuleLinie = (): string => {
  const bars: Array<[string, number]> = [
    ["Kontrolle", 18],
    ["trocken", 0],
    ["dunkel", 18],
    ["4 °C", 0],
  ];
  const line: Array<[number, number]> = [
    [0, 0],
    [1, 2],
    [2, 8],
    [3, 15],
    [4, 24],
    [5, 32],
  ];
  return svg(
    600,
    270,
    "Säulendiagramm der gekeimten Samen je Ansatz und Liniendiagramm der Keimlingslänge über fünf Tage",
    `${panel(8, 8, 288, 254, "panel-bg")}
     ${label(152, 30, "Säulendiagramm: Ansätze vergleichen", "lbl tiny strong", "middle")}
     <line x1="50" y1="210" x2="280" y2="210" stroke="var(--f-ink)"/><line x1="50" y1="210" x2="50" y2="50" stroke="var(--f-ink)"/>
     ${[0, 5, 10, 15, 20].map((v) => `${label(44, 214 - v * 7.5, String(v), "lbl tiny", "end")}`).join("")}
     ${bars.map(([n, v], i) => `<rect x="${64 + i * 54}" y="${210 - v * 7.5}" width="36" height="${v * 7.5}" fill="var(--f-green)"/>${label(82 + i * 54, 228, n, "lbl tiny", "middle")}`).join("")}
     ${labels(152, 246, "gekeimte Samen von 20", "lbl tiny", "middle")}
     ${panel(304, 8, 288, 254, "panel-bg")}
     ${label(448, 30, "Liniendiagramm: Verlauf über die Zeit", "lbl tiny strong", "middle")}
     <line x1="346" y1="210" x2="576" y2="210" stroke="var(--f-ink)"/><line x1="346" y1="210" x2="346" y2="50" stroke="var(--f-ink)"/>
     ${[0, 10, 20, 30].map((v) => `${label(340, 214 - v * 4.8, String(v), "lbl tiny", "end")}`).join("")}
     <polyline points="${line.map(([d, v]) => `${346 + d * 44},${f1(210 - v * 4.8)}`).join(" ")}" fill="none" stroke="var(--f-blue)" stroke-width="3"/>
     ${line.map(([d, v]) => `<circle cx="${346 + d * 44}" cy="${f1(210 - v * 4.8)}" r="4" fill="var(--f-blue)"/>${label(346 + d * 44, 228, String(d), "lbl tiny", "middle")}`).join("")}
     ${labels(460, 246, "Tag · Länge in mm (Beispielwerte)", "lbl tiny", "middle")}`,
  );
};

export const jeDesto = (): string => {
  const points: Array<[number, number]> = [
    [10, 24],
    [20, 15],
    [30, 9],
    [40, 6],
    [50, 4],
  ];
  return svg(
    600,
    250,
    "Je-desto-Beziehung: Je größer der Abstand der Lampe, desto weniger Sauerstoffbläschen bildet die Wasserpest",
    `${panel(8, 8, 584, 234, "panel-bg")}
     <line x1="60" y1="200" x2="380" y2="200" stroke="var(--f-ink)"/><line x1="60" y1="200" x2="60" y2="40" stroke="var(--f-ink)"/>
     ${[0, 10, 20, 30].map((v) => label(54, 204 - v * 5, String(v), "lbl tiny", "end")).join("")}
     <polyline points="${points.map(([d, v]) => `${60 + (d - 10) * 7 + 20},${200 - v * 5}`).join(" ")}" fill="none" stroke="var(--f-green)" stroke-width="3"/>
     ${points.map(([d, v]) => `<circle cx="${60 + (d - 10) * 7 + 20}" cy="${200 - v * 5}" r="4" fill="var(--f-green)"/>${label(60 + (d - 10) * 7 + 20, 218, `${d}`, "lbl tiny", "middle")}`).join("")}
     ${label(220, 236, "Abstand der Lampe in cm", "lbl tiny", "middle")}
     ${labels(66, 32, "Bläschen pro Minute (Modellwerte)", "lbl tiny", "start")}
     ${labels(400, 60, "Je-desto-Satz:\n„Je größer der Abstand\nder Lampe, desto weniger\nBläschen pro Minute.“\n\nAuch umgekehrt richtig:\n„Je näher die Lampe,\ndesto mehr Bläschen.“", "lbl tiny", "start", 16)}`,
  );
};

export const quellenKriterien = (): string =>
  cardGrid(
    "Kriterien zur Einschätzung naturwissenschaftlicher Quellen: Qualifikation, Absicht, Zielgruppe, Aktualität und Belege",
    [
      { head: "Qualifikation", body: "Wer schreibt? Fachleute,\nBehörde, Forschungs-\neinrichtung, Lexikon?", colour: C.blue },
      { head: "Absicht", body: "Informieren, unterhalten\noder etwas verkaufen?\nWerbung ist einseitig.", colour: C.red },
      { head: "Zielgruppe", body: "Für Kinder vereinfacht\noder für Fachleute?\nVereinfachen ist erlaubt.", colour: C.purple },
      { head: "Aktualität", body: "Wann geschrieben?\nIst das Wissen\nnoch aktuell?", colour: C.orange },
      { head: "Belege", body: "Nennt die Quelle\nMessungen, Versuche\noder Fachliteratur?", colour: C.green },
      { head: "Vergleich", body: "Sagen andere gute\nQuellen dasselbe?\nWidersprüche prüfen.", colour: C.stone },
    ],
    3,
  );

export const aussagen = (): string =>
  compare(
    "Beschreibende und bewertende Aussagen über Tiere im Vergleich",
    {
      head: "Beschreibend: Tatsachen",
      colour: C.blue,
      points: [
        "Der Fuchs frisst vor allem Mäuse.",
        "Die Amsel singt im Frühjahr am Morgen.",
        "Der Hecht jagt andere Fische.",
        "Ein Igel wiegt im Herbst mehr als im Frühjahr.",
        "lässt sich beobachten oder messen",
      ],
    },
    {
      head: "Bewertend: Meinungen",
      colour: C.red,
      points: [
        "Der Fuchs ist hinterlistig. (vermenschlicht)",
        "Die Amsel singt aus Freude. (vermenschlicht)",
        "Der Hecht ist ein böser Räuber.",
        "Igel sind süß.",
        "drückt ein Urteil oder Gefühl aus",
      ],
    },
  );
