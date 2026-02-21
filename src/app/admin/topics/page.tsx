"use client";

import { useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import Link from "next/link";
import {
  REQUIRED_TOPIC_FIELDS,
  SOURCE_LABELS,
  TopicItem,
  SourceType
} from "@/lib/types";
import { loadArticles, loadTopics, saveArticles, saveTopics } from "@/lib/localStore";
import { generateArticleTemplate } from "@/lib/templates";

const CATEGORIES = [
  "掃除",
  "キッチン",
  "収納・片付け",
  "ガジェット",
  "旅行・外出",
  "サービス"
];

const FIELD_LABELS: Record<string, string> = {
  title: "タイトル",
  nicheCondition: "刺さる条件",
  compareAxes: "比較軸",
  officialUrl: "公式URL",
  imageUrl: "画像URL",
  priceRange: "価格帯"
};

const SOURCE_OPTIONS: { value: SourceType; label: string }[] = [
  { value: "rakuten_market", label: "楽天市場" },
  { value: "rakuten_product", label: "楽天プロダクト" },
  { value: "rakuten_books", label: "楽天Books" },
  { value: "yahoo", label: "Yahooショッピング" },
  { value: "manual", label: "手動" }
];

function createTopic(base: Partial<TopicItem> & { source: SourceType }) {
  const now = new Date().toISOString();
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : nanoid(),
    title: base.title ?? "",
    nicheCondition: base.nicheCondition ?? "",
    compareAxes: base.compareAxes ?? [],
    officialUrl: base.officialUrl ?? "",
    imageUrl: base.imageUrl ?? "",
    priceRange: base.priceRange ?? "",
    notes: base.notes ?? "",
    status: base.status ?? "inbox",
    source: base.source,
    createdAt: now
  } satisfies TopicItem;
}

