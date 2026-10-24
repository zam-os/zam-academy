import {
  ACIDS,
  acidName,
  alkanolName,
  ANIONS,
  CATIONS,
  carbonOxidation,
  esterFormula,
  esterName,
  esterSum,
  FATTY_ACIDS,
  fatFormula,
  fatState,
  FUELS,
  functionalCarbon,
  indicatorColor,
  INDICATORS,
  ionFormula,
  LATTICE_SALTS,
  oxidationStepFormula,
  oxidationStepName,
  oxText,
  photosynthesis,
  saltFormula,
  saltName,
  saltRatio,
  temperatureRise,
  titrationPh,
} from "../chemistry/model";
import { fmt } from "../exercises/format";
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
): LabReadout => ({ key, label, compute, unit, emphasis: true });
const goal = (id: string, text: string, check: LabGoal["check"]): LabGoal => ({ id, text, check });
const lab = (
  kind: LabKind,
  title: string,
  intro: string,
  params: LabParam[],
  readouts: LabReadout[],
  goals: LabGoal[],
): LabDefinition => ({ kind, title, intro, params, readouts, goals });

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
      "Schutzbrille und Schutzhandschuhe, nur unter Aufsicht",
      "Nur im Abzug arbeiten, Gefäß geschlossen halten",
      "Von Flammen und Funken fernhalten",
      "Nicht in den Ausguss: in den passenden Sammelbehälter",
    ],
    cases: [
      {
        name: "Ethanol mit dem Piktogramm Flamme",
        observation:
          "Die Flamme (GHS02) kennzeichnet entzündbare Stoffe. Ethanoldämpfe können sich an einer Brennerflamme entzünden.",
        answer: 2,
      },
      {
        name: "Natronlauge mit dem Piktogramm Ätzwirkung",
        observation:
          "Ätzwirkung (GHS05) bedeutet: schwere Augen- und Hautschäden möglich. Schutzbrille und Handschuhe sind Pflicht.",
        answer: 0,
      },
      {
        name: "Brom mit Totenkopf und giftigen Dämpfen",
        observation:
          "Brom ist giftig und verdampft leicht (GHS06). Mit Brom arbeitet nur die Lehrkraft, im Abzug.",
        answer: 1,
      },
      {
        name: "Kupfer(II)-sulfat-Lösung mit dem Piktogramm Umwelt",
        observation:
          "Schwermetallionen schädigen Gewässerorganismen (GHS09). Reste kommen in den Sammelbehälter für Schwermetalle.",
        answer: 3,
      },
    ],
  },
  planen: {
    title: "Vom Alltag zur Hypothese",
    options: ["Hypothese", "Beobachtung", "Deutung", "Variablenkontrolle"],
    cases: [
      {
        name: "„Wenn das Wasser wärmer ist, löst sich die Brausetablette schneller auf.“",
        observation:
          "Eine Hypothese ist eine prüfbare Vermutung: Sie sagt voraus, was im Versuch passieren soll.",
        answer: 0,
      },
      {
        name: "„Es steigen Gasbläschen auf, die Tablette wird kleiner.“",
        observation: "Das ist eine Beobachtung: Man sieht es, ohne etwas zu erklären.",
        answer: 1,
      },
      {
        name: "„In warmem Wasser stoßen die Teilchen häufiger und heftiger zusammen.“",
        observation: "Das ist eine Deutung auf Teilchenebene: Sie erklärt die Beobachtung.",
        answer: 2,
      },
      {
        name: "„Beide Gläser enthalten 200 ml Wasser und dieselbe Tablettensorte.“",
        observation:
          "Variablenkontrolle: Nur die Temperatur wird verändert, alles andere bleibt gleich. Sonst wäre das Ergebnis nicht eindeutig.",
        answer: 3,
      },
    ],
  },
  proton: {
    title: "Chlorwasserstoff und Ammoniak in Wasser",
    options: [
      "Wasser nimmt ein Proton auf (Base)",
      "Wasser gibt ein Proton ab (Säure)",
      "Kein Protonenübergang",
    ],
    cases: [
      {
        name: "Chlorwasserstoff wird in Wasser eingeleitet",
        observation:
          "Die Lösung leitet den Strom, Universalindikator wird rot: HCl + H₂O → H₃O⁺ + Cl⁻. HCl ist Protonendonator, H₂O Protonenakzeptor.",
        answer: 0,
      },
      {
        name: "Ammoniak wird in Wasser eingeleitet",
        observation:
          "Die Lösung leitet schwach, Universalindikator wird blau: NH₃ + H₂O ⇌ NH₄⁺ + OH⁻. Hier ist H₂O Protonendonator.",
        answer: 1,
      },
      {
        name: "Chlorwasserstoff wird in Heptan eingeleitet",
        observation:
          "Keine Leitfähigkeit, kein Farbumschlag. Ohne Wassermoleküle als Protonenakzeptor entstehen keine Ionen.",
        answer: 2,
      },
    ],
  },
  kohlenstoff: {
    title: "Kohlenstoff nachweisen",
    options: [
      "Kohlenstoff direkt: schwarzer Rückstand (Verkohlung)",
      "Kohlenstoff indirekt: CO₂ trübt Kalkwasser",
      "Kein Hinweis auf Kohlenstoff",
    ],
    cases: [
      {
        name: "Haushaltszucker wird im Reagenzglas stark erhitzt",
        observation:
          "Der Zucker schmilzt, wird braun und schließlich schwarz; am Glas kondensiert Wasser. Der schwarze Rückstand ist Kohlenstoff.",
        answer: 0,
      },
      {
        name: "Die Abgase einer Kerze werden durch Kalkwasser geleitet",
        observation:
          "Das Kalkwasser trübt sich: Es ist Kohlenstoffdioxid entstanden. Sein Kohlenstoff stammt aus dem Kerzenwachs.",
        answer: 1,
      },
      {
        name: "Kochsalz wird stark erhitzt",
        observation:
          "Das Salz bleibt weiß, es wird nicht schwarz und es entsteht kein CO₂. Natriumchlorid enthält keinen Kohlenstoff.",
        answer: 2,
      },
    ],
  },
  rohstoffe: {
    title: "Rohstoffe einordnen",
    options: [
      "Fossiler Rohstoff",
      "Nachwachsender Rohstoff",
      "Kein Rohstoff aus Biomasse",
    ],
    cases: [
      {
        name: "Erdgas aus einer Lagerstätte",
        observation:
          "Erdgas entstand über Millionen Jahre aus abgestorbenem Plankton. Beim Verbrennen wird Kohlenstoff frei, der lange gebunden war: zusätzliches CO₂.",
        answer: 0,
      },
      {
        name: "Rapsöl für Biodiesel",
        observation:
          "Raps wächst jedes Jahr nach. Die Fläche fehlt aber womöglich für Nahrungsmittel: Teller oder Tank.",
        answer: 1,
      },
      {
        name: "Braunkohle aus dem Tagebau",
        observation:
          "Kohle entstand aus Pflanzen früherer Erdzeitalter unter Luftabschluss und Druck. Sie wächst nicht in menschlichen Zeiträumen nach.",
        answer: 0,
      },
      {
        name: "Strom aus einer Windkraftanlage",
        observation:
          "Wind ist eine regenerative Energiequelle, aber kein Rohstoff aus Biomasse. Fotosynthese spielt hier keine Rolle.",
        answer: 2,
      },
    ],
  },
  aminogruppen: {
    title: "Funktionelle Gruppen nachweisen",
    options: [
      "Aminogruppe (–NH₂)",
      "Carboxygruppe (–COOH)",
      "Peptidbindungen eines Proteins",
    ],
    cases: [
      {
        name: "Glycin mit Natronlauge erhitzen, feuchtes Indikatorpapier darüber",
        observation:
          "Das Indikatorpapier färbt sich blau: Ammoniak entweicht. Sein Stickstoff stammt aus der Aminogruppe.",
        answer: 0,
      },
      {
        name: "Glutaminsäure-Lösung mit Universalindikator",
        observation:
          "Die Lösung färbt sich orange-rot: Glutaminsäure hat eine zusätzliche Carboxygruppe, die Protonen abgeben kann.",
        answer: 1,
      },
      {
        name: "Eiklar-Lösung mit Biuret-Reagenz",
        observation:
          "Die Lösung wird violett. Die Biuret-Probe zeigt Peptidbindungen: mindestens zwei davon in einem Molekül.",
        answer: 2,
      },
    ],
  },
  denaturierung: {
    title: "Eiklar unter Belastung",
    options: [
      "Denaturiert: Raumstruktur zerstört, Aminosäuresequenz bleibt",
      "Nicht denaturiert",
      "Peptidbindungen gespalten: Primärstruktur zerlegt",
    ],
    cases: [
      {
        name: "Eiklar wird auf 80 °C erhitzt",
        observation:
          "Das Eiklar wird weiß und fest. Wasserstoffbrücken und andere Wechselwirkungen der Raumstruktur brechen auf; die Kette bleibt.",
        answer: 0,
      },
      {
        name: "Eiklar wird mit Ethanol versetzt",
        observation: "Das Eiweiß flockt weiß aus: Ethanol stört die Raumstruktur.",
        answer: 0,
      },
      {
        name: "Eiklar wird mit Kupfer(II)-sulfat-Lösung versetzt",
        observation:
          "Ein Niederschlag fällt aus. Schwermetallionen denaturieren Proteine; deshalb sind sie für den Menschen giftig.",
        answer: 0,
      },
      {
        name: "Eiklar wird mit kaltem Wasser verdünnt",
        observation: "Die Lösung bleibt klar. Verdünnen verändert die Raumstruktur nicht.",
        answer: 1,
      },
      {
        name: "Eiweiß wird im Darm verdaut",
        observation:
          "Enzyme spalten Peptidbindungen: Es entstehen Aminosäuren. Das ist mehr als eine Denaturierung.",
        answer: 2,
      },
    ],
  },
  zucker: {
    title: "Welcher Zucker ist in der Probe?",
    options: ["Glucose", "Fructose", "Saccharose"],
    cases: [
      {
        name: "Probe A",
        observation:
          "Glucoseteststäbchen: positiv. Seliwanow-Probe: in der Versuchszeit keine Rotfärbung. Die Probe enthält Glucose.",
        answer: 0,
      },
      {
        name: "Probe B",
        observation:
          "Glucoseteststäbchen: negativ, auch nach Kochen mit verdünnter Säure. Seliwanow-Probe: schnell rot. Die Probe enthält Fructose.",
        answer: 1,
      },
      {
        name: "Probe C",
        observation:
          "Glucoseteststäbchen: erst negativ, nach Kochen mit verdünnter Säure und Neutralisieren positiv. Seliwanow-Probe: rot. Die Säure spaltet Saccharose in Glucose und Fructose.",
        answer: 2,
      },
    ],
  },
  glycerin: {
    title: "Vom Befund zur Struktur des Glycerins",
    options: [
      "Drei Hydroxygruppen: viele Wasserstoffbrücken",
      "Kohlenstoff im Molekül",
      "Unpolares Molekül ohne funktionelle Gruppe",
    ],
    cases: [
      {
        name: "Glycerin mischt sich in jedem Verhältnis mit Wasser",
        observation:
          "Die OH-Gruppen bilden Wasserstoffbrücken zu Wassermolekülen: Glycerin ist hydrophil.",
        answer: 0,
      },
      {
        name: "Glycerin ist zähflüssig und siedet erst bei etwa 290 °C",
        observation:
          "Jedes Molekül bildet über drei OH-Gruppen viele Wasserstoffbrücken: Die Moleküle haften stark aneinander.",
        answer: 0,
      },
      {
        name: "Glycerin verbrennt, das Abgas trübt Kalkwasser",
        observation:
          "Kohlenstoffdioxid ist entstanden: Glycerin ist eine organische Verbindung mit Kohlenstoffgerüst.",
        answer: 1,
      },
    ],
  },
  verwertung: {
    title: "Wohin mit dem Kunststoffabfall?",
    options: [
      "Werkstoffliches Recycling",
      "Rohstoffliches Recycling (Pyrolyse)",
      "Energetische Verwertung (Verbrennung)",
    ],
    cases: [
      {
        name: "Sortenreine PET-Flaschen",
        observation:
          "Die Flaschen werden zu Granulat zerkleinert und wieder zu Flaschen oder Fasern geformt. Die Polymerketten bleiben erhalten.",
        answer: 0,
      },
      {
        name: "Gemischte, verschmutzte Kunststoffe",
        observation:
          "Unter Luftausschluss erhitzt zerfallen die Ketten zu Ölen und Gasen, aus denen wieder Chemikalien entstehen.",
        answer: 1,
      },
      {
        name: "Nicht sortierbarer Restmüll mit Kunststoffanteil",
        observation:
          "Im Müllheizkraftwerk liefert der Kunststoff Wärme und Strom. Der Rohstoff ist danach verloren; es entsteht CO₂.",
        answer: 2,
      },
    ],
  },
  oekobilanz: {
    title: "Drei Werkstoffe im Vergleich",
    options: ["Polyethen aus Erdöl", "Polymilchsäure aus Maisstärke", "Silikon"],
    cases: [
      {
        name: "Der Rohstoff wächst nach, braucht aber Ackerfläche, Wasser und Dünger.",
        observation:
          "Polymilchsäure (PLA) entsteht aus Stärke über Milchsäure. Die Fläche konkurriert mit dem Anbau von Nahrungsmitteln.",
        answer: 1,
      },
      {
        name: "Der Rohstoff ist fossil; beim Verbrennen wird lange gebundener Kohlenstoff als CO₂ frei.",
        observation:
          "Polyethen wird aus Erdöl hergestellt. Es ist leicht und billig, verrottet aber praktisch nicht.",
        answer: 0,
      },
      {
        name: "Die Herstellung aus Quarzsand braucht viel Energie; das Produkt ist hitzebeständig und sehr langlebig.",
        observation:
          "Silikone haben ein Gerüst aus Silicium- und Sauerstoffatomen. Lange Nutzungsdauer kann den hohen Herstellungsaufwand ausgleichen.",
        answer: 2,
      },
      {
        name: "Kompostierbar, aber nur in Industrieanlagen bei hoher Temperatur.",
        observation:
          "PLA zerfällt im Gartenkompost kaum. ‚Bio‘ beschreibt den Rohstoff, nicht automatisch die Entsorgung.",
        answer: 1,
      },
    ],
  },
};

