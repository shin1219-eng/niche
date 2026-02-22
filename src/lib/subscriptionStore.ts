import { supabase } from "@/lib/supabaseClient";

export async function fetchCategorySubscriptions(): Promise<string[]> {
  if (!supabase) return [];
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id ?? null;
  if (!userId) return [];
  const { data, error } = await supabase
    .from("category_subscriptions")
    .select("category_id")
    .eq("user_id", userId);
  if (error) return [];
  return (data ?? []).map((row) => row.category_id).filter(Boolean);
}

export async function toggleCategorySubscription(categoryId: string, active: boolean) {
  if (!supabase) return;
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id ?? null;
  if (!userId) return;
  if (active) {
    await supabase
      .from("category_subscriptions")
      .insert({ category_id: categoryId, user_id: userId });
    return;
  }
  await supabase
    .from("category_subscriptions")
    .delete()
    .eq("category_id", categoryId)
    .eq("user_id", userId);
}
