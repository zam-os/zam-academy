import { fmtDe, f1, label, svg } from "../figures/draw";
import { worldLayerMap } from "../figures/maps";
import {
  CLIMATE_STATIONS,
  type ClimateStationId,
  comparisonBars,
  greenhouseDiagram,
  hadleyDiagram,
  walterLiethChart,
  walterLiethTable,
} from "../figures/models";
import { esc } from "../workshop";
import { choice, num, range, readout, str, type LabDef } from "./core";

export const kartenebenen: LabDef = {
  id: "kartenebenen",
  title: "Globale Ebenen & Satellitenblick schalten",
  intro: "Wechsle zwischen den vier Kartenebenen und beantworte je eine Frage zur räumlichen Auswertung.",
  note: "Die Weltkarte nutzt vereinfachte Natural-Earth-Umrisse; Satellitendaten zeigen hier schematische Schwerpunktzonen.",
  initial: () => ({ layer: "umrisse" }),
  goals: [
    { text: "Ordne auf der Klimazonenkarte den Tropengürtel ein.", reached: (s) => str(s, "q-klima") === "0" },
    { text: "Deute Vegetationsmuster in Tropen und Subtropen.", reached: (s) => str(s, "q-veg") === "0" },
    { text: "Erkenne ein Merkmal der Satelliten-Auswertung in Amazonien.", reached: (s) => str(s, "q-sat") === "0" },
  ],
  witnesses: [
    { layer: "klima", "q-klima": "0" },
    { layer: "vegetation", "q-veg": "0" },
    { layer: "abholzung", "q-sat": "0" },
  ],
  render: (s) => {
    const layer = str(s, "layer") as "umrisse" | "klima" | "vegetation" | "abholzung";
    const controls = choice("layer", "Kartenebene wählen", layer, [
      ["umrisse", "Umrisse"],
      ["klima", "Klimazonen"],
      ["vegetation", "Vegetation"],
      ["abholzung", "Satellit (Rodung)"],
    ]);
    const mapSvg = worldLayerMap(layer);
    if (layer === "umrisse") {
      return controls + mapSvg + readout("Schalte oben auf „Klimazonen“, „Vegetation“ oder „Satellit“, um thematische Ebenen auszuwerten.");
    }
    const spec = {
      klima: {
        qKey: "q-klima",
        q: "Zwischen welchen Breitenkreisen liegen die Tropen im Modell?",
        opts: [
          ["0", "Zwischen 23,5° N und 23,5° S"],
          ["1", "Nur nördlich von 45° N"],
          ["2", "Ausschließlich auf der Südhalbkugel"],
        ] as Array<[string, string]>,
        ok: "Richtig: Die Wendekreise bei 23,5° N und 23,5° S begrenzen die astronomischen Tropen.",
        hint: "Lies die Legende unten links auf der Klimazonenkarte.",
      },
      vegetation: {
        qKey: "q-veg",
        q: "Was unterscheidet das Kongobecken deutlich von der Sahara?",
        opts: [
          ["0", "Äquatornaher Regenwald steht der Wendekreiswüste gegenüber"],
          ["1", "Im Kongobecken liegt eine kalte Polarwüste"],
          ["2", "Beide Regionen besitzen identische Jahresniederschläge"],
        ] as Array<[string, string]>,
        ok: "Genau: Um den Äquator wächst immerfeuchter Regenwald, um die Wendekreise erstrecken sich Trockenwüsten.",
        hint: "Vergleiche die Lage zum Äquator und die grünen bzw. gelben Kreise.",
      },
      abholzung: {
        qKey: "q-sat",
        q: "Welchen Vorteil bietet eine Zeitreihe aktueller Satellitenbilder gegenüber einer statischen Atlaskarte?",
        opts: [
          ["0", "Sie zeigt aktuelle Rodungsfronten und Veränderungen zeitnah"],
          ["1", "Sie ersetzt alle Messungen am Boden vollständig"],
          ["2", "Sie stellt ausschließlich politische Staatsgrenzen dar"],
        ] as Array<[string, string]>,
        ok: "Treffer: Satellitenaufnahmen zeigen Landnutzungswandel – etwa in Amazonien oder auf Borneo – zeitlich aufgelöst.",
        hint: "Denke an den Vergleich zwischen älteren und aktuellen Aufnahmen eines Gebiets.",
      },
    }[layer];
    const ans = s[spec.qKey];
    const fb = ans === "0" ? readout(esc(spec.ok), "good") : ans ? readout(esc(spec.hint), "warn") : "";
    return controls + mapSvg + choice(spec.qKey, spec.q, ans ?? "", spec.opts) + fb;
  },
};

