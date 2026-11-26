import { f1, label, labels, P, panel, svg } from "../figures/draw";
import { bool, fmtDe, type LabDef, num, str } from "./core";

export const heimatKompass: LabDef = {
  title: "Heimat-Kompass",
  prompt:
    "Erkunde sechs Dimensionen von Heimat in verschiedenen Lebenslagen und passe eigene Bindungen an.",
  init: () => ({ profil: "verwurzelt", sozialBoost: 0, politischBoost: 0 }),
  controls: () => [
    {
      type: "choice",
      key: "profil",
      label: "Lebenslage",
      options: [
        { value: "verwurzelt", label: "Lange am selben Ort" },
        { value: "zugezogen", label: "Neu zugezogen" },
        { value: "mehrfach", label: "Zwei Heimaten" },
      ],
    },
    {
      type: "range",
      key: "sozialBoost",
      label: "Engagement in Verein / Nachbarschaft",
      min: 0,
      max: 40,
      step: 10,
      format: (v) => `+${fmtDe(v)} Pkt.`,
    },
    {
      type: "range",
      key: "politischBoost",
      label: "Mitsprache in Kommune / Jugendrat",
      min: 0,
      max: 40,
      step: 10,
      format: (v) => `+${fmtDe(v)} Pkt.`,
    },
  ],
  goals: (s) => [
    {
      text: "Wähle das Profil „Neu zugezogen“ und stärke soziale Kontakte (+30 oder +40).",
      met: str(s, "profil") === "zugezogen" && num(s, "sozialBoost") >= 30,
    },
    {
      text: "Erkunde „Zwei Heimaten“ (mehrdimensionale Bindung).",
      met: str(s, "profil") === "mehrfach",
    },
    {
      text: "Stärke politische Teilhabe um mindestens +30 Punkte.",
      met: num(s, "politischBoost") >= 30,
    },
  ],
  draw: (s) => {
    const base: Record<string, number[]> = {
      verwurzelt: [90, 85, 70, 80, 90, 50],
      zugezogen: [45, 55, 50, 40, 35, 45],
      mehrfach: [70, 80, 65, 85, 75, 55],
    };
    const vals = [...(base[str(s, "profil")] ?? base.verwurzelt)];
    vals[2] = Math.min(100, vals[2] + num(s, "sozialBoost"));
    vals[5] = Math.min(100, vals[5] + num(s, "politischBoost"));
    const names = ["Räumlich", "Emotional", "Sozial", "Kulturell", "Biografisch", "Politisch"];
    const colours = [P.rust, P.teal, P.green, P.amber, P.plum, P.blue];
    return svg(
      620,
      226,
      "Balkendiagramm der sechs Heimat-Dimensionen",
      `${panel(6, 6, 608, 214, "panel-bg")}
       ${label(22, 28, "Stärke der sechs Heimat-Dimensionen (0 bis 100)", "lbl tiny strong", "start")}
       ${names
         .map((n, i) => {
           const y = 50 + i * 29;
           return `${label(22, y, n, "lbl tiny strong", "start")}
             <rect x="130" y="${y - 10}" width="400" height="12" rx="6" fill="var(--line)" opacity="0.45"/>
             <rect x="130" y="${y - 10}" width="${f1(4 * vals[i])}" height="12" rx="6" fill="${colours[i]}"/>
             ${label(542, y, fmtDe(vals[i]), "lbl tiny strong", "start")}`;
         })
         .join("")}`,
    );
  },
  readout: (s) => {
    const names: Record<string, string> = {
      verwurzelt: "Lange am selben Ort",
      zugezogen: "Neu zugezogen",
      mehrfach: "Zwei Heimaten",
    };
    const labelText = names[str(s, "profil")] ?? str(s, "profil");
    return `Profil „${labelText}“: Soziale und politische Beteiligung (+${fmtDe(num(s, "sozialBoost"))} / +${fmtDe(num(s, "politischBoost"))}) lassen auch an einem neuen Wohnort rasch Heimatbindungen wachsen.`;
  },
};

