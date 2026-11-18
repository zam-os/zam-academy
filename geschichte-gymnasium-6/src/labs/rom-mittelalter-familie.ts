/**
 * Interactive labs for LB 5 (Imperium Romanum), LB 6 (Von der Antike zum Mittelalter)
 * and LB 7 (Gesellschaftsordnung im Kleinen: Leben in der Familie):
 * - romanRepublic: Republican institutions, Veto, collegiality, dictatorship
 * - romanExpansionMap: Natural Earth Mediterranean expansion of Rome (5 stages)
 * - romanBavariaLimes: Natural Earth Bavaria/Limes map + palisade/stone wall cross-section
 * - mediterraneanTransformation: Natural Earth map 395 / Völkerwanderung / Islam / 800
 * - imperialContinuity: Augustus vs. Karl der Große (Kontinuität & Wandel)
 * - familyLongitudinal: Athen vs. Rom vs. Deutschland heute
 */
import {
  arrow,
  badgePill,
  dot,
  f1,
  label,
  labels,
  northArrow,
  panel,
  svg,
} from "../figures/draw";
import {
  at,
  atCrop,
  type CropFrame,
  cropPaths,
  MAPS,
  MED_FULL_H,
  MED_FULL_W,
} from "../figures/maps";
import { type LabDef, num, remember, seen, str } from "./core";

/* ---------- 10. Verfassung der Römischen Republik (LB 5) ---------- */

export const romanRepublic: LabDef = {
  title: "Machtbalance in der Römischen Republik",
  prompt:
    "Untersuche das Zusammenspiel von Konsuln, Senat, Volksversammlung, Volkstribunen und dem Notfall-Amt des Diktators.",
  init: () => ({ organ: "konsuln", mode: "alltag" }),
  controls: () => [
    {
      type: "choice",
      key: "organ",
      label: "Verfassungsorgan",
      options: [
        { value: "konsuln", label: "2 Konsuln" },
        { value: "senat", label: "Senat" },
        { value: "tribun", label: "Volkstribune" },
        { value: "volk", label: "Volksversammlung" },
        { value: "diktator", label: "Diktator (Notstand)" },
      ],
    },
    {
      type: "choice",
      key: "mode",
      label: "Politische Lage",
      options: [
        { value: "alltag", label: "Normalfall (Annuität & Kollegialität)" },
        { value: "veto", label: "Veto-Einspruch (Ständekampf)" },
        { value: "notstand", label: "Existenzielle Krise (6 Monate)" },
      ],
    },
  ],
  goals: (s) => [
    {
      text: "Das mächtige Einspruchsrecht (Veto) der Volkstribune testen",
      met: str(s, "organ") === "tribun" && str(s, "mode") === "veto",
    },
    {
      text: "Die dauerhafte Schlüsselrolle des Senats erkennen",
      met: str(s, "organ") === "senat",
    },
    {
      text: "Das befristete Ausnahmeamt des Diktators (höchstens 6 Monate) prüfen",
      met: str(s, "organ") === "diktator" && str(s, "mode") === "notstand",
    },
  ],
  draw: (s) => {
    const organ = str(s, "organ");
    const mode = str(s, "mode");
    const cards = [
      { id: "konsuln", x: 30, y: 42, w: 170, title: "2 Konsuln", sub: "1 Jahr · Heer & Vorsitz" },
      { id: "senat", x: 225, y: 42, w: 170, title: "Senat (~300)", sub: "auf Lebenszeit · Finanzen" },
      { id: "tribun", x: 420, y: 42, w: 170, title: "Volkstribune", sub: "schützen Plebejer · Veto" },
      { id: "volk", x: 30, y: 122, w: 260, title: "Volksversammlungen", sub: "wählen Beamte & beschließen Gesetze" },
      { id: "diktator", x: 318, y: 122, w: 272, title: "Diktator (nur im Notstand)", sub: "max. 6 Monate · kein Veto möglich" },
    ];

    return svg(
      620,
      250,
      `Verfassungsmodell der Römischen Republik mit Fokus auf ${organ} im Modus ${mode}`,
      `${panel(8, 8, 604, 234, "panel-bg")}
       ${label(310, 28, "Kontrolle statt Alleinherrschaft: Verfassung der Römischen Republik", "lbl small strong")}
       ${cards
         .map((c) => {
           const active = c.id === organ;
           const alert = mode === "veto" && c.id === "tribun";
           const emerg = mode === "notstand" && c.id === "diktator";
           const fill = alert
             ? "#9e2a2b"
             : emerg
               ? "#73357a"
               : active
                 ? "var(--accent)"
                 : "var(--surface)";
           const on = alert || emerg || active;
           return `<rect x="${c.x}" y="${c.y}" width="${c.w}" height="52" rx="10" fill="${fill}" stroke="${on ? "var(--f-ink)" : "var(--f-line)"}" stroke-width="${on ? 2.2 : 1.3}"/>
             ${label(c.x + c.w / 2, c.y + 22, c.title, `lbl tiny ${on ? "on-dark" : ""} strong`)}
             ${label(c.x + c.w / 2, c.y + 40, c.sub, `lbl tiny ${on ? "on-dark" : "muted"}`)}`;
         })
         .join("")}
       ${arrow(202, 68, 223, 68)}
       ${arrow(418, 68, 397, 68)}
       <rect x="30" y="186" width="560" height="44" rx="8" fill="var(--accent-soft)" stroke="var(--accent)"/>
       ${label(
         44,
         212,
         mode === "veto"
           ? "Veto („Ich verbiete!“): Volkstribune können Gesetze und Beschlüsse zum Schutz der Bürger sofort stoppen."
           : mode === "notstand"
             ? "Notstand: Ein Diktator erhält für höchstens 6 Monate ungeteilte Gewalt – Caesar dehnt sie später lebenslang aus!"
             : "Normalfall: Patrizier-Adel (Senat) dominiert oft, doch Bürger wählen Beamte immer nur auf 1 Jahr (Annuität).",
         "lbl tiny strong",
         "start",
       )}`,
    );
  },
  readout: (s) => {
    const o = str(s, "organ");
    if (o === "konsuln") return "Zwei gleichberechtigte Konsuln regierten jeweils 1 Jahr (Annuität) und konnten sich gegenseitig blockieren (Kollegialität).";
    if (o === "senat") return "Der Senat bestand aus rund 300 ehemaligen hohen Amtsträgern auf Lebenszeit und lenkte Außenpolitik sowie Staatskasse.";
    if (o === "tribun") return "Nach den Ständekämpfen schützten unantastbare Volkstribune die Plebejer mit ihrem Veto gegen Senat und Konsuln.";
    if (o === "volk") return "Die Volksversammlungen wählten die Beamten und stimmten über Gesetze und Krieg ab – reiche Bürger hatten mehr Stimmgewicht.";
    return "In höchster Gefahr ernannte Rom einen Diktator für maximal 6 Monate. Als Caesar dies 44 v. Chr. lebenslang beanspruchte, zerbrach die Republik.";
  },
};

