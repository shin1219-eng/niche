"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchArticles } from "@/lib/store";
import { ArticleItem } from "@/lib/types";

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);

  useEffect(() => {
    fetchArticles().then(setArticles);
  }, []);

  const stats = useMemo(() => {
    const total = articles.length;
    const drafts = articles.filter((item) => item.status !== "archived").length;
    const archived = articles.filter((item) => item.status === "archived").length;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const updatedThisWeek = articles.filter(
      (item) => new Date(item.updatedAt).getTime() >= weekAgo
    ).length;
    return { total, drafts, archived, updatedThisWeek };
  }, [articles]);

  const latestDrafts = useMemo(
    () =>
      [...articles]
        .filter((item) => item.status !== "archived")
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 5),
    [articles]
  );

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card">
        <div className="section-title">
          <div>
            <h2>ダッシュボード</h2>
            <p>下書き運用とアーカイブ運用に必要な数字だけを表示します。</p>
          </div>
          <div className="inline-actions">
            <Link className="btn btn-primary" href="/admin/drafts">
              下書きを開く
            </Link>
            <Link className="btn btn-ghost" href="/admin/archive">
              アーカイブを開く
            </Link>
          </div>
        </div>
        <div className="dashboard-grid">
          <div className="metric-card">
            <div className="metric-title">記事総数</div>
            <div className="metric-value">{stats.total}</div>
            <div className="metric-sub">CMS内の全記事</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">下書き</div>
            <div className="metric-value">{stats.drafts}</div>
            <div className="metric-sub">編集中・保留中の記事</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">アーカイブ</div>
            <div className="metric-value">{stats.archived}</div>
            <div className="metric-sub">保管済みの記事</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">今週の更新</div>
            <div className="metric-value">{stats.updatedThisWeek}</div>
            <div className="metric-sub">直近7日で更新された記事</div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="section-title">
          <div>
            <h3>最新の下書き</h3>
            <p>直近で触った記事を確認できます。</p>
          </div>
        </div>
        <div className="status-list">
          {latestDrafts.length === 0 && <div>下書きがありません。</div>}
          {latestDrafts.map((item) => (
            <div key={item.id} className="status-row">
              <span>{item.title || "無題の記事"}</span>
              <span className="badge">{item.updatedAt.slice(0, 10)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
