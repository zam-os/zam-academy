// A lab may combine a text explanation with a figure and a screen-reader friendly table.
export type ModelState = readonly number[];
export interface Model {
  title: string;
  instruction: string;
  controls: readonly { label: string; options: readonly string[] }[];
  start: ModelState;
  goals: readonly { id: string; label: string; reached: (state: ModelState) => boolean }[];
  read: (state: ModelState) => Readout;
}
export type CellKind = "tier" | "blatt" | "zwiebel";
export type Diagram =
  | { kind: "cell"; cell: CellKind; highlight: string }
  | {
      kind: "microscope";
      sample: "none" | "zwiebel" | "tier";
      objective: number;
      centered: boolean;
    }
  | { kind: "karyogram" }
  | { kind: "dna"; template: string; complement: string | null }
  | { kind: "flow"; label: string; steps: readonly string[]; active: number };
export interface Chart {
  xLabel: string;
  yLabel: string;
  ticks: readonly string[];
  values: readonly number[];
  max: number;
}
export interface Readout {
  summary: string;
  chart?: Chart;
  diagram?: Diagram;
  table?: {
    caption: string;
    columns: readonly string[];
    rows: ReadonlyArray<readonly (string | number)[]>;
  };
}
export const fmt = (value: number): string =>
  new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value).replace("-", "−");
