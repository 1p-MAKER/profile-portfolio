import Link from 'next/link';
import Footer from '@/components/Footer';

export default function ContactPage() {
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
                <h1 className="text-2xl md:text-3xl font-bold mb-8 text-stone-900">お問い合わせ</h1>

                <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-stone-100 space-y-8">
                    <section>
                        <p className="text-stone-600 leading-relaxed mb-6">
                            アプリに関するご質問、不具合のご報告、その他お問い合わせは、以下のSNSのダイレクトメッセージ（DM）、またはメールにてご連絡ください。
                        </p>
                    </section>

                    <section className="grid md:grid-cols-2 gap-4">
                        <a
                            href="https://x.com/DevCat123"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-4 rounded-xl border border-stone-200 hover:border-stone-800 hover:bg-stone-50 transition-all group"
                        >
                            <div className="text-2xl mr-3 group-hover:scale-110 transition-transform">𝕏</div>
                            <div>
                                <div className="font-bold text-stone-900">X (Twitter)</div>
                                <div className="text-xs text-stone-500">@DevCat123</div>
                            </div>
                        </a>

                        <a
                            href="https://www.instagram.com/1pei_okinawa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-4 rounded-xl border border-stone-200 hover:border-pink-500 hover:bg-pink-50 transition-all group"
                        >
                            <div className="text-2xl mr-3 group-hover:scale-110 transition-transform">📷</div>
                            <div>
                                <div className="font-bold text-stone-900">Instagram</div>
                                <div className="text-xs text-stone-500">@1pei_okinawa</div>
                            </div>
                        </a>
                    </section>

                    <section className="pt-8 border-t border-stone-100">
                        <h3 className="font-bold text-stone-800 mb-2">メールでのお問い合わせ</h3>
                        <p className="text-stone-600 text-sm mb-4">
                            メールでのご連絡をご希望の場合は、以下のアドレスまでお願い致します。<br />
                            ※ 返信にお時間をいただく場合がございます。
                        </p>
                        <div className="bg-stone-100 p-3 rounded-lg text-stone-700 font-mono text-sm inline-block select-all">
                            okinawa.c.factory@gmail.com
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
