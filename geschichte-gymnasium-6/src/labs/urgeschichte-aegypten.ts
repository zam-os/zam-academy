/**
 * Interactive labs for LB 1 (Der Mensch und seine Geschichte) and LB 2 (Ägypten):
 * - timelineExplorer: time span calculation across BC/AD without a year 0 and scale zoom
 * - excavationStratigraphy: archaeological layers (younger above older, preservation conditions)
 * - nileCycle: Nile flood level, three seasons, and Shaduf/canal irrigation
 * - pyramidCutaway: Djoser step pyramid vs. Khufu Great Pyramid cutaway + criteria focus
 */
import {
  arrow,
  badgePill,
  f1,
  label,
  labels,
  panel,
  pyramidShape,
  svg,
} from "../figures/draw";
import {
  fmtDe,
  fmtYear,
  type LabDef,
  num,
  remember,
  seen,
  str,
  yearSpanNoZero,
} from "./core";

/* ---------- 1. Zeitleiste & Zeitrechnung (LB 1) ---------- */

export const EPOCH_POINTS: Record<string, { year: number; label: string }> = {
  jungsteinzeit: { year: -10000, label: "Jungsteinzeit (ca. 10 000 v. Chr.)" },
  aegypten: { year: -3000, label: "Hochkultur Ägypten (ab 3000 v. Chr.)" },
  rom: { year: -753, label: "Mythische Gründung Roms (753 v. Chr.)" },
  athen: { year: -450, label: "Blütezeit Athens (5. Jh. v. Chr.)" },
  augustus: { year: 1, label: "Zeitalter des Augustus (um Chr. Geb.)" },
  franken: { year: 500, label: "Reichsbildung der Franken (um 500)" },
  karl: { year: 800, label: "Kaiserkrönung Karls d. Gr. (800)" },
};

