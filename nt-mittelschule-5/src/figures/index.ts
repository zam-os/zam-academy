/**
 * Every drawing a lesson can show, by id. A lesson lists its ids in `figures`;
 * the tests check that each id exists and renders an accessible SVG.
 */
import { esc } from "../workshop";
import {
  darstellungsformen,
  forscherweg,
  gefahrstoffPiktogramme,
  laborgeraete,
  modellVergleich,
  versuchsprotokoll,
} from "./scenes-lb1";
import {
  hautAufbau,
  hauttypenUv,
  kameraUndAuge,
  lichtSchatten,
  prismaFarben,
  reflexionToterWinkel,
  sonneEnergie,
  tagUndNacht,
  thermometerBau,
  waermeAlltag,
  waermetransport,
} from "./scenes-lb2";
import {
  gelenktypen,
  gesunderAlltag,
  haltungUndHeben,
  naehrstoffPyramide,
  organsystemeTafel,
  skelettUeberblick,
  verdauungsweg,
  wirbelsaeuleSform,
  zuckergehaltCheck,
} from "./scenes-lb3";
import {
  aggregatAlltag,
  reinstoffGemische,
  stoffSteckbrief,
  trennverfahrenLabor,
  wertstoffSortierung,
} from "./scenes-lb4";

export interface FigureDef {
  title: string;
  caption: string;
  draw: () => string;
}

