"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Legal() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch('/api/content').then(res => res.json()).then(setData);
    }, []);

    if (!data) return null;
    const info = data.legalInfo;

    return (
        <main className="min-h-screen bg-white text-stone-800 p-8 md:p-24 font-sans leading-relaxed">
            <div className="max-w-2xl mx-auto">
                <Link href="/" className="text-stone-400 hover:text-stone-900 transition-colors mb-12 inline-block text-sm">← Back to Home</Link>
                <h1 className="text-2xl font-bold mb-12 border-b pb-4">特定商取引法に基づく表記</h1>
                <div className="space-y-10 text-sm">
                    <section><h2 className="font-bold text-stone-500 mb-2 uppercase text-xs">販売業者</h2><p className="text-base">{info.businessName}</p></section>
                    <section><h2 className="font-bold text-stone-500 mb-2 uppercase text-xs">所在地・連絡先</h2><p className="text-stone-400 text-xs">{info.addressInfo}</p></section>
                    <section><h2 className="font-bold text-stone-500 mb-2 uppercase text-xs">お問い合わせ先</h2><p className="text-base">{info.contactEmail}</p></section>
                    <section><h2 className="font-bold text-stone-500 mb-2 uppercase text-xs">商品の引き渡し時期</h2><p className="text-base">{info.shippingInfo}</p></section>
                    <section><h2 className="font-bold text-stone-500 mb-2 uppercase text-xs">返品・交換・キャンセル</h2><p className="text-base">{info.returnPolicy}</p></section>
                </div>
            </div>
        </main>
    );
}
