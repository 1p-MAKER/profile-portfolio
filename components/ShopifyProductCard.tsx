'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShopifyProduct } from '@/lib/shopify';

interface ShopifyProductCardProps {
    handle: string;
}

export default function ShopifyProductCard({ handle }: ShopifyProductCardProps) {
    const [product, setProduct] = useState<ShopifyProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                // API Route経由で取得
                const res = await fetch(`/api/shopify/product?handle=${handle}`);

                if (!res.ok) {
                    throw new Error(`API response status: ${res.status}`);
                }

                const data: ShopifyProduct = await res.json();
                setProduct(data);
            } catch (error) {
                setProduct(null);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [handle]);

    const handlePurchase = () => {
        if (!handle) return;

        const productPageUrl = `https://shizennoshirushi.com/products/${handle}`;
        window.location.href = productPageUrl;
    };

    const imageUrl = product?.images.edges[0]?.node.url;
    const variant = product?.variants.edges[0]?.node;
    const price = variant ? parseFloat(variant.price.amount) : 0;
    const currencyCode = variant?.price.currencyCode || 'JPY';
    const title = product?.title || `(Loading: ${handle}...)`;

    const formattedPrice = new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: currencyCode,
    }).format(price);

    return (
        <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-700 hover:shadow-lg transition-all duration-300 h-full flex flex-col group relative">
            {/* 商品画像エリア */}
            <div className="aspect-square relative overflow-hidden bg-stone-100 dark:bg-stone-700">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-stone-400 text-sm flex-col gap-2">
                        <span>{loading ? 'Now Loading...' : 'No Image'}</span>
                    </div>
                )}
            </div>

            {/* 商品情報 */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{title}</h3>

                <div className="mt-auto">
                    <p className="text-2xl font-bold text-accent mb-4">{formattedPrice}</p>

                    <button
                        onClick={handlePurchase}
                        disabled={loading || purchasing}
                        className="w-full bg-stone-800 text-white py-3 rounded-full font-bold hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {purchasing ? '移動中...' : '商品ページへ'}
                    </button>
                </div>
            </div>
        </div>
    );
}
