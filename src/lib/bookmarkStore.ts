import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabaseClient";
import { loadBookmarks, saveBookmarks } from "@/lib/localStore";

const CLIENT_ID_KEY = "niche_client_id";

const getClientId = () => {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(CLIENT_ID_KEY);
  if (existing) return existing;
  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : nanoid();
  window.localStorage.setItem(CLIENT_ID_KEY, generated);
  return generated;
};

const getBookmarkIdentity = async () => {
  const clientId = getClientId();
  if (!supabase) return { clientId, userId: null as string | null };
  const { data } = await supabase.auth.getSession();
  return { clientId, userId: data.session?.user?.id ?? null };
};

export async function fetchBookmarks(): Promise<string[]> {
  if (!supabase) return loadBookmarks();
  const { clientId, userId } = await getBookmarkIdentity();
  let query = supabase.from("bookmarks").select("slug");
  query = userId ? query.eq("user_id", userId) : query.eq("client_id", clientId);
  const { data, error } = await query;
  if (error) return loadBookmarks();
  const slugs = (data ?? []).map((row) => row.slug).filter(Boolean);
  return Array.from(new Set(slugs));
}

export async function persistBookmark(slug: string, active: boolean) {
  if (!supabase) {
    const current = loadBookmarks();
    const next = active
      ? Array.from(new Set([...current, slug]))
      : current.filter((item) => item !== slug);
    saveBookmarks(next);
    return;
  }
  const { clientId, userId } = await getBookmarkIdentity();
  if (active) {
    const { error } = await supabase
      .from("bookmarks")
      .insert({ slug, user_id: userId, client_id: clientId });
    if (error) {
      const current = loadBookmarks();
      const next = Array.from(new Set([...current, slug]));
      saveBookmarks(next);
    }
  } else {
    let query = supabase.from("bookmarks").delete().eq("slug", slug);
    query = userId ? query.eq("user_id", userId) : query.eq("client_id", clientId);
    const { error } = await query;
    if (error) {
      const current = loadBookmarks();
      const next = current.filter((item) => item !== slug);
      saveBookmarks(next);
    }
  }
}
