import type { LabView } from "./svg";

// Placeholder drawings until the stage's labs are written.
const placeholder: LabView = { render: () => '<svg viewBox="0 0 520 340" xmlns="http://www.w3.org/2000/svg"></svg>' };

export const DATEN_ZUFALL_VIEWS: Record<"outcome-event" | "tree-diagram" | "two-way-table" | "frequency-simulation", LabView> = {
  "outcome-event": placeholder,
  "tree-diagram": placeholder,
  "two-way-table": placeholder,
  "frequency-simulation": placeholder,
};
