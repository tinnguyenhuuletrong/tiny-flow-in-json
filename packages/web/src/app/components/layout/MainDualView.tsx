import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { FlowView } from "./FlowView";
import { JsonEditorView } from "./JsonEditorView";
import { StepEditModal } from "../shared/StepEditModal";

interface MainDualViewProps {
  direction: "horizontal" | "vertical";
}

export function MainDualView({ direction }: MainDualViewProps) {
  return (
    <>
      <PanelGroup direction={direction}>
        <Panel>
          <div className="w-full h-full border rounded-md">
            <JsonEditorView />
          </div>
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <div className="w-full h-full border rounded-md">
            <FlowView />
          </div>
        </Panel>
      </PanelGroup>
      <StepEditModal />
    </>
  );
}
