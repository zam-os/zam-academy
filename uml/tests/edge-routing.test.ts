import { describe, expect, it } from "vitest";
import { calculateEdgeRouting } from "../src/editor/edge-routing";
import type { UmlEdge, UmlNode } from "../src/model/uml-types";

describe("UML Edge Routing & Multi-Transition Separation", () => {
  const createMockState = (
    id: string,
    name: string,
    x: number,
    y: number,
    width = 140,
    height = 80,
  ): UmlNode => ({
    id,
    kind: "state",
    name,
    x,
    y,
    width,
    height,
    attributes: [],
    operations: [],
  });

  const createMockEdge = (
    id: string,
    sourceId: string,
    targetId: string,
    label?: string,
  ): UmlEdge => ({
    id,
    kind: "transition",
    sourceId,
    targetId,
    label,
  });

  it("gracefully curves transitions between two states in opposite directions (hin und zurück) without overlap", () => {
    // Mimicking lesson 4.4 Packstation: "Frei" and "Belegt" side-by-side
    const nodeFrei = createMockState("node-frei", "Frei", 480, 180, 140, 80);
    const nodeBelegt = createMockState("node-belegt", "Belegt", 780, 180, 140, 80);

    const edgeForward = createMockEdge(
      "edge-forward",
      "node-frei",
      "node-belegt",
      "ereignis [Bedingung] / aktion()",
    );
    const edgeBackward = createMockEdge(
      "edge-backward",
      "node-belegt",
      "node-frei",
      "ereignis [Bedingung] / aktion()",
    );

    const allEdges = [edgeForward, edgeBackward];

    const routingForward = calculateEdgeRouting({
      edge: edgeForward,
      srcNode: nodeFrei,
      tgtNode: nodeBelegt,
      allEdges,
      startTrim: 0,
      endTrim: 0,
    });

    const routingBackward = calculateEdgeRouting({
      edge: edgeBackward,
      srcNode: nodeBelegt,
      tgtNode: nodeFrei,
      allEdges,
      startTrim: 0,
      endTrim: 0,
    });

    // Both edges must be curved
    expect(routingForward.isCurved).toBe(true);
    expect(routingBackward.isCurved).toBe(true);

    // Both paths must use quadratic Bézier 'Q'
    expect(routingForward.pathD).toContain("Q");
    expect(routingBackward.pathD).toContain("Q");

    // The two paths must not be identical or overlapping
    expect(routingForward.pathD).not.toEqual(routingBackward.pathD);
    expect(routingForward.hitD).not.toEqual(routingBackward.hitD);

    // For horizontally arranged states:
    // Forward (Frei -> Belegt, left-to-right) curves upward (smaller Y)
    // Backward (Belegt -> Frei, right-to-left) curves downward (larger Y)
    const centerY = nodeFrei.y + nodeFrei.height / 2;
    expect(routingForward.midY).toBeLessThan(centerY);
    expect(routingBackward.midY).toBeGreaterThan(centerY);

    // There must be a substantial distance between the label midpoints (at least 60px)
    const labelDistance = routingBackward.midY - routingForward.midY;
    expect(labelDistance).toBeGreaterThan(60);

    // The boundary attachment points on both nodes must be separated so arrowheads don't collide
    const freiSeparation = Math.abs(routingForward.p1.y - routingBackward.p2.y);
    const belegtSeparation = Math.abs(routingForward.p2.y - routingBackward.p1.y);
    expect(freiSeparation).toBeGreaterThan(15);
    expect(belegtSeparation).toBeGreaterThan(15);
  });

  it("keeps a single transition between two states as a clean straight line", () => {
    const nodeA = createMockState("node-a", "StateA", 100, 200, 120, 60);
    const nodeB = createMockState("node-b", "StateB", 400, 200, 120, 60);
    const edge = createMockEdge("edge-single", "node-a", "node-b");

    const routing = calculateEdgeRouting({
      edge,
      srcNode: nodeA,
      tgtNode: nodeB,
      allEdges: [edge],
    });

    expect(routing.isCurved).toBe(false);
    expect(routing.pathD).toContain("L");
    expect(routing.pathD).not.toContain("Q");
    expect(routing.pathD).not.toContain("C");
  });

  it("separates multiple transitions in the same direction symmetrically", () => {
    const nodeA = createMockState("node-a", "A", 100, 200, 120, 60);
    const nodeB = createMockState("node-b", "B", 400, 200, 120, 60);

    const edge1 = createMockEdge("e1", "node-a", "node-b", "trigger1");
    const edge2 = createMockEdge("e2", "node-a", "node-b", "trigger2");
    const allEdges = [edge1, edge2];

    const r1 = calculateEdgeRouting({
      edge: edge1,
      srcNode: nodeA,
      tgtNode: nodeB,
      allEdges,
    });
    const r2 = calculateEdgeRouting({
      edge: edge2,
      srcNode: nodeA,
      tgtNode: nodeB,
      allEdges,
    });

    expect(r1.isCurved).toBe(true);
    expect(r2.isCurved).toBe(true);

    // One curves to one side, the other to the opposite side
    const centerY = nodeA.y + nodeA.height / 2;
    expect(
      (r1.midY < centerY && r2.midY > centerY) ||
      (r1.midY > centerY && r2.midY < centerY)
    ).toBe(true);

    expect(Math.abs(r1.midY - r2.midY)).toBeGreaterThan(40);
  });

  it("renders a self-loop when source and target are the same node", () => {
    const node = createMockState("node-self", "LoopingState", 200, 200, 140, 80);
    const edge = createMockEdge("edge-loop", "node-self", "node-self", "tick / doWork()");

    const routing = calculateEdgeRouting({
      edge,
      srcNode: node,
      tgtNode: node,
      allEdges: [edge],
    });

    expect(routing.isCurved).toBe(true);
    expect(routing.isSelfLoop).toBe(true);
    expect(routing.pathD).toContain("C");
    // Midpoint of loop label should be above the node
    expect(routing.midY).toBeLessThan(node.y);
  });

  it("renders sequence lifelines as horizontal messages at ordered slots", () => {
    const lifelineA: UmlNode = {
      id: "life-1",
      kind: "lifeline",
      name: ":Client",
      x: 100,
      y: 50,
      width: 100,
      height: 300,
      attributes: [],
      operations: [],
    };
    const lifelineB: UmlNode = {
      id: "life-2",
      kind: "lifeline",
      name: ":Server",
      x: 300,
      y: 50,
      width: 100,
      height: 300,
      attributes: [],
      operations: [],
    };

    const edge: UmlEdge = {
      id: "msg-1",
      kind: "sync-message",
      sourceId: "life-1",
      targetId: "life-2",
      label: "request()",
      sequenceOrder: 1,
    };

    const routing = calculateEdgeRouting({
      edge,
      srcNode: lifelineA,
      tgtNode: lifelineB,
      allEdges: [edge],
    });

    expect(routing.isCurved).toBe(false);
    expect(routing.p1.y).toEqual(routing.p2.y);
    expect(routing.p1.x).toBeLessThan(routing.p2.x);
  });

  it("separates vertically stacked states in opposite directions horizontally", () => {
    const topState = createMockState("top", "Top", 300, 100, 140, 80);
    const bottomState = createMockState("bottom", "Bottom", 300, 400, 140, 80);

    const downEdge = createMockEdge("down", "top", "bottom", "goDown()");
    const upEdge = createMockEdge("up", "bottom", "top", "goUp()");
    const allEdges = [downEdge, upEdge];

    const rDown = calculateEdgeRouting({
      edge: downEdge,
      srcNode: topState,
      tgtNode: bottomState,
      allEdges,
    });
    const rUp = calculateEdgeRouting({
      edge: upEdge,
      srcNode: bottomState,
      tgtNode: topState,
      allEdges,
    });

    expect(rDown.isCurved).toBe(true);
    expect(rUp.isCurved).toBe(true);

    const centerX = topState.x + topState.width / 2;
    // Downwards (top-to-bottom) curves rightward (larger X) in clockwise flow
    expect(rDown.midX).toBeGreaterThan(centerX);
    // Upwards (bottom-to-top) curves leftward (smaller X)
    expect(rUp.midX).toBeLessThan(centerX);
    expect(rDown.midX - rUp.midX).toBeGreaterThan(60);
  });

  it("handles 3 transitions between two nodes without any of them overlapping", () => {
    const nodeA = createMockState("a", "A", 100, 200, 120, 60);
    const nodeB = createMockState("b", "B", 500, 200, 120, 60);

    const e1 = createMockEdge("e1", "a", "b", "forward1");
    const e2 = createMockEdge("e2", "a", "b", "forward2");
    const e3 = createMockEdge("e3", "b", "a", "return");
    const allEdges = [e1, e2, e3];

    const r1 = calculateEdgeRouting({ edge: e1, srcNode: nodeA, tgtNode: nodeB, allEdges });
    const r2 = calculateEdgeRouting({ edge: e2, srcNode: nodeA, tgtNode: nodeB, allEdges });
    const r3 = calculateEdgeRouting({ edge: e3, srcNode: nodeB, tgtNode: nodeA, allEdges });

    // All 3 must have distinct midpoints (label positions)
    const midYs = [r1.midY, r2.midY, r3.midY];
    expect(new Set(midYs).size).toBe(3);

    // e1 and e2 are above center line, e3 is below center line
    const centerY = nodeA.y + nodeA.height / 2;
    expect(r1.midY).toBeLessThan(centerY);
    expect(r2.midY).toBeLessThan(r1.midY); // e2 curves further out
    expect(r3.midY).toBeGreaterThan(centerY);
  });

  it("separates multiple self-loops with distinct anchors and non-overlapping label chips", () => {
    const node = createMockState("node-self", "LoopingState", 200, 200, 140, 80);
    const edge1 = createMockEdge("loop-1", "node-self", "node-self", "tick1");
    const edge2 = createMockEdge("loop-2", "node-self", "node-self", "tick2");
    const allEdges = [edge1, edge2];

    const r1 = calculateEdgeRouting({
      edge: edge1,
      srcNode: node,
      tgtNode: node,
      allEdges,
    });
    const r2 = calculateEdgeRouting({
      edge: edge2,
      srcNode: node,
      tgtNode: node,
      allEdges,
    });

    expect(r1.isSelfLoop).toBe(true);
    expect(r2.isSelfLoop).toBe(true);

    // Anchors must be separated by more than marker extent (>14px)
    expect(Math.abs(r1.p1.x - r2.p1.x)).toBeGreaterThanOrEqual(14);
    expect(Math.abs(r1.p2.x - r2.p2.x)).toBeGreaterThanOrEqual(14);

    // Label midpoints must have vertical separation greater than label chip height (22px)
    expect(Math.abs(r1.midY - r2.midY)).toBeGreaterThan(22);
  });

  it("maintains anchor separation above marker extent (>14px) for far opposing states", () => {
    for (const dist of [600, 900, 1400]) {
      const nodeA = createMockState("a", "A", 100, 200, 140, 80);
      const nodeB = createMockState("b", "B", 100 + dist, 200, 140, 80);

      const fwd = createMockEdge("fwd", "a", "b");
      const rev = createMockEdge("rev", "b", "a");
      const allEdges = [fwd, rev];

      const rFwd = calculateEdgeRouting({ edge: fwd, srcNode: nodeA, tgtNode: nodeB, allEdges });
      const rRev = calculateEdgeRouting({ edge: rev, srcNode: nodeB, tgtNode: nodeA, allEdges });

      // Anchor separation on node A and node B faces must stay >= 14px
      const sepA = Math.abs(rFwd.p1.y - rRev.p2.y);
      const sepB = Math.abs(rFwd.p2.y - rRev.p1.y);
      expect(sepA).toBeGreaterThanOrEqual(14);
      expect(sepB).toBeGreaterThanOrEqual(14);
    }
  });

  it("separates anchors for same-direction edges that share a reverse edge", () => {
    const nodeA = createMockState("a", "A", 100, 200, 120, 60);
    const nodeB = createMockState("b", "B", 400, 200, 120, 60);

    const e1 = createMockEdge("e1", "a", "b", "fwd1");
    const e2 = createMockEdge("e2", "a", "b", "fwd2");
    const e3 = createMockEdge("e3", "b", "a", "rev");
    const allEdges = [e1, e2, e3];

    const r1 = calculateEdgeRouting({ edge: e1, srcNode: nodeA, tgtNode: nodeB, allEdges });
    const r2 = calculateEdgeRouting({ edge: e2, srcNode: nodeA, tgtNode: nodeB, allEdges });
    const r3 = calculateEdgeRouting({ edge: e3, srcNode: nodeB, tgtNode: nodeA, allEdges });

    // Distance between adjacent forward anchors on node A face
    expect(Math.abs(r1.p1.y - r2.p1.y)).toBeGreaterThanOrEqual(14);
    // Distance between forward and reverse anchors on node A face
    expect(Math.abs(r1.p1.y - r3.p2.y)).toBeGreaterThanOrEqual(14);
    expect(Math.abs(r2.p1.y - r3.p2.y)).toBeGreaterThanOrEqual(14);
  });

  it("calculates incoming tangent angles and trims for target and source markers", () => {
    const nodeA = createMockState("a", "A", 100, 200, 120, 60);
    const nodeB = createMockState("b", "B", 400, 200, 120, 60);

    const edge1 = createMockEdge("e1", "a", "b");
    const edge2 = createMockEdge("e2", "b", "a");

    const r = calculateEdgeRouting({
      edge: edge1,
      srcNode: nodeA,
      tgtNode: nodeB,
      allEdges: [edge1, edge2],
      startTrim: 16,
      endTrim: 14,
    });

    // Tangent angle degrees must be finite numbers
    expect(Number.isFinite(r.degStart)).toBe(true);
    expect(Number.isFinite(r.degEnd)).toBe(true);

    // Trimming should shorten the line start and end relative to boundary points
    expect(r.lineStart.x).toBeGreaterThan(r.p1.x);
    expect(r.lineEnd.x).toBeLessThan(r.p2.x);
  });
});
