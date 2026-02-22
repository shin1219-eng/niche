import { supabase } from "@/lib/supabaseClient";
import {
  loadArticles as loadArticlesLocal,
  loadTopics as loadTopicsLocal,
  saveArticles as saveArticlesLocal,
  saveTopics as saveTopicsLocal
} from "@/lib/localStore";
import { ArticleItem, TopicItem } from "@/lib/types";

const toTopicRow = (topic: TopicItem) => ({
  id: topic.id,
  source: topic.source,
  title: topic.title,
  niche_condition: topic.nicheCondition,
  compare_axes: topic.compareAxes,
  official_url: topic.officialUrl,
  image_url: topic.imageUrl,
  price_range: topic.priceRange,
  notes: topic.notes,
  status: topic.status,
  created_at: topic.createdAt,
  updated_at: new Date().toISOString()
});

const fromTopicRow = (row: Record<string, any>): TopicItem => ({
  id: row.id,
  source: row.source,
  title: row.title ?? "",
  nicheCondition: row.niche_condition ?? "",
  compareAxes: row.compare_axes ?? [],
  officialUrl: row.official_url ?? "",
  imageUrl: row.image_url ?? "",
  priceRange: row.price_range ?? "",
  notes: row.notes ?? "",
  status: row.status ?? "inbox",
  createdAt: row.created_at ?? new Date().toISOString()
});

const toArticleRow = (article: ArticleItem) => ({
  id: article.id,
  title: article.title,
  slug: article.slug,
  status: article.status,
  content_md: article.contentMd,
  categories: article.categories ?? [],
  tags: article.tags ?? [],
  sources: article.sources ?? [],
  topic_ids: article.topicIds ?? [],
  updated_at: new Date().toISOString(),
  published_at: article.publishedAt ?? null
});

const fromArticleRow = (row: Record<string, any>): ArticleItem => ({
  id: row.id,
  title: row.title ?? "",
  slug: row.slug ?? "",
  status: row.status ?? "draft",
  contentMd: row.content_md ?? "",
  categories: row.categories ?? [],
  tags: row.tags ?? [],
  sources: row.sources ?? [],
  topicIds: row.topic_ids ?? [],
  updatedAt: row.updated_at ?? new Date().toISOString(),
  publishedAt: row.published_at ?? null
});

export async function fetchTopics(): Promise<TopicItem[]> {
  if (!supabase) return loadTopicsLocal();
  const { data } = await supabase
    .from("topics")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []).map(fromTopicRow);
}

export async function syncTopics(items: TopicItem[]) {
  if (!supabase) return saveTopicsLocal(items);
  if (items.length === 0) return;
  await supabase.from("topics").upsert(items.map(toTopicRow), { onConflict: "id" });
}

export async function fetchArticles(): Promise<ArticleItem[]> {
  if (!supabase) return loadArticlesLocal();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .order("updated_at", { ascending: false });
  return (data ?? []).map(fromArticleRow);
}

export async function syncArticles(items: ArticleItem[]) {
  if (!supabase) return saveArticlesLocal(items);
  if (items.length === 0) return;
  await supabase.from("articles").upsert(items.map(toArticleRow), { onConflict: "id" });
}

export async function createArticles(items: ArticleItem[]) {
  if (!supabase) {
    const current = loadArticlesLocal();
    saveArticlesLocal([...items, ...current]);
    return;
  }
  if (items.length === 0) return;
  await supabase.from("articles").insert(items.map(toArticleRow));
}
