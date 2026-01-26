import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const noto = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto" });

export const metadata: Metadata = {
  title: "Dev cat's Studio & Office | 長嶺一平",
  description: "iOSアプリ開発者・革製品作家のポートフォリオサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${noto.variable} font-sans antialiased bg-stone-50`}>
        <div className="min-h-screen flex flex-col">
          <div className="flex-grow">
            {children}
          </div>
          <footer className="py-10 text-center border-t border-stone-200 bg-white">
            <Link href="/legal" className="text-[10px] text-stone-400 hover:text-stone-900 transition-colors">
              特定商取引法に基づく表記
            </Link>
            <p className="text-[10px] text-stone-300 mt-2">&copy; {new Date().getFullYear()} Dev cat&apos;s Studio & Office</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
