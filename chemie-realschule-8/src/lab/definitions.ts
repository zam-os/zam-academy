import {
  ALKANE_NAMES,
  alkaneCombustion,
  alkaneFormula,
  alkaneMolarMass,
  ANIONS,
  AVOGADRO_E23,
  averageMolarMass,
  binaryMoleculeFormula,
  binaryNonmetalName,
  CATIONS,
  ELEMENT_SYSTEM,
  elementStateAt,
  EQUATION_REACTIONS,
  fmtSigned,
  fmtTemp,
  heatingCurveTemp,
  ISOTOPE_PAIRS,
  ionText,
  kugelwolkenConfig,
  lindeFractionation,
  molarMassFromParticleMassE24,
  PARTICLE_SPECIES,
  PHASE_SUBSTANCES,
  PSE_ELEMENTS,
  ROMAN_GROUP,
  STOICH_REACTIONS,
  SUBSTANCES,
  saltFormula,
  saltName,
  saltRatio,
  stateOfMatter,
  VM_NORM,
  valenceElectrons,
} from "../chemistry/model";
import { fmt, round } from "../exercises/format";
import type {
  ChoiceParam,
  LabDefinition,
  LabGoal,
  LabKind,
  LabParam,
  LabReadout,
  LabValues,
  RangeParam,
} from "../model/types";

const choice = (key: string, label: string, labels: string[], value = 0): ChoiceParam => ({
  type: "choice",
  key,
  label,
  options: labels.map((text, index) => ({ value: index, label: text })),
  value,
});

const range = (
  key: string,
  label: string,
  min: number,
  max: number,
  value: number,
  step = 1,
  unit = "",
): RangeParam => ({
  type: "range",
  key,
  label,
  min,
  max,
  value,
  step,
  unit,
  digits: step < 1 ? 1 : 0,
});

const read = (
  key: string,
  label: string,
  compute: LabReadout["compute"],
  unit = "",
  digits = 2,
): LabReadout => ({ key, label, compute, unit, digits, emphasis: true });

const goal = (id: string, text: string, check: LabGoal["check"]): LabGoal => ({ id, text, check });

const lab = (
  kind: LabKind,
  title: string,
  intro: string,
  params: LabParam[],
  readouts: LabReadout[],
  goals: LabGoal[],
  actions?: LabDefinition["actions"],
): LabDefinition => ({ kind, title, intro, params, readouts, goals, actions });

export interface ExperimentCase {
  name: string;
  observation: string;
  answer: number;
}
export interface Experiment {
  title: string;
  options: string[];
  cases: ExperimentCase[];
}

/** The observation is revealed only after the learner makes a prediction and runs the model. */
export const EXPERIMENTS: Partial<Record<LabKind, Experiment>> = {
  ghs: {
    title: "Gefahrstoffe sicher handhaben",
    options: [
      "Schutzbrille und Schutzhandschuhe tragen, Spritzer vermeiden",
      "Nur im Abzug arbeiten, Dämpfe niemals einatmen",
      "Von offenen Flammen, Funken und heißen Flächen fernhalten",
      "Nicht in den Ausguss: getrennt im Schwermetall-Sammelbehälter entsorgen",
    ],
    cases: [
      {
        name: "Ethanol (Brennspiritus) mit Piktogramm Flamme (GHS02)",
        observation:
          "GHS02 kennzeichnet entzündbare Flüssigkeiten und Dämpfe. Brenner in der Nähe löschen, Gefäß verschlossen halten.",
        answer: 2,
      },
      {
        name: "Verdünnte Natronlauge mit Piktogramm Ätzwirkung (GHS05)",
        observation:
          "GHS05 warnt vor schweren Verätzungen von Haut und Augen sowie Korrosion von Metallen. Schutzbrille und Handschuhe sind Pflicht.",
        answer: 0,
      },
      {
        name: "Giftige Dämpfe mit Piktogramm Totenkopf (GHS06)",
        observation:
          "GHS06 kennzeichnet akut giftige Stoffe. Solche Versuche führt nur die Lehrkraft im eingeschalteten Abzug durch.",
        answer: 1,
      },
      {
        name: "Kupfer(II)-sulfat-Lösung mit Piktogramm Umwelt (GHS09)",
        observation:
          "GHS09 warnt vor Gewässergefährdung. Schwermetallsalz-Reste gehören in den Sammelbehälter für anorganische Schwermetallabfälle.",
        answer: 3,
      },
    ],
  },
  protokoll: {
    title: "Untersuchungsgang und Protokollebenen",
    options: [
      "Prüfbare Hypothese",
      "Variablenkontrolle im Versuchsaufbau",
      "Beobachtung auf der Stoffebene",
      "Deutung auf der Teilchenebene",
    ],
    cases: [
      {
        name: "„Wenn Wasser wärmer ist, verteilt sich Lebensmittelfarbe schneller im Becherglas.“",
        observation:
          "Das ist eine prüfbare Hypothese: eine begründete Wenn-dann-Vermutung, die ein Experiment bestätigen oder widerlegen kann.",
        answer: 0,
      },
      {
        name: "„Beide Bechergläser enthalten genau 150 ml Wasser und je einen Tropfen Farbe; nur die Temperatur unterscheidet sich.“",
        observation:
          "Variablenkontrolle: Genau eine Größe (Temperatur) wird geändert, alle anderen Größen bleiben konstant.",
        answer: 1,
      },
      {
        name: "„Im 60 °C warmen Wasser ist die Flüssigkeit nach 30 s gleichmäßig rot gefärbt.“",
        observation:
          "Beobachtung auf der Stoffebene: Beschreibt ausschließlich Sinneswahrnehmungen und Messwerte ohne Erklärung.",
        answer: 2,
      },
      {
        name: "„Bei höherer Temperatur bewegen sich die Wasser- und Farbstoffteilchen schneller und durchmischen sich rascher.“",
        observation:
          "Deutung auf der Teilchenebene: Erklärt die Beobachtung mithilfe des Teilchenmodells.",
        answer: 3,
      },
    ],
  },
  nachweise: {
    title: "Gas- und Wassernachweise im Labor",
    options: [
      "Sauerstoff (Glimmspan flammt hell auf)",
      "Wasserstoff (Knallgasprobe mit pfeifendem Plopp)",
      "Kohlenstoffdioxid (klares Kalkwasser trübt sich weiß)",
      "Wasser (weißes wasserfreies Kupfersulfat wird blau)",
    ],
    cases: [
      {
        name: "Ein glimmender Holzspan wird in das Reagenzglas gehalten und leuchtet sofort mit heller Flamme auf",
        observation:
          "Positive Glimmspanprobe: Reiner Sauerstoff fördert die Verbrennung stark und lässt den glimmenden Span aufflammen.",
        answer: 0,
      },
      {
        name: "Das im Reagenzglas aufgefangene leichte Gas entzündet sich an der Flamme mit einem kurzen pfeifenden Ton",
        observation:
          "Positive Knallgasprobe: Wasserstoff reagiert mit Luftsauerstoff schlagartig zu Wasserdampf.",
        answer: 1,
      },
      {
        name: "Beim Durchleiten des farblosen Gases durch klares Kalkwasser entsteht ein milchig-weißer Niederschlag",
        observation:
          "Positive Kalkwasserprobe: Kohlenstoffdioxid bildet in Calciumhydroxidlösung schwer lösliches weißes Calciumcarbonat.",
        answer: 2,
      },
      {
        name: "Ein Tropfen einer klaren Flüssigkeit färbt weißes, entwässertes Kupfersulfat-Pulver kräftig blau",
        observation:
          "Wassernachweis positiv: Wasserfreies weißes Kupfersulfat lagert Wassermoleküle ein und bildet blaues Kupfersulfat-Hydrat.",
        answer: 3,
      },
    ],
  },
};

function experimentLab(kind: LabKind): LabDefinition {
  const exp = EXPERIMENTS[kind];
  if (!exp) throw new Error(`Unknown experiment ${kind}`);
  return lab(
    kind,
    exp.title,
    "Wähle einen Fall, stelle zuerst deine Vermutung auf und starte dann den Modellversuch.",
    [
      choice("case", "Versuchsfall", exp.cases.map((c, i) => `Fall ${i + 1}: ${c.name.slice(0, 44)}…`)),
      choice("prediction", "Deine Vermutung", ["— zuerst Vermutung wählen —", ...exp.options], 0),
      { type: "state", key: "observed", value: 0, resetOnChange: true },
    ],
    [
      read("caseText", "Untersuchter Fall", (v) => exp.cases[v.case].name),
      read("status", "Auswertung", (v) => {
        if (!v.observed) return "Vermutung wählen und auf „Modellversuch starten“ klicken";
        const ok = v.prediction - 1 === exp.cases[v.case].answer;
        return `${ok ? "Bestätigt" : "Überprüfen"}: ${exp.cases[v.case].observation}`;
      }),
    ],
    exp.cases.map((c, idx) =>
      goal(
        `case-${idx}`,
        `Fall ${idx + 1} richtig vorhersagen und im Modellversuch prüfen`,
        (v) => v.case === idx && v.observed === 1 && v.prediction - 1 === c.answer,
      ),
    ),
    [
      {
        id: "run",
        label: "▶ Modellversuch starten",
        apply: (v) => (v.prediction > 0 ? { ...v, observed: 1 } : v),
      },
    ],
  );
}