/* ---------- 11. Ausdehnung des Imperium Romanum (LB 5) ---------- */

const EXPANSION_STAGES = [
  {
    step: 1,
    year: "um 500 v. Chr.",
    title: "Stadtstaat Rom in Latium",
    desc: "Kleiner Stadtstaat am Tiber in Mittelitalien.",
    poly: [
      [11.8, 42.6], [13.2, 42.6], [13.5, 41.3], [11.9, 41.5],
    ],
  },
  {
    step: 2,
    year: "um 270 v. Chr.",
    title: "Herrschaft über Italien",
    desc: "Rom eint ganz Mittel- und Süditalien (bis zur Poebene).",
    poly: [
      [8.2, 44.4], [12.5, 44.2], [14.0, 42.0], [18.4, 40.1], [15.6, 37.9], [14.2, 40.7], [10.4, 43.7],
    ],
  },
  {
    step: 3,
    year: "146 v. Chr.",
    title: "Sieg über Karthago & Griechenland",
    desc: "Nach den Punischen Kriegen beherrscht Rom große Teile Spaniens, Nordafrikas (Karthago) und Griechenlands.",
    poly: [
      [-6.0, 41.0], [3.5, 43.5], [12.5, 44.8], [24.0, 41.2], [29.0, 38.0], [22.4, 36.4], [10.3, 33.5], [7.5, 36.8], [15.5, 37.5], [-6.0, 36.0],
    ],
  },
  {
    step: 4,
    year: "44 v. Chr.",
    title: "Caesars Eroberungen (Gallien & Osten)",
    desc: "Gallien bis zum Rhein, Kleinasien, Syrien und große Teile des Mittelmeers gehören zu Rom.",
    poly: [
      [-8.5, 43.4], [-4.5, 48.5], [3.0, 51.2], [8.2, 48.0], [14.0, 46.5], [27.0, 42.5], [38.0, 38.0], [36.5, 32.0], [28.0, 36.5], [11.0, 33.0], [-6.0, 36.0],
    ],
  },
  {
    step: 5,
    year: "117 n. Chr.",
    title: "Größte Ausdehnung (Kaiserzeit)",
    desc: "Von Britannien und dem Limes an Rhein & Donau bis Ägypten, Syrien und Mesopotamien (Mare Nostrum).",
    poly: [],
  },
];

