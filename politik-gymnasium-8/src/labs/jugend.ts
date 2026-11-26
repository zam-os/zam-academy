import { f1, label, labels, P, panel, svg } from "../figures/draw";
import { bool, fmtDe, type LabDef, num, str } from "./core";

export const jugendWerteBarometer: LabDef = {
  title: "Jugend-Wertebarometer",
  prompt:
    "Vergleiche deine eigene Gewichtung (0 bis 100 %) mit den Durchschnittswerten des fiktiven Klassenbarometers (n = 100).",
  init: () => ({ freundschaft: 50, umwelt: 50, politik: 50 }),
  controls: () => [
    {
      type: "range",
      key: "freundschaft",
      label: "Eigener Wert: Freundschaft & Vertrauen",
      min: 0,
      max: 100,
      step: 10,
      format: (v) => `${fmtDe(v)} %`,
    },
    {
      type: "range",
      key: "umwelt",
      label: "Eigener Wert: Umwelt- & Klimaschutz",
      min: 0,
      max: 100,
      step: 10,
      format: (v) => `${fmtDe(v)} %`,
    },
    {
      type: "range",
      key: "politik",
      label: "Eigener Wert: Politisches Mitreden",
      min: 0,
      max: 100,
      step: 10,
      format: (v) => `${fmtDe(v)} %`,
    },
  ],
  goals: (s) => [
    {
      text: "Setze Politik höher als den Umfragedurchschnitt (über 48 %).",
      met: num(s, "politik") >= 60,
    },
    {
      text: "Erzeuge einen deutlichen Unterschied von mindestens 30 Prozentpunkten zwischen zwei eigenen Werten.",
      met:
        Math.max(num(s, "freundschaft"), num(s, "umwelt"), num(s, "politik")) -
          Math.min(num(s, "freundschaft"), num(s, "umwelt"), num(s, "politik")) >=
        30,
    },
    {
      text: "Setze Umwelt mindestens auf 80 % und vergleiche mit dem Mittelwert (61 %).",
      met: num(s, "umwelt") >= 80,
    },
  ],
  draw: (s) => {
    const items = [
      { name: "Freundschaft", study: 82, own: num(s, "freundschaft"), c: P.teal },
      { name: "Umweltschutz", study: 61, own: num(s, "umwelt"), c: P.green },
      { name: "Politisches Mitreden", study: 48, own: num(s, "politik"), c: P.amber },
    ];
    return svg(
      620,
      206,
      "Vergleich eigener Wertvorstellungen mit fiktiver Jugendbefragung",
      `${panel(6, 6, 608, 194, "panel-bg")}
       ${label(22, 28, "Grau: Fiktive Jugendbefragung (n = 100) · Farbig: Deine Gewichtung", "lbl tiny strong", "start")}
       ${items
         .map((it, i) => {
           const y = 52 + i * 50;
           return `${label(22, y, it.name, "lbl tiny strong", "start")}
             <rect x="175" y="${y - 12}" width="340" height="10" rx="5" fill="var(--line)" opacity="0.45"/>
             <rect x="175" y="${y - 12}" width="${f1(3.4 * it.study)}" height="10" rx="5" fill="var(--muted)" opacity="0.65"/>
             ${label(526, y - 3, `${fmtDe(it.study)} %`, "lbl tiny muted", "start")}
             <rect x="175" y="${y + 4}" width="340" height="12" rx="6" fill="var(--line)" opacity="0.45"/>
             <rect x="175" y="${y + 4}" width="${f1(Math.max(4, 3.4 * it.own))}" height="12" rx="6" fill="${it.c}"/>
             ${label(526, y + 14, `${fmtDe(it.own)} %`, "lbl tiny strong", "start")}`;
         })
         .join("")}`,
    );
  },
  readout: (s) => {
    const diffP = num(s, "politik") - 48;
    const sign = diffP > 0 ? "+" : "";
    return `Deine Gewichtung: Freundschaft ${fmtDe(num(s, "freundschaft"))} % · Umwelt ${fmtDe(num(s, "umwelt"))} % · Politik ${fmtDe(num(s, "politik"))} % (Abstand zu 48 % Mittelwert: ${diffP < 0 ? fmtDe(diffP) : `${sign}${fmtDe(diffP)}`} Prozentpunkte).`;
  },
};

