import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const handle = searchParams.get('handle');

    if (!handle) {
        return NextResponse.json({ error: 'Handle is required' }, { status: 400 });
    }

    try {
        const product = await getProduct(handle);
        if (!product) {
            // Shopify returned null, which means not found or not published
            return NextResponse.json({
                error: 'Product not found',
                reason: 'Shopify returned null. Check if product is Active and published to Storefront API channel.',
                handle: handle
            }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching Shopify product via API route:', error);
        return NextResponse.json(
            {
                error: 'Internal Server Error',
                details: error instanceof Error ? error.message : String(error),
                handle: handle
            },
            { status: 500 }
        );
    }
}
