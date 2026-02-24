"use client";

import { useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  REQUIRED_TOPIC_FIELDS,
  SOURCE_LABELS,
  TopicItem,
  SourceType
} from "@/lib/types";
import { createArticles, fetchTopics, syncTopics } from "@/lib/store";
import { generateArticleTemplate } from "@/lib/templates";

const CATEGORIES = [
  "掃除",
  "キッチン",
  "収納",
  "片付け",
  "ガジェット",
  "旅行ガイドサービス",
  "会社"
];

const FIELD_LABELS: Record<string, string> = {
  title: "タイトル",
  productName: "商品名",
  maker: "メーカー",
  price: "価格",
  nicheCondition: "刺さる条件",
  story: "開発背景",
  coreFeatures: "コア機能",
  heroImageUrl: "アイキャッチ",
  usageImageUrl: "利用シーン",
  searchKeyword: "検索KW",
  articleType: "記事タイプ",
  painSpecific: "ペイン具体",
  solutionFocused: "一点突破",
  alternativesWeak: "妥協案のみ",
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

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function createTopic(base: Partial<TopicItem> & { source: SourceType }) {
  const now = new Date().toISOString();
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : nanoid(),
    title: base.title ?? "",
    productName: base.productName ?? "",
    maker: base.maker ?? "",
    price: base.price ?? "",
    nicheCondition: base.nicheCondition ?? "",
    story: base.story ?? "",
    coreFeatures: base.coreFeatures ?? "",
    heroImageUrl: base.heroImageUrl ?? "",
    usageImageUrl: base.usageImageUrl ?? "",
    searchKeyword: base.searchKeyword ?? "",
    articleType: base.articleType ?? "revenue",
    painSpecific: base.painSpecific ?? false,
    solutionFocused: base.solutionFocused ?? false,
    alternativesWeak: base.alternativesWeak ?? false,
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
    if (typeof value === "boolean") {
      if (!value) missing.push(field);
      return;
    }
    if (!value || (typeof value === "string" && value.trim() === "")) {
      missing.push(field);
    }
  });

  return missing;
}

