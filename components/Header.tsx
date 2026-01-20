import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
    profileName?: string;
    profileTagline?: string;
}

export default function Header({ profileName, profileTagline }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-stone-200">
            <div className="container mx-auto px-4 h-14 flex items-center justify-center">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-stone-200 shadow-sm shrink-0">
                        <Image
                            src="/profile-icon.png"
                            alt={profileName || "1pei"}
                            fill
                            className="object-cover"
                            sizes="40px"
                        />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-baseline gap-0 md:gap-2">
                        <h1 className="text-base md:text-lg font-bold leading-tight">{profileName || "長嶺 一平"}</h1>
                        <p className="text-[10px] md:text-xs text-subtext hidden md:block">{profileTagline || "ものづくりで貢献"}</p>
                    </div>
                </Link>
            </div>
        </header>
    );
}
