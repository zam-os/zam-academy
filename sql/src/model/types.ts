import type { Rng } from "../exercises/rng";

/** The app speaks German and English; the ZAM cell is German (like UML). */
export type AppLocale = "de" | "en";

/** The same text in both languages. */
export type Localized<T = string> = Record<AppLocale, T>;

/** Level 1 names tables and columns and shows the syntax; Level 2 is a transfer task in words. */
export type DifficultyLevel = 1 | 2;

/**
 * Where LehrplanPLUS Informationstechnologie (Realschule Bayern) places a
 * lesson: module 2.3.1 "Datenbanksysteme I" (compulsory in Wahlpflicht-
 * fächergruppen I and II), module 2.3.2 "Datenbanksysteme II" (elective),
 * or an extra that developers need beyond the curriculum.
 */
export type CurriculumModule = "2.3.1" | "2.3.2" | "extra";

/** What the learner wants to cover: 2.3.1 only, 2.3.1 + 2.3.2, or everything. */
export type ModuleFilter = "2.3.1" | "2.3.2" | "alle";

export const MODULE_RANK: Record<CurriculumModule, number> = {
  "2.3.1": 1,
  "2.3.2": 2,
  extra: 3,
};

export const FILTER_RANK: Record<ModuleFilter, number> = {
  "2.3.1": 1,
  "2.3.2": 2,
  alle: 3,
};

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/** One line of the SQL cheat sheet. */
export interface SyntaxEntry {
  /** What it does, e.g. "Zeilen filtern". */
  name: string;
  /** The statement shape, plain text with placeholders in angle brackets. */
  sql: string;
  /** A short note, e.g. "Text in einfachen Hochkommas". */
  note: string;
}

/** Everything a lesson says, in one language. */
export interface LessonText {
  title: string;
  subtitle: string;
  whyItMatters: string;
  /** Plain HTML (<p>, <ul>, <pre class="sql">, <code>), never Markdown. */
  explanationHtml: string;
  syntax: SyntaxEntry[];
  quiz: QuizQuestion;
  lab: {
    title: string;
    intro: string;
    /** Goal id → what the learner should make happen. */
    goals: Record<string, string>;
  };
  celebrationMessage: string;
}

// ─── Labs ───────────────────────────────────────────────────────────────────

/** Names of the sample tables (German keys; `ident()` gives the locale's name). */
export type TableKey =
  | "kunden"
  | "produkte"
  | "bestellungen"
  | "positionen"
  | "bestellungen_flach"
  | "adressen_roh";

export type SqlCell = number | string | Uint8Array | null;

export interface ResultSet {
  columns: string[];
  values: SqlCell[][];
}

export type SqlOutcome =
  | { ok: true; results: ResultSet[]; changes: number; statements: number }
  | { ok: false; error: string };

/** What a lab goal of a SQL sandbox sees: the live database and the last run. */
export interface SqlLabContext {
  locale: AppLocale;
  /** Runs read-only SQL against the sandbox's current state. */
  query: (sql: string) => SqlOutcome;
  /** The learner's last execution, or null before the first. */
  last: { sql: string; outcome: SqlOutcome } | null;
}

export interface SqlLabGoal {
  id: string;
  check: (ctx: SqlLabContext) => boolean;
}

export interface SqlLabDefinition {
  kind: "sql";
  /** Tables the sandbox database holds. */
  tables: TableKey[];
  /** What the editor shows at first, a template with {tokens}. */
  starterSql: string;
  goals: SqlLabGoal[];
}

export type Cardinality = "1:1" | "1:n" | "n:m";

export interface ErPair {
  id: string;
  /** Entity names, template tokens allowed. */
  left: Localized;
  right: Localized;
  /** The relationship verb, e.g. "gibt auf" / "places". */
  verb: Localized;
  /** The scenario sentence the learner reads. */
  scenario: Localized;
  answer: Cardinality;
  explanation: Localized;
}

export interface ErLabContext {
  choices: Record<string, Cardinality | undefined>;
}

export interface ErLabGoal {
  id: string;
  check: (ctx: ErLabContext) => boolean;
}

/** The learner reads scenarios and sets each relationship's cardinality. */
export interface ErLabDefinition {
  kind: "er";
  pairs: ErPair[];
  goals: ErLabGoal[];
}

export type LabDefinition = SqlLabDefinition | ErLabDefinition;

// ─── Exercises ─────────────────────────────────────────────────────────────

interface TaskBase {
  /** The task as HTML, already in the learner's language. */
  prompt: string;
  /** Shown in Level 1 only: the statement shape to use. */
  hint?: string;
  /** The worked solution as HTML. */
  solutionHtml: string;
  /** Values the generator drew, so tests can check the scenario. */
  meta?: Record<string, string | number>;
}

/** The learner writes a SELECT; its result set must equal the reference's. */
export interface QueryTask extends TaskBase {
  kind: "query";
  referenceSql: string;
  /** Row order matters (the task asks for a sorting). */
  ordered: boolean;
}

/** The learner changes the database; the named tables must end up like the reference's. */
export interface MutationTask extends TaskBase {
  kind: "mutation";
  referenceSql: string;
  /** Tables whose contents are compared afterwards. */
  verifyTables: string[];
  /** Tables whose schema (column names, affinities, primary key) is compared. */
  verifySchemaOf?: string[];
}

/** The learner picks one option. */
export interface ChoiceTask extends TaskBase {
  kind: "choice";
  options: string[];
  correctIndex: number;
}

export type ExerciseTask = QueryTask | MutationTask | ChoiceTask;

export interface ExerciseGenerator {
  id: string;
  make: (rng: Rng, level: DifficultyLevel, locale: AppLocale) => ExerciseTask;
}

export interface Lesson {
  /** Public contract: ZAM cards cite it as #lesson=<id>. */
  id: string;
  stageId: string;
  stepNumber: number;
  module: CurriculumModule;
  text: Localized<LessonText>;
  /** Tables the exercise database holds. */
  tables: TableKey[];
  lab: LabDefinition;
  exercises: ExerciseGenerator[];
  /** Correct exercises per level that complete the lesson. */
  requiredCorrect: number;
}

export interface StageText {
  title: string;
  subtitle: string;
  badgeTitle: string;
  /** Where the curriculum places the stage, e.g. "IT 2.3.1 Datenbanksysteme I". */
  moduleLabel: string;
}

export interface Stage {
  id: string;
  stageNumber: number;
  icon: string;
  accent: string;
  text: Localized<StageText>;
  lessons: Lesson[];
}

export const MODULE_LABELS: Localized<Record<CurriculumModule, string>> = {
  de: {
    "2.3.1": "IT 2.3.1 Pflicht (Zweig I, II)",
    "2.3.2": "IT 2.3.2 Wahlmodul",
    extra: "Zusatz für Entwickler",
  },
  en: {
    "2.3.1": "IT 2.3.1 compulsory (tracks I, II)",
    "2.3.2": "IT 2.3.2 elective",
    extra: "Extra for developers",
  },
};

export const FILTER_LABELS: Localized<Record<ModuleFilter, string>> = {
  de: {
    "2.3.1": "Pflichtmodul 2.3.1 Datenbanksysteme I",
    "2.3.2": "mit Wahlmodul 2.3.2 Datenbanksysteme II",
    alle: "alles, auch der Zusatz für Entwickler",
  },
  en: {
    "2.3.1": "compulsory module 2.3.1 Database systems I",
    "2.3.2": "plus elective 2.3.2 Database systems II",
    alle: "everything, including the developer extras",
  },
};
