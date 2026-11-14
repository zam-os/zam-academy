import { arrow, label, labels, panel, svg } from "./draw";

export function tagUndNacht(): string {
  return svg(
    540,
    200,
    "Entstehung von Tag und Nacht durch Erdrotation",
    `<rect class="space" x="0" y="0" width="540" height="200" rx="12"/>
     <circle class="sun" cx="64" cy="100" r="38"/>
     ${label(64, 104, "Sonne", "lbl small strong", "middle")}
     ${[-46, -16, 16, 46].map((dy) => arrow(114, 100 + dy, 236, 100 + dy, "arrow power")).join("")}
     <circle cx="350" cy="100" r="56" fill="#1b2d4f" stroke="#fff" stroke-width="2"/>
     <path d="M350 44 A56 56 0 0 0 350 156 Z" fill="#67b3f5"/>
     <line x1="336" y1="30" x2="364" y2="170" stroke="#ffe27a" stroke-width="3"/>
     <path d="M324 52 C340 44 362 44 378 54" fill="none" stroke="#ffe27a" stroke-width="2" stroke-dasharray="4 3"/>
     ${label(318, 104, "Tag", "lbl strong", "middle")}
     ${label(380, 104, "Nacht", "lbl strong on-dark", "middle")}
     ${label(350, 188, "Erddrehung um eigene Achse: einmal in 24 h", "lbl small on-dark", "middle")}`,
  );
}

export function sonneEnergie(): string {
  const targets = [
    ["Wärmeenergie", "Sonnenkollektor / Brennglas /\nSonnenofen (Mont-Louis)", "var(--f-orange)"],
    ["Elektrische Energie", "Solarzelle (Photovoltaik)\nversorgt Geräte", "var(--f-blue)"],
    ["Bewegungsenergie", "Solarfahrzeug / Wind\nund Wasserkreislauf", "var(--f-green)"],
  ];
  return svg(
    580,
    190,
    "Umwandlung von Strahlungsenergie der Sonne",
    `${panel(16, 42, 130, 106, "panel-bg")}
     <circle class="sun" cx="81" cy="84" r="24"/>
     ${label(81, 130, "Strahlungsenergie", "lbl small strong", "middle")}
     ${targets
       .map(([t, sub, col], i) => {
         const y = 18 + i * 58;
         return `${arrow(150, 95, 224, y + 24, "arrow power")}
           ${panel(232, y, 332, 48, "panel-bg")}
           <rect x="232" y="${y}" width="12" height="48" rx="4" fill="${col}"/>
           ${label(256, y + 20, t, "lbl small strong", "start")}
           ${labels(256, y + 38, sub.replaceAll("\n", " · "), "lbl tiny", "start")}`;
       })
       .join("")}`,
  );
}

export function thermometerBau(): string {
  const yOf = (tempC: number) => 136 - tempC * 0.95;
  const y0 = yOf(0);
  const y20 = yOf(20);
  const y100 = yOf(100);
  const subTicks = [40, 60, 80]
    .map((t) => `<line x1="76" y1="${yOf(t)}" x2="84" y2="${yOf(t)}" stroke="var(--f-ink)" stroke-width="1.2" opacity="0.6"/>`)
    .join("");
  return svg(
    580,
    194,
    "Flüssigkeitsthermometer mit linearer Celsiusskala",
    `${panel(14, 14, 270, 166, "panel-bg")}
     <rect x="52" y="26" width="20" height="122" rx="10" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/>
     <circle cx="62" cy="154" r="14" fill="var(--f-red)" stroke="var(--f-ink)" stroke-width="2"/>
     <rect x="58" y="${y20}" width="8" height="${154 - y20}" fill="var(--f-red)"/>
     <line x1="76" y1="${y100}" x2="90" y2="${y100}" stroke="var(--f-ink)" stroke-width="2"/>
     ${label(96, y100 + 4, "100 °C: Wasser siedet", "lbl small", "start")}
     ${subTicks}
     <line x1="76" y1="${y20}" x2="90" y2="${y20}" stroke="var(--f-ink)" stroke-width="2"/>
     ${label(96, y20 + 4, "20 °C: Zimmertemperatur", "lbl small", "start")}
     <line x1="76" y1="${y0}" x2="90" y2="${y0}" stroke="var(--f-ink)" stroke-width="2"/>
     ${label(96, y0 + 4, "0 °C: Wasser gefriert", "lbl small", "start")}
     ${panel(300, 14, 266, 166, "panel-bg")}
     ${label(433, 42, "Unterschiedliche Messgeräte", "lbl strong", "middle")}
     ${labels(433, 72, "Flüssigkeitsthermometer:\nZimmertemperatur & Wasser\nFieberthermometer:\nfeine Skala (35 °C bis 42 °C)\nBimetallthermometer:\nBackofen & Heizung", "lbl small", "middle", 18)}`,
  );
}

