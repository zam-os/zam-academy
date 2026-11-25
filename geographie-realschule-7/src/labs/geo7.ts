/**
 * The labs of Geographie 7 Realschule. Scenario labs ask one question per
 * view (a goal is reached by the correct answer); model labs compute a
 * readout from sliders. Every lab has three goals, none reached at start.
 */
import { comparisonBars, climateChart, climateTable, dayLength, fallowYears, floodedZones, fmt, foehn, foehnProfile, illumination, islandProfile, ISLAND_ZONES, medinaPlan, passatSection, processFigure, RECOVERY_YEARS, shiftingFields, tropicTransect, tsunamiMinutes, tsunamiProfile, zoneForHumidMonths, type Season } from "../figures/models";
import { africaMap, australiaMap, islandsMap, japanMap, localTime, orientMap, pacificMap, TIME_CITIES, timeZoneMap } from "../figures/regional";
import { label, svg } from "../figures/draw";
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
      const controls = choice(key, "Ansicht", selected, cases.map(({ label }, i) => [String(i), label]));
      const index = cases.findIndex((_, i) => selected === String(i));
      if (index === -1) return controls + initialDrawing();
      const current = cases[index];
      const answer = state[answerKey(index)];
      // Rotate the options so the correct one is not always first.
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

// ---------------------------------------------------------------- LB 1

const munichDay = (season: Season) => fmt(Math.round(dayLength(48, season)));
export const jahreszeiten = scenarios(
  "jahreszeiten", "Die Erde im Jahreslauf", "Wechsle zwischen drei Zeitpunkten und beobachte, welche Halbkugel die Sonne steiler trifft.",
  [
    { label: "21. Juni", goal: "Finde heraus, wo um den 21. Juni Polartag herrscht.", draw: () => illumination("juni"),
      question: "Wo geht die Sonne um den 21. Juni nicht unter?",
      answers: ["Nördlich des nördlichen Polarkreises", "Südlich des südlichen Polarkreises", "Überall zwischen den Wendekreisen"],
      hint: "Suche das Gebiet, das bei einer Drehung der Erde ganz auf der hellen Seite bleibt.",
      observation: `Richtig. Die Nordhalbkugel ist zur Sonne geneigt. In München ist es etwa ${munichDay("juni")} Stunden hell.` },
    { label: "21. Dezember", goal: "Bestimme, wo die Sonne um den 21. Dezember im Zenit steht.", draw: () => illumination("dezember"),
      question: "Über welchem Breitenkreis steht die Sonne um den 21. Dezember mittags senkrecht?",
      answers: ["Über dem südlichen Wendekreis", "Über dem Äquator", "Über dem nördlichen Wendekreis"],
      hint: "Der gelbe Punkt zeigt, wo die Strahlen senkrecht auftreffen. Welche Halbkugel ist zur Sonne geneigt?",
      observation: `Richtig. Jetzt ist Sommer auf der Südhalbkugel. In München ist es nur etwa ${munichDay("dezember")} Stunden hell.` },
    { label: "21. März", goal: "Vergleiche Tag und Nacht zur Tagundnachtgleiche.", draw: () => illumination("maerz"),
      question: "Wie lang ist um den 21. März der Tag in München?",
      answers: ["Etwa 12 Stunden", "Etwa 16 Stunden", "Etwa 8 Stunden"],
      hint: "Keine Halbkugel ist zur Sonne geneigt. Die Grenze zwischen Tag und Nacht läuft durch beide Pole.",
      observation: "Richtig. Zur Tagundnachtgleiche sind Tag und Nacht überall etwa gleich lang." },
  ],
  "Die Zeichnung ist nicht maßstäblich. Die Tageslängen sind ohne Lichtbrechung in der Atmosphäre gerechnet und auf ganze Stunden gerundet.",
  () => processFigure("Zwei Bewegungen der Erde", ["Rotation", "Revolution"], ["24 Stunden:\nTag und Nacht", "ein Jahr mit\ngeneigter Achse"]),
);

