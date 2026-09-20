import ads from '../data/monetization.json';
export function GET() { return new Response(ads.adsense.adsTxt.trim() ? ads.adsense.adsTxt.trim() + '\n' : '# No authorized advertising sellers configured.\n', {headers:{'Content-Type':'text/plain; charset=utf-8'}}); }
