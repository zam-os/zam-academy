import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import {
  applyControl,
  fmtDe,
  fmtYear,
  type LabValue,
  yearSpanNoZero,
} from "../src/labs/core";
import { freshLab, LABS, trackedGoals } from "../src/labs/index";
import {
  EXPANSION_STAGES,
  isInRomanExpansionStage,
} from "../src/labs/rom-mittelalter-familie";
import type { LabKind } from "../src/model/types";

const KINDS = Object.keys(LABS) as LabKind[];

const WITNESSES: Record<LabKind, Array<Array<[string, LabValue]>>> = {
  timelineExplorer: [
    [
      ["scale", "urzeit"],
      ["scale", "geschichte"],
    ],
    [["to", "karl"]],
    [
      ["scale", "urzeit"],
      ["from", "jungsteinzeit"],
    ],
  ],
  excavationStratigraphy: [
    [["depth", 5]],
    [
      ["soil", "moor"],
      ["depth", 4],
    ],
    [
      ["depth", 2],
      ["recorded", true],
    ],
  ],
  nileCycle: [
    [["flood", 10]],
    [["flood", 20]],
    [
      ["flood", 16],
      ["canals", true],
      ["season", "peret"],
    ],
  ],
  pyramidCutaway: [
    [["type", "djoser"]],
    [["focus", "entlastung"]],
    [["kriterien", true]],
  ],
  colonizationMap: [
    [
      ["region", "westen"],
      ["region", "schwarzmeer"],
      ["region", "afrika"],
    ],
    [["cause", "handel"]],
    [["compareToday", true]],
  ],
  persianWars: [
    [["phase", "salamis"]],
    [["trireme", true]],
    [["phase", "plataiai"]],
  ],
  athensDemocracy: [
    [["organ", "strategen"]],
    [["group", "ausgeschlossen"]],
    [["diaeten", true]],
  ],
  alexanderCampaign: [
    [["step", 3]],
    [["step", 5]],
    [
      ["step", 6],
      ["showLimits", true],
    ],
  ],
  powerComparison: [
    [
      ["ruler", "hatschepsut"],
      ["ruler", "themistokles"],
      ["ruler", "alexander"],
    ],
    [
      ["ruler", "themistokles"],
      ["focus", "kontrolle"],
    ],
    [["focus", "grenzen"]],
  ],
  romanRepublic: [
    [
      ["organ", "tribun"],
      ["mode", "veto"],
    ],
    [["organ", "senat"]],
    [
      ["organ", "diktator"],
      ["mode", "notstand"],
    ],
  ],
  romanExpansionMap: [
    [["stage", 3]],
    [["stage", 5]],
    [
      ["stage", 2],
      ["kriterien", true],
    ],
  ],
  romanBavariaLimes: [
    [
      ["site", "augsburg"],
      ["site", "weissenburg"],
      ["site", "regensburg"],
    ],
    [
      ["view", "querschnitt"],
      ["wallType", "palisade"],
    ],
    [
      ["site", "regensburg"],
      ["view", "karte"],
    ],
  ],
  mediterraneanTransformation: [
    [
      ["phase", "teilung"],
      ["phase", "wanderung"],
      ["phase", "islam"],
      ["phase", "dreiteilung"],
    ],
    [["phase", "dreiteilung"]],
    [["compareMigration", true]],
  ],
  imperialContinuity: [
    [["category", "residenz"]],
    [["category", "schrift"]],
    [
      ["category", "religion"],
      ["category", "residenz"],
      ["category", "schrift"],
      ["category", "legitimation"],
    ],
  ],
  familyLongitudinal: [
    [["dim", "rollen"]],
    [
      ["dim", "struktur"],
      ["dim", "rollen"],
      ["dim", "kinder"],
    ],
    [["showSociety", true]],
  ],
};

function controlValues(
  control: ReturnType<(typeof LABS)[LabKind]["controls"]>[number],
): LabValue[] {
  if (control.type === "toggle") return [false, true];
  if (control.type === "choice" || control.type === "actions")
    return control.options.map((option) => option.value);
  const values: number[] = [];
  for (
    let value = control.min;
    value <= control.max + 1e-9;
    value += control.step
  ) {
    values.push(Number(value.toFixed(6)));
  }
  return values;
}