export const zeitzonen: LabDef = {
  id: "zeitzonen", title: "Wie spät ist es dort?",
  intro: "Stelle die Uhrzeit in München ein (Winterzeit MEZ). Die Karte zeigt die Ortszeiten in sechs weiteren Städten.",
  note: "Alle Städte mit ihrer Winterzeit: Im Sommer stellen Deutschland, Großbritannien und New York die Uhr um eine Stunde vor, Nairobi, Dubai, Jakarta und Tokio nicht. Der Abstand München–London bleibt deshalb auch im Sommer eine Stunde.",
  initial: () => ({ hour: 12 }),
  goals: [
    { text: "Stelle eine Uhrzeit ein, zu der in Tokio schon der nächste Tag begonnen hat.", reached: (s) => localTime(num(s, "hour"), 9).day === 1 },
    { text: "Finde eine Uhrzeit, zu der in New York noch der Vortag ist.", reached: (s) => localTime(num(s, "hour"), -5).day === -1 },
    { text: "Stelle die Uhr so, dass es in Jakarta genau 12 Uhr mittags ist.", reached: (s) => localTime(num(s, "hour"), 7).hour === 12 },
  ],
  witnesses: [{ hour: 17 }, { hour: 4 }, { hour: 6 }],
  render: (s) => {
    const hour = num(s, "hour");
    const rows = TIME_CITIES.map(([name, utc]) => {
      const t = localTime(hour, utc);
      return `${name} ${t.hour} Uhr${t.day === 1 ? " (nächster Tag)" : t.day === -1 ? " (Vortag)" : ""}`;
    });
    return range("hour", "Uhrzeit in München", hour, 0, 23, 1, `${hour} Uhr`) + timeZoneMap(hour) +
      readout(`Weltzeit UTC: ${(hour + 23) % 24} Uhr. ${rows.join(" · ")}.`);
  },
};

export const foehnLab: LabDef = {
  id: "foehn", title: "Föhnrechner",
  intro: "Verschiebe die Wolkenuntergrenze im Luv. Das Luftpaket startet in 500 m Höhe mit 15 °C und überquert einen Kamm in 3000 m.",
  note: "Modellwerte: 1 °C pro 100 m ohne Wolke, 0,5 °C pro 100 m in der Wolke. In der Natur hängen die Werte von Feuchte und Temperatur ab.",
  initial: () => ({ base: 1500 }),
  goals: [
    { text: "Erreiche im Lee mindestens 10 °C mehr als im Luv.", reached: (s) => foehn(num(s, "base")).gain >= 10 },
    { text: "Stelle die Wolkenuntergrenze so hoch, dass am Hang keine Wolke entsteht. Was passiert mit dem Föhneffekt?", reached: (s) => num(s, "base") >= 3000 },
    { text: "Finde die Wolkenuntergrenze, bei der es im Lee genau 5 °C wärmer ist.", reached: (s) => foehn(num(s, "base")).gain === 5 },
  ],
  witnesses: [{ base: 1000 }, { base: 3000 }, { base: 2000 }],
  render: (s) => {
    const base = num(s, "base");
    const t = foehn(base);
    return range("base", "Wolkenuntergrenze", base, 500, 3000, 100, `${base} m`) + foehnProfile(base) +
      readout(t.base >= 3000
        ? `Keine Wolke: Die Luft kühlt bis zum Kamm auf ${fmt(t.atCrest)} °C ab und erwärmt sich beim Abstieg wieder auf ${fmt(t.lee)} °C. Ohne Kondensation gibt es keinen Föhneffekt.`
        : `Wolkenuntergrenze ${fmt(t.atBase)} °C · Kamm ${fmt(t.atCrest)} °C · Lee ${fmt(t.lee)} °C. Im Lee ist es ${fmt(t.gain)} °C wärmer als im Luv.`,
      t.gain >= 10 ? "good" : "");
  },
};

const stationView = (id: Parameters<typeof climateChart>[0]) => () => climateChart(id) + climateTable(id);
export const klimadiagramme = scenarios(
  "klimadiagramme", "Drei Stationen zuordnen", "Wähle eine Station, werte das Diagramm aus und beantworte die Frage.",
  [
    { label: "Station A", goal: "Ordne Station A räumlich zu.", draw: stationView("regenwald"),
      question: "Wo liegt Station A wahrscheinlich?",
      answers: ["Nahe am Äquator", "Am Wendekreis in einer Wüste", "Auf der Südhalbkugel im Landesinneren"],
      hint: "Achte auf die gleichmäßigen Temperaturen und auf die Zahl der humiden Monate.",
      observation: "Ganzjährig etwa 25 °C und 12 humide Monate: tropischer Regenwald nahe dem Äquator." },
    { label: "Station G", goal: "Bestimme die Halbkugel von Station G.", draw: stationView("outback"),
      question: "Auf welcher Halbkugel liegt Station G?",
      answers: ["Auf der Südhalbkugel", "Auf der Nordhalbkugel", "Genau am Äquator"],
      hint: "Suche den wärmsten Monat.",
      observation: "Der Januar ist am wärmsten und alle Monate sind arid: eine Trockenzone der Südhalbkugel, etwa im Inneren Australiens." },
    { label: "Station B", goal: "Zähle die humiden Monate von Station B.", draw: stationView("feuchtsavanne"),
      question: "Wie viele Monate sind bei Station B humid?",
      answers: ["7", "5", "12"],
      hint: "Ein Monat ist humid, wenn die Säule über die Kurve reicht. Die blauen Streifen helfen.",
      observation: "April bis Oktober sind humid. 7 humide Monate passen zur Feuchtsavanne." },
  ],
  "Alle Werte sind Modelldaten. Maßstab nach Walter und Lieth: 10 °C ≙ 20 mm, über 100 mm gestaucht.",
  () => processFigure("So liest du ein Klimadiagramm", ["Temperatur", "Niederschlag", "Vergleich"], ["rote Kurve,\nlinke Achse", "blaue Säulen,\nrechte Achse", "Säule über Kurve:\nhumid"]),
);

