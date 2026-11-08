import { KIND_FAMILY, type LabKind } from "../curriculum/labs";
import type { LabView } from "./svg";
import { viewFor } from "./views";

const VIEWS: Record<LabKind, LabView> = Object.fromEntries(
  (Object.keys(KIND_FAMILY) as LabKind[]).map((kind) => [kind, viewFor(KIND_FAMILY[kind], kind)]),
) as Record<LabKind, LabView>;

export const labView = (kind: string): LabView => VIEWS[kind as LabKind];
export const LAB_KINDS: string[] = Object.keys(VIEWS);
