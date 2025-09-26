import { Button } from "@/components/ui/button";
import { useFlowStore } from "@/app/store/flowStore";
import { parseFromJson, saveToJson } from "@tiny-json-workflow/core";

export function Toolbar() {
  const { doAutoLayout, flow, setFlow } = useFlowStore();

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      saveToJson(flow)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "flow.json";
    link.click();
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedFlow = parseFromJson(e.target?.result as string);
            setFlow(importedFlow);
          } catch (error) {
            console.error("Error parsing JSON file:", error);
            alert("Invalid JSON file.");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="p-2 border-b flex gap-2">
      <Button variant="outline" onClick={handleImport}>
        Import
      </Button>
      <Button variant="outline" onClick={handleExport}>
        Export
      </Button>
      <Button variant="outline" onClick={doAutoLayout}>
        Auto Layout
      </Button>
    </div>
  );
}