export const identitaetWaage: LabDef = {
  title: "Identitäts-Waage",
  prompt:
    "Verändere den Einfluss von Peergroup und eigener Reflexion auf Entscheidungen zu Kleidung, Freizeit und Meinung.",
  init: () => ({ peer: 50, familie: 50, eigen: 50 }),
  controls: () => [
    {
      type: "range",
      key: "peer",
      label: "Druck der Peergroup",
      min: 0,
      max: 100,
      step: 10,
      format: (v) => `${fmtDe(v)} %`,
    },
    {
      type: "range",
      key: "familie",
      label: "Erwartung der Familie",
      min: 0,
      max: 100,
      step: 10,
      format: (v) => `${fmtDe(v)} %`,
    },
    {
      type: "range",
      key: "eigen",
      label: "Eigene Prüfung & Grenzen",
      min: 0,
      max: 100,
      step: 10,
      format: (v) => `${fmtDe(v)} %`,
    },
  ],
  goals: (s) => [
    {
      text: "Erzeuge hohen Anpassungsdruck (Peergroup mindestens 80 % bei eigener Prüfung höchstens 30 %).",
      met: num(s, "peer") >= 80 && num(s, "eigen") <= 30,
    },
    {
      text: "Stärke selbstbestimmte Orientierung (eigene Prüfung mindestens 80 % und Peergroup höchstens 60 %).",
      met: num(s, "eigen") >= 80 && num(s, "peer") <= 60,
    },
    {
      text: "Finde ein Miteinander auf Augenhöhe (alle drei Werte zwischen 60 % und 80 %).",
      met:
        num(s, "peer") >= 60 &&
        num(s, "peer") <= 80 &&
        num(s, "familie") >= 60 &&
        num(s, "familie") <= 80 &&
        num(s, "eigen") >= 60 &&
        num(s, "eigen") <= 80,
    },
  ],
  draw: (s) => {
    const peer = num(s, "peer");
    const fam = num(s, "familie");
    const eigen = num(s, "eigen");
    const tilt = Math.max(-18, Math.min(18, (eigen - peer) * 0.2));
    return svg(
      620,
      196,
      "Waage zwischen Anpassungsdruck der Peergroup und eigener Entscheidung",
      `${panel(6, 6, 608, 184, "panel-bg")}
       <line x1="310" y1="158" x2="310" y2="62" stroke="var(--f-ink)" stroke-width="3"/>
       <rect x="255" y="158" width="110" height="10" rx="5" fill="var(--f-stone)"/>
       <g transform="translate(310,68) rotate(${f1(-tilt)})">
         <line x1="-175" y1="0" x2="175" y2="0" stroke="var(--f-ink)" stroke-width="3"/>
         <rect x="-220" y="14" width="125" height="44" rx="10" fill="${P.amber}"/>
         ${label(-157, 34, "Peergroup", "lbl tiny on-dark strong")}
         ${label(-157, 50, `${fmtDe(peer)} %`, "lbl tiny on-dark")}
         <rect x="95" y="14" width="125" height="44" rx="10" fill="${P.teal}"/>
         ${label(157, 34, "Eigene Prüfung", "lbl tiny on-dark strong")}
         ${label(157, 50, `${fmtDe(eigen)} %`, "lbl tiny on-dark")}
       </g>
       ${label(310, 30, `Familien-Rückhalt: ${fmtDe(fam)} %`, "lbl tiny strong")}`,
    );
  },
  readout: (s) => {
    const peer = num(s, "peer");
    const eigen = num(s, "eigen");
    const status =
      peer - eigen >= 40
        ? "Starker Anpassungsdruck überlagert eigene Grenzen."
        : eigen - peer >= 20
          ? "Selbstbestimmte Orientierung: Einflüsse werden bewusst geprüft."
          : "Ausgewogene Spannung zwischen Gruppenzugehörigkeit und Eigenständigkeit.";
    return `${status} (Peergroup ${fmtDe(peer)} %, Familie ${fmtDe(num(s, "familie"))} %, Eigenprüfung ${fmtDe(eigen)} %).`;
  },
};

