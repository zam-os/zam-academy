import { line, rect, text } from "./svg";

/**
 * Bausteine für Nassi-Shneiderman-Struktogramme im SVG.
 * Alle Farben kommen aus CSS-Klassen in styles.css für helles und dunkles Farbschema.
 */

export function structSequence(
  x: number,
  y: number,
  w: number,
  steps: string[],
  activeIdx = -1,
  rowHeight = 28,
): { svg: string; height: number } {
  const list = steps.length > 0 ? steps : ["(noch leer)"];
  let svg = "";
  list.forEach((step, idx) => {
    const ry = y + idx * rowHeight;
    const cls = idx === activeIdx ? "lab-fill-ok" : steps.length === 0 ? "lab-shape" : "lab-panel";
    svg += rect(x, ry, w, rowHeight, cls);
    svg += text(x + 10, ry + rowHeight / 2 + 4, step.slice(0, 34), steps.length === 0 ? "lab-text-muted" : "lab-text-small");
  });
  return { svg, height: list.length * rowHeight };
}

export function structBranch(
  x: number,
  y: number,
  w: number,
  condition: string,
  thenText: string,
  elseText: string,
  branchState: "then" | "else" | "none",
  twoSided: boolean,
  headerHeight = 46,
  bodyHeight = 46,
): { svg: string; height: number } {
  const half = w / 2;
  let svg = rect(x, y, w, headerHeight, "lab-panel");
  svg += line(x, y, x + half, y + headerHeight, "lab-line");
  svg += line(x + w, y, x + half, y + headerHeight, "lab-line");
  svg += text(x + half, y + 17, condition.slice(0, 34), "lab-text-small", "middle");
  svg += text(x + 8, y + headerHeight - 6, "wahr", branchState === "then" ? "lab-text-ok" : "lab-text-small");
  svg += text(x + w - 8, y + headerHeight - 6, "falsch", branchState === "else" ? "lab-text-a" : "lab-text-small", "end");

  const by = y + headerHeight;
  const leftCls = branchState === "then" ? "lab-fill-ok" : "lab-shape";
  const rightCls = branchState === "else" ? (twoSided ? "lab-fill-a" : "lab-panel") : "lab-shape";

  svg += rect(x, by, half, bodyHeight, leftCls);
  svg += rect(x + half, by, half, bodyHeight, rightCls);
  svg += text(x + half / 2, by + bodyHeight / 2 + 4, thenText.slice(0, 20), branchState === "then" ? "lab-text-ok" : "lab-text-small", "middle");
  svg += text(
    x + half + half / 2,
    by + bodyHeight / 2 + 4,
    twoSided ? elseText.slice(0, 20) : "∅ (nichts)",
    branchState === "else" && twoSided ? "lab-text-a" : "lab-text-muted",
    "middle",
  );
  return { svg, height: headerHeight + bodyHeight };
}

export function structWhile(
  x: number,
  y: number,
  w: number,
  condition: string,
  bodyHeight: number,
  renderBody: (bx: number, by: number, bw: number) => string,
  active: boolean,
  endless = false,
  headerHeight = 32,
  indent = 22,
): { svg: string; height: number } {
  const totalHeight = headerHeight + bodyHeight;
  const frameCls = endless ? "lab-bad" : active ? "lab-fill-a" : "lab-panel";
  // L-förmiger Rahmen durch äußeres Rechteck + Innenkörper
  let svg = rect(x, y, w, totalHeight, frameCls);
  svg += text(
    x + 10,
    y + 20,
    condition.slice(0, 36),
    endless ? "lab-text-bad" : "lab-text-small",
  );
  svg += renderBody(x + indent, y + headerHeight, w - indent);
  return { svg, height: totalHeight };
}
