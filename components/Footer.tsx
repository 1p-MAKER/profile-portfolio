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
                <p className="text-xs text-subtext copy-right">
                    &copy; {new Date().getFullYear()} Ippei Nagamine. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
