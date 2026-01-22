import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const clientId = process.env.BASE_CLIENT_ID;
    const clientSecret = process.env.BASE_CLIENT_SECRET;
    const refreshToken = process.env.BASE_REFRESH_TOKEN;

    // Check if we have all required credentials
    if (!clientId || !clientSecret) {
        return NextResponse.json({
            error: 'Server configuration error: Missing BASE_CLIENT_ID or BASE_CLIENT_SECRET',
            code: 'MISSING_CREDENTIALS'
        }, { status: 500 });
    }

    if (!refreshToken) {
        return NextResponse.json({
            error: 'Server configuration error: Missing BASE_REFRESH_TOKEN. Please complete OAuth authorization flow first.',
            code: 'MISSING_REFRESH_TOKEN',
            hint: 'You need to authorize the app via BASE Developer Console and provide the refresh_token.'
        }, { status: 500 });
    }

    try {
        // 1. Get Access Token using Refresh Token
        const tokenResponse = await fetch('https://api.thebase.in/1/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
            }),
        });

        if (!tokenResponse.ok) {
            const errText = await tokenResponse.text();
            console.error('BASE Token Error:', errText);
            return NextResponse.json({
                error: 'Failed to authenticate with BASE',
                details: errText,
                code: 'AUTH_FAILED'
            }, { status: tokenResponse.status });
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Note: If BASE returns a new refresh token, you should update your env var
        // For now, we just use the access token
        if (tokenData.refresh_token && tokenData.refresh_token !== refreshToken) {
            console.warn('BASE returned a new refresh_token. Consider updating your environment variable.');
        }

        // 2. Fetch Items
        const itemsResponse = await fetch('https://api.thebase.in/1/items?limit=20', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!itemsResponse.ok) {
            const errText = await itemsResponse.text();
            console.error('BASE Items Error:', errText);
            return NextResponse.json({
                error: 'Failed to fetch items',
                details: errText,
                code: 'FETCH_FAILED'
            }, { status: itemsResponse.status });
        }

        const itemsData = await itemsResponse.json();

        // 3. Filter and Map
        const items = (itemsData.items || [])
            .filter((item: any) => item.visible === 1 || item.visible === true)
            .map((item: any) => ({
                id: item.item_id,
                title: item.title,
                price: item.price,
                imageUrl: item.img1_640 || item.img1_origin,
                url: `https://sketchmark.thebase.in/items/${item.item_id}`, // Direct item link
            }));

        return NextResponse.json({
            items,
            count: items.length,
            success: true
        });

    } catch (error) {
        console.error('Internal API Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            code: 'INTERNAL_ERROR'
        }, { status: 500 });
    }
}
