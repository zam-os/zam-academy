import type { ModelKind } from "./model/types";

export interface ModelState {
  selected: string;
  sequence: string;
  division: "mitosis" | "meiosis";
  parentA: "AA" | "Aa" | "aa";
  parentB: "AA" | "Aa" | "aa";
  dihybrid: boolean;
  load: number;
  retention: number;
  prevalence: number;
}
export const initialModelState = (): ModelState => ({
  selected: "",
  sequence: "ATGGCTTAA",
  division: "mitosis",
  parentA: "Aa",
  parentB: "Aa",
  dihybrid: false,
  load: 2,
  retention: 70,
  prevalence: 1,
});
type Scenario = { id: string; label: string; settings: Partial<ModelState> };
export const MODEL_SCENARIOS: Record<ModelKind, Scenario[]> = {
  dna: [
    { id: "pairing", label: "A–T und G–C vergleichen", settings: { sequence: "ATGC" } },
    { id: "reversed", label: "Andere Basenfolge", settings: { sequence: "GCTA" } },
  ],
  division: [
    { id: "mitosis", label: "Mitose: Satz erhalten", settings: { division: "mitosis" } },
    { id: "meiosis", label: "Meiose: Satz halbieren", settings: { division: "meiosis" } },
  ],
  inheritance: [
    {
      id: "uniform",
      label: "AA × aa: F1",
      settings: { parentA: "AA", parentB: "aa", dihybrid: false },
    },
    {
      id: "split",
      label: "Aa × Aa: F2",
      settings: { parentA: "Aa", parentB: "Aa", dihybrid: false },
    },
    { id: "independent", label: "AaBb × AaBb: unabhängig", settings: { dihybrid: true } },
  ],
  code: [
    { id: "original", label: "AUG · GCU · UAA", settings: { sequence: "ATGGCTTAA" } },
    { id: "early-stop", label: "Früheres Stoppcodon", settings: { sequence: "ATGTAATGG" } },
  ],
  ecosystem: [
    { id: "balanced", label: "Kleiner Eintrag", settings: { load: 2, retention: 70 } },
    { id: "loaded", label: "Größerer Eintrag", settings: { load: 8, retention: 70 } },
    { id: "buffer", label: "Stärkerer Abbau oder Abfluss", settings: { load: 8, retention: 30 } },
  ],
  screening: [
    { id: "rare", label: "Ausgangshäufigkeit 1 %", settings: { prevalence: 1 } },
    { id: "common", label: "Ausgangshäufigkeit 10 %", settings: { prevalence: 10 } },
  ],
};
export function applyScenario(kind: ModelKind, state: ModelState, id: string): ModelState {
  const scenario = MODEL_SCENARIOS[kind].find((entry) => entry.id === id);
  return scenario ? { ...state, ...scenario.settings, selected: id } : { ...state };
}
export function recordExploration(kind: ModelKind, seen: string[], id: string): string[] {
  const allowed = new Set(MODEL_SCENARIOS[kind].map((entry) => entry.id));
  return [...new Set([...seen, id].filter((entry) => allowed.has(entry)))];
}
export const modelReady = (kind: ModelKind, seen: string[]): boolean =>
  MODEL_SCENARIOS[kind].every((entry) => seen.includes(entry.id));

