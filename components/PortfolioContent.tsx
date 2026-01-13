'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppCard from '@/components/AppCard';
import SimpleCard from '@/components/SimpleCard';
import FurusatoCard from '@/components/FurusatoCard';
import Image from 'next/image';
import { ContentData } from '@/types/content';

// TabType is now derived from the data structure loosely, or kept as a union for safety
// For simplicity in this refactor, we accept string as activeTab to match dynamic data
type TabType = string;

export default function PortfolioContent({ data }: { data: ContentData }) {
    // データがない場合のフォールバック（初回ロード時など）
    const initialTab = data.tabs && data.tabs.length > 0 ? data.tabs[0].id : 'leather';
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);

    // Use tabs from data
    const tabs = data.tabs || [];

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Header />

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
                    {activeTab === 'leather' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.leatherProducts.map((product, index) => (
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
                                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
                                {data.furusatoItems && data.furusatoItems.map((item, index) => (
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
                </div>
            </main >

            <Footer />
        </div >
    );
}
