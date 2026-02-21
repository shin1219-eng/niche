export type SourceType =
  | "rakuten_market"
  | "rakuten_product"
  | "rakuten_books"
  | "yahoo"
  | "manual";

export type TopicStatus = "inbox" | "ready" | "sent_to_article";

export type ArticleStatus = "draft" | "approved" | "published" | "revise";

export type ArticleLinkVendor = "rakuten" | "amazon" | "yahoo";

export interface TopicItem {
  id: string;
  source: SourceType;
  title: string;
  nicheCondition: string;
  compareAxes: string[];
  officialUrl: string;
  imageUrl: string;
  priceRange: string;
  notes: string;
  status: TopicStatus;
  createdAt: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  status: ArticleStatus;
  contentMd: string;
  sources: string[];
  topicIds: string[];
  updatedAt: string;
  publishedAt?: string | null;
}

export const REQUIRED_TOPIC_FIELDS: Array<keyof TopicItem> = [
  "title",
  "nicheCondition",
  "compareAxes",
  "officialUrl",
  "imageUrl",
  "priceRange"
];

export const SOURCE_LABELS: Record<SourceType, string> = {
  rakuten_market: "楽天市場",
  rakuten_product: "楽天プロダクト",
  rakuten_books: "楽天Books",
  yahoo: "Yahooショッピング",
  manual: "手動"
};

export const STATUS_LABELS: Record<ArticleStatus, string> = {
  draft: "作成中",
  approved: "下書き",
  published: "公開",
  revise: "要修正"
};
