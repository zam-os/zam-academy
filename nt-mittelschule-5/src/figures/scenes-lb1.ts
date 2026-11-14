import { arrow, label, labels, panel, svg } from "./draw";

export function forscherweg(): string {
  const steps = [
    ["1. Phänomen", "Frage stellen &\nbeobachten", "var(--f-blue)"],
    ["2. Vermutung", "Was könnte die\nUrsache sein?", "var(--f-purple)"],
    ["3. Versuch planen", "Geräte, Aufbau &\nSicherheit klären", "var(--f-orange)"],
    ["4. Beobachten", "Genau hinsehen\nund messen", "var(--f-green)"],
    ["5. Auswerten", "Vermutung prüfen\nund antworten", "var(--f-red)"],
  ];
  return svg(
    660,
    152,
    "Die fünf Schritte des naturwissenschaftlichen Erkenntniswegs",
    steps
      .map(([title, sub, col], i) => {
        const x = 12 + i * 130;
        return `${panel(x, 22, 118, 108, "panel-bg")}
          <rect x="${x}" y="22" width="118" height="28" rx="8" fill="${col}"/>
          ${label(x + 59, 40, title, "lbl tiny on-dark", "middle")}
          ${labels(x + 59, 76, sub, "lbl tiny", "middle", 16)}
          ${i < 4 ? arrow(x + 119, 76, x + 129, 76, "arrow thin") : ""}`;
      })
      .join(""),
  );
}

export function laborgeraete(): string {
  return svg(
    620,
    220,
    "Sechs einfache Laborgeräte des Fachraums im Überblick",
    `${panel(12, 14, 188, 92, "panel-bg")}
     <path d="M54 34 L54 84 L96 84 L96 34" fill="#cde8ff66" stroke="var(--f-ink)" stroke-width="2"/>
     <line x1="50" y1="34" x2="100" y2="34" stroke="var(--f-ink)" stroke-width="2"/>
     <line x1="60" y1="54" x2="72" y2="54" stroke="var(--f-ink)" stroke-width="1.5"/>
     <line x1="60" y1="70" x2="72" y2="70" stroke="var(--f-ink)" stroke-width="1.5"/>
     ${labels(148, 50, "Becherglas\n(Messen &\nMischen)", "lbl small", "middle", 15)}
     ${panel(216, 14, 188, 92, "panel-bg")}
     <path d="M250 32 L250 72 A11 11 0 0 0 272 72 L272 32" fill="#ffd9a888" stroke="var(--f-ink)" stroke-width="2"/>
     ${label(336, 60, "Reagenzglas", "lbl small", "middle")}
     ${panel(420, 14, 188, 92, "panel-bg")}
     <polygon points="444,34 494,34 474,60 474,84 464,84 464,60" fill="#fff8e0" stroke="var(--f-ink)" stroke-width="2"/>
     ${label(548, 60, "Trichter", "lbl small", "middle")}
     ${panel(12, 118, 188, 92, "panel-bg")}
     <circle cx="68" cy="154" r="20" fill="#d9eeff" stroke="var(--f-ink)" stroke-width="2.5"/>
     <line x1="82" y1="168" x2="98" y2="188" stroke="var(--f-wood)" stroke-width="5" stroke-linecap="round"/>
     ${label(144, 166, "Lupe", "lbl small", "middle")}
     ${panel(216, 118, 188, 92, "panel-bg")}
     <rect x="256" y="130" width="12" height="58" rx="6" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/>
     <circle cx="262" cy="190" r="8" fill="var(--f-red)" stroke="var(--f-ink)" stroke-width="1.5"/>
     <rect x="259" y="148" width="6" height="36" fill="var(--f-red)"/>
     ${label(340, 166, "Thermometer", "lbl small", "middle")}
     ${panel(420, 118, 188, 92, "panel-bg")}
     <rect x="442" y="170" width="54" height="22" rx="4" fill="var(--f-stone)" stroke="var(--f-ink)" stroke-width="2"/>
     <rect x="448" y="162" width="42" height="6" rx="2" fill="var(--f-white)" stroke="var(--f-ink)"/>
     ${label(548, 172, "Waage", "lbl small", "middle")}`,
  );
}

export function versuchsprotokoll(): string {
  const rows = [
    ["1. Fragestellung", "Welche Frage untersuchen wir?"],
    ["2. Vermutung", "Was erwarten wir vorher – und warum?"],
    ["3. Aufbau & Geräte", "Welche Geräte und Stoffe werden verwendet?"],
    ["4. Beobachtung", "Was sehe, höre, messe oder rieche ich genau?"],
    ["5. Auswertung", "Antwort auf die Frage mit Fachbegriffen."],
  ];
  return svg(
    540,
    210,
    "Gliederung und Inhalt eines sauberen Versuchsprotokolls",
    `${panel(18, 12, 504, 186, "panel-bg")}
     <rect x="18" y="12" width="504" height="30" rx="10" fill="var(--accent)"/>
     ${label(270, 32, "Aufbau eines sauberen Versuchsprotokolls", "lbl strong on-dark", "middle")}
     ${rows
       .map(
         ([k, v], i) =>
           `<rect x="34" y="${52 + i * 28}" width="150" height="22" rx="5" fill="var(--accent-soft)" stroke="var(--accent)"/>
            ${label(109, 67 + i * 28, k, "lbl small strong", "middle")}
            ${label(198, 67 + i * 28, v, "lbl small", "start")}`,
       )
       .join("")}`,
  );
}

