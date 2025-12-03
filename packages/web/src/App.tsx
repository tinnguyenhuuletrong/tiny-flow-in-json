import { Header } from "./app/components/layout/Header";
import { Toolbar } from "./app/components/layout/Toolbar";
import { LeftPanel } from "./app/components/layout/LeftPanel";
import { MainCompactView } from "./app/components/layout/MainCompactView";
import { useFlowStore } from "./app/store/flowStore";
import EmptyState from "./app/components/layout/EmptyState";
import { UrlFlowLoader } from "./app/components/logic/UrlFlowLoader";
import { useLayoutStore } from "./app/store/layoutStore";
import { MainDualView } from "./app/components/layout/MainDualView";
import { useEffect } from "react";

function App() {
  const { flow, selectedStepId } = useFlowStore();
  const { layoutMode, setPropertiesPanelOpen } = useLayoutStore();

  useEffect(() => {
    setPropertiesPanelOpen(!!selectedStepId);
  }, [selectedStepId, setPropertiesPanelOpen]);

  const renderMainContent = () => {
    if (!flow) {
      return (
        <div className="w-full">
          <EmptyState />
        </div>
      );
    }

    switch (layoutMode) {
      case "compact":
        return (
          <>
            <LeftPanel />
            <MainCompactView />
          </>
        );
      case "dual-horizontal":
        return (
          <>
            <LeftPanel />
            <MainDualView direction="horizontal" />
          </>
        );
      case "dual-vertical":
        return (
          <>
            <LeftPanel />
            <MainDualView direction="vertical" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <UrlFlowLoader />
      <div className="flex flex-col h-screen">
        <Header />
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          {renderMainContent()}
        </div>
      </div>
    </>
  );
}

export default App;
