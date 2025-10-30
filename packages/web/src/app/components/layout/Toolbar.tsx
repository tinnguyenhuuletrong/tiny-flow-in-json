import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarSeparator,
} from "@/components/ui/menubar";
import { useFlowStore } from "@/app/store/flowStore";
import { parseFromJson, saveToJson } from "@tiny-json-workflow/core";
import { flowToSvg } from "@tiny-json-workflow/svg-export";
import { examples } from "@tiny-json-workflow/examples";
import { placeholderFlow } from "@/data/placeholder";
import { ViewMenu } from "./ViewMenu";

export function Toolbar() {
  const { doAutoLayout, flow, setFlow, reset } = useFlowStore();

  const handleExport = () => {
    if (!flow) return;

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      saveToJson(flow)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `flow_${flow.name}_${flow.version}.json`;
    link.click();
  };

  const handleExportSVG = () => {
    if (!flow) return;

    const svgString = `data:text/svg;charset=utf-8,${encodeURIComponent(
      flowToSvg(flow)
    )}`;

    const link = document.createElement("a");
    link.href = svgString;
    link.download = `flow_${flow.name}_${flow.version}.svg`;
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

  const handleNewFile = () => {
    setFlow(placeholderFlow);
  };

  const handleLoadExample = (example: any) => {
    const parsedFlow = parseFromJson(JSON.stringify(example));
    setFlow(parsedFlow);
  };

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={handleNewFile}>New</MenubarItem>
          <MenubarItem disabled={!flow} onClick={handleImport}>
            Import
          </MenubarItem>
          <MenubarItem disabled={!flow} onClick={handleExport}>
            Export (JSON)
          </MenubarItem>
          <MenubarItem disabled={!flow} onClick={handleExportSVG}>
            Export (SVG)
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={reset}>Reset</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem disabled={!flow} onClick={doAutoLayout}>
            Graph Auto Layout
          </MenubarItem>
          <ViewMenu />
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Examples</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Load Example</MenubarSubTrigger>
            <MenubarSubContent>
              {Object.entries(examples).map(([name, example]) => (
                <MenubarItem
                  key={name}
                  onClick={() => handleLoadExample(example)}
                >
                  {name}
                </MenubarItem>
              ))}
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