export function gefahrstoffPiktogramme(): string {
  const diamonds = [
    ["Entzündbar", "Flamme", "M60 44 C70 58 68 74 60 80 C52 74 50 58 60 44 Z"],
    ["Reizend", "Achtung (!)", "M200 44 L200 66 M200 74 L200 78"],
    ["Ätzend", "Säure/Lauge", "M332 48 L348 48 M332 66 L354 74"],
    ["Umwelt", "Fisch/Baum", "M472 52 L492 66 M482 44 L482 76"],
  ];
  const centers = [60, 200, 340, 480];
  return svg(
    540,
    190,
    "Wichtige Gefahrstoffpiktogramme und Laborregeln",
    `${centers
      .map(
        (cx, i) =>
          `<polygon points="${cx},20 ${cx + 36},56 ${cx},92 ${cx - 36},56" fill="#fff" stroke="#d4352c" stroke-width="4.5"/>
           <path d="${diamonds[i][2]}" fill="${i === 0 ? "#1d2b2a" : "none"}" stroke="#1d2b2a" stroke-width="3.5" stroke-linecap="round"/>
           ${label(cx, 114, diamonds[i][0], "lbl small strong", "middle")}`,
      )
      .join("")}
     ${panel(16, 126, 508, 54, "panel-bg")}
     ${labels(270, 143, "Grundregeln: Schutzbrille aufsetzen · Haare zusammenbinden\nNichts kosten · Anleitung genau befolgen", "lbl small", "middle", 15)}
     ${label(270, 173, "Bei Gefahr: Ruhe bewahren und sofort der Lehrkraft Bescheid sagen.", "lbl tiny muted", "middle")}`,
  );
}

export function modellVergleich(): string {
  return svg(
    560,
    185,
    "Vergleich eines Erdmodells (Globus) mit der wirklichen Erde",
    `${panel(16, 16, 236, 152, "panel-bg")}
     ${label(134, 38, "Modell (z. B. Erdglobus)", "lbl strong", "middle")}
     <circle cx="134" cy="92" r="34" fill="var(--f-river)" stroke="var(--f-ink)" stroke-width="2"/>
     <line x1="118" y1="54" x2="150" y2="130" stroke="#ffe27a" stroke-width="3"/>
     ${label(134, 148, "Zeigt das Wesentliche vereinfacht.", "lbl small", "middle")}
     ${arrow(260, 92, 300, 92, "arrow")}
     ${panel(308, 16, 236, 152, "panel-bg")}
     ${label(426, 38, "Wirklichkeit (Original)", "lbl strong", "middle")}
     <circle cx="426" cy="92" r="34" fill="var(--f-forest)" stroke="var(--f-ink)" stroke-width="2"/>
     <path d="M402 82 Q426 68 452 88 Q436 112 406 106 Z" fill="var(--f-sand)" opacity="0.8"/>
     ${label(426, 148, "Viel komplexer und meist größer.", "lbl small", "middle")}`,
  );
}

export function darstellungsformen(): string {
  return svg(
    600,
    190,
    "Von der Messtabelle zum Diagramm und zur Fachsprache",
    `${panel(14, 14, 196, 162, "panel-bg")}
     ${label(112, 36, "Messtabelle", "lbl strong", "middle")}
     <rect x="34" y="48" width="156" height="106" fill="var(--surface)" stroke="var(--f-ink)"/>
     <line x1="112" y1="48" x2="112" y2="154" stroke="var(--f-ink)"/>
     <line x1="34" y1="74" x2="190" y2="74" stroke="var(--f-ink)"/>
     ${label(73, 66, "Zeit (min)", "lbl small strong", "middle")}
     ${label(151, 66, "Temp. (°C)", "lbl small strong", "middle")}
     ${label(73, 96, "0 · 2 · 4", "lbl small", "middle")}
     ${label(151, 96, "20 · 38 · 56", "lbl small", "middle")}
     ${label(112, 134, "Einheit steht im Kopf", "lbl tiny muted", "middle")}
     ${arrow(218, 95, 250, 95, "arrow")}
     ${panel(258, 14, 326, 162, "panel-bg")}
     ${label(421, 36, "Liniendiagramm & Fachsprache", "lbl strong", "middle")}
     <polyline points="298,52 298,136 490,136" fill="none" stroke="var(--f-ink)" stroke-width="2"/>
     <polyline points="306,124 374,98 446,66" fill="none" stroke="var(--accent)" stroke-width="3"/>
     <circle cx="306" cy="124" r="4" fill="var(--accent)"/>
     <circle cx="374" cy="98" r="4" fill="var(--accent)"/>
     <circle cx="446" cy="66" r="4" fill="var(--accent)"/>
     ${label(394, 158, "„Die Temperatur steigt gleichmäßig von 20 °C auf 56 °C.“", "lbl tiny", "middle")}`,
  );
}
