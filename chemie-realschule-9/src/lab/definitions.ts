import {
  clouds,
  element,
  hydrocarbon,
  MOLECULES,
  reaction,
  saltRatio,
  shells,
  SHAPES,
} from "../chemistry/model";
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
  safety: {
    title: "Sicher entscheiden",
    options: [
      "Beobachten und protokollieren",
      "Schutzbrille, Aufsicht und passende Entsorgung",
      "Nicht probieren; Lehrkraft fragen",
    ],
    cases: [
      {
        name: "Unbekannte Flüssigkeit",
        observation:
          "Aussehen allein verrät die Gefährdung nicht. Unbekannte Chemikalien werden weder berührt noch gekostet.",
        answer: 2,
      },
      {
        name: "Ätzender Stoff im Unterricht",
        observation:
          "Das Ätzsymbol verlangt geeigneten Schutz. Ein virtueller Versuch ist keine Anleitung für einen eigenen Versuch.",
        answer: 1,
      },
      {
        name: "Farbwechsel im beaufsichtigten Versuch",
        observation:
          "‚Die Lösung wird blau‘ ist eine Beobachtung; eine Erklärung des Teilchenvorgangs ist eine Deutung.",
        answer: 0,
      },
    ],
  },
  separation: {
    title: "Gemische trennen",
    options: ["Filtration", "Destillation", "Magnetscheiden", "Extraktion"],
    cases: [
      {
        name: "Sand in Wasser",
        observation: "Sand bleibt als ungelöster Feststoff im Filter; Wasser läuft hindurch.",
        answer: 0,
      },
      {
        name: "Gelöstes Salz und Wasser, Wasser auffangen",
        observation: "Wasser verdampft und wird wieder kondensiert. Gelöstes Salz bleibt zurück.",
        answer: 1,
      },
      {
        name: "Eisen und Schwefel vor einer Reaktion",
        observation:
          "Nur das Eisen wird vom Magneten angezogen. Die Stoffe sind noch nicht chemisch verbunden.",
        answer: 2,
      },
      {
        name: "Löslicher Farbstoff in Blättern",
        observation:
          "Ein geeignetes Lösungsmittel nimmt den Farbstoff auf; unlösliche Bestandteile bleiben zurück.",
        answer: 3,
      },
    ],
  },
  "gas-test": {
    title: "Nachweise auswerten",
    options: ["Sauerstoff", "Wasserstoff", "Kohlenstoffdioxid", "Wasser"],
    cases: [
      {
        name: "Glimmspan flammt auf",
        observation:
          "Sauerstoff unterstützt die Verbrennung: Der glimmende Span flammt wieder auf.",
        answer: 0,
      },
      {
        name: "Positive Knallgasprobe",
        observation:
          "Der charakteristische Laut weist in der beaufsichtigten Nachweisprobe Wasserstoff nach.",
        answer: 1,
      },
      {
        name: "Kalkwasser wird trüb",
        observation: "Kohlenstoffdioxid bildet mit Kalkwasser einen schwer löslichen Niederschlag.",
        answer: 2,
      },
      {
        name: "Wasserfreies Kupfersulfat wird blau",
        observation: "Die Blaufärbung des zuvor weißen Nachweisreagenzes zeigt Wasser an.",
        answer: 3,
      },
    ],
  },
  structure: {
    title: "Stoff und Teilchenverband",
    options: ["Moleküle", "Ionengitter", "Metallgitter", "Einzelne Atome"],
    cases: [
      {
        name: "Wasser",
        observation:
          "Abgegrenzte Wassermoleküle bestehen jeweils aus einem Sauerstoff- und zwei Wasserstoffatomen.",
        answer: 0,
      },
      {
        name: "Kochsalz",
        observation:
          "Natrium- und Chloridionen bilden ein ausgedehntes Gitter. NaCl ist eine Verhältnisformel, kein einzelnes Molekül.",
        answer: 1,
      },
      {
        name: "Kupfer",
        observation:
          "Positive Atomrümpfe und bewegliche Elektronen bilden das Modell für den metallischen Verband.",
        answer: 2,
      },
      {
        name: "Helium",
        observation: "Helium liegt unter üblichen Bedingungen als einzelne Atome vor.",
        answer: 3,
      },
    ],
  },
  forces: {
    title: "Zwischen Molekülen",
    options: [
      "London-Kräfte",
      "Zusätzlich Dipol-Dipol-Wechselwirkung",
      "Zusätzlich Wasserstoffbrücken",
    ],
    cases: [
      {
        name: "Zwischen Methanmolekülen",
        observation:
          "Unpolare Methanmoleküle ziehen sich durch momentane und induzierte Dipole an.",
        answer: 0,
      },
      {
        name: "Zwischen Chlorwasserstoffmolekülen",
        observation:
          "HCl ist polar. Zusätzlich zu London-Kräften wirken permanente Dipole; hier werden keine Wasserstoffbrücken angesetzt.",
        answer: 1,
      },
      {
        name: "Zwischen Wassermolekülen",
        observation:
          "Ein an Sauerstoff gebundenes Wasserstoffatom wechselwirkt mit einem freien Elektronenpaar eines Nachbarmoleküls.",
        answer: 2,
      },
    ],
  },
  functional: {
    title: "Funktionelle Gruppen erkennen",
    options: ["Alkanol", "Alkanal", "Alkansäure", "Alken"],
    cases: [
      {
        name: "CH₃–CH₂–OH",
        observation:
          "Die Hydroxygruppe kennzeichnet ein Alkanol. Ein Nachweis ist die beobachtbare Reaktion mit geeignetem Nachweisreagenz im Unterricht.",
        answer: 0,
      },
      {
        name: "CH₃–CHO",
        observation:
          "Die endständige Aldehydgruppe kennzeichnet ein Alkanal; eine positive Fehlingprobe ist ein möglicher Nachweis.",
        answer: 1,
      },
      {
        name: "CH₃–COOH",
        observation:
          "Die Carboxygruppe kennzeichnet eine Carbonsäure. In Wasser können Oxoniumionen entstehen.",
        answer: 2,
      },
      {
        name: "CH₂=CH₂",
        observation:
          "Die Kohlenstoff-Doppelbindung kennzeichnet ein Alken; die Entfärbung von Bromwasser kann Mehrfachbindungen nachweisen.",
        answer: 3,
      },
    ],
  },
  "acid-salts": {
    title: "Säure und Säurerest",
    options: ["Chloridion", "Acetation", "Hydrogencarbonation", "Ammoniumion"],
    cases: [
      {
        name: "HCl gibt ein Proton ab",
        observation:
          "Aus dem neutralen HCl-Teilchen wird nach Abgabe eines positiven Protons das einfach negative Chloridion.",
        answer: 0,
      },
      {
        name: "Essigsäure gibt ein Proton ab",
        observation:
          "Die Carboxygruppe kann ein Proton abgeben. Es bleibt das negativ geladene Acetation.",
        answer: 1,
      },
      {
        name: "Kohlensäure gibt ein Proton ab",
        observation: "Im ersten Schritt bildet sich aus Kohlensäure das Hydrogencarbonation.",
        answer: 2,
      },
      {
        name: "Ammoniak nimmt ein Proton auf",
        observation:
          "Hier ist Ammoniak die Base: Durch Protonenaufnahme entsteht das positiv geladene Ammoniumion.",
        answer: 3,
      },
    ],
  },
  oxide: {
    title: "Saure und alkalische Lösungen",
    options: ["Saure Lösung", "Alkalische Lösung"],
    cases: [
      {
        name: "Kohlenstoffdioxid in Wasser",
        observation:
          "Ein kleiner Anteil reagiert im Gleichgewicht zu Kohlensäure; durch Protolyse entstehen Oxoniumionen.",
        answer: 0,
      },
      {
        name: "Calciumoxid mit Wasser",
        observation: "Es entsteht Calciumhydroxid. Dessen gelöster Anteil liefert Hydroxidionen.",
        answer: 1,
      },
      {
        name: "Lithium mit Wasser",
        observation:
          "Im Unterricht entsteht unter anderem Lithiumhydroxid. In Wasser liegen Lithium- und Hydroxidionen vor.",
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

export function makeLab(kind: LabKind, advanced = false): LabDefinition {
  if (EXPERIMENTS[kind]) return experimentLab(kind);
  switch (kind) {
    case "particles":
      return lab(
        kind,
        "Wasser im Teilchenmodell",
        "Verändere die Temperatur bei Normaldruck. Die Kreise stehen für ganze Wassermoleküle, nicht für sich ausdehnende Teilchen.",
        [range("temperature", "Temperatur", -20, 120, 20, 5, "°C")],
        [
          read("phase", "Aggregatzustand", (v) =>
            v.temperature < 0
              ? "fest"
              : v.temperature === 0
                ? "Schmelzübergang"
                : v.temperature < 100
                  ? "flüssig"
                  : v.temperature === 100
                    ? "Siedeübergang"
                    : "gasförmig",
          ),
          read("motion", "Teilchen", (v) =>
            v.temperature < 0
              ? "Schwingen an geordneten Plätzen"
              : v.temperature <= 100
                ? "Beweglich, nahe beieinander"
                : "Weit auseinander, frei beweglich",
          ),
        ],
        [
          goal("ice", "Untersuche Eis unter 0 °C.", (v) => v.temperature < 0),
          goal(
            "liquid",
            "Untersuche flüssiges Wasser über 50 °C.",
            (v) => v.temperature > 50 && v.temperature < 100,
          ),
          goal("gas", "Untersuche Wasserdampf über 100 °C.", (v) => v.temperature > 100),
        ],
      );
    case "reaction":
      return lab(
        kind,
        "Moleküle neu ordnen",
        "Im geschlossenen Modell reagieren immer zwei Wasserstoffmoleküle mit einem Sauerstoffmolekül. Atome gehen nicht verloren.",
        [
          range("hydrogen", "Wasserstoffmoleküle", 0, 8, 1),
          range("oxygen", "Sauerstoffmoleküle", 0, 4, 0),
        ],
        [
          read("water", "Wassermoleküle danach", (v) => reaction(v.hydrogen, v.oxygen).water),
          read("left", "Übrig", (v) => {
            const r = reaction(v.hydrogen, v.oxygen);
            return `${r.hydrogen} H₂ und ${r.oxygen} O₂`;
          }),
        ],
        [
          goal(
            "balanced",
            "Lass 2 H₂ mit 1 O₂ vollständig reagieren.",
            (v) => v.hydrogen === 2 && v.oxygen === 1,
          ),
          goal(
            "scale",
            "Verdopple beide Ausgangsmengen ohne Rest.",
            (v) => v.hydrogen === 4 && v.oxygen === 2,
          ),
          goal("excess", "Erzeuge Wasser und behalte Wasserstoff übrig.", (v) => {
            const r = reaction(v.hydrogen, v.oxygen);
            return r.water > 0 && r.hydrogen > 0;
          }),
        ],
      );
    case "energy":
      return lab(
        kind,
        "Reaktionsenergie und Katalyse",
        "Das Energiediagramm ist schematisch. Ein Katalysator verändert die Aktivierungsenergie, nicht die Energiedifferenz zwischen Edukten und Produkten.",
        [
          choice("endo", "Reaktionsart", ["exotherm", "endotherm"]),
          choice("catalyst", "Katalysator", ["ohne", "mit"]),
        ],
        [
          read("delta", "Reaktionsenergie (Modell)", (v) => (v.endo ? 40 : -40), "kJ"),
          read("barrier", "Aktivierungsenergie (Modell)", (v) => (v.catalyst ? 55 : 100), "kJ"),
        ],
        [
          goal(
            "exo",
            "Vergleiche eine exotherme Reaktion mit Katalysator.",
            (v) => v.endo === 0 && v.catalyst === 1,
          ),
          goal(
            "endo",
            "Untersuche eine endotherme Reaktion ohne Katalysator.",
            (v) => v.endo === 1 && v.catalyst === 0,
          ),
          goal(
            "same",
            "Setze nun auch bei der endothermen Reaktion einen Katalysator ein.",
            (v) => v.endo === 1 && v.catalyst === 1,
          ),
        ],
      );
    case "amount":
      return lab(
        kind,
        "Von Gramm zu Teilchen",
        "Die Stoffmenge zählt Teilchen in mol. Die molare Masse gehört zur jeweils gewählten Teilchenart.",
        [
          choice("substance", "Teilchenart", [
            "Wasser: M = 18 g/mol",
            "Kohlenstoffdioxid: M = 44 g/mol",
          ]),
          range("mass", "Masse", 0, 88, 9, 1, "g"),
        ],
        [
          read("moles", "Stoffmenge", (v) => v.mass / (v.substance ? 44 : 18), "mol"),
          read(
            "count",
            "Teilchenzahl",
            (v) => `${((v.mass / (v.substance ? 44 : 18)) * 6.02214076).toFixed(3)} · 10²³`,
          ),
        ],
        [
          goal(
            "water",
            "Stelle genau 1 mol Wasser ein.",
            (v) => v.substance === 0 && v.mass === 18,
          ),
          goal(
            "co2",
            "Stelle genau 1 mol Kohlenstoffdioxid ein.",
            (v) => v.substance === 1 && v.mass === 44,
          ),
          goal(
            "double",
            "Stelle 2 mol Kohlenstoffdioxid ein.",
            (v) => v.substance === 1 && v.mass === 88,
          ),
        ],
      );
    case "rutherford":
      return lab(
        kind,
        "Rutherford: Spuren deuten",
        "Wähle den Abstand einer positiv geladenen Sonde zum Kern. Die Bahn ist eine qualitative Skizze, keine maßstäbliche Streurechnung.",
        [range("impact", "Seitlicher Abstand (Modell)", 0, 10, 10)],
        [
          read("angle", "Ablenkung im Modell", (v) =>
            v.impact === 0 ? "Rückstreuung" : v.impact <= 2 ? "stark abgelenkt" : "fast gerade",
          ),
          read("conclusion", "Was folgt?", (v) =>
            v.impact <= 2
              ? "Positive Ladung und fast alle Masse sitzen im kleinen Kern."
              : "Die Hülle beansprucht viel Raum; die meisten Sonden passieren sie.",
          ),
        ],
        [
          goal("near", "Untersuche einen kernnahen Vorbeiflug.", (v) => v.impact === 1),
          goal("back", "Untersuche eine Sonde auf direktem Kernkurs.", (v) => v.impact === 0),
          goal("far", "Vergleiche einen Flug mit mittlerem Abstand.", (v) => v.impact === 5),
        ],
      );
    case "atom":
      return lab(
        kind,
        "Atom- und Ionenbaukasten",
        "Protonenzahl bestimmt das Element. Neutronenzahl unterscheidet Isotope, Elektronenzahl bestimmt zusammen mit der Protonenzahl die Ladung.",
        [
          range("p", "Protonen", 1, 20, 6),
          range("n", "Neutronen", 0, 22, 6),
          range("e", "Elektronen", 0, 20, 6),
        ],
        [
          read("element", "Element", (v) => element(v.p).name),
          read("massNumber", "Massenzahl", (v) => v.p + v.n),
          read("charge", "Ladungszahl", (v) => v.p - v.e),
        ],
        [
          goal(
            "isotope",
            "Baue ein neutrales Kohlenstoff-14-Atom.",
            (v) => v.p === 6 && v.n === 8 && v.e === 6,
          ),
          goal(
            "sodium",
            "Baue Natrium-23 als einfach positives Ion.",
            (v) => v.p === 11 && v.n === 12 && v.e === 10,
          ),
          goal(
            "chloride",
            "Baue Chlor-35 als einfach negatives Ion.",
            (v) => v.p === 17 && v.n === 18 && v.e === 18,
          ),
        ],
      );
    case "shells":
    case "periodic":
      return lab(
        kind,
        kind === "shells" ? "Energiestufen besetzen" : "PSE lesen",
        "Das Modell zeigt die ersten 20 neutralen Atome. Die Besetzung 2, 8, 8, 2 ist keine allgemeine Füllregel; die Kapazität einer Schale im Bohr-Modell ist 2n².",
        [range("z", "Ordnungszahl", 1, 20, 1), range("shell", "Schalennummer n", 1, 4, 1)],
        [
          read(
            "element",
            "Element / Hauptgruppe",
            (v) => `${element(v.z).name} · Hauptgruppe ${element(v.z).group}`,
          ),
          read("distribution", "Elektronenverteilung", (v) => shells(v.z).join(" | ")),
          read("outer", "Außenelektronen", (v) => shells(v.z).at(-1) ?? 0),
          read("capacity", "Maximale Schalenkapazität im Bohr-Modell", (v) => 2 * v.shell ** 2),
        ],
        [
          goal(
            "helium",
            "Untersuche Helium: Hauptgruppe VIII, aber zwei Außenelektronen.",
            (v) => v.z === 2,
          ),
          goal(
            "sodium",
            "Untersuche Natrium auf seiner dritten besetzten Energiestufe.",
            (v) => v.z === 11 && v.shell === 3,
          ),
          goal(
            "calcium",
            "Untersuche Calcium und die vierte Energiestufe.",
            (v) => v.z === 20 && v.shell === 4,
          ),
        ],
      );
    case "clouds":
      return lab(
        kind,
        "Vier Kugelwolken",
        "Im vereinfachten Valenzschalenmodell werden vier Wolken zuerst einzeln, dann paarweise besetzt. Das Bild zeigt eine Projektion, keine Elektronenbahnen.",
        [range("valence", "Valenzelektronen", 1, 8, 1)],
        [
          read("occupancy", "Besetzung", (v) => clouds(v.valence).join(" | ")),
          read(
            "unpaired",
            "Einzeln besetzte Wolken",
            (v) => clouds(v.valence).filter((n) => n === 1).length,
          ),
        ],
        [
          goal(
            "carbon",
            "Modelliere Kohlenstoff mit vier Außenelektronen.",
            (v) => v.valence === 4,
          ),
          goal(
            "oxygen",
            "Modelliere Sauerstoff mit sechs Außenelektronen.",
            (v) => v.valence === 6,
          ),
          goal("noble", "Fülle die vier Wolken vollständig.", (v) => v.valence === 8),
        ],
      );
    case "ionic":
      return lab(
        kind,
        "Ein neutrales Ionengitter",
        "Gleiche positive und negative Gesamtladung aus. Die Verhältnisformel nennt das kleinste ganzzahlige Verhältnis der Ionen.",
        [
          range("positive", "Kationenladung", 1, 3, 1),
          range("negative", "Betrag der Anionenladung", 1, 3, 1),
          range("cations", "Kationen", 1, 6, 1),
          range("anions", "Anionen", 1, 6, 2),
        ],
        [
          read(
            "charge",
            "Gesamtladungszahl",
            (v) => v.positive * v.cations - v.negative * v.anions,
          ),
          read("ratio", "Kleinstes neutrales Verhältnis", (v) =>
            saltRatio(v.positive, v.negative).join(" : "),
          ),
        ],
        [
          goal(
            "nacl",
            "Baue das kleinste Verhältnis für +1 und −1.",
            (v) => v.positive === 1 && v.negative === 1 && v.cations === 1 && v.anions === 1,
          ),
          goal(
            "mgcl2",
            "Baue das kleinste Verhältnis für +2 und −1.",
            (v) => v.positive === 2 && v.negative === 1 && v.cations === 1 && v.anions === 2,
          ),
          goal(
            "al2o3",
            "Baue das kleinste Verhältnis für +3 und −2.",
            (v) => v.positive === 3 && v.negative === 2 && v.cations === 2 && v.anions === 3,
          ),
        ],
      );
    case "metal":
      return lab(
        kind,
        "Metall oder Salz leitet?",
        "Vergleiche Ladungsträger im Feststoff, in einer Schmelze und bei Salz zusätzlich in einer wässrigen Lösung. Metalle werden hier nicht als gelöst modelliert.",
        [
          choice("material", "Stoff", ["Metall", "Salz"]),
          choice("phase", "Zustand", ["fest", "geschmolzen", "in Wasser (Salz)"]),
        ],
        [
          read("carrier", "Bewegliche Ladungsträger", (v) =>
            v.material === 0
              ? v.phase === 2
                ? "Für Metall hier nicht modelliert"
                : "Delokalisierte Elektronen"
              : v.phase === 0
                ? "Keine: Ionen sind an Gitterplätze gebunden"
                : "Bewegliche Ionen",
          ),
          read("conducts", "Leitfähigkeit", (v) =>
            v.material === 0 && v.phase === 2
              ? "Kein Fall dieses Modells"
              : v.material === 0 || v.phase !== 0
                ? "leitet"
                : "leitet nicht",
          ),
        ],
        [
          goal("salt", "Untersuche festes Salz.", (v) => v.material === 1 && v.phase === 0),
          goal("melt", "Schmelze das Salz im Modell.", (v) => v.material === 1 && v.phase === 1),
          goal("metal", "Vergleiche ein festes Metall.", (v) => v.material === 0 && v.phase === 0),
        ],
      );
    case "lewis":
    case "geometry":
      return lab(
        kind,
        kind === "lewis" ? "Elektronenpaare setzen" : "Vom Elektronenpaar zum Raumbau",
        "Zähle bindende Paare im ganzen Molekül und freie Paare nur am bezeichneten Atom. Bei der Raumgestalt zählt eine Mehrfachbindung als ein Bindungsbereich.",
        [
          choice(
            "molecule",
            "Molekül",
            MOLECULES.map((m) => `${m.formula} (Atom ${m.center})`),
            3,
          ),
          range("bonds", "Bindende Paare im Molekül", 0, 4, 0),
          range("lone", "Freie Paare am bezeichneten Atom", 0, 3, 0),
          choice("shape", "Molekülgestalt", SHAPES),
        ],
        [
          read("pairs", "Paare prüfen", (v) => {
            const m = MOLECULES[v.molecule];
            return v.bonds === m.bonds && v.lone === m.lone
              ? "Elektronenpaare stimmen"
              : "Noch nicht: Prüfe Valenzelektronen und Edelgasregel.";
          }),
          read("domains", "Bindungsbereiche am Atom", (v) => MOLECULES[v.molecule].domains),
          read("angle", "Bindungswinkel (ungefähr)", (v) => MOLECULES[v.molecule].angle, "°"),
        ],
        [3, 5, 6].map((index) =>
          goal(
            `molecule-${index}`,
            `Baue ${MOLECULES[index].formula} mit passenden Paaren und richtiger Gestalt.`,
            (v) => {
              const m = MOLECULES[index];
              return (
                v.molecule === index &&
                v.bonds === m.bonds &&
                v.lone === m.lone &&
                SHAPES[v.shape] === m.shape
              );
            },
          ),
        ),
      );
    case "polarity":
      return lab(
        kind,
        "Polare Bindung, polarer Gesamtbau?",
        "Zwei gleich starke Bindungsdipole werden addiert. Der Regler beschreibt ein schematisches zweiarmiges Molekül; er verändert kein echtes Wassermolekül.",
        [
          range("difference", "EN-Differenz der Bindungen", 0, 2, 0, 0.1),
          range("angle", "Winkel zwischen den Bindungsdipolen", 60, 180, 180, 5, "°"),
        ],
        [
          read("dipole", "Resultierende (relative Modelleinheit)", (v) =>
            Math.abs(2 * v.difference * Math.cos((v.angle * Math.PI) / 360)),
          ),
          read("result", "Deutung", (v) =>
            v.difference === 0
              ? "Keine Bindungsdipole"
              : v.angle === 180
                ? "Polare Bindungen, aber Dipole heben sich auf (wie bei CO₂)"
                : "Bindungsdipole heben sich nicht auf (wie bei gewinkeltem Wasser)",
          ),
        ],
        [
          goal(
            "polar",
            "Stelle polare Bindungen mit einem Winkel von 100° ein.",
            (v) => v.difference >= 1 && v.angle === 100,
          ),
          goal(
            "cancel",
            "Lass gleich starke polare Bindungen bei 180° einander aufheben.",
            (v) => v.difference >= 1 && v.angle === 180,
          ),
          goal(
            "zero",
            "Untersuche bei 90° zwei unpolare Bindungen.",
            (v) => v.difference === 0 && v.angle === 90,
          ),
        ],
      );
    case "organic":
      return lab(
        kind,
        "Kohlenwasserstoffe bauen",
        "Das Modell beschreibt offene Ketten mit höchstens einer Mehrfachbindung. Ringverbindungen sind ausgeschlossen; eine Summenformel allein legt die Struktur nicht fest.",
        [
          range("carbon", "Kohlenstoffatome", 2, 6, 2),
          choice(
            "bond",
            "Bindungsart",
            advanced
              ? ["nur Einfachbindungen", "eine Doppelbindung", "eine Dreifachbindung"]
              : ["nur Einfachbindungen", "eine Doppelbindung"],
          ),
        ],
        [
          read("formula", "Summenformel", (v) => hydrocarbon(v.carbon, v.bond + 1).formula),
          read("name", "Unverzweigte Kette, Mehrfachbindung an Position 1", (v) => {
            const h = hydrocarbon(v.carbon, v.bond + 1);
            return v.bond && v.carbon >= 4 ? h.name.replace(/(en|in)$/, "-1-$1") : h.name;
          }),
        ],
        [
          goal("ethane", "Baue Ethan.", (v) => v.carbon === 2 && v.bond === 0),
          goal(
            "ethene",
            "Baue Ethen und vergleiche die Wasserstoffzahl.",
            (v) => v.carbon === 2 && v.bond === 1,
          ),
          goal("butane", "Baue unverzweigtes Butan.", (v) => v.carbon === 4 && v.bond === 0),
        ],
      );
    case "redox":
      return lab(
        kind,
        "Elektronenbilanz ausgleichen",
        "Wähle die Elektronenzahl einer Oxidation und einer Reduktion. Finde die kleinsten Faktoren: Abgegebene und aufgenommene Elektronen müssen gleich viele sein.",
        [
          range("donor", "Elektronen je Donatorteilchen", 1, 3, 2),
          range("acceptor", "Elektronen je Akzeptorteilchen", 1, 3, 1),
          range("dCount", "Donatorteilchen", 1, 6, 1),
          range("aCount", "Akzeptorteilchen", 1, 6, 1),
        ],
        [
          read("balance", "Abgabe − Aufnahme", (v) => v.donor * v.dCount - v.acceptor * v.aCount),
          read("minimal", "Kleinste Faktoren (Donator : Akzeptor)", (v) =>
            saltRatio(v.donor, v.acceptor).join(" : "),
          ),
        ],
        [
          goal(
            "two",
            "Gleiche 2 Elektronen Abgabe mit 1 Elektron Aufnahme aus.",
            (v) => v.donor === 2 && v.acceptor === 1 && v.dCount === 1 && v.aCount === 2,
          ),
          goal(
            "six",
            "Gleiche 3 Elektronen Abgabe mit 2 Elektronen Aufnahme aus.",
            (v) => v.donor === 3 && v.acceptor === 2 && v.dCount === 2 && v.aCount === 3,
          ),
          goal(
            "one",
            "Vergleiche zwei Vorgänge mit je 2 Elektronen.",
            (v) => v.donor === 2 && v.acceptor === 2 && v.dCount === 1 && v.aCount === 1,
          ),
        ],
      );
    case "oxidation":
      return lab(
        kind,
        "Oxidationszahlen prüfen",
        "Die Summe der Oxidationszahlen entspricht der Teilchenladung. Sauerstoff hat nicht immer −II: Peroxide sind eine wichtige Ausnahme.",
        [
          choice("compound", "Verbindung", [
            "H₂O, Wasserstoff +I",
            "H₂O₂, Wasserstoff +I",
            "NaH, Natrium +I",
          ]),
          range("number", "Gesuchte Oxidationszahl (O bzw. H)", -3, 3, 0),
        ],
        [
          read("sum", "Summe im neutralen Teilchen", (v) =>
            v.compound === 0 ? 2 + v.number : v.compound === 1 ? 2 + 2 * v.number : 1 + v.number,
          ),
        ],
        [
          goal(
            "water",
            "Finde die Oxidationszahl von O in Wasser.",
            (v) => v.compound === 0 && v.number === -2,
          ),
          goal(
            "peroxide",
            "Finde die Oxidationszahl von O in Wasserstoffperoxid.",
            (v) => v.compound === 1 && v.number === -1,
          ),
          goal(
            "hydride",
            "Finde die Oxidationszahl von H in Natriumhydrid.",
            (v) => v.compound === 2 && v.number === -1,
          ),
        ],
      );
    case "salt-solution":
      return lab(
        kind,
        "Gitter lösen, Ionen hydratisieren",
        "Ein vereinfachter Energiekreislauf: Das Gitter zu trennen kostet Energie. Die Hydratation setzt Energie frei. Ihre Bilanz kann beide Vorzeichen haben.",
        [
          range("lattice", "Energie zum Gittertrennen", 500, 900, 600, 50, "kJ/mol"),
          range(
            "hydration",
            "Freigesetzte Hydratationsenergie (Betrag)",
            500,
            900,
            600,
            50,
            "kJ/mol",
          ),
        ],
        [
          read("delta", "Lösungsenergie im Modell", (v) => v.lattice - v.hydration, "kJ/mol"),
          read("effect", "Wirkung auf die Umgebung", (v) =>
            v.lattice > v.hydration
              ? "kühlt ab (endotherm)"
              : v.lattice < v.hydration
                ? "wärmt sich auf (exotherm)"
                : "hier keine Temperaturänderung",
          ),
        ],
        [
          goal(
            "exo",
            "Modelliere eine Erwärmung um 100 kJ/mol Energiebetrag.",
            (v) => v.hydration - v.lattice === 100,
          ),
          goal(
            "endo",
            "Modelliere eine Abkühlung mit 100 kJ/mol Energieaufnahme.",
            (v) => v.lattice - v.hydration === 100,
          ),
          goal(
            "large",
            "Untersuche die Bilanz 900 zu 500 kJ/mol.",
            (v) => v.lattice === 900 && v.hydration === 500,
          ),
        ],
      );
    case "cell":
    case "electrolysis":
      return lab(
        kind,
        kind === "cell" ? "Batterie und Akku im Modell" : "Galvanisieren im Modell",
        "Die Zeichnung trennt Elektronenleitung im Draht von Ionenbewegung in der Lösung. Das galvanische Modell liefert Energie, die Elektrolyse benötigt eine äußere Stromquelle.",
        [
          choice("mode", "Betriebsart", [
            "Stromkreis offen",
            "Galvanische Entladung",
            "Elektrolyse / Laden",
          ]),
          choice("electrode", "Am betrachteten Elektrodenort", [
            "Oxidation (Elektronenabgabe)",
            "Reduktion (Elektronenaufnahme)",
          ]),
        ],
        [
          read("energy", "Energiefluss", (v) =>
            v.mode === 0
              ? "Kein äußerer Strom"
              : v.mode === 1
                ? "Chemische → elektrische Energie"
                : "Elektrische → chemische Energie",
          ),
          read("electrode", "Name und Vorzeichen", (v) =>
            v.mode === 0
              ? "Kein Stromfluss"
              : `${v.electrode === 0 ? "Anode" : "Kathode"}, ${v.mode === 1 ? (v.electrode === 0 ? "negativ" : "positiv") : v.electrode === 0 ? "positiv" : "negativ"}`,
          ),
        ],
        [
          goal(
            "anode",
            "Untersuche die Anode bei galvanischer Entladung.",
            (v) => v.mode === 1 && v.electrode === 0,
          ),
          goal(
            "cathode",
            "Untersuche die Kathode bei der Elektrolyse.",
            (v) => v.mode === 2 && v.electrode === 1,
          ),
          goal(
            "reverse",
            "Vergleiche dazu die Anode bei der Elektrolyse.",
            (v) => v.mode === 2 && v.electrode === 0,
          ),
        ],
      );
    case "corrosion":
      return lab(
        kind,
        "Metalle in Kontakt",
        "Die qualitative Reihe lautet hier Magnesium, Zink, Eisen, Kupfer (von unedel zu edel). Die Lösung enthält Ionen des Kontaktpartners; reale Korrosion hängt zusätzlich von Umgebung und Schutzschichten ab.",
        [
          choice("metal", "Metallstück", ["Magnesium", "Zink", "Eisen", "Kupfer"], 2),
          choice(
            "ion",
            "Metallionen der Lösung",
            ["Magnesiumionen", "Zinkionen", "Eisenionen", "Kupferionen"],
            2,
          ),
        ],
        [
          read("reaction", "Modellbeobachtung", (v) =>
            v.metal < v.ion
              ? "Metallstück gibt Elektronen ab; edleres Metall scheidet sich ab."
              : "Keine freiwillige Metallabscheidung im Modell.",
          ),
        ],
        [
          goal(
            "iron",
            "Untersuche Eisen in einer Kupferionenlösung.",
            (v) => v.metal === 2 && v.ion === 3,
          ),
          goal(
            "copper",
            "Vergleiche Kupfer in einer Eisenionenlösung.",
            (v) => v.metal === 3 && v.ion === 2,
          ),
          goal(
            "zinc",
            "Untersuche Zink als unedlen Elektronendonator gegenüber Eisenionen.",
            (v) => v.metal === 1 && v.ion === 2,
          ),
        ],
      );
    case "fuelcell":
      return lab(
        kind,
        "Brennstoffzelle: Stoff- und Energiebilanz",
        "Die Stoffbilanz folgt 2 H₂ + O₂ → 2 H₂O. Die Leistungsbilanz zeigt gewählte Modellwerte; die Herkunft des Wasserstoffs entscheidet mit über die Umweltbilanz.",
        [
          range("hydrogen", "Wasserstoff (mol)", 0, 8, 1),
          range("oxygen", "Sauerstoff (mol)", 0, 4, 0),
          range("efficiency", "Wirkungsgrad (Modell)", 20, 80, 50, 5, "%"),
        ],
        [
          read(
            "water",
            "Wasser nach Reaktion (mol)",
            (v) => 2 * Math.min(v.hydrogen / 2, v.oxygen),
          ),
          read(
            "electric",
            "Elektrische Energie aus 100 kJ Umsatz",
            (v) => (v.hydrogen && v.oxygen ? v.efficiency : 0),
            "kJ",
          ),
        ],
        [
          goal(
            "ratio",
            "Stelle das stöchiometrische Verhältnis 2 : 1 ein.",
            (v) => v.hydrogen === 2 && v.oxygen === 1,
          ),
          goal("scale", "Verdopple beide Stoffmengen.", (v) => v.hydrogen === 4 && v.oxygen === 2),
          goal(
            "efficiency",
            "Vergleiche bei 4 mol H₂ und 2 mol O₂ einen Wirkungsgrad von 70 %.",
            (v) => v.hydrogen === 4 && v.oxygen === 2 && v.efficiency === 70,
          ),
        ],
      );
    case "indicator":
      return lab(
        kind,
        "Die pH-Skala lesen",
        "Die Einteilung gilt für wässrige Lösungen bei etwa 25 °C. Farben sind schematische Universalindikatorfarben; pH allein bestimmt weder Stoffmenge noch Gefährlichkeit.",
        [range("ph", "pH-Wert", 0, 14, 7)],
        [
          read("class", "Lösung", (v) => (v.ph < 7 ? "sauer" : v.ph > 7 ? "alkalisch" : "neutral")),
          read("ion", "Überwiegende Ionenart im Vergleich", (v) =>
            v.ph < 7
              ? "Oxoniumionen überwiegen gegenüber Hydroxidionen"
              : v.ph > 7
                ? "Hydroxidionen überwiegen gegenüber Oxoniumionen"
                : "Gleiche Konzentrationen beider Ionenarten",
          ),
        ],
        [
          goal("acid", "Stelle eine saure Lösung mit pH 3 ein.", (v) => v.ph === 3),
          goal("base", "Stelle eine alkalische Lösung mit pH 11 ein.", (v) => v.ph === 11),
          goal("neutral", "Vergleiche danach eine neutrale Lösung bei 25 °C.", (v) => v.ph === 7),
        ],
      );
    case "proton":
      return lab(
        kind,
        "Ein Proton wechselt den Partner",
        "Übertrage ein Proton. Das zurückbleibende Elektronenpaar bleibt beim Donator. Eine Brönsted-Base nimmt das Proton auf.",
        [
          choice("case", "Ausgangsteilchen", ["HCl + H₂O", "NH₃ + H₂O", "CH₃COOH + H₂O"]),
          choice("transferred", "Modellschritt", [
            "vor Protonenübergang",
            "nach einem Protonenübergang",
          ]),
        ],
        [
          read(
            "donor",
            "Protonendonator",
            (v) => ["Chlorwasserstoff", "Wasser", "Essigsäure"][v.case],
          ),
          read("acceptor", "Protonenakzeptor", (v) => (v.case === 1 ? "Ammoniak" : "Wasser")),
          read("products", "Teilchen danach", (v) =>
            v.transferred
              ? ["Cl⁻ + H₃O⁺", "NH₄⁺ + OH⁻", "CH₃COO⁻ + H₃O⁺ (Gleichgewicht)"][v.case]
              : "Proton noch beim Donator",
          ),
        ],
        [0, 1, 2].map((index) =>
          goal(
            `proton-${index}`,
            `Untersuche den Protonenübergang bei ${["Chlorwasserstoff", "Ammoniak", "Essigsäure"][index]}.`,
            (v) => v.case === index && v.transferred === 1,
          ),
        ),
      );
    default:
      throw new Error(`No lab definition for ${kind}`);
  }
}

/** Explicit action witness used by the same goal checker as the UI. */
export function experimentWitness(kind: LabKind, index: number): LabValues {
  const entry = EXPERIMENTS[kind]?.cases[index];
  if (!entry) throw new Error(`No case ${index} in ${kind}`);
  return { case: index, prediction: entry.answer, observed: 1 };
}
