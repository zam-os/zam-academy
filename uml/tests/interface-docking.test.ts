import { describe, expect, it } from "vitest";
import {
  DOCK_DISTANCE,
  dockedInterfaces,
  dockInterface,
  stickSide,
} from "../src/editor/interface-docking";
import type { UmlDiagram, UmlEdge, UmlNode } from "../src/model/uml-types";

describe("Docking lollipops and sockets onto components", () => {
  const node = (
    id: string,
    kind: UmlNode["kind"],
    x: number,
    y: number,
    width: number,
    height: number,
  ): UmlNode => ({
    id,
    kind,
    name: id,
    x,
    y,
    width,
    height,
    attributes: [],
    operations: [],
  });
  const component = (id: string, x: number, y: number) =>
    node(id, "component", x, y, 195, 96);
  const lollipop = (id: string, x: number, y: number) =>
    node(id, "provided-interface", x, y, 120, 54);
  const socket = (id: string, x: number, y: number) =>
    node(id, "required-interface", x, y, 120, 54);
  const diagram = (nodes: UmlNode[], edges: UmlEdge[] = []): UmlDiagram => ({
    id: "d",
    title: "d",
    diagramType: "component",
    nodes,
    edges,
    updatedAt: "",
  });

  it("snaps a lollipop dropped next to a component flush against that side", () => {
    const owner = component("owner", 100, 100);
    const right = lollipop("right", 100 + 195 + 20, 120);
    const below = socket("below", 130, 100 + 96 + 25);
    const d = diagram([owner, right, below]);

    expect(dockInterface(right, d)).toBe(true);
    expect(right.x).toBe(owner.x + owner.width);
    expect(right.y).toBe(120);
    expect(stickSide(right, d)).toBe("left");

    expect(dockInterface(below, d)).toBe(true);
    expect(below.y).toBe(owner.y + owner.height);
    expect(stickSide(below, d)).toBe("top");
  });

  it("docks onto the left and the top side as well", () => {
    const owner = component("owner", 300, 300);
    const left = lollipop("left", 300 - 120 - 10, 320);
    const above = socket("above", 340, 300 - 54 - 10);
    const d = diagram([owner, left, above]);

    expect(dockInterface(left, d)).toBe(true);
    expect(left.x + left.width).toBe(owner.x);
    expect(stickSide(left, d)).toBe("right");

    expect(dockInterface(above, d)).toBe(true);
    expect(above.y + above.height).toBe(owner.y);
    expect(stickSide(above, d)).toBe("bottom");
  });

  it("leaves a symbol dropped further away than the dock distance where it is", () => {
    const owner = component("owner", 100, 100);
    const far = lollipop("far", 100 + 195 + DOCK_DISTANCE + 10, 120);
    const d = diagram([owner, far]);

    expect(dockInterface(far, d)).toBe(false);
    expect(far.x).toBe(100 + 195 + DOCK_DISTANCE + 10);
  });

  it("points an undocked lollipop at the component realizing it", () => {
    // Lesson 6.2 layout: consumer left, lollipop in the middle, provider right
    const consumer = component("consumer", 75, 120);
    const ifc = lollipop("ifc", 345, 141);
    const provider = component("provider", 600, 120);
    const edges: UmlEdge[] = [
      { id: "dep", kind: "dependency", sourceId: "consumer", targetId: "ifc" },
      {
        id: "real",
        kind: "realization",
        sourceId: "provider",
        targetId: "ifc",
      },
    ];

    expect(stickSide(ifc, diagram([consumer, ifc, provider], edges))).toBe(
      "right",
    );
  });

  it("points an undocked socket at the component depending on it", () => {
    const provider = component("provider", 75, 120);
    const ifc = socket("ifc", 345, 141);
    const consumer = component("consumer", 600, 120);
    const edges: UmlEdge[] = [
      { id: "dep", kind: "dependency", sourceId: "consumer", targetId: "ifc" },
    ];

    expect(stickSide(ifc, diagram([provider, ifc, consumer], edges))).toBe(
      "right",
    );
  });

  it("falls back to the nearest component, and to the left without one", () => {
    const near = component("near", 100, 300);
    const ifc = lollipop("ifc", 140, 100);
    const far = component("far", 900, 100);

    expect(stickSide(ifc, diagram([near, ifc, far]))).toBe("bottom");
    expect(stickSide(ifc, diagram([ifc]))).toBe("left");
  });

  it("moves docked symbols along with their component, but not loose ones", () => {
    const owner = component("owner", 100, 100);
    const docked = lollipop("docked", 295, 120);
    const loose = socket("loose", 400, 120);
    const d = diagram([owner, docked, loose]);

    expect(dockedInterfaces(owner, d)).toEqual([docked]);
    expect(dockedInterfaces(docked, d)).toEqual([]);
  });
});