export const FIGURES: Record<string, FigureDef> = {
  forscherweg: {
    title: "Der naturwissenschaftliche Erkenntnisweg",
    caption:
      "Von der Beobachtung im Alltag Schritt für Schritt zur begründeten Auswertung.",
    draw: forscherweg,
  },
  laborgeraete: {
    title: "Wichtige Laborgeräte in Klasse 5",
    caption:
      "Vereinfachte Übersicht: Im Unterricht nutzt du diese Geräte stets nach Anleitung.",
    draw: laborgeraete,
  },
  versuchsprotokoll: {
    title: "Aufbau eines Versuchsprotokolls",
    caption:
      "Beobachtung (was man wahrnimmt) und Auswertung (was man daraus schließt) bleiben klar getrennt.",
    draw: versuchsprotokoll,
  },
  "gefahrstoff-piktogramme": {
    title: "Gefahrstoffpiktogramme und Laborregeln",
    caption:
      "Symbole warnen schnell vor Gefahren. Schutzregeln gelten immer vor Beginn eines Versuchs.",
    draw: gefahrstoffPiktogramme,
  },
  "modell-vergleich": {
    title: "Modell und Wirklichkeit",
    caption:
      "Jedes Modell hebt bestimmte Zusammenhänge hervor und lässt andere Details weg.",
    draw: modellVergleich,
  },
  darstellungsformen: {
    title: "Tabelle, Diagramm und Fachsprache",
    caption:
      "Messgrößen erhalten in Tabellenköpfen und an Achsen immer ihre passende Einheit.",
    draw: darstellungsformen,
  },
  "tag-und-nacht": {
    title: "Tag und Nacht auf der Erde",
    caption:
      "Die Sonne beleuchtet immer eine Hälfte der sich drehenden Erde.",
    draw: tagUndNacht,
  },
  "sonne-energie": {
    title: "Umwandlung von Sonnenenergie",
    caption:
      "Strahlungsenergie lässt sich mit Spiegeln, Kollektoren oder Solarzellen gezielt umwandeln.",
    draw: sonneEnergie,
  },
  "thermometer-bau": {
    title: "Thermometer und Celsiusskala",
    caption:
      "Die Fixpunkte schmelzendes Eis (0 °C) und siedendes Wasser (100 °C) machen Messungen vergleichbar.",
    draw: thermometerBau,
  },
  "waerme-alltag": {
    title: "Wärmeleiter und Isolatoren",
    caption:
      "Kochgeschirr verbindet gut leitende Metalle mit isolierenden Griffen aus Holz oder Kunststoff.",
    draw: waermeAlltag,
  },
  waermetransport: {
    title: "Wärmeleitung, Strömung und Strahlung",
    caption:
      "Bei jedem Temperaturausgleich wandert Wärme von der höheren zur niedrigeren Temperatur.",
    draw: waermetransport,
  },
  "haut-aufbau": {
    title: "Aufbau der Haut",
    caption:
      "Vereinfachter Querschnitt durch Oberhaut, Lederhaut und Unterhaut.",
    draw: hautAufbau,
  },
  "hauttypen-uv": {
    title: "Hauttypen und UV-Schutz",
    caption:
      "Die Eigenschutzzeit unterscheidet sich je nach Hauttyp stark; zusätzlicher Schutz ist in der Sonne immer nötig.",
    draw: hauttypenUv,
  },
  "licht-schatten": {
    title: "Geradliniges Licht und Schatten",
    caption:
      "Hinter einem undurchsichtigen Körper entsteht ein Schattenraum, weil Licht nicht um die Ecke biegt.",
    draw: lichtSchatten,
  },
  "reflexion-toter-winkel": {
    title: "Reflexion und toter Winkel",
    caption:
      "Spiegel werfen Licht gesetzmäßig zurück; dennoch bleiben neben Lkw gefährliche tote Winkel.",
    draw: reflexionToterWinkel,
  },
  "prisma-farben": {
    title: "Spektralfarben und Körperfarben",
    caption:
      "Ein Prisma fächert weißes Licht auf; farbige Oberflächen reflektieren nur ihren Farbanteil.",
    draw: prismaFarben,
  },
  "kamera-und-auge": {
    title: "Bildentstehung auf der Netzhaut",
    caption:
      "Durch die Sammellinse des Auges entsteht auf der Netzhaut zunächst ein umgekehrtes, verkleinertes Bild.",
    draw: kameraUndAuge,
  },
  "organsysteme-tafel": {
    title: "Wichtige Organsysteme des Menschen",
    caption:
      "Atmung, Kreislauf, Verdauung und Nervensystem greifen ständig ineinander.",
    draw: organsystemeTafel,
  },
  "gesunder-alltag": {
    title: "Gesunde Lebensführung im Alltag",
    caption:
      "Schlaf, Bewegung, Hygiene und Pausen wirken zusammen für körperliche und geistige Erholung.",
    draw: gesunderAlltag,
  },
  verdauungsweg: {
    title: "Stationen der Verdauung",
    caption:
      "Vom Kauen im Mund bis zur Aufnahme der Nährstoffe im Dünndarm und der Eindickung im Dickdarm.",
    draw: verdauungsweg,
  },
  "naehrstoff-pyramide": {
    title: "Nährstoffe und Energieversorgung",
    caption:
      "Die Verdauung zerlegt Nahrung in kleine Grundbausteine, die den Körper mit Energie und Baustoffen versorgen.",
    draw: naehrstoffPyramide,
  },
  "zuckergehalt-check": {
    title: "Zucker und Essgewohnheiten prüfen",
    caption:
      "Viele süße Snacks und Getränke liefern versteckten Zucker, aber kaum Vitamine.",
    draw: zuckergehaltCheck,
  },
  "skelett-ueberblick": {
    title: "Das Skelett stützt und schützt",
    caption:
      "Knochen geben dem Körper Form und schützen empfindliche Organe wie Gehirn, Herz und Lunge.",
    draw: skelettUeberblick,
  },
  "wirbelsaeule-sform": {
    title: "Doppel-S-Form der Wirbelsäule",
    caption:
      "Im Vergleich zu einem geraden Stab federn die Krümmungen und Bandscheiben jeden Schritt weich ab.",
    draw: wirbelsaeuleSform,
  },
  gelenktypen: {
    title: "Gelenkformen und Gelenkaufbau",
    caption:
      "Die Form eines Gelenks bestimmt, in welche Richtungen sich ein Körperteil bewegen lässt.",
    draw: gelenktypen,
  },
  "haltung-und-heben": {
    title: "Rückenfreundlich heben und tragen",
    caption:
      "Gerader Rücken, Beinarbeit beim Heben und Bewegung beugen Haltungsschäden vor.",
    draw: haltungUndHeben,
  },
  "reinstoff-gemische": {
    title: "Reinstoffe und Stoffgemische",
    caption:
      "Im Teilchenmodell unterscheidet sich ein Reinstoff durch nur eine einzige Teilchensorte vom Gemisch.",
    draw: reinstoffGemische,
  },
  "aggregat-alltag": {
    title: "Aggregatzustände und Übergänge",
    caption:
      "Fest, flüssig und gasförmig zeigen typische Formen und Volumen – abhängig von der Temperatur.",
    draw: aggregatAlltag,
  },
  "stoff-steckbrief": {
    title: "Stoffeigenschaften vergleichen",
    caption:
      "An eindeutigen Kenneigenschaften wie Löslichkeit, Magnetismus und Leitfähigkeit lassen sich Stoffe unterscheiden.",
    draw: stoffSteckbrief,
  },
  "trennverfahren-labor": {
    title: "Trennverfahren im Labor",
    caption:
      "Jedes Trennverfahren nutzt eine andere Stoffeigenschaft wie Teilchengröße oder Verdampfungsverhalten.",
    draw: trennverfahrenLabor,
  },
  "wertstoff-sortierung": {
    title: "Müll als Stoffgemisch trennen",
    caption:
      "Auslesen, Magnettrennen und Windsichten gewinnen wertvolle Rohstoffe aus Abfall zurück.",
    draw: wertstoffSortierung,
  },
};

export function renderFigure(id: string): string {
  const figure = FIGURES[id];
  if (!figure) return "";
  return `<figure class="lesson-figure">${figure.draw()}<figcaption><strong>${esc(figure.title)}</strong> · ${esc(figure.caption)}</figcaption></figure>`;
}
