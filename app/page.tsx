import PortfolioContent from '@/components/PortfolioContent';
import Header from '@/components/Header';
import { promises as fs } from 'fs';
import path from 'path';

// Force dynamic rendering to ensure fresh data on every request
export const dynamic = 'force-dynamic';

async function getData() {
  const jsonDirectory = path.join(process.cwd(), 'data');
  try {
    const fileContents = await fs.readFile(path.join(jsonDirectory, 'content.json'), 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to read content data:', error);
    // Fallback to empty structure if file is missing (though it shouldn't be)
    return {
      leatherProducts: [],
      iosAppIds: [],
      shopifyApps: [],
      snsAccounts: [],
      printImages: [],
      settings: {}
    };
  }
}

export default async function Home() {
  const data = await getData();
  return (
    <>
      <Header profileName={data.settings?.profileName} profileTagline={data.settings?.profileTagline} />
      <PortfolioContent data={data} />
    </>
  );
}
