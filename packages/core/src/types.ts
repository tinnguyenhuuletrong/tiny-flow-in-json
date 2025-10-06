import { z } from "zod";
import { asAllUniqueKeys } from "./utils/tsHelper";

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
      format: z.string().optional(),
      enum: z.array(z.string()).optional(),
      properties: z.record(z.string(), JsonSchema).optional(),
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
  params: z.record(z.string(), z.any()).optional(), // Added params
  metadata: z.record(z.string(), z.any()).optional(),
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
  $schema: z.string().optional(),
  id: z.string(),
  name: z.string(),
  version: z.string(),
  globalStateSchema: JsonSchema,
  globalState: z.record(z.string(), z.any()).optional(), // Added state
  steps: z.array(StepSchema),
  connections: z.array(ConnectionSchema),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type Flow = z.infer<typeof FlowSchema>;

export const KEY_ORDERS = asAllUniqueKeys<Flow>()([
  "$schema",
  "id",
  "name",
  "version",
  "globalState",
  "globalStateSchema",
  "steps",
  "connections",
  "metadata",
] as const);

// In-memory types after parsing and transformation
export type ParsedStep = Omit<Step, "paramsSchema"> & {
  readonly paramsZodSchema?: z.ZodType;
};

export type ParsedFlow = Omit<Flow, "globalStateSchema" | "steps"> & {
  readonly globalStateZodSchema: z.ZodType;
  steps: ParsedStep[];

  _internal: {
    originalJsonSchema: Map<string, string>;
  };
};