/** Keeps the input's displayed direction: 5′–ATGC–3′ pairs with 3′–TACG–5′. */
export function dnaComplement(sequence: string): string | null {
  const text = sequence.trim().toUpperCase();
  if (!/^[ATGC]{1,60}$/.test(text)) return null;
  return [...text].map((base) => ({ A: "T", T: "A", G: "C", C: "G" })[base]).join("");
}
export type Genotype = "AA" | "Aa" | "aa";
export function monohybrid(a: Genotype, b: Genotype) {
  if (!["AA", "Aa", "aa"].includes(a) || !["AA", "Aa", "aa"].includes(b))
    throw new Error("Unknown genotype");
  const squares = [...a].flatMap((x) => [...b].map((y) => [x, y].sort().join("")));
  const counts = {
    AA: squares.filter((g) => g === "AA").length,
    Aa: squares.filter((g) => g === "Aa").length,
    aa: squares.filter((g) => g === "aa").length,
  };
  return { squares, counts, dominant: counts.AA + counts.Aa, recessive: counts.aa };
}
export function dihybrid() {
  const gametes = ["AB", "Ab", "aB", "ab"];
  const squares = gametes.flatMap((a) =>
    gametes.map((b) => [a[0], b[0]].sort().join("") + [a[1], b[1]].sort().join("")),
  );
  const counts = { both: 0, onlyA: 0, onlyB: 0, neither: 0 };
  for (const genotype of squares) {
    const a = genotype.slice(0, 2).includes("A"),
      b = genotype.slice(2).includes("B");
    counts[a && b ? "both" : a ? "onlyA" : b ? "onlyB" : "neither"]++;
  }
  return { gametes, squares, counts };
}
/** Counts per nucleus; a transition separates nuclei before any daughter-cell claim. */
export function divisionStates(kind: "mitosis" | "meiosis", diploid = 46) {
  if (!Number.isInteger(diploid) || diploid < 2 || diploid % 2 !== 0)
    throw new Error("Expected an even diploid count");
  const before = [
    { label: "Ausgangskern", nuclei: 1, chromosomes: diploid, chromatids: diploid, ploidy: "2n" },
    {
      label: "Nach Replikation",
      nuclei: 1,
      chromosomes: diploid,
      chromatids: 2 * diploid,
      ploidy: "2n",
    },
  ];
  return [
    ...before,
    ...(kind === "mitosis"
      ? [
          {
            label: "Nach Mitose",
            nuclei: 2,
            chromosomes: diploid,
            chromatids: diploid,
            ploidy: "2n",
          },
        ]
      : [
          {
            label: "Nach Meiose I",
            nuclei: 2,
            chromosomes: diploid / 2,
            chromatids: diploid,
            ploidy: "1n",
          },
          {
            label: "Nach Meiose II",
            nuclei: 4,
            chromosomes: diploid / 2,
            chromatids: diploid / 2,
            ploidy: "1n",
          },
        ]),
  ];
}
const CODE: Record<string, string> = {};
for (const [name, codons] of Object.entries({
  Phenylalanin: "UUU UUC",
  Leucin: "UUA UUG CUU CUC CUA CUG",
  Isoleucin: "AUU AUC AUA",
  Methionin: "AUG",
  Valin: "GUU GUC GUA GUG",
  Serin: "UCU UCC UCA UCG AGU AGC",
  Prolin: "CCU CCC CCA CCG",
  Threonin: "ACU ACC ACA ACG",
  Alanin: "GCU GCC GCA GCG",
  Tyrosin: "UAU UAC",
  Stopp: "UAA UAG UGA",
  Histidin: "CAU CAC",
  Glutamin: "CAA CAG",
  Asparagin: "AAU AAC",
  Lysin: "AAA AAG",
  Aspartat: "GAU GAC",
  Glutamat: "GAA GAG",
  Cystein: "UGU UGC",
  Tryptophan: "UGG",
  Arginin: "CGU CGC CGA CGG AGA AGG",
  Glycin: "GGU GGC GGA GGG",
}))
  for (const codon of codons.split(" ")) CODE[codon] = name;
export function translateCodingDNA(
  sequence: string,
): { rna: string; codons: string[]; amino: string[]; stopped: boolean } | null {
  const dna = sequence.trim().toUpperCase();
  if (!/^[ATGC]{3,60}$/.test(dna) || dna.length % 3 !== 0) return null;
  const rna = dna.replaceAll("T", "U"),
    codons = rna.match(/.{3}/g)!;
  const amino: string[] = [];
  let stopped = false;
  for (const codon of codons) {
    if (CODE[codon] === "Stopp") {
      stopped = true;
      break;
    }
    amino.push(CODE[codon]);
  }
  return { rna, codons, amino, stopped };
}
export function screeningTable(
  prevalence: number,
  population = 10000,
  sensitivity = 90,
  specificity = 95,
) {
  if (
    ![prevalence, sensitivity, specificity].every(
      (v) => Number.isFinite(v) && v >= 0 && v <= 100,
    ) ||
    !Number.isInteger(population) ||
    population < 1
  )
    throw new Error("Invalid frequency");
  const affected = Math.round((population * prevalence) / 100),
    unaffected = population - affected;
  const tp = Math.round((affected * sensitivity) / 100),
    fn = affected - tp;
  const tn = Math.round((unaffected * specificity) / 100),
    fp = unaffected - tn;
  return {
    affected,
    unaffected,
    tp,
    fn,
    tn,
    fp,
    positivePredictiveValue: tp + fp ? (100 * tp) / (tp + fp) : null,
  };
}
/** A deliberately unitless storage model, with no claim of empirical prediction. */
export function ecosystemSeries(load: number, retention: number) {
  if (
    !Number.isFinite(load) ||
    load < 0 ||
    load > 10 ||
    !Number.isFinite(retention) ||
    retention < 0 ||
    retention > 100
  )
    throw new Error("Invalid model parameters");
  let store = 0,
    totalInput = 0,
    totalRemoved = 0,
    feedback = false;
  const rows = [];
  for (let step = 0; step < 12; step++) {
    const input = step < 6 ? load : 0;
    if (store + input > 12) feedback = true;
    if (store + input < 4) feedback = false;
    const remaining = feedback ? Math.max(retention, 95) : retention;
    const removed = (store + input) * (1 - remaining / 100);
    store += input - removed;
    totalInput += input;
    totalRemoved += removed;
    rows.push({ step: step + 1, input, store, removed, totalInput, totalRemoved, feedback });
  }
  return rows;
}
