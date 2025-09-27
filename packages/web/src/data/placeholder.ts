import { type ParsedFlow, parseFromJson } from "@tiny-json-workflow/core";

export const placeholderFlow: ParsedFlow = parseFromJson(
  JSON.stringify({
    id: "onboarding-flow-v1",
    name: "User Onboarding Flow",
    version: "1.0.0",
    globalStateSchema: {
      type: "object",
      properties: {
        userId: {
          type: "string",
        },
        profileIsComplete: {
          type: "boolean",
          default: false,
        },
      },
      required: ["userId"],
    },
    state: {
      userId: "001",
      profileIsComplete: true,
    },
    steps: [
      {
        id: "start-flow",
        name: "Begin Onboarding",
        type: "begin",
        metadata: {
          x: 12,
          y: 37,
        },
      },
      {
        id: "send-welcome",
        name: "Send Welcome Email",
        type: "task",
        paramsSchema: {
          type: "object",
          properties: {
            template: {
              type: "string",
              default: "welcome-email-v2",
            },
          },
        },
        metadata: {
          owner: "engagement-team",
          x: 412,
          y: 37,
        },
      },
      {
        id: "check-profile",
        name: "Is Profile Complete?",
        type: "decision",
        metadata: {
          x: 812,
          y: 37,
        },
      },
      {
        id: "send-reminder",
        name: "Send Profile Reminder",
        type: "task",
        metadata: {
          x: 1202.766789125643,
          y: 139.94592211609114,
        },
      },
      {
        id: "end-flow",
        name: "End Onboarding",
        type: "end",
        metadata: {
          x: 1612,
          y: 37,
        },
      },
    ],
    connections: [
      {
        id: "c1",
        sourceStepId: "start-flow",
        targetStepId: "send-welcome",
      },
      {
        id: "c2",
        sourceStepId: "send-welcome",
        targetStepId: "check-profile",
      },
      {
        id: "c3",
        sourceStepId: "check-profile",
        targetStepId: "end-flow",
        condition: "state.profileIsComplete == true",
      },
      {
        id: "c4",
        sourceStepId: "check-profile",
        targetStepId: "send-reminder",
        condition: "state.profileIsComplete == false",
      },
      {
        id: "c5",
        sourceStepId: "send-reminder",
        targetStepId: "end-flow",
      },
    ],
    metadata: {
      reactflowViewport: {
        x: 52.76604278074876,
        y: 342.5353721033868,
        zoom: 0.758132798573975,
      },
    },
  })
);
