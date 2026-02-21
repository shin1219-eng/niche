import { ArticleItem, TopicItem } from "./types";

const TOPIC_KEY = "niche_topics";
const ARTICLE_KEY = "niche_articles";
const BOOKMARK_KEY = "niche_bookmarks";

export function loadTopics(): TopicItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(TOPIC_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as TopicItem[];
  } catch {
    return [];
  }
}

export function saveTopics(items: TopicItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOPIC_KEY, JSON.stringify(items));
}

export function loadArticles(): ArticleItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(ARTICLE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ArticleItem[];
  } catch {
    return [];
  }
}

export function saveArticles(items: ArticleItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ARTICLE_KEY, JSON.stringify(items));
}

export function loadBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(BOOKMARK_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function saveBookmarks(items: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BOOKMARK_KEY, JSON.stringify(items));
}