export const klimadiagramm: LabDef = {
  id: "klimadiagramm",
  title: "Klimadiagramme auswerten und Klimazonen zuordnen",
  intro: "Untersuche vier Modellstationen im Walter-Lieth-Maßstab (10 °C = 20 mm) und begründe jeweils die Klimazone.",
  note: "Oberhalb von 100 mm Monatsniederschlag ist die Skala gestaucht (10 °C = 100 mm), damit Spitzenwerte im Diagramm Platz finden.",
  initial: () => ({ station: "tropen" }),
  goals: [
    { text: "Bestimme die richtige Aussage zur immerfeuchten Tropenstation.", reached: (s) => str(s, "ans-tropen") === "0" },
    { text: "Ordne die wechselfeuchte Savannenstation zeitlich richtig ein.", reached: (s) => str(s, "ans-savanne") === "0" },
    { text: "Erkenne die 12 ariden Monate an der Wüstenstation.", reached: (s) => str(s, "ans-wueste") === "0" },
  ],
  witnesses: [
    { station: "tropen", "ans-tropen": "0" },
    { station: "savanne", "ans-savanne": "0" },
    { station: "wueste", "ans-wueste": "0" },
  ],
  render: (s) => {
    const station = str(s, "station") as ClimateStationId;
    const controls = choice("station", "Station wählen", station, [
      ["tropen", "Immerfeuchte Tropen"],
      ["savanne", "Wechselfeuchte Savanne"],
      ["wueste", "Aride Subtropen"],
      ["gemaessigt", "Gemäßigte Zone"],
    ]);
    const chart = walterLiethChart(station) + walterLiethTable(station);
    const meta = CLIMATE_STATIONS[station];
    if (station === "gemaessigt") {
      return controls + chart + readout(`${esc(meta.note)} Vergleiche vor allem die Frostmonate im Winter mit den drei tropisch-subtropischen Stationen.`);
    }
    const questions: Record<"tropen" | "savanne" | "wueste", { key: string; q: string; opts: Array<[string, string]>; ok: string; hint: string }> = {
      tropen: {
        key: "ans-tropen",
        q: "Welches Merkmal belegt das Tageszeitenklima der immerfeuchten Tropen?",
        opts: [
          ["0", "Ganzjährig 26–27 °C und alle 12 Monate humid"],
          ["1", "Eisiger Frost von Dezember bis Februar"],
          ["2", "Acht aride Monate im Sommerhalbjahr"],
        ],
        ok: "Richtig: Die Monatsmittel schwanken im Jahreslauf kaum (26–27 °C), jeder Monat ist humid.",
        hint: "Achte auf die fast waagerechte rote Temperaturkurve und die durchgehend blauen Säulen.",
      },
      savanne: {
        key: "ans-savanne",
        q: "Wann fällt die Hauptregenzeit dieser Nordhalbkugel-Savanne?",
        opts: [
          ["0", "Im Sommerhalbjahr (Mai bis Oktober), wenn die ITC nach Norden wandert"],
          ["1", "Im Januar bei niedrigstem Sonnenstand"],
          ["2", "Gar nicht – alle Monate sind voll arid"],
        ],
        ok: "Genau: Mit dem Sonnenzenit im Nordsommer bringt die ITC kräftige Zenitalregen; im Winter bleibt es trocken.",
        hint: "Vergleiche die blauen humiden Balken mit den ockerfarbenen ariden Monaten.",
      },
      wueste: {
        key: "ans-wueste",
        q: "Woran erkennst du im Walter-Lieth-Diagramm die aride Subtropenzone?",
        opts: [
          ["0", "Die Niederschlagssäulen bleiben in allen 12 Monaten unter der 2·T-Kurve"],
          ["1", "Die Temperatur liegt im Juli unter 0 °C"],
          ["2", "Es fallen ganzjährig über 200 mm pro Monat"],
        ],
        ok: "Stimmt: Alle zwölf Monate sind ockerfarben (arid), die Jahressumme liegt weit unter der möglichen Verdunstung.",
        hint: "Schau auf das Verhältnis von blauer/ockerfarbener Säulenhöhe zur roten Temperaturkurve.",
      },
    };
    const cur = questions[station];
    const ans = s[cur.key];
    const fb = ans === "0" ? readout(esc(cur.ok), "good") : ans ? readout(esc(cur.hint), "warn") : "";
    return controls + chart + choice(cur.key, cur.q, ans ?? "", cur.opts) + fb;
  },
};

