import { arrow, f1, label, labels, P, panel, svg } from "../figures/draw";
import { bool, fmtDe, type LabDef, num, str } from "./core";

export const politikKreislauf: LabDef = {
  title: "Politikkreislauf-Simulator",
  prompt:
    "Wähle Thema und Phase im Politikkreislauf, um Akteure und Aufgaben jeder Station zu verfolgen.",
  init: () => ({ thema: "radweg", phase: "problem" }),
  controls: () => [
    {
      type: "choice",
      key: "thema",
      label: "Kommunales Thema",
      options: [
        { value: "radweg", label: "Sicherer Schulradweg" },
        { value: "schulbus", label: "Überfüllter Schulbus" },
      ],
    },
    {
      type: "choice",
      key: "phase",
      label: "Phase im Politikkreislauf",
      options: [
        { value: "problem", label: "1. Problem" },
        { value: "debatte", label: "2. Debatte" },
        { value: "beschluss", label: "3. Beschluss" },
        { value: "umsetzung", label: "4. Umsetzung" },
      ],
    },
  ],
  goals: (s) => [
    {
      text: "Prüfe Phase 2 (Auseinandersetzung & Alternativenvergleich).",
      met: str(s, "phase") === "debatte",
    },
    {
      text: "Gehe weiter bis Phase 4 (Umsetzung & Rückwirkung auf Bürger).",
      met: str(s, "phase") === "umsetzung",
    },
    {
      text: "Wechsle auf das Thema „Überfüllter Schulbus“ in Phase 3.",
      met: str(s, "thema") === "schulbus" && str(s, "phase") === "beschluss",
    },
  ],
  draw: (s) => {
    const p = str(s, "phase");
    const phases = [
      { id: "problem", x: 30, y: 26, title: "1. Problem", sub: "Betroffene & Medien" },
      { id: "debatte", x: 330, y: 26, title: "2. Debatte", sub: "Vorschläge & Kosten" },
      { id: "beschluss", x: 330, y: 128, title: "3. Beschluss", sub: "Mehrheit im Rat" },
      { id: "umsetzung", x: 30, y: 128, title: "4. Umsetzung", sub: "Praxis & Rückmeldung" },
    ];
    return svg(
      620,
      206,
      "Vier Phasen des Politikkreislaufs",
      `${panel(6, 6, 608, 194, "panel-bg")}
       ${arrow(280, 56, 326, 56)}
       ${arrow(455, 86, 455, 124)}
       ${arrow(326, 158, 280, 158)}
       ${arrow(155, 124, 155, 86)}
       ${phases
         .map((ph) => {
           const active = ph.id === p;
           return `<rect x="${ph.x}" y="${ph.y}" width="250" height="58" rx="12" fill="${active ? P.blue : "var(--surface)"}" stroke="${P.blue}" stroke-width="${active ? 3 : 1.5}"/>
             ${label(ph.x + 125, ph.y + 25, ph.title, active ? "lbl small on-dark strong" : "lbl small strong")}
             ${label(ph.x + 125, ph.y + 44, ph.sub, active ? "lbl tiny on-dark" : "lbl tiny muted")}`;
         })
         .join("")}`,
    );
  },
  readout: (s) => {
    const map: Record<string, Record<string, string>> = {
      radweg: {
        problem: "Schülerinnen und Eltern dokumentieren gefährliche Kreuzungen auf dem Schulweg.",
        debatte: "Bauamt, Radclub und Fraktionen vergleichen Schutzstreifen, Tempo 30 und Umbaukosten.",
        beschluss: "Der Gemeinderat stimmt mit Mehrheit für einen baulich getrennten Radweg.",
        umsetzung: "Nach der Markierung testen Radfahrende die Strecke – eine enge Kurve wird nachgebessert.",
      },
      schulbus: {
        problem: "Auf Linie 4 bleiben morgens Kinder an der Haltestelle zurück.",
        debatte: "Verkehrsverbund und Elternbeirat wägen Zusatzbus gegen gestaffelten Unterricht ab.",
        beschluss: "Der Kreistag bewilligt Haushaltsmittel für einen zweiten Bus.",
        umsetzung: "Die Hauptlinie entspannt sich; ein Ortsteil meldet weiter knappe Anschlüsse.",
      },
    };
    return map[str(s, "thema")]?.[str(s, "phase")] ?? "";
  },
};

export const RAT_GROUPS = [
  { name: "Fraktion A", seats: 40, min: { radweg: 40, gruen: 20, kultur: 0 } },
  { name: "Fraktion B", seats: 35, min: { radweg: 0, gruen: 40, kultur: 20 } },
  { name: "Fraktion C", seats: 25, min: { radweg: 20, gruen: 0, kultur: 40 } },
] as const;