// ---------------------------------------------------------------- LB 2

export const afrika = scenarios(
  "afrika", "Afrika in drei Kartenebenen", "Blende jeweils eine Kartenebene ein und beantworte die Frage.",
  [
    { label: "Flüsse", goal: "Finde den Fluss, der den Äquator zweimal quert.", draw: () => africaMap("fluesse"),
      question: "Welcher Fluss quert den Äquator zweimal?",
      answers: ["Der Kongo", "Der Niger", "Der Sambesi"],
      hint: "Folge der roten Äquatorlinie und suche einen Fluss, der sie im Bogen zweimal schneidet.",
      observation: "Der Kongo fließt erst nach Norden über den Äquator und im Bogen wieder nach Süden." },
    { label: "Hochland", goal: "Verorte den Kilimandscharo.", draw: () => africaMap("hochland"),
      question: "Wo liegt der Kilimandscharo?",
      answers: ["In Ostafrika knapp südlich des Äquators", "Im Kongobecken", "In der Kalahari"],
      hint: "Der höchste Berg Afrikas liegt im Hochland nahe dem Ostafrikanischen Graben.",
      observation: "Der Kilimandscharo steht in Tansania, nahe der Grenze zu Kenia." },
    { label: "Staaten", goal: "Finde den markierten Staat am Golf von Guinea.", draw: () => africaMap("staaten"),
      question: "Welcher markierte Staat grenzt an den Golf von Guinea?",
      answers: ["Nigeria", "Kenia", "Äthiopien"],
      hint: "Der Golf von Guinea liegt an der Westküste, nördlich des Äquators.",
      observation: "Nigeria mit Lagos liegt am Golf von Guinea; Kenia und Äthiopien liegen in Ostafrika." },
  ],
  "Natural-Earth-Karte, vereinfacht. Flussläufe und Gebirgslinien sind schematisch.",
  () => africaMap("staaten"),
);

const passatQuestion = (month: "maerz" | "juli" | "januar") => () => passatSection(month);
export const passat = scenarios(
  "passat", "Die ITC wandert", "Wechsle zwischen drei Monaten und beobachte, wo die Regenzeit liegt.",
  [
    { label: "März", goal: "Finde die Regenzone im März.", draw: passatQuestion("maerz"),
      question: "Wo fällt im März im Modell der meiste Regen?",
      answers: ["Am Äquator", "Am nördlichen Wendekreis", "Am südlichen Wendekreis"],
      hint: "Suche die Wolke über der ITC.",
      observation: "Im März steht die Sonne über dem Äquator im Zenit, die ITC liegt dort." },
    { label: "Juli", goal: "Erkenne, welcher Raum im Juli Regenzeit hat.", draw: passatQuestion("juli"),
      question: "Welcher Raum hat im Juli Regenzeit?",
      answers: ["Der Sahel bei etwa 12° N", "Die Kalahari bei etwa 23° S", "Die Sahara bei etwa 25° N"],
      hint: "Die ITC folgt dem Zenitstand der Sonne nach Norden.",
      observation: "Die ITC liegt im Juli nördlich des Äquators. Im Sahel ist Regenzeit." },
    { label: "Januar", goal: "Erkläre die Trockenzeit im Sahel.", draw: passatQuestion("januar"),
      question: "Warum ist es im Januar bei 12° N trocken?",
      answers: ["Dort weht der trockene Nordost-Passat.", "Dort liegt jetzt die ITC.", "Dort steht die Sonne im Zenit."],
      hint: "Wo liegt die ITC im Januar? Woher kommt dann der Wind bei 12° N?",
      observation: "Die ITC liegt südlich des Äquators. Bei 12° N weht der trockene Passat aus dem Hoch über der Sahara." },
  ],
  "Stark vereinfachtes Modell; über Afrika wandert die ITC tatsächlich unterschiedlich weit.",
  () => processFigure("Der Passatkreislauf", ["ITC", "Höhenströmung", "Hoch", "Passat"], ["Luft steigt,\nRegen", "Luft strömt\nzum Wendekreis", "Luft sinkt,\ntrocken", "Wind zurück\nzur ITC"], true),
);

