import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import type { ModelKind } from "../src/model/types";
import { initialModelState, MODEL_SCENARIOS, PARAMS } from "../src/models";
import css from "../src/styles.css?raw";
import {
  hasMotion,
  ILLUSTRATED_LESSONS,
  renderFigure,
  renderIllustration,
} from "../src/ui/figures";
import { renderModel } from "../src/ui/models";

const KINDS = Object.keys(MODEL_SCENARIOS) as ModelKind[];
/** Every innermost rule of the stylesheet as [selector, declarations]. */
const RULES = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(
  (match): [string, string] => [
    match[1].replace(/\/\*[\s\S]*?\*\//g, "").trim(),
    match[2],
  ],
);
function tokens(selector: string): Record<string, string> {
  return Object.fromEntries(
    RULES.filter(([name]) => name === selector).flatMap(([, body]) =>
      [...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [
        match[1],
        match[2].trim(),
      ]),
    ),
  );
}
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** WCAG contrast ratio of two #rrggbb colours. */
function contrast(a: string, b: string): number {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}
const DARK = ':root[data-theme="dark"]',
  DARK_SYSTEM = ':root:not([data-theme="light"])';
/** The drawing of a figure without the legend below it. */
const drawing = (html: string): string =>
  html.split('<ul class="figure-legend">')[0];
const legendOf = (html: string): string =>
  html.split('<ul class="figure-legend">')[1] ?? "";
describe("figures of the model lab", () => {
  it("draws every comparison of every model with a text alternative and a legend", () => {
    for (const kind of KINDS)
      for (const scenario of MODEL_SCENARIOS[kind]) {
        const html = renderFigure(kind, scenario.values);
        expect(html, kind).toContain('class="physics-figure"');
        expect(html, kind).toContain('role="img"');
        const label = /aria-label="([^"]*)"/.exec(html)?.[1] ?? "";
        expect(label.length, `${kind} ${scenario.id}`).toBeGreaterThan(60);
        const legend = [...html.matchAll(/<li class="q-([a-z]+)">/g)];
        expect(legend.length, kind).toBeGreaterThanOrEqual(2);
        // Every tone of the legend has its colour in the stylesheet.
        for (const [, tone] of legend)
          expect(
            RULES.some(([selector]) => selector === `.q-${tone}`),
            `${kind}: .q-${tone}`,
          ).toBe(true);
      }
  });
  it("names in the legend only what the drawing shows, on a grid of all sliders", () => {
    const missing: string[] = [];
    let drawings = 0;
    for (const kind of KINDS) {
      const params = PARAMS[kind],
        // Both ends of a slider, their neighbours and the middle.
        grid = params.map((param) => {
          const steps = Math.round((param.max - param.min) / param.step);
          return [...new Set([0, 1, Math.round(steps / 2), steps - 1, steps])]
            .filter((i) => i >= 0 && i <= steps)
            .map((i) => Number((param.min + i * param.step).toFixed(6)));
        }),
        settings = grid.reduce<Array<Record<string, number>>>(
          (all, values, i) =>
            all.flatMap((setting) =>
              values.map((value) => ({ ...setting, [params[i].key]: value })),
            ),
          [{}],
        );
      for (const values of [
        ...MODEL_SCENARIOS[kind].map((scenario) => scenario.values),
        ...settings,
      ]) {
        const html = renderFigure(kind, values);
        drawings++;
        for (const [, tone, name] of legendOf(html).matchAll(
          /<li class="q-([a-z]+)">.*?<\/span>([^<]*)<\/li>/g,
        ))
          if (!new RegExp(`q-${tone}(?![a-z])`).test(drawing(html)))
            missing.push(`${kind} ${JSON.stringify(values)}: ${tone} "${name}"`);
      }
    }
    expect(drawings).toBeGreaterThan(500);
    expect(missing).toEqual([]);
  });
  it("changes the drawing with every comparison", () => {
    for (const kind of KINDS) {
      const drawings = MODEL_SCENARIOS[kind].map((scenario) =>
        renderFigure(kind, scenario.values),
      );
      expect(new Set(drawings).size, kind).toBe(drawings.length);
    }
  });
  it("keeps every coordinate finite and near the canvas at the ends of all sliders", () => {
    for (const kind of KINDS) {
      const params = PARAMS[kind];
      for (let corner = 0; corner < 2 ** params.length; corner++) {
        const values = Object.fromEntries(
            params.map((param, i) => [
              param.key,
              corner & (1 << i) ? param.max : param.min,
            ]),
          ),
          html = renderFigure(kind, values),
          where = `${kind} ${JSON.stringify(values)}`;
        expect(html, where).not.toMatch(/NaN|Infinity|undefined/);
        for (const [, value] of html.matchAll(
          /\s(?:x|y|x1|x2|y1|y2|cx|cy|r|rx|ry|width|height)="(-?[\d.]+)"/g,
        ))
          expect(Math.abs(Number(value)), where).toBeLessThan(2000);
      }
    }
  });
  it("starts motion only on request and offers it where something moves", () => {
    const moving = KINDS.filter((kind) =>
      hasMotion(kind, MODEL_SCENARIOS[kind][0].values),
    );
    // Only a closed circuit moves: its electrons flow when the learner asks.
    expect(moving).toEqual([]);
    const flowing: Array<[ModelKind, Record<string, number>]> = [
      ["stromkreis", { switch: 1, gap: 0 }],
      ["schaltung", { type: 2, a: 1, b: 1 }],
    ];
    for (const [kind, values] of flowing) {
      expect(hasMotion(kind, values), kind).toBe(true);
      expect(renderFigure(kind, values), kind).not.toContain("model-figure playing");
      expect(renderFigure(kind, values, true), kind).toContain("model-figure playing");
    }
    expect(hasMotion("stromkreis", { switch: 1, gap: 4 })).toBe(false);
    for (const kind of KINDS) {
      const values = MODEL_SCENARIOS[kind][0].values,
        still = renderFigure(kind, values),
        playing = renderFigure(kind, values, true);
      expect(still, kind).not.toContain("model-figure playing");
      if (moving.includes(kind)) {
        expect(still, kind).toContain('data-motion aria-pressed="false"');
        expect(playing, kind).toContain("model-figure playing");
        expect(playing, kind).toContain('data-motion aria-pressed="true"');
      } else {
        expect(still, kind).not.toContain("data-motion");
        expect(playing, kind).toBe(still);
      }
    }
  });
  it("shows a choice as named buttons and a quantity as a slider with its value", () => {
    for (const kind of KINDS) {
      const lesson = LESSONS.find((entry) => entry.model === kind)!,
        html = renderModel(lesson, [], initialModelState());
      for (const param of PARAMS[kind])
        if (param.options) {
          expect(param.options.length).toBe(
            Math.round((param.max - param.min) / param.step) + 1,
          );
          expect(html).not.toContain(`data-model-range="${param.key}"`);
          for (const option of param.options)
            expect(html, `${kind} ${param.key}`).toContain(`>${option}</button>`);
          expect(
            html.match(
              new RegExp(
                `data-model-choice="${param.key}" data-value="[^"]+" aria-pressed="true"`,
                "g",
              ),
            ),
            `${kind} ${param.key}`,
          ).toHaveLength(1);
        } else {
          expect(html).toContain(`data-model-range="${param.key}"`);
          expect(html).toContain(`data-value-for="${param.key}"`);
        }
    }
  });
  it("gives lessons without a model lab a fixed drawing where one is defined", () => {
    expect(ILLUSTRATED_LESSONS.length).toBeGreaterThan(0);
    for (const id of ILLUSTRATED_LESSONS) {
      const lesson = LESSONS.find((entry) => entry.id === id);
      expect(lesson, id).toBeDefined();
      const html = renderIllustration(id);
      expect(html).toContain('role="img"');
      expect(html).not.toMatch(/NaN|Infinity|undefined/);
      expect(/aria-label="([^"]*)"/.exec(html)![1].length).toBeGreaterThan(60);
    }
    expect(ILLUSTRATED_LESSONS.sort()).toEqual(["erdmagnetfeld", "waerme-licht"]);
    expect(renderIllustration("dichte")).toBe("");
  });
});

