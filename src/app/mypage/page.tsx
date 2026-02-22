"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PublicNav from "@/components/site/PublicNav";
import Footer from "@/components/site/Footer";
import { fetchBookmarks, persistBookmark } from "@/lib/bookmarkStore";
import { fetchArticles } from "@/lib/store";
import { fetchCategories } from "@/lib/taxonomyStore";
import { fetchCategorySubscriptions, toggleCategorySubscription } from "@/lib/subscriptionStore";
import { ArticleItem, CategoryItem } from "@/lib/types";

export default function MyPage() {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subscribedIds, setSubscribedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchBookmarks().then(({ slugs, signedIn: isSignedIn }) => {
      setSignedIn(isSignedIn);
      setBookmarks(slugs);
      if (!isSignedIn) return;
      fetchArticles().then(setArticles);
      fetchCategories().then(setCategories);
      fetchCategorySubscriptions().then(setSubscribedIds);
    });
  }, []);

  const savedArticles = useMemo(
    () => articles.filter((item) => bookmarks.includes(item.slug)),
    [articles, bookmarks]
  );

  const handleRemoveBookmark = (slug: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((item) => item !== slug);
      persistBookmark(slug, false);
      return next;
    });
  };

  const toggleSubscription = (categoryId: string) => {
    const isActive = subscribedIds.includes(categoryId);
    setSubscribedIds((prev) => {
      const next = isActive ? prev.filter((id) => id !== categoryId) : [...prev, categoryId];
      toggleCategorySubscription(categoryId, !isActive);
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
                <h2>マイページ</h2>
                <p>ブックマークとカテゴリ購読をまとめて管理できます。</p>
              </div>
              <span className="badge">ログイン限定</span>
            </div>
            {!signedIn && (
              <div className="notice">
                マイページを見るにはログインが必要です。
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => router.push("/login?next=/mypage")}
                  style={{ marginLeft: 12 }}
                >
                  ログイン
                </button>
              </div>
            )}
          </section>

          {signedIn && (
            <>
              <section className="card" style={{ marginTop: 20 }}>
                <div className="section-title">
                  <div>
                    <h3>保存した記事</h3>
                    <p>後で読みたい記事を一覧で表示します。</p>
                  </div>
                  <span className="badge">{savedArticles.length} 件</span>
                </div>
                {savedArticles.length === 0 && (
                  <div className="notice">ブックマークがまだありません。</div>
                )}
                <div className="list-grid">
                  {savedArticles.map((item) => (
                    <div key={item.id} className="list-item">
                      <div className="list-thumb" />
                      <div>
                        <strong>{item.title}</strong>
                        <div className="inline-actions" style={{ marginTop: 8 }}>
                          <button
                            className="btn btn-ghost"
                            type="button"
                            onClick={() => router.push(`/articles/${item.slug}`)}
                          >
                            記事を開く
                          </button>
                          <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={() => handleRemoveBookmark(item.slug)}
                          >
                            外す
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="card" style={{ marginTop: 20 }}>
                <div className="section-title">
                  <div>
                    <h3>カテゴリ購読</h3>
                    <p>週まとめ通知で受け取りたいカテゴリを選びます。</p>
                  </div>
                  <span className="badge">{subscribedIds.length} 件</span>
                </div>
                {categories.length === 0 && (
                  <div className="notice">カテゴリがまだ登録されていません。</div>
                )}
                <div className="chip-row">
                  {categories.map((item) => {
                    const active = subscribedIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        className={`chip chip-btn${active ? " active" : ""}`}
                        type="button"
                        onClick={() => toggleSubscription(item.id)}
                      >
                        {item.name || item.slug || "未設定"}
                      </button>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
