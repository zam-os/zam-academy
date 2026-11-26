import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import {
  applyControl,
  fmtDe,
  fmtYear,
  type LabValue,
} from "../src/labs/core";
import { balance } from "../src/labs/neuzeit";
import { churchStyle, countVotes, ELECTORS } from "../src/labs/mittelalter";
import { freshLab, LABS, trackedGoals } from "../src/labs/index";
import type { LabKind } from "../src/model/types";

const KINDS = Object.keys(LABS) as LabKind[];

const ALL_ELECTORS = ELECTORS.map((e) => [e.key, true] as [string, LabValue]);

const WITNESSES: Record<LabKind, Array<Array<[string, LabValue]>>> = {
  ottonenReich: [[["year", "919"]], [["year", "955"]], [["duchies", true], ["year", "962"]]],
  investiturstreit: [[["step", 2]], [["step", 3], ["fuersten", true]], [["step", 4]]],
  lehnswesen: [[["role", "kronvasall"]], [["role", "untervasall"]], [["role", "koenig"], ["erblich", true]]],
  kurfuerstenwahl: [
    [["mainz", true], ["koeln", true], ["trier", true]],
    [["mainz", true], ["koeln", true], ["boehmen", true], ["pfalz", true]],
    ALL_ELECTORS,
  ],
  kathedrale: [[["bogen", "rund"]], [["bogen", "spitz"], ["wand", "streben"], ["fenster", "gross"]], [["wand", "dick"], ["fenster", "gross"]]],
  altstadt: [
    [["ort", "rathaus"]],
    [["ort", "gerber"]],
    ["mauer", "markt", "rathaus", "kirche", "gerber", "judengasse", "spital", "burg"].map((o) => ["ort", o] as [string, LabValue]),
  ],
  pestKarte: [[["year", 1347]], [["year", 1349]], [["wege", true], ["year", 1348]]],
  kreuzzugKarte: [[["zug", "erster"]], [["zug", "vierter"]], [["staaten", true]]],
  perspektive: [[["fx", 320]], [["horizont", 180]], [["modus", "bedeutung"]]],
  entdeckerKarte: [[["fahrt", "kolumbus"]], [["fahrt", "gama"]], [["fahrt", "magellan"], ["tordesillas", true]]],
  hanseKarte: [[["kontor", "nowgorod"]], [["kontor", "bergen"]], [["waren", true], ["kontor", "bruegge"]]],
  reformationVerlauf: [[["step", 2]], [["step", 6]], [["step", 0], ["druck", true]]],
  flugblatt: [[["teil", "links"], ["teil", "rechts"]], [["teil", "werkstatt"]], [["heute", true]]],
  kriegsphasen: [[["phase", "1"]], [["phase", "4"]], [["frieden", true]]],
  versailles: [[["teil", "schlafzimmer"]], [["achse", true], ["teil", "kanal"]], [["teil", "spiegelsaal"]]],
  balanceOfPower: [
    [["spanien", true]],
    [["spanien", true], ["england", true], ["niederlande", true], ["kaiser", true]],
    [["spanien", true], ["utrecht", true]],
  ],
  bauwerkeVergleich: [
    [["bau", "theater"], ["bau", "reichstag"]],
    [["bau", "aachen"], ["kriterium", "blick"]],
    [["bau", "theater"], ["bau", "aachen"], ["bau", "wuerzburg"], ["bau", "reichstag"]],
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

describe("Geschichte 7 interactive historical models and maps", () => {
  it("formats German numbers and years with the real minus sign", () => {
    expect(fmtDe(-12.5, 1)).toBe("−12,5");
    expect(fmtDe(-0, 1)).toBe("0,0");
    expect(fmtYear(962)).toBe("962 n. Chr.");
    expect(fmtYear(-450)).toBe("450 v. Chr.");
  });

  it("registers all 17 labs across lessons", () => {
    expect(KINDS).toHaveLength(17);
    const labLessons = LESSONS.filter((lesson) => Boolean(lesson.lab));
    expect(labLessons).toHaveLength(17);
    expect(new Set(labLessons.map((lesson) => lesson.lab)).size).toBe(17);
  });

  it("follows the Golden Bull: seven electors, three spiritual, majority of four", () => {
    expect(ELECTORS).toHaveLength(7);
    expect(ELECTORS.filter((e) => e.spiritual)).toHaveLength(3);
    const state = freshLab("kurfuerstenwahl");
    expect(countVotes(state)).toBe(0);
    for (const key of ["mainz", "koeln", "trier"]) applyControl(LABS.kurfuerstenwahl, state, key, true);
    expect(LABS.kurfuerstenwahl.readout(state)).toContain("B hat die Mehrheit");
    applyControl(LABS.kurfuerstenwahl, state, "boehmen", true);
    expect(LABS.kurfuerstenwahl.readout(state)).toContain("A hat die Mehrheit");
  });

  it("only calls a church Gothic with pointed arches, buttresses and large windows", () => {
    expect(churchStyle({ bogen: "rund", wand: "dick", fenster: "klein" })).toBe("romanik");
    expect(churchStyle({ bogen: "spitz", wand: "streben", fenster: "gross" })).toBe("gotik");
    expect(churchStyle({ bogen: "spitz", wand: "dick", fenster: "gross" })).toBe("gefahr");
    expect(churchStyle({ bogen: "rund", wand: "streben", fenster: "klein" })).toBe("mischung");
  });

  it("balances the Grand Alliance against a united France and Spain", () => {
    const united = { spanien: true, bayern: true, england: true, niederlande: true, kaiser: true, utrecht: false };
    expect(balance(united)).toEqual({ france: 8, allies: 8 });
    expect(balance({ ...united, utrecht: true }).france).toBe(5);
    expect(balance({ spanien: false, bayern: true }).france).toBe(5);
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
});