describe("circuit drawings (review of #169)", () => {
  const flows = (values: Record<string, number>) =>
    [...renderFigure("schaltung", values).matchAll(/<path d="([^"]+)" class="ln q-m flow"\/>/g)].map((m) => m[1]);
  it("lets electrons leave the minus pole and reach the plus pole", () => {
    // The battery sits at x = 60 between y = 135 (plus) and y = 145 (minus).
    for (const values of [
      { type: 0, a: 1, b: 1 },
      { type: 1, a: 1, b: 0 },
      { type: 1, a: 0, b: 1 },
      { type: 2, a: 1, b: 1 },
      { type: 2, a: 0, b: 0 },
    ])
      for (const d of flows(values)) {
        expect(d.startsWith("M60 150"), JSON.stringify(values)).toBe(true);
        expect(d.endsWith("V130"), JSON.stringify(values)).toBe(true);
      }
    expect(flows({ type: 0, a: 1, b: 0 })).toEqual([]);
  });
  it("animates only the closed branch of the ODER circuit", () => {
    const upper = flows({ type: 1, a: 1, b: 0 }),
      lower = flows({ type: 1, a: 0, b: 1 });
    expect(upper).toHaveLength(1);
    expect(lower).toHaveLength(1);
    // Branch B runs 60 px below the top wire.
    expect(upper[0]).not.toContain("V120");
    expect(lower[0]).toContain("V120");
    expect(flows({ type: 1, a: 1, b: 1 })).toHaveLength(2);
  });
  it("follows the chosen wire in the Wechselschaltung", () => {
    expect(flows({ type: 2, a: 1, b: 1 })[0]).toContain(" 80H");
    expect(flows({ type: 2, a: 0, b: 0 })[0]).toContain(" 130H");
  });
  it("connects the coil's battery, swaps its poles on reversal and opens the switch", () => {
    const plus = (html: string) => /<line x1="(\d+)" y1="215" x2="\1" y2="245"/.exec(html)?.[1];
    const asDrawn = renderFigure("spule", { on: 1, dir: 0, n: 200, core: 1 }),
      reversed = renderFigure("spule", { on: 1, dir: 1, n: 200, core: 1 }),
      off = renderFigure("spule", { on: 0, dir: 0, n: 200, core: 1 });
    expect(plus(asDrawn)).toBe("215");
    expect(plus(reversed)).toBe("225");
    // The wires end at the plates.
    expect(asDrawn).toContain("H215M225 230H");
    expect(asDrawn).toContain('x1="150" y1="230" x2="176" y2="230"');
    expect(off).not.toContain('x1="150" y1="230" x2="176" y2="230"');
  });
});

