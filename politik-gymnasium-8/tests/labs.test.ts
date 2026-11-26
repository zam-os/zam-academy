import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import {
  applyControl,
  fmtDe,
  type LabValue,
} from "../src/labs/core";
import { freshLab, LABS, trackedGoals } from "../src/labs/index";
import { kompromissResult, RAT_GROUPS } from "../src/labs/politik";
import { pausenbrotScore } from "../src/labs/profil";
import type { LabKind } from "../src/model/types";

const KINDS = Object.keys(LABS) as LabKind[];

const WITNESSES: Record<LabKind, [string, LabValue][][]> = {
  jugendWerteBarometer: [
    [["politik", 60]],
    [["umwelt", 80], ["politik", 40]],
    [["umwelt", 80]],
  ],
  identitaetWaage: [
    [["peer", 80], ["eigen", 30]],
    [["eigen", 80], ["peer", 60]],
    [["peer", 70], ["familie", 70], ["eigen", 70]],
  ],
  sozialisationsNetz: [
    [["situation", "schule"]],
    [["situation", "werte"], ["peerShift", 0]],
    [["peerShift", 20]],
  ],
  konfliktEskalation: [
    [["ansprache", "ich"]],
    [["macht", "regeln"]],
    [["ansprache", "ich"], ["macht", "regeln"], ["mediation", true]],
  ],
  popularitaetSpektrum: [
    [["fokus", "person"], ["kritikOffen", false], ["fehlerZugelassen", false]],
    [["fokus", "leistung"], ["kritikOffen", true], ["fehlerZugelassen", true]],
    [["kritikOffen", true], ["fehlerZugelassen", false]],
  ],
  influencerStrategie: [
    [["interesse", "verkauf"], ["kennzeichnung", false], ["parasozial", true]],
    [["interesse", "politik"], ["parasozial", true]],
    [["interesse", "aufklaerung"], ["kennzeichnung", true]],
  ],
  politikKreislauf: [
    [["phase", "debatte"]],
    [["phase", "umsetzung"]],
    [["thema", "schulbus"], ["phase", "beschluss"]],
  ],
  kompromissRat: [
    [["radweg", 40], ["gruen", 40], ["kultur", 20], ["minderheit", true]],
    [["radweg", 40], ["gruen", 20], ["kultur", 40], ["minderheit", true]],
    [["radweg", 40], ["gruen", 40], ["kultur", 20], ["minderheit", false]],
  ],
  kooperationsEbenen: [
    [["ebene", "schule"]],
    [["ebene", "weltweit"]],
    [["jugendAktiv", true]],
  ],
  grenzKonfliktLoesung: [
    [["ansatz", "bilateral"]],
    [["ansatz", "eu"]],
    [["thema", "lkw"]],
  ],
  heimatKompass: [
    [["profil", "zugezogen"], ["sozialBoost", 30]],
    [["profil", "mehrfach"]],
    [["politischBoost", 30]],
  ],
  regionZukunft: [
    [["trend", "zuzug"]],
    [["oepnv", 80]],
    [["beteiligung", 70]],
  ],
  medienVergleich: [
    [["medium", "clip"]],
    [["medium", "lokal"]],
    [["trennung", true]],
  ],
  umfrageAuswerter: [
    [["n", 10]],
    [["suggestiv", true]],
    [["n", 40], ["suggestiv", false]],
  ],
  soziogrammLabor: [
    [["rolle", "star"]],
    [["rolle", "bruecke"]],
    [["rolle", "rand"], ["gemischt", true]],
  ],
  fuehrungsStile: [
    [["stil", "demokratisch"], ["notfall", false]],
    [["stil", "laissezfaire"]],
    [["stil", "autoritaer"], ["notfall", true]],
  ],
  gesundheitsDreieck: [
    [["physisch", 1]],
    [["physisch", 4], ["psychisch", 4], ["sozial", 4]],
    [["sozial", 5], ["physisch", 2]],
  ],
  pausenbrotTeller: [
    [["getraenk", "wasser"]],
    [["basis", "vollkorn"], ["belag", "hummus"]],
    [["basis", "vollkorn"], ["belag", "hummus"], ["rohkost", true], ["getraenk", "wasser"]],
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

describe("Politik und Gesellschaft 8 interactive labs", () => {
  it("formats German numbers with decimal comma and real minus sign", () => {
    expect(fmtDe(-12.5, 1)).toBe("−12,5");
    expect(fmtDe(-0, 1)).toBe("0,0");
    expect(fmtDe(82)).toBe("82");
  });

  it("registers all 18 labs uniquely across lessons and covers every stage", () => {
    expect(KINDS).toHaveLength(18);
    const labLessons = LESSONS.filter((lesson) => Boolean(lesson.lab));
    expect(labLessons).toHaveLength(18);
    expect(new Set(labLessons.map((lesson) => lesson.lab)).size).toBe(18);
    expect(new Set(labLessons.map((lesson) => lesson.lb)).size).toBe(9);
  });

  it("computes Gemeinderat majorities and budget constraint accurately", () => {
    expect(RAT_GROUPS.reduce((s, g) => s + g.seats, 0)).toBe(100);
    const ab = kompromissResult(40, 40, 20);
    expect(ab.affordable).toBe(true);
    expect(ab.votes).toBe(75);
    expect(ab.majority).toBe(true);
    const over = kompromissResult(50, 40, 20);
    expect(over.affordable).toBe(false);
    expect(over.majority).toBe(false);
  });

  it("scores balanced vs. sugary Pausenbrot choices consistently", () => {
    const poor = pausenbrotScore("croissant", "nussnougat", false, "limo");
    const good = pausenbrotScore("vollkorn", "hummus", true, "wasser");
    expect(poor.gesamt).toBeLessThan(30);
    expect(good.gesamt).toBeGreaterThanOrEqual(75);
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
