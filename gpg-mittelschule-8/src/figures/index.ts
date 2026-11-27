/**
 * Every drawing and map a lesson can show, by id. A lesson lists its ids in
 * `figures`; tests check that each id exists, is used, and renders an
 * accessible finite SVG without NaN or undefined.
 */
import { esc } from "../workshop";
import {
  europe1942Map,
  germany1945Map,
  northAmericaEuropeMap,
  northAmericaMap,
} from "./maps";
import {
  alltagStadtLand,
  energieAlltag,
  energieVerbund,
  energietraegerBild,
  nordamerikaKlima,
  usaVergleich,
} from "./scenes-lb1";
import {
  fluchtVertreibung,
  kriegsfolgenHeute,
  machtuebertragung1933,
  nachkriegsalltag,
  nuernbergerProzesse,
  verfolgungNs,
  weimarKrise,
  weimarVerfassung,
  wendepunkteKapitulation,
} from "./scenes-lb2";
import {
  gesetzgebungSchema,
  menschenrechteGrundrechte,
  propagandaMedien,
  verfassungsorgane,
  widerstandNs,
  zivilcourageDemokratie,
} from "./scenes-lb3";
import {
  dreiSaeulenRente,
  generationenvertragBild,
  landbauVergleich,
  oekolandbauKostenBild,
  politischeTeilhabe,
  sozialstaatSaeulen,
  tafelnGemeinnuetzig,
  wahlbeteiligungUrsachen,
} from "./scenes-lb4";

export interface FigureDef {
  title: string;
  caption: string;
  draw: () => string;
}

