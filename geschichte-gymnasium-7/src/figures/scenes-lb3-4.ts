/**
 * Figures for LB 3 (Neue räumliche und geistige Horizonte) and
 * LB 4 (Wirtschaft und Handel gestern und heute).
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
import { C } from "./scenes-lb1-2";

/* ---------- LB 3 ---------- */

export function kreuzzugMotive(): string {
  return cardGrid(
    "Motive der Kreuzfahrer: Glaube, Land und Beute, Handel und Politik",
    [
      { head: "Glaube", body: "Sündenvergebung, Pilgerfahrt,\nheilige Stätten „befreien“", colour: C.purple, icon: "✝️" },
      { head: "Land und Beute", body: "Besitz für Adelssöhne\nohne Erbe, Abenteuer", colour: C.red, icon: "🏰" },
      { head: "Handel", body: "Venedig, Genua und Pisa\nsuchen neue Märkte", colour: C.ochre, icon: "⚓" },
      { head: "Politik", body: "Hilferuf aus Byzanz;\nder Papst führt die Christenheit", colour: C.blue, icon: "👑" },
    ],
    2,
    660,
  );
}

export function quellenPerspektiven(): string {
  return compare(
    "Vergleich der christlichen und der muslimischen Sicht auf die Eroberung Jerusalems 1099",
    {
      head: "Christliche Chronisten (z. B. Fulcher)",
      colour: C.blue,
      points: [
        "Teilnehmer oder Zeitgenossen",
        "Eroberung als Gottes Wille",
        "„Befreiung“ der heiligen Stadt",
        "Gegner als „Ungläubige“",
        "Leiden der Pilger als Opfer",
      ],
    },
    {
      head: "Muslimische Autoren (z. B. Ibn al-Athir)",
      colour: C.green,
      points: [
        "schreibt rund 130 Jahre später",
        "Eroberung als Unglück",
        "Grausamkeit der „Franken“",
        "Kritik an eigener Uneinigkeit",
        "Zahlen oft übertrieben",
      ],
    },
    660,
  );
}

export function wissenstransfer(): string {
  const from = [
    { y: 60, t: "Indien", s: "Ziffern mit der Null", c: C.ochre },
    { y: 112, t: "China", s: "Papier, Kompass", c: C.red },
    { y: 164, t: "Bagdad, Kairo", s: "Medizin, Astronomie", c: C.green },
    { y: 216, t: "Orient (Levante)", s: "Gewürze, Zucker, Seide", c: C.purple },
  ];
  const via = [
    { y: 86, t: "Spanien (Toledo)" },
    { y: 138, t: "Sizilien" },
    { y: 190, t: "Venedig, Genua" },
  ];
  return svg(
    660,
    280,
    "Wege des Wissens- und Warentransfers aus Indien, China und der islamischen Welt über Spanien, Sizilien und italienische Seestädte nach Europa",
    `${panel(8, 8, 644, 264, "panel-bg")}
     ${label(110, 34, "Herkunft", "lbl small strong")}
     ${label(330, 34, "Wege", "lbl small strong")}
     ${label(550, 34, "Lateinisches Europa", "lbl small strong")}
     ${from
       .map(
         (f) => `<rect x="20" y="${f.y - 20}" width="180" height="42" rx="8" fill="${f.c}"/>
         ${label(110, f.y - 2, f.t, "lbl tiny on-dark strong")}
         ${label(110, f.y + 14, f.s, "lbl tiny on-dark")}
         ${arrow(204, f.y, 256, f.y < 140 ? f.y + 20 : f.y - 14, "arrow thin")}`,
       )
       .join("")}
     ${via
       .map(
         (v) => `<rect x="260" y="${v.y - 18}" width="140" height="36" rx="18" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/>
         ${label(330, v.y + 5, v.t, "lbl tiny strong")}
         ${arrow(404, v.y, 456, 140, "arrow thin")}`,
       )
       .join("")}
     <rect x="460" y="70" width="180" height="140" rx="12" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
     ${labels(550, 96, "geographisch:\nneue Länder bekannt\nwissenschaftlich:\nRechnen, Medizin\nwirtschaftlich:\nFernhandel wächst", "lbl tiny strong", "middle", 17)}
     ${label(330, 258, "Kreuzzüge verstärkten den Austausch – die meisten Wege liefen über Handel und Übersetzungen.", "lbl tiny muted")}`,
  );
}