export const timelineExplorer: LabDef = {
  title: "Zeitleiste und Zeitrechnung",
  prompt:
    "Wähle einen Maßstab und zwei Ereignisse. Wie rechnet man über die Zeitenwende (v. Chr. / n. Chr.) hinweg – und warum rücken die Epochen bei starkem Zoom zusammen?",
  init: () => ({
    scale: "geschichte",
    from: "rom",
    to: "franken",
    seenScales: "",
    checkedSpan: false,
  }),
  controls: () => [
    {
      type: "choice",
      key: "scale",
      label: "Maßstab der Zeitleiste",
      options: [
        { value: "geschichte", label: "Historische Zeit (3500 v. Chr.–1000 n. Chr.)" },
        { value: "urzeit", label: "Mit Urgeschichte (12 000 v. Chr.–1000 n. Chr.)" },
      ],
    },
    {
      type: "choice",
      key: "from",
      label: "Startpunkt",
      options: [
        { value: "jungsteinzeit", label: "10 000 v. Chr." },
        { value: "aegypten", label: "3000 v. Chr." },
        { value: "rom", label: "753 v. Chr." },
        { value: "athen", label: "450 v. Chr." },
      ],
    },
    {
      type: "choice",
      key: "to",
      label: "Zielpunkt",
      options: [
        { value: "augustus", label: "1 n. Chr." },
        { value: "franken", label: "500 n. Chr." },
        { value: "karl", label: "800 n. Chr." },
      ],
    },
  ],
  set: (s, key, value) => {
    s[key] = value;
    remember(s, "seenScales", str(s, "scale"));
    if (str(s, "from") === "rom" && str(s, "to") === "karl") {
      s.checkedSpan = true;
    }
  },
  goals: (s) => [
    {
      text: "Beide Maßstäbe vergleichen (Historische Zeit vs. Urgeschichte)",
      met: seen(s, "seenScales", "geschichte") && seen(s, "seenScales", "urzeit"),
    },
    {
      text: "Die Zeitspanne von der Gründung Roms (753 v. Chr.) bis Karl d. Gr. (800) berechnen",
      met: s.checkedSpan === true,
    },
    {
      text: "Abstand von 10 000 v. Chr. bis heute/800 im Urgeschichte-Maßstab ansehen",
      met: str(s, "scale") === "urzeit" && str(s, "from") === "jungsteinzeit",
    },
  ],
  draw: (s) => {
    const scale = str(s, "scale");
    const minY = scale === "urzeit" ? -12000 : -3500;
    const maxY = 1000;
    const xOf = (y: number) => 36 + ((y - minY) / (maxY - minY)) * 548;
    const fromPt = EPOCH_POINTS[str(s, "from")];
    const toPt = EPOCH_POINTS[str(s, "to")];
    const clampX = (y: number) => Math.max(32, Math.min(586, xOf(y)));
    const x1 = clampX(fromPt.year);
    const x2 = clampX(toPt.year);
    const x0 = xOf(1);
    const span = yearSpanNoZero(fromPt.year, toPt.year);

    const marks =
      scale === "urzeit"
        ? [-10000, -3000, -753, 800]
        : [-3000, -753, 1, 500, 800];

    return svg(
      620,
      230,
      `Interaktive Zeitleiste im Maßstab ${scale} von ${fmtYear(fromPt.year)} bis ${fmtYear(toPt.year)}: ${span} Jahre Abstand`,
      `${panel(8, 8, 604, 214, "panel-bg")}
       ${label(24, 34, scale === "urzeit" ? "Maßstab: mit Jungsteinzeit (13 000 Jahre)" : "Maßstab: ab Hochkulturen (4500 Jahre)", "lbl small strong", "start")}
       ${label(596, 34, `Spanne: ${span} Jahre`, "lbl small strong", "end")}
       <rect x="36" y="102" width="${f1(Math.max(0, x0 - 36))}" height="14" rx="4" fill="#1b5e8a" opacity="0.22"/>
       <rect x="${f1(x0)}" y="102" width="${f1(584 - x0)}" height="14" rx="4" fill="#1e6b4f" opacity="0.24"/>
       <line class="axis" x1="36" y1="109" x2="584" y2="109"/>
       ${arrow(572, 109, 598, 109)}
       <line class="zero" x1="${f1(x0)}" y1="48" x2="${f1(x0)}" y2="178"/>
       ${label(x0, 194, "Zeitenwende (kein Jahr 0)", "lbl tiny strong")}
       ${marks
         .map((yr) => {
           const mx = xOf(yr);
           return `<line class="tick" x1="${f1(mx)}" y1="102" x2="${f1(mx)}" y2="116"/>
             ${label(mx, 134, yr < 0 ? `${Math.abs(yr)} v.` : `${yr}`, "lbl tiny muted")}`;
         })
         .join("")}
       <line x1="${f1(x1)}" y1="74" x2="${f1(x2)}" y2="74" stroke="var(--accent)" stroke-width="5" stroke-linecap="round"/>
       <circle cx="${f1(x1)}" cy="74" r="7" fill="#9a4b1f" stroke="var(--f-halo)" stroke-width="2"/>
       <circle cx="${f1(x2)}" cy="74" r="7" fill="#1e6b4f" stroke="var(--f-halo)" stroke-width="2"/>
       ${label(Math.max(40, x1), 58, fmtYear(fromPt.year), "lbl tiny strong", x1 < 80 ? "start" : "middle")}
       ${label(Math.min(580, x2), 58, fmtYear(toPt.year), "lbl tiny strong", x2 > 540 ? "end" : "middle")}
       ${label(310, 212, "Regel über v. Chr. → n. Chr.: Beträge addieren und 1 abziehen (da zwischen 1 v. Chr. und 1 n. Chr. kein Jahr 0 liegt).", "lbl tiny")}`,
    );
  },
  readout: (s) => {
    const fromPt = EPOCH_POINTS[str(s, "from")];
    const toPt = EPOCH_POINTS[str(s, "to")];
    const span = yearSpanNoZero(fromPt.year, toPt.year);
    const visible = !(str(s, "scale") === "geschichte" && fromPt.year < -3500);
    return `${fromPt.label} bis ${toPt.label}: ${span} Jahre (${Math.abs(fromPt.year)} + ${toPt.year} − 1 = ${span}). ${visible ? "Beide Punkte liegen sichtbar auf diesem Maßstab." : "Hinweis: 10 000 v. Chr. liegt weit links außerhalb dieses Zooms – schalte auf den Urgeschichte-Maßstab um!"}`;
  },
};

