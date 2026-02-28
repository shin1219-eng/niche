import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { supabase as supabaseAnon } from "@/lib/supabaseClient";
import { toArticleRow } from "@/lib/store";
import { ArticleItem, ArticleStatus } from "@/lib/types";
import { nanoid } from "nanoid";

function getAuthedDb(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  const serverKey = process.env.NICHE_API_KEY;

  if (!serverKey || apiKey !== serverKey) {
    return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const db = supabaseAdmin ?? supabaseAnon;
  if (!db) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 }),
    };
  }

  return { ok: true as const, db };
}

export async function POST(req: NextRequest) {
  const authed = getAuthedDb(req);
  if (!authed.ok) return authed.res;

  try {
    const body = await req.json();

    const article: ArticleItem = {
      id: body.id || nanoid(),
      title: body.title || "Untitled",
      slug: body.slug || `article-${Date.now()}`,
      status: (body.status as ArticleStatus) || "draft",
      articleType: body.articleType,
      contentMd: body.contentMd || "",
      categories: body.categories || [],
      tags: body.tags || [],
      sources: body.sources || [],
      topicIds: body.topicIds || [],
      updatedAt: new Date().toISOString(),
      publishedAt: body.publishedAt || null,
    };

    const { data, error } = await authed.db.from("articles").insert([toArticleRow(article)]).select();

    if (error) {
      console.error("Database insertion error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Article created successfully", data: data?.[0] }, { status: 201 });
  } catch (err) {
    console.error("API processing error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const authed = getAuthedDb(req);
  if (!authed.ok) return authed.res;

  try {
    const body = await req.json();
    const id = body.id as string | undefined;

    if (!id) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
    }

    const patch: Partial<ArticleItem> = {
      title: body.title,
      slug: body.slug,
      status: body.status,
      articleType: body.articleType,
      contentMd: body.contentMd,
      categories: body.categories,
      tags: body.tags,
      sources: body.sources,
      topicIds: body.topicIds,
      publishedAt: body.publishedAt,
      updatedAt: new Date().toISOString(),
    };

    // Remove undefined fields
    Object.keys(patch).forEach((k) => {
      if ((patch as any)[k] === undefined) delete (patch as any)[k];
    });

    // Map to DB columns
    const rowPatch: Record<string, any> = {
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.slug !== undefined ? { slug: patch.slug } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.articleType !== undefined ? { article_type: patch.articleType } : {}),
      ...(patch.contentMd !== undefined ? { content_md: patch.contentMd } : {}),
      ...(patch.categories !== undefined ? { categories: patch.categories } : {}),
      ...(patch.tags !== undefined ? { tags: patch.tags } : {}),
      ...(patch.sources !== undefined ? { sources: patch.sources } : {}),
      ...(patch.topicIds !== undefined ? { topic_ids: patch.topicIds } : {}),
      ...(patch.publishedAt !== undefined ? { published_at: patch.publishedAt } : {}),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await authed.db
      .from("articles")
      .update(rowPatch)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Database update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Article updated successfully", data: data?.[0] }, { status: 200 });
  } catch (err) {
    console.error("API processing error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 400 });
  }
}
