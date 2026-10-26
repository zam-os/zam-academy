import type { Stage } from "../model/types";
import { REAKTION_LESSONS_A } from "./stage-4a-grundlagen";
import { REAKTION_LESSONS_B } from "./stage-4b-energetik-umsatz";
import { REAKTION_LESSONS_C } from "./stage-4c-verbrennung";

export const STAGE_REAKTION: Stage = {
  id: "reaktion",
  stageNumber: 4,
  title: "Chemische Reaktion",
  subtitle: "Umgruppierung, Energie, Katalyse, Stoffumsatz und Verbrennung",
  icon: "🔥",
  accent: "#ea580c",
  badgeTitle: "Reaktionsprofi",
  lehrplanLabel: "C8 LB 4 (I)",
  lessons: [...REAKTION_LESSONS_A, ...REAKTION_LESSONS_B, ...REAKTION_LESSONS_C],
};
