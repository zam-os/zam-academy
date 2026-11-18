/**
 * Registry of all 47 lesson figures (illustrations + Natural Earth historical maps)
 * plus the Lernpfad panorama and Nachschlagen timeline.
 */
import { esc } from "../workshop";
import {
  judaeaDiasporaKarte,
  mapEgypt,
  mapFrankenreich800,
  mapGreeceLandesnatur,
} from "./maps";
import {
  altsteinzeitLager,
  feuerTechnikWirkung,
  geschichtsbuchAufbau,
  gesellschaftspyramideAegypten,
  hieroglyphenPapyrus,
  hochkulturStern,
  kriterienKarte,
  monarchieMerkmale,
  nilKalenderRad,
  quellenartenGrid,
  steinzeitWandel,
  totengerichtSzene,
  ueberrestTradition,
  zeitdimensionen,
} from "./scenes-urgeschichte-aegypten";
import {
  athenVsHeute,
  dreiHerrschaftsformen,
  griechischeKulturSpuren,
  hatschepsutSpielraum,
  hellenismusKultur,
  herrscherbildnisAnalyse,
  migrationVergleich,
  ostrakonSzene,
  polisAufbau,
  saeulenVaseQuelle,
  themistoklesHandlung,
  triereUrsacheWirkung,
  verfassungswegAthen,
} from "./scenes-griechenland-biografien";
import {
  christentumZeitleiste,
  cursusHonorum,
  diasporaWandel,
  expansionFolgen,
  republikZumPrinzipat,
  romMythosVsForschung,
  romanisierungAlltag,
} from "./scenes-rom";
import {
  athenOikosGrundriss,
  dreiteilungMittelmeer,
  dreiWurzelnFranken,
  epochengrenzenKandidaten,
  familienformenHeute,
  gesamtZeitleiste,
  gesellschaftUndFamilie,
  heroPanorama,
  islamGrundlagen,
  roemischeFamiliaNetz,
  voelkerwanderungAnfuehrungszeichen,
} from "./scenes-mittelalter-familie";

export interface Figure {
  caption: string;
  render: () => string;
}

