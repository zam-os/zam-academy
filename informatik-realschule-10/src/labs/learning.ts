export interface Example {
  id: string;
  mass: number;
  color: number;
  label: 0 | 1;
}
export type Feature = "mass" | "color";
export type Tree =
  | {
      kind: "leaf";
      prediction: 0 | 1;
      samples: number;
      counts: [number, number];
    }
  | {
      kind: "split";
      feature: Feature;
      threshold: number;
      left: Tree;
      right: Tree;
      samples: number;
    };

// Invented objects and labels, deliberately including one noisy training example.
// No measurements, people, external data, real fruit classification or network calls.
export const TRAINING: Example[] = [
  { id: "t1", mass: 1, color: 1, label: 0 },
  { id: "t2", mass: 1, color: 2, label: 0 },
  { id: "t3", mass: 2, color: 1, label: 0 },
  { id: "t4", mass: 2, color: 2, label: 1 },
  { id: "t5", mass: 3, color: 2, label: 0 },
  { id: "t6", mass: 4, color: 3, label: 0 },
  { id: "t7", mass: 6, color: 1, label: 1 },
  { id: "t8", mass: 7, color: 2, label: 1 },
  { id: "t9", mass: 8, color: 2, label: 1 },
  { id: "t10", mass: 8, color: 4, label: 1 },
  { id: "t11", mass: 3, color: 8, label: 0 },
  { id: "t12", mass: 7, color: 8, label: 1 },
];
export const EVALUATION: Example[] = [
  { id: "v1", mass: 2, color: 3, label: 0 },
  { id: "v2", mass: 3, color: 1, label: 0 },
  { id: "v3", mass: 4, color: 2, label: 0 },
  { id: "v4", mass: 5.5, color: 4, label: 1 },
  { id: "v5", mass: 6, color: 4, label: 1 },
  { id: "v6", mass: 8, color: 3, label: 1 },
];

export function gini(examples: readonly Example[]): number {
  if (!examples.length) return 0;
  const fraction =
    examples.filter((example) => example.label === 1).length / examples.length;
  return 2 * fraction * (1 - fraction);
}

/** Greedy numeric classification tree: thresholds and labels come only from training data. */
export function trainTree(
  examples: Example[],
  features: Feature[],
  maxDepth: number,
  depth = 0,
): Tree {
  if (
    !examples.length ||
    examples.length > 100 ||
    !Number.isInteger(maxDepth) ||
    maxDepth < 1 ||
    maxDepth > 4 ||
    !features.length ||
    features.some((feature) => !["mass", "color"].includes(feature))
  )
    throw new Error(
      "Wähle Trainingsbeispiele, mindestens ein Merkmal und eine Baumtiefe von 1 bis 4.",
    );
  if (
    examples.some(
      (item) =>
        !Number.isFinite(item.mass) ||
        !Number.isFinite(item.color) ||
        (item.label !== 0 && item.label !== 1),
    )
  )
    throw new Error("Ungültiges Trainingsbeispiel.");
  const counts: [number, number] = [
    examples.filter((example) => example.label === 0).length,
    examples.filter((example) => example.label === 1).length,
  ];
  const leaf: Tree = {
    kind: "leaf",
    prediction: counts[1] > counts[0] ? 1 : 0,
    samples: examples.length,
    counts,
  };
  if (depth >= maxDepth || !counts[0] || !counts[1]) return leaf;
  let best:
    | {
        feature: Feature;
        threshold: number;
        score: number;
        left: Example[];
        right: Example[];
      }
    | undefined;
  for (const feature of [...new Set(features)]) {
    const values = [
      ...new Set(examples.map((example) => example[feature])),
    ].sort((a, b) => a - b);
    for (let index = 0; index < values.length - 1; index++) {
      const threshold = (values[index] + values[index + 1]) / 2;
      const left = examples.filter((example) => example[feature] <= threshold);
      const right = examples.filter((example) => example[feature] > threshold);
      const score =
        (left.length * gini(left) + right.length * gini(right)) /
        examples.length;
      if (!best || score < best.score - 1e-12)
        best = { feature, threshold, score, left, right };
    }
  }
  if (!best || best.score >= gini(examples) - 1e-12) return leaf;
  return {
    kind: "split",
    feature: best.feature,
    threshold: best.threshold,
    samples: examples.length,
    left: trainTree(best.left, features, maxDepth, depth + 1),
    right: trainTree(best.right, features, maxDepth, depth + 1),
  };
}

export function predict(tree: Tree, example: Pick<Example, Feature>): 0 | 1 {
  if (!Number.isFinite(example.mass) || !Number.isFinite(example.color))
    throw new Error("Beide Merkmale müssen Zahlen sein.");
  if (tree.kind === "leaf") return tree.prediction;
  return predict(
    example[tree.feature] <= tree.threshold ? tree.left : tree.right,
    example,
  );
}

export function scoreTree(tree: Tree, examples: Example[]) {
  const results = examples.map((example) => ({
    ...example,
    prediction: predict(tree, example),
  }));
  const correct = results.filter(
    (result) => result.prediction === result.label,
  ).length;
  return {
    correct,
    total: examples.length,
    accuracy: examples.length ? correct / examples.length : 0,
    results,
  };
}

export const FEATURE_LABEL: Record<Feature, string> = {
  mass: "Massewert",
  color: "Farbwert",
};

// The initial one-sided selection invites a useful correction, not a solved goal.
export const LEARNING_STARTER = {
  selected: TRAINING.filter((entry) => entry.mass < 5).map((entry) => entry.id),
  features: ["mass", "color"] as Feature[],
  depth: 1,
};
export function learningGoal(examples: Example[], tree: Tree): boolean {
  return (
    examples.length >= 6 &&
    new Set(examples.map((entry) => entry.label)).size === 2 &&
    scoreTree(tree, EVALUATION).correct >= 5
  );
}