export function waermeAlltag(): string {
  return svg(
    560,
    180,
    "Wärmeleiter und Isolatoren in Küche und Alltag",
    `${panel(16, 16, 256, 148, "panel-bg")}
     <rect x="70" y="66" width="120" height="62" rx="6" fill="var(--f-stone)" stroke="var(--f-ink)" stroke-width="2"/>
     <rect x="34" y="80" width="36" height="14" rx="4" fill="var(--f-wood)" stroke="var(--f-ink)"/>
     <rect x="190" y="80" width="36" height="14" rx="4" fill="var(--f-wood)" stroke="var(--f-ink)"/>
     <rect x="64" y="132" width="132" height="12" rx="4" fill="var(--f-earth)"/>
     ${label(130, 44, "Metalltopf = Wärmeleiter", "lbl small strong", "middle")}
     ${label(130, 102, "Wasser wird heiß", "lbl tiny", "middle")}
     ${label(130, 158, "Holzgriff & Kork = Isolatoren", "lbl tiny", "middle")}
     ${panel(288, 16, 256, 148, "panel-bg")}
     ${label(416, 44, "Warum Isolatoren bremsen", "lbl small strong", "middle")}
     ${labels(416, 76, "Metalle (Kupfer, Aluminium):\nleiten Wärme sehr schnell.\nHolz, Kork, Kunststoff & Luft:\nleiten Wärme sehr schlecht\n→ Schutz vor Verbrennung.", "lbl small", "middle", 18)}`,
  );
}

export function waermetransport(): string {
  const cols = [
    ["Wärmeleitung", "Innerhalb eines festen\nKörpers (Löffelstiel)", "var(--f-red)"],
    ["Wärmeströmung", "Bewegte warme Luft oder\nWasser strömt auf", "var(--f-orange)"],
    ["Wärmestrahlung", "Wandert auch durch\nleeren Raum (Sonne)", "var(--f-blue)"],
  ];
  return svg(
    600,
    170,
    "Drei Arten des Wärmetransports und Temperaturausgleich",
    `${cols
      .map(([t, desc, col], i) => {
        const x = 14 + i * 196;
        return `${panel(x, 14, 182, 114, "panel-bg")}
          <rect x="${x}" y="14" width="182" height="28" rx="8" fill="${col}"/>
          ${label(x + 91, 33, t, "lbl small on-dark", "middle")}
          ${labels(x + 91, 74, desc, "lbl small", "middle", 18)}`;
      })
      .join("")}
     ${label(300, 154, "Temperaturausgleich: Wärme wandert immer vom wärmeren zum kälteren Körper.", "lbl small strong", "middle")}`,
  );
}

export function hautAufbau(): string {
  return svg(
    580,
    205,
    "Dreischichtiger Aufbau der menschlichen Haut",
    `<rect x="18" y="26" width="320" height="32" rx="4" fill="#f2c6a0" stroke="var(--f-ink)"/>
     <rect x="18" y="58" width="320" height="74" fill="#f7a89a" stroke="var(--f-ink)"/>
     <rect x="18" y="132" width="320" height="50" rx="4" fill="#fae287" stroke="var(--f-ink)"/>
     <line x1="112" y1="8" x2="112" y2="118" stroke="#5a3c22" stroke-width="4" stroke-linecap="round"/>
     <path d="M180 26 L180 108 Q186 120 194 108 Q194 96 184 96" fill="none" stroke="var(--f-blue)" stroke-width="3"/>
     <circle cx="250" cy="82" r="7" fill="var(--f-purple)" stroke="var(--f-ink)"/>
     ${label(178, 46, "1. Oberhaut (Hornschicht + Pigmente)", "lbl small strong", "middle")}
     ${label(248, 116, "2. Lederhaut", "lbl small strong", "middle")}
     ${label(178, 162, "3. Unterhaut (Fettpolster)", "lbl small strong", "middle")}
     ${panel(354, 24, 210, 158, "panel-bg")}
     ${labels(459, 54, "Aufgaben der Haut:\n• Schutz vor Kälte & UV\n• Tastsinn & Wärme spüren\n• Kühlen durch Schwitzen\n• Fettschicht isoliert", "lbl small", "middle", 20)}`,
  );
}

