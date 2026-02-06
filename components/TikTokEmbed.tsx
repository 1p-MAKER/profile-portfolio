"use client";

export default function TikTokEmbed({ url }: { url: string }) {
    // URLから動画ID(数字の羅列)を抽出するロジック
    // 例: https://www.tiktok.com/@user/video/1234567890... -> 1234567890
    const match = url.match(/video\/(\d+)/);
    const videoId = match ? match[1] : null;

    if (!videoId) {
        return (
            <div className="rounded-xl overflow-hidden border border-red-200 bg-red-50 aspect-[9/16] flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-xs text-red-500 font-bold mb-1">URL形式エラー</p>
                    <p className="text-[10px] text-red-400">
                        動画単体のURLを入力してください<br />
                        (プロフィールURLは不可)
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl overflow-hidden border border-stone-200 shadow-sm bg-black">
            <iframe
                src={`https://www.tiktok.com/embed/v2/${videoId}?lang=ja-JP`}
                className="w-full aspect-[9/16]"
                style={{ border: 'none' }}
                allow="encrypted-media;"
            ></iframe>
        </div>
    );
}
