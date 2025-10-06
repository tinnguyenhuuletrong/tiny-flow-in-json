import {
  type Flow,
  type ParsedFlow,
  parseFromJson,
} from "@tiny-json-workflow/core";

export const placeholderFlow: ParsedFlow = parseFromJson(
  JSON.stringify({
    $schema:
      "https://tinnguyenhuuletrong.github.io/tiny-flow-in-json/schema/latest/flow.json",
    id: "some_id",
    name: "UPDATE_ME",
    version: "1.0.0",
    globalState: {
      userId: "001",
    },
    globalStateSchema: {
      type: "object",
      properties: {
        userId: {
          type: "string",
        },
      },
      required: ["userId"],
    },
    steps: [
      {
        id: "start-flow",
        name: "Begin",
        type: "begin",
        metadata: {
          x: 15,
          y: 30,
        },
      },
      {
        id: "do-something",
        name: "Do Something",
        type: "task",
        metadata: {
          x: 150,
          y: 0,
        },
        paramsSchema: {
          type: "object",
          properties: {
            message: {
              type: "string",
              default: "update-me!",
            },
          },
        },
      },
      {
        id: "end-flow",
        name: "End",
        type: "end",
        metadata: {
          x: 495,
          y: 30,
        },
      },
    ],
    connections: [
      {
        id: "c1",
        sourceStepId: "start-flow",
        targetStepId: "do-something",
      },
      {
        id: "c2",
        sourceStepId: "do-something",
        targetStepId: "end-flow",
      },
    ],
    metadata: {
      reactflowViewport: {
        x: 17.65411931818187,
        y: 438.7223011363636,
        zoom: 1.6654829545454544,
      },
    },
  } satisfies Flow)
);
