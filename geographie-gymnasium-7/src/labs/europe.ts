import { europeMap, portsMap, regionsMap } from "../figures/maps";
import { climateChart, climateTable, coastProfile, comparisonBars, plateProfile, processFigure } from "../figures/models";
import type { LabId } from "../model/types";
import { esc } from "../workshop";
import { choice, num, range, readout, str, type LabDef, type LabState } from "./core";

interface Scenario {
  label: string;
  goal: string;
  draw: () => string;
  observation: string;
  question: string;
  answers: [correct: string, wrong1: string, wrong2: string];
  hint: string;
}

function scenarios(
  id: LabId, title: string, intro: string,
  cases: [Scenario, Scenario, Scenario], note: string, initialDrawing: () => string,
): LabDef {
  const key = "scenario";
  const answerKey = (index: number) => `answer-${index}`;
  const goal = (entry: Scenario, i: number) => ({
    text: entry.goal,
    reached: (state: LabState) => str(state, answerKey(i)) === "0",
  });
  return {
    id, title, intro, note,
    initial: () => ({ [key]: "" }),
    goals: [goal(cases[0], 0), goal(cases[1], 1), goal(cases[2], 2)],
    witnesses: [
      { [key]: "0", [answerKey(0)]: "0" },
      { [key]: "1", [answerKey(1)]: "0" },
      { [key]: "2", [answerKey(2)]: "0" },
    ],
    render: (state) => {
      const selected = str(state, key);
      const controls = choice(key, "Modellansicht", selected,
        cases.map(({ label }, i) => [String(i), label]));
      const index = cases.findIndex((_, i) => selected === String(i));
      if (index === -1) return controls + initialDrawing();
      const current = cases[index];
      const answer = state[answerKey(index)];
      const options = [0, 1, 2].map((offset): [string, string] => {
        const i = (offset + index + 1) % 3;
        return [String(i), current.answers[i]];
      });
      const feedback = answer === "0"
        ? readout(esc(current.observation), "good")
        : answer === undefined ? "" : readout(esc(current.hint), "warn");
      return controls + current.draw() + choice(answerKey(index), current.question, answer, options) + feedback;
    },
  };
}

const baseMap = () => europeMap("Europakarte ohne zusätzliche Kartenebene");

export const kartenebenen = scenarios(
  "kartenebenen", "Ebenen ein- und ausblenden", "Wechsle die Ansicht und vergleiche, welche Informationen sichtbar werden.",
  [
    { label: "Umrisse", goal: "Erkenne die Orientierungspunkte der Karte ohne Ortsmarker.", draw: baseMap,
      question: "Woran kannst du dich hier orientieren?",
      answers: ["Küsten und Grenzen", "Hafensymbole", "Schifffahrtsrouten"],
      hint: "Suche Linien zwischen Land und Wasser sowie zwischen Ländern.",
      observation: "Küsten und Grenzen geben Orientierung. Hafenstandorte lassen sich aus den Umrissen allein nicht genau ablesen." },
    { label: "Orte", goal: "Finde Rotterdam und Duisburg.", draw: () => portsMap(false),
      question: "Welcher der beiden Orte liegt im Binnenland?",
      answers: ["Duisburg", "Rotterdam", "Beide liegen direkt an der Küste"],
      hint: "Vergleiche den Abstand der beiden Punkte zur Nordsee.",
      observation: "Rotterdam liegt nahe der Nordsee. Duisburg liegt im Binnenland." },
    { label: "Verbindungen", goal: "Unterscheide Seeweg und Hinterlandverbindung.", draw: () => portsMap(),
      question: "Was zeigt die violette Linie?",
      answers: ["Die Verbindung von Rotterdam ins Hinterland", "Den Seeweg nach Hamburg", "Die Grenze der Niederlande"],
      hint: "Folge der Linie von der Küste nach Osten zum letzten Punkt.",
      observation: "Die blaue Route liegt auf See. Die violette Linie veranschaulicht eine Verbindung zwischen Hafen und Binnenland." },
  ], "Routen sind schematisch. Die Karte zeigt keine Fahrpläne und keine exakten Distanzen.", baseMap,
);

