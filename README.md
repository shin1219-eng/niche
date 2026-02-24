# NICHE! Magazine CMS

ニッチ特化マガジン向けの、下書き運用中心CMSです。

## 現在の機能
- 管理ダッシュボード（件数確認）
- 下書き管理（作成・編集・状態整理）
- アーカイブ管理（保管・復元）
- 公開画面（トップ / 記事一覧 / 記事詳細 / マイページ）
- ブックマーク機能

## ルート
- 管理画面: `/admin/dashboard` `/admin/drafts` `/admin/archive`
- 公開画面: `/` `/articles` `/articles/[slug]` `/login` `/mypage`

旧ルート `/admin/topics` `/admin/articles` `/admin/taxonomy` は互換のためリダイレクトされます。

## 起動
```bash
npm install
npm run dev
```

## 環境変数
`.env.example` をコピーして設定してください。

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_ADMIN_EMAILS=
```

- Supabase設定あり: 認証とDB連携を利用
- Supabase設定なし: 一部データは `localStorage` に保存
