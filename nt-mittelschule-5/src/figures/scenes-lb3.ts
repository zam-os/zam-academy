import { arrow, label, labels, panel, svg } from "./draw";

export function organsystemeTafel(): string {
  const sys = [
    ["Atmungssystem", "Lunge nimmt Sauerstoff\nauf, gibt CO₂ ab", "var(--f-blue)"],
    ["Blutkreislauf", "Herz pumpt Blut mit\nO₂ & Nährstoffen", "var(--f-red)"],
    ["Verdauung", "Zerkleinert Nahrung,\nnimmt Nährstoffe auf", "var(--f-orange)"],
    ["Nervensystem", "Gehirn & Nerven steuern\nalle Abläufe", "var(--f-purple)"],
  ];
  return svg(
    600,
    185,
    "Vier Organsysteme des Menschen im Überblick",
    `${sys
      .map(([t, sub, col], i) => {
        const x = 14 + (i % 2) * 292;
        const y = 14 + Math.floor(i / 2) * 82;
        return `${panel(x, y, 280, 70, "panel-bg")}
          <rect x="${x}" y="${y}" width="12" height="70" rx="4" fill="${col}"/>
          ${label(x + 24, y + 23, t, "lbl strong", "start")}
          ${labels(x + 24, y + 42, sub, "lbl small", "start", 15)}`;
      })
      .join("")}`,
  );
}

export function gesunderAlltag(): string {
  const pillars = [
    ["Schlaf", "Etwa 9–11 Stunden\nzur Erholung", "var(--f-purple)"],
    ["Bewegung", "Täglich aktiv sein\n& Rücken stärken", "var(--f-green)"],
    ["Hygiene", "Hände waschen,\nZähne putzen", "var(--f-blue)"],
    ["Ausgleich", "Bildschirmpausen\n& frische Luft", "var(--f-orange)"],
  ];
  return svg(
    580,
    150,
    "Vier Säulen einer gesunden Lebensführung im Alltag",
    pillars
      .map(([t, s, col], i) => {
        const x = 14 + i * 140;
        return `${panel(x, 16, 128, 118, "panel-bg")}
          <rect x="${x}" y="16" width="128" height="28" rx="8" fill="${col}"/>
          ${label(x + 64, 35, t, "lbl small on-dark", "middle")}
          ${labels(x + 64, 76, s, "lbl small", "middle", 18)}`;
      })
      .join(""),
  );
}

export function verdauungsweg(): string {
  const stations = [
    ["1. Mund", "Kauen & Speichel\nzerkleinern"],
    ["2. Speiseröhre", "Muskelwellen\nschieben weiter"],
    ["3. Magen", "Magensäure &\nMuskelkneten"],
    ["4. Dünndarm", "Nährstoffe gehen\nins Blut über"],
    ["5. Dickdarm", "Wasser wird\nzurückgewonnen"],
  ];
  return svg(
    660,
    165,
    "Stationen des Wegs der Nahrung durch den Körper",
    stations
      .map(([t, sub], i) => {
        const x = 12 + i * 130;
        return `${panel(x, 22, 118, 118, "panel-bg")}
          ${label(x + 59, 46, t, "lbl small strong", "middle")}
          ${labels(x + 59, 82, sub, "lbl tiny", "middle", 16)}
          ${i < 4 ? arrow(x + 119, 80, x + 129, 80, "arrow thin") : ""}`;
      })
      .join(""),
  );
}

export function naehrstoffPyramide(): string {
  return svg(
    580,
    185,
    "Bestandteile unserer Nahrung und ihre Aufgaben",
    `${panel(14, 14, 274, 158, "panel-bg")}
     ${label(151, 36, "Energielieferanten & Baustoffe", "lbl small strong", "middle")}
     <rect x="30" y="50" width="242" height="28" rx="6" fill="var(--f-orange)"/>
     ${label(151, 69, "Kohlenhydrate → schnelle Energie", "lbl small on-dark", "middle")}
     <rect x="30" y="86" width="242" height="28" rx="6" fill="#d9a420"/>
     ${label(151, 105, "Fette → Vorratsenergie & Kälteschutz", "lbl small", "middle")}
     <rect x="30" y="122" width="242" height="28" rx="6" fill="var(--f-red)"/>
     ${label(151, 141, "Eiweiße → Baustoffe für Muskeln", "lbl small on-dark", "middle")}
     ${panel(304, 14, 262, 158, "panel-bg")}
     ${label(435, 36, "Reglerstoffe & Transport", "lbl small strong", "middle")}
     ${labels(435, 68, "• Wasser: Lösungsmittel &\n  Transport im Blut\n• Vitamine & Mineralstoffe\n• Spurenelemente\n• Zusatzstoffe sparsam meiden", "lbl small", "middle", 18)}`,
  );
}

export function zuckergehaltCheck(): string {
  return svg(
    560,
    170,
    "Zuckervergleich typischer Getränke und Gesundheitsvorsorge",
    `${panel(14, 14, 532, 142, "panel-bg")}
     ${label(280, 36, "Zuckeranteil in einem 0,5-l-Getränk (Orientierungswert)", "lbl strong", "middle")}
     <rect x="36" y="54" width="10" height="24" rx="4" fill="var(--f-blue)"/>
     ${label(58, 71, "Leitungswasser: 0 Würfelzucker (optimal für Alltag)", "lbl small", "start")}
     <rect x="36" y="90" width="210" height="24" rx="4" fill="var(--f-red)"/>
     ${label(256, 107, "Süße Limonade: rund 15–18 Würfelzucker!", "lbl small", "start")}
     ${label(280, 140, "Häufig viel Zucker und Fett erhöhen das Risiko für Karies, Fettleibigkeit und Diabetes.", "lbl small muted", "middle")}`,
  );
}