export const teilraeume = scenarios(
  "teilraeume", "Teilräume auf der Karte finden", "Hebe Beispiele aus drei Teilräumen hervor.",
  [
    { label: "Norden", goal: "Finde unter den nördlichen Beispielen den Inselstaat.", draw: () => regionsMap("north"),
      question: "Welches markierte Land liegt westlich der Skandinavischen Halbinsel auf einer Insel?",
      answers: ["Island", "Norwegen", "Finnland"],
      hint: "Suche die markierte Insel links von Norwegen.",
      observation: "Norwegen liegt an der Westseite der Skandinavischen Halbinsel. Island liegt weiter westlich im Nordatlantik." },
    { label: "Südwesten", goal: "Verorte Portugal zwischen Halbinsel und Ozean.", draw: () => regionsMap("southwest"),
      question: "Welches Meer liegt westlich von Portugal?",
      answers: ["Der Atlantik", "Das Mittelmeer", "Die Nordsee"],
      hint: "Die Westküste Portugals zeigt zum offenen Ozean.",
      observation: "Portugal grenzt an den Atlantik. Spanien reicht bis zum Mittelmeer." },
    { label: "Mitte", goal: "Beschreibe die Lage Tschechiens zu Polen.", draw: () => regionsMap("centre"),
      question: "In welcher Richtung liegt Tschechien von Polen aus?",
      answers: ["Südlich", "Nördlich", "Westlich"],
      hint: "Lies den Nordpfeil und vergleiche die beiden Ländernamen.",
      observation: "Tschechien liegt östlich von Deutschland und südlich von Polen." },
  ], "Die hervorgehobenen Länder bilden Beispiele. Teilräume haben keine verbindlichen Verwaltungsgrenzen.", baseMap,
);

const diagramStart = () => processFigure("So liest du das Klimadiagramm", ["Linie", "Säulen"], ["Temperaturmittel", "Niederschlag"]);
export const klimavergleich = scenarios(
  "klimavergleich", "Drei Klimamuster im Vergleich", "Wechsle den Standort und achte auf die roten Linien und blauen Säulen.",
  [
    { label: "Atlantikküste", goal: "Untersuche eine kleine Jahresspanne.", draw: () => climateChart("coast") + climateTable("coast"),
      question: "Wie groß ist die Temperaturspanne im Küstenmodell?",
      answers: ["11 °C", "16 °C", "21 °C"],
      hint: "Ziehe den niedrigsten Wert von der höchsten Stelle der Linie ab.",
      observation: "5 °C bis 16 °C ergeben 11 °C Spanne. Die Temperatur ändert sich vergleichsweise wenig." },
    { label: "Landesinneres", goal: "Untersuche eine größere Jahresspanne.", draw: () => climateChart("inland") + climateTable("inland"),
      question: "Was unterscheidet das Landesinnere von der Atlantikküste?",
      answers: ["Die Temperaturspanne ist größer", "Die Temperaturspanne ist kleiner", "Der Winter ist milder"],
      hint: "Vergleiche die Tiefpunkte und Spitzen beider Linien.",
      observation: "−4 °C bis 21 °C ergeben 25 °C Spanne. Der Sommer ist wärmer, der Winter kälter als im Küstenmodell." },
    { label: "Mittelmeerküste", goal: "Finde die niederschlagsarme Jahreszeit.", draw: () => climateChart("south") + climateTable("south"),
      question: "Welche Jahreszeit ist im Mittelmeermodell am trockensten?",
      answers: ["Sommer", "Herbst", "Winter"],
      hint: "Die Niederschlagsmenge erkennst du an den blauen Säulen.",
      observation: "Im Juli fallen im Modell 7 mm, im November 76 mm. Der Sommer ist deutlich trockener." },
  ], "Die Daten sind didaktische Modelle. Die beiden y-Achsen verwenden unterschiedliche Einheiten und Skalen.", diagramStart,
);