export function experimentLab(kind: LabKind): LabDefinition {
  const experiment = EXPERIMENTS[kind];
  if (!experiment) throw new Error(`No experiment for ${kind}`);
  const definition = lab(
    kind,
    experiment.title,
    "Wähle einen Fall, stelle eine Vermutung auf und starte den Modellversuch. Vergleiche Beobachtung und Deutung. Alle Versuche bleiben digital.",
    [
      choice(
        "case",
        "Fall",
        experiment.cases.map((entry) => entry.name),
      ),
      {
        ...choice("prediction", "Meine Vermutung", experiment.options),
        value: -1,
        options: [
          { value: -1, label: "Bitte wählen" },
          ...experiment.options.map((label, value) => ({ value, label })),
        ],
      },
      { type: "state", key: "observed", value: 0, resetOnChange: true },
    ],
    [
      read("observation", "Beobachtung / Auswertung", (v) =>
        v.observed
          ? experiment.cases[v.case].observation
          : "Erst vermuten, dann Modellversuch starten.",
      ),
      read("comparison", "Vergleich", (v) =>
        !v.observed
          ? "Noch kein Versuch"
          : v.prediction === experiment.cases[v.case].answer
            ? "Vermutung passt zur Beobachtung"
            : "Prüfe deine Vermutung an der Beobachtung.",
      ),
    ],
    experiment.cases.map((entry, index) =>
      goal(
        `case-${index}`,
        `Untersuche „${entry.name}“ und wähle die passende Deutung.`,
        (v) => v.case === index && v.observed === 1 && v.prediction === entry.answer,
      ),
    ),
  );
  definition.actions = [
    {
      id: "run",
      label: "Modellversuch starten",
      apply: (v) => ({ ...v, observed: v.prediction >= 0 ? 1 : 0 }),
    },
  ];
  return definition;
}

/** Metals and non-metals of the ion formation model; Fe forms Fe²⁺ with sulfur. */
export const ION_METALS = [0, 1, 2, 3, 8, 5].map((index) => CATIONS[index]);
export const ION_NONMETALS = [1, 2, 4, 5].map((index) => ANIONS[index]);

/** Redox reactions of the half-equation model: metal, its charge, non-metal and what one molecule accepts. */
export const REDOX_REACTIONS = [
  { metal: "Na", charge: 1, nonmetal: "Cl₂", accepts: 2, ion: "Cl⁻", ions: 2, name: "Natrium + Chlor" },
  { metal: "Mg", charge: 2, nonmetal: "O₂", accepts: 4, ion: "O²⁻", ions: 2, name: "Magnesium + Sauerstoff" },
  { metal: "Al", charge: 3, nonmetal: "O₂", accepts: 4, ion: "O²⁻", ions: 2, name: "Aluminium + Sauerstoff" },
  { metal: "Fe", charge: 2, nonmetal: "S", accepts: 2, ion: "S²⁻", ions: 1, name: "Eisen + Schwefel" },
];

const coeff = (n: number) => (n === 1 ? "" : `${n} `);

export function redoxHalves(reaction: number, ox: number, red: number) {
  const r = REDOX_REACTIONS[reaction];
  const given = ox * r.charge;
  const taken = red * r.accepts;
  const cation = `${r.metal}${r.charge === 1 ? "⁺" : `${["", "", "²", "³"][r.charge]}⁺`}`;
  return {
    oxidation: `${coeff(ox)}${r.metal} → ${coeff(ox)}${cation} + ${given} e⁻`,
    reduction: `${coeff(red)}${r.nonmetal} + ${taken} e⁻ → ${coeff(red * r.ions)}${r.ion}`,
    given,
    taken,
  };
}

