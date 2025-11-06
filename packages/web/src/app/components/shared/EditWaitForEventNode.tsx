import { Button } from "@/components/ui/button";
import { useFlowStore } from "@/app/store/flowStore";
import { JsonAutoForm } from "@/app/components/shared/JsonAutoForm";
import { type ParsedStep } from "@tiny-json-workflow/core";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EditWaitForEventNodeProps {
  editingStep: ParsedStep;
}

export function EditWaitForEventNode({ editingStep }: EditWaitForEventNodeProps) {
  const { editingStepId, setEditingStepId, updateStepEventValue } =
    useFlowStore();

  if (
    editingStep?.type !== "waitForEvent" ||
    (!editingStep.eventInput?.eventInputZodSchema &&
      !editingStep.eventOutput?.eventOutputZodSchema)
  ) {
    return (
      <p className="text-sm text-gray-500">
        This step has no parameters to configure.
      </p>
    );
  }

  return (
    <Tabs defaultValue="eventInput">
      <TabsList>
        {editingStep.eventInput?.eventInputZodSchema && (
          <TabsTrigger value="eventInput">Event Input</TabsTrigger>
        )}
        {editingStep.eventOutput?.eventOutputZodSchema && (
          <TabsTrigger value="eventOutput">Event Output</TabsTrigger>
        )}
      </TabsList>
      {editingStep.eventInput?.eventInputZodSchema && (
        <TabsContent value="eventInput">
          <JsonAutoForm
            schema={editingStep.eventInput.eventInputZodSchema as any}
            data={editingStep.eventInput?.value ?? {}}
            onDataChange={(value) => {
              updateStepEventValue(editingStepId!, "eventInput", value);
              setEditingStepId(null);
            }}
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
        </TabsContent>
      )}
      {editingStep.eventOutput?.eventOutputZodSchema && (
        <TabsContent value="eventOutput">
          <JsonAutoForm
            schema={editingStep.eventOutput.eventOutputZodSchema as any}
            data={editingStep.eventOutput?.value ?? {}}
            onDataChange={(value) => {
              updateStepEventValue(editingStepId!, "eventOutput", value);
              setEditingStepId(null);
            }}
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
        </TabsContent>
      )}
    </Tabs>
  );
}
