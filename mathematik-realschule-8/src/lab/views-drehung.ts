import type { LabView } from "./svg";

// Placeholder drawings until the stage's labs are written.
const placeholder: LabView = { render: () => '<svg viewBox="0 0 520 340" xmlns="http://www.w3.org/2000/svg"></svg>' };

export const DREHUNG_VIEWS: Record<"rotation" | "point-symmetry" | "vector-rotation", LabView> = {
  "rotation": placeholder,
  "point-symmetry": placeholder,
  "vector-rotation": placeholder,
};
