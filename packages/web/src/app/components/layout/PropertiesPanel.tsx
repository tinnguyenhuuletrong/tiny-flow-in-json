import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFlowStore } from "@/app/store/flowStore";
import { HandleEditor } from "../properties-panel/HandleEditor";
import { useEffect, useState } from "react";
import {
  type ParsedStep,
  computeDefaultHandler,
} from "@tiny-json-workflow/core";

export function PropertiesPanel() {
  const { flow, selectedStepId } = useFlowStore();
  const [selectedNode, setSelectedNode] = useState<ParsedStep | undefined>();

  useEffect(() => {
    if (flow && selectedStepId) {
      setSelectedNode(flow.steps.find((step) => step.id === selectedStepId));
    } else {
      setSelectedNode(undefined);
    }
  }, [flow, selectedStepId]);

  if (!selectedNode) {
    return null;
  }
  if (!flow) {
    return null;
  }

  const isDecisionNode = selectedNode.type === "decision";

  return (
    <Card className="w-80 h-full rounded-none border-t-0 border-r-0 border-b-0">
      <CardHeader>
        <CardTitle>{selectedNode.id}</CardTitle>
      </CardHeader>
      <CardContent>
        {isDecisionNode ? (
          <HandleEditor
            handles={
              selectedNode?.metadata?.handles ??
              computeDefaultHandler(flow, selectedNode.id)
            }
            nodeId={selectedNode.id}
          />
        ) : (
          <p>This node type does not have configurable handles.</p>
        )}
      </CardContent>
    </Card>
  );
}