export const passatzirkulation: LabDef = {
  id: "passatzirkulation",
  title: "Passatzirkulation und Wanderung der ITC steuern",
  intro: "Verändere Monat und Beobachtungsbreite. Beobachte live, wie Sonnenzenit, ITC-Regenzone, Subtropenhoch und Passate mitwandern.",
  note: "Modellhafte Darstellung ohne Land-Meer-Kontraste und Monsunablenkung.",
  initial: () => ({ month: 3, obsLat: 12 }),
  goals: [
    { text: "Beobachte am 21. Juni (Monat 6), wie die ITC zur Nord-Savanne (12° N) wandert.", reached: (s) => num(s, "month") === 6 && num(s, "obsLat") === 12 },
    { text: "Untersuche im Dezember (Monat 12), warum die Nord-Savanne (12° N) dann Trockenzeit hat.", reached: (s) => num(s, "month") === 12 && num(s, "obsLat") === 12 },
    { text: "Prüfe das ganzjährige Absink-Hoch nahe des Wendekreises (23,5° N) im September (Monat 9).", reached: (s) => num(s, "month") === 9 && num(s, "obsLat") === 23.5 },
  ],
  witnesses: [
    { month: 6, obsLat: 12 },
    { month: 12, obsLat: 12 },
    { month: 9, obsLat: 23.5 },
  ],
  render: (s) => {
    const month = num(s, "month");
    const obsLat = num(s, "obsLat");
    const monthNames = ["", "Jan", "Feb", "Mär (21.3.)", "Apr", "Mai", "Jun (21.6.)", "Jul", "Aug", "Sep (23.9.)", "Okt", "Nov", "Dez (21.12.)"];
    // Sun zenith approximation across the year: 23.5 * sin(2*pi*(m-3)/12), attenuated for ITC inertia (~0.85);
    // subtropical highs stay near 25–33° N/S rather than swinging across the equator.
    const sunZenit = Number((23.5 * Math.sin(((month - 3) / 12) * 2 * Math.PI)).toFixed(1));
    const itcLat = Number((sunZenit * 0.85).toFixed(1));
    const highN = Number((29 + sunZenit * 0.2).toFixed(1));
    const highS = Number((-29 + sunZenit * 0.2).toFixed(1));
    const dist = Math.abs(obsLat - itcLat);
    const regime =
      dist <= 9
        ? "Regenzeit (Zenitalregen nahe der ITC: aufsteigende feuchte Luft, Wolkenbildung)"
        : Math.abs(obsLat - highN) <= 7 || Math.abs(obsLat - highS) <= 7
          ? "Trockenzone im Subtropenhoch (absinkende, sich adiabatisch erwärmende Luft)"
          : "Passat-Trockenzeit (trockener Nordost- bzw. Südostpassat bei ferner ITC)";

    return range("month", "Monat im Jahreslauf", month, 3, 12, 3, monthNames[month] ?? String(month)) +
      choice("obsLat", "Beobachtungsbreite", String(obsLat), [
        ["0", "0° (Äquator / Regenwald)"],
        ["12", "12° N (Savanne)"],
        ["23.5", "23,5° N (Wendekreiswüste)"],
      ]) +
      hadleyDiagram(itcLat, obsLat) +
      readout(`Sonnenzenit ca. ${fmtDe(sunZenit, 1)}° · ITC bei ca. ${fmtDe(itcLat, 1)}° · Standort ${fmtDe(obsLat, 1)}°: ${regime}`, dist <= 9 ? "good" : "");
  },
};