export const feuchtmonate: LabDef = {
  id: "feuchtmonate", title: "Humide Monate und Vegetation",
  intro: "Verändere die Zahl der humiden Monate und beobachte, welche Vegetationszone passt.",
  note: "Die Grenzwerte sind Richtwerte. Böden, Höhe und der Mensch verändern die Vegetation zusätzlich.",
  initial: () => ({ humid: 8 }),
  goals: [
    { text: "Stelle die Bedingungen für tropischen Regenwald ein.", reached: (s) => zoneForHumidMonths(num(s, "humid")) === "Tropischer Regenwald" },
    { text: "Finde die Spanne der Trockensavanne.", reached: (s) => zoneForHumidMonths(num(s, "humid")) === "Trockensavanne" },
    { text: "Stelle eine Wüste oder Halbwüste ein.", reached: (s) => zoneForHumidMonths(num(s, "humid")) === "Halbwüste und Wüste" },
  ],
  witnesses: [{ humid: 11 }, { humid: 5 }, { humid: 0 }],
  render: (s) => {
    const humid = num(s, "humid");
    return range("humid", "Humide Monate im Jahr", humid, 0, 12, 1, `${humid}`) + tropicTransect(humid) +
      readout(`${humid} humide Monate: ${zoneForHumidMonths(humid)}.`);
  },
};

export const wanderfeldbau: LabDef = {
  id: "wanderfeldbau", title: "Reicht die Brache?",
  intro: "Ein Dorf bebaut jedes Feld 2 Jahre und lässt es dann ruhen. Verändere die Zahl der Felder, die dem Dorf zur Verfügung stehen.",
  note: `Modell: Erst nach ${RECOVERY_YEARS} Jahren Brache ist der Wald nachgewachsen und der Boden erholt. Echte Werte hängen von Boden und Klima ab.`,
  initial: () => ({ fields: 5 }),
  goals: [
    { text: `Sorge dafür, dass der Wald mindestens ${RECOVERY_YEARS} Jahre nachwachsen kann.`, reached: (s) => fallowYears(num(s, "fields")) >= RECOVERY_YEARS },
    { text: "Finde die kleinste Zahl an Feldern, bei der die Brache gerade noch reicht.", reached: (s) => fallowYears(num(s, "fields")) === RECOVERY_YEARS },
    { text: "Zeige, wie Platzmangel die Brache auf höchstens 4 Jahre verkürzt.", reached: (s) => fallowYears(num(s, "fields")) <= 4 },
  ],
  witnesses: [{ fields: 8 }, { fields: 6 }, { fields: 3 }],
  render: (s) => {
    const fields = num(s, "fields");
    const fallow = fallowYears(fields);
    return range("fields", "Felder des Dorfes", fields, 3, 12, 1, `${fields}`) + shiftingFields(fields) +
      readout(`Brache: ${fields - 1} · 2 = ${fallow} Jahre. ${fallow >= RECOVERY_YEARS ? "Der Wald wächst nach, der Boden erholt sich." : "Zu kurz: Der Boden verarmt, die Erträge sinken."}`,
        fallow >= RECOVERY_YEARS ? "good" : "warn");
  },
};

// ---------------------------------------------------------------- LB 3

