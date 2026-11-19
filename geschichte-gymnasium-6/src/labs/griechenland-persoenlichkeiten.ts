/**
 * Interactive labs for LB 3 (Die griechische Antike) and LB 4 (Menschen machen Geschichte):
 * - colonizationMap: Greek colonization across the Mediterranean & Black Sea (Natural Earth)
 * - persianWars: phases of the Persian Wars + trireme rower class & democracy link
 * - athensDemocracy: constitutional organs, excluded groups, Diäten, modern comparison
 * - alexanderCampaign: Alexander's campaign from Pella to the Indus (Natural Earth)
 * - powerComparison: scope and limits of Hatschepsut, Themistokles, and Alexander
 */
import {
  arrow,
  badgePill,
  f1,
  label,
  labels,
  northArrow,
  panel,
  person,
  shipTrireme,
  svg,
} from "../figures/draw";
import {
  ALEXANDER_FRAME,
  atCrop,
  type CropFrame,
  cropPaths,
  MAPS,
} from "../figures/maps";
import {
  fmtDe,
  type LabDef,
  num,
  remember,
  seen,
  str,
} from "./core";

/* ---------- 5. Griechische Kolonisation (LB 3) ---------- */

const COLONIZATION_FRAME: CropFrame = {
  map: MAPS.rome,
  x0: 68,
  y0: 216,
  scale: 1.05,
  width: 640,
  height: 340,
};

const COLONY_TARGETS: Record<
  string,
  {
    name: string;
    from: [number, number];
    fromName: string;
    to: [number, number];
    cities: string;
    detail: string;
  }
> = {
  italien: {
    name: "Unteritalien & Sizilien („Großgriechenland“)",
    from: [23.6, 38.4],
    fromName: "Chalkis / Korinth",
    to: [15.29, 37.07],
    cities: "Syrakus, Neapel, Tarent",
    detail: "Fruchtbare Küstenebenen sicherten Korn für die wachsende Bevölkerung der Mutterstädte.",
  },
  westen: {
    name: "Westliches Mittelmeer (Südgallien / Spanien)",
    from: [26.75, 38.67],
    fromName: "Phokaia",
    to: [5.37, 43.3],
    cities: "Massalia (Marseille), Emporion",
    detail: "Stützpunkte für Fernhandel mit Zinn, Silber und Wein entlang der Rhône und in Spanien.",
  },
  schwarzmeer: {
    name: "Schwarzes Meer & Meerengen",
    from: [27.28, 37.53],
    fromName: "Milet / Megara",
    to: [28.98, 41.01],
    cities: "Byzantion, Sinope, Olbia",
    detail: "Kontrolle über die Meerengen (Bosporus) und Getreide- sowie Fischhandel aus dem Schwarzmeerraum.",
  },
  afrika: {
    name: "Nordafrika & Nildelta",
    from: [25.43, 36.4],
    fromName: "Thera / Ostgriechen",
    to: [21.86, 32.82],
    cities: "Kyrene, Naukratis",
    detail: "Handelshäfen für Getreide, Heilpflanzen und den Austausch mit Ägypten.",
  },
};