/* ---------- 2. Archäologische Ausgrabung & Stratigraphie (LB 1) ---------- */

const STRATA = [
  { depth: 1, name: "Schicht 1 · Neuzeit / Oberboden", age: "heute – ca. 1500", find: "Glasscherbe & Eisennagel", cls: "strata-0" },
  { depth: 2, name: "Schicht 2 · Frühmittelalter", age: "ca. 600–800 n. Chr.", find: "Karolingische Tonscherbe", cls: "strata-1" },
  { depth: 3, name: "Schicht 3 · Römische Kaiserzeit", age: "ca. 100–300 n. Chr.", find: "Römische Münze & Terra Sigillata", cls: "strata-2" },
  { depth: 4, name: "Schicht 4 · Jungsteinzeit", age: "ca. 4500 v. Chr.", find: "Geschliffenes Steinbeil & Verkohltes Korn", cls: "strata-3" },
  { depth: 5, name: "Schicht 5 · Späte Altsteinzeit", age: "ca. 18 000 v. Chr.", find: "Feuerstein-Klinge & Knochennadel", cls: "strata-4" },
];

export const excavationStratigraphy: LabDef = {
  title: "Ausgrabung & Bodenschichten (Stratigraphie)",
  prompt:
    "Grabe Schicht für Schicht in die Tiefe. Prüfe, wo ältere Funde liegen und was in feuchtem vs. trockenem Boden erhalten bleibt.",
  init: () => ({ depth: 1, soil: "trocken", recorded: false }),
  controls: () => [
    {
      type: "range",
      key: "depth",
      label: "Grabungstiefe",
      min: 1,
      max: 5,
      step: 1,
      format: (v) => `Schicht ${fmtDe(v)} (${fmtDe(v)} m)`,
    },
    {
      type: "choice",
      key: "soil",
      label: "Bodenfeuchtigkeit",
      options: [
        { value: "trocken", label: "Normaler trockener Boden" },
        { value: "moor", label: "Feuchtes Moor / unter Luftabschluss" },
      ],
    },
    {
      type: "toggle",
      key: "recorded",
      label: "Fundlage exakt einmessen & zeichnen",
    },
  ],
  goals: (s) => [
    {
      text: "Bis in die tiefste Schicht (Altsteinzeit, Schicht 5) graben",
      met: num(s, "depth") >= 5,
    },
    {
      text: "Vergleichen, wie organisches Material (Holz, Korn, Leder) im Moor erhalten bleibt",
      met: str(s, "soil") === "moor" && num(s, "depth") >= 4,
    },
    {
      text: "Einen Fund fachgerecht im Profil einmessen und dokumentieren",
      met: s.recorded === true && num(s, "depth") >= 2,
    },
  ],
  draw: (s) => {
    const depth = num(s, "depth");
    const soil = str(s, "soil");
    const recorded = s.recorded === true;
    const active = STRATA[depth - 1];

    return svg(
      620,
      270,
      `Archäologisches Bodenprofil bis Schicht ${depth}: ${active.name} mit Fund ${active.find}`,
      `${panel(8, 8, 604, 254, "panel-bg")}
       ${STRATA.map((st, i) => {
         const y = 26 + i * 42;
         const dug = st.depth <= depth;
         const selected = st.depth === depth;
         return `<rect x="26" y="${y}" width="310" height="40" class="${st.cls}" opacity="${dug ? 1 : 0.35}" stroke="${selected ? "var(--f-yellow)" : "var(--f-halo)"}" stroke-width="${selected ? 3 : 1}"/>
           ${label(38, y + 17, st.name, "lbl tiny on-dark strong", "start")}
           ${label(38, y + 32, dug ? `${st.age} · ${st.find}` : "(noch nicht ausgegraben)", "lbl tiny on-dark", "start")}
           ${selected ? `<circle cx="314" cy="${y + 20}" r="8" fill="var(--f-yellow)" stroke="#1d2b2a" stroke-width="1.5"/>` : ""}`;
       }).join("")}
       ${panel(354, 26, 240, 210, "panel-bg")}
       ${label(368, 50, "Grabungsbefund", "lbl small strong", "start")}
       ${labels(368, 76, `Tiefe: ${depth} m\nEpoche: ${active.age}\nFund: ${active.find}`, "lbl tiny strong", "start", 16)}
       <line x1="368" y1="132" x2="578" y2="132" stroke="var(--line)"/>
       ${labels(
         368,
         154,
         soil === "moor"
           ? "Feuchtboden (ohne Sauerstoff):\nAuch Holz, Textilien, Leder und\nPollen überdauern Jahrtausende!"
           : "Trockener Sauerstoff-Boden:\nStein, Ton, Metall & Knochen bleiben;\nHolz und Stoff verrotten meist.",
         "lbl tiny",
         "start",
         15,
       )}
       ${badgePill(474, 218, 212, recorded ? "✓ Im Plan & Foto dokumentiert" : "⚠ Ungemessen zerstört den Kontext!", recorded ? "#1e6b4f" : "#9e2a2b")}`,
    );
  },
  readout: (s) => {
    const d = num(s, "depth");
    const active = STRATA[d - 1];
    const preserve =
      str(s, "soil") === "moor"
        ? "Im sauerstoffarmen Moor bleiben sogar Holzgriffe, Leder und Samen erhalten."
        : "In trockenem Boden überdauern vor allem Stein, Keramik und Metall (Überreste).";
    const doc =
      s.recorded === true
        ? "Fundlage eingemessen: Jetzt lässt sich die relative Altersfolge sicher belegen."
        : "Tipp: Ohne Einmessen im Profil geht die Schicht-Information unwiederbringlich verloren!";
    return `Schicht ${d} (${active.age}): ${active.find}. Grundregel: Ungestörte tiefere Schichten sind älter als höhere. ${preserve} ${doc}`;
  },
};

