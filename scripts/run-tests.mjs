import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { run } from 'node:test';
const directory=fileURLToPath(new URL('./tests/',import.meta.url));
const files=fs.readdirSync(directory).filter(name=>name.endsWith('.test.mjs')).sort().map(name=>path.join(directory,name));
if(!files.length)throw new Error('No test files found; refusing to pass an empty test run.');
let count=0, failed=false;
for await(const event of run({files})){
 if(event.type==='test:pass'||event.type==='test:fail'){
  const data=event.data;
  const fileOnly=files.includes(path.resolve(data.name));
  if(event.type==='test:fail')failed=true;
  if(!fileOnly && !data.skip && !data.todo && data.details?.type!=='suite')count++;
  console.log(event.type+' '+data.name);
 }
}
if(failed)throw new Error('Test failures detected.');
if(!count)throw new Error('Zero tests executed; refusing to pass.');
console.log('Verified '+count+' executed tests.');