export const romanExpansionMap: LabDef = {
  title: "Geschichtskarte: Ausdehnung des Imperium Romanum",
  prompt:
    "Schiebe den Regler von der Stadt Rom (um 500 v. Chr.) bis zur Kaiserzeit (117 n. Chr.) und prüfe die Folgen für das Mittelmeer („Mare Nostrum“).",
  init: () => ({ stage: 1, kriterien: false }),
  controls: () => [
    {
      type: "range",
      key: "stage",
      label: "Etappe der Ausdehnung",
      min: 1,
      max: 5,
      step: 1,
      format: (v) => `${EXPANSION_STAGES[v - 1].year}`,
    },
    {
      type: "toggle",
      key: "kriterien",
      label: "Kriterienkatalog & Mare-Nostrum-Fokus anzeigen",
    },
  ],
  goals: (s) => [
    {
      text: "Den Sprung über das Mittelmeer bis 146 v. Chr. (Karthago & Griechenland) ansehen",
      met: num(s, "stage") >= 3,
    },
    {
      text: "Die größte Ausdehnung in der Kaiserzeit (117 n. Chr.) auf der Karte prüfen",
      met: num(s, "stage") >= 5,
    },
    {
      text: "Die Geschichtskarte mithilfe des Kriterienkatalogs auswerten",
      met: s.kriterien === true && num(s, "stage") >= 2,
    },
  ],
  draw: (s) => {
    const m = MAPS.rome;
    const stage = num(s, "stage");
    const st = EXPANSION_STAGES[stage - 1];
    const krit = s.kriterien === true;
    const [rx, ry] = at(m, 12.5, 41.9);
    const [kx, ky] = at(m, 10.3, 36.8);
    const [ax, ay] = at(m, 23.7, 38.0);
    const [lux, luy] = at(m, -1.8, 51.5);
    const [alx, aly] = at(m, 29.9, 31.2);

    const empireLayer =
      stage === 5
        ? `<g class="empire">${m.layers.empire.map((sh) => `<path d="${sh.d}"/>`).join("")}</g>`
        : `<polygon class="zone-rome" points="${st.poly.map(([lo, la]) => at(m, lo, la).map(f1).join(",")).join(" ")}"/>`;

    return svg(
      MED_FULL_W,
      MED_FULL_H,
      `Natural-Earth-Geschichtskarte des Imperium Romanum in Etappe ${stage} (${st.year})`,
      `<rect class="sea" width="${MED_FULL_W}" height="${MED_FULL_H}"/>
       <g class="outside">${m.layers.countries.map((c) => `<path d="${c.d}"/>`).join("")}</g>
       ${empireLayer}
       ${dot(rx, ry, "capital", 6)}
       ${label(rx + 9, ry - 4, "Rom", "lbl small strong", "start")}
       ${stage >= 3 ? `${dot(kx, ky, "city")}${label(kx - 8, ky + 14, "Karthago", "lbl tiny strong", "end")}${dot(ax, ay, "city")}${label(ax + 8, ay + 4, "Athen", "lbl tiny strong", "start")}` : ""}
       ${stage === 5 ? `${dot(lux, luy, "city")}${label(lux - 8, luy - 6, "Britannien", "lbl tiny", "end")}${dot(alx, aly, "city")}${label(alx - 8, aly + 12, "Alexandria", "lbl tiny", "end")}` : ""}
       ${northArrow(MED_FULL_W - 28, 30)}
       ${panel(16, 444, 412, 136, "panel-bg")}
       ${label(30, 468, `${st.year} · ${st.title}`, "lbl small strong", "start")}
       ${labels(
         30,
         492,
         krit
           ? `Kriterienkatalog:\n1. Thema/Raum: Mittelmeerraum um ${st.year}.\n2. Zeichen: farbige Fläche = römisches Reich (vereinfacht).\n3. Folgerung: Vom Binnenmeer („Mare Nostrum“) laufen\n   Handel, Legionen und Straßen sternförmig auf Rom zu.`
           : `${st.desc}\nDurch gute Straßen und sichere Seewege wuchs der Handel.\nZugleich überforderte das Riesenreich die alte Stadtverfassung.\n(Heutige Grenzen im Hintergrund dienen zur Orientierung.)`,
         "lbl tiny",
         "start",
         16,
       )}`,
    );
  },
  readout: (s) => {
    const st = EXPANSION_STAGES[num(s, "stage") - 1];
    return `${st.year} – ${st.title}: ${st.desc}`;
  },
};

/* ---------- 12. Römer in Bayern & Obergermanisch-Raetischer Limes (LB 5) ---------- */

const BAVARIA_SITES: Record<
  string,
  { latin: string; modern: string; lon: number; lat: number; role: string }
> = {
  regensburg: {
    latin: "Castra Regina",
    modern: "Regensburg",
    lon: 12.1,
    lat: 49.02,
    role: "179 n. Chr. unter Marc Aurel als großes Legionslager an der Donau-Mündung des Regen gebaut; Tor (Porta Praetoria) steht bis heute.",
  },
  augsburg: {
    latin: "Augusta Vindelicum",
    modern: "Augsburg",
    lon: 10.9,
    lat: 48.37,
    role: "Prachtvolle Provinzhauptstadt von Raetien, Endpunkt der Alpenstraße Via Claudia Augusta.",
  },
  weissenburg: {
    latin: "Biriciana",
    modern: "Weißenburg",
    lon: 10.97,
    lat: 49.03,
    role: "Wichtiges Reiterkastell und römische Thermen kurz hinter der raetischen Limes-Mauer.",
  },
  kempten: {
    latin: "Cambodunum",
    modern: "Kempten",
    lon: 10.32,
    lat: 47.73,
    role: "Frühe Römerstadt im Allgäu mit ausgegrabenen Tempelbezirk, Forum und Thermen.",
  },
  passau: {
    latin: "Batavis / Boiodurum",
    modern: "Passau",
    lon: 13.45,
    lat: 48.57,
    role: "Kastelle am Zusammenfluss von Donau und Inn an der Grenze zwischen Raetien und Noricum.",
  },
};