export const regionZukunft: LabDef = {
  title: "Regional-Zukunftslabor",
  prompt:
    "Simuliere kommunale Entwicklungstrends und prüfe, wie ÖPNV-Ausbau und Bürgerbeteiligung wirken.",
  init: () => ({ trend: "alterung", oepnv: 30, beteiligung: 30 }),
  controls: () => [
    {
      type: "choice",
      key: "trend",
      label: "Demografische Lage",
      options: [
        { value: "alterung", label: "Abwanderung & Alterung" },
        { value: "zuzug", label: "Starker Zuzug (Umland)" },
      ],
    },
    {
      type: "range",
      key: "oepnv",
      label: "Ausbau Bus, Bahn & Radwege",
      min: 0,
      max: 100,
      step: 10,
      format: (v) => `${fmtDe(v)} %`,
    },
    {
      type: "range",
      key: "beteiligung",
      label: "Bürger- & Jugendbeteiligung",
      min: 0,
      max: 100,
      step: 10,
      format: (v) => `${fmtDe(v)} %`,
    },
  ],
  goals: (s) => [
    {
      text: "Prüfe das Szenario „Starker Zuzug“ im Umland.",
      met: str(s, "trend") === "zuzug",
    },
    {
      text: "Verbessere die Jugend-Mobilität mit mindestens 80 % ÖPNV-Ausbau.",
      met: num(s, "oepnv") >= 80,
    },
    {
      text: "Erhöhe die kommunale Beteiligung auf mindestens 70 %.",
      met: num(s, "beteiligung") >= 70,
    },
  ],
  draw: (s) => {
    const zuzug = str(s, "trend") === "zuzug";
    const oepnv = num(s, "oepnv");
    const bet = num(s, "beteiligung");
    const lebensqualitaet = Math.min(100, Math.round((zuzug ? 45 : 25) + oepnv * 0.35 + bet * 0.25));
    const umweltdruck = Math.max(15, Math.min(100, (zuzug ? 80 : 40) - Math.round(oepnv * 0.35)));
    return svg(
      620,
      174,
      "Auswirkungen demografischer Trends und kommunaler Steuerung",
      `${panel(6, 6, 608, 162, "panel-bg")}
       ${label(22, 30, `Szenario: ${zuzug ? "Wachsende Zuzugsregion" : "Ländlicher Raum mit Alterung"}`, "lbl small strong", "start")}
       ${label(22, 66, "Erreichbarkeit & Zukunftschancen", "lbl tiny strong", "start")}
       <rect x="240" y="55" width="300" height="14" rx="7" fill="var(--line)" opacity="0.45"/>
       <rect x="240" y="55" width="${f1(3 * lebensqualitaet)}" height="14" rx="7" fill="${P.green}"/>
       ${label(550, 66, `${fmtDe(lebensqualitaet)} %`, "lbl tiny strong", "start")}
       ${label(22, 108, "Flächen- & Verkehrsdruck", "lbl tiny strong", "start")}
       <rect x="240" y="97" width="300" height="14" rx="7" fill="var(--line)" opacity="0.45"/>
       <rect x="240" y="97" width="${f1(3 * umweltdruck)}" height="14" rx="7" fill="${P.rust}"/>
       ${label(550, 108, `${fmtDe(umweltdruck)} %`, "lbl tiny strong", "start")}
       ${label(22, 144, "Modellwerte: Zeigen Zielkonflikte zwischen Wachstum, Mobilität und Ökologie.", "lbl tiny muted", "start")}`,
    );
  },
  readout: (s) =>
    `${str(s, "trend") === "zuzug" ? "Zuzug" : "Abwanderung/Alterung"}: ÖPNV-Ausbau (${fmtDe(num(s, "oepnv"))} %) und Beteiligung (${fmtDe(num(s, "beteiligung"))} %) verbessern Mobilität für Jugendliche und senken Verkehrsbelastung.`,
};

