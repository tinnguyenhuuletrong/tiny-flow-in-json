import ELK from "elkjs/lib/elk.bundled.js";
import { type Edge, type Node } from "reactflow";

const elk = new ELK();

const nodeWidth = 250;
const nodeHeight = 150;

export const getLayoutedElements = async (nodes: Node[], edges: Edge[]) => {
  const graph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "RIGHT",
      "elk.spacing.nodeNode": "150",
      "elk.layered.spacing.nodeNodeBetweenLayers": "150",
    },
    children: nodes.map((node) => ({
      ...node,
      id: node.id,
      width: nodeWidth,
      height: nodeHeight,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layoutedGraph = await elk.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = layoutedGraph.children?.find(
      (child) => child.id === node.id
    );

    if (nodeWithPosition) {
      node.position = {
        x: nodeWithPosition.x || 0,
        y: nodeWithPosition.y || 0,
      };
    }

    return node;
  });

  return { nodes: layoutedNodes, edges };
};