export const romanBavariaLimes: LabDef = {
  title: "Römer in Bayern & der Limes",
  prompt:
    "Wechsle zwischen der Natural-Earth-Karte Bayerns (Provinzen Raetien & Noricum) und dem Limes-Querschnitt: Welche Orte zeigen Spuren Roms bis heute?",
  init: () => ({ view: "karte", site: "augsburg", wallType: "stein", visitedSites: "" }),
  controls: () => [
    {
      type: "choice",
      key: "view",
      label: "Ansicht",
      options: [
        { value: "karte", label: "Karte Raetien, Noricum & Limes" },
        { value: "querschnitt", label: "Limes-Querschnitt (Aufbau)" },
      ],
    },
    {
      type: "choice",
      key: "site",
      label: "Römischer Ort in Bayern",
      options: [
        { value: "regensburg", label: "Castra Regina (Regensburg)" },
        { value: "augsburg", label: "Augusta Vindelicum (Augsburg)" },
        { value: "weissenburg", label: "Biriciana (Weißenburg)" },
        { value: "kempten", label: "Cambodunum (Kempten)" },
        { value: "passau", label: "Batavis (Passau)" },
      ],
    },
    {
      type: "choice",
      key: "wallType",
      label: "Ausbaustufe des Limes",
      options: [
        { value: "palisade", label: "Frühe Holzpalisade & Holzturm" },
        { value: "stein", label: "Spätere Steinmauer (Raetien)" },
      ],
    },
  ],
  set: (s, key, value) => {
    s[key] = value;
    remember(s, "visitedSites", str(s, "site"));
  },
  goals: (s) => [
    {
      text: "Mindestens drei römische Fundorte in Bayern auf der Karte erkunden",
      met: str(s, "visitedSites").split(",").filter(Boolean).length >= 3,
    },
    {
      text: "Den Limes-Querschnitt ansehen und Holzpalisade mit Steinmauer vergleichen",
      met: str(s, "view") === "querschnitt" && str(s, "wallType") === "palisade",
    },
    {
      text: "Die Funktion von Castra Regina (Regensburg) an der Donaugrenze prüfen",
      met: str(s, "site") === "regensburg" && str(s, "view") === "karte",
    },
  ],
  draw: (s) => {
    const view = str(s, "view");
    const siteKey = str(s, "site");
    const site = BAVARIA_SITES[siteKey];
    const isStone = str(s, "wallType") === "stein";

    if (view === "querschnitt") {
      return svg(
        620,
        260,
        `Querschnitt durch den Limes in der Ausbaustufe ${isStone ? "Steinmauer" : "Holzpalisade"}`,
        `${panel(8, 8, 604, 244, "panel-bg")}
         <rect x="20" y="20" width="580" height="150" rx="10" class="sky"/>
         <rect x="20" y="168" width="580" height="72" class="ground-line"/>
         ${label(100, 44, "Römisches Gebiet (Raetien)", "lbl small strong")}
         ${label(510, 44, "Unbesetztes Germanien", "lbl small muted")}
         <!-- Wachturm -->
         <rect x="148" y="72" width="56" height="96" class="tower"/>
         <polygon points="140,72 176,42 212,72" class="tower-top"/>
         <rect x="168" y="88" width="16" height="20" class="tower-window"/>
         ${labels(176, 184, "Wachturm\n(Sichtkontakt)", "lbl tiny strong", "middle", 12)}
         <!-- Wall/Mauer -->
         ${isStone
           ? `<rect x="330" y="110" width="24" height="58" class="tower"/>${labels(342, 84, "Raetische Steinmauer\n(ca. 3 m hoch)", "lbl tiny strong", "middle", 13)}`
           : `<polygon points="326,168 334,104 342,168" class="palisade"/><polygon points="338,168 346,104 354,168" class="palisade"/><path d="M368 168 L398 188 L428 168 Z" class="ditch"/>${label(350, 96, "Holzpalisade + Graben", "lbl tiny strong")}`}
         ${panel(24, 198, 572, 38, "panel-bg")}
         ${label(310, 222, "Wichtig: Der Limes (ca. 550 km) war keine unangreifbare Mauer, sondern Kontrolllinie für Handel, Zoll und Warnung!", "lbl tiny strong")}`,
      );
    }

    const m = MAPS.limes;
    const frame: CropFrame = {
      map: m,
      x0: 66,
      y0: 36,
      scale: 1.25,
      width: 620,
      height: 360,
    };
    const [sx, sy] = atCrop(frame, site.lon, site.lat);
    const [ax, ay] = atCrop(frame, 10.9, 48.37);
    const [rx, ry] = atCrop(frame, 12.1, 49.02);
    const [kx, ky] = atCrop(frame, 10.32, 47.73);
    const [px, py] = atCrop(frame, 13.45, 48.57);
    const [wx, wy] = atCrop(frame, 10.97, 49.03);

    return svg(
      frame.width,
      frame.height,
      `Natural-Earth-Karte der römischen Provinzen in Bayern und des Limes mit Fokus auf ${site.modern}`,
      `<rect class="sea" width="${frame.width}" height="${frame.height}"/>
       ${cropPaths(frame, m.layers.countries, () => "land neighbour")}
       ${cropPaths(frame, m.layers.states, (st) => (st.id === "Bayern" ? "state state-home" : "state"))}
       ${cropPaths(frame, m.layers.lakes, () => "lake")}
       ${cropPaths(frame, m.layers.rivers, () => "river")}
       <g transform="scale(${f1(frame.scale)}) translate(${f1(-frame.x0)},${f1(-frame.y0)})">
         ${(m.layers.limes ?? []).map((l) => `<path class="limes-line" d="${l.d}" style="stroke-width:3"/>`).join("")}
       </g>
       <!-- Via Claudia Augusta (stylized Kempten-Augsburg-Donau) -->
       <line x1="${f1(kx)}" y1="${f1(ky)}" x2="${f1(ax)}" y2="${f1(ay)}" class="route-alt"/>
       ${dot(ax, ay, "capital")}
       ${dot(rx, ry, "capital")}
       ${dot(wx, wy, "city")}
       ${dot(kx, ky, "city")}
       ${dot(px, py, "city")}
       <circle cx="${f1(sx)}" cy="${f1(sy)}" r="12" fill="none" stroke="var(--f-red)" stroke-width="2.8"/>
       ${label(ax - 8, ay + 4, "Augusta Vindelicum", "lbl tiny strong", "end")}
       ${label(rx + 8, ry - 6, "Castra Regina", "lbl tiny strong", "start")}
       ${label(wx, wy - 10, "Biriciana", "lbl tiny", "middle")}
       ${label(kx - 8, ky + 6, "Cambodunum", "lbl tiny", "end")}
       ${label(px + 8, py + 4, "Batavis", "lbl tiny", "start")}
       ${label(430, 290, "RAETIEN", "lbl small strong")}
       ${label(540, 275, "NORICUM", "lbl tiny strong")}
       ${label(358, 92, "Unbesetztes Germanien", "lbl small muted")}
       ${northArrow(frame.width - 26, 26)}
       ${panel(12, 12, 232, 128, "panel-bg")}
       ${label(24, 34, `${site.latin} (${site.modern})`, "lbl small strong", "start")}
       ${labels(24, 56, isStone ? "Limes: Steinmauer in Raetien\n• Rote Linie: vereinfachter Limes\n• Gelb: Bayern zur Orientierung\n• Gestrichelt: Via Claudia Augusta" : "Limes: frühe Holzpalisade\n• Rote Linie: vereinfachter Limes\n• Gelb: Bayern zur Orientierung\n• Donau: nasse Reichsgrenze", "lbl tiny", "start", 15)}`,
    );
  },
  readout: (s) => {
    const site = BAVARIA_SITES[str(s, "site")];
    return `${site.latin} (heute ${site.modern}): ${site.role}`;
  },
};

