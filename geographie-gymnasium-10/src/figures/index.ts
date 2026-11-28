import { isExplorerFigure, renderExplorer } from "./explorers";
import {
  africaZonesMap,
  climateZonesWorldMap,
  developmentWorldMap,
  latamOverviewMap,
  menaOverviewMap,
  tippingWorldMap,
} from "./maps";
import {
  altitudinalProfile,
  comparisonBars,
  greenhouseDiagram,
  hadleyDiagram,
  oasisCrossSection,
  stackedBars,
  walterLiethChart,
} from "./models";

const figure = (title: string, body: string, caption: string) =>
  `<figure class="lesson-figure">${body}<figcaption><strong>${title}</strong> · ${caption}</figcaption></figure>`;

const staticScenes: Record<string, () => string> = {
  // LB 1
  "walter-lieth-schema": () =>
    figure(
      "Walter-Lieth-Klimadiagramm lesen",
      walterLiethChart("savanne"),
      "Die rote Linie zeigt Monatsmittel der Temperatur (°C), die Säulen den Niederschlag (mm) im Verhältnis 10 °C = 20 mm (ab 100 mm gestaucht). Wo die Säulen unter der Kurve bleiben, herrscht Aridität (ocker).",
    ),

  // LB 2
  entwicklungsregionen: () =>
    figure(
      "Länder unterschiedlichen Entwicklungsstandes im globalen Überblick",
      developmentWorldMap(),
      "Modellhafte Einteilung ausgewählter Staaten. Innerhalb jedes Landes bestehen zudem deutliche regionale und soziale Unterschiede.",
    ),
  "indikatoren-vergleich": () =>
    figure(
      "Modellvergleich: Einkommen allein vs. HDI-Dimensionen",
      comparisonBars(
        "Zwei Modellstaaten mit gleichem Pro-Kopf-Einkommen",
        [
          ["Staat A · Lebenserwartung", 84, 0],
          ["Staat B · Lebenserwartung", 58, 1],
          ["Staat A · Bildungsindex", 81, 0],
          ["Staat B · Bildungsindex", 49, 1],
        ],
        "Pkt.",
        100,
        "Lernwerte (0–100): Gleiches BNE pro Kopf bei unterschiedlicher Versorgung.",
      ),
      "Erst mehrdimensionale Indizes wie der HDI oder Verteilungsmaße (Gini-Koeffizient) decken Ungleichheiten innerhalb eines Staates auf.",
    ),

  // LB 3
  "klimazonen-erde": () =>
    figure(
      "Globale Anordnung der Klima- und Vegetationszonen",
      climateZonesWorldMap(),
      "Der flacher werdende Einstrahlungswinkel von den Tropen zu den Polen erzeugt die planetare Grundordnung der Klimazonen.",
    ),
  "hadley-schema": () =>
    figure(
      "Passatzirkulation und Wanderung der ITC (Nordsommer-Beispiel)",
      hadleyDiagram(18, 12),
      "Über dem Sonnenzenit entsteht das äquatoriale Tief (ITC) mit Zenitalregen; um ca. 30° N/S sinkt die Luft im subtropischen Hochdruckgürtel ab.",
    ),
  "oekosystem-profil": () =>
    figure(
      "Landnutzung und Nährstoffspeicher in tropischen Ökosystemen",
      stackedBars(
        "Wo liegen die Nährstoffe? (Modellvergleich)",
        [
          {
            label: "Tropischer Regenwald",
            segments: [
              { name: "Lebende Biomasse", pct: 80, cls: "geo-color-0" },
              { name: "Dünne Streu/Oberboden", pct: 12, cls: "geo-color-1" },
              { name: "Mineralboden", pct: 8, cls: "geo-color-2" },
            ],
          },
          {
            label: "Gemäßigter Laubwald",
            segments: [
              { name: "Lebende Biomasse", pct: 38, cls: "geo-color-0" },
              { name: "Humusauflage", pct: 24, cls: "geo-color-1" },
              { name: "Mineralboden", pct: 38, cls: "geo-color-2" },
            ],
          },
        ],
        "Didaktisches Modell: Im Regenwald speichert die oberirdische Biomasse den Großteil der Nährstoffe.",
      ),
      "Wird der Regenwald großflächig gerodet und abgebrannt, verliert der nährstoffarme Boden (Ferralsol) seine Grundlage schnell.",
    ),
  "tropen-heimat-vergleich": () =>
    figure(
      "Biodiversität und Struktur: Tropen vs. heimisches Ökosystem",
      comparisonBars(
        "Stockwerke, Kreislauftempo und Artenfülle (Modellindex)",
        [
          ["Tropenwald · Nischenfülle", 95, 0],
          ["Heimischer Wald · Nischen", 55, 2],
          ["Tropenwald · Umsatztempo", 90, 0],
          ["Heimischer Wald · Humus", 78, 3],
        ],
        "%",
        100,
        "Modellvergleich: Hohe Artenvielfalt und rascher Umsatz auf empfindlichem Boden.",
      ),
      "Während heimische Wälder Nährstoffe über Jahre im Humus speichern, zirkulieren sie in den Tropen extrem schnell in der Biomasse.",
    ),

  // LB 4
  "treibhaus-bilanz": () =>
    figure(
      "Natürlicher und verstärkter Treibhauseffekt",
      greenhouseDiagram(1.4, 1.1, 0.4, 1.3),
      "Kurzwellige Sonnenstrahlung erwärmt die Erde; Treibhausgase absorbieren und re-emittieren einen Teil der langwelligen Wärmestrahlung.",
    ),
  "kippelemente-weltkarte": () =>
    figure(
      "Ausgewählte Kippelemente des Erdsystems",
      tippingWorldMap(),
      "Überschreiten kritische Schwellenwerte (z. B. Permafrost-Auftauen, Eisschildschmelze, AMOC, Amazonas) kann selbstverstärkende Rückkopplungen auslösen.",
    ),

  // LB 5
  "mena-ueberblick": () =>
    figure(
      "Nordafrika, Naher und Mittlerer Osten (MENA)",
      menaOverviewMap(),
      "Naturräume von Atlas und Sahara bis Zweistromland und Arabischer Halbinsel. Der Begriff „Orient“ ist ein historisch gewachsenes Konstrukt.",
    ),
  "oasen-stockwerke": () =>
    figure(
      "Oasenwirtschaft und Grundwasser-Entnahme",
      oasisCrossSection("tropf", 8, 48, 22, "gering"),
      "Traditioneller dreistöckiger Anbau unter Dattelpalmen spart Wasser durch Beschattung; offene Furchen oder Tiefpumpen erhöhen Verlust und Versalzung.",
    ),
  "diversifizierung-golf": () =>
    figure(
      "Wirtschaftlicher Strukturwandel in Erdöl- und Erdgasstaaten (Modell)",
      stackedBars(
        "Export- und Wertschöpfungsanteile im Vergleich (Modell)",
        [
          {
            label: "Klassischer Rentierstaat",
            segments: [
              { name: "Erdöl & Erdgas", pct: 82, cls: "geo-color-1" },
              { name: "Handel/Logistik/Bau", pct: 12, cls: "geo-color-2" },
              { name: "Tourismus & Wissen", pct: 6, cls: "geo-color-0" },
            ],
          },
          {
            label: "Diversifizierte Strategie",
            segments: [
              { name: "Erdöl & Erdgas", pct: 42, cls: "geo-color-1" },
              { name: "Handel/Logistik/Solar", pct: 34, cls: "geo-color-2" },
              { name: "Tourismus & Forschung", pct: 24, cls: "geo-color-0" },
            ],
          },
        ],
        "Didaktisches Modell: Diversifizierung verringert die Verwundbarkeit bei Preisschwankungen und künftiger Dekarbonisierung.",
      ),
      "Zukunftsperspektiven verbinden Erträge aus fossilen Rohstoffen mit Bildung, Solarstrom, Finanzdiensten und Logistik.",
    ),

  // LB 6
  "subsahara-profil": () =>
    figure(
      "Klima- und Vegetationsgürtel Afrikas im Nord-Süd-Verlauf",
      africaZonesMap(),
      "Vom immerfeuchten Kongobecken über Feucht-, Trocken- und Dornsavannen bis in die Sahara – an der Südwestküste prägt zusätzlich der kalte Benguelastrom die Namib.",
    ),

  // LB 7
  "lateinamerika-vergleich": () =>
    figure(
      "Mittel- und Südamerika: Naturräume, Anden und Meeresströmungen",
      latamOverviewMap(),
      "Anders als in Afrika bricht die Anden-Kordillere die zonale Anordnung in West-Ost-Richtung und bildet ausgeprägte Höhenstufen.",
    ),
  "anden-alpen-vergleich": () =>
    figure(
      "Höhenstufen in den tropischen Anden im Überblick",
      altitudinalProfile("anden", 2250),
      "Mit jedem Kilometer Höhe sinkt die Temperatur im Mittel um rund 6 °C – dadurch entstehen am Äquator alle Vegetationsstufen übereinander.",
    ),
};

export function renderFigure(id: string, explorerPart = 0): string {
  if (isExplorerFigure(id)) {
    return renderExplorer(id, explorerPart);
  }
  const fn = staticScenes[id];
  if (!fn) {
    throw new Error(`Unknown figure id: ${id}`);
  }
  return fn();
}

export { isExplorerFigure };