export const FIGURES: Record<string, Figure> = {
  zeitdimensionen: {
    caption: "Vergangenheit, Gegenwart und Zukunft greifen ineinander.",
    render: zeitdimensionen,
  },
  geschichtsbuchAufbau: {
    caption: "Im Geschichtsbuch stehen zeitgenössische Quellen neben heutigen Darstellungstexten.",
    render: geschichtsbuchAufbau,
  },
  quellenartenGrid: {
    caption: "Geschichtswissenschaftler unterscheiden vier Arten von Quellen.",
    render: quellenartenGrid,
  },
  ueberrestTradition: {
    caption: "Überreste stammen aus dem Alltag; Überlieferungen (Traditionen) wurden bewusst verfasst.",
    render: ueberrestTradition,
  },
  altsteinzeitLager: {
    caption: "Jäger und Sammler der Altsteinzeit lebten in kleinen Gruppen und folgten den Tierherden.",
    render: altsteinzeitLager,
  },
  feuerTechnikWirkung: {
    caption: "Feuer, Werkzeug und Behausung prägten Alltag, Sicherheit und Zusammenleben.",
    render: feuerTechnikWirkung,
  },
  steinzeitWandel: {
    caption: "Ackerbau, Viehzucht und Sesshaftigkeit veränderten das Leben grundlegend.",
    render: steinzeitWandel,
  },
  mapEgypt: {
    caption: "Naturraum des Alten Ägypten auf Basis von Natural-Earth-Geodaten.",
    render: mapEgypt,
  },
  kriterienKarte: {
    caption: "Ein knapper Kriterienkatalog hilft beim systematischen Lesen jeder Geschichtskarte.",
    render: kriterienKarte,
  },
  nilKalenderRad: {
    caption: "Der jährliche Rhythmus der Nilflut teilte Arbeit und Kalender in drei Zeiten.",
    render: nilKalenderRad,
  },
  hochkulturStern: {
    caption: "Fünf Merkmale zeigen, warum das Alte Ägypten als frühe Hochkultur gilt.",
    render: hochkulturStern,
  },
  hieroglyphenPapyrus: {
    caption: "Schrift und Papyrus machten Verwaltung, Recht und Geschichtsüberlieferung möglich.",
    render: hieroglyphenPapyrus,
  },
  totengerichtSzene: {
    caption: "Der Glaube an das Totengericht prägte Bestattung, Tempel und Pyramiden.",
    render: totengerichtSzene,
  },
  gesellschaftspyramideAegypten: {
    caption: "Die ägyptische Gesellschaft war streng abgestuft mit dem Pharao an der Spitze.",
    render: gesellschaftspyramideAegypten,
  },
  monarchieMerkmale: {
    caption: "Merkmale der ägyptischen Monarchie – und wie man sie heute beurteilen kann.",
    render: monarchieMerkmale,
  },
  mapGreeceLandesnatur: {
    caption: "Gebirge und Meer trennten und verbanden die griechischen Stadtstaaten (Natural Earth).",
    render: mapGreeceLandesnatur,
  },
  polisAufbau: {
    caption: "Eine Polis umfasste befestigte Stadt (Akropolis, Agora) und das zugehörige Umland.",
    render: polisAufbau,
  },
  migrationVergleich: {
    caption: "Antike Kolonisation und moderne Migration teilen Suche nach Chancen, unterscheiden sich aber in Form und Kontext.",
    render: migrationVergleich,
  },
  griechischeKulturSpuren: {
    caption: "Mythen, Sport, Theater und Säulenbaukunst stifteten griechische Gemeinsamkeit bis heute.",
    render: griechischeKulturSpuren,
  },
  saeulenVaseQuelle: {
    caption: "Gegenständliche und bildliche Quellen aus Griechenland (Säulenordnungen und Amphore).",
    render: saeulenVaseQuelle,
  },
  verfassungswegAthen: {
    caption: "Von Solon über Kleisthenes zu Perikles wuchs die Mitbestimmung der Bürger in Athen.",
    render: verfassungswegAthen,
  },
  ostrakonSzene: {
    caption: "Mit Tonscherben (Ostraka) schützte sich Athen vor neuer Alleinherrschaft.",
    render: ostrakonSzene,
  },
  triereUrsacheWirkung: {
    caption: "Der Einsatz der einfachen Ruderer bei Salamis (480 v. Chr.) stärkte ihre Rolle in der Polis.",
    render: triereUrsacheWirkung,
  },
  athenVsHeute: {
    caption: "Die attische Demokratie erfand Bürgerbeteiligung, schloss aber die große Mehrheit aus.",
    render: athenVsHeute,
  },
  herrscherbildnisAnalyse: {
    caption: "Kriterienkatalog zur Untersuchung eines antiken Herrscherbildnisses.",
    render: herrscherbildnisAnalyse,
  },
  hatschepsutSpielraum: {
    caption: "Auch als Pharaonin bewegte sich Hatschepsut zwischen großen Möglichkeiten und festen Grenzen.",
    render: hatschepsutSpielraum,
  },
  themistoklesHandlung: {
    caption: "Politik in Athen verlangte Mehrheiten – und kannte die Verbannung per Scherbengericht.",
    render: themistoklesHandlung,
  },
  hellenismusKultur: {
    caption: "Alexanders Feldzug veränderte die alte Welt, stieß aber an Grenzen von Raum und Dauer.",
    render: hellenismusKultur,
  },
  dreiHerrschaftsformen: {
    caption: "Drei Persönlichkeiten im historischen Vergleich nach Zeit und Herrschaftsform.",
    render: dreiHerrschaftsformen,
  },
  romMythosVsForschung: {
    caption: "Der Gründungsmythos von Romulus und Remus steht neben den archäologischen Befunden.",
    render: romMythosVsForschung,
  },
  cursusHonorum: {
    caption: "Ämterlaufbahn und Verfassungsprinzipien sollten in der Republik Alleinherrschaft verhindern.",
    render: cursusHonorum,
  },
  expansionFolgen: {
    caption: "Die Ausdehnung zum Weltreich veränderte Wirtschaft, Heer und Politik in Rom.",
    render: expansionFolgen,
  },
  republikZumPrinzipat: {
    caption: "Unter Augustus entstand hinter republikanischen Titeln die dauerhafte Kaiserherrschaft.",
    render: republikZumPrinzipat,
  },
  romanisierungAlltag: {
    caption: "In den Provinzen Raetien und Noricum entstanden Straßen, Städte, Thermen und der Limes.",
    render: romanisierungAlltag,
  },
  judaeaDiasporaKarte: {
    caption: "Ausbreitung jüdischer Gemeinden im Mittelmeerraum nach 70 n. Chr. (Natural Earth).",
    render: judaeaDiasporaKarte,
  },
  diasporaWandel: {
    caption: "Nach der Zerstörung des Jerusalemer Tempels blieb das Judentum in der Diaspora verbunden.",
    render: diasporaWandel,
  },
  christentumZeitleiste: {
    caption: "Vom verbotenen Glauben zur Duldung 313 n. Chr. und Staatsreligion um 380/391 n. Chr.",
    render: christentumZeitleiste,
  },
  voelkerwanderungAnfuehrungszeichen: {
    caption: "Warum die Forschung heute den Begriff „Völkerwanderung“ differenziert betrachtet.",
    render: voelkerwanderungAnfuehrungszeichen,
  },
  dreiteilungMittelmeer: {
    caption: "Aus dem Römischen Reich entwickelten sich drei große Kultur- und Herrschaftsräume.",
    render: dreiteilungMittelmeer,
  },
  islamGrundlagen: {
    caption: "Die fünf Säulen des Islam und der kulturelle Aufschwung im Kalifenreich.",
    render: islamGrundlagen,
  },
  dreiWurzelnFranken: {
    caption: "Das Frankenreich verband germanische, römische und christliche Traditionen.",
    render: dreiWurzelnFranken,
  },
  mapFrankenreich800: {
    caption: "Das karolingische Großreich um 800 auf Basis von Natural-Earth-Geodaten.",
    render: mapFrankenreich800,
  },
  epochengrenzenKandidaten: {
    caption: "Ein Epochenübergang lässt sich nicht an einem einzigen Datum festmachen.",
    render: epochengrenzenKandidaten,
  },
  athenOikosGrundriss: {
    caption: "Wohnräume und Rollenverteilung im athenischen Oikos spiegelten die Polis-Ordnung.",
    render: athenOikosGrundriss,
  },
  roemischeFamiliaNetz: {
    caption: "Zur römischen familia zählten Eltern, Kinder, Unfreie und Freigelassene unter dem Hausvater.",
    render: roemischeFamiliaNetz,
  },
  familienformenHeute: {
    caption: "Rechtliche Gleichberechtigung und vielfältige Familienformen prägen die Gegenwart.",
    render: familienformenHeute,
  },
  gesellschaftUndFamilie: {
    caption: "Im Längsschnitt zeigen Familienrollen, wie sich die ganze Gesellschaft gewandelt hat.",
    render: gesellschaftUndFamilie,
  },
};

export function renderFigure(id: string): string {
  const figure = FIGURES[id];
  if (!figure) return "";
  return `<figure class="lesson-figure" data-figure="${esc(id)}">${figure.render()}<figcaption><strong>Abbildung</strong> · ${esc(figure.caption)}</figcaption></figure>`;
}

export { gesamtZeitleiste, heroPanorama };
