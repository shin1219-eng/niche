"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { nanoid } from "nanoid";
import { ArticleItem, STATUS_LABELS } from "@/lib/types";
import { fetchArticles, syncArticles } from "@/lib/store";
import { renderMarkdown } from "@/lib/markdown";

function createEmptyArticle(): ArticleItem {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : nanoid(),
    title: "新規記事",
    slug: `draft-${Date.now()}`,
    status: "draft",
    contentMd: "# 新規記事\n\nここに本文を追加してください。",
    categories: [],
    tags: [],
    sources: [],
    topicIds: [],
    updatedAt: new Date().toISOString(),
    publishedAt: null
  };
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchArticles().then((items) => {
      setArticles(items);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => {
      syncArticles(articles);
    }, 700);
    return () => clearTimeout(timer);
  }, [articles, loaded]);

  const rendered = useMemo(() => {
    const map: Record<string, string> = {};
    articles.forEach((article) => {
      map[article.id] = renderMarkdown(article.contentMd);
    });
    return map;
  }, [articles]);

  const handleUpdate = (id: string, patch: Partial<ArticleItem>) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === id ? { ...article, ...patch, updatedAt: new Date().toISOString() } : article
      )
    );
  };

  const handleApprove = (id: string) => {
    handleUpdate(id, { status: "approved" });
  };

  const handleMarkRevise = (id: string) => {
    handleUpdate(id, { status: "revise" });
  };

  const handleNewArticle = () => {
    setArticles((prev) => [createEmptyArticle(), ...prev]);
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card">
        <div className="section-title">
          <div>
            <h2>記事作成タブ</h2>
            <p>自動生成された下書きをレビューし、OKで下書きへ移管します。</p>
          </div>
          <div className="inline-actions">
            <button className="btn btn-primary" type="button" onClick={handleNewArticle}>
              新規記事を追加
            </button>
            <Link className="btn btn-ghost" href="/admin/topics">
              ネタ収集タブ
            </Link>
          </div>
        </div>
        <div className="notice">
          OKを押すと「下書き」ステータスに移行します。公開は別工程で行います。
        </div>
      </section>

      {articles.length === 0 && (
        <section className="card">まだ記事がありません。ネタ収集から送信してください。</section>
      )}

      {articles.map((article) => (
        <section key={article.id} className="card">
          <div className="section-title">
            <div>
              <h3>{article.title}</h3>
              <span className="badge">{STATUS_LABELS[article.status]}</span>
            </div>
            <div className="inline-actions">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => handleApprove(article.id)}
              >
                OK（下書きへ）
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() =>
                  setEditingId((prev) => (prev === article.id ? null : article.id))
                }
              >
                {editingId === article.id ? "プレビュー" : "編集"}
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => handleMarkRevise(article.id)}
              >
                要修正
              </button>
            </div>
          </div>

          <div className="grid" style={{ gap: 12 }}>
            <div className="grid grid-2">
              <div>
                <label>タイトル</label>
                <input
                  className="input"
                  value={article.title}
                  onChange={(event) => handleUpdate(article.id, { title: event.target.value })}
                />
              </div>
              <div>
                <label>スラッグ</label>
                <input
                  className="input"
                  value={article.slug}
                  onChange={(event) => handleUpdate(article.id, { slug: event.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-2">
              <div>
                <label>カテゴリ（カンマ区切り）</label>
                <input
                  className="input"
                  placeholder="例: 掃除, キッチン"
                  value={article.categories.join(", ")}
                  onChange={(event) =>
                    handleUpdate(article.id, {
                      categories: event.target.value
                        .split(",")
                        .map((entry) => entry.trim())
                        .filter(Boolean)
                    })
                  }
                />
              </div>
              <div>
                <label>タグ（カンマ区切り）</label>
                <input
                  className="input"
                  placeholder="例: 静音, 省スペース"
                  value={article.tags.join(", ")}
                  onChange={(event) =>
                    handleUpdate(article.id, {
                      tags: event.target.value
                        .split(",")
                        .map((entry) => entry.trim())
                        .filter(Boolean)
                    })
                  }
                />
              </div>
            </div>

            {editingId === article.id ? (
              <div>
                <label>本文（Markdown）</label>
                <textarea
                  className="textarea"
                  value={article.contentMd}
                  onChange={(event) =>
                    handleUpdate(article.id, { contentMd: event.target.value })
                  }
                />
              </div>
            ) : (
              <div>
                <label>プレビュー</label>
                <div
                  className="preview"
                  dangerouslySetInnerHTML={{ __html: rendered[article.id] }}
                />
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
