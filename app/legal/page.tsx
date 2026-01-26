"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Legal() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch('/api/data').then(res => res.json()).then(setData);
    }, []);

    if (!data) return null;
    const info = data.legalInfo;

    return (
        <main className="min-h-screen bg-white text-stone-800 p-8 md:p-24 font-sans leading-relaxed">
            <div className="max-w-2xl mx-auto">
                <Link href="/" className="text-stone-400 hover:text-stone-900 transition-colors mb-12 inline-block text-sm">← Back to Home</Link>
                <h1 className="text-2xl font-bold mb-12 border-b pb-4">特定商取引法に基づく表記</h1>
                <div className="space-y-10 text-sm">
                    <section>
                        <h2 className="font-bold text-stone-500 mb-2 uppercase text-xs">販売業者 / 事業者名</h2>
                        <p className="text-base">{info.businessName}</p>
                    </section>

                    {info.representativeName && (
                        <section>
                            <h2 className="font-bold text-stone-500 mb-2 uppercase text-xs">代表者名</h2>
                            <p className="text-base">{info.representativeName}</p>
                        </section>
                    )}

                    <section>
                        <h2 className="font-bold text-stone-500 mb-2 uppercase text-xs">所在地・連絡先</h2>
                        <p className="text-base whitespace-pre-wrap">{info.addressInfo}</p>
                    </section>

                    <section>
                        <h2 className="font-bold text-stone-500 mb-2 uppercase text-xs">お問い合わせ先</h2>
                        <p className="text-base">{info.contactEmail}</p>
                    </section>

                    {info.sellingPrice && (
                        <section>
                            <h2 className="font-bold text-stone-500 mb-2 uppercase text-xs">販売価格</h2>
                            <p className="text-base whitespace-pre-wrap">{info.sellingPrice}</p>
                        </section>
                    )}

                    {info.additionalCharges && (
                        <section>
                            <h2 className="font-bold text-stone-500 mb-2 uppercase text-xs">商品代金以外に必要な料金</h2>
                            <p className="text-base whitespace-pre-wrap">{info.additionalCharges}</p>
                        </section>
                    )}

                    {/* Grouped Payment Section */}
                    {(info.paymentMethod || info.paymentTiming) && (
                        <section>
                            <h2 className="font-bold text-stone-500 mb-4 uppercase text-xs">代金の支払時期および支払方法</h2>
                            <div className="space-y-6 pl-4 border-l-2 border-stone-100">
                                {info.paymentMethod && (
                                    <div>
                                        <h3 className="font-bold text-stone-700 mb-1 text-sm">支払方法</h3>
                                        <p className="text-base whitespace-pre-wrap">{info.paymentMethod}</p>
                                    </div>
                                )}
                                {info.paymentTiming && (
                                    <div>
                                        <h3 className="font-bold text-stone-700 mb-1 text-sm">支払時期</h3>
                                        <p className="text-base whitespace-pre-wrap">{info.paymentTiming}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className="font-bold text-stone-500 mb-2 uppercase text-xs">商品の引き渡し・サービス提供時期</h2>
                        <p className="text-base whitespace-pre-wrap">{info.shippingInfo}</p>
                    </section>

                    <section>
                        <h2 className="font-bold text-stone-500 mb-2 uppercase text-xs">返品・交換・キャンセルについて</h2>
                        <p className="text-base whitespace-pre-wrap">{info.returnPolicy}</p>
                    </section>
                </div>
            </div>
        </main>
    );
}
