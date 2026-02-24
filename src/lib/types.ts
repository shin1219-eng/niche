export type SourceType =
  | "rakuten_market"
  | "rakuten_product"
  | "rakuten_books"
  | "yahoo"
  | "manual";

export type TopicStatus = "inbox" | "ready" | "sent_to_article";

export type ArticleStatus = "draft" | "approved" | "published" | "revise" | "archived";

export type ArticleType = "revenue" | "discovery";

export type ArticleLinkVendor = "rakuten" | "amazon" | "yahoo";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagItem {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface TopicItem {
  id: string;
  source: SourceType;
  title: string;
  productName: string;
  maker: string;
  price: string;
  nicheCondition: string;
  story: string;
  coreFeatures: string;
  heroImageUrl: string;
  usageImageUrl: string;
  searchKeyword: string;
  articleType: ArticleType;
  painSpecific: boolean;
  solutionFocused: boolean;
  alternativesWeak: boolean;
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
  articleType?: ArticleType;
  contentMd: string;
  categories: string[];
  tags: string[];
  sources: string[];
  topicIds: string[];
  updatedAt: string;
  publishedAt?: string | null;
}

export const REQUIRED_TOPIC_FIELDS: Array<keyof TopicItem> = [
  "title",
  "productName",
  "maker",
  "price",
  "nicheCondition",
  "story",
  "coreFeatures",
  "heroImageUrl",
  "painSpecific",
  "solutionFocused",
  "alternativesWeak",
  "articleType"
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
  revise: "要修正",
  archived: "アーカイブ"
};
