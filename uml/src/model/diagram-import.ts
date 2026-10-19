import {
  UML_DIAGRAM_TYPES,
  UML_EDGE_KINDS,
  UML_NODE_KINDS,
  type UmlAttribute,
  type UmlDiagram,
  type UmlDiagramType,
  type UmlEdge,
  type UmlEdgeKind,
  type UmlNode,
  type UmlNodeKind,
  type UmlOperation,
  type UmlVisibility,
} from "./uml-types";

/**
 * Rebuilds a diagram read from a `.uml.json` file before anything renders it.
 *
 * The canvas writes ids and numbers into SVG markup, so a shared file could
 * otherwise carry markup into the page. Only known kinds survive; ids that
 * are not plain tokens are replaced (edges follow their nodes); numbers must
 * be finite; every text field becomes a string. Returns null for anything
 * that is not a diagram.
 */
export function sanitizeImportedDiagram(raw: unknown): UmlDiagram | null {
  if (!isRecord(raw) || !Array.isArray(raw.nodes) || !Array.isArray(raw.edges))
    return null;
  const diagramType = raw.diagramType;
  if (typeof diagramType !== "string" || !(diagramType in UML_DIAGRAM_TYPES))
    return null;

  const used = new Set<string>();
  const nodeIds = new Map<string, string>();
  const nodes: UmlNode[] = [];
  raw.nodes.forEach((value, index) => {
    if (!isRecord(value) || !isKey(value.kind, UML_NODE_KINDS)) return;
    const id = uniqueId(value.id, `node_${index}`, used);
    if (typeof value.id === "string") nodeIds.set(value.id, id);
    const node: UmlNode = {
      id,
      kind: value.kind as UmlNodeKind,
      name: text(value.name),
      x: finite(value.x, 0),
      y: finite(value.y, 0),
      width: finite(value.width, 160, 1),
      height: finite(value.height, 80, 1),
      attributes: list(value.attributes).map(attribute),
      operations: list(value.operations).map(operation),
    };
    if (value.stereotype !== undefined) node.stereotype = text(value.stereotype);
    if (value.isAbstract === true) node.isAbstract = true;
    if (isRecord(value.stateActivities)) {
      const a = value.stateActivities;
      node.stateActivities = {
        ...(a.entry !== undefined ? { entry: text(a.entry) } : {}),
        ...(a.doActivity !== undefined ? { doActivity: text(a.doActivity) } : {}),
        ...(a.exit !== undefined ? { exit: text(a.exit) } : {}),
      };
    }
    if (
      typeof value.fragmentOperator === "string" &&
      ["alt", "opt", "loop", "par", "region"].includes(value.fragmentOperator)
    ) {
      node.fragmentOperator = value.fragmentOperator as UmlNode["fragmentOperator"];
    }
    if (value.fragmentGuard !== undefined)
      node.fragmentGuard = text(value.fragmentGuard);
    if (value.documentation !== undefined)
      node.documentation = text(value.documentation);
    if (
      typeof value.accentColor === "string" &&
      /^#[0-9a-fA-F]{3,8}$/.test(value.accentColor)
    ) {
      node.accentColor = value.accentColor;
    }
    nodes.push(node);
  });

  const edges: UmlEdge[] = [];
  raw.edges.forEach((value, index) => {
    if (!isRecord(value) || !isKey(value.kind, UML_EDGE_KINDS)) return;
    const sourceId =
      typeof value.sourceId === "string" ? nodeIds.get(value.sourceId) : undefined;
    const targetId =
      typeof value.targetId === "string" ? nodeIds.get(value.targetId) : undefined;
    if (!sourceId || !targetId) return;
    const edge: UmlEdge = {
      id: uniqueId(value.id, `edge_${index}`, used),
      kind: value.kind as UmlEdgeKind,
      sourceId,
      targetId,
    };
    for (const key of [
      "label",
      "stereotype",
      "guard",
      "sourceRole",
      "targetRole",
      "sourceMultiplicity",
      "targetMultiplicity",
    ] as const) {
      if (value[key] !== undefined) edge[key] = text(value[key]);
    }
    if (value.sequenceOrder !== undefined)
      edge.sequenceOrder = finite(value.sequenceOrder, 0);
    edges.push(edge);
  });

  return {
    id: "",
    title: text(raw.title) || "Import",
    diagramType: diagramType as UmlDiagramType,
    ...(raw.description !== undefined
      ? { description: text(raw.description) }
      : {}),
    nodes,
    edges,
    updatedAt: new Date().toISOString(),
  };
}

const SAFE_ID = /^[A-Za-z0-9_-]{1,64}$/;

function uniqueId(value: unknown, fallback: string, used: Set<string>): string {
  let id = typeof value === "string" && SAFE_ID.test(value) ? value : fallback;
  for (let n = 2; used.has(id); n++) id = `${fallback}_${n}`;
  used.add(id);
  return id;
}

function attribute(value: unknown, index: number): UmlAttribute {
  const r = isRecord(value) ? value : {};
  return {
    id: SAFE_ID.test(String(r.id)) ? String(r.id) : `attr_${index}`,
    visibility: visibility(r.visibility),
    name: text(r.name),
    type: text(r.type),
    ...(r.isDerived === true ? { isDerived: true } : {}),
    ...(r.isStatic === true ? { isStatic: true } : {}),
    ...(r.multiplicity !== undefined ? { multiplicity: text(r.multiplicity) } : {}),
    ...(r.defaultValue !== undefined ? { defaultValue: text(r.defaultValue) } : {}),
  };
}

function operation(value: unknown, index: number): UmlOperation {
  const r = isRecord(value) ? value : {};
  return {
    id: SAFE_ID.test(String(r.id)) ? String(r.id) : `op_${index}`,
    visibility: visibility(r.visibility),
    name: text(r.name),
    parameters: text(r.parameters),
    returnType: text(r.returnType),
    ...(r.isAbstract === true ? { isAbstract: true } : {}),
    ...(r.isStatic === true ? { isStatic: true } : {}),
  };
}

function visibility(value: unknown): UmlVisibility {
  return value === "-" || value === "#" || value === "~" ? value : "+";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isKey(value: unknown, table: object): boolean {
  return typeof value === "string" && Object.hasOwn(table, value);
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function text(value: unknown): string {
  return typeof value === "string" ? value.slice(0, 2000) : "";
}

function finite(value: unknown, fallback: number, min = -100_000): number {
  const n = typeof value === "number" ? value : Number.NaN;
  return Number.isFinite(n) ? Math.min(Math.max(n, min), 100_000) : fallback;
}