export function skelettUeberblick(): string {
  return svg(
    560,
    210,
    "Stütz- und Schutzfunktion des menschlichen Skeletts",
    `${panel(14, 14, 210, 182, "panel-bg")}
     <circle cx="119" cy="46" r="18" fill="#efe7d6" stroke="var(--f-ink)" stroke-width="2"/>
     <line x1="119" y1="64" x2="119" y2="128" stroke="var(--f-ink)" stroke-width="5"/>
     <ellipse cx="119" cy="92" rx="24" ry="22" fill="none" stroke="var(--f-ink)" stroke-width="2.5"/>
     <path d="M98 128 L140 128 L132 144 L106 144 Z" fill="#efe7d6" stroke="var(--f-ink)" stroke-width="2"/>
     <line x1="88" y1="74" x2="72" y2="126" stroke="var(--f-ink)" stroke-width="4"/>
     <line x1="150" y1="74" x2="166" y2="126" stroke="var(--f-ink)" stroke-width="4"/>
     <line x1="106" y1="144" x2="98" y2="184" stroke="var(--f-ink)" stroke-width="4"/>
     <line x1="132" y1="144" x2="140" y2="184" stroke="var(--f-ink)" stroke-width="4"/>
     ${panel(240, 14, 306, 182, "panel-bg")}
     ${label(393, 38, "Doppelte Aufgabe des Skeletts", "lbl strong", "middle")}
     ${labels(393, 72, "Schutzfunktion:\n• Schädel schützt das Gehirn\n• Brustkorb schützt Herz & Lunge\n• Wirbelkanal schützt Rückenmark\n\nStützfunktion:\n• Wirbelsäule, Becken und Beine\n  ermöglichen aufrechten Stand.", "lbl small", "middle", 16)}`,
  );
}

export function wirbelsaeuleSform(): string {
  return svg(
    560,
    185,
    "Die Doppel-S-Form der Wirbelsäule mit Bandscheiben",
    `${panel(14, 14, 240, 158, "panel-bg")}
     ${label(134, 36, "Gerader Stab (ohne Feder)", "lbl small strong", "middle")}
     <line x1="134" y1="52" x2="134" y2="140" stroke="var(--f-stone)" stroke-width="10" stroke-linecap="round"/>
     ${arrow(134, 42, 134, 52, "arrow power")}
     ${label(134, 158, "Jeder Sprung stößt direkt durch.", "lbl tiny", "middle")}
     ${panel(272, 14, 274, 158, "panel-bg")}
     ${label(409, 36, "Doppel-S-Wirbelsäule", "lbl small strong", "middle")}
     <path d="M366 52 C384 74 348 106 368 138" fill="none" stroke="var(--accent)" stroke-width="9" stroke-linecap="round"/>
     ${[64, 84, 104, 124].map((y) => `<ellipse cx="366" cy="${y}" rx="9" ry="3" fill="var(--f-blue)"/>`).join("")}
     ${labels(456, 86, "Wirbel + weiche\nBandscheiben federn\nStöße ab!", "lbl small", "middle", 18)}`,
  );
}

export function gelenktypen(): string {
  const types = [
    ["Kugelgelenk", "In alle Richtungen\n(Schulter, Hüfte)"],
    ["Scharniergelenk", "Beugen & Strecken\n(Ellbogen, Knie)"],
    ["Sattelgelenk", "Nach vorn/zurück\n& seitlich (Daumen)"],
  ];
  return svg(
    580,
    190,
    "Drei wichtige Gelenktypen und Aufbau eines Gelenks",
    `${types
      .map(([t, d], i) => {
        const x = 14 + i * 188;
        return `${panel(x, 14, 174, 108, "panel-bg")}
          ${label(x + 87, 42, t, "lbl strong", "middle")}
          ${labels(x + 87, 76, d, "lbl small", "middle", 18)}`;
      })
      .join("")}
     ${panel(14, 132, 550, 46, "panel-bg")}
     ${labels(289, 151, "Aufbau eines Gelenks: Gelenkkopf + Gelenkpfanne\n+ glatter Knorpel + Gelenkschmiere + Gelenkkapsel", "lbl small", "middle", 16)}`,
  );
}

export function haltungUndHeben(): string {
  return svg(
    560,
    175,
    "Richtiges Heben und Tragen gegen Haltungsschäden",
    `${panel(14, 14, 256, 146, "panel-bg")}
     <rect x="28" y="24" width="228" height="24" rx="6" fill="var(--f-red)"/>
     ${label(142, 41, "Ungünstig für den Rücken", "lbl small on-dark", "middle")}
     ${labels(142, 78, "• Mit rundem Rücken schwer heben\n• Schulranzen einseitig oder locker\n• Ständiges krummes Sitzen\n→ Rundrücken oder Hohlkreuz", "lbl tiny", "middle", 18)}
     ${panel(290, 14, 256, 146, "panel-bg")}
     <rect x="304" y="24" width="228" height="24" rx="6" fill="var(--f-green)"/>
     ${label(418, 41, "Rückenfreundlich im Alltag", "lbl small on-dark", "middle")}
     ${labels(418, 78, "• In die Knie gehen, Rücken gerade\n• Ranzen nah am Rücken, ca. 10–15 %\n• Schwimmen, Radfahren, Bewegung\n• Pausen mit Streckübungen", "lbl tiny", "middle", 18)}`,
  );
}
