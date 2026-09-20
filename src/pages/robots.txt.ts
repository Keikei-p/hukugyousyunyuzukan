import site from '../data/site.json';
export function GET() {
return new Response('User-agent: *\nAllow: /\n' + (site.url && site.ready ? 'Sitemap: ' + new URL('/sitemap.xml', site.url).href + '\n' : ''), {headers:{'Content-Type':'text/plain; charset=utf-8'}});
}