export const orient = scenarios(
  "orient", "Nordafrika und Westasien entdecken", "Blende eine Kartenebene ein und beantworte die Frage.",
  [
    { label: "Meere", goal: "Finde das Meer zwischen Afrika und Arabien.", draw: () => orientMap("meere"),
      question: "Welches Meer liegt zwischen Afrika und der Arabischen Halbinsel?",
      answers: ["Das Rote Meer", "Der Persische Golf", "Das Schwarze Meer"],
      hint: "Suche einen schmalen Meeresarm westlich der Arabischen Halbinsel.",
      observation: "Das Rote Meer trennt Afrika von der Arabischen Halbinsel; der Suezkanal verbindet es mit dem Mittelmeer." },
    { label: "Flüsse und Gebirge", goal: "Benenne die Flüsse Mesopotamiens.", draw: () => orientMap("fluesse"),
      question: "Welche Flüsse begrenzen Mesopotamien?",
      answers: ["Euphrat und Tigris", "Nil und Jordan", "Niger und Kongo"],
      hint: "Mesopotamien bedeutet „Land zwischen den Flüssen“. Suche zwei Flüsse, die in den Persischen Golf münden.",
      observation: "Euphrat und Tigris entspringen in der Türkei und münden gemeinsam in den Persischen Golf." },
    { label: "Staaten und Städte", goal: "Ordne Riad seinem Staat zu.", draw: () => orientMap("staaten"),
      question: "In welchem Staat liegt Riad?",
      answers: ["Saudi-Arabien", "Iran", "Ägypten"],
      hint: "Riad liegt im Inneren der Arabischen Halbinsel.",
      observation: "Riad ist die Hauptstadt Saudi-Arabiens, des größten Staates der Arabischen Halbinsel." },
  ],
  "Natural-Earth-Karte, vereinfacht. Flussläufe und Gebirgslinien sind schematisch.",
  () => orientMap("staaten"),
);

export const medina = scenarios(
  "medina", "Durch die Medina", "Wähle einen Stadtteil. Er wird im Grundriss hervorgehoben.",
  [
    { label: "Suq", goal: "Finde heraus, wo der Suq liegt.", draw: () => medinaPlan("suq"),
      question: "Wo liegt der Suq?",
      answers: ["An den Hauptgassen zwischen den Toren und um die Moschee", "In den Sackgassen der Wohnviertel", "Außerhalb der Stadtmauer"],
      hint: "Händler brauchen Kundschaft. Wo kommen die meisten Menschen vorbei?",
      observation: "Der Suq liegt an den belebten Hauptgassen und rund um die Große Moschee." },
    { label: "Wohnviertel", goal: "Erkläre die Sackgassen.", draw: () => medinaPlan("wohnviertel"),
      question: "Wozu dienen die Sackgassen in den Wohnvierteln?",
      answers: ["Sie halten Durchgangsverkehr und Fremde fern.", "Sie verbinden die Tore auf kürzestem Weg.", "Sie dienen als Marktstraßen."],
      hint: "Wer läuft durch eine Gasse, die nirgends hinführt?",
      observation: "In Sackgassen kommen nur Anwohner und Gäste. Das schützt die Privatsphäre der Familien." },
    { label: "Neustadt", goal: "Vergleiche die Neustadt mit der Medina.", draw: () => medinaPlan("neustadt"),
      question: "Was unterscheidet die Neustadt von der Medina?",
      answers: ["Breite, gerade Straßen im Gitternetz", "Enge Sackgassen und Innenhöfe", "Eine Stadtmauer mit Toren"],
      hint: "Vergleiche das Straßennetz links und rechts der Mauer.",
      observation: "Die Neustadt wurde planmäßig mit geraden Straßen angelegt, die auch für Autos geeignet sind." },
  ],
  "Schematischer Grundriss; echte Medinas weichen im Detail ab.",
  () => medinaPlan(),
);

export const oase: LabDef = {
  id: "oase", title: "Wasserbilanz einer Oase",
  intro: "Verändere die bewässerte Fläche und den Wasserbedarf je Hektar. Vergleiche die Entnahme mit der Grundwasserneubildung.",
  note: "Die Neubildung bleibt im Modell bei 100 Wassereinheiten im Jahr. Fossiles Grundwasser würde sich gar nicht erneuern.",
  initial: () => ({ area: 10, water: 10 }),
  goals: [
    { text: "Erreiche eine Entnahme unter der Neubildung von 100 Einheiten.", reached: (s) => num(s, "area") * num(s, "water") < 100 },
    { text: "Erreiche eine Entnahme über 100 Einheiten. Was passiert mit dem Grundwasser?", reached: (s) => num(s, "area") * num(s, "water") > 100 },
    { text: "Spare Wasser (8 Einheiten je Hektar) und entnimm trotzdem mehr als 100, weil die Fläche wächst.",
      reached: (s) => num(s, "water") === 8 && num(s, "area") * 8 > 100 },
  ],
  witnesses: [{ area: 10, water: 8 }, { area: 12, water: 10 }, { area: 15, water: 8 }],
  render: (s) => {
    const area = num(s, "area"), water = num(s, "water");
    const total = area * water;
    return range("area", "Bewässerte Fläche", area, 5, 18, 1, `${area} ha`)
      + range("water", "Wasser je Hektar", water, 5, 14, 1, `${water} Einheiten`)
      + comparisonBars("Wasserbilanz der Oase", [["Neubildung", 100], ["Entnahme", total]], "", 252)
      + readout(`Entnahme: ${area} · ${water} = ${total} Einheiten. ${total > 100 ? "Der Grundwasserspiegel sinkt, Brunnen können versiegen." : total < 100 ? "Die Entnahme liegt unter der Neubildung." : "Entnahme und Neubildung sind gleich groß."}`,
        total > 100 ? "warn" : total < 100 ? "good" : "");
  },
};

