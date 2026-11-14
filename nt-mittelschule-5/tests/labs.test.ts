import { describe, expect, it } from "vitest";
import {
  fmtDe,
  freshLab,
  labGoals,
  renderLab,
  type LabState,
} from "../src/labs";
import type { LabKind } from "../src/model/types";

const LAB_KINDS: readonly LabKind[] = [
  "seasons",
  "thermometer",
  "eyeLens",
  "torso",
  "armLever",
  "particles",
];

function withPatch(patch: Partial<LabState>): LabState {
  return { ...freshLab(), ...patch };
}

function assertCleanMarkup(html: string, kind: LabKind): void {
  expect(html).toContain(`data-lab="${kind}"`);
  expect(html).toContain("<svg");
  expect(html).toContain('role="img"');
  expect(html).not.toMatch(/\b(NaN|undefined|Infinity)\b/);
}

describe("nt-mittelschule-5 interactive labs", () => {
  it("formats German numbers with decimal comma and real minus sign", () => {
    expect(fmtDe(23.5, 1)).toBe("23,5");
    expect(fmtDe(-10, 0)).toBe("−10");
    expect(fmtDe(-3.4, 1)).toBe("−3,4");
    expect(fmtDe(-0, 0)).toBe("0");
  });

  it.each(LAB_KINDS)("starts with 0 of 3 goals met for %s", (kind) => {
    const goals = labGoals(kind, freshLab());
    expect(goals).toHaveLength(3);
    expect(goals.filter((g) => g.met)).toHaveLength(0);
  });

  it("proves every goal of all 6 labs reachable by an explicit witness", () => {
    const witnesses: Record<LabKind, LabState[]> = {
      seasons: [
        withPatch({ month: 6, hemisphere: "Nord" }),
        withPatch({ month: 12, hemisphere: "Nord" }),
        withPatch({ hemisphere: "Süd" }),
      ],
      thermometer: [
        withPatch({ temp: 85 }),
        withPatch({ temp: -5 }),
        withPatch({ thermoMode: "bimetall" }),
      ],
      eyeLens: [
        withPatch({ eyeType: "kurz", lensType: "zerstreuung" }),
        withPatch({ eyeType: "weitsichtig", lensType: "sammel" }),
        withPatch({ eyeType: "kurz", lensType: "ohne" }),
      ],
      torso: [
        withPatch({ seenAtmung: true, seenKreislauf: true }),
        withPatch({ seenVerdauung: true, seenNerven: true }),
        withPatch({ torsoCoop: true }),
      ],
      armLever: [
        withPatch({ armAngle: 50 }),
        withPatch({ armAngle: 160 }),
        withPatch({ showTendons: true }),
      ],
      particles: [
        withPatch({ particlePhase: "fest", particleMixture: "reinstoff" }),
        withPatch({ particlePhase: "gas" }),
        withPatch({ particleMixture: "gemisch" }),
      ],
    };

    for (const kind of LAB_KINDS) {
      witnesses[kind].forEach((state, idx) => {
        const goals = labGoals(kind, state);
        expect(goals[idx].met).toBe(true);
        assertCleanMarkup(renderLab(kind, state), kind);
      });
    }
  });

  it("produces finite SVG across sampled slider and mode grids", () => {
    for (let month = 1; month <= 12; month++) {
      for (const hemisphere of ["Nord", "Süd"] as const) {
        assertCleanMarkup(
          renderLab("seasons", withPatch({ month, hemisphere })),
          "seasons",
        );
      }
    }

    for (let temp = -10; temp <= 100; temp += 5) {
      for (const thermoMode of ["fluessigkeit", "bimetall"] as const) {
        assertCleanMarkup(
          renderLab("thermometer", withPatch({ temp, thermoMode })),
          "thermometer",
        );
      }
    }

    for (const eyeType of ["normal", "kurz", "weitsichtig"] as const) {
      for (const lensType of ["ohne", "zerstreuung", "sammel"] as const) {
        assertCleanMarkup(
          renderLab("eyeLens", withPatch({ eyeType, lensType })),
          "eyeLens",
        );
      }
    }

    for (const activeOrgan of [
      "none",
      "atmung",
      "kreislauf",
      "verdauung",
      "nerven",
    ] as const) {
      for (const torsoCoop of [false, true]) {
        assertCleanMarkup(
          renderLab("torso", withPatch({ activeOrgan, torsoCoop })),
          "torso",
        );
      }
    }

    for (let armAngle = 40; armAngle <= 170; armAngle += 10) {
      for (const showTendons of [false, true]) {
        assertCleanMarkup(
          renderLab("armLever", withPatch({ armAngle, showTendons })),
          "armLever",
        );
      }
    }

    for (const particlePhase of ["fest", "fluessig", "gas"] as const) {
      for (const particleMixture of ["reinstoff", "gemisch"] as const) {
        assertCleanMarkup(
          renderLab("particles", withPatch({ particlePhase, particleMixture })),
          "particles",
        );
      }
    }
  });
});