export const plattengrenzen = scenarios(
  "plattengrenzen", "Was passiert an einer Plattengrenze?", "Vergleiche die Bewegungsrichtungen und schau, wo Magma aufsteigt.",
  [
    { label: "Auseinander", goal: "Erkunde eine auseinanderlaufende Grenze.", draw: () => plateProfile("apart"),
      question: "Wo kann sich in der Zeichnung neue Kruste bilden?",
      answers: ["In der Mitte am aufsteigenden Magma", "Am äußeren Rand der Platten", "Unter der tiefer schiebenden Platte"],
      hint: "Beobachte, wohin die Pfeile zeigen und wo die orange Form liegt.",
      observation: "Zwischen den auseinanderdriftenden Platten kann Magma aufsteigen und neue Kruste bilden." },
    { label: "Aufeinander zu", goal: "Erkunde eine Subduktionszone.", draw: () => plateProfile("under"),
      question: "Welche Platte taucht im gezeigten Schnitt ab?",
      answers: ["Die Platte von links", "Die Platte von rechts", "Beide gleich steil"],
      hint: "Folge der abfallenden Linie vom linken Rand aus.",
      observation: "Eine Platte sinkt ab. Freigesetztes Wasser erleichtert das Schmelzen im Mantel darüber." },
    { label: "Aneinander vorbei", goal: "Erkunde eine seitliche Verschiebung.", draw: () => plateProfile("past"),
      question: "Was erklärt hier ein Erdbeben?",
      answers: ["Die Plattenbewegung löst Spannungen ruckartig", "Neue Kruste wächst am Rücken", "Eine Platte sinkt tief unter die andere"],
      hint: "Die Platten bleiben nebeneinander, die Pfeile zeigen seitlich.",
      observation: "Die Platten gleiten seitlich aneinander vorbei. Verhaken und Lösen kann Erdbeben auslösen." },
  ], "Die Schnitte sind stark vereinfacht und nicht maßstäblich. Die seitliche Verschiebung zeigt eine Draufsicht.",
  () => processFigure("Platten bewegen sich", ["Auseinander", "Aufeinander zu", "Seitlich"], ["Kruste entsteht", "Platte taucht ab", "Platten gleiten"]),
);

export const bewasserung: LabDef = {
  id: "bewasserung", title: "Wasserbilanz einer Modellregion",
  intro: "Verändere bewässerte Fläche und Entnahme pro Hektar. Vergleiche die Gesamtentnahme mit der Grundwasserneubildung.",
  note: "Die Neubildung bleibt im Modell konstant bei 100 Wassereinheiten. Wetter, Abflüsse und zusätzliche Nutzer fehlen.",
  initial: () => ({ area: 10, water: 10 }),
  goals: [
    { text: "Erreiche eine Entnahme unter 100 Einheiten.", reached: (state) => num(state, "area") * num(state, "water") < 100 },
    { text: "Erreiche eine Entnahme über 100 Einheiten.", reached: (state) => num(state, "area") * num(state, "water") > 100 },
    { text: "Senke die Entnahme von 10 auf 8 Einheiten je Hektar und verbrauche insgesamt trotzdem mehr als vorher.",
      reached: (state) => num(state, "water") === 8 && num(state, "area") * 8 > 100 },
  ],
  witnesses: [{ area: 10, water: 8 }, { area: 12, water: 10 }, { area: 15, water: 8 }],
  render: (state) => {
    const area = num(state, "area"), water = num(state, "water");
    const withdrawal = area * water;
    return range("area", "Bewässerte Fläche", area, 5, 18, 1, `${area} ha`)
      + range("water", "Entnahme je Hektar", water, 5, 14, 1, `${water} Einheiten`)
      + comparisonBars("Wasserbilanz", [["Neubildung", 100], ["Entnahme", withdrawal]], "", 252)
      + readout(`Gesamtentnahme: ${area} · ${water} = ${withdrawal} Einheiten. ${withdrawal > 100 ? "Der Vorrat nimmt im Modell ab." : withdrawal < 100 ? "Die Entnahme liegt unter der Neubildung." : "Entnahme und Neubildung sind gleich groß."}`);
  },
};

