"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PublicNav from "@/components/site/PublicNav";
import Footer from "@/components/site/Footer";
import { loadArticles, loadBookmarks, saveBookmarks } from "@/lib/localStore";
import { sampleArticles } from "@/lib/sampleData";
import { ArticleItem, STATUS_LABELS } from "@/lib/types";

const getPreviewText = (content: string) => {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && !line.startsWith("**"));
  return lines[0] ?? "記事詳細で比較表・用途別おすすめ・FAQを確認できます。";
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  useEffect(() => {
    setArticles(loadArticles());
    setBookmarks(loadBookmarks());
  }, []);

  const visibleArticles = useMemo(() => {
    const base = articles.length > 0 ? articles : sampleArticles;
    const filtered = base.filter((article) =>
      ["approved", "published"].includes(article.status)
    );
    const list = filtered.length > 0 ? filtered : base;
    if (!showBookmarksOnly) return list;
    return list.filter((article) => bookmarks.includes(article.slug));
  }, [articles, bookmarks, showBookmarksOnly]);

  const toggleBookmark = (slug: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug];
      saveBookmarks(next);
      return next;
    });
  };

  return (
    <div>
      <PublicNav />
      <main>
        <div className="container">
          <section className="card">
            <div className="section-title">
              <div>
                <h2>記事一覧</h2>
                <p>最新のニッチ記事をまとめてチェックできます。</p>
              </div>
              <div className="inline-actions">
                <button
                  className={`bookmark-btn${showBookmarksOnly ? " active" : ""}`}
                  onClick={() => setShowBookmarksOnly((prev) => !prev)}
                  type="button"
                >
                  ブックマークのみ
                </button>
                <span className="badge">{bookmarks.length} 件保存</span>
              </div>
            </div>
            <div className="notice">
              管理画面で承認した記事が表示対象です。MVPではローカル保存のため、
              ブラウザごとに内容が変わります。
            </div>
          </section>

          <section className="article-grid" style={{ marginTop: 20 }}>
            {visibleArticles.map((article) => (
              <article key={article.id} className="card article-card">
                <div className="article-thumb" />
                <div className="article-meta">
                  <span className="badge">{STATUS_LABELS[article.status]}</span>
                  <span className="badge">更新: {article.updatedAt.slice(0, 10)}</span>
                </div>
                <h3>{article.title}</h3>
                <p>{getPreviewText(article.contentMd)}</p>
                <div className="chip-row">
                  <span className="chip">比較表</span>
                  <span className="chip">用途別</span>
                  <span className="chip">FAQ</span>
                </div>
                <div className="inline-actions">
                  <Link className="btn btn-primary" href={`/articles/${article.slug}`}>
                    記事を読む
                  </Link>
                  <button
                    className={`bookmark-btn${bookmarks.includes(article.slug) ? " active" : ""}`}
                    onClick={() => toggleBookmark(article.slug)}
                    type="button"
                  >
                    {bookmarks.includes(article.slug) ? "ブックマーク済み" : "ブックマーク"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
