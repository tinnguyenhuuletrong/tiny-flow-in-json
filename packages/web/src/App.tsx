import { Header } from "./app/components/layout/Header";
import { Toolbar } from "./app/components/layout/Toolbar";
import { LeftPanel } from "./app/components/layout/LeftPanel";
import { MainView } from "./app/components/layout/MainView";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />
        <MainView />
      </div>
    </div>
  );
}

export default App;
