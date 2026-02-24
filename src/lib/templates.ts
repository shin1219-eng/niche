import { TopicItem } from "./types";

export function generateArticleTemplate(topic: TopicItem) {
  const productName = topic.productName || "（商品名）";
  const maker = topic.maker || "（メーカー）";
  const price = topic.price || "（価格）";
  const pain = topic.nicheCondition || "（現象＋ペイン）";
  const heroImage = topic.heroImageUrl
    ? `![アイキャッチ](${topic.heroImageUrl})`
    : "（アイキャッチ画像URL）";
  const usageImage = topic.usageImageUrl
    ? `![利用シーン](${topic.usageImageUrl})`
    : "（利用シーン画像URL）";
  const searchKeyword = topic.searchKeyword || productName;

  const compareHeader = `| 手段 | 手間（時間） | 確実性 | 限界（デメリット） |`;
  const compareDivider = `| --- | --- | --- | --- |`;
  const compareRows = [
    `| ${productName} | - | - | - |`,
    `| 代替案1 | - | - | - |`,
    `| 代替案2（気合い・手作業） | - | - | - |`
  ].join("\n");

  const featureLines = topic.coreFeatures
    ? topic.coreFeatures
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `- ${line}`)
        .join("\n")
    : "- ポイント1：\n- ポイント2：\n- ポイント3：";

  return (
    `Shintaです。${pain}に毎回引っかかってしまう自分がいる。` +
    `今日はその「名もなき面倒」を一気に片付ける専用品を紹介する。\n\n` +
    `# ${topic.title || `${pain}。作り手の狂気が生んだ最適解`}\n\n` +
    `${heroImage}\n\n` +
    `${productName}（${maker} / ${price}）\n` +
    `▶︎（検索リンク生成用キーワード：${searchKeyword}）\n\n` +
    `## 商品紹介（リードと結論）\n` +
    `${pain}という小さなストレスに、最短距離で刺さるのが${productName}だ。\n\n` +
    `## ニッチな背景：なぜわざわざ作ったのか\n` +
    `${topic.story || "（開発背景とこだわりを記載）"}\n\n` +
    `## 残酷な比較表（専用品 vs 妥協案）\n` +
    `${compareHeader}\n${compareDivider}\n${compareRows}\n\n` +
    `## 圧倒的な一点突破（工数がどう減るか）\n` +
    `${featureLines}\n\n` +
    `${usageImage}\n\n` +
    `## 注意点：購入前に確認してほしいこと\n` +
    `- 向かない条件（切り捨て）\n\n` +
    `## ニッチFAQ\n` +
    `**Q: 〜は対応している？**\n` +
    `A: （結論＋理由）\n\n` +
    `**Q: 〜でも使える？**\n` +
    `A: （結論＋理由）\n\n` +
    `## 締め\n` +
    `我慢せずに、優秀な道具に任せて心地よい時間を作ってほしい。\n\n` +
    (topic.articleType === "discovery"
      ? `▶︎ 今すぐ買える妥協案（検索リンク生成用キーワード：${searchKeyword}）\n\n`
      : `▶︎ ${productName}の最新価格をチェックする（検索リンク生成用キーワード：${searchKeyword}）\n\n`) +
    `Written by Shinta\n`
  );
}