const ACID_PARTNERS = [
  { name: "Salzsäure", formula: "HCl", anion: "Cl", charge: 1, salt: "chlorid", protons: 1 },
  { name: "verdünnte Schwefelsäure", formula: "H₂SO₄", anion: "SO₄", charge: 2, salt: "sulfat", protons: 2 },
  { name: "Essigsäure", formula: "CH₃COOH", anion: "CH₃COO", charge: 1, salt: "acetat", protons: 1 },
];
const REACTANTS = [
  { name: "Kalk (CaCO₃)", formula: "CaCO₃", metal: "Ca", element: "Calcium", count: 1, carbonate: true },
  { name: "Soda (Na₂CO₃)", formula: "Na₂CO₃", metal: "Na", element: "Natrium", count: 2, carbonate: true },
  { name: "Magnesium", formula: "Mg", metal: "Mg", element: "Magnesium", count: 1, carbonate: false },
  { name: "Zink", formula: "Zn", metal: "Zn", element: "Zink", count: 1, carbonate: false },
  { name: "Kupfer", formula: "Cu", metal: "Cu", element: "Kupfer", count: 1, carbonate: false },
];
export const CARBONATE_ACIDS = ACID_PARTNERS.map((acid) => acid.name);
export const CARBONATE_REACTANTS = REACTANTS.map((reactant) => reactant.name);

/** Salt, gas and equation of an acidic solution with a carbonate or a metal; copper does not react. */
export function acidReaction(acidIndex: number, reactantIndex: number) {
  const acid = ACID_PARTNERS[acidIndex];
  const reactant = REACTANTS[reactantIndex];
  if (reactant.metal === "Cu")
    return { gas: "kein Gas", test: "—", salt: "keine Reaktion", equation: "Kupfer ist edler als Wasserstoff: keine Reaktion" };
  // Two protons per formula unit: one doubly charged cation or two Na⁺.
  const acids = 2 / acid.protons;
  const cationCharge = reactant.metal === "Na" ? 1 : 2;
  const [c, a] = saltRatio(cationCharge, acid.charge);
  const salts = reactant.count / c;
  const anionPart = a === 1 ? acid.anion : acid.anion.length > 2 ? `(${acid.anion})₂` : `${acid.anion}₂`;
  const saltFormulaText =
    acid.anion === "CH₃COO" && c === 1 && a === 1
      ? `CH₃COO${reactant.metal}`
      : `${reactant.metal}${c === 2 ? "₂" : ""}${anionPart}`;
  const salt = `${reactant.element}${acid.salt}`;
  const gas = reactant.carbonate ? "Kohlenstoffdioxid" : "Wasserstoff";
  const products = reactant.carbonate
    ? `${coeff(salts)}${saltFormulaText} + H₂O + CO₂`
    : `${coeff(salts)}${saltFormulaText} + H₂`;
  return {
    gas,
    test: reactant.carbonate ? "Kalkwasser wird trüb" : "Knallgasprobe positiv",
    salt,
    equation: `${reactant.formula} + ${coeff(acids)}${acid.formula} → ${products}`,
  };
}

/** Molecules of the oxidation number model: name, the carbon looked at, its H atoms and bonds to O. */
export const OX_MOLECULES: Array<{ name: string; atom: string; h: number; o: number }> = [
  { name: "Methan CH₄", atom: "C", h: 4, o: 0 },
  { name: "Methanol CH₃–OH", atom: "C", h: 3, o: 1 },
  { name: "Methanal H–CHO", atom: "C", h: 2, o: 2 },
  { name: "Methansäure H–COOH", atom: "C", h: 1, o: 3 },
  { name: "Kohlenstoffdioxid O=C=O", atom: "C", h: 0, o: 4 },
  { name: "Ethanol CH₃–CH₂–OH", atom: "C1 (mit OH)", h: 2, o: 1 },
  { name: "Ethanal CH₃–CHO", atom: "C1 (CHO)", h: 1, o: 2 },
  { name: "Ethansäure CH₃–COOH", atom: "C1 (COOH)", h: 0, o: 3 },
  { name: "Propan-2-ol CH₃–CH(OH)–CH₃", atom: "C2 (mit OH)", h: 1, o: 1 },
  { name: "Propanon CH₃–CO–CH₃", atom: "C2 (C=O)", h: 0, o: 2 },
];

export const ALCOHOLS = [
  { name: "Ethanol", type: "primär", product: "Ethanal", before: -1, after: 1 },
  { name: "Propan-1-ol", type: "primär", product: "Propanal", before: -1, after: 1 },
  { name: "Propan-2-ol", type: "sekundär", product: "Propanon", before: 0, after: 2 },
  { name: "Butan-2-ol", type: "sekundär", product: "Butanon", before: 0, after: 2 },
];

export const ESTER_SMELLS: Record<string, string> = {
  "1,2": "Rum",
  "2,2": "Klebstoff, Nagellackentferner",
  "2,5": "Banane",
  "4,1": "Apfel",
  "4,2": "Ananas",
};

export const COMPARE_SUBSTANCES = [
  { name: "Butan-1-ol", boiling: 118, bridges: true, water: "mäßig löslich", smell: "alkoholisch" },
  { name: "Propansäure", boiling: 141, bridges: true, water: "mischbar", smell: "stechend-säuerlich" },
  { name: "Ethansäuremethylester", boiling: 57, bridges: false, water: "mäßig löslich", smell: "fruchtig" },
  { name: "Pentan", boiling: 36, bridges: false, water: "praktisch unlöslich", smell: "benzinartig" },
];

export const POLYMERS = [
  { monomer: "Ethen", polymer: "Polyethen (PE)", unit: "–CH₂–CH₂–" },
  { monomer: "Propen", polymer: "Polypropen (PP)", unit: "–CH₂–CH(CH₃)–" },
  { monomer: "Chlorethen", polymer: "Polyvinylchlorid (PVC)", unit: "–CH₂–CHCl–" },
  { monomer: "Styrol (Phenylethen)", polymer: "Polystyrol (PS)", unit: "–CH₂–CH(C₆H₅)–" },
];

export const CONDENSATES = [
  { monomers: "Ethandiol + Benzol-1,4-dicarbonsäure", polymer: "PET (Polyester)", bond: "Esterbindung" },
  { monomers: "Hexan-1,6-diamin + Hexandisäure", polymer: "Nylon (Polyamid)", bond: "Amidbindung" },
  { monomers: "Milchsäure (OH- und COOH-Gruppe)", polymer: "Polymilchsäure PLA (Polyester)", bond: "Esterbindung" },
];

/** Class of a plastic in the crosslink model and its behaviour at a temperature (model limits ≈100 °C and ≈220 °C). */
export function plasticBehaviour(crosslink: number, temperature: number): string {
  if (temperature >= 220) return crosslink === 0 ? "schmilzt und zersetzt sich" : "zersetzt sich, ohne zu schmelzen";
  if (crosslink === 0) return temperature >= 100 ? "erweicht, plastisch formbar" : "fest";
  return crosslink === 1 ? "gummielastisch, schmilzt nicht" : "hart, bleibt formstabil";
}

/** Silicone type from the share of crosslinking MeSiCl₃ units. */
export function siliconeType(mono: number, di: number, tri: number): string {
  if (di + tri === 0) return mono >= 2 ? "kein Polymer: nur kleine Moleküle" : "kein Produkt";
  if (tri === 0) return di >= 4 ? "Silikonöl: unvernetzte Ketten" : "kurze Ketten: noch kein Öl";
  return tri / (di + tri) <= 0.2
    ? "Silikonelastomer: weitmaschig vernetzt"
    : "Silikonharz: engmaschig vernetzt";
}

