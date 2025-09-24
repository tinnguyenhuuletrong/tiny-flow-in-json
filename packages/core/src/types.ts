import { z } from "zod";

// A Zod schema for a basic JSON Schema object.
// It's recursive and allows for nested properties and items.
export const JsonSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      type: z
        .enum([
          "string",
          "number",
          "integer",
          "boolean",
          "object",
          "array",
          "null",
        ])
        .optional(),
      properties: z.record(JsonSchema).optional(),
      items: JsonSchema.optional(),
      required: z.array(z.string()).optional(),
    })
    .catchall(z.any())
);

export type JsonSchema = z.infer<typeof JsonSchema>;

// Schema for a single step (node) in the workflow.
export const StepSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["begin", "end", "task", "decision"]),
  paramsSchema: JsonSchema.optional(),
  params: z.record(z.any()).optional(), // Added params
  metadata: z.record(z.any()).optional(),
});

export type Step = z.infer<typeof StepSchema>;

// Schema for a connection (edge) between two steps.
export const ConnectionSchema = z.object({
  id: z.string(),
  sourceStepId: z.string(),
  targetStepId: z.string(),
  condition: z.string().optional(),
});

export type Connection = z.infer<typeof ConnectionSchema>;

// The main schema for the entire workflow.
export const FlowSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  globalStateSchema: JsonSchema,
  state: z.record(z.any()).optional(), // Added state
  steps: z.array(StepSchema),
  connections: z.array(ConnectionSchema),
  metadata: z.record(z.any()).optional(),
});

export type Flow = z.infer<typeof FlowSchema>;

// In-memory types after parsing and transformation
export type ParsedStep = Omit<Step, "paramsSchema"> & {
  paramsZodSchema?: z.ZodSchema<any>;
};

export type ParsedFlow = Omit<Flow, "globalStateSchema" | "steps"> & {
  globalStateZodSchema: z.ZodSchema<any>;
  steps: ParsedStep[];
};
