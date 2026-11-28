import type { Lesson, Stage } from "../model/types";

export type SectionId = "1" | "2" | "3" | "4" | "5" | "6" | "7";

const STAGE_BY_SECTION: Record<
  SectionId,
  { stageId: string; label: string }
> = {
  "1": {
    stageId: "stage-1-funktionen",
    label: "M8 LB 1: Funktion und Term",
  },
  "2": {
    stageId: "stage-2-linear",
    label: "M8 LB 2: Lineare Funktionen",
  },
  "3": {
    stageId: "stage-3-gebrochen",
    label: "M8 LB 3: Elementare gebrochen-rationale Funktionen",
  },
  "4": {
    stageId: "stage-4-bruchterme",
    label: "M8 LB 4: Bruchterme und Bruchgleichungen",
  },
  "5": {
    stageId: "stage-5-laplace",
    label: "M8 LB 5: Laplace-Experimente",
  },
  "6": {
    stageId: "stage-6-lgs",
    label: "M8 LB 6: Lineare Gleichungssysteme",
  },
  "7": {
    stageId: "stage-7-kreis-zylinder",
    label: "M8 LB 7: Kreis und Zylinder",
  },
};

export type LessonDraft = Omit<
  Lesson,
  "stageId" | "stepNumber" | "lehrplan" | "requiredCorrect"
> & {
  section: SectionId;
};

export function makeLessons(drafts: LessonDraft[]): Lesson[] {
  return drafts.map((draft, index) => {
    const { section, ...rest } = draft;
    const meta = STAGE_BY_SECTION[section];
    return {
      ...rest,
      stageId: meta.stageId,
      stepNumber: index + 1,
      lehrplan: meta.label,
      requiredCorrect: 3,
    };
  });
}

export function makeStage(
  stageNumber: number,
  meta: {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    iconSvg?: string;
    accent: string;
    badgeTitle: string;
    lehrplanLabel: string;
  },
  lessons: Lesson[],
): Stage {
  return {
    ...meta,
    stageNumber,
    lessons,
  };
}
