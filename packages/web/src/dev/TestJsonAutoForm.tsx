import { JsonAutoForm } from "@/app/components/shared/JsonAutoForm";
import { jsonSchemaToZod } from "@tiny-json-workflow/json-schema-adapter";
import z from "zod";

// @ts-ignore
const schema = jsonSchemaToZod({
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    priority: {
      type: "string",
      enum: ["low", "medium", "high", "urgent"],
    },
    isVip: {
      type: "boolean",
      default: false,
    },
    score: {
      type: "number",
    },
    date: {
      type: "string",
      format: "date",
    },
    dateTimeLocal: {
      type: "string",
      format: "date-time",
    },
    time: {
      type: "string",
      format: "time",
    },
    assignedAgentId: {
      type: "string",
    },
  },
  required: ["id", "priority"],
});

// @ts-ignore
const schemaDirect = z.object({
  date: z.coerce.date(),
});

// @ts-ignore
const nestedObjSchema = jsonSchemaToZod({
  type: "object",
  properties: {
    ticket: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        priority: {
          type: "string",
          enum: ["low", "medium", "high", "urgent"],
        },
        category: {
          type: "string",
          enum: ["technical", "billing", "general"],
        },
        isVip: {
          type: "boolean",
          default: false,
        },
      },
      required: ["id", "priority", "category"],
    },
    assignedAgentId: {
      type: "string",
    },
  },
  required: ["ticket"],
});

// console.log(JSON.stringify(nestedObjSchema._zod.def, null, 2));

export const TestJsonAutoForm = () => {
  return (
    <div className="p-5">
      <JsonAutoForm
        schema={schema as any}
        data={{}}
        onDataChange={console.log}
      />
    </div>
  );
};
