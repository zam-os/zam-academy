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
  /**
   * A short original text in a translation written for this app. The link
   * leads to the original wording, so learners can check what was translated.
   */
  sourceExcerpt?: {
    title: string;
    author: string;
    date: string;
    audience: string;
    text: string;
    sourceId: string;
    context: string;
  };
  categories: string[];
  entries: Array<{ text: string; target: number; feedback: string }>;
  conclusion: string;
}

/**
 * A drawn model of the lesson's key structure. "pyramid" lists ranks from
 * the top down (narrow to wide), "layers" a cross-section from the top down
 * (all equally wide), "steps" a sequence (that starts again when it
 * repeats), "compare" two columns of matching rows.
 */
export type Diagram =
  | {
      kind: "pyramid" | "layers";
      title: string;
      layers: Array<{ label: string; note: string }>;
      caption: string;
    }
  | {
      kind: "steps";
      title: string;
      steps: Array<{ label: string; note: string }>;
      repeats: boolean;
      caption: string;
    }
  | {
      kind: "compare";
      title: string;
      columns: [string, string];
      rows: Array<{ aspect: string; values: [string, string] }>;
      caption: string;
    };

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
  /**
   * The years the lesson is about, for the time strip. Negative numbers are
   * years v. Chr. (−450 is 450 v. Chr.); there is no year 0. A start
   * before 500 n. Chr. is drawn as "Antike" left of the scale, a span past
   * 1800 as "bis heute" right of the scale.
   */
  span: [number, number];
  intro: string;
  paragraphs: string[];
  takeaway: string;
  sourceIds: string[];
  quiz: Check;
  diagram?: Diagram;
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
  /** For dates: the year placed on the reference time line (negative = v. Chr.). */
  year?: number;
}
