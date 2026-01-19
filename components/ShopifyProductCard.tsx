'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createCheckout, ShopifyProduct } from '@/lib/shopify';

interface ShopifyProductCardProps {
    handle: string;
}

export default function ShopifyProductCard({ handle }: ShopifyProductCardProps) {
    const [product, setProduct] = useState<ShopifyProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [debugInfo, setDebugInfo] = useState<string>('');

    useEffect(() => {
        async function fetchProduct() {
            console.log(`[ShopifyDebug] Start fetching: ${handle}`);
            try {
                setLoading(true);
                // API Route経由で取得
                const res = await fetch(`/api/shopify/product?handle=${handle}`);

                console.log(`[ShopifyDebug] Response Status for ${handle}:`, res.status);

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error(`[ShopifyDebug] Error Body for ${handle}:`, errorText);
                    setDebugInfo(`Error: ${res.status} ${errorText.slice(0, 50)}`);
                    throw new Error(`API response status: ${res.status}`);
                }

                const data: ShopifyProduct = await res.json();
                console.log(`[ShopifyDebug] Data received for ${handle}:`, data);
                setProduct(data);
                setDebugInfo('OK');
            } catch (error) {
                console.error(`[ShopifyDebug] Exception for ${handle}:`, error);
                setProduct(null);
                setDebugInfo(`Fail: ${error instanceof Error ? error.message : String(error)}`);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [handle]);

    const handlePurchase = async () => {
        if (!product || !product.variants.edges[0]) return;

        setPurchasing(true);
        const variantId = product.variants.edges[0].node.id;
        const checkoutUrl = await createCheckout(variantId);

        if (checkoutUrl) {
            window.location.href = checkoutUrl;
        } else {
            alert('購入画面への移動に失敗しました。もう一度お試しください。');
            setPurchasing(false);
        }
    };

    // 以前のスケルトンローディング(early return)を廃止し、常にカードを描画する
    // データがない場合は「通信中」または「エラー」を表示

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

            {/* デバッグ情報オーバーレイ (透明度高めで表示) */}
            <div className="absolute top-0 left-0 bg-black/50 text-white text-[10px] p-1 z-20 pointer-events-none font-mono">
                {loading ? `API通信中: ${handle}` : `Status: ${debugInfo}`}
            </div>

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
                        <span className="text-xs font-mono">[{handle}]</span>
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
                        disabled={purchasing}
                        className="w-full bg-accent text-white py-3 px-6 rounded-lg font-bold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {purchasing ? '処理中...' : '購入画面へ'}
                    </button>
                </div>
            </div>
        </div>
    );
}
