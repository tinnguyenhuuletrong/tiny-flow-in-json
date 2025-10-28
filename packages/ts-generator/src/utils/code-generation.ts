import type { JsonSchema } from "@tiny-json-workflow/core/src/types";

export function generateTypeFromSchema(
  schema: JsonSchema,
  indentLevel: number
): string {
  if (!schema) return "any";

  const indent = "  ".repeat(indentLevel);
  const closingIndent = "  ".repeat(indentLevel > 0 ? indentLevel - 1 : 0);

  switch (schema.type) {
    case "string":
      if (schema.enum) {
        return schema.enum.map((val: string) => `"${val}"`).join(" | ");
      }
      return "string";
    case "number":
    case "integer":
      return "number";
    case "boolean":
      return "boolean";
    case "array":
      if (schema.items) {
        const itemType = generateTypeFromSchema(schema.items, indentLevel);
        return `${itemType}[]`;
      }
      return "any[]";
    case "object":
      if (schema.properties) {
        const properties = Object.entries(schema.properties)
          .map(([key, value]: [string, any]) => {
            const isRequired = schema.required?.includes(key);
            const propertyType = generateTypeFromSchema(value, indentLevel + 1);
            return `${indent}${key}${isRequired ? "" : "?"}: ${propertyType};`;
          })
          .join("\n");
        return `{\n${properties}\n${closingIndent}}`;
      }
      return "Record<string, any>";
    default:
      if (Array.isArray(schema.type)) {
        return schema.type
          .map((t: any) => generateTypeFromSchema({ type: t }, indentLevel))
          .join(" | ");
      }
      return "any";
  }
}
