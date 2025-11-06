import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFlowStore } from "@/app/store/flowStore";
import { EditTaskNode } from "./EditTaskNode";
import { EditWaitForEventNode } from "./EditWaitForEventNode";

export function StepEditModal() {
  const { flow, editingStepId, setEditingStepId } = useFlowStore();

  const editingStep = flow
    ? flow.steps.find((s) => s.id === editingStepId)
    : undefined;

  const renderContent = () => {
    if (!editingStep) return null;

    switch (editingStep.type) {
      case "task":
        return <EditTaskNode editingStep={editingStep} />;
      case "waitForEvent":
        return <EditWaitForEventNode editingStep={editingStep} />;
      default:
        return (
          <p className="text-sm text-gray-500">
            This step has no parameters to configure.
          </p>
        );
    }
  };

  return (
    <Dialog
      open={!!editingStepId}
      onOpenChange={(open) => !open && setEditingStepId(null)}
    >
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit: {editingStep?.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
}