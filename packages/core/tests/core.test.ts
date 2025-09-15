import { expect, test, describe } from "bun:test";
import { parseFromJson, saveToJson } from "../src";
import type { Flow } from "../src/types";

describe("FlowJSON Parsing and Serialization", () => {
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

  const routingFlow = `{
    "id": "support-ticket-router-v2",
    "name": "Customer Support Ticket Routing Flow",
    "version": "2.0.0",
    "globalStateSchema": {
      "type": "object",
      "properties": {
        "ticket": {
          "type": "object",
          "properties": {
            "id": { "type": "string" },
            "priority": { "type": "string", "enum": ["low", "medium", "high", "urgent"] },
            "category": { "type": "string", "enum": ["technical", "billing", "general"] },
            "isVip": { "type": "boolean", "default": false }
          },
          "required": ["id", "priority", "category"]
        },
        "assignedAgentId": { "type": "string" }
      },
      "required": ["ticket"]
    },
    "steps": [
      { "id": "start-routing", "name": "Begin Ticket Routing", "type": "begin" },
      { "id": "evaluate-ticket", "name": "Evaluate Ticket Priority & Category", "type": "decision" },
      { "id": "escalate-urgent", "name": "Escalate to L2 Tech Support", "type": "task" },
      { "id": "route-to-billing", "name": "Route to Billing Team", "type": "task" },
      { "id": "assign-general", "name": "Assign to General Support Queue", "type": "task" },
      { "id": "add-vip-tag", "name": "Tag as VIP Customer", "type": "task" },
      { "id": "send-confirmation", "name": "Send Confirmation to Customer", "type": "task" },
      { "id": "end-routing", "name": "End Routing Process", "type": "end" }
    ],
    "connections": [
      { "id": "c1", "sourceStepId": "start-routing", "targetStepId": "evaluate-ticket" },
      { "id": "c2-urgent", "sourceStepId": "evaluate-ticket", "targetStepId": "escalate-urgent", "condition": "state.ticket.priority == 'urgent' && state.ticket.category == 'technical'" },
      { "id": "c3-billing", "sourceStepId": "evaluate-ticket", "targetStepId": "route-to-billing", "condition": "state.ticket.category == 'billing'" },
      { "id": "c4-default", "sourceStepId": "evaluate-ticket", "targetStepId": "assign-general" },
      { "id": "c5-vip", "sourceStepId": "evaluate-ticket", "targetStepId": "add-vip-tag", "condition": "state.ticket.isVip == true" },
      { "id": "c6", "sourceStepId": "escalate-urgent", "targetStepId": "send-confirmation" },
      { "id": "c7", "sourceStepId": "route-to-billing", "targetStepId": "send-confirmation" },
      { "id": "c8", "sourceStepId": "assign-general", "targetStepId": "send-confirmation" },
      { "id": "c9", "sourceStepId": "add-vip-tag", "targetStepId": "end-routing" },
      { "id": "c10", "sourceStepId": "send-confirmation", "targetStepId": "end-routing" }
    ]
  }`;

  const forkJoinFlow = `{
    "id": "user-profile-update-v3",
    "name": "User Profile Update with Parallel Tasks",
    "version": "3.0.0",
    "globalStateSchema": {
      "type": "object",
      "properties": {
        "userId": { "type": "string" },
        "updatedFields": { "type": "array", "items": { "type": "string" } },
        "searchIndexStatus": { "type": "string" },
        "emailNotificationStatus": { "type": "string" }
      },
      "required": ["userId", "updatedFields"]
    },
    "steps": [
      { "id": "begin-update", "name": "Begin Profile Update", "type": "begin" },
      { "id": "fork-tasks", "name": "Initiate Parallel Tasks", "type": "task" },
      { "id": "update-search-index", "name": "Update Search Index", "type": "task" },
      { "id": "send-email-notification", "name": "Send 'Profile Updated' Email", "type": "task" },
      { "id": "join-tasks", "name": "Synchronize and Finalize", "type": "task" },
      { "id": "end-update", "name": "End Profile Update", "type": "end" }
    ],
    "connections": [
      { "id": "c1", "sourceStepId": "begin-update", "targetStepId": "fork-tasks" },
      { "id": "c2-path-A", "sourceStepId": "fork-tasks", "targetStepId": "update-search-index" },
      { "id": "c3-path-B", "sourceStepId": "fork-tasks", "targetStepId": "send-email-notification" },
      { "id": "c4-join-A", "sourceStepId": "update-search-index", "targetStepId": "join-tasks" },
      { "id": "c5-join-B", "sourceStepId": "send-email-notification", "targetStepId": "join-tasks" },
      { "id": "c6", "sourceStepId": "join-tasks", "targetStepId": "end-update" }
    ]
  }`;

  test("should successfully parse a simple onboarding flow", () => {
    const flow = parseFromJson(simpleOnboardingFlow);
    expect(flow.id).toBe("onboarding-flow-v1");
    expect(flow.steps.length).toBe(5);
    expect(flow.connections.length).toBe(5);
  });

  test("should successfully parse a routing flow", () => {
    const flow = parseFromJson(routingFlow);
    expect(flow.id).toBe("support-ticket-router-v2");
    expect(flow.steps.length).toBe(8);
    expect(flow.connections.length).toBe(10);
  });

  test("should successfully parse a fork-join flow", () => {
    const flow = parseFromJson(forkJoinFlow);
    expect(flow.id).toBe("user-profile-update-v3");
    expect(flow.steps.length).toBe(6);
    expect(flow.connections.length).toBe(6);
  });

  test("should throw an error for invalid JSON", () => {
    const invalidJson = `{
      "id": "invalid-flow",
      "name": "Invalid Flow",
      "steps": [ { "id": "a" } ] // Missing required fields
    }`;
    expect(() => parseFromJson(invalidJson)).toThrow();
  });

  test("should serialize a flow object to a JSON string", () => {
    const flowObject: Flow = parseFromJson(simpleOnboardingFlow);
    const jsonString = saveToJson(flowObject);
    expect(jsonString).toBeString();
    const parsed = JSON.parse(jsonString);
    expect(parsed.id).toBe("onboarding-flow-v1");
  });

  test("should maintain data integrity after a round trip (save -> parse)", () => {
    const originalFlow: Flow = parseFromJson(routingFlow);
    const jsonString = saveToJson(originalFlow);
    const newFlow = parseFromJson(jsonString);
    expect(newFlow).toEqual(originalFlow);
  });
});
