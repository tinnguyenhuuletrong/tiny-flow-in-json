import { Header } from "./app/components/layout/Header";
import { Toolbar } from "./app/components/layout/Toolbar";
import { LeftPanel } from "./app/components/layout/LeftPanel";
import { MainView } from "./app/components/layout/MainView";
import { useFlowStore } from "./app/store/flowStore";
import EmptyState from "./app/components/layout/EmptyState";
import { UrlFlowLoader } from "./app/components/logic/UrlFlowLoader";

function App() {
  const { flow } = useFlowStore();

  return (
    <>
      <UrlFlowLoader />
      <div className="flex flex-col h-screen">
        <Header />
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          {!flow ? (
            <div className="w-full">
              <EmptyState />
            </div>
          ) : (
            <>
              <LeftPanel />
              <MainView />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