export function makeLab(kind: LabKind): LabDefinition {
  if (EXPERIMENTS[kind]) return experimentLab(kind);
  switch (kind) {
    case "ionenbildung": {
      const pair = (v: LabValues) => {
        const cation = ION_METALS[v.metal];
        const anion = ION_NONMETALS[v.nonmetal];
        const [c, a] = saltRatio(cation.charge, anion.charge);
        return { cation, anion, c, a, electrons: c * cation.charge };
      };
      return lab(
        kind,
        "Ionen aus den Elementen",
        "Wähle ein Metall und ein Nichtmetall. Das Modell zeigt, wie viele Elektronen je Formeleinheit vom Metall- auf die Nichtmetallatome übergehen.",
        [
          choice(
            "metal",
            "Metall",
            ION_METALS.map((m) => m.element),
          ),
          choice("nonmetal", "Nichtmetall", ["Chlor", "Brom", "Sauerstoff", "Schwefel"], 2),
        ],
        [
          read("cation", "Kation (Elektronendonator)", (v) => ionFormula(pair(v).cation)),
          read("anion", "Anion (Elektronenakzeptor)", (v) => ionFormula(pair(v).anion)),
          read("electrons", "Elektronen je Formeleinheit", (v) => pair(v).electrons),
          read("formula", "Verhältnisformel", (v) => saltFormula(pair(v).cation, pair(v).anion)),
        ],
        [
          goal("nacl", "Bilde Natriumchlorid: ein Elektron je Formeleinheit.", (v) => v.metal === 0 && v.nonmetal === 0),
          goal(
            "two",
            "Bilde ein Salz, bei dem zwei Elektronen von einem Metallatom auf ein Nichtmetallatom übergehen.",
            (_, r) => r.electrons === 2 && !String(r.formula).match(/₂|₃/),
          ),
          goal("six", "Bilde Aluminiumoxid: sechs Elektronen je Formeleinheit.", (v) => v.metal === 4 && v.nonmetal === 2),
        ],
      );
    }
    case "teilgleichung":
      return lab(
        kind,
        "Teilgleichungen ausgleichen",
        "Wähle eine Reaktion und die Faktoren der beiden Teilgleichungen. Erst wenn so viele Elektronen abgegeben wie aufgenommen werden, ergibt sich die Gesamtgleichung.",
        [
          choice(
            "reaction",
            "Reaktion",
            REDOX_REACTIONS.map((r) => r.name),
          ),
          range("ox", "Faktor Oxidation", 1, 4, 1),
          range("red", "Faktor Reduktion", 1, 4, 2),
        ],
        [
          read("oxidation", "Oxidation (Elektronenabgabe)", (v) => redoxHalves(v.reaction, v.ox, v.red).oxidation),
          read("reduction", "Reduktion (Elektronenaufnahme)", (v) => redoxHalves(v.reaction, v.ox, v.red).reduction),
          read("balance", "Elektronenbilanz", (v) => {
            const h = redoxHalves(v.reaction, v.ox, v.red);
            return h.given === h.taken ? `ausgeglichen: ${h.given} e⁻` : `${h.given} e⁻ abgegeben ≠ ${h.taken} e⁻ aufgenommen`;
          }),
          read("oz", "Oxidationszahlen", (v) => {
            const r = REDOX_REACTIONS[v.reaction];
            return `${r.metal}: 0 → ${oxText(r.charge)} · ${r.nonmetal}: 0 → ${oxText(-r.accepts / r.ions)}`;
          }),
        ],
        [
          goal("na", "Gleiche Natrium + Chlor mit den kleinsten Faktoren aus.", (v) => v.reaction === 0 && v.ox === 2 && v.red === 1),
          goal("mg", "Gleiche Magnesium + Sauerstoff mit den kleinsten Faktoren aus.", (v) => v.reaction === 1 && v.ox === 2 && v.red === 1),
          goal("al", "Gleiche Aluminium + Sauerstoff mit den kleinsten Faktoren aus.", (v) => v.reaction === 2 && v.ox === 4 && v.red === 3),
        ],
      );
    case "salzformel": {
      const names = CATIONS.map((c) => `${c.element} ${ionFormula(c)}`);
      return lab(
        kind,
        "Salzformeln und Salznamen",
        "Kombiniere ein Kation und ein Anion. Die Ladungen gleichen sich im Ionengitter aus; die Verhältnisformel gibt das kleinste ganzzahlige Verhältnis an.",
        [
          choice("cation", "Kation", names),
          choice(
            "anion",
            "Anion",
            ANIONS.map((a) => `${a.name} ${ionFormula(a)}`),
          ),
        ],
        [
          read("ratio", "Ionenverhältnis", (v) => {
            const [c, a] = saltRatio(CATIONS[v.cation].charge, ANIONS[v.anion].charge);
            return `${c} : ${a}`;
          }),
          read("formula", "Verhältnisformel", (v) => saltFormula(CATIONS[v.cation], ANIONS[v.anion])),
          read("name", "Name", (v) => saltName(CATIONS[v.cation], ANIONS[v.anion])),
        ],
        [
          goal("fe2o3", "Bilde Eisen(III)-oxid.", (v) => v.cation === 6 && v.anion === 4),
          goal("ca3po4", "Bilde Calciumphosphat.", (v) => v.cation === 3 && v.anion === 11),
          goal("al2so4", "Bilde Aluminiumsulfat.", (v) => v.cation === 8 && v.anion === 9),
        ],
      );
    }
    case "gitter":
      return lab(
        kind,
        "Ionenladung, Abstand und Gitterenergie",
        "Wähle ein Salz. Die Gitterenergie ist die Energie, die bei der Bildung des Gitters aus freien Ionen frei wird und zum Zerlegen aufgewendet werden muss (gerundete Tabellenwerte).",
        [choice("salt", "Salz", LATTICE_SALTS.map((s) => s.formula), 1)],
        [
          read("charges", "Ionenladungen", (v) => {
            const s = LATTICE_SALTS[v.salt];
            return s.cation === 1 ? "+1 und −1" : "+2 und −2";
          }),
          read("distance", "Ionenabstand", (v) => LATTICE_SALTS[v.salt].distance, "pm"),
          read("energy", "Gitterenergie", (v) => LATTICE_SALTS[v.salt].energy, "kJ/mol"),
          read("melting", "Schmelztemperatur", (v) => LATTICE_SALTS[v.salt].melting, "°C"),
        ],
        [
          goal("max", "Finde das Salz mit der größten Gitterenergie.", (v) => v.salt === 6),
          goal("min", "Finde das Salz mit der kleinsten Gitterenergie.", (v) => v.salt === 5),
          goal("naf", "Finde das einfach geladene Salz mit dem kleinsten Ionenabstand.", (v) => v.salt === 0),
        ],
      );
    case "loesen":
      return lab(
        kind,
        "Gitter trennen, Hydrathüllen bilden",
        "Beim Lösen muss die Gitterenergie aufgewendet werden; beim Bilden der Hydrathüllen wird Hydratationsenergie frei. Die Differenz entscheidet, ob die Lösung wärmer oder kälter wird.",
        [
          range("lattice", "Gitterenergie", 500, 900, 700, 25, "kJ/mol"),
          range("hydration", "Hydratationsenergie", 500, 900, 650, 25, "kJ/mol"),
        ],
        [
          read("delta", "Energiebilanz des Lösens", (v) => v.lattice - v.hydration, "kJ/mol"),
          read("effect", "Temperatur der Lösung", (v) =>
            v.lattice > v.hydration ? "sinkt (endotherm)" : v.lattice < v.hydration ? "steigt (exotherm)" : "bleibt etwa gleich",
          ),
        ],
        [
          goal("warm", "Stelle ein Salz ein, dessen Lösung sich um mindestens 50 kJ/mol erwärmt (exotherm).", (v) => v.lattice - v.hydration <= -50),
          goal("cold", "Stelle ein Kältepack-Salz ein: Bilanz mindestens +100 kJ/mol.", (v) => v.lattice - v.hydration >= 100),
          goal("zero", "Stelle eine ausgeglichene Bilanz ein, fast wie bei Kochsalz.", (v) => v.lattice === v.hydration),
        ],
      );
    case "indikator": {
      const examples = [
        "Salzsäure",
        "Magensaft",
        "Zitronensaft",
        "Speiseessig",
        "Tomatensaft",
        "Kaffee",
        "Mineralwasser mit Kohlensäure",
        "reines Wasser",
        "Meerwasser",
        "Seifenlösung",
        "Seifenlösung",
        "Ammoniaklösung (Glasreiniger)",
        "Kalkwasser",
        "Rohrreiniger",
        "Natronlauge",
      ];
      return lab(
        kind,
        "Indikatoren und pH-Skala",
        "Verändere den pH-Wert und wähle einen Indikator. Die Farben sind Modellfarben bei etwa 25 °C.",
        [choice("indicator", "Indikator", INDICATORS), range("ph", "pH-Wert", 0, 14, 7)],
        [
          read("color", "Farbe", (v) => indicatorColor(v.indicator, v.ph)),
          read("class", "Lösung", (v) => (v.ph < 7 ? "sauer" : v.ph > 7 ? "alkalisch" : "neutral")),
          read("example", "Beispiel", (v) => examples[v.ph]),
        ],
        [
          goal("btb", "Zeige mit Bromthymolblau eine saure Lösung.", (v) => v.indicator === 1 && v.ph < 6),
          goal("php", "Zeige mit Phenolphthalein eine alkalische Lösung.", (v) => v.indicator === 2 && v.ph >= 9 && v.ph <= 12),
          goal("uni", "Finde mit Universalindikator den pH-Wert von Speiseessig.", (v) => v.indicator === 0 && v.ph === 3),
        ],
      );
    }
    case "saeurerest": {
      const step = (v: LabValues) => Math.min(v.protons, ACIDS[v.acid].steps.length);
      return lab(
        kind,
        "Säurerestionen",
        "Wähle eine Säure und wie viele Protonen ihre Moleküle an Wassermoleküle abgeben. Mehrprotonige Säuren geben ihre Protonen schrittweise ab.",
        [
          choice(
            "acid",
            "Säure",
            ACIDS.map((a) => `${a.name} ${a.formula}`),
          ),
          range("protons", "Abgegebene Protonen", 0, 3, 0),
        ],
        [
          read("particle", "Teilchen", (v) => (step(v) === 0 ? ACIDS[v.acid].formula : ACIDS[v.acid].steps[step(v) - 1][0])),
          read("name", "Name", (v) => (step(v) === 0 ? ACIDS[v.acid].name : ACIDS[v.acid].steps[step(v) - 1][1])),
          read("equation", "Letzter Schritt", (v) => {
            const s = step(v);
            const acid = ACIDS[v.acid];
            if (s === 0) return "noch kein Protonenübergang";
            const from = s === 1 ? acid.formula : acid.steps[s - 2][0];
            return `${from} + H₂O → H₃O⁺ + ${acid.steps[s - 1][0]}`;
          }),
          read("limit", "Hinweis", (v) =>
            v.protons > ACIDS[v.acid].steps.length
              ? `${ACIDS[v.acid].formula} kann höchstens ${ACIDS[v.acid].steps.length} Proton(en) abgeben.`
              : ACIDS[v.acid].organic
                ? "Das Proton stammt aus der Carboxygruppe."
                : "Summenformel genügt für anorganische Säuren.",
          ),
        ],
        [
          goal("sulfat", "Erzeuge das Sulfation.", (v) => v.acid === 2 && step(v) === 2),
          goal("phosphat", "Erzeuge das Phosphation.", (v) => v.acid === 4 && step(v) === 3),
          goal("acetat", "Erzeuge das Säurerestion der Essigsäure.", (v) => v.acid === 5 && step(v) === 1),
        ],
      );
    }
    case "verduennung":
      return lab(
        kind,
        "Verdünnungsreihe einer Salzsäure",
        "Start: Salzsäure mit c(H₃O⁺) = 0,1 mol/l. Jeder Schritt verdünnt 1 : 10 mit Wasser.",
        [range("steps", "Verdünnungsschritte (je 1 : 10)", 0, 4, 0)],
        [
          read("c", "c(H₃O⁺)", (v) => `${fmt(10 ** -(1 + v.steps), 1 + v.steps)} mol/l`),
          read("ph", "pH-Wert", (v) => 1 + v.steps),
          read("factor", "Oxoniumionen im Vergleich zum Start", (v) => (v.steps === 0 ? "Ausgangslösung" : `1 : ${fmt(10 ** v.steps, 0)}`)),
          read("note", "Hinweis", (v) =>
            v.steps === 4
              ? "Weiteres Verdünnen nähert den pH-Wert 7, überschreitet ihn aber nicht."
              : "Weniger Oxoniumionen: höherer pH-Wert, geringere Ätzwirkung.",
          ),
        ],
        [
          goal("ph2", "Verdünne auf pH 2.", (v) => v.steps === 1),
          goal("ph4", "Verdünne so, dass nur noch ein Tausendstel der Oxoniumionen-Konzentration vorliegt.", (v) => v.steps === 3),
          goal("ph5", "Verdünne um den Faktor 10 000.", (v) => v.steps === 4),
        ],
      );
    case "neutralisation": {
      const ph = (v: LabValues) => titrationPh(10, 0.1, v.base, 0.1);
      return lab(
        kind,
        "Salzsäure und Natronlauge",
        "Im Becherglas: 10 ml Salzsäure, c = 0,1 mol/l, mit Bromthymolblau. Gib Natronlauge gleicher Konzentration hinzu. Ein Mol Oxoniumionen braucht ein Mol Hydroxidionen.",
        [range("base", "Zugegebene Natronlauge", 0, 20, 0, 1, "ml")],
        [
          read("left", "Übrige Oxoniumionen", (v) => fmt(Math.max(0, 1 - v.base / 10), 1), "mmol"),
          read("excess", "Überschüssige Hydroxidionen", (v) => fmt(Math.max(0, v.base / 10 - 1), 1), "mmol"),
          read("ph", "pH-Wert", (v) => Math.round(ph(v) * 10) / 10),
          read("color", "Bromthymolblau", (v) => indicatorColor(1, ph(v))),
        ],
        [
          goal("half", "Neutralisiere genau die Hälfte der Oxoniumionen.", (v) => v.base === 5),
          goal("neutral", "Stelle eine neutrale Lösung her.", (v) => v.base === 10),
          goal("excess", "Gib so viel Natronlauge zu, dass 0,5 mmol Hydroxidionen übrig sind.", (v) => v.base === 15),
        ],
      );
    }
    case "titration": {
      const SAMPLES = [0.08, 0.12, 0.15];
      const ph = (v: LabValues) => titrationPh(10, SAMPLES[v.sample], v.base, 0.1);
      return lab(
        kind,
        "Titration einer Salzsäure",
        "Vorgelegt: 10 ml Salzsäure unbekannter Konzentration mit Bromthymolblau. In der Bürette: Natronlauge, c = 0,1 mol/l. Tropfe zu, bis der Indikator grün umschlägt.",
        [
          choice("sample", "Probe", ["Probe A", "Probe B", "Probe C"]),
          range("base", "Verbrauch aus der Bürette", 0, 20, 0, 0.5, "ml"),
        ],
        [
          read("ph", "pH-Wert", (v) => Math.round(ph(v) * 10) / 10),
          read("color", "Bromthymolblau", (v) => indicatorColor(1, ph(v))),
          read("result", "Auswertung", (v) =>
            ph(v) === 7
              ? `Äquivalenzpunkt: c(HCl) = 0,1 mol/l · ${fmt(v.base, 1)} ml : 10 ml = ${fmt((0.1 * v.base) / 10, 3)} mol/l`
              : ph(v) < 7
                ? "noch sauer: weiter titrieren"
                : "übertitriert: Natronlauge im Überschuss",
          ),
        ],
        [
          goal("a", "Titriere Probe A genau bis zum Äquivalenzpunkt.", (v) => v.sample === 0 && v.base === 8),
          goal("b", "Titriere Probe B genau bis zum Äquivalenzpunkt.", (v) => v.sample === 1 && v.base === 12),
          goal("c", "Titriere Probe C genau bis zum Äquivalenzpunkt.", (v) => v.sample === 2 && v.base === 15),
        ],
      );
    }
    case "carbonat":
      return lab(
        kind,
        "Saure Lösungen mit Carbonaten und Metallen",
        "Wähle eine saure Lösung und einen Reaktionspartner. Das Modell nennt Gas, Nachweis, Salz und Reaktionsgleichung.",
        [choice("acid", "Saure Lösung", CARBONATE_ACIDS), choice("reactant", "Reaktionspartner", CARBONATE_REACTANTS)],
        [
          read("gas", "Gas", (v) => acidReaction(v.acid, v.reactant).gas),
          read("test", "Nachweis", (v) => acidReaction(v.acid, v.reactant).test),
          read("salt", "Salz", (v) => acidReaction(v.acid, v.reactant).salt),
          read("equation", "Reaktionsgleichung", (v) => acidReaction(v.acid, v.reactant).equation),
        ],
        [
          goal("kalk", "Entkalke: Lass Essigsäure mit Kalk reagieren.", (v) => v.acid === 2 && v.reactant === 0),
          goal("h2", "Erzeuge Wasserstoff mit Magnesium und Salzsäure.", (v) => v.acid === 0 && v.reactant === 2),
          goal("cu", "Zeige, dass Kupfer nicht mit verdünnter Schwefelsäure reagiert.", (v) => v.acid === 1 && v.reactant === 4),
        ],
      );
    case "fotosynthese":
      return lab(
        kind,
        "Fotosynthese im Teilchenmodell",
        "Pflanzen bauen mit Lichtenergie aus Kohlenstoffdioxid und Wasser Glucose auf; Sauerstoff wird frei. Im Modell entsteht ein Glucosemolekül aus je sechs CO₂- und H₂O-Molekülen.",
        [
          choice("light", "Licht", ["aus", "an"], 1),
          range("co2", "CO₂-Moleküle", 0, 12, 3),
          range("water", "H₂O-Moleküle", 0, 12, 3),
        ],
        [
          read("glucose", "Glucosemoleküle C₆H₁₂O₆", (v) => photosynthesis(v.co2, v.water, v.light === 1).glucose),
          read("oxygen", "Sauerstoffmoleküle O₂", (v) => photosynthesis(v.co2, v.water, v.light === 1).oxygen),
          read("left", "Übrig", (v) => {
            const p = photosynthesis(v.co2, v.water, v.light === 1);
            return `${p.co2} CO₂ und ${p.water} H₂O`;
          }),
        ],
        [
          goal("one", "Bilde ein Glucosemolekül, ohne dass etwas übrig bleibt.", (v) => v.light === 1 && v.co2 === 6 && v.water === 6),
          goal("two", "Bilde zwei Glucosemoleküle.", (v) => photosynthesis(v.co2, v.water, v.light === 1).glucose === 2),
          goal("dark", "Zeige: Ohne Licht entsteht trotz genug CO₂ und Wasser keine Glucose.", (v) => v.light === 0 && v.co2 >= 6 && v.water >= 6),
        ],
      );
    case "kalorimetrie": {
      const energy = (v: LabValues) => FUELS[v.fuel].energy * v.mass;
      return lab(
        kind,
        "Energiegehalt im Modellkalorimeter",
        "Eine Probe verbrennt unter einem Gefäß mit Wasser. Das ideale Modell ohne Wärmeverluste rechnet Q = c · m · ΔT mit c = 4,19 J/(g·K). Im Schulversuch geht ein großer Teil der Wärme an die Umgebung.",
        [
          choice(
            "fuel",
            "Probe",
            FUELS.map((f) => f.name),
          ),
          range("mass", "Masse der Probe", 0.2, 2, 0.2, 0.2, "g"),
          range("water", "Wasser", 100, 500, 250, 50, "g"),
        ],
        [
          read("energy", "Freigesetzte Energie", (v) => Math.round(energy(v) * 10) / 10, "kJ"),
          read("rise", "Temperaturerhöhung ΔT", (v) => Math.round(temperatureRise(energy(v), v.water) * 10) / 10, "K"),
          read("perGram", "Energiegehalt", (v) => FUELS[v.fuel].energy, "kJ/g"),
        ],
        [
          goal("sugar", "Erwärme 250 g Wasser mit Zucker um mindestens 10 K.", (v) => v.fuel === 0 && v.water === 250 && temperatureRise(energy(v), v.water) >= 10),
          goal("oil", "Setze mit Pflanzenöl mindestens 50 kJ frei.", (v) => v.fuel === 2 && energy(v) >= 50),
          goal("nut", "Erwärme 500 g Wasser mit Erdnuss um mindestens 20 K.", (v) => v.fuel === 1 && v.water === 500 && temperatureRise(energy(v), v.water) >= 20),
        ],
      );
    }
    case "addition": {
      const SUBSTANCES = ["Ethan", "Ethen", "Propen", "Hexan"];
      const alkene = (v: LabValues) => v.substance === 1 || v.substance === 2;
      const product = (v: LabValues) => (v.substance === 1 ? "1,2-Dibromethan" : "1,2-Dibrompropan");
      const STEPS = [
        "Alken mit C=C-Doppelbindung und Brommolekül Br–Br nähern sich.",
        "Die Elektronen der Doppelbindung polarisieren das Brommolekül: Brδ+–Brδ−.",
        "Das positivierte Bromatom bindet an ein C-Atom; es entstehen ein positiv geladenes Zwischenteilchen und ein Bromidion.",
        "Das Bromidion bindet an das positiv geladene C-Atom: Die Doppelbindung ist aufgelöst.",
      ];
      return lab(
        kind,
        "Bromwasserprobe und Addition",
        "Wähle einen Kohlenwasserstoff und gehe die Schritte der Addition durch. Bromwasser ist braun; es wird entfärbt, wenn Brom verbraucht wird.",
        [choice("substance", "Stoff", SUBSTANCES), range("step", "Schritt", 0, 3, 0)],
        [
          read("mechanism", "Was geschieht?", (v) =>
            alkene(v) ? STEPS[v.step] : "Keine Doppelbindung: Im Dunkeln findet keine Addition statt.",
          ),
          read("color", "Bromwasser", (v) => (alkene(v) && v.step === 3 ? "entfärbt" : "braun")),
          read("product", "Produkt", (v) => (alkene(v) && v.step === 3 ? product(v) : "—")),
        ],
        [
          goal("ethen", "Führe die Addition von Brom an Ethen zu Ende.", (v) => v.substance === 1 && v.step === 3),
          goal("propen", "Führe die Addition von Brom an Propen zu Ende.", (v) => v.substance === 2 && v.step === 3),
          goal("alkan", "Zeige: Hexan entfärbt Bromwasser im Dunkeln nicht.", (v) => v.substance === 3 && v.step === 3),
        ],
      );
    }
    case "substitution": {
      const X = (v: LabValues) => (v.halogen === 0 ? "Br" : "Cl");
      const steps = (v: LabValues) => {
        const x = X(v);
        return [
          [`Ausgangsstoffe: CH₄ und ${x}₂`, "keine"],
          [`Startreaktion: Licht spaltet ${x}₂ → 2 ${x}·`, `${x}·`],
          [`Kettenschritt 1: ${x}· + CH₄ → H${x} + ·CH₃`, "·CH₃"],
          [`Kettenschritt 2: ·CH₃ + ${x}₂ → CH₃${x} + ${x}·`, `${x}· (neu gebildet)`],
          [`Abbruch: ·CH₃ + ${x}· → CH₃${x} (oder ${x}· + ${x}· → ${x}₂)`, "keine mehr"],
        ];
      };
      return lab(
        kind,
        "Radikalische Substitution",
        "Methan reagiert mit einem Halogen nur, wenn Licht die Halogenmoleküle spaltet. Gehe die Radikal-Kettenreaktion Schritt für Schritt durch; ein Punkt steht für ein ungepaartes Elektron.",
        [
          choice("halogen", "Halogen", ["Brom", "Chlor"]),
          choice("light", "Licht", ["dunkel", "Licht"]),
          range("step", "Schritt", 0, 4, 0),
        ],
        [
          read("equation", "Schritt", (v) =>
            v.light === 0 && v.step > 0 ? "Im Dunkeln: keine Startreaktion, also keine Reaktion." : steps(v)[v.step][0],
          ),
          read("radicals", "Radikale", (v) => (v.light === 0 ? "keine" : steps(v)[v.step][1])),
          read("products", "Produkte bisher", (v) =>
            v.light === 0 || v.step < 2 ? "—" : v.step === 2 ? `H${X(v)}` : `H${X(v)}, CH₃${X(v)}`,
          ),
        ],
        [
          goal("start", "Löse die Startreaktion aus.", (v) => v.light === 1 && v.step === 1),
          goal("chain", "Zeige den Schritt, in dem ein Halogenradikal neu entsteht.", (v) => v.light === 1 && v.step === 3),
          goal("stop", "Beende die Kette mit einer Abbruchreaktion.", (v) => v.light === 1 && v.step === 4),
        ],
      );
    }
    case "oxzahl": {
      const correct = (v: LabValues) => carbonOxidation(OX_MOLECULES[v.molecule].h, OX_MOLECULES[v.molecule].o);
      return lab(
        kind,
        "Oxidationszahl eines C-Atoms",
        "Ordne die Bindungselektronen gedanklich dem elektronegativeren Partner zu: Jede Bindung zu O zählt +1, jedes H-Atom −1, Bindungen zu C zählen 0. Stelle deine Oxidationszahl ein.",
        [
          choice(
            "molecule",
            "Molekül",
            OX_MOLECULES.map((m) => m.name),
          ),
          range("guess", "Meine Oxidationszahl", -4, 4, 0),
        ],
        [
          read("atom", "Betrachtetes Atom", (v) => OX_MOLECULES[v.molecule].atom),
          read("partners", "Bindungspartner", (v) => {
            const m = OX_MOLECULES[v.molecule];
            return `${m.h} H-Atom(e), ${m.o} Bindung(en) zu O`;
          }),
          read("check", "Prüfung", (v) =>
            v.guess === correct(v) ? `richtig: ${oxText(correct(v))}` : "noch nicht: zähle Bindungen zu O und H-Atome",
          ),
        ],
        [
          goal("ethanol", "Bestimme die Oxidationszahl von C1 im Ethanol.", (v) => v.molecule === 5 && v.guess === correct(v)),
          goal("ethanal", "Bestimme die Oxidationszahl von C1 im Ethanal.", (v) => v.molecule === 6 && v.guess === correct(v)),
          goal("saeure", "Bestimme die Oxidationszahl von C1 in der Ethansäure.", (v) => v.molecule === 7 && v.guess === correct(v)),
        ],
      );
    }
    case "alkanol": {
      const oz = (v: LabValues) => {
        const c = functionalCarbon(v.n, v.step);
        return carbonOxidation(c.h, c.o);
      };
      return lab(
        kind,
        "Primäre Alkanole oxidieren",
        "Ein Oxidationsmittel, z. B. Kupfer(II)-oxid, nimmt Elektronen auf. Das C-Atom der funktionellen Gruppe wird schrittweise oxidiert: Alkanol → Alkanal → Alkansäure.",
        [range("n", "C-Atome", 1, 4, 2), range("step", "Oxidationsschritte", 0, 2, 0)],
        [
          read("name", "Stoff", (v) => oxidationStepName(v.n, v.step)),
          read("formula", "Halbstrukturformel", (v) => oxidationStepFormula(v.n, v.step)),
          read("oz", "Oxidationszahl des funktionellen C-Atoms", (v) => oxText(oz(v))),
          read("group", "Funktionelle Gruppe", (v) => ["Hydroxygruppe –OH", "Aldehydgruppe –CHO", "Carboxygruppe –COOH"][v.step]),
        ],
        [
          goal("ethanal", "Oxidiere Ethanol zu Ethanal.", (v) => v.n === 2 && v.step === 1),
          goal("propansaeure", "Oxidiere Propan-1-ol bis zur Propansäure.", (v) => v.n === 3 && v.step === 2),
          goal("methanal", "Oxidiere Methanol zu Methanal.", (v) => v.n === 1 && v.step === 1),
        ],
      );
    }
    case "alkanon":
      return lab(
        kind,
        "Primäre und sekundäre Alkanole",
        "Bei primären Alkanolen trägt das C-Atom mit der OH-Gruppe zwei H-Atome, bei sekundären eins. Oxidiere einmal und vergleiche die Produkte.",
        [
          choice(
            "alcohol",
            "Alkanol",
            ALCOHOLS.map((a) => a.name),
          ),
          range("step", "Oxidationsschritte", 0, 1, 0),
        ],
        [
          read("type", "Typ", (v) => ALCOHOLS[v.alcohol].type),
          read("product", "Stoff", (v) => (v.step === 0 ? ALCOHOLS[v.alcohol].name : ALCOHOLS[v.alcohol].product)),
          read("class", "Stoffklasse", (v) =>
            v.step === 0 ? "Alkanol" : ALCOHOLS[v.alcohol].type === "primär" ? "Alkanal" : "Alkanon",
          ),
          read("oz", "Oxidationszahl des C-Atoms mit O", (v) =>
            oxText(v.step === 0 ? ALCOHOLS[v.alcohol].before : ALCOHOLS[v.alcohol].after),
          ),
          read("next", "Weiter oxidierbar?", (v) =>
            v.step === 0
              ? "—"
              : ALCOHOLS[v.alcohol].type === "primär"
                ? "ja, zur Alkansäure"
                : "nein, unter Schulbedingungen nicht",
          ),
        ],
        [
          goal("propanon", "Stelle Propanon her.", (v) => v.alcohol === 2 && v.step === 1),
          goal("butanon", "Stelle Butanon her.", (v) => v.alcohol === 3 && v.step === 1),
          goal("propanal", "Vergleiche: Oxidiere das primäre Isomer Propan-1-ol.", (v) => v.alcohol === 1 && v.step === 1),
        ],
      );
    case "ester":
      return lab(
        kind,
        "Ester aus Alkansäure und Alkanol",
        "Die Carboxygruppe der Säure und die Hydroxygruppe des Alkanols reagieren unter Abspaltung von Wasser (Kondensation). Konzentrierte Schwefelsäure dient als Katalysator.",
        [
          range("acid", "C-Atome der Alkansäure", 1, 4, 1),
          range("alcohol", "C-Atome des Alkanols", 1, 5, 1),
        ],
        [
          read("equation", "Wortgleichung", (v) => `${acidName(v.acid)} + ${alkanolName(v.alcohol)} ⇌ ${esterName(v.acid, v.alcohol)} + Wasser`),
          read("formula", "Halbstrukturformel", (v) => esterFormula(v.acid, v.alcohol)),
          read("sum", "Summenformel", (v) => esterSum(v.acid, v.alcohol)),
          read("smell", "Geruch", (v) => ESTER_SMELLS[`${v.acid},${v.alcohol}`] ?? "fruchtig, nicht näher festgelegt"),
        ],
        [
          goal("ananas", "Stelle den Ester mit Ananasgeruch her.", (v) => v.acid === 4 && v.alcohol === 2),
          goal("banane", "Stelle den Ester mit Bananengeruch her.", (v) => v.acid === 2 && v.alcohol === 5),
          goal("ethyl", "Stelle Ethansäureethylester her.", (v) => v.acid === 2 && v.alcohol === 2),
        ],
      );
    case "ester-eig": {
      const names = COMPARE_SUBSTANCES.map((s) => s.name);
      const pairIs = (v: LabValues, a: number, b: number) => (v.a === a && v.b === b) || (v.a === b && v.b === a);
      return lab(
        kind,
        "Ester, Säure, Alkohol und Alkan im Vergleich",
        "Alle vier Stoffe haben fast dieselbe Molekülmasse (72–74 u). Vergleiche zwei Stoffe: Unterschiede kommen von den zwischenmolekularen Wechselwirkungen.",
        [choice("a", "Stoff 1", names, 0), choice("b", "Stoff 2", names, 0)],
        [
          read("boiling", "Siedetemperaturen", (v) => `${COMPARE_SUBSTANCES[v.a].boiling} °C und ${COMPARE_SUBSTANCES[v.b].boiling} °C`),
          read("bridges", "H-Brücken zwischen gleichen Molekülen", (v) =>
            [v.a, v.b].map((i) => (COMPARE_SUBSTANCES[i].bridges ? "ja" : "nein")).join(" / "),
          ),
          read("water", "In Wasser", (v) => [v.a, v.b].map((i) => COMPARE_SUBSTANCES[i].water).join(" / ")),
          read("smell", "Geruch", (v) => [v.a, v.b].map((i) => COMPARE_SUBSTANCES[i].smell).join(" / ")),
        ],
        [
          goal("acid", "Vergleiche den Ester mit der Säure gleicher Masse.", (v) => pairIs(v, 2, 1)),
          goal("alcohol", "Vergleiche den Ester mit dem Alkohol.", (v) => pairIs(v, 2, 0)),
          goal("alkane", "Vergleiche den Ester mit dem Alkan.", (v) => pairIs(v, 2, 3)),
        ],
      );
    }
    case "peptid":
      return lab(
        kind,
        "Aminosäuren verknüpfen",
        "Die Carboxygruppe einer Aminosäure reagiert mit der Aminogruppe der nächsten: Es entsteht eine Peptidbindung, ein Wassermolekül wird abgespalten.",
        [range("n", "Aminosäuren in der Kette", 2, 10, 2)],
        [
          read("bonds", "Peptidbindungen", (v) => v.n - 1),
          read("water", "Abgespaltene Wassermoleküle", (v) => v.n - 1),
          read("name", "Bezeichnung", (v) =>
            v.n === 2 ? "Dipeptid" : v.n === 3 ? "Tripeptid" : v.n < 10 ? "Oligopeptid" : "Polypeptid (Ausschnitt)",
          ),
          read("sequences", "Mögliche Sequenzen aus 20 Aminosäuren", (v) => `20^${v.n} = ${fmt(20 ** v.n, 0)}`),
          read("biuret", "Biuret-Probe", (v) => (v.n >= 3 ? "violett (mindestens zwei Peptidbindungen)" : "negativ")),
        ],
        [
          goal("tri", "Baue ein Tripeptid; prüfe die Biuret-Probe.", (v) => v.n === 3),
          goal("million", "Finde die kürzeste Kette mit über einer Million möglicher Sequenzen.", (v) => v.n === 5),
          goal("ten", "Baue eine Kette, bei der neun Wassermoleküle abgespalten werden.", (v) => v.n === 10),
        ],
      );
    case "polysaccharid": {
      const TYPES = ["Amylose", "Cellulose", "Saccharose"];
      const units = (v: LabValues) => (v.type === 2 ? 2 : v.n);
      return lab(
        kind,
        "Zucker verknüpfen",
        "Monosaccharide verknüpfen sich unter Abspaltung von Wasser (Kondensation). Saccharose besteht aus Glucose und Fructose; Amylose und Cellulose aus vielen Glucosebausteinen.",
        [choice("type", "Stoff", TYPES), range("n", "Glucosebausteine im Ausschnitt", 2, 12, 2)],
        [
          read("units", "Bausteine", (v) => (v.type === 2 ? "1 Glucose + 1 Fructose" : `${units(v)} Glucose`)),
          read("water", "Abgespaltene Wassermoleküle", (v) => units(v) - 1),
          read("shape", "Bau", (v) =>
            ["schraubenförmige Kette (Helix)", "gestreckte Ketten, durch H-Brücken zu Fasern gebündelt", "Disaccharid"][v.type],
          ),
          read("test", "Nachweis", (v) =>
            ["Iod-Kaliumiodid-Lösung: blau-violett", "Chlorzinkiod-Lösung: blau-violett", "Seliwanow positiv; Teststäbchen erst nach Spaltung"][v.type],
          ),
          read("role", "Bedeutung", (v) => ["Energiespeicher der Pflanze", "Gerüst- und Ballaststoff", "Transport- und Speicherzucker"][v.type]),
        ],
        [
          goal("saccharose", "Bilde Saccharose.", (v) => v.type === 2),
          goal("amylose", "Baue einen Amylose-Ausschnitt aus mindestens sechs Glucosebausteinen.", (v) => v.type === 0 && v.n >= 6),
          goal("cellulose", "Baue einen Cellulose-Ausschnitt aus mindestens sechs Glucosebausteinen.", (v) => v.type === 1 && v.n >= 6),
        ],
      );
    }
    case "fett": {
      const names = FATTY_ACIDS.map((f) => f.name);
      const acids = (v: LabValues) => [FATTY_ACIDS[v.a1], FATTY_ACIDS[v.a2], FATTY_ACIDS[v.a3]];
      const bonds = (v: LabValues) => acids(v).reduce((n, a) => n + a.doubleBonds, 0);
      return lab(
        kind,
        "Ein Fettmolekül bauen",
        "Glycerin bildet mit drei Fettsäuren einen Ester. Wähle die Fettsäuren. Das einfache Modell sagt: höchstens eine ungesättigte Kette → bei 20 °C fest; zwei oder drei → flüssig.",
        [choice("a1", "Fettsäure 1", names, 0), choice("a2", "Fettsäure 2", names, 1), choice("a3", "Fettsäure 3", names, 2)],
        [
          read("formula", "Summenformel", (v) => fatFormula(acids(v))),
          read("bonds", "C=C-Doppelbindungen", (v) => bonds(v)),
          read("state", "Bei 20 °C", (v) => (fatState(acids(v)) === "fest" ? "fest (Fett)" : "flüssig (fettes Öl)")),
          read("bromine", "Bromwasser", (v) => (bonds(v) > 0 ? "entfärbt" : "bleibt braun")),
        ],
        [
          goal("solid", "Baue ein Fett, das Bromwasser nicht entfärbt.", (v) => bonds(v) === 0),
          goal("oil", "Baue ein fettes Öl, das bei 20 °C flüssig ist.", (v) => fatState(acids(v)) === "flüssig"),
          goal("six", "Baue ein Molekül mit sechs C=C-Doppelbindungen.", (v) => bonds(v) === 6),
        ],
      );
    }
    case "polymerisation":
      return lab(
        kind,
        "Radikalische Polymerisation",
        "Ein Startradikal öffnet die C=C-Doppelbindung eines Monomers; das neue Radikal greift das nächste Monomer an. Die Kette wächst, bis zwei Radikale sich verbinden.",
        [
          choice(
            "monomer",
            "Monomer",
            POLYMERS.map((p) => p.monomer),
          ),
          range("n", "Eingebaute Monomere", 1, 8, 1),
        ],
        [
          read("polymer", "Polymer", (v) => POLYMERS[v.monomer].polymer),
          read("unit", "Wiederholungseinheit", (v) => `[${POLYMERS[v.monomer].unit}]ₙ`),
          read("opened", "Geöffnete Doppelbindungen", (v) => v.n),
          read("byproduct", "Nebenprodukt", () => "keines: Additionsreaktion"),
        ],
        [
          goal("pvc", "Baue eine PVC-Kette aus mindestens fünf Monomeren.", (v) => v.monomer === 2 && v.n >= 5),
          goal("pp", "Baue eine Polypropen-Kette aus acht Monomeren.", (v) => v.monomer === 1 && v.n === 8),
          goal("ps", "Baue eine Polystyrol-Kette aus mindestens drei Monomeren.", (v) => v.monomer === 3 && v.n >= 3),
        ],
      );
    case "polykondensation":
      return lab(
        kind,
        "Polykondensation",
        "Jedes Monomer trägt zwei funktionelle Gruppen. Bei jeder neuen Bindung wird ein kleines Molekül abgespalten, hier Wasser.",
        [
          choice(
            "pair",
            "Monomere",
            CONDENSATES.map((c) => c.monomers),
          ),
          range("links", "Neue Bindungen", 1, 10, 1),
        ],
        [
          read("polymer", "Polymer", (v) => CONDENSATES[v.pair].polymer),
          read("bond", "Verknüpfung", (v) => CONDENSATES[v.pair].bond),
          read("water", "Abgespaltene Wassermoleküle", (v) => v.links),
        ],
        [
          goal("pet", "Verknüpfe PET mit sechs Esterbindungen.", (v) => v.pair === 0 && v.links === 6),
          goal("nylon", "Verknüpfe ein Polyamid mit mindestens vier Bindungen.", (v) => v.pair === 1 && v.links >= 4),
          goal("pla", "Bilde Polymilchsäure, bei der zehn Wassermoleküle abgespalten werden.", (v) => v.pair === 2 && v.links === 10),
        ],
      );
    case "vernetzung":
      return lab(
        kind,
        "Vernetzung und Wärmeverhalten",
        "Wähle die Vernetzung der Ketten und erwärme. Die Grenzen 100 °C und 220 °C sind Modellwerte; jeder Kunststoff hat eigene.",
        [
          choice("crosslink", "Ketten", ["unvernetzt", "weitmaschig vernetzt", "engmaschig vernetzt"]),
          range("temperature", "Temperatur", 20, 260, 20, 20, "°C"),
        ],
        [
          read("class", "Kunststoffklasse", (v) => ["Thermoplast", "Elastomer", "Duroplast"][v.crosslink]),
          read("behaviour", "Verhalten", (v) => plasticBehaviour(v.crosslink, v.temperature)),
          read("example", "Beispiel", (v) => ["PE-Folie, PET-Flasche", "Gummiband, Autoreifen", "Steckdose, Pfannengriff"][v.crosslink]),
        ],
        [
          goal("thermo", "Mach einen Thermoplasten plastisch formbar.", (v) => v.crosslink === 0 && v.temperature >= 100 && v.temperature < 220),
          goal("duro", "Zeige: Ein Duroplast bleibt bei 160 °C formstabil.", (v) => v.crosslink === 2 && v.temperature === 160),
          goal("elasto", "Erhitze ein Elastomer, bis es sich zersetzt.", (v) => v.crosslink === 1 && v.temperature >= 220),
        ],
      );
    case "silikon":
      return lab(
        kind,
        "Silikone aus Chlorsilanen",
        "Chlormethylsilane reagieren mit Wasser: Si–Cl wird zu Si–OH (HCl entsteht), dann verknüpfen sich zwei Si–OH zu Si–O–Si (Wasser wird abgespalten). Die Zahl der Cl-Atome bestimmt die Rolle im Gerüst.",
        [
          range("mono", "(CH₃)₃SiCl: Kettenende", 0, 4, 2),
          range("di", "(CH₃)₂SiCl₂: Kettenglied", 0, 20, 0, 2),
          range("tri", "CH₃SiCl₃: Verzweigung", 0, 8, 0),
        ],
        [
          read("type", "Produkt", (v) => siliconeType(v.mono, v.di, v.tri)),
          read("hcl", "Entstandener Chlorwasserstoff", (v) => v.mono + 2 * v.di + 3 * v.tri, "Moleküle"),
          read("backbone", "Gerüst", (v) => (v.di + v.tri > 0 ? "–Si–O–Si–O– mit CH₃-Gruppen" : "—")),
        ],
        [
          goal("oil", "Stelle ein Silikonöl her.", (v) => siliconeType(v.mono, v.di, v.tri).startsWith("Silikonöl")),
          goal("elastomer", "Stelle ein Silikonelastomer her.", (v) => siliconeType(v.mono, v.di, v.tri).startsWith("Silikonelastomer")),
          goal("harz", "Stelle ein Silikonharz her.", (v) => siliconeType(v.mono, v.di, v.tri).startsWith("Silikonharz")),
        ],
      );
    case "akku":
      return lab(
        kind,
        "Der Zink-Iod-Akku",
        "Beim Entladen läuft die Redoxreaktion freiwillig ab und liefert elektrische Energie. Beim Laden erzwingt eine Spannungsquelle die Umkehrung: eine Elektrolyse.",
        [
          choice("mode", "Betrieb", ["Entladen", "Laden"]),
          range("charge", "Ladezustand", 0, 100, 50, 10, "%"),
          choice("view", "Ansicht", ["Elektroden", "Ionen in der Lösung"]),
        ],
        [
          read("kind", "Art der Redoxreaktion", (v) => (v.mode === 0 ? "freiwillig (galvanische Zelle)" : "erzwungen (Elektrolyse)")),
          read("zinc", "Zinkelektrode", (v) => (v.mode === 0 ? "Zn → Zn²⁺ + 2 e⁻ (Oxidation)" : "Zn²⁺ + 2 e⁻ → Zn (Reduktion)")),
          read("iodine", "Graphitelektrode", (v) => (v.mode === 0 ? "I₂ + 2 e⁻ → 2 I⁻ (Reduktion)" : "2 I⁻ → I₂ + 2 e⁻ (Oxidation)")),
          read("possible", "Läuft die Reaktion?", (v) =>
            v.mode === 0
              ? v.charge === 0
                ? "nein: Zink und Iod sind umgesetzt"
                : "ja, Strom fließt"
              : v.charge === 100
                ? "nein: alles Zink und Iod ist zurückgebildet"
                : "ja, solange die Spannungsquelle anliegt",
          ),
          read("ions", "Ionenwanderung", (v) =>
            v.view === 0 ? "—" : v.mode === 0 ? "Zn²⁺ entstehen an der Zinkelektrode; I⁻ an der Graphitelektrode" : "Zn²⁺ wandern zur Zinkelektrode, I⁻ zur Graphitelektrode",
          ),
        ],
        [
          goal("empty", "Entlade den Akku vollständig.", (v) => v.mode === 0 && v.charge === 0),
          goal("full", "Lade den Akku vollständig.", (v) => v.mode === 1 && v.charge === 100),
          goal("ions", "Beobachte die Ionenwanderung beim Laden.", (v) => v.mode === 1 && v.view === 1),
        ],
      );
    case "brennstoffzelle": {
      // Whole reaction units 2 H₂ + O₂ → 2 H₂O; no half molecules.
      const water = (v: LabValues) => 2 * Math.min(Math.floor(v.hydrogen / 2), v.oxygen);
      return lab(
        kind,
        "Wasserstoff/Sauerstoff-Brennstoffzelle",
        "Wasserstoff wird an der einen Elektrode oxidiert, Sauerstoff an der anderen reduziert. Die Elektronen fließen über den äußeren Stromkreis. Die Gase reagieren nicht direkt miteinander.",
        [range("hydrogen", "H₂-Moleküle", 0, 8, 1), range("oxygen", "O₂-Moleküle", 0, 4, 0)],
        [
          read("water", "Gebildete Wassermoleküle", (v) => water(v)),
          read("electrons", "Elektronen im äußeren Stromkreis", (v) => 2 * water(v)),
          read("left", "Übrig", (v) => `${v.hydrogen - water(v)} H₂ und ${v.oxygen - water(v) / 2} O₂`),
          read("halves", "Teilgleichungen", () => "H₂ → 2 H⁺ + 2 e⁻ · O₂ + 4 H⁺ + 4 e⁻ → 2 H₂O"),
        ],
        [
          goal("exact", "Lass 2 H₂ und 1 O₂ vollständig reagieren.", (v) => v.hydrogen === 2 && v.oxygen === 1),
          goal("eight", "Schicke acht Elektronen durch den Stromkreis, ohne dass Gas übrig bleibt.", (v) => v.hydrogen === 4 && v.oxygen === 2),
          goal("excess", "Zeige einen Wasserstoffüberschuss: Wasser entsteht, aber H₂ bleibt übrig.", (v) => water(v) > 0 && v.hydrogen > water(v)),
        ],
      );
    }
    default:
      throw new Error(`No lab for ${kind}`);
  }
}

/** Explicit action witness used by the same goal checker as the UI. */
export function experimentWitness(kind: LabKind, index: number): LabValues {
  const entry = EXPERIMENTS[kind]?.cases[index];
  if (!entry) throw new Error(`No case ${index} in ${kind}`);
  return { case: index, prediction: entry.answer, observed: 1 };
}
