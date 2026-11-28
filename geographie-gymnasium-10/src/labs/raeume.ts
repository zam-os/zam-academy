import { f1, fmtDe, label, svg } from "../figures/draw";
import { altitudinalProfile, comparisonBars, currentAltitudinalZone, oasisCrossSection } from "../figures/models";
import { choice, num, range, readout, str, type LabDef } from "./core";

export const hdiRechner: LabDef = {
  id: "hdi-rechner",
  title: "HDI und Einkommensverteilung (Gini) kritisch prüfen",
  intro: "Verändere Lebenserwartung, Bildungsjahre, Pro-Kopf-Einkommen und Ungleichverteilung (Gini). Beobachte, was der HDI misst – und was er verdeckt.",
  note: "Berechnung nach der geometrischen UNDP-Formel (Skala 0 bis 1). Der Gini-Index verändert den reinen HDI nicht, zeigt aber die Verteilungslücke.",
  initial: () => ({ life: 68, edu: 10, gni: 8000, gini: 40 }),
  goals: [
    { text: "Erreiche einen sehr hohen HDI (mindestens 0,80) mit ausgeglichener Verteilung (Gini höchstens 30).", reached: (s) => {
      const le = Math.min(1, Math.max(0, (num(s, "life") - 20) / 65));
      const ed = Math.min(1, Math.max(0, num(s, "edu") / 18));
      const inc = Math.min(1, Math.max(0, (Math.log(num(s, "gni")) - Math.log(100)) / (Math.log(75000) - Math.log(100))));
      const hdi = Math.cbrt(le * ed * inc);
      return hdi >= 0.8 && num(s, "gini") <= 30;
    } },
    { text: "Stelle ein hohes Einkommen (ab 30 000 $) bei extremer Ungleichheit (Gini ab 60) ein.", reached: (s) => num(s, "gni") >= 30000 && num(s, "gini") >= 60 },
    { text: "Untersuche einen Fall niedrigen Entwicklungsstandes (HDI unter 0,55).", reached: (s) => {
      const le = Math.min(1, Math.max(0, (num(s, "life") - 20) / 65));
      const ed = Math.min(1, Math.max(0, num(s, "edu") / 18));
      const inc = Math.min(1, Math.max(0, (Math.log(num(s, "gni")) - Math.log(100)) / (Math.log(75000) - Math.log(100))));
      return Math.cbrt(le * ed * inc) < 0.55;
    } },
  ],
  witnesses: [
    { life: 81, edu: 15, gni: 42000, gini: 30 },
    { life: 70, edu: 11, gni: 35000, gini: 60 },
    { life: 56, edu: 6, gni: 2000, gini: 45 },
  ],
  render: (s) => {
    const life = num(s, "life");
    const edu = num(s, "edu");
    const gni = num(s, "gni");
    const gini = num(s, "gini");

    const leIdx = Math.min(1, Math.max(0, (life - 20) / 65));
    const edIdx = Math.min(1, Math.max(0, edu / 18));
    const incIdx = Math.min(1, Math.max(0, (Math.log(gni) - Math.log(100)) / (Math.log(75000) - Math.log(100))));
    const hdi = Math.cbrt(leIdx * edIdx * incIdx);
    const ihdiApprox = hdi * (1 - gini / 160);

    const chart = comparisonBars(
      `HDI-Dimensionen & Verteilungsvergleich · HDI = ${fmtDe(hdi, 2)}`,
      [
        ["Gesundheit (Index)", Math.round(leIdx * 100), 0],
        ["Bildung (Index)", Math.round(edIdx * 100), 2],
        ["Einkommen BNE (Index)", Math.round(incIdx * 100), 1],
        ["Ungleichheitsbereinigt", Math.round(ihdiApprox * 100), 3],
      ],
      "%",
      100,
      `Gini-Index = ${gini} (0 = völlig gleich, 100 = extrem ungleich)`,
    );

    const cat = hdi >= 0.8 ? "sehr hoher Entwicklungsstand" : hdi >= 0.7 ? "hoher Entwicklungsstand" : hdi >= 0.55 ? "mittlerer Entwicklungsstand" : "niedriger Entwicklungsstand";
    return range("life", "Lebenserwartung", life, 50, 85, 1, `${life} Jahre`) +
      range("edu", "Bildungsdauer", edu, 4, 18, 1, `${edu} Jahre`) +
      range("gni", "BNE pro Kopf (KKP)", gni, 1000, 55000, 1000, `${String(gni).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} $`) +
      range("gini", "Ungleichheit (Gini)", gini, 25, 65, 5, `${gini}`) +
      chart +
      readout(`Berechneter HDI: ${fmtDe(hdi, 2)} (${cat}). Mit Gini ${gini} sinkt der geschätzte verteilungsbereinigte Wert auf ${fmtDe(ihdiApprox, 2)}. ${gini >= 55 && gni >= 25000 ? "Hohes Durchschnittseinkommen verdeckt hier starke Armut innerhalb des Landes!" : ""}`, gini >= 55 ? "warn" : hdi >= 0.8 && gini <= 30 ? "good" : "");
  },
};

