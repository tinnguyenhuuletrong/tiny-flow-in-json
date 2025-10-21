import { generate } from "@tiny-json-workflow/ts-generator";
import path from "path";

async function genCode() {
  const jsonPath = path.join(__dirname, "./workflow.json");
  const tsPath = path.join(__dirname, "./.generated-workflow.ts");

  await generate(jsonPath, tsPath);

  console.log(`${jsonPath} -> ${tsPath}`);
}

async function runCode() {
  const { createWorkflow } = await import("./.generated-workflow.ts");
  let ins = createWorkflow();
  ins.setState({
    userId: "u1",
    email: "abc@def.com",
  });

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
