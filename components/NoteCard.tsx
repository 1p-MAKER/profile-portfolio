import Image from 'next/image';

interface NoteCardProps {
    title: string;
    url: string;
    imageUrl: string;
    siteName?: string;
}

export default function NoteCard({ title, url, imageUrl, siteName = 'note' }: NoteCardProps) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full group"
        >
            <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col border border-stone-200 dark:border-stone-700">
                <div className="relative aspect-[1.91/1] w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-stone-400">
                            No Image
                        </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-bold">
                        {siteName}
                    </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="font-bold text-stone-900 dark:text-stone-100 line-clamp-2 mb-2 text-base group-hover:text-accent transition-colors">
                        {title}
                    </h3>
                    <div className="flex items-center text-xs text-stone-500 dark:text-stone-400 mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        noteで読む
                    </div>
                </div>
            </div>
        </a>
    );
}
