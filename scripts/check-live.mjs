import fs from 'node:fs';
import assert from 'node:assert/strict';
import { sourceHash } from './release-id.mjs';
const site=JSON.parse(fs.readFileSync('src/data/site.json','utf8'));
const origin=new URL(site.url);
assert(origin.protocol==='https:','Live checks require HTTPS');
async function get(route){const url=new URL(route,origin);url.searchParams.set('_verify',Date.now().toString());const response=await fetch(url,{signal:AbortSignal.timeout(20000),cache:'no-store'});assert(new URL(response.url).origin===origin.origin,'Unexpected redirect');return response;}
const release=await get('/release.json');assert(release.status===200,'Release fingerprint is not deployed');assert((await release.json()).sourceHash===sourceHash(),'Live version does not match local source');
for(const route of ['/','/about/','/contact/','/privacy/','/jobs/ai-writing/']){const response=await get(route);assert(response.status===200,route+' is not public');const html=await response.text();assert(html.includes('<html lang="ja"')||/<html[^>]*lang="ja"/.test(html),'Unexpected page');assert(html.includes('index,follow')&&!html.includes('noindex,follow'),'Unexpected robots');assert(html.includes(site.url),'Canonical host mismatch');if(route==='/contact/')assert(html.includes('mailto:'+site.email),'Missing contact address');}
const sitemap=await get('/sitemap.xml');assert(sitemap.ok && (await sitemap.text()).includes(site.url+'/jobs/ai-writing/'),'Sitemap mismatch');
console.log('Live deployment verified: exact source fingerprint and public pages at '+site.url);
