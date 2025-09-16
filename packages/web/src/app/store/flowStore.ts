import { create } from "zustand";
import { type Flow } from "@tiny-json-workflow/core";
import { placeholderFlow } from "../../data/placeholder";

type FlowState = {
  flow: Flow;
  setFlow: (flow: Flow) => void;
};

export const useFlowStore = create<FlowState>((set) => ({
  flow: placeholderFlow,
  setFlow: (flow) => set({ flow }),
}));
