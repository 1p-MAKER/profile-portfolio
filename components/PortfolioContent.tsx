'use client';

import { useState, useRef, useEffect } from 'react';
import Footer from '@/components/Footer';
import AppCard from '@/components/AppCard';
import SimpleCard from './SimpleCard';
import SNSCard from '@/components/SNSCard';
import FurusatoCard from '@/components/FurusatoCard';
import YouTubeEmbed from './YouTubeEmbed';
import ShopifyProductCard from '@/components/ShopifyProductCard';
import AudioCard from '@/components/AudioCard';
import NoteCard from '@/components/NoteCard';
import AiToolCard from '@/components/AiToolCard';
import SketchMarkTab from '@/components/SketchMarkTab';
import TikTokEmbed from '@/components/TikTokEmbed';
import InstagramEmbed from '@/components/InstagramEmbed';
import Image from 'next/image';
import { ContentData, FeaturedItem } from '@/types/content';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrag } from '@use-gesture/react';

type TabType = string;

import HeroSection from './HeroSection';

const StripeBuyButton = 'stripe-buy-button' as any;

export default function PortfolioContent({ data }: { data: ContentData }) {
    console.log('Portfolio Content Data:', {
        settings: data.settings,
        brainItems: data.brainItems,
        brainIntro: data.settings?.brainIntro
    });
    const initialTab = data.tabs && data.tabs.length > 0 ? data.tabs[0].id : 'leather';
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);
    const [direction, setDirection] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const lastSwipeTime = useRef(0);

    // Image Lightbox Modal State
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const tabs = data.tabs || [];

    // Inject Sketch Mark tab if not present (system override)
    const normalizedTabs = [...tabs];
    if (!normalizedTabs.find(t => t.id === 'sketchMark')) {
        normalizedTabs.push({ id: 'sketchMark', label: 'Sketch Mark' });
    }

    // Find current tab index for swipe logic
    const tabIndex = tabs.findIndex(t => t.id === activeTab);

    const paginate = (newDirection: number) => {
        const now = Date.now();
        // Debounce: Lock if animating or within 500ms of last swipe
        if (isAnimating || now - lastSwipeTime.current < 500) return;

        lastSwipeTime.current = now;
        setIsAnimating(true);

        const safeDirection = newDirection > 0 ? 1 : -1; // Force 1 or -1
        const newIndex = (tabIndex + safeDirection + tabs.length) % tabs.length;
        setDirection(safeDirection);
        setActiveTab(tabs[newIndex].id);
        // Scroll to top when changing tabs via swipe/click
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Swipe handler
    const bind = useDrag(({ swipe: [swipeX], cancel, active }) => {
        // swipe logic: swipeX is 1 for right, -1 for left
        if (swipeX === -1) {
            cancel();
            paginate(1); // Next tab (Left swipe)
        } else if (swipeX === 1) {
            cancel();
            paginate(-1); // Prev tab (Right swipe)
        }
    }, {
        axis: 'x',
        filterTaps: true,
        threshold: 80, // Increased sensitivity threshold
        swipe: {
            duration: 2000,
            distance: 50,
            velocity: 0.3
        }
    });


    // Animation variants
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0
        })
    };

    // Featured items collection
    const getFeaturedItems = () => {
        const items: FeaturedItem[] = [];

        // iOS Apps
        data.iosApps?.filter(app => app.isFeatured).forEach(app => {
            items.push({ type: 'ios', data: app, id: app.id });
        });

        // Leather Products
        data.leatherProducts?.filter(p => p.isFeatured && p.handle).forEach(p => {
            items.push({ type: 'leather', data: p, id: p.handle });
        });

        // Shopify Apps
        data.shopifyApps?.filter(p => p.isFeatured).forEach(p => {
            items.push({ type: 'shopify', data: p, id: p.url });
        });

        // SNS Accounts
        data.snsAccounts?.filter(p => p.isFeatured).forEach(p => {
            items.push({ type: 'sns', data: p, id: p.url });
        });

        // YouTube Videos
        data.youtubeVideos?.filter(v => v.isFeatured).forEach(v => {
            items.push({ type: 'youtube', data: v, id: v.id });
        });

        // Furusato Items
        data.furusatoItems?.filter(item => item.isFeatured).forEach(item => {
            items.push({ type: 'furusato', data: item, id: item.url });
        });

        // Video Production Videos
        data.videoProductionVideos?.filter(v => v.isFeatured).forEach(v => {
            items.push({ type: 'videoProduction', data: v, id: v.id });
        });

        // Note Items
        data.noteItems?.filter(item => item.isFeatured).forEach(item => {
            items.push({ type: 'note', data: item, id: item.url });
        });

        // Audio Tracks
        data.audioTracks?.filter(item => item.isFeatured).forEach(item => {
            items.push({ type: 'audio', data: item, id: item.id });
        });

        // Sketch Mark Items
        data.sketchMarkItems?.forEach(item => {
            items.push({ type: 'sketchMark', data: item, id: item.id.toString() });
        });

        // TikTok Items
        data.tiktokItems?.filter(item => item.isFeatured).forEach(item => {
            items.push({ type: 'tiktok', data: item, id: item.id });
        });

        const order = data.settings?.featuredOrder || [];
        if (order.length > 0) {
            items.sort((a, b) => {
                const idA = a.id || '';
                const idB = b.id || '';
                const indexA = order.indexOf(idA);
                const indexB = order.indexOf(idB);

                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
                return 0;
            });
        }

        return items;
    };

    // Render Content Logic moved to a function for clarity inside AnimatePresence
    const renderTabContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div className="space-y-8">
                        <HeroSection
                            profileName={data.settings?.profileName}
                            profileTagline={data.settings?.profileTagline}
                            featuredIntro={data.settings?.featuredIntro}
                        />

                        <h2 className="text-3xl font-bold mb-8 text-center">Featured Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {getFeaturedItems().map((item, index) => {
                                if (item.type === 'ios') return <div key={`f-ios-${index}`} className="h-full"><AppCard appId={item.data.id} /></div>;
                                if (item.type === 'leather') return <div key={`f-leather-${index}`} className="h-full"><ShopifyProductCard handle={item.data.handle} /></div>;
                                if (item.type === 'shopify' || item.type === 'sns') return <div key={`f-${item.type}-${index}`} className="h-full"><SimpleCard title={item.data.title} description={item.data.description} url={item.data.url} category={item.data.category} /></div>;
                                if (item.type === 'youtube' || item.type === 'videoProduction') return <div key={`f-yt-${index}`} className="h-full"><div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-700"><YouTubeEmbed url={item.data.url} /><div className="p-4"><h3 className="font-bold text-lg">{item.data.title}</h3></div></div></div>;
                                if (item.type === 'furusato') {
                                    if (!item.data.title || !item.data.imageUrl) return null;
                                    return <div key={`f-furu-${index}`} className="h-full"><FurusatoCard title={item.data.title} url={item.data.url} imageUrl={item.data.imageUrl} siteName={item.data.siteName} /></div>;
                                }
                                if (item.type === 'note') {
                                    return <div key={`f-note-${index}`} className="h-full"><NoteCard title={item.data.title} url={item.data.url} imageUrl={item.data.imageUrl} siteName={item.data.siteName} /></div>;
                                }
                                if (item.type === 'audio') {
                                    return <div key={`f-audio-${index}`} className="h-full"><AudioCard track={item.data} /></div>;
                                }
                                if (item.type === 'sketchMark') {
                                    return (
                                        <div key={`f-sm-${index}`} className="h-full">
                                            <a
                                                href={item.data.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group block h-full bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-stone-200 dark:border-stone-700"
                                            >
                                                <div className="relative aspect-square overflow-hidden bg-stone-100">
                                                    {item.data.imageUrl ? (
                                                        <Image
                                                            src={item.data.imageUrl}
                                                            alt={item.data.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-stone-300">No Image</div>
                                                    )}
                                                    <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded shadow-sm text-white ${item.data.type === 'base' ? 'bg-stone-800' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}>
                                                        {item.data.type === 'base' ? 'BASE' : 'Instagram'}
                                                    </span>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-stone-900 dark:text-stone-100 line-clamp-2 mb-2">
                                                        {item.data.title}
                                                    </h3>
                                                    <div className="flex justify-between items-center mt-2 text-sm">
                                                        {item.data.price ? (
                                                            <span className="font-medium text-stone-600 dark:text-stone-400">¥{item.data.price.toLocaleString()}</span>
                                                        ) : <span></span>}
                                                        <span className="text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200 transition-colors">View →</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    );
                                }
                                if (item.type === 'tiktok') {
                                    return (
                                        <div key={`f-tiktok-${index}`} className="h-full">
                                            <a
                                                href={item.data.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group block h-full bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-stone-200 dark:border-stone-700"
                                            >
                                                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-cyan-400 via-pink-500 to-black">
                                                    {item.data.thumbnailUrl ? (
                                                        <Image
                                                            src={item.data.thumbnailUrl}
                                                            alt={item.data.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-white text-4xl">
                                                            <span>🎵</span>
                                                        </div>
                                                    )}
                                                    <span className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded shadow-sm text-white bg-black">
                                                        チャレンジ
                                                    </span>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-stone-900 dark:text-stone-100 line-clamp-2 mb-2">
                                                        {item.data.title}
                                                    </h3>
                                                    <span className="text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200 transition-colors text-sm">View →</span>
                                                </div>
                                            </a>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                        {getFeaturedItems().length === 0 && (
                            <p className="text-center text-stone-500 py-12">まだピックアップアイテムが設定されていません。</p>
                        )}
                    </div>
                );
            case 'leather':
                return (
                    <>
                        {data.settings?.leatherIntro && <p className="text-center text-stone-600 mb-8 whitespace-pre-wrap leading-relaxed">{data.settings.leatherIntro}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.leatherProducts.filter(product => product.handle).map((product, index) => (
                                <div key={index} className="h-full"><ShopifyProductCard handle={product.handle} /></div>
                            ))}
                        </div>
                    </>
                );
            case 'ios':
                return (
                    <>
                        {data.settings?.iosIntro && <p className="text-center text-stone-600 mb-8 whitespace-pre-wrap leading-relaxed">{data.settings.iosIntro}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {data.iosApps.map((app) => (
                                <div key={app.id} className="h-full"><AppCard appId={app.id} /></div>
                            ))}
                        </div>
                    </>
                );
            case 'ai-tools':
                return (
                    <>
                        {data.settings?.aiToolIntro && <p className="text-center text-stone-600 mb-8 whitespace-pre-wrap leading-relaxed">{data.settings.aiToolIntro}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.aiToolItems && data.aiToolItems.map((item, index) => (
                                <div key={index} className="h-full">
                                    <AiToolCard
                                        title={item.title}
                                        description={item.description}
                                        url={item.url}
                                        imageUrl={item.imageUrl}
                                        onImageClick={() => setSelectedImage(item.imageUrl || null)}
                                    />
                                </div>
                            ))}
                        </div>
                        {(!data.aiToolItems || data.aiToolItems.length === 0) && <p className="text-center text-stone-500 py-12">まだAIツールが登録されていません。</p>}
                    </>
                );
            case 'shopify':
                return (
                    <>
                        {data.settings?.shopifyIntro && <p className="text-center text-stone-600 mb-8 whitespace-pre-wrap leading-relaxed">{data.settings.shopifyIntro}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.shopifyApps.map((product, index) => (
                                <div key={index} className="h-full"><SimpleCard title={product.title} description={product.description} url={product.url} category={product.category} /></div>
                            ))}
                        </div>
                    </>
                );
            case '3d-printer':
                return (
                    <>
                        {data.settings?.printer3dIntro && <p className="text-center text-stone-600 mb-8 whitespace-pre-wrap leading-relaxed">{data.settings.printer3dIntro}</p>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {data.printImages.map((src, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedImage(src)}>
                                    <Image src={src} alt={`3D Print Work ${index + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-subtext mt-8 text-sm">作品の一部を掲載しています。</p>
                    </>
                );
            case 'sns':
                return (
                    <>
                        {data.settings?.snsIntro && <p className="text-center text-stone-600 mb-8 whitespace-pre-wrap leading-relaxed">{data.settings.snsIntro}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.snsAccounts.map((account, index) => <SNSCard key={index} account={account} />)}
                        </div>
                    </>
                );
            case 'furusato':
                return (
                    <>
                        {data.settings?.furusatoIntro && <p className="text-center text-stone-600 mb-8 whitespace-pre-wrap leading-relaxed">{data.settings.furusatoIntro}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.furusatoItems && data.furusatoItems.filter(item => item.title && item.imageUrl).map((item, index) => (
                                <div key={index} className="h-full"><FurusatoCard title={item.title} url={item.url} imageUrl={item.imageUrl} siteName={item.siteName} /></div>
                            ))}
                        </div>
                        {(!data.furusatoItems || data.furusatoItems.length === 0) && <p className="text-center text-stone-500 py-12">現在掲載されている返礼品はありません。</p>}
                    </>
                );
            case 'youtube':
                return (
                    <>
                        {data.settings?.youtubeIntro && <p className="text-center text-stone-600 mb-8 whitespace-pre-wrap leading-relaxed">{data.settings.youtubeIntro}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.youtubeVideos && data.youtubeVideos.map((video) => (
                                <div key={video.id} className="h-full"><div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-700"><YouTubeEmbed url={video.url} /><div className="p-4"><h3 className="font-bold text-lg">{video.title}</h3></div></div></div>
                            ))}
                        </div>
                        {(!data.youtubeVideos || data.youtubeVideos.length === 0) && <p className="text-center text-stone-500 py-12">まだ動画が登録されていません。</p>}
                    </>
                );
            case 'videoProduction':
                return (
                    <>
                        {data.settings?.videoProductionIntro && <p className="text-center text-stone-600 mb-8 whitespace-pre-wrap leading-relaxed">{data.settings.videoProductionIntro}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.videoProductionVideos && data.videoProductionVideos.map((video) => (
                                <div key={video.id} className="h-full"><div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-700"><YouTubeEmbed url={video.url} /><div className="p-4"><h3 className="font-bold text-lg">{video.title}</h3></div></div></div>
                            ))}
                        </div>
                        {(!data.videoProductionVideos || data.videoProductionVideos.length === 0) && <p className="text-center text-stone-500 py-12">まだ動画が登録されていません。</p>}
                    </>
                );
            case 'audio':
                return (
                    <>
                        {data.settings?.audioIntro && <p className="text-center text-stone-600 mb-8 whitespace-pre-wrap leading-relaxed">{data.settings.audioIntro}</p>}
                        <div className="grid grid-cols-1 gap-4">
                            {data.audioTracks && data.audioTracks.map((track) => <AudioCard key={track.id} track={track} />)}
                        </div>
                        {(!data.audioTracks || data.audioTracks.length === 0) && <p className="text-center text-stone-500 py-12">まだBGMが登録されていません。</p>}

                        {/* Suno BGM Section */}
                        {data.settings?.sunoBgmUrl && (
                            <div className="mt-16 border-t border-stone-200 pt-8 text-center">
                                <h3 className="text-2xl font-bold mb-4 text-stone-800 dark:text-stone-200">Suno 作業用BGM</h3>
                                <p className="text-stone-600 dark:text-stone-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                                    Sunoを使い自分好みの音楽を生成し DaVinci Resolveで曲を繋げました
                                </p>
                                <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-stone-200 dark:border-stone-700 bg-black">
                                    <YouTubeEmbed url={data.settings.sunoBgmUrl} />
                                </div>
                            </div>
                        )}
                    </>
                );
            case 'note':
                return (
                    <>
                        {data.settings?.noteIntro && <p className="text-center text-stone-600 mb-8 whitespace-pre-wrap leading-relaxed">{data.settings.noteIntro}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.noteItems && data.noteItems.map((item, index) => (
                                <div key={index} className="h-full"><NoteCard title={item.title} url={item.url} imageUrl={item.imageUrl} siteName={item.siteName} /></div>
                            ))}
                        </div>
                        {(!data.noteItems || data.noteItems.length === 0) && <p className="text-center text-stone-500 py-12">まだ記事が登録されていません。</p>}

                        {/* Brain Section */}
                        <div className="my-16 border-t border-stone-200" />

                        {data.settings?.brainIntro && <p className="text-center text-stone-600 mb-8 whitespace-pre-wrap leading-relaxed">{data.settings.brainIntro}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.brainItems && data.brainItems.map((item, index) => (
                                <div key={index} className="h-full"><NoteCard title={item.title} url={item.url} siteName={item.siteName || 'Brain'} /></div>
                            ))}
                        </div>
                        {(!data.brainItems || data.brainItems.length === 0) && <p className="text-center text-stone-500 py-12">まだBrain記事が登録されていません。</p>}
                    </>
                );
            case 'sketchMark':
                return <SketchMarkTab />;
            case 'tiktok':
                return (
                    <>
                        {data.settings?.tiktokIntro && <p className="text-center text-stone-600 mb-8 whitespace-pre-wrap leading-relaxed">{data.settings.tiktokIntro}</p>}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {data.tiktokItems && data.tiktokItems.map((item) => (
                                <div key={item.id} className="space-y-2">
                                    {item.platform === 'instagram' ? (
                                        <InstagramEmbed url={item.url} />
                                    ) : (
                                        <TikTokEmbed url={item.url} />
                                    )}
                                    <div className="flex items-center gap-1">
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${item.platform === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-black'}`}>
                                            {item.platform === 'instagram' ? 'IG' : 'チャレンジ'}
                                        </span>
                                        <h3 className="text-xs font-bold text-stone-700 line-clamp-2">{item.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {(!data.tiktokItems || data.tiktokItems.length === 0) && <p className="text-center text-stone-500 py-12">まだ投稿が登録されていません。</p>}
                    </>
                );
            case 'office':
                return (
                    <>
                        {data.settings?.officeIntro && <p className="text-center text-stone-600 mb-8 whitespace-pre-wrap leading-relaxed">{data.settings.officeIntro}</p>}
                        <div className="flex flex-wrap justify-center gap-6">
                            {data.officeItems && data.officeItems.map((item, index) => (
                                <div key={index} className="w-full md:w-[350px] bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-700 p-6 flex flex-col">
                                    {item.imageUrl && (
                                        <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-stone-100">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold mb-2 text-stone-900 dark:text-stone-100 text-center">{item.title || '無題のメニュー'}</h3>
                                    {item.description && <p className="text-sm text-stone-600 dark:text-stone-400 mb-6 flex-grow whitespace-pre-wrap">{item.description}</p>}

                                    <div className="mt-auto">
                                        {item.consultationUrl ? (
                                            <a
                                                href={item.consultationUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full text-center bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                                            >
                                                相談をリクエストする ↗
                                            </a>
                                        ) : (
                                            <div className="text-center text-xs text-stone-400 py-2 border border-dashed border-stone-300 rounded-xl">
                                                (相談URLが未設定です)
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {(!data.officeItems || data.officeItems.length === 0) && <p className="text-center text-stone-500 py-12">現在販売中の商品はありません。</p>}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <nav className="sticky top-12 z-40 bg-background/95 backdrop-blur-sm border-b border-stone-200 overflow-x-auto no-scrollbar">
                <div className="container mx-auto px-2">
                    <div className="flex justify-start md:justify-center gap-2 md:gap-6 min-w-max pb-px">
                        {normalizedTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    const newIndex = normalizedTabs.findIndex(t => t.id === tab.id);
                                    setDirection(newIndex > tabIndex ? 1 : -1);
                                    setActiveTab(tab.id);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`py-2 md:py-2 text-xs md:text-sm font-bold border-b-2 transition-all duration-300 px-3 md:px-4 ${activeTab === tab.id
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

            <main className="flex-grow container mx-auto px-4 py-8 overflow-hidden touch-pan-y min-h-screen" {...bind()}>
                <div className="min-h-[50vh]">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={activeTab}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 400, damping: 35 },
                                opacity: { duration: 0.15 }
                            }}
                            onAnimationComplete={() => setIsAnimating(false)}
                            className="w-full"
                        >
                            {renderTabContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>



            {/* Helper Script for Stripe */}
            <script async src="https://js.stripe.com/v3/buy-button.js"></script>

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
        </>
    );
}