export const sozialisationsNetz: LabDef = {
  title: "Sozialisations-Netzwerk",
  prompt:
    "Wähle eine Lebenssituation und verändere den Peergroup-Anteil, um die Wirkung der Sozialisationsinstanzen zu vergleichen.",
  init: () => ({ situation: "freizeit", peerShift: 0 }),
  controls: () => [
    {
      type: "choice",
      key: "situation",
      label: "Alltagssituation",
      options: [
        { value: "freizeit", label: "Freizeit & Musik" },
        { value: "schule", label: "Lernen & Leistung" },
        { value: "werte", label: "Grundwerte & Moral" },
      ],
    },
    {
      type: "range",
      key: "peerShift",
      label: "Verschiebung zur Peergroup",
      min: -20,
      max: 20,
      step: 10,
      format: (v) => `${v > 0 ? "+" : ""}${fmtDe(v)} Pkt.`,
    },
  ],
  goals: (s) => [
    {
      text: "Prüfe den Einfluss in der Situation „Lernen & Leistung“.",
      met: str(s, "situation") === "schule",
    },
    {
      text: "Prüfe „Grundwerte & Moral“ ohne Verschiebung zur Peergroup.",
      met: str(s, "situation") === "werte" && num(s, "peerShift") <= 0,
    },
    {
      text: "Erhöhe die Verschiebung zur Peergroup auf +20 Punkte.",
      met: num(s, "peerShift") >= 20,
    },
  ],
  draw: (s) => {
    const base: Record<string, { fam: number; schule: number; peer: number; medien: number }> = {
      freizeit: { fam: 35, schule: 25, peer: 75, medien: 70 },
      schule: { fam: 55, schule: 80, peer: 45, medien: 35 },
      werte: { fam: 80, schule: 55, peer: 50, medien: 40 },
    };
    const cur = base[str(s, "situation")] ?? base.freizeit;
    const shift = num(s, "peerShift");
    const rows = [
      { name: "Familie", val: Math.max(10, Math.min(100, cur.fam - shift)), c: P.teal },
      { name: "Schule", val: cur.schule, c: P.blue },
      { name: "Peergroup", val: Math.max(10, Math.min(100, cur.peer + shift)), c: P.amber },
      { name: "Medien", val: cur.medien, c: P.plum },
    ];
    return svg(
      620,
      198,
      "Einflussstärken verschiedener Sozialisationsinstanzen nach Lebenssituation",
      `${panel(6, 6, 608, 186, "panel-bg")}
       ${label(22, 28, "Einflussstärke im Modell (0 bis 100 Punkte)", "lbl tiny strong", "start")}
       ${rows
         .map((r, i) => {
           const y = 52 + i * 35;
           return `${label(22, y, r.name, "lbl tiny strong", "start")}
             <rect x="135" y="${y - 11}" width="400" height="14" rx="7" fill="var(--line)" opacity="0.45"/>
             <rect x="135" y="${y - 11}" width="${f1(4 * r.val)}" height="14" rx="7" fill="${r.c}"/>
             ${label(548, y, fmtDe(r.val), "lbl tiny strong", "start")}`;
         })
         .join("")}`,
    );
  },
  readout: (s) => {
    const names: Record<string, string> = {
      freizeit: "Freizeit & Musik",
      schule: "Lernen & Leistung",
      werte: "Grundwerte & Moral",
    };
    return `Situation „${names[str(s, "situation")] ?? "Freizeit"}“ mit Peergroup-Verschiebung ${fmtDe(num(s, "peerShift"))} Punkten: Primäre und sekundäre Instanzen greifen je nach Thema verschieden stark.`;
  },
};