export function konstantinopelPerspektiven(): string {
  return compare(
    "Zwei Perspektiven auf das Jahr 1453: Fall oder Eroberung Konstantinopels",
    {
      head: "„Fall Konstantinopels“",
      colour: C.purple,
      points: [
        "Sicht der Byzantiner und des Westens",
        "Ende des Römischen Reiches im Osten",
        "Verlust der christlichen Kaiserstadt",
        "Angst vor der „Türkengefahr“",
      ],
    },
    {
      head: "„Eroberung“ (fetih)",
      colour: C.red,
      points: [
        "Sicht der Osmanen und der heutigen Türkei",
        "Mehmed II. als „Fatih“, der Eroberer",
        "Istanbul wird neue Hauptstadt",
        "jährliches Gedenken am 29. Mai",
      ],
    },
    660,
  );
}

export function menschenbildWandel(): string {
  const left = `<rect x="24" y="44" width="296" height="210" rx="10" fill="#d9b44a"/>
    ${person(172, 230, 2.3, "cloth-scribe", "up")}
    ${person(60, 240, 0.8, "cloth-linen")}
    ${person(92, 240, 0.8, "cloth-linen")}
    ${person(256, 240, 0.8, "cloth-linen")}
    ${person(288, 240, 0.8, "cloth-linen")}
    ${label(172, 64, "Goldgrund: himmlische Welt", "lbl tiny strong")}`;
  const vx = 490;
  const vy = 130;
  const lines = [
    [340, 250],
    [640, 250],
    [340, 60],
    [640, 60],
    [400, 250],
    [580, 250],
  ]
    .map(([x, y]) => `<line x1="${x}" y1="${y}" x2="${vx}" y2="${vy}" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="4 3"/>`)
    .join("");
  const right = `<rect x="340" y="44" width="296" height="210" rx="10" fill="var(--f-sky)"/>
    <line x1="340" y1="${vy}" x2="636" y2="${vy}" stroke="var(--f-line)" stroke-width="1.5"/>
    ${lines}
    <path d="M400 250L470 150H510L580 250Z" fill="var(--f-sand)" opacity="0.7"/>
    ${person(420, 246, 1.6, "cloth-a")}
    ${person(560, 246, 1.6, "cloth-b")}
    ${person(470, 172, 0.7, "cloth-c")}
    <circle cx="${vx}" cy="${vy}" r="6" fill="var(--f-red)"/>
    ${label(vx, vy - 12, "Fluchtpunkt", "lbl tiny strong")}`;
  return svg(
    660,
    300,
    "Bedeutungsperspektive des Mittelalters mit großer Heiligenfigur auf Goldgrund im Vergleich zur Zentralperspektive der Renaissance mit Fluchtpunkt",
    `${panel(8, 8, 644, 284, "panel-bg")}
     ${badgePill(172, 30, 260, "Mittelalter: Bedeutungsperspektive", C.ochre)}
     ${badgePill(488, 30, 260, "Renaissance: Zentralperspektive", C.blue)}
     ${left}${right}
     ${label(172, 278, "wichtig = groß", "lbl tiny strong")}
     ${label(488, 278, "nah = groß, fern = klein – wie das Auge sieht", "lbl tiny strong")}`,
  );
}

export function druckSchritte(): string {
  return chain(
    "Gutenbergs System: Lettern gießen, setzen, einfärben, drucken",
    [
      { head: "Gießen", body: "Metall-Lettern mit dem\nHandgießinstrument", colour: C.slate, icon: "🔥" },
      { head: "Setzen", body: "Buchstaben spiegel-\nverkehrt zu Zeilen", colour: C.blue, icon: "🔤" },
      { head: "Einfärben", body: "zähe, ölhaltige\nDruckfarbe", colour: C.purple, icon: "🖌️" },
      { head: "Drucken", body: "Presse drückt Papier\ngleichmäßig auf den Satz", colour: C.red, icon: "📄" },
    ],
    4,
    760,
  );
}