export const treibhauseffekt: LabDef = {
  id: "treibhauseffekt",
  title: "Strahlungsbilanz, Treibhausgase und Eis-Albedo",
  intro: "Stelle fossiles CO₂, Methan/Landnutzung und Eis-Albedo-Verlust ein oder wähle einen Vergleichsfall (ohne vs. mit anthropogenem Antrieb).",
  note: "Didaktisches Bilanzmodell gegenüber dem vorindustriellen Mittel (+15,0 °C durch natürlichen Treibhauseffekt; ohne ihn läge die Erde bei ca. −18 °C).",
  initial: () => ({ co2: 1.5, ch4: 0.6, albedo: 0.2 }),
  goals: [
    { text: "Erzeuge einen hohen anthropogenen Antrieb mit mindestens +2,4 °C Erwärmung.", reached: (s) => {
      const d = (num(s, "co2") - 0.5) * 1.1 + num(s, "ch4") * 0.45 + num(s, "albedo") * 0.7;
      return d >= 2.4;
    } },
    { text: "Senke den zusätzlichen Antrieb auf unter +1,2 °C (starker Klimaschutz).", reached: (s) => {
      const d = (num(s, "co2") - 0.5) * 1.1 + num(s, "ch4") * 0.45 + num(s, "albedo") * 0.7;
      return d < 1.2 && num(s, "co2") <= 1.0;
    } },
    { text: "Erhöhe nur den Eis-Albedo-Verlust auf 1,0 und prüfe die positive Rückkopplung.", reached: (s) => num(s, "albedo") === 1.0 },
  ],
  witnesses: [
    { co2: 2.3, ch4: 1.4, albedo: 0.8 },
    { co2: 0.7, ch4: 0.4, albedo: 0.2 },
    { co2: 1.5, ch4: 0.6, albedo: 1.0 },
  ],
  render: (s) => {
    const co2 = num(s, "co2");
    const ch4 = num(s, "ch4");
    const albedo = num(s, "albedo");
    const tempDelta = Math.max(0.2, Number(((co2 - 0.5) * 1.1 + ch4 * 0.45 + albedo * 0.7).toFixed(1)));
    const absTemp = Number((15.0 + tempDelta).toFixed(1));
    return range("co2", "Fossile CO₂-Menge (relativ)", co2, 0.5, 2.5, 0.2, fmtDe(co2, 1)) +
      range("ch4", "Methan / Lachgas (relativ)", ch4, 0.2, 1.8, 0.2, fmtDe(ch4, 1)) +
      range("albedo", "Eis-/Schnee-Albedo-Verlust", albedo, 0.0, 1.0, 0.2, fmtDe(albedo, 1)) +
      greenhouseDiagram(co2, ch4, albedo, tempDelta) +
      readout(`Zusätzliche Erwärmung im Modell: +${fmtDe(tempDelta, 1)} °C (Mitteltemperatur ${fmtDe(absTemp, 1)} °C statt −18 °C ohne Atmosphäre). ${albedo >= 0.8 ? "Weniger Eis reflektiert weniger Sonnenlicht → verstärkende Rückkopplung." : ""}`, tempDelta >= 2.0 ? "warn" : tempDelta < 1.3 ? "good" : "");
  },
};

