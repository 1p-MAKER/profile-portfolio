'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProduct, createCheckout, ShopifyProduct } from '@/lib/shopify';

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
                const data = await getProduct(handle);
                setProduct(data);
            } catch (error) {
                console.error(`Failed to fetch product for handle: ${handle}`, error);
                setProduct(null); // エラー時はnullを設定して"取得できませんでした"を表示させる
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

    if (loading) {
        return (
            <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-700 animate-pulse h-full">
                <div className="aspect-square bg-stone-200 dark:bg-stone-700" />
                <div className="p-6">
                    <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/2 mb-4" />
                    <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded" />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-700 p-6 text-center h-full">
                <p className="text-stone-500">商品情報を取得できませんでした</p>
            </div>
        );
    }

    const imageUrl = product.images.edges[0]?.node.url;
    const variant = product.variants.edges[0]?.node;
    const price = variant ? parseFloat(variant.price.amount) : 0;
    const currencyCode = variant?.price.currencyCode || 'JPY';

    const formattedPrice = new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: currencyCode,
    }).format(price);

    return (
        <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-700 hover:shadow-lg transition-all duration-300 h-full flex flex-col group">
            {/* 商品画像 */}
            <div className="aspect-square relative overflow-hidden bg-stone-100 dark:bg-stone-700">
                {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                )}
            </div>

            {/* 商品情報 */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.title}</h3>

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
