import type { LabView } from "./svg";

// Placeholder drawings until the stage's labs are written.
const placeholder: LabView = { render: () => '<svg viewBox="0 0 520 340" xmlns="http://www.w3.org/2000/svg"></svg>' };

export const BRUCHTERME_VIEWS: Record<"fraction-term" | "domain" | "proportion-equation", LabView> = {
  "fraction-term": placeholder,
  "domain": placeholder,
  "proportion-equation": placeholder,
};