export const colonizationMap: LabDef = {
  title: "Geschichtskarte: Griechische Kolonisation",
  prompt:
    "Wähle Zielregionen der griechischen Auswanderung (8.–6. Jh. v. Chr.), prüfe Gründe und vergleiche das antike Muster mit Migration heute.",
  init: () => ({
    region: "italien",
    cause: "landnot",
    compareToday: false,
    visited: "",
  }),
  controls: () => [
    {
      type: "choice",
      key: "region",
      label: "Zielregion der Tochterstädte",
      options: [
        { value: "italien", label: "Unteritalien & Sizilien" },
        { value: "westen", label: "Massalia (Westen)" },
        { value: "schwarzmeer", label: "Schwarzes Meer" },
        { value: "afrika", label: "Nordafrika (Kyrene)" },
      ],
    },
    {
      type: "choice",
      key: "cause",
      label: "Auslöser in der Mutterstadt",
      options: [
        { value: "landnot", label: "Landnot & Bevölkerungswachstum" },
        { value: "handel", label: "Suche nach Rohstoffen & Handel" },
        { value: "konflikt", label: "Politische Konflikte in der Polis" },
      ],
    },
    {
      type: "toggle",
      key: "compareToday",
      label: "Vergleich mit moderner Migration einblenden",
    },
  ],
  set: (s, key, value) => {
    s[key] = value;
    remember(s, "visited", str(s, "region"));
  },
  goals: (s) => [
    {
      text: "Mindestens drei verschiedene Kolonisationsgebiete auf der Karte erkunden",
      met: str(s, "visited").split(",").filter(Boolean).length >= 3,
    },
    {
      text: "Handel und politische Konflikte neben Landnot als Ursachen prüfen",
      met: str(s, "cause") === "handel" || str(s, "cause") === "konflikt",
    },
    {
      text: "Gemeinsamkeiten und Unterschiede zu heutigen Migrationsbewegungen vergleichen",
      met: s.compareToday === true,
    },
  ],
  draw: (s) => {
    const f = COLONIZATION_FRAME;
    const region = str(s, "region");
    const target = COLONY_TARGETS[region];
    const [fx, fy] = atCrop(f, target.from[0], target.from[1]);
    const [tx, ty] = atCrop(f, target.to[0], target.to[1]);
    const mx = (fx + tx) / 2;
    const my = Math.min(fy, ty) - 24;
    const compare = s.compareToday === true;

    return svg(
      f.width,
      f.height,
      `Natural-Earth-Karte der griechischen Kolonisation mit Fokus auf ${target.name}`,
      `<rect class="sea" width="${f.width}" height="${f.height}"/>
       ${cropPaths(f, f.map.layers.countries, (c) => (c.id === "GRC" ? "state-home" : "land"))}
       <path class="route-main" d="M${f1(fx)} ${f1(fy)} Q${f1(mx)} ${f1(my)} ${f1(tx)} ${f1(ty)}"/>
       <circle cx="${f1(fx)}" cy="${f1(fy)}" r="5" fill="var(--f-ink)" stroke="var(--f-halo)" stroke-width="1.5"/>
       <circle cx="${f1(tx)}" cy="${f1(ty)}" r="6" fill="var(--f-red)" stroke="var(--f-halo)" stroke-width="2"/>
       ${label(fx + 8, fy + 16, target.fromName, "lbl tiny strong", "start")}
       ${label(tx + (tx < 330 ? 8 : 0), ty - 14, target.cities, "lbl small strong", tx < 330 ? "end" : "middle")}
       ${label(280, 175, "Mittelmeer", "lbl small sea-label")}
       ${label(495, 76, "Schwarzes Meer", "lbl tiny sea-label")}
       ${northArrow(f.width - 26, 26)}
       ${panel(12, 214, 344, 114, "panel-bg")}
       ${label(24, 236, target.name, "lbl small strong", "start")}
       ${labels(
         24,
         256,
         compare
           ? "Vergleich mit Migration heute:\n• Gemeinsam: Suche nach besserem Auskommen & Sicherheit.\n• Unterschied: Antike Siedler gründeten neue autonome Poleis\n  per Schiff; heutige Migranten ziehen in bestehende Staaten."
           : `${target.detail}\nNeue Poleis blieben unabhängig, pflegten aber Götter,\nSprache und Handel mit der Mutterstadt.\n(Heutige Staatsgrenzen dienen nur zur Orientierung.)`,
         "lbl tiny",
         "start",
         15,
       )}`,
    );
  },
  readout: (s) => {
    const t = COLONY_TARGETS[str(s, "region")];
    const causeText =
      str(s, "cause") === "landnot"
        ? "In den engen Tälern Griechenlands reichte das Ackerland nicht mehr für alle."
        : str(s, "cause") === "handel"
          ? "Metalle, Getreide und Absatzmärkte lockten Seefahrer an ferne Küsten."
          : "Unterlegene Adelsgruppen oder Bürger wichen politischen Spannungen aus.";
    return `${t.name} (${t.cities}): ${causeText} ${t.detail}`;
  },
};

/* ---------- 6. Perserkriege & Attische Demokratie (LB 3) ---------- */

