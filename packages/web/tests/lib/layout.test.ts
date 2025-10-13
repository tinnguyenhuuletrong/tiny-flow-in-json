import { describe, it, expect } from "bun:test";
import { getLayoutedElements } from "../../src/lib/layout";
import type { Node, Edge } from "reactflow";

describe("getLayoutedElements", () => {
  it("should return nodes with updated positions", async () => {
    const initialNodes: Node[] = [
      { id: "1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
      { id: "2", position: { x: 0, y: 0 }, data: { label: "Node 2" } },
    ];
    const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

    const { nodes, edges } = await getLayoutedElements(
      initialNodes,
      initialEdges
    );

    expect(nodes).toHaveLength(2);
    expect(edges).toHaveLength(1);

    nodes.forEach((node) => {
      expect(node.position).toBeDefined();
      expect(typeof node.position.x).toBe("number");
      expect(typeof node.position.y).toBe("number");
    });

    const isSomeNodeMoved = nodes.some(
      (n) => n.position.x !== 0 || n.position.y !== 0
    );
    expect(isSomeNodeMoved).toBe(true);
  });

  it("should handle empty nodes and edges", async () => {
    const { nodes, edges } = await getLayoutedElements([], []);
    expect(nodes).toEqual([]);
    expect(edges).toEqual([]);
  });
});