/* ---------- 3. Nilflut & Bewässerung (LB 2) ---------- */

export const nileCycle: LabDef = {
  title: "Niljahr und Bewässerung",
  prompt:
    "Verändere Jahreszeit, Höhe der Nilflut und Bewässerungstechnik (Kanäle & Schaduf). Was passiert bei zu schwacher oder zu hoher Flut?",
  init: () => ({ season: "achet", flood: 14, canals: false }),
  controls: () => [
    {
      type: "choice",
      key: "season",
      label: "Ägyptische Jahreszeit",
      options: [
        { value: "achet", label: "1. Achet (Flut, Juli–Okt.)" },
        { value: "peret", label: "2. Peret (Aussaat, Nov.–Feb.)" },
        { value: "schemu", label: "3. Schemu (Ernte, März–Juni)" },
      ],
    },
    {
      type: "range",
      key: "flood",
      label: "Nilstand (Nilometer)",
      min: 10,
      max: 20,
      step: 2,
      format: (v) => `${fmtDe(v)} Ellen`,
    },
    {
      type: "toggle",
      key: "canals",
      label: "Kanäle, Rückhaltebecken & Schaduf nutzen",
    },
  ],
  goals: (s) => [
    {
      text: "Auswirkungen einer zu niedrigen Nilflut (10 Ellen) auf die Felder beobachten",
      met: num(s, "flood") <= 10,
    },
    {
      text: "Eine zerstörerische Hochflut (20 Ellen) erkennen",
      met: num(s, "flood") >= 20,
    },
    {
      text: "Optimale Ernte in Peret/Schemu bei rund 16 Ellen mit Kanälen und Schaduf sichern",
      met:
        num(s, "flood") === 16 &&
        s.canals === true &&
        (str(s, "season") === "peret" || str(s, "season") === "schemu"),
    },
  ],
  draw: (s) => {
    const season = str(s, "season");
    const flood = num(s, "flood");
    const canals = s.canals === true;
    const waterH = season === "achet" ? (flood - 8) * 7 : season === "peret" ? 28 : 16;
    const waterY = 175 - waterH;
    const fieldGreen =
      flood <= 10 ? "var(--f-sand)" : flood >= 20 ? "#5a82a6" : season === "achet" ? "#4e87b8" : "var(--f-grass)";

    return svg(
      620,
      250,
      `Querschnitt durch das Niltal in der Jahreszeit ${season} bei ${flood} Ellen Nilstand`,
      `${panel(8, 8, 604, 234, "panel-bg")}
       <rect x="20" y="24" width="580" height="196" rx="10" class="sky"/>
       <!-- Wüstenränder links & rechts -->
       <polygon points="20,110 110,145 110,220 20,220" class="ground-sand"/>
       <polygon points="500,145 600,110 600,220 500,220" class="ground-sand"/>
       <!-- Fruchtebene -->
       <rect x="110" y="145" width="390" height="75" fill="${fieldGreen}" stroke="var(--f-line)"/>
       <!-- Flussbett in der Mitte -->
       <path d="M250 145 L270 192 H350 L370 145 Z" fill="var(--f-earth)"/>
       <rect x="256" y="${f1(Math.max(92, waterY))}" width="108" height="${f1(192 - Math.max(92, waterY))}" fill="var(--f-river)" opacity="0.88"/>
       ${season === "achet" && flood >= 12 ? `<rect x="112" y="138" width="386" height="${flood >= 20 ? 18 : 9}" fill="var(--f-river)" opacity="0.55"/>` : ""}
       ${canals ? `<rect x="150" y="145" width="100" height="10" fill="var(--f-river)"/><rect x="370" y="145" width="100" height="10" fill="var(--f-river)"/><line class="shaduf" x1="226" y1="145" x2="226" y2="115"/><line class="shaduf" x1="205" y1="122" x2="254" y2="112"/>${label(226, 102, "Schaduf & Kanal", "lbl tiny strong")}` : ""}
       <!-- Nilometer links am Ufer -->
       <rect x="242" y="98" width="12" height="94" fill="var(--f-stone)" stroke="var(--f-ink)"/>
       ${label(248, 90, `${flood} Ellen`, "lbl tiny strong")}
       ${label(66, 185, "Wüste", "lbl tiny muted")}
       ${label(550, 185, "Wüste", "lbl tiny muted")}
       ${label(310, 208, "Nilbett", "lbl tiny on-dark strong")}
       ${season === "peret" && flood >= 12 && flood < 20 ? `<line class="grain" x1="150" y1="145" x2="150" y2="124"/><line class="grain" x1="168" y1="145" x2="168" y2="124"/><line class="grain" x1="430" y1="145" x2="430" y2="124"/><line class="grain" x1="448" y1="145" x2="448" y2="124"/>` : ""}
       ${season === "schemu" && flood >= 12 && flood < 20 ? `<rect x="145" y="128" width="28" height="17" class="ear"/><rect x="430" y="128" width="28" height="17" class="ear"/>` : ""}
       ${label(310, 44, season === "achet" ? "Achet (Überschwemmung)" : season === "peret" ? "Peret (Aussaat im Schlamm)" : "Schemu (Erntezeit)", "lbl strong")}`,
    );
  },
  readout: (s) => {
    const flood = num(s, "flood");
    const canals = s.canals === true;
    const status =
      flood <= 10
        ? "Dürregefahr! Zu wenig fruchtbarer Schlamm und Wasser – Missernten drohen."
        : flood >= 20
          ? "Zerstörerische Flut! Dämme brechen und Dörfer am Rand werden weggespült."
          : "Günstige Fluthöhe (um 14–16 Ellen): Nährstoffreicher Schlamm deckt die Felder.";
    const tech = canals
      ? "Kanäle, Becken und das Schöpfwerk (Schaduf) verteilen Wasser weit in die Ebene."
      : "Ohne Kanäle trocknet der Rand der Felder in Peret und Schemu rasch aus.";
    return `${status} ${tech}`;
  },
};