export const konfliktEskalation: LabDef = {
  title: "Konflikt-Regler",
  prompt:
    "Teste, wie Ansprache, Machtverhalten und Vermittlung das Eskalationsniveau eines Schulkonflikts verändern.",
  init: () => ({ ansprache: "vorwurf", macht: "druck", mediation: false }),
  controls: () => [
    {
      type: "choice",
      key: "ansprache",
      label: "Gesprächsform",
      options: [
        { value: "vorwurf", label: "Vorwurf („Du bist immer…“)" },
        { value: "ich", label: "Ich-Botschaft & Interesse" },
      ],
    },
    {
      type: "choice",
      key: "macht",
      label: "Umgang mit Macht & Regeln",
      options: [
        { value: "druck", label: "Stärkere setzt sich durch" },
        { value: "regeln", label: "Gemeinsame Regeln achten" },
      ],
    },
    {
      type: "toggle",
      key: "mediation",
      label: "Neutrale Vermittlung (Streitschlichtung) einschalten",
    },
  ],
  goals: (s) => [
    {
      text: "Senke die Eskalation unter 50 Punkte durch Ich-Botschaft statt Vorwürfe.",
      met: str(s, "ansprache") === "ich",
    },
    {
      text: "Ersetze Machtdruck durch Orientierung an gemeinsamen Regeln.",
      met: str(s, "macht") === "regeln",
    },
    {
      text: "Erreiche eine gewaltfreie, stabile Regelung (unter 25 Punkten) mit Vermittlung.",
      met:
        str(s, "ansprache") === "ich" &&
        str(s, "macht") === "regeln" &&
        bool(s, "mediation"),
    },
  ],
  draw: (s) => {
    let level = 50;
    level += str(s, "ansprache") === "vorwurf" ? 25 : -20;
    level += str(s, "macht") === "druck" ? 20 : -10;
    if (bool(s, "mediation")) level -= 15;
    level = Math.max(5, Math.min(100, level));
    const fill = level >= 65 ? P.red : level >= 35 ? P.amber : P.green;
    return svg(
      620,
      160,
      "Eskalations-Barometer von gewaltfreier Einigung bis Eskalation",
      `${panel(6, 6, 608, 148, "panel-bg")}
       ${label(24, 34, "Modellwert Konflikteskalation (0 = ruhig geklärt · 100 = eskaliert)", "lbl tiny strong", "start")}
       <rect x="24" y="54" width="572" height="24" rx="12" fill="var(--line)" opacity="0.5"/>
       <rect x="24" y="54" width="${f1(5.72 * level)}" height="24" rx="12" fill="${fill}"/>
       ${label(310, 71, `${fmtDe(level)} / 100`, "lbl small on-dark strong")}
       ${labels(24, 108, `Ansprache: ${str(s, "ansprache") === "ich" ? "Ich-Botschaft" : "Vorwurf"}\nRegelbasis: ${str(s, "macht") === "regeln" ? "Rechts-/Hausordnung" : "Machtdruck"}\nMediation: ${bool(s, "mediation") ? "aktiv" : "aus"}`, "lbl tiny", "start", 16)}`,
    );
  },
  readout: (s) => {
    let level = 50;
    level += str(s, "ansprache") === "vorwurf" ? 25 : -20;
    level += str(s, "macht") === "druck" ? 20 : -10;
    if (bool(s, "mediation")) level -= 15;
    level = Math.max(5, Math.min(100, level));
    const status =
      level >= 65
        ? "Hohe Eskalationsgefahr: Fronten verhärten sich."
        : level >= 35
          ? "Mittlere Spannung: Einigung braucht weitere Regelklärung."
          : "Konstruktive, gewaltfreie Konfliktregelung erreicht.";
    return `${status} Modellwert: ${fmtDe(level)} von 100 Punkten.`;
  },
};