export function kompromissResult(radweg: number, gruen: number, kultur: number) {
  const total = radweg + gruen + kultur;
  const affordable = total <= 100;
  const groups = RAT_GROUPS.map((g) => ({
    name: g.name,
    seats: g.seats,
    agrees:
      affordable &&
      radweg >= g.min.radweg &&
      gruen >= g.min.gruen &&
      kultur >= g.min.kultur,
  }));
  const votes = groups.reduce((acc, g) => acc + (g.agrees ? g.seats : 0), 0);
  return { total, remaining: 100 - total, affordable, groups, votes, majority: affordable && votes > 50 };
}

export const kompromissRat: LabDef = {
  title: "Kompromiss-Werkstatt im Gemeinderat",
  prompt:
    "Verteile bis zu 100 Haushaltspunkte auf drei Jugendprojekte. Achte auf Mehrheit (über 50 von 100 Sitzen) und Minderheitenschutz.",
  init: () => ({ radweg: 30, gruen: 30, kultur: 30, minderheit: true }),
  controls: () => [
    {
      type: "range",
      key: "radweg",
      label: "Radwege (A ab 40 · C ab 20)",
      min: 0,
      max: 100,
      step: 10,
      format: (v) => `${fmtDe(v)} Pkt.`,
    },
    {
      type: "range",
      key: "gruen",
      label: "Grünflächen (B ab 40 · A ab 20)",
      min: 0,
      max: 100,
      step: 10,
      format: (v) => `${fmtDe(v)} Pkt.`,
    },
    {
      type: "range",
      key: "kultur",
      label: "Jugendkultur (C ab 40 · B ab 20)",
      min: 0,
      max: 100,
      step: 10,
      format: (v) => `${fmtDe(v)} Pkt.`,
    },
    {
      type: "toggle",
      key: "minderheit",
      label: "Minderheitenschutz achten (Anhörung & Grundrechte aller)",
    },
  ],
  goals: (s) => {
    const r = kompromissResult(num(s, "radweg"), num(s, "gruen"), num(s, "kultur"));
    return [
      {
        text: "Erreiche eine Mehrheit mit Fraktion A und B (75 Sitze) innerhalb von 100 Punkten.",
        met: r.majority && r.groups[0].agrees && r.groups[1].agrees && bool(s, "minderheit"),
      },
      {
        text: "Finde eine zweite Mehrheit mit Fraktion A und C (65 Sitze) innerhalb von 100 Punkten.",
        met: r.majority && r.groups[0].agrees && r.groups[2].agrees && bool(s, "minderheit"),
      },
      {
        text: "Prüfe, warum ohne Minderheitenschutz selbst 60+ Stimmen demokratisch unzulässig wären.",
        met: !bool(s, "minderheit"),
      },
    ];
  },
  draw: (s) => {
    const radweg = num(s, "radweg");
    const gruen = num(s, "gruen");
    const kultur = num(s, "kultur");
    const r = kompromissResult(radweg, gruen, kultur);
    const barW = 540;
    const scale = Math.max(100, r.total);
    return svg(
      620,
      204,
      "Maßstäbliche Verteilung der 100 Haushaltspunkte und Sitzmehrheit im Gemeinderat",
      `${panel(6, 6, 608, 192, "panel-bg")}
       ${label(24, 30, `Budgetverteilung: ${fmtDe(r.total)} von 100 Punkten`, "lbl small strong", "start")}
       <rect x="24" y="42" width="${f1(barW)}" height="20" rx="6" fill="var(--line)" opacity="0.45"/>
       <rect x="24" y="42" width="${f1((radweg / scale) * barW)}" height="20" fill="${P.blue}"/>
       <rect x="${f1(24 + (radweg / scale) * barW)}" y="42" width="${f1((gruen / scale) * barW)}" height="20" fill="${P.green}"/>
       <rect x="${f1(24 + ((radweg + gruen) / scale) * barW)}" y="42" width="${f1((kultur / scale) * barW)}" height="20" fill="${P.amber}"/>
       ${label(24, 82, `Radwege ${fmtDe(radweg)} · Grün ${fmtDe(gruen)} · Kultur ${fmtDe(kultur)}`, "lbl tiny muted", "start")}
       ${r.groups
         .map((g, i) => {
           const x = 24 + i * 192;
           const bg = g.agrees ? P.green : "var(--surface)";
           return `<rect x="${x}" y="102" width="178" height="58" rx="10" fill="${bg}" stroke="${g.agrees ? P.green : "var(--line)"}" stroke-width="2"/>
             ${label(x + 89, 124, `${g.name} (${fmtDe(g.seats)})`, g.agrees ? "lbl tiny on-dark strong" : "lbl tiny strong")}
             ${label(x + 89, 144, g.agrees ? "stimmt zu" : "Mindestwert fehlt", g.agrees ? "lbl tiny on-dark" : "lbl tiny muted")}`;
         })
         .join("")}
       ${label(310, 184, !r.affordable ? "Budget über 100: nicht finanzierbar!" : !bool(s, "minderheit") ? "Warnung: Minderheitenschutz verletzt!" : r.majority ? `Mehrheit erreicht: ${fmtDe(r.votes)} / 100 Sitze` : `Noch keine Mehrheit: ${fmtDe(r.votes)} / 100 Sitze`, "lbl tiny strong")}`,
    );
  },
  readout: (s) => {
    const r = kompromissResult(num(s, "radweg"), num(s, "gruen"), num(s, "kultur"));
    if (!r.affordable)
      return `Budget überschritten (${fmtDe(r.total)} von 100 Punkten). Kürze einen Posten, bis maximal 100 Punkte vergeben sind.`;
    if (!bool(s, "minderheit"))
      return `${fmtDe(r.votes)} Ja-Stimmen, aber Minderheitenschutz missachtet: Grundrechte und Anhörung aller Gruppen bleiben Pflicht.`;
    return `${fmtDe(r.votes)} von 100 Sitzen stimmen zu (${r.majority ? "Mehrheit erreicht" : "noch keine Mehrheit"}). Verbleibende Punkte: ${fmtDe(r.remaining)}.`;
  },
};