export const naehrstoffkreislauf: LabDef = {
  id: "naehrstoffkreislauf",
  title: "Kurzgeschlossener Nährstoffkreislauf unter Nutzungsdruck",
  intro: "Vergleiche Brandrodung ohne Brache, traditionellen Wanderfeldbau mit Erholung und nachhaltigen Agroforst über zehn Nutzungsjahre.",
  note: "Didaktisches Modell auf Ferralsol-Boden: Mineralboden hat geringe Speicherfähigkeit; fast alle Nährstoffe sitzen in der lebenden Biomasse.",
  initial: () => ({ nutzung: "brandrodung", jahr: 1 }),
  goals: [
    { text: "Beobachte den schnellen Bodenertrags-Verfall im Jahr 5 bei Brandrodung ohne Brache.", reached: (s) => str(s, "nutzung") === "brandrodung" && num(s, "jahr") >= 5 },
    { text: "Erprobe im Wanderfeldbau den Zeitpunkt nach längerer Erholungsphase (Jahr 8 oder höher).", reached: (s) => str(s, "nutzung") === "wanderfeldbau" && num(s, "jahr") >= 8 },
    { text: "Vergleiche ein dauerhaft stabiles Agroforstsystem in Jahr 6 oder später.", reached: (s) => str(s, "nutzung") === "agroforst" && num(s, "jahr") >= 6 },
  ],
  witnesses: [
    { nutzung: "brandrodung", jahr: 5 },
    { nutzung: "wanderfeldbau", jahr: 8 },
    { nutzung: "agroforst", jahr: 6 },
  ],
  render: (s) => {
    const nutzung = str(s, "nutzung") as "brandrodung" | "wanderfeldbau" | "agroforst";
    const jahr = num(s, "jahr");
    let biomasse = 90;
    let boden = 15;
    let auswaschung = 10;
    let ertrag = 70;
    let msg = "";

    if (nutzung === "brandrodung") {
      biomasse = Math.max(6, 22 - jahr * 3);
      boden = Math.max(4, 52 - jahr * 10);
      auswaschung = Math.min(95, 35 + jahr * 9);
      ertrag = Math.max(8, 82 - jahr * 14);
      msg = jahr <= 2 ? "Asche düngt kurzfristig, doch ohne Baumkrone wäscht tropischer Starkregen Nährstoffe aus." : "Nährstoffarmut und Verkrustung (Lateritisierung): Der Ertrag bricht ohne Brache stark ein.";
    } else if (nutzung === "wanderfeldbau") {
      const regenerating = jahr >= 4;
      biomasse = regenerating ? Math.min(82, 20 + (jahr - 3) * 9) : Math.max(15, 35 - jahr * 6);
      boden = regenerating ? Math.min(45, 22 + (jahr - 3) * 3) : 42 - jahr * 6;
      auswaschung = regenerating ? Math.max(18, 42 - (jahr - 3) * 4) : 45;
      ertrag = regenerating ? 62 : 76;
      msg = regenerating ? "Während der langen Brache wächst Sekundärwald nach und baut den oberirdischen Speicher wieder auf." : "Kurze Anbauphase nach kleinflächiger Rodung nutzt den Aschedünger ohne Kahlschlag.";
    } else {
      biomasse = 82;
      boden = 42;
      auswaschung = 16;
      ertrag = 78;
      msg = "Mehrstöckiger Agroforst (Schattenbäume, Kakao, Nutzpflanzen) hält den Kreislauf durch Laubstreu und Mykorrhiza dauerhaft geschlossen.";
    }

    const chart = comparisonBars(
      `Nährstoffdynamik im Jahr ${jahr}`,
      [
        ["Oberirdische Biomasse", biomasse, 0],
        ["Verfügbare Bodennährstoffe", boden, 1],
        ["Auswaschungsverlust", auswaschung, 2],
        ["Nachhaltiger Ertrag", ertrag, 3],
      ],
      "%",
      100,
    );

    return choice("nutzung", "Nutzungsform", nutzung, [
      ["brandrodung", "Dauer-Brandrodung"],
      ["wanderfeldbau", "Wanderfeldbau mit Brache"],
      ["agroforst", "Agroforstsystem"],
    ]) +
      range("jahr", "Nutzungsjahr", jahr, 1, 10, 1, `Jahr ${jahr}`) +
      chart +
      readout(msg, nutzung === "agroforst" ? "good" : auswaschung >= 70 ? "warn" : "");
  },
};