/** Test helper returning the exact state after predicting and running case `index`. */
export function experimentWitness(kind: LabKind, index: number): LabValues {
  const exp = EXPERIMENTS[kind];
  if (!exp) throw new Error(`Not an experiment lab: ${kind}`);
  return { case: index, prediction: exp.cases[index].answer + 1, observed: 1 };
}

export const BINDIGKEIT_PAIRS = [
  { symA: "C", nameA: "Kohlenstoff", bA: 4, symB: "H", stemB: "hydrid", bB: 1, common: "Methan" },
  { symA: "N", nameA: "Stickstoff", bA: 3, symB: "H", stemB: "hydrid", bB: 1, common: "Ammoniak" },
  { symA: "O", nameA: "Sauerstoff", bA: 2, symB: "H", stemB: "hydrid", bB: 1, common: "Wasser" },
  { symA: "C", nameA: "Kohlenstoff", bA: 4, symB: "O", stemB: "oxid", bB: 2, common: "Kohlenstoffdioxid" },
  { symA: "P", nameA: "Phosphor", bA: 3, symB: "Cl", stemB: "chlorid", bB: 1, common: "Phosphortrichlorid" },
] as const;

export const LAB_CATIONS = [CATIONS[0], CATIONS[2], CATIONS[4], CATIONS[9], CATIONS[10]] as const; // Na+, Mg2+, Al3+, Fe2+, Fe3+
export const LAB_ANIONS = [ANIONS[1], ANIONS[4], ANIONS[6]] as const; // Cl-, O2-, N3-

