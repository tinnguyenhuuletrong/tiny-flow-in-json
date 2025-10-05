import { join } from "path";
import { parseFromJson } from "@tiny-json-workflow/core";
import { flowToSvg } from "@tiny-json-workflow/svg-export";

// const filePath = "./data/simple.json";
const filePath = "./data/routingFlow.json";
// const filePath = "./data/forkJoinFlow.json";

const filedata = await Bun.file(join(__dirname, filePath)).text();

const ins = parseFromJson(filedata);
console.log(ins);

const svg = flowToSvg(ins);
console.log(svg);

Bun.write(join(__dirname, ".render.svg"), svg);
