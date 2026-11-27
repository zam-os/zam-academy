export type Track = "II" | "IIIa";
export type Level = 1 | 2;
export type PracticeKind =
  | "budget"
  | "receipt"
  | "percentBasic"
  | "percentChange"
  | "locationScore"
  | "inventar"
  | "balanceEq"
  | "bilanzShift"
  | "tAccount"
  | "bestandsBooking"
  | "fixBooking"
  | "vatCalc"
  | "vatBooking"
  | "periodSuccess"
  | "offerCalc"
  | "materialBuy"
  | "productSell"
  | "invoiceComplete"
  | "ledgerPost"
  | "guvClose"
  | "ekClose"
  | "sbkClose"
  | "bilanzCompare"
  | "invDiff";

export type LabKind =
  | "budget"
  | "chart"
  | "location"
  | "balance"
  | "bilanzChange"
  | "vat"
  | "offerCompare"
  | "closingFlow";

export interface Check {
  question: string;
  answer: string;
  wrong: [string, string];
  explanation: string;
}

export interface Workshop {
  kind: "timeline" | "classify";
  title: string;
  instruction: string;
  categories: string[];
  entries: Array<{ text: string; target: number; feedback: string }>;
  conclusion: string;
}

export interface WrittenTask {
  prompt: string;
  hints: [string, string];
  model: string;
  criteria: [string, string, string];
}

export interface Lesson {
  id: string;
  lb: number;
  tracks: Track[];
  lehrplan: string;
  title: string;
  intro: string;
  paragraphs: string[];
  takeaway: string;
  sourceIds: string[];
  quiz: Check;
  workshop: Workshop;
  tasks: Record<Level, WrittenTask>;
  optional?: boolean;
  practice?: PracticeKind;
  lab?: LabKind;
}

export interface Entry {
  side: "debit" | "credit";
  account: string;
  amount: number;
}

export interface NumericField {
  label: string;
  answer: number;
  unit: string;
}

export interface InvoiceRow {
  pos: number;
  description: string;
  qty: number;
  unit: string;
  unitPrice: number;
  /** Index into `Exercise.fields` when this line's net total must be completed by the learner. */
  fieldIndex?: number;
  /** Pre-filled net total when the row is already completed on the template. */
  total?: number;
}

export interface InvoiceSummaryRow {
  label: string;
  fieldIndex?: number;
  amount?: number;
  strong?: boolean;
}

export interface InvoiceTemplate {
  seller: string;
  sellerAddress: string;
  buyer: string;
  buyerAddress: string;
  invoiceNo: string;
  date: string;
  deliveryDate: string;
  paymentTerms: string;
  rows: InvoiceRow[];
  summary: InvoiceSummaryRow[];
}

export interface Exercise {
  prompt: string;
  hint: string;
  fields: NumericField[];
  booking: Entry[];
  solution: string;
  invoice?: InvoiceTemplate;
}

export interface LearnerEntry {
  side: string;
  account: string;
  amount: string;
}