/* ---------- 13. Mittelmeerwelt im Umbruch 395–800 (LB 6) ---------- */

const TRANS_STAGES: Record<
  string,
  { title: string; year: string; detail: string }
> = {
  teilung: {
    title: "Reichsteilung 395 n. Chr.",
    year: "395 n. Chr.",
    detail: "Das Römische Reich wird endgültig in Westrom (Rom/Ravenna) und Ostrom (Konstantinopel) geteilt.",
  },
  wanderung: {
    title: "„Völkerwanderung“ (4.–6. Jh.)",
    year: "375–476 n. Chr.",
    detail: "Gemischte Kriegergruppen & Verbände ziehen ins Westreich; 476 endet das weströmische Kaisertum. Ostrom bleibt bestehen!",
  },
  islam: {
    title: "Ausbreitung des Islam (ab 632)",
    year: "7.–8. Jahrhundert",
    detail: "Nach 632 breitet sich das islamische Reich rasch über Arabien, Nordafrika und Spanien (711) aus.",
  },
  dreiteilung: {
    title: "Dreiteilung um 800",
    year: "um 800",
    detail: "Aus einer römischen Mittelmeerwelt sind drei große Kulturräume geworden: Frankenreich, Byzanz und islamische Welt.",
  },
};

export const mediterraneanTransformation: LabDef = {
  title: "Geschichtskarte: Umbruch der Mittelmeerwelt (395–800)",
  prompt:
    "Schalte zwischen den vier Phasen vom geteilten Römischen Reich (395) bis zur Dreiteilung der Mittelmeerwelt um 800 und prüfe Parallelen zu heutigen Wanderungsbewegungen.",
  init: () => ({ phase: "teilung", compareMigration: false, seenPhases: "" }),
  controls: () => [
    {
      type: "choice",
      key: "phase",
      label: "Historische Phase",
      options: [
        { value: "teilung", label: "395 · Reichsteilung" },
        { value: "wanderung", label: "375–476 · „Völkerwanderung“" },
        { value: "islam", label: "ab 632 · Ausbreitung des Islam" },
        { value: "dreiteilung", label: "um 800 · Dreiteilung" },
      ],
    },
    {
      type: "toggle",
      key: "compareMigration",
      label: "Vergleich mit Migration der Gegenwart einblenden",
    },
  ],
  set: (s, key, value) => {
    s[key] = value;
    remember(s, "seenPhases", str(s, "phase"));
  },
  goals: (s) => [
    {
      text: "Alle vier historischen Kartenphasen (395, „Völkerwanderung“, Islam, um 800) erkunden",
      met: ["teilung", "wanderung", "islam", "dreiteilung"].every((k) =>
        seen(s, "seenPhases", k),
      ),
    },
    {
      text: "Die Dreiteilung der Mittelmeerwelt um 800 auf der Karte ablesen",
      met: str(s, "phase") === "dreiteilung",
    },
    {
      text: "Die Wanderungen der Spätantike mit modernen Migrationsbewegungen vergleichen",
      met: s.compareMigration === true,
    },
  ],
  draw: (s) => {
    const m = MAPS.rome;
    const phase = str(s, "phase");
    const info = TRANS_STAGES[phase];
    const cmp = s.compareMigration === true;

    const poly = (coords: Array<[number, number]>, cls: string) =>
      `<polygon class="${cls}" points="${coords.map(([lo, la]) => at(m, lo, la).map(f1).join(",")).join(" ")}"/>`;

    const westPoly = poly([[-9, 53], [3, 52], [18, 48], [18, 36], [10, 32], [-8, 36]], "zone-rome");
    const eastPoly = poly([[18, 45], [32, 42], [41, 36], [35, 29], [25, 31], [18, 36]], "zone-byz");
    const franksPoly = poly([[-4, 49], [10, 54], [15, 48], [13, 42], [3, 43], [-2, 43]], "zone-franks");
    const byzSmall = poly([[20, 42], [38, 41], [36, 36], [23, 36]], "zone-byz");
    const islamPoly = poly([[-9, 41], [3, 40], [12, 37], [36, 36], [48, 33], [48, 22], [12, 22], [-9, 28]], "zone-islam");

    const routes =
      phase === "wanderung"
        ? `<path class="route-main" d="M${at(m, 26, 48).map(f1).join(" ")} Q${at(m, 16, 44).map(f1).join(" ")} ${at(m, 12.5, 41.9).map(f1).join(" ")}"/>
           <path class="route-alt" d="M${at(m, 12, 50).map(f1).join(" ")} Q${at(m, 2, 44).map(f1).join(" ")} ${at(m, -4, 37).map(f1).join(" ")}"/>
           <path class="route-sea" d="M${at(m, -4, 36).map(f1).join(" ")} Q${at(m, 4, 36).map(f1).join(" ")} ${at(m, 10.3, 36.8).map(f1).join(" ")}"/>`
        : "";

    const islamRoutes =
      phase === "islam" || phase === "dreiteilung"
        ? `<path class="route-main" d="M${at(m, 39, 24).map(f1).join(" ")} Q${at(m, 36, 32).map(f1).join(" ")} ${at(m, 30, 30).map(f1).join(" ")}"/>
           <path class="route-main" d="M${at(m, 30, 30).map(f1).join(" ")} Q${at(m, 12, 34).map(f1).join(" ")} ${at(m, -5, 37.5).map(f1).join(" ")}"/>`
        : "";

    return svg(
      MED_FULL_W,
      MED_FULL_H,
      `Natural-Earth-Geschichtskarte der Mittelmeerwelt in der Phase ${info.title}`,
      `<rect class="sea" width="${MED_FULL_W}" height="${MED_FULL_H}"/>
       <g class="outside">${m.layers.countries.map((c) => `<path d="${c.d}"/>`).join("")}</g>
       ${phase === "teilung" ? `${westPoly}${eastPoly}` : ""}
       ${phase === "wanderung" ? `${eastPoly}${routes}` : ""}
       ${phase === "islam" ? `${byzSmall}${islamPoly}${islamRoutes}` : ""}
       ${phase === "dreiteilung" ? `${franksPoly}${byzSmall}${islamPoly}${islamRoutes}` : ""}
       ${phase === "teilung" ? `${label(230, 220, "Weströmisches Reich", "lbl small strong")}${label(510, 340, "Oströmisches Reich", "lbl small strong")}` : ""}
       ${phase === "dreiteilung" ? `${label(220, 170, "Frankenreich", "lbl small strong")}${label(500, 290, "Byzanz", "lbl small strong")}${label(330, 440, "Islamische Reiche", "lbl small strong")}` : ""}
       ${northArrow(MED_FULL_W - 28, 30)}
       ${panel(16, 444, 464, 136, "panel-bg")}
       ${label(30, 468, `${info.year} · ${info.title}`, "lbl small strong", "start")}
       ${labels(
         30,
         492,
         cmp
           ? "Vergleich „Völkerwanderung“ vs. Migration heute:\n• Gemeinsam: Suche nach Schutz, Land & Einkommen bei Krisen.\n• Unterschied: Spätantike Kriegerverbände brachten eigene\n  Reiche und Gesetze mit; heute wandern Menschen meist\n  individuell oder als Familien in bestehende Staaten ein."
           : `${info.detail}\nFlächen zeigen vereinfachte Einflussräume (ohne feste Grenzpfähle).\n(Heutige Grenzen im Hintergrund dienen nur zur Orientierung.)`,
         "lbl tiny",
         "start",
         16,
       )}`,
    );
  },
  readout: (s) => {
    const info = TRANS_STAGES[str(s, "phase")];
    return `${info.year} (${info.title}): ${info.detail}`;
  },
};