export const oasenwasser: LabDef = {
  id: "oasenwasser",
  title: "Oasenwirtschaft, Grundwasser und Versalzungsrisiko",
  intro: "Wähle eine Bewässerungsmethode und verändere die bewässerte Fläche. Vergleiche Entnahme, Verdunstung und Bodenversalzung.",
  note: "Didaktische Wasserbilanz mit erneuerbarer Oasen-Grundwasserneubildung von 50 Einheiten je Zeitschritt.",
  initial: () => ({ methode: "furche", area: 8 }),
  goals: [
    { text: "Senke bei gleicher Fläche (8 ha) das Versalzungsrisiko auf „gering“.", reached: (s) => str(s, "methode") === "tropf" && num(s, "area") <= 8 },
    { text: "Entdecke den Jevons-Effekt: Spare je Hektar mit Tröpfchenbewässerung, verbrauche durch Flächenausweitung (ab 14 ha) aber über 50 Einheiten.", reached: (s) => str(s, "methode") === "tropf" && num(s, "area") >= 14 },
    { text: "Untersuche die Übernutzung bei Kreisberegnung mit fossilem Tiefengrundwasser (ab 10 ha).", reached: (s) => str(s, "methode") === "fossil" && num(s, "area") >= 10 },
  ],
  witnesses: [
    { methode: "tropf", area: 8 },
    { methode: "tropf", area: 14 },
    { methode: "fossil", area: 10 },
  ],
  render: (s) => {
    const methode = str(s, "methode") as "furche" | "fossil" | "tropf";
    const area = num(s, "area");
    const perHa = methode === "furche" ? 10 : methode === "fossil" ? 8 : 5;
    const withdrawal = area * perHa;
    const depthPct = Math.min(95, Math.max(10, Math.round((withdrawal / 120) * 85)));
    const salinity: "hoch" | "mittel" | "gering" =
      methode === "furche" ? "hoch" : methode === "fossil" ? "mittel" : area > 11 ? "mittel" : "gering";

    const balance = comparisonBars(
      "Wasserbilanz vs. Neubildung (50 Einheiten)",
      [
        ["Erneuerbare Neubildung", 50, 0],
        ["Gesamtentnahme", withdrawal, withdrawal > 50 ? 1 : 2],
      ],
      "Einh.",
      180,
    );

    return choice("methode", "Bewässerungstechnik", methode, [
      ["furche", "Offene Furchen"],
      ["fossil", "Fossile Tiefpumpen"],
      ["tropf", "Tröpfchenbewässerung"],
    ]) +
      range("area", "Bewässerte Fläche", area, 4, 16, 1, `${area} ha`) +
      oasisCrossSection(methode, area, withdrawal, depthPct, salinity) +
      balance +
      readout(`Entnahme: ${area} · ${perHa} = ${withdrawal} Einheiten (${withdrawal > 50 ? "Überschreitet Neubildung → Grundwasser sinkt" : "innerhalb der Neubildung"}). Versalzungsrisiko: ${salinity}.`, withdrawal > 50 || salinity === "hoch" ? "warn" : "good");
  },
};

