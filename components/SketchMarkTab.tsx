import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SketchItem {
    id: number;
    title: string;
    price: number;
    imageUrl: string;
    url: string;
}

export default function SketchMarkTab() {
    const [items, setItems] = useState<SketchItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch('/api/base/items');
                if (!res.ok) {
                    throw new Error('Failed to fetch items');
                }
                const data = await res.json();
                setItems(data.items || []);
            } catch (err) {
                console.error(err);
                setError('商品データの読み込みに失敗しました。');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    if (loading) {
        return <div className="text-center py-20 text-stone-500">Loading Sketch Mark Items...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

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
                            <h3 className="font-medium text-stone-900 dark:text-stone-100 line-clamp-1">
                                {item.title}
                            </h3>
                            <div className="flex items-center justify-between">
                                <span className="text-stone-600 dark:text-stone-400 text-sm">
                                    ¥{item.price.toLocaleString()}
                                </span>
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
