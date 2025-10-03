import {
  type Flow,
  FlowSchema,
  type Step,
  type ParsedFlow,
  type ParsedStep,
  KEY_ORDERS,
  type Connection,
} from "./types"; // Updated import
import { jsonSchemaToZod } from "@tiny-json-workflow/json-schema-adapter";
import { prettifyError, toJSONSchema } from "zod";
import { orderedJsonStringify } from "./utils/helper";

/**
 * Parses a JSON string into a validated Flow object, converting JSON schemas to Zod schemas.
 * @param jsonString The JSON string to parse.
 * @returns A validated ParsedFlow object with Zod schemas.
 * @throws Will throw an error if the JSON is invalid or doesn't match the Flow schema.
 */
export function parseFromJson(jsonString: string): ParsedFlow {
  const json = JSON.parse(jsonString);
  const flow = FlowSchema.parse(json); // Validate against the raw FlowSchema

  const originalJsonSchema = new Map<string, string>();

  const { globalStateSchema, ...others } = flow;

  // Transform globalStateSchema from JSON Schema to Zod Schema
  const parsedGlobalStateSchema = jsonSchemaToZod(flow.globalStateSchema);
  originalJsonSchema.set("globalStateSchema", flow.globalStateSchema);

  // Transform paramsSchema for each step from JSON Schema to Zod Schema
  const parsedSteps: ParsedStep[] = flow.steps.map((step) => {
    const { paramsSchema, ...others } = step;
    let paramsZodSchema;
    if (paramsSchema) {
      paramsZodSchema = jsonSchemaToZod(paramsSchema);
      originalJsonSchema.set(step.id, paramsSchema);
    }
    const parsedStep: ParsedStep = { ...others, paramsZodSchema };
    return parsedStep;
  });

  return {
    ...others,
    globalStateZodSchema: parsedGlobalStateSchema,
    steps: parsedSteps,

    _internal: {
      originalJsonSchema,
    },
  };
}

/**
 * Serializes a ParsedFlow object into a formatted JSON string, converting Zod schemas back to JSON schemas.
 * @param flow The ParsedFlow object to serialize.
 * @returns A JSON string representation of the flow.
 */
export function saveToJson(flow: ParsedFlow): string {
  // Convert globalStateSchema from Zod Schema back to JSON Schema
  const rawGlobalStateSchema =
    flow._internal.originalJsonSchema.get("globalStateSchema");
  const { globalStateZodSchema, _internal, ...others } = flow;

  // Convert paramsSchema for each step from Zod Schema back to JSON Schema
  const rawSteps = flow.steps.map((step) => {
    const { paramsZodSchema, ...others } = step;
    const rawStep: Step = { ...others };
    if (step.paramsZodSchema) {
      rawStep.paramsSchema = flow._internal.originalJsonSchema.get(step.id);
    }
    return rawStep;
  });

  const rawFlow: Flow = {
    ...others,
    globalStateSchema: rawGlobalStateSchema,
    steps: rawSteps,
  };

  // Ensure the raw flow object is valid before saving.
  FlowSchema.parse(rawFlow);
  return orderedJsonStringify(rawFlow, KEY_ORDERS, 2);
}

export const JSON_SCHEMA: any = toJSONSchema(FlowSchema, {
  target: "draft-7",
  io: "input",
});

export type FlowError = {
  code:
    | "CONNECTION_ERROR"
    | "GLOBAL_STATE_VALIDATION_ERROR"
    | "STEP_PARAMS_VALIDATION_ERROR";
  message: string;
};

/**
 * Validates a ParsedFlow object for connection integrity and schema adherence.
 * @param flow The ParsedFlow object to validate.
 * @returns An array of FlowError objects if any validation errors are found, otherwise an empty array.
 */
export function validate(flow: ParsedFlow): FlowError[] {
  const errors: FlowError[] = [];
  const stepIds = new Set(flow.steps.map((step) => step.id));

  // 1. Connection Validation
  for (const connection of flow.connections) {
    if (!stepIds.has(connection.sourceStepId)) {
      errors.push({
        code: "CONNECTION_ERROR",
        message: `Connection error on id=${connection.id}: Source step with ID '${connection.sourceStepId}' not found.`,
      });
    }
    if (!stepIds.has(connection.targetStepId)) {
      errors.push({
        code: "CONNECTION_ERROR",
        message: `Connection error on id=${connection.id}: Target step with ID '${connection.targetStepId}' not found.`,
      });
    }
  }

  // 2. State/Parameter Validation
  // Validate global state
  if (flow.globalState && flow.globalStateZodSchema) {
    const globalStateValidation = flow.globalStateZodSchema.safeParse(
      flow.globalState
    );
    if (!globalStateValidation.success) {
      errors.push({
        code: "GLOBAL_STATE_VALIDATION_ERROR",
        message: `Global state validation error: ${prettifyError(
          globalStateValidation.error
        )}`,
      });
    }
  }

  // Validate step parameters
  for (const step of flow.steps) {
    if (step.params && step.paramsZodSchema) {
      const stepParamsValidation = step.paramsZodSchema.safeParse(step.params);
      if (!stepParamsValidation.success) {
        errors.push({
          code: "STEP_PARAMS_VALIDATION_ERROR",
          message: `Step '${
            step.id
          }' parameters validation error: ${prettifyError(
            stepParamsValidation.error
          )}`,
        });
      }
    }
  }

  return errors;
}

export {
  FlowSchema,
  type Flow,
  type Step,
  type ParsedFlow,
  type ParsedStep,
  type Connection,
};
