import site from '../data/site.json';
import { jobs } from '../data/jobs';
const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
export function GET() {
const paths = ['/', '/guide/', '/about/', '/editorial/', '/privacy/', '/contact/', ...jobs.map(job => '/jobs/' + job.slug + '/')];
const entries = site.url && site.ready ? paths.map(path => '<url><loc>' + escape(new URL(path, site.url).href) + '</loc></url>').join('') : '';
return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + entries + '</urlset>', {headers:{'Content-Type':'application/xml; charset=utf-8'}});
}