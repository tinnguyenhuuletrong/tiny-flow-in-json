import { type ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { ReactFlowProvider } from "reactflow";

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
