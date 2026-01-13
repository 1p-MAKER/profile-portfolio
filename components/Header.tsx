import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-stone-200">
            <div className="container mx-auto px-4 h-16 flex items-center justify-center">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-stone-200 shadow-sm">
                        <Image
                            src="/profile-icon.png"
                            alt="1pei"
                            fill
                            className="object-cover"
                            sizes="40px"
                        />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h1 className="text-lg font-bold leading-tight">長嶺 一平</h1>
                        <p className="text-xs text-subtext">ものづくりで貢献</p>
                    </div>
                </Link>
            </div>
        </header>
    );
}
