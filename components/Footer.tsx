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
                <p className="text-xs text-stone-400">
                    © {new Date().getFullYear()} 1p-MAKER / Dev cat&apos;s Archive
                    <span className="mx-2">|</span>
                    <a href="/privacy" className="hover:text-stone-600 transition-colors">Privacy Policy</a>
                    <span className="mx-2">|</span>
                    <a href="/contact" className="hover:text-stone-600 transition-colors">Contact</a>
                </p>
            </div>
        </footer>
    );
}
