import Link from 'next/link';

interface SimpleCardProps {
    title: string;
    description: string;
    url: string;
    category: string;
}

export default function SimpleCard({ title, description, url, category }: SimpleCardProps) {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block group h-full">
            <div className="bg-white dark:bg-stone-800 rounded-2xl p-8 border border-stone-200 dark:border-stone-700 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg h-full flex flex-col items-start hover:border-accent/30">
                <span className="inline-block text-[10px] bg-stone-100 dark:bg-stone-700 px-2 py-0.5 rounded-full text-subtext uppercase tracking-wider mb-4 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                    {category}
                </span>
                <h3 className="font-bold text-xl mb-3 group-hover:text-accent transition-colors">{title}</h3>
                <p className="text-sm text-subtext leading-relaxed">{description}</p>

                <div className="mt-auto pt-6 flex items-center text-sm font-medium text-accent opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </div>
            </div>
        </a>
    );
}
