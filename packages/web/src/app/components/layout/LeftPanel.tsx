import { useState } from "react";
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

export function LeftPanel() {
  const {
    flow,
    updateFlowState,
    selectedStepId,
    setSelectedStepId,
    setEditingStepId,
  } = useFlowStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "border-r h-full flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-12" : "w-80"
      )}
    >
      <div className="p-2 border-b">
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
        </Button>
      </div>
      {!isCollapsed && (
        <div className="p-4 overflow-y-auto">
          <Accordion type="multiple" defaultValue={["steps"]} className="w-full">
            <AccordionItem value="global-state">
              <AccordionTrigger>Global State</AccordionTrigger>
              <AccordionContent>
                <div className="p-2 bg-gray-100 rounded-md mt-2">
                  {flow.globalStateZodSchema ? (
                    <JsonAutoForm
                      schema={flow.globalStateZodSchema as any}
                      data={flow.globalState ?? {}}
                      onDataChange={updateFlowState}
                    />
                  ) : (
                    <p className="text-sm text-gray-500">No global state schema defined.</p>
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
