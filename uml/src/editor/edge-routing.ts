import type { UmlEdge, UmlNode } from "../model/uml-types";
import { ballOrSocketBoundaryPoint, isBallOrSocket } from "./interface-docking";

export interface Point {
  x: number;
  y: number;
}

export interface EdgeRoutingResult {
  /** SVG path d-string for the visible styled line */
  pathD: string;
  /** SVG path d-string for the invisible wide hitarea */
  hitD: string;
  /** Exact anchor point on the source node boundary */
  p1: Point;
  /** Exact anchor point on the target node boundary */
  p2: Point;
  /** Start point of stroke, trimmed for source marker (diamonds) */
  lineStart: Point;
  /** End point of stroke, trimmed for target marker (triangles) */
  lineEnd: Point;
  /** Outgoing tangent angle in degrees at source */
  degStart: number;
  /** Incoming tangent angle in degrees at target */
  degEnd: number;
  /** Outgoing tangent angle in radians at source */
  angleStart: number;
  /** Incoming tangent angle in radians at target */
  angleEnd: number;
  /** Center point where the edge label / guard is positioned */
  midX: number;
  midY: number;
  /** True if the edge is rendered as a curved quadratic / cubic arc */
  isCurved: boolean;
  /** True if this is a transition / edge from a node to itself */
  isSelfLoop: boolean;
  /** Optional quadratic control point for two-node curves */
  controlPoint?: Point;
}

/** Height of the label chip the canvas draws. */
const LABEL_CHIP_HEIGHT = 22;
/** Minimum on-face spacing between neighbouring anchors; exceeds the 14px marker extent. */
const ANCHOR_GAP = 16;
/** Slide of the first anchor per direction when transitions run both ways. */
const OPPOSING_ANCHOR_OFFSET = 14;

export interface CalculateEdgeRoutingParams {
  edge: UmlEdge;
  srcNode: UmlNode;
  tgtNode: UmlNode;
  allEdges: UmlEdge[];
  edgeIndex?: number;
  startTrim?: number;
  endTrim?: number;
  /** Width of the label chip drawn for an edge, or 0 when it has none. */
  labelWidthOf?: (edge: UmlEdge) => number;
}

interface PairCurve {
  p1: Point;
  p2: Point;
  C: Point;
}

/**
 * Anchors and quadratic control point of one transition between two distinct nodes that
 * share several transitions (`pairEdges`, in diagram order).
 */
