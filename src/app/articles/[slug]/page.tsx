"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PublicNav from "@/components/site/PublicNav";
import Footer from "@/components/site/Footer";
import { renderMarkdown } from "@/lib/markdown";
import { loadBookmarks, saveBookmarks } from "@/lib/localStore";
import { fetchArticles } from "@/lib/store";
import { sampleArticles } from "@/lib/sampleData";
import { ArticleItem } from "@/lib/types";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : params.slug?.[0];
  const [article, setArticle] = useState<ArticleItem | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    fetchArticles().then((items) => {
      const base = items.length > 0 ? items : sampleArticles;
      const found =
        items.length > 0
          ? base.find((item) => item.slug === slug && item.status === "published") ?? null
          : base.find((item) => item.slug === slug) ?? null;
      setArticle(found);
    });
    setBookmarks(loadBookmarks());
  }, [slug]);

  const rendered = useMemo(() => {
    if (!article) return "";
    return renderMarkdown(article.contentMd);
  }, [article]);

  const toggleBookmark = () => {
    if (!article) return;
    setBookmarks((prev) => {
      const next = prev.includes(article.slug)
        ? prev.filter((item) => item !== article.slug)
        : [...prev, article.slug];
      saveBookmarks(next);
      return next;
    });
  };

  const isBookmarked = article ? bookmarks.includes(article.slug) : false;

  return (
    <div>
      <PublicNav />
      <main>
        <div className="container">
          {!article && (
            <section className="card">
              <h2>記事が見つかりません</h2>
              <p>記事一覧から別の記事を選んでください。</p>
              <Link className="btn btn-primary" href="/articles">
                記事一覧へ戻る
              </Link>
            </section>
          )}

          {article && (
            <section className="card">
              <div className="article-thumb" />
              <div className="article-meta">
                <span className="badge">更新: {article.updatedAt.slice(0, 10)}</span>
              </div>
              <h1>{article.title}</h1>
              {(article.categories.length > 0 || article.tags.length > 0) && (
                <div className="chip-row" style={{ marginBottom: 12 }}>
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
              <div className="inline-actions" style={{ marginBottom: 12 }}>
                <button
                  className={`bookmark-btn${isBookmarked ? " active" : ""}`}
                  onClick={toggleBookmark}
                  type="button"
                >
                  {isBookmarked ? "ブックマーク済み" : "ブックマーク"}
                </button>
                <Link className="btn btn-ghost" href="/articles">
                  記事一覧へ
                </Link>
              </div>
              <div className="preview" dangerouslySetInnerHTML={{ __html: rendered }} />
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
