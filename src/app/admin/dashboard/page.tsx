"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchArticles, fetchTopics } from "@/lib/store";
import { ArticleItem, TopicItem, STATUS_LABELS } from "@/lib/types";

const ARTICLE_STATUS_ORDER: Array<ArticleItem["status"]> = [
  "draft",
  "approved",
  "published",
  "revise",
  "archived"
];

export default function AdminDashboardPage() {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);

  useEffect(() => {
    fetchTopics().then(setTopics);
    fetchArticles().then(setArticles);
  }, []);

  const topicStats = useMemo(() => {
    const total = topics.length;
    const inbox = topics.filter((item) => item.status === "inbox").length;
    const ready = topics.filter((item) => item.status === "ready").length;
    const sent = topics.filter((item) => item.status === "sent_to_article").length;
    return { total, inbox, ready, sent };
  }, [topics]);

  const articleStats = useMemo(() => {
    const total = articles.length;
    const byStatus = ARTICLE_STATUS_ORDER.map((status) => ({
      status,
      count: articles.filter((item) => item.status === status).length
    }));
    return { total, byStatus };
  }, [articles]);

  const latestArticles = useMemo(
    () =>
      [...articles]
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
            <p>運用・分析・収益の状況をひと目で確認できます。</p>
          </div>
          <span className="badge">Supabase連携</span>
        </div>
        <div className="dashboard-grid">
          <div className="metric-card">
            <div className="metric-title">ネタ収集</div>
            <div className="metric-value">{topicStats.total}</div>
            <div className="metric-sub">inbox {topicStats.inbox} / ready {topicStats.ready}</div>
            <div className="metric-sub">記事化済み {topicStats.sent}</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">記事総数</div>
            <div className="metric-value">{articleStats.total}</div>
            <div className="metric-sub">作成中/下書き/公開/要修正/アーカイブ</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">公開済み</div>
            <div className="metric-value">
              {articleStats.byStatus.find((item) => item.status === "published")?.count ?? 0}
            </div>
            <div className="metric-sub">公開済みの記事数</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">要修正</div>
            <div className="metric-value">
              {articleStats.byStatus.find((item) => item.status === "revise")?.count ?? 0}
            </div>
            <div className="metric-sub">差分対応が必要</div>
          </div>
        </div>
      </section>

      <section className="grid grid-2">
        <div className="card">
          <div className="section-title">
            <div>
              <h3>記事ステータス</h3>
              <p>公開フローの詰まりを確認。</p>
            </div>
          </div>
          <div className="status-list">
            {articleStats.byStatus.map((item) => (
              <div key={item.status} className="status-row">
                <span>{STATUS_LABELS[item.status]}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="section-title">
            <div>
              <h3>最新の更新</h3>
              <p>直近更新された記事を表示。</p>
            </div>
          </div>
          <div className="status-list">
            {latestArticles.length === 0 && <div>まだ記事がありません。</div>}
            {latestArticles.map((item) => (
              <div key={item.id} className="status-row">
                <span>{item.title}</span>
                <span className="badge">{item.updatedAt.slice(0, 10)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-2">
        <div className="card">
          <div className="section-title">
            <div>
              <h3>分析ダッシュボード</h3>
              <p>Search Console / GA4の連携を想定。</p>
            </div>
          </div>
          <div className="notice">
            まだ外部連携がありません。連携後に表示回数・CTR・流入が見えます。
          </div>
        </div>
        <div className="card">
          <div className="section-title">
            <div>
              <h3>収益ダッシュボード</h3>
              <p>楽天・バリューコマース・Amazon成果の統合。</p>
            </div>
          </div>
          <div className="notice">
            収益連携は未設定です。アフィAPI連携後に表示します。
          </div>
        </div>
      </section>
    </div>
  );
}
