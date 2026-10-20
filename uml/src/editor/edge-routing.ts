import type { UmlEdge, UmlNode } from "../model/uml-types";

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

/** Chord-axis distance between sibling label chips; exceeds the 22px chip height. */
const LABEL_STAGGER = 34;

export interface CalculateEdgeRoutingParams {
  edge: UmlEdge;
  srcNode: UmlNode;
  tgtNode: UmlNode;
  allEdges: UmlEdge[];
  edgeIndex?: number;
  startTrim?: number;
  endTrim?: number;
}

/**
 * Calculates the intersection point of a ray from a node's center towards a given point
 * with the node's rectangular bounding box.
 */
export function getNodeBoundaryPoint(node: UmlNode, towards: Point): Point {
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

  // Slide anchors directly along each exited face by a fixed pixel distance so marker
  // separation does not shrink as nodes move further apart.
  const computeFaceAnchor = (
    node: UmlNode,
    towards: Point,
    normal: Point,
    idxInDir: number,
    countInDir: number,
  ): Point => {
    const baseP = getNodeBoundaryPoint(node, towards);
    const hw = node.width / 2 + 2;
    const hh = node.height / 2 + 2;
    const dx = towards.x - (node.x + node.width / 2);
    const dy = towards.y - (node.y + node.height / 2);
    const scaleX = hw / Math.max(0.001, Math.abs(dx));
    const scaleY = hh / Math.max(0.001, Math.abs(dy));
    const isVerticalFace = scaleX <= scaleY;

    const availableHalfExtent = isVerticalFace
      ? Math.max(12, node.height / 2 - 4)
      : Math.max(12, node.width / 2 - 4);

    let offset: number;
    if (isOpposing) {
      if (countInDir <= 1) {
        offset = Math.min(availableHalfExtent - 2, 14);
      } else {
        const step = Math.min(
          16,
          Math.max(14, (availableHalfExtent - 8) / (countInDir - 1)),
        );
        offset = 8 + idxInDir * step;
      }
    } else {
      const maxStep = (2 * availableHalfExtent) / Math.max(1, countInDir);
      const step = Math.min(16, maxStep);
      const centeredIdx = idxInDir - (countInDir - 1) / 2;
      offset = centeredIdx * step;
    }

    const clampedShift = Math.max(
      -availableHalfExtent,
      Math.min(availableHalfExtent, offset),
    );

    if (isVerticalFace) {
      const dirY = normal.y < 0 ? -1 : 1;
      return { x: baseP.x, y: baseP.y + dirY * clampedShift };
    }
    const dirX = normal.x < 0 ? -1 : 1;
    return { x: baseP.x + dirX * clampedShift, y: baseP.y };
  };

  const p1 = computeFaceAnchor(
    srcNode,
    tgtCenter,
    n,
    forwardIdx,
    forwardEdges.length,
  );
  const p2 = computeFaceAnchor(
    tgtNode,
    srcCenter,
    n,
    forwardIdx,
    forwardEdges.length,
  );

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

  // Stagger labels along the chord so sibling chips never share a row: when the nodes are
  // stacked vertically the bows sit side by side and wide chips would collide. C projects
  // onto the chord midpoint, so the curve's chord projection is linear in t.
  const labelShift = isOpposing
    ? (forwardIdx + 0.5) * LABEL_STAGGER
    : (forwardIdx - (forwardEdges.length - 1) / 2) * LABEL_STAGGER;
  const t = Math.max(0.2, Math.min(0.8, 0.5 + labelShift / chordLen));
  const midX = (1 - t) ** 2 * p1.x + 2 * t * (1 - t) * C.x + t ** 2 * p2.x;
  const midY = (1 - t) ** 2 * p1.y + 2 * t * (1 - t) * C.y + t ** 2 * p2.y;

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
