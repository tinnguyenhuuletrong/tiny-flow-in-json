import {
  FlowSchema,
  KEY_ORDERS,
  type Flow,
  type ParsedFlow,
  type ParsedStep,
  type StepTask,
  type StepWaitForEvent,
} from "./types"; // Updated import
import { jsonSchemaToZod } from "@tiny-json-workflow/json-schema-adapter";
import { prettifyError, toJSONSchema, ZodError } from "zod";
import { orderedJsonStringify } from "./utils/helper";

/**
 * Parses a JSON string into a validated Flow object, converting JSON schemas to Zod schemas.
 * @param jsonString The JSON string to parse.
 * @returns A validated ParsedFlow object with Zod schemas.
 * @throws Will throw an error if the JSON is invalid or doesn't match the Flow schema.
 */
export function parseFromJson(jsonString: string): ParsedFlow {
  let flow: Flow;
  try {
    const json = JSON.parse(jsonString);
    flow = FlowSchema.parse(json); // Validate against the raw FlowSchema
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Flow schema validation error: ${prettifyError(error)}`);
    }
    throw error;
  }

  const originalJsonSchema = new Map<string, string>();

  const { globalStateSchema, ...others } = flow;

  // Transform globalStateSchema from JSON Schema to Zod Schema
  const parsedGlobalStateSchema = jsonSchemaToZod(flow.globalStateSchema);
  originalJsonSchema.set(
    "globalStateSchema",
    JSON.stringify(flow.globalStateSchema)
  );

  // Transform paramsSchema for each step from JSON Schema to Zod Schema
  const parsedSteps: ParsedStep[] = flow.steps.map((step) => {
    if (step.type === "task") {
      const { paramsSchema, ...others } = step;
      let paramsZodSchema;
      if (paramsSchema) {
        paramsZodSchema = jsonSchemaToZod(paramsSchema);
        originalJsonSchema.set(step.id, JSON.stringify(paramsSchema));
      }
      const parsedStep: ParsedStep = { ...others, paramsZodSchema };
      return parsedStep;
    } else if (step.type === "waitForEvent") {
      const { eventInput, eventOutput, ...others } = step;
      let eventInputZodSchema;
      let eventOutputZodSchema;

      if (eventInput?.eventInputSchema) {
        eventInputZodSchema = jsonSchemaToZod(eventInput.eventInputSchema);
        originalJsonSchema.set(
          `${step.id}-eventInputSchema`,
          JSON.stringify(eventInput.eventInputSchema)
        );
      }
      if (eventOutput?.eventOutputSchema) {
        eventOutputZodSchema = jsonSchemaToZod(eventOutput.eventOutputSchema);
        originalJsonSchema.set(
          `${step.id}-eventOutputSchema`,
          JSON.stringify(eventOutput.eventOutputSchema)
        );
      }
      const parsedStep: ParsedStep = {
        ...others,
        eventInput: { value: eventInput?.value, eventInputZodSchema },
        eventOutput: { value: eventOutput?.value, eventOutputZodSchema },
      };
      return parsedStep;
    }
    return { ...step };
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
  const rawGlobalStateSchema = JSON.parse(
    flow._internal.originalJsonSchema.get("globalStateSchema") || "{}"
  );
  const { globalStateZodSchema, _internal, ...others } = flow;

  // Convert paramsSchema for each step from Zod Schema back to JSON Schema
  const rawSteps = flow.steps.map((step) => {
    if (step.type === "task") {
      const { paramsZodSchema, ...others } = step;
      const rawStep: StepTask = { ...others };
      if (step.paramsZodSchema) {
        rawStep.paramsSchema = JSON.parse(
          flow._internal.originalJsonSchema.get(step.id) || "{}"
        );
      }
      return rawStep;
    } else if (step.type === "waitForEvent") {
      const { eventInput, eventOutput, ...others } = step;
      const rawStep: StepWaitForEvent = { ...others };

      if (eventInput?.eventInputZodSchema) {
        rawStep.eventInput = {
          value: step.eventInput?.value,
          eventInputSchema: JSON.parse(
            flow._internal.originalJsonSchema.get(
              `${step.id}-eventInputSchema`
            ) || "{}"
          ),
        };
      }

      if (eventOutput?.eventOutputZodSchema) {
        rawStep.eventOutput = {
          value: step.eventOutput?.value,
          eventOutputSchema: JSON.parse(
            flow._internal.originalJsonSchema.get(
              `${step.id}-eventOutputSchema`
            ) || "{}"
          ),
        };
      }
      return rawStep;
    }
    return { ...step };
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
    | "STEP_PARAMS_VALIDATION_ERROR"
    | "SCHEMA_VALIDATION_ERROR"
    | "STEP_EVENT_INPUT_VALIDATION_ERROR"
    | "STEP_EVENT_OUTPUT_VALIDATION_ERROR";
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

  // Validate step parameters and event data
  for (const step of flow.steps) {
    if (step.type === "task" && step.params && step.paramsZodSchema) {
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
    } else if (step.type === "waitForEvent") {
      if (step.eventInput?.value && step?.eventInput?.eventInputZodSchema) {
        const eventInputValidation =
          step?.eventInput?.eventInputZodSchema.safeParse(
            step.eventInput.value
          );
        if (!eventInputValidation.success) {
          errors.push({
            code: "STEP_EVENT_INPUT_VALIDATION_ERROR",
            message: `Step '${
              step.id
            }' eventInput validation error: ${prettifyError(
              eventInputValidation.error
            )}`,
          });
        }
      }

      if (step.eventOutput?.value && step?.eventOutput?.eventOutputZodSchema) {
        const eventOutputValidation =
          step?.eventOutput?.eventOutputZodSchema.safeParse(
            step.eventOutput.value
          );
        if (!eventOutputValidation.success) {
          errors.push({
            code: "STEP_EVENT_OUTPUT_VALIDATION_ERROR",
            message: `Step '${
              step.id
            }' eventOutput validation error: ${prettifyError(
              eventOutputValidation.error
            )}`,
          });
        }
      }
    }
  }

  return errors;
}

export { computeDefaultHandler } from "./utils/helper";
export { FlowSchema };
export type * from "./types";
