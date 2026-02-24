"use client";

import { useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import Link from "next/link";
import { ArticleItem, STATUS_LABELS } from "@/lib/types";
import { fetchArticles, syncArticles } from "@/lib/store";
import { renderMarkdown } from "@/lib/markdown";

function createDraft(): ArticleItem {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : nanoid(),
    title: "新規下書き",
    slug: `draft-${Date.now()}`,
    status: "draft",
    contentMd: "# 新規下書き\n\nここに本文を入力してください。",
    categories: [],
    tags: [],
    sources: [],
    topicIds: [],
    updatedAt: new Date().toISOString(),
    publishedAt: null
  };
}

export default function AdminDraftsPage() {
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

  const draftArticles = useMemo(
    () =>
      [...articles]
        .filter((article) => article.status !== "archived")
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [articles]
  );

  const rendered = useMemo(() => {
    const map: Record<string, string> = {};
    draftArticles.forEach((article) => {
      map[article.id] = renderMarkdown(article.contentMd);
    });
    return map;
  }, [draftArticles]);

  const handleUpdate = (id: string, patch: Partial<ArticleItem>) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === id ? { ...article, ...patch, updatedAt: new Date().toISOString() } : article
      )
    );
  };

  const handleArchive = (id: string) => {
    handleUpdate(id, { status: "archived", publishedAt: null });
  };

  const handleBackToDraft = (id: string) => {
    handleUpdate(id, { status: "draft", publishedAt: null });
  };

  const handleNewDraft = () => {
    setArticles((prev) => [createDraft(), ...prev]);
  };

  const handleDeleteArticle = (id: string, title: string) => {
    const ok = window.confirm(`「${title || "無題の記事"}」を完全に削除します。よろしいですか？`);
    if (!ok) return;
    setArticles((prev) => prev.filter((article) => article.id !== id));
    setEditingId((prev) => (prev === id ? null : prev));
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card">
        <div className="section-title">
          <div>
            <h2>下書き</h2>
            <p>編集途中の記事を管理し、必要なものだけをアーカイブします。</p>
          </div>
          <div className="inline-actions">
            <button className="btn btn-primary" type="button" onClick={handleNewDraft}>
              新規下書き
            </button>
            <Link className="btn btn-ghost" href="/admin/archive">
              アーカイブを見る
            </Link>
          </div>
        </div>
        <div className="notice">公開運用は別フロー前提。CMSは下書き管理に集中します。</div>
      </section>

      {draftArticles.length === 0 && (
        <section className="card">下書きがありません。新規下書きを作成してください。</section>
      )}

      {draftArticles.map((article) => (
        <section key={article.id} className="card">
          <div className="section-title">
            <div>
              <h3>{article.title || "無題の記事"}</h3>
              <div className="inline-actions">
                <span className="badge">{STATUS_LABELS[article.status]}</span>
                <span className="badge">更新: {article.updatedAt.slice(0, 10)}</span>
              </div>
            </div>
            <div className="inline-actions">
              {article.status !== "draft" && (
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => handleBackToDraft(article.id)}
                >
                  下書きへ戻す
                </button>
              )}
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => handleArchive(article.id)}
              >
                アーカイブへ
              </button>
              <button
                className="btn btn-danger"
                type="button"
                onClick={() => handleDeleteArticle(article.id, article.title)}
              >
                削除
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setEditingId((prev) => (prev === article.id ? null : article.id))}
              >
                {editingId === article.id ? "プレビュー" : "編集"}
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
                  placeholder="例: キッチン, 収納"
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
                  placeholder="例: 時短, 小型"
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
                  onChange={(event) => handleUpdate(article.id, { contentMd: event.target.value })}
                />
              </div>
            ) : (
              <div>
                <label>プレビュー</label>
                <div className="preview" dangerouslySetInnerHTML={{ __html: rendered[article.id] }} />
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
