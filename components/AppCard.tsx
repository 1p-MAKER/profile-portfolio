'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AppData {
    trackName: string;
    description: string;
    artworkUrl512: string;
    screenshotUrls: string[];
    trackViewUrl: string;
}

interface AppCardProps {
    appId: string;
}

export default function AppCard({ appId }: AppCardProps) {
    const [data, setData] = useState<AppData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/apps?id=${appId}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();
                if (json.results && json.results.length > 0) {
                    setData(json.results[0]);
                } else {
                    setError('App not found');
                }
            } catch (err) {
                console.error(err);
                setError('Error loading data');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [appId]);

    if (loading) {
        return <AppCardSkeleton />;
    }

    if (error || !data) {
        // エラー時は非表示にするか、簡易表示にするか。ここではエラーメッセージ。
        return <div className="p-4 text-red-500 text-xs border border-red-100 rounded-xl bg-red-50">情報の取得に失敗: {appId}</div>;
    }

    return (
        <a href={data.trackViewUrl} target="_blank" rel="noopener noreferrer" className="block group h-full">
            <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg h-full flex flex-col">
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                        <Image
                            src={data.artworkUrl512}
                            alt={data.trackName}
                            width={80}
                            height={80}
                            className="rounded-2xl border border-stone-100 flex-shrink-0"
                        />
                        <div>
                            <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-accent transition-colors line-clamp-2">{data.trackName}</h3>
                            <span className="inline-block text-[10px] bg-stone-100 px-2 py-0.5 rounded-full text-subtext uppercase tracking-wider">iOS App</span>
                        </div>
                    </div>

                    <p className="text-sm text-subtext line-clamp-3 mb-6 flex-grow leading-relaxed">{data.description}</p>

                    <div className="grid grid-cols-3 gap-2 mt-auto">
                        {data.screenshotUrls.slice(0, 3).map((url: string, i: number) => (
                            <div key={i} className="relative aspect-[9/19.5] rounded-lg overflow-hidden border border-stone-100 bg-stone-50">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt="screenshot" className="object-cover w-full h-full" loading="lazy" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </a>
    );
}

function AppCardSkeleton() {
    return (
        <div className="bg-white dark:bg-stone-800 rounded-2xl p-6 border border-stone-100 dark:border-stone-700 h-full flex flex-col gap-4 animate-pulse">
            <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-stone-200 dark:bg-stone-700 rounded-2xl flex-shrink-0"></div>
                <div className="flex-1 space-y-2 mt-1">
                    <div className="h-5 w-3/4 bg-stone-200 rounded"></div>
                    <div className="h-4 w-1/3 bg-stone-200 rounded"></div>
                </div>
            </div>
            <div className="space-y-2 flex-grow">
                <div className="h-3 w-full bg-stone-200 rounded"></div>
                <div className="h-3 w-full bg-stone-200 rounded"></div>
                <div className="h-3 w-2/3 bg-stone-200 rounded"></div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-auto">
                <div className="aspect-[9/19.5] bg-stone-200 rounded-lg"></div>
                <div className="aspect-[9/19.5] bg-stone-200 rounded-lg"></div>
                <div className="aspect-[9/19.5] bg-stone-200 rounded-lg"></div>
            </div>
        </div>
    )
}
