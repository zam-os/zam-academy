export type Level = 1 | 2;

export interface Source {
  id: string;
  label: string;
  url: string;
}

export interface Check {
  question: string;
  answer: string;
  wrong: [string, string];
  /** Shown when the learner picks the wrong option with the same index. */
  whyWrong: [string, string];
  explanation: string;
}

/** A deliberately authored task; reconstructed material is never called an original. */
export interface Workshop {
  kind: "timeline" | "classify";
  title: string;
  instruction: string;
  material?: string;
  materialLabel?: string;
  sourceExcerpt?: {
    title: string;
    author: string;
    date: string;
    audience: string;
    text: string;
    sourceId: string;
    context: string;
  };
  dataTable?: {
    title: string;
    unit: string;
    /** Header of the label column and of the value column. */
    columns: [string, string];
    /** Upper end of the bar scale, in the unit of the values. */
    max: number;
    suffix: string;
    rows: Array<{ label: string; value: number }>;
    sourceId: string;
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

export interface Lesson {
  /** Public contract once published: every card links to this anchor. */
  id: string;
  lb: number;
  title: string;
  period: string;
  intro: string;
  paragraphs: string[];
  takeaway: string;
  sourceIds: string[];
  quiz: Check;
  workshop: Workshop;
  tasks: Record<Level, WrittenTask>;
  optional?: boolean;
  language?: "en";
}

export interface Stage {
  lb: number;
  title: string;
  shortTitle: string;
  icon: string;
  /** Accent hue of the stage; light and dark tones derive from it in styles.css. */
  hue: number;
  hours?: number;
  optional?: boolean;
}

/** One of the plan's Grundlegende Daten und Begriffe, explained where it is taught. */
export interface Term {
  lb: number;
  term: string;
  explanation: string;
  lessonId: string;
}
