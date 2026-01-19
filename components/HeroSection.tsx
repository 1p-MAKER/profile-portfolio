import Image from 'next/image';

interface HeroSectionProps {
    profileName?: string;
    profileTagline?: string;
    featuredIntro?: string;
}

export default function HeroSection({ profileName, profileTagline, featuredIntro }: HeroSectionProps) {
    return (
        <section className="flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Text Content */}
            <div className="flex-1 space-y-6 text-center md:text-left">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-800 dark:text-stone-100">
                        {profileName || "長嶺 一平"}
                    </h1>
                    <p className="text-xl text-accent font-medium">
                        {profileTagline || "Web Developer / Creator"}
                    </p>
                </div>

                {featuredIntro && (
                    <div className="prose dark:prose-invert max-w-none text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                        {featuredIntro}
                    </div>
                )}
            </div>

            {/* Profile Image */}
            <div className="flex-shrink-0">
                <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 transform transition-transform hover:scale-105 duration-500">
                    <Image
                        src="/profile/profile.jpg"
                        alt={profileName || "Profile"}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 256px, 256px"
                        onError={(e) => {
                            // Fallback if image doesn't exist (handled via CSS/default logic mostly, but Next.js needs valid src)
                            // We assume the file exists or will be uploaded. 
                            // Using a data URL or placeholder could be an option if strictly needed, 
                            // but for now we stick to the requested path.
                            const target = e.target as HTMLImageElement;
                            target.src = '/profile-icon.png'; // Fallback to icon if main profile missing
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
