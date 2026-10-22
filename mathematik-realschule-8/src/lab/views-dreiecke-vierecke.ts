import type { LabView } from "./svg";

// Placeholder drawings until the stage's labs are written.
const placeholder: LabView = { render: () => '<svg viewBox="0 0 520 340" xmlns="http://www.w3.org/2000/svg"></svg>' };

export const DREIECKE_VIERECKE_VIEWS: Record<"triangle-existence" | "triangle-construction" | "congruence" | "quadrilateral-family" | "quadrilateral-construction" | "quadrilateral-problems", LabView> = {
  "triangle-existence": placeholder,
  "triangle-construction": placeholder,
  "congruence": placeholder,
  "quadrilateral-family": placeholder,
  "quadrilateral-construction": placeholder,
  "quadrilateral-problems": placeholder,
};