export function hauttypenUv(): string {
  const types = [
    ["Typ I", "Sehr hell,\nbräunt nie", "#f8d8c0", "Rötung*: ~5–10 min"],
    ["Typ II", "Helle Haut,\nbräunt kaum", "#f0c5a0", "Rötung*: ~10–20 min"],
    ["Typ III", "Mittelhell,\nbräunt langsam", "#dfaf84", "Rötung*: ~20–30 min"],
    ["Typ IV", "Hellbraun–oliv,\nbräunt gut", "#c48a5b", "Rötung*: >30 min"],
    ["Typ V–VI", "Dunkelbraun,\nsehr pigmentreich", "#7c4b2d", "Trotzdem UV-Schutz"],
  ];
  return svg(
    640,
    210,
    "Übersicht gängiger Hauttypen und wichtiger Regeln zum UV-Schutz",
    `${types
      .map(([title, desc, fill, time], i) => {
        const x = 12 + i * 124;
        return `${panel(x, 16, 118, 120, "panel-bg")}
          <rect x="${x + 10}" y="26" width="98" height="24" rx="6" fill="${fill}" stroke="var(--f-ink)"/>
          ${label(x + 59, 43, title, `lbl small strong${i === 4 ? " on-dark" : ""}`, "middle")}
          ${labels(x + 59, 72, desc, "lbl tiny", "middle", 15)}
          ${label(x + 59, 120, time, "lbl tiny muted", "middle")}`;
      })
      .join("")}
     ${labels(320, 158, "Eigenschutzzeit bis zur Rötung (*Richtwert bei starker Mittagssonne, je nach UV-Index).\nLSF verlängert nur rechnerisch – nie ausreizen! · 11–15 Uhr Schatten · Kleidung UPF 50+.", "lbl small strong", "middle", 17)}`,
  );
}

export function lichtSchatten(): string {
  return svg(
    560,
    180,
    "Geradlinige Ausbreitung des Lichts und Schattenraum",
    `<rect class="space" x="8" y="8" width="544" height="164" rx="12"/>
     <circle class="sun" cx="62" cy="90" r="14"/>
     ${label(62, 128, "Lichtquelle", "lbl small on-dark", "middle")}
     <rect x="218" y="64" width="16" height="52" fill="var(--f-stone)" stroke="#fff"/>
     <line x1="62" y1="90" x2="470" y2="34" stroke="#ffd24c" stroke-width="2.5"/>
     <line x1="62" y1="90" x2="470" y2="146" stroke="#ffd24c" stroke-width="2.5"/>
     <polygon points="234,64 470,34 470,146 234,116" fill="#091020" opacity="0.88"/>
     <rect x="470" y="20" width="12" height="140" fill="var(--f-white)"/>
     ${label(226, 48, "Hindernis", "lbl tiny on-dark", "middle")}
     ${labels(360, 86, "Kernschatten\n(kein Licht)", "lbl small on-dark", "middle", 16)}
     ${label(486, 94, "Schirm", "lbl tiny on-dark", "start")}`,
  );
}

