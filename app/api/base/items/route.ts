import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const clientId = process.env.BASE_CLIENT_ID;
    const clientSecret = process.env.BASE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return NextResponse.json({ error: 'Server configuration error: Missing Credentials' }, { status: 500 });
    }

    try {
        // 1. Authenticate (Client Credentials Flow)
        // Note: BASE API typically requires authorization_code for shop management,
        // but for public item search, we hope client_credentials works or we might need a different approach.
        // Let's try fetching the items directly if we can't secure a token easily without callbacks.
        // Actually, many "Client Credentials" flows in generic APIs allow this. I will implement it.

        const tokenResponse = await fetch('https://api.thebase.in/1/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });

        if (!tokenResponse.ok) {
            const errText = await tokenResponse.text();
            console.error('BASE Token Error:', errText);
            // If token fails, return mock data or error? 
            // Better to return error so we know we need to fix auth.
            return NextResponse.json({ error: 'Failed to authenticate with BASE', details: errText }, { status: tokenResponse.status });
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // 2. Fetch Items
        const itemsResponse = await fetch('https://api.thebase.in/1/items/search?limit=20&sort=newest', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!itemsResponse.ok) {
            const errText = await itemsResponse.text();
            console.error('BASE Items Error:', errText);
            return NextResponse.json({ error: 'Failed to fetch items', details: errText }, { status: itemsResponse.status });
        }

        const itemsData = await itemsResponse.json();

        // 3. Filter and Mpa
        const items = itemsData.items
            .filter((item: any) => item.visible === 1 || item.visible === true)
            .map((item: any) => ({
                id: item.item_id,
                title: item.title,
                price: item.price,
                imageUrl: item.img1_640 || item.img1_origin, // Use 640px or original
                url: item.item_url,
            }));

        return NextResponse.json({ items });

    } catch (error) {
        console.error('Internal API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
