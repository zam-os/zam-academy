import type { Lesson, Stage } from "../model/types";

export type SectionId = "1.1" | "1.2" | "2.1" | "2.2" | "3" | "4" | "5";

const STAGE_BY_SECTION: Record<
  SectionId,
  { stageId: string; label: string }
> = {
  "1.1": {
    stageId: "stage-1-terme",
    label: "M7 LB 1.1: Aufstellen und Interpretieren von Termen",
  },
  "1.2": {
    stageId: "stage-1-terme",
    label: "M7 LB 1.2: Umformen von Termen",
  },
  "2.1": {
    stageId: "stage-2-symmetrie",
    label: "M7 LB 2.1: Achsen- und punktsymmetrische Figuren",
  },
  "2.2": {
    stageId: "stage-2-symmetrie",
    label: "M7 LB 2.2: Winkelbetrachtungen an Figuren",
  },
  "3": {
    stageId: "stage-3-gleichungen",
    label: "M7 LB 3: Lineare Gleichungen und Vertiefung der Prozentrechnung",
  },
  "4": {
    stageId: "stage-4-daten",
    label: "M7 LB 4: Kenngrößen von Daten",
  },
  "5": {
    stageId: "stage-5-kongruenz",
    label: "M7 LB 5: Kongruenz, besondere Dreiecke und Dreieckskonstruktionen",
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
