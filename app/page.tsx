'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppCard from '@/components/AppCard';
import SimpleCard from '@/components/SimpleCard';
import Image from 'next/image';

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

const snsAccounts = [
  {
    title: 'Instagram',
    description: '日々の制作風景や、最新の作品情報を写真でお届けしています。',
    url: 'https://www.instagram.com/1pei_okinawa',
    category: 'SNS',
  },
  {
    title: 'X (Twitter)',
    description: 'アプリ開発の進捗や技術的なつぶやき、最新のお知らせを発信中。',
    url: 'https://x.com/DevCat123',
    category: 'SNS',
  }
];

const printImages = [
  '/3d-print/sample1.png',
  '/3d-print/sample2.png',
  '/3d-print/sample3.png',
];

type TabType = 'leather' | 'ios' | 'shopify' | 'sns' | '3d-printer';

export default function Home() {
  // デフォルトは革製品
  const [activeTab, setActiveTab] = useState<TabType>('leather');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'leather', label: '革製品' },
    { id: 'ios', label: 'iOSアプリ' },
    { id: 'shopify', label: 'Shopifyアプリ' },
    { id: '3d-printer', label: '3Dプリンタ' },
    { id: 'sns', label: 'SNS' },
  ];

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

          {activeTab === '3d-printer' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {printImages.map((src, index) => (
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
                {snsAccounts.map((account, index) => (
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
