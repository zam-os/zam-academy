import * as svg from "./svg";

export interface UmlCardSpec {
  x: number;
  y: number;
  w: number;
  title: string;
  attributes: string[];
  methods?: string[];
  /** True draws an object card (tinted header, optional highlight); false draws a class blueprint card. */
  isObject?: boolean;
  boxClass?: string;
}

/**
 * Draws an object card (Objektkarte) or class card (Klassenkarte) in uniform SVG geometry.
 */
export function umlCard(spec: UmlCardSpec): string {
  const { x, y, w, title, attributes, methods = [], isObject = false } = spec;
  const headerH = 26;
  const attrH = Math.max(1, attributes.length) * 18 + 10;
  const methH = methods.length > 0 ? methods.length * 18 + 10 : 0;
  const totalH = headerH + attrH + methH;
  const fillCls = spec.boxClass ?? (isObject ? "lab-fill-a" : "lab-panel");
  const headCls = isObject ? "lab-fill-a" : "lab-cell-sum";
  const parts = [
    svg.rect(x, y, w, totalH, fillCls, `rx="8"`),
    svg.rect(x, y, w, headerH, headCls, `rx="8"`),
    svg.line(x, y + headerH, x + w, y + headerH, "lab-ink"),
    svg.text(
      x + w / 2,
      y + 17,
      title,
      isObject ? "lab-text-a" : "lab-text",
      "middle",
    ),
  ];

  attributes.forEach((attr, idx) => {
    parts.push(svg.text(x + 10, y + headerH + 17 + idx * 18, attr, "lab-text-small"));
  });

  if (methods.length > 0) {
    const methY = y + headerH + attrH;
    parts.push(svg.line(x, methY, x + w, methY, "lab-thin"));
    methods.forEach((meth, idx) => {
      parts.push(svg.text(x + 10, methY + 17 + idx * 18, meth, "lab-text-muted"));
    });
  }

  return parts.join("");
}

/**
 * Draws a labelled containment arrow ("enthält") between two boxes or nodes.
 */
export function containmentArrow(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  label = "enthält",
  cls = "lab-side-a",
  ok = true,
): string {
  const arrowCls = ok ? cls : "lab-bad";
  const textCls = ok ? "lab-text-a" : "lab-text-bad";
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    svg.arrow(x1, y1, x2, y2, arrowCls, 2) +
    svg.rect(mx - 28, my - 10, 56, 18, "lab-panel", `rx="6"`) +
    svg.text(mx, my + 3, label, textCls, "middle")
  );
}

/**
 * Draws a tree node pill for hierarchical structures and file systems.
 */
export function treeNode(
  cx: number,
  cy: number,
  w: number,
  label: string,
  kind: "root" | "folder" | "leaf",
  active = false,
): string {
  const cls = active
    ? "lab-fill-ok"
    : kind === "root"
      ? "lab-fill-b"
      : kind === "folder"
        ? "lab-fill-a"
        : "lab-panel";
  const tCls = active ? "lab-text-ok" : "lab-text-small";
  const h = 26;
  const rx = kind === "leaf" ? 4 : 12;
  return (
    svg.rect(cx - w / 2, cy - h / 2, w, h, cls, `rx="${rx}"`) +
    svg.text(cx, cy + 4, label, tCls, "middle")
  );
}
