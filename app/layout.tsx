import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { promises as fs } from 'fs';
import path from 'path';

const noto = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(path.join(jsonDirectory, 'content.json'), 'utf8');
    const data = JSON.parse(fileContents);

    return {
      title: data.settings?.siteTitle || 'Profile & Portfolio | 1pei',
      description: 'iOSアプリ開発者・革製品作家のポートフォリオサイト',
      manifest: '/manifest.json',
      icons: {
        icon: '/icon-192.png',
        apple: '/apple-touch-icon.png',
      },
      appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: data.settings?.siteTitle || '1pei',
      },
    };
  } catch (error) {
    console.error('Failed to read content data for metadata:', error);
    return {
      title: 'Profile & Portfolio | 1pei',
      description: 'iOSアプリ開発者・革製品作家のポートフォリオサイト',
    };
  }
}

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
