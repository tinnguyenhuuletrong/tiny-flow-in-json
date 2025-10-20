import { createWorkflow } from "./.generated-workflow.ts";

async function main() {
  let ins = createWorkflow();

  console.log("begin");

  {
    for await (const it of ins.exec()) {
    }
    console.log(
      " ",
      "currentStep=",
      ins.currentStep,
      ",currentState=",
      ins.currentState
    );
  }

  console.log("end");
  console.log("finalWorkflowData:", ins.toJSON());
}
main();
