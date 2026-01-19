'use client';

interface YouTubeEmbedProps {
    url: string;
}

export default function YouTubeEmbed({ url }: YouTubeEmbedProps) {
    const extractVideoId = (url: string): string | null => {
        const patterns = [
            /youtube\.com\/watch\?v=([^&]+)/,
            /youtu\.be\/([^?]+)/,
            /youtube\.com\/embed\/([^?]+)/,
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        return null;
    };

    const videoId = extractVideoId(url);

    if (!videoId) {
        return (
            <div className="w-full aspect-video bg-stone-100 dark:bg-stone-800 rounded-xl flex items-center justify-center">
                <p className="text-stone-500 dark:text-stone-400">無効なYouTube URLです</p>
            </div>
        );
    }

    return (
        <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-xl shadow-md"
            ></iframe>
        </div>
    );
}
