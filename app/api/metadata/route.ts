import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch url: ${response.status}`);
        }

        const html = await response.text();

        // Simple regex to extract OGP tags
        const getMetaContent = (prop: string) => {
            const regex = new RegExp(`<meta property="${prop}" content="([^"]*)"`, 'i');
            const match = html.match(regex);
            if (match) return match[1];

            // Fallback for name="twitter:..." etc
            const regex2 = new RegExp(`<meta name="${prop}" content="([^"]*)"`, 'i');
            const match2 = html.match(regex2);
            return match2 ? match2[1] : '';
        };

        const getTitle = () => {
            const ogTitle = getMetaContent('og:title');
            if (ogTitle) return ogTitle;
            const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
            return titleMatch ? titleMatch[1] : '';
        };

        const title = getTitle();
        const imageUrl = getMetaContent('og:image');
        const siteName = getMetaContent('og:site_name');

        return NextResponse.json({
            title: title || 'No Title',
            imageUrl: imageUrl || '',
            siteName: siteName || ''
        });

    } catch (error: any) {
        console.error('Metadata fetch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
