/**
 * Small SVG builders the lab drawings share. Colours come from CSS classes
 * (styles.css, "lab-*"), so every drawing follows the light and dark theme.
 */

const W = 520;
const H = 340;

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function r1(value: number): string {
  return (Math.round(value * 10) / 10).toString();
}

export function open(label: string): string {
  return `<svg class="lab-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}" preserveAspectRatio="xMidYMid meet">`;
}

export function text(
  x: number,
  y: number,
  content: string,
  cls = "lab-text",
  anchor: "start" | "middle" | "end" = "start",
): string {
  return `<text x="${r1(x)}" y="${r1(y)}" class="${cls}" text-anchor="${anchor}">${esc(content)}</text>`;
}

export function circle(cx: number, cy: number, r: number, cls: string): string {
  return `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(Math.max(0, r))}" class="${cls}" />`;
}

export function rect(x: number, y: number, w: number, h: number, cls: string, extra = ""): string {
  const x0 = Math.min(x, x + w);
  const y0 = Math.min(y, y + h);
  return `<rect x="${r1(x0)}" y="${r1(y0)}" width="${r1(Math.abs(w))}" height="${r1(Math.abs(h))}" class="${cls}" ${extra}/>`;
}

export function arrow(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cls: string,
  width = 2.5,
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return "";
  const ux = dx / len;
  const uy = dy / len;
  const head = Math.min(10, len / 2);
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  const px = -uy * head * 0.5;
  const py = ux * head * 0.5;
  return (
    `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(bx)}" y2="${r1(by)}" class="${cls}" stroke-width="${width}" stroke-linecap="round" />` +
    `<polygon points="${r1(x2)},${r1(y2)} ${r1(bx + px)},${r1(by + py)} ${r1(bx - px)},${r1(by - py)}" class="${cls} lab-arrowhead" />`
  );
}
