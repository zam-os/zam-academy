import { expect, it } from "vitest";
import css from "../src/styles.css?raw";

function luminance(hex: string): number {
  expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
  const [r, g, b] = hex
    .slice(1)
    .match(/../g)!
    .map((part) => {
      const channel = Number.parseInt(part, 16) / 255;
      return channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(first: string, second: string): number {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const rules = [
  ...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g),
];
function palette(selector: string): Record<string, string> {
  return Object.fromEntries(
    rules
      .filter(([, name]) => name.trim() === selector)
      .flatMap(([, , body]) =>
        [...body.matchAll(/(--[\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map(
          ([, token, value]) => [token, value],
        ),
      ),
  );
}

it.each([
  ":root",
  ':root[data-theme="dark"]',
  ':root:not([data-theme="light"])',
])("keeps labels and stage text above 4.5:1 contrast in %s", (selector) => {
  const base = palette(selector);
  for (const tone of ["ink", "muted", "q-v", "q-f", "q-s", "q-e"]) {
    expect(
      contrast(base[`--${tone}`], base["--fig-bg"]),
      tone,
    ).toBeGreaterThanOrEqual(4.5);
  }
  for (const lb of [1, 2, 3, 4]) {
    const stage = `[data-lb="${lb}"]`;
    const colors = {
      ...base,
      ...palette(stage),
      ...(selector === ":root" ? {} : palette(`${selector} ${stage}`)),
    };
    expect(
      contrast(colors["--accent"], colors["--accent-soft"]),
      stage,
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrast("#ffffff", colors["--grad-a"]),
      stage,
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrast("#ffffff", colors["--grad-b"]),
      stage,
    ).toBeGreaterThanOrEqual(4.5);
  }
});
