import { create } from "zustand";
import { persist } from "zustand/middleware";

type LayoutMode = "compact" | "dual-horizontal" | "dual-vertical";

interface LayoutState {
  layoutMode: LayoutMode;
  isLeftPanelCollapsed: boolean;
  isPropertiesPanelOpen: boolean;
  setLayoutMode: (mode: LayoutMode) => void;
  toggleLeftPanel: () => void;
  setPropertiesPanelOpen: (isOpen: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      layoutMode: "compact",
      isLeftPanelCollapsed: false,
      isPropertiesPanelOpen: false,
      setLayoutMode: (mode) => set({ layoutMode: mode }),
      toggleLeftPanel: () =>
        set((state) => ({ isLeftPanelCollapsed: !state.isLeftPanelCollapsed })),
      setPropertiesPanelOpen: (isOpen) => set({ isPropertiesPanelOpen: isOpen }),
    }),
    {
      name: "layout-settings",
    }
  )
);
