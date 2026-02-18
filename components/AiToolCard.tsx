'use client';

import Image from 'next/image';

interface AiToolCardProps {
    title: string;
    description: string;
    url?: string;
    imageUrl?: string;
    onImageClick?: () => void;
}

export default function AiToolCard({ title, description, url, imageUrl, onImageClick }: AiToolCardProps) {
    const CardContent = () => (
        <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-stone-200 dark:border-stone-700 h-full flex flex-col group hover:-translate-y-1">
            {imageUrl ? (
                <div
                    className="relative w-full aspect-[1.91/1] bg-stone-100 dark:bg-stone-900 overflow-hidden cursor-pointer"
                    onClick={(e) => {
                        if (onImageClick) {
                            e.preventDefault(); // Prevent link navigation if inside an anchor
                            e.stopPropagation(); // Stop event bubbling
                            onImageClick();
                        }
                    }}
                >
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <span className="text-white font-bold text-shadow bg-black/30 px-2 py-1 rounded">拡大</span>
                    </div>
                </div>
            ) : (
                <div className="relative w-full aspect-[3/1] bg-stone-100 dark:bg-stone-900 flex items-center justify-center">
                    <span className="text-stone-400 text-sm font-bold">AI Tool</span>
                </div>
            )}

            <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-2 text-stone-900 dark:text-stone-100 group-hover:text-accent transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4 flex-grow whitespace-pre-wrap">
                    {description}
                </p>

                {url && (
                    <div className="mt-auto pt-4 flex items-center text-sm font-bold text-accent opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        Visit Site
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );

    if (url) {
        return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="block h-full">
                <CardContent />
            </a>
        );
    }

    return (
        <div className="h-full">
            <CardContent />
        </div>
    );
}
