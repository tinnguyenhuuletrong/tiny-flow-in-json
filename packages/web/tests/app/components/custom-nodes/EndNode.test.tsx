import { render, screen } from "../../../test-utils";
import { describe, expect, it } from "bun:test";
import { EndNode } from "@/app/components/custom-nodes/EndNode";
import { Position } from "reactflow";

describe("EndNode", () => {
  it("should render a circle with a target handle on the left", () => {
    render(<EndNode />);

    const handle = screen.getByTestId("target-handle");
    expect(handle).toBeDefined();
    expect(handle.getAttribute("data-handlepos")).toBe(Position.Left);
    expect(handle.className).toContain("target");
  });
});
