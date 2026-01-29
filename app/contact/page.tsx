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
                            アプリに関するご質問、不具合のご報告、その他お問い合わせは、以下の公式LINEよりご連絡ください。
                        </p>
                    </section>

                    <section className="flex justify-center">
                        <a
                            href="https://line.me/R/ti/p/@545ficux"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-6 rounded-xl border-2 border-[#06C755] hover:bg-[#06C755] hover:text-white transition-all group w-full max-w-md"
                        >
                            <div className="text-4xl mr-4 group-hover:scale-110 transition-transform">💬</div>
                            <div className="flex-1">
                                <div className="font-bold text-lg">LINE公式アカウント</div>
                                <div className="text-sm opacity-75">@545ficux</div>
                            </div>
                            <div className="text-xl">→</div>
                        </a>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
