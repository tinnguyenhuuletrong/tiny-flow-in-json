import { z } from "zod";

import type { JsonSchemaObject } from "../types";
import { extendSchemaWithMessage } from "../utils/extend-schema";
import { fieldConfig } from "../utils/extend-autoForm";

export const parseString = (
  jsonSchema: JsonSchemaObject & { type: "string" }
) => {
  let zodSchema = z.string();

  zodSchema = extendSchemaWithMessage(
    zodSchema,
    jsonSchema,
    "format",
    (zs, format, errorMsg) => {
      switch (format) {
        case "email":
          return zs.email(errorMsg);
        case "uri":
          return zs.url(errorMsg);
        case "uuid":
          return zs.uuid(errorMsg);
        case "date-time":
          return zs
            .datetime({ offset: true, message: errorMsg, local: true })
            .check(
              fieldConfig({
                fieldType: "date-time",
              })
            );
        case "time":
          return zs.time(errorMsg).check(fieldConfig({ fieldType: "time" }));
        case "date":
          return zs.date(errorMsg).check(
            fieldConfig({
              fieldType: "date",
            })
          );
        case "binary":
          return zs.base64(errorMsg);
        case "duration":
          return zs.duration(errorMsg);
        default:
          return zs;
      }
    }
  );

  zodSchema = extendSchemaWithMessage(
    zodSchema,
    jsonSchema,
    "contentEncoding",
    (zs, _, errorMsg) => zs.base64(errorMsg)
  );
  zodSchema = extendSchemaWithMessage(
    zodSchema,
    jsonSchema,
    "pattern",
    (zs, pattern, errorMsg) => zs.regex(new RegExp(pattern), errorMsg)
  );
  zodSchema = extendSchemaWithMessage(
    zodSchema,
    jsonSchema,
    "minLength",
    (zs, minLength, errorMsg) => zs.min(minLength, errorMsg)
  );
  zodSchema = extendSchemaWithMessage(
    zodSchema,
    jsonSchema,
    "maxLength",
    (zs, maxLength, errorMsg) => zs.max(maxLength, errorMsg)
  );

  return zodSchema;
};
