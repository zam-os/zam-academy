import type { CalculationKind, ExerciseTask, Level } from "../model/types";
import { fmt } from "./format";
import type { Rng } from "./rng";

/** Densities in g/cm³ as the lessons use them (OpenStax table, rounded). */
export const METALS = [
  { name: "Aluminium", rho: 2.7 },
  { name: "Eisen", rho: 7.8 },
  { name: "Kupfer", rho: 8.8 },
  { name: "Blei", rho: 11.3 },
  { name: "Gold", rho: 19.3 },
];
const STEEL = 7.8;
/** Lighter Werkstoffe for the same part. */
export const LIGHT = [
  { name: "Aluminium", rho: 2.7 },
  { name: "Titan", rho: 4.5 },
  { name: "CFK", rho: 1.5 },
];
const g = (value: number) => fmt(value, 2);
const tenth = (value: number) => Math.round(value * 10) / 10;

/**
 * Level 1 is guided: the values fit the formula directly. Level 2 is a
 * transfer task: a unit has to be converted, a formula rearranged or two
 * steps combined. Every task draws three integers a, b and c.
 */
export function makeExercise(
  kind: CalculationKind,
  rng: Rng,
  level: Level,
): ExerciseTask {
  const a = rng.int(2, 8),
    b = rng.int(2, 6),
    c = rng.int(0, 4);
  const task = (
    prompt: string,
    answer: number,
    unit: string,
    formula: string,
    solution: string,
  ): ExerciseTask => ({
    prompt,
    answer,
    unit,
    digits: 2,
    tolerance: 0.01,
    formulaHint: formula,
    solutionHtml: solution,
  });
  switch (kind) {
    case "dichte": {
      if (level === 1) {
        const metal = METALS[c],
          V = 5 * a,
          m = tenth(metal.rho * V),
          rho = m / V;
        return task(
          `Ein Würfel hat die Masse ${g(m)} g und das Volumen ${V} cm³. Berechne seine Dichte.`,
          rho,
          "g/cm³",
          "ρ = m / V",
          `ρ = ${g(m)} g : ${V} cm³ ≈ ${g(rho)} g/cm³. Das passt zu ${metal.name} (${g(metal.rho)} g/cm³).`,
        );
      }
      const metal = METALS[c % 3],
        V = a,
        m = metal.rho * V;
      return task(
        `Eine Platte aus ${metal.name} (ρ = ${g(metal.rho)} g/cm³) hat das Volumen ${V} dm³. Wie groß ist ihre Masse in Kilogramm?`,
        m,
        "kg",
        "m = ρ · V, dabei 1 dm³ = 1000 cm³ und 1 kg = 1000 g",
        `V = ${V} dm³ = ${fmt(V * 1000, 0)} cm³. m = ${g(metal.rho)} g/cm³ · ${fmt(V * 1000, 0)} cm³ = ${fmt(m * 1000, 0)} g = ${g(m)} kg.`,
      );
    }
    case "differenz": {
      if (level === 1) {
        const metal = METALS[c % 4],
          V = a + b,
          v1 = 50,
          v2 = v1 + V,
          m = tenth(metal.rho * V),
          rho = m / V;
        return task(
          `Ein Körper hat die Masse ${g(m)} g. Im Messzylinder steigt das Wasser von ${v1} ml auf ${v2} ml. Berechne die Dichte des Körpers.`,
          rho,
          "g/cm³",
          "V = V₂ − V₁, dann ρ = m / V",
          `V = ${v2} ml − ${v1} ml = ${V} ml = ${V} cm³. ρ = ${g(m)} g : ${V} cm³ ≈ ${g(rho)} g/cm³.`,
        );
      }
      const rho = (25 + c) / 10,
        V = 10 * a,
        m = tenth(rho * V);
      return task(
        `Ein Stein mit der Masse ${g(m)} g wird in ein randvoll gefülltes Überlaufgefäß gelegt. Dabei fließen ${V} ml Wasser über. Welche Dichte hat der Stein in kg/m³?`,
        (m / V) * 1000,
        "kg/m³",
        "ρ = m / V in g/cm³, dann 1 g/cm³ = 1000 kg/m³",
        `Das übergelaufene Wasser hat das Volumen des Steins: V = ${V} cm³. ρ = ${g(m)} g : ${V} cm³ = ${g(m / V)} g/cm³ = ${fmt((m / V) * 1000, 0)} kg/m³.`,
      );
    }
    case "bauteil": {
      if (level === 1) {
        const material = LIGHT[c % 3],
          V = 25 * a,
          m = material.rho * V;
        return task(
          `Ein Fahrradbauteil aus ${material.name} (ρ = ${g(material.rho)} g/cm³) enthält ${V} cm³ Material. Berechne seine Masse.`,
          m,
          "g",
          "m = ρ · V",
          `m = ${g(material.rho)} g/cm³ · ${V} cm³ = ${g(m)} g.`,
        );
      }
      const material = LIGHT[c % 3],
        V = 50 * b,
        mSteel = STEEL * V,
        mLight = material.rho * V,
        saving = mSteel - mLight;
      return task(
        `Ein Bauteil aus Stahl (ρ = ${g(STEEL)} g/cm³) hat die Masse ${g(mSteel)} g. Um wie viel Gramm leichter wäre ein Bauteil mit gleichem Volumen aus ${material.name} (ρ = ${g(material.rho)} g/cm³)?`,
        saving,
        "g",
        "erst V = m / ρ für Stahl, dann m = ρ · V für den neuen Werkstoff",
        `V = ${g(mSteel)} g : ${g(STEEL)} g/cm³ = ${V} cm³. Aus ${material.name}: m = ${g(material.rho)} g/cm³ · ${V} cm³ = ${g(mLight)} g. Ersparnis: ${g(mSteel)} g − ${g(mLight)} g = ${g(saving)} g.`,
      );
    }
  }
}