/* ---------- 14. Antikes und mittelalterliches Kaisertum: Kontinuität & Wandel (LB 6) ---------- */

const IMPERIAL_CATS: Record<
  string,
  { title: string; augustus: string; karl: string; tag: string; detail: string }
> = {
  residenz: {
    title: "Regierungsort",
    augustus: "Feste Hauptstadt Rom mit\nPalästen, Senat und Ämtern",
    karl: "Reisekönigtum zwischen\nPfalzen (Lieblingspfalz: Aachen)",
    tag: "Wandel",
    detail: "Ohne römisches Steuer- und Beamtennetz musste Karl der Große mit seinem Hof von Pfalz zu Pfalz reisen.",
  },
  religion: {
    title: "Rolle von Religion & Kirche",
    augustus: "Traditionelle römische Götter;\nAugustus wird oberster Priester",
    karl: "Christliches Kaisertum: Schutz\nder Kirche, Krönung durch Papst (800)",
    tag: "Wandel (spätantike Basis)",
    detail: "Seit dem 4. Jh. war das Christentum Staatsreligion – Karl baute sein Kaisertum eng auf Bündnis mit dem Papst auf.",
  },
  schrift: {
    title: "Sprache, Bildung & Recht",
    augustus: "Latein als Reichssprache,\ngeschriebene Gesetze & Archive",
    karl: "Latein & neue klare Schrift\n(Karolingische Minuskel), Klosterschulen",
    tag: "Kontinuität",
    detail: "Auch wenn das Latein nicht mehr Muttersprache aller war, blieb es die gemeinsame Sprache von Kirche, Recht und Bildung.",
  },
  legitimation: {
    title: "Kaisertitel & Anspruch",
    augustus: "Imperator Caesar Augustus\n(„Erster Bürger“, Prinzipat)",
    karl: "Erneuerung des römischen\nKaisertitels am 25. Dezember 800",
    tag: "Kontinuität & Wandel",
    detail: "Karl knüpfte bewusst an das Vorbild der römischen Kaiser an – verband es aber mit fränkischem Königtum und Christentum.",
  },
};

