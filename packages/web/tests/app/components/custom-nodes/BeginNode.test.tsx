import { render, screen } from "../../../test-utils";
import { describe, expect, it } from "bun:test";
import { BeginNode } from "@/app/components/custom-nodes/BeginNode";
import { Position } from "reactflow";

describe("BeginNode", () => {
  it("should render a circle with a source handle on the right", () => {
    render(<BeginNode />);

    const handle = screen.getByTestId("source-handle");
    expect(handle).toBeDefined();
    expect(handle.getAttribute("data-handlepos")).toBe(Position.Right);
    expect(handle.className).toContain("source");
  });
});