describe("layout of the model lab", () => {
  it("lets the value of a slider wrap below a long name instead of leaving the card", () => {
    const head = RULES.find(([selector]) => selector === ".control-head")?.[1] ?? "";
    expect(head).toMatch(/flex-wrap:\s*wrap/);
    // The longest name of a slider is longer than the card is wide at 13rem.
    const longest = Math.max(
      ...KINDS.flatMap((kind) =>
        PARAMS[kind].filter((param) => !param.options).map((param) => param.label.length),
      ),
    );
    expect(longest).toBeGreaterThan(20);
  });
});

describe("colour system", () => {
  const light = tokens(":root"),
    dark = { ...light, ...tokens(DARK) };
  it("keeps the two dark blocks identical", () => {
    expect(Object.keys(tokens(DARK)).length).toBeGreaterThan(15);
    expect(tokens(DARK_SYSTEM)).toEqual(tokens(DARK));
    for (const lb of [1, 2, 3]) {
      expect(tokens(`${DARK_SYSTEM} [data-lb="${lb}"]`)).toEqual(
        tokens(`${DARK} [data-lb="${lb}"]`),
      );
      expect(Object.keys(tokens(`${DARK} [data-lb="${lb}"]`))).toEqual([
        "--accent",
        "--accent-soft",
      ]);
    }
  });
  it("gives each section of the Fachlehrplan its own accent in both themes", () => {
    for (const theme of ["", `${DARK} `]) {
      const accents = [1, 2, 3].map(
        (lb) => tokens(`${theme}[data-lb="${lb}"]`)["--accent"],
      );
      expect(new Set(accents).size).toBe(3);
      expect(accents).not.toContain(theme ? dark["--accent"] : light["--accent"]);
    }
  });
  it("names one colour per kind of physical quantity, distinct in both themes", () => {
    for (const base of [light, dark]) {
      const tones = ["p", "m", "sp", "s", "f", "e", "t", "x"].map(
        (tone) => base[`--q-${tone}`],
      );
      for (const colour of tones) expect(colour).toMatch(/^#[0-9a-f]{6}$/);
      expect(new Set(tones).size).toBe(tones.length);
    }
  });
  it("keeps pole and charge colours apart from the figure background", () => {
    for (const base of [light, dark])
      for (const tone of ["p", "m", "sp"])
        expect(contrast(base[`--q-${tone}`], base["--fig-bg"])).toBeGreaterThanOrEqual(3);
    // Red north pole and green south pole: the school convention, distinct in both themes.
    expect(light["--q-p"]).not.toBe(light["--q-sp"]);
    expect(dark["--q-p"]).not.toBe(dark["--q-sp"]);
  });
  it("reaches a contrast of 4.5 : 1 for text colours on their surfaces", () => {
    const failures: string[] = [];
    const need = (name: string, fg: string, bg: string) => {
      if (contrast(fg, bg) < 4.5)
        failures.push(`${name}: ${fg} on ${bg} = ${contrast(fg, bg).toFixed(2)}`);
    };
    for (const [theme, base] of [
      ["light", light],
      ["dark", dark],
    ] as const) {
      const text = Object.keys(base).filter((key) =>
        /^--(q-.+|ok|danger|gold|muted|ink|accent)$/.test(key),
      );
      expect(text.length).toBe(14);
      for (const key of text)
        for (const surface of ["--fig-bg", "--surface", "--bg"])
          need(`${theme} ${key} on ${surface}`, base[key], base[surface]);
      for (const tone of ["ok", "gold", "danger", "accent"])
        need(`${theme} ${tone} on its tint`, base[`--${tone}`], base[`--${tone}-soft`]);
      need(`${theme} muted on soft`, base["--muted"], base["--soft"]);
      for (const lb of [0, 1, 2, 3]) {
        const stage = {
          ...base,
          ...tokens(`[data-lb="${lb}"]`),
          ...(theme === "dark" ? tokens(`${DARK} [data-lb="${lb}"]`) : {}),
        };
        for (const surface of ["--surface", "--bg", "--fig-bg", "--accent-soft"])
          need(`${theme} LB ${lb} accent on ${surface}`, stage["--accent"], stage[surface]);
        need(`${theme} LB ${lb} text on tint`, stage["--ink"], stage["--accent-soft"]);
        need(`${theme} LB ${lb} muted on tint`, stage["--muted"], stage["--accent-soft"]);
        // Filled buttons and badges carry white text on the gradient.
        need(`${theme} LB ${lb} white on gradient start`, "#ffffff", stage["--grad-a"]);
        need(`${theme} LB ${lb} white on gradient end`, "#ffffff", stage["--grad-b"]);
      }
    }
    expect(failures).toEqual([]);
  });
});
