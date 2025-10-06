import { Button } from "@/components/ui/button";

import { examples } from "@tiny-json-workflow/examples";
import { parseFromJson } from "@tiny-json-workflow/core";
import { useFlowStore } from "@/app/store/flowStore";
import { placeholderFlow } from "@/data/placeholder";
import { FilePlusIcon } from "@radix-ui/react-icons";

const EmptyState = () => {
  const { setFlow } = useFlowStore();

  const handleNewFile = () => {
    setFlow(placeholderFlow);
  };

  const handleLoadExample = (example: any) => {
    const parsedFlow = parseFromJson(JSON.stringify(example));
    setFlow(parsedFlow);
  };

  return (
    <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-gray-100">
          <FilePlusIcon className="h-6 w-6 text-gray-500" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no flow yet
          </h3>
          <p className="text-sm text-muted-foreground">
            You can start by creating a new flow or loading one of the examples.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleNewFile}>New File</Button>
          <div className="flex gap-2">
            {Object.entries(examples).map(([name, example]) => (
              <Button
                key={name}
                variant="outline"
                onClick={() => handleLoadExample(example)}
              >
                {name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
