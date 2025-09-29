import { ZOD_FIELD_CONFIG_SYMBOL } from "@autoform/zod";
import type { CheckFn } from "zod/v4/core";
export type Renderable<AdditionalRenderable = null> =
  | string
  | number
  | boolean
  | null
  | undefined
  | AdditionalRenderable;

export interface FieldConfig<
  AdditionalRenderable = null,
  FieldTypes = string,
  FieldWrapper = any,
  CustomData = Record<string, any>
> {
  description?: Renderable<AdditionalRenderable>;
  inputProps?: Record<string, any>;
  label?: Renderable<AdditionalRenderable>;
  fieldType?: FieldTypes;
  order?: number;
  fieldWrapper?: FieldWrapper;
  customData?: CustomData;
}

export function fieldConfig<
  AdditionalRenderable = null,
  FieldTypes = string,
  FieldWrapper = any,
  CustomData = Record<string, any>
>(
  config: FieldConfig<
    AdditionalRenderable,
    FieldTypes,
    FieldWrapper,
    CustomData
  >
): CheckFn<any> {
  const refinementFunction: any = () => {};

  refinementFunction[ZOD_FIELD_CONFIG_SYMBOL] = config;

  return refinementFunction;
}
