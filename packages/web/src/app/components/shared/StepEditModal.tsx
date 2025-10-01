import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFlowStore } from "@/app/store/flowStore";
import { JsonAutoForm } from "@/app/components/shared/JsonAutoForm";
import { useState, useEffect } from "react";

export function StepEditModal() {
  const { flow, editingStepId, setEditingStepId, updateStepParams } =
    useFlowStore();
  const [formData, setFormData] = useState<Record<string, any>>({});

  const editingStep = flow.steps.find((s) => s.id === editingStepId);

  useEffect(() => {
    if (editingStep?.params) {
      setFormData(editingStep.params);
    } else {
      setFormData({});
    }
  }, [editingStep]);

  const handleSave = () => {
    if (editingStepId) {
      updateStepParams(editingStepId, formData);
      setEditingStepId(null);
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
        <div className="py-4">
          {editingStep?.paramsZodSchema ? (
            <JsonAutoForm
              schema={editingStep.paramsZodSchema as any}
              data={formData}
              onDataChange={setFormData}
            />
          ) : (
            <p className="text-sm text-gray-500">
              This step has no parameters to configure.
            </p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