export const kooperationsEbenen: LabDef = {
  title: "Ebenen internationaler Kontakte vor Ort",
  prompt:
    "Erkunde vom eigenen Schulort bis in globale Partnerschaften, welche konkreten Beziehungen es vor Ort gibt.",
  init: () => ({ ebene: "kommune", jugendAktiv: false }),
  controls: () => [
    {
      type: "choice",
      key: "ebene",
      label: "Kooperationsebene",
      options: [
        { value: "kommune", label: "Städtepartnerschaft" },
        { value: "schule", label: "Partnerschule & Austausch" },
        { value: "wirtschaft", label: "Betriebe & Region" },
        { value: "weltweit", label: "Weltweite Hilfsprojekte" },
      ],
    },
    {
      type: "toggle",
      key: "jugendAktiv",
      label: "Eigene Jugendmitwirkung einblenden",
    },
  ],
  goals: (s) => [
    {
      text: "Untersuche die Ebene „Partnerschule & Austausch“.",
      met: str(s, "ebene") === "schule",
    },
    {
      text: "Erkunde „Weltweite Hilfsprojekte“ (über Europa hinaus).",
      met: str(s, "ebene") === "weltweit",
    },
    {
      text: "Schalte bei einer beliebigen Ebene die eigene Jugendmitwirkung dazu.",
      met: bool(s, "jugendAktiv"),
    },
  ],
  draw: (s) => {
    const rings = [
      { id: "kommune", r: 34, c: P.green, t: "Kommune" },
      { id: "schule", r: 58, c: P.teal, t: "Schule" },
      { id: "wirtschaft", r: 82, c: P.blue, t: "Europa" },
      { id: "weltweit", r: 106, c: P.plum, t: "Welt" },
    ];
    const active = str(s, "ebene");
    return svg(
      620,
      226,
      "Konzentrische Reichweiten internationaler Zusammenarbeit vor Ort",
      `${panel(6, 6, 608, 214, "panel-bg")}
       ${[...rings]
         .reverse()
         .map(
           (rg) =>
             `<circle cx="155" cy="114" r="${rg.r}" fill="${rg.id === active ? rg.c : "var(--surface)"}" fill-opacity="${rg.id === active ? "0.28" : "0.7"}" stroke="${rg.c}" stroke-width="${rg.id === active ? 3.5 : 1.5}"/>`,
         )
         .join("")}
       ${label(155, 118, active === "kommune" ? "Ort" : active === "schule" ? "Schule" : active === "wirtschaft" ? "Europa" : "Welt", "lbl small strong")}
       <rect x="290" y="24" width="302" height="178" rx="12" fill="var(--surface)" stroke="var(--line)"/>
       ${label(306, 48, `Fokus: ${rings.find((r) => r.id === active)?.t ?? ""}`, "lbl small strong", "start")}
       ${labels(306, 74, active === "kommune" ? "Städtepartnerschaften mit\nVereins-, Feuerwehr- und\nRathausbegegnungen" : active === "schule" ? "Schüleraustausch in Europa\n(z. B. Erasmus+) und weltweit\nmit Gastfamilien" : active === "wirtschaft" ? "Regionale Betriebe im Handel,\nZulieferer & Kulturfeste\nim europäischen Raum" : "Schul- & Gemeindepartnerschaften\nmit Ländern in Afrika, Asien\noder den USA", "lbl tiny", "start", 16)}
       ${bool(s, "jugendAktiv") ? `<rect x="306" y="150" width="270" height="36" rx="8" fill="${P.green}"/><text class="lbl tiny on-dark" x="441" y="172" text-anchor="middle">Aktiv: Austauschteam, Gastfamilie, Projektstand</text>` : label(306, 172, "Tipp: Jugendmitwirkung aktivieren", "lbl tiny muted", "start")}`,
    );
  },
  readout: (s) => {
    const names: Record<string, string> = {
      kommune: "Städtepartnerschaft (Kommune)",
      schule: "Partnerschule & Austausch",
      wirtschaft: "Betriebe & Region",
      weltweit: "Weltweite Hilfsprojekte",
    };
    const labelText = names[str(s, "ebene")] ?? str(s, "ebene");
    return `Ausgewählte Ebene „${labelText}“${bool(s, "jugendAktiv") ? " mit aktiver Jugendbeteiligung vor Ort" : ""}: Internationale Beziehungen verbinden den eigenen Schulort mit Europa und der Welt.`;
  },
};