export function abschriftDruckVergleich(): string {
  const dots = Array.from({ length: 180 }, (_, i) => {
    const col = i % 30;
    const row = Math.floor(i / 30);
    return `<rect x="${f1(330 + col * 10)}" y="${f1(92 + row * 14)}" width="7" height="10" rx="1.5" fill="${C.blue}"/>`;
  }).join("");
  return svg(
    660,
    250,
    "Vergleich: In der Zeit, in der ein Schreiber eine Bibel abschrieb, entstanden in Gutenbergs Werkstatt rund 180 Bibeln",
    `${panel(8, 8, 644, 234, "panel-bg")}
     ${label(330, 32, "Etwa gleich viel Zeit – ganz unterschiedliche Ergebnisse", "lbl small strong")}
     ${label(160, 70, "Ein Schreiber mit der Hand", "lbl tiny strong")}
     <rect x="146" y="92" width="28" height="40" rx="3" fill="${C.ochre}"/>
     ${label(160, 156, "1 Bibel", "lbl small strong")}
     ${label(480, 70, "Gutenbergs Werkstatt (um 1452–1454)", "lbl tiny strong")}
     ${dots}
     ${label(480, 196, "rund 180 Bibeln", "lbl small strong")}
     ${label(330, 228, "Schätzung nach der Forschung; ein Rechteck steht für eine Bibel.", "lbl tiny muted")}`,
  );
}

export function entdeckungsVoraussetzungen(): string {
  return cardGrid(
    "Voraussetzungen der Entdeckungsfahrten: Schiffe, Instrumente, Karten und Wissen",
    [
      { head: "Karavelle", body: "wendiges Segelschiff,\nkreuzt auch gegen den Wind", colour: C.blue, icon: "⛵" },
      { head: "Kompass", body: "zeigt die Himmels-\nrichtung auf offener See", colour: C.red, icon: "🧭" },
      { head: "Astrolabium", body: "misst den Sonnenstand –\nergibt den Breitengrad", colour: C.purple, icon: "☀️" },
      { head: "Karten und Wissen", body: "Seekarten, Globus (1492);\nErde als Kugel bekannt", colour: C.green, icon: "🗺️" },
    ],
    2,
    660,
  );
}

export function kolumbianischerAustausch(): string {
  return svg(
    660,
    260,
    "Kolumbianischer Austausch: Kartoffel, Mais, Tomate, Kakao und Tabak gelangten nach Europa; Pferd, Rind, Weizen, Zuckerrohr und Krankheiten nach Amerika",
    `${panel(8, 8, 644, 244, "panel-bg")}
     <rect x="24" y="24" width="220" height="210" rx="12" fill="${C.green}"/>
     ${label(134, 50, "Amerika", "lbl small on-dark strong")}
     ${labels(134, 82, "Kartoffel\nMais\nTomate\nKakao\nTabak", "lbl small on-dark", "middle", 24)}
     <rect x="416" y="24" width="220" height="210" rx="12" fill="${C.blue}"/>
     ${label(526, 50, "Europa, Afrika, Asien", "lbl small on-dark strong")}
     ${labels(526, 82, "Pferd und Rind\nWeizen\nZuckerrohr\nPocken und Masern\nversklavte Menschen", "lbl small on-dark", "middle", 24)}
     ${arrow(250, 90, 408, 90)}
     ${label(330, 80, "nach Europa", "lbl tiny strong")}
     ${arrow(408, 170, 250, 170)}
     ${label(330, 160, "nach Amerika", "lbl tiny strong")}
     ${labels(330, 206, "Atlantik", "lbl small sea-label", "middle", 14)}`,
  );
}

/* ---------- LB 4 ---------- */

