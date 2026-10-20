import type { UmlDiagram, UmlEdgeKind, UmlNode } from "../model/uml-types";

/** Side of a lollipop or socket symbol its stick points to, i.e. towards its component. */
export type StickSide = "left" | "right" | "top" | "bottom";

/** How close a lollipop or socket must be dropped to a component's side to dock onto it. */
export const DOCK_DISTANCE = 30;
const TOUCH_TOLERANCE = 1;

/** Ball (lollipop) radius and socket arc radius, as drawn by the canvas. */
export const BALL_RADIUS = 11;
export const SOCKET_RADIUS = 13;

/** Edge kinds that tie a lollipop or socket to the component that owns it. */
const OWNER_EDGE_KINDS: Partial<Record<UmlNode["kind"], UmlEdgeKind>> = {
  "provided-interface": "realization",
  "required-interface": "dependency",
};

export function isBallOrSocket(node: UmlNode): boolean {
  return (
    node.kind === "provided-interface" || node.kind === "required-interface"
  );
}

// Ports are free-standing nodes that do not move with their component, so a symbol docked
// to one would be left behind; only components own lollipops and sockets.
const isOwner = (node: UmlNode) => node.kind === "component";

interface FacingGap {
  owner: UmlNode;
  side: StickSide;
  /** Distance between the facing sides; negative when the boxes overlap. */
  gap: number;
}

/**
 * The side of `owner` that `iface` sits next to, if the two boxes overlap along that side,
 * picking the one with the smallest gap.
 */
function facingGap(iface: UmlNode, owner: UmlNode): FacingGap | null {
  const overlapsY =
    Math.min(iface.y + iface.height, owner.y + owner.height) -
      Math.max(iface.y, owner.y) >
    0;
  const overlapsX =
    Math.min(iface.x + iface.width, owner.x + owner.width) -
      Math.max(iface.x, owner.x) >
    0;

  const candidates: FacingGap[] = [];
  if (overlapsY) {
    candidates.push(
      { owner, side: "left", gap: iface.x - (owner.x + owner.width) },
      { owner, side: "right", gap: owner.x - (iface.x + iface.width) },
    );
  }
  if (overlapsX) {
    candidates.push(
      { owner, side: "top", gap: iface.y - (owner.y + owner.height) },
      { owner, side: "bottom", gap: owner.y - (iface.y + iface.height) },
    );
  }

  let best: FacingGap | null = null;
  for (const c of candidates) {
    if (!best || Math.abs(c.gap) < Math.abs(best.gap)) best = c;
  }
  return best;
}

/** Lookup tables built once per diagram, so resolving every symbol stays linear. */
interface DockIndex {
  diagram: UmlDiagram;
  nodeById: Map<string, UmlNode>;
  owners: UmlNode[];
}

function buildIndex(diagram: UmlDiagram): DockIndex {
  return {
    diagram,
    nodeById: new Map(diagram.nodes.map((n) => [n.id, n])),
    owners: diagram.nodes.filter(isOwner),
  };
}

/** The component a realization (lollipop) or dependency (socket) ties `iface` to. */
function edgeOwner(iface: UmlNode, index: DockIndex): UmlNode | null {
  const ownerEdgeKind = OWNER_EDGE_KINDS[iface.kind];
  for (const edge of index.diagram.edges) {
    if (edge.kind !== ownerEdgeKind) continue;
    const otherId =
      edge.sourceId === iface.id
        ? edge.targetId
        : edge.targetId === iface.id
          ? edge.sourceId
          : null;
    const other = otherId ? index.nodeById.get(otherId) : undefined;
    if (other && isOwner(other)) return other;
  }
  return null;
}

/**
 * The component side `iface` faces within `maxGap` (any overlap counts), preferring the
 * component its edges tie it to so the drawing never contradicts the model.
 */
function closestFacingOwner(
  iface: UmlNode,
  index: DockIndex,
  maxGap: number,
  maxOverlap: number,
): FacingGap | null {
  const preferred = edgeOwner(iface, index);
  let best: FacingGap | null = null;
  for (const owner of index.owners) {
    const g = facingGap(iface, owner);
    if (!g || g.gap > maxGap || g.gap < -maxOverlap) continue;
    if (owner === preferred) return g;
    if (!best || Math.abs(g.gap) < Math.abs(best.gap)) best = g;
  }
  return best;
}

const touchingOwner = (iface: UmlNode, index: DockIndex) =>
  closestFacingOwner(iface, index, TOUCH_TOLERANCE, TOUCH_TOLERANCE);