export const grenzKonfliktLoesung: LabDef = {
  title: "Grenzkonflikt-Labor Europa",
  prompt:
    "Vergleiche bei einem grenzüberschreitenden Problem drei Lösungsansätze hinsichtlich Erfolgschance und Akzeptanz.",
  init: () => ({ thema: "fluss", ansatz: "alleingang" }),
  controls: () => [
    {
      type: "choice",
      key: "thema",
      label: "Grenzüberschreitender Konflikt",
      options: [
        { value: "fluss", label: "Umwelt (Grenzfluss)" },
        { value: "lkw", label: "Verkehr (Transit-Lkw)" },
      ],
    },
    {
      type: "choice",
      key: "ansatz",
      label: "Gewählter Lösungsansatz",
      options: [
        { value: "alleingang", label: "Nationaler Alleingang" },
        { value: "bilateral", label: "Bilaterales Abkommen" },
        { value: "eu", label: "EU-weiter Rahmen" },
      ],
    },
  ],
  goals: (s) => [
    {
      text: "Prüfe ein bilaterales Abkommen zwischen den beiden Nachbarn.",
      met: str(s, "ansatz") === "bilateral",
    },
    {
      text: "Prüfe die EU-weite Rahmenlösung.",
      met: str(s, "ansatz") === "eu",
    },
    {
      text: "Vergleiche auch den Konflikt „Verkehr (Transit-Lkw)“.",
      met: str(s, "thema") === "lkw",
    },
  ],
  draw: (s) => {
    const scores: Record<string, { erfolg: number; dauer: number; nachbar: number }> = {
      alleingang: { erfolg: 25, dauer: 20, nachbar: 15 },
      bilateral: { erfolg: 75, dauer: 75, nachbar: 80 },
      eu: { erfolg: 85, dauer: 90, nachbar: 85 },
    };
    const cur = scores[str(s, "ansatz")] ?? scores.alleingang;
    const bars = [
      { label: "Problemlösung gesamt", val: cur.erfolg, c: P.green },
      { label: "Akzeptanz beim Nachbarn", val: cur.nachbar, c: P.blue },
      { label: "Langfristige Stabilität", val: cur.dauer, c: P.teal },
    ];
    return svg(
      620,
      180,
      "Bewertung von Alleingang, bilateralem Abkommen und EU-Rahmen bei Grenzkonflikten",
      `${panel(6, 6, 608, 168, "panel-bg")}
       ${label(24, 30, `Konflikt: ${str(s, "thema") === "fluss" ? "Wasserqualität im Grenzfluss" : "Transitverkehr durchs Grenzgebiet"}`, "lbl small strong", "start")}
       ${bars
         .map((b, i) => {
           const y = 60 + i * 38;
           return `${label(24, y, b.label, "lbl tiny strong", "start")}
             <rect x="210" y="${y - 11}" width="320" height="14" rx="7" fill="var(--line)" opacity="0.45"/>
             <rect x="210" y="${y - 11}" width="${f1(3.2 * b.val)}" height="14" rx="7" fill="${b.c}"/>
             ${label(542, y, `${fmtDe(b.val)} %`, "lbl tiny strong", "start")}`;
         })
         .join("")}`,
    );
  },
  readout: (s) => {
    const a = str(s, "ansatz");
    if (a === "alleingang")
      return "Alleingang: Schnell verkündet, aber Gegenblockaden und einseitige Verlagerung senken die Erfolgschance stark.";
    if (a === "bilateral")
      return "Bilaterales Abkommen: Zwei Nachbarstaaten vereinbaren passgenaue Regeln vor Ort mit hoher Akzeptanz.";
    return "EU-Rahmen: Einheitliche Standards verhindern Ausweichen ins Nachbarland, erfordern aber längere Abstimmung unter allen Mitgliedstaaten.";
  },
};
