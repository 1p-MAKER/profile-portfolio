import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import Footer from '@/components/Footer';

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
          <Footer />
        </div>
      </body >
    </html >
  );
}
