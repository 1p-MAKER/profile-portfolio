import Link from 'next/link';

export default function Legal() {
    return (
        <main className="min-h-screen bg-white text-stone-800 p-8 md:p-24 font-sans leading-relaxed">
            <div className="max-w-2xl mx-auto">
                <Link href="/" className="text-stone-400 hover:text-stone-900 transition-colors mb-12 inline-block text-sm border-b border-transparent hover:border-stone-200">
                    ← Back to Home
                </Link>

                <h1 className="text-2xl font-bold mb-12 border-b pb-4">特定商取引法に基づく表記</h1>

                <div className="space-y-10 text-sm">
                    <section>
                        <h2 className="font-bold text-stone-500 mb-2 uppercase tracking-widest text-xs">販売業者 / 事業者名</h2>
                        <p className="text-base">長嶺一平 (Dev cat&apos;s Studio & Office)</p>
                    </section>

                    <section>
                        <h2 className="font-bold text-stone-500 mb-2 uppercase tracking-widest text-xs">所在地</h2>
                        <p className="text-base font-serif">〒000-0000 沖縄県[以下、住所を記入]</p>
                        <p className="text-stone-400 text-xs mt-1">※所在地および電話番号については、請求があれば遅滞なく電子メールにて提供いたします。</p>
                    </section>

                    <section>
                        <h2 className="font-bold text-stone-500 mb-2 uppercase tracking-widest text-xs">お問い合わせ先</h2>
                        <p className="text-base font-mono">[メールアドレスを記入]</p>
                    </section>

                    <section>
                        <h2 className="font-bold text-stone-500 mb-2 uppercase tracking-widest text-xs">販売価格</h2>
                        <p className="text-base">各サービス・商品ページに記載の金額（消費税込み）</p>
                    </section>

                    <section>
                        <h2 className="font-bold text-stone-500 mb-2 uppercase tracking-widest text-xs">商品代金以外に必要な料金</h2>
                        <ul className="list-disc list-inside text-base">
                            <li>物販：配送料（詳細は各商品ページに記載）</li>
                            <li>サービス：対面時の各自の飲食代、オンラインの通信料</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-bold text-stone-500 mb-2 uppercase tracking-widest text-xs">代金の支払時期および支払方法</h2>
                        <p className="text-base">
                            支払方法：クレジットカード決済（Stripe）<br />
                            支払時期：商品注文時、または予約確定時の事前決済
                        </p>
                    </section>

                    <section>
                        <h2 className="font-bold text-stone-500 mb-2 uppercase tracking-widest text-xs">商品の引き渡し・サービス提供時期</h2>
                        <div className="text-base space-y-2">
                            <p><strong>【物販】</strong><br />事前のご相談、またはお見積もり時に合意した発送目安に基づき、順次発送いたします。</p>
                            <p><strong>【サービス】</strong><br />予約確定時に合意した日時</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="font-bold text-stone-500 mb-2 uppercase tracking-widest text-xs">返品・交換・キャンセルについて</h2>
                        <div className="text-base space-y-2">
                            <p><strong>【物販】</strong><br />商品に欠陥がある場合を除き、返品・交換には応じられません。万が一不良品であった場合は商品到着後7日以内にご連絡ください。送料当方負担にて修理または交換対応いたします。</p>
                            <p><strong>【サービス】</strong><br />役務の性質上、提供後の返金には応じられません。日程変更は前日まで受け付けます。それ以降はキャンセル料が発生する場合がございます。</p>
                        </div>
                    </section>
                </div>

                <footer className="mt-24 pt-8 border-t border-stone-100 text-stone-400 text-[10px]">
                    &copy; {new Date().getFullYear()} Dev cat&apos;s Studio & Office
                </footer>
            </div>
        </main>
    );
}
