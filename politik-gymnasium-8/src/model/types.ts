export type Level = 1 | 2;

/** Every interactive model in src/labs; a lesson names at most one. */
export type LabKind =
  | "jugendWerteBarometer"
  | "identitaetWaage"
  | "sozialisationsNetz"
  | "konfliktEskalation"
  | "popularitaetSpektrum"
  | "influencerStrategie"
  | "politikKreislauf"
  | "kompromissRat"
  | "kooperationsEbenen"
  | "grenzKonfliktLoesung"
  | "heimatKompass"
  | "regionZukunft"
  | "medienVergleich"
  | "umfrageAuswerter"
  | "soziogrammLabor"
  | "fuehrungsStile"
  | "gesundheitsDreieck"
  | "pausenbrotTeller";

export interface Source {
  id: string;
  label: string;
  url: string;
}

export interface Check {
  question: string;
  answer: string;
  wrong: [string, string];
  explanation: string;
}

/** A deliberately authored task; reconstructed material is never called an original. */
export interface Workshop {
  kind: "timeline" | "classify";
  title: string;
  instruction: string;
  material?: string;
  materialLabel?: string;
  dataTable?: {
    title: string;
    unit: string;
    rows: Array<{ label: string; value: number }>;
    note: string;
  };
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

export interface CriteriaCatalog {
  title: string;
  steps: string[];
}

export interface SourceExcerpt {
  label: string;
  quote: string;
  attribution: string;
}

export interface Lesson {
  /** Public contract once published: every card links to this anchor. */
  id: string;
  /** The stage (1–9) of the learning path; 1–5 are mandatory LB 1–5, 6–9 are Profilbereich 6.1–6.5. */
  lb: number;
  title: string;
  /** Lehrplan label, e.g. "LB 1 · Die Jugendphase" or "Profil 6.1 · Heimat(en)". */
  period: string;
  intro: string;
  paragraphs: string[];
  /** Optional attributed source or legal excerpt. */
  sourceExcerpt?: SourceExcerpt;
  takeaway: string;
  sourceIds: string[];
  quiz: Check;
  workshop: Workshop;
  tasks: Record<Level, WrittenTask>;
  /** Ids of the drawings and interactive explorer diagrams in src/figures. */
  figures: string[];
  /** Optional interactive SVG model embedded in the lesson. */
  lab?: LabKind;
  /** Optional vorgegebener knapper Kriterienkatalog for media/source/group analysis. */
  kriterien?: CriteriaCatalog;
  /** Grundlegende Begriffe highlighted in the lesson and reference view. */
  grundwissen?: string[];
  /** Earlier knowledge revisited inside the lesson. */
  review?: string;
}

export interface Stage {
  lb: number;
  /** Lernbereich code, e.g. "LB 1" or "Profil 6.1". */
  code: string;
  hours: string;
  title: string;
  shortTitle: string;
  icon: string;
  profil?: boolean;
}
