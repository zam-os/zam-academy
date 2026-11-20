import { line, rect, text, wrapText } from "./svg";

/**
 * Bausteine für Nassi-Shneiderman-Struktogramme im SVG.
 * Alle Farben kommen aus CSS-Klassen in styles.css für helles und dunkles Farbschema.
 */

function stackedText(
  x: number,
  centerY: number,
  lines: string[],
  cls: string,
  anchor: "start" | "middle" | "end",
  lineHeight = 13,
): string {
  return lines
    .map((ln, idx) =>
      text(x, centerY + 4 + (idx - (lines.length - 1) / 2) * lineHeight, ln, cls, anchor),
    )
    .join("");
}

export function structSequence(
  x: number,
  y: number,
  w: number,
  steps: string[],
  activeIdx = -1,
  rowHeight = 28,
): { svg: string; height: number } {
  const list = steps.length > 0 ? steps : ["(noch leer)"];
  const maxChars = Math.max(18, Math.floor((w - 20) / 6.2));
  let svg = "";
  list.forEach((step, idx) => {
    const ry = y + idx * rowHeight;
    const cls = idx === activeIdx ? "lab-fill-ok" : steps.length === 0 ? "lab-shape" : "lab-panel";
    svg += rect(x, ry, w, rowHeight, cls);
    svg += stackedText(
      x + 10,
      ry + rowHeight / 2,
      wrapText(step, maxChars),
      steps.length === 0 ? "lab-text-muted" : "lab-text-small",
      "start",
    );
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
  const maxCondChars = Math.max(20, Math.floor((w - 24) / 6.2));
  const condLines = wrapText(condition, maxCondChars);
  let svg = rect(x, y, w, headerHeight, "lab-panel");
  svg += line(x, y, x + half, y + headerHeight, "lab-line");
  svg += line(x + w, y, x + half, y + headerHeight, "lab-line");
  condLines.forEach((ln, idx) => {
    svg += text(x + half, y + 17 + idx * 12, ln, "lab-text-small", "middle");
  });
  svg += text(x + 8, y + headerHeight - 6, "wahr", branchState === "then" ? "lab-text-ok" : "lab-text-small");
  svg += text(x + w - 8, y + headerHeight - 6, "falsch", branchState === "else" ? "lab-text-a" : "lab-text-small", "end");

  const by = y + headerHeight;
  const leftCls = branchState === "then" ? "lab-fill-ok" : "lab-shape";
  const rightCls = branchState === "else" ? (twoSided ? "lab-fill-a" : "lab-panel") : "lab-shape";
  const maxBranchChars = Math.max(12, Math.floor((half - 14) / 6.2));

  svg += rect(x, by, half, bodyHeight, leftCls);
  svg += rect(x + half, by, half, bodyHeight, rightCls);
  svg += stackedText(
    x + half / 2,
    by + bodyHeight / 2,
    wrapText(thenText, maxBranchChars),
    branchState === "then" ? "lab-text-ok" : "lab-text-small",
    "middle",
  );
  svg += stackedText(
    x + half + half / 2,
    by + bodyHeight / 2,
    wrapText(twoSided ? elseText : "∅ (nichts)", maxBranchChars),
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
  const maxCondChars = Math.max(22, Math.floor((w - 20) / 6.2));
  // L-förmiger Rahmen durch äußeres Rechteck + Innenkörper
  let svg = rect(x, y, w, totalHeight, frameCls);
  wrapText(condition, maxCondChars).forEach((ln, idx) => {
    svg += text(x + 10, y + 20 + idx * 12, ln, endless ? "lab-text-bad" : "lab-text-small");
  });
  svg += renderBody(x + indent, y + headerHeight, w - indent);
  return { svg, height: totalHeight };
}
