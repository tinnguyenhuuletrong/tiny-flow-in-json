import type { Step } from "@tiny-json-workflow/core";

// Only allow edit connection side for these node type
// Exclude begin and end for now
export const SUPPORT_CONNECTION_EDIT: Array<Step["type"]> = [
  "task",
  "decision",
  "resumeAfter",
  "waitForEvent",
];
