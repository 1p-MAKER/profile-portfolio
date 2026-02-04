"use client";

import { useEffect, useState } from 'react';

export default function VisitorCounter() {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        // 開発環境(localhost)ではカウントアップさせないガード
        const isDev = process.env.NODE_ENV === 'development';

        // 一意のキー（名前空間）: devcats-portfolio-unique-id
        // ※本番で初めてアクセスされた時に自動でカウンターが生成されます
        const NAMESPACE = 'devcats-portfolio-v1';
        const KEY = 'visits';

        // APIを叩く（hit=カウントアップ, get=見るだけ）
        // counterapi.dev: get -> /v1/namespace/key, hit -> /v1/namespace/key/up
        const url = isDev
            ? `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}`
            : `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/up`;

        // スタート地点を2600にするためのオフセット（ユーザー要望）
        const INITIAL_OFFSET = 2600;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (typeof data.count === 'number') setCount(data.count + INITIAL_OFFSET);
            })
            .catch(err => {
                console.error('Counter Error:', err);
                // エラー時は何も表示しない（サイトのデザインを壊さないため）
            });
    }, []);

    if (count === null) return null; // 読み込み中は何も表示しない

    // 6桁のゼロ埋め
    const formattedCount = (count).toString().padStart(6, '0');

    return (
        <div className="flex flex-col items-center mt-4">
            <div className="text-[10px] text-stone-400 mb-1 font-bold tracking-widest">TOTAL VISITS</div>
            <div className="inline-flex bg-black p-1 rounded border-2 border-stone-300 shadow-inner">
                {formattedCount.split('').map((digit, index) => (
                    <span
                        key={index}
                        className="
                            inline-flex items-center justify-center 
                            w-4 h-6 mx-[1px]
                            bg-gradient-to-b from-[#222] to-[#111]
                            text-[#0f0] font-mono text-sm font-bold
                            border border-[#333] rounded-[1px]
                            shadow-[0_0_2px_#0f0]
                            relative overflow-hidden
                        "
                    >
                        {/* デジタル管のような走査線エフェクト */}
                        <span className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10"></span>
                        {digit}
                    </span>
                ))}
            </div>
        </div>
    );
}
