import { supabase } from "@/lib/supabaseClient";
import { loadBookmarks, saveBookmarks } from "@/lib/localStore";

export async function fetchBookmarks(): Promise<{ slugs: string[]; signedIn: boolean }> {
  if (!supabase) return { slugs: loadBookmarks(), signedIn: true };
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user?.id ?? null;
  if (!userId) return { slugs: [], signedIn: false };
  const { data: rows, error } = await supabase
    .from("bookmarks")
    .select("slug")
    .eq("user_id", userId);
  if (error) return { slugs: [], signedIn: true };
  const slugs = (rows ?? []).map((row) => row.slug).filter(Boolean);
  return { slugs: Array.from(new Set(slugs)), signedIn: true };
}

export async function persistBookmark(
  slug: string,
  active: boolean
): Promise<{ ok: boolean; requiresLogin: boolean }> {
  if (!supabase) {
    const current = loadBookmarks();
    const next = active
      ? Array.from(new Set([...current, slug]))
      : current.filter((item) => item !== slug);
    saveBookmarks(next);
    return { ok: true, requiresLogin: false };
  }
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user?.id ?? null;
  if (!userId) return { ok: false, requiresLogin: true };
  if (active) {
    const { error } = await supabase
      .from("bookmarks")
      .insert({ slug, user_id: userId, client_id: userId });
    if (error) return { ok: false, requiresLogin: false };
    return { ok: true, requiresLogin: false };
  }
  const { error } = await supabase.from("bookmarks").delete().eq("slug", slug).eq("user_id", userId);
  if (error) return { ok: false, requiresLogin: false };
  return { ok: true, requiresLogin: false };
}
