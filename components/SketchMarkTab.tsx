import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

interface SketchItem {
    id: number;
    title: string;
    price: number;
    imageUrl: string;
    url: string;
}

interface ApiError {
    error: string;
    code?: string;
    hint?: string;
}

export default function SketchMarkTab() {
    const [items, setItems] = useState<SketchItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/sketch-mark');
            const data = await res.json();

            if (!res.ok) {
                setError(data as ApiError);
                setItems([]);
            } else {
                setItems(data.items || []);
                setError(null);
            }
        } catch (err) {
            console.error(err);
            setError({ error: '通信エラーが発生しました。', code: 'NETWORK_ERROR' });
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems, retryCount]);

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
    };

    // Loading State
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin"></div>
                <p className="text-stone-500 text-sm">Loading Sketch Mark Items...</p>
            </div>
        );
    }

    // Error State with Retry
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div className="space-y-2">
                    <p className="text-stone-700 dark:text-stone-300 font-medium">
                        {error.error}
                    </p>
                    {error.hint && (
                        <p className="text-stone-500 dark:text-stone-400 text-sm max-w-md">
                            {error.hint}
                        </p>
                    )}
                    {error.code && (
                        <p className="text-stone-400 text-xs font-mono">
                            Code: {error.code}
                        </p>
                    )}
                </div>
                <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 dark:bg-stone-700 text-white rounded-full hover:bg-stone-700 dark:hover:bg-stone-600 transition-colors text-sm"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    再読み込み
                </button>

                {/* Fallback: Show Instagram link when API fails */}
                <div className="pt-8 border-t border-stone-200 dark:border-stone-700 w-full max-w-md">
                    <p className="text-stone-500 text-sm mb-4">
                        直接ショップをご覧いただけます
                    </p>
                    <a
                        href="https://sketchmark.thebase.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-stone-700 dark:text-stone-300 hover:text-pink-600 transition-colors"
                    >
                        Visit Sketch Mark Shop →
                    </a>
                </div>
            </div>
        );
    }

    // Empty State
    if (items.length === 0) {
        return (
            <div className="text-center py-20 space-y-4">
                <p className="text-stone-500">現在公開中の商品はありません。</p>
                <a
                    href="https://sketchmark.thebase.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-stone-600 hover:text-pink-600 transition-colors"
                >
                    Visit Sketch Mark Shop →
                </a>
            </div>
        );
    }

    // Success State
    return (
        <div className="space-y-12">
            {/* Intro */}
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold font-serif text-stone-800 dark:text-stone-100">
                    いつか意味を持つ
                </h2>
                <p className="text-stone-600 dark:text-stone-400">
                    Sketch Mark Collection
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                    <div key={item.id} className="group bg-white dark:bg-stone-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-stone-100 dark:border-stone-700">
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden bg-stone-100">
                            {item.imageUrl ? (
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-stone-300">No Image</div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="p-4 space-y-3">
                            <h3 className="font-medium text-stone-900 dark:text-stone-100 line-clamp-2">
                                {item.title}
                            </h3>
                            <div className="flex justify-end">
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs bg-stone-900 text-white dark:bg-stone-700 px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity"
                                >
                                    View on Shop
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="text-center border-t border-stone-200 dark:border-stone-700 pt-12 space-y-6">
                <p className="text-lg font-medium text-stone-700 dark:text-stone-300">
                    描いた絵を、Tシャツにしています。
                </p>
                <div className="flex justify-center">
                    <a
                        href="https://www.instagram.com/sketchmark_098/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-stone-600 hover:text-pink-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.48 2h-.165zm-3.77 1.795c-.95.044-1.462.206-1.806.34-.45.176-.773.385-1.107.72-.335.335-.544.658-.72 1.107-.134.344-.296.856-.34 1.807-.044.98-.052 1.282-.052 3.795v.163c0 2.512.008 2.815.052 3.795.044.951.206 1.462.34 1.806.176.45.385.773.72 1.107.335.335.658.544 1.107.72.344.134.856.296 1.807.34.98.044 1.282.052 3.795.052h.163c2.512 0 2.815-.008 3.795-.052.951-.044 1.462-.206 1.806-.34.45-.176.773-.385 1.107-.72.335-.335.544-.658.72-1.107.134-.344.296-.856.34-1.807.044-.98.052-1.282.052-3.795a23.13 23.13 0 010-.163c0-2.512-.008-2.815-.052-3.795-.044-.951-.206-1.462-.34-1.806a3.535 3.535 0 01-.72-1.107 3.533 3.533 0 01-1.107-.72c-.344-.134-.856-.296-1.807-.34-.98-.044-1.282-.052-3.795-.052h-.163c-2.512 0-2.815.008-3.795.052zm4.364 3.012a5.202 5.202 0 015.202 5.202 5.202 5.202 0 01-5.202 5.202 5.202 5.202 0 01-5.202-5.202 5.202 5.202 0 015.202-5.202zm0 1.795a3.407 3.407 0 100 6.814 3.407 3.407 0 000-6.814zm5.88-4.436a1.196 1.196 0 110 2.392 1.196 1.196 0 010-2.392z" clipRule="evenodd" />
                        </svg>
                        <span>@sketchmark_098</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
