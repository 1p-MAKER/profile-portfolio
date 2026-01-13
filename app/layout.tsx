import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const noto = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Profile & Portfolio | 1pei',
  description: 'iOSアプリ開発者・革製品作家のポートフォリオサイト',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${noto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