export const staatshaushalt: LabDef = {
  id: "staatshaushalt", title: "Staatshaushalt und Ölpreis",
  intro: "Ein Staat braucht 100 Geldeinheiten im Jahr. Verändere den Ölpreis und entscheide, ob es zusätzliche Branchen gibt.",
  note: "Erfundene Werte: Eine Preiseinheit bringt eine Geldeinheit; Handel und Tourismus bringen zusammen 60 Einheiten.",
  initial: () => ({ price: 120, branches: "0" }),
  goals: [
    { text: "Decke den Bedarf, obwohl der Ölpreis nur bei 40 liegt.", reached: (s) => num(s, "price") === 40 && str(s, "branches") === "1" },
    { text: "Finde den niedrigsten Ölpreis, bei dem ein Staat nur mit Öl gerade auskommt.", reached: (s) => num(s, "price") === 100 && str(s, "branches") === "0" },
    { text: "Zeige eine Lage, in der Geld im Haushalt fehlt.", reached: (s) => num(s, "price") + (str(s, "branches") === "1" ? 60 : 0) < 100 },
  ],
  witnesses: [{ price: 40, branches: "1" }, { price: 100, branches: "0" }, { price: 70, branches: "0" }],
  render: (s) => {
    const price = num(s, "price");
    const diversified = str(s, "branches") === "1";
    const other = diversified ? 60 : 0;
    const total = price + other;
    return range("price", "Ölpreis (Modell)", price, 40, 120, 10, `${price}`)
      + choice("branches", "Weitere Branchen", str(s, "branches"), [["0", "Nur Öl"], ["1", "Plus Handel und Tourismus"]])
      + comparisonBars("Einnahmen und Bedarf", [["Bedarf", 100], ["Öl", price], ["Handel, Tourismus", other], ["Einnahmen gesamt", total]], "", 180)
      + readout(`Einnahmen ${price} + ${other} = ${total}. ${total >= 100 ? `Überschuss oder ausgeglichen: ${total - 100}.` : `Es fehlen ${100 - total} Einheiten.`}`, total >= 100 ? "good" : "warn");
  },
};

// ---------------------------------------------------------------- LB 4

export const inselwelt = scenarios(
  "inselwelt", "Inseln, Meere, Staaten", "Blende eine Kartenebene ein und beantworte die Frage.",
  [
    { label: "Inseln", goal: "Finde die Insel, die sich drei Staaten teilen.", draw: () => islandsMap("inseln"),
      question: "Welche Insel teilen sich drei Staaten?",
      answers: ["Borneo", "Java", "Luzon"],
      hint: "Suche die große Insel nördlich der Javasee.",
      observation: "Auf Borneo liegen Teile Indonesiens und Malaysias sowie Brunei." },
    { label: "Meere", goal: "Benenne die Meeresstraße bei Singapur.", draw: () => islandsMap("meere"),
      question: "Welche Meeresstraße liegt zwischen Sumatra und der Malaiischen Halbinsel?",
      answers: ["Die Straße von Malakka", "Die Javasee", "Die Philippinensee"],
      hint: "Sie verbindet den Indischen Ozean mit dem Südchinesischen Meer.",
      observation: "Die Straße von Malakka ist einer der meistbefahrenen Schifffahrtswege der Erde." },
    { label: "Staaten", goal: "Ordne eine Hauptstadt ihrer Insel zu.", draw: () => islandsMap("staaten"),
      question: "Welche Hauptstadt liegt auf der Insel Luzon?",
      answers: ["Manila", "Jakarta", "Kuala Lumpur"],
      hint: "Luzon ist die größte Insel der Philippinen.",
      observation: "Manila ist die Hauptstadt der Philippinen und liegt auf Luzon." },
  ],
  "Natural-Earth-Karte im kleinen Maßstab; sehr kleine Inseln wie die Malediven sind nur als Punkt erkennbar.",
  () => islandsMap("staaten"),
);

