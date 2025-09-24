import { zodToJsonSchema } from "zod-to-json-schema";
import { FlowSchema } from "@tiny-json-workflow/core/src/types";

export const flowJsonSchema = zodToJsonSchema(FlowSchema, {
  name: "FlowJSONSchema",
  $refStrategy: "none", // Avoids $ref generation for simplicity in this context
});
