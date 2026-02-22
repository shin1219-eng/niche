import { supabase } from "@/lib/supabaseClient";
import {
  loadCategories as loadCategoriesLocal,
  loadTags as loadTagsLocal,
  saveCategories as saveCategoriesLocal,
  saveTags as saveTagsLocal
} from "@/lib/localStore";
import { CategoryItem, TagItem } from "@/lib/types";

const toCategoryRow = (item: CategoryItem) => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  created_at: item.createdAt,
  updated_at: new Date().toISOString()
});

const fromCategoryRow = (row: Record<string, any>): CategoryItem => ({
  id: row.id,
  name: row.name ?? "",
  slug: row.slug ?? "",
  createdAt: row.created_at ?? new Date().toISOString(),
  updatedAt: row.updated_at ?? new Date().toISOString()
});

const toTagRow = (item: TagItem) => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  created_at: item.createdAt,
  updated_at: new Date().toISOString()
});

const fromTagRow = (row: Record<string, any>): TagItem => ({
  id: row.id,
  name: row.name ?? "",
  slug: row.slug ?? "",
  createdAt: row.created_at ?? new Date().toISOString(),
  updatedAt: row.updated_at ?? new Date().toISOString()
});

export async function fetchCategories(): Promise<CategoryItem[]> {
  if (!supabase) {
    return (loadCategoriesLocal() as CategoryItem[]) ?? [];
  }
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });
  return (data ?? []).map(fromCategoryRow);
}

export async function syncCategories(items: CategoryItem[]) {
  if (!supabase) return saveCategoriesLocal(items as Array<Record<string, any>>);
  if (items.length === 0) return;
  await supabase.from("categories").upsert(items.map(toCategoryRow), { onConflict: "id" });
}

export async function fetchTags(): Promise<TagItem[]> {
  if (!supabase) {
    return (loadTagsLocal() as TagItem[]) ?? [];
  }
  const { data } = await supabase
    .from("tags")
    .select("*")
    .order("created_at", { ascending: true });
  return (data ?? []).map(fromTagRow);
}

export async function syncTags(items: TagItem[]) {
  if (!supabase) return saveTagsLocal(items as Array<Record<string, any>>);
  if (items.length === 0) return;
  await supabase.from("tags").upsert(items.map(toTagRow), { onConflict: "id" });
}