export const imperialContinuity: LabDef = {
  title: "Kontinuität & Wandel: Augustus vs. Karl der Große",
  prompt:
    "Vergleiche das antike Kaisertum unter Augustus mit dem mittelalterlichen Kaisertum Karls des Großen (800) nach Kategorien.",
  init: () => ({ category: "religion", seenCats: "" }),
  controls: () => [
    {
      type: "choice",
      key: "category",
      label: "Vergleichskategorie",
      options: [
        { value: "residenz", label: "Regierungsort" },
        { value: "religion", label: "Religion & Kirche" },
        { value: "schrift", label: "Sprache & Schrift" },
        { value: "legitimation", label: "Kaisertitel & Anspruch" },
      ],
    },
  ],
  set: (s, key, value) => {
    s[key] = value;
    remember(s, "seenCats", str(s, "category"));
  },
  goals: (s) => [
    {
      text: "Wandel am Beispiel Hauptstadt Rom vs. Reisekönigtum (Pfalz Aachen) erkennen",
      met: str(s, "category") === "residenz",
    },
    {
      text: "Kontinuität bei Latein, Schrift und Kaisertitel entdecken",
      met: str(s, "category") === "schrift" || str(s, "category") === "legitimation",
    },
    {
      text: "Alle vier Kategorien zwischen antikem und mittelalterlichem Kaisertum vergleichen",
      met: ["residenz", "religion", "schrift", "legitimation"].every((c) =>
        seen(s, "seenCats", c),
      ),
    },
  ],
  draw: (s) => {
    const c = IMPERIAL_CATS[str(s, "category")];
    return svg(
      620,
      230,
      `Kategorienvergleich ${c.title} zwischen Augustus und Karl dem Großen: ${c.tag}`,
      `${panel(8, 8, 604, 214, "panel-bg")}
       ${label(24, 34, `Kategorie: ${c.title}`, "lbl strong", "start")}
       ${badgePill(508, 30, 176, c.tag, c.tag === "Kontinuität" ? "#1e6b4f" : c.tag === "Wandel" ? "#9e2a2b" : "#1b5e8a")}
       ${panel(24, 54, 272, 118, "panel-bg")}
       <rect x="24" y="54" width="272" height="28" rx="8" fill="#9e2a2b"/>
       ${label(160, 73, "Augustus (um Chr. Geburt)", "lbl tiny on-dark strong")}
       ${labels(160, 108, c.augustus, "lbl small", "middle", 18)}
       ${panel(324, 54, 272, 118, "panel-bg")}
       <rect x="324" y="54" width="272" height="28" rx="8" fill="#1e6b4f"/>
       ${label(460, 73, "Karl der Große (800)", "lbl tiny on-dark strong")}
       ${labels(460, 108, c.karl, "lbl small", "middle", 18)}
       ${label(310, 200, "Neuanfänge im Mittelalter tragen immer auch Elemente römischer Kontinuität weiter.", "lbl tiny strong")}`,
    );
  },
  readout: (s) => {
    const c = IMPERIAL_CATS[str(s, "category")];
    return `${c.title} (${c.tag}): ${c.detail}`;
  },
};

/* ---------- 15. Leben in der Familie im Längsschnitt (LB 7) ---------- */

