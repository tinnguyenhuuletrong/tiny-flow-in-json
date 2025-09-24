import { jsonSchemaToZod } from "@n8n/json-schema-to-zod"; // Added import
import zodToJsonSchema from "zod-to-json-schema";
import {
  type Flow,
  FlowSchema,
  type Step,
  type ParsedFlow,
  type ParsedStep,
} from "./types"; // Updated import

/**
 * Parses a JSON string into a validated Flow object, converting JSON schemas to Zod schemas.
 * @param jsonString The JSON string to parse.
 * @returns A validated ParsedFlow object with Zod schemas.
 * @throws Will throw an error if the JSON is invalid or doesn't match the Flow schema.
 */
export function parseFromJson(jsonString: string): ParsedFlow {
  const json = JSON.parse(jsonString);
  const flow = FlowSchema.parse(json); // Validate against the raw FlowSchema

  const { globalStateSchema, ...others } = flow;

  // Transform globalStateSchema from JSON Schema to Zod Schema
  const parsedGlobalStateSchema = jsonSchemaToZod(flow.globalStateSchema);

  // Transform paramsSchema for each step from JSON Schema to Zod Schema
  const parsedSteps: ParsedStep[] = flow.steps.map((step) => {
    const { paramsSchema, ...others } = step;
    const parsedStep: ParsedStep = { ...others };
    if (paramsSchema) {
      parsedStep.paramsZodSchema = jsonSchemaToZod(paramsSchema);
    }
    return parsedStep;
  });

  return {
    ...others,
    globalStateZodSchema: parsedGlobalStateSchema,
    steps: parsedSteps,
  };
}

/**
 * Serializes a ParsedFlow object into a formatted JSON string, converting Zod schemas back to JSON schemas.
 * @param flow The ParsedFlow object to serialize.
 * @returns A JSON string representation of the flow.
 */
export function saveToJson(flow: ParsedFlow): string {
  // Convert globalStateSchema from Zod Schema back to JSON Schema
  const rawGlobalStateSchema = zodToJsonSchema(flow.globalStateZodSchema);
  const { globalStateZodSchema, ...others } = flow;

  // Convert paramsSchema for each step from Zod Schema back to JSON Schema
  const rawSteps = flow.steps.map((step) => {
    const { paramsZodSchema, ...others } = step;
    const rawStep: Step = { ...others };
    if (step.paramsZodSchema) {
      rawStep.paramsSchema = zodToJsonSchema(step.paramsZodSchema);
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
  return JSON.stringify(rawFlow, null, 2);
}

export const JSON_SCHEMA = zodToJsonSchema(FlowSchema, {
  name: "FlowJSONSchema",
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
        message: `Connection error: Source step with ID '${connection.sourceStepId}' not found.`,
      });
    }
    if (!stepIds.has(connection.targetStepId)) {
      errors.push({
        code: "CONNECTION_ERROR",
        message: `Connection error: Target step with ID '${connection.targetStepId}' not found.`,
      });
    }
  }

  // 2. State/Parameter Validation
  // Validate global state
  if (flow.state && flow.globalStateZodSchema) {
    const globalStateValidation = flow.globalStateZodSchema.safeParse(
      flow.state
    );
    if (!globalStateValidation.success) {
      errors.push({
        code: "GLOBAL_STATE_VALIDATION_ERROR",
        message: `Global state validation error: ${globalStateValidation.error.message}`,
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
          message: `Step '${step.id}' parameters validation error: ${stepParamsValidation.error.message}`,
        });
      }
    }
  }

  return errors;
}

export { type Flow, type Step, type ParsedFlow, type ParsedStep };