export const sahelDesertifikation: LabDef = {
  id: "sahel-desertifikation",
  title: "Desertifikation in der Sahelzone steuern",
  intro: "Stelle Viehbesatz, Holzbedarf und Niederschlagsjahr ein. Aktiviere Steinwälle und Agroforst, um die Bodendegradation umzukehren.",
  note: "Vereinfachtes Mensch-Umwelt-Systemmodell: In der Praxis entscheiden zusätzlich Landrechte, Preise und Beratung vor Ort.",
  initial: () => ({ vieh: 2, holz: 2, regen: "normal", schutz: "keine" }),
  goals: [
    { text: "Erlebe den Zusammenbruch der Pflanzendecke (< 25 %) bei hohem Druck in einem Dürrejahr.", reached: (s) => str(s, "regen") === "duerre" && num(s, "vieh") >= 4 && str(s, "schutz") === "keine" && Math.max(8, 52 - num(s, "vieh") * 7 - num(s, "holz") * 6) < 25 },
    { text: "Stabilisiere die Vegetationsdecke trotz Dürrejahr auf mindestens 55 % durch geringeren Druck und Schutzmaßnahmen.", reached: (s) => str(s, "regen") === "duerre" && str(s, "schutz") === "steinwaelle" && (52 - num(s, "vieh") * 7 - num(s, "holz") * 6 + 34) >= 55 },
    { text: "Erreiche in einem normalen Regenjahr mit Schutzmaßnahmen mindestens 80 % Bedeckung.", reached: (s) => str(s, "regen") === "normal" && str(s, "schutz") === "steinwaelle" && Math.min(95, 74 - num(s, "vieh") * 6 - num(s, "holz") * 5 + 34) >= 80 },
  ],
  witnesses: [
    { vieh: 4, holz: 4, regen: "duerre", schutz: "keine" },
    { vieh: 2, holz: 2, regen: "duerre", schutz: "steinwaelle" },
    { vieh: 2, holz: 1, regen: "normal", schutz: "steinwaelle" },
  ],
  render: (s) => {
    const vieh = num(s, "vieh");
    const holz = num(s, "holz");
    const regen = str(s, "regen") as "duerre" | "normal";
    const schutz = str(s, "schutz") as "keine" | "steinwaelle";

    const base = regen === "duerre" ? 52 : 74;
    const pressure = regen === "duerre" ? vieh * 7 + holz * 6 : vieh * 6 + holz * 5;
    const bonus = schutz === "steinwaelle" ? 34 : 0;
    const cover = Math.min(95, Math.max(8, base - pressure + bonus));
    const erosion = Math.max(5, 100 - cover);
    const moisture = Math.min(90, Math.max(10, Math.round(cover * 0.75 + (regen === "normal" ? 15 : 0))));

    const chart = comparisonBars(
      "Bodenzustand im Sahel-Modell",
      [
        ["Schützende Pflanzendecke", cover, 0],
        ["Bodenfeuchte", moisture, 2],
        ["Wind-/Wassererosion", erosion, 1],
      ],
      "%",
      100,
    );

    const statusBar = svg(
      580,
      78,
      `Landschaftszustand: ${cover} Prozent Pflanzendecke`,
      `<rect class="geo-sand" x="24" y="14" width="532" height="44" rx="8"/>` +
        `<rect class="geo-crop-strip" x="24" y="14" width="${f1((532 * cover) / 100)}" height="44" rx="8"/>` +
        (schutz === "steinwaelle" ? `<line class="geo-shore" x1="24" y1="36" x2="556" y2="36" stroke-dasharray="10 6"/>` : "") +
        label(290, 41, `Pflanzendecke: ${cover} % · Erosion: ${erosion} %`, "lbl small strong"),
    );

    return choice("regen", "Niederschlagsjahr", regen, [
      ["duerre", "Dürrejahr"],
      ["normal", "Normales Regenjahr"],
    ]) +
      choice("schutz", "Gegenmaßnahmen", schutz, [
        ["keine", "Ohne Bodenschutz"],
        ["steinwaelle", "Steinwälle, Zaï & Agroforst"],
      ]) +
      range("vieh", "Viehbesatz (Druck)", vieh, 1, 5, 1, `Stufe ${vieh}`) +
      range("holz", "Brennholz-Entnahme", holz, 1, 5, 1, `Stufe ${holz}`) +
      statusBar +
      chart +
      readout(cover < 30 ? "Kritische Bodendegradation: Offener Oberboden wird verweht – Desertifikation schreitet voran." : cover >= 65 ? "Stabile Gras- und Baumbedeckung speichert Regenwasser im Boden und sichert Ernten." : "Übergangszustand: Weniger Beweidung und Steinwälle verbessern die Erholung deutlich.", cover < 30 ? "warn" : cover >= 65 ? "good" : "");
  },
};