export default function TopicsPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [source, setSource] = useState<SourceType>("rakuten_market");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [manualUrls, setManualUrls] = useState("");
  const [manualRows, setManualRows] = useState<string[]>([""]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchTopics().then((items) => {
      setTopics(items);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => {
      syncTopics(topics);
    }, 700);
    return () => clearTimeout(timer);
  }, [topics, loaded]);

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
        productName: "",
        maker: "",
        price: "",
        officialUrl: "https://example.com",
        imageUrl: "https://example.com/image.jpg",
        heroImageUrl: "https://example.com/image.jpg",
        priceRange: "¥2,000〜¥8,000",
        story: "",
        coreFeatures: "",
        searchKeyword: "",
        compareAxes: ["価格", "特徴", "用途"],
        notes: `日付: ${date}`
      })
    );

    setTopics((prev) => [...generated, ...prev]);
  };

  const handleManualAdd = () => {
    const rowUrls = manualRows.map((entry) => entry.trim()).filter(Boolean);
    const pastedUrls = manualUrls
      .split(/\n|,|\s/)
      .map((entry) => entry.trim())
      .filter(Boolean);
    const urls = Array.from(new Set([...rowUrls, ...pastedUrls]));

    if (urls.length === 0) return;

    const generated = urls.map((url) =>
      createTopic({
        source: "manual",
        title: url.replace(/^https?:\/\//, "").slice(0, 40),
        productName: "",
        maker: "",
        price: "",
        officialUrl: url,
        imageUrl: "",
        heroImageUrl: "",
        priceRange: "",
        compareAxes: [],
        notes: "手動追加"
      })
    );

    setTopics((prev) => [...generated, ...prev]);
    setManualUrls("");
    setManualRows([""]);
  };

  const handleTopicChange = (id: string, patch: Partial<TopicItem>) => {
    setTopics((prev) =>
      prev.map((topic) => (topic.id === id ? { ...topic, ...patch } : topic))
    );
  };

  const handleSendToArticles = async () => {
    if (!canSend) {
      window.alert("チェックを入れて必須項目を埋めてから送信してください。");
      return;
    }

    const newArticles = selectedTopics.map((topic) => ({
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : nanoid(),
      title: topic.title,
      slug: slugify(topic.productName || topic.title || `topic-${topic.id.slice(0, 6)}`),
      status: "draft" as const,
      articleType: topic.articleType,
      contentMd: generateArticleTemplate(topic),
      categories: [],
      tags: [],
      sources: topic.officialUrl ? [topic.officialUrl] : [],
      topicIds: [topic.id],
      updatedAt: new Date().toISOString(),
      publishedAt: null
    }));
    await createArticles(newArticles);

    setTopics((prev) =>
      prev.map((topic) =>
        selectedIds.includes(topic.id) ? { ...topic, status: "sent_to_article" } : topic
      )
    );
    setSelectedIds([]);
    router.push("/admin/articles");
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
          <label>手動URL追加（個別入力）</label>
          <div className="grid" style={{ marginTop: 8 }}>
            {manualRows.map((value, index) => (
              <input
                key={`row-${index}`}
                className="input"
                placeholder={`URL ${index + 1}`}
                value={value}
                onChange={(event) => {
                  const next = [...manualRows];
                  next[index] = event.target.value;
                  if (index === manualRows.length - 1 && event.target.value.trim() !== "") {
                    next.push("");
                  }
                  setManualRows(next);
                }}
              />
            ))}
          </div>
          <div className="notice" style={{ marginTop: 8 }}>
            URLを入力すると次の空欄が自動で追加されます。
          </div>
          <label style={{ marginTop: 16, display: "block" }}>手動URL追加（一括ペースト）</label>
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
          必須: タイトル / 商品名 / メーカー / 価格 / 刺さる条件 / 開発背景 / コア機能 /
          アイキャッチ / 記事タイプ / ニッチ判定(3条件)
        </div>
        <div className="table-wrap">
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
              <th>商品名</th>
              <th>メーカー</th>
              <th>価格</th>
              <th>刺さる条件</th>
              <th>記事タイプ</th>
              <th>ニッチ判定</th>
              <th>開発背景</th>
              <th>コア機能</th>
              <th>アイキャッチ</th>
              <th>利用シーン</th>
              <th>検索KW</th>
              <th>公式URL</th>
              <th>参照元</th>
              <th>メモ</th>
              <th>状態</th>
            </tr>
          </thead>
          <tbody>
            {topics.length === 0 && (
              <tr>
                <td colSpan={17}>まだネタがありません。上のフォームから収集してください。</td>
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
                      value={topic.productName}
                      onChange={(event) =>
                        handleTopicChange(topic.id, { productName: event.target.value })
                      }
                      placeholder="商品名"
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      value={topic.maker}
                      onChange={(event) =>
                        handleTopicChange(topic.id, { maker: event.target.value })
                      }
                      placeholder="メーカー"
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      value={topic.price}
                      onChange={(event) =>
                        handleTopicChange(topic.id, { price: event.target.value })
                      }
                      placeholder="例: ¥1,280"
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
                    <select
                      className="select"
                      value={topic.articleType}
                      onChange={(event) =>
                        handleTopicChange(topic.id, {
                          articleType: event.target.value as TopicItem["articleType"]
                        })
                      }
                    >
                      <option value="revenue">収益</option>
                      <option value="discovery">発見</option>
                    </select>
                  </td>
                  <td>
                    <div className="chip-row">
                      <label className="chip chip-btn">
                        <input
                          type="checkbox"
                          checked={topic.painSpecific}
                          onChange={(event) =>
                            handleTopicChange(topic.id, { painSpecific: event.target.checked })
                          }
                        />
                        ペイン具体
                      </label>
                      <label className="chip chip-btn">
                        <input
                          type="checkbox"
                          checked={topic.solutionFocused}
                          onChange={(event) =>
                            handleTopicChange(topic.id, { solutionFocused: event.target.checked })
                          }
                        />
                        一点突破
                      </label>
                      <label className="chip chip-btn">
                        <input
                          type="checkbox"
                          checked={topic.alternativesWeak}
                          onChange={(event) =>
                            handleTopicChange(topic.id, { alternativesWeak: event.target.checked })
                          }
                        />
                        妥協案のみ
                      </label>
                    </div>
                  </td>
                  <td>
                    <textarea
                      className="textarea"
                      value={topic.story}
                      onChange={(event) =>
                        handleTopicChange(topic.id, { story: event.target.value })
                      }
                      placeholder="開発背景・企業の狂気"
                    />
                  </td>
                  <td>
                    <textarea
                      className="textarea"
                      value={topic.coreFeatures}
                      onChange={(event) =>
                        handleTopicChange(topic.id, { coreFeatures: event.target.value })
                      }
                      placeholder="コア機能/特徴（改行で箇条書き）"
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      value={topic.heroImageUrl}
                      onChange={(event) =>
                        handleTopicChange(topic.id, { heroImageUrl: event.target.value })
                      }
                      placeholder="アイキャッチ画像URL"
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      value={topic.usageImageUrl}
                      onChange={(event) =>
                        handleTopicChange(topic.id, { usageImageUrl: event.target.value })
                      }
                      placeholder="利用シーン画像URL"
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      value={topic.searchKeyword}
                      onChange={(event) =>
                        handleTopicChange(topic.id, { searchKeyword: event.target.value })
                      }
                      placeholder="検索用キーワード"
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      value={topic.officialUrl}
                      onChange={(event) =>
                        handleTopicChange(topic.id, { officialUrl: event.target.value })
                      }
                      placeholder="公式URL"
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
        </div>
        {selectedMissing.length > 0 && (
          <div className="notice" style={{ marginTop: 12 }}>
            選択中のネタに未入力項目があります。すべて埋めてから送信してください。
          </div>
        )}
      </section>
    </div>
  );
}
