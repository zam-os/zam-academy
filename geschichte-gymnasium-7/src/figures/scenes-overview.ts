/**
 * Lernpfad hero panorama and the Nachschlagen timeline of all Grundlegende
 * Daten of Geschichte 7 (962 bis 17./18. Jahrhundert).
 */
import { arrow, crown, f1, label, labels, panel, person, svg } from "./draw";
import { C } from "./scenes-lb1-2";

export function heroPanorama(): string {
  return svg(
    860,
    150,
    "Panorama vom Mittelalter zum Absolutismus: Königspfalz, gotische Kathedrale, Karavelle, Druckerpresse, Flugblatt und Barockschloss",
    `<rect width="860" height="150" rx="12" class="sky"/>
     <rect x="0" y="106" width="860" height="44" fill="var(--f-land)"/>
     <line x1="0" y1="106" x2="860" y2="106" stroke="var(--f-line)" stroke-width="1.5"/>
     <rect x="40" y="62" width="90" height="44" fill="var(--f-stone)" stroke="var(--f-ink)" stroke-width="1.2"/>
     <path d="M58 106V86A10 10 0 0 1 78 86V106Z" fill="var(--f-sky)"/><path d="M92 106V86A10 10 0 0 1 112 86V106Z" fill="var(--f-sky)"/>
     ${crown(85, 56, 0.9)}
     ${label(85, 126, "Königtum (962)", "lbl tiny strong")}
     <path d="M190 106V60L210 26L230 60V106Z" fill="var(--f-stone)" stroke="var(--f-ink)" stroke-width="1.2"/>
     <path d="M230 106V74L260 52L290 74V106Z" fill="var(--f-stone)" stroke="var(--f-ink)" stroke-width="1.2"/>
     <path d="M253 106V84L260 74L267 84V106Z" fill="#2f7fd0"/>
     ${label(240, 126, "Stadt und Kathedrale", "lbl tiny strong")}
     <g transform="translate(372,92)"><path d="M-40 0L-30 14H30L44 -2Z" class="hull" stroke="var(--f-ink)"/><line x1="0" y1="0" x2="0" y2="-52" stroke="var(--f-wood)" stroke-width="3"/><path d="M2 -50L30 -20L2 -14Z" class="sail" stroke="var(--f-ink)"/><path d="M-2 -46L-26 -20L-2 -16Z" class="sail" stroke="var(--f-ink)"/></g>
     <path d="M320 112Q372 104 424 112" fill="none" stroke="var(--f-river)" stroke-width="2"/>
     ${label(372, 126, "Entdeckungen (1492)", "lbl tiny strong")}
     <rect x="470" y="48" width="70" height="58" fill="var(--f-wood)" stroke="var(--f-ink)"/>
     <rect x="478" y="62" width="54" height="10" fill="var(--f-stone)"/>
     <line x1="505" y1="40" x2="505" y2="62" stroke="var(--f-ink)" stroke-width="3"/>
     <rect x="552" y="58" width="34" height="46" fill="#fffaf0" stroke="var(--f-ink)"/>
     <line x1="558" y1="70" x2="580" y2="70" stroke="var(--f-ink)"/><line x1="558" y1="78" x2="580" y2="78" stroke="var(--f-ink)"/><line x1="558" y1="86" x2="574" y2="86" stroke="var(--f-ink)"/>
     ${label(528, 126, "Buchdruck und Reformation", "lbl tiny strong")}
     <rect x="640" y="66" width="190" height="40" fill="#f4e6c8" stroke="var(--f-ink)" stroke-width="1.2"/>
     <path d="M700 66L735 44L770 66Z" fill="var(--f-stone)" stroke="var(--f-ink)"/>
     <circle cx="735" cy="58" r="6" fill="#f2cf3d"/>
     ${Array.from({ length: 8 }, (_, i) => `<rect x="${652 + i * 22}" y="76" width="10" height="16" fill="var(--f-sky)"/>`).join("")}
     ${person(620, 106, 0.8, "cloth-a")}
     ${label(735, 126, "Absolutismus und Barock", "lbl tiny strong")}`,
  );
}

export function gesamtZeitleiste(): string {
  const x = (year: number) => 40 + ((year - 900) / 900) * 680;
  const events: Array<{ y: number; d: string; t: string; c: string; up: boolean; far?: boolean }> = [
    { y: 962, d: "962", t: "Kaiserkrönung\nOttos des Großen", c: C.brown, up: true },
    { y: 1077, d: "1077", t: "Canossa\n(Investiturstreit)", c: C.brown, up: false },
    { y: 1099, d: "1099", t: "Kreuzfahrer\nerobern Jerusalem", c: C.blue, up: true },
    { y: 1200, d: "um 1200", t: "kulturelle Blüte\nzur Stauferzeit", c: C.ochre, up: false, far: true },
    { y: 1348, d: "1347–1351", t: "Pest in\nEuropa", c: C.ochre, up: true },
    { y: 1453, d: "1453", t: "Eroberung\nKonstantinopels", c: C.blue, up: false },
    { y: 1492, d: "1492", t: "Entdeckung\nAmerikas", c: C.blue, up: true },
    { y: 1517, d: "1517", t: "Beginn der\nReformation", c: C.red, up: false, far: true },
    { y: 1633, d: "1618–1648", t: "Dreißigjähriger\nKrieg", c: C.red, up: true },
    { y: 1700, d: "17./18. Jh.", t: "Absolutismus\nin Europa", c: C.green, up: false },
  ];
  return svg(
    760,
    270,
    "Gesamt-Zeitleiste der Grundlegenden Daten der 7. Klasse Geschichte Gymnasium von 962 bis zum Absolutismus im 17. und 18. Jahrhundert",
    `${panel(6, 6, 748, 258, "panel-bg")}
     <rect x="${f1(x(900))}" y="112" width="${f1(x(1500) - x(900))}" height="16" rx="4" fill="${C.brown}" opacity="0.2"/>
     <rect x="${f1(x(1500))}" y="112" width="${f1(x(1800) - x(1500))}" height="16" rx="4" fill="${C.green}" opacity="0.22"/>
     ${label(x(1500) - 8, 106, "Mittelalter", "lbl tiny strong", "end")}
     ${label(x(1800) - 6, 106, "Frühe Neuzeit", "lbl tiny strong", "end")}
     <line class="axis" x1="30" y1="120" x2="730" y2="120"/>
     ${arrow(716, 120, 744, 120)}
     ${[1000, 1200, 1400, 1600, 1800].map((y) => label(x(y), 142, String(y), "lbl tiny muted")).join("")}
     <rect x="${f1(x(1618))}" y="108" width="${f1(x(1648) - x(1618))}" height="24" fill="${C.red}" opacity="0.5"/>
     ${events
       .map(
         (e) => `<line x1="${f1(x(e.y))}" y1="120" x2="${f1(x(e.y))}" y2="${e.up ? 92 : e.far ? 192 : 150}" stroke="${e.c}" stroke-width="2"/>
           <circle cx="${f1(x(e.y))}" cy="120" r="6.5" fill="${e.c}" stroke="var(--f-halo)" stroke-width="2"/>
           ${label(x(e.y), e.up ? 38 : e.far ? 210 : 168, e.d, "lbl tiny strong")}
           ${labels(x(e.y), e.up ? 54 : e.far ? 226 : 184, e.t, "lbl tiny", "middle", 14)}`,
       )
       .join("")}`,
  );
}
