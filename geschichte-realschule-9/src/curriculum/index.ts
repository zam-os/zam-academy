import { dictatorship } from "./dictatorship";
import { english } from "./english";
import { imperialism } from "./imperialism";
import { longitudinal } from "./longitudinal";
import { methods } from "./methods";
import { war } from "./war";
import { weimar } from "./weimar";

export { CURRICULUM_URL, SOURCES, STAGES } from "./sources";
export const LESSONS = [
  ...methods,
  ...imperialism,
  ...weimar,
  ...dictatorship,
  ...war,
  ...longitudinal,
  ...english,
];
export const CORE_LESSONS = LESSONS.filter((lesson) => !lesson.optional);
export const findLesson = (id: string) => LESSONS.find((lesson) => lesson.id === id);

// Short, attributed excerpts of actual documents complement the authored exercises.
const constitution = findLesson("g-weimar-verfassung")!;
constitution.sourceIds.push("weimar-art1");
constitution.workshop.sourceExcerpt = {
  title: "Artikel 1 der Weimarer Reichsverfassung · vollständiger Artikel",
  author: "Verfassunggebende Deutsche Nationalversammlung",
  date: "11. August 1919 (Ausfertigung)",
  audience: "Die Bevölkerung und die Staatsorgane des Deutschen Reichs",
  text: "Das Deutsche Reich ist eine Republik. Die Staatsgewalt geht vom Volke aus.",
  sourceId: "weimar-art1",
  context:
    "Eine Verfassungsnorm formuliert den Anspruch der Staatsordnung. Sie ist kein Beleg, dass politische Praxis diesem Anspruch immer entsprach. Prüfe den Anspruch an den folgenden Beispielen.",
};

const destruction = findLesson("g-demokratie-zerstoerung")!;
destruction.sourceIds.push("wels");
destruction.workshop.sourceExcerpt = {
  title: "Otto Wels gegen das Ermächtigungsgesetz · kurzer Redeauszug",
  author: "Otto Wels, SPD-Fraktionsvorsitzender",
  date: "23. März 1933",
  audience: "Reichstagsabgeordnete und Öffentlichkeit",
  text: "Freiheit und Leben kann man uns nehmen, die Ehre nicht.",
  sourceId: "wels",
  context:
    "Wels sprach für die Ablehnung des Gesetzes unter Einschüchterung und Verfolgung. Der Auszug zeigt seine Haltung, nicht die Zustimmung aller Menschen. Ordne die Rede in die Abfolge ein und beziehe sie in dein Urteil über die Abstimmung ein.",
};

findLesson("g-menschenrechte-schutz")!.workshop.sourceExcerpt = {
  title: "Grundgesetz · Artikel 1 Absatz 1 Satz 1",
  author: "Parlamentarischer Rat (Verfassungsgebung)",
  date: "23. Mai 1949 (Verkündung des Grundgesetzes)",
  audience: "Staatsgewalt und Menschen im Geltungsbereich des Grundgesetzes",
  text: "Die Würde des Menschen ist unantastbar.",
  sourceId: "gg",
  context:
    "Der folgende Satz verpflichtet die Staatsgewalt, die Menschenwürde zu achten und zu schützen. Der Normtext formuliert einen verbindlichen Maßstab, nicht die Behauptung, dass Verletzungen unmöglich seien.",
};

const dataLesson = findLesson("g-zeit-und-daten")!;
dataLesson.sourceIds.push("wahlen");
dataLesson.workshop.dataTable = {
  title: "NSDAP bei Reichstagswahlen 1930–1932",
  unit: "Anteil an den gültigen Stimmen in Prozent (auf eine Nachkommastelle gerundet)",
  rows: [
    { label: "14. September 1930", value: 18.3 },
    { label: "31. Juli 1932", value: 37.3 },
    { label: "6. November 1932", value: 33.1 },
  ],
  sourceId: "wahlen",
  note: "Die Abstände zwischen den Wahlen sind unterschiedlich lang. Die Werte zeigen Wahlergebnisse, keine individuellen Motive. Für Aussagen über Arbeitslosigkeit wären zusätzliche Daten nötig. Beschreibe auch den Rückgang zwischen Juli und November 1932.",
};
