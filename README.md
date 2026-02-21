# NICHE! CMS

ニッチ記事の「ネタ収集 → 記事作成 → 下書き移管」を管理画面だけで回すためのMVPです。

## できること（MVP）
- ネタ収集タブ（API収集の擬似フロー + 手動URL追加）
- 必須カラムが埋まるまで記事作成へ送れないゲート
- 記事作成タブ（Markdown編集 / OKで下書き化）
- 楽天/Amazon/Yahooアフィリンクを自動ボタン化

## 使い方
```bash
npm install
npm run dev
```

- 管理画面: `/admin/topics` と `/admin/articles`
- データは `localStorage` に保存されます（本番はSupabase等へ置き換え前提）

## 次の拡張ポイント
- 楽天/Yahoo APIの実装とキー管理
- Supabase連携（topics/articlesテーブル）
- 収集ドメインのホワイトリスト管理
- 画像の正規化・ライセンス記録

## メモ
ロゴはプレースホルダーです。正式ロゴは `public/brands` に差し替えてください。
