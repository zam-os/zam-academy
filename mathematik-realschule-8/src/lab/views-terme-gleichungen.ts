import type { LabView } from "./svg";

// Placeholder drawings until the stage's labs are written.
const placeholder: LabView = { render: () => '<svg viewBox="0 0 520 340" xmlns="http://www.w3.org/2000/svg"></svg>' };

export const TERME_GLEICHUNGEN_VIEWS: Record<"like-terms" | "expand-products" | "binomial-squares" | "factorise" | "completing-square" | "extremum-problem" | "linear-equation" | "word-problem" | "inequality", LabView> = {
  "like-terms": placeholder,
  "expand-products": placeholder,
  "binomial-squares": placeholder,
  "factorise": placeholder,
  "completing-square": placeholder,
  "extremum-problem": placeholder,
  "linear-equation": placeholder,
  "word-problem": placeholder,
  "inequality": placeholder,
};
