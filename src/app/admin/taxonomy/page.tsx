"use client";

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { CategoryItem, TagItem } from "@/lib/types";
import { fetchCategories, fetchTags, syncCategories, syncTags } from "@/lib/taxonomyStore";

const createCategory = (): CategoryItem => ({
  id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : nanoid(),
  name: "",
  slug: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const createTag = (): TagItem => ({
  id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : nanoid(),
  name: "",
  slug: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export default function AdminTaxonomyPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchCategories().then((items) => setCategories(items));
    fetchTags().then((items) => setTags(items));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => {
      syncCategories(categories);
      syncTags(tags);
    }, 600);
    return () => clearTimeout(timer);
  }, [categories, tags, loaded]);

  const updateCategory = (id: string, patch: Partial<CategoryItem>) => {
    setCategories((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item
      )
    );
  };

  const updateTag = (id: string, patch: Partial<TagItem>) => {
    setTags((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item
      )
    );
  };

  const removeCategory = (id: string) => {
    setCategories((prev) => prev.filter((item) => item.id !== id));
  };

  const removeTag = (id: string) => {
    setTags((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card">
        <div className="section-title">
          <div>
            <h2>カテゴリ・タグ管理</h2>
            <p>メール通知や分類に使うカテゴリ/タグを管理します。</p>
          </div>
          <span className="badge">管理者のみ</span>
        </div>
      </section>

      <section className="grid grid-2">
        <div className="card">
          <div className="section-title">
            <div>
              <h3>カテゴリ</h3>
              <p>記事の主要分類に使います。</p>
            </div>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => setCategories((prev) => [...prev, createCategory()])}
            >
              追加
            </button>
          </div>
          <div className="grid" style={{ gap: 12 }}>
            {categories.length === 0 && <div className="notice">まだカテゴリがありません。</div>}
            {categories.map((item) => (
              <div key={item.id} className="card" style={{ padding: 16 }}>
                <div className="grid grid-2">
                  <div>
                    <label>カテゴリ名</label>
                    <input
                      className="input"
                      value={item.name}
                      onChange={(event) => updateCategory(item.id, { name: event.target.value })}
                      placeholder="例: 掃除"
                    />
                  </div>
                  <div>
                    <label>スラッグ</label>
                    <input
                      className="input"
                      value={item.slug}
                      onChange={(event) => updateCategory(item.id, { slug: event.target.value })}
                      placeholder="例: cleaning"
                    />
                  </div>
                </div>
                <div className="inline-actions" style={{ marginTop: 12 }}>
                  <span className="badge">更新: {item.updatedAt.slice(0, 10)}</span>
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => removeCategory(item.id)}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="section-title">
            <div>
              <h3>タグ</h3>
              <p>ニッチ条件や特徴の整理に使います。</p>
            </div>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => setTags((prev) => [...prev, createTag()])}
            >
              追加
            </button>
          </div>
          <div className="grid" style={{ gap: 12 }}>
            {tags.length === 0 && <div className="notice">まだタグがありません。</div>}
            {tags.map((item) => (
              <div key={item.id} className="card" style={{ padding: 16 }}>
                <div className="grid grid-2">
                  <div>
                    <label>タグ名</label>
                    <input
                      className="input"
                      value={item.name}
                      onChange={(event) => updateTag(item.id, { name: event.target.value })}
                      placeholder="例: 静音"
                    />
                  </div>
                  <div>
                    <label>スラッグ</label>
                    <input
                      className="input"
                      value={item.slug}
                      onChange={(event) => updateTag(item.id, { slug: event.target.value })}
                      placeholder="例: silent"
                    />
                  </div>
                </div>
                <div className="inline-actions" style={{ marginTop: 12 }}>
                  <span className="badge">更新: {item.updatedAt.slice(0, 10)}</span>
                  <button className="btn btn-ghost" type="button" onClick={() => removeTag(item.id)}>
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
