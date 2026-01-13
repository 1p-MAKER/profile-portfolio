import Image from 'next/image';

interface FurusatoCardProps {
    title: string;
    url: string;
    imageUrl: string;
    siteName?: string;
}

export default function FurusatoCard({ title, url, imageUrl, siteName }: FurusatoCardProps) {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block group h-full">
            <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg h-full flex flex-col">
                <div className="relative aspect-[1.91/1] w-full bg-stone-100 dark:bg-stone-900 overflow-hidden">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                            No Image
                        </div>
                    )}
                    {siteName && (
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full">
                            {siteName}
                        </div>
                    )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-sm md:text-base leading-snug group-hover:text-accent transition-colors line-clamp-3">
                        {title}
                    </h3>
                    <div className="mt-auto pt-3 flex items-center text-xs text-subtext">
                        <span className="truncate">{new URL(url).hostname}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 ml-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </div>
                </div>
            </div>
        </a>
    );
}
