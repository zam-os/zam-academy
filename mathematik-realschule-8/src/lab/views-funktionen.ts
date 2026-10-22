import type { LabView } from "./svg";

// Placeholder drawings until the stage's labs are written.
const placeholder: LabView = { render: () => '<svg viewBox="0 0 520 340" xmlns="http://www.w3.org/2000/svg"></svg>' };

export const FUNKTIONEN_VIEWS: Record<"relation-check" | "representations" | "zeros-domain" | "origin-line" | "perpendicular" | "line-mx-t" | "line-from-points" | "parallel-family" | "linear-model" | "determinant-area", LabView> = {
  "relation-check": placeholder,
  "representations": placeholder,
  "zeros-domain": placeholder,
  "origin-line": placeholder,
  "perpendicular": placeholder,
  "line-mx-t": placeholder,
  "line-from-points": placeholder,
  "parallel-family": placeholder,
  "linear-model": placeholder,
  "determinant-area": placeholder,
};
