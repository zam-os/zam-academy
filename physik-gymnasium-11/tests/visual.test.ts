import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import type { ModelKind } from "../src/model/types";
import { fmt } from "../src/exercises/format";
import {
  EARTH_RADIUS,
  initialModelState,
  MODEL_SCENARIOS,
  PARAMS,
  PLACES,
} from "../src/models";
import css from "../src/styles.css?raw";
import {
  hasMotion,
  ILLUSTRATED_LESSONS,
  renderFigure,
  renderIllustration,
} from "../src/ui/figures";
import { renderModel, renderModelOutput } from "../src/ui/models";

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
/** Length of the first arrow in a tone: from its start to the tip of its head. */
function arrowLength(html: string, tone: string): number {
  const match = new RegExp(
    `<g class="q-${tone}[^"]*"><line x1="([\\d.]+)" y1="([\\d.]+)"[^>]*/><polygon points="([\\d.]+),([\\d.]+) `,
  ).exec(html);
  if (!match) throw new Error(`no arrow in tone ${tone}`);
  const [x1, y1, x2, y2] = match.slice(1).map(Number);
  return Math.hypot(x2 - x1, y2 - y1);
}

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
    expect(drawings).toBeGreaterThan(1000);
    expect(missing).toEqual([]);
  });
  it("drops the legend entry of a line that a setting leaves out", () => {
    const names = (kind: ModelKind, values: Record<string, number>) =>
      [...legendOf(renderFigure(kind, values)).matchAll(/<\/span>([^<]*)<\/li>/g)].map(
        (match) => match[1],
      );
    expect(names("superposition", { a1: 3, a2: 3, shift: 0.5 })).toContain("Gangunterschied Δs");
    expect(names("superposition", { a1: 3, a2: 3, shift: 0 })).toEqual([
      "Welle 1",
      "Welle 2",
      "Überlagerung: Summe der Auslenkungen",
    ]);
    expect(names("lorentz", { beta: 0.6, t0: 1 })).toContain("Geschwindigkeit des Raumschiffs");
    expect(names("lorentz", { beta: 0, t0: 1 })).not.toContain("Geschwindigkeit des Raumschiffs");
    expect(names("saving", { pOld: 60, pNew: 8, h: 3, price: 35 })).toContain("eingesparte Energie");
    expect(names("saving", { pOld: 10, pNew: 12, h: 1, price: 20 })).not.toContain("eingesparte Energie");
  });
  it("reads no figure aloud with a vertical bar", () => {
    for (const kind of KINDS)
      for (const scenario of MODEL_SCENARIOS[kind]) {
        const labels = [
          ...renderModelOutput(kind, scenario.values).matchAll(/aria-label="([^"]*)"/g),
        ];
        expect(labels.length, kind).toBeGreaterThan(0);
        for (const [, label] of labels) expect(label, kind).not.toContain("|");
      }
  });
  it("ties the name Raumstation to the 400 km orbit", () => {
    const html = renderFigure("orbit", MODEL_SCENARIOS.orbit[0].values),
      // The reference orbits are the dashed circles; the innermost is 400 km.
      rings = [
        ...html.matchAll(/<circle cx="240" cy="152" r="([\d.]+)" class="ln q-mute dash thin"\/>/g),
      ].map((match) => Number(match[1])),
      leader = /<line x1="240" y1="([\d.]+)" x2="240" y2="([\d.]+)" class="ln q-mute thin"\/>/.exec(html),
      name = /<text x="240" y="([\d.]+)"[^>]*>Raumstation<\/text>/.exec(html);
    expect(rings).toHaveLength(3);
    expect(leader).not.toBeNull();
    expect(name).not.toBeNull();
    // The leader starts on the ring and ends just above the name.
    expect(Number(leader![1])).toBeCloseTo(152 + Math.min(...rings), 1);
    const gap = Number(name![1]) - Number(leader![2]);
    expect(gap).toBeGreaterThan(0);
    expect(gap).toBeLessThanOrEqual(14);
    expect(/aria-label="([^"]*)"/.exec(html)![1]).toContain("Raumstation in 400 Kilometer Höhe");
  });
  it("shows the force on a satellite as a direction it can draw and states its share", () => {
    const at = (h: number) => renderFigure("orbit", { h }),
      heights = [200, 400, 20200, 36000];
    for (const h of heights) {
      const html = at(h),
        length = arrowLength(html, "f"),
        [x1, y1, x2, y2] = /<g class="q-f over"><line x1="([\d.]+)" y1="([\d.]+)"[^>]*\/><polygon points="([\d.]+),([\d.]+) /
          .exec(html)!
          .slice(1)
          .map(Number),
        [sx, sy] = /<circle cx="([\d.]+)" cy="([\d.]+)" r="6" class="fl q-acc body"\/>/
          .exec(html)!
          .slice(1)
          .map(Number),
        toCentre = (x: number, y: number) => Math.hypot(x - 240, y - 152);
      // One length at every height: the arrow claims a direction, no size.
      expect(Math.abs(length - arrowLength(at(heights[0]), "f")), `${h} km`).toBeLessThan(0.15);
      // It starts outside the satellite's dot, so the body does not hide it,
      expect(Math.hypot(x1 - sx, y1 - sy), `${h} km`).toBeGreaterThan(6);
      // and runs straight towards the Earth's centre without passing it.
      expect(
        Math.abs(toCentre(x1, y1) - toCentre(x2, y2) - length),
        `${h} km`,
      ).toBeLessThan(0.3);
      expect(html).toContain(
        `Gravitationskraft: ${fmt(100 * (EARTH_RADIUS / (EARTH_RADIUS + h * 1000)) ** 2, 1)} % der Gewichtskraft am Boden`,
      );
      expect(legendOf(html)).toContain("Pfeil zeigt nur die Richtung");
    }
    expect(at(400)).toContain("88,5 % der Gewichtskraft am Boden");
    expect(at(35800)).toContain("2,3 % der Gewichtskraft am Boden");
  });
  it("draws the pendulum's arrow as the Fallbeschleunigung, which the mass leaves alone", () => {
    const at = (m: number, ort: number) =>
        renderFigure("pendulum", { l: 0.5, m, ort }),
      earth = PLACES.findIndex((place) => place.name === "Erde"),
      moon = PLACES.findIndex((place) => place.name === "Mond");
    for (const ort of PLACES.keys()) {
      const html = at(0.2, ort);
      expect(legendOf(html)).toContain("Fallbeschleunigung g am Ort");
      expect(html).not.toContain("Gewichtskraft");
      expect(html).not.toContain("F_G");
      // Coordinates are rounded to a tenth, hence the tolerance.
      expect(
        Math.abs(arrowLength(at(1, ort), "a") - arrowLength(html, "a")),
      ).toBeLessThan(0.15);
    }
    // The same length per m/s² on the Earth and on the Moon.
    expect(
      Math.abs(
        arrowLength(at(0.2, earth), "a") / PLACES[earth].g -
          arrowLength(at(0.2, moon), "a") / PLACES[moon].g,
      ),
    ).toBeLessThan(0.15);
    // The arrow starts below the body, so even the shortest one shows whole.
    for (const m of [0.1, 1]) {
      const html = at(m, moon),
        body = /<circle cx="[\d.]+" cy="([\d.]+)" r="([\d.]+)" class="ln q-mute dash thin still"\/>/.exec(html)!,
        start = /<g class="q-a still"><line x1="[\d.]+" y1="([\d.]+)"/.exec(html)!;
      expect(Number(start[1])).toBeGreaterThan(Number(body[1]) + Number(body[2]));
    }
  });
  it("names the terminal speed only where air resistance gives one", () => {
    const free = renderFigure("airfall", { m: 80, k: 0, dt: 0.1 }),
      drag = renderFigure("airfall", { m: 80, k: 0.3, dt: 0.1 });
    expect(legendOf(drag)).toContain("Endgeschwindigkeit");
    expect(legendOf(drag)).toContain("Luftwiderstand");
    expect(drawing(drag)).toContain('class="ln q-bad dash"');
    expect(legendOf(free)).not.toContain("Endgeschwindigkeit");
    expect(legendOf(free)).not.toContain("Luftwiderstand");
    expect(drawing(free)).not.toContain("q-bad");
    expect(drawing(free)).not.toContain("q-x");
  });
  it("changes the drawing with every comparison", () => {
    for (const kind of KINDS) {
      const drawings = MODEL_SCENARIOS[kind].map((scenario) =>
        renderFigure(kind, scenario.values),
      );
      // Vierfache Masse and ein Viertel der Federhärte give the same period,
      // so the simulated oscillation is rightly drawn the same.
      expect(new Set(drawings).size, kind).toBe(
        drawings.length - (kind === "eulerosc" ? 1 : 0),
      );
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
    expect(moving).toEqual([
      "circular",
      "centripetal",
      "orbit",
      "oscillation",
      "spring",
      "pendulum",
      "wave",
      "standing",
      "ride",
    ]);
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
      expect(lesson!.model, id).toBeUndefined();
      const html = renderIllustration(id);
      expect(html).toContain('role="img"');
      expect(html).not.toMatch(/NaN|Infinity|undefined/);
      expect(/aria-label="([^"]*)"/.exec(html)![1].length).toBeGreaterThan(60);
    }
    expect(renderIllustration("kb-groessen")).toBe("");
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
    for (const lb of [1, 2, 3, 4]) {
      expect(tokens(`${DARK_SYSTEM} [data-lb="${lb}"]`)).toEqual(
        tokens(`${DARK} [data-lb="${lb}"]`),
      );
      expect(Object.keys(tokens(`${DARK} [data-lb="${lb}"]`))).toEqual([
        "--accent",
        "--accent-soft",
      ]);
    }
  });
  it("gives each Lernbereich its own accent in both themes", () => {
    for (const theme of ["", `${DARK} `]) {
      const accents = [1, 2, 3, 4].map(
        (lb) => tokens(`${theme}[data-lb="${lb}"]`)["--accent"],
      );
      expect(new Set(accents).size).toBe(4);
      expect(accents).not.toContain(theme ? dark["--accent"] : light["--accent"]);
    }
  });
  it("names one colour per kind of physical quantity, distinct in both themes", () => {
    for (const base of [light, dark]) {
      const tones = ["v", "f", "a", "s", "t", "e", "x", "one"].map(
        (tone) => base[`--q-${tone}`],
      );
      for (const colour of tones) expect(colour).toMatch(/^#[0-9a-f]{6}$/);
      expect(new Set(tones).size).toBe(tones.length);
    }
  });
  it("sets the force arrow apart from the Earth's disc with a rim of 3 : 1", () => {
    // Red on the blue of the Earth alone would not do.
    const earth = /fill:\s*(#[0-9a-f]{6})/.exec(
      RULES.find(([selector]) => selector.includes(".physics-figure .earth"))?.[1] ?? "",
    )![1];
    expect(contrast(light["--q-f"], earth)).toBeLessThan(3);
    for (const base of [light, dark]) {
      expect(contrast(base["--fig-bg"], earth)).toBeGreaterThanOrEqual(3);
      expect(contrast(base["--q-f"], base["--fig-bg"])).toBeGreaterThanOrEqual(3);
    }
    for (const h of [200, 400, 36000]) {
      const html = renderFigure("orbit", { h }),
        rim = /<g class="rim"><line ([^>]*)\/><polygon ([^>]*)\/><\/g><g class="q-f over"><line ([^>]*) class="ln thick"\/><polygon ([^>]*) class="fl"\/>/.exec(html);
      expect(rim, `${h} km`).not.toBeNull();
      // The rim has the shape of the arrow it lies under.
      expect(rim![1]).toBe(rim![3]);
      expect(rim![2]).toBe(rim![4]);
    }
    const rimRule = RULES.find(([selector]) => selector.includes(".rim line"))?.[1] ?? "";
    expect(rimRule).toContain("stroke: var(--fig-bg)");
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
      for (const lb of [0, 1, 2, 3, 4]) {
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