export const klimaszenarien: LabDef = {
  id: "klimaszenarien",
  title: "Klimaszenarien und regionale Folgen auf drei Ebenen",
  intro: "Vergleiche drei Emissionspfade und wechsele die Maßstabsebene zwischen Global, Küstenraum und Heimatraum Bayern.",
  note: "Die Balken zeigen didaktische Modellwerte bis 2100 angelehnt an Pariser Ziele (1,5 °C / deutlich unter 2 °C) gegenüber Pfaden ohne Klimaschutz.",
  initial: () => ({ pfad: "mittel", ebene: "global" }),
  goals: [
    { text: "Untersuche die Schwellenüberschreitung beim hohen Emissionspfad.", reached: (s) => str(s, "pfad") === "hoch" },
    { text: "Prüfe den Pfad mit konsequentem Klimaschutz im Küsten- und Inselraum.", reached: (s) => str(s, "pfad") === "schutz" && str(s, "ebene") === "kueste" },
    { text: "Analysiere Folgen und Anpassung für den Heimatraum Bayern.", reached: (s) => str(s, "ebene") === "bayern" },
  ],
  witnesses: [
    { pfad: "hoch", ebene: "global" },
    { pfad: "schutz", ebene: "kueste" },
    { pfad: "mittel", ebene: "bayern" },
  ],
  render: (s) => {
    const pfad = str(s, "pfad") as "schutz" | "mittel" | "hoch";
    const ebene = str(s, "ebene") as "global" | "kueste" | "bayern";
    const temp = { schutz: 1.5, mittel: 2.6, hoch: 4.1 }[pfad];
    const extremeIdx = { schutz: 35, mittel: 65, hoch: 92 }[pfad];
    const tipRisk = { schutz: 25, mittel: 60, hoch: 95 }[pfad];

    const bars = comparisonBars(
      `Szenario bis 2100 (${pfad === "schutz" ? "Starker Klimaschutz" : pfad === "mittel" ? "Mittlerer Pfad" : "Hoher Ausstoß"})`,
      [
        ["Erwärmung (°C · 20)", Math.round(temp * 20), pfad === "hoch" ? 1 : 0],
        ["Zunahme Extremwetter-Index", extremeIdx, 2],
        ["Kippelement-Risiko-Index", tipRisk, 1],
      ],
      "Pkt.",
      100,
      `Modelltemperatur 2100: +${fmtDe(temp, 1)} °C gegenüber vorindustriell.`,
    );

    const texts: Record<typeof ebene, Record<typeof pfad, string>> = {
      global: {
        schutz: "Global (+1,5 °C): Korallen bleiben stark gefährdet, doch mehrere große Kippelemente (Permafrost, AMOC) bleiben deutlich wahrscheinlicher stabil.",
        mittel: "Global (+2,6 °C): Hitzeextreme und Dürren nehmen zu; mehrere Kippschwellen rücken in den kritischen Bereich.",
        hoch: "Global (+4,1 °C): Sehr hohes Risiko irreversibler Kippprozesse (Grönland-Eis, Amazonas, Permafrost-Methan) mit weltweiter Klimaflucht.",
      },
      kueste: {
        schutz: "Küsten/Inselstaaten (+1,5 °C): Begrenzter Meeresspiegelanstieg macht Küstenschutz und lokale Anpassung in vielen Regionen noch bezahlbar.",
        mittel: "Küsten/Inselstaaten (+2,6 °C): Häufigere Sturmfluten und Versalzung von Süßwasserlinsen zwingen erste Küstenorte zur Umsiedlung.",
        hoch: "Küsten/Inselstaaten (+4,1 °C): Langfristig ist ein Meeresspiegelanstieg von mehreren Metern möglich; die Existenz tief liegender Atolle und Deltastädte ist bedroht.",
      },
      bayern: {
        schutz: "Heimatraum Bayern (+1,5 °C): Geringerer Hitzestress in Städten und bessere Chancen für den Umbau zu trockenheitsverträglichen Mischwäldern.",
        mittel: "Heimatraum Bayern (+2,6 °C): Gletscher- und Schneeverlust in den Alpen, mehr Hitzetage im Donautal, häufigere Starkregen-Hochwasser.",
        hoch: "Heimatraum Bayern (+4,1 °C): Extreme Waldbrand- und Dürresommer, Permafrost-Tauen im Hochgebirge (Steinschlag/Muren), hoher Anpassungsdruck.",
      },
    };

    const statusBar = svg(
      580,
      46,
      `Zielbereich Pariser Abkommen bei +${fmtDe(temp, 1)} °C`,
      `<rect class="geo-bar-bg" x="30" y="14" width="520" height="18" rx="6"/>` +
        `<rect class="${pfad === "schutz" ? "geo-veg-rain" : pfad === "mittel" ? "geo-color-1" : "geo-tip-dot"}" x="30" y="14" width="${f1(Math.min(520, (temp / 4.5) * 520))}" height="18" rx="6"/>` +
        `<line class="geo-obs-pin" x1="${f1(30 + (1.5 / 4.5) * 520)}" y1="6" x2="${f1(30 + (1.5 / 4.5) * 520)}" y2="38"/>` +
        label(30 + (1.5 / 4.5) * 520, 44, "1,5 °C", "lbl tiny strong") +
        `<line class="geo-obs-pin" x1="${f1(30 + (2.0 / 4.5) * 520)}" y1="6" x2="${f1(30 + (2.0 / 4.5) * 520)}" y2="38"/>` +
        label(30 + (2.0 / 4.5) * 520 + 6, 44, "2,0 °C", "lbl tiny strong", "start"),
    );

    return choice("pfad", "Emissionspfad", pfad, [
      ["schutz", "Starker Klimaschutz"],
      ["mittel", "Mittlerer Pfad"],
      ["hoch", "Hoher Ausstoß"],
    ]) +
      choice("ebene", "Maßstabsebene", ebene, [
        ["global", "Global"],
        ["kueste", "Küsten & Inseln"],
        ["bayern", "Heimatraum Bayern"],
      ]) +
      bars +
      statusBar +
      readout(esc(texts[ebene][pfad]), pfad === "hoch" ? "warn" : pfad === "schutz" ? "good" : "");
  },
};
