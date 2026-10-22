import type { LabView } from "./svg";

// Placeholder drawings until the stage's labs are written.
const placeholder: LabView = { render: () => '<svg viewBox="0 0 520 340" xmlns="http://www.w3.org/2000/svg"></svg>' };

export const RAUMGEOMETRIE_VIEWS: Record<"solid-symmetry" | "axial-section" | "space-coordinates" | "solid-coordinates" | "oblique-drawing" | "true-size", LabView> = {
  "solid-symmetry": placeholder,
  "axial-section": placeholder,
  "space-coordinates": placeholder,
  "solid-coordinates": placeholder,
  "oblique-drawing": placeholder,
  "true-size": placeholder,
};
