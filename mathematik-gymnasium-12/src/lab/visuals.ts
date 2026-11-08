import type { LabValues, ReadoutValues } from "../model/types";
import type { LabView } from "./svg";
import {
  polynomialFamilyView,
  antiderivativeGraphView,
  expDerivativesView,
  expLimitsView,
  expCurveView,
  expGrowthView,
  trigTangentView,
  trigCompositionView,
  quotientRuleView,
  rationalCurveView,
  quotientCompositionsView,
  inverseFunctionView,
  rationalPowersView,
  rootCurveView,
  lnDerivativeView,
  lnLimitsView,
} from "./views-analysis";
import {
  kolmogorovAxiomsView,
  randomVariableView,
  urnModelsView,
  bernoulliChainView,
  binomialParamsView,
  hypothesisSetupView,
  errorVisualizerView,
  rejectionRegionView,
  testInterpretationView,
} from "./views-stochastik";
import {
  coordinates3dView,
  vectorAlgebraView,
  dotProductView,
  crossProductView,
  solids3dView,
} from "./views-geometrie";

export type ViewFn = (values: LabValues, readouts: ReadoutValues) => string;

const VIEWS: Record<string, LabView> = {
  // Stufe 1: Analysis I
  "polynomial-family": { render: polynomialFamilyView },
  "antiderivative-graph": { render: antiderivativeGraphView },
  "exp-derivatives": { render: expDerivativesView },
  "exp-limits": { render: expLimitsView },
  "exp-curve": { render: expCurveView },
  "exp-growth": { render: expGrowthView },
  "trig-tangent": { render: trigTangentView },
  "trig-composition": { render: trigCompositionView },

  // Stufe 2: Stochastik I
  "kolmogorov-axioms": { render: kolmogorovAxiomsView },
  "random-variable": { render: randomVariableView },
  "urn-models": { render: urnModelsView },
  "bernoulli-chain": { render: bernoulliChainView },
  "binomial-params": { render: binomialParamsView },

  // Stufe 3: Signifikanztest
  "hypothesis-setup": { render: hypothesisSetupView },
  "error-visualizer": { render: errorVisualizerView },
  "rejection-region": { render: rejectionRegionView },
  "test-interpretation": { render: testInterpretationView },

  // Stufe 4: Analysis II
  "quotient-rule": { render: quotientRuleView },
  "rational-curve": { render: rationalCurveView },
  "quotient-compositions": { render: quotientCompositionsView },
  "inverse-function": { render: inverseFunctionView },
  "rational-powers": { render: rationalPowersView },
  "root-curve": { render: rootCurveView },
  "ln-derivative": { render: lnDerivativeView },
  "ln-limits": { render: lnLimitsView },

  // Stufe 5: Geometrie im Raum
  "3d-coordinates": { render: coordinates3dView },
  "vector-algebra": { render: vectorAlgebraView },
  "dot-product": { render: dotProductView },
  "cross-product": { render: crossProductView },
  "3d-solids": { render: solids3dView },
};

export const LAB_KINDS = new Set(Object.keys(VIEWS));

export function labView(kind: string): LabView {
  return VIEWS[kind];
}
