"use client";

import { useEffect, useState } from 'react';

export default function VisitorCounter() {
    const [count, setCount] = useState<number | null>(null);
    const [yesterdayCount, setYesterdayCount] = useState<number | null>(null);

    useEffect(() => {
        const isDev = process.env.NODE_ENV === 'development';
        const NAMESPACE = 'devcats-portfolio-v1';
        const KEY_TOTAL = 'visits';
        const INITIAL_OFFSET = 2600;

        // JSTで今日と昨日の日付キーを生成
        const getJstDate = (offsetDays = 0) => {
            const now = new Date();
            // UTC時刻を取得
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            // JST (+9時間) に変換し、offsetDays分ずらす
            const jstTime = utc + (9 * 60 * 60 * 1000) + (offsetDays * 24 * 60 * 60 * 1000);
            return new Date(jstTime);
        };

        const formatDateKey = (date: Date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `visits_${y}-${m}-${d}`;
        };

        const todayJst = getJstDate(0);
        const yesterdayJst = getJstDate(-1);

        const KEY_TODAY = formatDateKey(todayJst);
        const KEY_YESTERDAY = formatDateKey(yesterdayJst);

        // API URL生成
        // Total: dev環境以外ならカウントアップ
        const urlTotal = isDev
            ? `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY_TOTAL}`
            : `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY_TOTAL}/up`;

        // Today: dev環境以外ならカウントアップ (今日の訪問者数として個別に記録)
        const urlToday = isDev
            ? `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY_TODAY}`
            : `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY_TODAY}/up`;

        // Yesterday: 取得のみ (カウントアップしない)
        const urlYesterday = `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY_YESTERDAY}`;


        // Total Fetch
        fetch(urlTotal)
            .then(res => res.json())
            .then(data => {
                if (typeof data.count === 'number') setCount(data.count + INITIAL_OFFSET);
            })
            .catch(err => console.error('Total Counter Error:', err));

        // Today Fetch (Inc)
        fetch(urlToday)
            .then(res => res.json())
            .catch(err => {
                // Todayキーがない場合(その日最初のアクセス)は作成されるはずだが、エラーなら無視
                console.error('Today Counter Error:', err);
            });

        // Yesterday Fetch
        fetch(urlYesterday)
            .then(res => res.json())
            .then(data => {
                if (typeof data.count === 'number') {
                    setYesterdayCount(data.count);
                } else {
                    setYesterdayCount(0); // キーがない場合は0
                }
            })
            .catch(err => {
                console.error('Yesterday Counter Error:', err);
                setYesterdayCount(0);
            });

    }, []);

    if (count === null) return null;

    const formattedCount = (count).toString().padStart(6, '0');
    // 昨日が0やnullの場合も0を表示
    const formattedYesterday = (yesterdayCount ?? 0).toString().padStart(4, '0');

    // デジタル数字のレンダリング関数
    const renderDigit = (digit: string, index: number, small = false) => (
        <span
            key={index}
            className={`
                inline-flex items-center justify-center 
                ${small ? 'w-3 h-4 text-[10px]' : 'w-4 h-6 text-sm'} mx-[1px]
                bg-gradient-to-b from-[#222] to-[#111]
                text-[#0f0] font-mono font-bold
                border border-[#333] rounded-[1px]
                shadow-[0_0_2px_#0f0]
                relative overflow-hidden
            `}
        >
            <span className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10"></span>
            {digit}
        </span>
    );

    return (
        <div className="flex flex-row items-end gap-3 mt-4 select-none">
            {/* TOTAL */}
            <div className="flex flex-col items-center md:items-start text-[10px] text-stone-400 font-bold tracking-widest">
                <div className="mb-1">TOTAL</div>
                <div className="inline-flex bg-black p-1 rounded border-2 border-stone-300 shadow-inner">
                    {formattedCount.split('').map((d, i) => renderDigit(d, i))}
                </div>
            </div>

            {/* YESTERDAY */}
            <div className="flex flex-col items-center md:items-start text-[9px] text-stone-500 font-bold tracking-widest mb-0.5">
                <div className="mb-0.5">YESTERDAY</div>
                <div className="inline-flex bg-black p-0.5 rounded border border-stone-400 shadow-inner opacity-80">
                    {formattedYesterday.split('').map((d, i) => renderDigit(d, i, true))}
                </div>
            </div>
        </div>
    );
}
