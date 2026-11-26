/**
 * Lernpfad hero panorama and the Nachschlagen structural overview of
 * Politik und Gesellschaft 8 (Gymnasium Bayern, SWG).
 */
import { arrow, label, labels, P, panel, person, svg } from "./draw";

export function heroPanorama(): string {
  return svg(
    860,
    160,
    "Überblick Politik und Gesellschaft 8 Gymnasium: Jugendphase, soziale Gruppen und Normen, Vorbilder und Influencer, Demokratie vor Ort, europäische Zusammenarbeit und Profilbereiche am SWG",
    `<rect width="860" height="160" rx="12" class="sky"/>
     <rect x="0" y="114" width="860" height="46" fill="var(--f-land)"/>
     <line x1="0" y1="114" x2="860" y2="114" stroke="var(--f-line)" stroke-width="1.5"/>
     <!-- 1: Jugendphase -->
     <circle cx="88" cy="64" r="32" fill="var(--f-panel)" stroke="${P.teal}" stroke-width="2.5"/>
     <polygon points="98,54 91,68 78,74 85,60" fill="${P.teal}"/>
     <circle cx="88" cy="64" r="3" fill="var(--f-halo)"/>
     ${label(88, 134, "Jugend & Identität", "lbl tiny strong")}
     <!-- 2: Werte & Gruppen -->
     ${person(222, 114, 0.85, "cloth-a")}
     ${person(258, 114, 0.85, "cloth-b", "out")}
     <line x1="210" y1="54" x2="270" y2="54" stroke="${P.amber}" stroke-width="3"/>
     <line x1="240" y1="40" x2="240" y2="66" stroke="${P.amber}" stroke-width="2.5"/>
     ${label(240, 134, "Werte, Normen & Konflikte", "lbl tiny strong")}
     <!-- 3: Vorbilder & Medien -->
     <rect x="358" y="38" width="66" height="54" rx="8" fill="var(--f-panel)" stroke="${P.plum}" stroke-width="2.2"/>
     <polygon points="391,48 395,58 406,59 398,66 400,77 391,71 382,77 384,66 376,59 387,58" fill="${P.plum}"/>
     ${label(391, 134, "Vorbilder & Influencer", "lbl tiny strong")}
     <!-- 4: Kommune & Demokratie -->
     <rect x="500" y="64" width="96" height="50" fill="var(--f-stone)" stroke="var(--f-ink)" stroke-width="1.2"/>
     <polygon points="494,64 548,36 602,64" fill="${P.blue}" stroke="var(--f-ink)" stroke-width="1.2"/>
     ${[514, 536, 558, 578].map((x) => `<rect x="${x}" y="76" width="8" height="24" fill="var(--f-halo)"/>`).join("")}
     ${label(548, 134, "Demokratie & Kommune", "lbl tiny strong")}
     <!-- 5: Europa & Profil -->
     <circle cx="725" cy="68" r="32" fill="var(--f-sea)" stroke="${P.green}" stroke-width="2.2"/>
     <ellipse cx="725" cy="68" rx="14" ry="32" fill="none" stroke="${P.green}" stroke-width="1.6"/>
     <line x1="693" y1="68" x2="757" y2="68" stroke="${P.green}" stroke-width="1.6"/>
     ${arrow(630, 74, 676, 74)}
     ${label(725, 134, "Europa & Profil SWG", "lbl tiny strong")}`,
  );
}

export function gesamtUebersicht(): string {
  const mandatory = [
    { code: "LB 1", title: "Jugendphase", h: "ca. 18 Std.", c: P.teal },
    { code: "LB 2", title: "Werte & Normen", h: "ca. 18 Std.", c: P.amber },
    { code: "LB 3", title: "Vorbilder & Idole", h: "ca. 16 Std.", c: P.plum },
    { code: "LB 4", title: "Politik vor Ort", h: "ca. 20 Std.", c: P.blue },
    { code: "LB 5", title: "Europa vor Ort", h: "ca. 12 Std.", c: P.green },
  ];
  const profil = [
    { code: "6.1", title: "Heimat(en)", h: "14 Std.", c: P.rust },
    { code: "6.2", title: "Medien & Debatte", h: "14 Std.", c: P.slate },
    { code: "6.3", title: "Soziale Gruppe", h: "14 Std.", c: P.red },
    { code: "6.4 / 6.5", title: "Gesundheit & Ernährung", h: "14 / 28 Std.", c: P.olive },
  ];
  return svg(
    760,
    270,
    "Aufbau des Lehrplans Politik und Gesellschaft 8 Gymnasium (SWG): Fünf Pflichtlernbereiche (ca. 84 Std.) und Profilbereich (ca. 28 Std.)",
    `${panel(6, 6, 748, 258, "panel-bg")}
     ${label(24, 34, "Pflichtlernbereiche für alle am SWG (ca. 84 Std.)", "lbl small strong", "start")}
     ${mandatory
       .map((m, i) => {
         const x = 20 + i * 145;
         return `<rect x="${x}" y="48" width="136" height="66" rx="10" fill="var(--surface)" stroke="${m.c}" stroke-width="2"/>
           <rect x="${x}" y="48" width="136" height="22" rx="8" fill="${m.c}"/>
           ${label(x + 68, 63, m.code, "lbl tiny on-dark strong")}
           ${label(x + 68, 86, m.title, "lbl tiny strong")}
           ${label(x + 68, 104, m.h, "lbl tiny muted")}`;
       })
       .join("")}
     <line x1="20" y1="134" x2="740" y2="134" stroke="var(--line)" stroke-dasharray="6 4"/>
     ${label(24, 158, "Profilbereich SWG (ca. 28 Std.): zwei 14-Std.-Bereiche oder 6.5 mit 28 Std.", "lbl small strong", "start")}
     ${profil
       .map((p, i) => {
         const x = 20 + i * 181;
         return `<rect x="${x}" y="172" width="170" height="72" rx="10" fill="var(--surface)" stroke="${p.c}" stroke-width="2"/>
           <rect x="${x}" y="172" width="170" height="22" rx="8" fill="${p.c}"/>
           ${label(x + 85, 187, `Profil ${p.code}`, "lbl tiny on-dark strong")}
           ${label(x + 85, 210, p.title, "lbl tiny strong")}
           ${labels(x + 85, 228, p.h, "lbl tiny muted", "middle", 14)}`;
       })
       .join("")}`,
  );
}