const FAMILY_DIMS: Record<
  string,
  {
    title: string;
    athen: string;
    rom: string;
    heute: string;
    link: string;
  }
> = {
  struktur: {
    title: "Wer gehört zur Familie?",
    athen: "Oikos: Eltern, Kinder\nund unfreie Haussklaven",
    rom: "Familia: Pater familias,\nFrau, Kinder & Sklaven",
    heute: "Vielfältig: Eltern/Kind,\nPatchwork, Alleinerz.",
    link: "In der Antike war der Haushalt zugleich ein kleiner Wirtschaftsbetrieb mit Sklaven.",
  },
  rollen: {
    title: "Rollen von Frau und Mann",
    athen: "Mann: Polis & Agora;\nFrau: im Haus (Gynaikonitis)",
    rom: "Pater familias als Herr;\nFrau mit mehr Ausgang",
    heute: "Rechtliche Gleichheit;\nPartner teilen Aufgaben",
    link: "Die Stufenordnung der antiken Gesellschaft setzte sich bis ins Wohnzimmer fort.",
  },
  kinder: {
    title: "Kindheit & Bildung",
    athen: "Jungen: Schule & Sport;\nMädchen: Weben im Haus",
    rom: "Gehorsam gegen Vater;\nSchule meist für Reiche",
    heute: "Schulpflicht für alle;\neigene Kinderrechte",
    link: "Heute gelten gleiche Bildungsrechte für Mädchen und Jungen unabhängig vom Stand.",
  },
};

export const familyLongitudinal: LabDef = {
  title: "Längsschnitt: Familie in Athen, Rom und heute",
  prompt:
    "Vergleiche das Familienleben in Athen (5. Jh. v. Chr.), in Rom (um Christi Geburt) und in der Gegenwart – und verknüpfe es mit der Gesellschaftsordnung.",
  init: () => ({ dim: "struktur", showSociety: false, seenDims: "" }),
  controls: () => [
    {
      type: "choice",
      key: "dim",
      label: "Lebensbereich",
      options: [
        { value: "struktur", label: "Aufbau des Haushalts" },
        { value: "rollen", label: "Rollenbilder Frau / Mann" },
        { value: "kinder", label: "Kindheit & Bildung" },
      ],
    },
    {
      type: "toggle",
      key: "showSociety",
      label: "Verbindung zur allgemeinen Gesellschaftsordnung zeigen",
    },
  ],
  set: (s, key, value) => {
    s[key] = value;
    remember(s, "seenDims", str(s, "dim"));
  },
  goals: (s) => [
    {
      text: "Rollenbilder von Mann und Frau in Athen, Rom und heute vergleichen",
      met: str(s, "dim") === "rollen",
    },
    {
      text: "Alle drei Lebensbereiche (Aufbau, Rollenbilder, Kindheit) durchschauen",
      met: ["struktur", "rollen", "kinder"].every((d) => seen(s, "seenDims", d)),
    },
    {
      text: "Den Zusammenhang zwischen Staat/Gesellschaft und Familie einblenden",
      met: s.showSociety === true,
    },
  ],
  draw: (s) => {
    const dim = FAMILY_DIMS[str(s, "dim")];
    const soc = s.showSociety === true;
    const cols = [
      { x: 22, head: "Athen (5. Jh. v. Chr.)", body: dim.athen, soc: "Nur Männer sind Vollbürger;\nSklaverei stützt die Polis", c: "#1b5e8a" },
      { x: 216, head: "Rom (um Chr. Geb.)", body: dim.rom, soc: "Hierarchie: Adel, Plebejer,\nFreigelassene, Sklaven", c: "#9e2a2b" },
      { x: 410, head: "Deutschland heute", body: dim.heute, soc: "Grundrechte & Gleichheit\nfür alle Menschen im Staat", c: "#1e6b4f" },
    ];

    return svg(
      620,
      245,
      `Längsschnitt Familie (${dim.title}) in Athen, Rom und der Gegenwart`,
      `${panel(8, 8, 604, 229, "panel-bg")}
       ${label(310, 32, dim.title, "lbl small strong")}
       ${cols
         .map(
           (c) => `${panel(c.x, 46, 186, soc ? 174 : 118, "panel-bg")}
             <rect x="${c.x}" y="46" width="186" height="28" rx="8" fill="${c.c}"/>
             ${label(c.x + 93, 64, c.head, "lbl tiny on-dark strong")}
             ${labels(c.x + 93, 94, c.body, "lbl tiny strong", "middle", 16)}
             ${soc ? `<line x1="${c.x + 14}" y1="142" x2="${c.x + 172}" y2="142" stroke="var(--line)" stroke-dasharray="3 3"/>${labels(c.x + 93, 162, c.soc, "lbl tiny muted", "middle", 15)}` : ""}`,
         )
         .join("")}
       ${!soc ? label(310, 198, "Schalte die Verbindung zur Gesellschaft ein, um die Hintergründe der Rollen zu sehen.", "lbl tiny muted") : ""}`,
    );
  },
  readout: (s) => {
    const dim = FAMILY_DIMS[str(s, "dim")];
    return `${dim.title}: ${dim.link}`;
  },
};