function getMissingFields(topic: TopicItem) {
  const missing: string[] = [];

  REQUIRED_TOPIC_FIELDS.forEach((field) => {
    const value = topic[field];
    if (Array.isArray(value)) {
      if (value.length < 3) missing.push(field);
      return;
    }
    if (!value || (typeof value === "string" && value.trim() === "")) {
      missing.push(field);
    }
  });

  return missing;
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [source, setSource] = useState<SourceType>("rakuten_market");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [manualUrls, setManualUrls] = useState("");

  useEffect(() => {
    setTopics(loadTopics());
  }, []);

  useEffect(() => {
    saveTopics(topics);
  }, [topics]);

  const missingMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    topics.forEach((topic) => {
      map[topic.id] = getMissingFields(topic);
    });
    return map;
  }, [topics]);

  const selectedTopics = topics.filter((topic) => selectedIds.includes(topic.id));
  const selectedMissing = selectedTopics.filter(
    (topic) => (missingMap[topic.id] || []).length > 0
  );

  const canSend = selectedTopics.length > 0 && selectedMissing.length === 0;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(topics.map((topic) => topic.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleCollect = () => {
    const generated = Array.from({ length: 3 }).map((_, index) =>
      createTopic({
        source,
        title: `${category}のニッチ候補 ${index + 1}`,
        officialUrl: "https://example.com",
        imageUrl: "https://example.com/image.jpg",
        priceRange: "¥2,000〜¥8,000",
        compareAxes: ["価格", "特徴", "用途"],
        notes: `日付: ${date}`
      })
    );

    setTopics((prev) => [...generated, ...prev]);
  };

  const handleManualAdd = () => {
    const urls = manualUrls
      .split(/\n|,|\s/)
      .map((entry) => entry.trim())
      .filter(Boolean);

    if (urls.length === 0) return;

    const generated = urls.map((url) =>
      createTopic({
        source: "manual",
        title: url.replace(/^https?:\/\//, "").slice(0, 40),
        officialUrl: url,
        imageUrl: "",
        priceRange: "",
        compareAxes: [],
        notes: "手動追加"
      })
    );

    setTopics((prev) => [...generated, ...prev]);
    setManualUrls("");
  };

  const handleTopicChange = (id: string, patch: Partial<TopicItem>) => {
    setTopics((prev) =>
      prev.map((topic) => (topic.id === id ? { ...topic, ...patch } : topic))
    );
  };

  const handleSendToArticles = () => {
    if (!canSend) return;

    const articles = loadArticles();
    const newArticles = selectedTopics.map((topic) => ({
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : nanoid(),
      title: topic.title,
      slug: `topic-${topic.id.slice(0, 6)}`,
      status: "draft" as const,
      contentMd: generateArticleTemplate(topic),
      sources: topic.officialUrl ? [topic.officialUrl] : [],
      topicIds: [topic.id],
      updatedAt: new Date().toISOString(),
      publishedAt: null
    }));

    saveArticles([...newArticles, ...articles]);

    setTopics((prev) =>
      prev.map((topic) =>
        selectedIds.includes(topic.id) ? { ...topic, status: "sent_to_article" } : topic
      )
    );
    setSelectedIds([]);
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card">
        <div className="section-title">
          <div>
            <h2>ネタ収集タブ</h2>
            <p>カテゴリ・日付指定で収集し、必須カラムが揃ったら記事作成へ送ります。</p>
          </div>
          <span className="badge">手動・API混在OK</span>
        </div>
        <div className="grid grid-2">
          <div>
            <label>参照元</label>
            <select
              className="select"
              value={source}
              onChange={(event) => setSource(event.target.value as SourceType)}
            >
              {SOURCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>カテゴリ</label>
            <select
              className="select"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>日付</label>
            <input
              className="input"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div className="inline-actions" style={{ alignItems: "flex-end" }}>
            <button className="btn btn-primary" onClick={handleCollect} type="button">
              収集する
            </button>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <label>手動URL追加</label>
          <textarea
            className="textarea"
            placeholder="1行1URLで貼り付け"
            value={manualUrls}
            onChange={(event) => setManualUrls(event.target.value)}
          />
          <div className="inline-actions">
            <button className="btn btn-secondary" onClick={handleManualAdd} type="button">
              URLを追加
            </button>
            <span className="notice">許可済みドメインのみを入力してください。</span>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="section-title">
          <div>
            <h3>ネタ一覧</h3>
            <p>必須項目が埋まらないと記事作成へ送れません。</p>
          </div>
          <div className="inline-actions">
            <button
              className="btn btn-primary"
              type="button"
              disabled={!canSend}
              onClick={handleSendToArticles}
            >
              記事作成へ送る
            </button>
            <Link className="btn btn-ghost" href="/admin/articles">
              記事作成タブ
            </Link>
          </div>
        </div>
        <div className="notice" style={{ marginBottom: 12 }}>
          必須: タイトル / 刺さる条件 / 比較軸(3つ以上) / 公式URL / 画像URL / 価格帯
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedIds.length === topics.length && topics.length > 0}
                  onChange={(event) => handleSelectAll(event.target.checked)}
                />
              </th>
              <th>タイトル</th>
              <th>刺さる条件</th>
              <th>比較軸</th>
              <th>公式URL</th>
              <th>画像URL</th>
              <th>価格帯</th>
              <th>参照元</th>
              <th>メモ</th>
              <th>状態</th>
            </tr>
          </thead>
          <tbody>
            {topics.length === 0 && (
              <tr>
                <td colSpan={10}>まだネタがありません。上のフォームから収集してください。</td>
              </tr>
            )}
            {topics.map((topic) => {
              const missing = missingMap[topic.id] || [];
              return (
                <tr key={topic.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(topic.id)}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelectedIds((prev) => [...prev, topic.id]);
                        } else {
                          setSelectedIds((prev) => prev.filter((id) => id !== topic.id));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      value={topic.title}
                      onChange={(event) =>
                        handleTopicChange(topic.id, { title: event.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      value={topic.nicheCondition}
                      onChange={(event) =>
                        handleTopicChange(topic.id, { nicheCondition: event.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      value={topic.compareAxes.join(", ")}
                      onChange={(event) =>
                        handleTopicChange(topic.id, {
                          compareAxes: event.target.value
                            .split(",")
                            .map((entry) => entry.trim())
                            .filter(Boolean)
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      value={topic.officialUrl}
                      onChange={(event) =>
                        handleTopicChange(topic.id, { officialUrl: event.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      value={topic.imageUrl}
                      onChange={(event) =>
                        handleTopicChange(topic.id, { imageUrl: event.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      value={topic.priceRange}
                      onChange={(event) =>
                        handleTopicChange(topic.id, { priceRange: event.target.value })
                      }
                    />
                  </td>
                  <td>{SOURCE_LABELS[topic.source]}</td>
                  <td>
                    <input
                      className="input"
                      value={topic.notes}
                      onChange={(event) =>
                        handleTopicChange(topic.id, { notes: event.target.value })
                      }
                    />
                  </td>
                  <td>
                    {missing.length > 0 ? (
                      <span className="required">
                        未完了: {missing.map((item) => FIELD_LABELS[item]).join("/")}
                      </span>
                    ) : (
                      <span className="badge">OK</span>
                    )}
                    {topic.status === "sent_to_article" && (
                      <div className="badge" style={{ marginTop: 6 }}>
                        記事作成へ送信済み
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {selectedMissing.length > 0 && (
          <div className="notice" style={{ marginTop: 12 }}>
            選択中のネタに未入力項目があります。すべて埋めてから送信してください。
          </div>
        )}
      </section>
    </div>
  );
}