const WAR_PHASES: Record<
  string,
  { year: string; title: string; result: string; impact: string }
> = {
  marathon: {
    year: "490 v. Chr.",
    title: "Schlacht bei Marathon",
    result: "Schwerbewaffnete Bürger (Hopliten) aus Athen besiegen das persische Landungsheer.",
    impact: "Stärkt das Selbstvertrauen der Bürger: Sie verteidigen ihre Polis selbst statt ein Königsheer.",
  },
  thermopylen: {
    year: "480 v. Chr.",
    title: "Engpass der Thermopylen",
    result: "Ein kleines griechisches Heer unter König Leonidas von Sparta hält das Perserheer kurz auf, unterliegt aber.",
    impact: "Athen wird geräumt; die Verteidigung hängt nun allein an der hölzernen Flotte.",
  },
  salamis: {
    year: "480 v. Chr.",
    title: "Seeschlacht bei Salamis",
    result: "Themistokles lockt die große persische Flotte in die enge Bucht; wendige Trieren siegen.",
    impact: "Entscheidend: 170 Ruderer pro Triere sind ärmere Bürger (Theten), die schon in der Volksversammlung saßen – ihr Kriegseinsatz vervielfacht ihr politisches Gewicht.",
  },
  plataiai: {
    year: "479 v. Chr.",
    title: "Schlacht bei Plataiai",
    result: "Das vereinte griechische Landheer schlägt das verbliebene Perserheer auf dem Festland zurück.",
    impact: "Athen wird zur führenden Seemacht im Seebund – der Einfluss der ärmeren Flottenbesatzungen treibt weitere demokratische Reformen voran.",
  },
};

export const persianWars: LabDef = {
  title: "Perserkriege und der Aufstieg der Ruderer",
  prompt:
    "Verfolge die vier Stationen der Perserkriege (490–479 v. Chr.) und öffne das Triere-Modell: Warum veränderte dieser Krieg die Demokratie?",
  init: () => ({ phase: "marathon", trireme: false }),
  controls: () => [
    {
      type: "choice",
      key: "phase",
      label: "Kriegsereignis",
      options: [
        { value: "marathon", label: "490 v. Chr. Marathon" },
        { value: "thermopylen", label: "480 v. Chr. Thermopylen" },
        { value: "salamis", label: "480 v. Chr. Salamis" },
        { value: "plataiai", label: "479 v. Chr. Plataiai" },
      ],
    },
    {
      type: "toggle",
      key: "trireme",
      label: "Ruderer-Ansicht (Triere & Ränge in Athen) einblenden",
    },
  ],
  goals: (s) => [
    {
      text: "Die entscheidende Seeschlacht bei Salamis (480 v. Chr.) auswählen",
      met: str(s, "phase") === "salamis",
    },
    {
      text: "Die Rolle der armen Bürger (Theten) als Ruderer auf der Triere untersuchen",
      met: s.trireme === true,
    },
    {
      text: "Alle Ereignisse bis zum Sieg 479 v. Chr. (Plataiai) durchlaufen",
      met: str(s, "phase") === "plataiai",
    },
  ],
  draw: (s) => {
    const phase = str(s, "phase");
    const info = WAR_PHASES[phase];
    const showTrireme = s.trireme === true;

    return svg(
      620,
      250,
      `${info.year} ${info.title}: Auswirkung der Perserkriege auf die attische Demokratie`,
      `${panel(8, 8, 604, 234, "panel-bg")}
       ${label(24, 34, `${info.year} · ${info.title}`, "lbl strong", "start")}
       ${showTrireme
         ? `${shipTrireme(156, 132, 1.35)}
            ${labels(156, 186, "Triere: 3 Ruderreihen übereinander,\nrund 170 Ruderer aus der ärmsten Schicht (Theten)", "lbl tiny strong")}`
         : `<rect x="28" y="60" width="248" height="156" rx="10" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/>
            ${labels(152, 92, "Kräfteverhältnis im Kampf", "lbl small strong")}
            ${person(96, 174, 1.1, "cloth-b", "out")}
            ${person(206, 174, 1.1, "cloth-a", "up")}
            ${label(96, 198, "Persisches Großreich", "lbl tiny")}
            ${label(206, 198, "Griechische Poleis", "lbl tiny strong")}`}
       ${panel(304, 52, 290, 172, "panel-bg")}
       ${labels(318, 76, "Ablauf & militärische Lage:", "lbl small strong", "start", 16)}
       ${labels(318, 100, phase === "marathon" ? "Athener Fußbürger besiegen das persische\nLandungsheer an der Küste bei Marathon." : phase === "thermopylen" ? "Opfergang am engen Pass verschafft\nder Flotte Zeit zum Sammeln." : phase === "salamis" ? "In der schmalen Bucht rammen flinke\nTrieren die großen Perserschiffe." : "Vereintes Landheer siegt; danach\nführen Athen und seine Flotte den Schutz.", "lbl tiny", "start", 15)}
       <line x1="318" y1="154" x2="580" y2="154" stroke="var(--line)"/>
       ${label(318, 172, "Folge für die Demokratie:", "lbl small strong", "start")}
       ${labels(318, 192, showTrireme ? "Theten saßen schon in der Volksversammlung –\nihr Rudereinsatz vervielfacht ihr Gewicht!" : "Schalte die Triere ein, um zu sehen,\nwer diesen Sieg ermöglichte.", "lbl tiny strong", "start", 15)}`,
    );
  },
  readout: (s) => {
    const info = WAR_PHASES[str(s, "phase")];
    return `${info.year} ${info.title}: ${info.result} ${info.impact}`;
  },
};