export function reflexionToterWinkel(): string {
  return svg(
    600,
    190,
    "Reflexionsgesetz am Spiegel und toter Winkel im Straßenverkehr",
    `${panel(14, 14, 266, 162, "panel-bg")}
     ${label(147, 36, "Reflexionsgesetz", "lbl strong", "middle")}
     <line x1="48" y1="142" x2="246" y2="142" stroke="var(--f-blue)" stroke-width="5"/>
     <line x1="147" y1="54" x2="147" y2="142" stroke="var(--f-line)" stroke-dasharray="4 3"/>
     ${arrow(70, 62, 147, 142, "arrow power")}
     ${arrow(147, 142, 224, 62, "arrow")}
     ${label(147, 164, "Einfallswinkel = Ausfallswinkel", "lbl small strong", "middle")}
     ${panel(296, 14, 290, 162, "panel-bg")}
     ${label(441, 36, "Toter Winkel am Lkw", "lbl strong", "middle")}
     <rect x="318" y="74" width="84" height="44" rx="4" fill="var(--f-orange)" stroke="var(--f-ink)"/>
     <polygon points="402,94 560,46 560,94" fill="#d4483b55" stroke="var(--f-red)" stroke-dasharray="4 3"/>
     <polygon points="402,118 560,124 560,164 402,130" fill="#d4483b55" stroke="var(--f-red)" stroke-dasharray="4 3"/>
     <circle cx="468" cy="130" r="10" fill="var(--f-green)" stroke="var(--f-ink)"/>
     ${labels(441, 152, "Radfahrer im toten Winkel –\nnicht warten, Abstand halten!", "lbl tiny", "middle", 14)}`,
  );
}

export function prismaFarben(): string {
  const colors = ["#e03e2d", "#f08c28", "#f2cf3d", "#4e9d3c", "#2d7dd2", "#6a3bc4"];
  return svg(
    580,
    190,
    "Zerlegung von weißem Licht und Entstehung von Körperfarben",
    `${panel(14, 14, 276, 162, "panel-bg")}
     ${label(152, 34, "Spektralfarben am Prisma", "lbl small strong", "middle")}
     <line x1="24" y1="96" x2="112" y2="96" stroke="#f5c946" stroke-width="5"/>
     <polygon points="104,132 140,56 176,132" fill="#d9eeff99" stroke="var(--f-ink)" stroke-width="2"/>
     ${colors.map((c, i) => `<line x1="158" y1="${88 + i * 3}" x2="262" y2="${56 + i * 18}" stroke="${c}" stroke-width="4.5"/>`).join("")}
     ${label(152, 158, "Weißes Licht enthält alle Spektralfarben.", "lbl tiny", "middle")}
     ${panel(306, 14, 260, 162, "panel-bg")}
     ${label(436, 34, "Farbe durch Absorption", "lbl small strong", "middle")}
     <rect x="394" y="102" width="84" height="30" rx="6" fill="var(--f-green)" stroke="var(--f-ink)"/>
     ${arrow(354, 52, 418, 102, "arrow power")}
     ${arrow(436, 102, 496, 52, "arrow")}
     ${label(354, 48, "Weißes Licht", "lbl tiny", "middle")}
     ${label(498, 48, "Grün reflektiert", "lbl tiny", "middle")}
     ${labels(436, 150, "Alle anderen Farben werden\ngeschluckt (absorbiert).", "lbl tiny", "middle", 14)}`,
  );
}

export function kameraUndAuge(): string {
  return svg(
    560,
    185,
    "Bildentstehung auf der Netzhaut des Auges",
    `${panel(14, 14, 532, 158, "panel-bg")}
     <line x1="68" y1="54" x2="68" y2="128" stroke="var(--f-green)" stroke-width="6" stroke-linecap="round"/>
     <polygon points="68,46 58,64 78,64" fill="var(--f-green)"/>
     <ellipse cx="272" cy="91" rx="14" ry="44" fill="#cde8ff" stroke="var(--f-ink)" stroke-width="2"/>
     <ellipse cx="352" cy="91" rx="94" ry="62" fill="#fff6ea66" stroke="var(--f-ink)" stroke-width="2"/>
     <path d="M432 42 Q458 91 432 140" fill="none" stroke="var(--f-red)" stroke-width="4.5"/>
     <line x1="68" y1="48" x2="272" y2="72" stroke="var(--f-orange)" stroke-width="2"/>
     <line x1="272" y1="72" x2="438" y2="120" stroke="var(--f-orange)" stroke-width="2"/>
     <line x1="68" y1="128" x2="272" y2="110" stroke="var(--f-blue)" stroke-width="2"/>
     <line x1="272" y1="110" x2="438" y2="62" stroke="var(--f-blue)" stroke-width="2"/>
     ${label(68, 152, "Gegenstand", "lbl small", "middle")}
     ${label(272, 34, "Augenlinse", "lbl small", "middle")}
     ${labels(496, 78, "Netzhaut:\numgekehrt &\nverkleinert", "lbl tiny", "middle", 15)}`,
  );
}
