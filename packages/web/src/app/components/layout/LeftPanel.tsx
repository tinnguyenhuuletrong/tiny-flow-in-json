import { useFlowStore } from "@/app/store/flowStore";
import { JsonAutoForm } from "@/app/components/shared/JsonAutoForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/app/store/layoutStore";
import { useMemo } from "react";
import { computeDefaultHandler } from "@tiny-json-workflow/core";
import { HandleEditor } from "../properties-panel/HandleEditor";
import { SUPPORT_CONNECTION_EDIT } from "@/data/constant";

export function LeftPanel() {
  const {
    flow,
    updateFlowState,
    selectedStepId,
    setSelectedStepId,
    setEditingStepId,
    updateStepEventValue,
  } = useFlowStore();
  const { isLeftPanelCollapsed, toggleLeftPanel } = useLayoutStore();

  const selectedStep = useMemo(() => {
    if (!flow || !selectedStepId) return null;
    return flow.steps.find((s) => s.id === selectedStepId);
  }, [flow, selectedStepId]);

  if (!flow) return null;

  const handles = useMemo(() => {
    if (selectedStep && SUPPORT_CONNECTION_EDIT.includes(selectedStep.type)) {
      return (
        selectedStep?.metadata?.handles ??
        computeDefaultHandler(flow, selectedStep.id)
      );
    }
    return [];
  }, [flow, selectedStep]);
  const hasHandles = handles.length > 0;

  return (
    <div
      className={cn(
        "border-r h-full flex flex-col transition-all duration-300 ease-in-out",
        isLeftPanelCollapsed ? "w-12" : "w-80"
      )}
    >
      <div className="p-2 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLeftPanel}
          data-testid="left-panel-toggle"
        >
          {isLeftPanelCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
        </Button>
      </div>
      {!isLeftPanelCollapsed && (
        <div className="p-4 overflow-y-auto">
          <Accordion
            type="multiple"
            defaultValue={["steps"]}
            className="w-full"
          >
            <AccordionItem value="global-state">
              <AccordionTrigger>Global State</AccordionTrigger>
              <AccordionContent>
                <div className="p-2 bg-gray-50 rounded-md">
                  {flow.globalStateZodSchema ? (
                    <JsonAutoForm
                      schema={flow.globalStateZodSchema as any}
                      data={flow.globalState ?? {}}
                      onDataChange={updateFlowState}
                    >
                      {({ onSubmit }) => (
                        <Button
                          onClick={onSubmit}
                          type="submit"
                          className="mt-2 w-full"
                        >
                          Save Global State
                        </Button>
                      )}
                    </JsonAutoForm>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No global state schema defined.
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="steps">
              <AccordionTrigger>Steps</AccordionTrigger>
              <AccordionContent>
                <div className="p-2 bg-gray-50 rounded-md">
                  <ul>
                    {flow.steps.map((step) => (
                      <li
                        key={step.id}
                        onClick={() => setSelectedStepId(step.id)}
                        className={cn(
                          "flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-100",
                          selectedStepId === step.id && "bg-blue-100"
                        )}
                      >
                        <span>{step.name}</span>
                        {(step.type === "task" && step.paramsZodSchema) ||
                        (step.type === "waitForEvent" &&
                          (step.eventInput?.eventInputZodSchema ||
                            step.eventOutput?.eventOutputZodSchema)) ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingStepId(step.id);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            {selectedStep && (
              <AccordionItem value="node-connections">
                <AccordionTrigger>Connections</AccordionTrigger>
                <AccordionContent>
                  <div className="p-2 bg-gray-50 rounded-md">
                    {hasHandles ? (
                      <HandleEditor
                        handles={handles}
                        nodeId={selectedStep.id}
                      />
                    ) : (
                      <p>This node type does not have configurable handles.</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {selectedStep?.type === "waitForEvent" && (
              <AccordionItem value="event-payloads">
                <AccordionTrigger>Event Payloads</AccordionTrigger>
                <AccordionContent>
                  <div className="p-2 bg-gray-50 rounded-md">
                    {selectedStep.eventInput?.eventInputZodSchema && (
                      <div>
                        <h4 className="font-medium mb-2">Event Input</h4>
                        <JsonAutoForm
                          schema={
                            selectedStep.eventInput.eventInputZodSchema as any
                          }
                          data={selectedStep.eventInput?.value ?? {}}
                          onDataChange={(value) => {
                            updateStepEventValue(
                              selectedStepId!,
                              "eventInput",
                              value
                            );
                          }}
                        />
                      </div>
                    )}
                    {selectedStep?.eventOutput?.eventOutputZodSchema && (
                      <div>
                        <h4 className="font-medium mb-2">Event Output</h4>
                        <JsonAutoForm
                          schema={
                            selectedStep?.eventOutput
                              ?.eventOutputZodSchema as any
                          }
                          data={selectedStep.eventOutput?.value ?? {}}
                          onDataChange={(value) => {
                            updateStepEventValue(
                              selectedStepId!,
                              "eventOutput",
                              value
                            );
                          }}
                        />
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      )}
    </div>
  );
}
