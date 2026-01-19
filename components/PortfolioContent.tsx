'use client';

import { useState } from 'react';
import Footer from '@/components/Footer';
import AppCard from '@/components/AppCard';
import SimpleCard from './SimpleCard';
import FurusatoCard from '@/components/FurusatoCard';
import YouTubeEmbed from './YouTubeEmbed';
import ShopifyProductCard from '@/components/ShopifyProductCard';
import AudioCard from '@/components/AudioCard';
import Image from 'next/image';
import { ContentData } from '@/types/content';

// TabType is now derived from the data structure loosely, or kept as a union for safety
// For simplicity in this refactor, we accept string as activeTab to match dynamic data
type TabType = string;

export default function PortfolioContent({ data }: { data: ContentData }) {
    // データがない場合のフォールバック（初回ロード時など）
    const initialTab = data.tabs && data.tabs.length > 0 ? data.tabs[0].id : 'leather';
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);

    // Image Lightbox Modal State
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Use tabs from data
    const tabs = data.tabs || [];

    // Featured items collection
    const getFeaturedItems = () => {
        const items: Array<{
            type: 'ios' | 'leather' | 'shopify' | 'sns' | 'youtube' | 'furusato' | 'videoProduction';
            data: any;
        }> = [];

        // iOS Apps
        data.iosApps?.filter(app => app.isFeatured).forEach(app => {
            items.push({ type: 'ios', data: app });
        });

        // Leather Products
        data.leatherProducts?.filter(p => p.isFeatured).forEach(p => {
            items.push({ type: 'leather', data: p });
        });

        // Shopify Apps
        data.shopifyApps?.filter(p => p.isFeatured).forEach(p => {
            items.push({ type: 'shopify', data: p });
        });

        // SNS Accounts
        data.snsAccounts?.filter(p => p.isFeatured).forEach(p => {
            items.push({ type: 'sns', data: p });
        });

        // YouTube Videos
        data.youtubeVideos?.filter(v => v.isFeatured).forEach(v => {
            items.push({ type: 'youtube', data: v });
        });

        // Furusato Items
        data.furusatoItems?.filter(item => item.isFeatured).forEach(item => {
            items.push({ type: 'furusato', data: item });
        });

        // Video Production Videos
        data.videoProductionVideos?.filter(v => v.isFeatured).forEach(v => {
            items.push({ type: 'videoProduction', data: v });
        });

        return items;
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">

            <nav className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-stone-200 overflow-x-auto">
                <div className="container mx-auto px-4">
                    <div className="flex justify-start md:justify-center gap-6 min-w-max pb-px">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 text-sm font-bold border-b-2 transition-all duration-300 px-2 ${activeTab === tab.id
                                    ? 'border-accent text-accent'
                                    : 'border-transparent text-subtext hover:text-foreground'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="min-h-[50vh]">
                    {activeTab === 'home' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Featured Intro Text */}
                            {data.settings?.featuredIntro && (
                                <div className="max-w-3xl mx-auto mb-12">
                                    <p className="text-stone-600 whitespace-pre-wrap leading-relaxed text-center">
                                        {data.settings.featuredIntro}
                                    </p>
                                </div>
                            )}

                            <h2 className="text-3xl font-bold mb-8 text-center">Featured Works</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {getFeaturedItems().map((item, index) => {
                                    if (item.type === 'ios') {
                                        return (
                                            <div key={`featured-ios-${index}`} className="h-full">
                                                <AppCard appId={item.data.id} />
                                            </div>
                                        );
                                    }
                                    if (item.type === 'leather') {
                                        return (
                                            <div key={`featured-leather-${index}`} className="h-full">
                                                <ShopifyProductCard handle={item.data.handle} />
                                            </div>
                                        );
                                    }
                                    if (item.type === 'shopify' || item.type === 'sns') {
                                        return (
                                            <div key={`featured-${item.type}-${index}`} className="h-full">
                                                <SimpleCard
                                                    title={item.data.title}
                                                    description={item.data.description}
                                                    url={item.data.url}
                                                    category={item.data.category}
                                                />
                                            </div>
                                        );
                                    }
                                    if (item.type === 'youtube' || item.type === 'videoProduction') {
                                        return (
                                            <div key={`featured-${item.type}-${index}`} className="h-full">
                                                <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-700">
                                                    <YouTubeEmbed url={item.data.url} />
                                                    <div className="p-4">
                                                        <h3 className="font-bold text-lg">{item.data.title}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    if (item.type === 'furusato') {
                                        // データ不整合（titleやimageUrlがない）場合のガード
                                        if (!item.data.title || !item.data.imageUrl) return null;

                                        return (
                                            <div key={`featured-furusato-${index}`} className="h-full">
                                                <FurusatoCard
                                                    title={item.data.title}
                                                    url={item.data.url}
                                                    imageUrl={item.data.imageUrl}
                                                    siteName={item.data.siteName}
                                                />
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            {getFeaturedItems().length === 0 && (
                                <p className="text-center text-stone-500 py-12">
                                    まだピックアップアイテムが設定されていません。
                                </p>
                            )}
                        </div>
                    )}

                    {activeTab === 'leather' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.leatherProducts.map((product, index) => (
                                    <div key={index} className="h-full">
                                        <ShopifyProductCard handle={product.handle} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'ios' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {data.iosApps.map((app) => (
                                    <div key={app.id} className="h-full">
                                        <AppCard appId={app.id} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'shopify' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.shopifyApps.map((product, index) => (
                                    <div key={index} className="h-full">
                                        <SimpleCard
                                            title={product.title}
                                            description={product.description}
                                            url={product.url}
                                            category={product.category}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === '3d-printer' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {data.printImages.map((src, index) => (
                                    <div
                                        key={index}
                                        className="relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => setSelectedImage(src)}
                                    >
                                        <Image
                                            src={src}
                                            alt={`3D Print Work ${index + 1}`}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-subtext mt-8 text-sm">
                                作品の一部を掲載しています。
                            </p>
                        </div>
                    )}

                    {activeTab === 'sns' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.snsAccounts.map((account, index) => (
                                    <div key={index} className="h-full">
                                        <SimpleCard
                                            title={account.title}
                                            description={account.description}
                                            url={account.url}
                                            category={account.category}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'furusato' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.furusatoItems && data.furusatoItems
                                    .filter(item => item.title && item.imageUrl) // データ不整合対策: 必須項目がないアイテムは表示しない
                                    .map((item, index) => (
                                        <div key={index} className="h-full">
                                            <FurusatoCard
                                                title={item.title}
                                                url={item.url}
                                                imageUrl={item.imageUrl}
                                                siteName={item.siteName}
                                            />
                                        </div>
                                    ))}
                            </div>
                            {(!data.furusatoItems || data.furusatoItems.length === 0) && (
                                <p className="text-center text-stone-500 py-12">
                                    現在掲載されている返礼品はありません。
                                </p>
                            )}
                        </div>
                    )}

                    {activeTab === 'youtube' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.youtubeVideos && data.youtubeVideos.map((video) => (
                                    <div key={video.id} className="h-full">
                                        <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-700">
                                            <YouTubeEmbed url={video.url} />
                                            <div className="p-4">
                                                <h3 className="font-bold text-lg">{video.title}</h3>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {(!data.youtubeVideos || data.youtubeVideos.length === 0) && (
                                <p className="text-center text-stone-500 py-12">
                                    まだ動画が登録されていません。
                                </p>
                            )}
                        </div>
                    )}

                    {/* Video Production Tab */}
                    {activeTab === 'videoProduction' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {data.settings?.videoProductionIntro && (
                                <p className="text-center text-stone-600 mb-8 whitespace-pre-wrap leading-relaxed">
                                    {data.settings.videoProductionIntro}
                                </p>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.videoProductionVideos && data.videoProductionVideos.map((video) => (
                                    <div key={video.id} className="h-full">
                                        <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-700">
                                            <YouTubeEmbed url={video.url} />
                                            <div className="p-4">
                                                <h3 className="font-bold text-lg">{video.title}</h3>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {(!data.videoProductionVideos || data.videoProductionVideos.length === 0) && (
                                <p className="text-center text-stone-500 py-12">
                                    まだ動画が登録されていません。
                                </p>
                            )}
                        </div>
                    )}

                    {/* Audio (BGM) Tab */}
                    {activeTab === 'audio' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {data.settings?.audioIntro && (
                                <p className="text-center text-stone-600 mb-8 whitespace-pre-wrap leading-relaxed">
                                    {data.settings.audioIntro}
                                </p>
                            )}
                            <div className="grid grid-cols-1 gap-4">
                                {data.audioTracks && data.audioTracks.map((track) => (
                                    <AudioCard key={track.id} track={track} />
                                ))}
                            </div>
                            {(!data.audioTracks || data.audioTracks.length === 0) && (
                                <p className="text-center text-stone-500 py-12">
                                    まだBGMが登録されていません。
                                </p>
                            )}
                        </div>
                    )}


                </div>
            </main >

            <Footer />

            {/* Image Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-gray-300 transition-colors z-10"
                        onClick={() => setSelectedImage(null)}
                        aria-label="閉じる"
                    >
                        ×
                    </button>
                    <div className="relative max-w-7xl max-h-screen w-full h-full flex items-center justify-center">
                        <Image
                            src={selectedImage}
                            alt="拡大画像"
                            fill
                            className="object-contain"
                            sizes="100vw"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div >
    );
}