export function lehnwoerter(): string {
  const pairs = [
    ["murus", "Mauer"],
    ["fenestra", "Fenster"],
    ["cellarium", "Keller"],
    ["tegula", "Ziegel"],
    ["strata", "Straße"],
    ["vinum", "Wein"],
    ["mercatus", "Markt"],
    ["moneta", "Münze"],
  ];
  return svg(
    660,
    250,
    "Lateinische Lehnwörter im Deutschen als Spuren des Kulturkontakts am Limes: Mauer, Fenster, Keller, Ziegel, Straße, Wein, Markt, Münze",
    `${panel(8, 8, 644, 234, "panel-bg")}
     ${label(330, 30, "Was die Germanen von den Römern übernahmen – bis heute in unserer Sprache", "lbl small strong")}
     ${pairs
       .map(([la, de], i) => {
         const x = 24 + (i % 4) * 156;
         const y = 50 + Math.floor(i / 4) * 92;
         return `<rect x="${x}" y="${y}" width="144" height="78" rx="10" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/>
           <rect x="${x}" y="${y}" width="144" height="30" rx="10" fill="${C.red}"/>
           ${label(x + 72, y + 20, la, "lbl small on-dark strong")}
           ${label(x + 72, y + 60, `→ ${de}`, "lbl small strong")}`;
       })
       .join("")}
     ${label(330, 236, "Bauen, Weinbau, Straßen und Geldhandel kamen mit den Römern.", "lbl tiny muted")}`,
  );
}

export function chinaEuropaVergleich(): string {
  return compare(
    "Vergleich von China (Song-Dynastie) und Europa zur Zeit des europäischen Mittelalters",
    {
      head: "China (Song, 960–1279)",
      colour: C.red,
      points: [
        "Städte mit weit über 1 Million Menschen",
        "Papiergeld vom Staat (11. Jh.)",
        "Holzblockdruck, Tonlettern (um 1040)",
        "Magnetkompass auf Schiffen",
        "Porzellan und Seide als Export",
      ],
    },
    {
      head: "Europa (um 1300)",
      colour: C.blue,
      points: [
        "größte Städte um 100 000 Menschen",
        "Münzen aus Silber und Gold",
        "Bücher von Hand abgeschrieben",
        "Kompass erst seit dem 12. Jh.",
        "viele konkurrierende Staaten",
      ],
    },
    660,
  );
}

function shipIcon(x: number, y: number, s: number, fill: string): string {
  return `<g transform="translate(${f1(x)},${f1(y)}) scale(${s})"><path d="M-10 0L-7 5H7L10 0Z" fill="${fill}"/><path d="M0 0V-12L7 -2Z" fill="${fill}" opacity="0.7"/></g>`;
}

export function zhengHeKolumbus(): string {
  const many = Array.from({ length: 200 }, (_, i) =>
    shipIcon(358 + (i % 20) * 14, 60 + Math.floor(i / 20) * 15, 0.55, C.red),
  ).join("");
  return svg(
    660,
    260,
    "Größenvergleich der Flotten: Zheng He fuhr mit über 200 Schiffen, Kolumbus 1492 mit drei Schiffen",
    `${panel(8, 8, 644, 244, "panel-bg")}
     ${label(170, 34, "Kolumbus 1492", "lbl small strong")}
     ${shipIcon(110, 120, 2.6, C.blue)}${shipIcon(170, 120, 2.6, C.blue)}${shipIcon(230, 120, 2.6, C.blue)}
     ${labels(170, 168, "3 Schiffe\nrund 90 Mann", "lbl small strong", "middle", 18)}
     ${label(490, 34, "Zheng He 1405–1433", "lbl small strong")}
     ${many}
     ${labels(490, 230, "über 200 Schiffe, mehr als 20 000 Mann\n(nach chinesischen Berichten)", "lbl tiny strong", "middle", 14)}
     ${label(170, 238, "Ein Symbol = ein Schiff", "lbl tiny muted")}`,
  );
}

