import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { toArticleRow } from '@/lib/store';
import { ArticleItem } from '@/lib/types';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
    const apiKey = req.headers.get('x-api-key');
    const serverKey = process.env.NICHE_API_KEY;

    // 1. Authentication
    if (!serverKey || apiKey !== serverKey) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();

        // 2. Validation & Preparation
        const article: ArticleItem = {
            id: body.id || nanoid(),
            title: body.title || 'Untitled',
            slug: body.slug || `article-${Date.now()}`,
            status: body.status || 'draft',
            articleType: body.articleType,
            contentMd: body.contentMd || '',
            categories: body.categories || [],
            tags: body.tags || [],
            sources: body.sources || [],
            topicIds: body.topicIds || [],
            updatedAt: new Date().toISOString(),
            publishedAt: body.publishedAt || null,
        };

        if (!supabase) {
            return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });
        }

        // 3. Database Operation
        const { data, error } = await supabase
            .from('articles')
            .insert([toArticleRow(article)])
            .select();

        if (error) {
            console.error('Database insertion error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Article created successfully', data: data?.[0] }, { status: 201 });

    } catch (err) {
        console.error('API processing error:', err);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 400 });
    }
}
