import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "bun:test";
import { z } from "zod";
import { JsonAutoForm } from "@/app/components/shared/JsonAutoForm";

const testSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(18, "Must be 18 or older"),
});

type TestData = z.infer<typeof testSchema>;

const testData: TestData = {
  name: "John Doe",
  age: 30,
};

describe("JsonAutoForm", () => {
  it("should render the form view by default", () => {
    const onDataChange = vi.fn();
    render(
      <JsonAutoForm
        schema={testSchema}
        data={testData}
        onDataChange={onDataChange}
      />
    );

    expect(screen.getByLabelText(/Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Age/i)).toBeDefined();
  });
});