/* ---------- 7. Verfassung der Attischen Demokratie (LB 3) ---------- */

const ATHENS_ORGANS: Record<
  string,
  { name: string; role: string; count: string; detail: string }
> = {
  ekklesia: {
    name: "Volksversammlung (Ekklesia)",
    role: "beschließt Gesetze, Krieg & Frieden, Ostrakismos",
    count: "alle männlichen Vollbürger ab ca. 20 J.",
    detail: "Tagte ca. 40-mal im Jahr auf dem Pnyx-Hügel; jeder Vollbürger durfte reden und per Handzeichen abstimmen.",
  },
  bule: {
    name: "Rat der 500 (Bule)",
    role: "bereitet Anträge vor & führt Tagesgeschäfte",
    count: "500 durch Los bestimmte Bürger (je 50 je Phyle)",
    detail: "Kein Berufspolitiker: Das Losverfahren verhinderte dauerhafte Macht einzelner Familien.",
  },
  heliaia: {
    name: "Volksgericht (Heliaia)",
    role: "spricht Recht in großen Geschworenengruppen",
    count: "6000 ausgeloste Richter pro Jahr",
    detail: "Ab Perikles erhielten Richter ein Tagegeld (Diäten), damit auch Tagelöhner und Handwerker teilnehmen konnten.",
  },
  strategen: {
    name: "10 Strategen (Heerführer)",
    role: "leiten Heer & Flotte (nicht gelost, sondern gewählt!)",
    count: "10 jährlich gewählte Fachleute",
    detail: "Hier war Fachwissen nötig – Perikles wurde über 15 Jahre lang immer wieder zum Strategen gewählt.",
  },
};

