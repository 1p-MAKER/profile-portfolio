'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ContentData, OfficeItem } from '@/types/content';
import Link from 'next/link';
import Footer from '@/components/Footer';

// Define Custom Element Type here as well to avoid import issues or global type conflicts in this isolated page
const StripeBuyButton = 'stripe-buy-button' as any;

export default function CheckoutPage() {
    const params = useParams();
    const id = params?.id as string;
    const [item, setItem] = useState<OfficeItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        // Fetch data from the same API as the main site
        fetch('/api/data')
            .then(res => res.json())
            .then((data: ContentData) => {
                const found = data.officeItems?.find(i => i.id === id);
                if (found) {
                    setItem(found);
                } else {
                    setError('指定された決済ページが見つかりませんでした。');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('データの読み込みに失敗しました。');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="text-stone-500 font-medium">読み込み中...</div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4">
                <h1 className="text-xl font-bold text-stone-900 mb-2">エラー</h1>
                <p className="text-stone-600 mb-6">{error}</p>
                <Link href="/" className="text-accent hover:underline">
                    トップページへ戻る
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            {/* Simple Header */}
            <header className="bg-white border-b border-stone-200 py-4 px-6 flex justify-center">
                <span className="font-serif font-bold text-xl tracking-tight text-stone-900">
                    Dev cat's Office
                </span>
            </header>

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                    <div className="p-8 text-center">
                        <h1 className="text-2xl font-bold text-stone-900 mb-4">{item.title}</h1>
                        {item.description && (
                            <p className="text-stone-600 mb-8 whitespace-pre-wrap text-sm leading-relaxed">
                                {item.description}
                            </p>
                        )}

                        <div className="flex justify-center py-4">
                            {/* Helper Script for Stripe */}
                            <script async src="https://js.stripe.com/v3/buy-button.js"></script>

                            <StripeBuyButton
                                buy-button-id={item.buyButtonId}
                                publishable-key={item.publishableKey}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-6 text-center text-xs text-stone-500">
                <div className="space-x-4 mb-2">
                    <Link href="/legal" className="hover:text-stone-800 transition-colors">
                        特定商取引法に基づく表記
                    </Link>
                    <Link href="/privacy" className="hover:text-stone-800 transition-colors">
                        プライバシーポリシー
                    </Link>
                </div>
                <p>&copy; {new Date().getFullYear()} Dev cat's Office</p>
            </footer>
        </div>
    );
}
