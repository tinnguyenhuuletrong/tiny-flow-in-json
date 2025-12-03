import { create } from "zustand";
import { persist } from "zustand/middleware";

type LayoutMode = "compact" | "dual-horizontal" | "dual-vertical";

interface LayoutState {
  layoutMode: LayoutMode;
  isLeftPanelCollapsed: boolean;
  setLayoutMode: (mode: LayoutMode) => void;
  toggleLeftPanel: () => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      layoutMode: "compact",
      isLeftPanelCollapsed: false,
      setLayoutMode: (mode) => set({ layoutMode: mode }),
      toggleLeftPanel: () =>
        set((state) => ({ isLeftPanelCollapsed: !state.isLeftPanelCollapsed })),
    }),
    {
      name: "layout-settings",
    }
  )
);
