import assert from 'node:assert/strict';
export const placements = ['home', 'article'];
export function isHttps(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; }
  catch { return false; }
}
export function validateMonetization(config) {
  assert(['none', 'banner', 'adsense'].includes(config.provider), '広告方式は none / banner / adsense です');
  assert(config.adsense && config.banners, '広告設定がありません');
  const {client, slots, adsTxt} = config.adsense;
  assert(typeof client === 'string' && (!client || /^ca-pub-\d{16}$/.test(client)), 'AdSenseクライアントIDが不正です');
  assert(typeof adsTxt === 'string', 'ads.txt は文字列で指定してください');
  if (adsTxt.trim()) {
    assert(client, 'ads.txt の設定にはクライアントIDも必要です');
    for (const line of adsTxt.trim().split(/\r?\n/)) {
      assert(new RegExp('^google\\.com,\\s*' + client.slice(3) + ',\\s*(DIRECT|RESELLER),\\s*f08c47fec0942fa0$').test(line.trim()), 'ads.txt は発行されたGoogleの行を指定し、IDを一致させてください');
    }
  }
  for (const placement of placements) {
    assert(typeof slots?.[placement] === 'string' && (!slots[placement] || /^\d+$/.test(slots[placement])), '広告枠IDは数字です');
    const banner = config.banners[placement];
    assert(banner && ['title','description','url','image','imageAlt'].every(key => typeof banner[key] === 'string'), 'バナー設定の形式が不正です');
    assert(!banner.url || isHttps(banner.url), 'バナーリンクはHTTPSを指定してください');
    assert(!banner.image || /^\/ads\/[a-zA-Z0-9_-]+\.(png|jpe?g|webp|avif)$/.test(banner.image), '広告画像は /ads/ 内の画像ファイルを指定してください');
    if(banner.image) assert(banner.imageAlt.trim(), '広告画像の説明を入力してください');
    if(config.provider === 'banner' && banner.url) assert(banner.title.trim(), 'バナーの広告名を入力してください');
  }
  if(config.provider === 'adsense') {
    assert(client, 'AdSenseクライアントIDを入力してください');
    assert(placements.some(p => slots[p]), '少なくとも1つの広告枠IDを入力してください');
  }
  if(config.provider === 'banner') assert(placements.some(p => config.banners[p].url), '少なくとも1つの広告リンクを入力してください');
}
export function resolveAd(config, placement) {
  if(!placements.includes(placement)) return null;
  if(config.provider === 'adsense' && config.adsense.client && config.adsense.slots[placement]) return {type:'adsense', client:config.adsense.client, slot:config.adsense.slots[placement]};
  if(config.provider === 'banner' && config.banners[placement].url) return {type:'banner', ...config.banners[placement]};
  return null;
}