export const athensDemocracy: LabDef = {
  title: "Schaubild: Verfassung der attischen Demokratie",
  prompt:
    "Untersuche die vier Verfassungsorgane Athens, prüfe, wer ausgeschlossen war, und vergleiche den Zustand mit und ohne Tagegelder (Diäten).",
  init: () => ({ organ: "ekklesia", group: "buerger", diaeten: false }),
  controls: () => [
    {
      type: "choice",
      key: "organ",
      label: "Verfassungsorgan untersuchen",
      options: [
        { value: "ekklesia", label: "Volksversammlung" },
        { value: "bule", label: "Rat der 500" },
        { value: "heliaia", label: "Volksgericht" },
        { value: "strategen", label: "10 Strategen" },
      ],
    },
    {
      type: "choice",
      key: "group",
      label: "Bevölkerungsgruppe prüfen",
      options: [
        { value: "buerger", label: "Männliche Vollbürger (~15 %)" },
        { value: "ausgeschlossen", label: "Frauen, Metöken & Sklaven (~85 %)" },
      ],
    },
    {
      type: "toggle",
      key: "diaeten",
      label: "Tagegelder (Diäten unter Perikles) zahlen",
    },
  ],
  goals: (s) => [
    {
      text: "Den Unterschied zwischen Auslosung (Rat/Gericht) und Wahl (Strategen) prüfen",
      met: str(s, "organ") === "strategen",
    },
    {
      text: "Prüfen, welche rund 85 % der Bevölkerung Athens vom Bürgerrecht ausgeschlossen waren",
      met: str(s, "group") === "ausgeschlossen",
    },
    {
      text: "Wirkung der Diäten (Tagegelder) für arme Bürger aktivieren",
      met: s.diaeten === true,
    },
  ],
  draw: (s) => {
    const organ = str(s, "organ");
    const org = ATHENS_ORGANS[organ];
    const excl = str(s, "group") === "ausgeschlossen";
    const diaeten = s.diaeten === true;

    const boxes = [
      { id: "ekklesia", x: 30, y: 40, w: 250, h: 48, title: "Volksversammlung (Ekklesia)", sub: "entscheidet direkt" },
      { id: "bule", x: 320, y: 40, w: 270, h: 48, title: "Rat der 500 (gelost)", sub: "bereitet Gesetze vor" },
      { id: "heliaia", x: 30, y: 112, w: 250, h: 48, title: "Volksgericht (gelost)", sub: "kontrolliert Beamte & Recht" },
      { id: "strategen", x: 320, y: 112, w: 270, h: 48, title: "10 Strategen (gewählt)", sub: "führen Flotte & Heer" },
    ];

    return svg(
      620,
      260,
      `Verfassungsschaubild der attischen Demokratie mit Fokus auf ${org.name}`,
      `${panel(8, 8, 604, 244, "panel-bg")}
       ${label(310, 28, "Schaubild: Verfassung Athens im 5. Jh. v. Chr.", "lbl small strong")}
       ${boxes
         .map((b) => {
           const active = b.id === organ;
           return `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="10" fill="${active ? "var(--accent)" : "var(--surface)"}" stroke="${active ? "var(--accent)" : "var(--f-line)"}" stroke-width="${active ? 2.5 : 1.5}"/>
             ${label(b.x + b.w / 2, b.y + 21, b.title, `lbl tiny ${active ? "on-dark" : ""} strong`)}
             ${label(b.x + b.w / 2, b.y + 38, b.sub, `lbl tiny ${active ? "on-dark" : "muted"}`)}`;
         })
         .join("")}
       ${arrow(280, 64, 318, 64)}
       ${arrow(155, 88, 155, 110)}
       ${arrow(455, 88, 455, 110)}
       <rect x="30" y="176" width="560" height="62" rx="10" fill="${excl ? "var(--gold-soft)" : "var(--accent-soft)"}" stroke="${excl ? "#9e2a2b" : "var(--accent)"}"/>
       ${labels(
         44,
         198,
         excl
           ? "Ausgeschlossen (~85 %): Frauen (keine politischen Rechte), Metöken (ortsansässige Fremde,\nzahlen Steuern ohne Stimmrecht) und Sklaven (rechtloses Eigentum, stützen die Wirtschaft)."
           : `Wahlberechtigte Vollbürger (~15 %): Männer mit athenischen Eltern über 20 Jahre.\n${diaeten ? "✓ Mit Diäten (Perikles): Auch arme Handwerker & Ruderer können Tagungen bezahlen!" : "○ Ohne Diäten: Ärmere Bürger verlieren Tageslohn, wenn sie ein Amt übernehmen."}`,
         "lbl tiny strong",
         "start",
         16,
       )}`,
    );
  },
  readout: (s) => {
    const org = ATHENS_ORGANS[str(s, "organ")];
    const part =
      str(s, "group") === "ausgeschlossen"
        ? "Frauen, Metöken und Sklaven waren ausgeschlossen – gemessen an heute war das noch keine allgemeine Demokratie."
        : s.diaeten === true
          ? "Mit Tagegeldern (Diäten) öffnete Perikles Ämter auch für ärmere Bürger."
          : "Ohne Tagegelder konnten vor allem Wohlhabende regelmäßig Ämter ausüben.";
    return `${org.name} (${org.count}): ${org.role}. ${org.detail} ${part}`;
  },
};