export const medienVergleich: LabDef = {
  title: "Medienvergleich zum selben Ereignis",
  prompt:
    "Vergleiche vier Medienformate und schalte sichtbare Trennung von Nachricht und Meinung um.",
  init: () => ({ medium: "oerr", trennung: false }),
  controls: () => [
    {
      type: "choice",
      key: "medium",
      label: "Medienformat",
      options: [
        { value: "oerr", label: "Öffentlich-rechtlich" },
        { value: "lokal", label: "Lokalzeitung" },
        { value: "boulevard", label: "Boulevard" },
        { value: "clip", label: "Social-Media-Clip" },
      ],
    },
    {
      type: "toggle",
      key: "trennung",
      label: "Gegenperspektive & Quellen mit einbeziehen",
    },
  ],
  goals: (s) => [
    {
      text: "Prüfe den Social-Media-Clip auf Fakten vs. Zuspitzung.",
      met: str(s, "medium") === "clip",
    },
    {
      text: "Vergleiche mit der Lokalzeitung vor Ort.",
      met: str(s, "medium") === "lokal",
    },
    {
      text: "Aktiviere zusätzlich Gegenperspektiven & Quellenprüfung.",
      met: bool(s, "trennung"),
    },
  ],
  draw: (s) => {
    const data: Record<string, { fakten: number; zuspitzung: number; lokal: number }> = {
      oerr: { fakten: 85, zuspitzung: 20, lokal: 45 },
      lokal: { fakten: 80, zuspitzung: 25, lokal: 95 },
      boulevard: { fakten: 45, zuspitzung: 85, lokal: 50 },
      clip: { fakten: 35, zuspitzung: 90, lokal: 30 },
    };
    const cur = data[str(s, "medium")] ?? data.oerr;
    const fakten = Math.min(100, cur.fakten + (bool(s, "trennung") ? 15 : 0));
    return svg(
      620,
      174,
      "Vergleich von Faktenbelegen, Zuspitzung und Lokalbezug nach Medienformat",
      `${panel(6, 6, 608, 162, "panel-bg")}
       ${label(22, 32, "Qualitätsprofil des ausgewählten Formats (0 bis 100)", "lbl small strong", "start")}
       ${[
         { t: "Fakten & Quellen", v: fakten, c: P.blue },
         { t: "Emotionale Zuspitzung", v: cur.zuspitzung, c: P.red },
         { t: "Bezug vor Ort", v: cur.lokal, c: P.teal },
       ]
         .map((r, i) => {
           const y = 64 + i * 34;
           return `${label(22, y, r.t, "lbl tiny strong", "start")}
             <rect x="210" y="${y - 10}" width="330" height="12" rx="6" fill="var(--line)" opacity="0.45"/>
             <rect x="210" y="${y - 10}" width="${f1(3.3 * r.v)}" height="12" rx="6" fill="${r.c}"/>
             ${label(550, y, fmtDe(r.v), "lbl tiny strong", "start")}`;
         })
         .join("")}`,
    );
  },
  readout: (s) => {
    const names: Record<string, string> = {
      oerr: "Öffentlich-rechtlich",
      lokal: "Lokalzeitung",
      boulevard: "Boulevard",
      clip: "Social-Media-Clip",
    };
    const labelText = names[str(s, "medium")] ?? str(s, "medium");
    return `Format „${labelText}“${bool(s, "trennung") ? " plus Gegencheck" : ""}: Erst der Vergleich mehrerer Medien zeigt sowohl Faktenbasis als auch lokale Betroffenheit.`;
  },
};