export const tsunami: LabDef = {
  id: "tsunami", title: "Wie viel Zeit bleibt?",
  intro: "Verändere die Entfernung des Seebebens von der Küste. Im tiefen Ozean ist der Tsunami im Modell 700 km pro Stunde schnell.",
  note: "Vereinfachung: konstante Geschwindigkeit im tiefen Wasser; nahe der Küste wird die Welle langsamer, aber höher.",
  initial: () => ({ km: 1000 }),
  goals: [
    { text: "Finde eine Entfernung, bei der die Welle in weniger als 20 Minuten ankommt.", reached: (s) => tsunamiMinutes(num(s, "km")) < 20 },
    { text: "Finde eine Entfernung, bei der mehr als 2 Stunden für die Warnung bleiben.", reached: (s) => tsunamiMinutes(num(s, "km")) > 120 },
    { text: "Stelle das Beben so ein, dass die Welle nach genau einer Stunde ankommt.", reached: (s) => tsunamiMinutes(num(s, "km")) === 60 },
  ],
  witnesses: [{ km: 200 }, { km: 1500 }, { km: 700 }],
  render: (s) => {
    const km = num(s, "km");
    const minutes = tsunamiMinutes(km);
    return range("km", "Entfernung des Bebens", km, 100, 2000, 100, `${km} km`) + tsunamiProfile(km) +
      readout(`${km} km : 700 km/h ≈ ${minutes} Minuten. ${minutes < 20 ? "Kaum Zeit: Sofort beim Spüren des Bebens fliehen!" : minutes > 120 ? "Eine Warnung über Sirenen und Handys erreicht die Menschen rechtzeitig." : "Warnung und Flucht auf höheres Gelände sind möglich, wenn alles schnell geht."}`,
        minutes < 20 ? "warn" : "good");
  },
};

export const meeresspiegel: LabDef = {
  id: "meeresspiegel", title: "Eine flache Insel und das steigende Meer",
  intro: "Verändere den Anstieg des Meeresspiegels und die Höhe einer Sturmflut. Beobachte, welche Bereiche der Modellinsel überflutet werden.",
  note: "Erfundene Höhen einer Modellinsel. Tatsächliche Überflutungen hängen auch von Wellen, Riffen und Gezeiten ab.",
  initial: () => ({ rise: 0, surge: 0 }),
  goals: [
    { text: "Überflute den Strand ganz ohne Sturmflut.", reached: (s) => num(s, "surge") === 0 && num(s, "rise") >= 40 },
    { text: "Lass eine Sturmflut von 60 cm kommen, ohne dass der Hafen überflutet wird.", reached: (s) => num(s, "surge") === 60 && num(s, "rise") + 60 < 80 },
    { text: "Finde eine Lage, in der die Wohnhäuser unter Wasser stehen.", reached: (s) => num(s, "rise") + num(s, "surge") >= 120 },
  ],
  witnesses: [{ rise: 40, surge: 0 }, { rise: 10, surge: 60 }, { rise: 40, surge: 80 }],
  render: (s) => {
    const rise = num(s, "rise"), surge = num(s, "surge");
    const flooded = floodedZones(rise, surge);
    const names = ISLAND_ZONES.slice(0, flooded).map(([name]) => name);
    return range("rise", "Anstieg des Meeresspiegels", rise, 0, 100, 10, `${rise} cm`)
      + range("surge", "Sturmflut", surge, 0, 120, 20, `${surge} cm`)
      + islandProfile(rise, surge)
      + readout(`Wasserstand ${rise} + ${surge} = ${rise + surge} cm. ${flooded === 0 ? "Alle Bereiche bleiben trocken." : `Überflutet: ${names.join(", ")}.`}`, flooded >= 3 ? "warn" : "");
  },
};

// ---------------------------------------------------------------- LB 5

