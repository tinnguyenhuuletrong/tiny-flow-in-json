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
        .optional()
        .describe("The data type of the schema."),
      format: z.string().optional().describe("The format of the data."),
      enum: z
        .array(z.string())
        .optional()
        .describe("A list of possible values."),
      properties: z
        .record(z.string(), JsonSchema)
        .optional()
        .describe("The properties of an object schema."),
      items: JsonSchema.optional().describe(
        "The schema for items in an array."
      ),
      required: z
        .array(z.string())
        .optional()
        .describe("A list of required properties."),
    })
    .catchall(z.any())
);

export type JsonSchema = z.infer<typeof JsonSchema>;

// Schema for a single step (node) in the workflow.
export const StepSchema = z
  .object({
    id: z.string().describe("A unique identifier for the step."),
    name: z.string().describe("A human-readable name for the step."),
    type: z
      .enum(["begin", "end", "task", "decision"])
      .describe("The type of the step."),
    paramsSchema: JsonSchema.optional().describe(
      "A JSON schema that defines the parameters for the step."
    ),
    params: z
      .record(z.string(), z.any())
      .optional()
      .describe("The parameters for the step."), // Added params
    metadata: z
      .record(z.string(), z.any())
      .optional()
      .describe(
        "An object for storing any additional or custom information for the step. Use this for data not covered by the standard fields."
      ),
  })
  .describe(
    "Schema for a single step (node) in the workflow. It defines the structure of a single unit of work in the workflow."
  );

export type Step = z.infer<typeof StepSchema>;

// Schema for a connection (edge) between two steps.
export const ConnectionSchema = z.object({
  id: z.string().describe("A unique identifier for the connection."),
  sourceStepId: z.string().describe("The ID of the source step."),
  targetStepId: z.string().describe("The ID of the target step."),
  condition: z
    .string()
    .optional()
    .describe("A condition that must be met for this connection to be taken."),
});

export type Connection = z.infer<typeof ConnectionSchema>;

// The main schema for the entire workflow.
export const FlowSchema = z
  .object({
    $schema: z
      .string()
      .optional()
      .describe("The JSON schema version used for validation."),
    id: z.string().describe("A unique identifier for the workflow."),
    name: z.string().describe("A human-readable name for the workflow."),
    version: z.string().describe("The version of the workflow definition."),
    globalStateSchema: JsonSchema.describe(
      "A JSON schema that defines the structure of the global state."
    ),
    globalState: z
      .record(z.string(), z.any())
      .optional()
      .describe("The initial global state of the workflow."), // Added state
    steps: z
      .array(StepSchema)
      .describe("An array of steps that make up the workflow."),
    connections: z
      .array(ConnectionSchema)
      .describe("An array of connections between the steps."),
    metadata: z
      .record(z.string(), z.any())
      .optional()
      .describe(
        "An object for storing any additional or custom information for the workflow. Use this for data not covered by the standard fields."
      ),
  })
  .describe(
    "The main schema for the entire workflow. It defines the structure of a workflow, including its steps, connections, and global state."
  );

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
