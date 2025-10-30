import {
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarRadioGroup,
  MenubarRadioItem,
} from "@/components/ui/menubar";
import { ToggleLeft, Columns2, Rows2 } from "lucide-react";
import { useLayoutStore } from "@/app/store/layoutStore";

export function ViewMenu() {
  const { layoutMode, setLayoutMode } = useLayoutStore();

  return (
    <MenubarSub>
      <MenubarSubTrigger data-testid="view-mode-trigger">
        View Mode
      </MenubarSubTrigger>
      <MenubarSubContent>
        <MenubarRadioGroup
          value={layoutMode}
          onValueChange={(value) => setLayoutMode(value as any)}
        >
          <MenubarRadioItem value="compact">
            <ToggleLeft className="mr-2 h-4 w-4" />
            <span>Compact</span>
          </MenubarRadioItem>
          <MenubarRadioItem value="dual-horizontal">
            <Columns2 className="mr-2 h-4 w-4" />
            <span>Dual Horizontal</span>
          </MenubarRadioItem>
          <MenubarRadioItem value="dual-vertical">
            <Rows2 className="mr-2 h-4 w-4" />
            <span>Dual Vertical</span>
          </MenubarRadioItem>
        </MenubarRadioGroup>
      </MenubarSubContent>
    </MenubarSub>
  );
}