export const FIGURES: Record<string, FigureDef> = {
  "nordamerika-karte": {
    title: "Nordamerika: Naturräume und Gewässer",
    caption:
      "Kartengrundlage: Natural Earth (gemeinfrei). Die Zahlen markieren sieben wichtige Gebirge, Ebenen und Gewässer.",
    draw: northAmericaMap,
  },
  "nordamerika-europa": {
    title: "Nordamerika und Europa auf gleicher Breite",
    caption:
      "Klicke auf einen Kontinent (M-Zug-Vergleich). Deutschland liegt so weit nördlich wie Südkanada. Kartengrundlage: Natural Earth.",
    draw: northAmericaEuropeMap,
  },
  "nordamerika-klima": {
    title: "Warum Luftmassen in Nordamerika weit wandern",
    caption:
      "Vereinfachte Darstellung der Gebirgsrichtungen im Vergleich zu den Alpen. Tippe auf die Teilbereiche.",
    draw: nordamerikaKlima,
  },
  "usa-vergleich": {
    title: "USA und Deutschland im Strukturvergleich",
    caption:
      "Schematischer Vergleich nach ökonomischen und gesellschaftlichen Merkmalen; ohne Tagesstatistiken.",
    draw: usaVergleich,
  },
  "alltag-stadt-land": {
    title: "Jugendalltag in Großstadt und ländlichem Raum",
    caption:
      "Tippe auf Stadt oder Land, um typische Vor- und Nachteile für Gleichaltrige zu vergleichen.",
    draw: alltagStadtLand,
  },
  energietraeger: {
    title: "Fossile und erneuerbare Energieträger",
    caption:
      "Vereinfachte Übersicht zu Vorrat, CO₂-Ausstoß und Schwankungen. Wirkungsgrade sind Richtwerte.",
    draw: energietraegerBild,
  },
  "energie-verbund": {
    title: "Staatenübergreifendes Verbundnetz",
    caption:
      "Vereinfachtes Modell: Windstrom aus dem Norden und Speicher in den Alpen gleichen sich grenzüberschreitend aus.",
    draw: energieVerbund,
  },
  "energie-alltag": {
    title: "Energieanteile im Haushalt",
    caption:
      "Maßstäbliches Schema typischer Anteile eines Haushalts (gerundete Richtwerte).",
    draw: energieAlltag,
  },
  "weimar-verfassung": {
    title: "Die Weimarer Reichsverfassung (1919)",
    caption:
      "Vereinfachtes Verfassungsschema: demokratischer Aufbruch, aber starke Stellung des Reichspräsidenten.",
    draw: weimarVerfassung,
  },
  "weimar-krise": {
    title: "Krise und Radikalisierung 1929–1932",
    caption:
      "Tippe auf die drei Stufen vom Wirtschaftseinbruch bis zur politischen Radikalisierung.",
    draw: weimarKrise,
  },
  "machtuebertragung-1933": {
    title: "Von der Republik in die Diktatur 1933",
    caption:
      "Vier entscheidende Schritte zwischen Januar und Sommer 1933.",
    draw: machtuebertragung1933,
  },
  "krieg-europa-1942": {
    title: "Europa im Zweiten Weltkrieg (Ende 1942)",
    caption:
      "Vereinfachte Skizze des Machtbereichs der Achsenmächte Ende 1942. Kartengrundlage: Natural Earth (gemeinfrei).",
    draw: europe1942Map,
  },
  "wendepunkte-kapitulation": {
    title: "Wendepunkte bis zum 8. Mai 1945",
    caption:
      "Vier Schlüsseljahre vom Ausweiten des Krieges bis zur bedingungslosen Kapitulation.",
    draw: wendepunkteKapitulation,
  },
  "verfolgung-ns": {
    title: "Motive nationalsozialistischer Verfolgung",
    caption:
      "Unterscheidung zwischen rassistischen, ausgrenzenden und politischen Verfolgungsmotiven.",
    draw: verfolgungNs,
  },
  "flucht-vertreibung": {
    title: "Flucht und Vertreibung ab 1944/45",
    caption:
      "Dreischritt von der Flucht vor der Front bis zur schwierigen Integration in den Besatzungszonen.",
    draw: fluchtVertreibung,
  },
  nachkriegsalltag: {
    title: "Alltag in den Nachkriegsjahren",
    caption:
      "Wohnungsnot, Lebensmittelkarten und Neuanfang in zerstörten Städten und auf dem Land.",
    draw: nachkriegsalltag,
  },
  "nuernberger-prozesse": {
    title: "Die Nürnberger Prozesse (1945/46)",
    caption:
      "Drei Grundpfeiler des Internationalen Militärgerichtshofs und seine Bedeutung bis heute.",
    draw: nuernbergerProzesse,
  },
  "kriegsfolgen-heute": {
    title: "Konsequenzen von Krieg bis heute",
    caption:
      "Tippe auf die Felder, um persönliche, örtliche und rechtliche Langzeitfolgen zu erkunden.",
    draw: kriegsfolgenHeute,
  },
  "menschenrechte-grundrechte": {
    title: "Grundrechte und Minderheitenschutz",
    caption:
      "Vom unantastbaren Kern der Menschenwürde (Art. 1 GG) bis zum Schutz von Minderheiten.",
    draw: menschenrechteGrundrechte,
  },
  "propaganda-medien": {
    title: "Medien in Diktatur und Demokratie",
    caption:
      "Vergleich zwischen manipulativer NS-Propaganda und Pressefreiheit nach Art. 5 GG.",
    draw: propagandaMedien,
  },
  "widerstand-ns": {
    title: "Widerstand im Nationalsozialismus",
    caption:
      "Vier Beispiele unterschiedlichen Widerstands aus Gewissen, Glauben oder Verantwortung.",
    draw: widerstandNs,
  },
  "zivilcourage-demokratie": {
    title: "Zivilcourage in der Demokratie",
    caption:
      "Hinsehen im Alltag, rechtliche Wege nutzen und klare Grenzen im Rechtsstaat.",
    draw: zivilcourageDemokratie,
  },
  "besatzungszonen-1945": {
    title: "Besatzungszonen in Deutschland 1945–1949",
    caption:
      "Vereinfachte Skizze der vier Besatzungszonen und der Viermächtestadt Berlin. Kartengrundlage: Natural Earth.",
    draw: germany1945Map,
  },
  verfassungsorgane: {
    title: "Verfassungsorgane der Bundesrepublik",
    caption:
      "Tippe auf die fünf Organe, um Aufgaben und Gewaltenteilung zu vergleichen.",
    draw: verfassungsorgane,
  },
  "gesetzgebung-schema": {
    title: "Sinn der Gesetzgebungsregeln",
    caption:
      "Warum mehrere Lesungen und Zustimmungspflichten Legitimität, Gründlichkeit und Allgemeinwohl sichern.",
    draw: gesetzgebungSchema,
  },
  "politische-teilhabe": {
    title: "Wege politischer Teilhabe",
    caption:
      "Vier Möglichkeiten, wie Bürgerinnen und Bürger — auch schon Jugendliche — Demokratie mitgestalten.",
    draw: politischeTeilhabe,
  },
  "wahlbeteiligung-ursachen": {
    title: "Wahlbeteiligung von Erstwählenden",
    caption:
      "Typische Hürden für junge Wahlberechtigte und was gegen geringere Beteiligung hilft.",
    draw: wahlbeteiligungUrsachen,
  },
  "sozialstaat-saeulen": {
    title: "Sozialstaat und neue Armut",
    caption:
      "Zusammenspiel von Sozialversicherungen, Grundsicherung und Risiken relativer Armut.",
    draw: sozialstaatSaeulen,
  },
  "tafeln-gemeinnuetzig": {
    title: "Gemeinnützige Einrichtungen: Beispiel Tafeln",
    caption:
      "Lebensmittelrettung durch Ehrenamt — und warum sie den Sozialstaat nur ergänzen.",
    draw: tafelnGemeinnuetzig,
  },
  generationenvertrag: {
    title: "Generationenvertrag und demographischer Wandel",
    caption:
      "Umlageprinzip und Verschiebung des Verhältnisses zwischen Erwerbstätigen und Rentenbeziehenden.",
    draw: generationenvertragBild,
  },
  "drei-saeulen-rente": {
    title: "Drei Säulen der Altersvorsorge",
    caption:
      "Gesetzliche Rente, betriebliche und private Altersvorsorge greifen langfristig ineinander.",
    draw: dreiSaeulenRente,
  },
  "landbau-vergleich": {
    title: "Konventioneller vs. ökologischer Landbau",
    caption:
      "Tippe auf eine Spalte, um ökologische, gesellschaftliche und wirtschaftliche Auswirkungen zu prüfen.",
    draw: landbauVergleich,
  },
  "oekolandbau-kosten": {
    title: "Warum Öko-Anbau mehr kostet",
    caption:
      "Drei wesentliche Kostenfaktoren bei nachhaltiger regionaler Erzeugung (M-Zug).",
    draw: oekolandbauKostenBild,
  },
};

export function renderFigure(id: string): string {
  const figure = FIGURES[id];
  if (!figure) return "";
  const markup = figure.draw();
  const hasInteractiveParts = markup.includes('data-part="');
  const explorer = hasInteractiveParts
    ? `<div class="figure-explorer" role="status" aria-live="polite">Tippe oder wähle ein Feld in der Grafik, um die Erklärung anzuzeigen.</div>`
    : "";
  return `<figure class="lesson-figure" data-figure="${esc(id)}">${markup}${explorer}<figcaption><strong>${esc(figure.title)}${figure.title.endsWith(".") ? "" : "."}</strong> ${esc(figure.caption)}</figcaption></figure>`;
}
