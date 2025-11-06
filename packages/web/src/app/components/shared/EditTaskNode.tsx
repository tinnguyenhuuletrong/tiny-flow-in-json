import { Button } from "@/components/ui/button";
import { useFlowStore } from "@/app/store/flowStore";
import { JsonAutoForm } from "@/app/components/shared/JsonAutoForm";
import { useState, useEffect } from "react";
import { type ParsedStep } from "@tiny-json-workflow/core";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";

interface EditTaskNodeProps {
  editingStep: ParsedStep;
}

export function EditTaskNode({ editingStep }: EditTaskNodeProps) {
  const { editingStepId, setEditingStepId, updateStepParams, revision } =
    useFlowStore();
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (editingStep?.type === "task") {
      if (editingStep?.params) {
        setFormData(editingStep.params);
      } else {
        setFormData({});
      }
    }
  }, [editingStep, revision]);

  const handleDataChange = (data: Record<string, any>) => {
    if (editingStepId) {
      updateStepParams(editingStepId, data);
      setEditingStepId(null);
    }
  };

  if (editingStep?.type !== "task" || !editingStep?.paramsZodSchema) {
    return (
      <p className="text-sm text-gray-500">
        This step has no parameters to configure.
      </p>
    );
  }

  return (
    <JsonAutoForm
      schema={editingStep.paramsZodSchema as any}
      data={formData}
      onDataChange={handleDataChange}
    >
      {({ onSubmit }) => (
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={onSubmit}>
            Save
          </Button>
        </DialogFooter>
      )}
    </JsonAutoForm>
  );
}
