import Link from 'next/link';


export default function Footer() {
    return (
        <footer className="w-full bg-stone-100 border-t border-stone-200 py-8 mt-12">
            <div className="container mx-auto px-4 flex flex-col items-center gap-4">
                <div className="flex gap-6">
                    <a
                        href="https://www.instagram.com/1pei_okinawa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-subtext hover:text-accent transition-colors"
                    >
                        Instagram
                    </a>
                    <a
                        href="https://x.com/DevCat123"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-subtext hover:text-accent transition-colors"
                    >
                        X (Twitter)
                    </a>
                </div>
                <p className="text-xs text-stone-400 text-center leading-relaxed">
                    © {new Date().getFullYear()} Dev cat&apos;s Studio & Office
                    <br className="md:hidden" />
                    <span className="hidden md:inline mx-2">|</span>
                    <Link href="/privacy" className="hover:text-stone-600 transition-colors">Privacy Policy</Link>
                    <span className="mx-2">|</span>
                    <Link href="/legal" className="hover:text-stone-600 transition-colors">特定商取引法に基づく表記</Link>
                    <span className="mx-2">|</span>
                    <Link href="/contact" className="hover:text-stone-600 transition-colors">Contact</Link>
                </p>

            </div>
        </footer>
    );
}
