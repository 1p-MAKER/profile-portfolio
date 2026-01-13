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

const otherProducts = [
  {
    title: '自然のしるし',
    description: '「自然と共に生きる」をテーマにした革製品ブランド。厳選された素材と手仕事による温もりをお届けします。',
    url: 'https://shizennoshirushi.com/',
    category: 'Leather Craft',
  },
  // Shopifyアプリの情報は後ほど追加
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-foreground">iOS Apps</h2>
            <div className="h-px bg-stone-200 flex-grow"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {iosAppIds.map((id) => (
              <div key={id} className="h-full">
                <AppCard appId={id} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-foreground">Other Products</h2>
            <div className="h-px bg-stone-200 flex-grow"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProducts.map((product, index) => (
              <div key={index} className="h-full">
                <SimpleCard
                  title={product.title}
                  description={product.description}
                  url={product.url}
                  category={product.category}
                />
              </div>
            ))}
            {/* Shopifyアプリ等のプレースホルダーが必要ならここに追加 */}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
