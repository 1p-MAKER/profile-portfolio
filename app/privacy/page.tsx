import Link from 'next/link';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
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
                <h1 className="text-2xl md:text-3xl font-bold mb-8 text-stone-900">プライバシーポリシー</h1>

                <div className="prose prose-stone max-w-none space-y-8 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-stone-100">
                    <section>
                        <h2 className="text-xl font-bold mb-4 text-stone-800 border-b pb-2">1. はじめに</h2>
                        <p className="text-stone-600 leading-relaxed">
                            当方が提供するアプリ（以下「本アプリ」）における、ユーザー情報の取り扱いについて、以下の通りプライバシーポリシー（以下「本ポリシー」）を定めます。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-stone-800 border-b pb-2">2. 収集する情報とその利用目的</h2>
                        <p className="text-stone-600 leading-relaxed mb-4">
                            本アプリでは、品質向上および広告配信のために、以下の第三者サービスを利用してユーザー情報を収集する場合があります。
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-stone-700">Google AdMob</h3>
                                <p className="text-stone-600 text-sm">
                                    広告配信のために広告IDを取得する場合があります。<br />
                                    詳細は <a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Googleの広告ポリシー</a> をご確認ください。
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-stone-700">Google Firebase / Google Analytics</h3>
                                <p className="text-stone-600 text-sm">
                                    アプリの利用状況（クラッシュログ、利用頻度など）を解析し、サービスの改善に役立てるために利用します。
                                    これらのデータは匿名で収集され、個人を特定するものではありません。
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-stone-800 border-b pb-2">3. 個人情報の管理</h2>
                        <p className="text-stone-600 leading-relaxed">
                            本アプリは、お問い合わせ等を通じてユーザーから提供される個人情報（メールアドレス等）について、法令に基づき適切に管理し、ユーザーの同意なく第三者に提供することはありません。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-stone-800 border-b pb-2">4. 免責事項</h2>
                        <p className="text-stone-600 leading-relaxed">
                            本アプリの利用により生じた、いかなる損害についても、当方は一切の責任を負いません。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-stone-800 border-b pb-2">5. 本ポリシーの変更</h2>
                        <p className="text-stone-600 leading-relaxed">
                            当方は、必要に応じて本ポリシーを変更する場合があります。重要な変更がある場合は、本サイトまたはアプリ内にて通知します。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-stone-800 border-b pb-2">6. お問い合わせ</h2>
                        <p className="text-stone-600 leading-relaxed">
                            本ポリシーやアプリに関するお問い合わせは、以下のお問い合わせページよりお願いいたします。
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
