import PortfolioContent from '@/components/PortfolioContent';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import fs from 'fs';
import path from 'path';
import { ContentData } from '@/types/content';
import { Metadata } from 'next';
import KusamuraGame from './KusamuraGame';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
    title: '草むらセンベロ創世記 | Dev cat\'s Studio & Office',
    description: 'リソースを管理して地球の質量を100%にするブラウザゲームです。',
};

async function getData() {
    const filePath = path.join(process.cwd(), 'data', 'content.json');
    try {
        const fileContents = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(fileContents) as ContentData;
    } catch (error) {
        console.error('Failed to load content.json:', error);
        return {} as ContentData;
    }
}

export default async function KusamuraPage() {
    const data = await getData();

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex flex-col pt-16 selection:bg-accent selection:text-white">
            <Header profileName={data.settings?.profileName} profileTagline={data.settings?.profileTagline} />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
                <KusamuraGame />
            </main>

            <Footer />
        </div>
    );
}