/* ---------- 4. Pyramiden-Querschnitt & Bauanalyse (LB 2) ---------- */

const PYRAMID_PARTS: Record<string, { title: string; detail: string; x: number; y: number }> = {
  kammer: {
    title: "Königskammer (Granit)",
    detail: "Im Kern der Cheops-Pyramide lag der Steinsarkophag des Pharao für sein Weiterleben im Jenseits.",
    x: 240,
    y: 128,
  },
  entlastung: {
    title: "Entlastungskammern & Gänge",
    detail: "Fünf flache Granitdecken über der Grabkammer leiten das gewaltige Gewicht von rund 2,3 Millionen Steinblöcken zur Seite ab.",
    x: 240,
    y: 96,
  },
  rampe: {
    title: "Baustelle, Rampen & Organisation",
    detail: "Zehntausende Facharbeiter und Bauern (in der Flutzeit Achet) schleppten Kalksteinblöcke über Rampen mit Schlitten.",
    x: 112,
    y: 174,
  },
  verkleidung: {
    title: "Weiße Kalkstein-Verkleidung & Goldspitze",
    detail: "Ursprünglich glänzten die Pyramiden von Gizeh spiegelglatt weiß mit vergoldetem Pyramidion als steinerner Sonnenstrahl.",
    x: 310,
    y: 94,
  },
};