export const hoehenstufen: LabDef = {
  id: "hoehenstufen",
  title: "Höhenstufen: Tropische Anden vs. Bayerische Alpen",
  intro: "Vergleiche die vertikale Zonierung am Äquator (Anden) mit einem Gebirge der gemäßigten Breiten (Alpen) bei veränderlicher Höhe.",
  note: "Modellhafte Temperaturabnahme von 0,6 °C je 100 Höhenmeter (Ausgangswert 27 °C in den Tropen bzw. 10 °C im Alpenvorland).",
  initial: () => ({ gebirge: "anden", hoehe: 500 }),
  goals: [
    { text: "Erkunde die kühle Getreide- und Kartoffelstufe (Tierra fría, 2000–3500 m) in den Anden.", reached: (s) => str(s, "gebirge") === "anden" && num(s, "hoehe") >= 2000 && num(s, "hoehe") < 3500 },
    { text: "Steige in den Anden über 4500 m bis in die Schneestufe (Tierra nevada) auf.", reached: (s) => str(s, "gebirge") === "anden" && num(s, "hoehe") >= 4500 },
    { text: "Wechsle zu den Alpen und vergleiche, warum dort schon unter 3000 m Schnee liegt.", reached: (s) => str(s, "gebirge") === "alpen" && num(s, "hoehe") >= 2750 },
  ],
  witnesses: [
    { gebirge: "anden", hoehe: 2500 },
    { gebirge: "anden", hoehe: 4750 },
    { gebirge: "alpen", hoehe: 2750 },
  ],
  render: (s) => {
    const gebirge = str(s, "gebirge") as "anden" | "alpen";
    const maxH = gebirge === "anden" ? 5000 : 3000;
    const hoehe = Math.min(maxH, num(s, "hoehe"));
    const base = gebirge === "anden" ? 27 : 10;
    const temp = Number((base - (hoehe / 100) * 0.6).toFixed(1));
    const zone = currentAltitudinalZone(gebirge, hoehe);

    return choice("gebirge", "Gebirgsraum", gebirge, [
      ["anden", "Tropische Anden (~0°)"],
      ["alpen", "Bayerische Alpen (~47° N)"],
    ]) +
      range("hoehe", "Höhenlage", hoehe, 0, maxH, 250, `${hoehe} m`) +
      altitudinalProfile(gebirge, hoehe) +
      readout(`Aktuelle Stufe: ${zone} (${hoehe} m) · Modelltemperatur ca. ${fmtDe(temp, 1)} °C. ${gebirge === "alpen" && hoehe >= 2500 ? "Wegen der kühleren Ausgangstemperatur beginnt die nivale Schneestufe in den Alpen rund 1800 m tiefer als in den Äquator-Anden." : ""}`, temp <= 0 ? "warn" : "good");
  },
};
