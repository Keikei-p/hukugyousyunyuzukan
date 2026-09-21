# 副業図鑑の運用

## 現在の構成
- トップ、6件の副業詳細、はじめての方へ、運営者情報、お問い合わせ、編集・広告方針、プライバシーポリシー、404。
- 記事データは src/data/jobs.json。一覧と詳細が同じデータから生成されます。
- status が published の記事だけ一覧と詳細に出ます。draft は掲載されません。
- 外部サービスは src/data/services.json。affiliateUrl が空なら通常リンクです。設定した場合は該当ページ冒頭とリンク付近に広告表示、リンクに sponsored が付きます。
- サイト設定は src/data/site.json。ready:false の間は noindex、サイトマップは空です。noindex はアクセス制限ではありません。公開範囲はCloudflare側の設定で管理します。

## 毎回の更新
1. 既存データ・編集方針を読む。
2. 外部サービスの公式情報を確認。価格・手数料・条件を断定するときは根拠を残す。推測で報酬額や体験談を追加しない。
3. 修正がある記事だけ更新し、updated / checked を実際の確認日に変更する。意味のない日付更新はしない。
4. npm run verify を実行する。失敗したら修正し、成功してから公開する。
5. 画面の機能や構造を変えたときは検索・絞り込み・並び替えとモバイル表示を確認する。
6. GitHubの Keikei-p/hukugyousyunyuzukan の既存本番ブランチ main に検証済みの変更を反映する。連携済みCloudflare Workers Buildsがビルド・公開する。Sitesと旧work/publish-sourceは使わない。現在の公開範囲を維持する。
7. npm run check:live で本番の release.json とローカルソースの指紋、お問い合わせ・記事・サイトマップを照合し、成功してから報告する。GitHubへの保存だけを公開成功と扱わない。

## 公開設定
- 運営者：副業図鑑運営事務局。連絡先：z88888888.zd@gmail.com。
- プライバシーポリシーは現行機能と広告設定に連動。利用サービスを増やしたら確認する。
- ユーザーの一般公開指示により ready:true。npm run check:release と npm run verify を使う。
- 本番URL: https://hukugyousyunyuzukan.jyhokei0124.workers.dev 。定期更新は現在の公開範囲を維持する。
- 独自ドメインは必須ではありません。設定する場合は url を変更して再生成します。

## アフィリエイト
提携済みの広告URLだけを affiliateUrl に設定します。ASPへの登録、案件提携、支払い先の登録は本人のアカウントと情報が必要です。案件や報酬の有無は未確認です。A8.net は調査候補の例で、特定の紹介サービスが掲載されていると保証しません。
公式案内: https://www.a8.net/
広告表示の参考: https://www.caa.go.jp/policies/policy/representation/fair_labeling/faq/stealth_marketing/

## 実行コマンド
- npm run dev -- --background : 開発サーバー。既存サーバーを不用意に重複起動しない。
- npm run verify : 記事データ検証、ビルド、内部リンクと基本SEOの検証。
- npm run check:release : 一般公開用の設定確認。準備中は未設定項目で失敗するのが正常。

## 制約
通常チャットに戻るだけで、Windowsのローカルフォルダへのアクセス権が引き継がれるとは限りません。ファイル操作と公開は、このローカルタスクか、サイトと必要なアクセスが接続された実行環境で行います。実行環境が利用できない場合に更新済みと報告しないでください。

## 広告設定
広告の追加・停止は docs/MONETIZATION.md を参照。src/data/monetization.json は現在 provider:none。本人から発行済み情報と依頼が来るまで、定期更新で広告を有効にしない。

## Cloudflareのビルド設定
既存Git連携を利用。ビルドは npm run build、公開は既存のWrangler設定を使う。npm run build はテスト、公開設定検証、Astroビルド、出力検証、公開確認用の指紋生成を順番に行う。テスト0件や検証失敗では終了コードが非ゼロになる。Cloudflare管理画面の設定を変更する場合もこの検証を省略しない。

## 自動更新時の同期
作業前に本番ブランチとローカルの差分を確認し、他の変更を上書きしない。元プロジェクトの履歴に書き込めない場合は、GitHubコネクターのコミット・参照更新で同じリポジトリに最小差分を反映する。既存の古いSites用コピーは利用しない。権限不足の場合は未公開と通知する。
