import { JSON_SCHEMA } from '../src';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const schema = JSON.stringify(JSON_SCHEMA, null, 2);
const outputPath = resolve(__dirname, '../schema.json');

writeFileSync(outputPath, schema);

console.log(`JSON schema generated at ${outputPath}`);