export const pyramidCutaway: LabDef = {
  title: "Bauwerk-Analyse: Pyramiden im Querschnitt",
  prompt:
    "Vergleiche die ältere Stufenpyramide (Sakkara) mit der Großen Pyramide von Gizeh und untersuche einzelne Bauteile nach Kriterien.",
  init: () => ({ type: "cheops", focus: "kammer", kriterien: false }),
  controls: () => [
    {
      type: "choice",
      key: "type",
      label: "Bauform",
      options: [
        { value: "djoser", label: "Stufenpyramide (Djoser, ca. 2650 v. Chr.)" },
        { value: "cheops", label: "Große Pyramide (Cheops, ca. 2550 v. Chr.)" },
      ],
    },
    {
      type: "choice",
      key: "focus",
      label: "Bauteil untersuchen",
      options: [
        { value: "kammer", label: "Grabkammer" },
        { value: "entlastung", label: "Entlastung & Gänge" },
        { value: "rampe", label: "Bauorganisation" },
        { value: "verkleidung", label: "Außenwirkung" },
      ],
    },
    {
      type: "toggle",
      key: "kriterien",
      label: "Kriterienkatalog (Bauwerk → Gesellschaft & Religion) einblenden",
    },
  ],
  goals: (s) => [
    {
      text: "Stufenpyramide (Djoser) mit der glatten Cheops-Pyramide vergleichen",
      met: str(s, "type") === "djoser",
    },
    {
      text: "Statik-Lösung (Entlastungskammern) oder Bauorganisation auswählen",
      met: str(s, "focus") === "entlastung" || str(s, "focus") === "rampe",
    },
    {
      text: "Vom Bauwerk über den Kriterienkatalog auf Religion & Gesellschaft schließen",
      met: s.kriterien === true,
    },
  ],
  draw: (s) => {
    const isDjoser = str(s, "type") === "djoser";
    const focus = str(s, "focus");
    const pt = PYRAMID_PARTS[focus];
    const showKrit = s.kriterien === true;

    const structure = isDjoser
      ? `<rect x="115" y="176" width="250" height="24" class="pyramid-stone"/>
         <rect x="135" y="152" width="210" height="24" class="pyramid-stone"/>
         <rect x="155" y="128" width="170" height="24" class="pyramid-stone"/>
         <rect x="175" y="104" width="130" height="24" class="pyramid-stone"/>
         <rect x="195" y="80" width="90" height="24" class="pyramid-stone"/>
         <rect x="215" y="60" width="50" height="20" class="pyramid-stone"/>
         <rect x="224" y="204" width="32" height="18" class="chamber"/>
         ${label(240, 236, "Djoser-Stufenpyramide (62 m hoch, Grab tief im Fels)", "lbl tiny strong")}`
      : `${pyramidShape(240, 200, 260, 146, true)}
         <polyline class="passage" points="168,164 210,144 210,118 240,118"/>
         <rect x="226" y="114" width="28" height="22" class="chamber"/>
         <rect x="228" y="92" width="24" height="16" fill="var(--f-stone)" stroke="var(--f-ink)"/>
         ${label(240, 236, "Cheops-Pyramide (ursprünglich 146 m hoch)", "lbl tiny strong")}`;

    return svg(
      620,
      260,
      `Querschnitt einer ägyptischen Pyramide (${isDjoser ? "Stufenpyramide" : "Cheops-Pyramide"}) mit Fokus auf ${pt.title}`,
      `${panel(8, 8, 604, 244, "panel-bg")}
       <rect x="20" y="20" width="380" height="220" rx="10" class="sky"/>
       <rect x="20" y="200" width="380" height="40" class="ground-sand"/>
       ${structure}
       <circle cx="${pt.x}" cy="${pt.y}" r="14" fill="none" stroke="var(--f-red)" stroke-width="3"/>
       ${panel(410, 20, 190, 220, "panel-bg")}
       ${label(422, 44, pt.title, "lbl small strong", "start")}
       ${labels(
         422,
         68,
         showKrit
           ? "Kriterienkatalog Bauwerk:\n1. Ort & Gestalt beschreiben\n2. Funktion im Totenkult\n3. Rückschluss: Nur eine\n   streng gegliederte Monarchie\n   mit Schreiber-Verwaltung\n   konnte Ernährung, Werkzeuge\n   und Bauarbeit koordinieren."
           : focus === "kammer"
             ? "Der Pharao sollte als\nGottkönig sicher ins\nJenseits gelangen."
             : focus === "entlastung"
               ? "Hohlräume über der\nKammer verhindern, dass\ndie Decke unter Millionen\nTonnen Stein bricht."
               : focus === "rampe"
                 ? "Bauern arbeiteten v. a.\nin der Flutzeit (Achet),\nwenn Felder unter Wasser\nstanden – gut versorgt."
                 : "Glänzender Kalkstein &\nGoldspitze zeigten die\nMacht weit über das Tal.",
         "lbl tiny",
         "start",
         16,
       )}`,
    );
  },
  readout: (s) => {
    const pt = PYRAMID_PARTS[str(s, "focus")];
    const era =
      str(s, "type") === "djoser"
        ? "Die Stufenpyramide des Djoser (ca. 2650 v. Chr.) entstand aus übereinandergesetzten Mastabas."
        : "Die Cheops-Pyramide von Gizeh (ca. 2550 v. Chr.) zählt rund 2,3 Mio. Steinblöcke.";
    return `${era} Fokus ${pt.title}: ${pt.detail}`;
  },
};