/* ---------- 8. Alexanders Eroberungszug (LB 4) ---------- */

const ALEX_STAGES = [
  { step: 1, year: "334 v. Chr.", place: "Granikos (Kleinasien)", lon: 27.3, lat: 40.2, distLabel: "ca. 700 km Marsch", status: "Erster Sieg über persische Statthalter – Beginn des Feldzugs." },
  { step: 2, year: "333 v. Chr.", place: "Issos (Syrien)", lon: 36.2, lat: 36.8, distLabel: "ca. 1900 km Marsch", status: "Sieg über Großkönig Dareios III.; Zugang zur Mittelmeerküste." },
  { step: 3, year: "332 v. Chr.", place: "Ägypten / Alexandria", lon: 29.9, lat: 31.2, distLabel: "ca. 2900 km Marsch", status: "Als Befreier & Pharao begrüßt; Gründung von Alexandria." },
  { step: 4, year: "331 v. Chr.", place: "Gaugamela & Babylon", lon: 44.4, lat: 32.5, distLabel: "ca. 4400 km Marsch", status: "Entscheidungssieg über das Perserreich; Einzug in Babylon." },
  { step: 5, year: "326 v. Chr.", place: "Indus (Grenze des Zugs)", lon: 71.0, lat: 32.5, distLabel: "ca. 7600 km Hinweg", status: "Heer meutert nach Regen und Jahren des Marschierens → Umkehr!" },
  { step: 6, year: "323 v. Chr.", place: "Tod in Babylon & Zerfall", lon: 44.4, lat: 32.5, distLabel: "langer Rückmarsch durch die Gedrosische Wüste", status: "Nach entbehrungsreichem Rückzug stirbt Alexander mit 32 Jahren ohne festen Erben → Reich zerfällt." },
];

