export const categories = [
  { slug: 'ai', name: 'AI', description: '生成AIを文章・企画・制作の補助に使う副業。AIの出力を確認し、成果物まで仕上げる仕事を集めています。' },
  { slug: 'creative', name: 'クリエイティブ', description: '動画や短尺コンテンツなど、見せ方を工夫して制作する副業をまとめています。' },
  { slug: 'writing', name: 'ライティング', description: '文章を書く、整える、翻訳するなど、言葉を扱う副業をまとめています。' },
  { slug: 'sns', name: 'SNS', description: 'SNS投稿の企画・制作・運用を支える副業。スマホを活用しやすい仕事もあります。' },
  { slug: 'skill-selling', name: 'スキル販売', description: '自分の得意や経験をサービスとして販売する副業です。提供範囲を明確にすることが大切です。' },
  { slug: 'resale', name: '物販', description: '不要品販売など、商品を出品・販売する副業。送料や手数料まで含めて考えます。' },
  { slug: 'web', name: 'Web制作', description: 'WebサイトやLPを制作する副業。デザイン、実装、公開設定など仕事の範囲は案件ごとに変わります。' },
  { slug: 'development', name: 'IT・開発', description: 'プログラムや業務ツールを作る副業。仕様理解、実装、テストまで含めて考える分野です。' },
  { slug: 'support', name: '事務・サポート', description: 'データ入力、調査、日程調整、顧客対応など、オンラインで業務を支える副業を集めています。' },
  { slug: 'design', name: 'デザイン', description: 'バナー、ロゴ、イラスト、資料などを見やすく伝わる形へ整える副業をまとめています。' },
  { slug: 'content', name: 'コンテンツ', description: 'ブログや写真など、自分でコンテンツを作り育てる副業をまとめています。' },
  { slug: 'education', name: '教育', description: '得意分野を人に教える副業。説明力や受講者とのコミュニケーションが重要です。' },
  { slug: 'ec', name: 'EC・物販', description: 'ネットショップの運営補助やハンドメイド販売など、ECに関わる副業をまとめています。' }
] as const;

export const categoryByName = new Map(categories.map(category => [category.name, category]));
