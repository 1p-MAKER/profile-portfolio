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
        // 本番環境ならhit、開発環境ならgetにする
        const action = isDev ? 'get' : 'hit';

        fetch(`https://api.countapi.xyz/${action}/${NAMESPACE}/${KEY}`)
            .then(res => res.json())
            .then(data => {
                if (data.value) setCount(data.value);
            })
            .catch(err => {
                console.error('Counter Error:', err);
                // エラー時は何も表示しない（サイトのデザインを壊さないため）
            });
    }, []);

    if (count === null) return null; // 読み込み中は何も表示しない

    return (
        <span className="inline-block ml-4 pl-4 border-l border-stone-200 text-[10px] text-stone-300 font-mono tracking-widest">
            TOTAL VISITS: {count.toLocaleString()}
        </span>
    );
}
