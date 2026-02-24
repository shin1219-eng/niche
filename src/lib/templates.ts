import { TopicItem } from "./types";

export function generateArticleTemplate(topic: TopicItem) {
  const productName = topic.title || "（商品名）";
  const pain = topic.nicheCondition || "（現象＋ペイン）";
  const heroImage = topic.imageUrl ? `![アイキャッチ](${topic.imageUrl})` : "（アイキャッチ画像URL）";

  const compareHeader = `| 手段 | 手間（時間） | 確実性 | 限界（デメリット） |`;
  const compareDivider = `| --- | --- | --- | --- |`;
  const compareRows = [
    `| ${productName} | - | - | - |`,
    `| 代替案1 | - | - | - |`,
    `| 代替案2（気合い・手作業） | - | - | - |`
  ].join("\n");

  return (
    `Shintaです。${pain}に毎回引っかかってしまう自分がいる。` +
    `今日はその「名もなき面倒」を一気に片付ける専用品を紹介する。\n\n` +
    `# ${pain}。作り手の狂気が生んだ最適解\n\n` +
    `${heroImage}\n\n` +
    `今回の専用品：${productName}（ブランド/メーカー未確認）\n` +
    `▶︎（検索リンク生成用キーワード：${productName}）\n\n` +
    `## ニッチな背景：なぜわざわざ作ったのか\n` +
    `- 開発背景（※公式出典で裏取り）\n` +
    `- 企業のニッチなこだわり（※公式出典で裏取り）\n\n` +
    `## 比較表（専用品 vs 妥協案）\n` +
    `${compareHeader}\n${compareDivider}\n${compareRows}\n\n` +
    `## ニッチポイント（工数がどう減るか）\n` +
    `- ポイント1：\n` +
    `- ポイント2：\n` +
    `- ポイント3：\n\n` +
    `## 注意点：購入前に確認してほしいこと\n` +
    `- 向かない条件（切り捨て）\n\n` +
    `## ニッチFAQ\n` +
    `**Q: 〜は対応している？**\n` +
    `A: （結論＋理由）\n\n` +
    `**Q: 〜でも使える？**\n` +
    `A: （結論＋理由）\n\n` +
    `## 締め\n` +
    `我慢せずに、優秀な道具に任せて心地よい時間を作ってほしい。\n\n` +
    `Written by Shinta\n`
  );
}
