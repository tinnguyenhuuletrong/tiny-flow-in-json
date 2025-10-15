import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFlowStore } from "../../store/flowStore";
import EmptyState from "./EmptyState";
import { FlowView } from "./FlowView";
import { JsonEditorView } from "./JsonEditorView";
import { StepEditModal } from "../shared/StepEditModal";

export function MainView() {
  const { flow } = useFlowStore();

  if (!flow) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 p-4 flex flex-col">
      <Tabs defaultValue="flow" className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="flow" data-testid="tab-flow">
            Flow
          </TabsTrigger>
          <TabsTrigger value="json" data-testid="tab-json">
            JSON
          </TabsTrigger>
        </TabsList>
        <TabsContent value="flow" className="flex-1 overflow-y-auto">
          <div className="w-full h-full border rounded-md">
            <FlowView />
          </div>
        </TabsContent>
        <TabsContent value="json" className="flex-1 overflow-y-auto">
          <div className="w-full h-full border rounded-md">
            <JsonEditorView />
          </div>
        </TabsContent>
      </Tabs>
      <StepEditModal />
    </div>
  );
}