export const alexanderCampaign: LabDef = {
  title: "Geschichtskarte: Feldzug Alexanders des Großen",
  prompt:
    "Verfolge Alexanders Zug von Makedonien bis an den Indus (334–323 v. Chr.). Wo zeigt die Karte seine Möglichkeiten – und wo seine Grenzen?",
  init: () => ({ step: 1, showLimits: false }),
  controls: () => [
    {
      type: "range",
      key: "step",
      label: "Etappe des Feldzugs",
      min: 1,
      max: 6,
      step: 1,
      format: (v) => `${ALEX_STAGES[v - 1].year} · Etappe ${fmtDe(v)}`,
    },
    {
      type: "toggle",
      key: "showLimits",
      label: "Grenzen (Entfernung, Meuterei, Zerfall) hervorheben",
    },
  ],
  goals: (s) => [
    {
      text: "Die frühe Station in Ägypten (332 v. Chr. Alexandria) erreichen",
      met: num(s, "step") >= 3,
    },
    {
      text: "Bis zum Wendepunkt am Indus (326 v. Chr.) vordringen",
      met: num(s, "step") >= 5,
    },
    {
      text: "Den Tod in Babylon 323 v. Chr. und die Grenzen eines Riesenreichs anzeigen",
      met: num(s, "step") >= 6 && s.showLimits === true,
    },
  ],
  draw: (s) => {
    const f = ALEXANDER_FRAME;
    const step = num(s, "step");
    const showLimits = s.showLimits === true;
    const pts: Array<[number, number]> = [
      atCrop(f, 22.5, 40.8),
      atCrop(f, 27.3, 40.2),
      atCrop(f, 36.2, 36.8),
      atCrop(f, 29.9, 31.2),
      atCrop(f, 44.4, 32.5),
      atCrop(f, 71.0, 32.5),
      atCrop(f, 44.4, 32.5),
    ];
    const activePts = pts.slice(0, step + 1);
    const poly = activePts.map(([x, y]) => `${f1(x)},${f1(y)}`).join(" ");
    const cur = activePts[activePts.length - 1];
    const st = ALEX_STAGES[step - 1];

    return svg(
      f.width,
      f.height,
      `Natural-Earth-Karte des Alexanderzugs bis ${st.place} (${st.year})`,
      `<rect class="sea" width="${f.width}" height="${f.height}"/>
       ${cropPaths(f, f.map.layers.continents, () => "land")}
       <polyline fill="none" stroke="var(--f-red)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${poly}"/>
       <circle cx="${f1(pts[0][0])}" cy="${f1(pts[0][1])}" r="4.5" fill="var(--f-ink)" stroke="var(--f-halo)" stroke-width="1.5"/>
       ${label(pts[0][0] - 6, pts[0][1] - 8, "Pella", "lbl tiny strong", "end")}
       ${activePts.slice(1).map(([x, y], idx) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${idx === activePts.length - 2 ? 7 : 4}" fill="${idx === activePts.length - 2 ? "var(--f-red)" : "var(--accent)"}" stroke="var(--f-halo)" stroke-width="1.8"/>`).join("")}
       ${label(cur[0], cur[1] - 12, st.place, "lbl small strong")}
       ${showLimits ? `<circle cx="${f1(pts[5][0])}" cy="${f1(pts[5][1])}" r="14" fill="none" stroke="var(--f-purple)" stroke-width="2.5" stroke-dasharray="4 3"/>${label(pts[5][0] - 8, pts[5][1] + 22, "Umkehr am Indus (7600 km!)", "lbl tiny strong", "end")}` : ""}
       ${northArrow(f.width - 26, 26)}
       ${panel(12, 238, 396, 110, "panel-bg")}
       ${label(24, 260, `${st.year} · ${st.place} (${st.distLabel})`, "lbl small strong", "start")}
       ${labels(
         24,
         282,
         showLimits
           ? `${st.status}\nGrenze von Herrschaft: Je weiter ein Heer marschiert, desto\nschwieriger werden Nachschub, Vertrauen und Nachfolge.`
           : `${st.status}\nAlexander verbindet Eroberung mit Stadtgründungen (Alexandria).`,
         "lbl tiny",
         "start",
         16,
       )}`,
    );
  },
  readout: (s) => {
    const st = ALEX_STAGES[num(s, "step") - 1];
    return `${st.year} ${st.place} (${st.distLabel}): ${st.status}`;
  },
};

/* ---------- 9. Handlungsspielräume historischer Persönlichkeiten (LB 4) ---------- */

const PERSON_DATA: Record<
  string,
  {
    name: string;
    era: string;
    form: string;
    legit: number;
    control: number;
    scope: number;
    limitLines: string;
    summary: string;
  }
> = {
  hatschepsut: {
    name: "Hatschepsut (Ägypten)",
    era: "ca. 1479–1458 v. Chr.",
    form: "Monarchie (Pharao)",
    legit: 90,
    control: 25,
    scope: 80,
    limitLines: "Gebunden an die Maat,\nPriester & Thronfolge;\nspätere Bildnistilgung\nunter Thutmosis III.",
    summary: "Großer Spielraum als Pharaonin – doch gebunden an Religion, Tradition und männliche Königssymbolik.",
  },
  themistokles: {
    name: "Themistokles (Athen)",
    era: "5. Jh. v. Chr.",
    form: "Demokratie (Polis)",
    legit: 45,
    control: 90,
    scope: 55,
    limitLines: "Braucht Mehrheit bei\njeder Abstimmung; wurde\nspäter per Ostrakismos\nfür 10 Jahre verbannt.",
    summary: "Kann die Polis durch Reden und Strategie prägen, braucht aber stets die Mehrheit und wird später verbannt.",
  },
  alexander: {
    name: "Alexander (Makedonien / Persien)",
    era: "336–323 v. Chr.",
    form: "Eroberungsmonarchie",
    legit: 85,
    control: 35,
    scope: 92,
    limitLines: "Heer verweigert 326\nden Weitermarsch am\nIndus; Tod 323 v. Chr.\nohne festen Nachfolger.",
    summary: "Enormer Eroberungsspielraum – doch begrenzt durch Meuterei des Heers, riesige Entfernungen und fehlenden Erben.",
  },
};

export const powerComparison: LabDef = {
  title: "Möglichkeiten und Grenzen von Herrschaft vergleichen",
  prompt:
    "Wähle zwischen Hatschepsut, Themistokles und Alexander und prüfe verschiedene Aspekte ihrer Herrschaft: Wie viel hängt von der Person ab, wie viel von der Staatsform?",
  init: () => ({ ruler: "hatschepsut", focus: "spielraum", seenRulers: "" }),
  controls: () => [
    {
      type: "choice",
      key: "ruler",
      label: "Historische Persönlichkeit",
      options: [
        { value: "hatschepsut", label: "Hatschepsut (Monarchie)" },
        { value: "themistokles", label: "Themistokles (Demokratie)" },
        { value: "alexander", label: "Alexander (Weltreich)" },
      ],
    },
    {
      type: "choice",
      key: "focus",
      label: "Bewertungsfrage",
      options: [
        { value: "spielraum", label: "Gestaltungsspielraum" },
        { value: "kontrolle", label: "Kontrolle durch andere" },
        { value: "grenzen", label: "Grenzen der Macht" },
      ],
    },
  ],
  set: (s, key, value) => {
    s[key] = value;
    remember(s, "seenRulers", str(s, "ruler"));
  },
  goals: (s) => [
    {
      text: "Alle drei historischen Persönlichkeiten miteinander vergleichen",
      met: ["hatschepsut", "themistokles", "alexander"].every((k) =>
        seen(s, "seenRulers", k),
      ),
    },
    {
      text: "Kontrolle in der Demokratie am Beispiel von Themistokles ablesen",
      met: str(s, "ruler") === "themistokles" && str(s, "focus") === "kontrolle",
    },
    {
      text: "Grenzen der Macht untersuchen",
      met: str(s, "focus") === "grenzen",
    },
  ],
  draw: (s) => {
    const ruler = str(s, "ruler");
    const focus = str(s, "focus");
    const d = PERSON_DATA[ruler];
    const bars = [
      { label: "Gestaltungsspielraum", val: d.scope, c: "#73357a" },
      { label: "Kontrolle durch Gesellschaft / Heer", val: d.control, c: "#1b5e8a" },
      { label: "Religiöse / traditionelle Stützung", val: d.legit, c: "#a16c0e" },
    ];

    return svg(
      620,
      240,
      `Vergleich von Macht, Kontrolle und Grenzen bei ${d.name}`,
      `${panel(8, 8, 604, 224, "panel-bg")}
       ${label(24, 34, `${d.name} · ${d.era}`, "lbl strong", "start")}
       ${badgePill(520, 30, 156, d.form, "#73357a")}
       ${bars
         .map((b, i) => {
           const y = 58 + i * 44;
           return `${label(24, y + 14, b.label, "lbl tiny strong", "start")}
             <rect x="24" y="${y + 20}" width="320" height="14" rx="7" fill="var(--soft)" stroke="var(--line)"/>
             <rect x="24" y="${y + 20}" width="${f1((b.val / 100) * 320)}" height="14" rx="7" fill="${b.c}"/>`;
         })
         .join("")}
       ${panel(368, 54, 226, 154, "panel-bg")}
       ${label(382, 78, focus === "spielraum" ? "Fokus: Spielraum" : focus === "kontrolle" ? "Fokus: Kontrolle" : "Fokus: Grenzen", "lbl small strong", "start")}
       ${labels(
         382,
         104,
         focus === "spielraum"
           ? "Einzelne können Weichen\nstellen (z. B. Handelsfahrt,\nFlottenbau, Feldzug) – doch\nnie völlig im luftleeren Raum."
           : focus === "kontrolle"
             ? "In der Demokratie (Athen)\nüberwacht die Versammlung\njeden Schritt; im Königtum\nwirken Priester & Heer."
             : d.limitLines,
         "lbl tiny",
         "start",
         16,
       )}`,
    );
  },
  readout: (s) => {
    const d = PERSON_DATA[str(s, "ruler")];
    return `${d.name} (${d.era}, ${d.form}): ${d.summary}`;
  },
};
