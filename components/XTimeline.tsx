'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

interface XTimelineProps {
    xUsername: string;
}

export default function XTimeline({ xUsername }: XTimelineProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Twitterウィジェットスクリプトが読み込まれているか確認
        const loadWidget = () => {
            if (typeof window !== 'undefined' && (window as any).twttr) {
                const twttr = (window as any).twttr;
                if (containerRef.current && twttr.widgets) {
                    // 既存のウィジェットをクリア
                    containerRef.current.innerHTML = '';

                    // 新しいタイムラインウィジェットを作成
                    const anchor = document.createElement('a');
                    anchor.className = 'twitter-timeline';
                    anchor.setAttribute('data-theme', 'light');
                    anchor.setAttribute('data-height', '600');
                    anchor.setAttribute('data-chrome', 'noheader nofooter noborders');
                    anchor.href = `https://twitter.com/${xUsername}`;
                    anchor.textContent = `Tweets by ${xUsername}`;

                    containerRef.current.appendChild(anchor);

                    // ウィジェットを明示的に読み込み
                    twttr.widgets.load(containerRef.current);
                }
            }
        };

        // スクリプト読み込み後に少し待ってから実行
        const timer = setTimeout(loadWidget, 500);

        return () => clearTimeout(timer);
    }, [xUsername]);

    return (
        <>
            <Script
                src="https://platform.twitter.com/widgets.js"
                strategy="lazyOnload"
                onLoad={() => {
                    console.log('Twitter widgets.js loaded');
                }}
                onError={(e) => {
                    console.error('Failed to load Twitter widgets.js:', e);
                }}
            />
            <div className="x-timeline-container">
                <div ref={containerRef}>
                    <a
                        className="twitter-timeline"
                        data-theme="light"
                        data-height="600"
                        data-chrome="noheader nofooter noborders"
                        href={`https://twitter.com/${xUsername}`}
                    >
                        Tweets by {xUsername}
                    </a>
                </div>
                <style jsx>{`
                    .x-timeline-container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        min-height: 600px;
                        background: #fff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                `}</style>
            </div>
        </>
    );
}
