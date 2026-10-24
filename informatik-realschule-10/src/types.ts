export type ModuleId = "netze" | "objekte" | "logik" | "robotik" | "ki";
export type Level = 1 | 2;
export interface Module {
  id: ModuleId;
  code: string;
  title: string;
  description: string;
  icon: string;
}
export interface Source {
  id: string;
  label: string;
  url: string;
}
export interface Task {
  prompt: string;
  hints: [string, string];
  model: string;
  criteria: [string, string, string];
}
export interface Lesson {
  id: string;
  module: ModuleId;
  title: string;
  intro: string;
  paragraphs: string[];
  takeaway: string;
  sourceIds: string[];
  prerequisites: string[];
  quiz: {
    question: string;
    answer: string;
    wrong: [string, string];
    explanation: string;
  };
  tasks: Record<Level, Task>;
  lab?: string;
}

export interface Workshop {
  title: string;
  instruction: string;
  categories: string[];
  entries: { text: string; target: number; feedback: string }[];
}
