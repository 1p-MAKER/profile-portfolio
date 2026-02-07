import Link from 'next/link';
import Footer from '@/components/Footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <header className="bg-white border-b border-stone-200">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold text-stone-900">
                        Dev cat&apos;s Portfolio
                    </Link>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-3xl">
                <h1 className="text-2xl md:text-3xl font-bold mb-8 text-stone-900">利用規約（Terms of Service）</h1>

                <div className="prose prose-stone max-w-none space-y-8 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-stone-100">
                    <section>
                        <h2 className="text-xl font-bold mb-4 text-stone-800 border-b pb-2">1. はじめに</h2>
                        <p className="text-stone-600 leading-relaxed">
                            本利用規約（以下「本規約」）は、当方（以下「運営者」）が提供するアプリケーションおよびサービス（以下「本サービス」）の利用条件を定めるものです。
                            ユーザーは本サービスを利用することにより、本規約に同意したものとみなされます。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-stone-800 border-b pb-2">2. サービスの内容</h2>
                        <p className="text-stone-600 leading-relaxed">
                            本サービスは、ユーザーが複数のソーシャルメディアプラットフォーム（TikTok、YouTube、Instagram、Threadsなど）に動画コンテンツを投稿するための機能を提供します。
                            運営者は、事前の通知なくサービス内容を変更、追加、または廃止する場合があります。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-stone-800 border-b pb-2">3. アカウントと認証</h2>
                        <p className="text-stone-600 leading-relaxed mb-4">
                            本サービスを利用するには、各ソーシャルメディアプラットフォームのアカウント認証が必要です。
                        </p>
                        <ul className="list-disc list-inside text-stone-600 space-y-2">
                            <li>ユーザーは自身のアカウント情報の管理に責任を持つものとします</li>
                            <li>第三者へのアカウント貸与・譲渡は禁止されています</li>
                            <li>認証情報の漏洩による損害について、運営者は責任を負いません</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-stone-800 border-b pb-2">4. 禁止事項</h2>
                        <p className="text-stone-600 leading-relaxed mb-4">
                            ユーザーは以下の行為を行ってはなりません：
                        </p>
                        <ul className="list-disc list-inside text-stone-600 space-y-2">
                            <li>法令または公序良俗に違反するコンテンツの投稿</li>
                            <li>第三者の権利（著作権、商標権、肖像権など）を侵害するコンテンツの投稿</li>
                            <li>各プラットフォームの利用規約に違反する行為</li>
                            <li>本サービスの運営を妨害する行為</li>
                            <li>不正アクセスやシステムへの攻撃</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-stone-800 border-b pb-2">5. 免責事項</h2>
                        <p className="text-stone-600 leading-relaxed">
                            本サービスは「現状のまま」で提供され、運営者は以下について一切の責任を負いません：
                        </p>
                        <ul className="list-disc list-inside text-stone-600 space-y-2 mt-4">
                            <li>本サービスの利用により生じた直接的または間接的な損害</li>
                            <li>各プラットフォームの仕様変更・障害によるサービス停止</li>
                            <li>投稿したコンテンツの削除やアカウント停止</li>
                            <li>第三者による不正アクセスや情報漏洩</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-stone-800 border-b pb-2">6. 知的財産権</h2>
                        <p className="text-stone-600 leading-relaxed">
                            本サービスに関する知的財産権は運営者に帰属します。
                            ユーザーが投稿するコンテンツの著作権はユーザー自身に帰属しますが、本サービスの運営に必要な範囲で使用を許諾するものとします。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-stone-800 border-b pb-2">7. 規約の変更</h2>
                        <p className="text-stone-600 leading-relaxed">
                            運営者は、必要に応じて本規約を変更する場合があります。重要な変更がある場合は、本サイトまたはサービス内にて通知します。
                            変更後も本サービスを継続して利用する場合、変更後の規約に同意したものとみなします。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-stone-800 border-b pb-2">8. 準拠法・管轄</h2>
                        <p className="text-stone-600 leading-relaxed">
                            本規約は日本法に準拠し、本サービスに関する紛争については、運営者の所在地を管轄する裁判所を専属的合意管轄とします。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-stone-800 border-b pb-2">9. お問い合わせ</h2>
                        <p className="text-stone-600 leading-relaxed">
                            本規約やサービスに関するお問い合わせは、以下のお問い合わせページよりお願いいたします。
                        </p>
                        <div className="mt-4">
                            <Link href="/contact" className="text-blue-600 font-bold hover:underline">
                                お問い合わせページへ
                            </Link>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