export const umfrageAuswerter: LabDef = {
  title: "Umfrage-Auswerter",
  prompt:
    "Teste, wie Stichprobengröße und Suggestivfragen das Balkendiagramm einer Schülerumfrage beeinflussen.",
  init: () => ({ n: 20, jaPct: 50, suggestiv: false }),
  controls: () => [
    {
      type: "range",
      key: "n",
      label: "Größe der Stichprobe (Befragte)",
      min: 10,
      max: 50,
      step: 10,
      format: (v) => `${fmtDe(v)} Personen`,
    },
    {
      type: "range",
      key: "jaPct",
      label: "Rohe Zustimmung",
      min: 10,
      max: 90,
      step: 10,
      format: (v) => `${fmtDe(v)} %`,
    },
    {
      type: "toggle",
      key: "suggestiv",
      label: "Suggestive Fragestellung aktivieren (+20 Prozentpunkte Verzerrung)",
    },
  ],
  goals: (s) => [
    {
      text: "Prüfe das Risiko einer sehr kleinen Stichprobe (10 Personen).",
      met: num(s, "n") === 10,
    },
    {
      text: "Schalte die Suggestivfrage an und vergleiche die Verzerrung.",
      met: bool(s, "suggestiv"),
    },
    {
      text: "Erstelle eine saubere Auswertung mit mindestens 40 Befragten ohne Suggestivfrage.",
      met: num(s, "n") >= 40 && !bool(s, "suggestiv"),
    },
  ],
  draw: (s) => {
    const n = num(s, "n");
    const raw = num(s, "jaPct");
    const shown = Math.min(100, raw + (bool(s, "suggestiv") ? 20 : 0));
    const jaCount = Math.round((shown / 100) * n);
    const neinCount = n - jaCount;
    const perPerson = 100 / n;
    return svg(
      620,
      174,
      "Auswertung einer fiktiven Schülerumfrage mit absoluten Zahlen und Prozentbalken",
      `${panel(6, 6, 608, 162, "panel-bg")}
       ${label(24, 30, `Stichprobe n = ${fmtDe(n)} (1 Person = ${fmtDe(perPerson, 1)} Prozentpunkte)`, "lbl small strong", "start")}
       ${label(24, 66, `Dafür: ${fmtDe(jaCount)} von ${fmtDe(n)} (${fmtDe(shown)} %)`, "lbl tiny strong", "start")}
       <rect x="24" y="74" width="560" height="16" rx="8" fill="var(--line)" opacity="0.45"/>
       <rect x="24" y="74" width="${f1(5.6 * shown)}" height="16" rx="8" fill="${bool(s, "suggestiv") ? P.red : P.teal}"/>
       ${label(24, 114, `Dagegen / offen: ${fmtDe(neinCount)} von ${fmtDe(n)} (${fmtDe(100 - shown)} %)`, "lbl tiny strong", "start")}
       <rect x="24" y="122" width="560" height="16" rx="8" fill="var(--line)" opacity="0.45"/>
       <rect x="24" y="122" width="${f1(5.6 * (100 - shown))}" height="16" rx="8" fill="var(--muted)" opacity="0.65"/>`,
    );
  },
  readout: (s) => {
    const n = num(s, "n");
    const shown = Math.min(100, num(s, "jaPct") + (bool(s, "suggestiv") ? 20 : 0));
    return `${fmtDe(Math.round((shown / 100) * n))} von ${fmtDe(n)} Befragten (${fmtDe(shown)} %). ${bool(s, "suggestiv") ? "Achtung: Suggestivfrage verzerrt das Ergebnis künstlich." : n <= 10 ? "Kleine Stichprobe schwankt stark bei Einzelantworten." : "Saubere Grundlage für eine schulische Präsentation."}`;
  },
};

