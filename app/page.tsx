'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppCard from '@/components/AppCard';
import SimpleCard from '@/components/SimpleCard';

const iosAppIds = [
  '6757658561', // 電卓 履歴が見える計算機
  '6757254650', // ShatterRush
  '6757659840', // 水習慣プラネット
  '6757323152', // 韻Finder
  '6757323158', // らくがきパレット
  '6757378881', // 数字当てゲーム ヒットアンドブロー
  '6757212814', // PocketJam
  '6756815912', // Sake AI
  '6756455336', // Muscle Memo Counter
  '6756898858', // Numbest
  '6756509171', // Bingo Party
  '6757683057', // 昼寝専用タイマー
];

const leatherProducts = [
  {
    title: '自然のしるし',
    description: '「自然と共に生きる」をテーマにした革製品ブランド。厳選された素材と手仕事による温もりをお届けします。',
    url: 'https://shizennoshirushi.com/',
    category: 'Leather Craft',
  },
];

const shopifyApps = [
  {
    title: 'Coming Soon',
    description: 'Shopifyアプリは現在開発中です。公開までしばらくお待ちください。',
    url: '#',
    category: 'Shopify App',
  }
];

type TabType = 'leather' | 'ios' | 'shopify';

export default function Home() {
  // デフォルトは革製品
  const [activeTab, setActiveTab] = useState<TabType>('leather');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'leather', label: '革製品' },
    { id: 'ios', label: 'iOSアプリ' },
    { id: 'shopify', label: 'Shopifyアプリ' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <nav className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-stone-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-bold border-b-2 transition-all duration-300 ${activeTab === tab.id
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
                {leatherProducts.map((product, index) => (
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
                {iosAppIds.map((id) => (
                  <div key={id} className="h-full">
                    <AppCard appId={id} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shopify' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shopifyApps.map((product, index) => (
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
