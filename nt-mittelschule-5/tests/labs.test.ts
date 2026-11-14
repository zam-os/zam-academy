import { describe, expect, it } from "vitest";
import { thermometerBau } from "../src/figures/scenes-lb2";
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

  it("assigns meteorological seasons across all 12 months and tilts the North Pole toward the Sun in June", () => {
    const northExpected: Record<number, string> = {
      12: "Winter",
      1: "Winter",
      2: "Winter",
      3: "Frühling",
      4: "Frühling",
      5: "Frühling",
      6: "Sommer",
      7: "Sommer",
      8: "Sommer",
      9: "Herbst",
      10: "Herbst",
      11: "Herbst",
    };
    const southExpected: Record<number, string> = {
      12: "Sommer",
      1: "Sommer",
      2: "Sommer",
      3: "Herbst",
      4: "Herbst",
      5: "Herbst",
      6: "Winter",
      7: "Winter",
      8: "Winter",
      9: "Frühling",
      10: "Frühling",
      11: "Frühling",
    };
    for (let month = 1; month <= 12; month++) {
      expect(renderLab("seasons", withPatch({ month, hemisphere: "Nord" }))).toContain(
        northExpected[month],
      );
      expect(renderLab("seasons", withPatch({ month, hemisphere: "Süd" }))).toContain(
        southExpected[month],
      );
    }

    const extractEarthTransform = (markup: string) => {
      const sunM = markup.match(/<circle class="sun" cx="([0-9.]+)" cy="([0-9.]+)"/);
      const gM = markup.match(/<g transform="translate\(([0-9.]+),([0-9.]+)\)">/);
      expect(sunM).toBeTruthy();
      expect(gM).toBeTruthy();
      return { sunX: Number(sunM![1]), earthX: Number(gM![1]) };
    };
    const june = extractEarthTransform(renderLab("seasons", withPatch({ month: 6 })));
    const dec = extractEarthTransform(renderLab("seasons", withPatch({ month: 12 })));
    // North Pole leans toward +x (top-right): June earth sits left of Sun, Dec earth right of Sun
    expect(june.earthX).toBeLessThan(june.sunX);
    expect(dec.earthX).toBeGreaterThan(dec.sunX);
  });

  it("keeps arm lever bones on the flexor side with geometrically matching angle and muscle widths", () => {
    const inspectArm = (armAngle: number) => {
      const svgMarkup = renderLab("armLever", withPatch({ armAngle }));
      const elbowLine = svgMarkup.match(
        /<line x1="168" y1="122" x2="([0-9.]+)" y2="([0-9.]+)"/,
      );
      const bicep = svgMarkup.match(
        /<ellipse cx="184" cy="74" rx="([0-9.]+)"/,
      );
      const tricep = svgMarkup.match(
        /<ellipse cx="152" cy="74" rx="([0-9.]+)"/,
      );
      expect(elbowLine).toBeTruthy();
      expect(bicep).toBeTruthy();
      expect(tricep).toBeTruthy();
      const handX = Number(elbowLine![1]);
      const handY = Number(elbowLine![2]);
      const vx = handX - 168;
      const vy = handY - 122;
      const deg = (Math.acos(-vy / Math.hypot(vx, vy)) * 180) / Math.PI;
      return {
        handX,
        deg,
        bicepRx: Number(bicep![1]),
        tricepRx: Number(tricep![1]),
      };
    };

    const flexed = inspectArm(45);
    const rightAngle = inspectArm(90);
    const extended = inspectArm(170);
    expect(flexed.deg).toBeCloseTo(45, 0);
    expect(rightAngle.deg).toBeCloseTo(90, 0);
    expect(extended.deg).toBeCloseTo(170, 0);
    expect(flexed.handX).toBeGreaterThan(168);
    expect(rightAngle.handX).toBeGreaterThan(168);
    expect(extended.handX).toBeGreaterThan(168);
    expect(flexed.bicepRx).toBeGreaterThan(extended.bicepRx);
    expect(extended.tricepRx).toBeGreaterThan(flexed.tricepRx);
  });

  it("draws the Celsius figure thermometer on a strictly linear 0–100 °C scale", () => {
    const fig = thermometerBau();
    const yOfLabel = (prefix: string) => {
      const m = fig.match(
        new RegExp(
          `<line x1="76" y1="([0-9.]+)"[^>]*/>\\s*<text[^>]*>${prefix}`,
        ),
      );
      expect(m).toBeTruthy();
      return Number(m![1]);
    };
    const y100 = yOfLabel("100 °C");
    const y20 = yOfLabel("20 °C");
    const y0 = yOfLabel("0 °C");
    expect((y0 - y20) / (y0 - y100)).toBeCloseTo(0.2, 2);
  });
});
