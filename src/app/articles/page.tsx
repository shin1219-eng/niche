"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PublicNav from "@/components/site/PublicNav";
import Footer from "@/components/site/Footer";
import { fetchBookmarks, persistBookmark } from "@/lib/bookmarkStore";
import { fetchArticles } from "@/lib/store";
import { sampleArticles } from "@/lib/sampleData";
import { ArticleItem } from "@/lib/types";

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
    fetchArticles().then((items) => setArticles(items));
    fetchBookmarks().then(setBookmarks);
  }, []);

  const visibleArticles = useMemo(() => {
    const base = articles.length > 0 ? articles : sampleArticles;
    const filtered = base.filter((article) => article.status === "published");
    const list = articles.length > 0 ? filtered : base;
    if (!showBookmarksOnly) return list;
    return list.filter((article) => bookmarks.includes(article.slug));
  }, [articles, bookmarks, showBookmarksOnly]);

  const toggleBookmark = (slug: string) => {
    setBookmarks((prev) => {
      const isActive = prev.includes(slug);
      const next = isActive ? prev.filter((item) => item !== slug) : [...prev, slug];
      persistBookmark(slug, !isActive);
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
              公開済みの記事のみ表示しています。ブックマークはDB保存ですが、
              ログインがない場合は端末単位になります。
            </div>
          </section>

          <section className="article-grid" style={{ marginTop: 20 }}>
            {visibleArticles.map((article) => (
              <article key={article.id} className="card article-card">
                <div className="article-thumb" />
                <div className="article-meta">
                  <span className="badge">更新: {article.updatedAt.slice(0, 10)}</span>
                </div>
                <h3>{article.title}</h3>
                <p>{getPreviewText(article.contentMd)}</p>
                {(article.categories.length > 0 || article.tags.length > 0) && (
                  <div className="chip-row">
                    {article.categories.map((item) => (
                      <span key={`cat-${item}`} className="chip">
                        {item}
                      </span>
                    ))}
                    {article.tags.map((item) => (
                      <span key={`tag-${item}`} className="chip">
                        #{item}
                      </span>
                    ))}
                  </div>
                )}
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
