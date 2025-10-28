import type { JsonSchema } from "@tiny-json-workflow/core/src/types";
import { generateTypeFromSchema } from "./code-generation";

export function generateTStateShape(
  globalStateSchema: JsonSchema,
  globalState?: Record<string, any>
): string {
  const shape = globalStateSchema
    ? generateTypeFromSchema(globalStateSchema, 1)
    : "Record<string, any>";

  const stateShapeType = `type TStateShape = ${shape};`;

  let defaultState =
    "export const defaultState: TStateShape | undefined = undefined;";
  if (globalState) {
    defaultState = `export const defaultState: TStateShape = ${JSON.stringify(
      globalState,
      null,
      2
    )};`;
  }

  return [stateShapeType, defaultState].join("\n\n");
}

export function generateTParamsShape(
  paramsSchema: JsonSchema,
  stepId: string
): string {
  const shape = generateTypeFromSchema(paramsSchema, 1);
  return `export type T${stepId}Params = ${shape} | undefined;`;
}
