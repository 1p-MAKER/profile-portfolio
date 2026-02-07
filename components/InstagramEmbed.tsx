"use client";

import { useEffect, useRef } from 'react';

export default function InstagramEmbed({ url }: { url: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    // URLからInstagramの投稿IDを抽出
    // 例: https://www.instagram.com/p/ABC123... -> ABC123
    const match = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
    const postId = match ? match[1] : null;

    useEffect(() => {
        // Instagram埋め込みスクリプトを読み込む
        if (typeof window !== 'undefined' && postId) {
            const script = document.createElement('script');
            script.src = 'https://www.instagram.com/embed.js';
            script.async = true;
            document.body.appendChild(script);

            // スクリプト読み込み後に処理を実行
            script.onload = () => {
                if ((window as unknown as { instgrm?: { Embeds?: { process?: () => void } } }).instgrm?.Embeds?.process) {
                    (window as unknown as { instgrm: { Embeds: { process: () => void } } }).instgrm.Embeds.process();
                }
            };
        }
    }, [postId]);

    if (!postId) {
        return (
            <div className="rounded-xl overflow-hidden border border-red-200 bg-red-50 aspect-square flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-xs text-red-500 font-bold mb-1">URL形式エラー</p>
                    <p className="text-[10px] text-red-400">
                        Instagram投稿URLを入力してください<br />
                        (プロフィールURLは不可)
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="rounded-xl overflow-hidden border border-stone-200 shadow-sm bg-white">
            <blockquote
                className="instagram-media"
                data-instgrm-captioned
                data-instgrm-permalink={`https://www.instagram.com/p/${postId}/`}
                data-instgrm-version="14"
                style={{
                    background: '#FFF',
                    border: 0,
                    borderRadius: '12px',
                    margin: 0,
                    padding: 0,
                    width: '100%',
                    maxWidth: '400px'
                }}
            />
        </div>
    );
}
