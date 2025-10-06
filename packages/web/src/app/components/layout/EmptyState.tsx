import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { examples } from "@tiny-json-workflow/examples";
import { parseFromJson } from "@tiny-json-workflow/core";
import { useFlowStore } from "@/app/store/flowStore";
import { placeholderFlow } from "@/data/placeholder";

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
    <div className="flex items-center justify-center h-full">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Create a new workflow</CardTitle>
          <CardDescription>
            Start by creating a new file or loading an example.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Button onClick={handleNewFile}>New File</Button>
          <div className="grid gap-2">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyState;