export const soziogrammLabor: LabDef = {
  title: "Soziogramm-Labor",
  prompt:
    "Untersuche Positionen und Status in einer Projektgruppe und teste, was gemischte Kleingruppen verändern.",
  init: () => ({ rolle: "alle", gemischt: false }),
  controls: () => [
    {
      type: "choice",
      key: "rolle",
      label: "Rolle im Soziogramm hervorheben",
      options: [
        { value: "alle", label: "Überblick" },
        { value: "star", label: "Star (A)" },
        { value: "bruecke", label: "Brücke (C)" },
        { value: "rand", label: "Randposition (E)" },
      ],
    },
    {
      type: "toggle",
      key: "gemischt",
      label: "Gezielte Zusammenarbeit (Brücke zu E stärken)",
    },
  ],
  goals: (s) => [
    {
      text: "Markiere die Rolle „Star (A)“ mit den meisten eingehenden Wahlen.",
      met: str(s, "rolle") === "star",
    },
    {
      text: "Untersuche die verbindende „Brücke (C)“.",
      met: str(s, "rolle") === "bruecke",
    },
    {
      text: "Binde die Randposition (E) durch gezielte Zusammenarbeit ein.",
      met: str(s, "rolle") === "rand" && bool(s, "gemischt"),
    },
  ],
  draw: (s) => {
    const r = str(s, "rolle");
    const mix = bool(s, "gemischt");
    const nodes = [
      { id: "B", x: 110, y: 65, role: "clique", c: P.amber },
      { id: "D", x: 110, y: 155, role: "clique", c: P.amber },
      { id: "A", x: 230, y: 110, role: "star", c: P.red },
      { id: "C", x: 360, y: 110, role: "bruecke", c: P.blue },
      { id: "F", x: 475, y: 65, role: "normal", c: P.green },
      { id: "E", x: 525, y: 155, role: "rand", c: P.slate },
    ];
    return svg(
      620,
      206,
      "Interaktives Soziogramm einer sechsköpfigen Projektgruppe",
      `${panel(6, 6, 608, 194, "panel-bg")}
       <line x1="110" y1="65" x2="230" y2="110" stroke="var(--f-ink)" stroke-width="2"/>
       <line x1="110" y1="155" x2="230" y2="110" stroke="var(--f-ink)" stroke-width="2"/>
       <line x1="110" y1="65" x2="110" y2="155" stroke="var(--f-ink)" stroke-width="2"/>
       <line x1="230" y1="110" x2="360" y2="110" stroke="var(--f-ink)" stroke-width="2.5"/>
       <line x1="360" y1="110" x2="475" y2="65" stroke="var(--f-ink)" stroke-width="2"/>
       ${mix ? `<line x1="360" y1="110" x2="525" y2="155" stroke="${P.green}" stroke-width="3"/><line x1="475" y1="65" x2="525" y2="155" stroke="${P.green}" stroke-width="2.5"/>` : `<line x1="525" y1="155" x2="475" y2="65" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 4"/>`}
       ${nodes
         .map((n) => {
           const active = r === n.role;
           return `<circle cx="${n.x}" cy="${n.y}" r="${active ? 26 : 21}" fill="${n.c}" stroke="${active ? "var(--gold)" : "var(--f-halo)"}" stroke-width="${active ? 4 : 2}"/>
             ${label(n.x, n.y + 5, n.id, "lbl small on-dark strong")}`;
         })
         .join("")}
       ${label(310, 188, mix ? "Neue Brücken binden E aktiv in die Projektgruppe ein." : "Ohne Mischung bleibt E am Rand der Zusammenarbeit.", "lbl tiny muted")}`,
    );
  },
  readout: (s) => {
    const r = str(s, "rolle");
    const mix = bool(s, "gemischt");
    if (r === "star") return "A (Star): Erhält die meisten Wahlen und prägt Status sowie Gruppenklima besonders stark.";
    if (r === "bruecke") return "C (Brücke): Verbindet linke und rechte Teilgruppe – fällt C aus, zerfällt das Team leicht.";
    if (r === "rand") return mix ? "E (Randposition): Durch gemischte Zusammenarbeit entstehen zwei neue wechselseitige Kontakte." : "E (Randposition): Keine eingehende Wahl – braucht gezielte Einbindung statt Bloßstellung.";
    return `Soziogramm-Überblick (${mix ? "mit gezielter Teammischung" : "Ausgangszustand"}): Wähle Star, Brücke oder Randposition.`;
  },
};

export const fuehrungsStile: LabDef = {
  title: "Führungsstil-Simulator",
  prompt:
    "Vergleiche autoritären, demokratischen und Laissez-faire-Stil im Projektalltag sowie im akuten Notfall.",
  init: () => ({ stil: "autoritaer", notfall: false }),
  controls: () => [
    {
      type: "choice",
      key: "stil",
      label: "Führungsstil",
      options: [
        { value: "autoritaer", label: "Autoritär" },
        { value: "demokratisch", label: "Demokratisch" },
        { value: "laissezfaire", label: "Laissez-faire" },
      ],
    },
    {
      type: "toggle",
      key: "notfall",
      label: "Akuter Notfall (sofortige Rettung / Evakuierung)",
    },
  ],
  goals: (s) => [
    {
      text: "Untersuche den demokratischen Führungsstil im Projektalltag.",
      met: str(s, "stil") === "demokratisch" && !bool(s, "notfall"),
    },
    {
      text: "Prüfe, was beim Laissez-faire-Stil mit Beteiligung und Struktur geschieht.",
      met: str(s, "stil") === "laissezfaire",
    },
    {
      text: "Vergleiche einen akuten Notfall mit klaren autoritären Anweisungen.",
      met: str(s, "stil") === "autoritaer" && bool(s, "notfall"),
    },
  ],
  draw: (s) => {
    const base: Record<string, { klima: number; teilhabe: number; druck: number }> = {
      autoritaer: { klima: 35, teilhabe: 20, druck: 90 },
      demokratisch: { klima: 85, teilhabe: 90, druck: 25 },
      laissezfaire: { klima: 45, teilhabe: 40, druck: 30 },
    };
    const cur = base[str(s, "stil")] ?? base.autoritaer;
    const stilNames: Record<string, string> = {
      autoritaer: "Autoritär",
      demokratisch: "Demokratisch",
      laissezfaire: "Laissez-faire",
    };
    const stilLabel = stilNames[str(s, "stil")] ?? str(s, "stil");
    const tempo = bool(s, "notfall") && str(s, "stil") === "autoritaer" ? 95 : str(s, "stil") === "demokratisch" ? 70 : 30;
    return svg(
      620,
      192,
      "Wirkung von Führungsstilen auf Arbeitsklima, Beteiligung, Anpassungsdruck und Handlungsfähigkeit",
      `${panel(6, 6, 608, 180, "panel-bg")}
       ${label(22, 28, `Stil: ${stilLabel}${bool(s, "notfall") ? " (akuter Notfall)" : " (Projektalltag)"}`, "lbl small strong", "start")}
       ${[
         { t: "Arbeitsklima", v: cur.klima, c: P.green },
         { t: "Selbstbestimmung & Teilhabe", v: cur.teilhabe, c: P.blue },
         { t: "Anpassungsdruck", v: cur.druck, c: P.red },
         { t: bool(s, "notfall") ? "Reaktionstempo im Notfall" : "Verlässliche Planung", v: tempo, c: P.amber },
       ]
         .map((r, i) => {
           const y = 56 + i * 32;
           return `${label(22, y, r.t, "lbl tiny strong", "start")}
             <rect x="235" y="${y - 10}" width="310" height="12" rx="6" fill="var(--line)" opacity="0.45"/>
             <rect x="235" y="${y - 10}" width="${f1(3.1 * r.v)}" height="12" rx="6" fill="${r.c}"/>
             ${label(555, y, `${fmtDe(r.v)} %`, "lbl tiny strong", "start")}`;
         })
         .join("")}`,
    );
  },
  readout: (s) => {
    const st = str(s, "stil");
    if (bool(s, "notfall") && st === "autoritaer")
      return "Im akuten Notfall sichern klare, sofortige Anweisungen schnelles Handeln; im normalen Alltag erzeugt Dauer-Autorität jedoch Fremdbestimmung.";
    if (st === "demokratisch")
      return "Demokratische Führung verbindet feste Ziele mit Mitsprache: höchste Motivation und Selbstbestimmung.";
    if (st === "laissezfaire")
      return "Laissez-faire ohne Struktur lässt oft Orientierungslosigkeit und verdeckten Machtkampf zu.";
    return "Autoritärer Stil im Alltag: hoher Anpassungsdruck und wenig Raum für eigene Ideen.";
  },
};

export const gesundheitsDreieck: LabDef = {
  title: "Gesundheits-Dreieck",
  prompt:
    "Verändere physische, psychische und soziale Faktoren (1 bis 5) und beobachte die Balance deiner Gesundheit.",
  init: () => ({ physisch: 3, psychisch: 3, sozial: 3 }),
  controls: () => [
    {
      type: "range",
      key: "physisch",
      label: "Physisch (Schlaf, Bewegung, Essen)",
      min: 1,
      max: 5,
      step: 1,
      format: (v) => `${fmtDe(v)} / 5`,
    },
    {
      type: "range",
      key: "psychisch",
      label: "Psychisch (Stressausgleich, Selbstwert)",
      min: 1,
      max: 5,
      step: 1,
      format: (v) => `${fmtDe(v)} / 5`,
    },
    {
      type: "range",
      key: "sozial",
      label: "Sozial (Freundschaft, Rückhalt)",
      min: 1,
      max: 5,
      step: 1,
      format: (v) => `${fmtDe(v)} / 5`,
    },
  ],
  goals: (s) => [
    {
      text: "Teste ein Ungleichgewicht, wenn ein Bereich auf 1 sinkt.",
      met: Math.min(num(s, "physisch"), num(s, "psychisch"), num(s, "sozial")) === 1,
    },
    {
      text: "Erreiche eine stabile Gesundheitsbalance (alle drei Bereiche mindestens 4).",
      met:
        num(s, "physisch") >= 4 &&
        num(s, "psychisch") >= 4 &&
        num(s, "sozial") >= 4,
    },
    {
      text: "Prüfe den Fall mit voller sozialer Stärke (5) bei körperlicher Erschöpfung (höchstens 2).",
      met: num(s, "sozial") === 5 && num(s, "physisch") <= 2,
    },
  ],
  draw: (s) => {
    const p1 = num(s, "physisch");
    const p2 = num(s, "psychisch");
    const p3 = num(s, "sozial");
    const cx = 190;
    const cy = 122;
    const top = [cx, cy - p1 * 16];
    const right = [cx + p2 * 16 * 0.866, cy + p2 * 16 * 0.5];
    const left = [cx - p3 * 16 * 0.866, cy + p3 * 16 * 0.5];
    const sum = p1 + p2 + p3;
    return svg(
      620,
      220,
      "Dreieck der physischen, psychischen und sozialen Gesundheit",
      `${panel(6, 6, 608, 208, "panel-bg")}
       <polygon points="${cx},${cy - 80} ${f1(cx + 69.3)},${cy + 40} ${f1(cx - 69.3)},${cy + 40}" fill="none" stroke="var(--line)" stroke-dasharray="4 3"/>
       <polygon points="${f1(top[0])},${f1(top[1])} ${f1(right[0])},${f1(right[1])} ${f1(left[0])},${f1(left[1])}" fill="${P.olive}" fill-opacity="0.32" stroke="${P.olive}" stroke-width="2.5"/>
       ${label(cx, 28, `Physisch (${fmtDe(p1)})`, "lbl tiny strong")}
       ${label(cx + 82, cy + 58, `Psychisch (${fmtDe(p2)})`, "lbl tiny strong", "start")}
       ${label(cx - 82, cy + 58, `Sozial (${fmtDe(p3)})`, "lbl tiny strong", "end")}
       <rect x="360" y="34" width="234" height="150" rx="12" fill="var(--surface)" stroke="var(--line)"/>
       ${label(376, 60, `Gesamtwert: ${fmtDe(sum)} / 15`, "lbl small strong", "start")}
       ${labels(376, 88, Math.min(p1, p2, p3) <= 2 ? "Warnung: Ein schwacher\nBereich zieht langfristig\ndie anderen mit herunter." : "Gute Balance zwischen\nKörper, Seele und\nsozialem Umfeld.", "lbl tiny", "start", 17)}`,
    );
  },
  readout: (s) =>
    `Physisch ${fmtDe(num(s, "physisch"))}/5 · Psychisch ${fmtDe(num(s, "psychisch"))}/5 · Sozial ${fmtDe(num(s, "sozial"))}/5: Alle drei Ebenen stehen in ständiger Wechselwirkung.`,
};

export function pausenbrotScore(basis: string, belag: string, rohkost: boolean, getraenk: string) {
  let kh = basis === "vollkorn" ? 40 : basis === "weissmehl" ? 20 : 10;
  let eiweiss = belag === "hummus" || belag === "kaese" ? 30 : 5;
  let vit = (rohkost ? 25 : 5) + (getraenk === "wasser" ? 20 : 0);
  let zucker = (basis === "croissant" ? 20 : 5) + (belag === "nussnougat" ? 35 : 0) + (getraenk === "limo" ? 40 : 0);
  const gesamt = Math.max(10, Math.min(100, Math.round(kh + eiweiss + vit - zucker * 0.45)));
  return { kh, eiweiss, vit, zucker, gesamt };
}

export const pausenbrotTeller: LabDef = {
  title: "Pausenbrot-Werkstatt",
  prompt:
    "Stelle ein Pausenpaket zusammen und beobachte, wie Vollkorn, Eiweiß, Rohkost und Getränke die Nährstoffbilanz verändern.",
  init: () => ({ basis: "weissmehl", belag: "nussnougat", rohkost: false, getraenk: "limo" }),
  controls: () => [
    {
      type: "choice",
      key: "basis",
      label: "Brot / Gebäck",
      options: [
        { value: "vollkorn", label: "Vollkornbrot" },
        { value: "weissmehl", label: "Weißbrotsemmel" },
        { value: "croissant", label: "Schokocroissant" },
      ],
    },
    {
      type: "choice",
      key: "belag",
      label: "Belag",
      options: [
        { value: "hummus", label: "Hummus / Kräuterquark" },
        { value: "kaese", label: "Käse" },
        { value: "nussnougat", label: "Nuss-Nougat-Creme" },
      ],
    },
    {
      type: "toggle",
      key: "rohkost",
      label: "Frische Paprika & Apfel dazupacken",
    },
    {
      type: "choice",
      key: "getraenk",
      label: "Getränk",
      options: [
        { value: "wasser", label: "Wasser / ungesüßter Tee" },
        { value: "limo", label: "Gesüßte Limonade" },
      ],
    },
  ],
  goals: (s) => {
    const r = pausenbrotScore(str(s, "basis"), str(s, "belag"), bool(s, "rohkost"), str(s, "getraenk"));
    return [
      {
        text: "Ersetze die Limonade durch Wasser oder ungesüßten Tee.",
        met: str(s, "getraenk") === "wasser",
      },
      {
        text: "Kombiniere Vollkornbrot mit einem eiweißreichen Belag (Hummus oder Käse).",
        met: str(s, "basis") === "vollkorn" && (str(s, "belag") === "hummus" || str(s, "belag") === "kaese"),
      },
      {
        text: "Erreiche ein ausgewogenes Pausenpaket mit mindestens 75 Qualitätspunkten.",
        met: r.gesamt >= 75,
      },
    ];
  },
  draw: (s) => {
    const r = pausenbrotScore(str(s, "basis"), str(s, "belag"), bool(s, "rohkost"), str(s, "getraenk"));
    const rows = [
      { name: "Komplexe KH & Ballaststoffe", val: r.kh * 2.5, c: P.amber },
      { name: "Eiweiß (Baustoff)", val: r.eiweiss * 3.2, c: P.blue },
      { name: "Vitamine & Flüssigkeit", val: r.vit * 2.2, c: P.olive },
      { name: "Zuckerbelastung (niedrig = gut)", val: Math.min(100, r.zucker), c: P.red },
    ];
    return svg(
      620,
      196,
      "Nährstoff-Balken eines individuell zusammengestellten Pausenbrots",
      `${panel(6, 6, 608, 184, "panel-bg")}
       ${label(22, 30, `Nährstoff-Qualität: ${fmtDe(r.gesamt)} / 100 Punkte`, "lbl small strong", "start")}
       ${rows
         .map((row, i) => {
           const y = 60 + i * 32;
           const pct = Math.max(5, Math.min(100, Math.round(row.val)));
           return `${label(22, y, row.name, "lbl tiny strong", "start")}
             <rect x="250" y="${y - 10}" width="290" height="12" rx="6" fill="var(--line)" opacity="0.45"/>
             <rect x="250" y="${y - 10}" width="${f1(2.9 * pct)}" height="12" rx="6" fill="${row.c}"/>
             ${label(550, y, `${fmtDe(pct)} %`, "lbl tiny strong", "start")}`;
         })
         .join("")}`,
    );
  },
  readout: (s) => {
    const r = pausenbrotScore(str(s, "basis"), str(s, "belag"), bool(s, "rohkost"), str(s, "getraenk"));
    return `Gesamtwert: ${fmtDe(r.gesamt)} von 100 Punkten (Zuckerbelastung ${fmtDe(r.zucker)} %). ${r.gesamt >= 75 ? "Ausgewogene Grundlage für Konzentration bis zum Nachmittag." : "Hoher Zuckeranteil oder fehlende Vollkorn-/Rohkostbasis senkt die Sättigungsdauer."}`;
  },
};