function sideTowards(iface: UmlNode, owner: UmlNode): StickSide {
  const dx = owner.x + owner.width / 2 - (iface.x + iface.width / 2);
  const dy = owner.y + owner.height / 2 - (iface.y + iface.height / 2);
  // Compare against the combined half sizes so wide boxes side by side read as horizontal
  const nx = dx / ((owner.width + iface.width) / 2);
  const ny = dy / ((owner.height + iface.height) / 2);
  if (Math.abs(nx) >= Math.abs(ny)) return dx < 0 ? "left" : "right";
  return dy < 0 ? "top" : "bottom";
}

function resolveStickSide(iface: UmlNode, index: DockIndex): StickSide {
  const docked = touchingOwner(iface, index);
  if (docked) return docked.side;

  const linked = edgeOwner(iface, index);
  if (linked) return sideTowards(iface, linked);

  let nearest: UmlNode | null = null;
  let nearestDist = Infinity;
  for (const node of index.owners) {
    const d = Math.hypot(
      node.x + node.width / 2 - (iface.x + iface.width / 2),
      node.y + node.height / 2 - (iface.y + iface.height / 2),
    );
    if (d < nearestDist) {
      nearest = node;
      nearestDist = d;
    }
  }
  return nearest ? sideTowards(iface, nearest) : "left";
}

/**
 * Which way the stick of a lollipop or socket points: towards the component it is docked
 * to, else towards the component tied to it by a realization (lollipop) or dependency
 * (socket), else towards the nearest component. Defaults to the left.
 */
export function stickSide(iface: UmlNode, diagram: UmlDiagram): StickSide {
  return resolveStickSide(iface, buildIndex(diagram));
}

/** `stickSide` of every lollipop and socket in the diagram, by node id. */
export function stickSides(diagram: UmlDiagram): Map<string, StickSide> {
  const index = buildIndex(diagram);
  const sides = new Map<string, StickSide>();
  for (const node of diagram.nodes) {
    if (isBallOrSocket(node)) sides.set(node.id, resolveStickSide(node, index));
  }
  return sides;
}

/** Moves `iface` flush against the given side of `owner`. */
export function snapToSide(
  iface: UmlNode,
  owner: UmlNode,
  side: StickSide,
): void {
  if (side === "left") iface.x = owner.x + owner.width;
  else if (side === "right") iface.x = owner.x - iface.width;
  else if (side === "top") iface.y = owner.y + owner.height;
  else iface.y = owner.y - iface.height;
}

/**
 * Snaps a lollipop or socket flush against the side of the closest component it overlaps
 * or comes within `DOCK_DISTANCE` of. Returns whether it docked.
 */
export function dockInterface(iface: UmlNode, diagram: UmlDiagram): boolean {
  if (!isBallOrSocket(iface)) return false;
  const target = closestFacingOwner(
    iface,
    buildIndex(diagram),
    DOCK_DISTANCE,
    Infinity,
  );
  if (!target) return false;
  snapToSide(iface, target.owner, target.side);
  return true;
}

/** Lollipops and sockets docked to `owner`, with the side they are docked on. */
export function dockedInterfaces(
  owner: UmlNode,
  diagram: UmlDiagram,
): { node: UmlNode; side: StickSide }[] {
  if (!isOwner(owner)) return [];
  const index = buildIndex(diagram);
  const docked: { node: UmlNode; side: StickSide }[] = [];
  for (const node of diagram.nodes) {
    if (!isBallOrSocket(node)) continue;
    const touching = touchingOwner(node, index);
    if (touching?.owner === owner) docked.push({ node, side: touching.side });
  }
  return docked;
}

/**
 * Where an edge meets a lollipop or socket: on a circle around the drawn ball or socket
 * rather than on the symbol's (mostly empty) box.
 */
export function ballOrSocketBoundaryPoint(
  node: UmlNode,
  towards: { x: number; y: number },
): { x: number; y: number } {
  const cx = node.x + node.width / 2;
  const cy = node.y + node.height / 2;
  const r =
    (node.kind === "provided-interface" ? BALL_RADIUS : SOCKET_RADIUS) + 2;
  const dx = towards.x - cx;
  const dy = towards.y - cy;
  const len = Math.hypot(dx, dy);
  if (len < 0.001) return { x: cx, y: cy };
  return { x: cx + (dx / len) * r, y: cy + (dy / len) * r };
}