export const popularitaetSpektrum: LabDef = {
  title: "Popularitäts-Spektrum",
  prompt:
    "Prüfe, wie sich der Umgang mit Kritik und Fehlern auf den Abstand zwischen Wertschätzung und Personenkult auswirkt.",
  init: () => ({ fokus: "leistung", kritikOffen: false, fehlerZugelassen: false }),
  controls: () => [
    {
      type: "choice",
      key: "fokus",
      label: "Worauf richtet sich die Bewunderung?",
      options: [
        { value: "leistung", label: "Konkrete Leistung / Tat" },
        { value: "person", label: "Gesamte Person als Maßstab" },
      ],
    },
    {
      type: "toggle",
      key: "kritikOffen",
      label: "Sachliche Kritik an der Figur bleibt erlaubt",
    },
    {
      type: "toggle",
      key: "fehlerZugelassen",
      label: "Schwächen & Fehler werden offen benannt",
    },
  ],
  goals: (s) => [
    {
      text: "Erzeuge einen klaren Personenkult-Bereich (Fokus auf Person, keine Kritik, keine Fehler).",
      met:
        str(s, "fokus") === "person" &&
        !bool(s, "kritikOffen") &&
        !bool(s, "fehlerZugelassen"),
    },
    {
      text: "Stelle sachliche Wertschätzung ein (Fokus auf Leistung mit Kritik und Fehlern).",
      met:
        str(s, "fokus") === "leistung" &&
        bool(s, "kritikOffen") &&
        bool(s, "fehlerZugelassen"),
    },
    {
      text: "Beobachte die Grauzone, wenn nur eine der beiden Kontrollen aktiv ist.",
      met: bool(s, "kritikOffen") !== bool(s, "fehlerZugelassen"),
    },
  ],
  draw: (s) => {
    let score = str(s, "fokus") === "person" ? 80 : 45;
    if (bool(s, "kritikOffen")) score -= 25;
    if (bool(s, "fehlerZugelassen")) score -= 15;
    score = Math.max(5, Math.min(95, score));
    const x = 40 + 5.4 * score;
    return svg(
      620,
      154,
      "Spektrum zwischen sachlicher Wertschätzung und Personenkult",
      `${panel(6, 6, 608, 142, "panel-bg")}
       ${label(40, 34, "Sachliche Wertschätzung", "lbl tiny strong", "start")}
       ${label(580, 34, "Personenkult", "lbl tiny strong", "end")}
       <rect x="40" y="52" width="180" height="16" rx="8" fill="${P.green}"/>
       <rect x="220" y="52" width="180" height="16" fill="${P.amber}"/>
       <rect x="400" y="52" width="180" height="16" rx="8" fill="${P.red}"/>
       <circle cx="${f1(x)}" cy="60" r="12" fill="var(--surface)" stroke="var(--f-ink)" stroke-width="3"/>
       ${label(310, 108, score <= 30 ? "Bereich: Wertschätzung" : score <= 60 ? "Übergang / Grauzone" : "Bereich: Personenkult", "lbl small strong")}
       ${label(310, 128, `Position auf dem Spektrum: ${fmtDe(score)} / 100`, "lbl tiny muted")}`,
    );
  },
  readout: (s) => {
    let score = str(s, "fokus") === "person" ? 80 : 45;
    if (bool(s, "kritikOffen")) score -= 25;
    if (bool(s, "fehlerZugelassen")) score -= 15;
    score = Math.max(5, Math.min(95, score));
    return `Position ${fmtDe(score)} von 100: ${score <= 30 ? "Kritikfähige Wertschätzung bleibt gewahrt." : score <= 60 ? "Übergangsbereich – einzelne Kontrollmechanismen fehlen noch." : "Hohes Risiko von Personenkult ohne Korrektiv."}`;
  },
};