export function hanseKogge(): string {
  return svg(
    660,
    280,
    "Hansekogge mit Laderaum und typischen Handelswaren: Pelze, Wachs, Stockfisch, Hering, Salz, Getreide und Tuch",
    `${panel(8, 8, 644, 264, "panel-bg")}
     <rect x="16" y="190" width="628" height="74" rx="10" class="sea"/>
     <g transform="translate(200,190)">
       <path d="M-140 -10L-120 40H120L150 -16L130 -24H-130Z" class="hull" stroke="var(--f-ink)" stroke-width="2"/>
       <rect x="-130" y="-46" width="60" height="30" fill="var(--f-wood)" stroke="var(--f-ink)"/>
       <rect x="96" y="-50" width="44" height="30" fill="var(--f-wood)" stroke="var(--f-ink)"/>
       <line x1="0" y1="-20" x2="0" y2="-170" stroke="var(--f-wood)" stroke-width="6"/>
       <path d="M-70 -160Q0 -150 70 -160L64 -50Q0 -40 -64 -50Z" class="sail" stroke="var(--f-ink)"/>
       <path d="M-6 -160L0 -182L40 -172Z" fill="${C.red}"/>
       <rect x="-90" y="-2" width="40" height="22" rx="3" fill="#a5876a"/><rect x="-40" y="-2" width="40" height="22" rx="3" fill="#c9a227"/><rect x="10" y="-2" width="40" height="22" rx="3" fill="#8c8c8c"/><rect x="60" y="-2" width="40" height="22" rx="3" fill="#7f9fb8"/>
     </g>
     ${label(200, 258, "Kogge: bauchig, viel Laderaum, ein Mast", "lbl tiny strong")}
     ${panel(400, 24, 236, 160, "panel-bg")}
     ${label(518, 46, "Typische Waren", "lbl small strong")}
     ${labels(414, 70, "Osten: Pelze, Wachs, Getreide\nNorden: Stockfisch, Hering\nLüneburg: Salz\nWesten: Tuch, Wolle, Wein\nLübeck: Bier, Metallwaren", "lbl tiny", "start", 20)}`,
  );
}

export function fuggerAufstieg(): string {
  return chain(
    "Aufstieg der Fugger: vom Weber zum Bankier des Kaisers",
    [
      { head: "1367 Weber", body: "Hans Fugger zieht\nnach Augsburg", colour: C.slate, icon: "🧵" },
      { head: "Fernhandel", body: "Barchent, Gewürze,\nSeide aus Venedig", colour: C.ochre, icon: "📦" },
      { head: "Bergbau", body: "Silber in Tirol,\nKupfer in Oberungarn", colour: C.brown, icon: "⛏️" },
      { head: "Kredite", body: "1519: Geld für die\nWahl Karls V.", colour: C.red, icon: "💰" },
      { head: "1521 Fuggerei", body: "Stiftung für\nbedürftige Bürger", colour: C.green, icon: "🏘️" },
    ],
    5,
    780,
  );
}

export function lieferketteKaffee(): string {
  return chain(
    "Lieferkette einer Tasse Kaffee von der Plantage bis zum Supermarkt",
    [
      { head: "Anbau", body: "z. B. Brasilien,\nVietnam, Äthiopien", colour: C.green, icon: "🌱" },
      { head: "Hafen", body: "Säcke in\nContainern", colour: C.ochre, icon: "📦" },
      { head: "Schiff", body: "wochenlang über\ndie Ozeane", colour: C.blue, icon: "🚢" },
      { head: "Hamburg", body: "Entladen und\nZoll", colour: C.slate, icon: "⚓" },
      { head: "Rösterei", body: "rösten, mahlen,\nverpacken", colour: C.brown, icon: "🔥" },
      { head: "Supermarkt", body: "Verkauf an\nKundinnen und Kunden", colour: C.red, icon: "🛒" },
    ],
    2,
    660,
  );
}

export function handelFrueherHeute(): string {
  return compare(
    "Längsschnitt: Fernhandel in Antike und Mittelalter im Vergleich zum Welthandel heute",
    {
      head: "Limes, Hanse, Fugger",
      colour: C.brown,
      points: [
        "Grenzen mit Kontrolle und Abgaben",
        "Kontore und Netze von Städten",
        "Koggen und Lasttiere",
        "Briefe brauchen Wochen",
        "Wörter und Bräuche wandern mit",
      ],
    },
    {
      head: "Welthandel heute",
      colour: C.blue,
      points: [
        "Zölle und Handelsabkommen",
        "weltweite Konzerne und Häfen",
        "Containerschiffe und Flugzeuge",
        "Daten in Sekunden um die Welt",
        "Sprachen, Musik, Essen mischen sich",
      ],
    },
    660,
  );
}
