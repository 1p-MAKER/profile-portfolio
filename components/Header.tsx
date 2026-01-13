import Link from 'next/link';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-stone-200">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    {/* アイコンは一旦テキスト表示、または将来的に画像に差し替え */}
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                        1
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-tight">長嶺 一平</h1>
                        <p className="text-xs text-subtext">ものづくりで貢献</p>
                    </div>
                </Link>
                <nav>
                    {/* 必要に応じてナビゲーションを追加 */}
                </nav>
            </div>
        </header>
    );
}
