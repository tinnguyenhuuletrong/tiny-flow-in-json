import { type Flow, FlowSchema } from "./types";

/**
 * Parses a JSON string into a validated Flow object.
 * @param jsonString The JSON string to parse.
 * @returns A validated Flow object.
 * @throws Will throw an error if the JSON is invalid or doesn't match the Flow schema.
 */
export function parseFromJson(jsonString: string): Flow {
  const json = JSON.parse(jsonString);
  return FlowSchema.parse(json);
}

/**
 * Serializes a Flow object into a formatted JSON string.
 * @param flow The Flow object to serialize.
 * @returns A JSON string representation of the flow.
 */
export function saveToJson(flow: Flow): string {
  // Ensure the flow object is valid before saving.
  FlowSchema.parse(flow);
  return JSON.stringify(flow, null, 2);
}
