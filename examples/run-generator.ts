import { generate } from "@tiny-json-workflow/ts-generator";
import path from "path";
import { rmSync } from "fs";

async function genCode() {
  const jsonPath = path.join(__dirname, "./workflow_with_params.json");
  // const jsonPath = path.join(__dirname, "./workflow.json");
  const tsPath = path.join(__dirname, "./.generated-workflow.ts");

  rmSync(tsPath, { force: true });

  await generate(jsonPath, tsPath);

  console.log(`${jsonPath} -> ${tsPath}`);
}

async function runCode() {
  const { createWorkflow } = await import("./.generated-workflow.ts");
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

  console.log("end", ins.listPendingResume());
  console.log("finalWorkflowData:");
  console.dir(ins.toJSON(), { depth: 10 });
}

async function main() {
  console.info(`Gen code:`);
  await genCode();

  console.info(`Run code:`);
  await runCode();
}
main();