export function makeLab(kind: LabKind): LabDefinition {
  if (EXPERIMENTS[kind]) return experimentLab(kind);

  switch (kind) {
    case "modellgrenzen": {
      const phenomena = [
        "Teeduft verteilt sich von selbst im Zimmer (Diffusion)",
        "Wasser wird durch Strom in Wasserstoff und Sauerstoff zerlegt",
        "Festes Kochsalz leitet keinen Strom, geschmolzenes Kochsalz schon",
        "Natriumsalze färben die Brennerflamme intensiv gelb-orange",
      ];
      const models = [
        "Einfaches Teilchenmodell (unterschiedslose Kugeln in Bewegung)",
        "Daltonsches Atommodell (verschiedene unveränderliche Atomsorten)",
        "Ionengittermodell (positiv und negativ geladene Ionen)",
        "Energiestufenmodell (Elektronen auf diskreten Energiestufen)",
      ];
      return lab(
        kind,
        "Modellprüfstand: Leistung und Modellgrenzen",
        "Wähle ein chemisches Phänomen und prüfe, welches Modell es erklären kann – und wo ein einfacheres Modell an seine Grenze stößt.",
        [choice("phenomenon", "Phänomen", phenomena, 0), choice("model", "Gewähltes Modell", models, 1)],
        [
          read("fit", "Eignung des Modells", (v) =>
            v.phenomenon === v.model
              ? "Passend: Dieses Modell erklärt das Phänomen zielgenau."
              : v.model < v.phenomenon
                ? "Modellgrenze erreicht: Dem Modell fehlen innere Bausteine oder Ladungen."
                : "Überdimensioniert: Ein einfacheres Modell reicht hier bereits aus.",
          ),
          read("boundary", "Modellgrenze des Vorgängermodells", (v) =>
            [
              "Ohne Eigenbewegung der Teilchen bliebe Diffusion unerklärbar.",
              "Das einfache Teilchenmodell kennt keine verschiedenen Atomsorten für Stoffumwandlungen.",
              "Daltons ungeladene Kugeln erklären keine beweglichen Ladungsträger in Salzschmelzen.",
              "Ohne Energiestufen der Atomhülle lässt sich farbiges Emissionslicht nicht deuten.",
            ][v.phenomenon],
          ),
        ],
        [
          goal("mg-1", "Erkläre die Diffusion mit dem einfachen Teilchenmodell", (v) => v.phenomenon === 0 && v.model === 0),
          goal("mg-2", "Deute die Wasserelektrolyse mit dem Daltonschen Atommodell", (v) => v.phenomenon === 1 && v.model === 1),
          goal("mg-3", "Erkläre die Leitfähigkeit der Salzschmelze mit dem Ionengittermodell", (v) => v.phenomenon === 2 && v.model === 2),
          goal("mg-4", "Deute die gelbe Natriumflamme mit dem Energiestufenmodell", (v) => v.phenomenon === 3 && v.model === 3),
        ],
      );
    }

    case "kenngroessen":
      return lab(
        kind,
        "Stofferkennung über messbare Kenngrößen",
        "Wähle eine Stoffprobe und verändere das Probenvolumen V (auch per Ziehen am Messzylinder). Vergleiche Masse m und die mengenunabhängige Dichte ρ = m / V.",
        [
          choice("sample", "Untersuchte Probe", SUBSTANCES.map((s) => `${s.name} (${s.formula})`), 0),
          range("vol", "Probenvolumen V", 10, 50, 10, 5, "cm³"),
        ],
        [
          read("mass", "Gemessene Masse m", (v) => round(SUBSTANCES[v.sample].density * v.vol, 1), "g", 1),
          read("density", "Dichte ρ = m / V", (v) => SUBSTANCES[v.sample].density, "g/cm³", 2),
          read(
            "temps",
            "Schmelz- / Siedetemperatur",
            (v) => `${fmtTemp(SUBSTANCES[v.sample].mp)} / ${fmtTemp(SUBSTANCES[v.sample].bp)}`,
          ),
          read(
            "cond",
            "Elektrische Leitfähigkeit",
            (v) =>
              `fest: ${SUBSTANCES[v.sample].condSolid ? "leitet" : "leitet nicht"} · flüssig/gelöst: ${SUBSTANCES[v.sample].condLiquid ? "leitet" : "leitet nicht"}`,
          ),
        ],
        [
          goal("kg-1", "Miss an Aluminium bei V = 30 cm³ die Masse 81 g bei konstanter Dichte 2,70 g/cm³", (v) => v.sample === 0 && v.vol === 30),
          goal("kg-2", "Untersuche Kochsalz ab V = 20 cm³: fest Nichtleiter, flüssig/gelöst Leiter", (v) => v.sample === 3 && v.vol >= 20),
          goal("kg-3", "Prüfe die farblose Flüssigkeit Ethanol über Dichte (0,79 g/cm³) und Siedepunkt (78 °C)", (v) => v.sample === 5),
        ],
      );

    case "siedekurve":
      return lab(
        kind,
        "Siedepunkt vs. Siedebereich im Erhitzungsversuch",
        "Vergleiche reines Wasser (w = 0 %) mit Salzwasser-Lösungen. Ziehe den Messpunkt entlang der Erhitzungszeit.",
        [
          range("salt", "Massenanteil Kochsalz w", 0, 20, 0, 5, "%"),
          range("time", "Erhitzungsdauer t", 0, 12, 0, 1, "min"),
        ],
        [
          read("temp", "Aktuelle Temperatur ϑ", (v) => heatingCurveTemp(v.salt, v.time), "°C", 1),
          read("kind", "Stoffklasse", (v) => (v.salt === 0 ? "Reinstoff (konstanter Siedepunkt 100 °C)" : `Homogenes Gemisch (${v.salt} % Lösung, Siedebereich)`)),
          read("boiling", "Zustand beim Sieden", (v) => {
            const t = heatingCurveTemp(v.salt, v.time);
            if (v.time < 6) return "Erwärmungsphase (flüssig)";
            return v.salt === 0
              ? "Waagrechtes Siedeplateau bei 100 °C"
              : `Siedebereich: Temperatur klettert weiter (${fmt(t, 1)} °C)`;
          }),
        ],
        [
          goal("sk-1", "Erreiche bei reinem Wasser (0 %) ab Minute 8 das konstante Siedeplateau bei 100 °C", (v) => v.salt === 0 && v.time >= 8),
          goal("sk-2", "Beobachte bei 10 % Salzlösung ab Minute 7 den erhöhten Siedebeginn über 100 °C", (v) => v.salt === 10 && v.time >= 7),
          goal("sk-3", "Verfolge bei 20 % Salzlösung bis Minute 12 den ansteigenden Siedebereich", (v) => v.salt === 20 && v.time === 12),
        ],
      );

    case "teilchenmodell":
      return lab(
        kind,
        "Teilchenmodell und Phasenübergänge",
        "Verändere die Temperatur ϑ am Thermometer und beobachte Teilchenanordnung, Teilchenabstand und Eigenbewegung.",
        [
          choice("substance", "Stoff", PHASE_SUBSTANCES.map((s) => `${s.name} (${s.formula})`), 0),
          range("temp", "Temperatur ϑ", -100, 140, 20, 20, "°C"),
        ],
        [
          read("state", "Aggregatzustand", (v) => stateOfMatter(PHASE_SUBSTANCES[v.substance], v.temp)),
          read("motion", "Teilchenebene", (v) => {
            const st = stateOfMatter(PHASE_SUBSTANCES[v.substance], v.temp);
            if (st === "fest") return "Feste Gitterplätze, geringer Abstand, Schwingung am Platz";
            if (st === "flüssig") return "Geringer Abstand, Teilchen gleiten ungeordnet aneinander vorbei";
            return "Große Abstände, schnelle freie Bewegung im ganzen Raum";
          }),
          read("transition", "Besonderheit", (v) =>
            PHASE_SUBSTANCES[v.substance].sublimates
              ? `Sublimiert / resublimiert direkt bei ${fmtTemp(PHASE_SUBSTANCES[v.substance].mp, 1)}`
              : `Schmelzpunkt ${fmtTemp(PHASE_SUBSTANCES[v.substance].mp)}, Siedepunkt ${fmtTemp(PHASE_SUBSTANCES[v.substance].bp)}`,
          ),
        ],
        [
          goal("tm-1", "Lasse Wasser unter 0 °C erstarren und prüfe das regelmäßige Teilchengitter", (v) => v.substance === 0 && v.temp <= -20),
          goal("tm-2", "Verdampfe Wasser oberhalb von 100 °C in frei fliegende Gasteilchen", (v) => v.substance === 0 && v.temp >= 120),
          goal("tm-3", "Sublimiere festes Iod bei 120 °C direkt in den gasförmigen Zustand", (v) => v.substance === 2 && v.temp >= 120),
        ],
      );

    case "trennwerkstatt": {
      const mixtures = [
        "Sand-Salzwasser-Suspension (heterogen)",
        "Eisen-Schwefel-Gemenge (heterogen)",
        "Ethanol-Wasser-Lösung (homogen)",
        "Kräuteröl in festen Blattfasern",
      ];
      const methods = [
        "Filtration (Trennprinzip: Partikelgröße)",
        "Magnetscheiden (Trennprinzip: Ferromagnetismus)",
        "Destillation (Trennprinzip: Siedetemperatur)",
        "Extraktion (Trennprinzip: Löslichkeit im Extraktionsmittel)",
      ];
      return lab(
        kind,
        "Trennwerkstatt: Gemisch und Trennverfahren",
        "Ordne jedem Stoffgemisch das physikalische Trennverfahren zu, das genau den passenden Eigenschaftsunterschied nutzt.",
        [choice("mixture", "Stoffgemisch", mixtures, 0), choice("method", "Trennverfahren", methods, 2)],
        [
          read("match", "Trennwirkung", (v) =>
            v.mixture === v.method
              ? "Erfolgreiche Trennung! Die ausgenutzte Stoffeigenschaft passt exakt zum Gemisch."
              : [
                  "Für ungelösten Sand im Salzwasser nutzt man zuerst die Partikelgröße an der Filterpore.",
                  "Eisen ist im Gemenge ferromagnetisch, Schwefel nicht – nutze den Magneten.",
                  "Ethanol (78 °C) und Wasser (100 °C) passieren jedes Filterpapier gemeinsam; trenne über den Siedepunkt.",
                  "Ein passendes Lösungsmittel löst das Öl selektiv aus den unlöslichen Pflanzenfasern heraus.",
                ][v.mixture],
          ),
          read("fractions", "Erhaltene Fraktionen", (v) =>
            v.mixture === v.method
              ? [
                  "Filterrückstand: Sand · Filtrat: klare Salzlösung",
                  "Am Magnetpol: Eisenpulver · Zurückbleibend: gelber Schwefel",
                  "Destillat: leichtsiedendes Ethanol · Sumpf: höher siedendes Wasser",
                  "Extrakt: gelöstes Kräuteröl · Rückstand: unlösliche Zellfasern",
                ][v.mixture]
              : "Keine saubere Auftrennung",
          ),
        ],
        [
          goal("tw-1", "Trenne Sand aus der Salzwasser-Suspension durch Filtration ab", (v) => v.mixture === 0 && v.method === 0),
          goal("tw-2", "Trenne das Eisen-Schwefel-Gemenge durch Magnetscheiden", (v) => v.mixture === 1 && v.method === 1),
          goal("tw-3", "Trenne die homogene Ethanol-Wasser-Lösung durch Destillation", (v) => v.mixture === 2 && v.method === 2),
          goal("tw-4", "Gewinne das Kräuteröl durch selektive Extraktion", (v) => v.mixture === 3 && v.method === 3),
        ],
      );
    }

    case "linde":
      return lab(
        kind,
        "Luftzerlegung im Linde-Verfahren",
        "Reinige die Luft von H₂O und CO₂ und fahre die Temperatur in der Rektifikationskolonne schrittweise von −205 °C auf −175 °C.",
        [
          choice("preclean", "Vorreinigung der Luft", ["Ungereinigt (enthält noch H₂O und CO₂)", "Getrocknet und CO₂-frei"], 0),
          range("temp", "Kolonnentemperatur ϑ", -205, -175, -175, 3, "°C"),
        ],
        [
          read("pipe", "Anlagenzustand", (v) =>
            v.preclean === 0
              ? "Blockiert: Wasserdampf (0 °C) und CO₂ (−78,5 °C) frieren fest und verstopfen die Rohre!"
              : lindeFractionation(v.temp).summary,
          ),
          read("states", "Zustände N₂ / Ar / O₂", (v) => {
            const f = lindeFractionation(v.temp);
            return `N₂ (${fmtTemp(-196)}): ${f.n2} · Ar (${fmtTemp(-186)}): ${f.ar} · O₂ (${fmtTemp(-183)}): ${f.o2}`;
          }),
        ],
        [
          goal("li-1", "Entferne H₂O und CO₂ und verflüssige die Luft unter −196 °C vollständig", (v) => v.preclean === 1 && v.temp <= -199),
          goal("li-2", "Stelle zwischen −193 °C und −187 °C ein, sodass nur Stickstoff (N₂) gasförmig abzieht", (v) => v.preclean === 1 && v.temp >= -193 && v.temp <= -187),
          goal("li-3", "Erhalte bei −184 °C flüssigen Sauerstoff im Sumpf, während N₂ und Ar gasförmig sind", (v) => v.preclean === 1 && v.temp === -184),
        ],
      );

    case "elementklassen":
      return lab(
        kind,
        "Stoffbezogenes Ordnungssystem: Metalle und Nichtmetalle",
        "Untersuche acht Elemente bei wählbarer Temperatur nach Glanz, Leitfähigkeit, Dichte und Aggregatzustand.",
        [
          choice("element", "Element", ELEMENT_SYSTEM.map((e) => `${e.name} (${e.symbol})`), 0),
          range("temp", "Prüftemperatur ϑ", -60, 140, 20, 20, "°C"),
        ],
        [
          read("kind", "Stoffklasse", (v) => ELEMENT_SYSTEM[v.element].kind),
          read("state", "Aggregatzustand bei ϑ", (v) => {
            const el = ELEMENT_SYSTEM[v.element];
            return elementStateAt(el, v.temp);
          }),
          read("props", "Dichte und Leitfähigkeit", (v) => {
            const el = ELEMENT_SYSTEM[v.element];
            return `ρ = ${fmt(el.density, 2)} g/cm³ · ${el.conductive ? "leitet elektrischen Strom" : "Nichtleiter (Isolator)"}`;
          }),
          read("look", "Erscheinungsbild", (v) => ELEMENT_SYSTEM[v.element].appearance),
        ],
        [
          goal("ek-1", "Untersuche Quecksilber und kühle das flüssige Metall unter −39 °C bis zum Erstarren ab", (v) => v.element === 3 && v.temp <= -40),
          goal("ek-2", "Finde mit Kohlenstoff (Graphit) das elektrisch leitfähige Nichtmetall", (v) => v.element === 5),
          goal("ek-3", "Schmelze gelben Schwefel ab 120 °C und bestätige seine fehlende Leitfähigkeit", (v) => v.element === 4 && v.temp >= 120),
        ],
      );

    case "teilchenverbaende": {
      const assemblies = [
        "Kupfer (Cu) – Metallgitter",
        "Natriumchlorid (NaCl) – Ionengitter",
        "Wasser (H₂O) – Moleküle",
        "Argon (Ar) – einzelne Edelgasatome",
      ];
      return lab(
        kind,
        "Vier Teilchenverbände und ihre Anziehungskräfte",
        "Vergleiche die Grundbausteine, die Art der Anziehung (gerichtet vs. ungerichtet) und die passende Formelschreibweise.",
        [
          choice("assembly", "Stoffbeispiel", assemblies, 0),
          range("heat", "Wärmebewegung", 0, 2, 0, 1, "Stufe"),
        ],
        [
          read("building", "Grundbausteine", (v) =>
            [
              "Metallatome / Metallkationen mit frei beweglichen Elektronen",
              "Positiv geladene Kationen (Na⁺) und negativ geladene Anionen (Cl⁻)",
              "Abgeschlossene H₂O-Moleküle aus Nichtmetallatomen",
              "Einzelne ungebundene Edelgasatome (atomar aufgebaut)",
            ][v.assembly],
          ),
          read("force", "Anziehungskräfte", (v) =>
            [
              "Starke, ungerichtete Anziehung in alle Raumrichtungen im Metallgitter",
              "Starke, ungerichtete elektrostatische Anziehung im Ionengitter",
              "Starke gerichtete Bindung im Molekül; nur schwache Anziehung zwischen Molekülen",
              "Nahezu keine Anziehung zwischen den einzelnen Atomen (Gas)",
            ][v.assembly],
          ),
          read("formulaType", "Formelart", (v) =>
            ["Elementsymbol Cu", "Verhältnisformel NaCl (1 : 1)", "Molekülformel H₂O", "Elementsymbol Ar"][v.assembly],
          ),
        ],
        [
          goal("tv-1", "Untersuche das Ionengitter von Natriumchlorid bei erhöhter Wärmebewegung", (v) => v.assembly === 1 && v.heat >= 1),
          goal("tv-2", "Erhitze Wasser auf Stufe 2: Moleküle trennen sich voneinander, bleiben aber H₂O", (v) => v.assembly === 2 && v.heat === 2),
          goal("tv-3", "Betrachte Argon als atomar aufgebautes Edelgas aus einzelnen Atomen", (v) => v.assembly === 3),
        ],
      );
    }

    case "bindigkeit":
      return lab(
        kind,
        "Molekülbaukasten über die Bindigkeit",
        "Wähle zwei Nichtmetall-Atomsorten und stelle ihre Atomzahlen so ein, dass alle Bindungsarme vollständig abgesättigt sind.",
        [
          choice("pair", "Nichtmetall-Paar", BINDIGKEIT_PAIRS.map((p) => `${p.symA} (${p.bA}-bindig) + ${p.symB} (${p.bB}-bindig)`), 0),
          range("nA", "Anzahl Atome A", 1, 2, 1, 1, ""),
          range("nB", "Anzahl Atome B", 1, 4, 1, 1, ""),
        ],
        [
          read("arms", "Bindungsarme A vs. B", (v) => {
            const p = BINDIGKEIT_PAIRS[v.pair];
            return `${v.nA} · ${p.bA} = ${v.nA * p.bA} Arme (${p.symA}) · ${v.nB} · ${p.bB} = ${v.nB * p.bB} Arme (${p.symB})`;
          }),
          read("formula", "Molekülformel und Name", (v) => {
            const p = BINDIGKEIT_PAIRS[v.pair];
            if (v.nA * p.bA !== v.nB * p.bB) return "Offene Bindungsarme – noch kein stabiles Molekül";
            const f = binaryMoleculeFormula(p.symA, v.nA, p.symB, v.nB);
            const sys = binaryNonmetalName(p.nameA, v.nA, p.stemB, v.nB);
            return `${f} (${p.common} / ${sys})`;
          }),
        ],
        [
          goal("bi-1", "Baue ein abgesättigtes Methanmolekül (CH₄)", (v) => v.pair === 0 && v.nA === 1 && v.nB === 4),
          goal("bi-2", "Baue ein abgesättigtes Ammoniakmolekül (NH₃)", (v) => v.pair === 1 && v.nA === 1 && v.nB === 3),
          goal("bi-3", "Baue Kohlenstoffdioxid (CO₂) mit vierbindigem C und zweibindigem O", (v) => v.pair === 3 && v.nA === 1 && v.nB === 2),
        ],
      );

    case "salzverhaeltnis":
      return lab(
        kind,
        "Ladungswaage binärer Salze",
        "Wähle Kation und Anion und gleiche die Gesamtladezahl auf 0 im kleinsten ganzzahligen Zahlenverhältnis aus.",
        [
          choice("cat", "Metall-Kation", LAB_CATIONS.map((c) => `${ionText(c.symbol, c.charge)} (${c.name})`), 0),
          choice("an", "Nichtmetall-Anion", LAB_ANIONS.map((a) => `${ionText(a.symbol, a.charge)} (${a.stem})`), 0),
          range("nc", "Zahlenanteil Kationen", 1, 3, 1, 1, ""),
          range("na", "Zahlenanteil Anionen", 1, 3, 2, 1, ""),
        ],
        [
          read("net", "Ladungsbilanz", (v) => {
            const c = LAB_CATIONS[v.cat];
            const a = LAB_ANIONS[v.an];
            const net = v.nc * c.charge + v.na * a.charge;
            return `${v.nc} · (+${c.charge}) + ${v.na} · (${fmtSigned(a.charge)}) = ${fmtSigned(net)}`;
          }),
          read("salt", "Verhältnisformel und Salzname", (v) => {
            const c = LAB_CATIONS[v.cat];
            const a = LAB_ANIONS[v.an];
            const [rc, ra] = saltRatio(c.charge, a.charge);
            if (v.nc * c.charge + v.na * a.charge !== 0) return "Noch elektrisch geladen – kein neutrales Salz";
            if (v.nc !== rc || v.na !== ra) return `Ladungsneutral, aber noch kürzbar auf ${rc} : ${ra} (${saltFormula(c, a)})`;
            return `${saltFormula(c, a)} · ${saltName(c, a)} (${rc} : ${ra})`;
          }),
        ],
        [
          goal("sv-1", "Stelle Magnesiumchlorid (MgCl₂) im Verhältnis 1 : 2 auf", (v) => v.cat === 1 && v.an === 0 && v.nc === 1 && v.na === 2),
          goal("sv-2", "Gleiche Aluminiumoxid (Al₂O₃) im Verhältnis 2 : 3 ladungsneutral aus", (v) => v.cat === 2 && v.an === 1 && v.nc === 2 && v.na === 3),
          goal("sv-3", "Bilde Eisen(III)-oxid (Fe₂O₃) und beachte die römische Ladungszahl (III)", (v) => v.cat === 4 && v.an === 1 && v.nc === 2 && v.na === 3),
        ],
      );

    case "gitterverschiebung":
      return lab(
        kind,
        "Gitterverschiebung: Verformbarkeit vs. Sprödigkeit",
        "Ziehe die obere Teilchenschicht nach rechts oder schmelze den Stoff, um Verformbarkeit, Sprödigkeit und Leitfähigkeit zu erklären.",
        [
          choice("substance", "Teilchenverband", ["Kupfer (Metallgitter)", "Natriumchlorid (Ionengitter)", "Iod (Molekülgitter)"], 0),
          range("shift", "Schichtverschiebung", 0, 1, 0, 0.5, "Einheiten"),
          choice("molten", "Zustand", ["Festkörper", "Schmelze (flüssig)"], 0),
        ],
        [
          read("mech", "Mechanisches Verhalten", (v) => {
            if (v.molten === 1) return "Flüssige Schmelze: Teilchen sind frei gegeneinander beweglich";
            if (v.substance === 0)
              return v.shift > 0
                ? "Verformbar (duktil): Elektronengas hält die verschobenen Metallkationen weiter zusammen"
                : "Ruhelage im Metallgitter";
            if (v.substance === 1)
              return v.shift === 0.5
                ? "Spröde! Gleichnamig geladene Ionen (+/+ und −/−) stoßen sich ab → Kristall bricht"
                : "Anziehung ungleichnamiger Ionen (+/−) im Ionengitter";
            return v.shift > 0
              ? "Schwache Kräfte zwischen neutralen Molekülen geben leicht nach"
              : "Geordnete Moleküle mit schwacher Zwischenmolekülanziehung";
          }),
          read("cond", "Elektrische Leitfähigkeit", (v) => {
            if (v.substance === 0) return "Leitet (frei bewegliche Elektronen in Festkörper und Schmelze)";
            if (v.substance === 1)
              return v.molten === 1
                ? "Leitet (Ionen sind in der Schmelze frei beweglich)"
                : "Leitet nicht (Ionen sitzen fest auf Gitterplätzen)";
            return "Leitet nicht (neutrale Moleküle, keine Ladungsträger)";
          }),
        ],
        [
          goal("gv-1", "Verschiebe das feste Metallgitter um 0,5 Einheiten: duktile Verformung ohne Bruch", (v) => v.substance === 0 && v.shift === 0.5 && v.molten === 0),
          goal("gv-2", "Verschiebe das feste Ionengitter um 0,5 Einheiten: Abstoßung gleichnamiger Ionen spaltet das Salz", (v) => v.substance === 1 && v.shift === 0.5 && v.molten === 0),
          goal("gv-3", "Schmelze das Salz und mache seine Ionen als Ladungsträger beweglich", (v) => v.substance === 1 && v.molten === 1),
        ],
      );

    case "umgruppierung": {
      const processes = [
        "Kerzenwachs schmilzt in einer Schale",
        "Eisen- und Schwefelpulver glühen nach Zündung auf",
        "Wasser siedet im Becherglas zu Wasserdampf",
        "Magnesiumband verbrennt mit grellweißer Flamme an der Luft",
      ];
      return lab(
        kind,
        "Stoffänderung als Atomumgruppierung",
        "Vergleiche physikalische Zustandsänderungen und chemische Reaktionen vor und nach dem Vorgang auf Stoff- und Teilchenebene.",
        [choice("process", "Vorgang", processes, 0), choice("stage", "Zeitpunkt", ["Vor dem Vorgang", "Nach dem Vorgang"], 0)],
        [
          read("type", "Klassifikation", (v) =>
            v.process === 0 || v.process === 2
              ? "Physikalischer Vorgang (kein neuer Stoff, Teilchen bleiben identisch)"
              : "Chemische Reaktion (Stoffumsatz + Energieumsatz durch Atomumgruppierung)",
          ),
          read("particles", "Teilchenebene", (v) => {
            if (v.stage === 0)
              return [
                "Wachsmoleküle geordnet im festen Zustand",
                "Eisenatome (Fe) und Schwefelatome (S) liegen getrennt nebeneinander",
                "H₂O-Moleküle dicht beieinander im flüssigen Wasser",
                "Mg-Atome im Metallgitter und O₂-Moleküle in der Luft",
              ][v.process];
            return [
              "Dieselben Wachsmoleküle gleiten nun flüssig aneinander vorbei",
              "Atome neu gruppiert zu schwarzem, unmagnetischem Eisen(II)-sulfid (FeS)",
              "Unveränderte H₂O-Moleküle mit großem Abstand im Wasserdampf",
              "Umgruppierung zu weißem, sprödem Magnesiumoxid (2 Mg + O₂ → 2 MgO)",
            ][v.process];
          }),
        ],
        [
          goal("ug-1", "Untersuche geschmolzenes Kerzenwachs als rein physikalischen Vorgang", (v) => v.process === 0 && v.stage === 1),
          goal("ug-2", "Verfolge die Atomumgruppierung von Eisen und Schwefel zu Eisen(II)-sulfid", (v) => v.process === 1 && v.stage === 1),
          goal("ug-3", "Prüfe die Magnesiumverbrennung zu Magnesiumoxid auf Teilchenebene", (v) => v.process === 3 && v.stage === 1),
        ],
      );
    }

    case "stoffsystematik":
      return lab(
        kind,
        "Element, Verbindung und Gemisch im Vergleich",
        "Vergleiche die Elemente Eisen und Schwefel, ihr Gemenge und die Verbindung Eisen(II)-sulfid im Teilchenbild und mit dem Magneten.",
        [
          choice("sample", "Untersuchte Probe", ["Eisenpulver (Element Fe)", "Schwefelpulver (Element S)", "Eisen-Schwefel-Gemenge", "Eisen(II)-sulfid (Verbindung FeS)"], 0),
          choice("test", "Untersuchung", ["Teilchenbild und Zusammensetzung", "Stabmagnet annähern"], 0),
        ],
        [
          read("class", "Einordnung", (v) =>
            [
              "Reinstoff → Element (nur Eisenatome)",
              "Reinstoff → Element (nur Schwefelatome)",
              "Heterogenes Stoffgemisch (Gemenge in beliebigem Mischungsverhältnis)",
              "Reinstoff → Chemische Verbindung (Fe und S fest im Verhältnis 1 : 1 gebunden)",
            ][v.sample],
          ),
          read("magnet", "Befund", (v) => {
            if (v.test === 0)
              return [
                "Nur eine Atomsorte (Fe), metallisch grau, Dichte 7,87 g/cm³",
                "Nur eine Atomsorte (S), gelbes Pulver, Dichte 2,07 g/cm³",
                "Fe- und S-Körner liegen unverändert nebeneinander",
                "Neues Teilchengitter aus Eisen- und Sulfid-Bausteinen mit neuen Kenngrößen",
              ][v.sample];
            return [
              "Eisenpulver wird vollständig vom Magneten angezogen",
              "Schwefel wird vom Magneten nicht angezogen",
              "Physikalisch trennbar: Der Magnet zieht die Eisenkörner aus dem Gemenge heraus!",
              "Nicht magnetisch: Eisen(II)-sulfid hat völlig neue Eigenschaften und lässt sich nicht magnetisch trennen",
            ][v.sample];
          }),
        ],
        [
          goal("ss-1", "Ziehe aus dem Eisen-Schwefel-Gemenge das Eisen mit dem Stabmagneten heraus", (v) => v.sample === 2 && v.test === 1),
          goal("ss-2", "Weise mit dem Magneten nach, dass die Verbindung Eisen(II)-sulfid nicht ferromagnetisch ist", (v) => v.sample === 3 && v.test === 1),
          goal("ss-3", "Prüfe das feste Teilchenverhältnis 1 : 1 von Eisen(II)-sulfid im Teilchenbild", (v) => v.sample === 3 && v.test === 0),
        ],
      );

    case "hofmann":
      return lab(
        kind,
        "Analyse und Synthese: Wasser und Diiodpentoxid",
        "Untersuche das Volumenverhältnis 2 : 1 im Hofmannschen Wasserzersetzungsapparat, die Thermolyse von Diiodpentoxid und die Umkehrreaktion.",
        [
          choice("reaction", "Versuch", [
            "Elektrolyse von Wasser (Hofmann-Apparat)",
            "Thermische Analyse von Diiodpentoxid (2 I₂O₅ → 2 I₂ + 5 O₂)",
            "Synthese von Wasser aus Knallgas (2 H₂ + O₂ → 2 H₂O)",
          ], 0),
          range("amount", "Umgesetzter Fortschritt", 0, 30, 0, 5, "Einheiten"),
        ],
        [
          read("volumes", "Stoff- und Volumenbilanz", (v) => {
            if (v.reaction === 0) return `V(H₂) = ${2 * v.amount} ml · V(O₂) = ${v.amount} ml · Verhältnis ${v.amount > 0 ? "2 : 1" : "Start"}`;
            if (v.reaction === 1) return `Violetter Ioddampf + V(O₂) = ${round(v.amount * 1.5, 1)} ml (Glimmspanprobe positiv)`;
            return `Aus ${2 * v.amount} ml H₂ und ${v.amount} ml O₂ entstehen flüssige Wassertropfen`;
          }),
          read("energy", "Reaktionstyp und Energie", (v) =>
            [
              "Analyse (endotherm, ständige Zufuhr elektrischer Energie) → bestätigt Formel H₂O",
              "Analyse einer zweiten Molekülverbindung (endotherm durch Erhitzen)",
              "Synthese (stark exotherm) → Umkehrreaktion beweist die Reversibilität",
            ][v.reaction],
          ),
        ],
        [
          goal("hf-1", "Zersetze Wasser im Hofmann-Apparat bis mindestens 20 ml H₂ und 10 ml O₂ (2 : 1) vorliegen", (v) => v.reaction === 0 && v.amount >= 10),
          goal("hf-2", "Führe die thermische Analyse von Diiodpentoxid durch", (v) => v.reaction === 1 && v.amount >= 10),
          goal("hf-3", "Kehre die Wasseranalyse durch die exotherme Wassersynthese um", (v) => v.reaction === 2 && v.amount >= 10),
        ],
      );

    case "gleichungswaage":
      return lab(
        kind,
        "Atomwaage: Massenerhaltung und Formelgleichungen",
        "Verändere ausschließlich die stöchiometrischen Koeffizienten vor den Formeln, bis links und rechts von jeder Atomsorte gleich viele Atome stehen.",
        [
          choice("rx", "Reaktion", EQUATION_REACTIONS.map((r) => r.title), 0),
          range("a", "Koeffizient a", 1, 5, 1, 1, ""),
          range("b", "Koeffizient b", 1, 5, 1, 1, ""),
          range("c", "Koeffizient c", 1, 4, 1, 1, ""),
        ],
        [
          read("eq", "Aktuelle Gleichung", (v) => {
            const r = EQUATION_REACTIONS[v.rx];
            const fa = v.a === 1 ? "" : `${v.a} `;
            const fb = v.b === 1 ? "" : `${v.b} `;
            const fc = v.c === 1 ? "" : `${v.c} `;
            return r.isDecomposition
              ? `${fc}${r.rightFormula} → ${fa}${r.leftFormulas[0]} + ${fb}${r.leftFormulas[1]}`
              : `${fa}${r.leftFormulas[0]} + ${fb}${r.leftFormulas[1]} → ${fc}${r.rightFormula}`;
          }),
          read("atoms", "Atombilanz (Lavoisier)", (v) => {
            const r = EQUATION_REACTIONS[v.rx];
            const parts = r.atoms.map((at) => {
              const sideAB = v.a * at.counts[0] + v.b * at.counts[1];
              const sideC = v.c * at.counts[2];
              const left = r.isDecomposition ? sideC : sideAB;
              const right = r.isDecomposition ? sideAB : sideC;
              return `${at.symbol}: ${left} = ${right} ${left === right ? "✓" : "✗"}`;
            });
            return parts.join(" · ");
          }),
        ],
        [
          goal("gw-1", "Gleiche die Wassersynthese 2 H₂ + O₂ → 2 H₂O aus", (v) => v.rx === 0 && v.a === 2 && v.b === 1 && v.c === 2),
          goal("gw-2", "Gleiche die Aluminiumverbrennung 4 Al + 3 O₂ → 2 Al₂O₃ aus", (v) => v.rx === 2 && v.a === 4 && v.b === 3 && v.c === 2),
          goal("gw-3", "Gleiche die Diiodpentoxid-Analyse 2 I₂O₅ → 2 I₂ + 5 O₂ aus", (v) => v.rx === 3 && v.a === 2 && v.b === 5 && v.c === 2),
        ],
      );

    case "energiediagramm":
      return lab(
        kind,
        "Energiediagramm: Innere Energie, Aktivierung und Katalyse",
        "Verändere die innere Energie von Edukten und Produkten (auch per Ziehen im Diagramm) und schalte einen Katalysator zu.",
        [
          range("ee", "Innere Energie Edukte Eᵢ(Ed.)", 40, 80, 60, 20, "kJ"),
          range("ep", "Innere Energie Produkte Eᵢ(Pr.)", 20, 100, 60, 20, "kJ"),
          range("ea", "Aktivierungsenergie E_A (unkat.)", 20, 80, 40, 20, "kJ"),
          choice("cat", "Katalysator", ["Ohne Katalysator", "Mit Katalysator (halbiert E_A)"], 0),
        ],
        [
          read("deltaE", "Reaktionsenergie ΔEᵢ", (v) => fmtSigned(v.ep - v.ee, 0, "kJ")),
          read("eaEff", "Wirksame Aktivierungsenergie E_A", (v) => (v.cat === 1 ? v.ea / 2 : v.ea), "kJ", 0),
          read("course", "Reaktionsverlauf", (v) => {
            if (v.ep < v.ee) return "Exotherm (ΔEᵢ < 0): Energie wird an die Umgebung abgegeben";
            if (v.ep > v.ee) return "Endotherm (ΔEᵢ > 0): Energie wird aus der Umgebung aufgenommen";
            return "Energiegleichstand (ΔEᵢ = 0 kJ): Verändere Eᵢ(Produkte) für exotherm oder endotherm";
          }),
        ],
        [
          goal("ed-1", "Stelle einen exothermen Verlauf (ΔEᵢ < 0) ohne Katalysator ein", (v) => v.ep < v.ee && v.cat === 0),
          goal("ed-2", "Stelle einen endothermen Verlauf (ΔEᵢ > 0) ein", (v) => v.ep > v.ee),
          goal("ed-3", "Schalte bei einer exothermen Reaktion den Katalysator zu: E_A sinkt, ΔEᵢ bleibt gleich", (v) => v.ep < v.ee && v.cat === 1),
        ],
      );

    case "katalyse":
      return lab(
        kind,
        "Oberflächenkatalyse im Teilchenmodell",
        "Verfolge die vier Schritte einer katalysierten Molekülreaktion (2 CO + O₂ → 2 CO₂) an einer Platinoberfläche.",
        [
          range("step", "Reaktionsschritt", 0, 4, 0, 1, ""),
          choice("surface", "Katalysatorform", ["Glattes Platinblech (kleine Fläche)", "Fein beschichtete Wabenstruktur (große Oberfläche)"], 0),
        ],
        [
          read("phase", "Vorgang an der Oberfläche", (v) =>
            [
              "0 · Anströmung: CO- und O₂-Moleküle nähern sich aus dem Gasraum",
              "1 · Adsorption: Eduktmoleküle lagern sich an aktive Zentren der Oberfläche an",
              "2 · Bindungslockerung: Die O=O-Bindung wird auf dem Platin geschwächt und gespalten",
              "3 · Oberflächenreaktion: Gebundene O-Atome verknüpfen sich mit CO zu CO₂",
              "4 · Desorption: CO₂-Moleküle lösen sich ab – der Katalysator bleibt unverändert frei!",
            ][v.step],
          ),
          read("rate", "Umsatzgeschwindigkeit", (v) =>
            v.surface === 1
              ? "Hoch: Viele aktive Oberflächenplätze wirken gleichzeitig"
              : "Mäßig: Nur wenige Plätze auf dem glatten Blech verfügbar",
          ),
        ],
        [
          goal("ka-1", "Untersuche Schritt 2 (Bindungslockerung an der Katalysatoroberfläche)", (v) => v.step === 2),
          goal("ka-2", "Durchlaufe bis Schritt 4 (Desorption): Der Katalysator geht unverändert hervor", (v) => v.step === 4),
          goal("ka-3", "Nutze die fein beschichtete Wabenstruktur für maximale Oberfläche ab Schritt 3", (v) => v.surface === 1 && v.step >= 3),
        ],
      );

    case "molmasse":
      return lab(
        kind,
        "Teilchenmasse, Avogadro-Konstante und molare Masse",
        "Vergleiche die Masse eines einzelnen Atoms/Moleküls in 10⁻²⁴ g mit 1 mol (6,022 · 10²³ Teilchen) auf der Laborwaage.",
        [
          choice("species", "Teilchensorte", PARTICLE_SPECIES.map((s) => `${s.name} (${s.formula})`), 0),
          range("moles", "Stoffmenge n", 0.5, 3.0, 1.0, 0.5, "mol"),
        ],
        [
          read("mSingle", "Absolute Teilchenmasse", (v) => `${fmt(PARTICLE_SPECIES[v.species].massE24g, 2)} · 10⁻²⁴ g (= ${fmt(PARTICLE_SPECIES[v.species].massU, 1)} u)`),
          read("molar", "Molare Masse M = m(Teilchen) · N_A", (v) => molarMassFromParticleMassE24(PARTICLE_SPECIES[v.species].massE24g), "g/mol", 1),
          read("massTotal", "Abgewogene Masse m = n · M", (v) => round(v.moles * PARTICLE_SPECIES[v.species].molarMass, 2), "g", 2),
          read("count", "Teilchenzahl N = n · N_A", (v) => `${fmt(v.moles * AVOGADRO_E23, 2)} · 10²³`),
        ],
        [
          goal("mm-1", "Bestätige am Wassermolekül (H₂O): 29,89 · 10⁻²⁴ g · N_A = 18 g/mol", (v) => v.species === 4 && v.moles === 1),
          goal("mm-2", "Wiege 2,0 mol Kohlenstoffdioxid (CO₂) mit der Gesamtmasse 88 g ab", (v) => v.species === 7 && v.moles === 2),
          goal("mm-3", "Bestimme die Masse von 0,5 mol Methan (CH₄) zu 8 g", (v) => v.species === 5 && v.moles === 0.5),
        ],
      );

    case "quantitaetsgroessen": {
      const gases = [
        { formula: "H₂", name: "Wasserstoff", M: 2 },
        { formula: "O₂", name: "Sauerstoff", M: 32 },
        { formula: "CO₂", name: "Kohlenstoffdioxid", M: 44 },
        { formula: "CH₄", name: "Methan", M: 16 },
      ];
      return lab(
        kind,
        "Gasspritze: Stoffmenge, Masse und molares Volumen",
        "Ziehe den Kolben der Gasspritze für die Stoffmenge n (Normbedingungen 0 °C, 1013 hPa: Vₘ = 22,4 l/mol). Gleiche Stoffmengen verschiedener Gase nehmen dasselbe Volumen ein!",
        [
          choice("gas", "Gasprobe", gases.map((g) => `${g.name} (${g.formula}, M = ${g.M} g/mol)`), 0),
          range("n", "Stoffmenge n", 0.5, 3.0, 0.5, 0.5, "mol"),
        ],
        [
          read("vol", "Gasvolumen V = n · Vₘ", (v) => round(v.n * VM_NORM, 1), "l", 1),
          read("mass", "Masse m = n · M", (v) => round(v.n * gases[v.gas].M, 1), "g", 1),
          read("density", "Gasdichte ρ = m / V", (v) => round(gases[v.gas].M / VM_NORM, 2), "g/l", 2),
          read("particles", "Teilchenzahl N", (v) => `${fmt(v.n * AVOGADRO_E23, 2)} · 10²³`),
        ],
        [
          goal("qg-1", "Stelle genau n = 1,0 mol ein und lies das molare Normvolumen 22,4 l ab", (v) => v.n === 1),
          goal("qg-2", "Fülle 2,0 mol Sauerstoff (O₂) ein: m = 64 g bei V = 44,8 l", (v) => v.gas === 1 && v.n === 2),
          goal("qg-3", "Bestimme für 1,5 mol Kohlenstoffdioxid (CO₂) m = 66 g und V = 33,6 l", (v) => v.gas === 2 && v.n === 1.5),
        ],
      );
    }

    case "stoffumsatz":
      return lab(
        kind,
        "Stoffumsatz-Rechner für Molekülreaktionen",
        "Verfolge den Dreischritt m₁ → n₁ → n₂ → m₂ / V₂ anhand der ausgeglichenen Reaktionsgleichung.",
        [
          choice("rx", "Reaktion", STOICH_REACTIONS.map((r) => r.equation), 0),
          range("mEdukt", "Masse Ausgangsstoff m₁", 4, 32, 4, 4, "g"),
        ],
        [
          read("n1", "1. Stoffmenge Edukt n₁ = m₁ / M₁", (v) => round(v.mEdukt / STOICH_REACTIONS[v.rx].eduktM, 2), "mol", 2),
          read("n2", "2. Stoffmenge Produkt n₂", (v) => {
            const r = STOICH_REACTIONS[v.rx];
            return round((v.mEdukt / r.eduktM) * (r.produktNu / r.eduktNu), 2);
          }, "mol", 2),
          read("m2", "3. Masse Produkt m₂ = n₂ · M₂", (v) => {
            const r = STOICH_REACTIONS[v.rx];
            const n2 = (v.mEdukt / r.eduktM) * (r.produktNu / r.eduktNu);
            return round(n2 * r.produktM, 1);
          }, "g", 1),
          read("v2", "Gasvolumen Produkt (Normbed.)", (v) => {
            const r = STOICH_REACTIONS[v.rx];
            if (!r.produktIsGas) return "flüssiges Wasser (kein ideales Gas bei 0 °C)";
            const n2 = (v.mEdukt / r.eduktM) * (r.produktNu / r.eduktNu);
            return `${fmt(round(n2 * VM_NORM, 1), 1)} l`;
          }),
        ],
        [
          goal("su-1", "Setze 12 g Kohlenstoff (1 mol) vollständig zu 44 g (22,4 l) CO₂ um", (v) => v.rx === 1 && v.mEdukt === 12),
          goal("su-2", "Setze 28 g Stickstoff (N₂) im Verhältnis 1 : 2 zu 34 g Ammoniak (NH₃) um", (v) => v.rx === 2 && v.mEdukt === 28),
          goal("su-3", "Verbrenne 16 g Methan (CH₄) vollständig zu 44 g Kohlenstoffdioxid", (v) => v.rx === 3 && v.mEdukt === 16),
        ],
      );

    case "alkanverbrennung":
      return lab(
        kind,
        "Homologe Reihe der Alkane und Verbrennungsarten",
        "Wähle die Kettenlänge n des Alkans (CₙH₂ₙ₊₂) und verändere die Sauerstoffzufuhr am Brenner.",
        [
          range("n", "Kettenlänge n (Zahl der C-Atome)", 1, 6, 1, 1, ""),
          choice("oxygen", "Luft- / Sauerstoffzufuhr", ["Stark gedrosselt (Sauerstoffmangel)", "Eingeschränkt", "Voll geöffnet (ausreichend O₂)"], 2),
        ],
        [
          read("alkane", "Alkan und molare Masse", (v) => `${ALKANE_NAMES[v.n]} (${alkaneFormula(v.n)}, M = ${alkaneMolarMass(v.n)} g/mol)`),
          read("flame", "Flamme und Verlauf", (v) => {
            const c = alkaneCombustion(v.n, v.oxygen);
            return `${c.mode} · ${c.flame}`;
          }),
          read("eq", "Reaktionsgleichung", (v) => alkaneCombustion(v.n, v.oxygen).equation),
        ],
        [
          goal("av-1", "Untersuche Propan (C₃H₈) bei vollständiger Verbrennung zu CO₂ und H₂O", (v) => v.n === 3 && v.oxygen === 2),
          goal("av-2", "Stelle eingeschränkte Luftzufuhr ein: Bildung von giftigem Kohlenstoffmonoxid (CO)", (v) => v.oxygen === 1),
          goal("av-3", "Beobachte bei Butan (C₄H₁₀) unter starkem O₂-Mangel die rußende Flamme", (v) => v.n === 4 && v.oxygen === 0),
        ],
      );

    case "abgasreinigung":
      return lab(
        kind,
        "Abgasstrang: Drei-Wege-Katalysator und Partikelfilter",
        "Prüfe den Einfluss der Betriebstemperatur sowie von Abgaskatalysator und Partikelfilter auf Kohlenstoffmonoxid (CO) und Ruß (C).",
        [
          range("temp", "Abgastemperatur ϑ", 100, 500, 100, 100, "°C"),
          choice("kat", "Abgaskatalysator", ["Ohne Katalysator", "Mit Drei-Wege-Katalysator (Pt/Rh-Waben)"], 0),
          choice("filter", "Partikelfilter", ["Ohne Partikelfilter", "Mit Wandstrom-Partikelfilter"], 0),
        ],
        [
          read("co", "Kohlenstoffmonoxid (CO)", (v) => {
            if (v.kat === 0) return "Unverändert hoch im Abgas (Atemgift!)";
            if (v.temp < 300) return "Kaltstart (< 300 °C): Katalysator erreicht noch nicht den vollen Umsatz";
            return "Zu über 95 % an der Edelmetalloberfläche zu CO₂ umgesetzt (2 CO + O₂ → 2 CO₂)";
          }),
          read("soot", "Rußpartikel (Feinstaub C)", (v) =>
            v.filter === 0
              ? "Gelangen ungehindert in die Atemluft"
              : v.temp >= 500
                ? "Zurückgehalten und bei hoher Temperatur zu CO₂ regeneriert"
                : "Mechanisch in den porösen Filterwänden zurückgehalten",
          ),
        ],
        [
          goal("ar-1", "Bringe den Drei-Wege-Katalysator auf Betriebstemperatur (≥ 300 °C) zur CO-Umwandlung", (v) => v.kat === 1 && v.temp >= 300),
          goal("ar-2", "Prüfe den Partikelfilter einzeln beim Zurückhalten von Rußpartikeln", (v) => v.filter === 1 && v.kat === 0),
          goal("ar-3", "Kombiniere warmen Katalysator (≥ 400 °C) und Partikelfilter zur vollen Abgasreinigung", (v) => v.kat === 1 && v.filter === 1 && v.temp >= 400),
        ],
      );

    case "verbrennungsfaktoren":
      return lab(
        kind,
        "Verbrennungsfaktoren, Explosion und Brandschutz",
        "Untersuche Zerteilungsgrad (Oberfläche), Sauerstoffgehalt (Luft vs. reiner Sauerstoff) und Schutzmaßnahmen.",
        [
          choice("form", "Brennstoff und Oberfläche", ["Kompakter Eisennagel (kleine Oberfläche)", "Feine Eisenwolle (große Oberfläche)", "Aufgewirbelter Mehlstaub (riesige Oberfläche im Gemisch)"], 0),
          choice("o2", "Umgebungsgas", ["Luft (21 % Sauerstoff)", "Reiner Sauerstoff (100 % O₂)"], 0),
          choice("measure", "Eingriff", ["Zündquelle anlegen", "Sauerstoffzufuhr ersticken (Löschdecke / CO₂)", "Staubwolke und Zündquellen vermeiden"], 0),
        ],
        [
          read("obs", "Beobachtung im Versuch", (v) => {
            if (v.measure === 1) return "Feuer erlischt: Ohne Sauerstoff ist das Verbrennungsdreieck unterbrochen";
            if (v.measure === 2) return "Keine Explosion: Außerhalb eines zündfähigen Staub-Luft-Gemischs keine Durchzündung";
            if (v.form === 0) return v.o2 === 0 ? "Nagel glüht nur schwach an der Oberfläche, brennt nicht weiter" : "Nagelspitze glüht kräftig, reagiert aber begrenzt";
            if (v.form === 1) return v.o2 === 0 ? "Eisenwolle glüht ruhig durch" : "Heftiges Funkensprühen und Weißglut in reinem Sauerstoff!";
            return "Schlagartige Staubexplosion mit Druckwelle durch riesige Kontaktfläche!";
          }),
          read("triangle", "Verbrennungsdreieck", (v) =>
            v.measure === 0
              ? "Erfüllt: Brennbarer Stoff + Sauerstoff + Zündtemperatur"
              : v.measure === 1
                ? "Löschprinzip Ersticken: Sauerstoff entzogen"
                : "Explosionsschutz: Explosionsfähiges Gemisch und Zündquelle vermieden",
          ),
        ],
        [
          goal("vf-1", "Vergleiche feine Eisenwolle in reinem Sauerstoff mit Zündquelle", (v) => v.form === 1 && v.o2 === 1 && v.measure === 0),
          goal("vf-2", "Beobachte die Explosionsgefahr von aufgewirbeltem Mehlstaub mit Zündquelle", (v) => v.form === 2 && v.measure === 0),
          goal("vf-3", "Leite für Mehlstaub die vorbeugende Schutzmaßnahme gegen Staubexplosionen ab", (v) => v.form === 2 && v.measure === 2),
        ],
      );

    case "kohlenstoffkreislauf": {
      const fuels = [
        { name: "Steinkohle (fossil)", co2PerKg: 3.3, fossil: true },
        { name: "Erdgas / Methan (fossil)", co2PerKg: 2.75, fossil: true },
        { name: "Holz aus nachhaltiger Forstwirtschaft", co2PerKg: 1.8, fossil: false },
        { name: "Grüner Wasserstoff (aus Wind-/Solarstrom)", co2PerKg: 0, fossil: false },
      ];
      return lab(
        kind,
        "CO₂-Bilanz und Kohlenstoff-Kreislauf",
        "Vergleiche fossile und erneuerbare Energieträger nach direktem CO₂-Ausstoß und ihrer Wirkung auf den atmosphärischen Kohlenstoff-Kreislauf.",
        [
          choice("fuel", "Energieträger", fuels.map((f) => f.name), 0),
          range("massKg", "Verbrannte Brennstoffmasse", 1, 5, 1, 1, "kg"),
        ],
        [
          read("direct", "Direkt freigesetztes CO₂", (v) => round(fuels[v.fuel].co2PerKg * v.massKg, 2), "kg", 2),
          read("net", "Wirkung auf atmosphärisches CO₂", (v) => {
            const f = fuels[v.fuel];
            if (v.fuel === 3) return "0 kg CO₂: Verbrennungsprodukt ist ausschließlich Wasser (2 H₂ + O₂ → 2 H₂O)";
            if (!f.fossil)
              return "Kurzfristiger Kreislauf: Nachwachsende Bäume nahmen zuvor dieselbe CO₂-Menge per Fotosynthese auf";
            return `Zusätzlicher Anstieg um +${fmt(round(f.co2PerKg * v.massKg, 2), 2)} kg CO₂ aus Jahrmillionen alten Lagerstätten`;
          }),
        ],
        [
          goal("kk-1", "Untersuche mindestens 2 kg fossiles Erdgas und den zusätzlichen CO₂-Anstieg", (v) => v.fuel === 1 && v.massKg >= 2),
          goal("kk-2", "Prüfe nachhaltiges Holz im kurzfristigen Kohlenstoff-Kreislauf", (v) => v.fuel === 2),
          goal("kk-3", "Wähle grünen Wasserstoff ohne direkte CO₂-Freisetzung", (v) => v.fuel === 3),
        ],
      );
    }

    case "rutherford": {
      const nuclides = [
        { sym: "⁴₂He", name: "Helium-4", z: 2, a: 4 },
        { sym: "¹²₆C", name: "Kohlenstoff-12", z: 6, a: 12 },
        { sym: "²³₁₁Na", name: "Natrium-23", z: 11, a: 23 },
        { sym: "¹⁹⁷₇₉Au", name: "Gold-197 (Goldfolie)", z: 79, a: 197 },
      ];
      return lab(
        kind,
        "Rutherfordscher Streuversuch und Kern-Hülle-Modell",
        "Verändere den Trefferabstand b des α-Teilchens zum Atomkern (auch per Ziehen) und bestimme Protonen, Neutronen und Elektronen.",
        [
          range("b", "Trefferabstand b zum Kern", 0, 80, 80, 10, "pm"),
          choice("nuclide", "Atomkern", nuclides.map((n) => `${n.name} (${n.sym})`), 0),
        ],
        [
          read("scatter", "Flugbahn des α-Teilchens", (v) => {
            if (v.b === 0) return "Rückprall (> 150°)! Winziger, positiv geladener Kern trägt fast die gesamte Masse";
            if (v.b <= 30) return "Deutliche Ablenkung durch elektrische Abstoßung am positiven Atomkern";
            return "Geradliniger Durchflug: Die Atomhülle ist nahezu leerer Raum";
          }),
          read("particles", "Grundbausteine im neutralen Atom", (v) => {
            const n = nuclides[v.nuclide];
            return `${n.z} Protonen (p⁺) · ${n.a - n.z} Neutronen (n⁰) · ${n.z} Elektronen (e⁻)`;
          }),
        ],
        [
          goal("ru-1", "Lenke ein α-Teilchen nahe am Goldkern (b = 20 pm) deutlich ab", (v) => v.nuclide === 3 && v.b === 20),
          goal("ru-2", "Erzeuge bei b = 0 pm den seltenen Rückprall am massereichen Atomkern", (v) => v.b === 0),
          goal("ru-3", "Bestimme an Natrium-23 bei großem Abstand (b ≥ 40 pm) 11 p⁺, 12 n⁰ und 11 e⁻", (v) => v.nuclide === 2 && v.b >= 40),
        ],
      );
    }

    case "energiestufen":
      return lab(
        kind,
        "Energiestufenmodell, Ionisierungsenergie und Flammenfärbung",
        "Wähle ein Element (Z = 1 bis 20) und untersuche seine Schalenbesetzung, Valenzelektronen, den Ionisierungssprung und die Flammenfarbe.",
        [range("z", "Ordnungszahl Z (Protonenzahl)", 1, 20, 1, 1, "")],
        [
          read("el", "Element", (v) => {
            const el = PSE_ELEMENTS[v.z - 1];
            return `${el.name} (${el.symbol}), Periode ${el.period}, Hauptgruppe ${ROMAN_GROUP[el.hauptgruppe]}`;
          }),
          read("shells", "Besetzung der Energiestufen", (v) => {
            const el = PSE_ELEMENTS[v.z - 1];
            return `${el.shells.map((c, i) => `Stufe ${i + 1}: ${c} e⁻`).join(" · ")} (${valenceElectrons(el)} Valenzelektronen)`;
          }),
          read("jump", "Ionisierungssprung und Flamme", (v) => {
            const el = PSE_ELEMENTS[v.z - 1];
            const val = valenceElectrons(el);
            const jump =
              el.period === 1
                ? "Nur 1 Energiestufe besetzt (kein Schalensprung)"
                : `Großer Energiesprung nach Abspaltung von ${val} Außenelektron${val === 1 ? "" : "en"}`;
            return `${jump} · Flamme: ${el.flameColor}`;
          }),
        ],
        [
          goal("es-1", "Untersuche Natrium (Z = 11): Besetzung 2, 8, 1 und gelb-orange Flammenfärbung", (v) => v.z === 11),
          goal("es-2", "Prüfe das Edelgas Neon (Z = 10) mit voll besetzter zweiter Energiestufe (2, 8)", (v) => v.z === 10),
          goal("es-3", "Stelle Calcium (Z = 20) mit 4 Energiestufen (2, 8, 8, 2) und ziegelroter Flamme ein", (v) => v.z === 20),
        ],
      );

    case "pse-ionen":
      return lab(
        kind,
        "Periodensystem, Edelgasregel und Ionenladung",
        "Lies aus Periode und Hauptgruppe den Atombau ab und prüfe, welches Kation oder Anion nach der Edelgasregel entsteht.",
        [
          range("z", "Ordnungszahl Z", 1, 20, 6, 1, ""),
          choice("mode", "Betrachtung", ["Neutrales Atom", "Ion mit Edelgaskonfiguration"], 0),
        ],
        [
          read("pse", "Stellung im PSE", (v) => {
            const el = PSE_ELEMENTS[v.z - 1];
            const note = el.z === 2 ? " (Ausnahme Helium: 2 Außenelektronen!)" : ` (${valenceElectrons(el)} Valenzelektronen)`;
            return `${el.name} (${el.symbol}) · ${el.period}. Periode · Hauptgruppe ${ROMAN_GROUP[el.hauptgruppe]}${note}`;
          }),
          read("ion", "Teilchen und Elektronenkonfiguration", (v) => {
            const el = PSE_ELEMENTS[v.z - 1];
            if (v.mode === 0) return `Atom ${el.symbol}: ${el.z} p⁺, ${el.z} e⁻ (${el.shells.join(" · ")})`;
            if (el.ionCharge === 0) return `${el.symbol} besitzt bereits Edelgaskonfiguration – bildet keine Ionen`;
            if (el.ionCharge === null) return `${el.symbol} bildet in C8 bevorzugt Elektronenpaarbindungen statt einfacher Ionen`;
            const ionElectrons = el.z - el.ionCharge;
            const noble = PSE_ELEMENTS.find((n) => n.z === ionElectrons);
            return `Ion ${ionText(el.symbol, el.ionCharge)}: ${el.z} p⁺, ${ionElectrons} e⁻ (${noble ? `${noble.symbol}-Konfiguration ${noble.shells.join(" · ")}` : `${ionElectrons} e⁻`})`;
          }),
        ],
        [
          goal("pi-1", "Prüfe Helium (Z = 2) im Atomzustand: Hauptgruppe VIII trotz nur 2 Außenelektronen", (v) => v.z === 2 && v.mode === 0),
          goal("pi-2", "Bilde aus Magnesium (Z = 12) das Mg²⁺-Kation mit Neon-Konfiguration (2 · 8)", (v) => v.z === 12 && v.mode === 1),
          goal("pi-3", "Bilde aus Chlor (Z = 17) das Cl⁻-Anion mit Argon-Konfiguration (2 · 8 · 8)", (v) => v.z === 17 && v.mode === 1),
        ],
      );

    case "kugelwolken":
      return lab(
        kind,
        "Kugelwolkenmodell der Atomhülle",
        "Verfolge für Z = 1 bis 18, wie sich die Außenelektronen erst einzeln und erst ab dem 5. Valenzelektron paarweise auf vier Kugelwolken verteilen.",
        [range("z", "Ordnungszahl Z", 1, 18, 2, 1, "")],
        [
          read("element", "Element und Valenzelektronen", (v) => {
            const el = PSE_ELEMENTS[v.z - 1];
            return `${el.name} (${el.symbol}) · ${valenceElectrons(el)} Valenzelektronen auf Stufe ${el.period}`;
          }),
          read("clouds", "Äußere Kugelwolken", (v) => {
            const kw = kugelwolkenConfig(v.z);
            return `${kw.pairs} doppelt besetzt (Paare) · ${kw.singles} einfach besetzt · ${kw.empty} leer`;
          }),
          read("bind", "Abgeleitete Bindigkeit", (v) => `${kugelwolkenConfig(v.z).bindigkeit} (entspricht den einfach besetzten Kugelwolken)`),
        ],
        [
          goal("kw-1", "Stelle Kohlenstoff (Z = 6) ein: 4 einfach besetzte Kugelwolken → Bindigkeit 4", (v) => v.z === 6),
          goal("kw-2", "Stelle Stickstoff (Z = 7) ein: 1 doppelt und 3 einfach besetzte Kugelwolken", (v) => v.z === 7),
          goal("kw-3", "Stelle Sauerstoff (Z = 8) ein: 2 doppelt und 2 einfach besetzte Kugelwolken → Bindigkeit 2", (v) => v.z === 8),
        ],
      );

    case "isotopie":
      return lab(
        kind,
        "Isotopenmischer: Nicht ganzzahlige molare Massen",
        "Ziehe den prozentualen Anteil des leichteren Isotops und beobachte, wie sich die mittlere molare Masse M als gewichteter Mittelwert ergibt.",
        [
          choice("element", "Element", ISOTOPE_PAIRS.map((p) => `${p.name} (⁸${p.a1}/${p.a2} ${p.symbol}, Z = ${p.z})`.replace("⁸", "")), 0),
          range("pct", "Anteil leichteres Isotop", 0, 100, 100, 5, "%"),
        ],
        [
          read("nuclides", "Beide Isotope (gleiche Protonenzahl Z)", (v) => {
            const p = ISOTOPE_PAIRS[v.element];
            return `${p.symbol}-${p.a1}: ${p.z} p⁺, ${p.a1 - p.z} n⁰ (${v.pct} %) · ${p.symbol}-${p.a2}: ${p.z} p⁺, ${p.a2 - p.z} n⁰ (${100 - v.pct} %)`;
          }),
          read("molar", "Mittlere molare Masse M", (v) => {
            const p = ISOTOPE_PAIRS[v.element];
            return averageMolarMass(p.a1, p.a2, v.pct);
          }, "g/mol", 2),
        ],
        [
          goal("is-1", "Stelle für Chlor 75 % Cl-35 und 25 % Cl-37 ein → M = 35,50 g/mol", (v) => v.element === 0 && v.pct === 75),
          goal("is-2", "Stelle für Bor das natürliche Verhältnis 20 % B-10 und 80 % B-11 ein → M = 10,80 g/mol", (v) => v.element === 2 && v.pct === 20),
          goal("is-3", "Prüfe an Brom ein 50:50-Isotopengemisch aus Br-79 und Br-81 → M = 80,00 g/mol", (v) => v.element === 3 && v.pct === 50),
        ],
      );
    default:
      throw new Error(`Unknown lab kind: ${kind}`);
  }
}
