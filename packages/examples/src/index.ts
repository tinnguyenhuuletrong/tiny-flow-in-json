import onboarding from "./user-onboarding/workflow.json";
import routingFlow from "./support-ticket-routing/workflow.json";
import ecommerce from "./e-commerce-order-fulfillment/workflow.json";
import dynamicForm from "./dynamic-multi-step-form/workflow.json";
import forkJoinFlow from "./fork-join-flow/workflow.json";
import trialConversionFlow from "./trial-conversion-flow/workflow.json";

function replaceSchemaLink(examples: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(examples).map(([k, v]) => {
      return [
        k,
        {
          ...v,
          $schema:
            "https://tinnguyenhuuletrong.github.io/tiny-flow-in-json/schema/latest/flow.json",
        },
      ];
    })
  );
}

export const examples = replaceSchemaLink({
  onboarding,
  routingFlow,
  ecommerce,
  dynamicForm,
  forkJoinFlow,
  trialConversionFlow,
});