function computePairCurve(
  edge: UmlEdge,
  srcNode: UmlNode,
  tgtNode: UmlNode,
  pairEdges: UmlEdge[],
): PairCurve {
  const srcCenter: Point = {
    x: srcNode.x + srcNode.width / 2,
    y: srcNode.y + srcNode.height / 2,
  };
  const tgtCenter: Point = {
    x: tgtNode.x + tgtNode.width / 2,
    y: tgtNode.y + tgtNode.height / 2,
  };

  const forwardEdges = pairEdges.filter(
    (e) => e.sourceId === edge.sourceId && e.targetId === edge.targetId,
  );
  const reverseEdges = pairEdges.filter(
    (e) => e.sourceId === edge.targetId && e.targetId === edge.sourceId,
  );
  const forwardIdx = Math.max(0, forwardEdges.indexOf(edge));

  const centerDx = tgtCenter.x - srcCenter.x;
  const centerDy = tgtCenter.y - srcCenter.y;
  const centerDist = Math.max(1, Math.hypot(centerDx, centerDy));
  const u: Point = { x: centerDx / centerDist, y: centerDy / centerDist };
  // Unit normal pointing to the visual left of travel in SVG screen coordinates (where Y increases downwards)
  const n: Point = { x: u.y, y: -u.x };

  let curveOffset: number;
  const isOpposing = reverseEdges.length > 0;

  if (isOpposing) {
    const baseCurve = Math.max(34, Math.min(50, centerDist * 0.22));
    curveOffset = baseCurve + forwardIdx * 30;
  } else {
    const count = forwardEdges.length;
    const centeredIdx = forwardIdx - (count - 1) / 2;
    const step = Math.max(28, Math.min(42, centerDist * 0.18));
    curveOffset = centeredIdx * step * 1.6;
  }

  // Desired slide of each anchor from the ray hit, in pixels along the exited face. Fixed
  // pixel offsets keep marker separation from shrinking as nodes move further apart.
  const desiredOffsets = (count: number): number[] =>
    Array.from({ length: count }, (_, i) =>
      isOpposing
        ? OPPOSING_ANCHOR_OFFSET + i * ANCHOR_GAP
        : (i - (count - 1) / 2) * ANCHOR_GAP,
    );

  // Lays out every transition of the pair on this face together (forward edges slide to the
  // normal side, reverse edges to the other), so both directions agree on the slots. The
  // slots are shifted to stay on the face, or spread evenly when they do not fit.
  const computeFaceAnchor = (
    node: UmlNode,
    towards: Point,
    normal: Point,
  ): Point => {
    const baseP = getNodeBoundaryPoint(node, towards);
    // A lollipop or socket has no face to spread anchors along
    if (isBallOrSocket(node)) return baseP;
    const hw = node.width / 2 + 2;
    const hh = node.height / 2 + 2;
    const cx = node.x + node.width / 2;
    const cy = node.y + node.height / 2;
    const scaleX = hw / Math.max(0.001, Math.abs(towards.x - cx));
    const scaleY = hh / Math.max(0.001, Math.abs(towards.y - cy));
    const isVerticalFace = scaleX <= scaleY;

    // Keep 6px clear of the corners, but never reach past the drawn (2px expanded) face
    const faceHalf = (isVerticalFace ? node.height : node.width) / 2;
    const availableHalfExtent = Math.min(
      faceHalf + 2,
      Math.max(12, faceHalf - 4),
    );
    const faceCenter = isVerticalFace ? cy : cx;
    const lo = faceCenter - availableHalfExtent;
    const hi = faceCenter + availableHalfExtent;
    const base = isVerticalFace ? baseP.y : baseP.x;
    const dir = (isVerticalFace ? normal.y : normal.x) < 0 ? -1 : 1;

    const slots = [
      ...desiredOffsets(forwardEdges.length).map((o, i) => ({
        pos: base + dir * o,
        mine: i === forwardIdx,
      })),
      ...desiredOffsets(reverseEdges.length).map((o) => ({
        pos: base - dir * o,
        mine: false,
      })),
    ].sort((a, b) => a.pos - b.pos);
    const rank = Math.max(
      0,
      slots.findIndex((s) => s.mine),
    );
    const first = slots[0].pos;
    const last = slots[slots.length - 1].pos;

    let pos: number;
    if (last - first > hi - lo) {
      pos = lo + (rank * (hi - lo)) / Math.max(1, slots.length - 1);
    } else {
      pos = slots[rank].pos + Math.max(lo - first, Math.min(0, hi - last));
    }

    return isVerticalFace ? { x: baseP.x, y: pos } : { x: pos, y: baseP.y };
  };

  const p1 = computeFaceAnchor(srcNode, tgtCenter, n);
  const p2 = computeFaceAnchor(tgtNode, srcCenter, n);

  const chordMid: Point = {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
  const chordDx = p2.x - p1.x;
  const chordDy = p2.y - p1.y;
  const chordLen = Math.max(1, Math.hypot(chordDx, chordDy));
  const chordNormal: Point = {
    x: chordDy / chordLen,
    y: -chordDx / chordLen,
  };

  // Quadratic Bézier control point: apex of curve at t = 0.5 is chordMid + chordNormal * curveOffset
  const C: Point = {
    x: chordMid.x + chordNormal.x * (curveOffset * 2),
    y: chordMid.y + chordNormal.y * (curveOffset * 2),
  };

  return { p1, p2, C };
}

/** Where along its curve a label may sit, most preferred first. */
const LABEL_CANDIDATE_TS = [0.5, 0.38, 0.62, 0.28, 0.72, 0.2, 0.8];
/** Clearance kept between neighbouring label chips. */
const LABEL_CHIP_GAP = 4;

/** Width of the label chip the canvas draws for `text`. */
export function labelChipWidth(text: string): number {
  return Math.max(54, text.length * 7 + 16);
}

function defaultLabelWidth(edge: UmlEdge): number {
  const text = [
    edge.stereotype ? `«${edge.stereotype}»` : "",
    edge.guard ? `[${edge.guard}]` : "",
    edge.label ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  return text ? labelChipWidth(text) : 0;
}

const pointOnQuad = (c: PairCurve, t: number): Point => ({
  x: (1 - t) ** 2 * c.p1.x + 2 * t * (1 - t) * c.C.x + t ** 2 * c.p2.x,
  y: (1 - t) ** 2 * c.p1.y + 2 * t * (1 - t) * c.C.y + t ** 2 * c.p2.y,
});

/**
 * Places the labels of all transitions between two nodes together, in diagram order, so
 * every call agrees on the layout. Each label slides along its own curve to the first
 * candidate whose chip clears the chips placed before it, or to the least overlapping one.
 */
function placePairLabel(
  edge: UmlEdge,
  srcNode: UmlNode,
  tgtNode: UmlNode,
  pairEdges: UmlEdge[],
  labelWidthOf: (edge: UmlEdge) => number,
): Point {
  const placed: { x: number; y: number; w: number }[] = [];
  let own: Point | undefined;

  for (const e of pairEdges) {
    const from = e.sourceId === srcNode.id ? srcNode : tgtNode;
    const to = from === srcNode ? tgtNode : srcNode;
    const curve = computePairCurve(e, from, to, pairEdges);
    const w = labelWidthOf(e);

    let best = pointOnQuad(curve, 0.5);
    if (w > 0) {
      let bestOverlap = Infinity;
      for (const t of LABEL_CANDIDATE_TS) {
        const p = pointOnQuad(curve, t);
        let overlap = 0;
        for (const q of placed) {
          const ox = (w + q.w) / 2 + LABEL_CHIP_GAP - Math.abs(p.x - q.x);
          const oy = LABEL_CHIP_HEIGHT + LABEL_CHIP_GAP - Math.abs(p.y - q.y);
          if (ox > 0 && oy > 0) overlap += ox * oy;
        }
        if (overlap < bestOverlap) {
          bestOverlap = overlap;
          best = p;
        }
        if (overlap === 0) break;
      }
      placed.push({ ...best, w });
    }

    if (e === edge) own = best;
  }

  return (
    own ?? pointOnQuad(computePairCurve(edge, srcNode, tgtNode, pairEdges), 0.5)
  );
}

/**
 * Calculates the intersection point of a ray from a node's center towards a given point
 * with the node's rectangular bounding box, or with the drawn ball or socket of a
 * lollipop or socket.
 */
export function getNodeBoundaryPoint(node: UmlNode, towards: Point): Point {
  if (isBallOrSocket(node)) return ballOrSocketBoundaryPoint(node, towards);

  const cx = node.x + node.width / 2;
  const cy = node.y + node.height / 2;
  const dx = towards.x - cx;
  const dy = towards.y - cy;

  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
    return { x: cx, y: cy };
  }

  const hw = node.width / 2 + 2;
  const hh = node.height / 2 + 2;
  const scaleX = hw / Math.max(0.001, Math.abs(dx));
  const scaleY = hh / Math.max(0.001, Math.abs(dy));
  const scale = Math.min(scaleX, scaleY);

  return {
    x: cx + dx * scale,
    y: cy + dy * scale,
  };
}

/**
 * Calculates geometry (anchor points, path strings, marker rotations, and label position)
 * for an edge. Bends parallel, opposing, or self-transitions onto Bézier curves so
 * strokes, markers, and labels remain separated.
 */
export function calculateEdgeRouting({
  edge,
  srcNode,
  tgtNode,
  allEdges,
  edgeIndex = 0,
  startTrim = 0,
  endTrim = 0,
  labelWidthOf = defaultLabelWidth,
}: CalculateEdgeRoutingParams): EdgeRoutingResult {
  const isLifelinePair =
    (srcNode.kind === "lifeline" || srcNode.kind === "actor-lifeline") &&
    (tgtNode.kind === "lifeline" || tgtNode.kind === "actor-lifeline");

  if (isLifelinePair) {
    const order = edge.sequenceOrder ?? edgeIndex + 1;
    const ySlot = Math.min(
      srcNode.y + srcNode.height - 25,
      srcNode.y + 88 + (order - 1) * 52,
    );
    const srcCx = srcNode.x + srcNode.width / 2;
    const tgtCx = tgtNode.x + tgtNode.width / 2;
    const dir = tgtCx >= srcCx ? 1 : -1;
    const p1: Point = { x: srcCx + dir * 7, y: ySlot };
    const p2: Point = { x: tgtCx - dir * 7, y: ySlot };

    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const deg = (angle * 180) / Math.PI;

    const lineStart: Point = {
      x: p1.x + Math.cos(angle) * startTrim,
      y: p1.y + Math.sin(angle) * startTrim,
    };
    const lineEnd: Point = {
      x: p2.x - Math.cos(angle) * endTrim,
      y: p2.y - Math.sin(angle) * endTrim,
    };

    return {
      pathD: `M ${lineStart.x} ${lineStart.y} L ${lineEnd.x} ${lineEnd.y}`,
      hitD: `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`,
      p1,
      p2,
      lineStart,
      lineEnd,
      degStart: deg,
      degEnd: deg,
      angleStart: angle,
      angleEnd: angle,
      midX: (p1.x + p2.x) / 2,
      midY: (p1.y + p2.y) / 2,
      isCurved: false,
      isSelfLoop: false,
    };
  }

  if (srcNode.id === tgtNode.id) {
    const selfLoops = allEdges.filter(
      (e) => e.sourceId === srcNode.id && e.targetId === srcNode.id,
    );
    const loopIdx = Math.max(0, selfLoops.indexOf(edge));
    const w = srcNode.width;
    const p1: Point = {
      x: srcNode.x + Math.max(8, w * 0.38 - loopIdx * 18),
      y: srcNode.y,
    };
    const p2: Point = {
      x: srcNode.x + Math.min(w - 8, w * 0.68 + loopIdx * 18),
      y: srcNode.y,
    };

    const loopH = 46 + loopIdx * 38;
    const spreadW = 14 + loopIdx * 10;
    const c1: Point = { x: p1.x - spreadW, y: srcNode.y - loopH };
    const c2: Point = { x: p2.x + spreadW, y: srcNode.y - loopH };

    const angleStart = Math.atan2(c1.y - p1.y, c1.x - p1.x);
    const angleEnd = Math.atan2(p2.y - c2.y, p2.x - c2.x);
    const degStart = (angleStart * 180) / Math.PI;
    const degEnd = (angleEnd * 180) / Math.PI;

    const lineStart: Point = {
      x: p1.x + Math.cos(angleStart) * startTrim,
      y: p1.y + Math.sin(angleStart) * startTrim,
    };
    const lineEnd: Point = {
      x: p2.x - Math.cos(angleEnd) * endTrim,
      y: p2.y - Math.sin(angleEnd) * endTrim,
    };

    const midX = 0.125 * p1.x + 0.375 * c1.x + 0.375 * c2.x + 0.125 * p2.x;
    const midY = 0.125 * p1.y + 0.375 * c1.y + 0.375 * c2.y + 0.125 * p2.y;

    return {
      pathD: `M ${lineStart.x} ${lineStart.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${lineEnd.x} ${lineEnd.y}`,
      hitD: `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`,
      p1,
      p2,
      lineStart,
      lineEnd,
      degStart,
      degEnd,
      angleStart,
      angleEnd,
      midX,
      midY,
      isCurved: true,
      isSelfLoop: true,
    };
  }

  const pairEdges = allEdges.filter(
    (e) =>
      (e.sourceId === srcNode.id && e.targetId === tgtNode.id) ||
      (e.sourceId === tgtNode.id && e.targetId === srcNode.id),
  );

  const srcCenter: Point = {
    x: srcNode.x + srcNode.width / 2,
    y: srcNode.y + srcNode.height / 2,
  };
  const tgtCenter: Point = {
    x: tgtNode.x + tgtNode.width / 2,
    y: tgtNode.y + tgtNode.height / 2,
  };

  if (pairEdges.length <= 1) {
    const p1 = getNodeBoundaryPoint(srcNode, tgtCenter);
    const p2 = getNodeBoundaryPoint(tgtNode, srcCenter);

    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const deg = (angle * 180) / Math.PI;

    const lineStart: Point = {
      x: p1.x + Math.cos(angle) * startTrim,
      y: p1.y + Math.sin(angle) * startTrim,
    };
    const lineEnd: Point = {
      x: p2.x - Math.cos(angle) * endTrim,
      y: p2.y - Math.sin(angle) * endTrim,
    };

    return {
      pathD: `M ${lineStart.x} ${lineStart.y} L ${lineEnd.x} ${lineEnd.y}`,
      hitD: `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`,
      p1,
      p2,
      lineStart,
      lineEnd,
      degStart: deg,
      degEnd: deg,
      angleStart: angle,
      angleEnd: angle,
      midX: (p1.x + p2.x) / 2,
      midY: (p1.y + p2.y) / 2,
      isCurved: false,
      isSelfLoop: false,
    };
  }

  const { p1, p2, C } = computePairCurve(edge, srcNode, tgtNode, pairEdges);

  const angleStart = Math.atan2(C.y - p1.y, C.x - p1.x);
  const angleEnd = Math.atan2(p2.y - C.y, p2.x - C.x);
  const degStart = (angleStart * 180) / Math.PI;
  const degEnd = (angleEnd * 180) / Math.PI;

  const lineStart: Point = {
    x: p1.x + Math.cos(angleStart) * startTrim,
    y: p1.y + Math.sin(angleStart) * startTrim,
  };
  const lineEnd: Point = {
    x: p2.x - Math.cos(angleEnd) * endTrim,
    y: p2.y - Math.sin(angleEnd) * endTrim,
  };

  const { x: midX, y: midY } = placePairLabel(
    edge,
    srcNode,
    tgtNode,
    pairEdges,
    labelWidthOf,
  );

  return {
    pathD: `M ${lineStart.x} ${lineStart.y} Q ${C.x} ${C.y} ${lineEnd.x} ${lineEnd.y}`,
    hitD: `M ${p1.x} ${p1.y} Q ${C.x} ${C.y} ${p2.x} ${p2.y}`,
    p1,
    p2,
    lineStart,
    lineEnd,
    degStart,
    degEnd,
    angleStart,
    angleEnd,
    midX,
    midY,
    isCurved: true,
    isSelfLoop: false,
    controlPoint: C,
  };
}
