"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArticleItem } from "@/lib/types";
import { fetchArticles, syncArticles } from "@/lib/store";

export default function AdminArchivePage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
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

  const archivedArticles = useMemo(
    () =>
      [...articles]
        .filter((article) => article.status === "archived")
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [articles]
  );

  const restoreToDraft = (id: string) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === id
          ? { ...article, status: "draft", updatedAt: new Date().toISOString() }
          : article
      )
    );
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card">
        <div className="section-title">
          <div>
            <h2>アーカイブ</h2>
            <p>保管している記事を確認し、必要なら下書きへ復元します。</p>
          </div>
          <div className="inline-actions">
            <span className="badge">{archivedArticles.length} 件</span>
            <Link className="btn btn-ghost" href="/admin/drafts">
              下書きへ戻る
            </Link>
          </div>
        </div>
      </section>

      {archivedArticles.length === 0 && (
        <section className="card">アーカイブは空です。下書きから記事を移動してください。</section>
      )}

      {archivedArticles.map((article) => (
        <section key={article.id} className="card">
          <div className="section-title">
            <div>
              <h3>{article.title || "無題の記事"}</h3>
              <p>スラッグ: {article.slug || "未設定"}</p>
            </div>
            <div className="inline-actions">
              <span className="badge">更新: {article.updatedAt.slice(0, 10)}</span>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => restoreToDraft(article.id)}
              >
                下書きへ復元
              </button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
