import { TopicItem } from "./types";

export function generateArticleTemplate(topic: TopicItem) {
  const axes = topic.compareAxes.length > 0 ? topic.compareAxes : ["価格", "特徴", "用途"];
  const axisList = axes.map((axis) => `- ${axis}`).join("\n");
  const tableHeader = `| 商品 | 価格 | 特徴 | 向いてる人 | 弱点 | 公式 |`;
  const tableDivider = `| --- | --- | --- | --- | --- | --- |`;
  const tableRow = `| ${topic.title} | ${topic.priceRange || "-"} | - | - | - | ${topic.officialUrl || "-"} |`;

  return `# ${topic.title}のおすすめまとめ\n\n` +
    `**結論（おすすめ3つ）**\n` +
    `1. ${topic.title}（一次情報に基づく本命）\n` +
    `2. 代替候補（埋める）\n` +
    `3. ニッチ特化（埋める）\n\n` +
    `**刺さる条件（誰向けか）**\n` +
    `${topic.nicheCondition || "ここに1行で記載"}\n\n` +
    `## 選び方（比較軸）\n${axisList}\n\n` +
    `## 比較表\n${tableHeader}\n${tableDivider}\n${tableRow}\n\n` +
    `## 用途別おすすめ\n` +
    `- 用途A：\n` +
    `- 用途B：\n` +
    `- 用途C：\n\n` +
    `## FAQ\n` +
    `**Q. どの条件で選べばいい？**\n` +
    `A. 比較軸の上位から決めると失敗しにくい。\n\n` +
    `**Q. 代替はある？**\n` +
    `A. 価格/用途/制約で比較して判断。\n\n` +
    `## 購入導線\n` +
    `- ${topic.officialUrl || "公式リンク"}\n` +
    `- https://www.rakuten.co.jp/ (楽天アフィリンクを貼る)\n` +
    `- https://www.amazon.co.jp/ (Amazonアフィリンクを貼る)\n` +
    `- https://shopping.yahoo.co.jp/ (Yahooアフィリンクを貼る)\n\n` +
    `---\n` +
    `**表記**\n` +
    `この記事にはアフィリエイトリンクが含まれます。評価基準と出典は本文内に明記しています。\n`;
}