describe("Geschichte 6 interactive historical labs and maps", () => {
  it("formats German decimals, years, and year spans without year zero", () => {
    expect(fmtDe(-12.5, 1)).toBe("−12,5");
    expect(fmtDe(-0, 1)).toBe("0,0");
    expect(fmtYear(-10000)).toBe("10 000 v. Chr.");
    expect(fmtYear(-753)).toBe("753 v. Chr.");
    expect(fmtYear(800)).toBe("800 n. Chr.");
    expect(yearSpanNoZero(-753, 800)).toBe(1552);
    expect(yearSpanNoZero(-10, 10)).toBe(19);
    expect(yearSpanNoZero(313, 800)).toBe(487);
  });

  it("registers all 15 labs across lessons", () => {
    expect(KINDS).toHaveLength(15);
    const labLessons = LESSONS.filter((lesson) => Boolean(lesson.lab));
    expect(labLessons).toHaveLength(15);
    expect(new Set(labLessons.map((lesson) => lesson.lab)).size).toBe(15);
  });

  it.each(KINDS)("%s starts with 3 unmet goals", (kind) => {
    const def = LABS[kind];
    const state = freshLab(kind);
    const goals = def.goals(state);
    expect(goals).toHaveLength(3);
    expect(goals.every((goal) => !goal.met)).toBe(true);
  });

  it.each(KINDS)("%s has an explicit witness for every goal", (kind) => {
    const def = LABS[kind];
    const witnesses = WITNESSES[kind];
    expect(witnesses).toHaveLength(3);

    witnesses.forEach((steps, index) => {
      const state = freshLab(kind);
      for (const [key, value] of steps) {
        applyControl(def, state, key, value);
      }
      const goals = trackedGoals(def, state);
      expect(goals[index]?.met).toBe(true);
      const svg = def.draw(state);
      const readout = def.readout(state);
      expect(svg).toContain("<svg");
      expect(svg).not.toMatch(/NaN|undefined|Infinity/);
      expect(readout.length).toBeGreaterThan(20);
      expect(readout).not.toMatch(/\d\.\d/);
    });
  });

  it.each(KINDS)(
    "%s keeps sequential tracked goals reached and renders valid SVG across controls",
    (kind) => {
      const def = LABS[kind];
      const state = freshLab(kind);

      for (const steps of WITNESSES[kind]) {
        for (const [key, value] of steps) {
          applyControl(def, state, key, value);
          trackedGoals(def, state);
        }
      }
      expect(trackedGoals(def, state).every((goal) => goal.met)).toBe(true);

      const probe = freshLab(kind);
      for (const control of def.controls(probe)) {
        for (const value of controlValues(control)) {
          const next = freshLab(kind);
          applyControl(def, next, control.key, value);
          const svg = def.draw(next);
          const readout = def.readout(next);
          expect(svg).toContain("<svg");
          expect(svg).toContain("</svg>");
          expect(svg).not.toMatch(/NaN|undefined|Infinity/);
          expect(readout.length).toBeGreaterThan(20);
          expect(readout).not.toMatch(/\d\.\d|NaN|undefined|Infinity/);
        }
      }
    },
  );

  it("matches historically checked territorial boundaries across Roman expansion stages 1–4", () => {
    expect(EXPANSION_STAGES).toHaveLength(5);

    const expected: Record<
      number,
      { inside: Array<[number, number]>; outside: Array<[number, number]> }
    > = {
      1: {
        inside: [[12.5, 41.9]], // Rom
        outside: [
          [14.2, 41.1], // Capua
          [17.2, 40.5], // Tarent
          [10.32, 36.85], // Karthago
          [23.72, 37.98], // Athen
          [27.34, 37.94], // Ephesos
        ],
      },
      2: {
        inside: [
          [12.5, 41.9], // Rom
          [14.2, 41.1], // Capua
          [17.2, 40.5], // Tarent
        ],
        outside: [
          [15.29, 37.07], // Syrakus
          [9.19, 45.46], // Mailand
          [10.32, 36.85], // Karthago
          [23.72, 37.98], // Athen
          [27.34, 37.94], // Ephesos
        ],
      },
      3: {
        inside: [
          [12.5, 41.9], // Rom
          [15.29, 37.07], // Syrakus
          [9.19, 45.46], // Mailand
          [10.32, 36.85], // Karthago
          [-0.28, 39.68], // Sagunt
          [23.72, 37.98], // Athen
        ],
        outside: [
          [27.34, 37.94], // Ephesos (Asia erst ab 133/129 v. Chr.)
          [5.37, 43.3], // Massalia
          [2.35, 48.86], // Paris
          [29.92, 31.2], // Alexandria
        ],
      },
      4: {
        inside: [
          [12.5, 41.9], // Rom
          [10.32, 36.85], // Karthago
          [-0.28, 39.68], // Sagunt
          [-4.78, 37.88], // Corduba
          [5.37, 43.3], // Massalia
          [2.35, 48.86], // Paris
          [23.72, 37.98], // Athen
          [27.34, 37.94], // Ephesos
          [36.16, 36.2], // Antiochia
        ],
        outside: [
          [29.92, 31.2], // Alexandria (Ägypten erst ab 30 v. Chr.)
          [10.9, 48.37], // Augsburg (Raetien erst ab 15 v. Chr.)
          [-0.12, 51.51], // London (Britannien erst ab 43 n. Chr.)
        ],
      },
    };

    for (const [stageStr, { inside, outside }] of Object.entries(expected)) {
      const stage = Number(stageStr);
      for (const [lon, lat] of inside) {
        expect(isInRomanExpansionStage(stage, lon, lat)).toBe(true);
      }
      for (const [lon, lat] of outside) {
        expect(isInRomanExpansionStage(stage, lon, lat)).toBe(false);
      }
    }
  });
});
