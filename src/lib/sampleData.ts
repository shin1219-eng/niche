import { ArticleItem } from "./types";

export const sampleArticles: ArticleItem[] = [
  {
    id: "sample-1",
    title: "静音重視のミニ掃除機おすすめ",
    slug: "silent-mini-vacuum",
    status: "published",
    contentMd: `# 静音重視のミニ掃除機おすすめ\n\n**結論（おすすめ3つ）**\n1. 静音ミニ掃除機A\n2. 夜間向けの省音モデルB\n3. 収納しやすいコードレスC\n\n## 刺さる条件\n夜間や集合住宅で、音を最小限にしたい人向け。\n\n## 購入導線\n- https://www.rakuten.co.jp/\n- https://www.amazon.co.jp/\n- https://shopping.yahoo.co.jp/\n` ,
    sources: ["https://example.com"],
    topicIds: [],
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString()
  },
  {
    id: "sample-2",
    title: "旅行用の省スペース収納ボックス",
    slug: "travel-compact-storage",
    status: "published",
    contentMd: `# 旅行用の省スペース収納ボックス\n\n**結論（おすすめ3つ）**\n1. 折りたたみ型\n2. 圧縮ベルト付き\n3. 仕切り付きポーチ\n\n## 刺さる条件\n荷物を減らしてスーツケースに収めたい人向け。\n\n## 購入導線\n- https://www.rakuten.co.jp/\n- https://shopping.yahoo.co.jp/\n` ,
    sources: ["https://example.com"],
    topicIds: [],
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString()
  }
];
