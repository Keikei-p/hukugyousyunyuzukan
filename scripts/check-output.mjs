import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const dist=path.resolve('dist');
const site=JSON.parse(fs.readFileSync('src/data/site.json','utf8'));
const ads=JSON.parse(fs.readFileSync('src/data/monetization.json','utf8'));
const jobs=JSON.parse(fs.readFileSync('src/data/jobs.json','utf8')).filter(job=>job.status==='published');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
const htmlFiles=walk(dist).filter(file=>file.endsWith('.html'));
let internalLinks=0;
for(const file of htmlFiles){
 const html=fs.readFileSync(file,'utf8');
 assert(/<html[^>]*lang="ja"/.test(html),'Missing Japanese lang: '+file);
 assert(/<title>[^<]+<\/title>/.test(html),'Missing title: '+file);
 assert(/name="description"/.test(html),'Missing description: '+file);
 assert((html.match(/<h1(?:\s|>)/g)||[]).length===1,'One H1 required: '+file);
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
 assert(ids.length===new Set(ids).size,'Duplicate IDs: '+file);
 if(!site.ready || file.endsWith('404.html'))assert(html.includes('noindex,follow'),'Preview/404 must be noindex');
 else assert(/name="robots" content="index,follow"/.test(html),'Public pages must be indexable');
 if(ads.provider !== 'adsense')assert(!/<script[^>]+src="https:\/\/pagead2/.test(html),'Disabled ad script must not load');
 if(ads.provider === 'none')assert(!html.includes('data-placement='),'Disabled ad slots must not render');
 if(site.url)assert(html.includes('rel="canonical"'),'Missing canonical: '+file);
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)){
   const value=match[1].replaceAll('&amp;','&');
   if(!value.startsWith('/') || value.startsWith('//'))continue;
   const url=new URL(value,'https://local.test');
   const target=path.join(dist,decodeURIComponent(url.pathname));
   assert(fs.existsSync(target) || fs.existsSync(path.join(target,'index.html')),'Broken local link '+value+' in '+file);
   internalLinks++;
 }
}
for(const job of jobs)assert(fs.existsSync(path.join(dist,'jobs',job.slug,'index.html')),'Missing guide '+job.slug);
assert(fs.existsSync(path.join(dist,'404.html')),'Missing 404');
const sitemap=fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8');
assert(!sitemap.includes('localhost'),'Localhost in sitemap');
if(site.ready){for(const job of jobs)assert(sitemap.includes('/jobs/'+job.slug+'/'),'Missing sitemap entry');}
console.log('Output checks passed: '+htmlFiles.length+' pages, '+internalLinks+' internal links/assets.');
