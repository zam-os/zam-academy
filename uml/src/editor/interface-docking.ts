import type { UmlDiagram, UmlEdgeKind, UmlNode } from "../model/uml-types";

/** Side of a lollipop or socket symbol its stick points to, i.e. towards its component. */
export type StickSide = "left" | "right" | "top" | "bottom";

/** How close a lollipop or socket must be dropped to a component's side to dock onto it. */
export const DOCK_DISTANCE = 30;
const TOUCH_TOLERANCE = 1;

const OWNER_KINDS = new Set<UmlNode["kind"]>(["component", "port"]);

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

function closestFacingOwner(
  iface: UmlNode,
  diagram: UmlDiagram,
  maxGap: number,
): FacingGap | null {
  let best: FacingGap | null = null;
  for (const node of diagram.nodes) {
    if (node.id === iface.id || !OWNER_KINDS.has(node.kind)) continue;
    const g = facingGap(iface, node);
    if (!g || Math.abs(g.gap) > maxGap) continue;
    if (!best || Math.abs(g.gap) < Math.abs(best.gap)) best = g;
  }
  return best;
}

function sideTowards(iface: UmlNode, owner: UmlNode): StickSide {
  const dx = owner.x + owner.width / 2 - (iface.x + iface.width / 2);
  const dy = owner.y + owner.height / 2 - (iface.y + iface.height / 2);
  // Compare against the combined half sizes so wide boxes side by side read as horizontal
  const nx = dx / ((owner.width + iface.width) / 2);
  const ny = dy / ((owner.height + iface.height) / 2);
  if (Math.abs(nx) >= Math.abs(ny)) return dx < 0 ? "left" : "right";
  return dy < 0 ? "top" : "bottom";
}

/**
 * Which way the stick of a lollipop or socket points: towards the component it is docked
 * to, else towards the component tied to it by a realization (lollipop) or dependency
 * (socket), else towards the nearest component. Defaults to the left.
 */
export function stickSide(iface: UmlNode, diagram: UmlDiagram): StickSide {
  const docked = closestFacingOwner(iface, diagram, TOUCH_TOLERANCE);
  if (docked) return docked.side;

  const ownerEdgeKind = OWNER_EDGE_KINDS[iface.kind];
  for (const edge of diagram.edges) {
    if (edge.kind !== ownerEdgeKind) continue;
    const otherId =
      edge.sourceId === iface.id
        ? edge.targetId
        : edge.targetId === iface.id
          ? edge.sourceId
          : null;
    const other = diagram.nodes.find((n) => n.id === otherId);
    if (other && OWNER_KINDS.has(other.kind)) return sideTowards(iface, other);
  }

  let nearest: UmlNode | null = null;
  let nearestDist = Infinity;
  for (const node of diagram.nodes) {
    if (!OWNER_KINDS.has(node.kind)) continue;
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
 * Snaps a lollipop or socket flush against the side of the closest component within
 * `DOCK_DISTANCE`. Returns whether it docked.
 */
export function dockInterface(iface: UmlNode, diagram: UmlDiagram): boolean {
  if (!isBallOrSocket(iface)) return false;
  const target = closestFacingOwner(iface, diagram, DOCK_DISTANCE);
  if (!target) return false;

  const { owner, side } = target;
  if (side === "left") iface.x = owner.x + owner.width;
  else if (side === "right") iface.x = owner.x - iface.width;
  else if (side === "top") iface.y = owner.y + owner.height;
  else iface.y = owner.y - iface.height;
  return true;
}

/** Lollipops and sockets docked to `owner`, which move along with it. */
export function dockedInterfaces(
  owner: UmlNode,
  diagram: UmlDiagram,
): UmlNode[] {
  if (!OWNER_KINDS.has(owner.kind)) return [];
  return diagram.nodes.filter(
    (n) =>
      isBallOrSocket(n) &&
      closestFacingOwner(n, diagram, TOUCH_TOLERANCE)?.owner === owner,
  );
}
