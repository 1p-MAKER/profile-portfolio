'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // 開発環境のコンソールにもエラーを出力
        console.error('Global Error caught:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
            <div className="bg-red-50 p-8 rounded-2xl max-w-md w-full border border-red-100">
                <h2 className="text-xl font-bold mb-4 text-red-800">
                    読み込みエラーが発生しました
                </h2>
                <p className="text-stone-600 mb-6 text-sm leading-relaxed">
                    申し訳ありません。<br />
                    コンテンツの読み込み中に予期せぬ問題が発生しました。
                </p>
                <button
                    onClick={
                        // セグメントの再レンダリングを試行
                        () => reset()
                    }
                    className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold text-sm"
                >
                    もう一度読み込む
                </button>
            </div>
        </div>
    );
}