export const influencerStrategie: LabDef = {
  title: "Feed-Strategie-Analyse",
  prompt:
    "Untersuche, wie direkte Ansprache, versteckte Interessen und fehlende Gegenstimmen einen Social-Media-Beitrag steuern.",
  init: () => ({ interesse: "verkauf", kennzeichnung: false, parasozial: false }),
  controls: () => [
    {
      type: "choice",
      key: "interesse",
      label: "Hintergrundinteresse",
      options: [
        { value: "verkauf", label: "Produktverkauf / Code" },
        { value: "politik", label: "Politisches Image" },
        { value: "aufklaerung", label: "Sachinformation" },
      ],
    },
    {
      type: "toggle",
      key: "kennzeichnung",
      label: "Klare Kennzeichnung („Anzeige“ / Quellen) vorhanden",
    },
    {
      type: "toggle",
      key: "parasozial",
      label: "Starke parasoziale Ansprache („Nur für meine Freunde…“)",
    },
  ],
  goals: (s) => [
    {
      text: "Erzeuge eine verdeckte Verkaufsstrategie (Produktverkauf ohne Kennzeichnung mit parasozialer Nähe).",
      met:
        str(s, "interesse") === "verkauf" &&
        !bool(s, "kennzeichnung") &&
        bool(s, "parasozial"),
    },
    {
      text: "Prüfe ein politisches Image-Video mit parasozialer Ansprache.",
      met: str(s, "interesse") === "politik" && bool(s, "parasozial"),
    },
    {
      text: "Aktiviere eine transparente Sachinformation mit klarer Kennzeichnung.",
      met: str(s, "interesse") === "aufklaerung" && bool(s, "kennzeichnung"),
    },
  ],
  draw: (s) => {
    const trans = (bool(s, "kennzeichnung") ? 75 : 20) + (str(s, "interesse") === "aufklaerung" ? 20 : 0);
    const emo = (bool(s, "parasozial") ? 65 : 25) + (str(s, "interesse") !== "aufklaerung" ? 20 : 0);
    return svg(
      620,
      172,
      "Analyse von Transparenz und emotionaler Bindung eines Online-Beitrags",
      `${panel(6, 6, 608, 160, "panel-bg")}
       ${label(24, 32, `Beitragsprofil: ${str(s, "interesse") === "verkauf" ? "Kommerzielle Werbung" : str(s, "interesse") === "politik" ? "Politische Image-Pflege" : "Sachbeitrag"}`, "lbl small strong", "start")}
       ${label(24, 66, "Transparenz & Nachprüfbarkeit", "lbl tiny strong", "start")}
       <rect x="24" y="74" width="560" height="14" rx="7" fill="var(--line)" opacity="0.45"/>
       <rect x="24" y="74" width="${f1(5.6 * Math.min(100, trans))}" height="14" rx="7" fill="${P.green}"/>
       ${label(24, 114, "Emotionale / parasoziale Steuerung", "lbl tiny strong", "start")}
       <rect x="24" y="122" width="560" height="14" rx="7" fill="var(--line)" opacity="0.45"/>
       <rect x="24" y="122" width="${f1(5.6 * Math.min(100, emo))}" height="14" rx="7" fill="${P.plum}"/>`,
    );
  },
  readout: (s) =>
    `Transparenz ${fmtDe(Math.min(100, (bool(s, "kennzeichnung") ? 75 : 20) + (str(s, "interesse") === "aufklaerung" ? 20 : 0)))} % · Parasoziale Nähe ${fmtDe(Math.min(100, (bool(s, "parasozial") ? 65 : 25) + (str(s, "interesse") !== "aufklaerung" ? 20 : 0)))} %: ${bool(s, "kennzeichnung") ? "Interessen sind offen erkennbar." : "Fehlende Kennzeichnung erschwert das Durchschauen."}`,
};
