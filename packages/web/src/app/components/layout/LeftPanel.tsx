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

export function LeftPanel() {
  const {
    flow,
    updateFlowState,
    selectedStepId,
    setSelectedStepId,
    setEditingStepId,
  } = useFlowStore();
  const { isLeftPanelCollapsed, toggleLeftPanel } = useLayoutStore();

  if (!flow) return null;

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
                <div className="p-2 bg-gray-100 rounded-md mt-2">
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
                <ul>
                  {flow.steps.map((step) => (
                    <li
                      key={step.id}
                      onClick={() => setSelectedStepId(step.id)}
                      className={cn(
                        "flex justify-between items-center mb-2 p-2 border rounded-md cursor-pointer hover:bg-gray-100",
                        selectedStepId === step.id && "bg-blue-100"
                      )}
                    >
                      <span>{step.name}</span>
                      {step.type === "task" && step.paramsZodSchema && (
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
                      )}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
}