export const japanAustralien = scenarios(
  "japan-australien", "Zwei Staaten am Pazifik", "Wechsle zwischen den Karten und beantworte die Fragen.",
  [
    { label: "Japan", goal: "Finde die Insel, auf der Tokio liegt.", draw: () => japanMap(),
      question: "Auf welcher Hauptinsel liegt Tokio?",
      answers: ["Honshu", "Hokkaido", "Kyushu"],
      hint: "Es ist die größte der vier Hauptinseln.",
      observation: "Tokio liegt auf Honshu, ebenso Osaka, Nagoya und der Fuji." },
    { label: "Australien", goal: "Verorte das Great Barrier Reef.", draw: () => australiaMap(),
      question: "Wo liegt das Great Barrier Reef?",
      answers: ["Vor der Nordostküste", "Vor der Westküste bei Perth", "Im Landesinneren beim Uluru"],
      hint: "Suche die gestrichelte türkise Linie.",
      observation: "Das Riff zieht sich vor der Küste von Queensland im Nordosten entlang." },
    { label: "Vergleich", goal: "Vergleiche die Lage beider Staaten.", draw: () => pacificMap(),
      question: "Was unterscheidet die Lage beider Staaten grundlegend?",
      answers: ["Japan liegt auf der Nord-, Australien auf der Südhalbkugel.", "Beide liegen am Indischen Ozean.", "Australien liegt nördlich von Japan."],
      hint: "Achte auf die rote Linie des Äquators.",
      observation: "Der Äquator trennt beide Staaten. Ihre Jahreszeiten sind deshalb entgegengesetzt." },
  ],
  "Natural-Earth-Karten mit verschiedenen Maßstäben; die Kartenausschnitte sind nicht gleich groß.",
  () => pacificMap(),
);

/** Model country: 100 million people on 100 land units. */
export function usableUnits(mountains: number, reclaimed: number): number {
  return 100 - mountains + reclaimed;
}
export const densityPerUnit = (mountains: number, reclaimed: number): number =>
  100 / usableUnits(mountains, reclaimed);

function landGrid(mountains: number, reclaimed: number): string {
  const cells = Array.from({ length: 110 }, (_, i) => {
    const x = 20 + (i % 11) * 50, y = 40 + Math.floor(i / 11) * 20;
    const col = i % 11;
    // Column 10 is sea; reclaimed units turn sea cells into land.
    const cls = col === 10
      ? Math.floor(i / 11) < reclaimed ? "grid-new" : "grid-sea"
      : i - Math.floor(i / 11) < mountains ? "grid-mountain" : "grid-plain";
    return `<rect class="${cls}" x="${x}" y="${y}" width="46" height="16" rx="3"/>`;
  }).join("");
  return svg(580, 270, `Modellland: ${mountains} Gebirgseinheiten, ${reclaimed} aufgeschüttete Einheiten`,
    label(290, 24, "Modellland · jede Kachel eine Flächeneinheit", "lbl strong") + cells +
    label(130, 258, "Gebirge", "lbl small strong") + label(290, 258, "nutzbare Ebene", "lbl small strong") + label(470, 258, "Meer · neues Land", "lbl small strong"));
}

export const raumenge: LabDef = {
  id: "raumenge", title: "Wie eng wird es?",
  intro: "100 Millionen Menschen leben in einem Land mit 100 Flächeneinheiten. Verändere den Gebirgsanteil und gewinne Land aus dem Meer.",
  note: "Erfundenes Modell. Auch Gebirgstäler werden in der Wirklichkeit teilweise bewohnt.",
  initial: () => ({ mountains: 60, reclaimed: 0 }),
  goals: [
    { text: "Stelle ein Land ein, in dem sich mehr als 3 Millionen Menschen auf jede nutzbare Einheit drängen.", reached: (s) => densityPerUnit(num(s, "mountains"), num(s, "reclaimed")) > 3 },
    { text: "Senke die Dichte durch Landgewinnung auf genau 2,5 Millionen je Einheit.", reached: (s) => num(s, "reclaimed") > 0 && usableUnits(num(s, "mountains"), num(s, "reclaimed")) === 40 },
    { text: "Finde ein Land mit höchstens 2 Millionen Menschen je nutzbarer Einheit.", reached: (s) => densityPerUnit(num(s, "mountains"), num(s, "reclaimed")) <= 2 },
  ],
  witnesses: [{ mountains: 80, reclaimed: 0 }, { mountains: 70, reclaimed: 10 }, { mountains: 50, reclaimed: 0 }],
  render: (s) => {
    const mountains = num(s, "mountains"), reclaimed = num(s, "reclaimed");
    const usable = usableUnits(mountains, reclaimed);
    return range("mountains", "Gebirge", mountains, 40, 80, 10, `${mountains} Einheiten`)
      + range("reclaimed", "Landgewinnung", reclaimed, 0, 10, 5, `${reclaimed} Einheiten`)
      + landGrid(mountains, reclaimed)
      + readout(`Nutzbar: ${usable} Einheiten. 100 Millionen : ${usable} ≈ ${fmt(Math.round(densityPerUnit(mountains, reclaimed) * 10) / 10)} Millionen Menschen je nutzbarer Einheit.`);
  },
};

