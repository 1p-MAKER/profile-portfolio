import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 環境変数
const BASE_CLIENT_ID = process.env.BASE_CLIENT_ID;
const BASE_CLIENT_SECRET = process.env.BASE_CLIENT_SECRET;
const BASE_REFRESH_TOKEN = process.env.BASE_REFRESH_TOKEN;
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

// BASE商品取得
async function getBaseItems() {
    if (!BASE_CLIENT_ID || !BASE_CLIENT_SECRET || !BASE_REFRESH_TOKEN) {
        console.log("BASE credentials missing");
        return [];
    }

    try {
        // 1. Refresh token でアクセストークン取得
        const tokenResponse = await fetch('https://api.thebase.in/1/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: BASE_CLIENT_ID,
                client_secret: BASE_CLIENT_SECRET,
                refresh_token: BASE_REFRESH_TOKEN,
            }),
        });

        if (!tokenResponse.ok) {
            console.error('BASE Token Error:', await tokenResponse.text());
            return [];
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // 2. 商品一覧取得
        const itemsResponse = await fetch('https://api.thebase.in/1/items?limit=20', {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (!itemsResponse.ok) {
            console.error('BASE Items Error:', await itemsResponse.text());
            return [];
        }

        const itemsData = await itemsResponse.json();

        // 3. フィルタとマッピング
        return (itemsData.items || [])
            .filter((item: any) => item.visible === 1 || item.visible === true)
            .map((item: any) => ({
                id: `base-${item.item_id}`,
                type: 'base',
                title: item.title,
                imageUrl: item.img1_640 || item.img1_origin,
                url: `https://sketchmark.thebase.in/items/${item.item_id}`,
                date: item.modified || item.created || new Date().toISOString(),
                price: null, // ギャラリー表示のため非表示
            }));
    } catch (error) {
        console.error('BASE Fetch Error:', error);
        return [];
    }
}

// Instagram投稿取得
async function getInstagramItems() {
    if (!INSTAGRAM_ACCESS_TOKEN) {
        console.log('No Instagram Token found');
        return [];
    }

    const fields = 'id,caption,media_type,media_url,permalink,timestamp,thumbnail_url';
    const url = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${INSTAGRAM_ACCESS_TOKEN}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            console.error('Instagram API Error:', data.error);
            return [];
        }

        return (data.data || []).map((item: any) => ({
            id: `ig-${item.id}`,
            type: 'instagram',
            title: item.caption ? item.caption.split('\n')[0].substring(0, 50) : 'Sketch',
            imageUrl: item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url,
            url: item.permalink,
            date: item.timestamp,
            price: null,
        }));
    } catch (error) {
        console.error('Instagram Fetch Error:', error);
        return [];
    }
}

export async function GET() {
    try {
        // 1. 並行取得
        const [baseItems, instagramItems] = await Promise.all([
            getBaseItems(),
            getInstagramItems(),
        ]);

        // 2. 統合
        const allItems = [...baseItems, ...instagramItems];

        // 3. 日付降順ソート
        allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json({
            items: allItems,
            count: allItems.length,
            sources: {
                base: baseItems.length,
                instagram: instagramItems.length,
            },
            success: true,
        });
    } catch (error) {
        console.error('Hybrid API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', code: 'HYBRID_ERROR' },
            { status: 500 }
        );
    }
}
