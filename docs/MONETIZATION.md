# 広告・アフィリエイトの追加

現在はどちらも未契約・未設定のため、広告表示と広告配信スクリプトは無効です。設定ファイルに情報を入れて再公開すると反映されます。秘密のAPIキーやログイン情報はここへ書きません。

## アフィリエイト
src/data/services.json の該当サービスの affiliateUrl に、ASPが発行した提携済みURLを入力します。通常の公式URLは url に残します。各記事の先頭と対象リンクに広告表示が自動で入り、リンクには sponsored 属性が付きます。解除する場合は affiliateUrl を空文字に戻します。紹介先を増やす場合はサービスを追加し、記事の services にその id を指定します。

## バナー広告
src/data/monetization.json の provider を banner にします。banners.home（トップページ末尾）または banners.article（詳細ページ下部）の title、url、必要に応じて description を入力します。広告のラベルは自動表示されます。画像は public/ads/ に保存し、image に /ads/画像名.webp など、imageAlt に画像の説明を入力します。画像なしのテキスト広告も使えます。URLはHTTPS、画像はローカルのPNG/JPEG/WebP/AVIFに対応します。

## Google AdSense
1. 自分のAdSenseアカウントで対象サイトを登録します。このホスティングURLが登録できるか、審査に通るかはGoogle側の判断です。必要に応じて独自ドメインを用意します。
2. 発行された ca-pub- から始まるクライアントIDを adsense.client に入力します。provider:none のままでも所有確認用のメタタグが出ます。
3. AdSenseから発行された ads.txt のGoogleの行を adsense.adsTxt にそのまま入力します。/ads.txt に出力されます。サンプルIDを実運用に使わないでください。
4. 広告ユニットを作り、広告枠IDを adsense.slots.home または article に設定します。
5. AdSense管理画面の「プライバシーとメッセージ」で、対象地域に必要な同意管理を設定・公開します。サイト自体は独自の同意管理プラットフォームを実装していません。必要なCMPの公開状況を確認してから広告を有効にしてください。
6. 審査と必要な設定が完了したら provider を adsense にします。未設定の枠には何も表示しません。プライバシーポリシーと広告方針は設定に応じて切り替わります。
7. npm run check:release と npm run verify を実行し、再公開します。審査・広告配信・収益はGoogle側に依存します。実際の広告をテスト目的でクリックしないでください。

## 広告を止める
provider を none にして再公開します。バナー・AdSenseの表示とAdSenseスクリプトが止まります。アフィリエイトリンクは独立しているため、停止する場合は該当サービスの affiliateUrl を空にします。

## 公式資料（2026-09-20確認）
- レスポンシブ広告コード: https://support.google.com/adsense/answer/9183363?hl=ja
- 同意管理: https://support.google.com/adsense/answer/7670013?hl=ja
- ads.txt: https://support.google.com/adsense/answer/12171612?hl=ja

自動更新タスクは広告を勝手に有効にしたり、発行ID・広告URLを変更しません。新しい広告を追加するときは本人の依頼と発行情報を確認します。

## 申請前の確認（2026-09-22）
現在の workers.dev のURLでAdSenseへ登録できるかは未確認です。GoogleのURL案内にはサブドメインの制限があるため、申請画面での受付可否を確認してください。受付不可の場合は独自ドメインの取得・接続を本人と相談し、購入は本人の承認後に行います。
- URLの条件: https://support.google.com/adsense/answer/2784438?hl=ja
- 資格要件: https://support.google.com/adsense/answer/9724?hl=ja
記事数だけで審査合格を判断しません。本人による記事内容の最終確認、アカウント登録、必要な本人・支払情報の入力と規約同意は未完了です。
