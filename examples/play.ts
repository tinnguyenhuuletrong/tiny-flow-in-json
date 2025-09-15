import { parseFromJson } from "@tiny-json-workflow/core";

const simpleOnboardingFlow = `{
    "id": "onboarding-flow-v1",
    "name": "User Onboarding Flow",
    "version": "1.0.0",
    "globalStateSchema": {
      "type": "object",
      "properties": {
        "userId": { "type": "string" },
        "profileIsComplete": { "type": "boolean", "default": false }
      },
      "required": ["userId"]
    },
    "steps": [
      { "id": "start-flow", "name": "Begin Onboarding", "type": "begin" },
      {
        "id": "send-welcome",
        "name": "Send Welcome Email",
        "type": "task",
        "paramsSchema": {
          "type": "object",
          "properties": {
            "template": { "type": "string", "default": "welcome-email-v2" }
          }
        },
        "metadata": { "owner": "engagement-team" }
      },
      { "id": "check-profile", "name": "Is Profile Complete?", "type": "decision" },
      { "id": "send-reminder", "name": "Send Profile Reminder", "type": "task" },
      { "id": "end-flow", "name": "End Onboarding", "type": "end" }
    ],
    "connections": [
      { "id": "c1", "sourceStepId": "start-flow", "targetStepId": "send-welcome" },
      { "id": "c2", "sourceStepId": "send-welcome", "targetStepId": "check-profile" },
      { "id": "c3", "sourceStepId": "check-profile", "targetStepId": "end-flow", "condition": "state.profileIsComplete == true" },
      { "id": "c4", "sourceStepId": "check-profile", "targetStepId": "send-reminder", "condition": "state.profileIsComplete == false" },
      { "id": "c5", "sourceStepId": "send-reminder", "targetStepId": "end-flow" }
    ]
  }`;

const data = parseFromJson(simpleOnboardingFlow);
console.log(data);
