import fs from 'node:fs';
import assert from 'node:assert/strict';
import { validateMonetization } from '../src/lib/monetization.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const read=p=>JSON.parse(fs.readFileSync(new URL('../src/data/'+p,import.meta.url),'utf8'));
const jobs=read('jobs.json'), services=read('services.json'), site=read('site.json');
const ids=new Set(), slugs=new Set();
const https=value=>{try {const url=new URL(value);return url.protocol==='https:' && !url.username && !url.password;}catch{return false;}};
for(const service of services){assert(service.id && !ids.has(service.id),'Duplicate or empty service ID');ids.add(service.id);assert(https(service.url),'Invalid service URL');assert(!service.affiliateUrl || https(service.affiliateUrl),'Invalid affiliate URL');}
for(const job of jobs){assert(/^[a-z][a-z0-9-]*$/.test(job.slug) && !slugs.has(job.slug),'Invalid or duplicate slug');slugs.add(job.slug);assert(['draft','published'].includes(job.status),'Invalid status');for(const key of ['name','reading','category','icon','description','equipment','first','work','cost'])assert(typeof job[key]==='string' && job[key].trim(),job.slug+': missing '+key);for(const key of ['tags','suitable','steps','cautions','services','faq'])assert(Array.isArray(job[key]) && job[key].length,job.slug+': missing '+key);assert(Number.isFinite(job.score),'Invalid order');assert(/^\d{4}-\d{2}-\d{2}$/.test(job.updated) && !Number.isNaN(Date.parse(job.updated)),'Invalid date');assert(job.faq.every(item=>Array.isArray(item)&&item.length===2&&item.every(text=>typeof text==='string'&&text.trim())),'Invalid FAQ');assert(job.services.every(id=>ids.has(id)),'Unknown service');}
assert(!site.url || https(site.url),'Site URL must be HTTPS');
assert(!site.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email),'Invalid contact email');
console.log('Content checks passed: '+jobs.filter(job=>job.status==='published').length+' published articles.');
const missing=[];
if(!site.url)missing.push('正式URL');if(!site.operator)missing.push('運営者名');if(!site.email)missing.push('問い合わせメール');if(!site.ready)missing.push('一般公開の準備完了設定');
if(missing.length)console.log('公開前の残項目: '+missing.join(' / '));
if(process.argv.includes('--release')){assert(missing.length===0,'公開設定が未完了です。src/data/site.json を確認してください。');}

const ads=read('monetization.json');
validateMonetization(ads);
for(const banner of Object.values(ads.banners)){if(banner.image)assert(fs.existsSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../public', banner.image)),'広告画像が見つかりません: '+banner.image);}
console.log('Monetization checks passed: ' + ads.provider);
