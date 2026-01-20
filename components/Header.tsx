import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
    profileName?: string;
    profileTagline?: string;
}

export default function Header({ profileName, profileTagline }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-stone-200">
            <div className="container mx-auto px-2 h-12 flex items-center justify-between md:justify-center">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="relative w-7 h-7 md:w-10 md:h-10 rounded-full overflow-hidden border border-stone-200 shadow-sm shrink-0">
                        <Image
                            src="/profile-icon.png"
                            alt={profileName || "1pei"}
                            fill
                            className="object-cover"
                            sizes="40px"
                        />
                    </div>
                    <div className="flex flex-row items-baseline gap-2">
                        <h1 className="text-sm md:text-lg font-bold leading-tight whitespace-nowrap">{profileName || "長嶺 一平"}</h1>
                        <p className="text-[10px] md:text-xs text-subtext truncate max-w-[120px] md:max-w-none">{profileTagline || "ものづくりで貢献"}</p>
                    </div>
                </Link>
            </div>
        </header>
    );
}
