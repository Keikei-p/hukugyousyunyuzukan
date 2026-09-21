import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
export function sourceHash(){
 const files=[];
 const walk=p=>{for(const item of fs.readdirSync(p,{withFileTypes:true})){const file=path.join(p,item.name);if(item.isDirectory())walk(file);else if(item.isFile())files.push(file);}};
 for(const folder of ['src','scripts','public'])walk(folder);
 files.push('package.json','package-lock.json','astro.config.mjs','tsconfig.json','wrangler.jsonc');
 const hash=createHash('sha256');
 for(const file of files.map(file=>file.replaceAll('\\','/')).sort()){hash.update(file.replaceAll('\\','/')+'\0');const data=fs.readFileSync(file);hash.update(/\.(jsonc?|m?js|ts|astro|css|svg|txt|html)$/.test(file)?data.toString('utf8').replaceAll('\r\n','\n'):data);hash.update('\0');}
 return hash.digest('hex');
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){fs.writeFileSync('dist/release.json',JSON.stringify({sourceHash:sourceHash()})+'\n');console.log('Release fingerprint generated.');}
