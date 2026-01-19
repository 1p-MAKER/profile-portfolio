'use client';

import { AudioTrack } from '@/types/content';

interface AudioCardProps {
    track: AudioTrack;
}

export default function AudioCard({ track }: AudioCardProps) {
    if (!track || !track.url) {
        return null; // データ不備時は何も表示しない
    }

    return (
        <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-700 hover:shadow-lg transition-all duration-300 p-6">
            <h3 className="font-bold text-lg mb-2">{track.title}</h3>

            {track.description && (
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                    {track.description}
                </p>
            )}

            <audio
                controls
                className="w-full"
                preload="metadata"
            >
                <source src={track.url} type="audio/mpeg" />
                お使いのブラウザは音声再生に対応していません。
            </audio>
        </div>
    );
}