export const standort = scenarios(
  "standort", "Zwei Standorte, drei Nutzungen", "Wechsle die Nutzung und vergleiche die Eignung zweier fiktiver Standorte.",
  [
    { label: "Güterlager", goal: "Vergleiche die Standorte für ein Güterlager.",
      draw: () => comparisonBars("Eignung für Güterlogistik", [["Güterbahnhof", 8], ["Uni-Quartier", 3]], "von 10", 10),
      question: "Welcher Standort passt besser zum Güterlager?",
      answers: ["Güterbahnhof", "Uni-Quartier", "Beide gleich gut"],
      hint: "Vergleiche die Balken und denke an die Menge der Güter pro Fahrt.",
      observation: "Der Güterbahnhof bietet mehr Lagerfläche und kürzere Wege zum Güterzug." },
    { label: "Labor", goal: "Vergleiche die Standorte für ein Forschungslabor.",
      draw: () => comparisonBars("Eignung für Laborforschung", [["Güterbahnhof", 2], ["Uni-Quartier", 9]], "von 10", 10),
      question: "Welchen Vorteil hat das Uni-Quartier für das Labor?",
      answers: ["Kurze Wege zu Partnerlaboren", "Mehr Platz für Container", "Gleise für schwere Güterzüge"],
      hint: "Gewichte Kontakte zwischen Forschungsteams.",
      observation: "Das Uni-Quartier bietet kurze Wege zu Partnerlaboren und Hochschulen." },
    { label: "Digitales Team", goal: "Prüfe einen Fall mit geringerem Vorteil der Hochschulnähe.",
      draw: () => comparisonBars("Eignung für ein digitales Team", [["Güterbahnhof", 7], ["Uni-Quartier", 6]], "von 10", 10),
      question: "Welcher Faktor kann im digitalen Team weniger wichtig werden?",
      answers: ["Ein kurzer täglicher Weg zur Hochschule", "Ein zuverlässiges Datennetz", "Bezahlbare Büroräume"],
      hint: "Vergleiche, welche Wege durch digitale Zusammenarbeit seltener nötig sind.",
      observation: "Beide Standorte haben ein schnelles Netz. Der günstigere Standort gewinnt leicht, wenn tägliche Wege zur Hochschule weniger wichtig sind." },
  ], "Die Punktwerte sind für den Vergleich gesetzt. Eine echte Entscheidung bräuchte geprüfte Daten und offen gewichtete Kriterien.",
  () => processFigure("Zwei Modellstandorte", ["Güterbahnhof", "Uni-Quartier"], ["viel Fläche", "nahe bei Laboren"]),
);

export const watt = scenarios(
  "watt", "Wann fällt das Watt trocken?", "Vergleiche Niedrigwasser, steigendes Wasser und Hochwasser im Küstenprofil.",
  [
    { label: "Niedrigwasser", goal: "Finde trockenfallende Wattflächen.", draw: () => coastProfile("low"),
      question: "Welche Fläche wird bei Niedrigwasser frei?",
      answers: ["Große Bereiche des Watts", "Der freigelegte Meeresboden der ganzen Nordsee", "Nur die Flächen hinter dem Deich"],
      hint: "Vergleiche die Lage der Wattfläche mit der blauen Wasseroberfläche.",
      observation: "Große Wattflächen liegen frei und können Vögeln als Nahrungsraum dienen." },
    { label: "Steigendes Wasser", goal: "Beobachte, wie sich die freie Fläche verkleinert.", draw: () => coastProfile("rising"),
      question: "Wie ändert sich der Anteil des trocken sichtbaren Watts bei steigendem Wasser?",
      answers: ["Er nimmt ab", "Er nimmt zu", "Er bleibt gleich, bis Hochwasser erreicht ist"],
      hint: "Suche die neue Grenze zwischen blauem Wasser und trockenem Watt.",
      observation: "Wasser breitet sich über flache Sedimente aus. Von oben wäre weniger trockenes Watt sichtbar." },
    { label: "Hochwasser", goal: "Vergleiche die Grenze von Watt und Salzwiese.", draw: () => coastProfile("high"),
      question: "Welcher Bereich liegt im Modell höher als das Watt?",
      answers: ["Die Salzwiese", "Die Fahrrinne der Nordsee", "Die überflutete Wattfläche"],
      hint: "Vergleiche die Höhen der beschrifteten Flächen im Profil.",
      observation: "Ein großer Teil des Watts ist überspült. Salzverträgliche Pflanzen besiedeln höher gelegene Flächen." },
  ], "Das Modell enthält keine Zeiten. Wattflächen werden örtlich verschieden schnell überflutet.",
  () => processFigure("Gezeiten am Watt", ["Niedrigwasser", "Steigendes Wasser", "Hochwasser"], ["Watt fällt trocken", "freie Fläche schrumpft", "Watt überspült"]),
);
